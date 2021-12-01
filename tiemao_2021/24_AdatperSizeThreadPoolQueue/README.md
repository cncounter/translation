# 自适应线程池


## 当前线程池的痛点

1. 队列小了容易引发拒绝
2. 队列大了线程数不会扩容。
3. 固定线程则抢占资源, 对大部分时候的指标不友好。

## 背景需求

在同一个Java应用中存在多个线程池, 为了应对突然到来的大量并发请求, 线程池中的线程数需要根据 queue 中堆积的任务数量进行自动扩容。


线程池参数

一个 Builder? 维护最初始的参数:

- 初始核心线程数
- 初始最大线程数
- 队列高水位线(capacity)
- 队列低水位线
- 步长; 或者是自动计算; 最初时保持一定的比例关系;

例如: （高水位线 - 低水位线）/ (最大线程 - 初始核心线程 + 当前线程数) ?


AdatperSizeThreadPoolQueue

自动根据 corePoolSize, maxPoolSize, 以及 queue.size 来进行处理, 以确定是否需要:

- 内部包装一个queue;
- 自动增加或者减少corePoolSize;
- 每积累到一定的queue数量，就增加 corePoolSize;

还有一种思路是到一定数量就拒绝一次以刺激threadpool增长 cache数量，但是并不太安全。
增加和维护核心线程数更靠谱一些。而且这个是阻塞式的queue。

扩容或者缩容时, 需要使用原子计数器, 并吃掉能处理的异常。


## 相关链接


- 动态线程池（Hippo4J）: <https://github.com/acmenlt/dynamic-threadpool>
