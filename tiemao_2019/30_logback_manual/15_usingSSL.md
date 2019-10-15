# Chapter 15: Using SSL

*The whole difference between construction and creation is exactly this: that a thing constructed can only be loved after it is constructed; but a thing created is loved before it exists.*

—CHARLES DICKENS

Logback supports the use of the Secure Sockets Layer (SSL) when delivering log events from a socket-based appender to a remote receiver. When using an SSL-enabled appender and corresponding receiver, serialized logging events are delivered over a secure channel.

## SSL and Component Roles

Logback components such as appenders and receivers may act in either the server role or the client role, with respect to network connection initiation. When acting in the server role, a logback component passively listens for connections from remote client components. Conversely, a component acting in the client role initiates a connection to remote server component. For example, an appender acting in the *client* role connects to a receiver acting in the *server* role. Or a receiver acting in the *client* role connects to an appender acting in the *server* role.

The roles of the components are generally determined by the component type. For example, an `SSLServerSocketAppender` is an appender component that acts in the server role, while an `SSLSocketAppender` is an appender component that acts in the client role. Thus the developer or application administrator can configure Logback components to support the desired direction of network connection initiation.

The direction of connection initiation is significant in the context of SSL, because in SSL a server component must possess an X.509 credential to identify itself to connecting clients. A client component, when connecting to the server, uses the server's certificate to validate that the server is trusted. The developer or application administrator must be aware of the roles of Logback components, so as to properly configure the server's key store (containing the server's X.509 credential) and the client's trust store (containing self-signed root certificates used when validating server trust).

When SSL is configured for *mutual authentication*, then both the server component and the client component must possess valid X.509 credentials whose trust can be asserted by their respective peer. Mutual authentication is configured in the server component, therefore the developer or application administrator must be aware of which components are acting in the server role.

In this chapter, we use the term *server component* or simply *server* to refer to a Logback component such as an appender or receiver that is acting in the server role. We use the term *client component* or simply *client* to refer to a component that is acting in the client role.

## SSL and X.509 Certificates

In order to use SSL-enabled Logback components, you will need an X.509 credential (a private key, corresponding certificate, and CA certification chain) to identify your components that act as SSL servers. If you wish to use mutual authentication, you will also need credentials for your components that act as SSL clients.

While you can use a credential issued by a commercial certification authority (CA), you can also use a certificate issued from your own internal CA or even a self-signed certificate. The following is all that is required:

1. The server component must be configured with a key store containing the server's private key, corresponding certificate, and CA certification chain (if not using a self-signed certificate).
2. The client component must be configured with a trust store containing trusted root CA certificate(s) or the server's self-signed root certificate.

## Configuring Logback Components for SSL

The Java Secure Sockets Extension (JSSE) and Java Cryptography Architecture (JCA) which is used to implement Logback's SSL support has many configurable options, and a pluggable provider framework that allows the built-in SSL and cryptographic capabilities of the platform to be replaced or augmented. SSL-enabled Logback components provide the ability to fully specify all of the configurable aspects of the SSL engine and cryptographic providers, to meet your unique security needs.

### Basic SSL Configuration using JSSE System Properties

Fortunately, nearly all of the configurable SSL properties for SSL-enabled Logback components have reasonable defaults. In most cases all that is needed is the configuration of some JSSE system properties.

The remainder of this section describes the specific JSSE properties that are needed in most environments. See [Customizing JSSE](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#InstallationAndCustomization) in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html) for more information on setting JSSE system properties to customize JSSE.

If you're using any of Logback's SSL-enabled appender or receiver components that act in the server role (e.g. `SSLServerSocketReceiver`, `SSLServerSocketAppender`, or `SimpleSSLSocketServer`) you'll need to configure JSSE system properties that provide the location, type, and password of the key store containing a private key and certificate.

#### System Properties for Server Key Store Configuration

| Property Name                    | Description                                                  |
| -------------------------------- | ------------------------------------------------------------ |
| `javax.net.ssl.keyStore`         | Specifies a filesystem path to the file containing your server components' private key and certificate. |
| `javax.net.ssl.keyStoreType`     | Specifies the key store type. If this property is not specified, the platform's default type (JKS) is assumed. |
| `javax.net.ssl.keyStorePassword` | Specifies the password needed to access the key store.       |

See [Examples](http://logback.qos.ch/manual/usingSSL.html#Examples) below for examples of setting these system properties when starting an application that uses Logback's SSL-enabled server components.

If your server component is using a certificate that was signed by a commercial certification authority (CA), **you probably don't need to provide \*any\* SSL configuration in your applications that use SSL-enabled client components**. When using a commercially-signed certificate for your server component, simply setting the system key store properties for JVM that runs the server component is usually all that is needed.

If you are using either a self-signed server certificate or your server certificate was signed by a certification authority (CA) that is not among those whose root certificates are in the Java platform's default trust store (e.g. when your organization has its own internal certification authority), you will need to configure the JSSE system properties that provide the location, type, and password of the trust store containing your server's certificate or trusted root certificates for the certification authority (CA) that signed your server's certificate. **These properties will need to be set in each application that utilizes an SSL-enabled client component**.

#### System Properties for Client Trust Store Configuration

| Property Name                      | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| `javax.net.ssl.trustStore`         | Specifies a filesystem path to the file containing your server component's certificate or trusted root certificate(s) for the certification authority (CA) that signed the server certificate. |
| `javax.net.ssl.trustStoreType`     | Specifies the trust store type. If this property is not specified, the platform's default type (JKS) is assumed. |
| `javax.net.ssl.trustStorePassword` | Specifies the password needed to access the trust store.     |

See [Examples](http://logback.qos.ch/manual/usingSSL.html#Examples) below for examples of setting these system properties when starting an application that utilizes Logback's SSL-enabled client components.

### Advanced SSL Configuration

In certain situations, the basic SSL configuration using JSSE system properties is not adequate. For example, if you are using the `SSLServerSocketReceiver` component in a web application, you may wish to use a different credential to identify your logging server for your remote logging clients than the credential that your web server uses to identify itself to web clients. You might wish to use SSL client authentication on your logging server to ensure that only authentic and authorized remote loggers can connect. Or perhaps your organization has strict policies regarding the SSL protocols and cipher suites that may be utilized on the organization's network. For any of these needs, you will need to make use of Logback's advanced configuration options for SSL.

When configuring a Logback component that supports SSL, you specify the SSL configuration using the `ssl` property in the configuration of the component.

For example, if you wish to use `SSLServerSocketReceiver` and configure the key store properties for your logging server's credential, you could use a configuration such as the following.

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

If you wanted to use `SSLSocketAppender` in your application's Logback configuration, but did not want to change the application's default trust store using the JSSE `javax.net.ssl.trustStore` property, you could configure the appender as follows.

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

#### SSL Configuration Properties

JSSE exposes a large number of configurable options, and Logback's SSL support makes nearly all of them available for you to specify in your SSL-enabled component configuration. When using XML configuration, SSL properties are introduced to these components by nesting an <ssl> element in the component configuration. This configuration element corresponds to the [`SSLConfiguration`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/SSLConfiguration.html) class.

When configuring SSL for your components you need only configure those SSL properties for which the defaults are not adequate. Overspecifying the SSL configuration is often the cause of difficult-to-diagnose problems.

The following table describes the top-level SSL configuration properties. Many of these properties introduce additional subproperties, which are described in tables that follow after the top-level properties are described.

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

The [`KeyStoreFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/KeyStoreFactoryBean.html) specifies the configuration needed to create a [`KeyStore`](http://docs.oracle.com/javase/1.5.0/docs/api/java/security/KeyStore.html) containing X.509 credentials. The properties of this factory bean can be used in the [keyStore](http://logback.qos.ch/manual/usingSSL.html#ssl.keyStore) and [trustStore](http://logback.qos.ch/manual/usingSSL.html#ssl.trustStore) properties of the [SSL Configuration](http://logback.qos.ch/manual/usingSSL.html#SSLConfiguration).

| Property Name | Type     | Description                                                  |
| ------------- | -------- | ------------------------------------------------------------ |
| **location**  | `String` | A URL that specifies the location of the key store. Use a `file:` URL to specify the location of the keystore on a filesystem. Use a `classpath:` URL to specify a keystore than can be found on the classpath. If the URL doesn't specify a scheme, `classpath:` is assumed. |
| **password**  | `String` | Specifies the password needed to access the key store.       |
| **provider**  | `String` | Specifies the name of the JCA provider that will be used to create a `KeyStore`. The Java platform's default key store provider will be used if this property is not configured. |
| **type**      | `String` | Specifies the `KeyStore` type. See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/CryptoSpec.html#AppA) specification in the [Java Cryptography Architecture](http://docs.oracle.com/javase/1.5.0/docs/guide/security/CryptoSpec.html) specification. The Java platform's default key store type will be used if this property is not configured. |

#### Key Manager Factory Configuration

The [`KeyManagerFactoryFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/KeyManagerFactoryFactoryBean.html) specifies the configuration needed to create a [`KeyManagerFactory`](http://docs.oracle.com/javase/1.5.0/docs/api/javax/net/ssl/KeyManagerFactory.html). Generally, it isn't necessary to explicitly configure the key manager factory, as the platform's default factory is adequate for most needs.

| Property Name | Type     | Description                                                  |
| ------------- | -------- | ------------------------------------------------------------ |
| **algorithm** | `String` | Specifies the `KeyManagerFactory` algorithm name. See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#AppA) specification in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html). The Java platform's default key manager algorithm will be used if this property is not configured. |
| **provider**  | `String` | Specifies the name of the JCA provider that will be used to create a `SecureRandom` generator. The Java platform's default JSSE provider will be used if this property is not configured. |

#### Secure Random Generator Configuration

The [`SecureRandomFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/SecureRandomFactoryBean.html) specifies the configuration needed to create a [`SecureRandom`](http://docs.oracle.com/javase/1.5.0/docs/api/java/security/SecureRandom.html) generator. Generally, it isn't necessary to explicitly configure the secure random generator, as the platform's default generator is adequate for most needs.

| Property Name | Type     | Description                                                  |
| ------------- | -------- | ------------------------------------------------------------ |
| **algorithm** | `String` | Specifies the `SecureRandom` algorithm name. See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/CryptoSpec.html#AppA) specification in the [Java Cryptography Architecture](http://docs.oracle.com/javase/1.5.0/docs/guide/security/CryptoSpec.html) specification. The Java platform's default random number generation algorithm will be used if this property is not configured. |
| **provider**  | `String` | Specifies the name of the JCA provider that will be used to create a `SecureRandom` generator. The Java platform's default JSSE provider will be used if this property is not configured. |

#### SSL Parameters Configuration

The [`SSLParametersConfiguration`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/SSLParametersConfiguration.html) allows the customization of allowed SSL protocols, cipher suites, and client authentication options.

| Property Name            | Type      | Description                                                  |
| ------------------------ | --------- | ------------------------------------------------------------ |
| **excludedCipherSuites** | `String`  | Specifies a comma-separated list of SSL cipher suite names or patterns to disable during session negotiation. This property is used to filter the cipher suites supported by the SSL engine, such that any cipher suite matched by this property is disabled.Each field in the comma-separated list specified for this property may be a simple string or a regular expression.See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#AppA) specification in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html) for a list of cipher suite names. |
| **includedCipherSuites** | `String`  | Specifies a comma-separated list of SSL cipher suite names or patterns to enable during session negotiation. This property is used to filter the cipher suites supported by the SSL engine, such that only those cipher suites matched by this property are enabled.Each field in the comma-separated list specified for this property may be a simple string or a regular expression.See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#AppA) specification in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html) for a list of cipher suite names. |
| **excludedProtocols**    | `String`  | Specifies a comma-separated list of SSL protocol names or patterns to disable during session negotiation. This property is used to filter the protocols supported by the SSL engine, such that any protocol matched by this property is disabled.Each field in the comma-separated list specified for this property may be a simple string or a regular expression.See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#AppA) specification in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html) for a list of protocol names. |
| **includedProtocols**    | `String`  | Specifies a comma-separated list of SSL protocol names or patterns to enable during session negotiation. This property is used to filter the protocols supported by the SSL engine, such that only those protocols matched by this property are enabled.Each field in the comma-separated list specified for this property may be a simple string or a regular expression.See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#AppA) specification in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html) for a list of protocol names. |
| **needClientAuth**       | `boolean` | Set this property to the value `true` to configure a server to *require* a valid client certificate. This property is ignored when configured for a client component such as `SSLSocketAppender`. |
| **wantClientAuth**       | `boolean` | Set this property to the value `true` to configure the server to *request* a client certificate. This property is ignored when configured for a client component such as `SSLSocketAppender`. |

#### Trust Manager Factory Configuration

The [`TrustManagerFactoryFactoryBean`](http://logback.qos.ch/xref/ch/qos/logback/core/net/ssl/TrustManagerFactoryFactoryBean.html) specifies the configuration needed to create a [`TrustManagerFactory`](http://docs.oracle.com/javase/1.5.0/docs/api/javax/net/ssl/TrustManagerFactory.html). Generally, it isn't necessary to explicitly configure the trust manager factory, as the platform's default factory is adequate for most needs.

| Property Name | Type     | Description                                                  |
| ------------- | -------- | ------------------------------------------------------------ |
| **algorithm** | `String` | Specifies the `TrustManagerFactory` algorithm name. See the [Standard Names](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html#AppA) specification in the [JSSE Reference Guide](http://docs.oracle.com/javase/1.5.0/docs/guide/security/jsse/JSSERefGuide.html). The Java platform's default key manager algorithm will be used if this property is not configured. |
| **provider**  | `String` | Specifies the name of the JCA provider that will be used to create a `SecureRandom` generator. The Java platform's default JSSE provider will be used if this property is not configured. |

## Examples

### Using JSSE System Properties

JSSE system properties can be used to specify the location and password for a key store containing your server's X.509 credential, or to specify the location and password for a trust store containing self-signed root CA certificates used by your client components to validate server trust.

#### Specifying the Server's Key Store

When running a server component, you need to specify the location and password for the key store containing the server's credential. One way to do this is using JSSE system properties. The following example shows a command line that could be used to start the `SimpleSSLSocketServer` that is shipped with Logback.

java -DkeyStore=/etc/logback-server-keystore.jks \     -DkeyStorePassword=changeit -DkeyStoreType=JKS \     ch.qos.logback.net.SimpleSSLSocketServer 6000 /etc/logback-server-config.xml

Note that when using the JSSE *keyStore* system property, a path to the key store is specified. When specifying the location in *logback.xml*, a URL for the key store is specified.

While this example starts the standalone server application provided with Logback, the same system properties could be specified to start any application that uses an SSL-enabled Logback server component.

#### Specifying the Client's Trust Store

When using a client component, you need to specify the location and password for a trust store containing root CA certificates used for validating server trust. One way to do this is using JSSE system properties. The following example shows a command line that could be used to start an application named `com.example.MyLoggingApplication` that uses one or more of Logback's SSL-enabled client components.

java -DtrustStore=/etc/logback-client-truststore.jks \     -DtrustStorePassword=changeit -DtrustStoreType=JKS \     com.example.MyLoggingApplication

Note that when using the JSSE *trustStore* system property, a path to the key store is specified. When specifying the location in *logback.xml*, a URL for the trust store is specified.

### Creating and Using a Self-Signed Server Component Credential

To generate a self-signed certificate, you can use the *keytool* utility that is shipped with the Java Runtime Environment (JRE). The instructions below walk through the process of creating a self-signed X.509 credential in a key store for your server component and creating a trust store for use with your client components.

#### Creating the server component credential:

The following command will generate the self-signed client credential in a file named *server.keystore*.

```
keytool -genkey -alias server -dname "CN=my-logging-server" \
    -keyalg RSA -validity 365 -keystore server.keystore
Enter keystore password: <Enter password of your choosing>
Re-enter new password: <Re-enter same password>
Enter key password for <my-logging-server>
	(RETURN if same as keystore password):  <Press RETURN>
```

The name *my-logging-server* used in the *dname* may be any valid name of your choosing. You may wish to use the fully-qualified domain name of the server host. The *validity* argument specifies the number of calendar days from the present date until the credential expires.

In production settings, it is especially important to choose a strong password for the key store containing your server credential. This password protects the server's private key, preventing it from being used by an authorized party. Make note of the password, because you will need it in subsequent steps and when configuring your server.

#### Creating a trust store for client components:

For use in the configuration of your client components, the server's certificate needs to be exported from the key store created in the previous step, and imported into a trust store. The following commands will export the certificate and import it into a trust store named *server.truststore*.

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

In production settings, it is especially important to choose a strong password for the trust store that is different from the password you chose of the server key store. Make note of this password, because you will need it when configuring your appender clients.

#### Configuring the server component:

You will need to copy the *server.keystore* file into your server application's configuration. The key store can be placed with your application's classpath resources, or it may simply be placed somewhere on the server host's filesystem. When specifying the location of the key store in the configuration, you will use either a `classpath:` URL or `file:` URL, as appropriate. A example server configuration follows:

Example: Server Component Configuration

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

Note that this configuration specifies the key store password using the *server.keystore.password* substitution variable. This approach would allow you to avoid storing the password in any configuration file. For example, your application could prompt for this password on the console at startup, and then set the *server.keystore.password* as a system property using the entered password before configuring the logging system.

#### Configuring client components:

You will need to copy the *server.truststore* file into the application configuration of each application that uses an SSL-enabled component acting in the client mode. The trust store can be placed with your application's classpath resources, or it may simply be placed somewhere on the filesystem. When specifying the location of the trust store in the configuration, you will use either a `classpath:` URL or `file:` URL, as appropriate. A example appender client configuration follows:

Example: Appender Client Configuration

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

Note that this configuration specifies the trust store password using the *server.truststore.password* substitution variable. This approach would allow you to avoid storing the password in any configuration file. For example, your application could prompt for this password on the console at startup, and then set the *server.truststore.password* as a system property using the entered password before configuring the logging system.

## Auditing the SSL Configuration

In settings where secure communications are required, it is often necessary to audit the configuration of components that use SSL to validate conformance with local security policies. The SSL support in Logback addresses this need by providing detailed logging of SSL configuration when Logback is initialized. You can enable audit logging using the `debug` property in the configuration:

```
<configuration debug="true">
  
  ...
  
</configuration>
```

With the debug property enabled, all of the relevant aspects of the resulting SSL configuration will be logged when the logging system is initialized. A representative example of the information logged for SSL follows.

Example: SSL Configuration Audit Logging

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

While none of this audit logging is particularly sensitive, best practices for security would suggest that this logging should not remain enabled in production settings after the configuration has been validated. Audit logging is disabled when the `debug` property is removed or set to `false`.

## Resolving SSL Exceptions

When SSL is misconfigured, it generally results in the client and server components being unable to negotiate an agreeable session. This problem usually manifests itself as exceptions being thrown by both parties when the client attempts to connect to the server.

The content of the exception messages varies depending on whether you are looking at the client's log or the server's log. This is mostly due to inherent protocol limitations in error reporting during session negotiation. As a consequence of this fact, in order to troubleshoot session negotiation problems, you will usually want to look at the logs of both the client and the server.

### Server's Certificate is Not Available

When starting the server component, you see the following exception in the log:

*javax.net.ssl.SSLException: No available certificate or key corresponds to the SSL cipher suites which are enabled*

In most cases this means that you have not configured the location of the key store containing the server's private key and corresponding certificate.

#### Solution

Using either the [Key Store system properties](http://logback.qos.ch/manual/usingSSL.html#basicConfig.keyStore) or the [keyStore](http://logback.qos.ch/manual/usingSSL.html#ssl.keyStore) property of the server component's ssl property, you must specify the location and password for the key store containing the server's private key and certificate.

### Client Does Not Trust the Server

When the client attempts to connect to the server, you see the following exception in the log:

*javax.net.ssl.SSLHandshakeException: sun.security.validator.ValidatorException: PKIX path building failed*

This problem is the result of the server presenting a certificate the client does not trust. The most common cause is that you are using a self-signed server certificate (or a server certificate that was signed by your organization's internal certification authority) and you have not configured the client so that it references a trust store containing the server's self-signed certificate (or the trusted root certificate(s) for the CA that signed your server certificate).

This problem can also occur if your server certificate has expired or has been revoked. If you have access to the server log you will likely see the following exception logged each time the client attempts to connect:

*javax.net.ssl.SSLHandshakeException: Received fatal alert: ...*

The remainder of the exception message will usually provide a code that indicates why the client rejected the server's certificate.

| Code                  | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `certificate_unknown` | Usually indicates that the client's trust store has not been properly configured. |
| `certificate_expired` | Indicates that the server's certificate has expired and needs to be replaced. |
| `certificate_revoked` | Indicates that the issuing certification authority (CA) has revoked the server's certificate and the certificate needs to be replaced. |

#### Solutions

If the server's log message is reporting `certificate_unknown` then using either the [Trust Store system properties](http://logback.qos.ch/manual/usingSSL.html#basicConfig.trustStore) or the [trustStore](http://logback.qos.ch/manual/usingSSL.html#ssl.trustStore) property of the appender component's ssl property, you must specify the location and password for the trust store containing the server's self-signed certificate or the issuing certificate authority's root certificate.

If the server's log message is reporting `certificate_expired` or `certificate_revoked` the server needs a new certificate. The new certificate and associated private key needs to be placed in the key store specified in the server's configuration. And, if using a self-signed server certificate, the server's certificate also needs to be placed in the trust store specified in the appender client's configuration.

### Server Does Not Trust the Client

NOTE: **This problem can occur only if you have explicitly configured the server to request a client certificate (using either the [needClientAuth](http://logback.qos.ch/manual/usingSSL.html#parameters.needClientAuth) or [wantClientAuth](http://logback.qos.ch/manual/usingSSL.html#parameters.wantClientAuth) property)**.

When the client attempts to connect to the logging server, you see the following exception in the client's log:

*javax.net.ssl.SSLHandshakeException: Received fatal alert: ...*

The remainder of the exception message will usually provide a code that indicates why the server rejected the client's certificate.

| Code                  | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `certificate_unknown` | Usually indicates that the server's trust store has not been properly configured. |
| `certificate_expired` | Indicates that the client's certificate has expired and needs to be replaced. |
| `certificate_revoked` | Indicates that the issuing certification authority (CA) has revoked the client's certificate and the certificate needs to be replaced. |

#### Solutions

If the client's log message is reporting `bad_certificate` then using either the [Trust Store system properties](http://logback.qos.ch/manual/usingSSL.html#basicConfig.trustStore) or the [trustStore](http://logback.qos.ch/manual/usingSSL.html#ssl.trustStore) property of the server component's ssl property, you must specify the location and password for the trust store containing the client's self-signed certificate or the issuing certificate authority's root certificate.

If the server's log message is reporting `certificate_expired` or `certificate_revoked` the client needs a new certificate. The new certificate and associated private key needs to be placed in the key store specified in the client's configuration. And, if using a self-signed client certificate, the client's certificate also needs to be placed in the trust store specified in the servers's configuration.

### Client and Server Cannot Agree on a Protocol

NOTE: **This problem usually occurs only when you are explicitly [excluding](http://logback.qos.ch/manual/usingSSL.html#parameters.excludedProtocols) or [including](http://logback.qos.ch/manual/usingSSL.html#parameters.includedProtocols) SSL protocols in your configuration**.

When the client attempts to connect to the server, you see the following exception in the log:

*javax.net.ssl.SSLHandshakeException: Received fatal alert: handshake_failure*

The server's log message is usually more descriptive. For example:

*javax.net.ssl.SSLHandshakeException: SSLv2Hello is disabled*

Generally, this means that you have excluded a protocol from one of the peers and not the other.

#### Solution

Check the values specified for the [excludedProtocols](http://logback.qos.ch/manual/usingSSL.html#parameters.excludedProtocols) and [includedProtocols](http://logback.qos.ch/manual/usingSSL.html#parameters.includedProtocols) properties on both the server and client.

### Client and Server Cannot Agree on a Cipher Suite

NOTE: **This problem usually occurs only when you are explicitly [excluding](http://logback.qos.ch/manual/usingSSL.html#parameters.excludedCipherSuites) or [including](http://logback.qos.ch/manual/usingSSL.html#parameters.includedCipherSuites) SSL cipher suites in your configuration**.

When the client attempts to connect to the server, you see the following exception in the log:

*javax.net.ssl.SSLHandshakeException: Received fatal alert: handshake_failure*

The server's log message is usually more descriptive:

*javax.net.ssl.SSLHandshakeException: no cipher suites in common*

This means that you have configured the cipher suites on the server and client such that the intersection of their respective sets of enabled cipher suites is empty.

#### Solution

Check the values specified for the [excludedCipherSuites](http://logback.qos.ch/manual/usingSSL.html#parameters.excludedCipherSuites) and [includedCipherSuites](http://logback.qos.ch/manual/usingSSL.html#parameters.includedCipherSuites) properties on both the server and client.

<http://logback.qos.ch/manual/usingSSL.html>

