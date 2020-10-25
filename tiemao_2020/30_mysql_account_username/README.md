# MySQL用户帐号命名规范


MySQL account names consist of a user name and a host name, which enables creation of distinct accounts for users with the same user name who can connect from different hosts. This section describes how to write account names, including special values and wildcard rules.

MySQL role names are similar to account names, with some differences described at [Section 6.2.5, “Specifying Role Names”](https://dev.mysql.com/doc/refman/8.0/en/role-names.html).

In SQL statements such as [`CREATE USER`](https://dev.mysql.com/doc/refman/8.0/en/create-user.html), [`GRANT`](https://dev.mysql.com/doc/refman/8.0/en/grant.html), and [`SET PASSWORD`](https://dev.mysql.com/doc/refman/8.0/en/set-password.html), account names follow these rules:

MySQL用户帐号名称(Account Names)由两部分共同组成:

- 用户名(user name)
- 主机名(host name)

即使是同一个用户名，但连接的客户端主机不同，在MySQL看来可能就是不同的帐户。
本文简单介绍帐号的命名规则，以及特殊值处理，通配符规则。

MySQL角色命名规则与帐号命名类似，细微的差别请参考: [Section 6.2.5, “Specifying Role Names”](https://dev.mysql.com/doc/refman/8.0/en/role-names.html)。

在 [`CREATE USER`](https://dev.mysql.com/doc/refman/8.0/en/create-user.html), [`GRANT`](https://dev.mysql.com/doc/refman/8.0/en/grant.html), 以及 [`SET PASSWORD`](https://dev.mysql.com/doc/refman/8.0/en/set-password.html) 语句中, 帐号命名遵循以下规则:

- Account name syntax is  `'user_name'@'host_name'` .
- An account name consisting only of a user name is equivalent to  `'user_name'@'％'`. For example, `'me'` is equivalent to `'me'@'%'`.
- The user name and host name need not be quoted if they are legal as unquoted identifiers. Quotes are necessary to specify a *`user_name`* string containing special characters (such as space or `-`), or a *`host_name`* string containing special characters or wildcard characters (such as `.` or `%`). For example, in the account name `'test-user'@'%.com'`, both the user name and host name parts require quotes.
- Quote user names and host names as identifiers or as strings, using either backticks (```), single quotation marks (`'`), or double quotation marks (`"`). For string-quoting and identifier-quoting guidelines, see [Section 9.1.1, “String Literals”](https://dev.mysql.com/doc/refman/8.0/en/string-literals.html), and [Section 9.2, “Schema Object Names”](https://dev.mysql.com/doc/refman/8.0/en/identifiers.html).
- The user name and host name parts, if quoted, must be quoted separately. That is, write `'me'@'localhost'`, not `'me@localhost'`. The latter is actually equivalent to `'me@localhost'@'%'`.
- A reference to the [`CURRENT_USER`](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_current-user) or [`CURRENT_USER()`](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_current-user) function is equivalent to specifying the current client's user name and host name literally.

- 帐户名称的格式为: `'user_name'@'host_name'`;
- 如果只指定用户名，则等价于 `'user_name'@'％'`; 例如，`'me'` 等效于 `'me'@'%'`。
- 如果用户名和主机名是合法的标识符，则不需要用引号引起来。  必须用引号的情形包括:
  * 用户名中包含特殊字符（例如空格或 `-`）;
  * 主机名部分包含特殊字符或通配符（例如`.`或`％`）。
  * 例如, 在帐户名 `'test-user'@'%.com'` 中，用户名和主机名部分都需要加引号。
- 可以使用反引号（```）、单引号（`'`）或双引号（`"`）将用户名和主机名作为标识符或字符串引起来。 有关字符串引用和标识符引用的具体规则，请参考: [Section 9.1.1, “String Literals”](https://dev.mysql.com/doc/refman/8.0/en/string-literals.html), 以及  [Section 9.2, “Schema Object Names”](https://dev.mysql.com/doc/refman/8.0/en/identifiers.html)。
- 用户名和主机名要分别加引号。
  * 正确示例: `'me'@'localhost'`;
  * 错误示例: `'me@localhost'`; 因为这等价于 `'me@localhost'@'%'`。
- 对 [`CURRENT_USER`](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_current-user) 或者函数 [`CURRENT_USER()`](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_current-user) 的引用, 等效于从字面上指定当前客户端的用户名和主机名。

MySQL stores account names in grant tables in the `mysql` system database using separate columns for the user name and host name parts:

- The `user` table contains one row for each account. The `User` and `Host` columns store the user name and host name. This table also indicates which global privileges the account has.

- Other grant tables indicate privileges an account has for databases and objects within databases. These tables have `User` and `Host` columns to store the account name. Each row in these tables associates with the account in the `user` table that has the same `User` and `Host` values.

- For access-checking purposes, comparisons of User values are case-sensitive. Comparisons of Host values are not case sensitive.

MySQL在系统数据库 `mysql` 的授权表中保存帐号信息，而且使用不同的列来保存 用户名 和 主机名:

- `user`表中的每一行表示一个帐号。`User` 和 `Host` 列是对应的用户名和主机名。 该表还保存了每个帐户具有的全局权限。
- 其他的授权表, 指定了每个帐户具有哪些数据库级别，以及数据库中对象的权限。 这些表也有 `User` 和 `Host` 列来保存帐户名称。 每一行都与 `user` 表中相同 `User` 和 `Host` 值的帐户关联。
- 在进行权限检查时，`User` 值是区分大小写。 `Host值则不区分大小写。



For additional detail about the properties of user names and host names as stored in the grant tables, such as maximum length, see [Grant Table Scope Column Properties](https://dev.mysql.com/doc/refman/8.0/en/grant-tables.html#grant-tables-scope-column-properties).

User names and host names have certain special values or wildcard conventions, as described following.

The user name part of an account name is either a nonblank value that literally matches the user name for incoming connection attempts, or a blank value (empty string) that matches any user name. An account with a blank user name is an anonymous user. To specify an anonymous user in SQL statements, use a quoted empty user name part, such as `''@'localhost'`.

授权信息表中存储的用户名和主机名的其他属性（例如最大长度），请参考 [Grant Table Scope Column Properties](https://dev.mysql.com/doc/refman/8.0/en/grant-tables.html#grant-tables-scope-column-properties)。

用户名和主机名具有某些特殊值或通配符约定，如下所述。

用户名部分可以是:

- 非空白的值(nonblank value)，该值与客户端尝试连接时的用户名在字面上匹配，
- 如果是一个空白值（空字符串），则与任何用户名相匹配。 用户名为空的帐户也就是匿名用户。 要在SQL语句中指定匿名用户，请使用引号把空用户名引起来，例如 `''@'localhost'`。

The host name part of an account name can take many forms, and wildcards are permitted:

- A host value can be a host name or an IP address (IPv4 or IPv6). The name `'localhost'` indicates the local host. The IP address `'127.0.0.1'` indicates the IPv4 loopback interface. The IP address `'::1'` indicates the IPv6 loopback interface.

- The `%` and `_` wildcard characters are permitted in host name or IP address values. These have the same meaning as for pattern-matching operations performed with the [`LIKE`](https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html#operator_like) operator. For example, a host value of `'%'` matches any host name, whereas a value of `'%.mysql.com'` matches any host in the `mysql.com` domain. `'198.51.100.%'` matches any host in the 198.51.100 class C network.

  Because IP wildcard values are permitted in host values (for example, `'198.51.100.%'` to match every host on a subnet), someone could try to exploit this capability by naming a host `198.51.100.somewhere.com`. To foil such attempts, MySQL does not perform matching on host names that start with digits and a dot. For example, if a host is named `1.2.example.com`, its name never matches the host part of account names. An IP wildcard value can match only IP addresses, not host names.

主机名部分可以采用多种形式，并且支持通配符：

- 主机名的值可以是 host name 或IP地址（IPv4或IPv6）。 `'localhost'` 表示本机。 `'127.0.0.1'` 表示本机的IPv4回环地址。 `'::1'` 则表示本机的IPv6回环地址。

- host name 或IP地址中允许使用 `%` 和 `_` 通配符。 就和SQL标准中 [`LIKE`](https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html#operator_like) 部分的匹配操作一致。 例如，主机值 `'%'` 与所有主机名匹配，而 `'%.mysql.com'` 则与 `mysql.com` 域中的所有主机匹配。 `'198.51.100.%'` 值则与 198.51.100 网段的所有主机匹配。
  * 特殊情况: 由于主机值中允许使用IP通配符值，会出现一种安全漏洞, 例如 `'198.51.100.%'` 会匹配子网网段, 有人可能通过命名主机 `198.51.100.somewhere.com` 来尝试利用此漏洞。 所以为了屏蔽这种风险，MySQL不会对以数字和英文点号开头的主机名执行匹配。例如，如果主机名为 `1.2.example.com`，则永远不会与任何账号相匹配。  IP通配符只能匹配IP地址，而不会匹配主机名。

- For a host value specified as an IPv4 address, a netmask can be given to indicate how many address bits to use for the network number. Netmask notation cannot be used for IPv6 addresses.

The syntax is `host_ip/netmask`. For example:

```sql
CREATE USER 'david'@'198.51.100.0/255.255.255.0';
```

This enables `david` to connect from any client host having an IP address `client_ip` for which the following condition is true:

```c
client_ip & netmask = host_ip
```

That is, for the [`CREATE USER`](https://dev.mysql.com/doc/refman/8.0/en/create-user.html) statement just shown:

```c
client_ip & 255.255.255.0 = 198.51.100.0
```

IP addresses that satisfy this condition range from `198.51.100.0` to `198.51.100.255`.

A netmask typically begins with bits set to 1, followed by bits set to 0. Examples:

- `198.0.0.0/255.0.0.0`: Any host on the 198 class A network
- `198.51.100.0/255.255.0.0`: Any host on the 198.51 class B network
- `198.51.100.0/255.255.255.0`: Any host on the 198.51.100 class C network
- `198.51.100.1`: Only the host with this specific IP address

- 对于指定为IPv4地址的主机值，可以指定网络掩码，以标识出有多少bit用于网络编号。 网络掩码不能用于IPv6地址。
  * 语法格式为 `host_ip/netmask`。例如：

```sql
CREATE USER 'david'@'198.51.100.0/255.255.255.0';
```

则允许 `david` 从满足以下条件的所有IP地址登录 ：

```c
client_ip & netmask = host_ip
```

对于刚刚通过 [`CREATE USER`](https://dev.mysql.com/doc/refman/8.0/en/create-user.html) 创建的用户来说：

```c
client_ip & 255.255.255.0 = 198.51.100.0
```

满足此条件的IP地址的范围是 `198.51.100.0` 到 `198.51.100.255`。

网络掩码通常以二进制为1的bit开始，后面跟着bit是0的位，示例:

- `198.0.0.0/255.0.0.0`: 以 198 打头的 A 类地址
- `198.51.100.0/255.255.0.0`: 以 198.51  打头的 B 类地址
- `198.51.100.0/255.255.255.0`: 以 198.51.100 打头的 C 类地址
- `198.51.100.1`: 只匹配具有该特定IP地址的主机

The server performs matching of host values in account names against the client host using the value returned by the system DNS resolver for the client host name or IP address. Except in the case that the account host value is specified using netmask notation, the server performs this comparison as a string match, even for an account host value given as an IP address. This means that you should specify account host values in the same format used by DNS. Here are examples of problems to watch out for:

- Suppose that a host on the local network has a fully qualified name of `host1.example.com`. If DNS returns name lookups for this host as `host1.example.com`, use that name in account host values. If DNS returns just `host1`, use `host1` instead.
- If DNS returns the IP address for a given host as `198.51.100.2`, that will match an account host value of `198.51.100.2` but not `198.051.100.2`. Similarly, it will match an account host pattern like `198.51.100.%` but not `198.051.100.%`.

To avoid problems like these, it is advisable to check the format in which your DNS returns host names and addresses. Use values in the same format in MySQL account names.


MySQL服务器匹配账户中的host值时，可以匹配客户端的IP地址，或者是系统DNS解析返回的客户端主机名。
除开网络掩码表示法的那部分帐户主机值以外，服务器甚至会以字符串比较的形式执行匹配，即使是将帐户主机值指定为IP地址也是如此。
这意味着我们应该以DNS返回的格式来指定帐户主机值。以下是需要注意的问题：

- 假设本地网络中的主机具有完全限定名称 `host1.example.com`。 如果DNS查找时以 `host1.example.com` 的形式返回此主机的名称，则帐户中的主机值部分就需要使用该名称。如果DNS只返回 `host1` ，则改用 `host1`。
- 如果DNS为某台主机返回了IP地址 `198.51.100.2`，则它将与帐户中的主机值 `198.51.100.2` 匹配，但不会与 `198.051.100.2`匹配。 同样，它将匹配host模式为 `198.51.100.%` 的账号, 但不匹配 `198.051.100.%`.

为避免此类问题，请确认DNS系统返回的主机名和地址格式。在MySQL帐户名称中也使用相同格式的值。



## 参考链接

- [MySQL官方文档: Specifying Account Names](https://dev.mysql.com/doc/refman/8.0/en/account-names.html)
