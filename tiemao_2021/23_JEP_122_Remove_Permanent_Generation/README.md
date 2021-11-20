# JEP 122: Remove the Permanent Generation

# JEP 122: 删除永久代(Remove the Permanent Generation)

```
Owner	Jon Masamitsu
Type	Feature
Scope	Implementation
Status	Closed / Delivered
Release	8
Component	hotspot / gc
Discussion	hostspot dash dev at openjdk dot java dot net
Effort	XL
Duration	XL
Blocks	JEP 156: G1 GC: Reduce need for full GCs
Reviewed by	Paul Hohensee
Endorsed by	Paul Hohensee
Created	2010/08/15 20:00
Updated	2014/08/06 14:14
Issue	8046112
```

> 相关链接:  [JEP 156: G1 GC: Reduce need for full GCs](http://openjdk.java.net/jeps/156)




## Summary

Remove the permanent generation from the Hotspot JVM and thus the need to tune the size of the permanent generation.

## 1. 概述

从 Hotspot JVM 中删除永久代, 因此也就不再需要设置永久代的大小。


## Non-Goals

Extending Class Data Sharing to application classes. Reducing the memory needed for class metadata. Enabling asynchronous collection of class metadata.

## 2. 哪些不是本提案的目标

将Class的数据扩展并共享给应用程序类。 减少Java类的元数据(class metadata) 所需的内存。 允许class元数据的异步垃圾收集。


## Success Metrics

Class metadata, interned Strings and class static variables will be moved from the permanent generation to either the Java heap or native memory.

The code for the permanent generation in the Hotspot JVM will be removed.

Application startup and footprint will not regress more than 1% as measured by a yet-to-be-chosen set of benchmarks.


## 3. 成功指标

将类的元数据(Class metadata)、内联字符串(interned String), 以及类的静态变量(class static variable) 从永久代移到 Java堆或者本地内存(native memory)。

Hotspot JVM 源码中永久代相关的代码将被删除。

根据一组尚未选择的基准进行衡量，应用程序启动时间、占用的内存空间, 相比原来不得超过1%。


## Motivation

This is part of the JRockit and Hotspot convergence effort. JRockit customers do not need to configure the permanent generation (since JRockit does not have a permanent generation) and are accustomed to not configuring the permanent generation.

## 4. 动机

这是 JRockit 和 Hotspot 融合工作的一部分。 JRockit 客户不需要配置永久代（因为JRockit 没有永久代）, 而且他们并不习惯配置永久代。

## Description

Move part of the contents of the permanent generation in Hotspot to the Java heap and the remainder to native memory.

Hotspot's representation of Java classes (referred to here as class meta-data) is currently stored in a portion of the Java heap referred to as the permanent generation. In addition, interned Strings and class static variables are stored in the permanent generation. The permanent generation is managed by Hotspot and must have enough room for all the class meta-data, interned Strings and class statics used by the Java application. Class metadata and statics are allocated in the permanent generation when a class is loaded and are garbage collected from the permanent generation when the class is unloaded. Interned Strings are also garbage collected when the permanent generation is GC'ed.

The proposed implementation will allocate class meta-data in native memory and move interned Strings and class statics to the Java heap. Hotspot will explicitly allocate and free the native memory for the class meta-data. Allocation of new class meta-data would be limited by the amount of available native memory rather than fixed by the value of -XX:MaxPermSize, whether the default or specified on the command line.

Allocation of native memory for class meta-data will be done in blocks of a size large enough to fit multiple pieces of class meta-data. Each block will be associated with a class loader and all class meta-data loaded by that class loader will be allocated by Hotspot from the block for that class loader. Additional blocks will be allocated for a class loader as needed. The block sizes will vary depending on the behavior of the application. The sizes will be chosen so as to limit internal and external fragmentation. Freeing the space for the class meta-data would be done when the class loader dies by freeing all the blocks associated with the class loader. Class meta-data will not be moved during the life of the class.

## 5. 方案描述

将 Hotspot 中一部分永久代的内容移到 Java堆，其余部分移到本地内存(native memory)。

Hotspot 中代表 Java 类的部分（在此称为类的元数据）, 目前存储在 Java 堆的一部分，称为永久代。 此外，内联字符串和类的静态变量也存储在永久代中。 永久代由 Hotspot 管理，而且必须为 Java 程序使用到的所有class元数据、内联字符串和类静态变量提供足够的空间。 类的元数据和静态数据在加载class时分配到永久代中，当class被卸载之后, 会被永久代的GC清理。 当GC处理永久代时，内联字符串也会被清理。

本提案的实现, 将在本地内存中分配空间来保存class元数据，并将内联字符串和类静态数据移动到 Java 堆。 Hotspot 将为类的元数据显式地分配和释放本地内存。新类的元数据分配将受到本地可用内存的限制， 而不是由 -XX:MaxPermSize 的值限制，无论是默认的还是在命令行上指定的这个值。

class元数据的本地内存分配将在大小足以容纳多个class元数据的块中完成。 每个块都与一个类加载器(class loader)相关联，并且该类加载器加载的所有class元数据将由 Hotspot 从对应的块中分配。 根据需要也可以为类加载器分配额外的块。 块的大小将根据应用程序的行为而变化。 将选择大小以限制内部和外部碎片。 当类加载器死掉时，通过释放与类加载器关联的所有块，也就释放了class元数据的空间。 在类的生命周期内不会移动类的元数据。


## Alternatives

The goal of removing the need for sizing the permanent generation can be met by having a permanent generation that can grow. There are additional data structures that would have to grow with the permanent generation (such as the card table and block offset table). For an efficient implementation the permanent generation would need to look like one contiguous space with some parts that are not usable.

## 6. 备选方案

去除需要配置永久代大小的需求目标, 也可以通过自动增长的永久代来实现。 还有一些额外的数据结构也必须随着永久代的增长而增长, 比如卡表(card table)和块偏移表(block offset table)。 为了有效实现，永久代需要看起来像一块连续的地址空间，其中包含一些不可用的部分。


## Testing

Changes in native memory usage will need to be monitored during testing to look for memory leaks.

## 7. 测试

在测试期间需要监控本地内存(native memory)使用情况的变化, 以排查内存泄漏(memory leak)。


## Risks and Assumptions

The scope of the changes to the Hotspot JVM is the primary risk. Also identifying exactly what needs to be changed will likely only be determined during the implementation.

This is a large project that affects all the garbage collectors extensively. Knowledge of the permanent generation and how it works exists in both the runtime and compiler parts of the hotspot JVM. Data structures outside of the garbage collectors will be changed to facilitate the garbage collector's processing of the class meta-data in native memory.

Some parts of the JVM will likely have to be reimplemented as part of this project. As an example class data sharing will be affected and may require reimplementation in whole or in part.

Class redefinition is an area of risk. Redefinition relies on the garbage collection of class meta-data during the collection of the permanent generation (i.e., redefinition does not currently free classes that have been redefined so some means will be necessary to discover when the meta-data for classes that have been redefined can be freed).

Moving interned Strings and class statics to the Java heap may result in an Out-of-memory exception or an increase in the number of GCs. Some adjustment of -Xmx by a user may be needed.

With the UseCompressedOops option pointers to class meta-data (in the permanent generation) can be compressed in the same way as pointers into the Java heap. This yields a significant performance improvement (on the order of a few percent). Pointers to meta-data in native memory will be compressed in a similar manner but with a different implementation. This latter implementation may not be as high performance as compressing the pointers into the Java heap. The requirements of compressing the pointers to meta-data may put an upper limit on the size of the meta-data. For example if the implementation required all meta-data to be allocated below some address (for example below the 4g limit) that would limit the size of the meta-data.

## 8. 风险和假定

Hotspot JVM 的更改范围是最主要的风险。 此外，准确确定需要更改的内容很可能只有在实现期间才能确定。

这是一个对所有垃圾收集器都会产生广泛影响的大型项目。 永久代及其工作方式的知识存在于hotspot JVM 的运行时和编译器部分。 垃圾收集器外部的数据结构将被更改，以方便垃圾收集器处理本地内存中的class元数据。

作为该项目的一部分，JVM 的某些部分可能需要重新实现。 例如，类数据共享将受到影响，可能需要全部或部分重新实现。

类的重定义是一个风险点。 重定义依赖于永久代垃圾收集期间class元数据的垃圾收集（即，重定义不会释放当前已重新定义的类，因此需要某种方法来确定已重定义的类的元数据何时可以释放）。

将内联字符串和类静态变量移动到 Java 堆中, 可能会导致OOM异常或 GC 数量增加。 用户可能需要对 `-Xmx` 进行一些调整。

使用 UseCompressedOops 选项，指向（永久代中）class元数据的指针可以和指向 Java 堆的指针相同的方式进行压缩。 这产生了显着的性能改进（大约几个百分点）。 指向本地内存中元数据的指针将以类似的方式压缩，但实现方式不同。 后一种实现的性能可能不如将指针压缩到 Java 堆中那样高效。 压缩指向元数据的指针, 可能要求对元数据的大小设置上限。 例如，如果实现要求将所有元数据分配到某个地址空间以内（例如小于 4g），这将限制元数据的大小。

## Dependences

Tools that know about the permanent generation will need to be reimplemented. The serviceability agent, jconsole, Java VisualVM and jhat are examples of tools that will be affected.

## 9. 相关依赖

展示或者监控永久代相关的工具,需要重新实现。 受到影响的工具包括: 服务能力代理(serviceability agent)、jconsole、Java VisualVM 和 jhat 等等。


## Impact

Other JDK components: Tools that have knowledge of the permanent generation.

Compatibility: Command line flags relating to the permanent generation will become obsolete.

Documentation: References to the permanent generation will need to be removed.

## 10. 影响范围

- 其他JDK组件: 展示或者监控永久代相关的工具。

- 兼容性: 与永久代相关的命令行参数将过时。

- 文档: 需要删除与永久代相关的链接。


## 11. 相关链接

- JEP 122 规范官方文档英文版: http://openjdk.java.net/jeps/122
- [JEP 156: G1 GC: Reduce need for full GCs](http://openjdk.java.net/jeps/156)
- OpenJDK的源码仓库: https://github.com/openjdk/jdk
