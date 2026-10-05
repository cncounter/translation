## Valve 组件

### 简介

**Valve** 元素表示一个组件, 会被插入到关联 Catalina 容器([Engine](https://tomcat.apache.org/tomcat-8.0-doc/config/engine.html)、[Host](https://tomcat.apache.org/tomcat-8.0-doc/config/host.html), 或者 [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html))的请求处理流水线(request processing pipeline)中。每种 Valve 都有各自不同的处理能力, 下面分别进行描述。

*下文使用变量名 `$CATALINA_BASE` 来指代 base 目录, 大多数相对路径都是基于它来解析的。如果你没有通过设置 `CATALINA_BASE` 目录来配置多个 Tomcat 实例, 那么 `$CATALINA_BASE` 会被设置为 `$CATALINA_HOME` 的值, 也就是安装 Tomcat 的目录。*

### 访问日志(Access Logging)

访问日志由实现了 **org.apache.catalina.AccessLog** 接口的 valve 来完成。

#### Access Log Valve

#### 简介

**Access Log Valve** 创建的日志文件, 与标准 web 服务器创建的格式相同。这些日志后续可由标准的日志分析工具来分析, 以跟踪页面点击量、用户会话活动等。这个 `Valve` 使用自包含的逻辑来写日志文件, 并且每天午夜可以自动滚动。 (访问日志的基本要求是以较低的开销处理大量连续的数据流。此 `Valve` 不使用 Apache Commons Logging, 从而避免了额外的开销以及可能复杂的配置)。

此 `Valve` 可以关联到任意 Catalina 容器(`Context`、`Host` 或 `Engine`), 并会记录该容器处理的所有请求。

有些请求在传给容器之前就由 Tomcat 处理了。这包括从 /foo 到 /foo/ 的重定向, 以及拒绝非法请求。如果 Tomcat 能识别出本来应该处理该请求的 `Context`, 那么请求/响应会被记录到该 `Context`、`Host` 和 `Engine` 关联的 `AccessLog` 中。如果 Tomcat 无法识别本来应该处理该请求的 `Context`(例如 URL 非法的情况), Tomcat 会先查找 `Engine`, 然后是该 `Engine` 的默认 `Host`, 最后是该默认 `Host` 的 ROOT(或默认)`Context`, 以寻找 `AccessLog` 实现。对于在传给容器之前就被拒绝的请求, Tomcat 会使用找到的第一个 `AccessLog` 实现来记录。

输出文件会放在 `directory` 属性指定的目录中。文件名由配置的 `prefix`、时间戳和 `suffix` 拼接而成。文件名中时间戳的格式可以通过 `fileDateFormat` 属性来设置。如果将 `rotatable` 设置为 `false` 关闭了文件滚动, 则会省略该时间戳。

**警告:** 如果使用了多个 AccessLogValve 实例, 应该配置它们使用不同的输出文件。

如果使用了 sendfile, 响应字节会在单独的线程中异步写出, 此时 access log valve 无法得知实际写出了多少字节。这种情况下, 传给 sendfile 线程去写的字节数会被记录到 access log valve 中。

#### 属性

**Access Log Valve** 支持以下配置属性:

| 属性                       | 描述                                       |
| -------------------------- | ---------------------------------------- |
| **className**              | 要使用的实现的 Java 类名。必须设置为 **org.apache.catalina.valves.AccessLogValve** 才能使用默认的 access log valve。 |
| `directory`                | 日志文件放置的目录的绝对或相对路径, 该文件由这个 valve 创建。如果指定的是相对路径, 则会相对于 $CATALINA_BASE 来解析。如果没有指定 directory 属性, 默认值是 "logs"(相对于 $CATALINA_BASE)。 |
| `prefix`                   | 添加到每个日志文件名开头的文件前缀。如果未指定, 默认值是 "access_log"。 |
| `suffix`                   | 添加到每个日志文件名末尾的后缀。如果未指定, 默认值是 ""(空字符串), 表示不添加后缀。 |
| `fileDateFormat`           | 允许自定义访问日志文件名中的时间戳。只要格式化后的时间戳发生变化, 文件就会滚动。默认值是 `.yyyy-MM-dd`。如果你想每小时滚动一次, 可以把这个值设置为 `.yyyy-MM-dd.HH`。日期格式总是使用 locale `en_US` 进行本地化。 |
| `rotatable`                | 用于确定是否进行日志滚动的标志。如果设置为 `false`, 则该文件永远不会滚动, 并且忽略 `fileDateFormat`。默认值: `true` |
| `renameOnRotate`           | 默认情况下, 对于可滚动的日志, 当前活动的访问日志文件名会包含 `fileDateFormat` 中的当前时间戳。在滚动期间, 文件被关闭, 并创建和启用一个名字中带有下一个时间戳的新文件。当把 `renameOnRotate` 设置为 `true` 时, 时间戳不再是活动日志文件名的一部分。只有在滚动期间, 文件才会被关闭, 然后重命名以包含时间戳。这与大多数日志框架在进行基于时间的滚动时的行为类似。默认值: `false` |
| `pattern`                  | 一种格式化布局, 用于标识从请求和响应中记录的各种信息字段, 也可以使用 `common` 或 `combined` 关键字来选择一种标准格式。关于此属性配置的更多信息见下文。 |
| `encoding`                 | 用于写入日志文件的字符集。空字符串表示使用系统默认字符集。默认值: 使用系统默认字符集。 |
| `locale`                   | 用于格式化访问日志行中时间戳的 locale。任何使用显式 SimpleDateFormat 模式(`%{xxx}t`)配置的时间戳, 都会用这个 locale 来格式化。默认使用 Java 进程的默认 locale。不支持在 AccessLogValve 初始化之后再切换 locale。任何使用通用日志格式(`CLF`)的时间戳总是用 locale `en_US` 来格式化。 |
| `requestAttributesEnabled` | 设置为 `true` 时, 检查是否存在请求属性(通常由 RemoteIpValve 及类似组件设置), 这些属性应该用于覆盖请求返回的 remote address、remote host、server port 和 protocol 值。如果这些属性未设置, 或者该属性设置为 `false`, 则使用请求中的值。如果未设置, 则使用默认值 `false`。 |
| `conditionIf`              | 开启条件日志。如果设置了该属性, 则只有当 `ServletRequest.getAttribute()` 不为 null 时才会记录请求。例如, 如果把这个值设置为 `important`, 那么只有当 `ServletRequest.getAttribute("important") != null` 时才会记录某个请求。使用 Filter 是在众多不同请求上设置/取消设置 ServletRequest 属性的简便方法。 |
| `conditionUnless`          | 开启条件日志。如果设置了该属性, 则只有当 `ServletRequest.getAttribute()` 为 null 时才会记录请求。例如, 如果把这个值设置为 `junk`, 那么只有当 `ServletRequest.getAttribute("junk") == null` 时才会记录某个请求。使用 Filter 是在众多不同请求上设置/取消设置 ServletRequest 属性的简便方法。 |
| `condition`                | 与 `conditionUnless` 相同。提供此属性是为了向后兼容。 |
| `buffered`                 | 用于确定日志是否使用缓冲的标志。如果设置为 `false`, 则会在每个请求之后写出访问日志。默认值: `true` |
| `maxLogMessageBufferSize`  | 日志消息缓冲区通常会被回收和复用。为防止内存占用过多, 如果缓冲区增长超过此大小, 就会被丢弃。默认是 `256` 个字符。应该把它设置得比典型的访问日志消息更大一些。 |
| `resolveHosts`             | 不再支持此属性。请改用连接器属性 `enableLookups`。如果连接器上的 `enableLookups` 设置为 `true` 而你想忽略它, 可以在 `pattern` 的值中使用 **%a** 而不是 **%h**。 |

`pattern` 属性的值由字面文本字符串组成, 并可以结合以 "%" 字符为前缀的模式标识符, 从而用当前请求和响应中对应的变量值来替换。支持以下模式代码:

- **%a** - 远程 IP 地址
- **%A** - 本地 IP 地址
- **%b** - 发送的字节数, 不含 HTTP 头, 为零时显示 '-'
- **%B** - 发送的字节数, 不含 HTTP 头
- **%h** - 远程主机名(如果连接器的 `enableLookups` 为 false, 则为 IP 地址)
- **%H** - 请求协议
- **%l** - 来自 identd 的远程逻辑用户名(总是返回 '-')
- **%m** - 请求方法(GET、POST 等)
- **%p** - 接收此请求的本地端口。另见下面的 `%{xxx}p`。
- **%q** - 查询字符串(如果存在, 会在前面加上 '?')
- **%r** - 请求的第一行(方法和请求 URI)
- **%s** - 响应的 HTTP 状态码
- **%S** - 用户会话 ID
- **%t** - 日期和时间, 采用 Common Log Format
- **%u** - 已通过身份验证的远程用户(如果存在), 否则为 '-'
- **%U** - 请求的 URL 路径
- **%v** - 本地服务器名称
- **%D** - 处理请求所花费的时间, 单位毫秒
- **%T** - 处理请求所花费的时间, 单位秒
- **%F** - 提交响应所花费的时间, 单位毫秒
- **%I** - 当前请求的线程名(后续可以与堆栈跟踪比对)

此外还支持写入传入或传出的 headers、cookies、session 或 request 属性以及特殊的时间戳格式。它是仿照 [Apache HTTP Server](http://httpd.apache.org/) 的日志配置语法设计的。每一项都可以用不同的 `xxx` 键多次使用:

- **%{xxx}i** 写出名为 `xxx` 的传入 header 的值
- **%{xxx}o** 写出名为 `xxx` 的传出 header 的值
- **%{xxx}c** 写出名为 `xxx` 的 cookie 的值
- **%{xxx}r** 写出名为 `xxx` 的 ServletRequest 属性的值
- **%{xxx}s** 写出名为 `xxx` 的 HttpSession 属性的值
- **%{xxx}p** 写出本地(服务器)端口(`xxx==local`)或远程(客户端)端口(`xxx=remote`)
- **%{xxx}t** 写出请求结束时的时间戳, 使用增强的 SimpleDateFormat 模式 `xxx` 格式化

`%{xxx}t` 中允许使用 SimpleDateFormat 支持的所有格式。此外还添加了以下扩展:

- **sec** - 自纪元(epoch)以来的秒数
- **msec** - 自纪元以来的毫秒数
- **msec_frac** - 毫秒的小数部分

这些格式不能与 SimpleDateFormat 的格式混用在同一个格式 token 中。

此外, 还可以定义记录请求开始时间还是响应结束时间的时间戳:

- **begin** 或前缀 **begin:** 表示选择请求开始时间
- **end** 或前缀 **end:** 表示选择响应结束时间

通过在 pattern 中添加多个 `%{xxx}t` token, 还可以同时记录两个时间戳。

速记模式 `pattern="common"` 对应于由 **'%h %l %u %t "%r" %s %b'** 定义的 Common Log Format。

速记模式 `pattern="combined"` 会在 `common` 模式的基础上, 追加 `Referer` 和 `User-Agent` header 的值, 每个都用双引号括起来。

当 Tomcat 运行在反向代理之后时, Access Log Valve 记录的客户端信息可能代表反向代理、浏览器, 或者两者的某种组合, 具体取决于 Tomcat 和反向代理的配置。Tomcat 的配置选项参见 [Proxies Support](https://tomcat.apache.org/tomcat-8.0-doc/config/valve.html#Proxies_Support) 和 [Proxy How-To](https://tomcat.apache.org/tomcat-8.0-doc/proxy-howto.html)。对于使用 mod_jk 的反向代理, 参见 [generic proxy](http://tomcat.apache.org/connectors-doc/generic_howto/proxy.html)文档。对于其他反向代理, 请查阅它们的文档。

#### Extended Access Log Valve

#### 简介

**Extended Access Log Valve** 扩展了 [Access Log Valve](https://tomcat.apache.org/tomcat-8.0-doc/config/valve.html#Access_Log_Valve) 类, 因此使用相同的自包含日志逻辑。这意味着它实现了许多相同的文件处理属性。与标准 `AccessLogValve` 的主要区别在于, `ExtendedAccessLogValve` 创建的日志文件符合 W3C 定义的 [Extended Log File Format](http://www.w3.org/TR/WD-logfile.html) 工作草案。

#### 属性

**Extended Access Log Valve** 支持标准 [Access Log Valve](https://tomcat.apache.org/tomcat-8.0-doc/config/valve.html#Access_Log_Valve) 的所有配置属性。只有 `className` 和 `pattern` 使用的值不同。

| 属性          | 描述                                       |
| ------------- | ---------------------------------------- |
| **className** | 要使用的实现的 Java 类名。必须设置为 **org.apache.catalina.valves.ExtendedAccessLogValve** 才能使用 extended access log valve。 |
| `pattern`     | 一种格式化布局, 用于标识从请求和响应中记录的各种信息字段。关于此属性配置的更多信息见下文。 |

`pattern` 属性的值由格式 token 组成。有些 token 需要额外的前缀。可能的前缀有: `c` 表示 "client", `s` 表示 "server", `cs` 表示 "client to server", `sc` 表示 "server to client", `x` 表示 "application specific"。此外有些 token 还需要一个额外的选择器来补全。关于该格式的更多信息参见 [W3C specification](http://www.w3.org/TR/WD-logfile.html)。

支持以下格式 token:

- **bytes** - 发送的字节数, 不含 HTTP 头, 为零时显示 '-'
- **c-dns** - 远程主机名(如果连接器的 `enableLookups` 为 false, 则为 IP 地址)
- **c-ip** - 远程 IP 地址
- **cs-method** - 请求方法(GET、POST 等)
- **cs-uri** - 请求 URI
- **cs-uri-query** - 查询字符串(如果存在, 会在前面加上 '?')
- **cs-uri-stem** - 请求的 URL 路径
- **date** - GMT 日期, 格式为 yyyy-mm-dd
- **s-dns** - 本地主机名
- **s-ip** - 本地 IP 地址
- **sc-status** - 响应的 HTTP 状态码
- **time** - 服务此请求的时间, GMT 格式为 HH:mm:ss
- **time-taken** - 服务此请求所花费的时间(秒, 浮点数)
- **x-threadname** - 当前请求的线程名(后续可以与堆栈跟踪比对)

对于任意 `x-H(XXX)`, 都会从 HttpServletRequest 对象调用以下方法:

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

此外还支持写入关于 headers、cookies、context、request 或 session 属性以及请求参数的信息。

- **cs(XXX)** 用于名为 XXX 的传入请求 header
- **sc(XXX)** 用于名为 XXX 的传出响应 header
- **x-A(XXX)** 用于名为 XXX 的 servlet context 属性
- **x-C(XXX)** 用于名为 XXX 的第一个 cookie
- **x-O(XXX)** 用于名为 XXX 的所有传出响应 header 的拼接
- **x-P(XXX)** 用于名为 XXX 的 URL 编码(使用 UTF-8)后的请求参数
- **x-R(XXX)** 用于名为 XXX 的 request 属性
- **x-S(XXX)** 用于名为 XXX 的 session 属性

### 访问控制(Access Control)

#### Remote Address Filter

#### 简介

**Remote Address Filter** 允许你将提交此请求的客户端 IP 地址与一个或多个*正则表达式*进行比较, 从而允许请求继续, 或者拒绝处理来自此客户端的请求。Remote Address Filter 可以关联到任意 Catalina 容器([Engine](https://tomcat.apache.org/tomcat-8.0-doc/config/engine.html)、[Host](https://tomcat.apache.org/tomcat-8.0-doc/config/host.html), 或者 [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html)), 并且必须先接受提交给此容器的任何请求进行处理, 然后才会继续传递。

*正则表达式*的语法与 '标准' 通配符匹配不同。Tomcat 使用 `java.util.regex` 包。关于所支持表达式的细节, 请查阅 Java 文档。

可选地, 可以附加用分号(";")分隔的服务器连接器端口, 以便为每个连接器配置不同的表达式。

请求被拒绝时的行为可以改为不拒绝, 而是设置一个无效的 `authentication` header。这与 context 属性 `preemptiveAuthentication="true"` 配合使用时很有用。

**注意:** 在 IPv6 地址下使用此 valve 时有一个需要注意的地方。此 valve 处理的 IP 地址格式取决于获取它时所用的 API。如果该地址是通过 Inet6Address 类从 Java socket 获取的, 其格式会是 `x:x:x:x:x:x:x:x`。也就是说, localhost 的 IP 地址会是 `0:0:0:0:0:0:0:1`, 而不是更常用的 `::1`。实际取值请查阅你的访问日志。

另见: [Remote Host Filter](https://tomcat.apache.org/tomcat-8.0-doc/config/valve.html#Remote_Host_Filter), [Remote IP Valve](https://tomcat.apache.org/tomcat-8.0-doc/config/valve.html#Remote_IP_Valve)。

#### 属性

**Remote Address Filter** 支持以下配置属性:

| 属性                            | 描述                                       |
| ------------------------------- | ---------------------------------------- |
| **className**                   | 要使用的实现的 Java 类名。必须设置为 **org.apache.catalina.valves.RemoteAddrValve**。 |
| `allow`                         | 一个正则表达式(使用 `java.util.regex`), 远程客户端的 IP 地址会与它进行比较。如果指定了此属性, 则远程地址必须匹配, 该请求才会被接受。如果未指定此属性, 则所有请求都会被接受, 除非远程地址匹配某个 `deny` 模式。 |
| `deny`                          | 一个正则表达式(使用 `java.util.regex`), 远程客户端的 IP 地址会与它进行比较。如果指定了此属性, 则远程地址必须不匹配, 该请求才会被接受。如果未指定此属性, 请求是否被接受就只由 `allow` 属性决定。 |
| `denyStatus`                    | 拒绝被拒绝的请求时使用的 HTTP 响应状态码。默认值是 `403`。例如, 可以把它设置为 `404`。 |
| `addConnectorPort`              | 将用分号(";")分隔的服务器连接器端口附加到客户端 IP 地址后面。如果设置为 `true`, 则用 `allow` 和 `deny` 配置的表达式会与 `ADDRESS;PORT` 比较, 其中 `ADDRESS` 是客户端 IP 地址, `PORT` 是接收到该请求的 Tomcat 连接器端口。默认值是 `false`。 |
| `invalidAuthenticationWhenDeny` | 当请求应被拒绝时, 不拒绝, 而是设置一个无效的 `authentication` header。只有当 context 设置了属性 `preemptiveAuthentication="true"` 时才有效。已经存在的 `authentication` header 不会被覆盖。实际上, 即使应用没有配置安全约束, 这也会触发身份验证而不是拒绝。这可以与 `addConnectorPort` 结合使用, 根据客户端以及用于访问应用的连接器来触发身份验证。 |

#### 示例 1

只允许来自 localhost 的客户端访问:

```
<Valve className="org.apache.catalina.valves.RemoteAddrValve"
   allow="127\.\d+\.\d+\.\d+|::1|0:0:0:0:0:0:0:1"/>
```

#### 示例 2

允许来自 localhost 的客户端不受限制地访问, 但其他所有客户端只能访问 8443 端口:

```
<Valve className="org.apache.catalina.valves.RemoteAddrValve"
   addConnectorPort="true"
   allow="127\.\d+\.\d+\.\d+;\d*|::1;\d*|0:0:0:0:0:0:0:1;\d*|.*;8443"/>
```

#### 示例 3

允许不受限制地访问 8009 端口, 但如果应用是通过其他端口访问的, 则触发基本身份验证:

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

#### 简介

**Remote Host Filter** 允许你将提交此请求的客户端主机名与一个或多个*正则表达式*进行比较, 从而允许请求继续, 或者拒绝处理来自此客户端的请求。Remote Host Filter 可以关联到任意 Catalina 容器([Engine](https://tomcat.apache.org/tomcat-8.0-doc/config/engine.html)、[Host](https://tomcat.apache.org/tomcat-8.0-doc/config/host.html), 或者 [Context](https://tomcat.apache.org/tomcat-8.0-doc/config/context.html)), 并且必须先接受提交给此容器的任何请求进行处理, 然后才会继续传递。

*正则表达式*的语法与 '标准' 通配符匹配不同。Tomcat 使用 `java.util.regex` 包。关于所支持表达式的细节, 请查阅 Java 文档。

可选地, 可以附加用分号(";")分隔的服务器连接器端口, 以便为每个连接器配置不同的表达式。

请求被拒绝时的行为可以改为不拒绝, 而是设置一个无效的 `authentication` header。这与 context 属性 `preemptiveAuthentication="true"` 配合使用时很有用。

**注意:** 此 filter 处理的是方法 `ServletRequest.getRemoteHost()` 返回的值。为了让该方法返回正确的主机名, 你必须在 **Connector** 上启用 "DNS lookups" 特性。

另见: [Remote Address Filter](https://tomcat.apache.org/tomcat-8.0-doc/config/valve.html#Remote_Address_Filter), [HTTP Connector](https://tomcat.apache.org/tomcat-8.0-doc/config/http.html) 配置。

#### 属性

**Remote Host Filter** 支持以下配置属性:

| 属性                            | 描述                                       |
| ------------------------------- | ---------------------------------------- |
| **className**                   | 要使用的实现的 Java 类名。必须设置为 **org.apache.catalina.valves.RemoteHostValve**。 |
| `allow`                         | 一个正则表达式(使用 `java.util.regex`), 远程客户端的主机名会与它进行比较。如果指定了此属性, 则远程主机名必须匹配, 该请求才会被接受。如果未指定此属性, 则所有请求都会被接受, 除非远程主机名匹配某个 `deny` 模式。 |
| `deny`                          | 一个正则表达式(使用 `java.util.regex`), 远程客户端的主机名会与它进行比较。如果指定了此属性, 则远程主机名必须不匹配, 该请求才会被接受。如果未指定此属性, 请求是否被接受就只由 `allow` 属性决定。 |
| `denyStatus`                    | 拒绝被拒绝的请求时使用的 HTTP 响应状态码。默认值是 `403`。例如, 可以把它设置为 `404`。 |
| `addConnectorPort`              | 将用分号(";")分隔的服务器连接器端口附加到客户端主机名后面。如果设置为 `true`, 则用 `allow` 和 `deny` 配置的表达式会与 `HOSTNAME;PORT` 比较, 其中 `HOSTNAME` 是客户端主机名, `PORT` 是接收到该请求的 Tomcat 连接器端口。默认值是 `false`。 |
| `invalidAuthenticationWhenDeny` | 当请求应被拒绝时, 不拒绝, 而是设置一个无效的 `authentication` header。只有当 context 设置了属性 `preemptiveAuthentication="true"` 时才有效。已经存在的 `authentication` header 不会被覆盖。实际上, 即使应用没有配置安全约束, 这也会触发身份验证而不是拒绝。这可以与 `addConnectorPort` 结合使用, 根据客户端以及用于访问应用的连接器来触发身份验证。 |

### 代理支持(Proxies Support)

#### Remote IP Valve

#### 简介

这是 [mod_remoteip](http://httpd.apache.org/docs/trunk/mod/mod_remoteip.html) 的 Tomcat 移植版, 此 valve 会把请求中表面的客户端远程 IP 地址和主机名, 替换为代理或负载均衡器通过请求 header(例如 "X-Forwarded-For")提供的 IP 地址列表。

此 valve 的另一个功能是, 把表面上的 scheme(http/https)、server port 和 `request.secure` 替换为代理或负载均衡器通过请求 header(例如 "X-Forwarded-Proto")提供的值。

此 Valve 可以根据需要用在 `Engine`、`Host` 或 `Context` 级别。通常情况下, 这个 Valve 会用在 `Engine` 级别。

如果与 Remote Address/Host valve 一起使用, 则此 valve 应该先定义, 以确保传递给 Remote Address/Host valve 的是正确的客户端 IP 地址。

**注意:** 默认情况下, 此 valve 对写入访问日志的值没有影响。当请求处理离开该 valve 时, 会恢复原始值, 而这总是发生在访问日志记录之前。要把此 valve 设置的 remote address、remote host、server port 和 protocol 值传递给访问日志, 会将这些值放入 request 属性中。在此处发布这些值默认是启用的, 但 `AccessLogValve` 应该显式配置为使用它们。参见 `AccessLogValve` 的 `requestAttributesEnabled` 属性文档。

此 valve 设置的、可供访问日志使用的 request 属性名如下:

- `org.apache.catalina.AccessLog.RemoteAddr`
- `org.apache.catalina.AccessLog.RemoteHost`
- `org.apache.catalina.AccessLog.Protocol`
- `org.apache.catalina.AccessLog.ServerPort`
- `org.apache.tomcat.remoteAddr`

#### 属性

**Remote IP Valve** 支持以下配置属性:

| 属性                       | 描述                                       |
| -------------------------- | ---------------------------------------- |
| **className**              | 要使用的实现的 Java 类名。必须设置为 **org.apache.catalina.valves.RemoteIpValve**。 |
| `remoteIpHeader`           | 此 valve 读取的 HTTP Header 名称, 它保存着从请求客户端开始遍历的 IP 地址列表。如果未指定, 默认使用 `x-forwarded-for`。 |
| `internalProxies`          | 一个正则表达式(使用 `java.util.regex`), 代理的 IP 地址必须匹配它才会被视为内部代理。出现在 **remoteIpHeader** 中的内部代理会被信任, 并且不会出现在 **proxiesHeader** 的值中。如果未指定, 则使用默认值 `10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|169\.254\.\d{1,3}\.\d{1,3}|127\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.1[6-9]{1}\.\d{1,3}\.\d{1,3}|172\.2[0-9]{1}\.\d{1,3}\.\d{1,3}|172\.3[0-1]{1}\.\d{1,3}\.\d{1,3} `。 |
| `proxiesHeader`            | 此 valve 创建的 HTTP header 名称, 用于保存传入的 **remoteIpHeader** 中已经处理过的代理列表。如果未指定, 默认使用 `x-forwarded-by`。 |
| `requestAttributesEnabled` | 设置为 `true` 时, 设置 AccessLog 实现使用的 request 属性, 以覆盖请求返回的 remote address、remote host、server port 和 protocol 值。request 属性还用于让转发的远程地址显示在 Manager web 应用的状态页面上。如果未设置, 则使用默认值 `true`。 |
| `trustedProxies`           | 一个正则表达式(使用 `java.util.regex`), 代理的 IP 地址必须匹配它才会被视为受信任的代理。出现在 **remoteIpHeader** 中的受信任代理会被信任, 并且会出现在 **proxiesHeader** 的值中。如果未指定, 则不会信任任何代理。 |
| `protocolHeader`           | 此 valve 读取的 HTTP Header 名称, 它保存着客户端连接到代理所用的协议。如果未指定, 默认使用 `null`。 |
| `portHeader`               | 此 valve 读取的 HTTP Header 名称, 它保存着客户端连接到代理所用的端口。如果未指定, 默认使用 `null`。 |
| `protocolHeaderHttpsValue` | **protocolHeader** 的值, 用于表明这是一个 HTTPS 请求。如果未指定, 默认使用 `https`。 |
| `httpServerPort`           | 当 **protocolHeader** 表明是 `http` 协议且不存在 **portHeader** 时, `ServletRequest.getServerPort()` 返回的值。如果未指定, 默认使用 `80`。 |
| `httpsServerPort`          | 当 **protocolHeader** 表明是 `https` 协议且不存在 **portHeader** 时, `ServletRequest.getServerPort()` 返回的值。如果未指定, 默认使用 `443`。 |
| `changeLocalPort`          | 如果为 `true`, 则 `ServletRequest.getLocalPort()` 和 `ServletRequest.getServerPort()` 返回的值会被此 valve 修改。如果未指定, 默认使用 `false`。 |

#### SSL Valve

#### 简介

使用 mod_proxy_http 时, 客户端的 SSL 信息并不包含在协议中(不像 mod_jk 和 mod_proxy_ajp)。要让 Tomcat 能获取客户端的 SSL 信息, 需要一些额外的配置。在 httpd 中, 使用 mod_headers 把 SSL 信息添加为 HTTP header。在 Tomcat 中, 则使用此 valve 从 HTTP header 中读取信息并插入到请求中。

注意: 确保 httpd 总是为所有请求设置这些 header, 以防止客户端通过发送伪造的 header 来欺骗 SSL 信息。

要配置 httpd 设置必要的 header, 请添加以下内容:

```
<IfModule ssl_module>
  RequestHeader set SSL_CLIENT_CERT "%{SSL_CLIENT_CERT}s"
  RequestHeader set SSL_CIPHER "%{SSL_CIPHER}s"
  RequestHeader set SSL_SESSION_ID "%{SSL_SESSION_ID}s"
  RequestHeader set SSL_CIPHER_USEKEYSIZE "%{SSL_CIPHER_USEKEYSIZE}s"
</IfModule>
```

#### 属性

**SSL Valve** 支持以下配置属性:

| 属性                         | 描述                                       |
| ---------------------------- | ---------------------------------------- |
| **className**                | 要使用的实现的 Java 类名。必须设置为 **org.apache.catalina.valves.SSLValve**。 |
| `sslClientCertHeader`        | 允许为 ssl_client_cert header 设置自定义名称。如果未指定, 默认使用 `ssl_client_cert`。 |
| `sslCipherHeader`            | 允许为 ssl_cipher header 设置自定义名称。如果未指定, 默认使用 `ssl_cipher`。 |
| `sslSessionIdHeader`         | 允许为 ssl_session_id header 设置自定义名称。如果未指定, 默认使用 `ssl_session_id`。 |
| `sslCipherUserKeySizeHeader` | 允许为 ssl_cipher_usekeysize header 设置自定义名称。如果未指定, 默认使用 `ssl_cipher_usekeysize`。 |

### 单点登录 Valve(Single Sign On Valve)

#### 简介

当你希望让用户可以登录到与你虚拟主机关联的任意一个 web 应用, 然后其身份能被同一虚拟主机上的所有其他 web 应用识别时, 就会用到 *Single Sign On Valve*。

更多信息参见 **Host** 元素上的 [Single Sign On](https://tomcat.apache.org/tomcat-8.0-doc/config/host.html#Single_Sign_On) 特殊特性。

#### 属性

**Single Sign On** Valve 支持以下配置属性:

| 属性                      | 描述                                       |
| ------------------------- | ---------------------------------------- |
| **className**             | 要使用的实现的 Java 类名。必须设置为 **org.apache.catalina.authenticator.SingleSignOn**。 |
| `requireReauthentication` | 默认为 false。用于确定是否需要对每个请求向安全 **Realm** 重新进行身份验证的标志。如果为 "true", 此 Valve 会使用缓存的安全凭证(用户名和密码), 对与某个 SSO session 关联的每个请求向 **Realm** 重新进行身份验证。如果为 "false", 此 Valve 可以自行根据有效的 SSO cookie 的存在来对请求进行身份验证, 而无需向 **Realm** 重新核对。 |
| `cookieDomain`            | 设置用于 sso cookie 的主机域。 |

### 错误报告 Valve(Error Report Valve)

#### 简介

**Error Report Valve** 是一个简单的 HTTP 状态码错误处理器, 会生成并返回 HTML 错误页面。

**注意:** 同时禁用 showServerInfo 和 showReport 将只返回 HTTP 状态码, 并移除所有 CSS。

#### 属性

**Error Report Valve** 支持以下配置属性:

| 属性             | 描述                                       |
| ---------------- | ---------------------------------------- |
| **className**    | 要使用的实现的 Java 类名。必须设置为 **org.apache.catalina.valves.ErrorReportValve** 才能使用默认的 error report valve。 |
| `showReport`     | 用于确定发生错误时是否展示错误报告的标志。如果设置为 `false`, 则 HTML 响应中不包含错误报告。默认值: `true` |
| `showServerInfo` | 用于确定发生错误时是否展示服务器信息的标志。如果设置为 `false`, 则 HTML 响应中不返回服务器版本。默认值: `true` |

### 爬虫会话管理 Valve(Crawler Session Manager Valve)

#### 简介

Web 爬虫爬取站点时可能会触发创建成千上万个 session, 这可能导致内存占用显著增加。此 Valve 确保爬虫 - 就像普通用户一样 - 与单个 session 关联, 无论它们在请求中是否提供了 session token。

此 Valve 可以根据需要用在 `Engine`、`Host` 或 `Context` 级别。通常情况下, 这个 Valve 会用在 `Engine` 级别。

如果与 Remote IP valve 一起使用, 则 Remote IP valve 应该先于此 valve 定义, 以确保传递给此 valve 的是正确的客户端 IP 地址。

#### 属性

**Crawler Session Manager Valve** 支持以下配置属性:

| 属性                      | 描述                                       |
| ------------------------- | ---------------------------------------- |
| **className**             | 要使用的实现的 Java 类名。必须设置为 **org.apache.catalina.valves.CrawlerSessionManagerValve**。 |
| `crawlerIps`              | 一个正则表达式(使用 `java.util.regex`), 客户端 IP 会与它进行匹配, 以确定请求是否来自 web 爬虫。默认情况下不设置这样的正则表达式。 |
| `crawlerUserAgents`       | 一个正则表达式(使用 `java.util.regex`), user agent HTTP 请求 header 会与它进行匹配, 以确定请求是否来自 web 爬虫。如果未设置, 则使用默认值 `.*[bB]ot.*|.*Yahoo! Slurp.*|.*Feedfetcher-Google.*`。 |
| `sessionInactiveInterval` | Crawler Session Manager Valve 在客户端没有任何活动的情况下, 应该在内存中保留客户端 IP 到 session ID 映射的最短时间(秒)。客户端 IP / session 缓存会定期清除不活跃时间超过此间隔的映射。如果未指定, 则使用默认值 `60`。 |

### 卡住线程检测 Valve(Stuck Thread Detection Valve)

#### 简介

此 valve 允许检测处理耗时很长的请求, 这可能表明处理该请求的线程卡住了。此外, 它还可以选择性地中断这类线程, 以尝试解除阻塞。

当检测到此类请求时, 会将该线程的当前堆栈跟踪以 WARN 级别写入 Tomcat 日志。

卡住线程的 ID 和名称可以通过 JMX 的 `stuckThreadIds` 和 `stuckThreadNames` 属性获取。这些 ID 可以与标准的 Threading JVM MBean(`java.lang:type=Threading`)一起使用, 以获取每个卡住线程的其他信息。

#### 属性

**Stuck Thread Detection Valve** 支持以下配置属性:

| 属性                       | 描述                                       |
| -------------------------- | ---------------------------------------- |
| **className**              | 要使用的实现的 Java 类名。必须设置为 **org.apache.catalina.valves.StuckThreadDetectionValve**。 |
| `threshold`                | 线程被视为卡住之前的最短持续时间(秒)。默认是 600 秒。如果设置为 0, 则禁用检测。注意: 由于检测(以及可选的中断)是在声明此 Valve 的 Container(Engine、Host 或 Context)的后台线程中完成的, 因此 threshold 应该高于该 Container 的 `backgroundProcessorDelay`。 |
| `interruptThreadThreshold` | 尝试"释放"一个卡住的线程而对其发起中断之前的最短持续时间(秒)。注意, 不能保证线程会解除卡住状态。对于卡在 I/O 或锁上的线程, 这通常效果不错, 但在无限循环的情况下可能就没用了。默认是 -1, 表示禁用此特性。要启用它, 该值必须大于或等于 `threshold`。 |

### 信号量 Valve(Semaphore Valve)

#### 简介

**Semaphore Valve** 能够限制并发请求处理线程的数量。

**org.apache.catalina.valves.SemaphoreValve** 提供了一些方法, 子类可以覆盖它们来自定义行为:

- **controlConcurrency** 可以被覆盖以添加条件;
- **permitDenied** 可以被覆盖以在未授予许可时添加错误处理。

#### 属性

**Semaphore Valve** 支持以下配置属性:

| 属性            | 描述                                       |
| --------------- | ---------------------------------------- |
| `block`         | 用于确定线程是否会被阻塞直到有可用许可的标志。默认值是 **true**。 |
| **className**   | 要使用的实现的 Java 类名。必须设置为 **org.apache.catalina.valves.SemaphoreValve**。 |
| `concurrency`   | 信号量的并发级别。默认值是 **10**。 |
| `fairness`      | 信号量的公平性。默认值是 **false**。 |
| `interruptible` | 用于确定在等待可用许可期间线程是否可以被中断的标志。默认值是 **false**。 |



参考:  <https://www.oxxus.net/tutorials/tomcat/tomcat-valve>

原文链接: <https://tomcat.apache.org/tomcat-8.0-doc/config/valve.html>
