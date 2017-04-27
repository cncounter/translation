# How do I make Tomcat startup faster?

#  Tomcat 启动速度优化


This section provides several recommendations on how to make your web application and Apache Tomcat as a whole to start up faster. 

本文简单介绍如何让 Tomcat 更快启动, 同时提供一些建议。


## General

## 一般建议

问题一般分为2类: 一类是BUG,还有一类是性能问题。


Before we continue to specific tips and tricks, the general advice is that if Tomcat hangs or is not responsive, you have to perform diagnostics. That is to **take several thread dumps** to see what Tomcat is really doing. See [Troubleshooting and Diagnostics](https://wiki.apache.org/tomcat/FAQ/Troubleshooting_and_Diagnostics) page for details. 

首先提醒一点: 如果碰到 Tomcat hang 住或者请求不响应, 必须先诊断和排查问题, 而不要急着去优化。  可以执行 **线程转储**, 看看 JVM 出了什么问题。请参考Tomcat的wiki页面: [问题检测与诊断](https://wiki.apache.org/tomcat/FAQ/Troubleshooting_and_Diagnostics) 。


## JAR scanning

## JAR 包扫描


The [Servlet 3.0 specification](https://wiki.apache.org/tomcat/Specifications) (chapter 8) introduced support for several "plugability features". Those exist to simplify a structure of a web application and to simplify plugging of additional frameworks. Unfortunately, these features require scanning of JAR and class files, which may take noticeable time. Conformance to the specification requires that the scanning were performed by default, but you can configure your own web application in several ways to avoid it (see below). It is also possible to configure which JARs Tomcat should skip. 

在[Servlet 3.0规范](https://wiki.apache.org/tomcat/Specifications) 的第8章, 引入了一些插件特性("plugability features")。 其目的是为了精简web应用结构, 并降低插件框架的复杂度。 杯具的是, 这些特性会扫描所有的JAR包和类文件,这会耗费较长的时间。按照规范, Servlet容器在启动时, 默认会执行扫描; 但用户也可以通过配置文件禁用此特性(见下文), 也可以指定哪些 jar 包不需要进行扫描。


For further talk, the features that require scanning are: 


Introduced by Servlet 3.0: 

下面的这些特性需要扫描 jar 包, 由 Servlet 3.0 引入:


*   SCI (`javax.servlet.ServletContainerInitializer`)
*   Web fragments (`META-INF/web-fragment.xml`)
*   Resources of a web application bundled in jar files (`META-INF/resources/*`)
*   Annotations that define components of a web application (`@WebServlet` etc.)
*   Annotations that define components for 3-rd party libraries initialized by an SCI (arbitrary annotations that are defined in `@HandlesTypes` annotation on a SCI class)

<hr/>

*   SCI (`javax.servlet.ServletContainerInitializer`)
*   Web fragments (`META-INF/web-fragment.xml`)
*   打包在jar文件中的WEB应用资源(`META-INF/resources/*`)
*   注解定义的web应用组件 (如 `@WebServlet` .)
*   为第三方库定义组件的注解, 这些第三库由 SCI 负责初始化, (使用 `@HandlesTypes` 注解的 annotation )


Older features, introduced by earlier specifications: 

由早期规范所引入的一些特性:


*   TLD scanning, (Discovery of tag libraries. Scans for Tag Library Descriptor files, `META-INF/**/*.tld`).

<br/>

*   TLD扫描, 如 tag libraries(标签库)。 需要扫描标签库的描述文件, `META-INF/**/*.tld`.


Among the scans the annotation scanning is the slowest. That is because each class file (except ones in ignored JARs) has to be read and parsed looking for annotations in it. 

对注解的扫描是最慢的。因为必须读取每个 class 文件, 并解析和查找其中的注解。


An example of a container-provided SCI that triggers annotation scanning is the [WebSocket](https://wiki.apache.org/tomcat/WebSocket) API implementation which is included with standard distribution in all versions of Tomcat 8 and with Tomcat 7 starting with 7.0.47. An SCI class declared there triggers scanning for [WebSocket](https://wiki.apache.org/tomcat/WebSocket) endpoints (the classes annotated with `@ServerEndpoint` or implementing `ServerApplicationConfig` interface or extending the abstract `Endpoint` class). If you do not need support for [WebSockets](https://wiki.apache.org/tomcat/WebSockets), you may remove the [WebSocket](https://wiki.apache.org/tomcat/WebSocket) API and [WebSocket](https://wiki.apache.org/tomcat/WebSocket) implementation JARs from Tomcat (`websocket-api.jar` and `tomcat7-websocket.jar` or `tomcat-websocket.jar`). 

Tomcat 7.0.47 之后的版本, 及 Tomcat 8, 会扫描 [WebSocket](https://wiki.apache.org/tomcat/WebSocket) 注解的API实现. 包括 `@ServerEndpoint` 注解的类, 以及实现了 `ServerApplicationConfig` 接口的类, 还有集成了 abstract `Endpoint` 的类。如果不需要使用 [WebSockets](https://wiki.apache.org/tomcat/WebSockets), 则可以删除Tomcat的lib目录下WebSocket 相关的 jar 包 (`websocket-api.jar`, `tomcat7-websocket.jar`, 以及 `tomcat-websocket.jar` 这种包)。


_A note on TLD scanning_: In Tomcat 7 and earlier the TLD scanning happens twice, 

**注意**: 在Tomcat 7及之前的版本中, 会执行两次TLD扫描,


*   first, at startup time, to discover listeners declared in tld files (done by `TldConfig` class),
*   second, by JSP engine when generating java code for a JSP page (done by `TldLocationsCache`).

<br/>

*   第一次, 在启动时执行, 查找 tld 文件中的 listener (由`TldConfig`类完成),
*   第二次, 在JSP引擎生成 JSP页面的 java 代码时执行(使用 `TldLocationsCache` 类)。


The second scanning is more noticeable, because it prints a diagnostic message about scanned JARs that contained no TLDs. In Tomcat 8 the TLD scanning happens only once at startup time (in `JasperInitializer`). 

第二次扫描比较容易看到,因为它会打印一些诊断信息, 哪些JAR包中没有 TLD相关的信息. 在 Tomcat 8 启动时, 只扫描一次TLD, (在 `JasperInitializer` 类中)。


### Configure your web application

### Web应用配置


See chapter in [Tomcat 7 migration guide](http://tomcat.apache.org/migration-7.html#Annotation_scanning). 

参见: [Tomcat 7 migration guide](http://tomcat.apache.org/migration-7.html#Annotation_scanning).


There are two options that can be specified in your `WEB-INF/web.xml` file: 

在 `WEB-INF/web.xml` 文件中可以指定两个选项:


1.  Set `metadata-complete="true"` attribute on the `<web-app>` element.
2.  Add an empty `<absolute-ordering />` element.

<br/>

1. 设置 `<web-app>` 元素的属性 `metadata-complete="true"`。
2. 在其中添加一个空元素 `<absolute-ordering />`。


Setting `metadata-complete="true"` disables scanning your web application and its libraries for classes that use annotations to define components of a web application (Servlets etc.). The `metadata-complete` option is not enough to disable all of annotation scanning. If there is a SCI with a `@HandlesTypes` annotation, Tomcat has to scan your application for classes that use annotations or interfaces specified in that annotation. 

设置 `metadata-complete="true"` 可以禁止扫描 web应用和库类, 主要是对注解的扫描(例如 Servlet等)。 `metadata-complete`  选项并不能禁止所有的注解扫描. 加入存在 `@HandlesTypes` 注解的SCI, 则Tomcat 一定会扫描整个应用, 以确定使用对应注解的类和接口。




The `<absolute-ordering>` element specifies which web fragment JARs (according to the names in their `WEB-INF/web-fragment.xml` files) have to be scanned for SCIs, fragments and annotations. An empty `<absolute-ordering/>` element configures that none are to be scanned. 

`<absolute-ordering>` 元素直接指定了哪些 JAR 包需要扫描 web fragment(在 `WEB-INF/web-fragment.xml` 文件中指定), 包括 SCI, fragment 以及 annotation.  `<absolute-ordering/>` 元素是空的, 则表示一个类都不需要扫描。


In Tomcat 7 the `absolute-ordering` option affects discovery both of SCIs provided by web application and ones provided by the container (i.e. by the libraries in `$CATALINA_HOME/lib`). In Tomcat 8 the option affects the web application ones only, while the container-provided SCIs are always discovered, regardless of `absolute-ordering`. In such case the `absolute-ordering` option alone does not prevent scanning for annotations, but the list of JARs to be scanned will be empty, and thus the scanning will complete quickly. The classes in `WEB-INF/classes` are always scanned regardless of `absolute-ordering`. 

在 Tomcat 7 中, `absolute-ordering` 选项同时影响应用程序的 SCI 和 容器提供的SCIs(即 `$CATALINA_HOME/lib` 中定义的)。在Tomcat 8 中, 容器提供的SCI总是会被扫描, 无论是否指定 `absolute-ordering`, 该选项只会影响到web应用. 这时候虽然 `absolute-ordering` 选项不能阻止注解扫描, 但扫描的列表是空的, 也就很快完成。 不论是否指定 `absolute-ordering`, `WEB-INF/classes` 目录是一定会被扫描的。

Scanning for web application resources and TLD scanning are not affected by these options. 

对web应用程序资源以及TLD的扫描, 并不受这些选项的影响。


### Remove unnecessary JARs

### 删除不需要的JAR文件


Remove any JAR files you do not need. When searching for classes every JAR file needs to be examined to find the needed class. If the jar file is not there - there is nothing to search. 

删除所有不需要的JAR文件。JVM在查找 class 时, 需要判断每一个JAR文件,以便找到所需的类。如果删除了不需要的 JAR 文件, 自然查找的速度就会快一些。


_Note_ that a web application should never have its own copy of Servlet API or Tomcat classes. All those are provided by the container (Tomcat) and should never be present in the web application. If you are using Apache Maven, such dependencies should be configured with `<scope>provided</scope>`. See also a [stackoverflow page](http://stackoverflow.com/questions/1031695/how-to-exclude-jars-generated-by-maven-war-plugin). 

**注意:** WEB 应用中决不应该在lib中出现 Servlet API 或者 Tomcat 自身的 jar, 这些由容器(Tomcat)负责提供. 如果使用 Maven, 这些依赖应该指定为 `<scope>provided</scope>`。请参考 [stackoverflow页面](http://stackoverflow.com/questions/1031695/how-to-exclude-jars-generated-by-maven-war-plugin)。


### Exclude JARs from scanning

### 排除不需要扫描的 JAR 包


In Tomcat 7 JAR files can be excluded from scanning by listing their names or name patterns in a [system property](http://tomcat.apache.org/tomcat-7.0-doc/config/systemprops.html#JAR_Scanning). Those are usually configured in the `conf/catalina.properties` file. 

在 Tomcat 7 中,可以通过 [system property](http://tomcat.apache.org/tomcat-7.0-doc/config/systemprops.html#JAR_Scanning) , 来排除对某些 JAR 文件的扫描, 使用的是 名称/正则表达式. 通常配置在 `conf/catalina.properties` 文件中。


In Tomcat 8 there are several options available. You can use a [system property](http://tomcat.apache.org/tomcat-8.0-doc/config/systemprops.html#JAR_Scanning) or configure a `<JarScanFilter>` [element](http://tomcat.apache.org/tomcat-8.0-doc/config/jar-scan-filter.html) in the [context file](http://tomcat.apache.org/tomcat-8.0-doc/config/context.html) of your web application. 

在 Tomcat 8 中存在多种方式。可以使用 [system property](http://tomcat.apache.org/tomcat-8.0-doc/config/systemprops.html#JAR_Scanning) , 还可以在web应用的 [context 文件](http://tomcat.apache.org/tomcat-8.0-doc/config/context.html) 中指定 [`<JarScanFilter>` 元素](http://tomcat.apache.org/tomcat-8.0-doc/config/jar-scan-filter.html) 。


### Disable WebSocket support

### 禁用 WebSocket


There exists an attribute on `Context` element, `containerSciFilter`. It can be used to disable container-provided features that are plugged into Tomcat via SCI API: WebSocket support (in Tomcat 7 and later), JSP support (in Tomcat 8 and later). 

`Context` 元素有一个 `containerSciFilter` 属性。  可以禁止 Tomcat 容器提供的插件功能: 如 WebSocket支持(Tomcat 7 及以后的版本可配置), JSP支持等(Tomcat 8 之后可配置)。


The class names to filter can be detected by looking into `META-INF/services/javax.servlet.ServletContainerInitializer` files in Tomcat JARs. For WebSocket support the name is `org.apache.tomcat.websocket.server.WsSci`, for JSP support the name is `org.apache.jasper.servlet.JasperInitializer`. 

在 JAR 文件的 `META-INF/services/javax.servlet.ServletContainerInitializer` 中可以配置需要过滤的类名。 WebSocket 相关的是 `org.apache.tomcat.websocket.server.WsSci`, JSP相关的是 `org.apache.jasper.servlet.JasperInitializer`. 



_TODO: How much faster does it make it? In short: Delays due to annotation scanning caused by WebSocket have been already mentioned in another paragraphs on this page. This is an alternative to removing websocket JARs from Tomcat installation._ 

具体能快多少呢? 简单地说, WebSocket 扫描造成的延迟在这里提到了:


References: [Bug 55855](https://bz.apache.org/bugzilla/show_bug.cgi?id=55855), [Tomcat 8 Context documentation](http://tomcat.apache.org/tomcat-8.0-doc/config/context.html) 

参考: [Bug 55855](https://bz.apache.org/bugzilla/show_bug.cgi?id=55855), [Tomcat 8 Context documentation](http://tomcat.apache.org/tomcat-8.0-doc/config/context.html) 

其中的一种解决办法是, 从 Tomcat 的安装目录下,移除 websocket 相关的类


## Entropy Source

## 随机数熵源(Entropy Source)


Tomcat 7+ heavily relies on SecureRandom class to provide random values for its session ids and in other places. Depending on your JRE it can cause delays during startup if entropy source that is used to initialize SecureRandom is short of entropy. You will see warning in the logs when this happens, e.g.: 

Tomcat 7 及以后的版本严重依赖于 `SecureRandom` 类, 用以生成随机值, 比如 session id 和其他地方. JVM 默认使用阻塞式熵源(`/dev/random`), 如果熵源中的数据量不足, 就会导致启动变慢或阻塞。阻塞时间较长时, 会看到一条警告日志,例如:


    <DATE> org.apache.catalina.util.SessionIdGenerator createSecureRandom
    INFO: Creation of SecureRandom instance for session ID generation using [SHA1PRNG] took [5172] milliseconds.

> 这只是卡顿了 `5` 秒左右, 现实情况中, 我们的系统被卡了100多秒, 视具体情况而定【MAVEN的某些插件也可能依赖 `SecureRandom`】。


我们在新买的Linux服务器上部署了多个 Tomcat 实例, 结果启动耗时超过了200秒,经检查就是使用了阻塞式熵源的原因。

原理性的文章在这里： [http://hongjiang.info/jvm-random-and-entropy-source/](http://hongjiang.info/jvm-random-and-entropy-source/)

解决方案在这里: [http://proghowto.com/tomcat-startup-takes-forever](http://proghowto.com/tomcat-startup-takes-forever)




There is a way to configure JRE to use a non-blocking entropy source by setting the following system property: `-Djava.security.egd=file:/dev/./urandom` 

通过设置系统属性, 可以让JVM使用非阻塞式的随机源: `-Djava.security.egd=file:/dev/./urandom` 


Note the "`/./`" characters in the value. They are needed to work around known [Oracle JRE bug #6202721](http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=6202721). See also [JDK Enhancement Proposal 123](http://openjdk.java.net/jeps/123). It is known that implementation of [SecureRandom](https://wiki.apache.org/tomcat/SecureRandom) was improved in Java 8 onwards. 

请注意这里是 `/dev/./urandom` 。其中有 `./` 的原因是Oracle JRE 中有 [一个bug #6202721](http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=6202721). 参见 [JDK Enhancement Proposal 123](http://openjdk.java.net/jeps/123)。 在 Java 8 中, [SecureRandom](https://wiki.apache.org/tomcat/SecureRandom) 类的实现进行了修正。


Also note that replacing the blocking entropy source (/dev/random) with a non-blocking one actually reduces security because you are getting less-random data. If you have a problem generating entropy on your server (which is common), consider looking into entropy-generating hardware products such as "[EntropyKey](https://wiki.apache.org/tomcat/EntropyKey)". 

还要注意, 阻塞式的熵源(`/dev/random`) 安全性较高, 非阻塞式的熵源(`/dev/./urandom`) 安全性会低一些, 因为你对随机数的安全性要求比较高. 可以考虑使用硬件方式的熵源, 如 "[EntropyKey](https://wiki.apache.org/tomcat/EntropyKey)"。

> 硬件方式的 `Key` 一般翻译为"狗"。


## Starting several web applications in parallel

## 并行启动多个web应用


With Tomcat 7.0.23+ you can configure it to start several web applications in parallel. This is disabled by default but can be enabled by setting the `startStopThreads` attribute of a **Host** to a value greater than one. 

从 Tomcat 7.0.23+ 开始, 可以同时并行启动多个web应用程序. 默认情况下这个特性是禁用的, 可以设置 **Host** 元素的 `startStopThreads` 属性值来启用, 大于1即可。


## Other

## 其他


### Memory

### 内存


Tweak memory parameters - Google is your friend. 

调优内存参数 —— 请使用 Google 搜索。


### Config

### 配置


Trim the config files as much as possible. XML parsing is not cheap. The less there is to parse - the faster things will go. 

尽可能地减小配置文件。XML解析的代价并不低。需要解析的东西越少, 自然就会越快。


### Web application

### Web 应用程序


1.  Remove any web applications that you do not need. (So remove the all the web applications installed with tomcat)
2.  Make sure your code is not doing slow things. (Use a profiler)

<br/>

1. 删除所有不需要的 web应用。特别是安装 tomcat 之后, 删除 webapps 目录下所有的应用程序
2. 确保程序代码的效率。(通过 profiler 来监测)


### 推荐阅读


Tomcat 的 HowTo 系列文章,请访问: [https://wiki.apache.org/tomcat/HowTo](https://wiki.apache.org/tomcat/HowTo)



原文链接: [https://wiki.apache.org/tomcat/HowTo/FasterStartUp](https://wiki.apache.org/tomcat/HowTo/FasterStartUp)


翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)


翻译时间: 2017年4月27日


