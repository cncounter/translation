# Understanding G1 GC Logs

# 理解G1的GC日志


The purpose of this post is to explain the meaning of GC logs generated with some tracing and diagnostic options for G1 GC. We will take a look at the output generated with **`PrintGCDetails`** which is a product flag and provides the most detailed level of information. Along with that, we will also look at the output of two diagnostic flags that get enabled with **`-XX:+UnlockDiagnosticVMOptions`** option : **`G1PrintRegionLivenessInfo`** that prints the occupancy and the amount of space used by live objects in each region at the end of the marking cycle and **`G1PrintHeapRegions`** that provides detailed information on the heap regions being allocated and reclaimed.

本文的目的是解释 G1 GC 中一些跟踪(tracing)和诊断(diagnostic)选项所产生的 GC 日志的含义。我们先来看 **`PrintGCDetails`** 的输出，这是一个产品级(product)标志，能提供最详细的信息。与此同时，还会介绍两个需要配合 **`-XX:+UnlockDiagnosticVMOptions`** 选项才能启用的诊断标志：**`G1PrintRegionLivenessInfo`**，它在标记周期结束时打印每个 region 的占用率以及存活对象所占用的空间大小；以及 **`G1PrintHeapRegions`**，它提供堆中 region 的分配和回收的详细信息。


We will be looking at the logs generated with JDK 1.7.0_04 using these options.

下面的日志由 JDK 1.7.0_04 配合这些选项生成。


## <u>Option -XX:+PrintGCDetails</u>


Here's a sample log of G1 collection generated with PrintGCDetails.

下面是使用 PrintGCDetails 生成的一个 G1 回收日志示例。


	0.522: [GC pause (young), 0.15877971 secs]
	   [Parallel Time: 157.1 ms]
	      [GC Worker Start (ms):  522.1  522.2  522.2  522.2
	       Avg: 522.2, Min: 522.1, Max: 522.2, Diff:   0.1]
	      [Ext Root Scanning (ms):  1.6  1.5  1.6  1.9
	       Avg:   1.7, Min:   1.5, Max:   1.9, Diff:   0.4]
	      [Update RS (ms):  38.7  38.8  50.6  37.3
	       Avg:  41.3, Min:  37.3, Max:  50.6, Diff:  13.3]
	         [Processed Buffers : 2 2 3 2
	          Sum: 9, Avg: 2, Min: 2, Max: 3, Diff: 1]
	      [Scan RS (ms):  9.9  9.7  0.0  9.7
	       Avg:   7.3, Min:   0.0, Max:   9.9, Diff:   9.9]
	      [Object Copy (ms):  106.7  106.8  104.6  107.9
	       Avg: 106.5, Min: 104.6, Max: 107.9, Diff:   3.3]
	      [Termination (ms):  0.0  0.0  0.0  0.0
	       Avg:   0.0, Min:   0.0, Max:   0.0, Diff:   0.0]
	         [Termination Attempts : 1 4 4 6
	          Sum: 15, Avg: 3, Min: 1, Max: 6, Diff: 5]
	      [GC Worker End (ms):  679.1  679.1  679.1  679.1
	       Avg: 679.1, Min: 679.1, Max: 679.1, Diff:   0.1]
	      [GC Worker (ms):  156.9  157.0  156.9  156.9
	       Avg: 156.9, Min: 156.9, Max: 157.0, Diff:   0.1]
	      [GC Worker Other (ms):  0.3  0.3  0.3  0.3
	       Avg:   0.3, Min:   0.3, Max:   0.3, Diff:   0.0]
	   [Clear CT:   0.1 ms]
	   [Other:   1.5 ms]
	      [Choose CSet:   0.0 ms]
	      [Ref Proc:   0.3 ms]
	      [Ref Enq:   0.0 ms]
	      [Free CSet:   0.3 ms]
	   [Eden: 12M(12M)->0B(10M) Survivors: 0B->2048K Heap: 13M(64M)->9739K(64M)]
	 [Times: user=0.59 sys=0.02, real=0.16 secs]


This is the typical log of an Evacuation Pause (G1 collection) in which live objects are copied from one set of regions (young OR young+old) to another set. It is a stop-the-world activity and all the application threads are stopped at a safepoint during this time.

这是典型的 Evacuation Pause（G1 回收）日志，其中存活对象会从一组 region（young，或者 young+old）复制到另一组 region。这是一个 stop-the-world 活动，在此期间所有应用线程都会在安全点(safepoint)处暂停。

This pause is made up of several sub-tasks indicated by the indentation in the log entries. Here's is the top most line that gets printed for the Evacuation Pause.

这一次暂停由若干子任务组成，日志条目的缩进体现了这些子任务的层级关系。下面是 Evacuation Pause 打印出的最顶层那一行。

    0.522: [GC pause (young), 0.15877971 secs]

This is the highest level information telling us that it is an Evacuation Pause that started at 0.522 secs from the start of the process, in which all the regions being evacuated are Young i.e. Eden and Survivor regions. This collection took 0.15877971 secs to finish.

这是最高层级的信息，它告诉我们：这是一次 Evacuation Pause，从进程启动后 0.522 秒开始，其中被 evacuate 的所有 region 都是 Young（即 Eden 和 Survivor region）。本次回收耗时 0.15877971 秒完成。

Evacuation Pauses can be mixed as well. In which case the set of regions selected include all of the young regions as well as some old regions.

Evacuation Pause 也可以混搭(mixed)。这种情况下，被选中的 region 集合既包含所有 young region，也包含一些 old region。


    1.730: [GC pause (mixed), 0.32714353 secs]

Let's take a look at all the sub-tasks performed in this Evacuation Pause.

下面来看这次 Evacuation Pause 中执行的所有子任务。

    [Parallel Time: 157.1 ms]

Parallel Time is the total elapsed time spent by all the parallel GC worker threads. The following lines correspond to the parallel tasks performed by these worker threads in this total parallel time, which in this case is 157.1 ms.

Parallel Time 是所有并行 GC 工作线程(worker thread)花费的总耗时。接下来的几行对应这些工作线程在这段总并行时间内(本例为 157.1 ms)执行的并行任务。

    [GC Worker Start (ms): 522.1 522.2 522.2 522.2
    Avg: 522.2, Min: 522.1, Max: 522.2, Diff: 0.1]

The first line tells us the start time of each of the worker thread in milliseconds. The start times are ordered with respect to the worker thread ids – thread 0 started at 522.1ms and thread 1 started at 522.2ms from the start of the process. The second line tells the Avg, Min, Max and Diff of the start times of all of the worker threads.

第一行以毫秒为单位给出了每个工作线程的启动时间。这些启动时间按工作线程 id 排序——线程 0 从进程启动后 522.1ms 开始，线程 1 从 522.2ms 开始。第二行给出所有工作线程启动时间的平均值(Avg)、最小值(Min)、最大值(Max)和差值(Diff)。

    [Ext Root Scanning (ms): 1.6 1.5 1.6 1.9
    Avg: 1.7, Min: 1.5, Max: 1.9, Diff: 0.4]

This gives us the time spent by each worker thread scanning the roots (globals, registers, thread stacks and VM data structures). Here, thread 0 took 1.6ms to perform the root scanning task and thread 1 took 1.5 ms. The second line clearly shows the Avg, Min, Max and Diff of the times spent by all the worker threads.

这给出每个工作线程扫描根(roots，即全局变量、寄存器、线程栈和 VM 数据结构)所花费的时间。这里线程 0 执行根扫描任务用了 1.6ms，线程 1 用了 1.5ms。第二行清楚地展示了所有工作线程耗时的 Avg、Min、Max 和 Diff。

    [Update RS (ms): 38.7 38.8 50.6 37.3
    Avg: 41.3, Min: 37.3, Max: 50.6, Diff: 13.3]

Update RS gives us the time each thread spent in updating the Remembered Sets. Remembered Sets are the data structures that keep track of the references that point into a heap region. Mutator threads keep changing the object graph and thus the references that point into a particular region. We keep track of these changes in buffers called Update Buffers. The Update RS sub-task processes the update buffers that were not able to be processed concurrently, and updates the corresponding remembered sets of all regions.

Update RS 给出每个线程更新记忆集(Remembered Sets)所花费的时间。记忆集是记录指向某个堆 region 的引用的数据结构。Mutator 线程会不断改变对象图(object graph)，因而也会改变指向某个特定 region 的引用。我们在称为 Update Buffer 的缓冲区中跟踪这些变化。Update RS 子任务负责处理那些无法并发处理的 update buffer，并更新所有 region 对应的记忆集。

    [Processed Buffers : 2 2 3 2
    Sum: 9, Avg: 2, Min: 2, Max: 3, Diff: 1]

This tells us the number of Update Buffers (mentioned above) processed by each worker thread.

这给出每个工作线程处理的 Update Buffer（上面提到的）数量。

    [Scan RS (ms): 9.9 9.7 0.0 9.7
    Avg: 7.3, Min: 0.0, Max: 9.9, Diff: 9.9]

These are the times each worker thread had spent in scanning the Remembered Sets. Remembered Set of a region contains cards that correspond to the references pointing into that region. This phase scans those cards looking for the references pointing into all the regions of the collection set.

这是每个工作线程扫描记忆集所花费的时间。一个 region 的记忆集包含若干 card，这些 card 对应该 region 中被指向的引用。该阶段会扫描这些 card，查找指向 collection set 中所有 region 的引用。

    [Object Copy (ms): 106.7 106.8 104.6 107.9
    Avg: 106.5, Min: 104.6, Max: 107.9, Diff: 3.3]

These are the times spent by each worker thread copying live objects from the regions in the Collection Set to the other regions.

这是每个工作线程将存活对象从 collection set 中的 region 复制到其他 region 所花费的时间。

    [Termination (ms): 0.0 0.0 0.0 0.0
    Avg: 0.0, Min: 0.0, Max: 0.0, Diff: 0.0]

Termination time is the time spent by the worker thread offering to terminate. But before terminating, it checks the work queues of other threads and if there are still object references in other work queues, it tries to steal object references, and if it succeeds in stealing a reference, it processes that and offers to terminate again.

Termination 时间是工作线程提出终止(offer to terminate)所花费的时间。但在终止之前，它会检查其他线程的工作队列；如果其他工作队列中仍有对象引用，它会尝试窃取(steal)对象引用，一旦窃取成功就处理该引用，然后再次提出终止。

    [Termination Attempts : 1 4 4 6
    Sum: 15, Avg: 3, Min: 1, Max: 6, Diff: 5]

This gives the number of times each thread has offered to terminate.

这给出每个线程提出终止的次数。

    [GC Worker End (ms): 679.1 679.1 679.1 679.1
    Avg: 679.1, Min: 679.1, Max: 679.1, Diff: 0.1]

These are the times in milliseconds at which each worker thread stopped.

这是每个工作线程停止的时间，单位为毫秒。

    [GC Worker (ms): 156.9 157.0 156.9 156.9
    Avg: 156.9, Min: 156.9, Max: 157.0, Diff: 0.1]

These are the total lifetimes of each worker thread.

这是每个工作线程的总存活时间。

    [GC Worker Other (ms): 0.3 0.3 0.3 0.3
    Avg: 0.3, Min: 0.3, Max: 0.3, Diff: 0.0]

These are the times that each worker thread spent in performing some other tasks that we have not accounted above for the total Parallel Time.

这是每个工作线程执行其他任务所花费的时间，这些任务在前面统计总 Parallel Time 时未计入。

    [Clear CT: 0.1 ms]

This is the time spent in clearing the Card Table. This task is performed in serial mode.

这是清除 Card Table 所花费的时间。该任务以串行(serial)方式执行。

    [Other: 1.5 ms]

Time spent in the some other tasks listed below. The following sub-tasks (which individually may be parallelized) are performed serially.

这是执行下面列出的其他一些任务所花费的时间。以下子任务（各自内部可能并行）以串行方式执行。

    [Choose CSet: 0.0 ms]

Time spent in selecting the regions for the Collection Set.

这是为 collection set 选择 region 所花费的时间。

    [Ref Proc: 0.3 ms]

Total time spent in processing Reference objects.

这是处理 Reference 对象所花费的总时间。

    [Ref Enq: 0.0 ms]

Time spent in enqueuing references to the ReferenceQueues.

这是将引用入队(enqueue)到 ReferenceQueue 所花费的时间。

    [Free CSet: 0.3 ms]

Time spent in freeing the collection set data structure.

这是释放 collection set 数据结构所花费的时间。

    [Eden: 12M(12M)->0B(13M) Survivors: 0B->2048K Heap: 14M(64M)->9739K(64M)]

This line gives the details on the heap size changes with the Evacuation Pause. This shows that Eden had the occupancy of 12M and its capacity was also 12M before the collection. After the collection, its occupancy got reduced to 0 since everything is evacuated/promoted from Eden during a collection, and its target size grew to 13M. The new Eden capacity of 13M is not reserved at this point. This value is the target size of the Eden. Regions are added to Eden as the demand is made and when the added regions reach to the target size, we start the next collection.

这一行给出 Evacuation Pause 期间堆大小的变化详情。它表明：回收前 Eden 的占用为 12M，容量也是 12M。回收后，由于回收期间 Eden 中的所有内容都被 evacuate/晋升(promote)，其占用降为 0，而其目标大小增长到了 13M。此时并不会预留新的 13M Eden 容量，这个值只是 Eden 的目标大小。region 会按需加入 Eden，当加入的 region 达到目标大小时，就启动下一次回收。

Similarly, Survivors had the occupancy of 0 bytes and it grew to 2048K after the collection. The total heap occupancy and capacity was 14M and 64M receptively before the collection and it became 9739K and 64M after the collection.

类似地，Survivors 的占用为 0 字节，回收后增长到 2048K。回收前堆的总占用和容量分别是 14M 和 64M，回收后变为 9739K 和 64M。

Apart from the evacuation pauses, G1 also performs concurrent-marking to build the live data information of regions.

除了 Evacuation Pause 之外，G1 还会执行并发标记(concurrent-marking)，以构建各 region 的存活数据信息。

	1.416: [GC pause (young) (initial-mark), 0.62417980 secs]

	…....

	2.042: [GC concurrent-root-region-scan-start]

	2.067: [GC concurrent-root-region-scan-end, 0.0251507]

	2.068: [GC concurrent-mark-start]

	3.198: [GC concurrent-mark-reset-for-overflow]

	4.053: [GC concurrent-mark-end, 1.9849672 sec]

	4.055: [GC remark 4.055: [GC ref-proc, 0.0000254 secs], 0.0030184 secs]

	 [Times: user=0.00 sys=0.00, real=0.00 secs]

	4.088: [GC cleanup 117M->106M(138M), 0.0015198 secs]

	 [Times: user=0.00 sys=0.00, real=0.00 secs]

	4.090: [GC concurrent-cleanup-start]

	4.091: [GC concurrent-cleanup-end, 0.0002721] 

The first phase of a marking cycle is Initial Marking where all the objects directly reachable from the roots are marked and this phase is piggy-backed on a fully young Evacuation Pause.

标记周期的第一个阶段是 Initial Marking（初始标记），在此阶段标记所有从根直接可达的对象，该阶段依附(piggy-back)在一次完整的 young Evacuation Pause 上进行。


    2.042: [GC concurrent-root-region-scan-start]

This marks the start of a concurrent phase that scans the set of root-regions which are directly reachable from the survivors of the initial marking phase.

这标志着并发阶段的开始，该阶段扫描从初始标记阶段的 survivors 直接可达的 root region 集合。

    2.067: [GC concurrent-root-region-scan-end, 0.0251507]

End of the concurrent root region scan phase and it lasted for 0.0251507 seconds.

并发 root region 扫描阶段结束，持续了 0.0251507 秒。

    2.068: [GC concurrent-mark-start]

Start of the concurrent marking at 2.068 secs from the start of the process.

从进程启动后 2.068 秒开始并发标记。

    3.198: [GC concurrent-mark-reset-for-overflow]

This indicates that the global marking stack had became full and there was an overflow of the stack. Concurrent marking detected this overflow and had to reset the data structures to start the marking again.

这表明全局标记栈(marking stack)已满，发生了栈溢出。并发标记检测到这次溢出，不得不重置数据结构以重新开始标记。

    4.053: [GC concurrent-mark-end, 1.9849672 sec]

End of the concurrent marking phase and it lasted for 1.9849672 seconds.

并发标记阶段结束，持续了 1.9849672 秒。

    4.055: [GC remark 4.055: [GC ref-proc, 0.0000254 secs], 0.0030184 secs]

This corresponds to the remark phase which is a stop-the-world phase. It completes the left over marking work (SATB buffers processing) from the previous phase. In this case, this phase took 0.0030184 secs and out of which 0.0000254 secs were spent on Reference processing.

这对应 remark 阶段，它是一个 stop-the-world 阶段。它完成前一阶段遗留的标记工作(SATB buffer 处理)。本例中该阶段耗时 0.0030184 秒，其中 0.0000254 秒花在 Reference 处理上。

    4.088: [GC cleanup 117M->106M(138M), 0.0015198 secs]

Cleanup phase which is again a stop-the-world phase. It goes through the marking information of all the regions, computes the live data information of each region, resets the marking data structures and sorts the regions according to their gc-efficiency. In this example, the total heap size is 138M and after the live data counting it was found that the total live data size dropped down from 117M to 106M.

Cleanup 阶段同样是一个 stop-the-world 阶段。它会遍历所有 region 的标记信息，计算每个 region 的存活数据信息，重置标记数据结构，并按 GC 效率(gc-efficiency)对 region 排序。本例中堆的总大小为 138M，在统计存活数据后发现总存活数据量从 117M 下降到 106M。

    4.090: [GC concurrent-cleanup-start]

This concurrent cleanup phase frees up the regions that were found to be empty (didn't contain any live data) during the previous stop-the-world phase.

这个并发清理阶段会释放前一 stop-the-world 阶段中发现的空 region（不含任何存活数据）。

    4.091: [GC concurrent-cleanup-end, 0.0002721]

Concurrent cleanup phase took 0.0002721 secs to free up the empty regions.

并发清理阶段花费 0.0002721 秒释放空 region。


## <u>Option -XX:G1PrintRegionLivenessInfo</u>

Now, let's look at the output generated with the flag G1PrintRegionLivenessInfo. This is a diagnostic option and gets enabled with -XX:+UnlockDiagnosticVMOptions. G1PrintRegionLivenessInfo prints the live data information of each region during the Cleanup phase of the concurrent-marking cycle.

下面来看使用 G1PrintRegionLivenessInfo 标志生成的输出。这是一个诊断选项，需要配合 -XX:+UnlockDiagnosticVMOptions 启用。G1PrintRegionLivenessInfo 会在并发标记周期的 Cleanup 阶段打印每个 region 的存活数据信息。

	26.896: [GC cleanup 
	### PHASE Post-Marking @ 26.896
	### HEAP committed: 0x02e00000-0x0fe00000 reserved: 0x02e00000-0x12e00000 region-size: 1048576

Cleanup phase of the concurrent-marking cycle started at 26.896 secs from the start of the process and this live data information is being printed after the marking phase. Committed G1 heap ranges from 0x02e00000 to 0x0fe00000 and the total G1 heap reserved by JVM is from 0x02e00000 to 0x12e00000. Each region in the G1 heap is of size 1048576 bytes.

并发标记周期的 Cleanup 阶段从进程启动后 26.896 秒开始，这些存活数据信息在标记阶段之后打印。已提交(committed)的 G1 堆范围是从 0x02e00000 到 0x0fe00000，JVM 保留(reserved)的 G1 堆总量是从 0x02e00000 到 0x12e00000。G1 堆中每个 region 的大小为 1048576 字节。

	### type address-range used prev-live next-live gc-eff
	### (bytes) (bytes) (bytes) (bytes/ms)

This is the header of the output that tells us about the type of the region, address-range of the region, used space in the region, live bytes in the region with respect to the previous marking cycle, live bytes in the region with respect to the current marking cycle and the GC efficiency of that region.

这是输出的表头，它告诉我们：region 的类型、region 的地址范围、region 中已使用的空间、相对于上一个标记周期的 region 存活字节数、相对于当前标记周期的 region 存活字节数，以及该 region 的 GC 效率。

	### FREE 0x02e00000-0x02f00000 0 0 0 0.0

This is a Free region.

这是一个 Free region。

	### OLD 0x02f00000-0x03000000 1048576 1038592 1038592 0.0

Old region with address-range from 0x02f00000 to 0x03000000. Total used space in the region is 1048576 bytes, live bytes as per the previous marking cycle are 1038592 and live bytes with respect to the current marking cycle are also 1038592. The GC efficiency has been computed as 0.

这是一个 Old region，地址范围从 0x02f00000 到 0x03000000。该 region 的总使用空间为 1048576 字节，按上一个标记周期统计的存活字节数为 1038592，按当前标记周期统计的存活字节数也是 1038592。计算出的 GC 效率为 0。

	### EDEN 0x03400000-0x03500000 20992 20992 20992 0.0

This is an Eden region.

这是一个 Eden region。

    ### HUMS 0x0ae00000-0x0af00000 1048576 1048576 1048576 0.0
    ### HUMC 0x0af00000-0x0b000000 1048576 1048576 1048576 0.0
    ### HUMC 0x0b000000-0x0b100000 1048576 1048576 1048576 0.0
    ### HUMC 0x0b100000-0x0b200000 1048576 1048576 1048576 0.0
    ### HUMC 0x0b200000-0x0b300000 1048576 1048576 1048576 0.0
    ### HUMC 0x0b300000-0x0b400000 1048576 1048576 1048576 0.0
    ### HUMC 0x0b400000-0x0b500000 1001480 1001480 1001480 0.0

These are the continuous set of regions called Humongous regions for storing a large object. HUMS (Humongous starts) marks the start of the set of humongous regions and HUMC (Humongous continues) tags the subsequent regions of the humongous regions set.

这些是一组连续的、称为 Humongous region 的 region，用于存储大对象(large object)。HUMS（Humongous starts）标记 humongous region 集合的起始，HUMC（Humongous continues）标记 humongous region 集合中后续的 region。

    ### SURV 0x09300000-0x09400000 16384 16384 16384 0.0
This is a Survivor region.

这是一个 Survivor region。

    ### SUMMARY capacity: 208.00 MB used: 150.16 MB / 72.19 % prev-live: 149.78 MB / 72.01 % next-live: 142.82 MB / 68.66 %

At the end, a summary is printed listing the capacity, the used space and the change in the liveness after the completion of concurrent marking. In this case, G1 heap capacity is 208MB, total used space is 150.16MB which is 72.19% of the total heap size, live data in the previous marking was 149.78MB which was 72.01% of the total heap size and the live data as per the current marking is 142.82MB which is 68.66% of the total heap size.

最后会打印一份摘要，列出并发标记完成后的容量、已使用空间以及存活数据的变化。本例中，G1 堆容量为 208MB，总使用空间为 150.16MB，占总堆大小的 72.19%；上一个标记周期中的存活数据为 149.78MB，占总堆大小的 72.01%；按当前标记统计的存活数据为 142.82MB，占总堆大小的 68.66%。


## <u>Option -XX:+G1PrintHeapRegions</u>

G1PrintHeapRegions option logs the regions related events when regions are committed, allocated into or are reclaimed.

G1PrintHeapRegions 选项会记录 region 相关的事件，包括 region 被提交(commit)、被分配(allocate)以及被回收(reclaim)时的日志。

COMMIT/UNCOMMIT events

COMMIT/UNCOMMIT 事件


	G1HR COMMIT [0x6e900000,0x6ea00000]

	G1HR COMMIT [0x6ea00000,0x6eb00000]


Here, the heap is being initialized or expanded and the region (with bottom: 0x6eb00000 and end: 0x6ec00000) is being freshly committed. COMMIT events are always generated in order i.e. the next COMMIT event will always be for the uncommitted region with the lowest address.

这里，堆正在初始化或扩容，region（bottom 为 0x6eb00000、end 为 0x6ec00000）被新提交。COMMIT 事件总是按顺序生成，即下一个 COMMIT 事件总是针对地址最低的未提交 region。


	G1HR UNCOMMIT [0x72700000,0x72800000]

	G1HR UNCOMMIT [0x72600000,0x72700000]


Opposite to COMMIT. The heap got shrunk at the end of a Full GC and the regions are being uncommitted. Like COMMIT, UNCOMMIT events are also generated in order i.e. the next UNCOMMIT event will always be for the committed region with the highest address.

与 COMMIT 相反。在 Full GC 结束时堆被收缩(shrunk)，region 被取消提交(uncommit)。与 COMMIT 一样，UNCOMMIT 事件也按顺序生成，即下一个 UNCOMMIT 事件总是针对地址最高的已提交 region。

GC Cycle events

GC 周期事件


	G1HR #StartGC 7
	G1HR CSET 0x6e900000
	G1HR REUSE 0x70500000
	G1HR ALLOC(Old) 0x6f800000
	G1HR RETIRE 0x6f800000 0x6f821b20
	G1HR #EndGC 7

This shows start and end of an Evacuation pause. This event is followed by a GC counter tracking both evacuation pauses and Full GCs. Here, this is the 7th GC since the start of the process.

这显示了 Evacuation pause 的开始和结束。该事件后面跟着一个 GC 计数器，同时跟踪 evacuation pause 和 Full GC。这里，这是进程启动以来的第 7 次 GC。


    G1HR #StartFullGC 17
    G1HR UNCOMMIT [0x6ed00000,0x6ee00000]

    G1HR POST-COMPACTION(Old) 0x6e800000 0x6e854f58
    G1HR #EndFullGC 17

Shows start and end of a Full GC. This event is also followed by the same GC counter as above. This is the 17th GC since the start of the process.

显示 Full GC 的开始和结束。该事件后面同样跟着上面提到的 GC 计数器。这是进程启动以来的第 17 次 GC。

ALLOC events

ALLOC 事件


    G1HR ALLOC(Eden) 0x6e800000

The region with bottom 0x6e800000 just started being used for allocation. In this case it is an Eden region and allocated into by a mutator thread.

bottom 为 0x6e800000 的 region 刚开始被用于分配。本例中它是一个 Eden region，由 mutator 线程向其分配对象。


    G1HR ALLOC(StartsH) 0x6ec00000 0x6ed00000
    G1HR ALLOC(ContinuesH) 0x6ed00000 0x6e000000

Regions being used for the allocation of Humongous object. The object spans over two regions.

这些 region 被用于分配 Humongous 对象。该对象跨越两个 region。


    G1HR ALLOC(SingleH) 0x6f900000 0x6f9eb010

Single region being used for the allocation of Humongous object.

单个 region 被用于分配 Humongous 对象。


    G1HR COMMIT [0x6ee00000,0x6ef00000]

    G1HR COMMIT [0x6ef00000,0x6f000000]

    G1HR COMMIT [0x6f000000,0x6f100000]

    G1HR COMMIT [0x6f100000,0x6f200000]

    G1HR ALLOC(StartsH) 0x6ee00000 0x6ef00000
    G1HR ALLOC(ContinuesH) 0x6ef00000 0x6f000000
    G1HR ALLOC(ContinuesH) 0x6f000000 0x6f100000
    G1HR ALLOC(ContinuesH) 0x6f100000 0x6f102010

Here, Humongous object allocation request could not be satisfied by the free committed regions that existed in the heap, so the heap needed to be expanded. Thus new regions are committed and then allocated into for the Humongous object.

这里，堆中已有的空闲已提交 region 无法满足 Humongous 对象的分配请求，因此需要对堆进行扩容。于是提交了新的 region，然后向其中分配该 Humongous 对象。


    G1HR ALLOC(Old) 0x6f800000

Old region started being used for allocation during GC.

Old region 在 GC 期间开始被用于分配。


    G1HR ALLOC(Survivor) 0x6fa00000

Region being used for copying old objects into during a GC.

该 region 在 GC 期间被用于复制旧对象(old objects)进去。


Note that Eden and Humongous ALLOC events are generated outside the GC boundaries and Old and Survivor ALLOC events are generated inside the GC boundaries.

注意，Eden 和 Humongous 的 ALLOC 事件生成于 GC 边界之外，而 Old 和 Survivor 的 ALLOC 事件生成于 GC 边界之内。


Other events

其他事件


    G1HR RETIRE 0x6e800000 0x6e87bd98

Retire and stop using the region having bottom 0x6e800000 and top 0x6e87bd98 for allocation.

退役(retire)并停止将 bottom 为 0x6e800000、top 为 0x6e87bd98 的 region 用于分配。


Note that most regions are full when they are retired and we omit those events to reduce the output volume. A region is retired when another region of the same type is allocated or we reach the start or end of a GC(depending on the region). So for Eden regions:

注意，大多数 region 在退役时都是满的，为减少输出量我们会省略这些事件。当同一类型的另一个 region 被分配时，或者到达 GC 的开始或结束时（取决于 region 的类型），该 region 就会退役。对于 Eden region 来说：

For example:

例如：

    1. ALLOC(Eden) Foo
    2. ALLOC(Eden) Bar
    3. StartGC

At point 2, Foo has just been retired and it was full. At point 3, Bar was retired and it was full. If they were not full when they were retired, we will have a RETIRE event:

在第 2 步，Foo 刚刚退役，并且它是满的。在第 3 步，Bar 退役，它也是满的。如果它们在退役时不是满的，就会有一个 RETIRE 事件：

    1. ALLOC(Eden) Foo
    2. RETIRE Foo top
    3. ALLOC(Eden) Bar
    4. StartGC

    G1HR CSET 0x6e900000

Region (bottom: 0x6e900000) is selected for the Collection Set. The region might have been selected for the collection set earlier (i.e. when it was allocated). However, we generate the CSET events for all regions in the CSet at the start of a GC to make sure there's no confusion about which regions are part of the CSet.

bottom 为 0x6e900000 的 region 被选入 Collection Set。该 region 可能更早（比如在被分配时）就已被选入 collection set。不过，我们会在 GC 开始时为 CSet 中的所有 region 生成 CSET 事件，以确保不会对哪些 region 属于 CSet 产生混淆。


    G1HR POST-COMPACTION(Old) 0x6e800000 0x6e839858

POST-COMPACTION event is generated for each non-empty region in the heap after a full compaction. A full compaction moves objects around, so we don't know what the resulting shape of the heap is (which regions were written to, which were emptied, etc.). To deal with this, we generate a POST-COMPACTION event for each non-empty region with its type (old/humongous) and the heap boundaries. At this point we should only have Old and Humongous regions, as we have collapsed the young generation, so we should not have eden and survivors.

在一次完整压缩(full compaction)之后，堆中每个非空 region 都会生成一个 POST-COMPACTION 事件。完整压缩会移动对象，因此我们不知道堆最终变成什么样（哪些 region 被写入、哪些被清空等）。为处理这个问题，我们会为每个非空 region 生成一个 POST-COMPACTION 事件，包含其类型（old/humongous）和堆边界。此时应该只剩下 Old 和 Humongous region，因为 young 代已被合并(collapse)，不应再有 eden 和 survivors。


POST-COMPACTION events are generated within the Full GC boundary.

POST-COMPACTION 事件生成于 Full GC 边界之内。


    G1HR CLEANUP 0x6f400000
    G1HR CLEANUP 0x6f300000
    G1HR CLEANUP 0x6f200000

These regions were found empty after remark phase of Concurrent Marking and are reclaimed shortly afterwards.

这些 region 在 Concurrent Marking 的 remark 阶段之后被发现为空，随后不久即被回收。

    G1HR #StartGC 5
    G1HR CSET 0x6f400000
    G1HR CSET 0x6e900000
    G1HR REUSE 0x6f800000

At the end of a GC we retire the old region we are allocating into. Given that its not full, we will carry on allocating into it during the next GC. This is what REUSE means. In the above case 0x6f800000 should have been the last region with an ALLOC(Old) event during the previous GC and should have been retired before the end of the previous GC.

在一次 GC 结束时，我们会退役当前正在分配的 old region。鉴于它尚未填满，我们会在下一次 GC 期间继续向它分配。这就是 REUSE 的含义。在上述情况中，0x6f800000 应该是上一次 GC 期间最后一个带有 ALLOC(Old) 事件的 region，并且应该在上一次 GC 结束前就已退役。


    G1HR ALLOC-FORCE(Eden) 0x6f800000

A specialization of ALLOC which indicates that we have reached the max desired number of the particular region type (in this case: Eden), but we decided to allocate one more. Currently it's only used for Eden regions when we extend the young generation because we cannot do a GC as the GC-Locker is active.

这是 ALLOC 的一种特化形式，表示我们已经达到了特定 region 类型（本例中为 Eden）期望的最大数量，但还是决定再多分配一个。目前它仅在扩展 young 代时用于 Eden region，因为我们无法执行 GC，因为 GC-Locker 处于活动状态。

    G1HR EVAC-FAILURE 0x6f800000

During a GC, we have failed to evacuate an object from the given region as the heap is full and there is no space left to copy the object. This event is generated within GC boundaries and exactly once for each region from which we failed to evacuate objects.

在一次 GC 期间，由于堆已满、没有剩余空间可供复制对象，我们未能从给定 region 中 evacuate 某个对象。该事件生成于 GC 边界之内，且对于每个 evacuation 失败的 region 恰好生成一次。


When Heap Regions are reclaimed ?

何时回收 Heap Region？


It is also worth mentioning when the heap regions in the G1 heap are reclaimed.

也值得一提 G1 堆中的 heap region 是在何时被回收的。


All regions that are in the CSet (the ones that appear in CSET events) are reclaimed at the end of a GC. The exception to that are regions with EVAC-FAILURE events.

所有位于 CSet 中的 region（即在 CSET 事件中出现的那些）都会在 GC 结束时被回收。例外是带有 EVAC-FAILURE 事件的 region。

All regions with CLEANUP events are reclaimed.

所有带有 CLEANUP 事件的 region 都会被回收。

After a Full GC some regions get reclaimed (the ones from which we moved the objects out). But that is not shown explicitly, instead the non-empty regions that are left in the heap are printed out with the POST-COMPACTION events.

在一次 Full GC 之后，一些 region 会被回收（即那些对象已被移走的 region）。但这不会显式展示，取而代之的是，堆中剩下的非空 region 会通过 POST-COMPACTION 事件打印出来。








原文链接: [https://blogs.oracle.com/poonam/entry/understanding_g1_gc_logs](https://blogs.oracle.com/poonam/entry/understanding_g1_gc_logs)


