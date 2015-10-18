快速解读GC日志
==


本文是 Plumbr 发行的 [Java垃圾收集手册](https://plumbr.eu/java-garbage-collection-handbook) 的部分内容。文中将介绍GC日志的输出格式, 以及如何解读GC日志, 从中提取有用的信息。我们通过 `-XX:+UseSerialGC` 选项,指定JVM使用串行垃圾收集器, 并使用下面的启动参数让 JVM 打印出详细的GC日志:

	-XX:+PrintGCDetails
	-XX:+PrintGCDateStamps
	-XX:+PrintGCTimeStamps

这样配置以后，发生GC时输出的日志就类似于下面这种格式(为了显示方便,已手工折行):

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


上面的GC日志暴露了JVM中的一些信息。事实上，这个日志片段中发生了 **2** 次垃圾回收事件(Garbage Collection events)。其中一次清理的是年轻代(Young generation), 而第二次处理的是整个堆内存。下面我们来看，如何解读第一次GC事件，发生在年轻代中的小型GC(Minor GC):


<p style="color:blue">

<code>2015-05-26T14:45:37.987-0200</code><sup style="color:black;">1</sup>:<code>151.126</code><sup style="color:black;">2</sup>:[<code>GC</code><sup style="color:black;">3</sup>(<code>Allocation Failure</code><sup style="color:black;">4</sup>)<br/> 

151.126: [<code>DefNew</code><sup style="color:black;">5</sup>:<code>629119K-&gt;69888K</code><sup style="color:black;">6</sup><code>(629120K)</code><sup style="color:black;">7</sup><br/>, 

 0.0584157 secs]<code>1619346K-&gt;1273247K</code><sup style="color:black;">8</sup><code>(2027264K)</code><sup style="color:black;">9</sup>,<code>0.0585007 secs</code><sup style="color:black;">10</sup>]<code><br/>

[Times: user=0.06 sys=0.00, real=0.06 secs]</code><sup style="color:black;">11</sup>

</p>




1. `2015-05-26T14:45:37.987-0200` – GC事件(GC event)开始的时间点.
1. `151.126` – GC时间的开始时间,相对于JVM的启动时间,单位是秒(Measured in seconds).
1. `GC` – 用来区分(distinguish)是 Minor GC 还是 Full GC 的标志(Flag). 这里的 `GC` 表明本次发生的是 Minor GC.
1. `Allocation Failure` – 引起垃圾回收的原因. 本次GC是因为年轻代中没有任何合适的区域能够存放需要分配的数据结构而触发的.
1. `DefNew` – 使用的垃圾收集器的名字. `DefNew` 这个名字代表的是: 单线程(single-threaded), 采用标记复制(mark-copy)算法的, 使整个JVM暂停运行(stop-the-world)的年轻代(Young generation) 垃圾收集器(garbage collector).
1. `629119K->69888K` – 在本次垃圾收集之前和之后的年轻代内存使用情况(Usage).
1. `(629120K)` – 年轻代的总的大小(Total size).
1. `1619346K->1273247K` – 在本次垃圾收集之前和之后整个堆内存的使用情况(Total used heap).
1. `(2027264K)` – 总的可用的堆内存(Total available heap).
1. `0.0585007 secs` – GC事件的持续时间(Duration),单位是秒.
1. `[Times: user=0.06 sys=0.00, real=0.06 secs]` – GC事件的持续时间,通过多种分类来进行衡量:
 - **user** – 此次垃圾回收, 垃圾收集线程消耗的所有CPU时间(Total CPU time).
 - **sys** – 操作系统调用(OS call) 以及等待系统事件的时间(waiting for system event)
 - **real** – 应用程序暂停的时间(Clock time). 由于串行垃圾收集器(Serial Garbage Collector)只会使用单个线程, 所以 real time 等于 user 以及 system time 的总和.


通过上面的分析, 我们可以计算出在垃圾收集期间, JVM 中的内存使用情况。在垃圾收集之前, 堆内存总的使用了 **1.54G** (1,619,346K)。其中, 年轻代使用了 **614M**(629,119k)。可以算出老年代使用的内存为: **967M**(990,227K)。


下一组数据( `->` 右边)中蕴含了更重要的结论, 年轻代的内存使用在垃圾回收后下降了 **546M**(559,231k), 但总的堆内存使用(total heap usage)只减少了 **337M**(346,099k). 通过这一点,我们可以计算出, 有 **208M**(213,132K) 的年轻代对象被提升到老年代(Old)中。


这个GC事件可以用下面的示意图来表示, 上方表示GC之前的内存使用情况, 下方表示结束后的内存使用情况:


![](serial-gc-in-young-generation.png)



如果你想学习更多, 请查看完整的 [Java垃圾收集手册](https://plumbr.eu/java-garbage-collection-handbook), 本示例是从其中抽取的。



原文链接: [Understanding Garbage Collection Logs](https://plumbr.eu/blog/garbage-collection/understanding-garbage-collection-logs)

翻译日期: 2015年10月17日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
