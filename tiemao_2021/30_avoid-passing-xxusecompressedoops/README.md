# Avoid passing `-XX:+UseCompressedOops`

# 不需要再手工指定JVM启动参数 `-XX:+UseCompressedOops`


Since we are analyzing thousands of Garbage Collection logs every single day through our [GCeasy tool](https://gceasy.io/), we are noticing several java applications still continuing to use `-XX:+UseCompressedOops` JVM argument. Actually, it's not required to pass `-XX:+UseCompressedOops` JVM argument if you are running in Java SE 6 update 23 and later. Compressed oops is supported and enabled by default in Java SE 6u23 and later versions.

技术团队通过 [GCeasy](https://gceasy.io/)  工具分析完几千次用户上传的GC日志后, 发现一个现象:  仍然有很多Java程序传入了JVM启动参数 `-XX:+UseCompressedOops`。
实际上，如果JVM的版本在 Java SE 6 update 23 及以上, 则不需要再设置 `-XX:+UseCompressedOops` 参数, 因为默认会开启。


“OOP” means Ordinary Object Pointer. It means a managed pointer to an object. An OOP is usually the same size as a native machine pointer, which means an OOP is 64 bits on a 64-bit operating system and 32 bits on a 32-bit operating system.

“OOP” 表示普通对象指针(Ordinary Object Pointer), 这种指针是对某个对象的托管指针(managed pointer)。 OOP占用的空间长度通常与宿主机的原生指针(native machine pointer)一样; 也就是说, 在64位操作系统上OOP就是64位, 在32位操作系统上OOP就占32位。


In a 32-bit operating system, JVM can address only up to 4GB (i.e., 2 ^ 32) memory. To manage larger amounts of memory, the JVM needs to run with 64-bit OOP, which can manage 18.5 Exabytes (i.e., 2 ^ 64 bytes). Very large size :-). Actually, there aren't any servers in the world which has so much memory.

由于操作系统的限制，32位版本的JVM, 内存地址空间最大只能到 4GB(`2 ^ 32`字节)。
如果要管理更大的内存，需要使用64位JVM。
而如果JVM使用64位OOP，则最多可以管理 18.5 Exabytes(`2 ^ 64`字节）。
这是一个非常大的空间。 当今世界上还没有哪台服务器有这么大的物理内存。

> 那么问题来了: 64位JVM上, 使用32位的压缩指针如何管理32GB内存呢?
> 我们可以注意到 4x8=32; 想一下, 如果内存地址使用8字节对齐(8x8=64bit), 再进行映射和换算, 是不是就可以放大8倍了?
> 当然, 这样处理的话, 要更精细的操作单个字节就不容易了。
> 想要了解JVM的内存布局和对齐机制, 可以参考: [解析一个Java对象占用多少内存空间](https://blog.csdn.net/renfufei/article/details/95758333)


What this means is that for a twice as big address, a much larger memory area can be addressed. But this doesn`t comes at `free of cost`. When you switch from a 32-bit JVM to a 64-bit JVM, you will notice the loss of available memory by 1.5 times due to larger addresses. To fix this problem, JVM developers invented `Compressed Oops` feature. More details about this compressed OOPs can be found here.

存储指针的内存空间放大1倍，可以定位更大的内存区域。
但这并非 “没有代价”。
从32位JVM切换到64位JVM，你会发现可用内存的消耗会变成原来的1.5倍左右, 这是因为存储地址指针的空间消耗变大了。
为了解决这个问题，JVM开发人员发明了 `Compressed Oops` 功能。 关于压缩指针(compressed OOPs)的详细信息请参考: [HotSpot JVM Performance Enhancements
](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/performance-enhancements-7.html) 。


To activate this feature, you were required to pass `-XX:+UseCompressedOops` JVM argument. However, starting from Java SE 6u23 and later versions, the use of compressed oops is made as default. Thus you don't need to pass this flag explicitly anymore.

要启用这个功能，可以传入JVM启动参数 `-XX:+UseCompressedOops`。
但从 Java SE 6U23 开始，JVM会默认开启压缩指针。
因此, 我们不需要再手动传递这个参数。


- 原文链接: [Avoid passing -XX:+UseCompressedOops](https://blog.gceasy.io/2020/04/16/avoid-passing-xxusecompressedoops/)
- GitHub版本: [不需要再手工指定JVM启动参数 `-XX:+UseCompressedOops`](https://github.com/cncounter/translation/blob/master/tiemao_2021/30_avoid-passing-xxusecompressedoops/README.md)
- Gitee版本: [不需要再手工指定JVM启动参数 `-XX:+UseCompressedOops`](https://gitee.com/cncounter/translation/blob/master/tiemao_2021/30_avoid-passing-xxusecompressedoops/README.md)
