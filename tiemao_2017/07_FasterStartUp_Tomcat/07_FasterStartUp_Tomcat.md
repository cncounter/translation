# How do I make Tomcat startup faster?

#  Tomcat 启动速度优化


关于 Tomcat 的 HowTo 系列,请参考: [https://wiki.apache.org/tomcat/HowTo](https://wiki.apache.org/tomcat/HowTo)


This section provides several recommendations on how to make your web application and Apache Tomcat as a whole to start up faster. 

本文提供一些建议, 简单介绍如何让 Tomcat 和 web应用能够更快启动。


## General

## 一般建议


Before we continue to specific tips and tricks, the general advice is that if Tomcat hangs or is not responsive, you have to perform diagnostics. That is to **take several thread dumps** to see what Tomcat is really doing. See [Troubleshooting and Diagnostics](https://wiki.apache.org/tomcat/FAQ/Troubleshooting_and_Diagnostics) page for details. 

首先提示: 如果碰到 Tomcat hang 住或者请求不响应, 必须先进行诊断, 而不要急着去优化。  例如, 执行 **线程转储**, 看看Tomcat到底出了什么问题。详情请参考Tomcat的wiki页面: [问题检测与诊断](https://wiki.apache.org/tomcat/FAQ/Troubleshooting_and_Diagnostics) 。


## JAR scanning

## JAR 包扫描


The [Servlet 3.0 specification](https://wiki.apache.org/tomcat/Specifications) (chapter 8) introduced support for several "plugability features". Those exist to simplify a structure of a web application and to simplify plugging of additional frameworks. Unfortunately, these features require scanning of JAR and class files, which may take noticeable time. Conformance to the specification requires that the scanning were performed by default, but you can configure your own web application in several ways to avoid it (see below). It is also possible to configure which JARs Tomcat should skip. 

在[Servlet 3.0规范](https://wiki.apache.org/tomcat/Specifications) 的第8章, 引入了插件功能。 目的是精简web应用结构,并简化附加框架插件。杯具的是, 这种特性需要扫描所有的JAR包和类文件,这可能需要较长时间。规范要求, 默认情况下进行扫描; 但用户可以通过配置来禁用此功能(见下文). 也可以指定跳过哪些 jar 包的扫描。


For further talk, the features that require scanning are: 


Introduced by Servlet 3.0: 

下面是需要扫描 jar 包的功能,由 Servlet 3.0 引入:


*   SCI (`javax.servlet.ServletContainerInitializer`)
*   Web fragments (`META-INF/web-fragment.xml`)
*   Resources of a web application bundled in jar files (`META-INF/resources/*`)
*   Annotations that define components of a web application (`@WebServlet` etc.)
*   Annotations that define components for 3-rd party libraries initialized by an SCI (arbitrary annotations that are defined in `@HandlesTypes` annotation on a SCI class)

<hr/>

*   SCI (`javax.servlet.ServletContainerInitializer`)
*   Web fragments (`META-INF/web-fragment.xml`)
*   打包在jar文件中的WEB应用程序资源(`META-INF/resources/*`)
*   定义web应用组件的注解 (例如 `@WebServlet` 等注解.)
*   第三方库中定义组件的注解, 这些第三方库由 SCI 初始化, (由 `@HandlesTypes` 注解的 annotations)


Older features, introduced by earlier specifications: 

由更早的规范所引入的一些特性:


*   TLD scanning, (Discovery of tag libraries. Scans for Tag Library Descriptor files, `META-INF/**/*.tld`).

*   TLD扫描,(标签库/tag libraries 的查找。标签库描述文件的扫描, `META-INF/**/*.tld`).


Among the scans the annotation scanning is the slowest. That is because each class file (except ones in ignored JARs) has to be read and parsed looking for annotations in it. 

annotation 的扫描是最慢的。因为必须读取每个类文件, 并解析和查找注解(除非在忽略的jar文件中)。


An example of a container-provided SCI that triggers annotation scanning is the [WebSocket](https://wiki.apache.org/tomcat/WebSocket) API implementation which is included with standard distribution in all versions of Tomcat 8 and with Tomcat 7 starting with 7.0.47. An SCI class declared there triggers scanning for [WebSocket](https://wiki.apache.org/tomcat/WebSocket) endpoints (the classes annotated with `@ServerEndpoint` or implementing `ServerApplicationConfig` interface or extending the abstract `Endpoint` class). If you do not need support for [WebSockets](https://wiki.apache.org/tomcat/WebSockets), you may remove the [WebSocket](https://wiki.apache.org/tomcat/WebSocket) API and [WebSocket](https://wiki.apache.org/tomcat/WebSocket) implementation JARs from Tomcat (`websocket-api.jar` and `tomcat7-websocket.jar` or `tomcat-websocket.jar`). 

Tomcat 7.0.47 之后的版本,以及 Tomcat 8, 会触发扫描 [WebSocket](https://wiki.apache.org/tomcat/WebSocket) 注解的API实现. 包括 `@ServerEndpoint` 注解的类, 或者实现 `ServerApplicationConfig` 接口的类, 或者是集成了 abstract `Endpoint` 类。.如果你不需要支持 [WebSockets](https://wiki.apache.org/tomcat/WebSockets), 则可以删除Tomcal下, WebSocket 相关的 jar 包 (`websocket-api.jar` and `tomcat7-websocket.jar` or `tomcat-websocket.jar`)。


_A note on TLD scanning_: In Tomcat 7 and earlier the TLD scanning happens twice, 

注意: 在Tomcat 7以及更早的版本中, 会进行两次TLD扫描,


*   first, at startup time, to discover listeners declared in tld files (done by `TldConfig` class),
*   second, by JSP engine when generating java code for a JSP page (done by `TldLocationsCache`).

*   第一次,在启动时,查找 tld 文件这的 listeners(由`TldConfig`类完成),
*   第二次, 由JSP引擎为JSP页面生成java代码时执行(参考 `TldLocationsCache` 类)。


The second scanning is more noticeable, because it prints a diagnostic message about scanned JARs that contained no TLDs. In Tomcat 8 the TLD scanning happens only once at startup time (in `JasperInitializer`). 

第二次扫描比较明显,因为它会打印一些诊断信息,关于不包含 TLDs 的 JAR 包扫描信息. 在 Tomcat 8 启动时, 只扫描一次TLD, (在 `JasperInitializer` 类中)。


### Configure your web application

### 配置web应用


See chapter in [Tomcat 7 migration guide](http://tomcat.apache.org/migration-7.html#Annotation_scanning). 

参见: [Tomcat 7 migration guide](http://tomcat.apache.org/migration-7.html#Annotation_scanning).


There are two options that can be specified in your `WEB-INF/web.xml` file: 

可以在 `WEB-INF/web.xml` 文件中指定两个选项:


1.  Set `metadata-complete="true"` attribute on the `<web-app>` element.
2.  Add an empty `<absolute-ordering />` element.

<br/>

1. 设置 `<web-app>` 元素的属性 `metadata-complete="true"`。
2. 在其中添加一个空元素 `<absolute-ordering />`。
7  re4opppppppppppppppppppppppppoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo   
 o

  
  1


Setting `metadata-complete="true"` disables scanning your web application and its libraries for classes that use annotations to define components of a web application (Servlets etc.). The `metadata-complete` option is not enough to disable all of annotation scanning. If there is a SCI with a `@HandlesTypes` annotation, Tomcat has to scan your application for classes that use annotations or interfaces specified in that annotation. 

设置 `metadata-complete="true"` 可以禁用对web应用和库类的扫描, 主要是注解的扫描(例如 servlet)。 `metadata-complete`  选项并不能禁用所有的注解扫描. 比如存在 `@HandlesTypes` 注解的SCI, 则 Tomcat 必须扫描整个应用,以确定使用对应注解的类和接口。




The `<absolute-ordering>` element specifies which web fragment JARs (according to the names in their `WEB-INF/web-fragment.xml` files) have to be scanned for SCIs, fragments and annotations. An empty `<absolute-ordering/>` element configures that none are to be scanned. 

`<absolute-ordering>` 元素中直接指定了需要扫描哪些 JAR 包,其中包含 web fragment(在 `WEB-INF/web-fragment.xml` 文件指定), 包括 SCIs, fragments and annotations. 空元素 `<absolute-ordering/>` 则表示不需要扫描。


In Tomcat 7 the `absolute-ordering` option affects discovery both of SCIs provided by web application and ones provided by the container (i.e. by the libraries in `$CATALINA_HOME/lib`). In Tomcat 8 the option affects the web application ones only, while the container-provided SCIs are always discovered, regardless of `absolute-ordering`. In such case the `absolute-ordering` option alone does not prevent scanning for annotations, but the list of JARs to be scanned will be empty, and thus the scanning will complete quickly. The classes in `WEB-INF/classes` are always scanned regardless of `absolute-ordering`. 

在 Tomcat 7 中, `absolute-ordering` 选项同时影响应用程序的SCIs 和容器提供的SCIs(即 `$CATALINA_HOME/lib` 中定义的)。.在Tomcat 8中,该选择只影响web应用程序, 而容器提供的SCI则总是会被扫描, 无论是否指定 `absolute-ordering`. 在这种情况下, `absolute-ordering` 选项也不能阻止注解扫描, 但扫描的 JAR 包列表是空的, 因此扫描将会很快完成. 不管指定不指定 `absolute-ordering`, `WEB-INF/classes` 目录总是会被扫描。

Scanning for web application resources and TLD scanning are not affected by these options. 

这些选项并不会影响对web应用程序资源和TLD的扫描。


### Remove unnecessary JARs

### 删除不必要的JAR包


Remove any JAR files you do not need. When searching for classes every JAR file needs to be examined to find the needed class. If the jar file is not there - there is nothing to search. 

删除所有不必要的JAR包文件。JVM查找 class 时, 需要扫描每一个JAR文件,以找到所需的类。如果某个 jar 文件不存在, 自然就不需要去搜索他。


_Note_ that a web application should never have its own copy of Servlet API or Tomcat classes. All those are provided by the container (Tomcat) and should never be present in the web application. If you are using Apache Maven, such dependencies should be configured with `<scope>provided</scope>`. See also a [stackoverflow page](http://stackoverflow.com/questions/1031695/how-to-exclude-jars-generated-by-maven-war-plugin). 

**Note:** web应用程序不应该在类库这包含 Servlet API 和 Tomcat 相关的类。这些由容器(Tomcat)提供的东西都不应该出现在web应用程序中. 如果使用 Maven, 这些依赖应该配置为 `<scope>provided</scope>`。请参考 [stackoverflow页面](http://stackoverflow.com/questions/1031695/how-to-exclude-jars-generated-by-maven-war-plugin)。


### Exclude JARs from scanning

### 排除 JAR 包扫描


In Tomcat 7 JAR files can be excluded from scanning by listing their names or name patterns in a [system property](http://tomcat.apache.org/tomcat-7.0-doc/config/systemprops.html#JAR_Scanning). Those are usually configured in the `conf/catalina.properties` file. 

在 Tomcat 7 中,可以排除某些 JAR 文件的扫描, 通过 [system property](http://tomcat.apache.org/tomcat-7.0-doc/config/systemprops.html#JAR_Scanning) , 根据名称或者正则表达式 来进行排除. 通常配置在 `conf/catalina.properties` 文件中。


In Tomcat 8 there are several options available. You can use a [system property](http://tomcat.apache.org/tomcat-8.0-doc/config/systemprops.html#JAR_Scanning) or configure a `<JarScanFilter>` [element](http://tomcat.apache.org/tomcat-8.0-doc/config/jar-scan-filter.html) in the [context file](http://tomcat.apache.org/tomcat-8.0-doc/config/context.html) of your web application. 

在 Tomcat 8 中也有多个可选项。可以使用 [system property](http://tomcat.apache.org/tomcat-8.0-doc/config/systemprops.html#JAR_Scanning), 或者在web应用程序的 [context 文件](http://tomcat.apache.org/tomcat-8.0-doc/config/context.html) 中指定 [`<JarScanFilter>` 元素](http://tomcat.apache.org/tomcat-8.0-doc/config/jar-scan-filter.html) 。


### Disable WebSocket support

### 禁用WebSocket


There exists an attribute on `Context` element, `containerSciFilter`. It can be used to disable container-provided features that are plugged into Tomcat via SCI API: WebSocket support (in Tomcat 7 and later), JSP support (in Tomcat 8 and later). 

在 `Context` 元素中, 有一个 `containerSciFilter` 属性.  可以用来过滤 Tomcat容器提供的插件功能: 如 WebSocket支持(Tomcat 7 之后的版本), JSP支持(Tomcat 8 之后的版本)。


The class names to filter can be detected by looking into `META-INF/services/javax.servlet.ServletContainerInitializer` files in Tomcat JARs. For WebSocket support the name is `org.apache.tomcat.websocket.server.WsSci`, for JSP support the name is `org.apache.jasper.servlet.JasperInitializer`. 

可以在 JAR 文件的 `META-INF/services/javax.servlet.ServletContainerInitializer` 中配置需要过滤的类名。 WebSocket 相关的是 `org.apache.tomcat.websocket.server.WsSci`, JSP相关的是 `org.apache.jasper.servlet.JasperInitializer`. 



_TODO: How much faster does it make it? In short: Delays due to annotation scanning caused by WebSocket have been already mentioned in another paragraphs on this page. This is an alternative to removing websocket JARs from Tomcat installation._ 

_TODO:快多少呢?简而言之:延迟由于注释扫描引起的WebSocket已经另一个段落中提到的这个页面.这是一个选择删除从Tomcat installation._ websocket jar


References: [Bug 55855](https://bz.apache.org/bugzilla/show_bug.cgi?id=55855), [Tomcat 8 Context documentation](http://tomcat.apache.org/tomcat-8.0-doc/config/context.html) 

参考: [Bug 55855](https://bz.apache.org/bugzilla/show_bug.cgi?id=55855), [Tomcat 8 Context documentation](http://tomcat.apache.org/tomcat-8.0-doc/config/context.html) 


## Entropy Source

## 随机数熵源(Entropy Source)


Tomcat 7+ heavily relies on SecureRandom class to provide random values for its session ids and in other places. Depending on your JRE it can cause delays during startup if entropy source that is used to initialize SecureRandom is short of entropy. You will see warning in the logs when this happens, e.g.: 

Tomcat 7 及之后的版本, 严重依赖 SecureRandom 类, 用以提供随机值, 如 session id 以及其他地方. 如果JVM使用了阻塞式的随机数熵源, 并且熵源中的数据量不足, 就会导致启动期间卡顿或阻塞。阻塞时间较长时,将会看到一条警告日志,例如:


    <DATE> org.apache.catalina.util.SessionIdGenerator createSecureRandom
    INFO: Creation of SecureRandom instance for session ID generation using [SHA1PRNG] took [5172] milliseconds.

> 这只是卡顿了 `5` 秒左右, 现实情况中,可达上百秒, 视情况而定【MAVEN的某些插件也可能需要读取此随机源】。



There is a way to configure JRE to use a non-blocking entropy source by setting the following system property: `-Djava.security.egd=file:/dev/./urandom` 

可以通过系统属性, 让JVM使用非阻塞式的随机源: `-Djava.security.egd=file:/dev/./urandom` 


Note the "`/./`" characters in the value. They are needed to work around known [Oracle JRE bug #6202721](http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=6202721). See also [JDK Enhancement Proposal 123](http://openjdk.java.net/jeps/123). It is known that implementation of [SecureRandom](https://wiki.apache.org/tomcat/SecureRandom) was improved in Java 8 onwards. 

注意这里是 `/dev/./urandom` 。多配了一个 `./` 的原因是一个 [Oracle JRE bug #6202721](http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=6202721). 参见 [JDK Enhancement Proposal 123](http://openjdk.java.net/jeps/123)。 在 Java 8 中 [SecureRandom](https://wiki.apache.org/tomcat/SecureRandom) 的实现才修正了这个BUG。


Also note that replacing the blocking entropy source (/dev/random) with a non-blocking one actually reduces security because you are getting less-random data. If you have a problem generating entropy on your server (which is common), consider looking into entropy-generating hardware products such as "[EntropyKey](https://wiki.apache.org/tomcat/EntropyKey)". 

还要注意, 阻塞式的熵源(`/dev/random`) 安全性较高, 非阻塞式的熵源(`/dev/./urandom`) 安全性会低一些, 因为你要求非常高的随机数安全性. 请考虑使用硬件方式的熵源, 如 "[EntropyKey](https://wiki.apache.org/tomcat/EntropyKey)"。


## Starting several web applications in parallel

## 并行启动多个web应用程序


With Tomcat 7.0.23+ you can configure it to start several web applications in parallel. This is disabled by default but can be enabled by setting the `startStopThreads` attribute of a **Host** to a value greater than one. 

从 Tomcat 7.0.23+ 开始, 可以并行启动多个web应用程序. 默认情况下是禁用的, 但可以设置 **Host** 元素的 `startStopThreads` 属性值, 大于1即可。


## Other

## 其他


### Memory

### 内存


Tweak memory parameters - Google is your friend. 

调整内存参数 —— 请使用 Google 搜索。


### Config

### 配置


Trim the config files as much as possible. XML parsing is not cheap. The less there is to parse - the faster things will go. 

尽可能地减少配置文件。XML解析的代价并不低。需要解析的东西越少, 自然就会越快。


### Web application

### Web 应用程序


1.  Remove any web applications that you do not need. (So remove the all the web applications installed with tomcat)
2.  Make sure your code is not doing slow things. (Use a profiler)

<br/>

1. 删除所有不需要的 web应用程序。(所以在安装 tomcat 之后, 删除 webapps 目录下所有的应用程序)
2. 确保程序代码的效率。(可以使用 profiler)



原文链接: [https://wiki.apache.org/tomcat/HowTo/FasterStartUp](https://wiki.apache.org/tomcat/HowTo/FasterStartUp)





