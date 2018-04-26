# How to Find The Kernel Version

It can be useful to know the version number of the kernel (i.e., the core of the operating system) on a particular Linux system. Not only is it instructive in itself, but it can also be helpful in diagnosing and upgrading systems because each release of the kernel contains some differences, sometimes minor and sometimes substantial.

Fortunately, it is extremely easy to obtain this information, and, in fact, there is a choice of at least five ways to do it. Moreover, each of these techniques can also be used, with slight modification, to obtain additional information about a system.

Perhaps the easiest is to use the uname command (which reports basic information about a system's hardware and software) with its -r option, that is,

```
uname -r
```

This method has the advantages that only a minimal amount of typing is required and that it provides just information about the kernel with no extra output to search through.

A second way is to look at the /proc/version file. This can be easily accomplished by using the cat command (which is commonly used to read and concatenate files), i.e.,

```
cat /proc/version
```

A third way is to use the rpm (i.e., Red Hat package manager) command with its -q (i.e., query) option and use the word kernel as an argument (i.e., input data) as follows:

```
rpm -q kernel
```

This method has the advantage that it provides output information solely about the kernel. However, it has the disadvantage that it only works on distributions (i.e., versions) of Linux that use the rpm package system, such as those based on Red Hat.

A fourth method is to look at the contents of the dmesg command, which is used to report information about the system as it boots up (i.e., starts up). Because dmesg generates a large amount of output, it is convenient to first transfer that output using a pipe (represented by the vertical bar character) to the grep filter with the word Linux as an argument in order to display only lines that contain that word (and thus the kernel version information) as follows:

```
dmesg | grep Linux
```

The disadvantages of this method are that it requires some extra typing and that there is still a lot of output to search through even though it has been greatly reduced through the use of the grep filter.

A fifth method is to look in directories in which the kernel or its source code (i.e., the original version as written by humans in a programming language) is kept. There can be differences among systems, and some systems might not contain the source code. However, the kernel frequently resides in the boot directory, and thus its name, which includes the version and release numbers, can be found by using the ls command (which lists the contents of a directory) with that directory as an argument as follows:

```
ls /boot
```

This command will likely produce several references to the version of the currently installed and running kernel. Among them should be an entry such as vmlinuz-2.4.20-6 (in the case of kernel version 2, major release 4, minor release 20). vmlinuz is a compressed Linux kernel, and it is bootable, which means that it is capable of loading the operating system into memory so that the computer becomes usable and application programs can be run.

<http://www.linfo.org/find_kernel_version.html>
