# Redis Security

# Redis安全性说明文档

This document provides an introduction to the topic of security from the point of view of Redis: the access control provided by Redis, code security concerns, attacks that can be triggered from the outside by selecting malicious inputs and other similar topics are covered.

本文简要介绍 Redis 安全相关的话题, 包括:  Redis访问控制机制、Redis源码安全性, 外部输入可能触发的恶意攻击, 以及其他相关问题。

For security related contacts please open an issue on GitHub, or when you feel it is really important that the security of the communication is preserved, use the GPG key at the end of this document.

如果要反馈安全问题, 请到 [GitHub](https://github.com/antirez/redis) 上提出 [issue](https://github.com/antirez/redis/issues), 当然, 如果需要私密通信, 请使用文末提供的 GPG key。

## Redis general security model

## Redis 总体安全模型

Redis is designed to be accessed by trusted clients inside trusted environments. This means that usually it is not a good idea to expose the Redis instance directly to the internet or, in general, to an environment where untrusted clients can directly access the Redis TCP port or UNIX socket.

Redis 设想的运行环境, 是与受信客户端在内网中进行通讯. 也就是说, Redis 实例不应该直接暴露到公网上, 也不应该让不受信的客户机直连到 Redis 的 TCP端口/或UNIX socket。

For instance, in the common context of a web application implemented using Redis as a database, cache, or messaging system, the clients inside the front-end (web side) of the application will query Redis to generate pages or to perform operations requested or triggered by the web application user.

比如, 可以将 Redis 作为web系统的 database, cache, 或者 messaging system。 用户只能与web进行交互, 由WEB应用来进行查询或执行其他操作。

In this case, the web application mediates access between Redis and untrusted clients (the user browsers accessing the web application).

在这种情况下, web应用作为桥头堡, 连接 Redis, 避免Redis与不受信任的客户端(如浏览器)进行直接交互。

This is a specific example, but, in general, untrusted access to Redis should always be mediated by a layer implementing ACLs, validating user input, and deciding what operations to perform against the Redis instance.

这只是一中特定场景, 但总体说来, 不受信任的客户端与 Redis 之间, 必须有一层 ACL(访问控制层)实现, 用于鉴权和校验用户输入, 并决定是否对 Redis 实例执行操作。

In general, Redis is not optimized for maximum security but for maximum performance and simplicity.

总的来说, Redis 并没有为安全问题做过多设计, 最主要的原因是为了保证高性能, 以及使用简便。

## Network security

## 网络安全问题

Access to the Redis port should be denied to everybody but trusted clients in the network, so the servers running Redis should be directly accessible only by the computers implementing the application using Redis.

除了受信网络的客户端, 其他客户端发起的网络请求需要被拦截, 所以运行 Redis 服务的系统, 应该只允许使用 Redis 的那些应用程序直连。

In the common case of a single computer directly exposed to the internet, such as a virtualized Linux instance (Linode, EC2, ...), the Redis port should be firewalled to prevent access from the outside. Clients will still be able to access Redis using the loopback interface.

如果使用的是 Linux虚拟机(Linode, EC2, 等等), 因为这些机器可能直接暴露在公网上, 所以需要防火墙来保护 Redis 端口, 阻止外部访问。而本地的客户端则通过回环地址(loopback, 127.*.*.*)来访问Redis。

Note that it is possible to bind Redis to a single interface by adding a line like the following to the **redis.conf** file:

当然, 也可以将 Redis 端口直接绑定到本机的某块网卡/IP上, 在 **redis.conf** 配置文件中增加如下配置即可:

```
bind 127.0.0.1

```


Failing to protect the Redis port from the outside can have a big security impact because of the nature of Redis. For instance, a single **FLUSHALL** command can be used by an external attacker to delete the whole data set.

假如不对外部访问做隔离, 可能会带来严重的安全隐患. 例如, 攻击者只要执行一个 **FLUSHALL** 命令, 就能让Redis的所有数据Over。

## Protected mode

## 保护模式(Protected mode)

Unfortunately many users fail to protect Redis instances from being accessed from external networks. Many instances are simply left exposed on the internet with public IPs. For this reasons since version 3.2.0, when Redis is executed with the default configuration (binding all the interfaces) and without any password in order to access it, it enters a special mode called **protected mode**. In this mode Redis only replies to queries from the loopback interfaces, and reply to other clients connecting from other addresses with an error, explaining what is happening and how to configure Redis properly.

杯具的是, 许多 Redis 实例都没有拒绝外部网络的访问。很多情况下是暴露在公网服务器IP上. 由于这个原因, 从 3.2.0 版本开始, Redis 的默认配置(绑定所有网卡), 如果客户端连接没有设置密码, 则会进入一种特殊的模式, **保护模式(Protected mode)**. 在保护模式下, Redis 只允许本地回环地址访问, 其他地址的客户端连接时会返回错误信息, 解释具体原因以及如何配置。

We expect protected mode to seriously decrease the security issues caused by unprotected Redis instances executed without proper administration, however the system administrator can still ignore the error given by Redis and just disable protected mode or manually bind all the interfaces.

我们希望保护模式能够有效降低不受保护的Redis 实例所造成的安全问题, 当然, 系统管理员也可以忽略Redis给出的错误信息, 禁用保护模式, 或者手动绑定到所有网卡。

## Authentication feature

## 身份验证功能

While Redis does not try to implement Access Control, it provides a tiny layer of authentication that is optionally turned on editing the **redis.conf** file.

虽然 Redis 不实现访问控制, 但也提供了一个小小的 身份验证层(authorization layer), 可以通过 **redis.conf** 文件来开启。

When the authorization layer is enabled, Redis will refuse any query by unauthenticated clients. A client can authenticate itself by sending the **AUTH** command followed by the password.

如果启用了 身份验证层, Redis 将拒绝未经身份验证的客户端查询。客户端可以通过 **AUTH** 命令+密码 的方式来进行身份验证。

The password is set by the system administrator in clear text inside the redis.conf file. It should be long enough to prevent brute force attacks for two reasons:

密码以明文的方式配置在 redis.conf 文件中。应该具备足够的长度, 以防止暴力破解, 有两个原因:

- Redis is very fast at serving queries. Many passwords per second can be tested by an external client.
- The Redis password is stored inside the **redis.conf** file and inside the client configuration, so it does not need to be remembered by the system administrator, and thus it can be very long.

- Redis 的查询服务非常高效。一个外部客户端每秒可以进行很多此密码尝试。
- Redis 密码存储在 **redis.conf** 中, 所以系统管理员没有必要记住, 需要的时候进行拷贝即可, 因此可以很长。

The goal of the authentication layer is to optionally provide a layer of redundancy. If firewalling or any other system implemented to protect Redis from external attackers fail, an external client will still not be able to access the Redis instance without knowledge of the authentication password.

身份验证层的目标,是提供可选的一层冗余. 如果防火墙或者其他系统实现没能有效保护Redis, 外部客户端不知道密码的话, 依然不能访问 Redis 实例。

The AUTH command, like every other Redis command, is sent unencrypted, so it does not protect against an attacker that has enough access to the network to perform eavesdropping.

AUTH 命令, 和其他 Redis 命令一样, 都是不加密传输的, 所以就不能防止具有网络窃听权限的攻击者。

## Data encryption support

## 数据加密支持

Redis does not support encryption. In order to implement setups where trusted parties can access a Redis instance over the internet or other untrusted networks, an additional layer of protection should be implemented, such as an SSL proxy. We recommend [spiped](http://www.tarsnap.com/spiped.html).

因为 Redis 不支持加密. 为了在互联网/或不可信网络上, 实现只有信任方才可以正常访问Redis 实例, 应该具有额外的保护层, 例如SSL代理。我们推荐 [spiped](http://www.tarsnap.com/spiped.html)。

## Disabling of specific commands

## 禁用特定命令

It is possible to disable commands in Redis or to rename them into an unguessable name, so that normal clients are limited to a specified set of commands.

可以禁用某些 Redis 命令, 或者将命令重命名, 这样正常客户就不能执行某些危险的命令了。

For instance, a virtualized server provider may offer a managed Redis instance service. In this context, normal users should probably not be able to call the Redis **CONFIG** command to alter the configuration of the instance, but the systems that provide and remove instances should be able to do so.

例如, 虚拟服务提供商可能会提供一些 Redis 实例管理服务. 在这种情况下, 普通用户不允许调用 **CONFIG** 命令来修改实例的配置, 但是供应商应该能够执行这些操作。

In this case, it is possible to either rename or completely shadow commands from the command table. This feature is available as a statement that can be used inside the redis.conf configuration file. For example:

在这种情况下, 可以重命名, 或者从命令表中完全隐藏这些命令。这个特性可以通过 redis.conf 配置文件指定. 例如:

```
rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52

```


In the above example, the **CONFIG** command was renamed into an unguessable name. It is also possible to completely disable it (or any other command) by renaming it to the empty string, like in the following example:

在上面的例子中, **CONFIG** 命令被重命名为另一个非常复杂的名字. 当然, 也可以通过重命名为空字符串 `""`, 来禁用某些命令,像下面这样:

```
rename-command CONFIG ""

```



## Attacks triggered by carefully selected inputs from external clients

## 从外部发起的特殊输入攻击

There is a class of attacks that an attacker can trigger from the outside even without external access to the instance. An example of such attacks are the ability to insert data into Redis that triggers pathological (worst case) algorithm complexity on data structures implemented inside Redis internals.

没有密码的黑客, 也有可能在外部攻击Redis. 例如, 最坏情况下, 由于Redis内部算法和数据结构的复杂性, 黑客有可能利用这些数据结构, 将数据插入到Redis库中。

For instance an attacker could supply, via a web form, a set of strings that is known to hash to the same bucket into a hash table in order to turn the O(1) expected time (the average time) to the O(N) worst case, consuming more CPU than expected, and ultimately causing a Denial of Service.

例如, 攻击者可以通过web表单, 提交大量的 hash 值相同的字符串集合, 这样就有可能把 时间复杂度为 O(1) 的散列操作, 降级到 O(N) 的最坏情况, 导致 CPU 资源耗尽, 造成拒绝服务攻击(Denial of Service, Dos)。

To prevent this specific attack, Redis uses a per-execution pseudo-random seed to the hash function.

为了防止这类攻击, Redis 的哈希函数, 对每次调用都使用不同的伪随机数种子。

Redis implements the SORT command using the qsort algorithm. Currently, the algorithm is not randomized, so it is possible to trigger a quadratic worst-case behavior by carefully selecting the right set of inputs.

Redis 对 SORT 命令使用 qsort 算法. 目前, 该算法不是随机的, 如果攻击者精心构造一组特定的输入, 最坏情况下, 造成二次方的复杂度。

## String escaping and NoSQL injection

## 字符串转义和NoSQL注入

The Redis protocol has no concept of string escaping, so injection is impossible under normal circumstances using a normal client library. The protocol uses prefixed-length strings and is completely binary safe.

Redis 协议中没有字符串转义(escaping)的概念, 所以在正常情况下, 是不可能通过正常客户端进行注入的. Redis 协议使用 prefixed-length 的字符串, 完全是二进制安全的。

Lua scripts executed by the **EVAL** and **EVALSHA** commands follow the same rules, and thus those commands are also safe.

**EVAL** 和 **EVALSHA** 命令执行的Lua脚本, 也遵循同样的规则, 因此这些命令也都是安全的。

While it would be a very strange use case, the application should avoid composing the body of the Lua script using strings obtained from untrusted sources.

但实际情况可能比较复杂, 应用程序应该避免将不受信任来源的字符串, 当做Lua脚本来执行。

## Code security

## 代码安全

In a classical Redis setup, clients are allowed full access to the command set, but accessing the instance should never result in the ability to control the system where Redis is running.

在典型的 Redis 配置中, 客户允许执行所有命令, 除了控制 Redis 宿主机的。

Internally, Redis uses all the well known practices for writing secure code, to prevent buffer overflows, format bugs and other memory corruption issues. However, the ability to control the server configuration using the **CONFIG**command makes the client able to change the working dir of the program and the name of the dump file. This allows clients to write RDB Redis files at random paths, that is [a security issue](http://antirez.com/news/96) that may easily lead to the ability to compromise the system and/or run untrusted code as the same user as Redis is running.

在 Redis 内部, 使用各种著名的代码安全最佳实践, 来阻止缓冲区溢出(buffer overflow), 格式错误(format bug), 以及其他内存泄露问题(memory corruption). 但是, 控制服务器配置的 **CONFIG** 命令, 有可能改变服务器的工作目录(working dir), 以及 dump 文件的名称. 这就允许客户端将 RDB Redis 文件写入任何路径, 也就造成了 [a security issue](http://antirez.com/news/96), 有可能会损害系统, 利用和Redis服务相同的账户权限来执行不受信任的代码。

Redis does not requires root privileges to run. It is recommended to run it as an unprivileged *redis* user that is only used for this purpose. The Redis authors are currently investigating the possibility of adding a new configuration parameter to prevent **CONFIG SET/GET dir** and other similar run-time configuration directives. This would prevent clients from forcing the server to write Redis dump files at arbitrary locations.

Redis 不需要 root 权限来启动。建议使用专有的非特权账户 *redis*. Redis 作者目前正在尝试, 是否有必要增加一个新的配置参数, 来阻止 **CONFIG SET/GET dir** 和其他类似的运行时配置命令. 这能有效防止客户端将服务器的dump文件写到任意位置。

## GPG key

## GPG密钥(GPG key)

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: GnuPG v1.4.13 (Darwin)

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
vI1sAEeV6ZM/uc4CDI3E2TxEbQ==

```



**密钥指纹(Key fingerprint)**


```
pub   4096R/0E5C88D6 2013-11-07 [expires: 2063-10-26]
      Key fingerprint = E5F3 DA80 35F0 2EC1 47F9  020F 3181 3728 0E5C 88D6
      uid                  Salvatore Sanfilippo <antirez@gmail.com>
      sub   4096R/3B34D15F 2013-11-07 [expires: 2063-10-26]
```



原文链接: <https://redis.io/topics/security>



