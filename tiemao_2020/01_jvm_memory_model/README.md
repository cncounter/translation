## Memory Model

## JVM技术细节: HotSpot的内存模型

### Handleless Objects

### 1、对象无句柄

In previous versions of the Java virtual machine, such as the Classic VM, indirect handles are used to represent object references. While this makes relocating objects easier during garbage collection, it represents a significant performance bottleneck, because accesses to the instance variables of Java programming language objects require two levels of indirection.


在早期的JVM版本，例如 Classic VM 实现中，使用了 `间接句柄(indirect handle)` 来表示对象引用。
虽然使用这种方式使得垃圾收集器在重定位对象（relocating）时非常方便，但却导致了严重的性能瓶颈，因为每次访问Java对象的实例变量都需要两步操作。

In the Java HotSpot VM, no handles are used by Java code. Object references are implemented as direct pointers. This provides C-speed access to instance variables. When an object is relocated during memory reclamation, the garbage collector is responsible for finding and updating all references to the object in place.

HotSpot 推出以后，Java 代码就不再使用任何句柄。
对象引用使用 `直接指针(direct pointer)` 方式来实现。 在访问实例变量时, 其性能和C语言一样高效。
当然，在内存回收期间，GC重定位(relocated)对象时，则需要查找并更新这个对象的所有引用。


### Two-Word Object Headers

### 2、用2个机器字表示对象头

The Java HotSpot VM uses a two machine-word object header, as opposed to three words in the Classic VM. Since the average Java object size is small, this has a significant impact on space consumption -- saving approximately eight percent in heap size for typical applications. The first header word contains information such as the identity hash code and GC status information. The second is a reference to the object's class. Only arrays have a third header field, for the array size.

HotSpot VM 使用两个机器字(machine-word)作为对象头(object header)，而不是像 Classic VM 那样使用三个机器字。
由于大部分情况下，Java对象占用的内存空间平均值都很小，所以将对象头从3个机器字降到2个机器字的长度，能很明显地降低内存空间的消耗： 对大部分应用程序来说，节省的堆内存空间在8％左右。

- 对象头中, 第一个机器字，用来保存唯一哈希码，GC状态信息等等。
- 第二个机器字用来保存该对象 class 的引用。
- 数组则特殊一点，其对象头中有第三个部分(int值)，用于保存数组长度。


### Reflective Data are Represented as Objects

### 3、用对象表示反射数据


Classes, methods, and other internal reflective data are represented directly as objects on the heap (although those objects may not be directly accessible to Java technology-based programs). This not only simplifies the VM internal object model, but also allows classes to be collected by the same garbage collector used for other Java programming language objects.

类(class)，方法(method)和其他内部反射数据，都使用堆内存中的对象来表示（虽然这些对象无法通过常规的Java代码直接访问）。
这不仅简化了JVM内部的对象模型，而且还允许垃圾收集器像回收普通Java对象一样，来回收class。


### Native Thread Support, Including Preemption and Multiprocessing

### 4、Native线程支持，包括抢占和多处理

Per-thread method activation stacks are represented using the host operating system's stack and thread model. Both Java programming language methods and native methods share the same stack, allowing fast calls between the C and Java programming languages. Fully preemptive Java programming language threads are supported using the host operating system's thread scheduling mechanism.


每个线程的活动方法栈(activation stacks), 都使用底层操作系统的栈和线程模型来表示。
Java方法和native方法都使用同样的栈，从而允许在C语言编写的JNI方法和Java方法之间进行快速调用。
通过底层操作系统的线程调度机制, 来支持完全抢占式的Java线程。

A major advantage of using native OS threads and scheduling is the ability to take advantage of native OS multiprocessing support transparently. Because the Java HotSpot VM is designed to be insensitive to race conditions caused by preemption and/or multiprocessing while executing Java programming language code, the Java programming language threads will automatically take advantage of whatever scheduling and processor allocation policies the native OS provides.


使用底层操作系统线程，以及操作系统级的调度， 最主要的优势在于，能够透明地利用操作系统对多处理（native OS multiprocessing）的支持。
由于HotSpot VM被设计为对竞态条件不敏感(race condition, 竞态条件由抢占和/或多处理引起)， 所以Java线程会自动利用底层操作系统提供的所有调度和处理器分配策略。


## 原文链接

- [The Java HotSpot Performance Engine Architecture](https://www.oracle.com/technetwork/java/whitepaper-135217.html#memory)

- [CSDN文章链接: JVM技术细节: HotSpot的内存模型](https://renfufei.blog.csdn.net/article/details/104150007)

- [GitHub中英双语版本: JVM技术细节: HotSpot的内存模型](https://github.com/cncounter/translation/blob/master/tiemao_2020/01_jvm_memory_model/README.md)
