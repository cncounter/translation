# ZGC实现原理与使用示例

Z垃圾收集器, 简称ZGC(全称为 Z Garbage Collector）, 是一款低延迟垃圾收集器, 代码开源, 由 Oracle 公司开发, 主要作者为 Per Liden。

从JDK11开始支持ZGC, 能适应各种大小的堆内存, 伸缩性良好, 性能优异, 在各种环境下都能良好运行。

## 1. ZGC简介

ZGC 有点类似于 Azul 公司开发的C4垃圾收集器(C4, Continuously Concurrent Compacting Collector), 主要目标是大幅度降低GC暂停时间。 同时也支持堆内存碎片整理, 堆内存整理(compacting the heap)的本质, 就是将零散的存活对象移动到一起。 
传统的垃圾收集器在进行堆内存整理时, 需要将整个JVM中的业务线程全部暂停, 也就会造成 STW 停顿(stopping the world)。 
在 GC 相关的论文中，将业务线程称为 mutator, 简单理解就是修改者, 因为这些应用程序线程会改变堆内存中的值。 如果堆内存中的存活对象较多，STW停顿可能持续好几秒, 对于交互式系统而言, 这么长的卡顿时间简直就是个灾难。

随着GC理论和发展, 实践出了一些可以减少暂停时间的方法:

- 并行执行: 可以使用多个线程并行整理内存(parallel), G1在整理阶段主要用的就是这种方案。
- 增量执行: 将内存整理工作, 拆分为多次执行, 这样每次暂停的时间就缩短了。
- 并发执行: 让内存整理工作与业务线程并发执行, 这样就不需要STW停顿,或者只需要很短时间的STW。
- 不执行整理: 例如 Go 运行时的 GC就采用这种方法。


ZGC的内存整理技术, 采用并发执行方案, 极大幅度降低了GC暂停时间。 当然, 这种技术实现起来并不简单, 所以需要一些笔墨来介绍其实现原理, 以及为什么实现起来会很复杂。

- 内存整理时, 需要将一个对象复制到另一个内存地址, 这个过程中, 其他线程有可能会通过老的地址来读取或修改这个对象。
- 复制成功之后, 在堆内存中, 可能还有很多的引用, 指向了老的地址, 那么需要将这些引用更新为新地址。

顺便提一句, 虽然并发整理技术是目前市面上最好的降低暂停时间的解决方案, 但我们也不能一股脑的上。 如果我们的应用不是特别在意暂停时间, 比如大部分的批处理系统, 某些Kafka消费端系统等等, 那么可以选择吞吐量更好的GC算法。


### 1.1 ZGC的设计目标


ZGC致力于解决前代GC的问题, 设计目标包括:

- 支持大内存: TB级别的堆内存, 适用的堆内存大小范围, 涵盖 `8MB ~ 16TB`, 其中JDK11版本最大支持`4TB`。
- 极致低延迟: 降低最大GC暂停时间至10ms以内, 理想情况在亚毫秒级(Sub-millisecond)
- 可扩缩性(Scalable): 停顿时间与内存配置无关, 与堆内存大小, 存活对象(live-set)数量 都没有直接关系, 但是GC根(root-set)对象的数量还是有一定影响。
- 方便调优: 增加了很多灵活的调优控制参数。
- 兼顾吐吞量: 大部分应用场景下, 极端情况只降低 15% 以内的吞吐量, 换句话说就是GC损耗最多只占用15%的CPU资源。


JDK11文档中对ZGC的介绍是这样写的:

> ZGC是一款可扩展性非常好的低延迟垃圾收集器, 全称为 Z Garbage Collector, 我们也可以称之为 "Z垃圾收集器"。 ZGC将所有繁重的垃圾收集任务采用并发方式来执行, 应用程序线程暂停执行的时间不超过`10`毫秒, 这使得它适用于需要低延迟和/或庞大堆内存的系统(`TB`级别)。


JDK18版本的ZGC介绍文档是这样写的:

> ZGC是一款可扩展性非常好的低延迟垃圾收集器, 全称为 Z Garbage Collector, 我们也可以称之为 "Z垃圾收集器"。 ZGC将所有繁重的垃圾收集任务采用并发方式来执行, 应用程序线程暂停执行的时间不超过`几`毫秒, 这使得它适用于需要低延迟的系统。其暂停时间, 与使用的堆内存大小无关。 ZGC 支持从 `8MB` 到 `16TB` 范围的堆内存大小。

翻看 OpenJDK 的代码, 后期如果需要更大的堆内存, 也是很容易实现的, 具体的原理会在着色指针部分进行介绍。



## ZGC使用示例



### 常用配置

> 11

The Z Garbage Collector is available as an experimental feature, and is enabled with the command-line options `-XX:+UnlockExperimentalVMOptions -XX:+UseZGC`.

> 18:

The Z Garbage Collector is enabled with the command-line option `-XX:+UseZGC`.


> 11


### Setting the Heap Size

The most important tuning option for ZGC is setting the max heap size (`-Xmx`). Since ZGC is a concurrent collector a max heap size must be selected such that, 1) the heap can accommodate the live-set of your application, and 2) there is enough headroom in the heap to allow allocations to be serviced while the GC is running. How much headroom is needed very much depends on the allocation rate and the live-set size of the application. In general, the more memory you give to ZGC the better. But at the same time, wasting memory is undesirable, so it’s all about finding a balance between memory usage and how often the GC needs to run.


> 18:

### Setting the Heap Size

The most important tuning option for ZGC is setting the max heap size (`-Xmx`). Since ZGC is a concurrent collector a max heap size must be selected such that, 1) the heap can accommodate the live-set of your application, and 2) there is enough headroom in the heap to allow allocations to be serviced while the GC is running. How much headroom is needed very much depends on the allocation rate and the live-set size of the application. In general, the more memory you give to ZGC the better. But at the same time, wasting memory is undesirable, so it’s all about finding a balance between memory usage and how often the GC needs to run.


> 11

### Setting Number of Concurrent GC Threads

The second tuning option one might want to look at is setting the number of concurrent GC threads (`-XX:ConcGCThreads`). ZGC has heuristics to automatically select this number. This heuristic usually works well but depending on the characteristics of the application this might need to be adjusted. This option essentially dictates how much CPU-time the GC should be given. Give it too much and the GC will steal too much CPU-time from the application. Give it too little, and the application might allocate garbage faster than the GC can collect it.

> 18:

### Setting Number of Concurrent GC Threads

The second tuning option one might want to look at is setting the number of concurrent GC threads (`-XX:ConcGCThreads`). ZGC has heuristics to automatically select this number. This heuristic usually works well but depending on the characteristics of the application this might need to be adjusted. This option essentially dictates how much CPU-time the GC should be given. Give it too much and the GC will steal too much CPU-time from the application. Give it too little, and the application might allocate garbage faster than the GC can collect it.



> 18:

### Returning Unused Memory to the Operating System

By default, ZGC uncommits unused memory, returning it to the operating system. This is useful for applications and environments where memory footprint is a concern. This feature can be disabled using `-XX:-ZUncommit`. Furthermore, memory will not be uncommitted so that the heap size shrinks below the minimum heap size (`-Xms`). This means this feature will be implicitly disabled if the minimum heap size (`-Xms`) is configured to be equal to the maximum heap size (`-Xmx`).

An uncommit delay can be configured using `-XX:ZUncommitDelay=<seconds>` (default is 300 seconds). This delay specifies for how long memory should have been unused before it's eligible for uncommit.





## ZGC实现原理





ZGC的基本特征:

- Concurrent
- Tracing
- Compacting
- Single generation
- Region-based
- NUMA-aware
- Load barriers
- Colored pointers

### GC Cycle 示意图



#### Mark

- Concurrent & Parallel

- Load barrier: Detects loads of non-marked object pointers

- Striped
  – Heap divided into logical stripes
  – Isolate each GC thread to work on its own stripe
  – Minimized shared state


Pause Mark Start 示意图

Concurrent Mark 示意图

Pause Mark End 示意图

#### Relocation

* Concurrent & Parallel
* Load barrier
  – Detects loads of object pointers pointing into the relocation set
  – Java threads help out with relocation if needed

* Off-heap forwarding tables
  – No forwarding information stored in old copies of objects
  – Important for immediate reuse of heap memory


#### Marking & Relocating objects

A collection is split into two major phases: marking & relocating. (Actually there are more than those two phases but see the source for more details).

A GC cycle starts with the marking phase, which marks all reachable objects. At the end of this phase we know which objects are still alive and which are garbage. ZGC stores this information in the so called live map for each page. A live map is a bitmap that stores whether the object at the given index is strongly-reachable and/or final-reachable (for objects with a finalize-method).

During the marking-phase the load-barrier in application-threads pushes unmarked references into a thread-local marking buffer. As soon as this buffer is full, the GC threads can take ownership of this buffer and recursively traverse all reachable objects from this buffer. Marking in an application thread just pushes the reference into a buffer, the GC threads are responsible for walking the object graph and updating the live map.

After marking ZGC needs to relocate all live objects in the relocation set. The relocation set is a set of pages, that were chosen to be evacuated based on some criteria after marking (e.g. those page with the most amount of garbage). An object is either relocated by a GC thread or an application thread (again through the load-barrier). ZGC allocates a forwarding table for each page in the relocation set. The forwarding table is basically a hash map that stores the address an object has been relocated to (if the object has already been relocated).


标记和重新定位对象
一个集合分为两个主要阶段：标记和重新定位。 （实际上不止这两个阶段，但请参阅源代码以获取更多详细信息）。

一个 GC 周期从标记阶段开始，该阶段标记所有可到达的对象。在这个阶段结束时，我们知道哪些对象还活着，哪些是垃圾。 ZGC 将此信息存储在每个页面的所谓实时地图中。实时地图是一个位图，用于存储给定索引处的对象是否是强可达和/或最终可达（对于具有终结方法的对象）。

在标记阶段，应用程序线程中的负载屏障将未标记的引用推送到线程本地标记缓冲区中。一旦此缓冲区已满，GC 线程就可以获取此缓冲区的所有权并递归遍历此缓冲区中的所有可访问对象。在应用程序线程中标记只是将引用推入缓冲区，GC 线程负责遍历对象图并更新实时地图。

标记后 ZGC 需要重新定位重定位集中的所有活动对象。重定位集是一组页面，根据标记后的某些标准（例如垃圾数量最多的页面）选择要撤离的页面。对象要么由 GC 线程重定位，要么由应用程序线程重定位（再次通过负载屏障）。 ZGC 为重定位集中的每个页面分配一个转发表。转发表基本上是一个哈希映射，用于存储对象已重定位到的地址（如果对象已被重定位）。


The advantage with ZGC’s approach is that we only need to allocate space for the forwarding pointer for pages in the relocation set. Shenandoah in comparison stores the forwarding pointer in the object itself for each and every object, which has some memory overhead.

The GC threads walk over the live objects in the relocation set and relocate all those objects that haven’t been relocated yet. It could even happen that an application thread and a GC thread try to relocate the same object at the same time, in this case the first thread to relocate the object wins. ZGC uses an atomic CAS-operation to determine a winner.

While not marking the load-barrier relocates or remaps all references loaded from the heap. That ensure that every new reference the mutator sees, already points to the newest copy of an object. Remapping an object means looking up the new object address in the forwarding table.

The relocation phase is finished as soon as the GC threads are finished walking the relocation set. Although that means all objects have been relocated, there will generally still be references into the relocation set, that need to be remapped to their new addresses. These reference will then be healed by trapping load-barriers or if this doesn’t happen soon enough by the next marking cycle. That means marking also needs to inspect the forward table to remap (but not relocate - all objects are guaranteed to be relocated) objects to their new addresses.

This also explains why there are two marking bits (marked0 and marked1) in an object reference. The marking phase alternates between the marked0 and marked1 bit. After the relocation phase there may still be references that haven’t been remapped and thus have still the bit from the last marking cycle set. If the new marking phase would use the same marking bit, the load-barrier would detect this reference as already marked.

ZGC 方法的优点是我们只需要为重定位集中的页面的转发指针分配空间。相比之下，Shenandoah 将转发指针存储在每个对象的对象本身中，这有一些内存开销。

GC 线程遍历重定位集中的活动对象并重定位所有尚未重定位的对象。甚至可能发生应用程序线程和 GC 线程同时尝试重定位同一个对象，在这种情况下，第一个重定位对象的线程获胜。 ZGC 使用原子 CAS 操作来确定获胜者。

虽然不标记负载屏障，但会重新定位或重新映射从堆加载的所有引用。这确保 mutator 看到的每个新引用都已经指向对象的最新副本。重新映射一个对象意味着在转发表中查找新的对象地址。

一旦 GC 线程完成对重定位集的遍历，重定位阶段就结束了。尽管这意味着所有对象都已重定位，但通常仍会有对重定位集的引用，需要重新映射到它们的新地址。然后，这些参考将通过捕获负载障碍或者如果在下一个标记周期没有足够快地发生，将被修复。这意味着标记还需要检查转发表以将对象重新映射（但不是重新定位 - 所有对象都保证被重新定位）到它们的新地址。

这也解释了为什么一个对象引用中有两个标记位（marked0 和marked1）。标记阶段在marked0 和marked1 位之间交替。在重定位阶段之后，可能仍然存在尚未重新映射的引用，因此仍然具有上一个标记循环设置的位。如果新的标记阶段将使用相同的标记位，负载屏障将检测此引用作为已标记。





### Colored Pointers

Reference coloring
The key to understanding ZGC is reference coloring. ZGC stores additional metadata in heap references. On x64 a reference is 64-bit wide (ZGC doesn’t support compressed oops or class pointers at the moment), but today’s hardware actually limits a reference to 48-bit for virtual memory addresses. Although to be exact only 47-bit, since bit 47 determines the value of bits 48-63 (for our purpose those bits are always 0).

ZGC reserves the first 42-bits for the actual address of the object (referenced to as offset in the source code). 42-bit addresses give you a theoretical heap limitation of 4TB in ZGC. The remaining bits are used for these flags: finalizable, remapped, marked1 and marked0 (one bit is reserved for future use). There is a really nice ASCII drawing in ZGC’s source that shows all these bits:

参考着色
理解 ZGC 的关键是参考着色。 ZGC将其他元数据存储在堆参考中。 在 x64 上，引用是 64 位宽的（ZGC 目前不支持压缩 oop 或类指针），但今天的硬件实际上将虚拟内存地址的引用限制为 48 位。 尽管完全只有47位，但由于BIT 47确定位48-63的值（为了我们的目的，这些位总是0）。

ZGC保留对象的实际地址的前42位（在源代码中称为偏移）。 42 位地址在 ZGC 中为您提供了 4TB 的理论堆限制。 其余位用于这些标志：finalizable、remapped、marked1 和marked0（保留一位以供将来使用）。 ZGC的来源中有一幅非常不错的ASCII绘图，显示了所有这些位：

```
 6                 4 4 4  4 4                                             0
 3                 7 6 5  2 1                                             0
+-------------------+-+----+-----------------------------------------------+
|00000000 00000000 0|0|1111|11 11111111 11111111 11111111 11111111 11111111|
+-------------------+-+----+-----------------------------------------------+
|                   | |    |
|                   | |    * 41-0 Object Offset (42-bits, 4TB address space)
|                   | |
|                   | * 45-42 Metadata Bits (4-bits)  0001 = Marked0
|                   |                                 0010 = Marked1
|                   |                                 0100 = Remapped
|                   |                                 1000 = Finalizable
|                   |
|                   * 46-46 Unused (1-bit, always zero)
|
* 63-47 Fixed (17-bits, always zero)
```

> 42位地址=4TB; 44位=16TB;


Having metadata information in heap references does make dereferencing more expensive, since the address needs to be masked to get the real address (without metainformation). ZGC employs a nice trick to avoid this: When reading from memory exactly one bit of marked0, marked1 or remapped is set. When allocating a page at offset x, ZGC maps the same page to 3 different address:

for marked0: (0b0001 << 42) | x
for marked1: (0b0010 << 42) | x
for remapped: (0b0100 << 42) | x
ZGC therefore just reserves 16TB of address space (but not actually uses all of this memory) starting at address 4TB. Here is another nice drawing from ZGC’s source:

在堆引用中包含元数据信息确实会使取消引用更加昂贵，因为需要屏蔽地址才能获得真实地址（没有元信息）。 ZGC 使用了一个很好的技巧来避免这种情况：当从内存中读取一个位的标记0、标记1 或重新映射时，它会被设置。 当在偏移 x 处分配页面时，ZGC 将同一页面映射到 3 个不同的地址：

对于标记0：（0b0001 << 42）| X
对于标记1：（0b0010 << 42）| X
重新映射：(0b0100 << 42) | X
因此，ZGC 仅保留从地址 4TB 开始的 16TB 地址空间（但实际上并未使用所有这些内存）。 这是 ZGC 来源的另一幅精美图：

```
 +--------------------------------+ 0x0000140000000000 (20TB)
  |         Remapped View          |
  +--------------------------------+ 0x0000100000000000 (16TB)
  |     (Reserved, but unused)     |
  +--------------------------------+ 0x00000c0000000000 (12TB)
  |         Marked1 View           |
  +--------------------------------+ 0x0000080000000000 (8TB)
  |         Marked0 View           |
  +--------------------------------+ 0x0000040000000000 (4TB)
```

At any point of time only one of these 3 views is in use. So for debugging the unused views can be unmapped to better verify correctness.

在任何时间点，只有这 3 个视图中的一个在使用中。 因此，为了调试未使用的视图，可以取消映射以更好地验证正确性。



### Load Barrier

GC barriers

The key to understanding how ZGC does concurrent compaction is the load barrier (often called read barrier in GC literature). Although I have an own section about ZGC’s load-barrier, I want to give a short overview since not all readers might be familiar with them. If a GC has load-barriers, the GC needs to do some additional action when reading a reference from the heap. Basically in Java this happens every time you see some code like obj.field. A GC could also need a write/store-barrier for operations like obj.field = value. Both operations are special since they read from or write into the heap. The names are a bit confusing, but GC barriers are different from memory barriers used in CPUs or compilers.

气相色谱障碍

理解 ZGC 如何进行并发压缩的关键是负载屏障（在 GC 文献中通常称为读取屏障）。尽管我有一个关于 ZGC 的负载屏障的部分，但我想给出一个简短的概述，因为并非所有读者都熟悉它们。如果 GC 具有负载障碍，则 GC 在从堆中读取引用时需要执行一些额外的操作。基本上在 Java 中，每次你看到像 obj.field 这样的代码时都会发生这种情况。 GC 还可能需要一个写入/存储屏障来执行 obj.field = value 之类的操作。这两个操作都很特殊，因为它们从堆中读取或写入。名称有点混乱，但 GC 屏障与 CPU 或编译器中使用的内存屏障不同。


Both reading and writing in the heap is extremely common, so both GC-barriers need to be super efficient. That means just a few assembly instructions in the common case. Read barriers are an order of magnitude more likely than write-barriers (although this can certainly vary depending on the application), so read-barriers are even more performance-sensitive. Generational GC’s for example usually get by with just a write barrier, no read barrier needed. ZGC needs a read barrier but no write barrier. For concurrent compaction I haven’t seen a solution without read barriers.

Another factor to consider: Even if a GC needs some type of barrier, they might “only” be required when reading or writing references in the heap. Reading or writing primitives like int or double might not require the barrier.

在堆中读取和写入都非常普遍，因此两个 GC 屏障都需要非常高效。这意味着在常见情况下只有一些汇编指令。读屏障的可能性比写屏障高一个数量级（尽管这肯定会因应用程序而异），因此读屏障对性能更加敏感。例如，分代 GC 通常只需要一个写屏障，不需要读屏障。 ZGC 需要读屏障，但不需要写屏障。对于并发压缩，我还没有看到没有读取障碍的解决方案。

另一个需要考虑的因素：即使 GC 需要某种类型的屏障，它们可能“仅”在读取或写入堆中的引用时才需要。读取或写入 int 或 double 等原语可能不需要屏障。


- A small piece of code injected by the JIT in strategic places: When loading an object reference from the heap

- Checks if the loaded object reference has a bad color: If so, take action and heal it


加载堆内存中的对象属性:

```java
String personName = person.name;      // Loading an object reference from heap
<load barrier needed here>
int nameLenth = personName.length();  //No barrier, not a load from heap
int personAge = person.age;           // No barrier, not an object reference
```

判断:

barrier: // Bad color? jnz slow_path // Yes -> Enter slow path and mark/relocate/remap, adjust 0x10(%rax) and %rbx

~4% execution overhead o


Load-Barrier

ZGC needs a so called load-barrier (also referred to as read-barrier) when reading a reference from the heap. We need to insert this load-barrier each time the Java program accesses a field of object type, e.g. obj.field. Accessing fields of some other primitive type do not need a barrier, e.g. obj.anInt or obj.anDouble. ZGC doesn’t need store/write-barriers for obj.field = someValue.

Depending on the stage the GC is currently in (stored in the global variable ZGlobalPhase), the barrier either marks the object or relocates it if the reference isn’t already marked or remapped.

The global variables ZAddressGoodMask and ZAddressBadMask store the mask that determines if a reference is already considered good (that means already marked or remapped/relocated) or if there is still some action necessary. These variables are only changed at the start of marking- and relocation-phase and both at the same time. This table from ZGC’s source gives a nice overview in which state these masks can be:

负载屏障
ZGC 在从堆中读取引用时需要一个所谓的负载屏障（也称为读屏障）。每次 Java 程序访问对象类型的字段时，我们都需要插入这个负载屏障，例如对象字段。访问一些其他原始类型的字段不需要屏障，例如obj.anInt 或 obj.anDouble。 ZGC 不需要 obj.field = someValue 的存储/写入屏障。

根据 GC 当前所处的阶段（存储在全局变量 ZGlobalPhase 中），屏障要么标记对象，要么在引用尚未标记或重新映射时重新定位它。

全局变量 ZAddressGoodMask 和 ZAddressBadMask 存储掩码，用于确定引用是否已经被认为是好的（这意味着已经标记或重新映射/重新定位）或者是否仍然需要一些操作。这些变量仅在标记和重定位阶段开始时更改，并且两者同时更改。这张来自 ZGC 来源的表格很好地概述了这些掩码的状态：

```
               GoodMask         BadMask          WeakGoodMask     WeakBadMask
               --------------------------------------------------------------
Marked0        001              110              101              010
Marked1        010              101              110              001
Remapped       100              011              100              011
```

Assembly code for the barrier can be seen in the MacroAssembler for x64, I will only show some pseudo assembly code for this barrier:

屏障的汇编代码可以在 x64 的 MacroAssembler 中看到，我将只展示这个屏障的一些伪汇编代码：

```
mov rax, [r10 + some_field_offset]
test rax, [address of ZAddressBadMask]
jnz load_barrier_mark_or_relocate

# otherwise reference in rax is considered good
```

The first assembly instruction reads a reference from the heap: r10 stores the object reference and some_field_offset is some constant field offset. The loaded reference is stored in the rax register. This reference is then tested (this is just an bitwise-and) against the current bad mask. Synchronization isn’t necessary here since ZAddressBadMask only gets updated when the world is stopped. If the result is non-zero, we need to execute the barrier. The barrier needs to either mark or relocate the object depending on which GC phase we are currently in. After this action it needs to update the reference stored in r10 + some_field_offset with the good reference. This is necessary such that subsequent loads from this field return a good reference. Since we might need to update the reference-address, we need to use two registers r10 and rax for the loaded reference and the objects address. The good reference also needs to be stored into register rax, such that execution can continue just as when we would have loaded a good reference.

Since every single reference needs to be marked or relocated, throughput is likely to decrease right after starting a marking- or relocation-phase. This should get better quite fast when most references are healed.

第一条汇编指令从堆中读取一个引用：r10 存储对象引用，而 some_field_offset 是一些常量字段偏移量。加载的引用存储在 rax 寄存器中。然后针对当前的错误掩码测试此引用（这只是按位与）。这里不需要同步，因为 ZAddressBadMask 只有在世界停止时才会更新。如果结果非零，我们需要执行屏障。屏障需要根据我们当前所处的 GC 阶段标记或重新定位对象。在此操作之后，它需要使用良好引用更新存储在 r10 + some_field_offset 中的引用。这是必要的，以便从此字段的后续加载返回一个很好的参考。由于我们可能需要更新引用地址，我们需要使用两个寄存器 r10 和 rax 来存储加载的引用和对象地址。好的引用也需要存储到寄存器 rax 中，这样就可以继续执行，就像我们加载好的引用一样。

由于每个引用都需要标记或重新定位，因此在开始标记或重新定位阶段后吞吐量可能会立即降低。当大多数参考都被治愈时，这应该会很快变得更好。


Stop-the-World Pauses
ZGC doesn’t get rid of stop-the-world pauses completely. The collector needs pauses when starting marking, ending marking and starting relocation. But this pauses are usually quite short - only a few milliseconds.

When starting marking ZGC traverses all thread stacks to mark the applications root set. The root set is the set of object references from where traversing the object graph starts. It usually consists of local and global variables, but also other internal VM structures (e.g. JNI handles).

Another pause is required when ending the marking phase. In this pause the GC needs to empty and traverse all thread-local marking buffers. Since the GC could discover a large unmarked sub-graph this could take longer. ZGC tries to avoid this by stopping the end of marking phase after 1 millisecond. It returns into the concurrent marking phase until the whole graph is traversed, then the end of marking phase can be started again.

Starting relocation phase pauses the application again. This phase is quite similar to starting marking, with the difference that this phase relocates the objects in the root set.

停止世界暂停
ZGC 并没有完全摆脱 stop-the-world 暂停。收集器在开始标记、结束标记和开始重定位时需要暂停。但是这种停顿通常很短——只有几毫秒。

在开始标记时，ZGC 会遍历所有线程堆栈来标记应用程序根集。根集是开始遍历对象图的对象引用集。它通常由局部和全局变量组成，但也包括其他内部 VM 结构（例如 JNI 句柄）。

结束标记阶段时需要再次暂停。在此暂停中，GC 需要清空并遍历所有线程本地标记缓冲区。由于 GC 可以发现一个大的未标记子图，这可能需要更长的时间。 ZGC 试图通过在 1 毫秒后停止标记阶段的结束来避免这种情况。它返回到并发标记阶段，直到遍历整个图，然后可以再次开始标记阶段的结束。

启动重定位阶段会再次暂停应用程序。此阶段与开始标记非常相似，不同之处在于此阶段重新定位根集中的对象。



### Pages & Physical & Virtual Memory

Shenandoah separates the heap into a large number of equally-sized regions. An object usually does not span multiple regions, except for large objects that do not fit into a single region. Those large objects need to be allocated in multiple contiguous regions. I quite like this approach because it is so simple.

ZGC is quite similar to Shenandoah in this regard. In ZGC’s parlance regions are called pages. The major difference to Shenandoah: Pages in ZGC can have different sizes (but always a multiple of 2MB on x64). There are 3 different page types in ZGC: small (2MB size), medium (32MB size) and large (some multiple of 2MB). Small objects (up to 256KB size) are allocated in small pages, medium-sized objects (up to 4MB) are allocated in medium pages. Objects larger than 4MB are allocated in large pages. Large pages can only store exactly one object, in constrast to small or medium pages. Somewhat confusingly large pages can actually be smaller than medium pages (e.g. for a large object with a size of 6MB).

Another nice property of ZGC is, that it also differentiates between physical and virtual memory. The idea behind this is that there usually is plenty of virtual memory available (always 4TB in ZGC) while physical memory is more scarce. Physical memory can be expanded up to the maximum heap size (set with -Xmx for the JVM), so this tends to be much less than the 4 TB of virtual memory. Allocating a page of a certain size in ZGC means allocating both physical and virtual memory. With ZGC the physical memory doesn’t need to be contiguous - only the virtual memory space. So why is this actually a nice property?

Allocating a contiguous range of virtual memory should be easy, since we usually have more than enough of it. But it is quite easy to imagine a situation where we have 3 free pages with size 2MB somewhere in the physical memory, but we need 6MB of contiguous memory for a large object allocation. There is enough free physical memory but unfortunately this memory is non-contiguous. ZGC is able to map this non-contiguous physical pages to a single contiguous virtual memory space. If this wasn’t possible, we would have run out of memory.

On Linux the physical memory is basically an anonymous file that is only stored in RAM (and not on disk), ZGC uses memfd_create to create it. The file can then be extended with ftruncate, ZGC is allowed to extend the physical memory (= the anonymous file) up to the maximum heap size. Physical memory is then mmaped into the virtual address space.

页面 & 物理 & 虚拟内存
Shenandoah 将堆分成大量大小相等的区域。一个对象通常不跨越多个区域，但不适合单个区域的大型对象除外。这些大对象需要分配在多个连续的区域中。我非常喜欢这种方法，因为它非常简单。

ZGC在这方面与雪兰多相似。在 ZGC 的说法中，区域称为页面。与 Shenandoah 的主要区别：ZGC 中的页面可以有不同的大小（但在 x64 上总是 2MB 的倍数）。 ZGC 中有 3 种不同的页面类型：小（2MB 大小）、中（32MB 大小）和大（2MB 的倍数）。小对象（最大 256KB 大小）分配在小页面中，中型对象（最大 4MB）分配在中页面中。大于 4MB 的对象分配在大页面中。与小页面或中页面相比，大页面只能存储一个对象。有点令人困惑的大页面实际上可能比中页面小（例如，对于大小为 6MB 的大对象）。

ZGC 的另一个不错的特性是，它还区分了物理内存和虚拟内存。这背后的想法是，通常有大量可用的虚拟内存（ZGC 中总是 4TB），而物理内存则更加稀缺。物理内存可以扩展到最大堆大小（使用 JVM 的 -Xmx 设置），因此这往往远小于 4 TB 的虚拟内存。在 ZGC 中分配一定大小的页面意味着同时分配物理内存和虚拟内存。使用 ZGC，物理内存不需要是连续的 - 只需虚拟内存空间。那么为什么这实际上是一个不错的属性呢？

分配连续范围的虚拟内存应该很容易，因为我们通常拥有足够多的虚拟内存。但是很容易想象这样一种情况，我们在物理内存的某个地方有 3 个大小为 2MB 的空闲页面，但我们需要 6MB 的连续内存来分配大对象。有足够的可用物理内存，但不幸的是，这个内存是不连续的。 ZGC 能够将这个不连续的物理页面映射到单个连续的虚拟内存空间。如果这不可能，我们就会耗尽内存。

在 Linux 上，物理内存基本上是一个匿名文件，只存储在 RAM 中（而不是磁盘上），ZGC 使用 memfd_create 创建它。然后可以使用 ftruncate 扩展文件，允许 ZGC 将物理内存（=匿名文件）扩展到最大堆大小。然后将物理内存映射到虚拟地址空间。


## ZGC日志分析


## Conclusion

I hope I could give a short introduction into ZGC. I certainly couldn’t describe every detail about this GC in a single blog post. If you need more information, ZGC is open-source, so it is possible to study the whole implementation.

结论
我希望我能对 ZGC 做一个简短的介绍。 我当然无法在一篇博文中描述这个 GC 的所有细节。 如果您需要更多信息，ZGC 是开源的，因此可以研究整个实现。


## 相关链接

- [23_zgc_intro(2020)](../../tiemao_2020/23_zgc_intro/README.md)
- [20.Pauseless-GC算法(2019)](../../tiemao_2019/20_Azul-The-Pauseless-GC-Algorithm/README.md)
- [The Design of ZGC: ZGC-PLMeetup-2019.pdf](https://cr.openjdk.java.net/~pliden/slides/ZGC-PLMeetup-2019.pdf)
- [A FIRST LOOK INTO ZGC](https://dinfuehr.github.io/blog/a-first-look-into-zgc/)
- [JDK11版: HotSpot Virtual Machine Garbage Collection Tuning Guide](https://docs.oracle.com/en/java/javase/11/gctuning/introduction-garbage-collection-tuning.html)
- [JDK18版: HotSpot Virtual Machine Garbage Collection Tuning Guide](https://docs.oracle.com/en/java/javase/18/gctuning/introduction-garbage-collection-tuning.html)
- [C4 garbage collection for low-latency Java applications](https://www.infoworld.com/article/2078661/jvm-performance-optimization--part-4--c4-garbage-collection-for-low-latency-java-ap.html)

