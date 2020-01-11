## Memory Model

## JVM实现的内存模型

### Handleless Objects

### 1、对象无句柄

In previous versions of the Java virtual machine, such as the Classic VM, indirect handles are used to represent object references. While this makes relocating objects easier during garbage collection, it represents a significant performance bottleneck, because accesses to the instance variables of Java programming language objects require two levels of indirection.


在早期的JVM版本，例如 Classic VM 实现中，使用 `间接句柄(indirect handle)` 来表示对象引用。
虽然使用这种方式使得GC在重定位对象时非常方便，但却导致了严重的性能瓶颈，因为每次访问Java对象的实例变量都需要两步操作。

In the Java HotSpot VM, no handles are used by Java code. Object references are implemented as direct pointers. This provides C-speed access to instance variables. When an object is relocated during memory reclamation, the garbage collector is responsible for finding and updating all references to the object in place.

HotSpot 推出以后，Java 代码不再使用任何句柄。
对象引用使用 `直接指针(direct pointer)` 来实现。 在访问实例变量时, 速度和C语言一样快。
当然，在内存回收期间，GC重定位(relocated)对象时，需要查找并更新这个对象的所有引用。


### Two-Word Object Headers

### 2、用2个机器字表示对象头

The Java HotSpot VM uses a two machine-word object header, as opposed to three words in the Classic VM. Since the average Java object size is small, this has a significant impact on space consumption -- saving approximately eight percent in heap size for typical applications. The first header word contains information such as the identity hash code and GC status information. The second is a reference to the object's class. Only arrays have a third header field, for the array size.

HotSpot VM 使用两个机器字(machine-word)作为对象头，而不是像 Classic VM 那样使用三个机器字。
由于平均下来每个Java对象占用的内存空间很小，所以对象头从3个机器字降到2个机器字，对降低内存空间的消耗还是很明显的：
对大部分应用程序来说，节省的堆内存空间在8％左右。
header 中的第一个机器字， 包含唯一哈希码，GC状态等信息。 第二个机器字则是对Class对象的引用。
数组则特殊一点，其对象头中有第三个部分(int值)，用于保存数组长度。


### Reflective Data are Represented as Objects

### 3、用对象来表示反射数据


Classes, methods, and other internal reflective data are represented directly as objects on the heap (although those objects may not be directly accessible to Java technology-based programs). This not only simplifies the VM internal object model, but also allows classes to be collected by the same garbage collector used for other Java programming language objects.

类(class)，方法(method)和其他内部反射数据，都直接使用对象来表示（虽然这些对象无法通过常规的Java代码直接访问）。
这不仅简化了JVM内部的对象模型，而且还像回收Java对象一样，允许垃圾收集器来回收class。


### Native Thread Support, Including Preemption and Multiprocessing

### 4、Native线程支持，包括抢占和多处理

Per-thread method activation stacks are represented using the host operating system's stack and thread model. Both Java programming language methods and native methods share the same stack, allowing fast calls between the C and Java programming languages. Fully preemptive Java programming language threads are supported using the host operating system's thread scheduling mechanism.


每线程方法激活堆栈使用主机操作系统的堆栈和线程模型表示。 Java编程语言方法和本机方法都共享同一堆栈，从而允许在C和Java编程语言之间进行快速调用。使用主机操作系统的线程调度机制支持完全抢占式Java编程语言线程。

A major advantage of using native OS threads and scheduling is the ability to take advantage of native OS multiprocessing support transparently. Because the Java HotSpot VM is designed to be insensitive to race conditions caused by preemption and/or multiprocessing while executing Java programming language code, the Java programming language threads will automatically take advantage of whatever scheduling and processor allocation policies the native OS provides.


使用本机OS线程和调度的主要优点是能够透明地利用本机OS多处理支持。由于Java HotSpot VM被设计为对执行Java编程语言代码时抢占和/或多重处理引起的竞争条件不敏感，因此Java编程语言线程将自动利用本机OS提供的任何调度和处理器分配策略。


## 原文链接

The Java HotSpot Performance Engine Architecture: <https://www.oracle.com/technetwork/java/whitepaper-135217.html#memory>
