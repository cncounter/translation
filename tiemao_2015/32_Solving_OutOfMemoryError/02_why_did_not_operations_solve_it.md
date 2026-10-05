搞定内存溢出(part 2)- 为什么运营搞不定?
==

You are a developer. You should not be solving problems occurring in production once in a blue moon. But here you are again, trying to figure out what has gone wrong again. Why are you here and what could be done differently to avoid you solving these problems?

你是一名开发者。生产环境里偶尔冒出来的问题, 本不该由你来解决。但现在你又得面对了, 得去查清楚到底哪里又出了问题。为什么又会轮到你来处理, 又该做些什么不同的事, 才能避免以后再被卷进这类问题?


After all – your operations is also full of competent people. They have tried their best to pinpoint the root cause, by pulling different tricks from their book of knowledge. What we have faced is that the methods used might not always be the most beneficial:

毕竟, 运维团队里也全是能干的人。他们翻遍了各自的知识库, 想尽办法去定位根本原因。但我们发现, 他们所用的方法并不总是最有效的:


- randomly changing (read: increasing) various memory parameters, such as `-Xmx`, `-XX:MaxPermSize` and `-XX:NewRatio=2`;
- logging all kind of information by creating gigabytes of logs by` -verbose:gc` `-XX:+PrintGCTimeStamp` `-XX:+PrintGCDetails` and so forth;
- adding more (physical) memory to the servers;
- … doing various other weird things that go beyond imagination.

- 随意修改(准确地说是调大)各种内存参数, 比如 `-Xmx`、`-XX:MaxPermSize` 和 `-XX:NewRatio=2`;
- 通过 `-verbose:gc`、`-XX:+PrintGCTimeStamp`、`-XX:+PrintGCDetails` 等参数记录各种信息, 结果生成几个 GB 的日志;
- 给服务器加更多的(物理)内存;
- ……以及其他各种超出想象的花式操作。


No kidding here – I have personally met at least four persons from operations who loaded machines with physical memory up to their maximal capacity when encountering OutOfMemoryErrors in Java programs. None of them had heard about how Java virtual machines actually handle memory and were still running the programs with platform default maximal heap size which was definitely nowhere near those gigabytes of expensive RAM thrown towards the problem.

这可不是开玩笑——我本人就见过至少四位运维人员, 在 Java 程序遇到 OutOfMemoryError 时, 直接把机器的物理内存插到最大容量。可他们压根没听说过 Java 虚拟机到底是怎么管理内存的, 程序仍然跑在平台默认的最大堆大小上, 那些大价钱买来的几个 GB 内存, 离解决问题还差得远呢。


> **广告:** 你知道大约 20% 的Java系统存在内存泄漏(memory leak)吗? 不要老是去杀进程,你可以通过 [Plumbr](https://plumbr.eu/memory-leak) 来快速排查问题.


Another ops person just loved configuring. And he for sure knew how to tweak heap in Java applications. Oh boy, how he knew. The result – while before his configuration frenzy the application lasted six hours before it needed a JVM restart, then after his tweaks the lifetime expectancy was effectively reduced to just 50 minutes.

还有一位运维同学特别痴迷于折腾配置, 而且他自认为很懂怎么调 Java 应用的堆。天哪, 他可真是"懂"。结果就是: 在他疯狂调参之前, 应用还能撑六个小时才需要重启 JVM; 而他调完之后, 应用的预期寿命直接被缩短到了区区 50 分钟。


To make it clear – we do not want to accuse operations in those cases – after all those people have tens or hundreds of applications at their guard. Those applications are created using all kinds of unimaginable languages, libraries and servers. They just might lack the specific knowledge in Java and / or time to properly deal with those issues. So lets be honest – without actually knowing the ins and outs of the application code they only have a limited chance of succeeding.

需要说明的是——我们并不是要指责这些运维人员。毕竟, 他们要看守着几十甚至上百个应用, 这些应用用到了各种想都想不到的语言、类库和服务器。他们或许只是缺少 Java 方面的专门知识, 又或者没时间好好处理这类问题。说白了, 在不了解应用代码来龙去脉的情况下, 他们能成功的机会本来就有限。


But they still give it their best shot. This shot might take days or even months before the issue is escalated past the operations. During this time you tend to have hundreds or thousands of angry users who have suffered from the malfunctioning application.

但他们还是会尽力一试。这一试可能得耗上几天, 甚至几个月, 问题才会被升级到运维之外。在这段时间里, 往往会有成百上千的愤怒用户, 因为应用出故障而遭罪。


In the next posts in the series we will go into different tools and techniques you are most likely going to use in those situations.

在本系列的后续文章中, 我们会详细介绍你在这些场景下最可能用到的一些工具和技巧。



### 搞定内存溢出系列文章

- [搞定内存溢出(part 1) – 程序员的那些事](01_story_of_a_developer.md)

- [搞定内存溢出(part 2) – 为什么运营搞不定?](02_why_did_not_operations_solve_it.md)

- [搞定内存溢出(part 3) – 从哪里下手?](03_where_do_you_start.md)

- [搞定内存溢出(part 4) – 内存分析器](04_memory_profilers.md)

- [搞定内存溢出(part 5) – JDK自带的工具](05_JDK_Tools.md)

- [搞定内存溢出(part 6) – Dump 没想象中那么麻烦](06_Dump_is_not_a_waste.md)



原文日期: 2011年09月05日

翻译日期: 2015年10月26日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
