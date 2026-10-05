# Little-Endian and Big-Endian in Java

# Java 中的小端序与大端序


You must have heard these terms Little-Endian and Big-Endian many times in your engineering course. Let’s quickly recap the concept behind these words.

你一定在学习工程类课程时多次听说过小端序(Little-Endian)和大端序(Big-Endian)这两个术语。下面我们快速回顾一下这些概念背后的含义。

These two terms are related to the direction of bytes in a word within CPU architecture. Computer memory is referenced by addresses that are positive integers. It is “natural” to store numbers with the least significant byte coming before the most significant byte in the computer memory. Sometimes computer designers prefer to use a reversed order version of this representation.

这两个术语与 CPU 体系结构中一个字(word)内字节的排列方向有关。计算机内存通过正整数地址来引用。将数字的最低有效字节放在最高有效字节之前, 是一种比较“自然”的内存存储方式。而计算机设计者有时更倾向于使用颠倒顺序的表示形式。

The “natural” order, where less significant byte comes before more significant byte in memory, is called little-endian. Many vendors like IBM, CRAY, and Sun preferred the reverse order that, of course, is called big-endian.

低位字节排在内存中高位字节之前的“自然”顺序, 称为小端序(little-endian)。而 IBM、CRAY、Sun 等许多厂商更喜欢相反的顺序, 当然, 这种顺序就称为大端序(big-endian)。

For example, the 32-bit hex value 0x45679812 would be stored in memory as follows:

例如, 32 位的十六进制值 0x45679812 在内存中的存储方式如下:


```
Address         00  01  02  03
-------------------------------
Little-endian   12  98  67  45
Big-endian      45  67  98  12
```

Difference in endian-ness can be a problem when transferring data between two machines.

字节序的差异, 在两台机器之间传输数据时可能会带来问题。

Everything in Java binary format files is stored in big-endian order. This is sometimes called network order. This means that if you use only Java, all files are done the same way on all platforms: Mac, PC, UNIX, etc. You can freely exchange binary data electronically without any concerns about endian-ness.

Java 二进制格式文件中的所有内容都以大端序存储, 有时也称为网络字节序(network order)。这意味着, 如果你只使用 Java, 那么所有平台上文件的格式都是一样的: Mac、PC、UNIX 等等。你可以放心地通过电子方式交换二进制数据, 而无需关心字节序问题。

The problem comes when you must exchange data files with some program not written in Java that uses little-endian order, most commonly a program written in C. Some platforms use big-endian order internally (Mac, IBM 390); some uses little-endian order (Intel).

问题出现在你必须与非 Java 编写的程序交换数据文件时, 这些程序使用小端序, 最常见的就是用 C 语言编写的程序。有些平台内部使用大端序(如 Mac、IBM 390), 有些则使用小端序(如 Intel)。

Java hides that internal endian-ness from you.

Java 对你隐藏了内部的字节序细节。


<https://howtodoinjava.com/core-java/basics/little-endian-and-big-endian-in-java/>
