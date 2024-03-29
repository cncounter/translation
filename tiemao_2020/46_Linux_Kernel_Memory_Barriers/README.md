# Linux内核参考文档: 内存屏障

在线版本地址(English): <https://www.kernel.org/doc/Documentation/memory-barriers.txt>

作者信息:

```
============================
LINUX KERNEL MEMORY BARRIERS
============================

By: David Howells <dhowells@redhat.com>
    Paul E. McKenney <paulmck@linux.ibm.com>
    Will Deacon <will.deacon@arm.com>
    Peter Zijlstra <peterz@infradead.org>
```

==========
DISCLAIMER
==========

This document is not a specification; it is intentionally (for the sake of brevity) and unintentionally (due to being human) incomplete. This document is meant as a guide to using the various memory barriers provided by Linux, but in case of any doubt (and there are many) please ask.  Some doubts may be resolved by referring to the formal memory consistency model and related documentation at tools/memory-model/.  Nevertheless, even this memory model should be viewed as the collective opinion of its maintainers rather than as an infallible oracle.

To repeat, this document is not a specification of what Linux expects from hardware.

The purpose of this document is twofold:

 (1) to specify the minimum functionality that one can rely on for any particular barrier, and

 (2) to provide a guide as to how to use the barriers that are available.

Note that an architecture can provide more than the minimum requirement for any particular barrier, but if the architecture provides less than that, that architecture is incorrect.

Note also that it is possible that a barrier may be a no-op for an architecture because the way that arch works renders an explicit barrier unnecessary in that case.


<a name="DISCLAIMER"></a>
## 免责声明

本文档并不是硬性规范;
并且为了阅读方便, 做了一定程度的精简。
目的是为Linux支持的各种内存屏障做一个使用参考, 如果有不理解的地方, 可以到在线论坛和社区提问。
某些问题可以参考源代码仓库中的 `tools/memory-model/` 目录, 这里面定义了内存一致性模型的正式文档和相关说明。
当然, "内存模型" 只是开发者和维护人员一致达成的共识, 而不是硬性的规定。

再强调一次, 本文档不是 Linux 对硬件预期的规范。

编写本文档有下面两个目的:

- （1）确定每个内存屏障最少实现了哪些功能;

- （2）提供参考文档来介绍如何使用现有的各种内存屏障。

请注意, 各种CPU物理架构提供的内存屏障, 可能会比Linux规定的功能要多【副作用或额外功能】;  但如果某种CPU支持的功能少于最低要求,  那么我们可以说这种CPU架构不行。

还需要注意, 对于特定CPU体系结构而言, 一个屏障指令可能没有对应的真实操作（no-op）, 因为根据这种CPU的运行机制, 可能就不需要使用这个内存屏障。


<a name="CONTENTS"></a>

========
CONTENTS
========

- (`*`) Abstract memory access model.

     - Device operations.
     - Guarantees.

- (`*`) What are memory barriers?

     - Varieties of memory barrier.
     - What may not be assumed about memory barriers?
     - Data dependency barriers (historical).
     - Control dependencies.
     - SMP barrier pairing.
     - Examples of memory barrier sequences.
     - Read memory barriers vs load speculation.
     - Multicopy atomicity.

- (`*`) Explicit kernel barriers.

     - Compiler barrier.
     - CPU memory barriers.

- (`*`) Implicit kernel memory barriers.

     - Lock acquisition functions.
     - Interrupt disabling functions.
     - Sleep and wake-up functions.
     - Miscellaneous functions.

- (`*`) Inter-CPU acquiring barrier effects.

     - Acquires vs memory accesses.

- (`*`) Where are memory barriers needed?

     - Interprocessor interaction.
     - Atomic operations.
     - Accessing devices.
     - Interrupts.

- (`*`) Kernel I/O barrier effects.

- (`*`) Assumed minimum execution ordering model.

- (`*`) The effects of the cpu cache.

     - Cache coherency.
     - Cache coherency vs DMA.
     - Cache coherency vs MMIO.

- (`*`) The things CPUs get up to.

     - And then there's the Alpha.
     - Virtual Machine Guests.

- (`*`) Example uses.

     - Circular buffers.

- (`*`) References.


<a name="CONTENTS"></a>
## 目录

[TOC]


============================
ABSTRACT MEMORY ACCESS MODEL
============================

Consider the following abstract model of the system:

<a name="ABSTRACT_MEMORY_ACCESS_MODEL"></a>

## 1. 内存访问抽象模型

请看下面这个抽象的系统模型:


```c
                :                :
                :                :
                :                :
    +-------+   :   +--------+   :   +-------+
    |       |   :   |        |   :   |       |
    |       |   :   |        |   :   |       |
    | CPU 1 |<----->| Memory |<----->| CPU 2 |
    |       |   :   |        |   :   |       |
    |       |   :   |        |   :   |       |
    +-------+   :   +--------+   :   +-------+
        ^       :       ^        :       ^
        |       :       |        :       |
        |       :       |        :       |
        |       :       v        :       |
        |       :   +--------+   :       |
        |       :   |        |   :       |
        |       :   |        |   :       |
        +---------->| Device |<----------+
                :   |        |   :
                :   |        |   :
                :   +--------+   :
                :                :
```

Each CPU executes a program that generates memory access operations.  In the abstract CPU, memory operation ordering is very relaxed, and a CPU may actually perform the memory operations in any order it likes, provided program causality appears to be maintained.  Similarly, the compiler may also arrange the instructions it emits in any order it likes, provided it doesn't affect the apparent operation of the program.

So in the above diagram, the effects of the memory operations performed by a CPU are perceived by the rest of the system as the operations cross the interface between the CPU and rest of the system (the dotted lines).

For example, consider the following sequence of events:


每一个CPU执行的程序都会生成访问内存的操作。 在抽象CPU中, 内存操作的顺序非常宽松, 而且每个CPU可以按自己喜欢的任意顺序来执行这些内存操作, 只要保证程序的因果关系即可。 同样, 编译器也可以按自己喜欢的顺序生成对应的指令, 只要不影响程序的表现即可。

在上图中, 当某个操作越过CPU与系统其他部分之间的交界时（虚线部分）, 这个CPU对内存所执行的操作的效果, 就会被系统的其余部分感知到。


请分析以下事件的顺序:

```c
CPU 1            CPU 2
===============  ===============
初始值: { A == 1; B == 2 }
A = 3;           x = B;
B = 4;           y = A;
```

The set of accesses as seen by the memory system in the middle can be arranged in 24 different combinations:

位于中间的内存系统, 可能会收到下面的24种访问顺序(`4*3*2*1 = 24`):

```c
STORE A=3,  STORE B=4,    y=LOAD A->3,  x=LOAD B->4
STORE A=3,  STORE B=4,    x=LOAD B->4,  y=LOAD A->3
STORE A=3,  y=LOAD A->3,  STORE B=4,    x=LOAD B->4
STORE A=3,  y=LOAD A->3,  x=LOAD B->2,  STORE B=4
STORE A=3,  x=LOAD B->2,  STORE B=4,    y=LOAD A->3
STORE A=3,  x=LOAD B->2,  y=LOAD A->3,  STORE B=4
STORE B=4,  STORE A=3,    y=LOAD A->3,  x=LOAD B->4
STORE B=4, ...
...
```

and can thus result in four different combinations of values:

因此x和y的值可能会有四种不同的组合:

```c
x == 2, y == 1
x == 2, y == 3
x == 4, y == 1
x == 4, y == 3
```

Furthermore, the stores committed by a CPU to the memory system may not be perceived by the loads made by another CPU in the same order as the stores were committed.


As a further example, consider this sequence of events:


此外, 由一个CPU提交给内存系统的store指令, 即使触发时机有先后顺序, 可能也不会被另一个CPU执行的load操作所感知到。

再看另一个示例, 请看以下事件序列:

```c
CPU 1            CPU 2
===============  ===============
初始值: { A == 1, B == 2, C == 3, P == &A, Q == &C }
B = 4;           Q = P;
P = &B;          D = *Q;
```

There is an obvious data dependency here, as the value loaded into D depends on the address retrieved from P by CPU 2.  At the end of the sequence, any of the following results are possible:

这里存在很明显的数据依赖性, 因为加载到 D 中的值, 取决于CPU 2从P所取到的地址。 在这些事件执行完之后, 可能出现以下任何一种结果:

```c
(Q == &A) and (D == 1)
(Q == &B) and (D == 2)
(Q == &B) and (D == 4)
```

Note that CPU 2 will never try and load C into D because the CPU will load P into Q before issuing the load of `*Q`.

请注意, CPU 2 决不会尝试直接将C的值加载到D中, 因为在发出 `*Q` 的load指令前, 会先将P加载到Q中。


### DEVICE OPERATIONS
-----------------

Some devices present their control interfaces as collections of memory locations, but the order in which the control registers are accessed is very important.  For instance, imagine an ethernet card with a set of internal registers that are accessed through an address port register (A) and a data port register (D).  To read internal register 5, the following code might then be used:

<a name="DEVICE_OPERATIONS"></a>
### 1.1 设备操作
-----------------

有些设备会映射一组内存位置来表示自身的控制接口, 所以控制寄存器的访问顺序就非常重要了。
例如, 有一张网卡, 具有一组内部寄存器, 可以通过地址端口寄存器 (A) 和数据端口寄存器 (D) 来访问这些寄存器。
要读取内部寄存器 5, 可以使用以下代码:

```c
*A = 5;
x = *D;
```

but this might show up as either of the following two sequences:

但这可能会有两种不同的执行顺序:

```c
STORE *A = 5,   x = LOAD *D
x = LOAD *D,    STORE *A = 5
```

the second of which will almost certainly result in a malfunction, since it set the address _after_ attempting to read the register.

可以肯定, 第二种顺序会产生问题, 因为在读取寄存器之后才去设置地址。


### GUARANTEES
----------

There are some minimal guarantees that may be expected of a CPU:

<a name="GUARANTEES"></a>
### 1.2 保证
----------

CPU至少必须支持这些特征:

- (`*`) On any given CPU, dependent memory accesses will be issued in order, with respect to itself.  This means that for:

- (`*`) 在任何给定的CPU上, 将根据其自身顺序发出相关的内存访问。 这意味着:

```c
Q = READ_ONCE(P);
D = READ_ONCE(*Q);
```

the CPU will issue the following memory operations:

CPU将发出以下内存操作:

```c
Q = LOAD P,
D = LOAD *Q
```

and always in that order.  However, on DEC Alpha, `READ_ONCE()` also emits a memory-barrier instruction, so that a DEC Alpha CPU will instead issue the following memory operations:

并始终按此顺序。 但是, 在 DEC Alpha 上,  `READ_ONCE()` 还会发出一条内存屏障指令, 因此 DEC Alpha CPU 将发出以下内存操作:

```c
Q = LOAD P,
MEMORY_BARRIER,
D = LOAD *Q,
MEMORY_BARRIER
```

Whether on DEC Alpha or not, the `READ_ONCE()` also prevents compiler mischief.

无论是否在 DEC Alpha 上, `READ_ONCE()` 都可以防止编译器乱序。

- (`*`) Overlapping loads and stores within a particular CPU will appear to be ordered within that CPU.  This means that for:

- (`*`) 特定CPU内的重叠loads和stores将在该CPU内排序。 这意味着:

```c
a = READ_ONCE(*X);
WRITE_ONCE(*X, b);
```

the CPU will only issue the following sequence of memory operations:

CPU将只发出以下顺序的内存操作:

```c
a = LOAD *X,
STORE *X = b
```

And for:

对于:

```c
WRITE_ONCE(*X, c);
d = READ_ONCE(*X);
```

the CPU will only issue:

CPU只发出:

```c
STORE *X = c,
d = LOAD *X
```

(Loads and stores overlap if they are targeted at overlapping pieces of memory).

> 如果 load 和 store的目标内存地址一致, 则会发生重叠。

And there are a number of things that _must_ or _must_not_ be assumed:

- (`*`) It _must_not_ be assumed that the compiler will do what you want with memory references that are not protected by `READ_ONCE()` and `WRITE_ONCE()`.  Without them, the compiler is within its rights to do all sorts of "creative" transformations, which are covered in the COMPILER BARRIER section.

- (`*`) It _must_not_ be assumed that independent loads and stores will be issued in the order given.  This means that for:

而且有许多必须或不允许的假设因素:

- (`*`) 对不受 `READ_ONCE()` 和 `WRITE_ONCE()` 保护的内存引用操作, 不能假设编译器会按你的预期处理。 没有这种保护, 编译器将有权进行各种"创造性"的转换, 这在后面的 "编译器屏障" 一节中介绍。

- (`*`) 独立的 loads 和 stores操作, 不能假定他们会以给定的顺序触发。 这意味着:

```c
X = *A; Y = *B; *D = Z;
```

we may get any of the following sequences:

可能会以任何一种顺序执行:

```c
X = LOAD *A,  Y = LOAD *B,  STORE *D = Z
X = LOAD *A,  STORE *D = Z, Y = LOAD *B
Y = LOAD *B,  X = LOAD *A,  STORE *D = Z
Y = LOAD *B,  STORE *D = Z, X = LOAD *A
STORE *D = Z, X = LOAD *A,  Y = LOAD *B
STORE *D = Z, Y = LOAD *B,  X = LOAD *A
```

- (`*`) It _must_ be assumed that overlapping memory accesses may be merged or discarded.  This means that for:

- (`*`) 重叠的内存访问, 必须假定为可以合并或丢弃。 这意味着:

```c
X = *A; Y = *(A + 4);
```

we may get any one of the following sequences:

可能会以任何一种顺序执行:

```c
X = LOAD *A; Y = LOAD *(A + 4);
Y = LOAD *(A + 4); X = LOAD *A;
{X, Y} = LOAD {*A, *(A + 4) };
```

And for:

对于:

```c
*A = X; *(A + 4) = Y;
```

we may get any of:

可能会以任何一种顺序执行:

```c
STORE *A = X;       STORE *(A + 4) = Y;
STORE *(A + 4) = Y; STORE *A = X;
STORE {*A, *(A + 4) } = {X, Y};
```

And there are anti-guarantees:

- (`*`) These guarantees do not apply to bitfields, because compilers often generate code to modify these using non-atomic read-modify-write sequences.  Do not attempt to use bitfields to synchronize parallel algorithms.

- (`*`) Even in cases where bitfields are protected by locks, all fields in a given bitfield must be protected by one lock.  If two fields in a given bitfield are protected by different locks, the compiler's non-atomic read-modify-write sequences can cause an update to one field to corrupt the value of an adjacent field.

- (`*`) These guarantees apply only to properly aligned and sized scalar variables.  "Properly sized" currently means variables that are the same size as "char", "short", "int" and "long".  "Properly aligned" means the natural alignment, thus no constraints for "char", two-byte alignment for "short", four-byte alignment for "int", and either four-byte or eight-byte alignment for "long", on 32-bit and 64-bit systems, respectively.  Note that these guarantees were introduced into the C11 standard, so beware when using older pre-C11 compilers (for example, gcc 4.6).  The portion of the standard containing this guarantee is Section 3.14, which defines "memory location" as follows:

下面是一些反例:

- (`*`) 这些保证不适用于bit字段(bitfields), 因为编译器生成的代码, 通常会以非原子性的 read-modify-write 顺序对其进行修改。不要尝试使用bit字段来同步并行算法。

- (`*`) 即使bit字段受锁保护的情况下, 给定 bitfield 中的所有字段也必须由同一个锁保护。 如果给定 bitfield 中的两个域由不同的锁来保护, 则编译器的非原子性 read-modify-write 顺序会导致对一个 field 的更新破坏相邻 field 的值。

- (`*`) 这些保证只适用于正确对齐且大小合适的标量变量。 "大小合适(Properly sized)" 的意思是指与 "char", "short", "int" and "long" 大小相同的变量。 "正确对齐(Properly aligned)" 是指自然对齐,  因此对 "char" 没有约束, 对于 "short" 为两个字节对齐, 对于 "int" 为四字节对齐, 对于 "long" 为四字节或八字节对齐, 分别对应在32位和64位系统上。 请注意, 这些保证是C11标准中引入的, 因此在使用C11之前的编译器时要当心（例如 gcc 4.6）。 标准中包含此保证的章节为 Section 3.14, 其中对 "内存位置(memory location)" 的定义如下:

> memory location either an object of scalar type, or a maximal sequence of adjacent bit-fields all having nonzero width

> NOTE 1: Two threads of execution can update and access separate memory locations without interfering with each other.

> NOTE 2: A bit-field and an adjacent non-bit-field member are in separate memory locations. The same applies to two bit-fields, if one is declared inside a nested structure declaration and the other is not, or if the two are separated by a zero-length bit-field declaration, or if they are separated by a non-bit-field member declaration. It is not safe to concurrently update two bit-fields in the same structure if all members declared between them are also bit-fields, no matter what the sizes of those intervening bit-fields happen to be.

> 内存位置(`memory location`), 要么是标量类型的对象, 要么是宽度都为非零的相邻位字段的最大序列。

> 提示1: 两个执行线程可以更新和访问单独的内存位置, 而不会互相干扰。

> 提示2: 一个 bit-field 字段, 和一个相邻的 non-bit-field 字段成员, 位于单独的内存位置中。 对于两个 bit-field , 如果有一个在嵌套结构声明中声明, 而另一个则未声明, 或者两个都被零长度bit-field声明所分隔, 或者如果它们由non-bit-field成员分隔, 则同样适用于这个规则。 如果在它们之间声明的所有成员都是 bit-field, 则并发更新同一结构中的两个位域都是不安全的, 不管这些位域的大小是多少。

=========================
WHAT ARE MEMORY BARRIERS?
=========================

As can be seen above, independent memory operations are effectively performed in random order, but this can be a problem for CPU-CPU interaction and for I/O. What is required is some way of intervening to instruct the compiler and the CPU to restrict the order.

Memory barriers are such interventions.  They impose a perceived partial ordering over the memory operations on either side of the barrier.

Such enforcement is important because the CPUs and other devices in a system can use a variety of tricks to improve performance, including reordering, deferral and combination of memory operations; speculative loads; speculative branch prediction and various types of caching.  Memory barriers are used to override or suppress these tricks, allowing the code to sanely control the interaction of multiple CPUs and/or devices.


<a name="WHAT_ARE_MEMORY_BARRIERS"></a>
## 2. 内存屏障简介

从上面可以看出, 独立的内存操作实际上是按随机顺序执行的, 但这可能会造成CPU-CPU交互问题,或者是I/O问题。 所以需要一种干预方式, 以指示编译器和CPU来限制指令的执行顺序。

内存屏障就是这种干预。 它们对屏障两侧的内存访问操作施加了感知的局部排序。

这种强制很重要, 因为系统中的CPU和其他设备可以使用各种技巧来提高性能, 包括指令重排序, 推迟和组合内存操作。 投机负荷;  投机分支预测和各种类型的缓存。 内存屏障用于覆盖或抑制这些技巧, 从而使代码可以合理地控制多个CPU和/或设备的交互。


VARIETIES OF MEMORY BARRIER
---------------------------

Memory barriers come in four basic varieties:

 (1) Write (or store) memory barriers.

A write memory barrier gives a guarantee that all the STORE operations specified before the barrier will appear to happen before all the STORE operations specified after the barrier with respect to the other components of the system.

A write barrier is a partial ordering on stores only; it is not required to have any effect on loads.

A CPU can be viewed as committing a sequence of store operations to the memory system as time progresses.  All stores _before_ a write barrier will occur _before_ all the stores after the write barrier.

[!] Note that write barriers should normally be paired with read or data dependency barriers; see the "SMP barrier pairing" subsection.

<a name="VARIETIES_OF_MEMORY_BARRIER"></a>
### 2.1 内存屏障类型

内存屏障主要分为四种基本类型:

#### （1）写屏障(write/store memory barrier)

写屏障可以保证: 对于系统的其他组件而言, 屏障之前指定的所有 STORE 操作, 都会在屏障之后的所有STORE操作之前发生。

写屏障只对 store 局部排序;  不需要对 load 有任何影响。

随着时间的流逝, CPU可以看作是向内存系统提交了一系列 store 操作。 在写屏障之前的所有 store, 都会在写屏障之后的任意 store 前完成。

> [!] 请注意, 写屏障一般要和读屏障,或者数据依赖屏障搭配使用;  请参阅 ["SMP barrier pairing"](#SMP_BARRIER_PAIRING) 小节。


(2) Data dependency barriers.

A data dependency barrier is a weaker form of read barrier.  In the case where two loads are performed such that the second depends on the result of the first (eg: the first load retrieves the address to which the second load will be directed), a data dependency barrier would be required to make sure that the target of the second load is updated after the address obtained by the first load is accessed.

A data dependency barrier is a partial ordering on interdependent loads only; it is not required to have any effect on stores, independent loads or overlapping loads.

As mentioned in (1), the other CPUs in the system can be viewed as committing sequences of stores to the memory system that the CPU being considered can then perceive.  A data dependency barrier issued by the CPU under consideration guarantees that for any load preceding it, if that load touches one of a sequence of stores from another CPU, then by the time the barrier completes, the effects of all the stores prior to that touched by the load will be perceptible to any loads issued after the data dependency barrier.

See the "Examples of memory barrier sequences" subsection for diagrams showing the ordering constraints.

[!] Note that the first load really has to have a _data_ dependency and not a control dependency.  If the address for the second load is dependent on the first load, but the dependency is through a conditional rather than actually loading the address itself, then it's a _control_ dependency and a full read barrier or better is required.  See the "Control dependencies" subsection for more information.

[!] Note that data dependency barriers should normally be paired with write barriers; see the "SMP barrier pairing" subsection.

#### （2）数据依赖屏障(Data dependency barrier)

数据依赖屏障是较弱形式的读屏障。 假设执行两个 load 操作, 第二个依赖第一个load的结果（例如:第一个 load 获取地址值, 第二个 load 将定向到此地址）, 则需要数据依赖屏障, 以确保第一个 load 获取到地址后, 先更新完第二个load的目标地址, 然后再执行第二个load操作。

数据依赖屏障只是相互依存的 load 的局部排序;  不需要影响 store, 独立的load, 以及重叠加载(overlapping load)。

如（1）中所述, 可以将系统中的其他CPU视为顺序提交一连串 store 给内存系统, 而当前CPU可以感知到。
某个CPU发出的数据依赖屏障, 可确保对于在其之前的任何load, 如果该load接触到了另一个CPU的一系列store中的一个, 则在该屏障完成时, 该接触之前的所有store的影响, 在数据依赖屏障之后发出的任何load都可以感知到这些变化。

排序约束相关的图示, 请参见 [2.5.1 内存屏障序列的示例](#EXAMPLES_OF_MEMORY_BARRIER_SEQUENCES) 小节。

> [!] 请注意, 实际上第一个 load 必须具有数据依赖关系(data dependency), 而不是控制依赖关系(control dependency)。 如果第二个 load 的地址依赖于第一个load, 但并不去加载实际的地址本身, 这种依赖关系是通过条件来进行的, 那么它就是控制依赖关系, 这时候就需要使用完全读屏障或更高级别的屏障。 更多控制依赖的信息, 请参见 "Control dependencies" 小节。

> [!] 请注意, 数据依赖屏障一般需要和写屏障搭配使用; 请参阅 ["SMP barrier pairing"](#SMP_BARRIER_PAIRING) 小节。


(3) Read (or load) memory barriers.

A read barrier is a data dependency barrier plus a guarantee that all the LOAD operations specified before the barrier will appear to happen before all the LOAD operations specified after the barrier with respect to the other components of the system.

A read barrier is a partial ordering on loads only; it is not required to have any effect on stores.

Read memory barriers imply data dependency barriers, and so can substitute for them.

[!] Note that read barriers should normally be paired with write barriers; see the "SMP barrier pairing" subsection.

####  （3）读屏障(Read/load memory barrier)

读屏障是一种数据依赖屏障, 保证对于系统的其他组件而言, 在屏障之前指定的所有 LOAD 操作, 都在屏障后指定的所有LOAD操作之前完成。

读屏障只规定对load操作的顺序;  不需要对store有任何影响。

读屏障隐含了数据依赖屏障, 因此可以替代它们。

> [!] 请注意, 读屏障一般和写屏障搭配使用;  请参阅 ["SMP barrier pairing"](#SMP_BARRIER_PAIRING) 小节。


(4) General memory barriers.

A general memory barrier gives a guarantee that all the LOAD and STORE operations specified before the barrier will appear to happen before all the LOAD and STORE operations specified after the barrier with respect to the other components of the system.

A general memory barrier is a partial ordering over both loads and stores.

General memory barriers imply both read and write memory barriers, and so can substitute for either.


And a couple of implicit varieties:

####  （4）通用内存屏障(General memory barrier)

通用内存屏障可确保, 相对于系统的其他组件, 屏障之前指定的所有 LOAD 和 STORE 操作, 都发生在屏障之后指定的所有LOAD和STORE操作之前。

通用内存屏障对局部的 LOAD 和 STORE 进行顺序控制。

通用内存屏障蕴含着读屏障和写屏障, 因此可以替代任何一种。


此外, 还有两种隐式的屏障:


(5) `ACQUIRE` operations.

This acts as a one-way permeable barrier.  It guarantees that all memory operations after the `ACQUIRE` operation will appear to happen after the `ACQUIRE` operation with respect to the other components of the system. `ACQUIRE` operations include LOCK operations and both smp_load_acquire() and smp_cond_load_acquire() operations.

Memory operations that occur before an `ACQUIRE` operation may appear to happen after it completes.

An `ACQUIRE` operation should almost always be paired with a `RELEASE` operation.

####  （5）`ACQUIRE`操作

这充当单向渗透屏障(one-way permeable barrier)。 它保证了 `ACQUIRE` 操作之后的所有内存操作都发生在`ACQUIRE`操作之后, 相对于系统的其他组件。 `ACQUIRE` 操作包括LOCK操作以及 `smp_load_acquire()` 和 `smp_cond_load_acquire()` 操作。

在`ACQUIRE`操作之前发生的内存操作有可能在 `ACQUIRE` 操作之后完成。

`ACQUIRE` 操作基本上都要与 `RELEASE` 操作搭配使用。


(6) `RELEASE` operations.

This also acts as a one-way permeable barrier.  It guarantees that all memory operations before the `RELEASE` operation will appear to happen before the `RELEASE` operation with respect to the other components of the system. `RELEASE` operations include UNLOCK operations and `smp_store_release()` operations.

Memory operations that occur after a `RELEASE` operation may appear to happen before it completes.

The use of `ACQUIRE` and `RELEASE` operations generally precludes the need for other sorts of memory barrier.  In addition, a RELEASE+ACQUIRE pair is -not- guaranteed to act as a full memory barrier.  However, after an `ACQUIRE` on a given variable, all memory accesses preceding any prior `RELEASE` on that same variable are guaranteed to be visible.  In other words, within a given variable's critical section, all accesses of all previous critical sections for that variable are guaranteed to have completed.

This means that `ACQUIRE` acts as a minimal "acquire" operation and `RELEASE` acts as a minimal "release" operation.


#### （6）`RELEASE`操作

`RELEASE`操作也充当单向渗透屏障。保证相对于系统的其他组件, `RELEASE`操作之前的所有内存操作都发生在`RELEASE`之前。 `RELEASE`操作包括 UNLOCK 操作和 `smp_store_release()` 操作。

在 `RELEASE` 操作之后发生的内存操作, 可能在其完成之前发生。

使用 `ACQUIRE` 和 `RELEASE` 操作一般排除了对其他种类内存屏障的需求。此外, RELEASE+ACQUIRE 不保证可充当完整的内存屏障。 但是, 在对给定变量执行 `ACQUIRE` 之后, 可以保证对该变量进行任何`RELEASE`之前的内存访问都是可见的。 换句话说, 在给定变量的关键部分内, 可以保证对该变量的所有前面关键部分的所有访问均已完成。

这意味着 `ACQUIRE` 充当最小 "获取" 操作, `RELEASE`充当最小 "释放" 操作。


A subset of the atomic operations described in atomic_t.txt have `ACQUIRE` and `RELEASE` variants in addition to fully-ordered and relaxed (no barrier semantics) definitions.  For compound atomics performing both a load and a store, `ACQUIRE` semantics apply only to the load and `RELEASE` semantics apply only to the store portion of the operation.

Memory barriers are only required where there's a possibility of interaction between two CPUs or between a CPU and a device.  If it can be guaranteed that there won't be any such interaction in any particular piece of code, then memory barriers are unnecessary in that piece of code.


Note that these are the _minimum_ guarantees.  Different architectures may give more substantial guarantees, but they may _not_ be relied upon outside of arch specific code.

除了完全有序和宽松（无屏障语义）定义之外,  `atomic_t.txt` 文件中描述的原子操作的子集还具有 `ACQUIRE` 和 `RELEASE` 变体。 对于同时执行load和store的复合原子操作, `ACQUIRE`语义只适用于load, 而`RELEASE`语义只适用于store部分的操作。

仅在两个CPU之间,或CPU与设备之间可能存在交互的情况下才需要内存屏障。 如果可以保证在任何特定的代码段中都不会发生此类交互, 那么该代码段中就不需要内存屏障。


请注意, 这些是最低保证。不同的体系结构可能会提供更多实质性保证, 但是特定于体系结构的代码之外可能不会可靠。



WHAT MAY NOT BE ASSUMED ABOUT MEMORY BARRIERS?
----------------------------------------------

There are certain things that the Linux kernel memory barriers do not guarantee:

- (`*`) There is no guarantee that any of the memory accesses specified before a memory barrier will be _complete_ by the completion of a memory barrier instruction; the barrier can be considered to draw a line in that CPU's access queue that accesses of the appropriate type may not cross.

- (`*`) There is no guarantee that issuing a memory barrier on one CPU will have any direct effect on another CPU or any other hardware in the system.  The indirect effect will be the order in which the second CPU sees the effects of the first CPU's accesses occur, but see the next point:

- (`*`) There is no guarantee that a CPU will see the correct order of effects from a second CPU's accesses, even _if_ the second CPU uses a memory barrier, unless the first CPU _also_ uses a matching memory barrier (see the subsection on "SMP Barrier Pairing").

- (`*`) There is no guarantee that some intervening piece of off-the-CPU hardware[*] will not reorder the memory accesses.  CPU cache coherency mechanisms should propagate the indirect effects of a memory barrier between CPUs, but might not do so in order.



<a name="WHAT_MAY_NOT_BE_ASSUMED_ABOUT_MEMORY_BARRIERS"></a>
### 2.2 内存屏障可能不包含什么？

下面是Linux内核的内存屏障不能提供保证的事情:

- (`*`) 不保证内存屏障之前的内存访问操作, 都能通过屏障指令的完成而完成。 可以认为屏障只是对CPU的访问队列划了一条线, 使特定类型的内存操作不会交叉。
- (`*`) 不能保证在一个CPU上发出的内存屏障, 会对其他CPU或者其他硬件件产生直接影响。 间接效果则是其他CPU看到第一个CPU的操作效果发生的顺序, 但请看下一点。
- (`*`) 不能保证CPU会从第二个CPU的访问中看到正确的效果顺序, 即使第二个CPU也使用了内存屏障, 除非第一个CPU也使用了匹配的内存屏障。 请参阅 ["SMP barrier pairing"](#SMP_BARRIER_PAIRING) 小节。
- (`*`) 不能保证某些介于中间的非CPU硬件(off-the-CPU hardware), 不会对内存访问进行重排序。 CPU缓存一致性机制应在CPU之间传播内存屏障的间接影响, 但也可能不这样做。


> [ * ] For information on bus mastering DMA and coherency please read:

> 总线主控DMA和一致性的有关信息, 请阅读:

```
Documentation/driver-api/pci/pci.rst
Documentation/core-api/dma-api-howto.rst
Documentation/core-api/dma-api.rst
```


DATA DEPENDENCY BARRIERS (HISTORICAL)
-------------------------------------

As of v4.15 of the Linux kernel, an `smp_mb()` was added to `READ_ONCE()` for DEC Alpha, which means that about the only people who need to pay attention to this section are those working on DEC Alpha architecture-specific code and those working on `READ_ONCE()` itself.  For those who need it, and for those who are interested in the history, here is the story of data-dependency barriers.

The usage requirements of data dependency barriers are a little subtle, and it's not always obvious that they're needed.  To illustrate, consider the following sequence of events:


<a name="DATA_DEPENDENCY_BARRIERS_HISTORICAL"></a>
### 2.3 数据依赖屏障（历史）

从Linux内核v4.15开始, 对 DEC Alpha 架构的 `READ_ONCE()` 添加了一个 `smp_mb()` 操作, 也就是说只有从事 DEC Alpha 架构, 与 `READ_ONCE()` 打交道的人员才需要关注本节。 对于需要它以及对其历史感兴趣的人来说, 不仅有数据依赖屏障, 还有故事。

数据依赖屏障的使用要求有些微妙, 并不一定总是需要它们。 为了演示说明, 我们一起来看以下事件序列:


```c
CPU 1                  CPU 2
===============        ===============
初始值: { A == 1, B == 2, C == 3, P == &A, Q == &C }
B = 4;
<write barrier>
WRITE_ONCE(P, &B);
                        Q = READ_ONCE(P);
                        D = *Q;
```

There's a clear data dependency here, and it would seem that by the end of the sequence, `Q` must be either `&A` or `&B`, and that:

这里存在明确的数据依赖, 并且在事件序列结束时, `Q` 只能是 `&A` 或者 `&B`, 并且:

```c
(Q == &A) 则蕴含着 (D == 1)
(Q == &B) 则蕴含着 (D == 4)
```

But!  CPU 2's perception of P may be updated _before_ its perception of B, thus leading to the following situation:

但是！ CPU 2对P的感知, 可能在对B感知之前被更新, 从而导致这种情况:

```c
(Q == &B) and (D == 2) 什么鬼????
```

While this may seem like a failure of coherency or causality maintenance, it isn't, and this behaviour can be observed on certain real CPUs (such as the DEC Alpha).

To deal with this, a data dependency barrier or better must be inserted between the address load and the data load:

尽管看起来像是一致性或因果关系维护的失败, 但事实并非如此, 并且可以在某些实际的CPU上观察到此行为（例如DEC Alpha）。

为了解决这个问题, 必须在 address load 和 data load 之间插入数据依赖屏障或更好的屏障:


```c
CPU 1                  CPU 2
===============        ===============
初始值: { A == 1, B == 2, C == 3, P == &A, Q == &C }
B = 4;
<write barrier>
WRITE_ONCE(P, &B);
                        Q = READ_ONCE(P);
                        <data dependency barrier>
                        D = *Q;
```

This enforces the occurrence of one of the two implications, and prevents the third possibility from arising.

[!] Note that this extremely counterintuitive situation arises most easily on machines with split caches, so that, for example, one cache bank processes even-numbered cache lines and the other bank processes odd-numbered cache lines.  The pointer P might be stored in an odd-numbered cache line, and the variable B might be stored in an even-numbered cache line.  Then, if the even-numbered bank of the reading CPU's cache is extremely busy while the odd-numbered bank is idle, one can see the new value of the pointer P (&B), but the old value of the variable B (2).

A data-dependency barrier is not required to order dependent writes because the CPUs that the Linux kernel supports don't do writes until they are certain (1) that the write will actually happen, (2) of the location of the write, and (3) of the value to be written. But please carefully read the "CONTROL DEPENDENCIES" section and the Documentation/RCU/rcu_dereference.rst file:  The compiler can and does break dependencies in a great many highly creative ways.


这样就强制了只能发生两种含义之中的一种, 并阻止第三种可能性的出现。

> [!] 请注意, 这种非常违反直觉的情况, 在具有拆分式 cache 的计算机上很容易出现, 例如, 一个缓存库处理偶数缓存行, 另一缓存库处理奇数缓存行。 指针`P`可能会存储在奇数缓存行中, 变量B可以存储在偶数缓存行中。 然后, 如果CPU的偶数缓存读取繁忙, 而奇数存储区处于空闲状态, 则可能会看到指针 `P (&B) `已经变成了新值,  但看到的变量`B`还是旧值 `2` 。


对于顺序依赖的写入, 不需要数据依赖屏障, 因为Linux内核支持以下情况发生前, CPU不会执行写入:
- (1) 写入实际发生之前,
- (2) 确定写入的位置之前,
- (3) 确定要写入的具体值之前。

但请仔细阅读 "CONTROL DEPENDENCIES" 章节, 以及 `Documentation/RCU/rcu_dereference.rst` 文件: 编译器可能会以各种匪夷所思的优化手段来打破依赖关系。



```c
CPU 1                   CPU 2
===============        ===============
初始值: { A == 1, B == 2, C = 3, P == &A, Q == &C }
B = 4;
<write barrier>
WRITE_ONCE(P, &B);
                        Q = READ_ONCE(P);
                        WRITE_ONCE(*Q, 5);
```

Therefore, no data-dependency barrier is required to order the read into Q with the store into *Q.  In other words, this outcome is prohibited, even without a data-dependency barrier:

因此, 不需要数据依赖屏障, 就可以保证先将数据读入`Q`, 然后再写入 `*Q` 的顺序。 换句话说, 即使没有数据依赖屏障, 也不会产生下面这种结果:

```c
(Q == &B) && (B == 4)
```

Please note that this pattern should be rare.  After all, the whole point of dependency ordering is to -prevent- writes to the data structure, along with the expensive cache misses associated with those writes.  This pattern can be used to record rare error conditions and the like, and the CPUs' naturally occurring ordering prevents such records from being lost.


Note well that the ordering provided by a data dependency is local to the CPU containing it.  See the section on "Multicopy atomicity" for more information.


The data dependency barrier is very important to the RCU system, for example.  See `rcu_assign_pointer()` and `rcu_dereference()` in `include/linux/rcupdate.h`.  This permits the current target of an RCU'd pointer to be replaced with a new modified target, without the replacement target appearing to be incompletely initialised.

See also the subsection on "Cache Coherency" for a more thorough example.


请注意, 这种模式应该很少见。 毕竟, 依存关系排序的全部要点是防止对数据结构的写入, 以及与这些写入相关的高速缓存未命中。 此模式可用于记录罕见的错误情况等, 并且CPU的自然排序也能防止此类记录丢失。

请注意, 数据依赖项提供的顺序是包含它的CPU的局部顺序。 有关更多信息, 请参见 [2.5.3 多副本原子性](#MULTICOPY_ATOMICITY) 章节。


例如, 数据依赖屏障对于 RCU 系统非常重要。 请参阅 `include/linux/rcupdate.h` 中的 `rcu_assign_pointer()` 和 `rcu_dereference()`。 这允许将RCU指针的当前目标替换为新的修改后的目标, 而替换目标并不会出现未完全初始化。

另请参阅 "Cache Coherency" 小节, 以获取更完整的示例。


CONTROL DEPENDENCIES
--------------------

Control dependencies can be a bit tricky because current compilers do not understand them.  The purpose of this section is to help you prevent the compiler's ignorance from breaking your code.

A load-load control dependency requires a full read memory barrier, not simply a data dependency barrier to make it work correctly.  Consider the following bit of code:

<a name="CONTROL_DEPENDENCIES"></a>
### 2.4 控制依赖

控制依赖有一点棘手, 因为现在的编译器还无法理解。 本节的目的是帮助读者了解, 怎样防止由于编译器的无知而破坏代码。

load-load 控制依赖关系要正常维持, 需要使用完整的读屏障(full read memory barrier), 而不是简单的数据依赖屏障。
请看以下代码:

```c
q = READ_ONCE(a);
if (q) {
  <data dependency barrier>  /* BUG: 数据依赖屏障在这里没用!!! */
  p = READ_ONCE(b);
}
```

This will not have the desired effect because there is no actual data dependency, but rather a control dependency that the CPU may short-circuit by attempting to predict the outcome in advance, so that other CPUs see the load from b as having happened before the load from a.  In such a case what's actually required is:

由于没有实际的数据依赖关系, 因此不会产生预期的效果, 这里实际上是一种控制依赖关系, CPU可能会尝试通过分支预测的结果而造成短路, 这样的话使其他CPU可能会先看到b的load结果, 然后再看到a的load结果。

在这种情况下, 实际需要的是读屏障:

```c
q = READ_ONCE(a);
if (q) {
  <read barrier>
  p = READ_ONCE(b);
}
```

However, stores are not speculated.  This means that ordering -is- provided for load-store control dependencies, as in the following example:

但是, store 是不存在预判的。 这意味着 load-store 控制依赖的执行顺序会得到保证, 如以下示例所示:

```c
q = READ_ONCE(a);
if (q) {
  WRITE_ONCE(b, 1);
}
```


Control dependencies pair normally with other types of barriers. That said, please note that neither `READ_ONCE()` nor `WRITE_ONCE()` are optional! Without the `READ_ONCE()`, the compiler might combine the load from 'a' with other loads from 'a'.  Without the `WRITE_ONCE()`, the compiler might combine the store to 'b' with other stores to 'b'. Either can result in highly counterintuitive effects on ordering.

Worse yet, if the compiler is able to prove (say) that the value of variable 'a' is always non-zero, it would be well within its rights to optimize the original example by eliminating the "if" statement as follows:

控制依赖通常与其他屏障配对使用。 也就是说, `READ_ONCE()` 和 `WRITE_ONCE() 都是不可省略的！ 如果没有`READ_ONCE()`, 则编译器可能会将 'a' 的load 与 'a' 的其他load组合在一起。 如果没有 `WRITE_ONCE()`, 编译器可能会将 'b' 的 store 与'b'的其他 store 合并。 这两种情况都会造成违反预期顺序的影响。

更糟糕的是, 如果能够证明变量'a'的值始终为非零, 那么按照约定, 编译器就可以通过消除 "if" 语句来进行优化, 然后就像下面这样:

```c
q = a;
b = 1;  /* BUG: 编译器和CPU都可能会重排序!!! */
```

So don't leave out the `READ_ONCE()`.

It is tempting to try to enforce ordering on identical stores on both branches of the "if" statement as follows:

因此, 请不要忽略 `READ_ONCE()`。

编译器试图在 "if" 语句的两个分支上的相同 store 上强制执行排队。

比如有下面的代码:

```c
q = READ_ONCE(a);
if (q) {
  `barrier()`;
  WRITE_ONCE(b, 1);
  do_something();
} else {
  `barrier()`;
  WRITE_ONCE(b, 1);
  do_something_else();
}
```

Unfortunately, current compilers will transform this as follows at high optimization levels:

不幸的是, 现在的编译器将在高优化级别上对此进行如下转换:

```c
q = READ_ONCE(a);
barrier();
WRITE_ONCE(b, 1);  /* BUG: No ordering vs. load from a!!! */
if (q) {
  /* WRITE_ONCE(b, 1); -- moved up, BUG!!! */
  do_something();
} else {
  /* WRITE_ONCE(b, 1); -- moved up, BUG!!! */
  do_something_else();
}
```

Now there is no conditional between the load from 'a' and the store to 'b', which means that the CPU is within its rights to reorder them: The conditional is absolutely required, and must be present in the assembly code even after all compiler optimizations have been applied. Therefore, if you need ordering in this example, you need explicit memory barriers, for example, `smp_store_release()`:

现在, load 'a' 和 store 'b' 之间没有条件, 这意味着CPU有权对其进行重排序:  条件是绝对需要的, 即使在编译器优化之后, 在汇编代码中也必须存在该条件。 因此, 如果在此示例中需要保证顺序, 则需要显式的内存屏障, 例如 `smp_store_release()`:

```c
q = READ_ONCE(a);
if (q) {
  smp_store_release(&b, 1);
  do_something();
} else {
  smp_store_release(&b, 1);
  do_something_else();
}
```

In contrast, without explicit memory barriers, two-legged-if control ordering is guaranteed only when the stores differ, for example:

相反, 如果没有显式的内存屏障, 则只有在 store 不同时才能保证if的两条腿之间的控制顺序, 例如:

```c
q = READ_ONCE(a);
if (q) {
  WRITE_ONCE(b, 1);
  do_something();
} else {
  WRITE_ONCE(b, 2);
  do_something_else();
}
```

The initial `READ_ONCE()` is still required to prevent the compiler from proving the value of 'a'.

In addition, you need to be careful what you do with the local variable 'q', otherwise the compiler might be able to guess the value and again remove the needed conditional.  For example:

仍然需要初始的 `READ_ONCE()` 来防止编译器 proving 'a' 的值。

另外, 需要注意对局部变量 'q' 的处理方式, 否则编译器可能会猜测该值并再次删除所需的条件。 例如:

```c
q = READ_ONCE(a);
if (q % MAX) {
  WRITE_ONCE(b, 1);
  do_something();
} else {
  WRITE_ONCE(b, 2);
  do_something_else();
}
```

If MAX is defined to be 1, then the compiler knows that `(q % MAX)` is equal to zero, in which case the compiler is within its rights to transform the above code into the following:

如果将 MAX 指定为1, 则编译器知道 `(q % MAX)` 等于零, 在这种情况下, 编译器有权将上述代码转换为以下代码:

```c
q = READ_ONCE(a);
WRITE_ONCE(b, 2);
do_something_else();
```

Given this transformation, the CPU is not required to respect the ordering between the load from variable 'a' and the store to variable 'b'.  It is tempting to add a `barrier()`, but this does not help.  The conditional is gone, and the barrier won't bring it back.  Therefore, if you are relying on this ordering, you should make sure that MAX is greater than one, perhaps as follows:

这种转换之后, CPU就不需要遵守 load 变量 'a' 和 store 变量 'b' 之间的顺序。 尝试添加 `barrier()` 看起来很诱人, 但并没有用。 条件已经消失, 屏障也不能把它带回来。 因此, 如果您依赖此顺序, 则应确保MAX大于1, 也许如下所示:

```c
q = READ_ONCE(a);
BUILD_BUG_ON(MAX <= 1); /* Order load from a with store to b. */
if (q % MAX) {
  WRITE_ONCE(b, 1);
  do_something();
} else {
  WRITE_ONCE(b, 2);
  do_something_else();
}
```

Please note once again that the stores to 'b' differ.  If they were identical, as noted earlier, the compiler could pull this store outside of the 'if' statement.

You must also be careful not to rely too much on boolean short-circuit evaluation.  Consider this example:

请再次注意, store 'b' 的值有所不同。 如前所述, 如果它们相同, 则编译器可以将此 store 拉到 'if' 语句之外。

您还必须注意, 不要过多地依赖布尔值的短路计算。 请看以下示例:

```c
q = READ_ONCE(a);
if (q || 1 > 0)
  WRITE_ONCE(b, 1);
```

Because the first condition cannot fault and the second condition is always true, the compiler can transform this example as following, defeating control dependency:

因为第一个条件不可能出错, 而第二个条件始终为 true, 所以编译器可以按如下所示来进行变换, 从而消除了控制依赖:

```c
q = READ_ONCE(a);
WRITE_ONCE(b, 1);
```

This example underscores the need to ensure that the compiler cannot out-guess your code.  More generally, although `READ_ONCE()` does force the compiler to actually emit code for a given load, it does not force the compiler to use the results.

In addition, control dependencies apply only to the then-clause and else-clause of the if-statement in question.  In particular, it does not necessarily apply to code following the if-statement:

此示例强调了确保编译器不会猜测您的代码的需要。 更通用地讲, 尽管 `READ_ONCE()` 确实会强制编译器针对给定的 load 操作生成代码, 但不会强制编译器使用他的结果。

此外, 控制依赖项仅适用于所讨论的if语句的子句和 else-子句。 特别是, 它不一定适用于 if 语句后面的代码:

```c
q = READ_ONCE(a);
if (q) {
  WRITE_ONCE(b, 1);
} else {
  WRITE_ONCE(b, 2);
}
WRITE_ONCE(c, 1);  /* BUG: No ordering against the read from 'a'. */
```

It is tempting to argue that there in fact is ordering because the compiler cannot reorder volatile accesses and also cannot reorder the writes to 'b' with the condition.  Unfortunately for this line of reasoning, the compiler might compile the two writes to 'b' as conditional-move instructions, as in this fanciful pseudo-assembly language:

这段代码试图想要说明代码是有序的, 因为编译器无法对 volatile 易失性访问进行重排序,  也无法根据条件对 'b' 的写操作进行重排序。 不幸的是, 出于这种推理, 编译器可能会将这两个对b的写操作作为条件移动指令进行编译, 例如在这种奇妙的伪汇编语言中:

```c
ld r1,a
cmp r1,$0
cmov,ne r4,$1
cmov,eq r4,$2
st r4,b
st $1,c
```

A weakly ordered CPU would have no dependency of any sort between the load from 'a' and the store to 'c'.  The control dependencies would extend only to the pair of cmov instructions and the store depending on them. In short, control dependencies apply only to the stores in the then-clause and else-clause of the if-statement in question (including functions invoked by those two clauses), not to code following that if-statement.


Note well that the ordering provided by a control dependency is local to the CPU containing it.  See the section on "Multicopy atomicity" for more information.


顺序较弱的CPU在从 'a' load, 和 store 到 'c' 之间将没有任何依赖关系。 控制依赖项将仅扩展到这对 cmov 指令和依赖它们的store。 简而言之, 控制依赖项仅适用于所讨论的if语句的子句和else子句中的store（包括由这两个子句调用的函数）, 而不适用于if语句之后的代码。


请注意, 控制依赖项提供的排序是包含它的CPU本地的。 更多信息, 请参见 [2.5.3 多副本原子性](#MULTICOPY_ATOMICITY) 部分。


In summary:

- (`*`) Control dependencies can order prior loads against later stores.  However, they do -not- guarantee any other sort of ordering:  Not prior loads against later loads, nor prior stores against  later anything.  If you need these other forms of ordering,  use `smp_rmb()`, `smp_wmb()`, or, in the case of prior stores and  later loads, `smp_mb()`.
- (`*`) If both legs of the "if" statement begin with identical stores to  the same variable, then those stores must be ordered, either by  preceding both of them with `smp_mb()` or by using `smp_store_release()`  to carry out the stores.  Please note that it is -not- sufficient  to use `barrier()` at beginning of each leg of the "if" statement  because, as shown by the example above, optimizing compilers can  destroy the control dependency while respecting the letter of the  `barrier()` law.
- (`*`) Control dependencies require at least one run-time conditional  between the prior load and the subsequent store, and this  conditional must involve the prior load.  If the compiler is able  to optimize the conditional away, it will have also optimized  away the ordering.  Careful use of `READ_ONCE()` and `WRITE_ONCE()`  can help to preserve the needed conditional.
- (`*`) Control dependencies require that the compiler avoid reordering the  dependency into nonexistence.  Careful use of `READ_ONCE()` or  `atomic{,64}_read()` can help to preserve your control dependency.  Please see the COMPILER BARRIER section for more information.
- (`*`) Control dependencies apply only to the then-clause and else-clause  of the if-statement containing the control dependency, including  any functions that these two clauses call.  Control dependencies  do -not- apply to code following the if-statement containing the  control dependency.
- (`*`) Control dependencies pair normally with other types of barriers.
- (`*`) Control dependencies do -not- provide multicopy atomicity.  If you  need all the CPUs to see a given store at the same time, use `smp_mb()`.
- (`*`) Compilers do not understand control dependencies.  It is therefore  your job to ensure that they do not break your code.

总结一下:

- (`*`) 控制依赖项可以保证前面的 load和后面的 store 顺序。 但是, 它们不保证任何其他排序方式:  不保证前面的load与后面的load顺序, 也不能保证前面的store和后面的任何操作的顺序。 如果需要这些形式的顺序, 请使用 `smp_rmb()`, `smp_wmb()`, 或者保证前面 store 与后面 load 操作的 `smp_mb()`。
- (`*`) 如果 "if" 语句的两条腿都把相同的值store到同一个变量, 又需要保证这些store的顺序, 则需要在两个 store 之前都加上 `smp_mb()`, 或使用 `smp_store_release()` 来执行store。 请注意, 只在"if"语句每个分支的开始处使用 `barrier()`是不够的, 因为如上例所示, 编译器优化在关注 `barrier()` 规则的同时, 可能会破坏控制依赖关系。
- (`*`) 控制依赖项要求在前面的load和后续的store之间至少有一个运行时条件, 并且该条件必须涉及前面的load。如果编译器能够将条件判断优化掉, 那么它也会将顺序给优化掉。 仔细使用 `READ_ONCE()` 和`WRITE_ONCE()`可以帮助保留所需的条件。
- (`*`) 控制依赖项要求编译器避免将依赖项重排序为不存在。仔细使用 `READ_ONCE()` 或 `atomic{,64}_read()` 可以有助于保留控制依赖。请参阅 COMPILER BARRIER 部分以获取更多信息。
- (`*`) 控制依赖仅适用于包含控制依赖项的if语句的从句和else子句, 包括这两个子句调用的任何函数。 控制依赖不适用于包含控制依赖项的if语句之后的代码。
- (`*`) 控制依赖通常与其他类型的屏障搭配使用。
- (`*`) 控制依赖不提供多副本原子性。如果需要所有CPU同时看到给定store的结果, 请使用`smp_mb()`。
- (`*`) 编译器不了解控制依赖。 因此, 确保它们不会破坏您的代码是您的责任。



SMP BARRIER PAIRING
-------------------

When dealing with CPU-CPU interactions, certain types of memory barrier should always be paired.  A lack of appropriate pairing is almost certainly an error.

General barriers pair with each other, though they also pair with most other types of barriers, albeit without multicopy atomicity.  An acquire barrier pairs with a release barrier, but both may also pair with other barriers, including of course general barriers.  A write barrier pairs with a data dependency barrier, a control dependency, an acquire barrier, a release barrier, a read barrier, or a general barrier.  Similarly a read barrier, control dependency, or a data dependency barrier pairs with a write barrier, an acquire barrier, a release barrier, or a general barrier:


<a name="SMP_BARRIER_PAIRING"></a>
### 2.5 SMP屏障搭配

在处理CPU与CPU之间的交互时,应始终搭配使用某些类型的内存屏障。 如果没有合适的屏障, 可以肯定会存在错误。

通用屏障彼此配对,尽管它们也可以和其他类型的大多数屏障配对,尽管没有多副本原子性。
获取屏障与释放屏障彼此配对,但两者也可能与其他屏障配对,当然也包括一般屏障。
写屏障可以和: 数据依赖屏障,控制依赖屏障,获取屏障,释放屏障,读屏障, 以及常规屏障配对。
类似地,读屏障,控制依赖屏障,或数据依赖屏障, 也可以和写屏障,获取屏障,释放屏障或常规屏障配对:

```c
  CPU 1                  CPU 2
  ===============        ===============
  WRITE_ONCE(a, 1);
  <write barrier>
  WRITE_ONCE(b, 2);      x = READ_ONCE(b);
                         <read barrier>
                         y = READ_ONCE(a);
```

Or:

或者是这样:

```c
  CPU 1                  CPU 2
  ===============        ===============================
  a = 1;
  <write barrier>
  WRITE_ONCE(b, &a);    x = READ_ONCE(b);
                        <data dependency barrier>
                        y = *x;
```

Or even:

或者是这样:

```c
  CPU 1                  CPU 2
  ===============        ===============================
  r1 = READ_ONCE(y);
  <general barrier>
  WRITE_ONCE(x, 1);     if (r2 = READ_ONCE(x)) {
                            <implicit control dependency>
                            WRITE_ONCE(y, 1);
                        }

  assert(r1 == 0 || r2 == 0);
```

Basically, the read barrier always has to be there, even though it can be of the "weaker" type.

> [!] Note that the stores before the write barrier would normally be expected to match the loads after the read barrier or the data dependency barrier, and vice versa:

一般来说,必须始终在其中放置读屏障, 即使它是一个 "较弱" 类型的屏障,

> [!] 请注意,通常预期是: 写屏障之前的 store, 与读屏障或数据依赖屏障之后的 load 相匹配,反之亦然:


```c
  CPU 1                               CPU 2
  ===================                 ===================
  WRITE_ONCE(a, 1);    }----   --->{  v = READ_ONCE(c);
  WRITE_ONCE(b, 2);    }    \ /    {  w = READ_ONCE(d);
  <write barrier>            \        <read barrier>
  WRITE_ONCE(c, 3);    }    / \    {  x = READ_ONCE(a);
  WRITE_ONCE(d, 4);    }----   --->{  y = READ_ONCE(b);
```

EXAMPLES OF MEMORY BARRIER SEQUENCES
------------------------------------

Firstly, write barriers act as partial orderings on store operations. Consider the following sequence of events:



<a name="EXAMPLES_OF_MEMORY_BARRIER_SEQUENCES"></a>
### 2.6 内存屏障序列的示例

首先, 写屏障(write barrier)充当了对 store 操作进行部分排序的角色。
请看以下事件序列:

```c
CPU 1
=======================
STORE A = 1
STORE B = 2
STORE C = 3
<write barrier>
STORE D = 4
STORE E = 5
```

This sequence of events is committed to the memory coherence system in an order that the rest of the system might perceive as the unordered set of `{ STORE A, STORE B, STORE C }` all occurring before the unordered set of `{ STORE D, STORE E }`:

事件序列提交给内存一致性系统(memory coherence system):  而系统的其余部分可以将 `{ STORE A, STORE B, STORE C }` 视为无序的集合,只要它们都发生另一个无序集合 `{ STORE D, STORE E }` 之前:


```c
  +-------+       :      :
  |       |       +------+
  |       |------>| C=3  |     }     /\
  |       |  :    +------+     }-----  \  -----> 系统其余部分可能感知到
  |       |  :    | A=1  |     }        \/       (perceptible)的事件顺序
  |       |  :    +------+     }
  | CPU 1 |  :    | B=2  |     }
  |       |       +------+     }
  |       |   wwwwwwwwwwwwwwww }   <--- 写屏障在这个位置,
  |       |       +------+     }        要求先进行(committed)屏障前面的所有 store,
  |       |  :    | E=5  |     }        然后再进行后面的 store
  |       |  :    +------+     }        
  |       |------>| D=4  |     }
  |       |       +------+
  +-------+       :      :
                     |
                     | CPU 1 执行时,
                     | 提交 store 给内存系统的顺序
                     V
```


Secondly, data dependency barriers act as partial orderings on data-dependent loads.  Consider the following sequence of events:

其次, 数据依赖屏障(data dependency barriers)充当了数据依赖 load 的部分排序。
请看以下事件序列:


```c
  CPU 1                    CPU 2
  =======================  =======================
    初始值: { B = 7; X = 9; Y = 8; C = &Y }
  STORE A = 1
  STORE B = 2
  <write barrier>
  STORE C = &B            LOAD X
  STORE D = 4             LOAD C (期望gets &B)
                          LOAD *C (期望reads B)
```

Without intervention, CPU 2 may perceive the events on CPU 1 in some effectively random order, despite the write barrier issued by CPU 1:

如果没有干预(intervention), 即使 CPU 1 发出了写屏障, 但 CPU 2 还是可能会以某种优化的随机顺序感知到CPU 1上的事件。


```c
  +-------+       :      :                :       :
  |       |       +------+                +-------+  | Sequence of update
  |       |------>| B=2  |-----       --->| Y->8  |  | of perception on
  |       |  :    +------+     \          +-------+  | CPU 2
  | CPU 1 |  :    | A=1  |      \     --->| C->&Y |  V
  |       |       +------+       |        +-------+
  |       |   wwwwwwwwwwwwwwww   |        :       :
  |       |       +------+       |        :       :
  |       |  :    | C=&B |---    |        :       :       +-------+
  |       |  :    +------+   \   |        +-------+       |       |
  |       |------>| D=4  |    ----------->| C->&B |------>|       |
  |       |       +------+       |        +-------+       |       |
  +-------+       :      :       |        :       :       |       |
                                 |        :       :       |       |
                                 |        :       :       | CPU 2 |
                                 |        +-------+       |       |
      Apparently incorrect --->  |        | B->7  |------>|       |
      perception of B (!)        |        +-------+       |       |
                                 |        :       :       |       |
                                 |        +-------+       |       |
      The load of X holds --->    \       | X->9  |------>|       |
      up the maintenance           \      +-------+       |       |
      of coherence of B             ----->| B->2  |       +-------+
                                          +-------+
                                          :       :
```


In the above example, CPU 2 perceives that B is 7, despite the load of *C (which would be B) coming after the LOAD of C.

If, however, a data dependency barrier were to be placed between the load of C and the load of *C (ie: B) on CPU 2:

在上面的案例中, CPU 2 看到的 B 值为 7, 虽然 `LOAD *C`（可能为B）是在 `LOAD C` 之后出现。

但如果在 CPU 2 的  `LOAD C` 和 `LOAD *C`（即: B）之间加一个数据依赖屏障:

```c
  CPU 1                    CPU 2
  =======================  =======================
    初始值: { B = 7; X = 9; Y = 8; C = &Y }
  STORE A = 1
  STORE B = 2
  <write barrier>
  STORE C = &B             LOAD X
  STORE D = 4              LOAD C (gets &B)
                           <data dependency barrier>
                           LOAD *C (reads B)
```

then the following will occur:

那么情况将会变成这样:

```c
  +-------+       :      :                :       :
  |       |       +------+                +-------+
  |       |------>| B=2  |-----       --->| Y->8  |
  |       |  :    +------+     \          +-------+
  | CPU 1 |  :    | A=1  |      \     --->| C->&Y |
  |       |       +------+       |        +-------+
  |       |   wwwwwwwwwwwwwwww   |        :       :
  |       |       +------+       |        :       :
  |       |  :    | C=&B |---    |        :       :       +-------+
  |       |  :    +------+   \   |        +-------+       |       |
  |       |------>| D=4  |    ----------->| C->&B |------>|       |
  |       |       +------+       |        +-------+       |       |
  +-------+       :      :       |        :       :       |       |
                                 |        :       :       |       |
                                 |        :       :       | CPU 2 |
                                 |        +-------+       |       |
                                 |        | X->9  |------>|       |
                                 |        +-------+       |       |
    Makes sure all effects --->   \   ddddddddddddddddd   |       |
    prior to the store of C        \      +-------+       |       |
    are perceptible to              ----->| B->2  |------>|       |
    subsequent loads                      +-------+       |       |
                                          :       :       +-------+
```


And thirdly, a read barrier acts as a partial order on loads.  Consider the following sequence of events:

再次, 读屏障(read barrier)用作 load 的部分顺序。
请看以下事件序列:

```c
  CPU 1                    CPU 2
  =======================  =======================
    初始值:  { A = 0, B = 9 }
  STORE A=1
  <write barrier>
  STORE B=2
                           LOAD B
                           LOAD A
```

Without intervention, CPU 2 may then choose to perceive the events on CPU 1 in some effectively random order, despite the write barrier issued by CPU 1:

如果没有干预,CPU 2 便可以选择以某种有效的随机顺序感知到CPU 1上的事件,尽管CPU 1发出了写屏障:    

```c
  +-------+       :      :                :       :
  |       |       +------+                +-------+
  |       |------>| A=1  |------      --->| A->0  |
  |       |       +------+      \         +-------+
  | CPU 1 |   wwwwwwwwwwwwwwww   \    --->| B->9  |
  |       |       +------+        |       +-------+
  |       |------>| B=2  |---     |       :       :
  |       |       +------+   \    |       :       :       +-------+
  +-------+       :      :    \   |       +-------+       |       |
                               ---------->| B->2  |------>|       |
                                  |       +-------+       | CPU 2 |
                                  |       | A->0  |------>|       |
                                  |       +-------+       |       |
                                  |       :       :       +-------+
                                   \      :       :
                                    \     +-------+
                                     ---->| A->1  |
                                          +-------+
                                          :       :
```

If, however, a read barrier were to be placed between the load of B and the load of A on CPU 2:

但如果在 CPU 2 上 `LOAD B` 和 `LOAD A` 之间放一个读屏障:    

```c
  CPU 1                    CPU 2
  =======================  =======================
    初始值:  { A = 0, B = 9 }
  STORE A=1
  <write barrier>
  STORE B=2
                           LOAD B
                           <read barrier>
                           LOAD A
```

then the partial ordering imposed by CPU 1 will be perceived correctly by CPU 2:

那么 CPU 2 将正确感知到 CPU 1 施加的部分排序:    

```c
  +-------+       :      :                :       :
  |       |       +------+                +-------+
  |       |------>| A=1  |------      --->| A->0  |
  |       |       +------+      \         +-------+
  | CPU 1 |   wwwwwwwwwwwwwwww   \    --->| B->9  |
  |       |       +------+        |       +-------+
  |       |------>| B=2  |---     |       :       :
  |       |       +------+   \    |       :       :       +-------+
  +-------+       :      :    \   |       +-------+       |       |
                               ---------->| B->2  |------>|       |
                                  |       +-------+       | CPU 2 |
                                  |       :       :       |       |
                                  |       :       :       |       |
    At this point the read ---->   \  rrrrrrrrrrrrrrrrr   |       |
    barrier causes all effects      \     +-------+       |       |
    prior to the storage of B        ---->| A->1  |------>|       |
    to be perceptible to CPU 2            +-------+       |       |
                                          :       :       +-------+
```


To illustrate this more completely, consider what could happen if the code contained a load of A either side of the read barrier:

为了更完整地说明这一点, 请思考在读屏障前后两侧的代码都包含`LOAD A`的情况下,将会发生什么:    


```c
  CPU 1                    CPU 2
  =======================  =======================
    初始值:  { A = 0, B = 9 }
  STORE A=1
  <write barrier>
  STORE B=2
                           LOAD B
                           LOAD A [first load of A]
                           <read barrier>
                           LOAD A [second load of A]
```

Even though the two loads of A both occur after the load of B, they may both come up with different values:

虽然两个 `LOAD A` 都在 `LOAD B` 后面, 但它们可能具有不同的值:    

```c
  +-------+       :      :                :       :
  |       |       +------+                +-------+
  |       |------>| A=1  |------      --->| A->0  |
  |       |       +------+      \         +-------+
  | CPU 1 |   wwwwwwwwwwwwwwww   \    --->| B->9  |
  |       |       +------+        |       +-------+
  |       |------>| B=2  |---     |       :       :
  |       |       +------+   \    |       :       :       +-------+
  +-------+       :      :    \   |       +-------+       |       |
                               ---------->| B->2  |------>|       |
                                  |       +-------+       | CPU 2 |
                                  |       :       :       |       |
                                  |       :       :       |       |
                                  |       +-------+       |       |
                                  |       | A->0  |------>| 1st   |
                                  |       +-------+       |       |
    At this point the read ---->   \  rrrrrrrrrrrrrrrrr   |       |
    barrier causes all effects      \     +-------+       |       |
    prior to the storage of B        ---->| A->1  |------>| 2nd   |
    to be perceptible to CPU 2            +-------+       |       |
                                          :       :       +-------+

```


But it may be that the update to A from CPU 1 becomes perceptible to CPU 2 before the read barrier completes anyway:

但无论如何, 在读屏障完成之前, CPU 2 一定可以感知到 CPU 1 对 A 执行的更新:    

```c
  +-------+       :      :                :       :
  |       |       +------+                +-------+
  |       |------>| A=1  |------      --->| A->0  |
  |       |       +------+      \         +-------+
  | CPU 1 |   wwwwwwwwwwwwwwww   \    --->| B->9  |
  |       |       +------+        |       +-------+
  |       |------>| B=2  |---     |       :       :
  |       |       +------+   \    |       :       :       +-------+
  +-------+       :      :    \   |       +-------+       |       |
                               ---------->| B->2  |------>|       |
                                  |       +-------+       | CPU 2 |
                                  |       :       :       |       |
                                   \      :       :       |       |
                                    \     +-------+       |       |
                                     ---->| A->1  |------>| 1st   |
                                          +-------+       |       |
                                      rrrrrrrrrrrrrrrrr   |       |
                                          +-------+       |       |
                                          | A->1  |------>| 2nd   |
                                          +-------+       |       |
                                          :       :       +-------+
```


The guarantee is that the second load will always come up with `A == 1` if the load of B came up with `B == 2`.  No such guarantee exists for the first load of A; that may come up with either `A == 0` or `A == 1`.

这对屏障保证: 如果 load B 得到的是 `B == 2` , 则保证第二个 load 将始终得到 `A == 1`。
而不保证第一个 load, 可能会得到 `A == 0` 或者 `A == 1`。


READ MEMORY BARRIERS VS LOAD SPECULATION
----------------------------------------

Many CPUs speculate with loads: that is they see that they will need to load an item from memory, and they find a time where they're not using the bus for any other loads, and so do the load in advance - even though they haven't actually got to that point in the instruction execution flow yet.  This permits the actual load instruction to potentially complete immediately because the CPU already has the value to hand.

It may turn out that the CPU didn't actually need the value - perhaps because a branch circumvented the load - in which case it can discard the value or just cache it for later use.

Consider:


<a name="READ_MEMORY_BARRIERS_VS_LOAD_SPECULATION"></a>
### 2.7 内存读屏障 VS. LOAD预加载

许多CPU对load有预加载: 也就是说, 如果看到需要从内存中加载一项数据, 并且找到了一个其他load不使用总线的时间, 因此提前进行 load 加载 - 即使CPU在指令执行流程中实际上还没有到达这个点。 这允许执行到实际的 load 指令时会立即完成, 因为CPU已经得到了这个值。

事实证明, CPU实际上可能并不需要这个值 - 可能是因为分支绕过了 load - 在这种情况下, CPU可以丢弃该值, 或将其缓存以备后用。

请看:    


```c
  CPU 1                    CPU 2
  =======================  =======================
                            LOAD B
                            DIVIDE    } 除法指令的执行
                            DIVIDE    } 通常比较耗时
                            LOAD A
```

Which might appear as this:

```c
                                          :       :       +-------+
                                          +-------+       |       |
                                      --->| B->2  |------>|       |
                                          +-------+       | CPU 2 |
                                          :       :DIVIDE |       |
                                          +-------+       |       |
  CPU流水线正在忙着进行除法运算  --->     --->| A->0  |~~~~   |       |
  根据预判, 先把 LOAD A 执行了               +-------+   ~   |       |
                                          :       :   ~   |       |
                                          :       :DIVIDE |       |
                                          :       :   ~   |       |
  一旦除法计算完成,                  -->     :       :   ~-->|       |
  LOAD即可触发立即完成的效果                  :       :       |       |
                                          :       :       +-------+
```


Placing a read barrier or a data dependency barrier just before the second load:

在第二次 load 之前放置读屏障或数据依赖屏障:

```c
  CPU 1                     CPU 2
  =======================  =======================
                            LOAD B
                            DIVIDE
                            DIVIDE
                            <read barrier>
                            LOAD A

```

will force any value speculatively obtained to be reconsidered to an extent dependent on the type of barrier used.  If there was no change made to the speculated memory location, then the speculated value will just be used:

将会迫使CPU重新权衡以推断方式获得的任何值, 这取决于所使用的屏障的类型。
如果对推断的内存位置没有进行任何更改, 则直接使用提前取到的值:

```c
                                          :       :       +-------+
                                          +-------+       |       |
                                      --->| B->2  |------>|       |
                                          +-------+       | CPU 2 |
                                          :       :DIVIDE |       |
                                          +-------+       |       |
  CPU忙于进行除法运算, --->              --->| A->0  |~~~~   |       |
  推断着执行 LOAD A                         +-------+   ~   |       |
                                          :       :   ~   |       |
                                          :       :DIVIDE |       |
                                          :       :   ~   |       |
                                          :       :   ~   |       |
                                      rrrrrrrrrrrrrrrr~   |       |
                                          :       :   ~   |       |
                                          :       :   ~-->|       |
                                          :       :       |       |
                                          :       :       +-------+

```

but if there was an update or an invalidation from another CPU pending, then the speculation will be cancelled and the value reloaded:

但如果另一个CPU执行了更新或者失效, 那么将取消推测, 并重新加载该值:

```c
                                          :       :       +-------+
                                          +-------+       |       |
                                      --->| B->2  |------>|       |
                                          +-------+       | CPU 2 |
                                          :       :DIVIDE |       |
                                          +-------+       |       |
  CPU忙于进行除法运算,          --->     --->| A->0  |~~~~   |       |
  推断着执行 LOAD A                         +-------+   ~   |       |
                                          :       :   ~   |       |
                                          :       :DIVIDE |       |
                                          :       :   ~   |       |
                                          :       :   ~   |       |
                                      rrrrrrrrrrrrrrrrr   |       |
                                          +-------+       |       |
  丢弃推断预加载的值              --->   --->| A->1  |------>|       |
  并获取更新后的值                           +-------+       |       |
                                          :       :       +-------+

```



MULTICOPY ATOMICITY
--------------------

Multicopy atomicity is a deeply intuitive notion about ordering that is not always provided by real computer systems, namely that a given store becomes visible at the same time to all CPUs, or, alternatively, that all CPUs agree on the order in which all stores become visible.  However, support of full multicopy atomicity would rule out valuable hardware optimizations, so a weaker form called `other multicopy atomicity` instead guarantees only that a given store becomes visible at the same time to all -other- CPUs.  The remainder of this document discusses this weaker form, but for brevity will call it simply `multicopy atomicity`.

The following example demonstrates multicopy atomicity:


<a name="MULTICOPY_ATOMICITY"></a>
#### 2.8 多副本原子性

多副本原子性是一种关于排序的非常直观的概念, 但并不是所有的计算机系统都提供支持; 即某个 store 在同一时刻对所有CPU都可见;  或者, 所有CPU同意某种顺序,让所有 store 都变为可见。 但是, 对多副本原子性的完全支持, 将会排除硬件层面有价值的优化, 因此 `other multicopy atomicity`(其他多副本原子性)的较弱形式, 只能保证一个给定的 store 对所有其他CPU同时可见。 本文档的其余部分讨论了这种较弱的形式, 但为简便起见, 将其简称为 `multicopy atomicity`(多副本原子性)。

以下示例演示了多副本原子性:

```c
  CPU 1                    CPU 2                    CPU 3
  =======================  =======================  =======================
    初始值:  { X = 0, Y = 0 }
  STORE X=1                 r1=LOAD X (reads 1)     LOAD Y (reads 1)
                            <general barrier>       <read barrier>
                            STORE Y=r1              LOAD X

```


Suppose that CPU 2's load from X returns 1, which it then stores to Y, and CPU 3's load from Y returns 1.  This indicates that CPU 1's store to X precedes CPU 2's load from X and that CPU 2's store to Y precedes CPU 3's load from Y.  In addition, the memory barriers guarantee that CPU 2 executes its load before its store, and CPU 3 loads from Y before it loads from X.  The question is then "Can CPU 3's load from X return 0?"

Because CPU 3's load from X in some sense comes after CPU 2's load, it is natural to expect that CPU 3's load from X must therefore return 1. This expectation follows from multicopy atomicity: if a load executing on CPU B follows a load from the same variable executing on CPU A (and CPU A did not originally store the value which it read), then on multicopy-atomic systems, CPU B's load must return either the same value that CPU A's load did or some later value.  However, the Linux kernel does not require systems to be multicopy atomic.

假设 CPU 2 执行 LOAD X 返回的值是 1, 然后将这个值 store 到 Y, 而 CPU 3 执行 LOAD Y 返回 1。
这表明 CPU 1 的 `STORE X=1` 先于 CPU 2 的 `LOAD X` 执行, 而 CPU 2 的 `STORE Y=r1` 又在 CPU 3 执行 `LOAD Y` 之前就已完成。
此外, 内存屏障保证 CPU 2 的 load 在 store 之前执行, 而 CPU 3 的 `LOAD Y` 也保证在 `LOAD X` 之前。
那么问题来了: "CPU 3 的 `LOAD X` 是否可能会返回 0 呢？"

因为从某种意义上说, CPU 3 的 `LOAD X` 是在 CPU 2 的 LOAD 之后发生的, 所以很自然地期望 CPU 3 加载到的 X 值为1。
这种期望来自多副本原子性:如果在 CPU B 上执行的 load, 是在 CPU A 从相同变量load之后执行（并且 CPU A 不写入它读取到的值）, 然后在多副本原子系统上, CPU B 的 load 必须返回与 CPU A 的load相同的值, 或之后的某个值。
但是, Linux 内核不要求系统具有多副本原子性。

The use of a general memory barrier in the example above compensates for any lack of multicopy atomicity.  In the example, if CPU 2's load from X returns 1 and CPU 3's load from Y returns 1, then CPU 3's load from X must indeed also return 1.

However, dependencies, read barriers, and write barriers are not always able to compensate for non-multicopy atomicity.  For example, suppose that CPU 2's general barrier is removed from the above example, leaving only the data dependency shown below:

在上面的例子中, 使用通用内存屏障来弥补了多副本原子性的不足。
在示例中, 如果 CPU 2 从 X 加载到的值是 1, 而 CPU 3 从 Y 加载到的值也是 1, 那么 CPU 3 从 X 加载到的值也必定是 1。

然而, 依赖屏障、读屏障和写屏障并不总是能够补偿非多副本原子性。
例如, 假设从上面的例子中去除了 CPU 2 的通用屏障, 只留下数据依赖, 如下所示:


```c
  CPU 1                    CPU 2                    CPU 3
  =======================  =======================  =======================
    初始值:  { X = 0, Y = 0 }
  STORE X=1                 r1=LOAD X (reads 1)     LOAD Y (reads 1)
                            <data dependency>       <read barrier>
                            STORE Y=r1              LOAD X (reads 0)

```

This substitution allows non-multicopy atomicity to run rampant: in this example, it is perfectly legal for CPU 2's load from X to return 1, CPU 3's load from Y to return 1, and its load from X to return 0.

The key point is that although CPU 2's data dependency orders its load and store, it does not guarantee to order CPU 1's store.  Thus, if this example runs on a non-multicopy-atomic system where CPUs 1 and 2 share a store buffer or a level of cache, CPU 2 might have early access to CPU 1's writes.  General barriers are therefore required to ensure that all CPUs agree on the combined order of multiple accesses.

General barriers can compensate not only for non-multicopy atomicity, but can also generate additional ordering that can ensure that -all- CPUs will perceive the same order of -all- operations.  In contrast, a chain of release-acquire pairs do not provide this additional ordering, which means that only those CPUs on the chain are guaranteed to agree on the combined order of the accesses.  For example, switching to C code in deference to the ghost of Herman Hollerith:


这种替换允许非多副本原子性比较放肆地运行:在这个例子中, CPU 2 从 X 读取到的值是 1, CPU 3 从 Y 读取到的值是 1, 但它从 X 读取到 0 是完全合法的。

关键是, 虽然CPU 2的数据依赖屏障保证了load和store的执行顺序, 但并不能保证对CPU 1的store进行排序。
因此, 如果此示例在非多副本原子系统上运行, 其中 CPU 1 和 2 共享store buffer或同一级别的cache, 则 CPU 2 可能会提前访问到 CPU 1 的写入。
因此, 需要通用屏障来确保所有 CPU 就多次访问的组合顺序达成一致。

通用屏障不仅可以补偿非多副本原子性, 还可以生成额外的排序, 以确保所有 CPU 都以相同的顺序感知到各种操作。
相比之下, 具有 release-acquire 对的链不提供这种额外的排序, 意味着只有链上的 CPU 才能保证对访问的组合顺序达成一致。
例如, 根据 Herman Hollerith 的鬼影迁移到 C 代码:


```c
  int u, v, x, y, z;

  void cpu0(void)
  {
    r0 = smp_load_acquire(&x);
    WRITE_ONCE(u, 1);
    smp_store_release(&y, 1);
  }

  void cpu1(void)
  {
    r1 = smp_load_acquire(&y);
    r4 = READ_ONCE(v);
    r5 = READ_ONCE(u);
    smp_store_release(&z, 1);
  }

  void cpu2(void)
  {
    r2 = smp_load_acquire(&z);
    smp_store_release(&x, 1);
  }

  void cpu3(void)
  {
    WRITE_ONCE(v, 1);
    smp_mb();
    r3 = READ_ONCE(u);
  }

```

Because cpu0(), cpu1(), and cpu2() participate in a chain of `smp_store_release()/smp_load_acquire()` pairs, the following outcome is prohibited:

因为 cpu0(), cpu1(), 和 cpu2() 参与了一个 `smp_store_release()/smp_load_acquire()` 对组成的链, 所以禁止出现以下结果:

```c
  r0 == 1 && r1 == 1 && r2 == 1
```

Furthermore, because of the release-acquire relationship between cpu0() and cpu1(), cpu1() must see cpu0()'s writes, so that the following outcome is prohibited:

此外, 由于 cpu0() 和 cpu1() 之间的 release-acquire 关系, cpu1() 必须能看到 cpu0() 的写入, 从而禁止出现以下结果:

```c
  r1 == 1 && r5 == 0

```

However, the ordering provided by a release-acquire chain is local to the CPUs participating in that chain and does not apply to cpu3(), at least aside from stores.  Therefore, the following outcome is possible:

但是, release-acquire链提供的排序对于参与该链的 CPU 来说是局部的, 所以不适用于 cpu3(), 至少除了store之外。 因此, 以下结果是可能的:

```c
  r0 == 0 && r1 == 1 && r2 == 1 && r3 == 0 && r4 == 0

```

As an aside, the following outcome is also possible:

顺便说一句, 以下结果也是可能的:

```c
  r0 == 0 && r1 == 1 && r2 == 1 && r3 == 0 && r4 == 0 && r5 == 1

```

Although cpu0(), cpu1(), and cpu2() will see their respective reads and writes in order, CPUs not involved in the release-acquire chain might well disagree on the order.  This disagreement stems from the fact that the weak memory-barrier instructions used to implement smp_load_acquire() and `smp_store_release()` are not required to order prior stores against subsequent loads in all cases.  This means that cpu3() can see cpu0()'s store to u as happening -after- cpu1()'s load from v, even though both cpu0() and cpu1() agree that these two operations occurred in the intended order.

However, please keep in mind that smp_load_acquire() is not magic. In particular, it simply reads from its argument with ordering.  It does -not- ensure that any particular value will be read.  Therefore, the following outcome is possible:

尽管 cpu0()、cpu1() 和 cpu2() 会按顺序看到它们各自的读取和写入, 但不在 release-acquire 链中的 CPU 很可能在顺序上存在分歧。
这种分歧源于这样一种事实, 即用于实现 `smp_load_acquire()` 和 `smp_store_release()` 的弱内存屏障指令, 不需要在所有情况下针对后续load对先前store保证顺序。
这意味着 cpu3() 可以看到 cpu0() 对 u 的 store 发生在 cpu1() 从 v 读取值之后, 即使 cpu0() 和 cpu1() 都同意这两个操作按预期顺序发生.

但请记住 `smp_load_acquire()` 并不魔幻。 它只是从参数中按顺序读取。 但不保证将读取到某个特定值。 因此, 以下结果是可能的:

```c
  r0 == 0 && r1 == 0 && r2 == 0 && r5 == 0

```

Note that this outcome can happen even on a mythical sequentially consistent system where nothing is ever reordered.

To reiterate, if your code requires full ordering of all operations, use general barriers throughout.

请注意, 即便是在神话般的、没有重排序的顺序一致系统中, 这种结果也可能发生。

重申一下, 如果您的代码需要对所有操作进行完整的排序, 请务必使用通用屏障。


========================
EXPLICIT KERNEL BARRIERS
========================

The Linux kernel has a variety of different barriers that act at different levels:

- (`*`) Compiler barrier.

- (`*`) CPU memory barriers.



<a name="EXPLICIT_KERNEL_BARRIERS"></a>
## 3. 显式内核屏障

Linux 内核有多种不同的屏障, 它们作用于不同的级别:

- (`*`) 编译器屏障

- (`*`) CPU 内存屏障



COMPILER BARRIER
----------------

The Linux kernel has an explicit compiler barrier function that prevents the compiler from moving the memory accesses either side of it to the other side:


<a name="COMPILER_BARRIER"></a>
### 3.1 编译器屏障

Linux 内核提供了一个显式的编译器屏障函数, 可以阻止编译器将内存访问操作优化到屏障的另一边:

```c
  barrier();

```  

This is a general barrier -- there are no read-read or write-write variants of `barrier()`.  However, `READ_ONCE()` and `WRITE_ONCE()` can be thought of as weak forms of `barrier()` that affect only the specific accesses flagged by the `READ_ONCE()` or `WRITE_ONCE()`.

The `barrier()` function has the following effects:

- (`*`) Prevents the compiler from reordering accesses following the `barrier()` to precede any accesses preceding the `barrier()`. One example use for this property is to ease communication between interrupt-handler code and the code that was interrupted.

- (`*`) Within a loop, forces the compiler to load the variables used in that loop's conditional on each pass through that loop.

The `READ_ONCE()` and `WRITE_ONCE()` functions can prevent any number of optimizations that, while perfectly safe in single-threaded code, can be fatal in concurrent code.  Here are some examples of these sorts of optimizations:

- (`*`) The compiler is within its rights to reorder loads and stores to the same variable, and in some cases, the CPU is within its rights to reorder loads to the same variable.  This means that the following code:

这是一个通用屏障 —— `barrier()` 没有 read-read 或者 write-write 变体。
然而, `READ_ONCE()` 和 `WRITE_ONCE()` 可以被认为是 `barrier()` 的较弱形式, 因为它们只影响由 `READ_ONCE()` 和 `WRITE_ONCE()` 标记的特定访问。

`barrier()` 函数有以下几个作用:

- (`*`) 阻止编译器将 `barrier()` 函数之后的内存访问操作给重排序到 `barrier()` 之前。 这种特性的一个示例用途, 是简化中断处理程序代码和被中断代码之间的通信。

- (`*`) 在循环内, 通知编译器在每次循环迭代时, 强制去加载循环条件中使用的变量。

`READ_ONCE()` 和 `WRITE_ONCE()` 函数可以防止任意数量的优化, 虽然在单线程代码中是完全安全, 但在并发代码中可能是致命的。下面列出了一些优化的示例:

- (`*`) 编译器有权对同一个变量的加载(load)和保存(store)进行重排序, 在某些情况下, CPU 有权对同一变量的多次加载(load)进行重排序。 这意味着以下代码:

```c
  a[0] = x;
  a[1] = x;

```

Might result in an older value of x stored in a[1] than in a[0]. Prevent both the compiler and the CPU from doing this as follows:

可能会导致 `a[1]` 中存储的值比 `a[0]` 中要老。 要阻止编译器和 CPU 重排序, 代码如下所示:

```c
  a[0] = READ_ONCE(x);
  a[1] = READ_ONCE(x);

```

In short, `READ_ONCE()` and `WRITE_ONCE()` provide cache coherence for accesses from multiple CPUs to a single variable.

简而言之, `READ_ONCE()` 和 `WRITE_ONCE()` 为多个 CPU 访问单个变量提供了缓存一致性。

- (`*`) The compiler is within its rights to merge successive loads from the same variable.  Such merging can cause the compiler to "optimize" the following code:

- (`*`) 编译器有权合并来自同一个变量的多次加载(load)。 这种合并会导致编译器将下面的代码进行"优化":

```c
  while (tmp = a)
    do_something_with(tmp);

```

into the following code, which, although in some sense legitimate for single-threaded code, is almost certainly not what the developer intended:

变成下面这样的等价形式, 虽然在某种意义上对于单线程代码来说是合法的, 但几乎可以肯定这不是开发人员的意图:

```c
  if (tmp = a)
    for (;;)
      do_something_with(tmp);

```

Use `READ_ONCE()` to prevent the compiler from doing this to you:

使用 `READ_ONCE()` 可以阻止编译器这样做, 例如:

```c
  while (tmp = READ_ONCE(a))
    do_something_with(tmp);

```


- (`*`) The compiler is within its rights to reload a variable, for example, in cases where high register pressure prevents the compiler from keeping all data of interest in registers.  The compiler might therefore optimize the variable 'tmp' out of our previous example:

- (`*`) 编译器有权重新加载某个变量, 例如, 在寄存器压力较大时,阻止了编译器将所有感兴趣的数据都保存到寄存器的情况下。 因此, 编译器可能会将之前示例中的变量 'tmp' 进行优化:


```c
  while (tmp = a)
    do_something_with(tmp);

```

This could result in the following code, which is perfectly safe in single-threaded code, but can be fatal in concurrent code:

这可能导致以下代码, 这在单线程环境中是完全安全的, 但在并发环境下则可能是致命的:

```c
  while (a)
    do_something_with(a);

```


For example, the optimized version of this code could result in passing a zero to do_something_with() in the case where the variable a was modified by some other CPU between the "while" statement and the call to do_something_with().

Again, use `READ_ONCE()` to prevent the compiler from doing this:

例如, 在 "while" 语句和 `do_something_with()` 语句调用之间, 如果变量 a 被其他 CPU 修改了, 这种优化后的代码, 可能导致传递给 `do_something_with()` 的参数为零。

同样, 使用 `READ_ONCE()` 可以阻止编译器画蛇添足:

```c
  while (tmp = READ_ONCE(a))
    do_something_with(tmp);

```

Note that if the compiler runs short of registers, it might save tmp onto the stack.  The overhead of this saving and later restoring is why compilers reload variables.  Doing so is perfectly safe for single-threaded code, so you need to tell the compiler about cases where it is not safe.

请注意, 如果编译器发现寄存器不够, 可能会将 tmp 保存到栈中。 这种保存到stack以及稍后从stack恢复的开销是编译器重新加载变量的原因。 这样做对于单线程代码是完全安全的, 因此我们需要告诉编译器什么时候是不安全的。

- (`*`) The compiler is within its rights to omit a load entirely if it knows what the value will be.  For example, if the compiler can prove that the value of variable 'a' is always zero, it can optimize this code:

- (`*`) 如果编译器已经知道变量值是什么, 则它有权完全省略load操作。 例如, 如果编译器可以证明变量 'a' 的值始终为零, 则可以将下面的代码:

```c
  while (tmp = a)
    do_something_with(tmp);

```

Into this:

优化为:

```c
  do { } while (0);

```


This transformation is a win for single-threaded code because it gets rid of a load and a branch.  The problem is that the compiler will carry out its proof assuming that the current CPU is the only one updating variable 'a'.  If variable 'a' is shared, then the compiler's proof will be erroneous.  Use `READ_ONCE()` to tell the compiler that it doesn't know as much as it thinks it does:

这种转换对于单线程代码来说是优势, 因为它摆脱了负载和分支的开销。
问题是编译器将执行其证明, 假设当前 CPU 是唯一会更新变量"a"的存在。
如果变量 'a' 是共享的, 那么编译器的证明将是错误的。
使用 `READ_ONCE()` 可以告诉编译器不能推断它的值:

```c
  while (tmp = READ_ONCE(a))
    do_something_with(tmp);

```

But please note that the compiler is also closely watching what you do with the value after the `READ_ONCE()`.  For example, suppose you do the following and MAX is a preprocessor macro with the value 1:

但请注意, 编译器也在密切关注 `READ_ONCE()` 之后你对这个值做了什么操作。
例如, 假设您执行以下操作并且 MAX 是值为 1 的预处理器宏:

```c
  while ((tmp = READ_ONCE(a)) % MAX)
    do_something_with(tmp);

```

Then the compiler knows that the result of the "%" operator applied to MAX will always be zero, again allowing the compiler to optimize the code into near-nonexistence.  (It will still load from the variable 'a'.)

那么编译器就知道对 MAX 进行取模运算("%")的结果将始终为零, 再次允许编译器将代码优化为几乎不存在。 （它仍然会从变量 'a' 加载。）

- (`*`) Similarly, the compiler is within its rights to omit a store entirely if it knows that the variable already has the value being stored. Again, the compiler assumes that the current CPU is the only one storing into the variable, which can cause the compiler to do the wrong thing for shared variables.  For example, suppose you have the following:

- (`*`) 同样, 如果编译器知道变量已经具有要存储的值, 则它有权完全省略存储操作。 同样, 编译器假定当前 CPU 是唯一一个存储到变量的 CPU, 这可能导致编译器对共享变量做错误的事情。 例如, 假设您有以下内容:

```c
  a = 0;
  ... Code that does not store to variable a ...
  a = 0;

```

The compiler sees that the value of variable 'a' is already zero, so it might well omit the second store.  This would come as a fatal surprise if some other CPU might have stored to variable 'a' in the meantime.

Use `WRITE_ONCE()` to prevent the compiler from making this sort of wrong guess:

编译器发现变量"a"的值已经为零, 因此很可能会忽略第二次存储操作。
如果在此期间有其他 CPU 将新数据存储到变量 'a' 中, 这将是一个致命的惊喜。

使用 `WRITE_ONCE()` 来防止编译器做出这种错误的猜测:

```c
  WRITE_ONCE(a, 0);
  ... Code that does not store to variable a ...
  WRITE_ONCE(a, 0);

```

- (`*`) The compiler is within its rights to reorder memory accesses unless you tell it not to.  For example, consider the following interaction between process-level code and an interrupt handler:

- (`*`) 编译器有权对内存访问进行重排序, 除非您告诉它不要这样做。 例如, 请看以下进程级代码和中断处理程序之间的交互:

```c
  void process_level(void)
  {
    msg = get_message();
    flag = true;
  }

  void interrupt_handler(void)
  {
    if (flag)
      process_message(msg);
  }

```

There is nothing to prevent the compiler from transforming process_level() to the following, in fact, this might well be a win for single-threaded code:

这里没有什么东西可以阻止编译器将 `process_level()` 转换为以下内容:

```c
  void process_level(void)
  {
    flag = true;
    msg = get_message();
  }

```

实际上, 这很可能是单线程代码的优势。

If the interrupt occurs between these two statement, then `interrupt_handler()` might be passed a garbled msg.  Use `WRITE_ONCE()` to prevent this as follows:

如果在这两个语句之间发生中断, 则 `interrupt_handler()` 中的函数调用可能会传如一个乱码参数。 使用 `WRITE_ONCE()` 来防止这种情况:

```c
  void process_level(void)
  {
    WRITE_ONCE(msg, get_message());
    WRITE_ONCE(flag, true);
  }

  void interrupt_handler(void)
  {
    if (READ_ONCE(flag))
      process_message(READ_ONCE(msg));
  }

```

Note that the `READ_ONCE()` and `WRITE_ONCE()` wrappers in interrupt_handler() are needed if this interrupt handler can itself be interrupted by something that also accesses 'flag' and 'msg', for example, a nested interrupt or an NMI.  Otherwise, `READ_ONCE()` and `WRITE_ONCE()` are not needed in interrupt_handler() other than for documentation purposes.  (Note also that nested interrupts do not typically occur in modern Linux kernels, in fact, if an interrupt handler returns with interrupts enabled, you will get a WARN_ONCE() splat.)

You should assume that the compiler can move `READ_ONCE()` and `WRITE_ONCE()` past code not containing `READ_ONCE()`, `WRITE_ONCE()`, `barrier()`, or similar primitives.

This effect could also be achieved using `barrier()`, but `READ_ONCE()` and `WRITE_ONCE()` are more selective:  With `READ_ONCE()` and `WRITE_ONCE()`, the compiler need only forget the contents of the indicated memory locations, while with `barrier()` the compiler must discard the value of all memory locations that it has currently cached in any machine registers.  Of course, the compiler must also respect the order in which the `READ_ONCE()`s and `WRITE_ONCE()`s occur, though the CPU of course need not do so.

请注意, 如果中断处理程序本身还可以被能读写 'flag' 和 'msg' 的其他程序中断, 例如嵌套中断或NMI, 则 `interrupt_handler()` 中也需要使用 `READ_ONCE()` 和 `WRITE_ONCE()` 来包装器。
否则, 除了用于文档演示的目的之外,  `interrupt_handler()` 中不需要使用 `READ_ONCE()` 和 `WRITE_ONCE()`。
还要注意, 嵌套中断通常不会出现在现代 Linux 内核中, 事实上, 如果中断处理程序在启用中断的情况下返回, 您将得到一个 `WARN_ONCE()` 告警。

你应该假设编译器可以将 `READ_ONCE()` 和 `WRITE_ONCE()` 移动到不包含 `READ_ONCE()`、`WRITE_ONCE()`、`barrier()` 或类似原语的代码之后。

使用`barrier()`也可以实现这种效果, 但是`READ_ONCE()`和`WRITE_ONCE()`更具有指向性: 使用`READ_ONCE()`和`WRITE_ONCE()`, 编译器只需忘记其指定的内存位置的内容, 而使用 `barrier()` 时, 编译器必须丢弃当前在所有CPU寄存器中缓存的所有内存位置的值。
当然, 编译器也必须尊重 `READ_ONCE()`和`WRITE_ONCE()` 出现的顺序, 而 CPU 不需要这样做。

- (`*`) The compiler is within its rights to invent stores to a variable, as in the following example:

- (`*`) 编译器有权拼凑出对变量的store操作, 比如:

```c
  if (a)
    b = a;
  else
    b = 42;

```

The compiler might save a branch by optimizing this as follows:

编译器可能会优化为这种分支结构:

```c
  b = 42;
  if (a)
    b = a;

```

In single-threaded code, this is not only safe, but also saves a branch.  Unfortunately, in concurrent code, this optimization could cause some other CPU to see a spurious value of 42 -- even if variable 'a' was never zero -- when loading variable 'b'. Use `WRITE_ONCE()` to prevent this as follows:

在单线程代码中, 这不仅安全, 而且还减少了一个分支。
不幸的是, 在并发代码中, 这种优化可能会导致其他 CPU 在加载变量"b"时看到一个虚幻的值 42 —— 即使变量 'a' 永不为零。
我们可以使用 `WRITE_ONCE()` 来阻止这种情况发生:

```c
  if (a)
    WRITE_ONCE(b, a);
  else
    WRITE_ONCE(b, 42);

```

The compiler can also invent loads.  These are usually less damaging, but they can result in cache-line bouncing and thus in poor performance and scalability.  Use `READ_ONCE()` to prevent invented loads.

编译器还会拼凑出 load 代码。 破坏性一般很小, 但可能会导致缓存行反弹, 从而降低性能和可扩展性。 使用 `READ_ONCE()` 来防止 load 拼凑。


- (`*`) For aligned memory locations whose size allows them to be accessed with a single memory-reference instruction, prevents "load tearing" and "store tearing," in which a single large access is replaced by multiple smaller accesses.  For example, given an architecture having 16-bit store instructions with 7-bit immediate fields, the compiler might be tempted to use two 16-bit store-immediate instructions to implement the following 32-bit store:

- (`*`) 对于允许使用单个内存引用指令来访问的, 对齐过的内存位置, 防止"load撕裂"和"store撕裂", 其中单个大访问被多个较小访问替换。 例如, 在某种体系结构下, 用 16 位store指令, 和 7 位是即时数字段,  编译器可能会尝试使用两个 16 位的即时存储指令(store-immediate)来实现以下 32 位store:

```c
  p = 0x00010002;

```

Please note that GCC really does use this sort of optimization, which is not surprising given that it would likely take more than two instructions to build the constant and then store it. This optimization can therefore be a win in single-threaded code. In fact, a recent bug (since fixed) caused GCC to incorrectly use this optimization in a volatile store.  In the absence of such bugs, use of `WRITE_ONCE()` prevents store tearing in the following example:

请注意 GCC 确实使用了这种优化, 这并不奇怪, 因为构建常量然后store它可能需要两条以上的指令。 因此, 这种优化可以在单线程代码中获胜。
事实上, 最近的一个错误（已经修复了）导致 GCC 在 volatile store 中错误地使用此优化。
在没有此类错误的情况下, 使用 `WRITE_ONCE()` 可以防止store撕裂:

```c
  WRITE_ONCE(p, 0x00010002);

```

Use of packed structures can also result in load and store tearing, as in this example:

使用压缩结构也会导致 load 和 store 撕裂, 如下例所示:

```c
  struct __attribute__((__packed__)) foo {
    short a;
    int b;
    short c;
  };
  struct foo foo1, foo2;
  ...

  foo2.a = foo1.a;
  foo2.b = foo1.b;
  foo2.c = foo1.c;

```

Because there are no `READ_ONCE()` or `WRITE_ONCE()` wrappers and no volatile markings, the compiler would be well within its rights to implement these three assignment statements as a pair of 32-bit loads followed by a pair of 32-bit stores.  This would result in load tearing on 'foo1.b' and store tearing on 'foo2.b'.  `READ_ONCE()` and `WRITE_ONCE()` again prevent tearing in this example:

因为没有 `READ_ONCE()` 或 `WRITE_ONCE()` 包装器, 也没有 volatile 标记, 编译器完全可以将这三个赋值语句实现为一对 32 位的 load, 然后是一对 32-位的 stores。
这将导致 'foo1.b' 上的load撕裂和 'foo2.b' 上的store撕裂。 `READ_ONCE()` 和 `WRITE_ONCE()` 在这个例子中同样可以防止撕裂:

```c
  foo2.a = foo1.a;
  WRITE_ONCE(foo2.b, READ_ONCE(foo1.b));
  foo2.c = foo1.c;

```

All that aside, it is never necessary to use `READ_ONCE()` and `WRITE_ONCE()` on a variable that has been marked volatile.  For example, because 'jiffies' is marked volatile, it is never necessary to say READ_ONCE(jiffies).  The reason for this is that `READ_ONCE()` and WRITE_ONCE() are implemented as volatile casts, which has no effect when its argument is already marked volatile.

Please note that these compiler barriers have no direct effect on the CPU, which may then reorder things however it wishes.

除此之外, 永远没有必要在已标记为 `volatile` 的变量上使用 `READ_ONCE()` 和 `WRITE_ONCE()`。
例如, 因为 'jiffies' 被标记为 volatile, 所以没有必要使用 `READ_ONCE(jiffies)`。
这样做的原因是 `READ_ONCE()` 和 `WRITE_ONCE()` 被实现为 volatile 转换, 当它的参数已经被标记为 volatile 时, 也就不起作用了。

请注意, 这些编译器屏障对 CPU 没有直接影响, CPU 可能会按照自己的意愿进行指令重排序。


CPU MEMORY BARRIERS
-------------------


<a name="CPU_MEMORY_BARRIERS"></a>
### 3.2 CPU 内存屏障

The Linux kernel has eight basic CPU memory barriers:

Linux内核支持8种基础的CPU内存屏障:

| TYPE         |    MANDATORY   |     SMP CONDITIONAL |
| ------------ | -------------- | --------------- |   
| GENERAL      |      mb()      |     smp_mb()    |
| WRITE        |      wmb()     |     smp_wmb()   |
| READ         |      rmb()     |     smp_rmb()   |
| DATA DEPENDENCY |             |     READ_ONCE() |


All memory barriers except the data dependency barriers imply a compiler barrier.  Data dependencies do not impose any additional compiler ordering.

Aside: In the case of data dependencies, the compiler would be expected to issue the loads in the correct order (eg. `a[b]` would have to load the value of b before loading a[b]), however there is no guarantee in the C specification that the compiler may not speculate the value of b (eg. is equal to 1) and load a[b] before b (eg. `tmp = a[1]; if (b != 1) tmp = a[b];` ).  There is also the problem of a compiler reloading b after having loaded a[b], thus having a newer copy of b than a[b].  A consensus has not yet been reached about these problems, however the `READ_ONCE()` macro is a good place to start looking.

SMP memory barriers are reduced to compiler barriers on uniprocessor compiled systems because it is assumed that a CPU will appear to be self-consistent, and will order overlapping accesses correctly with respect to itself. However, see the subsection on ["Virtual Machine Guests"](#VIRTUAL_MACHINE_GUESTS) below.

除数据依赖屏障之外, 所有内存屏障都蕴含了编译器屏障。 数据依赖不会强加任何额外的编译器排序。

另外: 在有数据依赖的情况下, 编译器应该以正确的顺序发出 load 指令（例如, 获取 `a[b]` 就必须在加载 a[b] 之前加载 b 的值）, 但是 C语言规范中不保证编译器不会推测 b 的值（例如等于 1）并在 b 之前加载 a[b]。（例如 `tmp = a[1]; if (b != 1) tmp = a[b];`)。
还有一个问题是, 编译器在加载 a[b] 之后重新加载 b, 因此 b 的副本比 a[b] 要新。 目前尚未就这些问题达成共识, 但是 `READ_ONCE()` 宏是一个开始查找的好地方。

在单处理器编译系统上, SMP 内存屏障降级为编译器屏障, 因为它假设 CPU 看起来是自身一致的, 并且会相对于自身正确地对重叠访问进行排序。 但是, 请参阅后面的 [10.2 虚拟机访客](#VIRTUAL_MACHINE_GUESTS) 一节。

> [!] Note that SMP memory barriers _must_ be used to control the ordering of references to shared memory on SMP systems, though the use of locking instead is sufficient.

Mandatory barriers should not be used to control SMP effects, since mandatory barriers impose unnecessary overhead on both SMP and UP systems. They may, however, be used to control MMIO effects on accesses through relaxed memory I/O windows.  These barriers are required even on non-SMP systems as they affect the order in which memory operations appear to a device by prohibiting both the compiler and the CPU from reordering them.

> [!] 请注意, SMP内存屏障 必须 用于控制对 SMP 系统上共享内存引用的顺序, 尽管使用锁定来代替就足够了。

不应使用强制性屏障来控制 SMP 的影响, 因为强制性屏障会对 SMP 和 UP 系统造成不必要的开销。 但是, 它们可用于通过宽松的内存 I/O 窗口来控制 MMIO 对访问的影响。 即使在非 SMP 系统上也需要这些屏障, 因为它们通过禁止编译器和 CPU 重排序, 来影响内存操作出现在设备上的顺序。

There are some more advanced barrier functions:

下面是一些高级屏障函数:

- (`*`) `smp_store_mb(var, value)`

  This assigns the value to the variable and then inserts a full memory barrier after it.  It isn't guaranteed to insert anything more than a compiler barrier in a UP compilation.

  这个函数将值赋给变量, 并在它之后插入一个完整的内存屏障。 不能保证在 UP 编译中插入比编译器屏障更多的东西。


- (`*`) `smp_mb__before_atomic()`
- (`*`) `smp_mb__after_atomic()`

  These are for use with atomic RMW functions that do not imply memory barriers, but where the code needs a memory barrier. Examples for atomic RMW functions that do not imply are memory barrier are e.g. add, subtract, (failed) conditional operations, _relaxed functions, but not atomic_read or atomic_set. A common example where a memory barrier may be required is when atomic ops are used for reference counting.

  These are also used for atomic RMW bitop functions that do not imply a memory barrier (such as set_bit and clear_bit).

  As an example, consider a piece of code that marks an object as being dead and then decrements the object's reference count:

  这两个函数用于原子 RMW 函数, 不包含隐式的内存屏障, 但代码需要内存屏障的的情况。
  不包含隐式内存屏障的原子 RMW 函数的示例, 比如 加、减、（失败）条件操作、 _relaxed 函数, 但不是 `atomic_read` 或 `atomic_set`。 可能需要内存屏障的一个常见例子, 是用于引用计数的原子操作。

  这些也用于不隐含内存屏障的RMW 原子位操作函数（例如 `set_bit` 和 `clear_bit`）。

  举个例子, 请看一段代码, 将一个对象标记为死亡, 然后递减该对象的引用计数:

  ```c
  obj->dead = 1;
  smp_mb__before_atomic();
  atomic_dec(&obj->ref_count);
  ```

  This makes sure that the death mark on the object is perceived to be set *before* the reference counter is decremented.

  See Documentation/atomic_{t,bitops}.txt for more information.

  这确保在引用计数器递减之前, 对象上的死亡标记先被感知。

  更多信息请参阅 `Documentation/atomic_{t,bitops}.txt` 等文档。


- (`*`) `dma_wmb()`
- (`*`) `dma_rmb()`

  These are for use with consistent memory to guarantee the ordering of writes or reads of shared memory accessible to both the CPU and a DMA capable device.

  For example, consider a device driver that shares memory with a device and uses a descriptor status value to indicate if the descriptor belongs to the device or the CPU, and a doorbell to notify it when new descriptors are available:

  这两个函数与一致内存一起使用, 以保证 CPU 和支持 DMA 的设备, 均可访问共享内存, 并保证写入或读取的顺序。

  例如, 假设有一个设备驱动程序, 它与设备共享内存, 并使用描述符状态值来指示描述符是属于设备还是 CPU, 并在新描述符可用时使用门铃来通知它:

  ```c
  if (desc->status != DEVICE_OWN) {
    /* 在拥有描述符之前, 都不读取数据 */
    dma_rmb();

    /* 读取/修改数据 */
    read_data = desc->data;
    desc->data = write_data;

    /* 在更新状态前, 先刷新变更 */
    dma_wmb();

    /* 指定所有权 */
    desc->status = DEVICE_OWN;

    /* 通知设备新的描述符 */
    writel(DESC_NOTIFY, doorbell);
  }
  ```

  The `dma_rmb()` allows us guarantee the device has released ownership before we read the data from the descriptor, and the `dma_wmb()` allows us to guarantee the data is written to the descriptor before the device can see it now has ownership.  Note that, when using `writel()`, a prior `wmb()` is not needed to guarantee that the cache coherent memory writes have completed before writing to the MMIO region.  The cheaper  `writel_relaxed()` does not provide this guarantee and must not be used here.

  See the subsection "[Kernel I/O barrier effects](#KERNEL_IO_BARRIER_EFFECTS) " for more information on relaxed I/O accessors and the `Documentation/core-api/dma-api.rst` file for more information on consistent memory.

  `dma_rmb()` 允许我们保证: 从描述符读取数据之前, 设备已释放了所有权;
  而 `dma_wmb()` 允许我们保证: 在设备看到之前, 就将数据写入了描述符。
  请注意, 在使用 `writel()` 时, 不需要在前面的 `wmb()` 来保证在写入 MMIO 区域之前已完成缓存一致性内存写入。
  更便宜的  `writel_relaxed()` 不提供此保证, 不能在此处使用。

  有关宽松 I/O 访问器的更多信息, 请参阅 [7. Linux内核提供的IO屏障效果](#KERNEL_IO_BARRIER_EFFECTS) 小节, 有关一致内存的更多信息, 请参阅 `Documentation/core-api/dma-api.rst` 文件。

- (`*`) `pmem_wmb()`

  This is for use with persistent memory to ensure that stores for which modifications are written to persistent storage reached a platform durability domain.

  For example, after a non-temporal write to pmem region, we use `pmem_wmb()` to ensure that stores have reached a platform durability domain. This ensures that stores have updated persistent storage before any data access or data transfer caused by subsequent instructions is initiated. This is in addition to the ordering done by `wmb()`.

  For load from persistent memory, existing read memory barriers are sufficient to ensure read ordering.

  这个函数与持久内存一起使用, 以确保将修改对应的store写入持久存储, 到达平台持久域。

  例如, 在对 pmem 区域进行非临时写入后, 我们使用 `pmem_wmb()` 来确保store已达到平台持久性域。
  这确保在初始化任何由后续指令引起的数据访问或数据传输之前, store已更新到持久存储。 这是 `wmb()` 完成的排序的补充。

  对于从持久内存load, 现有的内存读屏障足以确保读取顺序。


===============================
IMPLICIT KERNEL MEMORY BARRIERS
===============================


<a name="IMPLICIT_KERNEL_MEMORY_BARRIERS"></a>
## 4. 隐式内存屏障

Some of the other functions in the linux kernel imply memory barriers, amongst which are locking and scheduling functions.

This specification is a _minimum_ guarantee; any particular architecture may provide more substantial guarantees, but these may not be relied upon outside of arch specific code.

Linux内核中的一些函数隐含了内存屏障, 包括锁定和调度函数。

此规范是 最低 保证； 任何特定的体系结构都可能提供更实质性的保证, 但这些保证可能在特定体系结构之外的代码不可用。

LOCK ACQUISITION FUNCTIONS
--------------------------

<a name="LOCK_ACQUISITION_FUNCTIONS"></a>
### 4.1 获取锁的函数

The Linux kernel has a number of locking constructs:

- (`*`) spin locks
- (`*`) R/W spin locks
- (`*`) mutexes
- (`*`) semaphores
- (`*`) R/W semaphores

In all cases there are variants on "`ACQUIRE`" operations and "`RELEASE`" operations for each construct.  These operations all imply certain barriers:

Linux 内核有许多锁结构:

- (`*`) 自旋锁(spin lock)
- (`*`) 自旋读/写锁(R/W spin lock)
- (`*`) 互斥锁(mutex)
- (`*`) 信号量(semaphore)
- (`*`) 读/写信号量(R/W semaphore)

在所有情况下, 每个锁结构都有类似的 "`ACQUIRE`" 操作和 "`RELEASE`"操作。 这些操作蕴含了内存屏障:

- (1) `ACQUIRE` operation implication:

  Memory operations issued after the `ACQUIRE` will be completed after the `ACQUIRE` operation has completed.

  Memory operations issued before the `ACQUIRE` may be completed after the `ACQUIRE` operation has completed.

- (1) `ACQUIRE`操作隐含的屏障:

  `ACQUIRE` 之后发出的内存操作必须在 `ACQUIRE` 操作完成后结束。

  `ACQUIRE` 之前发出的内存操作可以在 `ACQUIRE` 操作完成后结束。

- (2) `RELEASE` operation implication:

  Memory operations issued before the `RELEASE` will be completed before the `RELEASE` operation has completed.

  Memory operations issued after the `RELEASE` may be completed before the `RELEASE` operation has completed.

- (2) `RELEASE` 操作隐含的屏障:

  `RELEASE` 之前发出的内存操作必须在 `RELEASE` 操作完成之前结束。

  `RELEASE` 之后发出的内存操作可能会在 `RELEASE` 操作完成之前结束。

- (3) `ACQUIRE` vs `ACQUIRE` implication:

  All `ACQUIRE` operations issued before another `ACQUIRE` operation will be completed before that `ACQUIRE` operation.

- (3) `ACQUIRE` 与 `ACQUIRE` 操作隐含的屏障:

  在某个 `ACQUIRE` 操作之前发出的所有 `ACQUIRE` 操作, 都必须在该 `ACQUIRE` 操作完成之前结束。

- (4) `ACQUIRE` vs `RELEASE` implication:

  All `ACQUIRE` operations issued before a `RELEASE` operation will be completed before the `RELEASE` operation.

- (4) `ACQUIRE` 与 `RELEASE` 操作隐含的屏障:

  在某个 `RELEASE` 操作之前发出的所有 `ACQUIRE` 操作, 都必须在 `RELEASE` 操作之前结束。

- (5) Failed conditional `ACQUIRE` implication:

  Certain locking variants of the `ACQUIRE` operation may fail, either due to being unable to get the lock immediately, or due to receiving an unblocked signal while asleep waiting for the lock to become available.  Failed locks do not imply any sort of barrier.

- (5) 失败的条件 `ACQUIRE` 操作隐含的屏障:

  `ACQUIRE` 操作的某些锁定变体可能会失败, 原因可能是无法立即获得锁, 或者是由于在睡眠等待锁可用时收到未阻塞的信号。 失败的锁并不隐含任何类型的屏障。


> [!] Note: one of the consequences of lock ACQUIREs and RELEASEs being only one-way barriers is that the effects of instructions outside of a critical section may seep into the inside of the critical section.

An `ACQUIRE` followed by a `RELEASE` may not be assumed to be full memory barrier because it is possible for an access preceding the `ACQUIRE` to happen after the `ACQUIRE`, and an access following the `RELEASE` to happen before the `RELEASE`, and the two accesses can themselves then cross:

> [!] 注意: 锁的 ACQUIRE 和 RELEASE 的结果只是单向屏障, 临界区之外的指令的影响可能会渗入临界区内部。

一个 `ACQUIRE` 后跟一个 `RELEASE` 可能不被认为是完整的内存屏障, 因为在 `ACQUIRE` 之前的访问可能发生在 `ACQUIRE` 之后, 而在 `RELEASE` 之后的访问也可能在 `RELEASE` 之前发生, 然后两个访问本身就可能交叉:

```c
  *A = a;
  ACQUIRE M
  RELEASE M
  *B = b;

```

may occur as:

实际执行的顺序可能是:

```c
  ACQUIRE M, STORE *B, STORE *A, RELEASE M

```

When the `ACQUIRE` and `RELEASE` are a lock acquisition and release, respectively, this same reordering can occur if the lock's `ACQUIRE` and `RELEASE` are to the same lock variable, but only from the perspective of another CPU not holding that lock.  In short, a `ACQUIRE` followed by an `RELEASE` may -not- be assumed to be a full memory barrier.

Similarly, the reverse case of a `RELEASE` followed by an `ACQUIRE` does not imply a full memory barrier.  Therefore, the CPU's execution of the critical sections corresponding to the `RELEASE` and the `ACQUIRE` can cross, so that:

当 `ACQUIRE` 和 `RELEASE` 分别是锁的获取和释放时, 如果锁的 `ACQUIRE` 和 `RELEASE` 是同一个锁变量, 那么同样的重排序可以发生, 但只有从另一个不持有那个锁的 CPU 角度来看是这样。 简而言之, 一个 `ACQUIRE` 后跟一个 `RELEASE` 可能`不`被认为是一个完整的内存屏障。

类似地, 顺序调过来, 先是 `ACQUIRE`, 后面跟着 `RELEASE` 的情况也不代表完整的内存屏障。 因此, CPU 对 `RELEASE` 和 `ACQUIRE` 对应的临界区的执行可能会交叉, 例如下面的代码:

```c
  *A = a;
  RELEASE M
  ACQUIRE N
  *B = b;
```

could occur as:

实际执行的顺序可能是:

```c
  ACQUIRE N, STORE *B, STORE *A, RELEASE M

```

It might appear that this reordering could introduce a deadlock. However, this cannot happen because if such a deadlock threatened, the `RELEASE` would simply complete, thereby avoiding the deadlock.

看起来这种重排序可能会导致死锁。 但这是不可能发生的,  因为如果有这种死锁的可能, `RELEASE` 就会简单地完成, 从而避免死锁。

> Why does this work?

> 为什么呢?

One key point is that we are only talking about the CPU doing the reordering, not the compiler. If the compiler (or, for that matter, the developer) switched the operations, deadlock -could- occur.

But suppose the CPU reordered the operations. In this case, the unlock precedes the lock in the assembly code. The CPU simply elected to try executing the later lock operation first. If there is a deadlock, this lock operation will simply spin (or try to sleep, but more on that later). The CPU will eventually execute the unlock operation (which preceded the lock operation in the assembly code), which will unravel the potential deadlock, allowing the lock operation to succeed.

一个关键点是我们只讨论了 CPU 重排序, 而没有讨论编译器重排序。如果编译器调换了操作顺序（对开发人员有影响）, 则可能会发生死锁。

但是假设 CPU 执行了重排序操作。 在这种情况下, 在汇编代码中解锁先于锁定。
CPU 只是选择先尝试执行后面的锁定操作。
如果出现死锁, 锁定操作将简单地自旋（或尝试休眠, 稍后会详细介绍）。
CPU 最终会执行解锁操作（在汇编代码中先于锁定操作）, 这将解除潜在的死锁, 从而允许锁定操作成功。


But what if the lock is a sleeplock? In that case, the code will try to enter the scheduler, where it will eventually encounter a memory barrier, which will force the earlier unlock operation to complete, again unraveling the deadlock. There might be a sleep-unlock race, but the locking primitive needs to resolve such races properly in any case.

Locks and semaphores may not provide any guarantee of ordering on UP compiled systems, and so cannot be counted on in such a situation to actually achieve anything at all - especially with respect to I/O accesses - unless combined with interrupt disabling operations.


但如果是睡眠锁呢？ 在这种情况下, 代码将尝试进入调度程序, 在那里最终会遇到内存屏障, 这将强制较早的解锁操作先完成, 再次解除死锁。 可能存在睡眠解锁竞争, 但在任何情况下锁定原语都需要正确解决此类竞争。

锁和信号量在 UP 编译的系统上可能无法保证排序, 因此在这种情况下不能指望达成任何实际目标 - 特别是在 I/O 访问方面 - 除非与中断禁用操作相结合。

See also the section on "[Inter-CPU acquiring barrier effects](#CPU_ACQUIRING_BARRIER_EFFECTS)".

另请参见: [5. 多个CPU之间ACQUIRE屏障的影响](#CPU_ACQUIRING_BARRIER_EFFECTS)


As an example, consider the following:

请看下面的示例代码:

```c
  *A = a;
  *B = b;
  ACQUIRE
  *C = c;
  *D = d;
  RELEASE
  *E = e;
  *F = f;
```

The following sequence of events is acceptable:

那么, 以下的事件执行顺序是可以接受的:

```c
  ACQUIRE, {*F,*A}, *E, {*C,*D}, *B, RELEASE
```

> [+] Note that `{*F,*A}` indicates a combined access.

> 请注意: `{*F,*A}` 这种形式指定了一组访问操作。

But none of the following are:

但下面的任何一种执行顺序都不行:

```c
  {*F,*A}, *B,  ACQUIRE, *C, *D,  RELEASE, *E
  *A, *B, *C,  ACQUIRE, *D,    RELEASE, *E, *F
  *A, *B,    ACQUIRE, *C,    RELEASE, *D, *E, *F
  *B,    ACQUIRE, *C, *D,  RELEASE, {*F,*A}, *E
```



INTERRUPT DISABLING FUNCTIONS
-----------------------------


<a name="INTERRUPT_DISABLING_FUNCTIONS"></a>
### 4.2 中断禁用函数

Functions that disable interrupts (`ACQUIRE` equivalent) and enable interrupts (`RELEASE` equivalent) will act as compiler barriers only.  So if memory or I/O barriers are required in such a situation, they must be provided from some other means.

禁用中断（等效于`ACQUIRE`）和启用中断（等效于`RELEASE`）的函数仅作为编译器屏障。
因此, 如果在这种情况下需要内存屏障或 I/O 屏障, 则必须通过其他方式提供。


SLEEP AND WAKE-UP FUNCTIONS
---------------------------

Sleeping and waking on an event flagged in global data can be viewed as an interaction between two pieces of data: the task state of the task waiting for the event and the global data used to indicate the event.  
To make sure that these appear to happen in the right order, the primitives to begin the process of going to sleep, and the primitives to initiate a wake up imply certain barriers.

Firstly, the sleeper normally follows something like this sequence of events:


<a name="SLEEP_AND_WAKE-UP_FUNCTIONS"></a>
### 4.3 睡眠和唤醒函数

在全局数据中标记的事件上睡眠和唤醒, 可以被视为两个数据之间的交互:  等待事件的任务的状态, 以及用于指示事件的全局数据。
为了确保他们以正确的顺序发生, 开始进入睡眠过程的原语和启动唤醒过程的原语蕴含着某些屏障。

首先, 睡眠者通常跟在某些操作后面, 例如以下事件序列:

```c
  for (;;) {
    set_current_state(TASK_UNINTERRUPTIBLE);
    if (event_indicated)
      break;
    schedule();
  }
```

A general memory barrier is interpolated automatically by `set_current_state()` after it has altered the task state:

在更改任务状态后, `set_current_state()` 会自动插入通用内存屏障:

```c
  CPU 1
  ===============================
  set_current_state();
    smp_store_mb();
      STORE current->state
      <general barrier>
  LOAD event_indicated
```

`set_current_state()` may be wrapped by:

`set_current_state()` 可能由以下函数包装:

```c
  prepare_to_wait();
  prepare_to_wait_exclusive();
```

which therefore also imply a general memory barrier after setting the state. The whole sequence above is available in various canned forms, all of which interpolate the memory barrier in the right place:

因此, 这也意味着设置任务状态之后一般都会有通用内存屏障。 上面的整个序列有各种固定形式, 所有这些都会在正确的位置插入内存屏障:

```c
  wait_event();
  wait_event_interruptible();
  wait_event_interruptible_exclusive();
  wait_event_interruptible_timeout();
  wait_event_killable();
  wait_event_timeout();
  wait_on_bit();
  wait_on_bit_lock();
```

Secondly, code that performs a wake up normally follows something like this:

其次, 执行唤醒的代码通常是跟着某些操作, 比如:

```c
  event_indicated = 1;
  wake_up(&event_wait_queue);
```

or:

或者是这种样子:

```c
  event_indicated = 1;
  wake_up_process(event_daemon);
```


A general memory barrier is executed by wake_up() if it wakes something up. If it doesn't wake anything up then a memory barrier may or may not be executed; you must not rely on it.  The barrier occurs before the task state is accessed, in particular, it sits between the STORE to indicate the event and the STORE to set TASK_RUNNING:

如果唤醒某些东西, 则由 wake_up() 执行通用内存屏障。 如果它没有唤醒任何东西, 那么内存屏障可能会也可能不会被执行； 你不能依赖它。 屏障发生在访问任务状态之前, 特别是, 位于指示事件的 STORE 和设置 TASK_RUNNING 的 STORE 之间:

```c
  CPU 1 (Sleeper)                   CPU 2 (Waker)
  ===============================  ===============================
  set_current_state();              STORE event_indicated
    smp_store_mb();                 wake_up();
      STORE current->state            ...
      <general barrier>               <general barrier>
  LOAD event_indicated                if ((LOAD task->state) & TASK_NORMAL)
                                        STORE task->state
```

where "task" is the thread being woken up and it equals CPU 1's "current".

To repeat, a general memory barrier is guaranteed to be executed by wake_up() if something is actually awakened, but otherwise there is no such guarantee.  To see this, consider the following sequence of events, where X and Y are both initially zero:

其中 "task" 是被唤醒的线程, 它等于 CPU 1 的 "current"。

重复一遍, 如果确实唤醒了某些东西, 则通过 wake_up() 可确保会执行通用内存屏障, 否则就没有这样的保证。 要演示这一点, 请看下面的事件序列, 其中 X 和 Y 的初始值都为零:

```c
  CPU 1                             CPU 2
  ===============================  ===============================
  X = 1;                            Y = 1;
  smp_mb();                         wake_up();
  LOAD Y                            LOAD X
```

If a wakeup does occur, one (at least) of the two loads must see 1.  If, on the other hand, a wakeup does not occur, both loads might see 0.

wake_up_process() always executes a general memory barrier.  The barrier again occurs before the task state is accessed.  In particular, if the wake_up() in the previous snippet were replaced by a call to wake_up_process() then one of the two loads would be guaranteed to see 1.

The available waker functions include:

如果确实发生了唤醒, 则两次 load 中（至少）有一个肯定会读取到 1。 另一方面, 如果没有发生唤醒, 则两次 load 看到的可能都是 0。

wake_up_process() 总是执行一个通用内存屏障。 在访问任务状态之前再次出现屏障。 特别是, 如果前一个代码段中的 wake_up() 被替换为 wake_up_process() , 那么两次 load 中的一个将保证看到1。

可用的唤醒函数包括:

```c
  complete();
  wake_up();
  wake_up_all();
  wake_up_bit();
  wake_up_interruptible();
  wake_up_interruptible_all();
  wake_up_interruptible_nr();
  wake_up_interruptible_poll();
  wake_up_interruptible_sync();
  wake_up_interruptible_sync_poll();
  wake_up_locked();
  wake_up_locked_poll();
  wake_up_nr();
  wake_up_poll();
  wake_up_process();
```

In terms of memory ordering, these functions all provide the same guarantees of a wake_up() (or stronger).

> [!] Note that the memory barriers implied by the sleeper and the waker do _not_ order multiple stores before the wake-up with respect to loads of those stored values after the sleeper has called set_current_state().  For instance, if the sleeper does:

在内存排序方面, 这些函数都提供了与 wake_up() 相同的(或更强的）保证。

> [!] 请注意, 睡眠者和唤醒者隐含的内存屏障【不会】在唤醒之前对多个 store 进行排序, 这些 store 在睡眠者调用 `set_current_state()` 之后加载这些保存的值。

例如, 如果睡眠者的操作为:

```c
  set_current_state(TASK_INTERRUPTIBLE);
  if (event_indicated)
    break;
  __set_current_state(TASK_RUNNING);
  do_something(my_data);
```

and the waker does:

唤醒者执行的操作为:

```c
  my_data = value;
  event_indicated = 1;
  wake_up(&event_wait_queue);
```

there's no guarantee that the change to event_indicated will be perceived by the sleeper as coming after the change to my_data.  In such a circumstance, the code on both sides must interpolate its own memory barriers between the separate data accesses.  Thus the above sleeper ought to do:

不能保证对 event_indicated 的更改会被睡眠者感知为在更改 my_data 之后发生。 在这种情况下, 双方的代码必须在单独的数据访问之间插入自己的内存屏障。 因此上面的 sleeper 应该这样做:

```c
  set_current_state(TASK_INTERRUPTIBLE);
  if (event_indicated) {
    smp_rmb();
    do_something(my_data);
  }
```

and the waker should do:

waker 应该这样做:

```c
  my_data = value;
  smp_wmb();
  event_indicated = 1;
  wake_up(&event_wait_queue);
```


MISCELLANEOUS FUNCTIONS
-----------------------


Other functions that imply barriers:

- (`*`) schedule() and similar imply full memory barriers.


<a name="MISCELLANEOUS_FUNCTIONS"></a>
### 4.4 其他函数

其他隐含内存屏障的函数还有:

- (`*`) schedule() 和类似蕴含完全内存屏障的函数。


===================================
INTER-CPU ACQUIRING BARRIER EFFECTS
===================================

On SMP systems locking primitives give a more substantial form of barrier: one that does affect memory access ordering on other CPUs, within the context of conflict on any particular lock.


<a name="INTER-CPU_ACQUIRING_BARRIER_EFFECTS"></a>
## 5. 多个CPU之间ACQUIRE屏障的影响

在SMP系统上,  锁定原语提供了一种更实质的屏障形式: 在任何一个具体的锁发生冲突的情况下, 会真正地影响其他 CPU 上的内存访问顺序。


ACQUIRES VS MEMORY ACCESSES
---------------------------

<a name="ACQUIRES_VS_MEMORY_ACCESSES"></a>
### 5.1 `ACQUIRE`S vs. 内存访问

Consider the following: the system has a pair of spinlocks (M) and (Q), and three CPUs; then should the following sequence of events occur:

请看以下情况: 系统中有一对自旋锁（M）和（Q）, 以及三个 CPU； 那么就可能会发生以下事件序列:

```c
  CPU 1                             CPU 2
  ===============================  ===============================
  WRITE_ONCE(*A, a);                WRITE_ONCE(*E, e);
  ACQUIRE M                         ACQUIRE Q
  WRITE_ONCE(*B, b);                WRITE_ONCE(*F, f);
  WRITE_ONCE(*C, c);                WRITE_ONCE(*G, g);
  RELEASE M                         RELEASE Q
  WRITE_ONCE(*D, d);                WRITE_ONCE(*H, h);
```

Then there is no guarantee as to what order CPU 3 will see the accesses to *A through *H occur in, other than the constraints imposed by the separate locks on the separate CPUs.  It might, for example, see:

然后, 除了由单独的 CPU 上的单独锁强加的约束之外, 无法保证 CPU 3 将看到对 *A 到 *H 发生的访问顺序。 例如, 它可能会看到:

```c
  *E, ACQUIRE M, ACQUIRE Q, *G, *C, *F, *A, *B, RELEASE Q, *D, *H, RELEASE M
```

But it won't see any of:

但它不会看到以下的任何一种:

```c
  *B, *C or *D preceding ACQUIRE M
  *A, *B or *C following RELEASE M
  *F, *G or *H preceding ACQUIRE Q
  *E, *F or *G following RELEASE Q
```


=================================
WHERE ARE MEMORY BARRIERS NEEDED?
=================================


Under normal operation, memory operation reordering is generally not going to be a problem as a single-threaded linear piece of code will still appear to work correctly, even if it's in an SMP kernel.  There are, however, four circumstances in which reordering definitely _could_ be a problem:

- (`*`) Interprocessor interaction.

- (`*`) Atomic operations.

- (`*`) Accessing devices.

- (`*`) Interrupts.


<a name="WHERE_ARE_MEMORY_BARRIERS_NEEDED"></a>
## 6. 哪些地方需要内存屏障

在正常操作时, 内存操作重排序通常不会成为问题, 因为单线程的线性代码仍然可以正常工作, 即使它在 SMP 内核中。
但是, 在下面四种情况下, 重排序肯定会造成一些问题:

- (`*`) 处理器之间的交互。

- (`*`) 原子操作。

- (`*`) 访问设备。

- (`*`) 中断。


INTERPROCESSOR INTERACTION
--------------------------


<a name="INTERPROCESSOR_INTERACTION"></a>
### 6.1 处理器之间的交互

When there's a system with more than one processor, more than one CPU in the system may be working on the same data set at the same time.  This can cause synchronisation problems, and the usual way of dealing with them is to use locks.  Locks, however, are quite expensive, and so it may be preferable to operate without the use of a lock if at all possible.  In such a case operations that affect both CPUs may have to be carefully ordered to prevent a malfunction.

Consider, for example, the R/W semaphore slow path.  Here a waiting process is queued on the semaphore, by virtue of it having a piece of its stack linked to the semaphore's list of waiting processes:

如果一个系统具有多个处理器, 那么在同一时刻, 可能有多个 CPU 对同一份数据集进行处理。
这可能会引起同步问题, 一般的处理方法是使用锁。
但是锁操作的代价非常高,  因此如果有可能的话, 最好是在不使用锁的情况下进行操作。
这时候, 必须仔细安排影响多个 CPU 的操作, 以防止出现故障。

例如, 在 R/W 信号量的慢路径。 有一个等待进程在信号量上排队, 它的栈上有一部分内容链接到信号量的等待进程列表:

```c
  struct rw_semaphore {
    ...
    spinlock_t lock;
    struct list_head waiters;
  };

  struct rwsem_waiter {
    struct list_head list;
    struct task_struct *task;
  };
```

To wake up a particular waiter, the up_read() or up_write() functions have to:

 (1) read the next pointer from this waiter's record to know as to where the next waiter record is;

 (2) read the pointer to the waiter's task structure;

 (3) clear the task pointer to tell the waiter it has been given the semaphore;

 (4) call wake_up_process() on the task; and

 (5) release the reference held on the waiter's task struct.

In other words, it has to perform this sequence of events:

要唤醒特定的等待者,  `up_read()` 或 `up_write()` 函数必须:

- (1) 从这个waiter的记录中读取next指针, 才能知道下一个 waiter 记录在哪里；

- (2) 读取waiter任务结构的指针；

- (3) 清空任务指针, 告诉等待者已经把信号量赋予了它；

- (4) 对任务调用 `wake_up_process()`; 并且

- (5) 释放在等待者 task struct 上持有的引用。

换句话说, 它必须执行以下事件序列:

```c
  LOAD waiter->list.next;
  LOAD waiter->task;
  STORE waiter->task;
  CALL wakeup
  RELEASE task
```

and if any of these steps occur out of order, then the whole thing may malfunction.

Once it has queued itself and dropped the semaphore lock, the waiter does not get the lock again; it instead just waits for its task pointer to be cleared before proceeding.  Since the record is on the waiter's stack, this means that if the task pointer is cleared _before_ the next pointer in the list is read, another CPU might start processing the waiter and might clobber the waiter's stack before the up*() function has a chance to read the next pointer.

Consider then what might happen to the above sequence of events:

如果这些步骤中的任何一个出错, 那么整个设备都可能出现故障。

一旦它把自己加入队列并放弃信号量锁, 等待者就不会再次获得锁； 它在继续之前只是等待其任务指针被清除。
由于记录是存放在 waiter 的栈上, 这意味着: 假如在读取列表中的后续指针之前, 任务指针就先被清除了, 则另一个 CPU 可能会开始处理 waiter 并可能在 `up*()` 函数有机会阅读后续指针之前, 破坏 waiter 的栈。

那么考虑上述事件序列可能会发生什么:

```c
  CPU 1                             CPU 2
  ===============================  ===============================
                                      down_xxx()
                                      Queue waiter
                                      Sleep
  up_yyy()
  LOAD waiter->task;
  STORE waiter->task;
                                      Woken up by other event
  <preempt>
                                      Resume processing
                                      down_xxx() returns
                                      call foo()
                                      foo() clobbers *waiter
  </preempt>
  LOAD waiter->list.next;
  --- OOPS ---
```

This could be dealt with using the semaphore lock, but then the down_xxx() function has to needlessly get the spinlock again after being woken up.

The way to deal with this is to insert a general SMP memory barrier:

这种情况可以使用信号量锁来处理, 但是 down_xxx() 函数在被唤醒后只能（不必要地)再次获取自旋锁。

处理这种情况的方法是插入一个通用的 SMP 内存屏障:

```c
  LOAD waiter->list.next;
  LOAD waiter->task;
  `smp_mb()`;
  STORE waiter->task;
  CALL wakeup
  RELEASE task
```

In this case, the barrier makes a guarantee that all memory accesses before the barrier will appear to happen before all the memory accesses after the barrier with respect to the other CPUs on the system.  It does _not_ guarantee that all the memory accesses before the barrier will be complete by the time the barrier instruction itself is complete.

On a UP system - where this wouldn't be a problem - the `smp_mb()` is just a compiler barrier, thus making sure the compiler emits the instructions in the right order without actually intervening in the CPU.  Since there's only one CPU, that CPU's dependency ordering logic will take care of everything else.

在这种情况下, 屏障可以保证: 相对于系统上的其他 CPU, 屏障前面的所有内存访问, 都发生在屏障后面的任何内存访问之前。 但它不保证屏障之前的所有内存访问都会在屏障指令本身完成时完成。

在 UP 系统上 - 这不会成为问题 - `smp_mb()` 只是一个编译器屏障, 这时候只需要确保编译器以正确的顺序发出指令, 而无需实际干预 CPU。 由于只有一个 CPU, 该 CPU 的依赖排序逻辑会处理其他的所有事情。


ATOMIC OPERATIONS
-----------------


While they are technically interprocessor interaction considerations, atomic operations are noted specially as some of them imply full memory barriers and some don't, but they're very heavily relied on as a group throughout the kernel.

See Documentation/atomic_t.txt for more information.


<a name="ATOMIC_OPERATIONS"></a>
### 6.2 原子操作

虽然在技术上, 这是处理器间交互的考虑因素, 但需要特别说一下原子操作: 其中一些原子操作隐式包含着完整的内存屏障, 另一些没有, 但它们在整个过程中作为系统内核的一个组被高度依赖。

更多信息, 请参阅 `Documentation/atomic_t.txt`。


ACCESSING DEVICES
-----------------


Many devices can be memory mapped, and so appear to the CPU as if they're just a set of memory locations.  To control such a device, the driver usually has to make the right memory accesses in exactly the right order.

However, having a clever CPU or a clever compiler creates a potential problem in that the carefully sequenced accesses in the driver code won't reach the device in the requisite order if the CPU or the compiler thinks it is more efficient to reorder, combine or merge accesses - something that would cause the device to malfunction.

Inside of the Linux kernel, I/O should be done through the appropriate accessor routines - such as inb() or `writel()` - which know how to make such accesses appropriately sequential.  While this, for the most part, renders the explicit use of memory barriers unnecessary, if the accessor functions are used to refer to an I/O memory window with relaxed memory access properties, then _mandatory_ memory barriers are required to enforce ordering.

See Documentation/driver-api/device-io.rst for more information.


<a name="ACCESSING_DEVICES"></a>
### 6.3 访问设备

许多设备都可以进行内存映射, 因此对于 CPU 来说, 它们就像是一组内存位置。
为了控制这样的设备, 驱动程序通常必须以完全正确的顺序进行内存访问操作。

然而, 拥有一个聪明的 CPU 或者一个聪明的编译器会产生一个潜在的问题, 因为如果 CPU 或编译器认为进行重新排序、组合或合并操作之后效率更高, 那么驱动程序代码中仔细排列的内存访问操作, 将不会以预期的顺序到达设备。 这就导致设备出现故障。

在 Linux 内核中, I/O 操作应该通过适当的访问器例程来完成 - 例如 `inb()` 或 `writel()`。
它们知道如何让此类访问操作按适当的顺序进行。
虽然在大多数情况下不需要显式使用内存屏障, 但如果访问函数被用来引用具有宽松内存访问属性的 I/O 内存窗口, 则需要使用强内存屏障来进行强制排序。

有关更多信息, 请参阅 `Documentation/driver-api/device-io.rst`。


INTERRUPTS
----------

<a name="INTERRUPTS"></a>
### 6.4 中断（INTERRUPTS）

A driver may be interrupted by its own interrupt service routine, and thus the two parts of the driver may interfere with each other's attempts to control or access the device.

This may be alleviated - at least in part - by disabling local interrupts (a form of locking), such that the critical operations are all contained within the interrupt-disabled section in the driver.  While the driver's interrupt routine is executing, the driver's core may not run on the same CPU, and its interrupt is not permitted to happen again until the current interrupt has been handled, thus the interrupt handler does not need to lock against that.

However, consider a driver that was talking to an ethernet card that sports an address register and a data register.  If that driver's core talks to the card under interrupt-disablement and then the driver's interrupt handler is invoked:

驱动程序可能会被自己的中断服务例程所中断, 因此驱动程序的两个部分可能会干扰对方控制或访问设备的尝试。

这可以通过禁用本地中断来缓解, 至少部分缓解（通过一种锁定形式）, 使得关键操作都包含在驱动程序中的中断禁用部分中。
驱动程序的中断例程正在执行时, 驱动程序的核心可能不会运行在同一个 CPU 上, 并且在当前中断处理完成之前, 不允许再次发生它的中断, 因此中断处理程序不需要锁定。

然而, 考虑一个驱动程序正在与一个带有地址寄存器和数据寄存器的以太网卡通信。
如果该驱动程序的核心在中断禁用下与网卡对话, 然后调用驱动程序的中断处理程序:

```c
  LOCAL IRQ DISABLE
  writew(ADDR, 3);
  writew(DATA, y);
  LOCAL IRQ ENABLE
  <interrupt>
  writew(ADDR, 4);
  q = readw(DATA);
  </interrupt>
```

The store to the data register might happen after the second store to the address register if ordering rules are sufficiently relaxed:

如果排序规则足够宽松, 则第一次存储到数据寄存器的store操作, 可能发生在第二次存储到地址寄存器的 store 之后:


```c
STORE *ADDR = 3, STORE *ADDR = 4, STORE *DATA = y, q = LOAD *DATA
```


If ordering rules are relaxed, it must be assumed that accesses done inside an interrupt disabled section may leak outside of it and may interleave with accesses performed in an interrupt - and vice versa - unless implicit or explicit barriers are used.

Normally this won't be a problem because the I/O accesses done inside such sections will include synchronous load operations on strictly ordered I/O registers that form implicit I/O barriers.


A similar situation may occur between an interrupt routine and two routines running on separate CPUs that communicate with each other.  If such a case is likely, then interrupt-disabling locks should be used to guarantee ordering.

如果排序规则放宽, 则必须假设在中断禁用部分内进行的访问可能会泄漏到其外部, 并且可能与在中断中执行的访问交错 - 反之亦然 - 除非使用隐式或显式屏障。

通常这不会成为问题, 因为在这些部分内完成的 I/O 访问将包括对形成隐式 I/O 屏障的严格有序 I/O 寄存器的同步加载操作。


类似的情况可能发生在中断例程和两个运行在彼此通信的独立 CPU 上的例程之间。 如果可能出现这种情况, 则应使用禁止中断的锁来保证排序。



==========================
KERNEL I/O BARRIER EFFECTS
==========================



<a name="KERNEL_IO_BARRIER_EFFECTS"></a>
## 7. Linux内核提供的IO屏障效果

Interfacing with peripherals via I/O accesses is deeply architecture and device specific. Therefore, drivers which are inherently non-portable may rely on specific behaviours of their target systems in order to achieve synchronization in the most lightweight manner possible. For drivers intending to be portable between multiple architectures and bus implementations, the kernel offers a series of accessor functions that provide various degrees of ordering guarantees:

通过I/O访问与外围设备交互的接口, 是与硬件架构和设备深度绑定的。
因此, 本质上不可移植的驱动程序, 可能依赖于目标系统的特定行为, 以便以最轻量级的方式实现同步。
对于打算在多个体系结构和总线实现之间进行移植的驱动程序, 内核提供了一系列的访问函数, 提供不同程度的排序保证:

### (`*`) `readX()`, `writeX()`:

The `readX()` and `writeX()` MMIO accessors take a pointer to the peripheral being accessed as an `__iomem *` parameter. For pointers mapped with the default I/O attributes (e.g. those returned by `ioremap()`), the ordering guarantees are as follows:

`readX()` 和 `writeX()` 这两个 MMIO 访问器都有一个 `__iomem *` 参数, 作为指向要访问的外围设备的指针。
对于使用默认 I/O 属性映射的指针（例如, 由 `ioremap()` 返回的指针）, 排序保证如下:

1. All `readX()` and `writeX()` accesses to the same peripheral are ordered with respect to each other. This ensures that MMIO register accesses by the same CPU thread to a particular device will arrive in program order.

1. 对同一个外设的所有 `readX()` 和 `writeX()` 访问都是有序的。 这确保了同一 CPU 线程对特定设备的 MMIO 寄存器访问将按程序指定的顺序到达。

2. A `writeX()` issued by a CPU thread holding a spinlock is ordered before a `writeX()` to the same peripheral from another CPU thread issued after a later acquisition of the same spinlock. This ensures that MMIO register writes to a particular device issued while holding a spinlock will arrive in an order consistent with acquisitions of the lock.

2. 持有自旋锁的 CPU 线程发出的 `writeX()`, 会被排在, 稍后获得相同自旋锁的另一个 CPU 线程, 在获取自旋锁之后发出的, 对同一外围设备的 `writeX()` 之前。 这确保了在持有自旋锁的同时向特定设备发出的 MMIO 寄存器写入, 将按照与锁获取顺序一致的顺序到达。

3. A `writeX()` by a CPU thread to the peripheral will first wait for the completion of all prior writes to memory either issued by, or propagated to, the same thread. This ensures that writes by the CPU to an outbound DMA buffer allocated by `dma_alloc_coherent()` will be visible to a DMA engine when the CPU writes to its MMIO control register to trigger the transfer.

3. CPU 线程对外围设备的 `writeX()` 会先等待先前的所有内存写入完成, 无论是由同一线程发出的, 还是传播到同一线程的。 这确保了当 CPU 写入其 MMIO 控制寄存器以触发传输时, ​​CPU 对由 `dma_alloc_coherent()` 分配的出站 DMA 缓冲区的写入, 对 DMA 引擎可见。

4. A `readX()` by a CPU thread from the peripheral will complete before any subsequent reads from memory by the same thread can begin. This ensures that reads by the CPU from an incoming DMA buffer allocated by `dma_alloc_coherent()` will not see stale data after reading from the DMA engine's MMIO status register to establish that the DMA transfer has completed.

4. CPU 线程对外设的 `readX()`, 将在同一线程开始从内存中读取任何后续内容之前完成。 这确保了 CPU 从 `dma_alloc_coherent()` 分配的传入 DMA 缓冲区读取的数据, 在读取 DMA 引擎的 MMIO 状态寄存器, 以确定 DMA 传输已完成之后, 不会看到过时的数据。


5. A `readX()` by a CPU thread from the peripheral will complete before any subsequent `delay()` loop can begin execution on the same thread. This ensures that two MMIO register writes by the CPU to a peripheral will arrive at least 1us apart if the first write is immediately read back with `readX()` and `udelay(1)` is called prior to the second `writeX()`:

5. CPU 线程从外围设备执行的  `readX()` 读取,  将在同一线程上的任何后续的 `delay()` 循环开始执行之前完成。 这确保了 CPU 对外围设备的两次 MMIO 寄存器写入至少相隔 1us, 如果第一次写入使用 `readX()` 立即回读, 并且在第二次 `writeX() 之前调用 `udelay(1)`:


```c
writel(42, DEVICE_REGISTER_0); // Arrives at the device...
readl(DEVICE_REGISTER_0);
udelay(1);
writel(42, DEVICE_REGISTER_1); // ...at least 1us before this.
```

The ordering properties of `__iomem` pointers obtained with non-default attributes (e.g. those returned by `ioremap_wc()`) are specific to the underlying architecture and therefore the guarantees listed above cannot generally be relied upon for accesses to these types of mappings.

使用非默认属性获得的 `__iomem` 指针（例如, 由 `ioremap_wc()` 返回的指针）, 其排序属性特定于底层架构, 因此通常不能依赖上面列出的保证来对这些类型的映射进行访问。


### (`*`) `readX_relaxed()`, `writeX_relaxed()`:

These are similar to `readX()` and `writeX()`, but provide weaker memory ordering guarantees. Specifically, they do not guarantee ordering with respect to locking, normal memory accesses or `delay()` loops (i.e. bullets 2-5 above) but they are still guaranteed to be ordered with respect to other accesses from the same CPU thread to the same peripheral when operating on `__iomem` pointers mapped with the default I/O attributes.

这两个函数类似于 `readX()` 和 `writeX()`, 但提供较弱的内存排序保证。 具体来说, 它们不保证由锁定、正常内存访问或 `delay()` 循环（即上面的第 2-5 条）达成的排序; 但仍然保证从同一 CPU 线程到相同的外围设备的顺序, 如果这些操作是使用默认 I/O 属性映射的 `__iomem` 指针的话。


### (`*`) `readsX()`, `writesX()`:

The `readsX()` and `writesX()` MMIO accessors are designed for accessing register-based, memory-mapped FIFOs residing on peripherals that are not capable of performing DMA. Consequently, they provide only the ordering guarantees of `readX_relaxed()` and `writeX_relaxed()`, as documented above.

`readsX()` 和 `writesX()` 这两个MMIO访问器专门设计了用来访问, 基于寄存器的, 内存映射 FIFO的, 不能执行 DMA 驻留的外设。 因此, 它们仅提供 `readX_relaxed()` 和 `writeX_relaxed()` 的排序保证, 如上文所述。

### (`*`) `inX()`, `outX()`:

The `inX()` and `outX()` accessors are intended to access legacy port-mapped I/O peripherals, which may require special instructions on some architectures (notably x86). The port number of the peripheral being accessed is passed as an argument.

Since many CPU architectures ultimately access these peripherals via an internal virtual memory mapping, the portable ordering guarantees provided by `inX()` and `outX()` are the same as those provided by `readX()` and `writeX()` respectively when accessing a mapping with the default I/O attributes.

Device drivers may expect `outX()` to emit a non-posted write transaction that waits for a completion response from the I/O peripheral before returning. This is not guaranteed by all architectures and is therefore not part of the portable ordering semantics.

`inX()` 和 `outX()` 这两个访问器旨在访问传统的端口映射 I/O 外设, 在某些体系结构（特别是x86架构）上这可能需要特殊指令。 被访问的外围设备端口号通过函数参数来传递。

由于许多 CPU 架构最终通过内部虚拟内存来映射这些外设访问, 因此 `inX()` 和 `outX()` 提供的可移植排序保证与 `readX()` 和 `writeX()` 提供的保证相同, 区别只在这两个函数是用来访问具有默认 I/O 属性的映射。

设备驱动程序可能期望 `outX()` 发出一个非发布的写事务, 在返回之前等待来自 I/O 外设的完成响应。 这不是所有架构都能保证的, 因此不是可移植排序语义的一部分。

### (`*`) `insX()`, `outsX()`:

As above, the `insX()` and `outsX()` accessors provide the same ordering guarantees as `readsX()` and `writesX()` respectively when accessing a mapping with the default I/O attributes.

如上所述, 当访问具有默认 I/O 属性的映射时, `insX()` 和 `outsX()` 访问器分别提供与 `readsX()` 和 `writesX()` 相同的排序保证。


### (`*`) `ioreadX()`, `iowriteX()`:

These will perform appropriately for the type of access they're actually doing, be it `inX()`/`outX()` or `readX()`/`writeX()`.

With the exception of the string accessors (`insX()`, `outsX()`, `readsX()` and `writesX()`), all of the above assume that the underlying peripheral is little-endian and will therefore perform byte-swapping operations on big-endian architectures.

这些将根据他们实际执行的访问类型适当地执行, 无论是 `inX()`/`outX()` 或 `readX()`/`writeX()`。

除了字符串访问器（`insX()`、`outsX()`、`readsX()` 和`writesX()` ）, 以上列出的其他函数都假设底层外设是小端排序的(little-endian), 因此将在大端排列的架构上将要执行的字节交换操作(byte-swapping)。


========================================
ASSUMED MINIMUM EXECUTION ORDERING MODEL
========================================


<a name="ASSUMED_MINIMUM_EXECUTION_ORDERING_MODEL"></a>
## 8. 假定的最小执行顺序模型

It has to be assumed that the conceptual CPU is weakly-ordered but that it will maintain the appearance of program causality with respect to itself.  Some CPUs (such as i386 or x86_64) are more constrained than others (such as powerpc or frv), and so the most relaxed case (namely DEC Alpha) must be assumed outside of arch-specific code.

This means that it must be considered that the CPU will execute its instruction stream in any order it feels like - or even in parallel - provided that if an instruction in the stream depends on an earlier instruction, then that earlier instruction must be sufficiently complete[*] before the later instruction may proceed; in other words: provided that the appearance of causality is maintained.

我们心里必须要有一个概念: CPU 执行指令的顺序基本上是乱的(weakly-ordered), 但对外会保持程序基本的因果关系。
某些 CPU（例如 i386 或 x86_64）比其他 CPU（例如 powerpc 或 frv）受到更多限制, 因此必须在特定于架构的代码之外假设最宽松的情况（如 DEC Alpha）。

也就是说必须考虑的情况是: CPU 将按它自己喜欢的任何顺序来执行其指令流 - 甚至可以并行执行。 当然，指令乱序执行有一个前提是: 如果指令流中有一个指令依赖于前面的指令, 那么前面的那个指令必须执行完(或者执行的足够完整), 才可以进行后面的这个指令； 换句话说: 只要对外能保持因果关系即可。

> [*] Some instructions have more than one effect - such as changing the condition codes, changing registers or changing memory - and different instructions may depend on different effects.

> [*] 某些指令不止一种效果 —— 比如改变条件判断的代码、改变寄存器的代码, 或者改变内存的代码 —— 而且不同的指令又可能取决于不同的效果。

A CPU may also discard any instruction sequence that winds up having no ultimate effect.  For example, if two adjacent instructions both load an immediate value into the same register, the first may be discarded.


Similarly, it has to be assumed that compiler might reorder the instruction stream in any way it sees fit, again provided the appearance of causality is maintained.

CPU还可以丢弃那些没有最终效果的指令串。 比如, 如果相邻的两条指令都是将某个值(immediate value)加载到同一个寄存器中, 则第一条指令可能会被丢弃。

同样的道理, 也需要预期: 编译器也可能会以它认为合适的任何方式对指令流进行重排序, 只要是对外保证符合因果关系的顺序即可。


============================
THE EFFECTS OF THE CPU CACHE
============================

<a name="THE_EFFECTS_OF_THE_CPU_CACHE"></a>
## 9. CPU高速缓存的影响

The way cached memory operations are perceived across the system is affected to a certain extent by the caches that lie between CPUs and memory, and by the memory coherence system that maintains the consistency of state in the system.

As far as the way a CPU interacts with another part of the system through the caches goes, the memory system has to include the CPU's caches, and memory barriers for the most part act at the interface between the CPU and its cache (memory barriers logically act on the dotted line in the following diagram):

被cache缓存的内存操作, 其感知在一定程度上受到位于 CPU 和内存之间的缓存, 以及内存一致性系统的影响。

就 CPU 与系统的其他部分, 通过缓存进行交互这种方式来说, 内存系统必须包括 CPU 缓存, 并且大部分的内存屏障作用于 CPU 与其缓存之间的接口（逻辑上，内存屏障在下图中用冒号构成的虚线这里）:

```c
      <--- CPU --->         :       <----------- Memory ----------->
                            :
  +--------+    +--------+  :   +--------+    +-----------+
  |        |    |        |  :   |        |    |           |    +--------+
  |  CPU   |    | Memory |  :   | CPU    |    |           |    |        |
  |  Core  |--->| Access |----->| Cache  |<-->|           |    |        |
  |        |    | Queue  |  :   |        |    |           |--->| Memory |
  |        |    |        |  :   |        |    |           |    |        |
  +--------+    +--------+  :   +--------+    |           |    |        |
                            :                 | Cache     |    +--------+
                            :                 | Coherency |
                            :                 | Mechanism |    +--------+
  +--------+    +--------+  :   +--------+    |           |    |        |
  |        |    |        |  :   |        |    |           |    |        |
  |  CPU   |    | Memory |  :   | CPU    |    |           |--->| Device |
  |  Core  |--->| Access |----->| Cache  |<-->|           |    |        |
  |        |    | Queue  |  :   |        |    |           |    |        |
  |        |    |        |  :   |        |    |           |    +--------+
  +--------+    +--------+  :   +--------+    +-----------+
                            :
                            :
```

Although any particular load or store may not actually appear outside of the CPU that issued it since it may have been satisfied within the CPU's own cache, it will still appear as if the full memory access had taken place as far as the other CPUs are concerned since the cache coherency mechanisms will migrate the cacheline over to the accessing CPU and propagate the effects upon conflict.

虽然有可能所有的 load 或者 store 都不会在发出它的 CPU 之外出现, 因为在这个 CPU 自己的cache中可能就达成了。
但因为缓存一致性机制, 会将缓存行(cacheline)迁移到访问的 CPU 并传播冲突时的影响, 就其他 CPU 而言, 仍然看起来好像已经发生了完整的内存访问。

The CPU core may execute instructions in any order it deems fit, provided the expected program causality appears to be maintained.  Some of the instructions generate load and store operations which then go into the queue of memory accesses to be performed.  The core may place these in the queue in any order it wishes, and continue execution until it is forced to wait for an instruction to complete.

What memory barriers are concerned with is controlling the order in which accesses cross from the CPU side of things to the memory side of things, and the order in which the effects are perceived to happen by the other observers in the system.

CPU核心可以按照它认为合适的任何顺序执行指令, 前提是预期的程序因果关系保持不变。 一些指令生成 load 和 store 操作, 然后进入内存访问队列等待执行。 CPU核心可以按照它希望的任何顺序将这些指令放在队列中, 并继续往下执行, 直到某些操作, 强制它等待某条指令执行完成。

内存屏障所关心的是, 控制从 CPU 侧到内存侧的访问执行顺序, 以及系统中其他观察者感知到影响发生的顺序。


> [!] Memory barriers are _not_ needed within a given CPU, as CPUs always see their own loads and stores as if they had happened in program order.

> [!] MMIO or other device accesses may bypass the cache system.  This depends on the properties of the memory window through which devices are accessed and/or the use of any special device communication instructions the CPU may have.

> [!] 单个CPU内部, 并不需要内存屏障, 因为 CPU 总是能看到自己的 load 和 store, 就像它们是按照程序顺序发生的一样。

> [!] MMIO 或其他设备访问可能会绕过 CPU cache。这取决于访问设备的内存窗口的属性, 以及 CPU 可能具有的某些特殊设备通信指令。


CACHE COHERENCY VS DMA
----------------------

<a name="CACHE_COHERENCY_VS_DMA"></a>
### 9.1 缓存一致性与 DMA

Not all systems maintain cache coherency with respect to devices doing DMA.  In such cases, a device attempting DMA may obtain stale data from RAM because dirty cache lines may be resident in the caches of various CPUs, and may not have been written back to RAM yet.  To deal with this, the appropriate part of the kernel must flush the overlapping bits of cache on each CPU (and maybe invalidate them as well).

In addition, the data DMA'd to RAM by a device may be overwritten by dirty cache lines being written back to RAM from a CPU's cache after the device has installed its own data, or cache lines present in the CPU's cache may simply obscure the fact that RAM has been updated, until at such time as the cacheline is discarded from the CPU's cache and reloaded.  To deal with this, the appropriate part of the kernel must invalidate the overlapping bits of the cache on each CPU.

See Documentation/core-api/cachetlb.rst for more information on cache management.

并非所有系统都维持与执行 DMA 的设备相关的缓存一致性。 在这种情况下, 尝试 DMA 的设备可能会从 RAM 中获取陈旧数据, 因为脏缓存行可能驻留在各种 CPU 缓存中, 并且可能尚未写回 RAM。 为了解决这个问题, Linux内核的相关部分必须刷新每个 CPU 缓存的重叠位（或者置为无效）。

此外, 设备 DMA 到 RAM 的数据, 可能会在设备装载自己的数据之后, 被 CPU 缓存写回到 RAM 的脏缓存行所覆盖, 或者 CPU 缓存中的缓存行, 可能掩盖了 RAM 已经被更新的事实, 直到缓存行从 CPU 缓存中丢弃并重新加载。  为了解决这个问题, Linux内核的相关部分必须使每个 CPU 上缓存的重叠位无效。

CPU cache 管理相关的更多信息, 请参阅 `Documentation/core-api/cachetlb.rst`。


CACHE COHERENCY VS MMIO
-----------------------

<a name="CACHE_COHERENCY_VS_MMIO"></a>
### 9.2 缓存一致性与MMIO

Memory mapped I/O usually takes place through memory locations that are part of a window in the CPU's memory space that has different properties assigned than the usual RAM directed window.

Amongst these properties is usually the fact that such accesses bypass the caching entirely and go directly to the device buses.  This means MMIO accesses may, in effect, overtake accesses to cached memory that were emitted earlier. A memory barrier isn't sufficient in such a case, but rather the cache must be flushed between the cached memory write and the MMIO access if the two are in any way dependent.

内存映射 I/O 通常是通过内存位置进行的, 这些内存位置是 CPU 内存地址空间中窗口的一部分, 该窗口具有与通常的 RAM 定向窗口不同的属性。

在这些属性中, 通常这样的访问完全绕过缓存并直接进入设备总线。 这意味着 MMIO 访问实际上可能会在先前发出的缓存内存的访问之前到达。 在这种情况下, 内存屏障是不够的, 如果两者有任何依赖关系的话, 必须在缓存内存写入和 MMIO 访问之间刷新缓存, 。


=========================
THE THINGS CPUS GET UP TO
=========================

<a name="THE_THINGS_CPUS_GET_UP_TO"></a>
## 10. CPU干的好事

A programmer might take it for granted that the CPU will perform memory operations in exactly the order specified, so that if the CPU is, for example, given the following piece of code to execute:

可能有些码农会理所当然地认为, CPU将严格按照程序指定的顺序来执行内存操作, 因此, 如果让一个CPU执行下面的代码片段:

```c
a = READ_ONCE(*A);
WRITE_ONCE(*B, b);
c = READ_ONCE(*C);
d = READ_ONCE(*D);
WRITE_ONCE(*E, e);
```

they would then expect that the CPU will complete the memory operation for each instruction before moving on to the next one, leading to a definite sequence of operations as seen by external observers in the system:

他们以为 CPU 会在继续执行下一条指令之前, 完成先前每一条指令相关的内存操作, 系统中的外部观察者会看到确定的操作序列:

```c
LOAD *A, STORE *B, LOAD *C, LOAD *D, STORE *E.
```

Reality is, of course, much messier.  With many CPUs and compilers, the above assumption doesn't hold because:

- (`*`) loads are more likely to need to be completed immediately to permit execution progress, whereas stores can often be deferred without a problem;

- (`*`) loads may be done speculatively, and the result discarded should it prove to have been unnecessary;

- (`*`) loads may be done speculatively, leading to the result having been fetched at the wrong time in the expected sequence of events;

- (`*`) the order of the memory accesses may be rearranged to promote better use of the CPU buses and caches;

- (`*`) loads and stores may be combined to improve performance when talking to memory or I/O hardware that can do batched accesses of adjacent locations, thus cutting down on transaction setup costs (memory and PCI devices may both be able to do this); and

- (`*`) the CPU's data cache may affect the ordering, and while cache-coherency mechanisms may alleviate this - once the store has actually hit the cache - there's no guarantee that the coherency management will be propagated in order to other CPUs.

但现实情况要复杂得多。对许多 CPU 和编译器而言, 上面的假设并不成立, 原因包括:

- (`*`) load操作可能需要立即完成以加快执行速度, 同样的道理, store操作一般都可以毫无疑问地推迟；

- (`*`) load操作可能是预先推断执行的, 如果结果被证明是不必要的, 则将其丢弃；

- (`*`) load操作可能是预先推断执行的, 在预期的事件序列中, 会导致在错误的时间点去获取结果；

- (`*`) 内存访问的顺序可能会被重新排列, 以更好地使用 CPU 总线和cache；

- (`*`) 在与内存或 I/O 硬件交互时, 如果这些硬件支持对相邻位置进行批量访问的话, 就可以组合多个load操作和/或store操作, 以提高性能, 从而降低事务设置成本（内存和 PCI 设备都会有）;

- (`*`) CPU 的data cache可能会影响指令顺序, 虽然缓存一致性机制可以缓解这种情况, 如果store操作实际命中缓存的话, 但一致性管理并不保证会传播到其他 CPU。

So what another CPU, say, might actually observe from the above piece of code is:

那么, 执行上面的代码时, 另一个 CPU 实际观察到的顺序可能是:

```c
LOAD *A, ..., LOAD {*C,*D}, STORE *E, STORE *B

(其中 "LOAD {*C,*D}" 是批量的load组合)
```

However, it is guaranteed that a CPU will be self-consistent: it will see its _own_ accesses appear to be correctly ordered, without the need for a memory barrier.  For instance with the following code:

但是, 同一个CPU是可以保证自洽的: 它会看到自己的访问顺序正确出现, 而无需内存屏障。 例如使用以下代码:

```c
U = READ_ONCE(*A);
WRITE_ONCE(*A, V);
WRITE_ONCE(*A, W);
X = READ_ONCE(*A);
WRITE_ONCE(*A, Y);
Z = READ_ONCE(*A);
```

and assuming no intervention by an external influence, it can be assumed that the final result will appear to be:

如果没有外部影响和干预, 可以确定最终结果将是:

```c
U == *A 的初始值
X == W
Z == Y
*A == Y
```

The code above may cause the CPU to generate the full sequence of memory accesses:

上面的代码可能会让 CPU 生成的完整内存访问序列:

```c
U=LOAD *A, STORE *A=V, STORE *A=W, X=LOAD *A, STORE *A=Y, Z=LOAD *A
```


in that order, but, without intervention, the sequence may have almost any combination of elements combined or discarded, provided the program's view of the world remains consistent.  Note that `READ_ONCE()` and `WRITE_ONCE()` are -not- optional in the above example, as there are architectures where a given CPU might reorder successive loads to the same location. On such architectures, `READ_ONCE()` and `WRITE_ONCE()` do whatever is necessary to prevent this, for example, on Itanium the volatile casts used by `READ_ONCE()` and `WRITE_ONCE()` cause GCC to emit the special ld.acq and st.rel instructions (respectively) that prevent such reordering.

The compiler may also combine, discard or defer elements of the sequence before the CPU even sees them.

For instance:

按照这个顺序, 如果没有干预, 只要程序的全局视图保持一致, 这个序列几乎可以组合或丢弃任何的元素组合。
请注意, 在上面的示例中, `READ_ONCE()` 和 `WRITE_ONCE()` 不是可选的, 因为在某些架构中, 给定的 CPU 可能会将连续的多个load重排序到一起。 在这样的体系结构上, `READ_ONCE()` 和 `WRITE_ONCE()` 会执行一些必要的措施来阻止这种情况, 例如, 在 Itanium 上, `READ_ONCE()` 和 `WRITE_ONCE()` 使用的 volatile 转换会导致 GCC 分别发出特殊指令 `ld.acq` 和 `st.rel` 来阻止这种重排序。

编译器也可能在 CPU 看到具体的指令之前就组合、丢弃或推迟序列中的元素。

例如:

```c
  *A = V;
  *A = W;
```

may be reduced to:

可以简化为:

```c
  *A = W;
```

since, without either a write barrier or an `WRITE_ONCE()`, it can be assumed that the effect of the storage of V to *A is lost.  Similarly:

因为, 如果没有写屏障或 `WRITE_ONCE()`, 可以推断出将 V 存储到 *A 的效果会丢失。 相似地:

```c
  *A = Y;
  Z = *A;
```

may, without a memory barrier or an `READ_ONCE()` and `WRITE_ONCE()`, be reduced to:

在没有内存屏障或 `READ_ONCE()` 和 `WRITE_ONCE()` 的情况下, 可以简化为:

```c
  *A = Y;
  Z = Y;
```

and the LOAD operation never appear outside of the CPU.

那么 LOAD 操作永远都不会出现在 CPU 之外。


AND THEN THERE'S THE ALPHA
--------------------------

<a name="AND_THEN_THERE_S_THE_ALPHA"></a>
### 10.1 ALPHA架构的一些注意事项

The DEC Alpha CPU is one of the most relaxed CPUs there is.  Not only that, some versions of the Alpha CPU have a split data cache, permitting them to have two semantically-related cache lines updated at separate times.  This is where the data dependency barrier really becomes necessary as this synchronises both caches with the memory coherence system, thus making it seem like pointer changes vs new data occur in the right order.

The Alpha defines the Linux kernel's memory model, although as of v4.15 the Linux kernel's addition of `smp_mb()` to `READ_ONCE()` on Alpha greatly reduced its impact on the memory model.

DEC Alpha CPU 是目前最宽松的 CPU 之一。 不仅如此, 某些版本的 Alpha CPU 具有拆分开的数据缓存, 允许它们在不同时间更新两个语义相关的缓存行。 这就是数据依赖屏障真正变得必要的地方, 因为这会将两个缓存与内存一致性系统进行同步, 从而使指针更改与新数据看起来是以正确的顺序发生的。

Alpha 定义了 Linux 内核的内存模型, 尽管从 v4.15 开始, Linux 内核在 Alpha 上将 `smp_mb()` 添加到 `READ_ONCE()`中, 大大减少了它对内存模型的影响。



VIRTUAL MACHINE GUESTS
----------------------


<a name="VIRTUAL_MACHINE_GUESTS"></a>
### 10.2 虚拟机访客

Guests running within virtual machines might be affected by SMP effects even if the guest itself is compiled without SMP support.  This is an artifact of interfacing with an SMP host while running an UP kernel.  Using mandatory barriers for this use-case would be possible but is often suboptimal.

To handle this case optimally, low-level virt_mb() etc macros are available. These have the same effect as `smp_mb()` etc when SMP is enabled, but generate identical code for SMP and non-SMP systems.  For example, virtual machine guests should use virt_mb() rather than `smp_mb()` when synchronizing against a (possibly SMP) host.

These are equivalent to `smp_mb()` etc counterparts in all other respects, in particular, they do not control MMIO effects: to control MMIO effects, use mandatory barriers.

即使在虚拟机中运行的程序是在没有 SMP 支持的情况下编译的, 这些访客也可能会受到 SMP 效果的影响。 这是在UP内核的SMP宿主机上运行产品。 对这种场景使用强制性障碍是可能的, 但一般不是最理想的方案。

为了最佳地处理这种情况, 可以使用底层的 `virt_mb()` 等宏函数。 当启用 SMP 时, 它们与 `smp_mb()` 具有相同的效果, 但是会为 SMP 和非 SMP 系统生成等效的代码。 例如, 虚拟机访客在（可能是 SMP的）主机上进行同步时, 会使用 `virt_mb()` 而不是 `smp_mb()`。

这些在其他所有方面都等价于 `smp_mb()` 的对应函数 特别是, 它们不控制 MMIO 效果: 要控制 MMIO 效果, 请使用强制障碍。

============
EXAMPLE USES
============


<a name="EXAMPLE_USES"></a>
## 11. 使用示例

CIRCULAR BUFFERS
----------------

<a name="CIRCULAR_BUFFERS"></a>
### 11.1 环形Buffer

Memory barriers can be used to implement circular buffering without the need of a lock to serialise the producer with the consumer.  See: `Documentation/core-api/circular-buffers.rst` for details.

内存屏障可用于实现环形Buffer, 可以不使用锁来将生产者与消费者串行化。 更多相关的详细信息, 请参阅: `Documentation/core-api/circular-buffers.rst`。


==========
REFERENCES
==========


<a name="REFERENCES"></a>
## 12. 参考文档

Alpha AXP Architecture Reference Manual, Second Edition (Sites & Witek, Digital Press)
  Chapter 5.2: Physical Address Space Characteristics
  Chapter 5.4: Caches and Write Buffers
  Chapter 5.5: Data Sharing
  Chapter 5.6: Read/Write Ordering

AMD64 Architecture Programmer's Manual Volume 2: System Programming
  Chapter 7.1: Memory-Access Ordering
  Chapter 7.4: Buffering and Combining Memory Writes

ARM Architecture Reference Manual (ARMv8, for ARMv8-A architecture profile)
  Chapter B2: The AArch64 Application Level Memory Model

IA-32 Intel Architecture Software Developer's Manual, Volume 3: System Programming Guide
  Chapter 7.1: Locked Atomic Operations
  Chapter 7.2: Memory Ordering
  Chapter 7.4: Serializing Instructions

The SPARC Architecture Manual, Version 9
  Chapter 8: Memory Models
  Appendix D: Formal Specification of the Memory Models
  Appendix J: Programming with the Memory Models

Storage in the PowerPC (Stone and Fitzgerald)

UltraSPARC Programmer Reference Manual
  Chapter 5: Memory Accesses and Cacheability
  Chapter 15: Sparc-V9 Memory Models

UltraSPARC III Cu User's Manual
  Chapter 9: Memory Models

UltraSPARC IIIi Processor User's Manual
  Chapter 8: Memory Models

UltraSPARC Architecture 2005
  Chapter 9: Memory
  Appendix D: Formal Specifications of the Memory Models

UltraSPARC T1 Supplement to the UltraSPARC Architecture 2005
  Chapter 8: Memory Models
  Appendix F: Caches and Cache Coherency

Solaris Internals, Core Kernel Architecture, p63-68:
  Chapter 3.3: Hardware Considerations for Locks and
      Synchronization

Unix Systems for Modern Architectures, Symmetric Multiprocessing and Caching for Kernel Programmers:
  Chapter 13: Other Memory Models

Intel Itanium Architecture Software Developer's Manual: Volume 1:
  Section 2.6: Speculation
  Section 4.4: Memory Access



## 相关链接

- <https://www.kernel.org/doc/Documentation/memory-barriers.txt>
- <https://www.infoq.com/articles/memory_barriers_jvm_concurrency/>
- <https://www.extremetech.com/extreme/188776-how-l1-and-l2-cpu-caches-work-and-why-theyre-an-essential-part-of-modern-chips>
- <https://github.com/cncounter/translation/tree/master/tiemao_2016/08_memory-barriers>
