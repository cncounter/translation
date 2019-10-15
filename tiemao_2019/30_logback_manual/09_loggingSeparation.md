# Chapter 9: Logging separation

*It is not knowledge, but the act of learning, not possession but the act of getting there, which grants the greatest enjoyment. When I have clarified and exhausted a subject, then I turn away from it, in order to go into darkness again; the never-satisfied man is so strange if he has completed a structure, then it is not in order to dwell in it peacefully, but in order to begin another. I imagine the world conqueror must feel thus, who, after one kingdom is scarcely conquered, stretches out his arms for others.*

—KARL FRIEDRICH GAUSS, Letter to Bolyai, 1808.

*Style, like sheer silk, too often hides eczema.*

—ALBERT CAMUS, *The Fall*

In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](http://logback.qos.ch/setup.html) for further details.

## The problem: Logging Separation

The chapter deals with a relatively difficult problem of providing a separate logging environment for multiple applications running on the same web or EJB container. In the remainder of this chapter the term "application" will be used to refer to either a web-application or a J2EE application interchangeably. In a separated logging environment, each application sees a distinct logback environment, so that the logback configuration of one application does not interfere with the settings of another. In more technical terms, each web-application has a distinct copy of `LoggerContext` reserved for its own use. Recall that in logback, each logger object is manufactured by a `LoggerContext` to which it remains attached for as long as the logger object lives in memory. A variant of this problem is the separation of application logging and the logging of the container itself.

## The simplest and easiest approach

Assuming your container supports child-first class loading, separation of logging can be accomplished by embedding a copy of slf4j and logback jar files in each of your applications. For web-applications, placing slf4j and logback jar files under the *WEB-INF/lib* directory of the web-application is sufficient to endow each web-application with a separate logging environment. A copy of the *logback.xml* configuration file placed under *WEB-INF/classes* will be picked up when logback is loaded into memory.

By virtue of class loader separation provided by the container, each web-application will load its own copy of `LoggerContext` which will pickup its own copy of *logback.xml*.

Easy as pie.

Well, not exactly. Sometimes you will be forced to place SLF4J and logback artifacts in a place accessible from all applications, typically because a shared library uses SLF4J. In that case, all applications will share the same logging environment. There are various other scenarios where a copy of SLF4J and logback artifacts is necessarily placed at a spot where it can be seen by all applications making logging separation by class loader separation impossible. All hope is not lost. Please read on.

## Context Selectors

Logback provides a mechanism for a single instance of SLF4J and logback classes loaded into memory to provide multiple logger contexts. When you write:

```
Logger logger = LoggerFactory.getLogger("foo");
```

the `getLogger`() method in `LoggerFactory` class will ask the SLF4J binding for a `ILoggerFactory`. When SLF4J is bound to logback, the task of returning an `ILoggerFactory` is delegated to an instance of [ContextSelector](http://logback.qos.ch/apidocs/ch/qos/logback/classic/selector/ContextSelector.html). Note that `ContextSelector` implementations always return instances `LoggerContext`. This class implements the `ILoggerFactory` interface. In other words, a context selector has the option to returning any `LoggerContext` instance it sees fit according to its own criteria. Hence the name context *selector*.

By default, the logback binding uses [DefaultContextSelector](http://logback.qos.ch/xref/ch/qos/logback/classic/selector/DefaultContextSelector.html) which always returns the same `LoggerContext`, called the default logger context.

You can specify a different context selector by setting the *logback.ContextSelector* system property. Suppose you would like to specify that context selector to an instance of the `myPackage.myContextSelector` class, you would add the following system property:

-Dlogback.ContextSelector=myPackage.myContextSelector

The context selector needs to implement the `ContextSelector` interface and have a constructor method admitting a `LoggerContext` instance as its only parameter.

### ContextJNDISelector

Logback-classic ships with a selector called `ContextJNDISelector` which selects the logger context based on data available via JNDI lookup. This approach leverages JNDI data separation mandated by the J2EE specification. Thus, the same environment variable can be set to carry a different value in different applications. In other words, calling `LoggerFactory.getLogger()` from different applications will return a logger attached to a different logger context, even if there is a single LoggerFactory class loaded into memory shared by all applications. That's logging separation for you.

To enable `ContextJNDISelector`, the *logback.ContextSelector* system property needs to be set to "JNDI", as follows:

-Dlogback.ContextSelector=JNDI

Note that the value `JNDI` is a convenient shorthand for `ch.qos.logback.classic.selector.ContextJNDISelector`.

### Setting JNDI variables in applications

In each of your applications, you need to name the logging context for the application. For a web-application, JNDI environment entries are specified within the *web.xml* file. If "kenobi" was the name of your application, you would add the following XML element to kenobi's web.xml file:

```
<env-entry>
  <env-entry-name>logback/context-name</env-entry-name>
  <env-entry-type>java.lang.String</env-entry-type>
  <env-entry-value>kenobi</env-entry-value>
</env-entry>
```

Assuming you have enabled `ContextJNDISelector`, logging for Kenobi will be done using a logger context named "kenobi". Moreover, the "kenobi" logger context will be initialized by *convention* by looking up the configuration file called *logback-kenobi.xml* as a *resource* using the thread context class loader. Thus, for example for the kenobi web-application, *logback-kenobi.xml* should be placed under the *WEB-INF/classes* folder.

If you wish to, you may specify a different configuration file other than the convention, by setting the "logback/configuration-resource" JNDI variable. For example, for the kenobi web-application, if you wish to specify *aFolder/my_config.xml* instead of the conventional *logback-kenobi.xml*, you would add the following XML element to web.xml

```
<env-entry>
  <env-entry-name>logback/configuration-resource</env-entry-name>
  <env-entry-type>java.lang.String</env-entry-type>
  <env-entry-value>aFolder/my_config.xml</env-entry-value>
</env-entry>
```

The file *my_config.xml* should be placed under *WEB-INF/classes/aFolder/*. The important point to remember is that the configuration is looked up as a Java resource using the current thread's context class loader.

### Configuring Tomcat for ContextJNDISelector

First, place the logback jars (that is logback-classic-1.3.0-alpha5.jar, logback-core-1.3.0-alpha5.jar and slf4j-api-2.0.0-alpha1.jar) in Tomcat's global (shared) class folder. In Tomcat 6.x, this directory is *$TOMCAT_HOME/lib/*.

The *logback.ContextSelector* system property can be set by adding the following line to the *catalina.sh* script, catalina.bat in Windows, found under *$TOMCAT_HOME/bin* folder.

JAVA_OPTS="$JAVA_OPTS -Dlogback.ContextSelector=JNDI"

### Hot deploying applications

When the web-application is recycled or shutdown, we strongly recommend that the incumbent `LoggerContext` be closed so that it can be properly garbage collected. Logback ships with a `ServletContextListener` called [`ContextDetachingSCL`](http://logback.qos.ch/xref/ch/qos/logback/classic/selector/servlet/ContextDetachingSCL.html), designed specifically for detaching the `ContextSelector` instance associated with the older web-application instance. It can be installed by adding the following lines into your web-applications *web.xml* file.

```
<listener>
  <listener-class>ch.qos.logback.classic.selector.servlet.ContextDetachingSCL</listener-class>
</listener>
```

**NOTE** Most containers invoke the `contextInitialized()` method of listeners in the order in which they are declared but invoke their `contextDestroyed()` method in reverse order. It follows that if you have multiple `ServletContextListener` declarations in your *web.xml*, then `ContextDetachingSCL` should be declared *first* so that its `contextDestroyed()` method is invoked *last* during application shutdown.

### Better performance

When `ContextJNDISelector` is active, each time a logger is retrieved, a JNDI lookup must be performed. This can negatively impact performance, especially if you are using non-static (a.k.a. instance) logger references. Logback ships with a servlet filter named [LoggerContextFilter](http://logback.qos.ch/xref/ch/qos/logback/classic/selector/servlet/LoggerContextFilter.html), specifically designed to avoid the JNDI lookup cost. It can be installed by adding the following lines to your application's web.xml file.

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

Nulling the `ThreadLocal` variable allows garbage collection of the web-application when it is stopped or recycled.

## Taming static references in shared libraries

`ContextJNDISelector` works nicely to create logging separation when SLF4J and logback artifacts are shared by all applications. When `ContextJNDISelector` is active, each call to `LoggerFactory.getLogger()` will return a logger belonging to a logger context associated with the calling/current application.

The common idiom for referencing a logger is via a static reference. For example,

```
public class Foo {
  static Logger logger = LoggerFactory.getLogger(Foo.class);
  ...
}
```

Static logger references are both memory and CPU efficient. Only one logger reference is used for all instances of the class. Moreover, the logger instance is retrieved only once, when the class is loaded into memory. If the host class belongs to some application, say kenobi, then the static logger will be attached to kenobi's logger context by virtue of `ContextJNDISelector`. Similarly, if the host class belongs to some other application, say yoda, then its static logger reference will be attached to yoda's logger context, again by virtue of `ContextJNDISelector`.

If a class, say `Mustafar`, belongs to a library shared by both *kenobi* and *yoda*, as long as `Mustafar` has non static loggers, each invocation of `LoggerFactory.getLogger()` will return a logger belonging to a logger context associated with the calling/current application. But if `Mustafar` has a static logger reference, then its logger will be attached to the logger context of the application that calls it first. Thus, `ContextJNDISelector` does not provide logging separation in case of shared classes using static logger references. This corner case has eluded a solution for eons.

The only way to solve this issue transparently and perfectly would be to introduce another level of indirection inside loggers so that each logger-shell somehow delegated work to an inner logger attached to the appropriate context. This approach would be quite difficult to implement and would incur a significant computational overhead. It is not an approach we plan to pursue.

It goes without saying that one could trivially solve the "shared class static logger" problem by moving the shared classes inside the web-apps (unshare them). If unsharing is not possible, then we can solicit the magical powers of [`SiftingAppender`](http://logback.qos.ch/manual/appenders.html#SiftingAppender) in order to separate logging using JNDI data as separation criteria.

Logback ships with a discriminator called [JNDIBasedContextDiscriminator](http://logback.qos.ch/xref/ch/qos/logback/classic/sift/JNDIBasedContextDiscriminator.html) which returns the name of the current logger context as computed by `ContextJNDISelector`. The `SiftingAppender` and `JNDIBasedContextDiscriminator` combination will create separate appenders for each web-application.

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

You can try out the technique just described with the help of the [logback-starwars](http://github.com/ceki/logback-starwars) project.

The above approach solves the logging separation problem but is rather complex. It requires the proper installation of `ContextJNDISelector` and mandates that appenders be wrapped by `SiftingAppender` which is a non-trivial beast in itself.

Note that each logging context can be configured using the same file or alternatively different files. The choice is up to you. Instructing all contexts to use the same configuration file is simpler as only one file has to be maintained. Maintaining a distinct configuration file for each application is harder to maintain but allows for more flexibility.

So are we done yet? Can we declare victory and go home? Well, not quite.

Let's assume the web-application `yoda` is initialized before `kenobi`. To initialize `yoda`, visit `http://localhost:port/yoda/servlet` which will invoke the `YodaServlet`. This servlet just says hello and logs message before calling the `foo` method in `Mustafar` which not-surprisingly logs a simple message and returns.

After `YodaServlet` is called, the contents of *yoda.log* file should contain

```
DEBUG ch.qos.starwars.yoda.YodaServlet             cn=yoda - in doGet()
DEBUG ch.qos.starwars.shared.Mustafar              cn=yoda - in foo()
```

Note how both log entries are associated with the "yoda" context name. At this stage and until the server stops, the `ch.qos.starwars.shared.Mustafar` logger is attached to the 'yoda' context and will remain so until the server is stopped.

Visiting `http://localhost:port/kenobi/servlet` will output the following in *kenobi.log*.

```
DEBUG ch.qos.starwars.kenobi.KenobiServlet          cn=kenobi - in doGet()
DEBUG ch.qos.starwars.shared.Mustafar               cn=yoda - in foo()
```

Note that even if the `ch.qos.starwars.shared.Mustafar` logger outputs to *kenobi.log* it is still attached to 'yoda'. Thus, we have two distinct logging contexts logging to the same file, in this case *kenobi.log*. Each of these contexts reference `FileAppender` instances, nested within distinct `SiftingAppender` instances, that are logging to the same file. Although logging separation seems to function according to our wishes, FileAppender instances cannot safely write to the same file unless they enable prudent mode. Otherwise, the target file will be corrupted.

Here is the configuration file enabling prudent mode:

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

<http://logback.qos.ch/manual/loggingSeparation.html>