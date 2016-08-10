# 解决Spring-Session 的 notify-keyspace-events 错误


spring-session中间件需要依赖redis2.8.0以上版本，并且需要开启：`notify-keyspace-events  gxE`；


## 问题描述

如果spring-session使用的是redis集群环境，且redis集群环境没有开启Keyspace notifications功能，则应用启动时会抛出如下异常：


	org.springframework.beans.factory.BeanCreationException: 
	Error creating bean with name 'enableRedisKeyspaceNotificationsInitializer' defined in class path resource 
	[org/springframework/session/data/redis/config/annotation/web/http/RedisHttpSessionConfiguration.class]: 
	Invocation of init method failed;


在错误提示中给出了解决方案的地址: [http://docs.spring.io/spring-session/docs/current/reference/html5/#api-redisoperationssessionrepository-sessiondestroyedevent](http://docs.spring.io/spring-session/docs/current/reference/html5/#api-redisoperationssessionrepository-sessiondestroyedevent)

打开之后,看到的是 **SessionDeletedEvent and SessionExpiredEvent** 这一节。

原文提示信息如下:

> If you are using @EnableRedisHttpSession the SessionMessageListener and enabling the necessary Redis Keyspace events is done automatically. However, in a secured Redis enviornment the config command is disabled. This means that Spring Session cannot configure Redis Keyspace events for you. To disable the automatic configuration add ConfigureRedisAction.NO_OP as a bean.

其中有一句: **However, in a secured Redis enviornment the config command is disabled**;

意思是说, 在受保护的Redis环境中, `config` 命令被禁用了。

比如阿里云的redis, 不支持配置 `notify-keyspace-events`,也不支持 `config` 指令。

AWS 的 redis 也不支持 `config` 指令, 但可以配置 `notify-keyspace-events`。


根据其中的内容, 搜索 `enableRedisKeyspaceNotificationsInitializer` 之后,已成功解决。

## 解决方案: 

XML 配置文件之中加上:

	<util:constant
	    static-field="org.springframework.session.data.redis.config.ConfigureRedisAction.NO_OP"/>

在Spring-Context中配置一个Bean实例。 意思是让Spring-Session不要主动去更改Redis的配置(发送 config 指令); 

当然, 这里引入了 `util:` 命名空间;  XML文件头信息如下:



```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:util="http://www.springframework.org/schema/util"
       xsi:schemaLocation="
       http://www.springframework.org/schema/beans 
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/util
       http://www.springframework.org/schema/util/spring-util.xsd
       ">
```



当然, 这样做之后,会有一点点很的性能损耗, Redis之中的键过期,Spring-Session就不能主动感知, 在过期的会话再次访问时,会去查询一次库。一般来说也没有什么问题。


如果采用Java类配置的方式，可以使用如下方式: 

	@Bean
	public static ConfigureRedisAction configureRedisAction() {
	    return ConfigureRedisAction.NO_OP;
	}



## 相关链接



- [键空间通知-中文翻译: http://redisdoc.com/topic/notification.html](http://redisdoc.com/topic/notification.html)
- [Redis Keyspace Notifications-EN: http://redis.io/topics/notifications](http://redis.io/topics/notifications)
- [http://blog.csdn.net/bbirdsky/article/details/50407736](http://blog.csdn.net/bbirdsky/article/details/50407736)




关键字: `notify-keyspace-events`; `Spring-Session`



时间: 2016年8月10日