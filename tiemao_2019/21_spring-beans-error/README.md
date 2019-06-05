# Spring MVC找不到xsd文件等错误的原因分析


新搭建的框架, 访问SpringMVC的Controller时报 404 错误：

```

```

经排查发现映射了 `/*`: 

```
<mvc:resources mapping="/*" location="/" cache-period="86400"/>
```

注释掉之后,重新启动, 报500错误:

```
HTTP Status 500 - Servlet.init() for servlet mvc-dispatcher threw exception

javax.servlet.ServletException: Servlet.init() for servlet mvc-dispatcher threw exception

org.springframework.beans.factory.xml.XmlBeanDefinitionStoreException: 
  Line 10 in XML document from class path resource [spring/spring-mvc.xml] is invalid; 
  nested exception is 
  org.xml.sax.SAXParseException; lineNumber: 10; columnNumber: 31; cvc-elt.1: 找不到元素 'beans' 的声明。

```
将 logback 对应包的日志级别设置为DEBUG

```
<logger name="org.springframework.web" level="DEBUG" />
```

看后台日志的错误信息:

```
[2019-06-05 11:21:39  WARN org.springframework.beans.factory.xml.XmlBeanDefinitionReader:48 ] 
   Ignored XML validation warning org.xml.sax.SAXParseException: 
   schema_reference.4: 
   无法读取方案文档 'http://www.springframework.org/schema/beans/spring-beans-4.1.xsd', 
   原因为 1) 无法找到文档; 2) 无法读取文档; 3) 文档的根元素不是 <xsd:schema>。

Caused by: java.net.ConnectException: Connection timed out: connect

[2019-06-05 11:21:39 ERROR org.springframework.web.servlet.DispatcherServlet:492 ]
  Context initialization failed
  org.springframework.beans.factory.xml.XmlBeanDefinitionStoreException: 
  Line 10 in XML document from class path resource [spring/spring-mvc.xml] is invalid; 
  nested exception is org.xml.sax.SAXParseException; lineNumber: 10; columnNumber: 31; cvc-elt.1: 找不到元素 'beans' 的声明。

```

这就诡异了, 居然去线上下载了 xsd 文档。

从idea中点击 XML 声明中的xsd, 看到的目录居然是 plugins 中的:

```
... IntelliJ IDEA\plugins\Spring\lib\spring.jar!\resources\schemas\beans\spring-beans-4.1.xsd
```

赶紧看另一个正常的项目:

```
... spring-beans-4.2.5.RELEASE.jar!\org\springframework\beans\factory\xml\spring-beans-4.1.xsd
```

想想可能是依赖版本不对的原因, 排查一下, 发现了差异:

```
<spring.version>4.0.7.RELEASE</spring.version>

<org.springframework.version>4.2.5.RELEASE</org.springframework.version>
```

于是去查看 spring-beans-4.0.7 中附带的文件:

```
spring-beans-4.0.7.RELEASE.jar!\org\springframework\beans\factory\xml\

spring-beans-2.0.dtd
spring-beans-2.0.xsd
spring-beans-2.5.xsd
spring-beans-3.0.xsd
spring-beans-3.1.xsd
spring-beans-3.2.xsd
spring-beans-4.0.xsd
spring-tool-2.0.xsd
spring-tool-2.5.xsd
spring-tool-3.0.xsd
spring-tool-3.1.xsd
spring-tool-3.2.xsd
spring-tool-4.0.xsd
spring-util-2.0.xsd
spring-util-2.5.xsd
spring-util-3.0.xsd
spring-util-3.1.xsd
spring-util-3.2.xsd
spring-util-4.0.xsd
```

可以看到, spring-beans-4.0.7 内置了最高 4.0版本的xsd。

再看 spring-beans-4.2.5 中附带的文件:

```
spring-beans-4.2.5.RELEASE.jar!\org\springframework\beans\factory\xml\

spring-beans-2.0.dtd
spring-beans-2.0.xsd
spring-beans-2.5.xsd
spring-beans-3.0.xsd
spring-beans-3.1.xsd
spring-beans-3.2.xsd
spring-beans-4.0.xsd
spring-beans-4.1.xsd
spring-beans-4.2.xsd
spring-tool-2.0.xsd
spring-tool-2.5.xsd
spring-tool-3.0.xsd
spring-tool-3.1.xsd
spring-tool-3.2.xsd
spring-tool-4.0.xsd
spring-tool-4.1.xsd
spring-tool-4.2.xsd
spring-util-2.0.xsd
spring-util-2.5.xsd
spring-util-3.0.xsd
spring-util-3.1.xsd
spring-util-3.2.xsd
spring-util-4.0.xsd
spring-util-4.1.xsd
spring-util-4.2.xsd
```


可以看到, spring-beans-4.2.5 内置了最高 4.2版本的xsd。

问题原因找到了, Spring的版本过低，升级 Spring依赖的版本号, 或者降低 xsd 版本号都可以。

其他版本的原因也差不多。

很久以前，碰到的一个MyBatis与Spring设置的问题可能也是这个原因。 <https://blog.csdn.net/renfufei/article/details/39646207>


2019年6月5日

