# Chapter 12: Groovy Configuration

*It is better to be a human being dissatisfied than a pig satisfied; better to be a Socrates dissatisfied than a fool satisfied. And if the fool or the pig thinks otherwise, it is because they have no experience of the better part.*

—JOHN STUART MILL, *Utilitarianism*

Domain-specific languages or DSLs are rather pervasive. The XML-based logback configuration can be viewed as a DSL instance. By the very nature of XML, XML-based configuration files are quite verbose and rather bulky. Moreover, a relatively large body of code in logback, namely Joran, is dedicated to processing these XML-based configuration files. Joran supports nifty features such as variable substitution, conditional processing and on-the-fly extensibility. However, not only is Joran a complex beast, the user-experience it provides can be described as unsatisfactory or at the very least unintuitive.

The Groovy-based DSL described in this chapter aims to be consistent, intuitive, and powerful. Everything you can do using XML in configuration files, you can do in Groovy with a much shorter syntax. To help you migrate to Groovy style configuration, we have developed a [tool to automatically migrate your existing *logback.xml* files to *logback.groovy*](http://logback.qos.ch/translator/asGroovy.html).

## General philosophy

As a general rule, *logback.groovy* files are Groovy programs. And since Groovy is a super-set of Java, whatever configuration actions you can perform in Java, you can do the same within a *logback.groovy* file. However, since configuring logback programmatically using Java syntax can be cumbersome, we added a few logback-specific extensions to make your life easier. We try hard to limit the number of logback-specific syntactic extensions to an absolute minimum. If you are already familiar with Groovy, you should be able to read, understand and even write your own *logback.groovy* files with great ease. Those unfamiliar with Groovy should still find *logback.groovy* syntax much more comfortable to use than *logback.xml*.

Given that *logback.groovy* files are Groovy programs with minimal logback-specific extensions, *all* the usual groovy constructs such as class imports, variable definitions, evaluation of ${..} expressions contained in strings (GStrings), and if-else statements are available in *logback.groovy* files.

## Automatic imports

**SINCE 1.0.10** In order to reduce unnecessary boilerplate several common types and packages are imported automatically. Thus, as long as you are only configuring built-in appenders, layouts etc. you do not need to add the corresponding import statement into your script. You will need them for types not covered by the default imports, of course.

Here is the list of default imports:

- import ch.qos.logback.core.*;
- import ch.qos.logback.core.encoder.*;
- import ch.qos.logback.core.read.*;
- import ch.qos.logback.core.rolling.*;
- import ch.qos.logback.core.status.*;
- import ch.qos.logback.classic.net.*;
- import ch.qos.logback.classic.encoder.PatternLayoutEncoder;

In addition, all constants in ch.qos.logback.classic.Level are statically imported as is (uppercase) and as lowercased aliases. It follows that your scripts can reference both *INFO* or *info* without a static import statement.

## SiftingAppender no longer supported

**SINCE VERSION 1.0.12** `SiftingAppender` is no longer supported within groovy configuration files. However, in case there is demand, it may be re-introduced.

## Extensions specific to *logback.groovy*

Essentially, *Logback.groovy* syntax consists of half a dozen methods described next; in the reverse order of their customary appearance. Strictly speaking, the order of invocation of these methods does NOT matter, with one exception: appenders MUST be defined before they can be attached to a logger.

### • root(Level level, List<String> appenderNames = [])

The `root` method can be used to set the level of the root logger. As an optional second argument of type `List`, can be used to attach previously defined appenders by name. If you do not specify the list of appender names, then an empty list is assumed. In Groovy, an empty list is denoted by `[]`.

To set the level of the root logger to WARN, you would write:

```
root(WARN)
```

To set the level of the root logger to INFO, and attach appenders named "CONSOLE" and "FILE" to root, you would write:

```
root(INFO, ["CONSOLE", "FILE"])
```

In the previous example, it is assumed that the appenders named "CONSOLE" and "FILE" were already defined. Defining appenders will be discussed shortly.

### • logger(String name, Level level, List<String> appenderNames = [],      Boolean additivity = null)

The `logger()` method takes four arguments, of which the last two are optional. The first argument is the name of the logger to configure. The second argument is the level of the designated logger. Setting the level of a logger to `null` forces it to [inherit its level](http://logback.qos.ch/manual/architecture.html#effectiveLevel) from its nearest ancestor with an assigned level. The third argument of type `List` is optional and defaults to an empty list if omitted. The appender names in the list are attached to the designated logger. The fourth argument of type `Boolean` is also optional and controls the [additivity flag](http://logback.qos.ch/manual/architecture.html#additivity). If omitted, it defaults to `null`.

For example, the following script sets the level of the "com.foo" logger to INFO.

```
logger("com.foo", INFO)
```

The next script sets the level of the "com.foo" logger to DEBUG, and attaches the appender named "CONSOLE" to it.

```
logger("com.foo", DEBUG, ["CONSOLE"])
```

The next script is similar to the previous one, except that it also sets the the additivity flag of the "com.foo" logger to false.

```
logger("com.foo", DEBUG, ["CONSOLE"], false)
```

### • appender(String name, Class clazz, Closure closure = null)

The appender method takes the name of the appender being configured as its first argument. The second mandatory argument is the class of the appender to instantiate. The third argument is a closure containing further configuration instructions. If omitted, it defaults to null.

Most appenders require properties to be set and sub-components to be injected to function properly. Properties are set using the '=' operator (assignment). Sub-components are injected by invoking a method named after the property and passing that method the class to instantiate as an argument. This convention can be applied recursively to configure properties as well as sub-components of any appender sub-component. This approach is at the heart of *logback.groovy* scripts and is probably the only convention that needs learning.

For example, the following script instantiates a `FileAppender` named "FILE", setting its file property to "testFile.log" and its append property to false. An encoder of type `PatternLayoutEncoder` is injected into the appender. The pattern property of the encoder is set to "%level %logger - %msg%n". The appender is then attached to the root logger.

```
appender("FILE", FileAppender) {
  file = "testFile.log"
  append = true
  encoder(PatternLayoutEncoder) {
    pattern = "%level %logger - %msg%n"
  }
}

root(DEBUG, ["FILE"])
```



### • timestamp(String datePattern, long timeReference = -1)

The `timestamp()` method method returns a string corresponding to the `timeReference` parameter formatted according to the `datePattern` parameter. The `datePattern` parameter should follow the conventions defined by [SimpleDateFormat](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html). If the `timeReference` value is unspecified, it defaults to -1, in which case current time, that is time when the configuration file is parsed, is used as the time reference. Depending on the circumstances, occasion, you might wish to use `context.birthTime` as the time reference.

In the next example, the `bySecond` variable is assigned the current time in the "yyyyMMdd'T'HHmmss" format. The "bySecond" variable is then used to define the value of the file property.

```
def bySecond = timestamp("yyyyMMdd'T'HHmmss")

appender("FILE", FileAppender) {
  file = "log-${bySecond}.txt"
  encoder(PatternLayoutEncoder) {
    pattern = "%logger{35} - %msg%n"
  }
}
root(DEBUG, ["FILE"])
```

### • conversionRule(String conversionWord, Class converterClass)

After creating your own [conversion specifier](http://logback.qos.ch/manual/layouts.html#customConversionSpecifier), you need to inform logback of its existence. Here is a sample logback.groovy file which instructs logback to use MySampleConverter whenever the `%sample` conversion word is encountered.

```
import chapters.layouts.MySampleConverter

conversionRule("sample", MySampleConverter)
appender("STDOUT", ConsoleAppender) {
  encoder(PatternLayoutEncoder) {
    pattern = "%-4relative [%thread] %sample - %msg%n"
  }
}
root(DEBUG, ["STDOUT"])
```

### • scan(String scanPeriod = null)

Invoking the scan() method instructs logback to periodically scan the logback.groovy file for changes. Whenever a change is detected, the *logback.groovy* file is reloaded.

```
scan()
```

By default, the configuration file will be scanned for changes once every minute. You can specify a different scanning period by passing a "scanPeriod" string value. Values can be specified in units of milliseconds, seconds, minutes or hours. Here is an example:

```
scan("30 seconds")
```

If no unit of time is specified, then the unit of time is assumed to be milliseconds, which is usually inappropriate. If you change the default scanning period, do not forget to specify a time unit. For additional details on how scanning works, please refer to the [section on automatic reloading](http://logback.qos.ch/manual/configuration.html#autoScan).

### • statusListener(Class listenerClass)

You can add a status listener by invoking the `statusListener` method and passing a listener class as an argument. Here is an example:

```
import chapters.layouts.MySampleConverter

// We highly recommended that you always add a status listener just
// after the last import statement and before all other statements
statusListener(OnConsoleStatusListener)
```

[Status listeners](http://logback.qos.ch/manual/configuration.html#statusListener) were described in an earlier chapter.

### • jmxConfigurator(String name)

You can register a [`JMXConfigurator`](http://logback.qos.ch/manual/jmxConfig.html) MBean with this method. Invoke it without any parameters to use Logback's default ObjectName (`ch.qos.logback.classic:Name=default,Type=ch.qos.logback.classic.jmx.JMXConfigurator`) for the registered MBean:

```
jmxConfigurator()
```

To change the value of the `Name` key to something other than "default", simply pass in a different name as the parameter for the `jmxConfigurator` method:

```
jmxConfigurator('MyName')
```

If you want define the ObjectName completely, use the same syntax but pass in a valid ObjectName string representation as the parameter:

```
jmxConfigurator('myApp:type=LoggerManager')
```

The method will first attempt to use the parameter as an ObjectName, and falls back to treating it as the value for the "Name" key if it doesn't represent a valid ObjectName.

## Internal DSL, i.e. it's all groovy baby!

The *logback.groovy* is an internal DSL meaning that its contents are executed as a Groovy script. Thus, all the usual Groovy constructs such as class imports, GString, variable definitions, evaluation of ${..} expressions contained within strings (GStrings), if-else statements are all available in logback.groovy files. In the following discussion, we will present typical uses of these Groovy constructs in *logback.groovy* files.

### Variable definitions and GStrings

You can define variables anywhere within a *logback.groovy* file, then use the variable within a GString. Here is an example.

```
// define the USER_HOME variable setting its value 
// to that of the "user.home" system property
def USER_HOME = System.getProperty("user.home")

appender("FILE", FileAppender) {
  // make use of the USER_HOME variable
  file = "${USER_HOME}/myApp.log"
  encoder(PatternLayoutEncoder) {
    pattern = "%msg%n"
  }
}
root(DEBUG, ["FILE"])
```

### Printing on the console

You can invoke Groovy's `println` method to print on the console. Here is an example.

```
def USER_HOME = System.getProperty("user.home");
println "USER_HOME=${USER_HOME}"

appender("FILE", FileAppender) {
  println "Setting [file] property to [${USER_HOME}/myApp.log]"
  file = "${USER_HOME}/myApp.log"  
  encoder(PatternLayoutEncoder) {
    pattern = "%msg%n"
  }
}
root(DEBUG, ["FILE"])
```

### Automatically exported fields

#### 'hostname' variable

The 'hostname' variable contains the name of the current host. However, due to scoping rules that the authors cannot fully explain, the 'hostname' variable is available only at the topmost scope but not in nested scopes. The next example should get the point across.

```
// will print "hostname is x" where x is the current host's name
println "Hostname is ${hostname}"

appender("STDOUT", ConsoleAppender) {
  // will print "hostname is null"
  println "Hostname is ${hostname}" 
}
```

If you wish to have the hostname variable be seen in all scopes, you need to define another variable and assign it the value of 'hostname' as shown next.

```
// define HOSTNAME by assigning it hostname
def HOSTNAME=hostname
// will print "hostname is x" where x is the current host's name
println "Hostname is ${HOSTNAME}"

appender("STDOUT", ConsoleAppender) {
  // will print "hostname is x" where x is the current host's name
  println "Hostname is ${HOSTNAME}" 
}
```

### Everything is context aware with a reference to the current context

The execution of the *logback.groovy* script is done within the scope of a [ContextAware](http://logback.qos.ch/xref/ch/qos/logback/core/spi/ContextAware.html) object. Thus, the current context is always accessible using the '`context`' variable and you can invoke `addInfo`(), `addWarn`() and `addError`() methods to send status messages to the context's `StatusManager`.

```
// always a good idea to add an on console status listener
statusListener(OnConsoleStatusListener)

// set the context's name to wombat
context.name = "wombat"
// add a status message regarding context's name
addInfo("Context name has been set to ${context.name}")

def USER_HOME = System.getProperty("user.home");
// add a status message regarding USER_HOME
addInfo("USER_HOME=${USER_HOME}")

appender("FILE", FileAppender) {
  // add a status message regarding the file property
  addInfo("Setting [file] property to [${USER_HOME}/myApp.log]")
  file = "${USER_HOME}/myApp.log"  
  encoder(PatternLayoutEncoder) {
    pattern = "%msg%n"
  }
}
root(DEBUG, ["FILE"])
```

### Conditional configuration

Given that Groovy is a fully-fledged programming language, conditional statements allow for a single *logback.groovy* file to adapt to various environments such as development, testing or production.

In the next script, a console appender is activated on hosts other than pixie or orion, our production machines. Note that the output directory of the rolling file appender also depends on the host.

```
// always a good idea to add an on console status listener
statusListener(OnConsoleStatusListener)

def appenderList = ["ROLLING"]
def WEBAPP_DIR = "."
def consoleAppender = true;

// does hostname match pixie or orion?
if (hostname =~ /pixie|orion/) {
  WEBAPP_DIR = "/opt/myapp"     
  consoleAppender = false   
} else {
  appenderList.add("CONSOLE")
}

if (consoleAppender) {
  appender("CONSOLE", ConsoleAppender) {
    encoder(PatternLayoutEncoder) {
      pattern = "%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"
    }
  }
}

appender("ROLLING", RollingFileAppender) {
  encoder(PatternLayoutEncoder) {
    Pattern = "%d %level %thread %mdc %logger - %m%n"
  }
  rollingPolicy(TimeBasedRollingPolicy) {
    FileNamePattern = "${WEBAPP_DIR}/log/translator-%d{yyyy-MM}.zip"
  }
}

root(INFO, appenderList)
```



<http://logback.qos.ch/manual/groovy.html>