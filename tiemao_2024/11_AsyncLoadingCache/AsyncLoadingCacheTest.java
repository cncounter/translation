package com.cncounter;

import com.github.benmanes.caffeine.cache.CacheLoader;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import org.checkerframework.checker.nullness.qual.NonNull;
import org.checkerframework.checker.nullness.qual.Nullable;

import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.Date;
import java.util.Objects;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.IntStream;

/*

    Spring 的 @Cacheable 注解使用时, 可能不需要写loader。
    在对应的Caffeine 的 Bean 配置上属性之后就行了。
    需要注意两个时间的间隔， 比如 refresh 是1分钟, expire 可以设置为10分钟。
    reload 是 default 方法. load 应该是Spring 自己代理封装了。

 */

public class AsyncLoadingCacheTest {
    private static LoadingCache<Object, Object> buildCaffeineCache() {
        return Caffeine.newBuilder()
                .initialCapacity(1000)
                .maximumSize(50000000)
                .expireAfterWrite(Duration.ofMinutes(10L)) // 最多缓存x分钟
                // refresh 时间到了之后，get时, 会异步调用reload方法, 但是不等待reload结果， get方法立即返回旧值。
                .refreshAfterWrite(Duration.ofSeconds(2L)) // XX 后刷新 ; 这个会异步调用 reload 方法
                .executor(Executors.newSingleThreadExecutor(r -> {
                    Thread t = new Thread(r);
                    t.setName("loader-pool");
                    t.setDaemon(true);
                    return t;
                }))
                .build(loader())
                ;
    }

    public static void main(String[] args) {
        doTest();
    }

    private static void doTest() {
        LoadingCache<Object, Object> cache = buildCaffeineCache();

        AtomicInteger adder = new AtomicInteger(1);


        {
            printLog("------------------------------");
            // 先获取第一次
            Object key = adder.getAndIncrement();
            Object value = testGetCacheValue(cache, key);
            assertThat(Objects.nonNull(value));
            printLog("-----初始化完成...");

            //
            IntStream.range(1, 4).forEach(i -> {
                printLog("testGetCacheValue: the " + i + " times:");
                testGetCacheValue(cache, key);
            });

        }

    }

    private static Object testGetCacheValue(LoadingCache<Object, Object> cache, Object key) {
        printLog("------------------------------");
        sleepSeconds(6);
        long preMillis2 = System.currentTimeMillis();
        Object value = cache.get(key);
        long afterMillis2 = System.currentTimeMillis();
        printLog("testGetCacheValue: key=" + key + "; value=" + value + "; 耗时=" + (afterMillis2 - preMillis2) + "ms");
        assertThat(Objects.nonNull(value));
        return value;
    }

    private static CacheLoader<Object, Object> loader() {
        CacheLoader<Object, Object> cacheLoader = new CacheLoader<>() {

            @Nullable
            @Override
            public Object load(@NonNull Object key) throws Exception {
                String newResult = key + "-value";
                printLog("准备执行 load: key=" + key);
                new RuntimeException("打印调用栈:").printStackTrace();
                sleepSeconds(1);
                printLog("执行 load 耗时 1 s: key=" + key);
                return newResult;
            }

            @Nullable
            @Override
            public Object reload(@NonNull Object key, @NonNull Object oldValue) throws Exception {
                String newResult = key + "-reload-" + reloadCount.incrementAndGet();
                printLog("准备执行 reload: key=" + key + "; 准备sleep之后返回新值: " + newResult);
                // new RuntimeException("打印调用栈:").printStackTrace();
                try {
                    TimeUnit.MILLISECONDS.sleep(1000L);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                printLog("执行 reload sleep 1s 结束: key=" + key + "; 已刷新到新值: " + newResult);
                return newResult;
            }

            private AtomicInteger reloadCount = new AtomicInteger(0);
        };

        return cacheLoader;
    }

    private static void assertThat(boolean condition) {
        if (!condition) {
            throw new AssertionError("断言错误: condition=" + condition);
        }
    }

    private static void sleepSeconds(long num) {
        printLog("sleepSeconds start: " + num + " seconds...");
        try {
            TimeUnit.SECONDS.sleep(num);
        } catch (Exception e) {
            e.printStackTrace();
        }
        printLog("sleepSeconds complete: " + num + " seconds...");
    }

    private static void printLog(String msg) {
        String threadName = Thread.currentThread().getName();
        System.out.println("[" + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(new Date()) + "]" + "[" + threadName + "]" + msg);
    }
}


/*
执行结果:

[2024-09-29 12:54:43.573][main]------------------------------
[2024-09-29 12:54:43.643][main]------------------------------
[2024-09-29 12:54:43.663][main]sleepSeconds start: 6 seconds...
[2024-09-29 12:54:49.671][main]sleepSeconds complete: 6 seconds...
[2024-09-29 12:54:49.706][main]准备执行 load: key=1
[2024-09-29 12:54:49.709][main]sleepSeconds start: 1 seconds...
java.lang.RuntimeException: 打印调用栈:
	at com.cncounter.AsyncLoadingCacheTest$1.load(AsyncLoadingCacheTest.java:92)
	at com.github.benmanes.caffeine.cache.LocalLoadingCache.lambda$newMappingFunction$2(LocalLoadingCache.java:141)
	at com.github.benmanes.caffeine.cache.BoundedLocalCache.lambda$doComputeIfAbsent$14(BoundedLocalCache.java:2341)
	at java.base/java.util.concurrent.ConcurrentHashMap.compute(ConcurrentHashMap.java:1908)
	at com.github.benmanes.caffeine.cache.BoundedLocalCache.doComputeIfAbsent(BoundedLocalCache.java:2339)
	at com.github.benmanes.caffeine.cache.BoundedLocalCache.computeIfAbsent(BoundedLocalCache.java:2322)
	at com.github.benmanes.caffeine.cache.LocalCache.computeIfAbsent(LocalCache.java:108)
	at com.github.benmanes.caffeine.cache.LocalLoadingCache.get(LocalLoadingCache.java:54)
	at com.cncounter.AsyncLoadingCacheTest.testGetCacheValue(AsyncLoadingCacheTest.java:77)
	at com.cncounter.AsyncLoadingCacheTest.doTest(AsyncLoadingCacheTest.java:59)
	at com.cncounter.AsyncLoadingCacheTest.main(AsyncLoadingCacheTest.java:46)
[2024-09-29 12:54:50.712][main]sleepSeconds complete: 1 seconds...
[2024-09-29 12:54:50.716][main]执行 load 耗时 1 s: key=1
[2024-09-29 12:54:50.809][main]testGetCacheValue: key=1; value=1-value; 耗时=1060ms
[2024-09-29 12:54:50.810][main]-----初始化完成...


[2024-09-29 12:54:50.820][main]testGetCacheValue: the 1 times:
[2024-09-29 12:54:50.820][main]------------------------------
[2024-09-29 12:54:50.820][main]sleepSeconds start: 6 seconds...

[2024-09-29 12:54:56.826][main]sleepSeconds complete: 6 seconds...
[2024-09-29 12:54:56.906][main]testGetCacheValue: key=1; value=1-value; 耗时=78ms
[2024-09-29 12:54:56.906][main]testGetCacheValue: the 2 times:
[2024-09-29 12:54:56.907][main]------------------------------
[2024-09-29 12:54:56.907][main]sleepSeconds start: 6 seconds...
[2024-09-29 12:54:56.947][loader-pool]准备执行 reload: key=1; 准备sleep之后返回新值: 1-reload-1
[2024-09-29 12:54:57.965][loader-pool]执行 reload sleep 1s 结束: key=1; 已刷新到新值: 1-reload-1

[2024-09-29 12:55:02.915][main]sleepSeconds complete: 6 seconds...
[2024-09-29 12:55:02.916][main]testGetCacheValue: key=1; value=1-reload-1; 耗时=1ms
[2024-09-29 12:55:02.918][main]testGetCacheValue: the 3 times:
[2024-09-29 12:55:02.918][loader-pool]准备执行 reload: key=1; 准备sleep之后返回新值: 1-reload-2
[2024-09-29 12:55:02.918][main]------------------------------
[2024-09-29 12:55:02.918][main]sleepSeconds start: 6 seconds...
[2024-09-29 12:55:03.924][loader-pool]执行 reload sleep 1s 结束: key=1; 已刷新到新值: 1-reload-2

[2024-09-29 12:55:08.924][main]sleepSeconds complete: 6 seconds...
[2024-09-29 12:55:08.924][main]testGetCacheValue: key=1; value=1-reload-2; 耗时=0ms
[2024-09-29 12:55:08.924][loader-pool]准备执行 reload: key=1; 准备sleep之后返回新值: 1-reload-3


 */