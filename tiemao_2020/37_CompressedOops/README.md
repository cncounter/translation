# CompressedOops

### Compressed oops in the Hotspot JVM

### HotSpot JVM 中的压缩指针(Compressed oops)

#### What's an oop?

#### 什么是 oop?

An "oop", or "ordinary object pointer" in HotSpot parlance is a managed pointer to an object.  It is normally the same size as a native machine pointer.  A managed pointer is carefully tracked by the Java application and GC subsystem, so that storage for unused objects can be reclaimed.  This process can also involve relocating (copying) objects which are in use, so that storage can be compacted.

在 HotSpot 的术语中，“oop”即“ordinary object pointer（普通对象指针）”，是指向对象的一种受管指针。它的大小通常与本地机器指针相同。受管指针会被 Java 应用程序和 GC 子系统仔细跟踪，以便回收不再使用的对象所占用的存储空间。这一过程还可能涉及对正在使用的对象进行搬迁（复制），以便压缩存储空间。

The term "oop" is traditional to certain VMs that derive from Smalltalk and Self, including the following:

“oop”这一术语是源自 Smalltalk 和 Self 一脉的某些虚拟机的传统，包括:

- Self (an prototype-based relative of Smalltalk) https://github.com/russellallen/self/blob/master/vm/src/any/objects/oop.hh
- Strongtalk (a Smalltalk implementation) http://code.google.com/p/strongtalk/wiki/VMTypesForSmalltalkObjects
- Hotspot  http://hg.openjdk.java.net/hsx/hotspot-main/hotspot/file/0/src/share/vm/oops/oop.hpp
- V8 http://code.google.com/p/v8/source/browse/trunk/src/objects.h (mentions "smi" but not "oop")

(In some of these systems, the term "smi" refers to a special non-oop word, a pseudo-pointer, which encodes a small, 30-bit integer.  This term can also be found in the V8 implementation of Smalltalk.)

（在其中一些系统中，“smi”一词指一种特殊的非 oop 字，即伪指针，用来编码一个较小的 30 位整数。在 V8 的 Smalltalk 实现中也能看到这个术语。）

#### Why should they be compressed?

#### 为什么要压缩?

On an LP64 system, a machine word, and hence an oop, requires 64 bits, while on an ILP32 system, oops are only 32 bits.  But on an ILP32 system there is a maximum heap size of somewhat less than 4Gb, which is not enough for many applications. On an LP64 system, though, the heap for any given run may have to be around 1.5 times as large as for the corresponding ILP32 system (assuming the run fits both modes). This is due to the expanded size of managed pointers. Memory is pretty cheap, but these days bandwidth and cache is in short supply, so significantly increasing the size of the heap just to get over the 4Gb limit is painful.

在 LP64 系统上，机器字长——也就是 oop 的长度——需要 64 位；而在 ILP32 系统上，oop 只有 32 位。但 ILP32 系统的最大堆大小略小于 4Gb，对许多应用来说不够用。而在 LP64 系统上，同一次运行的堆大小可能要达到相应 ILP32 系统的 1.5 倍左右（假设这次运行在两种模式下都能进行）。这是由受管指针变大造成的。内存虽然便宜，但如今带宽和缓存都很紧缺，仅仅为了突破 4Gb 的限制就大幅增加堆的大小，是很痛苦的。

(Additionally, on x86 chips, the ILP32 mode provides half the usable registers that the LP64 mode does. SPARC is not affected this way; RISC chips start out with lots of registers and just widen them for LP64 mode.)

（此外，在 x86 芯片上，ILP32 模式可用的寄存器数量只有 LP64 模式的一半。SPARC 不受这种影响; RISC 芯片本来就有很多寄存器，在 LP64 模式下只需将其加宽即可。）

Compressed oops represent managed pointers (in many but not all places in the JVM) as 32-bit values which must be scaled by a factor of 8 and added to a 64-bit base address to find the object they refer to. This allows applications to address up to four billion *objects* (not bytes), or a heap size of up to about 32Gb. At the same time, data structure compactness is competitive with ILP32 mode.

压缩指针（compressed oops）在 JVM 的许多（但不是全部）地方把受管指针表示为 32 位的值，需要乘以 8 再加上一个 64 位基地址，才能找到它所引用的对象。这样应用程序最多可以寻址 40 亿个*对象*（而不是字节），或者说堆大小最大可达约 32Gb。同时，数据结构的紧凑程度可以与 ILP32 模式相媲美。

We use the term *decode* to express the operation by which a 32-bit compressed oop is converted into a 64-bit native address into the managed heap. The inverse operation is *encoding*.

我们用*解码（decode）*一词表示把 32 位压缩 oop 转换为指向受管堆的 64 位本地地址的操作。相反的操作则是*编码（encode）*。

#### Which oops are compressed?

#### 哪些 oop 会被压缩?

In an ILP32-mode JVM, or if the UseCompressedOops flag is turned off in LP64 mode, all oops are the native machine word size.

在 ILP32 模式的 JVM 中，或者在 LP64 模式下关闭 UseCompressedOops 开关时，所有 oop 的大小都与本地机器字相同。

If UseCompressedOops is true, the following oops in the heap will be compressed:

如果 UseCompressedOops 为 true，堆中以下 oop 会被压缩:

- the klass field of every object
- every oop instance field
- every element of an oop array (objArray)

- 每个对象的 klass 字段
- 每个oop类型的实例字段
- oop 数组（objArray）的每个元素

The Hotspot VM's data structures to manage Java classes are not compressed. These are generally found in the section of the Java heap known as the Permanent Generation (PermGen).

HotSpot VM 用于管理 Java 类的数据结构不会被压缩。它们通常位于 Java 堆中被称为永久代（Permanent Generation，PermGen）的区域。

In the interpreter, oops are never compressed. These include JVM locals and stack elements, outgoing call arguments, and return values. The interpreter eagerly decodes oops loaded from the heap, and encodes them before storing them to the heap.

在解释器中，oop 从不压缩。这包括 JVM 局部变量和栈元素、传出的调用参数以及返回值。解释器会立即解码从堆中加载的 oop，并在存回堆之前先对它们编码。

Likewise, method calling sequences, either interpreted or compiled, do not use compressed oops.

同样，方法调用序列（无论是解释执行还是编译执行）也不使用压缩指针。

In compiled code, oops are compressed or not according to the outcome of various optimizations. Optimized code may succeed in moving a compressed oop from one location in the managed heap to another without ever decoding it. Likewise, if the chip (i.e., x86) supports addressing modes which can be used for the decode operation, compressed oops might not be decoded even if they are used to address object fields or array elements.

在编译后的代码中，oop 是否压缩取决于各种优化的结果。优化后的代码可能成功地把压缩 oop 从受管堆中的一个位置移动到另一个位置，而全程不解码。同样，如果芯片（例如 x86）支持可用于解码操作的寻址模式，那么即使压缩 oop 被用来访问对象字段或数组元素，也可能不会被解码。

Therefore, the following structures in compiled code can refer to either compressed oops or native heap addresses:

因此，编译后代码中的以下结构既可能引用压缩 oop，也可能引用本地堆地址:

- register or spill slot contents
- oop maps (GC maps)
- debugging information (linked to oop maps)
- oops embedded directly in machine code (on non-RISC chips like x86 which allow this)
- nmethod constant section entries (including those used by relocations affecting machine code)

- 寄存器或溢出槽（spill slot）的内容
- oop 映射表（GC 映射表）
- 调试信息（与 oop 映射表关联）
- 直接嵌入机器代码的 oop（在 x86 这类允许这样做的非 RISC 芯片上）
- nmethod 常量区条目（包括影响机器代码的重定位所使用的条目）

In the C++ code of the HotSpot JVM, the distinction between compressed and native oops is reflected in the C++ static type system. In general, oops are often uncompressed. In particular C++ member functions operate as usual on receivers (*this*) represented by native machine words. A few functions in the JVM are overloaded to handle either compressed or native oops.

在 HotSpot JVM 的 C++ 代码中，压缩 oop 与本地 oop 的区别体现在 C++ 静态类型系统上。一般来说，oop 通常是不压缩的。特别地，C++ 成员函数照常操作由本地机器字表示的接收者（*this*）。JVM 中有少数函数被重载，以同时处理压缩 oop 和本地 oop。

Important C++ values which are never compressed:

从不压缩的重要 C++ 值:

- C++ object pointers (*this*)
- handles to managed pointers (type Handle, etc.)
- JNI handles (type jobject)

- C++ 对象指针（*this*）
- 指向受管指针的句柄（Handle 类型等）
- JNI 句柄（jobject 类型）

The C++ code has a type called narrowOop to mark places where compressed oops are being manipulated (usually, loaded or stored).

C++ 代码中有一个名为 narrowOop 的类型，用来标记操作压缩 oop 的位置（通常是加载或存储）。

#### Using addressing modes for decompression

#### 利用寻址模式进行解码

Here is an example of an x86 instruction sequence that uses compressed oops:

下面是一段使用压缩 oop 的 x86 指令序列示例:

```
! int R8; oop[] R9;  // R9 is 64 bits
! oop R10 = R9[R8];  // R10 is 32 bits
! load compressed ptr from wide base ptr:
movl R10, [R9 + R8<<3 + 16]
! klassOop R11 = R10._klass;  // R11 is 32 bits
! void* const R12 = GetHeapBase();
! load compressed klass ptr from compressed base ptr:
movl R11, [R12 + R10<<3 + 8]
```

Here is an example of a sparc instruction sequence which decodes a compressed oop (which might be null):

下面是一段 sparc 指令序列示例，用于解码压缩 oop（该 oop 可能为 null）:

```
! java.lang.Thread::getThreadGroup@1 (line 1072)
! L1 = L7.group
ld  [ %l7 + 0x44 ], %l1
! L3 = decode(L1)
cmp  %l1, 0
sllx  %l1, 3, %l3
brnz,a   %l3, .+8
add  %l3, %g6, %l3  ! %g6 is constant heap base
```

(Annotated output is from the [disassembly plugin](https://wiki.openjdk.java.net/display/HotSpot/PrintAssembly).)

（带注释的输出来自[反汇编插件](https://wiki.openjdk.java.net/display/HotSpot/PrintAssembly)。）

#### Null processing

#### 空值处理

A 32-bit zero value decodes into a 64-bit native null value. This requires an awkward special path in the decoding logic, to the point where it is profitable to statically note which compressed oops (like klass fields) are guaranteed never to be null, and use a simpler version of the full decode or encode operation.

32 位的零值解码后会得到 64 位的本地空值。这需要在解码逻辑中安排一条别扭的特殊路径，以至于值得在静态阶段标注出哪些压缩 oop（比如 klass 字段）保证永远不为空，并对它们使用完整解码或编码操作的简化版本。

Implicit null checks are crucial to JVM performance, in both interpreted and compiled bytecodes. A memory reference which uses a short-enough offset on a base pointer is sure to provoke a trap or signal of some sort if the base pointer is null, because the first page or so of virtual address space is not mapped.

隐式空值检查对 JVM 性能至关重要，在解释执行和编译后的字节码中都是如此。如果基指针为 null，那么在基指针上使用足够小偏移量的内存引用必然会触发某种陷阱（trap）或信号，因为虚拟地址空间的第一页左右是没有映射的。

We can sometimes use a similar trick with compressed oops, by unmapping the first page or so of the virtual addresses used by the managed heap. The idea is that, if a compressed null is ever decoded (by shifting and adding to the heap base), it can be used for a load or store operation, and the code still enjoys an implicit null check.

对压缩 oop 有时也可以使用类似的技巧: 把受管堆所使用虚拟地址的第一页左右设为不映射。其思想是，即使压缩空值被解码（通过移位并加上堆基地址），它也可以用于加载或存储操作，而代码依然享有隐式空值检查。

#### Object header layout

#### 对象头布局

An object header consists of a native-sized mark word, a klass word, a 32-bit length word (if the object is an array), a 32-bit gap (if required by alignment rules), and then zero or more instance fields, array elements, or metadata fields. (Interesting Trivia: Klass metaobjects contain a C++ vtable immediately after the klass word.)

对象头由一个本地大小的 mark word、一个 klass word、一个 32 位的长度字（如果对象是数组）、一个 32 位的空隙（如果对齐规则要求），以及零个或多个实例字段、数组元素或元数据字段组成。（有趣的小知识: Klass 元对象中，klass word 后面紧跟着一个 C++ vtable。）

The gap field, if it exists, is often available to store instance fields.

空隙字段如果存在，通常可以用来存放实例字段。

If UseCompressedOops is false (and always on ILP32 systems), the mark and klass are both native machine words. For arrays, the gap is always present on LP64 systems, and only on arrays with 64-bit elements on ILP32 systems.

如果 UseCompressedOops 为 false（ILP32 系统上则总是如此），mark 和 klass 都是本地机器字。对于数组，LP64 系统上空隙总是存在; 而 ILP32 系统上只有元素为 64 位的数组才有空隙。

If UseCompressedOops is true, the klass is 32 bits. Non-arrays have a gap field immediately after the klass, while arrays store the length field immediately after the klass.

如果 UseCompressedOops 为 true，klass 为 32 位。非数组对象在 klass 后面紧跟着一个空隙字段，而数组则在 klass 后面紧接着存放长度字段。

#### Zero based compressed oops

#### 基于零地址的压缩指针

Compressed oops use an arbitrary address for the narrow oop base which is calculated as java heap base minus one (protected) page size for implicit NULL checks to work. This means a generic field reference is next:

压缩 oop 的 narrow oop 基地址使用任意地址，为了使隐式 NULL 检查生效，它按 Java 堆基地址减去一个（受保护的）页大小来计算。这意味着一次普通的字段引用是下面这样:

```
<narrow-oop-base> + (<narrow-oop> << 3) + <field-offset>.
```

If the narrow oop base can be made to be zero (the java heap doesn't actually have to start at offset zero), then a generic field reference can be just next:

如果能把 narrow oop 基地址变为零（Java 堆并不真的必须从偏移量零开始），那么普通的字段引用就可以简化为:

```
(<narrow-oop << 3) + <field-offset>
```

Theoretically it allows to save the heap base add (current Register Allocator does not allow to save register). Also with zero base the null check of compressed oop is not needed.
Current code for decoding compressed oops looks like this:

理论上这样可以省去堆基地址加法（但当前的寄存器分配器不允许保存寄存器）。而且基地址为零时，压缩 oop 也无需判空。
当前解码压缩 oop 的代码如下:

```
if (<narrow-oop> == NULL)
    <wide_oop> = NULL
else
    <wide_oop> = <narrow-oop-base> + (<narrow-oop> << 3)
```

With zero narrow oop base the code is much simpler. It needs only shift to decode/encode a compressed oop:

narrow oop 基地址为零时，代码要简单得多，解码/编码压缩 oop 只需移位:

```
<wide_oop> = <narrow-oop> << 3
```

Also if java heap size < 4Gb and it can be moved into low virtual address space (below 4Gb) then compressed oops can be used without encoding/decoding.

此外，如果 Java 堆大小小于 4Gb，并且可以移动到低位虚拟地址空间（4Gb 以下），那么压缩 oop 无需编码/解码就能直接使用。

Zero based implementation tries to allocated java heap using different strategies based on the heap size and a platform it runs on.
First, it tries to allocate java heap below 4Gb to use compressed oops without decoding if heap size < 4Gb.
If it fails or heap size > 4Gb it will try to allocate the heap below 32Gb to use zero based compressed oops.
If this also fails it will switch to regular compressed oops with narrow oop base.

基于零地址的实现会根据堆大小和运行平台，尝试用不同的策略分配 Java 堆。
首先，如果堆大小小于 4Gb，它会尝试把 Java 堆分配在 4Gb 以下，从而使用无需解码的压缩 oop。
如果失败或堆大小大于 4Gb，它会尝试把堆分配在 32Gb 以下，以使用基于零地址的压缩 oop。
如果这也失败，则退回使用带 narrow oop 基地址的普通压缩 oop。





# CompressedOops: Introduction to compressed references in Java

# CompressedOops: Java 压缩引用简介

In this article we are going to introduce you to one of the JVM optimizations known as Compressed oops. The idea of compressed oops is raised from the differences between 32bit and 64bit architecture. So we will have a very short review of 64bit architecture and then go deeper into the topic of compressed oops. At the end we will see it all in action with a simple example.

本文将介绍 JVM 的一种优化技术——Compressed oops（压缩指针）。压缩指针的想法源于 32 位与 64 位架构之间的差异。因此我们会先简要回顾一下 64 位架构，然后再深入探讨压缩指针这个主题。最后我们会通过一个简单的例子实际观察它的效果。

The example code for this article is rather simple, so we are not going to use any IDE. Compressed oops makes no sense on a 32bit machine. Also it is not activated by default in JDKs prior to 6u23. So we assume you are using a 64bit JDK newer than 6u23. The final tool we need is a memory analyzer tool. For this example we used industry standard Eclipse Memory Analyzer Tool version 1.5.

本文的示例代码非常简单，所以不打算使用任何 IDE。在 32 位机器上压缩指针没有意义; 而且在 6u23 之前的 JDK 中它默认也是不开启的。因此我们假设你使用的是比 6u23 更新的 64 位 JDK。最后还需要一个内存分析工具。本例使用的是业界标准的 Eclipse Memory Analyzer Tool 1.5 版。

## 1. 32bit vs. 64bit

## 1. 32 位与 64 位

32bit versus 64bit was all the rage in early 2000s. While 64bit CPU was nothing new in the world of supercomputers it was not until recently that personal computers brought it to the mainstream. Transition from 32bit architecture to 64bit is by no means an easy job, everything from hardware to operating system must change. Java embraced this transition with the introduction of 64bit virtual machine.

32 位与 64 位之争在 21 世纪初曾经风行一时。虽然 64 位 CPU 在超级计算机领域早已不是新鲜事物，但直到最近个人计算机才把它带入主流。从 32 位架构过渡到 64 位绝非易事，从硬件到操作系统的一切都必须改变。Java 通过引入 64 位虚拟机拥抱了这一转变。

The main advantage of this transition is memory capacity. In a 32bit system you have memory address width of 32 bits (hence the name) which means the total amount of addressable memory is 2^32 or 4 gigabyte of RAM. This might have been an infinite amount of memory for a personal computer in the past (after all who needs more than 640kB of RAM!) but not in the time that a smartphone with one gigabyte of memory is considered a low end product. 64bit architecture solved this limitation. In such a machine the theoretical amount of addressable memory is 2^64, a ridiculously huge number. Unfortunately it is just a theoretical cap, in the real world there are a lot of hardware and software factors that limit us to the much smaller memory. For example Windows 7 Ultimate supports only up to 192GB. Using the word only for 192 gigabytes seems a bit harsh but it pales in comparison to 2^64. Now that you see why 64bit matters let’s move to the next part and see how compressed oops are going to help us.

这一转变的主要优势是内存容量。32 位系统的内存地址宽度为 32 位（名字也由此而来），这意味着可寻址内存总量为 2^32，即 4GB 内存。对过去的个人计算机来说这也许是无限的内存（毕竟谁会需要超过 640kB 的内存呢!），但在智能手机配备 1GB 内存都被视为低端产品的时代，这就不够用了。64 位架构解决了这个限制。在这样的机器上，理论上可寻址内存为 2^64，一个天文数字。遗憾的是这只是理论上限，现实世界中有很多软硬件因素把可用内存限制在小得多的水平。例如 Windows 7 旗舰版最多只支持 192GB。用“只”字来形容 192GB 似乎有些苛刻，但与 2^64 相比确实不值一提。明白了 64 位为什么重要之后，让我们进入下一部分，看看压缩指针如何帮到我们。

## 2. Compressed oops in theory

## 2. 压缩指针的原理

“There is no such thing as free lunch”. The excessive amount of memory in 64bit machines comes with a price. Generally an application consumes more memory on a 64bit system, and in a non trivial application this amount is not negligible. Compressed oops help you reserve some memory by using 32bit class pointers in a 64bit environment, provided that your heap size is not going to be larger than 32GB. To see this in more detail lets see how an object is represented in Java.

“天下没有免费的午餐”。64 位机器上内存占用过多是有代价的。一般来说，应用在 64 位系统上会消耗更多内存，对一个不那么小的应用来说，这部分开销不可忽视。只要堆大小不超过 32GB，压缩指针就能通过在 64 位环境中使用 32 位类指针来帮你节省一些内存。要想了解得更详细，我们先看看 Java 中对象是如何表示的。

### 2.1. Object representation in Java

### 2.1. Java 中对象的表示

To see how objects are represented in Java we use a very simple example, an Integer object that holds a primitive int. When you write a simple line of code as below:

为了看清 Java 中对象的表示方式，我们使用一个非常简单的例子: 一个持有基本类型 int 的 Integer 对象。当你写下下面这行简单的代码时:

```
Integer i = ``new` `Integer(``23``);
```

The compiler allocates much more than 32 bits of heap to this object. ints are 32 bits long in java but every object has headers. The size of these headers differs in 32bit and 64bit and in different VMs. In a 32bit virtual machine each of these header fields are one word or 4 bytes. In a 64bit virtual machine the field that holds the int remains 32 bits but the size of the other fields doubles to 8 bytes (one word in 64bit environment). In fact the story doesn’t end here. Objects are word aligned which means in a 64bit machine the amount of memory they take must be divisible by 64. The main point of interest for us is the size of class pointer which is known as Klass in Hotspot VM parlance. As you can see in the image below the klass size is 8 bytes on a 64bit virtual machine but with compressed oops enabled it becomes 4 bytes.

编译器为这个对象分配的堆空间远不止 32 位。int 在 Java 中是 32 位，但每个对象都有对象头。对象头的大小在 32 位和 64 位虚拟机中各不相同，不同的 VM 之间也有差异。在 32 位虚拟机中，每个头字段是一个字，即 4 字节。在 64 位虚拟机中，存放 int 的字段仍是 32 位，但其他字段的大小翻倍为 8 字节（64 位环境下的一个字）。事实上事情还没完。对象是按字对齐的，也就是说在 64 位机器上，对象占用的内存必须能被 64 整除。我们最关心的是类指针的大小，在 Hotspot VM 的术语中它被称为 Klass。如下图所示，在 64 位虚拟机上 klass 大小为 8 字节，而启用压缩指针后就变成 4 字节。

[![Representation of an Integer object in different VMs](https://www.javacodegeeks.com/wp-content/uploads/2016/05/objectRepresntation_FINAL.jpg.webp)](https://www.javacodegeeks.com/wp-content/uploads/2016/05/objectRepresntation_FINAL.jpg)

Representation of an Integer object in different VMs

不同 VM 中 Integer 对象的表示

### 2.3. How compressed oops is implemented

### 2.3. 压缩指针是如何实现的

oop in compressed oops stands for ordinary object pointer. These object pointers (as we saw in previous section) are the same size as the native pointers of the machine. So oops size is 32 bits or 64 bits on a 32bit and 64bit machine respectively. With compressed oops we have 32 bits pointers on a 64bit machine.

压缩指针中的 oop 是 ordinary object pointer（普通对象指针）的缩写。这些对象指针（如上一节所见）与机器的本地指针大小相同。因此在 32 位和 64 位机器上，oop 分别是 32 位和 64 位。而使用压缩指针后，64 位机器上用的就是 32 位指针。

The trick behind compressed oops is the difference between byte addressing and word addressing of memory. With byte addressing you have access to every byte in memory but need a unique address for each byte as well. In a 32bit environment this limits you to 2^32 bytes of memory. In word addressing you still have the same amount of addressable memory blocks but this memory chunk is one word instead of one byte. In a 64bit machine a word is 8 bytes. This gives JVM three zero bits. Java takes advantage of these bits by shifting them to expand the addressable memory and implement compressed oops.

压缩指针背后的技巧在于内存按字节寻址与按字寻址的区别。按字节寻址时，你可以访问内存中的每个字节，但也要为每个字节提供唯一地址。在 32 位环境中，这限制了内存只有 2^32 字节。按字寻址时，可寻址的内存块数量相同，但每个内存块是一个字而不是一个字节。在 64 位机器上一个字是 8 字节，这就为 JVM 空出了三个零位。Java 利用这些零位进行移位来扩展可寻址内存，从而实现压缩指针。

## 3. Compressed oops in action

## 3. 压缩指针实战

To see the effect of compressed oops in action we use a simple application. This is a small java object that makes a linked list of 2 million integers.

为了观察压缩指针的实际效果，我们使用一个简单的应用程序。它是一个小的 Java 对象，用来构建一个包含 200 万个整数的链表。

To be able to see the heap condition we use Eclipse Memory Analyzer Tool. Since we are not using Eclipse IDE we use the stand alone application. You can download it from [here](https://eclipse.org/mat/downloads.php).

为了查看堆的情况，我们使用 Eclipse Memory Analyzer Tool。由于没有使用 Eclipse IDE，我们用的是独立版应用程序，可以从[这里](https://eclipse.org/mat/downloads.php)下载。

Since this example uses only one class we don’t use Eclipse or any other IDE. Use a text editor and make a file named IntegerApplication.java. Type the following code inside the file. Remember he name of the file should match the name of the java class. Instead of typing this by hand you can download the class file from the download section of this article.

由于本例只用到一个类，我们不需要 Eclipse 或其他 IDE。用文本编辑器创建一个名为 IntegerApplication.java 的文件，把下面的代码输入其中。记住文件名必须与 Java 类名一致。如果不想手动输入，也可以从本文的下载区获取类文件。

*IntegerApplication.java*

```
import` `java.util.LinkedList;``import` `java.util.List;``import` `java.util.Scanner;` `public` `class` `IntegerApplication {``  ``public` `static` `void` `main(String[] args) {``    ``List<Integer> intList = ``new` `LinkedList<>();``    ``for``(``int` `i=``0``;i<``2000000``;i++){``      ``Integer number = ``new` `Integer(``1``);``      ``intList.add(number);``    ``}``    ``Scanner scanner = ``new` `Scanner(System.in);``    ``System.out.println(``"application is running..."``);``    ``String tmp = scanner.nextLine();``    ``System.exit(``0``);``  ``}``}
```

Open a command prompt window and navigate to the directory of this file. Use the following command to compile it.

打开命令提示符窗口，进入该文件所在目录，使用以下命令进行编译。

```
javac IntegerApplication.java
```

Now you should have a IntegerApplication.class file. We run this file twice, once with compressed oops enabled and second time without compressed oops. Compressed oops is enabled by default in JVMs newer than 6u23 so you only need to run the application by typing this in command prompt:

现在你应该得到了一个 IntegerApplication.class 文件。我们将运行它两次: 一次启用压缩指针，一次禁用压缩指针。比 6u23 更新的 JVM 默认启用压缩指针，所以只需在命令提示符中输入以下命令来运行应用程序:

```
java IntegerApplication
```

You may have noticed the Scanner object in source code. It’s used to keep the application alive until you type something and terminate it. If you see the sentence “application is running…” in your command prompt it’s time to start memory analyzer. Depending on your machine it may take a while for it to do the initialization process.

你可能注意到了源代码中的 Scanner 对象。它是用来让应用保持运行，直到你输入内容并终止它。如果在命令提示符中看到“application is running...”这句话，就可以启动内存分析器了。根据机器情况，初始化过程可能需要一点时间。

From file menu select Acquire Heap Dump…

在文件菜单中选择 Acquire Heap Dump…（获取堆转储）

[![Process selection window](https://www.javacodegeeks.com/wp-content/uploads/2016/05/loadHeapDump_FINAL.jpg.webp)](https://www.javacodegeeks.com/wp-content/uploads/2016/05/loadHeapDump_FINAL.jpg)

Process selection window

进程选择窗口

you will see the process selection window. Select the process named IntegerApplication and click finish.

你会看到进程选择窗口。选择名为 IntegerApplication 的进程，然后点击 finish。

After a while you will be in the main screen of the MAT. From the toolbar select the histogram button as shown in the image:

稍等片刻后就会进入 MAT 的主界面。在工具栏中选择直方图（histogram）按钮，如图所示:

[![Select Histogram from toolbar](https://www.javacodegeeks.com/wp-content/uploads/2016/05/heapDumpMainScreen_FINAL.jpg.webp)](https://www.javacodegeeks.com/wp-content/uploads/2016/05/heapDumpMainScreen_FINAL.jpg)

Select Histogram from toolbar

在工具栏中选择 Histogram

Now you can see a detailed overview of all the objects in your application. This is the histogram of our simple application running with compressed oops enabled.

现在可以看到应用程序中所有对象的详细概览。这是我们的简单应用在启用压缩指针状态下运行的直方图。

[![Histogram of application with compressed oops enabled.](https://www.javacodegeeks.com/wp-content/uploads/2016/05/heapDumpCompressed_FINAL.jpg.webp)](https://www.javacodegeeks.com/wp-content/uploads/2016/05/heapDumpCompressed_FINAL.jpg)

Heap dump of application with compressed oops enabled.

启用压缩指针时应用程序的堆转储。

This time we run the application without compressed oops. In order to disable compressed oops we use -XX:-UseCompressedOops flag. You don’t need to recompile your class again just type the following command in your command prompt:

这次我们在禁用压缩指针的状态下运行应用程序。为了禁用压缩指针，我们使用 -XX:-UseCompressedOops 开关。不需要重新编译类，只需在命令提示符中输入以下命令:

```
java -XX:-UseCompressedOops IntegerApplication
```

Again when you see the “Application is running…” text acquire a heap dump same as before. This is the histogram of heap dump when application is running without compressed oops.

同样，看到“Application is running...”文本后，像之前一样获取堆转储。这是应用在禁用压缩指针状态下运行时的堆转储直方图。

[![Heap dump of application with compressed oops disabled](https://www.javacodegeeks.com/wp-content/uploads/2016/05/heapDumpNotCompressed_FINAL.jpg.webp)](https://www.javacodegeeks.com/wp-content/uploads/2016/05/heapDumpNotCompressed_FINAL.jpg)

Heap dump of application with compressed oops disabled

禁用压缩指针时应用程序的堆转储

As we expected the heap size increased. The majority of heap is occupied by two types of objects, linked list nodes and integers. There are more than 2 million integers that in the compressed oops version required 32 million bytes and in non compressed oops 48 million bytes. With a simple math we can see this exactly matches our predictions.

和预期一致，堆大小增加了。堆的绝大部分被两类对象占据: 链表节点和整数。有超过 200 万个整数，在压缩指针版本中需要 3200 万字节，而在非压缩指针版本中是 4800 万字节。简单计算一下就可以看出，这与我们的预测完全吻合。

2000000*(128/8) = 32000000 or 32 megabytes

2000000*(192/8) = 48000000 or 48 megabytes

If you notice in the second equation we have used 192 while in the above section the object size was mentioned as 160 bits. The reason is Java is byte addressed so the address is aligned to closest 8 bytes which is 192 bits in this case.

你可能注意到，第二个等式中用的是 192，而上一节提到的对象大小是 160 位。原因是 Java 按字节寻址，地址要对齐到最近的 8 字节，在这里就是 192 位。

## 4. Conclusion

## 4. 结语

The example provided here was contrived but this doesn’t mean it doesn’t hold true in real world applications. When tested with H2 database application compressed oops decreased heap size from 3.6 to 3.1 megabytes. This is almost 14% more efficient use of valuable heap space. As we saw there is no harm in using compressed oops and indeed most often than not you are not going to disable this feature. But knowing the details of the compiler tricks can help with writing codes with performance in mind.

这里的示例虽然是特意构造的，但这并不意味着它不适用于真实世界的应用。用 H2 数据库应用测试时，压缩指针把堆大小从 3.6MB 降到了 3.1MB，对宝贵堆空间的利用效率提高了将近 14%。正如我们所见，使用压缩指针没有任何坏处，事实上大多数情况下你也不会去禁用这个特性。但了解编译器这些技巧的细节，有助于写出关注性能的代码。




# 参考链接


- [CompressedOops](https://wiki.openjdk.java.net/display/HotSpot/CompressedOops)
- [CompressedOops: Introduction to compressed references in Java](https://www.javacodegeeks.com/2016/05/compressedoops-introduction-compressed-references-java.html)
- [ObjectHeader32-64](https://gist.github.com/arturmkrtchyan/43d6135e8a15798cc46c)
- [JVM篇之java内存模型](https://juejin.im/post/6844903902177918984)
- [JVM之压缩指针](https://juejin.im/post/6844903768077647880)
