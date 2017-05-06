# Using Redis as an LRU cache

# 配置Redis作为LRU缓存


When Redis is used as a cache, sometimes it is handy to let it automatically evict old data as you add new one. This behavior is very well known in the community of developers, since it is the default behavior of the popular*memcached* system.

将 Redis 用作缓存时, 如果存储空间用满, 会自动将旧数据驱逐。 开发者都很熟悉 *memcached* 默认就是这种形式。


LRU is actually only one of the supported eviction methods. This page covers the more general topic of the Redis `maxmemory` directive that is used in order to limit the memory usage to a fixed amount, and it also covers in depth the LRU algorithm used by Redis, that is actually an approximation of the exact LRU.

实际上Redis只支持 LRU 这一种回收算法. 本文详细介绍限制最大内存使用量的 `maxmemory`  指令, 同时深入讲解 Redis 使用的LRU算法, 本质上算是一个近似的 LRU 算法。


## Maxmemory configuration directive

## maxmemory 指令


The `maxmemory` configuration directive is used in order to configure Redis to use a specified amount of memory for the data set. It is possible to set the configuration directive using the `redis.conf` file, or later using the [CONFIG SET](https://redis.io/commands/config-set) command at runtime.

`maxmemory` 指令用于指定 Redis 的最大内存使用量。既可以在 `redis.conf` 文件中设置, 也可以在运行过程中通过 [CONFIG SET](https://redis.io/commands/config-set) 命令修改。


For example in order to configure a memory limit of 100 megabytes, the following directive can be used inside the `redis.conf` file.

例如, 设置 100MB 的内存限制, 可以在 `redis.conf` 文件中这样配置：


```
maxmemory 100mb
```


Setting `maxmemory` to zero results into no memory limits. This is the default behavior for 64 bit systems, while 32 bit systems use an implicit memory limit of 3GB.

将 `maxmemory`  设置为 0 则表示没有内存限制。对于64位系统来说默认是没有限制, 而32位系统则会有一个隐含的限制: 最多 3GB 内存。


When the specified amount of memory is reached, it is possible to select among different behaviors, called **policies**. Redis can just return errors for commands that could result in more memory being used, or it can evict some old data in order to return back to the specified limit every time new data is added.

可以配置不同的策略, 称为 **policies**。 在达到最大内存使用量时, 如果需要更多的内存来存储新数据, 根据策略, Redis可以直接返回错误信息, 或者驱逐部分旧数据。


## Eviction policies

## 驱逐策略


The exact behavior Redis follows when the `maxmemory` limit is reached is configured using the `maxmemory-policy`configuration directive.

当达到最大内存限制时(`maxmemory`), Redis 根据 `maxmemory-policy` 配置决定具体的行为。


The following policies are available:

Redis 支持以下这些策略(当前版本,Redis 3.0):


- **noeviction**: return errors when the memory limit was reached and the client is trying to execute commands that could result in more memory to be used (most write commands, but [DEL](https://redis.io/commands/del) and a few more exceptions).
- **allkeys-lru**: evict keys trying to remove the less recently used (LRU) keys first, in order to make space for the new data added.
- **volatile-lru**: evict keys trying to remove the less recently used (LRU) keys first, but only among keys that have an **expire set**, in order to make space for the new data added.
- **allkeys-random**: evict random keys in order to make space for the new data added.
- **volatile-random**: evict random keys in order to make space for the new data added, but only evict keys with an **expire set**.
- **volatile-ttl**: In order to make space for the new data, evict only keys with an **expire set**, and try to evict keys with a shorter time to live (TTL) first.

<br/>

- **noeviction**: 不驱逐策略, 在达到内存限制时, 如果需要更多内存, 直接返回错误响应信息。 大多数写命令会导致需要更多的内存(但极少数会例外, 如  [DEL](https://redis.io/commands/del) 等)。
- **allkeys-lru**: 试图驱逐键删除最近使用(LRU)钥匙第一越少,为了使新数据添加空间。
- **volatile-lru**: 试图驱逐键删除最近使用(LRU)钥匙第一越少,但只有在键有一个* *设置* *到期,为了使新数据添加空间。
- **allkeys-random**:驱逐随机密钥为了使新数据添加空间。
- **volatile-random**:驱逐随机密钥为了使空间添加新数据,但只有驱逐键* *设置* *到期。
- **volatile-ttl**:为了使空间为新数据,驱逐只有钥匙一个* * * *,到期并试图驱逐键与较短的生存时间(TTL)。



The policies **volatile-lru**, **volatile-random** and **volatile-ttl** behave like **noeviction** if there are no keys to evict matching the prerequisites.

政策* * volatile-lru * *,* * volatile-random * *和* * volatile-ttl * *像* * noeviction * *如果没有关键先决条件匹配的驱逐。


To pick the right eviction policy is important depending on the access pattern of your application, however you can reconfigure the policy at runtime while the application is running, and monitor the number of cache misses and hits using the Redis [INFO](https://redis.io/commands/info) output in order to tune your setup.

To pick the right eviction policy is important depending on the access pattern of your application, or you can reconfigure the policy at runtime while the application is running,和监控缓存缺失和连接次数使用Redis,[信息](https://redis.io/commands/info)输出,以优化您的设置。


In general as a rule of thumb:

一般的经验法则:


- Use the **allkeys-lru** policy when you expect a power-law distribution in the popularity of your requests, that is, you expect that a subset of elements will be accessed far more often than the rest. **This is a good pick if you are unsure**.
- Use the **allkeys-random** if you have a cyclic access where all the keys are scanned continuously, or when you expect the distribution to be uniform (all elements likely accessed with the same probability).
- Use the **volatile-ttl** if you want to be able to provide hints to Redis about what are good candidate for expiration by using different TTL values when you create your cache objects.

<br/>

- 使用* * allkeys-lru * *政策当你期望一个幂律分布在你的请求的流行,也就是说,您期望的一个子集的元素将会比其他人更经常访问.* *这是一个很好的选择,如果你不确定* *。
- 使用* * allkeys-random * *如果你有一个不断循环访问扫描所有的键,或者当你期望分布均匀(所有元素可能访问相同的概率)。
- 使用* * volatile-ttl * *如果你想成为能够提供提示Redis,什么是好的候选人到期时通过使用不同的TTL值创建缓存对象。



The **volatile-lru** and **volatile-random** policies are mainly useful when you want to use a single instance for both caching and to have a set of persistent keys. However it is usually a better idea to run two Redis instances to solve such a problem.

* * volatile-lru * *和* * volatile-random * *政策主要是有用的,当你想要使用一个单独的实例缓存和一系列持续的钥匙.然而,通常是一个更好的主意来运行两个Redis实例来解决这样的问题。


It is also worth to note that setting an expire to a key costs memory, so using a policy like **allkeys-lru** is more memory efficient since there is no need to set an expire for the key to be evicted under memory pressure.

适足值得注意,to了key和到期费用记忆,所以使用政策像* * allkeys-lru * *更多的内存效率由于没有需要设置一个到期被驱逐在内存压力的关键。


## How the eviction process works

## 拆迁过程中是如何运作的吗


It is important to understand that the eviction process works like this:

重要的是要理解,驱逐过程是这样的:


- A client runs a new command, resulting in more data added.
- Redis checks the memory usage, and if it is greater than the `maxmemory` limit , it evicts keys according to the policy.
- A new command is executed, and so forth.

<br/>

- 客户端运行一个新命令,导致更多的数据补充道。
- Redis,检查内存使用量,如果大于“maxmemory”限制,它就清除键根据政策。
- 执行一个新命令,等等。



So we continuously cross the boundaries of the memory limit, by going over it, and then by evicting keys to return back under the limits.

所以我们不断跨越边界的内存限制,通过复习,然后通过驱逐键返回以下限制。


If a command results in a lot of memory being used (like a big set intersection stored into a new key) for some time the memory limit can be surpassed by a noticeable amount.

如果一个命令导致使用大量内存(像一个大组交叉存储到一个新的键)在一段时间内的内存限制可以被明显超过金额。


## Approximated LRU algorithm

## 近似LRU算法


Redis LRU algorithm is not an exact implementation. This means that Redis is not able to pick the *best candidate* for eviction, that is, the access that was accessed the most in the past. Instead it will try to run an approximation of the LRU algorithm, by sampling a small number of keys, and evicting the one that is the best (with the oldest access time) among the sampled keys.

Redis,LRU算法并不是一个具体的实现。这意味着Redis,不能选择驱逐的*最佳人选*,即访问的访问大多数在过去.相反,它会运行一个近似的LRU算法,通过抽样少量的钥匙,驱逐的是最好的(最古老的访问时间)在采样的钥匙。


However since Redis 3.0 the algorithm was improved to also take a pool of good candidates for eviction. This improved the performance of the algorithm, making it able to approximate more closely the behavior of a real LRU algorithm.

然而自Redis 3.0 algorithm was the改善,还拿池用良好的艰巨任务》.这种改进算法的性能,使其能够更紧密地近似的行为真正LRU算法。


What is important about the Redis LRU algorithm is that you **are able to tune** the precision of the algorithm by changing the number of samples to check for every eviction. This parameter is controlled by the following configuration directive:

Redis,LRU算法最重要的是,你* * * *能够优化算法的精度通过改变样品的数量来检查每个驱逐.这个参数是由以下配置控制指令:


```
maxmemory-samples 5
```


The reason why Redis does not use a true LRU implementation is because it costs more memory. However the approximation is virtually equivalent for the application using Redis. The following is a graphical comparison of how the LRU approximation used by Redis compares with true LRU.

Redis,不使用的原因是因为它真正的LRU实现成本更多的内存。然而,使用Redis,近似为应用程序实际上是等价的.下面是一个图形比较LRU的近似Redis,而真正的LRU使用。


![LRU comparison](http://redis.io/images/redisdoc/lru_comparison.png)


The test to generate the above graphs filled a Redis server with a given number of keys. The keys were accessed from the first to the last, so that the first keys are the best candidates for eviction using an LRU algorithm. Later more 50% of keys are added, in order to force half of the old keys to be evicted.

.钥匙从第一个到最后一个访问,所以第一个键是最好的候选人驱逐使用LRU算法.


You can see three kind of dots in the graphs, forming three distinct bands.

你可以看到三种点图表,形成三个不同的乐队。


- The light gray band are objects that were evicted.
- The gray band are objects that were not evicted.
- The green band are objects that were added.

<br/>

- 浅灰色带是被驱逐的对象。
- 灰色的乐队是对象没有驱逐。
- 绿色的乐队是被添加的对象。



In a theoretical LRU implementation we expect that, among the old keys, the first half will be expired. The Redis LRU algorithm will instead only *probabilistically* expire the older keys.

在理论LRU实现我们期望,在旧的钥匙,上半年将过期。Redis,LRU算法将只*概率*到期年长的钥匙。


As you can see Redis 3.0 does a better job with 5 samples compared to Redis 2.8, however most objects that are among the latest accessed are still retained by Redis 2.8. Using a sample size of 10 in Redis 3.0 the approximation is very close to the theoretical performance of Redis 3.0.

正如你所看到的Redis,3.0做一份更好的工作,5样品相比,Redis,2.8,然而大多数对象的最新访问仍保留的Redis,2.8.使用一个样本大小为10在Redis,3.0近似非常接近理论Redis,3.0的性能。


Note that LRU is just a model to predict how likely a given key will be accessed in the future. Moreover, if your data access pattern closely resembles the power law, most of the accesses will be in the set of keys that the LRU approximated algorithm will be able to handle well.

注意,LRU只是一个模型预测可能将来会访问一个给定的键.此外,如果您的数据访问模式相似的权力法律,大部分的访问将在LRU的键集近似算法能够处理好。


In simulations we found that using a power law access pattern, the difference between true LRU and Redis approximation were minimal or non-existent.

在模拟中,我们发现使用幂律访问模式,真正的LRU的区别和Redis,近似最小或根本不存在。


However you can raise the sample size to 10 at the cost of some additional CPU usage in order to closely approximate true LRU, and check if this makes a difference in your cache misses rate.

不过你可以提高样本大小10为代价的一些额外的CPU使用率为了密切近似真实的LRU,并检查如果这使得你的缓存错过率上的差异。


To experiment in production with different values for the sample size by using the `CONFIG SET maxmemory-samples <count>` command, is very simple.

试验在生产不同的样本大小的值通过使用的配置设置maxmemory-samples <统计>的命令,很简单。


原文链接: <https://redis.io/topics/lru-cache>
