解读GC日志
==


This post is the last teaser before we publish the Plumbr GC handbook next week. In this post, we will review how garbage collector logs look like and what useful information one can obtain from them. For this purpose, we have turned on GC logging for a JVM running with -XX:+UseSerialGC by using the following startup parameters:


这篇文章是我们发布前的最后急转弯Plumbr GC手册下周。在这篇文章中,我们将回顾垃圾收集器日志如何看起来像人能从他们身上获得什么有用的信息。为了这个目的,我们把GC日志记录的JVM上运行- xx:+ UseSerialGC通过使用下面的启动参数:


	-XX:+PrintGCDetails
	-XX:+PrintGCDateStamps
	-XX:+PrintGCTimeStamps

This resulted in the output similar to following:

这导致了类似于下面的输出结果(为了显示,已手工折行):

	2015-05-26T14:45:37.987-0200: 151.126: 
	  [GC (Allocation Failure) 151.126:
	    [DefNew: 629119K->69888K(629120K), 0.0584157 secs]
	    1619346K->1273247K(2027264K), 0.0585007 secs] 
	  [Times: user=0.06 sys=0.00, real=0.06 secs]

	2015-05-26T14:45:59.690-0200: 172.829: 
	  [GC (Allocation Failure) 172.829: 
	    [DefNew: 629120K->629120K(629120K), 0.0000372 secs]
	    172.829: [Tenured: 1203359K->755802K(1398144K), 0.1855567 secs]
	    1832479K->755802K(2027264K),
	    [Metaspace: 6741K->6741K(1056768K)], 0.1856954 secs]
	  [Times: user=0.18 sys=0.00, real=0.18 secs]


The above short snippet from the GC logs exposes a lot of information about what is going on inside the JVM. As a matter of fact, in this snippet there were two Garbage Collection events taking place, one of them cleaning Young generation and the other one taking care of entire heap. Lets look at the first one of these events, a Minor GC, taking place in Young generation:

上面的短片段的GC日志暴露很多信息在JVM中发生了什么。事实上,在这段代码有两个垃圾收集事件发生,其中一个清洁年轻一代和另一个照顾整个堆。让我们看看第一个这些事件,一个小GC,发生在年轻一代:


<p style="color:blue"><code>2015-05-26T14:45:37.987-0200</code><sup style="color:black;">1</sup>:<code>151.126</code><sup style="color:black;">2</sup>:[<code>GC</code><sup style="color:black;">3</sup>(<code>Allocation Failure</code><sup style="color:black;">4</sup>) 

151.126: [<code>DefNew</code><sup style="color:black;">5</sup>:<code>629119K-&gt;69888K</code><sup style="color:black;">6</sup><code>(629120K)</code><sup style="color:black;">7</sup><br/>, 

 0.0584157 secs]<code>1619346K-&gt;1273247K</code><sup style="color:black;">8</sup><code>(2027264K)</code><sup style="color:black;">9</sup>,<code>0.0585007 secs</code><sup style="color:black;">10</sup>]<code>

[Times: user=0.06 sys=0.00, real=0.06 secs]</code><sup style="color:black;">11</sup></p>


1. `2015-05-26T14:45:37.987-0200` – Time when the GC event started.
1. `151.126` – Time when the GC event started, relative to the JVM startup time. Measured in seconds.
1. `GC` – Flag to distinguish between Minor & Full GC. This time it is indicating that this was a Minor GC.
1. `Allocation Failure` – Cause of the collection. In this case, the GC is triggered due to a data structure not fitting into any region in Young Generation.
1. `DefNew` – Name of the garbage collector used. This cryptic name stands for the single-threaded mark-copy stop-the-world garbage collector used to clean Young generation.
1. `629119K->69888K` – Usage of Young generation before and after collection.
1. `(629120K)` – Total size of the Young generation.
1. `1619346K->1273247K` – Total used heap before and after collection.
1. `(2027264K)` – Total available heap.
1. `0.0585007 secs` – Duration of the GC event in seconds.
1. `[Times: user=0.06 sys=0.00, real=0.06 secs]` – Duration of the GC event, measured in different categories:
 - **user** – Total CPU time that was consumed by Garbage Collector threads during this collection
 - **sys** – Time spent in OS calls or waiting for system event
 - **real** – Clock time for which your application was stopped. As Serial Garbage Collector always uses just a single thread, real time is thus equal to the sum of user and system times.


From the above snippet we can understand exactly what was happening with memory consumption inside the JVM during the GC event. Before this collection heap usage totaled at 1,619,346K. Out of this amount, the Young generation consumed 629,119K. From this we can calculate the Old generation usage being equal to 990,227K.

A more important conclusion is hidden in the next batch of numbers, indicating that after the collection young generation usage decreased by 559,231K, but total heap usage decreased only by 346,099K. From this we can again derive that 213,132K of objects had been promoted from Young generation to Old.

This GC event can be illustrated with the following snapshots depicting memory usage right before the GC started and right after it finished:


从上面的片段我们可以理解到底发生了什么事,GC活动期间在JVM内存消耗。在此之前收集堆使用总计在1619346 k。这个数量,年轻一代消费629119 k。从这个我们可以计算旧一代使用等于990227 k。

更重要的结论是隐藏在第二批数据,表明后收集年轻一代使用下降了559231 k,但是只有346099 k总堆使用情况减少。从这一点来看,我们可以再次获得213132 k的对象从年轻一代被提升到老。

这个GC事件可以用下列快照描述内存使用GC之前开始,正确的结束后:

![](serial-gc-in-young-generation.png)

If you found the content to be useful, check out the entire [Java Garbage Collection Handbook](https://plumbr.eu/java-garbage-collection-handbook) where this example was extracted from.

如果你发现内容是有用,看看整个[Java垃圾收集手册](https://plumbr.eu/java-garbage-collection-handbook)这个例子中提取。



原文链接: [Understanding Garbage Collection Logs](https://plumbr.eu/blog/garbage-collection/understanding-garbage-collection-logs)

翻译日期: 2015年10月17日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
