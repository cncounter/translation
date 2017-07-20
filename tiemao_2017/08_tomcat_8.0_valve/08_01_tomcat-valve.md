# What is Tomcat valve?

# Tomcat valve 简介


### WHAT IS A TOMCAT VALVE?

### 什么是TOMCAT VALVE?


A Tomcat valve - a new technology introduced with Tomcat 4 which allows you to associate an instance of a Java class with a particular Catalina container.

VALVE , 允许您将某个Java类的实例, 与一个 Catalina 容器关联起来。

A Valve element represents a component that will be inserted into the request processing pipeline for the associated Catalina container (Engine, Host, or Context). Individual Valves have distinct processing capabilities, and are described individually below.

Valve 是 Tomcat 4 开始引入的一种组件, 此元素会被插入到Tomcat的请求处理切面中(request processing pipeline), 可以关联到 Engine, Host, 以及 Context 之中. 每种Valve都有不同的作用, 下面分别进行描述。


The description below uses the variable name $CATALINA_BASE to refer the base directory against which most relative paths are resolved. If you have not configured Tomcat for multiple instances by setting a CATALINA_BASE directory, then $CATALINA_BASE will be set to the value of $CATALINA_HOME, the directory into which you have installed Tomcat.

本文使用变量名 `$CATALINA_BASE` 来指代 base 目录. 一般在单台机器上启动多个 Tomcat 实例时, 需要指定不同的 `CATALINA_BASE` 目录。 假如没有指定,那么会将 `$CATALINA_HOME` 的值赋给 `$CATALINA_BASE`, 默认是 Tomcat 的安装目录。





This configuration allows the named class to act as a preprocessor of each request. These classes are called valves, and they must implement the org.apache.catalina.Valve interface or extend the org.apache.catalina.valves.ValveBase class. Valves are proprietary to Tomcat and cannot, at this time, be used in a different servlet/JSP container. At this writing, Tomcat comes configured with four valves:

这样就可以指定特定的类, 作为每个请求(request)的预处理器(preprocessor)。这样的类被称为 valve, 必须实现 `org.apache.catalina.Valve` 接口, 当然也可以继承 `org.apache.catalina.valves.ValveBase` 类。 从包名可以看出,Valve 是 Tomcat 专有的, 不能用于其他 servlet/JSP 容器. 在撰写本文时(2007年?),Tomcat内置了4种 valve:


- Access Log(访问日志)
- Remote Address Filter(远端地址过)
- Remote Host Filter(远程主机过滤)
- Request Dumper(请求转储)



Each of these valves (and their available attributes) are described as follows.

下面介绍这些 valve 及对应的配置信息。


### THE ACCESS LOG VALVE

### 访问日志(ACCESS LOG)


The first of the Tomcat prepackaged valves is the Access Log valve: org.apache.catalina.valves.AccessLogValve. It creates log files to track client access information.

首先我们介绍Tomcat内置的: `org.apache.catalina.valves.AccessLogValve`。这个 Access Log valve 会创建日志文件来记录客户端的访问信息。


Some of the content that it tracks includes page hit counts, user session activity, user authentication information, and much more. The Access Log valve can be associated with an engine, host, or context container.

其中记录的内容包括: 页面访问数,用户会话活动, 用户身份验证信息等. Access Log valve 可以关联到 engine, host, 或者 context 容器。


The following code snippet is an example entry using the org.apache.catalina.valves.AccessLogValve:

下面是使用`org.apache.catalina.valves.AccessLogValve`的一个示例:


```
<Valve className="org.apache.catalina.valves.AccessLogValve" 
    directory="logs" prefix="access_log." suffix=".txt"  
    fileDateFormat="yyyy-MM-dd"  
    resolveHosts="false"
    pattern="common" 
/>
```

This code snippet states that the log files will be placed in the $CATALINA_BASE/logs directory, prepended with the value localhost_access_log., and appended with the .txt suffix.

这段配置的意思是, 日志文件的存放目录(directory)是 `$CATALINA_BASE/logs`, 文件名的前缀(prefix)是 `access_log.`, 后缀是 `.txt`, 当然,访问日志文件按日期生成(fileDateFormat)。


We have many java packages with ready-made tomcats that would make your life much easier. Take a look at our [java hosting](https://www.oxxus.net/) offer and join our Java family

如果有兴趣了解,可以参考原文网站: <https://www.oxxus.net/>。


### THE REMOTE ADDRESS FILTER

### 远程地址过滤(REMOTE ADDRESS)


The Remote Address filter, org.apache.catalina.valves.RemoteAddrValve, allows you to compare the IP address of the requesting client against one or more regular expressions to either allow or prevent the request from continuing based on the results of this comparison. A Remote Address filter can be associated with a Tomcat Engine, Host, or Context container.

远程地址过滤, `org.apache.catalina.valves.RemoteAddrValve`, 允许您将客户端的IP地址与一/多个正则表达式来匹配,已决定是允许还是拒绝该请求. Remote Address filter 可以关联到 engine, host, 或者 context 容器。


示例:

```
<Valve className="org.apache.catalina.valves.RemoteAddrValve" 
    deny="127.*"/>
```

This valve entry denies access to the assigned container for all client IP addresses that begin with 127. If I assign this valve entry to the host container localhost, then all clients with an IP address beginning with 127 will see a http status 403 - Frobidden page.

此配置, 将拒绝客户端地址为 127 打头的请求: `127.` 是回环地址,也就是本机. 返回的 http 状态码是 403 - 对应于 Frobidden 页面。


### THE REMOTE HOST FILTER

### 远程主机过滤(REMOTE HOST)


The Remote Host filter—org.apache.catalina.valves.RemoteHostValve is much like the RemoteAddrValve, except it allows you to compare the remote host address of the client that submitted this request instead of the fixed IP address. A Remote Host filter can be associated with a Tomcat Engine, Host, or Context container. An example entry using the org.apache.catalina.valves.RemoteHostValve can be found in the following code snippet.

远程主机过滤 - `org.apache.catalina.valves.RemoteHostValve` 与 RemoteAddrValve 类似, 但比较的是客户端的 hostname, 而不是固定的IP地址. Remote Host filter 可以关联到 engine, host, 或者 context 容器。下面是示例。


```
<Valve className="org.apache.catalina.valves.RemoteHostValve" 
    deny="virtuas*"/>
```

This valve entry denies access to the assigned container for all client hostnames including virtuas. If I assign this valve entry to the host container localhost, then all clients beginning with virtuas will see a 403 - Forbidden page.

此配置, 拒绝所有 hostname 包括 `virtuas` 的客户端请求. 如果被拦截, 那么返回的 http 状态码是 403 - 对应于 Frobidden 页面。


### THE REQUEST DUMPER VALVE

### 请求转储(REQUEST DUMPER)


The Request Dumper valve org.apache.catalina.valves.RequestDumperValve is a debugging tool that allows you to dump the HTTP headers associated with the specified request and response to the logger that is associated with our corresponding container. This valve is especially useful when you are trying to resolve any problems associated with headers or cookies sent by an HTTP client.

Request Dumper 是一个调试工具, `org.apache.catalina.valves.RequestDumperValve`。允许您将 request 和 response 的 HTTP headers 转储到 container 相关联的logger中. 在使用某种 HTTP client 时如果出了什么问题, 此 Valve 确实挺有用的。


A Request Dumper filter can be associated with an Engine, Host, or Context container. The Request Dumper filter supports no additional attributes. An example entry using the org.apache.catalina.valve.RequestDumperValve can be found in the following code snippet:

Request Dumper 可以关联到 engine, host, 或者 context 容器。但不支持配置其他属性。 示例代码如下:

```
<Valve className="org.apache.catalina.valves.RequestDumperValve"/>
```

To use the RequestDumperValve, you simply need to add this entry to the Tomcat container that you would like to monitor. To see this valve in action, open the current $CATALINA_BASE/conf/server.xml, uncomment the previously listed line found in the Standalone engine, and restart Tomcat. Now make a request to any of the applications found at http://localhost:8080.

只需要将 RequestDumperValve 添加到想监视的 container 配置里面即可。要看示例, 也可以打开 `$CATALINA_BASE/conf/server.xml` 文件找一找, 修改之后记得重启 Tomcat。


After the request has been processed, open the latest $CATALINA_BASE/logs/catalina_log file. You should see several entries made by the RequestDumperValve.

请求完成之后, 打开 `$CATALINA_BASE/logs/` 目录下, 找到最新的 catalina.out 日志文件, 应该能看到 RequestDumperValve 打印的信息。


These entries describe the contents of the most recent request.

这些日志信息中包含了最近 request 的内容。


原文链接: <https://www.oxxus.net/tutorials/tomcat/tomcat-valve>

