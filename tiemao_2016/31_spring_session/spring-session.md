# Spring-session示例




> pom.xml


    <properties>
        <spring.version>4.0.7.RELEASE</spring.version>
        <spring.data.redis.version>1.4.0.RELEASE</spring.data.redis.version>
        <jedis.version>2.5.2</jedis.version>
        <spring.session.version>1.2.0.RELEASE</spring.session.version>
    </properties>


    <dependencies>

        <!-- redis客户端,使用缓存 -->
        <dependency>
            <groupId>redis.clients</groupId>
            <artifactId>jedis</artifactId>
            <version>${jedis.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.data</groupId>
            <artifactId>spring-data-redis</artifactId>
            <version>${spring.data.redis.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.session</groupId>
            <artifactId>spring-session</artifactId>
            <version>${spring.session.version}</version>
        </dependency>

    </dependencies>


> web.xml

	<web-app>
		<!-- Spring启动监听 -->
		<context-param> 
			<param-name>contextConfigLocation</param-name>
			<param-value>classpath:spring/applicationContext.xml</param-value>  
		</context-param> 

		<listener> 
			<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class> 
		</listener>

		<filter>
			<filter-name>springSessionRepositoryFilter</filter-name>
			<filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
		</filter>
		<filter-mapping>
			<filter-name>springSessionRepositoryFilter</filter-name>
			<url-pattern>/*</url-pattern>
			<dispatcher>REQUEST</dispatcher>
			<dispatcher>ERROR</dispatcher>
		</filter-mapping>

	</web-app>


测试代码:


	protected Log logger = LogFactory.getLog(this.getClass());


        //
        Object calltimes = request.getSession().getAttribute("calltimes");
        if(calltimes instanceof Integer){
            calltimes = (Integer)calltimes + 1;
        } else {
            calltimes = 0;
        }
        //
        request.getSession().setAttribute("calltimes", calltimes);



测试通过.

GitHub 源码:

https://github.com/cncounter/cncounter/blob/v0.0.3/cncounter-manage/pom.xml








> applicationContext.xml

	<beans xmlns="http://www.springframework.org/schema/beans"
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xmlns:context="http://www.springframework.org/schema/context"
		xsi:schemaLocation="
			http://www.springframework.org/schema/beans
			http://www.springframework.org/schema/beans/spring-beans-4.0.xsd
			http://www.springframework.org/schema/context 
			http://www.springframework.org/schema/context/spring-context-4.0.xsd">



		<!-- Activates annotation-based bean configuration -->
		<context:annotation-config />

		<!-- 引入属性文件 -->
		<context:property-placeholder ignore-unresolvable="true" location="classpath:config/*.properties" />

		<import resource="classpath:spring/spring-redis.xml"/>
		<import resource="classpath:spring/spring-session.xml"/>


	</beans>


> spring-redis.xml


	<?xml version="1.0" encoding="UTF-8"?>
	<beans xmlns="http://www.springframework.org/schema/beans"
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xsi:schemaLocation="
			http://www.springframework.org/schema/beans
			http://www.springframework.org/schema/beans/spring-beans-4.0.xsd">

	    <!-- redis 配置 -->
	    <bean id="poolConfig" class="redis.clients.jedis.JedisPoolConfig">
		<property name="maxIdle" value="${redis.maxIdle}" />
		<property name="maxTotal" value="${redis.maxTotal}" />
		<property name="maxWaitMillis" value="${redis.maxWaitMillis}" />
		<property name="testOnBorrow" value="${redis.testOnBorrow}" />
	    </bean>
	    <bean id="jedisConnFactory"
		  class="org.springframework.data.redis.connection.jedis.JedisConnectionFactory">
		<property name="hostName" value="${redis.host}"></property>
		<property name="port" value="${redis.port}"></property>
		<property name="password" value="${redis.pass}"></property>
		<property name="poolConfig" ref="poolConfig"></property>
	    </bean>
	    <bean id="redisTemplate" class="org.springframework.data.redis.core.RedisTemplate">
		<property name="connectionFactory" ref="jedisConnFactory" />
	    </bean>
	</beans>


> spring-session.xml


	<?xml version="1.0" encoding="UTF-8"?>
	<beans xmlns="http://www.springframework.org/schema/beans"
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xsi:schemaLocation="
			http://www.springframework.org/schema/beans
			http://www.springframework.org/schema/beans/spring-beans-4.0.xsd">

	    <bean class="org.springframework.session.data.redis.config.annotation.web.http.RedisHttpSessionConfiguration"/>

	</beans>





