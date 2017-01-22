# How garbage collection works in Dalvik VM in android ?

# 安卓中 Dalvik VM 的垃圾收集过程


First of all Garbage Collection on the Dalvik Virtual Machine can be a little more relaxed than other Java implementations because **it does no compacting.** This means that the address of objects on the heap never change after their creation, making the rest of the VM implementation quite a bit simpler.

首先, Dalvik虚拟机中的垃圾收集比其他的Java实现更简单, 因为**没有进行整理**. 这也就是说堆里面的对象地址在创建之后永远都不会改变, 使得其余部分VM的实现变得相当简单。


So garbage collection **can be triggered when an allocation fails**, when an

所以垃圾收集 **会在分配失败时触发**, 包括:


1.  OutOfMemoryError is about to be triggered,
2.  when the size of the heap hits some soft limit, and
3.  when a GC was explicitly requested.

1. `OutOfMemoryError` 被触发时,
2. 堆内存的大小到达某些软限制时,
3. 显式地请求GC时。



Each of these causes has its own specification indicating whether the GC is a **partial GC**(only free from active heap), **a concurrent GC** (do most of the object marking while other threads running), and whether it is a **preserving GC** (keep soft references).


每种原因都有其规范来标识GC是否是一次**partial GC**(部分GC, 只回收 active heap), 是否是一次 **a concurrent GC** (并发GC, 在应用线程运行时执行大部分的标记任务), 以及是否是一次 **preserving GC** (保留GC, 保留软引用)。


Your typical GC is triggered by a soft allocation limit, only freeing on the active heap, concurrent, and preserving. On the other extreme the GC triggered before an OutOfMemoryException is full, synchronous, and non-preserving.

典型的GC是由软分配限制触发的, 只清理活跃堆,并发和保留型的GC. 另一个极端的GC触发原因是 `OutOfMemoryException`, 是同步的,非保留式的(non-preserving)。


The actual GC is done using a **Mark-Sweep algorithm.**

当前的GC使用了**Mark-Sweep algorithm**(标记清除)算法。


**Mark-Sweep Algorithm: How it works ?**

**Mark-Sweep Algorithm**(标记-清除)算法的原理


The mark-and-sweep algorithm was the first garbage collection algorithm to be developed that is**able to reclaim cyclic data structures.**

标记和清除算法是第一种能够回收 **循环数据结构** 的算法。


When using mark-and-sweep, unreferenced objects are not reclaimed immediately. Instead, garbage is allowed to accumulate until all available memory has been exhausted. When that happens, the execution of the program is suspended temporarily while the mark-and-sweep algorithm collects all the garbage. Once all unreferenced objects have been reclaimed, the normal execution of the program can resume.

使用标记和清除算法时, 未引用的对象不会立即被回收。相反,垃圾可以积累,直到耗尽所有可用的内存. 当这种情况发生时,程序被暂停执行, 让标记和清除算法收集所有的垃圾. 当所有未引用的对象被回收后,恢复程序的正常执行。


The mark-and-sweep algorithm is **called a _tracing_ garbage collector** because is _traces out_ the entire collection of objects that are directly or indirectly accessible by the program. The objects that a program can access directly are those objects which are referenced by local variables on the processor stack as well as by any static variables that refer to objects. In the context of garbage collection, these variables are called the _roots_ . An object is indirectly accessible if it is referenced by a field in some other (directly or indirectly) accessible object. An accessible object is said to be _live_ . Conversely, an object which is not _live_ is garbage.

标记和清除算法被称为** _tracing_ 垃圾收集器**, 因为其 _traces out_所有直接或间接被程序访问的对象. 程序可以直接访问的对象包括： 处理器栈上的局部变量引用的,以及静态变量所引用的对象. 在GC中, 这些变量被称为 _roots_. 间接访问对象是由(直接或间接)访问对象所引用的对象。可访问对象也被称为 存活对象. 相反, 不再存活的对象就被称为垃圾。


The mark-and-sweep algorithm **consists of two phases**: In the first phase, it finds and marks all accessible objects. The first phase is called the _mark_ phase. In the second phase, the garbage collection algorithm scans through the heap and reclaims all the unmarked objects. The second phase is called the _sweep_ phase.

标记和清除算法 **由两个阶段组成**: 第一阶段,找到并标记所有的可访问对象, 叫做_mark_阶段。 第二阶段, 垃圾收集算法扫描整个堆,并回收所有未标记的对象, 称为_sweep_阶段。


![](https://cdn-images-1.medium.com/max/800/1*BCwoxkkyuAtWWu5bkjU1ww.gif)




(a) shows the conditions before garbage collection begins. In this example, there is a single root variable

(a)显示了垃圾收集开始前的情况。在这个例子中,只有一个 root 变量。


(b) shows the effect of the _mark_ phase of the algorithm. At this point, all live objects have been marked

(b)显示了 _mark_阶段的效果。此时, 所有的存活对象都被标记了。


(c) shows the objects left after the _sweep_ phase has been completed. Only live objects remain in memory and the marked fields have all been set to false again.

(c)显示了 _sweep_ 阶段完成后的对象。只有存活对象留在内存中, 所有的 marked 字段都被设置为false了。


当然,到 Android5.0 以后, ART GC 的优化改进了Dalvik 虚拟机很多的性能瓶颈; 详情请参考: [Android 5.0 ART GC 对比 Android 4.x Dalvik GC](http://blog.csdn.net/hello2mao/article/details/42361755)


原文链接: [https://medium.com/@nitinkumargove/how-garbage-collection-works-in-dalvik-vm-in-android-bf781ab48531](https://medium.com/@nitinkumargove/how-garbage-collection-works-in-dalvik-vm-in-android-bf781ab48531)


