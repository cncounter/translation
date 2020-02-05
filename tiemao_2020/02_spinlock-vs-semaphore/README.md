# Spinlock vs. semaphore

# 自旋锁与信号量

Spinlock and semaphore differ mainly in four things:

可以从以下几点来区分自旋锁(Spinlock)和信号量(Semaphore)：

## 1. What they are

## 1. 自旋锁与信号量简介

A spinlock is one possible implementation of a lock, namely one that is implemented by busy waiting ("spinning"). A semaphore is a generalization of a lock (or, the other way around, a lock is a special case of a semaphore). Usually, but not necessarily, spinlocks are only valid within one process whereas semaphores can be used to synchronize between different processes, too.

自旋是锁的一种实现方式，通过忙等待（“自旋，spinning”）来实现【例如通过while循环持续请求获取锁】。

信号量的概念比锁的范围更大, 可以说, 锁是信号量的一种特殊情况。

一般来说，自旋锁只在进程内有效，而信号量可同于控制多个进程之间的同步。

A lock works for mutual exclusion, that is one thread at a time can acquire the lock and proceed with a "critical section" of code. Usually, this means code that modifies some data shared by several threads.

锁主要用于互斥操作，也就是说，每次只允许一个线程持有这个锁（的钥匙）并继续执行代码的“关键部分（critical section）”。
关键部分是指可以由多个线程执行的, 修改共享数据的那部分代码。

A semaphore has a counter and will allow itself being acquired by one or several threads, depending on what value you post to it, and (in some implementations) depending on what its maximum allowable value is.

信号量有一个计数器(counter)，同一时刻最多允许被`N`个线程获取，具体是多少线程则取决于设置的值， 在某些实现中这个值就是允许的最大值。

Insofar, one can consider a lock a special case of a semaphore with a maximum value of 1.

从这点来看，可以认为`锁`是`信号量`的一种特殊情况，即信号量计数器最大值为1的情形。

## 2. What they do

## 2. 常规情况下的行为

As stated above, a spinlock is a lock, and therefore a mutual exclusion (strictly 1 to 1) mechanism. It works by repeatedly querying and/or modifying a memory location, usually in an atomic manner. This means that acquiring a spinlock is a "busy" operation that possibly burns CPU cycles for a long time (maybe forever!) while it effectively achieves "nothing".

如上所述，自旋锁是一种锁，也就是一种互斥机制。
实现原理是重复尝试 "查询并修改内存位置", 一般来说这种 “查询并修改” 是原子操作。
通过自旋来获取锁, 是一致“忙碌”的操作，可能长时间（甚至永远！）占用CPU，实际上却什么有效工作都没做。

The main incentive for such an approach is the fact that a context switch has an overhead equivalent to spinning a few hundred (or maybe thousand) times, so if a lock can be acquired by burning a few cycles spinning, this may overall very well be more efficient. Also, for realtime applications it may not be acceptable to block and wait for the scheduler to come back to them at some far away time in the future.

使用自旋的原因在于:

- 上下文切换的开销，相当于上千次循环操作的开销，如果可以通过浪费少量的CPU周期来获得锁，则总体来说更划算。
- 另外，实时计算程序明显是不能接受阻塞和唤醒的, 而且这种唤醒还是在不确定的时间才轮到调度程序来通知。

A semaphore, by contrast, either does not spin at all, or only spins for a very short time (as an optimization to avoid the syscall overhead). If a semaphore cannot be acquired, it blocks, giving up CPU time to a different thread that is ready to run. This may of course mean that a few milliseconds pass before your thread is scheduled again, but if this is no problem (usually it isn't) then it can be a very efficient, CPU-conservative approach.

相比之下，信号量可以不需要进行旋转，或者仅旋转很短的时间（作为一种避免系统调用的优化）。
如果无法获取信号量，则线程会阻塞，从而将CPU时间让给其他准备运行的线程。
当然，这可能意味着在重新安排线程前要经过几毫秒，如果这不是问题， 那么它的效率可能更高，这是一种节省CPU资源的实现方法。

## 3. How they behave in presence of congestion

## 3. 在竞争激烈时的行为

It is a common misconception that spinlocks or lock-free algorithms are "generally faster", or that they are only useful for "very short tasks" (ideally, no synchronization object should be held for longer than absolutely necessary, ever).

常见的`误解`是自旋锁或无锁算法的“速度会更快”，或者误以为他们仅对“非常短的任务”有用。
比如, 理想情况下，没有哪个同步对象锁的保留时间超过必要的时间。

The one important difference is how the different approaches behave in presence of congestion.

在竞争激烈的情况下, 自旋锁和信号量实现的行为差异很大。

A well-designed system normally has low or no congestion (this means not all threads try to acquire the lock at the exact same time). For example, one would normally not write code that acquires a lock, then loads half a megabyte of zip-compressed data from the network, decodes and parses the data, and finally modifies a shared reference (append data to a container, etc.) before releasing the lock. Instead, one would acquire the lock only for the purpose of accessing the shared resource.

设计良好的系统一般很少阻塞，或者没有阻塞。也就是说不应该发生所有线程都在同一时间争抢锁资源的情况。
比如我们一般都`不会`编写这样的代码： 先获取锁之后，再从网上下载很大的zip压缩文件，接着转码解析，再去修改共享资源（比如将数据加到列表/Map中），最后才释放锁。
应该采用的策略是：只在访问共享资源时，才去获取锁。

Since this means that there is considerably more work outside the critical section than inside it, naturally the likelihood for a thread being inside the critical section is relatively low, and thus few threads are contending for the lock at the same time. Of course every now and then two threads will try to acquire the lock at the same time (if this couldn't happen you wouldn't need a lock!), but this is rather the exception than the rule in a "healthy" system.

在关键部分外面的工作量，要比关键部分内部的工作量要大，才比较合理。
自然，一个线程处于关键部分的执行时间要非常短， 这样的话也就很少发生多个线程同时争用锁的情况。
当然，偶尔也会有多个线程同时尝试获取锁（假如没有这种情况的话，那就不需要锁了！）；在“健康”的系统中这是很少发生的情景。

In such a case, a spinlock greatly outperforms a semaphore because if there is no lock congestion, the overhead of acquiring the spinlock is a mere dozen cycles as compared to hundreds/thousands of cycles for a context switch or 10-20 million cycles for losing the remainder of a time slice.

在没有激烈锁争用的情况下，自旋锁的性能要大大优于信号量； 因为没有锁拥塞，获取自旋锁的开销仅为几十个CPU周期， 而上下文切换的开销则至少几百/上千个时钟周期，而且操作系统的时间片切换周期还有可能会丢弃几千万个时钟周期。

On the other hand, given high congestion, or if the lock is being held for lengthy periods (sometimes you just can't help it!), a spinlock will burn insane amounts of CPU cycles for achieving nothing.

如果拥塞程度很高，或者锁会被长时间持有（有时候真的没办法！），在这种场景下，使用自旋锁则会消耗大量的CPU时间，却什么活都没干。

A semaphore (or mutex) is a much better choice in this case, as it allows a different thread to run useful tasks during that time. Or, if no other thread has something useful to do, it allows the operating system to throttle down the CPU and reduce heat / conserve energy.

这时候使用信号量（或互斥锁）是一种更好的解决办法，因为没有抢占CPU，其他线程在这段时间内就可以有效运行。
如果没有需要使用CPU的线程，则操作系统会降低CPU的速度，以减少热量并节约电费。

Also, on a single-core system, a spinlock will be quite inefficient in presence of lock congestion, as a spinning thread will waste its complete time waiting for a state change that cannot possibly happen (not until the releasing thread is scheduled, which isn't happening while the waiting thread is running!). Therefore, given any amount of contention, acquiring the lock takes around 1 1/2 time slices in the best case (assuming the releasing thread is the next one being scheduled), which is not very good behaviour.

在单核CPU的系统上，自旋锁在锁拥塞的情况下效率会更低，因为自旋的线程会将所有时间都浪费在等待状态改变。 除非另一个线程被调度，执行完关键部分并释放锁之后，这个线程的情况才可能会改变。
因此，在有争用的场景中，通过信号量获取锁， 最好的情况大约需要1~2个时间片（假设释放锁的线程恰好在下一个时间片被调度），但这种情况并不理想。

## 4. How they're implemented

## 4. 自旋锁与信号量的实现方式

A semaphore will nowadays typically wrap sys_futex under Linux (optionally with a spinlock that exits after a few attempts).

在Linux系统中, 信号量实现通常会用到 `sys_futex`（可选带有自旋锁，在尝试一定次数后退出）。

A spinlock is typically implemented using atomic operations, and without using anything provided by the operating system. In the past, this meant using either compiler intrinsics or non-portable assembler instructions. Meanwhile both C++11 and C11 have atomic operations as part of the language, so apart from the general difficulty of writing provably correct lock-free code, it is now possible to implement lock-free code in an entirely portable and (almost) painless way.

自旋锁通常使用原子操作来实现， 而不使用操作系统提供的系统函数。
以前的实现需要使用编译器内部函数或者不可移植的汇编指令。
而在 C++11 和 C11 中，都将原子操作作为语言的一部分。
因此，现在实现可移植的无锁代码已经很方便了。 当然，编写可证明其正确性的代码还是有一点难度的。


## 线程切换的代价

> Linux 时间片默认0.75~6ms; Win XP大约10-15ms左右； 可能高可能低，但量级在ms级。 假设CPU是2GHZ，则每时间片大约对应2M个时钟周期。

> JDK的信号量实现是经过优化的，实际上先进行了一定量的自旋操作。 好处是充分利用了操作系统分配给当前线程的时间片，否则这个时间片就被浪费了。

> 如果进行多个线程的 synchronized 和 wait-notify 切换测试，会发现程序的性能基本上不受时间片周期的影响。


Stackoverflow上的问题链接: <https://stackoverflow.com/questions/195853/spinlock-versus-semaphore>
