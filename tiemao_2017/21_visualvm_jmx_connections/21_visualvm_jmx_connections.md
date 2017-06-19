# Java VisualVM - Connecting to JMX Agents Explicitly

Java Management Extensions (JMX) technology can be used to monitor and manage any Java technology-based applications (Java applications) that are running in either a local or a remote Java Virtual Machine (JVM). Java applications are automatically exposed for monitoring and management by JMX agents if they are run on the Java platform, Standard Edition (Java SE platform) version 6. If the Java applications are running on the Java 2 platform, Standard Edition (J2SE platform) 5.0, you can expose them manually for monitoring and management by setting the com.sun.management.jmxremote.* system properties when the applications are launched. Setting these system properties, or running your applications on version 6 of the Java SE platform, enables the platform's *out-of-the-box* monitoring and management capability, automatically enabling the platform MBean server in the JVM software, and registering MBeans in it that expose the application for management by any appropriately configured JMX client application. VisualVM is one such JMX client application.

**NOTE**: For a very brief introduction to JMX technology, MBeans, the platform MBean server, and how to monitor and manage MBeans using Java VisualVM, see the [Java VisualVM MBeans Tab](http://visualvm.java.net/mbeans_tab.html) page. For an introduction to the Java SE platform's out-of-the-box monitoring and management capability, see [*Monitoring and Management Using JMX Technology*](http://docs.oracle.com/javase/8/docs/technotes/guides/management/agent.html) in the [Java SE Platform Monitoring and Management Guide](http://docs.oracle.com/javase/8/docs/technotes/guides/management/toc.html).

## When Are Explicit JMX Connections Necessary?

As stated above, Java VisualVM will automatically detect and connect to Java applications that are running on version 6 of the Java SE platform or that have been started with the correct system properties on version 5.0. However, because there are cases in which Java VisualVM cannot automatically discover and connect to JMX agents that are running in a target Java application, a means of creating explicit JMX connections has also been added to Java VisualVM.

The circumstances in which Java VisualVM will not automatically discover JMX agents, and thus the Java applications they expose, are the following:

- The target application is running on the J2SE 5.0 platform and the  -Dcom.sun.management.jmxremote* properties have not  been specified.
- The target application is running on the same host as Java VisualVM but was started by a different user than the one who started Java VisualVM. Java VisualVM discovers running applications using the `jps` tool ([Solaris, Linux, or Mac OS X](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/jps.html) or [Windows](http://docs.oracle.com/javase/8/docs/technotes/tools/windows/jps.html)), which can only discover Java applications started by  the same user as the one who starts the Java VisualVM tool.
- The target application is running on a remote host where `jstatd` ([Solaris, Linux, or Mac OS X](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/jstatd.html) or [Windows](http://docs.oracle.com/javase/8/docs/technotes/tools/windows/jstatd.html)) is not running or is running but was started by a different user. The `jstatd` daemon provides an interface that allows remote monitoring applications to connect to Java applications on the host where it is running.

## Making an Explicit JMX Connection

Before you can make an explicit JMX connection from Java VisualVM to a running application, this application must be started with the correct system properties. The system properties in question are the following:

- `com.sun.management.jmxremote.port`, to specify the port number through which the application will be exposed
- `com.sun.management.jmxremote.ssl`, to specify whether secure sockets layer (SSL) encryption will be activated to secure the connection to the application
- `com.sun.management.jmxremote.authenticate`, to specify whether the connection will be password protected

### Local JMX Connections

This section shows an example of how to connect Java VisualVM to a local application via an explicit JMX connection.

1. Start a Java application on the J2SE platform version 5.0, setting the system properties to enable the Java SE platform's out-of-the-box monitoring and management capability, using the command shown below:

   ```
   java -Dcom.sun.management.jmxremote.port=3333 \
        -Dcom.sun.management.jmxremote.ssl=false \
        -Dcom.sun.management.jmxremote.authenticate=false \
        YourJavaApp

   ```

   In the command above,

    

   *YourJavaApp*

    

   is launched with the Java SE platform's out-of-the-box monitoring and management capability configured as follows:

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



