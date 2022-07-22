# async-profiler简介


async-profiler 是一款低开销的 Java 采样分析器(sampling profiler), 最大的亮点是避免了 [安全点偏差问题](http://psy-lob-saw.blogspot.com/2016/02/why-most-sampling-java-profilers-are.html)。

其大致的实现原理, 是利用 HotSpot 专有的 API, 采集调用栈(stack traces)信息, 以及追踪内存分配信息。 兼容 OpenJDK、Oracle JDK 以及其他基于 HotSpot JVM 的 Java 运行时。


async-profiler 可以跟踪的事件类型包括:

- CPU周期
- 硬件/软件性能计数器: 比如CPU高速缓存未命中, 代码分支未命中, 页面错误, 线程上下文切换等等.
- Java堆内存中的对象分配
- 锁尝试, 包括管程锁(Java object monitor) 以及 ReentrantLock


由于优异的性能和完备的特征, 很多工具在内部都使用了 async-profiler, 比如我们熟悉的编辑器 IntelliJ Idea, 以及交互分析工具 Arthas。


## 演示程序

async-profiler 的作者 apangin 给出了很多demo程序, 可以访问以下网址获取:

> https://github.com/apangin/java-profiling-presentation

其中有一个 StringBuilderTest 程序, 程序代码大致如下:

```java
public class StringBuilderTest {

    public static void main(String[] args) {
        // 创建一个字符串构建器
        StringBuilder builder = new StringBuilder();
        builder.append(new char[100_0000]);
        do {
            builder.append(10086);
            builder.delete(0, 5);
        } while ("".length() < 10);
        // 实际上因为死循环, 没有退出条件, 代码执行不到此处;
        System.out.println(builder);
    }
}
```

代码很简单, 一直在追加和删除 StringBuilder 中的内容; 读者可以使用最喜欢的分析器, 来分析这个程序，看看是否可以找出占用 CPU 时间最多的热点代码。

接下来我们先介绍一些背景知识。


## 采样分析器

sampling profiler, 采样分析器, 有时候也称为 "抽样分析器"。 

根据概率学知识, 通过采样/抽样, 只要样本达到一定规模, 我们就可以进行推导分析，认为这些样本大概率能够暴露应用所遇到的性能问题。
我们在进行性能优化或者系统故障排查时, 一般都是通过监控来分析代码行为和性能瓶颈。 
在排查或解决了大部分常见的系统瓶颈后, 如果需要进一步分析和优化, 可以使用 Profiling 技术, 在程序运行过程中, 动态收集各种信息, 并对收集到的样本数据进行自动化分析。 
大部分JVM Profiler都支持从多个维度进行分析，比如CPU、内存、线程、类加载、GC等等。
其中最最常用的是 CPU 采样分析(CPU Profiling), 可以用于确定代码的执行热点, 比如:

- 哪些方法消耗了最多的CPU执行时间
- 每个方法占用的比例是多少

通过 CPU Profiling 技术得到这些信息之后, 我们就可以针对热点代码进行专门的优化，从而解决很多性能领域的疑难问题，提升吞吐量和响应速度，同时也降低资源消耗。

除CPU采样分析器之外, 常见的还有分配分析器(Allocation Profiler), 可用来确定哪些代码执行路径分配了大量的对象，从而针对性优化。 内存的分配分析以及对象的内存占用是另一个话题, 请参考其他章节。


## 其他分析器存在的问题 

很多分析器都不太完善, 或多或少存在一些问题, 例如:

- 安全点偏差问题: 采样分析器(Sampling profilers), 只在安全点状态进行采样, 很多时候会掩盖真实的问题点;
- 性能问题: 检测类型(Instrumenting)的分析器, 请求安全点对齐的代价高, 执行效率差, 严重影响系统性能, 一般不能用于生产环境;
- 设计缺陷: 无法检测本地方法, 导致繁忙线程和空闲线程的抽样都是相同的调用栈;
- 功能较少: 缺少一些必要的手段和功能, 无法处理复杂的问题。

虽然这么说，但是工具无对错, 业界的很多分析器都有其存在的价值, 帮助大家解决了很多问题, 关键还是看用的人。


## async-profiler的特征


async-profiler的执行原理和特征可以概括为:

- 异步获取调用栈: AsyncGetCallTrace
- 发送信号
- 只会采样存活线程
- 没有安全点偏差问题
- 无法追踪Native代码


## 下载与安装

先打开官方项目页面, 网址为: 

> https://github.com/jvm-profiling-tools/async-profiler

页面中列出了支持的各种平台:

- Linux x64 (glibc): glibc基于GNU C Library所实现的C语言标准库, 主要是桌面和服务器系统使用;
- Linux x64 (musl): musl是一个轻量级的C标准库, 用于嵌入式系统和移动设备;
- Linux arm64: arm芯片的系统版本
- macOS x64/arm64: MacOS不区分芯片, 因为苹果自己做了兼容转换。

页面中还提供了一个各种 profile 格式的转换器:

- Converters between profile formats: (JFR to Flame Graph, JFR to FlameScope, collapsed stacks to Flame Graph)

最新的 async-profiler 下载链接请参考上面提供的官方页面地址, 部分参考下载脚本为:

```sh
# Linux x64平台
https://github.com/jvm-profiling-tools/async-profiler/releases/download/v2.8.1/async-profiler-2.8.1-linux-x64.tar.gz

# Mac
https://github.com/jvm-profiling-tools/async-profiler/releases/download/v2.8.1/async-profiler-2.8.1-macos.zip

```

下载完成之后, 解压即可使用。 

这款工具使用了 Java、C、C++、shell等多种语言进行开发; 按照常识, Java相关的工具, 需要配置好JDK相关的 `JAVA_HOME` 和 `PATH` 环境变量。

> 如果网络不好, 或者下载缓慢, 可以试试 gitee 提供的克隆功能; 或者咨询其他小伙伴, 本文不方便提供支持。


## 基本使用介绍

使用之前, 先来看看帮助信息。

### 帮助信息

直接执行启动命令脚本 `profiler.sh`, 显示帮助信息:

```sql
./profiler.sh
Usage: ./profiler.sh [action] [options] <pid>
Actions:
  start             start profiling and return immediately
  resume            resume profiling without resetting collected data
  stop              stop profiling
  dump              dump collected data without stopping profiling session
  check             check if the specified profiling event is available
  status            print profiling status
  list              list profiling events supported by the target JVM
  collect           collect profile for the specified period of time
                    and then stop (default action)
Options:
  -e event          profiling event: cpu|alloc|lock|cache-misses etc.
  -d duration       run profiling for <duration> seconds
  -f filename       dump output to <filename>
  -i interval       sampling interval in nanoseconds
  -j jstackdepth    maximum Java stack depth
  -t                profile different threads separately
  -s                simple class names instead of FQN
  -g                print method signatures
  -a                annotate Java methods
  -l                prepend library names
  -o fmt            output format: flat|traces|collapsed|flamegraph|tree|jfr
  -I include        output only stack traces containing the specified pattern
  -X exclude        exclude stack traces with the specified pattern
  -v, --version     display version string

  --title string    FlameGraph title
  --minwidth pct    skip frames smaller than pct%
  --reverse         generate stack-reversed FlameGraph / Call tree

  --loop time       run profiler in a loop
  --alloc bytes     allocation profiling interval in bytes
  --lock duration   lock profiling threshold in nanoseconds
  --total           accumulate the total value (time, bytes, etc.)
  --all-user        only include user-mode events
  --sched           group threads by scheduling policy
  --cstack mode     how to traverse C stack: fp|dwarf|lbr|no
  --begin function  begin profiling when function is executed
  --end function    end profiling when function is executed
  --ttsp            time-to-safepoint profiling
  --jfrsync config  synchronize profiler with JFR recording
  --lib path        full path to libasyncProfiler.so in the container
  --fdtransfer      use fdtransfer to serve perf requests
                    from the non-privileged target

<pid> is a numeric process ID of the target JVM
      or 'jps' keyword to find running JVM automatically
      or the application's name as it would appear in the jps tool

Example: ./profiler.sh -d 30 -f profile.html 3456
         ./profiler.sh start -i 999000 jps
         ./profiler.sh stop -o flat jps
         ./profiler.sh -d 5 -e alloc MyAppName

```


下面我们对帮助信息进行基本的解读。


### 命令格式

从提示信息中可以看到, 命令的使用格式为:

```
./profiler.sh [action] [options] <pid>
```

### 指定进程

先从简单的部分说起:

`<pid>` 部分表示目标JVM:

- 精准定位的进程ID, 一般是数字格式; 我们可以使用 `ps` 或者 'jps -v' 等命令来查看本机运行的JVM进程, 根据相应的名称和参数确定具体的PID即可;
- 可以使用 'jps' 关键字, 自动查找执行中的JVM;
- 还可以指定应用名称, 和 jps 工具显示的一致即可;

一般来说我们直接指定进程ID会比较好, 但是在只运行单个Java进程的机器环境中, 也可以使用便捷的方式, 有时候是多台机器/多个shell窗口同时操作, 使用 shell 标签的命令广播时会很方便。

### 示例用法

看看示例用法:

```
# 这是最常用的方式, 分析指定进程30秒, 火焰图结果输出到html文件
./profiler.sh -d 30 -f profile.html 3456

# 在后台开始分析, 指定采样间隔, 使用 jps 关键字自动定位进程;
./profiler.sh start -i 999000 jps

# 结束分析, 指定输出格式, 使用 jps 关键字自动定位进程;
./profiler.sh stop -o flat jps

# 持续时间5秒, 内存分配分析, 使用应用名称定位JVM进程;
./profiler.sh -d 5 -e alloc MyAppName
```

如果具有多个进程, 自动定位的方式可能会存在一些问题, 这时候使用具体的PID才能精准定位;


### 动作列表

支持的 action 动作列表为:

- `start`             开始分析, 在后台异步执行, 并立即返回
- `stop`              停止分析, 并将分析结果打印到标准输出
- `resume`            恢复分析, 并且不要丢弃之前采集的数据
- `dump`              导出数据, 将采集到的数据转储, 但是不停止分析过程
- `check`             检查是否支持指定的分析事件类型
- `status`            打印分析状态
- `list`              列出目标JVM支持的分析事件列表
- `collect`           采集指定的时间周期, 使用默认动作, 到时间之后自动停止。

部分动作的示例如下:


### 事件列表

不同的硬件平台和操作系统, 支持的事件有所不同.

查看支持哪些事件:

MacOSX系统下执行:

```sh
# Mac系统
./profiler.sh list

Basic events:
  cpu
  alloc
  lock
  wall
  itimer
Java method calls:
  ClassName.methodName
```

Linux系统中执行:

```sh
# Linux系统
./profiler.sh list

Basic events:
  cpu
  alloc
  lock
  wall
  itimer
Java method calls:
  ClassName.methodName
Perf events:
  page-faults
  context-switches
  cycles
  instructions
  cache-references
  cache-misses
  branch-instructions
  branch-misses
  bus-cycles
  L1-dcache-load-misses
  LLC-load-misses
  dTLB-load-misses
  rNNN
  pmu/event-descriptor/
  mem:breakpoint
  trace:tracepoint
  kprobe:func
  uprobe:path
```




某些环境下不支持特定事件, 可以通过 `-e` 来切换其他事件。



### 参数选项


Options:
  -e event          profiling event: cpu|alloc|lock|cache-misses etc.
  -d duration       run profiling for <duration> seconds
  -f filename       dump output to <filename>
  -i interval       sampling interval in nanoseconds
  -j jstackdepth    maximum Java stack depth
  -t                profile different threads separately
  -s                simple class names instead of FQN
  -g                print method signatures
  -a                annotate Java methods
  -l                prepend library names
  -o fmt            output format: flat|traces|collapsed|flamegraph|tree|jfr
  -I include        output only stack traces containing the specified pattern
  -X exclude        exclude stack traces with the specified pattern
  -v, --version     display version string

  --title string    FlameGraph title
  --minwidth pct    skip frames smaller than pct%
  --reverse         generate stack-reversed FlameGraph / Call tree

  --loop time       run profiler in a loop
  --alloc bytes     allocation profiling interval in bytes
  --lock duration   lock profiling threshold in nanoseconds
  --total           accumulate the total value (time, bytes, etc.)
  --all-user        only include user-mode events
  --sched           group threads by scheduling policy
  --cstack mode     how to traverse C stack: fp|dwarf|lbr|no
  --begin function  begin profiling when function is executed
  --end function    end profiling when function is executed
  --ttsp            time-to-safepoint profiling
  --jfrsync config  synchronize profiler with JFR recording
  --lib path        full path to libasyncProfiler.so in the container
  --fdtransfer      use fdtransfer to serve perf requests
                    from the non-privileged target



### 其他



## Idea中执行CPU耗时采样分析

IntelliJ IDEA Ultimate 2018.3 及以上版本内置集成了 async-profiler 工具, 更多详细信息请查看 [IntelliJ IDEA documentation](https://blog.jetbrains.com/idea/2018/09/intellij-idea-2018-3-eap-git-submodules-jvm-profiler-macos-and-linux-and-more/).

虽然在开发环境执行性能分析看着有点Low, 但很多问题其实也能分析出来。 各个版本的使用大同小异, 大致流程都是一样的。

先进入配置界面:

![](idea-cpu-profiler.png)

可以配置采样周期, 然后保存并关闭, 接着以选项运行程序:

![](idea-run-with-profiler.jpg)

再次运行程序时, 可以从这里打开:

![](idea-run-with-profiler-2.jpg)


或者是挂载(Attach)到运行中的Java进程, 选择菜单:

![](idea-attach-profiler.jpg)

然后选择进程即可。

程序持续运行, 我们可以在适当的时间点击停止采样分析。

查看分析结果:

![](idea-cpu-profiler-result.jpg)

这里提供了3种界面, Flame Chart(火焰图), Call Tree(树形调用链), Method List(方法调用数统计列表), 选择你喜欢的方式查看即可。

Idea还提供了一些配套的功能和菜单, 各位小伙伴可以多多探索。


## Docker之中的使用案例


假设我们的 docker 容器名称为 `test-docker-container-id`。

进入Docker:

```
# 拷贝文件到docker中
docker cp /home/data/async-profiler-2.8.1-linux-x64.tar.gz  test-docker-container-id:/data/app/
# 进入docker执行脚本
docker container exec -it test-docker-container-id /bin/bash

```

在Docker之中执行一些解压之类的准备工作:

```
# 解压
cd /data/app
tar zxf async-profiler-2.8.1-linux-x64.tar.gz

# 进入解压后的目录
cd async-profiler-2.8.1-linux-x64

# 查看JVM进程的pid
jps -v
7 test-profiling.jar -Xmx6g -Xms5g
      -XX:+UnlockExperimentalVMOptions -XX:+UseZGC
      -XX:ParallelGCThreads=4 -XX:ConcGCThreads=4
      -XX:ZCollectionInterval=50 -Xlog:gc*=info:file=gc.log:time:filecount=0
651 Jps -Dapplication.home=/usr/local/openjdk-11 -Xms8m -Djdk.module.main=jdk.jcmd
```

可以看到, 我们的目标进程PID=7; 为什么是7呢? 这是因为使用了自定义的Docker入口脚本, 并且在其中执行了一些初始化操作。

然后Docker之中执行:

```
./profiler.sh -d 30 7
[WARN] Kernel symbols are unavailable due to restrictions. Try
  sysctl kernel.kptr_restrict=0
  sysctl kernel.perf_event_paranoid=1
[WARN] perf_event_open for TID 7 failed: Operation not permitted
...
[WARN] perf_event_open for TID 488 failed: Operation not permitted
[ERROR] No access to perf events. Try --fdtransfer or --all-user option or 'sysctl kernel.perf_event_paranoid=1'
```

exit 退回到宿主机, 在宿主机中使用root权限执行:

```
sysctl kernel.perf_event_paranoid=1

```

然后继续进入Docker之中执行:

```
./profiler.sh -d 30 7
[ERROR] Perf events unavailable

./profiler.sh --all-user -d 30 7
[ERROR] Perf events unavailable

./profiler.sh --fdtransfer -d 30 7
[ERROR] Perf events unavailable
```

怎么办? 在官方仓库中搜索 `Perf events unavailable`, 找到一个解决方案:

```
./profiler.sh -e itimer -d 30 7
Profiling for 30 seconds
```

输出的内容太长, 我们将其重定向到一个文件中:


```
./profiler.sh -e itimer -d 30 7 > profiler_log.txt
Profiling for 30 seconds

Done
```

分析导出的结果, 这里是:

```
--- Execution profile ---
Total samples       : 72809
GC_active           : 1 (0.00%)
unknown_Java        : 1280 (1.76%)
not_walkable_Java   : 174 (0.24%)

--- 287460000000 ns (39.48%), 28746 samples
  [ 0] ZMark::try_mark_object(ZMarkCache*, unsigned long, bool)
  [ 1] ZMark::work_without_timeout(ZMarkCache*, ZMarkStripe*, ZMarkThreadLocalStacks*)
  [ 2] ZMark::work(unsigned long)
  [ 3] ZTask::GangTask::work(unsigned int)
  [ 4] GangWorker::loop()
  [ 5] Thread::call_run()
  [ 6] thread_native_entry(Thread*)
  [ 7] start_thread
```

发现是ZGC占用的CPU时间比较多; 

这里能看到 async-profiler 的优势了, 如果是普通的线程栈抽样工具, 是很难排查到这些内部的线程的。

殊途同归, 我们通过top命令来确认一下, 结果如下所示:


```
top -H

 PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   11 root      20   0   17.0t  18.2g  17.3g R  79.1 189.3 895:37.84 ZWorker#2
    9 root      20   0   17.0t  18.2g  17.3g R  78.7 189.3 895:41.33 ZWorker#0
   12 root      20   0   17.0t  18.2g  17.3g R  78.7 189.3 895:43.22 ZWorker#3
   10 root      20   0   17.0t  18.2g  17.3g R  78.4 189.3 895:39.57 ZWorker#1
  148 root      20   0   17.0t  18.2g  17.3g R  31.9 189.3 328:43.10 input-exec
```

继续观察和分析, 发现确实是GC的问题。 因为G1的吞吐量比ZGC好一些, 我们换成G1垃圾收集器试试.

```
JAVA_OPTS_Z=-Xmx6g -Xms5g \
    -XX:+UnlockExperimentalVMOptions -XX:+UseZGC \
    -XX:ParallelGCThreads=4 -XX:ConcGCThreads=4 \
    -XX:ZCollectionInterval=50 -Xlog:gc*=info:file=gc.log:time:filecount=0
JAVA_OPTS=-Xmx6g -Xms6g -XX:+UseG1GC \
   -XX:ParallelGCThreads=8 -XX:ConcGCThreads=4 \
   -Xlog:gc*=info:file=gc.log:time:filecount=0

```

切换为G1之后, 吞吐量上升了 1 倍左右。

我们这里的应用场景是Kafka消费端, 在进行了多次性能优化之后, 为了继续提升CPU使用率和系统吞吐量, 引入了RxJava框架, 这种业务特征导致了内存中的很多对象会持续存活很多个GC周期。
一个类似的案例, 是我们团队的专家解决的: 在Kafka服务端使用ZGC也会造成吞吐量瓶颈问题, 切换成G1之后吞吐量大幅上升。
至于 Kafka 生产者, 大部分情况下使用ZGC减少业务暂停时间, 避免响应延迟的尖刺问题, 还是很有帮助的。

看来, 虽然 ZGC 在暂停时间方面优势很大，但是在高并发高负载高分配的场景下, 吞吐量可能并不如G1。
我们的很多业务系统更关注响应延迟和GC暂停时间, 所以还需要具体情况具体分析。


持续运行, 持续监控。



```
jcmd

jcmd 7 help
```



## 相关链接

- [async-profiler GitHub项目首页](https://github.com/jvm-profiling-tools/async-profiler)
- [async-profiler WIKI](https://github.com/jvm-profiling-tools/async-profiler/wiki)
- [Async-profiler作者的分享视频](https://www.youtube.com/playlist?list=PLNCLTEx3B8h4Yo_WvKWdLvI9mj1XpTKBr)
- [安全点偏差问题: Why (Most) Sampling Java Profilers Are Fucking Terrible](http://psy-lob-saw.blogspot.com/2016/02/why-most-sampling-java-profilers-are.html)
- [火焰图(CPU Flame Graphs)](https://www.brendangregg.com/FlameGraphs/cpuflamegraphs.html)
- [如何读懂火焰图？](http://www.ruanyifeng.com/blog/2017/09/flame-graph.html)
- [A Guide to Java Profilers](https://www.baeldung.com/java-profilers)
- [JVM CPU Profiler技术原理及源码深度解析](https://tech.meituan.com/2019/10/10/jvm-cpu-profiler.html)
- [Arthas中使用profiler](https://github.com/alibaba/arthas/blob/master/site/docs/doc/profiler.md)


> EAP, Early Access Program, 抢先体验计划;
