# Java Objects Inside Out

# 从里到外认识Java对象

> Gory details you sometimes wondered about, but then did not really wanted to know about

> 有时你想知道, 但最终却不想知道的残酷的细节。

[TOC]

## 作者信息


- 作者: Aleksey Shipilёv, JVM/Performance Geek
- Twitter地址: [@shipilev](http://twitter.com/shipilev)
- 公开邮箱: `aleksey@shipilev.net`
- 校对人员: [Richard Startin](https://twitter.com/richardstartin), [Alex Blewitt](https://twitter.com/alblue), 等.


## 1. Introduction

It is a recurrent question how much memory does a Java object take. In the absence of accessible `sizeof` operator, people left to wonder about the footprint impact on their code and/or resort to urban legends and tales from the wizards. In this post, we shall try to peek inside the Java objects and see what lies beneath. Once we do this, many tricks around object footprint would become apparent, some of the runtime footprint quirks would be explained, and some low-level performance behavior would hopefully be more clear.

This post is rather long, so you might want to consider reading it in pieces. The chapters in this post should be more or less independent, and you can get back at reading them after leaving for a while. In contrast to other posts, it was not very thoroughly reviewed before posting, and it would be updated and fixed up as people read it and identify mistakes, omissions, or have more questions. Use and/or trust this at your own risk.

## 1. 简介

Java 对象占用多少内存是一个经常出现的问题。 
在没有 `sizeof` 运算符的情况下, 程序员想要知道自己写的代码对内存占用有多少影响, 很多时候只能求助于万能的魔法。 
在这篇文章中，我们将尝试窥探 Java 对象的内部，看看里面是什么。 
一旦我们了解了这些，围绕对象内存占用的许多技巧就会变得明显，一些运行时内存占用的奇怪问题就能说得清了，一些底层的性能优化行为也会更加清晰。

这篇文章相当长，因此您可以考虑分成多次阅读。 
本文中的章节, 或多或少应该都是独立的，你可以在之后的时间重新阅读。 
与其他文章相比，本文在发布之前没有经过非常彻底的审查，并且会随着读者的阅读和发现错误、遗漏或有更多问题而进行更新和修复。 
使用和/或信任本文的内容需要您自担风险。

> http://hg.openjdk.java.net/code-tools/jmh/rev/ee4b8b1f1523


## 2. Deeper Design and Implementation Questions (DDIQ)

In some sections, you might see the sidebars with more discussion about the design/implementation questions. These are not guaranteed to answer all the questions, but they do try to answer the most frequent ones. The answers there are based *on my understanding*, so it might be either inaccurate, incomplete, or both. If you wonder about something related to this post, send me an email, and maybe that would yield another DDIQ sidebar. Think about this as the "audience questions".

**DDIQ: Do we really need to read these sidebars?**

Not really. But they would probably give you better understanding why something is done that particular way. You might want to skip them on first read.

## 2. 更深入的设计与实现问题(DDIQ)

在某些章节中，你可能会看到一些讨论设计/实现问题的侧边栏。这些内容不保证能回答全部问题，但它们会尽量解答最常见的问题。其中的答案基于*我的个人理解*，所以可能不准确、不完整，或者两者兼有。如果你对与本文相关的某个问题感到疑惑，可以给我发邮件，说不定就能促成另一个 DDIQ 侧边栏。你可以把这理解为“读者提问”。

**DDIQ: 我们真的需要读这些侧边栏吗？**

不一定。但它们可能会让你更好地理解某个设计为什么要那样处理。第一遍阅读时，你或许可以跳过它们。

## 3. Methodology Considerations

This post assumes Hotspot JVM, the default JVM in OpenJDK and its derivatives. If you don’t know which JVM you are running, you most probably running Hotspot.

### 3.1. Tools

To do this properly, we need tools. When we acquire the tools, it is important to understand what tools can and cannot do.

1. Heap dumps. It might be enticing to dump the Java heap and inspect it. That seems to hinge on the belief that heap dump is a low-level representation of the runtime heap. But it unfortunately is not: it is a -lie- fantasy reconstructed (by GC itself, no less) from the actual Java heap. If you look at [HPROF data format](http://hg.openjdk.java.net/jdk6/jdk6/jdk/raw-file/tip/src/share/demo/jvmti/hprof/manual.html), you would see how high-level it actually is: it does not talk about field offsets, it does not tell anything about the headers directly, the only consolation is having the object size there, [which is also a lie](https://bugs.openjdk.java.net/browse/JDK-8005604). Heap dumps are great for inspecting the whole graphs of objects and their internal connectivity, but it is too coarse to inspect the objects themselves.
2. Measuring free or allocated memory via [MXBeans](https://docs.oracle.com/javase/7/docs/jre/api/management/extension/com/sun/management/ThreadMXBean.html). We can, of course, allocate multiple objects and see how much memory they took. With enough objects allocated, we can smooth out the outliers caused by TLAB allocation (and their retirement), spurious allocations in background threads, etc. This does not, however, give us any fidelity in looking into the object internals: we can only observe the apparent sizes of the objects. This is a fine way to do research, but you would need to properly formulate and test hypotheses to arrive to a sensible object model that explains every result.
3. Diagnostic JVM flags. But wait, since JVM itself is responsible for creating the objects, then surely it knows the object layout, and we *"only"* need to get it from there. [`-XX:+PrintFieldLayout`](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/runtime/globals.hpp#l765) would be our friend here. Unfortunately, that flag is only available in debug JVM versions.[[2](https://shipilev.net/jvm/objects-inside-out/#_footnotedef_2)]
4. Tools that poke into object internals. With some luck, taking `Class.getDeclaredFields` and asking for `Unsafe.objectFieldOffset` gives you the idea where the field resides. This runs into multiple caveats: first, it hacks into most classes with Reflection, which might be prohibited; second, `Unsafe.objectFieldOffset` does not formally answers the offset, but rather some "cookie" that can then be passed to other `Unsafe` methods.[[3](https://shipilev.net/jvm/objects-inside-out/#_footnotedef_3)] That said, it "usually works", so unless we do critically important things, it is fine to hack in. Some tools, notably [JOL](https://openjdk.java.net/projects/code-tools/jol/), do this for us.

In this post, we shall be using JOL, as we want to see the finer structure of Java objects. For our needs, we are good with JOL-CLI bundle, available here:

```
$ wget https://repo.maven.apache.org/maven2/org/openjdk/jol/jol-cli/0.10/jol-cli-0.10-full.jar -O jol-cli.jar
$ java -jar jol-cli.jar
Usage: jol-cli.jar <mode> [optional arguments]*

Available modes:
   internals: Show the object internals: field layout and default contents, object header
...
```

For object targets, we would try to use the various JDK classes themselves, where possible. This would make the whole thing easily verifiable, as you would only need the JOL CLI JAR and your favorite JDK installation to run the tests. In more complicated cases, we would go to [JOL Samples](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/) that cover some of the things here. As the last resort, we would be using the example classes.

|      | If you prefer something more hands-on, you can play with the entire collection of JOL Samples instead of reading this post ;) |
| ---- | ------------------------------------------------------------ |
|      | 如果你更喜欢动手实践，可以直接把 JOL Samples 全套示例玩一遍，而不用读这篇文章 ;) |

### 3.1. 工具

要把这件事做扎实，我们需要工具。在准备工具时，重要的是理解这些工具能做什么、不能做什么。

1. 堆转储(heap dump)。把 Java 堆导出再进行检查，看起来很有吸引力。这大概源于一种信念：堆转储是运行时堆的底层表示。但遗憾的是，它并不是：它是从实际 Java 堆中重建出来的（而且是由 GC 自己重建的）-谎言- 幻想。如果你去看 [HPROF data format](http://hg.openjdk.java.net/jdk6/jdk6/jdk/raw-file/tip/src/share/demo/jvmti/hprof/manual.html)，就会发现它实际上有多么高层：它不涉及字段偏移，也不直接说明任何对象头信息，唯一的安慰是里面有对象大小，而[那同样是个谎言](https://bugs.openjdk.java.net/browse/JDK-8005604)。堆转储非常适合查看整个对象图以及对象之间的引用关系，但用它来检查对象本身则太粗糙了。
2. 通过 [MXBeans](https://docs.oracle.com/javase/7/docs/jre/api/management/extension/com/sun/management/ThreadMXBean.html) 测量空闲内存或已分配内存。当然，我们可以分配多个对象，看看它们占用了多少内存。只要分配的对象足够多，就能抹平 TLAB 分配（以及 TLAB 退役）、后台线程中意外分配等带来的波动。不过这并不能让我们细致地观察对象内部：我们只能观察到对象表面上的大小。这是一种不错的研究方法，但你需要正确地提出并验证假设，才能得出一个能解释所有结果的合理对象模型。
3. JVM 诊断参数。不过等等，既然对象是 JVM 自己创建的，那它肯定知道对象布局，我们*“只需要”*把它取出来就行了。[`-XX:+PrintFieldLayout`](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/runtime/globals.hpp#l765) 本可以是我们的好帮手。遗憾的是，这个参数只在 debug 版本的 JVM 中可用。[[2](https://shipilev.net/jvm/objects-inside-out/#_footnotedef_2)]
4. 深入对象内部的工具。运气好的话，用 `Class.getDeclaredFields` 再配合 `Unsafe.objectFieldOffset`，就能大致知道某个字段位于何处。但这会遇到好几个坑：第一，它会用反射侵入大多数类，而反射可能被禁止；第二，`Unsafe.objectFieldOffset` 严格来说返回的并不是偏移量，而是一个“cookie”，需要再传给其它 `Unsafe` 方法使用。[[3](https://shipilev.net/jvm/objects-inside-out/#_footnotedef_3)] 话虽如此，它“通常都能用”，所以只要不是做关键重要的事情，用这种取巧手段也没问题。有些工具，尤其是 [JOL](https://openjdk.java.net/projects/code-tools/jol/)，已经替我们做好了这件事。

本文中我们将使用 JOL，因为我们需要看清 Java 对象更精细的结构。就我们的需求而言，JOL-CLI 工具包就够用了。

就研究对象而言，我们会尽量使用各种 JDK 自带的类。这样整个实验就很容易复现，因为你只需要 JOL CLI 的 JAR 包和任意一个你喜欢的 JDK 安装就能跑测试。在更复杂的情况下，我们会使用 [JOL Samples](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/)，那里涵盖了本文的部分内容。实在没办法时，我们才会用自己写的示例类。

### 3.2. JDKs

The most ubiquitous JDK version deployed in the world is still JDK 8. Therefore, we would be using it here as well, so that findings in this post would be immediately usable. There are no substantial changes in field layout strategies up until JDK 15, which we would talk in later sections. JDK classes layout *themselves* might change too, so we would still try to target classes that are the same in all JDKs. Additionally, we would need both x86_32 and x86_64 binaries at some point.

It is easier for me to just use my own binaries for this purpose:

```
$ curl https://builds.shipilev.net/openjdk-jdk8/openjdk-jdk8-latest-linux-x86_64-release.tar.xz | tar xJf -; mv j2sdk-image jdk8-64
$ curl https://builds.shipilev.net/openjdk-jdk8/openjdk-jdk8-latest-linux-x86-release.tar.xz    | tar xJf -; mv j2sdk-image jdk8-32
$ curl https://builds.shipilev.net/openjdk-jdk/openjdk-jdk-latest-linux-x86_64-release.tar.xz   | tar xJf -; mv jdk jdk15-64

$ jdk8-64/bin/java -version
openjdk version "1.8.0-builds.shipilev.net-openjdk-jdk8-b51-20200410"
OpenJDK Runtime Environment (build 1.8.0-builds.shipilev.net-openjdk-jdk8-b51-20200410-b51)
OpenJDK 64-Bit Server VM (build 25.71-b51, mixed mode)

$ jdk8-32/bin/java -version
openjdk version "1.8.0-builds.shipilev.net-openjdk-jdk8-b51-20200410"
OpenJDK Runtime Environment (build 1.8.0-builds.shipilev.net-openjdk-jdk8-b51-20200410-b51)
OpenJDK Server VM (build 25.71-b51, mixed mode)

$ jdk15-64/bin/java -version
openjdk version "15-testing" 2020-09-15
OpenJDK Runtime Environment (build 15-testing+0-builds.shipilev.net-openjdk-jdk-b1214-20200410)
OpenJDK 64-Bit Server VM (build 15-testing+0-builds.shipilev.net-openjdk-jdk-b1214-20200410, mixed mode, sharing)
```

### 3.2. JDK 版本

目前世界上部署最广泛的 JDK 版本仍然是 JDK 8。因此本文也使用 JDK 8，这样文中的结论可以立即派上用场。在 JDK 15 之前，字段布局策略没有实质性变化，我们会在后面的章节讨论这一点。JDK 中类*自身*的布局也可能发生变化，所以我们仍然尽量选择在所有 JDK 中都相同的类作为研究对象。此外，我们有时还需要 x86_32 和 x86_64 两种架构的二进制版本。

对我来说，直接用我自己编译的二进制版本来做这件事更方便。

## 4. Data Types And Their Representation

We need to start with some basics. In just about every JOL "internals" run, you would see this output (it would be omitted in future invocations for brevity):

```
$ jdk8-64/bin/java -jar jol-cli.jar internals java.lang.Object
...
# Field sizes by type: 4, 1, 1, 2, 2, 4, 4, 8, 8 [bytes]
# Array element sizes: 4, 1, 1, 2, 2, 4, 4, 8, 8 [bytes]
```

It means that Java references take 4 bytes ([compressed references](https://shipilev.net/jvm/anatomy-quarks/23-compressed-references/) enabled), `boolean`/`byte` take 1 byte, `char`/`short` take 2 bytes, `int`/`float` take 4 bytes, `double`/`long` take 8 bytes. They take the same space when presented as array elements.

Why does it matter? It matters because Java Language Specification does not say anything about the data representation, it only says what values those types accept. It is possible, in principle, to allocate 8 bytes for all primitives, as long as math over them follows the specification. In current Hotspot, almost all data types match their value domain exactly, except for `boolean`. `int`, for example, is specified to support values from `-2147483648` to `2147483647`, which fits 4 byte signed representation exactly.

As said above, there is one oddity, and that is `boolean`. In principle, its value domain contains only two values: `true` and `false`, so it can be represented with 1 bit. All `boolean` fields and array elements still take 1 full byte, and that is for two reasons: Java Memory Model guarantees the [absence of word tearing](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.6) for invididual fields/elements, which is hard to do with 1-bit boolean fields, and field offsets are addressed as memory, that is in *bytes*, which makes addressing `boolean` fields awkward. So, taking 1 byte per `boolean` is a practical compromise here.

**DDIQ: But what would it cost to make 1-bit boolean fields/elements anyway?**

On most modern hardware there is no access atomicity for accessing single bits. It is not very problematic for reads, where we can read the entire byte and then mask-shift the bits we want. But it is very problematic *for writes*, where the writes to adjacent `boolean` fields should not overwrite one another ("the absence of word tearing"). In other words, these two threads cannot do full byte stores:

```
Thread 1:
 mov %r1, (loc)  # read the entire byte
 or %r1, 0x01    # set the 1-st bit
 mov (loc), %r1  # write the byte back

Thread 2:
 mov %r2, (loc)  # read the entire byte
 or %r2, 0x10    # set the 2-nd bit
 mov (loc), %r2  # write the byte back
```

…because that would lose writes: one thread might not notice the write of the other one, and overwrite it, a big no-no. You could theoretically do it atomically like this:

```
Thread 1:
 lock or (loc), 0x01  # set the 1-st bit in-place

Thread 2:
 lock or (loc), 0x10  # set the 2-st bit in-place
```

…or do CAS loop on it, and that would work, but it would mean that a simple `boolean` store would have wildly different performance characteristics from the rest of the stores.

## 4. 数据类型及其表示

我们需要从一些基础知识讲起。几乎每次运行 JOL 的 “internals” 模式，你都会看到这样的输出（为了简洁，后面再调用时会省略它）：

它表示 Java 引用占 4 字节（启用了[压缩引用(compressed references)](https://shipilev.net/jvm/anatomy-quarks/23-compressed-references/)），`boolean`/`byte` 占 1 字节，`char`/`short` 占 2 字节，`int`/`float` 占 4 字节，`double`/`long` 占 8 字节。作为数组元素时，它们占用的空间相同。

这为什么重要？因为 Java 语言规范并没有对数据表示做任何规定，它只规定这些类型能接受哪些值。原则上，只要针对它们的运算符合规范，把所有基本类型都分配 8 字节也是可行的。在当前的 Hotspot 中，除了 `boolean` 之外，几乎所有数据类型都与其取值范围精确对应。以 `int` 为例，规范规定它支持从 `-2147483648` 到 `2147483647` 的值，这恰好能用 4 字节有符号表示容纳。

如上所述，这里有一个特例，就是 `boolean`。原则上它的取值范围只有两个值：`true` 和 `false`，所以用 1 个比特就能表示。但所有 `boolean` 字段和数组元素仍然占满 1 个字节，原因有两点：Java 内存模型保证单个字段/元素[不会出现字撕裂(word tearing)](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.6)，而这一点用 1 比特的 boolean 字段很难做到；另外字段偏移是按内存来寻址的，也就是以*字节*为单位，这让 `boolean` 字段的寻址变得别扭。所以，每个 `boolean` 占 1 字节是这里的一种实用折中。

**DDIQ: 那如果真把 boolean 字段/元素做成 1 比特，代价是什么？**

在大多数现代硬件上，访问单个比特不具备原子性。对读操作来说问题不大，我们可以先把整个字节读出来，再通过掩码移位取出想要的比特。但*对写操作*就很麻烦了，因为对相邻 `boolean` 字段的写入不能相互覆盖（“不会出现字撕裂”）。换句话说，下面这两个线程不能做整字节写入：

……因为那样会丢失写入：一个线程可能没有察觉到另一个线程的写入，然后把它覆盖掉，这是绝对不行的。理论上你可以像下面这样原子地操作：

……或者对它做 CAS 循环，这确实能行，但这就意味着一次简单的 `boolean` 存储，其性能特征会与其它类型的存储天差地别。

## 5. Mark Word

Moving on to the actual object structure. Let us start from the very basic example of `java.lang.Object`. JOL would print this:

```
$ jdk8-64/java -jar jol-cli.jar internals java.lang.Object
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 00 00 00 # Mark word
      4     4        (object header)              00 00 00 00 # Mark word
      8     4        (object header)              00 10 00 00 # (not mark word)
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

It shows that the first 12 bytes are the object header. Unfortunately, it does not resolve its internal structure in greater detail, so we need to dive into the Hotspot source code to figure this out. In there, you would notice the object header [consists of two parts](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/oop.hpp#l52): *mark word* and *class word*. Class word carries the information about the object’s type: it links to the native structure that describes the class. We will talk about that part in the next section. The rest of the metadata is carried in the [mark word](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/markWord.hpp#l33).

There are several uses for the mark word:

1. Storing the metadata (forwarding and object age) for moving GCs.
2. Storing the identity hash code.
3. Storing the locking information.

Note that every single object out there has to have a mark word, because it handles the things common to every Java object. This is also why it takes the very first slot in the object internal structure: VM needs to access it very fast on the time-sensitive code paths, for example STW GC. Understanding the use cases for mark word highlights the lower boundaries for the space it takes.

### 5.1. Storing Forwarding Data for Moving GCs

When GCs need to move the object, they need to record the new location for the object, at least temporarily. Mark word would encode this for GC code to coordinate the relocation and update-references work. This locks mark word to be as wide as the Java reference representation. Due to the way [compressed references](https://shipilev.net/jvm/anatomy-quarks/23-compressed-references/) are implemented in Hotspot, this reference is always uncompressed, so it is as wide as machine pointer.

This, in turn, defines the minimum amount of memory the mark word takes in that implementation: 4 bytes for 32-bit platforms, and 8 bytes for 64-bit platforms.

**DDIQ: Can we store the compressed reference in the mark word?**

Yes, we technically can. This, however, still runs into problems where we cannot encode the compressed reference on a very large heap or when compressed references are disabled. That could be handled with runtime checks, but then we would face checks on every object access by native GC code, which would be inconvenient. With some engineering, that could be mitigated too, but the cost/benefit trade-off is not in favor of doing this.

**DDIQ: Can we store the GC forwarding data somewhere else, not in mark word?**

Yes, we technically can use whatever slot in the object. This, however, has a major caveat: from GC perspective, not only you need to know where the object is forwarded, you *also* need to know if object is forwarded at all. Which means, you need to have the *special value* in target slot that tells you "no forwarding yet", and interpret other values as "forwarded to X". If we co-opt an arbitrary slot in the object, there is a chance that slot already has the value *looking like* "forwarded to X", and your GC breaks. You need something where you control the value set to avoid collisions likes. Early Shenandoah prototypes, for example, tagged class word slots for this, the experiment long scrapped. Final Shenandoah implementations use the same mark word as STW GCs.

You can also bite the bullet and store the forwarding information completely outside of heap, like ZGC does.

We cannot, unfortunately, show the mark words that carry GC forwardings from the Java application (and JOL is a Java application), because either we are running with stop-the-world GC and they are already gone by the time we unblock from the pause, or concurrent GC barriers prevent us from seeing the old objects.

### 5.1. 为移动式 GC 存储转发数据

当 GC 需要移动对象时，它必须至少临时记录对象的新地址。标记字会编码这一信息，供 GC 代码协调对象迁移和引用更新的工作。这就把标记字的宽度锁定为与 Java 引用的表示宽度相同。由于 Hotspot 中[压缩引用](https://shipilev.net/jvm/anatomy-quarks/23-compressed-references/)的实现方式，这个引用始终是未压缩的，因此它的宽度与机器指针相同。

这又决定了在这种实现里标记字占用的最小内存：32 位平台上是 4 字节，64 位平台上是 8 字节。

**DDIQ: 我们能把压缩引用存进标记字吗？**

技术上可以。不过，当堆非常大、或者压缩引用被禁用时，我们无法编码这个压缩引用，这仍然是个问题。这一点可以用运行时检查来处理，但这样一来，本地(native) GC 代码每次访问对象都要做检查，很不方便。通过一些工程手段也能缓解，但权衡成本与收益之后，并不值得这么做。

**DDIQ: 我们能不能把 GC 的转发数据存到别处，而不是放在标记字里？**

技术上可以，对象里的任何槽位都行。但有一个很大的坑：从 GC 的角度看，你不仅需要知道对象被转发到了哪里，*还*需要知道对象到底有没有被转发。这意味着目标槽位里必须有一个*特殊值*来表示“尚未转发”，并把其它值解释为“已转发到 X”。如果我们随意占用对象中的某个槽位，这个槽位有可能本来就带着*看起来像*“已转发到 X”的值，那你的 GC 就崩了。你需要一个能自己控制取值集合、以避免这类冲突的地方。例如早期的 Shenandoah 原型就给类字槽位打标记来做这件事，但这个实验很早就被废弃了。最终版 Shenandoah 实现使用的标记字与 STW GC 相同。

你也可以咬咬牙，像 ZGC 那样把转发信息完全存到堆外。

遗憾的是，我们无法从 Java 应用（JOL 就是一个 Java 应用）中展示携带 GC 转发信息的标记字，因为要么我们运行在 STW GC 下，等暂停结束、线程恢复运行时这些信息已经消失了；要么并发 GC 的屏障会阻止我们看到旧对象。

### 5.2. Storing Object Ages for GCs

We can, however, demonstrate the object age bits!

```
$ jdk8-32/bin/java -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_19_Promotion
# Running 32-bit HotSpot VM.

Fresh object is at d2d6c0f8
*** Move  1, object is at d31104a0
  (object header)  09 00 00 00 (00001001 00000000 00000000 00000000)
                                 ^^^^
*** Move  2, object is at d3398028
  (object header)  11 00 00 00 (00010001 00000000 00000000 00000000)
                                 ^^^^
*** Move  3, object is at d3109688
  (object header)  19 00 00 00 (00011001 00000000 00000000 00000000)
                                 ^^^^
*** Move  4, object is at d43c9250
  (object header)  21 00 00 00 (00100001 00000000 00000000 00000000)
                                 ^^^^
*** Move  5, object is at d41453f0
  (object header)  29 00 00 00 (00101001 00000000 00000000 00000000)
                                 ^^^^
*** Move  6, object is at d6350028
  (object header)  31 00 00 00 (00110001 00000000 00000000 00000000)
                                 ^^^^
*** Move  7, object is at a760b638
  (object header)  31 00 00 00 (00110001 00000000 00000000 00000000)
                                 ^^^^
```

Notice how with every move a few bits count upwards. That the recorded object age. It curiously stops at `6` after 7 moves. This fits the default setting for `InitialTenuringThreshold=7`. If you increase that, the object would experience more moves until it reaches the old generation.

### 5.2. 为 GC 存储对象年龄

不过，我们可以演示对象年龄位！

注意每次移动时，都有几个比特在向上计数。那就是记录下来的对象年龄。有意思的是，它在 7 次移动后停在了 `6`。这与默认设置 `InitialTenuringThreshold=7` 相符。如果你把这个值调大，对象在进入老年代之前会经历更多次移动。

### 5.3. Identity Hash Code

Every Java object has a [hash code](https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html#hashCode--). When there is no user definition for it, then [*identity hash code*](https://docs.oracle.com/javase/8/docs/api/java/lang/System.html#identityHashCode-java.lang.Object-) would be used.[[4](https://shipilev.net/jvm/objects-inside-out/#_footnotedef_4)] Since identity hash code should not change after computed for the given object, we need to store it somewhere. In Hotspot, it is stored right in the mark word of the target object. Depending on the precision that identity hash code accepts, it may require as much as 4 bytes to store. Since mark word is already at least 4 bytes long due to the reasons from the last section, the space is available.

**DDIQ: How does that work when we need to store GC forwarding data too?**

The answer is cunning: when GC moves the object, it actually deals with *two* copies of the object, one at old location, and one at new location. New object carries all the original headers. Old object is there only to serve GC needs, and therefore we can overwrite its header with GC metadata. This is how most (all?) stop-the-world GCs work in Hotspot, and this is how fully-concurrent Shenandoah GC [works](https://developers.redhat.com/blog/2019/06/28/shenandoah-gc-in-jdk-13-part-2-eliminating-the-forward-pointer-word/).

**DDIQ: Why do we need to store the identity hash code? How does this affect the user-specified hash code?**

Hash codes are supposed to have two properties: a) *good distribution*, meaning the values for distinct objects are more or less distinct; b) *idempotence*, meaning having the same hash code for the objects that have the same key object components. Note the latter implies that if object had not changed those key object components, its hash code should not change as well.

It is a frequent source of bugs to change the object in such a way that its `hashCode` changes after it was used. For example, adding the object to a `HashMap` as key, then changing its fields so that `hashCode` mutates as well would lead to surprising behaviors: the object might not be found in the map at all, because internal implementation would look in the "wrong" bucket. Likewise, it is a frequent source of performance anomalies to have badly distributed hash codes, for example returning a constant value.

For user-specified hash code, both properties are achieved by computing it over the set of user-selected fields. With enough variety of fields and field values, it would be well distributed, and by computing it over the unchanged (for example, `final`) fields we get idempotence. In this case, we don’t need to store the hash code anywhere. Some hash code implementations may choose to cache it in another field, but that is not required.

For identity hash code, there is no guarantee *there are* fields to compute the hash code from, and even if we have some, then it is unknown how stable those fields actually are. Consider `java.lang.Object` that does not have fields: what’s its hash code? Two allocated `Object`-s are pretty much the mirrors of each other: they have the same metadata, they have the same (that is, empty) contents. The only distinct thing about them is their allocated address, but even then there are two troubles. First, addresses have very low entropy, especially coming from a bump-ptr allocator like most Java GCs employ, so it is not well distributed. Second, GC *moves* the objects, so address is not idempotent. Returning a constant value is a no-go from performance standpoint.

So, current implementations compute the identity hash code from the internal PRNG ("good distribution"), and store it for every object ("idempotence").

The changes in markword caused by identity hash code can be seen clearly with the relevant [JOLSample_15_IdentityHashCode](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_15_IdentityHashCode.java#l41). Running it with 64-bit VM:

```
$ jdk8-64/bin/java -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_15_IdentityHashCode
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

**** Fresh object
org.openjdk.jol.samples.JOLSample_15_IdentityHashCode$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              88 55 0d 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

hashCode: 5ccddd20

**** After identityHashCode()
org.openjdk.jol.samples.JOLSample_15_IdentityHashCode$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 20 dd cd
      4     4        (object header)              5c 00 00 00
      8     4        (object header)              88 55 0d 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

Notice that the hash code value is `5ccddd20`. You can spot it in the object header now: `01 20 dd cd 5c`. `01` is the mark word tag, and the rest is the identity hash code written in little-endian. And we still have 3 bytes to spare! But that is possible since we have large-ish mark word. What happens if we run with 32-bit VM, where the entire mark word is just 4 bytes?

This is what happens:

```
$ jdk8-32/bin/java -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_15_IdentityHashCode
# Running 32-bit HotSpot VM.

**** Fresh object
org.openjdk.jol.samples.JOLSample_15_IdentityHashCode$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              c0 ab 6b a3
Instance size: 8 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total

hashCode: 12ddf17

**** After identityHashCode()
org.openjdk.jol.samples.JOLSample_15_IdentityHashCode$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              81 8b ef 96
      4     4        (object header)              c0 ab 6b a3
Instance size: 8 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

It is obvious that object header had changed. But it takes a keen eye to see where the `12ddf17` hashcode actually is. What you see in the header is identity hashcode shifted "right by one". So, one of the bits ends up in the first byte, yielding `81`, and the rest transforms into `12ddf17 >> 1 = 96ef8b`. Notice that it reduces the *domain* for identity hash code from 32 bits to "just" 25 bits.

**DDIQ: But wait, `System.identityHashCode` is `int`, so we expect full 32-bit hashcode?**

The range for `identityHashCode` is deliberately unspecified to enable this kind of trade-off. Putting the entire 32 bit identity hash code in 32-bit mode would require adding another word per object, which would be problematic for footprint. The implementation is free to cut the hashcode storage down to fit most of the bits of it. That, unfortunately, comes as yet another corner case when comparing 32-bit and 64-bit executions of seemingly the same Java code.

### 5.3. 身份哈希码(Identity Hash Code)

每个 Java 对象都有一个[哈希码](https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html#hashCode--)。如果没有用户自定义的实现，就会使用[*身份哈希码*(identity hash code)](https://docs.oracle.com/javase/8/docs/api/java/lang/System.html#identityHashCode-java.lang.Object-)。[[4](https://shipilev.net/jvm/objects-inside-out/#_footnotedef_4)] 由于身份哈希码一旦针对某个对象计算出来就不应再改变，我们必须把它存到某处。在 Hotspot 中，它就存在目标对象的标记字里。视身份哈希码所接受的精度而定，最多需要 4 个字节来存储。由于上一节提到的原因，标记字本身至少已有 4 字节长，所以空间是现成的。

**DDIQ: 那当我们还需要存 GC 转发数据时，这怎么处理？**

答案很巧妙：当 GC 移动对象时，实际上会涉及对象的*两份*副本，一份在旧位置，一份在新位置。新对象携带全部原始头部信息。旧对象的存在只是为了满足 GC 的需要，因此我们可以用 GC 元数据覆盖它的头部。Hotspot 中大多数（也许是全部？）STW GC 都是这样工作的，完全并发的 Shenandoah GC 也是[这样](https://developers.redhat.com/blog/2019/06/28/shenandoah-gc-in-jdk-13-part-2-eliminating-the-forward-pointer-word/)做的。

**DDIQ: 为什么需要存储身份哈希码？这对用户自定义的哈希码有什么影响？**

哈希码应当具备两个性质：a) *良好的分布性*，即不同对象的取值大体上互不相同；b) *幂等性*，即拥有相同关键对象组件的对象应具有相同的哈希码。注意后者意味着，如果对象没有改变那些关键组件，它的哈希码也不应改变。

在使用过对象之后又去修改它、导致其 `hashCode` 发生变化，是 bug 的常见来源。例如，把对象作为 key 放进 `HashMap`，然后又修改它的字段、让 `hashCode` 也跟着变，就会导致出人意料的行为：这个对象可能根本无法从 map 中找回来，因为内部实现会去“错误”的桶里查找。同样，哈希码分布不好（比如总是返回一个常量值）也是性能异常的常见原因。

对用户自定义的哈希码来说，这两个性质是通过在一组用户选定的字段上计算来实现的。只要字段和字段值足够多样，分布就会很好；而在不变的（例如 `final` 的）字段上计算，就得到了幂等性。这种情况下，我们不需要把哈希码存到任何地方。有些哈希码实现可能会选择把它缓存到另一个字段中，但并非必须。

对身份哈希码来说，无法保证*一定存在*可用于计算哈希码的字段；即便有，这些字段有多稳定也无从得知。想想没有字段的 `java.lang.Object`：它的哈希码是什么？两个分配出来的 `Object` 实例几乎互为镜像：元数据相同，内容也相同（都是空的）。它们唯一不同的地方是分配地址，但即便如此也有两个麻烦。第一，地址的熵非常低，尤其是来自大多数 Java GC 所采用的 bump-ptr 分配器时更是如此，所以分布不好。第二，GC 会*移动*对象，所以地址不具备幂等性。而从性能角度看，返回常量值又是绝对不行的。

所以，当前实现会从内部 PRNG 计算出身份哈希码（“良好的分布性”），并为每个对象存储它（“幂等性”）。

身份哈希码对标记字造成的改变，在相关的 [JOLSample_15_IdentityHashCode](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_15_IdentityHashCode.java#l41) 示例中可以清楚地看到。用 64 位 VM 运行它：

注意哈希码的值是 `5ccddd20`。现在你可以在对象头里找到它：`01 20 dd cd 5c`。`01` 是标记字的 tag，其余部分是以小端序写入的身份哈希码。我们还剩下 3 个字节没用！但这之所以可行，是因为我们的标记字相对较大。如果换成 32 位 VM，整个标记字只有 4 字节，又会怎样呢？

情况是这样的：

对象头显然发生了变化。但要一眼看出 `12ddf17` 这个哈希码到底在哪，还是需要点眼力。你在对象头里看到的，是把身份哈希码右移一位后的结果。于是其中一个比特落到了第一个字节里，得到 `81`，其余部分则变成 `12ddf17 >> 1 = 96ef8b`。注意，这把身份哈希码的*取值范围*从 32 比特压缩到了“区区”25 比特。

**DDIQ: 等等，`System.identityHashCode` 返回的是 `int`，那我们应该能拿到完整的 32 位哈希码？**

`identityHashCode` 的取值范围被有意规定为未指定，就是为了能做这类取舍。要在 32 位模式下放下完整的 32 位身份哈希码，每个对象就得多加一个字，这对内存占用来说是个问题。实现可以自由地压缩哈希码的存储空间，只放得下它的大部分比特即可。遗憾的是，这让“看似相同”的 Java 代码在 32 位与 64 位下执行时又多了一个差异点。

### 5.4. Locking Data

Java synchronization employs a [sophisticated state machine](https://wiki.openjdk.java.net/display/HotSpot/Synchronization). Since every Java object can be synchronized on, the locking state should be associated with any Java object. Mark word holds most of that state.

Different parts of those locking transitions could be seen in object header. For example, when a Java lock is *biased* towards a particular thread, we need to record the information about that lock near the relevant object. This is captured by the relevant [JOLSample_13_BiasedLocking](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_13_BiasedLocking.java#l41) example:

```
$ jdk8-64/bin/java -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_13_BiasedLocking
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

**** Fresh object
org.openjdk.jol.samples.JOLSample_13_BiasedLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 00 00 00  # No lock
      4     4        (object header)              00 00 00 00
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** With the lock
org.openjdk.jol.samples.JOLSample_13_BiasedLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 b0 00 80  # Biased lock
      4     4        (object header)              b8 7f 00 00  # Biased lock
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** After the lock
org.openjdk.jol.samples.JOLSample_13_BiasedLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 b0 00 80 # Biased lock
      4     4        (object header)              b8 7f 00 00 # Biased lock
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

Note how we recorded the native pointer to the lock descriptor in the header: `b0 00 80 b8 7f`. That lock is now biased towards the thread pointed to that native pointer.

Similar thing happens when we lock without the bias, see [JOLSample_14_FatLocking](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_14_FatLocking.java#l41) example:

```
$ jdk8-64/bin/java -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_14_FatLocking
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

**** Fresh object
org.openjdk.jol.samples.JOLSample_14_FatLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # No lock
      4     4        (object header)              00 00 00 00
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** Before the lock
org.openjdk.jol.samples.JOLSample_14_FatLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              78 19 57 1a  # Lightweight lock
      4     4        (object header)              85 7f 00 00
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** With the lock
org.openjdk.jol.samples.JOLSample_14_FatLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              0a 4b 00 b4  # Heavyweight lock
      4     4        (object header)              84 7f 00 00
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** After the lock
org.openjdk.jol.samples.JOLSample_14_FatLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              0a 4b 00 b4  # Heavyweight lock
      4     4        (object header)              84 7f 00 00
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** After System.gc()
org.openjdk.jol.samples.JOLSample_14_FatLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              09 00 00 00  # Lock recycled
      4     4        (object header)              00 00 00 00
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

Here, we see the usual lifecycle for the lock: first object has no lock recorded, then it is acquired by other thread and (lightweight) synchronization lock is installed, then main thread contends on it, inflating it, then locking information still references the inflated lock after everyone had unlocked. And finally, at some later point the lock is deflated, and object frees its association with it.

### 5.4. 锁信息

Java 的同步机制采用了一套[复杂的状态机](https://wiki.openjdk.java.net/display/HotSpot/Synchronization)。由于每个 Java 对象都可以被 synchronized，所以锁状态必须与任意 Java 对象相关联。标记字保存了其中大部分状态。

这些加锁状态转换的不同阶段，都能在对象头中看到。例如，当某个 Java 锁*偏向*某个特定线程时，我们需要把该锁的信息记录在相关对象附近。相关的 [JOLSample_13_BiasedLocking](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_13_BiasedLocking.java#l41) 示例展示了这一点：

注意我们是如何把指向锁描述符的本地(native)指针记录在对象头里的：`b0 00 80 b8 7f`。现在这个锁偏向于该本地指针所指向的线程。

当我们不使用偏向锁加锁时，也会发生类似的情况，参见 [JOLSample_14_FatLocking](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_14_FatLocking.java#l41) 示例：

这里我们看到锁的常见生命周期：起初对象没有记录任何锁，随后它被另一个线程获取，安装上（轻量级）同步锁；接着主线程对它产生竞争，把它膨胀(inflate)；然后即使所有线程都解锁了，锁信息仍然引用着膨胀后的锁。最后，在稍后的某个时刻锁被收缩(deflate)，对象也就解除了与它的关联。

### 5.5. Observation: Identity Hashcode Disables Biased Locking

But what if we need to store identity hashcode while biased locking is in effect? Simple: identity hashcode takes precedence, and biased locking gets disabled for that object/class. This can be seen with the relevant example, [JOLSample_26_IHC_BL_Conflict](http://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_26_IHC_BL_Conflict.java):

```
$ jdk8-64/bin/java -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_26_IHC_BL_Conflict
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

**** Fresh object
org.openjdk.jol.samples.JOLSample_26_IHC_BL_Conflict$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 00 00 00  # No lock
      4     4        (object header)              00 00 00 00
      8     4        (object header)              f8 00 01 f8
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** With the lock
org.openjdk.jol.samples.JOLSample_26_IHC_BL_Conflict$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 b0 00 20  # Biased lock
      4     4        (object header)              e5 7f 00 00  # Biased lock
      8     4        (object header)              f8 00 01 f8
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** After the lock
org.openjdk.jol.samples.JOLSample_26_IHC_BL_Conflict$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 b0 00 20  # Biased lock
      4     4        (object header)              e5 7f 00 00  # Biased lock
      8     4        (object header)              f8 00 01 f8
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

hashCode: 65ae6ba4

**** After the hashcode
org.openjdk.jol.samples.JOLSample_26_IHC_BL_Conflict$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 a4 6b ae  # Hashcode
      4     4        (object header)              65 00 00 00  # Hashcode
      8     4        (object header)              f8 00 01 f8
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** With the second lock
org.openjdk.jol.samples.JOLSample_26_IHC_BL_Conflict$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              50 f9 b8 29  # Lightweight lock
      4     4        (object header)              e5 7f 00 00  # Lightweight lock
      8     4        (object header)              f8 00 01 f8
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** After the second lock
org.openjdk.jol.samples.JOLSample_26_IHC_BL_Conflict$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 a4 6b ae  # Hashcode
      4     4        (object header)              65 00 00 00  # Hashcode
      8     4        (object header)              f8 00 01 f8
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

In this example, biased locking works on a fresh object, but the moment we ask its `hashCode`, we end up computing its identity hash code (since there is no override for `Object.hashCode`), which installs the computed value in the mark word. Subsequent locks could only displace the identity hash code value temporarily, but it would be there as soon as (non-biased) locking is released. Since there is no way to store biased locking information in mark word anymore, it does not work for that object from this moment on.

**DDIQ: Would this kind of conflict affect only that one instance?**

Not necessarily. The underlying problem is that unbias is rather costly, so biased locking machinery would try to minimize the rebias frequency. If the machinery detects that some unbiases are very frequent, it may decide that the entire class of objects [should be rebiased](http://hg.openjdk.java.net/jdk/jdk/file/9a81c0a34bd0/src/hotspot/share/runtime/globals.hpp#l794), or [cannot be biased](http://hg.openjdk.java.net/jdk/jdk/file/9a81c0a34bd0/src/hotspot/share/runtime/globals.hpp#l800) at all in the future.

### 5.5. 观察：身份哈希码会禁用偏向锁

但如果偏向锁正在生效，我们又需要存储身份哈希码，该怎么办？很简单：身份哈希码优先，该对象/该类的偏向锁会被禁用。相关的 [JOLSample_26_IHC_BL_Conflict](http://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_26_IHC_BL_Conflict.java) 示例展示了这一点：

在这个例子中，偏向锁对新建对象是有效的；但当我们调用它的 `hashCode` 时，就会计算它的身份哈希码（因为 `Object.hashCode` 没有被重写），并把算出的值写入标记字。后续的加锁只能暂时把身份哈希码挪开，一旦（非偏向的）锁释放，它又会回到那里。由于此时已经没有办法在标记字里存放偏向锁信息了，从这一刻起，该对象的偏向锁就失效了。

**DDIQ: 这种冲突只会影响那一个实例吗？**

不一定。根本问题在于撤销偏向(unbias)的代价相当高，所以偏向锁机制会尽量降低重新偏向(rebias)的频率。如果这套机制检测到某些撤销偏向操作非常频繁，它可能会决定整个类别的对象都[应该被重新偏向](http://hg.openjdk.java.net/jdk/jdk/file/9a81c0a34bd0/src/hotspot/share/runtime/globals.hpp#l794)，或者今后[根本无法使用偏向锁](http://hg.openjdk.java.net/jdk/jdk/file/9a81c0a34bd0/src/hotspot/share/runtime/globals.hpp#l800)。

### 5.6. Observation: 32-bit VMs Improve Footprint

Since mark word size depends on target bitness, it is conceivable that 32-bit VMs take less space per object, *even without (reference) fields involved*. This can be demonstrated by inspecting the plain `Object` layout on 32-bit and 64-bit VMs:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals java.lang.Object
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              00 10 00 00  # Class word (compressed)
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
$ jdk8-32/bin/java -jar jol-cli.jar internals java.lang.Object
# Running 32-bit HotSpot VM.

Instantiated the sample instance via default constructor.

java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              48 51 2b a3  # Class word
Instance size: 8 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

Here, 64-bit VM mark word takes 8 (mark word) + 4 (class word) = 12 bytes, whereas 32-bit VM takes 4 (mark word) and + 4 (class word) = 8 bytes, respectively. With object alignment by 8 bytes, these get rounded up to 16 and 8 bytes, respectively. On this small object, the space savings are 2x!

### 5.6. 观察：32 位 VM 能改善内存占用

由于标记字的大小取决于目标平台的位数，可以想见 32 位 VM 下每个对象占用的空间更少，*甚至可以不含(引用)字段*。我们可以通过查看朴素的 `Object` 在 32 位和 64 位 VM 上的布局来演示这一点：

这里，64 位 VM 的标记字占用 8（标记字）+ 4（类字）= 12 字节，而 32 位 VM 则分别是 4（标记字）+ 4（类字）= 8 字节。在按 8 字节对齐对象之后，两者分别向上取整为 16 字节和 8 字节。对于这个小对象来说，空间节省达到了 2 倍！

## 6. Class Word

From the native machine perspective, every object is just a bunch of bytes. There are cases where we want to know what is the **type** of the object we are dealing with at runtime. The non-exhaustive list of cases where it is needed:

1. Runtime type checks.
2. Determining the object size.
3. Figuring out the target for virtual/interface call.

Class words can also be compressed. Even though class pointers are not Java heap references, they can still enjoy similar optimization.[[5](https://shipilev.net/jvm/objects-inside-out/#_footnotedef_5)]

### 6.1. Runtime Type Checks

Java is a type-safe language, so it needs runtime type checking on many paths. Class word carries the data about the actual type of the object we have, which allows compilers to emit *runtime type checks*. The efficiency of those runtime checks depend on the shape the type metadata takes.

If metadata is encoded in a simple form, compilers can even inline those checks straight in the code stream. In Hotspot, class word holds the [native pointer to the VM `Klass`](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/oop.hpp#l57) instance that carries lots of metainformation, including the [types of superclasses it extends, interfaces it implements](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/klass.hpp#l120), etc. It also carries the *Java mirror*, which is the [associated instance](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/klass.hpp#l138) of `java.lang.Class`. This indirection allows treating `java.lang.Class` instances as regular objects and move them without updating every single class word during the GC: `java.lang.Class` can move, while `Klass` stays at the same location all the time.

**DDIQ: So, is type-checking costly?**

In many cases, the type is known more or less precisely from the context. For example, in the method that accepts `MyClass` argument, we can be pretty sure that argument is `MyClass` or the subclass of it. So, on happy paths, we usually do not need the type checks. But, if that fails, we would have to emit the runtime checks that access that object metadata. The usual examples are [devirtualization](https://shipilev.net/blog/2015/black-magic-method-dispatch/#__strong_c2_dynamic_interface_ref_strong) and checked casts.

For example, the checked cast would look like this:

```
private Object o = new MyClass();

@CompilerControl(CompilerControl.Mode.DONT_INLINE)
@Benchmark
public MyClass testMethod() {
  return (MyClass)o;
}
 mov    0x10(%rsi),%rax       ; getfield "o"
 mov    0x8(%rax),%r10        ; get o.<classword>, Klass*
 movabs $0x7f5bc5144c48,%r11  ; load known Klass* for MyClass
 cmp    %r11,%r10             ; checked cast
 jne    0x00007f64004e1b63    ; not equal? go to slowpath, check subclasses there
 ... %rax is definitely MyClass now
```

**DDIQ: So, this can be exploited to write very efficient intrinics?**

Yes, in fact, `Object.getClass()` would be routinely intrinsified like this:

```
@CompilerControl(CompilerControl.Mode.DONT_INLINE)
@Benchmark
public Class<?> test() {
  return o.getClass();
}
  mov    0x10(%rsi),%r10    ; getfield "o"
  mov    0x8(%r10),%r10     ; get o.<classword>, Klass*
  mov    0x70(%r10),%r10    ; get Klass._java_mirror, OopHandle
  mov    (%r10),%rax        ; dereference OopHandle, get java.lang.Class
   ... %rax is now java.lang.Class instance
```

### 6.1. 运行时类型检查

Java 是一门类型安全的语言，因此在很多执行路径上都需要运行时类型检查。类字携带了对象实际类型的信息，这让编译器能够生成*运行时类型检查*。这些运行时检查的效率，取决于类型元数据以什么形态存在。

如果元数据以简单的形式编码，编译器甚至可以把这些检查直接内联到代码流中。在 Hotspot 中，类字保存着[指向 VM `Klass` 实例的本地指针](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/oop.hpp#l57)，该实例携带大量元信息，包括[它所继承的父类和所实现的接口的类型](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/klass.hpp#l120)等等。它还携带 *Java mirror*，即 `java.lang.Class` 的[关联实例](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/klass.hpp#l138)。这种间接层使得 `java.lang.Class` 实例可以被当作普通对象对待，并且在 GC 期间移动它们时无需更新每一个类字：`java.lang.Class` 可以移动，而 `Klass` 始终待在原地不动。

**DDIQ: 那么，类型检查的代价高吗？**

很多情况下，类型可以从上下文中或多或少地精确推断出来。例如，在一个接受 `MyClass` 参数的方法里，我们基本可以确定该参数就是 `MyClass` 或它的子类。所以在顺利的路径上，通常并不需要类型检查。但如果推断失败，我们就不得不生成访问对象元数据的运行时检查。常见的例子有[去虚化(devirtualization)](https://shipilev.net/blog/2015/black-magic-method-dispatch/#__strong_c2_dynamic_interface_ref_strong)和带检查的类型转换。

例如，带检查的类型转换会像这样：

**DDIQ: 那么，这可以用来编写非常高效的 intrinsic 吗？**

可以，事实上 `Object.getClass()` 通常就会被这样内联为 intrinsic：

### 6.2. Determining The Object Size

Determining the object size takes the similar route. In contrast to the runtime type checks that do not know the type of the object statically all the time, allocation does know the size of the allocating object more or less precisely: it is defined by the type of constructor used, array initializer used, etc. So, in those cases, reaching through the classword is not needed.

But there are cases in the native code (most notably, garbage collectors) that want to walk [the parsable heap](https://shipilev.net/jvm/anatomy-quarks/5-tlabs-and-heap-parsability/) with code like:

```
HeapWord* cur = heap_start;
while (cur < heap_used) {
  object o = (object)cur;
  do_object(o);
  cur = cur + o->size();
}
```

For that to work, native code needs to know what the size of current (untyped!) object is, and hopefully know it fast. So, for native code, it does very much matter how class metadata is arranged. In Hotspot, we can reach through the class word to the [layout helper](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/klass.hpp#l89), that would give us information about object sizes.

**DDIQ: Are you saying garbage collectors touch more memory than the heap itself?**

Yes, Hotspot GCs [need to reach for class metadata](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/oop.inline.hpp#l185) to figure out object size. Most of the time they hit the same metadata over and over again, but that dependent memory read still costs quite a bit. The wonders of untyped native accesses! You can see that in native code disassembly, for example for `MutableSpace::object_iterate` [here](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/gc/parallel/mutableSpace.cpp#l228):

```
$ objdump -lrdSC ./build/linux-x86_64-server-release/hotspot/variant-server/libjvm/objs/mutableSpace.o
...
void MutableSpace::object_iterate(ObjectClosure* cl) {
...
#  HeapWord* p = bottom();
...
#  while (p < top()) {
...
# Klass* oopDesc::klass() const {
#  if (UseCompressedClassPointers) {
#    return CompressedKlassPointers::decode_not_null(_metadata._compressed_klass);
#  } else {
#    return _metadata._klass;
...
  d0:   49 8b 7e 08             mov    0x8(%r14),%rdi  ; get Klass*
#  int layout_helper() const            { return _layout_helper; }
  d4:   8b 4f 08                mov    0x8(%rdi),%ecx  ; get layout helper
#  if (lh > Klass::_lh_neutral_value) {
  d7:   83 f9 00                cmp    $0x0,%ecx
  da:   7e 4e                   jle    12a
#    if (!Klass::layout_helper_needs_slow_path(lh)) {
  dc:   f6 c1 01                test   $0x1,%cl        ; layout helper *is* size?
  df:   0f 85 9b 00 00 00       jne    180
#      s = lh >> LogHeapWordSize;  // deliver size scaled by wordSize
  e5:   89 c8                   mov    %ecx,%eax
  e7:   c1 f8 03                sar    $0x3,%eax       ; this is object size now
#    p += oop(p)->size();
  ea:   48 98                   cltq
  ec:   4d 8d 34 c6             lea    (%r14,%rax,8),%r14
  f0:   49 8b 44 24 38          mov    0x38(%r12),%rax
#  while (p < top()) {
...
#    cl->do_object(oop(p));
...
 103:   ff 10                   callq  *(%rax)
```

### 6.2. 确定对象大小

确定对象大小走的是类似的套路。与那些并非总能静态知道对象类型的运行时类型检查不同，分配时是或多或少精确知道所分配对象大小的：它由所用的构造函数类型、所用的数组初始化式等决定。因此在这些情况下，无需通过类字去获取。

但在本地代码中（最典型的是垃圾收集器）有些场景，需要像下面这样遍历[可解析的堆(the parsable heap)](https://shipilev.net/jvm/anatomy-quarks/5-tlabs-and-heap-parsability/)：

要让这段代码能工作，本地代码必须知道当前（无类型的！）对象有多大，而且最好能很快知道。因此对本地代码来说，类元数据如何组织至关重要。在 Hotspot 中，我们可以通过类字找到[布局辅助字段(layout helper)](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/klass.hpp#l89)，它会给出关于对象大小的信息。

**DDIQ: 你是说垃圾收集器访问的内存比堆本身还多？**

是的，Hotspot 的 GC [需要去访问类元数据](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/oop.inline.hpp#l185)来确定对象大小。它大部分时间都在反复访问同一份元数据，但这种有依赖的内存读取仍然要花不少代价。这就是无类型本地访问的奇妙之处！你可以在本地代码的反汇编里看到这一点，例如 `MutableSpace::object_iterate` [这里](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/gc/parallel/mutableSpace.cpp#l228)：

### 6.3. Figuring Out The Target Of Virtual/Interface Call

When runtime needs to invoke the virtual/interface method on the object instance, it needs to determine where the target method is. While most of the time [that can be optimized](https://shipilev.net/blog/2015/black-magic-method-dispatch/), there are cases where [we need to do](https://shipilev.net/jvm/anatomy-quarks/16-megamorphic-virtual-calls/) the actual dispatch. The performance of that dispatch also depends on how far away the class metadata is, so this cannot be neglected.

### 6.3. 确定虚方法/接口调用的目标

当运行时需要在对象实例上调用虚方法/接口方法时，它必须确定目标方法在哪里。虽然大多数情况下[这可以被优化](https://shipilev.net/blog/2015/black-magic-method-dispatch/)，但有些场景[我们不得不进行](https://shipilev.net/jvm/anatomy-quarks/16-megamorphic-virtual-calls/)真正的分派。分派性能同样取决于类元数据离得有多远，所以这一点不容忽视。

### 6.4. Observation: Compressed References Affect Object Header Footprint

Similarly to the observation about the mark word sizes depending on JVM bitness, we can also expect that compressed reference mode affects object sizes, *even without reference fields involved*. To demonstrate that, let’s take `java.lang.Integer` on two heap sizes, small (1 GB) and large (64 GB). These heap sizes would have compressed references turned on and off by default, respectively. This would mean compressed class pointers are also on or off by default.

```
$ jdk8-64/bin/java -Xmx1g -jar jol-cli.jar internals java.lang.Integer
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via public java.lang.Integer(int)

java.lang.Integer object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00 # Mark word
      4     4        (object header)              00 00 00 00 # Mark word
      8     4        (object header)              de 21 00 20 # Class word
     12     4    int Integer.value                0
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
$ jdk8-64/bin/java -Xmx64g -jar jol-cli.jar internals java.lang.Integer
# Running 64-bit HotSpot VM.

Instantiated the sample instance via public java.lang.Integer(int)

java.lang.Integer object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00 # Mark word
      4     4        (object header)              00 00 00 00 # Mark word
      8     4        (object header)              40 69 25 ad # Class word
     12     4        (object header)              e5 7f 00 00 # (uncompressed)
     16     4    int Integer.value                0
     20     4        (loss due to the next object alignment)
Instance size: 24 bytes # AHHHHHHH....
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

Here, in VM with 1 GB heap, object header takes 8 (mark word) + 4 (class word) = 12 bytes, whereas 64G VM header takes 8 (mark word) and + 8 (class word) = 16 bytes, respectively. If there were no fields, both would round up to 16 bytes due to object alignment by 8. But, since there *is* an `int` field, in 64 GB case, we need to allocate it past 16 bytes, and thus need another 8 bytes, taking 24 bytes in total.

### 6.4. 观察：压缩引用会影响对象头的内存占用

与“标记字大小取决于 JVM 位数”的观察类似，我们也可以预期压缩引用模式会影响对象大小，*甚至在不涉及引用字段的情况下*。为了演示这一点，我们以 `java.lang.Integer` 为例，分别在两种堆大小下测试：小的（1 GB）和大的（64 GB）。这两种堆大小默认会分别开启和关闭压缩引用。这也意味着压缩类指针默认也是开启或关闭的。

这里，在堆为 1 GB 的 VM 中，对象头占用 8（标记字）+ 4（类字）= 12 字节，而在 64G 的 VM 中则分别是 8（标记字）+ 8（类字）= 16 字节。如果没有字段，由于对象按 8 字节对齐，两者都会向上取整为 16 字节。但由于*存在*一个 `int` 字段，在 64 GB 的情况下，我们必须把它分配到 16 字节之后，因而需要再多 8 字节，总共占 24 字节。

## 7. Header: Array Length

Arrays come with another little piece of metadata: array length. Since the object type only encodes the array element type, we need to store the array length somewhere else.

This can be seen with the relevant [JOLSample_25_ArrayAlignment](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_25_ArrayAlignment.java#l41):

```
$ jdk8-64/bin/java -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_25_ArrayAlignment
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

[J object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              d8 0c 00 00  # Class word
     12     4        (object header)              00 00 00 00  # Array length
     16     0   long [J.<elements>                N/A
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total

...

[B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              68 07 00 00  # Class word
     12     4        (object header)              00 00 00 00  # Array length
     16     0   byte [B.<elements>                N/A
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total

[B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              68 07 00 00  # Class word
     12     4        (object header)              01 00 00 00  # Array length
     16     1   byte [B.<elements>                N/A
     17     7        (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 7 bytes external = 7 bytes total

[B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              68 07 00 00  # Class word
     12     4        (object header)              02 00 00 00  # Array length
     16     2   byte [B.<elements>                N/A
     18     6        (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 6 bytes external = 6 bytes total

[B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              68 07 00 00  # Class word
     12     4        (object header)              03 00 00 00  # Array length
     16     3   byte [B.<elements>                N/A
     19     5        (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 5 bytes external = 5 bytes total

...

[B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              68 07 00 00  # Class word
     12     4        (object header)              08 00 00 00  # Array length
     16     8   byte [B.<elements>                N/A
Instance size: 24 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

There is a slot at +12 that carries the array length. As we allocate the `byte[]` arrays of 0..8 elements, that slot keeps changing. Carrying the arraylength with the array instance helps to calculate its actual size for object walkers (as we seen in previous section for regular objects), and also do efficient range checks that have the array length very close by.

**DDIQ: Show us how array range check is done?**

Range checks would be eliminated in many cases, like in hot loops, but for a simple example where array is unknown:

```
private int[] a = new int[100];

@CompilerControl(CompilerControl.Mode.DONT_INLINE)
@Benchmark
public int test() {
  return a[42];
}
 mov    0x10(%rsi),%r10    ; get field "a"
 mov    0x10(%r10),%r11d   ; get a.<arraylength>, at 0x10
 cmp    $0x2a,%r11d        ; compare 42 with arraylength
 jbe    0x00007f139b4398e1 ; equal or greater? jump to slowpath
 mov    0xc0(%r10),%eax    ; read element at (24 + 4*42) = 0xc0
```

## 7. 对象头：数组长度

数组还带有另一小块元数据：数组长度。由于对象类型只编码了数组的元素类型，我们需要把数组长度存到别的地方。

相关的 [JOLSample_25_ArrayAlignment](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_25_ArrayAlignment.java#l41) 示例展示了这一点：

在偏移 +12 处有一个槽位保存数组长度。当我们分配元素个数为 0..8 的 `byte[]` 数组时，这个槽位不断变化。把数组长度与数组实例放在一起，有助于对象遍历器计算它的实际大小（正如上一节对普通对象所做的那样），也能高效地做范围检查，因为数组长度就在附近。

**DDIQ: 能给我们演示一下数组的范围检查是怎么做的吗？**

在很多情况下（比如热点循环中）范围检查会被消除，这里举一个数组未知的简单例子：

### 7.1. Observation: Array Base Is Aligned

The example above glossed over the important quirk in array layout, hidden by lucky alignments in default 64-bit mode. If we run with large heap (or disable compressed references explicitly) to disturb that alignment:

```
$ jdk8-64/bin/java -Xmx64g -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_25_ArrayAlignment
# Running 64-bit HotSpot VM.

[J object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              d8 8c b0 a4  # Class word
     12     4        (object header)              98 7f 00 00  # Class word
     16     4        (object header)              00 00 00 00  # Array length
     20     4        (alignment/padding gap)
     24     0   long [J.<elements>                N/A
Instance size: 24 bytes
Space losses: 4 bytes internal + 0 bytes external = 4 bytes total

...

[B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              68 87 b0 a4  # Class word
     12     4        (object header)              98 7f 00 00  # Class word
     16     4        (object header)              05 00 00 00  # Array length
     20     4        (alignment/padding gap)
     24     5   byte [B.<elements>                N/A
     29     3        (loss due to the next object alignment)
Instance size: 32 bytes
Space losses: 4 bytes internal + 3 bytes external = 7 bytes total
...
```

…or run with 32-bit binaries:

```
$ jdk8-32/bin/java  -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_25_ArrayAlignment
# Running 32-bit HotSpot VM.

[J object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              88 47 1b a3  # Class word
      8     4        (object header)              00 00 00 00  # Array length
     12     4        (alignment/padding gap)
     16     0   long [J.<elements>                N/A
Instance size: 16 bytes
Space losses: 4 bytes internal + 0 bytes external = 4 bytes total

[B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              58 44 1b a3  # Class word
      8     4        (object header)              05 00 00 00  # Array length
     12     5   byte [B.<elements>                N/A
     17     7        (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 7 bytes external = 7 bytes total
```

The *array base* is [aligned by the machine word size](https://bugs.openjdk.java.net/browse/JDK-8139457), due to implementation quirk. Arrays with elements larger than machine word size are also aligned more aggresively, we would see more when talking about field alignments. All this means that arrays might take more space than we naively think.

### 7.1. 观察：数组基址是对齐的

上面的例子忽略了一个数组布局中的重要怪癖，它在默认 64 位模式下被“幸运的”对齐掩盖了。如果我们使用大堆（或显式禁用压缩引用）来打破这种对齐：

……或者用 32 位二进制版本运行：

由于实现上的怪癖，*数组基址*是[按机器字大小对齐](https://bugs.openjdk.java.net/browse/JDK-8139457)的。元素大于机器字大小的数组对齐要求更严格，我们在讨论字段对齐时还会看到更多。这一切都意味着，数组占用的空间可能比我们天真以为的更多。

## 8. Object Alignment

Up to this point, we have glossed over the actual need for object alignment, taking the alignment by 8 bytes as granted. Why is it 8 bytes?

There are several considerations that make this alignment practical.

First, we sometimes need to atomically update the mark word, which puts constraints at what addresses mark words can reside. For 8-byte mark word that needs the full update — for example, installing the forwarding pointer — the word needs to be aligned by 8. Since mark word is the first slot in the object, the entire object needs to be aligned by 8.

**DDIQ: Can we then make the object alignment 4 bytes for 32-bit platforms then?**

As far as mark words are concerned, yes. But that is not the only thing we need to take care of, see below.

Second, the same thing applies to atomic accesses to volatile longs/doubles, which have to be read and written indivisibly. Even without the volatile modifier, we will have to accept the possibility of atomic access with the use-site volatility, e.g. via `VarHandles`. Therefore, we are better off accepting that every field has to be naturally aligned. If we align the object *externally* by 8, then aligning the fields *internally* by 8/4/2 bytes would not break the absolute aligment.

**DDIQ: Does that mean we can look into the object fields definitions, and then decide which alignment the object should take?**

Yes, we technically can. If we solve the mark word alignment problem somehow, then for the class with only 4-byte wide fields, we can align the object by 4. This, however, would complicate the allocation path considerably: it would need to decide on the spot whether larger alignment is needed (doable statically, since allocation type is known), and whether the external padding is needed to be added (needs dynamic check, because it depends on what previous object was). It also opens a can of worms with regards to heap parsability.

Alignment by 8 bytes is not always a waste, though, as it enables compressed references beyond 4 GB heap. Alignment by 4 bytes would allow "only" 16 GB heap with compressed references, compared to 32 GB allowed by alignment by 8 bytes. In fact, some are [increasing the object alignment to 16 bytes](https://shipilev.net/jvm/anatomy-quarks/24-object-alignment/), in order to stretch the area where compressed references work.

In Hotspot, the alignment is technically the part of the object itself: if we round up *all object sizes* to 8, then we would naturally present the *alignment shadow* at the end of some objects. Allocating the object that is a multiple of 8 bytes in size does not break alignment, so if we start allocating from the right base (and we do), all objects are guaranteed to be aligned.

Let’s take for example `java.util.ArrayList`:

```
$ jdk8-64/bin/java -Xmx1g -jar jol-cli.jar internals java.util.ArrayList
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

java.util.ArrayList object internals:
 OFFSET  SIZE                 TYPE DESCRIPTION                  VALUE
      0     4                      (object header)              01 00 00 00
      4     4                      (object header)              00 00 00 00
      8     4                      (object header)              46 2e 00 20
     12     4                  int AbstractList.modCount        0
     16     4                  int ArrayList.size               0
     20     4   java.lang.Object[] ArrayList.elementData        []
Instance size: 24 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

…and the same thing with `-XX:ObjectAlignmentInBytes=16`:

```
$ jdk8-64/bin/java -Xmx1g -XX:ObjectAlignmentInBytes=16 -jar jol-cli.jar internals java.util.ArrayList
# Running 64-bit HotSpot VM.
# Using compressed oop with 4-bit shift.
# Using compressed klass with 4-bit shift.
# Objects are 16 bytes aligned.

Instantiated the sample instance via default constructor.

java.util.ArrayList object internals:
 OFFSET  SIZE                 TYPE DESCRIPTION                  VALUE
      0     4                      (object header)              01 00 00 00
      4     4                      (object header)              00 00 00 00
      8     4                      (object header)              93 2e 00 20
     12     4                  int AbstractList.modCount        0
     16     4                  int ArrayList.size               0
     20     4   java.lang.Object[] ArrayList.elementData        []
     24     8                      (loss due to the next object alignment)
Instance size: 32 bytes
```

With 8-byte alignment, `ArrayList` takes exactly 24 bytes, since it is the multiple of 8. With 16-byte alignment, we get the *alignment shadow*: 8 bytes are lost at the end of the object to maintain the alignment for the next one.

## 8. 对象对齐

到目前为止，我们一直把按 8 字节对齐当作理所当然，忽略了对象对齐的真正需求。为什么是 8 字节？

有几个方面的考虑让这种对齐方式变得实用。

第一，我们有时需要原子地更新标记字，这就对标记字可以位于哪些地址施加了约束。对于需要整体更新的 8 字节标记字（例如安装转发指针）来说，这个字必须按 8 字节对齐。由于标记字是对象中的第一个槽位，所以整个对象都需要按 8 字节对齐。

**DDIQ: 那对于 32 位平台，能不能把对象对齐改成 4 字节？**

单就标记字而言，可以。但我们需要考虑的并不只有这一件事，见下文。

第二，同样的道理也适用于对 volatile long/double 的原子访问，它们必须不可分割地读写。即便没有 volatile 修饰符，我们也必须接受“通过使用处(use-site)的 volatile 语义进行原子访问”这种可能性，例如通过 `VarHandles`。因此，我们不如接受“每个字段都必须按其自然对齐”这一点。如果我们把对象*外部*按 8 字节对齐，那么把字段*内部*按 8/4/2 字节对齐就不会破坏绝对对齐。

**DDIQ: 这是否意味着我们可以查看对象字段的定义，再决定该对象应该采用哪种对齐？**

技术上可以。如果我们以某种方式解决了标记字的对齐问题，那么对于只含 4 字节宽字段的类，我们就可以把对象按 4 字节对齐。然而这会让分配路径显著复杂化：它需要当场判断是否需要更大的对齐（这是可以静态确定的，因为分配类型已知），以及是否需要补充外部填充（这需要动态检查，因为取决于前一个对象是什么）。这还会在堆的可解析性(heap parsability)方面引出一堆麻烦。

不过，按 8 字节对齐并不总是浪费，因为它使压缩引用在超过 4 GB 的堆上也能使用。按 4 字节对齐在压缩引用下“只能”支持 16 GB 的堆，而按 8 字节对齐可以支持 32 GB。事实上，有人[把对象对齐提高到 16 字节](https://shipilev.net/jvm/anatomy-quarks/24-object-alignment/)，以扩大压缩引用能起作用的范围。

在 Hotspot 中，对齐在技术上是对象自身的一部分：如果我们把*所有对象大小*都向上取整到 8，那么自然就会在某些对象的末尾出现*对齐阴影(alignment shadow)*。分配大小为 8 的倍数的对象不会破坏对齐，所以只要我们从正确的基址开始分配（我们确实如此），所有对象都能保证是对齐的。

以 `java.util.ArrayList` 为例：

……再加上 `-XX:ObjectAlignmentInBytes=16` 的效果：

在 8 字节对齐下，`ArrayList` 正好占 24 字节，因为它是 8 的倍数。在 16 字节对齐下，就出现了*对齐阴影*：对象末尾有 8 字节被浪费掉，以维持下一个对象的对齐。

### 8.1. Observation: Hiding Fields in Alignment Shadow

This observation immediately leads to one tangible observation: if there is an alignment shadow in the object, we can hide new fields there, *without increasing the apparent size of the object*!

Compare the example of `java.lang.Object`:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals java.lang.Object
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              a8 0e 00 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

…and `java.lang.Integer`:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals java.lang.Integer
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via public java.lang.Integer(int)

java.lang.Integer object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                   VALUE
      0     4        (object header)               01 00 00 00
      4     4        (object header)               00 00 00 00
      8     4        (object header)               f0 0e 01 00
     12     4    int Integer.value                 0
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

`Object` had the alignment shadow of 4 bytes, which `Integer.value` field gladly took. In the end, the size of `Object` and `Integer` ended up being the same in that VM configuration.

### 8.1. 观察：把字段藏进对齐阴影

由此立刻可以得到一个很实在的观察：如果对象中存在对齐阴影，我们就可以把新字段藏在那里，*而不会增加对象表面上的大小*！

对比 `java.lang.Object` 的例子：

……以及 `java.lang.Integer`：

`Object` 有 4 字节的对齐阴影，`Integer.value` 字段欣然占用了它。最终在这种 VM 配置下，`Object` 和 `Integer` 的大小完全相同。

### 8.2. Observation: Blowing Up Instance Sizes by Adding Small Fields

There is the opposite caveat to this story. Suppose we have the object that has zero-length alignment shadow:

```
public class A {
  int a1;
}
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . A
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                   VALUE
      0     4        (object header)               01 00 00 00
      4     4        (object header)               00 00 00 00
      8     4        (object header)               28 b8 0f 00
     12     4    int A.a1                          0
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

What happens if we add a `boolean` field to it?

```
public class B {
  int b1;
  boolean b2; // takes 1 byte, right?
}
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . B
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

B object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              01 00 00 00
      4     4           (object header)              00 00 00 00
      8     4           (object header)              28 b8 0f 00
     12     4       int B.b1                         0
     16     1   boolean B.b2                         false
     17     7           (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 7 bytes external = 7 bytes total
```

Here, we only needed one lousy byte to allocate the field, but since we need the satisfy alignment requirements for objects themselves, we ended up adding the entire slab of 8 bytes! There is a small consolation that fitting more fields in the rest of 7 bytes of the shadow would not increase the apparent object size.

### 8.2. 观察：增加一个小字段会让实例大小暴涨

这个故事的另一方面也存在相反的坑。假设我们有一个对齐阴影长度为零的对象：

如果我们给它加一个 `boolean` 字段，会发生什么？

这里我们只需要区区一个字节来放这个字段，但由于必须满足对象本身的对齐要求，结果整整多出了 8 个字节！稍可安慰的是，把更多字段塞进阴影剩下的 7 个字节里，并不会增加对象表面上的大小。

## 9. Field Alignments

We have touched on this topic in the previous section when we were talking about the object alignments.

Many architectures dislike unaligned accesses, with different levels of animosity. On many, unaligned accesses carry a performance penalty. On some, unaligned access raises the machine exception. Then Java Memory Model comes in and requires atomic accesses to fields and array elements, [at very least](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.7) when those fields are `volatile`.

This forces most implementations to align fields to their natural alignment. The object alignment by 8 bytes guarantees the offset 0 is aligned by 8 bytes, the largest natural alignment across all types we have. So, we "only" need to lay out the fields within the object with their natural alignment. This can be clearly seen with `java.lang.Long`:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals java.lang.Long
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via public java.lang.Long(long)

java.lang.Long object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                     VALUE
      0     4        (object header)                 01 00 00 00
      4     4        (object header)                 00 00 00 00
      8     4        (object header)                 18 11 01 00
     12     4        (alignment/padding gap)
     16     8   long Long.value                      0
Instance size: 24 bytes
Space losses: 4 bytes internal + 0 bytes external = 4 bytes total
```

Here, `long value` was placed at +16, because it would make the field aligned by 8. Note there is a gap before the field!

## 9. 字段对齐

我们在上一节讨论对象对齐时已经触及了这个话题。

很多架构都不喜欢非对齐访问，厌恶程度各不相同。在很多架构上，非对齐访问会带来性能损失；在有些架构上，非对齐访问会触发机器异常。再加上 Java 内存模型要求对字段和数组元素的访问是原子的，[至少](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.7)当这些字段是 `volatile` 时必须如此。

这迫使大多数实现把字段按自然对齐来摆放。对象按 8 字节对齐保证了偏移 0 处按 8 字节对齐，这是我们所有类型中最大的自然对齐要求。所以我们“只需要”在对象内部按自然对齐来布局字段即可。这一点在 `java.lang.Long` 上可以看得很清楚：

这里 `long value` 被放在 +16，因为这样字段就能按 8 字节对齐。注意这个字段前面有一个空隙！

### 9.1. Observation: Hiding Fields in Field Alignment Gaps

Foreshadowing the discussion about field packing a bit: the existence of these field alignment gaps allows us to hide fields there. For example, adding another `int` field to a `long`-bearing class:

```
public class LongIntCarrier {
  long value;
  int somethingElse;
}
```

…would end up laid out like this:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . LongIntCarrier
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

LongIntCarrier object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                     VALUE
      0     4        (object header)                 01 00 00 00
      4     4        (object header)                 00 00 00 00
      8     4        (object header)                 28 b8 0f 00
     12     4    int LongIntCarrier.somethingElse    0
     16     8   long LongIntCarrier.value            0
Instance size: 24 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

Compare with the `java.lang.Long` layout: they take the same total instance space, and that is because new `int` field took the alignment gap for it.

### 9.1. 观察：把字段藏在字段对齐空隙里

稍微剧透一下后面关于字段紧凑排布(field packing)的讨论：这些字段对齐空隙的存在，让我们可以把字段藏进去。例如，给一个含 `long` 的类再加一个 `int` 字段：

……最终布局会是这样：

与 `java.lang.Long` 的布局对比：它们占用的实例总空间相同，原因就是这个新增的 `int` 字段占用了原本的对齐空隙。

## 10. Field Packing

When multiple fields are present, a new task appears: how to distribute fields around the object? This is where field layouter comes in. Its job is to make sure every field is allocated at its natural alignment, and hopefully the object is as densely packed as possible. How exactly that one is achieved is heavily implementation-dependent. For all we know, the field "packer" can just put all fields in their declaration order, padding each field for its natural alignment. It would waste a lot of memory, though.

Consider this class:

```
public class FieldPacking {
  boolean b;
  long l;
  char c;
  int i;
}
```

The naive field packer would do this:

```
$ <32-bit simulation>
FieldPacking object internals:
 OFFSET  SIZE      TYPE DESCRIPTION
      0     4           (object header)
      4     4           (object header)
      8     1   boolean FieldPacking.b
      9     7           (alignment/padding gap)
     16     8      long FieldPacking.l
     24     2      char FieldPacking.c
     26     2            (alignment/padding gap)
     28     4       int FieldPacking.i
Instance size: 32 bytes
```

…while a smarter one would do:

```
$ jdk8-32/bin/java -jar jol-cli.jar internals -cp . FieldPacking
# Running 32-bit HotSpot VM.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

FieldPacking object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              01 00 00 00
      4     4           (object header)              68 91 6f a3
      8     8      long FieldPacking.l               0
     16     4       int FieldPacking.i               0
     20     2      char FieldPacking.c
     22     1   boolean FieldPacking.b               false
     23     1           (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 1 bytes external = 1 bytes total
```

…thus saving 8 bytes per object instance.

**DDIQ: Is there a rule of thumb for field layout?**

As said above, field layout is an implementation detail. Hotspot implementation, until recently, was a nearly linear implementation. It started laying out the fields starting from their larger size down to smaller ones. So, first you’d lay out longs/doubles (that require alignment by 8), then ints/floats (requiring alignment by 4), then chars/shorts (need alignment by 2), then bytes/booleans. In this way, we pack the entire field block quite densely, but with one exception: the initial alignment of larger data type could have left the gap that we can take with smaller datatype — that is handled separately.

There are reference fields that either join the group of 8-byte fields (64-bit mode without compressed references), or 4-byte fields (32-bit mode, or 64-bit mode with compressed references). There are some GC-related tricks when multiple classes with reference fields are in hierarchy: sometimes it might be profitable to cluster them together.

Anyhow, we can derive two immediate observations from this.

## 10. 字段紧凑排布(Field Packing)

当存在多个字段时，就出现了一个新任务：如何把这些字段分配到对象中？这就是字段布局器(field layouter)的用武之地。它的职责是确保每个字段都按自然对齐分配，并尽可能让对象排布得紧凑。具体如何做到这一点，在很大程度上取决于实现。就我们所知，字段“打包器”完全可以按声明顺序放置所有字段，并为每个字段按其自然对齐做填充。不过那样会浪费大量内存。

看下面这个类：

天真的字段打包器会这样做：

……而更聪明的实现会这样做：

……这样每个对象实例就节省了 8 字节。

**DDIQ: 字段布局有什么经验法则吗？**

如上所说，字段布局属于实现细节。直到不久之前，Hotspot 的实现几乎就是线性处理：它从较大的类型开始，依次布局到较小的类型。所以先放 long/double（需要按 8 字节对齐），再放 int/float（需要按 4 字节对齐），然后放 char/short（需要按 2 字节对齐），最后放 byte/boolean。这样整个字段块排布得相当紧凑，但有一个例外：较大数据类型的初始对齐可能留下空隙，而我们可以用较小的数据类型填进去——这需要单独处理。

引用字段要么归入 8 字节字段组（64 位模式且未启用压缩引用），要么归入 4 字节字段组（32 位模式，或启用压缩引用的 64 位模式）。当继承体系中有多个带引用字段的类时，还有一些与 GC 相关的技巧：有时把它们聚在一起会更划算。

无论如何，由此我们可以立刻得到两个观察。

### 10.1. Observation: Field Declaration Order != Field Layout Order

First of all, given the field declaration order:

```
public class FieldOrder {
  boolean firstField;
  long secondField;
  char thirdField;
  int fourthField;
}
```

…we are not guaranteed to get the same order in memory. Field packer would routinely rearrange fields to minimize footprint:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . FieldOrder
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

FieldOrder object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              01 00 00 00
      4     4           (object header)              00 00 00 00
      8     4           (object header)              28 b8 0f 00
     12     4       int FieldOrder.fourthField       0
     16     8      long FieldOrder.secondField       0
     24     2      char FieldOrder.thirdField
     26     1   boolean FieldOrder.firstField        false
     27     5           (loss due to the next object alignment)
Instance size: 32 bytes
Space losses: 0 bytes internal + 5 bytes external = 5 bytes total
```

Note how layouter laid out fields in their data type size: first `long` field was aligned at +16, then `int` field supposed to go at +24, but layouter discovered there is a gap before `long` field where it can be tucked into, so it did at +12, then `char` got its natural alignment at +24, then boolean took the slot +26.

The field packing is a major caveat when you would consider the interaction with foreign/raw functions that expect fields to be at particular offsets. The field offsets depend on what field packer does (does it compact fields, and how exactly it does so?), and what are the starting conditions for it (bitness, compressed references mode, object alignment, etc).

Java code that uses `sun.misc.Unsafe` to gain access to the fields has to read the field offsets at runtime to capture the actual layout in the given execution. It is hard to diagnose source of bugs to assume the fields are at the same offsets as they were in debugging session.

### 10.1. 观察：字段声明顺序 != 字段布局顺序

首先，给定这样的字段声明顺序：

……我们并不能保证它们在内存中也是同样的顺序。字段打包器通常会重新排列字段以尽量减小内存占用：

注意布局器是如何按数据类型大小来布局字段的：先是 `long` 字段对齐到 +16；接着 `int` 字段本应放到 +24，但布局器发现 `long` 字段前面有一个空隙可以塞进去，于是把它放到了 +12；然后 `char` 在 +24 处得到自然对齐；最后 boolean 占据了 +26 这个槽位。

当你考虑与外部/原生函数(foreign/raw functions)交互、而这些函数期望字段处于特定偏移时，字段紧凑排布就是一个大坑。字段偏移取决于字段打包器做了什么（它会不会压缩字段？具体怎么压缩？），也取决于它的初始条件（位数、压缩引用模式、对象对齐等）。

使用 `sun.misc.Unsafe` 访问字段的 Java 代码，必须在运行时读取字段偏移，才能掌握当前这次执行中的实际布局。如果想当然认为字段偏移和调试时一样，那么一旦出 bug 就很难诊断原因。

### 10.2. Observation: C-style Padding Is Unreliable

When [False Sharing](https://en.wikipedia.org/wiki/False_sharing) mitigation techniques are involved, people resort to padding the critical fields in order to isolate them in their own cache lines. The most frequently used way to deal with it is to introduce some dummy field declarations around the protected field. And, since typing out declarations is tedious, people expectedly resort to using the largest data type. So, to protect a contentious `byte` field, you could see this done:

```
public class LongPadding {
  long l01, l02, l03, l04, l05, l06, l07, l08; // 64 bytes
  byte pleaseHelpMe;
  long l11, l12, l13, l14, l15, l16, l17, l18; // 64 bytes
}
```

You would expect the `pleaseHelpMe` field squeezed between two large `long` blocks. Unfortunately, field packer does not think so:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . CStylePadding
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

LongPadding object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              28 b8 0f 00
     12     1   byte LongPadding.pleaseHelpMe     0  # WHOOPS.
     13     3        (alignment/padding gap)
     16     8   long LongPadding.l01              0
     24     8   long LongPadding.l02              0
     32     8   long LongPadding.l03              0
     40     8   long LongPadding.l04              0
     48     8   long LongPadding.l05              0
     56     8   long LongPadding.l06              0
     64     8   long LongPadding.l07              0
     72     8   long LongPadding.l08              0
     80     8   long LongPadding.l11              0
     88     8   long LongPadding.l12              0
     96     8   long LongPadding.l13              0
    104     8   long LongPadding.l14              0
    112     8   long LongPadding.l15              0
    120     8   long LongPadding.l16              0
    128     8   long LongPadding.l17              0
    136     8   long LongPadding.l18              0
Instance size: 144 bytes
Space losses: 3 bytes internal + 0 bytes external = 3 bytes total
```

You could suggest padding with `byte` fields then? It would depend on implementation detail that field packer goes through the fields of the same width/type in the declaration order, but at least it would somewhat work:

```
public class BytePadding {
  byte p000, p001, p002, p003, p004, p005, p006, p007;
  byte p008, p009, p010, p011, p012, p013, p014, p015;
  byte p016, p017, p018, p019, p020, p021, p022, p023;
  byte p024, p025, p026, p027, p028, p029, p030, p031;
  byte p032, p033, p034, p035, p036, p037, p038, p039;
  byte p040, p041, p042, p043, p044, p045, p046, p047;
  byte p048, p049, p050, p051, p052, p053, p054, p055;
  byte p056, p057, p058, p059, p060, p061, p062, p063;
  byte pleaseHelpMe;
  byte p100, p101, p102, p103, p104, p105, p106, p107;
  byte p108, p109, p110, p111, p112, p113, p114, p115;
  byte p116, p117, p118, p119, p120, p121, p122, p123;
  byte p124, p125, p126, p127, p128, p129, p130, p131;
  byte p132, p133, p134, p135, p136, p137, p138, p139;
  byte p140, p141, p142, p143, p144, p145, p146, p147;
  byte p148, p149, p150, p151, p152, p153, p154, p155;
  byte p156, p157, p158, p159, p160, p161, p162, p163;
}
$ jdk8-64/bin/java -jar ~/projects/jol/jol-cli/target/jol-cli.jar internals -cp . BytePadding
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

BytePadding object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              28 b8 0f 00
     12     1   byte BytePadding.p000             0
     13     1   byte BytePadding.p001             0
...
     74     1   byte BytePadding.p062             0
     75     1   byte BytePadding.p063             0
     76     1   byte BytePadding.pleaseHelpMe     0 # Good
     77     1   byte BytePadding.p100             0
     78     1   byte BytePadding.p101             0
...
    139     1   byte BytePadding.p162             0
    140     1   byte BytePadding.p163             0
    141     3        (loss due to the next object alignment)
Instance size: 144 bytes
Space losses: 0 bytes internal + 3 bytes external = 3 bytes total
```

…unless you need to protect something of a different type:

```
public class BytePaddingHetero {
  byte p000, p001, p002, p003, p004, p005, p006, p007;
  byte p008, p009, p010, p011, p012, p013, p014, p015;
  byte p016, p017, p018, p019, p020, p021, p022, p023;
  byte p024, p025, p026, p027, p028, p029, p030, p031;
  byte p032, p033, p034, p035, p036, p037, p038, p039;
  byte p040, p041, p042, p043, p044, p045, p046, p047;
  byte p048, p049, p050, p051, p052, p053, p054, p055;
  byte p056, p057, p058, p059, p060, p061, p062, p063;
  byte pleaseHelpMe;
  int pleaseHelpMeToo; // pretty please!
  byte p100, p101, p102, p103, p104, p105, p106, p107;
  byte p108, p109, p110, p111, p112, p113, p114, p115;
  byte p116, p117, p118, p119, p120, p121, p122, p123;
  byte p124, p125, p126, p127, p128, p129, p130, p131;
  byte p132, p133, p134, p135, p136, p137, p138, p139;
  byte p140, p141, p142, p143, p144, p145, p146, p147;
  byte p148, p149, p150, p151, p152, p153, p154, p155;
  byte p156, p157, p158, p159, p160, p161, p162, p163;
}
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . BytePaddingHetero
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

BytePaddingHetero object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                        VALUE
      0     4        (object header)                    01 00 00 00
      4     4        (object header)                    00 00 00 00
      8     4        (object header)                    28 b8 0f 00
     12     4    int BytePaddingHetero.pleaseHelpMeToo  0 # WHOOPS.
     16     1   byte BytePaddingHetero.p000             0
     17     1   byte BytePaddingHetero.p001             0
...
     78     1   byte BytePaddingHetero.p062             0
     79     1   byte BytePaddingHetero.p063             0
     80     1   byte BytePaddingHetero.pleaseHelpMe     0 # Good.
     81     1   byte BytePaddingHetero.p100             0
     82     1   byte BytePaddingHetero.p101             0
...
    143     1   byte BytePaddingHetero.p162             0
    144     1   byte BytePaddingHetero.p163             0
    145     7        (loss due to the next object alignment)
Instance size: 152 bytes
Space losses: 0 bytes internal + 7 bytes external = 7 bytes total
```

### 10.2. 观察：C 风格的填充并不可靠

在涉及[伪共享(False Sharing)](https://en.wikipedia.org/wiki/False_sharing)缓解技术时，人们会给关键字段加填充，好把它们隔离到各自的缓存行中。最常用的做法是在被保护字段的前后插入一些占位(dummy)字段声明。而由于一个个敲声明很繁琐，人们自然会倾向于使用最大的数据类型。于是，为了保护一个有争用的 `byte` 字段，你可能会看到这样的写法：

你会以为 `pleaseHelpMe` 字段被夹在两个大 `long` 块之间。遗憾的是，字段打包器并不这么想：

那你可能会提议改用 `byte` 字段来填充？这取决于一个实现细节：字段打包器会按声明顺序处理宽度/类型相同的字段。但至少这样勉强能用：

……除非你要保护的是另一种类型的字段：

### 10.3. @Contended

This endless whack-a-mole in very performance-sensitive parts of JDK library was mitigated by introducing the [private @Contended annotation](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/java.base/share/classes/jdk/internal/vm/annotation/Contended.java). It is used sparingly thorough the JDK, for example in `java.lang.Thread` for carrying [thread-local random generator state](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/java.base/share/classes/java/lang/Thread.java#l2059):

```
public class Thread implements Runnable {
    ...
    // The following three initially uninitialized fields are exclusively
    // managed by class java.util.concurrent.ThreadLocalRandom. These
    // fields are used to build the high-performance PRNGs in the
    // concurrent code, and we can not risk accidental false sharing.
    // Hence, the fields are isolated with @Contended.

    /** The current seed for a ThreadLocalRandom */
    @jdk.internal.vm.annotation.Contended("tlr")
    long threadLocalRandomSeed;

    /** Probe hash value; nonzero if threadLocalRandomSeed initialized */
    @jdk.internal.vm.annotation.Contended("tlr")
    int threadLocalRandomProbe;

    /** Secondary seed isolated from public ThreadLocalRandom sequence */
    @jdk.internal.vm.annotation.Contended("tlr")
    int threadLocalRandomSecondarySeed;
    ...
}
```

…which makes them treated specially by the field layouter code:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals java.lang.Thread
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

java.lang.Thread object internals:
 OFFSET  SIZE         TYPE DESCRIPTION                             VALUE
      0     4              (object header)                         01 00 00 00
      4     4              (object header)                         00 00 00 00
      8     4              (object header)                         48 69 00 00
     12     4          int Thread.priority                         5
     16     8         long Thread.eetop                            0
...
     96     4   j.l.Object Thread.blockerLock                      (object)
    100     4      j.l.UEH Thread.uncaughtExceptionHandler         null
    104   128              (alignment/padding gap)
    232     8         long Thread.threadLocalRandomSeed            0
    240     4          int Thread.threadLocalRandomProbe           0
    244     4          int Thread.threadLocalRandomSecondarySeed   0
    248   128              (loss due to the next object alignment)
Instance size: 376 bytes
Space losses: 129 bytes internal + 128 bytes external = 257 bytes total
```

**DDIQ: Why isn’t `@Contended` a public annotation?**

There are security/reliability implications in allowing adversaries to construct huge "regular" objects. Let’s leave it at that.

There are ways to achieve this effect without relying on internal annotations, by piggybacking on other implementation details, which we shall discuss next.

### 10.3. @Contended 注解

JDK 类库中那些对性能极其敏感的部分里这种无休止的“打地鼠”游戏，通过引入[私有注解 @Contended](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/java.base/share/classes/jdk/internal/vm/annotation/Contended.java)得到了缓解。它在整个 JDK 中使用得很克制，例如 `java.lang.Thread` 里用它来承载[线程局部的随机数生成器状态](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/java.base/share/classes/java/lang/Thread.java#l2059)：

……这让字段布局器代码对它们做特殊处理：

**DDIQ: 为什么 `@Contended` 不是公开注解？**

如果允许对手构造出巨大的“普通”对象，会带来安全/可靠性方面的隐患。这个话题我们就点到为止。

还有一些办法可以借助其它实现细节来达到同样的效果，而不依赖内部注解，这些我们接下来会讨论。

## 11. Field Layout Across The Hierarchy

A special consideration needs to be given about laying out fields in the hierarchy. Suppose we have these classes:

```
public class Hierarchy {
  static class A {
    int a;
  }
  static class B extends A {
    int b;
  }
  static class C extends A {
    int c;
  }
}
```

The layouts of these classes would be like this:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . Hierarchy\$A
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Hierarchy$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              28 b8 0f 00
     12     4    int A.a                          0
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total

Hierarchy$B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              08 ba 0f 00
     12     4    int A.a                          0
     16     4    int B.b                          0
     20     4        (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

Hierarchy$C object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              08 ba 0f 00
     12     4    int A.a                          0
     16     4    int C.c                          0
     20     4        (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

Note: all classes agree at where `A.a` super-class field is. This allows blind casts to `A` from any subtype, and then accessing `a` field there, without looking back at the actual type of the object. That is, `((A)o).a` would always go to the same offset, regardless of whether we are dealing with instance of `A`, `B`, or `C`.

This looks as if *superclass fields are always taken care of first*. Does it mean superclass fields are always first in the hierarchy? That is an implementation detail: prior JDK 15, the answer is "yes"; after JDK 15 the answer is "no". We shall quantify that with a few observations.

## 11. 继承体系中的字段布局

在继承体系中布局字段需要特别考虑。假设我们有这些类：

这些类的布局会是这样的：

注意：所有类在 `A.a` 这个父类字段的位置上保持一致。这样就能从任意子类型盲目地转换为 `A`，然后在那里访问 `a` 字段，而无需回头查看对象的实际类型。也就是说，无论处理的是 `A`、`B` 还是 `C` 的实例，`((A)o).a` 总是访问同一个偏移。

这看起来像是*父类字段总是被优先处理*。这是否意味着父类字段在继承体系中总是排在最前面？这属于实现细节：在 JDK 15 之前答案是“是”，JDK 15 之后答案是“否”。我们会用几个观察来量化这一点。

### 11.1. Superclass Gaps

Prior to JDK 15, field layouter only worked locally on current class declared fields. Which means if there *are* superclass gaps that subclass fields could take, they [would not be taken](https://bugs.openjdk.java.net/browse/JDK-8024913). Let’s split the prior `LongIntCarrier` example into subclasses:

```
public class LongIntCarrierSubs {
  static class A {
    long value;
  }
  static class B extends A {
    int somethingElse;
  }
}
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . LongIntCarrierSubs\$B
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

LongIntCarrierSubs$B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              08 ba 0f 00
     12     4        (alignment/padding gap)
     16     8   long A.value                      0
     24     4    int B.somethingElse              0
     28     4        (loss due to the next object alignment)
Instance size: 32 bytes
Space losses: 4 bytes internal + 4 bytes external = 8 bytes total
```

Note there is the same gap we have seen before, caused by `long` alignment. Theoretically, `B.somethingElse` could have taken it, but field layouter implementation quirk makes it impossible. Therefore, we lay out fields of `B` after the fields of `A`, and waste 8 bytes.

### 11.1. 父类空隙

在 JDK 15 之前，字段布局器只在当前类所声明的字段上局部工作。这意味着即使*存在*父类空隙、子类字段本可以占用，也[不会被使用](https://bugs.openjdk.java.net/browse/JDK-8024913)。我们把前面 `LongIntCarrier` 的例子拆成父子类：

注意这里有一个我们之前见过的同样空隙，由 `long` 的对齐造成。理论上 `B.somethingElse` 本可以占用它，但字段布局器的实现怪癖让这不可能。因此我们把 `B` 的字段排布在 `A` 的字段之后，浪费了 8 字节。

### 11.2. Hierarchy Gaps

Another quirk prior to JDK 15 is that field layouter counted the field blocks in the integer units of *reference size*, which made the subclass field block [start from much farther offset](https://bugs.openjdk.java.net/browse/JDK-8024912). This is most visible with something that carries a few very small fields:

```
public class ThreeBooleanStooges {
  static class A {
    boolean a;
  }
  static class B extends A {
    boolean b;
  }
  static class C extends B {
    boolean c;
  }
}
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . ThreeBooleanStooges\$A
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . ThreeBooleanStooges\$B
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . ThreeBooleanStooges\$C
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

ThreeBooleanStooges$A object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              01 00 00 00
      4     4           (object header)              00 00 00 00
      8     4           (object header)              28 b8 0f 00
     12     1   boolean A.a                          false
     13     3           (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 3 bytes external = 3 bytes total

ThreeBooleanStooges$B object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              01 00 00 00
      4     4           (object header)              00 00 00 00
      8     4           (object header)              08 ba 0f 00
     12     1   boolean A.a                          false
     13     3           (alignment/padding gap)
     16     1   boolean B.b                          false
     17     7           (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 3 bytes internal + 7 bytes external = 10 bytes total

ThreeBooleanStooges$C object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              01 00 00 00
      4     4           (object header)              00 00 00 00
      8     4           (object header)              e8 bb 0f 00
     12     1   boolean A.a                          false
     13     3           (alignment/padding gap)
     16     1   boolean B.b                          false
     17     3           (alignment/padding gap)
     20     1   boolean C.c                          false
     21     3           (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 6 bytes internal + 3 bytes external = 9 bytes total
```

The loss is very substantial! We waste 3 bytes per class instance, and then might lose even more when object alignment kicks in.

It is even worse on larger heaps and/or without compressed references:

```
$ jdk8-64/bin/java -Xmx64g -jar jol-cli.jar internals -cp . ThreeBooleanStooges\$C
# Running 64-bit HotSpot VM.

Instantiated the sample instance via default constructor.

ThreeBooleanStooges$C object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              01 00 00 00
      4     4           (object header)              00 00 00 00
      8     4           (object header)              b0 89 aa 37
     12     4           (object header)              b0 7f 00 00
     16     1   boolean A.a                          false
     17     7           (alignment/padding gap)
     24     1   boolean B.b                          false
     25     7           (alignment/padding gap)
     32     1   boolean C.c                          false
     33     7           (loss due to the next object alignment)
Instance size: 40 bytes
Space losses: 14 bytes internal + 7 bytes external = 21 bytes total
```

### 11.2. 继承体系空隙

JDK 15 之前的另一个怪癖是：字段布局器以*引用大小*为单位来计数字段块，这让子类的字段块[从远得多的偏移处开始](https://bugs.openjdk.java.net/browse/JDK-8024912)。在只带几个非常小的字段的情况下，这一点最为明显：

损失相当可观！每个类实例都浪费 3 字节，而一旦对象对齐起作用，可能还会浪费更多。

在更大的堆上、和/或不使用压缩引用时，情况还会更糟：

### 11.3. Observation: Hierarchy Tower Padding Trick

This implementation pecularity allows constructing a rather weird padding trick that more resilient than a C-style padding.

```
public class HierarchyLongPadding {
  static class Pad1 {
    long l01, l02, l03, l04, l05, l06, l07, l08;
  }
  static class Carrier extends Pad1 {
    byte pleaseHelpMe;
  }
  static class Pad2 extends Carrier {
    long l11, l12, l13, l14, l15, l16, l17, l18;
  }
  static class UsableObject extends Pad2 {};
}
```

…yields:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . HierarchyLongPadding\$UsableObject
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

HierarchyLongPadding$UsableObject object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                     VALUE
      0     4        (object header)                 01 00 00 00
      4     4        (object header)                 00 00 00 00
      8     4        (object header)                 c8 bd 0f 00
     12     4        (alignment/padding gap)
     16     8   long Pad1.l01                        0
     24     8   long Pad1.l02                        0
     32     8   long Pad1.l03                        0
     40     8   long Pad1.l04                        0
     48     8   long Pad1.l05                        0
     56     8   long Pad1.l06                        0
     64     8   long Pad1.l07                        0
     72     8   long Pad1.l08                        0
     80     1   byte Carrier.pleaseHelpMe            0
     81     7        (alignment/padding gap)
     88     8   long Pad2.l11                        0
     96     8   long Pad2.l12                        0
    104     8   long Pad2.l13                        0
    112     8   long Pad2.l14                        0
    120     8   long Pad2.l15                        0
    128     8   long Pad2.l16                        0
    136     8   long Pad2.l17                        0
    144     8   long Pad2.l18                        0
Instance size: 152 bytes
Space losses: 11 bytes internal + 0 bytes external = 11 bytes total
```

See, we squeeze the field we want to protect between two classes, exploiting a freaky implementation detail!

### 11.3. 观察：继承体系“塔式填充”技巧

这个实现怪癖让我们能构造出一种相当古怪、但比 C 风格填充更可靠的填充技巧。

……得到的结果是：

看，我们利用了某个奇特的实现细节，把想要保护的字段挤在了两个类之间！

### 11.4. Super/Hierarchy Gaps in Java 15+

Now we turn to JDK 15 and its [overhaul of field layout strategy](https://bugs.openjdk.java.net/browse/JDK-8237767). Now both superclass and hierarchy gaps are closed. Running our previous examples reveals it:

```
$ jdk15-64/bin/java -jar jol-cli.jar internals -cp . LongIntCarrierSubs\$B
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

LongIntCarrierSubs$B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                     VALUE
      0     4        (object header)                 05 00 00 00
      4     4        (object header)                 00 00 00 00
      8     4        (object header)                 4c 7d 17 00
     12     4    int B.somethingElse                 0
     16     8   long A.value                         0
Instance size: 24 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

Finally, `B.somethingElse` took the alignment gap before super-class `A.value`.

Hierarchy gaps are also gone:

```
$ jdk15-64/bin/java -jar jol-cli.jar internals -cp . ThreeBooleanStooges\$C
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

ThreeBooleanStooges$C object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              05 00 00 00
      4     4           (object header)              00 00 00 00
      8     4           (object header)              90 7d 17 00
     12     1   boolean A.a                          false
     13     1   boolean B.b                          false
     14     1   boolean C.c                          false
     15     1           (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 1 bytes external = 1 bytes total
```

Perfect!

### 11.4. Java 15+ 中的父类/继承体系空隙

现在我们转向 JDK 15 以及它对[字段布局策略的大改](https://bugs.openjdk.java.net/browse/JDK-8237767)。现在父类空隙和继承体系空隙都被填补了。运行之前的例子就能看出来：

终于，`B.somethingElse` 占用了父类 `A.value` 之前的对齐空隙。

继承体系空隙也消失了：

完美！

### 11.5. Observation: Hierarchy Tower Padding Trick Collapse in JDK 15

Unfortunately, this collapses the naive hierarchy padding trick that relied on implementation quirks! See:

```
$ jdk15-64/bin/java -jar jol-cli.jar internals -cp . HierarchyLongPadding\$UsableObject
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

HierarchyLongPadding$UsableObject object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                     VALUE
      0     4        (object header)                 05 00 00 00
      4     4        (object header)                 00 00 00 00
      8     4        (object header)                 08 7c 17 00
     12     1   byte Carrier.pleaseHelpMe            0  # WHOOPS
     13     3        (alignment/padding gap)
     16     8   long Pad1.l01                        0
     24     8   long Pad1.l02                        0
     32     8   long Pad1.l03                        0
     40     8   long Pad1.l04                        0
     48     8   long Pad1.l05                        0
     56     8   long Pad1.l06                        0
     64     8   long Pad1.l07                        0
     72     8   long Pad1.l08                        0
     80     8   long Pad2.l11                        0
     88     8   long Pad2.l12                        0
     96     8   long Pad2.l13                        0
    104     8   long Pad2.l14                        0
    112     8   long Pad2.l15                        0
    120     8   long Pad2.l16                        0
    128     8   long Pad2.l17                        0
    136     8   long Pad2.l18                        0
Instance size: 144 bytes
Space losses: 3 bytes internal + 0 bytes external = 3 bytes total
```

Now that `pleaseHelpMe` is allowed to take the gaps in the superclasses, field layouter pulls it out. Whoops.

The way out I see is to pad with the smallest data type:

```
public class HierarchyBytePadding {
  static class Pad1 {
    byte p000, p001, p002, p003, p004, p005, p006, p007;
    byte p008, p009, p010, p011, p012, p013, p014, p015;
    byte p016, p017, p018, p019, p020, p021, p022, p023;
    byte p024, p025, p026, p027, p028, p029, p030, p031;
    byte p032, p033, p034, p035, p036, p037, p038, p039;
    byte p040, p041, p042, p043, p044, p045, p046, p047;
    byte p048, p049, p050, p051, p052, p053, p054, p055;
    byte p056, p057, p058, p059, p060, p061, p062, p063;
  }

  static class Carrier extends Pad1 {
    byte pleaseHelpMe;
  }

  static class Pad2 extends Carrier {
    byte p100, p101, p102, p103, p104, p105, p106, p107;
    byte p108, p109, p110, p111, p112, p113, p114, p115;
    byte p116, p117, p118, p119, p120, p121, p122, p123;
    byte p124, p125, p126, p127, p128, p129, p130, p131;
    byte p132, p133, p134, p135, p136, p137, p138, p139;
    byte p140, p141, p142, p143, p144, p145, p146, p147;
    byte p148, p149, p150, p151, p152, p153, p154, p155;
    byte p156, p157, p158, p159, p160, p161, p162, p163;
  }

  static class UsableObject extends Pad2 {};
}
```

…which fills out all gaps, not letting our protected fields to float around:

```
$ jdk15-64/bin/java -jar jol-cli.jar internals -cp . HierarchyBytePadding\$UsableObject
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

HierarchyBytePadding$UsableObject object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                     VALUE
      0     4        (object header)                 05 00 00 00
      4     4        (object header)                 00 00 00 00
      8     4        (object header)                 08 7c 17 00
     12     1   byte Pad1.p000                       0
     13     1   byte Pad1.p001                       0
...
     74     1   byte Pad1.p062                       0
     75     1   byte Pad1.p063                       0
     76     1   byte Carrier.pleaseHelpMe            0  # GOOD
     77     1   byte Pad2.p100                       0
     78     1   byte Pad2.p101                       0
...
    139     1   byte Pad2.p162                       0
    140     1   byte Pad2.p163                       0
    141     3        (loss due to the next object alignment)
Instance size: 144 bytes
Space losses: 0 bytes internal + 3 bytes external = 3 bytes total
```

In fact, that is what [JMH does now](http://hg.openjdk.java.net/code-tools/jmh/rev/ee4b8b1f1523).

This still relies on implementation detail that fields from `Pad1` would be handled first and plug whatever holes there are in the superclass.

### 11.5. 观察：JDK 15 中“塔式填充”技巧的崩塌

遗憾的是，这也让那些依赖实现怪癖的朴素继承体系填充技巧崩塌了！请看：

既然 `pleaseHelpMe` 现在可以占用父类中的空隙了，字段布局器就把它抽了出来。哎呀。

我看到的出路是用最小的数据类型来填充：

……这样就把所有空隙都填满了，不让被保护的字段到处乱跑：

事实上，[JMH 现在就是这么做的](http://hg.openjdk.java.net/code-tools/jmh/rev/ee4b8b1f1523)。

这仍然依赖一个实现细节：`Pad1` 的字段会被首先处理，并填上父类中存在的任何空洞。

## 12. Conclusion

Java object internals story is complicated and full of static and dynamic trade-offs. The size of Java object can change depending on internal factors, like JVM bitness, JVM feature set, etc. The size can change depending on runtime configuration, like heap size, compressed references mode, GC used.

Looking at footprint story from JVM side, it becomes clear that compressed references play the extensive role in it. Even without references involved, they affect whether class word is compressed. Mark word would get more compact in 32-bit VMs, so that would also improve the footprint. (That also does not mention that VM-native pointers and machine-word-wide types would become much narrower).

From the Java (developer) perspective, knowing about object internals allows hiding fields in object alignment shadow, in field alignment gaps, without exploding the apparent instance size. On the other hand, adding just a single little field may baloon the instance size up considerable, and explaining why that happened inevitably involves reasoning about finer Object structure.

Last, but not least, tricking field layouter to put the fields in some order is quite hard and depends on implementation quirks. Those are still usable, there are less safer and more safer things to rely on. It needs additional verification for every JDK update you run with, anyway. You should definitely re-verify what you do when running on JDK 15 and later.

## 12. 结论

Java 对象内部结构这件事很复杂，充满了静态和动态的权衡。Java 对象的大小会随内部因素变化，比如 JVM 位数、JVM 功能集等；也会随运行时配置变化，比如堆大小、压缩引用模式、所使用的 GC。

从 JVM 的角度来看内存占用这件事，可以清楚地看到压缩引用在其中扮演了重要角色。即使不涉及引用，它们也会影响类字是否被压缩。而在 32 位 VM 中标记字会更紧凑，这同样能改善内存占用。（这还没算上 VM 本地指针和机器字宽类型都会变得更窄。）

从 Java（开发者）的角度看，了解对象内部结构之后，就可以把字段藏进对象对齐阴影和字段对齐空隙里，而不让实例表面大小暴涨。反过来，仅仅增加一个小小的字段，也可能让实例大小明显膨胀，而要解释为什么会这样，就离不开对对象更精细结构的推理。

最后但同样重要的一点是，想骗过字段布局器、让它按某种顺序放置字段相当困难，而且依赖于实现怪癖。这些技巧仍然可用，其中有的相对安全、有的相对不安全。无论如何，每次你所使用的 JDK 更新时，都需要额外验证。在 JDK 15 及更高版本上运行时，你肯定应该重新验证自己的做法。

------

[1](https://shipilev.net/jvm/objects-inside-out/#_footnoteref_1). There is, actually, one in `Instrumentation.getObjectSize`, but it requires the code to attach itself as JavaAgent.

其实 `Instrumentation.getObjectSize` 里就有一个，但它要求代码把自己作为 JavaAgent 挂载上去。

[2](https://shipilev.net/jvm/objects-inside-out/#_footnoteref_2). You can still use it, just build or get fastdebug build from somewhere. For example, [here](https://builds.shipilev.net/).

你仍然可以使用它，只要自己构建一个、或者从某处获取 fastdebug 版本即可。例如[这里](https://builds.shipilev.net/)。

[3](https://shipilev.net/jvm/objects-inside-out/#_footnoteref_3). This was exploited by some of the VM fixes, but ultimately too much external dependencies on Unsafe made it impractical.

一些 VM 修复曾经利用过这一点，但最终由于对 Unsafe 的外部依赖太多，导致它并不实用。

[4](https://shipilev.net/jvm/objects-inside-out/#_footnoteref_4). Contrary to popular belief perpetuated by confusing Javadoc, it is *not* the object address (which has a very low entropy), but rather the result from some internal PRNG.

与那些令人困惑的 Javadoc 所助长的普遍误解相反，它*并不是*对象地址（对象地址的熵非常低），而是某个内部 PRNG 的结果。

[5](https://shipilev.net/jvm/objects-inside-out/#_footnoteref_5). In current Hotspot, `-XX:+CompressedKlassPointers` is predicated on `-XX:+CompressedOops`, but that is implementation constraint, not the design one. You [can have compressed klass pointers without compressed oops](https://bugs.openjdk.java.net/browse/JDK-8241825), but that exposes you to yet another configuration that you would need to maintain everywhere, and most likely in platform-specific code.

在当前的 Hotspot 中，`-XX:+CompressedKlassPointers` 以 `-XX:+CompressedOops` 为前提，但这是实现上的约束，而不是设计上的约束。你[可以只启用压缩类指针而不启用压缩对象指针](https://bugs.openjdk.java.net/browse/JDK-8241825)，但这样你就又要面对一种需要到处维护的配置组合，而且很可能是在平台相关代码里维护。

Last updated 2020-08-24 13:15:45 +0200






## 相关链接


- 原文链接: https://shipilev.net/jvm/objects-inside-out/
