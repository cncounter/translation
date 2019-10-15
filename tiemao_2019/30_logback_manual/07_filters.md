# Chapter 7: Filters

*Have lots of ideas and throw away the bad ones. You aren't going to have good ideas unless you have lots of ideas and some sort of principle of selection.*

—LINUS PAULING

In the preceding chapters, the [basic selection rule](http://logback.qos.ch/manual/architecture.html#basic_selection), which lies at the heart of logback-classic, has been presented. In this chapter, additional filtering methods will be introduced.

Logback filters are based on ternary logic allowing them to be assembled or chained together to compose an arbitrarily complex filtering policy. They are largely inspired by Linux's iptables.

In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](http://logback.qos.ch/setup.html) for further details.

## In logback-classic

Logback-classic offers two types of filters, regular filters and turbo filters.

### Regular filters

Regular logback-classic filters extend the [`Filter`](http://logback.qos.ch/xref/ch/qos/logback/core/filter/Filter.html) abstract class which essentially consists of a single `decide()` method taking an `ILoggingEvent` instance as its parameter.

Filters are organized as an ordered list and are based on ternary logic. The `decide(ILoggingEvent event)` method of each filter is called in sequence. This method returns one of the [`FilterReply`](http://logback.qos.ch/xref/ch/qos/logback/core/spi/FilterReply.html) enumeration values, i.e. one of `DENY`, `NEUTRAL` or `ACCEPT`. If the value returned by `decide`() is `DENY`, then the log event is dropped immediately without consulting the remaining filters. If the value returned is `NEUTRAL`, then the next filter in the list is consulted. If there are no further filters to consult, then the logging event is processed normally. If the returned value is `ACCEPT`, then the logging event is processed immediately skipping the invocation of the remaining filters.

In logback-classic, filters can be added to `Appender` instances. By adding one or more filters to an appender, you can filter events by arbitrary criteria, such as the contents of the log message, the contents of the MDC, the time of day or any other part of the logging event.

### Implementing your own Filter

Creating your own filter is easy. All you have to do is extend the `Filter` abstract class and implement the `decide()` method.

The SampleFilter class shown below provides an example. Its `decide` method returns ACCEPT for logging events containing the string "sample" in its message field. For other events, the value NEUTRAL is returned.

*Example: Basic custom filter ([logback-examples/src/main/java/chapters/filters/SampleFilter.java](http://logback.qos.ch/xref/chapters/filters/SampleFilter.html))*

The configuration files shown next attaches a `SampleFilter` to a `ConsoleAppender`.

*Example: SampleFilter configuration (logback-examples/src/main/resources/chapters/filters/SampleFilterConfig.xml)*

With the help of Joran, logback's configuration framework, specifying properties or sub-components to filters is also easy. After adding the corresponding setter method in the filter class, specify the value of the property in an xml element named after the property, nesting it within a `` element.

Often, the desired filter logic consists of two orthogonal parts, a match/mismatch test and a response depending on the match/mismatch. For example, for a given test, e.g. message equals "foobar", one filter might respond ACCEPT on match and NEUTRAL on mismatch, and another filter might respond NEUTRAL on match and DENY on mismatch.

Taking notice of this orthogonality, logback ships with the [`AbstractMatcherFilter`](http://logback.qos.ch/xref/ch/qos/logback/core/filter/AbstractMatcherFilter.html) class which provides a useful skeleton for specifying the appropriate response on match and on mismatch, with the help of two properties, named *OnMatch* and *OnMismatch*. Most of the regular filters included in logback are derived from `AbstractMatcherFilter`.

### LevelFilter

[`LevelFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/filter/LevelFilter.html) filters events based on exact level matching. If the event's level is equal to the configured level, the filter accepts or denies the event, depending on the configuration of the onMatch and onMismatch properties. Here is a sample configuration file.

*Example: Sample LevelFilter configuration (logback-examples/src/main/resources/chapters/filters/levelFilterConfig.xml)*

### ThresholdFilter

The [`ThresholdFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/filter/ThresholdFilter.html) filters events below the specified threshold. For events of level equal or above the threshold, `ThresholdFilter` will respond NEUTRAL when its `decide`() method is invoked. However, events with a level below the threshold will be denied. Here is a sample configuration file.

*Example: Sample ThresholdFilter configuration (logback-examples/src/main/resources/chapters/filters/thresholdFilterConfig.xml)*

## EvaluatorFilter

[`EvaluatorFilter`](http://logback.qos.ch/xref/ch/qos/logback/core/filter/EvaluatorFilter.html) is a generic filter encapsulating an `EventEvaluator`. As the name suggests, an [`EventEvaluator`](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/EventEvaluator.html) evaluates whether a given criteria is met for a given event. On match and on mismatch, the hosting `EvaluatorFilter` will return the value specified by the onMatch or onMismatch properties respectively.

Note that `EventEvaluator` is an abstract class. You can implement your own event evaluation logic by sub-classing `EventEvaluator`.

### GEventEvaluator

[GEventEvaluator](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/GEventEvaluator.html) is a concrete [`EventEvaluator`](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/EventEvaluator.html) implementation taking arbitrary Groovy language boolean expressions as the evaluation criteria. We refer such Groovy language boolean expressions as "groovy evaluation expressions". Groovy evaluation expressions enable hitherto unprecedented flexibility in event filtering. `GEventEvaluator` requires the Groovy runtime. Please see the [corresponding section](http://logback.qos.ch/setup.html#groovy) of the setup document on adding the Groovy runtime to your class path.

Evaluation expressions are compiled on-the-fly during the interpretation of the configuration file. As a user, you do not need to worry about the actual plumbing. However, it is your responsibility to ensure that the groovy-language expression is valid.

The evaluation expression acts on the current logging event. Logback automatically inserts the current logging event of type [ILoggingEvent](http://logback.qos.ch/apidocs/ch/qos/logback/classic/spi/ILoggingEvent.html) as a variable referred to as '*event*' as well as its shorthand referred to as '*e*'. The variables TRACE, DEBUG, INFO, WARN and ERROR are also exported into the scope of the expression. Thus, "event.level == DEBUG" and "e.level == DEBUG" are equivalent and valid groovy expressions which will return `true` only if the current logging event's level is identical to DEBUG. For other comparison operators on levels, the level field should be converted to integer with the `toInt()` operator.

Here is a more complete example.

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

If you are wondering how the identifier for the user agent was inserted into the MDC under the 'req.userAgent' key, it behooves us to mention that logback ships with a servlet filter named [`MDCInsertingServletFilter`](http://logback.qos.ch/manual/mdc.html#mis) designed for this purpose. It will be described in a later chapter.

### JaninoEventEvaluator

Logback-classic ships with another concrete `EventEvaluator` implementation called [JaninoEventEvaluator](http://logback.qos.ch/xref/ch/qos/logback/classic/boolex/JaninoEventEvaluator.html) taking an arbitrary Java language block returning a boolean value as the evaluation criteria. We refer to such Java language boolean expressions as "*evaluation expressions*". Evaluation expressions enable great flexibility in event filtering. `JaninoEventEvaluator` requires the [Janino library](http://docs.codehaus.org/display/JANINO/Home). Please see the [corresponding section](http://logback.qos.ch/setup.html#janino) of the setup document. Compared to `JaninoEventEvaluator`, `GEventEvaluator`, by virtue of the Groovy language, is significantly more convenient to use, but `JaninoEventEvaluator` will usually run (much) faster for equivalent expressions.

Evaluation expressions are compiled on-the-fly during the interpretation of the configuration file. As a user, you do not need to worry about the actual plumbing. However, it is your responsibility to ensure that the Java language expression returns a boolean, i.e. that it evaluates to true or false.

The evaluation expression is evaluated on the current logging event. Logback-classic automatically exports various fields of the logging event as variables accessible from the evaluation expression. The case-sensitive names of these exported variables are listed below.

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

Here is a concrete example.

*Example: Basic event evaluator usage (logback-examples/src/main/resources/chapters/filters/basicEventEvaluator.xml)*

The bold part in the above configuration file adds an `EvaluatorFilter` to a `ConsoleAppender`. An evaluator of type `JaninoEventEvaluator` is then injected into the `EvaluatorFilter`. In the absence of *class* attribute in the `` element specified by the user, Joran will infer a default type of `JaninoEventEvaluator` for the evaluator. This is one of the [few occurrences](http://logback.qos.ch/manual/onJoran.html#defaultClassMapping) where Joran implicitly infers the type of a component.

The *expression* element corresponds to the evaluation expression just discussed. The expression `return message.contains("billing");` returns a boolean value. Notice that the *message* variable is exported automatically by `JaninoEventEvaluator`.

Given that the OnMismatch property is set to NEUTRAL and the OnMatch property set to DENY, this evaluator filter will drop all logging events whose message contains the string "billing".

The [`FilterEvents`](http://logback.qos.ch/xref/chapters/filters/FilterEvents.html) application issues ten logging requests, numbered 0 to 9. Let us first run `FilterEvents` class without any filters:

```
java chapters.filters.FilterEvents src/main/java/chapters/filters/basicConfiguration.xml
```

All requests will be displayed, as shown below:

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

Running with *basicEventEvaluator.xml*:

java chapters.filters.FilterEvents src/main/java/chapters/filters/basicEventEvaluator.xml

we obtain:

0    [main] INFO  chapters.filters.FilterEvents - logging statement 0 0    [main] INFO  chapters.filters.FilterEvents - logging statement 1 0    [main] INFO  chapters.filters.FilterEvents - logging statement 2 0    [main] DEBUG chapters.filters.FilterEvents - logging statement 3 0    [main] INFO  chapters.filters.FilterEvents - logging statement 4 0    [main] INFO  chapters.filters.FilterEvents - logging statement 5 0    [main] INFO  chapters.filters.FilterEvents - logging statement 7 0    [main] INFO  chapters.filters.FilterEvents - logging statement 8 0    [main] INFO  chapters.filters.FilterEvents - logging statement 9

Evaluation expressions can be Java blocks. For example, the following is a valid expression.

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

While it is possible to do pattern matching by invoking the [matches()](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/String.html#matches(java.lang.String)) method in the `String` class, this incurs the cost of compiling of a brand new `Pattern` object each time the filter is invoked. To eliminate this overhead, you can predefine one or more [Matcher](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/Matcher.html) objects. Once a matcher is defined, it can be repeatedly referenced by name in the evaluator expression.

An example should clarify the point:

*Example: Defining matchers in an event evaluator (logback-examples/src/main/resources/chapters/filters/evaluatorWithMatcher.xml)*

Running with *evaluatorWithMatcher.xml*:

java chapters.filters.FilterEvents src/main/java/chapters/filters/evaluatorWithMatcher.xml

we obtain:

260  [main] INFO  chapters.filters.FilterEvents - logging statement 0 264  [main] INFO  chapters.filters.FilterEvents - logging statement 2 264  [main] INFO  chapters.filters.FilterEvents - logging statement 4 266  [main] ERROR chapters.filters.FilterEvents - billing statement 6 266  [main] INFO  chapters.filters.FilterEvents - logging statement 8

If you need to define additional matchers, you can do so by adding further `` elements.

## TurboFilters

`TurboFilter` objects all extend the [`TurboFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/turbo/TurboFilter.html) abstract class. Like the regular filters, they use ternary logic to return their evaluation of the logging event.

Overall, they work much like the previously mentioned filters. However, there are two main differences between `Filter` and `TurboFilter` objects.

`TurboFilter` objects are tied to the logging context. Hence, they are called not only when a given appender is used, but each and every time a logging request is issued. Their scope is wider than appender-attached filters.

More importantly, they are called before the `LoggingEvent` object creation. `TurboFilter` objects do not require the instantiation of a logging event to filter a logging request. As such, turbo filters are intended for high performance filtering of logging events, even before the events are created.

### Implementing your own TurboFilter

To create your own `TurboFilter` component, just extend the `TurboFilter` abstract class. As previously, when implementing a customized filter object, developing a custom `TurboFilter` only asks that one implement the `decide()` method. In the next example, we create a slightly more complex filter:

*Example: Basic custom `TurboFilter` ([logback-examples/src/main/java/chapters/filters/SampleTurboFilter.java](http://logback.qos.ch/xref/chapters/filters/SampleTurboFilter.html))*

The `TurboFilter` above accepts events that contain a specific marker. If said marker is not found, then the filter passes the responsibility to the next filter in the chain.

To allow more flexibility, the marker that will be tested can be specified in the configuration file, hence the getter and setter methods. We also implemented the `start()` method, to check that the option has been specified during the configuration process.

Here is a sample configuration that makes use of our newly created `TurboFilter`.

*Example: Basic custom `TurboFilter` configuration (logback-examples/src/main/resources/chapters/filters/sampleTurboFilterConfig.xml)*

Logback classic ships with several `TurboFilter` classes ready for use. The [`MDCFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/turbo/MDCFilter.html) checks the presence of a given value in the MDC whereas [`DynamicThresholdFilter`](http://logback.qos.ch/apidocs/ch/qos/logback/classic/turbo/DynamicThresholdFilter.html) allows filtering based on MDC key/level threshold associations. On the other hand, [`MarkerFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/turbo/MarkerFilter.html) checks for the presence of a specific marker associated with the logging request.

Here is a sample configuration, using both `MDCFilter` and `MarkerFilter`.

*Example: `MDCFilter` and `MarkerFilter` configuration (logback-examples/src/main/resources/chapters/filters/turboFilters.xml)*

You can see this configuration in action by issuing the following command:

java chapters.filters.FilterEvents src/main/java/chapters/filters/turboFilters.xml

As we've seen previously, the [`FilterEvents`](http://logback.qos.ch/xref/chapters/filters/FilterEvents.html) application issues 10 logging requests, numbered 0 to 9. Except for requests 3 and 6, all of the requests are of level *INFO*, the same level as the one assigned to the root logger. The 3rd request, is issued at the the *DEBUG* level, which is below the effective level. However, since the MDC key "username" is set to "sebastien" just before the 3rd request and removed just afterwards, the `MDCFilter` specifically accepts the request (and only that request). The 6th request, issued at the *ERROR* level, is marked as "billing". As such, it is denied by the MarkerFilter (the second turbo filter in the configuration).

Thus, the output of `FilterEvents` application configured with *turboFilters.xml* file shown above is:

2006-12-04 15:17:22,859 [main] INFO  chapters.filters.FilterEvents - logging statement 0 2006-12-04 15:17:22,875 [main] INFO  chapters.filters.FilterEvents - logging statement 1 2006-12-04 15:17:22,875 [main] INFO  chapters.filters.FilterEvents - logging statement 2 2006-12-04 15:17:22,875 [main] DEBUG chapters.filters.FilterEvents - logging statement 3 2006-12-04 15:17:22,875 [main] INFO  chapters.filters.FilterEvents - logging statement 4 2006-12-04 15:17:22,875 [main] INFO  chapters.filters.FilterEvents - logging statement 5 2006-12-04 15:17:22,875 [main] INFO  chapters.filters.FilterEvents - logging statement 7 2006-12-04 15:17:22,875 [main] INFO  chapters.filters.FilterEvents - logging statement 8 2006-12-04 15:17:22,875 [main] INFO  chapters.filters.FilterEvents - logging statement 9

One can see that the 3rd request, which should not be displayed if we only followed the overall *INFO* level, appears anyway, because it matched the first `TurboFilter` requirements and was accepted.

On the other hand, the 6th request, that is an *ERROR* level request should have been displayed. But it satisfied the second `TurboFilter` whose OnMatch option is set to *DENY*. Thus, the 6th request was not displayed.

### DuplicateMessageFilter

The `DuplicateMessageFilter` merits a separate presentation. This filter detects duplicate messages, and beyond a certain number of repetitions, drops repeated messages.

To detect repetition, this filter uses simple String equality between messages. It does not detect messages which are very similar, varying only by few characters. For example, if you write:

```
logger.debug("Hello "+name0);
logger.debug("Hello "+name1);
```

Assuming `name0` and `name1` have different values, the two "Hello" messages will be considered as unrelated. Depending on user demand, future releases may check for string similarity, eliminating repetitions of similar but not identical messages.

Note that in case of parameterized logging, only the raw message is taken into consideration. For example, in the next two requests, the raw messages, i.e. "Hello {}.", are identical, and thus considered as repetitions.

```
logger.debug("Hello {}.", name0);
logger.debug("Hello {}.", name1);
```

The number of allowed repetitions can be specified by the AllowedRepetitions property. For example, if the property is set to 1, then the 2nd and subsequent occurrences of the same message will be dropped. Similarly, if the property is set to 2, then the 3rd and subsequent occurrences of the same message will be dropped. By default, the AllowedRepetitions property is set to 5.

In order to detect repetitions, this filter needs to keep references to old messages in an internal cache. The size of this cache is determined by the CacheSize property. By the default, this is set to 100.

*Example: `DuplicateMessageFilter` configuration (logback-examples/src/main/resources/chapters/filters/duplicateMessage.xml)*

Thus, the output for `FilterEvents` application configured with *duplicateMessage.xml* is:

2008-12-19 15:04:26,156 [main] INFO  chapters.filters.FilterEvents - logging statement 0 2008-12-19 15:04:26,156 [main] INFO  chapters.filters.FilterEvents - logging statement 1 2008-12-19 15:04:26,156 [main] INFO  chapters.filters.FilterEvents - logging statement 2 2008-12-19 15:04:26,156 [main] INFO  chapters.filters.FilterEvents - logging statement 4 2008-12-19 15:04:26,156 [main] INFO  chapters.filters.FilterEvents - logging statement 5 2008-12-19 15:04:26,171 [main] ERROR chapters.filters.FilterEvents - billing statement 6

"logging statement 0" is the first *occurrence* of the message "logging statement {}". "logging statement 1" is the first *repetition*, "logging statement 2" is the second repetition. Interestingly enough, "logging statement 3" of level DEBUG, is the *third* repetition, even though it is later dropped by virtue of the [basic selection rule](http://logback.qos.ch/manual/architecture.html#basic_selection). This can be explained by the fact that turbo filters are invoked before other types of filters, including the basic selection rule. Thus, `DuplicateMessageFilter` considers "logging statement 3" as a repetition, oblivious to the fact that it will be dropped further down in the processing chain. "logging statement 4" is the fourth repetition and "logging statement 5" the fifth. Statements 6 and beyond are dropped because only 5 repetitions are allowed by default.

# In logback-access

Logback-access offers most of the features available with logback-classic. In particular, `Filter` objects are available and work in the same way as their logback-classic counterparts, with one notable difference. Instead of `LoggingEvent` instances logback-access filters act upon [`AccessEvent`](http://logback.qos.ch/xref/ch/qos/logback/access/spi/AccessEvent.html) instances. At present time, logback-access ships with a limited number of filters described below. If you would like to suggest additional filters, please contact the logback-dev mailing list.

## `CountingFilter`

With the help of [`CountingFilter`](http://logback.qos.ch/manual/xref/ch/qos/logback/access/filter/CountingFilter.html) class, logback-access can provide statistical data about access to the web-server. Upon initialization, `CountingFilter` registers itself as an MBean onto the platform's JMX server. You can then interrogate that MBean for statistical data, e.g. averages by minute, hour, day, week, or month. Other statistics such the count for the preceding week, day, hour or month as well as the total count are also available.

The following *logback-access.xml* configuration file declares a `CountingFilter`.

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

![CountingFilter via jconsole](http://logback.qos.ch/manual/images/chapters/filters/countingFilter.png)

### EvaluatorFilter

[`EvaluatorFilter`](http://logback.qos.ch/xref/ch/qos/logback/core/filter/EvaluatorFilter.html) is a generic filter encapsulating an `EventEvaluator`. As the name suggests, an [`EventEvaluator`](http://logback.qos.ch/xref/ch/qos/logback/core/boolex/EventEvaluator.html) evaluates whether a given criteria is met for a given event. On match and on mismatch, the hosting `EvaluatorFilter` will return the value specified by the onMatch or onMismatch properties respectively. Note that `EvaluatorFilter` has been previously discussed in the context of logback-classic ([see above](http://logback.qos.ch/manual/filters.html#evalutatorFilter)). The present text is mostly a repetition of the previous discussion.

Note that `EventEvaluator` is an abstract class. You can implement your own event evaluation logic by sub-classing `EventEvaluator`. Logback-access ships with a concrete implementation named [JaninoEventEvaluator](http://logback.qos.ch/xref/ch/qos/logback/access/boolex/JaninoEventEvaluator.html). It takes arbitrary Java language boolean expressions as the evaluation criteria. We refer to such Java language blocks as "*evaluation expressions*". Evaluation expressions enable great flexibility in event filtering. `JaninoEventEvaluator` requires the [Janino library](http://docs.codehaus.org/display/JANINO/Home). Please see the [corresponding section](http://logback.qos.ch/setup.html#janino) of the setup document.

Evaluation expressions are compiled on-the-fly during the interpretation of the configuration file. As a user, you do not need to worry about the actual plumbing. However, it is your responsibility to ensure that the Java language expression returns a boolean, i.e. that it evaluates to true or false.

The evaluation expression is evaluated on the current access event. Logback-access automatically exports the current `AccessEvent` instance under the variable name **`event`**. You can read the various data associated with the HTTP request as well as the HTTP response via the `event` variable. Please refer to the [`AccessEvent` class source code](http://logback.qos.ch/xref/ch/qos/logback/access/spi/AccessEvent.html) for the exact list.

The next logback-access configuration file illustrates filtering based on the [404 (Not Found)](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.5) HTTP response code. Every request resulting in a 404 will be printed on the console.

*Example: Access Evaluator (logback-examples/src/main/resources/chapters/filters/accessEventEvaluator.xml)*

In the next example, we still log requests resulting in 404 errors, except those requests asking for CSS files.

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