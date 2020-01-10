## Memory Model

##内存模型

### Handleless Objects

###无柄对象

In previous versions of the Java virtual machine, such as the Classic VM, indirect handles are used to represent object references. While this makes relocating objects easier during garbage collection, it represents a significant performance bottleneck, because accesses to the instance variables of Java programming language objects require two levels of indirection.


在Java虚拟机的早期版本中，例如Classic VM，间接句柄用于表示对象引用。尽管这使垃圾回收期间的对象重定位更加容易，但是它却代表了很大的性能瓶颈，因为对Java编程语言对象的实例变量的访问需要两个间接级别。

In the Java HotSpot VM, no handles are used by Java code. Object references are implemented as direct pointers. This provides C-speed access to instance variables. When an object is relocated during memory reclamation, the garbage collector is responsible for finding and updating all references to the object in place.

在Java HotSpot VM中，Java代码不使用任何句柄。对象引用被实现为直接指针。这提供了对实例变量的C速访问。在内存回收期间重定位对象时，垃圾收集器负责查找和更新对适当对象的所有引用。

### Two-Word Object Headers

###两字对象标头

The Java HotSpot VM uses a two machine-word object header, as opposed to three words in the Classic VM. Since the average Java object size is small, this has a significant impact on space consumption -- saving approximately eight percent in heap size for typical applications. The first header word contains information such as the identity hash code and GC status information. The second is a reference to the object's class. Only arrays have a third header field, for the array size.

Java HotSpot VM使用两个机器字对象标头，而不是Classic VM中的三个字。由于Java对象的平均大小很小，因此这对空间消耗有重大影响-对于典型应用程序，堆大小节省了大约8％。第一个标题字包含诸如身份哈希码和GC状态信息之类的信息。第二个是对对象类的引用。对于数组大小，只有数组具有第三个标头字段。


### Reflective Data are Represented as Objects

###反射数据表示为对象


Classes, methods, and other internal reflective data are represented directly as objects on the heap (although those objects may not be directly accessible to Java technology-based programs). This not only simplifies the VM internal object model, but also allows classes to be collected by the same garbage collector used for other Java programming language objects.

类，方法和其他内部反射数据直接表示为堆上的对象（尽管基于Java技术的程序可能无法直接访问这些对象）。这不仅简化了VM内部对象模型，而且还允许使用与其他Java编程语言对象相同的垃圾收集器来收集类。


### Native Thread Support, Including Preemption and Multiprocessing

###本机线程支持，包括抢占和多处理

Per-thread method activation stacks are represented using the host operating system's stack and thread model. Both Java programming language methods and native methods share the same stack, allowing fast calls between the C and Java programming languages. Fully preemptive Java programming language threads are supported using the host operating system's thread scheduling mechanism.


每线程方法激活堆栈使用主机操作系统的堆栈和线程模型表示。 Java编程语言方法和本机方法都共享同一堆栈，从而允许在C和Java编程语言之间进行快速调用。使用主机操作系统的线程调度机制支持完全抢占式Java编程语言线程。

A major advantage of using native OS threads and scheduling is the ability to take advantage of native OS multiprocessing support transparently. Because the Java HotSpot VM is designed to be insensitive to race conditions caused by preemption and/or multiprocessing while executing Java programming language code, the Java programming language threads will automatically take advantage of whatever scheduling and processor allocation policies the native OS provides.


使用本机OS线程和调度的主要优点是能够透明地利用本机OS多处理支持。由于Java HotSpot VM被设计为对执行Java编程语言代码时抢占和/或多重处理引起的竞争条件不敏感，因此Java编程语言线程将自动利用本机OS提供的任何调度和处理器分配策略。



The Java HotSpot Performance Engine Architecture: <https://www.oracle.com/technetwork/java/whitepaper-135217.html#memory>
