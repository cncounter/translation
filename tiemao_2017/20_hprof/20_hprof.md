# HPROF: A Heap/CPU Profiling Tool

# 性能分析工具-HPROF简介


The Java 2 Platform Standard Edition (J2SE) has always provided a simple command line profiling tool called HPROF for heap and cpu profiling. HPROF is actually a JVM native agent library which is dynamically loaded through a command line option, at JVM startup, and becomes part of the JVM process. By supplying HPROF options at startup, users can request various types of heap and/or cpu profiling features from HPROF. The data generated can be in textual or binary format, and can be used to track down and isolate performance problems involving memory usage and inefficient code. The binary format file from HPROF can be used with tools such as [jhat](https://hat.dev.java.net/) to browse the allocated objects in the heap.

HPROF是Java 平台提供的一款命令行分析工具 , 用来分析堆内存分配情况以及CPU抽样.  本质是一个JVM native agent 库, 在JVM启动时通过命令行选项进行加载,  然后就附加到JVM进程中. 有多个选项可以控制 HPROF 的功能特征. 其生成的数据可能是文本格式，也可能是二进制格式的, 这些生成的数据可以用来跟踪内存使用量, 以及分离出造成性能问题的低效代码.  HPROF生成的二进制文件可以用其他工具来解析, 例如用 [jhat](https://hat.dev.java.net/) 来查看堆内存中分配的对象。


In J2SE Version 5.0, HPROF has been implemented on the new Java Virtual Machine Tool Interface ([JVM TI](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/jhat.html)).

从 J2SE 5.0开始, HPROF 已经的实现采用了新的 Java Virtual Machine Tool Interface ([JVM TI](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/jhat.html)) 。


## HPROF Startup

## 启动 HPROF


HPROF is capable of presenting CPU usage, heap allocation statistics, and monitor contention profiles. In addition, it can also report complete heap dumps and states of all the monitors and threads in the Java virtual machine. HPROF can be invoked by:


HPROF能够提供的数据包括: CPU使用率, 堆分配统计, 并监控资源争用. 此外,它还可以执行完整的堆转储, 列出JVM中所有的 monitors 和 threads。 调用HPROF的方式如下:



```
java -agentlib:hprof[=options] ToBeProfiledClass

```

-OR-

```
java -Xrunhprof[:options] ToBeProfiledClass
```

Depending on the type of profiling requested, HPROF instructs the virtual machine to send it the relevant JVM TI events and processes the event data into profiling information. For example, the following command obtains the heap allocation profile:

根据分析类型的不同, HPROF 让虚拟机给他发送相应的 JVM TI 事件, 并将事件信息处理成为分析数据. 例如,以下命令分析的是堆分配信息:


```
java -agentlib:hprof=heap=sites ToBeProfiledClass

```

Following is the complete list of options that can be passed to HPROF:

下面查看 HPROF 支持的所有配置项:

```
java -agentlib:hprof=help
```

可以看到下面的帮助信息:

```
     HPROF: Heap and CPU Profiling Agent (JVM TI Demonstration Code)

hprof usage: java -agentlib:hprof=[help]|[<option>=<value>, ...]

Option Name and Value  Description                    Default
---------------------  -----------                    -------
heap=dump|sites|all    heap profiling                 all
cpu=samples|times|old  CPU usage                      off
monitor=y|n            monitor contention             n
format=a|b             text(txt) or binary output     a
file=<file>            write data to file             java.hprof[.txt]
net=<host>:<port>      send data over a socket        off
depth=<size>           stack trace depth              4
interval=<ms>          sample interval in ms          10
cutoff=<value>         output cutoff point            0.0001
lineno=y|n             line number in traces?         y
thread=y|n             thread in traces?              n
doe=y|n                dump on exit?                  y
msa=y|n                Solaris micro state accounting n
force=y|n              force output to <file>         y
verbose=y|n            print messages about dumps     y

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

默认情况下,堆分析信息(sites and dump)被写入到 `java.hprof.txt` 文件中(采用ascii编码)。在大多数情况下, 输出的信息都会包括这些ID: traces ID, threads ID, 以及 objects ID。每种类型的ID 和其他类型都很容易区分. 例如, traces ID 可能从 300000 开始。


Normally the default (`force=y`) will clobber any existing information in the output file, so if you have multiple VMs running with HPROF enabled, you should use `force=n`, which will append additional characters to the output filename as needed.

默认选项 (`force=y`) 将擦写现有输出文件中的所有内容, 所以如果有多个VM启用了HPROF, 应该使用 `force=n` 选项, 这会根据需要在输出文件名上增加额外的字符。


The interval option only applies to `cpu=samples` and controls the time that the sampling thread sleeps between samples of the thread stacks.

interval 选项只适用于 `cpu=samples` 的情况, 用来控制两次 thread stacks 采样之间的 sampling 线程睡眠时间。


The msa option only applies to Solaris and causes the Solaris Micro State Accounting to be used.

msa 选项只适用于Solaris, 会使用 Solaris Micro State Accounting。


The interval, msa, and force options are new HPROF options in J2SE 1.5.

interval, msa, 以及 force 都是在 J2SE 1.5 以后新增加的HPROF选项。


## Example Usage

## 使用示例


We could create an application, but let's instead pick on an existing Java application in the J2SE, `javac`. With `javac` I need to pass Java options in with -J. If you were running Java directly, you would not use the -J prefix.

可以创建示例程序, 当然我们也可以直接选择一个Java平台现有的程序: `javac`。 通过  `-J` 选项可以直接将某些标识传递给运行 `javac` 的底层JVM。 如果运行普通的Java程序, 就不需要 `-J ` 前缀。


There is also a way to pass in J2SE 5.0 Java options with an environment variable JAVA_TOOL_OPTIONS, but with all environment variables you need to be careful that you don't impact more VMs than you intend.

还有一种方法是设置环境变量 `JAVA_TOOL_OPTIONS`, 但最好不要设置全局变量, 以免影响到其他 JVM/实例。


## Heap Allocation Profiles (heap=sites)

## 堆分配分析(heap=sites)


Following is the heap allocation profile generated by running the Java compiler (`javac`) on a set of input files. Only parts of the profiler output file (java.hprof.txt) are shown here.

以下是通过 `javac` 来编译文件时所生成的 heap allocation profile。当然这里只是输出文件 (java.hprof.txt) 中的一部分。



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

heap profile 中的关键信息是 allocation 的总量。上面的文件中, `SITES` 记录显示有  44.73%  的总空间是在一个特定的位置(SITE, 一个唯一的固定深度的调用栈)为 `java.util.zip.ZipEntry` 对象分配的。请注意, 上面列出的所有分配总量, 等于存活数据的总量, 也就是说在 HPROF 遍历整个 heap 之前发生了一次GC. 通常来说, 实时数据量小于或等于在一个给定的site所分配的总量。


A good way to relate allocation sites to the source code is to record the dynamic stack traces that led to the heap allocation. Following is another part of the `java.hprof.txt` file that illustrates the stack traces referred to by the top two allocation sites in the output shown above.

将 allocation site 与源代码联系起来的方法, 是将导致堆分配的动态调用栈(dynamic stack traces) 记下来。下面是 `java.hprof.txt` 的另一部分, 展示了最靠前的两个分配点的 stack traces。




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

调用栈中的每一帧(frame)都包含类名,方法名,源文件名以及行号。用户可以通过 depth 选项设置HPROF收集的最大帧数. 默认的 `depth=4`。栈跟踪不仅显示哪些方法执行了堆分配, 以及最初是由哪些方法在调用。


The above stack traces are shared with all the running threads, if it was necessary to separate the stack traces of different threads the thread option would need to be used. This will increase the space used and the number of stack traces in the output file.

上面的 stack traces 是由所有正在运行的线程所共享的, 如果要将不同线程的 stack traces 分别记录, 可以使用 `thread=y` 选项. 但这会输出文件的大小,以及 stack traces 的数量。


If the depth of the stacks wasn't deep enough, the depth option could be used to increase the stack depth. Currently, recursion is not treated specially, so getting the caller information on very deep recursion stacks can be difficult. The larger the depth, the more space is needed to save the stack traces.

如果显示的栈深度不够, 可以用 `depth` 选项来增加调用栈的深度. 目前, 递归不会被特殊对待,所以很深的递归调用栈信息,那就很难展示了. 深度越大, 就需要越多的空间来保存stack traces。


So what does the above information tell us? For `javac`, having lots of `ZipEntry` and `List` class instances makes sense, so other than the fact that `javac` relies heavily on these classes there isn't much else to say. Normally you want to watch out for large accumulations of objects, allocated at the same location, that seem excessive.

以上片段展示了哪些信息? 对于 `javac` 的操作, 其中有很多 `ZipEntry` 和 `List` 类实例被创建了, 简单点说, `javac` 严重依赖于这些类。如果看到有大量的对象堆积, 并且在同一位置分配的, 那很可能就是过度分配了。


Don't expect the above information to reproduce on identical runs with applications that are highly multi-threaded.

在多线程的应用程序中, 以上信息会很难再现。


This option can impact the application performance due to the data gathering (stack traces) on object allocation and garbage collection.

这个选项会显著影响应用程序的性能, 因为在对象分配和垃圾收集时需要采集数据(stack traces)。


## Heap Dump (heap=dump)

## 堆转储 (heap=dump)


A complete dump of the current live objects in the heap can be obtained with:

当前存活对象的完整堆转储可以通过下面的命令得到:


使用的命令为: 

```
javac -J-agentlib:hprof=heap=dump Hello.java
```


This is a very large output file, but can be viewed and searched in any editor. But a better way to look at this kind of detail is with [HAT](http://docs.oracle.com/javase/8/docs/technotes/samples/hprof.html#HAT). All the information of the above `heap=sites` option is included, plus the specific details on every object allocated and the references to all objects.

这会生成一个非常大的输出文件, 但可以通过任何文本编辑器查看。但更好的方法是通过 [HAT](http://docs.oracle.com/javase/8/docs/technotes/samples/hprof.html#HAT) 工具来解析。包含了 `heap=sites` 中的所有信息, 加上分配的每一次对象分配的特定信息, 以及所有对象的引用。


This option causes the greatest amount of memory to be used because it stores details on every object allocated, it can also impact the application performance due to the data gathering (stack traces) on object allocation and garbage collection.

这个选项会导致最大的内存使用量, 因为会保存每次对象分配的细节, 也会因为在对象分配和垃圾收集时采集数据(stack traces), 影响应用程序的性能。


## CPU Usage Sampling Profiles (cpu=samples)

## CPU使用率抽样分析(cpu=samples)


HPROF can collect CPU usage information by sampling threads. Following is part of the output collected from a run of the `javac` compiler.


HPROF可以通过采样线程收集CPU的使用率。下面是从 `javac` 编译器采集的一部分输出。


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

HPROF agent 定期采样所有正在运行的线程的stack, 记录最频繁活跃的 stack traces 。 上面的 `count` 显示了一个特定的stack trace被采样到多少次(并不是这个方法被调用多少次)。 这些 stack traces 对应了应用程序中的CPU使用热点. 这个选项不需要 BCI 或者修改的类加载, 在所有的选项中, 对被分析程序的干扰最小。





The interval option can be used to adjust the sampling time or the time that the sampling thread sleeps between samples.

interval 选项可以用来调整采样周期， 或者说 sampling thread 休眠的时间。


So what does the above information tell us? First, statistically it's a pretty poor sample, only 126 samples, compiling a larger Java source file would probably yield better information, or better yet a large batch of Java sources. Second, this data pretty much matches the heap=sites data in that we know that `javac` relies heavily on the `ZipFile` class, which makes sense. It appears that any performance improvements in `ZipFile` will probably improve the performance of `javac`. The stack traces of interest here are:

以上信息告诉我们什么? 首先,在统计上这是一个非常少量的采样, 只有126个样本, 编译一个更大的Java源文件,或者是一大批Java源文件, 可能会产生更好的信息. 其次, 这次的数据和 `heap=sites` 示例中的非常匹配, 我们知道`javac`严重依赖`ZipFile`类, 它在其中有很大作用。看来, `ZipFile`类的任何性能优化都可能会提高`javac`的性能。有趣的是这部分 stack traces:




```
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

不要指望上面的信息能够在多线程应用程序中重现, 尤其是样本数量很低的时候。




## CPU Usage Times Profile (cpu=times)

## CPU使用量分析(cpu=times)


HPROF can collect CPU usage information by injecting code into every method entry and exit, keeping track of exact method call counts and the time spent in each method. This uses Byte Code Injection (BCI) and runs considerably slower than cpu=samples. Following is part of the output collected from a run of the `javac` compiler.


HPROF可以将代码注入到每一个方法进入和退出的代码中,以收集CPU使用率信息, 跟踪每个方法调用的次数, 每个方法花费的时间. 这使用的是 Byte Code Injection (BCI) 技术, 字节码注入(BCI)比起 `cpu=samples` 来说执行速度很慢。下面是`javac`执行过程中输出的一部分。




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

其中 count 代表的是此方法真正进入的次数, 百分比则表示此方法消耗的时间/线程总执行时间。


The traces normally don't include line numbers but can be added with the `lineno` option.

trace 通常不包括行号, 但也可以通过 `lineno` 选项添加。


Looking at the above data, it appears that even though some of the ZipFile$3 class methods are called over 14,000 times, they don't seem to be consuming vast amounts of CPU time. Again, this is probably represents a poor sample and I would not put much time into analyzing the above information.

看着上面的数据, 尽管 `ZipFile$3` 的一些方法被调用了 14000 次, 但并没有消耗大量的CPU时间. 既然这样, 这个 sample 可能就没有太多意义, 我也不会花太多时间来分析上述的信息。



## Using HAT with HPROF

## 使用 HAT 与 HPROF


[HAT](https://hat.dev.java.net/) (Heap Analysis Tool) is a browser based tool that uses the HPROF binary format to construct web pages so you can browse all the objects in the heap, and see all the references to and from objects.

[HAT](https://hat.dev.java.net/) (Heap Analysis Tool,堆分析工具) 是一款基于浏览器的工具,使用HPROF二进制格式来构建web页面, 可以浏览堆中的所有对象, 以及每个对象中的所有引用。


## A Bit of HPROF History

## HPROF的历史


Previous releases of J2SE (1.2 through 1.4) contained an HPROF agent built on the experimental JVMPI. JVMPI worked fairly reliably in the old 1.2 Classic VM, but it was unreliable and difficult to maintain with the newer HotSpot VM and the different garbage collectors in the 1.3 and 1.4 releases. The newer JVM TI in J2SE 5.0 replaces both JVMDI and JVMPI. In the 5.0 release, JVMPI is still available, and the older HPROF JVMPI based agent from 1.4.2 can actually be used with 5.0, but it isn't recommended. The new HPROF, in J2SE 5.0, is (with minor exceptions) a fully functional replacement for the old HPROF but source wise was close to being a complete rewrite. All the old options are available, and the output format is basically the same. So if you are used to the old HPROF output, or you have tools that read any HPROF format, you won't see many differences and hopefully you will see fewer problems that you have seen in the past with the JVMPI-based HPROF. The source to HPROF is available with the full JDK download in the `demo/jvmti/hprof` installation directory.

在 1.2~1.4版本的JDK中, 由一个构建在 experimental JVMPI 上的 HPROF。 但JVMPI 只在 1.2版本的 Classic VM 上工作良好, 而在 HotSpot VM  中以及 1.3~1.4版本中的其他GC上变得不可靠的, 并且难以维护。从 JDK5.0 开始使用新的 JVM TI 来取代 JVMDI 和 JVMPI。 新的 HPROF 是一个接近完全重写的全功能替代产品. 所有的选项依旧可用, 输出格式基本上兼容. HPROF的源码在安装目录 `demo/jvmti/hprof` 下面。




## How Does HPROF Work?

## HPROF是如何工作的呢?


HPROF is a dynamically-linked native library that uses JVM TI and writes out profiling information either to a file descriptor or to a socket in ascii or binary format. This information can be further processed by a profiler front-end tool or dumped to a file. It generates this information through calls to JVM TI, event callbacks from JVM TI, and through Byte Code Insertion (BCI) on all class file images loaded into the VM. JVM TI has an event called `JVMTI_EVENT_CLASS_FILE_LOAD_HOOK` which gives HPROF access to the class file image and an opportunity to modify that class file image before the VM actually loads it. Sound scary? It is, don't take BCI lightly. In the case of HPROF the BCI operations only instrument and don't change the behavior of the bytecodes. Use of JVM TI was pretty critical here for HPROF to do BCI because we needed to do BCI on ALL the classes, including early classes like `java.lang.Object`. Of course, the instrumentation code needs to be made inoperable until the VM has reached a stage where this inserted code can be executed, normally the event `JVMTI_EVENT_VM_INIT`.

HPROF 是一个 native 的动态链接库, 使用 JVM TI , 输出到文件或者 socket 中, 格式是 ascii 或者 二进制. 输出的信息可以由前端分析工具处理, 或者 dump 到文件中. 生成这些信息,需要通过调用JVM TI, 以及 JVM TI事件的回调函数, 以及通过 BCI 插入到JVM中所有class文件映像的字节码中。 JVM TI有一个叫做 `JVMTI_EVENT_CLASS_FILE_LOAD_HOOK`的事件, 使得 HPROF 可以访问class文件映像, 并有机会在JVM加载时修改这个class文件镜像。听起来很恐怖? 是的, 不要小看BCI. HPROF 中 BCI操作只进行统计, 不改变字节码的行为. 对HPROF使用 BCI来说, 使用JVM TI是很重要的。 因为我们需要对所有类执行 做BCI, 包括早期加载的类, 比如`java.lang.Object`。 当然,操作工具代码需要等JVM到达一定阶段, 这种插入的代码才会执行,通常的事件是`JVMTI_EVENT_VM_INIT`。


The amount of BCI that HPROF does depends on the options supplied, cpu=times triggers insertions into all method entries and exits, and the heap options trigger BCI on the `<init>` method of `java.lang.object` and any '`newarray`' opcodes seen in any method. This BCI work is actually done through the shared library `java_crw_demo`, which accepts a set of options, a class file image, and returns a new class file image. The `java_crw_demo` library is part of the sources delivered with the J2SE 5.0 in the `demo/jvmti` directory.

HPROF 执行的 BCI 数量取决于指定的选项, `cpu=times` 会插入代码到所有方法的入口和出口, heap 选项触发BCI插入到`java.lang.object`的 `<init>` 方法和所有方法中的 `newarray` 操作码中。BCI的工作实际上是通过共享库`java_crw_demo`来执行的, 其接受一些配置项, 一个 class file image, 并返回一个新的 class file image(类文件映像)。 `java_crw_demo` 库的源码位于`demo/jvmti`目录中。


Currently HPROF injects calls to static Java methods which in turn call a native method that is in the HPROF agent library itself. This was an early design choice to limit the extra Java code introduced during profiling. So the combination of the requested JVM TI events, and the created BCI events, provides the basics for HPROF to work.

目前, HPROF注入对静态Java方法的调用, 其中反过来调用HPROF agent的native方法. 这是一个早期的设计, 用来避免在Java代码分析时又产生新的对象. 所以要求组合 JVM TI事件, 以及创建的BCI事件,以支持 HPROF 执行。


The cpu=samples option doesn't use BCI, HPROF just spawns a separate thread that sleeps for a fixed number of micro seconds, and wakes up and samples all the running thread stacks using JVM TI.

`cpu=samples` 选项不使用BCI, HPROF只产生一个单独的线程, 休眠固定的微秒, 然后醒来, 使用JVM TI采样所有正在运行的线程stacks 。


The cpu=times option attempts to track the running stack of all threads, and keep accurate CPU time usage on all methods. This option probably places the greatest strain on the VM, where every method entry and method exit is tracked. Applications that make many method calls will be impacted more than others.

cpu = *选项尝试跟踪正在运行的所有线程的堆栈,并保持准确的cpu时间使用所有的方法.这个选项可能VM上的最大应变的地方,每一个方法进入和退出方法跟踪。使许多方法调用的应用程序将会比其他的影响。


The heap=sites and heap=dump options are the ones that need to track object allocations. These options can be memory intensive (less so with hprof=sites) and applications that allocate many objects or allocate and free many objects will be impacted more with these options. On each object allocation, the stack must be sampled so we know where the object was allocated, and that stack information must be saved. HPROF has a series of tables allocated in the C or `malloc()` heap that track all it's information. HPROF currently does not allocate any Java objects.

`heap=sites` 和 `heap=dump` 选项是跟踪对象分配的工具. 这些选项可能是内存密集型(hprof=sites), 分配/释放很多对象的应用程序可能会受应这类选项的影响. 在每个对象分配时, 必须采样 stack 以便知道是在分配哪种对象, 必须保存 stack 信息。HPROF有一系列的表在 C or `malloc()` heap 中, 用于跟踪所有的信息。HPROF 不分配任何Java对象。


## Summary

## 总结


As you can see, the HPROF agent can be used to generate a wide variety of profiles. But as the above examples using `javac` demonstrate, make sure you have a large enough sampling to know that your data makes sense.

如您所见, HPROF agent 可以用于生成各种分析。但如同上面的 `javac` 所展示的那样, 请确保你有一个足够大的采样, 来确定那些有意义的数据。


Brave C/JNI programmers could even take the source to HPROF (it's available in the J2SE SDK download in the `demo/jvmti/hprof` directory) and customize it or create their own special profiling tool.

勇敢的 C/JNI 程序员甚至可以查看 HPROF 的源码(在JDK安装目录的 `demo/jvmti/hprof` 下面), 甚至自己开发专有的分析工具。




原文链接: <http://docs.oracle.com/javase/8/docs/technotes/samples/hprof.html>

