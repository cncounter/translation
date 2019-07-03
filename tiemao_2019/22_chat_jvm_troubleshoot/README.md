一、准备chat分享主题（具体内容见下文准备内容）——1个周的准备时间
准备内容：
1. Chat 分享的主题 — JVM问题诊断入门
2. Chat 内容简介和大纲

3. 分享嘉宾个人简介
  参考美团案例：https://gitbook.cn/gitchat/activity/5b91078c41c7575ca0d6441a 
  二、准备正文——在主题发布后，2个周的准备时间
  三、线上微信群答疑——正文发布后，1个周的准备时间，在线答疑1个小时
4. 分享主题给我Word格式就好，正文需要给我Word文档和MD格式的文档以及图片包，其他没有了



1.题目: JVM问题诊断入门

2.作者简介: 任富飞，资深Java工程师，具有8年软件设计和开发经验，3年调优经验。
翻译爱好者, 热爱各种开源技术，对JVM和Java体系有较深入的理解，熟悉互联网领域常用的各种调优套路。

3.内容介绍:

本次分享主要介绍如何进行JVM问题诊断，在排查过程中可以使用哪些工具, 通过示例对各种工具进行简单的讲解, 
并引入相关的基础知识，在此过程中，结合作者的经验和学到的知识，提出一些观点和调优建议。
内容涉及：

环境准备与相关设置
常用性能指标介绍
JVM基础知识和启动参数
JDK内置工具介绍和使用示例
JDWP简介
JMX与相关工具
各种GC日志解读与分析
内存dump和内存分析工具介绍
面临复杂问题时可选的高级工具
应对容器时代面临的挑战










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





JPS

JSTAT

jstatd

visualgc

jstack

JVisualVM 

JMC

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

