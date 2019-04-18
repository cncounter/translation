# Java Concurrency and Multithreading Tutorial

Java Concurrency is a term that covers multithreading, concurrency and parallelism on the Java platform. That includes the Java concurrency tools, problems and solutions. This Java concurrency tutorial covers the core concepts of multithreading, concurrency constructs, concurrency problems, costs, benefits related to multithreading in Java.

### Brief History of Concurrency

Back in the old days a computer had a single CPU, and was only capable of executing a single program at a time. Later came multitasking which meant that computers could execute multiple programs (AKA tasks or processes) at the same time. It wasn't really "at the same time" though. The single CPU was shared between the programs. The operating system would switch between the programs running, executing each of them for a little while before switching.

Along with multitasking came new challenges for software developers. Programs can no longer assume to have all the CPU time available, nor all memory or any other computer resources. A "good citizen" program should release all resources it is no longer using, so other programs can use them.

Later yet came multithreading which mean that you could have multiple threads of execution inside the same program. A thread of execution can be thought of as a CPU executing the program. When you have multiple threads executing the same program, it is like having multiple CPUs execute within the same program.

Multithreading can be a great way to increase the performance of some types of programs. However, mulithreading is even more challenging than multitasking. The threads are executing within the same program and are hence reading and writing the same memory simultanously. This can result in errors not seen in a singlethreaded program. Some of these errors may not be seen on single CPU machines, because two threads never really execute "simultanously". Modern computers, though, come with multi core CPUs, and even with multiple CPUs too. This means that separate threads can be executed by separate cores or CPUs simultanously.

![](01_java-concurrency-tutorial-introduction-1.png)


If a thread reads a memory location while another thread writes to it, what value will the first thread end up reading? The old value? The value written by the second thread? Or a value that is a mix between the two? Or, if two threads are writing to the same memory location simultanously, what value will be left when they are done? The value written by the first thread? The value written by the second thread? Or a mix of the two values written?

Without proper precautions any of these outcomes are possible. The behaviour would not even be predictable. The outcome could change from time to time. Therefore it is important as a developer to know how to take the right precautions - meaning learning to control how threads access shared resources like memory, files, databases etc. That is one of the topics this Java concurrency tutorial addresses.

### Multithreading and Concurrency in Java

Java was one of the first languages to make multithreading easily available to developers. Java had multithreading capabilities from the very beginning. Therefore, Java developers often face the problems described above. That is the reason I am writing this trail on Java concurrency. As notes to myself, and any fellow Java developer whom may benefit from it.

The trail will primarily be concerned with multithreading in Java, but some of the problems occurring in multithreading are similar to problems occurring in multitasking and in distributed systems. References to multitasking and distributed systems may therefore occur in this trail too. Hence the word "concurrency" rather than "multithreading".

### Java Concurrency in 2015 and Forward

A lot has happened in the world of concurrent architecture and design since the first Java concurrency books were written, and even since the Java 5 concurrency utilities were released.

New, asynchronous "shared-nothing" platforms and APIs like Vert.x and Play / Akka and Qbit have emerged. These platforms use a different concurrency model than the standard Java / JEE concurrency model of threading, shared memory and locking. New non-blocking concurrency algorithms have been published, and new non-blocking tools like the LMax Disrupter have been added to our toolkits. New functional programming parallelism has been introduced with the Fork and Join framework in Java 7, and the collection streams API in Java 8.

With all these new developments it is about time that I updated this Java Concurrency tutorial. Therefore, this tutorial is once again work in progress. New tutorials will be published whenever time is available to write them.

### Java Concurrency Study Guide

If you are new to Java concurrency, I would recommend that you follow the study plan below. You can find links to all the topics in the menu in the left side of this page too.

General concurrency and multithreading theory:

- Multithreading Benefits
- Multithreading Costs
- Concurrency Models
- Same-threading
- Concurrency vs. Parallelism

The basics of Java concurrency:

- Creating and Starting Java Threads
- Race Conditions and Critical Sections
- Thread Safety and Shared Resources
- Thread Safety and Immutability
- Java Memory Model
- Java Synchronized Blocks
- Java Volatile Keyword
- Java ThreadLocal
- Java Thread Signaling

Typical problems in Java concurrency:

- Deadlock
- Deadlock Prevention
- Starvation and Fairness
- Nested Monitor Lockout
- Slipped Conditions

Java concurrency constructs that help against the issues above:

- Locks in Java
- Read / Write Locks in Java
- Reentrance Lockout
- Semaphores
- Blocking Queues
- Thread Pools
- Compare and Swap

Further topics:

- Anatomy of a Synchronizer
- Non-blocking Algorithms
- Amdahl's Law
- References















<http://tutorials.jenkov.com/java-concurrency/index.html>
