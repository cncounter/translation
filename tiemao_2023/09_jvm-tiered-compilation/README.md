# 深入JVM: 案例详解JIT分层编译技术

> 最后更新日期: 2022年11月09日

## 1. 背景简介

JVM在运行时有两种执行方式:

- 一种是解释执行(interprets), 理论上执行速度较慢, 特别是大规模的循环和计算任务时; 
- 另一种是编译运行(JIT, just-in-time compilation, 即时编译), 可以大幅度提升性能, 比如几十倍上百倍的提升比例。

但是在常规并发量的CRUD程序中, 两者在宏观上可能看不出明显区别, 因为时间主要消耗在其他地方, 比如网络IO交互之类的步骤上。

JIT编译器能大幅提升程序性能, 也分为两款; 

- 一款被称为 客户端编译器(Client Complier), 设计目标是为了让Java程序具有较快的启动速度; 主要使用场景是 AWT/Swing 之类的图形界面客户端;
- 另一款称为 服务端编译器(Server Complier), 设计目标是为了在整体上有更好的性能表现; 顾名思义, 主要使用场景是需要长时间运行的服务端系统。

在老一点的 Java 版本中, 我们需要手动指定 Hotspot JVM 使用哪一款即时编译器;

为了兼容更复杂的使用场景, 达成更好的性能表现, 从 Java 7 版本开始, JVM 引入了分层编译技术(tiered compilation)。

本文简要介绍这两款不同的JIT编译器; 并详细介绍分层编译技术(Tiered Compilation)和其中的5种编译级别; 最后再通过具体示例, 分析编译日志, 来深入学习JIT编译的运行原理。


## 2. JIT 编译器

即时编译器(JIT compiler)的作用, 是将执行频率较高的字节码(bytecode)编译为本地机器码(native code)。 

频繁执行的代码被称为 热点代码(hotspots), 这也是 Hotspot JVM 这个名字的由来。

通过即时编译技术, Java 程序的执行性能大幅提升, 和纯编译类型的语言差不多。

当然, 在实际的软件开发实践中, 代码质量也是一个影响很大的因素。 

> 使用高级语言开发的复杂系统, 比起用低级语言开发, 在同样的“开发成本”下, 高级语言系统的综合质量要优越很多。

Hotspot JVM 提供了 2 种类型的JIT编译器:


### 2.1. 客户端版本的编译器: C1

客户端版本的编译器(client compiler), 称为 C1, 是JVM内置的一款即时编译器, 其中的一个目的是为了让 Java应用启动更快完成.  所以会尽可能快地将代码优化并编译为机器代码.

最初, C1主要的应用场景是生命周期较短的客户端应用程序, 对这类应用而言, 启动时间是一个很重要的非功能性需求。 

在Java8之前的版本中, 需要指定 `-client` 启动参数来设置 C1 编译器, 但在Java8以及更高的Java版本中, 这个参数就没有任何作用了, 保留下来只是为了不报错。

> 验证命令: `java -client -version`


### 2.2. 服务端版本的编译器: C2

服务端版本的编译器(server compiler), 称为 C2, 是一款性能更好的, JVM内置的即时编译器(JIT compiler), 适用于生命周期更长的应用程序, 主要的使用场景就是服务端应用。
C2会监测和分析编译后的代码执行情况, 通过这些分析数据, 就可以生成和替换为更优化的机器代码。

在Java8之前的版本中, 需要指定 `-server` 启动参数来设置 C2 编译器, 但在Java8以及更高的Java版本中, 这个参数就没有任何作用了, 保留下来也是为了不报错。


> 验证命令: `java -server -version`


### 2.3. Graal JIT 编译器

Java 10及之后的版本, 开始支持 Graal JIT 编译器, 这是一款可以平替 C2 的编译器。 

其特征是既支持即时编译模式(just-in-time compilation mode), 也支持预先编译模式(ahead-of-time compilation mode)。

预先编译模式就是在程序启动之前, 将Java字节码全部编译为本地代码。


## 3. 分层编译技术(Tiered Compilation)

对同一个方法进行编译, 相比起C1来说, C2编译器需要更多的CPU和内存, 但可以生成高度优化,性能卓越的本地代码。

从Java 7 版本开始, JVM引入了分层编译技术, 目标是综合利用 C1 和 C2, 实现快速启动和长时间高性能运行之间的平衡。

混合模式示例:

```sh
$ java -client -version

openjdk version "1.8.0_191"
OpenJDK Runtime Environment (build 1.8.0_191-b12)
OpenJDK 64-Bit Server VM (build 25.191-b12, mixed mode)
```

`java -version` 命令, 输出内容中的 `mixed mode`, 就是这个意思。



### 3.1. 汇集两者的优点

混合编译的整个过程如下图所示:

![](01-c1-c2-process.jpg)


第一阶段: 

应用启动之后, JVM先是解释执行所有的字节码, 并采集方法调用相关的各种信息。
接下来, JIT 编译器对采集到的数据进行分析, 找出热点代码。

第二阶段:

启动C1, 将频繁执行的方法, 快速编译为本地机器码。

第三阶段:

收集到足够的信息以后, C2介入; C2会消耗一定的编译时间, 采用更激进的方式, 将代码重新编译为高度优化的本地机器码, 以提高性能。

总体来看，C1 快速提高代码执行效率, C2基于热点代码分析数据, 让编译后的本地代码性能再次提升。


### 3.2. 精准优化(Accurate Profiling)

分层编译的另一个好处, 是可以更准确地分析代码。

在没有分层编译的Java版本中，JVM只能在解释期间收集优化需要的信息。

启用分层编译后，JVM还收集了 C1 编译后的代码执行信息。 由于编译后的代码具备了更好的性能, 也就可以容忍JVM收集更多的分析数据采样。



### 3.3. 代码缓存池(Code Cache)

Code cache 是JVM中的一块内存区域, 用来存储所有JIT编译后生成的本地机器码。 
使用分层编译技术, 需要的代码缓存使用量, 增长到了原来的4倍左右。

Java 9 以及之后的版本, 将 JVM 的代码缓存分成三块区域:

- 非Java方法使用的代码缓存区(non-method): 存储 JVM 内部的本地代码; 默认值是 5 MB 左右, 可通过启动参数 `-XX:NonNMethodCodeHeapSize` 指定。
- 带信息收集的代码缓存区(profiled-code):  存放 C1 编译后的本地代码; 一般来说这部分代码的存活周期并不长, 默认值是 122 MB 左右, 可通过启动参数  `-XX:ProfiledCodeHeapSize` 指定。
- 不带信息收集的代码缓存区(non-profiled):  存放 C2 编译和优化后的本地代码; 一般来说这部分代码的存活周期较长, 默认值也是 122 MB 左右, 可通过启动参数  `-XX:NonProfiledCodeHeapSize` 指定。

将代码缓存池拆分为多个模块, 整体性能提升了不少, 因为贴近了编译后相关的代码, 并减少了内存碎片问题。


### 3.4. 逆优化(Deoptimization)

虽然 C2 编译后是高度优化的本地代码, 一般会长时间留存, 但有时候也可能会发生逆优化操作。 结果就是对应的代码回退到 JVM 解释模式。

逆优化发生的原因是编译器的乐观预期被打破, 例如, 如果收集到的分析信息, 与方法的实际行为不匹配时:

Even though C2 compiled code is highly optimized and long-lived, it can be deoptimized. As a result, the JVM would temporarily roll back to interpretation.

Deoptimization happens when the compiler’s optimistic assumptions are proven wrong — for example, when profile information does not match method behavior:

![](2)

In our example, once the hot path changes, the JVM deoptimizes the compiled and inlined code.

在这个例子中, 一旦热点路径发生改变, JVM 就会逆优化编译后的内连代码。





## 4. 编译级别(Compilation Levels)

JVM 内置了解释器, 以及2款JIT编译器, 共有5种可能的编译级别;

C1 可以在3种编译级别上操作, 互相之间的区别在于采样分析工作是否完成。


### 4.1. 级别0 - 解释后的代码

JVM启动之后，解释执行所有的Java代码。 在这个初始阶段, 性能一般比不上编译语言。

但是, JIT编译器在预热阶段之后启动，并在运行时编译热代码。

JIT编译器使用 级别0 期间收集的分析信息来执行优化。


### 4.2. 级别1 - C1简单编译的代码

在 Level 1 这个级别，JVM使用C1编译器编译代码，但不会采集任何分析信息。 JVM将级别1用于简单的方法。

由于很多方法没有什么复杂性，即时使用C2再编译一次也不会提升什么性能。

因此，JVM得出的结论是，采集分析信息也无法优化性能, 所以对应的分析信息也没有什么用处。


### 4.3. 级别2 - C1编译的受限代码

在 Level 2 级别，JVM使用C1编译器编译代码，并进行简单的采样分析。 

当C2队列满了，JVM就会使用这个级别。目标是尽快编译代码以提高性能。

稍后，JVM在 Level 3 级别重新编译代码，附带完整的采样分析。

最后，如果C2队列不再繁忙，JVM将在 Level 4 级别重新编译。


### 4.4. 级别3 - C1完全编译的代码

在 Level 3 级别，JVM使用 C1 编译出具有完整采样分析的代码。

级别3是默认编译路径的一部分。 

因此，除了简单的方法，或者编译器队列排满了, JVM在其他所有情况下都使用这个级别来编译。

JIT编译中最常见的场景, 是直接从解释后的代码(Level 0级） 跳到 Level 3 级别。


### 4.5. 级别4 - C2编译的代码

在 Level 4 这个级别，JVM使用C2编译代码，以获得最强的长期性能。

级别4也是默认编译路径的一部分。 除简单方法外, JVM用这个级别来编译其他的所有方法。

第4级代码被假定是完全优化后的代码，JVM将停止收集分析信息。

但是，也有可能会取消优化并将其回退至 Level 0 级别。


## 5. 编译器参数设置

Java 8 版本之后, 默认启用了分层编译。 除非有说得过去的特殊理由，否则不要禁用这个分层编译。


### 5.1. 禁用分层编译

通过设置  `–XX:-TieredCompilation` 减号标志, 来禁用分级编译。
用减号禁用这个标志时，JVM就不会在编译级别之间转换。
所以还需要选择使用的JIT编译器: C1, 还是C2。

如果没有明确指定，JVM将根据CPU特征来决定默认的JIT编译器。
对于多核处理器或64位虚拟机，JVM将选择C2。

如果要禁用C2, 只使用C1, 而不增加分析的性能损耗，可以传入启动参数 `-XX:TieredStopAtLevel=1`。

要完全禁用JIT编译器, 使用解释器来运行所有内容, 可以指定启动参数 `-Xint`。 当然, 禁用JIT编译器会对性能产生一些负面影响。

> 某些情况下, 比如程序代码中使用了复杂的泛型组合, 由于JIT优化可能会擦除泛型信息, 这时候可以尝试禁用分层编译或者JIT编译。

> 对于并发量很小的简单CRUD程序而言, 因为计算量在响应时间上的占比很小, 解释执行和编译执行的区别并不明显。


### 5.2. 设置各个层级编译的触发阈值(Threshold)

编译阈值(compile threshold), 是指在代码被编译之前, 方法调用需要到达的次数。 

在分层编译的情况下，可以为 `2~4` 的编译级别设置这些阈值。

例如，我们可以将 Tier4 的阈值降低到1万: `-XX:Tier4CompileThreshold=10000`。

`java -version` 是一个探测JVM参数很好用的手段。

例如, 我们可以带上  `-XX:+PrintFlagsFinal` 标志来运行 `java -version`, 检查某个Java版本上的默认阈值，


Java 8 版本的示例如下:

```sh
java -XX:+PrintFlagsFinal -version | grep Threshold

 intx BackEdgeThreshold                         = 100000    {pd product}
 intx BiasedLockingBulkRebiasThreshold          = 20        {product}
 intx BiasedLockingBulkRevokeThreshold          = 40        {product}
uintx CMSPrecleanThreshold                      = 1000      {product}
uintx CMSScheduleRemarkEdenSizeThreshold        = 2097152   {product}
uintx CMSWorkQueueDrainThreshold                = 10        {product}
uintx CMS_SweepTimerThresholdMillis             = 10        {product}
 intx CompileThreshold= 10000     {pd product}
 intx G1ConcRefinementThresholdStep             = 0         {product}
uintx G1SATBBufferEnqueueingThresholdPercent    = 60        {product}
uintx IncreaseFirstTierCompileThresholdAt       = 50        {product}
uintx InitialTenuringThreshold                  = 7         {product}
uintx LargePageHeapSizeThreshold                = 134217728 {product}
uintx MaxTenuringThreshold                      = 15        {product}
 intx MinInliningThreshold                      = 250       {product}
uintx PretenureSizeThreshold                    = 0         {product}
uintx ShenandoahAllocationThreshold             = 0         {product rw}
uintx ShenandoahFreeThreshold                   = 10        {product rw}
uintx ShenandoahFullGCThreshold                 = 3         {product rw}
uintx ShenandoahGarbageThreshold                = 60        {product rw}
uintx StringDeduplicationAgeThreshold           = 3         {product}
uintx ThresholdTolerance                        = 10        {product}
 intx Tier2BackEdgeThreshold                    = 0         {product}
 intx Tier2CompileThreshold                     = 0         {product}
 intx Tier3BackEdgeThreshold                    = 60000     {product}
 intx Tier3CompileThreshold                     = 2000      {product}
 intx Tier3InvocationThreshold                  = 200       {product}
 intx Tier3MinInvocationThreshold               = 100       {product}
 intx Tier4BackEdgeThreshold                    = 40000     {product}
 intx Tier4CompileThreshold                     = 15000     {product}
 intx Tier4InvocationThreshold                  = 5000      {product}
 intx Tier4MinInvocationThreshold               = 600       {product}

openjdk version "1.8.0_191"
OpenJDK Runtime Environment (build 1.8.0_191-b12)
OpenJDK 64-Bit Server VM (build 25.191-b12, mixed mode)
```

Java 11 版本的示例如下:

```sh
java -XX:+PrintFlagsFinal -version | grep Threshold

 intx BiasedLockingBulkRebiasThreshold         = 20              {product} {default}
 intx BiasedLockingBulkRevokeThreshold         = 40              {product} {default}
uintx CMSPrecleanThreshold                     = 1000            {product} {default}
size_t CMSScheduleRemarkEdenSizeThreshold      = 2097152         {product} {default}
uintx CMSWorkQueueDrainThreshold               = 10              {product} {default}
uintx CMS_SweepTimerThresholdMillis            = 10              {product} {default}
 intx CompileThreshold                         = 10000        {pd product} {default}
double CompileThresholdScaling                 = 1.000000        {product} {default}
size_t G1ConcRefinementThresholdStep           = 2               {product} {default}
uintx G1SATBBufferEnqueueingThresholdPercent   = 60              {product} {default}
uintx IncreaseFirstTierCompileThresholdAt      = 50              {product} {default}
uintx InitialTenuringThreshold                 = 7               {product} {default}
size_t LargePageHeapSizeThreshold              = 134217728       {product} {default}
uintx MaxTenuringThreshold                     = 15              {product} {default}
 intx MinInliningThreshold                     = 250             {product} {default}
size_t PretenureSizeThreshold                  = 0               {product} {default}
uintx StringDeduplicationAgeThreshold          = 3               {product} {default}
uintx ThresholdTolerance                       = 10              {product} {default}
 intx Tier2BackEdgeThreshold                   = 0               {product} {default}
 intx Tier2CompileThreshold                    = 0               {product} {default}
 intx Tier3AOTBackEdgeThreshold                = 120000          {product} {default}
 intx Tier3AOTCompileThreshold                 = 15000           {product} {default}
 intx Tier3AOTInvocationThreshold              = 10000           {product} {default}
 intx Tier3AOTMinInvocationThreshold           = 1000            {product} {default}
 intx Tier3BackEdgeThreshold                   = 60000           {product} {default}
 intx Tier3CompileThreshold                    = 2000            {product} {default}
 intx Tier3InvocationThreshold                 = 200             {product} {default}
 intx Tier3MinInvocationThreshold              = 100             {product} {default}
 intx Tier4BackEdgeThreshold                   = 40000           {product} {default}
 intx Tier4CompileThreshold                    = 15000           {product} {default}
 intx Tier4InvocationThreshold                 = 5000            {product} {default}
 intx Tier4MinInvocationThreshold              = 600             {product} {default}

java version "11.0.6" 2020-01-14 LTS
Java(TM) SE Runtime Environment 18.9 (build 11.0.6+8-LTS)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.6+8-LTS, mixed mode)
```

主要关注以下几个 `CompileThreshold` 标志:

```sh
java -XX:+PrintFlagsFinal -version | grep CompileThreshold
intx CompileThreshold = 10000
intx Tier2CompileThreshold = 0
intx Tier3CompileThreshold = 2000
intx Tier4CompileThreshold = 15000
```

需要注意参数 `Tier2CompileThreshold = 0`, 其所代表的含义是: 方法执行超过0次就会触发 Tier2 编译。

可以推断得知: 

> 如果启用了分层编译, 那么通用的编译阈值参数 `CompileThreshold = 10000` 不再生效。


## 6. 方法编译


方法编译(method compilation)的生命周期如下图所示:

![](3)

总体来说, 一个方法最初由 JVM 解释执行。 直到调用次数达到阈值 `Tier3CompileThreshold`。  
达到阈值后, JVM就会使用C1编译器来编译该方法, 同时继续采集分析信息。
当方法调用次数达到 `Tier4CompileThreshold` 时， JVM使用C2编译器来编译该方法。

当然，JVM有可能会取消 C2编译器对代码的优化。 那么这个过程可能就会重复。



## 7. 小结

本文简要介绍了 JVM 中的分层编译技术。 

包括两种类型的JIT编译器, 以及分层编译技术如何组合使用他们, 以达成最佳实践。

还详细介绍了5种不同的编译级别, 以及相关的JVM调优参数。

最后是一个具体的案例, 通过分析编译日志, 深入学习了Java方法编译和优化的整个生命周期。

相关的示例代码, 请参考: <https://github.com/eugenp/tutorials/tree/master/core-java-modules/core-java-lang-4>



## 参考文档

- <https://www.baeldung.com/jvm-tiered-compilation>
