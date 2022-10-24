# perliden的博客

> 网址为: https://www.malloc.se

其中的文章内容如下:

# 1. Hello World!

发表日期: 2020年3月15日

原文链接: https://www.malloc.se/blog/hello-world

内容如下:

Just got this blog up and running, where I intend to primarily write about the development of OpenJDK. I hope to highlight new features and improvements, give some tuning tips, explain what’s going on inside the JVM, etc. Since I’m mostly working on garbage collection (ZGC in particular), that’s likely what most posts will be about.

Stay tuned!

中文意思为:

今天正式上线了这个博客网站, 我准备写一些关于 OpenJDK 开发的事情。 主要包括新功能和升级，并提供一些调优技巧，解释 JVM 内部发生了什么，等等。
由于我主要做的是垃圾收集相关的工作（特别是 ZGC），因此大多数文章都会讨论这些内容。

敬请关注！

# 2. ZGC | 在JDK 14中的新特性

发表日期: 2020年3月23日

原文链接: https://www.malloc.se/blog/zgc-jdk14

内容如下:


![img](https://www.malloc.se/img/openjdk.png)

Like clockwork, [JDK 14](https://openjdk.java.net/projects/jdk/14) was released on March 17, six months after [JDK 13](https://openjdk.java.net/projects/jdk/13). From a [ZGC](https://wiki.openjdk.java.net/display/zgc/Main) point of view, this was a big release since we managed to complete several important milestones and improvements towards making it a fully production ready garbage collector. In total, [more than 80](https://bugs.openjdk.java.net/issues/?filter=34672&jql=labels %3D zgc AND status in (Resolved%2C Closed) AND fixVersion %3D 14 AND resolution !%3D Duplicate) enhancements and bug fixes were committed to ZGC itself. More if you also count “ZGC related” commits done in other parts of HotSpot.

In this post I’ll highlight some of the more important and interesting ZGC enhancements. If you’re using ZGC today, I highly recommend you to upgrade to JDK 14. In short, you’ll get better performance, lower latency, new features, and improved stability. If you’re on JDK 11 or later, upgrading to 14 should be straight forward.

For feedback and questions about ZGC, feel free to post to the [mailing list](https://mail.openjdk.java.net/mailman/listinfo/zgc-dev).


像发条一样, [JDK 14](https://openjdk.java.net/projects/jdk/14) 于2020年3月23日正式发布, 距离 [JDK 13](https://openjdk.java.net/projects/) 发布时间只有6个月。
对于 [ZGC](https://wiki.openjdk.java.net/display/zgc/Main) 来说，这是一个重大更新版本，因为我们成功达成了多个重要的里程碑和改进，使其成为完全可以投入使用的生产环境版本。
总共 [超过80项](https://bugs.openjdk.org/browse/JDK-8236110?filter=34672&jql=labels%20%3D%20zgc%20AND%20status%20in%20(Resolved%2C%20Closed)%20AND%20fixVersion%20%3D%2014%20AND%20resolution%20!%3D%20Duplicate）的增强和错误修复被提交到 ZGC 中。
如果统计在 HotSpot 的其他部分完成的 “ZGC相关” 的提交，则数量更多。

在这篇文章中，我将重点介绍一些重要和有趣的 ZGC 增强功能。 如果您使用 ZGC，我强烈建议升级到 JDK 14版本。 总之，您将获得更好的性能、更低的延迟、新功能、以及更好的稳定性。 如果您使用的是 JDK 11 或更高版本，升级到 14 应该很简单。

有关 ZGC 的反馈和问题，请随时发送给 [zgc-dev邮件列表](https://mail.openjdk.java.net/mailman/listinfo/zgc-dev)。


## 2.1 支持Windows 和 macOS 操作系统

[JEP 365](http://openjdk.java.net/jeps/365) and [JEP 364](http://openjdk.java.net/jeps/364) brought Windows and macOS support to ZGC. Support for these platforms has perhaps been the most common feature request we received. All commonly used platforms are now supported, and the complete list looks like this.


[JEP 365](http://openjdk.java.net/jeps/365) 和 [JEP 364](http://openjdk.java.net/jeps/364) 为 ZGC 带来了 Windows 和 macOS 支持。 对这些平台的支持可能是我们收到的最常见的功能请求。 JDK11支持的所有平台列表如下所示。

- **Linux/x86_64** (since JDK 11)
- **Linux/aarch64** (since JDK 13)
- **Windows** (since JDK 14)
- **macOS** (since JDK 14)

For the record, at one point ZGC also had [Solaris/SPARC](https://github.com/openjdk/zgc/commit/5cf01ce95b3ade3710c578b473edfe0404128e9e) support. It was never upstreamed to mainline because we saw early signs of [JEP 362: Deprecate the Solaris and SPARC Ports](http://openjdk.java.net/jeps/362) on the horizon.

Windows users should note that ZGC requires **Windows version 1803** (i.e. Windows 10 or Windows Server 2019) or later. The reason is that earlier versions of Windows lack the memory management API used by ZGC to do heap multi-mapping.

Is adding support for a new OS hard? Does it require a lot of work? Nah, not really. The part of ZGC that has OS-specific code is the part that does memory multi-mapping, i.e. mapping the same physical memory into more than one location in the process address space. So, it all comes down to what memory management API the OS offers, and how easy it is to work with. macOS is by far the most flexible in this regard, with its wonderful `mach_vm_remap()` system call (nope, Linux’s `mremap()` is not as wonderful). The macOS-specific code weighs in at about [300 lines of code](https://github.com/openjdk/jdk/tree/74f0ef505094761c0eb16a7f3fe09b62d335369d/src/hotspot/os/bsd/gc/z). Windows needed slightly more work, mainly because its memory management API (especially the part dealing with address space reservations using `MEM_{RESERVE,REPLACE,COALESCE}_PLACEHOLDERS`) is not quite as flexible as the POSIX and Mach APIs. Still, it’s not that bad and the Windows-specific code weighs in at just under [1000 lines of code](https://github.com/openjdk/jdk/tree/74f0ef505094761c0eb16a7f3fe09b62d335369d/src/hotspot/os/windows/gc/z). As of this writing, 84% of the ZGC code is platform independent, shared by all operating systems and CPU architectures.


作为记录，ZGC 曾经支持过 [Solaris/SPARC](https://github.com/openjdk/zgc/commit/5cf01ce95b3ade3710c578b473edfe0404128e9e) 架构。  但从未被上传到主线, 因为我们看到了 [JEP 362: Deprecate the Solaris and SPARC Ports](http://openjdk.java.net/jeps/362) 的早期迹象。

Windows 用户请注意，ZGC 需要 **Windows 1803 版本**（即 Windows 10 或 Windows Server 2019）以及更高版本。 原因是 Windows 的早期版本缺少了 ZGC 用来对堆内存做多重映射的内存管理 API。

增加支持新的操作系统很难吗？ 需要做很多工作吗？ 不，并不是很难。 ZGC 中针对具体 OS 的代码, 是执行内存多重映射的部分，即将相同的物理内存映射到进程地址空间中的多个位置。
因此，这一切都归结为操作系统提供的内存管理 API，以及使用它的难易程度。 
macOS 在这方面是迄今为止最灵活的，它具有出色的 `mach_vm_remap()` 系统调用(相对应的，Linux 中的 `mremap()` 则没有那么出色）。 macOS 的特定代码量只有为 [300行](https://github.com/openjdk/jdk/tree/74f0ef505094761c0eb16a7f3fe09b62d335369d/src/hotspot/os/bsd/gc/z)。 
Windows 则需要做更多的工作，主要是因为它的内存管理 API 不如 POSIX 和 Mach API 灵活（尤其是使用 `MEM_{RESERVE,REPLACE,COALESCE}_PLACEHOLDERS` 处理地址空间保留的部分）。尽管如此，它并没有那么糟糕，特定于 Windows 的代码量不到 [1000行](https://github.com/openjdk/jdk/tree/74f0ef505094761c0eb16a7f3fe09b62d335369d/src/hotspot/os/windows/gc/z)。 在撰写本文时，84% 的 ZGC 代码与平台无关，由所有操作系统和 CPU 架构共享。

![ZGC中各个操作系统的代码分布](./code_distribution.svg)


## Parallel heap pre-touching

When using `-XX:+AlwaysPreTouch` you’re telling the GC to touch the heap (up to `-Xms` or `-XX:InitialHeapSize`) at startup. This will ensure that memory pages backing the heap are 1) actually allocated and 2) faulted in. By doing this at startup you avoid taking this cost later when the application is running and starts touching memory. Pre-touching the heap can be a sensible choice for some applications, but as always, it’s a trade-off since the startup time will be prolonged.

Prior to JDK 14, ZGC only used a single thread to do heap pre-touching. This meant that pre-touching could take a long time if the heap was huge. Now, ZGC uses multiple threads to do this work, which shortens the startup/pre-touch time substantially. On large machines with terabytes of memory, this reduction can translate into startup times on the order of **seconds instead of minutes**.

## 2.2 并行执行堆内存预取操作(heap pre-touching)

当指定JVM启动参数 `-XX:+AlwaysPreTouch` 时，是告诉 GC 要在JVM启动时获取堆内存（一直获取到 `-Xms` 或 `-XX:InitialHeapSize` ）。 
这将确保堆内存相关的页面:

- 1) 实际得到分配
- 2) 不够的话就立即失败。

通过在启动时执行此操作，可以避免应用程序在之后的运行过程中才分配物理内存并造成性能抖动。 
对于某些应用程序来说，预先获取堆内存可能是一个明智的选择，但与往常一样，这也是一种权衡，因为启动时间会延长。

在 JDK 14 之前，ZGC 只使用单个线程来做堆预触。  如果堆内存很大，预触可能需要很长时间。 
现在，ZGC 使用多线程来完成这项工作，大大缩短了启动/预触时间。 
在具有 TB 级内存的大型机器上，这种方式可以将启动时间缩短到 **秒级,而不是分钟级** 。

测试示例:

> `java -XX:+AlwaysPreTouch -version`

## Tiny heaps

ZGC has always been awesome at scaling up to very large heaps, but not so awesome at scaling down to tiny heaps. Prior to JDK 14, using heaps smaller than 128M was not always a great experience. The main reason was that ZGC’s heap reserve became too large in proportion to the available heap, which sometimes resulted in an early `OutOfMemoryError`.

The heap reserve is a portion of the heap that is set aside to cope with “emergency situations”, like when ZGC needs to compact the heap when it’s already full. The size of the heap reserve is calculated as follows.

```
heap_reserve = (number_of_gc_worker_threads * 2M) + 32M
```

In short, the reserve is sized so that there’s enough room for each GC worker to allocate a private *small* ZPage (2M), and for all GC workers to share a single global *medium* ZPage (32M).

As we can see, the reserve can become proportionally large when the heap is small, leaving little room for the application. To address this, we did not change the principles for how large the heap reserve has to be. Instead we adjusted the inputs to this calculation in the following ways.

1. We made the size of *medium* ZPages dynamic. It used to always be 32M, but it’s now determined at runtime and scaled with the heap size so that a single *medium* ZPage never occupies more than 3% of the heap. For really small heaps, this means *medium* ZPages will effectively be disabled, and objects that would normally be allocated in a *medium* ZPage will now instead be allocated in a *large* ZPage (*large* ZPages don’t need to be covered by the heap reserve since they are never relocated).
2. We scaled the number of GC worker threads we use so that the total number of *small* ZPages needed in the heap reserve will not occupy more than 2% of the heap (but we need room for at least one *small* ZPage, since we always have at least one GC worker thread).

With these adjustments, ZGC scales down to **8M** (and up to **16T**) heaps without problems. The heap reserve is now at most 5% of the heap, but at least one *small* ZPage (2M). To better illustrate the improvement, let’s compare JDK 14 with JDK 13, and see what percentage of the heap is set aside for the reserve.

![img](https://www.malloc.se/img/zgc-jdk14/heap_reserve.svg)

## JFR leak profiler

The JFR leak profiler is a handy tool, but it has until now been disabled when using ZGC. The leak profiler implements its own heap walking logic to find the path from a root to a given object in the object graph. Knowledge about such paths can be very useful when trying to track down memory leaks.

There were two reasons why the leak profiler was incompatible with ZGC.

1. The leak profiler didn’t comply with the rules for accessing object pointers on the heap. When using ZGC, an object pointer that has been loaded from the heap must pass through a load barrier before it can be dereferenced.
2. The leak profiler allocated a native data structure (a mark bitmap), which was proportional to the size of the address space reserved for the heap. Since ZGC is relatively address space hungry, this didn’t scale very well.

Both issues were addressed and the JFR leak profiler now works nicely with ZGC.

## C2 load barrier overhaul

The ZGC load barriers generated by the C2 Just-In-Time compiler have often been the root cause of bugs in ZGC. The way they were implemented sometimes caused bad interactions with some of C2’s optimization passes, resulting in sub-optimal and even broken code.

In JDK 14 we completely overhauled how C2 generates ZGC load barriers. Now, we’re basically staying out of C2’s sight until very late in the compiler pipeline. I won’t go into all the details here, but this basically means we avoid all interactions with optimization passes and we gain a lot more control over the code generation. For example, we can now easily guarantee that a safepoint-poll instruction can’t be scheduled in-between a load instruction and its associated load barrier, something that was previously hard to control and was the source of many bugs.

This overhaul significantly improved ZGC stability. In fact, it was so successful that this change was immediately backported to JDK 13.0.2 (at the time, the release of JDK 14 was still months away).

## Safepoint-aware array allocations

When the JVM executes a Safepoint (aka Stop-The-World) operation it first brings all Java threads to a stop in a controlled manner (Java threads are stopped at “safe points”, where their execution state is known). Once all threads are stopped, it proceeds to execute the actual Safepoint operation (which can be a GC operation, or something else). Since all Java threads remain stopped until the Safepoint operation completes, keeping that operation short is essential for good application response times.

Time-To-Safepoint (TTSP) is the time from when the JVM orders all Java threads to stop until they have stopped. All threads will typically not come to a stop immediately or at the same time. A thread might be in the middle of some sensitive operation that needs to complete before it can reach a safepoint. A long TTSP can be just as bad as a long Safepoint operation, since it will prolong the time some of the threads are stopped. Again, this will have a negative impact on application response times.

![img](https://www.malloc.se/img/zgc-jdk14/ttsp.svg)

Ok, that was a quick introdution to Safepoint and Time-To-Safepoint. Now, when the application asks the JVM to allocate an object, the JVM will not only allocate the object on the heap somewhere, it will also make sure the object’s fields are zero initialized. During zero initialization, the JVM is in a sensitive state where it has a half-baked object on the heap. The Java thread allocating this object is not allowed to stop at a safepoint until zero initialization has completed. If it were to stop at a safepoint, a GC cycle could potentially start and the GC would quickly stumble over an object with random data in it, resulting in a JVM crash.

So, Safepoint operations are effectively blocked/delayed during object allocation and initialization, which directly impacts TTSP negatively. This is not an problem when allocating normal/small objects. However, is it a problem when allocating large arrays (remember, the largest Java array can be 16GB in size), where the time it takes to zero initialize all array elements can be substantial, like several hundred milliseconds (or more if you’re unlucky).

To avoid this type of latency issue, we’ve implemented safepoint-aware array allocations in ZGC. This means that Java threads *can* come to a safepoint during zero initialization, without the risks mentioned above, and without impacting TTSP. Under the hood, ZGC will track these half-baked objects using a special root-set, internally called “invisible roots”. Array objects pointed to by invisible roots are treated differently in two ways.

1. They are invisible to the Java application. Not discoverable through JVMTI, etc.
2. During marking, array elements containing object references are not examined/followed, since they are known to not point to any other object that needs to be kept alive.

In summary, with ZGC you can now allocate arrays of any size, without worrying about TTSP-related latency issues. ZGC is at this time the only garbage collector in HotSpot to offer this feature.

## Constrained environments

ZGC is relatively address space hungry. It uses address space to immunize itself against external heap fragmentation and thereby avoid running into situations where it has to compact the heap to find a hole big enough for an allocation. This is one of the reasons why ZGC handles large allocations so well. Reserving large parts of the process address space is essentially free of charge. There’s no physical memory backing that space, it’s just a reservation. Of course, the kernel needs a tiny bit of memory to keep track of the reservation, but we can safely ignore that in this context.

ZGC used to reserve a lot of address space (many terabytes), even when the heap was small. This was not only superfluous, it was also problematic in environments where the address space available to the JVM had been constrained. For example, when running in a small/constrained container or when the address space had been limited using `ulimit -v`.

Starting with JDK 14, ZGC will detect that it’s running in a constrained environment and automatically adjust the amount of address space it uses to stay well within the limits. As a result, using ZGC in address space constrained environments is now a smoother experience.

## Discontiguous address space

Prior to JDK 14, HotSpot required the Java heap to be placed in a contiguous address space. This had both pros and cons. Some fairly common operations, like figuring out if a pointer is pointing into the heap became an easy and efficient operation. You just need to compare the pointer with the start and the end address of the heap. On the other hand, sometimes the GC wants to place the heap in a specific address range (like when using compressed or colored oops). This could become problematic if, say, some part in the middle of the desired range was already occupied. For example, because of [address space layout randomization](https://en.wikipedia.org/wiki/Address_space_layout_randomization), or because a custom Java launcher might have mapped memory in that range.

In JDK 14 we modified HotSpot to support Java heaps with a discontiguous address space. ZGC takes advantage of this by splitting the Java heap into two or more address spaces, should address space conflicts arise.

## On the horizon

![img](https://www.malloc.se/img/scientist-duke.jpg)

I’ll end this post with a quick glimpse into the future. Work on [JDK 15](https://openjdk.java.net/projects/jdk/15) has been going on for a few months already (the [JDK 14](https://openjdk.java.net/projects/jdk/14) feature-set was frozen already back in December when that release entered *Rampdown Phase One* and forked from mainline) and we have some exciting things in the pipeline.

- [JEP 377: ZGC: A Scalable Low-Latency Garbage Collector (Production)](https://openjdk.java.net/jeps/377), which will remove ZGC’s experimental status.
- [JEP 376: ZGC: Concurrent Thread-Stack Processing](https://openjdk.java.net/jeps/376), which will be a major step towards *sub-millisecond max pause times*.
- [JDK-8233300: Safepoint-aware array copy](https://bugs.openjdk.java.net/browse/JDK-8233300), which will solve a similar problem as “Safepoint-aware array allocations” above, but when copying large arrays.

*I should stress that, as of this writing, these JEPs and enhancements have not yet been targeted to a release. We hope they make it into JDK 15, but we don’t know that yet.*

More about these and other enhancements in a future post.
