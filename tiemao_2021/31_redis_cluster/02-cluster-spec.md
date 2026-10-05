# Redis Cluster Specification

Welcome to the **Redis Cluster Specification**. Here you'll find information about algorithms and design rationales of Redis Cluster. This document is a work in progress as it is continuously synchronized with the actual implementation of Redis.


<a name="cluster-spec"></a>
# 2. Redis集群规范文档


系列文章:

- 1. Redis集群入门教程: [01-cluster-tutorial.md](./01-cluster-tutorial.md)
- 2. Redis集群规范文档: [02-cluster-spec.md](./02-cluster-spec.md)
- 3. 5分钟快速创建Redis集群: [03-cluster-5-minutes](./03-cluster-5-minutes.md)



欢迎查阅 《Redis集群规范文档》。  
本文档介绍有关 Redis 集群的算法和设计原理。
这是一份不断更新的文档, 与 Redis 的具体实现保持密切同步。


<a name="main-properties-and-rationales-of-the-design"></a>
# Main properties and rationales of the design



# 设计的主要特性与原理



## Redis Cluster goals

Redis Cluster is a distributed implementation of Redis with the following goals, in order of importance in the design:

- High performance and linear scalability up to 1000 nodes. There are no proxies, asynchronous replication is used, and no merge operations are performed on values.
- Acceptable degree of write safety: the system tries (in a best-effort way) to retain all the writes originating from clients connected with the majority of the master nodes. Usually there are small windows where acknowledged writes can be lost. Windows to lose acknowledged writes are larger when clients are in a minority partition.
- Availability: Redis Cluster is able to survive partitions where the majority of the master nodes are reachable and there is at least one reachable replica for every master node that is no longer reachable. Moreover using *replicas migration*, masters no longer replicated by any replica will receive one from a master which is covered by multiple replicas.

What is described in this document is implemented in Redis 3.0 or greater.



## Redis集群的目标

Redis Cluster 是 Redis 的分布式实现, 其设计目标按重要程度排序如下:

- 高性能与线性扩展能力, 最多可支持 1000 个节点。不使用代理(proxy), 采用异步复制, 也不对值(value)执行合并(merge)操作。
- 可接受的写入安全程度: 系统会尽最大努力(best-effort)保留来自连接到大多数主节点(master)的客户端的写入。通常仍存在一些较小的时间窗口会丢失已确认的写入; 当客户端处于少数派分区时, 丢失已确认写入的时间窗口会更大。
- 可用性: 当大多数主节点可达, 且每个不再可达的主节点至少还有一个可达的副本(replica)时, Redis Cluster 能够扛过这种分区。此外, 借助*副本迁移(replicas migration)*, 没有任何副本复制的主节点, 会从拥有多个副本的主节点那里接收一个副本。

本文档描述的内容在 Redis 3.0 或更高版本中实现。



## Implemented subset

Redis Cluster implements all the single key commands available in the non-distributed version of Redis. Commands performing complex multi-key operations like Set type unions or intersections are implemented as well as long as the keys all hash to the same slot.

Redis Cluster implements a concept called `hash tags` that can be used in order to force certain keys to be stored in the same hash slot. However during manual resharding, multi-key operations may become unavailable for some time while single key operations are always available.

Redis Cluster does not support multiple databases like the standalone version of Redis. There is just database 0 and the [SELECT](https://redis.io/commands/select) command is not allowed.



## 已实现的子集

Redis Cluster 实现了非分布式版本 Redis 中所有可用的单键(single key)命令。对于像集合(Set)类型求并集或交集这类复杂的多键操作, 只要涉及的键都哈希到同一个槽(slot), 也同样实现了。

Redis Cluster 实现了一个名为 `hash tags`(哈希标签)的概念, 用于强制某些键存储在同一个哈希槽中。不过在手动重新分片(resharding)期间, 多键操作可能会暂时不可用, 而单键操作始终可用。

Redis Cluster 不支持像单机版 Redis 那样的多个数据库。它只有一个数据库 0, 并且不允许使用 [SELECT](https://redis.io/commands/select) 命令。



## Clients and Servers roles in the Redis Cluster protocol

In Redis Cluster nodes are responsible for holding the data, and taking the state of the cluster, including mapping keys to the right nodes. Cluster nodes are also able to auto-discover other nodes, detect non-working nodes, and promote replica nodes to master when needed in order to continue to operate when a failure occurs.

To perform their tasks all the cluster nodes are connected using a TCP bus and a binary protocol, called the **Redis Cluster Bus**. Every node is connected to every other node in the cluster using the cluster bus. Nodes use a gossip protocol to propagate information about the cluster in order to discover new nodes, to send ping packets to make sure all the other nodes are working properly, and to send cluster messages needed to signal specific conditions. The cluster bus is also used in order to propagate Pub/Sub messages across the cluster and to orchestrate manual failovers when requested by users (manual failovers are failovers which are not initiated by the Redis Cluster failure detector, but by the system administrator directly).

Since cluster nodes are not able to proxy requests, clients may be redirected to other nodes using redirection errors `-MOVED` and `-ASK`. The client is in theory free to send requests to all the nodes in the cluster, getting redirected if needed, so the client is not required to hold the state of the cluster. However clients that are able to cache the map between keys and nodes can improve the performance in a sensible way.



## Redis集群协议中客户端和服务器的角色

在 Redis Cluster 中, 节点负责保存数据以及维护集群的状态, 包括将键映射到正确的节点。集群节点还能自动发现其他节点、检测失效节点, 并在需要时将副本节点晋升为主节点, 以便在发生故障时继续运行。

为了完成这些任务, 所有集群节点都通过一条 TCP 总线和一个二进制协议连接在一起, 这个协议称为 **Redis Cluster Bus**(集群总线)。集群中每个节点都通过集群总线与其他所有节点相连。节点使用 gossip 协议传播集群信息, 以便发现新节点、发送 ping 包确认其他节点工作正常, 并发送用于通知特定状态的集群消息。集群总线还用于在整个集群中传播发布/订阅(Pub/Sub)消息, 以及在用户请求时协调手动故障转移(手动故障转移不是由 Redis Cluster 的故障检测器发起的, 而是由系统管理员直接发起的)。

由于集群节点无法代理请求, 客户端可能会被重定向到其他节点, 使用 `-MOVED` 和 `-ASK` 重定向错误。理论上客户端可以自由地向集群中的任意节点发送请求, 必要时接受重定向, 因此客户端并不需要保存集群状态。不过, 能够缓存键与节点之间映射关系的客户端, 可以显著提升性能。



## Write safety

Redis Cluster uses asynchronous replication between nodes, and **last failover wins** implicit merge function. This means that the last elected master dataset eventually replaces all the other replicas. There is always a window of time when it is possible to lose writes during partitions. However these windows are very different in the case of a client that is connected to the majority of masters, and a client that is connected to the minority of masters.

Redis Cluster tries harder to retain writes that are performed by clients connected to the majority of masters, compared to writes performed in the minority side. The following are examples of scenarios that lead to loss of acknowledged writes received in the majority partitions during failures:

1. A write may reach a master, but while the master may be able to reply to the client, the write may not be propagated to replicas via the asynchronous replication used between master and replica nodes. If the master dies without the write reaching the replicas, the write is lost forever if the master is unreachable for a long enough period that one of its replicas is promoted. This is usually hard to observe in the case of a total, sudden failure of a master node since masters try to reply to clients (with the acknowledge of the write) and replicas (propagating the write) at about the same time. However it is a real world failure mode.
2. Another theoretically possible failure mode where writes are lost is the following:

- A master is unreachable because of a partition.
- It gets failed over by one of its replicas.
- After some time it may be reachable again.
- A client with an out-of-date routing table may write to the old master before it is converted into a replica (of the new master) by the cluster.

The second failure mode is unlikely to happen because master nodes unable to communicate with the majority of the other masters for enough time to be failed over will no longer accept writes, and when the partition is fixed writes are still refused for a small amount of time to allow other nodes to inform about configuration changes. This failure mode also requires that the client's routing table has not yet been updated.

Writes targeting the minority side of a partition have a larger window in which to get lost. For example, Redis Cluster loses a non-trivial number of writes on partitions where there is a minority of masters and at least one or more clients, since all the writes sent to the masters may potentially get lost if the masters are failed over in the majority side.

Specifically, for a master to be failed over it must be unreachable by the majority of masters for at least `NODE_TIMEOUT`, so if the partition is fixed before that time, no writes are lost. When the partition lasts for more than `NODE_TIMEOUT`, all the writes performed in the minority side up to that point may be lost. However the minority side of a Redis Cluster will start refusing writes as soon as `NODE_TIMEOUT` time has elapsed without contact with the majority, so there is a maximum window after which the minority becomes no longer available. Hence, no writes are accepted or lost after that time.



## 写入安全性

Redis Cluster 在节点之间使用异步复制, 并采用 **last failover wins**(最后一次故障转移者胜出)这一隐式合并机制。也就是说, 最后被选出的主节点的数据集最终会覆盖所有其他副本。在网络分区期间, 总存在一段可能丢失写入的时间窗口。不过对于连接大多数主节点的客户端, 与连接少数派主节点的客户端相比, 这些窗口的大小差别很大。

相对于少数派一侧的写入, Redis Cluster 会更努力地保留由连接大多数主节点的客户端所执行的写入。以下是故障期间导致多数派分区中已确认写入丢失的一些场景示例:

1. 一次写入可能已到达某个主节点, 主节点也可能已经回复了客户端, 但该写入还没有通过主从节点之间的异步复制传播到副本。如果这个主节点在写入到达副本之前就宕机了, 并且此后足够长的时间内一直不可达, 以致它的某个副本被晋升, 那么这次写入就永久丢失了。在主节点发生整体性、突发性故障时, 这种现象通常很难观察到, 因为主节点大致会同时向客户端回复(确认写入)和向副本传播(复制写入)。但这确实是一种真实存在的故障模式。
2. 另一种理论上可能发生、会导致写入丢失的故障模式如下:

- 某个主节点因网络分区而不可达。
- 它的某个副本对它执行了故障转移。
- 过一段时间后, 它可能又变得可达了。
- 一个路由表已经过时的客户端, 可能会在这个旧主节点被集群转换为(新主节点的)副本之前, 向它写入数据。

第二种故障模式不太可能发生, 因为无法与大多数其他主节点通信足够长时间(长到足以被故障转移)的主节点将不再接受写入; 而且在分区恢复后的一小段时间内, 该节点仍然会拒绝写入, 以便让其他节点有时间通知配置变更。这种故障模式还要求客户端路由表尚未更新。

针对分区少数派一侧的写入, 丢失窗口更大。例如, 在只有少数派主节点、并且还有一个或多个客户端的分区中, Redis Cluster 会丢失相当数量的写入, 因为如果这些主节点在多数派一侧被故障转移, 那么发送给它们的所有写入都有可能丢失。

具体来说, 一个主节点要被故障转移, 它必须至少 `NODE_TIMEOUT` 时间内不被大多数主节点可达; 因此如果分区在这段时间之前就恢复了, 就不会丢失写入。当分区持续时间超过 `NODE_TIMEOUT` 时, 在此之前少数派一侧执行的所有写入都可能丢失。不过, 一旦与多数派失去联系的时间达到 `NODE_TIMEOUT`, Redis Cluster 的少数派一侧就会开始拒绝写入, 因此存在一个最大窗口, 超过这个窗口后少数派就变得不可用了。也就是说, 在那之后既不会接受写入, 也不会丢失写入。



## Availability

Redis Cluster is not available in the minority side of the partition. In the majority side of the partition assuming that there are at least the majority of masters and a replica for every unreachable master, the cluster becomes available again after `NODE_TIMEOUT` time plus a few more seconds required for a replica to get elected and failover its master (failovers are usually executed in a matter of 1 or 2 seconds).

This means that Redis Cluster is designed to survive failures of a few nodes in the cluster, but it is not a suitable solution for applications that require availability in the event of large net splits.

In the example of a cluster composed of N master nodes where every node has a single replica, the majority side of the cluster will remain available as long as a single node is partitioned away, and will remain available with a probability of `1-(1/(N*2-1))` when two nodes are partitioned away (after the first node fails we are left with `N*2-1` nodes in total, and the probability of the only master without a replica to fail is `1/(N*2-1))`.

For example, in a cluster with 5 nodes and a single replica per node, there is a `1/(5*2-1) = 11.11%` probability that after two nodes are partitioned away from the majority, the cluster will no longer be available.

Thanks to a Redis Cluster feature called **replicas migration** the Cluster availability is improved in many real world scenarios by the fact that replicas migrate to orphaned masters (masters no longer having replicas). So at every successful failure event, the cluster may reconfigure the replicas layout in order to better resist the next failure.



## 可用性

在网络分区的少数派一侧, Redis Cluster 是不可用的。在分区的多数派一侧, 只要至少拥有大多数主节点, 且每个不可达的主节点都有一个副本, 那么集群在 `NODE_TIMEOUT` 时间之后、再加上副本被选出并对其主节点执行故障转移所需的几秒钟(故障转移通常在 1 到 2 秒内完成), 就会重新变为可用。

这意味着 Redis Cluster 的设计目标是能够承受集群中少数节点发生故障, 但对于在大规模网络分裂时需要保证可用性的应用来说, 它并不是合适的解决方案。

以由 N 个主节点组成、每个节点只有一个副本的集群为例: 只要有单个节点被分区隔离, 集群的多数派一侧就仍然可用; 当两个节点被分区隔离时, 其保持可用的概率为 `1-(1/(N*2-1))`(第一个节点故障后, 总共还剩 `N*2-1` 个节点, 而唯一没有副本的那个主节点发生故障的概率是 `1/(N*2-1))`)。

例如, 在一个有 5 个节点、每个节点一个副本的集群中, 当两个节点被隔离出多数派后, 集群不再可用的概率是 `1/(5*2-1) = 11.11%`。

得益于 Redis Cluster 中一个名为 **replicas migration**(副本迁移)的特性, 在许多实际场景中集群的可用性得到了提升, 因为副本会迁移到孤立的(orphaned)主节点上(即不再拥有副本的主节点)。因此, 每当发生一次成功的故障事件后, 集群都可能重新调整副本的布局, 以便更好地抵御下一次故障。



## Performance

In Redis Cluster nodes don't proxy commands to the right node in charge for a given key, but instead they redirect clients to the right nodes serving a given portion of the key space.

Eventually clients obtain an up-to-date representation of the cluster and which node serves which subset of keys, so during normal operations clients directly contact the right nodes in order to send a given command.

Because of the use of asynchronous replication, nodes do not wait for other nodes' acknowledgment of writes (if not explicitly requested using the [WAIT](https://redis.io/commands/wait) command).

Also, because multi-key commands are only limited to *near* keys, data is never moved between nodes except when resharding.

Normal operations are handled exactly as in the case of a single Redis instance. This means that in a Redis Cluster with N master nodes you can expect the same performance as a single Redis instance multiplied by N as the design scales linearly. At the same time the query is usually performed in a single round trip, since clients usually retain persistent connections with the nodes, so latency figures are also the same as the single standalone Redis node case.

Very high performance and scalability while preserving weak but reasonable forms of data safety and availability is the main goal of Redis Cluster.



## 性能

在 Redis Cluster 中, 节点不会把命令代理到负责该键的正确节点, 而是把客户端重定向到负责该键空间某一部分的正确节点。

客户端最终会获得集群的最新视图, 知道哪个节点服务于哪部分键, 因此在正常运行时, 客户端会直接联系正确的节点来发送给定的命令。

由于使用了异步复制, 节点不会等待其他节点对写入的确认(除非通过 [WAIT](https://redis.io/commands/wait) 命令显式要求)。

另外, 由于多键命令只限于彼此*相邻(near)*的键, 所以除了重新分片(resharding)时之外, 数据从不会在节点之间移动。

正常操作的处理方式与单个 Redis 实例完全相同。这意味着在拥有 N 个主节点的 Redis Cluster 中, 由于设计上是线性扩展的, 你可以预期获得相当于单个 Redis 实例乘以 N 的性能。同时, 由于客户端通常与节点保持长连接, 查询一般只需一次往返, 因此延迟表现也与单个独立的 Redis 节点相同。

在保持较弱但合理的数据安全性和可用性的同时, 实现极高的性能和可扩展性, 正是 Redis Cluster 的主要目标。



## Why merge operations are avoided

Redis Cluster design avoids conflicting versions of the same key-value pair in multiple nodes as in the case of the Redis data model this is not always desirable. Values in Redis are often very large; it is common to see lists or sorted sets with millions of elements. Also data types are semantically complex. Transferring and merging these kind of values can be a major bottleneck and/or may require the non-trivial involvement of application-side logic, additional memory to store meta-data, and so forth.

There are no strict technological limits here. CRDTs or synchronously replicated state machines can model complex data types similar to Redis. However, the actual run time behavior of such systems would not be similar to Redis Cluster. Redis Cluster was designed in order to cover the exact use cases of the non-clustered Redis version.



## 为什么避免合并(merge)操作

Redis Cluster 的设计避免了同一个键值对在多个节点上出现相互冲突的版本, 因为就 Redis 的数据模型而言, 这种做法并不总是可取的。Redis 中的值往往非常大; 出现包含数百万个元素的列表(list)或有序集合(sorted set)是很常见的事。而且各数据类型的语义也很复杂。传输并合并这类值, 可能成为主要的性能瓶颈, 并且/或者需要应用侧逻辑的深度参与、存储元数据所需的额外内存, 等等。

这在技术上并没有严格的限制。CRDT 或同步复制的状态机也可以为类似 Redis 的复杂数据类型建模。但这类系统的实际运行时行为不会与 Redis Cluster 相似。Redis Cluster 的设计目标就是覆盖非集群版 Redis 的确切用例。



# Overview of Redis Cluster main components



# Redis集群主要组件概览



## Keys distribution model

The key space is split into 16384 slots, effectively setting an upper limit for the cluster size of 16384 master nodes (however the suggested max size of nodes is in the order of ~ 1000 nodes).

Each master node in a cluster handles a subset of the 16384 hash slots. The cluster is **stable** when there is no cluster reconfiguration in progress (i.e. where hash slots are being moved from one node to another). When the cluster is stable, a single hash slot will be served by a single node (however the serving node can have one or more replicas that will replace it in the case of net splits or failures, and that can be used in order to scale read operations where reading stale data is acceptable).

The base algorithm used to map keys to hash slots is the following (read the next paragraph for the hash tag exception to this rule):

```
HASH_SLOT = CRC16(key) mod 16384
```

The CRC16 is specified as follows:

- Name: XMODEM (also known as ZMODEM or CRC-16/ACORN)
- Width: 16 bit
- Poly: 1021 (That is actually x16 + x12 + x5 + 1)
- Initialization: 0000
- Reflect Input byte: False
- Reflect Output CRC: False
- Xor constant to output CRC: 0000
- Output for "123456789": 31C3

14 out of 16 CRC16 output bits are used (this is why there is a modulo 16384 operation in the formula above).

In our tests CRC16 behaved remarkably well in distributing different kinds of keys evenly across the 16384 slots.

**Note**: A reference implementation of the CRC16 algorithm used is available in the Appendix A of this document.



## 键(key)的分布模型

键空间被划分为 16384 个槽(slot), 这实际上将集群规模的上限设为 16384 个主节点(不过建议的节点数上限大约在 1000 个节点这个量级)。

集群中的每个主节点负责 16384 个哈希槽中的一部分。当没有正在进行的集群重新配置(即没有哈希槽正在从一个节点迁移到另一个节点)时, 集群处于 **稳定(stable)** 状态。集群稳定时, 一个哈希槽由单个节点提供服务(不过提供服务的节点可以有一个或多个副本, 在网络分裂或故障时用来接替它, 也可以在可以接受读取过期数据的场景下用于扩展读操作)。

用于将键映射到哈希槽的基础算法是 `HASH_SLOT = CRC16(key) mod 16384`(哈希标签(hash tag)是对该规则的例外, 请阅读下一段)。

CRC16 的参数规定如下:

- Name: XMODEM(也称为 ZMODEM 或 CRC-16/ACORN)
- Width: 16 bit
- Poly: 1021(实际上就是 x16 + x12 + x5 + 1)
- Initialization: 0000
- Reflect Input byte: False
- Reflect Output CRC: False
- Xor constant to output CRC: 0000
- Output for "123456789": 31C3

CRC16 的 16 位输出中只使用了 14 位(这就是上面公式中要对 16384 取模的原因)。

在我们的测试中, CRC16 在将不同类型的键均匀分布到 16384 个槽这一方面表现得相当出色。

**注意**: 所使用的 CRC16 算法的参考实现见本文档的附录 A。



## Keys hash tags

There is an exception for the computation of the hash slot that is used in order to implement **hash tags**. Hash tags are a way to ensure that multiple keys are allocated in the same hash slot. This is used in order to implement multi-key operations in Redis Cluster.

In order to implement hash tags, the hash slot for a key is computed in a slightly different way in certain conditions. If the key contains a "{...}" pattern only the substring between `{` and `}` is hashed in order to obtain the hash slot. However since it is possible that there are multiple occurrences of `{` or `}` the algorithm is well specified by the following rules:

- IF the key contains a `{` character.
- AND IF there is a `}` character to the right of `{`.
- AND IF there are one or more characters between the first occurrence of `{` and the first occurrence of `}`.

Then instead of hashing the key, only what is between the first occurrence of `{` and the following first occurrence of `}` is hashed.

Examples:

- The two keys `{user1000}.following` and `{user1000}.followers` will hash to the same hash slot since only the substring `user1000` will be hashed in order to compute the hash slot.
- For the key `foo{}{bar}` the whole key will be hashed as usually since the first occurrence of `{` is followed by `}` on the right without characters in the middle.
- For the key `foo{{bar}}zap` the substring `{bar` will be hashed, because it is the substring between the first occurrence of `{` and the first occurrence of `}` on its right.
- For the key `foo{bar}{zap}` the substring `bar` will be hashed, since the algorithm stops at the first valid or invalid (without bytes inside) match of `{` and `}`.
- What follows from the algorithm is that if the key starts with `{}`, it is guaranteed to be hashed as a whole. This is useful when using binary data as key names.

Adding the hash tags exception, the following is an implementation of the `HASH_SLOT` function in Ruby and C language.

Ruby example code:

```
def HASH_SLOT(key)
    s = key.index "{"
    if s
        e = key.index "}",s+1
        if e && e != s+1
            key = key[s+1..e-1]
        end
    end
    crc16(key) % 16384
end
```

C example code:

```
unsigned int HASH_SLOT(char *key, int keylen) {
    int s, e; /* start-end indexes of { and } */

    /* Search the first occurrence of '{'. */
    for (s = 0; s < keylen; s++)
        if (key[s] == '{') break;

    /* No '{' ? Hash the whole key. This is the base case. */
    if (s == keylen) return crc16(key,keylen) & 16383;

    /* '{' found? Check if we have the corresponding '}'. */
    for (e = s+1; e < keylen; e++)
        if (key[e] == '}') break;

    /* No '}' or nothing between {} ? Hash the whole key. */
    if (e == keylen || e == s+1) return crc16(key,keylen) & 16383;

    /* If we are here there is both a { and a } on its right. Hash
     * what is in the middle between { and }. */
    return crc16(key+s+1,e-s-1) & 16383;
}
```



## 键的哈希标签(hash tags)

哈希槽的计算存在一个例外, 它就是用来实现 **hash tags**(哈希标签)的。哈希标签是一种确保多个键被分配到同一个哈希槽的方式, 在 Redis Cluster 中用于实现多键操作。

为了实现哈希标签, 在某些条件下, 键的哈希槽会以略微不同的方式计算。如果键中包含 “{...}” 这种模式, 则只对 `{` 和 `}` 之间的子串进行哈希, 从而得到哈希槽。不过由于 `{` 或 `}` 可能出现多次, 该算法由以下规则明确界定:

- 如果键中包含 `{` 字符。
- 并且如果 `{` 右侧存在 `}` 字符。
- 并且如果第一个 `{` 和第一个 `}` 之间有一个或多个字符。

那么就不再对键进行哈希, 而只对第一个 `{` 到其后第一个 `}` 之间的内容进行哈希。

示例:

- 两个键 `{user1000}.following` 和 `{user1000}.followers` 会哈希到同一个哈希槽, 因为计算哈希槽时只对子串 `user1000` 进行哈希。
- 对于键 `foo{}{bar}`, 仍会按通常方式对整个键进行哈希, 因为第一次出现的 `{` 右侧紧跟着 `}`, 中间没有任何字符。
- 对于键 `foo{{bar}}zap`, 会哈希子串 `{bar`, 因为它是第一个 `{` 与其右侧第一个 `}` 之间的子串。
- 对于键 `foo{bar}{zap}`, 会哈希子串 `bar`, 因为算法会在第一个有效或无效(内部不含字节)的 `{` 与 `}` 匹配处停止。
- 由此算法可以得出: 如果键以 `{}` 开头, 则可以保证它整体被哈希。当使用二进制数据作为键名时, 这一点很有用。

加入哈希标签这一例外后, 下面是 `HASH_SLOT` 函数在 Ruby 和 C 语言中的实现(Ruby 示例代码与 C 示例代码见上文英文部分)。



## Cluster nodes attributes

Every node has a unique name in the cluster. The node name is the hex representation of a 160 bit random number, obtained the first time a node is started (usually using /dev/urandom). The node will save its ID in the node configuration file, and will use the same ID forever, or at least as long as the node configuration file is not deleted by the system administrator, or a *hard reset* is requested via the [CLUSTER RESET](https://redis.io/commands/cluster-reset) command.

The node ID is used to identify every node across the whole cluster. It is possible for a given node to change its IP address without any need to also change the node ID. The cluster is also able to detect the change in IP/port and reconfigure using the gossip protocol running over the cluster bus.

The node ID is not the only information associated with each node, but is the only one that is always globally consistent. Every node has also the following set of information associated. Some information is about the cluster configuration detail of this specific node, and is eventually consistent across the cluster. Some other information, like the last time a node was pinged, is instead local to each node.

Every node maintains the following information about other nodes that it is aware of in the cluster: The node ID, IP and port of the node, a set of flags, what is the master of the node if it is flagged as `replica`, last time the node was pinged and the last time the pong was received, the current *configuration epoch* of the node (explained later in this specification), the link state and finally the set of hash slots served.

A detailed [explanation of all the node fields](https://redis.io/commands/cluster-nodes) is described in the [CLUSTER NODES](https://redis.io/commands/cluster-nodes) documentation.

The [CLUSTER NODES](https://redis.io/commands/cluster-nodes) command can be sent to any node in the cluster and provides the state of the cluster and the information for each node according to the local view the queried node has of the cluster.

The following is sample output of the [CLUSTER NODES](https://redis.io/commands/cluster-nodes) command sent to a master node in a small cluster of three nodes.

```
$ redis-cli cluster nodes
d1861060fe6a534d42d8a19aeb36600e18785e04 127.0.0.1:6379 myself - 0 1318428930 1 connected 0-1364
3886e65cc906bfd9b1f7e7bde468726a052d1dae 127.0.0.1:6380 master - 1318428930 1318428931 2 connected 1365-2729
d289c575dcbc4bdd2931585fd4339089e461a27d 127.0.0.1:6381 master - 1318428931 1318428931 3 connected 2730-4095
```

In the above listing the different fields are in order: node id, address:port, flags, last ping sent, last pong received, configuration epoch, link state, slots. Details about the above fields will be covered as soon as we talk of specific parts of Redis Cluster.



## 集群节点属性

在集群中, 每个节点都有一个唯一的名称。节点名是一个 160 位随机数的十六进制表示, 在节点首次启动时生成(通常使用 /dev/urandom)。节点会把自己的 ID 保存到节点配置文件中, 并永久使用同一个 ID —— 至少在系统管理员没有删除该配置文件、或者没有通过 [CLUSTER RESET](https://redis.io/commands/cluster-reset) 命令请求*硬重置(hard reset)*之前是如此。

节点 ID 用于在整个集群中标识每一个节点。某个节点可以更改自己的 IP 地址而无需同时更改节点 ID。集群还能够检测到 IP/端口的变化, 并通过运行在集群总线上的 gossip 协议重新配置。

节点 ID 并不是与每个节点关联的唯一信息, 但它是唯一始终全局一致的信息。每个节点还关联着下面这组信息。有些信息是关于该节点自身的集群配置细节, 在整个集群中最终一致。另一些信息, 比如最近一次被 ping 的时间, 则是各节点本地独有的。

每个节点都会维护它所知道的其他节点的以下信息: 节点 ID、节点的 IP 和端口、一组标志(flags)、如果该节点被标记为 `replica` 时它的主节点是谁、最近一次被 ping 的时间以及最近一次收到 pong 的时间、该节点当前的*配置纪元(configuration epoch)*(本文档后面会解释)、链路状态, 最后还有它负责的哈希槽集合。

关于[所有节点字段的详细说明](https://redis.io/commands/cluster-nodes)见 [CLUSTER NODES](https://redis.io/commands/cluster-nodes) 文档。

[CLUSTER NODES](https://redis.io/commands/cluster-nodes) 命令可以发送给集群中的任意节点, 它会根据被查询节点的本地视图, 提供集群的状态以及每个节点的信息。

下面是向一个由三个节点组成的小集群中的某个主节点发送 [CLUSTER NODES](https://redis.io/commands/cluster-nodes) 命令后的示例输出(见上文代码块)。

在上面的输出中, 各字段依次为: node id、address:port、flags、last ping sent、last pong received、configuration epoch、link state、slots。等我们讲到 Redis Cluster 的具体部分时, 会详细介绍这些字段。



## The Cluster bus

Every Redis Cluster node has an additional TCP port for receiving incoming connections from other Redis Cluster nodes. This port will be derived by adding 10000 to the data port or it can be specified with the cluster-port config.

Example 1:

If a Redis node is listening for client connections on port 6379, and you do not add cluster-port parameter in redis.conf, the Cluster bus port 16379 will be opened.

Example 2:

If a Redis node is listening for client connections on port 6379, and you set cluster-port 20000 in redis.conf, the Cluster bus port 20000 will be opened.

Node-to-node communication happens exclusively using the Cluster bus and the Cluster bus protocol: a binary protocol composed of frames of different types and sizes. The Cluster bus binary protocol is not publicly documented since it is not intended for external software devices to talk with Redis Cluster nodes using this protocol. However you can obtain more details about the Cluster bus protocol by reading the `cluster.h` and `cluster.c` files in the Redis Cluster source code.



## 集群总线(Cluster bus)

每个 Redis Cluster 节点都有一个额外的 TCP 端口, 用于接收来自其他 Redis Cluster 节点的连接。这个端口通过数据端口加 10000 得出, 也可以通过 cluster-port 配置项来指定。

示例 1:

如果某个 Redis 节点在 6379 端口上监听客户端连接, 并且你没有在 redis.conf 中添加 cluster-port 参数, 那么会打开集群总线端口 16379。

示例 2:

如果某个 Redis 节点在 6379 端口上监听客户端连接, 并且你在 redis.conf 中设置 cluster-port 20000, 那么会打开集群总线端口 20000。

节点之间的通信完全通过集群总线(Cluster bus)和集群总线协议进行: 这是一种由不同类型、不同大小的帧(frame)组成的二进制协议。集群总线二进制协议没有公开文档, 因为它并不打算让外部软件通过该协议与 Redis Cluster 节点通信。不过, 你可以阅读 Redis Cluster 源码中的 `cluster.h` 和 `cluster.c` 文件, 以获取有关集群总线协议的更多细节。



## Cluster topology

Redis Cluster is a full mesh where every node is connected with every other node using a TCP connection.

In a cluster of N nodes, every node has N-1 outgoing TCP connections, and N-1 incoming connections.

These TCP connections are kept alive all the time and are not created on demand. When a node expects a pong reply in response to a ping in the cluster bus, before waiting long enough to mark the node as unreachable, it will try to refresh the connection with the node by reconnecting from scratch.

While Redis Cluster nodes form a full mesh, **nodes use a gossip protocol and a configuration update mechanism in order to avoid exchanging too many messages between nodes during normal conditions**, so the number of messages exchanged is not exponential.



## 集群拓扑

Redis Cluster 是一个全网状(full mesh)结构, 每个节点都通过一条 TCP 连接与其他所有节点相连。

在一个有 N 个节点的集群中, 每个节点有 N-1 条出站 TCP 连接, 以及 N-1 条入站连接。

这些 TCP 连接始终保持存活, 并非按需创建。当某个节点在集群总线上发出 ping 后等待 pong 回复时, 在等待到足以将该节点标记为不可达之前, 它会尝试从头重新连接来刷新与该节点之间的连接。

虽然 Redis Cluster 的节点构成全网状结构, **但节点使用 gossip 协议和配置更新机制来避免在正常状态下节点之间交换过多消息**, 因此交换的消息数量并非指数级增长。



## Nodes handshake

Nodes always accept connections on the cluster bus port, and even reply to pings when received, even if the pinging node is not trusted. However, all other packets will be discarded by the receiving node if the sending node is not considered part of the cluster.

A node will accept another node as part of the cluster only in two ways:

- If a node presents itself with a `MEET` message ([CLUSTER MEET](https://redis.io/commands/cluster-meet) command). A meet message is exactly like a [PING](https://redis.io/commands/ping) message, but forces the receiver to accept the node as part of the cluster. Nodes will send `MEET` messages to other nodes **only if** the system administrator requests this via the following command:

  CLUSTER MEET ip port

- A node will also register another node as part of the cluster if a node that is already trusted will gossip about this other node. So if A knows B, and B knows C, eventually B will send gossip messages to A about C. When this happens, A will register C as part of the network, and will try to connect with C.

This means that as long as we join nodes in any connected graph, they'll eventually form a fully connected graph automatically. This means that the cluster is able to auto-discover other nodes, but only if there is a trusted relationship that was forced by the system administrator.

This mechanism makes the cluster more robust but prevents different Redis clusters from accidentally mixing after change of IP addresses or other network related events.



## 节点握手

节点总是接受集群总线端口上的连接, 收到 ping 时甚至也会回复, 即使发来 ping 的节点并不可信。但是, 如果发送方节点不被视为集群的一部分, 接收方节点会丢弃除此之外的所有其他数据包。

节点只会在以下两种情况下接受另一个节点作为集群的一部分:

- 当某个节点通过 `MEET` 消息([CLUSTER MEET](https://redis.io/commands/cluster-meet) 命令)自荐加入时。MEET 消息与 [PING](https://redis.io/commands/ping) 消息完全相同, 但会强制接收方接受该节点作为集群的一部分。节点**只有在**系统管理员通过以下命令请求时, 才会向其他节点发送 `MEET` 消息:

  CLUSTER MEET ip port

- 当一个已经可信的节点 gossip 传播另一个节点时, 节点也会把那个节点注册为集群的一部分。也就是说, 如果 A 认识 B, B 认识 C, 那么最终 B 会向 A 发送关于 C 的 gossip 消息。此时, A 会把 C 注册为网络的一部分, 并尝试与 C 建立连接。

这意味着, 只要我们把节点以任何连通图的形式加入集群, 它们最终会自动形成一个全连通图。也就是说, 集群能够自动发现其他节点, 但前提是存在一个由系统管理员强加的可信关系。

这一机制让集群更加健壮, 同时也避免了不同的 Redis 集群在 IP 地址变更或其他与网络相关的事件之后意外地混在一起。



# Redirection and resharding



# 重定向与重新分片



## MOVED Redirection

A Redis client is free to send queries to every node in the cluster, including replica nodes. The node will analyze the query, and if it is acceptable (that is, only a single key is mentioned in the query, or the multiple keys mentioned are all to the same hash slot) it will lookup what node is responsible for the hash slot where the key or keys belong.

If the hash slot is served by the node, the query is simply processed, otherwise the node will check its internal hash slot to node map, and will reply to the client with a MOVED error, like in the following example:

```
GET x
-MOVED 3999 127.0.0.1:6381
```

The error includes the hash slot of the key (3999) and the ip:port of the instance that can serve the query. The client needs to reissue the query to the specified node's IP address and port. Note that even if the client waits a long time before reissuing the query, and in the meantime the cluster configuration changed, the destination node will reply again with a MOVED error if the hash slot 3999 is now served by another node. The same happens if the contacted node had no updated information.

So while from the point of view of the cluster nodes are identified by IDs we try to simplify our interface with the client just exposing a map between hash slots and Redis nodes identified by IP:port pairs.

The client is not required to, but should try to memorize that hash slot 3999 is served by 127.0.0.1:6381. This way once a new command needs to be issued it can compute the hash slot of the target key and have a greater chance of choosing the right node.

An alternative is to just refresh the whole client-side cluster layout using the [CLUSTER NODES](https://redis.io/commands/cluster-nodes) or [CLUSTER SLOTS](https://redis.io/commands/cluster-slots) commands when a MOVED redirection is received. When a redirection is encountered, it is likely multiple slots were reconfigured rather than just one, so updating the client configuration as soon as possible is often the best strategy.

Note that when the Cluster is stable (no ongoing changes in the configuration), eventually all the clients will obtain a map of hash slots -> nodes, making the cluster efficient, with clients directly addressing the right nodes without redirections, proxies or other single point of failure entities.

A client **must be also able to handle -ASK redirections** that are described later in this document, otherwise it is not a complete Redis Cluster client.



## MOVED 重定向

Redis 客户端可以自由地向集群中的每个节点(包括副本节点)发送查询。节点会分析该查询, 如果查询是可接受的(也就是说, 查询中只涉及单个键, 或者涉及的多个键都属于同一个哈希槽), 它就会查找哪个节点负责该键(或多个键)所属的哈希槽。

如果该哈希槽由当前节点提供服务, 查询就简单地被处理; 否则节点会检查自己内部的哈希槽到节点的映射表, 并向客户端回复一个 MOVED 错误, 形如 `GET x` 得到 `-MOVED 3999 127.0.0.1:6381`(见上文代码块)。

该错误中包含了键所在的哈希槽(3999)以及能够处理该查询的实例的 ip:port。客户端需要把查询重新发送到指定节点的 IP 地址和端口。请注意, 即使客户端在重新发送查询之前等待了很长时间, 期间集群配置发生了变化, 只要哈希槽 3999 现在由另一个节点提供服务, 目标节点仍然会再次回复一个 MOVED 错误。如果被联系的节点没有最新信息, 情况也是如此。

因此, 虽然从集群节点的角度看, 节点是用 ID 来标识的, 但我们尽量简化对客户端的接口, 只暴露哈希槽与用 IP:port 标识的 Redis 节点之间的映射。

客户端并非必须, 但应该尽量记住哈希槽 3999 由 127.0.0.1:6381 提供服务。这样当需要发送新命令时, 它就能算出目标键的哈希槽, 从而更有机会选对节点。

另一种做法是: 每当收到 MOVED 重定向时, 就使用 [CLUSTER NODES](https://redis.io/commands/cluster-nodes) 或 [CLUSTER SLOTS](https://redis.io/commands/cluster-slots) 命令刷新整个客户端的集群布局。当遇到重定向时, 往往是被重新配置的槽不止一个, 因此尽快更新客户端配置通常是最好的策略。

请注意, 当集群稳定时(配置没有正在进行的变更), 最终所有客户端都会获得一份哈希槽 -> 节点的映射, 从而使集群高效运转: 客户端直接寻址正确的节点, 无需重定向、代理或其他单点故障组件。

客户端**还必须能够处理 -ASK 重定向**, 也就是本文档后面描述的那种, 否则它就不是一个完整的 Redis Cluster 客户端。



## Cluster live reconfiguration

Redis Cluster supports the ability to add and remove nodes while the cluster is running. Adding or removing a node is abstracted into the same operation: moving a hash slot from one node to another. This means that the same basic mechanism can be used in order to rebalance the cluster, add or remove nodes, and so forth.

- To add a new node to the cluster an empty node is added to the cluster and some set of hash slots are moved from existing nodes to the new node.
- To remove a node from the cluster the hash slots assigned to that node are moved to other existing nodes.
- To rebalance the cluster a given set of hash slots are moved between nodes.

The core of the implementation is the ability to move hash slots around. From a practical point of view a hash slot is just a set of keys, so what Redis Cluster really does during *resharding* is to move keys from an instance to another instance. Moving a hash slot means moving all the keys that happen to hash into this hash slot.

To understand how this works we need to show the [CLUSTER](https://redis.io/commands/cluster) subcommands that are used to manipulate the slots translation table in a Redis Cluster node.

The following subcommands are available (among others not useful in this case):

- [CLUSTER ADDSLOTS](https://redis.io/commands/cluster-addslots) slot1 [slot2] ... [slotN]
- [CLUSTER DELSLOTS](https://redis.io/commands/cluster-delslots) slot1 [slot2] ... [slotN]
- [CLUSTER ADDSLOTSRANGE](https://redis.io/commands/cluster-addslotsrange) start-slot1 end-slot1 [start-slot2 end-slot2] ... [start-slotN end-slotN]
- [CLUSTER DELSLOTSRANGE](https://redis.io/commands/cluster-delslotsrange) start-slot1 end-slot1 [start-slot2 end-slot2] ... [start-slotN end-slotN]
- [CLUSTER SETSLOT](https://redis.io/commands/cluster-setslot) slot NODE node
- [CLUSTER SETSLOT](https://redis.io/commands/cluster-setslot) slot MIGRATING node
- [CLUSTER SETSLOT](https://redis.io/commands/cluster-setslot) slot IMPORTING node

The first four commands, `ADDSLOTS`, `DELSLOTS`, `ADDSLOTSRANGE` and `DELSLOTSRANGE`, are simply used to assign (or remove) slots to a Redis node. Assigning a slot means to tell a given master node that it will be in charge of storing and serving content for the specified hash slot.

After the hash slots are assigned they will propagate across the cluster using the gossip protocol, as specified later in the *configuration propagation* section.

The `ADDSLOTS` and `ADDSLOTSRANGE` commands are usually used when a new cluster is created from scratch to assign each master node a subset of all the 16384 hash slots available.

The `DELSLOTS` and `DELSLOTSRANGE` are mainly used for manual modification of a cluster configuration or for debugging tasks: in practice it is rarely used.

The `SETSLOT` subcommand is used to assign a slot to a specific node ID if the `SETSLOT <slot> NODE` form is used. Otherwise the slot can be set in the two special states `MIGRATING` and `IMPORTING`. Those two special states are used in order to migrate a hash slot from one node to another.

- When a slot is set as MIGRATING, the node will accept all queries that are about this hash slot, but only if the key in question exists, otherwise the query is forwarded using a `-ASK` redirection to the node that is target of the migration.
- When a slot is set as IMPORTING, the node will accept all queries that are about this hash slot, but only if the request is preceded by an [ASKING](https://redis.io/commands/asking) command. If the [ASKING](https://redis.io/commands/asking) command was not given by the client, the query is redirected to the real hash slot owner via a `-MOVED` redirection error, as would happen normally.

Let's make this clearer with an example of hash slot migration. Assume that we have two Redis master nodes, called A and B. We want to move hash slot 8 from A to B, so we issue commands like this:

- We send B: CLUSTER SETSLOT 8 IMPORTING A
- We send A: CLUSTER SETSLOT 8 MIGRATING B

All the other nodes will continue to point clients to node "A" every time they are queried with a key that belongs to hash slot 8, so what happens is that:

- All queries about existing keys are processed by "A".
- All queries about non-existing keys in A are processed by "B", because "A" will redirect clients to "B".

This way we no longer create new keys in "A". In the meantime, `redis-cli` used during reshardings and Redis Cluster configuration will migrate existing keys in hash slot 8 from A to B. This is performed using the following command:

```
CLUSTER GETKEYSINSLOT slot count
```

The above command will return `count` keys in the specified hash slot. For keys returned, `redis-cli` sends node "A" a [MIGRATE](https://redis.io/commands/migrate) command, that will migrate the specified keys from A to B in an atomic way (both instances are locked for the time (usually very small time) needed to migrate keys so there are no race conditions). This is how [MIGRATE](https://redis.io/commands/migrate) works:

```
MIGRATE target_host target_port "" target_database id timeout KEYS key1 key2 ...
```

[MIGRATE](https://redis.io/commands/migrate) will connect to the target instance, send a serialized version of the key, and once an OK code is received, the old key from its own dataset will be deleted. From the point of view of an external client a key exists either in A or B at any given time.

In Redis Cluster there is no need to specify a database other than 0, but [MIGRATE](https://redis.io/commands/migrate) is a general command that can be used for other tasks not involving Redis Cluster. [MIGRATE](https://redis.io/commands/migrate) is optimized to be as fast as possible even when moving complex keys such as long lists, but in Redis Cluster reconfiguring the cluster where big keys are present is not considered a wise procedure if there are latency constraints in the application using the database.

When the migration process is finally finished, the `SETSLOT <slot> NODE <node-id>` command is sent to the two nodes involved in the migration in order to set the slots to their normal state again. The same command is usually sent to all other nodes to avoid waiting for the natural propagation of the new configuration across the cluster.



## 集群在线重配置

Redis Cluster 支持在集群运行期间添加和删除节点。添加或删除节点被抽象为同一个操作: 把一个哈希槽从一个节点迁移到另一个节点。这意味着, 可以用同一套基础机制来对集群重新平衡、添加或删除节点, 等等。

- 要向集群添加一个新节点, 就先把一个空节点加入集群, 然后把一部分哈希槽从现有节点迁移到新节点。
- 要从集群中删除一个节点, 就把分配给该节点的哈希槽迁移到其他现有节点。
- 要对集群重新平衡, 就把一组给定的哈希槽在节点之间迁移。

该实现的核心在于能够迁移哈希槽。从实际角度看, 一个哈希槽就是一键(key)的集合, 所以 Redis Cluster 在*重新分片(resharding)*时真正做的事情, 就是把键从一个实例迁移到另一个实例。迁移一个哈希槽意味着迁移所有恰好哈希到该槽的键。

要理解它的工作原理, 我们需要先介绍用于操作 Redis Cluster 节点中槽映射表的 [CLUSTER](https://redis.io/commands/cluster) 子命令。

可用的子命令如下(此外还有一些在此场景中无用的子命令, 未列出):

- [CLUSTER ADDSLOTS](https://redis.io/commands/cluster-addslots) slot1 [slot2] ... [slotN]
- [CLUSTER DELSLOTS](https://redis.io/commands/cluster-delslots) slot1 [slot2] ... [slotN]
- [CLUSTER ADDSLOTSRANGE](https://redis.io/commands/cluster-addslotsrange) start-slot1 end-slot1 [start-slot2 end-slot2] ... [start-slotN end-slotN]
- [CLUSTER DELSLOTSRANGE](https://redis.io/commands/cluster-delslotsrange) start-slot1 end-slot1 [start-slot2 end-slot2] ... [start-slotN end-slotN]
- [CLUSTER SETSLOT](https://redis.io/commands/cluster-setslot) slot NODE node
- [CLUSTER SETSLOT](https://redis.io/commands/cluster-setslot) slot MIGRATING node
- [CLUSTER SETSLOT](https://redis.io/commands/cluster-setslot) slot IMPORTING node

前四个命令 `ADDSLOTS`、`DELSLOTS`、`ADDSLOTSRANGE` 和 `DELSLOTSRANGE`, 只是用来给某个 Redis 节点分配(或移除)槽。分配一个槽, 就是告诉某个主节点, 它将负责存储并提供指定哈希槽的内容。

哈希槽被分配之后, 会通过 gossip 协议在整个集群中传播, 具体如后文*配置传播*一节所述。

`ADDSLOTS` 和 `ADDSLOTSRANGE` 命令通常用于从头创建一个新集群时, 为每个主节点分配全部 16384 个可用哈希槽中的一部分。

`DELSLOTS` 和 `DELSLOTSRANGE` 主要用于手动修改集群配置或执行调试任务: 实践中很少使用。

`SETSLOT` 子命令在使用 `SETSLOT <slot> NODE` 形式时, 用于把一个槽分配给特定的节点 ID。否则, 可以把槽设为 `MIGRATING` 和 `IMPORTING` 这两种特殊状态。这两种特殊状态用于把一个哈希槽从一个节点迁移到另一个节点。

- 当一个槽被设为 MIGRATING 时, 该节点会接受所有涉及这个哈希槽的查询, 但前提是所查询的键存在; 否则该查询会通过 `-ASK` 重定向转发给迁移的目标节点。
- 当一个槽被设为 IMPORTING 时, 该节点会接受所有涉及这个哈希槽的查询, 但前提是请求之前先发送过 [ASKING](https://redis.io/commands/asking) 命令。如果客户端没有发送 [ASKING](https://redis.io/commands/asking) 命令, 查询就会像通常那样, 通过 `-MOVED` 重定向错误被转发给该哈希槽真正的所有者。

下面用一个哈希槽迁移的例子把这一点说得更清楚。假设我们有两个 Redis 主节点, 分别叫 A 和 B。我们想把哈希槽 8 从 A 迁移到 B, 于是发出这样的命令:

- 我们向 B 发送: CLUSTER SETSLOT 8 IMPORTING A
- 我们向 A 发送: CLUSTER SETSLOT 8 MIGRATING B



## ASK redirection

In the previous section we briefly talked about ASK redirection. Why can't we simply use MOVED redirection? Because while MOVED means that we think the hash slot is permanently served by a different node and the next queries should be tried against the specified node, ASK means to send only the next query to the specified node.

This is needed because the next query about hash slot 8 can be about a key that is still in A, so we always want the client to try A and then B if needed. Since this happens only for one hash slot out of 16384 available, the performance hit on the cluster is acceptable.

We need to force that client behavior, so to make sure that clients will only try node B after A was tried, node B will only accept queries of a slot that is set as IMPORTING if the client sends the ASKING command before sending the query.

Basically the ASKING command sets a one-time flag on the client that forces a node to serve a query about an IMPORTING slot.

The full semantics of ASK redirection from the point of view of the client is as follows:

- If ASK redirection is received, send only the query that was redirected to the specified node but continue sending subsequent queries to the old node.
- Start the redirected query with the ASKING command.
- Don't yet update local client tables to map hash slot 8 to B.

Once hash slot 8 migration is completed, A will send a MOVED message and the client may permanently map hash slot 8 to the new IP and port pair. Note that if a buggy client performs the map earlier this is not a problem since it will not send the ASKING command before issuing the query, so B will redirect the client to A using a MOVED redirection error.

Slots migration is explained in similar terms but with different wording (for the sake of redundancy in the documentation) in the [CLUSTER SETSLOT](https://redis.io/commands/cluster-setslot) command documentation.



## ASK 重定向

上一节我们简单提到了 ASK 重定向。为什么不能直接用 MOVED 重定向呢？因为 MOVED 意味着我们认为该哈希槽已永久由另一个节点提供服务, 后续查询应该都去问指定的那个节点; 而 ASK 只是把下一次查询发送到指定的节点。

这样做是必要的, 因为针对哈希槽 8 的下一次查询可能涉及一个仍然位于 A 中的键, 所以我们总是希望客户端先尝试 A, 必要时再尝试 B。由于这种情况仅发生在 16384 个可用哈希槽中的某一个槽上, 对集群性能的影响是可以接受的。

我们需要强制客户端保持这种行为, 为了确保客户端只有在尝试过 A 之后才会去尝试节点 B, 如果槽被设为 IMPORTING, 那么节点 B 只有在客户端发送查询之前先发送 ASKING 命令时, 才会接受针对该槽的查询。

基本上, ASKING 命令会在客户端上设置一个一次性标志(one-time flag), 强制节点去处理一个针对 IMPORTING 槽的查询。

从客户端角度看, ASK 重定向的完整语义如下:

- 如果收到 ASK 重定向, 只把被重定向的那次查询发送到指定的节点, 但后续查询仍继续发送给原来的节点。
- 把 ASKING 命令作为这次被重定向查询的开头。
- 暂时不要更新本地客户端的映射表, 不把哈希槽 8 映射到 B。

一旦哈希槽 8 的迁移完成, A 会发送一条 MOVED 消息, 此时客户端可以永久地把哈希槽 8 映射到新的 IP 和端口对。请注意, 如果某个有缺陷的客户端提前做了这个映射, 也不会有问题, 因为它在发出查询之前不会发送 ASKING 命令, 所以 B 会通过 MOVED 重定向错误把客户端再次重定向回 A。

关于槽迁移, [CLUSTER SETSLOT](https://redis.io/commands/cluster-setslot) 命令文档中也用类似的表述(但措辞不同, 出于文档冗余的考虑)做了说明。



## Clients first connection and handling of redirections

While it is possible to have a Redis Cluster client implementation that does not remember the slots configuration (the map between slot numbers and addresses of nodes serving it) in memory and only works by contacting random nodes waiting to be redirected, such a client would be very inefficient.

Redis Cluster clients should try to be smart enough to memorize the slots configuration. However this configuration is not *required* to be up to date. Since contacting the wrong node will simply result in a redirection, that should trigger an update of the client view.

Clients usually need to fetch a complete list of slots and mapped node addresses in two different situations:

- At startup in order to populate the initial slots configuration.
- When a `MOVED` redirection is received.

Note that a client may handle the `MOVED` redirection by updating just the moved slot in its table, however this is usually not efficient since often the configuration of multiple slots is modified at once (for example if a replica is promoted to master, all the slots served by the old master will be remapped). It is much simpler to react to a `MOVED` redirection by fetching the full map of slots to nodes from scratch.

In order to retrieve the slots configuration Redis Cluster offers an alternative to the [CLUSTER NODES](https://redis.io/commands/cluster-nodes) command that does not require parsing, and only provides the information strictly needed to clients.

The new command is called [CLUSTER SLOTS](https://redis.io/commands/cluster-slots) and provides an array of slots ranges, and the associated master and replica nodes serving the specified range.

The following is an example of output of [CLUSTER SLOTS](https://redis.io/commands/cluster-slots):

```
127.0.0.1:7000> cluster slots
1) 1) (integer) 5461
   2) (integer) 10922
   3) 1) "127.0.0.1"
      2) (integer) 7001
   4) 1) "127.0.0.1"
      2) (integer) 7004
2) 1) (integer) 0
   2) (integer) 5460
   3) 1) "127.0.0.1"
      2) (integer) 7000
   4) 1) "127.0.0.1"
      2) (integer) 7003
3) 1) (integer) 10923
   2) (integer) 16383
   3) 1) "127.0.0.1"
      2) (integer) 7002
   4) 1) "127.0.0.1"
      2) (integer) 7005
```

The first two sub-elements of every element of the returned array are the start-end slots of the range. The additional elements represent address-port pairs. The first address-port pair is the master serving the slot, and the additional address-port pairs are all the replicas serving the same slot that are not in an error condition (i.e. the FAIL flag is not set).

For example the first element of the output says that slots from 5461 to 10922 (start and end included) are served by 127.0.0.1:7001, and it is possible to scale read-only load contacting the replica at 127.0.0.1:7004.

[CLUSTER SLOTS](https://redis.io/commands/cluster-slots) is not guaranteed to return ranges that cover the full 16384 slots if the cluster is misconfigured, so clients should initialize the slots configuration map filling the target nodes with NULL objects, and report an error if the user tries to execute commands about keys that belong to unassigned slots.

Before returning an error to the caller when a slot is found to be unassigned, the client should try to fetch the slots configuration again to check if the cluster is now configured properly.



## 客户端的首次连接与重定向处理

虽然可以实现一种不把槽配置(槽编号与为其提供服务的节点地址之间的映射)记在内存中、只靠联系随机节点并等待重定向来工作的 Redis Cluster 客户端, 但这样的客户端效率会非常低。

Redis Cluster 客户端应当足够聪明, 尽量记住槽配置。不过这份配置并不*要求*必须是最新的。因为联系到错误的节点只会导致一次重定向, 而这次重定向应当触发客户端视图的更新。

客户端通常需要在两种不同的情况下获取完整的槽列表以及对应的节点地址:

- 启动时, 用于填充初始的槽配置。
- 收到 `MOVED` 重定向时。

请注意, 客户端可以通过只更新表中被迁移的那个槽来处理 `MOVED` 重定向, 但这通常并不高效, 因为往往有多个槽的配置会同时被修改(例如某个副本被晋升为主节点时, 旧主节点服务的所有槽都会被重新映射)。更简单的做法是: 一收到 `MOVED` 重定向, 就从头重新获取完整的槽到节点映射表。

为了获取槽配置, Redis Cluster 在 [CLUSTER NODES](https://redis.io/commands/cluster-nodes) 命令之外提供了另一种选择: 它不需要解析, 并且只提供客户端严格需要的信息。

这个新命令叫做 [CLUSTER SLOTS](https://redis.io/commands/cluster-slots), 它提供一个槽区间的数组, 以及为指定区间提供服务的相关主节点和副本节点。

下面是 [CLUSTER SLOTS](https://redis.io/commands/cluster-slots) 的示例输出(见上文代码块)。

返回数组中每个元素的前两个子元素是该区间的起止槽(start-end slots)。其余元素表示地址-端口对(address-port pairs)。第一个地址-端口对是为该槽提供服务的主节点, 其余地址-端口对是同样服务该槽、且未处于错误状态(即没有设置 FAIL 标志)的所有副本。

例如, 输出中的第一个元素表示, 从 5461 到 10922 的槽(包含起止两端)由 127.0.0.1:7001 提供服务, 并且可以联系位于 127.0.0.1:7004 的副本, 来扩展只读负载。

如果集群配置有误, [CLUSTER SLOTS](https://redis.io/commands/cluster-slots) 并不保证返回的区间能覆盖全部 16384 个槽, 因此客户端应当用 NULL 对象填充目标节点来初始化槽配置映射表, 并在用户试图对属于未分配槽的键执行命令时报错。

当发现某个槽未被分配时, 在向调用方返回错误之前, 客户端应当尝试再次获取槽配置, 以确认集群现在是否已正确配置。



## Multiple keys operations

Using hash tags, clients are free to use multi-key operations. For example the following operation is valid:

```
MSET {user:1000}.name Angela {user:1000}.surname White
```

Multi-key operations may become unavailable when a resharding of the hash slot the keys belong to is in progress.

More specifically, even during a resharding the multi-key operations targeting keys that all exist and all still hash to the same slot (either the source or destination node) are still available.

Operations on keys that don't exist or are - during the resharding - split between the source and destination nodes, will generate a `-TRYAGAIN` error. The client can try the operation after some time, or report back the error.

As soon as migration of the specified hash slot has terminated, all multi-key operations are available again for that hash slot.



## 多键操作

借助哈希标签, 客户端可以自由地使用多键操作。例如下面这个操作是合法的: `MSET {user:1000}.name Angela {user:1000}.surname White`(见上文代码块)。

当键所属的哈希槽正在重新分片时, 多键操作可能会变得不可用。

更具体地说, 即使在重新分片期间, 针对那些全部存在、且仍然哈希到同一个槽(无论是源节点还是目标节点)的键的多键操作, 依然可用。

对那些不存在、或者在重新分片期间被拆分到源节点和目标节点的键所做的操作, 会产生一个 `-TRYAGAIN` 错误。客户端可以稍后重试该操作, 或者把错误报告回去。

一旦指定哈希槽的迁移结束, 该哈希槽上的所有多键操作就会重新可用。



## Scaling reads using replica nodes

Normally replica nodes will redirect clients to the authoritative master for the hash slot involved in a given command, however clients can use replicas in order to scale reads using the [READONLY](https://redis.io/commands/readonly) command.

[READONLY](https://redis.io/commands/readonly) tells a Redis Cluster replica node that the client is ok reading possibly stale data and is not interested in running write queries.

When the connection is in readonly mode, the cluster will send a redirection to the client only if the operation involves keys not served by the replica's master node. This may happen because:

1. The client sent a command about hash slots never served by the master of this replica.
2. The cluster was reconfigured (for example resharded) and the replica is no longer able to serve commands for a given hash slot.

When this happens the client should update its hash slot map as explained in the previous sections.

The readonly state of the connection can be cleared using the [READWRITE](https://redis.io/commands/readwrite) command.



## 使用副本节点扩展读操作

通常情况下, 副本节点会把客户端重定向到某个命令所涉及哈希槽的权威主节点; 不过客户端可以使用 [READONLY](https://redis.io/commands/readonly) 命令, 借助副本来扩展读操作。

[READONLY](https://redis.io/commands/readonly) 告诉 Redis Cluster 的副本节点: 客户端可以接受读取可能过期的数据, 并且不打算执行写查询。

当连接处于 readonly 模式时, 只有当操作涉及的键不由该副本的主节点提供服务时, 集群才会向客户端发送重定向。这可能是因为:

1. 客户端发送的命令涉及该副本的主节点从不提供服务的哈希槽。
2. 集群被重新配置过(例如重新分片), 该副本不再能为某个给定的哈希槽处理命令。

发生这种情况时, 客户端应如前几节所述更新自己的哈希槽映射表。

连接的 readonly 状态可以使用 [READWRITE](https://redis.io/commands/readwrite) 命令清除。



# Fault Tolerance



# 容错



## Heartbeat and gossip messages

Redis Cluster nodes continuously exchange ping and pong packets. Those two kind of packets have the same structure, and both carry important configuration information. The only actual difference is the message type field. We'll refer to the sum of ping and pong packets as *heartbeat packets*.

Usually nodes send ping packets that will trigger the receivers to reply with pong packets. However this is not necessarily true. It is possible for nodes to just send pong packets to send information to other nodes about their configuration, without triggering a reply. This is useful, for example, in order to broadcast a new configuration as soon as possible.

Usually a node will ping a few random nodes every second so that the total number of ping packets sent (and pong packets received) by each node is a constant amount regardless of the number of nodes in the cluster.

However every node makes sure to ping every other node that hasn't sent a ping or received a pong for longer than half the `NODE_TIMEOUT` time. Before `NODE_TIMEOUT` has elapsed, nodes also try to reconnect the TCP link with another node to make sure nodes are not believed to be unreachable only because there is a problem in the current TCP connection.

The number of messages globally exchanged can be sizable if `NODE_TIMEOUT` is set to a small figure and the number of nodes (N) is very large, since every node will try to ping every other node for which they don't have fresh information every half the `NODE_TIMEOUT` time.

For example in a 100 node cluster with a node timeout set to 60 seconds, every node will try to send 99 pings every 30 seconds, with a total amount of pings of 3.3 per second. Multiplied by 100 nodes, this is 330 pings per second in the total cluster.

There are ways to lower the number of messages, however there have been no reported issues with the bandwidth currently used by Redis Cluster failure detection, so for now the obvious and direct design is used. Note that even in the above example, the 330 packets per second exchanged are evenly divided among 100 different nodes, so the traffic each node receives is acceptable.



## 心跳与 gossip 消息

Redis Cluster 节点之间会持续交换 ping 包和 pong 包。这两类数据包结构相同, 都携带重要的配置信息, 唯一实际的区别是消息类型字段。我们把 ping 包和 pong 包统称为*心跳包(heartbeat packets)*。

通常节点发送 ping 包会触发接收方回复 pong 包。但这并不一定。节点也可以只发送 pong 包, 用来向其他节点发送自己配置的信息, 而不触发任何回复。例如, 在需要尽快广播一份新配置时, 这很有用。

通常节点每秒会 ping 少量随机节点, 这样无论集群中有多少个节点, 每个节点发出的 ping 包(以及收到的 pong 包)总数都是一个恒定值。

不过, 对于任何一个已经超过 `NODE_TIMEOUT` 时间的一半没有发送 ping 或收到 pong 的节点, 每个节点都会确保去 ping 它。在 `NODE_TIMEOUT` 尚未耗尽之前, 节点还会尝试重新建立与其他节点之间的 TCP 链路, 以确保节点不会仅仅因为当前 TCP 连接出了问题就被认为是不可达的。

如果把 `NODE_TIMEOUT` 设得很小、而节点数 N 又非常大, 那么全局交换的消息数量可能会相当可观, 因为每个节点都会尝试对每一个它没有新鲜信息的节点, 每隔 `NODE_TIMEOUT` 时间的一半发送一次 ping。

例如, 在一个有 100 个节点、节点超时设为 60 秒的集群中, 每个节点会尝试每 30 秒发送 99 个 ping, 即每秒 3.3 个 ping。乘以 100 个节点后, 整个集群每秒就是 330 个 ping。

有一些办法可以减少消息数量, 但目前没有收到过关于 Redis Cluster 故障检测所用带宽的反馈问题, 所以现阶段采用的是这种直观而直接的设计。请注意, 即使在上面的例子中, 每秒交换的 330 个数据包也是均匀分摊到 100 个不同节点上的, 因此每个节点收到的流量都是可以接受的。



## Heartbeat packet content

Ping and pong packets contain a header that is common to all types of packets (for instance packets to request a failover vote), and a special Gossip Section that is specific of Ping and Pong packets.

The common header has the following information:

- Node ID, a 160 bit pseudorandom string that is assigned the first time a node is created and remains the same for all the life of a Redis Cluster node.
- The `currentEpoch` and `configEpoch` fields of the sending node that are used to mount the distributed algorithms used by Redis Cluster (this is explained in detail in the next sections). If the node is a replica the `configEpoch` is the last known `configEpoch` of its master.
- The node flags, indicating if the node is a replica, a master, and other single-bit node information.
- A bitmap of the hash slots served by the sending node, or if the node is a replica, a bitmap of the slots served by its master.
- The sender TCP base port that is the port used by Redis to accept client commands.
- The cluster port that is the port used by Redis for node-to-node communication.
- The state of the cluster from the point of view of the sender (down or ok).
- The master node ID of the sending node, if it is a replica.

Ping and pong packets also contain a gossip section. This section offers to the receiver a view of what the sender node thinks about other nodes in the cluster. The gossip section only contains information about a few random nodes among the set of nodes known to the sender. The number of nodes mentioned in a gossip section is proportional to the cluster size.

For every node added in the gossip section the following fields are reported:

- Node ID.
- IP and port of the node.
- Node flags.

Gossip sections allow receiving nodes to get information about the state of other nodes from the point of view of the sender. This is useful both for failure detection and to discover other nodes in the cluster.



## 心跳包的内容

ping 包和 pong 包含有一个所有类型数据包共用的头部(例如请求故障转移投票的数据包也用这个头部), 以及一个 ping 包和 pong 包特有的 Gossip 段。

公共头部包含以下信息:

- Node ID, 一个 160 位伪随机字符串, 在节点首次创建时分配, 并在 Redis Cluster 节点的整个生命周期内保持不变。
- 发送节点的 `currentEpoch` 和 `configEpoch` 字段, 用于支撑 Redis Cluster 所使用的分布式算法(后面几节会详细解释)。如果该节点是副本, 那么 `configEpoch` 就是它所知的主节点的最新 `configEpoch`。
- 节点标志(node flags), 用于表示该节点是副本还是主节点, 以及其他单比特的节点信息。
- 发送节点所服务哈希槽的位图(bitmap); 如果该节点是副本, 则是其主节点所服务槽的位图。
- 发送方的 TCP 基础端口, 即 Redis 用于接受客户端命令的端口。
- cluster 端口, 即 Redis 用于节点之间通信的端口。
- 从发送方视角看到的集群状态(down 或 ok)。
- 如果发送节点是副本, 则包含其主节点的 Node ID。

ping 包和 pong 包还包含一个 gossip 段。这一部分向接收方提供发送方节点对其他集群节点的看法。gossip 段只包含发送方已知节点集合中的少数随机节点的信息。gossip 段中提到的节点数量与集群规模成正比。

对于加入 gossip 段的每个节点, 会报告以下字段:

- Node ID。
- 节点的 IP 和端口。
- 节点标志。

gossip 段使接收节点能够从发送方的视角获取其他节点的状态信息。这对于故障检测以及发现集群中的其他节点都很有用。



## Failure detection

Redis Cluster failure detection is used to recognize when a master or replica node is no longer reachable by the majority of nodes and then respond by promoting a replica to the role of master. When replica promotion is not possible the cluster is put in an error state to stop receiving queries from clients.

As already mentioned, every node takes a list of flags associated with other known nodes. There are two flags that are used for failure detection that are called `PFAIL` and `FAIL`. `PFAIL` means *Possible failure*, and is a non-acknowledged failure type. `FAIL` means that a node is failing and that this condition was confirmed by a majority of masters within a fixed amount of time.

**PFAIL flag:**

A node flags another node with the `PFAIL` flag when the node is not reachable for more than `NODE_TIMEOUT` time. Both master and replica nodes can flag another node as `PFAIL`, regardless of its type.

The concept of non-reachability for a Redis Cluster node is that we have an **active ping** (a ping that we sent for which we have yet to get a reply) pending for longer than `NODE_TIMEOUT`. For this mechanism to work the `NODE_TIMEOUT` must be large compared to the network round trip time. In order to add reliability during normal operations, nodes will try to reconnect with other nodes in the cluster as soon as half of the `NODE_TIMEOUT` has elapsed without a reply to a ping. This mechanism ensures that connections are kept alive so broken connections usually won't result in false failure reports between nodes.

**FAIL flag:**

The `PFAIL` flag alone is just local information every node has about other nodes, but it is not sufficient to trigger a replica promotion. For a node to be considered down the `PFAIL` condition needs to be escalated to a `FAIL` condition.

As outlined in the node heartbeats section of this document, every node sends gossip messages to every other node including the state of a few random known nodes. Every node eventually receives a set of node flags for every other node. This way every node has a mechanism to signal other nodes about failure conditions they have detected.

A `PFAIL` condition is escalated to a `FAIL` condition when the following set of conditions are met:

- Some node, that we'll call A, has another node B flagged as `PFAIL`.
- Node A collected, via gossip sections, information about the state of B from the point of view of the majority of masters in the cluster.
- The majority of masters signaled the `PFAIL` or `FAIL` condition within `NODE_TIMEOUT * FAIL_REPORT_VALIDITY_MULT` time. (The validity factor is set to 2 in the current implementation, so this is just two times the `NODE_TIMEOUT` time).

If all the above conditions are true, Node A will:

- Mark the node as `FAIL`.
- Send a `FAIL` message (as opposed to a `FAIL` condition within a heartbeat message) to all the reachable nodes.

The `FAIL` message will force every receiving node to mark the node in `FAIL` state, whether or not it already flagged the node in `PFAIL` state.

Note that *the FAIL flag is mostly one way*. That is, a node can go from `PFAIL` to `FAIL`, but a `FAIL` flag can only be cleared in the following situations:

- The node is already reachable and is a replica. In this case the `FAIL` flag can be cleared as replicas are not failed over.
- The node is already reachable and is a master not serving any slot. In this case the `FAIL` flag can be cleared as masters without slots do not really participate in the cluster and are waiting to be configured in order to join the cluster.
- The node is already reachable and is a master, but a long time (N times the `NODE_TIMEOUT`) has elapsed without any detectable replica promotion. It's better for it to rejoin the cluster and continue in this case.

It is useful to note that while the `PFAIL` -> `FAIL` transition uses a form of agreement, the agreement used is weak:

1. Nodes collect views of other nodes over some time period, so even if the majority of master nodes need to "agree", actually this is just state that we collected from different nodes at different times and we are not sure, nor we require, that at a given moment the majority of masters agreed. However we discard failure reports which are old, so the failure was signaled by the majority of masters within a window of time.
2. While every node detecting the `FAIL` condition will force that condition on other nodes in the cluster using the `FAIL` message, there is no way to ensure the message will reach all the nodes. For instance a node may detect the `FAIL` condition and because of a partition will not be able to reach any other node.

However the Redis Cluster failure detection has a liveness requirement: eventually all the nodes should agree about the state of a given node. There are two cases that can originate from split brain conditions. Either some minority of nodes believe the node is in `FAIL` state, or a minority of nodes believe the node is not in `FAIL` state. In both the cases eventually the cluster will have a single view of the state of a given node:

**Case 1**: If a majority of masters have flagged a node as `FAIL`, because of failure detection and the *chain effect* it generates, every other node will eventually flag the master as `FAIL`, since in the specified window of time enough failures will be reported.

**Case 2**: When only a minority of masters have flagged a node as `FAIL`, the replica promotion will not happen (as it uses a more formal algorithm that makes sure everybody knows about the promotion eventually) and every node will clear the `FAIL` state as per the `FAIL` state clearing rules above (i.e. no promotion after N times the `NODE_TIMEOUT` has elapsed).

**The `FAIL` flag is only used as a trigger to run the safe part of the algorithm** for the replica promotion. In theory a replica may act independently and start a replica promotion when its master is not reachable, and wait for the masters to refuse to provide the acknowledgment if the master is actually reachable by the majority. However the added complexity of the `PFAIL -> FAIL` state, the weak agreement, and the `FAIL` message forcing the propagation of the state in the shortest amount of time in the reachable part of the cluster, have practical advantages. Because of these mechanisms, usually all the nodes will stop accepting writes at about the same time if the cluster is in an error state. This is a desirable feature from the point of view of applications using Redis Cluster. Also erroneous election attempts initiated by replicas that can't reach its master due to local problems (the master is otherwise reachable by the majority of other master nodes) are avoided.



## 故障检测

Redis Cluster 的故障检测用于识别某个主节点或副本节点何时不再被大多数节点可达, 并据此做出响应: 把一个副本晋升为主节点。当无法进行副本晋升时, 集群会进入错误状态, 停止接收来自客户端的查询。

如前所述, 每个节点都会维护一组与其他已知节点相关联的标志(flags)。用于故障检测的标志有两个, 分别叫 `PFAIL` 和 `FAIL`。`PFAIL` 表示*可能故障(Possible failure)*, 是一种未经确认的故障类型。`FAIL` 表示某个节点正在故障, 且这一状态已在一段固定时间内得到大多数主节点的确认。

**PFAIL 标志:**

当一个节点超过 `NODE_TIMEOUT` 时间不可达时, 另一个节点会给它打上 `PFAIL` 标志。无论目标是主节点还是副本节点, 主节点和副本节点都可以给另一个节点打上 `PFAIL` 标志。

对于 Redis Cluster 节点来说, 不可达的概念是: 我们有一个**主动 ping**(我们发出但尚未收到回复的 ping)挂起的时间超过了 `NODE_TIMEOUT`。要让这一机制正常工作, `NODE_TIMEOUT` 必须远大于网络往返时间。为了在正常运行期间增加可靠性, 当 `NODE_TIMEOUT` 过去一半仍未收到 ping 的回复时, 节点就会尝试与集群中的其他节点重新连接。这一机制确保连接保持存活, 因此连接断开通常不会导致节点之间产生误报的故障。

**FAIL 标志:**

仅有 `PFAIL` 标志, 只是每个节点对其他节点的本地信息, 还不足以触发副本晋升。要让一个节点被认为已经宕机, `PFAIL` 状态需要被升级(escalate)为 `FAIL` 状态。

如本文档节点心跳一节所述, 每个节点都会向其他每个节点发送 gossip 消息, 其中包含少数几个随机已知节点的状态。最终每个节点都会收到关于其他每个节点的一组节点标志。这样每个节点都有办法把自己检测到的故障状况告知其他节点。

当满足以下这组条件时, `PFAIL` 状态就会升级为 `FAIL` 状态:

- 某个节点(我们称之为 A)给另一个节点 B 打上了 `PFAIL` 标志。
- 节点 A 通过 gossip 段收集到了集群中大多数主节点对 B 状态的看法。
- 大多数主节点在 `NODE_TIMEOUT * FAIL_REPORT_VALIDITY_MULT` 时间内都表示出 `PFAIL` 或 `FAIL` 状态。(当前实现中有效系数为 2, 因此这就是 `NODE_TIMEOUT` 时间的两倍。)

如果以上所有条件都成立, 节点 A 将:

- 把该节点标记为 `FAIL`。
- 向所有可达节点发送一条 `FAIL` 消息(与心跳消息中的 `FAIL` 状态不同, 这是一条独立的消息)。

`FAIL` 消息会强制每个接收节点把该节点标记为 `FAIL` 状态, 无论它之前是否已经给该节点打过 `PFAIL` 状态。

请注意, *FAIL 标志基本上是单向的*。也就是说, 节点可以从 `PFAIL` 变为 `FAIL`, 但 `FAIL` 标志只能在以下情况下被清除:

- 该节点已经可达, 并且是一个副本。这种情况下可以清除 `FAIL` 标志, 因为副本不会被故障转移。
- 该节点已经可达, 并且是一个不服务任何槽的主节点。这种情况下可以清除 `FAIL` 标志, 因为不含槽的主节点实际上并不参与集群, 它只是在等待被配置以便加入集群。
- 该节点已经可达, 并且是一个主节点, 但已经过去很长时间(N 倍的 `NODE_TIMEOUT`)仍没有检测到任何副本晋升。这种情况下, 让它重新加入集群并继续运行更好。

值得说明的是, 虽然 `PFAIL` -> `FAIL` 的状态转换使用了一种共识(agreement)形式, 但这种共识是弱共识:

1. 节点是在一段时间内收集其他节点的看法的, 因此即使需要“大多数主节点同意”, 实际上这只是我们在不同时间从不同节点收集到的状态, 我们既不确信、也不要求某一时刻大多数主节点确实同时达成了一致。不过我们会丢弃过期的故障报告, 所以故障可以说是在一个时间窗口内由大多数主节点报告出来的。
2. 虽然每个检测到 `FAIL` 状态的节点都会通过 `FAIL` 消息把这个状态强加给集群中的其他节点, 但没有任何办法保证这条消息能到达所有节点。例如, 某个节点可能检测到了 `FAIL` 状态, 却因为网络分区而无法联系到任何其他节点。

不过, Redis Cluster 的故障检测有一个活性(liveness)要求: 最终所有节点都应当对某个节点的状态达成一致。可能由脑裂(split brain)状况引发两种情形: 要么少数节点认为该节点处于 `FAIL` 状态, 要么少数节点认为该节点不处于 `FAIL` 状态。在这两种情形下, 集群最终都会对给定节点的状态形成统一的看法:

**情形 1**: 如果大多数主节点已经把某个节点标记为 `FAIL`, 由于故障检测及其引发的*连锁效应(chain effect)*, 其他所有节点最终也会把该主节点标记为 `FAIL`, 因为在所指定的时间窗口内会报告足够多的故障。

**情形 2**: 当只有少数主节点把某个节点标记为 `FAIL` 时, 副本晋升不会发生(因为它使用的是更正式的算法, 该算法确保最终每个人都会知道这次晋升), 并且每个节点都会按上面提到的 `FAIL` 状态清除规则清除 `FAIL` 状态(即在 N 倍 `NODE_TIMEOUT` 之后如果没有晋升, 就清除)。

**`FAIL` 标志只被用作触发执行副本晋升算法中安全部分的信号**。理论上, 副本可以独立行动, 在它的主节点不可达时自行发起副本晋升, 然后等主节点们拒绝给出确认(如果该主节点实际上对大多数节点可达)。不过, 引入 `PFAIL -> FAIL` 状态转换、弱共识, 以及用 `FAIL` 消息在集群可达部分中以最短时间强制传播该状态, 这些做法带来了一些实际好处。由于这些机制, 当集群处于错误状态时, 通常所有节点会在差不多同一时刻停止接受写入。从使用 Redis Cluster 的应用角度来看, 这是一个令人满意的特性。同时, 由那些因本地问题(主节点对大多数其他主节点其实可达)而无法联系到主节点的副本所发起的错误选举尝试, 也因此得以避免。



# Configuration handling, propagation, and failovers



# 配置的处理、传播与故障转移



## Cluster current epoch

Redis Cluster uses a concept similar to the Raft algorithm "term". In Redis Cluster the term is called epoch instead, and it is used in order to give incremental versioning to events. When multiple nodes provide conflicting information, it becomes possible for another node to understand which state is the most up to date.

The `currentEpoch` is a 64 bit unsigned number.

At node creation every Redis Cluster node, both replicas and master nodes, set the `currentEpoch` to 0.

Every time a packet is received from another node, if the epoch of the sender (part of the cluster bus messages header) is greater than the local node epoch, the `currentEpoch` is updated to the sender epoch.

Because of these semantics, eventually all the nodes will agree to the greatest `currentEpoch` in the cluster.

This information is used when the state of the cluster is changed and a node seeks agreement in order to perform some action.

Currently this happens only during replica promotion, as described in the next section. Basically the epoch is a logical clock for the cluster and dictates that given information wins over one with a smaller epoch.



## 集群当前纪元(current epoch)

Redis Cluster 使用了一个与 Raft 算法中 “term”(任期)相似的概念。在 Redis Cluster 中, 这个概念叫做 epoch(纪元), 用于给事件赋予递增的版本号。当多个节点提供相互冲突的信息时, 另一个节点就能借此判断哪个状态是最新的。

`currentEpoch` 是一个 64 位无符号数。

在节点创建时, 每个 Redis Cluster 节点(无论是副本还是主节点)都会把 `currentEpoch` 设为 0。

每当从另一个节点收到数据包时, 如果发送方的 epoch(是集群总线消息头部的一部分)大于本地节点的 epoch, 就把 `currentEpoch` 更新为发送方的 epoch。

由于这样的语义, 最终所有节点都会认同集群中最大的 `currentEpoch`。

当集群状态发生变化、节点为了执行某个动作而寻求共识时, 就会用到这个信息。

目前这只发生在副本晋升时, 如下一节所述。基本上, epoch 是集群的一个逻辑时钟, 它规定: 某条信息如果 epoch 更大, 就会胜过 epoch 更小的信息。



## Configuration epoch

Every master always advertises its `configEpoch` in ping and pong packets along with a bitmap advertising the set of slots it serves.

The `configEpoch` is set to zero in masters when a new node is created.

A new `configEpoch` is created during replica election. replicas trying to replace failing masters increment their epoch and try to get authorization from a majority of masters. When a replica is authorized, a new unique `configEpoch` is created and the replica turns into a master using the new `configEpoch`.

As explained in the next sections the `configEpoch` helps to resolve conflicts when different nodes claim divergent configurations (a condition that may happen because of network partitions and node failures).

replica nodes also advertise the `configEpoch` field in ping and pong packets, but in the case of replicas the field represents the `configEpoch` of its master as of the last time they exchanged packets. This allows other instances to detect when a replica has an old configuration that needs to be updated (master nodes will not grant votes to replicas with an old configuration).

Every time the `configEpoch` changes for some known node, it is permanently stored in the nodes.conf file by all the nodes that receive this information. The same also happens for the `currentEpoch` value. These two variables are guaranteed to be saved and `fsync-ed` to disk when updated before a node continues its operations.

The `configEpoch` values generated using a simple algorithm during failovers are guaranteed to be new, incremental, and unique.



## 配置纪元(configEpoch)

每个主节点总是会在 ping 包和 pong 包中通告自己的 `configEpoch`, 同时附上表示它所服务槽集合的位图。

新建节点时, 主节点中的 `configEpoch` 被置为 0。

新的 `configEpoch` 是在副本选举过程中产生的。试图替换故障主节点的副本会递增自己的 epoch, 并尝试获得大多数主节点的授权。当某个副本获得授权后, 会生成一个新的、唯一的 `configEpoch`, 该副本便以这个新的 `configEpoch` 转变为主节点。

如下几节所述, 当不同节点声称的配置出现分歧时(这种情况可能由网络分区和节点故障引起), `configEpoch` 有助于解决冲突。

副本节点也会在 ping 包和 pong 包中通告 `configEpoch` 字段, 但就副本而言, 该字段表示的是它上一次与其主节点交换数据包时主节点的 `configEpoch`。这使得其他实例能够检测到某个副本持有旧的、需要更新的配置(主节点不会给持有旧配置的副本投票)。

每当某个已知节点的 `configEpoch` 发生变化, 所有收到该信息的节点都会把它永久保存到 nodes.conf 文件中。`currentEpoch` 的值也是如此。可以保证这两个变量在更新后、节点继续执行操作之前, 已被保存并 `fsync` 到磁盘。

在故障转移期间使用一个简单算法生成的 `configEpoch` 值, 可以保证是新的、递增的、且唯一的。



## Replica election and promotion

Replica election and promotion is handled by replica nodes, with the help of master nodes that vote for the replica to promote. A replica election happens when a master is in `FAIL` state from the point of view of at least one of its replicas that has the prerequisites in order to become a master.

In order for a replica to promote itself to master, it needs to start an election and win it. All the replicas for a given master can start an election if the master is in `FAIL` state, however only one replica will win the election and promote itself to master.

A replica starts an election when the following conditions are met:

- The replica's master is in `FAIL` state.
- The master was serving a non-zero number of slots.
- The replica replication link was disconnected from the master for no longer than a given amount of time, in order to ensure the promoted replica's data is reasonably fresh. This time is user configurable.

In order to be elected, the first step for a replica is to increment its `currentEpoch` counter, and request votes from master instances.

Votes are requested by the replica by broadcasting a `FAILOVER_AUTH_REQUEST` packet to every master node of the cluster. Then it waits for a maximum time of two times the `NODE_TIMEOUT` for replies to arrive (but always for at least 2 seconds).

Once a master has voted for a given replica, replying positively with a `FAILOVER_AUTH_ACK`, it can no longer vote for another replica of the same master for a period of `NODE_TIMEOUT * 2`. In this period it will not be able to reply to other authorization requests for the same master. This is not needed to guarantee safety, but useful for preventing multiple replicas from getting elected (even if with a different `configEpoch`) at around the same time, which is usually not wanted.

A replica discards any `AUTH_ACK` replies with an epoch that is less than the `currentEpoch` at the time the vote request was sent. This ensures it doesn't count votes intended for a previous election.

Once the replica receives ACKs from the majority of masters, it wins the election. Otherwise if the majority is not reached within the period of two times `NODE_TIMEOUT` (but always at least 2 seconds), the election is aborted and a new one will be tried again after `NODE_TIMEOUT * 4` (and always at least 4 seconds).



## 副本选举与晋升

副本选举与晋升由副本节点负责处理, 需要一些主节点为要晋升的副本投票。当至少有一个具备成为主节点前提条件的副本认为其主节点处于 `FAIL` 状态时, 就会发生副本选举。

副本要把自己晋升为主节点, 就需要发起一次选举并赢得它。当主节点处于 `FAIL` 状态时, 该主节点的所有副本都可以发起选举, 但只有一个副本会赢得选举并把自己晋升为主节点。

当满足以下条件时, 副本会发起选举:

- 该副本的主节点处于 `FAIL` 状态。
- 该主节点此前服务着非零数量的槽。
- 该副本与主节点之间的复制链路断开的时间不超过某个给定的时长, 以确保被晋升副本的数据足够新。这个时长可由用户配置。

为了当选, 副本的第一步是递增自己的 `currentEpoch` 计数器, 并向各个主节点实例请求投票。

副本通过向集群中的每个主节点广播一个 `FAILOVER_AUTH_REQUEST` 包来请求投票。然后它最多等待两倍 `NODE_TIMEOUT` 的时间(但至少等待 2 秒)让回复到达。

一旦某个主节点为某个副本投了票(用 `FAILOVER_AUTH_ACK` 肯定回复), 那么在 `NODE_TIMEOUT * 2` 这段时间内, 它就不能再为同一主节点的另一个副本投票。在此期间, 它无法回复针对同一主节点的其他授权请求。这并不是保证安全性所必需的, 但有助于防止多个副本在差不多同一时间当选(即便使用不同的 `configEpoch`), 而这通常是不希望发生的。

副本会丢弃任何 epoch 小于投票请求发出时的 `currentEpoch` 的 `AUTH_ACK` 回复。这确保它不会把本应属于上一次选举的票计入本次选举。

一旦副本收到大多数主节点的 ACK, 它就赢得了选举。否则, 如果在两倍 `NODE_TIMEOUT` 的时间(但至少 2 秒)内没有达到大多数, 选举就会中止, 并将在 `NODE_TIMEOUT * 4`(且至少 4 秒)之后重新尝试一次新的选举。



## Replica rank

As soon as a master is in `FAIL` state, a replica waits a short period of time before trying to get elected. That delay is computed as follows:

```
DELAY = 500 milliseconds + random delay between 0 and 500 milliseconds +
        REPLICA_RANK * 1000 milliseconds.
```

The fixed delay ensures that we wait for the `FAIL` state to propagate across the cluster, otherwise the replica may try to get elected while the masters are still unaware of the `FAIL` state, refusing to grant their vote.

The random delay is used to desynchronize replicas so they're unlikely to start an election at the same time.

The `REPLICA_RANK` is the rank of this replica regarding the amount of replication data it has processed from the master. Replicas exchange messages when the master is failing in order to establish a (best effort) rank: the replica with the most updated replication offset is at rank 0, the second most updated at rank 1, and so forth. In this way the most updated replicas try to get elected before others.

Rank order is not strictly enforced; if a replica of higher rank fails to be elected, the others will try shortly.

Once a replica wins the election, it obtains a new unique and incremental `configEpoch` which is higher than that of any other existing master. It starts advertising itself as master in ping and pong packets, providing the set of served slots with a `configEpoch` that will win over the past ones.

In order to speedup the reconfiguration of other nodes, a pong packet is broadcast to all the nodes of the cluster. Currently unreachable nodes will eventually be reconfigured when they receive a ping or pong packet from another node or will receive an `UPDATE` packet from another node if the information it publishes via heartbeat packets are detected to be out of date.

The other nodes will detect that there is a new master serving the same slots served by the old master but with a greater `configEpoch`, and will upgrade their configuration. Replicas of the old master (or the failed over master if it rejoins the cluster) will not just upgrade the configuration but will also reconfigure to replicate from the new master. How nodes rejoining the cluster are configured is explained in the next sections.



## 副本排名

一旦主节点处于 `FAIL` 状态, 副本会先等待一小段时间, 然后再尝试当选。这段延迟的计算方式如下(公式见上文代码块): `DELAY = 500 毫秒 + 0 到 500 毫秒之间的随机延迟 + REPLICA_RANK * 1000 毫秒`。

固定的延迟部分确保我们会等待 `FAIL` 状态在集群中传播开来, 否则副本可能在主节点们还不知晓 `FAIL` 状态时就试图当选, 从而被拒绝投票。

随机延迟部分用于让各个副本错开, 使它们不太可能同时发起选举。

`REPLICA_RANK` 是该副本在处理主节点复制数据量方面的排名。当主节点发生故障时, 副本之间会交换消息, 以(尽最大努力)确定排名: 已处理复制偏移量(replication offset)最新的副本排第 0 位, 第二新的排第 1 位, 依此类推。这样, 最新的副本就会比其他副本更早尝试当选。

排名顺序并非被严格执行; 如果排名较高的副本未能当选, 其他副本稍后就会尝试。

一旦某个副本赢得选举, 它就会获得一个新的、唯一且递增的 `configEpoch`, 该值高于任何其他现存主节点的值。它开始在 ping 包和 pong 包中把自己通告为主节点, 并以其 `configEpoch` 提供所服务的槽集合, 这个 epoch 会胜过过去的那些。

为了加速其他节点的重新配置, 会向集群所有节点广播一个 pong 包。目前不可达的节点最终也会被重新配置: 当它们从另一个节点收到 ping 或 pong 包时, 或者当它们通过心跳包发布的信息被检测为过期、从而收到另一个节点发来的 `UPDATE` 包时。

其他节点会检测到出现了一个新的主节点, 它服务着旧主节点所服务的相同槽, 但 `configEpoch` 更大, 于是它们会升级自己的配置。旧主节点的副本(或者故障转移后的主节点, 如果它重新加入集群的话)不仅会升级配置, 还会重新配置为从新的主节点复制。重新加入集群的节点如何被配置, 将在接下来的几节中说明。



## Masters reply to replica vote request

In the previous section it was discussed how replicas try to get elected. This section explains what happens from the point of view of a master that is requested to vote for a given replica.

Masters receive requests for votes in form of `FAILOVER_AUTH_REQUEST` requests from replicas.

For a vote to be granted the following conditions need to be met:

1. A master only votes a single time for a given epoch, and refuses to vote for older epochs: every master has a lastVoteEpoch field and will refuse to vote again as long as the `currentEpoch` in the auth request packet is not greater than the lastVoteEpoch. When a master replies positively to a vote request, the lastVoteEpoch is updated accordingly, and safely stored on disk.
2. A master votes for a replica only if the replica's master is flagged as `FAIL`.
3. Auth requests with a `currentEpoch` that is less than the master `currentEpoch` are ignored. Because of this the master reply will always have the same `currentEpoch` as the auth request. If the same replica asks again to be voted, incrementing the `currentEpoch`, it is guaranteed that an old delayed reply from the master can not be accepted for the new vote.

Example of the issue caused by not using rule number 3:

Master `currentEpoch` is 5, lastVoteEpoch is 1 (this may happen after a few failed elections)

- Replica `currentEpoch` is 3.
- Replica tries to be elected with epoch 4 (3+1), master replies with an ok with `currentEpoch` 5, however the reply is delayed.
- Replica will try to be elected again, at a later time, with epoch 5 (4+1), the delayed reply reaches the replica with `currentEpoch` 5, and is accepted as valid.

1. Masters don't vote for a replica of the same master before `NODE_TIMEOUT * 2` has elapsed if a replica of that master was already voted for. This is not strictly required as it is not possible for two replicas to win the election in the same epoch. However, in practical terms it ensures that when a replica is elected it has plenty of time to inform the other replicas and avoid the possibility that another replica will win a new election, performing an unnecessary second failover.
2. Masters make no effort to select the best replica in any way. If the replica's master is in `FAIL` state and the master did not vote in the current term, a positive vote is granted. The best replica is the most likely to start an election and win it before the other replicas, since it will usually be able to start the voting process earlier because of its *higher rank* as explained in the previous section.
3. When a master refuses to vote for a given replica there is no negative response, the request is simply ignored.
4. Masters don't vote for replicas sending a `configEpoch` that is less than any `configEpoch` in the master table for the slots claimed by the replica. Remember that the replica sends the `configEpoch` of its master, and the bitmap of the slots served by its master. This means that the replica requesting the vote must have a configuration for the slots it wants to failover that is newer or equal the one of the master granting the vote.



## 主节点对副本投票请求的答复

上一节讨论了副本如何尝试当选。本节说明从被请求为某个副本投票的主节点的角度来看, 会发生什么。

主节点会以 `FAILOVER_AUTH_REQUEST` 请求的形式收到来自副本的投票请求。

要授予一票, 需要满足以下条件:

1. 主节点对某个给定的 epoch 只会投票一次, 并拒绝为更旧的 epoch 投票: 每个主节点都有一个 lastVoteEpoch 字段, 只要授权请求包中的 `currentEpoch` 不大于 lastVoteEpoch, 它就会拒绝再次投票。当主节点对某个投票请求给出肯定回复时, lastVoteEpoch 会相应更新, 并安全地保存到磁盘。
2. 主节点只有在副本的主节点被标记为 `FAIL` 时, 才会给该副本投票。
3. `currentEpoch` 小于该主节点 `currentEpoch` 的授权请求会被忽略。因此, 主节点的回复总是与授权请求具有相同的 `currentEpoch`。如果同一个副本再次请求投票并递增了 `currentEpoch`, 就可以保证主节点一条延迟的旧回复不会被当作新投票而接受。

不使用规则 3 会引发问题的示例:

主节点的 `currentEpoch` 为 5, lastVoteEpoch 为 1(这可能发生在几次失败的选举之后)

- 副本的 `currentEpoch` 为 3。
- 副本尝试以 epoch 4(3+1)当选, 主节点回复了一个 `currentEpoch` 为 5 的 ok, 但这条回复被延迟了。
- 副本稍后会再次尝试以 epoch 5(4+1)当选, 此时这条延迟的、`currentEpoch` 为 5 的回复到达副本, 并被当作有效回复接受。

1. 如果某个主节点的某个副本已经被投过票, 那么在 `NODE_TIMEOUT * 2` 过去之前, 主节点不会为同一主节点的另一个副本投票。严格来说这并不是必需的, 因为两个副本不可能在同一个 epoch 中赢得选举。不过从实际效果看, 它可以确保当一个副本当选时, 它有充足的时间去通知其他副本, 从而避免另一个副本再赢得一次新选举、执行一次多余的二次故障转移。
2. 主节点不会以任何方式去挑选最佳副本。只要副本的主节点处于 `FAIL` 状态, 且该主节点在当前任期内没有投过票, 就会授予肯定的投票。最佳副本往往是最有可能先发起选举并赢得它的那个, 因为如前文所述, 由于它的*排名更高*, 通常能够更早地启动投票过程。
3. 当主节点拒绝为某个副本投票时, 不会有否定回复, 请求只是被忽略。
4. 对于声称的槽, 如果副本发送的 `configEpoch` 小于主节点表中该槽对应的任何 `configEpoch`, 主节点就不会给它投票。请记住, 副本发送的是其主节点的 `configEpoch` 以及其主节点所服务槽的位图。这意味着, 请求投票的副本对于它想要接管的槽, 其配置必须比授予投票的主节点的配置更新或相同。



## Practical example of configuration epoch usefulness during partitions

This section illustrates how the epoch concept is used to make the replica promotion process more resistant to partitions.

- A master is no longer reachable indefinitely. The master has three replicas A, B, C.
- Replica A wins the election and is promoted to master.
- A network partition makes A not available for the majority of the cluster.
- Replica B wins the election and is promoted as master.
- A partition makes B not available for the majority of the cluster.
- The previous partition is fixed, and A is available again.

At this point B is down and A is available again with a role of master (actually `UPDATE` messages would reconfigure it promptly, but here we assume all `UPDATE` messages were lost). At the same time, replica C will try to get elected in order to fail over B. This is what happens:

1. C will try to get elected and will succeed, since for the majority of masters its master is actually down. It will obtain a new incremental `configEpoch`.
2. A will not be able to claim to be the master for its hash slots, because the other nodes already have the same hash slots associated with a higher configuration epoch (the one of B) compared to the one published by A.
3. So, all the nodes will upgrade their table to assign the hash slots to C, and the cluster will continue its operations.

As you'll see in the next sections, a stale node rejoining a cluster will usually get notified as soon as possible about the configuration change because as soon as it pings any other node, the receiver will detect it has stale information and will send an `UPDATE` message.



## 分区期间 configEpoch 作用的实际示例

本节说明 epoch 概念是如何被用来让副本晋升过程更能抵御网络分区的。

- 某个主节点永久性地不再可达。该主节点有三个副本 A、B、C。
- 副本 A 赢得选举, 被晋升为主节点。
- 一次网络分区使得 A 对集群的大多数节点不可用。
- 副本 B 赢得选举, 被晋升为主节点。
- 又一次分区使得 B 对集群的大多数节点不可用。
- 之前的那次分区被修复了, A 又重新可用。

此时 B 已宕机, 而 A 又以主节点的角色重新可用(实际上 `UPDATE` 消息会很快重新配置它, 但这里我们假设所有 `UPDATE` 消息都丢失了)。与此同时, 副本 C 会尝试当选, 以便对 B 执行故障转移。发生的事情如下:

1. C 会尝试当选并成功, 因为对大多数主节点而言, 它的主节点确实已宕机。它会获得一个新的、递增的 `configEpoch`。
2. A 将无法声称自己是其哈希槽的主节点, 因为其他节点已经把相同的哈希槽关联到了一个比 A 所公布的更高的配置纪元(也就是 B 的那个)。
3. 于是, 所有节点都会升级自己的表, 把这些哈希槽分配给 C, 集群继续运行。

正如你将在后面几节看到的, 一个过期的节点重新加入集群时, 通常很快就会被告知配置变更, 因为它一旦 ping 任何其他节点, 接收方就会检测到它持有过期信息, 并发送一条 `UPDATE` 消息。



## Hash slots configuration propagation

An important part of Redis Cluster is the mechanism used to propagate the information about which cluster node is serving a given set of hash slots. This is vital to both the startup of a fresh cluster and the ability to upgrade the configuration after a replica was promoted to serve the slots of its failing master.

The same mechanism allows nodes partitioned away for an indefinite amount of time to rejoin the cluster in a sensible way.

There are two ways hash slot configurations are propagated:

1. Heartbeat messages. The sender of a ping or pong packet always adds information about the set of hash slots it (or its master, if it is a replica) serves.
2. `UPDATE` messages. Since in every heartbeat packet there is information about the sender `configEpoch` and set of hash slots served, if a receiver of a heartbeat packet finds the sender information is stale, it will send a packet with new information, forcing the stale node to update its info.

The receiver of a heartbeat or `UPDATE` message uses certain simple rules in order to update its table mapping hash slots to nodes. When a new Redis Cluster node is created, its local hash slot table is simply initialized to `NULL` entries so that each hash slot is not bound or linked to any node. This looks similar to the following:

```
0 -> NULL
1 -> NULL
2 -> NULL
...
16383 -> NULL
```

The first rule followed by a node in order to update its hash slot table is the following:

**Rule 1**: If a hash slot is unassigned (set to `NULL`), and a known node claims it, I'll modify my hash slot table and associate the claimed hash slots to it.

So if we receive a heartbeat from node A claiming to serve hash slots 1 and 2 with a configuration epoch value of 3, the table will be modified to:

```
0 -> NULL
1 -> A [3]
2 -> A [3]
...
16383 -> NULL
```

When a new cluster is created, a system administrator needs to manually assign (using the [CLUSTER ADDSLOTS](https://redis.io/commands/cluster-addslots) command, via the redis-cli command line tool, or by any other means) the slots served by each master node only to the node itself, and the information will rapidly propagate across the cluster.

However this rule is not enough. We know that hash slot mapping can change during two events:

1. A replica replaces its master during a failover.
2. A slot is resharded from a node to a different one.

For now let's focus on failovers. When a replica fails over its master, it obtains a configuration epoch which is guaranteed to be greater than the one of its master (and more generally greater than any other configuration epoch generated previously). For example node B, which is a replica of A, may failover A with configuration epoch of 4. It will start to send heartbeat packets (the first time mass-broadcasting cluster-wide) and because of the following second rule, receivers will update their hash slot tables:

**Rule 2**: If a hash slot is already assigned, and a known node is advertising it using a `configEpoch` that is greater than the `configEpoch` of the master currently associated with the slot, I'll rebind the hash slot to the new node.

So after receiving messages from B that claim to serve hash slots 1 and 2 with configuration epoch of 4, the receivers will update their table in the following way:

```
0 -> NULL
1 -> B [4]
2 -> B [4]
...
16383 -> NULL
```

Liveness property: because of the second rule, eventually all nodes in the cluster will agree that the owner of a slot is the one with the greatest `configEpoch` among the nodes advertising it.

This mechanism in Redis Cluster is called **last failover wins**.

The same happens during resharding. When a node importing a hash slot completes the import operation, its configuration epoch is incremented to make sure the change will be propagated throughout the cluster.



## 哈希槽配置的传播

Redis Cluster 的一个重要组成部分, 是用来传播“哪个集群节点正在服务给定的一组哈希槽”这一信息的机制。无论是启动一个全新的集群, 还是在某个副本被晋升、去接管其故障主节点的槽之后升级配置, 这一点都至关重要。

这一机制也让那些被分区隔离了任意时长的节点能够以一种合理的方式重新加入集群。

哈希槽配置有两种传播方式:

1. 心跳消息。ping 或 pong 包的发送方总是会附加它所服务的(如果是副本, 则是其主节点所服务的)哈希槽集合信息。
2. `UPDATE` 消息。由于每个心跳包中都含有发送方的 `configEpoch` 以及所服务的哈希槽集合信息, 如果心跳包的接收方发现发送方的信息已过期, 它就会发送一个带有新信息的数据包, 强制这个过期节点更新自己的信息。

心跳消息或 `UPDATE` 消息的接收方会使用若干简单规则来更新自己那张哈希槽到节点的映射表。当新的 Redis Cluster 节点被创建时, 它本地的哈希槽表只会被初始化为 `NULL` 条目, 因此每个哈希槽都不绑定、不关联到任何节点。看起来大致类似: `0 -> NULL`、`1 -> NULL`、`2 -> NULL` …… 一直到 `16383 -> NULL`(见上文代码块)。

节点更新自己哈希槽表所遵循的第一条规则如下:

**规则 1**: 如果某个哈希槽尚未分配(被设为 `NULL`), 而某个已知节点声称拥有它, 我就会修改自己的哈希槽表, 把所声称的哈希槽关联到该节点。

因此, 如果我们从节点 A 收到一个心跳, 其中声称以配置纪元 3 服务哈希槽 1 和 2, 那么表就会被修改为 `1 -> A [3]`、`2 -> A [3]`, 其余槽仍为 `NULL`(见上文代码块)。

当创建一个新集群时, 系统管理员需要手动地(使用 [CLUSTER ADDSLOTS](https://redis.io/commands/cluster-addslots) 命令, 通过 redis-cli 命令行工具, 或者用其他任何方式)把每个主节点所服务的槽只分配给该节点本身, 之后这些信息会迅速传播到整个集群。

不过, 仅靠这条规则还不够。我们知道, 在两种事件中, 哈希槽映射会发生变化:

1. 故障转移时, 副本接替了它的主节点。
2. 某个槽从某个节点被重新分片到另一个节点。

现在我们先聚焦于故障转移。当副本对其主节点执行故障转移时, 它会获得一个配置纪元, 该纪元保证大于其主节点的纪元(更一般地说, 大于此前生成的任何其他配置纪元)。例如, 作为 A 的副本的节点 B, 可能以配置纪元 4 对 A 执行故障转移。它会开始发送心跳包(并首次在集群范围内大规模广播), 而由于下面第二条规则, 接收方会更新自己的哈希槽表:

**规则 2**: 如果某个哈希槽已经分配, 而某个已知节点用一个比当前与该槽关联的主节点的 `configEpoch` 更大的 `configEpoch` 来声称拥有它, 我就会把这个哈希槽重新绑定到新节点上。

因此, 在收到 B 发来的、声称以配置纪元 4 服务哈希槽 1 和 2 的消息后, 接收方会按如下方式更新自己的表: 变成 `1 -> B [4]`、`2 -> B [4]`(见上文代码块)。

活性(liveness)性质: 由于第二条规则, 最终集群中的所有节点都会认同: 某个槽的所有者就是所有声称拥有它的节点中 `configEpoch` 最大的那个。

这一机制在 Redis Cluster 中被称为 **last failover wins**(最后一次故障转移者胜出)。

重新分片时也是同理。当一个节点完成对某个哈希槽的导入操作后, 它的配置纪元会被递增, 以确保这次变更传播到整个集群。



## UPDATE messages, a closer look

With the previous section in mind, it is easier to see how update messages work. Node A may rejoin the cluster after some time. It will send heartbeat packets where it claims it serves hash slots 1 and 2 with configuration epoch of 3. All the receivers with updated information will instead see that the same hash slots are associated with node B having a higher configuration epoch. Because of this they'll send an `UPDATE` message to A with the new configuration for the slots. A will update its configuration because of the **rule 2** above.



## 深入理解 UPDATE 消息

有了上一节的基础, 就更容易看清 UPDATE 消息是如何工作的了。节点 A 可能在一段时间后重新加入集群。它会发送心跳包, 声称自己以配置纪元 3 服务哈希槽 1 和 2。而所有持有更新信息的接收方则会看到, 相同的哈希槽关联到了拥有更高配置纪元的节点 B。因此, 它们会向 A 发送一条带有所述槽新配置的 `UPDATE` 消息。A 会由于上面的**规则 2** 而更新自己的配置。



## How nodes rejoin the cluster

The same basic mechanism is used when a node rejoins a cluster. Continuing with the example above, node A will be notified that hash slots 1 and 2 are now served by B. Assuming that these two were the only hash slots served by A, the count of hash slots served by A will drop to 0! So A will **reconfigure to be a replica of the new master**.

The actual rule followed is a bit more complex than this. In general it may happen that A rejoins after a lot of time, in the meantime it may happen that hash slots originally served by A are served by multiple nodes, for example hash slot 1 may be served by B, and hash slot 2 by C.

So the actual *Redis Cluster node role switch rule* is: **A master node will change its configuration to replicate (be a replica of) the node that stole its last hash slot**.

During reconfiguration, eventually the number of served hash slots will drop to zero, and the node will reconfigure accordingly. Note that in the base case this just means that the old master will be a replica of the replica that replaced it after a failover. However in the general form the rule covers all possible cases.

Replicas do exactly the same: they reconfigure to replicate the node that stole the last hash slot of its former master.



## 节点如何重新加入集群

当节点重新加入集群时, 使用的是同一套基本机制。继续上面的例子, 节点 A 会被告知哈希槽 1 和 2 现在由 B 服务。假设这两个槽原本就是 A 服务的全部槽, 那么 A 所服务的哈希槽数量就会降为 0！于是 A 会**重新配置, 成为新主节点的副本**。

实际遵循的规则比这要稍微复杂一些。一般来说, A 可能在很长时间之后才重新加入, 在此期间, 原本由 A 服务的哈希槽可能已经由多个节点服务, 例如哈希槽 1 由 B 服务, 哈希槽 2 由 C 服务。

所以真正的 *Redis Cluster 节点角色切换规则* 是: **主节点会修改自己的配置, 去复制(成为其副本)那个夺走它最后一个哈希槽的节点**。

在重新配置过程中, 所服务的哈希槽数量最终会降到零, 节点会据此重新配置。请注意, 在最基本的情况下, 这只是意味着旧主节点会成为在故障转移后取代它的那个副本的副本。不过在一般形式下, 这条规则覆盖了所有可能的情况。

副本的做法完全一样: 它们会重新配置, 去复制那个夺走其前任主节点最后一个哈希槽的节点。



## Replica migration

Redis Cluster implements a concept called *replica migration* in order to improve the availability of the system. The idea is that in a cluster with a master-replica setup, if the map between replicas and masters is fixed availability is limited over time if multiple independent failures of single nodes happen.

For example in a cluster where every master has a single replica, the cluster can continue operations as long as either the master or the replica fail, but not if both fail the same time. However there is a class of failures that are the independent failures of single nodes caused by hardware or software issues that can accumulate over time. For example:

- Master A has a single replica A1.
- Master A fails. A1 is promoted as new master.
- Three hours later A1 fails in an independent manner (unrelated to the failure of A). No other replica is available for promotion since node A is still down. The cluster cannot continue normal operations.

If the map between masters and replicas is fixed, the only way to make the cluster more resistant to the above scenario is to add replicas to every master, however this is costly as it requires more instances of Redis to be executed, more memory, and so forth.

An alternative is to create an asymmetry in the cluster, and let the cluster layout automatically change over time. For example the cluster may have three masters A, B, C. A and B have a single replica each, A1 and B1. However the master C is different and has two replicas: C1 and C2.

Replica migration is the process of automatic reconfiguration of a replica in order to *migrate* to a master that has no longer coverage (no working replicas). With replica migration the scenario mentioned above turns into the following:

- Master A fails. A1 is promoted.
- C2 migrates as replica of A1, that is otherwise not backed by any replica.
- Three hours later A1 fails as well.
- C2 is promoted as new master to replace A1.
- The cluster can continue the operations.



## 副本迁移

Redis Cluster 实现了一个名为 *replica migration*(副本迁移)的概念, 用于提升系统的可用性。其思想是: 在采用主从(master-replica)架构的集群中, 如果副本与主节点之间的映射是固定的, 那么当单个节点发生多次相互独立的故障时, 可用性会随时间推移而受限。

例如, 在一个每个主节点只有一个副本的集群中, 只要主节点或副本其中之一发生故障, 集群就还能继续运行; 但如果两者同时故障就不行了。然而有一类故障是单个节点因硬件或软件问题而发生的独立故障, 它们会随时间累积。例如:

- 主节点 A 只有一个副本 A1。
- 主节点 A 发生故障, A1 被晋升为新的主节点。
- 三小时后, A1 又以一次独立的方式发生故障(与 A 的故障无关)。由于节点 A 仍然处于宕机状态, 没有其他副本可用于晋升。集群无法继续正常运行。

如果主节点与副本之间的映射是固定的, 要让集群更能抵御上述场景, 唯一的办法就是给每个主节点都增加副本; 但这样做代价很高, 因为需要运行更多的 Redis 实例、占用更多内存, 等等。

另一种做法是在集群中制造一种不对称, 让集群的布局随时间自动变化。例如, 集群可能有三个主节点 A、B、C。A 和 B 各有一个副本, 即 A1 和 B1。而主节点 C 则不同, 它有两个副本: C1 和 C2。

副本迁移是指副本自动重新配置, 以*迁移*到一个不再有覆盖(没有可用副本)的主节点上的过程。有了副本迁移, 上述场景就变成下面这样:

- 主节点 A 发生故障, A1 被晋升。
- C2 迁移过去, 成为 A1 的副本, 而 A1 原本没有任何副本支撑。
- 三小时后, A1 也发生故障。
- C2 被晋升为新的主节点, 取代 A1。
- 集群可以继续运行。



## Replica migration algorithm

The migration algorithm does not use any form of agreement since the replica layout in a Redis Cluster is not part of the cluster configuration that needs to be consistent and/or versioned with config epochs. Instead it uses an algorithm to avoid mass-migration of replicas when a master is not backed. The algorithm guarantees that eventually (once the cluster configuration is stable) every master will be backed by at least one replica.

This is how the algorithm works. To start we need to define what is a *good replica* in this context: a good replica is a replica not in `FAIL` state from the point of view of a given node.

The execution of the algorithm is triggered in every replica that detects that there is at least a single master without good replicas. However among all the replicas detecting this condition, only a subset should act. This subset is actually often a single replica unless different replicas have in a given moment a slightly different view of the failure state of other nodes.

The *acting replica* is the replica among the masters with the maximum number of attached replicas, that is not in FAIL state and has the smallest node ID.

So for example if there are 10 masters with 1 replica each, and 2 masters with 5 replicas each, the replica that will try to migrate is - among the 2 masters having 5 replicas - the one with the lowest node ID. Given that no agreement is used, it is possible that when the cluster configuration is not stable, a race condition occurs where multiple replicas believe themselves to be the non-failing replica with the lower node ID (it is unlikely for this to happen in practice). If this happens, the result is multiple replicas migrating to the same master, which is harmless. If the race happens in a way that will leave the ceding master without replicas, as soon as the cluster is stable again the algorithm will be re-executed again and will migrate a replica back to the original master.

Eventually every master will be backed by at least one replica. However, the normal behavior is that a single replica migrates from a master with multiple replicas to an orphaned master.

The algorithm is controlled by a user-configurable parameter called `cluster-migration-barrier`: the number of good replicas a master must be left with before a replica can migrate away. For example, if this parameter is set to 2, a replica can try to migrate only if its master remains with two working replicas.



## 副本迁移算法

迁移算法不使用任何形式的共识, 因为 Redis Cluster 中的副本布局不属于那种需要与配置纪元保持一致和/或进行版本化的集群配置。它使用的是一种用来避免在某个主节点失去支撑时发生副本大规模迁移的算法。该算法保证, 最终(当集群配置稳定之后)每个主节点都至少有一个副本支撑。

算法的工作方式如下。首先我们需要定义在此语境下什么是*好副本(good replica)*: 好副本是指从某个给定节点的视角看未处于 `FAIL` 状态的副本。

算法的执行会在每一个检测到“至少有一个主节点没有好副本”的副本上被触发。不过在所有检测到这一情况的副本中, 只有一部分应当采取行动。这一部分通常实际上只是一个副本, 除非不同副本在某一时刻对其他节点的故障状态有着略微不同的看法。

*执行迁移的副本(acting replica)* 是指: 在拥有最多副本数量的那些主节点所对应的副本中, 未处于 FAIL 状态且节点 ID 最小的那个副本。

举例来说, 如果有 10 个主节点各带 1 个副本, 另外 2 个主节点各带 5 个副本, 那么会去尝试迁移的副本, 就是那两个带 5 个副本的主节点所对应的副本中节点 ID 最小的那个。由于没有使用共识, 当集群配置不稳定时, 可能出现竞态条件: 多个副本都认为自己是那个节点 ID 较小的、未发生故障的副本(实践中这种情况不太可能发生)。如果发生了, 结果就是多个副本迁移到同一个主节点, 这并无害处。如果这次竞态以某种方式导致让出副本的主节点失去了副本, 那么一旦集群重新稳定, 算法就会再次执行, 把一个副本迁回原来的主节点。

最终每个主节点都至少会有一个副本支撑。不过正常情况下的行为是: 单个副本从拥有多个副本的主节点迁移到一个被孤立的主节点。

该算法由一个用户可配置的参数 `cluster-migration-barrier` 控制: 它表示在一个副本可以迁走之前, 其主节点必须保留的好副本数量。例如, 如果该参数设为 2, 那么只有当它的主节点还保留着两个可用副本时, 副本才能尝试迁移。



## configEpoch conflicts resolution algorithm

When new `configEpoch` values are created via replica promotion during failovers, they are guaranteed to be unique.

However there are two distinct events where new configEpoch values are created in an unsafe way, just incrementing the local `currentEpoch` of the local node and hoping there are no conflicts at the same time. Both the events are system-administrator triggered:

1. [CLUSTER FAILOVER](https://redis.io/commands/cluster-failover) command with `TAKEOVER` option is able to manually promote a replica node into a master *without the majority of masters being available*. This is useful, for example, in multi data center setups.
2. Migration of slots for cluster rebalancing also generates new configuration epochs inside the local node without agreement for performance reasons.

Specifically, during manual resharding, when a hash slot is migrated from a node A to a node B, the resharding program will force B to upgrade its configuration to an epoch which is the greatest found in the cluster, plus 1 (unless the node is already the one with the greatest configuration epoch), without requiring agreement from other nodes. Usually a real world resharding involves moving several hundred hash slots (especially in small clusters). Requiring an agreement to generate new configuration epochs during resharding, for each hash slot moved, is inefficient. Moreover it requires an fsync in each of the cluster nodes every time in order to store the new configuration. Because of the way it is performed instead, we only need a new config epoch when the first hash slot is moved, making it much more efficient in production environments.

However because of the two cases above, it is possible (though unlikely) to end with multiple nodes having the same configuration epoch. A resharding operation performed by the system administrator, and a failover happening at the same time (plus a lot of bad luck) could cause `currentEpoch` collisions if they are not propagated fast enough.

Moreover, software bugs and filesystem corruptions can also contribute to multiple nodes having the same configuration epoch.

When masters serving different hash slots have the same `configEpoch`, there are no issues. It is more important that replicas failing over a master have unique configuration epochs.

That said, manual interventions or resharding may change the cluster configuration in different ways. The Redis Cluster main liveness property requires that slot configurations always converge, so under every circumstance we really want all the master nodes to have a different `configEpoch`.

In order to enforce this, **a conflict resolution algorithm** is used in the event that two nodes end up with the same `configEpoch`.

- IF a master node detects another master node is advertising itself with the same `configEpoch`.
- AND IF the node has a lexicographically smaller Node ID compared to the other node claiming the same `configEpoch`.
- THEN it increments its `currentEpoch` by 1, and uses it as the new `configEpoch`.

If there are any set of nodes with the same `configEpoch`, all the nodes but the one with the greatest Node ID will move forward, guaranteeing that, eventually, every node will pick a unique configEpoch regardless of what happened.

This mechanism also guarantees that after a fresh cluster is created, all nodes start with a different `configEpoch` (even if this is not actually used) since `redis-cli` makes sure to use `CONFIG SET-CONFIG-EPOCH` at startup. However if for some reason a node is left misconfigured, it will update its configuration to a different configuration epoch automatically.



## configEpoch 冲突解决算法

在故障转移期间通过副本晋升产生的新 `configEpoch` 值, 可以保证是唯一的。

不过有两种不同的事件会以不安全的方式产生新的 configEpoch 值, 即只是递增本地节点的 `currentEpoch` 并寄希望于同一时刻没有冲突。这两种事件都是由系统管理员触发的:

1. 带 `TAKEOVER` 选项的 [CLUSTER FAILOVER](https://redis.io/commands/cluster-failover) 命令, 能够在*大多数主节点不可用的情况下*手动把一个副本节点晋升为主节点。例如, 在多数据中心部署中这很有用。
2. 为集群再平衡而进行的槽迁移, 出于性能考虑, 也会在没有共识的情况下于本地节点内部生成新的配置纪元。

具体来说, 在手动重新分片期间, 当某个哈希槽从节点 A 迁移到节点 B 时, 重新分片程序会强制 B 把自己的配置升级为集群中所发现的最大纪元加 1(除非该节点已经拥有最大的配置纪元), 而不需要其他节点的共识。在实际场景中, 一次重新分片通常涉及迁移数百个哈希槽(尤其是在小集群中)。若在重新分片期间每迁移一个哈希槽都要求通过共识来生成新的配置纪元, 效率会很低。而且那样每次都需要在每个集群节点上执行一次 fsync 来保存新配置。而按现在这种方式执行, 只有在第一个哈希槽被迁移时才需要一个新配置纪元, 这使它在生产环境中高效得多。

不过由于上述两种情况, 有可能(尽管不太可能)最终出现多个节点拥有相同配置纪元。系统管理员执行的一次重新分片操作, 与同时发生的一次故障转移(再加上很多坏运气), 如果传播得不够快, 就可能导致 `currentEpoch` 冲突。

此外, 软件缺陷和文件系统损坏也可能导致多个节点拥有相同的配置纪元。

当服务不同哈希槽的主节点拥有相同的 `configEpoch` 时, 并没有问题。更重要的是, 对某个主节点执行故障转移的副本应当拥有唯一的配置纪元。

话虽如此, 人工干预或重新分片可能会以不同方式改变集群配置。Redis Cluster 主要的活性(liveness)性质要求槽配置始终收敛, 因此在任何情况下, 我们都确实希望所有主节点拥有不同的 `configEpoch`。

为了强制做到这一点, 当两个节点最终拥有相同的 `configEpoch` 时, 会使用一套**冲突解决算法(conflict resolution algorithm)**。

- 如果某个主节点检测到另一个主节点以相同的 `configEpoch` 通告自己。
- 并且如果相较于声称拥有相同 `configEpoch` 的那个节点, 本节点的 Node ID 按字典序更小。
- 那么它就把自己的 `currentEpoch` 加 1, 并把它作为新的 `configEpoch`。

如果存在一组 `configEpoch` 相同的节点, 那么除 Node ID 最大的那个之外, 所有节点都会向前推进, 这就保证了无论发生过什么, 最终每个节点都会选出一个唯一的 configEpoch。

这一机制还保证: 在新集群创建之后, 所有节点都以不同的 `configEpoch` 启动(即使实际上并未使用), 因为 `redis-cli` 在启动时会确保使用 `CONFIG SET-CONFIG-EPOCH`。不过, 如果某个节点由于某种原因配置有误, 它会自动把自己的配置更新为一个不同的配置纪元。



## Node resets

Nodes can be software reset (without restarting them) in order to be reused in a different role or in a different cluster. This is useful in normal operations, in testing, and in cloud environments where a given node can be reprovisioned to join a different set of nodes to enlarge or create a new cluster.

In Redis Cluster nodes are reset using the [CLUSTER RESET](https://redis.io/commands/cluster-reset) command. The command is provided in two variants:

- `CLUSTER RESET SOFT`
- `CLUSTER RESET HARD`

The command must be sent directly to the node to reset. If no reset type is provided, a soft reset is performed.

The following is a list of operations performed by a reset:

1. Soft and hard reset: If the node is a replica, it is turned into a master, and its dataset is discarded. If the node is a master and contains keys the reset operation is aborted.
2. Soft and hard reset: All the slots are released, and the manual failover state is reset.
3. Soft and hard reset: All the other nodes in the nodes table are removed, so the node no longer knows any other node.
4. Hard reset only: `currentEpoch`, `configEpoch`, and `lastVoteEpoch` are set to 0.
5. Hard reset only: the Node ID is changed to a new random ID.

Master nodes with non-empty data sets can't be reset (since normally you want to reshard data to the other nodes). However, under special conditions when this is appropriate (e.g. when a cluster is totally destroyed with the intent of creating a new one), [FLUSHALL](https://redis.io/commands/flushall) must be executed before proceeding with the reset.



## 节点重置

节点可以通过软件方式重置(无需重启), 以便在不同的角色或不同的集群中重新使用。这在日常运维、测试以及云环境中都很有用: 在云环境中, 某个节点可以被重新配置, 加入另一组节点, 以扩大某个集群或创建一个新集群。

在 Redis Cluster 中, 节点使用 [CLUSTER RESET](https://redis.io/commands/cluster-reset) 命令进行重置。该命令提供两种变体:

- `CLUSTER RESET SOFT`
- `CLUSTER RESET HARD`

该命令必须直接发送给要重置的节点。如果没有提供重置类型, 则执行软重置(soft reset)。

重置所执行的操作如下:

1. 软重置和硬重置: 如果该节点是副本, 它会被转变为主节点, 并丢弃其数据集。如果该节点是主节点且包含键, 则中止重置操作。
2. 软重置和硬重置: 释放所有槽, 并重置手动故障转移状态。
3. 软重置和硬重置: 移除节点表中的所有其他节点, 因此该节点不再知道任何其他节点。
4. 仅硬重置: `currentEpoch`、`configEpoch` 和 `lastVoteEpoch` 被设为 0。
5. 仅硬重置: Node ID 被改为一个新的随机 ID。

数据集非空的主节点不能被重置(因为通常你会希望把数据重新分片到其他节点上)。不过在特殊情况下, 当这样做是合适的(例如在打算创建一个新集群而彻底销毁旧集群时), 必须先执行 [FLUSHALL](https://redis.io/commands/flushall), 然后再进行重置。



## Removing nodes from a cluster

It is possible to practically remove a node from an existing cluster by resharding all its data to other nodes (if it is a master node) and shutting it down. However, the other nodes will still remember its node ID and address, and will attempt to connect with it.

For this reason, when a node is removed we want to also remove its entry from all the other nodes tables. This is accomplished by using the `CLUSTER FORGET <node-id>` command.

The command does two things:

1. It removes the node with the specified node ID from the nodes table.
2. It sets a 60 second ban which prevents a node with the same node ID from being re-added.

The second operation is needed because Redis Cluster uses gossip in order to auto-discover nodes, so removing the node X from node A, could result in node B gossiping about node X to A again. Because of the 60 second ban, the Redis Cluster administration tools have 60 seconds in order to remove the node from all the nodes, preventing the re-addition of the node due to auto discovery.

Further information is available in the [CLUSTER FORGET](https://redis.io/commands/cluster-forget) documentation.



## 从集群中移除节点

从实践角度看, 可以通过把某个节点的所有数据重新分片到其他节点上(如果它是主节点), 然后关闭它, 从而把它从现有集群中移除。但这样一来, 其他节点仍会记得它的节点 ID 和地址, 并会尝试与它建立连接。

因此, 当我们移除一个节点时, 我们也希望从所有其他节点的表中移除它的条目。这通过 `CLUSTER FORGET <node-id>` 命令来完成。

该命令做两件事:

1. 从节点表中移除指定节点 ID 的那个节点。
2. 设置一个 60 秒的封禁, 防止相同节点 ID 的节点被重新加入。

第二个操作是必要的, 因为 Redis Cluster 使用 gossip 来自动发现节点, 所以从节点 A 移除节点 X 之后, 节点 B 可能会再次向 A 传播关于节点 X 的 gossip。由于有 60 秒的封禁, Redis Cluster 的管理工具就有 60 秒的时间把这个节点从所有节点中移除, 从而防止该节点因自动发现而被重新加入。

更多信息见 [CLUSTER FORGET](https://redis.io/commands/cluster-forget) 文档。



# Publish/Subscribe

In a Redis Cluster clients can subscribe to every node, and can also publish to every other node. The cluster will make sure that published messages are forwarded as needed.

The current implementation will simply broadcast each published message to all other nodes, but at some point this will be optimized either using Bloom filters or other algorithms.



# 发布/订阅

在 Redis Cluster 中, 客户端可以向每个节点订阅, 也可以向其他每个节点发布消息。集群会确保已发布的消息按需被转发。

当前实现只是把每条已发布的消息广播给所有其他节点, 但在将来某个时候, 这一点会使用布隆过滤器(Bloom filters)或其他算法进行优化。



# Appendix



# 附录



## Appendix A: CRC16 reference implementation in ANSI C

```
/*
 * Copyright 2001-2010 Georges Menie (www.menie.org)
 * Copyright 2010 Salvatore Sanfilippo (adapted to Redis coding style)
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the University of California, Berkeley nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE REGENTS AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/* CRC16 implementation according to CCITT standards.
 *
 * Note by @antirez: this is actually the XMODEM CRC 16 algorithm, using the
 * following parameters:
 *
 * Name                       : "XMODEM", also known as "ZMODEM", "CRC-16/ACORN"
 * Width                      : 16 bit
 * Poly                       : 1021 (That is actually x^16 + x^12 + x^5 + 1)
 * Initialization             : 0000
 * Reflect Input byte         : False
 * Reflect Output CRC         : False
 * Xor constant to output CRC : 0000
 * Output for "123456789"     : 31C3
 */

static const uint16_t crc16tab[256]= {
    0x0000,0x1021,0x2042,0x3063,0x4084,0x50a5,0x60c6,0x70e7,
    0x8108,0x9129,0xa14a,0xb16b,0xc18c,0xd1ad,0xe1ce,0xf1ef,
    0x1231,0x0210,0x3273,0x2252,0x52b5,0x4294,0x72f7,0x62d6,
    0x9339,0x8318,0xb37b,0xa35a,0xd3bd,0xc39c,0xf3ff,0xe3de,
    0x2462,0x3443,0x0420,0x1401,0x64e6,0x74c7,0x44a4,0x5485,
    0xa56a,0xb54b,0x8528,0x9509,0xe5ee,0xf5cf,0xc5ac,0xd58d,
    0x3653,0x2672,0x1611,0x0630,0x76d7,0x66f6,0x5695,0x46b4,
    0xb75b,0xa77a,0x9719,0x8738,0xf7df,0xe7fe,0xd79d,0xc7bc,
    0x48c4,0x58e5,0x6886,0x78a7,0x0840,0x1861,0x2802,0x3823,
    0xc9cc,0xd9ed,0xe98e,0xf9af,0x8948,0x9969,0xa90a,0xb92b,
    0x5af5,0x4ad4,0x7ab7,0x6a96,0x1a71,0x0a50,0x3a33,0x2a12,
    0xdbfd,0xcbdc,0xfbbf,0xeb9e,0x9b79,0x8b58,0xbb3b,0xab1a,
    0x6ca6,0x7c87,0x4ce4,0x5cc5,0x2c22,0x3c03,0x0c60,0x1c41,
    0xedae,0xfd8f,0xcdec,0xddcd,0xad2a,0xbd0b,0x8d68,0x9d49,
    0x7e97,0x6eb6,0x5ed5,0x4ef4,0x3e13,0x2e32,0x1e51,0x0e70,
    0xff9f,0xefbe,0xdfdd,0xcffc,0xbf1b,0xaf3a,0x9f59,0x8f78,
    0x9188,0x81a9,0xb1ca,0xa1eb,0xd10c,0xc12d,0xf14e,0xe16f,
    0x1080,0x00a1,0x30c2,0x20e3,0x5004,0x4025,0x7046,0x6067,
    0x83b9,0x9398,0xa3fb,0xb3da,0xc33d,0xd31c,0xe37f,0xf35e,
    0x02b1,0x1290,0x22f3,0x32d2,0x4235,0x5214,0x6277,0x7256,
    0xb5ea,0xa5cb,0x95a8,0x8589,0xf56e,0xe54f,0xd52c,0xc50d,
    0x34e2,0x24c3,0x14a0,0x0481,0x7466,0x6447,0x5424,0x4405,
    0xa7db,0xb7fa,0x8799,0x97b8,0xe75f,0xf77e,0xc71d,0xd73c,
    0x26d3,0x36f2,0x0691,0x16b0,0x6657,0x7676,0x4615,0x5634,
    0xd94c,0xc96d,0xf90e,0xe92f,0x99c8,0x89e9,0xb98a,0xa9ab,
    0x5844,0x4865,0x7806,0x6827,0x18c0,0x08e1,0x3882,0x28a3,
    0xcb7d,0xdb5c,0xeb3f,0xfb1e,0x8bf9,0x9bd8,0xabbb,0xbb9a,
    0x4a75,0x5a54,0x6a37,0x7a16,0x0af1,0x1ad0,0x2ab3,0x3a92,
    0xfd2e,0xed0f,0xdd6c,0xcd4d,0xbdaa,0xad8b,0x9de8,0x8dc9,
    0x7c26,0x6c07,0x5c64,0x4c45,0x3ca2,0x2c83,0x1ce0,0x0cc1,
    0xef1f,0xff3e,0xcf5d,0xdf7c,0xaf9b,0xbfba,0x8fd9,0x9ff8,
    0x6e17,0x7e36,0x4e55,0x5e74,0x2e93,0x3eb2,0x0ed1,0x1ef0
};

uint16_t crc16(const char *buf, int len) {
    int counter;
    uint16_t crc = 0;
    for (counter = 0; counter < len; counter++)
            crc = (crc<<8) ^ crc16tab[((crc>>8) ^ *buf++)&0x00FF];
    return crc;
}
```




## 附录A: ANSI C 版本的 CRC16 参考实现

下面是本文档中使用的 CRC16 算法的完整参考实现(ANSI C 代码见上文代码块)。



## 相关链接

- [Download Redis](https://redis.io/download)
- [Windows下安装并设置Redis](https://renfufei.blog.csdn.net/article/details/38474435)
- [铁锚的Redis专栏](https://blog.csdn.net/renfufei/category_2470713.html)
- [Redis Documentation](https://redis.io/documentation)
- [Redis cluster tutorial](https://redis.io/topics/cluster-tutorial)
- [Redis Cluster Specification](https://redis.io/topics/cluster-spec)
- [Redis cluster specification - Detailed](https://redis.io/docs/reference/cluster-spec/)