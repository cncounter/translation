# Capturing a Java Thread Dump

# 获取Java线程转储的常用方法

## 1. Overview

In this tutorial, we'll discuss various ways to capture the thread dump of a Java application.

A thread dump is a snapshot of the state of all the threads of a Java process. The state of each thread is presented with a stack trace, showing the content of a thread's stack. A thread dump is useful for diagnosing problems as it displays the thread's activity. Thread dumps are written in plain text, so we can save their contents to a file and look at them later in a text editor.

In the next sections, we'll go through multiple tools and approaches to generate a thread dump.

## 1. 什么是线程转储

线程转储(Thread Dump)是JVM中所有线程状态的快照。

线程转储一般是文本格式，可以将其保存到文本文件中，然后人工查看和分析，或者通过工具/API自动分析。

Java中的线程模型, 直接使用了操作系统的线程调度模型, 只进行简单的封装。

线程调用栈，也称为方法调用栈。 比如在程序执行过程中, 有一连串的方法调用链: `obj1.method2` 调用了 `obj2.methodB`, `obj2.methodB` 又调用了 `obj3.methodC`。

每个线程的状态都可以通过这种调用栈来表示。

线程转储展示了各个线程的行为，对于诊断和排查问题非常有用。

下面我们通过具体示例, 来演示各种获取Java线程转储的工具, 以及使用方法。


## 2. Using JDK Utilities

The JDK provides several utilities that can capture the thread dump of a Java application. All of the utilities are located under the bin folder inside the JDK home directory. Therefore, we can execute these utilities from the command line as long as this directory is in our system path.

## 2. 使用JDK自带的工具

我们一般使用JDK自带的命令行工具来获取Java应用程序的线程转储。
这些工具都位于JDK主目录的bin文件夹下。
因此，只要配置好 PATH 路径即可。 如果不清楚的，请参考: [JDK环境准备](https://gitbook.cn/gitchat/column/5de76cc38d374b7721a15cec/topic/5dea1096b96d62481e404f36)

### 2.1. jstack

jstack is a command-line JDK utility we can use to capture a thread dump. It takes the pid of a process and displays the thread dump in the console. Alternatively, we can redirect its output to a file.

Let's take a look at the basic command syntax for capturing a thread dump using jstack:

### 2.1 jstack 工具

jstack 是一款命令行工具，这是专门用来执行线程转储的。
通过进程的pid，可以在控制台中打印线程转储。 或者，我们也可以将其输出重定向到某个文件。

让我们看一下使用jstack捕获线程转储的基本语法：

```
jstack [-F] [-l] [-m] <pid>
```

All the flags are optional. Let's see what they mean:

`-F` option forces a thread dump; handy to use when `jstack pid` does not respond (the process is hung)
`-l` option instructs the utility to look for ownable synchronizers in the heap and locks
`-m` option prints native stack frames (C & C++) in addition to the Java stack frames

Let's put this knowledge to use by capturing a thread dump and redirecting the result to a file:

这几个选项都是可选的。 具体的含义说明如下：

- `-F` 选项强制执行线程转储； 有时候 `jstack pid` 会假死, 则可以加上 `-F` 标志
- `-l` 选项, 会查找堆内存中拥有的同步器以及资源锁
- `-m` 选项，额外打印 native栈帧（C和C++的）

例如，获取线程转储并将结果输出到文件：

```
jstack -F 17264 > /tmp/threaddump.txt
```

Remember that we can easily get the pid of a Java process by using the jps command.

使用 `jps` 命令可以获取本地Java进程的 pid。

### 2.2. Java Mission Control

Java Mission Control (JMC) is a GUI tool that collects and analyzes data from Java applications. After we launch JMC, it displays the list of Java processes running on a local machine. We can also connect to remote Java processes through JMC.

We can right-click on the process and click on the “Start Flight Recording” option. After this, the Threads tab shows the Thread Dumps:

### 2.2 Java Mission Control

Java Mission Control（JMC）是一款图形界面客户端工具，用于收集和分析Java应用程序的各种数据。
启动JMC后，首先会显示本地计算机上运行的Java进程列表。 当然也可以通过JMC连接到远程Java进程。


可以鼠标右键单击对应的进程，选择 “Start Flight Recording（开始飞行记录）” 。 结束之后，“Threads（线程）” 选项卡会显示“线程转储”：


![](https://www.baeldung.com/wp-content/uploads/2020/03/JMC-1024x544-1.png)


### 2.3. jvisualvm

jvisualvm is a tool with a graphical user interface that lets us monitor, troubleshoot, and profile Java applications. The GUI is simple but very intuitive and easy to use.

One of its many options allows us to capture a thread dump. If we right-click on a Java process and select the “Thread Dump” option, the tool will create a thread dump and open it in a new tab:

### 2.3 jvisualvm

jvisualvm是一款图形界面客户端工具，既简单又实用，可让用来监控 Java应用程序，对其进行故障排查和性能分析。

也可以用来获取线程转储。 鼠标右键点击Java进程，并选择“ Thread Dump”选项， 则可以创建线程转储，并在新选项卡中打开：

![](https://www.baeldung.com/wp-content/uploads/2020/03/JVisualVM.png)


### 2.4. jcmd

jcmd is a tool that works by sending command requests to the JVM. Although powerful, it doesn't contain any remote functionality – we have to use it in the same machine where the Java process is running.

One of its many commands is Thread.print. We can use it to get a thread dump just by specifying the pid of the process:

### 2.4 jcmd

jcmd工具本质上是向目标JVM发送一串命令。 尽管支持很多功能，但不支持连接远程JVM - 只能在Java进程的本地机器上使用。

其中一个命令是 `Thread.print`, 用来获取线程转储, 示例用法如下:

```
jcmd 17264 Thread.print
```

### 2.5. jconsole

jconsole lets us inspect the stack trace of each thread. If we open jconsole and connect to a running Java process, we can navigate to the Threads tab and find each thread's stack trace:

### 2.5  jconsole

jconsole 工具也可以查看线程栈跟踪。
打开jconsole并连接到正在运行的Java进程，可以导航到“线程”选项卡并查看每个线程的堆栈跟踪：

![](https://www.baeldung.com/wp-content/uploads/2020/03/JConsole-1024x544-1.png)


### 2.6. Summary

So as it turns out, there are many ways to capture a thread dump using JDK utilities. Let's take a moment to reflect on each and outline their pros and cons:

- `jstack`: provides the quickest and easiest way to capture a thread dump. However, better alternatives are available starting with Java 8
- `jmc`: enhanced JDK profiling and diagnostics tool. It minimizes the performance overhead that's usually an issue with profiling tools
- `jvisualvm`: lightweight and open-source profiling tool with an excellent GUI console
- `jcmd`: extremely powerful and recommended for Java 8 and later. A single tool that serves many purposes – capturing thread dump (jstack), heap dump (jmap), system properties and command-line arguments (jinfo)
- `jconsole`: let's us inspect thread stack trace information

### 2.6 小结

事实证明，有很多方法可以使用JDK实用程序捕获线程转储。 让我们花点时间反思一下，并概述一下它们的优缺点：

- `jstack`：这是获取线程转储最简单快捷的工具； 在Java 8之后可以使用 jcmd 工具来替代；
- `jmc`：增强的JDK性能分析和问题诊断工具。 用这款工具进行性能分析的开销会非常低。
- `jvisualvm`：轻量级的开源分析工具，图形界面非常棒，还支持多种功能强悍的插件。
- `jcmd`： 非常强大的本地工具，支持Java 8及更高版本。 集成了多种工具的用途， 例如： 捕获线程转储（jstack），堆转储（jmap），查看系统属性和查看命令行参数（jinfo）
- `jconsole`：我们可以用来查看线程栈跟踪信息


## 3. From the Command Line

In enterprise application servers, only the JRE is installed for security reasons. Thus, we can not use the above-mentioned utilities as they are part of JDK. However, there are various command-line alternatives that let us capture thread dumps easily.

## 3. 使用Linux命令

在企业应用服务器中，出于安全原因，可能只安装了 JRE。
这时候就没法使用内置的这些工具，因为它们是JDK的一部分。
但是，还是有许多命令行可以用来获取线程转储。

### 3.1. kill -3 Command (Linux/Unix)

The easiest way to capture a thread dump in Unix-like systems is through the kill command, which we can use to send a signal to a process using the kill() system call. In this use case, we'll send it the -3 signal.

Using our same pid from earlier examples, let's take a look at how to use kill to capture a thread dump:

### 3.1 使用 `kill -3` 指令

在类Unix系统中, 获取线程转储的方法是使用 `kill` 命令，内部是通过系统调用 `kill()` 将信号发送给进程。 这里我们发送的是 `-3` 信号。

需要先通过 `jps` 找到JAVA进程的pid，`kill -3` 的使用示例如下：


```
kill -3 17264
```


### 3.2. `Ctrl + Break` (Windows)

In Windows operating systems, we can capture a thread dump using the `CTRL` and `Break` key combination. To take a thread dump, navigate to the console used to launch the Java application and press `CTRL` and `Break` keys together.

It's worth noting that, on some keyboards, the `Break` key is not available. Therefore, in such cases, a thread dump can be captured using `CTRL`, `SHIFT`, and `Pause` keys together.

Both of these commands print the thread dump to the console.

### 3.2 `Ctrl + Break` (Windows)

在Windows操作系统中，可以使用组合键 `Ctrl + Break` 来获取线程转储。 当然，需要先请导航至启动Java程序的控制台窗口，然后同时按下 `CTRL`和`Break`键。

值得注意的是，在某些键盘上，是没有 “`Break`” 键的。
在这种情况下，可以组合使用 `CTRL`, `SHIFT`, 以及 `Pause`键。

这两个命令都可以将线程转储打印到控制台。

## 4. Programmatically Using ThreadMxBean

The last approach we will discuss in the article is using `JMX`. We'll use ThreadMxBean to capture the thread dump. Let's see it in code:

## 4. 通过编程方式使用JMX技术

JMX技术支持各种各样的花式操作。 我们可以通过 `ThreadMxBean` 来线程转储。

示例代码如下：

```
private static String threadDump(boolean lockedMonitors, boolean lockedSynchronizers) {
    StringBuffer threadDump = new StringBuffer(System.lineSeparator());
    ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
    for(ThreadInfo threadInfo : threadMXBean.dumpAllThreads(lockedMonitors, lockedSynchronizers)) {
        threadDump.append(threadInfo.toString());
    }
    return threadDump.toString();
}
```

In the above program, we are performing several steps:

1. At first, an empty StringBuffer is initialized to hold the stack information of each thread.
2. We then use the ManagementFactory class to get the instance of ThreadMxBean. A ManagementFactory is a factory class for getting managed beans for the Java platform. In addition, a ThreadMxBean is the management interface for the thread system of the JVM.
3. Setting lockedMonitors and lockedSynchronizers values to true indicates to capture the ownable synchronizers and all locked monitors in the thread dump.

在以上程序中，我们做的事情其实很简单,  使用 `ManagementFactory` 类来获取 `ThreadMxBean` 实例。
传入的 `lockedMonitors` 和 `lockedSynchronizers` 参数表示在线程转储时，是否导出 可拥有的同步器和所有管程锁。


## 5. Conclusion

In this article, we've shown multiple ways to capture a thread dump.

At first, we discussed various JDK Utilities and then the command-line alternatives. In the last section, we concluded with the programmatic approach using JMX.

As always, the full source code of the example is available [over on GitHub](https://github.com/eugenp/tutorials/tree/master/core-java-modules/core-java-perf).

## 5. 总结

在本文中，我们通过具体示例展示了如何获取线程转储。

首先介绍的是各种JDK内置工具，
然后讨论了命令行方式，
最后则介绍了使用JMX的方式。

完整的示例代码请参考我们的 [GitHub仓库](https://github.com/eugenp/tutorials/tree/master/core-java-modules/core-java-perf) 。

原文链接:
> <https://www.baeldung.com/java-thread-dump>
