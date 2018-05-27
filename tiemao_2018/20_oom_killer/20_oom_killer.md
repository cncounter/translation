
# Out-of-Memory Kill Tunables

# OOM终结者参数设置

Out of Memory (OOM) refers to a computing state where all available memory, including swap space, has been allocated. By default, this situation causes the system to panic and stop functioning as expected. However, setting the /proc/sys/vm/panic_on_oom parameter to 0 instructs the kernel to call the oom_killer function when OOM occurs. Usually, oom_killer can kill rogue processes and the system survives.

的内存(伯父)是指计算状态,所有可用的内存,包括交换空间,被分配.默认情况下,这种情况导致系统恐慌和停止正常运行.然而,/proc/sys/vm/panic_on_oom参数设置为0指示内核调用oom_killer函数伯父发生时.通常,oom_killer可以杀死流氓流程和系统。

The following parameter can be set on a per-process basis, giving you increased control over which processes are killed by the oom_killer function. It is located under /proc/pid/ in the proc file system, where pid is the process ID number.

以下参数可以设置在每个进程的基础上,给你增加了控制哪些流程被oom_killer函数.它坐落在/proc/pid/ proc文件系统,其中pid是进程ID号码。

oom_adj

oom_adj

Defines a value from -16 to 15 that helps determine the oom_score of a process. The higher the oom_score value, the more likely the process will be killed by the oom_killer. Setting a oom_adj value of -17 disables the oom_killer for that process.
Important

定义一个值从-16年到15 oom_score有助于确定的一个过程。oom_score价值越高,越有可能将被oom_killer过程.设置一个oom_adj -17禁用oom_killer过程的价值。
重要的

Any processes spawned by an adjusted process will inherit that process's oom_score. For example, if an sshd process is protected from the oom_killer function, all processes initiated by that SSH session will also be protected. This can affect the oom_killer function's ability to salvage the system if OOM occurs.

任何过程产生的调整过程将继承这一过程的oom_score.例如,如果一个从oom_killer sshd进程保护功能,所有进程发起,SSH会话也将受到保护.这个会影响oom_killer函数打捞系统如果伯父发生的能力。




原文链接: <https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/performance_tuning_guide/s-memory-captun>

