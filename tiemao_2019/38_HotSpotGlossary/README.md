# HotSpot Glossary of Terms

# JVM相关术语和定义（HotSpot版）

[TOC]

A work in progress, especially as the HotSpot VM evolves. But a place to put definitions of things so we only have to define them once. There are empty entries (marked TBD for "to be defined") because we think of things that we need to define faster than we think of good definitions.


随着HotSpot VM的发展, 相关的术语定义一直是一项正在进行中的工作。
我们希望只在统一的地方定义一次。
文中可能会有一些空条目(使用 TBD 标记，表示“待定义，to be defined”)，因为需要定义的东西，比已经定义好的要多。



## 1、`adaptive spinning`, 适应性自旋

An optimization technique whereby a thread spins waiting for a change-of-state to occur (typically a flag that represents some event has occurred - such as the release of a lock) rather than just blocking until notified that the change has occurred. The "adaptive" part comes from the policy decisions that control how long the thread will spin until eventually deciding to block.

"`适应性自旋`" 是一种优化技术，通过适应性自旋技术，线程在等待状态发生改变时会先进行一定次数的旋转, 而不是单纯阻塞并等待通知事件。(通常是一个表示某个事件已经发生的标志 —— 比如释放锁)。
为什么叫 “适应性” 呢? 是因为控制线程在阻塞之前需要旋转多长时间，是由策略来决定的。


## 2、`biased locking`, 偏向锁

An optimization in the VM that leaves an object as logically locked by a given thread even after the thread has released the lock. The premise is that if the thread subsequently reacquires the lock (as often happens), then reacquisition can be achieved at very low cost. If a different thread tries to acquire a biased lock then the bias must be revoked from the current bias owner.

"`偏向锁`" 是JVM的一种优化，让一个对象在逻辑上被某个特定的线程锁定，即使该线程已经释放了锁。
这样优化的前提是，假设大部分情况下都是该线程在后面的业务中继续获取这个对象锁，那么就可以用很低的开销成本来实现重新获得锁。
如果另一个线程试图获取一个偏置锁，则必须先以安全的方式撤销偏置。

## 3、`block start table`, 块起始表

A table that shows, for a region of the heap, where the object starts that comes on to this region from lower addresees. Used, for example, with the card table variant of the remembered set.

对于堆中的一个区域(region)，都有一个 table, 用来表示有哪些从地址值较小的内存区指向本区域的对象的开始位置。
例如，与 remembered set 一起使用的卡表变体(card table variant)。

## 4、`bootstrap classloader`, 引导类加载器

The logical classloader that has responsibility for loading the classes (and resources) that are found in the boot-classpath - typically the core Java platform classes. Typically implemented as part of the VM, by historical convention the bootstrap classloader is represented by NULL at the Java API level.

这是一款逻辑上的类加载器，负责加载启动类路径中找到的类和资源，一般是指Java平台的核心类。
通常作为JVM实现的一部分，根据历史约定，引导类加载器在Java API级别上显示为 `NULL`。

## 5、`bytecode verification`, 字节码验证

A step in the linking process of a class where the methods bytecodes are analyzed to ensure type-safety.

在类加载和链接过程中的一个步骤， 在这个步骤中将方法字节码验证并解析， 以确保类型安全。

类的链接过程中的一个步骤，其中方法字节码被分析以确保类型安全。

## 6、`C1 compiler`, C1编译器

Fast, lightly optimizing bytecode compiler. Performs some value numbering, inlining, and class analysis. Uses a simple CFG-oriented SSA "high" IR, a machine-oriented "low" IR, a linear scan register allocation, and a template-style code generator.

快速、轻量优化的字节码编译器。 比如会执行：值编号、内联和类分析等操作。
使用简单的面向配置的 SSA “高级别” IR、面向机器的 “底层” IR、 线性扫描寄存器分配，模板风格的代码生成器。

## 7、`C2 compiler`, C2编译器

Highly optimizing bytecode compiler, also known as 'opto'. Uses a "sea of nodes" SSA "ideal" IR, which lowers to a machine-specific IR of the same kind. Has a graph-coloring register allocator; colors all machine state, including local, global, and argument registers and stack. Optimizations include global value numbering, conditional constant type propagation, constant folding, global code motion, algebraic identities, method inlining (aggressive, optimistic, and/or multi-morphic), intrinsic replacement, loop transformations (unswitching, unrolling), array range check elimination.

高度优化的字节码编译器， 也称为 'opto'。 使用 “节点海洋” SSA “理想” IR， 深入到同一类型的机器特定IR。
具有着色寄存器分配器; 为所有机器状态着色，包括局部、全局和参数寄存器，栈。
优化包括全局值编号、条件常量类型传播、常量折叠、全局代码移动、代数恒等式、方法内联(积极的、乐观的和/或多态的)、内部替换、循环转换(不切换、展开)、数组范围检查消除。

## 8、`card table`， 卡表

A kind of remembered set that records where oops have changed in a generation.

一种记忆集，用来记录 oops 指针在分代中的改变。

## 9、`class data sharing`, 类数据共享

A startup optimization that records the in-memory form of some classes, so that that form can be mapped into memory by a subsequent run of the virtual machine, rather than loading those classes from their class files.

一种启动时的优化，将某些类的信息放在内存中，以便后续启动的另一个虚拟机可以通过这种形式将类映射到内存中，而不再从 class files 中加载这些类。

## 10、`class hierachy analysis`， 类层次分析

Also known as 'CHA'. Analysis of the class tree used by a compiler to determine if the receiver at a virtual call site has a single implementor. If so, the callee can be inlined or the compiler can employ some other static call mechanism.

简写为 'CHA'。 对编译器使用的class树进行分析，以确定虚拟调用位置的接收者是否只有一个实现。
如果满足这个条件，则可以将此调用方法内联，或者编译器也可以使用其他一些静态调用机制。


## 11、`code cache`, 代码缓存区

A special heap that holds compiled code. These objects are not relocated by the GC, but may contain oops, which serve as GC roots.

一块特殊的堆内存空间，用于存放被编译器编译后的代码。 这些对象不会被GC重定位， 但有可能包含oops，也就会成为GC根。

- `compaction`

A garbage collection technique that results in live objects occupying a dense portion of the virtual address space, and available space in another portion of the address space. Cf. free list.

- `concurrency`

Concurrency, or more specifically concurrent programming, is the logical simultaneous execution of multiple instruction streams. If multiple processors are available then the logical simultaneity can be physical simultaneity - `this is known as 'parallelism'`

- `concurrent garbage collection`

A garbage collection algorithm that does most (if not all) of its work while the Java application threads are still running.

- `copying garbage collection`

A garbage collection algorithm that moves objects during the collection.

- `deoptimization`

The process of converting an compiled (or more optimized) stack frame into an interpreted (or less optimized) stack frame. Also describes the discarding of an nmethod whose dependencies (or other assumptions) have been broken. Deoptimized nmethods are typically recompiled to adapt to changing application behavior. Example: A compiler initially assumes a reference value is never null, and tests for it using a trapping memory access. Later on, the application uses null values, and the method is deoptimized and recompiled to use an explicit test-and-branch idiom to detect such nulls.

- `dependency`

An optimistic assumption associated with an nmethod, which allowed the compiler to emit improved code into the nmethod. Example: A given class has no subclasses, which simplifies method dispatch and type testing. The loading of new classes (or replacement of old classes) can cause dependencies to become false, which requires dependent nmethods to be discarded and activations of those nmethods to be deoptimized.

- `eden`

A part of the Java object heap where object can be created efficiently.

- `free list`

A storage management technique in which unused parts of the Java object heap are chained one to the next, rather than having all of the unused part of the heap in a single block.

- `garbage collection`

The automatic management of storage.

- `garbage collection root`

A pointer into the Java object heap from outside the heap. These come up, e.g., from static fields of classes, local references in activation frames, etc.

- `GC map`

A description emitted by the JIT (C1 or C2) of the locations of oops in registers or on stack in a compiled stack frame. Each code location which might execute a safepoint has an associated GC map. The GC knows how to parse a frame from a stack, to request a GC map from a frame's nmethod, and to unpack the GC map and manage the indicated oops within the stack frame.

- `generational garbage collection`

A storage management technique that separates objects expected to be referenced for different lengths of time into different regions of the heap, so that different algorithms can be applied to the collection of those regions.

- `handle`

A memory word containing an oop. The word is known to the GC, as a root reference. C/C++ code generally refers to oops indirectly via handles, to enable the GC to find and manage its root set more easily. Whenever C/C++ code blocks in a safepoint, the GC may change any oop stored in a handle. Handles are either 'local' (thread-specific, subject to a stack discipline though not necessarily on the thread stack) or global (long-lived and explicitly deallocated). There are a number of handle implementations throughout the VM, and the GC knows about them all.

- `hot lock`

A lock that is highly contended.

- `interpreter`

A VM module which implements method calls by individually executing bytecodes. The interpreter has a limited set of highly stylized stack frame layouts and register usage patterns, which it uses for all method activations. The Hotspot VM generates its own interpreter at start-up time.

- `JIT compilers`

An on-line compiler which generates code for an application (or class library) during execution of the application itself. ("JIT" stands for "just in time".) A JIT compiler may create machine code shortly before the first invocation of a Java method. Hotspot compilers usually allow the interpreter ample time to "warm up" Java methods, by executing them thousands of times. This warm-up period allows a compiler to make better optimization decisions, because it can observe (after initial class loading) a more complete class hierarchy. The compiler can also inspect branch and type profile information gathered by the interpreter.

- `JNI`

The Java Native Interface - `a specification and API for how Java code can call out to native C code, and how native C code can call into the Java VM`

- `JVM TI`

The Java Virtual Machine Tools Interface - `a standard specification and API that is used by development and monitoring tools. See JVM TI for more information.`

- `klass pointer`

The second word of every object header. Points to another object (a metaobject) which describes the layout and behavior of the original object. For Java objects, the "klass" contains a C++ style "vtable".

- `mark word`

The first word of every object header. Usually a set of bitfields including synchronization state and identity hash code. May also be a pointer (with characteristic low bit encoding) to synchronization related information. During GC, may contain GC state bits.

- `nmethod`

A block of executable code which implements some Java bytecodes. It may be a complete Java method, or an 'OSR' method. It routinely includes object code for additional methods inlined by the compiler.

- `object header`

Common structure at the beginning of every GC-managed heap object. (Every oop points to an object header.) Includes fundamental information about the heap object's layout, type, GC state, synchronization state, and identity hash code. Consists of two words. In arrays it is immediately followed by a length field. Note that both Java objects and VM-internal objects have a common object header format.

- `object promotion`

The act of copying an object from one generation to another.

- `old generation`

A region of the Java object heap that holds object that have remained referenced for a while.

- `on-stack replacement`

Also known as 'OSR'. The process of converting an interpreted (or less optimized) stack frame into a compiled (or more optimized) stack frame. This happens when the interpreter discovers that a method is looping, requests the compiler to generate a special nmethod with an entry point somewhere in the loop (specifically, at a backward branch), and transfers control to that nmethod. A rough inverse to deoptimization.

- `oop`

An object pointer. Specifically, a pointer into the GC-managed heap. (The term is traditional. One 'o' may stand for 'ordinary'.) Implemented as a native machine address, not a handle. Oops may be directly manipulated by compiled or interpreted Java code, because the GC knows about the liveness and location of oops within such code. (See GC map.) Oops can also be directly manipulated by short spans of C/C++ code, but must be kept by such code within handles across every safepoint.

- `parallel classloading`

The ability to have multiple classes/type be in the process of being loaded by the same classloader at the same time.

- `parallel garbage collection`

A garbage collection algorithm that uses multiple threads of control to perform more efficiently on multi-processor boxes.

- `permanent generation`

A region of the address space that holds object allocated by the virtual machine itself, but which is managed by the garbage collector. The permanent generation is mis-named, in that almost all of the objects in it can be collected, though they tend to be referenced for a long time, so they rarely become garbage.

- `remembered set`

A data structure that records pointers between generations.

- `safepoint`

A point during program execution at which all GC roots are known and all heap object contents are consistent. From a global point of view, all threads must block at a safepoint before the GC can run. (As a special case, threads running JNI code can continue to run, because they use only handles. During a safepoint they must block instead of loading the contents of the handle.) From a local point of view, a safepoint is a distinguished point in a block of code where the executing thread may block for the GC. Most call sites qualify as safepoints. There are strong invariants which hold true at every safepoint, which may be disregarded at non-safepoints. Both compiled Java code and C/C++ code be optimized between safepoints, but less so across safepoints. The JIT compiler emits a GC map at each safepoint. C/C++ code in the VM uses stylized macro-based conventions (e.g., TRAPS) to mark potential safepoints.

- `sea-of-nodes`

The high-level intermediate representation in C2. It is an SSA form where both data and control flow are represented with explicit edges between nodes. It differs from forms used in more traditional compilers in that nodes are not bound to a block in a control flow graph. The IR allows nodes to float within the sea (subject to edge constraints) until they are scheduled late in the compilation process.

- `Serviceability Agent (SA)`

The Serviceablity Agent is collection of Sun internal code that aids in debugging HotSpot problems. It is also used by several JDK tools - `jstack, jmap, jinfo, and jdb. See SA for more information.`

- `stackmap`

Refers to the StackMapTable attribut e or a particular StackMapFrame in the table.

- `StackMapTable`

An attribute of the Code attribute in a classfile which contains type information used by the new verifier during verification. It consists of an array of StackMapFrames. It is generated automatically by javac as of JDK6.

- `survivor space`

A region of the Java object heap used to hold objects. There are usually a pair of survivor spaces, and collection of one is achieved by copying the referenced objects in one survivor space to the other survivor space.

- `synchronization`

In general terms this is the coordination of concurrent activities to ensure the safety and liveness properties of those activities. For example, protecting access to shared data by using a lock to guard all code paths to that data.

- `TLAB`

Thread-local allocation buffer. Used to allocate heap space quickly without synchronization. Compiled code has a "fast path" of a few instructions which tries to bump a high-water mark in the current thread's TLAB, successfully allocating an object if the bumped mark falls before a TLAB-specific limit address.

- `uncommon trap`

When code generated by C2 reverts back to the interpreter for further execution. C2 typically compiles for the common case, allowing it to focus on optimization of frequently executed paths. For example, C2 inserts an uncommon trap in generated code when a class that is uninitialized at compile time requires run time initialization.

- `verifier`

The software code in the VM which performs bytecode verification.

- `VM Operations`

Operations in the VM that can be requested by Java threads, but which must be executed, in serial fashion by a specific thread known as the VM thread. These operations are often synchronous, in that the requester will block until the VM thread has completed the operation. Many of these operations also require that the VM be brought to a safepoint before the operation can be performed - `a garbage collection request is a simple example.`

- `write barrier`

Code that is executed on every oop store. For example, to maintain a remembered set.

- `young generation`

A region of the Java object heap that holds recently-allocated objects.


<https://openjdk.java.net/groups/hotspot/docs/HotSpotGlossary.html>
