# Guava简介

## 简介

Guava, 是Google开发的一款Java语言版的核心库。英文是: `Google Core Libraries for Java`。 

> Guava的读音类似于 [`瓜娃`], Java的读音则类似于 [`加瓦`];

官方项目地址为: <https://github.com/google/guava>

根据官方介绍:

> Guava is a set of core libraries that includes new collection types (such as multimap and multiset), immutable collections, a graph library, functional types, an in-memory cache, and APIs/utilities for concurrency, I/O, hashing, primitives, reflection, string processing, and much more!

Guava是一款核心库, 包括: 

- 集合相关;
  * 方便的工具类, 如 Sets, Lists, Maps 等;
  * 新的集合类型, 如 `multimap`(一个Key可对应多个Value), `multiset`(可存在多个相等的Value); 
  * 不可变集合, immutable collections; 
  * 图数据结构, graph library, 注意不是图像处理;

- 函数类型, functional types;
- 内存缓存, in-memory cache;
- 并发相关的API/工具类, APIs/utilities for concurrency
- 其他类: 如 I/O, 哈希(hashing), 原生数据类型, 反射, 字符串处理, 注解 等等;

Guava有两个版本:

- JRE版, 支持JDK8及以上的Java版本;
- Android版, 支持安卓环境, 以及JDK1.7; 对应的源码路径多了一层 [/android](https://github.com/google/guava/tree/master/android);

## 引入

JRE版本,对应的Maven依赖是:

```
<!-- guava for JDK8: -->
<dependency>
  <groupId>com.google.guava</groupId>
  <artifactId>guava</artifactId>
  <version>27.0.1-jre</version>
</dependency>
```

Android版本的Maven依赖类似:

```
<!-- guava for Android: -->
<dependency>
  <groupId>com.google.guava</groupId>
  <artifactId>guava</artifactId>
  <version>27.0.1-android</version>
</dependency>
```

如果使用Gradle来构建, 则类似这样:

```
// JDK8:
dependencies {
  compile 'com.google.guava:guava:27.0.1-jre'
}
```

或者

```
// Android版:
dependencies {
  api 'com.google.guava:guava:27.0.1-android'
}
```

如果想下载 jar 文件, 请访问 mvnrepository 网站: <https://mvnrepository.com/artifact/com.google.guava/guava> ; 找到对应的版本下载即可。

下载的时候注意, guava在运行时还需要一个依赖: [failureaccess](https://mvnrepository.com/artifact/com.google.guava/failureaccess)


## 使用简介

官方的使用介绍, 英文版地址为: <https://github.com/google/guava/wiki>

其中的内容包括:

- 基础工具类: 让Java编程更方便.
  - [避免 null 值](https://github.com/google/guava/wiki/UsingAndAvoidingNullExplained): `null` 是指不明确的值, 可能会造成一些问题, `null`值判断在某些人看来呢又很别扭. Guava 相关的很多工具类, 在碰到 null 时都会迅速地失败并返回, 不再继续进行处理.
  - [条件预判 Preconditions](https://github.com/google/guava/wiki/PreconditionsExplained): 方便进行条件判定. 其中的工具方法会抛出异常, 使用时需要根据业务情况, 进行一些处理, 比如统一错误拦截, 以及日志输出判断, 否则就会输出一堆无意义的错误堆栈。
  - [object相关的通用方法](https://github.com/google/guava/wiki/CommonObjectUtilitiesExplained): `Object` 类中对应方法的简单实现, 比如 `hashCode()` 以及 `toString()`等.
  - [Ordering](https://github.com/google/guava/wiki/OrderingExplained):  "`Comparator`" 的流式实现.
  - [Throwables](https://github.com/google/guava/wiki/ThrowablesExplained): 对异常和错误进行简单的判断和处理.
- 集合相关的类: Guava对JDK的集合体系进行了扩充. 例如:
  - [不可变集合(Immutable collections)](https://github.com/google/guava/wiki/ImmutableCollectionsExplained), 适用于 防御式编程(defensive programming), 常量集合(constant collections), 以及需要提升性能的场景.
  - [新的集合类型](https://github.com/google/guava/wiki/NewCollectionTypesExplained), 主要是针对 JDK 没有提供的集合类型: 比如 multisets, multimaps, tables, bidirectional maps 等.
  - [增强的集合工具类](https://github.com/google/guava/wiki/CollectionUtilitiesExplained), 对 `java.util.Collections` 进行增强, 支持一些常见的操作.
  - [扩展工具类](https://github.com/google/guava/wiki/CollectionHelpersExplained): 想要对 `Collection` 进行装饰? 想要实现 `Iterator` 接口? 可以使用Guava.
- [图数据结构相关的类](https://github.com/google/guava/wiki/GraphsExplained): 支持图数据结构(graph-structured data)建模的库, 比如说, 实体和实体之间的关系. 主要包括: 
  * [Graph](https://github.com/google/guava/wiki/GraphsExplained#graph): 最简单的图结构, 边界节点没有明确的标识. 
  * [ValueGraph](https://github.com/google/guava/wiki/GraphsExplained#valuegraph): 有数值特征的图结构, 给定的边界, 具有相关的值(非唯一).
  * [Network](https://github.com/google/guava/wiki/GraphsExplained#network): 网状图, 每个节点都是唯一的. 支持可变/不可变图结构, 直接/非直接图结构, 以及其他属性.
- [缓存相关的类](https://github.com/google/guava/wiki/CachesExplained): 本地缓存, 以及相关的API操作, 过期策略支持.
- [Functional idioms](https://github.com/google/guava/wiki/FunctionalExplained): 合理使用, 不要滥用的话, Guava 提供的函数功能, 可以有效精简代码.
- 并发操作相关的类: 用来编写并发代码的抽象库,简单易用,功能强大.
  - [ListenableFuture](https://github.com/google/guava/wiki/ListenableFutureExplained): Futures, with callbacks when they are finished.
  - [Service](https://github.com/google/guava/wiki/ServiceExplained): Things that start up and shut down, taking care of the difficult state logic for you.
- [Strings](https://github.com/google/guava/wiki/StringsExplained): A few extremely useful string utilities: splitting, joining, padding, and more.
- [Primitives](https://github.com/google/guava/wiki/PrimitivesExplained): 支持JDK未提供的原生数据类型操作, 如 `int` 或者 `char` 之类, 以及无符号数据类型.
- [Ranges](https://github.com/google/guava/wiki/RangesExplained): 范围相关的API, 基于 `Comparable` 类型, 支持线性数据(continuous)和离散数据(discrete).
- [I/O](https://github.com/google/guava/wiki/IOExplained): Simplified I/O operations, especially on whole I/O streams and files, for Java 5 and 6.
- [哈希工具类](https://github.com/google/guava/wiki/HashingExplained): 比 `Object.hashCode()` 更精巧的哈希计算方法, 使用布隆过滤器(Bloom filters)算法.
- [事件总线(EventBus)](https://github.com/google/guava/wiki/EventBusExplained): 发布订阅模式(Publish-subscribe-style), 避免组件之间显式的依赖.
- [数学工具类](https://github.com/google/guava/wiki/MathExplained): 实现了JDK没有提供的数学计算方法.
- [反射工具类](https://github.com/google/guava/wiki/ReflectionExplained): 对反射机制提供支持.



## 相关链接: 

想要用好Guava, 下面的链接可能会提供帮助.

  - [Guava理念(Philosophy)介绍](https://github.com/google/guava/wiki/PhilosophyExplained): Guava 辨析以及设计目标.
  - [在项目构建中引入Guava](https://github.com/google/guava/wiki/UseGuavaInYourBuild), 比如 Maven, Gradle, 等等.
  - [用ProGuard实现精简定制](https://github.com/google/guava/wiki/UsingProGuardWithGuava), 可以选择只打包需要的部分.
  - [从 Apache Commons 迁移](https://github.com/google/guava/wiki/ApacheCommonCollectionsEquivalents), 将依赖 Apache Commons Collections 的代码, 迁移到使用Guava.
  - [兼容性(Compatibility)](https://github.com/google/guava/wiki/Compatibility), Guava 版本兼容性的简要介绍.
  - [Idea Graveyard](https://github.com/google/guava/wiki/IdeaGraveyard), 其中列出了Guava最终决定放弃支持的功能(feature requests).
  - [友情链接](https://github.com/google/guava/wiki/FriendsOfGuava), 其中列出了Guava项目组推荐和点赞的开源项目.
  - [如何参与项目](https://github.com/google/guava/wiki/HowToContribute), 介绍了帮助/支持/参与Guava项目的方式.

















日期: 2018年12月22日

作者: 铁锚 <https://blog.csdn.net/renfufei>



