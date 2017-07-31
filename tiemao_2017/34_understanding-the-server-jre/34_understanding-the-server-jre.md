# Server JRE 简介


JRE 安装包可以在 Java SE Download 页面下载: <http://www.oracle.com/technetwork/java/javase/downloads/index.html>;

Java 相关的术语请参考: <http://www.oracle.com/technetwork/java/glossary-135216.html>.

The JRE is used to run a broad variety of Java programs including Java applications on desktops.  The JDK is for Java developers. It contains a complete JRE as described above and tools required to create Java programs, sign code, generate documentation, etc. The JDK also ships several tools meant to monitor and debug programs.

使用JRE运行多种Java程序包括Java应用程序在桌面。JDK的Java开发人员.它包含一个完整的JRE如上所述和工具需要创建Java程序,标志代码,生成文档,等等。JDK还船几个工具旨在监视和调试程序。

So where does the Server JRE fit in?  From the perspective of common server-side applications, the JRE is missing monitoring tools and, in the case of applications that compile Java source code at run-time, javac. On the other hand, the JDK includes additional functionality that system administrators may not need on their production systems like the Java Plugin for web browsers, auto update agents, and development tools like javadoc.

那么,服务器JRE适应?从常见的服务器端应用程序的角度来看,JRE缺少监控工具,对于应用程序在运行时编译Java源代码,javac.另一方面,JDK包含额外的功能,系统管理员可能不需要在他们的生产系统(比如Java插件的web浏览器,自动更新代理,javadoc和开发工具。

Enter the Server JRE: The Server JRE was designed for server-side applications by including just the commonly required features from the JRE and JDK. The Server JRE does not have a dedicated installer: It is simply a compressed directory for easier use.

输入服务器JRE:服务器JRE是专为服务器端应用程序,包括从JRE和JDK所需的一般特性.服务器JRE没有一个专门的安装程序:它只是一个压缩目录,用起来更方便。

**Will the Server JRE work for all server applications?**
No. If an application requires functionality outside of what is provided in the Server JRE, such as additional development tools or JavaFX, then the Server JRE would not be an adequate choice for that application.

* *所有服务器应用程序的服务器JRE工作吗? * *
没有.如果一个应用程序需要功能以外的服务器提供的JRE,如额外的开发工具或JavaFX,然后服务器JRE将不是一个适当的选择该应用程序。

**If the JDK is a super-set of the Server JRE, why not simply use that?**
Removing unused components decreases the potential attack surface, and the smaller size makes storage and deployment faster and easier.  On a Linux x64 system, the Server JRE 8 is around 40% of the size of the full JDK 8.

* *如果JDK的一个超集服务器JRE,为什么不直接使用? * *
删除未使用的组件降低了潜在的攻击表面,和较小的大小使存储和部署更快和更容易.x64的Linux系统上,服务器JRE 8是大约40%的完整大小的JDK 8。

**My software vendor claims their applications needs the JDK, but can I use the Server JRE instead?**
Please contact your software vendor and ask them if you may use the Server JRE instead of the full JDK.  If you have the ability to experiment – you should try it.  The Server JRE is always recommended where possible over the JDK for running applications.

* *我的软件供应商声称他们的应用程序需要JDK,但是我可以用服务器JRE呢? * *
请与您的软件供应商,询问他们是否可以使用服务器JRE代替完整的JDK。如果你有能力实验——你应该试一试.服务器JRE总是建议尽可能在JDK运行应用程序。

**Can I suggest changes for what is included in the Server JRE?**
Yes. The goal of the Server JRE is to provide the tools needed by most, but admittedly not all, server applications. We are constantly re-evaluating which components are included.

* *我可以建议修改为包含在服务器JRE是什么? * *
是的。服务器JRE的目标是提供大部分所需的工具,但显然不是全部,服务器应用程序。我们不断地重新评估哪些组件。





原文链接: <https://blogs.oracle.com/java-platform-group/understanding-the-server-jre>

