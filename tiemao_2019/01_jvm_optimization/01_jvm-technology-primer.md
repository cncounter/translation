# JVM performance optimization, Part 1: A JVM technology primer

> Java performance for absolute beginners


Java applications run on the JVM, but what do you know about JVM technology? This article, the first in a series, is an overview of how a classic Java virtual machine works such as pros and cons of Java's write-once, run-anywhere engine, garbage collection basics, and a sampling of common GC algorithms and compiler optimizations. Later articles will turn to JVM performance optimization, including newer JVM designs to support the performance and scalability of today's highly concurrent Java applications.

If you are a programmer then you have undoubtedly experienced that special feeling when a light goes on in your thought process, when those neurons finally make a connection, and you open your previous thought pattern to a new perspective. I personally love that feeling of learning something new. I've had those moments many times in my work with Java virtual machine (JVM) technologies, particularly to do with garbage collection and JVM performance optimization. In this new JavaWorld series I hope to share some of that illumination with you. Hopefully you'll be as excited to learn about JVM performance as I am to write about it!

This series is written for any Java developer interested in learning more about the underlying layers of the JVM and what a JVM really does. At a high level, I will discuss garbage collection and the never-ending quest to free memory safely and quickly without impacting running applications. You'll learn about the key components of a JVM: garbage collection and GC algorithms, compiler flavors, and some common optimizations. I will also discuss why Java benchmarking is so difficult and offer tips to consider when measuring performance. Finally, I'll touch on some of the newer innovations in JVM and GC technology, including highlights from Azul's Zing JVM, IBM JVM, and Oracle's Garbage First (G1) garbage collector.

I hope you'll walk away from this series with a greater understanding of the factors that limit Java scalability today, as well as how those limitations force us to architect our Java deployments in a non-optimal way. Hopefully, you'll experience some *aha!* moments and be inspired to do something good for Java: stop accepting the limitations and work for change! If you're not already an open source contributor, perhaps this series will encourage you in that direction.

## JVM performance and the 'one for all' challenge

I have news for people who are stuck with the idea that the Java platform is inherently slow. The belief that the JVM is to blame for poor Java performance is decades old -- it started when Java was first being used for enterprise applications, and it's outdated! It *is* true that if you compare the results of running simple static and deterministic tasks on different development platforms, you will most likely see better execution using machine-optimized code over using any virtualized environment, including a JVM. But Java performance has taken major leaps forward over the past 10 years. Market demand and growth in the Java industry have resulted in a handful of garbage-collection algorithms and new compilation innovations, and plenty of heuristics and optimizations have emerged as JVM technology has progressed. I'll introduce some of them later in this series.

The beauty of JVM technology is also its biggest challenge: nothing can be assumed with a "write once, run anywhere" application. Rather than optimizing for one use case, one application, and one specific user load, the JVM constantly tracks what is going on in a Java application and dynamically optimizes accordingly. This dynamic runtime leads to a dynamic problem set. Developers working on the JVM can't rely on static compilation and predictable allocation rates when designing innovations, at least not if we want performance in production environments!

> ## A career in JVM performance

> Early in my career I realized that garbage collection is hard to "solve," and I've been fascinated with JVMs and middleware technology ever since. My passion for JVMs started when I worked on the [JRockit](http://www.infoworld.com/d/developer-world/oracle-moving-merge-jrockit-hotspot-jvms-448) team, coding a novel approach to a self-learning, self-tuning garbage collection algorithm (see [Resources](https://www.javaworld.com/article/2078623/core-java/core-java-jvm-performance-optimization-part-1-a-jvm-technology-primer.html#resources)). That project, which turned into an experimental feature of JRockit and laid ground for the [Deterministic Garbage Collection](https://www.javaworld.com/article/2078623/core-java/core-java-jvm-performance-optimization-part-1-a-jvm-technology-primer.html#resources) algorithm, started my journey through JVM technology. I've worked for BEA Systems, partnered with Intel and Sun, and was briefly employed by Oracle following its acquisition of BEA Systems. I later joined the team at Azul Systems to manage the [Zing JVM](http://www.infoworld.com/d/developer-world/azul-systems-searches-managed-runtime-breakthroughs-228), and today I work for [Cloudera](http://www.javaworld.com/javaworld/jw-12-2012/121207-cloudera-lands-big-funding-for-big-data.html).

Machine-optimized code might deliver better performance, but it comes at the cost of inflexibility, which is not a workable trade-off for enterprise applications with dynamic loads and rapid feature changes. Most enterprises are willing to sacrifice the narrowly perfect performance of machine-optimized code for the benefits of Java:

> **[Learn Java from beginning concepts to advanced design patterns in this comprehensive 12-part course!](https://pluralsight.pxf.io/c/321564/424552/7490?u=https%3A%2F%2Fwww.pluralsight.com%2Fpaths%2Fjava)**

- Ease of coding and feature development (meaning, faster time to market)
- Access to knowledgeable programmers
- Rapid development using Java APIs and standard libraries
- Portability -- no need to rewrite a Java application for every new platform

## From Java code to bytecode

As a Java programmer, you are probably familiar with coding, compiling, and executing Java applications. For the sake of example, let's assume that you have a program, `MyApp.java` and you want to run it. To execute this program you need to first compile it with `javac`, the JDK's built-in static Java language-to-bytecode compiler. Based on the Java code, `javac` generates the corresponding executable bytecode and saves it into a same-named class file: `MyApp.class`. After compiling the Java code into bytecode, you are ready to run your application by launching the executable class file with the `java` command from your command-line or startup script, with or without startup options. The class is loaded into the runtime (meaning the running Java virtual machine) and your program starts executing.

That's what happens on the surface of an everyday application execution scenario, but now let's explore what *really* happens when you call that `java`command. What is this thing called a *Java virtual machine*? Most developers have interacted with a JVM through the continuous process of tuning -- *aka*selecting and value-assigning startup options to make your Java program run faster, while deftly avoiding the infamous JVM "out of memory" error. But have you ever wondered why we need a JVM to run Java applications in the first place?

## What is a Java virtual machine?

Simply speaking, a JVM is the software module that executes Java application bytecode and translates the bytecode into hardware- and operating system-specific instructions. By doing so, the JVM enables Java programs to be executed in different environments from where they were first written, without requiring any changes to the original application code. Java's portability is key to its popularity as an enterprise application language: developers don't have to rewrite application code for every platform because the JVM handles the translation and platform-optimization.

> A JVM basically is a virtual execution environment acting as a machine for bytecode instructions, while assigning execution tasks and performing memory operations through interaction with underlying layers.

A JVM also takes care of dynamic resource management for running Java applications. This means it handles allocating and de-allocating memory, maintaining a consistent thread model on each platform, and organizing the executable instructions in a way that is suited for the CPU architecture where the application is executed. The JVM frees the programmer from keeping track of references between objects and knowing how long they should be kept in the system. It also frees us from having to decide exactly when to issue explicit instructions to free up memory -- an acknowledged pain point of non-dynamic programming languages like C.

You could think about the JVM as a specialized operating system for Java; its job is to manage the runtime environment for Java applications. A JVM basically is a virtual execution environment acting as a machine for bytecode instructions, while assigning execution tasks and performing memory operations through interaction with underlying layers.

## JVM components overview

There's a lot more to write about JVM internals and performance optimization. As foundation for upcoming articles in this series, I'll conclude with an overview of JVM components. This brief tour will be especially helpful for developers new to the JVM, and should prime your appetite for more in-depth discussions later in the series.

## From one language to another -- about Java compilers

A *compiler* takes one language as an input and produces an executable language as an output. A Java compiler has two main tasks:

1. Enable the Java language to be more portable, not tied into any specific platform when first written
2. Ensure that the outcome is efficient execution code for the intended target execution platform

Compilers are either static or dynamic. An example of a static compiler is `javac`. It takes Java code as input and translates it into bytecode -- a language that is executable by the Java virtual machine. **Static compilers** interpret the input code once and the output executable is in the form that will be used when the program executes. Because the input is static you will always see the same outcome. Only when you make changes to your original source and recompile will you see a different result.

**Dynamic compilers**, such as [Just-In-Time (JIT)](https://www.javaworld.com/article/2078623/core-java/core-java-jvm-performance-optimization-part-1-a-jvm-technology-primer.html#resources) compilers, perform the translation from one language to another dynamically, meaning they do it as the code is executed. A JIT compiler lets you collect or create runtime profiling data (by the means of inserting performance counters) and make compiler decisions on the fly, using the environment data at hand. Dynamic compilation makes it possible to better sequence instructions in the compiled-to language, replace a set of instructions with more efficient sets, or even eliminate redundant operations. Over time you can collect more code-profiling data and make additional and better compilation decisions; altogether this is usually referred to as code optimization and recompilation.

Dynamic compilation gives you the advantage of being able to adapt to dynamic changes in behavior or application load over time that drive the need for new optimizations. This is why dynamic compilers are very well suited to Java runtimes. The catch is that dynamic compilers can require extra data structures, thread resources, and CPU cycles for profiling and optimization. For more advanced optimizations you'll need even more resources. In most environments, however, the overhead is very small for the execution performance improvement gained -- five or 10 times better performance than what you would get from pure interpretation (meaning, executing the bytecode as-is, without modification).



## Allocation leads to garbage collection

*Allocation* is done on a per-thread basis in each "Java process dedicated memory address space," also known as the Java heap, or heap for short. Single-threaded allocation is common in the client-side application world of Java. Single-threaded allocation quickly becomes non-optimal in the enterprise application and workload-serving side, however, because it doesn't take advantage of the parallelism in modern multicore environments.

Parallell application design also forces the JVM to ensure that multiple threads do not allocate the same address space at the same time. You could control this by putting a lock on the entire allocation space. But this technique (a so-called *heap lock*) comes at a cost, as holding or queuing threads can cause a performance hit to resource utilization and application performance. A plus side of multicore systems is that they've created a demand for various new approaches to resource allocation in order to prevent the bottlenecking of single-thread, serialized allocation.

A common approach is to divide the heap into several partitions, where each partition is of a "decent size" for the application -- obviously something that would need tuning, as allocation rate and object sizes vary significantly for different applications, as well as by number of threads. A *Thread Local Allocation Buffer* (TLAB), or sometimes *Thread Local Area* (TLA), is a dedicated partition that a thread allocates freely within, without having to claim a full heap lock. Once the area is full, the thread is assigned a new area until the heap runs out of areas to dedicate. When there's not enough space left to allocate the heap is "full," meaning the empty space on the heap is not large enough for the object that needs to be allocated. When the heap is full, garbage collection kicks in.

## Fragmentation

A catch with the use of TLABs is the risk of inducing memory inefficiency by fragmenting the heap. If an application happens to allocate object sizes that do not add up to or fully allocate a TLAB size, there is a risk that a tiny empty space too small to host a new object will be left. This leftover space is referred to as a "fragment." If the application also happens to keep references to objects that are allocated next to these leftover spaces then the space could remain un-used for a long time.

*Fragmentation* is what happens when fragments are scattered over the heap -- wasting heap space with tiny pieces of un-used memory. Configuring the "wrong" TLAB size for your application allocation behavior (with regard to object sizes and mix of object sizes and reference holding rate) is one path to an increasingly fragmented heap. As the application continues to run, the number of wasted fragmented spaces will come to hold an increasing portion of the free memory on the heap. Fragmentation causes decreased performance as the system is unable to allocate enough space for new application threads and objects. The garbage collector subsequently works harder to prevent out-of-memory exceptions.

TLAB waste can be worked around. One way to temporarily or completely avoid fragmentation is to tune TLAB size on a per-application basis. This approach typically requires re-tuning as soon as your application allocation behavior changes. It is also possible to use sophisticated JVM algorithms and other approaches to organize heap partitions for more efficient memory allocation. For instance, a JVM could implement *free-lists*, which are linked lists of free memory chunks of specific sizes. A consecutive free chunk of memory is linked to a linked list of other chunks of a similar size, thus creating a handful of lists, each with its own size range. In some case using free-lists leads to a better fitted-memory allocation approach. Threads allocating a certain-sized object are enabled to allocate it in chunks close to the object's size, generating potentially less fragmentation than if you just relied on fixed-sized TLABs.

> #### GC trivia

> Some early garbage collectors had multiple old generations, but it emerged that more than two old generation spaces resulted in more overhead than value.

Another way to optimize allocation versus fragmentation is to create a so-called *young generation*, which is a dedicated heap area (e.g., address space) where you will allocate all new objects. The rest of the heap becomes the so-called *old generation*. The old generation is left for the allocation of longer lived objects, meaning objects that have survived garbage collection or large objects that are assumed to live for a very long time. In order to better understand this approach to allocation we need to talk a bit about garbage collection.

## Garbage collection and application performance

Garbage collection is the operation performed by the JVM's garbage collector to free up occupied heap memory that is no longer referenced. When a garbage collection is first triggered, all objects that are still referenced are kept, and the space occupied by previously referenced objects is freed or reclaimed. When all reclaimable memory has been collected, the space is up for grabs and ready to be allocated again by new objects.

A garbage collector should never reclaim a referenced object; doing so would break the JVM standard specification. An exception to this rule is a soft or [weak reference](http://java.sun.com/docs/books/performance/1st_edition/html/JPAppGC.fm.html) (if defined as such) that could be collected if the garbage collector were approaching a state of running out of memory. I strongly recommend that you try to avoid weak references as much as possible, however, because ambiguity in the Java specification has led to misinterpretation and error in their use. And besides, Java is designed for dynamic memory management, so you shouldn't have to think about where and when memory should be released.

The challenge for a garbage collector is to reclaim memory without impacting running applications more than necessary. If you don't garbage-collect enough, your application will run out of memory; if you collect too frequently you'll lose throughput and response time, which will negatively impact running applications.

## GC algorithms

There are many different garbage collection algorithms. Later in this series we will deep dive into a few. On the highest level, the main two approaches to garbage collection are reference counting and tracing collectors.

- **Reference counting collectors** keep track of how many references an object has pointing to it. Once the count for an object becomes zero, the memory can immediately be reclaimed, which is one of the advantages of this approach. The difficulties with a reference-counting approach are circular structures and keeping all the reference counts up to date.
- **Tracing collectors** mark each object that is still referenced, iteratively following and marking all objects referenced by already marked objects. Once all still referenced objects are marked "live," all non-marked space can be reclaimed. This approach handles circular structures, but in most cases the collector has to wait until marking is complete before it can reclaim the unreferenced memory.

There are different ways to implement the above approaches. The more famous algorithms are *marking or copying* algorithms and *parallel or concurrent*algorithms. I'll talk about these in detail later in the series.

Generational garbage collection means dedicating separate address spaces on the heap for new objects and older ones. By "older objects" I mean objects that have survived a number of garbage collections. Having a young generation for new allocations and an old generation for surviving objects reduces fragmentation by quickly reclaiming memory occupied by short-lived objects, and by moving long-living objects closer together as they are promoted to the old generation address space. All of this reduces the the risk of fragments between long-living objects and protects the heap from fragmentation. A positive side-effect of having a young generation is also that it delays the need for the more costly collection of the old generation, as you are constantly reusing the same space for short-lived objects. (Old-space collection is more costly because the long-lived objects that live there contain more references to be traversed.)

A final algorithm improvement worth mentioning is *compaction*, which is a way to manage heap fragmentation. Compaction basically means moving objects together to free up larger consecutive chunks of memory. If you are familiar with disk fragmentation and the tools for handling it then you will find that compaction is similar, but works on Java heap memory. I'll discuss compaction in more detail later in this series.

## In conclusion: Reflection points and highlights

A JVM enables portability ("write once, run anywhere") and dynamic memory management, both key features of the Java platform and reasons for its popularity and productivity.

In this first article in the *JVM performance optimization* series I've explained how a compiler translates bytecode to target-platform instruction languages and helps optimize the execution of your Java program *dynamically*. There are different compilers for different application needs.

I've also briefly discussed memory allocation and garbage collection, and how both relate to Java application performance. Basically, the higher the allocation rate of a Java application, the faster your heap fills up and the more frequently garbage collection is triggered. The challenge of garbage collection is to reclaim enough memory for your application needs without impacting running applications more than necessary, but to do so before the application runs out of memory. In future articles we'll explore the details of both traditional and more novel approaches to garbage collection for JVM performance optimization.

> Eva Andreasson has been involved with Java virtual machine technologies, SOA, cloud computing, and other enterprise middleware solutions for 10 years. She joined the startup Appeal Virtual Solutions (later acquired by BEA Systems) in 2001 as a developer of the JRockit JVM. Eva has been awarded two patents for garbage collection heuristics and algorithms. She also pioneered Deterministic Garbage Collection which later became productized through JRockit Real Time. Eva has worked closely with Sun and Intel on technical partnerships, as well as various integration projects of JRockit Product Group, WebLogic, and Coherence (post Oracle acquisition in 2008). In 2009 Eva joined [Azul Systems](http://www.azulsystems.com/) as product manager for the new Zing Java Platform. Recently she switched gears and joined the team at [Cloudera](http://www.cloudera.com/company/)as senior product manager for Cloudera's Hadoop distribution, where she is engaged in the exciting future and innovation path of highly scalable, distributed data processing frameworks.

[Learn more about this topic]()["]()

- [To Collect or Not To Collect.](https://www.usenix.org/conference/java-vm-02/collect-or-not-collect-machine-learning-memory-management)" (Eva Andreasson, Frank Hoffmann, Olof Lindholm; JVM-02: Proceedings of the Java Virtual Machine Research and Technology Symposium, 2002): Presents the authors' research into an adaptive decision process that determines which garbage collector technique should be invoked and how it should be applied."
- [Reinforcement Learning for a dynamic JVM](http://www.nada.kth.se/utbildning/grukth/exjobb/rapportlistor/2002/Rapporter02/andreasson_eva_02041.pdf)" (Eva Andreasson, KTH Royal Institute of Technology, 2002): Master thesis report on how to use reinforcement learning to better optimize the decision of when to start concurrent garbage collection for a dynamic workload."
- [Deterministic Garbage Collection: Unleash the Power of Java with Oracle JRockit Real Time](http://www.oracle.com/us/technologies/java/oracle-jrockit-real-time-1517310.pdf)" (An Oracle White Paper, August 2008): Learn more about the Deterministic Garbage Collection algorithm in JRockit Real Time.
- [Why is Java faster when using a JIT vs. compiling to machine code?](http://stackoverflow.com/questions/1878696/why-is-java-faster-when-using-a-jit-vs-compiling-to-machine-code) (Stackoverflow, December 2009): A thread discussion for learning more about Just-in-Time compiler technology.
- [Zing](http://www.azulsystems.com/products/zing/virtual-machine): A fully Java compliant highly scalable software platform that includes an application-aware resource controller and zero overhead, always-on production visibility and diagnostic tools. Zing incorporates industry-leading, proven technology to allow TBs memory heap sizes per instance with sustained throughput under dynamic load and extreme memory allocation rates common for Java applications."
- [G1: Java's Garbage First Garbage Collector](http://www.drdobbs.com/jvm/g1-javas-garbage-first-garbage-collector/219401061)" (Eric Bruno, Dr. Dobb's, August 2009): A good overview of GC and introduction to the G1 garbage collector.
- [*Oracle JRockit: The Definitive Guide*](http://www.packtpub.com/oracle-jrockit-definitive-guide/book?tag=) (Marcus Hirt, Marcus Lagergren; Packt Publishing, 2010): A complete guide to the JRockit JVM.





原文链接:

- <https://www.javaworld.com/article/2078623/core-java/core-java-jvm-performance-optimization-part-1-a-jvm-technology-primer.html>

