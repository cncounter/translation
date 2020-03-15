# Capturing a Java Thread Dump


## 1. Overview

In this tutorial, we'll discuss various ways to capture the thread dump of a Java application.

A thread dump is a snapshot of the state of all the threads of a Java process. The state of each thread is presented with a stack trace, showing the content of a thread's stack. A thread dump is useful for diagnosing problems as it displays the thread's activity. Thread dumps are written in plain text, so we can save their contents to a file and look at them later in a text editor.

In the next sections, we'll go through multiple tools and approaches to generate a thread dump.

## 2. Using JDK Utilities

The JDK provides several utilities that can capture the thread dump of a Java application. All of the utilities are located under the bin folder inside the JDK home directory. Therefore, we can execute these utilities from the command line as long as this directory is in our system path.

### 2.1. jstack

jstack is a command-line JDK utility we can use to capture a thread dump. It takes the pid of a process and displays the thread dump in the console. Alternatively, we can redirect its output to a file.

Let's take a look at the basic command syntax for capturing a thread dump using jstack:

```
jstack [-F] [-l] [-m] <pid>
```

All the flags are optional. Let's see what they mean:

`-F` option forces a thread dump; handy to use when jstack pid does not respond (the process is hung)
`-l` option instructs the utility to look for ownable synchronizers in the heap and locks
`-m` option prints native stack frames (C & C++) in addition to the Java stack frames

Let's put this knowledge to use by capturing a thread dump and redirecting the result to a file:

```
jstack 17264 > /tmp/threaddump.txt
```

Remember that we can easily get the pid of a Java process by using the jps command.

### 2.2. Java Mission Control

Java Mission Control (JMC) is a GUI tool that collects and analyzes data from Java applications. After we launch JMC, it displays the list of Java processes running on a local machine. We can also connect to remote Java processes through JMC.

We can right-click on the process and click on the “Start Flight Recording” option. After this, the Threads tab shows the Thread Dumps:


### 2.3. jvisualvm

jvisualvm is a tool with a graphical user interface that lets us monitor, troubleshoot, and profile Java applications. The GUI is simple but very intuitive and easy to use.

One of its many options allows us to capture a thread dump. If we right-click on a Java process and select the “Thread Dump” option, the tool will create a thread dump and open it in a new tab:


### 2.4. jcmd

jcmd is a tool that works by sending command requests to the JVM. Although powerful, it doesn't contain any remote functionality – we have to use it in the same machine where the Java process is running.

One of its many commands is Thread.print. We can use it to get a thread dump just by specifying the pid of the process:

```
jcmd 17264 Thread.print
```

### 2.5. jconsole

jconsole lets us inspect the stack trace of each thread. If we open jconsole and connect to a running Java process, we can navigate to the Threads tab and find each thread's stack trace:


2.6. Summary
So as it turns out, there are many ways to capture a thread dump using JDK utilities. Let's take a moment to reflect on each and outline their pros and cons:

jstack: provides the quickest and easiest way to capture a thread dump. However, better alternatives are available starting with Java 8
jmc: enhanced JDK profiling and diagnostics tool. It minimizes the performance overhead that's usually an issue with profiling tools
jvisualvm: lightweight and open-source profiling tool with an excellent GUI console
jcmd: extremely powerful and recommended for Java 8 and later. A single tool that serves many purposes – capturing thread dump (jstack), heap dump (jmap), system properties and command-line arguments (jinfo)
jconsole: let's us inspect thread stack trace information
3. From the Command Line
In enterprise application servers, only the JRE is installed for security reasons. Thus, we can not use the above-mentioned utilities as they are part of JDK. However, there are various command-line alternatives that let us capture thread dumps easily.

3.1. kill -3 Command (Linux/Unix)
The easiest way to capture a thread dump in Unix-like systems is through the kill command, which we can use to send a signal to a process using the kill() system call. In this use case, we'll send it the -3 signal.

Using our same pid from earlier examples, let's take a look at how to use kill to capture a thread dump:

1
kill -3 17264
3.2. Ctrl + Break (Windows)
In Windows operating systems, we can capture a thread dump using the CTRL and Break key combination. To take a thread dump, navigate to the console used to launch the Java application and press CTRL and Break keys together.

It's worth noting that, on some keyboards, the Break key is not available. Therefore, in such cases, a thread dump can be captured using CTRL, SHIFT, and Pause keys together.

Both of these commands print the thread dump to the console.

4. Programmatically Using ThreadMxBean
The last approach we will discuss in the article is using JMX. We'll use ThreadMxBean to capture the thread dump. Let's see it in code:

1
2
3
4
5
6
7
8
private static String threadDump(boolean lockedMonitors, boolean lockedSynchronizers) {
    StringBuffer threadDump = new StringBuffer(System.lineSeparator());
    ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
    for(ThreadInfo threadInfo : threadMXBean.dumpAllThreads(lockedMonitors, lockedSynchronizers)) {
        threadDump.append(threadInfo.toString());
    }
    return threadDump.toString();
}
In the above program, we are performing several steps:

At first, an empty StringBuffer is initialized to hold the stack information of each thread.
We then use the ManagementFactory class to get the instance of ThreadMxBean. A ManagementFactory is a factory class for getting managed beans for the Java platform. In addition, a ThreadMxBean is the management interface for the thread system of the JVM.
Setting lockedMonitors and lockedSynchronizers values to true indicates to capture the ownable synchronizers and all locked monitors in the thread dump.
5. Conclusion
In this article, we've shown multiple ways to capture a thread dump.

At first, we discussed various JDK Utilities and then the command-line alternatives. In the last section, we concluded with the programmatic approach using JMX.

As always, the full source code of the example is available over on GitHub.
