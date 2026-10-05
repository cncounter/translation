# Java Concurrency and Multithreading Tutorial

# Java多线程与并发教程

Java Concurrency is a term that covers multithreading, concurrency and parallelism on the Java platform. That includes the Java concurrency tools, problems and solutions. This Java concurrency tutorial covers the core concepts of multithreading, concurrency constructs, concurrency problems, costs, benefits related to multithreading in Java.

Java Concurrency这个术语, 主要是指Java平台上的多线程（multithreading）、并发（concurrency）和并行（parallelism）。其中涉及并发相关的工具,问题与解决方案。本教程的内容包括： Java中多线程的概念, 怎样构造并发, 使用多线程的优势和代价、以及可能引发的问题。

### Brief History of Concurrency

### 并发简史

Back in the old days a computer had a single CPU, and was only capable of executing a single program at a time. Later came multitasking which meant that computers could execute multiple programs (AKA tasks or processes) at the same time. It wasn't really "at the same time" though. The single CPU was shared between the programs. The operating system would switch between the programs running, executing each of them for a little while before switching.

几十年前、每台计算机中只有一个CPU, 同一时间只能执行一个程序。

后来出了一种叫做“多任务”的技术，让计算机可以同时执行多个程序(或者叫任务/进程)。但这并不是真正的“同一时刻”, 而是让多个程序共享单个CPU的时间片。 操作系统负责调度，让每个程序执行一小段时间、然后根据调度算法进行切换。

Along with multitasking came new challenges for software developers. Programs can no longer assume to have all the CPU time available, nor all memory or any other computer resources. A "good citizen" program should release all resources it is no longer using, so other programs can use them.

多任务技术对程序员带来了新的挑战。一个程序不能再独占所有的CPU时间, 所有的内存、以及其他的计算资源。“五好青年”程序，不再使用之后应该释放所有的资源，让给其他程序。

Later yet came multithreading which mean that you could have multiple threads of execution inside the same program. A thread of execution can be thought of as a CPU executing the program. When you have multiple threads executing the same program, it is like having multiple CPUs execute within the same program.

接着又出现了“多线程”技术。在同一个程序中，可以执行多个线程。 一个线程就可以看成有一个CPU在执行。 如果程序中有多个线程, 看起来就像是有多个CPU在执行这个程序。

> 线程和进程在CPU看来没什么本质区别，只是程序内在逻辑上的区分。

Multithreading can be a great way to increase the performance of some types of programs. However, mulithreading is even more challenging than multitasking. The threads are executing within the same program and are hence reading and writing the same memory simultanously. This can result in errors not seen in a singlethreaded program. Some of these errors may not be seen on single CPU machines, because two threads never really execute "simultanously". Modern computers, though, come with multi core CPUs, and even with multiple CPUs too. This means that separate threads can be executed by separate cores or CPUs simultanously.

对某些程序来说， 使用多线程会有巨大的性能提升。当然, 多线程变成比多任务编程的复杂度要高一些。 同一个程序（进程）中的线程, 他们的内存地址是同一套，这些线程可以同时读写进程中的内存。 编写的不好的话，可能会出现一些在单线程情况下不会发生的错误。其中的某些错误、在单CPU的机器上不会出现,因为不会真正地同时执行。 但是呢, 现在的计算机都具备多核心CPU, 甚至是多个物理CPU。 那就会有多个CPU核心在同一时刻执行多个线程。

![](01_java-concurrency-tutorial-introduction-1.png)



If a thread reads a memory location while another thread writes to it, what value will the first thread end up reading? The old value? The value written by the second thread? Or a value that is a mix between the two? Or, if two threads are writing to the same memory location simultanously, what value will be left when they are done? The value written by the first thread? The value written by the second thread? Or a mix of the two values written?

如果一个线程在读取某个地址的内存, 而另一个线程要将数据写入这个地址, 那么第一个线程读取到的数据会是什么呢? 旧的值?还是刚刚写入的新的值? 或者是写入一半的脏数据?

又或者, 当两个线程同时写数据到相同的内存地址，结果会是什么呢? 是第一个线程写的值? 还是第二个线程写入的值? 或者是每个线程写了一部分的脏数据?

Without proper precautions any of these outcomes are possible. The behaviour would not even be predictable. The outcome could change from time to time. Therefore it is important as a developer to know how to take the right precautions - meaning learning to control how threads access shared resources like memory, files, databases etc. That is one of the topics this Java concurrency tutorial addresses.

如果不采取适当的预防措施，上述任何一种结果都有可能出现。其行为甚至可能是不可预测的，结果随时会变化。 因此, 开发者必须要了解如何采取正确的预防措施 —— 也就是学习如何去控制多个线程来访问这些共享资源, 比如内存、文件、数据库等等. 这也是本教程将要介绍的一个主题。

### Multithreading and Concurrency in Java

### Java中的多线程和并发

Java was one of the first languages to make multithreading easily available to developers. Java had multithreading capabilities from the very beginning. Therefore, Java developers often face the problems described above. That is the reason I am writing this trail on Java concurrency. As notes to myself, and any fellow Java developer whom may benefit from it.

Java语言是最早让开发人员能够方便地使用多线程的语言之一。Java从一开始就具备多线程能力。因此，Java开发人员经常要面对上面提到的问题。这也是我撰写本Java并发系列教程的原因——既是写给自己的笔记，也希望能对其他Java开发者有所帮助。

The trail will primarily be concerned with multithreading in Java, but some of the problems occurring in multithreading are similar to problems occurring in multitasking and in distributed systems. References to multitasking and distributed systems may therefore occur in this trail too. Hence the word "concurrency" rather than "multithreading".

本教程将主要讨论Java中的多线程，但多线程中出现的一些问题，与多任务和分布式系统中的问题类似。因此本教程中也会涉及多任务和分布式系统的相关内容。这也是标题使用“并发(concurrency)”而不是“多线程(multithreading)”的原因。

### Java Concurrency in 2015 and Forward

### 2015年及以后的Java并发技术

A lot has happened in the world of concurrent architecture and design since the first Java concurrency books were written, and even since the Java 5 concurrency utilities were released.

自从最早的Java并发书籍出版，甚至自从Java 5并发工具包发布以来，并发架构与设计领域已经发生了很多变化。

New, asynchronous "shared-nothing" platforms and APIs like Vert.x and Play / Akka and Qbit have emerged. These platforms use a different concurrency model than the standard Java / JEE concurrency model of threading, shared memory and locking. New non-blocking concurrency algorithms have been published, and new non-blocking tools like the LMax Disrupter have been added to our toolkits. New functional programming parallelism has been introduced with the Fork and Join framework in Java 7, and the collection streams API in Java 8.

一些新的异步“无共享(shared-nothing)”平台和API相继出现，例如 Vert.x、Play / Akka 和 Qbit。这些平台使用的并发模型，不同于标准的 Java / JEE 基于线程、共享内存和锁的并发模型。新的非阻塞并发算法陆续发表，新的非阻塞工具（如 LMAX Disruptor）也被加入了我们的工具箱。Java 7 通过 Fork/Join 框架，Java 8 通过集合 Stream API，引入了新的函数式编程并行方式。

With all these new developments it is about time that I updated this Java Concurrency tutorial. Therefore, this tutorial is once again work in progress. New tutorials will be published whenever time is available to write them.

有了这么多新进展，也确实到了更新本Java并发教程的时候。因此，本教程正在重新编写中。一旦有时间，就会发布新的章节。

### Java Concurrency Study Guide

### Java并发学习指南

If you are new to Java concurrency, I would recommend that you follow the study plan below. You can find links to all the topics in the menu in the left side of this page too.

如果你是Java并发的新手，我建议你按照下面的学习计划进行学习。你也可以在本页面左侧的菜单中找到所有主题的链接。

General concurrency and multithreading theory:

通用的并发与多线程理论：

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

Java并发基础：

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
- 竞态条件与临界区
- 线程安全与共享资源
- 线程安全与不可变性
- Java内存模型
- Java同步块(synchronized block)
- Java volatile关键字
- Java ThreadLocal
- Java线程信号

Typical problems in Java concurrency:

Java并发中的典型问题：

- Deadlock
- Deadlock Prevention
- Starvation and Fairness
- Nested Monitor Lockout
- Slipped Conditions

- 死锁
- 死锁预防
- 饥饿与公平性
- 嵌套管程锁死(Nested Monitor Lockout)
- 滑动条件(Slipped Conditions)

Java concurrency constructs that help against the issues above:

有助于解决上述问题的Java并发构件：

- Locks in Java
- Read / Write Locks in Java
- Reentrance Lockout
- Semaphores
- Blocking Queues
- Thread Pools
- Compare and Swap

- Java中的锁
- Java中的读/写锁
- 重入锁死(Reentrance Lockout)
- 信号量
- 阻塞队列
- 线程池
- 比较并交换(CAS)

Further topics:

进一步的主题:

- Anatomy of a Synchronizer
- Non-blocking Algorithms
- Amdahl's Law
- References

- 同步器剖析(Anatomy of a Synchronizer)
- 非阻塞算法
- Amdahl法则
- 参考文献

<http://tutorials.jenkov.com/java-concurrency/index.html>



