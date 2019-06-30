# HPROF: A Heap/CPU Profiling Tool

# 性能分析工具-HPROF简介

The Java 2 Platform Standard Edition (J2SE) has always provided a simple command line profiling tool called HPROF for heap and cpu profiling. HPROF is actually a JVM native agent library which is dynamically loaded through a command line option, at JVM startup, and becomes part of the JVM process. By supplying HPROF options at startup, users can request various types of heap and/or cpu profiling features from HPROF. The data generated can be in textual or binary format, and can be used to track down and isolate performance problems involving memory usage and inefficient code. The binary format file from HPROF can be used with tools such as [jhat](https://hat.dev.java.net/) to browse the allocated objects in the heap.

JDK始终提供一款名为`HPROF`的简单命令行分析工具，用于堆内存和cpu分析。 HPROF实际上是JVM中的一个本地agent，通过命令行参数可以在JVM启动时动态加载，并成为JVM进程的一部分。 

通过在启动时指定不同的HPROF选项，可以让HPROF执行各种类型的堆/cpu分析功能。 生成的数据可能是文本或二进制格式，用于跟踪和鉴别到底是内存问题还是低效代码的性能问题。 HPROF生成的二进制文件可以用 [jhat](https://hat.dev.java.net/) 等工具来查看堆内存中的对象。


In J2SE Version 5.0, HPROF has been implemented on the new Java Virtual Machine Tool Interface ([JVM TI](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/jhat.html)).

从 J2SE 5.0开始, HPROF 已经实现了新的 Java Virtual Machine Tool Interface ([JVM TI](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/jhat.html)) 。


## HPROF Startup

## 启动 HPROF

HPROF is capable of presenting CPU usage, heap allocation statistics, and monitor contention profiles. In addition, it can also report complete heap dumps and states of all the monitors and threads in the Java virtual machine. HPROF can be invoked by:

HPROF能够提供的数据包括:  CPU使用率，堆内存分配情况统计，以及管程(Monitor)的争用情况分析。 此外，还可以执行完整的堆转储，列出JVM中所有的 管程(Monitor) 和 线程(thread)。调用HPROF的方法如下:

```shell
java -agentlib:hprof[=options] XXXXXXXXClass
```

-OR-

```shell
java -Xrunhprof[:options] XXXXXXXXClass
```

Depending on the type of profiling requested, HPROF instructs the virtual machine to send it the relevant JVM TI events and processes the event data into profiling information. For example, the following command obtains the heap allocation profile:

根据参数指定的分析类型，HPROF 让虚拟机向其发送相关的JVM TI事件，并将事件数据处理为 profiling 信息。 例如，以下命令是进行堆分配分析：


```shell
java -agentlib:hprof=heap=sites XXXXXXXXClass
```

Following is the complete list of options that can be passed to HPROF:

使用 help 参数可以查看 HPROF 支持的所有配置项:

```shell
java -agentlib:hprof=help
```

可以看到有很多帮助信息( **多个option之间使用逗号分隔**):

```shell
     HPROF: Heap and CPU Profiling Agent (JVM TI Demonstration Code)

hprof usage: java -agentlib:hprof=[help]|[<option>=<value>, ...]

Option名称/值           说明                            默认值
---------------------  -----------                    -------
heap=dump|sites|all    堆内存分析(profiling)           all
cpu=samples|times|old  CPU 使用情况                    off
monitor=y|n            管程(Monitor)争用情况          n
format=a|b             输出文本/a;还是二进制/b;          a
file=<file>            指定输出文件                    java.hprof[.txt]
net=<host>:<port>      将输出数据通过socket发送         off
depth=<size>           打印的调用栈深度                 4
interval=<ms>          抽样周期(单位 ms)               10
cutoff=<value>         输出截断点                      0.0001
lineno=y|n             traces信息显示行号?             y
thread=y|n             traces信息显示thread            n
doe=y|n                退出时转储(dump on exit)?        y
msa=y|n                Solaris micro state accounting  n
force=y|n              是否强制输出到指定的文件 <file>      y
verbose=y|n            是否打印关于dumps的消息             y

Obsolete Options
----------------
gc_okay=y|n

Examples
--------
  - Get sample cpu information every 20 millisec, with a stack depth of 3:
      java -agentlib:hprof=cpu=samples,interval=20,depth=3 classname
  - Get heap usage information based on the allocation sites:
      java -agentlib:hprof=heap=sites classname

Notes
-----
  - The option format=b cannot be used with monitor=y.
  - The option format=b cannot be used with cpu=old|times.
  - Use of the -Xrunhprof interface can still be used, e.g.
       java -Xrunhprof:[help]|[<option>=<value>, ...]
    will behave exactly the same as:
       java -agentlib:hprof=[help]|[<option>=<value>, ...]

Warnings
--------
  - This is demonstration code for the JVM TI interface and use of BCI,
    it is not an official product or formal part of the J2SE.
  - The -Xrunhprof interface will be removed in a future release.
  - The option format=b is considered experimental, this format may change
    in a future release.
```

By default, heap profiling information (sites and dump) is written out to `java.hprof.txt` (ascii). The output in most cases will contain ID's for traces, threads,and objects. Each type of ID will typically start with a different number than the other ID's. For example, traces might start with 300000.

默认情况下，堆分析信息（`sites` 和 `dump`）将被写入到 `java.hprof.txt` 文件中(采用ascii编码)。 在大多数情况下，输出内容包含 traces ID, threads ID, 以及 objects ID。 每种ID的起始值一般不同。 例如，traces 可能以300000开始。


Normally the default (`force=y`) will clobber any existing information in the output file, so if you have multiple VMs running with HPROF enabled, you should use `force=n`, which will append additional characters to the output filename as needed.

默认选项 (`force=y`) 会清除输出文件中的所有内容,  所以如果有多个VM启用了HPROF, 应该使用 `force=n` 选项, 在需要时会将输出文件名加上额外的字符。


The interval option only applies to `cpu=samples` and controls the time that the sampling thread sleeps between samples of the thread stacks.

`interval` 选项只适用于 `cpu=samples` 的情况, 用来控制抽样(sampling)线程睡眠的时间, 以决定两次 thread stacks 采样的间隔 。


The msa option only applies to Solaris and causes the Solaris Micro State Accounting to be used.

`msa` 选项只适用于Solaris, 会使用 Solaris Micro State Accounting。


The interval, msa, and force options are new HPROF options in J2SE 1.5.

`interval`, `msa,` 以及 `force` 都是 J2SE 1.5 后增加的HPROF选项。


## Example Usage

## 使用示例


We could create an application, but let's instead pick on an existing Java application in the J2SE, `javac`. With `javac` I need to pass Java options in with -J. If you were running Java directly, you would not use the -J prefix.

可以创建新程序, 也可以直接使用Java平台现有的程序: 如 `javac`。 通过  `-J` 选项可以将某些标识传给运行 `javac` 程序的底层JVM。 如果运行普通的Java应用, 则不需要 `-J ` 前缀。


There is also a way to pass in J2SE 5.0 Java options with an environment variable JAVA_TOOL_OPTIONS, but with all environment variables you need to be careful that you don't impact more VMs than you intend.

J2SE 5.0 中还可以设置环境变量 `JAVA_TOOL_OPTIONS`, 但要小心，不要设置全局环境变量, 以免影响其他 JVM/实例。


## Heap Allocation Profiles (heap=sites)

## 堆分配分析(heap=sites)


Following is the heap allocation profile generated by running the Java compiler (`javac`) on a set of input files. Only parts of the profiler output file (java.hprof.txt) are shown here.

以下是通过 `javac` 来编译文件时所生成的 heap allocation profile。当然这里只展示了  `java.hprof.txt` 文件的一部分。

使用的命令为: 

```
javac -J-agentlib:hprof=heap=sites Hello.java
```

部分输出信息如下:

```

SITES BEGIN (ordered by live bytes) Fri Oct 22 11:52:24 2004
          percent          live          alloc'ed  stack class
 rank   self  accum     bytes objs     bytes  objs trace name
    1 44.73% 44.73%   1161280 14516  1161280 14516 302032 java.util.zip.ZipEntry
    2  8.95% 53.67%    232256 14516   232256 14516 302033 com.sun.tools.javac.util.List
    3  5.06% 58.74%    131504    2    131504     2 301029 com.sun.tools.javac.util.Name[]
    4  5.05% 63.79%    131088    1    131088     1 301030 byte[]
    5  5.05% 68.84%    131072    1    131072     1 301710 byte[]

```

A crucial piece of information in heap profile is the amount of allocation that occurs in various parts of the program. The `SITES` record above tells us that 44.73% of the total space was allocated for `java.util.zip.ZipEntry` objects at a particular SITE (a unique stack trace of a fixed depth). Note that the amount of live data matches the total allocated numbers, which means that a garbage collection may have happened shortly before HPROF iterated over the heap. Normally the amount of live data will be less than or equal to the total allocation that has occurred at a given site.

heap profile 文件中最关键的信息是 allocation 总量。在上面的文件中, `SITES` 记录展示出有  44.73%  的总空间是在一个特定的位置(SITE, 唯一的固定深度的调用栈)分配的 `java.util.zip.ZipEntry` 对象。请注意, 上面列出的所有分配总量, 等于存活数据的总量, 也就是说在 HPROF 遍历整个堆之前可能发生了一次GC. 通常来说, 存活数据量要小于等于在某个给定site所分配的内存总量。


A good way to relate allocation sites to the source code is to record the dynamic stack traces that led to the heap allocation. Following is another part of the `java.hprof.txt` file that illustrates the stack traces referred to by the top two allocation sites in the output shown above.

将 allocation site 与源代码关联起来的一种方法, 是记录导致堆分配的动态调用栈(dynamic stack traces) 。下面是 `java.hprof.txt` 文件的另一部分, 展示了最前面两个分配点的 stack traces。




```
TRACE 302032:
        java.util.zip.ZipEntry.<init>(ZipEntry.java:101)
        java.util.zip.ZipFile$3.nextElement(ZipFile.java:435)
        java.util.zip.ZipFile$3.nextElement(ZipFile.java:413)
        com.sun.tools.javac.jvm.ClassReader.openArchive(ClassReader.java:1442)
TRACE 302033:
        com.sun.tools.javac.util.List.<init>(List.java:43)
        com.sun.tools.javac.util.List.<init>(List.java:51)
        com.sun.tools.javac.util.ListBuffer.append(ListBuffer.java:98)
        com.sun.tools.javac.jvm.ClassReader.openArchive(ClassReader.java:1442)

```

Each frame in the stack trace contains class name, method name, source file name, and the line number. The user can set the maximum number of frames collected by the HPROF agent (depth option). The default depth is 4. Stack traces reveal not only which methods performed heap allocation, but also which methods were ultimately responsible for making calls that resulted in memory allocation.

调用栈中的每一帧(frame)都包含了 类名,方法名,源文件名称和行号。我们可以指定 `depth` 选项来设置HPROF采集的最大帧数. 默认 `depth=4`。Stack trace不仅展示哪个方法执行了堆内存分配, 还展示这个方法的调用链。


The above stack traces are shared with all the running threads, if it was necessary to separate the stack traces of different threads the thread option would need to be used. This will increase the space used and the number of stack traces in the output file.

上面的 stack traces 由所有正在运行的线程共用, 如果要将每个线程的 stack traces 分别记录, 请使用 `thread=y` 选项. 但这样会增加输出文件的大小, 以及 stack traces 的记录数。


If the depth of the stacks wasn't deep enough, the depth option could be used to increase the stack depth. Currently, recursion is not treated specially, so getting the caller information on very deep recursion stacks can be difficult. The larger the depth, the more space is needed to save the stack traces.

如果显示的栈深度不够, 请使用 `depth` 选项来增加调用栈的深度. 目前, 递归不会被特殊对待,所以如果有很深的递归调用,那就很难展示调用栈信息了.  设置的栈深度越大, 需要的空间也就越大。


So what does the above information tell us? For `javac`, having lots of `ZipEntry` and `List` class instances makes sense, so other than the fact that `javac` relies heavily on these classes there isn't much else to say. Normally you want to watch out for large accumulations of objects, allocated at the same location, that seem excessive.

从以上片段可以提取哪些信息? 可以看到, `javac` 工具, 创建了大量的 `ZipEntry` 和 `List` 类对象, 直观点说, `javac` 严重依赖于这些类。一般来说，需要重点关注在某个位置分配的大量对象,  很可能就是过度分配的特征。


Don't expect the above information to reproduce on identical runs with applications that are highly multi-threaded.

在多线程的复杂系统中, 这些信息会很难再现。


This option can impact the application performance due to the data gathering (stack traces) on object allocation and garbage collection.

这个选项会明显影响应用程序的性能, 因为在分配对象和垃圾收集时需要采集 stack traces 信息。


## Heap Dump (heap=dump)

## 堆转储 (heap=dump)


A complete dump of the current live objects in the heap can be obtained with:

可以通过下面的命令得到当前存活对象的完整堆转储:

```
javac -J-agentlib:hprof=heap=dump Hello.java
```


This is a very large output file, but can be viewed and searched in any editor. But a better way to look at this kind of detail is with [HAT](http://docs.oracle.com/javase/8/docs/technotes/samples/hprof.html#HAT). All the information of the above `heap=sites` option is included, plus the specific details on every object allocated and the references to all objects.

生成的输出文件可能会很大, 但可以使用文本编辑器来查看。 最好是使用 [HAT](#hat_sample) 工具来解析。 除了包含 `heap=sites` 选项所展示的全部信息, `heap=dump` 还展示了每次对象分配的相关信息, 以及对所有对象的引用。


This option causes the greatest amount of memory to be used because it stores details on every object allocated, it can also impact the application performance due to the data gathering (stack traces) on object allocation and garbage collection.

因为需要保存每次对象分配的细节, `heap=dump` 选项会使用大量的内存, 在对象分配和垃圾收集时还会采集调用栈信息(stack traces), 会严重影响程序的性能（只适合在排查某些特定问题的场景使用）。


## CPU Usage Sampling Profiles (cpu=samples)

## CPU使用率抽样分析(cpu=samples)


HPROF can collect CPU usage information by sampling threads. Following is part of the output collected from a run of the `javac` compiler.


HPROF可以通过采样线程收集CPU的使用率。下面是从 `javac` 编译器的一次运行过程中采集的输出。


使用的命令为: 

```
javac -J-agentlib:hprof=cpu=samples Hello.java

```

部分输出信息如下:

```

CPU SAMPLES BEGIN (total = 126) Fri Oct 22 12:12:14 2004
rank   self  accum   count trace method
   1 53.17% 53.17%      67 300027 java.util.zip.ZipFile.getEntry
   2 17.46% 70.63%      22 300135 java.util.zip.ZipFile.getNextEntry
   3  5.56% 76.19%       7 300111 java.lang.ClassLoader.defineClass2
   4  3.97% 80.16%       5 300140 java.io.UnixFileSystem.list
   5  2.38% 82.54%       3 300149 java.lang.Shutdown.halt0
   6  1.59% 84.13%       2 300136 java.util.zip.ZipEntry.initFields
   7  1.59% 85.71%       2 300138 java.lang.String.substring
   8  1.59% 87.30%       2 300026 java.util.zip.ZipFile.open
   9  0.79% 88.10%       1 300118 com.sun.tools.javac.code.Type$ErrorType.<init>
  10  0.79% 88.89%       1 300134 java.util.zip.ZipFile.ensureOpen
```



The HPROF agent periodically samples the stack of all running threads to record the most frequently active stack traces. The `count` field above indicates how many times a particular stack trace was found to be active (not how many times a method was called). These stack traces correspond to the CPU usage hot spots in the application. This option does not require BCI or modifications of the classes loaded and of all the options causes the least disturbance of the application being profiled.

HPROF agent 定期采样运行状态中的所有线程调用栈, 记录最活跃的 stack traces 。 上面的 `count` 列显示了某个特定 stack trace 被采样到的次数(并不是这个方法被调用的具体次数)。 这些 stack traces 对应了程序中的CPU使用热点. 这个选项不需要 BCI (Byte Code Injection )或者修改加载的类, 在HPROF支持的所有选项中,  `cpu=samples`对程序的性能影响最小。

The interval option can be used to adjust the sampling time or the time that the sampling thread sleeps between samples.

`interval` 选项可以用来调整采样周期， 即采样线程(sampling thread) 每次sleep的时间。


So what does the above information tell us? First, statistically it's a pretty poor sample, only 126 samples, compiling a larger Java source file would probably yield better information, or better yet a large batch of Java sources. Second, this data pretty much matches the heap=sites data in that we know that `javac` relies heavily on the `ZipFile` class, which makes sense. It appears that any performance improvements in `ZipFile` will probably improve the performance of `javac`. The stack traces of interest here are:

以上信息告诉我们什么信息? 

首先, 汇总来看这只是一个很少量的抽样, 只有126个样本, 编译一个很大的Java源文件,或者是一批Java源文件, 可能会生成更漂亮的展示信息. 

其次, 这次的数据和 `heap=sites` 示例的数据能互相对照, 我们知道`javac`严重依赖`ZipFile`类, 因为它在其中有很大作用。假如可以对 `ZipFile`类进行性能优化，应该会提高`javac`的性能。有趣的是 stack traces 部分:




```java
TRACE 300027:
java.util.zip.ZipFile.getEntry(ZipFile.java:Unknown line)
java.util.zip.ZipFile.getEntry(ZipFile.java:253)
java.util.jar.JarFile.getEntry(JarFile.java:197)
java.util.jar.JarFile.getJarEntry(JarFile.java:180)

TRACE 300135:
java.util.zip.ZipFile.getNextEntry(ZipFile.java:Unknown line)
java.util.zip.ZipFile.access$700(ZipFile.java:35)
java.util.zip.ZipFile$3.nextElement(ZipFile.java:419)
java.util.zip.ZipFile$3.nextElement(ZipFile.java:413)

```

Don't expect the above information to reproduce on identical runs with highly multi-threaded applications, especially when the sample count is low.

不要指望这样简单的信息会在多线程高并发的应用系统中出现, 尤其是样本数量这么少。




## CPU Usage Times Profile (cpu=times)

## CPU使用时间分析(cpu=times)

> `cpu=times` 选项在Mac版的JDK8中会出Lambda相关BUG。可以搜索 `java.lang.NoClassDefFoundError: java/lang/invoke/LambdaForm$MH`。 官方的回复是不予修复。


HPROF can collect CPU usage information by injecting code into every method entry and exit, keeping track of exact method call counts and the time spent in each method. This uses Byte Code Injection (BCI) and runs considerably slower than cpu=samples. Following is part of the output collected from a run of the `javac` compiler.


HPROF可以在每个方法的入口和出口处注入代码, 跟踪每个方法被调用的次数和消耗的时间, 以汇总收集CPU使用时间信息.  这个选项使用了字节码注入技术(Byte Code Injection, BCI) , 比 `cpu=samples` 选项的执行速度慢了很多。下面是`javac` 执行过程中的一部分输出。


使用的命令为: 

```
javac -J-agentlib:hprof=cpu=times Hello.java
```

部分输出信息如下:

```

CPU TIME (ms) BEGIN (total = 103099259) Fri Oct 22 12:21:23 2004
rank   self  accum   count trace method
   1  5.28%  5.28%       1 308128 com.sun.tools.javac.Main.compile
   2  5.16% 10.43%       1 308127 com.sun.tools.javac.main.Main.compile
   3  5.15% 15.58%       1 308126 com.sun.tools.javac.main.Main.compile
   4  4.07% 19.66%       1 308060 com.sun.tools.javac.main.JavaCompiler.compile
   5  3.90% 23.56%       1 306652 com.sun.tools.javac.comp.Enter.main
   6  3.90% 27.46%       1 306651 com.sun.tools.javac.comp.Enter.complete
   7  3.74% 31.21%       4 305626 com.sun.tools.javac.jvm.ClassReader.listAll
   8  3.74% 34.95%      18 305625 com.sun.tools.javac.jvm.ClassReader.list
   9  3.24% 38.18%       1 305831 com.sun.tools.javac.comp.Enter.classEnter
  10  3.24% 41.42%       1 305827 com.sun.tools.javac.comp.Enter.classEnter
  11  3.24% 44.65%       1 305826 com.sun.tools.javac.tree.Tree$TopLevel.accept
  12  3.24% 47.89%       1 305825 com.sun.tools.javac.comp.Enter.visitTopLevel
  13  3.23% 51.12%       1 305725 com.sun.tools.javac.code.Symbol.complete
  14  3.23% 54.34%       1 305724 com.sun.tools.javac.jvm.ClassReader.complete
  15  3.23% 57.57%       1 305722 com.sun.tools.javac.jvm.ClassReader.fillIn
  16  1.91% 59.47%      16 305611 com.sun.tools.javac.jvm.ClassReader.openArchive
  17  1.30% 60.78%     330 300051 java.lang.ClassLoader.loadClass
  18  1.28% 62.06%     330 300050 java.lang.ClassLoader.loadClass
  19  1.22% 63.28%     512 300695 java.net.URLClassLoader.findClass
  20  1.21% 64.48%     512 300693 java.net.URLClassLoader$1.run
  21  1.09% 65.57%   14516 305575 java.util.zip.ZipFile$3.nextElement
  22  0.98% 66.55%   14516 305574 java.util.zip.ZipFile$3.nextElement
  23  0.96% 67.52%       1 304560 com.sun.tools.javac.main.JavaCompiler.instance
  24  0.96% 68.48%       1 304559 com.sun.tools.javac.main.JavaCompiler.<init>
  25  0.71% 69.19%     256 302078 java.net.URLClassLoader.access$100

```

Here the count represents the true count of the times this method was entered, and the percentages represent a measure of thread time spent in those method.

其中 `count` 表示真正进入此方法的次数, 百分比值则表示各个线程在此方法中消耗的总时间的比例。


The traces normally don't include line numbers but can be added with the `lineno` option.

trace 通常不包括行号, 但也可以通过 `lineno` 选项添加。


Looking at the above data, it appears that even though some of the ZipFile$3 class methods are called over 14,000 times, they don't seem to be consuming vast amounts of CPU time. Again, this is probably represents a poor sample and I would not put much time into analyzing the above information.

审查上面的数据, 虽然类 `ZipFile$3` 中的一部分方法被调用了 14000 多次, 但并没有消耗太多的CPU时间. 既然这样看了, 这个样本可能没有什么意义, 我们也就不花时间来分析这些信息了。


<a name="hat_sample"></a>

## Using HAT with HPROF

## 使用 HAT 与 HPROF


[HAT](https://hat.dev.java.net/) (Heap Analysis Tool) is a browser based tool that uses the HPROF binary format to construct web pages so you can browse all the objects in the heap, and see all the references to and from objects.

[HAT](https://hat.dev.java.net/) (Heap Analysis Tool,堆内存分析工具) 是一款基于浏览器的工具, 利用HPROF二进制格式来构建web页面, 然后就可以查看堆中的所有对象, 以及各个对象中相关的引用，引用的谁，被谁引用的记录都有。


## A Bit of HPROF History

## HPROF的历史简介


Previous releases of J2SE (1.2 through 1.4) contained an HPROF agent built on the experimental JVMPI. JVMPI worked fairly reliably in the old 1.2 Classic VM, but it was unreliable and difficult to maintain with the newer HotSpot VM and the different garbage collectors in the 1.3 and 1.4 releases. The newer JVM TI in J2SE 5.0 replaces both JVMDI and JVMPI. In the 5.0 release, JVMPI is still available, and the older HPROF JVMPI based agent from 1.4.2 can actually be used with 5.0, but it isn't recommended. The new HPROF, in J2SE 5.0, is (with minor exceptions) a fully functional replacement for the old HPROF but source wise was close to being a complete rewrite. All the old options are available, and the output format is basically the same. So if you are used to the old HPROF output, or you have tools that read any HPROF format, you won't see many differences and hopefully you will see fewer problems that you have seen in the past with the JVMPI-based HPROF. The source to HPROF is available with the full JDK download in the `demo/jvmti/hprof` installation directory.

早期的Java版本中(1.2~1.4),  基于实验性质的JVMPI构建了一套 HPROF agent。 但JVMPI 只兼容 1.2 版本的 Classic VM, 而在1.3~1.4版本的 HotSpot VM  和GC上非常不稳定, 很难维护。从 `Java 5.0` 开始推出了新的 `JVM TI` 来取代 `JVMDI` 和 `JVMPI`。  JVMPI在5.0版本中依然可用,  基于 JVMPI的老版本HPROF agent， 只要兼容1.4.2就兼容5.0, 但已经不推荐使用了。 

J2SE 5.0版本的新 HPROF 依然存在小BUG，基本上属于一款完全重写的全功能替代产品。 所有的配置选项完全兼容, 输出格式大体上也保持一致，所以如果你有什么分析工具基于旧的HPROF格式, 并不会有太多的不同，而且BUG会比老版本的要少.  HPROF的源码在JDK安装路径的 `demo/jvmti/hprof` 目录下。




## How Does HPROF Work?

## HPROF的工作原理


HPROF is a dynamically-linked native library that uses JVM TI and writes out profiling information either to a file descriptor or to a socket in ascii or binary format. This information can be further processed by a profiler front-end tool or dumped to a file. It generates this information through calls to JVM TI, event callbacks from JVM TI, and through Byte Code Insertion (BCI) on all class file images loaded into the VM. JVM TI has an event called `JVMTI_EVENT_CLASS_FILE_LOAD_HOOK` which gives HPROF access to the class file image and an opportunity to modify that class file image before the VM actually loads it. Sound scary? It is, don't take BCI lightly. In the case of HPROF the BCI operations only instrument and don't change the behavior of the bytecodes. Use of JVM TI was pretty critical here for HPROF to do BCI because we needed to do BCI on ALL the classes, including early classes like `java.lang.Object`. Of course, the instrumentation code needs to be made inoperable until the VM has reached a stage where this inserted code can be executed, normally the event `JVMTI_EVENT_VM_INIT`.

HPROF 是一个C语言写的本地(native)动态链接库, 通过 `JVM TI` , 将分析信息写入文件或者 socket 中,  支持 ascii 文本格式或者二进制格式. 其输出的信息可以由其他工具处理, 或者 dump 到某个文件中. 

采集信息的方式包括：

- 直接调用JVM TI
- 注册 JVM TI事件回调
- 通过 BCI 注入字节码到所有的class文件映像中

 JVM TI 中有一个叫做 `JVMTI_EVENT_CLASS_FILE_LOAD_HOOK`的事件, 可以让 HPROF 操作 class文件映像, 有机会在JVM加载class之前修改这个class文件映像。

听起来是不是感觉有点害怕? 确实, 不要小看了BCI.  HPROF 注入的 BCI操作只进行统计, 不会改变字节码的行为.  `JVM TI` 对HPROF中的 BCI 操作来说是非常重要, 因为需要对所有class都执行字节码注入, 包括早期加载的`java.lang.Object`类等等。 当然, 注入的操作代码需要等 JVM 到达一定阶段才会执行, 一般来说是 `JVMTI_EVENT_VM_INIT` 事件发生之后。


The amount of BCI that HPROF does depends on the options supplied, cpu=times triggers insertions into all method entries and exits, and the heap options trigger BCI on the `<init>` method of `java.lang.object` and any '`newarray`' opcodes seen in any method. This BCI work is actually done through the shared library `java_crw_demo`, which accepts a set of options, a class file image, and returns a new class file image. The `java_crw_demo` library is part of the sources delivered with the J2SE 5.0 in the `demo/jvmti` directory.

HPROF 执行的 BCI 数量取决于具体的选项：

- `cpu=times` 会插入代码到所有方法的入口和出口

- `heap` 选项会在 `java.lang.Object` 类的 `<init>` 方法, 以及所有方法体的 `newarray` 操作码上触发BCI操作。

BCI的具体工作是由共享库`java_crw_demo`执行的, 其输入项包括 options 配置, 一个 class 文件映像, 返回一个新的 class 文件映像。 Java 5.0 版本中 `java_crw_demo` 库的源码位于`demo/jvmti`目录下。


Currently HPROF injects calls to static Java methods which in turn call a native method that is in the HPROF agent library itself. This was an early design choice to limit the extra Java code introduced during profiling. So the combination of the requested JVM TI events, and the created BCI events, provides the basics for HPROF to work.

目前, HPROF注入对静态Java方法的调用, 其中反过来调用HPROF agent的native方法. 这是一个早期的设计, 用来避免在Java代码分析时又产生新的对象. 所以要求组合 JVM TI事件, 以及创建的BCI事件,以支持 HPROF 执行。


The cpu=samples option doesn't use BCI, HPROF just spawns a separate thread that sleeps for a fixed number of micro seconds, and wakes up and samples all the running thread stacks using JVM TI.

- `cpu=samples` 选项不使用BCI,  只是创建一个独立的线程,  sleep 固定的时间(micro seconds, 微秒),  然后醒来, 调用 JVM TI 来采样所有运行线程的调用栈。


The cpu=times option attempts to track the running stack of all threads, and keep accurate CPU time usage on all methods. This option probably places the greatest strain on the VM, where every method entry and method exit is tracked. Applications that make many method calls will be impacted more than others.

- `cpu=times` 选项尝试跟踪所有运行线程的堆栈变化, 精确计数所有方法使用的CPU时间. 这个选项的影响在不同程序中并不一样, 因为需要跟踪每一个方法的进入和退出, 所以, 具有大量方法调用的程序受到的影响会更大。


The heap=sites and heap=dump options are the ones that need to track object allocations. These options can be memory intensive (less so with hprof=sites) and applications that allocate many objects or allocate and free many objects will be impacted more with these options. On each object allocation, the stack must be sampled so we know where the object was allocated, and that stack information must be saved. HPROF has a series of tables allocated in the C or `malloc()` heap that track all it's information. HPROF currently does not allocate any Java objects.

- `heap=sites` 和 `heap=dump` 选项需要跟踪对象的分配.  所以内存密集型的，分配/释放大量对象的程序，受到的影响可能会更大(`hprof=sites`还好一些).  在每一次对象分配时, 都必须采样线程调用栈, 才能知道是在哪个位置分配的, 还必须保存调用栈数据。HPROF在 C r或者 `malloc()` heap 中保存有一系列的表, 用于存放所有的跟踪信息。HPROF 不生成任何Java对象。


## Summary

## 总结


As you can see, the HPROF agent can be used to generate a wide variety of profiles. But as the above examples using `javac` demonstrate, make sure you have a large enough sampling to know that your data makes sense.

可以看到, HPROF agent 可用于生成各种分析报告。如同上面的 `javac` 示例, 请保证有一个足够大的样本, 才能看出一些有意义的信息。


Brave C/JNI programmers could even take the source to HPROF (it's available in the J2SE SDK download in the `demo/jvmti/hprof` directory) and customize it or create their own special profiling tool.

厉害点的 C/JNI 开发者还可以查看 HPROF 的源码(位于JDK安装路径的 `demo/jvmti/hprof` 目录下),  在此基础上定制和开发自己的分析工具。




原文链接: <http://docs.oracle.com/javase/8/docs/technotes/samples/hprof.html>

最新版英汉对照地址: <https://github.com/cncounter/translation/blob/master/tiemao_2017/20_hprof/20_hprof.md>

