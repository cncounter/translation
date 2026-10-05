# Chapter 13: Migration from log4j

# 第13章: 从 log4j 迁移

*The more things change, the more they remain the same.*

*万变之中，不变者常在。*

—ALPHONSE KARR, *Les Guêpes*

——阿尔丰斯·卡尔，《黄蜂》

This chapter deals with the topic of migrating custom log4j components such as appenders or layouts to logback-classic.

本章讨论如何把自定义的 log4j 组件（如 appender 或 layout）迁移到 logback-classic。

Software which merely invokes log4j client API, that is the `Logger` or `Category` classes in `org.apache.log4j` package, can be automatically migrated to use SLF4J via the [SLF4J migrator tool](http://www.slf4j.org/migrator.html). To migrate *log4j.property* files into its logback equivalent, you can use the [log4j.properties translator](http://logback.qos.ch/translator/).

只是调用 log4j 客户端 API（即 `org.apache.log4j` 包中的 `Logger` 或 `Category` 类）的软件，可以通过 [SLF4J 迁移工具](http://www.slf4j.org/migrator.html)自动迁移为使用 SLF4J。要把 *log4j.property* 文件迁移成等价的 logback 配置，可以使用 [log4j.properties 翻译器](http://logback.qos.ch/translator/)。

From a broader perspective, log4j and logback-classic are closely related. The core components, such as loggers, appenders and layouts exist in both frameworks and serve identical purposes. Similarly, the most important internal data-structure, namely `LoggingEvent`, exists in both frameworks with rather similar but non-identical implementations. Most notably, in logback-classic `LoggingEvent` implements the `ILoggingEvent` interface. Most of the changes required in migrating log4j components to logback-classic are related to differences in implementation of the `LoggingEvent` class. Rest assured, these differences are rather limited. If in spite of your best efforts you are unable to migrate any given log4j component to logback-classic, do post a question on the [logback-dev mailing list](http://logback.qos.ch/mailinglist.html). A logback developer should be able to provide guidance.

从更宏观的角度看，log4j 与 logback-classic 关系密切。logger、appender、layout 这些核心组件在两个框架中都存在，用途也完全相同。类似地，最重要的内部数据结构 `LoggingEvent` 在两个框架中也都有，实现相当相似但不完全相同。最显著的区别是，logback-classic 中的 `LoggingEvent` 实现了 `ILoggingEvent` 接口。把 log4j 组件迁移到 logback-classic 所需的大多数改动，都与 `LoggingEvent` 类实现的差异有关。放心，这些差异相当有限。如果你竭尽全力仍无法把某个 log4j 组件迁移到 logback-classic，请在 [logback-dev 邮件列表](http://logback.qos.ch/mailinglist.html)上提问，logback 的开发者应该能提供指导。

### Migrating a log4j layout

### 迁移 log4j layout

Let us begin by migrating a hypothetical and trivially simple log4j layout named [TrivialLog4jLayout](http://logback.qos.ch/xref/chapters/migrationFromLog4j/TrivialLog4jLayout.html) which returns the message contained in a logging events as the formatted message. Here is the code.

我们先来迁移一个假想的、极其简单的 log4j layout——[TrivialLog4jLayout](http://logback.qos.ch/xref/chapters/migrationFromLog4j/TrivialLog4jLayout.html)，它把日志事件中的消息作为格式化后的消息返回。代码如下：

```
package chapters.migrationFromLog4j;

import org.apache.log4j.Layout;
import org.apache.log4j.spi.LoggingEvent;

public class TrivialLog4jLayout extends Layout {

  public void activateOptions() {
    // there are no options to activate
  }

  public String format(LoggingEvent loggingEvent) {
    return loggingEvent.getRenderedMessage();
  }

  public boolean ignoresThrowable() {
    return true;
  }
}
```

The logback-classic equivalent named [TrivialLogbackLayout](http://logback.qos.ch/xref/chapters/migrationFromLog4j/TrivialLogbackLayout.html) would be

logback-classic 中的等价实现名为 [TrivialLogbackLayout](http://logback.qos.ch/xref/chapters/migrationFromLog4j/TrivialLogbackLayout.html)：

```
package chapters.migrationFromLog4j;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.LayoutBase;

public class TrivialLogbackLayout extends LayoutBase<ILoggingEvent> {

  public String doLayout(ILoggingEvent loggingEvent) {
    return loggingEvent.getMessage();
  }
}    
```

As you can see, in a logback-classic layout, the formatting method is named `doLayout` instead of `format`() in log4j. The `ignoresThrowable`() method is not needed and has no equivalent in logback-classic. Note that a logback-classic layout must extend the `LayoutBase` class.

可以看到，在 logback-classic 的 layout 中，格式化方法名为 `doLayout`，而 log4j 中是 `format`()。`ignoresThrowable`() 方法不再需要，logback-classic 中也没有等价物。注意，logback-classic 的 layout 必须继承 `LayoutBase` 类。

The `activateOptions`() method merits further discussion. In log4j, a layout will have its `activateOptions`() method invoked by log4j configurators, that is `PropertyConfigurator` or `DOMConfigurator` just after all the options of the layout have been set. Thus, the layout will have an opportunity to check that its options are coherent and if so, proceed to fully initialize itself.

`activateOptions`() 方法值得进一步讨论。在 log4j 中，layout 的 `activateOptions`() 方法会被 log4j 的配置器（即 `PropertyConfigurator` 或 `DOMConfigurator`）在设置完 layout 的所有选项之后调用。这样，layout 就有机会检查自己的选项是否一致，如果一致，就完成自身的完整初始化。

In logback-classic, layouts must implement the [LifeCycle](http://logback.qos.ch/xref/ch/qos/logback/core/spi/LifeCycle.html) interface which includes a method called `start`(). The `start`() method is the equivalent of log4j's `activateOptions`() method.

在 logback-classic 中，layout 必须实现 [LifeCycle](http://logback.qos.ch/xref/ch/qos/logback/core/spi/LifeCycle.html) 接口，该接口包含一个名为 `start`() 的方法。`start`() 方法就相当于 log4j 的 `activateOptions`() 方法。

### Migrating a log4j appender

### 迁移 log4j appender

Migrating an appender is quite similar to migrating a layout. Here is a trivially simple appender called [TrivialLog4jAppender](http://logback.qos.ch/xref/chapters/migrationFromLog4j/TrivialLog4jAppender.html) which writes on the console the string returned by its layout.

迁移 appender 与迁移 layout 相当类似。下面是一个极其简单的 appender——[TrivialLog4jAppender](http://logback.qos.ch/xref/chapters/migrationFromLog4j/TrivialLog4jAppender.html)，它把 layout 返回的字符串写到控制台。

```
package chapters.migrationFromLog4j;

import org.apache.log4j.AppenderSkeleton;
import org.apache.log4j.spi.LoggingEvent;


public class TrivialLog4jAppender extends AppenderSkeleton {

  protected void append(LoggingEvent loggingevent) {
    String s = this.layout.format(loggingevent);
    System.out.println(s);
  }

  public void close() {
    // nothing to do
  }

  public boolean requiresLayout() {
    return true;
  }
}
```

The logback-classic equivalent named [TrivialLogbackAppender](http://logback.qos.ch/xref/chapters/migrationFromLog4j/TrivialLogbackAppender.html) would be written as

logback-classic 中的等价实现名为 [TrivialLogbackAppender](http://logback.qos.ch/xref/chapters/migrationFromLog4j/TrivialLogbackAppender.html)，写法如下：

```
package chapters.migrationFromLog4j;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;

public class TrivialLogbackAppender extends AppenderBase<ILoggingEvent> {

  @Override
  public void start() {
    if (this.layout == null) {
      addError("No layout set for the appender named [" + name + "].");
      return;
    }
    super.start();
  }

  @Override
  protected void append(ILoggingEvent loggingevent) {
    // note that AppenderBase.doAppend will invoke this method only if
    // this appender was successfully started.
    
    String s = this.layout.doLayout(loggingevent);
    System.out.println(s);
  }
}
```

Comparing the two classes, you should notice that the contents of the `append`() method remains unchanged. The `requiresLayout` method is not used in logback and can be removed. In logback, the `stop`() method is the equivalent of log4j's `close`() method. However, `AppenderBase` in logback-classic, contains a nop implementation for `stop` which is sufficient for the purposes of this trivial appender.

对比这两个类，你应该注意到 `append`() 方法的内容保持不变。`requiresLayout` 方法在 logback 中不再使用，可以删掉。在 logback 中，`stop`() 方法相当于 log4j 的 `close`() 方法。不过，logback-classic 的 `AppenderBase` 已经为 `stop` 提供了 nop 实现，对这个简单的 appender 来说已经够用了。



<http://logback.qos.ch/manual/migrationFromLog4j.html>
