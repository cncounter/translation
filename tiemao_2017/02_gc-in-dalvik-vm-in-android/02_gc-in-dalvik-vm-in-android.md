# How garbage collection works in Dalvik VM in android ?

# 安卓中 Dalvik VM 的垃圾收集过程


First of all Garbage Collection on the Dalvik Virtual Machine can be a little more relaxed than other Java implementations because **it does no compacting.** This means that the address of objects on the heap never change after their creation, making the rest of the VM implementation quite a bit simpler.

首先垃圾收集在Dalvik虚拟机可以更轻松的比其他Java实现因为* *也没有压实.* *这意味着堆上对象的地址不会改变他们的创作之后,让其他VM实现相当简单。


So garbage collection **can be triggered when an allocation fails**, when an

所以垃圾收集* *可以分配失败时触发* *,当一个


1.  OutOfMemoryError is about to be triggered,
2.  when the size of the heap hits some soft limit, and
3.  when a GC was explicitly requested.

1. OutOfMemoryError被触发,
2. 当堆的大小达到一些软限制,和
3. 当一个GC被显式地请求。



Each of these causes has its own specification indicating whether the GC is a **partial GC**(only free from active heap), **a concurrent GC** (do most of the object marking while other threads running), and whether it is a **preserving GC** (keep soft references).

每逾期引起你自己是否生产及其specification GC is a * * * *(GC partial free from only active heap),并发GC * * * *(大多数其他线程运行时对象的标记),以及是否它是一个* *保护GC * *(保持软引用)。


Your typical GC is triggered by a soft allocation limit, only freeing on the active heap, concurrent, and preserving. On the other extreme the GC triggered before an OutOfMemoryException is full, synchronous, and non-preserving.

典型的GC是由软触发分配限制,只有释放活性堆上,并发和保存.在另一个极端GC触发前OutOfMemoryException已满,同步,non-preserving。


The actual GC is done using a **Mark-Sweep algorithm.**

目前GC is居住using a * * * * Mark-Sweep algorithm。


**Mark-Sweep Algorithm: How it works ?**

* *标记-清除算法:它是如何工作的? * *


The mark-and-sweep algorithm was the first garbage collection algorithm to be developed that is**able to reclaim cyclic data structures.**

标记和清扫算法是第一个垃圾收集算法开发* *能够回收循环数据结构。* *


When using mark-and-sweep, unreferenced objects are not reclaimed immediately. Instead, garbage is allowed to accumulate until all available memory has been exhausted. When that happens, the execution of the program is suspended temporarily while the mark-and-sweep algorithm collects all the garbage. Once all unreferenced objects have been reclaimed, the normal execution of the program can resume.

使用标记和清扫时,未引用的对象不立即回收。相反,垃圾可以积累,直到耗尽所有可用的内存.当这种情况发生时,程序的执行是暂时中止而标记和清扫算法收集所有的垃圾.一旦所有未引用的对象被回收,恢复程序的正常执行。


The mark-and-sweep algorithm is **called a _tracing_ garbage collector** because is _traces out_ the entire collection of objects that are directly or indirectly accessible by the program. The objects that a program can access directly are those objects which are referenced by local variables on the processor stack as well as by any static variables that refer to objects. In the context of garbage collection, these variables are called the _roots_ . An object is indirectly accessible if it is referenced by a field in some other (directly or indirectly) accessible object. An accessible object is said to be _live_ . Conversely, an object which is not _live_ is garbage.

标记和清扫算法* *称为_tracing_垃圾收集器* *因为_traces out_整个集合的对象直接或间接访问的程序.一个程序可以直接访问的对象是那些对象引用的栈上处理器的局部变量以及任何引用对象的静态变量.在垃圾收集的上下文中,这些变量被称为_roots_.间接访问对象如果是引用的字段在其他(直接或间接)访问对象。据说是_live_易访问的对象.相反,对象不是_live_是垃圾。


The mark-and-sweep algorithm **consists of two phases**: In the first phase, it finds and marks all accessible objects. The first phase is called the _mark_ phase. In the second phase, the garbage collection algorithm scans through the heap and reclaims all the unmarked objects. The second phase is called the _sweep_ phase.

标记和清扫算法* * * *包括两个阶段:在第一阶段,它发现,标志着所有可访问对象。第一阶段叫做_mark_阶段.在第二阶段,垃圾收集算法扫描通过堆和回收所有未标记对象。第二个阶段称为_sweep_阶段。


![](https://cdn-images-1.medium.com/max/800/1*BCwoxkkyuAtWWu5bkjU1ww.gif)




(a) shows the conditions before garbage collection begins. In this example, there is a single root variable

(一个)显示了垃圾收集开始前的条件。在这个例子中,只有一个根变量


(b) shows the effect of the _mark_ phase of the algorithm. At this point, all live objects have been marked

(b)显示的_mark_阶段算法的影响。在这一点上,所有活动对象都明显


(c) shows the objects left after the _sweep_ phase has been completed. Only live objects remain in memory and the marked fields have all been set to false again.

(c)显示了对象后_sweep_阶段已经完成。只活对象留在记忆和标记字段都设置为false。


当然,到 Android5.0 以后, ART GC 的优化改进了Dalvik 虚拟机很多的性能瓶颈; 详情请参考: [Android 5.0 ART GC 对比 Android 4.x Dalvik GC](http://blog.csdn.net/hello2mao/article/details/42361755)


原文链接: [https://medium.com/@nitinkumargove/how-garbage-collection-works-in-dalvik-vm-in-android-bf781ab48531](https://medium.com/@nitinkumargove/how-garbage-collection-works-in-dalvik-vm-in-android-bf781ab48531)


