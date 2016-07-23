# 解决Spring-Session不支持Servlet3.0异步回调的问题

对于简单的分布式应用, Spring-session是一个简单的神器。 

简单来说，不需要额外写什么代码，简单配置一下，单机版就能变成集群版。

关于 Spring-session的介绍，请参考:  [通过Spring Session实现新一代的Session管理](http://www.infoq.com/cn/articles/Next-Generation-Session-Management-with-Spring-Session)





> pom.xml 文件配置如下:



```
<!-- spring.session -->
<dependency>
    <groupId>org.springframework.session</groupId>
    <artifactId>spring-session</artifactId>
    <version>1.2.0.RELEASE</version>
</dependency>
```

当然,一般是使用 Redis,:

```
<!-- redis -->
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-redis</artifactId>   
    <version>1.6.4.RELEASE</version>
    <scope>compile</scope>
</dependency>
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>2.8.0</version>
</dependency>
```



> 但是Redis和Mongo这两个玩具的客户端API经常变动,如果版本号变了那么可能API什么的也要相应修改。



> spring-session.xml 文件摘录如下:



```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--jedis的连接池配置-->
    <bean id="poolConfig" class="redis.clients.jedis.JedisPoolConfig">
        <property name="maxIdle" value="${redis.maxIdle}"/>
        <property name="minIdle" value="1"/>
        <property name="maxTotal" value="100"/>
        <property name="maxWaitMillis" value="${redis.maxWait}"/>
        <property name="testOnBorrow" value="${redis.testOnBorrow}"/>
        <property name="testWhileIdle" value="true"/>
        <property name="minEvictableIdleTimeMillis" value="${redis.minEvictableIdleTimeMillis}"/>
        <property name="timeBetweenEvictionRunsMillis" value="${redis.timeBetweenEvictionRunsMillis}"/>
    </bean>
    <!-- jedis的连接工厂 -->
    <bean id="connectionFactory" class="org.springframework.data.redis.connection.jedis.JedisConnectionFactory">
        <property name="hostName" value="${redis.host}"/>
        <property name="port" value="${redis.port}"/>
        <property name="password" value="${redis.pass}"/>
        <property name="poolConfig" ref="poolConfig"/>
    </bean>
    <!--redis实际使用的template-->
    <bean id="redisTemplate" class="org.springframework.data.redis.core.RedisTemplate">
        <property name="connectionFactory" ref="connectionFactory"/>
        <property name="keySerializer">
            <bean class="org.springframework.data.redis.serializer.StringRedisSerializer"/>
        </property>
        <property name="valueSerializer">
            <bean class="org.springframework.data.redis.serializer.JdkSerializationRedisSerializer"/>
        </property>
    </bean>
    <!--spring cache的redis封装-->
    <bean id="redisManager" class="com.ybs.exam.cache.RedisManagerImpl">
        <property name="redisTemplate" ref="redisTemplate"/>
    </bean>
    <!--spring session 的redis配置-->
    <bean class="org.springframework.session.data.redis.config.annotation.web.http.RedisHttpSessionConfiguration"/>

</beans>
```



> web.xml 文件信息如下：



```
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath:spring/applicationContext.xml</param-value>
</context-param>
<listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>

<!-- springSession -->
<filter>
    <filter-name>springSessionRepositoryFilter</filter-name>
    <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
    <async-supported>true</async-supported>
</filter>
<filter-mapping>
    <filter-name>springSessionRepositoryFilter</filter-name>
    <url-pattern>/*</url-pattern>
    <dispatcher>REQUEST</dispatcher>
    <dispatcher>ERROR</dispatcher>
</filter-mapping>
```



记得在 web.xml 中配置的Filter需要加上 `<async-supported>true</async-supported>` 配置. 或者使用注解时也需要指定属性

```
@WebFilter(value="/", asyncSupported=true)
```

否则执行异步调用时会报错。

```
@WebServlet(value="/api/useroperation/*", asyncSupported=true)
public class UserOperationServlet extends BaseAsyncServlet {
...
```



用 Btrace简单跟踪了一下:



```
/* BTrace Script Template */
import com.sun.btrace.annotations.*;
import static com.sun.btrace.BTraceUtils.*;
@BTrace
public class TracingScript {

    @OnMethod(clazz = "org.springframework.web.filter.DelegatingFilterProxy", method = "invokeDelegate", location = @Location(Kind.RETURN))
    public static void on_invokeDelegate_end() {
	println("invokeDelegate method end!");
    }

    @OnMethod(clazz = "com.cncounter.web.servlet.base.BaseServlet", method = "saveSessionUser", location = @Location(Kind.RETURN))
    public static void on_saveSessionUser_end() {
	println("saveSessionUser!");
    }
}
```



看到打印的消息总是这样：

	invokeDelegate method end!
	saveSessionUser!

这说明Filter在异步Servlet方法执行之前就已经返回了，自然，在异步方法之中写入的session值就没有保存的机会。。。



```
public class SessionRepositoryFilter<S extends ExpiringSession> 
	extends OncePerRequestFilter {
    protected void doFilterInternal(...){
        try {
            filterChain.doFilter(strategyRequest, strategyResponse);
        } finally {
            wrappedRequest.commitSession();
        }
    }
    private final class SessionRepositoryRequestWrapper
    extends HttpServletRequestWrapper {
    
        private void commitSession() {
           HttpSessionWrapper wrappedSession = this.getCurrentSession();
            if(wrappedSession == null) {
                if(this.isInvalidateClientSession()) {
                   httpSessionStrategy.onInvalidateSession(this, this.response);
                }
            } else {
                ExpiringSession session = wrappedSession.getSession();
                sessionRepository.save(session);
                if(!this.isRequestedSessionIdValid() .........) {
                   onNewSession(session, this, this.response);
                }
            }

        }
    }
}
```



解决方案大致如下:

```
public static void saveSessionUser(HttpServletRequest request, LoginUserVO userVO){
    HttpSession session = request.getSession(true);
    request.getSession().setAttribute(KEY_LOGINUSER, userVO);
    // 解决 异步Servlet无法保存spring-session的问题
    Class<?> clazz = request.getClass();
    try {
        Method method = clazz.getDeclaredMethod("commitSession",new Class[]{});
        method.setAccessible(true);
        method.invoke(request);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

有点简单粗暴。。。只用一个 `catch (Exception e)` 将异常打印出来。



关键字: `asyncSupported` ；`AsyncContext`；`startAsync`；`Spring-Session`；`支持`；`Servlet3.0`



日期: 2016年7月23日













