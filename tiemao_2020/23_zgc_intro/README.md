# Z Garbage Collector

# ZGC简介


![](http://cr.openjdk.java.net/~pliden/zgc/banner.png)



The Z Garbage Collector, also known as ZGC, is a scalable low latency garbage collector designed to meet the following goals:

- Max pause times of a few milliseconds (*)
- Pause times do not increase with the heap or live-set size (*)
- Handle heaps ranging from a 8MB to 16TB in size

ZGC, 全称为Z Garbage Collector, 是一款适用范围广泛的低延迟垃圾收集器，设计目标包括：

- 最大暂停时间为毫秒级 (✔️)
- 暂停时间不会随堆内存或活动集的扩大而增加 (✔️)
- 兼容的堆内存大小，范围包括 `8MB ~ 16TB`。

At a glance, ZGC is:

- Concurrent
- Region-based
- Compacting
- NUMA-aware
- Using colored pointers
- Using load barriers

简单来说，ZGC的特性包括：

- 并发(Concurrent)
- 内存分为多个小块(Region-based)
- 内存整理(Compacting)
- 支持 NUMA 体系结构
- 使用着色指针(colored pointer)
- 使用读屏障(load barrier)

At its core, ZGC is a concurrent garbage collector, meaning all heavy lifting work is done while Java threads continue to execute. This greatly limits the impact garbage collection will have on your application's response time.

This OpenJDK project is sponsored by the HotSpot Group.

ZGC的核心特征是并发垃圾收集器，并发的意思就是说： 在Java应用线程正常运行的时候， GC线程会同时执行大部分繁重的垃圾收集任务。 这大大降低了GC对系统响应时间的影响。

ZGC是一个OpenJDK项目，由HotSpot Group赞助。


> `^_^` Work is ongoing, which will make ZGC a sub-millisecond max pause time GC, where pause times do not increase with heap, live-set, or root-set size.

> 开发工作还在进行中，目标是让 ZGC 达成毫秒级以下的 "最大GC暂停时间"，而且不会随着堆内存，存活数据集，GC根数据集的扩大而增加暂停时间。

## Supported Platforms

## 系统支持情况

|--|--|--|--|
| 系统平台(Platform) | 是否支持(Supported) | 起始版本(Since) | 备注(Comment) |
| Linux/x64	| ✔️	| JDK 11 | |
| Linux/AArch64	| ✔️ | JDK 13 | |
| macOS	| ✔️	| JDK 14 | |
| Windows	| ✔️	| JDK 14	| 要求Windows 1803 及以上版本 (即Windows 10 或者 Windows Server 2019). |


## Quick Start

## 快速开始

If you're trying out ZGC for the first time, start by using the following GC options:

要试用 ZGC，可以指定以下GC参数:

```
-XX:+UnlockExperimentalVMOptions -XX:+UseZGC -Xmx<size> -Xlog:gc
```

For more detailed logging, use the following options:

如果想要打印更详细的GC日志， 可指定以下参数：

```
-XX:+UnlockExperimentalVMOptions -XX:+UseZGC -Xmx<size> -Xlog:gc*
```

See below for more information on these and additional options.

请参考下文获取更多参数的说明信息。

## Configuration & Tuning

## 参数配置与性能优化

### Overview

### 配置参数

The following JVM options can be used with ZGC:

下面是使用ZGC时支持的JVM参数：

> JVM通用的GC参数

| **JVM通用的GC参数** | **说明** |
| :----------- | :------- |
| -XX:MinHeapSize, -Xms| |
| -XX:InitialHeapSize, -Xms| |
| -XX:MaxHeapSize, -Xmx| |
| -XX:SoftMaxHeapSize| |
| -XX:ConcGCThreads| |
| -XX:ParallelGCThreads| |
| -XX:UseLargePages| |
| -XX:UseTransparentHugePages| |
| -XX:UseNUMA| |
| -XX:SoftRefLRUPolicyMSPerMB| |
| -XX:AllocateHeapAt| |

> ZGC配置参数

| ZGC 参数 | 说明 |
| :------- | :-- |
| -XX:ZAllocationSpikeTolerance| |
| -XX:ZCollectionInterval| |
| -XX:ZFragmentationLimit| |
| -XX:ZMarkStackSpaceLimit| |
| -XX:ZProactive| |
| -XX:ZUncommit| |
| -XX:ZUncommitDelay| |

> ZGC诊断调优参数

| ZGC诊断调优参数 (需要在前面指定 -XX:+UnlockDiagnosticVMOptions)  | 说明 |
| :---------------------------------- | :------- |
| -XX:ZStatisticsInterval| |
| -XX:ZVerifyForwarding| |
| -XX:ZVerifyMarking| |
| -XX:ZVerifyObjects| |
| -XX:ZVerifyRoots| |
| -XX:ZVerifyViews| |



### Enabling ZGC

Use the `-XX:+UnlockExperimentalVMOptions -XX:+UseZGC` options to enable ZGC.

### 开启 ZGC 垃圾收集器

当前，请使用 `-XX:+UnlockExperimentalVMOptions -XX:+UseZGC` 参数来开启ZGC。

### Setting Heap Size

The most important tuning option for ZGC is setting the max heap size (`-Xmx<size>`). Since ZGC is a concurrent collector a max heap size must be selected such that, 1) the heap can accommodate the live-set of your application, and 2) there is enough headroom in the heap to allow allocations to be serviced while the GC is running. How much headroom is needed very much depends on the allocation rate and the live-set size of the application. In general, the more memory you give to ZGC the better. But at the same time, wasting memory is undesirable, so it’s all about finding a balance between memory usage and how often the GC needs to run.

### 指定堆内存的大小

ZGC最重要的配置参数是设置堆内存的最大值(`-Xmx<size>`)。
ZGC是一款并发垃圾收集器，必须指定这个参数，原因在于：
- 1）堆内存必须能够存放应用程序运行所需的活动集；
- 2）在GC处于运行状态时，堆中需要有足够的空闲内存，以允许正常的内存分配。

需要多少空间主要取决于分配率，以及应用程序的活动集大小。
通常，给ZGC的内存越多越好，但也没必要故意去浪费内存，所以需要在程序的内存量使用量，以及GC需要的运行频率之间进行权衡。

### Setting Concurrent GC Threads

The second tuning option one might want to look at is setting the number of concurrent GC threads (`-XX:ConcGCThreads=<number>`). ZGC has heuristics to automatically select this number. This heuristic usually works well but depending on the characteristics of the application this might need to be adjusted. This option essentially dictates how much CPU-time the GC should be given. Give it too much and the GC will steal too much CPU-time from the application. Give it too little, and the application might allocate garbage faster than the GC can collect it.

NOTE! In general, if low latency (i.e. low application response time) is important for you application, then never over-provision your system. Ideally, your system should never have more than 70% CPU utilization.

### 设置并发GC线程数

第二个配置参数是设置并发GC线程的数量（`-XX:ConcGCThreads=<number>`）。
ZGC具有启发式的特性，可以自动选择此数字。 大部分情况下这种启发式的方法效果都很好，但有些系统比较特殊，可能需要手工进行调整。
这个参数从根本上决定了应该给垃圾收集器多少比例的CPU时间。
给的太多，GC的开销就比较大，甚至抢占一些应用程序的CPU时间。
给的太少，GC回收内存的速度又跟不上应用程序分配内存的速度。

> **警告！**  如果低延迟（即系统响应时间）是非常重要的系统指标，就不能让系统负载太高。 理想情况下，系统的CPU利用率应该在70％以下。

### Returning Unused Memory to the Operating System

By default, ZGC uncommits unused memory, returning it to the operating system. This is useful for applications and environments where memory footprint is a concern. This feature can be disabled using `-XX:-ZUncommit`. Furthermore, memory will not be uncommitted so that the heap size shrinks below the minimum heap size (`-Xms`). This means this feature will be implicitly disabled if the minimum heap size (`-Xms`) is configured to be equal to the maximum heap size (`-Xmx`).

An uncommit delay can be configured using `-XX:ZUncommitDelay=<seconds>` (default is 300 seconds). This delay specifies for how long memory should have been unused before it's eligible for uncommit.

NOTE! On Linux, uncommitting unused memory requires fallocate(2) with FALLOC_FL_PUNCH_HOLE support, which first appeared in kernel version 3.5 (for tmpfs) and 4.3 (for hugetlbfs).

### 将不使用的内存还给操作系统

默认情况下，ZGC取消分配未使用的内存，还给操作系统。 这对于关注内存占用的应用程序和环境很有用。
如果要禁用此功能可以设置开关参数 `-XX:-ZUncommit`。
当然，取消分配内存的操作不会让内存使用量低于最小堆内存空间(`-Xms`)。
也就是说, 如果最小堆内存空间(`-Xms`) 等于 最大堆内存空间(`-Xmx`)，则将隐式地禁用此功能。

可以使用 `-XX:ZUncommitDelay=<seconds>` 参数（默认值为300秒）来配置取消分配内存的延迟。 这个延迟参数指定了在取消提交之前应使用多长时间的内存。

注意！ 在Linux上，取消分配未使用的内存需要带有  `FALLOC_FL_PUNCH_HOLE` 支持的 `fallocate(2)`， 要求Linux内核版本3.5（对于tmpfs）和4.3版本（对于 hugetlbfs）及以上。

### Enabling Large Pages On Linux

Configuring ZGC to use large pages will generally yield better performance (in terms of throughput, latency and start up time) and comes with no real disadvantage, except that it's slightly more complicated to setup. The setup process typically requires root privileges, which is why it's not enabled by default.

On Linux/x86, large pages (also known as "huge pages") have a size of 2MB.

Let's assume you want a 16G Java heap. That means you need 16G / 2M = 8192 huge pages.

First assign at least 16G (8192 pages) of memory to the pool of huge pages. The "at least" part is important, since enabling the use of large pages in the JVM means that not only the GC will try to use these for the Java heap, but also that other parts of the JVM will try to use them for various internal data structures (code heap, marking bitmaps, etc). In this example we will therefore reserve 9216 pages (18G) to allow for 2G of non-Java heap allocations to use large pages.

Configure the system's huge page pool to have the required number pages (requires root privileges):

```
$ echo 9216 > /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages
```

Note that the above command is not guaranteed to be successful if the kernel can not find enough free huge pages to satisfy the request. Also note that it might take some time for the kernel to process the request. Before proceeding, check the number of huge pages assigned to the pool to make sure the request was successful and has completed.

```
$ cat /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages

9216
```

NOTE! If you're using a Linux kernel >= 4.14, then the next step (where you mount a hugetlbfs filesystem) can be skipped. However, if you're using an older kernel then ZGC needs to access large pages through a hugetlbfs filesystem.

Mount a hugetlbfs filesystem (requires root privileges) and make it accessible to the user running the JVM (in this example we're assuming this user has 123 as its uid).

```
$ mkdir /hugepages
$ mount -t hugetlbfs -o uid=123 nodev /hugepages
```

Now start the JVM using the -XX:+UseLargePages option.

```
$ java -XX:+UnlockExperimentalVMOptions -XX:+UseZGC -Xms16G -Xmx16G -XX:+UseLargePages ...
```

If there are more than one accessible hugetlbfs filesystem available, then (and only then) do you also have to use -XX:AllocateHeapAt to specify the path to the filesystems you want to use. For example, assume there are multiple accessible hugetlbfs filesystems mounted, but the filesystem you specifically want to use it mounted on /hugepages, then use the following options.

```
$ java -XX:+UnlockExperimentalVMOptions -XX:+UseZGC -Xms16G -Xmx16G -XX:+UseLargePages -XX:AllocateHeapAt=/hugepages ...
```

NOTE! The configuration of the huge page pool and the mounting of the hugetlbfs file system is not persistent across reboots, unless adequate measures are taken.

### Enabling Transparent Huge Pages On Linux

An alternative to using explicit large pages (as described above) is to use transparent huge pages. Use of transparent huge pages is usually not recommended for latency sensitive applications, because it tends to cause unwanted latency spikes. However, it might be worth experimenting with to see if/how your workload is affected by it. But be aware, your mileage may vary.

NOTE! On Linux, using ZGC with transparent huge pages enabled requires kernel >= 4.7.

Use the following options to enable transparent huge pages in the VM:

```
-XX:+UseLargePages -XX:+UseTransparentHugePages
```

These options tell the JVM to issue madvise(..., MADV_HUGEPAGE) calls for memory it mapps, which is useful when using transparent huge pages in madvise mode.

To enable transparent huge pages you also need to configure the kernel, by enabling the madvise mode.

```
$ echo madvise > /sys/kernel/mm/transparent_hugepage/enabled
```

and

```
$ echo advise > /sys/kernel/mm/transparent_hugepage/shmem_enabled
```

See the kernel documentation for more information.

### Enabling NUMA Support

ZGC has NUMA support, which means it will try it's best to direct Java heap allocations to NUMA-local memory. This feature is enabled by default. However, it will automatically be disabled if the JVM detects that it's bound to a sub-set of the CPUs in the system. In general, you don't need to worry about this setting, but if you want to explicitly override the JVM's decision you can do so by using the -XX:+UseNUMA or -XX:-UseNUMA options.

When running on a NUMA machine (e.g. a multi-socket x86 machine), having NUMA support enabled will often give a noticeable performance boost.

### Enabling GC Logging

GC logging is enabled using the following command-line option:

```
-Xlog:<tag set>,[<tag set>, ...]:<log file>
```

For general information/help on this option:

```
-Xlog:help
```

To enable basic logging (one line of output per GC):

```
-Xlog:gc:gc.log
```

To enable GC logging that is useful for tuning/performance analysis:

```
-Xlog:gc*:gc.log
```

Where gc* means log all tag combinations that contain the gc tag, and :gc.log means write the log to a file named gc.log.

## Change Log

### JDK 15 (under development)
- Production ready (JEP 377)
- Improved NUMA awareness
- Support for Class Data Sharing (CDS)
- Support for placing the heap on NVRAM
- Support for compressed class pointers
- Additional JFR events

### JDK 14
- macOS support (JEP 364)
- Windows support (JEP 365)
- Support for tiny/small heaps (down to 8M)
- Support for JFR leak profiler
- Support for limited and discontiguous address space
- Parallel pre-touch (when using -XX:+AlwaysPreTouch)
- Performance improvements (clone intrinsic, etc)
- Stability improvements

### JDK 13
- Increased max heap size from 4TB to 16TB
- Support for uncommitting unused memory (JEP 351)
- Support for -XX:SoftMaxHeapSIze
- Support for the Linux/AArch64 platform
- Reduced Time-To-Safepoint

### JDK 12
- Support for concurrent class unloading
- Further pause time reductions

### JDK 11
- Initial version of ZGC
- Does not support class unloading (using -XX:+ClassUnloading has no effect)


## FAQ

### What does the "Z" in ZGC stand for?

It doesn't stand for anything, ZGC is just a name. It was originally inspired by, or a homage to, ZFS (the filesystem) which in many ways was revolutionary when it first came out. Originally, ZFS was an acronym for "Zettabyte File System", but that meaning was abandoned and it was later said to not stand for anything. It's just a name. See Jeff Bonwick's Blog for more details.


## 相关链接

Source Code

- Stable:  https://github.com/openjdk/jdk
- Development: https://github.com/openjdk/zgc


Talks

- Oracle Code One 2019 - [Slides](http://cr.openjdk.java.net/~mikael/presentations/20190917-OracleCodeOne-DEV4459-G1_and_ZGC_A_Look_into_the_Progress_of_Garbage_Collection.pdf)
- PL-Meetup 2019 - [Slides](http://cr.openjdk.java.net/~pliden/slides/ZGC-PLMeetup-2019.pdf)
- Jfokus 2019 - [Slides](http://cr.openjdk.java.net/~pliden/slides/ZGC-Jfokus-2019.pdf) | [Video (21 min)](https://www.youtube.com/watch?v=qs2_w0sv3LQ)
- Devoxx 2018 - [Slides](http://cr.openjdk.java.net/~pliden/slides/ZGC-Devoxx-2018.pdf) | [Video (40 min)](https://www.youtube.com/watch?v=7cWiwu7kYkE)
- Oracle Code One 2018 - [Slides](http://cr.openjdk.java.net/~pliden/slides/ZGC-OracleCodeOne-2018.pdf) | [Video (45 min)](https://www.youtube.com/watch?v=kF_r3GE3zOo)
- Jfokus 2018 - [Slides](http://cr.openjdk.java.net/~pliden/slides/ZGC-Jfokus-2018.pdf) | [Video (45 min)](https://www.youtube.com/watch?v=tShc0dyFtgw)
- FOSDEM 2018 - [Slides](http://cr.openjdk.java.net/~pliden/slides/ZGC-FOSDEM-2018.pdf)

原文链接:

- https://wiki.openjdk.java.net/display/zgc
- https://openjdk.java.net/jeps/333
- http://www.herongyang.com/Java-GC/
