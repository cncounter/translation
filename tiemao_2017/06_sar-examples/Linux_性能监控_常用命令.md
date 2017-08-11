# Linux_性能监控_常用命令


## 一、 top 命令常用选项



1。 默认使用 :  按CPU使用率排序

	top

退出(Quit)请按 q ; 或者 CTRL+C


2。 按内存排序(Memory):

	top -o %MEM

或者, 在 top 主界面, 按下大写的 M

当先排序列反转(Reverse); 在 top 主界面, 按下大写的 R


3。 显示某个用户的进程/需要有权限:

	sudo top -u root


4。 只显示某些 PID

	top -p 1309, 1882

5。 显示各个CPU的使用情况

	top

然后在主界面按数字 1
​	

6。 改变刷新频率, 默认是3秒刷新


立刻刷新： 在主界面按下 空格键(Space), 或者 ESC 键。


7。 查看内置命令的帮助信息

	man top


8。 查看启动进程的 COMAND 信息

在主界面按下小写的 c

9。 刷新特定次数(num)后退出

	top -n 2


10。 在批处理中执行 top， 获取快照

	top -b -n 1 > tp.log

或者，提取信息:

	top -o %MEM -b -n 1 | grep java


11。 保存(Write)当前的 TOP 配置

在 top 主界面按下大写的 W


参考: [http://www.thegeekstuff.com/2010/01/15-practical-unix-linux-top-command-examples/](http://www.thegeekstuff.com/2010/01/15-practical-unix-linux-top-command-examples/)





## 二、 sysstat 命令常用选项


1。 安装 sysstat

sar 等命令是 sysstat 工具包的一部分。 安装如下：

	sudo yum -y install sysstat

2。 刷新频率与次数

查看历史负载信息; sar 刷新间隔1秒, 只输出 3 次

	sar 1 3

sysstat 下面的其他工具，使用方式基本上都是一样的。 例如:

	iostat 1 3

或者 (Virtual Memory + CPU):

	vmstat 1 3


windows下对应的为 perfmon, 即性能监视器, 可以从命令行，或者任务管理器中打开。


%user 与 %system

一般来说， %user 是程序执行自身运算代码所占用的 CPU 时间比例, 称为用户时间；
而 %system 系统时间, 是程序调用系统底层所占用的时间。 如 IO 以及系统函数调用等。



参考: [http://www.thegeekstuff.com/2011/03/sar-examples/?utm_source=feedburner](http://www.thegeekstuff.com/2011/03/sar-examples/?utm_source=feedburner)









