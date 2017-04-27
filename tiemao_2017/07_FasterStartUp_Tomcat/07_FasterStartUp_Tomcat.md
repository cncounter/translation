本文简单介绍如何让 Tomcat 更快启动, 同时提供一些建议。

## 一般建议

问题一般分为2类: 一类是BUG,还有一类是性能问题。

首先提醒一点: 如果碰到 Tomcat hang 住或者请求不响应, 必须先诊断和排查问题, 而不要急着去优化。  可以执行 **线程转储**, 看看 JVM 出了什么问题。请参考Tomcat的wiki页面: [问题检测与诊断](https://wiki.apache.org/tomcat/FAQ/Troubleshooting_and_Diagnostics) 。

## JAR 包扫描

在[Servlet 3.0规范](https://wiki.apache.org/tomcat/Specifications) 的第8章, 引入了一些插件特性("plugability features")。 其目的是为了精简web应用结构, 并降低插件框架的复杂度。 杯具的是, 这些特性会扫描所有的JAR包和类文件,这会耗费较长的时间。按照规范, Servlet容器在启动时, 默认会执行扫描; 但用户也可以通过配置文件禁用此特性(见下文), 也可以指定哪些 jar 包不需要进行扫描。

下面的这些特性需要扫描 jar 包, 由 Servlet 3.0 引入:


*   SCI (`javax.servlet.ServletContainerInitializer`)
*   Web fragments (`META-INF/web-fragment.xml`)
*   打包在jar文件中的WEB应用资源(`META-INF/resources/*`)
*   注解定义的web应用组件 (如 `@WebServlet` .)
*   为第三方库定义组件的注解, 这些第三库由 SCI 负责初始化, (使用 `@HandlesTypes` 注解的 annotation )


早期规范所引入的一些特性:

*   TLD扫描, 如 tag libraries(标签库)。 需要扫描标签库的描述文件, `META-INF/**/*.tld`.


对注解的扫描是最慢的。因为必须读取每个 class 文件, 并解析和查找其中的注解。

Tomcat 7.0.47 之后的版本, 及 Tomcat 8, 会扫描 [WebSocket](https://wiki.apache.org/tomcat/WebSocket) 注解的API实现. 包括 `@ServerEndpoint` 注解的类, 以及实现了 `ServerApplicationConfig` 接口的类, 还有集成了 abstract `Endpoint` 的类。如果不需要使用 [WebSockets](https://wiki.apache.org/tomcat/WebSockets), 则可以删除Tomcat的lib目录下WebSocket 相关的 jar 包 (`websocket-api.jar`, `tomcat7-websocket.jar`, 以及 `tomcat-websocket.jar` 这种包)。


**注意**: 在Tomcat 7及之前的版本中, 会执行两次TLD扫描,


*   第一次, 在启动时执行, 查找 tld 文件中的 listener (由`TldConfig`类完成),
*   第二次, 在JSP引擎生成 JSP页面的 java 代码时执行(使用 `TldLocationsCache` 类)。


第二次扫描比较容易看到,因为会打印一些诊断信息, 哪些JAR包中没有 TLD相关的信息. 在 Tomcat 8 启动时, 只扫描一次TLD, (在 `JasperInitializer` 类中)。


### Web应用配置


参见: [Tomcat 7 migration guide](http://tomcat.apache.org/migration-7.html#Annotation_scanning).

在 `WEB-INF/web.xml` 文件中可以指定两个选项:

1. 设置 `<web-app>` 元素的属性 `metadata-complete="true"`。
2. 在其中添加一个空元素 `<absolute-ordering />`。


设置 `metadata-complete="true"` 可以禁止扫描 web应用和库类, 主要是对注解的扫描(例如 Servlet等)。 `metadata-complete`  选项并不能禁止所有的注解扫描. 加入存在 `@HandlesTypes` 注解的SCI, 则Tomcat 一定会扫描整个应用, 以确定使用对应注解的类和接口。

`<absolute-ordering>` 元素直接指定了哪些 JAR 包需要扫描 web fragment(在 `WEB-INF/web-fragment.xml` 文件中指定), 包括 SCI, fragment 以及 annotation.  `<absolute-ordering/>` 元素是空的, 则表示一个类都不需要扫描。

在 Tomcat 7 中, `absolute-ordering` 选项同时影响应用程序的 SCI 和 容器提供的SCIs(即 `$CATALINA_HOME/lib` 中定义的)。在Tomcat 8 中, 容器提供的SCI总是会被扫描, 无论是否指定 `absolute-ordering`, 该选项只会影响到web应用. 这时候虽然 `absolute-ordering` 选项不能阻止注解扫描, 但扫描的列表是空的, 也就很快完成。 不论是否指定 `absolute-ordering`, `WEB-INF/classes` 目录是一定会被扫描的。

对web应用程序资源以及TLD的扫描, 并不受这些选项的影响。


### 删除不需要的JAR文件


删除所有不需要的JAR文件。JVM在查找 class 时, 需要判断每一个JAR文件,以便找到所需的类。如果删除了不需要的 JAR 文件, 自然查找的速度就会快一些。


**注意:** WEB 应用中决不应该在lib中出现 Servlet API 或者 Tomcat 自身的 jar, 这些由容器(Tomcat)负责提供. 如果使用 Maven, 这些依赖应该指定为 `<scope>provided</scope>`。请参考 [stackoverflow页面](http://stackoverflow.com/questions/1031695/how-to-exclude-jars-generated-by-maven-war-plugin)。


### 排除不需要扫描的 JAR 包


在 Tomcat 7 中,可以通过 [system property](http://tomcat.apache.org/tomcat-7.0-doc/config/systemprops.html#JAR_Scanning) , 来排除对某些 JAR 文件的扫描, 使用的是 名称/正则表达式. 通常配置在 `conf/catalina.properties` 文件中。

在 Tomcat 8 中存在多种方式。可以使用 [system property](http://tomcat.apache.org/tomcat-8.0-doc/config/systemprops.html#JAR_Scanning) , 还可以在web应用的 [context 文件](http://tomcat.apache.org/tomcat-8.0-doc/config/context.html) 中指定 [`<JarScanFilter>` 元素](http://tomcat.apache.org/tomcat-8.0-doc/config/jar-scan-filter.html) 。


### 禁用 WebSocket


`Context` 元素有一个 `containerSciFilter` 属性。  可以禁止 Tomcat 容器提供的插件功能: 如 WebSocket支持(Tomcat 7 及以后的版本可配置), JSP支持等(Tomcat 8 之后可配置)。

在 JAR 文件的 `META-INF/services/javax.servlet.ServletContainerInitializer` 中可以配置需要过滤的类名。 WebSocket 相关的是 `org.apache.tomcat.websocket.server.WsSci`, JSP相关的是 `org.apache.jasper.servlet.JasperInitializer`. 


具体能快多少呢? 简单地说, WebSocket 扫描造成的延迟在这里提到了:

参考: [Bug 55855](https://bz.apache.org/bugzilla/show_bug.cgi?id=55855), [Tomcat 8 Context documentation](http://tomcat.apache.org/tomcat-8.0-doc/config/context.html) 

其中提到的一个解决办法, 是从 Tomcat 的安装目录下,移除 websocket 相关的类


## 随机数熵源(Entropy Source)


Tomcat 7 及以后的版本严重依赖于 `SecureRandom` 类, 用以生成随机值, 比如 session id 和其他地方. JVM 默认使用阻塞式熵源(`/dev/random`), 如果熵源中的数据量不足, 就会导致启动变慢或阻塞。阻塞时间较长时, 会看到一条警告日志,例如:


    <DATE> org.apache.catalina.util.SessionIdGenerator createSecureRandom
    INFO: Creation of SecureRandom instance for session ID generation using [SHA1PRNG] took [5172] milliseconds.

> 这只是卡顿 `5` 秒的情况, 我们碰到过JVM被卡了200多秒的情况, 所以才翻译了这篇文章【MAVEN的某些插件也可能依赖 `SecureRandom`】。

在新买的Linux服务器上部署了多个 Tomcat 实例时, 结果启动耗时超过了200秒,经检查就是默认使用阻塞式熵源的原因。

原理性的文章在这里： [http://hongjiang.info/jvm-random-and-entropy-source/](http://hongjiang.info/jvm-random-and-entropy-source/)

解决方案在这里: [http://proghowto.com/tomcat-startup-takes-forever](http://proghowto.com/tomcat-startup-takes-forever)

通过设置系统属性, 可以让JVM使用非阻塞式的随机源: `-Djava.security.egd=file:/dev/./urandom` 


请注意这里是 `/dev/./urandom` 。其中有 `./` 的原因是Oracle JRE 中有 [一个bug #6202721](http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=6202721). 参见 [JDK Enhancement Proposal 123](http://openjdk.java.net/jeps/123)。 在 Java 8 中, [SecureRandom](https://wiki.apache.org/tomcat/SecureRandom) 类的实现进行了修正。


还要注意, 阻塞式的熵源(`/dev/random`) 安全性较高, 非阻塞式的熵源(`/dev/./urandom`) 安全性会低一些, 因为你对随机数的安全性要求比较高. 可以考虑使用硬件方式的熵源, 如 "[EntropyKey](https://wiki.apache.org/tomcat/EntropyKey)"。

> 硬件 `Key` 一般翻译为"狗"。

## 并行启动多个web应用

从 Tomcat 7.0.23+ 开始, 可以同时并行启动多个web应用程序. 默认情况下这个特性是禁用的, 可以设置 **Host** 元素的 `startStopThreads` 属性值来启用, 大于1即可。

## 其他

### 内存调优


调优内存参数 —— 请使用 Google 搜索。

我们使用的配置参数为:

```
export JAVA_OPTS="-Xms4g -Xmx4g -Xmn3g -Xss1024k -verbose:gc -XX:+PrintGCDateStamps -XX:+PrintGCDetails -Xloggc:$CATALINA_BASE/logs/gc.log -server -Djava.security.egd=file:/dev/./urandom"
```

将初始堆内存和最大内存设置为相等的值: `-Xms4g -Xmx4g`。 在专用服务器上一般都是这样设置。

其中堆内存较小,请根据具体情况配置。 `-Xmn3g` 指定了年轻代占用一半以上的内存。 如果堆内存更大, 在一半的WEB程序中,可以将 `-Xmn` 的值调整到70%以上。 当然,也得看具体情况。

关于 JVM 的 GC 性能优化, 请参考: [http://blog.csdn.net/column/details/14851.html](http://blog.csdn.net/column/details/14851.html)


### 配置

尽可能地减小配置文件。XML解析的代价并不低。需要解析的东西越少, 自然就会越快。

### Web 应用程序

1. 删除所有不需要的 web应用。特别是安装 tomcat 之后, 删除 webapps 目录下所有的应用程序
2. 确保程序代码的效率。(通过 profiler 来监测)


### 推荐阅读


Tomcat 的 HowTo 系列文章,请访问: [https://wiki.apache.org/tomcat/HowTo](https://wiki.apache.org/tomcat/HowTo)


原文链接: [https://wiki.apache.org/tomcat/HowTo/FasterStartUp](https://wiki.apache.org/tomcat/HowTo/FasterStartUp)


翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)


翻译时间: 2017年4月27日


