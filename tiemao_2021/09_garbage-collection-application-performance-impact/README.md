# Garbage Collection Impact on Application Performance

# 垃圾回收(GC)对应用性能的影响

Part 1 of the Java Performance series discussed why Low Latency is Critical and its effect on application performance. In that article, the relationship between latency and application performance is discussed with respect to some of the causes of latency (network issues, disk I/O, operating system, the application code). Also, the problem of high tail latency for applications intended to deliver near-real-time results was presented. This article describes the latency caused by Java/JVM Garbage Collection (GC), and describes in particular how GC can be a cause of high tail latency.

本系列的第 1 部分讨论了为什么低延迟至关重要，以及它对应用性能的影响。那篇文章从延迟的若干成因(网络问题、磁盘 I/O、操作系统、应用代码)出发，讨论了延迟与应用性能之间的关系，并提出了一个问题: 对于那些以近实时结果为目标的应用程序，高尾延迟会带来怎样的困扰。本文将介绍 Java/JVM 垃圾回收(Garbage Collection，GC)所导致的延迟，并着重说明 GC 为什么会成为高尾延迟的成因之一。

Many modern applications require both high performance and low latency. Performance can be measured as total throughput, the total amount of data that is processed or created over a unit of time. Latency is the amount of time that elapses between each unit of throughput.

很多现代应用同时要求高性能和低延迟。性能可以用总吞吐量来衡量，也就是单位时间内处理或产生的数据总量。延迟则是每个吞吐单位之间所流逝的时间量。

Ideally, a program would simultaneously have both consistent high performance and consistently low latency. But it is not realistic to expect this to be possible. For example, consider a program that receives a constant incoming stream of data (these might be satellite measurements, financial market data, data requests into an API, etc.). Changes in the incoming data result in different portions of the code being executed, which can cause significant differences in the amount of time required to process the latest data set. Meanwhile, causes of latency (for example, network I/O and disk I/O) are also constantly varying. Put all this together, and the total latency of a high performance program typically looks something like this:

理想情况下，程序应当同时具备稳定的高性能和稳定的低延迟。但指望这两者能同时实现并不现实。举个例子，假设有一个程序持续接收不断流入的数据流(可能是卫星测量数据、金融市场数据、发往某个 API 的数据请求等等)。流入数据的变化会导致执行到代码的不同部分，从而使处理最新数据集所需的时间出现显著差异。与此同时，造成延迟的因素(例如网络 I/O 和磁盘 I/O)也在不断变化。把这一切叠加起来，一个高性能程序的总延迟通常就如下图所示:

latency graph

Most of the time, the application’s latency is below the average (the orange line); however, sometimes the latency is significantly above the average. In other words, the application has high tail latency, which is a major problem for customers who require consistent timely performance.

大多数时候，应用的延迟低于平均值(图中的橙色线); 但有时延迟会显著高于平均值。换句话说，该应用存在高尾延迟，而对于那些需要稳定及时性能的客户来说，这是一个大问题。

## Java’s Innovation Compared with C and C++

## Java 相较于 C 和 C++ 的创新

A primary reason that Java quickly grew in popularity is that it eliminates the difficulty of memory management that is present in C and C++. These languages are prone to memory leaks unless the code is carefully written to ensure that all allocated memory is freed by the program itself. In operational C/C++ software running on a 24/7 schedule, if a memory leak exists, ultimately all memory available to the application will be consumed, and the application will crash (possibly also bringing down correlated applications running on the same server). Detecting exactly where in the software the memory leak is happening can involve tediously poring over thousands of lines of code. Meanwhile, the application that was supposed to be 24/7 operational has to be restarted, with the operations team knowing that it will likely crash again.

Java 之所以能迅速流行起来，一个主要原因是它消除了 C 和 C++ 中存在的那种内存管理难题。这两种语言很容易出现内存泄漏，除非代码编写得足够仔细，确保所有已分配的内存都由程序自己释放。在 7×24 小时运行的 C/C++ 生产软件中，一旦存在内存泄漏，最终应用可用的内存会被全部耗尽，程序随之崩溃(还可能连带拖垮同一台服务器上运行的相关应用)。要精确找出内存泄漏究竟发生在软件中的哪个位置，可能得令人厌烦地逐行查阅成千上万行代码。与此同时，本该 7×24 小时运行的应用只能被迫重启，而运维团队心里清楚它多半还会再次崩溃。

This is the problem that the Java Virtual Machine solves. The JVM automatically manages the application’s memory by monitoring all created objects. This development made developing the same application in Java more efficient than developing it in C/C++. Developers could focus on implementing the required functionality of the software, without spending time concerning themselves with memory issues, and in particular not needing to take time away from new development to debug difficult-to-detect memory leaks.

这正是 Java 虚拟机(Java Virtual Machine)要解决的问题。JVM 通过监视所有创建出来的对象，自动管理应用的内存。这一进步使得用 Java 开发同一个应用比用 C/C++ 开发更高效。开发人员可以把精力集中在实现软件所需的功能上，而不必花时间操心内存问题，特别是无需从新功能的开发中抽身，去调试那些难以发现的内存泄漏。

This is not to say that it’s impossible to create memory leaks in Java: an inexperienced developer might easily write a long-running method that keeps creating new objects, ultimately filling up heap and causing an out-of-memory error. The difference between Java and C/C++ is that this error would be much more easily discovered in Java than a few bytes that are not always freed somewhere in 100K lines of an operational C/C++ code.

这并不是说在 Java 中就不可能产生内存泄漏: 经验不足的开发人员很容易写出一个长时间运行的方法，不断创建新对象，最终把堆填满，导致内存溢出错误(out-of-memory error)。Java 与 C/C++ 的区别在于: 这种错误在 Java 中要比在 10 万行 C/C++ 生产代码里某处偶尔泄漏的几个字节容易发现得多。

## What is Stop-the-World in Java?

## Java 中的 Stop-the-World 是什么?

Through Garbage Collection, the JVM solves the problem of tedious memory management, freeing developers to work on adding new features to their software. The trade-off is garbage collection. As an application is running, the objects stored in memory are constantly changing. Relocating active objects while new objects are actively being created across a multi-threaded application could potentially result in a memory system that is internally inconsistent, which could ultimately cause the application to produce invalid results or crash.

通过垃圾回收，JVM 解决了内存管理繁琐的问题，让开发人员得以腾出手来为软件添加新功能。代价就是垃圾回收本身。应用运行期间，内存中存储的对象时刻都在变化。在一个多线程应用中，一边迁移存活对象，一边又有新对象不断被创建，可能会让内存系统在内部出现不一致，最终导致应用产生无效结果甚至崩溃。

A very safe way to avoid this is called “stop-the-world”: the “world” is all active processing threads. If these are paused, then memory is static, and it’s safe for the garbage collector to identify all active objects and efficiently relocate them without damaging the current processing state of the application. This is why “stop-the-world” has been a feature of historic Java/JVM garbage collection techniques.

避免这种情况的一种非常安全的做法叫做“stop-the-world”: 这里的“world”指的是所有正在执行的处理线程。如果把这些线程暂停下来，内存就静止了，垃圾回收器便可以安全地识别出所有存活对象，并高效地迁移它们，而不会破坏应用当前的处理状态。这就是为什么“stop-the-world”一直是历代 Java/JVM 垃圾回收技术的一个特征。

## Stop-the-World JVM Garbage Collection

## Stop-the-World 式的 JVM 垃圾回收

The initial concept for Garbage Collection (GC) was to let the application run for as long as it safely could without running out of heap memory. Once the JVM determined that of the amount of heap that was occupied by objects was too near the safe maximum, all application threads would be paused, and garbage collection would occur. Garbage collection, simply stated, performs these operations:

垃圾回收(GC)最初的思路，是让应用在不耗尽堆内存的前提下尽可能安全地运行。一旦 JVM 判定对象占用的堆内存量已经逼近安全上限，就会暂停所有应用线程，然后执行垃圾回收。简单来说，垃圾回收会执行以下操作:

- Pause application threads
- Study all existing objects and determine which are still currently referenced
- Mark the existing objects that currently referenced
- Defragment the heap memory by relocating active objects to the beginning of the heap
- Restart application threads

- 暂停应用线程
- 检查所有现存对象，判断哪些当前仍被引用
- 标记当前仍被引用的对象
- 把存活对象迁移到堆的起始位置，从而整理(压缩)堆内存
- 重启应用线程

All of these steps take time. Even pausing multiple threads can occupy quite a lot of time. The threads have to be signaled that they need to pause, then each thread must reach a suitable stopping point. All the threads do not simultaneously come to a pause.

所有这些步骤都需要时间。就连暂停多个线程也会占用相当多的时间: 必须先通知各线程它们需要暂停，然后每个线程都要到达一个合适的停止点。所有线程并不会同时停顿下来。

Over time, as multiprocessor CPUs came into being, the possibilities for spreading out stop-the-world GC events, so the application does not have to entirely pause, were discovered and developed. Thus the OpenJDK offers many different options for configuring which type of garbage collection should occur as the application runs.

随着时间推移，多核 CPU 的出现让人们发现并发展出各种分摊 stop-the-world GC 事件的可能，使应用不必完全停顿。因此 OpenJDK 提供了许多不同的选项，用来配置应用运行时该采用哪种类型的垃圾回收。

Among the primary methods for accomplishing this is generational collectors, for example the OpenJDK CMS and G1 garbage collectors. These GCs divide the objects on the heap into two generations: young and old. Young objects are newly created objects that are short-lived: they are created, then the application no longer needs them, so they are easy targets for quick collection by the GC. Old generation objects are often (but not always) objects that endure as the application proceeds. By separating garbage collection between the two generations, GC can facilitate briefer stop-the-world pauses: the memory utilized by unneeded younger objects can be safely collected while the memory for the long-term object remains in place, without the need to pause the entire application.

实现这一目标的主要方法之一是分代收集器，例如 OpenJDK 的 CMS 和 G1 垃圾回收器。这些 GC 把堆上的对象划分为两代: 年轻代和老年代。年轻代对象是新创建出来的、生命周期很短的对象: 它们被创建出来，随后应用就不再需要它们，因此很容易被 GC 快速回收。老年代对象则通常是(但并不总是)随着应用推进而长期存活的对象。通过在两个代之间分开进行垃圾回收，GC 可以实现更短的 stop-the-world 停顿: 不再需要的年轻代对象所占用的内存可以安全回收，而长期存活对象的内存则原地保留，无需暂停整个应用。

While the same process can be applied to old generation objects on a less frequent cadence, this is more difficult because these objects are enduring. But they do not necessarily endure forever, and objects from the young generation that are found to be long-lasting will be promoted to the older generation.

同样的过程也可以以更低的频率应用到老年代对象上，但这更困难，因为这些对象存活得比较久。不过它们未必能永远存活; 而年轻代中被判定为长期存活的对象，会被晋升(promote)到老年代。

Hence, a problem will ultimately arise, based on the size of the memory heap: it will eventually fill up, requiring a full heap garbage collection operation to occur, requiring the JVM to temporarily pause all threads. Suddenly, stop-the-world GC must happen, or else the application will run out of memory. To enable this to happen, all application threads are paused: the application temporarily ceases to perform the processing it is designed to perform.

因此，受制于堆内存的大小，问题终将出现: 堆最终会被填满，需要执行一次全堆垃圾回收，而这要求 JVM 临时暂停所有线程。于是 stop-the-world GC 突然之间就必须发生，否则应用就会内存耗尽。为了让这件事得以进行，所有应用线程都会被暂停: 应用暂时停止执行它本该完成的处理工作。

## Stop-the-World GC Creates High Tail Latency

## Stop-the-World GC 会造成高尾延迟

For many types of applications, this is not much of a problem: if your application is effectively “down” every now and then, it makes no difference.

对许多类型的应用来说，这算不上什么大问题: 如果你的应用时不时地“停摆”一下，也无伤大雅。

But where the objective is for the application to provide near-real-time performance (for example, financial trading applications, military sensor data processing applications, E-Commerce applications) this is a very big problem. These stop-the-world garbage collection events create enormous high tail latency, which is intolerable for applications that are expected to deliver constant 24/7 real-time performance.

但如果目标是要让应用提供近实时的性能(例如金融交易应用、军事传感器数据处理应用、电子商务应用)，那就是个很大的问题了。这些 stop-the-world 垃圾回收事件会造成极高的尾延迟，对于那些被要求 7×24 小时持续提供实时性能的应用来说，这是无法容忍的。

Is there a solution? Yes: replace stop-the-world garbage collection with concurrent garbage collection, which is provided by Zing. I’ll discuss how this works in my next post.

有解决办法吗? 有: 用并发垃圾回收取代 stop-the-world 垃圾回收，而并发垃圾回收是由 Zing 提供的。我将在下一篇文章中讨论它的工作原理。

<https://www.azul.com/garbage-collection-application-performance-impact/>
