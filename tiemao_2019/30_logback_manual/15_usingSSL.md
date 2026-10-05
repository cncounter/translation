# Chapter 15: Using SSL

# 第15章: 使用SSL

*The whole difference between construction and creation is exactly this: that a thing constructed can only be loved after it is constructed; but a thing created is loved before it exists.*

—CHARLES DICKENS

*构造与创造的全部区别正在于此：被构造之物，只有在被构造出来之后才能被爱；而被创造之物，在它存在之前就已经被爱了。*

—— CHARLES DICKENS（查尔斯·狄更斯）

Logback supports the use of the Secure Sockets Layer (SSL) when delivering log events from a socket-based appender to a remote receiver. When using an SSL-enabled appender and corresponding receiver, serialized logging events are delivered over a secure channel.

Logback 支持在基于 socket 的 appender 向远程接收方传递日志事件时使用安全套接字层（SSL）。当使用启用 SSL 的 appender 及对应的 receiver 时，序列化后的日志事件会通过安全通道传递。

## SSL and Component Roles

## SSL 与组件角色

Logback components such as appenders and receivers may act in either the server role or the client role, with respect to network connection initiation. When acting in the server role, a logback component passively listens for connections from remote client components. Conversely, a component acting in the client role initiates a connection to remote server component. For example, an appender acting in the *client* role connects to a receiver acting in the *server* role. Or a receiver acting in the *client* role connects to an appender acting in the *server* role.

就网络连接的发起方式而言，appender、receiver 等 Logback 组件既可以扮演服务器角色，也可以扮演客户端角色。当组件扮演服务器角色时，它会被动监听来自远程客户端组件的连接；反过来，扮演客户端角色的组件则会主动向远程服务器组件发起连接。例如，扮演*客户端*角色的 appender 会连接到扮演*服务器*角色的 receiver；或者扮演*客户端*角色的 receiver 会连接到扮演*服务器*角色的 appender。

The roles of the components are generally determined by the component type. For example, an `SSLServerSocketAppender` is an appender component that acts in the server role, while an `SSLSocketAppender` is an appender component that acts in the client role. Thus the developer or application administrator can configure Logback components to support the desired direction of network connection initiation.

组件的角色通常由组件类型决定。例如，`SSLServerSocketAppender` 是扮演服务器角色的 appender 组件，而 `SSLSocketAppender` 则是扮演客户端角色的 appender 组件。因此，开发者或应用管理员可以通过配置 Logback 组件，来支持期望的网络连接发起方向。

The direction of connection initiation is significant in the context of SSL, because in SSL a server component must possess an X.509 credential to identify itself to connecting clients. A client component, when connecting to the server, uses the server's certificate to validate that the server is trusted. The developer or application administrator must be aware of the roles of Logback components, so as to properly configure the server's key store (containing the server's X.509 credential) and the client's trust store (containing self-signed root certificates used when validating server trust).

在 SSL 的场景下，连接发起的方向十分重要，因为 SSL 中的服务器组件必须持有 X.509 凭证，用于向连接上来的客户端证明自己的身份。客户端组件在连接服务器时，会使用服务器的证书来验证服务器是否可信。开发者或应用管理员必须清楚各 Logback 组件的角色，才能正确配置服务器的密钥库（key store，其中保存服务器的 X.509 凭证）以及客户端的信任库（trust store，其中保存验证服务器可信性时所使用的自签名根证书）。

When SSL is configured for *mutual authentication*, then both the server component and the client component must possess valid X.509 credentials whose trust can be asserted by their respective peer. Mutual authentication is configured in the server component, therefore the developer or application administrator must be aware of which components are acting in the server role.

当 SSL 配置为*双向认证*（mutual authentication）时，服务器组件和客户端组件都必须持有有效的 X.509 凭证，且其可信性能被对方确认。双向认证是在服务器组件中配置的，因此开发者或应用管理员必须清楚哪些组件扮演服务器角色。

In this chapter, we use the term *server component* or simply *server* to refer to a Logback component such as an appender or receiver that is acting in the server role. We use the term *client component* or simply *client* to refer to a component that is acting in the client role.

在本章中，我们用术语*服务器组件*（server component）或简称*服务器*（server）来指代扮演服务器角色的 Logback 组件（如 appender 或 receiver）；用*客户端组件*（client component）或简称*客户端*（client）来指代扮演客户端角色的组件。

## SSL and X.509 Certificates

## SSL 与 X.509 证书

In order to use SSL-enabled Logback components, you will need an X.509 credential (a private key, corresponding certificate, and CA certification chain) to identify your components that act as SSL servers. If you wish to use mutual authentication, you will also need credentials for your components that act as SSL clients.

要使用启用 SSL 的 Logback 组件，你需要一份 X.509 凭证（私钥、对应的证书以及 CA 证书链），用于标识扮演 SSL 服务器的组件。如果要使用双向认证，还需要为扮演 SSL 客户端的组件准备凭证。

While you can use a credential issued by a commercial certification authority (CA), you can also use a certificate issued from your own internal CA or even a self-signed certificate. The following is all that is required:

你可以使用商业认证机构（CA）签发的凭证，也可以使用自己内部 CA 签发的证书，甚至自签名证书。需要的所有条件如下：

1. The server component must be configured with a key store containing the server's private key, corresponding certificate, and CA certification chain (if not using a self-signed certificate).
2. The client component must be configured with a trust store containing trusted root CA certificate(s) or the server's self-signed root certificate.

1. 服务器组件必须配置密钥库，其中包含服务器的私钥、对应的证书以及 CA 证书链（如果未使用自签名证书）。
2. 客户端组件必须配置信任库，其中包含受信任的根 CA 证书，或服务器自己的自签名根证书。

## Configuring Logback Components for SSL

## 为 Logback 组件配置 SSL

The Java Secure Sockets Extension (JSSE) and Java Cryptography Architecture (JCA) which is used to implement Logback's SSL support has many configurable options, and a pluggable provider framework that allows the built-in SSL and cryptographic capabilities of the platform to be replaced or augmented. SSL-enabled Logback components provide the ability to fully specify all of the configurable aspects of the SSL engine and cryptographic providers, to meet your unique security needs.

Logback 的 SSL 支持建立在 JSSE（Java 安全套接字扩展）和 JCA（Java 密码体系结构）之上，二者提供了大量可配置选项，以及一个可插拔的 provider 框架，允许替换或扩充平台内置的 SSL 与密码学能力。启用 SSL 的 Logback 组件支持完整指定 SSL 引擎和密码学 provider 的所有可配置项，以满足你独特的安全需求。

### Basic SSL Configuration using JSSE System Properties

### 使用 JSSE 系统属性进行基本 SSL 配置

Fortunately, nearly all of the configurable SSL properties for SSL-enabled Logback components have reasonable defaults. In most cases all that is needed is the configuration of some JSSE system properties.

所幸，启用 SSL 的 Logback 组件的几乎所有 SSL 配置项都有合理的默认值。在大多数情况下，只需设置一些 JSSE 系统属性即可。

The remainder of this section describes the specific JSSE properties that are needed in most environments. See [Customizing JSSE](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#InstallationAndCustomization) in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html) for more information on setting JSSE system properties to customize JSSE.

本节余下部分将介绍大多数环境下需要的具体 JSSE 属性。关于如何设置 JSSE 系统属性来自定义 JSSE 的更多信息，请参阅 [JSSE 参考指南](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html)中的 [Customizing JSSE](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#InstallationAndCustomization) 一节。

If you're using any of Logback's SSL-enabled appender or receiver components that act in the server role (e.g. `SSLServerSocketReceiver`, `SSLServerSocketAppender`, or `SimpleSSLSocketServer`) you'll need to configure JSSE system properties that provide the location, type, and password of the key store containing a private key and certificate.

如果你使用了任何扮演服务器角色的、启用 SSL 的 Logback appender 或 receiver 组件（例如 `SSLServerSocketReceiver`、`SSLServerSocketAppender` 或 `SimpleSSLSocketServer`），就需要设置 JSSE 系统属性，以提供包含私钥和证书的密钥库的位置、类型和密码。

#### System Properties for Server Key Store Configuration

#### 服务器密钥库配置相关的系统属性

| Property Name                    | Description                                                  |
| -------------------------------- | ------------------------------------------------------------ |
| `javax.net.ssl.keyStore`         | Specifies a filesystem path to the file containing your server components' private key and certificate. |
| `javax.net.ssl.keyStoreType`     | Specifies the key store type. If this property is not specified, the platform's default type (JKS) is assumed. |
| `javax.net.ssl.keyStorePassword` | Specifies the password needed to access the key store.       |

See [Examples](http://logback.qos.ch/manual/usingSSL.html#Examples) below for examples of setting these system properties when starting an application that uses Logback's SSL-enabled server components.

在启动使用 Logback SSL 服务器组件的应用时如何设置这些系统属性，示例请参见下文[示例](http://logback.qos.ch/manual/usingSSL.html#Examples)一节。

If your server component is using a certificate that was signed by a commercial certification authority (CA), **you probably don't need to provide \*any\* SSL configuration in your applications that use SSL-enabled client components**. When using a commercially-signed certificate for your server component, simply setting the system key store properties for JVM that runs the server component is usually all that is needed.

如果你的服务器组件使用的是商业认证机构（CA）签发的证书，**那么在使用 SSL 客户端组件的应用中，你很可能不需要提供*任何* SSL 配置**。服务器组件使用商业机构签发的证书时，通常只需为运行服务器组件的 JVM 设置系统密钥库属性即可。

If you are using either a self-signed server certificate or your server certificate was signed by a certification authority (CA) that is not among those whose root certificates are in the Java platform's default trust store (e.g. when your organization has its own internal certification authority), you will need to configure the JSSE system properties that provide the location, type, and password of the trust store containing your server's certificate or trusted root certificates for the certification authority (CA) that signed your server's certificate. **These properties will need to be set in each application that utilizes an SSL-enabled client component**.

如果你使用的是自签名的服务器证书，或者你的服务器证书是由某个 CA 签发的、而该 CA 的根证书并不在 Java 平台默认信任库中（例如你的组织拥有自己的内部认证机构），那么你就需要设置 JSSE 系统属性，以提供信任库的位置、类型和密码，其中应包含服务器的证书，或签发服务器证书的认证机构（CA）的可信根证书。**在使用 SSL 客户端组件的每个应用中，都需要设置这些属性**。

#### System Properties for Client Trust Store Configuration

#### 客户端信任库配置相关的系统属性

| Property Name                      | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| `javax.net.ssl.trustStore`         | Specifies a filesystem path to the file containing your server component's certificate or trusted root certificate(s) for the certification authority (CA) that signed the server certificate. |
| `javax.net.ssl.trustStoreType`     | Specifies the trust store type. If this property is not specified, the platform's default type (JKS) is assumed. |
| `javax.net.ssl.trustStorePassword` | Specifies the password needed to access the trust store.     |

See [Examples](http://logback.qos.ch/manual/usingSSL.html#Examples) below for examples of setting these system properties when starting an application that utilizes Logback's SSL-enabled client components.

在启动使用 Logback SSL 客户端组件的应用时如何设置这些系统属性，示例请参见下文[示例](http://logback.qos.ch/manual/usingSSL.html#Examples)一节。

### Advanced SSL Configuration

### 高级 SSL 配置

In certain situations, the basic SSL configuration using JSSE system properties is not adequate. For example, if you are using the `SSLServerSocketReceiver` component in a web application, you may wish to use a different credential to identify your logging server for your remote logging clients than the credential that your web server uses to identify itself to web clients. You might wish to use SSL client authentication on your logging server to ensure that only authentic and authorized remote loggers can connect. Or perhaps your organization has strict policies regarding the SSL protocols and cipher suites that may be utilized on the organization's network. For any of these needs, you will need to make use of Logback's advanced configuration options for SSL.

在某些情况下，使用 JSSE 系统属性的基本 SSL 配置并不能满足需求。例如，如果你在 web 应用中使用 `SSLServerSocketReceiver` 组件，可能希望用另一份凭证（而非 web 服务器向 web 客户端表明身份时所用的那一份）来向远程日志客户端标识你的日志服务器。你可能希望在日志服务器上启用 SSL 客户端认证，以确保只有真实且经过授权的远程 logger 才能连接。又或者，你的组织对网络上可以使用的 SSL 协议和密码套件有严格的政策。无论哪种需求，你都需要使用 Logback 提供的 SSL 高级配置选项。

When configuring a Logback component that supports SSL, you specify the SSL configuration using the `ssl` property in the configuration of the component.

在配置支持 SSL 的 Logback 组件时，可以在该组件的配置中使用 `ssl` 属性来指定 SSL 配置。

For example, if you wish to use `SSLServerSocketReceiver` and configure the key store properties for your logging server's credential, you could use a configuration such as the following.

例如，如果你想使用 `SSLServerSocketReceiver`，并为日志服务器的凭证配置密钥库属性，可以使用类似下面的配置。

```
<configuration>

  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger - %msg%n</pattern>
    </encoder>
  </appender>
  
  <root level="debug">
    <appender-ref ref="CONSOLE" />
  </root>

  <receiver class="ch.qos.logback.classic.net.server.SSLServerSocketReceiver">
    <ssl>
      <keyStore>
        <location>classpath:/logging-server-keystore.jks</location>
        <password>changeit</password>
      </keyStore>
    </ssl>
  </receiver> 

</configuration>
```

This configuration specifies the location of the key store as *logging-server-keystore.jks* at the root of the application's classpath. You could alternatively specify a `file:` URL to identify the location of the key store.

该配置将密钥库的位置指定为应用 classpath 根目录下的 *logging-server-keystore.jks*。你也可以改用 `file:` URL 来指定密钥库的位置。

If you wanted to use `SSLSocketAppender` in your application's Logback configuration, but did not want to change the application's default trust store using the JSSE `javax.net.ssl.trustStore` property, you could configure the appender as follows.

如果你希望在应用的 Logback 配置中使用 `SSLSocketAppender`，但又不想通过 JSSE 的 `javax.net.ssl.trustStore` 属性修改应用默认的信任库，可以像下面这样配置该 appender。

```
<configuration>
  <appender name="SOCKET" class="ch.qos.logback.classic.net.SSLSocketAppender">
    <ssl>
      <trustStore>
        <location>classpath:/logging-server-truststore.jks</location>
        <password>changeit</password>
      </trustStore>
    </ssl>
  </appender>
  
  <root level="debug">
    <appender-ref ref="SOCKET" />
  </root>

</configuration>
```

This configuration specifies the location of the trust store as *logging-server-truststore.jks* at the root of the application's classpath. You could alternatively specify a `file:` URL to identify the location of the trust store.

该配置将信任库的位置指定为应用 classpath 根目录下的 *logging-server-truststore.jks*。你也可以改用 `file:` URL 来指定信任库的位置。

#### SSL Configuration Properties

#### SSL 配置属性

JSSE exposes a large number of configurable options, and Logback's SSL support makes nearly all of them available for you to specify in your SSL-enabled component configuration. When using XML configuration, SSL properties are introduced to these components by nesting an <ssl> element in the component configuration. This configuration element corresponds to the [`SSLConfiguration`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/SSLConfiguration.html) class.

JSSE 暴露了大量可配置选项，而 Logback 的 SSL 支持几乎把所有选项都开放出来，让你可以在启用 SSL 的组件配置中指定。使用 XML 配置时，可以在组件配置中嵌套一个 `<ssl>` 元素来引入 SSL 属性。该配置元素对应 [`SSLConfiguration`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/SSLConfiguration.html) 类。

When configuring SSL for your components you need only configure those SSL properties for which the defaults are not adequate. Overspecifying the SSL configuration is often the cause of difficult-to-diagnose problems.

为组件配置 SSL 时，只需配置那些默认值不能满足需求的 SSL 属性即可。过度指定 SSL 配置往往是导致难以诊断的问题的根源。

The following table describes the top-level SSL configuration properties. Many of these properties introduce additional subproperties, which are described in tables that follow after the top-level properties are described.

下表描述了顶层的 SSL 配置属性。其中许多属性还会引入额外的子属性，将在介绍完顶层属性之后的表格中加以说明。

| Property Name           | Type                                                         | Description                                                  |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **keyManagerFactory**   | [`KeyManagerFactoryFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/KeyManagerFactoryFactoryBean.html) | Specifies the configuration used to create a [`KeyManagerFactory`](http://docs.oracle.com/javase/1.5.0/docs/api/javax/net/ssl/KeyManagerFactory.html). The Java platform's default factory will be used if this property is not configured. See [Key Manager Factory Configuration](http://logback.qos.ch/manual/usingSSL.html#KeyManagerFactoryFactoryBean) below. |
| **keyStore**            | [`KeyStoreFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/KeyStoreFactoryBean.html) | Specifies the configuration used to create a [`KeyStore`](http://docs.oracle.com/javase/1.5.0/docs/api/java/security/KeyStore.html). The KeyStore created by this property should contain a single X.509 credential (consisting of a private key, corresponding certificate, and CA certificate chain). This credential is presented by the local SSL peer to the remote SSL peer.When configuring an SSL client (e.g. `SSLSocketAppender`), the keyStore property is needed only if the remote peer is configured to require client authentication.When configuring an SSL server (e.g. `SimpleSSLSocketServer`) the keyStore property specifies the key store containing the server's credential. If this property is not configured, the JSSE's `javax.net.ssl.keyStore` system property must be configured to provide the location of the server's key store. See [Customizing JSSE](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#InstallationAndCustomization) in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html) for more information on setting JSSE system properties.See [Key Store Configuration](http://logback.qos.ch/manual/usingSSL.html#KeyStoreFactoryBean) below. |
| **parameters**          | [`SSLParametersConfiguration`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/SSLParametersConfiguration.html) | Specifies various parameters used in SSL session negotiation. See [SSL Parameters Configuration](http://logback.qos.ch/manual/usingSSL.html#SSLParametersConfiguration) below. |
| **protocol**            | `String`                                                     | Specifies the SSL protocol that will be used to create an [`SSLContext`](http://docs.oracle.com/javase/1.5.0/docs/api/javax/net/ssl/SSLContext.html). See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#AppA) specification in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html). The Java platform's default protocol will be used if this property is not configured. |
| **provider**            | `String`                                                     | Specifies the name of the JSSE provider that will be used to create an [`SSLContext`](http://docs.oracle.com/javase/1.5.0/docs/api/javax/net/ssl/SSLContext.html). The Java platform's default JSSE provider will be used if this property is not configured. |
| **secureRandom**        | [`SecureRandomFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/SecureRandomFactoryBean.html) | Specifies the configuration used to create a [`SecureRandom`](http://docs.oracle.com/javase/1.5.0/docs/api/java/security/SecureRandom.html) — a secure random number generator. The Java platform's default generator will be used if this property is not configured. See [Secure Random Generator Configuration](http://logback.qos.ch/manual/usingSSL.html#SecureRandomFactoryBean) below. |
| **trustManagerFactory** | [`TrustManagerFactoryFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/TrustManagerFactoryFactoryBean.html) | Specifies the configuration used to create a [`TrustManagerFactory`](http://docs.oracle.com/javase/1.5.0/docs/api/javax/net/ssl/TrustManagerFactory.html). The Java platform's default factory will be used if this property is not configured. See [Trust Manager Factory](http://logback.qos.ch/manual/usingSSL.html#TrustManagerFactoryFactoryBean) below. |
| **trustStore**          | [`KeyStoreFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/KeyStoreFactoryBean.html) | Specifies the configuration used to create a [`KeyStore`](http://docs.oracle.com/javase/1.5.0/docs/api/java/security/KeyStore.html) used for validating identity of the remote SSL peer. The KeyStore created by this property should contain one or more *trust anchors* — self-signed certificates marked as "trusted" in the keystore. Typically, the trust store contains self-signed CA certificates.The trust store specified by this property overrides any trust store specified by the JSSE's `javax.net.ssl.trustStore` system property and the platform's default trust store.See [Customizing JSSE](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#InstallationAndCustomization) in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html) for more information on setting JSSE system properties. |

#### Key Store Configuration

#### 密钥库（Key Store）配置

The [`KeyStoreFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/KeyStoreFactoryBean.html) specifies the configuration needed to create a [`KeyStore`](http://docs.oracle.com/javase/1.5.0/docs/api/java/security/KeyStore.html) containing X.509 credentials. The properties of this factory bean can be used in the [keyStore](http://logback.qos.ch/manual/usingSSL.html#ssl.keyStore) and [trustStore](http://logback.qos.ch/manual/usingSSL.html#ssl.trustStore) properties of the [SSL Configuration](http://logback.qos.ch/manual/usingSSL.html#SSLConfiguration).

[`KeyStoreFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/KeyStoreFactoryBean.html) 指定了创建包含 X.509 凭证的 [`KeyStore`](http://docs.oracle.com/javase/1.5.0/docs/api/java/security/KeyStore.html) 所需的配置。该工厂 bean 的属性可用于 [SSL 配置](http://logback.qos.ch/manual/usingSSL.html#SSLConfiguration)的 [keyStore](http://logback.qos.ch/manual/usingSSL.html#ssl.keyStore) 与 [trustStore](http://logback.qos.ch/manual/usingSSL.html#ssl.trustStore) 属性中。

| Property Name | Type     | Description                                                  |
| ------------- | -------- | ------------------------------------------------------------ |
| **location**  | `String` | A URL that specifies the location of the key store. Use a `file:` URL to specify the location of the keystore on a filesystem. Use a `classpath:` URL to specify a keystore than can be found on the classpath. If the URL doesn't specify a scheme, `classpath:` is assumed. |
| **password**  | `String` | Specifies the password needed to access the key store.       |
| **provider**  | `String` | Specifies the name of the JCA provider that will be used to create a `KeyStore`. The Java platform's default key store provider will be used if this property is not configured. |
| **type**      | `String` | Specifies the `KeyStore` type. See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/CryptoSpec.html#AppA) specification in the [Java Cryptography Architecture](http://docs.oracle.com/javase/1.5.0/docs/guide/security/CryptoSpec.html) specification. The Java platform's default key store type will be used if this property is not configured. |

#### Key Manager Factory Configuration

#### 密钥管理器工厂（Key Manager Factory）配置

The [`KeyManagerFactoryFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/KeyManagerFactoryFactoryBean.html) specifies the configuration needed to create a [`KeyManagerFactory`](http://docs.oracle.com/javase/1.5.0/docs/api/javax/net/ssl/KeyManagerFactory.html). Generally, it isn't necessary to explicitly configure the key manager factory, as the platform's default factory is adequate for most needs.

[`KeyManagerFactoryFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/KeyManagerFactoryFactoryBean.html) 指定了创建 [`KeyManagerFactory`](http://docs.oracle.com/javase/1.5.0/docs/api/javax/net/ssl/KeyManagerFactory.html) 所需的配置。一般无需显式配置密钥管理器工厂，因为平台默认的工厂足以满足大多数需求。

| Property Name | Type     | Description                                                  |
| ------------- | -------- | ------------------------------------------------------------ |
| **algorithm** | `String` | Specifies the `KeyManagerFactory` algorithm name. See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#AppA) specification in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html). The Java platform's default key manager algorithm will be used if this property is not configured. |
| **provider**  | `String` | Specifies the name of the JCA provider that will be used to create a `SecureRandom` generator. The Java platform's default JSSE provider will be used if this property is not configured. |

#### Secure Random Generator Configuration

#### 安全随机数生成器配置

The [`SecureRandomFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/SecureRandomFactoryBean.html) specifies the configuration needed to create a [`SecureRandom`](http://docs.oracle.com/javase/1.5.0/docs/api/java/security/SecureRandom.html) generator. Generally, it isn't necessary to explicitly configure the secure random generator, as the platform's default generator is adequate for most needs.

[`SecureRandomFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/SecureRandomFactoryBean.html) 指定了创建 [`SecureRandom`](http://docs.oracle.com/javase/1.5.0/docs/api/java/security/SecureRandom.html) 生成器所需的配置。一般无需显式配置安全随机数生成器，因为平台默认的生成器足以满足大多数需求。

| Property Name | Type     | Description                                                  |
| ------------- | -------- | ------------------------------------------------------------ |
| **algorithm** | `String` | Specifies the `SecureRandom` algorithm name. See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/CryptoSpec.html#AppA) specification in the [Java Cryptography Architecture](http://docs.oracle.com/javase/1.5.0/docs/guide/security/CryptoSpec.html) specification. The Java platform's default random number generation algorithm will be used if this property is not configured. |
| **provider**  | `String` | Specifies the name of the JCA provider that will be used to create a `SecureRandom` generator. The Java platform's default JSSE provider will be used if this property is not configured. |

#### SSL Parameters Configuration

#### SSL 参数配置

The [`SSLParametersConfiguration`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/SSLParametersConfiguration.html) allows the customization of allowed SSL protocols, cipher suites, and client authentication options.

[`SSLParametersConfiguration`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/SSLParametersConfiguration.html) 允许自定义允许使用的 SSL 协议、密码套件以及客户端认证选项。

| Property Name            | Type      | Description                                                  |
| ------------------------ | --------- | ------------------------------------------------------------ |
| **excludedCipherSuites** | `String`  | Specifies a comma-separated list of SSL cipher suite names or patterns to disable during session negotiation. This property is used to filter the cipher suites supported by the SSL engine, such that any cipher suite matched by this property is disabled.Each field in the comma-separated list specified for this property may be a simple string or a regular expression.See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#AppA) specification in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html) for a list of cipher suite names. |
| **includedCipherSuites** | `String`  | Specifies a comma-separated list of SSL cipher suite names or patterns to enable during session negotiation. This property is used to filter the cipher suites supported by the SSL engine, such that only those cipher suites matched by this property are enabled.Each field in the comma-separated list specified for this property may be a simple string or a regular expression.See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#AppA) specification in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html) for a list of cipher suite names. |
| **excludedProtocols**    | `String`  | Specifies a comma-separated list of SSL protocol names or patterns to disable during session negotiation. This property is used to filter the protocols supported by the SSL engine, such that any protocol matched by this property is disabled.Each field in the comma-separated list specified for this property may be a simple string or a regular expression.See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#AppA) specification in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html) for a list of protocol names. |
| **includedProtocols**    | `String`  | Specifies a comma-separated list of SSL protocol names or patterns to enable during session negotiation. This property is used to filter the protocols supported by the SSL engine, such that only those protocols matched by this property are enabled.Each field in the comma-separated list specified for this property may be a simple string or a regular expression.See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#AppA) specification in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html) for a list of protocol names. |
| **needClientAuth**       | `boolean` | Set this property to the value `true` to configure a server to *require* a valid client certificate. This property is ignored when configured for a client component such as `SSLSocketAppender`. |
| **wantClientAuth**       | `boolean` | Set this property to the value `true` to configure the server to *request* a client certificate. This property is ignored when configured for a client component such as `SSLSocketAppender`. |

#### Trust Manager Factory Configuration

#### 信任管理器工厂（Trust Manager Factory）配置

The [`TrustManagerFactoryFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/TrustManagerFactoryFactoryBean.html) specifies the configuration needed to create a [`TrustManagerFactory`](http://docs.oracle.com/javase/1.5.0/docs/api/javax/net/ssl/TrustManagerFactory.html). Generally, it isn't necessary to explicitly configure the trust manager factory, as the platform's default factory is adequate for most needs.

[`TrustManagerFactoryFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/TrustManagerFactoryFactoryBean.html) 指定了创建 [`TrustManagerFactory`](http://docs.oracle.com/javase/1.5.0/docs/api/javax/net/ssl/TrustManagerFactory.html) 所需的配置。一般无需显式配置信任管理器工厂，因为平台默认的工厂足以满足大多数需求。

| Property Name | Type     | Description                                                  |
| ------------- | -------- | ------------------------------------------------------------ |
| **algorithm** | `String` | Specifies the `TrustManagerFactory` algorithm name. See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#AppA) specification in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html). The Java platform's default key manager algorithm will be used if this property is not configured. |
| **provider**  | `String` | Specifies the name of the JCA provider that will be used to create a `SecureRandom` generator. The Java platform's default JSSE provider will be used if this property is not configured. |

## Examples

## 示例

### Using JSSE System Properties

### 使用 JSSE 系统属性

JSSE system properties can be used to specify the location and password for a key store containing your server's X.509 credential, or to specify the location and password for a trust store containing self-signed root CA certificates used by your client components to validate server trust.

JSSE 系统属性可用于指定包含服务器 X.509 凭证的密钥库的位置和密码，或指定信任库的位置和密码（其中包含客户端组件用来验证服务器可信性的自签名根 CA 证书）。

#### Specifying the Server's Key Store

#### 指定服务器的密钥库

When running a server component, you need to specify the location and password for the key store containing the server's credential. One way to do this is using JSSE system properties. The following example shows a command line that could be used to start the `SimpleSSLSocketServer` that is shipped with Logback.

运行服务器组件时，需要指定包含服务器凭证的密钥库的位置和密码。方法之一是使用 JSSE 系统属性。下面的示例展示了可用于启动 Logback 自带的 `SimpleSSLSocketServer` 的命令行。

java -DkeyStore=/etc/logback-server-keystore.jks \     -DkeyStorePassword=changeit -DkeyStoreType=JKS \     ch.qos.logback.net.SimpleSSLSocketServer 6000 /etc/logback-server-config.xml

Note that when using the JSSE *keyStore* system property, a path to the key store is specified. When specifying the location in *logback.xml*, a URL for the key store is specified.

注意，使用 JSSE 的 *keyStore* 系统属性时，指定的是密钥库的路径；而在 *logback.xml* 中指定位置时，使用的则是密钥库的 URL。

While this example starts the standalone server application provided with Logback, the same system properties could be specified to start any application that uses an SSL-enabled Logback server component.

这个示例启动的是 Logback 自带的独立服务器应用，不过同样的系统属性也可以用于启动任何使用了启用 SSL 的 Logback 服务器组件的应用。

#### Specifying the Client's Trust Store

#### 指定客户端的信任库

When using a client component, you need to specify the location and password for a trust store containing root CA certificates used for validating server trust. One way to do this is using JSSE system properties. The following example shows a command line that could be used to start an application named `com.example.MyLoggingApplication` that uses one or more of Logback's SSL-enabled client components.

使用客户端组件时，需要指定信任库的位置和密码，其中包含用于验证服务器可信性的根 CA 证书。方法之一是使用 JSSE 系统属性。下面的示例展示了可用于启动应用 `com.example.MyLoggingApplication` 的命令行，该应用使用了一个或多个 Logback 的 SSL 客户端组件。

java -DtrustStore=/etc/logback-client-truststore.jks \     -DtrustStorePassword=changeit -DtrustStoreType=JKS \     com.example.MyLoggingApplication

Note that when using the JSSE *trustStore* system property, a path to the key store is specified. When specifying the location in *logback.xml*, a URL for the trust store is specified.

注意，使用 JSSE 的 *trustStore* 系统属性时，指定的是密钥库的路径；而在 *logback.xml* 中指定位置时，使用的则是信任库的 URL。

### Creating and Using a Self-Signed Server Component Credential

### 创建并使用自签名的服务器组件凭证

To generate a self-signed certificate, you can use the *keytool* utility that is shipped with the Java Runtime Environment (JRE). The instructions below walk through the process of creating a self-signed X.509 credential in a key store for your server component and creating a trust store for use with your client components.

要生成自签名证书，可以使用 JRE（Java 运行时环境）自带的 *keytool* 工具。下面的步骤演示了如何为服务器组件在密钥库中创建自签名 X.509 凭证，以及如何为客户端组件创建信任库。

#### Creating the server component credential:

#### 创建服务器组件凭证：

The following command will generate the self-signed client credential in a file named *server.keystore*.

下面的命令会在名为 *server.keystore* 的文件中生成自签名凭证。

```
keytool -genkey -alias server -dname "CN=my-logging-server" \
    -keyalg RSA -validity 365 -keystore server.keystore
Enter keystore password: <Enter password of your choosing>
Re-enter new password: <Re-enter same password>
Enter key password for <my-logging-server>
	(RETURN if same as keystore password):  <Press RETURN>
```

The name *my-logging-server* used in the *dname* may be any valid name of your choosing. You may wish to use the fully-qualified domain name of the server host. The *validity* argument specifies the number of calendar days from the present date until the credential expires.

*dname* 中使用的名称 *my-logging-server* 可以是任何你选定的有效名称，也可以使用服务器主机的完全限定域名。*validity* 参数指定了从当前日期起直到凭证失效为止的日历天数。

In production settings, it is especially important to choose a strong password for the key store containing your server credential. This password protects the server's private key, preventing it from being used by an authorized party. Make note of the password, because you will need it in subsequent steps and when configuring your server.

在生产环境中，为包含服务器凭证的密钥库选择一个强密码尤为重要。该密码保护着服务器的私钥，防止私钥被未授权方使用。请记好这个密码，因为后续步骤以及配置服务器时都需要用到它。

#### Creating a trust store for client components:

#### 为客户端组件创建信任库：

For use in the configuration of your client components, the server's certificate needs to be exported from the key store created in the previous step, and imported into a trust store. The following commands will export the certificate and import it into a trust store named *server.truststore*.

要在客户端组件的配置中使用，需要把服务器证书从上一步创建的密钥库中导出，再导入到信任库中。下面的命令会导出证书，并将其导入名为 *server.truststore* 的信任库。

```
keytool -export -rfc -alias server -keystore server.keystore \
    -file server.crt
Enter keystore password: <Enter password you chose for in previous step>

keytool -import -alias server -file server.crt -keystore server.truststore
Enter keystore password: <Enter password of your choosing>
Re-enter new password: <Re-enter same password>
Owner: CN=my-logging-server
Issuer: CN=my-logging-server
Serial number: 6e7eea40
Valid from: Sun Mar 31 07:57:29 EDT 2013 until: Mon Mar 31 07:57:29 EDT 2014

   ...

Trust this certificate? [no]:  <Enter "yes">
```

The first command exports the server's certificate (but not the server's private key) from the key store and into a file named *server.crt*. The second step creates a new trust store named *server.truststore* containing the server certificate.

第一条命令把服务器的证书（不包含服务器私钥）从密钥库导出到名为 *server.crt* 的文件中；第二步则创建了一个包含服务器证书的新信任库 *server.truststore*。

In production settings, it is especially important to choose a strong password for the trust store that is different from the password you chose of the server key store. Make note of this password, because you will need it when configuring your appender clients.

在生产环境中，为信任库选择一个不同于服务器密钥库密码的强密码尤为重要。请记好这个密码，因为在配置 appender 客户端时需要用到它。

#### Configuring the server component:

#### 配置服务器组件：

You will need to copy the *server.keystore* file into your server application's configuration. The key store can be placed with your application's classpath resources, or it may simply be placed somewhere on the server host's filesystem. When specifying the location of the key store in the configuration, you will use either a `classpath:` URL or `file:` URL, as appropriate. A example server configuration follows:

你需要把 *server.keystore* 文件复制到服务器应用的配置中。密钥库可以放在应用的 classpath 资源里，也可以直接放在服务器主机文件系统的某个位置。在配置中指定密钥库位置时，应根据情况使用 `classpath:` URL 或 `file:` URL。下面是一个服务器配置的示例：

Example: Server Component Configuration

示例：服务器组件配置

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

  <server class="ch.qos.logback.classic.net.server.SSLServerSocketReceiver">
    <ssl>
      <keyStore>
        <location>classpath:server.keystore</location>
        <password>${server.keystore.password}</password>
      </keyStore>
    </ssl>
  </server>
</configuration>
```

This example assumes that the key store is located at the root of the application's classpath.

该示例假定密钥库位于应用 classpath 的根目录下。

Note that this configuration specifies the key store password using the *server.keystore.password* substitution variable. This approach would allow you to avoid storing the password in any configuration file. For example, your application could prompt for this password on the console at startup, and then set the *server.keystore.password* as a system property using the entered password before configuring the logging system.

注意，该配置通过 *server.keystore.password* 替换变量来指定密钥库密码。这样可以避免把密码保存在任何配置文件里。例如，应用可以在启动时通过控制台提示输入该密码，然后在配置日志系统之前，把输入的密码作为 *server.keystore.password* 系统属性设置进去。

#### Configuring client components:

#### 配置客户端组件：

You will need to copy the *server.truststore* file into the application configuration of each application that uses an SSL-enabled component acting in the client mode. The trust store can be placed with your application's classpath resources, or it may simply be placed somewhere on the filesystem. When specifying the location of the trust store in the configuration, you will use either a `classpath:` URL or `file:` URL, as appropriate. A example appender client configuration follows:

你需要把 *server.truststore* 文件复制到每个使用了扮演客户端模式的 SSL 组件的应用的配置中。信任库可以放在应用的 classpath 资源里，也可以直接放在文件系统的某个位置。在配置中指定信任库位置时，应根据情况使用 `classpath:` URL 或 `file:` URL。下面是一个 appender 客户端配置的示例：

Example: Appender Client Configuration

示例：appender 客户端配置

```
<configuration debug="true">
  <appender name="SOCKET" class="ch.qos.logback.classic.net.SSLSocketAppender">
    <remoteHost>${host}</remoteHost>
    <ssl>
      <trustStore>
        <location>classpath:server.truststore</location>
        <password>${server.truststore.password}</password>
      </trustStore>
    </ssl>
  </appender>

  <root level="DEBUG">
    <appender-ref ref="SOCKET" />
  </root>
</configuration>
```

This example assumes that the trust store is located at the root of the application's classpath.

该示例假定信任库位于应用 classpath 的根目录下。

Note that this configuration specifies the trust store password using the *server.truststore.password* substitution variable. This approach would allow you to avoid storing the password in any configuration file. For example, your application could prompt for this password on the console at startup, and then set the *server.truststore.password* as a system property using the entered password before configuring the logging system.

注意，该配置通过 *server.truststore.password* 替换变量来指定信任库密码。这样可以避免把密码保存在任何配置文件里。例如，应用可以在启动时通过控制台提示输入该密码，然后在配置日志系统之前，把输入的密码作为 *server.truststore.password* 系统属性设置进去。

## Auditing the SSL Configuration

## 审计 SSL 配置

In settings where secure communications are required, it is often necessary to audit the configuration of components that use SSL to validate conformance with local security policies. The SSL support in Logback addresses this need by providing detailed logging of SSL configuration when Logback is initialized. You can enable audit logging using the `debug` property in the configuration:

在要求安全通信的环境中，通常需要审计使用 SSL 的组件的配置，以验证其是否符合本地安全策略。Logback 的 SSL 支持通过在 Logback 初始化时输出详细的 SSL 配置日志来满足这一需求。可以使用配置中的 `debug` 属性开启审计日志：

```
<configuration debug="true">
  
  ...
  
</configuration>
```

With the debug property enabled, all of the relevant aspects of the resulting SSL configuration will be logged when the logging system is initialized. A representative example of the information logged for SSL follows.

启用 debug 属性后，日志系统初始化时会把最终 SSL 配置的所有相关信息都记录下来。下面是一个有代表性的 SSL 日志输出示例。

Example: SSL Configuration Audit Logging

示例：SSL 配置审计日志

```
06:46:31,941 |-INFO in SSLServerSocketReceiver@4ef18d37 - SSL protocol 'SSL' provider 'SunJSSE version 1.6'
06:46:31,967 |-INFO in SSLServerSocketReceiver@4ef18d37 - key store of type 'JKS' provider 'SUN version 1.6': file:src/main/java/chapters/appenders/socket/ssl/keystore.jks
06:46:31,967 |-INFO in SSLServerSocketReceiver@4ef18d37 - key manager algorithm 'SunX509' provider 'SunJSSE version 1.6'
06:46:31,973 |-INFO in SSLServerSocketReceiver@4ef18d37 - secure random algorithm 'SHA1PRNG' provider 'SUN version 1.6'
06:46:32,755 |-INFO in SSLParametersConfiguration@4a6f19d5 - enabled protocol: SSLv2Hello
06:46:32,755 |-INFO in SSLParametersConfiguration@4a6f19d5 - enabled protocol: SSLv3
06:46:32,755 |-INFO in SSLParametersConfiguration@4a6f19d5 - enabled protocol: TLSv1
06:46:32,756 |-INFO in SSLParametersConfiguration@4a6f19d5 - enabled cipher suite: SSL_RSA_WITH_RC4_128_MD5
06:46:32,756 |-INFO in SSLParametersConfiguration@4a6f19d5 - enabled cipher suite: SSL_RSA_WITH_RC4_128_SHA
06:46:32,756 |-INFO in SSLParametersConfiguration@4a6f19d5 - enabled cipher suite: TLS_RSA_WITH_AES_256_CBC_SHA
```

The output shown here has been truncated for brevity's sake, but would typically include the complete list of protocols, providers, algorithms, and cipher suites, as well as the location of key store and trust store resources utilized in the configuration.

为节省篇幅，这里展示的输出做了截断，实际通常会包含协议、provider、算法和密码套件的完整列表，以及配置中用到的密钥库和信任库资源的位置。

While none of this audit logging is particularly sensitive, best practices for security would suggest that this logging should not remain enabled in production settings after the configuration has been validated. Audit logging is disabled when the `debug` property is removed or set to `false`.

虽然这些审计日志并不特别敏感，但按照安全方面的最佳实践，在配置验证完毕之后，生产环境中不应继续开启此类日志。移除 `debug` 属性或将其设为 `false` 即可关闭审计日志。

## Resolving SSL Exceptions

## 排解 SSL 异常

When SSL is misconfigured, it generally results in the client and server components being unable to negotiate an agreeable session. This problem usually manifests itself as exceptions being thrown by both parties when the client attempts to connect to the server.

当 SSL 配置有误时，通常会导致客户端和服务器组件无法协商出一个彼此认可的会话。这个问题通常表现为：当客户端尝试连接服务器时，双方都会抛出异常。

The content of the exception messages varies depending on whether you are looking at the client's log or the server's log. This is mostly due to inherent protocol limitations in error reporting during session negotiation. As a consequence of this fact, in order to troubleshoot session negotiation problems, you will usually want to look at the logs of both the client and the server.

异常消息的具体内容取决于你看的是客户端日志还是服务器日志，这主要源于会话协商期间错误报告机制固有的协议限制。因此，要排查会话协商问题，通常需要同时查看客户端和服务器两边的日志。

### Server's Certificate is Not Available

### 服务器证书不可用

When starting the server component, you see the following exception in the log:

启动服务器组件时，日志中出现如下异常：

*javax.net.ssl.SSLException: No available certificate or key corresponds to the SSL cipher suites which are enabled*

In most cases this means that you have not configured the location of the key store containing the server's private key and corresponding certificate.

大多数情况下，这意味着你没有配置包含服务器私钥和对应证书的密钥库的位置。

#### Solution

#### 解决方案

Using either the [Key Store system properties](http://logback.qos.ch/manual/usingSSL.html#basicConfig.keyStore) or the [keyStore](http://logback.qos.ch/manual/usingSSL.html#ssl.keyStore) property of the server component's ssl property, you must specify the location and password for the key store containing the server's private key and certificate.

你可以通过[密钥库系统属性](http://logback.qos.ch/manual/usingSSL.html#basicConfig.keyStore)，或服务器组件 ssl 属性中的 [keyStore](http://logback.qos.ch/manual/usingSSL.html#ssl.keyStore) 属性，指定包含服务器私钥和证书的密钥库的位置和密码。

### Client Does Not Trust the Server

### 客户端不信任服务器

When the client attempts to connect to the server, you see the following exception in the log:

当客户端尝试连接服务器时，日志中出现如下异常：

*javax.net.ssl.SSLHandshakeException: sun.security.validator.ValidatorException: PKIX path building failed*

This problem is the result of the server presenting a certificate the client does not trust. The most common cause is that you are using a self-signed server certificate (or a server certificate that was signed by your organization's internal certification authority) and you have not configured the client so that it references a trust store containing the server's self-signed certificate (or the trusted root certificate(s) for the CA that signed your server certificate).

这个问题的原因是服务器出示了客户端不信任的证书。最常见的原因是：你使用的是自签名的服务器证书（或由组织内部认证机构签发的服务器证书），但尚未配置客户端，使其引用包含服务器自签名证书（或签发服务器证书的 CA 的可信根证书）的信任库。

This problem can also occur if your server certificate has expired or has been revoked. If you have access to the server log you will likely see the following exception logged each time the client attempts to connect:

如果服务器证书已过期或已被吊销，也会出现这个问题。如果你能查看服务器日志，那么每当客户端尝试连接时，很可能会看到记录了如下异常：

*javax.net.ssl.SSLHandshakeException: Received fatal alert: ...*

The remainder of the exception message will usually provide a code that indicates why the client rejected the server's certificate.

异常消息的剩余部分通常会给出一个代码，说明客户端拒绝服务器证书的原因。

| Code                  | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `certificate_unknown` | Usually indicates that the client's trust store has not been properly configured. |
| `certificate_expired` | Indicates that the server's certificate has expired and needs to be replaced. |
| `certificate_revoked` | Indicates that the issuing certification authority (CA) has revoked the server's certificate and the certificate needs to be replaced. |

#### Solutions

#### 解决方案

If the server's log message is reporting `certificate_unknown` then using either the [Trust Store system properties](http://logback.qos.ch/manual/usingSSL.html#basicConfig.trustStore) or the [trustStore](http://logback.qos.ch/manual/usingSSL.html#ssl.trustStore) property of the appender component's ssl property, you must specify the location and password for the trust store containing the server's self-signed certificate or the issuing certificate authority's root certificate.

如果服务器的日志消息显示的是 `certificate_unknown`，那么你可以通过[信任库系统属性](http://logback.qos.ch/manual/usingSSL.html#basicConfig.trustStore)，或 appender 组件 ssl 属性中的 [trustStore](http://logback.qos.ch/manual/usingSSL.html#ssl.trustStore) 属性，指定包含服务器自签名证书或签发机构根证书的信任库的位置和密码。

If the server's log message is reporting `certificate_expired` or `certificate_revoked` the server needs a new certificate. The new certificate and associated private key needs to be placed in the key store specified in the server's configuration. And, if using a self-signed server certificate, the server's certificate also needs to be placed in the trust store specified in the appender client's configuration.

如果服务器的日志消息显示的是 `certificate_expired` 或 `certificate_revoked`，则服务器需要一张新证书。新证书及其对应的私钥需要放入服务器配置中指定的密钥库；并且，如果使用的是自签名服务器证书，还需要把服务器的证书放入 appender 客户端配置中指定的信任库。

### Server Does Not Trust the Client

### 服务器不信任客户端

NOTE: **This problem can occur only if you have explicitly configured the server to request a client certificate (using either the [needClientAuth](http://logback.qos.ch/manual/usingSSL.html#parameters.needClientAuth) or [wantClientAuth](http://logback.qos.ch/manual/usingSSL.html#parameters.wantClientAuth) property)**.

注意：**只有当你显式配置服务器去请求客户端证书（通过 [needClientAuth](http://logback.qos.ch/manual/usingSSL.html#parameters.needClientAuth) 或 [wantClientAuth](http://logback.qos.ch/manual/usingSSL.html#parameters.wantClientAuth) 属性）时，才可能出现这个问题**。

When the client attempts to connect to the logging server, you see the following exception in the client's log:

当客户端尝试连接日志服务器时，客户端日志中出现如下异常：

*javax.net.ssl.SSLHandshakeException: Received fatal alert: ...*

The remainder of the exception message will usually provide a code that indicates why the server rejected the client's certificate.

异常消息的剩余部分通常会给出一个代码，说明服务器拒绝客户端证书的原因。

| Code                  | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `certificate_unknown` | Usually indicates that the server's trust store has not been properly configured. |
| `certificate_expired` | Indicates that the client's certificate has expired and needs to be replaced. |
| `certificate_revoked` | Indicates that the issuing certification authority (CA) has revoked the client's certificate and the certificate needs to be replaced. |

#### Solutions

#### 解决方案

If the client's log message is reporting `bad_certificate` then using either the [Trust Store system properties](http://logback.qos.ch/manual/usingSSL.html#basicConfig.trustStore) or the [trustStore](http://logback.qos.ch/manual/usingSSL.html#ssl.trustStore) property of the server component's ssl property, you must specify the location and password for the trust store containing the client's self-signed certificate or the issuing certificate authority's root certificate.

如果客户端的日志消息显示的是 `bad_certificate`，那么你可以通过[信任库系统属性](http://logback.qos.ch/manual/usingSSL.html#basicConfig.trustStore)，或服务器组件 ssl 属性中的 [trustStore](http://logback.qos.ch/manual/usingSSL.html#ssl.trustStore) 属性，指定包含客户端自签名证书或签发机构根证书的信任库的位置和密码。

If the server's log message is reporting `certificate_expired` or `certificate_revoked` the client needs a new certificate. The new certificate and associated private key needs to be placed in the key store specified in the client's configuration. And, if using a self-signed client certificate, the client's certificate also needs to be placed in the trust store specified in the servers's configuration.

如果服务器的日志消息显示的是 `certificate_expired` 或 `certificate_revoked`，则客户端需要一张新证书。新证书及其对应的私钥需要放入客户端配置中指定的密钥库；并且，如果使用的是自签名客户端证书，还需要把客户端的证书放入服务器配置中指定的信任库。

### Client and Server Cannot Agree on a Protocol

### 客户端与服务器无法就协议达成一致

NOTE: **This problem usually occurs only when you are explicitly [excluding](http://logback.qos.ch/manual/usingSSL.html#parameters.excludedProtocols) or [including](http://logback.qos.ch/manual/usingSSL.html#parameters.includedProtocols) SSL protocols in your configuration**.

注意：**通常只有在配置中显式[排除](http://logback.qos.ch/manual/usingSSL.html#parameters.excludedProtocols)或[包含](http://logback.qos.ch/manual/usingSSL.html#parameters.includedProtocols)了 SSL 协议时，才会出现这个问题**。

When the client attempts to connect to the server, you see the following exception in the log:

当客户端尝试连接服务器时，日志中出现如下异常：

*javax.net.ssl.SSLHandshakeException: Received fatal alert: handshake_failure*

The server's log message is usually more descriptive. For example:

服务器的日志消息通常更有参考价值，例如：

*javax.net.ssl.SSLHandshakeException: SSLv2Hello is disabled*

Generally, this means that you have excluded a protocol from one of the peers and not the other.

一般而言，这意味着你在其中一端排除（exclude）了某个协议，而另一端没有。

#### Solution

#### 解决方案

Check the values specified for the [excludedProtocols](http://logback.qos.ch/manual/usingSSL.html#parameters.excludedProtocols) and [includedProtocols](http://logback.qos.ch/manual/usingSSL.html#parameters.includedProtocols) properties on both the server and client.

请检查服务器和客户端两端 [excludedProtocols](http://logback.qos.ch/manual/usingSSL.html#parameters.excludedProtocols) 和 [includedProtocols](http://logback.qos.ch/manual/usingSSL.html#parameters.includedProtocols) 属性所设置的值。

### Client and Server Cannot Agree on a Cipher Suite

### 客户端与服务器无法就密码套件达成一致

NOTE: **This problem usually occurs only when you are explicitly [excluding](http://logback.qos.ch/manual/usingSSL.html#parameters.excludedCipherSuites) or [including](http://logback.qos.ch/manual/usingSSL.html#parameters.includedCipherSuites) SSL cipher suites in your configuration**.

注意：**通常只有在配置中显式[排除](http://logback.qos.ch/manual/usingSSL.html#parameters.excludedCipherSuites)或[包含](http://logback.qos.ch/manual/usingSSL.html#parameters.includedCipherSuites)了 SSL 密码套件时，才会出现这个问题**。

When the client attempts to connect to the server, you see the following exception in the log:

当客户端尝试连接服务器时，日志中出现如下异常：

*javax.net.ssl.SSLHandshakeException: Received fatal alert: handshake_failure*

The server's log message is usually more descriptive:

服务器的日志消息通常更有参考价值：

*javax.net.ssl.SSLHandshakeException: no cipher suites in common*

This means that you have configured the cipher suites on the server and client such that the intersection of their respective sets of enabled cipher suites is empty.

这意味着你对服务器和客户端的密码套件所做的配置，使得双方各自启用的密码套件集合的交集为空。

#### Solution

#### 解决方案

Check the values specified for the [excludedCipherSuites](http://logback.qos.ch/manual/usingSSL.html#parameters.excludedCipherSuites) and [includedCipherSuites](http://logback.qos.ch/manual/usingSSL.html#parameters.includedCipherSuites) properties on both the server and client.

请检查服务器和客户端两端 [excludedCipherSuites](http://logback.qos.ch/manual/usingSSL.html#parameters.excludedCipherSuites) 和 [includedCipherSuites](http://logback.qos.ch/manual/usingSSL.html#parameters.includedCipherSuites) 属性所设置的值。

<http://logback.qos.ch/manual/usingSSL.html>
