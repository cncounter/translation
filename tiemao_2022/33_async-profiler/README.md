# async-profiler简介


async-profiler 是一款低开销的 Java 采样分析器(sampling profiler), 最大的亮点是避免了 [安全点偏差问题](http://psy-lob-saw.blogspot.com/2016/02/why-most-sampling-java-profilers-are.html)。

大致实现原理, 是利用 HotSpot 专有的 API, 采集调用栈(stack traces)信息, 以及追踪内存分配。 兼容 OpenJDK、Oracle JDK 以及其他基于 HotSpot JVM 的 Java 运行时。




async-profiler 可以跟踪以下类型的事件:

- CPU cycles
- Hardware and Software performance counters like cache misses, branch misses, page faults, context switches etc.
- Allocations in Java Heap
- Contented lock attempts, including both Java object monitors and ReentrantLocks

See our Wiki or 3 hours playlist to learn about all features.

## 采样分析器

sampling profiler, 采样分析器, 有时候也称为 "抽样分析器"。 通过采样/抽样, 只要样本达到一定规模, 根据概率学知识, 我们可以推导分析，认为这些样本大概率能够展示整体遇到的问题。

我们在进行性能优化或者排查系统故障时, 一般需要通过监控来分析代码行为和性能瓶颈。 
在解决大部分系统瓶颈问题后, 如果需要进一步优化, 可以通过 Profiling 技术, 在运行过程中动态收集程序运行相关信息, 并对样本进行自动化分析。 
大部分JVM Profiler都可以从多个维度对程序进行动态分析，比如CPU、内存、线程、类加载、GC等等。
其中最常用的是 CPU 采样分析(CPU Profiling), 用于确定代码的执行热点, 比如

- 哪些方法占用了最多的CPU执行时间
- 每个方法占用的比例是多少

通过 CPU Profiling 得到这些信息, 我们就可以针对热点代码进行专门的分析和优化，从而解决性能问题，提升吞吐量和响应速度。

除了CPU采样分析器之外, 常见的还有分配分析器(Allocation Profiler), 以确定哪些代码路径分配了大量的对象，从而针对性优化。 内存的分配分析是另一个话题, 本文暂不涉及。


## 传统抽样分析器面临的问题

大多数分析器都存在一些问题:

- 安全点偏差问题: 采样分析器(Sampling profilers), 只在安全点状态进行采样, 很多时候会掩盖真实的问题点;
- 性能问题: 检测类型(Instrumenting)的分析器, 请求安全点对齐的代价高, 执行效率差, 严重影响系统性能, 一般不能用于生产环境;
- 设计缺陷: 无法检测本地方法, 导致繁忙线程和空闲线程的抽样都是相同的调用栈;


您可以自己尝试，尝试使用您最喜欢的分析器分析此 StringBuilderTest 并找出占用您 CPU 时间最多的部分（VisualVM 的视频）


## async-profiler的执行原理

- 异步获取调用栈: AsyncGetCallTrace
- 发送信号
- 只会采样存活线程
- 没有安全点偏差问题
- 无法追踪Native代码

visualvm --jdkhome /Users/renfufei/SOFT_ALL/jdk-11.0.6.jdk/Contents/Home


/Applications/VisualVM.app/Contents/Resources/visualvm/etc/visualvm.conf


## 演示程序

官方给出了一个示例程序:

```java
import org.junit.Test;

public class StringBuilderTest {

    @Test
    public void testMain() {
        main(null);
    }

    public static void main(String[] args) {
        //
        StringBuilder builder = new StringBuilder();
        builder.append(new char[100_0000]);
        do {
            builder.append(10086);
            builder.delete(0, 5);
        } while ("".length() < 10);
        //
        System.out.println(builder);
    }
}
```


## 基本使用

帮助信息:

```
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

查看支持哪些命令

```sh
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

## 帮助信息

直接执行启动命令, 会显示帮助信息:

```
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



> EAP, Early Access Program, 抢先体验计划;
