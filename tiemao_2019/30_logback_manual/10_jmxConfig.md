# Chapter 10: JMX Configurator

# 第10章: JMXConfigurator

As its name indicates, `JMXConfigurator` allows configuration of logback via JMX. In a nutshell, it lets you reconfigure logback from the default configuration file, from a designated file or URL, list loggers and modify logger levels.

顾名思义，`JMXConfigurator` 允许通过 JMX 来配置 logback。简而言之，它让你可以从默认配置文件、指定文件或指定 URL 重新配置 logback，还可以列出 logger、修改 logger 级别。

### Using the JMX Configurator

### 使用 JMX Configurator

If your server run on JDK 1.6 or later, then you can just invoke the `jconsole` application on the command line and then connect to your server's MBeanServer. If you are running an older JVM, then you should read the section on [JMX enabling your server](http://logback.qos.ch/manual/jmxConfig.html#jmxEnablingServer).

如果你的服务器运行在 JDK 1.6 或更高版本上，那么直接在命令行执行 `jconsole`，然后连接到服务器的 MBeanServer 即可。如果你运行的是更老的 JVM，那么应该阅读 [让服务器支持 JMX](http://logback.qos.ch/manual/jmxConfig.html#jmxEnablingServer) 一节。

`JMXConfigurator` is enabled by a single line in your logback configuration file, as shown below:

只需在 logback 配置文件中加一行，就能启用 `JMXConfigurator`，如下所示：

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

用 *jconsole* 连接到你的服务器之后，在 MBeans 面板中，"ch.qos.logback.classic.jmx.Configurator" 目录下应该能看到若干可供选择的操作，如下图所示：

### Screen-shot of `JMXConfigurator` viewed in `jconsole`

### 在 `jconsole` 中查看 `JMXConfigurator` 的截图

![jmxConfigurator](http://logback.qos.ch/manual/images/chapters/jmxConfigurator/jmxConfigurator.gif)

Thus, you can

由此，你可以：

- Reload logback configuration using the default configuration file.
- Reload the configuration with the specified URL.
- Reload the configuration with the specified file.
- Set the level of a specified logger. To set to null, pass the string "null" as value.
- Get the level of a specified logger. The returned value can be null.
- Get the [effective level](http://logback.qos.ch/manual/architecture.html#effectiveLevel) of a specified logger.

- 使用默认配置文件重新加载 logback 配置。
- 使用指定的 URL 重新加载配置。
- 使用指定的文件重新加载配置。
- 设置指定 logger 的级别。要设为 null，把字符串 "null" 作为值传入即可。
- 获取指定 logger 的级别。返回值可能为 null。
- 获取指定 logger 的[有效级别](http://logback.qos.ch/manual/architecture.html#effectiveLevel)。

`JMXConfigurator` exposes the list of existing loggers and a status list as attributes.

`JMXConfigurator` 把现有 logger 的列表和状态列表作为属性暴露出来。

The status list can help you diagnose logback's internal state.

状态列表可以帮助你诊断 logback 的内部状态。

![statusList.gif](http://logback.qos.ch/manual/images/chapters/jmxConfigurator/statusList.gif)

### Avoiding memory leaks

### 避免内存泄漏

If your application is deployed in a web-server or an application server, the registration of an `JMXConfigurator` instance creates a reference from the system class loader into your application which will prevent it from being garbage collected when it is stopped or re-deployed, resulting in a severe memory leak.

如果你的应用部署在 web 服务器或应用服务器上，注册一个 `JMXConfigurator` 实例就会在系统类加载器与你的应用之间建立一条引用，导致应用在停止或重新部署时无法被垃圾回收，从而造成严重的内存泄漏。

Thus, unless your application is a standalone Java application, you MUST unregister the `JMXConfigurator` instance from the JVM's Mbeans server. Invoking the `reset`() method of the appropriate `LoggerContext` will automatically unregister any JMXConfigurator instance. A good place to reset the logger context is in the `contextDestroyed`() method of a `javax.servlet.ServletContextListener`. Here is sample code:

因此，除非你的应用是独立的 Java 应用，否则必须从 JVM 的 MBean 服务器中注销 `JMXConfigurator` 实例。调用相应 `LoggerContext` 的 `reset`() 方法会自动注销所有 JMXConfigurator 实例。重置 logger 上下文的合适位置是 `javax.servlet.ServletContextListener` 的 `contextDestroyed`() 方法。示例代码如下：

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

## 在多个 web 应用中使用 `JMXConfigurator`

If you deploy multiple web-applications in the same server, and if you have not overridden the default [context selector](http://logback.qos.ch/manual/contextSelector.html), and if you have placed a copy of *logback-\*.jar* and *slf4j-api.jar* under the *WEB-INF/lib* folder of each web-application, then by default each `JMXConfigurator` instance will be registered under the same name, that is, "ch.qos.logback.classic:Name=default,Type=ch.qos.logback.classic.jmx.JMXConfigurator". In other words, by default the various `JMXConfigurator` instances associated with the logger contexts in each of your web-applications will collide.

如果你把多个 web 应用部署到同一个服务器上，并且没有覆盖默认的 [context selector](http://logback.qos.ch/manual/contextSelector.html)，并且在每个 web 应用的 *WEB-INF/lib* 目录下都放了一份 *logback-\*.jar* 和 *slf4j-api.jar*，那么默认情况下每个 `JMXConfigurator` 实例都会注册在同一个名字下，即 "ch.qos.logback.classic:Name=default,Type=ch.qos.logback.classic.jmx.JMXConfigurator"。换句话说，默认情况下，各个 web 应用中与 logger 上下文关联的多个 `JMXConfigurator` 实例会发生冲突。

To avoid such undesirable collisions, you simply [set the name of your application's logging context](http://logback.qos.ch/manual/configuration.html#contextName) and `JMXConfigurator` will automatically use the name you have set.

要避免这种不合意的冲突，只需 [为应用的日志上下文设置名称](http://logback.qos.ch/manual/configuration.html#contextName)，`JMXConfigurator` 就会自动使用你设置的名字。

For example, if you deploy two web-applications named "Koala" and "Wombat", then you would write in Koala's logback configuration

例如，如果你部署了两个名为 "Koala" 和 "Wombat" 的 web 应用，那么在 Koala 的 logback 配置中应这样写：

```
<configuration>
  <contextName>Koala</contextName>
  <jmxConfigurator/>
  ...
<configuration>
```

and in Wombat logback configuration file, you would write:

而在 Wombat 的 logback 配置文件中，则这样写：

```
<configuration>
  <contextName>Wombat</contextName>x
  <jmxConfigurator/>
  ...
<configuration>
```

In jconsole's MBeans panel, you would see two distinct `JMXConfigurator` instances:

在 jconsole 的 MBeans 面板中，你会看到两个不同的 `JMXConfigurator` 实例：

![multiple.gif](http://logback.qos.ch/manual/images/chapters/jmxConfigurator/multiple.gif)

You may fully control the name under which JMXConfigurator is registered with an MBeans server with the help of the "objectName" attribute of the `` element.

借助该元素的 "objectName" 属性，你可以完全掌控 JMXConfigurator 在 MBean 服务器中的注册名称。

### JMX enabling your server

### 让服务器支持 JMX

If your server runs with JDK 1.6 or later, your server should be JMX enabled by default.

如果你的服务器运行在 JDK 1.6 或更高版本上，那么默认就已经支持 JMX。

For older JVMs, we suggest that you refer to the JMX-related documentation of your web-server. Such documentation is available for both [Tomcat](http://tomcat.apache.org/tomcat-6.0-doc/monitoring.html) and [Jetty](http://docs.codehaus.org/display/JETTY/JMX). In this document, we briefly describe the required configuration steps for Tomcat and Jetty.

对于更老的 JVM，建议参考你的 web 服务器关于 JMX 的文档。[Tomcat](http://tomcat.apache.org/tomcat-6.0-doc/monitoring.html) 和 [Jetty](http://docs.codehaus.org/display/JETTY/JMX) 都有这样的文档。本文简要介绍 Tomcat 和 Jetty 所需的配置步骤。

#### Enabling JMX in Jetty (tested under JDK 1.5 and JDK 1.6)

#### 在 Jetty 中启用 JMX（在 JDK 1.5 和 JDK 1.6 下测试过）

The following has been tested under JDK 1.5 and 1.6. Under JDK 1.6 and later, your server is JMX enabled by default and you can, but do not need to, follow the steps discussed below. Under JDK 1.5, adding JMX support in Jetty requires a number of additions to the *$JETTY_HOME/etc/jetty.xml* configuration file. Here are the elements that need to be added:

以下内容已在 JDK 1.5 和 1.6 下测试过。在 JDK 1.6 及更高版本上，服务器默认就已支持 JMX，你可以遵循下述步骤，但并非必须。在 JDK 1.5 下，要在 Jetty 中加入 JMX 支持，需要对 *$JETTY_HOME/etc/jetty.xml* 配置文件做若干补充。需要添加的元素如下：

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

如果你想通过 `jconsole` 应用访问 Jetty 暴露的 MBean，那么需要在设置 "com.sun.management.jmxremote" Java 系统属性之后再启动 Jetty。

For a standalone version of Jetty, this translates to:

对于独立版的 Jetty，对应的命令是：

java **-Dcom.sun.management.jmxremote** -jar start.jar [config files]

And if you wish to launch Jetty as a Maven plugin, then you need to set the "com.sun.management.jmxremote" system property via the `MAVEN_OPTS` shell variable:

而如果你想以 Maven 插件的方式启动 Jetty，那么需要通过 `MAVEN_OPTS` 环境变量设置 "com.sun.management.jmxremote" 系统属性：

**MAVEN_OPTS="-Dcom.sun.management.jmxremote**" mvn jetty:run

You can then access the MBeans exposed by Jetty as well as logback's `JMXConfigurator` via `jconsole`.

之后，你就可以通过 `jconsole` 访问 Jetty 暴露的 MBean 以及 logback 的 `JMXConfigurator` 了。

![jconsole15_jetty.gif](http://logback.qos.ch/manual/images/chapters/jmxConfigurator/jconsole15_jetty.gif)

After you are connected, you should be able to access `JMXXConfigurator` as shown in the [screenshot](http://logback.qos.ch/manual/jmxConfig.html#jmxConfigurator) above.

连接之后，你应该就能像上面[截图](http://logback.qos.ch/manual/jmxConfig.html#jmxConfigurator)那样访问 `JMXConfigurator` 了。

#### MX4J with Jetty (tested under JDK 1.5 and 1.6)

#### 在 Jetty 中使用 MX4J（在 JDK 1.5 和 1.6 下测试过）

If you wish to access `JMXConfigurator` via MX4J's HTTP interface and assuming you have already downloaded [MX4J](http://mx4j.sourceforge.net/), you then need to modify the Jetty configuration file discussed previously by adding an instruction to set the management port.

如果你想通过 MX4J 的 HTTP 接口访问 `JMXConfigurator`，并且已经下载了 [MX4J](http://mx4j.sourceforge.net/)，那么需要修改前面讨论过的 Jetty 配置文件，加入一条设置管理端口的指令。

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

此外，还需要把 *mx4j-tools.jar* 加入 Jetty 的类路径。

If you are running Jetty as a Maven plug-in, then you need to add *mx4j-tools* as a dependency.

如果你以 Maven 插件的方式运行 Jetty，那么需要把 *mx4j-tools* 加为依赖。

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

用上述配置启动 Jetty 之后，`JMXConfigurator` 将可以通过下面的 URL 访问（搜索 "ch.qos.logback.classic"）：

http://localhost:8082/

Below is a screen shot view of the MX4J interface.

下面是 MX4J 界面的截图。

![mx4j_jetty.gif](http://logback.qos.ch/manual/images/chapters/jmxConfigurator/mx4j_jetty.gif)

#### Configuring JMX for Tomcat (tested under JDK 1.5 and 1.6)

#### 为 Tomcat 配置 JMX（在 JDK 1.5 和 1.6 下测试过）

If you are using JDK 1.6 and later, your server is already JMX enabled by default and you can, but do not need to, follow the steps discussed below. Under JDK 1.5, Tomcat requires the addition of the following lines to the *$TOMCAT_HOME/bin/catalina.bat/sh* shell script:

如果你使用的是 JDK 1.6 及更高版本，服务器默认就已支持 JMX，你可以遵循下述步骤，但并非必须。在 JDK 1.5 下，Tomcat 需要在 *$TOMCAT_HOME/bin/catalina.bat/sh* 脚本中加入下面几行：

CATALINA_OPTS="-Dcom.sun.management.jmxremote"

Once started with these options, MBeans exposed by Tomcat as well logback's `JMXConfigurator` can be accessed with `jconsole` by issuing the following command in a shell:

带着这些选项启动之后，在 shell 中执行如下命令，就可以用 `jconsole` 访问 Tomcat 暴露的 MBean 以及 logback 的 `JMXConfigurator` 了：

jconsole

![jconsole15_tomcat.gif](http://logback.qos.ch/manual/images/chapters/jmxConfigurator/jconsole15_tomcat.gif)

After you are connected, you should be able to access `JMXXConfigurator` as shown in the [screenshot](http://logback.qos.ch/manual/jmxConfig.html#jmxConfigurator) above.

连接之后，你应该就能像上面[截图](http://logback.qos.ch/manual/jmxConfig.html#jmxConfigurator)那样访问 `JMXConfigurator` 了。

#### MX4J with Tomcat (tested under JDK 1.5 and 1.6)

#### 在 Tomcat 中使用 MX4J（在 JDK 1.5 和 1.6 下测试过）

You might prefer to access JMX components via a web-based interface provided by MX4J. In that case, here are the required steps:

你可能更愿意通过 MX4J 提供的基于 web 的界面来访问 JMX 组件。这种情况下，需要的步骤如下：

Assuming you have already downloaded [MX4J](http://mx4j.sourceforge.net/), place the *mx4j-tools.jar* file under the *$TOMCAT_HOME/bin/* directory. Then, add the following lines to the *$TOMCAT_HOME/bin/catalina.sh* configuration file:

假设你已经下载了 [MX4J](http://mx4j.sourceforge.net/)，把 *mx4j-tools.jar* 文件放到 *$TOMCAT_HOME/bin/* 目录下。然后在 *$TOMCAT_HOME/bin/catalina.sh* 配置文件中加入下面几行：

<!-- at the beginning of the file --> CATALINA_OPTS="-Dcom.sun.management.jmxremote" <!-- in the "Add on extra jar files to CLASSPATH" section --> CLASSPATH="$CLASSPATH":"$CATALINA_HOME"/bin/mx4j-tools.jar

Finally, declare a new `Connector` in the *$TOMCAT_HOME/conf/server.xml* file:

最后，在 *$TOMCAT_HOME/conf/server.xml* 文件中声明一个新的 `Connector`：

```
<Connector port="0" 
  handler.list="mx"
  mx.enabled="true" 
  mx.httpHost="localhost" 
  mx.httpPort="8082" 
  protocol="AJP/1.3" />
```

Once Tomcat is started, you should be able to find JMXConfigurator by pointing your browser at the following URL (search for "ch.qos.logback.classic"):

Tomcat 启动之后，把浏览器指向下面的 URL 就能找到 JMXConfigurator（搜索 "ch.qos.logback.classic"）：

http://localhost:8082/

Below is a screen shot view of the MX4J interface.

下面是 MX4J 界面的截图。

![mx4j_tomcat.gif](http://logback.qos.ch/manual/images/chapters/jmxConfigurator/mx4j_tomcat.gif)



<http://logback.qos.ch/manual/jmxConfig.html>
