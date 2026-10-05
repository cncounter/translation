# 10 Useful Sar (Sysstat) Examples for UNIX / Linux Performance Monitoring

# 实战Linux性能监控: sar 命令



Sar is part of the sysstat package.

sar 是 sysstat 工具包的一部分。


Using sar you can monitor performance of various Linux subsystems (CPU, Memory, I/O..) in real time.

通过 sar 可以实时监控Linux各种子系统的性能指标, 例如 CPU、内存、I/O 等等。



Using sar, you can also collect all performance data on an on-going basis, store them, and do historical analysis to identify bottlenecks.

通常可以定时通过 sar 命令采集本机的各种性能参数, 并存储下来, 以便通过历史分析找出性能瓶颈。



This article explains how to install and configure sysstat package (which contains sar utility) and explains how to monitor the following Linux performance statistics using sar.

本文介绍如何安装与配置 sysstat 工具包, 并讲解如何监控以下性能统计信息。


1.  Collective CPU usage
2.  Individual CPU statistics
3.  Memory used and available
4.  Swap space used and available
5.  Overall I/O activities of the system
6.  Individual device I/O activities
7.  Context switch statistics
8.  Run queue and load average data
9.  Network statistics
10.  Report sar data from a specific time

<br/>

1. 采集 CPU 使用率
2. 每个 CPU 内核的统计信息
3. 内存的使用量和可用值
4. 交换空间的使用量和可用值
5. 系统整体的I/O活动
6. 每个I/O设备的活动情况
7. 上下文切换统计
8. 运行队列与平均负载数据
9. 网络统计信息
10. 在特定时间报告 sar 数据



This is the only guide you’ll need for sar utility. So, bookmark this for your future reference.

本文非常详尽地介绍sar工具。建议您收藏备用。


## I. Install and Configure Sysstat

## I. 安装和配置 sysstat


### Install Sysstat Package

### 安装 sysstat 工具包


First, make sure the latest version of sar is available on your system. Install it using any one of the following methods depending on your distribution.

首先, 确保系统上的 sar 处于最新版本。可以使用下列方法安装该工具包。

通过 apt-get 安装:

```
sudo apt-get install sysstat
```

RHEL 使用如下方式安装:

```
sudo yum install -y sysstat
```

或者下载 rpm 包安装:

```
rpm -ivh sysstat-10.0.0-1.i586.rpm
```


### Install Sysstat from Source

### 编译 sysstat 源代码安装


Download the latest version from [sysstat download page](http://sebastien.godard.pagesperso-orange.fr/download.html).

从官网下载最新版的源码, 下载页面为: <http://sebastien.godard.pagesperso-orange.fr/download.html>。


You can also use wget to download the

可以通过wget下载


```
sudo wget -O sysstat.tar.xz http://perso.orange.fr/sebastien.godard/sysstat-11.6.1.tar.xz

sudo xz -dk sysstat.tar.xz
sudo tar -xf sysstat.tar


cd sysstat-11.6.1

sudo ./configure --enable-install-cron

```


**Note:** Make sure to pass the option –enable-install-cron. This does the following automatically for you. If you don’t configure sysstat with this option, you have to do this ugly job yourself manually.

**注意:** 编译时必须指定 `--enable-install-cron` 参数。该参数会自动执行下面这些步骤. 如果不指定这个编译参数, 就需要手工来执行这些重复的工作。


*   Creates /etc/rc.d/init.d/sysstat
*   Creates appropriate links from /etc/rc.d/rc*.d/ directories to /etc/rc.d/init.d/sysstat to start the sysstat automatically during Linux boot process.
*   For example, /etc/rc.d/rc3.d/S01sysstat is linked automatically to /etc/rc.d/init.d/sysstat

<br/>

*   创建 `/etc/rc.d/init.d/sysstat`
*   从 `/etc/rc.d/rc*.d/` 目录创建适当的链接到 `/etc/rc.d/init.d/sysstat`, 随系统一起启动。
*   例如, `/etc/rc.d/rc3.d/S01sysstat` 被自动链接到 `/etc/rc.d/init.d/sysstat`


After the ./configure, install it as shown below.

执行完成 `./configure` 操作之后, 通过下面的语句进行 install。

```
sudo make && sudo make install

```


**Note:** This will install sar and other systat utilities under /usr/local/bin

**提示:** 这会将 systat 中的工具安装到 `/usr/local/bin` 目录下


Once installed, verify the sar version using “sar -V”. Version 10 is the current stable version of sysstat.

安装完成之后, 需要用 "sar -V" 校验 sar 的版本。版本 10 是 sysstat 当前的稳定版本。

```
sar -V
```

> sysstat version 10.0.0
>
> (C) Sebastien Godard (sysstat  orange.fr)


Finally, make sure sar works. For example, the following gives the system CPU statistics 3 times (with 1 second interval).

最后, 确保 sar 能正常工作。例如, 下面给出系统 CPU 统计的 3 次输出(间隔 1 秒)。


> $ sar 1 3

<br/>

	Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)

	01:27:32 PM       CPU     %user     %nice   %system   %iowait    %steal     %idle
	01:27:33 PM       all      0.00      0.00      0.00      0.00      0.00    100.00
	01:27:34 PM       all      0.25      0.00      0.25      0.00      0.00     99.50
	01:27:35 PM       all      0.75      0.00      0.25      0.00      0.00     99.00
	Average:          all      0.33      0.00      0.17      0.00      0.00     99.50


### Utilities part of Sysstat

### Sysstat 附带的实用程序


Following are the other sysstat utilities.

以下是 sysstat 的其它实用程序。


*   **sar** collects and displays ALL system activities statistics.
*   **sadc** stands for “system activity data collector”. This is the sar backend tool that does the data collection.
*   **sa1** stores system activities in binary data file. sa1 depends on sadc for this purpose. sa1 runs from cron.
*   **sa2** creates daily summary of the collected statistics. sa2 runs from cron.
*   **sadf** can generate sar report in CSV, XML, and various other formats. Use this to integrate sar data with other tools.
*   **iostat** generates CPU, I/O statistics
*   **mpstat** displays CPU statistics.
*   **pidstat** reports statistics based on the process id (PID)
*   **nfsiostat** displays NFS I/O statistics.
*   **cifsiostat** generates CIFS statistics.

*   **sar** 收集并显示所有系统活动的统计数据。
*   **sadc** 代表 "system activity data collector"(系统活动数据收集器)。这是负责数据采集的 sar 后端工具。
*   **sa1** 将系统活动数据存储到二进制数据文件中。sa1 为此依赖于 sadc。sa1 由 cron 运行。
*   **sa2** 生成所收集统计数据的每日汇总。sa2 由 cron 运行。
*   **sadf** 可以生成 CSV、XML 以及各种其他格式的 sar 报告。可用它将 sar 数据与其他工具集成。
*   **iostat** 生成 CPU、I/O 统计数据。
*   **mpstat** 显示 CPU 统计数据。
*   **pidstat** 根据进程 id(PID)报告统计数据。
*   **nfsiostat** 显示 NFS I/O 统计数据。
*   **cifsiostat** 生成 CIFS 统计数据。


This article focuses on sysstat fundamentals and sar utility.

本文主要关注 sysstat 的基础知识和 sar 工具。


### Collect the sar statistics using cron job – sa1 and sa2

### 使用 cron 作业收集 sar 数据 —— sa1 和 sa2


Create sysstat file under /etc/cron.d directory that will collect the historical sar data.

在 /etc/cron.d 目录下创建 sysstat 文件, 用于收集历史 sar 数据。


>	# vi /etc/cron.d/sysstat

	*/10 * * * * root /usr/local/lib/sa/sa1 1 1
	53 23 * * * root /usr/local/lib/sa/sa2 -A


If you’ve installed sysstat from source, the default location of sa1 and sa2 is /usr/local/lib/sa. If you’ve installed using your distribution update method (for example: yum, up2date, or apt-get), this might be /usr/lib/sa/sa1 and /usr/lib/sa/sa2.

如果你从源代码安装 sysstat, sa1 和 sa2 的默认位置是 /usr/local/lib/sa。如果你使用发行版的更新方式安装(例如:yum、up2date 或 apt-get), 则可能是 /usr/lib/sa/sa1 和 /usr/lib/sa/sa2。


**Note**: To understand cron entries, read [Linux Crontab: 15 Awesome Cron Job Examples](http://www.thegeekstuff.com/2009/06/15-practical-crontab-examples/).

**注意**: 要了解 cron 配置项, 请阅读 [Linux Crontab: 15 Awesome Cron Job Examples](http://www.thegeekstuff.com/2009/06/15-practical-crontab-examples/)。


### /usr/local/lib/sa/sa1

### /usr/local/lib/sa/sa1


*   This runs every 10 minutes and collects sar data for historical reference.
*   If you want to collect sar statistics every 5 minutes, change */10 to */5 in the above /etc/cron.d/sysstat file.
*   This writes the data to /var/log/sa/saXX file. XX is the day of the month. saXX file is a binary file. You cannot view its content by opening it in a text editor.
*   For example, If today is 26th day of the month, sa1 writes the sar data to /var/log/sa/sa26
*   You can pass two parameters to sa1: interval (in seconds) and count.
*   In the above crontab example: sa1 1 1 means that sa1 collects sar data 1 time with 1 second interval (for every 10 mins).

*   它每 10 分钟运行一次, 收集供历史参考的 sar 数据。
*   如果你想每 5 分钟收集一次 sar 统计数据, 请把上述 /etc/cron.d/sysstat 文件中的 */10 改为 */5。
*   它会把数据写入 /var/log/sa/saXX 文件。XX 是该月的日期。saXX 是二进制文件, 无法用文本编辑器打开查看其内容。
*   例如, 如果今天是该月的 26 号, sa1 会把 sar 数据写入 /var/log/sa/sa26。
*   你可以给 sa1 传两个参数: interval(间隔, 单位秒)和 count(次数)。
*   在上面的 crontab 示例中: sa1 1 1 表示 sa1 以 1 秒间隔收集 1 次 sar 数据(每 10 分钟执行一次)。


### /usr/local/lib/sa/sa2

### /usr/local/lib/sa/sa2


*   This runs close to midnight (at 23:53) to create the daily summary report of the sar data.
*   sa2 creates /var/log/sa/sarXX file (Note that this is different than saXX file that is created by sa1). This sarXX file created by sa2 is an ascii file that you can view it in a text editor.
*   This will also remove saXX files that are older than a week. So, write a quick shell script that runs every week to copy the /var/log/sa/* files to some other directory to do historical sar data analysis.

*   它在接近午夜时(23:53)运行, 生成 sar 数据的每日汇总报告。
*   sa2 创建 /var/log/sa/sarXX 文件(注意, 它不同于 sa1 创建的 saXX 文件)。sa2 创建的这个 sarXX 文件是 ascii 文件, 可以用文本编辑器查看。
*   它还会删除超过一周的 saXX 文件。所以, 请编写一个每周运行的简短 shell 脚本, 把 /var/log/sa/* 文件复制到其它目录, 以便进行历史 sar 数据分析。


## II. 10 Practical Sar Usage Examples

## II. 10 个实用 sar 用法示例


There are two ways to invoke sar.

有两种方法可以调用 sar。


1.  sar followed by an option (without specifying a saXX data file). This will look for the current day’s saXX data file and report the performance data that was recorded until that point for the current day.
2.  sar followed by an option, and additionally specifying a saXX data file using -f option. This will report the performance data for that particular day. i.e XX is the day of the month.

1. `sar` 后面跟一个选项(不指定 saXX 数据文件)。它会查找当天的 saXX 数据文件, 并报告当天到目前为止记录的性能数据。
2. `sar` 后面跟一个选项, 另外通过 -f 选项指定 saXX 数据文件。它会报告该特定日期(XX 为该月的日期)的性能数据。



In all the examples below, we are going to explain how to view certain performance data for the current day. To look for a specific day, add “-f /var/log/sa/saXX” at the end of the sar command.

在下面所有示例中, 我们将说明如何查看当天特定的性能数据。要查看指定日期的数据, 请在 sar 命令末尾加上 "-f /var/log/sa/saXX"。


All the sar command will have the following as the 1st line in its output.

所有 sar 命令的输出第一行都如下所示。


	$ sar -u
	Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)


*   Linux 2.6.18-194.el5PAE – Linux kernel version of the system.
*   (dev-db) – The hostname where the sar data was collected.
*   03/26/2011 – The date when the sar data was collected.
*   _i686_ – The system architecture
*   (8 CPU) – Number of CPUs available on this system. On multi core systems, this indicates the total number of cores.

*   Linux 2.6.18-194.el5PAE – 系统的 Linux 内核版本。
*   (dev-db) – 收集 sar 数据的主机名。
*   03/26/2011 – 收集 sar 数据的日期。
*   _i686_ – 系统架构。
*   (8 CPU) – 该系统可用的 CPU 数量。在多核系统上, 这表示内核总数。


### 1. CPU Usage of ALL CPUs (sar -u)

### 1. 所有 CPU 的 CPU 使用率(sar -u)


This gives the cumulative real-time CPU usage of all CPUs. “1 3” reports for every 1 seconds a total of 3 times. Most likely you’ll focus on the last field “%idle” to see the cpu load.

它给出所有 CPU 的累积实时 CPU 使用率。"1 3" 表示每 1 秒报告一次, 共报告 3 次。你多半会关注最后一个字段 "%idle" 来查看 CPU 负载。

> $ sar -u 1 3



	Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)

	01:27:32 PM       CPU     %user     %nice   %system   %iowait    %steal     %idle
	01:27:33 PM       all      0.00      0.00      0.00      0.00      0.00    100.00
	01:27:34 PM       all      0.25      0.00      0.25      0.00      0.00     99.50
	01:27:35 PM       all      0.75      0.00      0.25      0.00      0.00     99.00
	Average:          all      0.33      0.00      0.17      0.00      0.00     99.50


Following are few variations:

以下是一些变化:


*   **sar -u** Displays CPU usage for the current day that was collected until that point.
*   **sar -u 1 3** Displays real time CPU usage every 1 second for 3 times.
*   **sar -u ALL** Same as “sar -u” but displays additional fields.
*   **sar -u ALL 1 3** Same as “sar -u 1 3” but displays additional fields.
*   **sar -u -f /var/log/sa/sa10** Displays CPU usage for the 10day of the month from the sa10 file.


<br/>

*   **sar -u** 显示当天到目前为止收集的 CPU 使用率。
*   **sar -u 1 3** 每 1 秒显示一次实时 CPU 使用率, 共 3 次。
*   **sar -u ALL** 与 "sar -u" 相同, 但显示额外的字段。
*   **sar -u ALL 1 3** 与 "sar -u 1 3" 相同, 但显示额外的字段。
*   **sar -u -f /var/log/sa/sa10** 从 sa10 文件显示该月 10 号的 CPU 使用率。


### 2. CPU Usage of Individual CPU or Core (sar -P)

### 2. 单个 CPU 或内核的 CPU 使用率(sar -P)


If you have 4 Cores on the machine and would like to see what the individual cores are doing, do the following.

如果你的机器有 4 个内核, 想看看各个内核在做什么, 可以执行以下命令。


“-P ALL” indicates that it should displays statistics for ALL the individual Cores.

"-P ALL" 表示显示所有单个内核的统计信息。


In the following example under “CPU” column 0, 1, 2, and 3 indicates the corresponding CPU core numbers.

在下面的示例中, "CPU" 列中的 0、1、2、3 表示对应的 CPU 内核编号。


> $ sar -P ALL 1 1


	Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)

	01:34:12 PM       CPU     %user     %nice   %system   %iowait    %steal     %idle
	01:34:13 PM       all     11.69      0.00      4.71      0.69      0.00     82.90
	01:34:13 PM         0     35.00      0.00      6.00      0.00      0.00     59.00
	01:34:13 PM         1     22.00      0.00      5.00      0.00      0.00     73.00
	01:34:13 PM         2      3.00      0.00      1.00      0.00      0.00     96.00
	01:34:13 PM         3      0.00      0.00      0.00      0.00      0.00    100.00



“-P 1” indicates that it should displays statistics only for the 2nd Core. (Note that Core number starts from 0).

"-P 1" 表示只显示第 2 个内核的统计信息。(注意, 内核编号从 0 开始)。

> $ sar -P 1 1 1

	Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)

	01:36:25 PM       CPU     %user     %nice   %system   %iowait    %steal     %idle
	01:36:26 PM         1      8.08      0.00      2.02      1.01      0.00     88.89



Following are few variations:

以下是一些变化:


*   **sar -P ALL** Displays CPU usage broken down by all cores for the current day.
*   **sar -P ALL 1 3** Displays real time CPU usage for ALL cores every 1 second for 3 times (broken down by all cores).
*   **sar -P 1** Displays CPU usage for core number 1 for the current day.
*   **sar -P 1 1 3** Displays real time CPU usage for core number 1, every 1 second for 3 times.
*   **sar -P ALL -f /var/log/sa/sa10** Displays CPU usage broken down by all cores for the 10day day of the month from sa10 file.

<br/>

*   **sar -P ALL** 按所有内核细分显示当天的 CPU 使用率。
*   **sar -P ALL 1 3** 每 1 秒显示一次所有内核的实时 CPU 使用率, 共 3 次(按所有内核细分)。
*   **sar -P 1** 显示当天 1 号内核的 CPU 使用率。
*   **sar -P 1 1 3** 每 1 秒显示一次 1 号内核的实时 CPU 使用率, 共 3 次。
*   **sar -P ALL -f /var/log/sa/sa10** 从 sa10 文件按所有内核细分显示该月 10 号的 CPU 使用率。


### 3. Memory Free and Used (sar -r)

### 3. 内存的空闲与使用(sar -r)


This reports the memory statistics. “1 3” reports for every 1 seconds a total of 3 times. Most likely you’ll focus on “kbmemfree” and “kbmemused” for free and used memory.

它报告内存统计信息。"1 3" 表示每 1 秒报告一次, 共报告 3 次。你多半会关注 "kbmemfree" 和 "kbmemused" 来查看空闲和已用内存。

> $ sar -r 1 3



	Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)

	07:28:06 AM kbmemfree kbmemused  %memused kbbuffers  kbcached  kbcommit   %commit  kbactive   kbinact
	07:28:07 AM   6209248   2097432     25.25    189024   1796544    141372      0.85   1921060     88204
	07:28:08 AM   6209248   2097432     25.25    189024   1796544    141372      0.85   1921060     88204
	07:28:09 AM   6209248   2097432     25.25    189024   1796544    141372      0.85   1921060     88204
	Average:      6209248   2097432     25.25    189024   1796544    141372      0.85   1921060     88204




Following are few variations:

以下是一些变化:


*   sar -r
*   sar -r 1 3
*   sar -r -f /var/log/sa/sa10



### 4. Swap Space Used (sar -S)

### 4. 交换空间的使用(sar -S)


This reports the swap statistics. “1 3” reports for every 1 seconds a total of 3 times. If the “kbswpused” and “%swpused” are at 0, then your system is not swapping.

它报告交换空间统计信息。"1 3" 表示每 1 秒报告一次, 共报告 3 次。如果 "kbswpused" 和 "%swpused" 均为 0, 说明你的系统没有在使用交换空间。


> $ sar -S 1 3

	Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)

	07:31:06 AM kbswpfree kbswpused  %swpused  kbswpcad   %swpcad
	07:31:07 AM   8385920         0      0.00         0      0.00
	07:31:08 AM   8385920         0      0.00         0      0.00
	07:31:09 AM   8385920         0      0.00         0      0.00
	Average:      8385920         0      0.00         0      0.00




Following are few variations:

以下是一些变化:


*   sar -S
*   sar -S 1 3
*   sar -S -f /var/log/sa/sa10



**Notes:**

**注意:**


*   Use “sar -R” to identify number of memory pages freed, used, and cached per second by the system.
*   Use “sar -H” to identify the hugepages (in KB) that are used and available.
*   Use “sar -B” to generate paging statistics. i.e Number of KB paged in (and out) from disk per second.
*   Use “sar -W” to generate page swap statistics. i.e Page swap in (and out) per second.

*   使用 "sar -R" 查看系统每秒释放、使用和缓存的内存页数。
*   使用 "sar -H" 查看已使用和可用的 hugepages(单位 KB)。
*   使用 "sar -B" 生成分页统计信息, 即每秒从磁盘换入(和换出)的 KB 数。
*   使用 "sar -W" 生成页交换统计信息, 即每秒的页面换入(和换出)。


### 5. Overall I/O Activities (sar -b)

### 5. 整体 I/O 活动(sar -b)


This reports I/O statistics. “1 3” reports for every 1 seconds a total of 3 times.

它报告 I/O 统计信息。"1 3" 表示每 1 秒报告一次, 共报告 3 次。


Following fields are displays in the example below.

下面的示例中显示了以下字段。


*   tps – Transactions per second (this includes both read and write)
*   rtps – Read transactions per second
*   wtps – Write transactions per second
*   bread/s – Bytes read per second
*   bwrtn/s – Bytes written per second



*   tps – 每秒事务数(包括读和写)
*   rtps – 每秒读事务数
*   wtps – 每秒写事务数
*   bread/s – 每秒读取的字节数
*   bwrtn/s – 每秒写入的字节数


> $ sar -b 1 3


Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)


	01:56:28 PM       tps      rtps      wtps   bread/s   bwrtn/s
	01:56:29 PM    346.00    264.00     82.00   2208.00    768.00
	01:56:30 PM    100.00     36.00     64.00    304.00    816.00
	01:56:31 PM    282.83     32.32    250.51    258.59   2537.37
	Average:       242.81    111.04    131.77    925.75   1369.90



Following are few variations:

以下是一些变化:


*   sar -b
*   sar -b 1 3
*   sar -b -f /var/log/sa/sa10




**Note:** Use “sar -v” to display number of inode handlers, file handlers, and pseudo-terminals used by the system.

**注意:** 使用 "sar -v" 显示系统所使用的 inode 句柄、文件句柄和伪终端数量。


### 6. Individual Block Device I/O Activities (sar -d)

### 6. 单个块设备的 I/O 活动(sar -d)


To identify the activities by the individual block devices (i.e a specific mount point, or LUN, or partition), use “sar -d”

要识别各块设备(即特定的挂载点、LUN 或分区)的活动, 可使用 "sar -d"


> $ sar -d 1 1


	Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)

	01:59:45 PM       DEV       tps  rd_sec/s  wr_sec/s  avgrq-sz  avgqu-sz     await     svctm     %util
	01:59:46 PM    dev8-0      1.01      0.00      0.00      0.00      0.00      4.00      1.00      0.10
	01:59:46 PM    dev8-1      1.01      0.00      0.00      0.00      0.00      4.00      1.00      0.10
	01:59:46 PM dev120-64      3.03     64.65      0.00     21.33      0.03      9.33      5.33      1.62
	01:59:46 PM dev120-65      3.03     64.65      0.00     21.33      0.03      9.33      5.33      1.62
	01:59:46 PM  dev120-0      8.08      0.00    105.05     13.00      0.00      0.38      0.38      0.30
	01:59:46 PM  dev120-1      8.08      0.00    105.05     13.00      0.00      0.38      0.38      0.30
	01:59:46 PM dev120-96      1.01      8.08      0.00      8.00      0.01      9.00      9.00      0.91
	01:59:46 PM dev120-97      1.01      8.08      0.00      8.00      0.01      9.00      9.00      0.91



In the above example “DEV” indicates the specific block device.

在上面的示例中, "DEV" 表示特定的块设备。


For example: “dev53-1” means a block device with 53 as major number, and 1 as minor number.

例如: "dev53-1" 表示主设备号为 53、次设备号为 1 的块设备。


The device name (DEV column) can display the actual device name (for example: sda, sda1, sdb1 etc.,), if you use the -p option (pretty print) as shown below.

如果使用 -p 选项(美化输出), 设备名称(DEV 列)可以显示实际的设备名(例如: sda、sda1、sdb1 等), 如下所示。


> $ sar -p -d 1 1


	Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)

	01:59:45 PM       DEV       tps  rd_sec/s  wr_sec/s  avgrq-sz  avgqu-sz     await     svctm     %util
	01:59:46 PM       sda      1.01      0.00      0.00      0.00      0.00      4.00      1.00      0.10
	01:59:46 PM      sda1      1.01      0.00      0.00      0.00      0.00      4.00      1.00      0.10
	01:59:46 PM      sdb1      3.03     64.65      0.00     21.33      0.03      9.33      5.33      1.62
	01:59:46 PM      sdc1      3.03     64.65      0.00     21.33      0.03      9.33      5.33      1.62
	01:59:46 PM      sde1      8.08      0.00    105.05     13.00      0.00      0.38      0.38      0.30
	01:59:46 PM      sdf1      8.08      0.00    105.05     13.00      0.00      0.38      0.38      0.30
	01:59:46 PM      sda2      1.01      8.08      0.00      8.00      0.01      9.00      9.00      0.91
	01:59:46 PM      sdb2      1.01      8.08      0.00      8.00      0.01      9.00      9.00      0.91






Following are few variations:

以下是一些变化:


*   sar -d
*   sar -d 1 3
*   sar -d -f /var/log/sa/sa10
*   sar -p -d



### 7. Display context switch per second (sar -w)

### 7. 显示每秒上下文切换(sar -w)


This reports the total number of processes created per second, and total number of context switches per second. “1 3” reports for every 1 seconds a total of 3 times.

它报告每秒创建的进程总数以及每秒的上下文切换总数。"1 3" 表示每 1 秒报告一次, 共报告 3 次。


> $ sar -w 1 3




	Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)

	08:32:24 AM    proc/s   cswch/s
	08:32:25 AM      3.00     53.00
	08:32:26 AM      4.00     61.39
	08:32:27 AM      2.00     57.00


Following are few variations:

以下是一些变化:


*   sar -w
*   sar -w 1 3
*   sar -w -f /var/log/sa/sa10



### 8. Reports run queue and load average (sar -q)

### 8. 报告运行队列和平均负载(sar -q)


This reports the run queue size and load average of last 1 minute, 5 minutes, and 15 minutes. “1 3” reports for every 1 seconds a total of 3 times.

它报告运行队列大小以及最近 1 分钟、5 分钟和 15 分钟的平均负载。"1 3" 表示每 1 秒报告一次, 共报告 3 次。


> $ sar -q 1 3


	Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)

	06:28:53 AM   runq-sz  plist-sz   ldavg-1   ldavg-5  ldavg-15   blocked
	06:28:54 AM         0       230      2.00      3.00      5.00         0
	06:28:55 AM         2       210      2.01      3.15      5.15         0
	06:28:56 AM         2       230      2.12      3.12      5.12         0
	Average:            3       230      3.12      3.12      5.12         0


**Note:** The “blocked” column displays the number of tasks that are currently blocked and waiting for I/O operation to complete.

**注意:** "blocked" 列显示当前被阻塞、正在等待 I/O 操作完成的任务数量。


Following are few variations:

以下是一些变化:


*   sar -q
*   sar -q 1 3
*   sar -q -f /var/log/sa/sa10



### 9. Report network statistics (sar -n)

### 9. 报告网络统计(sar -n)


This reports various network statistics. For example: number of packets received (transmitted) through the network card, statistics of packet failure etc.,. “1 3” reports for every 1 seconds a total of 3 times.

它报告各种网络统计信息。例如:通过网卡接收(发送)的数据包数量、数据包失败统计等。"1 3" 表示每 1 秒报告一次, 共报告 3 次。


	sar -n KEYWORD




KEYWORD can be one of the following:

关键字可以是下列之一:


*   DEV – Displays network devices vital statistics for eth0, eth1, etc.,
*   EDEV – Display network device failure statistics
*   NFS – Displays NFS client activities
*   NFSD – Displays NFS server activities
*   SOCK – Displays sockets in use for IPv4
*   IP – Displays IPv4 network traffic
*   EIP – Displays IPv4 network errors
*   ICMP – Displays ICMPv4 network traffic
*   EICMP – Displays ICMPv4 network errors
*   TCP – Displays TCPv4 network traffic
*   ETCP – Displays TCPv4 network errors
*   UDP – Displays UDPv4 network traffic
*   SOCK6, IP6, EIP6, ICMP6, UDP6 are for IPv6
*   ALL – This displays all of the above information. The output will be very long.



*   DEV – 显示 eth0、eth1 等网络设备的关键统计数据
*   EDEV – 显示网络设备故障统计数据
*   NFS – 显示 NFS 客户端活动
*   NFSD – 显示 NFS 服务器活动
*   SOCK – 显示 IPv4 正在使用的套接字
*   IP – 显示 IPv4 网络流量
*   EIP – 显示 IPv4 网络错误
*   ICMP – 显示 ICMPv4 网络流量
*   EICMP – 显示 ICMPv4 网络错误
*   TCP – 显示 TCPv4 网络流量
*   ETCP – 显示 TCPv4 网络错误
*   UDP – 显示 UDPv4 网络流量
*   SOCK6、IP6、EIP6、ICMP6、UDP6 用于 IPv6
*   ALL – 显示以上所有信息。输出会非常长。




> $ sar -n DEV 1 1


	Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)

	01:11:13 PM     IFACE   rxpck/s   txpck/s   rxbyt/s   txbyt/s   rxcmp/s   txcmp/s  rxmcst/s
	01:11:14 PM        lo      0.00      0.00      0.00      0.00      0.00      0.00      0.00
	01:11:14 PM      eth0    342.57    342.57  93923.76 141773.27      0.00      0.00      0.00
	01:11:14 PM      eth1      0.00      0.00      0.00      0.00      0.00      0.00      0.00


### 10. Report Sar Data Using Start Time (sar -s)

### 10. 使用开始时间报告 sar 数据(sar -s)


When you view historic sar data from the /var/log/sa/saXX file using “sar -f” option, it displays all the sar data for that specific day starting from 12:00 a.m for that day.

当你使用 "sar -f" 选项查看 /var/log/sa/saXX 文件中的历史 sar 数据时, 它会显示该特定日期从凌晨 12:00 开始的所有 sar 数据。


Using “-s hh:mi:ss” option, you can specify the start time. For example, if you specify “sar -s 10:00:00”, it will display the sar data starting from 10 a.m (instead of starting from midnight) as shown below.

使用 "-s hh:mi:ss" 选项可以指定开始时间。例如, 如果指定 "sar -s 10:00:00", 它将从上午 10 点开始显示 sar 数据(而不是从午夜开始), 如下所示。


You can combine -s option with other sar option.

你可以把 -s 选项与其他 sar 选项结合使用。


For example, to report the load average on 26th of this month starting from 10 a.m in the morning, combine the -q and -s option as shown below.

例如, 要报告本月 26 日从上午 10 点开始的平均负载, 可以把 -q 和 -s 选项结合使用, 如下所示。


> $ sar -q -f /var/log/sa/sa23 -s 10:00:01


	Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)

	10:00:01 AM   runq-sz  plist-sz   ldavg-1   ldavg-5  ldavg-15   blocked
	10:10:01 AM         0       127      2.00      3.00      5.00         0
	10:20:01 AM         0       127      2.00      3.00      5.00         0
	...
	11:20:01 AM         0       127      5.00      3.00      3.00         0
	12:00:01 PM         0       127      4.00      2.00      1.00         0


There is no option to limit the end-time. You just have to get creative and use head command as shown below.

没有限制结束时间的选项。你只能发挥创意, 使用 head 命令, 如下所示。


For example, starting from 10 a.m, if you want to see 7 entries, you have to pipe the above output to “head -n 10”.

例如, 从上午 10 点开始, 如果你想看 7 条记录, 就要把上面的输出通过管道传给 "head -n 10"。


> $ sar -q -f /var/log/sa/sa23 -s 10:00:01 | head -n 10


	Linux 2.6.18-194.el5PAE (dev-db)        03/26/2011      _i686_  (8 CPU)

	10:00:01 AM   runq-sz  plist-sz   ldavg-1   ldavg-5  ldavg-15   blocked
	10:10:01 AM         0       127      2.00      3.00      5.00         0
	10:20:01 AM         0       127      2.00      3.00      5.00         0
	10:30:01 AM         0       127      3.00      5.00      2.00         0
	10:40:01 AM         0       127      4.00      2.00      1.00         2
	10:50:01 AM         0       127      3.00      5.00      5.00         0
	11:00:01 AM         0       127      2.00      1.00      6.00         0
	11:10:01 AM         0       127      1.00      3.00      7.00         2


There is lot more to cover in Linux performance monitoring and tuning. We are only getting started. More articles to come in the performance series.

Linux 性能监控与调优还有很多内容要讲。我们才刚刚开始, 性能系列还会有更多文章。


Previous articles in the Linux performance monitoring and tuning series:

Linux 性能监控与调优系列之前的文章:


*   [Linux Performance Monitoring and Tuning Introduction](http://www.thegeekstuff.com/2011/03/linux-performance-monitoring-intro/)
*   [15 Practical Linux Top Command Examples](http://www.thegeekstuff.com/2010/01/15-practical-unix-linux-top-command-examples/)

*   [Linux Performance Monitoring and Tuning Introduction](http://www.thegeekstuff.com/2011/03/linux-performance-monitoring-intro/)
*   [15 Practical Linux Top Command Examples](http://www.thegeekstuff.com/2010/01/15-practical-unix-linux-top-command-examples/)




原文链接: [http://www.thegeekstuff.com/2011/03/sar-examples/](http://www.thegeekstuff.com/2011/03/sar-examples/)


原文日期: 2011年3月29日 by Ramesh Natarajan

