# How to Find The Kernel Version

# 如何找到内核版本吗

It can be useful to know the version number of the kernel (i.e., the core of the operating system) on a particular Linux system. Not only is it instructive in itself, but it can also be helpful in diagnosing and upgrading systems because each release of the kernel contains some differences, sometimes minor and sometimes substantial.

它可以是有用的了解内核的版本号(即。的核心操作系统)在一个特定的Linux系统.本身不仅是有益的,但它也可以帮助诊断和升级系统,因为每个版本的内核包含了一些差异,有时小,有时很大。

Fortunately, it is extremely easy to obtain this information, and, in fact, there is a choice of at least five ways to do it. Moreover, each of these techniques can also be used, with slight modification, to obtain additional information about a system.

幸运的是,这非常容易获得这些信息,而且,事实上,有一个选择至少5个方法可以做到这一点.此外,还可以使用这些技术,用细微的修改,来获取额外信息系统。

Perhaps the easiest is to use the uname command (which reports basic information about a system's hardware and software) with its -r option, that is,

也许最简单的是使用uname命令(报告基本信息系统的硬件和软件)- r选项,也就是说,

```
uname -r
```



This method has the advantages that only a minimal amount of typing is required and that it provides just information about the kernel with no extra output to search through.



A second way is to look at the /proc/version file. This can be easily accomplished by using the cat command (which is commonly used to read and concatenate files), i.e.,

第二种方式是看/proc/version文件。这可以很容易地通过使用cat命令(这是常用的阅读和连接文件),也就是说,

```
cat /proc/version
```



A third way is to use the rpm (i.e., Red Hat package manager) command with its -q (i.e., query) option and use the word kernel as an argument (i.e., input data) as follows:

第三种方法是使用rpm(即。,Red Hat包管理器)命令的- q(即。、查询)的选择和使用内核作为参数(即这个词。、输入数据)如下:

```
rpm -q kernel
```



This method has the advantage that it provides output information solely about the kernel. However, it has the disadvantage that it only works on distributions (i.e., versions) of Linux that use the rpm package system, such as those based on Red Hat.

这种方法的优点在于,它提供了关于内核只输出信息。然而,缺点是,它只适用于分布(即.使用rpm包的版本)的Linux系统,如基于Red Hat。

A fourth method is to look at the contents of the dmesg command, which is used to report information about the system as it boots up (i.e., starts up). Because dmesg generates a large amount of output, it is convenient to first transfer that output using a pipe (represented by the vertical bar character) to the grep filter with the word Linux as an argument in order to display only lines that contain that word (and thus the kernel version information) as follows:

第四个方法是看dmesg命令的内容,用于报告信息系统启动(即。启动).因为dmesg命令生成大量输出,方便先转移输出使用管道(由竖线字符)到grep过滤器与Linux这个词作为参数,以便只显示行 包含这个词(因此内核版本信息)如下:

```
dmesg | grep Linux
```



The disadvantages of this method are that it requires some extra typing and that there is still a lot of output to search through even though it has been greatly reduced through the use of the grep filter.

这种方法的缺点是,它需要一些额外的输入,仍有大量输出搜索即使它大大减少了通过使用grep 过滤器。

A fifth method is to look in directories in which the kernel or its source code (i.e., the original version as written by humans in a programming language) is kept. There can be differences among systems, and some systems might not contain the source code. However, the kernel frequently resides in the boot directory, and thus its name, which includes the version and release numbers, can be found by using the ls command (which lists the contents of a directory) with that directory as an argument as follows:

五分之一的方法是看目录的内核或其源代码(即。,原始版本作为人类一种编程语言写的)保存.系统间可以有差异,有些系统可能不包含源代码.但是,内核经常驻留在启动目录,因此它的名字,包括版本和发布数据,可以通过使用ls命令(列出一个目录的内容)和该目录作为参数如下:

```
ls /boot
```



This command will likely produce several references to the version of the currently installed and running kernel. Among them should be an entry such as vmlinuz-2.4.20-6 (in the case of kernel version 2, major release 4, minor release 20). vmlinuz is a compressed Linux kernel, and it is bootable, which means that it is capable of loading the operating system into memory so that the computer becomes usable and application programs can be run.

这个命令可能会产生一些引用当前安装的版本和正在运行的内核。其中如vmlinuz - 2.4应该是一个条目.发(内核版本2的情况下,主要版本4,小释放20).vmlinuz是一个压缩的Linux内核,它是引导,这意味着它可以加载到内存的操作系统使电脑成为可用的,应用程序可以运行。

<http://www.linfo.org/find_kernel_version.html>



