搞定内存溢出(part 2)- 为什么运营搞不定?
==

You are a developer. You should not be solving problems occurring in production once in a blue moon. But here you are again, trying to figure out what has gone wrong again. Why are you here and what could be done differently to avoid you solving these problems?


After all – your operations is also full of competent people. They have tried their best to pinpoint the root cause, by pulling different tricks from their book of knowledge. What we have faced is that the methods used might not always be the most beneficial:


- randomly changing (read: increasing) various memory parameters, such as `-Xmx`, `-XX:MaxPermSize` and `-XX:NewRatio=2`;
- logging all kind of information by creating gigabytes of logs by` -verbose:gc` `-XX:+PrintGCTimeStamp` `-XX:+PrintGCDetails` and so forth;
- adding more (physical) memory to the servers;
- … doing various other weird things that go beyond imagination.


No kidding here – I have personally met at least four persons from operations who loaded machines with physical memory up to their maximal capacity when encountering OutOfMemoryErrors in Java programs. None of them had heard about how Java virtual machines actually handle memory and were still running the programs with platform default maximal heap size which was definitely nowhere near those gigabytes of expensive RAM thrown towards the problem.


> **广告:** 你知道大约 20% 的Java系统存在内存泄漏(memory leak)吗? 不要老是去杀进程,你可以通过 [Plumbr](https://plumbr.eu/memory-leak) 来快速排查问题.


Another ops person just loved configuring. And he for sure knew how to tweak heap in Java applications. Oh boy, how he knew. The result – while before his configuration frenzy the application lasted six hours before it needed a JVM restart, then after his tweaks the lifetime expectancy was effectively reduced to just 50 minutes.


To make it clear – we do not want to accuse operations in those cases – after all those people have tens or hundreds of applications at their guard. Those applications are created using all kinds of unimaginable languages, libraries and servers. They just might lack the specific knowledge in Java and / or time to properly deal with those issues. So lets be honest – without actually knowing the ins and outs of the application code they only have a limited chance of succeeding.


But they still give it their best shot. This shot might take days or even months before the issue is escalated past the operations. During this time you tend to have hundreds or thousands of angry users who have suffered from the malfunctioning application.


In the next posts in the series we will go into different tools and techniques you are most likely going to use in those situations.



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
