# HotSpot Glossary of Terms

# JVM常用术语表（HotSpot版）

[TOC]

A work in progress, especially as the HotSpot VM evolves. But a place to put definitions of things so we only have to define them once. There are empty entries (marked TBD for "to be defined") because we think of things that we need to define faster than we think of good definitions.


随着HotSpot VM的发展, 相关的术语定义一直是一项正在进行中的工作。
我们希望只在同一个地方定义一次。
文中可能会有一些空条目(使用 TBD 标记,表示“待定义,to be defined”),因为需要定义的东西,比已经定义好的要多。



## 1、`adaptive spinning`, 适应性自旋

An optimization technique whereby a thread spins waiting for a change-of-state to occur (typically a flag that represents some event has occurred - such as the release of a lock) rather than just blocking until notified that the change has occurred. The "adaptive" part comes from the policy decisions that control how long the thread will spin until eventually deciding to block.

"`适应性自旋`" 是一种优化技术,通过适应性自旋技术,线程在等待状态发生改变时会先进行一定次数的旋转, 而不是单纯阻塞并等待通知事件。(通常是一个表示某个事件已经发生的标志 —— 比如释放锁)。
为什么叫 “适应性” 呢? 是因为控制线程在阻塞之前需要旋转多长时间,是由策略来决定的。


## 2、`biased locking`, 偏向锁

An optimization in the VM that leaves an object as logically locked by a given thread even after the thread has released the lock. The premise is that if the thread subsequently reacquires the lock (as often happens), then reacquisition can be achieved at very low cost. If a different thread tries to acquire a biased lock then the bias must be revoked from the current bias owner.

"`偏向锁`" 是JVM的一种优化,让一个对象在逻辑上被某个特定的线程锁定,即使该线程已经释放了锁。
这样优化的前提是,假设大部分情况下都是该线程在后面的业务中继续获取这个对象锁,那么就可以用很低的开销成本来实现重新获得锁。
如果另一个线程试图获取一个偏向锁,则必须先以安全的方式撤销偏向。

## 3、`block start table`, 块起始表

A table that shows, for a region of the heap, where the object starts that comes on to this region from lower addresees. Used, for example, with the card table variant of the remembered set.

对于堆中的一个区域(region),都有一个 table, 用来记录从较低地址区域进入本区域的对象的起始位置。
例如,与 remembered set 一起使用的卡表变体(card table variant)。

## 4、`bootstrap classloader`, 启动类加载器

The logical classloader that has responsibility for loading the classes (and resources) that are found in the boot-classpath - typically the core Java platform classes. Typically implemented as part of the VM, by historical convention the bootstrap classloader is represented by NULL at the Java API level.

这是一款逻辑上的类加载器,负责加载启动类路径中找到的类和资源,一般是指Java平台的核心类。
通常作为JVM实现的一部分,根据历史约定,引导类加载器在Java API级别上显示为 `NULL`。

## 5、`bytecode verification`, 字节码验证

A step in the linking process of a class where the methods bytecodes are analyzed to ensure type-safety.

类的链接过程中的一个步骤,对方法的字节码进行分析,以确保类型安全。

## 6、`C1 compiler`, C1编译器

Fast, lightly optimizing bytecode compiler. Performs some value numbering, inlining, and class analysis. Uses a simple CFG-oriented SSA "high" IR, a machine-oriented "low" IR, a linear scan register allocation, and a template-style code generator.

快速、轻量优化的字节码编译器。 比如会执行：值编号、内联和类分析等操作。
使用简单的面向控制流图(CFG)的 SSA “高级别” IR、面向机器的 “底层” IR、 线性扫描寄存器分配,模板风格的代码生成器。

## 7、`C2 compiler`, C2编译器

Highly optimizing bytecode compiler, also known as 'opto'. Uses a "sea of nodes" SSA "ideal" IR, which lowers to a machine-specific IR of the same kind. Has a graph-coloring register allocator; colors all machine state, including local, global, and argument registers and stack. Optimizations include global value numbering, conditional constant type propagation, constant folding, global code motion, algebraic identities, method inlining (aggressive, optimistic, and/or multi-morphic), intrinsic replacement, loop transformations (unswitching, unrolling), array range check elimination.

高度优化的字节码编译器, 也称为 'opto'。 使用 “节点海” SSA “理想” IR, 并下沉为同类型的机器特定IR。
具有图着色寄存器分配器; 为所有机器状态着色,包括局部、全局和参数寄存器,栈。
优化包括全局值编号、条件常量类型传播、常量折叠、全局代码移动、代数恒等式、方法内联(积极的、乐观的和/或多态的)、内在函数替换、循环转换(unswitching、unrolling)、数组范围检查消除。

## 8、`card table`, 卡表

A kind of remembered set that records where oops have changed in a generation.

一种记忆集,用来记录 oops 指针在分代中的改变。

## 9、`class data sharing`, 类数据共享

A startup optimization that records the in-memory form of some classes, so that that form can be mapped into memory by a subsequent run of the virtual machine, rather than loading those classes from their class files.

一种启动时的优化,将某些类的信息放在内存中,以便后续启动的另一个虚拟机可以通过这种形式将类映射到内存中,而不再从 class files 中加载这些类。

## 10、`class hierachy analysis`, 类层次分析

Also known as 'CHA'. Analysis of the class tree used by a compiler to determine if the receiver at a virtual call site has a single implementor. If so, the callee can be inlined or the compiler can employ some other static call mechanism.

简写为 'CHA'。 对编译器使用的class树进行分析,以确定虚拟调用位置的接收者是否只有一个实现类。
如果满足这个条件,则可以将此调用方法内联,或者编译器也可以使用其他一些静态调用机制。


## 11、`code cache`, 代码缓存区

A special heap that holds compiled code. These objects are not relocated by the GC, but may contain oops, which serve as GC roots.

一块特殊的堆内存空间,用于存放被编译器编译后的代码。 这些对象不会被GC迁移, 但有可能包含oops,这些 oop 可作为GC根。

- 12、`compaction`,整理,压实(压缩)

A garbage collection technique that results in live objects occupying a dense portion of the virtual address space, and available space in another portion of the address space. Cf. free list.

垃圾收集中的一种技术,将存活对象占用的虚拟地址空间归集到一边,那么可用地址空间就在另一边。参考 `空闲列表`。

- 13、`concurrency`, 并发

Concurrency, or more specifically concurrent programming, is the logical simultaneous execution of multiple instruction streams. If multiple processors are available then the logical simultaneity can be physical simultaneity - `this is known as 'parallelism'`

并发, 更确切地说并发编程, 是指多个指令流在逻辑上同时执行。 如果有多个处理器,则逻辑上的同时性也可以是物理上的同时性 - 这称为“并行性(parallelism)”。

- 14、`concurrent garbage collection`, 并发垃圾收集

A garbage collection algorithm that does most (if not all) of its work while the Java application threads are still running.

并发垃圾收集算法，在Java应用程序线程执行的同时，并发地完成大部分GC工作。

- 15、`copying garbage collection`, 复制算法

A garbage collection algorithm that moves objects during the collection.

在垃圾收集期间移动对象的垃圾收集算法。

- 16、`deoptimization`, 优化逆操作

The process of converting an compiled (or more optimized) stack frame into an interpreted (or less optimized) stack frame. Also describes the discarding of an nmethod whose dependencies (or other assumptions) have been broken. Deoptimized nmethods are typically recompiled to adapt to changing application behavior. Example: A compiler initially assumes a reference value is never null, and tests for it using a trapping memory access. Later on, the application uses null values, and the method is deoptimized and recompiled to use an explicit test-and-branch idiom to detect such nulls.

将已编译（或优化过）的栈帧转换为解释型（低优化）栈帧的过程。
还描述了其依赖项已被破坏的 nmethod 的丢弃。 通常会重新编译未优化的方法，以适应不断变化的应用程序行为。 示例：编译器最初假定引用值永远不会为null，然后使用会触发陷阱的内存访问对其进行测试。 稍后，应用程序开始使用null值，于是该方法会被反优化并重新编译，以使用显式的“测试并分支”惯用法来检测这类null值。

- 17、`dependency`

An optimistic assumption associated with an nmethod, which allowed the compiler to emit improved code into the nmethod. Example: A given class has no subclasses, which simplifies method dispatch and type testing. The loading of new classes (or replacement of old classes) can cause dependencies to become false, which requires dependent nmethods to be discarded and activations of those nmethods to be deoptimized.

与 nmethod 关联的一种乐观假设,它让编译器得以在 nmethod 中生成更优化的代码。示例:某个类没有子类,这可以简化方法分派和类型测试。加载新类(或替换旧类)可能导致依赖关系失效,这时就需要丢弃依赖它的 nmethod,并对其激活的栈帧执行反优化。

- 18、`eden`

A part of the Java object heap where object can be created efficiently.

Java 对象堆的一部分,对象可以在这里被高效地创建。

- 19、`free list`

A storage management technique in which unused parts of the Java object heap are chained one to the next, rather than having all of the unused part of the heap in a single block.

一种存储管理技术,把 Java 对象堆中未使用的部分逐个链接起来,而不是把堆中所有未使用的空间都放在一个连续的块里。

- 20、`garbage collection`

The automatic management of storage.

对存储空间的自动管理。

- 21、`garbage collection root`

A pointer into the Java object heap from outside the heap. These come up, e.g., from static fields of classes, local references in activation frames, etc.

从堆外指向 Java 对象堆的指针。例如,类的静态字段、激活帧中的本地引用等等,都可以产生这样的指针。

- 22、`GC map`

A description emitted by the JIT (C1 or C2) of the locations of oops in registers or on stack in a compiled stack frame. Each code location which might execute a safepoint has an associated GC map. The GC knows how to parse a frame from a stack, to request a GC map from a frame's nmethod, and to unpack the GC map and manage the indicated oops within the stack frame.

由 JIT 编译器(C1 或 C2)生成的描述信息,用于说明编译后的栈帧中,寄存器和栈上 oop 的位置。每个可能执行 safepoint 的代码位置,都有一个与之关联的 GC map。GC 知道如何从栈中解析栈帧、如何向栈帧对应的 nmethod 请求 GC map,以及如何解析 GC map 并管理栈帧中标记的那些 oop。

- 23、`generational garbage collection`

A storage management technique that separates objects expected to be referenced for different lengths of time into different regions of the heap, so that different algorithms can be applied to the collection of those regions.

一种存储管理技术,把预期被引用时长不同的对象划分到堆的不同区域,这样就可以对不同区域应用不同的收集算法。

- 24、`handle`

A memory word containing an oop. The word is known to the GC, as a root reference. C/C++ code generally refers to oops indirectly via handles, to enable the GC to find and manage its root set more easily. Whenever C/C++ code blocks in a safepoint, the GC may change any oop stored in a handle. Handles are either 'local' (thread-specific, subject to a stack discipline though not necessarily on the thread stack) or global (long-lived and explicitly deallocated). There are a number of handle implementations throughout the VM, and the GC knows about them all.

包含一个 oop 的内存字。GC 把这个字当作根引用来看待。C/C++ 代码一般通过句柄间接引用 oop,这样 GC 就能更容易地找到并管理它的根集合。只要 C/C++ 代码在 safepoint 处阻塞,GC 就可能改变句柄中保存的任何 oop。句柄分为"局部句柄"(线程私有,遵循栈式管理规则,但不一定位于线程栈上)和"全局句柄"(长期存活,需要显式释放)。VM 中有多处句柄实现,GC 对它们全都了解。

- 25、`hot lock`

A lock that is highly contended.

争用非常激烈的锁。

- 26、 `interpreter` 解释器

A VM module which implements method calls by individually executing bytecodes. The interpreter has a limited set of highly stylized stack frame layouts and register usage patterns, which it uses for all method activations. The Hotspot VM generates its own interpreter at start-up time.

VM 中通过逐条执行字节码来实现方法调用的模块。解释器使用一组数量有限、高度规范化的栈帧布局和寄存器使用模式,并把它们用于所有的方法激活。HotSpot VM 在启动时会生成自己的解释器。

- 27、`JIT compilers`

An on-line compiler which generates code for an application (or class library) during execution of the application itself. ("JIT" stands for "just in time".) A JIT compiler may create machine code shortly before the first invocation of a Java method. Hotspot compilers usually allow the interpreter ample time to "warm up" Java methods, by executing them thousands of times. This warm-up period allows a compiler to make better optimization decisions, because it can observe (after initial class loading) a more complete class hierarchy. The compiler can also inspect branch and type profile information gathered by the interpreter.

一种在线编译器,在应用程序(或类库)自身执行期间为其生成代码。("JIT" 是 "just in time" 的缩写。)JIT 编译器可以在 Java 方法首次调用前不久才生成机器码。HotSpot 编译器通常会给解释器留出充足的时间来"预热" Java 方法,也就是让方法先被解释执行成千上万次。这段预热期让编译器能够做出更好的优化决策,因为它可以观察到(在初始类加载之后)更完整的类层次结构。编译器还可以检查由解释器收集到的分支和类型剖析(profile)信息。

- 28、`JNI`

The Java Native Interface - `a specification and API for how Java code can call out to native C code, and how native C code can call into the Java VM`

Java 本地接口(Java Native Interface) —— 一套规范和 API,定义了 Java 代码如何调用本地 C 代码,以及本地 C 代码如何调用进入 Java VM。

- 29、`JVM TI`

The Java Virtual Machine Tools Interface - `a standard specification and API that is used by development and monitoring tools. See JVM TI for more information.`

JVM 工具接口(Java Virtual Machine Tools Interface) —— 一套供开发和监控工具使用的标准规范和 API。更多信息参见 JVM TI 文档。

- 30、`klass pointer`

The second word of every object header. Points to another object (a metaobject) which describes the layout and behavior of the original object. For Java objects, the "klass" contains a C++ style "vtable".

每个对象头的第二个字。它指向另一个对象(元对象,metaobject),后者描述了原对象的布局和行为。对于 Java 对象来说,这个 "klass" 中包含 C++ 风格的 "vtable"(虚函数表)。

- 31、`mark word`

The first word of every object header. Usually a set of bitfields including synchronization state and identity hash code. May also be a pointer (with characteristic low bit encoding) to synchronization related information. During GC, may contain GC state bits.

每个对象头的第一个字。通常是一组位域,包括同步状态和一致性哈希码(identity hash code)。也可能是一个指向同步相关信息的指针(低位采用特征性的编码)。在 GC 期间,还可能包含 GC 状态位。

- 33、`nmethod`

A block of executable code which implements some Java bytecodes. It may be a complete Java method, or an 'OSR' method. It routinely includes object code for additional methods inlined by the compiler.

一段可执行的代码,用来实现某些 Java 字节码。它可能是一个完整的 Java 方法,也可能是一个 "OSR" 方法。它通常还包含由编译器内联进来的其他方法的目标代码。

- 34、`object header`

Common structure at the beginning of every GC-managed heap object. (Every oop points to an object header.) Includes fundamental information about the heap object's layout, type, GC state, synchronization state, and identity hash code. Consists of two words. In arrays it is immediately followed by a length field. Note that both Java objects and VM-internal objects have a common object header format.

每个 GC 管理的堆对象开头都有的公共结构。(每个 oop 都指向一个对象头。)包含堆对象的布局、类型、GC 状态、同步状态和一致性哈希码等基本信息。由两个字组成。在数组中,它后面紧跟着一个长度字段。注意,Java 对象和 VM 内部对象都使用相同的对象头格式。

- 35、`object promotion`

The act of copying an object from one generation to another.

把对象从一个分代复制到另一个分代的行为。

- 36、`old generation`

A region of the Java object heap that holds object that have remained referenced for a while.

Java 对象堆中的一个区域,存放已经被引用了一段时间的对象。

- 37、`on-stack replacement`

Also known as 'OSR'. The process of converting an interpreted (or less optimized) stack frame into a compiled (or more optimized) stack frame. This happens when the interpreter discovers that a method is looping, requests the compiler to generate a special nmethod with an entry point somewhere in the loop (specifically, at a backward branch), and transfers control to that nmethod. A rough inverse to deoptimization.

也称为 "OSR"。把解释执行(或优化程度较低)的栈帧,转换为编译后(或优化程度更高)的栈帧的过程。当解释器发现某个方法正在循环中时,会请求编译器生成一个特殊的 nmethod,其入口点位于循环中的某个位置(确切地说,在向后分支处),然后把控制权转移到该 nmethod。大致上是反优化(deoptimization)的逆过程。

- 38、`oop`

An object pointer. Specifically, a pointer into the GC-managed heap. (The term is traditional. One 'o' may stand for 'ordinary'.) Implemented as a native machine address, not a handle. Oops may be directly manipulated by compiled or interpreted Java code, because the GC knows about the liveness and location of oops within such code. (See GC map.) Oops can also be directly manipulated by short spans of C/C++ code, but must be kept by such code within handles across every safepoint.

对象指针(object pointer)。确切地说,是指向 GC 管理的堆的指针。(这个词是历史沿袭下来的,其中一个 "o" 可能代表 "ordinary"。)它实现为本地机器地址,而不是句柄。编译后的或解释执行的 Java 代码可以直接操作 oop,因为 GC 了解这些代码中 oop 的存活情况和位置。(参见 GC map。)C/C++ 代码也可以在短小的代码段中直接操作 oop,但每当跨越 safepoint 时,这类代码必须把 oop 保存在句柄里。

- 39、`parallel classloading`

The ability to have multiple classes/type be in the process of being loaded by the same classloader at the same time.

让多个类/类型能够同时处于同一个类加载器的加载过程中的能力。

- 40、`parallel garbage collection`

A garbage collection algorithm that uses multiple threads of control to perform more efficiently on multi-processor boxes.

一种垃圾收集算法,使用多个控制线程,以便在多处理器机器上更高效地执行。

- 41、`permanent generation`

A region of the address space that holds object allocated by the virtual machine itself, but which is managed by the garbage collector. The permanent generation is mis-named, in that almost all of the objects in it can be collected, though they tend to be referenced for a long time, so they rarely become garbage.

地址空间中的一块区域,存放由虚拟机自身分配的对象,但由垃圾收集器管理。永久代这个名字起得并不恰当,因为其中几乎所有对象都是可以被收集的,只不过它们往往被长期引用,所以很少变成垃圾。

- 42、`remembered set`

A data structure that records pointers between generations.

一种记录分代之间指针关系的数据结构。

- 43、`safepoint`

A point during program execution at which all GC roots are known and all heap object contents are consistent. From a global point of view, all threads must block at a safepoint before the GC can run. (As a special case, threads running JNI code can continue to run, because they use only handles. During a safepoint they must block instead of loading the contents of the handle.) From a local point of view, a safepoint is a distinguished point in a block of code where the executing thread may block for the GC. Most call sites qualify as safepoints. There are strong invariants which hold true at every safepoint, which may be disregarded at non-safepoints. Both compiled Java code and C/C++ code be optimized between safepoints, but less so across safepoints. The JIT compiler emits a GC map at each safepoint. C/C++ code in the VM uses stylized macro-based conventions (e.g., TRAPS) to mark potential safepoints.

程序执行过程中的某个点,在这个点上,所有 GC 根都是已知的,所有堆对象的内容都是一致的。从全局角度看,所有线程都必须先在 safepoint 处阻塞,GC 才能运行。(作为一种特殊情况,运行 JNI 代码的线程可以继续运行,因为它们只使用句柄。在 safepoint 期间,它们必须阻塞,而不能去加载句柄的内容。)从局部角度看,safepoint 是代码块中的一个特殊位置,执行中的线程可能为了 GC 在这里阻塞。大多数调用点都符合 safepoint 的条件。在每个 safepoint 处都有一些强不变式成立,这些不变式在非 safepoint 处可以不予遵守。编译后的 Java 代码和 C/C++ 代码都可以在 safepoint 之间进行优化,但跨越 safepoint 的优化就要少得多。JIT 编译器会在每个 safepoint 处生成一份 GC map。VM 中的 C/C++ 代码使用规范化的基于宏的约定(例如 TRAPS)来标记潜在的 safepoint。

- 44、`sea-of-nodes`

The high-level intermediate representation in C2. It is an SSA form where both data and control flow are represented with explicit edges between nodes. It differs from forms used in more traditional compilers in that nodes are not bound to a block in a control flow graph. The IR allows nodes to float within the sea (subject to edge constraints) until they are scheduled late in the compilation process.

C2 中的高级中间表示。它是一种 SSA 形式,数据流和控制流都用节点之间显式的边来表示。它与更传统的编译器所用的形式的区别在于:节点并不绑定到控制流图中的某个基本块。这种 IR 允许节点在"节点海"中浮动(受边约束的限制),直到编译过程的后期才被调度。

- 45、`Serviceability Agent (SA)`

The Serviceablity Agent is collection of Sun internal code that aids in debugging HotSpot problems. It is also used by several JDK tools - `jstack, jmap, jinfo, and jdb. See SA for more information.`

Serviceability Agent(可服务性代理)是 Sun 内部代码的集合,用于辅助调试 HotSpot 的问题。一些 JDK 工具也用到了它 —— `jstack, jmap, jinfo, and jdb`。更多信息参见 SA 文档。

- 46、`stackmap`

Refers to the StackMapTable attribut e or a particular StackMapFrame in the table.

指 StackMapTable 属性,或者该表中的某个特定的 StackMapFrame。

- 47、`StackMapTable`

An attribute of the Code attribute in a classfile which contains type information used by the new verifier during verification. It consists of an array of StackMapFrames. It is generated automatically by javac as of JDK6.

class 文件中 Code 属性的一个属性,包含新版验证器在验证过程中使用的类型信息。它由一个 StackMapFrame 数组组成。从 JDK6 开始,由 javac 自动生成。

- 48、`survivor space`

A region of the Java object heap used to hold objects. There are usually a pair of survivor spaces, and collection of one is achieved by copying the referenced objects in one survivor space to the other survivor space.

Java 对象堆中用于存放对象的区域。通常有一对存活区,收集其中一个存活区的做法,是把它里面被引用的对象复制到另一个存活区。

- 49、`synchronization`

In general terms this is the coordination of concurrent activities to ensure the safety and liveness properties of those activities. For example, protecting access to shared data by using a lock to guard all code paths to that data.

一般而言,指对并发活动进行协调,以保证这些活动的安全性和活性。例如,用一把锁来守护通向共享数据的所有代码路径,从而保护对共享数据的访问。

- 50、`TLAB`

Thread-local allocation buffer. Used to allocate heap space quickly without synchronization. Compiled code has a "fast path" of a few instructions which tries to bump a high-water mark in the current thread's TLAB, successfully allocating an object if the bumped mark falls before a TLAB-specific limit address.

线程本地分配缓冲区(Thread-local allocation buffer)。用于在不加同步的情况下快速分配堆空间。编译后的代码有一条由少量指令组成的"快速路径",它会尝试向前推进当前线程 TLAB 中的高水位线,如果推进后的标记仍低于该 TLAB 特定的界限地址,就成功分配一个对象。

- 51、`uncommon trap`

When code generated by C2 reverts back to the interpreter for further execution. C2 typically compiles for the common case, allowing it to focus on optimization of frequently executed paths. For example, C2 inserts an uncommon trap in generated code when a class that is uninitialized at compile time requires run time initialization.

指 C2 生成的代码回退到解释器继续执行的情况。C2 通常针对常见情况进行编译,从而可以把精力集中在高频执行路径的优化上。例如,当某个在编译时还未初始化的类需要在运行时初始化时,C2 就会在生成的代码中插入一个非常规陷阱。

- 52、`verifier`

The software code in the VM which performs bytecode verification.

VM 中执行字节码验证的软件代码。

- 53、`VM Operations`

Operations in the VM that can be requested by Java threads, but which must be executed, in serial fashion by a specific thread known as the VM thread. These operations are often synchronous, in that the requester will block until the VM thread has completed the operation. Many of these operations also require that the VM be brought to a safepoint before the operation can be performed - `a garbage collection request is a simple example.`

VM 中可以由 Java 线程发起请求、但必须由一个称为 VM 线程(VM thread)的特定线程以串行方式执行的操作。这些操作往往是同步的,也就是说,请求者会一直阻塞,直到 VM 线程完成该操作。其中很多操作还要求先让 VM 进入 safepoint,操作才能执行 —— 垃圾收集请求就是一个简单的例子。

- 54、`write barrier`

Code that is executed on every oop store. For example, to maintain a remembered set.

在每次 oop 写入时都会执行的代码。例如,用来维护记忆集(remembered set)。

- 55、`young generation`

A region of the Java object heap that holds recently-allocated objects.

Java 对象堆中存放新近分配的对象的区域。


<https://openjdk.java.net/groups/hotspot/docs/HotSpotGlossary.html>
