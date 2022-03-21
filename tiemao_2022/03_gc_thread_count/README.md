## JVM调优系列: 默认GC线程数的计算公式

![thread dump patterns](https://i0.wp.com/blog.fastthread.io/wp-content/uploads/2015/09/too-many-cleaners.jpg?fit=640%2C359&ssl=1)

### Description

Based on the type of GC algorithm (Serial, parallel, G1, CMS) used, default number of garbage collection threads gets created. Details on default number of threads that will be created are documented below. Sometimes too many extraneous GC threads would get created based on the default configuration. We have seen scenarios where `128`, `256`, `512`  GC threads got created based on default configuration. Too many GC threads can also affect your application’s performance. So GC thread count should be carefully configured.

### 简述

根据选用的垃圾收集器(包括串行GC、并行GC、G1、CMS), 默认创建的GC线程数会有所不同。
本文介绍默认的GC线程数信息。
机器配置较高的话, 默认会创建太多的GC线程, 甚至引发性能问题。
根据我们的调查和统计, 发现很多基于默认配置而创建了 `128`、`256`、`512` 个GC线程的场景。
过多的 GC 线程会影响应用程序的性能。
所以需要根据机器配置进行GC线程数的调优。

### 示例程序


### 串行垃圾收集器(Serial GC)

启动参数:

很明显, 串行垃圾收集器只使用1个GC线程。


### Parallel GC

If you are using Parallel GC algorithm, then number of GC threads is controlled by `-XX:ParallelGCThreads` property. Default value for `-XX:ParallelGCThreads` on Linux/x86 machine is derived based on the formula:

### 并行垃圾收集器(Parallel GC)

如果使用 Parallel GC 算法, 则 GC 线程数由 `-XX:ParallelGCThreads` 属性控制。
Linux/x86 机器上的 `-XX:ParallelGCThreads` 默认值由以下公式计算得出:

```c
if (num of processors <=8) {
   return num of processors;
} else {
  return 8 + (num of processors-8)*(5/8);
}
```

So if your JVM is running on server with 32 processors, then ParallelGCThread value is going to be: `23`(i.e. `8 + (32 – 8)*(5/8)`).

因此, 在 32 核的服务器上运行, 则 ParallelGCThread 的默认值为:`23`(即 `8 + (32 – 8)*(5/8)` )。


### CMS GC

If you are using CMS GC algorithm, then number of GC threads is controlled by `-XX:ParallelGCThreads` and `-XX:ConcGCThreads` properties. Default value of `-XX:ConcGCThreads` is derived based on the formula:

### CMS 垃圾收集器

如果使用 CMS GC 算法, 则 GC 线程数由 `-XX:ParallelGCThreads` 和 `-XX:ConcGCThreads` 属性来控制。
`-XX:ConcGCThreads` 的默认值根据以下公式计算得出:

> `max( (ParallelGCThreads+2)/4, 1 )`

So if your JVM is running on server with 32 processors, then

- ParallelGCThread value is going to be: 23 (i.e. `8 + (32 – 8)*(5/8)`)
- ConcGCThreads value is going to be: `6`.
- So total GC thread count is: `29` (i.e. ParallelGCThread  count + ConcGCThreads  i.e. `23 + 6`)

因此, 在 32 核的服务器上运行, 那么可以得知:

- ParallelGCThread 的默认值为:`23`(即 `8 + (32 – 8)*(5/8)` )。
- ConcGCThreads 的默认值是: `6`(即 `max( (23+2)/4, 1 )`)。
- 所以总的 GC 线程数为: `29`(即 ParallelGCThread + ConcGCThreads, `23 + 6`)

### G1 GC

If you are using G1 GC algorithm, then number of GC threads is controlled by `-XX:ParallelGCThreads,` `-XX:ConcGCThreads`, `-XX:G1ConcRefinementThreads` properties. Default value of `-XX:G1ConcRefinementThreads` is derived based on the formula:

### G1 垃圾收集器

如果使用 G1 GC 算法, 则 GC 线程数由 `-XX:ParallelGCThreads,` `-XX:ConcGCThreads`, `-XX:G1ConcRefinementThreads` 属性控制。
`-XX:G1ConcRefinementThreads` 的默认值根据以下公式计算得出:

> `ParallelGCThreads+1`

So if your JVM is running on server with `32` processors, then

- ParallelGCThread value is going to be: `23` (i.e. `8 + (32 – 8)*(5/8)`)
- ConcGCThreads value is going to be: `6`
- G1ConcRefinementThreads value is going to be `24` (i.e. `23 + 1`)
- So total GC thread count is: `53` (i.e. ParallelGCThread  count + ConcGCThreads + G1ConcRefinementThreads i.e. `23 + 6 + 24`)

53 threads for GC is quite a high number. It should be tuned down appropriately.

因此, 在 32 核的服务器上运行, 那么可以得知:

- ParallelGCThread 的默认值为:`23`(即 `8 + (32 – 8)*(5/8)` )。
- ConcGCThreads 的默认值是: `6`(即 `max( (23+2)/4, 1 )`)。
- G1ConcRefinementThreads 的默认值是: `24` (即 `23 + 1`)
- 所以总的 GC 线程数为: `53`(即 ParallelGCThread + ConcGCThreads + G1ConcRefinementThreads, `23 + 6 + 24`)

一个JVM中有53个GC线程实在是太多了。 需要适当调低这些数值。

### Why named as Several Scavengers?

Scavenger is a person who searches for and cleans-up discarded items. GC threads also do exactly same thing. Too many Scavengers in one single spot doesn’t yield productive result. Similarly, too many GC threads wouldn’t help JVM either.

### 为什么叫做清道夫(Scavenger)?

清道夫(Scavenger), 也叫拾荒者, 是寻找和清理废弃物品的人。
GC线程做的事情和拾荒者差不多, 把有用的东西捡起来, 没用的清掉。
一个地方有多个清道夫, 产出也不会增加多少。
同样, 过多的 GC 线程也无助于提升JVM性能。


### 相关链接

- GitHub中英双语对照版: [JVM调优系列: GC线程数的默认值计算公式](https://github.com/cncounter/translation/blob/master/tiemao_2022/03_gc_thread_count/README.md)
- EN原文链接: [THREAD DUMP ANALYSIS PATTERN – SEVERAL SCAVENGERS](https://blog.fastthread.io/2015/09/02/thread-dump-analysis-pattern-several-scavengers/)
