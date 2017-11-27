# Redis Security

# Redis 安全提示

This document provides an introduction to the topic of security from the point of view of Redis: the access control provided by Redis, code security concerns, attacks that can be triggered from the outside by selecting malicious inputs and other similar topics are covered.

本文档主要介绍 Redis 安全相关的问题: Redis 提供的访问控制机制、代码安全问题, 可能从外部触发的恶意输入攻击, 以及其他相关的问题。

For security related contacts please open an issue on GitHub, or when you feel it is really important that the security of the communication is preserved, use the GPG key at the end of this document.

如果要反馈安全问题, 请在 GitHub 上提出 issue, 当然, 如果你觉得某个安全问题特禀重要或者紧急, 请使用本文末尾提供的 GPG key。

## Redis general security model

## Redis 总体安全模型

Redis is designed to be accessed by trusted clients inside trusted environments. This means that usually it is not a good idea to expose the Redis instance directly to the internet or, in general, to an environment where untrusted clients can directly access the Redis TCP port or UNIX socket.

Redis 设想的运行环境, 是在内网中与受信任的客户端之间通讯. 也就是说, Redis 实例不应该直接暴露在公网上, 也不应该让不受信的客户机直接连到 Redis TCP 端口或UNIX socket上。

For instance, in the common context of a web application implemented using Redis as a database, cache, or messaging system, the clients inside the front-end (web side) of the application will query Redis to generate pages or to perform operations requested or triggered by the web application user.

例如, 将 Redis 作为web应用程序的 database, cache, or messaging system, 用户与web应用交互, 触发查询操作或者执行操作请求。

In this case, the web application mediates access between Redis and untrusted clients (the user browsers accessing the web application).

在这种情况下, web应用作为桥头堡, 连接 Redis, 与不受信任的客户端(如浏览器)之间进行交互。

This is a specific example, but, in general, untrusted access to Redis should always be mediated by a layer implementing ACLs, validating user input, and deciding what operations to perform against the Redis instance.

这是一个具体的例子,但是,总的来说,不受信任的客户端与 Redis 之间, 应该有一层 ACL 实现, 用来校验用户输入, 并决定对 Redis 实例执行什么操作。

In general, Redis is not optimized for maximum security but for maximum performance and simplicity.

总的来说, Redis 并没有对安全问题做过多设计, 主要是为了保证性能和使用简单。

## Network security

## 网络安全问题

Access to the Redis port should be denied to everybody but trusted clients in the network, so the servers running Redis should be directly accessible only by the computers implementing the application using Redis.

除了受信网络的客户端,其他连接Redis端口的网络请求应该被拦截, 所以运行 Redis 的服务器主机, 应该只允许使用 Redis 的那些应用程序直连。

In the common case of a single computer directly exposed to the internet, such as a virtualized Linux instance (Linode, EC2, ...), the Redis port should be firewalled to prevent access from the outside. Clients will still be able to access Redis using the loopback interface.

假如Linux虚拟化实例(Linode, EC2, 等等)直接暴露在公网上, 那也应该使用防火墙将 Redis 端口保护起来, 阻止外部访问。而本地的客户端仍然能够通过回环地址(loopback, 127.*.*.*)访问Redis。

Note that it is possible to bind Redis to a single interface by adding a line like the following to the **redis.conf** file:

当然, 还可以将 Redis 绑定到本机的某块网卡上, 例如在 **redis.conf** 配置文件中增加以下配置:

```
bind 127.0.0.1

```


Failing to protect the Redis port from the outside can have a big security impact because of the nature of Redis. For instance, a single **FLUSHALL** command can be used by an external attacker to delete the whole data set.

如果不对外部访问做保护措施, 可能会带来严重的安全隐患. 例如, 攻击者只需要执行一个 **FLUSHALL** 命令, 就能清除所有数据。

## Protected mode

## 保护模式(Protected mode)

Unfortunately many users fail to protect Redis instances from being accessed from external networks. Many instances are simply left exposed on the internet with public IPs. For this reasons since version 3.2.0, when Redis is executed with the default configuration (binding all the interfaces) and without any password in order to access it, it enters a special mode called **protected mode**. In this mode Redis only replies to queries from the loopback interfaces, and reply to other clients connecting from other addresses with an error, explaining what is happening and how to configure Redis properly.

杯具的是, 许多 Redis 实例都没有拒绝外部网络的访问。很多情况下是暴露在公网服务器IP上. 由于这个原因, 从 3.2.0 版本开始, Redis 的默认配置(绑定所有网卡), 如果客户端连接没有设置密码, 则会进入一种特殊的模式, **保护模式(Protected mode)**. 在保护模式下, Redis 只允许本地回环地址访问, 其他地址的客户端连接时会返回错误信息, 解释具体原因以及如何配置。

We expect protected mode to seriously decrease the security issues caused by unprotected Redis instances executed without proper administration, however the system administrator can still ignore the error given by Redis and just disable protected mode or manually bind all the interfaces.

我们希望保护模式能够有效降低不受保护的Redis 实例所造成的安全问题, 当然, 系统管理员也可以忽略Redis给出的错误信息, 禁用保护模式, 或者手动绑定到所有网卡。

## Authentication feature

## 身份验证功能

While Redis does not try to implement Access Control, it provides a tiny layer of authentication that is optionally turned on editing the **redis.conf** file.

虽然Redis 不试图实现访问控制,它提供了一个小层的身份验证选择打开编辑* *Redis 。conf文件* *。

When the authorization layer is enabled, Redis will refuse any query by unauthenticated clients. A client can authenticate itself by sending the **AUTH** command followed by the password.

当启用授权层时,Redis 将拒绝任何查询未经身份验证的客户端。客户端可以通过发送验证自己* *认证* *命令密码紧随其后。

The password is set by the system administrator in clear text inside the redis.conf file. It should be long enough to prevent brute force attacks for two reasons:

由系统管理员设置密码以明文在Redis 。conf文件。它应该是足够长的时间来防止暴力破解攻击,有两个原因:

- Redis is very fast at serving queries. Many passwords per second can be tested by an external client.
- The Redis password is stored inside the **redis.conf** file and inside the client configuration, so it does not need to be remembered by the system administrator, and thus it can be very long.

- Redis 是非常快的查询服务。许多密码每秒可以由一个外部客户端进行测试。
- Redis 密码存储在* *Redis 。conf * *文件在客户端配置,所以它不需要记得由系统管理员,因此它可以很长。

The goal of the authentication layer is to optionally provide a layer of redundancy. If firewalling or any other system implemented to protect Redis from external attackers fail, an external client will still not be able to access the Redis instance without knowledge of the authentication password.

身份验证的目标层是有选择地提供一层冗余.如果防火墙或其他系统实现保护Redis 从外部攻击者失败,外部客户端仍然不能访问身份验证密码的Redis 实例没有知识。

The AUTH command, like every other Redis command, is sent unencrypted, so it does not protect against an attacker that has enough access to the network to perform eavesdropping.

身份验证命令,像其他Redis 命令,发送加密的,所以它不能防止攻击者有足够的访问网络进行窃听。

## Data encryption support

## 数据加密支持

Redis does not support encryption. In order to implement setups where trusted parties can access a Redis instance over the internet or other untrusted networks, an additional layer of protection should be implemented, such as an SSL proxy. We recommend [spiped](http://www.tarsnap.com/spiped.html).

Redis 不支持加密.为了实现设置信任方可以通过互联网访问Redis 实例或其他不可信网络,应该执行一个额外的保护层,如SSL代理。我们建议(spiped)(http://www.tarsnap.com/spiped.html)。

## Disabling of specific commands

## 禁用特定的命令

It is possible to disable commands in Redis or to rename them into an unguessable name, so that normal clients are limited to a specified set of commands.

可以禁用命令Redis 或重命名成一个名字,以便正常客户是有限的一组指定的命令。

For instance, a virtualized server provider may offer a managed Redis instance service. In this context, normal users should probably not be able to call the Redis **CONFIG** command to alter the configuration of the instance, but the systems that provide and remove instances should be able to do so.

例如,一个虚拟服务器提供者可能会提供一个管理Redis 实例服务.在这种情况下,普通用户应该无法调用Redis * *配置* *命令来改变实例的配置,但是提供的系统和删除实例应该能够这样做。

In this case, it is possible to either rename or completely shadow commands from the command table. This feature is available as a statement that can be used inside the redis.conf configuration file. For example:

在这种情况下,可以重命名或完全影子命令从命令表。这个特性可以作为声明,在Redis 可以使用。conf配置文件.例如:

```
rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52

```



In the above example, the **CONFIG** command was renamed into an unguessable name. It is also possible to completely disable it (or any other command) by renaming it to the empty string, like in the following example:

在上面的例子中,* * * *配置命令重命名为一个名字.也可以完全禁用它(或任何其他命令)通过重命名空字符串,像下面的例子:

```
rename-command CONFIG ""

```



## Attacks triggered by carefully selected inputs from external clients

## 从外部客户袭击由精心挑选的输入

There is a class of attacks that an attacker can trigger from the outside even without external access to the instance. An example of such attacks are the ability to insert data into Redis that triggers pathological (worst case) algorithm complexity on data structures implemented inside Redis internals.

她最近estate of——attacker can,无之外from the trigger对外access to the even审判.这些便是一例——每年有are triggers提供数据,重申pathological(algorithm complexity恶劣case)为基地的数据结构internals再重复一遍。

For instance an attacker could supply, via a web form, a set of strings that is known to hash to the same bucket into a hash table in order to turn the O(1) expected time (the average time) to the O(N) worst case, consuming more CPU than expected, and ultimately causing a Denial of Service.

例如攻击者可以供应,通过一个web表单,已知一组字符串,散列到相同的桶到哈希表为了把O(1)预期的时间(平均时间)O(N)坏的情况下,消费比预期更多的CPU,并最终导致拒绝服务。

To prevent this specific attack, Redis uses a per-execution pseudo-random seed to the hash function.

为了防止这种特定攻击,Redis 使用哈希函数的每次执行伪随机种子。

Redis implements the SORT command using the qsort algorithm. Currently, the algorithm is not randomized, so it is possible to trigger a quadratic worst-case behavior by carefully selecting the right set of inputs.

Redis 实现命令使用qsort算法.目前,该算法不是随机的,因此有可能引发二次最糟糕的行为通过仔细选择正确的输入。

## String escaping and NoSQL injection

## 字符串转义和NoSQL注入

The Redis protocol has no concept of string escaping, so injection is impossible under normal circumstances using a normal client library. The protocol uses prefixed-length strings and is completely binary safe.

字符串转义的Redis 协议没有概念,所以注射是不可能在正常情况下使用一个普通的客户端库.协议使用prefixed-length字符串和完全是二进制安全。

Lua scripts executed by the **EVAL** and **EVALSHA** commands follow the same rules, and thus those commands are also safe.

Lua脚本执行的* * EVAL * *和* * EVALSHA * *命令遵循相同的规则,因此这些命令也是安全的。

While it would be a very strange use case, the application should avoid composing the body of the Lua script using strings obtained from untrusted sources.

时这将是一个非常奇怪的用例中,应用程序应该避免创作的主体Lua脚本使用字符串来自不受信任的来源。

## Code security

## 代码安全

In a classical Redis setup, clients are allowed full access to the command set, but accessing the instance should never result in the ability to control the system where Redis is running.

在一个经典的Redis 设置中,客户允许完全访问命令集,但是访问实例不应该导致控制系统Redis 在哪里运行的能力。

Internally, Redis uses all the well known practices for writing secure code, to prevent buffer overflows, format bugs and other memory corruption issues. However, the ability to control the server configuration using the **CONFIG**command makes the client able to change the working dir of the program and the name of the dump file. This allows clients to write RDB Redis files at random paths, that is [a security issue](http://antirez.com/news/96) that may easily lead to the ability to compromise the system and/or run untrusted code as the same user as Redis is running.

在内部,Redis 使用所有的知名实践编写安全的代码,为了防止缓冲区溢出,格式错误和其他内存泄露问题.但是,应该对控制server configuration using the * * * * CONFIG command偏客户端能够to change the dir working and the program of the file name of the dump.这允许客户端写RDBRedis 随机文件路径,(安全问题)(http://antirez.com/news/96)可能容易导致妥协的能力系统和/或运行不受信任的代码像Redis 运行相同的用户。

Redis does not requires root privileges to run. It is recommended to run it as an unprivileged *redis* user that is only used for this purpose. The Redis authors are currently investigating the possibility of adding a new configuration parameter to prevent **CONFIG SET/GET dir** and other similar run-time configuration directives. This would prevent clients from forcing the server to write Redis dump files at arbitrary locations.

Redis 不需要root特权来运行。建议作为非特权*Redis *用户运行它,只是用于此目的.Redis 作者目前调查的可能性,添加一个新的配置参数以防止* *配置设置/获取dir * *和其他类似指示运行时配置.这将防止客户迫使服务器写在任意地点Redis 转储文件。

## GPG key

## GPG密钥

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: GnuPG v1.4.13 (Darwin)

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
vI1sAEeV6ZM/uc4CDI3E2TxEbQ==

```



**Key fingerprint**

* * * * Key复制

```
pub   4096R/0E5C88D6 2013-11-07 [expires: 2063-10-26]
      Key fingerprint = E5F3 DA80 35F0 2EC1 47F9  020F 3181 3728 0E5C 88D6
      uid                  Salvatore Sanfilippo <antirez@gmail.com>
      sub   4096R/3B34D15F 2013-11-07 [expires: 2063-10-26]
```



原文链接: <https://redis.io/topics/security>



