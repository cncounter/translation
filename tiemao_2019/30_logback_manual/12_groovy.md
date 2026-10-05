# Chapter 12: Groovy Configuration

# 第12章: Groovy 配置

*It is better to be a human being dissatisfied than a pig satisfied; better to be a Socrates dissatisfied than a fool satisfied. And if the fool or the pig thinks otherwise, it is because they have no experience of the better part.*

*做不满足的人，好过做满足的猪；做不满足的苏格拉底，好过做满足的傻瓜。如果傻瓜或猪有不同看法，那是因为它们只体验过自己那一面。*

—JOHN STUART MILL, *Utilitarianism*

——约翰·斯图尔特·密尔，《功利主义》

Domain-specific languages or DSLs are rather pervasive. The XML-based logback configuration can be viewed as a DSL instance. By the very nature of XML, XML-based configuration files are quite verbose and rather bulky. Moreover, a relatively large body of code in logback, namely Joran, is dedicated to processing these XML-based configuration files. Joran supports nifty features such as variable substitution, conditional processing and on-the-fly extensibility. However, not only is Joran a complex beast, the user-experience it provides can be described as unsatisfactory or at the very least unintuitive.

领域特定语言(DSL)相当普遍。基于 XML 的 logback 配置就可以看作一个 DSL 实例。由于 XML 本身的特性，基于 XML 的配置文件相当啰嗦、臃肿。此外，logback 中有相当大的一块代码（即 Joran）专门用来处理这些基于 XML 的配置文件。Joran 支持变量替换、条件处理和即时扩展等漂亮特性。然而，Joran 不仅本身复杂，它提供的用户体验也可以说不尽如人意，至少不够直观。

The Groovy-based DSL described in this chapter aims to be consistent, intuitive, and powerful. Everything you can do using XML in configuration files, you can do in Groovy with a much shorter syntax. To help you migrate to Groovy style configuration, we have developed a [tool to automatically migrate your existing *logback.xml* files to *logback.groovy*](http://logback.qos.ch/translator/asGroovy.html).

本章描述的基于 Groovy 的 DSL 力求一致、直观且强大。凡是能在配置文件中用 XML 做的事，用 Groovy 都能以短得多的语法做到。为了帮助你迁移到 Groovy 风格的配置，我们开发了一个[把现有 *logback.xml* 文件自动迁移为 *logback.groovy* 的工具](http://logback.qos.ch/translator/asGroovy.html)。

## General philosophy

## 总体理念

As a general rule, *logback.groovy* files are Groovy programs. And since Groovy is a super-set of Java, whatever configuration actions you can perform in Java, you can do the same within a *logback.groovy* file. However, since configuring logback programmatically using Java syntax can be cumbersome, we added a few logback-specific extensions to make your life easier. We try hard to limit the number of logback-specific syntactic extensions to an absolute minimum. If you are already familiar with Groovy, you should be able to read, understand and even write your own *logback.groovy* files with great ease. Those unfamiliar with Groovy should still find *logback.groovy* syntax much more comfortable to use than *logback.xml*.

一般而言，*logback.groovy* 文件就是 Groovy 程序。由于 Groovy 是 Java 的超集，凡是能在 Java 中执行的配置操作，在 *logback.groovy* 文件里同样可以做。不过，用 Java 语法以编程方式配置 logback 比较繁琐，所以我们增加了一些 logback 专属的扩展，让你更轻松。我们竭力把 logback 专属的语法扩展限制在绝对最少。如果你已经熟悉 Groovy，应该能够非常轻松地阅读、理解乃至编写自己的 *logback.groovy* 文件。即使不熟悉 Groovy，你也会发现 *logback.groovy* 的语法比 *logback.xml* 舒服得多。

Given that *logback.groovy* files are Groovy programs with minimal logback-specific extensions, *all* the usual groovy constructs such as class imports, variable definitions, evaluation of ${..} expressions contained in strings (GStrings), and if-else statements are available in *logback.groovy* files.

鉴于 *logback.groovy* 文件是带有少量 logback 专属扩展的 Groovy 程序，*所有*常见的 Groovy 构件——类导入、变量定义、字符串中 ${..} 表达式的求值(GString)、if-else 语句——在 *logback.groovy* 文件中都可用。

## Automatic imports

## 自动导入

**SINCE 1.0.10** In order to reduce unnecessary boilerplate several common types and packages are imported automatically. Thus, as long as you are only configuring built-in appenders, layouts etc. you do not need to add the corresponding import statement into your script. You will need them for types not covered by the default imports, of course.

**自 1.0.10 起** 为了减少不必要的样板代码，若干常见类型和包会被自动导入。因此，只要你只是配置内置的 appender、layout 等，就无需在脚本中添加相应的 import 语句。当然，对于默认导入未覆盖的类型，还是需要自己导入。

Here is the list of default imports:

以下是默认导入的清单：

- import ch.qos.logback.core.*;
- import ch.qos.logback.core.encoder.*;
- import ch.qos.logback.core.read.*;
- import ch.qos.logback.core.rolling.*;
- import ch.qos.logback.core.status.*;
- import ch.qos.logback.classic.net.*;
- import ch.qos.logback.classic.encoder.PatternLayoutEncoder;

In addition, all constants in ch.qos.logback.classic.Level are statically imported as is (uppercase) and as lowercased aliases. It follows that your scripts can reference both *INFO* or *info* without a static import statement.

此外，ch.qos.logback.classic.Level 中的所有常量都会按原样（大写）以及小写别名静态导入。因此，脚本无需任何静态导入语句即可引用 *INFO* 或 *info*。

## SiftingAppender no longer supported

## 不再支持 SiftingAppender

**SINCE VERSION 1.0.12** `SiftingAppender` is no longer supported within groovy configuration files. However, in case there is demand, it may be re-introduced.

**自 1.0.12 版起** Groovy 配置文件中不再支持 `SiftingAppender`。不过如果有需求，将来可能会重新引入。

## Extensions specific to *logback.groovy*

## *logback.groovy* 的专属扩展

Essentially, *Logback.groovy* syntax consists of half a dozen methods described next; in the reverse order of their customary appearance. Strictly speaking, the order of invocation of these methods does NOT matter, with one exception: appenders MUST be defined before they can be attached to a logger.

本质上，*logback.groovy* 语法由下面介绍的六个方法构成，按它们惯常出现顺序的逆序逐一介绍。严格来说，这些方法的调用顺序并不重要，只有一个例外：appender 必须先定义，然后才能挂到 logger 上。

### • root(Level level, List<String> appenderNames = [])

The `root` method can be used to set the level of the root logger. As an optional second argument of type `List`, can be used to attach previously defined appenders by name. If you do not specify the list of appender names, then an empty list is assumed. In Groovy, an empty list is denoted by `[]`.

`root` 方法可用于设置 root logger 的级别。可选的第二个参数类型为 `List`，用来按名称把先前定义的 appender 挂到 root 上。如果不指定 appender 名称列表，则假定为空列表。在 Groovy 中，空列表写作 `[]`。

To set the level of the root logger to WARN, you would write:

要把 root logger 的级别设为 WARN，这样写：

```
root(WARN)
```

To set the level of the root logger to INFO, and attach appenders named "CONSOLE" and "FILE" to root, you would write:

要把 root logger 的级别设为 INFO，并把名为 "CONSOLE" 和 "FILE" 的 appender 挂到 root 上，这样写：

```
root(INFO, ["CONSOLE", "FILE"])
```

In the previous example, it is assumed that the appenders named "CONSOLE" and "FILE" were already defined. Defining appenders will be discussed shortly.

前一个示例假定名为 "CONSOLE" 和 "FILE" 的 appender 已经定义。稍后会讨论如何定义 appender。

### • logger(String name, Level level, List<String> appenderNames = [],      Boolean additivity = null)

The `logger()` method takes four arguments, of which the last two are optional. The first argument is the name of the logger to configure. The second argument is the level of the designated logger. Setting the level of a logger to `null` forces it to [inherit its level](http://logback.qos.ch/manual/architecture.html#effectiveLevel) from its nearest ancestor with an assigned level. The third argument of type `List` is optional and defaults to an empty list if omitted. The appender names in the list are attached to the designated logger. The fourth argument of type `Boolean` is also optional and controls the [additivity flag](http://logback.qos.ch/manual/architecture.html#additivity). If omitted, it defaults to `null`.

`logger()` 方法接受四个参数，其中后两个可选。第一个参数是要配置的 logger 的名称。第二个参数是所指定 logger 的级别。把 logger 的级别设为 `null`，会强制它从拥有已分配级别的最近祖先那里[继承级别](http://logback.qos.ch/manual/architecture.html#effectiveLevel)。第三个参数类型为 `List`，可选，省略时默认为空列表；列表中的 appender 名称会挂到指定的 logger 上。第四个参数类型为 `Boolean`，同样可选，用于控制 [additivity 标志](http://logback.qos.ch/manual/architecture.html#additivity)；省略时默认为 `null`。

For example, the following script sets the level of the "com.foo" logger to INFO.

例如，下面的脚本把 "com.foo" logger 的级别设为 INFO。

```
logger("com.foo", INFO)
```

The next script sets the level of the "com.foo" logger to DEBUG, and attaches the appender named "CONSOLE" to it.

下一个脚本把 "com.foo" logger 的级别设为 DEBUG，并把名为 "CONSOLE" 的 appender 挂到它上面。

```
logger("com.foo", DEBUG, ["CONSOLE"])
```

The next script is similar to the previous one, except that it also sets the the additivity flag of the "com.foo" logger to false.

下一个脚本与上一个类似，只是它还把 "com.foo" logger 的 additivity 标志设为 false。

```
logger("com.foo", DEBUG, ["CONSOLE"], false)
```

### • appender(String name, Class clazz, Closure closure = null)

The appender method takes the name of the appender being configured as its first argument. The second mandatory argument is the class of the appender to instantiate. The third argument is a closure containing further configuration instructions. If omitted, it defaults to null.

appender 方法的第一个参数是被配置的 appender 的名称。第二个必需参数是要实例化的 appender 的类。第三个参数是一个闭包，包含进一步的配置指令；省略时默认为 null。

Most appenders require properties to be set and sub-components to be injected to function properly. Properties are set using the '=' operator (assignment). Sub-components are injected by invoking a method named after the property and passing that method the class to instantiate as an argument. This convention can be applied recursively to configure properties as well as sub-components of any appender sub-component. This approach is at the heart of *logback.groovy* scripts and is probably the only convention that needs learning.

大多数 appender 都需要设置属性、注入子组件才能正常工作。属性用 '=' 运算符（赋值）设置。子组件的注入方式是：调用一个以属性命名的方法，并把要实例化的类作为参数传给该方法。这一约定可以递归地应用于任何 appender 子组件的属性与子组件配置。这种做法是 *logback.groovy* 脚本的核心，也许也是唯一需要学习的约定。

For example, the following script instantiates a `FileAppender` named "FILE", setting its file property to "testFile.log" and its append property to false. An encoder of type `PatternLayoutEncoder` is injected into the appender. The pattern property of the encoder is set to "%level %logger - %msg%n". The appender is then attached to the root logger.

例如，下面的脚本实例化了一个名为 "FILE" 的 `FileAppender`，把它的 file 属性设为 "testFile.log"、append 属性设为 false；向该 appender 注入一个类型为 `PatternLayoutEncoder` 的 encoder，把 encoder 的 pattern 属性设为 "%level %logger - %msg%n"；最后把这个 appender 挂到 root logger 上。

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

`timestamp()` 方法返回一个字符串：把 `timeReference` 参数按照 `datePattern` 参数指定的格式进行格式化。`datePattern` 参数应遵循 [SimpleDateFormat](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html) 定义的约定。如果未指定 `timeReference`，默认为 -1，此时以当前时间（即解析配置文件时的时间）作为时间基准。视具体情形而定，你可能希望以 `context.birthTime` 作为时间基准。

In the next example, the `bySecond` variable is assigned the current time in the "yyyyMMdd'T'HHmmss" format. The "bySecond" variable is then used to define the value of the file property.

在下一个示例中，变量 `bySecond` 被赋值为 "yyyyMMdd'T'HHmmss" 格式的当前时间，随后该变量用于定义 file 属性的值。

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

创建自己的[转换符](http://logback.qos.ch/manual/layouts.html#customConversionSpecifier)之后，需要告知 logback 它的存在。下面是一个示例 logback.groovy 文件，它指示 logback 在遇到 `%sample` 转换词(conversion word)时使用 MySampleConverter。

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

调用 scan() 方法会指示 logback 定期扫描 logback.groovy 文件的变化。一旦检测到变化，*logback.groovy* 文件就会被重新加载。

```
scan()
```

By default, the configuration file will be scanned for changes once every minute. You can specify a different scanning period by passing a "scanPeriod" string value. Values can be specified in units of milliseconds, seconds, minutes or hours. Here is an example:

默认情况下，配置文件每分钟扫描一次变化。可以通过传入 "scanPeriod" 字符串值来指定不同的扫描周期。值可以用毫秒、秒、分钟或小时为单位。示例如下：

```
scan("30 seconds")
```

If no unit of time is specified, then the unit of time is assumed to be milliseconds, which is usually inappropriate. If you change the default scanning period, do not forget to specify a time unit. For additional details on how scanning works, please refer to the [section on automatic reloading](http://logback.qos.ch/manual/configuration.html#autoScan).

如果不指定时间单位，则假定单位为毫秒，这通常并不合适。如果你修改了默认扫描周期，别忘了指定时间单位。关于扫描工作机制的更多细节，请参考[自动重载](http://logback.qos.ch/manual/configuration.html#autoScan)一节。

### • statusListener(Class listenerClass)

You can add a status listener by invoking the `statusListener` method and passing a listener class as an argument. Here is an example:

可以调用 `statusListener` 方法并传入监听器类来添加状态监听器。示例如下：

```
import chapters.layouts.MySampleConverter

// We highly recommended that you always add a status listener just
// after the last import statement and before all other statements
statusListener(OnConsoleStatusListener)
```

[Status listeners](http://logback.qos.ch/manual/configuration.html#statusListener) were described in an earlier chapter.

[状态监听器](http://logback.qos.ch/manual/configuration.html#statusListener)已在前面的章节中介绍过。

### • jmxConfigurator(String name)

You can register a [`JMXConfigurator`](http://logback.qos.ch/manual/jmxConfig.html) MBean with this method. Invoke it without any parameters to use Logback's default ObjectName (`ch.qos.logback.classic:Name=default,Type=ch.qos.logback.classic.jmx.JMXConfigurator`) for the registered MBean:

可以用这个方法注册一个 [`JMXConfigurator`](http://logback.qos.ch/manual/jmxConfig.html) MBean。不带任何参数调用它，将使用 Logback 默认的 ObjectName（`ch.qos.logback.classic:Name=default,Type=ch.qos.logback.classic.jmx.JMXConfigurator`）来注册 MBean：

```
jmxConfigurator()
```

To change the value of the `Name` key to something other than "default", simply pass in a different name as the parameter for the `jmxConfigurator` method:

想把 `Name` 键的值换成 "default" 以外的其他值，只需给 `jmxConfigurator` 方法传入另一个名字作为参数：

```
jmxConfigurator('MyName')
```

If you want define the ObjectName completely, use the same syntax but pass in a valid ObjectName string representation as the parameter:

想完整定义 ObjectName，语法相同，但传入的参数必须是合法的 ObjectName 字符串表示：

```
jmxConfigurator('myApp:type=LoggerManager')
```

The method will first attempt to use the parameter as an ObjectName, and falls back to treating it as the value for the "Name" key if it doesn't represent a valid ObjectName.

该方法会先尝试把参数当作 ObjectName 来用；如果它并不是合法的 ObjectName，则回退为把它当作 "Name" 键的值。

## Internal DSL, i.e. it's all groovy baby!

## 内部 DSL，没错，全是 Groovy！

The *logback.groovy* is an internal DSL meaning that its contents are executed as a Groovy script. Thus, all the usual Groovy constructs such as class imports, GString, variable definitions, evaluation of ${..} expressions contained within strings (GStrings), if-else statements are all available in logback.groovy files. In the following discussion, we will present typical uses of these Groovy constructs in *logback.groovy* files.

*logback.groovy* 是一个内部 DSL，也就是说它的内容会作为 Groovy 脚本执行。因此，所有常见的 Groovy 构件——类导入、GString、变量定义、字符串中 ${..} 表达式的求值(GString)、if-else 语句——在 logback.groovy 文件中都可用。下面的讨论将展示这些 Groovy 构件在 *logback.groovy* 文件中的典型用法。

### Variable definitions and GStrings

### 变量定义与 GString

You can define variables anywhere within a *logback.groovy* file, then use the variable within a GString. Here is an example.

你可以在 *logback.groovy* 文件的任何位置定义变量，然后在 GString 中使用它。示例如下。

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

### 在控制台打印

You can invoke Groovy's `println` method to print on the console. Here is an example.

你可以调用 Groovy 的 `println` 方法在控制台打印。示例如下。

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

### 自动导出的字段

#### 'hostname' variable

#### 'hostname' 变量

The 'hostname' variable contains the name of the current host. However, due to scoping rules that the authors cannot fully explain, the 'hostname' variable is available only at the topmost scope but not in nested scopes. The next example should get the point across.

'hostname' 变量包含当前主机的主机名。不过，由于某些连作者自己也解释不清的作用域规则，'hostname' 变量只在最顶层作用域可用，嵌套作用域中不可用。下一个示例应该能把这一点讲清楚。

```
// will print "hostname is x" where x is the current host's name
println "Hostname is ${hostname}"

appender("STDOUT", ConsoleAppender) {
  // will print "hostname is null"
  println "Hostname is ${hostname}" 
}
```

If you wish to have the hostname variable be seen in all scopes, you need to define another variable and assign it the value of 'hostname' as shown next.

如果你想让 hostname 变量在所有作用域都可见，需要另外定义一个变量，并把 'hostname' 的值赋给它，如下所示。

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

### 一切皆可感知上下文，随时引用当前 context

The execution of the *logback.groovy* script is done within the scope of a [ContextAware](http://logback.qos.ch/xref/ch/qos/logback/core/spi/ContextAware.html) object. Thus, the current context is always accessible using the '`context`' variable and you can invoke `addInfo`(), `addWarn`() and `addError`() methods to send status messages to the context's `StatusManager`.

*logback.groovy* 脚本是在一个 [ContextAware](http://logback.qos.ch/xref/ch/qos/logback/core/spi/ContextAware.html) 对象的作用域内执行的。因此，随时可以通过 '`context`' 变量访问当前上下文，并且可以调用 `addInfo`()、`addWarn`() 和 `addError`() 方法，向上下文的 `StatusManager` 发送状态消息。

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

### 条件配置

Given that Groovy is a fully-fledged programming language, conditional statements allow for a single *logback.groovy* file to adapt to various environments such as development, testing or production.

由于 Groovy 是一门功能完备的编程语言，条件语句可以让单个 *logback.groovy* 文件适应开发、测试或生产等多种环境。

In the next script, a console appender is activated on hosts other than pixie or orion, our production machines. Note that the output directory of the rolling file appender also depends on the host.

在下一个脚本中，除了我们的生产机 pixie 和 orion 之外，其他主机上都会启用 console appender。注意，滚动文件 appender 的输出目录也取决于主机。

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
