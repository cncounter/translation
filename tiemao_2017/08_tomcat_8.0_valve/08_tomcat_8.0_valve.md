## The Valve Component


### Introduction

A **Valve** element represents a component that will be inserted into the request processing pipeline for the associated Catalina container ([Engine](https://tomcat.apache.org/tomcat-8.0-doc/config/engine.html), [Host](https://tomcat.apache.org/tomcat-8.0-doc/config/host.html), or [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html)). Individual Valves have distinct processing capabilities, and are described individually below.

*The description below uses the variable name $CATALINA_BASE to refer the base directory against which most relative paths are resolved. If you have not configured Tomcat for multiple instances by setting a CATALINA_BASE directory, then $CATALINA_BASE will be set to the value of $CATALINA_HOME, the directory into which you have installed Tomcat.*

### Access Logging

Access logging is performed by valves that implement **org.apache.catalina.AccessLog** interface.

#### Access Log Valve

#### Introduction

The **Access Log Valve** creates log files in the same format as those created by standard web servers. These logs can later be analyzed by standard log analysis tools to track page hit counts, user session activity, and so on. This `Valve` uses self-contained logic to write its log files, which can be automatically rolled over at midnight each day. (The essential requirement for access logging is to handle a large continuous stream of data with low overhead. This `Valve` does not use Apache Commons Logging, thus avoiding additional overhead and potentially complex configuration).

This `Valve` may be associated with any Catalina container (`Context`, `Host`, or `Engine`), and will record ALL requests processed by that container.

Some requests may be handled by Tomcat before they are passed to a container. These include redirects from /foo to /foo/ and the rejection of invalid requests. Where Tomcat can identify the `Context` that would have handled the request, the request/response will be logged in the `AccessLog`(s) associated `Context`, `Host` and `Engine`. Where Tomcat cannot identify the `Context` that would have handled the request, e.g. in cases where the URL is invalid, Tomcat will look first in the `Engine`, then the default `Host` for the `Engine` and finally the ROOT (or default) `Context` for the default `Host` for an `AccessLog` implementation. Tomcat will use the first`AccessLog` implementation found to log those requests that are rejected before they are passed to a container.

The output file will be placed in the directory given by the `directory` attribute. The name of the file is composed by concatenation of the configured `prefix`, timestamp and `suffix`. The format of the timestamp in the file name can be set using the `fileDateFormat` attribute. This timestamp will be omitted if the file rotation is switched off by setting `rotatable` to `false`.

**Warning:** If multiple AccessLogValve instances are used, they should be configured to use different output files.

If sendfile is used, the response bytes will be written asynchronously in a separate thread and the access log valve will not know how many bytes were actually written. In this case, the number of bytes that was passed to the sendfile thread for writing will be recorded in the access log valve.

#### Attributes

The **Access Log Valve** supports the following configuration attributes:


<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.valves.AccessLogValve</strong> to use the
default access log valve.</p>
</td></tr><tr><td><code>directory</code></td><td>
<p>Absolute or relative pathname of a directory in which log files
created by this valve will be placed.  If a relative path is
specified, it is interpreted as relative to $CATALINA_BASE.  If
no directory attribute is specified, the default value is "logs"
(relative to $CATALINA_BASE).</p>
</td></tr><tr><td><code>prefix</code></td><td>
<p>The prefix added to the start of each log file's name.  If not
specified, the default value is "access_log".</p>
</td></tr><tr><td><code>suffix</code></td><td>
<p>The suffix added to the end of each log file's name.  If not
specified, the default value is "" (a zero-length string),
meaning that no suffix will be added.</p>
</td></tr><tr><td><code>fileDateFormat</code></td><td>
<p>Allows a customized timestamp in the access log file name.
The file is rotated whenever the formatted timestamp changes.
The default value is <code>.yyyy-MM-dd</code>.
If you wish to rotate every hour, then set this value
to <code>.yyyy-MM-dd.HH</code>.
The date format will always be localized
using the locale <code>en_US</code>.
</p>
</td></tr><tr><td><code>rotatable</code></td><td>
<p>Flag to determine if log rotation should occur.
If set to <code>false</code>, then this file is never rotated and
<code>fileDateFormat</code> is ignored.
Default value: <code>true</code>
</p>
</td></tr><tr><td><code>renameOnRotate</code></td><td>
<p>By default for a rotatable log the active access log file name
will contain the current timestamp in <code>fileDateFormat</code>.
During rotation the file is closed and a new file with the next
timestamp in the name is created and used. When setting
<code>renameOnRotate</code> to <code>true</code>, the timestamp
is no longer part of the active log file name. Only during rotation
the file is closed and then renamed to include the timestamp.
This is similar to the behavior of most log frameworks when
doing time based rotation.
Default value: <code>false</code>
</p>
</td></tr><tr><td><code>pattern</code></td><td>
<p>A formatting layout identifying the various information fields
from the request and response to be logged, or the word
<code>common</code> or <code>combined</code> to select a
standard format.  See below for more information on configuring
this attribute.</p>
</td></tr><tr><td><code>encoding</code></td><td>
<p>Character set used to write the log file. An empty string means
to use the system default character set. Default value: use the
system default character set.
</p>
</td></tr><tr><td><code>locale</code></td><td>
<p>The locale used to format timestamps in the access log
lines. Any timestamps configured using an
explicit SimpleDateFormat pattern (<code>%{xxx}t</code>)
are formatted in this locale. By default the
default locale of the Java process is used. Switching the
locale after the AccessLogValve is initialized is not supported.
Any timestamps using the common log format
(<code>CLF</code>) are always formatted in the locale
<code>en_US</code>.
</p>
</td></tr><tr><td><code>requestAttributesEnabled</code></td><td>
<p>Set to <code>true</code> to check for the existence of request
attributes (typically set by the RemoteIpValve and similar) that should
be used to override the values returned by the request for remote
address, remote host, server port and protocol. If the attributes are
not set, or this attribute is set to <code>false</code> then the values
from the request will be used. If not set, the default value of
<code>false</code> will be used.</p>
</td></tr><tr><td><code>conditionIf</code></td><td>
<p>Turns on conditional logging. If set, requests will be
logged only if <code>ServletRequest.getAttribute()</code> is
not null. For example, if this value is set to
<code>important</code>, then a particular request will only be logged
if <code>ServletRequest.getAttribute("important") != null</code>.
The use of Filters is an easy way to set/unset the attribute
in the ServletRequest on many different requests.
</p>
</td></tr><tr><td><code>conditionUnless</code></td><td>
<p>Turns on conditional logging. If set, requests will be
logged only if <code>ServletRequest.getAttribute()</code> is
null. For example, if this value is set to
<code>junk</code>, then a particular request will only be logged
if <code>ServletRequest.getAttribute("junk") == null</code>.
The use of Filters is an easy way to set/unset the attribute
in the ServletRequest on many different requests.
</p>
</td></tr><tr><td><code>condition</code></td><td>
<p>The same as <code>conditionUnless</code>. This attribute is
provided for backwards compatibility.
</p>
</td></tr><tr><td><code>buffered</code></td><td>
<p>Flag to determine if logging will be buffered.
If set to <code>false</code>, then access logging will be written after each
request. Default value: <code>true</code>
</p>
</td></tr><tr><td><code>maxLogMessageBufferSize</code></td><td>
<p>Log message buffers are usually recycled and re-used. To prevent
excessive memory usage, if a buffer grows beyond this size it will be
discarded. The default is <code>256</code> characters. This should be
set to larger than the typical access log message size.</p>
</td></tr><tr><td><code>resolveHosts</code></td><td>
<p>This attribute is no longer supported. Use the connector
attribute <code>enableLookups</code> instead.</p>
<p>If you have <code>enableLookups</code> on the connector set to
<code>true</code> and want to ignore it, use <b>%a</b> instead of
<b>%h</b> in the value of <code>pattern</code>.</p>
</td></tr></tbody>
</table>



Values for the `pattern` attribute are made up of literal text strings, combined with pattern identifiers prefixed by the "%" character to cause replacement by the corresponding variable value from the current request and response. The following pattern codes are supported:

- **%a** - Remote IP address
- **%A** - Local IP address
- **%b** - Bytes sent, excluding HTTP headers, or '-' if zero
- **%B** - Bytes sent, excluding HTTP headers
- **%h** - Remote host name (or IP address if `enableLookups` for the connector is false)
- **%H** - Request protocol
- **%l** - Remote logical username from identd (always returns '-')
- **%m** - Request method (GET, POST, etc.)
- **%p** - Local port on which this request was received. See also `%{xxx}p` below.
- **%q** - Query string (prepended with a '?' if it exists)
- **%r** - First line of the request (method and request URI)
- **%s** - HTTP status code of the response
- **%S** - User session ID
- **%t** - Date and time, in Common Log Format
- **%u** - Remote user that was authenticated (if any), else '-'
- **%U** - Requested URL path
- **%v** - Local server name
- **%D** - Time taken to process the request, in millis
- **%T** - Time taken to process the request, in seconds
- **%F** - Time taken to commit the response, in millis
- **%I** - Current request thread name (can compare later with stacktraces)

There is also support to write information incoming or outgoing headers, cookies, session or request attributes and special timestamp formats. It is modeled after the[Apache HTTP Server](http://httpd.apache.org/) log configuration syntax. Each of them can be used multiple times with different `xxx` keys:

- **%{xxx}i** write value of incoming header with name `xxx`
- **%{xxx}o** write value of outgoing header with name `xxx`
- **%{xxx}c** write value of cookie with name `xxx`
- **%{xxx}r** write value of ServletRequest attribute with name `xxx`
- **%{xxx}s** write value of HttpSession attribute with name `xxx`
- **%{xxx}p** write local (server) port (`xxx==local`) or remote (client) port (`xxx=remote`)
- **%{xxx}t** write timestamp at the end of the request formatted using the enhanced SimpleDateFormat pattern `xxx`

All formats supported by SimpleDateFormat are allowed in `%{xxx}t`. In addition the following extensions have been added:

- **sec** - number of seconds since the epoch
- **msec** - number of milliseconds since the epoch
- **msec_frac** - millisecond fraction

These formats can not be mixed with SimpleDateFormat formats in the same format token.

Furthermore one can define whether to log the timestamp for the request start time or the response finish time:

- **begin** or prefix **begin:** chooses the request start time
- **end** or prefix **end:** chooses the response finish time

By adding multiple `%{xxx}t` tokens to the pattern, one can also log both timestamps.

The shorthand pattern `pattern="common"` corresponds to the Common Log Format defined by **'%h %l %u %t "%r" %s %b'**.

The shorthand pattern `pattern="combined"` appends the values of the `Referer` and `User-Agent` headers, each in double quotes, to the `common` pattern.

When Tomcat is operating behind a reverse proxy, the client information logged by the Access Log Valve may represent the reverse proxy, the browser or some combination of the two depending on the configuration of Tomcat and the reverse proxy. For Tomcat configuration options see [Proxies Support](#Proxies_Support) and the [Proxy How-To](https://tomcat.apache.org/tomcat-8.0-doc/proxy-howto.html). For reverse proxies that use mod_jk, see the [generic proxy](http://tomcat.apache.org/connectors-doc/generic_howto/proxy.html) documentation. For other reverse proxies, consult their documentation.

#### Extended Access Log Valve

#### Introduction

The **Extended Access Log Valve** extends the [Access Log Valve](#Access_Log_Valve) class, and so uses the same self-contained logging logic. This means it implements many of the same file handling attributes. The main difference to the standard `AccessLogValve` is that `ExtendedAccessLogValve` creates log files which conform to the Working Draft for the [Extended Log File Format](http://www.w3.org/TR/WD-logfile.html) defined by the W3C.

#### Attributes

The **Extended Access Log Valve** supports all configuration attributes of the standard [Access Log Valve.](#Access_Log_Valve) Only the values used for `className` and `pattern` differ.

<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.valves.ExtendedAccessLogValve</strong> to
use the extended access log valve.</p>
</td></tr><tr><td><code>pattern</code></td><td>
<p>A formatting layout identifying the various information fields
from the request and response to be logged.
See below for more information on configuring this attribute.</p>
</td></tr></tbody>
</table>




Values for the `pattern` attribute are made up of format tokens. Some of the tokens need an additional prefix. Possible prefixes are `c` for "client", `s` for "server", `cs` for "client to server", `sc` for "server to client" or `x` for "application specific". Furthermore some tokens are completed by an additional selector. See the [W3C specification](http://www.w3.org/TR/WD-logfile.html)for more information about the format.

The following format tokens are supported:

- **bytes** - Bytes sent, excluding HTTP headers, or '-' if zero
- **c-dns** - Remote host name (or IP address if `enableLookups` for the connector is false)
- **c-ip** - Remote IP address
- **cs-method** - Request method (GET, POST, etc.)
- **cs-uri** - Request URI
- **cs-uri-query** - Query string (prepended with a '?' if it exists)
- **cs-uri-stem** - Requested URL path
- **date** - The date in yyyy-mm-dd format for GMT
- **s-dns** - Local host name
- **s-ip** - Local IP address
- **sc-status** - HTTP status code of the response
- **time** - Time the request was served in HH:mm:ss format for GMT
- **time-taken** - Time (in seconds as floating point) taken to serve the request
- **x-threadname** - Current request thread name (can compare later with stacktraces)

For any of the `x-H(XXX)` the following method will be called from the HttpServletRequest object:

- **x-H(authType)**: getAuthType
- **x-H(characterEncoding)**: getCharacterEncoding
- **x-H(contentLength)**: getContentLength
- **x-H(locale)**: getLocale
- **x-H(protocol)**: getProtocol
- **x-H(remoteUser)**: getRemoteUser
- **x-H(requestedSessionId)**: getRequestedSessionId
- **x-H(requestedSessionIdFromCookie)**: isRequestedSessionIdFromCookie
- **x-H(requestedSessionIdValid)**: isRequestedSessionIdValid
- **x-H(scheme)**: getScheme
- **x-H(secure)**: isSecure

There is also support to write information about headers cookies, context, request or session attributes and request parameters.

- **cs(XXX)** for incoming request headers with name XXX
- **sc(XXX)** for outgoing response headers with name XXX
- **x-A(XXX)** for the servlet context attribute with name XXX
- **x-C(XXX)** for the first cookie with name XXX
- **x-O(XXX)** for a concatenation of all outgoing response headers with name XXX
- **x-P(XXX)** for the URL encoded (using UTF-8) request parameter with name XXX
- **x-R(XXX)** for the request attribute with name XXX
- **x-S(XXX)** for the session attribute with name XXX

### Access Control

#### Remote Address Filter

#### Introduction

The **Remote Address Filter** allows you to compare the IP address of the client that submitted this request against one or more *regular expressions*, and either allow the request to continue or refuse to process the request from this client. A Remote Address Filter can be associated with any Catalina container ([Engine](https://tomcat.apache.org/tomcat-8.0-doc/config/engine.html), [Host](https://tomcat.apache.org/tomcat-8.0-doc/config/host.html), or[Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html)), and must accept any request presented to this container for processing before it will be passed on.

The syntax for *regular expressions* is different than that for 'standard' wildcard matching. Tomcat uses the `java.util.regex` package. Please consult the Java documentation for details of the expressions supported.

Optionally one can append the server connector port separated with a semicolon (";") to allow different expressions for each connector.

The behavior when a request is refused can be changed to not deny but instead set an invalid `authentication` header. This is useful in combination with the context attribute `preemptiveAuthentication="true"`.

**Note:** There is a caveat when using this valve with IPv6 addresses. Format of the IP address that this valve is processing depends on the API that was used to obtain it. If the address was obtained from Java socket using Inet6Address class, its format will be `x:x:x:x:x:x:x:x`. That is, the IP address for localhost will be `0:0:0:0:0:0:0:1` instead of the more widely used `::1`. Consult your access logs for the actual value.

See also: [Remote Host Filter](#Remote_Host_Filter), [Remote IP Valve](#Remote_IP_Valve).

#### Attributes

The **Remote Address Filter** supports the following configuration attributes:


<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.valves.RemoteAddrValve</strong>.</p>
</td></tr><tr><td><code>allow</code></td><td>
<p>A regular expression (using <code>java.util.regex</code>) that the
remote client's IP address is compared to.  If this attribute
is specified, the remote address MUST match for this request to be
accepted.  If this attribute is not specified, all requests will be
accepted UNLESS the remote address matches a <code>deny</code>
pattern.</p>
</td></tr><tr><td><code>deny</code></td><td>
<p>A regular expression (using <code>java.util.regex</code>) that the
remote client's IP address is compared to.  If this attribute
is specified, the remote address MUST NOT match for this request to be
accepted.  If this attribute is not specified, request acceptance is
governed solely by the <code>allow</code> attribute.</p>
</td></tr><tr><td><code>denyStatus</code></td><td>
<p>HTTP response status code that is used when rejecting denied
request. The default value is <code>403</code>. For example,
it can be set to the value <code>404</code>.</p>
</td></tr><tr><td><code>addConnectorPort</code></td><td>
<p>Append the server connector port to the client IP address separated
with a semicolon (";"). If this is set to <code>true</code>, the
expressions configured with <code>allow</code> and
<code>deny</code> is compared against <code>ADDRESS;PORT</code>
where <code>ADDRESS</code> is the client IP address and
<code>PORT</code> is the Tomcat connector port which received the
request. The default value is <code>false</code>.</p>
</td></tr><tr><td><code>invalidAuthenticationWhenDeny</code></td><td>
<p>When a request should be denied, do not deny but instead
set an invalid <code>authentication</code> header. This only works
if the context has the attribute <code>preemptiveAuthentication="true"</code>
set. An already existing <code>authentication</code> header will not be
overwritten. In effect this will trigger authentication instead of deny
even if the application does not have a security constraint configured.</p>
<p>This can be combined with <code>addConnectorPort</code> to trigger authentication
depending on the client and the connector that is used to access an application.</p>
</td></tr></tbody>
</table>



#### Example 1

To allow access only for the clients connecting from localhost:

```
<Valve className="org.apache.catalina.valves.RemoteAddrValve"
   allow="127\.\d+\.\d+\.\d+|::1|0:0:0:0:0:0:0:1"/>
```

#### Example 2

To allow unrestricted access for the clients connecting from localhost but for all other clients only to port 8443:

```
<Valve className="org.apache.catalina.valves.RemoteAddrValve"
   addConnectorPort="true"
   allow="127\.\d+\.\d+\.\d+;\d*|::1;\d*|0:0:0:0:0:0:0:1;\d*|.*;8443"/>
```

#### Example 3

To allow unrestricted access to port 8009, but trigger basic authentication if the application is accessed on another port:

```
<Context>
  ...
  <Valve className="org.apache.catalina.valves.RemoteAddrValve"
         addConnectorPort="true"
         invalidAuthenticationWhenDeny="true"
         allow=".*;8009"/>
  <Valve className="org.apache.catalina.authenticator.BasicAuthenticator" />
  ...
</Context>
```

#### Remote Host Filter

#### Introduction

The **Remote Host Filter** allows you to compare the hostname of the client that submitted this request against one or more *regular expressions*, and either allow the request to continue or refuse to process the request from this client. A Remote Host Filter can be associated with any Catalina container ([Engine](https://tomcat.apache.org/tomcat-8.0-doc/config/engine.html), [Host](https://tomcat.apache.org/tomcat-8.0-doc/config/host.html), or [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html)), and must accept any request presented to this container for processing before it will be passed on.

The syntax for *regular expressions* is different than that for 'standard' wildcard matching. Tomcat uses the `java.util.regex` package. Please consult the Java documentation for details of the expressions supported.

Optionally one can append the server connector port separated with a semicolon (";") to allow different expressions for each connector.

The behavior when a request is refused can be changed to not deny but instead set an invalid `authentication` header. This is useful in combination with the context attribute `preemptiveAuthentication="true"`.

**Note:** This filter processes the value returned by method `ServletRequest.getRemoteHost()`. To allow the method to return proper host names, you have to enable "DNS lookups" feature on a **Connector**.

See also: [Remote Address Filter](#Remote_Address_Filter), [HTTP Connector](https://tomcat.apache.org/tomcat-8.0-doc/config/http.html) configuration.

#### Attributes

The **Remote Host Filter** supports the following configuration attributes:


<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.valves.RemoteHostValve</strong>.</p>
</td></tr><tr><td><code>allow</code></td><td>
<p>A regular expression (using <code>java.util.regex</code>) that the
remote client's hostname is compared to.  If this attribute
is specified, the remote hostname MUST match for this request to be
accepted.  If this attribute is not specified, all requests will be
accepted UNLESS the remote hostname matches a <code>deny</code>
pattern.</p>
</td></tr><tr><td><code>deny</code></td><td>
<p>A regular expression (using <code>java.util.regex</code>) that the
remote client's hostname is compared to.  If this attribute
is specified, the remote hostname MUST NOT match for this request to be
accepted.  If this attribute is not specified, request acceptance is
governed solely by the <code>allow</code> attribute.</p>
</td></tr><tr><td><code>denyStatus</code></td><td>
<p>HTTP response status code that is used when rejecting denied
request. The default value is <code>403</code>. For example,
it can be set to the value <code>404</code>.</p>
</td></tr><tr><td><code>addConnectorPort</code></td><td>
<p>Append the server connector port to the client hostname separated
with a semicolon (";"). If this is set to <code>true</code>, the
expressions configured with <code>allow</code> and
<code>deny</code> is compared against <code>HOSTNAME;PORT</code>
where <code>HOSTNAME</code> is the client hostname and
<code>PORT</code> is the Tomcat connector port which received the
request. The default value is <code>false</code>.</p>
</td></tr><tr><td><code>invalidAuthenticationWhenDeny</code></td><td>
<p>When a request should be denied, do not deny but instead
set an invalid <code>authentication</code> header. This only works
if the context has the attribute <code>preemptiveAuthentication="true"</code>
set. An already existing <code>authentication</code> header will not be
overwritten. In effect this will trigger authentication instead of deny
even if the application does not have a security constraint configured.</p>
<p>This can be combined with <code>addConnectorPort</code> to trigger authentication
depending on the client and the connector that is used to access an application.</p>
</td></tr></tbody>
</table>




### Proxies Support

#### Remote IP Valve

#### Introduction

Tomcat port of [mod_remoteip](http://httpd.apache.org/docs/trunk/mod/mod_remoteip.html), this valve replaces the apparent client remote IP address and hostname for the request with the IP address list presented by a proxy or a load balancer via a request headers (e.g. "X-Forwarded-For").

Another feature of this valve is to replace the apparent scheme (http/https), server port and `request.secure` with the scheme presented by a proxy or a load balancer via a request header (e.g. "X-Forwarded-Proto").

This Valve may be used at the `Engine`, `Host` or `Context` level as required. Normally, this Valve would be used at the `Engine` level.

If used in conjunction with Remote Address/Host valves then this valve should be defined first to ensure that the correct client IP address is presented to the Remote Address/Host valves.

**Note:** By default this valve has no effect on the values that are written into access log. The original values are restored when request processing leaves the valve and that always happens earlier than access logging. To pass the remote address, remote host, server port and protocol values set by this valve to the access log, they are put into request attributes. Publishing these values here is enabled by default, but `AccessLogValve` should be explicitly configured to use them. See documentation for `requestAttributesEnabled` attribute of `AccessLogValve`.

The names of request attributes that are set by this valve and can be used by access logging are the following:

- `org.apache.catalina.AccessLog.RemoteAddr`
- `org.apache.catalina.AccessLog.RemoteHost`
- `org.apache.catalina.AccessLog.Protocol`
- `org.apache.catalina.AccessLog.ServerPort`
- `org.apache.tomcat.remoteAddr`

#### Attributes

The **Remote IP Valve** supports the following configuration attributes:


<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.valves.RemoteIpValve</strong>.</p>
</td></tr><tr><td><code>remoteIpHeader</code></td><td>
<p>Name of the HTTP Header read by this valve that holds the list of
traversed IP addresses starting from the requesting client. If not
specified, the default of <code>x-forwarded-for</code> is used.</p>
</td></tr><tr><td><code>internalProxies</code></td><td>
<p>Regular expression (using <code>java.util.regex</code>) that a
proxy's IP address must match to be considered an internal proxy.
Internal proxies that appear in the <strong>remoteIpHeader</strong> will
be trusted and will not appear in the <strong>proxiesHeader</strong>
value. If not specified the default value of <code>
10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|169\.254\.\d{1,3}\.\d{1,3}|127\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.1[6-9]{1}\.\d{1,3}\.\d{1,3}|172\.2[0-9]{1}\.\d{1,3}\.\d{1,3}|172\.3[0-1]{1}\.\d{1,3}\.\d{1,3}
</code> will be used.</p>
</td></tr><tr><td><code>proxiesHeader</code></td><td>
<p>Name of the HTTP header created by this valve to hold the list of
proxies that have been processed in the incoming
<strong>remoteIpHeader</strong>. If not specified, the default of
<code>x-forwarded-by</code> is used.</p>
</td></tr><tr><td><code>requestAttributesEnabled</code></td><td>
<p>Set to <code>true</code> to set the request attributes used by
AccessLog implementations to override the values returned by the
request for remote address, remote host, server port and protocol.
Request attributes are also used to enable the forwarded remote address
to be displayed on the status page of the Manager web application.
If not set, the default value of <code>true</code> will be used.</p>
</td></tr><tr><td><code>trustedProxies</code></td><td>
<p>Regular expression (using <code>java.util.regex</code>) that a
proxy's IP address must match to be considered an trusted proxy.
Trusted proxies that appear in the <strong>remoteIpHeader</strong> will
be trusted and will appear in the <strong>proxiesHeader</strong> value.
If not specified, no proxies will be trusted.</p>
</td></tr><tr><td><code>protocolHeader</code></td><td>
<p>Name of the HTTP Header read by this valve that holds the protocol
used by the client to connect to the proxy. If not specified, the
default of <code>null</code> is used.</p>
</td></tr><tr><td><code>portHeader</code></td><td>
<p>Name of the HTTP Header read by this valve that holds the port
used by the client to connect to the proxy. If not specified, the
default of <code>null</code> is used.</p>
</td></tr><tr><td><code>protocolHeaderHttpsValue</code></td><td>
<p>Value of the <strong>protocolHeader</strong> to indicate that it is
an HTTPS request. If not specified, the default of <code>https</code> is
used.</p>
</td></tr><tr><td><code>httpServerPort</code></td><td>
<p>Value returned by <code>ServletRequest.getServerPort()</code>
when the <strong>protocolHeader</strong> indicates <code>http</code>
protocol and no <strong>portHeader</strong> is present. If not
specified, the default of <code>80</code> is used.</p>
</td></tr><tr><td><code>httpsServerPort</code></td><td>
<p>Value returned by <code>ServletRequest.getServerPort()</code>
when the <strong>protocolHeader</strong> indicates <code>https</code>
protocol and no <strong>portHeader</strong> is present. If not
specified, the default of <code>443</code> is used.</p>
</td></tr><tr><td><code>changeLocalPort</code></td><td>
<p>If <code>true</code>, the value returned by
<code>ServletRequest.getLocalPort()</code> and
<code>ServletRequest.getServerPort()</code> is modified by the this
valve. If not specified, the default of <code>false</code> is used.</p>
</td></tr></tbody></table>


#### SSL Valve

#### Introduction

When using mod_proxy_http, the client SSL information is not included in the protocol (unlike mod_jk and mod_proxy_ajp). To make the client SSL information available to Tomcat, some additional configuration is required. In httpd, mod_headers is used to add the SSL information as HTTP headers. In Tomcat, this valve is used to read the information from the HTTP headers and insert it into the request.

Note: Ensure that the headers are always set by httpd for all requests to prevent a client spoofing SSL information by sending fake headers.

To configure httpd to set the necessary headers, add the following:

```
<IfModule ssl_module>
  RequestHeader set SSL_CLIENT_CERT "%{SSL_CLIENT_CERT}s"
  RequestHeader set SSL_CIPHER "%{SSL_CIPHER}s"
  RequestHeader set SSL_SESSION_ID "%{SSL_SESSION_ID}s"
  RequestHeader set SSL_CIPHER_USEKEYSIZE "%{SSL_CIPHER_USEKEYSIZE}s"
</IfModule>
```

#### Attributes

The **SSL Valve** supports the following configuration attribute:

<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.valves.SSLValve</strong>.
</p>
</td></tr><tr><td><code>sslClientCertHeader</code></td><td>
<p>Allows setting a custom name for the ssl_client_cert header.
If not specified, the default of <code>ssl_client_cert</code> is
used.</p>
</td></tr><tr><td><code>sslCipherHeader</code></td><td>
<p>Allows setting a custom name for the ssl_cipher header.
If not specified, the default of <code>ssl_cipher</code> is
used.</p>
</td></tr><tr><td><code>sslSessionIdHeader</code></td><td>
<p>Allows setting a custom name for the ssl_session_id header.
If not specified, the default of <code>ssl_session_id</code> is
used.</p>
</td></tr><tr><td><code>sslCipherUserKeySizeHeader</code></td><td>
<p>Allows setting a custom name for the ssl_cipher_usekeysize header.
If not specified, the default of <code>ssl_cipher_usekeysize</code> is
used.</p>
</td></tr></tbody></table>

### Single Sign On Valve

#### Introduction

The *Single Sign On Valve* is utilized when you wish to give users the ability to sign on to any one of the web applications associated with your virtual host, and then have their identity recognized by all other web applications on the same virtual host.

See the [Single Sign On](https://tomcat.apache.org/tomcat-8.0-doc/config/host.html#Single_Sign_On) special feature on the **Host** element for more information.

#### Attributes

The **Single Sign On** Valve supports the following configuration attributes:


<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.authenticator.SingleSignOn</strong>.</p>
</td></tr><tr><td><code>requireReauthentication</code></td><td>
<p>Default false. Flag to determine whether each request needs to be
reauthenticated to the security <strong>Realm</strong>. If "true", this
Valve uses cached security credentials (username and password) to
reauthenticate to the <strong>Realm</strong> each request associated
with an SSO session.  If "false", the Valve can itself authenticate
requests based on the presence of a valid SSO cookie, without
rechecking with the <strong>Realm</strong>.</p>
</td></tr><tr><td><code>cookieDomain</code></td><td>
<p>Sets the host domain to be used for sso cookies.</p>
</td></tr></tbody></table>


### Authentication

The valves in this section implement **org.apache.catalina.Authenticator** interface.

#### Basic Authenticator Valve

#### Introduction

The **Basic Authenticator Valve** is automatically added to any [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html) that is configured to use BASIC authentication.

If any non-default settings are required, the valve may be configured within [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html) element with the required values.

#### Attributes

The **Basic Authenticator Valve** supports the following configuration attributes:

<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><code>alwaysUseSession</code></td><td>
<p>Should a session always be used once a user is authenticated? This
may offer some performance benefits since the session can then be used
to cache the authenticated Principal, hence removing the need to
authenticate the user via the Realm on every request. This may be of
help for combinations such as BASIC authentication used with the
JNDIRealm or DataSourceRealms. However there will also be the
performance cost of creating and GC'ing the session. If not set, the
default value of <code>false</code> will be used.</p>
</td></tr><tr><td><code>cache</code></td><td>
<p>Should we cache authenticated Principals if the request is part of an
HTTP session? If not specified, the default value of <code>true</code>
will be used.</p>
</td></tr><tr><td><code>changeSessionIdOnAuthentication</code></td><td>
<p>Controls if the session ID is changed if a session exists at the
point where users are authenticated. This is to prevent session fixation
attacks. If not set, the default value of <code>true</code> will be
used.</p>
</td></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.authenticator.BasicAuthenticator</strong>.</p>
</td></tr><tr><td><code>disableProxyCaching</code></td><td>
<p>Controls the caching of pages that are protected by security
constraints. Setting this to <code>false</code> may help work around
caching issues in some browsers but will also cause secured pages to be
cached by proxies which will almost certainly be a security issue.
<code>securePagesWithPragma</code> offers an alternative, secure,
workaround for browser caching issues. If not set, the default value of
<code>true</code> will be used.</p>
</td></tr><tr><td><code>securePagesWithPragma</code></td><td>
<p>Controls the caching of pages that are protected by security
constraints. Setting this to <code>false</code> may help work around
caching issues in some browsers by using
<code>Cache-Control: private</code> rather than the default of
<code>Pragma: No-cache</code> and <code>Cache-control: No-cache</code>.
If not set, the default value of <code>false</code> will be used.</p>
</td></tr><tr><td><code>secureRandomAlgorithm</code></td><td>
<p>Name of the algorithm to use to create the
<code>java.security.SecureRandom</code> instances that generate session
IDs. If an invalid algorithm and/or provider is specified, the platform
default provider and the default algorithm will be used. If not
specified, the default algorithm of SHA1PRNG will be used. If the
default algorithm is not supported, the platform default will be used.
To specify that the platform default should be used, do not set the
secureRandomProvider attribute and set this attribute to the empty
string.</p>
</td></tr><tr><td><code>secureRandomClass</code></td><td>
<p>Name of the Java class that extends
<code>java.security.SecureRandom</code> to use to generate SSO session
IDs. If not specified, the default value is
<code>java.security.SecureRandom</code>.</p>
</td></tr><tr><td><code>secureRandomProvider</code></td><td>
<p>Name of the provider to use to create the
<code>java.security.SecureRandom</code> instances that generate SSO
session IDs. If an invalid algorithm and/or provider is specified, the
platform default provider and the default algorithm will be used. If not
specified, the platform default provider will be used.</p>
</td></tr></tbody></table>


#### Digest Authenticator Valve

#### Introduction

The **Digest Authenticator Valve** is automatically added to any [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html) that is configured to use DIGEST authentication.

If any non-default settings are required, the valve may be configured within [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html) element with the required values.

#### Attributes

The **Digest Authenticator Valve** supports the following configuration attributes:

<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><code>alwaysUseSession</code></td><td>
<p>Should a session always be used once a user is authenticated? This
may offer some performance benefits since the session can then be used
to cache the authenticated Principal, hence removing the need to
authenticate the user via the Realm on every request. This may be of
help for combinations such as BASIC authentication used with the
JNDIRealm or DataSourceRealms. However there will also be the
performance cost of creating and GC'ing the session. If not set, the
default value of <code>false</code> will be used.</p>
</td></tr><tr><td><code>cache</code></td><td>
<p>Should we cache authenticated Principals if the request is part of an
HTTP session? If not specified, the default value of <code>false</code>
will be used.</p>
</td></tr><tr><td><code>changeSessionIdOnAuthentication</code></td><td>
<p>Controls if the session ID is changed if a session exists at the
point where users are authenticated. This is to prevent session fixation
attacks. If not set, the default value of <code>true</code> will be
used.</p>
</td></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.authenticator.DigestAuthenticator</strong>.</p>
</td></tr><tr><td><code>disableProxyCaching</code></td><td>
<p>Controls the caching of pages that are protected by security
constraints. Setting this to <code>false</code> may help work around
caching issues in some browsers but will also cause secured pages to be
cached by proxies which will almost certainly be a security issue.
<code>securePagesWithPragma</code> offers an alternative, secure,
workaround for browser caching issues. If not set, the default value of
<code>true</code> will be used.</p>
</td></tr><tr><td><code>key</code></td><td>
<p>The secret key used by digest authentication. If not set, a secure
random value is generated. This should normally only be set when it is
necessary to keep key values constant either across server restarts
and/or across a cluster.</p>
</td></tr><tr><td><code>nonceCacheSize</code></td><td>
<p>To protect against replay attacks, the DIGEST authenticator tracks
server nonce and nonce count values. This attribute controls the size
of that cache. If not specified, the default value of 1000 is used.</p>
</td></tr><tr><td><code>nonceCountWindowSize</code></td><td>
<p>Client requests may be processed out of order which in turn means
that the nonce count values may be processed out of order. To prevent
authentication failures when nonce counts are presented out of order
the authenticator tracks a window of nonce count values. This attribute
controls how big that window is. If not specified, the default value of
100 is used.</p>
</td></tr><tr><td><code>nonceValidity</code></td><td>
<p>The time, in milliseconds, that a server generated nonce will be
considered valid for use in authentication. If not specified, the
default value of 300000 (5 minutes) will be used.</p>
</td></tr><tr><td><code>opaque</code></td><td>
<p>The opaque server string used by digest authentication. If not set, a
random value is generated. This should normally only be set when it is
necessary to keep opaque values constant either across server restarts
and/or across a cluster.</p>
</td></tr><tr><td><code>securePagesWithPragma</code></td><td>
<p>Controls the caching of pages that are protected by security
constraints. Setting this to <code>false</code> may help work around
caching issues in some browsers by using
<code>Cache-Control: private</code> rather than the default of
<code>Pragma: No-cache</code> and <code>Cache-control: No-cache</code>.
If not set, the default value of <code>false</code> will be used.</p>
</td></tr><tr><td><code>secureRandomAlgorithm</code></td><td>
<p>Name of the algorithm to use to create the
<code>java.security.SecureRandom</code> instances that generate session
IDs. If an invalid algorithm and/or provider is specified, the platform
default provider and the default algorithm will be used. If not
specified, the default algorithm of SHA1PRNG will be used. If the
default algorithm is not supported, the platform default will be used.
To specify that the platform default should be used, do not set the
secureRandomProvider attribute and set this attribute to the empty
string.</p>
</td></tr><tr><td><code>secureRandomClass</code></td><td>
<p>Name of the Java class that extends
<code>java.security.SecureRandom</code> to use to generate SSO session
IDs. If not specified, the default value is
<code>java.security.SecureRandom</code>.</p>
</td></tr><tr><td><code>secureRandomProvider</code></td><td>
<p>Name of the provider to use to create the
<code>java.security.SecureRandom</code> instances that generate SSO
session IDs. If an invalid algorithm and/or provider is specified, the
platform default provider and the default algorithm will be used. If not
specified, the platform default provider will be used.</p>
</td></tr><tr><td><code>validateUri</code></td><td>
<p>Should the URI be validated as required by RFC2617? If not specified,
the default value of <code>true</code> will be used. This should
normally only be set when Tomcat is located behind a reverse proxy and
the proxy is modifying the URI passed to Tomcat such that DIGEST
authentication always fails.</p>
</td></tr></tbody></table>



#### Form Authenticator Valve

#### Introduction

The **Form Authenticator Valve** is automatically added to any [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html) that is configured to use FORM authentication.

If any non-default settings are required, the valve may be configured within [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html) element with the required values.

#### Attributes

The **Form Authenticator Valve** supports the following configuration attributes:

<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><code>changeSessionIdOnAuthentication</code></td><td>
<p>Controls if the session ID is changed if a session exists at the
point where users are authenticated. This is to prevent session fixation
attacks. If not set, the default value of <code>true</code> will be
used.</p>
</td></tr><tr><td><code>characterEncoding</code></td><td>
<p>Character encoding to use to read the username and password parameters
from the request. If not set, the encoding of the request body will be
used.</p>
</td></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.authenticator.FormAuthenticator</strong>.</p>
</td></tr><tr><td><code>disableProxyCaching</code></td><td>
<p>Controls the caching of pages that are protected by security
constraints. Setting this to <code>false</code> may help work around
caching issues in some browsers but will also cause secured pages to be
cached by proxies which will almost certainly be a security issue.
<code>securePagesWithPragma</code> offers an alternative, secure,
workaround for browser caching issues. If not set, the default value of
<code>true</code> will be used.</p>
</td></tr><tr><td><code>landingPage</code></td><td>
<p>Controls the behavior of the FORM authentication process if the
process is misused, for example by directly requesting the login page
or delaying logging in for so long that the session expires. If this
attribute is set, rather than returning an error response code, Tomcat
will redirect the user to the specified landing page if the login form
is submitted with valid credentials. For the login to be processed, the
landing page must be a protected resource (i.e. one that requires
authentication). If the landing page does not require authentication
then the user will not be logged in and will be prompted for their
credentials again when they access a protected page.</p>
</td></tr><tr><td><code>securePagesWithPragma</code></td><td>
<p>Controls the caching of pages that are protected by security
constraints. Setting this to <code>false</code> may help work around
caching issues in some browsers by using
<code>Cache-Control: private</code> rather than the default of
<code>Pragma: No-cache</code> and <code>Cache-control: No-cache</code>.
If not set, the default value of <code>false</code> will be used.</p>
</td></tr><tr><td><code>secureRandomAlgorithm</code></td><td>
<p>Name of the algorithm to use to create the
<code>java.security.SecureRandom</code> instances that generate session
IDs. If an invalid algorithm and/or provider is specified, the platform
default provider and the default algorithm will be used. If not
specified, the default algorithm of SHA1PRNG will be used. If the
default algorithm is not supported, the platform default will be used.
To specify that the platform default should be used, do not set the
secureRandomProvider attribute and set this attribute to the empty
string.</p>
</td></tr><tr><td><code>secureRandomClass</code></td><td>
<p>Name of the Java class that extends
<code>java.security.SecureRandom</code> to use to generate SSO session
IDs. If not specified, the default value is
<code>java.security.SecureRandom</code>.</p>
</td></tr><tr><td><code>secureRandomProvider</code></td><td>
<p>Name of the provider to use to create the
<code>java.security.SecureRandom</code> instances that generate SSO
session IDs. If an invalid algorithm and/or provider is specified, the
platform default provider and the default algorithm will be used. If not
specified, the platform default provider will be used.</p>
</td></tr></tbody></table>

#### SSL Authenticator Valve

#### Introduction

The **SSL Authenticator Valve** is automatically added to any [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html) that is configured to use SSL authentication.

If any non-default settings are required, the valve may be configured within [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html) element with the required values.

#### Attributes

The **SSL Authenticator Valve** supports the following configuration attributes:


<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><code>cache</code></td><td>
<p>Should we cache authenticated Principals if the request is part of an
HTTP session? If not specified, the default value of <code>true</code>
will be used.</p>
</td></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.authenticator.SSLAuthenticator</strong>.</p>
</td></tr><tr><td><code>changeSessionIdOnAuthentication</code></td><td>
<p>Controls if the session ID is changed if a session exists at the
point where users are authenticated. This is to prevent session fixation
attacks. If not set, the default value of <code>true</code> will be
used.</p>
</td></tr><tr><td><code>disableProxyCaching</code></td><td>
<p>Controls the caching of pages that are protected by security
constraints. Setting this to <code>false</code> may help work around
caching issues in some browsers but will also cause secured pages to be
cached by proxies which will almost certainly be a security issue.
<code>securePagesWithPragma</code> offers an alternative, secure,
workaround for browser caching issues. If not set, the default value of
<code>true</code> will be used.</p>
</td></tr><tr><td><code>securePagesWithPragma</code></td><td>
<p>Controls the caching of pages that are protected by security
constraints. Setting this to <code>false</code> may help work around
caching issues in some browsers by using
<code>Cache-Control: private</code> rather than the default of
<code>Pragma: No-cache</code> and <code>Cache-control: No-cache</code>.
If not set, the default value of <code>false</code> will be used.</p>
</td></tr><tr><td><code>secureRandomAlgorithm</code></td><td>
<p>Name of the algorithm to use to create the
<code>java.security.SecureRandom</code> instances that generate session
IDs. If an invalid algorithm and/or provider is specified, the platform
default provider and the default algorithm will be used. If not
specified, the default algorithm of SHA1PRNG will be used. If the
default algorithm is not supported, the platform default will be used.
To specify that the platform default should be used, do not set the
secureRandomProvider attribute and set this attribute to the empty
string.</p>
</td></tr><tr><td><code>secureRandomClass</code></td><td>
<p>Name of the Java class that extends
<code>java.security.SecureRandom</code> to use to generate SSO session
IDs. If not specified, the default value is
<code>java.security.SecureRandom</code>.</p>
</td></tr><tr><td><code>secureRandomProvider</code></td><td>
<p>Name of the provider to use to create the
<code>java.security.SecureRandom</code> instances that generate SSO
session IDs. If an invalid algorithm and/or provider is specified, the
platform default provider and the default algorithm will be used. If not
specified, the platform default provider will be used.</p>
</td></tr></tbody></table>


#### SPNEGO Valve

#### Introduction

The **SPNEGO Authenticator Valve** is automatically added to any [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html) that is configured to use SPNEGO authentication.

If any non-default settings are required, the valve may be configured within [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html) element with the required values.

#### Attributes

The **SPNEGO Authenticator Valve** supports the following configuration attributes:


<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><code>applyJava8u40Fix</code></td><td>
<p>A fix introduced in Java 8 update 40 (
<a href="https://bugs.openjdk.java.net/browse/JDK-8048194">JDK-8048194</a>)
onwards broke SPNEGO authentication for IE with Tomcat running on
Windows 2008 R2 servers. This option enables a work-around that allows
SPNEGO authentication to continue working. The work-around should not
impact other configurations so it is enabled by default. If necessary,
the workaround can be disabled by setting this attribute to
<code>false</code>.</p>
</td></tr><tr><td><code>alwaysUseSession</code></td><td>
<p>Should a session always be used once a user is authenticated? This
may offer some performance benefits since the session can then be used
to cache the authenticated Principal, hence removing the need to
authenticate the user on every request. This will also help with clients
that assume that the server will cache the authenticated user. However
there will also be the performance cost of creating and GC'ing the
session. For an alternative solution see
<code>noKeepAliveUserAgents</code>. If not set, the default value of
<code>false</code> will be used.</p>
</td></tr><tr><td><code>cache</code></td><td>
<p>Should we cache authenticated Principals if the request is part of an
HTTP session? If not specified, the default value of <code>true</code>
will be used.</p>
</td></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.authenticator.SpnegoAuthenticator</strong>.
</p>
</td></tr><tr><td><code>changeSessionIdOnAuthentication</code></td><td>
<p>Controls if the session ID is changed if a session exists at the
point where users are authenticated. This is to prevent session fixation
attacks. If not set, the default value of <code>true</code> will be
used.</p>
</td></tr><tr><td><code>disableProxyCaching</code></td><td>
<p>Controls the caching of pages that are protected by security
constraints. Setting this to <code>false</code> may help work around
caching issues in some browsers but will also cause secured pages to be
cached by proxies which will almost certainly be a security issue.
<code>securePagesWithPragma</code> offers an alternative, secure,
workaround for browser caching issues. If not set, the default value of
<code>true</code> will be used.</p>
</td></tr><tr><td><code>loginConfigName</code></td><td>
<p>The name of the JAAS login configuration to be used to login as the
service. If not specified, the default of
<code>com.sun.security.jgss.krb5.accept</code> is used.</p>
</td></tr><tr><td><code>noKeepAliveUserAgents</code></td><td>
<p>Some clients (not most browsers) expect the server to cache the
authenticated user information for a connection and do not resend the
credentials with every request. Tomcat will not do this unless an HTTP
session is available. A session will be available if either the
application creates one or if <code>alwaysUseSession</code> is enabled
for this Authenticator.</p>
<p>As an alternative to creating a session, this attribute may be used
to define the user agents for which HTTP keep-alive is disabled. This
means that a connection will only used for a single request and hence
there is no ability to cache authenticated user information per
connection. There will be a performance cost in disabling HTTP
keep-alive.</p>
<p>The attribute should be a regular expression that matches the entire
user-agent string, e.g. <code>.*Chrome.*</code>. If not specified, no
regular expression will be defined and no user agents will have HTTP
keep-alive disabled.</p>
</td></tr><tr><td><code>securePagesWithPragma</code></td><td>
<p>Controls the caching of pages that are protected by security
constraints. Setting this to <code>false</code> may help work around
caching issues in some browsers by using
<code>Cache-Control: private</code> rather than the default of
<code>Pragma: No-cache</code> and <code>Cache-control: No-cache</code>.
If not set, the default value of <code>false</code> will be used.</p>
</td></tr><tr><td><code>secureRandomAlgorithm</code></td><td>
<p>Name of the algorithm to use to create the
<code>java.security.SecureRandom</code> instances that generate session
IDs. If an invalid algorithm and/or provider is specified, the platform
default provider and the default algorithm will be used. If not
specified, the default algorithm of SHA1PRNG will be used. If the
default algorithm is not supported, the platform default will be used.
To specify that the platform default should be used, do not set the
secureRandomProvider attribute and set this attribute to the empty
string.</p>
</td></tr><tr><td><code>secureRandomClass</code></td><td>
<p>Name of the Java class that extends
<code>java.security.SecureRandom</code> to use to generate SSO session
IDs. If not specified, the default value is
<code>java.security.SecureRandom</code>.</p>
</td></tr><tr><td><code>secureRandomProvider</code></td><td>
<p>Name of the provider to use to create the
<code>java.security.SecureRandom</code> instances that generate SSO
session IDs. If an invalid algorithm and/or provider is specified, the
platform default provider and the default algorithm will be used. If not
specified, the platform default provider will be used.</p>
</td></tr><tr><td><code>storeDelegatedCredential</code></td><td>
<p>Controls if the user' delegated credential will be stored in
the user Principal. If available, the delegated credential will be
available to applications (e.g. for onward authentication to external
services) via the <code>org.apache.catalina.realm.GSS_CREDENTIAL</code>
request attribute. If not set, the default value of <code>true</code>
will be used.</p>
</td></tr></tbody></table>


### Error Report Valve

#### Introduction

The **Error Report Valve** is a simple error handler for HTTP status codes that will generate and return HTML error pages.

**NOTE:** Disabling both showServerInfo and showReport will only return the HTTP status code and remove all CSS.

#### Attributes

The **Error Report Valve** supports the following configuration attributes:

<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.valves.ErrorReportValve</strong> to use the
default error report valve.</p>
</td></tr><tr><td><code>showReport</code></td><td>
<p>Flag to determine if the error report is presented when an error
occurs. If set to <code>false</code>, then the error report is not in
the HTML response.
Default value: <code>true</code>
</p>
</td></tr><tr><td><code>showServerInfo</code></td><td>
<p>Flag to determine if server information is presented when an error
occurs. If set to <code>false</code>, then the server version is not
returned in the HTML response.
Default value: <code>true</code>
</p>
</td></tr></tbody></table>


### Crawler Session Manager Valve

#### Introduction

Web crawlers can trigger the creation of many thousands of sessions as they crawl a site which may result in significant memory consumption. This Valve ensures that crawlers are associated with a single session - just like normal users - regardless of whether or not they provide a session token with their requests.

This Valve may be used at the `Engine`, `Host` or `Context` level as required. Normally, this Valve would be used at the `Engine` level.

If used in conjunction with Remote IP valve then the Remote IP valve should be defined before this valve to ensure that the correct client IP address is presented to this valve.

#### Attributes

The **Crawler Session Manager Valve** supports the following configuration attributes:

<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.valves.CrawlerSessionManagerValve</strong>.
</p>
</td></tr><tr><td><code>crawlerUserAgents</code></td><td>
<p>Regular expression (using <code>java.util.regex</code>) that the user
agent HTTP request header is matched against to determine if a request
is from a web crawler. If not set, the default of
<code>.*[bB]ot.*|.*Yahoo! Slurp.*|.*Feedfetcher-Google.*</code> is used.</p>
</td></tr><tr><td><code>sessionInactiveInterval</code></td><td>
<p>The minimum time in seconds that the Crawler Session Manager Valve
should keep the mapping of client IP to session ID in memory without any
activity from the client. The client IP / session cache will be
periodically purged of mappings that have been inactive for longer than
this interval. If not specified the default value of <code>60</code>
will be used.</p>
</td></tr></tbody></table>

### Stuck Thread Detection Valve

#### Introduction

This valve allows to detect requests that take a long time to process, which might indicate that the thread that is processing it is stuck. Additionally it can optionally interrupt such threads to try and unblock them.

When such a request is detected, the current stack trace of its thread is written to Tomcat log with a WARN level.

The IDs and names of the stuck threads are available through JMX in the `stuckThreadIds` and `stuckThreadNames` attributes. The IDs can be used with the standard Threading JVM MBean (`java.lang:type=Threading`) to retrieve other information about each stuck thread.

#### Attributes

The **Stuck Thread Detection Valve** supports the following configuration attributes:

<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use.  This MUST be set to
<strong>org.apache.catalina.valves.StuckThreadDetectionValve</strong>.
</p>
</td></tr><tr><td><code>threshold</code></td><td>
<p>Minimum duration in seconds after which a thread is considered stuck.
Default is 600 seconds. If set to 0, the detection is disabled.</p>
<p>Note: since the detection (and optional interruption) is done in the
background thread of the Container (Engine, Host or Context) declaring
this Valve, the threshold should be higher than the
<code>backgroundProcessorDelay</code> of this Container.</p>
</td></tr><tr><td><code>interruptThreadThreshold</code></td><td>
<p>Minimum duration in seconds after which a stuck thread should be
interrupted to attempt to "free" it.</p>
<p>Note that there's no guarantee that the thread will get unstuck.
This usually works well for threads stuck on I/O or locks, but is
probably useless in case of infinite loops.</p>
<p>Default is -1 which disables the feature. To enable it, the value
must be greater or equal to <code>threshold</code>.</p>
</td></tr></tbody></table>

### Semaphore Valve

#### Introduction

The **Semaphore Valve** is able to limit the number of concurrent request processing threads.

**org.apache.catalina.valves.SemaphoreValve** provides methods which may be overridden by a subclass to customize behavior:

- **controlConcurrency** may be overridden to add conditions;
- **permitDenied** may be overridden to add error handling when a permit isn't granted.

#### Attributes

The **Semaphore Valve** supports the following configuration attributes:

<table><tbody><tr><th>
Attribute
</th><th>
Description
</th></tr><tr><td><code>block</code></td><td>
<p>Flag to determine if a thread is blocked until a permit is available.
The default value is <strong>true</strong>.</p>
</td></tr><tr><td><strong><code>className</code></strong></td><td>
<p>Java class name of the implementation to use. This MUST be set to
<strong>org.apache.catalina.valves.SemaphoreValve</strong>.</p>
</td></tr><tr><td><code>concurrency</code></td><td>
<p>Concurrency level of the semaphore. The default value is
<strong>10</strong>.</p>
</td></tr><tr><td><code>fairness</code></td><td>
<p>Fairness of the semaphore. The default value is
<strong>false</strong>.</p>
</td></tr><tr><td><code>interruptible</code></td><td>
<p>Flag to determine if a thread may be interrupted until a permit is
available. The default value is <strong>false</strong>.</p>
</td></tr></tbody></table>





原文链接: <https://tomcat.apache.org/tomcat-8.0-doc/config/valve.html>


参考: Tomcat教程[https://www.oxxus.net/tutorials/tomcat/tomcat-valve](https://www.oxxus.net/tutorials/tomcat/tomcat-valve)

