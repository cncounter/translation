# How do I make Tomcat startup faster?

# 我如何使Tomcat启动更快?


Contents

内容


1.  [How do I make Tomcat startup faster?](#How_do_I_make_Tomcat_startup_faster.3F)

1. (我怎么使Tomcat启动更快?)(# How_do_I_make_Tomcat_startup_faster.3F)



        1.  [General](#General)
    2.  [JAR scanning](#JAR_scanning)




                1.  [Configure your web application](#Configure_your_web_application)
        2.  [Remove unnecessary JARs](#Remove_unnecessary_JARs)
        3.  [Exclude JARs from scanning](#Exclude_JARs_from_scanning)
        4.  [Disable WebSocket support](#Disable_WebSocket_support)
    3.  [Entropy Source](#Entropy_Source)
    4.  [Starting several web applications in parallel](#Starting_several_web_applications_in_parallel)
    5.  [Other](#Other)




                1.  [Memory](#Memory)
        2.  [Config](#Config)
        3.  [Web application](#Web_application)




This section provides several recommendations on how to make your web application and Apache Tomcat as a whole to start up faster. 

本节提供了一些建议关于如何使您的web应用程序作为一个整体和Apache Tomcat启动速度更快。


## General

## 一般


Before we continue to specific tips and tricks, the general advice is that if Tomcat hangs or is not responsive, you have to perform diagnostics. That is to **take several thread dumps** to see what Tomcat is really doing. See [Troubleshooting and Diagnostics](https://wiki.apache.org/tomcat/FAQ/Troubleshooting_and_Diagnostics) page for details. 

之前我们继续特定的技巧和窍门,一般建议是如果Tomcat挂起或不响应,你必须执行诊断.是* *需要几个线程转储* *看到Tomcat是做什么。看到(故障排除和诊断)(/ tomcat /常见问题/ Troubleshooting_and_Diagnostics)详情页面。


## JAR scanning

## JAR扫描


The [Servlet 3.0 specification](https://wiki.apache.org/tomcat/Specifications) (chapter 8) introduced support for several "plugability features". Those exist to simplify a structure of a web application and to simplify plugging of additional frameworks. Unfortunately, these features require scanning of JAR and class files, which may take noticeable time. Conformance to the specification requires that the scanning were performed by default, but you can configure your own web application in several ways to avoid it (see below). It is also possible to configure which JARs Tomcat should skip. 

[Servlet 3.0规范](/ tomcat /规格)(第八章)介绍了支持几个“更换功能”.那些存在简化web应用程序的结构和简化插入额外的框架.不幸的是,这些特性需要扫描的JAR和类文件,这可能需要明显的时间.符合规范要求的扫描进行默认情况下,但是你可以配置自己的web应用程序在几个方面来避免它(见下文).也可以配置哪些jar Tomcat应该跳过。


For further talk, the features that require scanning are: 

为进一步交谈,需要扫描的特性是:


Introduced by Servlet 3.0: 

介绍了通过Servlet 3.0:


*   SCI (`javax.servlet.ServletContainerInitializer`)
*   Web fragments (`META-INF/web-fragment.xml`)
*   Resources of a web application bundled in jar files (`META-INF/resources/*`)
*   Annotations that define components of a web application (`@WebServlet` etc.)
*   Annotations that define components for 3-rd party libraries initialized by an SCI (arbitrary annotations that are defined in `@HandlesTypes` annotation on a SCI class)

* SCI(“javax.servlet.ServletContainerInitializer”)
* Web片段(meta - inf / web-fragment.xml)
*一个web应用程序打包在jar文件资源(meta - inf /资源/ *)
*注释定义web应用程序的组件(“@WebServlet”等等)。
*注释为第三方库定义组件初始化的SCI(任意定义的注释“@HandlesTypes”注释在SCI类)


Older features, introduced by earlier specifications: 

年长的特性,引入了早些时候规格:


*   TLD scanning, (Discovery of tag libraries. Scans for Tag Library Descriptor files, `META-INF/**/*.tld`).

* TLD扫描,(发现标记库。标记库描述符文件扫描,meta - inf / * * / * . tld)。


Among the scans the annotation scanning is the slowest. That is because each class file (except ones in ignored JARs) has to be read and parsed looking for annotations in it. 

在扫描注释扫描是最慢的。这是因为每一个类文件(忽略的jar除外)必须读取和解析寻找注释。


An example of a container-provided SCI that triggers annotation scanning is the [WebSocket](https://wiki.apache.org/tomcat/WebSocket) API implementation which is included with standard distribution in all versions of Tomcat 8 and with Tomcat 7 starting with 7.0.47. An SCI class declared there triggers scanning for [WebSocket](https://wiki.apache.org/tomcat/WebSocket) endpoints (the classes annotated with `@ServerEndpoint` or implementing `ServerApplicationConfig` interface or extending the abstract `Endpoint` class). If you do not need support for [WebSockets](https://wiki.apache.org/tomcat/WebSockets), you may remove the [WebSocket](https://wiki.apache.org/tomcat/WebSocket) API and [WebSocket](https://wiki.apache.org/tomcat/WebSocket) implementation JARs from Tomcat (`websocket-api.jar` and `tomcat7-websocket.jar` or `tomcat-websocket.jar`). 

容器提供的一个例子SCI,触发注释扫描(WebSocket)(/ tomcat / WebSocket)API实现标准发行版附带的所有版本的 Tomcat 8和Tomcat 7 7.0.47入手.SCI类声明有触发扫描(WebSocket)(/ tomcat / WebSocket)端点(与“@ServerEndpoint”或注释的类实现接口或ServerApplicationConfig 扩展的抽象“端点”类).如果你不需要支持(尚)(/ tomcat / WebSockets),你可以删除(WebSocket)(/ tomcat / WebSocket)API和[WebSocket](/ tomcat / WebSocket)实现从tomcat(“websocket-api jar。jar”和“tomcat7-websocket。jar”或“tomcat-websocket.jar”)。


_A note on TLD scanning_: In Tomcat 7 and earlier the TLD scanning happens twice, 

TLD scanning_ _A注意:早些时候在Tomcat 7和TLD扫描发生两次,


*   first, at startup time, to discover listeners declared in tld files (done by `TldConfig` class),
*   second, by JSP engine when generating java code for a JSP page (done by `TldLocationsCache`).

*第一,在启动时,发现听众宣布在tld文件(由“TldConfig”类),
*第二,由JSP引擎当为JSP页面生成java代码(由“TldLocationsCache”)。


The second scanning is more noticeable, because it prints a diagnostic message about scanned JARs that contained no TLDs. In Tomcat 8 the TLD scanning happens only once at startup time (in `JasperInitializer`). 

第二个扫描比较明显,因为它打印一个诊断信息扫描jar包含没有tld.在Tomcat 8 TLD在启动时扫描只发生一次(在“JasperInitializer”)。


### Configure your web application

### 配置您的web应用程序


See chapter in [Tomcat 7 migration guide](http://tomcat.apache.org/migration-7.html#Annotation_scanning). 

见宏伟Tomcat[7](移徙http://tomcat.apache.org/migration-7.html # Annotation_scanning指南)。


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

### 删除不必要的罐子


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

## 熵源


Tomcat 7+ heavily relies on SecureRandom class to provide random values for its session ids and in other places. Depending on your JRE it can cause delays during startup if entropy source that is used to initialize SecureRandom is short of entropy. You will see warning in the logs when this happens, e.g.: 

Tomcat 7 +严重依赖SecureRandom类为其提供随机值会话id和在其他地方.根据您的JRE可以导致延迟启动期间如果熵源,用于初始化SecureRandom短暂的熵。您将看到警告日志中,当这一切发生的时候,例如:


    <DATE> org.apache.catalina.util.SessionIdGenerator createSecureRandom
    INFO: Creation of SecureRandom instance for session ID generation using [SHA1PRNG] took [5172] milliseconds.




There is a way to configure JRE to use a non-blocking entropy source by setting the following system property: `-Djava.security.egd=file:/dev/./urandom` 

有一种方法可以配置JRE以使用一个非阻塞的熵源通过设置系统属性:“-Djava.security.egd =文件:/ dev / / urandom’。


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





