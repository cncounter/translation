# Introduction to JVM Code Cache

## 1. Introduction

In this tutorial, we're going to have a quick look at and learn about the JVM's code cache memory.

# 深入JVM - Code Cache内存池

## 1. 本文内容

本文简要介绍JVM的 Code Cache(本地代码缓存池)。

## 2. What Is the Code Cache?

Simply put, JVM Code Cache is an area where JVM stores its bytecode compiled into native code. We call each block of the executable native code a nmethod. The nmethod might be a complete or inlined Java method.

The just-in-time (JIT) compiler is the biggest consumer of the code cache area. That's why some developers call this memory a JIT code cache.

## 2. Code Cache 简要介绍

简单来说，JVM会将字节码编译为本地机器码，并使用 Code Cache 来保存。
每一个可执行的本地代码块，称为一个 nmethod。
nmethod 可能对应一个完整的Java方法，或者是内联后的方法。

即时编译器（just-in-time，JIT）是代码缓存区的最大消费者，所以此区域又被开发者称为 JIT code cache。

## 3. Code Cache Tuning

> The code cache has a fixed size.

Once it is full, the JVM won't compile any additional code as the JIT compiler is now off. Furthermore, we will receive the "CodeCache is full… The compiler has been disabled" warning message. As a result, we'll end up with degraded performance in our application. To avoid this, we can tune the code cache with the following size options:

- `InitialCodeCacheSize` - the initial code cache size, `160K` default
- `ReservedCodeCacheSize` - the default maximum size is `48MB`
- `CodeCacheExpansionSize` - the expansion size of the code cache, `32KB` or `64KB`

## 3. 对 Code Cache 进行调优

> code cache 区域的大小是固定的。

如果Code Cache区域用满了，就会停止JIT编译, 也就是说JVM不再编译任何代码。
我们还会收到 "CodeCache is full… The compiler has been disabled" 之类的告警消息。
JIT编译器关闭的结果，就是系统性能急剧下降。
为了避免这种情况，我们需要对Code Cache进行调优，例如使用以下参数:

- `InitialCodeCacheSize` - 初始大小, 默认值为 `160KB`
- `ReservedCodeCacheSize` - 保留给Code Cache的空间, 也就是最大空间, 默认值:  `48MB`
- `CodeCacheExpansionSize` - 每次扩充的大小, 一般为 `32KB` 或者 `64KB`


Increasing the ReservedCodeCacheSize can be a solution, but this is typically only a temporary workaround.

Fortunately, the JVM offers a UseCodeCacheFlushing option to control the flushing of the code cache area. Its default value is false. When we enable it, it frees the occupied area when the following conditions are met:

- the code cache is full; this area is flushed if its size exceeds a certain threshold
- the certain interval is passed since the last cleanup
- the precompiled code isn't hot enough. For each compiled method the JVM keeps track of a special hotness counter. If the value of this counter is less than a computed threshold, the JVM frees this piece of precompiled code

合理地增加 `ReservedCodeCacheSize` 是一种解决办法， 毕竟现在很多应用加上依赖库的代码量一点都不少。
但我们也不能无限制地增大这个区域的大小。

幸运的是，JVM提供了一个启动参数 `UseCodeCacheFlushing`, 用来控制Code Cache的刷新。 这个参数的默认值为 `false`。
如果将其开启(`-XX:+UseCodeCacheFlushing`)，则会在满足以下条件时释放占用的区域:

- code cache用满； 如果该区域的大小超过某个阈值，则会刷新。
- 自上次清理后经过了一定的时间间隔。
- 预编译的代码不够热。 对于每个JIT编译的方法，JVM都会有一个热度跟踪计数器。 如果计数器的值小于动态阈值，则JVM会释放这段预编译的代码。

> 提示: 除非Code Cache不够用了,否则不要乱开;

## 4. Code Cache Usage

In order to monitor the code cache usage, we need to track the size of the memory currently in use.

To get information on code cache usage, we can specify the -XX:+PrintCodeCache JVM option. After running our application, we'll see a similar output:

## 4. 查看Code Cache的使用情况

想要监控代码缓存的使用情况，我们可以跟踪当前使用的内存大小。

指定JVM启动参数: `-XX:+PrintCodeCache`, 会打印Code Cache区的使用情况。
程序执行过程中, 我们可以看到类似下面的输出:

```shell
$ java -XX:+PrintCodeCache -XX:+UseCodeCacheFlushing -version

CodeCache: size=245760Kb used=1060Kb max_used=1071Kb free=244699Kb
```

Let's see what each of these values mean:

- size in the output shows the maximum size of the memory, which is identical to ReservedCodeCacheSize
- used is the actual size of the memory that currently is in use
- max_used is the maximum size that has been in use
- free is the remaining memory which is not occupied yet

The PrintCodeCache option is very useful, as we can:

- see when the flushing happens
- determine if we reached a critical memory usage point

一起来分析下各个部分数值的含义:

- `size` 表示此内存区域的最大值，与 `ReservedCodeCacheSize` 相等。
- `used` 是此区域当前实际使用的内存大小。
- `max_used` 是程序启动以来的历史最大使用量
- `free` 是此区域尚未使用的空闲空间

`PrintCodeCache` 选项非常有用，可以帮助我们:

- 查看何时进行了刷新(flushing)
- 确定内存使用量是否达到关键点位

## 5. Segmented Code Cache

As of Java 9, the JVM divides the code cache into three distinct segments each of which contains a particular type of compiled code. To be more specific, there are three segments:

- The non-method segment contains JVM internal related code such as the bytecode interpreter. By default, this segment is around `5 MB`. Also, it's possible to configure the segment size via the `-XX:NonNMethodCodeHeapSize` tuning flag
- The profiled-code segment contains lightly optimized code with potentially short lifetimes. Even though the segment size is around `122 MB` by default, we can change it via the `-XX:ProfiledCodeHeapSize` tuning flag
- The non-profiled segment contains fully optimized code with potentially long lifetimes. Similarly, it's around 122 MB by default. This value is, of course, configurable via the `-XX:NonProfiledCodeHeapSize` tuning flag

This new structure treats various types of complied code differently, which leads to better overall performance.

For example, separating short-lived compiled code from long-lived code improves the method sweeper performance — mainly because it needs to scan a smaller region of memory.

## 5. Code Cache分段

从Java 9开始，JVM将 Code Cache 细分为三个不同的段，每个段包含一种类型的编译代码。
具体是:

- 非方法段(non-method segment), 保存相关的JVM内部代码，例如字节码解释器。 默认情况下，此段约为 `5 MB`。 可通过 `-XX:NonNMethodCodeHeapSize` 参数进行调整。
- 待分析代码段(profiled-code segment), 包含经过简单优化的代码，使用寿命很短。 此段的大小默认为 `122 MB`，可以通过 `-XX:ProfiledCodeHeapSize` 参数进行调整。
- 静态代码段(non-profiled segment), 保存经过全面优化的本地代码，使用寿命可能很长。 默认大小同样是 `122 MB`。 可以通过`-XX:NonProfiledCodeHeapSize` 参数进行调整。

这种新的分段结构，以不同方式处理各种类型的编译代码，整体上具有更好的性能。

例如，将已编译的短命代码和长寿代码分开，提高方法清除器的性能 - 毕竟需要扫描的内存区域变小了。

## 6. Conclusion

This quick article presents a brief introduction to the JVM Code Cache.

Additionally, we presented some usage and tune-up options to monitor and diagnose this memory area.

## 6. 小结

本文简要介绍了JVM的Code Cache内存区域。

也介绍了一些监视和诊断此内存区使用情况的方法，以及相关的优化和配置选项。

- 原文链接: <https://www.baeldung.com/jvm-code-cache>
- GitHub双语对照版: <https://github.com/cncounter/translation/tree/master/tiemao_2020/21_jvm-code-cache> (路过的小伙伴, 请点小星星Star支持)
