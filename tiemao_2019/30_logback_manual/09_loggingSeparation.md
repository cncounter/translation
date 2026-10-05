# Chapter 9: Logging separation

# 第9章: 日志分离

*It is not knowledge, but the act of learning, not possession but the act of getting there, which grants the greatest enjoyment. When I have clarified and exhausted a subject, then I turn away from it, in order to go into darkness again; the never-satisfied man is so strange if he has completed a structure, then it is not in order to dwell in it peacefully, but in order to begin another. I imagine the world conqueror must feel thus, who, after one kingdom is scarcely conquered, stretches out his arms for others.*

*带来最大乐趣的并不是知识本身，而是学习的过程；不是拥有，而是获取的过程。当我把一个课题弄清楚并研究透彻之后，就会转身离开，重新进入黑暗之中；永不满足的人就是这样一种奇怪的存在：他建成了一座大厦，却不是为了安然居住其中，而是为了再去建造另一座。我想，世界的征服者想必也是这种感觉——一个王国刚刚征服，便又伸出双臂去夺取其他的王国。*

—KARL FRIEDRICH GAUSS, Letter to Bolyai, 1808.

——卡尔·弗里德里希·高斯，1808 年写给 Bolyai 的信

*Style, like sheer silk, too often hides eczema.*

*风格就像纯丝织物，往往掩盖住了湿疹。*

—ALBERT CAMUS, *The Fall*

——阿尔贝·加缪，《堕落》

In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](http://logback.qos.ch/setup.html) for further details.

要运行本章中的示例，需要确保 classpath 中存在某些 jar 文件。详情请参考 [setup page](http://logback.qos.ch/setup.html)。

## The problem: Logging Separation

## 问题所在：日志分离

The chapter deals with a relatively difficult problem of providing a separate logging environment for multiple applications running on the same web or EJB container. In the remainder of this chapter the term "application" will be used to refer to either a web-application or a J2EE application interchangeably. In a separated logging environment, each application sees a distinct logback environment, so that the logback configuration of one application does not interfere with the settings of another. In more technical terms, each web-application has a distinct copy of `LoggerContext` reserved for its own use. Recall that in logback, each logger object is manufactured by a `LoggerContext` to which it remains attached for as long as the logger object lives in memory. A variant of this problem is the separation of application logging and the logging of the container itself.

本章讨论的是一个相对棘手的问题：为运行在同一个 web 容器或 EJB 容器上的多个应用提供相互隔离的日志环境。在本章接下来的内容中，"application"（应用）一词泛指 web 应用或 J2EE 应用，两者不作区分。在相互分离的日志环境中，每个应用看到的都是各自独立的 logback 环境，因此一个应用的 logback 配置不会干扰另一个应用的配置。用更技术性的话来说，每个 web 应用都拥有一个专属的 `LoggerContext` 副本。回想一下，在 logback 中，每个 logger 对象都由某个 `LoggerContext` 创建，并且只要该 logger 对象还存在于内存中，它就一直与这个上下文保持关联。这个问题还有一个变体：把应用自身的日志与容器本身的日志分离开来。

## The simplest and easiest approach

## 最简单直接的方式

Assuming your container supports child-first class loading, separation of logging can be accomplished by embedding a copy of slf4j and logback jar files in each of your applications. For web-applications, placing slf4j and logback jar files under the *WEB-INF/lib* directory of the web-application is sufficient to endow each web-application with a separate logging environment. A copy of the *logback.xml* configuration file placed under *WEB-INF/classes* will be picked up when logback is loaded into memory.

假设你的容器支持子优先(child-first)类加载，那么只要在每个应用中都内嵌一份 slf4j 和 logback 的 jar 包，就能实现日志分离。对于 web 应用来说，把 slf4j 和 logback 的 jar 包放到 web 应用的 *WEB-INF/lib* 目录下，就足以让每个 web 应用拥有独立的日志环境。再把 *logback.xml* 配置文件的一份副本放到 *WEB-INF/classes* 下，logback 被加载进内存时就会读取它。

By virtue of class loader separation provided by the container, each web-application will load its own copy of `LoggerContext` which will pickup its own copy of *logback.xml*.

得益于容器提供的类加载器隔离，每个 web 应用都会加载属于自己的 `LoggerContext` 副本，并读取属于自己的 *logback.xml*。

Easy as pie.

轻松愉快，小菜一碟。

Well, not exactly. Sometimes you will be forced to place SLF4J and logback artifacts in a place accessible from all applications, typically because a shared library uses SLF4J. In that case, all applications will share the same logging environment. There are various other scenarios where a copy of SLF4J and logback artifacts is necessarily placed at a spot where it can be seen by all applications making logging separation by class loader separation impossible. All hope is not lost. Please read on.

不过，事情并不总是这么简单。有时你不得不把 SLF4J 和 logback 的构件放在所有应用都能访问到的地方，通常是因为某个共享库用到了 SLF4J。在这种情况下，所有应用将共享同一个日志环境。还有其他若干场景，也会导致 SLF4J 和 logback 的副本必须放在所有应用都可见的位置，从而无法依靠类加载器隔离来实现日志分离。不过希望仍在，请继续往下读。

## Context Selectors

## 上下文选择器

Logback provides a mechanism for a single instance of SLF4J and logback classes loaded into memory to provide multiple logger contexts. When you write:

logback 提供了一种机制，让内存中仅加载一份的 SLF4J 和 logback 类能够提供多个 logger 上下文。当你写下：

```
Logger logger = LoggerFactory.getLogger("foo");
```

the `getLogger`() method in `LoggerFactory` class will ask the SLF4J binding for a `ILoggerFactory`. When SLF4J is bound to logback, the task of returning an `ILoggerFactory` is delegated to an instance of [ContextSelector](http://logback.qos.ch/apidocs/ch/qos/logback/classic/selector/ContextSelector.html). Note that `ContextSelector` implementations always return instances `LoggerContext`. This class implements the `ILoggerFactory` interface. In other words, a context selector has the option to returning any `LoggerContext` instance it sees fit according to its own criteria. Hence the name context *selector*.

`LoggerFactory` 类中的 `getLogger`() 方法会向 SLF4J 绑定(binding)请求一个 `ILoggerFactory`。当 SLF4J 绑定到 logback 时，返回 `ILoggerFactory` 的任务就交由 [ContextSelector](http://logback.qos.ch/apidocs/ch/qos/logback/classic/selector/ContextSelector.html) 的某个实例来完成。注意，`ContextSelector` 的实现返回的都是 `LoggerContext` 实例，该类实现了 `ILoggerFactory` 接口。换句话说，上下文选择器可以按照自己的标准，返回它认为合适的任意 `LoggerContext` 实例。上下文*选择器*(selector)因此得名。

By default, the logback binding uses [DefaultContextSelector](http://logback.qos.ch/xref/ch/qos/logback/classic/selector/DefaultContextSelector.html) which always returns the same `LoggerContext`, called the default logger context.

默认情况下，logback 绑定使用 [DefaultContextSelector](http://logback.qos.ch/xref/ch/qos/logback/classic/selector/DefaultContextSelector.html)，它总是返回同一个 `LoggerContext`，即所谓的默认 logger 上下文。

You can specify a different context selector by setting the *logback.ContextSelector* system property. Suppose you would like to specify that context selector to an instance of the `myPackage.myContextSelector` class, you would add the following system property:

你可以通过设置 *logback.ContextSelector* 系统属性来指定其他的上下文选择器。假设你想把上下文选择器指定为 `myPackage.myContextSelector` 类的一个实例，可以添加如下系统属性：

-Dlogback.ContextSelector=myPackage.myContextSelector

The context selector needs to implement the `ContextSelector` interface and have a constructor method admitting a `LoggerContext` instance as its only parameter.

上下文选择器需要实现 `ContextSelector` 接口，并且要有一个以 `LoggerContext` 实例作为唯一参数的构造方法。

### ContextJNDISelector

logback-classic ships with a selector called `ContextJNDISelector` which selects the logger context based on data available via JNDI lookup. This approach leverages JNDI data separation mandated by the J2EE specification. Thus, the same environment variable can be set to carry a different value in different applications. In other words, calling `LoggerFactory.getLogger()` from different applications will return a logger attached to a different logger context, even if there is a single LoggerFactory class loaded into memory shared by all applications. That's logging separation for you.

logback-classic 自带一个名为 `ContextJNDISelector` 的选择器，它根据 JNDI 查询获得的数据来选择 logger 上下文。这种做法利用了 J2EE 规范所要求的 JNDI 数据隔离：同一个环境变量在不同的应用中可以取不同的值。也就是说，即使内存中只有一个由所有应用共享的 LoggerFactory 类，从不同应用中调用 `LoggerFactory.getLogger()` 也会返回归属于不同 logger 上下文的 logger。这就是日志分离。

To enable `ContextJNDISelector`, the *logback.ContextSelector* system property needs to be set to "JNDI", as follows:

要启用 `ContextJNDISelector`，需要把 *logback.ContextSelector* 系统属性设置为 "JNDI"，如下所示：

-Dlogback.ContextSelector=JNDI

Note that the value `JNDI` is a convenient shorthand for `ch.qos.logback.classic.selector.ContextJNDISelector`.

注意，`JNDI` 这个值是 `ch.qos.logback.classic.selector.ContextJNDISelector` 的便捷简写。

### Setting JNDI variables in applications

### 在应用中设置 JNDI 变量

In each of your applications, you need to name the logging context for the application. For a web-application, JNDI environment entries are specified within the *web.xml* file. If "kenobi" was the name of your application, you would add the following XML element to kenobi's web.xml file:

在每个应用中，你需要为该应用命名日志上下文。对于 web 应用，JNDI 环境条目在 *web.xml* 文件中指定。如果你的应用名为 "kenobi"，那么需要在 kenobi 的 web.xml 文件中加入如下 XML 元素：

```
<env-entry>
  <env-entry-name>logback/context-name</env-entry-name>
  <env-entry-type>java.lang.String</env-entry-type>
  <env-entry-value>kenobi</env-entry-value>
</env-entry>
```

Assuming you have enabled `ContextJNDISelector`, logging for Kenobi will be done using a logger context named "kenobi". Moreover, the "kenobi" logger context will be initialized by *convention* by looking up the configuration file called *logback-kenobi.xml* as a *resource* using the thread context class loader. Thus, for example for the kenobi web-application, *logback-kenobi.xml* should be placed under the *WEB-INF/classes* folder.

假设你已经启用了 `ContextJNDISelector`，那么 Kenobi 的日志将通过名为 "kenobi" 的 logger 上下文来记录。此外，按照*约定*，"kenobi" logger 上下文在初始化时，会使用线程上下文类加载器，把名为 *logback-kenobi.xml* 的配置文件当作*资源*来查找。因此，举例来说，对于 kenobi 这个 web 应用，*logback-kenobi.xml* 应放在 *WEB-INF/classes* 目录下。

If you wish to, you may specify a different configuration file other than the convention, by setting the "logback/configuration-resource" JNDI variable. For example, for the kenobi web-application, if you wish to specify *aFolder/my_config.xml* instead of the conventional *logback-kenobi.xml*, you would add the following XML element to web.xml

如果愿意，你也可以不按约定来，而是通过设置 "logback/configuration-resource" JNDI 变量来指定别的配置文件。例如，对于 kenobi 这个 web 应用，如果你想用 *aFolder/my_config.xml* 替代约定俗成的 *logback-kenobi.xml*，只需在 web.xml 中加入如下 XML 元素：

```
<env-entry>
  <env-entry-name>logback/configuration-resource</env-entry-name>
  <env-entry-type>java.lang.String</env-entry-type>
  <env-entry-value>aFolder/my_config.xml</env-entry-value>
</env-entry>
```

The file *my_config.xml* should be placed under *WEB-INF/classes/aFolder/*. The important point to remember is that the configuration is looked up as a Java resource using the current thread's context class loader.

*my_config.xml* 文件应放在 *WEB-INF/classes/aFolder/* 目录下。需要记住的重点是：配置文件是使用当前线程的上下文类加载器、当作 Java 资源来查找的。

### Configuring Tomcat for ContextJNDISelector

### 为 ContextJNDISelector 配置 Tomcat

First, place the logback jars (that is logback-classic-1.3.0-alpha5.jar, logback-core-1.3.0-alpha5.jar and slf4j-api-2.0.0-alpha1.jar) in Tomcat's global (shared) class folder. In Tomcat 6.x, this directory is *$TOMCAT_HOME/lib/*.

首先，把 logback 的 jar 包（即 logback-classic-1.3.0-alpha5.jar、logback-core-1.3.0-alpha5.jar 和 slf4j-api-2.0.0-alpha1.jar）放到 Tomcat 的全局（共享）类目录中。在 Tomcat 6.x 中，这个目录是 *$TOMCAT_HOME/lib/*。

The *logback.ContextSelector* system property can be set by adding the following line to the *catalina.sh* script, catalina.bat in Windows, found under *$TOMCAT_HOME/bin* folder.

可以在 *$TOMCAT_HOME/bin* 目录下的 *catalina.sh* 脚本（Windows 上是 catalina.bat）中加入下面一行，来设置 *logback.ContextSelector* 系统属性：

JAVA_OPTS="$JAVA_OPTS -Dlogback.ContextSelector=JNDI"

### Hot deploying applications

### 应用的热部署

When the web-application is recycled or shutdown, we strongly recommend that the incumbent `LoggerContext` be closed so that it can be properly garbage collected. Logback ships with a `ServletContextListener` called [`ContextDetachingSCL`](http://logback.qos.ch/xref/ch/qos/logback/classic/selector/servlet/ContextDetachingSCL.html), designed specifically for detaching the `ContextSelector` instance associated with the older web-application instance. It can be installed by adding the following lines into your web-applications *web.xml* file.

当 web 应用被回收或关闭时，我们强烈建议关闭当时在用的 `LoggerContext`，以便它能够被正常地垃圾回收。logback 自带一个名为 [`ContextDetachingSCL`](http://logback.qos.ch/xref/ch/qos/logback/classic/selector/servlet/ContextDetachingSCL.html) 的 `ServletContextListener`，专门用来解除旧 web 应用实例所关联的 `ContextSelector` 实例。只需在 web 应用的 *web.xml* 文件中加入下面几行即可安装它：

```
<listener>
  <listener-class>ch.qos.logback.classic.selector.servlet.ContextDetachingSCL</listener-class>
</listener>
```

**NOTE** Most containers invoke the `contextInitialized()` method of listeners in the order in which they are declared but invoke their `contextDestroyed()` method in reverse order. It follows that if you have multiple `ServletContextListener` declarations in your *web.xml*, then `ContextDetachingSCL` should be declared *first* so that its `contextDestroyed()` method is invoked *last* during application shutdown.

**注意** 大多数容器会按照监听器声明的先后顺序调用它们的 `contextInitialized()` 方法，而以相反的顺序调用 `contextDestroyed()` 方法。因此，如果你的 *web.xml* 中声明了多个 `ServletContextListener`，那么 `ContextDetachingSCL` 应当声明在*最前面*，这样在应用关闭时，它的 `contextDestroyed()` 方法才会*最后*被调用。

### Better performance

### 更好的性能

When `ContextJNDISelector` is active, each time a logger is retrieved, a JNDI lookup must be performed. This can negatively impact performance, especially if you are using non-static (a.k.a. instance) logger references. Logback ships with a servlet filter named [LoggerContextFilter](http://logback.qos.ch/xref/ch/qos/logback/classic/selector/servlet/LoggerContextFilter.html), specifically designed to avoid the JNDI lookup cost. It can be installed by adding the following lines to your application's web.xml file.

当 `ContextJNDISelector` 处于启用状态时，每次获取 logger 都要执行一次 JNDI 查询。这可能对性能造成负面影响，尤其是在使用非静态（即实例级）logger 引用的情况下。logback 自带一个名为 [LoggerContextFilter](http://logback.qos.ch/xref/ch/qos/logback/classic/selector/servlet/LoggerContextFilter.html) 的 servlet 过滤器，专门用来避免 JNDI 查询的开销。只需在应用的 web.xml 文件中加入下面几行即可安装它：

```
<filter>
  <filter-name>LoggerContextFilter</filter-name>
  <filter-class>ch.qos.logback.classic.selector.servlet.LoggerContextFilter</filter-class>
</filter>
<filter-mapping>
  <filter-name>LoggerContextFilter</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>
```

At the beginning of each http-request, `LoggerContextFilter` will obtain the logger context associated with the application and then place it in a `ThreadLocal` variable. `ContextJNDISelector` will first check if the `ThreadLocal` variable is set. If it is set, then JNDI lookup will skipped. Note that at the end of the http request, the `ThreadLocal` variable will be nulled. Installing `LoggerContextFilter` improves logger retrieval performance by a wide margin.

在每个 http 请求开始时，`LoggerContextFilter` 会获取与该应用关联的 logger 上下文，并将其放入一个 `ThreadLocal` 变量。`ContextJNDISelector` 会先检查这个 `ThreadLocal` 变量是否已设置；如果已设置，就会跳过 JNDI 查询。注意，在 http 请求结束时，该 `ThreadLocal` 变量会被置空。安装 `LoggerContextFilter` 能大幅提升获取 logger 的性能。

Nulling the `ThreadLocal` variable allows garbage collection of the web-application when it is stopped or recycled.

将 `ThreadLocal` 变量置空，使得 web 应用在停止或被回收时能够被垃圾回收。

## Taming static references in shared libraries

## 驯服共享库中的静态引用

`ContextJNDISelector` works nicely to create logging separation when SLF4J and logback artifacts are shared by all applications. When `ContextJNDISelector` is active, each call to `LoggerFactory.getLogger()` will return a logger belonging to a logger context associated with the calling/current application.

当 SLF4J 和 logback 的构件被所有应用共享时，`ContextJNDISelector` 能够很好地实现日志分离。当 `ContextJNDISelector` 处于启用状态时，每次调用 `LoggerFactory.getLogger()` 都会返回一个 logger，它属于与调用方/当前应用关联的 logger 上下文。

The common idiom for referencing a logger is via a static reference. For example,

引用 logger 的常见习惯是使用静态引用。例如：

```
public class Foo {
  static Logger logger = LoggerFactory.getLogger(Foo.class);
  ...
}
```

Static logger references are both memory and CPU efficient. Only one logger reference is used for all instances of the class. Moreover, the logger instance is retrieved only once, when the class is loaded into memory. If the host class belongs to some application, say kenobi, then the static logger will be attached to kenobi's logger context by virtue of `ContextJNDISelector`. Similarly, if the host class belongs to some other application, say yoda, then its static logger reference will be attached to yoda's logger context, again by virtue of `ContextJNDISelector`.

静态 logger 引用在内存和 CPU 两方面都很高效。类的所有实例共用一个 logger 引用，而且 logger 实例只在类被加载进内存时获取一次。如果宿主类属于某个应用，比如 kenobi，那么凭借 `ContextJNDISelector`，这个静态 logger 将关联到 kenobi 的 logger 上下文。类似地，如果宿主类属于另一个应用，比如 yoda，那么它的静态 logger 引用同样会凭借 `ContextJNDISelector` 关联到 yoda 的 logger 上下文。

If a class, say `Mustafar`, belongs to a library shared by both *kenobi* and *yoda*, as long as `Mustafar` has non static loggers, each invocation of `LoggerFactory.getLogger()` will return a logger belonging to a logger context associated with the calling/current application. But if `Mustafar` has a static logger reference, then its logger will be attached to the logger context of the application that calls it first. Thus, `ContextJNDISelector` does not provide logging separation in case of shared classes using static logger references. This corner case has eluded a solution for eons.

如果某个类（比如 `Mustafar`）属于被 *kenobi* 和 *yoda* 共享的库，那么只要 `Mustafar` 使用的是非静态 logger，每次调用 `LoggerFactory.getLogger()` 都会返回一个 logger，它属于与调用方/当前应用关联的 logger 上下文。但如果 `Mustafar` 持有静态 logger 引用，那么它的 logger 将关联到第一个调用它的应用的 logger 上下文。因此，对于使用静态 logger 引用的共享类，`ContextJNDISelector` 无法提供日志分离。这个棘手的角落案例长期以来一直没有得到解决。

The only way to solve this issue transparently and perfectly would be to introduce another level of indirection inside loggers so that each logger-shell somehow delegated work to an inner logger attached to the appropriate context. This approach would be quite difficult to implement and would incur a significant computational overhead. It is not an approach we plan to pursue.

唯一能够透明且完美解决这个问题的办法，是在 logger 内部再引入一层间接：让每个 logger 壳(shell)以某种方式把工作委派给一个关联到恰当上下文的内部 logger。这种方案实现起来相当困难，而且会带来可观的计算开销。我们并不打算走这条路。

It goes without saying that one could trivially solve the "shared class static logger" problem by moving the shared classes inside the web-apps (unshare them). If unsharing is not possible, then we can solicit the magical powers of [`SiftingAppender`](http://logback.qos.ch/manual/appenders.html#SiftingAppender) in order to separate logging using JNDI data as separation criteria.

不用说，把共享类移进各个 web 应用内部（取消共享）可以轻而易举地解决"共享类静态 logger"问题。如果无法取消共享，那么我们可以借助 [`SiftingAppender`](http://logback.qos.ch/manual/appenders.html#SiftingAppender) 的神奇力量，以 JNDI 数据作为分离条件来实现日志分离。

Logback ships with a discriminator called [JNDIBasedContextDiscriminator](http://logback.qos.ch/xref/ch/qos/logback/classic/sift/JNDIBasedContextDiscriminator.html) which returns the name of the current logger context as computed by `ContextJNDISelector`. The `SiftingAppender` and `JNDIBasedContextDiscriminator` combination will create separate appenders for each web-application.

logback 自带一个名为 [JNDIBasedContextDiscriminator](http://logback.qos.ch/xref/ch/qos/logback/classic/sift/JNDIBasedContextDiscriminator.html) 的判别器(discriminator)，它返回由 `ContextJNDISelector` 计算出的当前 logger 上下文的名称。`SiftingAppender` 与 `JNDIBasedContextDiscriminator` 的组合会为每个 web 应用创建独立的 appender。

```
<configuration>

  <statusListener class="ch.qos.logback.core.status.OnConsoleStatusListener" />  

  <appender name="SIFT" class="ch.qos.logback.classic.sift.SiftingAppender">
    <discriminator class="ch.qos.logback.classic.sift.JNDIBasedContextDiscriminator">
      <defaultValue>unknown</defaultValue>
    </discriminator>
    <sift>
      <appender name="FILE-${contextName}" class="ch.qos.logback.core.FileAppender">
        <file>${contextName}.log</file>
        <encoder>
          <pattern>%-50(%level %logger{35}) cn=%contextName - %msg%n</pattern>
         </encoder>
      </appender>
     </sift>
    </appender>

  <root level="DEBUG">
    <appender-ref ref="SIFT" />
  </root>
</configuration>
```

If kenobi and yoda are web-applications, then the above configuration will output yoda's log output to *yoda.log* and kenobi's logs to *kenobi.log*; this even works for logs generated by static logger references located in shared classes.

如果 kenobi 和 yoda 都是 web 应用，那么上面的配置会把 yoda 的日志输出到 *yoda.log*，把 kenobi 的日志输出到 *kenobi.log*；即便日志来自共享类中的静态 logger 引用，也同样有效。

You can try out the technique just described with the help of the [logback-starwars](http://github.com/ceki/logback-starwars) project.

你可以借助 [logback-starwars](http://github.com/ceki/logback-starwars) 项目来试用刚才介绍的技术。

The above approach solves the logging separation problem but is rather complex. It requires the proper installation of `ContextJNDISelector` and mandates that appenders be wrapped by `SiftingAppender` which is a non-trivial beast in itself.

上述方案解决了日志分离问题，但相当复杂。它要求正确安装 `ContextJNDISelector`，并且要求 appender 由 `SiftingAppender` 包裹，而后者本身就是个不易驾驭的家伙。

Note that each logging context can be configured using the same file or alternatively different files. The choice is up to you. Instructing all contexts to use the same configuration file is simpler as only one file has to be maintained. Maintaining a distinct configuration file for each application is harder to maintain but allows for more flexibility.

注意，每个日志上下文既可以用同一个文件来配置，也可以用不同的文件来配置，选择权在你。让所有上下文共用同一个配置文件更简单，因为只需维护一个文件；为每个应用维护一个独立的配置文件则更费心，但灵活性也更高。

So are we done yet? Can we declare victory and go home? Well, not quite.

那么，我们大功告成了吗？可以宣布胜利回家了吗？嗯，还没有。

Let's assume the web-application `yoda` is initialized before `kenobi`. To initialize `yoda`, visit `http://localhost:port/yoda/servlet` which will invoke the `YodaServlet`. This servlet just says hello and logs message before calling the `foo` method in `Mustafar` which not-surprisingly logs a simple message and returns.

假设 web 应用 `yoda` 比 `kenobi` 先初始化。要初始化 `yoda`，可以访问 `http://localhost:port/yoda/servlet`，它会调用 `YodaServlet`。这个 servlet 只是打个招呼、记几条日志，然后调用 `Mustafar` 中的 `foo` 方法——后者不出所料地记了条简单的日志便返回。

After `YodaServlet` is called, the contents of *yoda.log* file should contain

`YodaServlet` 被调用之后，*yoda.log* 文件的内容应该是：

```
DEBUG ch.qos.starwars.yoda.YodaServlet             cn=yoda - in doGet()
DEBUG ch.qos.starwars.shared.Mustafar              cn=yoda - in foo()
```

Note how both log entries are associated with the "yoda" context name. At this stage and until the server stops, the `ch.qos.starwars.shared.Mustafar` logger is attached to the 'yoda' context and will remain so until the server is stopped.

注意，两条日志都关联到了 "yoda" 上下文名。在这个阶段直到服务器停止之前，`ch.qos.starwars.shared.Mustafar` 这个 logger 都关联在 'yoda' 上下文上，并将一直保持到服务器停止。

Visiting `http://localhost:port/kenobi/servlet` will output the following in *kenobi.log*.

访问 `http://localhost:port/kenobi/servlet` 会在 *kenobi.log* 中输出如下内容：

```
DEBUG ch.qos.starwars.kenobi.KenobiServlet          cn=kenobi - in doGet()
DEBUG ch.qos.starwars.shared.Mustafar               cn=yoda - in foo()
```

Note that even if the `ch.qos.starwars.shared.Mustafar` logger outputs to *kenobi.log* it is still attached to 'yoda'. Thus, we have two distinct logging contexts logging to the same file, in this case *kenobi.log*. Each of these contexts reference `FileAppender` instances, nested within distinct `SiftingAppender` instances, that are logging to the same file. Although logging separation seems to function according to our wishes, FileAppender instances cannot safely write to the same file unless they enable prudent mode. Otherwise, the target file will be corrupted.

注意，即使 `ch.qos.starwars.shared.Mustafar` logger 输出到 *kenobi.log*，它依然关联在 'yoda' 上。于是，两个不同的日志上下文写到了同一个文件（这里是 *kenobi.log*）。这两个上下文分别引用了嵌套在各自 `SiftingAppender` 实例中的 `FileAppender` 实例，而它们写的是同一个文件。尽管日志分离看起来运转正常，但多个 FileAppender 实例如果不启用谨慎模式(prudent mode)，是无法安全地写同一个文件的，否则目标文件会被破坏。

Here is the configuration file enabling prudent mode:

下面是启用谨慎模式的配置文件：

```
<configuration>

  <statusListener class="ch.qos.logback.core.status.OnConsoleStatusListener" />  

  <appender name="SIFT" class="ch.qos.logback.classic.sift.SiftingAppender">
    <discriminator class="ch.qos.logback.classic.sift.JNDIBasedContextDiscriminator">
      <defaultValue>unknown</defaultValue>
    </discriminator>
    <sift>
      <appender name="FILE-${contextName}" class="ch.qos.logback.core.FileAppender">
        <file>${contextName}.log</file>
        <prudent>true</prudent>
        <encoder>
          <pattern>%-50(%level %logger{35}) cn=%contextName - %msg%n</pattern>
         </encoder>
      </appender>
     </sift>
    </appender>

  <root level="DEBUG">
    <appender-ref ref="SIFT" />
  </root>
</configuration>
```

If you were able to keep up with the discussion thus far and have actually tried the logback-starwars examples, then you must be truly obsessed with logging. You should consider seeking [professional help](http://www.qos.ch/shop/products/professionalSupport).

如果你一路读到这里没有掉队，而且真的动手试过 logback-starwars 的示例，那么你一定对日志痴迷已深。你应该考虑寻求[专业帮助](http://www.qos.ch/shop/products/professionalSupport)。

<http://logback.qos.ch/manual/loggingSeparation.html>
