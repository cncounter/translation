# Chapter 7: Filters

# 第7章: 过滤器(Filter)

*Have lots of ideas and throw away the bad ones. You aren't going to have good ideas unless you have lots of ideas and some sort of principle of selection.*

—LINUS PAULING

*要有很多想法，然后把坏的扔掉。如果你没有足够多的想法、也没有某种挑选的原则，就不可能有好想法。*

——LINUS PAULING（莱纳斯·鲍林）

In the preceding chapters, the [basic selection rule](http://logback.qos.ch/manual/architecture.html#basic_selection), which lies at the heart of logback-classic, has been presented. In this chapter, additional filtering methods will be introduced.

在前面的章节中，我们已经介绍了 logback-classic 核心的[基本选择规则](http://logback.qos.ch/manual/architecture.html#basic_selection)。本章将介绍更多的过滤方法。

Logback filters are based on ternary logic allowing them to be assembled or chained together to compose an arbitrarily complex filtering policy. They are largely inspired by Linux's iptables.

Logback 的过滤器基于三值逻辑(ternary logic)，可以把它们组装或串联起来，构成任意复杂的过滤策略。其设计在很大程度上借鉴了 Linux 的 iptables。

In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](http://logback.qos.ch/setup.html) for further details.

为了运行本章中的示例，需要确保 classpath 中存在某些 jar 文件。详情请参考 [setup page](http://logback.qos.ch/setup.html)。

## In logback-classic

## 在 logback-classic 中

Logback-classic offers two types of filters, regular filters and turbo filters.

Logback-classic 提供两类过滤器：普通过滤器(regular filter)和 turbo 过滤器(turbo filter)。

### Regular filters

### 普通过滤器

Regular logback-classic filters extend the [`Filter`](http://logback.qos.ch/xref/ch/qos/logback/core/filter/Filter.html) abstract class which essentially consists of a single `decide()` method taking an `ILoggingEvent` instance as its parameter.

logback-classic 的普通过滤器继承自 [`Filter`](http://logback.qos.ch/xref/ch/qos/logback/core/filter/Filter.html) 抽象类，该类本质上只包含一个 `decide()` 方法，它以一个 `ILoggingEvent` 实例作为参数。

Filters are organized as an ordered list and are based on ternary logic. The `decide(ILoggingEvent event)` method of each filter is called in sequence. This method returns one of the [`FilterReply`](http://logback.qos.ch/xref/ch/qos/logback/core/spi/FilterReply.html) enumeration values, i.e. one of `DENY`, `NEUTRAL` or `ACCEPT`. If the value returned by `decide`() is `DENY`, then the log event is dropped immediately without consulting the remaining filters. If the value returned is `NEUTRAL`, then the next filter in the list is consulted. If there are no further filters to consult, then the logging event is processed normally. If the returned value is `ACCEPT`, then the logging event is processed immediately skipping the invocation of the remaining filters.

过滤器以有序列表的形式组织，基于三值逻辑。每个过滤器的 `decide(ILoggingEvent event)` 方法按顺序被调用，该方法返回 [`FilterReply`](http://logback.qos.ch/xref/ch/qos/logback/core/spi/FilterReply.html) 枚举值之一，即 `DENY`、`NEUTRAL` 或 `ACCEPT`。如果 `decide`() 返回 `DENY`，日志事件会立即被丢弃，不再询问余下的过滤器。如果返回 `NEUTRAL`，则询问列表中的下一个过滤器；如果没有更多的过滤器可询问，日志事件就被正常处理。如果返回 `ACCEPT`，日志事件会被立即处理，跳过余下的过滤器。

In logback-classic, filters can be added to `Appender` instances. By adding one or more filters to an appender, you can filter events by arbitrary criteria, such as the contents of the log message, the contents of the MDC, the time of day or any other part of the logging event.

在 logback-classic 中，过滤器可以添加到 `Appender` 实例上。通过给 appender 添加一个或多个过滤器，你可以按任意条件过滤事件，比如日志消息的内容、MDC 的内容、当天的时间，或者日志事件的其他任何部分。

### Implementing your own Filter

### 实现自己的 Filter

Creating your own filter is easy. All you have to do is extend the `Filter` abstract class and implement the `decide()` method.

创建自己的过滤器很简单，只需继承 `Filter` 抽象类并实现 `decide()` 方法即可。

The SampleFilter class shown below provides an example. Its `decide` method returns ACCEPT for logging events containing the string "sample" in its message field. For other events, the value NEUTRAL is returned.

下面所示的 SampleFilter 类就是一个例子。它的 `decide` 方法对消息字段中包含字符串 "sample" 的日志事件返回 ACCEPT，对其他事件返回 NEUTRAL。

*Example: Basic custom filter ([logback-examples/src/main/java/chapters/filters/SampleFilter.java](http://logback.qos.ch/xref/chapters/filters/SampleFilter.html))*

The configuration files shown next attaches a `SampleFilter` to a `ConsoleAppender`.

接下来的配置文件把一个 `SampleFilter` 挂到 `ConsoleAppender` 上。

*Example: SampleFilter configuration (logback-examples/src/main/resources/chapters/filters/SampleFilterConfig.xml)*

With the help of Joran, logback's configuration framework, specifying properties or sub-components to filters is also easy. After adding the corresponding setter method in the filter class, specify the value of the property in an xml element named after the property, nesting it within a `` element.

借助 logback 的配置框架 Joran，给过滤器指定属性或子组件也很容易。在过滤器类中添加相应的 setter 方法之后，就可以在与属性同名的 xml 元素中指定属性值，并将其嵌套在 `` 元素内。

Often, the desired filter logic consists of two orthogonal parts, a match/mismatch test and a response depending on the match/mismatch. For example, for a given test, e.g. message equals "foobar", one filter might respond ACCEPT on match and NEUTRAL on mismatch, and another filter might respond NEUTRAL on match and DENY on mismatch.

通常，想要的过滤逻辑由两个正交的部分组成：一个匹配/不匹配的测试，以及依据匹配结果的响应。例如，对于某个给定的测试（比如 message 等于 "foobar"），一个过滤器可能在匹配时响应 ACCEPT、不匹配时响应 NEUTRAL，而另一个过滤器可能在匹配时响应 NEUTRAL、不匹配时响应 DENY。

Taking notice of this orthogonality, logback ships with the [`AbstractMatcherFilter`](http://logback.qos.ch/xref/ch/qos/logback/core/filter/AbstractMatcherFilter.html) class which provides a useful skeleton for specifying the appropriate response on match and on mismatch, with the help of two properties, named *OnMatch* and *OnMismatch*. Most of the regular filters included in logback are derived from `AbstractMatcherFilter`.

注意到这种正交性，logback 自带了 [`AbstractMatcherFilter`](http://logback.qos.ch/xref/ch/qos/logback/core/filter/AbstractMatcherFilter.html) 类。借助 *OnMatch* 和 *OnMismatch* 两个属性，它为"在匹配与不匹配时指定恰当的响应"提供了一个实用的骨架。logback 内置的大多数普通过滤器都派生自 `AbstractMatcherFilter`。

### LevelFilter

[`LevelFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/filter/LevelFilter.html) filters events based on exact level matching. If the event's level is equal to the configured level, the filter accepts or denies the event, depending on the configuration of the onMatch and onMismatch properties. Here is a sample configuration file.

[`LevelFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/filter/LevelFilter.html) 基于精确级别匹配来过滤事件。如果事件的级别等于配置的级别，过滤器会根据 onMatch 和 onMismatch 属性的配置来接受或拒绝该事件。下面是一个配置文件示例。

*Example: Sample LevelFilter configuration (logback-examples/src/main/resources/chapters/filters/levelFilterConfig.xml)*

### ThresholdFilter

The [`ThresholdFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/filter/ThresholdFilter.html) filters events below the specified threshold. For events of level equal or above the threshold, `ThresholdFilter` will respond NEUTRAL when its `decide`() method is invoked. However, events with a level below the threshold will be denied. Here is a sample configuration file.

[`ThresholdFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/filter/ThresholdFilter.html) 会过滤掉低于指定阈值的事件。对于级别等于或高于阈值的事件，`ThresholdFilter` 的 `decide`() 方法被调用时会响应 NEUTRAL；而级别低于阈值的事件则会被拒绝。下面是一个配置文件示例。

*Example: Sample ThresholdFilter configuration (logback-examples/src/main/resources/chapters/filters/thresholdFilterConfig.xml)*

## EvaluatorFilter

[`EvaluatorFilter`](http://logback.qos.ch/xref/ch/qos/logback/core/filter/EvaluatorFilter.html) is a generic filter encapsulating an `EventEvaluator`. As the name suggests, an [`EventEvaluator`](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/EventEvaluator.html) evaluates whether a given criteria is met for a given event. On match and on mismatch, the hosting `EvaluatorFilter` will return the value specified by the onMatch or onMismatch properties respectively.

[`EvaluatorFilter`](http://logback.qos.ch/xref/ch/qos/logback/core/filter/EvaluatorFilter.html) 是一个封装了 `EventEvaluator` 的通用过滤器。顾名思义，[`EventEvaluator`](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/EventEvaluator.html) 会对给定事件求值，判断是否满足给定的条件。在匹配与不匹配时，承载它的 `EvaluatorFilter` 会分别返回 onMatch 或 onMismatch 属性指定的值。

Note that `EventEvaluator` is an abstract class. You can implement your own event evaluation logic by sub-classing `EventEvaluator`.

注意，`EventEvaluator` 是抽象类。你可以通过继承 `EventEvaluator` 来实现自己的事件求值逻辑。

### GEventEvaluator

[GEventEvaluator](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/GEventEvaluator.html) is a concrete [`EventEvaluator`](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/EventEvaluator.html) implementation taking arbitrary Groovy language boolean expressions as the evaluation criteria. We refer such Groovy language boolean expressions as "groovy evaluation expressions". Groovy evaluation expressions enable hitherto unprecedented flexibility in event filtering. `GEventEvaluator` requires the Groovy runtime. Please see the [corresponding section](http://logback.qos.ch/setup.html#groovy) of the setup document on adding the Groovy runtime to your class path.

[GEventEvaluator](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/GEventEvaluator.html) 是 [`EventEvaluator`](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/EventEvaluator.html) 的一个具体实现，它以任意 Groovy 语言的布尔表达式作为求值条件。我们把这类 Groovy 布尔表达式称为 "groovy 求值表达式"。Groovy 求值表达式给事件过滤带来了前所未有的灵活性。`GEventEvaluator` 需要 Groovy 运行时，关于如何把 Groovy 运行时加入 class path，请参阅 setup 文档的[相应小节](http://logback.qos.ch/setup.html#groovy)。

Evaluation expressions are compiled on-the-fly during the interpretation of the configuration file. As a user, you do not need to worry about the actual plumbing. However, it is your responsibility to ensure that the groovy-language expression is valid.

求值表达式在解析配置文件时即时编译。作为用户，你无需关心其中的具体机制，但你有责任确保 groovy 语言表达式是合法的。

The evaluation expression acts on the current logging event. Logback automatically inserts the current logging event of type [ILoggingEvent](http://logback.qos.ch/apidocs/ch/qos/logback/classic/spi/ILoggingEvent.html) as a variable referred to as '*event*' as well as its shorthand referred to as '*e*'. The variables TRACE, DEBUG, INFO, WARN and ERROR are also exported into the scope of the expression. Thus, "event.level == DEBUG" and "e.level == DEBUG" are equivalent and valid groovy expressions which will return `true` only if the current logging event's level is identical to DEBUG. For other comparison operators on levels, the level field should be converted to integer with the `toInt()` operator.

求值表达式作用于当前日志事件。Logback 会自动把 [ILoggingEvent](http://logback.qos.ch/apidocs/ch/qos/logback/classic/spi/ILoggingEvent.html) 类型的当前日志事件作为变量 '*event*'（及其简写 '*e*'）插入表达式。TRACE、DEBUG、INFO、WARN、ERROR 这几个变量也会被导出到表达式的作用域中。因此，"event.level == DEBUG" 和 "e.level == DEBUG" 是等价且合法的 groovy 表达式，只有当当前日志事件的级别恰好是 DEBUG 时才会返回 `true`。如果要对级别使用其他比较运算符，需要用 `toInt()` 运算符把 level 字段转换成整数。

Here is a more complete example.

下面是一个更完整的例子。

```
<configuration>
    
  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <filter class="ch.qos.logback.core.filter.EvaluatorFilter">      
      <evaluator class="ch.qos.logback.classic.boolex.GEventEvaluator"> 
        <expression>
           e.level.toInt() >= WARN.toInt() &amp;&amp;  <!-- Stands for && in XML -->
           !(e.mdc?.get("req.userAgent") =~ /Googlebot|msnbot|Yahoo/ )
        </expression>
      </evaluator>
      <OnMismatch>DENY</OnMismatch>
      <OnMatch>NEUTRAL</OnMatch>
    </filter>
    <encoder>
      <pattern>
        %-4relative [%thread] %-5level %logger - %msg%n
      </pattern>
    </encoder>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="STDOUT" />
  </root>
</configuration>
```

The above filter will let events of level WARN and higher go through onto the console unless the error is generated by Web crawlers associated with Google, MSN or Yahoo. It does so by checking whether the MDC associated with the event contains a value for "req.userAgent" matching the `/Googlebot|msnbot|Yahoo/` regular expression. Note that since the MDC map can be null, we are also using Groovy's [safe dereferencing operator](http://groovy.codehaus.org/Null+Object+Pattern), that is the ?. operator. The equivalent logic would have been much longer if expressed in Java.

上面的过滤器会放行 WARN 及以上级别的事件，让它们输出到控制台——除非该错误是由 Google、MSN 或 Yahoo 的网络爬虫产生的。它的做法是检查与事件关联的 MDC 中 "req.userAgent" 的值是否匹配 `/Googlebot|msnbot|Yahoo/` 正则表达式。注意，由于 MDC map 可能为 null，我们还用到了 Groovy 的[安全解引用运算符](http://groovy.codehaus.org/Null+Object+Pattern)，即 ?. 运算符。如果用 Java 来写等价的逻辑，代码会长得多。

If you are wondering how the identifier for the user agent was inserted into the MDC under the 'req.userAgent' key, it behooves us to mention that logback ships with a servlet filter named [`MDCInsertingServletFilter`](http://logback.qos.ch/manual/mdc.html#mis) designed for this purpose. It will be described in a later chapter.

如果你好奇 user agent 的标识是如何以 'req.userAgent' 为键插入 MDC 的，这里需要提一下，logback 自带了一个名为 [`MDCInsertingServletFilter`](http://logback.qos.ch/manual/mdc.html#mis) 的 servlet 过滤器，正是为此设计的。我们会在后面的章节中介绍它。

### JaninoEventEvaluator

Logback-classic ships with another concrete `EventEvaluator` implementation called [JaninoEventEvaluator](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/JaninoEventEvaluator.html) taking an arbitrary Java language block returning a boolean value as the evaluation criteria. We refer to such Java language boolean expressions as "*evaluation expressions*". Evaluation expressions enable great flexibility in event filtering. `JaninoEventEvaluator` requires the [Janino library](http://docs.codehaus.org/display/JANINO/Home). Please see the [corresponding section](http://logback.qos.ch/setup.html#janino) of the setup document. Compared to `JaninoEventEvaluator`, `GEventEvaluator`, by virtue of the Groovy language, is significantly more convenient to use, but `JaninoEventEvaluator` will usually run (much) faster for equivalent expressions.

Logback-classic 还自带另一个具体的 `EventEvaluator` 实现，叫做 [JaninoEventEvaluator](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/JaninoEventEvaluator.html)，它以返回布尔值的任意 Java 语言代码块作为求值条件。我们把这类 Java 布尔表达式称为 "*求值表达式*(evaluation expression)"。求值表达式给事件过滤带来了极大的灵活性。`JaninoEventEvaluator` 需要 [Janino 库](http://docs.codehaus.org/display/JANINO/Home)，请参阅 setup 文档的[相应小节](http://logback.qos.ch/setup.html#janino)。与 `JaninoEventEvaluator` 相比，`GEventEvaluator` 凭借 Groovy 语言用起来明显更方便，但对于等价的表达式，`JaninoEventEvaluator` 通常（要）快得多。

Evaluation expressions are compiled on-the-fly during the interpretation of the configuration file. As a user, you do not need to worry about the actual plumbing. However, it is your responsibility to ensure that the Java language expression returns a boolean, i.e. that it evaluates to true or false.

求值表达式在解析配置文件时即时编译。作为用户，你无需关心其中的具体机制，但你有责任确保 Java 语言表达式返回布尔值，即求值结果为 true 或 false。

The evaluation expression is evaluated on the current logging event. Logback-classic automatically exports various fields of the logging event as variables accessible from the evaluation expression. The case-sensitive names of these exported variables are listed below.

求值表达式在当前日志事件上求值。Logback-classic 会自动把日志事件的各个字段导出为变量，供求值表达式访问。这些导出变量的名称（区分大小写）如下所列。

| Name             | Type                                                         | Description                                                  |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| event            | `LoggingEvent`                                               | The raw logging event associated with the logging request. All of the following variables are also available from the event. For example, `event.getMessage()` returns the same String value as the *message* variable described next. |
| message          | `String`                                                     | The raw message of the logging request. For some logger *l*, when you write l.info("Hello {}", name); where name is assigned the value "Alice", then "Hello {}" is the message. |
| formattedMessage | `String`                                                     | The formatted message in the logging request. For some logger *l*, when you write l.info("Hello {}", name); where name is assigned the value "Alice", then "Hello Alice" is the formatted message. |
| logger           | `String`                                                     | The name of the logger.                                      |
| loggerContext    | [`LoggerContextVO`](http://logback.qos.ch/xref/ch/qos/logback/classic/spi/LoggerContextVO.html) | A restricted (value object) view of the logger context to which the logging event belongs to. |
| level            | `int`                                                        | The int value corresponding to the level. To help create easily expressions involving levels, the default value *DEBUG*, *INFO*, *WARN* and *ERROR* are also available. Thus, using *level > INFO* is a correct expression. |
| timeStamp        | `long`                                                       | The timestamp corresponding to the logging event's creation. |
| marker           | `Marker`                                                     | The `Marker` object associated with the logging request. Note that marker can be null and it is your responsibility to check for this condition in order to avoid `NullPointerException`. |
| mdc              | `Map`                                                        | A map containing all the MDC values at the time of the creation of the logging event. A value can be accessed by using the following expression: *mdc.get("myKey")*. As of logback-classic version 0.9.30, the 'mdc' variable will never be null.The `java.util.Map` type is non-parameterized because Janino does not support generics. It follows that the type returned by `mdc.get()` is `Object` and not `String`. To invoke `String` methods on the returned value, it must be cast as `String`. For example, `((String) mdc.get("k")).contains("val")`. |
| throwable        | java.lang.Throwable                                          | If no exception is associated with the event, then the value of the "throwable" variable will be null. Unfortunately, "throwable" does not survive serialization. Thus, on remote systems, its value will always be null. For location independent expressions, use the `throwableProxy` variable described next. |
| throwableProxy   | [`IThrowableProxy`](http://logback.qos.ch/xref/ch/qos/logback/classic/spi/IThrowableProxy.html) | A proxy for the exception associated with the logging event. If no exception is associated with the event, then the value of the "throwableProxy" variable will be null. In contrast to "throwable", when an exception is associated with an event, the value of "throwableProxy" will be non-null even on remote systems, that is even after serialization. |

中文对照：

| 变量名 | 类型 | 说明 |
| --- | --- | --- |
| event | `LoggingEvent` | 与日志请求关联的原始日志事件。下面列出的所有变量也都可以从 event 中获取，例如 `event.getMessage()` 返回的 String 值与接下来介绍的 *message* 变量相同。 |
| message | `String` | 日志请求的原始消息。对于某个 logger *l*，当你写 l.info("Hello {}", name); 且 name 的值为 "Alice" 时，"Hello {}" 就是 message。 |
| formattedMessage | `String` | 日志请求的格式化消息。同样地，l.info("Hello {}", name); 中 name 为 "Alice" 时，"Hello Alice" 就是 formatted message。 |
| logger | `String` | logger 的名称。 |
| loggerContext | [`LoggerContextVO`](http://logback.qos.ch/xref/ch/qos/logback/classic/spi/LoggerContextVO.html) | 日志事件所属 logger 上下文的受限（值对象）视图。 |
| level | `int` | 与级别对应的 int 值。为了便于编写涉及级别的表达式，*DEBUG*、*INFO*、*WARN* 和 *ERROR* 的默认值也可用。因此，*level > INFO* 是合法的表达式。 |
| timeStamp | `long` | 与日志事件创建时间对应的时间戳。 |
| marker | `Marker` | 与日志请求关联的 `Marker` 对象。注意 marker 可能为 null，你有责任自行检查这一情况，以避免 `NullPointerException`。 |
| mdc | `Map` | 包含创建日志事件时所有 MDC 值的 map。可以通过 *mdc.get("myKey")* 这样的表达式访问其中的值。从 logback-classic 0.9.30 版本开始，'mdc' 变量永远不会为 null。`java.util.Map` 类型没有参数化，因为 Janino 不支持泛型。因此 `mdc.get()` 返回的类型是 `Object` 而不是 `String`，要在返回值上调用 `String` 的方法，必须把它强转成 `String`，例如 `((String) mdc.get("k")).contains("val")`。 |
| throwable | java.lang.Throwable | 如果事件没有关联异常，"throwable" 变量的值为 null。遗憾的是，"throwable" 无法在序列化后保留下来，因此在远程系统上它的值总是 null。对于与位置无关的表达式，请使用下面介绍的 `throwableProxy` 变量。 |
| throwableProxy | [`IThrowableProxy`](http://logback.qos.ch/xref/ch/qos/logback/classic/spi/IThrowableProxy.html) | 与日志事件关联异常的代理。如果事件没有关联异常，"throwableProxy" 变量的值为 null。与 "throwable" 不同的是，当事件关联了异常时，即使在远程系统上（即经过序列化之后），"throwableProxy" 的值也不会是 null。 |

Here is a concrete example.

下面是一个具体的例子。

*Example: Basic event evaluator usage (logback-examples/src/main/resources/chapters/filters/basicEventEvaluator.xml)*

The bold part in the above configuration file adds an `EvaluatorFilter` to a `ConsoleAppender`. An evaluator of type `JaninoEventEvaluator` is then injected into the `EvaluatorFilter`. In the absence of *class* attribute in the `` element specified by the user, Joran will infer a default type of `JaninoEventEvaluator` for the evaluator. This is one of the [few occurrences](http://logback.qos.ch/manual/onJoran.html#defaultClassMapping) where Joran implicitly infers the type of a component.

上面配置文件中加粗的部分给 `ConsoleAppender` 添加了一个 `EvaluatorFilter`，随后向其中注入了一个 `JaninoEventEvaluator` 类型的 evaluator。当用户在 `` 元素中没有指定 *class* 属性时，Joran 会为 evaluator 推断出默认类型 `JaninoEventEvaluator`。这是 Joran 隐式推断组件类型的[少数几种情形](http://logback.qos.ch/manual/onJoran.html#defaultClassMapping)之一。

The *expression* element corresponds to the evaluation expression just discussed. The expression `return message.contains("billing");` returns a boolean value. Notice that the *message* variable is exported automatically by `JaninoEventEvaluator`.

*expression* 元素对应刚才讨论的求值表达式。表达式 `return message.contains("billing");` 返回一个布尔值。注意，*message* 变量是由 `JaninoEventEvaluator` 自动导出的。

Given that the OnMismatch property is set to NEUTRAL and the OnMatch property set to DENY, this evaluator filter will drop all logging events whose message contains the string "billing".

由于 OnMismatch 属性被设置为 NEUTRAL，OnMatch 属性被设置为 DENY，这个 evaluator filter 会丢弃所有消息中包含字符串 "billing" 的日志事件。

The [`FilterEvents`](http://logback.qos.ch/xref/chapters/filters/FilterEvents.html) application issues ten logging requests, numbered 0 to 9. Let us first run `FilterEvents` class without any filters:

[`FilterEvents`](http://logback.qos.ch/xref/chapters/filters/FilterEvents.html) 应用会发出 10 条日志请求，编号从 0 到 9。我们先不加任何过滤器来运行 `FilterEvents` 类：

```
java chapters.filters.FilterEvents src/main/java/chapters/filters/basicConfiguration.xml
```

All requests will be displayed, as shown below:

所有请求都会被显示，如下所示：

```
0    [main] INFO  chapters.filters.FilterEvents - logging statement 0
0    [main] INFO  chapters.filters.FilterEvents - logging statement 1
0    [main] INFO  chapters.filters.FilterEvents - logging statement 2
0    [main] DEBUG chapters.filters.FilterEvents - logging statement 3
0    [main] INFO  chapters.filters.FilterEvents - logging statement 4
0    [main] INFO  chapters.filters.FilterEvents - logging statement 5
0    [main] ERROR chapters.filters.FilterEvents - billing statement 6
0    [main] INFO  chapters.filters.FilterEvents - logging statement 7
0    [main] INFO  chapters.filters.FilterEvents - logging statement 8
0    [main] INFO  chapters.filters.FilterEvents - logging statement 9
```

Suppose that we want to get rid of the "billing statement". The *basicEventEvaluator.xml* configuration file listed above filters messages containing the string "billing" which is precisely the desired outcome.

假设我们想去掉 "billing statement"。上面列出的 *basicEventEvaluator.xml* 配置文件会过滤掉包含字符串 "billing" 的消息，这正是我们想要的结果。

Running with *basicEventEvaluator.xml*:

用 *basicEventEvaluator.xml* 运行：

java chapters.filters.FilterEvents src/main/java/chapters/filters/basicEventEvaluator.xml

we obtain:

会得到：

0    [main] INFO  chapters.filters.FilterEvents - logging statement 0 0    [main] INFO  chapters.filters.FilterEvents - logging statement 1 0    [main] INFO  chapters.filters.FilterEvents - logging statement 2 0    [main] DEBUG chapters.filters.FilterEvents - logging statement 3 0    [main] INFO  chapters.filters.FilterEvents - logging statement 4 0    [main] INFO  chapters.filters.FilterEvents - logging statement 5 0    [main] INFO  chapters.filters.FilterEvents - logging statement 7 0    [main] INFO  chapters.filters.FilterEvents - logging statement 8 0    [main] INFO  chapters.filters.FilterEvents - logging statement 9

Evaluation expressions can be Java blocks. For example, the following is a valid expression.

求值表达式可以是 Java 代码块。例如，下面就是一个合法的表达式。

```
<evaluator>
  <expression>
    if(logger.startsWith("org.apache.http"))
      return true;

    if(mdc == null || mdc.get("entity") == null)
      return false;

    String payee = (String) mdc.get("entity");

    if(logger.equals("org.apache.http.wire") &amp;&amp; <!-- & encoded as &amp; -->
        payee.contains("someSpecialValue") &amp;&amp;
        !message.contains("someSecret")) {
      return true;
    }

    return false;
  </expression>
</evaluator>
```

## Matchers

## Matcher(匹配器)

While it is possible to do pattern matching by invoking the [matches()](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/String.html#matches(java.lang.String)) method in the `String` class, this incurs the cost of compiling of a brand new `Pattern` object each time the filter is invoked. To eliminate this overhead, you can predefine one or more [Matcher](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/Matcher.html) objects. Once a matcher is defined, it can be repeatedly referenced by name in the evaluator expression.

虽然可以通过调用 `String` 类的 [matches()](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/String.html#matches(java.lang.String)) 方法来做模式匹配，但每次调用过滤器都要重新编译一个全新的 `Pattern` 对象，开销不小。为了消除这一开销，你可以预先定义一个或多个 [Matcher](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/Matcher.html) 对象。matcher 一旦定义，就可以在求值表达式中按名称反复引用。

An example should clarify the point:

一个例子就能把这一点说清楚：

*Example: Defining matchers in an event evaluator (logback-examples/src/main/resources/chapters/filters/evaluatorWithMatcher.xml)*

Running with *evaluatorWithMatcher.xml*:

用 *evaluatorWithMatcher.xml* 运行：

java chapters.filters.FilterEvents src/main/java/chapters/filters/evaluatorWithMatcher.xml

we obtain:

会得到：

260  [main] INFO  chapters.filters.FilterEvents - logging statement 0 264  [main] INFO  chapters.filters.FilterEvents - logging statement 2 264  [main] INFO  chapters.filters.FilterEvents - logging statement 4 266  [main] ERROR chapters.filters.FilterEvents - billing statement 6 266  [main] INFO  chapters.filters.FilterEvents - logging statement 8

If you need to define additional matchers, you can do so by adding further `` elements.

如果需要定义更多的 matcher，只需添加更多的 `` 元素即可。

## TurboFilters

## TurboFilter

`TurboFilter` objects all extend the [`TurboFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/turbo/TurboFilter.html) abstract class. Like the regular filters, they use ternary logic to return their evaluation of the logging event.

`TurboFilter` 对象都继承自 [`TurboFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/turbo/TurboFilter.html) 抽象类。与普通过滤器一样，它们也用三值逻辑返回对日志事件的判定结果。

Overall, they work much like the previously mentioned filters. However, there are two main differences between `Filter` and `TurboFilter` objects.

总体上，它们的工作方式与前面提到的过滤器很相似。不过，`Filter` 与 `TurboFilter` 对象之间有两个主要区别。

`TurboFilter` objects are tied to the logging context. Hence, they are called not only when a given appender is used, but each and every time a logging request is issued. Their scope is wider than appender-attached filters.

`TurboFilter` 对象与日志上下文(logging context)绑定。因此，不仅在某个 appender 被使用时会调用它们，每次发出日志请求时都会调用。它们的作用范围比挂在 appender 上的过滤器更宽。

More importantly, they are called before the `LoggingEvent` object creation. `TurboFilter` objects do not require the instantiation of a logging event to filter a logging request. As such, turbo filters are intended for high performance filtering of logging events, even before the events are created.

更重要的是，它们在 `LoggingEvent` 对象创建之前就会被调用。`TurboFilter` 对象无需实例化日志事件就可以过滤日志请求。因此，turbo filter 的定位是在事件尚未创建时就对日志事件进行高性能过滤。

### Implementing your own TurboFilter

### 实现自己的 TurboFilter

To create your own `TurboFilter` component, just extend the `TurboFilter` abstract class. As previously, when implementing a customized filter object, developing a custom `TurboFilter` only asks that one implement the `decide()` method. In the next example, we create a slightly more complex filter:

要创建自己的 `TurboFilter` 组件，只需继承 `TurboFilter` 抽象类。与前面一样，开发自定义 `TurboFilter` 也只要求实现 `decide()` 方法。在下一个示例中，我们创建一个稍微复杂一点的过滤器：

*Example: Basic custom `TurboFilter` ([logback-examples/src/main/java/chapters/filters/SampleTurboFilter.java](http://logback.qos.ch/xref/chapters/filters/SampleTurboFilter.html))*

The `TurboFilter` above accepts events that contain a specific marker. If said marker is not found, then the filter passes the responsibility to the next filter in the chain.

上面的 `TurboFilter` 接受包含特定 marker 的事件。如果找不到该 marker，过滤器就把责任交给链中的下一个过滤器。

To allow more flexibility, the marker that will be tested can be specified in the configuration file, hence the getter and setter methods. We also implemented the `start()` method, to check that the option has been specified during the configuration process.

为了更灵活，待测试的 marker 可以在配置文件中指定，这就是要有 getter 和 setter 方法的原因。我们还实现了 `start()` 方法，用于检查配置过程中是否已经指定了这个选项。

Here is a sample configuration that makes use of our newly created `TurboFilter`.

下面是一个使用我们新建 `TurboFilter` 的配置示例。

*Example: Basic custom `TurboFilter` configuration (logback-examples/src/main/resources/chapters/filters/sampleTurboFilterConfig.xml)*

Logback classic ships with several `TurboFilter` classes ready for use. The [`MDCFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/turbo/MDCFilter.html) checks the presence of a given value in the MDC whereas [`DynamicThresholdFilter`](http://logback.qos.ch/apidocs/ch/qos/logback/classic/turbo/DynamicThresholdFilter.html) allows filtering based on MDC key/level threshold associations. On the other hand, [`MarkerFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/turbo/MarkerFilter.html) checks for the presence of a specific marker associated with the logging request.

Logback classic 自带了几个开箱即用的 `TurboFilter` 类。[MDCFilter](http://logback.qos.ch/xref/ch/qos/logback/classic/turbo/MDCFilter.html) 检查 MDC 中是否存在给定的值；[`DynamicThresholdFilter`](http://logback.qos.ch/apidocs/ch/qos/logback/classic/turbo/DynamicThresholdFilter.html) 允许基于 MDC 键与级别阈值的关联进行过滤；而 [`MarkerFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/turbo/MarkerFilter.html) 则检查日志请求是否关联了特定的 marker。

Here is a sample configuration, using both `MDCFilter` and `MarkerFilter`.

下面是一个同时使用 `MDCFilter` 和 `MarkerFilter` 的配置示例。

*Example: `MDCFilter` and `MarkerFilter` configuration (logback-examples/src/main/resources/chapters/filters/turboFilters.xml)*

You can see this configuration in action by issuing the following command:

执行以下命令可以看到这个配置的运行效果：

java chapters.filters.FilterEvents src/main/java/chapters/filters/turboFilters.xml

As we've seen previously, the [`FilterEvents`](http://logback.qos.ch/xref/chapters/filters/FilterEvents.html) application issues 10 logging requests, numbered 0 to 9. Except for requests 3 and 6, all of the requests are of level *INFO*, the same level as the one assigned to the root logger. The 3rd request, is issued at the the *DEBUG* level, which is below the effective level. However, since the MDC key "username" is set to "sebastien" just before the 3rd request and removed just afterwards, the `MDCFilter` specifically accepts the request (and only that request). The 6th request, issued at the *ERROR* level, is marked as "billing". As such, it is denied by the MarkerFilter (the second turbo filter in the configuration).

如前所述，[`FilterEvents`](http://logback.qos.ch/xref/chapters/filters/FilterEvents.html) 应用会发出 10 条日志请求，编号从 0 到 9。除了第 3 条和第 6 条之外，其余请求都是 *INFO* 级别，与 root logger 分配的级别相同。第 3 条请求以 *DEBUG* 级别发出，低于有效级别(effective level)。不过，由于 MDC 键 "username" 恰好在第 3 条请求之前被设置为 "sebastien"、随后又被移除，`MDCFilter` 会专门接受这一条（且仅这一条）请求。第 6 条请求以 *ERROR* 级别发出，并带有 "billing" marker，因此被 MarkerFilter（配置中的第二个 turbo filter）拒绝。

Thus, the output of `FilterEvents` application configured with *turboFilters.xml* file shown above is:

于是，用上面的 *turboFilters.xml* 文件配置的 `FilterEvents` 应用，其输出为：

2006-12-04 15:17:22,859 [main] INFO  chapters.filters.FilterEvents - logging statement 0 2006-12-04 15:17:22,875 [main] INFO  chapters.filters.FilterEvents - logging statement 1 2006-12-04 15:17:22,875 [main] INFO  chapters.filters.FilterEvents - logging statement 2 2006-12-04 15:17:22,875 [main] DEBUG chapters.filters.FilterEvents - logging statement 3 2006-12-04 15:17:22,875 [main] INFO  chapters.filters.FilterEvents - logging statement 4 2006-12-04 15:17:22,875 [main] INFO  chapters.filters.FilterEvents - logging statement 5 2006-12-04 15:17:22,875 [main] INFO  chapters.filters.FilterEvents - logging statement 7 2006-12-04 15:17:22,875 [main] INFO  chapters.filters.FilterEvents - logging statement 8 2006-12-04 15:17:22,875 [main] INFO  chapters.filters.FilterEvents - logging statement 9

One can see that the 3rd request, which should not be displayed if we only followed the overall *INFO* level, appears anyway, because it matched the first `TurboFilter` requirements and was accepted.

可以看到，如果只按总的 *INFO* 级别来算，第 3 条请求本不该显示，但它还是出现了，因为它满足了第一个 `TurboFilter` 的条件而被接受。

On the other hand, the 6th request, that is an *ERROR* level request should have been displayed. But it satisfied the second `TurboFilter` whose OnMatch option is set to *DENY*. Thus, the 6th request was not displayed.

另一方面，第 6 条请求是 *ERROR* 级别，本应显示，但它命中了第二个 `TurboFilter`（其 OnMatch 选项被设置为 *DENY*），所以没有显示。

### DuplicateMessageFilter

### DuplicateMessageFilter

The `DuplicateMessageFilter` merits a separate presentation. This filter detects duplicate messages, and beyond a certain number of repetitions, drops repeated messages.

`DuplicateMessageFilter` 值得单独介绍一下。这个过滤器检测重复的消息，超过一定的重复次数后，就丢弃重复的消息。

To detect repetition, this filter uses simple String equality between messages. It does not detect messages which are very similar, varying only by few characters. For example, if you write:

为了检测重复，这个过滤器只对消息做简单的字符串相等比较，不会检测那些只差几个字符的高度相似的消息。例如，如果你写：

```
logger.debug("Hello "+name0);
logger.debug("Hello "+name1);
```

Assuming `name0` and `name1` have different values, the two "Hello" messages will be considered as unrelated. Depending on user demand, future releases may check for string similarity, eliminating repetitions of similar but not identical messages.

假设 `name0` 和 `name1` 的值不同，那么这两条 "Hello" 消息会被认为互不相关。根据用户的需求，未来的版本可能会加入字符串相似度检查，消除相似但不完全相同消息的重复。

Note that in case of parameterized logging, only the raw message is taken into consideration. For example, in the next two requests, the raw messages, i.e. "Hello {}.", are identical, and thus considered as repetitions.

注意，对于参数化日志，只有原始消息会被纳入考量。例如，在接下来的两条请求中，原始消息（即 "Hello {}."）是相同的，因此会被视为重复。

```
logger.debug("Hello {}.", name0);
logger.debug("Hello {}.", name1);
```

The number of allowed repetitions can be specified by the AllowedRepetitions property. For example, if the property is set to 1, then the 2nd and subsequent occurrences of the same message will be dropped. Similarly, if the property is set to 2, then the 3rd and subsequent occurrences of the same message will be dropped. By default, the AllowedRepetitions property is set to 5.

允许的重复次数可以通过 AllowedRepetitions 属性指定。例如，该属性设为 1 时，同一消息的第 2 次及后续出现都会被丢弃；设为 2 时，第 3 次及后续出现都会被丢弃。默认情况下，AllowedRepetitions 属性被设置为 5。

In order to detect repetitions, this filter needs to keep references to old messages in an internal cache. The size of this cache is determined by the CacheSize property. By the default, this is set to 100.

为了检测重复，这个过滤器需要在内部缓存中保留旧消息的引用。缓存的大小由 CacheSize 属性决定，默认被设置为 100。

*Example: `DuplicateMessageFilter` configuration (logback-examples/src/main/resources/chapters/filters/duplicateMessage.xml)*

Thus, the output for `FilterEvents` application configured with *duplicateMessage.xml* is:

于是，用 *duplicateMessage.xml* 配置的 `FilterEvents` 应用输出为：

2008-12-19 15:04:26,156 [main] INFO  chapters.filters.FilterEvents - logging statement 0 2008-12-19 15:04:26,156 [main] INFO  chapters.filters.FilterEvents - logging statement 1 2008-12-19 15:04:26,156 [main] INFO  chapters.filters.FilterEvents - logging statement 2 2008-12-19 15:04:26,156 [main] INFO  chapters.filters.FilterEvents - logging statement 4 2008-12-19 15:04:26,156 [main] INFO  chapters.filters.FilterEvents - logging statement 5 2008-12-19 15:04:26,171 [main] ERROR chapters.filters.FilterEvents - billing statement 6

"logging statement 0" is the first *occurrence* of the message "logging statement {}". "logging statement 1" is the first *repetition*, "logging statement 2" is the second repetition. Interestingly enough, "logging statement 3" of level DEBUG, is the *third* repetition, even though it is later dropped by virtue of the [basic selection rule](http://logback.qos.ch/manual/architecture.html#basic_selection). This can be explained by the fact that turbo filters are invoked before other types of filters, including the basic selection rule. Thus, `DuplicateMessageFilter` considers "logging statement 3" as a repetition, oblivious to the fact that it will be dropped further down in the processing chain. "logging statement 4" is the fourth repetition and "logging statement 5" the fifth. Statements 6 and beyond are dropped because only 5 repetitions are allowed by default.

"logging statement 0" 是消息 "logging statement {}" 的第一次*出现*。"logging statement 1" 是第一次*重复*，"logging statement 2" 是第二次重复。有意思的是，DEBUG 级别的 "logging statement 3" 是*第三次*重复，尽管它随后会因[基本选择规则](http://logback.qos.ch/manual/architecture.html#basic_selection)而被丢弃。这是因为 turbo filter 的调用先于其他类型的过滤器，包括基本选择规则在内。因此，`DuplicateMessageFilter` 把 "logging statement 3" 算作一次重复，而不管它在处理链的更下游终将被丢弃。"logging statement 4" 是第四次重复，"logging statement 5" 是第五次。第 6 条及之后的语句都被丢弃，因为默认只允许 5 次重复。

# In logback-access

# 在 logback-access 中

Logback-access offers most of the features available with logback-classic. In particular, `Filter` objects are available and work in the same way as their logback-classic counterparts, with one notable difference. Instead of `LoggingEvent` instances logback-access filters act upon [`AccessEvent`](http://logback.qos.ch/xref/ch/qos/logback/access/spi/AccessEvent.html) instances. At present time, logback-access ships with a limited number of filters described below. If you would like to suggest additional filters, please contact the logback-dev mailing list.

Logback-access 提供了 logback-classic 的大部分功能。特别是，`Filter` 对象同样可用，且与 logback-classic 中的对应组件工作方式相同，只有一个显著区别：logback-access 的过滤器作用于 [`AccessEvent`](http://logback.qos.ch/xref/ch/qos/logback/access/spi/AccessEvent.html) 实例，而不是 `LoggingEvent` 实例。目前 logback-access 自带的过滤器数量有限，如下所述。如果你想建议增加新的过滤器，请联系 logback-dev 邮件列表。

## `CountingFilter`

With the help of [`CountingFilter`](http://logback.qos.ch/manual/xref/ch/qos/logback/access/filter/CountingFilter.html) class, logback-access can provide statistical data about access to the web-server. Upon initialization, `CountingFilter` registers itself as an MBean onto the platform's JMX server. You can then interrogate that MBean for statistical data, e.g. averages by minute, hour, day, week, or month. Other statistics such the count for the preceding week, day, hour or month as well as the total count are also available.

借助 [`CountingFilter`](http://logback.qos.ch/manual/xref/ch/qos/logback/access/filter/CountingFilter.html) 类，logback-access 可以提供关于 web 服务器访问情况的统计数据。初始化时，`CountingFilter` 会把自己注册为平台 JMX 服务器上的一个 MBean。随后你就可以向该 MBean 查询统计数据，比如按分钟、小时、天、周或月的平均值。还有其他统计数据可用，例如前一周、前一天、前一小时或前一月的计数以及总计数。

The following *logback-access.xml* configuration file declares a `CountingFilter`.

下面的 *logback-access.xml* 配置文件声明了一个 `CountingFilter`。

```
<configuration>
  <statusListener class="ch.qos.logback.core.status.OnConsoleStatusListener" />

  <filter class="ch.qos.logback.access.filter.CountingFilter">
    <name>countingFilter</name>
  </filter>

  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>%h %l %u %t \"%r\" %s %b</pattern>
    </encoder>
  </appender>

  <appender-ref ref="STDOUT" />
</configuration>
```

You can examine the various statistics maintained by `CountingFilter` on your platform's JMX server via the `jconsole` application.

你可以通过 `jconsole` 应用，在平台的 JMX 服务器上查看 `CountingFilter` 维护的各项统计数据。

![CountingFilter via jconsole](http://logback.qos.ch/manual/images/chapters/filters/countingFilter.png)

### EvaluatorFilter

[`EvaluatorFilter`](http://logback.qos.ch/xref/ch/qos/logback/core/filter/EvaluatorFilter.html) is a generic filter encapsulating an `EventEvaluator`. As the name suggests, an [`EventEvaluator`](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/EventEvaluator.html) evaluates whether a given criteria is met for a given event. On match and on mismatch, the hosting `EvaluatorFilter` will return the value specified by the onMatch or onMismatch properties respectively. Note that `EvaluatorFilter` has been previously discussed in the context of logback-classic ([see above](http://logback.qos.ch/manual/filters.html#evalutatorFilter)). The present text is mostly a repetition of the previous discussion.

[`EvaluatorFilter`](http://logback.qos.ch/xref/ch/qos/logback/core/filter/EvaluatorFilter.html) 是一个封装了 `EventEvaluator` 的通用过滤器。顾名思义，[`EventEvaluator`](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/EventEvaluator.html) 会对给定事件求值，判断是否满足给定的条件。在匹配与不匹配时，承载它的 `EvaluatorFilter` 会分别返回 onMatch 或 onMismatch 属性指定的值。注意，`EvaluatorFilter` 前面在 logback-classic 的语境中已经讨论过（[见上文](http://logback.qos.ch/manual/filters.html#evalutatorFilter)），此处的内容基本上是前文讨论的重复。

Note that `EventEvaluator` is an abstract class. You can implement your own event evaluation logic by sub-classing `EventEvaluator`. Logback-access ships with a concrete implementation named [JaninoEventEvaluator](http://logback.qos.ch/xref/ch/qos/logback/access/boolex/JaninoEventEvaluator.html). It takes arbitrary Java language boolean expressions as the evaluation criteria. We refer to such Java language blocks as "*evaluation expressions*". Evaluation expressions enable great flexibility in event filtering. `JaninoEventEvaluator` requires the [Janino library](http://docs.codehaus.org/display/JANINO/Home). Please see the [corresponding section](http://logback.qos.ch/setup.html#janino) of the setup document.

注意，`EventEvaluator` 是抽象类。你可以通过继承 `EventEvaluator` 来实现自己的事件求值逻辑。Logback-access 自带一个名为 [JaninoEventEvaluator](http://logback.qos.ch/xref/ch/qos/logback/access/boolex/JaninoEventEvaluator.html) 的具体实现，它以任意 Java 语言的布尔表达式作为求值条件。我们把这类 Java 代码块称为 "*求值表达式*"。求值表达式给事件过滤带来了极大的灵活性。`JaninoEventEvaluator` 需要 [Janino 库](http://docs.codehaus.org/display/JANINO/Home)，请参阅 setup 文档的[相应小节](http://logback.qos.ch/setup.html#janino)。

Evaluation expressions are compiled on-the-fly during the interpretation of the configuration file. As a user, you do not need to worry about the actual plumbing. However, it is your responsibility to ensure that the Java language expression returns a boolean, i.e. that it evaluates to true or false.

求值表达式在解析配置文件时即时编译。作为用户，你无需关心其中的具体机制，但你有责任确保 Java 语言表达式返回布尔值，即求值结果为 true 或 false。

The evaluation expression is evaluated on the current access event. Logback-access automatically exports the current `AccessEvent` instance under the variable name **`event`**. You can read the various data associated with the HTTP request as well as the HTTP response via the `event` variable. Please refer to the [`AccessEvent` class source code](http://logback.qos.ch/xref/ch/qos/logback/access/spi/AccessEvent.html) for the exact list.

求值表达式在当前访问事件上求值。Logback-access 会自动把当前的 `AccessEvent` 实例以 **`event`** 变量名导出。你可以通过 `event` 变量读取与 HTTP 请求和 HTTP 响应关联的各种数据。确切的清单请参阅 [`AccessEvent` 类的源代码](http://logback.qos.ch/xref/ch/qos/logback/access/spi/AccessEvent.html)。

The next logback-access configuration file illustrates filtering based on the [404 (Not Found)](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.5) HTTP response code. Every request resulting in a 404 will be printed on the console.

接下来的 logback-access 配置文件演示了基于 HTTP 响应码 [404 (Not Found)](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.5) 的过滤。每个导致 404 的请求都会被打印到控制台。

*Example: Access Evaluator (logback-examples/src/main/resources/chapters/filters/accessEventEvaluator.xml)*

In the next example, we still log requests resulting in 404 errors, except those requests asking for CSS files.

在下一个示例中，我们仍然记录导致 404 错误的请求，但会排除那些请求 CSS 文件的请求。

*Example 6.10: Access Evaluator (logback-examples/src/main/resources/chapters/filters/accessEventEvaluator2.xml)*



```
<configuration>
  <statusListener class="ch.qos.logback.core.status.OnConsoleStatusListener" />
  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <filter class="ch.qos.logback.core.filter.EvaluatorFilter">
      <evaluator name="Eval404">
        <expression>
         (event.getStatusCode() == 404)
           &amp;&amp;  <!-- ampersand characters need to be escaped -->
         !(event.getRequestURI().contains(".css"))
        </expression>
      </evaluator>
      <onMismatch>DENY</onMismatch>
    </filter>

   <encoder><pattern>%h %l %u %t %r %s %b</pattern></encoder>
  </appender>

  <appender-ref ref="STDOUT" />
</configuration>
```



<http://logback.qos.ch/manual/filters.html>