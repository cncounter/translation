GC调优实战
==

![](garbage-collection.jpeg)

Tuning Garbage Collection is no different from any other performance-tuning activities.

Instead of giving in to temptation for tweaking random parts of the application, you need to make sure you understand the current situation and the desired outcome. In general it is as easy as following the following process:

微调垃圾收集从任何其他性能调优活动也不例外。

而不是屈服于诱惑对于调整的随机部分应用程序,您需要确保您了解当前形势和期望的结果。一般来说它一样容易遵循以下流程:


1. State your performance goals
1. Run tests
1. Measure
1. Compare to goals
1. Make a change and go back to running tests

It is important that the goals can be set and measured the three dimensions, all relevant to performance tuning. These goals include latency, throughput and capacity, understanding which I can recommend to take a look at the corresponding chapter in the [Garbage Collection Handbook](https://plumbr.eu/handbook/gc-tuning#throughput-vs-latency-vs-capacity).

Lets see how we can start investigating how setting and hitting such goals looks like in practice. For this purpose, lets take a look at an example code:

重要的是目标可以设置和测量三维空间中,所有相关的性能调优。这些目标包括延迟、吞吐量和能力,理解我可以推荐看看垃圾收集手册中相应的章。

让我们看看我们如何开始研究如何设置和在实践中达到这些目标的样子。为此,让我们看一个示例代码:



	//imports skipped for brevity
	public class Producer implements Runnable {

	  private static ScheduledExecutorService executorService 
		= Executors.newScheduledThreadPool(2);

	  private Deque<byte[]> deque;
	  private int objectSize;
	  private int queueSize;

	  public Producer(int objectSize, int ttl) {
	    this.deque = new ArrayDeque<byte[]>();
	    this.objectSize = objectSize;
	    this.queueSize = ttl * 1000;
	  }

	  @Override
	  public void run() {
	    for (int i = 0; i < 100; i++) {
	      deque.add(new byte[objectSize]);
	      if (deque.size() > queueSize) {
		deque.poll();
	      }
	    }
	  }

	  public static void main(String[] args) 
		throws InterruptedException {
	    executorService.scheduleAtFixedRate(
		new Producer(200 * 1024 * 1024 / 1000, 5),
		0, 100, TimeUnit.MILLISECONDS);
	    executorService.scheduleAtFixedRate(
		new Producer(50 * 1024 * 1024 / 1000, 120),
		0, 100, TimeUnit.MILLISECONDS);
	    TimeUnit.MINUTES.sleep(10);
	    executorService.shutdownNow();
	  }
	}

The code is submitting two jobs to run every 100 ms. Each job emulates objects with the specific lifespan: it creates objects, lets them leave for a predetermined amount of time and then forgets about them, allowing GC to reclaim the memory.

When running the example with GC logging turned on with the following parameters

代码提交两份工作运行每100女士每个作业模拟的对象具体的寿命:它创建对象,让他们去预定的时间,然后忘记,允许GC回收内存。

当运行这个例子与GC日志记录打开以下参数:


	-XX:+PrintGCDetails
	-XX:+PrintGCDateStamps
	-XX:+PrintGCTimeStamps

we start seeing the impact of GC immediately in the log files, similar to the following:

我们开始看到马上GC日志文件的影响,类似如下:


	2015-06-04T13:34:16.119-0200: 1.723: 
	  [GC (Allocation Failure) 
	    [PSYoungGen: 114016K->73191K(234496K)] 
	    421540K->421269K(745984K), 0.0858176 secs]
	  [Times: user=0.04 sys=0.06, real=0.09 secs] 
	
	2015-06-04T13:34:16.738-0200: 2.342: 
	  [GC (Allocation Failure) 
	    [PSYoungGen: 234462K->93677K(254976K)]
	    582540K->593275K(766464K), 0.2357086 secs]
	  [Times: user=0.11 sys=0.14, real=0.24 secs] 
	
	2015-06-04T13:34:16.974-0200: 2.578: 
	  [Full GC (Ergonomics) 
	    [PSYoungGen: 93677K->70109K(254976K)]
	    [ParOldGen: 499597K->511230K(761856K)]
	    593275K->581339K(1016832K),
	    [Metaspace: 2936K->2936K(1056768K)],
	    0.0713174 secs]
	  [Times: user=0.21 sys=0.02, real=0.07 secs]


Based on the information in the log we can start improving the situation with three different goals in mind


基于日志中的信息我们可以改善这种情况有三个不同的目标


1. Making sure the worst-case GC pause does not exceed a predetermined threshold
1. Making sure the total time during which application threads are stopped does not exceed a predetermined threshold
1. Reducing infrastructure costs while making sure we can still achieve reasonable latency and/or throughput targets.

For this, the code above was run for 10 minutes on three different configurations resulting in three very different results summarized in the following table:

为此,上面的代码运行10分钟在三种不同配置导致三种非常不同的结果总结在下表中:


<table class="data compact">
<thead>
<tr>
<th><b>Heap</b></th>
<th><b>GC Algorithm</b></th>
<th><b>Useful work</b></th>
<th><b>Longest pause</b></th>
</tr>
</thead>
<tbody>
<tr>
<td>-Xmx12g</td>
<td>-XX:+UseConcMarkSweepGC</td>
<td>89.8%</td>
<td>560 ms</td>
</tr>
<tr>
<td>-Xmx12g</td>
<td>-XX:+UseParallelGC</td>
<td>91.5%</td>
<td>1,104 ms</td>
</tr>
<tr>
<td>-Xmx8g</td>
<td>-XX:+UseConcMarkSweepGC</td>
<td>66.3%</td>
<td>1,610 ms</td>
</tr>
</tbody>
</table>


The experiment ran the same code with different GC algorithms and different heap size to measure the duration of garbage collection pauses with regards to latency and throughput. Details of the experiments and interpretation of results are presented in our [Garbage Collection Handbook](https://plumbr.eu/handbook/gc-tuning#tuning-for-latency). Take a look at the handbook for examples in how simple changes in configuration turn the example to behave completely differently in regards of latency, throughput of capacity.

Note that in order to keep the example as simple as possible only a limited amount of input parameters were changed, for example the experiments do not test on different number of cores or with a different heap layout.

实验运行相同的代码不同的GC算法和不同的堆大小来衡量垃圾收集暂停的时间关于延迟和吞吐量。实验的细节和解释研究的结果发表在我们的垃圾收集手册。看看手册示例的简单配置的变化把例子表现完全不同的延迟,吞吐量的能力。
注意,为了保持尽可能简单的例子只有数量有限的输入参数改变,例如实验不测试在不同的内核数或不同堆布局。



原文链接: [Understanding Garbage Collection Logs](https://plumbr.eu/blog/garbage-collection/understanding-garbage-collection-logs)

翻译日期: 2015年10月17日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
