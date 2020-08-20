# Introduction to JVM Code Cache

## 1. Introduction

In this tutorial, we're going to have a quick look at and learn about the JVM's code cache memory.

## 2. What Is the Code Cache?

Simply put, JVM Code Cache is an area where JVM stores its bytecode compiled into native code. We call each block of the executable native code a nmethod. The nmethod might be a complete or inlined Java method.

The just-in-time (JIT) compiler is the biggest consumer of the code cache area. That's why some developers call this memory a JIT code cache.

# 快速掌握JVM代码缓存区

## 1. 内容提要

本文简要介绍JVM的代码缓存区（code cache memory）。

## 2. 什么是Code Cache？

简单来说，JVM会将字节码编译为本地机器码，并用 Code Cache 来保存。
每一个可执行的本地机器代码块，称为一个 nmethod。
nmethod 可能对应一个完整的Java方法，或者是方法内联后的代码。

即时编译器（just-in-time，JIT）是代码缓存区最大的消耗者，有些开发者将此区域称为JIT代码缓存。

## 3. Code Cache Tuning

> The code cache has a fixed size.

Once it is full, the JVM won't compile any additional code as the JIT compiler is now off. Furthermore, we will receive the “CodeCache is full… The compiler has been disabled” warning message. As a result, we'll end up with degraded performance in our application. To avoid this, we can tune the code cache with the following size options:

- `InitialCodeCacheSize` – the initial code cache size, `160K` default
- `ReservedCodeCacheSize` – the default maximum size is `48MB`
- `CodeCacheExpansionSize` – the expansion size of the code cache, `32KB` or `64KB`

## 3. Code Cache调优

> code cache区域的大小是固定的。

一旦此区域用满，这时候JIT编译器就会关闭, JVM就不再编译任何代码。
此外，我们还会收到 “CodeCache is full… The compiler has been disabled” 之类的告警消息。
JIT编译器关闭的结果，将导致系统性能急剧下降。
为了避免这种情况，我们可以对Code Cache进行调优，例如使用以下参数：

- `InitialCodeCacheSize` – 初始大小, 默认值为 `160K`
- `ReservedCodeCacheSize` – 默认的最大空间： `48MB`
- `CodeCacheExpansionSize` – 每次扩充的空间, `32KB` 或者 `64KB`


Increasing the ReservedCodeCacheSize can be a solution, but this is typically only a temporary workaround.

Fortunately, the JVM offers a UseCodeCacheFlushing option to control the flushing of the code cache area. Its default value is false. When we enable it, it frees the occupied area when the following conditions are met:

- the code cache is full; this area is flushed if its size exceeds a certain threshold
- the certain interval is passed since the last cleanup
- the precompiled code isn't hot enough. For each compiled method the JVM keeps track of a special hotness counter. If the value of this counter is less than a computed threshold, the JVM frees this piece of precompiled code

增加 `ReservedCodeCacheSize` 是一种解决方案，但很多时候这只是临时解决办法。

幸运的是，JVM 提供了 `UseCodeCacheFlushing` 选项来控制代码缓存区的刷新。 其默认值为 `false`。
如果将其开启，则会在满足以下条件时释放占用的区域：

- 代码缓存已满； 如果该区域的大小超过某个阈值，则将其刷新。
- 自上次清理以来过去一定的时间间隔。
- 预编译的代码不够热。 对于每个被编译的方法，JVM都会有一个特殊的热度跟踪计数器。 如果计数器的值小于动态计算的阈值，则JVM会释放此段预编译的代码。

## 4. Code Cache Usage

In order to monitor the code cache usage, we need to track the size of the memory currently in use.

To get information on code cache usage, we can specify the –XX:+PrintCodeCache JVM option. After running our application, we'll see a similar output:

## 4.代码缓存的占用情况

为了监控代码缓存的使用情况，我们需要跟踪当前使用的内存大小。

要获取代码缓存使用情况有关的信息，我们可以指定JVM启动参数: `–XX:+PrintCodeCache`。
在应用程序启动之后，我们将看到类似的输出：

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

一起来分析下这些值的含义：

- 输出内容中的 `size` 表示此内存区域的最大值，与 `ReservedCodeCacheSize` 相等。
- `used` 是当前使用内存的实际大小。
- `max_used` 是历史使用的最大值
- `free` 是此区域尚未使用的内存空间

`PrintCodeCache` 选项非常有用，因为我们可以：

- 查看何时进行刷新
- 确定我们是否达到了关键的内存使用点

## 5. Segmented Code Cache

As of Java 9, the JVM divides the code cache into three distinct segments each of which contains a particular type of compiled code. To be more specific, there are three segments:

- The non-method segment contains JVM internal related code such as the bytecode interpreter. By default, this segment is around `5 MB`. Also, it's possible to configure the segment size via the `-XX:NonNMethodCodeHeapSize` tuning flag
- The profiled-code segment contains lightly optimized code with potentially short lifetimes. Even though the segment size is around `122 MB` by default, we can change it via the `-XX:ProfiledCodeHeapSize` tuning flag
- The non-profiled segment contains fully optimized code with potentially long lifetimes. Similarly, it's around 122 MB by default. This value is, of course, configurable via the `-XX:NonProfiledCodeHeapSize` tuning flag

This new structure treats various types of complied code differently, which leads to better overall performance.

For example, separating short-lived compiled code from long-lived code improves the method sweeper performance — mainly because it needs to scan a smaller region of memory.

## 5. 代码缓存分段

从Java 9开始，JVM将代码缓存分为三个不同的分段，每个段包含一种类型的已编译代码。
具体地说，分为三个部分：

- 非方法段(non-method segment), 包含JVM内部相关的代码，例如字节码解释器。 默认情况下，此段约为 `5 MB`。 可通过 `-XX:NonNMethodCodeHeapSize` 参数进行调整。
- 待分析代码段(profiled-code segment), 包含经过简单优化的代码，使用寿命很短。 此段的大小默认为 `122 MB`，我们也可以通过 `-XX:ProfiledCodeHeapSize` 参数进行调整。
- 静态代码段(non-profiled segment), 包含经过全面优化的代码，使用寿命可能很长。 同样，默认情况下大小为 `122 MB`。 可以通过`-XX:NonProfiledCodeHeapSize` 参数进行调整。

这种新的分段结构，以不同方式对待各种类型的已编译代码，从而整体上具备更好的性能。

例如，将短命的已编译代码与长寿的代码分开，可以提高方法清除器的性能 - 因为需要扫描的内存区域很小。

## 6. Conclusion

This quick article presents a brief introduction to the JVM Code Cache.

Additionally, we presented some usage and tune-up options to monitor and diagnose this memory area.

## 6. 小结

本文简要介绍了 JVM Code Cache。

还提供了一些监视和诊断此内存区域使用率的方法，以及优化选项。

- https://www.baeldung.com/jvm-code-cache
