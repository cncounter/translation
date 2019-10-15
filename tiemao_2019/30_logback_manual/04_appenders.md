# Chapter 4: Appenders

*There is so much to tell about the Western country in that day that it is hard to know where to start. One thing sets off a hundred others. The problem is to decide which one to tell first.*

—JOHN STEINBECK, *East of Eden*

In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](http://logback.qos.ch/setup.html) for further details.

## What is an Appender?

Logback delegates the task of writing a logging event to components called appenders. Appenders must implement the [`ch.qos.logback.core.Appender`](http://logback.qos.ch/xref/ch/qos/logback/core/Appender.html) interface. The salient methods of this interface are summarized below:

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

Appenders are named entities. This ensures that they can be referenced by name, a quality confirmed to be instrumental in configuration scripts. The `Appender` interface extends the `FilterAttachable` interface. It follows that one or more filters can be attached to an appender instance. Filters are discussed in detail in a subsequent chapter.

Appenders are ultimately responsible for outputting logging events. However, they may delegate the actual formatting of the event to a `Layout` or to an `Encoder` object. Each layout/encoder is associated with one and only one appender, referred to as the owning appender. Some appenders have a built-in or fixed event format. Consequently, they do not require nor have a layout/encoder. For example, the `SocketAppender` simply serializes logging events before transmitting them over the wire.

## AppenderBase

The [`ch.qos.logback.core.AppenderBase`](http://logback.qos.ch/xref/ch/qos/logback/core/AppenderBase.html) class is an abstract class implementing the `Appender` interface. It provides basic functionality shared by all appenders, such as methods for getting or setting their name, their activation status, their layout and their filters. It is the super-class of all appenders shipped with logback. Although an abstract class, `AppenderBase` actually implements the `doAppend()` method in the `Append` interface. Perhaps the clearest way to discuss `AppenderBase` class is by presenting an excerpt of actual source code.

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

Since such synchronization is not always appropriate, logback ships with [`ch.qos.logback.core.UnsynchronizedAppenderBase`](http://logback.qos.ch/xref/ch/qos/logback/core/UnsynchronizedAppenderBase.html) which is very similar to the [`AppenderBase`](http://logback.qos.ch/xref/ch/qos/logback/core/AppenderBase.html) class. For the sake of conciseness, we will be discussing `UnsynchronizedAppenderBase` in the remainder of this document.

The first thing the `doAppend()` method does is to check whether the guard is set to true. If it is, it immediately exits. If the guard is not set, it is set to true at the next statement. The guard ensures that the `doAppend()` method will not recursively call itself. Just imagine that a component, called somewhere beyond the `append()` method, wants to log something. Its call could be directed to the very same appender that just called it resulting in an infinite loop and a stack overflow.

In the following statement we check whether the `started` field is true. If it is not, `doAppend()` will send a warning message and return. In other words, once an appender is closed, it is impossible to write to it. `Appender` objects implement the `LifeCycle` interface, which implies that they implement `start()`, `stop()` and `isStarted()` methods. After setting all the properties of an appender, Joran, logback's configuration framework, calls the `start()` method to signal the appender to activate its properties. Depending on its kind, an appender may fail to start if certain properties are missing or because of interference between various properties. For example, given that file creation depends on truncation mode, `FileAppender` cannot act on the value of its `File` option until the value of the Append option is also known with certainty. The explicit activation step ensures that an appender acts on its properties *after* their values become known.

If the appender could not be started or if it has been stopped, a warning message will be issued through logback's internal status management system. After several attempts, in order to avoid flooding the internal status system with copies of the same warning message, the `doAppend()` method will stop issuing these warnings.

The next `if` statement checks the result of the attached filters. Depending on the decision resulting from the filter chain, events can be denied or explicitly accepted. In the absence of a decision by the filter chain, events are accepted by default.

The `doAppend()` method then invokes the derived classes' implementation of the `append()` method. This method does the actual work of appending the event to the appropriate device.

Finally, the guard is released so as to allow a subsequent invocation of the `doAppend()` method.

For the remainder of this manual, we reserve the term "option" or alternatively "property" for any attribute that is inferred dynamically using JavaBeans introspection through setter and getter methods.

# Logback-core

Logback-core lays the foundation upon which the other logback modules are built. In general, the components in logback-core require some, albeit minimal, customization. However, in the next few sections, we describe several appenders which are ready for use out of the box.

## OutputStreamAppender

[`OutputStreamAppender`](http://logback.qos.ch/xref/ch/qos/logback/core/OutputStreamAppender.html) appends events to a `java.io.OutputStream`. This class provides basic services that other appenders build upon. Users do not usually instantiate `OutputStreamAppender` objects directly, since in general the `java.io.OutputStream` type cannot be conveniently mapped to a string, as there is no way to specify the target `OutputStream` object in a configuration script. Simply put, you cannot configure a `OutputStreamAppender` from a configuration file. However, this does not mean that `OutputStreamAppender` lacks configurable properties. These properties are described next.

| Property Name      | Type                                                         | Description                                                  |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **encoder**        | [`Encoder`](http://logback.qos.ch/xref/ch/qos/logback/core/encoder/Encoder.html) | Determines the manner in which an event is written to the underlying `OutputStreamAppender`. Encoders are described in a [dedicated chapter](http://logback.qos.ch/manual/encoders.html). |
| **immediateFlush** | `boolean`                                                    | The default value for immediateFlush is 'true'. Immediate flushing of the output stream ensures that logging events are immediately written out and will not be lost in case your application exits without properly closing appenders. On the other hand, setting this property to 'false' is likely to quadruple (your mileage may vary) logging throughput. Again, if immediateFlush is set to 'false' and if appenders are not closed properly when your application exits, then logging events not yet written to disk may be lost. |

The `OutputStreamAppender` is the super-class of three other appenders, namely `ConsoleAppender`, `FileAppender` which in turn is the super class of `RollingFileAppender`. The next figure illustrates the class diagram for `OutputStreamAppender` and its subclasses.

![A UML diagram showing OutputStreamAppender and sub-classes](http://logback.qos.ch/manual/images/chapters/appenders/appenderClassDiagram.jpg)

## ConsoleAppender

The [`ConsoleAppender`](http://logback.qos.ch/xref/ch/qos/logback/core/ConsoleAppender.html), as the name indicates, appends on the console, or more precisely on *System.out* or *System.err*, the former being the default target. `ConsoleAppender` formats events with the help of an encoder specified by the user. Encoders will be discussed in a subsequent chapter. Both *System.out* and *System.err* are of type `java.io.PrintStream`. Consequently, they are wrapped inside an `OutputStreamWriter` which buffers I/O operations.

| Property Name | Type                                                         | Description                                                  |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **encoder**   | [`Encoder`](http://logback.qos.ch/xref/ch/qos/logback/core/encoder/Encoder.html) | See `OutputStreamAppender` properties.                       |
| **target**    | `String`                                                     | One of the String values *System.out* or *System.err*. The default target is *System.out*. |
| **withJansi** | `boolean`                                                    | By the default withJansi property is set to `false`. Setting withJansi to `true` activates the [Jansi](http://jansi.fusesource.org/) library which provides support for ANSI color codes on Windows machines. On a Windows host, if this property is set to true, then you should put "org.fusesource.jansi:jansi:1.17" on the class path. Note that Unix-based operating systems such as Linux and Mac OS X support ANSI color codes by default.Under the Eclipse IDE, you might want to try the [ANSI in Eclipse Console](http://www.mihai-nita.net/eclipse/) plugin. |

Here is a sample configuration that uses `ConsoleAppender`.

Example: ConsoleAppender configuration (logback-examples/src/main/resources/chapters/appenders/conf/logback-Console.xml)

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

java [chapters.appenders.ConfigurationTester](http://logback.qos.ch/xref/chapters/appenders/ConfigurationTester.html) src/main/java/chapters/appenders/conf/logback-Console.xml

## FileAppender

The [`FileAppender`](http://logback.qos.ch/xref/ch/qos/logback/core/FileAppender.html), a subclass of `OutputStreamAppender`, appends log events into a file. The target file is specified by the File option. If the file already exists, it is either appended to, or truncated depending on the value of the append property.

| Property Name | Type                                                         | Description                                                  |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **append**    | `boolean`                                                    | If true, events are appended at the end of an existing file. Otherwise, if append is false, any existing file is truncated. The append option is set to true by default. |
| **encoder**   | [`Encoder`](http://logback.qos.ch/xref/ch/qos/logback/core/encoder/Encoder.html) | See `OutputStreamAppender` properties.                       |
| **file**      | `String`                                                     | The name of the file to write to. If the file does not exist, it is created. On the MS Windows platform users frequently forget to escape back slashes. For example, the value *c:\temp\test.log* is not likely to be interpreted properly as *'\t'* is an escape sequence interpreted as a single tab character *(\u0009)*. Correct values can be specified as *c:/temp/test.log* or alternatively as *c:\\temp\\test.log*. The File option has no default value.If the parent directory of the file does not exist, `FileAppender` will automatically create it, including any necessary but nonexistent parent directories. |
| **prudent**   | `boolean`                                                    | In prudent mode, `FileAppender` will safely write to the specified file, even in the presence of other `FileAppender` instances running in different JVMs, potentially running on different hosts. The default value for prudent mode is `false`.Prudent mode can be used in conjunction with `RollingFileAppender` although some [restrictions apply](http://logback.qos.ch/manual/appenders.html#prudentWithRolling).Prudent mode implies that append property is automatically set to true.Prudent more relies on exclusive file locks. Experiments show that file locks approximately triple (x3) the cost of writing a logging event. On an "average" PC writing to a file located on a **local** hard disk, when prudent mode is off, it takes about 10 microseconds to write a single logging event. When prudent mode is on, it takes approximately 30 microseconds to output a single logging event. This translates to logging throughput of 100'000 events per second when prudent mode is off and approximately 33'000 events per second in prudent mode.Prudent mode effectively serializes I/O operations between all JVMs writing to the same file. Thus, as the number of JVMs competing to access a file increases so will the delay incurred by each I/O operation. As long as the *total* number of I/O operations is in the order of 20 log requests per second, the impact on performance should be negligible. Applications generating 100 or more I/O operations per second can see an impact on performance and should avoid using prudent mode.**NETWORKED FILE LOCKS** When the log file is located on a networked file system, the cost of prudent mode is even greater. Just as importantly, file locks over a networked file system can be sometimes strongly biased such that the process currently owning the lock immediately re-obtains the lock upon its release. Thus, while one process hogs the lock for the log file, other processes starve waiting for the lock to the point of appearing deadlocked.The impact of prudent mode is highly dependent on network speed as well as the OS implementation details. We provide an very small application called [FileLockSimulator](https://gist.github.com/2794241) which can help you simulate the behavior of prudent mode in your environment. |

**IMMEDIATE FLUSH** By default, each log event is immediately flushed to the underlying output stream. This default approach is safer in the sense that logging events are not lost in case your application exits without properly closing appenders. However, for significantly increased logging throughput, you may want to set the immediateFlush property to `false`.

Below is an example of a configuration file for `FileAppender`:

Example: FileAppender configuration (logback-examples/src/main/resources/chapters/appenders/conf/logback-fileAppender.xml)

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

java chapters.appenders.ConfigurationTester   src/main/java/chapters/appenders/conf/logback-fileAppender.xml

### Uniquely named files (by timestamp)

During the application development phase or in the case of short-lived applications, e.g. batch applications, it is desirable to create a new log file at each new application launch. This is fairly easy to do with the help of the `` element. Here's an example.

Example: Uniquely named FileAppender configuration by timestamp (logback-examples/src/main/resources/chapters/appenders/conf/logback-timestamp.xml)

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

Experiment with the `` element by running the command:

java chapters.appenders.ConfigurationTester src/main/resources/chapters/appenders/conf/logback-timestamp.xml

To use the logger context birth date as time reference, you would set the *timeReference* attribute to "contextBirth" as shown below.

Example: Timestamp using context birth date as time reference (logback-examples/src/main/resources/chapters/appenders/conf/logback-timestamp-contextBirth.xml)

View as .groovy

```
<configuration>
  <timestamp key="bySecond" datePattern="yyyyMMdd'T'HHmmss" 
             timeReference="contextBirth"/>
  ...
</configuration>
```

## RollingFileAppender

[`RollingFileAppender`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/RollingFileAppender.html) extends `FileAppender` with the capability to rollover log files. For example, `RollingFileAppender` can log to a file named *log.txt* file and, once a certain condition is met, change its logging target to another file.

There are two important sub-components that interact with `RollingFileAppender`. The first `RollingFileAppender` sub-component, namely `RollingPolicy`, ([see below](http://logback.qos.ch/manual/appenders.html#onRollingPolicies)) is responsible for undertaking the actions required for a rollover. A second sub-component of `RollingFileAppender`, namely `TriggeringPolicy`, ([see below](http://logback.qos.ch/manual/appenders.html#TriggeringPolicy)) will determine if and exactly when rollover occurs. Thus, `RollingPolicy` is responsible for the *what* and `TriggeringPolicy` is responsible for the *when*.

To be of any use, a `RollingFileAppender` must have both a `RollingPolicy` and a `TriggeringPolicy` set up. However, if its `RollingPolicy` also implements the `TriggeringPolicy` interface, then only the former needs to be specified explicitly.

Here are the available properties for `RollingFileAppender`:

| Property Name        | Type                                                         | Description                                                  |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **file**             | `String`                                                     | See `FileAppender` properties.                               |
| **append**           | `boolean`                                                    | See `FileAppender` properties.                               |
| **encoder**          | [`Encoder`](http://logback.qos.ch/xref/ch/qos/logback/core/encoder/Encoder.html) | See `OutputStreamAppender` properties.                       |
| **rollingPolicy**    | `RollingPolicy`                                              | This option is the component that will dictate `RollingFileAppender`'s behavior when rollover occurs. See more information below. |
| **triggeringPolicy** | `TriggeringPolicy`                                           | This option is the component that will tell `RollingFileAppender` when to activate the rollover procedure. See more information below. |
| **prudent**          | `boolean`                                                    | [`FixedWindowRollingPolicy`](http://logback.qos.ch/manual/appenders.html#FixedWindowRollingPolicy) is not supported in prudent mode.`RollingFileAppender` supports the prudent mode in conjunction with [`TimeBasedRollingPolicy`](http://logback.qos.ch/manual/appenders.html#TimeBasedRollingPolicy) albeit with two restrictions.In prudent mode, file compression is not supported nor allowed. (We can't have one JVM writing to a file while another JVM is compressing it.)The file property of `FileAppender` cannot be set and must be left blank. Indeed, most operating systems do not allow renaming of a file while another process has it opened.See also properties for `FileAppender`. |

### Overview of rolling policies

[`RollingPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/RollingPolicy.html) is responsible for the rollover procedure which involves file moving and renaming.

The `RollingPolicy` interface is presented below:

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

#### TimeBasedRollingPolicy

[`TimeBasedRollingPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/TimeBasedRollingPolicy.html) is possibly the most popular rolling policy. It defines a rollover policy based on time, for example by day or by month. `TimeBasedRollingPolicy` assumes the responsibility for rollover as well as for the triggering of said rollover. Indeed, `TimeBasedTriggeringPolicy` implements *both* `RollingPolicy` and `TriggeringPolicy` interfaces.

`TimeBasedRollingPolicy`'s configuration takes one mandatory fileNamePattern property and several optional properties.

| Property Name           | Type     | Description                                                  |
| ----------------------- | -------- | ------------------------------------------------------------ |
| **fileNamePattern**     | `String` | The mandatory fileNamePattern property defines the name of the rolled-over (archived) log files. Its value should consist of the name of the file, plus a suitably placed *%d* conversion specifier. The *%d* conversion specifier may contain a date-and-time pattern as specified by the `java.text.SimpleDateFormat` class. If the date-and-time pattern is omitted, then the default pattern *yyyy-MM-dd* is assumed. **The rollover period is inferred from the value of fileNamePattern.**Note that the file property in `RollingFileAppender` (the parent of `TimeBasedRollingPolicy`) can be either set or omitted. By setting the file property of the containing `FileAppender`, you can decouple the location of the active log file and the location of the archived log files. The current logs will be always targeted at the file specified by the file property. It follows that the name of the currently active log file will not change over time. However, if you choose to omit the file property, then the active file will be computed anew for each period based on the value of fileNamePattern. The examples below should clarify this point.The date-and-time pattern, as found within the accolades of %d{} follow java.text.SimpleDateFormat conventions. The forward slash '/' or backward slash '\' characters anywhere within the fileNamePattern property or within the date-and-time pattern will be interpreted as directory separators.Multiple %d specifiersIt is possible to specify multiple %d specifiers but only one of which can be primary, i.e. used to infer the rollover period. All other tokens *must* be marked as auxiliary by passing the 'aux' parameter (see examples below).Multiple %d specifiers allow you to organize archive files in a folder structure different than that of the roll-over period. For example, the file name pattern shown below organizes log folders by year and month but roll-over log files every day at midnight.`/var/log/**%d{yyyy/MM, aux}**/myapplication.**%d{yyyy-MM-dd}**.log`TimeZoneUnder certain circumstances, you might wish to roll-over log files according to a clock in a timezone different than that of the host. It is possible to pass a timezone argument following the date-and-time pattern within the %d conversion specifier. For example:`aFolder/test.**%d**{yyyy-MM-dd-HH, **UTC**}.log`If the specified timezone identifier is unknown or misspelled, the GMT timezone is assumed as dictated by the [TimeZone.getTimeZone(String)](http://docs.oracle.com/javase/6/docs/api/java/util/TimeZone.html#getTimeZone(java.lang.String)) method specification. |
| **maxHistory**          | int      | The optional maxHistory property controls the maximum number of archive files to keep, asynchronously deleting older files. For example, if you specify monthly rollover, and set maxHistory to 6, then 6 months worth of archives files will be kept with files older than 6 months deleted. Note as old archived log files are removed, any folders which were created for the purpose of log file archiving will be removed as appropriate. |
| **totalSizeCap**        | int      | The optional totalSizeCap property controls the total size of all archive files. Oldest archives are deleted asynchronously when the total size cap is exceeded. The totalSizeCap property requires maxHistory property to be set as well. Moreover, the "max history" restriction is always applied first and the "total size cap" restriction applied second. |
| **cleanHistoryOnStart** | boolean  | If set to true, archive removal will be executed on appender start up. By default this property is set to false.Archive removal is normally performed during roll over. However, some applications may not live long enough for roll over to be triggered. It follows that for such short-lived applications archive removal may never get a chance to execute. By setting cleanHistoryOnStart to true, archive removal is performed at appender start up. |

Here are a few `fileNamePattern` values with an explanation of their effects.

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

`TimeBasedRollingPolicy` supports automatic file compression. This feature is enabled if the value of the fileNamePattern option ends with *.gz* or *.zip*.

| fileNamePattern     | Rollover schedule                                            | Example                                                      |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| */wombat/foo.%d.gz* | Daily rollover (at midnight) with automatic GZIP compression of the archived files. | file property not set: During November 23rd, 2009, logging output will go to the file */wombat/foo.2009-11-23*. However, at midnight that file will be compressed to become */wombat/foo.2009-11-23.gz*. For the 24th of November, logging output will be directed to */wombat/folder/foo.2009-11-24* until it's rolled over at the beginning of the next day.file property set to /wombat/foo.txt: During November 23rd, 2009, logging output will go to the file */wombat/foo.txt*. At midnight that file will be compressed and renamed as */wombat/foo.2009-11-23.gz*. A new */wombat/foo.txt* file will be created where logging output will go for the rest of November 24rd. At midnight November 24th, */wombat/foo.txt* will be compressed and renamed as */wombat/foo.2009-11-24.gz* and so on. |

The fileNamePattern serves a dual purpose. First, by studying the pattern, logback computes the requested rollover periodicity. Second, it computes each archived file's name. Note that it is possible for two different patterns to specify the same periodicity. The patterns *yyyy-MM* and *yyyy@MM* both specify monthly rollover, although the resulting archive files will carry different names.

By setting the file property you can decouple the location of the active log file and the location of the archived log files. The logging output will be targeted into the file specified by the file property. It follows that the name of the active log file will not change over time. However, if you choose to omit the file property, then the active file will be computed anew for each period based on the value of fileNamePattern. By leaving the file option unset you can avoid file [renaming errors](http://logback.qos.ch/codes.html#renamingError) which occur while there exist external file handles referencing log files during roll over.

The maxHistory property controls the maximum number of archive files to keep, deleting older files. For example, if you specify monthly rollover, and set maxHistory to 6, then 6 months worth of archives files will be kept with files older than 6 months deleted. Note as old archived log files are removed, any folders which were created for the purpose of log file archiving will be removed as appropriate.

For various technical reasons, rollovers are not clock-driven but depend on the arrival of logging events. For example, on 8th of March 2002, assuming the fileNamePattern is set to *yyyy-MM-dd* (daily rollover), the arrival of the first event after midnight will trigger a rollover. If there are no logging events during, say 23 minutes and 47 seconds after midnight, then rollover will actually occur at 00:23'47 AM on March 9th and not at 0:00 AM. Thus, depending on the arrival rate of events, rollovers might be triggered with some latency. However, regardless of the delay, the rollover algorithm is known to be correct, in the sense that all logging events generated during a certain period will be output in the correct file delimiting that period.

Here is a sample configuration for `RollingFileAppender` in conjunction with a `TimeBasedRollingPolicy`.

Example: Sample configuration of a `RollingFileAppender` using a `TimeBasedRollingPolicy` (logback-examples/src/main/resources/chapters/appenders/conf/logback-RollingTimeBased.xml)

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

Example: Sample configuration of a `RollingFileAppender` using a `TimeBasedRollingPolicy` (logback-examples/src/main/resources/chapters/appenders/conf/logback-PrudentTimeBasedRolling.xml)

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

Sometimes you may wish to archive files essentially by date but at the same time limit the size of each log file, in particular if post-processing tools impose size limits on the log files. In order to address this requirement, logback ships with `SizeAndTimeBasedRollingPolicy`.

Note that `TimeBasedRollingPolicy` already allows limiting the combined size of archived log files. If you only wish to limit the combined size of log archives, then `TimeBasedRollingPolicy` described above and setting the [totalSizeCap](http://logback.qos.ch/manual/appenders.html#tbrpTotalSizeCap) property should be amply sufficent.

Here is a sample configuration file demonstrating time and size based log file archiving.

Example: Sample configuration for `SizeAndTimeBasedFNATP` (logback-examples/src/main/resources/chapters/appenders/conf/logback-sizeAndTime.xml)

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

Size and time based archiving supports deletion of old archive files. You need to specify the number of periods to preserve with the maxHistory property. When your application is stopped and restarted, logging will continue at the correct location, i.e. at the largest index number for the current period.

In versions prior to 1.1.7, this document mentioned a component called `SizeAndTimeBasedFNATP`. However, given that `SizeAndTimeBasedFNATP` offers a simpler configuration structure, we no longer document `SizeAndTimeBasedFNATP`. Nevertheless, earlier configuration files using `SizeAndTimeBasedFNATP` will continue to work just fine. In fact, `SizeAndTimeBasedRollingPolicy` is implemented with a `SizeAndTimeBasedFNATP` subcomponent.

#### FixedWindowRollingPolicy

When rolling over, [`FixedWindowRollingPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/FixedWindowRollingPolicy.html) renames files according to a fixed window algorithm as described below.

The fileNamePattern option represents the file name pattern for the archived (rolled over) log files. This option is required and must include an integer token *%i* somewhere within the pattern.

Here are the available properties for `FixedWindowRollingPolicy`

| Property Name       | Type     | Description                                                  |
| ------------------- | -------- | ------------------------------------------------------------ |
| **minIndex**        | `int`    | This option represents the lower bound for the window's index. |
| **maxIndex**        | `int`    | This option represents the upper bound for the window's index. |
| **fileNamePattern** | `String` | This option represents the pattern that will be followed by the `FixedWindowRollingPolicy` when renaming the log files. It must contain the string *%i*, which will indicate the position where the value of the current window index will be inserted.For example, using *MyLogFile%i.log* associated with minimum and maximum values of *1* and *3* will produce archive files named *MyLogFile1.log*, *MyLogFile2.log* and *MyLogFile3.log*.Note that file compression is also specified via this property. For example, fileNamePattern set to *MyLogFile%i.log.zip* means that archived files must be compressed using the *zip* format; *gz* format is also supported. |

Given that the fixed window rolling policy requires as many file renaming operations as the window size, large window sizes are strongly discouraged. When large values are specified by the user, the current implementation will automatically reduce the window size to 20.

Let us go over a more concrete example of the fixed window rollover policy. Suppose that minIndex is set to *1*, maxIndex set to *3*, fileNamePattern property set to *foo%i.log*, and that file property is set to *foo.log*.

| Number of rollovers | Active output target | Archived log files           | Description                                                  |
| ------------------- | -------------------- | ---------------------------- | ------------------------------------------------------------ |
| 0                   | foo.log              | -                            | No rollover has happened yet, logback logs into the initial file. |
| 1                   | foo.log              | foo1.log                     | First rollover. *foo.log* is renamed as *foo1.log*. A new *foo.log* file is created and becomes the active output target. |
| 2                   | foo.log              | foo1.log, foo2.log           | Second rollover. *foo1.log* is renamed as *foo2.log*. *foo.log* is renamed as *foo1.log*. A new *foo.log* file is created and becomes the active output target. |
| 3                   | foo.log              | foo1.log, foo2.log, foo3.log | Third rollover. *foo2.log* is renamed as *foo3.log*. *foo1.log* is renamed as *foo2.log*. *foo.log* is renamed as *foo1.log*. A new *foo.log* file is created and becomes the active output target. |
| 4                   | foo.log              | foo1.log, foo2.log, foo3.log | In this and subsequent rounds, the rollover begins by deleting *foo3.log*. Other files are renamed by incrementing their index as shown in previous steps. In this and subsequent rollovers, there will be three archive logs and one active log file. |

The configuration file below gives an example of configuring `RollingFileAppender` and `FixedWindowRollingPolicy`. Note that the File option is mandatory even if it contains some of the same information as conveyed with the fileNamePattern option.

Example: Sample configuration of a `RollingFileAppender` using a `FixedWindowRollingPolicy` (logback-examples/src/main/resources/chapters/appenders/conf/logback-RollingFixedWindow.xml)

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

[`TriggeringPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/TriggeringPolicy.html) implementations are responsible for instructing the `RollingFileAppender` when to rollover.

The `TriggeringPolicy` interface contains only one method.

```
package ch.qos.logback.core.rolling;

import java.io.File;
import ch.qos.logback.core.spi.LifeCycle;

public interface TriggeringPolicy<E> extends LifeCycle {

  public boolean isTriggeringEvent(final File activeFile, final <E> event);
}
```

The `isTriggeringEvent()` method takes as parameters the active file and the logging event currently being processed. The concrete implementation determines whether the rollover should occur or not, based on these parameters.

The most widely-used triggering policy, namely `TimeBasedRollingPolicy` which also doubles as a rolling policy, was already [discussed earlier](http://logback.qos.ch/manual/appenders.html#TimeBasedRollingPolicy) along with other rolling policies.

#### [SizeBasedTriggeringPolicy](http://logback.qos.ch/manual/appenders.html#SizeBasedTriggeringPolicy)

[`SizeBasedTriggeringPolicy`](http://logback.qos.ch/xref/ch/qos/logback/core/rolling/SizeBasedTriggeringPolicy.html) looks at the size of the currently active file. If it grows larger than the specified size, it will signal the owning `RollingFileAppender` to trigger the rollover of the existing active file.

`SizeBasedTriggeringPolicy` accepts only one parameter, namely maxFileSize, with a default value of 10 MB.

The maxFileSize option can be specified in bytes, kilobytes, megabytes or gigabytes by suffixing a numeric value with *KB*, *MB* and respectively *GB*. For example, *5000000*, *5000KB*, *5MB* and *2GB* are all valid values, with the first three being equivalent.

Here is a sample configuration with a `RollingFileAppender` in conjunction with `SizeBasedTriggeringPolicy` triggering rollover when the log file reaches 5MB in size.

Example: Sample configuration of a `RollingFileAppender` using a `SizeBasedTriggeringPolicy` (logback-examples/src/main/resources/chapters/appenders/conf/logback-RollingSizeBased.xml)

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

### SocketAppender and SSLSocketAppender

The appenders covered thus far are only able to log to local resources. In contrast, the [`SocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SocketAppender.html) is designed to log to a remote entity by transmitting serialized `ILoggingEvent` instances over the wire. When using `SocketAppender` logging events on the wire are sent in the clear. However, when using [`SSLSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SSLSocketAppender.html), logging events are delivered over a secure channel.

The actual type of the serialized event is [`LoggingEventVO`](http://logback.qos.ch/xref/ch/qos/logback/classic/spi/LoggingEventVO.html) which implements the `ILoggingEvent` interface. Nevertheless, remote logging is non-intrusive as far as the logging event is concerned. On the receiving end after deserialization, the event can be logged as if it were generated locally. Multiple `SocketAppender` instances running on different machines can direct their logging output to a central log server whose format is fixed. `SocketAppender` does not take an associated layout because it sends serialized events to a remote server. `SocketAppender` operates above the *Transmission Control Protocol (TCP)* layer which provides a reliable, sequenced, flow-controlled end-to-end octet stream. Consequently, if the remote server is reachable, then log events will eventually arrive there. Otherwise, if the remote server is down or unreachable, the logging events will simply be dropped. If and when the server comes back up, then event transmission will be resumed transparently. This transparent reconnection is performed by a connector thread which periodically attempts to connect to the server.

Logging events are automatically buffered by the native TCP implementation. This means that if the link to server is slow but still faster than the rate of event production by the client, the client will not be affected by the slow network connection. However, if the network connection is slower than the rate of event production, then the client can only progress at the network rate. In particular, in the extreme case where the network link to the server is down, the client will be eventually blocked. Alternatively, if the network link is up, but the server is down, the client will not be blocked, although the log events will be lost due to server unavailability.

Even if a `SocketAppender` is no longer attached to any logger, it will not be garbage collected in the presence of a connector thread. A connector thread exists only if the connection to the server is down. To avoid this garbage collection problem, you should close the `SocketAppender` explicitly. Long lived applications which create/destroy many `SocketAppender` instances should be aware of this garbage collection problem. Most other applications can safely ignore it. If the JVM hosting the `SocketAppender` exits before the `SocketAppender` is closed, either explicitly or subsequent to garbage collection, then there might be untransmitted data in the pipe which may be lost. This is a common problem on Windows based systems. To avoid lost data, it is usually sufficient to `close()` the `SocketAppender` either explicitly or by calling the `LoggerContext`'s `stop()` method before exiting the application.

The remote server is identified by the remoteHost and port properties. `SocketAppender` properties are listed in the following table. `SSLSocketAppender` supports many additional configuration properties, which are detailed in the section entitled [Using SSL](http://logback.qos.ch/manual/usingSSL.html).

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

The standard Logback Classic distribution includes two options for servers that can be used to receive logging events from `SocketAppender` or `SSLSocketAppender`.

- `ServerSocketReceiver` and its SSL-enabled counterpart `SSLServerSocketReceiver` are receiver components which can be configured in the *logback.xml* configuration file of an application in order receive events from a remote socket appender. See [Receivers](http://logback.qos.ch/manual/receivers.html) for configuration details and usage examples.
- `SimpleSocketServer` and its SSL-enabled counterpart `SimpleSSLSocketServer` both offer an easy-to-use standalone Java application that is designed to be configured and run from your shell's command line interface. These applications simply wait for logging events from `SocketAppender` or `SSLSocketAppender` clients. Each received event is logged according to local server policy. Usage examples are given below.

#### Using SimpleSocketServer

The `SimpleSocketServer` application takes two command-line arguments: *port* and *configFile*; where *port* is the port to listen on and *configFile* is a configuration script in XML format.

Assuming you are in the *logback-examples/* directory, start `SimpleSocketServer` with the following command:

java ch.qos.logback.classic.net.SimpleSocketServer 6000 \  src/main/java/chapters/appenders/socket/server1.xml

where 6000 is the port number to listen on and *server1.xml* is a configuration script that adds a `ConsoleAppender` and a `RollingFileAppender` to the root logger. After you have started `SimpleSocketServer`, you can send it log events from multiple clients using `SocketAppender`. The examples associated with this manual include two such clients: `chapters.appenders.SocketClient1` and `chapters.appenders.SocketClient2` Both clients wait for the user to type a line of text on the console. The text is encapsulated in a logging event of level debug and then sent to the remote server. The two clients differ in the configuration of the `SocketAppender`. `SocketClient1` configures the appender programmatically while `SocketClient2` requires a configuration file.

Assuming `SimpleSocketServer` is running on the local host, you connect to it with the following command:

java chapters.appenders.socket.SocketClient1 localhost 6000

Each line that you type should appear on the console of the `SimpleSocketServer` launched in the previous step. If you stop and restart the `SimpleSocketServer` the client will transparently reconnect to the new server instance, although the events generated while disconnected will be simply (and irrevocably) lost.

Unlike `SocketClient1`, the sample application `SocketClient2` does not configure logback by itself. It requires a configuration file in XML format. The configuration file *client1.xml* shown below creates a `SocketAppender` and attaches it to the root logger.

Example: SocketAppender configuration (logback-examples/src/main/resources/chapters/appenders/socket/client1.xml)

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

java -Dhost=localhost -Dport=6000 -DincludeCallerData=false \  chapters.appenders.socket.SocketClient2 src/main/java/chapters/appenders/socket/client1.xml

This command should give similar results to the previous `SocketClient1` example.

Allow us to repeat for emphasis that serialization of logging events is not intrusive. A deserialized event carries the same information as any other logging event. It can be manipulated as if it were generated locally; except that serialized logging events by default do not include caller data. Here is an example to illustrate the point. First, start `SimpleSocketServer` with the following command:

 java ch.qos.logback.classic.net.SimpleSocketServer 6000 \  src/main/java/chapters/appenders/socket/server2.xml

The configuration file *server2.xml* creates a `ConsoleAppender` whose layout outputs the caller's file name and line number along with other information. If you run `SocketClient2` with the configuration file *client1.xml* as previously, you will notice that the output on the server side will contain two question marks between parentheses instead of the file name and the line number of the caller:

2006-11-06 17:37:30,968 DEBUG [Thread-0] [?:?] chapters.appenders.socket.SocketClient2 - Hi

The outcome can be easily changed by instructing the `SocketAppender` to include caller data by setting the includeCallerData option to true. Using the following command will do the trick:

```
java -Dhost=localhost -Dport=6000 -DincludeCallerData=true \
  chapters.appenders.socket.SocketClient2 src/main/java/chapters/appenders/socket/client1.xml
```

As deserialized events can be handled in the same way as locally generated events, they even can be sent to a second server for further treatment. As an exercise, you may wish to setup two servers where the first server tunnels the events it receives from its clients to a second server.

#### Using SimpleSSLSocketServer

The `SimpleSSLSocketServer` requires the same *port* and *configFile* command-line arguments used by `SimpleSocketServer`. Additionally, you must provide the location and password for your logging server's X.509 credential using system properties specified on the command line.

Assuming you are in the *logback-examples/* directory, start `SimpleSSLSocketServer` with the following command:

java -Djavax.net.ssl.keyStore=src/main/java/chapters/appenders/socket/ssl/keystore.jks \    -Djavax.net.ssl.keyStorePassword=changeit \    ch.qos.logback.classic.net.SimpleSSLSocketServer 6000 \    src/main/java/chapters/appenders/socket/ssl/server.xml    

This example runs `SimpleSSLSocketServer` using an X.509 credential that is suitable for testing and experimentation, only. **Before using `SimpleSSLSocketServer` in a production setting you should obtain an appropriate X.509 credential to identify your logging server**. See [Using SSL](http://logback.qos.ch/manual/usingSSL.html) for more details.

Because the server configuration has `debug="true"` specified on the root element, you'll will see in the server's startup logging the SSL configuration that will be used. This is useful in validating that local security policies are properly implemented.

With `SimpleSSLSocketServer` running, you can connect to the server using an `SSLSocketAppender`. The following example shows the appender configuration needed:

Example: SSLSocketAppender configuration (logback-examples/src/main/resources/chapters/appenders/socket/ssl/client.xml)

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

We can run a client application using this configuration by specifying the substitution variable values on the command line as system properties:

java -Dhost=localhost -Dport=6000 \    -Dtruststore=file:src/main/java/chapters/appenders/socket/ssl/truststore.jks \    -Dpassword=changeit \    chapters.appenders.socket.SocketClient2 src/main/java/chapters/appenders/socket/ssl/client.xml 	  

As in the previous examples, you can type in a message when prompted by the client application, and the message will be delivered to the logging server (now over a secure channel) where it will be displayed on the console.

Note that the *truststore* property given on the command line specifies a file URL that identifies the location of the trust store. You may also use a classpath URL as described in [Using SSL](http://logback.qos.ch/manual/usingSSL.html).

As we saw previously at server startup, because the client configuration has `debug="true"` specified on the root element, the client's startup logging includes the details of the SSL configuration as aid to auditing local policy conformance.

### ServerSocketAppender and SSLServerSocketAppender

The `SocketAppender` component (and its SSL-enabled counterpart) discussed previously are designed to allow an application to connect to a remote logging server over the network for the purpose of delivering logging events to the server. In some situations, it may be inconvenient or infeasible to have an application initiate a connection to a remote logging server. For these situations, Logback offers [`ServerSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/server/ServerSocketAppender).

Instead of initiating a connection to a remote logging server, `ServerSocketAppender` passively listens on a TCP socket awaiting incoming connections from remote clients. Logging events that are delivered to the appender are distributed to each connected client. Logging events that occur when no client is connected are *summarily discarded*.

In addition to the basic `ServerSocketAppender`, Logback offers [`SSLServerSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/server/SSLServerSocketAppender), which distributes logging events to each connected client using a secure, encrypted channel. Moreover, the SSL-enabled appender fully supports mutual certificate-based authentication, which can be used to ensure that only authorized clients can connect to the appender to receive logging events.

The approach to encoding logging events for transmission on the wire is identical to that used by `SocketAppender`; each event is a serialized instance of `ILoggingEvent`. Only the direction of connection initiation is reversed. While `SocketAppender` acts as the active peer in establishing the connection to a logging server, `ServerSocketAppender` is passive; it listens for incoming connections from clients.

The `ServerSocketAppender` subtypes are intended to be used exclusively with Logback *receiver* components. See [Receivers](http://logback.qos.ch/manual/receivers.html) for additional information on this component type.

The following configuration properties are supported by `ServerSocketAppender`:

| Property Name         | Type               | Description                                                  |
| --------------------- | ------------------ | ------------------------------------------------------------ |
| **address**           | `String`           | The local network interface address on which the appender will listen. If this property is not specified, the appender will listen on all network interfaces. |
| **includeCallerData** | `boolean`          | If true, the caller data will be available to the remote host. By default no caller data is sent to the client. |
| **port**              | `int`              | The port number on which the appender will listen.           |
| **ssl**               | `SSLConfiguration` | Supported only for `SSLServerSocketAppender`, this property provides the SSL configuration that will be used by the appender, as described in [Using SSL](http://logback.qos.ch/manual/usingSSL.html). |

The following example illustrates a configuration that uses `ServerSocketAppender`:

Example: Basic ServerSocketAppender Configuration (logback-examples/src/main/resources/chapters/appenders/socket/server4.xml)

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

The following example illustrates a configuration using `SSLServerSocketAppender`.

Example: Basic SSLServerSocketAppender Configuration (logback-examples/src/main/resources/chapters/appenders/socket/ssl/server3.xml)

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

Because the `ServerSocketAppender` subtypes are designed to be used with receiver components, we will defer presenting illustrative examples to the chapter entitled [Receivers](http://logback.qos.ch/manual/receivers.html).

### SMTPAppender

The [`SMTPAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SMTPAppender.html) accumulates logging events in one or more fixed-size buffers and sends the contents of the appropriate buffer in an email after a user-specified event occurs. SMTP email transmission (sending) is performed asynchronously. By default, the email transmission is triggered by a logging event of level ERROR. Moreover, by default, a single buffer is used for all events.

The various properties for `SMTPAppender` are summarized in the following table.

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

The `SMTPAppender` relies on the JavaMail API. It has been tested with JavaMail API version 1.4. The JavaMail API requires the JavaBeans Activation Framework package. You can download the [JavaMail API](http://java.sun.com/products/javamail/) and the [JavaBeans Activation Framework](http://java.sun.com/beans/glasgow/jaf.html) from their respective websites. Make sure to place these two jar files in the classpath before trying the following examples.

A sample application, [`chapters.appenders.mail.EMail`](http://logback.qos.ch/xref/chapters/appenders/mail/EMail.html) generates a number of log messages followed by a single error message. It takes two parameters. The first parameter is an integer corresponding to the number of logging events to generate. The second parameter is the logback configuration file. The last logging event generated by *EMail* application, an ERROR, will trigger the transmission of an email message.

Here is a sample configuration file intended for the `Email` application:

Example: A sample `SMTPAppender` configuration (logback-examples/src/main/resources/chapters/appenders/mail/mail1.xml)

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

```
java chapters.appenders.mail.EMail 100 src/main/java/chapters/appenders/mail/mail1.xml
```

The recipient you specified should receive an email message containing 100 logging events formatted by `PatternLayout` The figure below is the resulting email message as shown by Mozilla Thunderbird.

![resulting email](http://logback.qos.ch/manual/images/chapters/appenders/smtpAppender1.jpg)

In the next example configuration file *mail2.xml*, the values for the smtpHost, to and from properties are determined by variable substitution. Here is the relevant part of *mail2.xml*.

```
<appender name="EMAIL" class="ch.qos.logback.classic.net.SMTPAppender">
  <smtpHost>${smtpHost}</smtpHost>
  <to>${to}</to>
  <from>${from}</from>
  <layout class="ch.qos.logback.classic.html.HTMLLayout"/>
</appender>
```

You can pass the required parameters on the command line:

```
java -Dfrom=source@xyz.com -Dto=recipient@xyz.com -DsmtpHost=some_smtp_host \
  chapters.appenders.mail.EMail 10000 src/main/java/chapters/appenders/mail/mail2.xml
```

Be sure to replace with values as appropriate for your environment.

Note that in this latest example, `PatternLayout` was replaced by `HTMLLayout` which formats logs as an HTML table. You can change the list and order of columns as well as the CSS of the table. Please refer to [HTMLLayout](http://logback.qos.ch/manual/layouts.html#ClassicHTMLLayout) documentation for further details.

Given that the size of the cyclic buffer is 256, the recipient should see an email message containing 256 events conveniently formatted in an HTML table. Note that this run of the `chapters.appenders.mail.Email` application generated 10'000 events of which only the last 256 were included in the outgoing email.

![2nd email](http://logback.qos.ch/manual/images/chapters/appenders/smtpAppender2.jpg)

Email clients such as Mozilla Thunderbird, Eudora or MS Outlook, offer reasonably good CSS support for HTML email. However, they sometimes automatically downgrade HTML to plaintext. For example, to view HTML email in Thunderbird, the "View→Message Body As→Original HTML" option must be set. Yahoo! Mail's support for HTML email, in particular its CSS support is very good. Gmail on the other hand, while it honors the basic HTML table structure, ignores the internal CSS formatting. Gmail supports inline CSS formatting but since inline CSS would make the resulting output too voluminous, `HTMLLayout` does not use inline CSS.

### Custom buffer size

By default, the outgoing message will contain the last 256 messages seen by `SMTPAppender`. If your heart so desires, you may set a different buffer size as shown in the next example.

Example: `SMTPAppender` configuration with a custom bufer size (logback-examples/src/main/resources/chapters/appenders/mail/customBufferSize.xml)

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

If the Evaluator property is not set, the `SMTPAppender` defaults to an [OnErrorEvaluator](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/OnErrorEvaluator.html) instance which triggers email transmission when it encounters an event of level ERROR. While triggering an outgoing email in response to an error is relatively reasonable, it is possible to override this default behavior by providing a different implementation of the `EventEvaluator` interface.

The `SMTPAppender` submits each incoming event to its evaluator by calling `evaluate()` method in order to check whether the event should trigger an email or just be placed in the cyclic buffer. When the evaluator gives a positive answer to its evaluation, an email is sent out. The `SMTPAppender` contains one and only one evaluator object. This object may manage its own internal state. For illustrative purposes, the `CounterBasedEvaluator` class listed next implements an event evaluator whereby every 1024th event triggers an email message.

Example: A `EventEvaluator` implementation that evaluates to `true` every 1024th event ([logback-examples/src/main/java/chapters/appenders/mail/CounterBasedEvaluator.java](http://logback.qos.ch/xref/chapters/appenders/mail/CounterBasedEvaluator.html))

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

Setting the Evaluator option of `SMTPAppender` instructs it to use a custom evaluator. The next configuration file attaches a `SMTPAppender` to the root logger. This appender uses a `CounterBasedEvaluator` instance as its event evaluator.

Example: `SMTPAppender` with custom `Evaluator` and buffer size (logback-examples/src/main/resources/chapters/appenders/mail/mail3.xml)

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

Although reasonable, the default triggering policy whereby every event of level ERROR triggers an outgoing email may result in too many emails, cluttering the targeted user's mailbox. Logback ships with another triggering policy, called [OnMarkerEvaluator](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/OnMarkerEvaluator.html). It is based on markers. In essence, emails are triggered only if the event is marked with a user-specified marker. The next example should make the point clearer.

The [Marked_EMail](http://logback.qos.ch/xref/chapters/appenders/mail/Marked_EMail.html) application contains several logging statements some of which are of level ERROR. One noteworthy statement contains a marker. Here is the relevant code.

```
Marker notifyAdmin = MarkerFactory.getMarker("NOTIFY_ADMIN");
logger.error(notifyAdmin,
  "This is a serious an error requiring the admin's attention",
   new Exception("Just testing"));
```

The next configuration file will trigger outgoing emails only in presence of events bearing the NOTIFY_ADMIN or the TRANSACTION_FAILURE markers.

Example: `SMTPAppender` with `OnMarkerEvaluator` (logback-examples/src/main/resources/chapters/appenders/mail/mailWithMarker.xml)

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

```
java -Dfrom=source@xyz.com -Dto=recipient@xyz.com -DsmtpHost=some_smtp_host \
  chapters.appenders.mail.Marked_EMail src/main/java/chapters/appenders/mail/mailWithMarker.xml
```

#### Marker-based triggering with JaninoEventEvaluator

Note that instead of using the marker-centric `OnMarkerEvaluator`, we could use the much more generic [`JaninoEventEvaluator`](http://logback.qos.ch/manual/filters.html#JaninoEventEvaluator) or its even more powerful cousin [`GEventEvaluator`](http://logback.qos.ch/manual/filters.html#GEventEvaluator). For example, the following configuration file uses `JaninoEventEvaluator` instead of `OnMarkerEvaluator` but is otherwise equivalent to the previous configuration file.

Example: `SMTPAppender` with `JaninoEventEvaluator` (logback-examples/src/main/resources/chapters/appenders/mail/mailWithMarker_Janino.xml)

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

Here is the equivalent evaluator using [GEventEvaluator](http://logback.qos.ch/manual/filters.html#GEventEvaluator).

Example: the same with `GEventEvaluator` (logback-examples/src/main/resources/chapters/appenders/mail/mailWithMarker_GEvent.xml)

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

### Authentication/STARTTLS/SSL

`SMTPAppender` supports authentication via plain user passwords as well as both the STARTTLS and SSL protocols. Note that STARTTLS differs from SSL in that, in STARTTLS, the connection is initially non-encrypted and only after the STARTTLS command is issued by the client (if the server supports it) does the connection switch to SSL. In SSL mode, the connection is encrypted right from the start.

### SMTPAppender configuration for Gmail (SSL)

The next example shows you how to configure `SMTPAppender` for Gmail with the SSL protocol.

Example:: `SMTPAppender` to Gmail using SSL (logback-examples/src/main/resources/chapters/appenders/mail/gmailSSL.xml)

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

The next example shows you how to configure `SMTPAppender` for Gmail for the STARTTLS protocol.

Example: `SMTPAppender` to GMAIL using STARTTLS (logback-examples/src/main/resources/chapters/appenders/mail/gmailSTARTTLS.xml)

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

As mentioned earlier, by specifying a discriminator other than the default one, `SMTPAppender` will generate email messages containing events pertaining to a particular user, user session or client IP address, depending on the specified discriminator.

The next example illustrates the use of [MDCBasedDiscriminator](http://logback.qos.ch/xref/ch/qos/logback/classic/sift/MDCBasedDiscriminator.html) in conjunction with the MDC key named "req.remoteHost", assumed to contain the IP address of the remote host accessing a fictitious application. In a web-application, you could use [MDCInsertingServletFilter](http://logback.qos.ch/manual/mdc.html#mis) to populate MDC values.

Example: `SMTPAppender` with MDCBasedDsicriminator (logback-examples/src/main/resources/chapters/appenders/mail/mailWithMDCBasedDiscriminator.xml)

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

#### Buffer management in very busy systems

Internally, each distinct value returned by the discriminator will cause the creation of a new cyclic buffer. However, at most maxNumberOfBuffers (by default 64) will be maintained. Whenever the number of buffers rises above maxNumberOfBuffers, the least recently updated buffer is automatically discarded. As a second safety measure, any buffer which has not been updated in the last 30 minutes will be automatically discarded as well.

On systems serving a large number of transactions per minute, allowing only a small number for maxNumberOfBuffers (by default 64) will often cause the number of events in the outgoing email to be unnecessarily small. Indeed, in the presence of a large number of transactions, there will be more than one buffer associated with the same transaction as buffers will be killed and re-born in succession for the same discriminator value (or transaction). Note that in even such very busy systems, the maximum number of cyclic buffers is capped by maxNumberOfBuffers.

To avoid such yo-yo effects, `SMTPAppender` will release the buffer associated with a given discriminator key as soon as it sees an event marked as "FINALIZE_SESSION". This will cause the appropriate buffer to be discarded at the end of each transaction. You can then safely increase the value of maxNumberOfBuffers to a larger value such as 512 or 1024 without risking running out of memory.

There are three distinct but complementary mechanisms working together to manage cyclic buffers. They ensure that only relevant buffers are kept alive at any given moment, even in very busy systems.

### DBAppender

The [`DBAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/db/DBAppender.html) inserts logging events into three database tables in a format independent of the Java programming language.

These three tables are *logging_event*, *logging_event_property* and *logging_event_exception*. They must exist before `DBAppender` can be used. Logback ships with SQL scripts that will create the tables. They can be found under the *logback-classic/src/main/java/ch/qos/logback/classic/db/script* folder. There is a specific script for each of the most popular database systems. If the script for your particular type of database system is missing, it should be quite easy to write one, taking example on the already existing scripts. If you send them to us, we will gladly include missing scripts in future releases.

If your JDBC driver supports the `getGeneratedKeys` method introduced in JDBC 3.0 specification, assuming you have created the appropriate database tables as mentioned above, then no additional steps are required. Otherwise, there must be an `SQLDialect` appropriate for your database system. Currently, logback has dialects for H2, HSQL, MS SQL Server, MySQL, Oracle, PostgreSQL, SQLLite and Sybase.

The table below summarizes the database types and their support of the `getGeneratedKeys()` method.

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

Configuring logback to use `DBAppender` can be done in several different ways, depending on the tools one has to connect to the database, and the database itself. The key issue in configuring `DBAppender` is about setting its `ConnectionSource` object, as we shall discover shortly.

Once `DBAppender` is configured for your database, logging events are sent to the specified database. As stated previously, there are three tables used by logback to store logging event data.

The *logging_event* table contains the following fields:

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

| Field            | Type      | Description                           |
| ---------------- | --------- | ------------------------------------- |
| **event_id**     | `int`     | The database id of the logging event. |
| **mapped_key**   | `varchar` | The key of the `MDC` property         |
| **mapped_value** | `text`    | The value of the `MDC` property       |

The *logging_event_exception* table contains the following fields:

| Field          | Type       | Description                                    |
| -------------- | ---------- | ---------------------------------------------- |
| **event_id**   | `int`      | The database id of the logging event.          |
| **i**          | `smallint` | The index of the line in the full stack trace. |
| **trace_line** | `varchar`  | The corresponding line                         |

To give a more visual example of the work done by `DBAppender`, here is a screenshot of a MySQL database with content provided by `DBAppender`.

The *logging_event* table:

![Logging Event table](http://logback.qos.ch/manual/images/chapters/appenders/dbAppenderLE.gif)

The *logging_event_exception* table:

![Logging Event Exception table](http://logback.qos.ch/manual/images/chapters/appenders/dbAppenderLEException.gif)

The *logging_event_property* table:

![Logging Event Property table](http://logback.qos.ch/manual/images/chapters/appenders/dbAppenderLEProperty.gif)

#### ConnectionSource

The `ConnectionSource` interface provides a pluggable means of transparently obtaining JDBC connections for logback classes that require the use of a `java.sql.Connection`. There are currently three implementations of `ConnectionSource`, namely `DataSourceConnectionSource`, `DriverManagerConnectionSource` and `JNDIConnectionSource`.

The first example that we will review is a configuration using `DriverManagerConnectionSource` and a MySQL database. The following configuration file is what one would need.

Example: `DBAppender` configuration (logback-examples/src/main/resources/chapters/appenders/db/append-toMySQL-with-driverManager.xml)

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

The [`DriverManagerConnectionSource`](http://logback.qos.ch/xref/ch/qos/logback/core/db/DriverManagerConnectionSource.html) is an implementation of `ConnectionSource` that obtains the connection in the traditional JDBC manner based on the connection URL.

Note that this class will establish a new `Connection` for each call to `getConnection()`. It is recommended that you either use a JDBC driver that natively supports connection pooling or that you create your own implementation of `ConnectionSource` that taps into whatever pooling mechanism you are already using. If you have access to a JNDI implementation that supports `javax.sql.DataSource`, e.g. within a J2EE application server, see [`JNDIConnectionSource`](http://logback.qos.ch/manual/appenders.html#JNDIConnectionSource) below.

Connecting to a database using a `DataSource` is rather similar. The configuration now uses [`DataSourceConnectionSource`](http://logback.qos.ch/xref/ch/qos/logback/core/db/DataSourceConnectionSource.html), which is an implementation of `ConnectionSource` that obtains the `Connection` in the recommended JDBC manner based on a `javax.sql.DataSource`.

Example: `DBAppender` configuration (logback-examples/src/main/resources/chapters/appenders/db/append-with-datasource.xml)

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

#### JNDIConnectionSource

[`JNDIConnectionSource`](http://logback.qos.ch/xref/ch/qos/logback/core/db/JNDIConnectionSource.html) is another `ConnectionSource` implementation shipping in logback. As its name indicates, it retrieves a `javax.sql.DataSource` from a JNDI and then leverages it to obtain a `java.sql.Connection` instance. `JNDIConnectionSource` is primarily designed to be used inside J2EE application servers or by application server clients, assuming the application server supports remote access of `javax.sql.DataSource`. Thus, one can take advantage of connection pooling and whatever other goodies the application server provides. More importantly, your application will be [dryer](http://en.wikipedia.org/wiki/Don't_repeat_yourself) as it will be no longer necessary to define a `DataSource` in *logback.xml*.

For example, here is a configuration snippet for Tomcat. It assumes PostgreSQL as the database although any of the supported database systems (listed above) would work.

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

Example: `DBAppender` configuration by `JNDIConnectionSource` (logback-examples/src/main/resources/chapters/appenders/db/append-via-jndi.xml)

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

#### Connection pooling

Logging events can be created at a rather fast pace. To keep up with the flow of events that must be inserted into a database, it is recommended to use connection pooling with `DBAppender`.

Experiment shows that using connection pooling with `DBAppender` gives a big performance boost. With the following configuration file, logging events are sent to a MySQL database, without any pooling.

Example: `DBAppender` configuration without pooling (logback-examples/src/main/resources/chapters/appenders/db/append-toMySQL-with-datasource.xml)

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

A dedicated external library is necessary to use connection pooling with `DBAppender`. The next example uses [c3p0](http://sourceforge.net/projects/c3p0). To be able to use c3p0, one must download it and place *c3p0-VERSION.jar* in the classpath.

Example: `DBAppender` configuration with pooling (logback-examples/src/main/resources/chapters/appenders/db/append-toMySQL-with-datasource-and-pooling.xml)

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

### SyslogAppender

The syslog protocol is a very simple protocol: a syslog sender sends a small message to a syslog receiver. The receiver is commonly called *syslog daemon* or *syslog server*. Logback can send messages to a remote syslog daemon. This is achieved by using [`SyslogAppender`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SyslogAppender.html).

Here are the properties you can pass to a SyslogAppender.

| Property Name         | Type      | Description                                                  |
| --------------------- | --------- | ------------------------------------------------------------ |
| **syslogHost**        | `String`  | The host name of the syslog server.                          |
| **port**              | `String`  | The port number on the syslog server to connect to. Normally, one would not want to change the default value of *514*. |
| **facility**          | `String`  | The facility is meant to identify the source of a message.The facility option must be set to one of the strings *KERN, USER, MAIL, DAEMON, AUTH, SYSLOG, LPR, NEWS, UUCP, CRON, AUTHPRIV, FTP, NTP, AUDIT, ALERT, CLOCK, LOCAL0, LOCAL1, LOCAL2, LOCAL3, LOCAL4, LOCAL5, LOCAL6, LOCAL7*. Case is not important. |
| **suffixPattern**     | `String`  | The suffixPattern option specifies the format of the non-standardized part of the message sent to the syslog server. By default, its value is *[%thread] %logger %msg*. Any value that a `PatternLayout` could use is a correct suffixPattern value. |
| **stackTracePattern** | `String`  | The stackTracePattern property allows the customization of the string appearing just before each stack trace line. The default value for this property is "\t", i.e. the tab character. Any value accepted by `PatternLayout` is a valid value for stackTracePattern. |
| **throwableExcluded** | `boolean` | Setting throwableExcluded to `true` will cause stack trace data associated with a Throwable to be omitted. By default, throwableExcluded is set to `false` so that stack trace data is sent to the syslog server. |

The syslog severity of a logging event is converted from the level of the logging event. The *DEBUG* level is converted to *7*, *INFO* is converted to *6*, *WARN* is converted to *4* and *ERROR* is converted to *3*.

Since the format of a syslog request follows rather strict rules, there is no layout to be used with `SyslogAppender`. However, using the suffixPattern option lets the user display whatever information she wishes.

Here is a sample configuration using a `SyslogAppender`.

Example: `SyslogAppender` configuration (logback-examples/src/main/resources/chapters/appenders/conf/logback-syslog.xml)

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

### SiftingAppender

As its name implies, a `SiftingAppender` can be used to separate (or sift) logging according to a given runtime attribute. For example, `SiftingAppender` can separate logging events according to user sessions, so that the logs generated by different users go into distinct log files, one log file per user.

| Property Name        | Type       | Description                                                  |
| -------------------- | ---------- | ------------------------------------------------------------ |
| **timeout**          | `Duration` | A nested appender which has not been accessed beyond the timeout duration is deemed stale. A stale appender is closed and unreferenced by `SiftingAppender`. The default value for timeout is 30 minutes. |
| **maxAppenderCount** | `integer`  | The maximum number of nested appenders `SiftingAppender` may create and track. Default value for maxAppenderCount is Integer.MAX_VALUE. |

`SiftingAppender` achieves this feat by creating nested appenders on the fly. Nested appenders are created based on a template specified within the configuration of the `SiftingAppender` itself (enclosed within the `` element, see example below). `SiftingAppender` is responsible for managing the lifecycle of child appenders. For example, `SiftingAppender` will automatically close and remove any stale appender. A nested appender is considered stale when no accesses it beyond the duration specified by the timeout parameter.

When handling a logging event, `SiftingAppender` will select a child appender to delegate to. The selection criteria are computed at runtime by a discriminator. The user can specify the selection criteria with the help of a `Discriminator`. Let us now study an example.

#### Example

The [SiftExample](http://logback.qos.ch/xref/chapters/appenders/sift/SiftExample.html) application logs a message stating that the application has started. It then sets the MDC key "userid" to "Alice" and logs a message. Here is the salient code:

logger.debug("Application started"); MDC.put("userid", "Alice"); logger.debug("Alice says hello"); 

The template for the configuration file illustrates the use of `SiftingAppender`.

Example: `SiftingAppender` configuration (logback-examples/src/main/resources/chapters/appenders/sift/byUserid.xml)

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

The `SiftingAppender` is unique in its capacity to reference and configure child appenders. In the above example, `SiftingAppender` will create multiple `FileAppender` instances, each `FileAppender` instance identified by the value associated with the "userid" MDC key. Whenever the "userid" MDC key is assigned a new value, a new `FileAppender` instance will be built from scratch. The `SiftingAppender` keeps track of the appenders it creates. Appenders unused for 30 minutes will be automatically closed and discarded.

**VARIABLE EXPORT** It is not enough to have different appender instances; each instance must output to a distinct target resource. To allow such differentiation, within the appender template, the key passed to the discriminator, "userid" in the above example, is exported and becomes a [variable](http://logback.qos.ch/manual/configuration.html#variableSubstitution). Consequently, this variable can be used to differentiate the actual resource used by a given child appender.

Running the `SiftExample` application with the "byUserid.xml" configuration file shown above, will result in two distinct log files, "unknown.log" and "Alice.log".

**LOCAL-SCOPED VARIABLES** As of version 1.0.12, properties defined in local scope within the configuration file will be available to nested appenders. Moreover, you can [define variables](http://logback.qos.ch/manual/configuration.html#definingProps) or [dynamically compute](http://logback.qos.ch/manual/configuration.html#definingPropsOnTheFly) variables from *within* the the `` element. Combining a variable from parts defined outside and within the `` element is also supported.

#### Getting the timeout right

For certain types of applications, it may be difficult to get the timeout parameter right. If the timeout is too small, a nested appender might be removed just to be created anew a few seconds later. This phenomenon is called *trashing*. If the timeout is too long and appenders are created in quick succession, you might run out of resources. Similarly, setting maxAppenderCount too low might cause trashing as well.

In many case, it may be easier to pinpoint a location in your code after which a nested appender is no longer needed. If such a location exists, even approximately, log from that location using the [FINALIZE_SESSION](http://logback.qos.ch/apidocs/ch/qos/logback/classic/ClassicConstants.html#FINALIZE_SESSION_MARKER) marker. Whenever SiftingAppender sees a logging event marked as `FINALIZE_SESSION` it will end-of-life the associated nested appender. Upon reaching its end-of-life, a nested appender will linger for a few seconds to process any late coming events (if any) and then will be closed.

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

AsyncAppender logs [ILoggingEvent](http://logback.qos.ch/apidocs/ch/qos/logback/classic/spi/ILoggingEvent.html)s asynchronously. It acts solely as an event dispatcher and must therefore reference another appender in order to do anything useful.

**LOSSY BY DEFAULT IF 80% FULL** AsyncAppender buffers events in a [BlockingQueue](http://docs.oracle.com/javase/1.5.0/docs/api/java/util/concurrent/BlockingQueue.html). A worker thread created by `AsyncAppender` takes events from the head of the queue, and dispatches them to the single appender attached to `AsyncAppender`. Note that by default, `AsyncAppender` will drop events of level TRACE, DEBUG and INFO if its queue is 80% full. This strategy has an amazingly favorable effect on performance at the cost of event loss.

**APPLICATION STOP/REDEPLOY** Upon application shutdown or redeploy, `AsyncAppender` must be stopped in order to stop and reclaim the worker thread and to flush the logging events from the queue. This can be achieved by [stopping the LoggerContext](http://logback.qos.ch/manual/configuration.html#stopContext) which will close all appenders, including any `AsyncAppender` instances. `AsyncAppender` will wait for the worker thread to flush up to the timeout specified in maxFlushTime. If you find that queued events are being discarded during close of the `LoggerContext`, you may need to increase the time out. Specifying a value of 0 for maxFlushTime will force the `AsyncAppender` to wait for all queued events to be flushed before returning from the stop method.

**POST SHUTDOWN CLEANUP** Depending on the mode of JVM shutdown, the worker thread processing the queued events can be interrupted causing events to be strandeds in the queue. This generally occurs when the `LoggerContext` is not stopped cleanly or when the JVM terminates outside of the typical control flow. In order to avoid interrupting the worker thread under these conditions, a shutdown hook can be inserted to the JVM runtime that [stops the LoggerContext properly](http://logback.qos.ch/manual/configuration.html#stopContext) after JVM shutdown has been initiated. A shutdown hook may also be the preferred method for cleanly shutting down Logback when other shutdown hooks attempt to log events.

Here is the list of properties admitted by `AsyncAppender:`

| Property Name           | Type      | Description                                                  |
| ----------------------- | --------- | ------------------------------------------------------------ |
| **queueSize**           | `int`     | The maximum capacity of the blocking queue. By default, queueSize is set to 256. |
| **discardingThreshold** | `int`     | By default, when the blocking queue has 20% capacity remaining, it will drop events of level TRACE, DEBUG and INFO, keeping only events of level WARN and ERROR. To keep all events, set discardingThreshold to 0. |
| **includeCallerData**   | `boolean` | Extracting caller data can be rather expensive. To improve performance, by default, caller data associated with an event is not extracted when the event added to the event queue. By default, only "cheap" data like the thread name and the [MDC](http://logback.qos.ch/manual/mdc.html) are copied. You can direct this appender to include caller data by setting the includeCallerData property to true. |
| **maxFlushTime**        | `int`     | Depending on the queue depth and latency to the referenced appender, the `AsyncAppender` may take an unacceptable amount of time to fully flush the queue. When the `LoggerContext` is stopped, the `AsyncAppender stop` method waits up to this timeout for the worker thread to complete. Use maxFlushTime to specify a maximum queue flush timeout in milliseconds. Events that cannot be processed within this window are discarded. Semantics of this value are identical to that of [Thread.join(long)](http://docs.oracle.com/javase/7/docs/api/java/lang/Thread.html#join(long)). |
| **neverBlock**          | `boolean` | If `false` (the default) the appender will block on appending to a full queue rather than losing the message. Set to `true` and the appender will just drop the message and will not block your application. |

By default, event queue is configured with a maximum capacity of 256 events. If the queue is filled up, then application threads are blocked from logging new events until the worker thread has had a chance to dispatch one or more events. When the queue is no longer at its maximum capacity, application threads are able to start logging events once again. Asynchronous logging therefore becomes pseudo-synchronous when the appender is operating at or near the capacity of its event buffer. This is not necessarily a bad thing. The appender is designed to allow the application to keep on running, albeit taking slightly more time to log events until the pressure on the appenders buffer eases.

Optimally tuning the size of the appenders event queue for maximum application throughput depends upon several factors. Any or all of the following factors are likely to cause pseudo-synchronous behavior to be exhibited:

- Large numbers of application threads
- Large numbers of logging events per application call
- Large amounts of data per logging event
- High latency of child appenders

To keep things moving, increasing the size of the queue will generally help, at the expense of heap available to the application.

**LOSSY BEHAVIOR** In light of the discussion above and in order to reduce blocking, by default, when less than 20% of the queue capacity remains, `AsyncAppender` will drop events of level TRACE, DEBUG and INFO keeping only events of level WARN and ERROR. This strategy ensures non-blocking handling of logging events (hence excellent performance) at the cost loosing events of level TRACE, DEBUG and INFO when the queue has less than 20% capacity. Event loss can be prevented by setting the discardingThreshold property to 0 (zero).

Example: `AsyncAppender` configuration (logback-examples/src/main/resources/chapters/appenders/conc/logback-async.xml)

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

You can easily write your appender by subclassing `AppenderBase`. It handles support for filters, status messages and other functionality shared by most appenders. The derived class only needs to implement one method, namely `append(Object eventObject)`.

The `CountingConsoleAppender`, which we list next, appends a limited number of incoming events on the console. It shuts down after the limit is reached. It uses a `PatternLayoutEncoder` to format the events and accepts a parameter named `limit`. Therefore, a few more methods beyond `append(Object eventObject)` are needed. As shown below, these parameters are handles auto-magically by logback's various configuration mechanisms.

*Example 4.: `CountingConsoleAppender` (logback-examples/src/main/java/chapters/appenders/CountingConsoleAppender.java)*

The `start()` method checks for the presence of a `PatternLayoutEncoder`. In case the encoder is not set, the appender fails to start and emits an error message.

This custom appender illustrates two points:

- All properties that follow the setter/getter JavaBeans conventions are handled transparently by logback configurators. The `start()` method, which is called automatically during logback configuration, has the responsibility of verifying that the various properties of the appender are set and are coherent.
- The `AppenderBase.doAppend()` method invokes the append() method of its derived classes. Actual output operations occur in the `append`() method. In particular, it is in this method that appenders format events by invoking their layouts.

The [`CountingConsoleAppender`](http://logback.qos.ch/xref/chapters/appenders/CountingConsoleAppender.html) can be configured like any other appender. See sample configuration file *logback-examples/src/main/resources/chapters/appenders/countingConsole.xml* for an example.

## Logback Access

Most of the appenders found in logback-classic have their equivalent in logback-access. These work essentially in the same way as their logback-classic counterparts. In the next section, we will cover their use.

### SocketAppender and SSLSocketAppender

The [`SocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/SocketAppender.html) is designed to log to a remote entity by transmitting serialized `AccessEvent` objects over the wire. Remote logging is non-intrusive as far as the access event is concerned. On the receiving end after deserialization, the event can be logged as if it were generated locally.

The [`SSLSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/SSLSocketAppender.html) extends the basic `SocketAppender` allowing logging to a remote entity over the Secure Sockets Layer (SSL).

The properties of access' `SocketAppender` are the same as those available for classic's `SocketAppender`.

### ServerSocketAppender and SSLServerSocketAppender

Like `SocketAppender`, the [`ServerSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/server/ServerSocketAppender.html) is designed to log to a remote entity by transmitting serialized `AccessEvent` objects over the wire. However, when using `ServerSocketAppender` the appender acts as a server, passively listening on a TCP socket awaiting inbound connections from interested clients. Logging events delivered to the appender are distributed to all connected clients.

The [`SSLSocketAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/server/SSLServerSocketAppender.html) extends the basic `ServerSocketAppender` allowing logging to a remote entity over the Secure Sockets Layer (SSL).

The properties of access' `ServerSocketAppender` are the same as those available for classic's `ServerSocketAppender`.

### SMTPAppender

Access' [`SMTPAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/net/SMTPAppender.html) works in the same way as its Classic counterpart. However, the evaluator option is rather different. By default, a `URLEvaluator` object is used by `SMTPAppender`. This evaluator contains a list of URLs that are checked against the current request's URL. When one of the pages given to the `URLEvaluator` is requested, `SMTPAppender` sends an email.

Here is a sample configuration of a `SMTPAppender` in the access environment.

Example: `SMTPAppender` configuration (logback-examples/src/main/resources/chapters/appenders/conf/access/logback-smtp.xml)

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

### DBAppender

[`DBAppender`](http://logback.qos.ch/xref/ch/qos/logback/access/db/DBAppender.html) is used to insert the access events into a database.

Two tables are used by `DBAppender`: *access_event* and *access_event_header*. They both must exist before `DBAppender` can be used. Logback ships with SQL scripts that will create the tables. They can be found in the *logback-access/src/main/java/ch/qos/logback/access/db/script* directory. There is a specific script for each of the most popular database systems. If the script for your particular type of database system is missing, it should be quite easy to write one, taking as example one of the existing scripts. You are encouraged to contribute such missing scripts back to the project.

The *access_event* table's fields are described below:

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

| Field            | Type      | Description                                                  |
| ---------------- | --------- | ------------------------------------------------------------ |
| **event_id**     | `int`     | The database id of the corresponding access event.           |
| **header_key**   | `varchar` | The header name, for example *User-Agent*.                   |
| **header_value** | `varchar` | The header value, for example *Mozilla/5.0 (Windows; U; Windows NT 5.1; fr; rv:1.8.1) Gecko/20061010 Firefox/2.0* |

All properties of classic's `DBAppender` are available in access's `DBAppender`. The latter offers one more option, described below.

| Property Name           | Type      | Description                                                  |
| ----------------------- | --------- | ------------------------------------------------------------ |
| ***\*insertHeaders\**** | `boolean` | Tells the `DBAppender` to populate the database with the header information of all incoming requests. |

Here is a sample configuration that uses `DBAppender`.

Example: DBAppender configuration *(logback-examples/src/main/resources/chapters/appenders/conf/access/logback-DB.xml)*

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

The SiftingAppender in logback-access is quite similar to its logback-classic counterpart. The main difference is that in logback-access the default discriminator, namely [AccessEventDiscriminator](http://logback.qos.ch/xref/ch/qos/logback/access/sift/AccessEventDiscriminator.html), is not MDC based. As its name suggests, AccessEventDiscriminator, uses a designated field in AccessEvent as the basis for selecting a nested appender. If the value of the designated field is null, then the value specified in the defaultValue property is used.

The designated AccessEvent field can be one of COOKIE, REQUEST_ATTRIBUTE, SESSION_ATTRIBUTE, REMOTE_ADDRESS, LOCAL_PORT, REQUEST_URI. Note that the first three fields require that the AdditionalKey property also be specified.

Below is an example configuration file.

Example: SiftingAppender configuration (logback-examples/src/main/resources/chapters/appenders/conf/sift/access-siftingFile.xml)

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




<http://logback.qos.ch/manual/appenders.html>
