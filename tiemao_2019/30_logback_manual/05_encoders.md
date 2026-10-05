#  Chapter 5: Encoders

# 第5章: 编码器(Encoder)

**ACTION THIS DAY** Make sure they have all they want on extreme priority and report to me that this has been done.

—CHURCHILL on October 1941 to General Hastings Ismay in response to a request for more resources signed by Alan Turing and his cryptanalyst colleagues at Bletchley Park

**今日即行动**：确保他们想要的一切都以最高优先级送达，并完成之后向我汇报。

——丘吉尔，1941年10月致黑斯廷斯·伊斯梅(Hastings Ismay)将军，回应由艾伦·图灵及其布莱切利园(Bletchley Park)的密码分析同事们联名提交的资源申请

In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](http://logback.qos.ch/setup.html) for further details.

为了运行本章中的示例，需要确保 classpath 中存在某些 jar 文件。详情请参考 [setup page](http://logback.qos.ch/setup.html)。

## What is an encoder

## 什么是 Encoder

Encoders are responsible for transforming an event into a byte array as well as writing out that byte array into an `OutputStream`. Encoders were introduced in logback version 0.9.19. In previous versions, most appenders relied on a layout to transform an event into a string and write it out using a `java.io.Writer`. In previous versions of logback, users would nest a `PatternLayout` within `FileAppender`. Since logback 0.9.19, `FileAppender` and sub-classes [expect an encoder and no longer take a layout](http://logback.qos.ch/codes.html#layoutInsteadOfEncoder).

Encoder 负责将事件转换成字节数组(byte array)，并把该字节数组写入 `OutputStream`。Encoder 是在 logback 0.9.19 版本中引入的。在此之前的版本中，大多数 appender 依赖 layout 把事件转换成字符串，再通过 `java.io.Writer` 写出。在旧版 logback 中，用户会在 `FileAppender` 里嵌套一个 `PatternLayout`。而从 logback 0.9.19 开始，`FileAppender` 及其子类 [期望配置 encoder，不再接受 layout](http://logback.qos.ch/codes.html#layoutInsteadOfEncoder)。

Why the breaking change?

为什么要做这个破坏性变更？

Layouts, as discussed in detail in the next chapter, are only able to transform an event into a String. Moreover, given that a layout has no control over when events get written out, layouts cannot aggregate events into batches. Contrast this with encoders which not only have total control over the format of the bytes written out, but also control when (and if) those bytes get written out.

正如下一章将要详细讨论的，layout 只能把事件转换成 String。而且，由于 layout 无法控制事件何时写出，也就无法把事件聚合成批次。相比之下，encoder 不仅可以完全控制写出字节的格式，还能控制这些字节何时（以及是否）写出。

At the present time, `PatternLayoutEncoder` is the only really useful encoder. It merely wraps a `PatternLayout` which does most of the work. Thus, it may seem that encoders do not bring much to the table except needless complexity. However, we hope that with the advent of new and powerful encoders this impression will change.

目前，`PatternLayoutEncoder` 是唯一真正实用的 encoder。它只是对 `PatternLayout` 做了一层包装，而大部分工作都由后者完成。因此，encoder 看起来除了带来不必要的复杂度之外并没有多少用处。不过我们希望，随着新一代功能强大的 encoder 的出现，这种印象会有所改观。

## Encoder interface

## Encoder 接口

Encoders are responsible for transforming an incoming event into a byte array **and** writing out the resulting byte array onto the appropriate `OutputStream`. Thus, encoders have total control of what and when bytes gets written to the `OutputStream` maintained by the owning appender. Here is the [Encoder interface:](http://logback.qos.ch/xref/ch/qos/logback/core/encoder/Encoder.html)

Encoder 负责把传入的事件转换成字节数组，**并**把得到的字节数组写到合适的 `OutputStream` 上。因此，对于由所属 appender 维护的 `OutputStream`，encoder 完全掌控着写出的内容与时机。下面是 [Encoder 接口:](http://logback.qos.ch/xref/ch/qos/logback/core/encoder/Encoder.html)

```
package ch.qos.logback.core.encoder;

public interface Encoder<E> extends ContextAware, LifeCycle {

   /**
   * This method is called when the owning appender starts or whenever output
   * needs to be directed to a new OutputStream, for instance as a result of a
   * rollover.
   */
  void init(OutputStream os) throws IOException;

  /**
   * Encode and write an event to the appropriate {@link OutputStream}.
   * Implementations are free to defer writing out of the encoded event and
   * instead write in batches.
   */
  void doEncode(E event) throws IOException;


  /**
   * This method is called prior to the closing of the underling
   * {@link OutputStream}. Implementations MUST not close the underlying
   * {@link OutputStream} which is the responsibility of the owning appender.
   */
  void close() throws IOException;
}
```

As you can see, the `Encoder` interface consists of few methods, but surprisingly many useful things can be accomplished with these methods.

可以看到，`Encoder` 接口只包含寥寥几个方法，但用这几个方法却能完成许多实用的事情。

## LayoutWrappingEncoder

Until logback version 0.9.19, many appenders relied on the Layout instances to control the format of log output. As there exists substantial amount of code based on the layout interface, we needed a way for encoders to inter-operate with layouts. [LayoutWrappingEncoder](http://logback.qos.ch/xref/ch/qos/logback/core/encoder/LayoutWrappingEncoder.html) bridges the gap between encoders and layouts. It implements the encoder interface and wraps a layout to which it delegates the work of transforming an event into string.

在 logback 0.9.19 版本之前，许多 appender 依赖 Layout 实例来控制日志输出的格式。由于基于 layout 接口的代码数量庞大，我们需要一种让 encoder 与 layout 互操作的方式。[LayoutWrappingEncoder](http://logback.qos.ch/xref/ch/qos/logback/core/encoder/LayoutWrappingEncoder.html) 弥合了 encoder 与 layout 之间的鸿沟。它实现了 encoder 接口，并包装一个 layout，将事件转换成字符串的工作委托给这个被包装的 layout。

Below is an excerpt from the `LayoutWrappingEncoder` class illustrating how delegation to the wrapped layout instance is done.

下面摘录了 `LayoutWrappingEncoder` 类的部分代码，展示它是如何把工作委托给被包装的 layout 实例的。

```
package ch.qos.logback.core.encoder;

public class LayoutWrappingEncoder<E> extends EncoderBase<E> {

  protected Layout<E> layout;
  private Charset charset;
 
   // encode a given event as a byte[]
   public byte[] encode(E event) {
     String txt = layout.doLayout(event);
     return convertToBytes(txt);
  }

  private byte[] convertToBytes(String s) {
    if (charset == null) {
      return s.getBytes();
    } else {
      return s.getBytes(charset);
    }
  } 
}
```

The `doEncode`() method starts by having the wrapped layout convert the incoming event into string. The resulting text string is converted to bytes according to the charset encoding chosen by the user.

`doEncode`() 方法首先让被包装的 layout 把传入的事件转换成字符串，然后根据用户选择的字符集编码(charset encoding)，把得到的文本串转换成字节。

## PatternLayoutEncoder

Given that `PatternLayout` is the most commonly used layout, logback caters for this common use-case with `PatternLayoutEncoder`, an extension of `LayoutWrappingEncoder` restricted to wrapping instances of `PatternLayout`.

鉴于 `PatternLayout` 是最常用的 layout，logback 通过 `PatternLayoutEncoder` 来满足这一常见使用场景。它是 `LayoutWrappingEncoder` 的扩展，专门用于包装 `PatternLayout` 实例。

As of logback version 0.9.19, whenever a `FileAppender` or one of its sub-classes was configured with a `PatternLayout`, a `PatternLayoutEncoder` must be used instead. This is explained in the [relevant entry in the logback error codes](http://logback.qos.ch/codes.html#layoutInsteadOfEncoder).

从 logback 0.9.19 版本开始，凡是给 `FileAppender` 或其子类配置 `PatternLayout` 的地方，都必须改用 `PatternLayoutEncoder`。相关说明见 [logback 错误码中的对应条目](http://logback.qos.ch/codes.html#layoutInsteadOfEncoder)。

#### immediateFlush property

#### immediateFlush 属性

As of **LOGBACK 1.2.0**, the immediateFlush property is part of the enclosing Appender.

从 **LOGBACK 1.2.0** 开始，immediateFlush 属性被移到了外层 Appender 中。

#### Output pattern string as header

#### 将输出模式(pattern)字符串作为文件头

In order to facilitate parsing of log files, logback can insert the pattern used for the log output at the top of log files. This feature is **disabled** by default. It can be enabled by setting the outputPatternAsHeader property to 'true' for relevant `PatternLayoutEncoder`. Here is an example:

为了便于解析日志文件，logback 可以把日志输出所用的 pattern 插入到日志文件的开头。该功能默认是**禁用**的，可以通过为相应的 `PatternLayoutEncoder` 设置 outputPatternAsHeader 属性为 'true' 来启用。示例如下：

```
<appender name="FILE" class="ch.qos.logback.core.FileAppender"> 
  <file>foo.log</file>
  <encoder>
    <pattern>%d %-5level [%thread] %logger{0}: %msg%n</pattern>
    <outputPatternAsHeader>true</outputPatternAsHeader>
  </encoder> 
</appender>
```

This will result output akin to the following in the log file:

这样，日志文件中的输出类似于：

```
#logback.classic pattern: %d [%thread] %-5level %logger{36} - %msg%n
2012-04-26 14:54:38,461 [main] DEBUG com.foo.App - Hello world
2012-04-26 14:54:38,461 [main] DEBUG com.foo.App - Hi again
...
```

The line starting with "#logback.classic pattern" is newly inserted pattern line.

以 "#logback.classic pattern" 开头的这一行，就是新插入的 pattern 行。




<http://logback.qos.ch/manual/encoders.html>
