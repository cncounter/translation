# How garbage collection works in Dalvik VM in android ?

First of all Garbage Collection on the Dalvik Virtual Machine can be a little more relaxed than other Java implementations because **it does no compacting.** This means that the address of objects on the heap never change after their creation, making the rest of the VM implementation quite a bit simpler.

So garbage collection **can be triggered when an allocation fails**, when an

1.  OutOfMemoryError is about to be triggered,
2.  when the size of the heap hits some soft limit, and
3.  when a GC was explicitly requested.

Each of these causes has its own specification indicating whether the GC is a **partial GC**(only free from active heap), **a concurrent GC** (do most of the object marking while other threads running), and whether it is a **preserving GC** (keep soft references).

Your typical GC is triggered by a soft allocation limit, only freeing on the active heap, concurrent, and preserving. On the other extreme the GC triggered before an OutOfMemoryException is full, synchronous, and non-preserving.

The actual GC is done using a **Mark-Sweep algorithm.**

**Mark-Sweep Algorithm: How it works ?**

The mark-and-sweep algorithm was the first garbage collection algorithm to be developed that is**able to reclaim cyclic data structures.**

When using mark-and-sweep, unreferenced objects are not reclaimed immediately. Instead, garbage is allowed to accumulate until all available memory has been exhausted. When that happens, the execution of the program is suspended temporarily while the mark-and-sweep algorithm collects all the garbage. Once all unreferenced objects have been reclaimed, the normal execution of the program can resume.

The mark-and-sweep algorithm is **called a _tracing_ garbage collector** because is _traces out_ the entire collection of objects that are directly or indirectly accessible by the program. The objects that a program can access directly are those objects which are referenced by local variables on the processor stack as well as by any static variables that refer to objects. In the context of garbage collection, these variables are called the _roots_ . An object is indirectly accessible if it is referenced by a field in some other (directly or indirectly) accessible object. An accessible object is said to be _live_ . Conversely, an object which is not _live_ is garbage.

The mark-and-sweep algorithm **consists of two phases**: In the first phase, it finds and marks all accessible objects. The first phase is called the _mark_ phase. In the second phase, the garbage collection algorithm scans through the heap and reclaims all the unmarked objects. The second phase is called the _sweep_ phase.

![](https://cdn-images-1.medium.com/freeze/max/30/1*BCwoxkkyuAtWWu5bkjU1ww.gif?q=20)

![](https://cdn-images-1.medium.com/max/800/1*BCwoxkkyuAtWWu5bkjU1ww.gif)

(a) shows the conditions before garbage collection begins. In this example, there is a single root variable

(b) shows the effect of the _mark_ phase of the algorithm. At this point, all live objects have been marked

(c) shows the objects left after the _sweep_ phase has been completed. Only live objects remain in memory and the marked fields have all been set to false again.