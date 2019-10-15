# Chapter 8: Mapped Diagnostic Context

*Lock the doors.*

—LEROY CAIN, Flight Director, Columbia Mission Control

One of the design goals of logback is to audit and debug complex distributed applications. Most real-world distributed systems need to deal with multiple clients simultaneously. In a typical multithreaded implementation of such a system, different threads will handle different clients. A possible but slightly discouraged approach to differentiate the logging output of one client from another consists of instantiating a new and separate logger for each client. This technique promotes the proliferation of loggers and may increase their management overhead.

In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](http://logback.qos.ch/setup.html) for further details.

A lighter technique consists of uniquely stamping each log request servicing a given client. Neil Harrison described this method in the book *Patterns for Logging Diagnostic Messages* in Pattern Languages of Program Design 3, edited by R. Martin, D. Riehle, and F. Buschmann (Addison-Wesley, 1997). Logback leverages a variant of this technique included in the SLF4J API: Mapped Diagnostic Contexts (MDC).

To uniquely stamp each request, the user puts contextual information into the `MDC`, the abbreviation of Mapped Diagnostic Context. The salient parts of the MDC class are shown below. Please refer to the [MDC javadocs](http://www.slf4j.org/api/org/slf4j/MDC.html) for a complete list of methods.

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

Please note that MDC as implemented by logback-classic assumes that values are placed into the MDC with moderate frequency. Also note that a child thread does not automatically inherit a copy of the mapped diagnostic context of its parent.

The next application named `SimpleMDC` demonstrates this basic principle.

*Example 7.1: Basic MDC usage ([ logback-examples/src/main/java/chapters/mdc/SimpleMDC.java)](http://logback.qos.ch/xref/chapters/mdc/SimpleMDC.html)*

The main method starts by associating the value *Dorothy* with the key *first* in the `MDC`. You can place as many value/key associations in the `MDC` as you wish. Multiple insertions with the same key will overwrite older values. The code then proceeds to configure logback.

For the sake of conciseness, we have the omitted the code that configures logback with the configuration file [simpleMDC.xml](http://github.com/qos-ch/logback/blob/master/logback-examples/src/main/java/chapters/mdc/simpleMDC.xml). Here is the relevant section from that file.

```
<appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender"> 
  <layout>
    <Pattern>%X{first} %X{last} - %m%n</Pattern>
  </layout> 
</appender>
```

Note the usage of the *%X* specifier within the `PatternLayout` conversion pattern. The *%X* conversion specifier is employed twice, once for the key named *first* and once for the key named *last*. After obtaining a logger corresponding to `SimpleMDC.class`, the code associates the value *Parker* with the key named *last*. It then invokes the logger twice with different messages. The code finishes by setting the `MDC` to different values and issuing several logging requests. Running SimpleMDC yields:

```
Dorothy Parker - Check enclosed.
Dorothy Parker - The most beautiful two words in English.
Richard Nixon - I am not a crook.
Richard Nixon - Attributed to the former US president. 17 Nov 1973.
```

The `SimpleMDC` application illustrates how logback layouts, if configured appropriately, can automatically output `MDC` information. Moreover, the information placed into the `MDC` can be used by multiple logger invocations.

### Advanced Use

Mapped Diagnostic Contexts shine brightest within client server architectures. Typically, multiple clients will be served by multiple threads on the server. Although the methods in the `MDC` class are static, the diagnostic context is managed on a per thread basis, allowing each server thread to bear a distinct `MDC` stamp. `MDC` operations such as `put()` and `get()` affect only the `MDC` of the *current* thread, and the children of the current thread. The `MDC` in other threads remain unaffected. Given that `MDC` information is managed on a per thread basis, each thread will have its own copy of the `MDC`. Thus, there is no need for the developer to worry about thread-safety or synchronization when programming with the `MDC` because it handles these issues safely and transparently.

The next example is somewhat more advanced. It shows how the `MDC` can be used in a client-server setting. The server-side implements the `NumberCruncher` interface shown in Example 7.2 below. `The NumberCruncher` interface contains a single method named `factor()`. Using RMI technology, the client invokes the `factor()` method of the server application to retrieve the distinct factors of an integer.

*Example 7.2: The service interface ([ logback-examples/src/main/java/chapters/mdc/NumberCruncher.java)](http://logback.qos.ch/xref/chapters/mdc/NumberCruncher.html)*

The `NumberCruncherServer` application, listed in Example 7.3 below, implements the `NumberCruncher` interface. Its main method exports an RMI Registry on the local host that accepts requests on a well-known port.

*Example 7.3: The server side ([ logback-examples/src/main/java/chapters/mdc/NumberCruncherServer.java)](http://logback.qos.ch/xref/chapters/mdc/NumberCruncherServer.html)*

The implementation of the `factor(int number)` method is of particular relevance. It starts by putting the client's hostname into the `MDC` under the key *client*. The number to factor, as requested by the client, is put into the `MDC` under the key *number*. After computing the distinct factors of the integer parameter, the result is returned to the client. Before returning the result however, the values for the *client* and *number* are cleared by calling the `MDC.remove()` method. Normally, a `put()` operation should be balanced by the corresponding `remove()` operation. Otherwise, the `MDC` will contain stale values for certain keys. We would recommend that whenever possible, `remove()` operations be performed within finally blocks, ensuring their invocation regardless of the execution path of the code.

After these theoretical explanations, we are ready to run the number cruncher example. Start the server with the following command:

```
java chapters.mdc.NumberCruncherServer src/main/java/chapters/mdc/mdc1.xml
```

The *mdc1.xml* configuration file is listed below:

*Example 7.4: Configuration file (logback-examples/src/main/java/chapters/mdc/mdc1.xml)*

Note the use of the *%X* conversion specifier within the Pattern option.

The following command starts an instance of `NumberCruncherClient` application:

```
java chapters.mdc.NumberCruncherClient hostname
```

where *hostname* is the host where the `NumberCruncherServer` is running

Executing multiple instances of the client and requesting the server to factor the numbers 129 from the first client and shortly thereafter the number 71 from the second client, the server outputs the following:

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

The attentive reader might have observed that the thread name could also have been used to distinguish each request. The thread name can cause confusion if the server side technology recycles threads. In that case, it may be hard to determine the boundaries of each request, that is, when a given thread finishes servicing a request and when it begins servicing the next. Because the `MDC` is under the control of the application developer, `MDC` stamps do not suffer from this problem.

### Automating access to the `MDC`

As we've seen, the `MDC` is very useful when dealing with multiple clients. In the case of a web application that manages user authentication, one simple solution could be to set the user's name in the `MDC` and remove it once the user logs out. Unfortunately, it is not always possible to achieve reliable results using this technique. Since `MDC` manages data on a *per thread* basis, a server that recycles threads might lead to false information contained in the `MDC`.

To allow the information contained in the `MDC` to be correct at all times when a request is processed, a possible approach would be to store the username at the beginning of the process, and remove it at the end of said process. A servlet [`Filter`](http://java.sun.com/javaee/5/docs/api/javax/servlet/Filter.html) comes in handy in this case.

Within the servlet filter's `doFilter` method, we can retrieve the relevant user data through the request (or a cookie therein), store it the `MDC`. Subsequent processing by other filters and servlets will automatically benefit from the MDC data that was stored previously. Finally, when our servlet filter regains control, we have an opportunity to clean MDC data.

Here is an implementation of such a filter:

*Example 7.5: User servlet filter ([ logback-examples/src/main/java/chapters/mdc/UserServletFilter.java)](http://logback.qos.ch/xref/chapters/mdc/UserServletFilter.html)*

When the filter's `doFilter()` method is called, it first looks for a `java.security.Principal` object in the request. This object contains the name of the currently authenticated user. If a user information is found, it is registered in the `MDC`.

Once the filter chain has completed, the filter removes the user information from the `MDC`.

The approach we just outlined sets MDC data only for the duration of the request and only for the thread processing it. Other threads are unaffected. Furthermore, any given thread will contain correct MDC data at any point in time.

### MDC And Managed Threads

A copy of the mapped diagnostic context can not always be inherited by worker threads from the initiating thread. This is the case when `java.util.concurrent.Executors` is used for thread management. For instance, `newCachedThreadPool` method creates a `ThreadPoolExecutor` and like other thread pooling code, it has intricate thread creation logic.

In such cases, it is recommended that `MDC.getCopyOfContextMap()` is invoked on the original (master) thread before submitting a task to the executor. When the task runs, as its first action, it should invoke `MDC.setContextMapValues()` to associate the stored copy of the original MDC values with the new `Executor` managed thread.

### MDCInsertingServletFilter

Within web applications, it often proves helpful to know the hostname, request uri and user-agent associated with a given HTTP request. [`MDCInsertingServletFilter`](http://logback.qos.ch/xref/ch/qos/logback/classic/helpers/MDCInsertingServletFilter.html) inserts such data into the MDC under the following keys.

| MDC key             | MDC value                                                    |
| ------------------- | ------------------------------------------------------------ |
| `req.remoteHost`    | as returned by the [getRemoteHost()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/ServletRequest.html#getRemoteHost()) method |
| `req.xForwardedFor` | value of the ["X-Forwarded-For"](http://en.wikipedia.org/wiki/X-Forwarded-For) header |
| `req.method`        | as returned by [getMethod()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/http/HttpServletRequest.html#getMethod()) method |
| `req.requestURI`    | as returned by [getRequestURI()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/http/HttpServletRequest.html#getRequestURI()) method |
| `req.requestURL`    | as returned by [getRequestURL()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/http/HttpServletRequest.html#getRequestURL()) method |
| `req.queryString`   | as returned by [getQueryString()](http://java.sun.com/j2ee/sdk_1.3/techdocs/api/javax/servlet/http/HttpServletRequest.html#getQueryString()) method |
| `req.userAgent`     | value of the "User-Agent" header                             |

To install `MDCInsertingServletFilter` add the following lines to your web-application's *web.xml* file

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

Once the filter is installed, values corresponding to each MDC key will be output by the %X [conversion word](http://logback.qos.ch/manual/layouts.html#conversionWord) according to the key passes as first option. For example, to print the remote host followed by the request URI on one line, the date followed by the message on the next, you would set `PatternLayout`'s pattern to:

```
%X{req.remoteHost} %X{req.requestURI}%n%d - %m%n
```



<http://logback.qos.ch/manual/mdc.html>



