# Capturing a Java Thread Dump

# Java线程调用栈Dump


## 1. Overview

In this tutorial, we'll discuss various ways to capture the thread dump of a Java application.

A thread dump is a snapshot of the state of all the threads of a Java process. The state of each thread is presented with a stack trace, showing the content of a thread's stack. A thread dump is useful for diagnosing problems as it displays the thread's activity. Thread dumps are written in plain text, so we can save their contents to a file and look at them later in a text editor.

In the next sections, we'll go through multiple tools and approaches to generate a thread dump.

## 1.概述

在本教程中，我们将讨论捕获Java应用程序的线程转储的各种方法。

线程转储是Java进程所有线程状态的快照。 每个线程的状态都带有堆栈跟踪，显示了线程堆栈的内容。 线程转储显示线程的活动，对于诊断问题很有用。 线程转储以纯文本编写，因此我们可以将其内容保存到文件中，并稍后在文本编辑器中对其进行查看。

在下一节中，我们将介绍多种工具和方法来生成线程转储。

## 2. Using JDK Utilities

The JDK provides several utilities that can capture the thread dump of a Java application. All of the utilities are located under the bin folder inside the JDK home directory. Therefore, we can execute these utilities from the command line as long as this directory is in our system path.

## 2. 使用JDK自带的工具

JDK提供了一些实用程序，可以捕获Java应用程序的线程转储。 所有实用程序都位于JDK主目录内的bin文件夹下。 因此，只要此目录在我们的系统路径中，我们就可以从命令行执行这些实用程序。

### 2.1. jstack

jstack is a command-line JDK utility we can use to capture a thread dump. It takes the pid of a process and displays the thread dump in the console. Alternatively, we can redirect its output to a file.

Let's take a look at the basic command syntax for capturing a thread dump using jstack:

### 2.1 jstack 工具

jstack是一个命令行JDK实用程序，可用于捕获线程转储。 它获取进程的pid，并在控制台中显示线程转储。 或者，我们可以将其输出重定向到文件。

让我们看一下使用jstack捕获线程转储的基本命令语法：

```
jstack [-F] [-l] [-m] <pid>
```

All the flags are optional. Let's see what they mean:

`-F` option forces a thread dump; handy to use when jstack pid does not respond (the process is hung)
`-l` option instructs the utility to look for ownable synchronizers in the heap and locks
`-m` option prints native stack frames (C & C++) in addition to the Java stack frames

Let's put this knowledge to use by capturing a thread dump and redirecting the result to a file:

所有标志都是可选的。 让我们看看它们的含义：

-F选项强制执行线程转储； 当jstack pid不响应（进程已挂起）时，方便使用
-l选项指示实用程序在堆中查找可拥有的同步器并锁定
-m选项除了打印Java堆栈框架外，还打印本机堆栈框架（C和C ++）

让我们通过捕获线程转储并将结果重定向到文件来使用这些知识：

```
jstack 17264 > /tmp/threaddump.txt
```

Remember that we can easily get the pid of a Java process by using the jps command.

请记住，我们可以使用jps命令轻松获取Java进程的pid。

### 2.2. Java Mission Control

Java Mission Control (JMC) is a GUI tool that collects and analyzes data from Java applications. After we launch JMC, it displays the list of Java processes running on a local machine. We can also connect to remote Java processes through JMC.

We can right-click on the process and click on the “Start Flight Recording” option. After this, the Threads tab shows the Thread Dumps:

### 2.2 Java Mission Control

Java Mission Control（JMC）是一个GUI工具，用于收集和分析Java应用程序中的数据。 启动JMC后，它将显示在本地计算机上运行的Java进程的列表。 我们还可以通过JMC连接到远程Java进程。

我们可以右键单击该过程，然后单击“开始飞行记录”选项。 之后，“线程”选项卡显示“线程转储”：


### 2.3. jvisualvm

jvisualvm is a tool with a graphical user interface that lets us monitor, troubleshoot, and profile Java applications. The GUI is simple but very intuitive and easy to use.

One of its many options allows us to capture a thread dump. If we right-click on a Java process and select the “Thread Dump” option, the tool will create a thread dump and open it in a new tab:

### 2.3 jvisualvm

jvisualvm是带有图形用户界面的工具，可让我们监视Java应用程序，对其进行故障排除和分析。 GUI很简单，但是非常直观并且易于使用。

它的众多选项之一使我们能够捕获线程转储。 如果我们右键单击Java进程并选择“ Thread Dump”选项，该工具将创建一个线程转储并在新选项卡中将其打开：


### 2.4. jcmd

jcmd is a tool that works by sending command requests to the JVM. Although powerful, it doesn't contain any remote functionality – we have to use it in the same machine where the Java process is running.

One of its many commands is Thread.print. We can use it to get a thread dump just by specifying the pid of the process:

### 2.4 jcmd

jcmd是一种通过向JVM发送命令请求来工作的工具。 尽管功能强大，但它不包含任何远程功能-我们必须在运行Java进程的同一台计算机上使用它。

它的许多命令之一是Thread.print。 我们可以通过指定进程的pid来使用它来获取线程转储：

```
jcmd 17264 Thread.print
```

### 2.5. jconsole

jconsole lets us inspect the stack trace of each thread. If we open jconsole and connect to a running Java process, we can navigate to the Threads tab and find each thread's stack trace:

### 2.5  jconsole

jconsole让我们检查每个线程的堆栈跟踪。 如果我们打开jconsole并连接到正在运行的Java进程，则可以导航到“线程”选项卡并找到每个线程的堆栈跟踪：


### 2.6. Summary

So as it turns out, there are many ways to capture a thread dump using JDK utilities. Let's take a moment to reflect on each and outline their pros and cons:

- `jstack`: provides the quickest and easiest way to capture a thread dump. However, better alternatives are available starting with Java 8
- `jmc`: enhanced JDK profiling and diagnostics tool. It minimizes the performance overhead that's usually an issue with profiling tools
- `jvisualvm`: lightweight and open-source profiling tool with an excellent GUI console
- `jcmd`: extremely powerful and recommended for Java 8 and later. A single tool that serves many purposes – capturing thread dump (jstack), heap dump (jmap), system properties and command-line arguments (jinfo)
- `jconsole`: let's us inspect thread stack trace information

### 2.6 小结

事实证明，有很多方法可以使用JDK实用程序捕获线程转储。 让我们花点时间反思一下，并概述一下它们的优缺点：

- `jstack`：提供最快和最简单的方法来捕获线程转储。 但是，从Java 8开始可以使用更好的替代方法
- `jmc`：增强的JDK分析和诊断工具。 它将性能分析工具通常存在的性能开销降至最低
- `jvisualvm`：具有出色的GUI控制台的轻量级开源分析工具
- `jcmd`：非常强大，推荐用于Java 8及更高版本。 一个具有多种用途的工具-捕获线程转储（jstack），堆转储（jmap），系统属性和命令行参数（jinfo）
- `jconsole`：让我们检查线程堆栈跟踪信息


## 3. From the Command Line

In enterprise application servers, only the JRE is installed for security reasons. Thus, we can not use the above-mentioned utilities as they are part of JDK. However, there are various command-line alternatives that let us capture thread dumps easily.

## 3. 使用Linux命令

在企业应用程序服务器中，出于安全原因，仅安装JRE。 因此，我们不能使用上述实用程序，因为它们是JDK的一部分。 但是，有许多命令行替代方法可以让我们轻松捕获线程转储。

### 3.1. kill -3 Command (Linux/Unix)

The easiest way to capture a thread dump in Unix-like systems is through the kill command, which we can use to send a signal to a process using the kill() system call. In this use case, we'll send it the -3 signal.

Using our same pid from earlier examples, let's take a look at how to use kill to capture a thread dump:

### 3.1 使用 `kill -3` 指令

在类Unix系统中捕获线程转储的最简单方法是通过kill命令，我们可以使用kill命令通过kill（）系统调用将信号发送给进程。 在这种情况下，我们将其发送给-3信号。

使用前面示例中的相同pid，让我们看一下如何使用kill捕获线程转储：


```
kill -3 17264
```


### 3.2. `Ctrl + Break` (Windows)

In Windows operating systems, we can capture a thread dump using the `CTRL` and `Break` key combination. To take a thread dump, navigate to the console used to launch the Java application and press `CTRL` and `Break` keys together.

It's worth noting that, on some keyboards, the `Break` key is not available. Therefore, in such cases, a thread dump can be captured using `CTRL`, `SHIFT`, and `Pause` keys together.

Both of these commands print the thread dump to the console.

### 3.2. `Ctrl + Break` (Windows)

在Windows操作系统中，我们可以使用`CTRL`和`Break`组合键捕获线程转储。 要进行线程转储，请导航至用于启动Java应用程序的控制台，然后同时按`CTRL`和`Break`键。

值得注意的是，在某些键盘上，“ Break”键不可用。 因此，在这种情况下，可以同时使用“ CTRL”，“ SHIFT”和“ Pause”键捕获线程转储。

这两个命令都将线程转储打印到控制台。

## 4. Programmatically Using ThreadMxBean

The last approach we will discuss in the article is using `JMX`. We'll use ThreadMxBean to capture the thread dump. Let's see it in code:

## 4.以编程方式使用ThreadMxBean

我们将在本文中讨论的最后一种方法是使用“ JMX”。 我们将使用ThreadMxBean捕获线程转储。 让我们在代码中看到它：

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

在以上程序中，我们执行几个步骤：

1.首先，初始化一个空的StringBuffer来保存每个线程的堆栈信息。
2.然后，我们使用ManagementFactory类来获取ThreadMxBean的实例。 ManagementFactory是一种工厂类，用于获取Java平台的托管bean。 另外，ThreadMxBean是JVM线程系统的管理接口。
3.将lockedMonitors和lockedSynchronizers值设置为true表示在线程转储中捕获可拥有的同步器和所有锁定的监视器。


## 5. Conclusion

In this article, we've shown multiple ways to capture a thread dump.

At first, we discussed various JDK Utilities and then the command-line alternatives. In the last section, we concluded with the programmatic approach using JMX.

As always, the full source code of the example is available [over on GitHub](https://github.com/eugenp/tutorials/tree/master/core-java-modules/core-java-perf).

## 5. 结论

在本文中，我们展示了捕获线程转储的多种方法。

首先，我们讨论了各种JDK实用程序，然后讨论了命令行替代方法。 在上一节中，我们总结了使用JMX的编程方法。

与往常一样，该示例的完整源代码可在[在GitHub上]获得（https://github.com/eugenp/tutorials/tree/master/core/java-modules/core-java-perf）。
