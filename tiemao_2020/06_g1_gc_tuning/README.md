# Garbage First Garbage Collector Tuning

> Learn about how to adapt and tune the G1 GC for evaluation, analysis and performance.


# 深入解析G1垃圾收集器与性能优化

> 本文详细介绍怎样配置G1垃圾收集器的参数，如何进行性能调优, 以及如何对GC性能进行分析和评估。

The [Garbage First Garbage Collector (G1 GC)](https://blog.csdn.net/renfufei/article/details/41897113) is the low-pause, server-style generational garbage collector for Java HotSpot VM. The G1 GC uses concurrent and parallel phases to achieve its target pause time and to maintain good throughput. When G1 GC determines that a garbage collection is necessary, it collects the regions with the least live data first (garbage first).

G1的全称为 [Garbage First Garbage Collector](https://blog.csdn.net/renfufei/article/details/41897113), 是一款内置在HotSpot JVM 中的服务端垃圾收集器。
G1使用【分代算法】, 将GC过程拆解为多个并发和并行阶段，将暂停时间打散，从而实现了低延迟特性，并保持良好的吞吐量。
只要G1认为可以进行垃圾收集，就会触发一次GC, 当然，G1优先回收存活数据较少的区域。
存活数据少就表示里面的垃圾对象多，这也是名字 Garbage First 的由来。

A garbage collector (GC) is a memory management tool. The G1 GC achieves automatic memory management through the following operations:

- Allocating objects to a young generation and promoting aged objects into an old generation.
- Finding live objects in the old generation through a concurrent (parallel) marking phase. The Java HotSpot VM triggers the marking phase when the total Java heap occupancy exceeds the default threshold.
- Recovering free memory by compacting live objects through parallel copying.

垃圾收集器本质上是一款内存管理工具。 G1算法主要通过以下方式来实现自动内存管理：

- 【分代】在年轻代中分配新对象，达到一定年龄的对象则提升到老年代。
- 【并发】在并发标记阶段遍历老年代中的所有存活对象。 只要Java中堆内存的总使用量超过阈值，HotSpot 就会触发标记周期。
- 【整理】通过并行复制方式来整理存活对象，释放可用内存。

> 在GC中， 并行(parallel)是指多个GC线程一起干活， 并发(concurrent)指GC线程和业务线程一起并发执行。

Here, we look at how to adapt and tune the G1 GC for evaluation, analysis and performance—we assume a basic understanding of Java garbage collection.

The G1 GC is a regionalized and generational garbage collector, which means that the Java object heap (heap) is divided into a number of equally sized regions. Upon startup, the Java Virtual Machine (JVM) sets the region size. The region sizes can vary from 1 MB to 32 MB depending on the heap size. The goal is to have no more than 2048 regions. The eden, survivor, and old generations are logical sets of these regions and are not contiguous.

The G1 GC has a pause time-target that it tries to meet (soft real time). During young collections, the G1 GC adjusts its young generation (eden and survivor sizes) to meet the soft real-time target. During mixed collections, the G1 GC adjusts the number of old regions that are collected based on a target number of mixed garbage collections, the percentage of live objects in each region of the heap, and the overall acceptable heap waste percentage.

The G1 GC reduces heap fragmentation by incremental parallel copying of live objects from one or more sets of regions (called Collection Set (CSet)) into different new region(s) to achieve compaction. The goal is to reclaim as much heap space as possible, starting with those regions that contain the most reclaimable space, while attempting to not exceed the pause time goal (garbage first).

The G1 GC uses independent Remembered Sets (RSets) to track references into regions. Independent RSets enable parallel and independent collection of regions because only a region's RSet must be scanned for references into that region, instead of the whole heap. The G1 GC uses a post-write barrier to record changes to the heap and update the RSets.


本文先简要介绍怎样配置G1参数, 然后再介绍如何对GC性能进行分析和评估。
想要进行GC调优，至少要对 [Java的垃圾收集机制](https://blog.csdn.net/renfufei/article/details/54144385) 有一定了解。

G1是一款增量式的分代垃圾收集器。 什么是增量呢？
G1把堆内存分为很多个大小相同的【小区域、小块】(region)。
在JVM启动时，根据堆内存的配置，确定每个region的大小。 region的大小取值范围是 `1MB`到`32MB`，总数一般不会超过2048region。
在G1中，新生代（eden），存活区（survivor）和老年代（old generation）都是逻辑上的概念，由这些region组合而成，这些region之间并不需要保持连续。

[![https://img-blog.csdn.net/20170205235146220](https://img-blog.csdn.net/20170205235146220)](https://blog.csdn.net/renfufei/article/details/54885190)

可以设置参数来指定 “期望的最大暂停时间”, G1会尽量去满足这个软实时目标值。
在【纯年轻模式（young）】的垃圾收集过程中，G1可以动态调整年轻代的大小（eden + survivor），以达成这个软实时目标暂停时间。
在【混合模式（mixed）】的垃圾收集过程中，G1可以调整本次GC需要回收的老年代region数量，取决于【要回收的总region数】，【每个region中存活对象的百分比】，以及【堆内存允许浪费的比例】等数据。

G1采用【增量并行复制】的方式来实现【堆内存碎片整理功能】，将回收集中的存活对象拷贝到新region中，回收集的英文是 Collection Set，简称CSet，也就是本次GC涉及的region集合。
目标是尽可能多地，从有空闲的region中回收堆内存，同时也试图达成预期的暂停时间指标。

G1为每个region都单独设置了一份【记忆集】，英文是 Remembered Set，简称 RSet, 用来跟踪记录从别的region指向这个region中的引用。
通过这种region划分和独立的RSet数据结构，G1就可以并行地进行增量式垃圾回收，而不用遍历整个堆内存。
因为只需要扫描RSet，就可以得知有哪些跨区的引用指向这个region，从而对这些region进行回收。
G1使用【后置写屏障】(post-write barrier)来记录堆内存的修改信息, 并负责更新RSet。

## Garbage Collection Phases

Apart from evacuation pauses (described below) that compose the stop-the-world (STW) young and mixed garbage collections, the G1 GC also has parallel, concurrent, and multiphase marking cycles. G1 GC uses the Snapshot-At-The-Beginning (SATB) algorithm, which takes a snapshot of the set of live objects in the heap at the start of a marking cycle. The set of live objects is composed of the live objects in the snapshot, and the objects allocated since the start of the marking cycle. The G1 GC marking algorithm uses a pre-write barrier to record and mark objects that are part of the logical snapshot.

## 1. 垃圾回收阶段简介

G1垃圾收集器的纯年轻代模式GC，以及混合模式GC， 除了转移暂停(evacuation pause)这个 STW 阶段之外，还有并行的、并发的，由多个子阶段组成的标记周期。
G1 使用开始快照算法（SATB，Snapshot-At-The-Beginning），在标记周期开始时，对堆内存中的存活对象信息进行一次快照。
那么，总的存活对象就包括开始快照中的存活对象，加上标记开始之后新创建的对象。
G1的标记算法使用【前置写屏障】(pre-write barrier)来记录和标记逻辑上属于这次快照的对象。

## Young Garbage Collections

The G1 GC satisfies most allocation requests from regions added to the eden set of regions. During a young garbage collection, the G1 GC collects both the eden regions and the survivor regions from the previous garbage collection. The live objects from the eden and survivor regions are copied, or evacuated, to a new set of regions. The destination region for a particular object depends upon the object's age; an object that has aged sufficiently evacuates to an old generation region (that is, promoted); otherwise, the object evacuates to a survivor region and will be included in the CSet of the next young or mixed garbage collection.

## 2. 纯年轻代模式的垃圾收集

G1将绝大部分的内存分配请求打到eden区。
在年轻代模式的垃圾收集过程中，G1会收集eden区和前一次GC使用的存活区。
并将存活对象拷贝/转移到一些新的region里面， 具体拷贝到哪里则取决于对象的年龄;
如果达到一定的GC年龄，就会转移/提升到老年代中；否则就会转移到存活区。
本次的存活区则会被加入到下一次年轻代GC/混合模式GC的CSet中。

## Mixed Garbage Collections

Upon successful completion of a concurrent marking cycle, the G1 GC switches from performing young garbage collections to performing mixed garbage collections. In a mixed garbage collection, the G1 GC optionally adds some old regions to the set of eden and survivor regions that will be collected. The exact number of old regions added is controlled by a number of flags that will be discussed later (see "Taming Mixed GCs"). After the G1 GC collects a sufficient number of old regions (over multiple mixed garbage collections), G1 reverts to performing young garbage collections until the next marking cycle completes.

## 3. 混合模式的垃圾收集

并发标记周期执行完毕之后，G1则会从纯年轻模式切换到混合模式。
在执行混合模式的垃圾收集时，G1会选择一部分老年代region加入回收集，当然，每次的回收集都包括所有eden区和存活区。
具体一次添加多少个老年代region，由哪些参数来决定，将会在后面进行讨论。
经过多次混合模式的垃圾收集之后，很多老年代region其实已经处理过了，然后G1又切换回纯年轻代模式，直到下一次的并发标记周期完成。

## Phases of the Marking Cycle

The marking cycle has the following phases:

- `Initial mark phase`: The G1 GC marks the roots during this phase. This phase is piggybacked on a normal (STW) young garbage collection.
- `Root region scanning phase`: The G1 GC scans survivor regions of the initial mark for references to the old generation and marks the referenced objects. This phase runs concurrently with the application (not STW) and must complete before the next STW young garbage collection can start.
- `Concurrent marking phase`: The G1 GC finds reachable (live) objects across the entire heap. This phase happens concurrently with the application, and can be interrupted by STW young garbage collections.
- `Remark phase`: This phase is STW collection and helps the completion of the marking cycle. G1 GC drains SATB buffers, traces unvisited live objects, and performs reference processing.
- `Cleanup phase`: In this final phase, the G1 GC performs the STW operations of accounting and RSet scrubbing. During accounting, the G1 GC identifies completely free regions and mixed garbage collection candidates. The cleanup phase is partly concurrent when it resets and returns the empty regions to the free list.

## 4. 标记周期的各个阶段

G1的标记周期包括以下这些阶段：

- 【初始标记阶段】(`Initial mark phase`)： 在此阶段标记 GC roots, 一般是附加在某次常规的年轻代GC中顺带着执行。
- 【扫描GC根所在的region】(`Root region scanning phase`)： 根据初始标记阶段确定的GC根元素，扫描这些元素所在region，获取对老年代的引用，并标记被引用的对象。 该阶段与应用线程并发执行，也就是说没有STW停顿，必须在下一次年轻代GC开始之前完成。
- 【并发标记阶段】(`Concurrent marking phase`)”： 遍历整个堆，查找所有可达的存活对象。 此阶段与应用线程并发执行， 也允许被年轻代GC打断。
- 【再次标记阶段】(`Remark phase`)： 此阶段有一次STW暂停，以完成标记周期。 G1会清空SATB缓冲区，跟踪未访问到的存活对象，并进行引用处理。
- 【清理阶段】(`Cleanup phase`)： 这是最后的子阶段，G1在执行统计和清理RSet时会有一次STW停顿。 在统计过程中，会把完全空闲的region标记出来，也会标记出适合于进行混合模式GC的候选region。 清理阶段有一部分是并发执行的，比如在重置空闲region并将其加入空闲列表时。

## Important Defaults

The G1 GC is an adaptive garbage collector with defaults that enable it to work efficiently without modification. Here is a list of important options and their default values. This list applies to the latest Java HotSpot VM, build 24. You can adapt and tune the G1 GC to your application performance needs by entering the following options with changed settings on the JVM command line.

## 5. 常用参数与默认值

G1是一款自适应垃圾收集器，大部分的参数都有默认值，一般情况下无需太多配置即可高效运行。
下面列出常用参数和对应的默认值,  如果有特殊需求，可调整JVM启动参数，以满足特定的性能指标。

#### `-XX:G1HeapRegionSize=n`

Sets the size of a G1 region. The value will be a power of two and can range from 1MB to 32MB. The goal is to have around 2048 regions based on the minimum Java heap size.

用来设置G1 region 的大小。 必须是`2的幂`（x次方)，允许的范围是 `1MB` 至 `32MB`。
这个参数的默认值, 会根据堆内存的初始大小动态调整，以便将堆内存切分为2048个左右的region。

#### `-XX:MaxGCPauseMillis=200`

Sets a target value for desired maximum pause time. The default value is 200 milliseconds. The specified value does not adapt to your heap size.

期望的最大暂停时间。 默认值为200毫秒。 这个值不会自动调整，启动时设置为多少就是多少。

#### `-XX:G1NewSizePercent=5`

Sets the percentage of the heap to use as the minimum for the young generation size. The default value is 5 percent of your Java heap. This is an experimental flag. See "How to unlock experimental VM flags" for an example. This setting replaces the `-XX:DefaultMinNewGenPercent` setting. This setting is not available in Java HotSpot VM, build 23.

设置年轻代的最小空间占比, 默认值为`5`，相当于最少有5%的堆内存会作为年轻代来使用。
这个参数会覆盖 `-XX:DefaultMinNewGenPercent`。
这是实验性质的参数，后续版本有可能会有变更。  


#### `-XX:G1MaxNewSizePercent=60`

Sets the percentage of the heap size to use as the maximum for young generation size. The default value is 60 percent of your Java heap. This is an experimental flag. See "How to unlock experimental VM flags" for an example. This setting replaces the `-XX:DefaultMaxNewGenPercent` setting. This setting is not available in Java HotSpot VM, build 23.


设置年轻代的最大空间占比。 默认值为`60`，相当于最多有60%的堆内存会作为年轻代来使用。
此设置会覆盖 `-XX:DefaultMaxNewGenPercent`。
这是实验性质的参数，后续版本有可能会有变更。  


#### `-XX:ParallelGCThreads=n`

Sets the value of the STW worker threads. Sets the value of n to the number of logical processors. The value of n is the same as the number of logical processors up to a value of 8.

If there are more than eight logical processors, sets the value of n to approximately 5/8 of the logical processors. This works in most cases except for larger SPARC systems where the value of n can be approximately 5/16 of the logical processors.

设置STW阶段的并行worker线程数。

- 如果逻辑处理器小于等于8个，则默认 `n` 等于逻辑处理器的数量。
- 如果逻辑处理器大于8个，则 `n` 默认约等于处理器数量的`5/8`。
- 如果是高配置的 SPARC 系统，则默认 `n` 大约等于逻辑处理器数量的`5/16`。


具体请参考: [JVM调优系列: 默认GC线程数的计算公式](../../tiemao_2022/03_gc_thread_count/README.md)

大多数情况下使用默认值即可。 有一种情况除外，就是Docker容器中使用了低版本JDK，案例参考:  [JVM 问题排查分析下篇（案例实战）](https://gitbook.cn/gitchat/column/5de76cc38d374b7721a15cec/topic/5df0bfb644f0aa237c287870)。



#### `-XX:ConcGCThreads=n`

Sets the number of parallel marking threads. Sets n to approximately 1/4 of the number of parallel garbage collection threads (`ParallelGCThreads`).

设置并发标记的GC线程数。 默认值约等于 `ParallelGCThreads` 值的 `1/4`。

具体请参考: [JVM调优系列: 默认GC线程数的计算公式](../../tiemao_2022/03_gc_thread_count/README.md)


#### `-XX:InitiatingHeapOccupancyPercent=45`

Sets the Java heap occupancy threshold that triggers a marking cycle. The default occupancy is 45 percent of the entire Java heap.

设置标记周期的触发阈值, 即Java堆内存使用率的百分比。 默认的触发阈值是整个Java堆的`45％`。

#### `-XX:G1MixedGCLiveThresholdPercent=65`

Sets the occupancy threshold for an old region to be included in a mixed garbage collection cycle. The default occupancy is 65 percent. This is an experimental flag. See "How to unlock experimental VM flags" for an example. This setting replaces the `-XX:G1OldCSetRegionLiveThresholdPercent` setting. This setting is not available in Java HotSpot VM, build 23.

执行混合模式GC时，根据老年代region的使用率，确定是否包含到回收集之中。 阈值默认为`65％`。
此设置会覆盖 `-XX:G1OldCSetRegionLiveThresholdPercent`。
这是实验性质的参数，后续版本有可能会有变更。

#### `-XX:G1HeapWastePercent=10`

Sets the percentage of heap that you are willing to waste. The Java HotSpot VM does not initiate the mixed garbage collection cycle when the reclaimable percentage is less than the heap waste percentage. The default is 10 percent. This setting is not available in Java HotSpot VM, build 23.

设置可以容忍的堆内存浪费率百分比。
如果可回收的堆内存占比小于这个阈值比例，则 HotSpot 不会启动混合模式GC。
默认值为`10％`。

#### `-XX:G1MixedGCCountTarget=8`

Sets the target number of mixed garbage collections after a marking cycle to collect old regions with at most `G1MixedGCLiveThresholdPercent` live data. The default is 8 mixed garbage collections. The goal for mixed collections is to be within this target number. This setting is not available in Java HotSpot VM, build 23.

在标记周期完成后，期望执行多少次混合模式的GC，直到存活数据的比例降到 `G1MixedGCLiveThresholdPercent` 之下。
默认是执行8次混合模式的GC。 具体执行的次数一般都会小于这个值。

#### `-XX:G1OldCSetRegionThresholdPercent=10`

Sets an upper limit on the number of old regions to be collected during a mixed garbage collection cycle. The default is 10 percent of the Java heap. This setting is not available in Java HotSpot VM, build 23.

混合模式的GC中，每次处理的老年代 region 数量上限占比。 默认值为Java堆的`10％`。

#### `-XX:G1ReservePercent=10`

Sets the percentage of reserve memory to keep free so as to reduce the risk of to-space overflows. The default is 10 percent. When you increase or decrease the percentage, make sure to adjust the total Java heap by the same amount. This setting is not available in Java HotSpot VM, build 23.

设置一定比例的保留空间, 让其保持空闲状态，降低 `to空间` 内存不足的风险。 默认值为 `10％`。
虽然这是一个百分比，但实际会映射为具体的大小，所以当增加或减少百分比时，最好将Java堆的总大小也进行同样大小的调整。

## How to Unlock Experimental VM Flags

To change the value of experimental flags, you must unlock them first. You can do this by setting `-XX:+UnlockExperimentalVMOptions` explicitly on the command line before any experimental flags. For example:

## 6. 如何解锁实验性质的JVM参数

要修改实验性质的JVM参数值，必须先进行声明。
我们可以在命令行参数中，设置实验性质的参数之前，明确指定 `-XX:+UnlockExperimentalVMOptions`。 例如：

```
java -XX:+UnlockExperimentalVMOptions -XX:G1NewSizePercent=10 -XX:G1MaxNewSizePercent=75 G1test.jar
```

## Recommendations

When you evaluate and fine-tune G1 GC, keep the following recommendations in mind:

- `Young Generation Size`: Avoid explicitly setting young generation size with the `-Xmn` option or any or other related option such as `-XX:NewRatio`. Fixing the size of the young generation overrides the target pause-time goal.

- `Pause Time Goals`: When you evaluate or tune any garbage collection, there is always a latency versus throughput trade-off. The G1 GC is an incremental garbage collector with uniform pauses, but also more overhead on the application threads. The throughput goal for the G1 GC is 90 percent application time and 10 percent garbage collection time. When you compare this to Java HotSpot VM's throughput collector, the goal there is 99 percent application time and 1 percent garbage collection time. Therefore, when you evaluate the G1 GC for throughput, relax your pause-time target. Setting too aggressive a goal indicates that you are willing to bear an increase in garbage collection overhead, which has a direct impact on throughput. When you evaluate the G1 GC for latency, you set your desired (soft) real-time goal, and the G1 GC will try to meet it. As a side effect, throughput may suffer.

- `Taming Mixed Garbage Collections`: Experiment with the following options when you tune mixed garbage collections. See "Important Defaults" for information about these options:

  * `-XX:InitiatingHeapOccupancyPercent`
    For changing the marking threshold.
  * `-XX:G1MixedGCLiveThresholdPercent` and `-XX:G1HeapWastePercent`
    When you want to change the mixed garbage collections decisions.
  * `-XX:G1MixedGCCountTarget` and `-XX:G1OldCSetRegionThresholdPercent`
    When you want to adjust the CSet for old regions.


## 7. 最佳实践与建议

调整G1参数之前，需要记住以下几点：

- `禁止设置年轻代的大小`: 不要使用 `-Xmn`、`-XX:NewRatio` 之类的选项来指定年轻代的大小。 如果指定固定的年轻代大小，则会覆盖最大暂停时间目标，可以说得不偿失。
- `期望的最大暂停时间值`:  不管对哪一款垃圾收集器进行调优，都需要在延迟与吞吐量指标之间进行权衡。 G1是一款具有统一暂停时间的增量式垃圾收集器， 所以对CPU资源的开销相对要大一些。 G1的吞吐量目标，是指在 **高负载** 场景下，确保应用线程占有90％以上的CPU时间，GC线程的开销保持在10％以下。 相比之下，HotSpot中自带的高吞吐量垃圾收集器可以优化到 99％ 的应用线程时间, 也就是说只有不到1％的GC开销。 因此，在压测G1的吞吐量指标时，需要放宽暂停时间指标。 如果设定的暂停时间目标值太小，就表示你愿意承担较大的GC开销，但这会影响到吞吐量。 在压测 G1 的延迟指标时，可以设置期望的软实时暂停时间指标，G1会尽力达成此目标。 副作用则是吞吐量会受到影响。
- 对大部分服务端应用程序来说，CPU负载不会超过50%，即使GC多占了一点CPU也影响不大，因为还有很多冗余, 我们更关注的是GC暂停时间，因为这关系到最大响应延迟。
- `混合模式的GC`: 在调优混合模式的GC时，可以尝试以下选项。 这些选项的详细信息请参考前面的小节：
  * `-XX:InitiatingHeapOccupancyPercent`: 设置标记周期的触发阈值。
  * `-XX:G1MixedGCLiveThresholdPercent` 和 `-XX:G1HeapWastePercent`: 调整混合模式GC相关的策略。
  * `-XX:G1MixedGCCountTarget` 和 `-XX:G1OldCSetRegionThresholdPercent` 用于优化调整CSet中的老年代region比例。



## Overflow and Exhausted Log Messages

When you see to-space overflow/exhausted messages in your logs, the G1 GC does not have enough memory for either survivor or promoted objects, or for both. The Java heap cannot expand since it is already at its max. Example messages:

## 8. GC日志中内存溢出和内存耗尽的信息

如果我们在GC日志中看到 `to-space overflow/exhausted`， 则表明G1没有足够的内存来存放存活区或者需要提升的对象，或者两者都不足。 这时候Java堆内存一般都已达到最大值，无法自动扩容。 示例如下：

```
924.897: [GC pause (G1 Evacuation Pause) (mixed) (to-space exhausted), 0.1957310 secs]
```

OR

或者是这样:

```
924.897: [GC pause (G1 Evacuation Pause) (mixed) (to-space overflow), 0.1957310 secs]
```

To alleviate the problem, try the following adjustments:

Increase the value of the `-XX:G1ReservePercent` option (and the total heap accordingly) to increase the amount of reserve memory for "to-space".

Start the marking cycle earlier by reducing the `-XX:InitiatingHeapOccupancyPercent`.

You can also increase the value of the `-XX:ConcGCThreads` option to increase the number of parallel marking threads.

See "Important Defaults" for a description of these options.

要解决此类问题，可以尝试进行以下调整：

- 加大 `-XX:G1ReservePercent` 选项的值, 以增加保留的 "to-space" 大小，一般来说，堆内存的总大小也需要相应地加大。
- 降低 `-XX:InitiatingHeapOccupancyPercent` 来尽早触发标记周期。
- 适当加大 `-XX:ConcGCThreads` 选项的值，增加并发标记的线程数。

这些选项的具体信息，请参考前面的描述。

## Humongous Objects and Humongous Allocations

For G1 GC, any object that is more than half a region size is considered a "Humongous object". Such an object is allocated directly in the old generation into "Humongous regions". These Humongous regions are a contiguous set of regions. `StartsHumongous` marks the start of the contiguous set and `ContinuesHumongous` marks the continuation of the set.

Before allocating any Humongous region, the marking threshold is checked, initiating a concurrent cycle, if necessary.

Dead Humongous objects are freed at the end of the marking cycle during the cleanup phase also during a full garbage collection cycle.

In-order to reduce copying overhead, the Humongous objects are not included in any evacuation pause. A full garbage collection cycle compacts Humongous objects in place.

Since each individual set of StartsHumongous and ContinuesHumongous regions contains just one humongous object, the space between the end of the humongous object and the end of the last region spanned by the object is unused. For objects that are just slightly larger than a multiple of the heap region size, this unused space can cause the heap to become fragmented.

If you see back-to-back concurrent cycles initiated due to Humongous allocations and if such allocations are fragmenting your old generation, please increase your `-XX:G1HeapRegionSize` such that previous Humongous objects are no longer Humongous and will follow the regular allocation path.

## 9. 大对象/巨型对象的内存分配

如果某个对象超过单个 region 空间的一半，则会被G1视为 【大对象/巨型对象】（Humongous object）。 例如一个很大的数组或者`String`。
这样的对象会直接分配到老年代的 “大对象region区（Humongous region）”。  一个大对象region区就是一组虚拟地址空间连续的region。 `StartsHumongous` 标志着开头的region，而 `ContinuesHumongous` 则标记随后的region集合。

在分配大对象region区之前，G1会先判断是否达到开启标记周期的阈值，在必要时会启动并发标记周期。

在标记周期最后的清理阶段，以及FullGC的清理过程中，都会释放不再使用的巨型对象。

为了减少内存复制的开销，所有转移暂停GC都不进行巨型对象的压缩和整理。 Full GC 时才会将巨型对象整理到位。

由于每个 StartsHumongous 和 ContinuesHumongous 组成的集合中都只保存一个巨型对象， 因此这个组合内部，最后面的空间总有一部分是浪费的。
如果某个对象占用的空间，只比N个region大上那么一点点，那么未使用的那部分空间实际上就产生了内存碎片。

如果在GC日志中，看到由 Humongous 分配而触发的大量并发周期，而且在老年代中形成了大量的内存碎片，就需要加大 `-XX:G1HeapRegionSize` 的值，让之前的巨型对象不再被当成巨无霸，而是走常规的对象分配方式【只要其小于region的50%即可】。

## Conclusion

G1 GC is a regionalized, parallel-concurrent, incremental garbage collector that provides more predictable pauses compared to other HotSpot GCs. The incremental nature lets G1 GC work with larger heaps and still provide reasonable worst-case response times. The adaptive nature of G1 GC just needs a maximum soft-real time pause-time goal along-with the desired maximum and minimum size for the Java heap on the JVM command line.

## 10. 总结

G1是一款 【并行+并发】 方式的【增量】垃圾收集器，将堆内存划分为很多个region，与其他 GC 算法实现相比，提供了可预测性更精准的暂停时间。
增量特性使得G1可以处理更大的堆内存空间，在最坏情况下依然保持合理的响应时间。

G1具有自适应特性，一般情况下，只需要设置3个调优参数即可:

- 期望的最大暂停时间, 例如 `-XX:MaxGCPauseMillis=50`
- 堆内存的最大值, 例如 `-Xmx4g`
- 堆内存的最小值, 例如 `-Xms4g`


## About the Author

Monica Beckwith, Principal Member of Technical Staff at Oracle, is the performance lead for the Java HotSpot VM's Garbage First Garbage Collector. She has worked in the performance and architecture industry for over 10 years. Prior to Oracle and Sun Microsystems, Monica lead the performance effort at Spansion Inc. Monica has worked with many industry standard Java based benchmarks with a constant goal of finding opportunities for improvement in the Java HotSpot VM.

## 作者简介

Monica Beckwith, Oracle技术工作组的核心成员，是Java HotSpot VM 项目下, Garbage First Garbage Collector 的性能负责人。
在性能和架构领域具有10年以上的工作经验。
在Oracle和Sun Microsystems之前的工作，Monica 负责 Spansion Inc.的性能调优工作。
Monica与许多基于Java的性能测试标准进行了合作， 致力于探寻 Java HotSpot VM 的性能改进。


## 相关资源和链接

- [G1生产环境参数调优-EN](https://www.oracle.com/technical-resources/articles/java/g1gc.html)

- [垃圾优先型垃圾回收器调优-官方的机器翻译中文版](https://www.oracle.com/cn/technical-resources/articles/java/g1gc.html)

- [G1垃圾收集器调优-英文版](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/g1_gc_tuning.html)

- [JavaSE官方文档目录-英文版](https://docs.oracle.com/en/java/javase/index.html)

- [G1特性简介-英文版](https://www.oracle.com/technetwork/java/javase/tech/g1-intro-jsp-135488.html)

- [HotSpot垃圾收集器简介-英文版](https://www.oracle.com/technetwork/java/javase/tech/index-jsp-140228.html)

- [Java Hotspot G1 GC的一些关键技术](https://tech.meituan.com/2016/09/23/g1.html)

- [Understanding G1 GC Logs](https://blogs.oracle.com/poonam/understanding-g1-gc-logs)

- [Facebook: I Love Java](https://www.facebook.com/ilovejava)

- [Twitter: Java](https://twitter.com/java)

- [Java Blog](https://blogs.oracle.com/java/)
