# 业务指标采集影响系统性能问题排查

[toc]

背景:

- 规则引擎 + 图结构的执行逻辑
- Datadog 指标监控系统
- 多组 Kafka 集群

## 1. 现象描述

业务处理逻辑比较重, 执行代码的效率上不去, 系统吞吐量不足。 

部署了N个Docker节点（8C8G）, CPU使用率80~90%, 每秒吞吐量总计只有2万左右，远远小于生产者的速度。


## 2. 原因分析

经过排查，发现2个瓶颈点:

- 并行流: `parallelStream()`;
- 指标采集:  Micrometer的 `Timed` 注解, 以及 `StatsDClient#time()` 方法;


并行流的性能问题: 

如果不是纯粹CPU密集型的任务, 并行流默认会使用 ForkJoinPool 来执行, 高并发场景下会导致任务堆积以及阻塞问题。

`Timed` 注解的问题: 

这是早期进行性能调优时, 为了进行指标监控加上的;

根据业务特征, 导致这里每一条数据都会执行几十次方法(图+递归), 恰好大部分方法都标注了 `@Timed` 注解, 被 


StatsDClient指标上报客户端的实现:

```java
public final class NonBlockingStatsDClient{
    
    private final BlockingQueue<String> queue;
    // ... ... 
    // final int queueSize = Integer.MAX_VALUE
    // queue = new LinkedBlockingQueue<String>(queueSize);
    private void send(final String message) {
        queue.offer(message);
    }
}
```

LinkedBlockingQueue 之类的阻塞队列, 高并发时可能会发生一些问题, 比如 锁争抢, 队列过大等等.

```java

public class LinkedBlockingQueue<E> extends AbstractQueue<E>
        implements BlockingQueue<E>, java.io.Serializable {

    public boolean offer(E e) {
        if (e == null) throw new NullPointerException();
        final AtomicInteger count = this.count;
        if (count.get() == capacity)
            return false;
        final int c;
        final Node<E> node = new Node<E>(e);
        final ReentrantLock putLock = this.putLock;
        putLock.lock();
        try {
            if (count.get() == capacity)
                return false;
            enqueue(node);
            c = count.getAndIncrement();
            if (c + 1 < capacity)
                notFull.signal();
        } finally {
            putLock.unlock();
        }
        if (c == 0)
            signalNotEmpty();
        return true;
    }
}
```



## 3. 解决办法

1. 将并行流改成普通流, 或者取消流:

```java
        /*
        taskIdList.parallelStream().forEach(taskId -> {
        */
        taskIdList.forEach(taskId -> {
            // ... ...
        });
```

需要提高并发度可以采用自定义线程池处理;


2. 取消 TimedAspect, 让 `@Timed` 注解失效:

```java
/*
    @Bean
    public TimedAspect timedAspect(MeterRegistry reg) {
        return new TimedAspect(reg);
    }
*/
```

3. 屏蔽部分无效指标

```java
    private static StatsDClient statsDClient;
    public static void recordTime(String aspectPrefix, long usedMillisecond, String... tags) {
        if(usedMillisecond < 1L){
            return;
        }
        statsDClient.time(aspectPrefix + ".time", usedMillisecond, tags == null ? EMPTY_TAG : tags);
    }
```

根据业务特征, 小于1ms的指标, 直接抛弃; 

这个阈值看具体业务来确定, 也可以在业务代码中按批次进行聚合与上报, 减小指标系统压力;


## 4. 优化效果

重新发版之后, 每秒总吞吐量达到了 80 万左右, 基本跟上生产者的速度;

CPU使用率也降低到30~40%左右;

至此, 本次优化基本完成, 后续需要在提高并发度的同时防止背压问题。

## 5. 总结

早期进行性能优化时, 追踪了详细的业务指标监控信息。 当然，业务复杂度也在持续上升, 等到吞吐量达到一定阶段时, 指标采集的部分又形成了新的瓶颈点, 根据需求, 去除不必要的指标采集之后, 性能得到了大幅度提升。

当然, 在特定的系统容量下, 性能满足业务的需求即可, 调优成果很多时候还是不稳定的产出，有时候得靠一点经验。


> 知识储备: 
> 有些任务你可以不做、做不到、暂时没资格做，比如有价值的事都被上司和前辈分摊了。
> 但你不能一直不懂、不会做。
> 如果你不懂、不会, 还不学习，那么就永远跟机会无缘。
> 通过看书和网络进行积累, 大致明白和了解，那么日常工作中起码可以争取到一些机会，慢慢的机会就越来越多。



## 相关链接


- [RxJava3: 响应式编程(Reactive Extensions)的java实现](https://github.com/ReactiveX/RxJava)
- [Micrometer Application Metrics](https://github.com/micrometer-metrics/micrometer)
- [java-dogstatsd-client](https://github.com/DataDog/java-dogstatsd-client)
- [火焰图](https://blog.openresty.com.cn/cn/lua-cpu-flame-graph/)
- [性能分析工具-HPROF简介](https://github.com/cncounter/translation/blob/master/tiemao_2017/20_hprof/20_hprof.md)
- [原文链接](https://github.com/cncounter/translation/blob/master/tiemao_2022/20_metrics_and_queue_performance/README.md)
