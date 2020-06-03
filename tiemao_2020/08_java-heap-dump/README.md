# Different Ways to Capture Java Heap Dumps

# JVM堆内存转储的获取方法

## 1. Introduction

In this article, we'll show different ways to capture a heap dump in Java.

> A heap dump is a snapshot of all the objects that are in memory in the JVM at a certain moment.

They are very useful to troubleshoot memory-leak problems and optimize memory usage in Java applications.

> Heap dumps are usually stored in binary format hprof files.

We can open and analyze these files using tools like jhat or JVisualVM. Also, for Eclipse users it's very common to use [MAT](https://www.eclipse.org/mat/).

In the next sections, we'll go through multiple tools and approaches to generate a heap dump and we'll show the main differences between them.

## 1. 堆内存转储简介

堆内存转储（Heap Dump），是指在某一个时刻的JVM堆内存快照，一般使用二进制格式的 hprof 文件来保存，常用于分析内存泄漏问题，以及优化Java程序的内存占用。

内存转储的分析工具包括: jhat， JVisualVM，以及基于 Eclipse 的 [MAT](https://www.eclipse.org/mat/).

下面依次介绍各种获取堆内存转储的方法。


## 2. JDK Tools

The JDK comes with several tools to capture heap dumps in different ways.

> All these tools are located under the `bin` folder inside the JDK home directory.

Therefore, we can start them from the command line as long as this directory is included in the system path.

In the next sections, we'll show how to use these tools in order to capture heap dumps.

## 2. JDK内置工具介绍

JDK自带了多种获取堆内存转储的工具，这些内置工具都位于 `JDK_HOME/bin` 目录下，一般来说这个目录都被包含在系统PATH路径中，所以可以直接在命令行中调用。

### 2.1. jmap

jmap is a tool to print statistics about the memory in a running JVM. We can use it for local or remote processes.

To capture a heap dump using jmap we need to use the `dump` option:

### 2.1 `jmap` 工具简介

`jmap` 可用于打印JVM内存的统计信息，而且支持访问本地JVM，或者远程JVM。 获取堆内存转储的使用方式为：

```
jmap -dump:[live],format=b,file=<file-path> <pid>
```

Along with that option, we should specify several parameters:

- `live`: if set it only prints objects which have active references and discards the ones that are ready to be garbage collected. This parameter is optional
- `format=b`: specifies that the dump file will be in binary format. If not set the result is the same
- `file`: the file where the dump will be written to
- `pid`: id of the Java process

An example would be like this:

在 `-dump:` 选项后面， 可以指定以下参数：

- `live`: 可选；指定该选项，则表示只输出存活对象，并清除其他可以被GC的部分。
- `format=b`: 指定 dump 文件为二进制格式(binary format). 在堆内存转储时，不指定也默认是二进制格式。
- `file`:  指定内存转储文件的保存位置。
- `pid`: 指定Java进程的pid。

使用示例如下:

```
jmap -dump:live,format=b,file=/tmp/dump.hprof 12587
```

Remember that we can easily get the `pid` of a Java process by using the `jps` command.

> Keep in mind that jmap was introduced in the JDK as an experimental tool and it's unsupported.

Therefore, in some cases, it may be preferable to use other tools instead.

其中，pid 我们一般通过 `jps` 命令，或者  `jcmd` 命令得到。

### 2.2. jcmd

jcmd is a very complete tool which works by sending command requests to the JVM. We have to use it in the same machine where the Java process is running.

> One of its many commands is the `GC.heap_dump`.

We can use it to get a heap dump just by specifying the `pid` of the process and the output file path:

### 2.2 `jcmd` 工具简介

`jcmd` 是一个全能的命令行诊断工具，其工作方式是将要执行的命令发送给具体的JVM实例，所以只能在本地机器上使用。

其中的一个命令是 `GC.heap_dump`， 可以用来获取堆内存转储，内存转储都是二进制格式，使用方式为：

```
jcmd <pid> GC.heap_dump <file-path>
```

We can execute it with the same parameters that we used before:

类似地，使用示例如下：

```
jcmd 12587 GC.heap_dump /tmp/dump.hprof
```

As with jmap, the dump generated is in binary format.


### 2.3. JVisualVM

JVisualVM is a tool with a graphical user interface that lets us monitor, troubleshoot and profile Java applications.

The GUI is simple but very intuitive and easy to use.

One of its many options allows us to capture a heap dump. If we right-click on a Java process and select the `“Heap Dump”` option, the tool will create a heap dump and open it in a new tab:

![img](https://www.baeldung.com/wp-content/uploads/2018/09/dump-menu-cropped-1.png)

Notice that we can find the path of the file created in the “Basic Info” section.

### 2.3 JVisualVM 工具

JVisualVM是一款图形界面工具，可用于监控、分析、诊断和调优Java应用程序。

界面简单优雅，却又功能强大，而且支持众多插件。

其中的一个功能是抓取堆内存转储，打开程序，在可见的Java进程上点击鼠标右键，选择“堆内存转储（Heap Dump）”， 即可创建新的内存转储文件，并自动在新标签页中打开。

![img](https://www.baeldung.com/wp-content/uploads/2018/09/dump-menu-cropped-1.png)

当然，我们可以在基本信息（Basic Info）中看到转储文件的目录信息。



## 3. Capture a Heap Dump Automatically

All the tools that we've shown in the previous sections are intended to capture heap dumps manually at a specific time. In some cases, we want to get a heap dump when a `java.lang.OutOfMemoryError` occurs so it helps us investigate the error.

For these cases, Java provides the `HeapDumpOnOutOfMemoryError` command-line option that generates a heap dump when a `java.lang.OutOfMemoryError` is thrown:

```
java -XX:+HeapDumpOnOutOfMemoryError
```

By default, it stores the dump in a `java_pid.hprof` file in the directory where we're running the application. If we want to specify another file or directory we can set it in the `HeapDumpPath` option:

```
java -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=<file-or-dir-path>
```

When our application runs out of memory using this option, we'll be able to see in the logs the created file that contains the heap dump:

```
java.lang.OutOfMemoryError: Requested array size exceeds VM limit
Dumping heap to java_pid12587.hprof ...
Exception in thread "main" Heap dump file created [4744371 bytes in 0.029 secs]
java.lang.OutOfMemoryError: Requested array size exceeds VM limit
    at com.baeldung.heapdump.App.main(App.java:7)
```

In the example above, it was written to the `java_pid12587.hprof` file.

As we can see, this option is very useful and there is no overhead when running an application with this option. Therefore, it's highly recommended to use this option always, especially in production.

Finally, this option can also be specified at runtime by using the `HotSpotDiagnostic` MBean. To do so, we can use JConsole and set the `HeapDumpOnOutOfMemoryError` VM option to `true`:

[![img](https://www.baeldung.com/wp-content/uploads/2018/09/jconsole-setvmoption-1.png)](https://www.baeldung.com/wp-content/uploads/2018/09/jconsole-setvmoption-1.png)

We can find more information about MBeans and JMX in this [article](https://www.baeldung.com/java-management-extensions).

## 4. JMX

The last approach that we'll cover in this article is using JMX. We'll use the `HotSpotDiagnostic` MBean that we briefly introduced in the previous section. This MBean provides a `dumpHeap` method that accepts 2 parameters:

- `outputFile`: the path of the file for the dump. The file should have the hprof extension
- `live`: if set to true it dumps only the active objects in memory, as we've seen with jmap before

In the next sections, we'll show 2 different ways to invoke this method in order to capture a heap dump.

### 4.1. `JConsole`

The easiest way to use the `HotSpotDiagnostic` MBean is by using a JMX client such as JConsole.

If we open `JConsole` and connect to a running Java process, we can navigate to the `MBeans` tab and find the `HotSpotDiagnostic` under `com.sun.management.` In operations, we can find the `dumpHeap` method that we've described before:

[![img](https://www.baeldung.com/wp-content/uploads/2018/09/jconsole-dump-1.png)](https://www.baeldung.com/wp-content/uploads/2018/09/jconsole-dump-1.png)

As shown, we just need to introduce the parameters `outputFile` and `live` into the `p0` and `p1` text fields in order to perform the `dumpHeap` operation.

### 4.2. Programmatic Way

The other way to use the `HotSpotDiagnostic` MBean is by invoking it programmatically from Java code.

To do so, we first need to get an `MBeanServer` instance in order to get an MBean that is registered in the application. After that, we simply need to get an instance of a `HotSpotDiagnosticMXBean` and call its `dumpHeap` method.

Let's see it in code:

```
public static void dumpHeap(String filePath, boolean live) throws IOException {
    MBeanServer server = ManagementFactory.getPlatformMBeanServer();
    HotSpotDiagnosticMXBean mxBean = ManagementFactory.newPlatformMXBeanProxy(
      server, "com.sun.management:type=HotSpotDiagnostic", HotSpotDiagnosticMXBean.class);
    mxBean.dumpHeap(filePath, live);
}
```

Notice that an hprof file cannot be overwritten. Therefore, we should take this into account when creating an application that prints heap dumps. If we fail to do so we'll get an exception:

```
Exception in thread "main" java.io.IOException: File exists
    at sun.management.HotSpotDiagnostic.dumpHeap0(Native Method)
    at sun.management.HotSpotDiagnostic.dumpHeap(HotSpotDiagnostic.java:60)
```

## 5. Conclusion

In this tutorial, we've shown multiple ways to capture a heap dump in Java.

As a rule of thumb, we should remember to use the `HeapDumpOnOutOfMemoryError` option always when running Java applications. For other purposes, any of the other tools can be perfectly used as long as we keep in mind the unsupported status of jmap.

As always, the full source code of the examples is available [over on GitHub](https://github.com/eugenp/tutorials/tree/master/core-java-modules/core-java-perf).


<https://www.baeldung.com/java-heap-dump-capture>
