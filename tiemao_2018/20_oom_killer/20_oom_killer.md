
# Out-of-Memory Kill Tunables

Out of Memory (OOM) refers to a computing state where all available memory, including swap space, has been allocated. By default, this situation causes the system to panic and stop functioning as expected. However, setting the /proc/sys/vm/panic_on_oom parameter to 0 instructs the kernel to call the oom_killer function when OOM occurs. Usually, oom_killer can kill rogue processes and the system survives.

The following parameter can be set on a per-process basis, giving you increased control over which processes are killed by the oom_killer function. It is located under /proc/pid/ in the proc file system, where pid is the process ID number.

oom_adj

Defines a value from -16 to 15 that helps determine the oom_score of a process. The higher the oom_score value, the more likely the process will be killed by the oom_killer. Setting a oom_adj value of -17 disables the oom_killer for that process.
Important

Any processes spawned by an adjusted process will inherit that process's oom_score. For example, if an sshd process is protected from the oom_killer function, all processes initiated by that SSH session will also be protected. This can affect the oom_killer function's ability to salvage the system if OOM occurs.


原文链接: <https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/performance_tuning_guide/s-memory-captun>

