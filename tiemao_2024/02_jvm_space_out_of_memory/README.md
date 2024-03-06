# 一次堆内存溢出的问题排查


产生 java.lang.OutOfMemoryError: Java heap space 错误的原因和相关知识点, 请参考:

> [OutOfMemoryError系列（1）: Java heap space](https://renfufei.blog.csdn.net/article/details/76350794)


## 问题背景

今天早上, 收到一堆钉钉异常告警, 大致内容如下:

```java
2024-02-21 08:21:29.895

handle RuntimeException. context={}; return result:{"code":500,"success":false}
[Cause_1] -> NestedServletException : Handler dispatch failed; nested exception is java.lang.OutOfMemoryError: Java heap space
[Cause_2] -> OutOfMemoryError : Java heap space


2024-02-21 08:21:28.458

Failed to complete processing of a request
[Cause_1] -> OutOfMemoryError : Java heap space


...


2024-02-21 08:21:29.894

Uncaught exception in thread 'kafka-producer-network-thread | producer-1':
[Cause_1] -> OutOfMemoryError : Java heap space


2024-02-21 08:21:29.895

handle RuntimeException. context={}; return result:{"code":500,"success":false}
[Cause_1] -> NestedServletException : Handler dispatch failed; nested exception is java.lang.OutOfMemoryError: Java heap space
[Cause_2] -> OutOfMemoryError : Java heap space


2024-02-21 08:21:29.975

Failed to complete processing of a request
[Cause_1] -> OutOfMemoryError : Java heap space

```

## 相关代码


可以使用LogBack的自定义Appender, 将错误日志输出到Dingding之类的即时消息通信软件.

> Maven配置: pom.xml


> 日志配置: logback.xml 


```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>
    <include resource="org/springframework/boot/logging/logback/console-appender.xml"/>

    <springProperty name="APP_NAME" source="info.app.name" defaultValue="NOT_SET"/>
    <springProperty name="ENV_NAME" source="info.env.name" defaultValue="NOT_SET"/>

    <appender name="alertAppender" class="com.cncounter.common.log.AlertAppender">
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>ERROR</level>
        </filter>
        <appName>${APP_NAME}</appName>
        <envName>${ENV_NAME}</envName>
        <!--生产环境关闭此配置-->
        <printCallLog>false</printCallLog>
        <dingTalkAccessToken>fffffffffffffffffffffffffff</dingTalkAccessToken>
    </appender>


    <root level="INFO">
        <springProfile name="local,dev">
            <appender-ref ref="CONSOLE"/>
            <appender-ref ref="alertAppender"/>
        </springProfile>
    </root>

</configuration>
```






## 经验教训


1. 分页参数不要忘记
2. 测试时需要模拟对应的数据量
3. try可以捕获 Throwable, 以便出错时输出相关信息。

