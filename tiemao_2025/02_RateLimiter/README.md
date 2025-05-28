# Guava限频器RateLimiter的使用示例

本文介绍了Guava工具库中的RateLimiter限流器以及使用示例，以及如何防止限流器误拦截。

## 1. 背景说明

高并发应用场景有3大利器: 缓存、限流、熔断。

也有说4利器的: 缓存、限流、熔断、降级。

每一种技术都有自己的适用场景，也有很多使用细节和注意事项。

本文主要介绍 Guava 工具库中的限频器(RateLimiter), 也可以称之为限流器。

限流技术可以简单分为两类:

- 限制TPS, 也就是每秒的业务请求数。 有时候也可以用 QPS 来表示, 即每秒请求数。
- 限制并发数, 也就是同一时刻处理的最大并发请求数。 常用的技术，包括线程池+等待队列，或者简单使用 信号量(Semaphore) 来进行控制。

限频器(RateLimiter)的适用场景: 

> 限制客户端每秒访问服务器的次数。

可以在单个接口使用, 
也可以对多个接口使用,
甚至我们还可以使用注解与参数，通过AOP切面进行灵活的编程。(本文不介绍)

## 2. API与方法

guava工具库的MAVEN依赖为:

```xml
<properties>
    <guava.version>33.1.0-jre</guava.version>
</properties>

<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>${guava.version}</version>
</dependency>
```


主要的类结构和方法如下所示:


```java
package com.google.common.util.concurrent;

public abstract class RateLimiter {

    // 1. 内部实现创建的是 SmoothBursty 模式的限频器
    // permitsPerSecond 参数就是每秒允许的授权数量
    public static RateLimiter create(double permitsPerSecond)//...

    // 2. 内部实现创建的是 SmoothWarmingUp 模式的限频器
    // 传入预热的时间: 在预热期间内, 每秒发放的许可数比 permitsPerSecond 少
    // 主要用于保护服务端, 避免刚启动就被大量的请求打死。
    public static RateLimiter create(double permitsPerSecond,
          Duration warmupPeriod) // ...
    public static RateLimiter create(double permitsPerSecond,
          long warmupPeriod, TimeUnit unit) //...

    // 3. 使用过程中, 支持动态修改每秒限频次数
    public final void setRate(double permitsPerSecond) // ...

    // 4. 获取许可; 拿不到就死等;
    public double acquire()// ...
    public double acquire(int permits)//...

    // 5. 尝试获取许可  
    public boolean tryAcquire()//...
    public boolean tryAcquire(int permits)//...
    // 5.1 重点在这里; 尝试获取许可时, 可以设置一个容许的缓冲时间;
    // 使用场景是: 放过短时间内的, 聚簇的, 一定数量的请求;
    // 比如: n毫秒内, 接连来了m个请求; 
    // 如果这m个请求都需要放过, 就需要设置一定的缓冲时间;
    // 参见下文的测试代码;
    public boolean tryAcquire(Duration timeout)//...
    public boolean tryAcquire(long timeout, TimeUnit unit)//...
    public boolean tryAcquire(int permits, Duration timeout)//...
    public boolean tryAcquire(int permits, long timeout, TimeUnit unit)//...
}


// 平滑限频器
abstract class SmoothRateLimiter extends RateLimiter {

    static final class SmoothBursty extends SmoothRateLimiter {
    }

    // 平滑预热: 顾名思义, 需要一个预热时间才能到达
    static final class SmoothWarmingUp extends SmoothRateLimiter {
    }
}



```

## 3. 示例代码

这部分依次介绍我们的示例代码。

### 3.1 基础工具方法

下面是一些基础工具方法:

```java
    // 睡眠一定的毫秒数
    private static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    // 打印控制台日志
    private static void println(String msg) {
        System.out.println("[" + 
           new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
                .format(new Date()) + "]" + msg);
    }
```


### 3.2 测试任务类

下面是一个测试任务类, 内部使用了 `RateLimiter#tryAcquire` 方法。

```java
    private static class RateLimiterJob implements Runnable {
        //
        CountDownLatch latch;
        RateLimiter rateLimiter;
        // 结果
        StringBuilder resultBuilder = new StringBuilder();
        AtomicInteger passedCounter = new AtomicInteger();
        AtomicInteger rejectedCounter = new AtomicInteger();

        public RateLimiterJob(int taskCount, RateLimiter rateLimiter) {
            this.latch = new CountDownLatch(taskCount);
            this.rateLimiter = rateLimiter;
        }

        @Override
        public void run() {
            //
            boolean passed = rateLimiter.tryAcquire(1, 5, TimeUnit.MILLISECONDS);
            if (passed) {
                passedCounter.incrementAndGet();
                resultBuilder.append("1");
            } else {
                rejectedCounter.incrementAndGet();
                resultBuilder.append("-");
            }
            //
            latch.countDown();
        }
    }
```

也加上了一些并发控制的手段和统计方法, 以方便我们进行测试:



### 3.3 测试和统计方法

真正的测试和统计方法为:


```java
    private static ExecutorService executorService = Executors.newFixedThreadPool(8, new ThreadFactory() {
        @Override
        public Thread newThread(Runnable r) {
            Thread t = new Thread(r);
            t.setDaemon(true);
            t.setName("RateLimiter-1");
            return t;
        }
    });

    private static String metrics(RateLimiter rateLimiter, int taskCount) {
        long startMillis = System.currentTimeMillis();
        // 休息1S
        rateLimiter.tryAcquire();
        sleep(1_000);
        //
        RateLimiterJob job = new RateLimiterJob(taskCount, rateLimiter);
        for (int i = 0; i < taskCount; i++) {
            sleep(10);
            executorService.submit(job);
        }
        // 等待结果
        try {
            job.latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        long costMillis = System.currentTimeMillis() - startMillis;
        //
        String result = job.resultBuilder.toString();
        result = result + "[passed=" + job.passedCounter.get() +
                 ", rejected=" + job.rejectedCounter.get() + "]"
                  + "[耗时=" + costMillis + "ms]";
        return result;
    }
```

这里创建了一个并发线程池, 用来模拟多个并发请求客户端, 也保证了短时间内有一定的聚簇流量。

metrics 方法, 对 rateLimiter 进行一定数量的任务测试, 并返回统计结果;



### 3.4 测试两种模式的限频器

下面的代码, 测试两种模式的限频器:

```java

    private static void testRateLimit() {
        //
        double permitsPerSecond = 20D;
        int taskCount = 100;
        println("========================================");
        // 1. SmoothBursty 模式的限频器: 平滑分配token, 可以看代码实现
        RateLimiter rateLimiter = RateLimiter.create(permitsPerSecond);
        // 111111111111111111111111111-1---1---1--1---1---1---1
        // ---1---1---1----1--1---1---1----1--1---1---1---1
        // [passed=46, rejected=54][耗时=2346ms]
        String result = metrics(rateLimiter, taskCount);
        println("1. SmoothBursty 模式的限频器.result:==========" + result);
        println("========================================");

        // 2. SmoothWarmingUp 模式的限频器: 系统需要预热的话，最初的时候，放行的请求会比较少;
        rateLimiter = RateLimiter.create(permitsPerSecond, 1, TimeUnit.SECONDS);
        // 1-----------1----------1---------1---------1--------1
        // -------1------1-----1-----1----1---1---1---1---
        // [passed=14, rejected=86][耗时=2251ms]
        result = metrics(rateLimiter, taskCount);
        println("2. SmoothWarmingUp 模式的限频器.result:==========" + result);
        println("========================================");
    }
```

我将输出的内容放在了双斜线注释里面, `1`表示放行, `-`表示拒绝。
可以看到:

- SmoothBursty 模式, 直接放过了前面的一定量的聚簇流量
- SmoothWarmingUp 模式, 开始时在预热, 放过的请求较少, 预热完成后正常放行和拒绝。


### 3.5 测试缓冲时间与等待耗时

下面的方法, 测试 `tryAcquire` 方法指定缓冲时间时, 会消耗多少时间等待。


```java

    private static void testRateLimitTimeout() {
        int permitsPerSecond = 500;
        RateLimiter rateLimiter = RateLimiter.create(permitsPerSecond);
        //
        int timeout = 50;
        int clusterCount = timeout * permitsPerSecond / 1000;
        AtomicInteger passedCount = new AtomicInteger(0);

        long startMillis = System.currentTimeMillis();
        long maxTimeoutMillis = 0;
        for (int i = 0; i < clusterCount; i++) {
            long beginMillis = System.currentTimeMillis();
            // 限频时使用缓冲时间区间: 短暂放过聚集在一起的少量(并发)请求数: 
            // 放过的数量为: timeout * permitsPerSecond/1000
            boolean passed = rateLimiter.tryAcquire(1, 50, TimeUnit.MILLISECONDS);
            if (passed) {
                passedCount.incrementAndGet();
            }
            long timeoutMillis = System.currentTimeMillis() - beginMillis;
            maxTimeoutMillis = Math.max(timeoutMillis, maxTimeoutMillis);
        }

        long costMillis = System.currentTimeMillis() - startMillis;
        // [2025-04-28 22:49:00]testRateLimitTimeout:
        // [clusterCount=25];[passedCount=25]
        println("testRateLimitTimeout:[clusterCount=" + 
            clusterCount + "];[passedCount=" + passedCount.get() + "]");
        // [2025-04-28 22:49:00]testRateLimitTimeout:
        // 耗时:[costMillis=47][maxTimeoutMillis=3]
        println("testRateLimitTimeout:耗时:[costMillis=" +
            costMillis + "][maxTimeoutMillis=" + maxTimeoutMillis + "]");

    }
```

我们的测试条件为: `timeout = 50;  permitsPerSecond = 500`. 
放过的聚簇流量公式为: `timeout * permitsPerSecond/1000`
可以看到, 测试结果里面的日志为: 

> `[clusterCount=25];[passedCount=25]`

符合我们的预期和计算。

等待耗时时间最大为 `maxTimeoutMillis=3`, 这个等待时间还可以接受:

> 耗时:`[costMillis=47][maxTimeoutMillis=3]`

我们使用时根据需要配置相关参数即可。




## 4. 完整的测试代码

完整的测试代码如下所示:

```java
import com.google.common.util.concurrent.RateLimiter;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

// 测试限频:
public class RateLimiterTimeoutTest {

    private static ExecutorService executorService = 
      Executors.newFixedThreadPool(8, new ThreadFactory() {
        @Override
        public Thread newThread(Runnable r) {
            Thread t = new Thread(r);
            t.setDaemon(true);
            t.setName("RateLimiter-1");
            return t;
        }
      });

    // 测试性能
    public static void main(String[] args) {
        testRateLimitTimeout();
        testRateLimit();
    }

    private static void testRateLimitTimeout() {
        int permitsPerSecond = 500;
        RateLimiter rateLimiter = RateLimiter.create(permitsPerSecond);
        //
        int timeout = 50;
        int clusterCount = timeout * permitsPerSecond / 1000;
        AtomicInteger passedCount = new AtomicInteger(0);

        long startMillis = System.currentTimeMillis();
        long maxTimeoutMillis = 0;
        for (int i = 0; i < clusterCount; i++) {
            long beginMillis = System.currentTimeMillis();
            // 限频时使用缓冲时间区间: 短暂放过聚集在一起的少量(并发)请求数: 
            // 放过的数量为: timeout * permitsPerSecond/1000
            boolean passed = rateLimiter.tryAcquire(1, 50, TimeUnit.MILLISECONDS);
            if (passed) {
                passedCount.incrementAndGet();
            }
            long timeoutMillis = System.currentTimeMillis() - beginMillis;
            maxTimeoutMillis = Math.max(timeoutMillis, maxTimeoutMillis);
        }

        long costMillis = System.currentTimeMillis() - startMillis;
        // [2025-04-28 22:49:00]testRateLimitTimeout:
        // [clusterCount=25];[passedCount=25]
        println("testRateLimitTimeout:[clusterCount=" + 
            clusterCount + "];[passedCount=" + passedCount.get() + "]");
        // [2025-04-28 22:49:00]testRateLimitTimeout:
        // 耗时:[costMillis=47][maxTimeoutMillis=3]
        println("testRateLimitTimeout:耗时:[costMillis=" +
            costMillis + "][maxTimeoutMillis=" + maxTimeoutMillis + "]");

    }

    private static void testRateLimit() {
        //
        double permitsPerSecond = 20D;
        int taskCount = 100;
        println("========================================");
        // 1. SmoothBursty模式的限频器: 平滑分配token, 可以看代码实现
        RateLimiter rateLimiter = RateLimiter.create(permitsPerSecond);
        // 111111111111111111111111111-1---1---1--1---1---1---1
        // ---1---1---1----1--1---1---1----1--1---1---1---1
        // [passed=46, rejected=54][耗时=2346ms]
        String result = metrics(rateLimiter, taskCount);
        println("1. SmoothBursty 模式的限频器.result:==========" + result);
        println("========================================");

        // 2. SmoothWarmingUp模式的限频器: 系统需要预热的话，最初的时候，放行的请求会比较少;
        rateLimiter = RateLimiter.create(permitsPerSecond, 1, TimeUnit.SECONDS);
        // 1-----------1----------1---------1---------1--------1
        // -------1------1-----1-----1----1---1---1---1---
        // [passed=14, rejected=86][耗时=2251ms]
        result = metrics(rateLimiter, taskCount);
        println("2. SmoothWarmingUp 模式的限频器.result:==========" + result);
        println("========================================");
    }


    private static String metrics(RateLimiter rateLimiter, int taskCount) {
        long startMillis = System.currentTimeMillis();
        // 休息1S
        rateLimiter.tryAcquire();
        sleep(1_000);
        //
        RateLimiterJob job = new RateLimiterJob(taskCount, rateLimiter);
        for (int i = 0; i < taskCount; i++) {
            sleep(10);
            executorService.submit(job);
        }
        // 等待结果
        try {
            job.latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        long costMillis = System.currentTimeMillis() - startMillis;
        //
        String result = job.resultBuilder.toString();
        result = result + "[passed=" + job.passedCounter.get() +
                 ", rejected=" + job.rejectedCounter.get() + "]"
                  + "[耗时=" + costMillis + "ms]";
        return result;
    }

    private static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private static void println(String msg) {
        System.out.println("[" + 
           new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
                .format(new Date()) + "]" + msg);
    }


    private static class RateLimiterJob implements Runnable {
        //
        CountDownLatch latch;
        RateLimiter rateLimiter;
        // 结果
        StringBuilder resultBuilder = new StringBuilder();
        AtomicInteger passedCounter = new AtomicInteger();
        AtomicInteger rejectedCounter = new AtomicInteger();

        public RateLimiterJob(int taskCount, RateLimiter rateLimiter) {
            this.latch = new CountDownLatch(taskCount);
            this.rateLimiter = rateLimiter;
        }

        @Override
        public void run() {
            //
            boolean passed = rateLimiter.tryAcquire(1, 5, TimeUnit.MILLISECONDS);
            if (passed) {
                passedCounter.incrementAndGet();
                resultBuilder.append("1");
            } else {
                rejectedCounter.incrementAndGet();
                resultBuilder.append("-");
            }
            //
            latch.countDown();
        }
    }

}

```

测试代码总的只有100多行, 并不是很复杂。 




## 5. 简单小结

本文简单介绍了Guava限频器(RateLimiter)的用法。
使用要点是 tryAcquire 时需要给一定量的缓冲时间, 避免聚簇的少量请求被误拦截。

我们的测试条件为: `timeout = 50;  permitsPerSecond = 500`. 
放过的聚簇流量公式为: `timeout * permitsPerSecond/1000`。



