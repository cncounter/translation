# Avoid passing `-XX:+UseCompressedOops`

# 请不要再手工指定JVM启动参数 `-XX:+UseCompressedOops`


Since we are analyzing thousands of Garbage Collection logs every single day through our [GCeasy tool](https://gceasy.io/), we are noticing several java applications still continuing to use `-XX:+UseCompressedOops` JVM argument. Actually, it's not required to pass `-XX:+UseCompressedOops` JVM argument if you are running in Java SE 6 update 23 and later. Compressed oops is supported and enabled by default in Java SE 6u23 and later versions.

[GCeasy](https://gceasy.io/) 技术团队通过工具分析了成千上万次GC日志后, 发现仍然有很多程序在使用JVM启动参数 `-XX:+UseCompressedOops`。
实际上，如果JVM的版本在 Java SE 6 update 23 及以上, 则不需要再设置 `-XX:+UseCompressedOops` 参数, 因为会默认开启。


“OOP” means Ordinary Object Pointer. It means a managed pointer to an object. An OOP is usually the same size as a native machine pointer, which means an OOP is 64 bits on a 64-bit operating system and 32 bits on a 32-bit operating system.

“OOP” 表示普通对象指针(Ordinary Object Pointer)。 是对某个对象的托管指针(managed pointer)。 OOP 通常与宿主机器的原生指针长度相同, 也就是说, 在64位操作系统上OOP就是64位, 在32位操作系统上OOP就是32位。


In a 32-bit operating system, JVM can address only up to 4GB (i.e., 2 ^ 32) memory. To manage larger amounts of memory, the JVM needs to run with 64-bit OOP, which can manage 18.5 Exabytes (i.e., 2 ^ 64 bytes). Very large size :-). Actually, there aren't any servers in the world which has so much memory.

在32位操作系统中，JVM的内存地址空间最大只能到 4GB(`2 ^ 32`)。
要管理更大的内存，JVM需要使用64位OOP，最多可以管理 18.5 Exabytes(`2 ^ 64`）。
这是一个非常大的空间。 实际上，当今世界上没有任何服务器有这么大的内存。


What this means is that for a twice as big address, a much larger memory area can be addressed. But this doesn`t comes at `free of cost`. When you switch from a 32-bit JVM to a 64-bit JVM, you will notice the loss of available memory by 1.5 times due to larger addresses. To fix this problem, JVM developers invented `Compressed Oops` feature. More details about this compressed OOPs can be found here.

这意味着，存储的指针的地址变成2倍大，可以定位更大的内存区域。
但这并非 “没有代价”。
从32位JVM切换到64位JVM时，您会看到, 可用内存的损失会变成原来的1.5倍左右, 这就是因为使用的地址指针变大了。
为了解决这个问题，JVM开发人员发明了 `Compressed Oops` 功能。 关于压缩指针(compressed OOPs)的详细信息请参考: [HotSpot JVM Performance Enhancements
](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/performance-enhancements-7.html) 。


To activate this feature, you were required to pass `-XX:+UseCompressedOops` JVM argument. However, starting from Java SE 6u23 and later versions, the use of compressed oops is made as default. Thus you don't need to pass this flag explicitly anymore.

要启用这个功能，需要传入JVM启动参数 `-XX:+UseCompressedOops`。
但是，从 Java SE 6U23 开始，新版本中会默认开启压缩指针。 因此, 我们不需要再手动传递此标志。


- 原文链接: [Avoid passing -XX:+UseCompressedOops](https://blog.gceasy.io/2020/04/16/avoid-passing-xxusecompressedoops/)
