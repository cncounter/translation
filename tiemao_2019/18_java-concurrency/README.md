# Java Concurrency and Multithreading Tutorial

# Java多线程并发性和教程

Java Concurrency is a term that covers multithreading, concurrency and parallelism on the Java platform. That includes the Java concurrency tools, problems and solutions. This Java concurrency tutorial covers the core concepts of multithreading, concurrency constructs, concurrency problems, costs, benefits related to multithreading in Java.

Java并发是一个术语,包括多线程、并发性和并行性在Java平台上。包括Java并发工具,问题和解决方案.这个Java并发教程覆盖了多线程的核心概念,并发构造,并发性问题,相关的成本,收益在Java多线程。

### Brief History of Concurrency

### 并发简史》

Back in the old days a computer had a single CPU, and was only capable of executing a single program at a time. Later came multitasking which meant that computers could execute multiple programs (AKA tasks or processes) at the same time. It wasn't really "at the same time" though. The single CPU was shared between the programs. The operating system would switch between the programs running, executing each of them for a little while before switching.

回到旧社会电脑只有一个CPU,只是每次执行一个程序的能力.后来多任务这意味着电脑可以执行多个程序(即任务或进程)在同一时间。这不是真正的“同时”.单一CPU之间共享项目。操作系统之间进行切换运行的程序,执行他们每个人一会儿之前切换。

Along with multitasking came new challenges for software developers. Programs can no longer assume to have all the CPU time available, nor all memory or any other computer resources. A "good citizen" program should release all resources it is no longer using, so other programs can use them.

对于软件开发人员与多任务处理是新的挑战。程序可以不再承担所有可用的CPU时间,也不是所有内存或其他计算机资源.“好公民”程序应该释放所有资源不再使用,所以其他程序可以使用它们。

Later yet came multithreading which mean that you could have multiple threads of execution inside the same program. A thread of execution can be thought of as a CPU executing the program. When you have multiple threads executing the same program, it is like having multiple CPUs execute within the same program.

后来还多线程意味着你可以有多个线程内执行相同的程序。执行的线程可以被认为是一个CPU执行程序.当你有相同的multiple threads字段中执行方案,it is像个multiple lse execute within the same方案。

Multithreading can be a great way to increase the performance of some types of programs. However, mulithreading is even more challenging than multitasking. The threads are executing within the same program and are hence reading and writing the same memory simultanously. This can result in errors not seen in a singlethreaded program. Some of these errors may not be seen on single CPU machines, because two threads never really execute "simultanously". Modern computers, though, come with multi core CPUs, and even with multiple CPUs too. This means that separate threads can be executed by separate cores or CPUs simultanously.

多线程可以是一个伟大的方式来增加一些类型的程序的性能。然而,mulithreading比多任务更具挑战性.线程中执行相同的程序,因此读写内存simultanously相同。这可能会导致错误的singlethreaded计划.这些错误可能不会出现在单CPU的机器,因为两个线程没有真正执行“simultanously”.然而,现代计算机和多核心cpu,甚至与多个cpu。这意味着,单独的线程可以通过单独的核心或cpu simultanously执行。

![](01_java-concurrency-tutorial-introduction-1.png)



If a thread reads a memory location while another thread writes to it, what value will the first thread end up reading? The old value? The value written by the second thread? Or a value that is a mix between the two? Or, if two threads are writing to the same memory location simultanously, what value will be left when they are done? The value written by the first thread? The value written by the second thread? Or a mix of the two values written?

如果一个线程读取内存位置,而另一个线程写入,第一个线程结束阅读会有什么价值?旧的价值?价值写的第二个线程?或一个值是两者之间的混合?或者,如果两个线程写相同的内存位置simultanously,价值将离开时做什么呢?第一个线程写的价值?价值写的第二个线程?或两种类型的混合值写吗?

Without proper precautions any of these outcomes are possible. The behaviour would not even be predictable. The outcome could change from time to time. Therefore it is important as a developer to know how to take the right precautions - meaning learning to control how threads access shared resources like memory, files, databases etc. That is one of the topics this Java concurrency tutorial addresses.

无任何precautions proper的这些成果是可能的。《行为,甚至会是可预测的。结果报送change from time to时代.因此,重要的是作为一名开发人员知道如何采取正确的预防措施——这意味着学习控制线程访问共享资源,比如内存、文件、数据库等.这是这个Java并发教程地址的一个主题。

### Multithreading and Concurrency in Java

### 用Java多线程和并发性

Java was one of the first languages to make multithreading easily available to developers. Java had multithreading capabilities from the very beginning. Therefore, Java developers often face the problems described above. That is the reason I am writing this trail on Java concurrency. As notes to myself, and any fellow Java developer whom may benefit from it.

Java语言是第一个多线程容易给开发商。Java多线程功能从一开始.因此,Java开发人员经常面临上述问题。这是我写这小道的原因在Java并发性.对自己笔记,和任何其他Java开发人员可能从中受益。

The trail will primarily be concerned with multithreading in Java, but some of the problems occurring in multithreading are similar to problems occurring in multitasking and in distributed systems. References to multitasking and distributed systems may therefore occur in this trail too. Hence the word "concurrency" rather than "multithreading".

跟踪主要会涉及多线程在Java中,但有些问题发生在多线程类似问题发生在多任务处理和分布式系统.引用多任务和分布式系统也可能因此发生在这小道。因此这个词“并发”而不是“多线程”。

### Java Concurrency in 2015 and Forward

### 2015年Java并发和转发

A lot has happened in the world of concurrent architecture and design since the first Java concurrency books were written, and even since the Java 5 concurrency utilities were released.

世界上发生了很多并发架构和设计以来第一个Java并发写书,甚至自Java 5并发实用程序被释放。

New, asynchronous "shared-nothing" platforms and APIs like Vert.x and Play / Akka and Qbit have emerged. These platforms use a different concurrency model than the standard Java / JEE concurrency model of threading, shared memory and locking. New non-blocking concurrency algorithms have been published, and new non-blocking tools like the LMax Disrupter have been added to our toolkits. New functional programming parallelism has been introduced with the Fork and Join framework in Java 7, and the collection streams API in Java 8.

新、异步“无共享”平台和api喜欢绿色。x和播放/ Akka Qbit已经出现.这些平台上使用不同的并发模型比标准Java / JEE线程的并发模型,共享内存和锁定.新的非阻塞并发算法已经出版,和非阻塞工具像LMax破坏者已经增加了我们的工具包.新函数式编程并行性与Fork和Join框架引入了在Java 7中,和收集流API在Java 8。

With all these new developments it is about time that I updated this Java Concurrency tutorial. Therefore, this tutorial is once again work in progress. New tutorials will be published whenever time is available to write them.

所有这些新发展的时候了,我这个Java并发更新教程。因此,本教程是再一次工作进展.新教程时将发表时间可以写他们。

### Java Concurrency Study Guide

### Java并发学习指南

If you are new to Java concurrency, I would recommend that you follow the study plan below. You can find links to all the topics in the menu in the left side of this page too.

如果您是Java并发,我建议你遵循下面的学习计划。你可以找到所有的主题的链接在页面的左边菜单。

General concurrency and multithreading theory:

一般和多线程并发性理论:

- Multithreading Benefits
- Multithreading Costs
- Concurrency Models
- Same-threading
- Concurrency vs. Parallelism

- 多线程的好处
- 多线程的成本
- 并发模型
- Same-threading
- 并发和并行性

The basics of Java concurrency:

基本的Java并发性:

- Creating and Starting Java Threads
- Race Conditions and Critical Sections
- Thread Safety and Shared Resources
- Thread Safety and Immutability
- Java Memory Model
- Java Synchronized Blocks
- Java Volatile Keyword
- Java ThreadLocal
- Java Thread Signaling

- 创建和启动Java线程
- 竞争条件和关键部分
- 线程安全,共享资源
- 线程安全性和不变性
- Java内存模型
- Java Synchronized块
- Java不稳定的关键字
- Java ThreadLocal
- Java线程的信号

Typical problems in Java concurrency:

典型的Java并发性问题:

- Deadlock
- Deadlock Prevention
- Starvation and Fairness
- Nested Monitor Lockout
- Slipped Conditions

- 死锁
- 死锁预防
- 饥饿和公平
- 嵌套监控锁定
- 了条件

Java concurrency constructs that help against the issues above:

Java并发结构帮助对上面的问题:

- Locks in Java
- Read / Write Locks in Java
- Reentrance Lockout
- Semaphores
- Blocking Queues
- Thread Pools
- Compare and Swap

- 锁在Java中
- 读/写锁在Java中
- 再进入停摆
- 信号量
- 阻塞队列
- 线程池
- 比较和交换

Further topics:

进一步的主题:

- Anatomy of a Synchronizer
- Non-blocking Algorithms
- Amdahl's Law
- References

- 分析同步器
- 非阻塞算法
- Amdahl法则
- 参考文献

<http://tutorials.jenkov.com/java-concurrency/index.html>



