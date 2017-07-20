# What is Tomcat valve?

# Tomcat valve 简介


### WHAT IS A TOMCAT VALVE?

### 什么是TOMCAT VALVE?


A Tomcat valve - a new technology introduced with Tomcat 4 which allows you to associate an instance of a Java class with a particular Catalina container.

Tomcat valve- - -一项新技术引进与Tomcat 4它允许您将一个Java类的实例与一个特定的卡特琳娜容器。


This configuration allows the named class to act as a preprocessor of each request. These classes are called valves, and they must implement the org.apache.catalina.Valve interface or extend the org.apache.catalina.valves.ValveBase class. Valves are proprietary to Tomcat and cannot, at this time, be used in a different servlet/JSP container. At this writing, Tomcat comes configured with four valves:

这种配置允许命名类作为预处理器的每个请求。这些类被称为 valve门,他们必须实现org.apache.catalina。 valve门接口或者扩展org.apache.catalina.valves。ValveBase类。 valve门是专有的Tomcat和不能,在这个时候,被用于不同的servlet / JSP容器.在撰写本文时,Tomcat配置了四个 valve门:


- Access Log
- Remote Address Filter
- Remote Host Filter
- Request Dumper

- 访问日志
- 远程地址过滤
- 远程主机过滤器
- 请求自动倾卸车



Each of these valves (and their available attributes) are described as follows.

这些 valve门(和他们的可用属性)描述如下。


### THE ACCESS LOG VALVE

### 访问日志 valve


The first of the Tomcat prepackaged valves is the Access Log valve: org.apache.catalina.valves.AccessLogValve. It creates log files to track client access information.

第一个Tomcat预先包装好的 valve门是访问日志 valve:org.apache.catalina.valves.AccessLogValve。它创建日志文件来跟踪客户访问信息。


Some of the content that it tracks includes page hit counts, user session activity, user authentication information, and much more. The Access Log valve can be associated with an engine, host, or context container.

其追踪的一些内容,包括页面数,用户会话活动,用户身份验证信息,等等.访问日志 valve可以关联到一个引擎,主机,或上下文容器。


The following code snippet is an example entry using the org.apache.catalina.valves.AccessLogValve:

下面的代码片段是一个条目使用org.apache.catalina.valves.AccessLogValve:


```
<Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs" prefix="localhost_access_log." suffix=".txt" pattern="common"/>
```

This code snippet states that the log files will be placed in the <CATALINA_HOME>/logs directory, prepended with the value localhost_access_log., and appended with the .txt suffix.

这个代码片段状态日志文件将被放置在< CATALINA_HOME > / logs目录,与价值localhost_access_log前缀。,和附加。txt后缀。


We have many java packages with ready-made tomcats that would make your life much easier. Take a look at our [java hosting](https://www.oxxus.net/) offer and join our Java family

我们有许多java包和现成的雄猫,会让你的生活更容易。看看我们的(java主机)(https://www.oxxus.net/)提供和加入我们的java的家人


### THE REMOTE ADDRESS FILTER

### 远程地址过滤


The Remote Address filter, org.apache.catalina.valves.RemoteAddrValve, allows you to compare the IP address of the requesting client against one or more regular expressions to either allow or prevent the request from continuing based on the results of this comparison. A Remote Address filter can be associated with a Tomcat Engine, Host, or Context container.

远程地址过滤,org.apache.catalina.valves.RemoteAddrValve,允许您比较发出请求的客户机的IP地址和一个或多个正则表达式来允许或阻止请求继续基于这种比较的结果.远程地址过滤器可以被关联到一个Tomcat引擎,主机,或上下文容器。


org.apache.catalina.valves.RemoteAddrValve.

```
<Valve className="org.apache.catalina.valves.RemoteAddrValve" deny="127.*"/>
```

This valve entry denies access to the assigned container for all client IP addresses that begin with 127. If I assign this valve entry to the host container localhost, then all clients with an IP address beginning with 127 will see a http status 403 - Frobidden page.

这种 valve门入口拒绝访问的所有客户端IP地址的分配容器从127年开始.如果我分配这个 valve进入宿主容器localhost,那么所有客户提供IP地址从127年将开始看到一个http状态403 - Frobidden页面。


### THE REMOTE HOST FILTER

### 远程主机过滤器


The Remote Host filter—org.apache.catalina.valves.RemoteHostValve is much like the RemoteAddrValve, except it allows you to compare the remote host address of the client that submitted this request instead of the fixed IP address. A Remote Host filter can be associated with a Tomcat Engine, Host, or Context container. An example entry using the org.apache.catalina.valves.RemoteHostValve can be found in the following code snippet.

远程主机filter-org.apache.catalina.valves.RemoteAddrValve RemoteHostValve很像,除了它允许您比较客户端提交这个请求的远程主机地址而不是固定的IP地址.第三十八条滤波器系数是与东道主、发动机Tomcat了黄金Context集装箱。一年org.apache.catalina.valves长的新…….RemoteHostValve可以找到下面的代码片段。


```
<Valve className="org.apache.catalina.valves.RemoteHostValve" deny="virtuas*"/>
```

This valve entry denies access to the assigned container for all client hostnames including virtuas. If I assign this valve entry to the host container localhost, then all clients beginning with virtuas will see a 403 - Forbidden page.

这种 valve门入口拒绝访问为所有客户端主机名指定容器包括与启示.如果我分配这个 valve进入宿主容器localhost,那么所有客户与启示开始403 -禁止将看到一个页面。


### THE REQUEST DUMPER VALVE

### 请求翻车机 valve


The Request Dumper valve org.apache.catalina.valves.RequestDumperValve is a debugging tool that allows you to dump the HTTP headers associated with the specified request and response to the logger that is associated with our corresponding container. This valve is especially useful when you are trying to resolve any problems associated with headers or cookies sent by an HTTP client.

请求org.apache.catalina.valves翻车机 valve门.RequestDumperValve是一个调试工具,允许您转储与指定的请求和响应相关联的HTTP头信息与我们的相关联的日志记录器相应容器中.这个 valve是特别有用,当你试图解决任何问题与头或cookie发送的HTTP客户端。


A Request Dumper filter can be associated with an Engine, Host, or Context container. The Request Dumper filter supports no additional attributes. An example entry using the org.apache.catalina.valve.RequestDumperValve can be found in the following code snippet:

请求翻车机过滤器可以关联到一个引擎,主机,或上下文容器。请求翻车机过滤器不支持额外的属性。一个例子使用org.apache.catalina.valve条目.RequestDumperValve可以找到下面的代码片段:


```
<Valve className="org.apache.catalina.valves.RequestDumperValve"/>
```

To use the RequestDumperValve, you simply need to add this entry to the Tomcat container that you would like to monitor. To see this valve in action, open the current <TOMCAT_HOME>/conf/server.xml, uncomment the previously listed line found in the Standalone engine, and restart Tomcat. Now make a request to any of the applications found at http://localhost:8080.

使用RequestDumperValve,您只需要将该条目添加到Tomcat容器,你想监视。看到这个 valve门,打开当前< TOMCAT_HOME > / conf / server.xml,取消前面列出的线中发现独立的引擎,并重新启动Tomcat。现在发出请求的应用程序发现http://localhost:8080。


After the request has been processed, open the latest <TOMCAT_HOME>/logs/catalina_log file. You should see several entries made by the RequestDumperValve.

请求被处理后,打开最新< TOMCAT_HOME > / logs / catalina_log文件。您应该看到由RequestDumperValve几个条目。


These entries describe the contents of the most recent request.

这些条目描述最近的请求的内容。


原文链接: <https://www.oxxus.net/tutorials/tomcat/tomcat-valve>

