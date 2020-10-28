# JDK 16: What’s coming in Java 16

> Due March 2021, the next Java upgrade targets a new metaspace memory allocator, support for C++ 14 language features in JDK source code, and a vector API

# JDK 16新特性抢先看

> JDK16预计发布时间为 2021年3月; 支持新的 Metaspace 内存分配管理器; 新版本的JDK源码兼容C++ 14的语言特性; 新增 vector API;

Although not due to arrive until March 2021, Java Development Kit (JDK) 16 has begun to take shape, with proposed features including concurrent thread-stack processing for garbage collection, support for C++ 14 language features, and an “elastic metaspace” capability to more quickly return unused class metadata memory to the OS.

JDK 16 will be the reference implementation of the version of standard Java set to follow JDK 15, which arrived September 15. The six-month release cadence for standard Java would have JDK 16 arriving next March.

As of October 8, eight proposals officially target JDK 16. The new capabilities coming to Java 16 include:

JDK16虽然要到【2021年3月】才会发布，但已初具规模，预计的功能特性包括: 使用并发线程栈来处理ZGC; 兼容C++ 14语言特性; 弹性Metaspace, 以更快地将不使用的metadata内存返还给操作系统。

JDK15已经在【2020年9月15日】发布GA版本, JDK 16是标准Java下一版本的参考实现，根据现在六个月一次的发行节奏，JDK 16将在明年3月发行。

| 预计时间     | 里程碑         |
| ----------- | ------------- |
| 2020-12-10  | 一期快速赶工完成（从主线fork） |
| 2021-01-14  | 二期快速赶工完成 |
| 2021-02-04  | 候选发行版-初始版本 |
| 2021-02-18  | 候选发行版-功能定稿版本 |
| 2021-03-16  | GA版本发布 |


截至10月14日，JDK16已经有 [八项正式的提案](https://openjdk.java.net/projects/jdk/16/)。Java16的新特性包括：


## Moving ZGC (Z Garbage Collector) thread-stack processing from safepoints to a concurrent phase.

> https://openjdk.java.net/jeps/376

Goals of this plan include removing thread-stack processing from ZGC safepoints; making stack processing lazy, cooperative, concurrent, and incremental; removing all other per-thread root processing from ZGC safepoints; and providing a mechanism for other HotSpot VM subsystems to lazily process stacks. ZGC is intended to make GC pauses and scalability issues in HotSpot a thing of the past. So far, GC operations that scale with the size of the heap and the size of metaspace have been moved out of safepoint operations and into concurrent phases. These have included marking, relocation, reference processing, class unloading, and most root processing. The only activities still done in GC safepoints are a subset of root processing and a time-bounded marking termination operation. These roots have included Java thread stacks and other thread roots, with these roots being problematic because they scale with the number of threads. To move beyond the current situation, per-thread processing, including stack scanning, must be moved to a concurrent phase. With this plan, the throughput cost of the improved latency should be insignificant and the time spent inside ZGC safepoints on typical machines should be less than one millisecond.

## An elastic metaspace capability

> https://openjdk.java.net/jeps/387

which returns unused HotSpot VM class metadata (metaspace) memory more promptly to the OS, reduces metaspace footprint and simplifies metaspace code to reduce maintenance costs. Metaspace has had issues with high off-heap memory use. The plan calls for replacing the existing memory allocator with a buddy-based allocation scheme, providing an algorithm to divide memory into partitions to satisfy memory requests. This approach has been used in places such as the Linux kernel and will make it practical to allocate memory in smaller chunks to reduce class-loader overhead. Fragmentation also will be reduced. In addition, the commitment of memory from the OS to memory management arenas will be done lazily, on demand, to reduce the footprint for loaders that start out with large arenas but do not use them immediately or might not use them to their full extent. To fully exploit the elasticity offered by buddy allocation, metaspace memory will be arranged into uniformly sized granules that can be committed and uncommitted independently of each other.

## Enablement of C++ 14 language features

> https://openjdk.java.net/jeps/347

to allow the use of C++ 14 capabilities in JDK C++ source code and give specific guidance about which of these features may be used in HotSpot VM code. Through JDK 15, language features used by C++ code in the JDK have been limited to the C++98/03 language standards. With JDK 11, the source code was updated to support building with newer versions of the C++ standard. This includes being able to build with recent versions of compilers that support C++ 11/14 language features. This proposal does not propose any style or usage changes for C++ code that is used outside of HotSpot. But to take advantage of C++ language features, some build-time changes are required, depending on the platform compiler.

## A vector API in an incubator stage

> https://openjdk.java.net/jeps/338

in which the JDK would be fitted with an incubator module, jdk.incubator.vector, to express vector computations that compile to optimal vector hardware instructions on supported CPU architectures, to achieve superior performance to equivalent scalar computations. The vector API provides a mechanism to write complex vector algorithms in Java, using pre-existing support in the HotSpot VM for vectorization but with a user model that makes vectorization more predictable and robust. Goals of the proposal include providing a clear and concise API to express a range of vector computations, being platform-agnostic by supporting multiple CPU architectures, and offering reliable runtime compilation and performance on x64 and AArch64 architectures. Graceful degradation also is a goal, in which a vector computation would degrade gracefully and still function if it cannot be fully expressed at runtime as a sequence of hardware vector instructions, either because an architecture does not support some instructions or another CPU architecture is not supported.


## Porting the JDK to the Windows/AArch64 platform.

> https://openjdk.java.net/jeps/388

With the release of new server-class and consumer AArch64 (ARM64) hardware, Windows/AArch64 has become an important platform due to demand. While the porting itself is already mostly complete, the focus of this proposal involves integration of the port into the mainline JDK repository.


## Porting of the JDK to Alpine Linux

> https://openjdk.java.net/jeps/386

and to other Linux distributions that use musl as their primary C library, on x64 and AArch64 architectures. Musl is a Linux implementation of the standard library functionality described in the ISO C and Posix standards. Alpine Linux is widely adopted in cloud deployments, microservices, and container environments due to its small image size. A Docker image for Linux is smaller than 6MB. Letting Java run out-of-the-box in such settings will allow Tomcat, Jetty, Spring, and other popular frameworks to work in these environments natively. By using jlink to reduce the size of the Java runtime, a user can create an even smaller image tailored to run a specific application.

## Migration of OpenJDK source code repositories from Mercurial to Git.

> https://openjdk.java.net/jeps/357

Driving this effort are advantages in version control system metadata size and available tools and hosting.

## Migration to GitHub

> https://openjdk.java.net/jeps/369

related to the Mercurial-to-Git migration, with JDK 16 source code repositories to be on the popular code-sharing site. The transition to Git, GitHub, and Skara for the Mercurial JDK and JDK-sandbox was done on September 5 and is open for contributions.  

Early-access builds of JDK 16 for Linux, Windows, and MacOS can be found at jdk.java.net. Like JDK 15, JDK 16 will be a short-term release, supported for six months. JDK 17, due in September 2021, will be a long-term support (LTS) release that will receive several years of support. The current LTS release, JDK 11, was released in September 2018.






> https://www.infoworld.com/article/3569150/jdk-16-whats-coming-in-java-16.html
