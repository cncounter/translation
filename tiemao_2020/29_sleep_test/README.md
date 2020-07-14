# sleep 耗时测试


程序如下:

```java
package com.cncounter.test.common;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 测试Sleep的时间周期
 */
public class TestSleepPeriod implements Runnable {

    // 是否可以继续执行
    public static final AtomicBoolean RUNNABLE = new AtomicBoolean(Boolean.TRUE);
    // 启动时间
    public static final AtomicLong StartTime = new AtomicLong(0L);
    // 差异总时间
    public static final AtomicLong DiffSumTime = new AtomicLong(0L);
    // 运行总次数
    public static final AtomicLong RunCounter = new AtomicLong(0L);
    // 大于阈值的次数
    public static final AtomicLong BiggerThanThresholdCounter = new AtomicLong(0L);
    //
    public static final int parallel = 16;
    public static final long threshold = 3L;
    public static final long sleepMillis = 1L;

    public static void main(String[] args) {
        startup();
    }

    public static void startup() {
        //
        StartTime.set(System.currentTimeMillis());
        //
        TestSleepPeriod task = new TestSleepPeriod();
        for (int i = 0; i < parallel; i++) {
            new Thread(task).start();
        }
    }

    @Override
    public void run() {
        //
        while (RUNNABLE.get()) {
            // 执行逻辑
            long beforeSleepMillis = System.currentTimeMillis();
            try {
                // 睡眠1毫秒
                TimeUnit.MILLISECONDS.sleep(sleepMillis);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            long afterSleepMillis = System.currentTimeMillis();
            long beforeDiff = afterSleepMillis - beforeSleepMillis;
            //
            long diffSum = DiffSumTime.addAndGet(beforeDiff);
            long runCount = RunCounter.incrementAndGet();
            long avgDiff = diffSum / runCount;
            //
            if (beforeDiff > threshold) {
                long bigThanCount = BiggerThanThresholdCounter.incrementAndGet();
                System.out.println("[暂停时间超过阈值]threshold=" + threshold + "; sleepMillis=" + sleepMillis
                        + "; beforeDiff=" + beforeDiff + "; diffSum=" + diffSum + "; avgDiff=" + avgDiff
                        + "; runCount=" + runCount + "; bigThanCount=" + bigThanCount
                        + "; afterSleepMillis=" + afterSleepMillis + "; beforeSleepMillis=" + beforeSleepMillis
                );
            }
        }
    }
}

```

可以看到，其中的阈值为:

```
//
public static final int parallel = 8;
public static final long threshold = 10L;
public static final long sleepMillis = 1L;
```

在8核心CPU的MAC机器上，执行了一会儿没什么反应。

然后我们给机器加负载，比如执行maven编译等任务。


结果如下：

```
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=60; afterSleepMillis=1592970357675; beforeSleepMillis=1592970357615
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=13; afterSleepMillis=1592970357692; beforeSleepMillis=1592970357679
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=63; afterSleepMillis=1592970357679; beforeSleepMillis=1592970357616
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=62; afterSleepMillis=1592970357678; beforeSleepMillis=1592970357616
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=62; afterSleepMillis=1592970357678; beforeSleepMillis=1592970357616
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=62; afterSleepMillis=1592970357678; beforeSleepMillis=1592970357616
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=62; afterSleepMillis=1592970357678; beforeSleepMillis=1592970357616
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=37; afterSleepMillis=1592970357731; beforeSleepMillis=1592970357694
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=62; afterSleepMillis=1592970357678; beforeSleepMillis=1592970357616
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=38; afterSleepMillis=1592970357732; beforeSleepMillis=1592970357694
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=62; afterSleepMillis=1592970357678; beforeSleepMillis=1592970357616
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=39; afterSleepMillis=1592970357732; beforeSleepMillis=1592970357693
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=11; afterSleepMillis=1592970520980; beforeSleepMillis=1592970520969
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=11; afterSleepMillis=1592970520980; beforeSleepMillis=1592970520969
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=11; afterSleepMillis=1592970520980; beforeSleepMillis=1592970520969
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=11; afterSleepMillis=1592970520980; beforeSleepMillis=1592970520969
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=11; afterSleepMillis=1592970520980; beforeSleepMillis=1592970520969
```

可以看到，确实会有比较大的调度延迟。

修改参数。

```
public static final int parallel = 16;
public static final long threshold = 10L;
public static final long sleepMillis = 1L;
```

重新执行。 同样没什么反应。

继续给机器加负载。 得到了一些结果：

```
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=15; afterSleepMillis=1592970956690; beforeSleepMillis=1592970956675
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=15; afterSleepMillis=1592970956690; beforeSleepMillis=1592970956675
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=91; afterSleepMillis=1592970956773; beforeSleepMillis=1592970956682
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=15; afterSleepMillis=1592970956690; beforeSleepMillis=1592970956675
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=93; afterSleepMillis=1592970956774; beforeSleepMillis=1592970956681
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=85; afterSleepMillis=1592970956774; beforeSleepMillis=1592970956689
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=93; afterSleepMillis=1592970956774; beforeSleepMillis=1592970956681
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=93; afterSleepMillis=1592970956774; beforeSleepMillis=1592970956681
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=96; afterSleepMillis=1592970956773; beforeSleepMillis=1592970956677
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=85; afterSleepMillis=1592970956774; beforeSleepMillis=1592970956689
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=97; afterSleepMillis=1592970956774; beforeSleepMillis=1592970956677
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=85; afterSleepMillis=1592970956774; beforeSleepMillis=1592970956689
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=97; afterSleepMillis=1592970956774; beforeSleepMillis=1592970956677
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=97; afterSleepMillis=1592970956774; beforeSleepMillis=1592970956677
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=14; afterSleepMillis=1592970956689; beforeSleepMillis=1592970956675
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=93; afterSleepMillis=1592970956774; beforeSleepMillis=1592970956681
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=16; afterSleepMillis=1592970958231; beforeSleepMillis=1592970958215
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=17; afterSleepMillis=1592970958232; beforeSleepMillis=1592970958215
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=17; afterSleepMillis=1592970958232; beforeSleepMillis=1592970958215
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=18; afterSleepMillis=1592970958233; beforeSleepMillis=1592970958215
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=17; afterSleepMillis=1592970958232; beforeSleepMillis=1592970958215
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=60; afterSleepMillis=1592970958292; beforeSleepMillis=1592970958232
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=60; afterSleepMillis=1592970958292; beforeSleepMillis=1592970958232
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=60; afterSleepMillis=1592970958292; beforeSleepMillis=1592970958232
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=60; afterSleepMillis=1592970958292; beforeSleepMillis=1592970958232
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=60; afterSleepMillis=1592970958292; beforeSleepMillis=1592970958232
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=60; afterSleepMillis=1592970958292; beforeSleepMillis=1592970958232
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=61; afterSleepMillis=1592970958293; beforeSleepMillis=1592970958232
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=60; afterSleepMillis=1592970958293; beforeSleepMillis=1592970958233
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=56; afterSleepMillis=1592970958293; beforeSleepMillis=1592970958237
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=16; afterSleepMillis=1592970958231; beforeSleepMillis=1592970958215
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=18; afterSleepMillis=1592970958233; beforeSleepMillis=1592970958215
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=18; afterSleepMillis=1592970958233; beforeSleepMillis=1592970958215
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=17; afterSleepMillis=1592970958232; beforeSleepMillis=1592970958215
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=17; afterSleepMillis=1592970958232; beforeSleepMillis=1592970958215
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=17; afterSleepMillis=1592970958232; beforeSleepMillis=1592970958215
```

换成160个线程:

```
public static final int parallel = 160;
public static final long threshold = 10L;
public static final long sleepMillis = 1L;
```

CPU使用率上去了，但是因为都是空转，没做什么工作，所以没有输出。

然后加负载。

```
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=11; afterSleepMillis=1592971788439; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=25; afterSleepMillis=1592971788453; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=25; afterSleepMillis=1592971788453; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=24; afterSleepMillis=1592971788453; beforeSleepMillis=1592971788429
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=15; afterSleepMillis=1592971788453; beforeSleepMillis=1592971788438
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=15; afterSleepMillis=1592971788453; beforeSleepMillis=1592971788438
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=25; afterSleepMillis=1592971788453; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=25; afterSleepMillis=1592971788453; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=19; afterSleepMillis=1592971788454; beforeSleepMillis=1592971788435
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=25; afterSleepMillis=1592971788453; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=23; afterSleepMillis=1592971788454; beforeSleepMillis=1592971788431
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=24; afterSleepMillis=1592971788455; beforeSleepMillis=1592971788431
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=22; afterSleepMillis=1592971788454; beforeSleepMillis=1592971788432
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=26; afterSleepMillis=1592971788455; beforeSleepMillis=1592971788429
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=21; afterSleepMillis=1592971788454; beforeSleepMillis=1592971788433
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=26; afterSleepMillis=1592971788455; beforeSleepMillis=1592971788429
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=21; afterSleepMillis=1592971788454; beforeSleepMillis=1592971788433
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=20; afterSleepMillis=1592971788454; beforeSleepMillis=1592971788434
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=20; afterSleepMillis=1592971788454; beforeSleepMillis=1592971788434
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=27; afterSleepMillis=1592971788455; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=27; afterSleepMillis=1592971788455; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=18; afterSleepMillis=1592971788454; beforeSleepMillis=1592971788436
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=18; afterSleepMillis=1592971788454; beforeSleepMillis=1592971788436
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=27; afterSleepMillis=1592971788455; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=17; afterSleepMillis=1592971788453; beforeSleepMillis=1592971788436
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=28; afterSleepMillis=1592971788456; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=17; afterSleepMillis=1592971788453; beforeSleepMillis=1592971788436
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=16; afterSleepMillis=1592971788453; beforeSleepMillis=1592971788437
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=11; afterSleepMillis=1592971788439; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=15; afterSleepMillis=1592971788453; beforeSleepMillis=1592971788438
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=15; afterSleepMillis=1592971788453; beforeSleepMillis=1592971788438
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=28; afterSleepMillis=1592971788456; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=34; afterSleepMillis=1592971788462; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=33; afterSleepMillis=1592971788461; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=32; afterSleepMillis=1592971788460; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=31; afterSleepMillis=1592971788459; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=28; afterSleepMillis=1592971788456; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=27; afterSleepMillis=1592971788455; beforeSleepMillis=1592971788428
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=26; afterSleepMillis=1592971788455; beforeSleepMillis=1592971788429
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=25; afterSleepMillis=1592971788455; beforeSleepMillis=1592971788430
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=23; afterSleepMillis=1592971788454; beforeSleepMillis=1592971788431
[暂停时间超过阈值]threshold=10; sleepMillis=1; beforeDiff=23; afterSleepMillis=1592971788454; beforeSleepMillis=1592971788431
```


-
