# async-profiler简介


async-profiler 是一款低开销的 Java 采样分析器(sampling profiler), 最大的亮点是避免了 [安全点偏差问题](http://psy-lob-saw.blogspot.com/2016/02/why-most-sampling-java-profilers-are.html)。

大致实现原理, 是利用 HotSpot 专有的 API, 采集调用栈(stack traces)信息, 以及追踪内存分配。 兼容 OpenJDK、Oracle JDK 以及其他基于 HotSpot JVM 的 Java 运行时。

sampling profiler, 采样分析器, 有时候也称为 "抽样分析器"。 通过采样/抽样, 只要样本达到一定规模, 根据概率学知识, 我们知道这些样本大概率能够展示整体遇到的问题。


async-profiler 可以跟踪以下类型的事件:

- CPU cycles
- Hardware and Software performance counters like cache misses, branch misses, page faults, context switches etc.
- Allocations in Java Heap
- Contented lock attempts, including both Java object monitors and ReentrantLocks

See our Wiki or 3 hours playlist to learn about all features.


## Idea中执行CPU耗时采样分析

IntelliJ IDEA Ultimate 2018.3 及以上版本内置集成了 async-profiler 工具, 更多详细信息请查看 [IntelliJ IDEA documentation](https://blog.jetbrains.com/idea/2018/09/intellij-idea-2018-3-eap-git-submodules-jvm-profiler-macos-and-linux-and-more/).

虽然在开发环境执行性能分析看着有点Low, 但很多问题其实也能分析出来。

先进入配置界面:

![](idea-cpu-profiler.png)

然后保存配置并关闭, 接着运行程序:

![](idea-run-with-profiler.jpg)

再次运行程序时, 可以从这里打开:

![](idea-run-with-profiler-2.jpg)

查看分析结果:

![](idea-cpu-profiler-result.jpg)

这里提供了3种界面, 选择你喜欢的方式查看即可。


## 相关链接

- [async-profiler GitHub项目首页](https://github.com/jvm-profiling-tools/async-profiler)
- [async-profiler WIKI](https://github.com/jvm-profiling-tools/async-profiler/wiki)
- [Async-profiler 视频教程](https://www.youtube.com/playlist?list=PLNCLTEx3B8h4Yo_WvKWdLvI9mj1XpTKBr)
- [Why (Most) Sampling Java Profilers Are Fucking Terrible](http://psy-lob-saw.blogspot.com/2016/02/why-most-sampling-java-profilers-are.html)
- [JVM CPU Profiler技术原理及源码深度解析](https://tech.meituan.com/2019/10/10/jvm-cpu-profiler.html)

