# JDK 16: What’s coming in Java 16

> Due March 2021, the next Java upgrade targets a new metaspace memory allocator, support for C++ 14 language features in JDK source code, and a vector API

# JDK16新特性（不断更新中）

> JDK16预定发布时间为 2021年3月16日; 支持新的 Metaspace 内存分配管理器; 新版本的JDK源码兼容C++ 14的语言特性; 新增 vector API;

Although not due to arrive until March 2021, Java Development Kit (JDK) 16 has begun to take shape, with proposed features including concurrent thread-stack processing for garbage collection, support for C++ 14 language features, and an “elastic metaspace” capability to more quickly return unused class metadata memory to the OS.

JDK 16 will be the reference implementation of the version of standard Java set to follow JDK 15, which arrived September 15. The six-month release cadence for standard Java would have JDK 16 arriving next March.

As of October 8, eight proposals officially target JDK 16. The new capabilities coming to Java 16 include:

虽然JDK16要到【2021年3月】才会发布，但项目已初具规模，预定的功能特征有:

- ZGC的并发线程栈优化处理;
- 兼容C++ 14语言特性;
- 弹性 Metaspace，自动扩容缩容, 更早将不用的内存还给操作系统。

JDK15已经在【2020年9月15日】发布GA版本; JDK 16是下一版本的标准Java参考实现，按照六个月一次的发行时间，将在明年3月发行。

| 预计时间     | 里程碑         |
| ----------- | ------------- |
| 2020-12-10  | 一期快速赶工完成（从主线fork） |
| 2021-01-14  | 二期快速赶工完成 |
| 2021-02-04  | 候选发行版-初始版本 |
| 2021-02-18  | 候选发行版-功能定稿版本 |
| 2021-03-16  | GA版本发布 |


截至10月14日，JDK16已经有 [八项正式的提案](https://openjdk.java.net/projects/jdk/16/)。

下面我们来看Java16的新特性。


## Moving ZGC (Z Garbage Collector) thread-stack processing from safepoints to a concurrent phase.

## 将ZGC中安全点内的线程栈处理操作挪到并发阶段执行

> https://openjdk.java.net/jeps/376

Goals of this plan include removing thread-stack processing from ZGC safepoints; making stack processing lazy, cooperative, concurrent, and incremental; removing all other per-thread root processing from ZGC safepoints; and providing a mechanism for other HotSpot VM subsystems to lazily process stacks. ZGC is intended to make GC pauses and scalability issues in HotSpot a thing of the past. So far, GC operations that scale with the size of the heap and the size of metaspace have been moved out of safepoint operations and into concurrent phases. These have included marking, relocation, reference processing, class unloading, and most root processing. The only activities still done in GC safepoints are a subset of root processing and a time-bounded marking termination operation. These roots have included Java thread stacks and other thread roots, with these roots being problematic because they scale with the number of threads. To move beyond the current situation, per-thread processing, including stack scanning, must be moved to a concurrent phase. With this plan, the throughput cost of the improved latency should be insignificant and the time spent inside ZGC safepoints on typical machines should be less than one millisecond.

> GC的安全点状态: 所有业务线程暂停执行，相当于就是GC暂停。

目标是将线程栈的处理从ZGC安全点中移除。 让栈处理变成lazy，协作，并发和增量的方式； 从ZGC安全点中删除所有其他按线程进行处理的根； 并为其他HotSpot VM的子系统提供一种机制来延迟处理栈。

ZGC旨在使HotSpot中的GC暂停和可伸缩性问题成为过去式。
到目前为止，随着堆大小和元空间大小而扩展的GC操作已经从安全点操作中移出，并进入并发阶段。
包括标记（marking），对象迁移（relocation），引用处理，类卸载和大多数根对象的处理。

在GC安全点中，还需要执行的的活动包括: 根处理的子集, 以及有时间限制的标记终止操作。
这些GC根,包括Java线程栈, 以及其他线程根，这些根存在问题，因为它们会随线程数的增加而增加。

为了应对这种状况，必须将每个线程的处理操作移至并发阶段，包括线程栈扫描。

根据这个计划，为了降低延迟而进行的改进，对吞吐量的开销和影响应该微不足道，在大部分服务器上的ZGC安全点内, 需要花费的时间都会小于1毫秒。


## An elastic metaspace capability

## Metaspace弹性空间大小

> https://openjdk.java.net/jeps/387

which returns unused HotSpot VM class metadata (metaspace) memory more promptly to the OS, reduces metaspace footprint and simplifies metaspace code to reduce maintenance costs. Metaspace has had issues with high off-heap memory use. The plan calls for replacing the existing memory allocator with a buddy-based allocation scheme, providing an algorithm to divide memory into partitions to satisfy memory requests. This approach has been used in places such as the Linux kernel and will make it practical to allocate memory in smaller chunks to reduce class-loader overhead. Fragmentation also will be reduced. In addition, the commitment of memory from the OS to memory management arenas will be done lazily, on demand, to reduce the footprint for loaders that start out with large arenas but do not use them immediately or might not use them to their full extent. To fully exploit the elasticity offered by buddy allocation, metaspace memory will be arranged into uniformly sized granules that can be committed and uncommitted independently of each other.

目的是为了将未使用的HotSpot VM class 元数据空间的内存，更快速地返回给操作系统，从而减少元空间的内存占用，并简化元空间代码以降低维护成本。
元空间使用大量堆外内存（off-heap）时会存在问题。该计划要求用基于伙伴的分配方案（buddy-based allocation scheme）替换现有的内存分配器，提供一种将内存划分为多个部分以满足内存请求的算法。这种方法已在Linux内核等地方广泛使用，使得在较小的块中分配内存变得可行，以减少类加载器的开销。
碎片也将减少。
此外，将从操作系统到内存管理区域的内存承诺会按需延迟执行，以减少从大型区域开始但不立即使用它们或可能无法完全使用它们的装载程序的占用空间。
为了充分利用伙伴分配所提供的弹性，将元空间内存排列成大小统一的颗粒，这些颗粒可以彼此独立地进行申请和归还。


## Enablement of C++ 14 language features

## 启用 C++ 14 的语言特性

> https://openjdk.java.net/jeps/347

to allow the use of C++ 14 capabilities in JDK C++ source code and give specific guidance about which of these features may be used in HotSpot VM code. Through JDK 15, language features used by C++ code in the JDK have been limited to the C++98/03 language standards. With JDK 11, the source code was updated to support building with newer versions of the C++ standard. This includes being able to build with recent versions of compilers that support C++ 11/14 language features. This proposal does not propose any style or usage changes for C++ code that is used outside of HotSpot. But to take advantage of C++ language features, some build-time changes are required, depending on the platform compiler.

允许在JDK的源代码中使用C++ 14功能，并提供在HotSpot VM代码中可以使用哪些特性的特定说明文档。
在JDK 15及之前，JDK支持的C++语言特性受限于 C++98/03 版语言标准。
在JDK 11中，源代码已更新，以支持使用更新版本的C++标准进行构建。 包括能够使用支持C++ 11/14语言特性的最新版本的编译器进行构建。
本提案不建议在HotSpot之外使用的C ++代码风格进行修改。 但是要利用C++语言特性的优势，需要进行一些构建时更改，取决于具体平台的编译器。


## A vector API in an incubator stage

## 孵化阶段的向量计算API

> https://openjdk.java.net/jeps/338

in which the JDK would be fitted with an incubator module, `jdk.incubator.vector`, to express vector computations that compile to optimal vector hardware instructions on supported CPU architectures, to achieve superior performance to equivalent scalar computations. The vector API provides a mechanism to write complex vector algorithms in Java, using pre-existing support in the HotSpot VM for vectorization but with a user model that makes vectorization more predictable and robust. Goals of the proposal include providing a clear and concise API to express a range of vector computations, being platform-agnostic by supporting multiple CPU architectures, and offering reliable runtime compilation and performance on x64 and AArch64 architectures. Graceful degradation also is a goal, in which a vector computation would degrade gracefully and still function if it cannot be fully expressed at runtime as a sequence of hardware vector instructions, either because an architecture does not support some instructions or another CPU architecture is not supported.


JDK将配备一个孵化阶段的模块 `jdk.incubator.vector`，以支持向量计算，这些向量计算可在兼容的CPU架构上编译为最佳向量指令，以实现优于等效标量计算的性能。
矢量API提供了一种使用Java编写复杂矢量算法的机制，它使用HotSpot VM中预先存在的支持进行矢量化，但用户模型使矢量化更加可预测且更可靠。
该提案的目标包括：

- 提供一个清晰简洁的API来表达一系列矢量计算，
- 跨平台支持多种CPU架构
- 在x64和AArch64架构上提供可靠的运行时编译和性能。
- 平滑降级也是一个目标，其中矢量计算将适度降级，如果在运行时无法将其完全表达为一系列硬件矢量指令，则该计算仍会正常运行，比如某些CPU平台架构不支持某个指令的话。


## Porting the JDK to the Windows/AArch64 platform.

## 将JDK移植到 Windows/AArch64 平台。

> https://openjdk.java.net/jeps/388

With the release of new server-class and consumer AArch64 (ARM64) hardware, Windows/AArch64 has become an important platform due to demand. While the porting itself is already mostly complete, the focus of this proposal involves integration of the port into the mainline JDK repository.

随着AArch64（ARM64）发布新的服务器级和消费者级别的硬件，Windows/AArch64 已成为一个很重要的平台。 尽管移植基本上已经完成，但该提案的重点是将这种能力集成到JDK代码库的主线中。


## Porting of the JDK to Alpine Linux

## JDK将移植到Alpine等Linux发行版

> https://openjdk.java.net/jeps/386

Alpine Linux is a security-oriented, lightweight Linux distribution based on musl libc and busybox.
Small. Simple. Secure.

and to other Linux distributions that use musl as their primary C library, on x64 and AArch64 architectures. Musl is a Linux implementation of the standard library functionality described in the ISO C and Posix standards. Alpine Linux is widely adopted in cloud deployments, microservices, and container environments due to its small image size. A Docker image for Linux is smaller than 6MB. Letting Java run out-of-the-box in such settings will allow Tomcat, Jetty, Spring, and other popular frameworks to work in these environments natively. By using jlink to reduce the size of the Java runtime, a user can create an even smaller image tailored to run a specific application.


JDK将移植到Alpine Linux，以及在 x64 和 AArch64 架构上，使用musl作为其主要C库的Linux发行版。

Musl是符合 ISO C 和 Posix 标准的Linux标准库实现。

Alpine Linux 是基于 musl libc 和 busybox 的轻量级Linux发行版。 主打安全特性: Small. Simple. Secure.
Alpine Linux的镜像很小，Linux的Docker镜像小于6MB。 在云部署，微服务和容器环境中被广泛采用。

在这样的配置中支持Java开箱即用地运行，将允许Tomcat，Jetty，Spring和其他流行的框架在这些环境中本地运行。
通过使用jlink来减小Java运行时的大小，用户可以创建专门为特定应用程序运行而定制的更小的镜像。


## Migration of OpenJDK source code repositories from Mercurial to Git.

## OpenJDK的版本管理工具将从Mercurial换成Git

> https://openjdk.java.net/jeps/357

Driving this effort are advantages in version control system metadata size and available tools and hosting.

推动这项决策的原因包括:

- Git版本控制系统, 支持更大的元信息。
- 更多工具支持。
- 仓库托管方面也有优势。


## Migration to GitHub

## 源码仓库迁移到GitHub

> https://openjdk.java.net/jeps/369

related to the Mercurial-to-Git migration, with JDK 16 source code repositories to be on the popular code-sharing site. The transition to Git, GitHub, and Skara for the Mercurial JDK and JDK-sandbox was done on September 5 and is open for contributions.

Early-access builds of JDK 16 for Linux, Windows, and MacOS can be found at jdk.java.net. Like JDK 15, JDK 16 will be a short-term release, supported for six months. JDK 17, due in September 2021, will be a long-term support (LTS) release that will receive several years of support. The current LTS release, JDK 11, was released in September 2018.

既然版本管理工具从 Mercurial 换成了Git，JDK 16的源码仓库也将托管到最流行的 GitHub 上。

Mercurial JDK 和 JDK-sandbox 的支持工具 [Skara](https://wiki.openjdk.java.net/display/SKARA/Skara) 已经在9月5日迁移到GitHub上，地址为: [https://github.com/openjdk/skara/](https://github.com/openjdk/skara/)。

Linux，Windows和MacOS平台上的JDK 16的早期预览版可以在 [jdk.java.net](http://jdk.java.net) 查看。

JDK 16与JDK 15一样，都是短期版本，官方仅提供六个月的技术支持。

JDK 17则是下一个长期支持版本（LTS）, 预计于2021年9月发布，官方将提供多年的技术支持。

当前的LTS版本则是2018年9月发布的JDK 11。


## 相关链接

- [JDK16新特性（不断更新中）- GitHub版](https://github.com/cncounter/translation/tree/master/tiemao_2020/40_jdk-16-whats-coming-in-java-16)

- 英文版链接: [https://www.infoworld.com/article/3569150/jdk-16-whats-coming-in-java-16.html](https://www.infoworld.com/article/3569150/jdk-16-whats-coming-in-java-16.html)
