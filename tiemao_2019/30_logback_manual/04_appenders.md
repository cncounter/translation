# Chapter 4: Appenders

# 第4章: Appender

*There is so much to tell about the Western country in that day that it is hard to know where to start. One thing sets off a hundred others. The problem is to decide which one to tell first.*

—JOHN STEINBECK, *East of Eden*

> 关于当年的西部，有太多可讲的故事，让人不知从何说起。一件事牵出百件事，问题在于先讲哪一件。
>
> —— 约翰·斯坦贝克，《伊甸之东》

In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](http://logback.qos.ch/setup.html) for further details.

要运行本章中的示例，需要确保 classpath 中存在某些 jar 文件。详情请参考[安装说明](http://logback.qos.ch/setup.html)。

## What is an Appender?

## 什么是 Appender？

Logback delegates the task of writing a logging event to components called appenders. Appenders must implement the [`ch.qos.logback.core.Appender`](http://logback.qos.ch/xref/ch/qos/logback/core/Appender.html) interface. The salient methods of this interface are summarized below:

logback 把写日志事件的任务委托给称为 appender 的组件。Appender 必须实现 [`ch.qos.logback.core.Appender`](http://logback.qos.ch/xref/ch/qos/logback/core/Appender.html) 接口。该接口的主要方法汇总如下：

```
package ch.qos.logback.core;
  
import ch.qos.logback.core.spi.ContextAware;
import ch.qos.logback.core.spi.FilterAttachable;
import ch.qos.logback.core.spi.LifeCycle;
  

public interface Appender<E> extends LifeCycle, ContextAware, FilterAttachable {

  public String getName();
  public void setName(String name);
  void doAppend(E event);
  
}
```

Most of the methods in the `Appender` interface are setters and getters. A notable exception is the `doAppend()` method taking an object instance of type *E* as its only parameter. The actual type of *E* will vary depending on the logback module. Within the logback-classic module *E* would be of type [ILoggingEvent](http://logback.qos.ch/apidocs/ch/qos/logback/classic/spi/ILoggingEvent.html) and within the logback-access module it would be of type [AccessEvent](http://logback.qos.ch/apidocs/ch/qos/logback/access/spi/AccessEvent.html). The `doAppend()` method is perhaps the most important in the logback framework. It is responsible for outputting the logging events in a suitable format to the appropriate output device.

`Appender` 接口中的大部分方法都是 setter 和 getter。一个值得注意的例外是 `doAppend()` 方法，它以 *E* 类型的对象实例作为唯一参数。*E* 的实际类型取决于所用的 logback 模块：在 logback-classic 模块中，*E* 的类型是 [ILoggingEvent](http://logback.qos.ch/apidocs/ch/qos/logback/classic/spi/ILoggingEvent.html)；在 logback-access 模块中，则是 [AccessEvent](http://logback.qos.ch/apidocs/ch/qos/logback/access/spi/AccessEvent.html)。`doAppend()` 方法可以说是 logback 框架中最重要的方法，它负责以合适的格式把日志事件输出到相应的输出设备。

Appenders are named entities. This ensures that they can be referenced by name, a quality confirmed to be instrumental in configuration scripts. The `Appender` interface extends the `FilterAttachable` interface. It follows that one or more filters can be attached to an appender instance. Filters are discussed in detail in a subsequent chapter.

Appender 是有名字的实体，因此可以通过名称来引用它们——实践证明这个特性在配置脚本中非常有用。`Appender` 接口继承了 `FilterAttachable` 接口，也就是说，可以给 appender 实例挂载一个或多个过滤器。过滤器将在后续章节中详细讨论。

Appenders are ultimately responsible for outputting logging events. However, they may delegate the actual formatting of the event to a `Layout` or to an `Encoder` object. Each layout/encoder is associated with one and only one appender, referred to as the owning appender. Some appenders have a built-in or fixed event format. Consequently, they do not require nor have a layout/encoder. For example, the `SocketAppender` simply serializes logging events before transmitting them over the wire.

Appender 最终负责输出日志事件，但可以把事件的实际格式化工作委托给 `Layout` 或 `Encoder` 对象。每个 layout/encoder 只与唯一一个 appender 关联，这个 appender 称为其所属 appender（owning appender）。有些 appender 内置了固定的事件格式，因此不需要、也没有 layout/encoder。例如 `SocketAppender` 只是把日志事件序列化后直接在网上传输。

## AppenderBase

## AppenderBase

The [`ch.qos.logback.core.AppenderBase`](http://logback.qos.ch/xref/ch/qos/logback/core/AppenderBase.html) class is an abstract class implementing the `Appender` interface. It provides basic functionality shared by all appenders, such as methods for getting or setting their name, their activation status, their layout and their filters. It is the super-class of all appenders shipped with logback. Although an abstract class, `AppenderBase` actually implements the `doAppend()` method in the `Append` interface. Perhaps the clearest way to discuss `AppenderBase` class is by presenting an excerpt of actual source code.

[`ch.qos.logback.core.AppenderBase`](http://logback.qos.ch/xref/ch/qos/logback/core/AppenderBase.html) 是一个实现了 `Appender` 接口的抽象类，提供了所有 appender 共用的基础功能，比如获取/设置名称、激活状态、layout 和过滤器的方法。它是 logback 自带的所有 appender 的父类。虽然是抽象类，`AppenderBase` 实际上实现了 `Append` 接口中的 `doAppend()` 方法。讨论 `AppenderBase` 类最清晰的方式，也许就是展示一段真实的源码。

```
public synchronized void doAppend(E eventObject) {

  // prevent re-entry.
  if (guard) {
    return;
  }

  try {
    guard = true;

    if (!this.started) {
      if (statusRepeatCount++ < ALLOWED_REPEATS) {
        addStatus(new WarnStatus(
            "Attempted to append to non started appender [" + name + "].",this));
      }
      return;
    }

    if (getFilterChainDecision(eventObject) == FilterReply.DENY) {
      return;
    }
    
    // ok, we now invoke the derived class's implementation of append
    this.append(eventObject);

  } finally {
    guard = false;
  }
}
```

This implementation of the `doAppend()` method is synchronized. It follows that logging to the same appender from different threads is safe. While a thread, say *T*, is executing the `doAppend()` method, subsequent calls by other threads are queued until *T* leaves the `doAppend()` method, ensuring *T*'s exclusive access to the appender.

`doAppend()` 的这个实现是同步的，因此多个线程向同一个 appender 写日志是安全的。当某个线程（比如 *T*）正在执行 `doAppend()` 方法时，其他线程的后续调用会排队等待，直到 *T* 离开 `doAppend()` 方法，从而保证 *T* 对 appender 的独占访问。

Since such synchronization is not always appropriate, logback ships with [`ch.qos.logback.core.UnsynchronizedAppenderBase`](http://logback.qos.ch/xref/ch/qos/logback/core/UnsynchronizedAppenderBase.html) which is very similar to the [`AppenderBase`](http://logback.qos.ch/xref/ch/qos/logback/core/AppenderBase.html) class. For the sake of conciseness, we will be discussing `UnsynchronizedAppenderBase` in the remainder of this document.

由于这种同步并不总是合适的，logback 还提供了 [`ch.qos.logback.core.UnsynchronizedAppenderBase`](http://logback.qos.ch/xref/ch/qos/logback/core/UnsynchronizedAppenderBase.html)，它与 [`AppenderBase`](http://logback.qos.ch/xref/ch/qos/logback/core/AppenderBase.html) 类非常相似。为简洁起见，本文剩余部分将以 `UnsynchronizedAppenderBase` 为例进行讨论。

The first thing the `doAppend()` method does is to check whether the guard is set to true. If it is, it immediately exits. If the guard is not set, it is set to true at the next statement. The guard ensures that the `doAppend()` method will not recursively call itself. Just imagine that a component, called somewhere beyond the `append()` method, wants to log something. Its call could be directed to the very same appender that just called it resulting in an infinite loop and a stack overflow.

`doAppend()` 方法做的第一件事是检查 guard 标志是否为 true。如果是，立即退出；如果不是，则在下一条语句中把它置为 true。guard 标志保证 `doAppend()` 方法不会递归调用自身。设想一下：在 `append()` 方法内部的某个地方调用的某个组件也想写日志，而这个调用可能恰好又落到刚刚调用它的那个 appender 上，就会造成无限循环和栈溢出。

In the following statement we check whether the `started` field is true. If it is not, `doAppend()` will send a warning message and return. In other words, once an appender is closed, it is impossible to write to it. `Appender` objects implement the `LifeCycle` interface, which implies that they implement `start()`, `stop()` and `isStarted()` methods. After setting all the properties of an appender, Joran, logback's configuration framework, calls the `start()` method to signal the appender to activate its properties. Depending on its kind, an appender may fail to start if certain properties are missing or because of interference between various properties. For example, given that file creation depends on truncation mode, `FileAppender` cannot act on the value of its `File` option until the value of the Append option is also known with certainty. The explicit activation step ensures that an appender acts on its properties *after* their values become known.

接下来的语句检查 `started` 字段是否为 true。如果不是，`doAppend()` 会发出警告消息然后返回。换句话说，appender 一旦被关闭，就无法再向它写入。`Appender` 对象实现了 `LifeCycle` 接口，也就意味着它们实现了 `start()`、`stop()` 和 `isStarted()` 方法。在设置完 appender 的所有属性之后，logback 的配置框架 Joran 会调用 `start()` 方法，通知 appender 激活其属性。根据 appender 类型的不同，如果缺少某些属性，或者多个属性之间相互冲突，appender 可能启动失败。例如，文件的创建方式取决于截断模式，所以在 Append 选项的值确定之前，`FileAppender` 无法根据 `File` 选项的值行动。显式的激活步骤保证了 appender 在属性值*确定之后*才根据属性采取行动。

If the appender could not be started or if it has been stopped, a warning message will be issued through logback's internal status management system. After several attempts, in order to avoid flooding the internal status system with copies of the same warning message, the `doAppend()` method will stop issuing these warnings.

如果 appender 未能启动，或者已经被停止，logback 会通过内部的状态管理系统发出警告消息。尝试若干次之后，为了避免相同的警告消息刷爆内部状态系统，`doAppend()` 方法将不再发出这些警告。

The next `if` statement checks the result of the attached filters. Depending on the decision resulting from the filter chain, events can be denied or explicitly accepted. In the absence of a decision by the filter chain, events are accepted by default.

下一条 `if` 语句检查所挂载过滤器的结果。根据过滤链作出的裁决，事件可以被拒绝或显式接受；如果过滤链没有给出裁决，事件默认被接受。

The `doAppend()` method then invokes the derived classes' implementation of the `append()` method. This method does the actual work of appending the event to the appropriate device.

随后 `doAppend()` 方法调用子类实现的 `append()` 方法，由它完成把事件真正追加到相应设备的工作。

Finally, the guard is released so as to allow a subsequent invocation of the `doAppend()` method.

最后，guard 标志被释放，以便 `doAppend()` 方法可以被再次调用。

For the remainder of this manual, we reserve the term "option" or alternatively "property" for any attribute that is inferred dynamically using JavaBeans introspection through setter and getter methods.

在本手册的后续内容中，"option"（选项）或 "property"（属性）这两个术语专门指那些通过 setter 和 getter 方法、借助 JavaBeans 内省机制动态推断出来的属性。

# Logback-core

Logback-core lays the foundation upon which the other logback modules are built. In general, the components in logback-core require some, albeit minimal, customization. However, in the next few sections, we describe several appenders which are ready for use out of the box.

# Logback-core

Logback-core 是其他 logback 模块构建的基础。一般来说，logback-core 中的组件需要一些定制——尽管是最小程度的定制。不过，在接下来的几节里，我们将介绍几个开箱即用的 appender。

## OutputStreamAppender

## OutputStreamAppender

[`OutputStreamAppender`](http://logback.qos.ch/xref/ch/qos/logback/core/OutputStreamAppender.html) appends events to a `java.io.OutputStream`. This class provides basic services that other appenders build upon. Users do not usually instantiate `OutputStreamAppender` objects directly, since in general the `java.io.OutputStream` type cannot be conveniently mapped to a string, as there is no way to specify the target `OutputStream` object in a configuration script. Simply put, you cannot configure a `OutputStreamAppender` from a configuration file. However, this does not mean that `OutputStreamAppender` lacks configurable properties. These properties are described next.

[`OutputStreamAppender`](http://logback.qos.ch/xref/ch/qos/logback/core/OutputStreamAppender.html) 把事件追加到 `java.io.OutputStream` 上。这个类提供了其他 appender 所依赖的基础服务。用户通常不会直接实例化 `OutputStreamAppender` 对象，因为一般来说 `java.io.OutputStream` 类型无法方便地映射为字符串，也就无法在配置脚本中指定目标 `OutputStream` 对象。简单来说，不能通过配置文件来配置 `OutputStreamAppender`。但这并不意味着 `OutputStreamAppender` 没有可配置的属性，下面就来介绍这些属性。

| Property Name      | Type                                                         | Description                                                  |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **encoder**        | [`Encoder`](http://logback.qos.ch/xref/ch/qos/logback/core/encoder/Encoder.html) | Determines the manner in which an event is written to the underlying `OutputStreamAppender`. Encoders are described in a [dedicated chapter](http://logback.qos.ch/manual/encoders.html). |
| **immediateFlush** | `boolean`                                                    | The default value for immediateFlush is 'true'. Immediate flushing of the output stream ensures that logging events are immediately written out and will not be lost in case your application exits without properly closing appenders. On the other hand, setting this property to 'false' is likely to quadruple (your mileage may vary) logging throughput. Again, if immediateFlush is set to 'false' and if appenders are not closed properly when your application exits, then logging events not yet written to disk may be lost. |

The `OutputStreamAppender` is the super-class of three other appenders, namely `ConsoleAppender`, `FileAppender` which in turn is the super class of `RollingFileAppender`. The next figure illustrates the class diagram for `OutputStreamAppender` and its subclasses.

`OutputStreamAppender` 是另外三个 appender 的父类，即 `ConsoleAppender`、`FileAppender`，而 `FileAppender` 又是 `RollingFileAppender` 的父类。下图展示了 `OutputStreamAppender` 及其子类的类图。

![A UML diagram showing OutputStreamAppender and sub-classes](http://logback.qos.ch/manual/images/chapters/appenders/appenderClassDiagram.jpg)

## ConsoleAppender

## ConsoleAppender

The [`ConsoleAppender`](http://logback.qos.ch/xref/ch/qos/logback/core/ConsoleAppender.html), as the name indicates, appends on the console, or more precisely on *System.out* or *System.err*, the former being the default target. `ConsoleAppender` formats events with the help of an encoder specified by the user. Encoders will be discussed in a subsequent chapter. Both *System.out* and *System.err* are of type `java.io.PrintStream`. Consequently, they are wrapped inside an `OutputStreamWriter` which buffers I/O operations.

顾名思义，[`ConsoleAppender`](http://logback.qos.ch/xref/ch/qos/logback/core/ConsoleAppender.html) 把日志追加到控制台，更准确地说是追加到 *System.out* 或 *System.err*，默认目标是前者。`ConsoleAppender` 借助用户指定的 encoder 来格式化事件，encoder 将在后续章节讨论。*System.out* 和 *System.err* 的类型都是 `java.io.PrintStream`，因此它们会被包在一个对 I/O 操作进行缓冲的 `OutputStreamWriter` 里。

| Property Name | Type                                                         | Description                                                  |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **encoder**   | [`Encoder`](http://logback.qos.ch/xref/ch/qos/logback/core/encoder/Encoder.html) | See `OutputStreamAppender` properties.                       |
| **target**    | `String`                                                     | One of the String values *System.out* or *System.err*. The default target is *System.out*. |
| **withJansi** | `boolean`                                                    | By the default withJansi property is set to `false`. Setting withJansi to `true` activates the [Jansi](http://jansi.fusesource.org/) library which provides support for ANSI color codes on Windows machines. On a Windows host, if this property is set to true, then you should put "org.fusesource.jansi:jansi:1.17" on the class path. Note that Unix-based operating systems such as Linux and Mac OS X support ANSI color codes by default.Under the Eclipse IDE, you might want to try the [ANSI in Eclipse Console](http://www.mihai-nita.net/eclipse/) plugin. |

Here is a sample configuration that uses `ConsoleAppender`.

下面是一个使用 `ConsoleAppender` 的示例配置。

Example: ConsoleAppender configuration (logback-examples/src/main/resources/chapters/appenders/conf/logback-Console.xml)

示例：ConsoleAppender 配置

View as .groovy

```
<configuration>

  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <!-- encoders are assigned the type
         ch.qos.logback.classic.encoder.PatternLayoutEncoder by default -->
    <encoder>
      <pattern>%-4relative [%thread] %-5level %logger{35} - %msg %n</pattern>
    </encoder>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="STDOUT" />
  </root>
</configuration>
```

After you have set your current path to the *logback-examples* directory and [set up your class path](http://logback.qos.ch/setup.html), you can give the above configuration file a whirl by issuing the following command:

把当前路径切换到 *logback-examples* 目录并[设置好 class path](http://logback.qos.ch/setup.html) 之后，可以通过下面的命令试试上面的配置文件：

java [chapters.appenders.ConfigurationTester](http://logback.qos.ch/xref/chapters/appenders/ConfigurationTester.html) src/main/java/chapters/appenders/conf/logback-Console.xml

## FileAppender

## FileAppender

The [`FileAppender`](http://logback.qos.ch/xref/ch/qos/logback/core/FileAppender.html), a subclass of `OutputStreamAppender`, appends log events into a file. The target file is specified by the File option. If the file already exists, it is either appended to, or truncated depending on the value of the append property.

[`FileAppender`](http://logback.qos.ch/xref/ch/qos/logback/core/FileAppender.html) 是 `OutputStreamAppender` 的子类，把日志事件写入文件。目标文件由 File 选项指定。如果文件已存在，则根据 append 属性的值决定是追加还是截断。

| Property Name | Type                                                         | Description                                                  |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **append**    | `boolean`                                                    | If true, events are appended at the end of an existing file. Otherwise, if append is false, any existing file is truncated. The append option is set to true by default. |
| **encoder**   | [`Encoder`](http://logback.qos.ch/xref/ch/qos/logback/core/encoder/Encoder.html) | See `OutputStreamAppender` properties.                       |
| **file**      | `String`                                                     | The name of the file to write to. If the file does not exist, it is created. On the MS Windows platform users frequently forget to escape back slashes. For example, the value *c:\temp\test.log* is not likely to be interpreted properly as *'\t'* is an escape sequence interpreted as a single tab character *(\u0009)*. Correct values can be specified as *c:/temp/test.log* or alternatively as *c:\\temp\\test.log*. The File option has no default value.If the parent directory of the file does not exist, `FileAppender` will automatically create it, including any necessary but nonexistent parent directories. |
| **prudent**   | `boolean`                                                    | In prudent mode, `FileAppender` will safely write to the specified file, even in the presence of other `FileAppender` instances running in different JVMs, potentially running on different hosts. The default value for prudent mode is `false`.Prudent mode can be used in conjunction with `RollingFileAppender` although some [restrictions apply](http://logback.qos.ch/manual/appenders.html#prudentWithRolling).Prudent mode implies that append property is automatically set to true.Prudent more relies on exclusive file locks. Experiments show that file locks approximately triple (x3) the cost of writing a logging event. On an "average" PC writing to a file located on a **local** hard disk, when prudent mode is off, it takes about 10 microseconds to write a single logging event. When prudent mode is on, it takes approximately 30 microseconds to output a single logging event. This translates to logging throughput of 100'000 events per second when prudent mode is off and approximately 33'000 events per second in prudent mode.Prudent mode effectively serializes I/O operations between all JVMs writing to the same file. Thus, as the number of JVMs competing to access a file increases so will the delay incurred by each I/O operation. As long as the *total* number of I/O operations is in the order of 20 log requests per second, the impact on performance should be negligible. Applications generating 100 or more I/O operations per second can see an impact on performance and should avoid using prudent mode.**NETWORKED FILE LOCKS** When the log file is located on a networked file system, the cost of prudent mode is even greater. Just as importantly, file locks over a networked file system can be sometimes strongly biased such that the process currently owning the lock immediately re-obtains the lock upon its release. Thus, while one process hogs the lock for the log file, other processes starve waiting for the lock to the point of appearing deadlocked.The impact of prudent mode is highly dependent on network speed as well as the OS implementation details. We provide an very small application called [FileLockSimulator](https://gist.github.com/2794241) which can help you simulate the behavior of prudent mode in your environment. |

**IMMEDIATE FLUSH** By default, each log event is immediately flushed to the underlying output stream. This default approach is safer in the sense that logging events are not lost in case your application exits without properly closing appenders. However, for significantly increased logging throughput, you may want to set the immediateFlush property to `false`.

**立即刷新（IMMEDIATE FLUSH）** 默认情况下，每条日志事件都会立即刷新到底层输出流。这种默认做法更安全：即使应用退出时没有正确关闭 appender，日志事件也不会丢失。不过，如果想大幅提高日志吞吐量，可以把 immediateFlush 属性设置为 `false`。

Below is an example of a configuration file for `FileAppender`:

下面是 `FileAppender` 的一个配置文件示例：

Example: FileAppender configuration (logback-examples/src/main/resources/chapters/appenders/conf/logback-fileAppender.xml)

示例：FileAppender 配置

View as .groovy

```
<configuration>

  <appender name="FILE" class="ch.qos.logback.core.FileAppender">
    <file>testFile.log</file>
    <append>true</append>
    <!-- set immediateFlush to false for much higher logging throughput -->
    <immediateFlush>true</immediateFlush>
    <!-- encoders are assigned the type
         ch.qos.logback.classic.encoder.PatternLayoutEncoder by default -->
    <encoder>
      <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
    </encoder>
  </appender>
        
  <root level="DEBUG">
    <appender-ref ref="FILE" />
  </root>
</configuration>
```

After changing the current directory to *logback-examples*, run this example by launching the following command:

把当前目录切换到 *logback-examples* 之后，通过下面的命令运行这个示例：

java chapters.appenders.ConfigurationTester   src/main/java/chapters/appenders/conf/logback-fileAppender.xml

### Uniquely named files (by timestamp)

### 按时间戳生成唯一命名的文件

During the application development phase or in the case of short-lived applications, e.g. batch applications, it is desirable to create a new log file at each new application launch. This is fairly easy to do with the help of the `` element. Here's an example.

在应用开发阶段，或者对于生命周期较短的应用（比如批处理应用），通常希望每次启动应用时都创建一个新的日志文件。借助 `<timestamp>` 元素可以相当容易地做到这一点。下面是一个示例。

Example: Uniquely named FileAppender configuration by timestamp (logback-examples/src/main/resources/chapters/appenders/conf/logback-timestamp.xml)

示例：按时间戳唯一命名的 FileAppender 配置

View as .groovy

```
<configuration>

  <!-- Insert the current time formatted as "yyyyMMdd'T'HHmmss" under
       the key "bySecond" into the logger context. This value will be
       available to all subsequent configuration elements. -->
  <timestamp key="bySecond" datePattern="yyyyMMdd'T'HHmmss"/>

  <appender name="FILE" class="ch.qos.logback.core.FileAppender">
    <!-- use the previously created timestamp to create a uniquely
         named log file -->
    <file>log-${bySecond}.txt</file>
    <encoder>
      <pattern>%logger{35} - %msg%n</pattern>
    </encoder>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="FILE" />
  </root>
</configuration>
```

The timestamp element takes two mandatory attributes *key* and *datePattern* and an optional *timeReference* attribute. The *key* attribute is the name of the key under which the timestamp will be available to subsequent configuration elements [as a variable](http://logback.qos.ch/manual/configuration.html#variableSubstitution). The *datePattern* attribute denotes the date pattern used to convert the current time (at which the configuration file is parsed) into a string. The date pattern should follow the conventions defined in [SimpleDateFormat](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html). The *timeReference* attribute denotes the time reference for the time stamp. The default is the interpretation/parsing time of the configuration file, i.e. the current time. However, under certain circumstances it might be useful to use the context birth time as time reference. This can be accomplished by setting the *timeReference* attribute to `"contextBirth"`.

timestamp 元素有两个必填属性 *key* 和 *datePattern*，以及一个可选属性 *timeReference*。*key* 属性是键的名称，时间戳会以[变量](http://logback.qos.ch/manual/configuration.html#variableSubstitution)的形式存放在这个键下，供后续的配置元素使用。*datePattern* 属性表示把当前时间（即解析配置文件时的时间）转换为字符串所用的日期模式，日期模式应遵循 [SimpleDateFormat](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html) 定义的惯例。*timeReference* 属性表示时间戳的时间基准，默认是配置文件的解析时间，也就是当前时间。不过在某些场景下，使用上下文创建时间作为时间基准可能更有用，这可以通过把 *timeReference* 属性设置为 `"contextBirth"` 来实现。

Experiment with the `` element by running the command:

通过运行下面的命令来试验 `<timestamp>` 元素：

java chapters.appenders.ConfigurationTester src/main/resources/chapters/appenders/conf/logback-timestamp.xml

To use the logger context birth date as time reference, you would set the *timeReference* attribute to "contextBirth" as shown below.

要把 logger 上下文的创建日期作为时间基准，可以像下面这样把 *timeReference* 属性设置为 "contextBirth"。

Example: Timestamp using context birth date as time reference (logback-examples/src/main/resources/chapters/appenders/conf/logback-timestamp-contextBirth.xml)

示例：以上下文创建日期为时间基准的 timestamp

View as .groovy

```
<configuration>
  <timestamp key="bySecond" datePattern="yyyyMMdd'T'HHmmss" 
             timeReference="contextBirth"/>
  ...
</configuration>
```

## RollingFileAppender

## RollingFileAppender

[`RollingFileAppender`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/RollingFileAppender.html) extends `FileAppender` with the capability to rollover log files. For example, `RollingFileAppender` can log to a file named *log.txt* file and, once a certain condition is met, change its logging target to another file.

[`RollingFileAppender`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/RollingFileAppender.html) 继承自 `FileAppender`，具备滚动（rollover）日志文件的能力。例如，`RollingFileAppender` 可以先写入名为 *log.txt* 的文件，一旦满足某个条件，就切换目标到另一个文件。

There are two important sub-components that interact with `RollingFileAppender`. The first `RollingFileAppender` sub-component, namely `RollingPolicy`, ([see below](http://logback.qos.ch/manual/appenders.html#onRollingPolicies)) is responsible for undertaking the actions required for a rollover. A second sub-component of `RollingFileAppender`, namely `TriggeringPolicy`, ([see below](http://logback.qos.ch/manual/appenders.html#TriggeringPolicy)) will determine if and exactly when rollover occurs. Thus, `RollingPolicy` is responsible for the *what* and `TriggeringPolicy` is responsible for the *when*.

与 `RollingFileAppender` 配合的有两个重要的子组件。第一个子组件是 `RollingPolicy`（[见下文](http://logback.qos.ch/manual/appenders.html#onRollingPolicies)），负责执行滚动所需的动作；第二个子组件是 `TriggeringPolicy`（[见下文](http://logback.qos.ch/manual/appenders.html#TriggeringPolicy)），决定是否滚动以及究竟在什么时机滚动。也就是说，`RollingPolicy` 负责*做什么*，`TriggeringPolicy` 负责*什么时候做*。

To be of any use, a `RollingFileAppender` must have both a `RollingPolicy` and a `TriggeringPolicy` set up. However, if its `RollingPolicy` also implements the `TriggeringPolicy` interface, then only the former needs to be specified explicitly.

要真正可用，`RollingFileAppender` 必须同时设置 `RollingPolicy` 和 `TriggeringPolicy`。不过，如果它的 `RollingPolicy` 同时也实现了 `TriggeringPolicy` 接口，那么只需要显式指定前者即可。

Here are the available properties for `RollingFileAppender`:

下面是 `RollingFileAppender` 的可用属性：

| Property Name        | Type                                                         | Description                                                  |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **file**             | `String`                                                     | See `FileAppender` properties.                               |
| **append**           | `boolean`                                                    | See `FileAppender` properties.                               |
| **encoder**          | [`Encoder`](http://logback.qos.ch/xref/ch/qos/logback/core/encoder/Encoder.html) | See `OutputStreamAppender` properties.                       |
| **rollingPolicy**    | `RollingPolicy`                                              | This option is the component that will dictate `RollingFileAppender`'s behavior when rollover occurs. See more information below. |
| **triggeringPolicy** | `TriggeringPolicy`                                           | This option is the component that will tell `RollingFileAppender` when to activate the rollover procedure. See more information below. |
| **prudent**          | `boolean`                                                    | [`FixedWindowRollingPolicy`](http://logback.qos.ch/manual/appenders.html#FixedWindowRollingPolicy) is not supported in prudent mode.`RollingFileAppender` supports the prudent mode in conjunction with [`TimeBasedRollingPolicy`](http://logback.qos.ch/manual/appenders.html#TimeBasedRollingPolicy) albeit with two restrictions.In prudent mode, file compression is not supported nor allowed. (We can't have one JVM writing to a file while another JVM is compressing it.)The file property of `FileAppender` cannot be set and must be left blank. Indeed, most operating systems do not allow renaming of a file while another process has it opened.See also properties for `FileAppender`. |

### Overview of rolling policies

### 滚动策略概览

[`RollingPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/RollingPolicy.html) is responsible for the rollover procedure which involves file moving and renaming.

[`RollingPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/RollingPolicy.html) 负责滚动过程，包括文件的移动和重命名。

The `RollingPolicy` interface is presented below:

`RollingPolicy` 接口如下：

```
package ch.qos.logback.core.rolling;  

import ch.qos.logback.core.FileAppender;
import ch.qos.logback.core.spi.LifeCycle;

public interface RollingPolicy extends LifeCycle {

  public void rollover() throws RolloverFailure;
  public String getActiveFileName();
  public CompressionMode getCompressionMode();
  public void setParent(FileAppender appender);
}
```

The `rollover` method accomplishes the work involved in archiving the current log file. The `getActiveFileName()` method is called to compute the file name of the current log file (where live logs are written to). As indicated by `getCompressionMode` method a RollingPolicy is also responsible for determining the compression mode. Lastly, a `RollingPolicy` is given a reference to its parent via the `setParent` method.

`rollover` 方法完成归档当前日志文件的相关工作。`getActiveFileName()` 方法用来计算当前日志文件（即实时日志写入的文件）的文件名。正如 `getCompressionMode` 方法所表明的，RollingPolicy 还负责确定压缩模式。最后，通过 `setParent` 方法会给 `RollingPolicy` 传入对其父类的引用。

#### TimeBasedRollingPolicy

#### TimeBasedRollingPolicy

[`TimeBasedRollingPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/TimeBasedRollingPolicy.html) is possibly the most popular rolling policy. It defines a rollover policy based on time, for example by day or by month. `TimeBasedRollingPolicy` assumes the responsibility for rollover as well as for the triggering of said rollover. Indeed, `TimeBasedTriggeringPolicy` implements *both* `RollingPolicy` and `TriggeringPolicy` interfaces.

[`TimeBasedRollingPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/TimeBasedRollingPolicy.html) 可能是最流行的滚动策略，它定义了基于时间的滚动策略，比如按天或按月。`TimeBasedRollingPolicy` 既负责滚动本身，也负责触发滚动——实际上，`TimeBasedTriggeringPolicy` 同时实现了 `RollingPolicy` 和 `TriggeringPolicy` 两个接口。

`TimeBasedRollingPolicy`'s configuration takes one mandatory fileNamePattern property and several optional properties.

`TimeBasedRollingPolicy` 的配置需要一个必填的 fileNamePattern 属性，以及若干可选属性。

| Property Name           | Type     | Description                                                  |
| ----------------------- | -------- | ------------------------------------------------------------ |
| **fileNamePattern**     | `String` | The mandatory fileNamePattern property defines the name of the rolled-over (archived) log files. Its value should consist of the name of the file, plus a suitably placed *%d* conversion specifier. The *%d* conversion specifier may contain a date-and-time pattern as specified by the `java.text.SimpleDateFormat` class. If the date-and-time pattern is omitted, then the default pattern *yyyy-MM-dd* is assumed. **The rollover period is inferred from the value of fileNamePattern.**Note that the file property in `RollingFileAppender` (the parent of `TimeBasedRollingPolicy`) can be either set or omitted. By setting the file property of the containing `FileAppender`, you can decouple the location of the active log file and the location of the archived log files. The current logs will be always targeted at the file specified by the file property. It follows that the name of the currently active log file will not change over time. However, if you choose to omit the file property, then the active file will be computed anew for each period based on the value of fileNamePattern. The examples below should clarify this point.The date-and-time pattern, as found within the accolades of %d{} follow java.text.SimpleDateFormat conventions. The forward slash '/' or backward slash '\' characters anywhere within the fileNamePattern property or within the date-and-time pattern will be interpreted as directory separators.Multiple %d specifiersIt is possible to specify multiple %d specifiers but only one of which can be primary, i.e. used to infer the rollover period. All other tokens *must* be marked as auxiliary by passing the 'aux' parameter (see examples below).Multiple %d specifiers allow you to organize archive files in a folder structure different than that of the roll-over period. For example, the file name pattern shown below organizes log folders by year and month but roll-over log files every day at midnight.`/var/log/**%d{yyyy/MM, aux}**/myapplication.**%d{yyyy-MM-dd}**.log`TimeZoneUnder certain circumstances, you might wish to roll-over log files according to a clock in a timezone different than that of the host. It is possible to pass a timezone argument following the date-and-time pattern within the %d conversion specifier. For example:`aFolder/test.**%d**{yyyy-MM-dd-HH, **UTC**}.log`If the specified timezone identifier is unknown or misspelled, the GMT timezone is assumed as dictated by the [TimeZone.getTimeZone(String)](http://docs.oracle.com/javase/6/docs/api/java/util/TimeZone.html#getTimeZone(java.lang.String)) method specification. |
| **maxHistory**          | int      | The optional maxHistory property controls the maximum number of archive files to keep, asynchronously deleting older files. For example, if you specify monthly rollover, and set maxHistory to 6, then 6 months worth of archives files will be kept with files older than 6 months deleted. Note as old archived log files are removed, any folders which were created for the purpose of log file archiving will be removed as appropriate. |
| **totalSizeCap**        | int      | The optional totalSizeCap property controls the total size of all archive files. Oldest archives are deleted asynchronously when the total size cap is exceeded. The totalSizeCap property requires maxHistory property to be set as well. Moreover, the "max history" restriction is always applied first and the "total size cap" restriction applied second. |
| **cleanHistoryOnStart** | boolean  | If set to true, archive removal will be executed on appender start up. By default this property is set to false.Archive removal is normally performed during roll over. However, some applications may not live long enough for roll over to be triggered. It follows that for such short-lived applications archive removal may never get a chance to execute. By setting cleanHistoryOnStart to true, archive removal is performed at appender start up. |

Here are a few `fileNamePattern` values with an explanation of their effects.

下面列出几个 `fileNamePattern` 的取值及其效果说明。

| fileNamePattern                            | Rollover schedule                                            | Example                                                      |
| ------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| */wombat/foo.%d*                           | Daily rollover (at midnight). Due to the omission of the optional time and date pattern for the *%d* token specifier, the default pattern of *yyyy-MM-dd* is assumed, which corresponds to daily rollover. | file property not set: During November 23rd, 2006, logging output will go to the file */wombat/foo.2006-11-23*. At midnight and for the rest of the 24th, logging output will be directed to */wombat/foo.2006-11-24*.file property set to */wombat/foo.txt*: During November 23rd, 2006, logging output will go to the file */wombat/foo.txt*. At midnight, *foo.txt* will be renamed as */wombat/foo.2006-11-23*. A new */wombat/foo.txt* file will be created and for the rest of November 24th logging output will be directed to *foo.txt*. |
| */wombat/%d{yyyy/MM}/foo.txt*              | Rollover at the beginning of each month.                     | file property not set: During the month of October 2006, logging output will go to */wombat/2006/10/foo.txt*. After midnight of October 31st and for the rest of November, logging output will be directed to */wombat/2006/11/foo.txt*.file property set to */wombat/foo.txt*: The active log file will always be */wombat/foo.txt*. During the month of October 2006, logging output will go to */wombat/foo.txt*. At midnight of October 31st, */wombat/foo.txt* will be renamed as */wombat/2006/10/foo.txt*. A new */wombat/foo.txt* file will be created where logging output will go for the rest of November. At midnight of November 30th, */wombat/foo.txt* will be renamed as */wombat/2006/11/foo.txt* and so on. |
| */wombat/foo.%d{yyyy-ww}.log*              | Rollover at the first day of each week. Note that the first day of the week depends on the locale. | Similar to previous cases, except that rollover will occur at the beginning of every new week. |
| */wombat/foo%d{yyyy-MM-dd_HH}.log*         | Rollover at the top of each hour.                            | Similar to previous cases, except that rollover will occur at the top of every hour. |
| */wombat/foo%d{yyyy-MM-dd_HH-mm}.log*      | Rollover at the beginning of every minute.                   | Similar to previous cases, except that rollover will occur at the beginning of every minute. |
| */wombat/foo%d{yyyy-MM-dd_HH-mm, UTC}.log* | Rollover at the beginning of every minute.                   | Similar to previous cases, except that file names will be expressed in UTC. |
| */foo/%d{yyyy-MM,**aux**}/%d.log*          | Rollover daily. Archives located under a folder containing year and month. | In this example, the first %d token is marked as **aux**iliary. The second %d token, with time and date pattern omitted, is then assumed to be primary. Thus, rollover will occur daily (default for %d) and the folder name will depend on the year and month. For example, during the month of November 2006, archived files will all placed under the /foo/2006-11/ folder, e.g */foo/2006-11/2006-11-14.log*. |

Any forward or backward slash characters are interpreted as folder (directory) separators. Any required folder will be created as necessary. You can thus easily place your log files in separate folders.

正斜杠和反斜杠字符都会被解释为文件夹（目录）分隔符，所需的文件夹会按需自动创建。因此可以轻松把日志文件放到不同的文件夹里。

`TimeBasedRollingPolicy` supports automatic file compression. This feature is enabled if the value of the fileNamePattern option ends with *.gz* or *.zip*.

`TimeBasedRollingPolicy` 支持自动文件压缩。如果 fileNamePattern 选项的值以 *.gz* 或 *.zip* 结尾，就会启用该功能。

| fileNamePattern     | Rollover schedule                                            | Example                                                      |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| */wombat/foo.%d.gz* | Daily rollover (at midnight) with automatic GZIP compression of the archived files. | file property not set: During November 23rd, 2009, logging output will go to the file */wombat/foo.2009-11-23*. However, at midnight that file will be compressed to become */wombat/foo.2009-11-23.gz*. For the 24th of November, logging output will be directed to */wombat/folder/foo.2009-11-24* until it's rolled over at the beginning of the next day.file property set to /wombat/foo.txt: During November 23rd, 2009, logging output will go to the file */wombat/foo.txt*. At midnight that file will be compressed and renamed as */wombat/foo.2009-11-23.gz*. A new */wombat/foo.txt* file will be created where logging output will go for the rest of November 24rd. At midnight November 24th, */wombat/foo.txt* will be compressed and renamed as */wombat/foo.2009-11-24.gz* and so on. |

The fileNamePattern serves a dual purpose. First, by studying the pattern, logback computes the requested rollover periodicity. Second, it computes each archived file's name. Note that it is possible for two different patterns to specify the same periodicity. The patterns *yyyy-MM* and *yyyy@MM* both specify monthly rollover, although the resulting archive files will carry different names.

fileNamePattern 有双重作用。首先，logback 通过分析该模式计算出所要求的滚动周期；其次，它用来计算每个归档文件的文件名。注意，两个不同的模式可以指定相同的周期，比如 *yyyy-MM* 和 *yyyy@MM* 都表示按月滚动，只是生成的归档文件名不同。

By setting the file property you can decouple the location of the active log file and the location of the archived log files. The logging output will be targeted into the file specified by the file property. It follows that the name of the active log file will not change over time. However, if you choose to omit the file property, then the active file will be computed anew for each period based on the value of fileNamePattern. By leaving the file option unset you can avoid file [renaming errors](http://logback.qos.ch/codes.html#renamingError) which occur while there exist external file handles referencing log files during roll over.

通过设置 file 属性，可以把活动日志文件的位置和归档日志文件的位置解耦。日志输出会写入 file 属性指定的文件，因此活动日志文件的名称不会随时间变化。但如果省略 file 属性，那么每个周期都会根据 fileNamePattern 的值重新计算活动文件。不设置 file 选项还可以避免滚动期间因外部文件句柄仍引用日志文件而产生的文件[重命名错误](http://logback.qos.ch/codes.html#renamingError)。

The maxHistory property controls the maximum number of archive files to keep, deleting older files. For example, if you specify monthly rollover, and set maxHistory to 6, then 6 months worth of archives files will be kept with files older than 6 months deleted. Note as old archived log files are removed, any folders which were created for the purpose of log file archiving will be removed as appropriate.

maxHistory 属性控制保留的归档文件的最大数量，更早的文件会被删除。例如，指定按月滚动并把 maxHistory 设为 6，就会保留 6 个月的归档文件，超过 6 个月的会被删除。注意，随着旧归档日志文件被移除，为归档日志而创建的文件夹也会被酌情删除。

For various technical reasons, rollovers are not clock-driven but depend on the arrival of logging events. For example, on 8th of March 2002, assuming the fileNamePattern is set to *yyyy-MM-dd* (daily rollover), the arrival of the first event after midnight will trigger a rollover. If there are no logging events during, say 23 minutes and 47 seconds after midnight, then rollover will actually occur at 00:23'47 AM on March 9th and not at 0:00 AM. Thus, depending on the arrival rate of events, rollovers might be triggered with some latency. However, regardless of the delay, the rollover algorithm is known to be correct, in the sense that all logging events generated during a certain period will be output in the correct file delimiting that period.

由于各种技术上的原因，滚动并不是由时钟驱动的，而是取决于日志事件的到来。例如，在 2002 年 3 月 8 日，假设 fileNamePattern 设置为 *yyyy-MM-dd*（按天滚动），午夜之后第一个事件到来时才会触发滚动。如果午夜之后的 23 分 47 秒内没有任何日志事件，那么滚动实际上会发生在 3 月 9 日的 00:23'47，而不是 0:00。也就是说，根据事件到达速率的不同，滚动的触发可能会有一定的延迟。不过无论延迟多少，滚动算法都是正确的：某个时间段内产生的所有日志事件，都会输出到划定该时间段的正确文件中。

Here is a sample configuration for `RollingFileAppender` in conjunction with a `TimeBasedRollingPolicy`.

下面是 `RollingFileAppender` 配合 `TimeBasedRollingPolicy` 的示例配置。

Example: Sample configuration of a `RollingFileAppender` using a `TimeBasedRollingPolicy` (logback-examples/src/main/resources/chapters/appenders/conf/logback-RollingTimeBased.xml)

示例：使用 `TimeBasedRollingPolicy` 的 `RollingFileAppender` 配置

View as .groovy

```
<configuration>
  <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>logFile.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <!-- daily rollover -->
      <fileNamePattern>logFile.%d{yyyy-MM-dd}.log</fileNamePattern>

      <!-- keep 30 days' worth of history capped at 3GB total size -->
      <maxHistory>30</maxHistory>
      <totalSizeCap>3GB</totalSizeCap>

    </rollingPolicy>

    <encoder>
      <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
    </encoder>
  </appender> 

  <root level="DEBUG">
    <appender-ref ref="FILE" />
  </root>
</configuration>
```

The next configuration sample illustrates the use of `RollingFileAppender` associated with `TimeBasedRollingPolicy` in prudent mode.

下一个配置示例演示了 `RollingFileAppender` 在 prudent 模式下配合 `TimeBasedRollingPolicy` 的用法。

Example: Sample configuration of a `RollingFileAppender` using a `TimeBasedRollingPolicy` (logback-examples/src/main/resources/chapters/appenders/conf/logback-PrudentTimeBasedRolling.xml)

示例：prudent 模式下使用 `TimeBasedRollingPolicy` 的 `RollingFileAppender` 配置

View as .groovy

```
<configuration>
  <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <!-- Support multiple-JVM writing to the same log file -->
    <prudent>true</prudent>
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <fileNamePattern>logFile.%d{yyyy-MM-dd}.log</fileNamePattern>
      <maxHistory>30</maxHistory> 
      <totalSizeCap>3GB</totalSizeCap>
    </rollingPolicy>

    <encoder>
      <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
    </encoder>
  </appender> 

  <root level="DEBUG">
    <appender-ref ref="FILE" />
  </root>
</configuration>
```

### Size and time based rolling policy

### 按大小和时间的滚动策略

Sometimes you may wish to archive files essentially by date but at the same time limit the size of each log file, in particular if post-processing tools impose size limits on the log files. In order to address this requirement, logback ships with `SizeAndTimeBasedRollingPolicy`.

有时你可能希望基本按日期归档文件，同时又限制每个日志文件的大小，特别是当后处理工具对日志文件有大小限制的时候。为了满足这一需求，logback 提供了 `SizeAndTimeBasedRollingPolicy`。

Note that `TimeBasedRollingPolicy` already allows limiting the combined size of archived log files. If you only wish to limit the combined size of log archives, then `TimeBasedRollingPolicy` described above and setting the [totalSizeCap](http://logback.qos.ch/manual/appenders.html#tbrpTotalSizeCap) property should be amply sufficent.

注意，`TimeBasedRollingPolicy` 本身已经可以限制归档日志文件的总大小。如果你只想限制日志归档的总大小，那么使用上文介绍的 `TimeBasedRollingPolicy` 并设置 [totalSizeCap](http://logback.qos.ch/manual/appenders.html#tbrpTotalSizeCap) 属性就足够了。

Here is a sample configuration file demonstrating time and size based log file archiving.

下面是一个演示按时间和大小归档日志文件的示例配置文件。

Example: Sample configuration for `SizeAndTimeBasedFNATP` (logback-examples/src/main/resources/chapters/appenders/conf/logback-sizeAndTime.xml)

示例：`SizeAndTimeBasedFNATP` 配置

View as .groovy

```
<configuration>
  <appender name="ROLLING" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>mylog.txt</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
      <!-- rollover daily -->
      <fileNamePattern>mylog-%d{yyyy-MM-dd}.%i.txt</fileNamePattern>
       <!-- each file should be at most 100MB, keep 60 days worth of history, but at most 20GB -->
       <maxFileSize>100MB</maxFileSize>    
       <maxHistory>60</maxHistory>
       <totalSizeCap>20GB</totalSizeCap>
    </rollingPolicy>
    <encoder>
      <pattern>%msg%n</pattern>
    </encoder>
  </appender>


  <root level="DEBUG">
    <appender-ref ref="ROLLING" />
  </root>

</configuration>
```

Note the "%i" conversion token in addition to "%d". **Both the %i and %d tokens are mandatory.** Each time the current log file reaches maxFileSize before the current time period ends, it will be archived with an increasing index, starting at 0.

注意，除了 "%d" 之外还有 "%i" 转换符。**%i 和 %d 两个转换符都是必需的。** 在当前时间段结束之前，当前日志文件每达到一次 maxFileSize，就会被归档一次，索引从 0 开始递增。

Size and time based archiving supports deletion of old archive files. You need to specify the number of periods to preserve with the maxHistory property. When your application is stopped and restarted, logging will continue at the correct location, i.e. at the largest index number for the current period.

按大小和时间的归档方式也支持删除旧的归档文件。需要通过 maxHistory 属性指定保留的时间段数量。当应用停止后重新启动时，日志会从正确的位置继续写入，也就是当前时间段的最大索引号处。

In versions prior to 1.1.7, this document mentioned a component called `SizeAndTimeBasedFNATP`. However, given that `SizeAndTimeBasedFNATP` offers a simpler configuration structure, we no longer document `SizeAndTimeBasedFNATP`. Nevertheless, earlier configuration files using `SizeAndTimeBasedFNATP` will continue to work just fine. In fact, `SizeAndTimeBasedRollingPolicy` is implemented with a `SizeAndTimeBasedFNATP` subcomponent.

在 1.1.7 之前的版本中，本文档提到过一个叫 `SizeAndTimeBasedFNATP` 的组件。不过由于 `SizeAndTimeBasedRollingPolicy` 提供了更简洁的配置结构，我们不再介绍 `SizeAndTimeBasedFNATP`。尽管如此，早期使用 `SizeAndTimeBasedFNATP` 的配置文件仍然可以正常工作。实际上，`SizeAndTimeBasedRollingPolicy` 就是通过一个 `SizeAndTimeBasedFNATP` 子组件来实现的。

#### FixedWindowRollingPolicy

#### FixedWindowRollingPolicy

When rolling over, [`FixedWindowRollingPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/FixedWindowRollingPolicy.html) renames files according to a fixed window algorithm as described below.

滚动时，[`FixedWindowRollingPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/FixedWindowRollingPolicy.html) 按照下文描述的固定窗口算法对文件进行重命名。

The fileNamePattern option represents the file name pattern for the archived (rolled over) log files. This option is required and must include an integer token *%i* somewhere within the pattern.

fileNamePattern 选项表示归档（滚动后）日志文件的文件名模式。该选项是必需的，并且模式中必须包含一个表示整数的 *%i* 转换符。

Here are the available properties for `FixedWindowRollingPolicy`

下面是 `FixedWindowRollingPolicy` 的可用属性：

| Property Name       | Type     | Description                                                  |
| ------------------- | -------- | ------------------------------------------------------------ |
| **minIndex**        | `int`    | This option represents the lower bound for the window's index. |
| **maxIndex**        | `int`    | This option represents the upper bound for the window's index. |
| **fileNamePattern** | `String` | This option represents the pattern that will be followed by the `FixedWindowRollingPolicy` when renaming the log files. It must contain the string *%i*, which will indicate the position where the value of the current window index will be inserted.For example, using *MyLogFile%i.log* associated with minimum and maximum values of *1* and *3* will produce archive files named *MyLogFile1.log*, *MyLogFile2.log* and *MyLogFile3.log*.Note that file compression is also specified via this property. For example, fileNamePattern set to *MyLogFile%i.log.zip* means that archived files must be compressed using the *zip* format; *gz* format is also supported. |

Given that the fixed window rolling policy requires as many file renaming operations as the window size, large window sizes are strongly discouraged. When large values are specified by the user, the current implementation will automatically reduce the window size to 20.

由于固定窗口滚动策略所需的文件重命名操作次数与窗口大小相同，强烈不建议使用过大的窗口。当用户指定较大的值时，当前实现会自动把窗口大小缩减为 20。

Let us go over a more concrete example of the fixed window rollover policy. Suppose that minIndex is set to *1*, maxIndex set to *3*, fileNamePattern property set to *foo%i.log*, and that file property is set to *foo.log*.

下面来看固定窗口滚动策略更具体的例子。假设 minIndex 设为 *1*，maxIndex 设为 *3*，fileNamePattern 属性设为 *foo%i.log*，file 属性设为 *foo.log*。

| Number of rollovers | Active output target | Archived log files           | Description                                                  |
| ------------------- | -------------------- | ---------------------------- | ------------------------------------------------------------ |
| 0                   | foo.log              | -                            | No rollover has happened yet, logback logs into the initial file. |
| 1                   | foo.log              | foo1.log                     | First rollover. *foo.log* is renamed as *foo1.log*. A new *foo.log* file is created and becomes the active output target. |
| 2                   | foo.log              | foo1.log, foo2.log           | Second rollover. *foo1.log* is renamed as *foo2.log*. *foo.log* is renamed as *foo1.log*. A new *foo.log* file is created and becomes the active output target. |
| 3                   | foo.log              | foo1.log, foo2.log, foo3.log | Third rollover. *foo2.log* is renamed as *foo3.log*. *foo1.log* is renamed as *foo2.log*. *foo.log* is renamed as *foo1.log*. A new *foo.log* file is created and becomes the active output target. |
| 4                   | foo.log              | foo1.log, foo2.log, foo3.log | In this and subsequent rounds, the rollover begins by deleting *foo3.log*. Other files are renamed by incrementing their index as shown in previous steps. In this and subsequent rollovers, there will be three archive logs and one active log file. |

The configuration file below gives an example of configuring `RollingFileAppender` and `FixedWindowRollingPolicy`. Note that the File option is mandatory even if it contains some of the same information as conveyed with the fileNamePattern option.

下面的配置文件给出了配置 `RollingFileAppender` 和 `FixedWindowRollingPolicy` 的示例。注意，即使 File 选项与 fileNamePattern 选项传达的信息有部分重复，File 选项也是必需的。

Example: Sample configuration of a `RollingFileAppender` using a `FixedWindowRollingPolicy` (logback-examples/src/main/resources/chapters/appenders/conf/logback-RollingFixedWindow.xml)

示例：使用 `FixedWindowRollingPolicy` 的 `RollingFileAppender` 配置

View as .groovy

```
<configuration>
  <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>test.log</file>

    <rollingPolicy class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy">
      <fileNamePattern>tests.%i.log.zip</fileNamePattern>
      <minIndex>1</minIndex>
      <maxIndex>3</maxIndex>
    </rollingPolicy>

    <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
      <maxFileSize>5MB</maxFileSize>
    </triggeringPolicy>
    <encoder>
      <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
    </encoder>
  </appender>
        
  <root level="DEBUG">
    <appender-ref ref="FILE" />
  </root>
</configuration>
```

## [Overview of triggering policies](http://logback.qos.ch/manual/appenders.html#TriggeringPolicy)

## 触发策略概览

[`TriggeringPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/TriggeringPolicy.html) implementations are responsible for instructing the `RollingFileAppender` when to rollover.

[`TriggeringPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/TriggeringPolicy.html) 的实现类负责告知 `RollingFileAppender` 何时进行滚动。

The `TriggeringPolicy` interface contains only one method.

`TriggeringPolicy` 接口只有一个方法。

```
package ch.qos.logback.core.rolling;

import java.io.File;
import ch.qos.logback.core.spi.LifeCycle;

public interface TriggeringPolicy<E> extends LifeCycle {

  public boolean isTriggeringEvent(final File activeFile, final <E> event);
}
```

The `isTriggeringEvent()` method takes as parameters the active file and the logging event currently being processed. The concrete implementation determines whether the rollover should occur or not, based on these parameters.

`isTriggeringEvent()` 方法接收活动文件和当前正在处理的日志事件作为参数，具体实现根据这些参数判断是否应该触发滚动。

The most widely-used triggering policy, namely `TimeBasedRollingPolicy` which also doubles as a rolling policy, was already [discussed earlier](http://logback.qos.ch/manual/appenders.html#TimeBasedRollingPolicy) along with other rolling policies.

使用最广泛的触发策略是 `TimeBasedRollingPolicy`，它同时身兼滚动策略，已经[在前文](http://logback.qos.ch/manual/appenders.html#TimeBasedRollingPolicy)与其他滚动策略一起讨论过了。

#### [SizeBasedTriggeringPolicy](http://logback.qos.ch/manual/appenders.html#SizeBasedTriggeringPolicy)

#### [SizeBasedTriggeringPolicy](http://logback.qos.ch/manual/appenders.html#SizeBasedTriggeringPolicy)

[`SizeBasedTriggeringPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/SizeBasedTriggeringPolicy.html) looks at the size of the currently active file. If it grows larger than the specified size, it will signal the owning `RollingFileAppender` to trigger the rollover of the existing active file.

[`SizeBasedTriggeringPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/SizeBasedTriggeringPolicy.html) 关注当前活动文件的大小。如果文件超过指定的大小，它就会通知所属的 `RollingFileAppender` 对现有活动文件进行滚动。

`SizeBasedTriggeringPolicy` accepts only one parameter, namely maxFileSize, with a default value of 10 MB.

`SizeBasedTriggeringPolicy` 只接受一个参数 maxFileSize，默认值为 10 MB。

The maxFileSize option can be specified in bytes, kilobytes, megabytes or gigabytes by suffixing a numeric value with *KB*, *MB* and respectively *GB*. For example, *5000000*, *5000KB*, *5MB* and *2GB* are all valid values, with the first three being equivalent.

maxFileSize 选项可以在数字后面加上 *KB*、*MB* 或 *GB* 后缀，分别表示千字节、兆字节或吉字节。例如 *5000000*、*5000KB*、*5MB* 和 *2GB* 都是合法的取值，其中前三个等价。

Here is a sample configuration with a `RollingFileAppender` in conjunction with `SizeBasedTriggeringPolicy` triggering rollover when the log file reaches 5MB in size.

下面是 `RollingFileAppender` 配合 `SizeBasedTriggeringPolicy` 的示例配置，当日志文件达到 5MB 时触发滚动。

Example: Sample configuration of a `RollingFileAppender` using a `SizeBasedTriggeringPolicy` (logback-examples/src/main/resources/chapters/appenders/conf/logback-RollingSizeBased.xml)

示例：使用 `SizeBasedTriggeringPolicy` 的 `RollingFileAppender` 配置

View as .groovy

```
<configuration>
  <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>test.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy">
      <fileNamePattern>test.%i.log.zip</fileNamePattern>
      <minIndex>1</minIndex>
      <maxIndex>3</maxIndex>
    </rollingPolicy>

    <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
      <maxFileSize>5MB</maxFileSize>
    </triggeringPolicy>
    <encoder>
      <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
    </encoder>
  </appender>
        
  <root level="DEBUG">
    <appender-ref ref="FILE" />
  </root>
</configuration>
```



While logging events are generic in logback-core, within logback-classic they are always instances of `ILoggingEvent`. Logback-classic is nothing more than a specialized processing pipeline handling instances of `ILoggingEvent`.

在 logback-core 中日志事件是通用的，而在 logback-classic 中它们始终是 `ILoggingEvent` 的实例。logback-classic 本质上就是一个专门处理 `ILoggingEvent` 实例的处理管道。

### SocketAppender and SSLSocketAppender

### SocketAppender 和 SSLSocketAppender

The appenders covered thus far are only able to log to local resources. In contrast, the [`SocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SocketAppender.html) is designed to log to a remote entity by transmitting serialized `ILoggingEvent` instances over the wire. When using `SocketAppender` logging events on the wire are sent in the clear. However, when using [`SSLSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SSLSocketAppender.html), logging events are delivered over a secure channel.

到目前为止介绍的 appender 都只能向本地资源写日志。与之不同，[`SocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SocketAppender.html) 的设计目标是把序列化后的 `ILoggingEvent` 实例通过网络传输，写到远端实体。使用 `SocketAppender` 时，网络上的日志事件是明文传输的；而使用 [`SSLSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SSLSocketAppender.html) 时，日志事件则通过安全通道传输。

The actual type of the serialized event is [`LoggingEventVO`](http://logback.qos.ch/xref/ch/qos/logback/classic/spi/LoggingEventVO.html) which implements the `ILoggingEvent` interface. Nevertheless, remote logging is non-intrusive as far as the logging event is concerned. On the receiving end after deserialization, the event can be logged as if it were generated locally. Multiple `SocketAppender` instances running on different machines can direct their logging output to a central log server whose format is fixed. `SocketAppender` does not take an associated layout because it sends serialized events to a remote server. `SocketAppender` operates above the *Transmission Control Protocol (TCP)* layer which provides a reliable, sequenced, flow-controlled end-to-end octet stream. Consequently, if the remote server is reachable, then log events will eventually arrive there. Otherwise, if the remote server is down or unreachable, the logging events will simply be dropped. If and when the server comes back up, then event transmission will be resumed transparently. This transparent reconnection is performed by a connector thread which periodically attempts to connect to the server.

序列化事件的实际类型是 [`LoggingEventVO`](http://logback.qos.ch/xref/ch/qos/logback/classic/spi/LoggingEventVO.html)，它实现了 `ILoggingEvent` 接口。就日志事件本身而言，远程日志是非侵入式的：在接收端反序列化之后，事件可以像本地生成的一样被记录。运行在不同机器上的多个 `SocketAppender` 实例可以把日志输出定向到一个格式固定的中央日志服务器。`SocketAppender` 没有关联的 layout，因为它发送的是序列化后的事件。`SocketAppender` 工作在*传输控制协议（TCP）*层之上，TCP 提供可靠的、有序的、流量受控的端到端字节流。因此，只要远程服务器可达，日志事件最终就会到达那里；反之，如果远程服务器宕机或不可达，日志事件就会被直接丢弃。一旦服务器恢复，事件传输会透明地重新开始。这种透明的重连是由一个连接线程完成的，它会周期性地尝试连接服务器。

Logging events are automatically buffered by the native TCP implementation. This means that if the link to server is slow but still faster than the rate of event production by the client, the client will not be affected by the slow network connection. However, if the network connection is slower than the rate of event production, then the client can only progress at the network rate. In particular, in the extreme case where the network link to the server is down, the client will be eventually blocked. Alternatively, if the network link is up, but the server is down, the client will not be blocked, although the log events will be lost due to server unavailability.

日志事件会被本地 TCP 实现自动缓冲。这意味着，如果到服务器的链路虽然慢但仍快于客户端产生事件的速率，客户端就不会受到慢速网络连接的影响。但如果网络连接比事件产生速率还慢，客户端就只能以网络的速度前进。特别是，在到服务器的网络链路中断这种极端情况下，客户端最终会被阻塞。另一种情况是，如果网络链路正常但服务器宕机，客户端不会被阻塞，但日志事件会因为服务器不可用而丢失。

Even if a `SocketAppender` is no longer attached to any logger, it will not be garbage collected in the presence of a connector thread. A connector thread exists only if the connection to the server is down. To avoid this garbage collection problem, you should close the `SocketAppender` explicitly. Long lived applications which create/destroy many `SocketAppender` instances should be aware of this garbage collection problem. Most other applications can safely ignore it. If the JVM hosting the `SocketAppender` exits before the `SocketAppender` is closed, either explicitly or subsequent to garbage collection, then there might be untransmitted data in the pipe which may be lost. This is a common problem on Windows based systems. To avoid lost data, it is usually sufficient to `close()` the `SocketAppender` either explicitly or by calling the `LoggerContext`'s `stop()` method before exiting the application.

即使 `SocketAppender` 已经不再挂接到任何 logger，只要连接线程还存在，它就不会被垃圾回收。连接线程只有在到服务器的连接断开时才会存在。为了避免这个垃圾回收问题，应该显式关闭 `SocketAppender`。需要长期运行、并且会频繁创建/销毁 `SocketAppender` 实例的应用要注意这个垃圾回收问题，其他大多数应用可以放心地忽略它。如果宿主 JVM 在 `SocketAppender` 被关闭（无论是显式关闭还是垃圾回收之后）之前就退出了，管道中可能还有未传输的数据并因此丢失。这在基于 Windows 的系统上是个常见问题。为了避免数据丢失，通常只需在应用退出前显式调用 `SocketAppender` 的 `close()`，或者调用 `LoggerContext` 的 `stop()` 方法即可。

The remote server is identified by the remoteHost and port properties. `SocketAppender` properties are listed in the following table. `SSLSocketAppender` supports many additional configuration properties, which are detailed in the section entitled [Using SSL](http://logback.qos.ch/manual/usingSSL.html).

远程服务器由 remoteHost 和 port 属性指定。`SocketAppender` 的属性见下表。`SSLSocketAppender` 还支持许多额外的配置属性，详见 [Using SSL](http://logback.qos.ch/manual/usingSSL.html) 一节。

| Property Name         | Type               | Description                                                  |
| --------------------- | ------------------ | ------------------------------------------------------------ |
| **includeCallerData** | `boolean`          | The includeCallerData option takes a boolean value. If true, the caller data will be available to the remote host. By default no caller data is sent to the server. |
| **port**              | `int`              | The port number of the remote server.                        |
| **reconnectionDelay** | `Duration`         | The reconnectionDelay option takes a duration string, such "10 seconds" representing the time to wait between each failed connection attempt to the server. The default value of this option is 30 seconds. Setting this option to zero turns off reconnection capability. Note that in case of successful connection to the server, there will be no connector thread present. |
| **queueSize**         | `int`              | The queueSize property takes an integer (greater than zero) representing the number of logging events to retain for delivery to the remote receiver. When the queue size is one, event delivery to the remote receiver is synchronous. When the queue size is greater than one, new events are enqueued, assuming that there is space available in the queue. Using a queue length greater than one can improve performance by eliminating delays caused by transient network delays.See also the eventDelayLimit property. |
| **eventDelayLimit**   | `Duration`         | The eventDelayLimit option takes a duration string, such "10 seconds". It represents the time to wait before dropping events in case the local queue is full, i.e. already contains queueSize events. This may occur if the remote host is persistently slow accepting events. The default value of this option is 100 milliseconds. |
| **remoteHost**        | `String`           | The host name of the server.                                 |
| **ssl**               | `SSLConfiguration` | Supported only for `SSLSocketAppender`, this property provides the SSL configuration that will be used by the appender, as described in [Using SSL](http://logback.qos.ch/manual/usingSSL.html). |

#### Logging Server Options

#### 日志服务器选项

The standard Logback Classic distribution includes two options for servers that can be used to receive logging events from `SocketAppender` or `SSLSocketAppender`.

标准的 Logback Classic 发行版提供了两种服务器方案，可以用来接收来自 `SocketAppender` 或 `SSLSocketAppender` 的日志事件。

- `ServerSocketReceiver` and its SSL-enabled counterpart `SSLServerSocketReceiver` are receiver components which can be configured in the *logback.xml* configuration file of an application in order receive events from a remote socket appender. See [Receivers](http://logback.qos.ch/manual/receivers.html) for configuration details and usage examples.
- `SimpleSocketServer` and its SSL-enabled counterpart `SimpleSSLSocketServer` both offer an easy-to-use standalone Java application that is designed to be configured and run from your shell's command line interface. These applications simply wait for logging events from `SocketAppender` or `SSLSocketAppender` clients. Each received event is logged according to local server policy. Usage examples are given below.

- `ServerSocketReceiver` 及其支持 SSL 的对应版本 `SSLServerSocketReceiver` 是 receiver 组件，可以在应用的 *logback.xml* 配置文件中配置，用来接收远程 socket appender 发来的事件。配置细节和用法示例参见 [Receivers](http://logback.qos.ch/manual/receivers.html)。
- `SimpleSocketServer` 及其支持 SSL 的对应版本 `SimpleSSLSocketServer` 都是易用的独立 Java 应用，设计为在 shell 命令行界面中配置并运行。这些应用只是等待来自 `SocketAppender` 或 `SSLSocketAppender` 客户端的日志事件，每个收到的事件都按照本地服务器的策略被记录。用法示例如下。

#### Using SimpleSocketServer

#### 使用 SimpleSocketServer

The `SimpleSocketServer` application takes two command-line arguments: *port* and *configFile*; where *port* is the port to listen on and *configFile* is a configuration script in XML format.

`SimpleSocketServer` 应用接受两个命令行参数：*port* 和 *configFile*。其中 *port* 是监听的端口，*configFile* 是 XML 格式的配置脚本。

Assuming you are in the *logback-examples/* directory, start `SimpleSocketServer` with the following command:

假设你位于 *logback-examples/* 目录，用下面的命令启动 `SimpleSocketServer`：

java ch.qos.logback.classic.net.SimpleSocketServer 6000 \  src/main/java/chapters/appenders/socket/server1.xml

where 6000 is the port number to listen on and *server1.xml* is a configuration script that adds a `ConsoleAppender` and a `RollingFileAppender` to the root logger. After you have started `SimpleSocketServer`, you can send it log events from multiple clients using `SocketAppender`. The examples associated with this manual include two such clients: `chapters.appenders.SocketClient1` and `chapters.appenders.SocketClient2` Both clients wait for the user to type a line of text on the console. The text is encapsulated in a logging event of level debug and then sent to the remote server. The two clients differ in the configuration of the `SocketAppender`. `SocketClient1` configures the appender programmatically while `SocketClient2` requires a configuration file.

其中 6000 是监听的端口号，*server1.xml* 是一个配置脚本，它向 root logger 添加了一个 `ConsoleAppender` 和一个 `RollingFileAppender`。启动 `SimpleSocketServer` 之后，可以让多个客户端通过 `SocketAppender` 向它发送日志事件。与本手册配套的示例中有两个这样的客户端：`chapters.appenders.SocketClient1` 和 `chapters.appenders.SocketClient2`。两个客户端都会等待用户在控制台输入一行文本，这段文本会被封装成 debug 级别的日志事件，然后发送到远程服务器。两个客户端的区别在于 `SocketAppender` 的配置方式：`SocketClient1` 以编程方式配置 appender，而 `SocketClient2` 需要一个配置文件。

Assuming `SimpleSocketServer` is running on the local host, you connect to it with the following command:

假设 `SimpleSocketServer` 运行在本地主机上，可以用下面的命令连接它：

java chapters.appenders.socket.SocketClient1 localhost 6000

Each line that you type should appear on the console of the `SimpleSocketServer` launched in the previous step. If you stop and restart the `SimpleSocketServer` the client will transparently reconnect to the new server instance, although the events generated while disconnected will be simply (and irrevocably) lost.

你输入的每一行都应该出现在上一步启动的 `SimpleSocketServer` 的控制台上。如果停止并重启 `SimpleSocketServer`，客户端会透明地重连到新的服务器实例，不过断开期间产生的事件会直接（且不可挽回地）丢失。

Unlike `SocketClient1`, the sample application `SocketClient2` does not configure logback by itself. It requires a configuration file in XML format. The configuration file *client1.xml* shown below creates a `SocketAppender` and attaches it to the root logger.

与 `SocketClient1` 不同，示例应用 `SocketClient2` 不自己配置 logback，而是需要一个 XML 格式的配置文件。下面所示的配置文件 *client1.xml* 创建了一个 `SocketAppender` 并把它挂载到 root logger 上。

Example: SocketAppender configuration (logback-examples/src/main/resources/chapters/appenders/socket/client1.xml)

示例：SocketAppender 配置

View as .groovy

```
<configuration>
          
  <appender name="SOCKET" class="ch.qos.logback.classic.net.SocketAppender">
    <remoteHost>${host}</remoteHost>
    <port>${port}</port>
    <reconnectionDelay>10000</reconnectionDelay>
    <includeCallerData>${includeCallerData}</includeCallerData>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="SOCKET" />
  </root>  

</configuration>
```

Note that in the above configuration scripts the values for the remoteHost, port and includeCallerData properties are not given directly but as substituted variable keys. The values for the variables can be specified as system properties:

注意，在上面的配置脚本中，remoteHost、port 和 includeCallerData 属性的值不是直接给出的，而是以变量替换键的形式给出的。变量的值可以通过系统属性来指定：

java -Dhost=localhost -Dport=6000 -DincludeCallerData=false \  chapters.appenders.socket.SocketClient2 src/main/java/chapters/appenders/socket/client1.xml

This command should give similar results to the previous `SocketClient1` example.

这条命令应该会得到与前面 `SocketClient1` 示例类似的结果。

Allow us to repeat for emphasis that serialization of logging events is not intrusive. A deserialized event carries the same information as any other logging event. It can be manipulated as if it were generated locally; except that serialized logging events by default do not include caller data. Here is an example to illustrate the point. First, start `SimpleSocketServer` with the following command:

这里再强调一次：日志事件的序列化是非侵入式的。反序列化后的事件与其他日志事件携带的信息完全相同，可以像本地生成的事件一样处理；唯一区别是序列化的日志事件默认不包含 caller 数据。下面通过一个例子来说明。首先用下面的命令启动 `SimpleSocketServer`：

 java ch.qos.logback.classic.net.SimpleSocketServer 6000 \  src/main/java/chapters/appenders/socket/server2.xml

The configuration file *server2.xml* creates a `ConsoleAppender` whose layout outputs the caller's file name and line number along with other information. If you run `SocketClient2` with the configuration file *client1.xml* as previously, you will notice that the output on the server side will contain two question marks between parentheses instead of the file name and the line number of the caller:

配置文件 *server2.xml* 创建了一个 `ConsoleAppender`，其 layout 会输出调用者的文件名和行号等信息。像前面那样使用配置文件 *client1.xml* 运行 `SocketClient2`，你会注意到服务器端的输出中出现了两个括号中的问号，而不是调用者的文件名和行号：

2006-11-06 17:37:30,968 DEBUG [Thread-0] [?:?] chapters.appenders.socket.SocketClient2 - Hi

The outcome can be easily changed by instructing the `SocketAppender` to include caller data by setting the includeCallerData option to true. Using the following command will do the trick:

只要把 includeCallerData 选项设置为 true，让 `SocketAppender` 携带 caller 数据，结果就会随之改变。使用下面的命令即可：

```
java -Dhost=localhost -Dport=6000 -DincludeCallerData=true \
  chapters.appenders.socket.SocketClient2 src/main/java/chapters/appenders/socket/client1.xml
```

As deserialized events can be handled in the same way as locally generated events, they even can be sent to a second server for further treatment. As an exercise, you may wish to setup two servers where the first server tunnels the events it receives from its clients to a second server.

由于反序列化后的事件可以像本地生成的事件一样处理，甚至可以把它们发送到第二个服务器做进一步处理。作为练习，你可以搭建两个服务器，让第一个服务器把它从客户端收到的事件转发给第二个服务器。

#### Using SimpleSSLSocketServer

#### 使用 SimpleSSLSocketServer

The `SimpleSSLSocketServer` requires the same *port* and *configFile* command-line arguments used by `SimpleSocketServer`. Additionally, you must provide the location and password for your logging server's X.509 credential using system properties specified on the command line.

`SimpleSSLSocketServer` 需要的 *port* 和 *configFile* 命令行参数与 `SimpleSocketServer` 相同。此外，还必须通过命令行上的系统属性提供日志服务器的 X.509 凭证的位置和密码。

Assuming you are in the *logback-examples/* directory, start `SimpleSSLSocketServer` with the following command:

假设你位于 *logback-examples/* 目录，用下面的命令启动 `SimpleSSLSocketServer`：

java -Djavax.net.ssl.keyStore=src/main/java/chapters/appenders/socket/ssl/keystore.jks \    -Djavax.net.ssl.keyStorePassword=changeit \    ch.qos.logback.classic.net.SimpleSSLSocketServer 6000 \    src/main/java/chapters/appenders/socket/ssl/server.xml    

This example runs `SimpleSSLSocketServer` using an X.509 credential that is suitable for testing and experimentation, only. **Before using `SimpleSSLSocketServer` in a production setting you should obtain an appropriate X.509 credential to identify your logging server**. See [Using SSL](http://logback.qos.ch/manual/usingSSL.html) for more details.

这个例子使用的 X.509 凭证仅适合测试和实验。**在生产环境中使用 `SimpleSSLSocketServer` 之前，应当获取合适的 X.509 凭证来标识你的日志服务器**。更多细节参见 [Using SSL](http://logback.qos.ch/manual/usingSSL.html)。

Because the server configuration has `debug="true"` specified on the root element, you'll will see in the server's startup logging the SSL configuration that will be used. This is useful in validating that local security policies are properly implemented.

由于服务器配置的根元素上指定了 `debug="true"`，服务器的启动日志中会显示将要使用的 SSL 配置。这有助于验证本地安全策略是否被正确落实。

With `SimpleSSLSocketServer` running, you can connect to the server using an `SSLSocketAppender`. The following example shows the appender configuration needed:

`SimpleSSLSocketServer` 启动之后，就可以用 `SSLSocketAppender` 连接服务器了。下面的例子展示了所需的 appender 配置：

Example: SSLSocketAppender configuration (logback-examples/src/main/resources/chapters/appenders/socket/ssl/client.xml)

示例：SSLSocketAppender 配置

View as .groovy

```
<configuration debug="true">
          
  <appender name="SOCKET" class="ch.qos.logback.classic.net.SSLSocketAppender">
    <remoteHost>${host}</remoteHost>
    <port>${port}</port>
    <reconnectionDelay>10000</reconnectionDelay>
    <ssl>
      <trustStore>
        <location>${truststore}</location>
        <password>${password}</password>
      </trustStore>
    </ssl>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="SOCKET" />
  </root>  

</configuration>
```

Note that, just as in the previous example, the values for remoteHost, port are specified using substituted variable keys. Additionally, note the presence of the ssl property and its nested trustStore property, which specifies the location and password of a trust store using substituted variables. This configuration is necessary because our example server is using a self-signed certificate. See [Using SSL](http://logback.qos.ch/manual/usingSSL.html) for more information on SSL configuration properties for `SSLSocketAppender`.

注意，与前面的例子一样，remoteHost 和 port 的值也是通过变量替换键指定的。另外还要注意 ssl 属性及其嵌套的 trustStore 属性，后者通过变量替换指定了信任库（trust store）的位置和密码。之所以需要这样的配置，是因为我们的示例服务器使用的是自签名证书。`SSLSocketAppender` 的 SSL 配置属性详见 [Using SSL](http://logback.qos.ch/manual/usingSSL.html)。

We can run a client application using this configuration by specifying the substitution variable values on the command line as system properties:

在命令行上把变量替换所需的值作为系统属性传入，就可以用这份配置运行客户端应用了：

java -Dhost=localhost -Dport=6000 \    -Dtruststore=file:src/main/java/chapters/appenders/socket/ssl/truststore.jks \    -Dpassword=changeit \    chapters.appenders.socket.SocketClient2 src/main/java/chapters/appenders/socket/ssl/client.xml 	  

As in the previous examples, you can type in a message when prompted by the client application, and the message will be delivered to the logging server (now over a secure channel) where it will be displayed on the console.

与前面的示例一样，在客户端应用提示时输入一条消息，消息就会被传送到日志服务器（这次是通过安全通道），并显示在服务器的控制台上。

Note that the *truststore* property given on the command line specifies a file URL that identifies the location of the trust store. You may also use a classpath URL as described in [Using SSL](http://logback.qos.ch/manual/usingSSL.html).

注意，命令行上给出的 *truststore* 属性是一个标识信任库位置的 file URL。也可以使用 classpath URL，参见 [Using SSL](http://logback.qos.ch/manual/usingSSL.html) 中的说明。

As we saw previously at server startup, because the client configuration has `debug="true"` specified on the root element, the client's startup logging includes the details of the SSL configuration as aid to auditing local policy conformance.

正如前面服务器启动时看到的，由于客户端配置的根元素上也指定了 `debug="true"`，客户端的启动日志会包含 SSL 配置的细节，便于审计本地策略的执行情况。

### ServerSocketAppender and SSLServerSocketAppender

### ServerSocketAppender 和 SSLServerSocketAppender

The `SocketAppender` component (and its SSL-enabled counterpart) discussed previously are designed to allow an application to connect to a remote logging server over the network for the purpose of delivering logging events to the server. In some situations, it may be inconvenient or infeasible to have an application initiate a connection to a remote logging server. For these situations, Logback offers [`ServerSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/server/ServerSocketAppender).

前面讨论的 `SocketAppender` 组件（及其支持 SSL 的对应版本）的设计意图，是让应用通过网络连接到远程日志服务器，把日志事件发送给服务器。但在某些情况下，由应用主动发起连接到远程日志服务器可能并不方便，甚至不可行。针对这些场景，Logback 提供了 [`ServerSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/server/ServerSocketAppender)。

Instead of initiating a connection to a remote logging server, `ServerSocketAppender` passively listens on a TCP socket awaiting incoming connections from remote clients. Logging events that are delivered to the appender are distributed to each connected client. Logging events that occur when no client is connected are *summarily discarded*.

`ServerSocketAppender` 不主动连接远程日志服务器，而是被动地在一个 TCP socket 上监听，等待远程客户端的连接。送达 appender 的日志事件会被分发给每个已连接的客户端；而在没有任何客户端连接时产生的日志事件会被*直接丢弃*。

In addition to the basic `ServerSocketAppender`, Logback offers [`SSLServerSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/server/SSLServerSocketAppender), which distributes logging events to each connected client using a secure, encrypted channel. Moreover, the SSL-enabled appender fully supports mutual certificate-based authentication, which can be used to ensure that only authorized clients can connect to the appender to receive logging events.

除了基本的 `ServerSocketAppender` 之外，Logback 还提供了 [`SSLServerSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/server/SSLServerSocketAppender)，它通过安全的加密通道把日志事件分发给每个已连接的客户端。此外，这个支持 SSL 的 appender 完整支持基于证书的双向认证，可用来确保只有经过授权的客户端才能连接到 appender 接收日志事件。

The approach to encoding logging events for transmission on the wire is identical to that used by `SocketAppender`; each event is a serialized instance of `ILoggingEvent`. Only the direction of connection initiation is reversed. While `SocketAppender` acts as the active peer in establishing the connection to a logging server, `ServerSocketAppender` is passive; it listens for incoming connections from clients.

日志事件在线路上传输的编码方式与 `SocketAppender` 完全相同：每个事件都是一个序列化后的 `ILoggingEvent` 实例。唯一的区别是发起连接的方向相反：`SocketAppender` 在建立到日志服务器的连接时充当主动方，而 `ServerSocketAppender` 是被动的，它监听来自客户端的连接。

The `ServerSocketAppender` subtypes are intended to be used exclusively with Logback *receiver* components. See [Receivers](http://logback.qos.ch/manual/receivers.html) for additional information on this component type.

`ServerSocketAppender` 的各个子类型专用于配合 Logback 的 *receiver* 组件使用。关于这种组件类型的更多信息参见 [Receivers](http://logback.qos.ch/manual/receivers.html)。

The following configuration properties are supported by `ServerSocketAppender`:

`ServerSocketAppender` 支持以下配置属性：

| Property Name         | Type               | Description                                                  |
| --------------------- | ------------------ | ------------------------------------------------------------ |
| **address**           | `String`           | The local network interface address on which the appender will listen. If this property is not specified, the appender will listen on all network interfaces. |
| **includeCallerData** | `boolean`          | If true, the caller data will be available to the remote host. By default no caller data is sent to the client. |
| **port**              | `int`              | The port number on which the appender will listen.           |
| **ssl**               | `SSLConfiguration` | Supported only for `SSLServerSocketAppender`, this property provides the SSL configuration that will be used by the appender, as described in [Using SSL](http://logback.qos.ch/manual/usingSSL.html). |

The following example illustrates a configuration that uses `ServerSocketAppender`:

下面的示例展示了使用 `ServerSocketAppender` 的配置：

Example: Basic ServerSocketAppender Configuration (logback-examples/src/main/resources/chapters/appenders/socket/server4.xml)

示例：基本的 ServerSocketAppender 配置

```
<configuration debug="true">
  <appender name="SERVER" 
    class="ch.qos.logback.classic.net.server.ServerSocketAppender">
    <port>${port}</port>
    <includeCallerData>${includeCallerData}</includeCallerData>
  </appender>

  <root level="debug">
    <appender-ref ref="SERVER" />
  </root>  

</configuration>
```

Note that this configuration differs from previous examples using `SocketAppender` only in the *class* specified for the appender, and in the absence of the remoteHost property — this appender waits passively for inbound connections from remote hosts rather than opening a connection to a remote logging server.

注意，这份配置与前面使用 `SocketAppender` 的示例相比，只有 appender 指定的 *class* 不同，并且缺少 remoteHost 属性——这个 appender 被动地等待来自远程主机的入站连接，而不是主动打开到远程日志服务器的连接。

The following example illustrates a configuration using `SSLServerSocketAppender`.

下面的示例展示了使用 `SSLServerSocketAppender` 的配置。

Example: Basic SSLServerSocketAppender Configuration (logback-examples/src/main/resources/chapters/appenders/socket/ssl/server3.xml)

示例：基本的 SSLServerSocketAppender 配置

```
<configuration debug="true">
  <appender name="SERVER" 
    class="ch.qos.logback.classic.net.server.SSLServerSocketAppender">
    <port>${port}</port>
    <includeCallerData>${includeCallerData}</includeCallerData>
    <ssl>
      <keyStore>
        <location>${keystore}</location>
        <password>${password}</password>
      </keyStore>
    </ssl>
  </appender>

  <root level="debug">
    <appender-ref ref="SERVER" />
  </root>  

</configuration>
```

The principal differences between this configuration and the previous configuration is that the appender's *class* attribute identifies the `SSLServerSocketAppender` type, and the presence of the nested ssl element which specifies, in this example, configuration of a key store containing an X.509 credential for the appender. See [Using SSL](http://logback.qos.ch/manual/usingSSL.html) for information regarding SSL configuration properties.

这份配置与上一份配置的主要区别在于：appender 的 *class* 属性指定的是 `SSLServerSocketAppender` 类型；另外多了一个嵌套的 ssl 元素，在本例中它配置了一个密钥库（key store），其中包含 appender 的 X.509 凭证。SSL 配置属性的相关信息参见 [Using SSL](http://logback.qos.ch/manual/usingSSL.html)。

Because the `ServerSocketAppender` subtypes are designed to be used with receiver components, we will defer presenting illustrative examples to the chapter entitled [Receivers](http://logback.qos.ch/manual/receivers.html).

由于 `ServerSocketAppender` 的各个子类型都是设计为与 receiver 组件配合使用的，具体的示例将留到 [Receivers](http://logback.qos.ch/manual/receivers.html) 一章再介绍。

### SMTPAppender

### SMTPAppender

The [`SMTPAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SMTPAppender.html) accumulates logging events in one or more fixed-size buffers and sends the contents of the appropriate buffer in an email after a user-specified event occurs. SMTP email transmission (sending) is performed asynchronously. By default, the email transmission is triggered by a logging event of level ERROR. Moreover, by default, a single buffer is used for all events.

[`SMTPAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SMTPAppender.html) 把日志事件累积在一个或多个固定大小的缓冲区里，当用户指定的事件发生时，就把相应缓冲区的内容作为邮件发出。SMTP 邮件发送是异步进行的。默认情况下，ERROR 级别的日志事件会触发邮件发送，并且所有事件共用一个缓冲区。

The various properties for `SMTPAppender` are summarized in the following table.

`SMTPAppender` 的各项属性汇总在下表中。

| Property Name           | Type                                                         | Description                                                  |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **smtpHost**            | `String`                                                     | The host name of the SMTP server. This parameter is mandatory. |
| **smtpPort**            | `int`                                                        | The port where the SMTP server is listening. Defaults to 25. |
| **to**                  | `String`                                                     | The email address of the recipient as a *pattern*. The pattern is evaluated anew with the triggering event as input for each outgoing email. Multiple recipients can be specified by separating the destination addresses with commas. Alternatively, multiple recipients can also be specified by using multiple `` elements. |
| **from**                | `String`                                                     | The originator of the email messages sent by `SMTPAppender` in the [usual email address format](http://en.wikipedia.org/wiki/Email_address). If you wish to include the sender's name, then use the format "Adam Smith &lt;smith@moral.org&gt;" so that the message appears as originating from "Adam Smith <smith@moral.org>". |
| **subject**             | `String`                                                     | The subject of the email. It can be any value accepted as a valid conversion pattern by [PatternLayout](http://logback.qos.ch/manual/layouts.html#ClassicPatternLayout). Layouts will be discussed in the next chapter.The outgoing email message will have a subject line corresponding to applying the pattern on the logging event that triggered the email message.Assuming the subject option is set to "Log: %logger - %msg" and the triggering event's logger is named "com.foo.Bar", and contains the message "Hello world", then the outgoing email will have the subject line "Log: com.foo.Bar - Hello World".By default, this option is set to "%logger{20} - %m". |
| **discriminator**       | `Discriminator`                                              | With the help of a Discriminator, `SMTPAppender` can scatter incoming events into different buffers according to the value returned by the discriminator. The default discriminator always returns the same value so that the same buffer is used for all events.By specifying a discriminator other than the default one, it is possible to receive email messages containing a events pertaining to a particular user, user session or client IP address. |
| **evaluator**           | `IEvaluator`                                                 | This option is declared by creating a new `` element. The name of the class that the user wishes to use as the `SMTPAppender`'s `Evaluator` needs to be specified via the *class* attribute.In the absence of this option, `SMTPAppender` is assigned an instance of [OnErrorEvaluator](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/OnErrorEvaluator.html) which triggers email transmission when it encounters an event of level *ERROR* or higher.Logback ships with several other evaluators, namely [`OnMarkerEvaluator`](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/OnMarkerEvaluator.html) (discussed below) and a powerful evaluator called [`JaninoEventEvaluator`](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/JaninoEventEvaluator.html), discussed in [another chapter](http://logback.qos.ch/manual/filters.html#evalutatorFilter). The more recent versions of logback ship with an even more powerful evaluator called [`GEventEvaluator`](http://logback.qos.ch/manual/filters.html#GEventEvaluator). |
| **cyclicBufferTracker** | [`CyclicBufferTracker`](http://logback.qos.ch/xref/ch/qos/logback/core/spi/CyclicBufferTracker.html) | As the name indicates, an instance of the `CyclicBufferTracker` class tracks cyclic buffers. It does so based on the keys returned by the discriminator (see above).If you don't specify a cyclicBufferTracker, an instance of [CyclicBufferTracker](http://logback.qos.ch/xref/ch/qos/logback/core/spi/CyclicBufferTracker.html) will be automatically created. By default, this instance will keep events in a cyclic buffer of size 256. You may change the size with the help of the bufferSize option (see below). |
| **username**            | `String`                                                     | The username value to use during plain user/password authentication. By default, this parameter is null. |
| **password**            | `String`                                                     | The password value to use for plain user/password authentication. By default, this parameter is null. |
| **STARTTLS**            | `boolean`                                                    | If this parameter is set to true, then this appender will issue the STARTTLS command (if the server supports it) causing the connection to switch to SSL. Note that the connection is initially non-encrypted. By default, this parameter is set to false. |
| **SSL**                 | `boolean`                                                    | If this parameter is set to true, then this appender will open an SSL connection to the server. By default, this parameter is set to false. |
| **charsetEncoding**     | `String`                                                     | The outgoing email message will be encoded in the designated [charset](https://docs.oracle.com/javase/8/docs/api/java/nio/charset/Charset.html). The default charset encoding is "UTF-8" which works well for most purposes. |
| **localhost**           | `String`                                                     | In case the hostname of the SMTP client is not properly configured, e.g. if the client hostname is not fully qualified, certain SMTP servers may reject the HELO/EHLO commands sent by the client. To overcome this issue, you may set the value of the localhost property to the fully qualified name of the client host. See also the "mail.smtp.localhost" property in the documentation for the [com.sun.mail.smtp](http://javamail.kenai.com/nonav/javadocs/com/sun/mail/smtp/package-summary.html) package. |
| **asynchronousSending** | `boolean`                                                    | This property determines whether email transmission is done asynchronously or not. By default, the asynchronousSending property is 'true'. However, under certain circumstances asynchronous sending may be inappropriate. For example if your application uses `SMTPAppender` to send alerts in response to a fatal error, and then exits, the relevant thread may not have the time to send the alert email. In this case, set asynchronousSending property to 'false' for synchronous email transmission. |
| **includeCallerData**   | `boolean`                                                    | By default, includeCallerData is set to `false`. You should set includeCallerData to `true` if asynchronousSending is enabled and you wish to include caller data in the logs. |
| **sessionViaJNDI**      | `boolean`                                                    | `SMTPAppender` relies on `javax.mail.Session` to send out email messages. By default, sessionViaJNDI is set to `false` so the `javax.mail.Session` instance is built by `SMTPAppender` itself with the properties specified by the user. If the sessionViaJNDI property is set to `true`, the `javax.mail.Session` object will be retrieved via JNDI. See also the jndiLocation property.Retrieving the `Session` via JNDI can reduce the number of places you need to configure/reconfigure the same information, making your application [dryer](http://en.wikipedia.org/wiki/Don't_repeat_yourself). For more information on configuring resources in Tomcat see [JNDI Resources How-to](http://tomcat.apache.org/tomcat-6.0-doc/jndi-resources-howto.html#JavaMail_Sessions). **BEWARE** As noted in that document, make sure to remove *mail.jar* and *activation.jar* from your web-applications *WEB-INF/lib* folder when retrieving the `Session` from JNDI. |
| **jndiLocation**        | `String`                                                     | The location where the javax.mail.Session is placed in JNDI. By default, jndiLocation is set to "java:comp/env/mail/Session". |

The `SMTPAppender` keeps only the last 256 logging events in its cyclic buffer, throwing away older events when its buffer becomes full. Thus, the number of logging events delivered in any e-mail sent by `SMTPAppender` is upper-bounded by 256. This keeps memory requirements bounded while still delivering a reasonable amount of application context.

`SMTPAppender` 的循环缓冲区只保留最近 256 条日志事件，缓冲区满了之后旧的事件会被丢弃。因此，`SMTPAppender` 发出的任何一封邮件所包含的日志事件数都以 256 为上限。这样既把内存需求控制在了有限范围内，又能提供足够的应用上下文信息。

The `SMTPAppender` relies on the JavaMail API. It has been tested with JavaMail API version 1.4. The JavaMail API requires the JavaBeans Activation Framework package. You can download the [JavaMail API](http://java.sun.com/products/javamail/) and the [JavaBeans Activation Framework](http://java.sun.com/beans/glasgow/jaf.html) from their respective websites. Make sure to place these two jar files in the classpath before trying the following examples.

`SMTPAppender` 依赖 JavaMail API，已在 JavaMail API 1.4 版本上测试过。JavaMail API 需要 JavaBeans Activation Framework 包。你可以从各自的网站下载 [JavaMail API](http://java.sun.com/products/javamail/) 和 [JavaBeans Activation Framework](http://java.sun.com/beans/glasgow/jaf.html)。在尝试下面的示例之前，请确保这两个 jar 文件已放入 classpath。

A sample application, [`chapters.appenders.mail.EMail`](http://logback.qos.ch/xref/chapters/appenders/mail/EMail.html) generates a number of log messages followed by a single error message. It takes two parameters. The first parameter is an integer corresponding to the number of logging events to generate. The second parameter is the logback configuration file. The last logging event generated by *EMail* application, an ERROR, will trigger the transmission of an email message.

示例应用 [`chapters.appenders.mail.EMail`](http://logback.qos.ch/xref/chapters/appenders/mail/EMail.html) 会生成若干条日志消息，最后生成一条错误消息。它接受两个参数：第一个参数是一个整数，表示要生成的日志事件数量；第二个参数是 logback 配置文件。*EMail* 应用生成的最后一条日志事件（一个 ERROR）会触发邮件的发送。

Here is a sample configuration file intended for the `Email` application:

下面是给 `Email` 应用使用的示例配置文件：

Example: A sample `SMTPAppender` configuration (logback-examples/src/main/resources/chapters/appenders/mail/mail1.xml)

示例：`SMTPAppender` 配置

View as .groovy

```
<configuration>   
  <appender name="EMAIL" class="ch.qos.logback.classic.net.SMTPAppender">
    <smtpHost>ADDRESS-OF-YOUR-SMTP-HOST</smtpHost>
    <to>EMAIL-DESTINATION</to>
    <to>ANOTHER_EMAIL_DESTINATION</to> <!-- additional destinations are possible -->
    <from>SENDER-EMAIL</from>
    <subject>TESTING: %logger{20} - %m</subject>
    <layout class="ch.qos.logback.classic.PatternLayout">
      <pattern>%date %-5level %logger{35} - %message%n</pattern>
    </layout>       
  </appender>

  <root level="DEBUG">
    <appender-ref ref="EMAIL" />
  </root>  
</configuration>
```

Before trying out `chapters.appenders.mail.Email` application with the above configuration file, you must set the smtpHost, to and from properties to values appropriate for your environment. Once you have set the correct values in the configuration file, execute the following command:

在使用上面的配置文件运行 `chapters.appenders.mail.Email` 应用之前，必须把 smtpHost、to 和 from 属性设置为你环境中的实际值。在配置文件中设置好正确的值之后，执行以下命令：

```
java chapters.appenders.mail.EMail 100 src/main/java/chapters/appenders/mail/mail1.xml
```

The recipient you specified should receive an email message containing 100 logging events formatted by `PatternLayout` The figure below is the resulting email message as shown by Mozilla Thunderbird.

你指定的收件人应该会收到一封包含 100 条日志事件的邮件，事件由 `PatternLayout` 格式化。下图是在 Mozilla Thunderbird 中看到的邮件效果。

![resulting email](http://logback.qos.ch/manual/images/chapters/appenders/smtpAppender1.jpg)

In the next example configuration file *mail2.xml*, the values for the smtpHost, to and from properties are determined by variable substitution. Here is the relevant part of *mail2.xml*.

在下一个示例配置文件 *mail2.xml* 中，smtpHost、to 和 from 属性的值通过变量替换确定。下面是 *mail2.xml* 的相关部分。

```
<appender name="EMAIL" class="ch.qos.logback.classic.net.SMTPAppender">
  <smtpHost>${smtpHost}</smtpHost>
  <to>${to}</to>
  <from>${from}</from>
  <layout class="ch.qos.logback.classic.html.HTMLLayout"/>
</appender>
```

You can pass the required parameters on the command line:

可以在命令行上传入所需的参数：

```
java -Dfrom=source@xyz.com -Dto=recipient@xyz.com -DsmtpHost=some_smtp_host \
  chapters.appenders.mail.EMail 10000 src/main/java/chapters/appenders/mail/mail2.xml
```

Be sure to replace with values as appropriate for your environment.

请务必把参数替换为你环境中的实际值。

Note that in this latest example, `PatternLayout` was replaced by `HTMLLayout` which formats logs as an HTML table. You can change the list and order of columns as well as the CSS of the table. Please refer to [HTMLLayout](http://logback.qos.ch/manual/layouts.html#ClassicHTMLLayout) documentation for further details.

注意，在刚才这个例子中，`PatternLayout` 被替换成了 `HTMLLayout`，后者把日志格式化为 HTML 表格。你可以修改列的列表与顺序，以及表格的 CSS。更多细节请参考 [HTMLLayout](http://logback.qos.ch/manual/layouts.html#ClassicHTMLLayout) 文档。

Given that the size of the cyclic buffer is 256, the recipient should see an email message containing 256 events conveniently formatted in an HTML table. Note that this run of the `chapters.appenders.mail.Email` application generated 10'000 events of which only the last 256 were included in the outgoing email.

由于循环缓冲区的大小是 256，收件人看到的邮件应包含 256 条事件，并以 HTML 表格的形式呈现。注意，这次运行 `chapters.appenders.mail.Email` 应用共产生了 10'000 条事件，但发出的邮件里只包含最后的 256 条。

![2nd email](http://logback.qos.ch/manual/images/chapters/appenders/smtpAppender2.jpg)

Email clients such as Mozilla Thunderbird, Eudora or MS Outlook, offer reasonably good CSS support for HTML email. However, they sometimes automatically downgrade HTML to plaintext. For example, to view HTML email in Thunderbird, the "View→Message Body As→Original HTML" option must be set. Yahoo! Mail's support for HTML email, in particular its CSS support is very good. Gmail on the other hand, while it honors the basic HTML table structure, ignores the internal CSS formatting. Gmail supports inline CSS formatting but since inline CSS would make the resulting output too voluminous, `HTMLLayout` does not use inline CSS.

Mozilla Thunderbird、Eudora 或 MS Outlook 这类邮件客户端对 HTML 邮件的 CSS 支持还算不错，不过它们有时会把 HTML 自动降级为纯文本。例如，要在 Thunderbird 中查看 HTML 邮件，必须设置 "View→Message Body As→Original HTML" 选项。Yahoo! Mail 对 HTML 邮件的支持——尤其是 CSS 支持——非常好。而 Gmail 虽然遵循基本的 HTML 表格结构，却会忽略内部 CSS 格式。Gmail 支持内联 CSS，但由于内联 CSS 会让输出内容过于臃肿，`HTMLLayout` 并没有使用内联 CSS。

### Custom buffer size

### 自定义缓冲区大小

By default, the outgoing message will contain the last 256 messages seen by `SMTPAppender`. If your heart so desires, you may set a different buffer size as shown in the next example.

默认情况下，发出的邮件会包含 `SMTPAppender` 看到的最后 256 条消息。如果你愿意，可以设置不同的缓冲区大小，如下例所示。

Example: `SMTPAppender` configuration with a custom bufer size (logback-examples/src/main/resources/chapters/appenders/mail/customBufferSize.xml)

示例：自定义缓冲区大小的 `SMTPAppender` 配置

```
<configuration>   
  <appender name="EMAIL" class="ch.qos.logback.classic.net.SMTPAppender">
    <smtpHost>${smtpHost}</smtpHost>
    <to>${to}</to>
    <from>${from}</from>
    <subject>%logger{20} - %m</subject>
    <layout class="ch.qos.logback.classic.html.HTMLLayout"/>

    <cyclicBufferTracker class="ch.qos.logback.core.spi.CyclicBufferTracker">
      <!-- send just one log entry per email -->
      <bufferSize>1</bufferSize>
    </cyclicBufferTracker>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="EMAIL" />
  </root>  
</configuration>    
```

### Triggering event

### 触发事件

If the Evaluator property is not set, the `SMTPAppender` defaults to an [OnErrorEvaluator](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/OnErrorEvaluator.html) instance which triggers email transmission when it encounters an event of level ERROR. While triggering an outgoing email in response to an error is relatively reasonable, it is possible to override this default behavior by providing a different implementation of the `EventEvaluator` interface.

如果没有设置 Evaluator 属性，`SMTPAppender` 默认会使用 [OnErrorEvaluator](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/OnErrorEvaluator.html) 实例，它在遇到 ERROR 级别的事件时触发邮件发送。用错误来触发发信虽然相对合理，但也可以通过提供 `EventEvaluator` 接口的其他实现来改变这一默认行为。

The `SMTPAppender` submits each incoming event to its evaluator by calling `evaluate()` method in order to check whether the event should trigger an email or just be placed in the cyclic buffer. When the evaluator gives a positive answer to its evaluation, an email is sent out. The `SMTPAppender` contains one and only one evaluator object. This object may manage its own internal state. For illustrative purposes, the `CounterBasedEvaluator` class listed next implements an event evaluator whereby every 1024th event triggers an email message.

`SMTPAppender` 会把每个到达的事件交给它的评估器，调用 `evaluate()` 方法来判断该事件应当触发邮件还是只是放入循环缓冲区。当评估器给出肯定结论时，就会发出一封邮件。`SMTPAppender` 只包含一个评估器对象，该对象可以维护自己的内部状态。为了演示，下面列出的 `CounterBasedEvaluator` 类实现了一个事件评估器：每逢第 1024 个事件就触发一封邮件。

Example: A `EventEvaluator` implementation that evaluates to `true` every 1024th event ([logback-examples/src/main/java/chapters/appenders/mail/CounterBasedEvaluator.java](http://logback.qos.ch/xref/chapters/appenders/mail/CounterBasedEvaluator.html))

示例：每逢第 1024 个事件返回 `true` 的 `EventEvaluator` 实现

```
package chapters.appenders.mail;

import ch.qos.logback.core.boolex.EvaluationException;
import ch.qos.logback.core.boolex.EventEvaluator;
import ch.qos.logback.core.spi.ContextAwareBase;

public class CounterBasedEvaluator extends ContextAwareBase implements EventEvaluator {

  static int LIMIT = 1024;
  int counter = 0;
  String name;

  public boolean evaluate(Object event) throws NullPointerException,
      EvaluationException {
    counter++;

    if (counter == LIMIT) {
      counter = 0;

      return true;
    } else {
      return false;
    }
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
```

Note that this class extends `ContextAwareBase` and implements `EventEvaluator`. This allows the user to concentrate on the core functions of her `EventEvaluator` and let the base class provide the common functionality.

注意，这个类继承了 `ContextAwareBase` 并实现了 `EventEvaluator`。这样用户只需专注于 `EventEvaluator` 的核心功能，通用功能则交给基类处理。

Setting the Evaluator option of `SMTPAppender` instructs it to use a custom evaluator. The next configuration file attaches a `SMTPAppender` to the root logger. This appender uses a `CounterBasedEvaluator` instance as its event evaluator.

设置 `SMTPAppender` 的 Evaluator 选项即可让它使用自定义评估器。下一个配置文件把一个 `SMTPAppender` 挂载到 root logger 上，这个 appender 使用 `CounterBasedEvaluator` 实例作为其事件评估器。

Example: `SMTPAppender` with custom `Evaluator` and buffer size (logback-examples/src/main/resources/chapters/appenders/mail/mail3.xml)

示例：使用自定义 `Evaluator` 和缓冲区大小的 `SMTPAppender`

View as .groovy

```
<configuration>
  <appender name="EMAIL" class="ch.qos.logback.classic.net.SMTPAppender">
    <evaluator class="chapters.appenders.mail.CounterBasedEvaluator" />
    <smtpHost>${smtpHost}</smtpHost>
    <to>${to}</to>
    <from>${from}</from>
    <subject>%logger{20} - %m</subject>

    <layout class="ch.qos.logback.classic.html.HTMLLayout"/>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="EMAIL" />
  </root>  
</configuration>
```

### Marker based triggering

### 基于 Marker 的触发

Although reasonable, the default triggering policy whereby every event of level ERROR triggers an outgoing email may result in too many emails, cluttering the targeted user's mailbox. Logback ships with another triggering policy, called [OnMarkerEvaluator](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/OnMarkerEvaluator.html). It is based on markers. In essence, emails are triggered only if the event is marked with a user-specified marker. The next example should make the point clearer.

默认的触发策略是每个 ERROR 级别的事件都触发一封外发邮件，虽然合理，但邮件太多可能会塞满目标用户的邮箱。Logback 还提供了另一种触发策略 [OnMarkerEvaluator](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/OnMarkerEvaluator.html)，它基于 marker（标记）。本质上，只有当事件带有用户指定的 marker 时才会触发邮件。下面的例子可以更清楚地说明这一点。

The [Marked_EMail](http://logback.qos.ch/xref/chapters/appenders/mail/Marked_EMail.html) application contains several logging statements some of which are of level ERROR. One noteworthy statement contains a marker. Here is the relevant code.

[Marked_EMail](http://logback.qos.ch/xref/chapters/appenders/mail/Marked_EMail.html) 应用包含若干条日志语句，其中一些是 ERROR 级别的。值得注意的是，其中一条语句带有 marker。相关代码如下。

```
Marker notifyAdmin = MarkerFactory.getMarker("NOTIFY_ADMIN");
logger.error(notifyAdmin,
  "This is a serious an error requiring the admin's attention",
   new Exception("Just testing"));
```

The next configuration file will trigger outgoing emails only in presence of events bearing the NOTIFY_ADMIN or the TRANSACTION_FAILURE markers.

下一个配置文件只会在出现带有 NOTIFY_ADMIN 或 TRANSACTION_FAILURE marker 的事件时触发外发邮件。

Example: `SMTPAppender` with `OnMarkerEvaluator` (logback-examples/src/main/resources/chapters/appenders/mail/mailWithMarker.xml)

示例：配合 `OnMarkerEvaluator` 的 `SMTPAppender`

View as .groovy

```
<configuration>
  <appender name="EMAIL" class="ch.qos.logback.classic.net.SMTPAppender">
    <evaluator class="ch.qos.logback.classic.boolex.OnMarkerEvaluator">
      <marker>NOTIFY_ADMIN</marker>
      <!-- you specify add as many markers as you want -->
      <marker>TRANSACTION_FAILURE</marker>
    </evaluator>
    <smtpHost>${smtpHost}</smtpHost>
    <to>${to}</to>
    <from>${from}</from>
    <layout class="ch.qos.logback.classic.html.HTMLLayout"/>
  </appender>

  <root>
    <level value ="debug"/>
    <appender-ref ref="EMAIL" />
  </root>  
</configuration>
```

Give it a whirl with the following command:

用下面的命令试一试：

```
java -Dfrom=source@xyz.com -Dto=recipient@xyz.com -DsmtpHost=some_smtp_host \
  chapters.appenders.mail.Marked_EMail src/main/java/chapters/appenders/mail/mailWithMarker.xml
```

#### Marker-based triggering with JaninoEventEvaluator

#### 使用 JaninoEventEvaluator 的基于 Marker 的触发

Note that instead of using the marker-centric `OnMarkerEvaluator`, we could use the much more generic [`JaninoEventEvaluator`](http://logback.qos.ch/manual/filters.html#JaninoEventEvaluator) or its even more powerful cousin [`GEventEvaluator`](http://logback.qos.ch/manual/filters.html#GEventEvaluator). For example, the following configuration file uses `JaninoEventEvaluator` instead of `OnMarkerEvaluator` but is otherwise equivalent to the previous configuration file.

注意，除了使用以 marker 为中心的 `OnMarkerEvaluator`，还可以使用更通用的 [`JaninoEventEvaluator`](http://logback.qos.ch/manual/filters.html#JaninoEventEvaluator)，或者它那个更强大的近亲 [`GEventEvaluator`](http://logback.qos.ch/manual/filters.html#GEventEvaluator)。例如，下面的配置文件用 `JaninoEventEvaluator` 替代了 `OnMarkerEvaluator`，其余部分与上一个配置文件等价。

Example: `SMTPAppender` with `JaninoEventEvaluator` (logback-examples/src/main/resources/chapters/appenders/mail/mailWithMarker_Janino.xml)

示例：配合 `JaninoEventEvaluator` 的 `SMTPAppender`

View as .groovy

```
<configuration>
  <appender name="EMAIL" class="ch.qos.logback.classic.net.SMTPAppender">
    <evaluator class="ch.qos.logback.classic.boolex.JaninoEventEvaluator">
      <expression>
        (marker != null) &&
        (marker.contains("NOTIFY_ADMIN") || marker.contains("TRANSACTION_FAILURE"))
      </expression>
    </evaluator>    
    ... same as above
  </appender>
</configuration>
```

#### Marker-based triggering with GEventEvaluator

#### 使用 GEventEvaluator 的基于 Marker 的触发

Here is the equivalent evaluator using [GEventEvaluator](http://logback.qos.ch/manual/filters.html#GEventEvaluator).

下面是使用 [GEventEvaluator](http://logback.qos.ch/manual/filters.html#GEventEvaluator) 的等价评估器。

Example: the same with `GEventEvaluator` (logback-examples/src/main/resources/chapters/appenders/mail/mailWithMarker_GEvent.xml)

示例：使用 `GEventEvaluator` 的等价配置

View as .groovy

```
<configuration>
  <appender name="EMAIL" class="ch.qos.logback.classic.net.SMTPAppender">
    <evaluator class="ch.qos.logback.classic.boolex.GEventEvaluator">
      <expression>
        e.marker?.contains("NOTIFY_ADMIN") || e.marker?.contains("TRANSACTION_FAILURE")
      </expression>
    </evaluator>    
    ... same as above
  </appender>
</configuration>
```

Note that since the event may lack a marker, the value of e.marker can be null. Hence the use of Groovy's [safe dereferencing operator](http://groovy.codehaus.org/Null+Object+Pattern), that is the .? operator.

注意，事件可能不带 marker，所以 e.marker 的值可能为 null，因此这里使用了 Groovy 的[安全解引用操作符](http://groovy.codehaus.org/Null+Object+Pattern)，也就是 .? 操作符。

### Authentication/STARTTLS/SSL

### 认证/STARTTLS/SSL

`SMTPAppender` supports authentication via plain user passwords as well as both the STARTTLS and SSL protocols. Note that STARTTLS differs from SSL in that, in STARTTLS, the connection is initially non-encrypted and only after the STARTTLS command is issued by the client (if the server supports it) does the connection switch to SSL. In SSL mode, the connection is encrypted right from the start.

`SMTPAppender` 支持基于明文用户名/密码的认证，也支持 STARTTLS 和 SSL 两种协议。注意 STARTTLS 与 SSL 的区别：使用 STARTTLS 时，连接最初是不加密的，只有当客户端发出 STARTTLS 命令之后（如果服务器支持），连接才切换到 SSL。而 SSL 模式下，连接从一开始就是加密的。

### SMTPAppender configuration for Gmail (SSL)

### Gmail 的 SMTPAppender 配置（SSL）

The next example shows you how to configure `SMTPAppender` for Gmail with the SSL protocol.

下一个例子演示如何为 Gmail 配置使用 SSL 协议的 `SMTPAppender`。

Example:: `SMTPAppender` to Gmail using SSL (logback-examples/src/main/resources/chapters/appenders/mail/gmailSSL.xml)

示例：使用 SSL 向 Gmail 发信的 `SMTPAppender`

View as .groovy

```
<configuration>
  <appender name="EMAIL" class="ch.qos.logback.classic.net.SMTPAppender">
    <smtpHost>smtp.gmail.com</smtpHost>
    <smtpPort>465</smtpPort>
    <SSL>true</SSL>
    <username>YOUR_USERNAME@gmail.com</username>
    <password>YOUR_GMAIL_PASSWORD</password>

    <to>EMAIL-DESTINATION</to>
    <to>ANOTHER_EMAIL_DESTINATION</to> <!-- additional destinations are possible -->
    <from>YOUR_USERNAME@gmail.com</from>
    <subject>TESTING: %logger{20} - %m</subject>
    <layout class="ch.qos.logback.classic.PatternLayout">
      <pattern>%date %-5level %logger{35} - %message%n</pattern>
    </layout>       
  </appender>

  <root level="DEBUG">
    <appender-ref ref="EMAIL" />
  </root>  
</configuration>
```

### SMTPAppender for Gmail (STARTTLS)

### Gmail 的 SMTPAppender 配置（STARTTLS）

The next example shows you how to configure `SMTPAppender` for Gmail for the STARTTLS protocol.

下一个例子演示如何为 Gmail 配置使用 STARTTLS 协议的 `SMTPAppender`。

Example: `SMTPAppender` to GMAIL using STARTTLS (logback-examples/src/main/resources/chapters/appenders/mail/gmailSTARTTLS.xml)

示例：使用 STARTTLS 向 Gmail 发信的 `SMTPAppender`

View as .groovy

```
<configuration>   
  <appender name="EMAIL" class="ch.qos.logback.classic.net.SMTPAppender">
    <smtpHost>smtp.gmail.com</smtpHost>
    <smtpPort>587</smtpPort>
    <STARTTLS>true</STARTTLS>
    <username>YOUR_USERNAME@gmail.com</username>
    <password>YOUR_GMAIL_xPASSWORD</password>
    
    <to>EMAIL-DESTINATION</to>
    <to>ANOTHER_EMAIL_DESTINATION</to> <!-- additional destinations are possible -->
    <from>YOUR_USERNAME@gmail.com</from>
    <subject>TESTING: %logger{20} - %m</subject>
    <layout class="ch.qos.logback.classic.PatternLayout">
      <pattern>%date %-5level %logger - %message%n</pattern>
    </layout>       
  </appender>

  <root level="DEBUG">
    <appender-ref ref="EMAIL" />
  </root>  
</configuration>
```

### SMTPAppender with MDCDiscriminator

### 配合 MDCDiscriminator 的 SMTPAppender

As mentioned earlier, by specifying a discriminator other than the default one, `SMTPAppender` will generate email messages containing events pertaining to a particular user, user session or client IP address, depending on the specified discriminator.

如前所述，通过指定一个非默认的 discriminator，`SMTPAppender` 生成的邮件将只包含与特定用户、用户会话或客户端 IP 地址相关的事件，具体取决于所指定的 discriminator。

The next example illustrates the use of [MDCBasedDiscriminator](http://logback.qos.ch/xref/ch/qos/logback/classic/sift/MDCBasedDiscriminator.html) in conjunction with the MDC key named "req.remoteHost", assumed to contain the IP address of the remote host accessing a fictitious application. In a web-application, you could use [MDCInsertingServletFilter](http://logback.qos.ch/manual/mdc.html#mis) to populate MDC values.

下一个例子演示了 [MDCBasedDiscriminator](http://logback.qos.ch/xref/ch/qos/logback/classic/sift/MDCBasedDiscriminator.html) 的用法，它配合名为 "req.remoteHost" 的 MDC 键使用，假定该键中存放的是访问这个虚构应用的远程主机 IP 地址。在 web 应用中，可以使用 [MDCInsertingServletFilter](http://logback.qos.ch/manual/mdc.html#mis) 来填充 MDC 值。

Example: `SMTPAppender` with MDCBasedDsicriminator (logback-examples/src/main/resources/chapters/appenders/mail/mailWithMDCBasedDiscriminator.xml)

示例：配合 MDCBasedDiscriminator 的 `SMTPAppender`

View as .groovy

```
<configuration>   
  <appender name="EMAIL" class="ch.qos.logback.classic.net.SMTPAppender">
    <smtpHost>ADDRESS-OF-YOUR-SMTP-HOST</smtpHost>
    <to>EMAIL-DESTINATION</to>
    <from>SENDER-EMAIL</from>

    <discriminator class="ch.qos.logback.classic.sift.MDCBasedDiscriminator">
      <key>req.remoteHost</key>
      <defaultValue>default</defaultValue>
    </discriminator>

    <subject>${HOSTNAME} -- %X{req.remoteHost} %msg"</subject>
    <layout class="ch.qos.logback.classic.html.HTMLLayout">
      <pattern>%date%level%thread%X{req.remoteHost}%X{req.requestURL}%logger%msg</pattern>
    </layout>
  </appender>

  <root>
    <level level="DEBUG"/>
    <appender-ref ref="EMAIL" />
  </root>  
</configuration>
```

Thus, each outgoing email generated by `SMTPAppender` will belong to a *unique* remote host, greatly facilitating problem diagnosis.

这样，`SMTPAppender` 生成的每封邮件都只属于一个*唯一的*远程主机，大大方便了问题诊断。

#### Buffer management in very busy systems

#### 非常繁忙的系统中的缓冲区管理

Internally, each distinct value returned by the discriminator will cause the creation of a new cyclic buffer. However, at most maxNumberOfBuffers (by default 64) will be maintained. Whenever the number of buffers rises above maxNumberOfBuffers, the least recently updated buffer is automatically discarded. As a second safety measure, any buffer which has not been updated in the last 30 minutes will be automatically discarded as well.

在内部实现上，discriminator 返回的每个不同的值都会导致创建一个新的循环缓冲区。但最多只会维护 maxNumberOfBuffers 个（默认 64 个）缓冲区。一旦缓冲区数量超过 maxNumberOfBuffers，最近最少更新的缓冲区就会被自动丢弃。作为第二重保护，过去 30 分钟内没有更新的缓冲区也会被自动丢弃。

On systems serving a large number of transactions per minute, allowing only a small number for maxNumberOfBuffers (by default 64) will often cause the number of events in the outgoing email to be unnecessarily small. Indeed, in the presence of a large number of transactions, there will be more than one buffer associated with the same transaction as buffers will be killed and re-born in succession for the same discriminator value (or transaction). Note that in even such very busy systems, the maximum number of cyclic buffers is capped by maxNumberOfBuffers.

对于每分钟处理大量事务的系统来说，如果 maxNumberOfBuffers（默认 64）只允许很小的值，发出的邮件中包含的事件数往往会不必要地偏少。这是因为在大量事务的情况下，同一个事务可能对应不止一个缓冲区——针对同一个 discriminator 值（或事务），缓冲区会被接连地销毁又重建。注意，即使在这种非常繁忙的系统里，循环缓冲区的最大数量也受 maxNumberOfBuffers 限制。

To avoid such yo-yo effects, `SMTPAppender` will release the buffer associated with a given discriminator key as soon as it sees an event marked as "FINALIZE_SESSION". This will cause the appropriate buffer to be discarded at the end of each transaction. You can then safely increase the value of maxNumberOfBuffers to a larger value such as 512 or 1024 without risking running out of memory.

为了避免这种"悠悠球"效应，`SMTPAppender` 一旦看到带有 "FINALIZE_SESSION" 标记的事件，就会释放与相应 discriminator 键关联的缓冲区，从而在每个事务结束时丢弃对应的缓冲区。这样就可以放心地把 maxNumberOfBuffers 增大到 512 或 1024 这样的较大值，而不必担心内存耗尽。

There are three distinct but complementary mechanisms working together to manage cyclic buffers. They ensure that only relevant buffers are kept alive at any given moment, even in very busy systems.

共有三种不同但互补的机制协同管理循环缓冲区。它们保证即使在非常繁忙的系统中，任何时刻也只有相关的缓冲区被保留存活。

### DBAppender

### DBAppender

The [`DBAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/db/DBAppender.html) inserts logging events into three database tables in a format independent of the Java programming language.

[`DBAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/db/DBAppender.html) 以一种与 Java 编程语言无关的格式，把日志事件插入到三张数据库表中。

These three tables are *logging_event*, *logging_event_property* and *logging_event_exception*. They must exist before `DBAppender` can be used. Logback ships with SQL scripts that will create the tables. They can be found under the *logback-classic/src/main/java/ch/qos/logback/classic/db/script* folder. There is a specific script for each of the most popular database systems. If the script for your particular type of database system is missing, it should be quite easy to write one, taking example on the already existing scripts. If you send them to us, we will gladly include missing scripts in future releases.

这三张表分别是 *logging_event*、*logging_event_property* 和 *logging_event_exception*。在使用 `DBAppender` 之前，它们必须已经存在。Logback 自带了创建这些表的 SQL 脚本，位于 *logback-classic/src/main/java/ch/qos/logback/classic/db/script* 目录下，每种主流数据库系统都有对应的脚本。如果缺少针对你的数据库系统的脚本，参照现有脚本编写一个应该不难。如果你把它们发给我们，我们很乐意在未来的版本中加入缺失的脚本。

If your JDBC driver supports the `getGeneratedKeys` method introduced in JDBC 3.0 specification, assuming you have created the appropriate database tables as mentioned above, then no additional steps are required. Otherwise, there must be an `SQLDialect` appropriate for your database system. Currently, logback has dialects for H2, HSQL, MS SQL Server, MySQL, Oracle, PostgreSQL, SQLLite and Sybase.

如果你的 JDBC 驱动支持 JDBC 3.0 规范中引入的 `getGeneratedKeys` 方法，并且已经像上文那样创建了所需的数据库表，那么就不需要其他额外步骤。否则，必须有与你数据库系统匹配的 `SQLDialect`。目前，logback 为 H2、HSQL、MS SQL Server、MySQL、Oracle、PostgreSQL、SQLLite 和 Sybase 提供了方言。

The table below summarizes the database types and their support of the `getGeneratedKeys()` method.

下表汇总了各种数据库类型及其对 `getGeneratedKeys()` 方法的支持情况。

| RDBMS                | tested version(s) | tested JDBC driver version(s) | supports `getGeneratedKeys()` method | is a dialect provided by logback |
| -------------------- | ----------------- | ----------------------------- | ------------------------------------ | -------------------------------- |
| DB2                  | untested          | untested                      | unknown                              | NO                               |
| H2                   | 1.2.132           | -                             | unknown                              | YES                              |
| HSQL                 | 1.8.0.7           | -                             | NO                                   | YES                              |
| Microsoft SQL Server | 2005              | 2.0.1008.2 (sqljdbc.jar)      | YES                                  | YES                              |
| MySQL                | 5.0.22            | 5.0.8 (mysql-connector.jar)   | YES                                  | YES                              |
| PostgreSQL           | 8.x               | 8.4-701.jdbc4                 | NO                                   | YES                              |
| Oracle               | 10g               | 10.2.0.1 (ojdbc14.jar)        | YES                                  | YES                              |
| SQLLite              | 3.7.4             | -                             | unknown                              | YES                              |
| Sybase SQLAnywhere   | 10.0.1            | -                             | unknown                              | YES                              |

Experiments show that writing a single event into the database takes approximately 10 milliseconds, on a "standard" PC. If pooled connections are used, this figure drops to around 1 millisecond. Note that most JDBC drivers already ship with connection pooling support.

实验表明，在一台"标准" PC 上，向数据库写入单个事件大约需要 10 毫秒；如果使用连接池，这个数字会降到 1 毫秒左右。注意，大多数 JDBC 驱动本身就自带连接池支持。

Configuring logback to use `DBAppender` can be done in several different ways, depending on the tools one has to connect to the database, and the database itself. The key issue in configuring `DBAppender` is about setting its `ConnectionSource` object, as we shall discover shortly.

根据连接数据库所用的工具和数据库本身的不同，配置 logback 使用 `DBAppender` 有多种方式。配置 `DBAppender` 的关键在于设置它的 `ConnectionSource` 对象，稍后我们就会看到。

Once `DBAppender` is configured for your database, logging events are sent to the specified database. As stated previously, there are three tables used by logback to store logging event data.

一旦针对你的数据库配置好了 `DBAppender`，日志事件就会被发送到指定的数据库。如前所述，logback 使用三张表来存储日志事件数据。

The *logging_event* table contains the following fields:

*logging_event* 表包含以下字段：

| Field                 | Type       | Description                                                  |
| --------------------- | ---------- | ------------------------------------------------------------ |
| **timestamp**         | `big int`  | The timestamp that was valid at the logging event's creation. |
| **formatted_message** | `text`     | The message that has been added to the logging event, after formatting with `org.slf4j.impl.MessageFormatter`, in case objects were passed along with the message. |
| **logger_name**       | `varchar`  | The name of the logger used to issue the logging request.    |
| **level_string**      | `varchar`  | The level of the logging event.                              |
| **reference_flag**    | `smallint` | This field is used by logback to identify logging events that have an exception or `MDC`property values associated.Its value is computed by `ch.qos.logback.classic.db.DBHelper`. A logging event that contains `MDC` or `Context` properties has a flag number of *1*. One that contains an exception has a flag number of *2*. A logging event that contains both elements has a flag number of *3*. |
| **caller_filename**   | `varchar`  | The name of the file where the logging request was issued.   |
| **caller_class**      | `varchar`  | The class where the logging request was issued.              |
| **caller_method**     | `varchar`  | The name of the method where the logging request was issued. |
| **caller_line**       | `char`     | The line number where the logging request was issued.        |
| **event_id**          | `int`      | The database id of the logging event.                        |

The *logging_event_property* is used to store the keys and values contained in the `MDC` or the `Context`. It contains these fields:

*logging_event_property* 表用来存放 `MDC` 或 `Context` 中的键值对，包含以下字段：

| Field            | Type      | Description                           |
| ---------------- | --------- | ------------------------------------- |
| **event_id**     | `int`     | The database id of the logging event. |
| **mapped_key**   | `varchar` | The key of the `MDC` property         |
| **mapped_value** | `text`    | The value of the `MDC` property       |

The *logging_event_exception* table contains the following fields:

*logging_event_exception* 表包含以下字段：

| Field          | Type       | Description                                    |
| -------------- | ---------- | ---------------------------------------------- |
| **event_id**   | `int`      | The database id of the logging event.          |
| **i**          | `smallint` | The index of the line in the full stack trace. |
| **trace_line** | `varchar`  | The corresponding line                         |

To give a more visual example of the work done by `DBAppender`, here is a screenshot of a MySQL database with content provided by `DBAppender`.

为了更直观地展示 `DBAppender` 所做的工作，下面是一个 MySQL 数据库的截图，内容来自 `DBAppender`。

The *logging_event* table:

*logging_event* 表：

![Logging Event table](http://logback.qos.ch/manual/images/chapters/appenders/dbAppenderLE.gif)

The *logging_event_exception* table:

*logging_event_exception* 表：

![Logging Event Exception table](http://logback.qos.ch/manual/images/chapters/appenders/dbAppenderLEException.gif)

The *logging_event_property* table:

*logging_event_property* 表：

![Logging Event Property table](http://logback.qos.ch/manual/images/chapters/appenders/dbAppenderLEProperty.gif)

#### ConnectionSource

#### ConnectionSource

The `ConnectionSource` interface provides a pluggable means of transparently obtaining JDBC connections for logback classes that require the use of a `java.sql.Connection`. There are currently three implementations of `ConnectionSource`, namely `DataSourceConnectionSource`, `DriverManagerConnectionSource` and `JNDIConnectionSource`.

`ConnectionSource` 接口提供了一种可插拔的方式，为需要使用 `java.sql.Connection` 的 logback 类透明地获取 JDBC 连接。目前 `ConnectionSource` 有三个实现：`DataSourceConnectionSource`、`DriverManagerConnectionSource` 和 `JNDIConnectionSource`。

The first example that we will review is a configuration using `DriverManagerConnectionSource` and a MySQL database. The following configuration file is what one would need.

我们要看的第一个例子是使用 `DriverManagerConnectionSource` 连接 MySQL 数据库的配置，需要的配置文件如下。

Example: `DBAppender` configuration (logback-examples/src/main/resources/chapters/appenders/db/append-toMySQL-with-driverManager.xml)

示例：`DBAppender` 配置

View as .groovy

```
<configuration>

  <appender name="DB" class="ch.qos.logback.classic.db.DBAppender">
    <connectionSource class="ch.qos.logback.core.db.DriverManagerConnectionSource">
      <driverClass>com.mysql.jdbc.Driver</driverClass>
      <url>jdbc:mysql://host_name:3306/datebase_name</url>
      <user>username</user>
      <password>password</password>
    </connectionSource>
  </appender>
  
  <root level="DEBUG" >
    <appender-ref ref="DB" />
  </root>
</configuration>
```

The correct driver must be declared. Here, the `com.mysql.jdbc.Driver` class is used. The url must begin with *jdbc:mysql://*.

必须声明正确的驱动类，这里使用的是 `com.mysql.jdbc.Driver`。url 必须以 *jdbc:mysql://* 开头。

The [`DriverManagerConnectionSource`](http://logback.qos.ch/xref/ch/qos/logback/core/db/DriverManagerConnectionSource.html) is an implementation of `ConnectionSource` that obtains the connection in the traditional JDBC manner based on the connection URL.

[`DriverManagerConnectionSource`](http://logback.qos.ch/xref/ch/qos/logback/core/db/DriverManagerConnectionSource.html) 是 `ConnectionSource` 的一个实现，它基于连接 URL，以传统的 JDBC 方式获取连接。

Note that this class will establish a new `Connection` for each call to `getConnection()`. It is recommended that you either use a JDBC driver that natively supports connection pooling or that you create your own implementation of `ConnectionSource` that taps into whatever pooling mechanism you are already using. If you have access to a JNDI implementation that supports `javax.sql.DataSource`, e.g. within a J2EE application server, see [`JNDIConnectionSource`](http://logback.qos.ch/manual/appenders.html#JNDIConnectionSource) below.

注意，这个类每次调用 `getConnection()` 都会建立一个新的 `Connection`。建议要么使用原生支持连接池的 JDBC 驱动，要么自己实现一个 `ConnectionSource`，接入你已经在使用的连接池机制。如果你能访问支持 `javax.sql.DataSource` 的 JNDI 实现（例如在 J2EE 应用服务器中），请参阅下文的 [`JNDIConnectionSource`](http://logback.qos.ch/manual/appenders.html#JNDIConnectionSource)。

Connecting to a database using a `DataSource` is rather similar. The configuration now uses [`DataSourceConnectionSource`](http://logback.qos.ch/xref/ch/qos/logback/core/db/DataSourceConnectionSource.html), which is an implementation of `ConnectionSource` that obtains the `Connection` in the recommended JDBC manner based on a `javax.sql.DataSource`.

使用 `DataSource` 连接数据库的方式也差不多，只是配置改用 [`DataSourceConnectionSource`](http://logback.qos.ch/xref/ch/qos/logback/core/db/DataSourceConnectionSource.html)。它是 `ConnectionSource` 的另一个实现，基于 `javax.sql.DataSource`，以 JDBC 推荐的方式获取 `Connection`。

Example: `DBAppender` configuration (logback-examples/src/main/resources/chapters/appenders/db/append-with-datasource.xml)

示例：`DBAppender` 配置

View as .groovy

```
<configuration  debug="true">

  <appender name="DB" class="ch.qos.logback.classic.db.DBAppender">
     <connectionSource class="ch.qos.logback.core.db.DataSourceConnectionSource">
       
       <dataSource class="${dataSourceClass}">
         <!-- Joran cannot substitute variables
         that are not attribute values. Therefore, we cannot
         declare the next parameter like the others. 
         -->
         <param name="${url-key:-url}" value="${url_value}"/>
         <serverName>${serverName}</serverName>
         <databaseName>${databaseName}</databaseName>
       </dataSource>
       
       <user>${user}</user>
       <password>${password}</password>
     </connectionSource>
  </appender>

  <root level="INFO">
    <appender-ref ref="DB" />
  </root>  
</configuration>
```

Note that in this configuration sample, we make heavy use of substitution variables. They are sometimes handy when connection details have to be centralized in a single configuration file and shared by logback and other frameworks.

注意，在这个配置示例中我们大量使用了变量替换。当连接细节需要集中在一个配置文件中、并由 logback 和其他框架共享时，变量替换有时会非常方便。

#### JNDIConnectionSource

#### JNDIConnectionSource

[`JNDIConnectionSource`](http://logback.qos.ch/xref/ch/qos/logback/core/db/JNDIConnectionSource.html) is another `ConnectionSource` implementation shipping in logback. As its name indicates, it retrieves a `javax.sql.DataSource` from a JNDI and then leverages it to obtain a `java.sql.Connection` instance. `JNDIConnectionSource` is primarily designed to be used inside J2EE application servers or by application server clients, assuming the application server supports remote access of `javax.sql.DataSource`. Thus, one can take advantage of connection pooling and whatever other goodies the application server provides. More importantly, your application will be [dryer](http://en.wikipedia.org/wiki/Don't_repeat_yourself) as it will be no longer necessary to define a `DataSource` in *logback.xml*.

[`JNDIConnectionSource`](http://logback.qos.ch/xref/ch/qos/logback/core/db/JNDIConnectionSource.html) 是 logback 自带的另一个 `ConnectionSource` 实现。顾名思义，它从 JNDI 中获取一个 `javax.sql.DataSource`，再借助它获得 `java.sql.Connection` 实例。`JNDIConnectionSource` 主要设计用于 J2EE 应用服务器内部，或者作为应用服务器的客户端使用，前提是应用服务器支持对 `javax.sql.DataSource` 的远程访问。这样就可以利用连接池以及应用服务器提供的其他好处。更重要的是，由于不再需要在 *logback.xml* 中定义 `DataSource`，你的应用会更加[符合 DRY 原则](http://en.wikipedia.org/wiki/Don't_repeat_yourself)。

For example, here is a configuration snippet for Tomcat. It assumes PostgreSQL as the database although any of the supported database systems (listed above) would work.

比如，下面是一个针对 Tomcat 的配置片段。这里以 PostgreSQL 作为数据库，不过上面列出的任何受支持的数据库系统都可以。

```
<Context docBase="/path/to/app.war" path="/myapp">
  ...
  <Resource name="jdbc/logging"
               auth="Container"
               type="javax.sql.DataSource"
               username="..."
               password="..."
               driverClassName="org.postgresql.Driver"
               url="jdbc:postgresql://localhost/..."
               maxActive="8"
               maxIdle="4"/>
  ...
</Context>
```

Once a `DataSource` is defined in the J2EE server, it can be easily referenced by your logback configuration file, as shown in the next example.

在 J2EE 服务器中定义好 `DataSource` 之后，就可以在 logback 配置文件中轻松引用它，如下例所示。

Example: `DBAppender` configuration by `JNDIConnectionSource` (logback-examples/src/main/resources/chapters/appenders/db/append-via-jndi.xml)

示例：通过 `JNDIConnectionSource` 配置 `DBAppender`

View as .groovy

```
<configuration debug="true">
  <appender name="DB" class="ch.qos.logback.classic.db.DBAppender">
    <connectionSource class="ch.qos.logback.core.db.JNDIConnectionSource">
      <!-- please note the "java:comp/env/" prefix -->
      <jndiLocation>java:comp/env/jdbc/logging</jndiLocation>
    </connectionSource>
  </appender>
  <root level="INFO">
    <appender-ref ref="DB" />
  </root>  
</configuration>
```

Note that this class will obtain an `javax.naming.InitialContext` using the no-argument constructor. This will usually work when executing within a J2EE environment. When outside the J2EE environment, make sure that you provide a *jndi.properties* file as described by your JNDI provider's documentation.

注意，这个类会使用无参构造函数获取 `javax.naming.InitialContext`。在 J2EE 环境中执行时这通常没问题；在 J2EE 环境之外，请按照你的 JNDI 提供方的文档说明，确保提供了 *jndi.properties* 文件。

#### Connection pooling

#### 连接池

Logging events can be created at a rather fast pace. To keep up with the flow of events that must be inserted into a database, it is recommended to use connection pooling with `DBAppender`.

日志事件的产生速度可能非常快。为了跟上必须插入数据库的事件流，建议在 `DBAppender` 中使用连接池。

Experiment shows that using connection pooling with `DBAppender` gives a big performance boost. With the following configuration file, logging events are sent to a MySQL database, without any pooling.

实验表明，`DBAppender` 配合连接池能带来巨大的性能提升。使用下面的配置文件，日志事件被发送到 MySQL 数据库，但没有使用任何连接池。

Example: `DBAppender` configuration without pooling (logback-examples/src/main/resources/chapters/appenders/db/append-toMySQL-with-datasource.xml)

示例：不使用连接池的 `DBAppender` 配置

View as .groovy

```
<configuration>

  <appender name="DB" class="ch.qos.logback.classic.db.DBAppender">
    <connectionSource class="ch.qos.logback.core.db.DataSourceConnectionSource">
      <dataSource class="com.mysql.jdbc.jdbc2.optional.MysqlDataSource">
        <serverName>${serverName}</serverName>
        <port>${port$</port>
        <databaseName>${dbName}</databaseName>
        <user>${user}</user>
        <password>${pass}</password>
      </dataSource>
    </connectionSource>
  </appender>
    
  <root level="DEBUG">
    <appender-ref ref="DB" />
  </root>
</configuration>
```

With this configuration file, sending 500 logging events to a MySQL database takes a whopping 5 seconds, that is 10 milliseconds per request. This figure is unacceptable when dealing with large applications.

使用这份配置文件，向 MySQL 数据库发送 500 条日志事件需要足足 5 秒，即每个请求 10 毫秒。对于大型应用来说，这个数字是不可接受的。

A dedicated external library is necessary to use connection pooling with `DBAppender`. The next example uses [c3p0](http://sourceforge.net/projects/c3p0). To be able to use c3p0, one must download it and place *c3p0-VERSION.jar* in the classpath.

要让 `DBAppender` 使用连接池，需要一个专门的外部类库。下一个例子使用 [c3p0](http://sourceforge.net/projects/c3p0)。要使用 c3p0，必须先下载它，并把 *c3p0-VERSION.jar* 放入 classpath。

Example: `DBAppender` configuration with pooling (logback-examples/src/main/resources/chapters/appenders/db/append-toMySQL-with-datasource-and-pooling.xml)

示例：使用连接池的 `DBAppender` 配置

View as .groovy

```
<configuration>

  <appender name="DB" class="ch.qos.logback.classic.db.DBAppender">
    <connectionSource
      class="ch.qos.logback.core.db.DataSourceConnectionSource">
      <dataSource
        class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <driverClass>com.mysql.jdbc.Driver</driverClass>
        <jdbcUrl>jdbc:mysql://${serverName}:${port}/${dbName}</jdbcUrl>
        <user>${user}</user>
        <password>${password}</password>
      </dataSource>
    </connectionSource>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="DB" />
  </root>
</configuration>
```

With this new configuration, sending 500 logging requests to the aforementioned MySQL database takes around 0.5 seconds, for an average of 1 millisecond per request, that is a tenfold improvement in performance.

使用这份新配置，向前述 MySQL 数据库发送 500 条日志请求只需约 0.5 秒，平均每个请求 1 毫秒，性能提升了十倍。

### SyslogAppender

### SyslogAppender

The syslog protocol is a very simple protocol: a syslog sender sends a small message to a syslog receiver. The receiver is commonly called *syslog daemon* or *syslog server*. Logback can send messages to a remote syslog daemon. This is achieved by using [`SyslogAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SyslogAppender.html).

syslog 协议是一个非常简单的协议：syslog 发送方向 syslog 接收方发送一条小消息。接收方通常称为 *syslog daemon* 或 *syslog server*。Logback 可以向远程 syslog daemon 发送消息，这是通过 [`SyslogAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SyslogAppender.html) 实现的。

Here are the properties you can pass to a SyslogAppender.

下面是可以传给 SyslogAppender 的属性。

| Property Name         | Type      | Description                                                  |
| --------------------- | --------- | ------------------------------------------------------------ |
| **syslogHost**        | `String`  | The host name of the syslog server.                          |
| **port**              | `String`  | The port number on the syslog server to connect to. Normally, one would not want to change the default value of *514*. |
| **facility**          | `String`  | The facility is meant to identify the source of a message.The facility option must be set to one of the strings *KERN, USER, MAIL, DAEMON, AUTH, SYSLOG, LPR, NEWS, UUCP, CRON, AUTHPRIV, FTP, NTP, AUDIT, ALERT, CLOCK, LOCAL0, LOCAL1, LOCAL2, LOCAL3, LOCAL4, LOCAL5, LOCAL6, LOCAL7*. Case is not important. |
| **suffixPattern**     | `String`  | The suffixPattern option specifies the format of the non-standardized part of the message sent to the syslog server. By default, its value is *[%thread] %logger %msg*. Any value that a `PatternLayout` could use is a correct suffixPattern value. |
| **stackTracePattern** | `String`  | The stackTracePattern property allows the customization of the string appearing just before each stack trace line. The default value for this property is "\t", i.e. the tab character. Any value accepted by `PatternLayout` is a valid value for stackTracePattern. |
| **throwableExcluded** | `boolean` | Setting throwableExcluded to `true` will cause stack trace data associated with a Throwable to be omitted. By default, throwableExcluded is set to `false` so that stack trace data is sent to the syslog server. |

The syslog severity of a logging event is converted from the level of the logging event. The *DEBUG* level is converted to *7*, *INFO* is converted to *6*, *WARN* is converted to *4* and *ERROR* is converted to *3*.

日志事件的 syslog 严重级别由其日志级别转换而来：*DEBUG* 级别转换为 *7*，*INFO* 转换为 *6*，*WARN* 转换为 *4*，*ERROR* 转换为 *3*。

Since the format of a syslog request follows rather strict rules, there is no layout to be used with `SyslogAppender`. However, using the suffixPattern option lets the user display whatever information she wishes.

由于 syslog 请求的格式遵循相当严格的规则，`SyslogAppender` 没有可用的 layout。不过，通过 suffixPattern 选项，用户可以自行决定显示哪些信息。

Here is a sample configuration using a `SyslogAppender`.

下面是一个使用 `SyslogAppender` 的示例配置。

Example: `SyslogAppender` configuration (logback-examples/src/main/resources/chapters/appenders/conf/logback-syslog.xml)

示例：`SyslogAppender` 配置

View as .groovy

```
<configuration>

  <appender name="SYSLOG" class="ch.qos.logback.classic.net.SyslogAppender">
    <syslogHost>remote_home</syslogHost>
    <facility>AUTH</facility>
    <suffixPattern>[%thread] %logger %msg</suffixPattern>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="SYSLOG" />
  </root>
</configuration>
```

When testing this configuration, you should verify that the remote syslog daemon accepts requests from an external source. Experience shows that, by default, syslog daemons usually deny requests coming via a network connection.

测试这份配置时，应当确认远程 syslog daemon 接受来自外部来源的请求。经验表明，syslog daemon 默认通常会拒绝通过网络连接进来的请求。

### SiftingAppender

### SiftingAppender

As its name implies, a `SiftingAppender` can be used to separate (or sift) logging according to a given runtime attribute. For example, `SiftingAppender` can separate logging events according to user sessions, so that the logs generated by different users go into distinct log files, one log file per user.

顾名思义，`SiftingAppender` 可以根据某个给定的运行时属性对日志进行分离（筛选）。例如，`SiftingAppender` 可以按用户会话分离日志事件，让不同用户产生的日志进入不同的日志文件，一个用户对应一个文件。

| Property Name        | Type       | Description                                                  |
| -------------------- | ---------- | ------------------------------------------------------------ |
| **timeout**          | `Duration` | A nested appender which has not been accessed beyond the timeout duration is deemed stale. A stale appender is closed and unreferenced by `SiftingAppender`. The default value for timeout is 30 minutes. |
| **maxAppenderCount** | `integer`  | The maximum number of nested appenders `SiftingAppender` may create and track. Default value for maxAppenderCount is Integer.MAX_VALUE. |

`SiftingAppender` achieves this feat by creating nested appenders on the fly. Nested appenders are created based on a template specified within the configuration of the `SiftingAppender` itself (enclosed within the `` element, see example below). `SiftingAppender` is responsible for managing the lifecycle of child appenders. For example, `SiftingAppender` will automatically close and remove any stale appender. A nested appender is considered stale when no accesses it beyond the duration specified by the timeout parameter.

`SiftingAppender` 通过动态创建嵌套 appender 来实现这一能力。嵌套 appender 根据 `SiftingAppender` 自身配置中指定的模板创建（模板包含在 `<sift>` 元素内，见下面的示例）。`SiftingAppender` 负责管理子 appender 的生命周期。例如，`SiftingAppender` 会自动关闭并移除任何过期的 appender。如果一个嵌套 appender 超过 timeout 参数指定的时长无人访问，就视为过期。

When handling a logging event, `SiftingAppender` will select a child appender to delegate to. The selection criteria are computed at runtime by a discriminator. The user can specify the selection criteria with the help of a `Discriminator`. Let us now study an example.

在处理日志事件时，`SiftingAppender` 会挑选一个子 appender 进行委托。选择标准在运行时由 discriminator 计算得出，用户可以借助 `Discriminator` 指定选择标准。下面来看一个例子。

#### Example

#### 示例

The [SiftExample](http://logback.qos.ch/xref/chapters/appenders/sift/SiftExample.html) application logs a message stating that the application has started. It then sets the MDC key "userid" to "Alice" and logs a message. Here is the salient code:

[SiftExample](http://logback.qos.ch/xref/chapters/appenders/sift/SiftExample.html) 应用先输出一条表示应用已启动的日志消息，然后把 MDC 键 "userid" 设为 "Alice"，再输出一条日志消息。关键代码如下：

logger.debug("Application started"); MDC.put("userid", "Alice"); logger.debug("Alice says hello"); 

The template for the configuration file illustrates the use of `SiftingAppender`.

下面的配置文件模板演示了 `SiftingAppender` 的用法。

Example: `SiftingAppender` configuration (logback-examples/src/main/resources/chapters/appenders/sift/byUserid.xml)

示例：`SiftingAppender` 配置

View as .groovy

```
<configuration>

  <appender name="SIFT" class="ch.qos.logback.classic.sift.SiftingAppender">
    <!-- in the absence of the class attribute, it is assumed that the
         desired discriminator type is
         ch.qos.logback.classic.sift.MDCBasedDiscriminator -->
    <discriminator>
      <key>userid</key>
      <defaultValue>unknown</defaultValue>
    </discriminator>
    <sift>
      <appender name="FILE-${userid}" class="ch.qos.logback.core.FileAppender">
        <file>${userid}.log</file>
        <append>false</append>
        <layout class="ch.qos.logback.classic.PatternLayout">
          <pattern>%d [%thread] %level %mdc %logger{35} - %msg%n</pattern>
        </layout>
      </appender>
    </sift>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="SIFT" />
  </root>
</configuration>
```

In the absence of a class attribute, it is assumed that the discriminator type is [MDCBasedDiscriminator](http://logback.qos.ch/xref/ch/qos/logback/classic/sift/MDCBasedDiscriminator.html). The discriminating value is the MDC value associated with the key given by the key property. However, if that MDC value is null, then defaultValue is used as the discriminating value.

如果没有指定 class 属性，则假定 discriminator 类型为 [MDCBasedDiscriminator](http://logback.qos.ch/xref/ch/qos/logback/classic/sift/MDCBasedDiscriminator.html)。区分值就是与 key 属性给定的键相关联的 MDC 值；如果该 MDC 值为 null，则使用 defaultValue 作为区分值。

The `SiftingAppender` is unique in its capacity to reference and configure child appenders. In the above example, `SiftingAppender` will create multiple `FileAppender` instances, each `FileAppender` instance identified by the value associated with the "userid" MDC key. Whenever the "userid" MDC key is assigned a new value, a new `FileAppender` instance will be built from scratch. The `SiftingAppender` keeps track of the appenders it creates. Appenders unused for 30 minutes will be automatically closed and discarded.

`SiftingAppender` 在引用和配置子 appender 方面的能力是独一无二的。在上面的例子中，`SiftingAppender` 会创建多个 `FileAppender` 实例，每个 `FileAppender` 实例由与 "userid" MDC 键关联的值来标识。每当 "userid" MDC 键被赋予新值时，就会从零开始构建一个新的 `FileAppender` 实例。`SiftingAppender` 会跟踪自己创建的 appender，30 分钟未使用的 appender 会被自动关闭并丢弃。

**VARIABLE EXPORT** It is not enough to have different appender instances; each instance must output to a distinct target resource. To allow such differentiation, within the appender template, the key passed to the discriminator, "userid" in the above example, is exported and becomes a [variable](http://logback.qos.ch/manual/configuration.html#variableSubstitution). Consequently, this variable can be used to differentiate the actual resource used by a given child appender.

**变量导出（VARIABLE EXPORT）** 只有不同的 appender 实例还不够，每个实例还必须输出到不同的目标资源。为了实现这种区分，在 appender 模板内部，传给 discriminator 的键（上例中的 "userid"）会被导出并成为一个[变量](http://logback.qos.ch/manual/configuration.html#variableSubstitution)。于是，这个变量就可以用来区分各个子 appender 实际使用的资源。

Running the `SiftExample` application with the "byUserid.xml" configuration file shown above, will result in two distinct log files, "unknown.log" and "Alice.log".

使用上面所示的 "byUserid.xml" 配置文件运行 `SiftExample` 应用，会得到两个不同的日志文件："unknown.log" 和 "Alice.log"。

**LOCAL-SCOPED VARIABLES** As of version 1.0.12, properties defined in local scope within the configuration file will be available to nested appenders. Moreover, you can [define variables](http://logback.qos.ch/manual/configuration.html#definingProps) or [dynamically compute](http://logback.qos.ch/manual/configuration.html#definingPropsOnTheFly) variables from *within* the the `` element. Combining a variable from parts defined outside and within the `` element is also supported.

**局部作用域变量（LOCAL-SCOPED VARIABLES）** 从 1.0.12 版本开始，在配置文件中以局部作用域定义的属性对嵌套 appender 也可用。此外，你还可以在 `<sift>` 元素*内部*[定义变量](http://logback.qos.ch/manual/configuration.html#definingProps)或[动态计算](http://logback.qos.ch/manual/configuration.html#definingPropsOnTheFly)变量，也支持把在 `<sift>` 元素内外定义的变量组合起来使用。

#### Getting the timeout right

#### 正确设置 timeout

For certain types of applications, it may be difficult to get the timeout parameter right. If the timeout is too small, a nested appender might be removed just to be created anew a few seconds later. This phenomenon is called *trashing*. If the timeout is too long and appenders are created in quick succession, you might run out of resources. Similarly, setting maxAppenderCount too low might cause trashing as well.

对某些类型的应用来说，把 timeout 参数设置得恰到好处可能有些困难。如果 timeout 太小，一个嵌套 appender 可能刚被移除，几秒钟后又得重新创建，这种现象称为 *trashing*（抖动）。如果 timeout 太长，而 appender 又接连不断地被创建，资源就可能耗尽。类似地，把 maxAppenderCount 设置得过低同样可能导致抖动。

In many case, it may be easier to pinpoint a location in your code after which a nested appender is no longer needed. If such a location exists, even approximately, log from that location using the [FINALIZE_SESSION](http://logback.qos.ch/apidocs/ch/qos/logback/classic/ClassicConstants.html#FINALIZE_SESSION_MARKER) marker. Whenever SiftingAppender sees a logging event marked as `FINALIZE_SESSION` it will end-of-life the associated nested appender. Upon reaching its end-of-life, a nested appender will linger for a few seconds to process any late coming events (if any) and then will be closed.

很多情况下，在代码中标定一个"此后不再需要嵌套 appender"的位置可能更容易。如果存在这样一个位置——哪怕是大致的位置——就在该位置使用 [FINALIZE_SESSION](http://logback.qos.ch/apidocs/ch/qos/logback/classic/ClassicConstants.html#FINALIZE_SESSION_MARKER) marker 记录日志。SiftingAppender 只要看到带有 `FINALIZE_SESSION` 标记的日志事件，就会让相关联的嵌套 appender 走到生命周期尽头。到达生命周期尽头后，嵌套 appender 还会停留几秒钟以处理迟到的日志事件（如果有的话），然后被关闭。

```
import org.slf4j.Logger;
import static ch.qos.logback.classic.ClassicConstants.FINALIZE_SESSION_MARKER;

  void job(String jobId) {
   
    MDC.put("jobId", jobId);
    logger.info("Starting job.");

    ... do whather the job needs to do
    
    // will cause the nested appender reach end-of-life. It will
    // linger for a few seconds.
    logger.info(FINALIZE_SESSION_MARKER, "About to end the job");

    try {
      .. perform clean up
    } catch(Exception e);  
      // This log statement will be handled by the lingering appender. 
      // No new appender will be created.
      logger.error("unexpected error while cleaning up", e);
    }
  }
```

### AsyncAppender

### AsyncAppender

AsyncAppender logs [ILoggingEvent](http://logback.qos.ch/apidocs/ch/qos/logback/classic/spi/ILoggingEvent.html)s asynchronously. It acts solely as an event dispatcher and must therefore reference another appender in order to do anything useful.

AsyncAppender 异步地记录 [ILoggingEvent](http://logback.qos.ch/apidocs/ch/qos/logback/classic/spi/ILoggingEvent.html)。它只充当事件分发器，因此必须引用另一个 appender 才能发挥作用。

**LOSSY BY DEFAULT IF 80% FULL** AsyncAppender buffers events in a [BlockingQueue](http://docs.oracle.com/javase/1.5.0/docs/api/java/util/concurrent/BlockingQueue.html). A worker thread created by `AsyncAppender` takes events from the head of the queue, and dispatches them to the single appender attached to `AsyncAppender`. Note that by default, `AsyncAppender` will drop events of level TRACE, DEBUG and INFO if its queue is 80% full. This strategy has an amazingly favorable effect on performance at the cost of event loss.

**队列 80% 满时默认丢事件** AsyncAppender 把事件缓冲在一个 [BlockingQueue](http://docs.oracle.com/javase/1.5.0/docs/api/java/util/concurrent/BlockingQueue.html) 里。`AsyncAppender` 创建的工作线程从队列头部取出事件，分发给挂在 `AsyncAppender` 上的那个唯一 appender。注意，默认情况下，当队列占用达到 80% 时，`AsyncAppender` 会丢弃 TRACE、DEBUG 和 INFO 级别的事件。这一策略以丢失事件为代价，对性能有极佳的提升效果。

**APPLICATION STOP/REDEPLOY** Upon application shutdown or redeploy, `AsyncAppender` must be stopped in order to stop and reclaim the worker thread and to flush the logging events from the queue. This can be achieved by [stopping the LoggerContext](http://logback.qos.ch/manual/configuration.html#stopContext) which will close all appenders, including any `AsyncAppender` instances. `AsyncAppender` will wait for the worker thread to flush up to the timeout specified in maxFlushTime. If you find that queued events are being discarded during close of the `LoggerContext`, you may need to increase the time out. Specifying a value of 0 for maxFlushTime will force the `AsyncAppender` to wait for all queued events to be flushed before returning from the stop method.

**应用停止/重新部署** 在应用关闭或重新部署时，必须停止 `AsyncAppender`，以便停止并回收工作线程，并把队列中的日志事件清空出去。这可以通过[停止 LoggerContext](http://logback.qos.ch/manual/configuration.html#stopContext) 来实现，它会关闭所有 appender，包括所有 `AsyncAppender` 实例。`AsyncAppender` 会等待工作线程清空队列，最长时间为 maxFlushTime 指定的超时值。如果发现 `LoggerContext` 关闭期间队列中的事件被丢弃了，可能需要增大这个超时值。把 maxFlushTime 设为 0 会强制 `AsyncAppender` 等待所有排队的事件都被清空后，才从 stop 方法返回。

**POST SHUTDOWN CLEANUP** Depending on the mode of JVM shutdown, the worker thread processing the queued events can be interrupted causing events to be strandeds in the queue. This generally occurs when the `LoggerContext` is not stopped cleanly or when the JVM terminates outside of the typical control flow. In order to avoid interrupting the worker thread under these conditions, a shutdown hook can be inserted to the JVM runtime that [stops the LoggerContext properly](http://logback.qos.ch/manual/configuration.html#stopContext) after JVM shutdown has been initiated. A shutdown hook may also be the preferred method for cleanly shutting down Logback when other shutdown hooks attempt to log events.

**关闭后的清理** 取决于 JVM 关闭的方式，处理排队事件的工作线程可能被中断，导致事件滞留在队列中。这通常发生在 `LoggerContext` 没有被干净地停止，或者 JVM 在典型控制流之外终止的情况下。为了避免在这些情况下中断工作线程，可以向 JVM 运行时注册一个 shutdown hook，在 JVM 关闭流程启动后[正确地停止 LoggerContext](http://logback.qos.ch/manual/configuration.html#stopContext)。当其他 shutdown hook 也试图记录日志时，使用 shutdown hook 可能是干净地关闭 Logback 的首选方式。

Here is the list of properties admitted by `AsyncAppender:`

下面是 `AsyncAppender` 接受的属性列表：

| Property Name           | Type      | Description                                                  |
| ----------------------- | --------- | ------------------------------------------------------------ |
| **queueSize**           | `int`     | The maximum capacity of the blocking queue. By default, queueSize is set to 256. |
| **discardingThreshold** | `int`     | By default, when the blocking queue has 20% capacity remaining, it will drop events of level TRACE, DEBUG and INFO, keeping only events of level WARN and ERROR. To keep all events, set discardingThreshold to 0. |
| **includeCallerData**   | `boolean` | Extracting caller data can be rather expensive. To improve performance, by default, caller data associated with an event is not extracted when the event added to the event queue. By default, only "cheap" data like the thread name and the [MDC](http://logback.qos.ch/manual/mdc.html) are copied. You can direct this appender to include caller data by setting the includeCallerData property to true. |
| **maxFlushTime**        | `int`     | Depending on the queue depth and latency to the referenced appender, the `AsyncAppender` may take an unacceptable amount of time to fully flush the queue. When the `LoggerContext` is stopped, the `AsyncAppender stop` method waits up to this timeout for the worker thread to complete. Use maxFlushTime to specify a maximum queue flush timeout in milliseconds. Events that cannot be processed within this window are discarded. Semantics of this value are identical to that of [Thread.join(long)](http://docs.oracle.com/javase/7/docs/api/java/lang/Thread.html#join(long)). |
| **neverBlock**          | `boolean` | If `false` (the default) the appender will block on appending to a full queue rather than losing the message. Set to `true` and the appender will just drop the message and will not block your application. |

By default, event queue is configured with a maximum capacity of 256 events. If the queue is filled up, then application threads are blocked from logging new events until the worker thread has had a chance to dispatch one or more events. When the queue is no longer at its maximum capacity, application threads are able to start logging events once again. Asynchronous logging therefore becomes pseudo-synchronous when the appender is operating at or near the capacity of its event buffer. This is not necessarily a bad thing. The appender is designed to allow the application to keep on running, albeit taking slightly more time to log events until the pressure on the appenders buffer eases.

默认情况下，事件队列的最大容量是 256 条事件。如果队列被填满，应用线程再记录新事件时就会被阻塞，直到工作线程有机会分发一个或多个事件。当队列不再处于最大容量时，应用线程又能重新开始记录日志。因此，当 appender 在事件缓冲区满负荷或接近满负荷运行时，异步日志就变成了伪同步。这未必是坏事：appender 的设计意图就是让应用能够继续运行，只是在 appender 缓冲区的压力缓解之前，记录日志会稍微多花一点时间。

Optimally tuning the size of the appenders event queue for maximum application throughput depends upon several factors. Any or all of the following factors are likely to cause pseudo-synchronous behavior to be exhibited:

要把 appender 事件队列的大小调整到使应用吞吐量最大，需要考虑多个因素。以下因素中的一个或多个都可能导致出现伪同步行为：

- Large numbers of application threads
- Large numbers of logging events per application call
- Large amounts of data per logging event
- High latency of child appenders

- 应用线程数量很多
- 每次应用调用产生的日志事件数量很大
- 单条日志事件的数据量很大
- 子 appender 的延迟很高

To keep things moving, increasing the size of the queue will generally help, at the expense of heap available to the application.

要让事情保持顺畅，增大队列通常会有帮助，但代价是应用可用的堆空间减少。

**LOSSY BEHAVIOR** In light of the discussion above and in order to reduce blocking, by default, when less than 20% of the queue capacity remains, `AsyncAppender` will drop events of level TRACE, DEBUG and INFO keeping only events of level WARN and ERROR. This strategy ensures non-blocking handling of logging events (hence excellent performance) at the cost loosing events of level TRACE, DEBUG and INFO when the queue has less than 20% capacity. Event loss can be prevented by setting the discardingThreshold property to 0 (zero).

**有损行为** 鉴于上面的讨论，也为了减少阻塞，默认情况下，当队列剩余容量不足 20% 时，`AsyncAppender` 会丢弃 TRACE、DEBUG 和 INFO 级别的事件，只保留 WARN 和 ERROR 级别的事件。这一策略保证了日志事件处理的非阻塞性（因而性能出色），代价是当队列剩余容量不足 20% 时会丢失 TRACE、DEBUG 和 INFO 级别的事件。把 discardingThreshold 属性设置为 0 可以避免事件丢失。

Example: `AsyncAppender` configuration (logback-examples/src/main/resources/chapters/appenders/conc/logback-async.xml)

示例：`AsyncAppender` 配置

View as .groovy

```
<configuration>
  <appender name="FILE" class="ch.qos.logback.core.FileAppender">
    <file>myapp.log</file>
    <encoder>
      <pattern>%logger{35} - %msg%n</pattern>
    </encoder>
  </appender>

  <appender name="ASYNC" class="ch.qos.logback.classic.AsyncAppender">
    <appender-ref ref="FILE" />
  </appender>

  <root level="DEBUG">
    <appender-ref ref="ASYNC" />
  </root>
</configuration>
```

### Writing your own Appender

### 编写自己的 Appender

You can easily write your appender by subclassing `AppenderBase`. It handles support for filters, status messages and other functionality shared by most appenders. The derived class only needs to implement one method, namely `append(Object eventObject)`.

通过继承 `AppenderBase` 可以轻松编写自己的 appender。它已经处理了过滤器、状态消息以及大多数 appender 共有的其他功能。子类只需要实现一个方法，即 `append(Object eventObject)`。

The `CountingConsoleAppender`, which we list next, appends a limited number of incoming events on the console. It shuts down after the limit is reached. It uses a `PatternLayoutEncoder` to format the events and accepts a parameter named `limit`. Therefore, a few more methods beyond `append(Object eventObject)` are needed. As shown below, these parameters are handles auto-magically by logback's various configuration mechanisms.

下面列出的 `CountingConsoleAppender` 只在控制台上输出有限数量的到达事件，达到上限后就停止。它使用 `PatternLayoutEncoder` 格式化事件，并接受一个名为 `limit` 的参数。因此，除了 `append(Object eventObject)` 之外还需要一些别的方法。如下所示，这些参数由 logback 的各种配置机制自动地"施魔法"般处理。

*Example 4.: `CountingConsoleAppender` (logback-examples/src/main/java/chapters/appenders/CountingConsoleAppender.java)*

*示例：`CountingConsoleAppender`*

The `start()` method checks for the presence of a `PatternLayoutEncoder`. In case the encoder is not set, the appender fails to start and emits an error message.

`start()` 方法检查是否设置了 `PatternLayoutEncoder`。如果没有设置 encoder，appender 将启动失败并发出错误消息。

This custom appender illustrates two points:

这个自定义 appender 说明了两点：

- All properties that follow the setter/getter JavaBeans conventions are handled transparently by logback configurators. The `start()` method, which is called automatically during logback configuration, has the responsibility of verifying that the various properties of the appender are set and are coherent.
- The `AppenderBase.doAppend()` method invokes the append() method of its derived classes. Actual output operations occur in the `append`() method. In particular, it is in this method that appenders format events by invoking their layouts.

- 所有遵循 JavaBeans setter/getter 约定的属性都会被 logback 的配置器透明地处理。`start()` 方法会在 logback 配置过程中被自动调用，它负责校验 appender 的各个属性是否已设置并且相互一致。
- `AppenderBase.doAppend()` 方法会调用其子类的 append() 方法。真正的输出操作发生在 `append()` 方法中。特别地，appender 正是在这个方法里通过调用自己的 layout 来格式化事件。

The [`CountingConsoleAppender`](http://logback.qos.ch/xref/chapters/appenders/CountingConsoleAppender.html) can be configured like any other appender. See sample configuration file *logback-examples/src/main/resources/chapters/appenders/countingConsole.xml* for an example.

[`CountingConsoleAppender`](http://logback.qos.ch/xref/chapters/appenders/CountingConsoleAppender.html) 可以像其他任何 appender 一样配置。示例见配置文件 *logback-examples/src/main/resources/chapters/appenders/countingConsole.xml*。

## Logback Access

## Logback Access

Most of the appenders found in logback-classic have their equivalent in logback-access. These work essentially in the same way as their logback-classic counterparts. In the next section, we will cover their use.

logback-classic 中的大多数 appender 在 logback-access 中都有对应的版本。它们的工作方式与 logback-classic 中的对应版本基本相同。下一节将介绍它们的用法。

### SocketAppender and SSLSocketAppender

### SocketAppender 和 SSLSocketAppender

The [`SocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/SocketAppender.html) is designed to log to a remote entity by transmitting serialized `AccessEvent` objects over the wire. Remote logging is non-intrusive as far as the access event is concerned. On the receiving end after deserialization, the event can be logged as if it were generated locally.

[`SocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/SocketAppender.html) 的设计目标是把序列化后的 `AccessEvent` 对象通过网络传输，写到远端实体。就访问事件而言，远程日志是非侵入式的：在接收端反序列化之后，事件可以像本地生成的一样被记录。

The [`SSLSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/SSLSocketAppender.html) extends the basic `SocketAppender` allowing logging to a remote entity over the Secure Sockets Layer (SSL).

[`SSLSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/SSLSocketAppender.html) 在基本 `SocketAppender` 的基础上进行扩展，允许通过安全套接字层（SSL）向远端实体写日志。

The properties of access' `SocketAppender` are the same as those available for classic's `SocketAppender`.

access 的 `SocketAppender` 拥有的属性与 classic 的 `SocketAppender` 相同。

### ServerSocketAppender and SSLServerSocketAppender

### ServerSocketAppender 和 SSLServerSocketAppender

Like `SocketAppender`, the [`ServerSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/server/ServerSocketAppender.html) is designed to log to a remote entity by transmitting serialized `AccessEvent` objects over the wire. However, when using `ServerSocketAppender` the appender acts as a server, passively listening on a TCP socket awaiting inbound connections from interested clients. Logging events delivered to the appender are distributed to all connected clients.

与 `SocketAppender` 类似，[`ServerSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/server/ServerSocketAppender.html) 的设计目标也是把序列化后的 `AccessEvent` 对象通过网络传输写到远端实体。不过，使用 `ServerSocketAppender` 时 appender 充当服务器，被动地在 TCP socket 上监听，等待感兴趣的客户端发起入站连接。送达 appender 的日志事件会被分发给所有已连接的客户端。

The [`SSLSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/server/SSLServerSocketAppender.html) extends the basic `ServerSocketAppender` allowing logging to a remote entity over the Secure Sockets Layer (SSL).

[`SSLSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/server/SSLServerSocketAppender.html) 在基本 `ServerSocketAppender` 的基础上进行扩展，允许通过安全套接字层（SSL）向远端实体写日志。

The properties of access' `ServerSocketAppender` are the same as those available for classic's `ServerSocketAppender`.

access 的 `ServerSocketAppender` 拥有的属性与 classic 的 `ServerSocketAppender` 相同。

### SMTPAppender

### SMTPAppender

Access' [`SMTPAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/SMTPAppender.html) works in the same way as its Classic counterpart. However, the evaluator option is rather different. By default, a `URLEvaluator` object is used by `SMTPAppender`. This evaluator contains a list of URLs that are checked against the current request's URL. When one of the pages given to the `URLEvaluator` is requested, `SMTPAppender` sends an email.

access 的 [`SMTPAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/SMTPAppender.html) 工作方式与 classic 版本相同，但 evaluator 选项差别较大。默认情况下，`SMTPAppender` 使用一个 `URLEvaluator` 对象。这个评估器维护一个 URL 列表，会拿当前请求的 URL 与之比对。当请求的页面出现在提供给 `URLEvaluator` 的页面之中时，`SMTPAppender` 就会发送邮件。

Here is a sample configuration of a `SMTPAppender` in the access environment.

下面是 access 环境中 `SMTPAppender` 的示例配置。

Example: `SMTPAppender` configuration (logback-examples/src/main/resources/chapters/appenders/conf/access/logback-smtp.xml)

示例：`SMTPAppender` 配置

```
<appender name="SMTP"
  class="ch.qos.logback.access.net.SMTPAppender">
  <layout class="ch.qos.logback.access.html.HTMLLayout">
    <pattern>%h%l%u%t%r%s%b</pattern>
  </layout>
    
  <Evaluator class="ch.qos.logback.access.net.URLEvaluator">
    <URL>url1.jsp</URL>
    <URL>directory/url2.html</URL>
  </Evaluator>
  <from>sender_email@host.com</from>
  <smtpHost>mail.domain.com</smtpHost>
  <to>recipient_email@host.com</to>
</appender>
```

This way of triggering the email lets users select pages that are important steps in a specific process, for example. When such a page is accessed, the email is sent with the pages that were accessed previously, and any information the user wants to be included in the email.

这种触发邮件的方式可以让用户挑选出某个流程中比较关键步骤对应的页面。例如，当这类页面被访问时，就会发出一封邮件，其中包含之前访问过的页面，以及用户希望包含在邮件中的其他信息。

### DBAppender

### DBAppender

[`DBAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/db/DBAppender.html) is used to insert the access events into a database.

[`DBAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/db/DBAppender.html) 用于把访问事件插入数据库。

Two tables are used by `DBAppender`: *access_event* and *access_event_header*. They both must exist before `DBAppender` can be used. Logback ships with SQL scripts that will create the tables. They can be found in the *logback-access/src/main/java/ch/qos/logback/access/db/script* directory. There is a specific script for each of the most popular database systems. If the script for your particular type of database system is missing, it should be quite easy to write one, taking as example one of the existing scripts. You are encouraged to contribute such missing scripts back to the project.

`DBAppender` 使用两张表：*access_event* 和 *access_event_header*。在使用 `DBAppender` 之前，这两张表必须已经存在。Logback 自带了创建这些表的 SQL 脚本，位于 *logback-access/src/main/java/ch/qos/logback/access/db/script* 目录下，每种主流数据库系统都有对应的脚本。如果缺少针对你的数据库系统的脚本，参照现有脚本编写一个应该不难。我们鼓励你把缺失的脚本回馈给项目。

The *access_event* table's fields are described below:

*access_event* 表的字段如下：

| Field          | Type      | Description                                                  |
| -------------- | --------- | ------------------------------------------------------------ |
| **timestamp**  | `big int` | The timestamp that was valid at the access event's creation. |
| **requestURI** | `varchar` | The URI that was requested.                                  |
| **requestURL** | `varchar` | The URL that was requested. This is a string composed of the request method, the request URI and the request protocol. |
| **remoteHost** | `varchar` | The name of the remote host.                                 |
| **remoteUser** | `varchar` | The name of the remote user.                                 |
| **remoteAddr** | `varchar` | The remote IP address.                                       |
| **protocol**   | `varchar` | The request protocol, like *HTTP* or *HTTPS*.                |
| **method**     | `varchar` | The request method, usually *GET* or *POST*.                 |
| **serverName** | `varchar` | The name of the server that issued the request.              |
| **event_id**   | `int`     | The database id of the access event.                         |

The *access_event_header* table contains the header of each request. The information is organised as shown below:

*access_event_header* 表存放每个请求的头信息，组织方式如下：

| Field            | Type      | Description                                                  |
| ---------------- | --------- | ------------------------------------------------------------ |
| **event_id**     | `int`     | The database id of the corresponding access event.           |
| **header_key**   | `varchar` | The header name, for example *User-Agent*.                   |
| **header_value** | `varchar` | The header value, for example *Mozilla/5.0 (Windows; U; Windows NT 5.1; fr; rv:1.8.1) Gecko/20061010 Firefox/2.0* |

All properties of classic's `DBAppender` are available in access's `DBAppender`. The latter offers one more option, described below.

| Property Name           | Type      | Description                                                  |
| ----------------------- | --------- | ------------------------------------------------------------ |
| ***\*insertHeaders\**** | `boolean` | Tells the `DBAppender` to populate the database with the header information of all incoming requests. |

classic 的 `DBAppender` 的所有属性在 access 的 `DBAppender` 中都可用，后者还多提供了一个选项 `insertHeaders`（`boolean` 类型）：告诉 `DBAppender` 把所有进入请求的头信息一并写入数据库。

Here is a sample configuration that uses `DBAppender`.

下面是一个使用 `DBAppender` 的示例配置。

Example: DBAppender configuration *(logback-examples/src/main/resources/chapters/appenders/conf/access/logback-DB.xml)*

示例：DBAppender 配置

```
<configuration>

  <appender name="DB" class="ch.qos.logback.access.db.DBAppender">
    <connectionSource class="ch.qos.logback.core.db.DriverManagerConnectionSource">
      <driverClass>com.mysql.jdbc.Driver</driverClass>
      <url>jdbc:mysql://localhost:3306/logbackdb</url>
      <user>logback</user>
      <password>logback</password>
    </connectionSource>
    <insertHeaders>true</insertHeaders>
  </appender>

  <appender-ref ref="DB" />
</configuration>
```

### SiftingAppender

### SiftingAppender

The SiftingAppender in logback-access is quite similar to its logback-classic counterpart. The main difference is that in logback-access the default discriminator, namely [AccessEventDiscriminator](http://logback.qos.ch/xref/ch/qos/logback/access/sift/AccessEventDiscriminator.html), is not MDC based. As its name suggests, AccessEventDiscriminator, uses a designated field in AccessEvent as the basis for selecting a nested appender. If the value of the designated field is null, then the value specified in the defaultValue property is used.

logback-access 中的 SiftingAppender 与 logback-classic 中的版本非常相似。主要区别在于，logback-access 中默认的 discriminator，即 [AccessEventDiscriminator](http://logback.qos.ch/xref/ch/qos/logback/access/sift/AccessEventDiscriminator.html)，不是基于 MDC 的。顾名思义，AccessEventDiscriminator 使用 AccessEvent 中的指定字段作为选择嵌套 appender 的依据；如果指定字段的值为 null，则使用 defaultValue 属性指定的值。

The designated AccessEvent field can be one of COOKIE, REQUEST_ATTRIBUTE, SESSION_ATTRIBUTE, REMOTE_ADDRESS, LOCAL_PORT, REQUEST_URI. Note that the first three fields require that the AdditionalKey property also be specified.

指定的 AccessEvent 字段可以是 COOKIE、REQUEST_ATTRIBUTE、SESSION_ATTRIBUTE、REMOTE_ADDRESS、LOCAL_PORT、REQUEST_URI 之一。注意，前三个字段还要求同时指定 AdditionalKey 属性。

Below is an example configuration file.

下面是一个示例配置文件。

Example: SiftingAppender configuration (logback-examples/src/main/resources/chapters/appenders/conf/sift/access-siftingFile.xml)

示例：SiftingAppender 配置

```
<configuration>
  <appender name="SIFTING" class="ch.qos.logback.access.sift.SiftingAppender">
    <Discriminator class="ch.qos.logback.access.sift.AccessEventDiscriminator">
      <Key>id</Key>
      <FieldName>SESSION_ATTRIBUTE</FieldName>
      <AdditionalKey>username</AdditionalKey>
      <defaultValue>NA</defaultValue>
    </Discriminator>
    <sift>
       <appender name="ch.qos.logback:logback-site:jar:1.3.0-alpha5" class="ch.qos.logback.core.FileAppender">
        <file>byUser/ch.qos.logback:logback-site:jar:1.3.0-alpha5.log</file>
        <layout class="ch.qos.logback.access.PatternLayout">
          <pattern>%h %l %u %t \"%r\" %s %b</pattern>
        </layout>
      </appender>
    </sift>
  </appender>
  <appender-ref ref="SIFTING" />
</configuration>
```

In the above configuration file, a `SiftingAppender` nests `FileAppender` instances. The key "id" is designated as a variable which will be available to the nested `FileAppender` instances. The default discriminator, namely `AccessEventDiscriminator`, will search for a "username" session attribute in each `AccessEvent`. If no such attribute is available, then the default value "NA" will be used. Thus, assuming the session attribute named "username" contains the username of each logged on user, there will be a log file under the *byUser/* folder (of the current folder) named after each user containing the access logs for that user.

在上面的配置文件中，`SiftingAppender` 嵌套了若干 `FileAppender` 实例。键 "id" 被指定为一个变量，可供嵌套的 `FileAppender` 实例使用。默认的 discriminator（即 `AccessEventDiscriminator`）会在每个 `AccessEvent` 中查找名为 "username" 的会话属性；如果没有这个属性，就使用默认值 "NA"。因此，假设名为 "username" 的会话属性中存放了每个登录用户的用户名，那么在（当前目录下的）*byUser/* 文件夹中就会以每个用户的用户名命名生成一个日志文件，其中包含该用户的访问日志。

<http://logback.qos.ch/manual/appenders.html>
