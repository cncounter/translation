# ZGC实现原理与使用示例

Z垃圾收集器, 简称ZGC(全称为 Z Garbage Collector), 是一款低延迟垃圾收集器, 代码开源, 由 Oracle 公司开发, 主要作者为 Per Liden。

从JDK11开始支持ZGC, 能适应各种大小的堆内存, 伸缩性良好, 性能优异, 在各种环境下都能良好运行。

## 1. ZGC简介

ZGC 有点类似于 Azul 公司开发的C4垃圾收集器(C4, Continuously Concurrent Compacting Collector), 主要目标是大幅度降低GC暂停时间。 同时也支持堆内存碎片整理, 堆内存整理(compacting the heap)的本质, 就是将零散的存活对象移动到一起。 
传统的垃圾收集器在进行堆内存整理时, 需要将整个JVM中的业务线程全部暂停, 也就会造成 STW 停顿(stopping the world)。 
在 GC 相关的论文中, 将业务线程称为 mutator, 简单理解就是修改者, 因为这些应用程序线程会改变堆内存中的值。 如果堆内存中的存活对象较多, STW停顿可能持续好几秒, 对于交互式系统而言, 这么长的卡顿时间简直就是个灾难。

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

翻看 OpenJDK 的代码, 如果以后还需要超过16TB以上的堆内存, 也是很容易实现的, 具体的原理会在着色指针部分进行介绍。



## 2. ZGC常用配置


### 2.1 启用ZGC的JVM参数


JDK11版本开始支持ZGC, 但作为实验性功能提供, 需要使用命令行选项 `-XX:+UnlockExperimentalVMOptions -XX:+UseZGC` 来启用ZGC。

根据 [JEP 377](https://openjdk.org/jeps/377) 规范, 从JDK15版本开始, ZGC成为准生产版本, 不再需要指定开启实验性质的JVM选项, 直接使用 `-XX:+UseZGC` 即可。



### 2.2 设置堆内存大小

和其他GC实现一样, ZGC最重要的调优参数也是设置最大堆内存 (`-Xmx`)。 

由于 ZGC 是并发垃圾收集器, 因此必须确定最大堆内存是多少, 以便于:

- 1) 堆内存可以满足业务需求, 足够容纳运行过程中的存活对象;  
- 2) 在执行 GC 的时候, 堆中有足够的空间来分配对象。

具体需要多少空间, 取决于应用程序的分配速度, 以及存活对象占用多大空间。 
一般来说, 给 ZGC 的内存越多越好, 但也没必要浪费内存。 需要权衡考虑内存使用率, 以及GC周期的触发频率, 在两者之间找到一个平衡点。



### 2.3 设置并发GC线程数


由于 ZGC 是完全并发的垃圾收集器, 所以只需要设置并发GC线程数(`-XX:ConcGCThreads`), 而不需要设置并行GC线程数。 
ZGC 具有自动选择该线程数量的启发式方法。 这种启发式通常效果很好, 但根据应用程序的特性, 有些情况下可能需要进行调整。 
这个选项本质上决定了应该给 GC 分配多少 CPU 时间。 给的太多, GC 就会和应用线程争抢过多的 CPU 时间。 给的太少,  GC 收集的速度, 可能会赶不上应用程序分配对象并变成垃圾的速度。



### 2.4 将不使用的内存返还给操作系统

从JDK13版本开始, ZGC支持将不使用的内存返还给操作系统, 详细规范可以参考 [JEP 351](https://openjdk.org/jeps/351) 。
默认情况下, ZGC 会自动将不用的内存部分返还给操作系统。 对于关注内存占用的系统或部署环境, 这个功能非常有用。 
但当水位缩减到最小堆内存 (`-Xms`) 时, 就不会继续返还未使用的内存了。 根据这个情况可以推断得知: 如果最小堆内存(`-Xms`) 和 最大堆内存(`-Xmx`) 配置相等, 则此功能将被隐式禁用。

如果不需要返还, 可以通过减号标志来明确禁用此功能: `-XX:-ZUncommit`。 

内存返还的延迟时间, 可以使用 `-XX:ZUncommitDelay=<seconds>` 来配置(默认值为 `300` 秒)。 这个延迟时间, 指定了在返还给操作系统之前, 应该至少空闲多长时间。



## 3. ZGC实现原理


ZGC的基本特征包括:

- 并发GC(Concurrent)
- 良好的执行过程追踪日志(Tracing)
- 支持内存碎片整理(Compacting)
- 不分代(Single generation)
- 基于多个小堆区(Region-based), 可以进行增量式GC
- 支持NUMA架构(NUMA-aware)
- 依赖读屏障(Load barriers)
- 着色指针(Colored pointers)

接下来我们进一步来查看ZGC的实现原理。


### 3.1 ZGC的各个阶段

ZGC中每个垃圾收集周期的示意图如下所示:

![]()

我们挨个进行介绍。

#### 3.1.1 标记阶段(Mark)

标记阶段有这些特征:

* 并发+并行方式执行(Concurrent & Parallel)

* 使用读屏障(Load barrier): 通过读屏障检测到尚未标记的对象指针(non-marked object pointers)的加载

* 条带式的(Striped)标记周期:
  – 堆内存被划分为多个逻辑上的条带(stripes)
  – 每个 GC 线程都是独立的, 只负责指派给他的条带(stripe)
  – 互相之间保持最低限度的状态共享(Minimized shared state)


标记阶段大致可以从三个部分来观察:

Pause Mark Start 示意图


![]()

Concurrent Mark 示意图


![]()

Pause Mark End 示意图


![]()



#### 3.1.2 重分配阶段(Relocation, 对象迁移)

* 并发+并行方式执行(Concurrent & Parallel)
* 使用读屏障(Load barrier): 
  - 通过读屏障检测出指向重分配集(relocation set)中的对象指针的加载
  – 如果碰到了, Java应用线程可以辅助进行对象迁移。

* 不使用堆内存转发表(Off-heap forwarding tables)
   – 不在对象的旧副本中存储转发信息
   - 不使用的堆内存立即可以重用


示意图

![]()


#### 3.1.3 标记(Marking)和对象重分配(Relocating objects)

每次垃圾收集都有两个主要阶段: 标记和对象重分配。 (实际上不止这两个阶段, 更详细的信息请参阅源码)。

每个 GC 周期从标记阶段开始, 该阶段负责标记所有可达对象(reachable objects)。 在这个阶段结束时, 我们知道哪些对象还活着, 哪些是垃圾。 ZGC 将此信息存储在每个页面的存活映射图中(live map)。 存活Map是一个位图(bitmap), 用于存储给定索引处的对象是否是强可达对象(strongly-reachable), 或者是最终可达对象(final-reachable, 具有finalize方法的对象)。

在标记阶段执行过程中, 应用程序线程中的读屏障, 负责将未标记的引用, 推到线程本地标记缓冲区中(thread-local marking buffer)。 一旦缓冲区存满了, GC 线程就接管此缓冲区, 并递归遍历此缓冲区中的所有可达对象。 在应用程序线程中所做的标记, 仅仅是将引用推入缓冲区, 由GC线程负责遍历对象图, 并更新存活映射图。

标记完成后, ZGC需要给待迁移集合(relocation set)中的所有存活对象, 重新分配存储空间。 待迁移集合(relocation set)是一组页面, 根据标记后的某些标准(例如垃圾数量最多的页面), 选择要迁移的页面。 一个对象的重分配, 要么由 GC 线程直接执行, 要么由应用程序线程来执行(还是通过读屏障触发)。 ZGC为待迁移集合中的每个页面分配一个转发表(forwarding table)。 转发表一般是 hash map, 用于存储给对象重新分配到的地址(如果对象已被重分配)。

ZGC这种实现方式的优点, 是我们只需要为待迁移集合页面中的的转发指针分配空间。 相比之下, Shenandoah(雪兰多) GC算法的实现, 是在每个对象自身内部存储转发指针, 这样会存在一些内存开销(空间换时间, 理论上吞吐量会更高)。

GC 线程会遍历待迁移集合中的存活对象, 并为所有尚未迁移的对象重新分配存储位置。 这个迁移过程甚至可能会有并发争抢: 应用程序线程和GC线程同时尝试迁移同一个对象; 在这种情况下, 先迁移的线程会获得执行权。 ZGC使用代价很低的CAS原子操作,来确定线程是否获取到执行权。

虽然从堆内存中读取对象数据时, 读屏障在重分配对象, 或者重映射所有引用, 不会单独标记。 但这确保了业务线程(mutator)看到的每个新引用, 都已经指向了对象的最新副本。 重映射一个对象, 意味着在转发表中找到对象的新地址。

只要GC线程遍历完成了待迁移集合的处理, 重分配阶段就结束了。 这时候, 尽管这些对象都已经重新分配了位置, 但可能还有引用指向待迁移集合的页面, 这就需要重映射(remapped)到它们的新地址。 
这类引用的后续修复, 可能会被: 

- 1. 通过读屏障捕获处理
- 2. 或者在下一个标记周期修复。

这意味着, 标记阶段还需要检查转发表, 将引用重映射到对象的新地址(不会重新分配存储空间 - 所有对象都被重分配过了)。


这也解释了为什么一个对象引用中要用两个标记位(`marked0` 和 `marked1`)。 标记阶段在 `marked0` 和 `marked1` 标记位之间交替。 在重分配阶段之后, 可能还有尚未重映射的引用, 这些引用的标记位的值, 还是上次标记周期设置的。 如果是新的标记阶段, 则会使用相同的标记位, 读屏障将会检测到该引用已经被标记过。



### 3.2 着色指针(Colored Pointers)


Java中的数据, 分为基础数据类型与对象引用类型, 引用就是指向某个对象的指针, 存储在堆中(对象的字段)或者栈中(方法中的局部变量)。 

### 3.2.1 引用着色(Reference coloring)

ZGC中需要理解的关键技术是引用着色。
ZGC对引用指针做了一些hack, 额外存储了一些元数据。 
ZGC不支持 oops 或 class指针 的压缩, 在 x64 平台上, 引用类型的存储空间是 64 bit, 也就是8字节。 但目前的硬件在物理实现上, 限制了虚拟内存地址只能使用 48 位。 
但确切而言, JDK11的ZGC只用了47位, 因为 bit 47 用来确定 48-63 bits的值(为了需要, 这些位全是0)。

在JDK11的实现中, ZGC将前42位(0-41 bits, 在源码中称为Offset)留作对象的实际地址。  42位的地址在理论上为 ZGC 提供了 4TB 的最大堆内存。 
其余还有4个bit位用于这些标志: finalizable、remapped、marked1 和marked0; 这里还保留了1个bit以供将来版本使用。 
ZGC的源代码中有一幅非常不错的ASCII绘图, 展示了这些bit:


```sh
# JDK11
 6                 4 4 4  4 4                                             0
 3                 7 6 5  2 1                                             0
+-------------------+-+----+-----------------------------------------------+
|00000000 00000000 0|0|1111|11 11111111 11111111 11111111 11111111 11111111|
+-------------------+-+----+-----------------------------------------------+
|                   | |    |
|                   | |    * 41-0 Object Offset (42-bits, 4TB 地址空间)
|                   | |
|                   | * 45-42 Metadata Bits (4-bits)  0001 = Marked0
|                   |                                 0010 = Marked1
|                   |                                 0100 = Remapped
|                   |                                 1000 = Finalizable
|                   |
|                   * 46-46 Unused (1-bit, 保持为0)
|
* 63-47 固定 (17-bits, 全是0)
```

> 简单解读: 上面的示意图中, 第一行是6,第二行是3, 标识第63位; 00则代表第0位, 其他类似;  


在指针引用中包含元数据信息, 确实会使取消引用的操作代价更高, 因为需要对地址进行转码(masked), 才能获得没有元信息的真实地址。 
ZGC通过一个绝妙的技巧来避免这种情况: 当从内存中读取的某一位精确匹配 marked0, marked1 或者 remapped 标记位。 
在JDK11中, 当在 x 偏移处分配页面时, ZGC 将同一个物理页面映射到 3 个不同的虚拟地址：


- 给 marked0 的: `(0b0001 << 42) | x`
- 给 marked1 的: `(0b0010 << 42) | x`
- 给 remapped 的: `(0b0100 << 42) | x`


ZGC therefore just reserves 16TB of address space (but not actually uses all of this memory) starting at address 4TB. Here is another nice drawing from ZGC’s source:

因此, ZGC 只需要保留总共 16TB 的地址空间; 从 4TB 地址开始, 到20TB为止, 因为marked0和marked1不能同时为1, 中间还有一段未使用的内存地址空间。 
下面是 ZGC 源码中的另一个注释说明: 

```sh
 +--------------------------------+ 0x0000140000000000 (20TB)
  |         Remapped View          |
  +--------------------------------+ 0x0000100000000000 (16TB)
  |     (未使用的地址空间)            |
  +--------------------------------+ 0x00000c0000000000 (12TB)
  |         Marked1 View           |
  +--------------------------------+ 0x0000080000000000 (8TB)
  |         Marked0 View           |
  +--------------------------------+ 0x0000040000000000 (4TB)
```

At any point of time only one of these 3 views is in use. So for debugging the unused views can be unmapped to better verify correctness.

在任何时间点, 这 3 个视图中只有一个在使用。 因此, 可以通过调试, 将未使用的部分取消映射, 来验证这个知识点。


### 3.2.2 如何从4TB扩展到16TB

从 JDK 13 版本开始, ZGC 最大堆内存从 `4TB` 扩展到 `16TB`, 也就是可以将前44位(0-43 bits)用来标识对象的实际地址; 42位地址=4TB; 44位地址=16TB; 

详细信息可查阅JDK18的源代码:

> https://github.com/openjdk/jdk/blob/jdk-18-ga/src/hotspot/cpu/x86/gc/z/zGlobals_x86.cpp


打开链接, 从中可以看到类似下面这样的注释信息:

```sh
// JDK18: 地址空间: 引用指针内存布局3
// --------------------------------
//
+--------------------------------+ 0x00007FFFFFFFFFFF (127TB)
.                                .
.                                .
.                                .
+--------------------------------+ 0x0000500000000000 (80TB)
|         Remapped View          |
+--------------------------------+ 0x0000400000000000 (64TB)
.                                . (这部分地址空间未使用, 因为marked0和marked1不能同时为1)
+--------------------------------+ 0x0000300000000000 (48TB)
|         Marked1 View           |
+--------------------------------+ 0x0000200000000000 (32TB)
|         Marked0 View           |
+--------------------------------+ 0x0000100000000000 (16TB)
.                                .
+--------------------------------+ 0x0000000000000000
//
 6               4  4  4 4
 3               8  7  4 3                                               0
+------------------+----+-------------------------------------------------+
|00000000 00000000 |1111|1111 11111111 11111111 11111111 11111111 11111111|
+------------------+----+-------------------------------------------------+
|                  |    |
|                  |    * 43-0 Object Offset (44-bits, 16TB 地址空间)
|                  |
|                  * 47-44 Metadata Bits (4-bits)  0001 = Marked0      (Address view 16-32TB)
|                                                  0010 = Marked1      (Address view 32-48TB)
|                                                  0100 = Remapped     (Address view 64-80TB)
|                                                  1000 = Finalizable  (Address view N/A)
|
* 63-48 Fixed (16-bits, always zero)
```


### 3.2.3 读屏障(Load Barrier)


### 3.2.3.1 GC屏障简介

ZGC如何执行并发内存整理, 最关键的是理解读屏障(load barrier, 在GC相关的论文中称之为 read barrier, 一般来说两者是一个意思)。
可能有些读者不太了解, 所以这里先进行简单的介绍。 
如果 GC 有读屏障的支持, 那么JVM从堆内存中读取引用时, 需要执行一些额外的操作。
在 Java 中, 基本上每次看到像 `obj.refField` 这样的代码时, 都会读取 `obj` 指向的对象。 
GC 可能还需要一个写屏障(write-barrier, store-barrier)来执行 `obj.refField = value` 之类的赋值操作。
这两类操作的特殊性在于, 它们会从堆中读取或写入数据。
虽然都叫做屏障, 但 GC 屏障与常见的内存屏障(CPU屏障,编译器屏障) 并不是一回事; 要简单理解的话, 可以认为是在代码里进行了代理包装或者插桩。

在堆内存中进行读取和写入操作简直是太频繁了, 因此这两种 GC 屏障都必须非常高效。 这意味着在常见情况下只能是很少量的汇编指令。
尽管不同系统的实现代码可能千差万别, 但读屏障出现的次数, 一般要比写屏障高出一个数量级, 因此读屏障对性能的要求更高。
举个例子, 分代的GC算法, 通常只需要一个写屏障, 不需要读屏障。  ZGC不一样, 需要使用读屏障, 但不用写屏障。
对于并发内存碎片整理, 目前业界还没有不依赖读读屏障的解决方案。

另一个需要考虑的点是: 即使 GC 需要某种类型的屏障, 也可能只在从堆内存读取引用类型, 或者将引用写入堆内存时才需要。 读取或写入int, double之类的原生类型可能并不需要用到GC屏障。

- JIT在关键位置植入一小段代码: 从堆内存中加载对象引用时;
- 检查加载的对象引用颜色是否有问题: 如果有问题, 则采取措施并修复;


加载堆内存中的对象属性:

```java
String personName = person.name;      // 从堆内存中加载一个对象引用
<此处需要植入读屏障(load barrier)>
int nameLenth = personName.length();  // 没有GC屏障, 因为读取的不是引用类型; 
int personAge = person.age;           // 没有GC屏障, 因为读取的不是引用类型;
// 至于加载 person 引用的操作, 这里代码中没有涉及, 在更前面的代码中也会植入读屏障
```

伪代码是类似这样的判断:

```c
barrier: 
  // Bad color? jnz slow_path 
  // Yes -> Enter slow path and mark/relocate/remap, adjust 0x10(%rax) and %rbx

~4% execution overhead o
```

### 3.2.3.2 读屏障(Load-Barrier)

ZGC needs a so called load-barrier (also referred to as read-barrier) when reading a reference from the heap. We need to insert this load-barrier each time the Java program accesses a field of object type, e.g. obj.refField. Accessing fields of some other primitive type do not need a barrier, e.g. obj.anInt or obj.anDouble. ZGC doesn’t need store/write-barriers for obj.refField = someValue.


ZGC 从堆内存中读取引用时, 需要用到读屏障(load-barrier, 也称为read-barrier)。 
每次 Java 程序访问对象引用类型的字段时, 都需要插入这个读屏障, 例如  `obj.refField`。 
访问原生数据类型的字段不需要屏障, 例如 `obj.anInt` 或 `obj.anDouble`。 
对于 `obj.refField = someValue` 之类的赋值操作, ZGC 并不需要写屏障(store/write-barriers)。

Depending on the stage the GC is currently in (stored in the global variable ZGlobalPhase), the barrier either marks the object or relocates it if the reference isn’t already marked or remapped.

根据 GC 当前所处的阶段(存储在全局变量 `ZGlobalPhase` 中)：

- 如果引用尚未标记, 那么读屏障则会标记对象;
- 如果引用尚未重映射, 那么读屏障就会重新定位。

The global variables ZAddressGoodMask and ZAddressBadMask store the mask that determines if a reference is already considered good (that means already marked or remapped/relocated) or if there is still some action necessary. These variables are only changed at the start of marking- and relocation-phase and both at the same time. This table from ZGC’s source gives a nice overview in which state these masks can be:

全局变量 `ZAddressGoodMask` 和 `ZAddressBadMask` 保存着位码(mask), 用于确定引用是否已经被认为是健康状态(已经被标记, 或者重映射/重分配); 或者仍然需要一些操作。
这些变量仅在标记(marking-)开始时, 以及重分配(relocation-)阶段开始时发生变更, 并且两者会同时更改。
这张来自 ZGC 源码中的注释表格, 很好地概述了这些掩码的状态：

```c
               GoodMask         BadMask          WeakGoodMask     WeakBadMask
               --------------------------------------------------------------
Marked0        001              110              101              010
Marked1        010              101              110              001
Remapped       100              011              100              011
```

Assembly code for the barrier can be seen in the MacroAssembler for x64, I will only show some pseudo assembly code for this barrier:

屏障的汇编代码, 可以在 x64 的 [MacroAssembler](https://github.com/openjdk/jdk/blob/jdk-18-ga/src/hotspot/cpu/x86/macroAssembler_x86.cpp) 中看到, 这里只展示这个屏障的一些伪汇编代码:

```sh
mov rax, [r10 + some_field_offset]
test rax, [address of ZAddressBadMask]
jnz load_barrier_mark_or_relocate

# 如果没有触发屏障, rax 中的引用就是健康的
```

第一条汇编指令从堆中读取一个引用: `r10` 保存的是对象的引用, 而 `some_field_offset` 则是某个字段固定的偏移量。 加载的引用存储在 `rax` 寄存器中。
然后针对当前的错误掩码(ZAddressBadMask)测试该引用(使用按位与操作)。 这里不需要同步操作, 因为 `ZAddressBadMask` 只有在STW时才会更新。 
如果结果非零, 则需要执行屏障。 屏障会根据当前所处的 GC 阶段执行标记或重分配操作。
在此操作之后, 它需要将健康的引用地址,更新到 `r10 + some_field_offset` 存储位置。 更新操作完成, 后续通过此字段加载到的就是一个健康的指针。 
因为可能需要更新引用地址, 所以使用到了两个寄存器 `r10` 和 `rax`, 分别存储对象地址, 和加载的引用。
健康的引用也需要存储到寄存器 `rax` 中, 这样就和我们加载到了健康的引用等效, 程序可以继续执行。


Since every single reference needs to be marked or relocated, throughput is likely to decrease right after starting a marking- or relocation-phase. This should get better quite fast when most references are healed.

由于每个引用都需要被标记或重分配, 因此在开始标记或重分配阶段后, 吞吐量可能会立即降低。 当大多数指针都被修正时, 吞吐量也应该会迅速好转。


### 3.2.3.3 ZGC与STW暂停


ZGC并没有完全摆脱 stop-the-world 暂停。 垃圾收集器在开始标记、结束标记和开始重分配时, 都需要STW暂停(Stop-the-World Pauses)。 但这种停顿通常很短: 只需要几毫秒。

在开始标记时, ZGC会遍历所有线程栈, 来标记GC根。 GC根集合(root set), 是开始遍历对象图的对象引用集。 它通常由线程调用链中的方法局部变量, 以及全局变量组成, 当然也包括其他内部 VM 结构题(例如 JNI 句柄)。

标记阶段结束时, 也需要一次STW暂停。 在此暂停中, GC 需要遍历所有线程本地标记缓冲区(thread-local marking buffers), 并负责清空。 由于 GC 可能会看到很大的未标记子图, 所以这个操作可能会耗时较长。 
ZGC会尝试在 1 毫秒后就停止标记阶段, 以避免这种情况。 它再次进入并发标记阶段, 直到遍历整个图, 然后再次结束标记阶段。

重分配阶段开始时, 会再次暂停应用程序。 这与开始标记非常相似, 不同之处在于这时候是重分配根集(root set)中的对象。



### Pages & Physical & Virtual Memory

Shenandoah separates the heap into a large number of equally-sized regions. An object usually does not span multiple regions, except for large objects that do not fit into a single region. Those large objects need to be allocated in multiple contiguous regions. I quite like this approach because it is so simple.

ZGC is quite similar to Shenandoah in this regard. In ZGC’s parlance regions are called pages. The major difference to Shenandoah: Pages in ZGC can have different sizes (but always a multiple of 2MB on x64). There are 3 different page types in ZGC: small (2MB size), medium (32MB size) and large (some multiple of 2MB). Small objects (up to 256KB size) are allocated in small pages, medium-sized objects (up to 4MB) are allocated in medium pages. Objects larger than 4MB are allocated in large pages. Large pages can only store exactly one object, in constrast to small or medium pages. Somewhat confusingly large pages can actually be smaller than medium pages (e.g. for a large object with a size of 6MB).

Another nice property of ZGC is, that it also differentiates between physical and virtual memory. The idea behind this is that there usually is plenty of virtual memory available (always 4TB in ZGC) while physical memory is more scarce. Physical memory can be expanded up to the maximum heap size (set with -Xmx for the JVM), so this tends to be much less than the 4 TB of virtual memory. Allocating a page of a certain size in ZGC means allocating both physical and virtual memory. With ZGC the physical memory doesn’t need to be contiguous - only the virtual memory space. So why is this actually a nice property?

Allocating a contiguous range of virtual memory should be easy, since we usually have more than enough of it. But it is quite easy to imagine a situation where we have 3 free pages with size 2MB somewhere in the physical memory, but we need 6MB of contiguous memory for a large object allocation. There is enough free physical memory but unfortunately this memory is non-contiguous. ZGC is able to map this non-contiguous physical pages to a single contiguous virtual memory space. If this wasn’t possible, we would have run out of memory.

On Linux the physical memory is basically an anonymous file that is only stored in RAM (and not on disk), ZGC uses memfd_create to create it. The file can then be extended with ftruncate, ZGC is allowed to extend the physical memory (= the anonymous file) up to the maximum heap size. Physical memory is then mmaped into the virtual address space.

页面 & 物理 & 虚拟内存
Shenandoah 将堆分成大量大小相等的区域。一个对象通常不跨越多个区域, 但不适合单个区域的大型对象除外。这些大对象需要分配在多个连续的区域中。我非常喜欢这种方法, 因为它非常简单。

ZGC在这方面与雪兰多相似。在 ZGC 的说法中, 区域称为页面。与 Shenandoah 的主要区别：ZGC 中的页面可以有不同的大小(但在 x64 上总是 2MB 的倍数)。 ZGC 中有 3 种不同的页面类型：小(2MB 大小)、中(32MB 大小)和大(2MB 的倍数)。小对象(最大 256KB 大小)分配在小页面中, 中型对象(最大 4MB)分配在中页面中。大于 4MB 的对象分配在大页面中。与小页面或中页面相比, 大页面只能存储一个对象。有点令人困惑的大页面实际上可能比中页面小(例如, 对于大小为 6MB 的大对象)。

ZGC 的另一个不错的特性是, 它还区分了物理内存和虚拟内存。这背后的想法是, 通常有大量可用的虚拟内存(ZGC 中总是 4TB), 而物理内存则更加稀缺。物理内存可以扩展到最大堆大小(使用 JVM 的 -Xmx 设置), 因此这往往远小于 4 TB 的虚拟内存。在 ZGC 中分配一定大小的页面意味着同时分配物理内存和虚拟内存。使用 ZGC, 物理内存不需要是连续的 - 只需虚拟内存空间。那么为什么这实际上是一个不错的属性呢？

分配连续范围的虚拟内存应该很容易, 因为我们通常拥有足够多的虚拟内存。但是很容易想象这样一种情况, 我们在物理内存的某个地方有 3 个大小为 2MB 的空闲页面, 但我们需要 6MB 的连续内存来分配大对象。有足够的可用物理内存, 但不幸的是, 这个内存是不连续的。 ZGC 能够将这个不连续的物理页面映射到单个连续的虚拟内存空间。如果这不可能, 我们就会耗尽内存。

在 Linux 上, 物理内存基本上是一个匿名文件, 只存储在 RAM 中(而不是磁盘上), ZGC 使用 memfd_create 创建它。然后可以使用 ftruncate 扩展文件, 允许 ZGC 将物理内存(=匿名文件)扩展到最大堆大小。然后将物理内存映射到虚拟地址空间。


## 4. ZGC日志分析


## 5. 小结

希望本文能让你对 ZGC 有一定的了解。 ZGC的细节实在是太多了, 只有多多使用和实践, 才可能深入了解; 碰到某些网上没有的细节知识点, 查看 ZGC 的开源代码是最有效的解决方案。


## 6. 相关链接

- [23_zgc_intro(2020)](../../tiemao_2020/23_zgc_intro/README.md)
- [20.Pauseless-GC算法(2019)](../../tiemao_2019/20_Azul-The-Pauseless-GC-Algorithm/README.md)
- [The Design of ZGC: ZGC-PLMeetup-2019.pdf](https://cr.openjdk.java.net/~pliden/slides/ZGC-PLMeetup-2019.pdf)
- [A FIRST LOOK INTO ZGC](https://dinfuehr.github.io/blog/a-first-look-into-zgc/)
- [ZGC源代码: 4TB扩展到16TB](https://github.com/openjdk/jdk/blob/master/src/hotspot/cpu/x86/gc/z/zGlobals_x86.cpp)
- [JDK11版: HotSpot Virtual Machine Garbage Collection Tuning Guide](https://docs.oracle.com/en/java/javase/11/gctuning/introduction-garbage-collection-tuning.html)
- [JDK18版: HotSpot Virtual Machine Garbage Collection Tuning Guide](https://docs.oracle.com/en/java/javase/18/gctuning/introduction-garbage-collection-tuning.html)
- [C4 garbage collection for low-latency Java applications](https://www.infoworld.com/article/2078661/jvm-performance-optimization--part-4--c4-garbage-collection-for-low-latency-java-ap.html)

