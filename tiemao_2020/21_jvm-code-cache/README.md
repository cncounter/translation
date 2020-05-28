# Introduction to JVM Code Cache

## 1. Introduction

In this tutorial, we're going to have a quick look at and learn about the JVM's code cache memory.

## 2. What Is the Code Cache?

Simply put, JVM Code Cache is an area where JVM stores its bytecode compiled into native code. We call each block of the executable native code a nmethod. The nmethod might be a complete or inlined Java method.

The just-in-time (JIT) compiler is the biggest consumer of the code cache area. That's why some developers call this memory a JIT code cache.

## 3. Code Cache Tuning

> The code cache has a fixed size.

Once it is full, the JVM won't compile any additional code as the JIT compiler is now off. Furthermore, we will receive the “CodeCache is full… The compiler has been disabled” warning message. As a result, we'll end up with degraded performance in our application. To avoid this, we can tune the code cache with the following size options:

- `InitialCodeCacheSize` – the initial code cache size, `160K` default
- `ReservedCodeCacheSize` – the default maximum size is `48MB`
- `CodeCacheExpansionSize` – the expansion size of the code cache, `32KB` or `64KB`

Increasing the ReservedCodeCacheSize can be a solution, but this is typically only a temporary workaround.

Fortunately, the JVM offers a UseCodeCacheFlushing option to control the flushing of the code cache area. Its default value is false. When we enable it, it frees the occupied area when the following conditions are met:

- the code cache is full; this area is flushed if its size exceeds a certain threshold
- the certain interval is passed since the last cleanup
- the precompiled code isn't hot enough. For each compiled method the JVM keeps track of a special hotness counter. If the value of this counter is less than a computed threshold, the JVM frees this piece of precompiled code

## 4. Code Cache Usage

In order to monitor the code cache usage, we need to track the size of the memory currently in use.

To get information on code cache usage, we can specify the –XX:+PrintCodeCache JVM option. After running our application, we'll see a similar output:

```
CodeCache: size=32768Kb used=542Kb max_used=542Kb free=32226Kb
```

Let's see what each of these values mean:

- size in the output shows the maximum size of the memory, which is identical to ReservedCodeCacheSize
- used is the actual size of the memory that currently is in use
- max_used is the maximum size that has been in use
- free is the remaining memory which is not occupied yet

The PrintCodeCache option is very useful, as we can:

- see when the flushing happens
- determine if we reached a critical memory usage point

## 5. Segmented Code Cache

As of Java 9, the JVM divides the code cache into three distinct segments each of which contains a particular type of compiled code. To be more specific, there are three segments:

- The non-method segment contains JVM internal related code such as the bytecode interpreter. By default, this segment is around `5 MB`. Also, it's possible to configure the segment size via the `-XX:NonNMethodCodeHeapSize` tuning flag
- The profiled-code segment contains lightly optimized code with potentially short lifetimes. Even though the segment size is around `122 MB` by default, we can change it via the `-XX:ProfiledCodeHeapSize` tuning flag
- The non-profiled segment contains fully optimized code with potentially long lifetimes. Similarly, it's around 122 MB by default. This value is, of course, configurable via the `-XX:NonProfiledCodeHeapSize` tuning flag

This new structure treats various types of complied code differently, which leads to better overall performance.

For example, separating short-lived compiled code from long-lived code improves the method sweeper performance — mainly because it needs to scan a smaller region of memory.

## 6. Conclusion

This quick article presents a brief introduction to the JVM Code Cache.

Additionally, we presented some usage and tune-up options to monitor and diagnose this memory area.


- https://www.baeldung.com/jvm-code-cache
