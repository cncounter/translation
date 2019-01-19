# JVM performance optimization, Part 1: A JVM technology primer

# JVM性能优化系列-(1): JVM入门简介

> Java performance for absolute beginners

> 写给初学者的Java性能调优指南 - By: Eva Andreasson

Java applications run on the JVM, but what do you know about JVM technology? This article, the first in a series, is an overview of how a classic Java virtual machine works such as pros and cons of Java's write-once, run-anywhere engine, garbage collection basics, and a sampling of common GC algorithms and compiler optimizations. Later articles will turn to JVM performance optimization, including newer JVM designs to support the performance and scalability of today's highly concurrent Java applications.

Java程序在JVM上运行, 但你真的了解JVM么? 

本文对Java虚拟机进行整体的讲解, 以及这些技术对应的优缺点. 包括: 

- 支持 “一次编写,到处运行” 的JVM引擎;
- 垃圾收集的基础知识;
- 通用GC算法;
- 编译器优化.

后面的小节, 将介绍如何进行JVM性能调优, 以及新版本JVM的特性, 对高并发,扩容支持等方面的提升。

If you are a programmer then you have undoubtedly experienced that special feeling when a light goes on in your thought process, when those neurons finally make a connection, and you open your previous thought pattern to a new perspective. I personally love that feeling of learning something new. I've had those moments many times in my work with Java virtual machine (JVM) technologies, particularly to do with garbage collection and JVM performance optimization. In this new JavaWorld series I hope to share some of that illumination with you. Hopefully you'll be as excited to learn about JVM performance as I am to write about it!

作为码农, 肯定会有些时刻灵光一闪，思维和知识体系就串联起来，获得许多认知，当然前提是你已经在这个行业积累了相当量的经验和素材。我喜欢学习新知识，享受学习的过程. 在工作中一直和JVM打交道，特别是天天面对GC问题、性能调优问题，在我脑海里有很多想要分享的有价值的Idea, 所以我会尽可能将这些东西写下来，也希望读者能有一些收获与灵感!

This series is written for any Java developer interested in learning more about the underlying layers of the JVM and what a JVM really does. At a high level, I will discuss garbage collection and the never-ending quest to free memory safely and quickly without impacting running applications. You'll learn about the key components of a JVM: garbage collection and GC algorithms, compiler flavors, and some common optimizations. I will also discuss why Java benchmarking is so difficult and offer tips to consider when measuring performance. Finally, I'll touch on some of the newer innovations in JVM and GC technology, including highlights from Azul's Zing JVM, IBM JVM, and Oracle's Garbage First (G1) garbage collector.

本系列文章主要面向的读者，是对JVM底层技术以及JVM工作原理感兴趣的Java开发人员。在较高的层次上，我们将探讨GC相关的问题, 以及如何在不影响程序正在运行的情况, 安全快速地释放内存，当然这是一个永无止境的领域。我会介绍JVM的关键组件: 垃圾收集, 以及GC算法、编译器风格，以及一些常见的优化。还将探讨为何对Java做基准测试是如此的困难，并提供在测量性能时需要考虑的技巧。最后，我将介绍JVM和GC中的一些新技术，包括Azul的Zing JVM、IBM JVM和Oracle的G1垃圾收集器。

I hope you'll walk away from this series with a greater understanding of the factors that limit Java scalability today, as well as how those limitations force us to architect our Java deployments in a non-optimal way. Hopefully, you'll experience some *aha!* moments and be inspired to do something good for Java: stop accepting the limitations and work for change! If you're not already an open source contributor, perhaps this series will encourage you in that direction.

希望你在读完这个系列之后，会对限制Java可伸缩性的因素有一个清晰的认识，以及这些限制是如何迫使我们在设计架构时考虑一些非最优的解. 希望读者能获得一些思维灵感，通过Java将系统做得完美: 打破局限、拥抱发展! 如果你还不是开源贡献者, 也许读完这个系列会让你朝这个方向前进。

## JVM performance and the 'one for all' challenge

## JVM性能与“一次编写,到处运行”面临的挑战

I have news for people who are stuck with the idea that the Java platform is inherently slow. The belief that the JVM is to blame for poor Java performance is decades old -- it started when Java was first being used for enterprise applications, and it's outdated! It *is* true that if you compare the results of running simple static and deterministic tasks on different development platforms, you will most likely see better execution using machine-optimized code over using any virtualized environment, including a JVM. But Java performance has taken major leaps forward over the past 10 years. Market demand and growth in the Java industry have resulted in a handful of garbage-collection algorithms and new compilation innovations, and plenty of heuristics and optimizations have emerged as JVM technology has progressed. I'll introduce some of them later in this series.

曾经很多人的观念是Java平台的性能不行, 但我们可以用数据来打脸, 因为JVM性能很弱是刚出来那几年的事了。
确实，不管什么平台上，编译为静态机器码的程序, 性能总是会比基于虚拟机的要强一点, JVM也不例外。伴随着Java市场越做越大，GC算法和编译方面的创新,以及大量的启发式优化，让JVM技术飞速发展。我们将会在后面的文章进行介绍。

The beauty of JVM technology is also its biggest challenge: nothing can be assumed with a "write once, run anywhere" application. Rather than optimizing for one use case, one application, and one specific user load, the JVM constantly tracks what is going on in a Java application and dynamically optimizes accordingly. This dynamic runtime leads to a dynamic problem set. Developers working on the JVM can't rely on static compilation and predictable allocation rates when designing innovations, at least not if we want performance in production environments!

JVM技术的美好也是其最大的挑战: “一次编写,到处运行”的应用程序很难实现. JVM不是只为一个用例,一个应用, 和特定的用户并发进行优化, 而是不断跟踪一个Java应用程序并且进行动态优化. 这种动态运行时导致了一系列的动态问题. 在JVM上开发的程序，不能依靠静态编译, 也不能预测具体的内存分配率, 至少在生产环境下高并发场景中的性能并不一定如同我们事先的预测!

> ## A career in JVM performance

> ## JVM性能调优-老司机探险记

> Early in my career I realized that garbage collection is hard to "solve," and I've been fascinated with JVMs and middleware technology ever since. My passion for JVMs started when I worked on the [JRockit](http://www.infoworld.com/d/developer-world/oracle-moving-merge-jrockit-hotspot-jvms-448) team, coding a novel approach to a self-learning, self-tuning garbage collection algorithm (see [Resources](https://www.javaworld.com/article/2078623/core-java/core-java-jvm-performance-optimization-part-1-a-jvm-technology-primer.html#resources)). That project, which turned into an experimental feature of JRockit and laid ground for the [Deterministic Garbage Collection](https://www.javaworld.com/article/2078623/core-java/core-java-jvm-performance-optimization-part-1-a-jvm-technology-primer.html#resources) algorithm, started my journey through JVM technology. I've worked for BEA Systems, partnered with Intel and Sun, and was briefly employed by Oracle following its acquisition of BEA Systems. I later joined the team at Azul Systems to manage the [Zing JVM](http://www.infoworld.com/d/developer-world/azul-systems-searches-managed-runtime-breakthroughs-228), and today I work for [Cloudera](http://www.javaworld.com/javaworld/jw-12-2012/121207-cloudera-lands-big-funding-for-big-data.html).

> 在我职业生涯的早期我意识到垃圾收集很难解决,,我一直着迷于jvm和中间件技术.我对jvm的热情开始当我在[JRockit](http://www.infoworld.com/d/developer - world/oracle -移动-合并- jrockit - hotspot jvm - 448)团队,编码一个新颖的方法自学、自调整垃圾收集算法(见【资源】(https://www.javaworld.com/article/2078623/core-java/core-java-jvm-performance-optimization-part-1-a-jvm-technology-primer.html #参考资料)).项目,变成了一个实验性的特点JRockit和铺设地面的确定性的垃圾收集(https://www.javaworld.com/article/2078623/core-java/core-java-jvm-performance-optimization-part-1-a-jvm-technology-primer.html #参考资料)算法,通过JVM技术开始我的行程.我工作了BEA Systems,与英特尔合作和太阳,一度被甲骨文收购BEA Systems.后来我加入了团队在Azul系统管理(活力JVM)(http://www.infoworld.《今日联合国》(I),com/d/developer-world/azul-systems-searches-managed-runtime-breakthroughs-228工作Cloudera][(http://www.javaworld.com/javaworld/jw-12-2012/121207-cloudera-lands-big-funding-for-big-data.html)。

Machine-optimized code might deliver better performance, but it comes at the cost of inflexibility, which is not a workable trade-off for enterprise applications with dynamic loads and rapid feature changes. Most enterprises are willing to sacrifice the narrowly perfect performance of machine-optimized code for the benefits of Java:

Machine-optimized代码可能提供更好的性能,但它是在顽固的成本,这不是一个可行的权衡企业应用程序使用动态加载和快速特性变化.大多数企业愿意牺牲的狭隘的完美表现machine-optimized代码的Java的好处:

> **[Learn Java from beginning concepts to advanced design patterns in this comprehensive 12-part course!](https://pluralsight.pxf.io/c/321564/424552/7490?u=https%3A%2F%2Fwww.pluralsight.com%2Fpaths%2Fjava)**

> * *(从头概念先进学习Java设计模式在这个综合课程正在中央台上映!)(https://pluralsight.pxf.io/c/321564/424552/7490?u=https%3A%2F%2Fwww.pluralsight).com 2Fpaths % 2Fjava %)* *

- Ease of coding and feature development (meaning, faster time to market)
- Access to knowledgeable programmers
- Rapid development using Java APIs and standard libraries
- Portability -- no need to rewrite a Java application for every new platform

- 易于编码和功能开发(意义,更快的上市时间)
- 获得知识的程序员
- 快速开发使用Java api和标准库
- 可移植性——不需要重写Java应用程序的每一个新平台

## From Java code to bytecode

## 从Java代码字节码

As a Java programmer, you are probably familiar with coding, compiling, and executing Java applications. For the sake of example, let's assume that you have a program, `MyApp.java` and you want to run it. To execute this program you need to first compile it with `javac`, the JDK's built-in static Java language-to-bytecode compiler. Based on the Java code, `javac` generates the corresponding executable bytecode and saves it into a same-named class file: `MyApp.class`. After compiling the Java code into bytecode, you are ready to run your application by launching the executable class file with the `java` command from your command-line or startup script, with or without startup options. The class is loaded into the runtime (meaning the running Java virtual machine) and your program starts executing.

作为Java程序员,您可能熟悉编码、编译和执行Java应用程序。的例子,让我们假设您有一个计划,`MyApp.java`你想要运行它。执行这个程序首先需要编译它`javac`,JDK的内置Java language-to-bytecode静态编译器。基于Java的代码,`javac`生成相应的可执行的字节码和将它保存到一个类中同名文件:`MyApp.class`。编译成字节码的Java代码之后,您已经准备好启动运行您的应用程序的可执行的类文件`java`

That's what happens on the surface of an everyday application execution scenario, but now let's explore what *really* happens when you call that `java`command. What is this thing called a *Java virtual machine*? Most developers have interacted with a JVM through the continuous process of tuning -- *aka*selecting and value-assigning startup options to make your Java program run faster, while deftly avoiding the infamous JVM "out of memory" error. But have you ever wondered why we need a JVM to run Java applications in the first place?

这就是表面上的日常应用程序执行场景,但是现在让我们探索*真的*当你所说的`java`命令.这是什么东西叫做* Java虚拟机*?大多数开发人员与JVM通过调优的持续的过程——*又名*选择和value-assigning启动选项,让你的Java程序运行得更快,JVM而巧妙地避免了臭名昭著的“内存溢出”错误。但是你有没有想过为什么我们需要一个JVM中运行的Java应用程序呢?

## What is a Java virtual machine?

## 什么是Java虚拟机?

Simply speaking, a JVM is the software module that executes Java application bytecode and translates the bytecode into hardware- and operating system-specific instructions. By doing so, the JVM enables Java programs to be executed in different environments from where they were first written, without requiring any changes to the original application code. Java's portability is key to its popularity as an enterprise application language: developers don't have to rewrite application code for every platform because the JVM handles the translation and platform-optimization.

简单来说,一个JVM执行Java应用程序的字节码的软件模块,将字节码转换成硬件和操作系统特定的指令.通过这样做,JVM支持Java程序执行在不同的环境中,他们是第一次写,不需要任何更改原来的应用程序代码.Java的可移植性是它的受欢迎程度作为一个企业应用程序语言的关键:开发人员不需要重写应用程序代码为每个平台因为JVM处理翻译和platform-optimization。

> A JVM basically is a virtual execution environment acting as a machine for bytecode instructions, while assigning execution tasks and performing memory operations through interaction with underlying layers.

> A JVM执行环境basically is A虚拟机器as A bytecode for 294号指示,国家消除贫困和assigning多极化通过互动表演记忆operations“消除。

A JVM also takes care of dynamic resource management for running Java applications. This means it handles allocating and de-allocating memory, maintaining a consistent thread model on each platform, and organizing the executable instructions in a way that is suited for the CPU architecture where the application is executed. The JVM frees the programmer from keeping track of references between objects and knowing how long they should be kept in the system. It also frees us from having to decide exactly when to issue explicit instructions to free up memory -- an acknowledged pain point of non-dynamic programming languages like C.

JVM还负责动态运行Java应用程序的资源管理.这意味着它处理内存分配和释放,在每一个平台上保持一致的线程模型,和组织可执行指令的方式适合于CPU体系结构的应用程序执行.JVM使程序员从跟踪的对象之间的引用和知道他们多久应该保存在系统中.它还使我们不必决定什么时候发出明确的指令来释放内存,承认疼痛的非动态编程语言如C。

You could think about the JVM as a specialized operating system for Java; its job is to manage the runtime environment for Java applications. A JVM basically is a virtual execution environment acting as a machine for bytecode instructions, while assigning execution tasks and performing memory operations through interaction with underlying layers.

你可以考虑Java JVM作为专门的操作系统;它的职责是管理Java应用程序的运行时环境.JVM基本上是一个虚拟执行环境作为字节码指令的机器,而分配执行任务和执行内存操作通过与底层交互层。

## JVM components overview

## JVM组件的概述

There's a lot more to write about JVM internals and performance optimization. As foundation for upcoming articles in this series, I'll conclude with an overview of JVM components. This brief tour will be especially helpful for developers new to the JVM, and should prime your appetite for more in-depth discussions later in the series.

有很多写JVM内部结构和性能优化。作为基础,本系列后续文章中,我将总结JVM组件的概述.这个简短的参观将特别有利于开发新的JVM,并且应该主要你的食欲更深入的讨论在本系列的后面。

## From one language to another -- about Java compilers

## 从一种语言到另一个——关于Java编译器

A *compiler* takes one language as an input and produces an executable language as an output. A Java compiler has two main tasks:

* *编译器需要一种语言作为输入,产生一个可执行语言作为输出。Java编译器有两个主要任务:

1. Enable the Java language to be more portable, not tied into any specific platform when first written
2. Ensure that the outcome is efficient execution code for the intended target execution platform

1. 启用Java语言更便携,当第一次写不绑定到任何特定的平台
2. 确保结果有效执行预定目标执行平台的代码

Compilers are either static or dynamic. An example of a static compiler is `javac`. It takes Java code as input and translates it into bytecode -- a language that is executable by the Java virtual machine. **Static compilers** interpret the input code once and the output executable is in the form that will be used when the program executes. Because the input is static you will always see the same outcome. Only when you make changes to your original source and recompile will you see a different result.

编译器可以是静态或动态。一个静态编译器的一个示例`javac`。需要Java代码作为输入,并将其转换成可执行的字节码——语言Java虚拟机.* *静态编译器* *解释输入代码,输出可执行形式,将在程序执行时使用.因为输入是静态的你总是会看到相同的结果。只有当你改变你原来的源代码和编译你将看到不同的结果。

**Dynamic compilers**, such as [Just-In-Time (JIT)](https://www.javaworld.com/article/2078623/core-java/core-java-jvm-performance-optimization-part-1-a-jvm-technology-primer.html#resources) compilers, perform the translation from one language to another dynamically, meaning they do it as the code is executed. A JIT compiler lets you collect or create runtime profiling data (by the means of inserting performance counters) and make compiler decisions on the fly, using the environment data at hand. Dynamic compilation makes it possible to better sequence instructions in the compiled-to language, replace a set of instructions with more efficient sets, or even eliminate redundant operations. Over time you can collect more code-profiling data and make additional and better compilation decisions; altogether this is usually referred to as code optimization and recompilation.

动态编译器* * * *,如准时制(JIT)(https://www.javaworld.com/article/2078623/core-java/core-java-jvm-performance-optimization-part-1-a-jvm-technology-primer.html #参考资料)编译器执行动态地从一种语言翻译到另一个,这意味着他们的执行代码.JIT编译器允许您收集或创建运行时分析数据(通过插入性能计数器的方法)和动态编译器做决定,使用环境数据.动态编译可以更好的序列指令编译为语言,用更高效的集代替一组指令,甚至消除冗余操作.随着时间的推移,你可以收集更多的代码分析数据和额外的编译和更好的决策;完全这通常被称为代码优化和重新编译。

Dynamic compilation gives you the advantage of being able to adapt to dynamic changes in behavior or application load over time that drive the need for new optimizations. This is why dynamic compilers are very well suited to Java runtimes. The catch is that dynamic compilers can require extra data structures, thread resources, and CPU cycles for profiling and optimization. For more advanced optimizations you'll need even more resources. In most environments, however, the overhead is very small for the execution performance improvement gained -- five or 10 times better performance than what you would get from pure interpretation (meaning, executing the bytecode as-is, without modification).

动态编译给你能够适应动态变化的优势随着时间的推移在行为或应用程序负载驱动新的优化的必要性.This is very well why are编撰者dynamic suited to Java runtimes.问题在于,动态编译器可能需要额外的数据结构,线程资源和CPU周期分析和优化.为更先进的优化还需要更多的资源.然而,在大多数环境中,执行的开销是很小的性能改进了——5或10倍比你会得到更好的性能(即从单纯的解释,按原样执行字节码,没有修改)。


## Allocation leads to garbage collection

## 分配会导致垃圾收集

*Allocation* is done on a per-thread basis in each "Java process dedicated memory address space," also known as the Java heap, or heap for short. Single-threaded allocation is common in the client-side application world of Java. Single-threaded allocation quickly becomes non-optimal in the enterprise application and workload-serving side, however, because it doesn't take advantage of the parallelism in modern multicore environments.

* *分配在线程的基础上完成在每个“Java进程专用内存地址空间,也被称为Java堆,或简称为堆.单线程分配在客户端应用程序的Java世界中很常见.单线程分配很快变成了最优的企业应用程序和workload-serving一边,然而,各不相同,因此它parallelism代表团take”。在multicore environments

Parallell application design also forces the JVM to ensure that multiple threads do not allocate the same address space at the same time. You could control this by putting a lock on the entire allocation space. But this technique (a so-called *heap lock*) comes at a cost, as holding or queuing threads can cause a performance hit to resource utilization and application performance. A plus side of multicore systems is that they've created a demand for various new approaches to resource allocation in order to prevent the bottlenecking of single-thread, serialized allocation.

并行应用程序设计也迫使JVM确保多个线程不会分配在同一时间相同的地址空间.你见到的控制这一界线lock on the了空间分配.但这种技术(所谓的* *)堆锁是有代价的,持有或队列的线程可能会导致性能下降,资源利用率和应用程序的性能.多核系统的一面是,他们已经创建了一个需求的各种资源分配的新方法,以防止单线程的阻塞,序列化的分配。

A common approach is to divide the heap into several partitions, where each partition is of a "decent size" for the application -- obviously something that would need tuning, as allocation rate and object sizes vary significantly for different applications, as well as by number of threads. A *Thread Local Allocation Buffer* (TLAB), or sometimes *Thread Local Area* (TLA), is a dedicated partition that a thread allocates freely within, without having to claim a full heap lock. Once the area is full, the thread is assigned a new area until the heap runs out of areas to dedicate. When there's not enough space left to allocate the heap is "full," meaning the empty space on the heap is not large enough for the object that needs to be allocated. When the heap is full, garbage collection kicks in.

常见的方法是将堆分为几个分区,每个分区的“体面的规模”为应用程序——显然需要调优,分配率和对象大小变化明显不同的应用程序,以及通过线程的数量.* *线程本地分配缓冲区(TLAB),或者有时* *(TLA)线程本地区域,是一个专用的分区,一个线程分配内自由,无需要求一个完整的堆锁.一旦区域充满,线程分配一个新的区域,直到堆耗尽领域奉献.当没有足够的剩余空间分配在堆上“,”意思是空的空间对象的堆不够大,需要分配.当堆已满,垃圾收集。

## Fragmentation

## 碎片

A catch with the use of TLABs is the risk of inducing memory inefficiency by fragmenting the heap. If an application happens to allocate object sizes that do not add up to or fully allocate a TLAB size, there is a risk that a tiny empty space too small to host a new object will be left. This leftover space is referred to as a "fragment." If the application also happens to keep references to objects that are allocated next to these leftover spaces then the space could remain un-used for a long time.

抓住使用TLABs是诱导破碎效率低下的内存堆的风险.如果一个应用程序分配对象大小不加起来或完全分配TLAB大小,有可能一个小空间太小,主机一个新对象将会离开.这剩下的空间被称为一个“片段.“如果应用程序也是保持对象的引用时,会分配这些剩下的空间然后旁边的空间可能仍未使用了很长一段时间。

*Fragmentation* is what happens when fragments are scattered over the heap -- wasting heap space with tiny pieces of un-used memory. Configuring the "wrong" TLAB size for your application allocation behavior (with regard to object sizes and mix of object sizes and reference holding rate) is one path to an increasingly fragmented heap. As the application continues to run, the number of wasted fragmented spaces will come to hold an increasing portion of the free memory on the heap. Fragmentation causes decreased performance as the system is unable to allocate enough space for new application threads and objects. The garbage collector subsequently works harder to prevent out-of-memory exceptions.

*碎片*是碎片分散在堆,浪费堆空间微小碎片的未使用的内存.为应用程序配置“错误”TLAB大小分配行为(关于对象大小和混合的对象大小和引用率)是一个路径越来越分散 堆。随着应用程序继续运行,浪费了支离破碎的空间来容纳越来越堆上的空闲内存的一部分.碎片导致系统性能下降无法分配足够的空间为新应用程序线程和对象.垃圾收集器随后工作难以防止内存不足异常。

TLAB waste can be worked around. One way to temporarily or completely avoid fragmentation is to tune TLAB size on a per-application basis. This approach typically requires re-tuning as soon as your application allocation behavior changes. It is also possible to use sophisticated JVM algorithms and other approaches to organize heap partitions for more efficient memory allocation. For instance, a JVM could implement *free-lists*, which are linked lists of free memory chunks of specific sizes. A consecutive free chunk of memory is linked to a linked list of other chunks of a similar size, thus creating a handful of lists, each with its own size range. In some case using free-lists leads to a better fitted-memory allocation approach. Threads allocating a certain-sized object are enabled to allocate it in chunks close to the object's size, generating potentially less fragmentation than if you just relied on fixed-sized TLABs.

TLAB浪费可以工作。暂时或完全避免分裂的一种方法是调整TLAB大小在每个应用程序的基础上.这种方法通常需要re-tuning一旦应用程序分配行为的变化.还可以使用复杂的JVM堆分区算法和其他方法来组织更高效的内存分配.例如,JVM可以实现*自由列表*,链表的空闲内存块的大小.一个连续的内存块自由与其他类似大小的块的链表,从而创建一个列表,每个国家都有自己的尺寸范围.在某些情况下使用自由列表会导致一个更好的fitted-memory分配方法.启用线程分配一个certain-sized对象分配块接近对象的大小,生成碎片可能低于如果你只是依靠固定大小的TLABs。

> #### GC trivia

> #### GC琐事

> Some early garbage collectors had multiple old generations, but it emerged that more than two old generation spaces resulted in more overhead than value.

> 一些早期的垃圾收集器有多个老代,但有消息称,两年老代空间多导致的开销比价值。

Another way to optimize allocation versus fragmentation is to create a so-called *young generation*, which is a dedicated heap area (e.g., address space) where you will allocate all new objects. The rest of the heap becomes the so-called *old generation*. The old generation is left for the allocation of longer lived objects, meaning objects that have survived garbage collection or large objects that are assumed to live for a very long time. In order to better understand this approach to allocation we need to talk a bit about garbage collection.

优化配置与分裂的另一种方法是创建一个所谓的年轻一代* *,这是一个专用的堆区域(例如,地址空间),你会分配新对象.其余的堆成了所谓的老代* *.旧的一代不再住对象的分配,意味着幸存下来的垃圾收集的对象或大型对象认为生活很长一段时间.为了更好地理解这种分配方法我们需要谈谈垃圾收集。

## Garbage collection and application performance

## 垃圾收集和应用程序的性能

Garbage collection is the operation performed by the JVM's garbage collector to free up occupied heap memory that is no longer referenced. When a garbage collection is first triggered, all objects that are still referenced are kept, and the space occupied by previously referenced objects is freed or reclaimed. When all reclaimable memory has been collected, the space is up for grabs and ready to be allocated again by new objects.

垃圾收集操作由JVM垃圾收集器释放占用的堆内存,不再引用.垃圾收集是第一次触发时,仍然被引用的所有对象都保存下来,并占据的空间以前引用的对象被释放或回收.收集所有可收回的内存时,空间是待价而沽,准备再次被新对象分配。

A garbage collector should never reclaim a referenced object; doing so would break the JVM standard specification. An exception to this rule is a soft or [weak reference](http://java.sun.com/docs/books/performance/1st_edition/html/JPAppGC.fm.html) (if defined as such) that could be collected if the garbage collector were approaching a state of running out of memory. I strongly recommend that you try to avoid weak references as much as possible, however, because ambiguity in the Java specification has led to misinterpretation and error in their use. And besides, Java is designed for dynamic memory management, so you shouldn't have to think about where and when memory should be released.

垃圾收集器不应该回收引用的对象;这样做会破坏JVM标准规范。一个例外是一个软或弱引用(http://java.sun.com/docs/books/performance/1st_edition/html/JPAppGC.fm.html)(如果定义为这样的),如果垃圾收集器收集接近耗尽内存.我强烈建议您尽量避免弱引用尽可能多,然而,由于歧义在Java规范导致误解和错误使用.此外,Java是专为动态内存管理,所以你不应该考虑何时何地应该释放内存。

The challenge for a garbage collector is to reclaim memory without impacting running applications more than necessary. If you don't garbage-collect enough, your application will run out of memory; if you collect too frequently you'll lose throughput and response time, which will negatively impact running applications.

一个垃圾收集器面临的挑战是多回收内存而不影响正在运行的应用程序.如果你不足够对,您的应用程序将会耗尽内存;如果你过于频繁地收集你将失去吞吐量和响应时间,这将产生负面影响正在运行的应用程序。

## GC algorithms

## GC算法

There are many different garbage collection algorithms. Later in this series we will deep dive into a few. On the highest level, the main two approaches to garbage collection are reference counting and tracing collectors.

有许多不同的垃圾收集算法。在后面的文章中,我们将深入研究了一些.最高水平,垃圾收集的主要两种方法是引用计数和跟踪收集器。

- **Reference counting collectors** keep track of how many references an object has pointing to it. Once the count for an object becomes zero, the memory can immediately be reclaimed, which is one of the advantages of this approach. The difficulties with a reference-counting approach are circular structures and keeping all the reference counts up to date.
- **Tracing collectors** mark each object that is still referenced, iteratively following and marking all objects referenced by already marked objects. Once all still referenced objects are marked "live," all non-marked space can be reclaimed. This approach handles circular structures, but in most cases the collector has to wait until marking is complete before it can reclaim the unreferenced memory.

- * *引用计数收藏家* *跟踪多少引用一个对象指向它.一旦计数对象变成了零,内存可以立即回收,这是这种方法的优点之一.引用计数方法遇到的困难是圆形结构和保持所有的引用计数。
- * *跟踪收集器* *马克每个对象,还引用,迭代后,标记引用的所有对象已经显著对象.一旦所有仍然引用的对象标记”生活,“所有非标空间可以回收.这一宗旨handles approach in most fsi结构、数字会造成怎样的正当marking局收到的第is . it can the unreferenced记忆重新。

There are different ways to implement the above approaches. The more famous algorithms are *marking or copying* algorithms and *parallel or concurrent*algorithms. I'll talk about these in detail later in the series.

有不同的方法来实现上述方法。更有名的算法*标记或复制*算法和*平行或并发*算法.我将在后面详细讨论这些系列。

Generational garbage collection means dedicating separate address spaces on the heap for new objects and older ones. By "older objects" I mean objects that have survived a number of garbage collections. Having a young generation for new allocations and an old generation for surviving objects reduces fragmentation by quickly reclaiming memory occupied by short-lived objects, and by moving long-living objects closer together as they are promoted to the old generation address space. All of this reduces the the risk of fragments between long-living objects and protects the heap from fragmentation. A positive side-effect of having a young generation is also that it delays the need for the more costly collection of the old generation, as you are constantly reusing the same space for short-lived objects. (Old-space collection is more costly because the long-lived objects that live there contain more references to be traversed.)

分代垃圾收集方式将单独的地址空间为新对象和旧在堆上.我所说的“老对象”经历了大量的垃圾收集的对象.拥有一个年轻一代新分配和旧一代存活对象减少碎片通过快速回收内存被短暂的对象,和通过移动长寿对象紧密晋升为老一代地址空间.所有这些降低了碎片长寿对象之间的风险,防止堆碎片.年轻一代的一个积极的副作用也是它延迟需要付出更大的代价收集旧的一代,当你不断为短暂的对象重用相同的空间。(旧空间垃圾收集更昂贵,因为住在那里的长寿对象含有更多的引用被遍历)。

A final algorithm improvement worth mentioning is *compaction*, which is a way to manage heap fragmentation. Compaction basically means moving objects together to free up larger consecutive chunks of memory. If you are familiar with disk fragmentation and the tools for handling it then you will find that compaction is similar, but works on Java heap memory. I'll discuss compaction in more detail later in this series.

最后一个算法改进值得一提的是* *,实是一种管理堆碎片.压实基本上意味着移动对象在一起,释放更大的连续的内存块.如果您熟悉磁盘碎片和工具来处理然后你会发现,压实是相似的,但是在Java堆内存.我将在本系列的后面详细讨论压实。

## In conclusion: Reflection points and highlights

## 结论:反射点和亮点

A JVM enables portability ("write once, run anywhere") and dynamic memory management, both key features of the Java platform and reasons for its popularity and productivity.

JVM实现可移植性(“编写一次,到处运行”)和动态内存管理,Java平台的关键特性和它的受欢迎程度和生产力的理由。

In this first article in the *JVM performance optimization* series I've explained how a compiler translates bytecode to target-platform instruction languages and helps optimize the execution of your Java program *dynamically*. There are different compilers for different application needs.

在这个JVM性能优化* *系列的第一篇文章,我解释了一个编译器转换字节码指令语言和目标平台帮助优化您的执行 Java程序动态* *。不同的应用有不同的编译器的需求。

I've also briefly discussed memory allocation and garbage collection, and how both relate to Java application performance. Basically, the higher the allocation rate of a Java application, the faster your heap fills up and the more frequently garbage collection is triggered. The challenge of garbage collection is to reclaim enough memory for your application needs without impacting running applications more than necessary, but to do so before the application runs out of memory. In future articles we'll explore the details of both traditional and more novel approaches to garbage collection for JVM performance optimization.

我还简要地讨论了内存分配和垃圾收集,以及如何与Java应用程序的性能.基本上,一个Java应用程序的分配率越高,你越快堆填满和更频繁的垃圾收集.垃圾收集的挑战是收回足够的内存为您的应用程序需要多而不影响正在运行的应用程序,但是这样做之前,应用程序耗尽内存.在以后的文章中我们将探讨传统的细节和更新颖的方法为JVM性能优化垃圾收集。

> Eva Andreasson has been involved with Java virtual machine technologies, SOA, cloud computing, and other enterprise middleware solutions for 10 years. She joined the startup Appeal Virtual Solutions (later acquired by BEA Systems) in 2001 as a developer of the JRockit JVM. Eva has been awarded two patents for garbage collection heuristics and algorithms. She also pioneered Deterministic Garbage Collection which later became productized through JRockit Real Time. Eva has worked closely with Sun and Intel on technical partnerships, as well as various integration projects of JRockit Product Group, WebLogic, and Coherence (post Oracle acquisition in 2008). In 2009 Eva joined [Azul Systems](http://www.azulsystems.com/) as product manager for the new Zing Java Platform. Recently she switched gears and joined the team at [Cloudera](http://www.cloudera.com/company/)as senior product manager for Cloudera's Hadoop distribution, where she is engaged in the exciting future and innovation path of highly scalable, distributed data processing frameworks.

> 伊娃Andreasson一直参与Java虚拟机技术,SOA、云计算、和其他企业中间件解决方案为10年.她加入了创业吸引虚拟解决方案(后来收购BEA Systems)在2001年作为一个开发者JRockit JVM.Eva has been转交garbage for heuristics收藏two恶劣和算法。政府pioneered Deterministic Garbage productized later which became收藏通过JRockit面向.Eva与太阳和英特尔技术有密切合作的伙伴关系,以及各种集成项目JRockit产品组、WebLogic、一致性(2008年发布Oracle收购).2009年,伊娃加入(Azul Systems)(http://www.azulsystems.com/)为Java平台产品经理为新活力。最近,她改变了立场,开始加入了团队Cloudera(http://www.cloudera.com/company/)高级产品经理Cloudera Hadoop的分布,在那里她从事高度可伸缩的激动人心的未来和创新路径,分布式数据处理框架。

#### Learn more about this topic

#### 更多学习资料

- [To Collect or Not To Collect.](https://www.usenix.org/conference/java-vm-02/collect-or-not-collect-machine-learning-memory-management)" (Eva Andreasson, Frank Hoffmann, Olof Lindholm; JVM-02: Proceedings of the Java Virtual Machine Research and Technology Symposium, 2002): Presents the authors' research into an adaptive decision process that determines which garbage collector technique should be invoked and how it should be applied."
- [Reinforcement Learning for a dynamic JVM](http://www.nada.kth.se/utbildning/grukth/exjobb/rapportlistor/2002/Rapporter02/andreasson_eva_02041.pdf)" (Eva Andreasson, KTH Royal Institute of Technology, 2002): Master thesis report on how to use reinforcement learning to better optimize the decision of when to start concurrent garbage collection for a dynamic workload."
- [Deterministic Garbage Collection: Unleash the Power of Java with Oracle JRockit Real Time](http://www.oracle.com/us/technologies/java/oracle-jrockit-real-time-1517310.pdf)" (An Oracle White Paper, August 2008): Learn more about the Deterministic Garbage Collection algorithm in JRockit Real Time.
- [Why is Java faster when using a JIT vs. compiling to machine code?](http://stackoverflow.com/questions/1878696/why-is-java-faster-when-using-a-jit-vs-compiling-to-machine-code) (Stackoverflow, December 2009): A thread discussion for learning more about Just-in-Time compiler technology.
- [Zing](http://www.azulsystems.com/products/zing/virtual-machine): A fully Java compliant highly scalable software platform that includes an application-aware resource controller and zero overhead, always-on production visibility and diagnostic tools. Zing incorporates industry-leading, proven technology to allow TBs memory heap sizes per instance with sustained throughput under dynamic load and extreme memory allocation rates common for Java applications."
- [G1: Java's Garbage First Garbage Collector](http://www.drdobbs.com/jvm/g1-javas-garbage-first-garbage-collector/219401061)" (Eric Bruno, Dr. Dobb's, August 2009): A good overview of GC and introduction to the G1 garbage collector.
- [*Oracle JRockit: The Definitive Guide*](http://www.packtpub.com/oracle-jrockit-definitive-guide/book?tag=) (Marcus Hirt, Marcus Lagergren; Packt Publishing, 2010): A complete guide to the JRockit JVM.



原文链接:

- <https://www.javaworld.com/article/2078623/core-java/core-java-jvm-performance-optimization-part-1-a-jvm-technology-primer.html>

