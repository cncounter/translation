# 5.3 Packaging Web Archives

# 5.3 Java Web应用目录结构

In the Java EE architecture, a **web module** is the smallest deployable and usable unit of web resources. A web module contains web components and static web content files, such as images, which are called **web resources**. A Java EE web module corresponds to a web application as defined in the Java Servlet specification.

web模块, 也就是 Servlet 规范中的web应用。在Java EE架构中, **web模块(web module)** 是最小的web部署单元。 其中包含web组件以及静态资源; 如图片之类的静态资源也被称为 **web资源**。 

In addition to web components and web resources, a web module can contain other files:

除web组件和web资源以外, web模块中还可以包含其他文件:

- Server-side utility classes, such as shopping carts

- Client-side classes, such as utility classes

- 服务端运行所需的工具类

- 客户端类, 主要是 Applet 和相关依赖, 基本上已废弃。

A web module has a specific structure. The top-level directory of a web module is the **document root** of the application. The document root is where XHTML pages, client-side classes and archives, and static web resources, such as images, are stored.

web模块有特定的结构。顶层目录对应Web应用的 **document root**. 可以存放 HTML页面, 静态web资源等等。

The document root contains a subdirectory named `WEB-INF`, which can contain the following files and directories:

根目录下面包含一个 `WEB-INF` 文件夹, 其中可以包含以下文件和目录:

- `classes`, a directory that contains server-side classes: servlets, enterprise bean class files, utility classes, and JavaBeans components

- `lib`, a directory that contains JAR files that contain enterprise beans, and JAR archives of libraries called by server-side classes

- Deployment descriptors, such as `web.xml` (the web application deployment descriptor) and `ejb-jar.xml` (an EJB deployment descriptor)


- `classes` 目录, 存放服务端相关的 class: 如 servlet、bean, 工具类, 以及运行时资源, 如XML,配置文件等等。

- `lib` 目录, 其中存放各种 JAR 文件

- 部署说明信息(Deployment descriptors), 如 `web.xml`(web应用程序部署信息)。

A web module needs a `web.xml` file if it uses JavaServer Faces technology, if it must specify certain kinds of security information, or if you want to override information specified by web component annotations.

使用 JavaServer Face 技术时, 如果需要指定特别的安全信息, 或者覆盖 web component 上的注解配置, 则需要通过 `web.xml` 文件来指定。

You can also create application-specific subdirectories (that is, package directories) in either the document root or the `WEB-INF/classes/` directory.

根据需要, 在根目录和 `WEB-INF/classes/` 下面, 可以添加文件夹或package。

A web module can be deployed as an unpacked file structure or can be packaged in a JAR file known as a Web Archive (WAR) file. Because the contents and use of WAR files differ from those of JAR files, WAR file names use a `.war` extension. The web module just described is portable; you can deploy it into any web container that conforms to the Java Servlet specification.

web模块可以解压为文件夹来部署, 也可以部署为单个WAR包(Web Archive), 本质上WAR包是一个ZIP格式的JAR文件. 因为WAR里面的内容和常规的JAR不同, 所以使用 `.war` 后缀来区分。 web模块具有可移植性(portable); 能部署到符合Java Servlet规范的各种web容器里。


web模块结构。根目录下面包含 `WEB-INF`和web页面/目录。WEB-INF下面包含 lib 和 classes 目录。


```
└── index.jsp
└── WEB-INF
    └── web.xml
    └── lib
        └── xxx-1.0.jar
    └── classes
        └── com/package/xxx/XXXServlet.class
        └── xxx.properties
```



原文链接: <https://docs.oracle.com/javaee/7/tutorial/packaging003.htm>
