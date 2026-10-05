

# 50 道高级 Java 垃圾回收与性能面试题及答案

Java 开发者们，你好。如果你参加过任何 Java 开发岗位的面试，尤其是高级开发岗位，那你就知道扎实掌握 JVM 内部结构和垃圾回收（Garbage Collection）知识有多重要。尽管 [Java](https://javarevisited.blogspot.com/2018/07/10-reasons-to-learn-java-programming.html) 和 [JVM](https://javarevisited.blogspot.com/2019/04/top-5-courses-to-learn-jvm-internals.html) 会替你管理内存，但糟糕的代码依然会造成内存泄漏和性能问题。比如，如果你在循环里创建了成百上千万个对象，或者无意间一直持有着本该被回收的对象的引用，那你就是在给垃圾回收器增加额外的负担，并在应用里制造 **内存泄漏(memory leak)**。这不能怪 Java 和 JVM，避免这类错误的唯一办法就是弄清楚垃圾回收是怎么工作的。

事实上，要写出真正高性能的 Java 应用，你还得对应用做调优以把性能拉到最大，同时也需要加入必要的日志，以便排查和定位性能问题。

举个例子，在我做过的一个 Web 应用项目里，我们的 Tomcat 服务器抛出了 OutOfMemory 错误，请求也开始卡住。日志里几乎没有任何线索，但当我启用了 GC 日志后发现，正是 Full GC 导致了 **OutOfMemory 错误**，因为它没办法回收出多少空间，而根本原因就是内存泄漏。

这就是为什么对 Java 开发者，尤其是只有几年经验的人来说，掌握 GC 和 JVM 内部结构的知识很重要。

如果你觉得自己在 GC 上没花过多少时间，也不太懂垃圾回收是怎么工作的，那我建议你先去看看专门的 [Java 性能课程](https://www.java67.com/2020/04/top-5-advanced-courses-to-learn-java-perofrmance-concurrency-memory-management.html) 和 [书籍](https://www.java67.com/2019/08/best-books-to-learn-java-virtual-machine-in-depth.html)，它们会提供你回答常见垃圾回收面试题所需的全部信息和知识。










## 50+ 道 Java 垃圾回收面试题

在本文中，我分享了一些我在很多面试中见过的垃圾回收面试题。这些问题围绕垃圾回收的工作原理、不同类型的垃圾回收器，以及用于垃圾回收监控和调优的 **JVM 参数**展开。

我还加入了一些会迫使你去深入了解 GC 术语和流程的问题，这样你在读完本文之后就会自己去查资料。GC 是任何 Java 面试中必不可少的一部分，所以一定要确保你对 GC 有足够的掌握。


**Question 1 - ParNew 和 DefNew 这两个年轻代垃圾回收器有什么区别？**
Answer - ParNew 和 DefNew 都是年轻代垃圾回收器。ParNew 是一个多线程 GC，与并发标记清除（Concurrent Mark Sweep）配合使用；而 DefNew 是一个单线程 GC，与串行垃圾回收器（Serial Garbage Collector）配合使用。

[![Top 50 Garbage Collection and Java Performance Interview Questions and Answers](https://1.bp.blogspot.com/-Zv6ekanlfaE/Xjd_7BnbM3I/AAAAAAAAcrU/IK8YPDynbK4CIKqMXr68EC9AfY7QnN6hgCEwYBhgL/w606-h341/How%2Bmany%2Bobjects%2Bare%2Beligible%2Bfor%2Bgarbage%2Bcollection%2Btricky%2Bjava%2Bquestion.png)](https://1.bp.blogspot.com/-Zv6ekanlfaE/Xjd_7BnbM3I/AAAAAAAAcrU/IK8YPDynbK4CIKqMXr68EC9AfY7QnN6hgCEwYBhgL/s1600/How%2Bmany%2Bobjects%2Bare%2Beligible%2Bfor%2Bgarbage%2Bcollection%2Btricky%2Bjava%2Bquestion.png)



**
Question 2 - 在 Java 中，怎么区分 minor GC 和 major GC？**
如果通过 –verbose:gc 或 -XX:PrintGCDetails 启用了垃圾回收日志，minor 回收会打印 “GC”，而 major 回收会打印 “Full GC”。


**Question 3 - 怎么找出由调用 System.gc() 引发的 GC？**
和 major、minor 回收类似，垃圾回收的输出里会包含 “System” 这个词。


**Question 4 - Serial 垃圾回收器和 Throughput 垃圾回收器有什么区别？**
Serial 和 Throughput 都是 stop-the-world 的垃圾回收器，在 Full GC 期间都会暂停应用线程，但 Throughput 垃圾回收器要比 Serial 更好。另外，Serial 垃圾回收器是客户端 JVM 上的默认选择。



**Question 5 - -XX:ParallelGC 和 -XX:ParallelOldGC 有什么区别？**


Question 6 - 什么时候用 ConcurrentMarkSweep 垃圾回收器，什么时候用 Throughput GC？

**Question 7 - JVM 中永久代空间会发生垃圾回收吗？**
这是一道很刁钻的垃圾回收面试题，因为很多程序员并不确定 PermGen 空间是不是 Java 堆空间的一部分，而且由于它维护着类的元数据和字符串池，所以它到底能不能被垃圾回收也不确定。

顺便说一句，PermGen 空间里确实会发生垃圾回收，如果 PermGen 空间满了或者超过某个阈值，就可能触发 Full GC。去看 GC 的输出你会发现，PermGen 空间也是会被垃圾回收的。

这就是为什么合理地设置 PermGen 空间大小对于避免频繁 Full GC 至关重要。你可以通过 JVM 选项 -XX:PermGenSize
和 -XX:MaxPermGenSize 来控制 PermGen 空间的大小。


**Question 8：如何监控垃圾回收活动？**
你既可以离线监控垃圾回收活动，也可以实时监控。你可以用 JConsole 和 VisualVM（配合它的 Visual GC 插件）这类工具来实时监控垃圾回收活动和 JVM 的内存状况，也可以通过 -XlogGC=<PATH> 这个 JVM 参数把垃圾回收输出重定向到日志文件里做离线分析。

总之，你应该始终启用像 -XX:PrintGCDetails -X:verboseGC 和 -XX:PrintGCTimeStamps 这样的 GC 选项，因为它们对应用性能影响不大，却能为性能监控提供有用的状态信息。


Question 9：ConcurrentMarkSweep 和 G1 垃圾回收器有什么区别？

Question 10：你做过垃圾回收调优吗？你的思路是什么？


**Questions 11：JVM 中永久代空间会发生垃圾回收吗？**
这是一道很刁钻的垃圾回收面试题，因为很多程序员并不确定 permgen 空间是不是 Java 堆空间的一部分，而且由于它维护着类的元数据和字符串池，所以它到底能不能被垃圾回收也不确定。

顺便说一句，PermGen 空间里确实会发生垃圾回收，如果 PermGen 空间满了或者超过某个阈值，就可能触发 Full GC。去看 GC 的输出你会发现，PermGen 空间也是会被垃圾回收的。

这就是为什么合理地设置 permgen 空间大小对于避免频繁 Full GC 很重要。你可以通过 JVM 选项 -XX:PermGenSize 和 -XX:MaxPermGenSize 来控制 permgen 空间的大小。

如果你想进一步了解 JVM 内部的堆结构，我也推荐你去看看 Pluralsight 上 Kevin Jones 的 **[Understanding the Java Virtual Machine: Memory Management](https://javarevisited.blogspot.com/2019/04/top-5-courses-to-learn-jvm-internals.html)** 课程。这是一个分三部分的 JVM 系列课程，深入讲解了内存管理、类加载、安全以及反射。



[![Java Memory Management interview questions](https://1.bp.blogspot.com/-3zxm31LRG8g/Xjd_1abAEII/AAAAAAAAcrQ/c8e2R-Lt058Efh1wcJblwHPiJhbasvNbgCLcBGAsYHQ/w603-h325/Garbage%2BCollection%2Band%2BJVM%2Bparameters.jpg)](https://medium.com/javarevisited/7-best-courses-to-learn-jvm-garbage-collection-and-performance-tuning-for-experienced-java-331705180686)



**Questions 12：ParNew 和 DefNew 这两个年轻代垃圾回收器有什么区别？**

Questions 13：在 Java 中，怎么区分 minor GC 和 major GC？

Questions 14：怎么找出由调用 System.gc() 引发的 GC？

Question 15：Serial 垃圾回收器和 Throughput 垃圾回收器有什么区别？

Question 16：-XX:ParallelGC 和 -XX:ParallelOldGC 有什么区别？

Question 17：什么时候用 ConcurrentMarkSweep 垃圾回收器，什么时候用 ThroughPut GC？


**Question 18：如何监控垃圾回收活动？你可以监控垃圾回收**活动，既可以离线监控，也可以实时监控。你可以用 JConsole 和 Visual VM（配合它的 Visual GC 插件）这类工具来实时监控垃圾回收活动和 JVM 的内存状况，也可以通过 -XlogGC=<PATH> 这个 JVM 参数把垃圾回收输出重定向到日志文件里做离线分析。

总之，你应该始终启用像 -XX:PrintGCDetails -X:verboseGC 和 -XX:PrintGCTimeStamps 这样的 GC 选项，因为它们对应用性能影响不大，却能为性能监控提供有用的统计数据。


Question 19：ConcurrentMarkSweep 和 G1 垃圾回收器有什么区别？

Question 20：你做过垃圾回收调优吗？你的思路是什么？

Question 21：major GC 和 minor GC 有什么区别？

Question 22：你会如何启用垃圾回收日志？

Question 23：在 Java 中能调用 finalize() 方法吗？

**Question 24：在 Java 中能强制触发垃圾回收吗？**
这个问题很有意思。答案是既能也不能。我们可以通过调用 “System.gc()” 来建议 JVM 执行一次垃圾回收。然而，这并不能保证一定会发生什么。作为 Java 开发者，我们无法确切知道自己的代码运行在什么样的 JVM 上。JVM 规范并没有保证调用这个方法时会发生什么。甚至还有一个启动标志 -XX:+DisableExplicitGC，它会让这个调用什么都不做。顺便说一句，使用 System.gc() 被认为是一种不好的做法。

Question 25：G1 垃圾回收器是如何工作的？

Question 26：在 Java 中如何增大堆内存？

**Question 27：JVM 中的 PermGen 空间是什么？**
PermGen 是 JVM 存放类元数据的地方。它在 Java 8 中已经不存在了，被 metaspace（元空间）取代了。一般来说，只要确保它有足够的空间，PermGen 基本不需要做额外的调优，不过如果类没有被正确卸载，也有可能出现泄漏。

Question 28：在 Java 中对象是在哪里创建的？

Question 29：为了 GC，堆被划分成了哪些不同的区域？

Question 30：如何请求 JVM 启动垃圾回收过程？

\31. serial 和 parallel 垃圾回收器有什么区别？

\32. 什么是 ConcurrentMarkSweep 垃圾回收器？

\33. 什么是 G1 垃圾回收器？

\34. G1 垃圾回收器是如何获得更好的时延表现的？

\35. Java 中的 finally 是什么方法？

\36. 一个对象什么时候会变得可以被垃圾回收？

\37. System.gc() 和 Runtime.gc() 有什么区别？

\38. ParNew 和 DefNew 是什么垃圾回收器？

\39. 如何把垃圾回收详情输出到日志文件中？

\40. 如何把垃圾回收日志存到指定的文件里？

\41. 堆中的 Eden 和 survivor 空间是什么？

\42. 有哪些最佳实践可以帮助垃圾回收器？

\43. Java 中有哪些不同种类的垃圾回收器？

\44. 在 Java 中如何查出已用内存和总内存？

\45. Java 堆被划分成了哪些内存区域？

\46. Serial 和 Parallel 垃圾回收器有什么区别？

\47. 在 Java 中我们能强制触发垃圾回收吗？

\48. 在 Java 中如何增大 Permgen 内存？

\49. major GC 和 minor GC 有什么区别？

**50. ConcurrentMarkSweep 垃圾回收器是如何工作的？**
CMS GC 通过把大部分与 GC 相关的工作与应用的处理并发执行，从而把停顿降到最低。这减少了应用必须完全暂停的时间，因此更适用于对停顿敏感的应用。CMS 是一种非压缩算法，可能会带来碎片化问题。实际上，CMS 回收器在年轻代上使用的是 Parallel GC。



Read more: https://www.java67.com/2020/02/50-garbage-collection-interview-questions-answers-java.html#ixzz7rrJ8wTHo





- 原文链接: https://www.java67.com/2020/02/50-garbage-collection-interview-questions-answers-java.html

