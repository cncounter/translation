# Chapter 1: Introduction

# 第1章: Logback 简介

> The morale effects are startling. Enthusiasm jumps when there is a running system, even a simple one. Efforts redouble when the first picture from a new graphics software system appears on the screen, even if it is only a rectangle. One always has, at every stage in the process, a working system. I find that teams can grow much more complex entities in four months than they can build.
> —— FREDERICK P. BROOKS, JR., 《The Mythical Man-Month》

> 士气对软件项目的影响十分惊人。
> 只要系统能跑起来，大家的工作热情就会暴涨，即便这个系统非常简陋。
> 新的图形软件只要能在屏幕上展示图片，即使是个简单的框框，团队成员也会获得拼命的动力。
> 在项目的每个阶段，我们都需要一个能够正常运行的系统。
> 我发现, 项目团队, 可以在四个月的时间内, 成长到可以构建超乎他们原先所想象的系统。
> —— FREDERICK P. BROOKS, JR. 《人月神话》

| Authors: Ceki Gülcü, Sébastien Pennec, Carl Harris Copyright © 2000-2017, QOS.ch |      |
| ------------------------------------------------------------ | ---- |
| This document is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 2.5 License](http://creativecommons.org/licenses/by-nc-sa/2.5/) |      |

## What is logback?

## Logback 简介

Logback is intended as a successor to the popular log4j project. It was designed by Ceki Gülcü, log4j's founder. It builds upon a decade of experience gained in designing industrial-strength logging systems. The resulting product, i.e. logback, is faster and has a smaller footprint than all existing logging systems, sometimes by a wide margin. Just as importantly, logback offers [unique and rather useful features](https://logback.qos.ch/reasonsToSwitch.html) missing in other logging systems.

Logback由log4j项目的创始人CekiGülcü设计，基于产品级日志系统数十年的设计经验，目标是成为log4j的后续版本。
所以， logback才会比业界所有的日志系统都要快，占用资源少。
同样重要的是，logback提供了其他日志系统所缺少的[独特且实用的功能](https://logback.qos.ch/reasonsToSwitch.html)。

## First Baby Step

## 环境准备

> In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](https://logback.qos.ch/setup.html) for further details.

> 请确保引入了Logback相关的jar包。详情请参考 [setup page](https://logback.qos.ch/setup.html)

### Requirements

### 需求说明

Logback-classic module requires the presence of `slf4j-api.jar` and `logback-core.jar` in addition to `logback-classic.jar` on the classpath.

Logback-classic 模块除了需要 `logback-classic.jar`文件，还依赖 `slf4j-api.jar`和`logback-core.jar`。

The `logback-*.jar` files are part of the logback distribution whereas `slf4j-api-1.8.0-beta1.jar` ships with [SLF4J](http://www.slf4j.org/), a separate project.

`logback-*.jar` 这一类文件是logback发行版的一部分，而 `slf4j-api-1.8.0-beta1.jar` 等文件则是另一个独立项目 [SLF4J](http://www.slf4j.org/) 附带的。

Let us now begin experimenting with logback.

现在我们开始体验logback。

> Example 1.1: Basic template for logging

```java
package chapters.introduction;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HelloWorld1 {

  public static void main(String[] args) {

    Logger logger = LoggerFactory.getLogger("chapters.introduction.HelloWorld1");
    logger.debug("Hello world.");

  }
}
```



`HelloWorld1` class is defined in the `chapters.introduction` package. It starts by importing the [`Logger`](http://slf4j.org/api/org/slf4j/Logger.html) and [`LoggerFactory`](http://slf4j.org/api/org/slf4j/LoggerFactory.html) classes defined in the SLF4J API, specifically within the `org.slf4j` package.

`HelloWorld1`类定义在`chapters.introduction`包中。 首先引入了SLF4J API里面，`org.slf4j`包中的 [`Logger`](http://slf4j.org/api/org/slf4j/Logger.html) 和 [`LoggerFactory`](http://slf4j.org/api/org/slf4j/LoggerFactory.html) 这两个类，。

On the first line of the main() method, the variable named `logger` is assigned a `Logger` instance retrieved by invoking the static `getLogger` method from the `LoggerFactory` class. This logger is named "chapters.introduction.HelloWorld1". The main method proceeds to call the `debug` method of this logger passing "Hello World" as an argument. We say that the main method contains a logging statement of level DEBUG with the message "Hello world".

在main()方法的第一行，`Logger`类的实例变量被赋值给名为`logger`的变量，我们通过 `LoggerFactory` 类的静态方法 `getLogger` 来获取这个实例对象。 logger的名字是 "`chapters.introduction.HelloWorld1`"。 接着调用此logger的`debug`方法，传入的参数为 "`Hello World`"。
我们说, main方法包含了一个DEBUG级别的日志语句，消息内容为 "`Hello world`"。

Note that the above example does not reference any logback classes. In most cases, as far as logging is concerned, your classes will only need to import SLF4J classes. Thus, the vast majority, if not all, of your classes will use the SLF4J API and will be oblivious to the existence of logback.

请注意，上面的示例中并没有引入任何logback相关的类。 在大多数情况下，日志记录这一块，代码中只需要引入SLF4J的类即可。 因此，项目中的绝大多数代码都只会使用SLF4J API，并且将忽略logback的存在(某些特殊项目另说)。

You can launch the first sample application, `chapters.introduction.HelloWorld1` with the command:

可以用以下命令启动第一个示例程序：

```shell
java chapters.introduction.HelloWorld1
```

Launching the `HelloWorld1` application will output a single line on the console. By virtue of logback's default configuration policy, when no default configuration file is found, logback will add a `ConsoleAppender` to the root logger.

> 根据logback的默认配置策略，如果没有找到默认配置文件时，logback会将 `ConsoleAppender` 添加到 root logger。

启动`HelloWorld1`程序, 将在控制台上输出一行内容。


```shell
20:49:07.962 [main] DEBUG chapters.introduction.HelloWorld1 - Hello world.
```



Logback can report information about its internal state using a built-in status system. Important events occurring during logback's lifetime can be accessed through a component called `StatusManager`. For the time being, let us instruct logback to print its internal state by invoking the static `print()` method of the `StatusPrinter` class.

Logback可以使用内置状态系统来报告其内部状态相关的信息。
可以通过名为`StatusManager`的组件,访问在logback的生命周期中发生的重要事件。
我们通过调用`StatusPrinter`类的静态方法`print（）`来让logback打印其内部状态。

> Example 1.2: Printing Logger Status

```java
package chapters.introduction;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.core.util.StatusPrinter;

public class HelloWorld2 {

  public static void main(String[] args) {
    Logger logger = LoggerFactory.getLogger("chapters.introduction.HelloWorld2");
    logger.debug("Hello world.");

    // print internal state
    LoggerContext lc = (LoggerContext) LoggerFactory.getILoggerFactory();
    StatusPrinter.print(lc);
  }
}
```



Running the `HelloWorld2` application will produce the following output:

执行 `HelloWorld2`, 输出的日志内容类似于:

```
12:49:22.203 [main] DEBUG chapters.introduction.HelloWorld2 - Hello world.
12:49:22,076 |-INFO in ch.qos.logback.classic.LoggerContext[default] - Could NOT find resource [logback.groovy]
12:49:22,078 |-INFO in ch.qos.logback.classic.LoggerContext[default] - Could NOT find resource [logback-test.xml]
12:49:22,093 |-INFO in ch.qos.logback.classic.LoggerContext[default] - Could NOT find resource [logback.xml]
12:49:22,093 |-INFO in ch.qos.logback.classic.LoggerContext[default] - Setting up default configuration.
```

Logback explains that having failed to find the `logback-test.xml` and `logback.xml` configuration files (discussed later), it configured itself using its default policy, which is a basic `ConsoleAppender`. An `Appender` is a class that can be seen as an output destination. Appenders exist for many different destinations including the console, files, Syslog, TCP Sockets, JMS and many more. Users can also easily create their own Appenders as appropriate for their specific situation.

Logback解释说，由于未能找到`logback-test.xml`和`logback.xml`配置文件（稍后讨论），它使用默认策略配置自身，也就是一个简单的`ConsoleAppender`。 `Appender` 可以看作是一个输出目标。 Appenders支持各种输出目标，比如: 控制台，文件，Syslog，TCP套接字，JMS 等等。用户还可以根据具体情况创建自定义的Appender（如Kafka，数据库）。

Note that in case of errors, logback will automatically print its internal state on the console.

请注意，如果出现错误，logback将自动在控制台上打印其内部状态。

The previous examples are rather simple. Actual logging in a larger application would not be that different. The general pattern for logging statements would not change. Only the configuration process would be different. However, you would probably want to customize or configure logback according to your needs. Logback configuration will be covered in subsequent chapters.

前面的例子很简单。 大型应用系统中的日志记录，实际上也没有太大的区别。 大家记录日志的代码都是这种方式。 只有配置过程会有所不同。
当然，您可能希望自定义或根据需要配置logback。后续章节将介绍Logback配置。

Note that in the above example we have instructed logback to print its internal state by invoking the `StatusPrinter.print()` method. Logback's internal status information can be very useful in diagnosing logback-related problems.

请注意，在上面的示例中，我们通过 `StatusPrinter.print()` 方法让logback打印其内部状态。
这是一个实用的技巧, Logback的内部状态信息在诊断日志相关的问题时非常有用。

Here is a list of the three required steps in order to enable logging in your application.

下面是应用程序开启日志记录所需的三个步骤。

1. Configure the logback environment. You can do so in several more or less sophisticated ways. More on this later.
2. In every class where you wish to perform logging, retrieve a `Logger` instance by invoking the `org.slf4j.LoggerFactory` class' `getLogger()` method, passing the current class name or the class itself as a parameter.
3. Use this logger instance by invoking its printing methods, namely the debug(), info(), warn() and error() methods. This will produce logging output on the configured appenders.

-----

1. 配置Logback环境。可以通过简单或者复杂的方式来实现这一目标。 稍后会详细介绍。
2. 在希望记录日志的每个类中，通过调用 `org.slf4j.LoggerFactory` 类的 `getLogger()` 方法来获得 `Logger` 实例， 可以将当前类的名称或者class本身作为参数。
3. 调用 logger 实例的方法来输出日志, 比如 `debug()`, `info()`, `warn()` and `error()` 等, 将在配置的appender上产生日志输出。


## Building logback

## 从源码构建 logback

As its build tool, logback relies on [Maven](http://maven.apache.org/), a widely-used open-source build tool.

logback项目使用的构建工具是 [Maven](http://maven.apache.org/)，Maven是一款广泛使用的开源构建工具。

Once you have installed Maven, building the logback project, including all its modules, should be as easy as issuing a `mvn install` command from within the directory where you unarchived the logback distribution. Maven will automatically download the required external libraries.

只要安装了Maven，构建logback项目（包括其所有模块）应该很容易, 在 logback 源码的目录中执行 `mvn install` 命令即可。 Maven将自动下载所需的外部库。

Logback distributions contain complete source code such that you can modify parts of logback library and build your own version of it. You may even redistribute the modified version, as long as you adhere to the conditions of the LGPL license or the EPL license.

Logback发行版包含完整的源代码，您可以修改logback的代码并构建自己的版本。 甚至可以分发修改后的版本，只要您遵守LGPL许可证或者EPL许可证的条件即可。

For building logback under an IDE, please see the [relevant section on the class path setup page](https://logback.qos.ch/setup.html#ide).

要在IDE中构建回溯，请参阅 [relevant section on the class path setup page](https://logback.qos.ch/setup.html#ide)。


原文链接: <https://logback.qos.ch/manual/introduction.html>
