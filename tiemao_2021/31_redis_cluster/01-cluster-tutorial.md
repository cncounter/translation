
# Redis cluster tutorial

This document is a gentle introduction to Redis Cluster, that does not use difficult to understand concepts of distributed systems. It provides instructions about how to setup a cluster, test, and operate it, without going into the details that are covered in the [Redis Cluster specification](https://redis.io/topics/cluster-spec) but just describing how the system behaves from the point of view of the user.

However this tutorial tries to provide information about the availability and consistency characteristics of Redis Cluster from the point of view of the final user, stated in a simple to understand way.

Note this tutorial requires Redis version 3.0 or higher.

If you plan to run a serious Redis Cluster deployment, the more formal specification is a suggested reading, even if not strictly required. However it is a good idea to start from this document, play with Redis Cluster some time, and only later read the specification.

<a name="cluster-tutorial"></a>
# 1. Redis集群入门教程

本教程对Redis Cluster进行简要的介绍, 不涉及难以理解的分布式系统概念。
主要涵盖的内容包括:

- 如何安装和配置集群
- 如何进行测试与验证
- 如何操作并管理集群

本教程从用户的角度, 描述系统如何使用, 如何运行。
具体的集群算法原理和实现, 请参考 [2. Redis集群规范文档](./02-cluster-spec.md#cluster-spec)。

本教程尝试从终端用户的角度, 以简单易懂的方式, 介绍有关 Redis Cluster 的可用性和一致性特征的信息。

> 请注意: 学习本教程的内容, 需要安装 Redis 3.0 或更高版本。

如果需要在生产环境部署和运维 Redis 集群, 那么建议您阅读更正式的规范。
当然, 先学习本教程做个入门, 玩一段时间的 Redis Cluster, 然后再阅读规范也是一个很好的学习路径。



## Redis Cluster 101

Redis Cluster provides a way to run a Redis installation where data is **automatically sharded across multiple Redis nodes**.

Redis Cluster also provides **some degree of availability during partitions**, that is in practical terms the ability to continue the operations when some nodes fail or are not able to communicate. However the cluster stops to operate in the event of larger failures (for example when the majority of masters are unavailable).

So in practical terms, what do you get with Redis Cluster?

- The ability to **automatically split your dataset among multiple nodes**.
- The ability to **continue operations when a subset of the nodes are experiencing failures** or are unable to communicate with the rest of the cluster.


## Redis集群基础

Redis Cluster 提供了一种将数据自动分片到多个 Redis 节点的运行方式。

Redis Cluster 在分片的同时, 也在一定程度上提供了更好的可用性保障, 实际上就是在某些节点出现故障或无法通信时, 也能继续操作的能力。
当然, 如果发生大规模的故障, 比如大多数主节点都不可用时, 集群也就会停止运行。

那么在生产实践中, 使用 Redis Cluster, 有什么好处呢？

- 可扩展性: 自动将数据分片到多个节点的能力。
- 高可用性: 当部分节点出现故障, 或者无法与集群的其余部分进行通信时, 集群还可以继续提供服务。


## Redis Cluster TCP ports

Every Redis Cluster node requires two TCP connections open. The normal Redis TCP port used to serve clients, for example 6379, plus the second port named cluster bus port. The cluster bus port will be derived by adding 10000 to the data port, 16379 in this example, or by overiding it with the cluster-port config.

This second *high* port is used for the Cluster bus, that is a node-to-node communication channel using a binary protocol. The Cluster bus is used by nodes for failure detection, configuration update, failover authorization and so forth. Clients should never try to communicate with the cluster bus port, but always with the normal Redis command port, however make sure you open both ports in your firewall, otherwise Redis cluster nodes will be not able to communicate.

Note that for a Redis Cluster to work properly you need, for each node:

1. The normal client communication port (usually 6379) used to communicate with clients to be open to all the clients that need to reach the cluster, plus all the other cluster nodes (that use the client port for keys migrations).
2. The cluster bus port must be reachable from all the other cluster nodes.

If you don't open both TCP ports, your cluster will not work as expected.

The cluster bus uses a different, binary protocol, for node to node data exchange, which is more suited to exchange information between nodes using little bandwidth and processing time.


## Redis集群的TCP端口号

集群中每个Redis节点都需要打开两个 TCP 端口。
用于服务客户端的普通 Redis TCP 端口, 例如 `6379`,
第二个端口称为集群总线端口。
集群总线端口默认是在数据端口的数字上加`10000`, 比如在本示例中为 `16379`, 也可以通过 cluster-port 配置来覆盖。

第二个端口数字一般更大, 用于集群总线, 互相之间使用二进制协议来实现节点到节点的通信通道。
节点使用集群总线进行故障检测、配置更新、故障转移授权等等。
客户端不应该尝试与集群总线端口通信, 而始终使用正常的 Redis 命令端口即可, 但请确保在防火墙中放开了这两个端口, 否则 Redis 集群节点之间将无法通信。

请注意, 要保证 Redis 集群正常工作, 对每个节点都需要:

1. 与客户端通信的普通端口(通常为`6379`), 对所有需要访问集群的客户端, 以及所有其他Redis节点开放(会使用客户端来进行Key迁移)。
2. 集群总线端口, 从集群中的其他Redis节点, 必须能访问。

如果没有开启这两个 TCP 端口, 那么Redis集群将无法按预期工作。

集群总线使用不同的二进制协议来进行节点到节点的数据交换, 它更适用于在节点之间进行信息交换, 消耗的带宽很小, 处理时间也很短。


## Redis Cluster and Docker

Currently Redis Cluster does not support NATted environments and in general environments where IP addresses or TCP ports are remapped.

Docker uses a technique called *port mapping*: programs running inside Docker containers may be exposed with a different port compared to the one the program believes to be using. This is useful in order to run multiple containers using the same ports, at the same time, in the same server.

In order to make Docker compatible with Redis Cluster you need to use the **host networking mode** of Docker. Please check the `--net=host` option in the [Docker documentation](https://docs.docker.com/engine/userguide/networking/dockernetworks/) for more information.

## Redis集群和Docker

目前 Redis Cluster 不支持 NAT 网络环境, 一般这种环境是将 IP 地址和 TCP 端口重新映射了。

Docker 使用了一种技术, 名为“端口映射”(port mapping):  在 Docker 容器里运行的程序自己监听的端口号, 可以被Docker暴露并映射为宿主机的其他端口号。 这对于在同一服务器上同时运行多个使用相同端口的容器很有用。

为了使 Docker 与 Redis Cluster 兼容, 您需要使用 Docker 的主机网络模式(host networking mode)。 请查阅 [Docker documentation](https://docs.docker.com/engine/userguide/networking/dockernetworks/) 中的 `--net=host` 选项以获取更多信息。



## Redis Cluster data sharding

Redis Cluster does not use consistent hashing, but a different form of sharding where every key is conceptually part of what we call a **hash slot**.

There are 16384 hash slots in Redis Cluster, and to compute what is the hash slot of a given key, we simply take the CRC16 of the key modulo 16384.

Every node in a Redis Cluster is responsible for a subset of the hash slots, so for example you may have a cluster with 3 nodes, where:


## Redis Cluster 数据分片

Redis Cluster 并没有使用一致性哈希算法(consistent hashing), 而是使用不同的分片形式, 在概念上, 每个Key都是所谓的哈希槽(hash slot)的一部分。

Redis 集群中共有 16384 个哈希槽, 要计算给定Key的哈希槽位是哪个, 只需将Key的 CRC16 值, 模上 16384 接口。

集群中的每个 Redis 节点都负责一部分哈希槽, 例如, 某个集群有 3 个节点, 可能会有:


- Node A contains hash slots from 0 to 5500.
- Node B contains hash slots from 5501 to 11000.
- Node C contains hash slots from 11001 to 16383.

This allows to add and remove nodes in the cluster easily. For example if I want to add a new node D, I need to move some hash slots from nodes A, B, C to D. Similarly if I want to remove node A from the cluster I can just move the hash slots served by A to B and C. When the node A will be empty I can remove it from the cluster completely.

Because moving hash slots from a node to another does not require stopping operations, adding and removing nodes, or changing the percentage of hash slots hold by nodes, does not require any downtime.

Redis Cluster supports multiple key operations as long as all the keys involved into a single command execution (or whole transaction, or Lua script execution) all belong to the same hash slot. The user can force multiple keys to be part of the same hash slot by using a concept called *hash tags*.

Hash tags are documented in the Redis Cluster specification, but the gist is that if there is a substring between {} brackets in a key, only what is inside the string is hashed, so for example `this{foo}key` and `another{foo}key` are guaranteed to be in the same hash slot, and can be used together in a command with multiple keys as arguments.

- 节点 A 包含从 0 到 5500 的哈希槽。
- 节点 B 包含从 5501 到 11000 的哈希槽。
- 节点 C 包含从 11001 到 16383 的哈希槽。

这样就可以在集群中轻松地添加和删除节点。
例如, 我想添加一个新节点 D, 那么需要将一部分哈希槽从节点 A、B、C 移动到 D。
同样, 如果我想从集群中删除节点 A, 可以只移动 A 节点服务的哈希槽到 B 和 C。
当节点 A 中的槽位为空时, 就可以将它安全地从集群中摘除。

因为将哈希槽从一个节点移动到另一个节点不需要停止操作, 添加和删除节点, 或者更改节点持有的哈希槽百分比时, 都不需要停机维护。

Redis Cluster 支持多 key 操作, 只要这个命令(或整个事务, 或 Lua 脚本)涉及的所有Key, 全都位于同一个哈希槽中。
用户可以通过使用一种名为 哈希标签(hash tags) 的手段, 强制将多个Key分配到同一个哈希槽中。

哈希标签的文档在 Redis Cluster 规范中, 简单点说就是: 如果Key中有英文半角花括号 `{}`, 并且花括号里面有子字符串, 则仅对花括号中的子字符串内容进行哈希计算, 例如 `this{foo}key` 和 `another{foo}key` 会保证落在同一个哈希槽中, 可以在支持多个Key作为参数的命令中使用。


## Redis Cluster master-replica model

In order to remain available when a subset of master nodes are failing or are not able to communicate with the majority of nodes, Redis Cluster uses a master-replica model where every hash slot has from 1 (the master itself) to N replicas (N-1 additional replica nodes).

In our example cluster with nodes A, B, C, if node B fails the cluster is not able to continue, since we no longer have a way to serve hash slots in the range 5501-11000.

However when the cluster is created (or at a later time) we add a replica node to every master, so that the final cluster is composed of A, B, C that are master nodes, and A1, B1, C1 that are replica nodes. This way, the system is able to continue if node B fails.

Node B1 replicates B, and B fails, the cluster will promote node B1 as the new master and will continue to operate correctly.

However, note that if nodes B and B1 fail at the same time, Redis Cluster is not able to continue to operate.

## Redis集群和主从复制模型

为了在一部分主节点发生故障, 或者是无法与大多数节点通信时, 保持集群的可用性, Redis 集群使用主从模型(master-replica model),
其中每个哈希槽都有1到N份数据副本(1份在主节点, 另外有 N-1 份在从节点)。

在前面介绍的集群示例中, 有3个节点 A、B、C, 如果节点 B 发生故障, 则集群将无法继续提供服务, 因为我们没有办法为 5501-11000 范围内的哈希槽提供服务。

但是, 在集群创建时, 或者在之后的时间点, 如果我们为每个主节点添加一个副本节点, 那么最终的集群就是: 由 A、B、C 作为主节点, 以及 A1、B1、C1 组成副本节点.  这样配置好以后, 假如节点 B 发生故障, 那么系统还能继续运行。

节点 B1 复制的是 B, 而如果 B 发生故障, 集群会将节点 B1 提升为新的 master, 并继续正常运行。

但是请注意, 如果节点 B 和 B1 同时发生故障, Redis Cluster 则无法继续运行。


## Redis Cluster consistency guarantees

Redis Cluster is not able to guarantee **strong consistency**. In practical terms this means that under certain conditions it is possible that Redis Cluster will lose writes that were acknowledged by the system to the client.

The first reason why Redis Cluster can lose writes is because it uses asynchronous replication. This means that during writes the following happens:

- Your client writes to the master B.
- The master B replies OK to your client.
- The master B propagates the write to its replicas B1, B2 and B3.

As you can see, B does not wait for an acknowledgement from B1, B2, B3 before replying to the client, since this would be a prohibitive latency penalty for Redis, so if your client writes something, B acknowledges the write, but crashes before being able to send the write to its replicas, one of the replicas (that did not receive the write) can be promoted to master, losing the write forever.

## Redis集群一致性保证

Redis Cluster 无法保证 **强一致性**。 实际上就是说, 在某些极端情况下, Redis 集群可能会丢失系统已经向客户端确认了的写入。

Redis Cluster 可能丢失写入的第一个原因, 是因为它使用异步复制。
在写入期间的场景一般是这样:

- 客户端写入数据到主节点 B。
- 主节点 B 向客户端回复 OK。
- 然后, 主节点 B 再将写入信息传播给副本 B1、B2 和 B3。

可以看到, 主节点 B 在回复客户端之前, 不会等待来自 B1、B2、B3 的确认。
因为对 Redis 来说可能会有令人望而却步的延迟惩罚,
因此在客户端写入内容之后, 主节点 B 会确认写入, 这时候, 如果在将写入数据发送到副本之前, 其中某个未收到写入信息的副本被提升为主节点, 那么这个写入就会永久丢失。


This is **very similar to what happens** with most databases that are configured to flush data to disk every second, so it is a scenario you are already able to reason about because of past experiences with traditional database systems not involving distributed systems. Similarly you can improve consistency by forcing the database to flush data to disk before replying to the client, but this usually results in prohibitively low performance. That would be the equivalent of synchronous replication in the case of Redis Cluster.

Basically, there is a trade-off to be made between performance and consistency.

Redis Cluster has support for synchronous writes when absolutely needed, implemented via the [WAIT](https://redis.io/commands/wait) command. This makes losing writes a lot less likely. However, note that Redis Cluster does not implement strong consistency even when synchronous replication is used: it is always possible, under more complex failure scenarios, that a replica that was not able to receive the write will be elected as master.

这与每秒定时刷新一次数据到磁盘的大部分数据库类似, 因此, 基于过去不涉及分布式的传统数据库系统的使用经验, 您已经能够推断出这种情况。
同样, 可以通过强制数据库在回复客户端之前将数据刷新到磁盘来提高一致性, 但这通常会导致性能降低。
在 Redis Cluster 的情况下, 这相当于使用了同步复制。

基本上, 我们需要在性能(performance)和一致性(consistency)之间进行取舍和权衡。

Redis Cluster 在必要时可以支持同步写入, 通过使用 [WAIT](https://redis.io/commands/wait) 命令来实现。
这使得丢失写入的可能性大大降低。
但请注意, 即使使用同步复制, Redis Cluster 也不会实现强一致性: 在更极端的故障场景下, 甚至有可能将没有收到写入信息的那个副本选举为 master。


There is another notable scenario where Redis Cluster will lose writes, that happens during a network partition where a client is isolated with a minority of instances including at least a master.

Take as an example our 6 nodes cluster composed of A, B, C, A1, B1, C1, with 3 masters and 3 replicas. There is also a client, that we will call Z1.

After a partition occurs, it is possible that in one side of the partition we have A, C, A1, B1, C1, and in the other side we have B and Z1.

另一个 Redis 集群会丢失写入的场景, 是发生在网络分裂期间(network partition), 其中客户端与少数实例(包括至少一个主实例)隔离。

以我们的 6 节点集群为例, 假设集群由 A、B、C、A1、B1、C1 组成, 具有 3 主节点和 3 个副本。 还有一个客户端, 我们称之为 Z1。

发生网络分裂后, 可能在分区的一侧有 A、C、A1、B1、C1, 而在另一侧有 B 和 Z1。

Z1 is still able to write to B, which will accept its writes. If the partition heals in a very short time, the cluster will continue normally. However, if the partition lasts enough time for B1 to be promoted to master on the majority side of the partition, the writes that Z1 has sent to B in the meantime will be lost.

Note that there is a **maximum window** to the amount of writes Z1 will be able to send to B: if enough time has elapsed for the majority side of the partition to elect a replica as master, every master node in the minority side will have stopped accepting writes.

This amount of time is a very important configuration directive of Redis Cluster, and is called the **node timeout**.

After node timeout has elapsed, a master node is considered to be failing, and can be replaced by one of its replicas. Similarly, after node timeout has elapsed without a master node to be able to sense the majority of the other master nodes, it enters an error state and stops accepting writes.

Z1 仍然能够写入 B, B 也会接受其写入。
如果分裂在很短的时间内恢复, 集群将继续正常运行。
但是, 如果分裂持续了较长时间, 让 B1 被人多的一方提升为主节点, 那么, 在此期间 Z1 发送给 B 的写入将会丢失。

请注意, 这里有一个**最大时间窗口**, Z1 还能够将数据写入到 B:  如果分区的多数方经过足够的时间选择了一个副本作为主节点, 那么少数这一方的每个主节点都会停止接受写入请求。

这个时间量是 Redis Cluster 中的一个非常重要的配置指令, 被称为 `node timeout`。

节点超时后, 主节点被认为发生故障, 并且可以由其副本之一替换。
类似地, 在节点超时后, 如果某个主节点不能感知到其他大多数的主节点, 则会进入错误状态, 并停止接受写入。


## Redis Cluster configuration parameters

We are about to create an example cluster deployment. Before we continue, let's introduce the configuration parameters that Redis Cluster introduces in the `redis.conf` file. Some will be obvious, others will be more clear as you continue reading.



## Redis 集群配置参数

我们在下一节将会创建一个集群部署示例。 所以本节先介绍一下在 `redis.conf` 文件中, Redis Cluster 引入的配置参数。
有些配置参数的含义很明显, 有一些则会随着阅读的深入而变得更加清晰。

- `cluster-enabled <yes/no>`: If yes, enables Redis Cluster support in a specific Redis instance. Otherwise the instance starts as a standalone instance as usual.
- `cluster-config-file <filename>`: Note that despite the name of this option, this is not a user editable configuration file, but the file where a Redis Cluster node automatically persists the cluster configuration (the state, basically) every time there is a change, in order to be able to re-read it at startup. The file lists things like the other nodes in the cluster, their state, persistent variables, and so forth. Often this file is rewritten and flushed on disk as a result of some message reception.
- `cluster-node-timeout <milliseconds>`: The maximum amount of time a Redis Cluster node can be unavailable, without it being considered as failing. If a master node is not reachable for more than the specified amount of time, it will be failed over by its replicas. This parameter controls other important things in Redis Cluster. Notably, every node that can't reach the majority of master nodes for the specified amount of time, will stop accepting queries.
- `cluster-slave-validity-factor <factor>`: If set to zero, a replica will always consider itself valid, and will therefore always try to failover a master, regardless of the amount of time the link between the master and the replica remained disconnected. If the value is positive, a maximum disconnection time is calculated as the *node timeout* value multiplied by the factor provided with this option, and if the node is a replica, it will not try to start a failover if the master link was disconnected for more than the specified amount of time. For example, if the node timeout is set to 5 seconds and the validity factor is set to 10, a replica disconnected from the master for more than 50 seconds will not try to failover its master. Note that any value different than zero may result in Redis Cluster being unavailable after a master failure if there is no replica that is able to failover it. In that case the cluster will return to being available only when the original master rejoins the cluster.

- `cluster-enabled <yes/no>`: 如果设置为 yes, 则启用 Redis Cluster 模式。 否则, Redis实例就会作为独立实例启动(standalone)。
- `cluster-config-file <filename>`: 请注意, 尽管这个选项指定的是集群配置文件名称, 但指定的这个配置文件并不是用户可以编辑的, 而是 Redis Cluster 节点在集群信息有变化时自动保存的, 基本上都是些状态信息, 以便能够在重启时能读取它。 该文件列出了集群中的其他节点、它们的状态、持久变量等内容。 在收到某些消息时, 此文件通常会被覆盖, 因为需要把相关信息刷新到磁盘上。
- `cluster-node-timeout <milliseconds>`: Redis 集群节点不可用的最大时间, 在此期间不会被视为宕机。 如果主节点在超过指定的时间内无法访问, 将使用其副本进行故障转移。 此参数控制 Redis Cluster 中的其他重要内容。 值得注意的是, 某个节点如果达到一定时间范围仍然无法访问大多数主节点, 则这个节点将停止接受查询请求。
- `cluster-slave-validity-factor <factor>`: 如果设置为0, 则副本节点始终认为自己有效, 将一直尝试故障转移主节点, 而不管自己与主节点的链接断开了多长时间。  如果该值为正数, 则最大断开时间的计算公式为: `node timeout` 值乘以此选项提供的因子值, 如果节点是副本, 则如果与主节点的链接断开超过这个最大断开时间, 将不会尝试启动故障转移。 例如, `node timeout` 设置为 5 秒, 有效性因子 `cluster-slave-validity-factor` 设置为 10, 如果副本与主节点断开连接的时间超过 50 秒, 副本将不会再尝试对主节点进行故障转移(断开时间太长, 自己的数据可能太陈旧或者丢失的太多了)。  请注意, 如果设置为非0值, 在某个主节点不可用之后, 如果集群中没有能够对其进行故障转移的副本, 则会导致 Redis 集群在主节点故障后变为不可用。 在这种情况下, 只有当原始的主节点重新加入集群时, 集群才会恢复可用。

- `cluster-migration-barrier <count>`: Minimum number of replicas a master will remain connected with, for another replica to migrate to a master which is no longer covered by any replica. See the appropriate section about replica migration in this tutorial for more information.
- `cluster-require-full-coverage <yes/no>`: If this is set to yes, as it is by default, the cluster stops accepting writes if some percentage of the key space is not covered by any node. If the option is set to no, the cluster will still serve queries even if only requests about a subset of keys can be processed.
- `cluster-allow-reads-when-down <yes/no>`: If this is set to no, as it is by default, a node in a Redis Cluster will stop serving all traffic when the cluster is marked as failed, either when a node can't reach a quorum of masters or when full coverage is not met. This prevents reading potentially inconsistent data from a node that is unaware of changes in the cluster. This option can be set to yes to allow reads from a node during the fail state, which is useful for applications that want to prioritize read availability but still want to prevent inconsistent writes. It can also be used for when using Redis Cluster with only one or two shards, as it allows the nodes to continue serving writes when a master fails but automatic failover is impossible.

- `cluster-migration-barrier <count>`: master要保持连接的最小副本数, 以便另一个副本提升为 master, 不再被任何副本覆盖。 更多信息请参考后面的副本迁移部分。
- `cluster-require-full-coverage <yes/no>`:  如果此选项设置的是默认值 yes, 假如未被任何副本节点覆盖的 Key space 达到一定百分比, 则集群将停止接受写入。 如果该选项设置为 no, 即使只能处理一部分 Key 的请求, 集群仍将提供查询服务。
- `cluster-allow-reads-when-down <yes/no>`:  如果此选项设置的是默认值 no, 当集群标记为失败时, Redis 集群中的节点将停止服务所有流量, 当节点无法连接指定数量的主节点, 或未满足完全覆盖时。 这可以阻止客户端从不知道集群信息变更的节点读取到不一致的数据。 可以将此选项设置为 yes, 以允许客户端从处于故障状态期间的节点读取数据, 这对于希望优先考虑读取可用性, 但仍希望防止写入不一致的应用程序很有用。 当使用只有一个或两个分片的 Redis 集群时, 也可以使用它, 因为它允许在主节点失败但无法自动故障转移时, 继续提供写入服务。


## Creating and using a Redis Cluster

Note: to deploy a Redis Cluster manually it is **very important to learn** certain operational aspects of it. However if you want to get a cluster up and running ASAP (As Soon As Possible) skip this section and the next one and go directly to **Creating a Redis Cluster using the create-cluster script**.

To create a cluster, the first thing we need is to have a few empty Redis instances running in **cluster mode**. This basically means that clusters are not created using normal Redis instances as a special mode needs to be configured so that the Redis instance will enable the Cluster specific features and commands.

The following is a minimal Redis cluster configuration file:

## 下载和编译Redis

如果你能访问GitHub, 也可以参考Redis官方的GitHub仓库: <https://github.com/redis/redis>

首先, 打开Redis官网, 地址为:

> <https://redis.io/>

然后, 找到 Download 部分，打开页面:

> <https://redis.io/download>

根据你的操作系统平台, 选择适当的版本。 使用官方给出的方法下载和安装。

> Windows下建议安装Linux虚拟机使用; 或者参考: [Windows下安装并设置Redis](https://renfufei.blog.csdn.net/article/details/38474435)

比如Linux系统下, 先下载源代码:

```c

# 创建并进入相应目录
mkdir -p redis_all
cd redis_all/

# 下载; 如果下载不了可以采用其他方式
wget http://download.redis.io/redis-stable.tar.gz

# 解压
tar xzf redis-stable.tar.gz

# 编译; 要求gcc, 没有请先安装
cd redis-stable
make
```


## 创建和使用 Redis 集群

注意: 手工部署一套 Redis 集群, 对于了解运行原理来说是非常重要的。

> 但如果只想尽快(ASAP; As Soon As Possible)启动并运行Redis 集群, 可以跳过本节和下一节, 直接转到 [使用 create-cluster 脚本快速创建Redis集群](#creating-a-redis-cluster-using-the-create-cluster-script)。

要创建集群, 我们首先需要有多个运行在 **集群模式** 的 Redis 空实例。 这基本上意味着集群不是使用普通 Redis 实例创建的, 因为需要配置特殊模式, 以便 Redis 实例启用集群相关的功能和命令。

下面是一份最简 Redis 集群配置文件:

```
port 7000
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
appendonly yes
```

As you can see what enables the cluster mode is simply the `cluster-enabled` directive. Every instance also contains the path of a file where the configuration for this node is stored, which by default is `nodes.conf`. This file is never touched by humans; it is simply generated at startup by the Redis Cluster instances, and updated every time it is needed.

Note that the **minimal cluster** that works as expected requires to contain at least three master nodes. For your first tests it is strongly suggested to start a six nodes cluster with three masters and three replicas.

To do so, enter a new directory, and create the following directories named after the port number of the instance we'll run inside any given directory.

Something like:

可以看到, 启用集群模式只需要一条简单的 `cluster-enabled` 指令。
每个实例还包含存储该节点配置的文件路径, 默认是 `nodes.conf`。 该文件永远不需要人工编辑和阅读； 它只是由 Redis 集群实例在启动时生成, 并在需要时进行更新。

请注意, 按预期工作的最小化Redis集群m, 至少需要包含三个主节点。 对于您的第一次测试, 强烈建议启动包含三个主节点和三个副本节点的集群。

为此, 进入一个新目录, 并创建以下子目录, 从这些目录的命名我们可以看到对应实例的端口号。

比如执行这样的代码:


```c
mkdir cluster-test
cd cluster-test

# 拷贝 redis 可执行文件
cp ../src/redis-server ./redis-server
cp ../src/redis-cli ./redis-cli

# 创建子目录; 方便运维;
mkdir 7000 7001 7002 7003 7004 7005
```

Create a `redis.conf` file inside each of the directories, from 7000 to 7005. As a template for your configuration file just use the small example above, but make sure to replace the port number `7000` with the right port number according to the directory name.

Now copy your redis-server executable, **compiled from the latest sources in the unstable branch at GitHub**, into the `cluster-test` directory, and finally open 6 terminal tabs in your favorite terminal application.

Start every instance like that, one every tab:

从 7000 到 7005 总共有6个子目录, 我们在每个子目录中创建一个 `redis.conf` 文件。 作为配置文件的模板, 只需使用上面的最简示例即可, 但需要将其中的端口号 `7000` 替换为正确的端口号, 可以根据目录名称来快速定位。

然后将从源代码编译的可执行文件 redis-server, 拷贝到 `cluster-test` 目录, 最后在shell中打开 6 个终端选项卡。

像下面这样启动每个实例, 每个选项卡启动一个:

```
cd 7000
../redis-server ./redis.conf

```

如果想后台启动Redis示例, 一般来说有这些方式:

- 可以采用 `nohup xxxxx &` 的方式;
- 在配置文件 `redis.conf` 中设置选项 `daemonize yes`;
- 指定命令行启动参数 `--daemonize yes`;

As you can see from the logs of every instance, since no `nodes.conf` file existed, every node assigns itself a new ID.

从每个实例的日志中可以看出, 由于不存在 `nodes.conf` 文件, 每个节点都会为自己分配一个新的 ID。

```
[82462] 26 Nov 11:56:55.329 * No cluster configuration found, I'm 97a3a64667477371c4479320d683e4c8db5858b1
```

This ID will be used forever by this specific instance in order for the instance to have a unique name in the context of the cluster. Every node remembers every other node using this IDs, and not by IP or port. IP addresses and ports may change, but the unique node identifier will never change for all the life of the node. We call this identifier simply **Node ID**.

分配完之后, 这个实例将永远都使用此 ID, 以便实例在集群上下文中具有唯一名称。
每个节点都是通过这个 ID 来记住其他节点, 而不是通过 IP 或端口号。
因为IP 地址和端口可能会改变, 但唯一的节点标识符在节点的整个生命周期内都不会改变。
我们将此标识符简称为 **节点ID(Node ID)**。


## Creating the cluster

Now that we have a number of instances running, we need to create our cluster by writing some meaningful configuration to the nodes.

If you are using Redis 5 or higher, this is very easy to accomplish as we are helped by the Redis Cluster command line utility embedded into `redis-cli`, that can be used to create new clusters, check or reshard an existing cluster, and so forth.

For Redis version 3 or 4, there is the older tool called `redis-trib.rb` which is very similar. You can find it in the `src` directory of the Redis source code distribution. You need to install `redis` gem to be able to run `redis-trib`.

## 创建Redis集群

现在我们有了6个集群模式的实例在运行, 但还需要通过向节点写入一些有意义的配置信息, 才能搭建好我们的集群。

如果使用的是 Redis 5 或更高版本, 这很容易完成, 因为我们将 Redis Cluster command line 工具的帮助信息中嵌入到了 `redis-cli` 中, 包括创建新集群、检查、以及重新分片现有集群, 等等。

对于 Redis 3 或 4版本 , 有一个名为`redis-trib.rb` 的Ruby工具, 也非常相似。 您可以在 Redis 源代码结构的 `src` 目录中找到它。
当然您需要先安装gem, 再使用gem安装 `redis` 插件才能运行 `redis-trib`。

```
# Redis 3/4 版本:
gem install redis
```

The first example, that is, the cluster creation, will be shown using both `redis-cli` in Redis 5 and `redis-trib` in Redis 3 and 4. However all the next examples will only use `redis-cli`, since as you can see the syntax is very similar, and you can trivially change one command line into the other by using `redis-trib.rb help` to get info about the old syntax. **Important:** note that you can use Redis 5 `redis-cli` against Redis 4 clusters without issues if you wish.

To create your cluster for Redis 5 with `redis-cli` simply type:

第一个示例，是创建集群，将使用 Redis 5 中内置的 `redis-cli` 工具, 以及 Redis 3 和 4 中的 `redis-trib` 来展示。
但后续的所有示例都只使用 `redis-cli`, 因为他们的语法还是很相似的, 碰到不懂的地方, 也可以通过 `redis-trib.rb help` 来展示帮助信息, 看看如何将一个命令改写为另一个旧语法的命令。

> 重要提示:请注意，如果您愿意，可以对 Redis 4 集群服务器, 使用 Redis 5 版本的客户端 `redis-cli` 链接, 而不会出现问题。

要使用 `redis-cli` 为 Redis 5 创建集群，只需键入:

```
redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 \
127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 \
--cluster-replicas 1
```

Using `redis-trib.rb` for Redis 4 or 3 type:

Redis 3 和 Redis 4 版本中则使用 `redis-trib`:

```
./redis-trib.rb create --replicas 1 127.0.0.1:7000 127.0.0.1:7001 \
127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005
```

The command used here is `create`, since we want to create a new cluster. The option `--cluster-replicas 1` means that we want a replica for every master created. The other arguments are the list of addresses of the instances I want to use to create the new cluster.

Obviously the only setup with our requirements is to create a cluster with 3 masters and 3 replicas.

Redis-cli will propose you a configuration. Accept the proposed configuration by typing `yes`. The cluster will be configured and *joined*, which means, instances will be bootstrapped into talking with each other. Finally, if everything went well, you'll see a message like that:

这里使用的命令是 `create`，因为我们要创建一个新集群。 选项 `--cluster-replicas 1` 表示我们希望为每个主服务器创建一个副本。 其他参数则是用来创建新集群的实例对应的地址端口列表。

显然，符合这种要求的设置, 只能是创建一个具有 3 主 3 从的集群。

redis-cli 会先提示你确认这个配置。 接受建议则输入 `yes` 。 将配置集群并让这些节点加入，这意味着相关实例将被引导并与其他节点互相通信。 最后，如果一切顺利，你会看到这样的消息:

```
[OK] All 16384 slots covered
```

This means that there is at least a master instance serving each of the 16384 slots available.

这条消息表示, 总共 16384 个槽位中, 每个槽位至少有一个主节点为其提供服务。


<a name="creating-a-redis-cluster-using-the-create-cluster-script"></a>
## Creating a Redis Cluster using the create-cluster script

If you don't want to create a Redis Cluster by configuring and executing individual instances manually as explained above, there is a much simpler system (but you'll not learn the same amount of operational details).

Just check `utils/create-cluster` directory in the Redis distribution. There is a script called `create-cluster` inside (same name as the directory it is contained into), it's a simple bash script. In order to start a 6 nodes cluster with 3 masters and 3 replicas just type the following commands:

## 使用 create-cluster 脚本创建 Redis 集群

如果您不想像上面解释的那样通过手动配置和执行单个实例来创建 Redis 集群，那么有一个更简单的系统（但您不会学到相同数量的操作细节）。

只需检查 Redis 发行版中的 `utils/create-cluster` 目录即可。

里面有一个名为 `create-cluster` 的脚本（与它所在的目录同名），它是一个简单的 bash 脚本。

有兴趣的话你可以看看里面的shell代码, 并不是很复杂, 可以尝试猜测着理解。

要启动具有 3 个主节点和 3 个副本的 6 节点集群，只需键入以下命令:

```
cd utils/create-cluster

# 查看帮助
./create-cluster
Usage: ./create-cluster [start|create|stop|watch|tail|clean|call]
start       -- Launch Redis Cluster instances.
create [-f] -- Create a cluster using redis-cli --cluster create.
stop        -- Stop Redis Cluster instances.
watch       -- Show CLUSTER NODES output (first 30 lines) of first node.
tail <id>   -- Run tail -f of instance at base port + ID.
tailall     -- Run tail -f for all the log files at once.
clean       -- Remove all instances data, logs, configs.
clean-logs  -- Remove just instances logs.
call <cmd>  -- Call a command (up to 7 arguments) on all nodes.

# 启动示例
./create-cluster start
# 创建集群
./create-cluster create
```

Reply to `yes` in step 2 when the `redis-cli` utility wants you to accept the cluster layout.

You can now interact with the cluster, the first node will start at port 30001 by default. When you are done, stop the cluster with:

当 `redis-cli` 实用程序希望您接受集群布局时，在第 2 步中回复 `yes`。

然后可以看到类似这样的提示信息:

```c
...
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
```

然后就可以与集群交互，默认情况下第一个节点将从端口 30001 开始。


```
# Linux 下查看端口号监听
lsof -iTCP -sTCP:LISTEN -n -P | grep TCP
```

可以发现, 有 30001 到 30006,  以及 40001 到 40006;


测试完成后，如果不再需要集群, 可以使用以下命令停止集群:

```
# 停止实例
./create-cluster stop

# 下次再启动实例; 一般来说不需要再次创建集群;
./create-cluster start
```

Please read the `README` inside this directory for more information on how to run the script.

有关如何运行脚本的更多信息，请阅读此目录中的“README”。


## Playing with the cluster

At this stage one of the problems with Redis Cluster is the lack of client libraries implementations.

I'm aware of the following implementations:


## 客户端如何与Redis集群交互

在早期阶段，Redis Cluster 的一个问题是缺少支持集群的客户端库实现。

下面是支持集群的已知实现:

- [redis-rb-cluster](http://github.com/antirez/redis-rb-cluster) is a Ruby implementation written by me (@antirez) as a reference for other languages. It is a simple wrapper around the original redis-rb, implementing the minimal semantics to talk with the cluster efficiently.
- [redis-py-cluster](https://github.com/Grokzen/redis-py-cluster) A port of redis-rb-cluster to Python. Supports majority of *redis-py* functionality. Is in active development.
- The popular [Predis](https://github.com/nrk/predis) has support for Redis Cluster, the support was recently updated and is in active development.
- The most used Java client, [Jedis](https://github.com/xetorthio/jedis) recently added support for Redis Cluster, see the *Jedis Cluster* section in the project README.
- [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) offers support for C# (and should work fine with most .NET languages; VB, F#, etc)
- [thunk-redis](https://github.com/thunks/thunk-redis) offers support for Node.js and io.js, it is a thunk/promise-based redis client with pipelining and cluster.
- [redis-go-cluster](https://github.com/chasex/redis-go-cluster) is an implementation of Redis Cluster for the Go language using the [Redigo library client](https://github.com/garyburd/redigo) as the base client. Implements MGET/MSET via result aggregation.
- [ioredis](https://github.com/luin/ioredis) is a popular Node.js client, providing a robust support for Redis Cluster.
- The `redis-cli` utility implements basic cluster support when started with the `-c` switch.


- [redis-rb-cluster](http://github.com/antirez/redis-rb-cluster); 是Redis作者(@antirez)通过 Ruby 写的，作为其他语言的参考实现。 只是对原来的 redis-rb 进行了简单的包装，实现了与集群有效交互的最小语义。
- [redis-py-cluster](https://github.com/Grokzen/redis-py-cluster); redis-rb-cluster 到 Python 的端口。 支持大部分 *redis-py* 功能。 正在积极开发中。
- 流行的 [Predis](https://github.com/nrk/predis); 支持 Redis Cluster，最近正在更新并积极开发中。
- [Jedis](https://github.com/xetorthio/jedis); 最常用的 Java 客户端, 最近添加了对 Redis Cluster 的支持，请参阅该项目中 README 文件的 *Jedis Cluster* 部分。
- [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis); 提供对 C# 的支持（并且应该适用于大多数 .NET 版本；VB、F# 等）
- [thunk-redis](https://github.com/thunks/thunk-redis); 提供对 Node.js 和 io.js 的支持，它是一个 thunk/promise-based 的 redis 客户端, 支持 pipelining 和 cluster。
- [redis-go-cluster](https://github.com/chasex/redis-go-cluster); 是以 [Redigo library client](https://github.com/garyburd/redigo) 为基础的Go语言实现。 通过结果聚合来实现 MGET/MSET。
- [ioredis](https://github.com/luin/ioredis); 是一个流行的 Node.js 客户端，为 Redis Cluster 提供了强大的支持。
- `redis-cli` 命令行工具; 传入 `-c` 选项时，支持基础的集群功能。


An easy way to test Redis Cluster is either to try any of the above clients or simply the `redis-cli` command line utility. The following is an example of interaction using the latter:

使用上面给出的任何客户端都可以测试 Redis 集群, 一种简单方法是使用 `redis-cli` 命令行工具。
下面是一个与Redis Cluster交互的使用示例:

```
cd ../../src

./redis-cli -c -p 7000

redis 127.0.0.1:7000> set foo bar
-> Redirected to slot [12182] located at 127.0.0.1:7002
OK
redis 127.0.0.1:7002> set hello world
-> Redirected to slot [866] located at 127.0.0.1:7000
OK
redis 127.0.0.1:7000> get foo
-> Redirected to slot [12182] located at 127.0.0.1:7002
"bar"
redis 127.0.0.1:7002> get hello
-> Redirected to slot [866] located at 127.0.0.1:7000
"world"
```

`Note:` if you created the cluster using the script your nodes may listen to different ports, starting from 30001 by default.

The redis-cli cluster support is very basic so it always uses the fact that Redis Cluster nodes are able to redirect a client to the right node. A serious client is able to do better than that, and cache the map between hash slots and nodes addresses, to directly use the right connection to the right node. The map is refreshed only when something changed in the cluster configuration, for example after a failover or after the system administrator changed the cluster layout by adding or removing nodes.

退出redis-cli支持多种方式, 例如:

- `CTRL + C`
- `exit`
- `quit`

> 注意:如果使用脚本自动创建集群，Redis节点可能会监听不同的端口，默认情况下是从 30001 开始。

可以看到, redis-cli 对集群的支持非常简陋，直接基于 Redis 集群节点能够让客户端重定向到正确节点的事实。
一个高性能的客户端应该做得更好一些，比如将哈希槽和节点地址间的映射关系缓存起来，直接使用与正确节点的连接，避免重定向。
只有当集群配置发生变更时才会刷新映射关系, 例如在故障转移, 或者系统管理员添加/删除节点导致集群布局变化。


## Writing an example app with redis-rb-cluster

## 使用 redis-rb-cluster 编写应用程序示例

> 此部分不翻译, 采用Java和SpringBoot来实现;

Before going forward showing how to operate the Redis Cluster, doing things like a failover, or a resharding, we need to create some example application or at least to be able to understand the semantics of a simple Redis Cluster client interaction.

In this way we can run an example and at the same time try to make nodes failing, or start a resharding, to see how Redis Cluster behaves under real world conditions. It is not very helpful to see what happens while nobody is writing to the cluster.

This section explains some basic usage of [redis-rb-cluster](https://github.com/antirez/redis-rb-cluster) showing two examples. The first is the following, and is the [`example.rb`](https://github.com/antirez/redis-rb-cluster/blob/master/example.rb) file inside the redis-rb-cluster distribution:

```
   1  require './cluster'
   2
   3  if ARGV.length != 2
   4      startup_nodes = [
   5          {:host => "127.0.0.1", :port => 7000},
   6          {:host => "127.0.0.1", :port => 7001}
   7      ]
   8  else
   9      startup_nodes = [
  10          {:host => ARGV[0], :port => ARGV[1].to_i}
  11      ]
  12  end
  13
  14  rc = RedisCluster.new(startup_nodes,32,:timeout => 0.1)
  15
  16  last = false
  17
  18  while not last
  19      begin
  20          last = rc.get("__last__")
  21          last = 0 if !last
  22      rescue => e
  23          puts "error #{e.to_s}"
  24          sleep 1
  25      end
  26  end
  27
  28  ((last.to_i+1)..1000000000).each{|x|
  29      begin
  30          rc.set("foo#{x}",x)
  31          puts rc.get("foo#{x}")
  32          rc.set("__last__",x)
  33      rescue => e
  34          puts "error #{e.to_s}"
  35      end
  36      sleep 0.1
  37  }
```

The application does a very simple thing, it sets keys in the form `foo<number>` to `number`, one after the other. So if you run the program the result is the following stream of commands:

- SET foo0 0
- SET foo1 1
- SET foo2 2
- And so forth...

The program looks more complex than it should usually as it is designed to show errors on the screen instead of exiting with an exception, so every operation performed with the cluster is wrapped by `begin` `rescue` blocks.

The `line 14` is the first interesting line in the program. It creates the Redis Cluster object, using as argument a list of *startup nodes*, the maximum number of connections this object is allowed to take against different nodes, and finally the timeout after a given operation is considered to be failed.

The startup nodes don't need to be all the nodes of the cluster. The important thing is that at least one node is reachable. Also note that redis-rb-cluster updates this list of startup nodes as soon as it is able to connect with the first node. You should expect such a behavior with any other serious client.

Now that we have the Redis Cluster object instance stored in the `rc` variable, we are ready to use the object like if it was a normal Redis object instance.

This is exactly what happens in `line 18 to 26`: when we restart the example we don't want to start again with `foo0`, so we store the counter inside Redis itself. The code above is designed to read this counter, or if the counter does not exist, to assign it the value of zero.

However note how it is a while loop, as we want to try again and again even if the cluster is down and is returning errors. Normal applications don't need to be so careful.

`Lines between 28 and 37` start the main loop where the keys are set or an error is displayed.

Note the `sleep` call at the end of the loop. In your tests you can remove the sleep if you want to write to the cluster as fast as possible (relatively to the fact that this is a busy loop without real parallelism of course, so you'll get the usually 10k ops/second in the best of the conditions).

Normally writes are slowed down in order for the example application to be easier to follow by humans.

Starting the application produces the following output:

```
ruby ./example.rb
1
2
3
4
5
6
7
8
9
^C (I stopped the program here)
```

This is not a very interesting program and we'll use a better one in a moment but we can already see what happens during a resharding when the program is running.



## Resharding the cluster

## 集群重新分片(Resharding the cluster)

Now we are ready to try a cluster resharding. To do this please keep the example.rb program running, so that you can see if there is some impact on the program running. Also you may want to comment the `sleep` call in order to have some more serious write load during resharding.

Resharding basically means to move hash slots from a set of nodes to another set of nodes, and like cluster creation it is accomplished using the redis-cli utility.

To start a resharding just type:

下面我们来演示如何让集群重新分片。
为此请保持 `example.rb` 程序继续运行，以便我们观察重新分片对程序运行是否有影响。
此外，可能需要注释掉ruby代码中的 `sleep` 调用，以便在重新分片期间有一定量的写入负载。

重新分片基本上意味着将哈希槽从一组节点移动到另一组节点，和集群创建类似，可以使用 redis-cli 命令行工具来调用。

要开始重新分片，只需输入以下命令:

```
redis-cli --cluster reshard 127.0.0.1:7000
```

You only need to specify a single node, redis-cli will find the other nodes automatically.

Currently redis-cli is only able to reshard with the administrator support, you can't just say move 5% of slots from this node to the other one (but this is pretty trivial to implement). So it starts with questions. The first is how much a big resharding do you want to do:

只需要指定一个节点即可，redis-cli 会自动找到其他节点。

目前 redis-cli 只能在管理员的支持下重新分片，不能说只将 5% 的哈希槽从一个节点移动到另一个节点（当然要实现起来也很简单）。
所以客户端会提示你进行选择。
首先是问你想对多少个槽位执行重新分片:

```
How many slots do you want to move (from 1 to 16384)?
```

We can try to reshard 1000 hash slots, that should already contain a non trivial amount of keys if the example is still running without the sleep call.

Then redis-cli needs to know what is the target of the resharding, that is, the node that will receive the hash slots. I'll use the first master node, that is, `127.0.0.1:7000`, but I need to specify the Node ID of the instance. This was already printed in a list by redis-cli, but I can always find the ID of a node with the following command if I need:

我们可以尝试重分片 1000 个哈希槽，如果示例程序注释掉 sleep 并持续运行，那么Redis中应该已经包含大量的key。

然后 redis-cli 需要确定 resharding 的目标节点是哪些，也就是接收hash slot的Redis节点。
我们使用第一个主节点，即 `127.0.0.1:7000`，但需要指定的是实例的节点ID。
这已经由 redis-cli 打印在列表中，但如果需要，可以使用以下命令找到节点的 ID:

```
$ redis-cli -p 7000 cluster nodes | grep myself
97a3a64667477371c4479320d683e4c8db5858b1 :0 myself,master - 0 0 0 connected 0-5460
```

Ok so my target node is `97a3a64667477371c4479320d683e4c8db5858b1`.

Now you'll get asked from what nodes you want to take those keys. I'll just type `all` in order to take a bit of hash slots from all the other master nodes.

After the final confirmation you'll see a message for every slot that redis-cli is going to move from a node to another, and a dot will be printed for every actual key moved from one side to the other.

While the resharding is in progress you should be able to see your example program running unaffected. You can stop and restart it multiple times during the resharding if you want.

At the end of the resharding, you can test the health of the cluster with the following command:

在示例中，我们的目标节点是 `97a3a64667477371c4479320d683e4c8db5858b1`, 具体运行时是多少你就填多少。

接着，系统会询问你要从哪些节点获取这些key。 只需键入 `all`，以便从所有其他主节点中获取一些哈希槽。

在最终确认之后，可以看到 redis-cli 将每个槽位从一个节点移到另一个节点的消息，并且每个实际的key移动完就会打印一个英文点号。

当重新分片正在进行时，应该能够看到您的示例程序运行不受影响。 如果需要，可以在重新分片期间多次停止并重新启动它。

重新分片结束后，可以使用以下命令测试集群的健康状况:

```
redis-cli --cluster check 127.0.0.1:7000
```

All the slots will be covered as usual, but this time the master at 127.0.0.1:7000 will have more hash slots, something around 6461.

所有的槽都会像往常一样被覆盖，但这次位于 127.0.0.1:7000 的 master 服务器将有更多的哈希槽，大约在 6461 左右。


## Scripting a resharding operation

## 非交互式执行重新分片的脚本


Resharding can be performed automatically without the need to manually enter the parameters in an interactive way. This is possible using a command line like the following:

重新分片可以自动执行，无需以手动交互的方式来输入参数。
可以使用如下命令行：


```
redis-cli --cluster reshard <host>:<port> --cluster-from <node-id> --cluster-to <node-id> --cluster-slots <number of slots> --cluster-yes
```

This allows to build some automatism if you are likely to reshard often, however currently there is no way for `redis-cli` to automatically rebalance the cluster checking the distribution of keys across the cluster nodes and intelligently moving slots as needed. This feature will be added in the future.

如果需要经常重新分片，可以通过这样的脚本来执行一些自动化操作，
但到目前为止, 还没有办法让 `redis-cli` 自动平衡集群，检查集群节点之间的Key分布情况并根据需要智能移动槽位。
将来的版本可能会添加这种功能。

The `--cluster-yes` option instructs the cluster manager to automatically answer "yes" to the command's prompts, allowing it to run in a non-interactive mode. Note that this option can also be activated by setting the `REDISCLI_CLUSTER_YES` environment variable.


选项 `--cluster-yes` 指示集群管理器自动对命令提示回答"yes"，允许它以非交互模式运行。
注意，也可以通过设置环境变量 `REDISCLI_CLUSTER_YES` 来激活此选项。



## A more interesting example application

## 一个更有趣的示例应用程序

> 此示例是Ruby，不懂。

The example application we wrote early is not very good. It writes to the cluster in a simple way without even checking if what was written is the right thing.

From our point of view the cluster receiving the writes could just always write the key `foo` to `42` to every operation, and we would not notice at all.

So in the `redis-rb-cluster` repository, there is a more interesting application that is called `consistency-test.rb`. It uses a set of counters, by default 1000, and sends [INCR](https://redis.io/commands/incr) commands in order to increment the counters.

However instead of just writing, the application does two additional things:

- When a counter is updated using [INCR](https://redis.io/commands/incr), the application remembers the write.
- It also reads a random counter before every write, and check if the value is what we expected it to be, comparing it with the value it has in memory.

What this means is that this application is a simple `consistency checker`, and is able to tell you if the cluster lost some write, or if it accepted a write that we did not receive acknowledgment for. In the first case we'll see a counter having a value that is smaller than the one we remember, while in the second case the value will be greater.

Running the consistency-test application produces a line of output every second:

```
$ ruby consistency-test.rb
925 R (0 err) | 925 W (0 err) |
5030 R (0 err) | 5030 W (0 err) |
9261 R (0 err) | 9261 W (0 err) |
13517 R (0 err) | 13517 W (0 err) |
17780 R (0 err) | 17780 W (0 err) |
22025 R (0 err) | 22025 W (0 err) |
25818 R (0 err) | 25818 W (0 err) |
```

The line shows the number of `R`eads and `W`rites performed, and the number of errors (query not accepted because of errors since the system was not available).

If some inconsistency is found, new lines are added to the output. This is what happens, for example, if I reset a counter manually while the program is running:

```
$ redis-cli -h 127.0.0.1 -p 7000 set key_217 0
OK

(in the other tab I see...)

94774 R (0 err) | 94774 W (0 err) |
98821 R (0 err) | 98821 W (0 err) |
102886 R (0 err) | 102886 W (0 err) | 114 lost |
107046 R (0 err) | 107046 W (0 err) | 114 lost |
```

When I set the counter to 0 the real value was 114, so the program reports 114 lost writes ([INCR](https://redis.io/commands/incr) commands that are not remembered by the cluster).

This program is much more interesting as a test case, so we'll use it to test the Redis Cluster failover.



## Testing the failover

## 试试故障转移


Note: during this test, you should take a tab open with the consistency test application running.

In order to trigger the failover, the simplest thing we can do (that is also the semantically simplest failure that can occur in a distributed system) is to crash a single process, in our case a single master.

We can identify a master and crash it with the following command:


> 注意：在本次测试过程中，您应该在一个新标签页中，运行和前面示例中使用的 consistency 测试程序。

要触发故障转移，有一种简单的办法: 就是把进程搞崩溃。 这也是分布式系统中经常发生的简单故障;
在我们的例子中需要让1个 master 进程崩溃。

我们可以通过以下命令来找出 master：

```
$ redis-cli -p 7000 cluster nodes | grep master
3e3a6cb0d9a9a87168e266b0a0b24026c0aae3f0 127.0.0.1:7001 master - 0 1385482984082 0 connected 5960-10921
2938205e12de373867bf38f1ca29d31d0ddb3e46 127.0.0.1:7002 master - 0 1385482983582 0 connected 11423-16383
97a3a64667477371c4479320d683e4c8db5858b1 :0 myself,master - 0 0 0 connected 0-5959 10922-11422
```

Ok, so 7000, 7001, and 7002 are masters. Let's crash node 7002 with the `DEBUG SEGFAULT` command:

可以看到, 7000, 7001, 和 7002 端口都是master进程; 我们向 7002 端口发送 `DEBUG SEGFAULT` 命令使其崩溃:

```
$ redis-cli -p 7002 debug segfault
Error: Server closed the connection
```

Now we can look at the output of the consistency test to see what it reported.

接着可以看到测试程序的报告信息:

```
18849 R (0 err) | 18849 W (0 err) |
23151 R (0 err) | 23151 W (0 err) |
27302 R (0 err) | 27302 W (0 err) |

... 这里会有很多 error 和 warnings 信息 ...

29659 R (578 err) | 29660 W (577 err) |
33749 R (578 err) | 33750 W (577 err) |
37918 R (578 err) | 37919 W (577 err) |
42077 R (578 err) | 42078 W (577 err) |
```

As you can see during the failover the system was not able to accept 578 reads and 577 writes, however no inconsistency was created in the database. This may sound unexpected as in the first part of this tutorial we stated that Redis Cluster can lose writes during the failover because it uses asynchronous replication. What we did not say is that this is not very likely to happen because Redis sends the reply to the client, and the commands to replicate to the replicas, about at the same time, so there is a very small window to lose data. However the fact that it is hard to trigger does not mean that it is impossible, so this does not change the consistency guarantees provided by Redis cluster.

We can now check what is the cluster setup after the failover (note that in the meantime I restarted the crashed instance so that it rejoins the cluster as a replica):

正如您在故障转移期间看到的那样，系统有 578 次读取和 577 次写入没被接受，但是数据库中没有不一致的数据。
这听起来可能出乎意料，因为在本教程的第一部分中，我们说过 Redis Cluster 在故障转移期间可能会丢失写入，因为它使用了异步复制。
我们没有说的是, 这种情况发生的概率非常小，因为 Redis 向客户端发送回复，以及复制到副本的命令大约是同时发送的， 因此丢失数据的时间窗口非常小。
但是不容易触发并不代表不可能，所以这并没有改变Redis集群提供的一致性保证。

我们现在可以检查故障转移后的集群设置, 注意验证之后又重新启动了崩溃的实例，以便它作为副本再次加入集群：

```
$ redis-cli -p 7000 cluster nodes
3fc783611028b1707fd65345e763befb36454d73 127.0.0.1:7004 slave 3e3a6cb0d9a9a87168e266b0a0b24026c0aae3f0 0 1385503418521 0 connected
a211e242fc6b22a9427fed61285e85892fa04e08 127.0.0.1:7003 slave 97a3a64667477371c4479320d683e4c8db5858b1 0 1385503419023 0 connected
97a3a64667477371c4479320d683e4c8db5858b1 :0 myself,master - 0 0 0 connected 0-5959 10922-11422
3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e 127.0.0.1:7005 master - 0 1385503419023 3 connected 11423-16383
3e3a6cb0d9a9a87168e266b0a0b24026c0aae3f0 127.0.0.1:7001 master - 0 1385503417005 0 connected 5960-10921
2938205e12de373867bf38f1ca29d31d0ddb3e46 127.0.0.1:7002 slave 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e 0 1385503418016 3 connected
```

Now the masters are running on ports 7000, 7001 and 7005. What was previously a master, that is the Redis instance running on port 7002, is now a replica of 7005.

The output of the [CLUSTER NODES](https://redis.io/commands/cluster-nodes) command may look intimidating, but it is actually pretty simple, and is composed of the following tokens:

现在 master 运行在 7000、7001 和 7005 端口上。
之前的 master，运行在 7002 端口上的 Redis 实例，现在变成了 7005 的副本。

[CLUSTER NODES](https://redis.io/commands/cluster-nodes) 命令的输出可能看起来有点复杂，但实际上很容易理解，每一行数据由以下部分组成：

- Node ID
- ip:port
- flags: master, replica, myself, fail, ...
- if it is a replica, the Node ID of the master
- Time of the last pending PING still waiting for a reply.
- Time of the last PONG received.
- Configuration epoch for this node (see the Cluster specification).
- Status of the link to this node.
- Slots served...


<a name="manual-failover"></a>
## Manual failover

## 人工操作强制执行故障转移

Sometimes it is useful to force a failover without actually causing any problem on a master. For example in order to upgrade the Redis process of one of the master nodes it is a good idea to failover it in order to turn it into a replica with minimal impact on availability.

Manual failovers are supported by Redis Cluster using the [CLUSTER FAILOVER](https://redis.io/commands/cluster-failover) command, that must be executed in one of the `replicas` of the master you want to failover.

Manual failovers are special and are safer compared to failovers resulting from actual master failures, since they occur in a way that avoid data loss in the process, by switching clients from the original master to the new master only when the system is sure that the new master processed all the replication stream from the old one.

This is what you see in the replica log when you perform a manual failover:

有时通过人工干预, 对 master 服务器强制执行故障转移, 而不对客户端系统产生任何实际影响, 会非常有用。
例如，要升级某个 master 节点对应的 Redis 进程，最好是先对其进行故障转移，以便将其转换为副本，同时基本上不影响集群的可用性。

Redis 集群支持使用 [CLUSTER FAILOVER](https://redis.io/commands/cluster-failover) 命令来手动执行故障转移，该命令必须在某个 `replicas` 节点中执行, 对应要执行故障转移的master节点。

手动执行故障转移是特殊的处理方式，与实际发生 master 崩溃导致的故障转移相比更安全，因为执行过程中可以避免数据丢失。
只有当Redis集群系统确定新 master 处理完以前的 master 发出的所有复制流之后，才会让客户端从原始master切换到新 master。

在执行手动故障转移时, 可以在副本节点的日志中看到类似这样的内容：

```
# Manual failover user request accepted.
# Received replication offset for paused master manual failover: 347540
# All master replication stream processed, manual failover can start.
# Start of election delayed for 0 milliseconds (rank #0, offset 347540).
# Starting a failover election for epoch 7545.
# Failover election won: I'm the new master.
```

Basically clients connected to the master we are failing over are stopped. At the same time the master sends its replication offset to the replica, that waits to reach the offset on its side. When the replication offset is reached, the failover starts, and the old master is informed about the configuration switch. When the clients are unblocked on the old master, they are redirected to the new master.

基本上，连接到正在执行故障转移的master服务器的客户端已停止。
同时，master服务器将其复制偏移量(replication offset)发送给副本，副本等待自身到达这个偏移量。
当达到复制偏移量时，故障转移正式启动，并通知旧的 master 切换配置。
当客户端在旧 master 上解除阻塞时, 它们将被重定向到新的 master。

> Note:

- To promote a replica to master, it must first be known as a replica by a majority of the masters in the cluster. Otherwise, it cannot win the failover election. If the replica has just been added to the cluster (see [Adding a new node as a replica](#adding-a-new-node-as-a-replica) below), you may need to wait a while before sending the [CLUSTER FAILOVER](https://redis.io/commands/cluster-failover) command, to make sure the masters in cluster are aware of the new replica.

> 提示:

- 要将副本提升为 master，必须先让集群中的大多数 master 知道他是副本。  否则它无法赢得故障转移选举。 如果副本刚刚添加到集群中（参见后面的 [Adding a new node as a replica](#adding-a-new-node-as-a-replica) 小节）， 可能需要等一段时间才能发送 [CLUSTER FAILOVER](https://redis.io/commands/cluster-failover) 命令，以确保集群中的 master 都感知到这个新副本。



## Adding a new node

Adding a new node is basically the process of adding an empty node and then moving some data into it, in case it is a new master, or telling it to setup as a replica of a known node, in case it is a replica.

We'll show both, starting with the addition of a new master instance.

In both cases the first step to perform is `adding an empty node`.

This is as simple as to start a new node in port 7006 (we already used from 7000 to 7005 for our existing 6 nodes) with the same configuration used for the other nodes, except for the port number, so what you should do in order to conform with the setup we used for the previous nodes:

- Create a new tab in your terminal application.
- Enter the `cluster-test` directory.
- Create a directory named `7006`.
- Create a redis.conf file inside, similar to the one used for the other nodes but using 7006 as port number.
- Finally start the server with `../redis-server ./redis.conf`

At this point the server should be running.

Now we can use `redis-cli` as usual in order to add the node to the existing cluster.

```
redis-cli --cluster add-node 127.0.0.1:7006 127.0.0.1:7000
```

As you can see I used the `add-node` command specifying the address of the new node as first argument, and the address of a random existing node in the cluster as second argument.

In practical terms redis-cli here did very little to help us, it just sent a [CLUSTER MEET](https://redis.io/commands/cluster-meet) message to the node, something that is also possible to accomplish manually. However redis-cli also checks the state of the cluster before to operate, so it is a good idea to perform cluster operations always via redis-cli even when you know how the internals work.

Now we can connect to the new node to see if it really joined the cluster:

```
redis 127.0.0.1:7006> cluster nodes
3e3a6cb0d9a9a87168e266b0a0b24026c0aae3f0 127.0.0.1:7001 master - 0 1385543178575 0 connected 5960-10921
3fc783611028b1707fd65345e763befb36454d73 127.0.0.1:7004 slave 3e3a6cb0d9a9a87168e266b0a0b24026c0aae3f0 0 1385543179583 0 connected
f093c80dde814da99c5cf72a7dd01590792b783b :0 myself,master - 0 0 0 connected
2938205e12de373867bf38f1ca29d31d0ddb3e46 127.0.0.1:7002 slave 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e 0 1385543178072 3 connected
a211e242fc6b22a9427fed61285e85892fa04e08 127.0.0.1:7003 slave 97a3a64667477371c4479320d683e4c8db5858b1 0 1385543178575 0 connected
97a3a64667477371c4479320d683e4c8db5858b1 127.0.0.1:7000 master - 0 1385543179080 0 connected 0-5959 10922-11422
3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e 127.0.0.1:7005 master - 0 1385543177568 3 connected 11423-16383
```

Note that since this node is already connected to the cluster it is already able to redirect client queries correctly and is generally speaking part of the cluster. However it has two peculiarities compared to the other masters:

- It holds no data as it has no assigned hash slots.
- Because it is a master without assigned slots, it does not participate in the election process when a replica wants to become a master.

Now it is possible to assign hash slots to this node using the resharding feature of `redis-cli`. It is basically useless to show this as we already did in a previous section, there is no difference, it is just a resharding having as a target the empty node.


<a name="adding-a-new-node-as-a-replica"></a>

## Adding a new node as a replica

Adding a new Replica can be performed in two ways. The obvious one is to use redis-cli again, but with the --cluster-slave option, like this:

```
redis-cli --cluster add-node 127.0.0.1:7006 127.0.0.1:7000 --cluster-slave
```

Note that the command line here is exactly like the one we used to add a new master, so we are not specifying to which master we want to add the replica. In this case what happens is that redis-cli will add the new node as replica of a random master among the masters with fewer replicas.

However you can specify exactly what master you want to target with your new replica with the following command line:

```
redis-cli --cluster add-node 127.0.0.1:7006 127.0.0.1:7000 --cluster-slave --cluster-master-id 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e
```

This way we assign the new replica to a specific master.

A more manual way to add a replica to a specific master is to add the new node as an empty master, and then turn it into a replica using the [CLUSTER REPLICATE](https://redis.io/commands/cluster-replicate) command. This also works if the node was added as a replica but you want to move it as a replica of a different master.

For example in order to add a replica for the node 127.0.0.1:7005 that is currently serving hash slots in the range 11423-16383, that has a Node ID 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e, all I need to do is to connect with the new node (already added as empty master) and send the command:

```
redis 127.0.0.1:7006> cluster replicate 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e
```

That's it. Now we have a new replica for this set of hash slots, and all the other nodes in the cluster already know (after a few seconds needed to update their config). We can verify with the following command:

```
$ redis-cli -p 7000 cluster nodes | grep slave | grep 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e
f093c80dde814da99c5cf72a7dd01590792b783b 127.0.0.1:7006 slave 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e 0 1385543617702 3 connected
2938205e12de373867bf38f1ca29d31d0ddb3e46 127.0.0.1:7002 slave 3c3a0c74aae0b56170ccb03a76b60cfe7dc1912e 0 1385543617198 3 connected
```

The node 3c3a0c... now has two replicas, running on ports 7002 (the existing one) and 7006 (the new one).



## Removing a node

To remove a replica node just use the `del-node` command of redis-cli:

```
redis-cli --cluster del-node 127.0.0.1:7000 <node-id>
```

The first argument is just a random node in the cluster, the second argument is the ID of the node you want to remove.

You can remove a master node in the same way as well, **however in order to remove a master node it must be empty**. If the master is not empty you need to reshard data away from it to all the other master nodes before.

An alternative to remove a master node is to perform a manual failover of it over one of its replicas and remove the node after it turned into a replica of the new master. Obviously this does not help when you want to reduce the actual number of masters in your cluster, in that case, a resharding is needed.



## Replicas migration

In Redis Cluster it is possible to reconfigure a replica to replicate with a different master at any time just using the following command:

```
CLUSTER REPLICATE <master-node-id>
```

However there is a special scenario where you want replicas to move from one master to another one automatically, without the help of the system administrator. The automatic reconfiguration of replicas is called *replicas migration* and is able to improve the reliability of a Redis Cluster.

Note: you can read the details of replicas migration in the [Redis Cluster Specification](./02-cluster-spec.md#cluster-spec), here we'll only provide some information about the general idea and what you should do in order to benefit from it.

The reason why you may want to let your cluster replicas to move from one master to another under certain condition, is that usually the Redis Cluster is as resistant to failures as the number of replicas attached to a given master.

For example a cluster where every master has a single replica can't continue operations if the master and its replica fail at the same time, simply because there is no other instance to have a copy of the hash slots the master was serving. However while net-splits are likely to isolate a number of nodes at the same time, many other kind of failures, like hardware or software failures local to a single node, are a very notable class of failures that are unlikely to happen at the same time, so it is possible that in your cluster where every master has a replica, the replica is killed at 4am, and the master is killed at 6am. This still will result in a cluster that can no longer operate.

To improve reliability of the system we have the option to add additional replicas to every master, but this is expensive. Replica migration allows to add more replicas to just a few masters. So you have 10 masters with 1 replica each, for a total of 20 instances. However you add, for example, 3 instances more as replicas of some of your masters, so certain masters will have more than a single replica.

With replicas migration what happens is that if a master is left without replicas, a replica from a master that has multiple replicas will migrate to the *orphaned* master. So after your replica goes down at 4am as in the example we made above, another replica will take its place, and when the master will fail as well at 5am, there is still a replica that can be elected so that the cluster can continue to operate.

So what you should know about replicas migration in short?

- The cluster will try to migrate a replica from the master that has the greatest number of replicas in a given moment.
- To benefit from replica migration you have just to add a few more replicas to a single master in your cluster, it does not matter what master.
- There is a configuration parameter that controls the replica migration feature that is called `cluster-migration-barrier`: you can read more about it in the example `redis.conf` file provided with Redis Cluster.



## Upgrading nodes in a Redis Cluster

Upgrading replica nodes is easy since you just need to stop the node and restart it with an updated version of Redis. If there are clients scaling reads using replica nodes, they should be able to reconnect to a different replica if a given one is not available.

Upgrading masters is a bit more complex, and the suggested procedure is:

1. Use [CLUSTER FAILOVER](https://redis.io/commands/cluster-failover) to trigger a manual failover of the master to one of its replicas. (See the [Manual failover](#manual-failover) section in this document.)
2. Wait for the master to turn into a replica.
3. Finally upgrade the node as you do for replicas.
4. If you want the master to be the node you just upgraded, trigger a new manual failover in order to turn back the upgraded node into a master.

Following this procedure you should upgrade one node after the other until all the nodes are upgraded.



## Migrating to Redis Cluster

Users willing to migrate to Redis Cluster may have just a single master, or may already using a preexisting sharding setup, where keys are split among N nodes, using some in-house algorithm or a sharding algorithm implemented by their client library or Redis proxy.

In both cases it is possible to migrate to Redis Cluster easily, however what is the most important detail is if multiple-keys operations are used by the application, and how. There are three different cases:

1. Multiple keys operations, or transactions, or Lua scripts involving multiple keys, are not used. Keys are accessed independently (even if accessed via transactions or Lua scripts grouping multiple commands, about the same key, together).
2. Multiple keys operations, or transactions, or Lua scripts involving multiple keys are used but only with keys having the same `hash tag`, which means that the keys used together all have a `{...}` sub-string that happens to be identical. For example the following multiple keys operation is defined in the context of the same hash tag: `SUNION {user:1000}.foo {user:1000}.bar`.
3. Multiple keys operations, or transactions, or Lua scripts involving multiple keys are used with key names not having an explicit, or the same, hash tag.

The third case is not handled by Redis Cluster: the application requires to be modified in order to don't use multi keys operations or only use them in the context of the same hash tag.

Case 1 and 2 are covered, so we'll focus on those two cases, that are handled in the same way, so no distinction will be made in the documentation.

Assuming you have your preexisting data set split into N masters, where N=1 if you have no preexisting sharding, the following steps are needed in order to migrate your data set to Redis Cluster:

1. Stop your clients. No automatic live-migration to Redis Cluster is currently possible. You may be able to do it orchestrating a live migration in the context of your application / environment.
2. Generate an append only file for all of your N masters using the [BGREWRITEAOF](https://redis.io/commands/bgrewriteaof) command, and waiting for the AOF file to be completely generated.
3. Save your AOF files from aof-1 to aof-N somewhere. At this point you can stop your old instances if you wish (this is useful since in non-virtualized deployments you often need to reuse the same computers).
4. Create a Redis Cluster composed of N masters and zero replicas. You'll add replicas later. Make sure all your nodes are using the append only file for persistence.
5. Stop all the cluster nodes, substitute their append only file with your pre-existing append only files, aof-1 for the first node, aof-2 for the second node, up to aof-N.
6. Restart your Redis Cluster nodes with the new AOF files. They'll complain that there are keys that should not be there according to their configuration.
7. Use `redis-cli --cluster fix` command in order to fix the cluster so that keys will be migrated according to the hash slots each node is authoritative or not.
8. Use `redis-cli --cluster check` at the end to make sure your cluster is ok.
9. Restart your clients modified to use a Redis Cluster aware client library.

There is an alternative way to import data from external instances to a Redis Cluster, which is to use the `redis-cli --cluster import` command.

The command moves all the keys of a running instance (deleting the keys from the source instance) to the specified pre-existing Redis Cluster. However note that if you use a Redis 2.8 instance as source instance the operation may be slow since 2.8 does not implement migrate connection caching, so you may want to restart your source instance with a Redis 3.x version before to perform such operation.

**A note about the word slave used in this page**: Starting with Redis 5, if not for backward compatibility, the Redis project no longer uses the word slave. Unfortunately in this command the word slave is part of the protocol, so we'll be able to remove such occurrences only when this API will be naturally deprecated.




## 相关链接

- [Download Redis](https://redis.io/download)
- [Windows下安装并设置Redis](https://renfufei.blog.csdn.net/article/details/38474435)
- [铁锚的Redis专栏](https://blog.csdn.net/renfufei/category_2470713.html)
- [Redis Documentation](https://redis.io/documentation)
- [Redis cluster tutorial](https://redis.io/topics/cluster-tutorial)
- [Redis Cluster Specification](https://redis.io/topics/cluster-spec)
