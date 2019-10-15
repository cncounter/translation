# Chapter 14: Receivers

*You cannot swim for new horizons until you have courage to lose sight of the shore.*

—WILLIAM FAULKNER

In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](http://logback.qos.ch/setup.html) for further details.

## What is a Receiver?

A *receiver* is a Logback component that receives logging events from a remote appender and logs each received event according to local policy. Using a combination of socket-based appenders and receivers, it is possible to construct sophisticated topologies for distribution of application logging events over a network.

A receiver extends the [`ch.qos.logback.classic.net.ReceiverBase`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/ReceiverBase.html) class. By virtue of the fact that a receiver extends this class, a receiver participates in the Logback component [LifeCycle](http://logback.qos.ch/xref/ch/qos/logback/core/spi/LifeCycle.html) and a receiver is [ContextAware](http://logback.qos.ch/xref/ch/qos/logback/core/spi/ContextAware.html).

Historically, support for logging event delivery over a network connection in Logback has been provided by `SocketAppender` and the corresponding `SimpleSocketServer`. The appender acts as a client, initiating a network connection to the server application, and delivering logging events via the network connection. The receiver component and corresponding appender support offers much greater flexibility.

A receiver component is configured in *logback.xml*, just like any other logback component. This allows the full capabilities of [Joran](http://logback.qos.ch/manual/onJoran.html) to be utilized in configuring a receiver component. Moreover, *any* application can receive logging events from remote appenders by simply configuring one or more receiver components.

Connection initiation between an appender and a receiver can occur in either direction. A receiver can act in the role of a server, passively listening for connections from remote appender clients. Alternatively, a receiver can act in the client role, initiating a connection to a remote appender which is acting in the server role. Regardless of the respective roles of the appender and receiver, *logging events always flow from the appender towards the receiver*.

The flexibility to allow a receiver to initiate the connection to an appender is particularly useful in certain situations:

- For security reasons, a central logging server may be located behind a network firewall that does not allow incoming connections. Using receiver components acting in the client role, the central logging server (inside the firewall) can initiate connections to the applications of interest (outside the firewall).
- It is often desirable for developer tools (such as IDE plugins) and enterprise management applications to have access to the logging event stream of running applications. Traditionally, Logback has supported this (for example in Logback Beagle) by requiring the recipient application (e.g. a developer tool running in an IDE) to act in the server role, passively listening for connections from a remote appender. This can prove difficult to manage, especially for tools running on a developer's workstation, which may indeed by mobile. However, such tools can now be implemented using a Logback receiver component acting in the client role, initiating a connection to a remote appender in order to receive logging events for local display, filtering, and alerting.

A logback configuration can include any number of receiver components acting in any combination of the server or client roles. The only restrictions are that each receiver acting in the server role must listen on a distinct port, and each receiver acting in the client role will connect to exactly one remote appender.

## Receivers that Act in the Server Role

A receiver that is configured to act in the server role passively listens for incoming connections from remote appenders. This is functionally equivalent to using the standalone `SimpleSocketServer` application, except that by using the receiver component, *any* application that uses Logback Classic can receive logging events from remote appenders by simply configuring the receiver in *logback.xml*.

![img](http://logback.qos.ch/manual/images/chapters/receivers/serverSocketReceiver.png)

Logback includes two receiver components that act in the server role; [`ServerSocketReceiver`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/server/ServerSocketReceiver.html) and its SSL-enabled subtype [`SSLServerSocketReceiver`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/server/SSLServerSocketReceiver.html). Both of these receiver components are designed to accept connections from incoming `SocketAppender` (or `SSLSocketAppender`) clients.

The `ServerSocketReceiver` components provide the following configurable properties:

| Property Name | Type               | Description                                                  |
| ------------- | ------------------ | ------------------------------------------------------------ |
| **address**   | `String`           | The local network interface address on which the receiver will listen. If this property is not specified, the receiver will listen on all network interfaces. |
| **port**      | `int`              | The TCP port on which the receiver will listen. If this property is not specified, a default value will be used. |
| **ssl**       | `SSLConfiguration` | Supported only for `SSLServerSocketReceiver`, this property provides the SSL configuration that will be used by the receiver, as described in [Using SSL](http://logback.qos.ch/manual/usingSSL.html). |

### Using ServerSocketReceiver

The following configuration uses the `ServerSocketReceiver` component with a minimal local appender and logger configuration. Logging events received from a remote appender will be matched by the root logger and delivered to the local console appender.

Example: Basic ServerSocketReceiver Configuration (logback-examples/src/main/resources/chapters/receivers/socket/receiver1.xml)

```
<configuration debug="true">

  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger - %msg%n</pattern>
    </encoder>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="CONSOLE" />
  </root>

  <receiver class="ch.qos.logback.classic.net.server.ServerSocketReceiver">
    <port>${port}</port>
  </receiver>

</configuration>
```

Note that the receiver component's *class* attribute identifies the receiver subtype that we wish to use. In this example we are using `ServerSocketReceiver`.

Our example server application is very similar in function and design to `SimpleSocketServer`. It simply accepts a path for a logback configuration file as a command line argument, and runs the given configuration. While our example is somewhat trivial, keep in mind that you can configure logback's `ServerSocketReceiver` (or `SSLServerSocketReceiver`) component in *any* application.

From a shell in the *logback-examples* directory, we can run our example server application as follows:

java -Dport=6000 [chapters.receivers.socket.ReceiverExample](http://logback.qos.ch/xref/chapters/receivers/socket/ReceiverExample.html) \       src/main/java/chapters/receivers/socket/receiver1.xml

We can connect to the running receiver using a client application that is configured with a `SocketAppender`. Our example client application simply loads a logback configuration that will connect a socket appender to our example receiver. It then awaits input from the user in the form of a message that will be relayed to the receiver. We can run the example client application as follows:

java -Dhost=localhost -Dport=6000 \      [chapters.receivers.socket.AppenderExample ](http://logback.qos.ch/xref/chapters/receivers/socket/AppenderExample.html)\      src/main/java/chapters/receivers/socket/appender1.xml

### Using SSLServerSocketReceiver

The following configuration repeats the same minimal appender and logger configuration, but uses the SSL-enabled receiver component that acts in the server role.

Example: Basic SSLServerSocketReceiver Configuration (logback-examples/src/main/resources/chapters/receivers/socket/receiver2.xml)

```
<configuration debug="true">

  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger - %msg%n</pattern>
    </encoder>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="CONSOLE" />
  </root>

  <receiver class="ch.qos.logback.classic.net.server.SSLServerSocketReceiver">
    <port>${port}</port>
    <ssl>
      <keyStore>
        <location>${keystore}</location>
        <password>${password}</password>
      </keyStore>
    </ssl>
  </receiver>

</configuration>
```

The essential differences between this configuration and the previous example using `ServerSocketReceiver` are the specification of `SSLServerSocketReceiver` in the *class* attribute and the presence of the nested ssl property, which is used here to specify the location and password for the key store containing the receiver's private key and certificate, using substitution variables. See [Using SSL](http://logback.qos.ch/manual/usingSSL.html) for details on configuring SSL properties for Logback components.

We can run this configuration using the same example server configuration, with just a couple of additional configuration properties:

java -Dport=6001 \      -Dkeystore=file:src/main/java/chapters/appenders/socket/ssl/keystore.jks \      -Dpassword=changeit \      chapters.receivers.socket.ReceiverExample \      src/main/java/chapters/receivers/socket/receiver2.xml

Note that the *keystore* property given on the command line specifies a file URL that identifies the location of the key store. You may also use a classpath URL as described in [Using SSL](http://logback.qos.ch/manual/usingSSL.html).

We can connect to the running receiver using a client application that is configured with a `SSLSocketAppender`. We use the sample example client application used in the previous example, with a configuration file that uses an SSL-enabled appender. We run the example as follows:

java -Dhost=localhost -Dport=6001 \      -Dtruststore=file:src/main/java/chapters/appenders/socket/ssl/truststore.jks \      -Dpassword=changeit \      chapters.receivers.socket.AppenderExample \      src/main/java/chapters/receivers/socket/appender2.xml

Note that our example is using a self-signed X.509 credential that is suitable for testing and experimentation, only. **In a production setting, you should obtain an appropriate X.509 credential to identify your SSL-enabled logback components**. See [Using SSL](http://logback.qos.ch/manual/usingSSL.html) for more information.

## Receivers that Act in the Client Role

A receiver that is configured to act in the client role initiates a connection to a remote appender. The remote appender must be a server type, such as `ServerSocketAppender`.

![img](http://logback.qos.ch/manual/images/chapters/receivers/socketReceiver.png)

Logback includes two receiver components that act in the client role; [`SocketReceiver`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SocketReceiver.html) and its SSL-enabled subtype [`SSLSocketReceiver`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SSLSocketReceiver.html). Both of these receiver components are designed to initiate a connection to a remote appender that is a `ServerSocketAppender` (or `SSLServerSocketAppender`).

The following configuration properties are supported by `SocketReceiver` subtypes:

| Property Name         | Type               | Description                                                  |
| --------------------- | ------------------ | ------------------------------------------------------------ |
| **remoteHost**        | `String`           | The hostname or address of the remote server socket appender. |
| **port**              | `int`              | The port number of the remote server socket appender.        |
| **reconnectionDelay** | `int`              | A positive integer representing the number of milliseconds to wait before attempting to reconnect after a connection failure. The default value is 30000 (30 seconds). |
| **ssl**               | `SSLConfiguration` | Supported only for `SSLSocketReceiver`, this property provides the SSL configuration that will be used for this receiver, as described in [Using SSL](http://logback.qos.ch/manual/usingSSL.html). |

### Using SocketReceiver

The configuration used for `SocketReceiver` is quite similar to the previous example that used `ServerSocketReceiver`. The differences relate to the fact that the roles of client and server are reversed; a receiver of type `SocketReceiver` is a client, and the remote appender acts as a server.

Example: Basic SocketReceiver Configuration (logback-examples/src/main/resources/chapters/receivers/socket/receiver3.xml)

```
<configuration debug="true">
    
  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">    
    <encoder>
      <pattern>%date %-5level [%thread] %logger - %message%n</pattern>
    </encoder>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="CONSOLE" />
  </root>  

  <receiver class="ch.qos.logback.classic.net.SocketReceiver">
    <remoteHost>${host}</remoteHost>
    <port>${port}</port>
    <reconnectionDelay>10000</reconnectionDelay>
  </receiver>

</configuration>
```

This configuration will cause logback to connect to a `ServerSocketAppender` running on the host and port specified by the *host* and *port* substitution variables. Logging events received from the remote appender will be logged locally (according to the configuration shown here) via a console appender.

Assuming you are in the *logback-examples/* directory, you can run this example configuration using the following command:

The example loads the configuration and then simply waits for logging events from the remote appender. If you run this example when the remote appender is not running, you'll see *connection refused* messages appearing in the log output, periodically. The receiver will periodically attempt to reconnect to the remote appender until it succeeds or until the logger context is shut down. The delay interval between attempts is configurable using the reconnectionDelay property as shown in the example configuration.

java -Dhost=localhost -Dport=6000 \      chapters.receivers.socket.ReceiverExample \      src/main/java/chapters/receivers/socket/receiver3.xml

We can provide a remote appender to which our example receiver can connect, using the same appender example used previously. The example loads a logback configuration containing a `ServerSocketAppender`, and then waits input from the user consisting of a message that will be delivered to connected receivers. We can run the example appender application as follows:

java -Dport=6000 \      chapters.receivers.socket.AppenderExample \      src/main/java/chapters/receivers/socket/appender3.xml

If you enter a message to send when the receiver is not connected, note that the message is simply discarded.

### Using SocketSSLReceiver

The configuration needed for `SSLSocketReceiver` is very similar to that used with `SocketReceiver`. The essential differences are in the class specified for the receiver and the ability to nest the ssl property to specify SSL configuration properties. The following example illustrates a basic configuration:

Example: Basic SSLSocketReceiver Configuration (logback-examples/src/main/resources/chapters/receivers/socket/receiver4.xml)

```
<configuration debug="true">

  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">    
    <encoder>
      <pattern>%date %-5level [%thread] %logger - %message%n</pattern>
    </encoder>         
  </appender>

  <root level="DEBUG">
    <appender-ref ref="CONSOLE" />
  </root>  
 
  <receiver class="ch.qos.logback.classic.net.SSLSocketReceiver">
    <remoteHost>${host}</remoteHost>
    <port>${port}</port>
    <reconnectionDelay>10000</reconnectionDelay>
    <ssl>
      <trustStore>
        <location>${truststore}</location>
        <password>${password}</password>
      </trustStore>
    </ssl>
  </receiver>

</configuration>
```

Note that the *class* attribute now specifies `SSLSocketReceiver` and that in addition to the configuration properties shown in the previous example, this configuration contains an SSL configuration specifying the location and password for a trust store that will be used in validating that the remote appender is trusted. See [Using SSL](http://logback.qos.ch/manual/usingSSL.html) for more information on configuring SSL properties.

You can run this example configuration using the following command:

java -Dhost=localhost -Dport=6001 \      -Dtruststore=file:src/main/java/chapters/appenders/socket/ssl/truststore.jks \      -Dpassword=changeit \      chapters.receivers.socket.ReceiverExample \      src/main/java/chapters/receivers/socket/receiver4.xml

Once started, the receiver attempts to connect to the specified remote appender. Assuming that the appender is not yet running, you will see a "connection refused" message appearing in the log output periodically; the receiver will periodically retry the connection to the remote appender after delaying for the period of time specified by the reconnectionDelay property.

We can provide a remote appender to which our example receiver can connect, using the same appender example used previously. The example loads a logback configuration containing a `SSLServerSocketAppender`, and then awaits input from the user consisting of a message that will be delivered to connected receivers. We can run the example appender application as follows:

java -Dport=6001 \      -Dkeystore=file:src/main/java/chapters/appenders/socket/ssl/keystore.jks \      -Dpassword=changeit \      chapters.receivers.socket.AppenderExample \      src/main/java/chapters/receivers/socket/appender4.xml

If you enter a message to send when the receiver is not connected, note that the message is simply discarded.

It is important to note once again that our example is using a self-signed X.509 credential that is suitable for testing and experimentation, only. **In a production setting, you should obtain an appropriate X.509 credential to identify your SSL-enabled logback components**. See [Using SSL](http://logback.qos.ch/manual/usingSSL.html) for more information.



<http://logback.qos.ch/manual/receivers.html>