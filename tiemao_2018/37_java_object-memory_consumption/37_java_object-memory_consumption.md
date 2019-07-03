# What is the memory consumption of an object in Java?

# 解析一个Java对象占用多少内存空间

> **说明**: alignment, 对齐, 比如8字节的数据, 起始地址必须是8的整数倍。
> 
> padding, 补齐; 在对象所占据空间的末尾,如果有空白, 需要使用padding, 因为下一个对象需要对齐。


> ### Question
> Is the memory space consumed by one object with 100 attributes the same as that of 100 objects, with one attribute each?
>
> How much memory is allocated for an object?
>
> How much additional space is used when adding an attribute?

> ### 问题描述
> 一个对象具有100个属性, 与100个对象每个具有1个属性, 哪个占用的内存空间更大?
>
> 一个对象会分配多少内存?
>
> 每增加一个属性，对象占用的空间会增加多少?

# Answer1

# 答案1

[Mindprod](http://mindprod.com/jgloss/sizeof.html) points out that this is not a straightforward question to answer:

参考 [Mindprod](http://mindprod.com/jgloss/sizeof.html) , 可以发现这个问题并不简单:

> A JVM is free to store data any way it pleases internally, big or little endian, with any amount of padding or overhead, though primitives must behave as if they had the official sizes.
> For example, the JVM or native compiler might decide to store a `boolean[]` in 64-bit long chunks like a `BitSet`. It does not have to tell you, so long as the program gives the same answers.
> - It might allocate some temporary Objects on the stack.
> - It may optimize some variables or method calls totally out of existence replacing them with constants.
> - It might version methods or loops, i.e. compile two versions of a method, each optimized for a certain situation, then decide up front which one to call.
> Then of course the hardware and OS have multilayer caches, on chip-cache, SRAM cache, DRAM cache, ordinary RAM working set and backing store on disk. Your data may be duplicated at every cache level. All this complexity means you can only very roughly predict RAM consumption.

--

> JVM具体实现可以用任意形式来存储内部数据, 可以是大端字节序或者小端字节序(big or little endian), 还可以增加任意数量的补齐、或者开销, 尽管原生数据类型(primitives)的行为必须符合规范。
> 例如, JVM或者本地编译器可以决定是否将 `boolean[]` 存储为64bit的内存块中, 类似于 `BitSet`。 厂商可以不告诉你这些细节, 只要程序运行结果一致即可。
>  - JVM可以在栈(stack)空间分配某些临时对象。
>  - 编译器可能用常量来替换某些变量或方法调用。
>  - JVM可能对方法和循环生成多个编译版本; 例如, 编译两种版本的方法, 针对某些情况调用其中的一个。
> 当然, 硬件平台和操作系统还会有多级缓存, 例如CPU内置的L1/L2/L3; SRAM缓存, DRAM缓存, 普通内存, 以及磁盘上的虚拟内存。 用户数据可能在多个层级的缓存中出现. 这么多复杂的情况、决定了我们只能对内存占用情况进行大致的估测。

## Measurement methods

## 测量方法

You can use [`Instrumentation.getObjectSize()`](https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/Instrumentation.html#getObjectSize-java.lang.Object-) to obtain an estimate of the storage consumed by an object.

可以使用 [`Instrumentation.getObjectSize()`](https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/Instrumentation.html#getObjectSize-java.lang.Object-) 方法来估算一个对象占用的内存空间。

To visualize the *actual* object layout, footprint, and references, you can use the [JOL (Java Object Layout) tool](http://openjdk.java.net/projects/code-tools/jol/).

想要查看对象的实际布局(layout)、占用(footprint)、以及引用(reference), 可以使用OpenJDK提供的 [JOL工具(Java Object Layout)](http://openjdk.java.net/projects/code-tools/jol/)。

## Object headers and Object references

## 对象头和对象引用

In a modern 64-bit JDK, an object has a 12-byte header, padded to a multiple of 8 bytes, so the minimum object size is 16 bytes. For 32-bit JVMs, the overhead is 8 bytes, padded to a multiple of 4 bytes. *(From Dmitry Spikhalskiy's answer, Jayen's answer, and JavaWorld.)*

在64位JVM中, 对象头占据的空间是 `12-byte`(=96bit=64+32), 但是以8字节对齐, 所以一个对象最少占用16字节。

在32位JVM中, 对象头占用8个字节, 以4的倍数对齐(32=4*8)。(请参考 Dmitry Spikhalskiy,Jayen的回答,以及JavaWorld网站)。

Typically, references are 4 bytes on 32bit platforms or on 64bit platforms up to `-Xmx32G`; and 8 bytes above 32Gb (`-Xmx32G`). *(See compressed object references.)*

通常, 在32位JVM, 以及内存小于 `-Xmx32G` 的64位JVM上, 一个引用占的内存是`4`个字节。(指针压缩)

As a result, a 64-bit JVM would typically require 30-50% more heap space. *(Should I use a 32- or a 64-bit JVM?, 2012, JDK 1.7)*

因此, 64位JVM一般需要多消耗 30%-50% 堆内存。*(参考: Should I use a 32- or a 64-bit JVM?, 2012, JDK 1.7)*

## Boxed types, arrays, and strings

## 包装类型、数组和字符串

Boxed wrappers have overhead compared to primitive types (from [JavaWorld](http://www.javaworld.com/javaworld/javatips/jw-javatip130.html)):

包装类型比原生数据类型消耗的内存要多, 参考 [JavaWorld](http://www.javaworld.com/javaworld/javatips/jw-javatip130.html) :

> - **Integer**: The 16-byte result is a little worse than I expected because an `int` value can fit into just 4 extra bytes. Using an `Integer` costs me a 300 percent memory overhead compared to when I can store the value as a primitive type
> - **Long**: 16 bytes also: Clearly, actual object size on the heap is subject to low-level memory alignment done by a particular JVM implementation for a particular CPU type. It looks like a `Long` is 8 bytes of Object overhead, plus 8 bytes more for the actual long value. In contrast, `Integer` had an unused 4-byte hole, most likely because the JVM I use forces object alignment on an 8-byte word boundary.

> - **Integer**: 占用16字节(8+4=12+补齐), 因为 `int` 只占用4个字节。 所以使用 `Integer` 比原生类型 `int` 要多消耗 300% 的内存。
> - **Long**:  一般占用16个字节(8+8=16):  当然, 对象的实际大小由底层平台的内存对齐确定, 具体由特定CPU平台的JVM实现决定。 看起来一个`Long` 类型的对象, 比起原生类型long多占用了8个字节。 相比之下, `Integer`有4字节的补齐, 很可能是因为JVM强制进行了8字节的边界对齐。

Other containers are costly too:

其他容器占用的空间也不小:

> - **Multidimensional arrays**: it offers another surprise.
>   Developers commonly employ constructs like `int[dim1][dim2]` in numerical and scientific computing.
>
>   In an `int[dim1][dim2]` array instance, every nested `int[dim2]` array is an `Object` in its own right. Each adds the usual 16-byte array overhead. When I don't need a triangular or ragged array, that represents pure overhead. The impact grows when array dimensions greatly differ.
>
>   For example, a `int[128][2]` instance takes 3,600 bytes. Compared to the 1,040 bytes an `int[256]` instance uses (which has the same capacity), 3,600 bytes represent a 246 percent overhead. In the extreme case of `byte[256][1]`, the overhead factor is almost 19! Compare that to the C/C++ situation in which the same syntax does not add any storage overhead.
>
> - **String**: a `String`'s memory growth tracks its internal char array's growth. However, the `String` class adds another 24 bytes of overhead.
>
>   For a nonempty `String` of size 10 characters or less, the added overhead cost relative to useful payload (2 bytes for each char plus 4 bytes for the length), ranges from 100 to 400 percent.

> - **多维数组**: 这是另一个惊喜。
>   在进行数值或科学计算时, 开发人员经常会使用 `int[dim1][dim2]` 这种构造方式。
>
>   在二维数组 `int[dim1][dim2]` 中, 每个嵌套的数组 `int[dim2]` 都是一个单独的 `Object`, 会额外占用16字节的空间。某些情况下，这种开销是一种浪费。当数组维度更大时，这种开销特别明显。
>   例如, `int[128][2]` 实例占用`3600字节`。 而 `int[256]` 实例则只占用`1040字节`。里面的有效存储空间是一样的, 3600比起1040多了246%的额外开销。在极端情况下, `byte[256][1]`, 额外开销的比例是19倍! 而在 C/C++ 中,  同样的语法却不增加额外的存储开销。
>
> - **String**:  `String` 对象的空间随着内部字符数组的增长而增长。当然, `String` 类的对象有24个字节的额外开销。
>
>   对于10字符以内的非空 `String`, 增加的开销比起有效载荷(每个字符2字节 + 4个字节的length), 多占用了100%到400%的内存。

## Alignment

## 对齐(Alignment)

Consider this [example object](https://plumbr.eu/blog/memory-leaks/how-much-memory-do-i-need-part-2-what-is-shallow-heap):

看下面的 [示例对象](https://plumbr.eu/blog/memory-leaks/how-much-memory-do-i-need-part-2-what-is-shallow-heap):


```
class X {                      // 8 字节-指向class定义的引用
   int a;                      // 4 字节
   byte b;                     // 1 字节
   Integer c = new Integer();  // 4 字节的引用
}
```



A naïve sum would suggest that an instance of `X` would use 17 bytes. However, due to alignment (also called padding), the JVM allocates the memory in multiples of 8 bytes, so instead of 17 bytes it would allocate 24 bytes.

新手可能会认为, 一个`X`类的实例占用17字节的空间。 但由于需要对齐,也可称为补齐(padding), JVM分配的内存是8字节的整数倍, 所以占用的空间不是17字节,而是24字节。


# JOL使用示例

JOL (Java Object Layout) is the tiny toolbox to analyze object layout schemes in JVMs. These tools are using Unsafe, JVMTI, and Serviceability Agent (SA) heavily to decoder the actual object layout, footprint, and references. This makes JOL much more accurate than other tools relying on heap dumps, specification assumptions, etc.

JOL (Java Object Layout) 是分析JVM中内存布局的小工具, 通过 `Unsafe`, `JVMTI`, 以及 Serviceability Agent (SA) 来解码实际的对象布局,占用,引用。 所以 JOL 比起基于 heap dump, 或者基于规范的工具来得准确。

JOL的官网地址为: <http://openjdk.java.net/projects/code-tools/jol/>

从中可以看到:

- JOL支持命令行方式的调用, 即 jol-cli。

  下载页面请参考 Maven中央仓库: <http://central.maven.org/maven2/org/openjdk/jol/jol-cli/>; 比如下载其中的 `jol-cli-0.9-full.jar` 文件。

- JOL还支持代码方式调用, 示例下载页面: <http://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/>;

  相关的依赖可以在Maven中央仓库找到:

  ```
  <dependency>
      <groupId>org.openjdk.jol</groupId>
      <artifactId>jol-core</artifactId>
      <version>0.9</version>
  </dependency>
  ```

  搜索页面: <https://mvnrepository.com/search?q=jol-core>




参考: 

- <https://stackoverflow.com/questions/258120/what-is-the-memory-consumption-of-an-object-in-java/258150>

- <http://openjdk.java.net/projects/code-tools/jol/>

本文最新翻译地址: <https://github.com/cncounter/translation/blob/master/tiemao_2018/37_java_object-memory_consumption/37_java_object-memory_consumption.md>

翻译日期: 019年7月4日

翻译人员: 铁锚 <https://renfufei.blog.csdn.net/>

