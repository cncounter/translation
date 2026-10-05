# Chapter 14: Receivers

# 第14章: Receiver

*You cannot swim for new horizons until you have courage to lose sight of the shore.*

*在鼓起勇气望不见海岸之前，你无法游向新的地平线。*

—WILLIAM FAULKNER

——威廉·福克纳

In order to run the examples in this chapter, you need to make sure that certain jar files are present on the classpath. Please refer to the [setup page](http://logback.qos.ch/setup.html) for further details.

要运行本章中的示例，需要确保 classpath 中存在某些 jar 文件。详情请参考 [setup page](http://logback.qos.ch/setup.html)。

## What is a Receiver?

## 什么是 Receiver？

A *receiver* is a Logback component that receives logging events from a remote appender and logs each received event according to local policy. Using a combination of socket-based appenders and receivers, it is possible to construct sophisticated topologies for distribution of application logging events over a network.

*Receiver*（接收器）是 Logback 的一个组件，它从远程 appender 接收日志事件，并按照本地策略记录每个收到的事件。把基于套接字(socket)的 appender 与 receiver 组合起来，可以构建复杂的拓扑结构，在网络上分发应用的日志事件。

A receiver extends the [`ch.qos.logback.classic.net.ReceiverBase`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/ReceiverBase.html) class. By virtue of the fact that a receiver extends this class, a receiver participates in the Logback component [LifeCycle](http://logback.qos.ch/xref/ch/qos/logback/core/spi/LifeCycle.html) and a receiver is [ContextAware](http://logback.qos.ch/xref/ch/qos/logback/core/spi/ContextAware.html).

receiver 继承自 [`ch.qos.logback.classic.net.ReceiverBase`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/ReceiverBase.html) 类。正因为继承了这个类，receiver 参与 Logback 组件的[生命周期(LifeCycle)](http://logback.qos.ch/xref/ch/qos/logback/core/spi/LifeCycle.html)，并且是 [ContextAware](http://logback.qos.ch/xref/ch/qos/logback/core/spi/ContextAware.html) 的。

Historically, support for logging event delivery over a network connection in Logback has been provided by `SocketAppender` and the corresponding `SimpleSocketServer`. The appender acts as a client, initiating a network connection to the server application, and delivering logging events via the network connection. The receiver component and corresponding appender support offers much greater flexibility.

从历史上看，Logback 通过 `SocketAppender` 与对应的 `SimpleSocketServer` 提供基于网络连接的日志事件传递。appender 充当客户端，向服务器应用发起网络连接，并通过该连接传送日志事件。receiver 组件及配套的 appender 则提供了大得多的灵活性。

A receiver component is configured in *logback.xml*, just like any other logback component. This allows the full capabilities of [Joran](http://logback.qos.ch/manual/onJoran.html) to be utilized in configuring a receiver component. Moreover, *any* application can receive logging events from remote appenders by simply configuring one or more receiver components.

receiver 组件像其他 logback 组件一样在 *logback.xml* 中配置。这使得 [Joran](http://logback.qos.ch/manual/onJoran.html) 的全部能力都可以用于配置 receiver 组件。而且，*任何*应用都可以通过简单地配置一个或多个 receiver 组件，从远程 appender 接收日志事件。

Connection initiation between an appender and a receiver can occur in either direction. A receiver can act in the role of a server, passively listening for connections from remote appender clients. Alternatively, a receiver can act in the client role, initiating a connection to a remote appender which is acting in the server role. Regardless of the respective roles of the appender and receiver, *logging events always flow from the appender towards the receiver*.

appender 与 receiver 之间建立连接的方向可以是任意的。receiver 可以充当服务器角色，被动地等待来自远程 appender 客户端的连接；也可以充当客户端角色，向充当服务器角色的远程 appender 发起连接。无论 appender 和 receiver 各自处于什么角色，*日志事件总是从 appender 流向 receiver*。

The flexibility to allow a receiver to initiate the connection to an appender is particularly useful in certain situations:

允许 receiver 向 appender 发起连接，这种灵活性在某些情况下特别有用：

- For security reasons, a central logging server may be located behind a network firewall that does not allow incoming connections. Using receiver components acting in the client role, the central logging server (inside the firewall) can initiate connections to the applications of interest (outside the firewall).
- It is often desirable for developer tools (such as IDE plugins) and enterprise management applications to have access to the logging event stream of running applications. Traditionally, Logback has supported this (for example in Logback Beagle) by requiring the recipient application (e.g. a developer tool running in an IDE) to act in the server role, passively listening for connections from a remote appender. This can prove difficult to manage, especially for tools running on a developer's workstation, which may indeed by mobile. However, such tools can now be implemented using a Logback receiver component acting in the client role, initiating a connection to a remote appender in order to receive logging events for local display, filtering, and alerting.

- 出于安全原因，中央日志服务器可能位于不允许入站连接的网络防火墙之后。使用充当客户端角色的 receiver 组件，中央日志服务器（防火墙之内）可以向相关应用（防火墙之外）发起连接。
- 开发者工具（如 IDE 插件）和企业级管理应用通常希望能访问运行中应用的日志事件流。传统上，Logback 对此的支持方式（例如 Logback Beagle）是要求接收方应用（如运行在 IDE 中的开发者工具）充当服务器角色，被动等待远程 appender 的连接。这可能难以管理，尤其是对于运行在开发者工作站（可能还是移动设备）上的工具。而现在，这类工具可以用充当客户端角色的 Logback receiver 组件来实现：向远程 appender 发起连接，接收日志事件，供本地显示、过滤和告警。

A logback configuration can include any number of receiver components acting in any combination of the server or client roles. The only restrictions are that each receiver acting in the server role must listen on a distinct port, and each receiver acting in the client role will connect to exactly one remote appender.

一个 logback 配置可以包含任意数量的 receiver 组件，服务器角色和客户端角色可以任意组合。唯一的限制是：充当服务器角色的每个 receiver 必须监听不同的端口；充当客户端角色的每个 receiver 恰好连接一个远程 appender。

## Receivers that Act in the Server Role

## 充当服务器角色的 Receiver

A receiver that is configured to act in the server role passively listens for incoming connections from remote appenders. This is functionally equivalent to using the standalone `SimpleSocketServer` application, except that by using the receiver component, *any* application that uses Logback Classic can receive logging events from remote appenders by simply configuring the receiver in *logback.xml*.

被配置为服务器角色的 receiver 会被动地等待来自远程 appender 的连接。这在功能上等同于使用独立的 `SimpleSocketServer` 应用，区别在于：使用 receiver 组件，*任何*使用 Logback Classic 的应用都只需在 *logback.xml* 中配置 receiver，就能从远程 appender 接收日志事件。

![img](http://logback.qos.ch/manual/images/chapters/receivers/serverSocketReceiver.png)

Logback includes two receiver components that act in the server role; [`ServerSocketReceiver`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/server/ServerSocketReceiver.html) and its SSL-enabled subtype [`SSLServerSocketReceiver`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/server/SSLServerSocketReceiver.html). Both of these receiver components are designed to accept connections from incoming `SocketAppender` (or `SSLSocketAppender`) clients.

Logback 提供了两个充当服务器角色的 receiver 组件：[`ServerSocketReceiver`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/server/ServerSocketReceiver.html) 及其支持 SSL 的子类型 [`SSLServerSocketReceiver`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/server/SSLServerSocketReceiver.html)。这两个 receiver 组件都设计为接受来自 `SocketAppender`（或 `SSLSocketAppender`）客户端的连接。

The `ServerSocketReceiver` components provide the following configurable properties:

`ServerSocketReceiver` 组件提供以下可配置属性：

| Property Name | Type               | Description                                                  |
| ------------- | ------------------ | ------------------------------------------------------------ |
| **address**   | `String`           | The local network interface address on which the receiver will listen. If this property is not specified, the receiver will listen on all network interfaces. |
| **port**      | `int`              | The TCP port on which the receiver will listen. If this property is not specified, a default value will be used. |
| **ssl**       | `SSLConfiguration` | Supported only for `SSLServerSocketReceiver`, this property provides the SSL configuration that will be used by the receiver, as described in [Using SSL](http://logback.qos.ch/manual/usingSSL.html). |

| 属性名 | 类型 | 说明 |
| ------------- | ------------------ | ------------------------------------------------------------ |
| **address**   | `String`           | receiver 将监听的本地网络接口地址。如果不指定该属性，receiver 将监听所有网络接口。 |
| **port**      | `int`              | receiver 将监听的 TCP 端口。如果不指定该属性，将使用默认值。 |
| **ssl**       | `SSLConfiguration` | 仅 `SSLServerSocketReceiver` 支持，该属性提供 receiver 将使用的 SSL 配置，详见 [Using SSL](http://logback.qos.ch/manual/usingSSL.html)。 |

### Using ServerSocketReceiver

### 使用 ServerSocketReceiver

The following configuration uses the `ServerSocketReceiver` component with a minimal local appender and logger configuration. Logging events received from a remote appender will be matched by the root logger and delivered to the local console appender.

下面的配置使用 `ServerSocketReceiver` 组件，外加一份最小的本地 appender 与 logger 配置。从远程 appender 收到的日志事件会被 root logger 匹配，并交给本地的 console appender。

Example: Basic ServerSocketReceiver Configuration (logback-examples/src/main/resources/chapters/receivers/socket/receiver1.xml)

示例：基本的 ServerSocketReceiver 配置 (logback-examples/src/main/resources/chapters/receivers/socket/receiver1.xml)

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

注意，receiver 组件的 *class* 属性标明了我们要使用的 receiver 子类型。本例使用的是 `ServerSocketReceiver`。

Our example server application is very similar in function and design to `SimpleSocketServer`. It simply accepts a path for a logback configuration file as a command line argument, and runs the given configuration. While our example is somewhat trivial, keep in mind that you can configure logback's `ServerSocketReceiver` (or `SSLServerSocketReceiver`) component in *any* application.

我们的示例服务器应用在功能和设计上与 `SimpleSocketServer` 非常相似。它只是接受一个 logback 配置文件路径作为命令行参数，并运行该配置。虽然本例有些简单，但请记住，你可以在*任何*应用中配置 logback 的 `ServerSocketReceiver`（或 `SSLServerSocketReceiver`）组件。

From a shell in the *logback-examples* directory, we can run our example server application as follows:

在 *logback-examples* 目录下的 shell 中，可以这样运行示例服务器应用：

java -Dport=6000 [chapters.receivers.socket.ReceiverExample](http://logback.qos.ch/xref/chapters/receivers/socket/ReceiverExample.html) \       src/main/java/chapters/receivers/socket/receiver1.xml

We can connect to the running receiver using a client application that is configured with a `SocketAppender`. Our example client application simply loads a logback configuration that will connect a socket appender to our example receiver. It then awaits input from the user in the form of a message that will be relayed to the receiver. We can run the example client application as follows:

我们可以用配置了 `SocketAppender` 的客户端应用连接到运行中的 receiver。我们的示例客户端应用只是加载一个 logback 配置，把 socket appender 连到示例 receiver 上，然后等待用户输入消息，并把消息转发给 receiver。可以这样运行示例客户端应用：

java -Dhost=localhost -Dport=6000 \      [chapters.receivers.socket.AppenderExample ](http://logback.qos.ch/xref/chapters/receivers/socket/AppenderExample.html)\      src/main/java/chapters/receivers/socket/appender1.xml

### Using SSLServerSocketReceiver

### 使用 SSLServerSocketReceiver

The following configuration repeats the same minimal appender and logger configuration, but uses the SSL-enabled receiver component that acts in the server role.

下面的配置重复了同样的最小 appender 与 logger 配置，但使用的是充当服务器角色、支持 SSL 的 receiver 组件。

Example: Basic SSLServerSocketReceiver Configuration (logback-examples/src/main/resources/chapters/receivers/socket/receiver2.xml)

示例：基本的 SSLServerSocketReceiver 配置 (logback-examples/src/main/resources/chapters/receivers/socket/receiver2.xml)

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

这个配置与前一个使用 `ServerSocketReceiver` 的示例的本质区别在于：*class* 属性指定了 `SSLServerSocketReceiver`，以及出现了嵌套的 ssl 属性——这里用它借助替换变量，指定了保存 receiver 私钥和证书的密钥库(key store)的位置和密码。为 Logback 组件配置 SSL 属性的详情请参见 [Using SSL](http://logback.qos.ch/manual/usingSSL.html)。

We can run this configuration using the same example server configuration, with just a couple of additional configuration properties:

我们可以用同样的示例服务器配置来运行它，只需附加几个配置属性：

java -Dport=6001 \      -Dkeystore=file:src/main/java/chapters/appenders/socket/ssl/keystore.jks \      -Dpassword=changeit \      chapters.receivers.socket.ReceiverExample \      src/main/java/chapters/receivers/socket/receiver2.xml

Note that the *keystore* property given on the command line specifies a file URL that identifies the location of the key store. You may also use a classpath URL as described in [Using SSL](http://logback.qos.ch/manual/usingSSL.html).

注意，命令行给出的 *keystore* 属性指定了一个文件 URL，标明密钥库的位置。你也可以使用 [Using SSL](http://logback.qos.ch/manual/usingSSL.html) 中描述的 classpath URL。

We can connect to the running receiver using a client application that is configured with a `SSLSocketAppender`. We use the sample example client application used in the previous example, with a configuration file that uses an SSL-enabled appender. We run the example as follows:

我们可以用配置了 `SSLSocketAppender` 的客户端应用连接到运行中的 receiver。我们使用与前一个示例相同的示例客户端应用，只是配置文件换成了带 SSL 的 appender。运行方式如下：

java -Dhost=localhost -Dport=6001 \      -Dtruststore=file:src/main/java/chapters/appenders/socket/ssl/truststore.jks \      -Dpassword=changeit \      chapters.receivers.socket.AppenderExample \      src/main/java/chapters/receivers/socket/appender2.xml

Note that our example is using a self-signed X.509 credential that is suitable for testing and experimentation, only. **In a production setting, you should obtain an appropriate X.509 credential to identify your SSL-enabled logback components**. See [Using SSL](http://logback.qos.ch/manual/usingSSL.html) for more information.

注意，本例使用的是自签名的 X.509 凭证，仅适用于测试和实验。**在生产环境中，你应当获取合适的 X.509 凭证来标识你的支持 SSL 的 logback 组件**。更多信息请参见 [Using SSL](http://logback.qos.ch/manual/usingSSL.html)。

## Receivers that Act in the Client Role

## 充当客户端角色的 Receiver

A receiver that is configured to act in the client role initiates a connection to a remote appender. The remote appender must be a server type, such as `ServerSocketAppender`.

被配置为客户端角色的 receiver 会向远程 appender 发起连接。远程 appender 必须是服务器类型，例如 `ServerSocketAppender`。

![img](http://logback.qos.ch/manual/images/chapters/receivers/socketReceiver.png)

Logback includes two receiver components that act in the client role; [`SocketReceiver`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SocketReceiver.html) and its SSL-enabled subtype [`SSLSocketReceiver`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SSLSocketReceiver.html). Both of these receiver components are designed to initiate a connection to a remote appender that is a `ServerSocketAppender` (or `SSLServerSocketAppender`).

Logback 提供了两个充当客户端角色的 receiver 组件：[`SocketReceiver`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SocketReceiver.html) 及其支持 SSL 的子类型 [`SSLSocketReceiver`](http://logback.qos.ch/xref/ch/qos/logback/classic/net/SSLSocketReceiver.html)。这两个 receiver 组件都设计为向作为 `ServerSocketAppender`（或 `SSLServerSocketAppender`）的远程 appender 发起连接。

The following configuration properties are supported by `SocketReceiver` subtypes:

`SocketReceiver` 子类型支持以下配置属性：

| Property Name         | Type               | Description                                                  |
| --------------------- | ------------------ | ------------------------------------------------------------ |
| **remoteHost**        | `String`           | The hostname or address of the remote server socket appender. |
| **port**              | `int`              | The port number of the remote server socket appender.        |
| **reconnectionDelay** | `int`              | A positive integer representing the number of milliseconds to wait before attempting to reconnect after a connection failure. The default value is 30000 (30 seconds). |
| **ssl**               | `SSLConfiguration` | Supported only for `SSLSocketReceiver`, this property provides the SSL configuration that will be used for this receiver, as described in [Using SSL](http://logback.qos.ch/manual/usingSSL.html). |

| 属性名                | 类型               | 说明                                                         |
| --------------------- | ------------------ | ------------------------------------------------------------ |
| **remoteHost**        | `String`           | 远程服务器套接字 appender 的主机名或地址。 |
| **port**              | `int`              | 远程服务器套接字 appender 的端口号。        |
| **reconnectionDelay** | `int`              | 一个正整数，表示连接失败后重新连接前等待的毫秒数。默认值为 30000（30 秒）。 |
| **ssl**               | `SSLConfiguration` | 仅 `SSLSocketReceiver` 支持，该属性提供此 receiver 将使用的 SSL 配置，详见 [Using SSL](http://logback.qos.ch/manual/usingSSL.html)。 |

### Using SocketReceiver

### 使用 SocketReceiver

The configuration used for `SocketReceiver` is quite similar to the previous example that used `ServerSocketReceiver`. The differences relate to the fact that the roles of client and server are reversed; a receiver of type `SocketReceiver` is a client, and the remote appender acts as a server.

`SocketReceiver` 使用的配置与前一个使用 `ServerSocketReceiver` 的示例非常相似。区别在于客户端与服务器角色对调：`SocketReceiver` 类型的 receiver 是客户端，远程 appender 则充当服务器。

Example: Basic SocketReceiver Configuration (logback-examples/src/main/resources/chapters/receivers/socket/receiver3.xml)

示例：基本的 SocketReceiver 配置 (logback-examples/src/main/resources/chapters/receivers/socket/receiver3.xml)

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

该配置会让 logback 连接到由 *host* 和 *port* 替换变量指定的主机和端口上运行的 `ServerSocketAppender`。从远程 appender 收到的日志事件会按照这里展示的配置，通过 console appender 在本地记录。

Assuming you are in the *logback-examples/* directory, you can run this example configuration using the following command:

假设你在 *logback-examples/* 目录下，可以用下面的命令运行这个示例配置：

The example loads the configuration and then simply waits for logging events from the remote appender. If you run this example when the remote appender is not running, you'll see *connection refused* messages appearing in the log output, periodically. The receiver will periodically attempt to reconnect to the remote appender until it succeeds or until the logger context is shut down. The delay interval between attempts is configurable using the reconnectionDelay property as shown in the example configuration.

示例会加载配置，然后只是等待来自远程 appender 的日志事件。如果在远程 appender 尚未运行时运行这个示例，你会在日志输出中定期看到 *connection refused*（连接被拒绝）消息。receiver 会周期性地尝试重新连接远程 appender，直到成功或 logger 上下文被关闭。尝试之间的时间间隔可以通过示例配置中展示的 reconnectionDelay 属性来配置。

java -Dhost=localhost -Dport=6000 \      chapters.receivers.socket.ReceiverExample \      src/main/java/chapters/receivers/socket/receiver3.xml

We can provide a remote appender to which our example receiver can connect, using the same appender example used previously. The example loads a logback configuration containing a `ServerSocketAppender`, and then waits input from the user consisting of a message that will be delivered to connected receivers. We can run the example appender application as follows:

我们可以用前面用过的同一个 appender 示例，提供一个供示例 receiver 连接的远程 appender。该示例会加载包含 `ServerSocketAppender` 的 logback 配置，然后等待用户输入消息，消息将被传送给已连接的 receiver。可以这样运行示例 appender 应用：

java -Dport=6000 \      chapters.receivers.socket.AppenderExample \      src/main/java/chapters/receivers/socket/appender3.xml

If you enter a message to send when the receiver is not connected, note that the message is simply discarded.

注意，如果在 receiver 未连接时输入要发送的消息，消息会被直接丢弃。

### Using SocketSSLReceiver

### 使用 SSLSocketReceiver

The configuration needed for `SSLSocketReceiver` is very similar to that used with `SocketReceiver`. The essential differences are in the class specified for the receiver and the ability to nest the ssl property to specify SSL configuration properties. The following example illustrates a basic configuration:

`SSLSocketReceiver` 所需的配置与 `SocketReceiver` 使用的非常相似。本质区别在于 receiver 指定的类，以及可以嵌套 ssl 属性来指定 SSL 配置属性。下面的示例展示了一个基本配置：

Example: Basic SSLSocketReceiver Configuration (logback-examples/src/main/resources/chapters/receivers/socket/receiver4.xml)

示例：基本的 SSLSocketReceiver 配置 (logback-examples/src/main/resources/chapters/receivers/socket/receiver4.xml)

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

注意，*class* 属性现在指定的是 `SSLSocketReceiver`；除了前一个示例展示的配置属性之外，这个配置还包含 SSL 配置，用于指定信任库(trust store)的位置和密码，该信任库用来校验远程 appender 是否可信。配置 SSL 属性的更多信息请参见 [Using SSL](http://logback.qos.ch/manual/usingSSL.html)。

You can run this example configuration using the following command:

可以用下面的命令运行这个示例配置：

java -Dhost=localhost -Dport=6001 \      -Dtruststore=file:src/main/java/chapters/appenders/socket/ssl/truststore.jks \      -Dpassword=changeit \      chapters.receivers.socket.ReceiverExample \      src/main/java/chapters/receivers/socket/receiver4.xml

Once started, the receiver attempts to connect to the specified remote appender. Assuming that the appender is not yet running, you will see a "connection refused" message appearing in the log output periodically; the receiver will periodically retry the connection to the remote appender after delaying for the period of time specified by the reconnectionDelay property.

启动之后，receiver 会尝试连接指定的远程 appender。假设该 appender 尚未运行，你会在日志输出中定期看到 "connection refused" 消息；receiver 会按 reconnectionDelay 属性指定的时间间隔延迟之后，周期性地重试连接远程 appender。

We can provide a remote appender to which our example receiver can connect, using the same appender example used previously. The example loads a logback configuration containing a `SSLServerSocketAppender`, and then awaits input from the user consisting of a message that will be delivered to connected receivers. We can run the example appender application as follows:

我们可以用前面用过的同一个 appender 示例，提供一个供示例 receiver 连接的远程 appender。该示例会加载包含 `SSLServerSocketAppender` 的 logback 配置，然后等待用户输入消息，消息将被传送给已连接的 receiver。可以这样运行示例 appender 应用：

java -Dport=6001 \      -Dkeystore=file:src/main/java/chapters/appenders/socket/ssl/keystore.jks \      -Dpassword=changeit \      chapters.receivers.socket.AppenderExample \      src/main/java/chapters/receivers/socket/appender4.xml

If you enter a message to send when the receiver is not connected, note that the message is simply discarded.

注意，如果在 receiver 未连接时输入要发送的消息，消息会被直接丢弃。

It is important to note once again that our example is using a self-signed X.509 credential that is suitable for testing and experimentation, only. **In a production setting, you should obtain an appropriate X.509 credential to identify your SSL-enabled logback components**. See [Using SSL](http://logback.qos.ch/manual/usingSSL.html) for more information.

需要再次强调，本例使用的是自签名的 X.509 凭证，仅适用于测试和实验。**在生产环境中，你应当获取合适的 X.509 凭证来标识你的支持 SSL 的 logback 组件**。更多信息请参见 [Using SSL](http://logback.qos.ch/manual/usingSSL.html)。



<http://logback.qos.ch/manual/receivers.html>
