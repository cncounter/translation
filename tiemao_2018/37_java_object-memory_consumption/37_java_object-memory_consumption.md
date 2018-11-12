# What is the memory consumption of an object in Java?

# Java中一个对象占用的内存空间

> **说明**: alignment, 对齐; padding, 补齐; 在本文中两者同一个意思。


> ### Question
> Is the memory space consumed by one object with 100 attributes the same as that of 100 objects, with one attribute each?
>
> How much memory is allocated for an object?
>
> How much additional space is used when adding an attribute?

> ### 问题描述
> 具有100个属性的一个对象占用的内存空间大, 还是具有单一属性的100个对象占用的内存空间大?
>
> 每个对象会分配多少内存?
>
> 每增加一个属性时，对象会占用多少空间?

# Answer1

# 答案1

[Mindprod](http://mindprod.com/jgloss/sizeof.html) points out that this is not a straightforward question to answer:

[Mindprod](http://mindprod.com/jgloss/sizeof.html) 指出, 这不是一个简单的问题:

> A JVM is free to store data any way it pleases internally, big or little endian, with any amount of padding or overhead, though primitives must behave as if they had the official sizes.
> For example, the JVM or native compiler might decide to store a `boolean[]` in 64-bit long chunks like a `BitSet`. It does not have to tell you, so long as the program gives the same answers.
> - It might allocate some temporary Objects on the stack.
> - It may optimize some variables or method calls totally out of existence replacing them with constants.
> - It might version methods or loops, i.e. compile two versions of a method, each optimized for a certain situation, then decide up front which one to call.
> Then of course the hardware and OS have multilayer caches, on chip-cache, SRAM cache, DRAM cache, ordinary RAM working set and backing store on disk. Your data may be duplicated at every cache level. All this complexity means you can only very roughly predict RAM consumption.

> JVM实现可以以任意方式存储内部数据, 比如大端字节序或者小端字节序, 还可以设置任意的补齐、或者增加额外的开销, 尽管行为上必须和官方的JVM规范表现一致。
> 例如, JVM或者本机编译器可以决定是否将 `boolean[]` 存储到64个bit的内存块中, 就类似于一个 `BitSet`。 但是提供商没必要告诉你这些细节, 只要程序运行结果一致即可。
>  - JVM可能会在栈上分配一些临时对象。
>  - JVM可能优化某些变量或方法调用, 用已存在的常量来代替。
>  - JVM可能会对方法和循环生成多个版本; 例如, 将方法编译为两个版本, 每种情况下生成一个, 然后根据先决条件来确定调用哪一个。
> 当然, 硬件和操作系统都存在多级缓存, 例如CPU内置的L1/L2/L3; SRAM缓存, DRAM缓存, 普通内存, 以及磁盘上的虚拟内存。用户数据可能会在多级缓存中存在拷贝. 所有这些复杂的情况、决定了我们只能对内存消耗进行大致的预测。

## Measurement methods

## 测量方法

You can use [`Instrumentation.getObjectSize()`](https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/Instrumentation.html#getObjectSize-java.lang.Object-) to obtain an estimate of the storage consumed by an object.

我们可以使用 [`Instrumentation.getObjectSize()`](https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/Instrumentation.html#getObjectSize-java.lang.Object-) 方法来预估一个对象的内存消耗。

To visualize the *actual* object layout, footprint, and references, you can use the [JOL (Java Object Layout) tool](http://openjdk.java.net/projects/code-tools/jol/).

要查看实际的对象布局、足迹、以及引用, 可以使用 [JOL (Java Object Layout) 工具](http://openjdk.java.net/projects/code-tools/jol/)。

## Object headers and Object references

## 对象头与对象引用

In a modern 64-bit JDK, an object has a 12-byte header, padded to a multiple of 8 bytes, so the minimum object size is 16 bytes. For 32-bit JVMs, the overhead is 8 bytes, padded to a multiple of 4 bytes. *(From Dmitry Spikhalskiy's answer, Jayen's answer, and JavaWorld.)*

在64位JVM中, 对象头占据的空间是 12个字节(byte), 但是以8的倍数对齐(64=8*8), 所以一个对象最少占用 16 个字节。

至于32位JVM, 对象头占用8个字节, 以4的倍数对齐(32=4*8)。(参见 Dmitry Spikhalskiy 的回答,Jayen的回答, 以及 JavaWorld 网站)。

Typically, references are 4 bytes on 32bit platforms or on 64bit platforms up to `-Xmx32G`; and 8 bytes above 32Gb (`-Xmx32G`). *(See compressed object references.)*

通常, 在32位平台, 以及小于 `32GB` 内存空间的 64 位平台上, 一个对象引用占用的内存是`4`个字节。(请参考压缩对象引用)

As a result, a 64-bit JVM would typically require 30-50% more heap space. *(Should I use a 32- or a 64-bit JVM?, 2012, JDK 1.7)*

因此, 64位JVM一般需要消耗额外的 30%-50% 堆内存。*(参考: Should I use a 32- or a 64-bit JVM?, 2012, JDK 1.7)*

## Boxed types, arrays, and strings

## 包装类型、数组和字符串

Boxed wrappers have overhead compared to primitive types (from [JavaWorld](http://www.javaworld.com/javaworld/javatips/jw-javatip130.html)):

包装类型比原生数据类型需要多消耗一些内存, 参考 [JavaWorld](http://www.javaworld.com/javaworld/javatips/jw-javatip130.html) :

> - **Integer**: The 16-byte result is a little worse than I expected because an `int` value can fit into just 4 extra bytes. Using an `Integer` costs me a 300 percent memory overhead compared to when I can store the value as a primitive type
> - **Long**: 16 bytes also: Clearly, actual object size on the heap is subject to low-level memory alignment done by a particular JVM implementation for a particular CPU type. It looks like a `Long` is 8 bytes of Object overhead, plus 8 bytes more for the actual long value. In contrast, `Integer` had an unused 4-byte hole, most likely because the JVM I use forces object alignment on an 8-byte word boundary.

> - **Integer**: 占用16字节(8+4=12), 比我预期的结果要好一点, 因为 `int` 值占用4个字节。使用 `Integer` 比起原生数据类型 `int` 要多消耗 300% 的内存。
> - **Long**: 也只占用16个字节(8+8=16): 显然, 对象的实际大小由底层内存对齐确定, 具体由特定CPU平台的JVM实现决定。 看起来是这样的: 一个`Long` 类型的对象, 是8字节的Object开销, 加上8字节的long值组成。相比之下, `Integer`有4字节的未使用部分, 很可能是因为我使用的JVM强制进行8字节边界对齐。

Other containers are costly too:

其他容器也是昂贵的:

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
>   开发人员在编码时, 通常使用 `int[dim1][dim2]` 这种构造方式。
>
>   在二维数组 `int[dim1][dim2]` 中, 每个嵌套的 `int[dim2]` 数组都是一个单独的 `Object`。每个都会增加16字节的开销。某些情况下，这种开销就是一种浪费, 属于纯开销。当数组维度差距很大时，这种开销就特别明显。
>   例如, `int[128][2]` 实例占用`3600字节`。 而 `int[256]` 实例则只占用`1040字节`。存储空间是相同的, 3600比起1040来说是246%的额外开销。在极端情况下`byte[256][1]`, 额外开销比例是19倍! 而在 C/C++ 中,  同样的语法却不增加任何额外的存储开销。
>
> - **String**: 一个 `String` 对象的空间占用，随着内部字符数组的增长而增长。当然, `String`类增加了额外24个字节的开销。
>
>   对于10字符以内的非空的`String`, 增加的额外开销相对于有效载荷(每个字符2个字节 + 4个字节的length), 其比例在100%到400%之间。

## Alignment

## 对齐

Consider this [example object](https://plumbr.eu/blog/memory-leaks/how-much-memory-do-i-need-part-2-what-is-shallow-heap):

看这个 [示例对象](https://plumbr.eu/blog/memory-leaks/how-much-memory-do-i-need-part-2-what-is-shallow-heap):


```
class X {                      // 8 字节-指向class定义的引用
   int a;                      // 4 字节
   byte b;                     // 1 字节
   Integer c = new Integer();  // 4 字节的引用
}
```



A naïve sum would suggest that an instance of `X` would use 17 bytes. However, due to alignment (also called padding), the JVM allocates the memory in multiples of 8 bytes, so instead of 17 bytes it would allocate 24 bytes.

新手可能会认为, 一个`X`类的实例占用17个字节的空间。但由于需要对齐(也称为补齐), JVM分配的内存的8个字节的整数倍, 所以不是17字节而是24字节。



参考: <https://stackoverflow.com/questions/258120/what-is-the-memory-consumption-of-an-object-in-java/258150>

