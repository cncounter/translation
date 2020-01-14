# Spinlock vs. semaphore

＃自旋锁与信号量

Spinlock and semaphore differ mainly in four things:

自旋锁和信号灯的主要区别在于四点：

## 1. What they are

## 1.它们是什么

A spinlock is one possible implementation of a lock, namely one that is implemented by busy waiting ("spinning"). A semaphore is a generalization of a lock (or, the other way around, a lock is a special case of a semaphore). Usually, but not necessarily, spinlocks are only valid within one process whereas semaphores can be used to synchronize between different processes, too.

自旋锁是一种可能的锁实现方式，即通过忙等待（“自旋”）实现的一种锁。信号量是锁的概括（或者相反，锁是信号量的特例）。通常（但不是必须），自旋锁仅在一个进程内有效，而信号量也可用于在不同进程之间进行同步。

A lock works for mutual exclusion, that is one thread at a time can acquire the lock and proceed with a "critical section" of code. Usually, this means code that modifies some data shared by several threads.

锁用于互斥，即一次一个线程可以获取该锁并继续执行代码的“关键部分”。通常，这意味着修改一些由多个线程共享的数据的代码。

A semaphore has a counter and will allow itself being acquired by one or several threads, depending on what value you post to it, and (in some implementations) depending on what its maximum allowable value is.

信号量具有一个计数器，并允许其被一个或多个线程获取，具体取决于您向其发布的值，以及（在某些实现中）取决于其最大允许值。

Insofar, one can consider a lock a special case of a semaphore with a maximum value of 1.

就此而言，可以认为锁是信号量的一种特殊情况，最大值为1。

## 2. What they do

## 2.他们做什么

As stated above, a spinlock is a lock, and therefore a mutual exclusion (strictly 1 to 1) mechanism. It works by repeatedly querying and/or modifying a memory location, usually in an atomic manner. This means that acquiring a spinlock is a "busy" operation that possibly burns CPU cycles for a long time (maybe forever!) while it effectively achieves "nothing".

如上所述，自旋锁是一种锁，因此是互斥（严格为1到1）机制。它通常通过原子方式反复查询和/或修改内存位置来工作。这意味着获取自旋锁是“忙碌”的操作，可能长时间（甚至永远！）消耗CPU周期，而实际上却没有实现“空无”。

The main incentive for such an approach is the fact that a context switch has an overhead equivalent to spinning a few hundred (or maybe thousand) times, so if a lock can be acquired by burning a few cycles spinning, this may overall very well be more efficient. Also, for realtime applications it may not be acceptable to block and wait for the scheduler to come back to them at some far away time in the future.

这种方法的主要诱因是这样一个事实，即上下文切换的开销相当于旋转几百（或数千）次，因此，如果可以通过燃烧几个循环来获得锁，那么总体来说可能是更高效。同样，对于实时应用程序，阻塞并等待调度程序在将来某个遥远的时间返回到它们可能是不可接受的。

A semaphore, by contrast, either does not spin at all, or only spins for a very short time (as an optimization to avoid the syscall overhead). If a semaphore cannot be acquired, it blocks, giving up CPU time to a different thread that is ready to run. This may of course mean that a few milliseconds pass before your thread is scheduled again, but if this is no problem (usually it isn't) then it can be a very efficient, CPU-conservative approach.

相比之下，信号量根本不旋转，或者仅旋转很短的时间（作为避免syscall开销的优化）。如果无法获取信号量，它将阻塞，从而将CPU时间浪费在准备运行的其他线程上。当然，这可能意味着在重新安排线程之前要经过几毫秒，但是如果这没问题（通常不是问题），那么它可能是一种非常有效的，CPU节约的方法。

## 3. How they behave in presence of congestion

## 3.他们在拥塞时的行为

It is a common misconception that spinlocks or lock-free algorithms are "generally faster", or that they are only useful for "very short tasks" (ideally, no synchronization object should be held for longer than absolutely necessary, ever).

常见的误解是自旋锁或无锁算法通常“速度更快”，或者仅对“非常短的任务”有用（理想情况下，任何同步对象的保留时间都不应超过绝对必要的时间）。

The one important difference is how the different approaches behave in presence of congestion.

一个重要的区别是存在拥塞时不同方法的行为。

A well-designed system normally has low or no congestion (this means not all threads try to acquire the lock at the exact same time). For example, one would normally not write code that acquires a lock, then loads half a megabyte of zip-compressed data from the network, decodes and parses the data, and finally modifies a shared reference (append data to a container, etc.) before releasing the lock. Instead, one would acquire the lock only for the purpose of accessing the shared resource.

设计良好的系统通常拥塞少或没有拥塞（这意味着并非所有线程都试图在同一时间获取锁）。例如，通常不会编写获取锁的代码，然后从网络加载半兆字节的zip压缩数据，对数据进行解码和解析，最后修改共享的引用（将数据附加到容器等）。释放锁之前。取而代之的是，仅出于访问共享资源的目的而获得锁。

Since this means that there is considerably more work outside the critical section than inside it, naturally the likelihood for a thread being inside the critical section is relatively low, and thus few threads are contending for the lock at the same time. Of course every now and then two threads will try to acquire the lock at the same time (if this couldn't happen you wouldn't need a lock!), but this is rather the exception than the rule in a "healthy" system.

由于这意味着在关键部分之外的工作要多于在关键部分内部的工作，因此自然而然地，在关键部分内部的线程的可能性相对较低，因此很少有线程同时争用锁。当然，不时有两个线程会尝试同时获取锁（如果不可能的话，您就不需要锁！），但这是一个例外，而不是“健康”系统中的规则。

In such a case, a spinlock greatly outperforms a semaphore because if there is no lock congestion, the overhead of acquiring the spinlock is a mere dozen cycles as compared to hundreds/thousands of cycles for a context switch or 10-20 million cycles for losing the remainder of a time slice.

在这种情况下，自旋锁的性能大大优于信号量，因为如果没有锁拥塞，则获取自旋锁的开销仅为十几个周期，而上下文切换则为数百/数千个周期，而丢失则为10-20百万个周期时间片的其余部分。

On the other hand, given high congestion, or if the lock is being held for lengthy periods (sometimes you just can't help it!), a spinlock will burn insane amounts of CPU cycles for achieving nothing.

另一方面，由于拥塞程度很高，或者如果锁被长时间持有（有时您无能为力！），自旋锁将消耗大量的CPU周期，以至于什么也没做。

A semaphore (or mutex) is a much better choice in this case, as it allows a different thread to run useful tasks during that time. Or, if no other thread has something useful to do, it allows the operating system to throttle down the CPU and reduce heat / conserve energy.

在这种情况下，信号灯（或互斥锁）是一个更好的选择，因为它允许不同的线程在这段时间内运行有用的任务。或者，如果没有其他线程有用，则它允许操作系统降低CPU的速度并减少热量/节约能源。

Also, on a single-core system, a spinlock will be quite inefficient in presence of lock congestion, as a spinning thread will waste its complete time waiting for a state change that cannot possibly happen (not until the releasing thread is scheduled, which isn't happening while the waiting thread is running!). Therefore, given any amount of contention, acquiring the lock takes around 1 1/2 time slices in the best case (assuming the releasing thread is the next one being scheduled), which is not very good behaviour.

同样，在单核系统上，自旋锁在存在锁拥塞的情况下效率很低，因为自旋线程会浪费其全部时间来等待状态改变（除非计划了释放线程，否则这种情况不会发生）等待线程正在运行时不会发生！）。因此，在有任何争用的情况下，在最佳情况下获取锁大约需要1 1/2个时间片（假设释放线程是正在计划的下一个线程），这不是很好的行为。

## 4. How they're implemented

## 4.它们的实现方式

A semaphore will nowadays typically wrap sys_futex under Linux (optionally with a spinlock that exits after a few attempts).

如今，一个信号量通常会在Linux下包装sys_futex（可选地，带有自旋锁，在尝试几次后会退出）。

A spinlock is typically implemented using atomic operations, and without using anything provided by the operating system. In the past, this meant using either compiler intrinsics or non-portable assembler instructions. Meanwhile both C++11 and C11 have atomic operations as part of the language, so apart from the general difficulty of writing provably correct lock-free code, it is now possible to implement lock-free code in an entirely portable and (almost) painless way.

自旋锁通常使用原子操作来实现，而不使用操作系统提供的任何操作。 在过去，这意味着使用编译器内部函数或非便携式汇编程序指令。 同时，C ++ 11和C11都将原子操作作为语言的一部分，因此，除了编写可证明正确的无锁代码的一般困难之外，现在有可能在完全可移植且（几乎）可移植的代码中实现无锁代码。 无痛的方法。

<https://stackoverflow.com/questions/195853/spinlock-versus-semaphore>
