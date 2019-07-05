## 标题

1.题目: JVM问题诊断入门

2.作者简介: 任富飞，资深Java工程师，具有8年软件设计和开发经验，3年调优经验。
翻译爱好者, 热爱各种开源技术，对JVM和Java体系有较深入的理解，熟悉互联网领域常用的各种调优套路。

3.内容介绍:

本次分享主要介绍如何进行JVM问题诊断，在排查过程中可以使用哪些工具, 通过示例对各种工具进行简单的讲解, 
并引入相关的基础知识，在此过程中，结合作者的经验和学到的知识，提出一些观点和调优建议。
内容涉及：

1. 环境准备与相关设置

2. 常用性能指标介绍

3. JVM基础知识和启动参数

4. JDK内置工具介绍和使用示例

5. JDWP简介

6. JMX与相关工具

7. 各种GC日志解读与分析

8. 内存dump和内存分析工具介绍

9. 面临复杂问题时可选的高级工具

10. 应对容器时代面临的挑战

## 正文

JVM全称是Java Virtual Machine, 翻译为中文是"Java虚拟机"。

一般来说，进行JVM问题诊断的目的有：

- 程序问题
- 性能问题

- 学习研究和知识储备

本次分享基于 Oracle公司 JDK8 版本的 HotSpot JVM。

> 题外话: 目前，最多的Java虚拟机实例位于Android设备中，绝大部分的Linux系统也运行在Android设备上。
>
> 在前些年，由于存储的限制，软件安装包的大小很受关注。Java安装包分为2种类型： JDK是完全版安装包， JRE是阉割版安装包。 
>
> 如今Java语言的主要应用领域是企业环境，所以Oracle在JRE的基础上，增加一部分JDK内置的工具，组合成Server JRE 版，但实际上这增加了选择的复杂度，有点鸡肋。实际使用时直接安装JDK即可。



### 1. 环境准备与相关设置

- 安装
- 环境变量

JDK通常是从Oracle官网下载并安装。有的操作系统提供了自动安装工具，也可以使用，比如 yum, brew, apt 等等。这部分比较基础，有问题直接搜索即可。

自动安装完成后，一般来说Java环境就可以使用了。 验证的脚本命令为:

```shell
javac -version
java -version
```

如果找不到命令，需要设置环境变量： `JAVA_HOME`  和  `PATH` 。 

> 某些工具依赖 `JAVA_HOME`  环境变量，而且通过 `JAVA_HOME` ，必要时可以快速切换JDK版本 。

Windows系统,  系统属性 - 高级 - 设置系统环境变量。如果没权限也可以设置用户环境变量。

Linux和MacOSX系统, 需要配置脚本。

```shell
cat ~/.bash_profile 

# JAVA ENV
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_162.jdk/Contents/Home
export PATH=$PATH:$JAVA_HOME/bin
```

让环境配置立即生效:

```shell
source ~/.bash_profile
```

查看环境变量:

```shell
export
echo $PATH
echo $JAVA_HOME
```

一般来说，`.bash_profile` 之类的脚本只用于设置环境变量。 随机器自启动的程序在其他脚本中设置。

如果不知道自动安装/别人安装的JDK在哪个目录怎么办? 

> 最简单/最麻烦的查询方式是询问相关人员。

查找的方式很多，比如，可以使用 `whereis` 和 `ls -l` 来跟踪软连接, 或者 `find` 命令全局查找(可能需要sudo权限), 例如:

```shell
whereis javac
ls -l /usr/bin/javac
sudo find / -name javac
```

找到满足  `$JAVA_HOME/bin/javac`  的路径即可。

WIndows系统，安装在哪就是哪，通过任务管理器也可以查看某个程序的路径，注意 `JAVA_HOME` 不可能是 `C:/Windows/System32` 目录。

### 2. 常用性能指标介绍



一般衡量系统性能的维度有3个:

- 响应时间/延迟
- 吞吐量/TPS
- 系统容量/硬件配置

例如： "配置2核4GB，TPS=200，95%线是20ms，最大响应时间40ms。"  隐含的条件可能是 "并发请求量不超过200"，这也是系统设计容量。





JVM诊断可用的方式:

- 状态监控
- 性能分析器
- Dump分析
- 本地/远程调试
- 修改JVM行为






```
java -version
javac -version

-showversion
-XX+PrintCommandLineFlags

```





JVM配置参数 

-???

-X???

-X???:???

-XX:+-???

-XX:???=???

-Dxxx



命令行监控、GUI图形界面监控。

本地实时监控。

远程实时监控。

离线监控。/日志/history。

错误恢复/诊断。





jps

jstat

JSTAT

jstatd

visualgc

jstack



图形化工具

jconsole —>  jvisualvm  —> jmc

JMAP

JHat

BTrace

MAT

jdb

JINFO



JDWP



jconsole, jcmd, jshell





注册中心

gcviewer



选项:





```
-Xmx4g
-Xms4g


```



```
-Dcom.sun.management.jmxremote 
-Dcom.sun.management.jmxremote.port=10990 
-Dcom.sun.management.jmxremote.ssl=false 
-Dcom.sun.management.jmxremote.authenticate=false 

```





## 随机数熵源(Entropy Source)

```
-Djava.security.egd=file:/dev/./urandom
```



<https://github.com/cncounter/translation/blob/master/tiemao_2017/07_FasterStartUp_Tomcat/07_FasterStartUp_Tomcat.md#%E9%9A%8F%E6%9C%BA%E6%95%B0%E7%86%B5%E6%BA%90entropy-source>





GC:



```

-verbosegc
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200
-XX:+HeapDumpOnOutOfMemoryError
UseGClogFileRotation
NumberOfGCLogFiles
```







暂停时间超标, 释放的内存量持续减小。



付费工具: **JProfiler**, Plumbr,  Java Flight Recorder (JFR，市场),

Pinpoint, Datadog, Zabbix

gdb

HPROF





深入问题不讲

崩溃、死锁



- [the `JAVA_HOME` Environment Variable](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/envvars001.html#CIHEEHEI)
- [The `JAVA_TOOL_OPTIONS` Environment Variable](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/envvars002.html#CIHDGJHI)
- [The `java.security.debug` System Property](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/envvars003.html#CIHDAFDD)



https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/clopts001.html



HotSpot VM Options: <https://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html>

JMX 配置: <https://docs.oracle.com/javase/8/docs/technotes/guides/management/agent.html>

troubleshoot: <https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/toc.html>

GC Tuning Guide: <https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/index.html>

Latency: <https://bravenewgeek.com/everything-you-know-about-latency-is-wrong/>

CAPACITY TUNING: <https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/performance_tuning_guide/s-memory-captun>

memory-leak: <https://www.programcreek.com/2013/10/the-introduction-of-memory-leak-what-why-and-how/>

MemoryUsage: <https://docs.oracle.com/javase/8/docs/api/java/lang/management/MemoryUsage.html>

JVMInternals : <http://blog.jamesdbloom.com/JVMInternals.html>

JVMTI 和 Agent 实现: <https://www.ibm.com/developerworks/cn/java/j-lo-jpda2/index.html>