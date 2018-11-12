# What is the memory consumption of an object in Java?

# Java中一个对象占用的内存空间

> ### Question
> Is the memory space consumed by one object with 100 attributes the same as that of 100 objects, with one attribute each?
>
> How much memory is allocated for an object?
>
> How much additional space is used when adding an attribute?

> # # #的问题
>是100的内存空间被一个对象属性一样的100年的对象,一个属性吗?
>
>为对象分配多少内存?
>
>多少额外的空间用于当添加一个属性吗?

# Answer1

# Answer1

[Mindprod](http://mindprod.com/jgloss/sizeof.html) points out that this is not a straightforward question to answer:

(Mindprod)(http://mindprod.com/jgloss/sizeof.html)指出,这不是一个简单的问题来回答:

> A JVM is free to store data any way it pleases internally, big or little endian, with any amount of padding or overhead, though primitives must behave as if they had the official sizes.
> For example, the JVM or native compiler might decide to store a `boolean[]` in 64-bit long chunks like a `BitSet`. It does not have to tell you, so long as the program gives the same answers.
> - It might allocate some temporary Objects on the stack.
> - It may optimize some variables or method calls totally out of existence replacing them with constants.
> - It might version methods or loops, i.e. compile two versions of a method, each optimized for a certain situation, then decide up front which one to call.
> Then of course the hardware and OS have multilayer caches, on chip-cache, SRAM cache, DRAM cache, ordinary RAM working set and backing store on disk. Your data may be duplicated at every cache level. All this complexity means you can only very roughly predict RAM consumption.

> JVM可以任何方式存储数据内部、大或小端字节序,与任何数量的填充或开销,尽管原语必须表现得好像他们有官方的大小。
> 例如,JVM或本机编译器可能决定存储`boolean[]`在64位长像一块`BitSet`。它没有告诉你,只要程序给出了相同的答案。
> ——它可能会分配一些临时对象在堆栈上。
> ——它可能优化一些变量或方法调用完全消失代之以常量。
> ——它可能版本方法或循环,即编译方法的两个版本,每个优化在一定情况下,然后预先决定调用哪一个。
> 当然,硬件和操作系统多层缓存,chip-cache,SRAM缓存,缓存DRAM,普通内存工作集和支持存储在磁盘上。你的数据可能会重复在每个缓存水平.所有这些复杂性意味着你只能大致预测内存消耗。

## Measurement methods

## 测量方法

You can use [`Instrumentation.getObjectSize()`](https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/Instrumentation.html#getObjectSize-java.lang.Object-) to obtain an estimate of the storage consumed by an object.

您可以使用[`Instrumentation.getObjectSize()`)(https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/Instrumentation.html getObjectSize-java.lang.Object)获得估计所消耗的存储一个对象。

To visualize the *actual* object layout, footprint, and references, you can use the [JOL (Java Object Layout) tool](http://openjdk.java.net/projects/code-tools/jol/).

*实际*对象布局,形象化的足迹,和引用,您可以使用(约尔(Java对象布局)工具)(http://openjdk.java.net/projects/code-tools/jol/)。

## Object headers and Object references

## 对象头和对象引用

In a modern 64-bit JDK, an object has a 12-byte header, padded to a multiple of 8 bytes, so the minimum object size is 16 bytes. For 32-bit JVMs, the overhead is 8 bytes, padded to a multiple of 4 bytes. *(From Dmitry Spikhalskiy's answer, Jayen's answer, and JavaWorld.)*

在现代64位JDK中,一个对象有一个由12头,快步走向一个8字节的倍数,所以最小对象大小是16个字节.对于32位jvm,头顶上是8个字节,快步走向一个4字节的倍数。*(Dmitry Spikhalskiy的回答,Jayen的回答,和JavaWorld)。*

Typically, references are 4 bytes on 32bit platforms or on 64bit platforms up to `-Xmx32G`; and 8 bytes above 32Gb (`-Xmx32G`). *(See compressed object references.)*

通常,引用4字节在32位平台上或在64位平台上`-Xmx32G`;和8字节以上32 gb(`-Xmx32G`)。*(见压缩对象引用。)*

As a result, a 64-bit JVM would typically require 30-50% more heap space. *(Should I use a 32- or a 64-bit JVM?, 2012, JDK 1.7)*

因此,64位JVM通常需要30 - 50%的堆空间。*(我应该使用32位或64位JVM ?,2012年,JDK 1.7)*

## Boxed types, arrays, and strings

## 盒装类型、数组和字符串

Boxed wrappers have overhead compared to primitive types (from [JavaWorld](http://www.javaworld.com/javaworld/javatips/jw-javatip130.html)):

装箱包装有开销相比原始类型(从[JavaWorld](http://www.javaworld.com/javaworld/javatips/jw-javatip130.html)):

> - **Integer**: The 16-byte result is a little worse than I expected because an `int` value can fit into just 4 extra bytes. Using an `Integer` costs me a 300 percent memory overhead compared to when I can store the value as a primitive type
> - **Long**: 16 bytes also: Clearly, actual object size on the heap is subject to low-level memory alignment done by a particular JVM implementation for a particular CPU type. It looks like a `Long` is 8 bytes of Object overhead, plus 8 bytes more for the actual long value. In contrast, `Integer` had an unused 4-byte hole, most likely because the JVM I use forces object alignment on an 8-byte word boundary.

> - * *整数* *:字节的结果是一个小比我预期的,因为一个`int`价值可以放入4额外的字节。使用一个`Integer`成本我300%的内存开销相比,当我可以存储的值作为一个原始类型
> - * * * *长:16字节也:显然,堆上的实际对象的大小受底层内存对齐由特定JVM实现一个特定的CPU类型。它看起来像一个`Long`是8个字节的对象的开销,加上长8字节的实际价值。相比之下,`Integer`有一个未使用的4字节的洞,最有可能的,因为我使用的JVM部队对象8字节字边界对齐。

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

> - * *多维数组* *:它提供了另一个惊喜。
>开发人员通常都使用构造`int[dim1][dim2]`在数值和科学计算。
>
>在`int[dim1][dim2]`数组实例,每一个嵌套的`int[dim2]`数组是一个`Object`在自己的权利。每个增加通常16字节数组开销。当我不需要一个三角形的或粗糙的数组,代表纯开销。生长的影响当阵列尺寸大大不同。
>
例如,>`int[128][2]`实例占用3600字节。相比1040字节`int[256]`实例使用(有相同的能力),3600个字节代表246%的开销。在极端的情况下`byte[256][1]`,开销因素几乎是19 !比较的C / c++的情况相同的语法不添加任何存储开销。
>
> - * * * *的字符串:a`String`的内存增长轨道内部字符数组的增长。然而,`String`类增加了另一个24字节的开销。
>
>一个非空的`String`添加10个字符大小或更少的开销成本相对于有用的有效载荷(2字节为每个字符+ 4个字节长度),范围从400%到100。

## Alignment

## 对齐

Consider this [example object](https://plumbr.eu/blog/memory-leaks/how-much-memory-do-i-need-part-2-what-is-shallow-heap):

考虑一下这个(例如对象)(https://plumbr.eu/blog/memory-leaks/how-much-memory-do-i-need-part-2-what-is-shallow-heap):

```
class X {                      // 8 bytes for reference to the class definition
   int a;                      // 4 bytes
   byte b;                     // 1 byte
   Integer c = new Integer();  // 4 bytes for a reference
}
```



A naïve sum would suggest that an instance of `X` would use 17 bytes. However, due to alignment (also called padding), the JVM allocates the memory in multiples of 8 bytes, so instead of 17 bytes it would allocate 24 bytes.

一个天真和建议的一个实例`X`会使用17字节。然而,由于对齐(也称为填充),8个字节的倍数的JVM分配内存,而不是17字节分配24字节。


## Comments

## 评论

- int[128][6]: 128 arrays of 6 ints - 768 ints in total, 3072 bytes of data + 2064 bytes Object overhead = 5166 bytes total. int[256]: 256 ints in total - therefore non-comparable. int[768]: 3072 bytes of data + 16 byes overhead - about 3/5th of the space of the 2D array - not quite 246% overhead!
  - Ah, the original article used int[128][2] not int[128][6] - wonder how that got changed. Also shows that extreme examples can tell a different story.
  - I have fixed the typos. int[128][2] became int[128][6] because of a bug in the Javascript editor: the links are referenced with [aTest][x] and the editor assumed [128][2] to be an link address! It did "re-order" the indexes of those links, changing the [2] into [6]... tricky!
    * This answer is outdated because lots of people are using 64bit JVM's these days and your answer is effectively ignoring 64bit JVM's. It's good to say "well, it depends..." but it's also good to give some good practical advice - things that are true for 99% of JVM's out there such as "8 bytes for 32bit, 12 bytes + 8-byte alignment for 64 bit, plus pointers are 8 bytes above -Xmx32G". – Tim Cooper Feb 15 '16 at 10:43

——int[128][6]:128 6 int - 768整数数组总共3072字节的数据+ 2064字节对象总开销= 5166字节。int[256]:256 int -因此消逝.int[]:768 3072字节数据+ 16 byes采用- about the 3/5th空间数组2D - not去除246%采用!
——啊,原文使用int[128][2]不是int[128][6],想知道有改变。还表明,极端的例子可以告诉一个不同的故事。
我有固定的拼写错误.int[128][2]成为int[128][6],因为Javascript编辑器中的一个错误:链接引用[aTest][x]和编辑认为[128][2]是一个链接地址!“重新订货”的索引链接,改变[2]到[6]…棘手的!
*这个答案是过时的,因为很多人正在使用64位JVM的这些天,你的答案是有效地无视64位JVM。说“嗯,这取决于真好. ..”,但这也是好给一些实用的建议,事情是真的99%的JVM的如“8个字节为32位,64位12字节+ 8字节对齐,+指针是8个字节-Xmx32G之上”。——蒂姆·库珀2月15 16岁十43

- The overhead is 16 bytes in 64bit JVM's.
  - No! The overhead (= new Object()) of Sun VM Java 1.6 64bit running on Win7 64 bit Intel is 12 bytes + 4 padding to next multiple of 8 makes 16 bytes. So if you have an object with one field int, it is still 16 bytes. (no padding)
    * Some garbage-collection schemes may impose a minimum object size which is separate from padding. During garbage collection, once an object gets copied from an old location to a new one, the old location may not need to hold the data for the object any more, but it will need to hold a reference to the new location; it may also need to store a reference to the old location of the object wherein the first reference was discovered and the offset of that reference within the old object [since the old object may still contain references that haven't yet been processed].
    * Using memory at an object's old location to hold the garbage-collector's book-keeping information avoids the need to allocate other memory for that purpose, but may impose a minimum object size which is larger than would otherwise be required. I think at least one version of .NET garbage collector uses that approach; it would certainly be possible for some Java garbage collectors to do so as well. – supercat Sep 19 '14 at 16:38

——64位JVM的开销是16字节。
——不!的开销(=新对象())的阳光VM这个主题上运行的Java 1.6 64位64位英特尔+ 4等于12字节填充下8使16字节的倍数.如果你有一个int对象与一个字段,它仍然是16字节。(没有填充)
*一些垃圾收集计划可能强加一个最小对象大小填充分开.在垃圾收集,一旦一个对象被从一个旧的位置复制到一个新的,旧的位置可能不需要持有对象的数据,但它需要持有新位置的引用;它也可能需要存储的老位置对象的引用中第一个参考被发现和弥补的 在旧的对象的引用(由于旧对象可能仍然包含引用尚未处理)。
*使用内存对象的老位置来控制垃圾收集器的簿记信息避免了需要分配其他的内存,但可能强加一个最小对象大小超过需要。我认为至少有一个版本的.净垃圾收集器使用这种方法;它肯定是一些Java垃圾收集器可以这样做。——supercat 9月19日在十六14



<https://stackoverflow.com/questions/258120/what-is-the-memory-consumption-of-an-object-in-java/258150>
