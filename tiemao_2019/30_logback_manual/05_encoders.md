#  Chapter 5: Encoders

**ACTION THIS DAY** Make sure they have all they want on extreme priority and report to me that this has been done.

—CHURCHILL on October 1941 to General Hastings Ismay in response to a request for more resources signed by Alan Turing and his cryptanalyst colleagues at Bletchley Park

In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](http://logback.qos.ch/setup.html) for further details.

## What is an encoder

Encoders are responsible for transforming an event into a byte array as well as writing out that byte array into an `OutputStream`. Encoders were introduced in logback version 0.9.19. In previous versions, most appenders relied on a layout to transform an event into a string and write it out using a `java.io.Writer`. In previous versions of logback, users would nest a `PatternLayout` within `FileAppender`. Since logback 0.9.19, `FileAppender` and sub-classes [expect an encoder and no longer take a layout](http://logback.qos.ch/codes.html#layoutInsteadOfEncoder).

Why the breaking change?

Layouts, as discussed in detail in the next chapter, are only able to transform an event into a String. Moreover, given that a layout has no control over when events get written out, layouts cannot aggregate events into batches. Contrast this with encoders which not only have total control over the format of the bytes written out, but also control when (and if) those bytes get written out.

At the present time, `PatternLayoutEncoder` is the only really useful encoder. It merely wraps a `PatternLayout` which does most of the work. Thus, it may seem that encoders do not bring much to the table except needless complexity. However, we hope that with the advent of new and powerful encoders this impression will change.

## Encoder interface

Encoders are responsible for transforming an incoming event into a byte array **and** writing out the resulting byte array onto the appropriate `OutputStream`. Thus, encoders have total control of what and when bytes gets written to the `OutputStream` maintained by the owning appender. Here is the [Encoder interface:](http://logback.qos.ch/xref/ch/qos/logback/core/encoder/Encoder.html)

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

## LayoutWrappingEncoder

Until logback version 0.9.19, many appenders relied on the Layout instances to control the format of log output. As there exists substantial amount of code based on the layout interface, we needed a way for encoders to inter-operate with layouts. [LayoutWrappingEncoder](http://logback.qos.ch/xref/ch/qos/logback/core/encoder/LayoutWrappingEncoder.html) bridges the gap between encoders and layouts. It implements the encoder interface and wraps a layout to which it delegates the work of transforming an event into string.

Below is an excerpt from the `LayoutWrappingEncoder` class illustrating how delegation to the wrapped layout instance is done.

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

## PatternLayoutEncoder

Given that `PatternLayout` is the most commonly used layout, logback caters for this common use-case with `PatternLayoutEncoder`, an extension of `LayoutWrappingEncoder` restricted to wrapping instances of `PatternLayout`.

As of logback version 0.9.19, whenever a `FileAppender` or one of its sub-classes was configured with a `PatternLayout`, a `PatternLayoutEncoder` must be used instead. This is explained in the [relevant entry in the logback error codes](http://logback.qos.ch/codes.html#layoutInsteadOfEncoder).

#### immediateFlush property

As of **LOGBACK 1.2.0**, the immediateFlush property is part of the enclosing Appender.

#### Output pattern string as header

In order to facilitate parsing of log files, logback can insert the pattern used for the log output at the top of log files. This feature is **disabled** by default. It can be enabled by setting the outputPatternAsHeader property to 'true' for relevant `PatternLayoutEncoder`. Here is an example:

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

```
#logback.classic pattern: %d [%thread] %-5level %logger{36} - %msg%n
2012-04-26 14:54:38,461 [main] DEBUG com.foo.App - Hello world
2012-04-26 14:54:38,461 [main] DEBUG com.foo.App - Hi again
...
```

The line starting with "#logback.classic pattern" is newly inserted pattern line.




<http://logback.qos.ch/manual/encoders.html>
