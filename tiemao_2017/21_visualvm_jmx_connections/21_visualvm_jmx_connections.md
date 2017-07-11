# Java VisualVM - Connecting to JMX Agents Explicitly

# Java VisualVM——明确JMX代理连接


Java Management Extensions (JMX) technology can be used to monitor and manage any Java technology-based applications (Java applications) that are running in either a local or a remote Java Virtual Machine (JVM). Java applications are automatically exposed for monitoring and management by JMX agents if they are run on the Java platform, Standard Edition (Java SE platform) version 6. If the Java applications are running on the Java 2 platform, Standard Edition (J2SE platform) 5.0, you can expose them manually for monitoring and management by setting the com.sun.management.jmxremote.* system properties when the applications are launched. Setting these system properties, or running your applications on version 6 of the Java SE platform, enables the platform's *out-of-the-box* monitoring and management capability, automatically enabling the platform MBean server in the JVM software, and registering MBeans in it that expose the application for management by any appropriately configured JMX client application. VisualVM is one such JMX client application.

Java管理扩展(JMX)技术可以用来监控和管理任何基于Java技术的应用程序(Java应用程序)运行在本地或远程Java虚拟 机(JVM)。为监控和管理Java应用程序自动曝光JMX代理如果他们运行在Java平台上,标准版(Java SE平台)版本6.如果Java应用程序运行在Java 2 platform,Standard Edition(J2SE平台)5.0,你可以让他们手动设置com.sun.management监视和管理.现在。*系统属性,当应用程序启动.设置这些系统属性,或者在版本6中运行您的应用程序的Java SE平台,使平台的开箱即用监控和管理能力,自动启用平台MBean服务器JVM中软件和注册MBean公开应用程序管理的任何适当配置JMX客户机应用程序.VisualVM就是这样一个JMX客户机应用程序。


**NOTE**: For a very brief introduction to JMX technology, MBeans, the platform MBean server, and how to monitor and manage MBeans using Java VisualVM, see the [Java VisualVM MBeans Tab](http://visualvm.java.net/mbeans_tab.html) page. For an introduction to the Java SE platform's out-of-the-box monitoring and management capability, see [*Monitoring and Management Using JMX Technology*](http://docs.oracle.com/javase/8/docs/technotes/guides/management/agent.html) in the [Java SE Platform Monitoring and Management Guide](http://docs.oracle.com/javase/8/docs/technotes/guides/management/toc.html).

* *注意* *:一个非常简短的JMX技术导论,MBean,平台MBean服务器,以及如何监视和管理使用Java VisualVM MBean,看到Java VisualVM MBeans选项卡(http:/ /visualvm.java.net/mbeans_tab.html)页次.介绍了Java SE平台的开箱即用的监视和管理能力,看到[*监视和管理使用JMX技术*](http://docs.oracle.com/javase/8/docs/technotes/guides/management/agent.html)(Java SE平台监控和管理指南)(http://docs.oracle.com/javase/8/docs/technotes/guides/management/toc.html)。


## When Are Explicit JMX Connections Necessary?

## 当显式的JMX连接有必要吗?


As stated above, Java VisualVM will automatically detect and connect to Java applications that are running on version 6 of the Java SE platform or that have been started with the correct system properties on version 5.0. However, because there are cases in which Java VisualVM cannot automatically discover and connect to JMX agents that are running in a target Java application, a means of creating explicit JMX connections has also been added to Java VisualVM.

如上所述,Java VisualVM将自动检测和连接到Java应用程序运行在Java SE平台的版本6或已经开始使用正确的系统属性版本 5.0.然而,因为在某些情况下,Java VisualVM不能自动发现和JMX代理连接到运行在目标Java应用程序,创建明确的JMX连接的手段也被添加到Java VisualVM。


The circumstances in which Java VisualVM will not automatically discover JMX agents, and thus the Java applications they expose, are the following:

Java VisualVM的情况下不会自动发现JMX代理,因此他们暴露的Java应用程序,如下:


- The target application is running on the J2SE 5.0 platform and the  -Dcom.sun.management.jmxremote* properties have not  been specified.
- The target application is running on the same host as Java VisualVM but was started by a different user than the one who started Java VisualVM. Java VisualVM discovers running applications using the `jps` tool ([Solaris, Linux, or Mac OS X](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/jps.html) or [Windows](http://docs.oracle.com/javase/8/docs/technotes/tools/windows/jps.html)), which can only discover Java applications started by  the same user as the one who starts the Java VisualVM tool.
- The target application is running on a remote host where `jstatd` ([Solaris, Linux, or Mac OS X](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/jstatd.html) or [Windows](http://docs.oracle.com/javase/8/docs/technotes/tools/windows/jstatd.html)) is not running or is running but was started by a different user. The `jstatd` daemon provides an interface that allows remote monitoring applications to connect to Java applications on the host where it is running.

- 目标应用程序是运行在J2SE 5.0平台和-Dcom.sun.management。现在没有指定*属性。
- 目标应用程序是运行在同一主机作为Java VisualVM但是是由一个不同的用户比Java VisualVM的人开始。Java VisualVM发现运行应用程序使用`jps`工具((Solaris、Linux或Mac OS X)(http://docs.oracle.com/javase/8/docs/technotes/tools/unix/jps.html)或(Windows)(http://docs.oracle.com/javase/8/docs/technotes/tools/windows/jps.html)),它只能通过相同的用户发现Java应用程序开始启动Java VisualVM工具的人。
- 目标应用程序是运行在远程主机上`jstatd`((Solaris、Linux或Mac OS X)(http://docs.oracle.com/javase/8/docs/technotes/tools/unix/jstatd.html)或(Windows)(http://docs.oracle.com/javase/8/docs/technotes/tools/windows/jstatd.html)不运行或运行但是由一个不同的用户。的`jstatd`守护进程提供了一个接口,允许远程监控应用程序连接到主机上的Java应用程序运行。



## Making an Explicit JMX Connection

## 做一个显式的JMX连接


Before you can make an explicit JMX connection from Java VisualVM to a running application, this application must be started with the correct system properties. The system properties in question are the following:

之前你可以显式的JMX连接从Java VisualVM运行的应用程序,这个应用程序必须启动正确的系统属性.系统属性的问题如下:


- `com.sun.management.jmxremote.port`, to specify the port number through which the application will be exposed
- `com.sun.management.jmxremote.ssl`, to specify whether secure sockets layer (SSL) encryption will be activated to secure the connection to the application
- `com.sun.management.jmxremote.authenticate`, to specify whether the connection will be password protected

- `com.sun.management.jmxremote.port`指定的端口号,应用程序将会暴露
- `com.sun.management.jmxremote.ssl`,指定是否安全套接字层(SSL)加密将激活安全连接到应用程序
- `com.sun.management.jmxremote.authenticate`指定是否将密码保护的连接



### Local JMX Connections

### 本地JMX连接


This section shows an example of how to connect Java VisualVM to a local application via an explicit JMX connection.

本节显示了一个示例Java VisualVM如何连接到本地应用程序通过一个显式的JMX连接。


1. Start a Java application on the J2SE platform version 5.0, setting the system properties to enable the Java SE platform's out-of-the-box monitoring and management capability, using the command shown below:

1. 在J2SE平台上启动Java应用程序版本5.0,设置系统属性来启用Java SE平台的开箱即用的监视和管理能力,使用的命令如下所示:



   ```
   java -Dcom.sun.management.jmxremote.port=3333 \
        -Dcom.sun.management.jmxremote.ssl=false \
        -Dcom.sun.management.jmxremote.authenticate=false \
        YourJavaApp

   ```


In the command above, *YourJavaApp* is launched with the Java SE platform's out-of-the-box monitoring and management capability configured as follows:




   - The application is exposed for monitoring and management via port 3333.
   - SSL encryption is deactivated.
   - Password authentication is deactivated.

2. Start Java VisualVM on the same machine.

3. In Java VisualVM's Applications window, right click on the Local machine and select 'Add JMX Connection'.

   ![Adding a JMX connection to the local host.](http://docs.oracle.com/javase/8/docs/technotes/guides/visualvm/images/add-jmx-local.png)

4. The Add JMX Connection dialog box opens.

   ![The Add JMX Connection dialog.](http://docs.oracle.com/javase/8/docs/technotes/guides/visualvm/images/add-jmx-connection-dialog.png)

   The host name localhost is already filled in. You only need to add the port number on which the application is exposed for monitoring and management.

5. Click OK. The JMX connection will appear in the application tree, with a special JMX connection icon.

   ![A JMX connection to the local host machine.](http://docs.oracle.com/javase/8/docs/technotes/guides/visualvm/images/jmx-icon.png)

6. Right click on the JMX connection, and select Open. The JVM software exposed via the JMX connection can now be monitored and managed via Java VisualVM.

   ![Monitoring an application via a JMX connection.](http://docs.oracle.com/javase/8/docs/technotes/guides/visualvm/images/jmx-connection-rhpanel.png)

### Remote JMX Connections

You can also make explicit JMX connections to applications running on remote hosts, as explained below:

1. Right click anywhere in the blank area under the application tree and select Add JMX Connection.

   ![Adding a JMX connection to a remote application.](http://docs.oracle.com/javase/8/docs/technotes/guides/visualvm/images/add-jmx-remote.png)

2. Provide the machine name and port number for a running JMX agent, that has been started with the appropriate system properties to allow remote management. Here the JMX agent has been exposed on port 2222 of the machine curcuma.![Adding a remote JMX connection.](http://docs.oracle.com/javase/8/docs/technotes/guides/visualvm/images/add-jmx-remote2.png)If you know that the JMX agent has been protected with a username and password, enter them in the Add JMX Connection dialog and specify whether you want the credentials to be saved so
   that when Java VisualVM restarts it will silently reconnect to the JMX agent without prompting the user for the security credentials again.

3. If the JMX connection is secured and you did not provide a username and password in the Add JMX Connection dialog, you will be prompted to provide a username and password.

   ![JMX connector security credentials.](http://docs.oracle.com/javase/8/docs/technotes/guides/visualvm/images/security-credentials.png)

4. If you know the correct username and password, the JMX connection will be established, and the JMX connection will appear in the application tree, with a special JMX connection icon.

   ![Remote JMX connection shown in application tree.](http://docs.oracle.com/javase/8/docs/technotes/guides/visualvm/images/remote-jmx-icon.png)

5. Right click on the remote JMX connection and select Open. You can now monitor and manage remote applications via the JMX connection, and manipulate any MBeans that are registered in the MBean server exposed by this connection (note that the Java VisualVM-MBeans plugin must be installed if you want to access to the MBeans tab.)

   ​

   ![MBeans in a remote MBean server.](http://docs.oracle.com/javase/8/docs/technotes/guides/visualvm/images/remote-jmx-mbeans.png)

## Further Reading About JMX Technology

For more information about JMX technology and monitoring and management of the Java SE platform, see the following documents.

- [JMX technology trail in the Java Tutorials](http://docs.oracle.com/javase/tutorial/jmx/index.html)
- [Java Management Extensions (JMX) product page](http://docs.oracle.com/javase/8/docs/technotes/guides/jmx/index.html)
- [Monitoring and Management documentation for the Java SE Platform](http://docs.oracle.com/javase/8/docs/technotes/guides/management/)





原文链接: <http://docs.oracle.com/javase/8/docs/technotes/guides/visualvm/jmx_connections.html>



