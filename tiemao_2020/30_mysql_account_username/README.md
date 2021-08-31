# MySQL帐号命名规范

> 中英双语对照版请查看: [GitHub中英对照版: MySQL帐号命名规范](https://github.com/cncounter/translation/blob/master/tiemao_2020/30_mysql_account_username/README.md)

MySQL account names consist of a user name and a host name, which enables creation of distinct accounts for users with the same user name who can connect from different hosts. This section describes how to write account names, including special values and wildcard rules.

MySQL role names are similar to account names, with some differences described at [Section 6.2.5, “Specifying Role Names”](https://dev.mysql.com/doc/refman/8.0/en/role-names.html).

In SQL statements such as [`CREATE USER`](https://dev.mysql.com/doc/refman/8.0/en/create-user.html), [`GRANT`](https://dev.mysql.com/doc/refman/8.0/en/grant.html), and [`SET PASSWORD`](https://dev.mysql.com/doc/refman/8.0/en/set-password.html), account names follow these rules:

MySQL用户的帐号名称(Account Name)由两部分组成:

- 1. 用户名(user name)
- 2. 主机名(host name)

所以即使用户名部分相同, 只要登录的客户端IP不同, MySQL服务器可能就会匹配到不同的帐号。

本文简要介绍帐号的命名规则, 以及特殊值(special value)处理规则和通配符规则(wildcard rule)。

MySQL角色的命名规则与帐号命名类似, 细微差别请参考: [Section 6.2.5, “Specifying Role Names”](https://dev.mysql.com/doc/refman/8.0/en/role-names.html)。

在 [`CREATE USER`](https://dev.mysql.com/doc/refman/8.0/en/create-user.html), [`GRANT`](https://dev.mysql.com/doc/refman/8.0/en/grant.html), 以及 [`SET PASSWORD`](https://dev.mysql.com/doc/refman/8.0/en/set-password.html) 等SQL语句中, 帐号命名遵循以下规则:

- Account name syntax is  `'user_name'@'host_name'` .
- An account name consisting only of a user name is equivalent to  `'user_name'@'％'`. For example, `'me'` is equivalent to `'me'@'%'`.
- The user name and host name need not be quoted if they are legal as unquoted identifiers. Quotes are necessary to specify a *`user_name`* string containing special characters (such as space or `-`), or a *`host_name`* string containing special characters or wildcard characters (such as `.` or `%`). For example, in the account name `'test-user'@'%.com'`, both the user name and host name parts require quotes.
- Quote user names and host names as identifiers or as strings, using either backticks (\`), single quotation marks (`'`), or double quotation marks (`"`). For string-quoting and identifier-quoting guidelines, see [Section 9.1.1, “String Literals”](https://dev.mysql.com/doc/refman/8.0/en/string-literals.html), and [Section 9.2, “Schema Object Names”](https://dev.mysql.com/doc/refman/8.0/en/identifiers.html).
- The user name and host name parts, if quoted, must be quoted separately. That is, write `'me'@'localhost'`, not `'me@localhost'`. The latter is actually equivalent to `'me@localhost'@'%'`.
- A reference to the [`CURRENT_USER`](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_current-user) or [`CURRENT_USER()`](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_current-user) function is equivalent to specifying the current client's user name and host name literally.

- 1、帐号名称的格式为: `'user_name'@'host_name'`;
- 2、如果只指定了 user_name, 则等价于 `'user_name'@'％'`; 例如, `'me'` 等价于 `'me'@'%'`。
- 3、如果用户名和主机名是合法的标识符, 则可以省略引号。 否则必须用引号引起来, 包括以下情形:
  * 用户名中包含特殊字符(例如空格或者横线 `-`);
  * 主机名部分包含特殊字符或通配符(例如`.`或者`％`)。
  * 示例: 如果帐号名是 `'test-user'@'%.com'`, 那么用户名部分和主机名部分都必须用引号引起来。
- 4、可以使用反引号(\`, backticks, 点顿号)、单引号(`'`, single quotation marks) 或者双引号(`"`, double quotation marks)将用户名和主机名当做标识符/字符串引起来。 关于字符串引用和标识符引用的具体规则, 请参考: [Section 9.1.1, “String Literals”](https://dev.mysql.com/doc/refman/8.0/en/string-literals.html) 和  [Section 9.2, “Schema Object Names”](https://dev.mysql.com/doc/refman/8.0/en/identifiers.html)。
- 5、用户名和主机名是两个部分, 要分别加引号。
  * 正确示例: `'me'@'localhost'`;
  * 错误示例: `'me@localhost'`; 因为这样写就等价于 `'me@localhost'@'%'`。
- 6、对 [`CURRENT_USER`](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_current-user) 关键字和 [`CURRENT_USER()`](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_current-user) 函数的引用, 会被MySQL服务器解析为当前客户端的用户名和主机名所组成的字符串。

MySQL stores account names in grant tables in the `mysql` system database using separate columns for the user name and host name parts:

- The `user` table contains one row for each account. The `User` and `Host` columns store the user name and host name. This table also indicates which global privileges the account has.

- Other grant tables indicate privileges an account has for databases and objects within databases. These tables have `User` and `Host` columns to store the account name. Each row in these tables associates with the account in the `user` table that has the same `User` and `Host` values.

- For access-checking purposes, comparisons of User values are case-sensitive. Comparisons of Host values are not case sensitive.

帐号信息存储在内置的系统数据库 `mysql` 中, 使用多个授权信息表, 通过不同的列来存储 用户名 和 主机名:

- `user` 表中的每一行表示一个帐号。`User` 和 `Host` 列是对应的用户名和主机名。 该表还保存有每个帐号的全局权限。
- 其他授权表, 指定了每个帐号具有哪些数据库级和对象级权限。 这些表也使用 `User` 和 `Host` 列来保存帐号名称。 每一行都与 `user` 表中具有相同 `User` 和 `Host` 值的帐号进行关联。
- 在执行权限校验时, `User` 部分是大小写敏感的。 而 `Host` 部分则不区分大小写。


For additional detail about the properties of user names and host names as stored in the grant tables, such as maximum length, see [Grant Table Scope Column Properties](https://dev.mysql.com/doc/refman/8.0/en/grant-tables.html#grant-tables-scope-column-properties).

User names and host names have certain special values or wildcard conventions, as described following.

The user name part of an account name is either a nonblank value that literally matches the user name for incoming connection attempts, or a blank value (empty string) that matches any user name. An account with a blank user name is an anonymous user. To specify an anonymous user in SQL statements, use a quoted empty user name part, such as `''@'localhost'`.

授权信息表中用户名和主机名对应的列还有一些其他属性(例如最大长度), 可以参考 [Grant Table Scope Column Properties](https://dev.mysql.com/doc/refman/8.0/en/grant-tables.html#grant-tables-scope-column-properties)。

用户名和主机名支持通配符以及一些特殊值, 如下所述。

用户名部分可以是:

- 如果用户名是非空白值(nonblank value), 客户端连接时使用的用户名必须在字符上与这个值完全一致,
- 如果用户名是一个空白值(空字符串), 则可以和任意用户名匹配。 帐号中用户名为空, 也就是匿名用户。 要在SQL中指定匿名用户, 请使用引号把空串作为用户名引起来, 例如 `''@'localhost'`。

The host name part of an account name can take many forms, and wildcards are permitted:

- A host value can be a host name or an IP address (IPv4 or IPv6). The name `'localhost'` indicates the local host. The IP address `'127.0.0.1'` indicates the IPv4 loopback interface. The IP address `'::1'` indicates the IPv6 loopback interface.

- The `%` and `_` wildcard characters are permitted in host name or IP address values. These have the same meaning as for pattern-matching operations performed with the [`LIKE`](https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html#operator_like) operator. For example, a host value of `'%'` matches any host name, whereas a value of `'%.mysql.com'` matches any host in the `mysql.com` domain. `'198.51.100.%'` matches any host in the 198.51.100 class C network.

> Because IP wildcard values are permitted in host values (for example, `'198.51.100.%'` to match every host on a subnet), someone could try to exploit this capability by naming a host `198.51.100.somewhere.com`. To foil such attempts, MySQL does not perform matching on host names that start with digits and a dot. For example, if a host is named `1.2.example.com`, its name never matches the host part of account names. An IP wildcard value can match only IP addresses, not host names.

主机名可以支持多种格式, 还可以使用通配符:

- 主机名, 可以是域名(host name) 或者是 IP地址(支持IPv4/IPv6)。 `'localhost'` 表示本机。 `'127.0.0.1'` 表示本机的IPv4回环地址。 `'::1'` 则表示本机的IPv6回环地址。

- `%` 和 `_` 通配符可以模糊匹配主机名和IP地址。 匹配规则和SQL标准中的 [`LIKE`](https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html#operator_like) 语句一致。 例如, 百分号 `'%'` 与所有主机名匹配, 而 `'%.mysql.com'` 则与 `mysql.com` 域中的所有主机匹配。 而 `'198.51.100.%'` 则与 198.51.100 网段下的所有C类地址匹配。

> 特殊情况: 由于主机名可以使用IP地址通配符, 那么就会存在一个逻辑上的安全漏洞。 例如 `'198.51.100.%'` 本来是想要匹配子网网段的, 但如果有黑客通过映射域名 `198.51.100.somedomain.com` 来攻击这个漏洞怎么办呢? 为了杜绝这种风险, MySQL服务器不会对以【数字加上英文点号(`.`)】开头的域名执行模糊匹配。 例如, 如果客户端的主机名是 `1.2.example.com`, 则永远不会与任何帐号的主机部分进行模糊匹配。  IP通配符只会匹配IP地址, 不会匹配域名。

- For a host value specified as an IPv4 address, a netmask can be given to indicate how many address bits to use for the network number. Netmask notation cannot be used for IPv6 addresses.

The syntax is `host_ip/netmask`. For example:


- 如果主机名指定为IPv4地址, 则可以同时指定子网掩码, 以标识出有多少bit用于子网编号。 子网掩码这种形式不支持IPv6地址。
  * 具体的语法格式为 `host_ip/netmask`。
  * 示例:

```sql
CREATE USER 'cncounter'@'198.51.100.0/255.255.255.0';
```

This enables `cncounter` to connect from any client host having an IP address `client_ip` for which the following condition is true:


这个帐号允许 `cncounter` 用户从IP地址满足以下条件的所有客户端进行登录:


```c
client_ip & netmask = host_ip
```

That is, for the [`CREATE USER`](https://dev.mysql.com/doc/refman/8.0/en/create-user.html) statement just shown:

对于上面通过 [`CREATE USER`](https://dev.mysql.com/doc/refman/8.0/en/create-user.html) 创建的用户 `cncounter` 来说:

```c
# 按位与运算
client_ip & 255.255.255.0 = 198.51.100.0
```

IP addresses that satisfy this condition range from `198.51.100.0` to `198.51.100.255`.

A netmask typically begins with bits set to 1, followed by bits set to 0. Examples:

- `198.0.0.0/255.0.0.0`: Any host on the 198 class A network
- `198.51.100.0/255.255.0.0`: Any host on the 198.51 class B network
- `198.51.100.0/255.255.255.0`: Any host on the 198.51.100 class C network
- `198.51.100.1`: Only the host with this specific IP address


满足此条件的IP地址的范围是 `198.51.100.0` 到 `198.51.100.255`。

子网掩码通常以二进制位等于 `1` 的bit开始, 后面跟着bit是0的位, 示例:

- `198.0.0.0/255.0.0.0`: 以 198 打头的 A 类地址
- `198.51.100.0/255.255.0.0`: 以 198.51  打头的 B 类地址
- `198.51.100.0/255.255.255.0`: 以 198.51.100 打头的 C 类地址
- `198.51.100.1`: 只匹配具有特定IP地址的主机

The server performs matching of host values in account names against the client host using the value returned by the system DNS resolver for the client host name or IP address. Except in the case that the account host value is specified using netmask notation, the server performs this comparison as a string match, even for an account host value given as an IP address. This means that you should specify account host values in the same format used by DNS. Here are examples of problems to watch out for:

- Suppose that a host on the local network has a fully qualified name of `host1.example.com`. If DNS returns name lookups for this host as `host1.example.com`, use that name in account host values. If DNS returns just `host1`, use `host1` instead.
- If DNS returns the IP address for a given host as `198.51.100.2`, that will match an account host value of `198.51.100.2` but not `198.051.100.2`. Similarly, it will match an account host pattern like `198.51.100.%` but not `198.051.100.%`.

To avoid problems like these, it is advisable to check the format in which your DNS returns host names and addresses. Use values in the same format in MySQL account names.


MySQL服务器对帐号中的host值进行匹配时, 可以使用客户端的IP地址, 也可以使用系统DNS解析返回的客户端主机名。

除了子网掩码格式的主机值, 服务器会对其他格式的主机值以字符串形式进行匹配, 即使是将帐号的主机值指定为IP地址也是如此。 也就是说, 我们应该以DNS返回的格式为准, 来指定帐号的host部分。

下面是需要注意的问题:

- 假设本地局域网中有一台主机的完全限定名称为 `host1.example.com`。 如果DNS系统返回的值为 `host1.example.com`, 则帐号中的主机值部分就需要使用这个名称。 如果DNS系统返回的是 `host1` , 则应该使用 `host1`。
- 如果DNS为某个客户端返回了IP地址格式的主机名 `198.51.100.2`, 则它将与帐号中的主机值 `198.51.100.2` 相匹配, 但不会与多了个0的 `198.051.100.2` 匹配。 同样, 这个IP可以匹配host模式为 `198.51.100.%` 的帐号, 但不会匹配 `198.051.100.%`.

为了避免此类问题, 请确认DNS返回的主机名和地址格式。 在MySQL帐号的主机名称中也使用相同格式的值。



## 参考链接

- [MySQL官方文档: Specifying Account Names](https://dev.mysql.com/doc/refman/8.0/en/account-names.html)
- [GitHub中英对照版: MySQL帐号命名规范](https://github.com/cncounter/translation/blob/master/tiemao_2020/30_mysql_account_username/README.md)
