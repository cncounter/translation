# Using Redis as an LRU cache

# 配置Redis作为缓存


When Redis is used as a cache, sometimes it is handy to let it automatically evict old data as you add new one. This behavior is very well known in the community of developers, since it is the default behavior of the popular*memcached* system.

用 Redis 作为缓存时, 如果用满内存空间, 就会自动淘汰老的数据。 默认情况下 *memcached* 就是这种方式, 大部分开发者都比较熟悉。


LRU is actually only one of the supported eviction methods. This page covers the more general topic of the Redis `maxmemory` directive that is used in order to limit the memory usage to a fixed amount, and it also covers in depth the LRU algorithm used by Redis, that is actually an approximation of the exact LRU.

LRU是Redis唯一支持的回收算法. 本文详细介绍用于限制最大内存使用量的 `maxmemory`  指令, 并深入讲解 Redis 所使用的近似LRU算法。


## Maxmemory configuration directive

## maxmemory 配置指令


The `maxmemory` configuration directive is used in order to configure Redis to use a specified amount of memory for the data set. It is possible to set the configuration directive using the `redis.conf` file, or later using the [CONFIG SET](https://redis.io/commands/config-set) command at runtime.

`maxmemory` 用于指定 Redis 能使用的最大内存。既可以在 `redis.conf` 文件中设置, 也可以在运行过程中通过 [CONFIG SET](https://redis.io/commands/config-set) 命令动态修改。


For example in order to configure a memory limit of 100 megabytes, the following directive can be used inside the `redis.conf` file.

例如, 要设置 100MB 的内存限制, 可以在 `redis.conf` 文件中这样配置：


```
maxmemory 100mb
```


Setting `maxmemory` to zero results into no memory limits. This is the default behavior for 64 bit systems, while 32 bit systems use an implicit memory limit of 3GB.

将 `maxmemory` 设置为 `0`, 则表示不进行内存限制。当然, 对32位系统来说有一个隐性的限制条件: 最多 3GB 内存。


When the specified amount of memory is reached, it is possible to select among different behaviors, called **policies**. Redis can just return errors for commands that could result in more memory being used, or it can evict some old data in order to return back to the specified limit every time new data is added.

当内存使用达到最大限制时, 如果需要存储新数据, 根据配置的策略(**policies**)的不同, Redis可能直接返回错误信息, 或者删除部分老的数据。


## Eviction policies

## 淘汰策略


Redis清理Key的办法包括:

- 定时删除
- 过期删除
- 淘汰策略


详情可参考: 视频: [我是Redis，MySQL大哥被我坑惨了！](https://www.youtube.com/watch?v=D16efi0TDIs&list=WL&index=2)



The exact behavior Redis follows when the `maxmemory` limit is reached is configured using the `maxmemory-policy`configuration directive.

达到最大内存限制时(`maxmemory`), Redis 根据 `maxmemory-policy` 配置的策略, 来决定具体的行为。


The following policies are available:

当前版本,Redis 3.0 支持的策略包括:


- **noeviction**: return errors when the memory limit was reached and the client is trying to execute commands that could result in more memory to be used (most write commands, but [DEL](https://redis.io/commands/del) and a few more exceptions).
- **allkeys-lru**: evict keys trying to remove the less recently used (LRU) keys first, in order to make space for the new data added.
- **volatile-lru**: evict keys trying to remove the less recently used (LRU) keys first, but only among keys that have an **expire set**, in order to make space for the new data added.
- **allkeys-random**: evict random keys in order to make space for the new data added.
- **volatile-random**: evict random keys in order to make space for the new data added, but only evict keys with an **expire set**.
- **volatile-ttl**: In order to make space for the new data, evict only keys with an **expire set**, and try to evict keys with a shorter time to live (TTL) first.

<br/>

- **noeviction**: 不删除策略, 达到最大内存限制时, 如果需要更多内存, 直接返回错误信息。 大多数写命令都会导致占用更多的内存(有极少数会例外, 如  [DEL](https://redis.io/commands/del) )。
- **allkeys-lru**:  所有key通用; 优先删除最近最少使用(less recently used ,LRU) 的 key。
- **volatile-lru**: 只限于设置了 **expire** 的部分; 优先删除最近最少使用(less recently used ,LRU) 的 key。
- **allkeys-random**: 所有key通用; 随机删除一部分 key。
- **volatile-random**: 只限于设置了 **expire** 的部分; 随机删除一部分 key。
- **volatile-ttl**: 只限于设置了 **expire** 的部分; 优先删除剩余时间(time to live,TTL) 短的key。



The policies **volatile-lru**, **volatile-random** and **volatile-ttl** behave like **noeviction** if there are no keys to evict matching the prerequisites.

如果没有设置 **expire** 的key, 不满足先决条件(prerequisites); 那么 **volatile-lru**, **volatile-random** 和 **volatile-ttl** 策略的行为, 和 **noeviction(不删除)** 基本上一致。


To pick the right eviction policy is important depending on the access pattern of your application, however you can reconfigure the policy at runtime while the application is running, and monitor the number of cache misses and hits using the Redis [INFO](https://redis.io/commands/info) output in order to tune your setup.

您需要根据系统的特征, 来选择合适的淘汰策略。 当然, 在运行过程中也可以通过命令动态设置淘汰策略, 并通过 [INFO](https://redis.io/commands/info) 命令监控缓存的 miss 和 hit, 来进行调优。


In general as a rule of thumb:

一般来说:


- Use the **allkeys-lru** policy when you expect a power-law distribution in the popularity of your requests, that is, you expect that a subset of elements will be accessed far more often than the rest. **This is a good pick if you are unsure**.
- Use the **allkeys-random** if you have a cyclic access where all the keys are scanned continuously, or when you expect the distribution to be uniform (all elements likely accessed with the same probability).
- Use the **volatile-ttl** if you want to be able to provide hints to Redis about what are good candidate for expiration by using different TTL values when you create your cache objects.

<br/>

- 如果分为热数据与冷数据, 推荐使用 **allkeys-lru** 策略。 也就是, 其中一部分key经常被读写. 如果不确定具体的业务特征, 那么 **allkeys-lru** 是一个很好的选择。
- 如果需要循环读写所有的key, 或者各个key的访问频率差不多, 可以使用 **allkeys-random** 策略, 即读写所有元素的概率差不多。
- 假如要让 Redis 根据 TTL 来筛选需要删除的key, 请使用 **volatile-ttl** 策略。



The **volatile-lru** and **volatile-random** policies are mainly useful when you want to use a single instance for both caching and to have a set of persistent keys. However it is usually a better idea to run two Redis instances to solve such a problem.

**volatile-lru** 和 **volatile-random** 策略主要应用场景是: 既有缓存,又有持久key的实例中。 一般来说, 像这类场景, 应该使用两个单独的 Redis 实例。


It is also worth to note that setting an expire to a key costs memory, so using a policy like **allkeys-lru** is more memory efficient since there is no need to set an expire for the key to be evicted under memory pressure.

值得一提的是, 设置 `expire` 会消耗额外的内存, 所以使用 **allkeys-lru** 策略, 可以更高效地利用内存, 因为这样就可以不再设置过期时间了。


## How the eviction process works

## 淘汰的内部处理过程


It is important to understand that the eviction process works like this:

淘汰过程可以这样理解:


- A client runs a new command, resulting in more data added.
- Redis checks the memory usage, and if it is greater than the `maxmemory` limit , it evicts keys according to the policy.
- A new command is executed, and so forth.

<br/>

- 客户端执行一个命令, 导致 Redis 中的数据增加,占用更多内存。
- Redis 检查内存使用量, 如果超出 `maxmemory` 限制, 根据策略清除部分 key。
- 执行下一条命令, 以此类推。



So we continuously cross the boundaries of the memory limit, by going over it, and then by evicting keys to return back under the limits.

在这个过程中, 内存使用量会不断地达到 limit 值, 然后超过, 然后删除部分 key, 使用量又下降到 limit 值之下。


If a command results in a lot of memory being used (like a big set intersection stored into a new key) for some time the memory limit can be surpassed by a noticeable amount.

如果某个命令导致大量内存占用(比如通过新key保存一个很大的set), 在一段时间内, 可能内存的使用量会明显超过 maxmemory 限制。


## Approximated LRU algorithm

## 近似LRU算法


Redis LRU algorithm is not an exact implementation. This means that Redis is not able to pick the *best candidate* for eviction, that is, the access that was accessed the most in the past. Instead it will try to run an approximation of the LRU algorithm, by sampling a small number of keys, and evicting the one that is the best (with the oldest access time) among the sampled keys.

Redis 使用的并不是完全LRU算法。自动淘汰的 key , 并不一定是最满足LRU特征的那个. 而是通过近似LRU算法, 抽取少量的 key 样本, 然后删除其中访问时间最古老的那个key。


However since Redis 3.0 the algorithm was improved to also take a pool of good candidates for eviction. This improved the performance of the algorithm, making it able to approximate more closely the behavior of a real LRU algorithm.

淘汰算法, 从 Redis 3.0 开始得到了巨大的优化, 使用 pool(池子) 来作为候选. 这大大提升了算法效率, 也更接近于真实的LRU算法。


What is important about the Redis LRU algorithm is that you **are able to tune** the precision of the algorithm by changing the number of samples to check for every eviction. This parameter is controlled by the following configuration directive:

在 Redis 的 LRU 算法中, 可以通过设置样本(sample)的数量来调优算法精度。 通过以下指令配置:


```
maxmemory-samples 5
```


The reason why Redis does not use a true LRU implementation is because it costs more memory. However the approximation is virtually equivalent for the application using Redis. The following is a graphical comparison of how the LRU approximation used by Redis compares with true LRU.

为什么不使用完全LRU实现? 原因是为了节省内存。但 Redis 的行为和LRU基本上是等价的. 下面是 Redis LRU 与完全LRU算法的一个行为对比图。


![LRU comparison](lru_comparison.png)


The test to generate the above graphs filled a Redis server with a given number of keys. The keys were accessed from the first to the last, so that the first keys are the best candidates for eviction using an LRU algorithm. Later more 50% of keys are added, in order to force half of the old keys to be evicted.

测试过程中, 依次从第一个 key 开始访问, 所以最前面的 key 才是最佳的淘汰对象。


You can see three kind of dots in the graphs, forming three distinct bands.

从图中可以看到三种类型的点, 构成了三个不同的条带。


- The light gray band are objects that were evicted.
- The gray band are objects that were not evicted.
- The green band are objects that were added.

<br/>

- 浅灰色部分表示被淘汰的对象。
- 灰色部分表示 "未被淘汰" 的对象。
- 绿色部分表示后面加入的对象。



In a theoretical LRU implementation we expect that, among the old keys, the first half will be expired. The Redis LRU algorithm will instead only *probabilistically* expire the older keys.

在纯粹的LRU算法实现中, 前半部分旧的key被释放了。而 Redis 的 LRU 算法只是将时间较长的 key 较大概率地(*probabilistically*)释放了。


As you can see Redis 3.0 does a better job with 5 samples compared to Redis 2.8, however most objects that are among the latest accessed are still retained by Redis 2.8. Using a sample size of 10 in Redis 3.0 the approximation is very close to the theoretical performance of Redis 3.0.

如你所见, Redis 3.0 中, 5样本的效果比 Redis 2.8 要好很多。 当然, Redis 2.8 也不错,最后访问的key基本上都还留在内存中. 在 Redis 3.0 中使用 10 样本时, 已经非常接近纯粹的LRU算法了。

Note that LRU is just a model to predict how likely a given key will be accessed in the future. Moreover, if your data access pattern closely resembles the power law, most of the accesses will be in the set of keys that the LRU approximated algorithm will be able to handle well.

注意,LRU只是用来预测将来可能会继续访问某个key的一个概率模型. 此外,如果数据访问的情况符合幂律分布(power law), 那么对于大部分的请求来说, LRU都会表现良好。


In simulations we found that using a power law access pattern, the difference between true LRU and Redis approximation were minimal or non-existent.

在模拟中, 我们发现, 如果使用幂律方式访问, 纯粹的LRU和Redis的结果差别非常, 甚至看不出来。


However you can raise the sample size to 10 at the cost of some additional CPU usage in order to closely approximate true LRU, and check if this makes a difference in your cache misses rate.

当然也可以将样本数量提高到10, 以额外消耗一些CPU为代价, 使得结果更接近于真实的LRU, 并通过 cache miss 统计信息来判断差异。


To experiment in production with different values for the sample size by using the `CONFIG SET maxmemory-samples <count>` command, is very simple.

设置样本大小很容易, 使用命令 `CONFIG SET maxmemory-samples <count>` 即可。


原文链接: <https://redis.io/topics/lru-cache>
