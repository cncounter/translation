#  Chapter 6: Layouts

# 第6章: Layout(布局)

TCP implementations will follow a general principle of robustness: be conservative in what you do, be liberal in what you accept from others.

—JON POSTEL, RFC 793

TCP 的实现应当遵循如下健壮性通用原则：做事要保守，对别人传来的东西要宽容。

——JON POSTEL, RFC 793

In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](http://logback.qos.ch/setup.html) for further details.

为了运行本章中的示例，需要确保 classpath 中存在某些 jar 文件。详情请参考 [setup page](http://logback.qos.ch/setup.html)。

## What is a layout?

## 什么是 Layout

In case you were wondering, layouts have nothing to do with large estates in Florida. Layouts are logback components responsible for transforming an incoming event into a String. The `format()` method in the [`Layout`](http://logback.qos.ch/xref/ch/qos/logback/core/Layout.html) interface takes an object that represents an event (of any type) and returns a String. A synopsis of the `Layout` interface is shown below.

先说明一下，layout 与佛罗里达州的大庄园没有任何关系。Layout 是 logback 中负责把传入的事件转换成 String 的组件。[`Layout`](http://logback.qos.ch/xref/ch/qos/logback/core/Layout.html) 接口中的 `format()` 方法接收一个代表事件（任意类型）的对象，并返回一个 String。`Layout` 接口的概要如下所示。

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

Logback-classic 被设计为只处理 [`ch.qos.logback.classic.spi.ILoggingEvent`](http://logback.qos.ch/xref/ch/qos/logback/classic/spi/ILoggingEvent.html) 类型的事件。这一事实在本节的通篇都会有所体现。

## Writing your own custom Layout

## 编写自定义 Layout

Let us implement a simple yet functional layout for the logback-classic module that prints the time elapsed since the start of the application, the level of the logging event, the caller thread between brackets, its logger name, a dash followed by the event message and a new line.

下面我们为 logback-classic 模块实现一个简单却实用的 layout，它会打印：应用启动后经过的时间、日志事件的级别、方括号中的调用线程、logger 名称、一个破折号加上事件消息，最后换行。

Sample output might look like:

输出示例可能像这样：

10489 DEBUG [main] com.marsupial.Pouch - Hello world.

Here is a possible implementation, authored by the Texan developer:

下面是德州佬程序员给出的一种实现：

*Example: Sample implementation of a Layout [(logback-examples/src/main/java/chapters/layouts/MySampleLayout.java)](http://logback.qos.ch/xref/chapters/layouts/MySampleLayout.html)*

Note that `MySampleLayout` extends [`LayoutBase`](http://logback.qos.ch/xref/ch/qos/logback/core/LayoutBase.html). This class manages state common to all layout instances, such as whether the layout is started or stopped, header, footer and content type data. It allows the developer to concentrate on the formatting expected from his/her `Layout`. Note that the `LayoutBase` class is generic. In its class declaration, `MySampleLayout` extends `LayoutBase`.

注意，`MySampleLayout` 继承自 [`LayoutBase`](http://logback.qos.ch/xref/ch/qos/logback/core/LayoutBase.html)。这个类管理着所有 layout 实例的公共状态，比如 layout 是处于启动还是停止状态、header、footer 以及 content type 数据。它让开发者可以专注于实现自己的 `Layout` 所期望的格式化逻辑。注意 `LayoutBase` 是泛型类。在其类声明中，`MySampleLayout` 继承的是 `LayoutBase`。

The `doLayout(ILoggingEvent event)` method, i.e. the only method in `MySampleLayout`, begins by instantiating a `StringBuffer`. It proceeds by adding various fields of the event parameter. The Texan from Texas was careful to print the formatted form of the message. This is significant if one or more parameters were passed along with the logging request.

`doLayout(ILoggingEvent event)` 方法是 `MySampleLayout` 中唯一的方法，它先实例化一个 `StringBuffer`，然后逐一追加 event 参数的各个字段。这位德州佬很细心地输出了消息的格式化形式。如果日志请求附带了一个或多个参数，这一点就很重要。

After adding these various characters to the string buffer, the `doLayout()` method converts the buffer into a `String` and returns the resulting value.

把这些字符都追加到字符串缓冲区之后，`doLayout()` 方法将缓冲区转换成 `String` 并返回结果。

In the above example, the `doLayout` method ignores any eventual exceptions contained in the event. In a real world layout implementation, you would most probably want to print the contents of exceptions as well.

在上面的示例中，`doLayout` 方法忽略了事件中可能包含的异常。而在实际的 layout 实现中，你多半还希望把异常的内容也打印出来。

### Configuring your custom layout

### 配置自定义 layout

Custom layouts are configured as any other component. As mentioned earlier, `FileAppender` and its sub-classes expect an encoder. In order to fulfill this requirement, we pass to `FileAppender` an instance of `LayoutWrappingEncoder` which wraps our `MySampleLayout`. Here is the configuration file:

自定义 layout 的配置方式与其他组件一样。如前所述，`FileAppender` 及其子类需要的是 encoder。为了满足这一要求，我们传给 `FileAppender` 一个 `LayoutWrappingEncoder` 实例，由它包装我们的 `MySampleLayout`。配置文件如下：

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

示例应用 [`chapters.layouts.SampleLogging`](http://logback.qos.ch/xref/chapters/layouts/SampleLogging.html) 用第一个参数传入的配置脚本来配置 logback，然后输出一条 debug 消息和一条 error 消息。

To run this example issue the following command from within the *logback-examples* directory.

要运行这个示例，请在 *logback-examples* 目录下执行以下命令。

java chapters.layouts.SampleLogging src/main/java/chapters/layouts/sampleLayoutConfig.xml

This will produce:

输出结果为：

```
0 DEBUG [main] chapters.layouts.SampleLogging - Everything's going well
0 ERROR [main] chapters.layouts.SampleLogging - maybe not quite...
```

That was simple enough. The skeptic Pyrrho of Elea, who insists that nothing is certain except perhaps uncertainty itself, which is by no means certain either, might ask: how about a layout with options? The reader shall find a slightly modified version of our custom layout in [`MySampleLayout2.java`](http://logback.qos.ch/xref/chapters/layouts/MySampleLayout2.html). As mentioned throughout this manual, adding a property to a layout or any other logback component is as simple as declaring a setter method for the property.

这已经足够简单了。不过，坚持"除了不确定本身之外没有任何事情是确定的"——而且连这一点也不确定——的埃利斯的怀疑论者皮浪(Pyrrho)可能会问：带选项的 layout 该怎么写？读者可以在 [`MySampleLayout2.java`](http://logback.qos.ch/xref/chapters/layouts/MySampleLayout2.html) 中找到我们自定义 layout 的一个略微修改的版本。正如本手册中多次提到的，给 layout 或其他任何 logback 组件增加一个属性，只需要为该属性声明一个 setter 方法即可。

The [`MySampleLayout2`](http://logback.qos.ch/xref/chapters/layouts/MySampleLayout2.html) class contains two properties. The first one is a prefix that can be added to the output. The second property is used to choose whether to display the name of the thread from which the logging request was sent.

[`MySampleLayout2`](http://logback.qos.ch/xref/chapters/layouts/MySampleLayout2.html) 类包含两个属性。第一个是可加在输出前面的前缀(prefix)。第二个用于选择是否显示发出日志请求的线程名称。

Here is a copy of the [`MySampleLayout2`](http://logback.qos.ch/xref/chapters/layouts/MySampleLayout2.html) class :

下面是 [`MySampleLayout2`](http://logback.qos.ch/xref/chapters/layouts/MySampleLayout2.html) 类的源码：

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

只要添加相应的 setter 方法，就能让这个属性可以被配置。注意 `PrintThreadName` 属性是 boolean 类型而不是 `String`。logback 组件的配置方式在[配置一章](http://logback.qos.ch/manual/configuration.html)中有详细介绍，[Joran 一章](http://logback.qos.ch/manual/onJoran.html)则提供了更多细节。下面是专为 `MySampleLayout2` 编写的配置文件。

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

Logback classic 自带一个灵活的 layout，叫做 [`PatternLayout`](http://logback.qos.ch/xref/ch/qos/logback/classic/PatternLayout.html)。与其他所有 layout 一样，`PatternLayout` 接收一个日志事件并返回一个 `String`。不过，这个 `String` 可以通过调整 `PatternLayout` 的转换模式(conversion pattern)来定制。

The conversion pattern of `PatternLayout` is closely related to the conversion pattern of the `printf()` function in the C programming language. A conversion pattern is composed of literal text and format control expressions called *conversion specifiers*. You are free to insert any literal text within the conversion pattern. Each conversion specifier starts with a percent sign '%' and is followed by optional *format modifiers*, a *conversion word* and optional parameters between braces. The conversion word controls the data field to convert, e.g. logger name, level, date or thread name. The format modifiers control field width, padding, and left or right justification.

`PatternLayout` 的转换模式与 C 语言中 `printf()` 函数的格式字符串密切相关。转换模式由字面文本和称为*转换说明符*(conversion specifier)的格式控制表达式组成。你可以在转换模式中随意插入任何字面文本。每个转换说明符都以百分号 '%' 开头，后面跟着可选的*格式修饰符*(format modifier)、一个*转换词*(conversion word)以及花括号中的可选参数。转换词决定要转换的数据字段，比如 logger 名称、级别、日期或线程名。格式修饰符则控制字段宽度、补齐方式以及左对齐或右对齐。

As already mentioned on several occasions, `FileAppender` and sub-classes expect an encoder. Consequently, when used in conjunction with `FileAppender` or its subclasses a `PatternLayout` must be wrapped within an encoder. Given that the `FileAppender`/`PatternLayout` combination is so common, logback ships with an encoder named `PatternLayoutEncoder`, designed solely for the purpose of wrapping a `PatternLayout` instance so that it can be seen as encoder. Below is an example which programmatically configures a `ConsoleAppender` with a `PatternLayoutEncoder`:

正如前面多次提到的，`FileAppender` 及其子类需要的是 encoder。因此，当 `PatternLayout` 与 `FileAppender` 或其子类配合使用时，必须把它包装在 encoder 里。鉴于 `FileAppender`/`PatternLayout` 的组合非常常见，logback 自带了一个名为 `PatternLayoutEncoder` 的 encoder，它专为包装 `PatternLayout` 实例、使其可以当作 encoder 使用而设计。下面这个示例以编程方式配置了一个带有 `PatternLayoutEncoder` 的 `ConsoleAppender`：

*Example: Sample usage of a PatternLayout [(logback-examples/src/main/java/chapters/layouts/PatternSample.java)](http://logback.qos.ch/xref/chapters/layouts/PatternSample.html)*

In the above example, the conversion pattern is set to be **"%-5level [%thread]: %message%n"**. A synopsis of conversion word included in logback will be given shortly. Running `PatternSample` application as:

在上面的示例中，转换模式被设置为 **"%-5level [%thread]: %message%n"**。logback 所包含的转换词概览稍后会给出。按如下方式运行 `PatternSample` 应用：

java java chapters.layouts.PatternSample

will yield the following output on the console.

会在控制台得到如下输出。

DEBUG [main]: Message 1  WARN  [main]: Message 2

Note that in the conversion pattern **"%-5level [%thread]: %message%n"** there is no explicit separator between literal text and conversion specifiers. When parsing a conversion pattern, `PatternLayout` is capable of differentiating between literal text (space characters, the brackets, colon character) and conversion specifiers. In the example above, the conversion specifier %-5level means the level of the logging event should be left justified to a width of five characters. Format specifiers will be explained below.

注意，在转换模式 **"%-5level [%thread]: %message%n"** 中，字面文本与转换说明符之间并没有显式的分隔符。在解析转换模式时，`PatternLayout` 能够区分字面文本（空格、方括号、冒号）与转换说明符。在上面的示例中，转换说明符 %-5level 表示日志事件的级别应左对齐输出、宽度为五个字符。格式说明符将在下文解释。

In `PatternLayout`, parenthesis can be used to group conversion patterns. **It follows that the '(' and ')' carry special meaning and need to be escaped if intended to be used as literals.** The special nature of parenthesis is further [explained below](http://logback.qos.ch/manual/layouts.html#Parentheses).

在 `PatternLayout` 中，圆括号可用于对转换模式分组。**因此 '(' 和 ')' 具有特殊含义，如果想把它们当作字面字符使用，就需要转义。** 圆括号的特殊性将在[下文](http://logback.qos.ch/manual/layouts.html#Parentheses)进一步说明。

As mentioned previously, certain conversion specifiers may include optional parameters passed between braces. A sample conversion specifier with options could be `%logger{10}`. Here "logger" is the conversion word, and 10 is the option. Options are [further discussed below](http://logback.qos.ch/manual/layouts.html#cwOptions).

如前所述，某些转换说明符可以带有放在花括号中的可选参数。一个带选项的转换说明符示例是 `%logger{10}`。这里 "logger" 是转换词，10 是选项。选项将在[下文](http://logback.qos.ch/manual/layouts.html#cwOptions)进一步讨论。

The recognized conversions words along with their options are described in the table below. When multiple conversion words are listed in the same table cell, they are considered as aliases.

下表描述了 logback 识别的转换词及其选项。当同一个表格单元中列出了多个转换词时，它们互为别名。

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

下表为上表的中文对照（单元格中的代码、示例输出与链接原样保留，不再重复罗列大段示例数据）：

| 转换词 | 作用 |
| --- | --- |
| **c**{*length*} **lo**{*length*} **logger**{*length*} | 输出产生日志事件的 logger 的名称。此转换词接受一个整数作为其第一个也是唯一的选项。转换器的缩写算法会缩短 logger 名称，通常不会有明显的含义损失。将 length 选项设为 0 是个例外：它会使转换词返回 logger 名称中最右侧点号之后的子串。缩写算法的运行效果：对于 logger 名 mainPackage.sub.sample.Bar，%logger 与 %logger{26} 输出全名，%logger{0} 输出 Bar，%logger{5} 与 %logger{10} 输出 m.s.s.Bar，%logger{15} 输出 m.s.sample.Bar，%logger{16} 输出 m.sub.sample.Bar。请注意，logger 名称中最右侧的段永远不会被缩写，即使其长度超过了 *length* 选项；其他段最多可能被缩短成单个字符，但绝不会整个移除。 |
| **C**{*length*} **class**{*length*} | 输出发出日志请求的调用者的全限定类名。与上面的 *%logger* 转换词一样，此转换词接受一个整数选项用于缩短类名。0 有特殊含义，会输出不带包名前缀的简单类名；默认情况下输出完整的类名。生成调用者类信息的开销不小，因此除非执行速度无关紧要，否则应避免使用。 |
| **contextName** **cn** | 输出产生事件的 logger 所属的 logger 上下文(context)的名称。 |
| **d**{*pattern*} **date**{*pattern*} **d**{*pattern*, *timezone*} **date**{*pattern*, *timezone*} | 用于输出日志事件的日期。date 转换词接受一个模式字符串作为参数，其语法与 [`java.text.SimpleDateFormat`](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html) 所接受的格式兼容。可以指定字符串 *"ISO8601"* 表示 ISO8601 日期格式。注意，在没有模式参数时，%date 转换词默认使用 [ISO 8601 日期格式](http://en.wikipedia.org/wiki/ISO_8601)。以实际日期为 2006 年 10 月 20 日星期五为例：%d 与 %date 输出 2006-10-20 14:06:49,812，%date{ISO8601} 输出 2006-10-20 14:06:49,812，%date{HH:mm:ss.SSS} 输出 14:06:49.812，%date{dd MMM yyyy;HH:mm:ss.SSS} 输出 20 oct. 2006;14:06:49.812。第二个参数指定时区，例如 '%date{HH:mm:ss.SSS, Australia/Perth} 会按照澳大利亚珀斯（世界上最孤立的城市）的时区打印时间。注意，未指定时区参数时使用 Java 平台主机的默认时区；如果指定的时区标识符未知或拼写有误，则按照 [TimeZone.getTimeZone(String)](http://docs.oracle.com/javase/6/docs/api/java/util/TimeZone.html#getTimeZone(java.lang.String)) 方法规范，采用 GMT 时区。**常见错误**：由于逗号 ',' 会被解释为参数分隔符，模式 `HH:mm:ss,SSS` 会被解释成模式 `HM:mm:ss` 加时区 `SSS`。如果想在日期模式中包含逗号，只需用引号把模式括起来，例如 %date{**"**HH:mm:ss,SSS**"**}。 |
| **F / file** | 输出发出日志请求所在的 Java 源文件名。生成文件信息的开销不小，因此除非执行速度无关紧要，否则应避免使用。 |
| **caller{depth}** **caller{depthStart..depthEnd}** **caller{depth, evaluator-1, ... evaluator-n}** **caller{depthStart..depthEnd, evaluator-1, ... evaluator-n}** | 输出生成日志事件的调用者的位置信息。位置信息取决于 JVM 实现，但通常由调用方法的全限定名，以及调用者的源文件名和括号中的行号组成。可以在 *caller* 转换说明符的选项中添加一个整数来配置要显示信息的深度，例如 **%caller{2}** 会显示 `Caller+0   at mainPackage.sub.sample.Bar.sampleMethodName(Bar.java:22)` 和 `Caller+1   at mainPackage.sub.sample.Bar.createLoggingRequest(Bar.java:17)` 两行；**%caller{3}** 则会额外显示 `Caller+2   at mainPackage.ConfigTester.main(ConfigTester.java:38)`。还可以添加一个范围说明符来配置要显示信息的深度范围，例如 **%caller{1..2}** 只显示 `Caller+0   at mainPackage.sub.sample.Bar.createLoggingRequest(Bar.java:17)`。此转换词还可以使用 evaluator 在计算调用者数据之前按给定条件对日志事件进行测试。例如，使用 **%caller{3, CALLER_DISPLAY_EVAL}** 时，只有当名为 *CALLER_DISPLAY_EVAL* 的 evaluator 返回**肯定**答案时，才会显示三行堆栈信息。Evaluator 将在下文介绍。 |
| **L / line** | 输出发出日志请求所在的行号。生成行号信息的开销不小，因此除非执行速度无关紧要，否则应避免使用。 |
| **m / msg / message** | 输出与日志事件关联的、由应用提供的消息。 |
| **M / method** | 输出发出日志请求所在的方法名。生成方法名的开销不小，因此除非执行速度无关紧要，否则应避免使用。 |
| **n** | 输出平台相关的行分隔符。此转换词的性能与使用 "\n"、"\r\n" 之类不可移植的行分隔符字符串几乎相同，因此是指定行分隔符的首选方式。 |
| **p / le / level** | 输出日志事件的级别。 |
| **r / relative** | 输出从应用启动到日志事件创建为止经过的毫秒数。 |
| **t / thread** | 输出生成日志事件的线程名称。 |
| **X**{*key:-defaultVal*} **mdc**{*key:-defaultVal*} | 输出与生成日志事件的线程关联的 MDC（映射诊断上下文）。如果 **mdc** 转换词后面跟着花括号中的键，比如 **%mdc{userid}**，则会输出键 'userid' 对应的 MDC 值；如果该值为 null，则输出 **:-** 运算符之后指定的[默认值](http://logback.qos.ch/manual/configuration.html#defaultValuesForVariables)；如果没有指定默认值，则输出空字符串。如果没有给出键，则整个 MDC 的内容会以 "key1=val1, key2=val2" 的格式输出。更多细节请参见 [MDC 一章](http://logback.qos.ch/manual/mdc.html)。 |
| **ex**{*depth*} **exception**{*depth*} **throwable**{*depth*} **ex**{depth, evaluator-1, ..., evaluator-n} **exception**{depth, evaluator-1, ..., evaluator-n} **throwable**{depth, evaluator-1, ..., evaluator-n} | 输出与日志事件关联的异常的堆栈跟踪（如果有），默认输出完整的堆栈跟踪。*throwable* 转换词后面可以跟以下选项之一：*short* 只打印堆栈的第一行；*full* 打印完整的堆栈；任意整数打印指定行数的堆栈（各选项的输出示例见上表）。此转换词也可以使用 evaluator 在生成输出之前按给定条件对日志事件进行测试。例如，使用 **%ex{full, EX_DISPLAY_EVAL}** 时，只有当名为 *EX_DISPLAY_EVAL* 的 evaluator 返回**否定**答案时，才会显示完整的异常堆栈。Evaluator 将在下文进一步介绍。如果在转换模式中没有指定 %throwable 或其他与 throwable 相关的转换词，考虑到堆栈信息的重要性，`PatternLayout` 会自动把它添加为最后一个转换词。如果不想显示堆栈信息，可以用 $nopex 转换词代替 %throwable，另见 %nopex 转换词。 |
| **xEx**{*depth*} **xException**{*depth*} **xThrowable**{*depth*} **xEx**{depth, evaluator-1, ..., evaluator-n} **xException**{depth, evaluator-1, ..., evaluator-n} **xThrowable**{depth, evaluator-1, ..., evaluator-n} | 与上面的 %throwable 转换词相同，但会额外附加类打包信息(class packaging information)。在异常堆栈的每一帧末尾，会追加一个字符串，由包含相关类的 jar 文件名以及该 jar 清单(manifest)中的 "Implementation-Version" 组成。这一创新技术最初由 [James Strachan 建议](http://macstrac.blogspot.com/2008/09/better-stack-traces-in-java-with-log4j.html)。如果信息不确定，类打包数据前面会加上波浪号，即 '~' 字符（示例见上表，其中 **~[wombat-1.3.jar:1.3]** 带有 ~ 前缀，而 [junit-4.4.jar:na] 没有）。Logback 会竭尽全力确保所显示的类打包信息正确无误，即使在任意复杂的类加载器层次结构中也是如此；但当它无法保证信息绝对正确时，就会在数据前面加上 '~'。因此，打印出的类打包信息在理论上可能与真实的打包信息不同。在上面的示例中，由于 Wombat 类的打包数据前面有波浪号，正确的打包数据实际上有可能是 [wombat.jar:1.7]。请注意，考虑到潜在的开销，[**打包数据的计算默认是禁用的**](http://logback.qos.ch/manual/configuration.html#packagingData)。启用打包数据计算后，`PatternLayout` 会自动在模式字符串末尾使用 %xThrowable 后缀而不是 %throwable 后缀。[用户反馈](http://jira.qos.ch/browse/LBCLASSIC-212)表明 Netbeans 无法处理打包信息。 |
| **nopex** **nopexception** | 尽管它*假装*处理堆栈数据，但这个转换词并不输出任何数据，从而有效地忽略了异常。%nopex 转换词让用户可以覆盖 `PatternLayout` 的内部安全机制——该机制会在没有其他处理异常的转换词时，静默地添加 %xThrowable 转换关键字。 |
| **marker** | 输出与日志请求关联的 marker。如果 marker 包含子 marker，转换器会按下面的格式同时显示父 marker 和各子 marker 的名称：*parentName [ child1, child2 ]* |
| **property{key}** | 输出与名为 *key* 的属性关联的值。关于如何定义变量请参见 [define variables](http://logback.qos.ch/manual/configuration.html#variableSubstitution)，关于[变量作用域](http://logback.qos.ch/manual/configuration.html#scopes)另有文档。如果 *key* 不是 logger 上下文的属性，则会在 System 属性中查找 *key*。*key* 没有默认值；如果省略，返回值将是 "Property_HAS_NO_KEY"，以显式标明错误状态。 |
| **replace(\*p\*){r, t}** | 在子模式 'p' 产生的字符串中，把正则表达式 'r' 的出现替换为其替换值 't'。例如 "%replace(%msg){'\s', ''}" 会移除事件消息中包含的所有空格。模式 'p' 可以任意复杂，特别是可以包含多个转换关键字。例如 "%replace(%logger %msg){'\.', '/'}" 会把事件 logger 或消息中的所有点号替换为斜杠。 |
| **rEx**{*depth*} **rootException**{*depth*} **rEx**{depth, evaluator-1, ..., evaluator-n} **rootException**{depth, evaluator-1, ..., evaluator-n} | 输出与日志事件关联的异常的堆栈跟踪（如果有），但根 cause 会最先输出，而不是标准的"根 cause 最后输出"（示例输出见上表）。%rootException 转换器接受与上面描述的 %xException 转换器相同的可选参数，包括 depth 和 evaluators，它也会输出打包信息。简言之，%rootException 与 %xException 非常相似，只是异常输出的顺序被反转了。%rootException 转换器的作者 Tomasz Nurkiewicz 在其博客文章 ["Logging exceptions root cause first"](http://nurkiewicz.blogspot.com/2011/09/logging-exceptions-root-cause-first.html) 中记录了他的这一贡献。 |

#### % character has special meaning

#### % 字符具有特殊含义

Given that in the context of conversion patterns the percent sign carries special meaning, in order to include it as a literal, it needs to be escaped with a backslash, e.g. "%d %p **\%** %m%n".

由于在转换模式中百分号具有特殊含义，如果想把它当作字面字符使用，就需要用反斜杠转义，例如 "%d %p **\%** %m%n"。

#### Restrictions on literals immediately following conversion words

#### 对紧跟在转换词后面的字面文本的限制

In most cases literals naturally contain spaces or other delimiting characters so that they are not confused with conversion words. For example, the pattern "%level [%thread] - %message%n" contains the string literals `" ["` and `"] - "`. However, if a character which can be part of a java identifier immediately follows a conversion word, logback's pattern parser will be fooled into thinking that the literal is part of the conversion word. For example, the pattern "%date**%nHello**" will be interpreted as two conversion words %date and %nHello and since %nHello is not a known conversion word, logback will output %PARSER_ERROR[nHello] for %nHello. If you wish the string literal "Hello" to immediately separate %n and Hello, pass an empty argument list to %n. For example, "%date**%n{}**Hello" will be interpreted as %date followed by %n followed by the literal "Hello".

在大多数情况下，字面文本天然包含空格或其他分隔字符，因此不会与转换词混淆。例如，模式 "%level [%thread] - %message%n" 包含字符串字面量 `" ["` 和 `"] - "`。然而，如果紧跟在转换词后面的字符可以构成 Java 标识符的一部分，logback 的模式解析器就会误以为该字面文本是转换词的一部分。例如，模式 "%date**%nHello**" 会被解释为 %date 和 %nHello 两个转换词，而 %nHello 并不是已知的转换词，于是 logback 会为 %nHello 输出 %PARSER_ERROR[nHello]。如果你希望字符串字面量 "Hello" 紧跟在 %n 之后，请给 %n 传入一个空的参数列表。例如，"%date**%n{}**Hello" 会被解释为 %date、%n，然后是字面文本 "Hello"。

## Format modifiers

## 格式修饰符

By default the relevant information is output as-is. However, with the aid of format modifiers it is possible to change the minimum and maximum width and the justifications of each data field.

默认情况下，相关信息会原样输出。不过，借助格式修饰符(format modifier)，可以改变每个数据字段的最小宽度、最大宽度以及对齐方式。

The optional format modifier is placed between the percent sign and the conversion character or word.

可选的格式修饰符放在百分号与转换字符或转换词之间。

The first optional format modifier is the *left justification flag* which is just the minus (-) character. Then comes the optional *minimum field width* modifier. This is a decimal constant that represents the minimum number of characters to output. If the data item contains fewer characters, it is padded on either the left or the right until the minimum width is reached. The default is to pad on the left (right justify) but you can specify right padding with the left justification flag. The padding character is space. If the data item is larger than the minimum field width, the field is expanded to accommodate the data. The value is never truncated.

第一个可选的格式修饰符是*左对齐标志*(left justification flag)，就是减号 (-) 字符。接着是可选的*最小字段宽度*(minimum field width)修饰符，它是一个十进制常量，表示最少要输出的字符数。如果数据项的字符数不足，就会在左侧或右侧补空格，直到达到最小宽度。默认在左侧补齐（即右对齐），但可以通过左对齐标志指定在右侧补齐。补齐用的字符是空格。如果数据项的长度大于最小字段宽度，字段会自动扩展以容纳数据，值绝不会被截断。

This behavior can be changed using the *maximum field width* modifier which is designated by a period followed by a decimal constant. If the data item is longer than the maximum field, then the extra characters are removed from the *beginning* of the data item. For example, if the maximum field width is eight and the data item is ten characters long, then the first two characters of the data item are dropped. This behavior deviates from the printf function in C where truncation is done from the end.

这种行为可以通过*最大字段宽度*(maximum field width)修饰符来改变，它由一个句点加一个十进制常量表示。如果数据项的长度超过最大字段宽度，多余的字符会从数据项的*开头*删除。例如，最大字段宽度为 8 而数据项长 10 个字符，那么数据项的前两个字符会被丢弃。这个行为与 C 语言的 printf 函数不同，后者的截断是从末尾进行的。

Truncation from the end is possible by appending a minus character right after the period. In that case, if the maximum field width is eight and the data item is ten characters long, then the last two characters of the data item are dropped.

如果在句点后紧跟一个减号，则可以从末尾截断。在这种情况下，如果最大字段宽度为 8 而数据项长 10 个字符，那么数据项的最后两个字符会被丢弃。

Below are various format modifier examples for the logger conversion specifier.

下面是 logger 转换说明符的各种格式修饰符示例。

| Format modifier | Left justify | Minimum width | Maximum width | Comment                                                      |
| --------------- | ------------ | ------------- | ------------- | ------------------------------------------------------------ |
| %20logger       | false        | 20            | none          | Left pad with spaces if the logger name is less than 20 characters long. |
| %-20logger      | true         | 20            | none          | Right pad with spaces if the logger name is less than 20 characters long. |
| %.30logger      | NA           | none          | 30            | Truncate from the beginning if the logger name is longer than 30 characters. |
| %20.30logger    | false        | 20            | 30            | Left pad with spaces if the logger name is shorter than 20 characters. However, if logger name is longer than 30 characters, then truncate from the beginning. |
| %-20.30logger   | true         | 20            | 30            | Right pad with spaces if the logger name is shorter than 20 characters. However, if logger name is longer than 30 characters, then truncate from the *beginning*. |
| %.-30logger     | NA           | none          | 30            | Truncate from the *end* if the logger name is longer than 30 characters. |

中文对照：

| 格式修饰符 | 左对齐 | 最小宽度 | 最大宽度 | 说明 |
| --- | --- | --- | --- | --- |
| %20logger | false | 20 | 无 | 若 logger 名称不足 20 个字符，则在左侧补空格。 |
| %-20logger | true | 20 | 无 | 若 logger 名称不足 20 个字符，则在右侧补空格。 |
| %.30logger | NA | 无 | 30 | 若 logger 名称超过 30 个字符，则从开头截断。 |
| %20.30logger | false | 20 | 30 | 若 logger 名称不足 20 个字符，则在左侧补空格；若超过 30 个字符，则从开头截断。 |
| %-20.30logger | true | 20 | 30 | 若 logger 名称不足 20 个字符，则在右侧补空格；若超过 30 个字符，则从*开头*截断。 |
| %.-30logger | NA | 无 | 30 | 若 logger 名称超过 30 个字符，则从*末尾*截断。 |

The table below list examples for format modifier truncation. Please note that the square brackets, i.e the pair of "[]" characters, are not part of the output. They are used to delimit the width of output.

下表列出了格式修饰符截断的示例。请注意，方括号（即 "[]" 这一对字符）并不是输出的一部分，只是用来标示输出的宽度。

| Format modifier | Logger name           | Result                   |
| --------------- | --------------------- | ------------------------ |
| [%20.20logger]  | main.Name             | `[           main.Name]` |
| [%-20.20logger] | main.Name             | `[main.Name           ]` |
| [%10.10logger]  | main.foo.foo.bar.Name | `[o.bar.Name]`           |
| [%10.-10logger] | main.foo.foo.bar.Name | `[main.foo.f]`           |

中文对照：

| 格式修饰符 | Logger 名称 | 结果 |
| --- | --- | --- |
| [%20.20logger] | main.Name | `[           main.Name]` |
| [%-20.20logger] | main.Name | `[main.Name           ]` |
| [%10.10logger] | main.foo.foo.bar.Name | `[o.bar.Name]` |
| [%10.-10logger] | main.foo.foo.bar.Name | `[main.foo.f]` |

### Output just one letter for the level

### 级别只输出一个字母

Instead of printing TRACE, DEBUG, WARN, INFO or ERROR for the level, you may want to print just T, D, W, I and E. You could write a [custom converter](http://logback.qos.ch/manual/layouts.html#customConversionSpecifier) for this purpose, or simply make use of format modifiers (just discussed) to shorten the level value to a single character. The appropriate conversion specifier would be "`%.-1level`".

对于级别，你可能不想打印 TRACE、DEBUG、WARN、INFO 或 ERROR，而只想打印 T、D、W、I 和 E。为此，你可以编写一个[自定义转换器](http://logback.qos.ch/manual/layouts.html#customConversionSpecifier)，或者直接利用刚才讨论的格式修饰符把级别值缩短成单个字符。相应的转换说明符是 "`%.-1level`"。

## Conversion word options

## 转换词选项

A conversion specifier can be followed by options. The are always declared between braces. We have already seen some of the possibilities offered by options, for instance in conjunction with the MDC conversion specifier, as in: *%mdc{someKey}*.

转换说明符后面可以跟选项，选项总是声明在花括号之间。我们已经见过选项的一些用法，比如与 MDC 转换说明符配合使用的 *%mdc{someKey}*。

A conversion specifier might have more than one option. For example, a conversion specifier that makes use of evaluators, which will be covered soon, may add evaluator names to the option list, as shown below:

一个转换说明符可以有多个选项。例如，使用 evaluator（稍后会讲到）的转换说明符，可以把 evaluator 名称加入选项列表，如下所示：

```
<pattern>%-4relative [%thread] %-5level - %msg%n \
  %caller{2, DISP_CALLER_EVAL, OTHER_EVAL_NAME, THIRD_EVAL_NAME}</pattern>
```

If the option includes special characters such as a braces, spaces or commas, you can enclose it between single or double quotes. For example, consider the next pattern.

如果选项中包含花括号、空格或逗号等特殊字符，可以用单引号或双引号把它括起来。例如，看下面这个模式。

```
<pattern>%-5level - %replace(%msg){'\d{14,16}', 'XXXX'}%n</pattern>
```

We pass the options `\d{16}` and `XXXX` to the `replace` conversion word. It replaces any sequence of 14, 15 or 16 digits contained in the message with XXXX effectively obfuscating credit card numbers. Note that "\d" which is a shorthand for a single digit in regular expressions. The "{14,16\}" is interpreted as "{14, 16}", that is, repeat the previous item at least 14 but at most 16 times.

我们把选项 `\d{16}` 和 `XXXX` 传给 `replace` 转换词。它会把消息中包含的 14、15 或 16 位数字序列替换成 XXXX，从而有效地遮蔽信用卡号。注意，"\d" 是正则表达式中单个数字的简写，"{14,16\}" 被解释为 "{14, 16}"，也就是说，把前一项重复至少 14 次、至多 16 次。

## Parentheses are special

## 圆括号很特殊

In logback, parentheses within the pattern string are treated as grouping tokens. Thus, it is possible to group a sub-pattern and apply formatting directives on that sub-pattern. As of version 0.9.27, logback supports composite conversion words such as [%replace](http://logback.qos.ch/manual/layouts.html#replace) which can transform sub-patterns.

在 logback 中，模式字符串里的圆括号被视为分组标记。因此，可以把一个子模式成组，并对该子模式应用格式化指令。从 0.9.27 版本开始，logback 支持诸如 [%replace](http://logback.qos.ch/manual/layouts.html#replace) 之类的复合转换词，可以对子模式进行变换。

For example, the pattern

例如，模式

**%-30(**%d{HH:mm:ss.SSS} [%thread]**)** %-5level %logger{32} - %msg%n

will group the output generated by the sub-pattern "%d{HH:mm:ss.SSS} [%thread]" so that it is right-padded if less than 30 characters.

会把子模式 "%d{HH:mm:ss.SSS} [%thread]" 生成的输出成组，这样当它不足 30 个字符时就会在右侧补空格。

If without the grouping the output was

13:09:30 [main] DEBUG c.q.logback.demo.ContextListener - Classload hashcode is 13995234 13:09:30 [main] DEBUG c.q.logback.demo.ContextListener - Initializing for ServletContext 13:09:30 [main] DEBUG c.q.logback.demo.ContextListener - Trying platform Mbean server 13:09:30 [pool-1-thread-1] INFO  ch.qos.logback.demo.LoggingTask - Howdydy-diddly-ho - 0 13:09:38 [btpool0-7] INFO c.q.l.demo.lottery.LotteryAction - Number: 50 was tried. 13:09:40 [btpool0-7] INFO c.q.l.d.prime.NumberCruncherImpl - Beginning to factor. 13:09:40 [btpool0-7] DEBUG c.q.l.d.prime.NumberCruncherImpl - Trying 2 as a factor. 13:09:40 [btpool0-7] INFO c.q.l.d.prime.NumberCruncherImpl - Found factor 2    

with the "%-30()" grouping it would be

如果用 "%-30()" 分组，则会变成：

13:09:30 [main]            DEBUG c.q.logback.demo.ContextListener - Classload hashcode is 13995234 13:09:30 [main]            DEBUG c.q.logback.demo.ContextListener - Initializing for ServletContext 13:09:30 [main]            DEBUG c.q.logback.demo.ContextListener - Trying platform Mbean server 13:09:30 [pool-1-thread-1] INFO  ch.qos.logback.demo.LoggingTask - Howdydy-diddly-ho - 0 13:09:38 [btpool0-7]       INFO  c.q.l.demo.lottery.LotteryAction - Number: 50 was tried. 13:09:40 [btpool0-7]       INFO  c.q.l.d.prime.NumberCruncherImpl - Beginning to factor. 13:09:40 [btpool0-7]       DEBUG c.q.l.d.prime.NumberCruncherImpl - Trying 2 as a factor. 13:09:40 [btpool0-7]       INFO  c.q.l.d.prime.NumberCruncherImpl - Found factor 2    

The latter form is more comfortable to read.

后一种形式读起来要舒服得多。

If you need to treat the parenthesis character as a literal, it needs to be escaped by preceding each parenthesis with a backslash. As in, **\(**%d{HH:mm:ss.SSS} [%thread]**\)**.

如果需要把圆括号当作字面字符使用，就要在每个括号前加上反斜杠进行转义，例如 **\(**%d{HH:mm:ss.SSS} [%thread]**\)**。

## Coloring

## 着色

Grouping by [parentheses](http://logback.qos.ch/manual/layouts.html#Parentheses) as explained above allows coloring of sub-patterns. As of version 1.0.5, `PatternLayout` recognizes "%black", "%red", "%green","%yellow","%blue", "%magenta","%cyan", "%white", "%gray", "%boldRed","%boldGreen", "%boldYellow", "%boldBlue", "%boldMagenta""%boldCyan", "%boldWhite" and "%highlight" as conversion words. These conversion words are intended to contain a sub-pattern. Any sub-pattern enclosed by a coloring word will be output in the specified color.

如上所述，用[圆括号](http://logback.qos.ch/manual/layouts.html#Parentheses)分组可以对子模式着色。从 1.0.5 版本开始，`PatternLayout` 将 "%black"、"%red"、"%green"、"%yellow"、"%blue"、"%magenta"、"%cyan"、"%white"、"%gray"、"%boldRed"、"%boldGreen"、"%boldYellow"、"%boldBlue"、"%boldMagenta"、"%boldCyan"、"%boldWhite" 和 "%highlight" 识别为转换词。这些转换词需要包含一个子模式，任何被着色转换词包住的子模式都会以指定的颜色输出。

Below is a configuration file illustrating coloring. Note the %cyan conversion specifier enclosing "%logger{15}". This will output the logger name abbreviated to 15 characters in cyan. The %highlight conversion specifier prints its sub-pattern in bold-red for events of level ERROR, in red for WARN, in BLUE for INFO, and in the default color for other levels.

下面是一个演示着色的配置文件。注意包住 "%logger{15}" 的 %cyan 转换说明符，它会把缩写为 15 个字符的 logger 名称以青色(cyan)输出。%highlight 转换说明符对 ERROR 级别的事件以粗体红色打印其子模式，WARN 为红色，INFO 为蓝色(BLUE)，其他级别使用默认颜色。

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

把 `withJansi` 设为 true 会启用 Jansi 库对 ANSI 颜色代码的解释，如果底层终端不兼容，Jansi 会透明地过滤掉 ANSI 转义序列。这是跨平台部署时最安全的选择，但需要在 class path 中加入 org.fusesource.jansi:jansi:1.17 或更高版本。注意，Linux、Mac OS X 这类基于 Unix 的操作系统原生支持 ANSI 颜色代码，通常无需启用 Jansi 库，不过启用也无妨。而在 Windows 上，建议启用 Jansi，以便在 DOS 命令提示符下正确解释颜色代码，否则命令提示符可能会收到它无法解释的 ANSI 转义序列。

Here is the corresponding output:

下面是对应的输出：

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

创建一个着色转换词只需要很少的几行代码。"创建自定义转换说明符"一节讨论了在配置文件中注册转换词所需的步骤。

## Evaluators

## Evaluator(求值器)

As mentioned above, option lists come in handy when a conversion specifier is required to behave dynamically based on one or more [`EventEvaluator`](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/EventEvaluator.html) objects. `EventEvaluator` objects have the responsibility to determine whether a given logging event matches the criteria of the evaluator.

如前所述，当需要转换说明符根据一个或多个 [`EventEvaluator`](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/EventEvaluator.html) 对象动态地改变行为时，选项列表就派上用场了。`EventEvaluator` 对象负责判断给定的日志事件是否匹配 evaluator 的条件。

Let us review an example involving a `EventEvaluator`. The next configuration file outputs the logging events to the console, displaying date, thread, level, message and caller data. Given that extracting the caller data of a logging event is on the expensive side, we will do so only when the logging request originates from a specific logger, and when the message contains a certain string. Thus, we make sure that only specific logging requests will have their caller information generated and displayed. In other cases, where the caller data is superfluous, we will not penalize application performance.

下面来看一个涉及 `EventEvaluator` 的示例。接下来的配置文件把日志事件输出到控制台，显示日期、线程、级别、消息和调用者数据。鉴于提取日志事件的调用者数据开销较大，我们只在日志请求来自特定的 logger、并且消息包含某个字符串时才这么做。这样，我们确保只有特定的日志请求才会生成并显示调用者信息；而在调用者数据多余的其他情况下，不会拖累应用性能。

Evaluators and in particular *evaluation expressions* are presented in a [dedicated section of the chapter on filters](http://logback.qos.ch/manual/filters.html#evalutatorFilter) which you MUST read if you want to use evaluators in any meaningful way. Also note that the examples below are implicitly based on `JaninoEventEvaluator` which requires the [Janino library](http://docs.codehaus.org/display/JANINO/Home). Please see the [corresponding section](http://logback.qos.ch/setup.html#janino) of the setup document.

Evaluator，特别是*求值表达式*(evaluation expression)，在[过滤器一章的专门小节](http://logback.qos.ch/manual/filters.html#evalutatorFilter)中介绍。如果你想真正用上 evaluator，务必阅读该节。另外请注意，下面的示例都隐含地基于 `JaninoEventEvaluator`，它需要 [Janino 库](http://docs.codehaus.org/display/JANINO/Home)，请参阅 setup 文档的[相应小节](http://logback.qos.ch/setup.html#janino)。

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

上面的求值表达式匹配两类条件同时满足的事件：logger 名称包含字符串 "chapters.layouts"，且消息包含字符串 "who calls thee"。由于 XML 的编码规则，& 字符不能直接书写，需要转义为 &amp;。

The following class makes use of some of the characteristics mentioned in above configuration file.

下面的类用到了上述配置文件中的一些特性。

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

上面的应用并没有什么特别花哨的东西。它发出了五条日志请求，第三条输出消息 "who calls thee?"

The command

命令

java chapters.layouts.CallerEvaluatorExample src/main/java/chapters/layouts/callerEvaluatorConfig.xml

will yield

会输出：

```
0    [main] DEBUG - I know me 0 
0    [main] DEBUG - I know me 1 
0    [main] DEBUG - I know me 2 
0    [main] DEBUG - who calls thee? 
Caller+0   at chapters.layouts.CallerEvaluatorExample.main(CallerEvaluatorExample.java:28)
0    [main] DEBUG - I know me 4
```

When a logging request is issued, the corresponding logging event is evaluated. Only the third logging event matches the evaluation criteria, causing its caller data to be displayed. For other logging events, the evaluation criteria do not match and no caller data is printed.

发出日志请求时，相应的日志事件会被求值。只有第三个日志事件匹配求值条件，因此它的调用者数据被显示出来。对于其他日志事件，求值条件不匹配，不会打印调用者数据。

One can change the expression to correspond a real world scenario. For instance, one could combine the logger name and request level. Thus, logging requests of level *WARN* and up, originating from a sensitive part of an application, e.g. a financial transaction module, would have their caller data displayed.

可以把表达式改成符合实际场景的形式。例如，可以把 logger 名称和请求级别结合起来。这样，来自应用敏感部分（比如金融交易模块）的 *WARN* 及以上级别的日志请求，就会显示其调用者数据。

可以把表达式改成符合实际场景的形式。例如，可以把 logger 名称和请求级别结合起来。这样，来自应用敏感部分（比如金融交易模块）的 *WARN* 及以上级别的日志请求，就会显示其调用者数据。

**Important:** With the *caller* conversion word, caller data is output when *the expression evaluates to **true**.*

**重要**：使用 *caller* 转换词时，*当表达式求值为 **true** 时*才输出调用者数据。

Let us consider at a different situation. When exceptions are included in a logging request, their stack trace is also output. However, one might want to suppress the stack trace for some specific exceptions.

我们再看另一种情况。当日志请求中包含异常时，异常的堆栈跟踪也会被输出。不过，有时我们可能希望对某些特定的异常抑制其堆栈跟踪的输出。

The Java code shown below creates three log requests, each with an exception. The second exception is different from the others: it contains the string "do not display this" and it is of type `chapters.layouts.TestException`. As its message commands, let us now prevent the second exception from being printed.

下面的 Java 代码创建了三条日志请求，每条都带一个异常。第二个异常与众不同：它包含字符串 "do not display this"，并且类型为 `chapters.layouts.TestException`。正如其消息所"命令"的那样，我们来阻止第二个异常被打印。

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

在下一个配置文件中，求值表达式匹配包含 `chapters.layouts.TextException` 类型 throwable 的事件，这正是我们希望抑制的异常类型。

*Example: Sample usage of EventEvaluators (logback-examples/src/main/resources/chapters/layouts/exceptionEvaluatorConfig.xml)*

With this configuration, each time an instance of the *chapters.layouts.TestException* is included within a logging request, the stack trace will be suppressed.

采用这个配置后，每当日志请求中包含 *chapters.layouts.TestException* 的实例，其堆栈跟踪都会被抑制。

Launching the command

执行命令

java chapters.layouts.ExceptionEvaluatorExample src/main/java/chapters/layouts/exceptionEvaluatorConfig.xml

will yield

会输出：

logging statement 0 java.lang.Exception: display  at chapters.layouts.ExceptionEvaluatorExample.main(ExceptionEvaluatorExample.java:43) [logback-examples-0.9.19.jar:na] logging statement 1 logging statement 2 java.lang.Exception: display  at chapters.layouts.ExceptionEvaluatorExample.main(ExceptionEvaluatorExample.java:43) [logback-examples-0.9.19.jar:na]

Notice how the second log statement has no stack trace. We effectively suppressed the stack trace for the `TextException`. The text between square brackets at the end of each stack trace line is [packaging information](http://logback.qos.ch/manual/layouts.html#xThrowable) discussed earlier.

注意第二条日志语句没有堆栈跟踪。我们成功抑制了 `TextException` 的堆栈跟踪。每行堆栈跟踪末尾方括号中的文本就是前文讨论过的[打包信息](http://logback.qos.ch/manual/layouts.html#xThrowable)。

**NOTE** With the ***%ex\*** conversion specifier, the stack trace is displayed when *the expression evaluates to **false**.*

**注意**：使用 ***%ex\*** 转换说明符时，*当表达式求值为 **false** 时*才显示堆栈跟踪。

## Creating a custom conversion specifier

## 创建自定义转换说明符

Up to this point we have presented the built-in conversion words in `PatternLayout`. But it is also possible to add conversion words of your own making.

到目前为止，我们介绍的都是 `PatternLayout` 内置的转换词。不过，也可以添加你自己打造的转换词。

Building a custom conversion specifier consists of two steps.

构建自定义转换说明符包含两个步骤。

#### Step 1

#### 第一步

First, you must extend the `ClassicConverter` class. [`ClassicConverter`](http://logback.qos.ch/xref/ch/qos/logback/classic/pattern/ClassicConverter.html) objects are responsible for extracting information out of `ILoggingEvent` instances and producing a String. For example, [`LoggerConverter`](http://logback.qos.ch/xref/ch/qos/logback/classic/pattern/LoggerConverter.html), the converter underlying the %logger conversion word, extracts the name of the logger from `ILoggingEvent` and returns it as a String. It might abbreviate the logger name in the process.

首先，你必须继承 `ClassicConverter` 类。[ClassicConverter](http://logback.qos.ch/xref/ch/qos/logback/classic/pattern/ClassicConverter.html) 对象负责从 `ILoggingEvent` 实例中提取信息并生成 String。例如，%logger 转换词底层的转换器 [`LoggerConverter`](http://logback.qos.ch/xref/ch/qos/logback/classic/pattern/LoggerConverter.html) 会从 `ILoggingEvent` 中提取 logger 名称并以 String 返回，过程中还可能对 logger 名称进行缩写。

Here is a customer converter which returns the time elapsed since its creaton in nanoseconds:

下面是一个自定义转换器，它返回自创建以来经过的时间（以纳秒为单位）：

*Example: Sample Converter Example [(src/main/java/chapters/layouts/MySampleConverter.java)](http://logback.qos.ch/xref/chapters/layouts/MySampleConverter.html)*

This implementation is pretty straightforward. The `MySampleConverter` class extends `ClassicConverter`, and implements the `convert` method which returns the number of nano-seconds elapsed since its creation.

这个实现非常直白。`MySampleConverter` 类继承自 `ClassicConverter`，并实现了 `convert` 方法，返回自创建以来经过的纳秒数。

#### Step 2

#### 第二步

In the second step, we must let logback know about the new `Converter`. For this purpose, we need to declare the new conversion word in the configuration file, as shown below:

第二步，我们需要让 logback 知道这个新的 `Converter`。为此，需要在配置文件中声明新的转换词，如下所示：

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

在配置文件中声明了新的转换词之后，就可以像使用其他转换词一样，在 `PatternLayout` 的模式里引用它。

The command:

命令：

java chapters.layouts.SampleLogging src/main/java/chapters/layouts/mySampleConverterConfig.xml 

should yield output akin to:

应该会输出类似如下的结果：

```
4868695 [main] DEBUG - Everything's going well
5758748 [main] ERROR - maybe not quite...
```

The reader might want to take a look at other `Converter` implementations such as [`MDCConverter`](http://logback.qos.ch/xref/ch/qos/logback/classic/pattern/MDCConverter.html) to learn about more complex behaviours, such as option handling. For creating your own coloring schemes have a look at [`HighlightingCompositeConverter`](http://logback.qos.ch/xref/ch/qos/logback/classic/pattern/color/HighlightingCompositeConverter.html).

读者不妨看看其他 `Converter` 实现，比如 [`MDCConverter`](http://logback.qos.ch/xref/ch/qos/logback/classic/pattern/MDCConverter.html)，以了解选项处理之类更复杂的行为。如果想创建自己的着色方案，可以看看 [`HighlightingCompositeConverter`](http://logback.qos.ch/xref/ch/qos/logback/classic/pattern/color/HighlightingCompositeConverter.html)。

## HTMLLayout

[`HTMLLayout`](http://logback.qos.ch/xref/ch/qos/logback/classic/html/HTMLLayout.html) (as included in logback-classic) generates logs in HTML format. `HTMLLayout` outputs logging events in an HTML table where each row of the table corresponds to a logging event.

（logback-classic 中包含的）[`HTMLLayout`](http://logback.qos.ch/xref/ch/qos/logback/classic/html/HTMLLayout.html) 以 HTML 格式生成日志。`HTMLLayout` 把日志事件输出到一个 HTML 表格中，表格的每一行对应一个日志事件。

Here is a sample output produced by `HTMLLayout` using its default CSS stylesheet:

下面是 `HTMLLayout` 使用其默认 CSS 样式表产生的输出示例：

![HTML Layout Sample Image](http://logback.qos.ch/manual/images/chapters/layouts/htmlLayout0.gif)

The content of table columns are specified with the help of a conversion pattern. See [`PatternLayout`](http://logback.qos.ch/manual/layouts.html#ClassicPatternLayout) for documentation on conversion patterns. As such, you have full control over the contents and format of the table. You can select and display any combination of converters `PatternLayout` knows about.

表格各列的内容通过转换模式指定。转换模式的文档参见 [`PatternLayout`](http://logback.qos.ch/manual/layouts.html#ClassicPatternLayout) 一节。这样，你就可以完全控制表格的内容和格式，可以任意组合并显示 `PatternLayout` 所知道的转换器。

One notable exception about the use of `PatternLayout` with `HTMLLayout` is that conversion specifiers should not be separated by space characters or more generally by literal text. Each specifier found in the pattern will result in a separate column. Likewise a separate column will be generated for each block of literal text found in the pattern, potentially wasting valuable real-estate on your screen.

在 `HTMLLayout` 中使用 `PatternLayout` 有一个值得注意的例外：转换说明符之间不应该用空格、或者更笼统地说不应该用字面文本分隔。模式中的每个说明符都会生成一个单独的列；同样，模式中出现的每一块字面文本也会各自生成一列，可能会白白浪费屏幕上的宝贵空间。

Here is simple but functional configuration file illustrating the use of `HTMLLayout`.

下面是一个简单但实用的配置文件，演示了 `HTMLLayout` 的用法。

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

[TrivialMain](http://logback.qos.ch/xref/chapters/layouts/TrivialMain.html) 应用会输出几条消息，最后带上一个异常。命令：

java chapters.layouts.TrivialMain src/main/java/chapters/layouts/htmlLayoutConfig1.xml

will create the file *test.html* in the current folder. The contents of *test.html* should be similar to:

会在当前目录创建 *test.html* 文件，其内容类似于：

![HTML Layout Sample Image](http://logback.qos.ch/manual/images/chapters/layouts/htmlLayout1.png)

### Stack traces

### 堆栈跟踪

If you use the *%em* conversion word to display stack traces, a table column will be created to display stack traces. In most cases the column will be empty, wasting screen real-estate. Moreover, printing a stack trace on a separate column does not yield very readable results. Fortunately, the *%ex* conversion word is not the only way to display stack traces.

如果使用 *%em* 转换词显示堆栈跟踪，系统会创建一个表格列来显示堆栈跟踪。但大多数情况下这一列是空的，白白浪费屏幕空间；而且把堆栈跟踪打印在单独的一列里，可读性也不高。幸运的是，*%ex* 转换词并不是显示堆栈跟踪的唯一方式。

A better solution is available through implementations of `IThrowableRenderer` interface. Such an implementation can be assigned to `HTMLLayout` to manage the display data related to exceptions. By default, a [`DefaultThrowableRenderer`](http://logback.qos.ch/xref/ch/qos/logback/classic/html/DefaultThrowableRenderer.html) is assigned to each `HTMLLayout` instance. It writes exceptions on a *new table row*, along with its stack trace, in an easily readable manner, as shown on the figure above.

更好的方案是通过 `IThrowableRenderer` 接口的实现来提供。可以把这样的实现指派给 `HTMLLayout`，由它管理与异常相关的显示数据。默认情况下，每个 `HTMLLayout` 实例都会被指派一个 [`DefaultThrowableRenderer`](http://logback.qos.ch/xref/ch/qos/logback/classic/html/DefaultThrowableRenderer.html)，它会把异常及其堆栈跟踪写在一个*新的表格行*里，易于阅读，如上图所示。

If for some reason, you still wish to use the *%ex* pattern, then you can specify [`NOPThrowableRenderer`](http://logback.qos.ch/xref/ch/qos/logback/core/html/NOPThrowableRenderer.html) in the configuration file in order to disable displaying a separate row for the stack trace. We don't have the faintest idea why you would want to do that, but if you wished, you could.

如果出于某些原因你仍然想使用 *%ex* 模式，那么可以在配置文件中指定 [`NOPThrowableRenderer`](http://logback.qos.ch/xref/ch/qos/logback/core/html/NOPThrowableRenderer.html)，从而禁用为堆栈跟踪单独显示一行的功能。我们完全想不通你为什么要这么做，但只要你愿意，也未尝不可。

### CSS

The presentation of the HTML created by `HTMLLayout` is controlled through a Cascading Style Sheet (CSS). In the absence of specific instructions, `HTMLLayout` will default to its internal CSS. However, you can instruct `HTMLLayout` to use an external CSS file. For this purpose a `cssBuilder` element can be nested within a `` element, as shown below.

`HTMLLayout` 生成的 HTML 的外观由层叠样式表(CSS)控制。在没有特别指定的情况下，`HTMLLayout` 默认使用其内部 CSS。不过，你也可以让 `HTMLLayout` 使用外部 CSS 文件。为此，可以在 `` 元素中嵌套一个 `cssBuilder` 元素，如下所示。

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

`HTMLLayout` 常与 `SMTPAppender` 配合使用，这样发出的邮件就能以漂亮的 HTML 格式呈现。

## Log4j XMLLayout

[XMLLayout](http://logback.qos.ch/xref/ch/qos/logback/classic/log4j/XMLLayout.html) (part of logback-classic) generates output in a log4j.dtd compliant format to interoperate with tools such as [Chainsaw](http://logging.apache.org/chainsaw/index.html) and [Vigilog](http://vigilog.sourceforge.net/) capable of processing files generated by [log4j's XMLLayout](http://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/xml/XMLLayout.html).

[XMLLayout](http://logback.qos.ch/xref/ch/qos/logback/classic/log4j/XMLLayout.html)（logback-classic 的一部分）以符合 log4j.dtd 的格式生成输出，可以与 [Chainsaw](http://logging.apache.org/chainsaw/index.html)、[Vigilog](http://vigilog.sourceforge.net/) 这类能够处理 [log4j XMLLayout](http://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/xml/XMLLayout.html) 所生成文件的工具互操作。

As the original XMLLayout in log4j version 1.2.15, XMLLayout in logback-classic takes two boolean properties, locationInfo and properties. Setting locationInfo to true enables the inclusion of location info (caller data) in the each event. Setting properties to true enables the inclusion of MDC information. Both options are set to false by default.

与 log4j 1.2.15 版本中的原始 XMLLayout 一样，logback-classic 中的 XMLLayout 接受两个 boolean 属性：locationInfo 和 properties。把 locationInfo 设为 true 会在每个事件中包含位置信息（调用者数据）；把 properties 设为 true 会包含 MDC 信息。这两个选项默认都为 false。

Here is a sample configuration

下面是一个配置示例

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

# Logback access

Most logback-access layouts are mere adaptations of logback-classic layouts. Logback-classic and logback-access modules address different needs, but in general offer comparable functionality.

大多数 logback-access 的 layout 只是 logback-classic layout 的简单改编。logback-classic 和 logback-access 模块针对不同的需求，但总体上提供了相当的功能。

## Writing your own Layout

## 编写自己的 Layout

Writing a custom `Layout` for logback access is nearly identical to its sibling `Layout` in logback-classic.

为 logback access 编写自定义 `Layout`，与在 logback-classic 中编写对应的 `Layout` 几乎完全一样。

### PatternLayout

[`PatternLayout`](http://logback.qos.ch/xref/ch/qos/logback/access/PatternLayout.html) in logback-access can be configured in much the same way as its classic counterpart. However it features additional conversion specifiers suited for logging particular bits of information available only in HTTP servlet requests and HTTP servlet responses.

logback-access 中的 [`PatternLayout`](http://logback.qos.ch/xref/ch/qos/logback/access/PatternLayout.html) 的配置方式与其 classic 版本大致相同。不过，它提供了一些额外的转换说明符，适合记录只有 HTTP servlet 请求和 HTTP servlet 响应中才有的特定信息。

Below is a list of conversion specifiers for `PatternLayout` in logback-access.

下面列出了 logback-access 中 `PatternLayout` 的转换说明符。

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

中文对照：

| 转换词 | 作用 |
| --- | --- |
| **a / remoteIP** | 远程 IP 地址。 |
| **A / localIP** | 本地 IP 地址。 |
| **b / B / bytesSent** | 响应的内容长度。 |
| **h / clientHost** | 远程主机。 |
| **H / protocol** | 请求协议。 |
| **l** | 远程日志名。在 logback-access 中，此转换器总是返回 "-"。 |
| **reqParameter{paramName}** | 响应的参数。此转换词取花括号中的第一个选项，并在请求中查找对应的参数。**%reqParameter{input_data}** 显示对应的参数。 |
| **i{header} / header{header}** | 请求头。此转换词取花括号中的第一个选项，并在请求中查找对应的请求头。**%header{Referer}** 显示请求的 referer。若未指定选项，则显示所有可用的请求头。 |
| **m / requestMethod** | 请求方法。 |
| **r / requestURL** | 所请求的 URL。 |
| **s / statusCode** | 请求的状态码。 |
| **D / elapsedTime** | 处理请求所耗的时间，单位毫秒。 |
| **T / elapsedSeconds** | 处理请求所耗的时间，单位秒。 |
| **t / date** | 输出日志事件的日期。date 转换说明符后面可以跟一组花括号，其中是 `java.text.SimpleDateFormat` 使用的日期和时间模式字符串，*ISO8601* 也是合法取值。例如 **%t{HH:mm:ss,SSS}** 或 **%t{dd MMM yyyy ;HH:mm:ss,SSS}**。若未指定日期格式说明符，则默认采用 Common Log Format 的日期格式，即 **%t{dd/MMM/yyyy:HH:mm:ss Z}**。 |
| **u / user** | 远程用户。 |
| **q / queryString** | 请求的查询字符串，前面带一个 '?'。 |
| **U / requestURI** | 所请求的 URI。 |
| **S / sessionID** | 会话 ID。 |
| **v / server** | 服务器名称。 |
| **I / threadName** | 处理该请求的线程名称。 |
| **localPort** | 本地端口。 |
| **reqAttribute{attributeName}** | 请求的属性。此转换词取花括号中的第一个选项，并在请求中查找对应的属性。**%reqAttribute{SOME_ATTRIBUTE}** 显示对应的属性。 |
| **reqCookie{cookie}** | 请求的 cookie。此转换词取花括号中的第一个选项，并在请求中查找对应的 cookie。**%cookie{COOKIE_NAME}** 显示对应的 cookie。 |
| **responseHeader{header}** | 响应头。此转换词取花括号中的第一个选项，并在响应中查找对应的响应头。**%header{Referer}** 显示响应的 referer。 |
| **requestContent** | 此转换词显示请求的内容，即请求的 `InputStream`。它需要与 [`TeeFilter`](http://logback.qos.ch/xref/ch/qos/logback/access/servlet/TeeFilter.html) 配合使用，后者是一个 `javax.servlet.Filter`，会用 [`TeeHttpServletRequest`](http://logback.qos.ch/xref/ch/qos/logback/access/servlet/TeeHttpServletRequest.html) 替换原始的 `HttpServletRequest`。替换后的对象允许多次访问请求的 `InputStream` 而不丢失任何数据。 |
| **fullRequest** | 此转换器输出与请求关联的所有数据，包括全部请求头和请求内容。 |
| **responseContent** | 此转换词显示响应的内容，即响应的 `InputStream`。它需要与 [`TeeFilter`](http://logback.qos.ch/xref/ch/qos/logback/access/servlet/TeeFilter.html) 配合使用，后者是一个 `javax.servlet.Filter`，会用 [`TeeHttpServletResponse`](http://logback.qos.ch/xref/ch/qos/logback/access/servlet/TeeHttpServletResponse.html) 替换原始的 `HttpServletResponse`。替换后的对象允许多次访问请求的 `InputStream` 而不丢失任何数据。 |
| **fullResponse** | 此转换词输出与响应关联的所有可用数据，包括全部响应头和响应内容。 |

Logback access' `PatternLayout` also recognizes three keywords, which act like shortcuts.

logback access 的 `PatternLayout` 还识别三个关键字，它们的作用类似快捷方式。

| keyword           | equivalent conversion pattern                             |
| ----------------- | --------------------------------------------------------- |
| *common* or *CLF* | *%h %l %u [%t] "%r" %s %b*                                |
| *combined*        | *%h %l %u [%t] "%r" %s %b "%i{Referer}" "%i{User-Agent}"* |

The *common* keyword corresponds to the pattern *'%h %l %u [%t] "%r" %s %b'* which displays client host, remote log name, user, date, requested URL, status code and response's content length

*common* 关键字对应模式 *'%h %l %u [%t] "%r" %s %b'*，依次显示客户端主机、远程日志名、用户、日期、所请求的 URL、状态码以及响应的内容长度。

The *combined* keyword is a shortcut for *'%h %l %u [%t] "%r" %s %b "%i{Referer}" "%i{User-Agent}"'*. This pattern begins much like the *common* pattern but also displays two request headers, namely referer, and user-agent.

*combined* 关键字是 *'%h %l %u [%t] "%r" %s %b "%i{Referer}" "%i{User-Agent}"'* 的快捷方式。这一模式的开头与 *common* 模式基本相同，但还会额外显示两个请求头：referer 和 user-agent。

### HTMLLayout

The [`HTMLLayout`](http://logback.qos.ch/xref/ch/qos/logback/access/html/HTMLLayout.html) class found in logback-access is similar to the [`HTMLLayout`](http://logback.qos.ch/manual/layouts.html#ClassicHTMLLayout) class from logback-classic.

logback-access 中的 [`HTMLLayout`](http://logback.qos.ch/xref/ch/qos/logback/access/html/HTMLLayout.html) 类与 logback-classic 中的 [`HTMLLayout`](http://logback.qos.ch/manual/layouts.html#ClassicHTMLLayout) 类类似。

By default, it will create a table containing the following data:

默认情况下，它会创建一个包含如下数据的表格：

- Remote IP
- Date
- Request URL
- Status code
- Content Length

- 远程 IP
- 日期
- 请求 URL
- 状态码
- 内容长度

Here is a sample output produced by `HTMLLayout` in logback-access:

下面是 logback-access 中 `HTMLLayout` 产生的输出示例：

![Access HTML Layout Sample Image](http://logback.qos.ch/manual/images/chapters/layouts/htmlLayoutAccess.gif)

What can be better than a real world example? Our own log4j properties for logback [translator](http://logback.qos.ch/translator/) makes use of logback-access to demonstrate live output from `RollingFileAppender` with `HTMLLayout`.

还有什么比真实世界的例子更有说服力呢？我们自己的 log4j properties 转 logback 的[转换器](http://logback.qos.ch/translator/)就利用 logback-access 来演示 `RollingFileAppender` 配合 `HTMLLayout` 的实时输出。

On every new user request to our [translator](http://logback.qos.ch/translator/) web-application, a new entry will be added to the access logs, which you can view by [following this link](http://logback.qos.ch/translator/logs/access.html).

每当有新的用户请求访问我们的[转换器](http://logback.qos.ch/translator/) web 应用，访问日志中就会新增一条记录，你可以通过[这个链接](http://logback.qos.ch/translator/logs/access.html)查看。



<http://logback.qos.ch/manual/layouts.html>