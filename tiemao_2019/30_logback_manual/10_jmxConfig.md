# Chapter 10: JMX Configurator

As its name indicates, `JMXConfigurator` allows configuration of logback via JMX. In a nutshell, it lets you reconfigure logback from the default configuration file, from a designated file or URL, list loggers and modify logger levels.

### Using the JMX Configurator

If your server run on JDK 1.6 or later, then you can just invoke the `jconsole` application on the command line and then connect to your server's MBeanServer. If you are running an older JVM, then you should read the section on [JMX enabling your server](http://logback.qos.ch/manual/jmxConfig.html#jmxEnablingServer).

`JMXConfigurator` is enabled by a single line in your logback configuration file, as shown below:

```
<configuration>
  <jmxConfigurator />
  
  <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
    <layout class="ch.qos.logback.classic.PatternLayout">
      <Pattern>%date [%thread] %-5level %logger{25} - %msg%n</Pattern>
    </layout>
  </appender>

  <root level="debug">
    <appender-ref ref="console" />
  </root>  
</configuration>
```

After you connect to your server with *jconsole*, on the MBeans panel, under "ch.qos.logback.classic.jmx.Configurator" folder you should see several operations to choose from, as shown in the figure below:

### Screen-shot of `JMXConfigurator` viewed in `jconsole`

![jmxConfigurator](http://logback.qos.ch/manual/images/chapters/jmxConfigurator/jmxConfigurator.gif)

Thus, you can

- Reload logback configuration using the default configuration file.
- Reload the configuration with the specified URL.
- Reload the configuration with the specified file.
- Set the level of a specified logger. To set to null, pass the string "null" as value.
- Get the level of a specified logger. The returned value can be null.
- Get the [effective level](http://logback.qos.ch/manual/architecture.html#effectiveLevel) of a specified logger.

`JMXConfigurator` exposes the list of existing loggers and a status list as attributes.

The status list can help you diagnose logback's internal state.

![statusList.gif](http://logback.qos.ch/manual/images/chapters/jmxConfigurator/statusList.gif)

### Avoiding memory leaks

If your application is deployed in a web-server or an application server, the registration of an `JMXConfigurator` instance creates a reference from the system class loader into your application which will prevent it from being garbage collected when it is stopped or re-deployed, resulting in a severe memory leak.

Thus, unless your application is a standalone Java application, you MUST unregister the `JMXConfigurator` instance from the JVM's Mbeans server. Invoking the `reset`() method of the appropriate `LoggerContext` will automatically unregister any JMXConfigurator instance. A good place to reset the logger context is in the `contextDestroyed`() method of a `javax.servlet.ServletContextListener`. Here is sample code:

```
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.slf4j.LoggerFactory;
import ch.qos.logback.classic.LoggerContext;

public class MyContextListener implements ServletContextListener {

  public void contextDestroyed(ServletContextEvent sce) {
    LoggerContext lc = (LoggerContext) LoggerFactory.getILoggerFactory();
    lc.stop();
  }

  public void contextInitialized(ServletContextEvent sce) {
  }
} 
```

## `JMXConfigurator` with multiple web-applications

If you deploy multiple web-applications in the same server, and if you have not overridden the default [context selector](http://logback.qos.ch/manual/contextSelector.html), and if you have placed a copy of *logback-\*.jar* and *slf4j-api.jar* under the *WEB-INF/lib* folder of each web-application, then by default each `JMXConfigurator` instance will be registered under the same name, that is, "ch.qos.logback.classic:Name=default,Type=ch.qos.logback.classic.jmx.JMXConfigurator". In other words, by default the various `JMXConfigurator` instances associated with the logger contexts in each of your web-applications will collide.

To avoid such undesirable collisions, you simply [set the name of your application's logging context](http://logback.qos.ch/manual/configuration.html#contextName) and `JMXConfigurator` will automatically use the name you have set.

For example, if you deploy two web-applications named "Koala" and "Wombat", then you would write in Koala's logback configuration

```
<configuration>
  <contextName>Koala</contextName>
  <jmxConfigurator/>
  ...
<configuration>
```

and in Wombat logback configuration file, you would write:

```
<configuration>
  <contextName>Wombat</contextName>x
  <jmxConfigurator/>
  ...
<configuration>
```

In jconsole's MBeans panel, you would see two distinct `JMXConfigurator` instances:

![multiple.gif](http://logback.qos.ch/manual/images/chapters/jmxConfigurator/multiple.gif)

You may fully control the name under which JMXConfigurator is registered with an MBeans server with the help of the "objectName" attribute of the `` element.

### JMX enabling your server

If your server runs with JDK 1.6 or later, your server should be JMX enabled by default.

For older JVMs, we suggest that you refer to the JMX-related documentation of your web-server. Such documentation is available for both [Tomcat](http://tomcat.apache.org/tomcat-6.0-doc/monitoring.html) and [Jetty](http://docs.codehaus.org/display/JETTY/JMX). In this document, we briefly describe the required configuration steps for Tomcat and Jetty.

#### Enabling JMX in Jetty (tested under JDK 1.5 and JDK 1.6)

The following has been tested under JDK 1.5 and 1.6. Under JDK 1.6 and later, your server is JMX enabled by default and you can, but do not need to, follow the steps discussed below. Under JDK 1.5, adding JMX support in Jetty requires a number of additions to the *$JETTY_HOME/etc/jetty.xml* configuration file. Here are the elements that need to be added:

```
<Call id="MBeanServer" class="java.lang.management.ManagementFactory" 
      name="getPlatformMBeanServer"/>

<Get id="Container" name="container">
  <Call name="addEventListener">
    <Arg>
      <New class="org.mortbay.management.MBeanContainer">
        <Arg><Ref id="MBeanServer"/></Arg>
        <Call name="start" />
      </New>
    </Arg>
  </Call>
</Get> 
```

If you wish to access the MBeans exposed by Jetty via the `jconsole` application, then you need to start Jetty after having set the "com.sun.management.jmxremote" Java system property.

For a standalone version of Jetty, this translates to:

java **-Dcom.sun.management.jmxremote** -jar start.jar [config files]

And if you wish to launch Jetty as a Maven plugin, then you need to set the "com.sun.management.jmxremote" system property via the `MAVEN_OPTS` shell variable:

**MAVEN_OPTS="-Dcom.sun.management.jmxremote**" mvn jetty:run

You can then access the MBeans exposed by Jetty as well as logback's `JMXConfigurator` via `jconsole`.

![jconsole15_jetty.gif](http://logback.qos.ch/manual/images/chapters/jmxConfigurator/jconsole15_jetty.gif)

After you are connected, you should be able to access `JMXXConfigurator` as shown in the [screenshot](http://logback.qos.ch/manual/jmxConfig.html#jmxConfigurator) above.

#### MX4J with Jetty (tested under JDK 1.5 and 1.6)

If you wish to access `JMXConfigurator` via MX4J's HTTP interface and assuming you have already downloaded [MX4J](http://mx4j.sourceforge.net/), you then need to modify the Jetty configuration file discussed previously by adding an instruction to set the management port.

```
<Call id="MBeanServer"
    class="java.lang.management.ManagementFactory"
    name="getPlatformMBeanServer"/>

<Get id="Container" name="container">
  <Call name="addEventListener">
    <Arg>
      <New class="org.mortbay.management.MBeanContainer">
        <Arg><Ref id="MBeanServer"/></Arg>
        <Set name="managementPort">8082</Set>
        <Call name="start" />
      </New>
    </Arg>
  </Call>
</Get> 
    
```

Moreover, *mx4j-tools.jar* needs to be added to Jetty's class path.

If you are running Jetty as a Maven plug-in, then you need to add *mx4j-tools* as a dependency.

```
<plugin>
  <groupId>org.mortbay.jetty</groupId>
  <artifactId>maven-jetty-plugin</artifactId>
  <configuration>
    <jettyConfig>path/to/jetty.xml</jettyConfig>
    ...
  </configuration>
  <dependencies>
    <dependency>
      <groupId>mx4j</groupId>
      <artifactId>mx4j-tools</artifactId>
      <version>3.0.1</version>
    </dependency>
  </dependencies>
</plugin>
```

After Jetty is started with the above configuration, `JMXConfigurator` will be available at the following URL (search for "ch.qos.logback.classic"):

http://localhost:8082/

Below is a screen shot view of the MX4J interface.

![mx4j_jetty.gif](http://logback.qos.ch/manual/images/chapters/jmxConfigurator/mx4j_jetty.gif)

#### Configuring JMX for Tomcat (tested under JDK 1.5 and 1.6)

If you are using JDK 1.6 and later, your server is already JMX enabled by default and you can, but do not need to, follow the steps discussed below. Under JDK 1.5, Tomcat requires the addition of the following lines to the *$TOMCAT_HOME/bin/catalina.bat/sh* shell script:

CATALINA_OPTS="-Dcom.sun.management.jmxremote"

Once started with these options, MBeans exposed by Tomcat as well logback's `JMXConfigurator` can be accessed with `jconsole` by issuing the following command in a shell:

jconsole

![jconsole15_tomcat.gif](http://logback.qos.ch/manual/images/chapters/jmxConfigurator/jconsole15_tomcat.gif)

After you are connected, you should be able to access `JMXXConfigurator` as shown in the [screenshot](http://logback.qos.ch/manual/jmxConfig.html#jmxConfigurator) above.

#### MX4J with Tomcat (tested under JDK 1.5 and 1.6)

You might prefer to access JMX components via a web-based interface provided by MX4J. In that case, here are the required steps:

Assuming you have already downloaded [MX4J](http://mx4j.sourceforge.net/), place the *mx4j-tools.jar* file under the *$TOMCAT_HOME/bin/* directory. Then, add the following lines to the *$TOMCAT_HOME/bin/catalina.sh* configuration file:

<!-- at the beginning of the file --> CATALINA_OPTS="-Dcom.sun.management.jmxremote" <!-- in the "Add on extra jar files to CLASSPATH" section --> CLASSPATH="$CLASSPATH":"$CATALINA_HOME"/bin/mx4j-tools.jar

Finally, declare a new `Connector` in the *$TOMCAT_HOME/conf/server.xml* file:

```
<Connector port="0" 
  handler.list="mx"
  mx.enabled="true" 
  mx.httpHost="localhost" 
  mx.httpPort="8082" 
  protocol="AJP/1.3" />
```

Once Tomcat is started, you should be able to find JMXConfigurator by pointing your browser at the following URL (search for "ch.qos.logback.classic"):

http://localhost:8082/

Below is a screen shot view of the MX4J interface.

![mx4j_tomcat.gif](http://logback.qos.ch/manual/images/chapters/jmxConfigurator/mx4j_tomcat.gif)



<http://logback.qos.ch/manual/jmxConfig.html>