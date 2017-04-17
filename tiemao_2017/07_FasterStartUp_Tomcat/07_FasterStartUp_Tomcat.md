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

有两个选项,可以在你指定的web - inf /。xml的文件:


1.  Set `metadata-complete="true"` attribute on the `&lt;web-app&gt;` element.
2.  Add an empty `&lt;absolute-ordering /&gt;` element.

1. 设置“metadata-complete = " true "属性“& lt;web-app&gt;”元素。
2. 添加一个空的& lt;absolute-ordering /祝辞的元素。



Setting `metadata-complete="true"` disables scanning your web application and its libraries for classes that use annotations to define components of a web application (Servlets etc.). The `metadata-complete` option is not enough to disable all of annotation scanning. If there is a SCI with a `@HandlesTypes` annotation, Tomcat has to scan your application for classes that use annotations or interfaces specified in that annotation. 

设置“metadata-complete = " true "的禁用扫描您的web应用程序和它的库类,使用注解来定义组件的web应用程序(servlet等)。.“metadata-complete”选项禁用所有注释扫描是不够的.如果有一个科学的@HandlesTypes注释,Tomcat必须扫描应用程序使用注释的类或接口中指定注释。


The `&lt;absolute-ordering&gt;` element specifies which web fragment JARs (according to the names in their `WEB-INF/web-fragment.xml` files) have to be scanned for SCIs, fragments and annotations. An empty `&lt;absolute-ordering/&gt;` element configures that none are to be scanned. 

“& lt;absolute-ordering&gt”元素指定哪个web片段jar(根据名字' - inf / web-fragment。xml的文件)必须扫描者,碎片和注释.空”& lt;absolute-ordering /比,“元素配置没有扫描。


In Tomcat 7 the `absolute-ordering` option affects discovery both of SCIs provided by web application and ones provided by the container (i.e. by the libraries in `$CATALINA_HOME/lib`). In Tomcat 8 the option affects the web application ones only, while the container-provided SCIs are always discovered, regardless of `absolute-ordering`. In such case the `absolute-ordering` option alone does not prevent scanning for annotations, but the list of JARs to be scanned will be empty, and thus the scanning will complete quickly. The classes in `WEB-INF/classes` are always scanned regardless of `absolute-ordering`. 

Tomcat 7 ' absolute-ordering '选项影响发现的损伤者提供的web应用程序容器提供的和1(即由图书馆CATALINA_HOME美元/ lib).在Tomcat 8选择影响web应用程序的,而容器提供者总是发现,无论“absolute-ordering”.在这种情况下,“absolute-ordering”选项并不能阻止扫描注释,但罐子被扫描的列表是空的,因此扫描将会很快完成.类的web - inf / classes总是扫描无论“absolute-ordering”。


Scanning for web application resources and TLD scanning are not affected by these options. 

扫描为web应用程序资源和TLD扫描不受这些选项的影响。


### Remove unnecessary JARs

### 删除不必要的JARs


Remove any JAR files you do not need. When searching for classes every JAR file needs to be examined to find the needed class. If the jar file is not there - there is nothing to search. 

你不需要删除任何JAR文件。搜索类时需要检查每个JAR文件找到所需的类。如果jar文件是不存在的,没有搜索。


_Note_ that a web application should never have its own copy of Servlet API or Tomcat classes. All those are provided by the container (Tomcat) and should never be present in the web application. If you are using Apache Maven, such dependencies should be configured with `&lt;scope&gt;provided&lt;/scope&gt;`. See also a [stackoverflow page](http://stackoverflow.com/questions/1031695/how-to-exclude-jars-generated-by-maven-war-plugin). 

_Note_ web应用程序不应该有自己的Tomcat Servlet API或类的副本。所有这些都由容器提供(Tomcat)和不应该出现在web应用程序中.如果您正在使用Apache Maven,这些依赖关系应该配置了“& lt;scope&gt provided&lt;/ scope&gt;”。参见[stackoverflow页面](http://stackoverflow.com/questions/1031695/how-to-exclude-jars-generated-by-maven-war-plugin)。


### Exclude JARs from scanning

### 罐排除在扫描


In Tomcat 7 JAR files can be excluded from scanning by listing their names or name patterns in a [system property](http://tomcat.apache.org/tomcat-7.0-doc/config/systemprops.html#JAR_Scanning). Those are usually configured in the `conf/catalina.properties` file. 

在Tomcat 7 JAR文件可以被排除在扫描通过列出他们的名字或名称模式(系统属性)(http://tomcat.apache.org/tomcat - 7.0 - doc/config/systemprops.html # JAR_Scanning).configured in the身上are教育法,到了conf / catalina。化学特性施用的牵头机构。


In Tomcat 8 there are several options available. You can use a [system property](http://tomcat.apache.org/tomcat-8.0-doc/config/systemprops.html#JAR_Scanning) or configure a `&lt;JarScanFilter&gt;` [element](http://tomcat.apache.org/tomcat-8.0-doc/config/jar-scan-filter.html) in the [context file](http://tomcat.apache.org/tomcat-8.0-doc/config/context.html) of your web application. 

在Tomcat there are也可选择8。你可以使用property][system(http://tomcat.apache.org/tomcat-8.0-doc/config/systemprops.html # JAR_Scanning)或设置为“&lt;JarScanFilter&gt;“[](部件)在http://tomcat.apache.org/tomcat-8.0-doc/config/jar-scan-filter.html[2003](http://tomcat.apache.org/tomcat-8 file.0-doc / config / context.html)的web应用程序。


### Disable WebSocket support

### 禁用WebSocket支持


There exists an attribute on `Context` element, `containerSciFilter`. It can be used to disable container-provided features that are plugged into Tomcat via SCI API: WebSocket support (in Tomcat 7 and later), JSP support (in Tomcat 8 and later). 

存在在上下文的一个属性元素,“containerSciFilter”.它可以用来插入Tomcat容器提供禁用特性通过SCI API:WebSocket支持(在Tomcat 7后来),JSP支持(在Tomcat中8,后来)。


The class names to filter can be detected by looking into `META-INF/services/javax.servlet.ServletContainerInitializer` files in Tomcat JARs. For WebSocket support the name is `org.apache.tomcat.websocket.server.WsSci`, for JSP support the name is `org.apache.jasper.servlet.JasperInitializer`. 

类名称过滤可以被研究的meta - inf /服务/ javax.servlet。在Tomcat jar ServletContainerInitializer”文件。WebSocket支持它的名字是“org.apache.tomcat.websocket.server。WsSci”,JSP支持名字是“org.apache.jasper.servlet.JasperInitializer”。


_TODO: Configuration example_ 

_TODO:配置example_


_TODO: How much faster does it make it? In short: Delays due to annotation scanning caused by WebSocket have been already mentioned in another paragraphs on this page. This is an alternative to removing websocket JARs from Tomcat installation._ 

_TODO:快多少呢?简而言之:延迟由于注释扫描引起的WebSocket已经另一个段落中提到的这个页面.这是一个选择删除从Tomcat installation._ websocket jar


References: [Bug 55855](https://bz.apache.org/bugzilla/show_bug.cgi?id=55855), [Tomcat 8 Context documentation](http://tomcat.apache.org/tomcat-8.0-doc/config/context.html) 

引用:错误55855(https://bz.apache.org/bugzilla/show_bug.cgi?id=55855),(Tomcat 8上下文文档)(http://tomcat.apache.org/tomcat - 8.0 - doc/config/context.html)


## Entropy Source

## 随机数熵源(Entropy Source)


Tomcat 7+ heavily relies on SecureRandom class to provide random values for its session ids and in other places. Depending on your JRE it can cause delays during startup if entropy source that is used to initialize SecureRandom is short of entropy. You will see warning in the logs when this happens, e.g.: 

Tomcat 7 及之后的版本, 严重依赖 SecureRandom 类, 用于提供随机值, 如 session id 以及其他方面.如果JVM使用了阻塞式的随机数熵源, 并且熵源中的数据量不足, 就会导致启动期间卡顿或阻塞。阻塞时间较长时,将会看到一条警告日志,例如:


    <DATE> org.apache.catalina.util.SessionIdGenerator createSecureRandom
    INFO: Creation of SecureRandom instance for session ID generation using [SHA1PRNG] took [5172] milliseconds.

> 这只是卡顿了 `5` 秒左右, 现实情况中,可打上百秒, 视情况而定【MAVEN的某些插件也可能需要读取此随机源】。



There is a way to configure JRE to use a non-blocking entropy source by setting the following system property: `-Djava.security.egd=file:/dev/./urandom` 

可以设置系统属性, 让JVM使用非阻塞式的随机源: `-Djava.security.egd=file:/dev/./urandom` 


Note the "`/./`" characters in the value. They are needed to work around known [Oracle JRE bug #6202721](http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=6202721). See also [JDK Enhancement Proposal 123](http://openjdk.java.net/jeps/123). It is known that implementation of [SecureRandom](https://wiki.apache.org/tomcat/SecureRandom) was improved in Java 8 onwards. 

注意“/。/”字符值。他们需要解决已知(Oracle JRE错误# 6202721)(http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=6202721).参见[JDK增强提案123](http://openjdk.java.net/jeps/123)。众所周知,实现[SecureRandom](/ tomcat / SecureRandom)是改善Java 8起。


Also note that replacing the blocking entropy source (/dev/random) with a non-blocking one actually reduces security because you are getting less-random data. If you have a problem generating entropy on your server (which is common), consider looking into entropy-generating hardware products such as "[EntropyKey](https://wiki.apache.org/tomcat/EntropyKey)". 

还要注意,更换阻塞熵源(/ dev /随机)与非阻塞一个实际上会降低安全性,因为你得到了随机数据.如果你有一个问题在服务器上生成熵(这是很常见的),考虑调查entropy-generating硬件产品,如“EntropyKey(/ tomcat / EntropyKey)”。


## Starting several web applications in parallel

## 开始几个并行web应用程序


With Tomcat 7.0.23+ you can configure it to start several web applications in parallel. This is disabled by default but can be enabled by setting the `startStopThreads` attribute of a **Host** to a value greater than one. 

Tomcat 7.0.23 +您可以配置它开始几个并行web应用程序.启用该默认情况下是禁用的,但可以通过设置“startStopThreads”* *主* *的属性值大于1。


## Other

## 其他


### Memory

### 内存


Tweak memory parameters - Google is your friend. 

调整内存参数——Google是你的朋友。


### Config

### 配置


Trim the config files as much as possible. XML parsing is not cheap. The less there is to parse - the faster things will go. 

尽可能多的配置文件。XML解析是不便宜。有解析越少,事情会越快。


### Web application

### Web应用程序


1.  Remove any web applications that you do not need. (So remove the all the web applications installed with tomcat)2.  Make sure your code is not doing slow things. (Use a profiler)

1. 删除你不需要的任何web应用程序。(所以移除所有的web应用程序安装tomcat)2。确保您的代码是不做缓慢的事情。(使用一个分析器)



原文链接: [https://wiki.apache.org/tomcat/HowTo/FasterStartUp](https://wiki.apache.org/tomcat/HowTo/FasterStartUp)





