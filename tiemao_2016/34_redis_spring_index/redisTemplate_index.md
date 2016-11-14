# 在Spring-data-Redis中如何使用特定的库?



我们知道，Redis默认有16个库,默认连接的是 `index=0` 的那一个。这16个库互相之间是独立的。类似于同一个MySQL服务器下面的多个数据库一样。

在命令行中可以很方便的切换. 具体消息请参考: [http://www.ttlsa.com/redis/redis-database/](http://www.ttlsa.com/redis/redis-database/)

```
select 2
```

那么在spring之中怎么配置呢?

当然，可以使用 `RedisConnectionCommands` 来进行手工切换:

```
redisConnection.select(6);
```

但很不方便。准备找一下在配置文件之中如何切换。于是找到了 `JedisConnectionFactory` 配置项。

完成后的配置信息如下:

```
<!-- jedis的连接工厂 -->
<bean id="connectionFactory"
      class="org.springframework.data.redis.connection.jedis.JedisConnectionFactory">
    <property name="hostName" value="${redis.host}"/>
    <property name="port" value="${redis.port}"/>
    <property name="database" value="${redis.database}"/>
    <property name="password" value="${redis.pass}"/>
    <property name="poolConfig" ref="poolConfig"/>
</bean>
```

可以看到,使用的是 `database` 这个字段 (一般有效值是 0~15; 看服务器配置)。点进去之后，看到的代码类似下面这样:

```
/**
 * Sets the index of the database used by this connection factory. Default is 0.
 * 
 * @param index database index
 */
public void setDatabase(int index) {
   Assert.isTrue(index >= 0, "invalid DB index (a positive index required)");
   this.dbIndex = index;
}
```

当然，意思就是默认的`dbIndex`为0;

完整的配置信息如下:

> spring-redis.xml

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

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
    <bean id="connectionFactory"
          class="org.springframework.data.redis.connection.jedis.JedisConnectionFactory">
        <property name="hostName" value="${redis.host}"/>
        <property name="port" value="${redis.port}"/>
        <property name="database" value="${redis.database}"/>
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
    <!--spring session 的redis配置-->
    <bean class="org.springframework.session.data.redis.config.annotation.web.http.RedisHttpSessionConfiguration"/>

</beans>
```

配置测试通过,其实查找一下源码也挺简单。

