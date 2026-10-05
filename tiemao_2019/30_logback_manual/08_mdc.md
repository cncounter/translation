# Chapter 8: Mapped Diagnostic Context

# 第8章: 映射诊断上下文(MDC)

*Lock the doors.*

—LEROY CAIN, Flight Director, Columbia Mission Control

*把门锁好。*

——LEROY CAIN，哥伦比亚号任务控制中心飞行主管

One of the design goals of logback is to audit and debug complex distributed applications. Most real-world distributed systems need to deal with multiple clients simultaneously. In a typical multithreaded implementation of such a system, different threads will handle different clients. A possible but slightly discouraged approach to differentiate the logging output of one client from another consists of instantiating a new and separate logger for each client. This technique promotes the proliferation of loggers and may increase their管理 overhead.

logback 的设计目标之一是审计和调试复杂的分布式应用。大多数现实中的分布式系统都需要同时处理多个客户端。在这类系统的典型多线程实现中，不同的线程会处理不同的客户端。有一种可行但不太受推荐的做法，是为每个客户端实例化一个新的、独立的 logger，以此来区分不同客户端的日志输出。这种做法会导致 logger 数量激增，并可能增加管理开销。

In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](http://logback.qos.ch/setup.html) for further details.

为了运行本章中的示例，需要确保 classpath 中存在某些 jar 文件。详情请参考 [setup page](http://logback.qos.ch/setup.html)。

A lighter technique consists of uniquely stamping each log request servicing a given client. Neil Harrison described this method in the book *Patterns for Logging Diagnostic Messages* in Pattern Languages of Program Design 3, edited by R. Martin, D. Riehle, and F. Buschmann (Addison-Wesley, 1997). Logback leverages a variant of this technique included in the SLF4J API: Mapped Diagnostic Contexts (MDC).

一种更轻量的做法，是给服务于某个客户端的每条日志请求打上唯一的标记。Neil Harrison 在《Pattern Languages of Program Design 3》（R. Martin、D. Riehle 和 F. Buschmann 编，Addison-Wesley，1997）一书中的 *Patterns for Logging Diagnostic Messages* 一文描述了这种方法。Logback 利用了 SLF4J API 中包含的这一技术的变体：映射诊断上下文(Mapped Diagnostic Contexts, MDC)。

To uniquely stamp each request, the user puts contextual information into the `MDC`, the abbreviation of Mapped Diagnostic Context. The salient parts of the MDC class are shown below. Please refer to the [MDC javadocs](http://www.slf4j.org/api/org/slf4j/MDC.html) for a complete list of methods.

为了给每条请求打上唯一的标记，用户把上下文信息放进 `MDC`，即 Mapped Diagnostic Context 的缩写。MDC 类的主要部分如下所示，完整的方法列表请参考 [MDC javadocs](http://www.slf4j.org/api/org/slf4j/MDC.html)。

```
package org.slf4j;

public class MDC {
  //Put a context value as identified by key
  //into the current thread's context map.
  public static void put(String key, String val);

  //Get the context identified by the key parameter.
  public static String get(String key);

  //Remove the context identified by the key parameter.
  public static void remove(String key);

  //Clear all entries in the MDC.
  public static void clear();
}
```

The `MDC` class contains only static methods. It lets the developer place information in a *diagnostic context* that can be subsequently retrieved by certain logback components. The `MDC` manages contextual information on a *per thread basis*. Typically, while starting to service a new client request, the developer will insert pertinent contextual information, such as the client id, client's IP address, request parameters etc. into the `MDC`. Logback components, if appropriately configured, will automatically include this information in each log entry.

`MDC` 类只包含静态方法。它让开发者可以把信息放进*诊断上下文*(diagnostic context)，随后这些信息可以被某些 logback 组件取回。`MDC` 以*线程为单位*管理上下文信息。通常，在开始服务一个新的客户端请求时，开发者会把相关的上下文信息，比如客户端 id、客户端 IP 地址、请求参数等，放进 `MDC`。logback 组件只要配置得当，就会自动把这些信息包含到每条日志记录中。

Please note that MDC as implemented by logback-classic assumes that values are placed into the MDC with moderate frequency. Also note that a child thread does not automatically inherit a copy of the mapped diagnostic context of its parent.

请注意，logback-classic 所实现的 MDC 假定放入 MDC 的值的更新频率适中。另请注意，子线程不会自动继承其父线程的映射诊断上下文的副本。

The next application named `SimpleMDC` demonstrates this basic principle.

下一个名为 `SimpleMDC` 的应用演示了这一基本原理。

*Example 7.1: Basic MDC usage ([ logback-examples/src/main/java/chapters/mdc/SimpleMDC.java)](http://logback.qos.ch/xref/chapters/mdc/SimpleMDC.html)*

The main method starts by associating the value *Dorothy* with the key *first* in the `MDC`. You can place as many value/key associations in the `MDC` as you wish. Multiple insertions with the same key will overwrite older values. The code then proceeds to configure logback.

main 方法首先在 `MDC` 中把值 *Dorothy* 与键 *first* 关联起来。你可以往 `MDC` 中放入任意多个值/键关联，对同一键的多次插入会覆盖旧值。随后代码开始配置 logback。

For the sake of conciseness, we have the omitted the code that configures logback with the configuration file [simpleMDC.xml](http://github.com/qos-ch/logback/blob/master/logback-examples/src/main/java/chapters/mdc/simpleMDC.xml). Here is the relevant section from that file.

为简洁起见，我们省略了用配置文件 [simpleMDC.xml](http://github.com/qos-ch/logback/blob/master/logback-examples/src/main/java/chapters/mdc/simpleMDC.xml) 配置 logback 的代码。下面是该文件的相关部分。

```
<appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender"> 
  <layout>
    <Pattern>%X{first} %X{last} - %m%n</Pattern>
  </layout> 
</appender>
```

Note the usage of the *%X* specifier within the `PatternLayout` conversion pattern. The *%X* conversion specifier is employed twice, once for the key named *first* and once for the key named *last*. After obtaining a logger corresponding to `SimpleMDC.class`, the code associates the value *Parker* with the key named *last*. It then invokes the logger twice with different messages. The code finishes by setting the `MDC` to different values and issuing several logging requests. Running SimpleMDC yields:

注意在 `PatternLayout` 转换模式中 *%X* 说明符的用法。*%X* 转换说明符被使用了两次，一次针对名为 *first* 的键，一次针对名为 *last* 的键。在获取与 `SimpleMDC.class` 对应的 logger 之后，代码把值 *Parker* 与名为 *last* 的键关联起来，然后用不同的消息调用了两次 logger。最后，代码把 `MDC` 设置为不同的值并发出若干日志请求。运行 SimpleMDC 的结果如下：

```
Dorothy Parker - Check enclosed.
Dorothy Parker - The most beautiful two words in English.
Richard Nixon - I am not a crook.
Richard Nixon - Attributed to the former US president. 17 Nov 1973.
```

The `SimpleMDC` application illustrates how logback layouts, if configured appropriately, can automatically output `MDC` information. Moreover, the information placed into the `MDC` can be used by multiple logger invocations.

`SimpleMDC` 应用展示了 logback 的 layout 只要配置得当，就能自动输出 `MDC` 信息。而且，放进 `MDC` 的信息可以被多次 logger 调用使用。

### Advanced Use

### 高级用法

Mapped Diagnostic Contexts shine brightest within client server architectures. Typically, multiple clients will be served by multiple threads on the server. Although the methods in the `MDC` class are static, the diagnostic context is managed on a per thread basis, allowing each server thread to bear a distinct `MDC` stamp. `MDC` operations such as `put()` and `get()` affect only the `MDC` of the *current* thread, and the children of the current thread. The `MDC` in other threads remain unaffected. Given that `MDC` information is managed on a per thread basis, each thread will have its own copy of the `MDC`. Thus, there is no need for the developer to worry about thread-safety or synchronization when programming with the `MDC` because it handles these issues safely and transparently.

映射诊断上下文在客户端-服务器架构中大放异彩。通常，服务器上的多个线程会同时服务多个客户端。虽然 `MDC` 类中的方法是静态的，但诊断上下文是以线程为单位管理的，因此每个服务器线程都可以带有自己独特的 `MDC` 标记。`put()`、`get()` 之类的 `MDC` 操作只影响*当前*线程（以及当前线程的子线程）的 `MDC`，其他线程中的 `MDC` 不受影响。鉴于 `MDC` 信息按线程管理，每个线程都拥有自己的 `MDC` 副本。因此，开发者使用 `MDC` 编程时无需担心线程安全或同步问题，因为它会安全、透明地处理这些问题。

The next example is somewhat more advanced. It shows how the `MDC` can be used in a client-server setting. The server-side implements the `NumberCruncher` interface shown in Example 7.2 below. `The NumberCruncher` interface contains a single method named `factor()`. Using RMI technology, the client invokes the `factor()` method of the server application to retrieve the distinct factors of an integer.

下一个示例稍微高级一些。它展示了如何在客户端-服务器环境中使用 `MDC`。服务器端实现了下文示例 7.2 所示的 `NumberCruncher` 接口。`NumberCruncher` 接口只包含一个名为 `factor()` 的方法。客户端借助 RMI 技术调用服务器应用的 `factor()` 方法，来获取一个整数的全部不同因子。

*Example 7.2: The service interface ([ logback-examples/src/main/java/chapters/mdc/NumberCruncher.java)](http://logback.qos.ch/xref/chapters/mdc/NumberCruncher.html)*

The `NumberCruncherServer` application, listed in Example 7.3 below, implements the `NumberCruncher` interface. Its main method exports an RMI Registry on the local host that accepts requests on a well-known port.

下文示例 7.3 中列出的 `NumberCruncherServer` 应用实现了 `NumberCruncher` 接口。它的 main 方法在本地主机上导出一个 RMI Registry，在一个众所周知的端口上接受请求。

*Example 7.3: The server side ([ logback-examples/src/main/java/chapters/mdc/NumberCruncherServer.java)](http://logback.qos.ch/xref/chapters/mdc/NumberCruncherServer.html)*

The implementation of the `factor(int number)` method is of particular relevance. It starts by putting the client's hostname into the `MDC` under the key *client*. The number to factor, as requested by the client, is put into the `MDC` under the key *number*. After computing the distinct factors of the integer parameter, the result is returned to the client. Before returning the result however, the values for the *client* and *number* are cleared by calling the `MDC.remove()` method. Normally, a `put()` operation should be balanced by the corresponding `remove()` operation. Otherwise, the `MDC` will contain stale values for certain keys. We would recommend that whenever possible, `remove()` operations be performed within finally blocks, ensuring their invocation regardless of the execution path of the code.

`factor(int number)` 方法的实现尤其值得关注。它首先把客户端的主机名以 *client* 为键放进 `MDC`，再把客户端请求的要分解的整数以 *number* 为键放进 `MDC`。计算出整数参数的各个不同因子后，结果会返回给客户端。不过在返回结果之前，*client* 和 *number* 的值会通过调用 `MDC.remove()` 方法被清除。通常，`put()` 操作应该与相应的 `remove()` 操作成对出现，否则 `MDC` 中会残留某些键的过期值。我们建议尽可能把 `remove()` 操作放在 finally 块中执行，以确保无论代码的执行路径如何，它们都会被调用。

After these theoretical explanations, we are ready to run the number cruncher example. Start the server with the following command:

讲完了这些理论，我们可以运行数字分解示例了。用以下命令启动服务器：

```
java chapters.mdc.NumberCruncherServer src/main/java/chapters/mdc/mdc1.xml
```

The *mdc1.xml* configuration file is listed below:

*mdc1.xml* 配置文件如下：

*Example 7.4: Configuration file (logback-examples/src/main/java/chapters/mdc/mdc1.xml)*

Note the use of the *%X* conversion specifier within the Pattern option.

注意 Pattern 选项中 *%X* 转换说明符的用法。

The following command starts an instance of `NumberCruncherClient` application:

以下命令会启动一个 `NumberCruncherClient` 应用实例：

```
java chapters.mdc.NumberCruncherClient hostname
```

where *hostname* is the host where the `NumberCruncherServer` is running

其中 *hostname* 是 `NumberCruncherServer` 所在的主机。

Executing multiple instances of the client and requesting the server to factor the numbers 129 from the first client and shortly thereafter the number 71 from the second client, the server outputs the following:

运行多个客户端实例，让第一个客户端请求服务器分解数字 129，稍后让第二个客户端请求分解数字 71，服务器会输出以下内容：

```
70984 [RMI TCP Connection(4)-192.168.1.6] INFO  C:orion N:129 - Beginning to factor.
70984 [RMI TCP Connection(4)-192.168.1.6] DEBUG C:orion N:129 - Trying 2 as a factor.
71093 [RMI TCP Connection(4)-192.168.1.6] DEBUG C:orion N:129 - Trying 3 as a factor.
71093 [RMI TCP Connection(4)-192.168.1.6] INFO  C:orion N:129 - Found factor 3
71187 [RMI TCP Connection(4)-192.168.1.6] DEBUG C:orion N:129 - Trying 4 as a factor.
71297 [RMI TCP Connection(4)-192.168.1.6] DEBUG C:orion N:129 - Trying 5 as a factor.
71390 [RMI TCP Connection(4)-192.168.1.6] DEBUG C:orion N:129 - Trying 6 as a factor.
71453 [RMI TCP Connection(5)-192.168.1.6] INFO  C:orion N:71 - Beginning to factor.
71453 [RMI TCP Connection(5)-192.168.1.6] DEBUG C:orion N:71 - Trying 2 as a factor.
71484 [RMI TCP Connection(4)-192.168.1.6] DEBUG C:orion N:129 - Trying 7 as a factor.
71547 [RMI TCP Connection(5)-192.168.1.6] DEBUG C:orion N:71 - Trying 3 as a factor.
71593 [RMI TCP Connection(4)-192.168.1.6] DEBUG C:orion N:129 - Trying 8 as a factor.
71656 [RMI TCP Connection(5)-192.168.1.6] DEBUG C:orion N:71 - Trying 4 as a factor.
71687 [RMI TCP Connection(4)-192.168.1.6] DEBUG C:orion N:129 - Trying 9 as a factor.
71750 [RMI TCP Connection(5)-192.168.1.6] DEBUG C:orion N:71 - Trying 5 as a factor.
71797 [RMI TCP Connection(4)-192.168.1.6] DEBUG C:orion N:129 - Trying 10 as a factor.
71859 [RMI TCP Connection(5)-192.168.1.6] DEBUG C:orion N:71 - Trying 6 as a factor.
71890 [RMI TCP Connection(4)-192.168.1.6] DEBUG C:orion N:129 - Trying 11 as a factor.
71953 [RMI TCP Connection(5)-192.168.1.6] DEBUG C:orion N:71 - Trying 7 as a factor.
72000 [RMI TCP Connection(4)-192.168.1.6] INFO  C:orion N:129 - Found factor 43
72062 [RMI TCP Connection(5)-192.168.1.6] DEBUG C:orion N:71 - Trying 8 as a factor.
72156 [RMI TCP Connection(5)-192.168.1.6] INFO  C:orion N:71 - Found factor 71
```

The clients were run from a machine called *orion* as can be seen in the above output. Even if the server processes the requests of clients near-simultaneously in separate threads, the logging output pertaining to each client request can be distinguished by studying the output of the `MDC`. Note for example the stamp associated with *number*, i.e. the number to factor.

从上面的输出可以看到，客户端是在一台名为 *orion* 的机器上运行的。即使服务器在多个独立的线程中近乎同时地处理各客户端的请求，通过研读 `MDC` 的输出，也能区分出与每个客户端请求相关的日志。例如，注意与 *number*（即待分解的数字）相关联的标记。

The attentive reader might have observed that the thread name could also have been used to distinguish each request. The thread name can cause confusion if the server side technology recycles threads. In that case, it may be hard to determine the boundaries of each request, that is, when a given thread finishes servicing a request and when it begins servicing the next. Because the `MDC` is under the control of the application developer, `MDC` stamps do not suffer from this problem.

细心的读者可能已经发现，线程名其实也可以用来区分各个请求。但如果服务器端技术会复用(recycle)线程，线程名就容易引起混淆：此时很难确定每个请求的边界，即给定线程何时结束一个请求的服务、何时开始服务下一个请求。而 `MDC` 由应用开发者掌控，`MDC` 标记不存在这个问题。

### Automating access to the `MDC`

### 自动管理 `MDC` 的访问

As we've seen, the `MDC` is very useful when dealing with multiple clients. In the case of a web application that manages user authentication, one simple solution could be to set the user's name in the `MDC` and remove it once the user logs out. Unfortunately, it is not always possible to achieve reliable results using this technique. Since `MDC` manages data on a *per thread* basis, a server that recycles threads might lead to false information contained in the `MDC`.

如前所见，`MDC` 在处理多个客户端时非常有用。对于管理用户认证的 web 应用，一种简单的方案是把用户名放进 `MDC`，等用户登出后再移除。遗憾的是，这种技术并不总能获得可靠的结果。由于 `MDC` 以*线程*为单位管理数据，线程复用的服务器可能导致 `MDC` 中出现错误的信息。

To allow the information contained in the `MDC` to be correct at all times when a request is processed, a possible approach would be to store the username at the beginning of the process, and remove it at the end of said process. A servlet [`Filter`](http://java.sun.com/javaee/5/docs/api/javax/servlet/Filter.html) comes in handy in this case.

为了让处理请求期间 `MDC` 中的信息始终正确，一种可行的做法是在处理开始时存入用户名，在处理结束时移除。这时 servlet [`Filter`](http://java.sun.com/javaee/5/docs/api/javax/servlet/Filter.html) 就派上用场了。

Within the servlet filter's `doFilter` method, we can retrieve the relevant user data through the request (or a cookie therein), store it the `MDC`. Subsequent processing by other filters and servlets will automatically benefit from the MDC data that was stored previously. Finally, when our servlet filter regains control, we have an opportunity to clean MDC data.

在 servlet 过滤器的 `doFilter` 方法中，我们可以通过请求（或其中的 cookie）获取相关的用户数据并存入 `MDC`。之后其他过滤器和 servlet 的处理会自动受益于先前存入的 MDC 数据。最后，当我们的 servlet 过滤器重新拿到控制权时，就有机会清理 MDC 数据。

Here is an implementation of such a filter:

*Example 7.5: User servlet filter ([ logback-examples/src/main/java/chapters/mdc/UserServletFilter.java)](http://logback.qos.ch/xref/chapters/mdc/UserServletFilter.html)*

When the filter's `doFilter()` method is called, it first looks for a `java.security.Principal` object in the request. This object contains the name of the currently authenticated user. If a user information is found, it is registered in the `MDC`.

当过滤器的 `doFilter()` 方法被调用时，它首先在请求中查找 `java.security.Principal` 对象。该对象包含当前已认证用户的名称。如果找到了用户信息，就把它注册到 `MDC` 中。

Once the filter chain has completed, the filter removes the user information from the `MDC`.

过滤器链执行完毕后，该过滤器会把用户信息从 `MDC` 中移除。

The approach we just outlined sets MDC data only for the duration of the request and only for the thread processing it. Other threads are unaffected. Furthermore, any given thread will contain correct MDC data at any point in time.

我们刚才概述的方案，只在请求处理期间、且只针对处理该请求的线程设置 MDC 数据，其他线程不受影响。此外，任何线程在任何时间点都会包含正确的 MDC 数据。

### MDC And Managed Threads

### MDC 与受管线程

A copy of the mapped diagnostic context can not always be inherited by worker threads from the initiating thread. This is the case when `java.util.concurrent.Executors` is used for thread management. For instance, `newCachedThreadPool` method creates a `ThreadPoolExecutor` and like other thread pooling code, it has intricate thread creation logic.

工作线程并不总能从发起线程那里继承映射诊断上下文的副本。使用 `java.util.concurrent.Executors` 进行线程管理时就是如此。例如，`newCachedThreadPool` 方法会创建一个 `ThreadPoolExecutor`，与其他线程池代码一样，它有着复杂的线程创建逻辑。

In such cases, it is recommended that `MDC.getCopyOfContextMap()` is invoked on the original (master) thread before submitting a task to the executor. When the task runs, as its first action, it should invoke `MDC.setContextMapValues()` to associate the stored copy of the original MDC values with the new `Executor` managed thread.

在这种情况下，建议在向执行器提交任务之前，先在原始（主）线程上调用 `MDC.getCopyOfContextMap()`。任务运行时，它的第一个动作应该是调用 `MDC.setContextMapValues()`，把先前保存的原始 MDC 值的副本与新的 `Executor` 受管线程关联起来。

### MDCInsertingServletFilter

Within web applications, it often proves helpful to know the hostname, request uri and user-agent associated with a given HTTP request. [`MDCInsertingServletFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/helpers/MDCInsertingServletFilter.html) inserts such data into the MDC under the following keys.

在 web 应用中，知道与给定 HTTP 请求关联的主机名、请求 URI 和 user-agent 往往很有帮助。[MDCInsertingServletFilter](http://logback.qos.ch/xref/ch/qos/logback/classic/helpers/MDCInsertingServletFilter.html) 会把这类数据插入 MDC，使用的键如下。

| MDC key             | MDC value                                                    |
| ------------------- | ------------------------------------------------------------ |
| `req.remoteHost`    | as returned by the [getRemoteHost()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/ServletRequest.html#getRemoteHost()) method |
| `req.xForwardedFor` | value of the ["X-Forwarded-For"](http://en.wikipedia.org/wiki/X-Forwarded-For) header |
| `req.method`        | as returned by [getMethod()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/http/HttpServletRequest.html#getMethod()) method |
| `req.requestURI`    | as returned by [getRequestURI()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/http/HttpServletRequest.html#getRequestURI()) method |
| `req.requestURL`    | as returned by [getRequestURL()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/http/HttpServletRequest.html#getRequestURL()) method |
| `req.queryString`   | as returned by [getQueryString()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/http/HttpServletRequest.html#getQueryString()) method |
| `req.userAgent`     | value of the "User-Agent" header                             |

中文对照：

| MDC 键 | MDC 值 |
| --- | --- |
| `req.remoteHost` | [getRemoteHost()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/ServletRequest.html#getRemoteHost()) 方法返回的值 |
| `req.xForwardedFor` | ["X-Forwarded-For"](http://en.wikipedia.org/wiki/X-Forwarded-For) 请求头的值 |
| `req.method` | [getMethod()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/http/HttpServletRequest.html#getMethod()) 方法返回的值 |
| `req.requestURI` | [getRequestURI()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/http/HttpServletRequest.html#getRequestURI()) 方法返回的值 |
| `req.requestURL` | [getRequestURL()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/http/HttpServletRequest.html#getRequestURL()) 方法返回的值 |
| `req.queryString` | [getQueryString()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/http/HttpServletRequest.html#getQueryString()) 方法返回的值 |
| `req.userAgent` | "User-Agent" 请求头的值 |

To install `MDCInsertingServletFilter` add the following lines to your web-application's *web.xml* file

要安装 `MDCInsertingServletFilter`，请把以下几行加入 web 应用的 *web.xml* 文件：

```
<filter>
  <filter-name>MDCInsertingServletFilter</filter-name>
  <filter-class>
    ch.qos.logback.classic.helpers.MDCInsertingServletFilter
  </filter-class>
</filter>
<filter-mapping>
  <filter-name>MDCInsertingServletFilter</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping> 
```

**If your web-app has multiple filters, make sure that `MDCInsertingServletFilter` is declared before other filters.** For example, assuming the main processing in your web-app is done in filter 'F', the MDC values set by `MDCInsertingServletFilter` will not be seen by the code invoked by 'F' if `MDCInsertingServletFilter` comes after 'F'.

**如果你的 web 应用有多个过滤器，请确保 `MDCInsertingServletFilter` 声明在其他过滤器之前。** 例如，假设你的 web 应用的主要处理在过滤器 'F' 中完成，如果 `MDCInsertingServletFilter` 排在 'F' 之后，那么 'F' 所调用的代码将看不到 `MDCInsertingServletFilter` 设置的 MDC 值。

Once the filter is installed, values corresponding to each MDC key will be output by the %X [conversion word](http://logback.qos.ch/manual/layouts.html#conversionWord) according to the key passes as first option. For example, to print the remote host followed by the request URI on one line, the date followed by the message on the next, you would set `PatternLayout`'s pattern to:

过滤器安装好之后，各 MDC 键对应的值就可以由 %X [转换词](http://logback.qos.ch/manual/layouts.html#conversionWord)输出，键作为第一个选项传入。例如，要在第一行打印远程主机和请求 URI、第二行打印日期和消息，可以把 `PatternLayout` 的 pattern 设置为：

```
%X{req.remoteHost} %X{req.requestURI}%n%d - %m%n
```



<http://logback.qos.ch/manual/mdc.html>



