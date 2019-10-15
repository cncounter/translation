# Chapter 13: Migration from log4j

*The more things change, the more they remain the same.*

—ALPHONSE KARR, *Les Guêpes*

This chapter deals with the topic of migrating custom log4j components such as appenders or layouts to logback-classic.

Software which merely invokes log4j client API, that is the `Logger` or `Category` classes in `org.apache.log4j` package, can be automatically migrated to use SLF4J via the [SLF4J migrator tool](http://www.slf4j.org/migrator.html). To migrate *log4j.property* files into its logback equivalent, you can use the [log4j.properties translator](http://logback.qos.ch/translator/).

From a broader perspective, log4j and logback-classic are closely related. The core components, such as loggers, appenders and layouts exist in both frameworks and serve identical purposes. Similarly, the most important internal data-structure, namely `LoggingEvent`, exists in both frameworks with rather similar but non-identical implementations. Most notably, in logback-classic `LoggingEvent` implements the `ILoggingEvent` interface. Most of the changes required in migrating log4j components to logback-classic are related to differences in implementation of the `LoggingEvent` class. Rest assured, these differences are rather limited. If in spite of your best efforts you are unable to migrate any given log4j component to logback-classic, do post a question on the [logback-dev mailing list](http://logback.qos.ch/mailinglist.html). A logback developer should be able to provide guidance.

### Migrating a log4j layout

Let us begin by migrating a hypothetical and trivially simple log4j layout named [TrivialLog4jLayout](http://logback.qos.ch/xref/chapters/migrationFromLog4j/TrivialLog4jLayout.html) which returns the message contained in a logging events as the formatted message. Here is the code.

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

The `activateOptions`() method merits further discussion. In log4j, a layout will have its `activateOptions`() method invoked by log4j configurators, that is `PropertyConfigurator` or `DOMConfigurator` just after all the options of the layout have been set. Thus, the layout will have an opportunity to check that its options are coherent and if so, proceed to fully initialize itself.

In logback-classic, layouts must implement the [LifeCycle](http://logback.qos.ch/xref/ch/qos/logback/core/spi/LifeCycle.html) interface which includes a method called `start`(). The `start`() method is the equivalent of log4j's `activateOptions`() method.

### Migrating a log4j appender

Migrating an appender is quite similar to migrating a layout. Here is a trivially simple appender called [TrivialLog4jAppender](http://logback.qos.ch/xref/chapters/migrationFromLog4j/TrivialLog4jAppender.html) which writes on the console the string returned by its layout.

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



<http://logback.qos.ch/manual/migrationFromLog4j.html>