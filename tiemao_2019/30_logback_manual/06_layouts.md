#  Chapter 6: Layouts

TCP implementations will follow a general principle of robustness: be conservative in what you do, be liberal in what you accept from others.

—JON POSTEL, RFC 793

In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](http://logback.qos.ch/setup.html) for further details.

## What is a layout?

In case you were wondering, layouts have nothing to do with large estates in Florida. Layouts are logback components responsible for transforming an incoming event into a String. The `format()` method in the [`Layout`](http://logback.qos.ch/xref/ch/qos/logback/core/Layout.html) interface takes an object that represents an event (of any type) and returns a String. A synopsis of the `Layout` interface is shown below.

```
public interface Layout<E> extends ContextAware, LifeCycle {

  String doLayout(E event);
  String getFileHeader();
  String getPresentationHeader();
  String getFileFooter();
  String getPresentationFooter();
  String getContentType();
}
```

This interface is rather simple and yet is sufficient for many formatting needs. The Texan developer from Texas, whom you might know from Joseph Heller's *Catch-22*, might exclaim: it just takes five methods to implement a layout!!?

## Logback-classic

Logback-classic is wired to process only events of type [`ch.qos.logback.classic.spi.ILoggingEvent`](http://logback.qos.ch/xref/ch/qos/logback/classic/spi/ILoggingEvent.html). This fact will be apparent throughout this section.

## Writing your own custom Layout

Let us implement a simple yet functional layout for the logback-classic module that prints the time elapsed since the start of the application, the level of the logging event, the caller thread between brackets, its logger name, a dash followed by the event message and a new line.

Sample output might look like:

10489 DEBUG [main] com.marsupial.Pouch - Hello world.

Here is a possible implementation, authored by the Texan developer:

*Example: Sample implementation of a Layout [(logback-examples/src/main/java/chapters/layouts/MySampleLayout.java)](http://logback.qos.ch/xref/chapters/layouts/MySampleLayout.html)*

Note that `MySampleLayout` extends [`LayoutBase`](http://logback.qos.ch/xref/ch/qos/logback/core/LayoutBase.html). This class manages state common to all layout instances, such as whether the layout is started or stopped, header, footer and content type data. It allows the developer to concentrate on the formatting expected from his/her `Layout`. Note that the `LayoutBase` class is generic. In its class declaration, `MySampleLayout` extends `LayoutBase`.

The `doLayout(ILoggingEvent event)` method, i.e. the only method in `MySampleLayout`, begins by instantiating a `StringBuffer`. It proceeds by adding various fields of the event parameter. The Texan from Texas was careful to print the formatted form of the message. This is significant if one or more parameters were passed along with the logging request.

After adding these various characters to the string buffer, the `doLayout()` method converts the buffer into a `String` and returns the resulting value.

In the above example, the `doLayout` method ignores any eventual exceptions contained in the event. In a real world layout implementation, you would most probably want to print the contents of exceptions as well.

### Configuring your custom layout

Custom layouts are configured as any other component. As mentioned earlier, `FileAppender` and its sub-classes expect an encoder. In order to fulfill this requirement, we pass to `FileAppender` an instance of `LayoutWrappingEncoder` which wraps our `MySampleLayout`. Here is the configuration file:

*Example: Configuration of MySampleLayout (logback-examples/src/main/resources/chapters/layouts/sampleLayoutConfig.xml)*

```
<configuration>

  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
      <layout class="chapters.layouts.MySampleLayout" />
    </encoder>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="STDOUT" />
  </root>
</configuration>
```

The sample application [`chapters.layouts.SampleLogging`](http://logback.qos.ch/xref/chapters/layouts/SampleLogging.html) configures logback with the configuration script passed as its first argument and then logs a debug message, followed by an error message.

To run this example issue the following command from within the *logback-examples* directory.

java chapters.layouts.SampleLogging src/main/java/chapters/layouts/sampleLayoutConfig.xml

This will produce:

```
0 DEBUG [main] chapters.layouts.SampleLogging - Everything's going well
0 ERROR [main] chapters.layouts.SampleLogging - maybe not quite...
```

That was simple enough. The skeptic Pyrrho of Elea, who insists that nothing is certain except perhaps uncertainty itself, which is by no means certain either, might ask: how about a layout with options? The reader shall find a slightly modified version of our custom layout in [`MySampleLayout2.java`](http://logback.qos.ch/xref/chapters/layouts/MySampleLayout2.html). As mentioned throughout this manual, adding a property to a layout or any other logback component is as simple as declaring a setter method for the property.

The [`MySampleLayout2`](http://logback.qos.ch/xref/chapters/layouts/MySampleLayout2.html) class contains two properties. The first one is a prefix that can be added to the output. The second property is used to choose whether to display the name of the thread from which the logging request was sent.

Here is a copy of the [`MySampleLayout2`](http://logback.qos.ch/xref/chapters/layouts/MySampleLayout2.html) class :

```
package chapters.layouts;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.LayoutBase;

public class MySampleLayout2 extends LayoutBase<ILoggingEvent> {

  String prefix = null;
  boolean printThreadName = true;

  public void setPrefix(String prefix) {
    this.prefix = prefix;
  }

  public void setPrintThreadName(boolean printThreadName) {
    this.printThreadName = printThreadName;
  }

  public String doLayout(ILoggingEvent event) {
    StringBuffer sbuf = new StringBuffer(128);
    if (prefix != null) {
      sbuf.append(prefix + ": ");
    }
    sbuf.append(event.getTimeStamp() - event.getLoggerContextVO().getBirthTime());
    sbuf.append(" ");
    sbuf.append(event.getLevel());
    if (printThreadName) {
      sbuf.append(" [");
      sbuf.append(event.getThreadName());
      sbuf.append("] ");
    } else {
      sbuf.append(" ");
    }
    sbuf.append(event.getLoggerName());
    sbuf.append(" - ");
    sbuf.append(event.getFormattedMessage());
    sbuf.append(LINE_SEP);
    return sbuf.toString();
  }
}
```

The addition of the corresponding setter method is all that is needed to enable the configuration of a property. Note that the `PrintThreadName` property is a boolean and not a `String`. Configuration of logback components was covered in detail in the [chapter on configuration](http://logback.qos.ch/manual/configuration.html). The [chapter on Joran](http://logback.qos.ch/manual/onJoran.html) provides further detail. Here is the configuration file tailor made for `MySampleLayout2`.

View as .groovy

```
<configuration>

  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
      <layout class="chapters.layouts.MySampleLayout2"> 
        <prefix>MyPrefix</prefix>
        <printThreadName>false</printThreadName>
      </layout>
    </encoder>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="STDOUT" />
  </root>
</configuration>
```



## PatternLayout

Logback classic ships with a flexible layout called [`PatternLayout`](http://logback.qos.ch/xref/ch/qos/logback/classic/PatternLayout.html). As all layouts, `PatternLayout` takes a logging event and returns a `String`. However, this `String` can be customized by tweaking `PatternLayout`'s conversion pattern.

The conversion pattern of `PatternLayout` is closely related to the conversion pattern of the `printf()` function in the C programming language. A conversion pattern is composed of literal text and format control expressions called *conversion specifiers*. You are free to insert any literal text within the conversion pattern. Each conversion specifier starts with a percent sign '%' and is followed by optional *format modifiers*, a *conversion word* and optional parameters between braces. The conversion word controls the data field to convert, e.g. logger name, level, date or thread name. The format modifiers control field width, padding, and left or right justification.

As already mentioned on several occasions, `FileAppender` and sub-classes expect an encoder. Consequently, when used in conjunction with `FileAppender` or its subclasses a `PatternLayout` must be wrapped within an encoder. Given that the `FileAppender`/`PatternLayout` combination is so common, logback ships with an encoder named `PatternLayoutEncoder`, designed solely for the purpose of wrapping a `PatternLayout` instance so that it can be seen as encoder. Below is an example which programmatically configures a `ConsoleAppender` with a `PatternLayoutEncoder`:

*Example: Sample usage of a PatternLayout [(logback-examples/src/main/java/chapters/layouts/PatternSample.java)](http://logback.qos.ch/xref/chapters/layouts/PatternSample.html)*

In the above example, the conversion pattern is set to be **"%-5level [%thread]: %message%n"**. A synopsis of conversion word included in logback will be given shortly. Running `PatternSample` application as:

java java chapters.layouts.PatternSample

will yield the following output on the console.

DEBUG [main]: Message 1  WARN  [main]: Message 2

Note that in the conversion pattern **"%-5level [%thread]: %message%n"** there is no explicit separator between literal text and conversion specifiers. When parsing a conversion pattern, `PatternLayout` is capable of differentiating between literal text (space characters, the brackets, colon character) and conversion specifiers. In the example above, the conversion specifier %-5level means the level of the logging event should be left justified to a width of five characters. Format specifiers will be explained below.

In `PatternLayout`, parenthesis can be used to group conversion patterns. **It follows that the '(' and ')' carry special meaning and need to be escaped if intended to be used as literals.** The special nature of parenthesis is further [explained below](http://logback.qos.ch/manual/layouts.html#Parentheses).

As mentioned previously, certain conversion specifiers may include optional parameters passed between braces. A sample conversion specifier with options could be `%logger{10}`. Here "logger" is the conversion word, and 10 is the option. Options are [further discussed below](http://logback.qos.ch/manual/layouts.html#cwOptions).

The recognized conversions words along with their options are described in the table below. When multiple conversion words are listed in the same table cell, they are considered as aliases.

| [Conversion Word](http://logback.qos.ch/manual/layouts.html#conversionWord) | Effect                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| **c**{*length*} **lo**{*length*} **logger**{*length*}        | Outputs the name of the logger at the origin of the logging event.This conversion word takes an integer as its first and only option. The converter's abbreviation algorithm will shorten the logger name, usually without significant loss of meaning. Setting the value of length option to zero constitutes an exception. It will cause the conversion word to return the sub-string right to the rightmost dot character in the logger name. The next table provides examples of the abbreviation algorithm in action.Conversion specifierLogger nameResult%loggermainPackage.sub.sample.BarmainPackage.sub.sample.Bar%logger{0}mainPackage.sub.sample.BarBar%logger{5}mainPackage.sub.sample.Barm.s.s.Bar%logger{10}mainPackage.sub.sample.Barm.s.s.Bar%logger{15}mainPackage.sub.sample.Barm.s.sample.Bar%logger{16}mainPackage.sub.sample.Barm.sub.sample.Bar%logger{26}mainPackage.sub.sample.BarmainPackage.sub.sample.BarPlease note that the rightmost segment in a logger name is never abbreviated, even if its length is longer than the *length* option. Other segments may be shortened to at most a single character but are never removed. |
| **C**{*length*} **class**{*length*}                          | Outputs the fully-qualified class name of the caller issuing the logging request.Just like the *%logger* conversion word above, this conversion takes an integer as an option to shorten the class name. Zero carries special meaning and will cause the simple class name to be printed without the package name prefix. By default the class name is printed in full.Generating the caller class information is not particularly fast. Thus, its use should be avoided unless execution speed is not an issue. |
| **contextName** **cn**                                       | Outputs the name of the logger context to which the logger at the origin of the event was attached to. |
| **d**{*pattern*} **date**{*pattern*} **d**{*pattern*, *timezone*} **date**{*pattern*, *timezone*} | Used to output the date of the logging event. The date conversion word admits a pattern string as a parameter. The pattern syntax is compatible with the format accepted by [`java.text.SimpleDateFormat`](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html).You can specify the string *"ISO8601"* for the ISO8601 date format. Note that the %date conversion word defaults to the [ISO 8601 date format](http://en.wikipedia.org/wiki/ISO_8601) in the absence of a pattern parameter.Here are some sample parameter values. They assume that the actual date is Friday 20th of October, 2006 and that the author has returned to working on this document just after lunch.Conversion PatternResult%d2006-10-20 14:06:49,812%date2006-10-20 14:06:49,812%date{ISO8601}2006-10-20 14:06:49,812%date{HH:mm:ss.SSS}14:06:49.812%date{dd MMM yyyy;HH:mm:ss.SSS}20 oct. 2006;14:06:49.812The second parameter specifies a timezone. For example, the '%date{HH:mm:ss.SSS, Australia/Perth} would print the time in the time zone of Perth, Australia, the world's most isolated city. Note that in the absence of the timezone parameter, the default timezone of the host Java platform is used. If the specified timezone identifier is unknown or misspelled, the GMT timezone is assumed as dictated by the [TimeZone.getTimeZone(String)](http://docs.oracle.com/javase/6/docs/api/java/util/TimeZone.html#getTimeZone(java.lang.String)) method specification.**COMMON ERROR** Given that the comma ',' character is interpreted as the parameter separator, the pattern `HH:mm:ss,SSS` will be interpreted as the pattern `HM:mm:ss` and the timezone `SSS`. If you wish to include a comma in your date pattern, then simply enclose the pattern between quotes. For example, %date{**"**HH:mm:ss,SSS**"**}. |
| **F / file**                                                 | Outputs the file name of the Java source file where the logging request was issued.Generating the file information is not particularly fast. Thus, its use should be avoided unless execution speed is not an issue. |
| **caller{depth}** **caller{depthStart..depthEnd}** **caller{depth, evaluator-1, ... evaluator-n}** **caller{depthStart..depthEnd, evaluator-1, ... evaluator-n}** | Outputs location information of the caller which generated the logging event.The location information depends on the JVM implementation but usually consists of the fully qualified name of the calling method followed by the caller's source, the file name and line number between parentheses.A integer can be added to the *caller* conversion specifier's options to configure the depth of the information to be displayed.For example, **%caller{2}** would display the following excerpt:`0    [main] DEBUG - logging statement  Caller+0   at mainPackage.sub.sample.Bar.sampleMethodName(Bar.java:22) Caller+1   at mainPackage.sub.sample.Bar.createLoggingRequest(Bar.java:17)`And **%caller{3}** would display this other excerpt:`16   [main] DEBUG - logging statement  Caller+0   at mainPackage.sub.sample.Bar.sampleMethodName(Bar.java:22) Caller+1   at mainPackage.sub.sample.Bar.createLoggingRequest(Bar.java:17) Caller+2   at mainPackage.ConfigTester.main(ConfigTester.java:38)`A range specifier can be added to the *caller* conversion specifier's options to configure the depth range of the information to be displayed.For example, **%caller{1..2}** would display the following excerpt:`0    [main] DEBUG - logging statement Caller+0   at mainPackage.sub.sample.Bar.createLoggingRequest(Bar.java:17)`This conversion word can also use evaluators to test logging events against a given criterion before computing caller data. For example, using **%caller{3, CALLER_DISPLAY_EVAL}** will display three lines of stacktrace, only if the evaluator called *CALLER_DISPLAY_EVAL* returns a **positive** answer.Evaluators are described below. |
| **L / line**                                                 | Outputs the line number from where the logging request was issued.Generating the line number information is not particularly fast. Thus, its use should be avoided unless execution speed is not an issue. |
| **m / msg / message**                                        | Outputs the application-supplied message associated with the logging event. |
| **M / method**                                               | Outputs the method name where the logging request was issued.Generating the method name is not particularly fast. Thus, its use should be avoided unless execution speed is not an issue. |
| **n**                                                        | Outputs the platform dependent line separator character or characters.This conversion word offers practically the same performance as using non-portable line separator strings such as "\n", or "\r\n". Thus, it is the preferred way of specifying a line separator. |
| **p / le / level**                                           | Outputs the level of the logging event.                      |
| **r / relative**                                             | Outputs the number of milliseconds elapsed since the start of the application until the creation of the logging event. |
| **t / thread**                                               | Outputs the name of the thread that generated the logging event. |
| **X**{*key:-defaultVal*} **mdc**{*key:-defaultVal*}          | Outputs the MDC (mapped diagnostic context) associated with the thread that generated the logging event.If the **mdc** conversion word is followed by a key between braces, as in **%mdc{userid}**, then the MDC value corresponding to the key 'userid' will be output. If the value is null, then the [default value](http://logback.qos.ch/manual/configuration.html#defaultValuesForVariables) specified after the **:-** operator is output. If no default value is specified than the empty string is output.If no key is given, then the entire content of the MDC will be output in the format "key1=val1, key2=val2".See the [chapter on MDC](http://logback.qos.ch/manual/mdc.html) for more details on the subject. |
| **ex**{*depth*} **exception**{*depth*} **throwable**{*depth*}  **ex**{depth, evaluator-1, ..., evaluator-n} **exception**{depth, evaluator-1, ..., evaluator-n} **throwable**{depth, evaluator-1, ..., evaluator-n} | Outputs the stack trace of the exception associated with the logging event, if any. By default the full stack trace will be output.The *throwable* conversion word can followed by one of the following options:*short*: prints the first line of the stack trace*full*: prints the full stack traceAny integer: prints the given number of lines of the stack traceHere are some examples:Conversion PatternResult%ex`mainPackage.foo.bar.TestException: Houston we have a problem  at mainPackage.foo.bar.TestThrower.fire(TestThrower.java:22)  at mainPackage.foo.bar.TestThrower.readyToLaunch(TestThrower.java:17)  at mainPackage.ExceptionLauncher.main(ExceptionLauncher.java:38)`%ex{short}`mainPackage.foo.bar.TestException: Houston we have a problem  at mainPackage.foo.bar.TestThrower.fire(TestThrower.java:22)`%ex{full}`mainPackage.foo.bar.TestException: Houston we have a problem  at mainPackage.foo.bar.TestThrower.fire(TestThrower.java:22)  at mainPackage.foo.bar.TestThrower.readyToLaunch(TestThrower.java:17)  at mainPackage.ExceptionLauncher.main(ExceptionLauncher.java:38)`%ex{2}`mainPackage.foo.bar.TestException: Houston we have a problem  at mainPackage.foo.bar.TestThrower.fire(TestThrower.java:22)  at mainPackage.foo.bar.TestThrower.readyToLaunch(TestThrower.java:17)`This conversion word can also use evaluators to test logging events against a given criterion before creating the output. For example, using **%ex{full, EX_DISPLAY_EVAL}** will display the full stack trace of the exception only if the evaluator called *EX_DISPLAY_EVAL* returns a **negative** answer. Evaluators are described further down in this document.If you do not specify %throwable or another throwable-related conversion word in the conversion pattern, `PatternLayout` will automatically add it as the last conversion word, on account of the importance of stack trace information. The $nopex conversion word can be substituted for %throwable, if you do not wish stack trace information to be displayed. See also the %nopex conversion word. |
| **xEx**{*depth*} **xException**{*depth*} **xThrowable**{*depth*}  **xEx**{depth, evaluator-1, ..., evaluator-n} **xException**{depth, evaluator-1, ..., evaluator-n} **xThrowable**{depth, evaluator-1, ..., evaluator-n} | Same as the %throwable conversion word above with the addition of class packaging information.At the end of each stack frame of the exception, a string consisting of the jar file containing the relevant class followed by the "Implementation-Version" as found in that jar's manifest will be added. This innovative technique was [originally suggested by James Strachan](http://macstrac.blogspot.com/2008/09/better-stack-traces-in-java-with-log4j.html). If the information is uncertain, then the class packaging data will be preceded by a tilde, i.e. the '~' character.Here is an example:java.lang.NullPointerException  at com.xyz.Wombat(Wombat.java:57) **~[wombat-1.3.jar:1.3]**  at  com.xyz.Wombat(Wombat.java:76) ~[wombat-1.3.jar:1.3]  at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:1.5.0_06]  at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:39) ~[na:1.5.0_06]  at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:25) ~[na:1.5.0_06]  at java.lang.reflect.Method.invoke(Method.java:585) ~[na:1.5.0_06]  at org.junit.internal.runners.TestMethod.invoke(TestMethod.java:59) [junit-4.4.jar:na]  at org.junit.internal.runners.MethodRoadie.runTestMethod(MethodRoadie.java:98) [junit-4.4.jar:na]  ...etc Logback goes to great lengths to ensure that the class packaging information it displays is correct, even in arbitrarily complex class loader hierarchies. However, when it is unable to guarantee the absolute correctness of the information, then it will prefix the data with a tilde, i.e. the '~' character. Thus, it is theoretically possible for the printed class packaging information to differ from the real class packaging information. So, in the above example, given that packaging data for the Wombat class is preceded by a tilde, it is possible that the correct packaging data is in reality [wombat.jar:1.7].Please note that given its potential cost, computation of [**packaging data is disabled by default**](http://logback.qos.ch/manual/configuration.html#packagingData). When computation of packaging data is enabled, `PatternLayout` will automatically assume the %xThrowable suffix instead of %throwable suffix at the end of the pattern string.[Feedback from users](http://jira.qos.ch/browse/LBCLASSIC-212) indicates that Netbeans chokes on packaging information. |
| **nopex** **nopexception**                                   | Although it *pretends* to handle stack trace data, this conversion word does not output any data, thus, effectively ignoring exceptions.The %nopex conversion word allows the user to override `PatternLayout`'s internal safety mechanism which silently adds the %xThrowable conversion keyword in the absence of another conversion word handling exceptions. |
| **marker**                                                   | Outputs the marker associated with the logger request.In case the marker contains children markers, the converter displays the parent as well as childrens' names according to the format shown below.*parentName [ child1, child2 ]* |
| **property{key}**                                            | Outputs the value associated with a property named *key*. The the relevant docs on how to define ion entitled [define variables](http://logback.qos.ch/manual/configuration.html#variableSubstitution) and [variable scopes](http://logback.qos.ch/manual/configuration.html#scopes). If *key* is not a property of the logger context, then *key* will be looked up in the System properties.There is no default value for *key*. If it is omitted, the returned value will be "Property_HAS_NO_KEY", expliciting the error condition. |
| **replace(\*p\*){r, t}**                                     | Replaces occurrences of 'r', a regex, with its replacement 't' in the string produces by the sub-pattern 'p'. For example, "%replace(%msg){'\s', ''}" will remove all spaces contained in the event message.The pattern 'p' can be arbitrarily complex and in particular can contain multiple conversion keywords. For instance, "%replace(%logger %msg){'\.', '/'}" will replace all dots in the logger or the message of the event with a forward slash. |
| **rEx**{*depth*} **rootException**{*depth*}  **rEx**{depth, evaluator-1, ..., evaluator-n} **rootException**{depth, evaluator-1, ..., evaluator-n} | Outputs the stack trace of the exception associated with the logging event, if any. The root cause will be output first instead of the standard "root cause last". Here is a sample output (edited for space):`java.lang.NullPointerException  at com.xyz.Wombat(Wombat.java:57) ~[wombat-1.3.jar:1.3]  at com.xyz.Wombat(Wombat.java:76) ~[wombat-1.3.jar:1.3] Wrapped by: org.springframework.BeanCreationException: Error creating bean with name 'wombat':   at org.springframework.AbstractBeanFactory.getBean(AbstractBeanFactory.java:248) [spring-2.0.jar:2.0]  at org.springframework.AbstractBeanFactory.getBean(AbstractBeanFactory.java:170) [spring-2.0.jar:2.0]  at org.apache.catalina.StandardContext.listenerStart(StandardContext.java:3934) [tomcat-6.0.26.jar:6.0.26] `The %rootException converter admits the same optional parameters as the %xException converter described above, including depth and evaluators. It outputs also packaging information. In short, %rootException is very similar to %xException, only the order of exception output is reversed.Tomasz Nurkiewicz, the author of %rootException converter, documents his contribution in a blog entry entitled ["Logging exceptions root cause first"](http://nurkiewicz.blogspot.com/2011/09/logging-exceptions-root-cause-first.html). |

#### % character has special meaning

Given that in the context of conversion patterns the percent sign carries special meaning, in order to include it as a literal, it needs to be escaped with a backslash, e.g. "%d %p **\%** %m%n".

#### Restrictions on literals immediately following conversion words

In most cases literals naturally contain spaces or other delimiting characters so that they are not confused with conversion words. For example, the pattern "%level [%thread] - %message%n" contains the string literals `" ["` and `"] - "`. However, if a character which can be part of a java identifier immediately follows a conversion word, logback's pattern parser will be fooled into thinking that the literal is part of the conversion word. For example, the pattern "%date**%nHello**" will be interpreted as two conversion words %date and %nHello and since %nHello is not a known conversion word, logback will output %PARSER_ERROR[nHello] for %nHello. If you wish the string literal "Hello" to immediately separate %n and Hello, pass an empty argument list to %n. For example, "%date**%n{}**Hello" will be interpreted as %date followed by %n followed by the literal "Hello".

## Format modifiers

By default the relevant information is output as-is. However, with the aid of format modifiers it is possible to change the minimum and maximum width and the justifications of each data field.

The optional format modifier is placed between the percent sign and the conversion character or word.

The first optional format modifier is the *left justification flag* which is just the minus (-) character. Then comes the optional *minimum field width* modifier. This is a decimal constant that represents the minimum number of characters to output. If the data item contains fewer characters, it is padded on either the left or the right until the minimum width is reached. The default is to pad on the left (right justify) but you can specify right padding with the left justification flag. The padding character is space. If the data item is larger than the minimum field width, the field is expanded to accommodate the data. The value is never truncated.

This behavior can be changed using the *maximum field width* modifier which is designated by a period followed by a decimal constant. If the data item is longer than the maximum field, then the extra characters are removed from the *beginning* of the data item. For example, if the maximum field width is eight and the data item is ten characters long, then the first two characters of the data item are dropped. This behavior deviates from the printf function in C where truncation is done from the end.

Truncation from the end is possible by appending a minus character right after the period. In that case, if the maximum field width is eight and the data item is ten characters long, then the last two characters of the data item are dropped.

Below are various format modifier examples for the logger conversion specifier.

| Format modifier | Left justify | Minimum width | Maximum width | Comment                                                      |
| --------------- | ------------ | ------------- | ------------- | ------------------------------------------------------------ |
| %20logger       | false        | 20            | none          | Left pad with spaces if the logger name is less than 20 characters long. |
| %-20logger      | true         | 20            | none          | Right pad with spaces if the logger name is less than 20 characters long. |
| %.30logger      | NA           | none          | 30            | Truncate from the beginning if the logger name is longer than 30 characters. |
| %20.30logger    | false        | 20            | 30            | Left pad with spaces if the logger name is shorter than 20 characters. However, if logger name is longer than 30 characters, then truncate from the beginning. |
| %-20.30logger   | true         | 20            | 30            | Right pad with spaces if the logger name is shorter than 20 characters. However, if logger name is longer than 30 characters, then truncate from the *beginning*. |
| %.-30logger     | NA           | none          | 30            | Truncate from the *end* if the logger name is longer than 30 characters. |

The table below list examples for format modifier truncation. Please note that the square brackets, i.e the pair of "[]" characters, are not part of the output. They are used to delimit the width of output.

| Format modifier | Logger name           | Result                   |
| --------------- | --------------------- | ------------------------ |
| [%20.20logger]  | main.Name             | `[           main.Name]` |
| [%-20.20logger] | main.Name             | `[main.Name           ]` |
| [%10.10logger]  | main.foo.foo.bar.Name | `[o.bar.Name]`           |
| [%10.-10logger] | main.foo.foo.bar.Name | `[main.foo.f]`           |

### Output just one letter for the level

Instead of printing TRACE, DEBUG, WARN, INFO or ERROR for the level, you may want to print just T, D, W, I and E. You could write a [custom converter](http://logback.qos.ch/manual/layouts.html#customConversionSpecifier) for this purpose, or simply make use of format modifiers (just discussed) to shorten the level value to a single character. The appropriate conversion specifier would be "`%.-1level`".

## Conversion word options

A conversion specifier can be followed by options. The are always declared between braces. We have already seen some of the possibilities offered by options, for instance in conjunction with the MDC conversion specifier, as in: *%mdc{someKey}*.

A conversion specifier might have more than one option. For example, a conversion specifier that makes use of evaluators, which will be covered soon, may add evaluator names to the option list, as shown below:

```
<pattern>%-4relative [%thread] %-5level - %msg%n \
  %caller{2, DISP_CALLER_EVAL, OTHER_EVAL_NAME, THIRD_EVAL_NAME}</pattern>
```

If the option includes special characters such as a braces, spaces or commas, you can enclose it between single or double quotes. For example, consider the next pattern.

```
<pattern>%-5level - %replace(%msg){'\d{14,16}', 'XXXX'}%n</pattern>
```

We pass the options `\d{16}` and `XXXX` to the `replace` conversion word. It replaces any sequence of 14, 15 or 16 digits contained in the message with XXXX effectively obfuscating credit card numbers. Note that "\d" which is a shorthand for a single digit in regular expressions. The "{14,16\}" is interpreted as "{14, 16}", that is, repeat the previous item at least 14 but at most 16 times.

## Parentheses are special

In logback, parentheses within the pattern string are treated as grouping tokens. Thus, it is possible to group a sub-pattern and apply formatting directives on that sub-pattern. As of version 0.9.27, logback supports composite conversion words such as [%replace](http://logback.qos.ch/manual/layouts.html#replace) which can transform sub-patterns.

For example, the pattern

**%-30(**%d{HH:mm:ss.SSS} [%thread]**)** %-5level %logger{32} - %msg%n

will group the output generated by the sub-pattern "%d{HH:mm:ss.SSS} [%thread]" so that it is right-padded if less than 30 characters.

If without the grouping the output was

13:09:30 [main] DEBUG c.q.logback.demo.ContextListener - Classload hashcode is 13995234 13:09:30 [main] DEBUG c.q.logback.demo.ContextListener - Initializing for ServletContext 13:09:30 [main] DEBUG c.q.logback.demo.ContextListener - Trying platform Mbean server 13:09:30 [pool-1-thread-1] INFO  ch.qos.logback.demo.LoggingTask - Howdydy-diddly-ho - 0 13:09:38 [btpool0-7] INFO c.q.l.demo.lottery.LotteryAction - Number: 50 was tried. 13:09:40 [btpool0-7] INFO c.q.l.d.prime.NumberCruncherImpl - Beginning to factor. 13:09:40 [btpool0-7] DEBUG c.q.l.d.prime.NumberCruncherImpl - Trying 2 as a factor. 13:09:40 [btpool0-7] INFO c.q.l.d.prime.NumberCruncherImpl - Found factor 2    

with the "%-30()" grouping it would be

13:09:30 [main]            DEBUG c.q.logback.demo.ContextListener - Classload hashcode is 13995234 13:09:30 [main]            DEBUG c.q.logback.demo.ContextListener - Initializing for ServletContext 13:09:30 [main]            DEBUG c.q.logback.demo.ContextListener - Trying platform Mbean server 13:09:30 [pool-1-thread-1] INFO  ch.qos.logback.demo.LoggingTask - Howdydy-diddly-ho - 0 13:09:38 [btpool0-7]       INFO  c.q.l.demo.lottery.LotteryAction - Number: 50 was tried. 13:09:40 [btpool0-7]       INFO  c.q.l.d.prime.NumberCruncherImpl - Beginning to factor. 13:09:40 [btpool0-7]       DEBUG c.q.l.d.prime.NumberCruncherImpl - Trying 2 as a factor. 13:09:40 [btpool0-7]       INFO  c.q.l.d.prime.NumberCruncherImpl - Found factor 2    

The latter form is more comfortable to read.

If you need to treat the parenthesis character as a literal, it needs to be escaped by preceding each parenthesis with a backslash. As in, **\(**%d{HH:mm:ss.SSS} [%thread]**\)**.

## Coloring

Grouping by [parentheses](http://logback.qos.ch/manual/layouts.html#Parentheses) as explained above allows coloring of sub-patterns. As of version 1.0.5, `PatternLayout` recognizes "%black", "%red", "%green","%yellow","%blue", "%magenta","%cyan", "%white", "%gray", "%boldRed","%boldGreen", "%boldYellow", "%boldBlue", "%boldMagenta""%boldCyan", "%boldWhite" and "%highlight" as conversion words. These conversion words are intended to contain a sub-pattern. Any sub-pattern enclosed by a coloring word will be output in the specified color.

Below is a configuration file illustrating coloring. Note the %cyan conversion specifier enclosing "%logger{15}". This will output the logger name abbreviated to 15 characters in cyan. The %highlight conversion specifier prints its sub-pattern in bold-red for events of level ERROR, in red for WARN, in BLUE for INFO, and in the default color for other levels.

*Example: Highlighting levels (logback-examples/src/main/resources/chapters/layouts/highlighted.xml)*

```
<configuration debug="true">
  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <withJansi>true</withJansi>
    <encoder>
      <pattern>[%thread] %highlight(%-5level) %cyan(%logger{15}) - %msg %n</pattern>
    </encoder>
  </appender>
  <root level="DEBUG">
    <appender-ref ref="STDOUT" />
  </root>
</configuration>
```

Setting `withJansi` to true enables ANSI color code interpretation by the Jansi library, which transparently filters out ANSI escape sequences if the underlying terminal is not compatible. This is the safest choice for cross-platform deployments, but requires org.fusesource.jansi:jansi:1.17 or higher on the class path. Note that Unix-based operating systems such as Linux and Mac OS X support ANSI color codes natively and usually do not require enabling the Jansi library, but doing so is harmless. On Windows however, enabling Jansi is recommended to benefit from color code interpretation on DOS command prompts, which otherwise risk being sent ANSI escape sequences that they cannot interpret.

Here is the corresponding output:

```
[main] WARN  c.l.TrivialMain - a warning message 0
[main] DEBUG c.l.TrivialMain - hello world number1
[main] DEBUG c.l.TrivialMain - hello world number2
[main] INFO  c.l.TrivialMain - hello world number3
[main] DEBUG c.l.TrivialMain - hello world number4
[main] WARN  c.l.TrivialMain - a warning message 5
[main] ERROR c.l.TrivialMain - Finish off with fireworks
```

It takes very few lines of code to create a coloring conversion word. The section entitled [creating a custom conversion specifier](http://logback.qos.ch/manual/layouts.html#customConversionSpecifier) discusses the steps necessary for registering a conversion word in your configuration file.

## Evaluators

As mentioned above, option lists come in handy when a conversion specifier is required to behave dynamically based on one or more [`EventEvaluator`](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/EventEvaluator.html) objects. `EventEvaluator` objects have the responsibility to determine whether a given logging event matches the criteria of the evaluator.

Let us review an example involving a `EventEvaluator`. The next configuration file outputs the logging events to the console, displaying date, thread, level, message and caller data. Given that extracting the caller data of a logging event is on the expensive side, we will do so only when the logging request originates from a specific logger, and when the message contains a certain string. Thus, we make sure that only specific logging requests will have their caller information generated and displayed. In other cases, where the caller data is superfluous, we will not penalize application performance.

Evaluators and in particular *evaluation expressions* are presented in a [dedicated section of the chapter on filters](http://logback.qos.ch/manual/filters.html#evalutatorFilter) which you MUST read if you want to use evaluators in any meaningful way. Also note that the examples below are implicitly based on `JaninoEventEvaluator` which requires the [Janino library](http://docs.codehaus.org/display/JANINO/Home). Please see the [corresponding section](http://logback.qos.ch/setup.html#janino) of the setup document.

*Example: Sample usage of EventEvaluators (logback-examples/src/main/resources/chapters/layouts/callerEvaluatorConfig.xml)*

```
<configuration>
  <evaluator name="DISP_CALLER_EVAL">
    <expression>logger.contains("chapters.layouts") &amp;&amp; \
      message.contains("who calls thee")</expression>
  </evaluator>

  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender"> 
    <encoder>
      <pattern>
        %-4relative [%thread] %-5level - %msg%n%caller{2, DISP_CALLER_EVAL}
      </pattern>
    </encoder>
  </appender>

  <root level="DEBUG"> 
    <appender-ref ref="STDOUT" /> 
  </root>
</configuration>
```

The above evaluation expression matches events which emanate from a logger with a name containing the string "chapters.layouts" and the message contains the string "who calls thee". Due to XML encoding rules, the & character cannot be written as is, and needs to be escaped as &amp;.

The following class makes use of some of the characteristics mentioned in above configuration file.

*Example: Sample usage of EventEvaluators [(logback-examples/src/main/java/chapters/layouts/CallerEvaluatorExample.java)](http://logback.qos.ch/xref/chapters/layouts/CallerEvaluatorExample.html)*

```
package chapters.layouts;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.joran.JoranConfigurator;
import ch.qos.logback.core.joran.spi.JoranException;
import ch.qos.logback.core.util.StatusPrinter;

public class CallerEvaluatorExample {

  public static void main(String[] args)  {
    Logger logger = LoggerFactory.getLogger(CallerEvaluatorExample.class);
    LoggerContext lc = (LoggerContext) LoggerFactory.getILoggerFactory();

    try {
      JoranConfigurator configurator = new JoranConfigurator();
      configurator.setContext(lc);
      configurator.doConfigure(args[0]);
    } catch (JoranException je) {
      // StatusPrinter will handle this
    }
    StatusPrinter.printInCaseOfErrorsOrWarnings(lc);

    for (int i = 0; i < 5; i++) {
      if (i == 3) {
        logger.debug("who calls thee?");
      } else {
        logger.debug("I know me " + i);
      }
    }
  }
}
```

The above application does nothing particularly fancy. Five logging requests are issued, the third one emitting the message "who calls thee?"

The command

java chapters.layouts.CallerEvaluatorExample src/main/java/chapters/layouts/callerEvaluatorConfig.xml

will yield

```
0    [main] DEBUG - I know me 0 
0    [main] DEBUG - I know me 1 
0    [main] DEBUG - I know me 2 
0    [main] DEBUG - who calls thee? 
Caller+0   at chapters.layouts.CallerEvaluatorExample.main(CallerEvaluatorExample.java:28)
0    [main] DEBUG - I know me 4
```

When a logging request is issued, the corresponding logging event is evaluated. Only the third logging event matches the evaluation criteria, causing its caller data to be displayed. For other logging events, the evaluation criteria do not match and no caller data is printed.

One can change the expression to correspond a real world scenario. For instance, one could combine the logger name and request level. Thus, logging requests of level *WARN* and up, originating from a sensitive part of an application, e.g. a financial transaction module, would have their caller data displayed.

**Important:** With the *caller* conversion word, caller data is output when *the expression evaluates to **true**.*

Let us consider at a different situation. When exceptions are included in a logging request, their stack trace is also output. However, one might want to suppress the stack trace for some specific exceptions.

The Java code shown below creates three log requests, each with an exception. The second exception is different from the others: it contains the string "do not display this" and it is of type `chapters.layouts.TestException`. As its message commands, let us now prevent the second exception from being printed.

*Example: Sample usage of EventEvaluators [(logback-examples/src/main/java/chapters/layouts/ExceptionEvaluatorExample.java)](http://logback.qos.ch/xref/chapters/layouts/ExceptionEvaluatorExample.html)*

```
package chapters.layouts;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.joran.JoranConfigurator;
import ch.qos.logback.core.joran.spi.JoranException;
import ch.qos.logback.core.util.StatusPrinter;

public class ExceptionEvaluatorExample {

  public static void main(String[] args) {
    Logger logger = LoggerFactory.getLogger(ExceptionEvaluatorExample.class);
    LoggerContext lc = (LoggerContext) LoggerFactory.getILoggerFactory();

    try {
      JoranConfigurator configurator = new JoranConfigurator();
      configurator.setContext(lc);
      lc.reset();
      configurator.doConfigure(args[0]);
    } catch (JoranException je) {
       // StatusPrinter will handle this
    }
    StatusPrinter.printInCaseOfErrorsOrWarnings(lc);

    for (int i = 0; i < 3; i++) {
      if (i == 1) {
        logger.debug("logging statement " + i, new TestException(
            "do not display this"));
      } else {
        logger.debug("logging statement " + i, new Exception("display"));
      }
    }
  }
}
```

In the next configuration file, the evaluation expression matches events containing a throwable of type `chapters.layouts.TextException`, precisely the type of exceptions we wish to suppress.

*Example: Sample usage of EventEvaluators (logback-examples/src/main/resources/chapters/layouts/exceptionEvaluatorConfig.xml)*

With this configuration, each time an instance of the *chapters.layouts.TestException* is included within a logging request, the stack trace will be suppressed.

Launching the command

java chapters.layouts.ExceptionEvaluatorExample src/main/java/chapters/layouts/exceptionEvaluatorConfig.xml

will yield

logging statement 0 java.lang.Exception: display  at chapters.layouts.ExceptionEvaluatorExample.main(ExceptionEvaluatorExample.java:43) [logback-examples-0.9.19.jar:na] logging statement 1 logging statement 2 java.lang.Exception: display  at chapters.layouts.ExceptionEvaluatorExample.main(ExceptionEvaluatorExample.java:43) [logback-examples-0.9.19.jar:na]

Notice how the second log statement has no stack trace. We effectively suppressed the stack trace for the `TextException`. The text between square brackets at the end of each stack trace line is [packaging information](http://logback.qos.ch/manual/layouts.html#xThrowable) discussed earlier.

**NOTE** With the ***%ex\*** conversion specifier, the stack trace is displayed when *the expression evaluates to **false**.*

## Creating a custom conversion specifier

Up to this point we have presented the built-in conversion words in `PatternLayout`. But it is also possible to add conversion words of your own making.

Building a custom conversion specifier consists of two steps.

#### Step 1

First, you must extend the `ClassicConverter` class. [`ClassicConverter`](http://logback.qos.ch/xref/ch/qos/logback/classic/pattern/ClassicConverter.html) objects are responsible for extracting information out of `ILoggingEvent` instances and producing a String. For example, [`LoggerConverter`](http://logback.qos.ch/xref/ch/qos/logback/classic/pattern/LoggerConverter.html), the converter underlying the %logger conversion word, extracts the name of the logger from `ILoggingEvent` and returns it as a String. It might abbreviate the logger name in the process.

Here is a customer converter which returns the time elapsed since its creaton in nanoseconds:

*Example: Sample Converter Example [(src/main/java/chapters/layouts/MySampleConverter.java)](http://logback.qos.ch/xref/chapters/layouts/MySampleConverter.html)*

This implementation is pretty straightforward. The `MySampleConverter` class extends `ClassicConverter`, and implements the `convert` method which returns the number of nano-seconds elapsed since its creation.

#### Step 2

In the second step, we must let logback know about the new `Converter`. For this purpose, we need to declare the new conversion word in the configuration file, as shown below:

*Example: Sample Converter Example (src/main/java/chapters/layouts/mySampleConverterConfig.xml)*

```
<configuration>

  <conversionRule conversionWord="nanos" 
                  converterClass="chapters.layouts.MySampleConverter" />
        
  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>%-6nanos [%thread] - %msg%n</pattern>
    </encoder>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="STDOUT" />
  </root>
</configuration>
```

Once the new conversion word has been declared in the configuration file, we can refer to it within `PatternLayout` pattern, as with any other conversion word.

The command:

java chapters.layouts.SampleLogging src/main/java/chapters/layouts/mySampleConverterConfig.xml 

should yield output akin to:

```
4868695 [main] DEBUG - Everything's going well
5758748 [main] ERROR - maybe not quite...
```

The reader might want to take a look at other `Converter` implementations such as [`MDCConverter`](http://logback.qos.ch/xref/ch/qos/logback/classic/pattern/MDCConverter.html) to learn about more complex behaviours, such as option handling. For creating your own coloring schemes have a look at [`HighlightingCompositeConverter`](http://logback.qos.ch/xref/ch/qos/logback/classic/pattern/color/HighlightingCompositeConverter.html).

## HTMLLayout

[`HTMLLayout`](http://logback.qos.ch/xref/ch/qos/logback/classic/html/HTMLLayout.html) (as included in logback-classic) generates logs in HTML format. `HTMLLayout` outputs logging events in an HTML table where each row of the table corresponds to a logging event.

Here is a sample output produced by `HTMLLayout` using its default CSS stylesheet:

![HTML Layout Sample Image](http://logback.qos.ch/manual/images/chapters/layouts/htmlLayout0.gif)

The content of table columns are specified with the help of a conversion pattern. See [`PatternLayout`](http://logback.qos.ch/manual/layouts.html#ClassicPatternLayout) for documentation on conversion patterns. As such, you have full control over the contents and format of the table. You can select and display any combination of converters `PatternLayout` knows about.

One notable exception about the use of `PatternLayout` with `HTMLLayout` is that conversion specifiers should not be separated by space characters or more generally by literal text. Each specifier found in the pattern will result in a separate column. Likewise a separate column will be generated for each block of literal text found in the pattern, potentially wasting valuable real-estate on your screen.

Here is simple but functional configuration file illustrating the use of `HTMLLayout`.

*Example: HTMLLayout Example (src/main/java/chapters/layouts/htmlLayoutConfig1.xml)*

```
<configuration debug="true">
  <appender name="FILE" class="ch.qos.logback.core.FileAppender">
    <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
      <layout class="ch.qos.logback.classic.html.HTMLLayout">
        <pattern>%relative%thread%mdc%level%logger%msg</pattern>
      </layout>
    </encoder>
    <file>test.html</file>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="FILE" />
  </root>
</configuration>
```

The [TrivialMain](http://logback.qos.ch/xref/chapters/layouts/TrivialMain.html) application logs a few messages finishing with an exception. The command:

java chapters.layouts.TrivialMain src/main/java/chapters/layouts/htmlLayoutConfig1.xml

will create the file *test.html* in the current folder. The contents of *test.html* should be similar to:

![HTML Layout Sample Image](http://logback.qos.ch/manual/images/chapters/layouts/htmlLayout1.png)

### Stack traces

If you use the *%em* conversion word to display stack traces, a table column will be created to display stack traces. In most cases the column will be empty, wasting screen real-estate. Moreover, printing a stack trace on a separate column does not yield very readable results. Fortunately, the *%ex* conversion word is not the only way to display stack traces.

A better solution is available through implementations of `IThrowableRenderer` interface. Such an implementation can be assigned to `HTMLLayout` to manage the display data related to exceptions. By default, a [`DefaultThrowableRenderer`](http://logback.qos.ch/xref/ch/qos/logback/classic/html/DefaultThrowableRenderer.html) is assigned to each `HTMLLayout` instance. It writes exceptions on a *new table row*, along with its stack trace, in an easily readable manner, as shown on the figure above.

If for some reason, you still wish to use the *%ex* pattern, then you can specify [`NOPThrowableRenderer`](http://logback.qos.ch/xref/ch/qos/logback/core/html/NOPThrowableRenderer.html) in the configuration file in order to disable displaying a separate row for the stack trace. We don't have the faintest idea why you would want to do that, but if you wished, you could.

### CSS

The presentation of the HTML created by `HTMLLayout` is controlled through a Cascading Style Sheet (CSS). In the absence of specific instructions, `HTMLLayout` will default to its internal CSS. However, you can instruct `HTMLLayout` to use an external CSS file. For this purpose a `cssBuilder` element can be nested within a `` element, as shown below.

```
<layout class="ch.qos.logback.classic.html.HTMLLayout">
  <pattern>%relative...%msg</pattern>
  <cssBuilder class="ch.qos.logback.classic.html.UrlCssBuilder">
    <!-- url where the css file is located -->
    <url>http://...</url>
  </cssBuilder> 
</layout>
```

The `HTMLLayout` is often used in conjunction with `SMTPAppender` so that outgoing email is pleasantly formatted in HTML.

## Log4j XMLLayout

[XMLLayout](http://logback.qos.ch/xref/ch/qos/logback/classic/log4j/XMLLayout.html) (part of logback-classic) generates output in a log4j.dtd compliant format to interoperate with tools such as [Chainsaw](http://logging.apache.org/chainsaw/index.html) and [Vigilog](http://vigilog.sourceforge.net/) capable of processing files generated by [log4j's XMLLayout](http://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/xml/XMLLayout.html).

As the original XMLLayout in log4j version 1.2.15, XMLLayout in logback-classic takes two boolean properties, locationInfo and properties. Setting locationInfo to true enables the inclusion of location info (caller data) in the each event. Setting properties to true enables the inclusion of MDC information. Both options are set to false by default.

Here is a sample configuration

*Example: Log4jXMLLayout Example (src/main/java/chapters/layouts/log4jXMLLayout.xml)*

```
<configuration>
  <appender name="FILE" class="ch.qos.logback.core.FileAppender">
    <file>test.xml</file>
    <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
      <layout class="ch.qos.logback.classic.log4j.XMLLayout">
        <locationInfo>true</locationInfo>
      </layout>
    </encoder> 
  </appender> 

  <root level="DEBUG">
    <appender-ref ref="FILE" />
  </root>
</configuration> 
```

# Logback access

Most logback-access layouts are mere adaptations of logback-classic layouts. Logback-classic and logback-access modules address different needs, but in general offer comparable functionality.

## Writing your own Layout

Writing a custom `Layout` for logback access is nearly identical to its sibling `Layout` in logback-classic.

### PatternLayout

[`PatternLayout`](http://logback.qos.ch/xref/ch/qos/logback/access/PatternLayout.html) in logback-access can be configured in much the same way as its classic counterpart. However it features additional conversion specifiers suited for logging particular bits of information available only in HTTP servlet requests and HTTP servlet responses.

Below is a list of conversion specifiers for `PatternLayout` in logback-access.

| Conversion Word                 | Effect                                                       |
| ------------------------------- | ------------------------------------------------------------ |
| **a / remoteIP**                | Remote IP address.                                           |
| **A / localIP**                 | Local IP address.                                            |
| **b / B / bytesSent**           | Response's content length.                                   |
| **h / clientHost**              | Remote host.                                                 |
| **H / protocol**                | Request protocol.                                            |
| **l**                           | Remote log name. In logback-access, this converter always returns the value "-". |
| **reqParameter{paramName}**     | Parameter of the response.This conversion word takes the first option in braces and looks for the corresponding parameter in the request.**%reqParameter{input_data}** displays the corresponding parameter. |
| **i{header} / header{header}**  | Request header.This conversion word takes the first option in braces and looks for the corresponding header in the request.**%header{Referer}** displays the referer of the request.If no option is specified, it displays every available header. |
| **m / requestMethod**           | Request method.                                              |
| **r / requestURL**              | URL requested.                                               |
| **s / statusCode**              | Status code of the request.                                  |
| **D / elapsedTime**             | The time taken to serve the request, in milliseconds.        |
| **T / elapsedSeconds**          | The time taken to serve the request, in seconds.             |
| **t / date**                    | Outputs the date of the logging event. The date conversion specifier may be followed by a set of braces containing a date and time pattern strings used by `java.text.SimpleDateFormat`. *ISO8601* is also a valid value.For example, **%t{HH:mm:ss,SSS}** or **%t{dd MMM yyyy ;HH:mm:ss,SSS}**. If no date format specifier is given then the Common Log Format date format is assumed, that is: **%t{dd/MMM/yyyy:HH:mm:ss Z}** |
| **u / user**                    | Remote user.                                                 |
| **q / queryString**             | Request query string, prepended with a '?'.                  |
| **U / requestURI**              | Requested URI.                                               |
| **S / sessionID**               | Session ID.                                                  |
| **v / server**                  | Server name.                                                 |
| **I / threadName**              | Name of the thread which processed the request.              |
| **localPort**                   | Local port.                                                  |
| **reqAttribute{attributeName}** | Attribute of the request.This conversion word takes the first option in braces and looks for the corresponding attribute in the request.**%reqAttribute{SOME_ATTRIBUTE}** displays the corresponding attribute. |
| **reqCookie{cookie}**           | Request cookie.This conversion word takes the first option in braces and looks for the corresponding cookie in the request.**%cookie{COOKIE_NAME}** displays corresponding cookie. |
| **responseHeader{header}**      | Header of the response.This conversion word takes the first option in braces and looks for the corresponding header in the response.**%header{Referer}** displays the referer of the response. |
| **requestContent**              | This conversion word displays the content of the request, that is the request's `InputStream`. It is used in conjunction with a [`TeeFilter`](http://logback.qos.ch/xref/ch/qos/logback/access/servlet/TeeFilter.html), a `javax.servlet.Filter` that replaces the original `HttpServletRequest` by a [`TeeHttpServletRequest`](http://logback.qos.ch/xref/ch/qos/logback/access/servlet/TeeHttpServletRequest.html). The latter object allows access to the request's `InputStream` multiple times without any loss of data. |
| **fullRequest**                 | This converter outputs the data associated with the request, including all headers and request contents. |
| **responseContent**             | This conversion word displays the content of the response, that is the response's `InputStream`. It is used in conjunction with a [`TeeFilter`](http://logback.qos.ch/xref/ch/qos/logback/access/servlet/TeeFilter.html), a `javax.servlet.Filter` that replaces the original `HttpServletResponse` by a [`TeeHttpServletResponse`](http://logback.qos.ch/xref/ch/qos/logback/access/servlet/TeeHttpServletResponse.html). The latter object allows access to the request's `InputStream` multiple times without any loss of data. |
| **fullResponse**                | This conversion word takes all the available data associated with the response, including all headers of the response and response contents. |

Logback access' `PatternLayout` also recognizes three keywords, which act like shortcuts.

| keyword           | equivalent conversion pattern                             |
| ----------------- | --------------------------------------------------------- |
| *common* or *CLF* | *%h %l %u [%t] "%r" %s %b*                                |
| *combined*        | *%h %l %u [%t] "%r" %s %b "%i{Referer}" "%i{User-Agent}"* |

The *common* keyword corresponds to the pattern *'%h %l %u [%t] "%r" %s %b'* which displays client host, remote log name, user, date, requested URL, status code and response's content length

The *combined* keyword is a shortcut for *'%h %l %u [%t] "%r" %s %b "%i{Referer}" "%i{User-Agent}"'*. This pattern begins much like the *common* pattern but also displays two request headers, namely referer, and user-agent.

### HTMLLayout

The [`HTMLLayout`](http://logback.qos.ch/xref/ch/qos/logback/access/html/HTMLLayout.html) class found in logback-access is similar to the [`HTMLLayout`](http://logback.qos.ch/manual/layouts.html#ClassicHTMLLayout) class from logback-classic.

By default, it will create a table containing the following data:

- Remote IP
- Date
- Request URL
- Status code
- Content Length

Here is a sample output produced by `HTMLLayout` in logback-access:

![Access HTML Layout Sample Image](http://logback.qos.ch/manual/images/chapters/layouts/htmlLayoutAccess.gif)

What can be better than a real world example? Our own log4j properties for logback [translator](http://logback.qos.ch/translator/) makes use of logback-access to demonstrate live output from `RollingFileAppender` with `HTMLLayout`.

On every new user request to our [translator](http://logback.qos.ch/translator/) web-application, a new entry will be added to the access logs, which you can view by [following this link](http://logback.qos.ch/translator/logs/access.html).



<http://logback.qos.ch/manual/layouts.html>