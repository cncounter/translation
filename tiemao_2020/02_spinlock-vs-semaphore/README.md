# Spinlock vs. semaphore

＃自旋锁与信号量

Spinlock and semaphore differ mainly in four things:

自旋锁(Spinlock)和信号量(Semaphore)的主要区别在于四点：

## 1. What they are

## 1. 自旋锁与信号量的定义

A spinlock is one possible implementation of a lock, namely one that is implemented by busy waiting ("spinning"). A semaphore is a generalization of a lock (or, the other way around, a lock is a special case of a semaphore). Usually, but not necessarily, spinlocks are only valid within one process whereas semaphores can be used to synchronize between different processes, too.

自旋锁是锁的一种实现方式，通过忙等待（“自旋，spinning”）来实现。

信号量的概念比锁更大, 可以说, 锁只是信号量的一种特殊情况。

自旋锁一般只在进程内有效，而信号量可用于在不同进程之间的同步。

A lock works for mutual exclusion, that is one thread at a time can acquire the lock and proceed with a "critical section" of code. Usually, this means code that modifies some data shared by several threads.

锁用于互斥操作，每次只允许一个线程获取该锁并继续执行代码的“关键部分”。 关键部分一般是指可以由多个线程执行的, 修改共享数据的代码。

A semaphore has a counter and will allow itself being acquired by one or several threads, depending on what value you post to it, and (in some implementations) depending on what its maximum allowable value is.

信号量有一个计数器(counter)，允许最多同时被N个线程获取，具体是多少个线程则取决于我们设置的值， 在某些实现中则是其允许的最大值。

Insofar, one can consider a lock a special case of a semaphore with a maximum value of 1.

从这点来看，可以认为锁是信号量的一种特殊情况，即信号量计数器的最大值为1。

## 2. What they do

## 2. 两者的行为有什么不同?

As stated above, a spinlock is a lock, and therefore a mutual exclusion (strictly 1 to 1) mechanism. It works by repeatedly querying and/or modifying a memory location, usually in an atomic manner. This means that acquiring a spinlock is a "busy" operation that possibly burns CPU cycles for a long time (maybe forever!) while it effectively achieves "nothing".

如上所述，自旋锁是一种锁，因此是一种互斥机制。 实现原理是通过反复查询/修改内存位置, 一般来说这种查询和修改都是原子操作。
也就是说通过自旋来获取锁, 是一致“忙碌”的操作，可能长时间（甚至永远！）占用CPU周期，而实际上却什么的没做成。

The main incentive for such an approach is the fact that a context switch has an overhead equivalent to spinning a few hundred (or maybe thousand) times, so if a lock can be acquired by burning a few cycles spinning, this may overall very well be more efficient. Also, for realtime applications it may not be acceptable to block and wait for the scheduler to come back to them at some far away time in the future.

这样做的原因在于, 上下文切换的开销, 相当于几百上千次的循环操作，因此，如果可以通过浪费少量的循环周期来获得锁，那么总体来说可能是更高效。
同样，对于实时应用来说，如果需要阻塞, 并等待在将来某个不确定的时间才轮到调度程序通知他，明显是不可接受的。

A semaphore, by contrast, either does not spin at all, or only spins for a very short time (as an optimization to avoid the syscall overhead). If a semaphore cannot be acquired, it blocks, giving up CPU time to a different thread that is ready to run. This may of course mean that a few milliseconds pass before your thread is scheduled again, but if this is no problem (usually it isn't) then it can be a very efficient, CPU-conservative approach.

相比之下，信号量根本不旋转，或者仅旋转很短的时间（作为一种避免系统调用的优化）。
如果无法获取信号量，则线程会阻塞，从而将CPU时间让给其他准备运行的线程。
当然，这可能意味着在重新安排线程前要经过几毫秒，如果这不是问题， 那么它的效率可能更高，这是一种节省CPU资源的实现方法。

## 3. How they behave in presence of congestion

## 3. 在拥塞时的行为

It is a common misconception that spinlocks or lock-free algorithms are "generally faster", or that they are only useful for "very short tasks" (ideally, no synchronization object should be held for longer than absolutely necessary, ever).

常见的`误解`是自旋锁或无锁算法通常“速度更快”，或者仅对“非常短的任务”有用。 比如, 理想情况下，任何同步对象的保留时间都不应超过必要的时间。

The one important difference is how the different approaches behave in presence of congestion.

一个重要的区别: 在竞争激烈的情况下, 两种实现方法的行为不同。

A well-designed system normally has low or no congestion (this means not all threads try to acquire the lock at the exact same time). For example, one would normally not write code that acquires a lock, then loads half a megabyte of zip-compressed data from the network, decodes and parses the data, and finally modifies a shared reference (append data to a container, etc.) before releasing the lock. Instead, one would acquire the lock only for the purpose of accessing the shared resource.

设计良好的系统通常阻塞较少或没有阻塞（这意味着并非所有线程都试图在同一时间获取锁）。
例如，我们一般`不会`编写这样的代码： 先获取锁，然后再从网络上下载很大的zip压缩数据，转码解析，最后再去修改共享的引用（或者将数据加到容器中等等），然后再释放锁。
取而代之的是，仅出于保护共享资源的目的而获取锁。

Since this means that there is considerably more work outside the critical section than inside it, naturally the likelihood for a thread being inside the critical section is relatively low, and thus few threads are contending for the lock at the same time. Of course every now and then two threads will try to acquire the lock at the same time (if this couldn't happen you wouldn't need a lock!), but this is rather the exception than the rule in a "healthy" system.

也就是说，在关键部分之外的工作量， 要比关键部分内部的工作量大得多。 自然， 一个线程处于关键部分内部的时间要少很多，因此也就很少有线程会同时争用锁。 当然，偶尔会有多个线程尝试同时获取锁（如果没有这种情况，那就不需要锁了！）， 但在“健康”的系统中这是一个例外。

In such a case, a spinlock greatly outperforms a semaphore because if there is no lock congestion, the overhead of acquiring the spinlock is a mere dozen cycles as compared to hundreds/thousands of cycles for a context switch or 10-20 million cycles for losing the remainder of a time slice.

在这种情况下，自旋锁的性能大大优于信号量，因为如果没有锁拥塞，获取自旋锁的开销仅为十几个CPU周期， 而上下文切换的开销则为数百/数千个周期，而且操作系统的时间片切换可能还会丢弃一两千万个时钟周期。

On the other hand, given high congestion, or if the lock is being held for lengthy periods (sometimes you just can't help it!), a spinlock will burn insane amounts of CPU cycles for achieving nothing.

另一方面，如果拥塞程度很高，或者锁会被长时间持有（有时您无能为力！），那么自旋锁将消耗大量的CPU周期，却什么有用的活都没干。

A semaphore (or mutex) is a much better choice in this case, as it allows a different thread to run useful tasks during that time. Or, if no other thread has something useful to do, it allows the operating system to throttle down the CPU and reduce heat / conserve energy.

在这种情况下，信号量（或互斥锁）是一个更好的选择，因为它允许不同的线程在这段时间内执行有用的任务。
如果没有其他线程在执行任务，则允许操作系统降低CPU的速度以减少热量/节约能源。

Also, on a single-core system, a spinlock will be quite inefficient in presence of lock congestion, as a spinning thread will waste its complete time waiting for a state change that cannot possibly happen (not until the releasing thread is scheduled, which isn't happening while the waiting thread is running!). Therefore, given any amount of contention, acquiring the lock takes around 1 1/2 time slices in the best case (assuming the releasing thread is the next one being scheduled), which is not very good behaviour.

同样，在单核系统上，自旋锁在锁拥塞的情况下效率很低，因为自旋线程会将所有的时间浪费在等待状态改变（除非对应的线程被调度执行并释放了锁，否则情况不会改变）。
因此，在有争用的情况下，通过信号量获取锁， 最好的情况大约需要1~2个时间片（假设释放锁的线程恰好是下一个时间片调度的线程），这种情况并不理想。

## 4. How they're implemented

## 4. 它们的实现方式

A semaphore will nowadays typically wrap sys_futex under Linux (optionally with a spinlock that exits after a few attempts).

如今，在Linux下, 信号量通常会包装 `sys_futex`（可选带有自旋锁，在尝试一定次数后退出）。

A spinlock is typically implemented using atomic operations, and without using anything provided by the operating system. In the past, this meant using either compiler intrinsics or non-portable assembler instructions. Meanwhile both C++11 and C11 have atomic operations as part of the language, so apart from the general difficulty of writing provably correct lock-free code, it is now possible to implement lock-free code in an entirely portable and (almost) painless way.

自旋锁通常使用原子操作来实现，而不使用操作系统提供的其他操作。
在过去，需要使用编译器内部函数或非便携式汇编程序指令。
同时，C++11 和 C11 都将原子操作作为语言的一部分， 因此，实现无锁技术， 除了编写可证明正确的代码有一点困难之外， 现在实现可移植的无锁代码已经很方便了。

<https://stackoverflow.com/questions/195853/spinlock-versus-semaphore>
