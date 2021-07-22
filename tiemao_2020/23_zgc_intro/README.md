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

| 系统平台(Platform) | 是否支持(Supported) | 起始版本(Since) | 备注(Comment) |
| :---------- | :---------- | :---------- | :------- |
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

Let's assume you want a 16G Java heap. That means you need `16G / 2M = 8192` huge pages.

First assign at least 16G (8192 pages) of memory to the pool of huge pages. The "at least" part is important, since enabling the use of large pages in the JVM means that not only the GC will try to use these for the Java heap, but also that other parts of the JVM will try to use them for various internal data structures (code heap, marking bitmaps, etc). In this example we will therefore reserve 9216 pages (18G) to allow for 2G of non-Java heap allocations to use large pages.

Configure the system's huge page pool to have the required number pages (requires root privileges):

### Linux系统开启大页面

配置ZGC使用大页面通常会产生更好的性能（包括吞吐量，延迟和启动时间），除了设置稍微复杂指纹并没有什么缺点。
但配置的过程中需要root权限，这也是为什么默认情况下不开启的原因。

在 Linux/x86 平台上，大页面(large pages) 也称为“巨型页面”(huge pages)， 其大小为2MB。

假设Java堆内存为16G, 那么需要的大页面数量为: `16G / 2M = 8192`。

首先，将至少16G（8192页）的内存分配给大页池。
“至少” 这个描述很关键，因为在JVM中启用大页面的使用, 意味着不仅GC会将这些页面用于Java堆，其他JVM组件也会将其用于各种内部数据结构，比如 code heap, marking bitmaps（标记位图）等等。
在此案例中，我们将会保留9216页（18G），其中分配2G的大页来作为非堆部分（non-Java heap）。

配置系统的大页池需要root权限，比如设置为所需页数的命令：

```shell
$ echo 9216 > /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages
```

Note that the above command is not guaranteed to be successful if the kernel can not find enough free huge pages to satisfy the request. Also note that it might take some time for the kernel to process the request. Before proceeding, check the number of huge pages assigned to the pool to make sure the request was successful and has completed.

请注意上述命令不一定能保证成功，比如内核找不到足够的空闲大页面等情况。
另请注意，内核可能需要一段时间来处理这种请求。 在继续之前，请检查分配给池的大页面数，以确保请求成功并已完成。

```shell
$ cat /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages

9216
```

NOTE! If you're using a Linux kernel >= 4.14, then the next step (where you mount a hugetlbfs filesystem) can be skipped. However, if you're using an older kernel then ZGC needs to access large pages through a hugetlbfs filesystem.

Mount a hugetlbfs filesystem (requires root privileges) and make it accessible to the user running the JVM (in this example we're assuming this user has 123 as its uid).

如果 `Linux kernel >= 4.14`， 则可以跳过接下来挂载 hugetlbfs 文件系统的步骤。
但如果使用的内核版本比这个老，则ZGC需要通过 hugetlbfs 文件系统来访问大页面。

挂载hugetlbfs文件系统需要root权限，而且需要让启动JVM的用户可以访问。
假定该用户的uid为123：

```
$ mkdir /hugepages
$ mount -t hugetlbfs -o uid=123 nodev /hugepages
```

Now start the JVM using the -XX:+UseLargePages option.

这些条件都具备之后，我们可以使用 `-XX:+UseLargePages` 参数来开启大页面：

```
$ java -XX:+UnlockExperimentalVMOptions -XX:+UseZGC -Xms16G -Xmx16G -XX:+UseLargePages ...
```

If there are more than one accessible hugetlbfs filesystem available, then (and only then) do you also have to use -XX:AllocateHeapAt to specify the path to the filesystems you want to use. For example, assume there are multiple accessible hugetlbfs filesystems mounted, but the filesystem you specifically want to use it mounted on /hugepages, then use the following options.

如果有多个可用的hugetlbfs文件系统， 那么我们必须同时使用 `-XX:AllocateHeapAt` 参数来指定需要使用的文件系统路径。
例如，假设安装了多个可访问的hugetlbfs文件系统，但我们想使用挂载到 `/hugepages` 目录的这个，则使用的参数为:

```
$ java -XX:+UnlockExperimentalVMOptions -XX:+UseZGC -Xms16G -Xmx16G -XX:+UseLargePages -XX:AllocateHeapAt=/hugepages ...
```

NOTE! The configuration of the huge page pool and the mounting of the hugetlbfs file system is not persistent across reboots, unless adequate measures are taken.

注意！ 大页池的配置和 hugetlbfs 文件系统的挂载不会自动持久化，除非采取其他措施，否则系统重启后就丢失。


### Enabling Transparent Huge Pages On Linux

An alternative to using explicit large pages (as described above) is to use transparent huge pages. Use of transparent huge pages is usually not recommended for latency sensitive applications, because it tends to cause unwanted latency spikes. However, it might be worth experimenting with to see if/how your workload is affected by it. But be aware, your mileage may vary.

NOTE! On Linux, using ZGC with transparent huge pages enabled requires kernel >= 4.7.

Use the following options to enable transparent huge pages in the VM:


### 在Linux系统开启透明式大页面

除了明确指定使用大页面之外， 还可以使用透明方式的大页面。
对延迟非常敏感的系统来说，一般不建议使用透明式大页面，因为有可能会导致不必要的延迟峰值。
但可能尝试一下，看看是否会影响工作负载。 当然，具体情况可能各个系统会有所不同。

注意！ 在Linux上，使用透明式大页面要求内核 `kernel >= 4.7`。

开启透明大页面的JVM参数为：

```
# 低延迟敏感的系统不推荐
-XX:+UseLargePages -XX:+UseTransparentHugePages
```

These options tell the JVM to issue `madvise(..., MADV_HUGEPAGE)` calls for memory it mapps, which is useful when using transparent huge pages in madvise mode.

To enable transparent huge pages you also need to configure the kernel, by enabling the madvise mode.

这些参数让JVM对其映射的内存执行 `madvise(..., MADV_HUGEPAGE)` 调用， 这在 madvise 模式下使用透明大页面时非常有用。

要启用透明大页面， 还需要系统管理员启用madvise模式， 配置内核的方法为：

```
$ echo madvise > /sys/kernel/mm/transparent_hugepage/enabled

$ echo advise > /sys/kernel/mm/transparent_hugepage/shmem_enabled

```

See the [kernel documentation](https://www.kernel.org/doc/Documentation/vm/transhuge.txt) for more information.

更多信息请参考 [Linux内核参考文档](https://www.kernel.org/doc/Documentation/vm/transhuge.txt)

### Enabling NUMA Support

ZGC has NUMA support, which means it will try it's best to direct Java heap allocations to NUMA-local memory. This feature is enabled by default. However, it will automatically be disabled if the JVM detects that it's bound to a sub-set of the CPUs in the system. In general, you don't need to worry about this setting, but if you want to explicitly override the JVM's decision you can do so by using the `-XX:+UseNUMA` or `-XX:-UseNUMA` options.

When running on a NUMA machine (e.g. a multi-socket x86 machine), having NUMA support enabled will often give a noticeable performance boost.

### 启用NUMA支持

ZGC 对 NUMA 提供支持，也就是说， 会尽最大努力将Java堆分配定向到 NUMA-local 内存。
默认情况下这个功能是开启的。 但如果JVM进程检测到自身被绑定到某一部分CPU内核，则会自动禁用。
一般情况下我们不需要关心此项配置, 如果要明确指定JVM的行为，则可以使用 `-XX:+UseNUMA` 或者 `-XX:-UseNUMA` 参数开关。

在 NUMA 机器（例如多个插槽的x86机器）上运行时， 启用NUMA支持通常会获得显着的性能提升。

### Enabling GC Logging

### 开启GC日志

GC logging is enabled using the following command-line option:

开启GC日志的参数格式为:

```
-Xlog:<tag set>,[<tag set>, ...]:<log file>
```

For general information/help on this option:

JDK9之后的版本，查看GC日志相关的帮助信息：

```
java -Xlog:help
```

To enable basic logging (one line of output per GC):

打印基本的GC日志， 每次GC打印1行：

```
-Xlog:gc:gc.log
```

To enable GC logging that is useful for tuning/performance analysis:

在性能分析和调优时，打印更详细的GC日志:

```
-Xlog:gc*:gc.log
```

Where `gc*` means log all tag combinations that contain the gc tag, and `:gc.log` means write the log to a file named gc.log.

其中， `gc*` 的含义是： 标签(tag)中包含 gc 这两个字母的所有日志信息都打印出来。

`:gc.log` 则表示将日志信息输出到文件 `gc.log` 之中。


## Change Log

## ZGC相关的更新日志

### JDK 15 (under development)
- Production ready (JEP 377)
- Improved NUMA awareness
- Support for Class Data Sharing (CDS)
- Support for placing the heap on NVRAM
- Support for compressed class pointers
- Additional JFR events

### JDK 15 (2020年06月: 正在开发中。。。)
- 正式发版准备就绪 (JEP 377)
- 提高 NUMA 的识别灵敏度
- 支持类信息共享, Class Data Sharing (CDS)
- 支持将堆内存分配到 NVRAM
- 支持压缩class指针(compressed class pointers)
- 新增部分 JFR 事件

### JDK 14
- macOS support (JEP 364)
- Windows support (JEP 365)
- Support for tiny/small heaps (down to 8M)
- Support for JFR leak profiler
- Support for limited and discontiguous address space
- Parallel pre-touch (when using `-XX:+AlwaysPreTouch`)
- Performance improvements (clone intrinsic, etc)
- Stability improvements

### JDK 14 版本
- 支持 macOS 系统 (JEP 364)
- 支持 Windows 系统 (JEP 365)
- 支持超小堆内存(tiny/small heaps, 下限为8M)
- 支持JFR泄漏分析器
- 支持受限的和不连续的地址空间
- 并行 pre-touch (使用参数 `-XX:+AlwaysPreTouch`)
- 性能优化 (clone intrinsic, etc)
- 提升稳定性


### JDK 13
- Increased max heap size from 4TB to 16TB
- Support for uncommitting unused memory (JEP 351)
- Support for -XX:SoftMaxHeapSIze
- Support for the Linux/AArch64 platform
- Reduced Time-To-Safepoint

### JDK 13 版本
- 最大堆内存从 `4TB` 增加到 `16TB`
- 支持返还未使用的内存 (JEP 351)
- 支持 `-XX:SoftMaxHeapSIze`
- 支持 Linux/AArch64 平台
- 缩短安全点时间(Time-To-Safepoint)


### JDK 12
- Support for concurrent class unloading
- Further pause time reductions

### JDK 12 版本
- 支持并发方式的类卸载(class unloading)
- 进一步减少GC暂停时间


### JDK 11
- Initial version of ZGC
- Does not support class unloading (using `-XX:+ClassUnloading` has no effect)

### JDK 11 版本
- ZGC的第一版
- 不支持类卸载（ `-XX:+ClassUnloading` 参数在此版本中无效）


## FAQ

### What does the "Z" in ZGC stand for?

It doesn't stand for anything, ZGC is just a name. It was originally inspired by, or a homage to, ZFS (the filesystem) which in many ways was revolutionary when it first came out. Originally, ZFS was an acronym for "Zettabyte File System", but that meaning was abandoned and it was later said to not stand for anything. It's just a name. See Jeff Bonwick's Blog for more details.

## 解惑：ZGC中的字母Z是什么意思?

其实这个Z没有什么特殊的含义，ZGC就是一个名字而已。
最初名字的来源是为了致敬伟大的 ZFS 文件系统。 最初 ZFS 的含义是 "Zettabyte File System", 但后来这个含义也被放弃了。
所以这个ZGC就只是一个代号，具体的信息可以参考: [Jeff Bonwick's Blog](https://web.archive.org/web/20170223222515/https://blogs.oracle.com/bonwick/en_US/entry/you_say_zeta_i_say)。

> `^_^` 其实有一点 Zero 的意思，无停顿垃圾收集器， 然而这个目标没有达到。



## 实际测试

系统版本:

```
# cat /etc/lsb-release
DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=16.04
DISTRIB_CODENAME=xenial
DISTRIB_DESCRIPTION="Ubuntu 16.04.4 LTS"

```

JVM 启动参数:

```
export JAVA_OPTS="-Xmx6g -Xms6g -XX:+UnlockExperimentalVMOptions -XX:+UseZGC -XX:ParallelGCThreads=8 -XX:ConcGCThreads=28 -XX:ZCollectionInterval=5"
```

结果：

```
[GC日志监听-GC事件]gcId=8; duration:61; gcDetail: {"duration":61,"maxPauseMillis":61,"gcCause":"Timer","collectionTime":37,"gcAction":"end of major GC","afterUsage":{"ZHeap":"738MB","CodeHeap 'profiled nmethods'":"20MB","CodeHeap 'non-profiled nmethods'":"7MB","Metaspace":"85MB","CodeHeap 'non-nmethods'":"1MB"},"gcId":8,"collectionCount":8,"gcName":"ZGC","type":"jvm.gc.pause"}

[GC日志监听-GC事件]gcId=165; duration:34; gcDetail: {"duration":34,"maxPauseMillis":61,"gcCause":"Timer","collectionTime":973,"gcAction":"end of major GC","afterUsage":{"ZHeap":"184MB","CodeHeap 'profiled nmethods'":"26MB","CodeHeap 'non-profiled nmethods'":"9MB","Metaspace":"93MB","CodeHeap 'non-nmethods'":"1MB"},"gcId":165,"collectionCount":165,"gcName":"ZGC","type":"jvm.gc.pause"}

[GC日志监听-GC事件]gcId=179; duration:38; gcDetail: {"duration":38,"maxPauseMillis":61,"gcCause":"Timer","collectionTime":1060,"gcAction":"end of major GC","afterUsage":{"ZHeap":"184MB","CodeHeap 'profiled nmethods'":"26MB","CodeHeap 'non-profiled nmethods'":"9MB","Metaspace":"93MB","CodeHeap 'non-nmethods'":"1MB"},"gcId":179,"collectionCount":179,"gcName":"ZGC","type":"jvm.gc.pause"}
...
```

稳定在30ms~40ms的暂停时间，没有达到10ms的状态。

系统负载:

```
# ps -ef | wc -l
242

# free -h
              total        used        free      shared  buff/cache   available
Mem:            31G        1.0G         21G        6.3G        9.0G         23G
Swap:          4.0G          0B        4.0G

# top
top - 11:07:28 up 777 days, 18:57,  1 user,  load average: 1.28, 1.14, 1.18
Tasks: 240 total,   1 running, 134 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.2 us,  0.1 sy,  0.0 ni, 99.4 id,  0.3 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem : 32917052 total, 22454852 free,  1018152 used,  9444048 buff/cache
KiB Swap:  4190204 total,  4190204 free,        0 used. 24765604 avail Mem
```

ps -ef | grep -v grep | grep java | grep `hostname`



修改JVM 启动参数 `-XX:ConcGCThreads=8`:

```
export JAVA_OPTS="-Xmx6g -Xms6g -XX:+UnlockExperimentalVMOptions -XX:+UseZGC -XX:ParallelGCThreads=8 -XX:ConcGCThreads=8 -XX:ZCollectionInterval=5"
```

再次启动, 结果略有降低:

```
[GC日志监听-GC事件]gcId=7; duration:131; gcDetail: {"duration":131,"maxPauseMillis":131,"gcCause":"Timer","collectionTime":20,"gcAction":"end of major GC","afterUsage":{"ZHeap":"678MB","CodeHeap 'profiled nmethods'":"20MB","CodeHeap 'non-profiled nmethods'":"7MB","Metaspace":"85MB","CodeHeap 'non-nmethods'":"1MB"},"gcId":7,"collectionCount":7,"gcName":"ZGC","type":"jvm.gc.pause"}

[GC日志监听-GC事件]gcId=29; duration:25; gcDetail: {"duration":25,"maxPauseMillis":131,"gcCause":"Timer","collectionTime":96,"gcAction":"end of major GC","afterUsage":{"ZHeap":"186MB","CodeHeap 'profiled nmethods'":"24MB","CodeHeap 'non-profiled nmethods'":"7MB","Metaspace":"86MB","CodeHeap 'non-nmethods'":"1MB"},"gcId":29,"collectionCount":29,"gcName":"ZGC","type":"jvm.gc.pause"}

[GC日志监听-GC事件]gcId=3225; duration:24; gcDetail: {"duration":24,"maxPauseMillis":131,"gcCause":"Timer","collectionTime":11879,"gcAction":"end of major GC","afterUsage":{"ZHeap":"178MB","CodeHeap 'profiled nmethods'":"25MB","CodeHeap 'non-profiled nmethods'":"10MB","Metaspace":"95MB","CodeHeap 'non-nmethods'":"1MB"},"gcId":3225,"collectionCount":3225,"gcName":"ZGC","type":"jvm.gc.pause"}

```




8核心6GB配置信息:

```
[GC日志监听-初始化]jvmInfo={"osConfig":{"freePhysicalMemorySize":"102405MB","availableProcessors":8,"name":"Linux","totalPhysicalMemorySize":"140767MB","arch":"amd64","version":"4.15.0-64-generic"},"runtimeConfig":{"vmName":"Java HotSpot(TM) 64-Bit Server VM","specVersion":"11","inputArguments":["-Xmx4g","-Xms4g","-XX:ParallelGCThreads=8","-XX:ConcGCThreads=8","-XX:+UnlockExperimentalVMOptions","-XX:+UseZGC","-XX:ZCollectionInterval=5","-Dcom.sun.management.jmxremote","-Dcom.sun.management.jmxremote.port=10080","-Dcom.sun.management.jmxremote.ssl=false","-Dcom.sun.management.jmxremote.authenticate=false","-Djava.security.egd=file:/dev/./urandom"],"vmId":"1@cnc-report-78cf5c6bcd-7drlp","vmVersion":"11.0.6+8-LTS","vmVendor":"Oracle Corporation","uptime":27977}}
```

AWS+K8S运行环境:

结果稳定在40ms左右,1分钟CPU负载均值在1.0左右（1核心CPU运行ZGC的1m负载在6.0左右）:

```
[GC日志监听-GC事件]gcId=74; duration:42; gcDetail: {"duration":42,"maxPauseMillis":67,"gcCause":"Timer","collectionTime":255,"gcAction":"end of major GC","afterUsage":{"ZHeap":"332MB","CodeHeap 'profiled nmethods'":"32MB","CodeHeap 'non-profiled nmethods'":"15MB","Metaspace":"103MB","CodeHeap 'non-nmethods'":"1MB"},"gcId":74,"collectionCount":74,"gcName":"ZGC","type":"jvm.gc.pause"}

[GC日志监听-GC事件]gcId=73; duration:45; gcDetail: {"duration":45,"maxPauseMillis":67,"gcCause":"Timer","collectionTime":252,"gcAction":"end of major GC","afterUsage":{"ZHeap":"352MB","CodeHeap 'profiled nmethods'":"32MB","CodeHeap 'non-profiled nmethods'":"15MB","Metaspace":"103MB","CodeHeap 'non-nmethods'":"1MB"},"gcId":73,"collectionCount":73,"gcName":"ZGC","type":"jvm.gc.pause"}
```




```
-XX:+UnlockExperimentalVMOptions -XX:+UseZGC -XX:ZCollectionInterval=5
-XX:+UseG1GC  -XX:MaxGCPauseMillis=50

# 如果G1的并发GC线程超过并行GC线程数则会报错。
-XX:ParallelGCThreads=1 -XX:ConcGCThreads=2
```

换成G1，其他参数不变。CPU负载在1-2左右。

```
[GC日志监听-初始化]jvmInfo={"osConfig":{"freePhysicalMemorySize":"106219MB","availableProcessors":8,"name":"Linux","totalPhysicalMemorySize":"140767MB","arch":"amd64","version":"4.15.0-64-generic"},"runtimeConfig":{"vmName":"Java HotSpot(TM) 64-Bit Server VM","specVersion":"11","inputArguments":["-Xmx4g","-Xms4g","-XX:ParallelGCThreads=8","-XX:ConcGCThreads=8","-XX:+UseG1GC","-XX:MaxGCPauseMillis=50","-Dcom.sun.management.jmxremote","-Dcom.sun.management.jmxremote.port=10080","-Dcom.sun.management.jmxremote.ssl=false","-Dcom.sun.management.jmxremote.authenticate=false","-Djava.security.egd=file:/dev/./urandom"],"vmId":"1@cnc-report-57c5548475-rmmqq","vmVersion":"11.0.6+8-LTS","vmVendor":"Oracle Corporation","uptime":26211}}

[GC日志监听-GC事件]gcId=18; duration:19; gcDetail: {"duration":19,"maxPauseMillis":24,"gcCause":"G1 Evacuation Pause","liveDataSize":"94MB","collectionTime":259,"gcAction":"end of minor GC","afterUsage":{"CodeHeap 'profiled nmethods'":"34MB","G1 Old Gen":"94MB","CodeHeap 'non-profiled nmethods'":"15MB","G1 Survivor Space":"22MB","Compressed Class Space":"11MB","Metaspace":"100MB","G1 Eden Space":"0","CodeHeap 'non-nmethods'":"1MB"},"gcId":18,"collectionCount":18,"gcName":"G1 Young Generation","type":"jvm.gc.pause"}

[GC日志监听-GC事件]gcId=20; duration:13; gcDetail: {"duration":13,"maxPauseMillis":24,"gcCause":"G1 Evacuation Pause","liveDataSize":"94MB","collectionTime":288,"gcAction":"end of minor GC","afterUsage":{"CodeHeap 'profiled nmethods'":"28MB","G1 Old Gen":"94MB","CodeHeap 'non-profiled nmethods'":"15MB","G1 Survivor Space":"26MB","Compressed Class Space":"11MB","Metaspace":"103MB","G1 Eden Space":"0","CodeHeap 'non-nmethods'":"1MB"},"gcId":20,"collectionCount":20,"gcName":"G1 Young Generation","type":"jvm.gc.pause"}

```


监控信息:

```
[GC日志监听-GC事件]gcId=7; duration:25; gcDetail: {"duration":25,"maxPauseMillis":71,"gcCause":"Proactive","collectionTime":31,"gcAction":"end of major GC","afterUsage":{"ZHeap":"214MB","CodeHeap 'profiled nmethods'":"26MB","CodeHeap 'non-profiled nmethods'":"8MB","Metaspace":"95MB","CodeHeap 'non-nmethods'":"1MB"},"gcId":7,"collectionCount":7,"gcName":"ZGC","type":"jvm.gc.pause"}
```


对应的 GC 日志：

```
[2020-07-22T19:54:13.335+0800] GC(6) Garbage Collection (Proactive)
[2020-07-22T19:54:13.338+0800] GC(6) Pause Mark Start 2.223ms
[2020-07-22T19:54:13.358+0800] GC(6) Concurrent Mark 19.991ms
[2020-07-22T19:54:13.358+0800] GC(6) Pause Mark End 0.119ms
[2020-07-22T19:54:13.359+0800] GC(6) Concurrent Process Non-Strong References 0.385ms
[2020-07-22T19:54:13.359+0800] GC(6) Concurrent Reset Relocation Set 0.010ms
[2020-07-22T19:54:13.359+0800] GC(6) Concurrent Destroy Detached Pages 0.001ms
[2020-07-22T19:54:13.359+0800] GC(6) Concurrent Select Relocation Set 0.758ms
[2020-07-22T19:54:13.359+0800] GC(6) Concurrent Prepare Relocation Set 0.086ms
[2020-07-22T19:54:13.361+0800] GC(6) Pause Relocate Start 1.410ms
[2020-07-22T19:54:13.363+0800] GC(6) Concurrent Relocate 2.162ms
[2020-07-22T19:54:13.363+0800] GC(6) Load: 0.01/0.03/0.01
[2020-07-22T19:54:13.363+0800] GC(6) MMU: 2ms/0.0%, 5ms/0.0%, 10ms/44.5%, 20ms/72.3%, 50ms/87.6%, 100ms/91.1%
[2020-07-22T19:54:13.363+0800] GC(6) Mark: 8 stripe(s), 2 proactive flush(es), 1 terminate flush(es), 0 completion(s), 0 continuation(s)
[2020-07-22T19:54:13.363+0800] GC(6) Relocation: Successful, 8M relocated
[2020-07-22T19:54:13.363+0800] GC(6) NMethods: 8271 registered, 1622 unregistered
[2020-07-22T19:54:13.363+0800] GC(6) Metaspace: 95M used, 97M capacity, 97M committed, 98M reserved
[2020-07-22T19:54:13.363+0800] GC(6) Soft: 7427 encountered, 0 discovered, 0 enqueued
[2020-07-22T19:54:13.363+0800] GC(6) Weak: 4925 encountered, 2543 discovered, 0 enqueued
[2020-07-22T19:54:13.363+0800] GC(6) Final: 305 encountered, 13 discovered, 0 enqueued
[2020-07-22T19:54:13.363+0800] GC(6) Phantom: 54 encountered, 38 discovered, 2 enqueued
[2020-07-22T19:54:13.363+0800] GC(6)                Mark Start          Mark End        Relocate Start      Relocate End           High               Low         
[2020-07-22T19:54:13.363+0800] GC(6)  Capacity:     6144M (100%)       6144M (100%)       6144M (100%)       6144M (100%)       6144M (100%)       6144M (100%)   
[2020-07-22T19:54:13.363+0800] GC(6)   Reserve:       48M (1%)           48M (1%)           48M (1%)           48M (1%)           48M (1%)           48M (1%)     
[2020-07-22T19:54:13.363+0800] GC(6)      Free:     5864M (95%)        5864M (95%)        5898M (96%)        5938M (97%)        5938M (97%)        5864M (95%)    
[2020-07-22T19:54:13.363+0800] GC(6)      Used:      232M (4%)          232M (4%)          198M (3%)          158M (3%)          232M (4%)          158M (3%)     
[2020-07-22T19:54:13.363+0800] GC(6)      Live:         -               102M (2%)          102M (2%)          102M (2%)             -                  -          
[2020-07-22T19:54:13.363+0800] GC(6) Allocated:         -                 0M (0%)            0M (0%)           20M (0%)             -                  -          
[2020-07-22T19:54:13.363+0800] GC(6)   Garbage:         -               129M (2%)           95M (2%)           51M (1%)             -                  -          
[2020-07-22T19:54:13.363+0800] GC(6) Reclaimed:         -                  -                34M (1%)           78M (1%)             -                  -          
[2020-07-22T19:54:13.363+0800] GC(6) Garbage Collection (Proactive) 232M(4%)->158M(3%)
```

结论: GC






## 相关链接

Source Code

ZGC相关源代码：

- 稳定版（Stable）:  https://github.com/openjdk/jdk
- 开发板（Development）: https://github.com/openjdk/zgc


Talks

ZGC英文版视频教程与PPT：

- Oracle Code One 2019 - [幻灯片转PDF_EN](http://cr.openjdk.java.net/~mikael/presentations/20190917-OracleCodeOne-DEV4459-G1_and_ZGC_A_Look_into_the_Progress_of_Garbage_Collection.pdf)
- PL-Meetup 2019 - [幻灯片转PDF_EN](http://cr.openjdk.java.net/~pliden/slides/ZGC-PLMeetup-2019.pdf)
- Jfokus 2019 - [幻灯片转PDF_EN](http://cr.openjdk.java.net/~pliden/slides/ZGC-Jfokus-2019.pdf) | [Video (21 min)](https://www.youtube.com/watch?v=qs2_w0sv3LQ)
- Devoxx 2018 - [幻灯片转PDF_EN](http://cr.openjdk.java.net/~pliden/slides/ZGC-Devoxx-2018.pdf) | [Video (40 min)](https://www.youtube.com/watch?v=7cWiwu7kYkE)
- Oracle Code One 2018 - [幻灯片转PDF_EN](http://cr.openjdk.java.net/~pliden/slides/ZGC-OracleCodeOne-2018.pdf) | [Video (45 min)](https://www.youtube.com/watch?v=kF_r3GE3zOo)
- Jfokus 2018 - [幻灯片转PDF_EN](http://cr.openjdk.java.net/~pliden/slides/ZGC-Jfokus-2018.pdf) | [Video (45 min)](https://www.youtube.com/watch?v=tShc0dyFtgw)
- FOSDEM 2018 - [幻灯片转PDF_EN](http://cr.openjdk.java.net/~pliden/slides/ZGC-FOSDEM-2018.pdf)
- 官方文档[JVM-11-GC-tuning-guide_EN.pdf](https://docs.oracle.com/en/java/javase/11/gctuning/hotspot-virtual-machine-garbage-collection-tuning-guide.pdf)

相关规范:

- https://openjdk.java.net/jeps/333
- http://www.herongyang.com/Java-GC/

其他教程:

- https://www.opsian.com/blog/javas-new-zgc-is-very-exciting/
- https://ionutbalosin.com/2019/12/jvm-garbage-collectors-benchmarks-report-19-12/
- https://dzone.com/articles/garbage-collectors-affect-microbenchmarks
- https://www.reddit.com/r/java/comments/a4q7xs/anyone_using_zgc/
- https://bugs.openjdk.java.net/browse/JDK-8240679

原文链接:

- https://wiki.openjdk.java.net/display/zgc
