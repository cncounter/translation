
# Out-of-Memory Kill Tunables

# OOM终结者参数设置

Out of Memory (OOM) refers to a computing state where all available memory, including swap space, has been allocated. By default, this situation causes the system to panic and stop functioning as expected. However, setting the /proc/sys/vm/panic_on_oom parameter to 0 instructs the kernel to call the oom_killer function when OOM occurs. Usually, oom_killer can kill rogue processes and the system survives.

内存溢出(Out of Memory,OOM), 是指计算机的所有可用内存(包括交换空间, swap space), 都被使用满了。 这种情况下, 默认配置会导致系统报警, 并停止正常运行. 当然, 将 `/proc/sys/vm/panic_on_oom` 参数设置为 `0`, 则告诉系统内核, 如果系统发生内存溢出, 就可以调用 `oom_killer`(OOM终结者)功能, 来杀掉最胖的那头进程(rogue processes, 流氓进程), 这样系统又可以继续工作了。

The following parameter can be set on a per-process basis, giving you increased control over which processes are killed by the oom_killer function. It is located under /proc/pid/ in the proc file system, where pid is the process ID number.

以下参数可以基于单个进程进行设置, 以便手工控制哪些进程可以 oom_killer 终结。 该参数位于 `proc` 文件系统中的 `/proc/pid/` 目录下。 其中 `pid` 是指进程的ID。

- `oom_adj`

Defines a value from -16 to 15 that helps determine the oom_score of a process. The higher the oom_score value, the more likely the process will be killed by the oom_killer. Setting a oom_adj value of -17 disables the oom_killer for that process.

正常范围是 `-16` 到 `15`, 用于计算一个进程的OOM评分(oom_score)。这个分值越高, 该进程越有可能被OOM终结者给干掉。 如果设置为 `-17`, 则禁止 oom_killer 杀死该进程。

## 示例


> 例如 pid=12884, root用户执行: 

```
$ cat /proc/12884/oom_adj
0

$ cat /proc/12884/oom_score
161

$ cat /proc/12884/oom_score_adj 
0

# change ...
$ echo -17 > /proc/12884/oom_adj

$ cat /proc/12884/oom_adj
-17

$ cat /proc/12884/oom_score
0

$ cat /proc/12884/oom_score_adj 
-1000

```


## 案例


> 问题描述:

    Java网站经常挂掉, 原因疑似Java进程被杀死。


> 配置信息:

    服务器 : 阿里云ECS
    IP地址 : 192.168.1.52
    CPU    : 4核-虚拟CPU Intel Xeon E5-2650 2.60GHz
    物理内存: 8GB


> 现状:

    内存不足: 4个Java进程, 2.1+1.7+1.7+1.3 =6.8G, 已占用绝大部分内存。


> 查看OOM终结者日志:

Linux系统的OOM终结者, Out of memory killer 日志。

```
sudo cat /var/log/messages | grep killer -A 2 -B 2

```

假如物理内存不足, Linux 会找出一头比较壮的进程来杀掉。

参考: <https://blog.csdn.net/renfufei/article/details/78178757>

经排查发现, 具有如下日志:

```
$ sudo cat /var/log/messages | grep killer -A 2 -B 2
May 21 09:55:01 web1 systemd: Started Session 500687 of user root.
May 21 09:55:02 web1 systemd: Starting Session 500687 of user root.
May 21 09:55:23 web1 kernel: java invoked oom-killer: gfp_mask=0x201da, order=0, oom_score_adj=0
May 21 09:55:24 web1 kernel: java cpuset=/ mems_allowed=0
May 21 09:55:24 web1 kernel: CPU: 3 PID: 25434 Comm: java Not tainted 3.10.0-514.6.2.el7.x86_64 #1
--
May 21 12:05:01 web1 systemd: Started Session 500843 of user root.
May 21 12:05:01 web1 systemd: Starting Session 500843 of user root.
May 21 12:05:22 web1 kernel: jstatd invoked oom-killer: gfp_mask=0x201da, order=0, oom_score_adj=0
May 21 12:05:22 web1 kernel: jstatd cpuset=/ mems_allowed=0
May 21 12:05:23 web1 kernel: CPU: 2 PID: 10467 Comm: jstatd Not tainted 3.10.0-514.6.2.el7.x86_64 #1
```

可以确定, 确实是物理内存不足引起的。

> 提示: 所有启动的 `-Xmx` 加起来, 大于系统的剩余内存, 就可能发生这种情况。


> 查询系统所有进程的 oom_score:

```
ps -eo pid,comm,pmem --sort -rss | \
awk '{"cat /proc/"$1"/oom_score" | getline oom; print $0"\t"oom}'
```




Important

## 重要提示

Any processes spawned by an adjusted process will inherit that process's oom_score. For example, if an sshd process is protected from the oom_killer function, all processes initiated by that SSH session will also be protected. This can affect the oom_killer function's ability to salvage the system if OOM occurs.

如果调整过某个进程的 `oom_adj` 配置, 那么由该进程创建的所有进程, 都会继承 oom_score 分值。 例如, 假设某个 sshd 进程受 oom_killer 的保护, 则所有的 SSH会话也将受到保护. 这样的配置, 如果发生OOM, 有可能会影响 oom_killer 拯救系统的功能。



更多信息请参考: 

- Linux内核OOM机制的详细分析: <http://blog.51cto.com/laoxu/1267097>

- Linux 找出最有可能被 OOM Killer 杀掉的进程: <https://github.com/Yhzhtk/note/issues/31>


原文链接: <https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/performance_tuning_guide/s-memory-captun>

