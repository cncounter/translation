# Capturing a Java Thread Dump

# 获取Java线程转储的常用方法

## 1. Overview

In this tutorial, we'll discuss various ways to capture the thread dump of a Java application.

A thread dump is a snapshot of the state of all the threads of a Java process. The state of each thread is presented with a stack trace, showing the content of a thread's stack. A thread dump is useful for diagnosing problems as it displays the thread's activity. Thread dumps are written in plain text, so we can save their contents to a file and look at them later in a text editor.

In the next sections, we'll go through multiple tools and approaches to generate a thread dump.

## 1. 线程转储简介

线程转储(Thread Dump)就是JVM中所有线程状态信息的一次快照。

线程转储一般使用文本格式, 可以将其保存到文本文件中, 然后人工查看和分析, 或者使用工具/API自动分析。

Java中的线程模型, 直接使用了操作系统的线程调度模型, 只进行简单的封装。

线程调用栈, 也称为方法调用栈。 比如在程序执行过程中, 有一连串的方法调用链: `obj1.method2` 调用了 `obj2.methodB`, `obj2.methodB` 又调用了 `obj3.methodC`。 每个线程的状态都可以通过这种调用栈来表示。

线程转储展示了各个线程的行为, 对于诊断和排查问题非常有用。

下面我们通过具体示例, 来演示各种获取Java线程转储的工具, 以及使用方法。


## 2. Using JDK Utilities

The JDK provides several utilities that can capture the thread dump of a Java application. All of the utilities are located under the bin folder inside the JDK home directory. Therefore, we can execute these utilities from the command line as long as this directory is in our system path.

## 2. 使用JDK自带的工具

我们一般使用JDK自带的命令行工具来获取Java应用程序的线程转储。 这些工具都在JDK主目录的bin文件夹下。

所以, 只要配置好 PATH 路径即可。 如果不会配置, 可以参考: [JDK环境准备](https://gitbook.cn/gitchat/column/5de76cc38d374b7721a15cec/topic/5dea1096b96d62481e404f36)

### 2.1. jstack

jstack is a command-line JDK utility we can use to capture a thread dump. It takes the pid of a process and displays the thread dump in the console. Alternatively, we can redirect its output to a file.

Let's take a look at the basic command syntax for capturing a thread dump using jstack:

### 2.1 jstack 工具

jstack 是JDK内置的一款命令行工具, 专门用来查看线程状态, 也可以用来执行线程转储。

一般先通过 `jps` 或者 `ps` 命令找到Java进程对应的pid, 然后在控制台中通过pid来输出线程转储。 当然, 我们也可以将输出内容重定向到某个文件中。

使用jstack工具获取线程转储的基本参数格式为:

```shell
jstack [-F] [-l] [-m] <pid>
```

All the flags are optional. Let's see what they mean:

`-F` option forces a thread dump; handy to use when `jstack pid` does not respond (the process is hung)
`-l` option instructs the utility to look for ownable synchronizers in the heap and locks
`-m` option prints native stack frames (C & C++) in addition to the Java stack frames

Let's put this knowledge to use by capturing a thread dump and redirecting the result to a file:

下面请看具体的演示:

```
# 1. 查看帮助信息
jstack -help
```

输出的内容类似于:

```shell
Usage:
    jstack [-l] <pid>
        (to connect to running process)
    jstack -F [-m] [-l] <pid>
        (to connect to a hung process)
    jstack [-m] [-l] <executable> <core>
        (to connect to a core file)
    jstack [-m] [-l] [server_id@]<remote server IP or hostname>
        (to connect to a remote debug server)

Options:
    -F  to force a thread dump. Use when jstack <pid> does not respond (process is hung)
    -m  to print both java and native frames (mixed mode)
    -l  long listing. Prints additional information about locks
    -h or -help to print this help message
```


对应的参数选项是可选的。 具体含义如下：

- `-F` 选项, 强制执行线程转储； 有时候 `jstack pid` 会假死, 则可以加上 `-F` 标志
- `-l` 选项, 会查找堆内存中拥有的同步器以及资源锁
- `-m` 选项, 额外打印 native栈帧（C和C++的）

例如, 获取线程转储并将结果输出到文件：

```shell
jstack -F 17264 > /tmp/threaddump.txt
```

Remember that we can easily get the pid of a Java process by using the jps command.

使用 `jps` 命令可以获取本地Java进程的 pid。

### 2.2. Java Mission Control

Java Mission Control (JMC) is a GUI tool that collects and analyzes data from Java applications. After we launch JMC, it displays the list of Java processes running on a local machine. We can also connect to remote Java processes through JMC.

We can right-click on the process and click on the “Start Flight Recording” option. After this, the Threads tab shows the Thread Dumps:

### 2.2 Java Mission Control

Java Mission Control（JMC）是一款客户端图形界面工具, 用于收集和分析Java应用程序的各种数据。
启动JMC后, 首先会显示本地计算机上运行的Java进程列表。 当然也可以通过JMC连接到远程Java进程。


可以鼠标右键单击对应的进程, 选择 “Start Flight Recording（开始飞行记录）” 。 结束之后, “Threads（线程）” 选项卡会显示“线程转储”：


![](https://www.baeldung.com/wp-content/uploads/2020/03/JMC-1024x544-1.png)


### 2.3. jvisualvm

jvisualvm is a tool with a graphical user interface that lets us monitor, troubleshoot, and profile Java applications. The GUI is simple but very intuitive and easy to use.

One of its many options allows us to capture a thread dump. If we right-click on a Java process and select the “Thread Dump” option, the tool will create a thread dump and open it in a new tab:

### 2.3 jvisualvm

jvisualvm 是一款客户端图形界面工具, 既简单又实用, 可用来监控 Java应用程序, 对JVM进行故障排查和性能分析。

也可以用来获取线程转储。 鼠标右键单击Java进程, 选择“ Thread Dump”选项, 则可以创建线程转储, 完成后会在新选项卡中自动打开：

![](https://www.baeldung.com/wp-content/uploads/2020/03/JVisualVM.png)


### 2.4. jcmd

jcmd is a tool that works by sending command requests to the JVM. Although powerful, it doesn't contain any remote functionality – we have to use it in the same machine where the Java process is running.

One of its many commands is Thread.print. We can use it to get a thread dump just by specifying the pid of the process:

### 2.4 jcmd

jcmd工具本质上是向目标JVM发送一串命令。 尽管支持很多功能, 但不支持连接远程JVM - 只能在Java进程的本地机器上使用。

其中一个命令是 `Thread.print`, 用来获取线程转储, 示例用法如下:

```shell
jcmd 17264 Thread.print
```

### 2.5. jconsole

jconsole lets us inspect the stack trace of each thread. If we open jconsole and connect to a running Java process, we can navigate to the Threads tab and find each thread's stack trace:

### 2.5  jconsole

jconsole 工具也可以查看线程栈跟踪。
打开jconsole并连接到正在运行的Java进程, 导航到“线程”选项卡, 可以查看每个线程的堆栈跟踪：

![](https://www.baeldung.com/wp-content/uploads/2020/03/JConsole-1024x544-1.png)


### 2.6. Summary

So as it turns out, there are many ways to capture a thread dump using JDK utilities. Let's take a moment to reflect on each and outline their pros and cons:

- `jstack`: provides the quickest and easiest way to capture a thread dump. However, better alternatives are available starting with Java 8
- `jmc`: enhanced JDK profiling and diagnostics tool. It minimizes the performance overhead that's usually an issue with profiling tools
- `jvisualvm`: lightweight and open-source profiling tool with an excellent GUI console
- `jcmd`: extremely powerful and recommended for Java 8 and later. A single tool that serves many purposes – capturing thread dump (jstack), heap dump (jmap), system properties and command-line arguments (jinfo)
- `jconsole`: let's us inspect thread stack trace information

### 2.6 小结

事实证明, 可以使用JDK中的很多工具来获取线程转储。 让我们回顾一下, 并总结它们的优缺点：

- `jstack`：获取线程转储最简单最方便的工具； Java 8之后可以使用 jcmd 工具来替代；
- `jmc`：增强的JDK性能分析和问题诊断工具。 用这款工具进行性能分析的开销非常低。
- `jvisualvm`：轻量级的开源分析工具, 图形界面非常棒, 还支持各种强悍的功能插件。
- `jcmd`： 非常强大的本地工具, 支持Java 8及更高版本。 集成了多种工具的作用, 例如： 捕获线程转储（jstack）, 堆转储（jmap）, 查看系统属性和查看命令行参数（jinfo）
- `jconsole`：也可以用来查看线程栈跟踪信息。


## 3. From the Command Line

In enterprise application servers, only the JRE is installed for security reasons. Thus, we can not use the above-mentioned utilities as they are part of JDK. However, there are various command-line alternatives that let us capture thread dumps easily.

## 3. 使用Linux命令

在企业应用服务器中, 出于安全原因, 可能只安装了 JRE。 这时候没法使用这些JDK内置的工具。
但还是有办法获取线程转储。

### 3.1. kill -3 Command (Linux/Unix)

The easiest way to capture a thread dump in Unix-like systems is through the kill command, which we can use to send a signal to a process using the kill() system call. In this use case, we'll send it the -3 signal.

Using our same pid from earlier examples, let's take a look at how to use kill to capture a thread dump:

### 3.1 使用 `kill -3` 指令

在Unix/Linux之类的系统中, 可以使用 `kill` 命令获取线程转储, 底层实现原理, 则是通过系统调用 `kill()` 将信号参数发送给进程。 这里需要发送的是 `-3` 信号。

一般先通过 `jps` 找到JAVA进程对应的pid, `kill -3` 使用示例如下：


```shell
kill -3 17264
```


### 3.2. `Ctrl + Break` (Windows)

In Windows operating systems, we can capture a thread dump using the `CTRL` and `Break` key combination. To take a thread dump, navigate to the console used to launch the Java application and press `CTRL` and `Break` keys together.

It's worth noting that, on some keyboards, the `Break` key is not available. Therefore, in such cases, a thread dump can be captured using `CTRL`, `SHIFT`, and `Pause` keys together.

Both of these commands print the thread dump to the console.

### 3.2 `Ctrl + Break` (Windows)

在Windows操作系统的命令行窗口中, 可使用组合键 `Ctrl + Break` 来获取线程转储。 当然, 需要先导航至启动Java程序的控制台窗口, 然后同时按下 `CTRL`键和`Break`键。

需要注意的是, 某些键盘是没有 “`Break`” 键的。
在这种情况下, 可以组合使用 `CTRL`, `SHIFT`, 以及 `Pause`键。

这两个命令都可以将线程转储打印到控制台。

## 4. Programmatically Using ThreadMxBean

The last approach we will discuss in the article is using `JMX`. We'll use ThreadMxBean to capture the thread dump. Let's see it in code:

## 4. 通过编程方式使用ThreadMxBean

JMX技术支持各种各样的花式操作。 可通过 `ThreadMxBean` 来执行线程转储。

示例代码如下：

```java
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

上面代码做的事情很简单, 先通过 `ManagementFactory` 获取 `ThreadMxBean` 对象。
方法的布尔参数 `lockedMonitors` 和 `lockedSynchronizers`, 表示是否导出持有的同步器和管程锁。

> 但是, 这种方法有一些缺陷:

- 1. 性能不太好, 消耗的资源不少。
- 2. `threadDump.toString()` 方法最多只会输出8个栈帧(`MAX_FRAMES = 8`); 可以拷贝 toString 代码并自己进行修改/过滤。
- 3. 本地线程(比如GC线程)不会被Dump。

替代方案:

- 1. 通过 Runtime 调用 jstack 获取线程转储信息; 如果失败则回退到JMX方式;

部分代码:

```java

    public static String jStackThreadDump() {
        // 获取当前JVM进程的pid
        long currentPid = currentPid();
        // 组装命令
        String cmdarray[] = {
                "jstack",
                "" + currentPid
        };
        ProcessBuilder builder = new ProcessBuilder(cmdarray);
        String threadDump = "";
        try {
            Process p = builder.start();
            final BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            StringJoiner sj = new StringJoiner(System.lineSeparator());
            reader.lines().iterator().forEachRemaining(sj::add);
            threadDump = sj.toString();
            p.waitFor();
            p.destroy();
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return threadDump;
    }

    public static long currentPid() {
        final long fallback = -1;
        final String jvmName = ManagementFactory.getRuntimeMXBean().getName();
        final int index = jvmName.indexOf("@");
        if (index < 1) {
            return fallback;
        }
        String pid = jvmName.substring(0, index);
        if (null != pid && pid.matches("\\d+")) {
            return Long.parseLong(pid);
        }
        return fallback;
    }
```




## 5. Conclusion

In this article, we've shown multiple ways to capture a thread dump.

At first, we discussed various JDK Utilities and then the command-line alternatives. In the last section, we concluded with the programmatic approach using JMX.

As always, the full source code of the example is available [over on GitHub](https://github.com/eugenp/tutorials/tree/master/core-java-modules/core-java-perf).

## 5. 总结

我们通过具体示例展示了获取线程转储的各种方法。

首先介绍的是各种JDK内置工具,
然后讨论了命令行方式,
最后介绍了JMX编程的方式。

完整的示例代码请参考 [GitHub仓库](https://github.com/eugenp/tutorials/tree/master/core-java-modules/core-java-perf) 。

## 6. 附录: 线程状态及示例代码

Thread 状态可参考 [`Thread.State`](https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.State.html), 包括:

- `NEW`: 未启动; 比如还没执行(完)  start 方法;
- `RUNNABLE` : 可运行状态; 这是JVM的视角, 具体是否正在使用CPU则看操作系统调度;
- `BLOCKED` : 阻塞状态; 比如进入同步方法/同步块, 等待锁资源;
- `WAITING` : 等待锁资源, 比如 `Unsafe.park()`, `Object.wait()` 等。
- `TIMED_WAITING` : 限时等待锁资源, 比如 `Unsafe.park()`, `Object.wait()` 等。
- `TERMINATED`: 已终结; 线程的任务已执行完了。

测试代码:

```java

import java.util.Objects;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

// 简单模拟线程的各种状态
public class ThreadStateTest implements Runnable {
    public final Lock lock = new ReentrantLock(true);
    public final CountDownLatch beforeMonitorLatch = new CountDownLatch(1);
    public final CountDownLatch beforeLockLatch = new CountDownLatch(1);
    public final CountDownLatch toSleepLatch = new CountDownLatch(1);

    public static void main(String[] args) throws Exception {
        // Runnable task
        ThreadStateTest task = new ThreadStateTest();
        // 新创建线程对象
        Thread thread = new Thread(task);
        // 1. 线程未开始; NEW 状态;
        System.out.println("1. before start: thread.getState(): " + thread.getState());
        assertEquals(Thread.State.NEW, thread.getState());
        // 把重量锁抢了
        synchronized (task) {
            // 启动线程;
            thread.start();
            // 等待执行到要请求管程锁
            task.beforeMonitorLatch.await();
            TimeUnit.MILLISECONDS.sleep(100L);
            // 3. 线程在阻塞状态: 等待管程锁
            System.out.println("3. blocked by monitor: thread.getState(): " + thread.getState());
            assertEquals(Thread.State.BLOCKED, thread.getState());
            // 将轻量锁抢了
            task.lock.lock();
        }
        // 等待执行到要请求锁
        task.beforeLockLatch.await();
        // 稍微等一等
        TimeUnit.MILLISECONDS.sleep(100L);
        // 4. 等待状态; 此处是等待轻量锁;
        System.out.println("4. waiting lock: thread.getState(): " + thread.getState());
        assertEquals(Thread.State.WAITING, thread.getState());
        // 释放锁
        task.lock.unlock();
        // 让线程继续执行
        task.toSleepLatch.countDown();
        TimeUnit.MILLISECONDS.sleep(100);
        // 此时 thread 应该在睡眠中
        System.out.println("5.Thread in sleep: thread.getState(): " + thread.getState());
        assertEquals(Thread.State.TIMED_WAITING, thread.getState());
        // 等线程结束来汇合
        thread.join();
        System.out.println("6. after join: thread.getState(): " + thread.getState());
        assertEquals(Thread.State.TERMINATED, thread.getState());
    }

    @Override
    public void run() {
        System.out.println("=== enter run() ===");
        // 获取执行此任务的线程;
        Thread thread = Thread.currentThread();
        // 2. 线程在执行过程中; 在JVM看来属于可执行状态
        assertEquals(Thread.State.RUNNABLE, thread.getState());
        System.out.println("2. executing run: thread.getState(): " + thread.getState());

        //请求管程锁
        System.out.println("=== before synchronized (this)===");
        beforeMonitorLatch.countDown();
        synchronized (this) {
            System.out.println("===synchronized (this) enter===");
        }

        // 设置标识: 即将请求轻量锁
        beforeLockLatch.countDown();
        System.out.println("===before lock.lock()===");
        // 等待锁
        lock.lock();
        lock.unlock();

        try {
            // 等待标志: 需要睡眠
            this.toSleepLatch.await();
            // 睡眠500毫秒
            System.out.println("===before sleep()===");
            TimeUnit.MILLISECONDS.sleep(500L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("===finish run()===");
    }

    // 工具方法; 程序断言相等
    static public void assertEquals(Object expected, Object actual) {
        if (false == Objects.equals(expected, actual)) {
            throw new RuntimeException("Not Equals: expected=" + expected + "; actual=" + actual);
        }
    }
}

```

控制台输出的执行结果为:

```c
1. before start: thread.getState(): NEW
=== enter run() ===
2. executing run: thread.getState(): RUNNABLE
=== before synchronized (this)===
3. blocked by monitor: thread.getState(): BLOCKED
===synchronized (this) enter===
===before lock.lock()===
4. waiting lock: thread.getState(): WAITING
===before sleep()===
5.Thread in sleep: thread.getState(): TIMED_WAITING
===finish run()===
6. after join: thread.getState(): TERMINATED
```


## 相关链接


更多信息科参考:

- 原文链接: <https://www.baeldung.com/java-thread-dump>
- [JVMTI](https://docs.oracle.com/javase/8/docs/platform/jvmti/jvmti.html)
- [DTrace](https://zhuanlan.zhihu.com/p/24124082)
- [honest-profiler](https://github.com/jvm-profiling-tools/honest-profiler)
- [《动态追踪技术漫谈》](https://blog.openresty.com.cn/cn/dynamic-tracing/)
- 中英双语对照版GitHub: [获取Java线程转储的常用方法](https://github.com/cncounter/translation/blob/master/tiemao_2020/09_java-thread-dump/README.md)
- 中英双语对照版Gitee: [获取Java线程转储的常用方法](https://gitee.com/cncounter/translation/blob/master/tiemao_2020/09_java-thread-dump/README.md)
