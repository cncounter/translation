# 通过线程调度延迟来探测CPU性能抖动

## 基本原理

Java标准库提供了线程休眠的方法:

```java
// 线程休眠10秒
Thread.sleep(10 * 1000);
```

线程休眠就是让出CPU资源，让操作系统去调度并执行其他线程。

从 JavaSE 5.0开始，提供了更方便的时间单位, 也提供了便捷的， 例如:

```java
// 线程休眠10秒
TimeUnit.SECONDS.sleep(10);
```

但是有一个区别, 就是休眠参数为0时:


```java
// 睡眠 0 毫秒; 让出CPU资源，由操作系统重新调度.
Thread.sleep(0);
// TimeUnit 睡眠 0 时无影响，因为内部过滤了。。。
TimeUnit.SECONDS.sleep(0);
```

看看其内部实现:

```java
// TimeUnit.XXX#sleep 内部实现
public void sleep(long timeout) throws InterruptedException {
  if (timeout > 0) {
    long ms = toMillis(timeout);
    int ns = excessNanos(timeout, ms);
    Thread.sleep(ms, ns);
  }
}
```

可以看到，只在 `timeout > 0` 时才有效。

下面我们来看看具体实现。

## 具体实现

程序如下:

```java
package com.cncounter.test.common;

import com.alibaba.fastjson.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

/**
 * CPU抖动检测
 */
@Configuration
public class CPUTimeoutPeriod implements Runnable {

    private static Logger logger = LoggerFactory.getLogger(CPUTimeoutPeriod.class);

    // 是否可以继续执行
    public static final AtomicBoolean RUNNABLE = new AtomicBoolean(Boolean.TRUE);
    // 启动时间
    public static final AtomicLong StartTime = new AtomicLong(0L);
    // 差异总时间
    public static final AtomicLong DiffSumTime = new AtomicLong(0L);
    // 运行总次数
    public static final AtomicLong LoopCounter = new AtomicLong(0L);
    // 大于阈值的次数
    public static final AtomicLong BTThresholdCounter = new AtomicLong(0L);
    // 大于5的次数
    public static final AtomicLong BT5Counter = new AtomicLong(0L);
    public static final AtomicLong BT10Counter = new AtomicLong(0L);
    public static final AtomicLong BT20Counter = new AtomicLong(0L);
    public static final AtomicLong BT50Counter = new AtomicLong(0L);
    public static final AtomicLong BT100Counter = new AtomicLong(0L);
    public static final AtomicLong MaxValue = new AtomicLong(0L);
    // 阈值; 小于这个值的不输出; 减少日志数据量
    public static final long threshold = 100L;
    // 每次睡眠的毫秒数
    public static final long sleepMillis = 1L;

    public CPUTimeoutPeriod() {
    }

    @PostConstruct
    public void init() {
        try {
            doInit();
        } catch (Throwable e) {
            logger.warn("[GC日志监听-初始化]失败! ", e);
        }
    }

    @PreDestroy
    public void close() {
        RUNNABLE.set(Boolean.FALSE);
    }

    private void doInit() {
        //
        StartTime.set(System.currentTimeMillis());
        // 异步启动
        Thread thread = new Thread(this);
        thread.setName("T-" + this.getClass().getSimpleName());
        thread.setDaemon(Boolean.TRUE);
        //
        thread.start();
    }

    @Override
    public void run() {
        try {
            // 先休眠几秒，等待系统启动
            TimeUnit.SECONDS.sleep(10);
        } catch (InterruptedException e) {
            logger.info("线程睡眠被打断-无关紧要", e);
        }
        //
        AtomicLong prevMillis = new AtomicLong(System.currentTimeMillis());
        //
        while (RUNNABLE.get()) {
            // 执行逻辑
            long beforeSleepMillis = System.currentTimeMillis();
            try {
                // 睡眠
                TimeUnit.MILLISECONDS.sleep(sleepMillis);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            long afterSleepMillis = System.currentTimeMillis();
            long diff = afterSleepMillis - beforeSleepMillis;
            //
            if (diff > 100) {
                BT100Counter.incrementAndGet();
            }
            if (diff > 50) {
                BT50Counter.incrementAndGet();
            }
            if (diff > 20) {
                BT20Counter.incrementAndGet();
            }
            if (diff > 10) {
                BT10Counter.incrementAndGet();
            }
            if (diff > 5) {
                BT5Counter.incrementAndGet();
            }
            if (diff > MaxValue.get()) {
                MaxValue.set(diff);
            }
            //
            long diffSum = DiffSumTime.addAndGet(diff);
            long runCount = LoopCounter.incrementAndGet();
            long avgDiff = diffSum / runCount;
            //
            JSONObject info = new JSONObject();
            info.put("BT100Counter", BT100Counter.get());
            info.put("BT50Counter", BT50Counter.get());
            info.put("BT20Counter", BT20Counter.get());
            info.put("BT10Counter", BT10Counter.get());
            info.put("BT5Counter", BT5Counter.get());
            info.put("MaxValue", MaxValue.get());
            info.put("threshold", threshold);
            info.put("diff", diff);
            info.put("diffSum", diffSum);
            info.put("avgDiff", avgDiff);
            info.put("runCount", runCount);
            info.put("BTThresholdCounter", BTThresholdCounter.get());

            //
            if (diff > threshold) {
                long bigThanCount = BTThresholdCounter.incrementAndGet();
                info.put("BTThresholdCounter", bigThanCount);
                logger.info("[CPU抖动检测][暂停时间超过阈值]info={}", info);
            }
            if(afterSleepMillis - prevMillis.get() > TimeUnit.MINUTES.toMillis(60)){
                logger.info("[CPU抖动检测][抖动数据汇报]info={}", info);
                prevMillis.set(afterSleepMillis);
            }
        }
    }
}

```

其中, 可以看到设置的阈值为:

```
// 阈值; 小于这个值的不输出; 减少日志数据量
public static final long threshold = 100L;
// 每次睡眠的毫秒数
public static final long sleepMillis = 1L;
```

在8核心CPU的机器上，执行了一会儿没什么反应。

然后我们给机器加负载，比如执行maven编译等任务。

结果如下：

```
[CPU抖动检测][暂停时间超过阈值]info={"avgDiff":1,"BTThresholdCounter":103,"BT5Counter":4411,"BT20Counter":3818,"threshold":100,"diff":105,"BT10Counter":3832,"MaxValue":891,"runCount":79856876,"BT50Counter":2215,"BT100Counter":103,"diffSum":85007985}
[CPU抖动检测][暂停时间超过阈值]info={"avgDiff":1,"BTThresholdCounter":104,"BT5Counter":4412,"BT20Counter":3819,"threshold":100,"diff":892,"BT10Counter":3833,"MaxValue":892,"runCount":79857183,"BT50Counter":2216,"BT100Counter":104,"diffSum":85009206}
```

可以看到，偶尔确实会有比较大的调度延迟。

看看初始化的代码。

```java
// 使用Spring注解, 自动扫描并创建对象
@Configuration
public class CPUTimeoutPeriod implements Runnable {
    // 是否可以继续执行
    public static final AtomicBoolean RUNNABLE = new AtomicBoolean(Boolean.TRUE);
    @PostConstruct
    public void init() {
        try {
            doInit();
        } catch (Throwable e) {
            logger.warn("[GC日志监听-初始化]失败! ", e);
        }
    }

    @PreDestroy
    public void close() {
        RUNNABLE.set(Boolean.FALSE);
    }
}
```

日志输出的逻辑:

```java
JSONObject info = new JSONObject();
info.put("BT100Counter", BT100Counter.get());
info.put("BT50Counter", BT50Counter.get());
info.put("BT20Counter", BT20Counter.get());
info.put("BT10Counter", BT10Counter.get());
info.put("BT5Counter", BT5Counter.get());
info.put("MaxValue", MaxValue.get());
info.put("threshold", threshold);
info.put("diff", diff);
info.put("diffSum", diffSum);
info.put("avgDiff", avgDiff);
info.put("runCount", runCount);
info.put("BTThresholdCounter", BTThresholdCounter.get());

// 阈值; 小于这个值的不输出; 减少日志数据量
if (diff > threshold) {
    long bigThanCount = BTThresholdCounter.incrementAndGet();
    info.put("BTThresholdCounter", bigThanCount);
    logger.info("[CPU抖动检测][暂停时间超过阈值]info={}", info);
}
// 60 分钟输出1次汇总信息。
if(afterSleepMillis - prevMillis.get() > TimeUnit.MINUTES.toMillis(60)){
    logger.info("[CPU抖动检测][抖动数据汇报]info={}", info);
    prevMillis.set(afterSleepMillis);
}
```


## 基本结论

如果机器负载较高，就可能会有系统调度延迟。

例如有网络IO等情况，如果线程数量过多，在执行过程中就有可能造成较大的延迟时间。

这种方法可用于辅助诊断系统延迟。

如果抖动较高，则可以尝试进行优化，例如减少线程数量，设置不同的线程优先级等等。
