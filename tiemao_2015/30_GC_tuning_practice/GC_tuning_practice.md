GC调优实战
==

![](garbage-collection.jpeg)

Tuning Garbage Collection is no different from any other performance-tuning activities.

GC调优(Tuning Garbage Collection)和其他的性能调优行为并没有什么不同。

Instead of giving in to temptation for tweaking random parts of the application, you need to make sure you understand the current situation and the desired outcome. In general it is as easy as following the following process:

调优并不是随机调整下应用程序的某个部分，而是需要你真正的了解程序的当前运行状况，并对调优结果有一定的预期。一般来说调优可以分为以下步骤：


1. 列出性能目标(State your performance goals)
2. 执行测试(Run tests)
3. 衡量性能(Measure)
4. 与目标进行对比(Compare to goals)
5. 修改某个配置,然后从第2步开始继续测试(Make a change and go back to running tests)


It is important that the goals can be set and measured the three dimensions, all relevant to performance tuning. These goals include latency, throughput and capacity, understanding which I can recommend to take a look at the corresponding chapter in the [Garbage Collection Handbook](https://plumbr.eu/handbook/gc-tuning#throughput-vs-latency-vs-capacity).


比较重要的是,在所有性能相关的调优中, 性能指标(goals)都可以通过三个维度来进行设置和衡量。 包括响应延迟(latency)、吞吐量(throughput)以及处理能力(capacity), 详细信息请阅读 [垃圾收集手册](https://plumbr.eu/handbook/gc-tuning#throughput-vs-latency-vs-capacity)中相应的章节。


Lets see how we can start investigating how setting and hitting such goals looks like in practice. For this purpose, lets take a look at an example code:


让我们在实践中来研究如何进行配置并达成性能指标。为此, 请先阅读下面的示例代码:



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

上面的代码每100 毫秒就提交2个job，每个job都模拟具体的对象生命周期: 创建对象, 在预定的时间后扔掉, 然后就不管了, 这样 GC 就可以回收相应的内存了。

在运行这个示例时需要用下面的参数打开GC日志:


	-XX:+PrintGCDetails
	-XX:+PrintGCDateStamps
	-XX:+PrintGCTimeStamps

we start seeing the impact of GC immediately in the log files, similar to the following:

然后就可以在日志文件中看到产生了GC, 类似下面这样:


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


基于日志中的信息, 我们需要在心里记住,通过三个不同的指标来改善这种情况:


1. Making sure the worst-case GC pause does not exceed a predetermined threshold
1. Making sure the total time during which application threads are stopped does not exceed a predetermined threshold
1. Reducing infrastructure costs while making sure we can still achieve reasonable latency and/or throughput targets.

For this, the code above was run for 10 minutes on three different configurations resulting in three very different results summarized in the following table:

为此,让上面的代码在3种不同的配置下执行10分钟,会得出如下三种非常不同的结果:


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

实验中,将同样的代码运行在不同的GC算法和不同的堆内存下, 用来衡量垃圾收集的暂停时间,这关系到响应延迟和吞吐量。实验的细节和关于结果的详细解释发表在我们的[垃圾收集手册](https://plumbr.eu/handbook/gc-tuning#tuning-for-latency)里面。请查看手册以了解如何尽可能简单地配置示例程序,以表现出完全不同的延迟,吞吐量和处理能力。

Note that in order to keep the example as simple as possible only a limited amount of input parameters were changed, for example the experiments do not test on different number of cores or with a different heap layout.

注意,为了保持示例程序尽可能的简洁,只改变了很少的输入参数, 示例中并没有在不同的CPU内核下测试, 也没有采用不同的堆布局。



原文链接: [Understanding Garbage Collection Logs](https://plumbr.eu/blog/garbage-collection/understanding-garbage-collection-logs)

翻译日期: 2015年10月17日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
