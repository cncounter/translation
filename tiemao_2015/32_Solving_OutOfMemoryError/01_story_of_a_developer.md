搞定内存溢出(part 1) – 程序员的那些事
==

Another day in the office. Except that you get another call from the operations saying they now have to restart your production application every three hours. And they seem to be somewhat annoyed with this. You have a feeling that their emotion is in correlation to the number of phone calls customer support is getting lately – which has skyrocketed in the past few weeks.


某天你正在公司写代码的时候。你接到了运营人员打过来的电话, 说现在每三小时就得重启一次你们的系统。语气不太友好,看起来他们也不喜欢天天干这种傻事。你有一种感觉, 他们的情绪跟最近两周客户投诉电话快被打爆了有很大的关系。


I’m sure you have been there. And I am also sure you wish you would never have to be there again.


你可能感受过这种滋味。但肯定不好受。



All you have is a symptom: an OutOfMemoryError. You have no clue what causes it. You cannot reproduce the problem. You cannot see the log files in production. But you have to solve it. Not that you have the task in your job contract – you are just a developer – the reasons are rather related to your engineering pride and being a responsible human being.

你碰到的这种现象叫做: **内存溢出**(OutOfMemoryError)。你并不知道是什么原因引起的,也不能重现这个问题。因为你压根就没权限查看生产系统的日志。作为一个工程师,你有你的骄傲,你还有责任心,所以你必须解决它。虽然你只是个程序员，这也不是你的本职工作。



> **广告:** 你知道大约 20% 的Java系统存在内存泄漏(memory leak)吗? 不要老是去杀进程,你可以通过 [Plumbr](https://plumbr.eu/memory-leak) 来快速排查问题.


And here we go again. Sleepless nights or weeks. Struggling with authorization issues and bureaucracy. Getting ignorant people find the correct data for you. Great. Just great. Having the boss breathe down on your neck does not help much either. “When will it be fixed?” I bet you’d rather estimate when the [P versus NP](http://en.wikipedia.org/wiki/P_versus_NP_problem) problem will be solved.


然后呢, 提申请，走流程, 吃不好睡不好, 在官僚主义和大企业病中熬过几天以后, 你终于拿到了需要的那些数据。好!太好了!（死也瞑目了!!!） 虽然 BOSS 恨不得你立马就解决了,你可能还是会觉得解决 [P 与 NP](https://zh.wikipedia.org/wiki/P/NP%E9%97%AE%E9%A2%98) 问题还是来得简单一些。


In this blog we are planning to write about everything related to the situations described above. The next posts will concentrate on how these situations are currently handled, what tools and techniques are popularly used and how you can benefit from them when in a similar situation. As we are a product development company, we might mention our own solutions somewhere along the way, but we promise it will be an interesting read nonetheless! The later blog posts in the series (thus far) include:


在这个系列里面, 我们准备解决上面这样的情景。接下来的文章将详述碰到这种情况该如何处理, 该使用什么工具和技术,以及如何搞定类似的情况。虽然 Plumbr 是一家产品开发公司, 在文中会穿插一些自己的解决方案, 但这仍然是一系列有趣的文章! 接下来的博客文章系列如下:



### 搞定内存溢出系列文章

- [搞定内存溢出(part 1) – 程序员的那些事](01_story_of_a_developer.md)

- [搞定内存溢出(part 2) – 为什么运营搞不定?](02_why_did_not_operations_solve_it.md)

- [搞定内存溢出(part 3) – 从哪里下手?](03_where_do_you_start.md)

- [搞定内存溢出(part 4) – 内存分析器](04_memory_profilers.md)

- [搞定内存溢出(part 5) – JDK自带的工具](05_JDK_Tools.md)

- [搞定内存溢出(part 6) – Dump 没想象中那么麻烦](06_Dump_is_not_a_waste.md)


原文链接: [https://plumbr.eu/blog/memory-leaks/solving-outofmemoryerror-story-of-a-developer](https://plumbr.eu/blog/memory-leaks/solving-outofmemoryerror-story-of-a-developer)

原文日期: 2011年08月29日

翻译日期: 2015年11月01日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
