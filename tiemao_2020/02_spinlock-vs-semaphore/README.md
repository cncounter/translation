# Spinlock vs. semaphore

Spinlock and semaphore differ mainly in four things:

## 1. What they are

A spinlock is one possible implementation of a lock, namely one that is implemented by busy waiting ("spinning"). A semaphore is a generalization of a lock (or, the other way around, a lock is a special case of a semaphore). Usually, but not necessarily, spinlocks are only valid within one process whereas semaphores can be used to synchronize between different processes, too.

A lock works for mutual exclusion, that is one thread at a time can acquire the lock and proceed with a "critical section" of code. Usually, this means code that modifies some data shared by several threads.

A semaphore has a counter and will allow itself being acquired by one or several threads, depending on what value you post to it, and (in some implementations) depending on what its maximum allowable value is.

Insofar, one can consider a lock a special case of a semaphore with a maximum value of 1.

## 2. What they do

As stated above, a spinlock is a lock, and therefore a mutual exclusion (strictly 1 to 1) mechanism. It works by repeatedly querying and/or modifying a memory location, usually in an atomic manner. This means that acquiring a spinlock is a "busy" operation that possibly burns CPU cycles for a long time (maybe forever!) while it effectively achieves "nothing".

The main incentive for such an approach is the fact that a context switch has an overhead equivalent to spinning a few hundred (or maybe thousand) times, so if a lock can be acquired by burning a few cycles spinning, this may overall very well be more efficient. Also, for realtime applications it may not be acceptable to block and wait for the scheduler to come back to them at some far away time in the future.

A semaphore, by contrast, either does not spin at all, or only spins for a very short time (as an optimization to avoid the syscall overhead). If a semaphore cannot be acquired, it blocks, giving up CPU time to a different thread that is ready to run. This may of course mean that a few milliseconds pass before your thread is scheduled again, but if this is no problem (usually it isn't) then it can be a very efficient, CPU-conservative approach.

## 3. How they behave in presence of congestion

It is a common misconception that spinlocks or lock-free algorithms are "generally faster", or that they are only useful for "very short tasks" (ideally, no synchronization object should be held for longer than absolutely necessary, ever).

The one important difference is how the different approaches behave in presence of congestion.

A well-designed system normally has low or no congestion (this means not all threads try to acquire the lock at the exact same time). For example, one would normally not write code that acquires a lock, then loads half a megabyte of zip-compressed data from the network, decodes and parses the data, and finally modifies a shared reference (append data to a container, etc.) before releasing the lock. Instead, one would acquire the lock only for the purpose of accessing the shared resource.

Since this means that there is considerably more work outside the critical section than inside it, naturally the likelihood for a thread being inside the critical section is relatively low, and thus few threads are contending for the lock at the same time. Of course every now and then two threads will try to acquire the lock at the same time (if this couldn't happen you wouldn't need a lock!), but this is rather the exception than the rule in a "healthy" system.

In such a case, a spinlock greatly outperforms a semaphore because if there is no lock congestion, the overhead of acquiring the spinlock is a mere dozen cycles as compared to hundreds/thousands of cycles for a context switch or 10-20 million cycles for losing the remainder of a time slice.

On the other hand, given high congestion, or if the lock is being held for lengthy periods (sometimes you just can't help it!), a spinlock will burn insane amounts of CPU cycles for achieving nothing.

A semaphore (or mutex) is a much better choice in this case, as it allows a different thread to run useful tasks during that time. Or, if no other thread has something useful to do, it allows the operating system to throttle down the CPU and reduce heat / conserve energy.

Also, on a single-core system, a spinlock will be quite inefficient in presence of lock congestion, as a spinning thread will waste its complete time waiting for a state change that cannot possibly happen (not until the releasing thread is scheduled, which isn't happening while the waiting thread is running!). Therefore, given any amount of contention, acquiring the lock takes around 1 1/2 time slices in the best case (assuming the releasing thread is the next one being scheduled), which is not very good behaviour.

## 4. How they're implemented

A semaphore will nowadays typically wrap sys_futex under Linux (optionally with a spinlock that exits after a few attempts).

A spinlock is typically implemented using atomic operations, and without using anything provided by the operating system. In the past, this meant using either compiler intrinsics or non-portable assembler instructions. Meanwhile both C++11 and C11 have atomic operations as part of the language, so apart from the general difficulty of writing provably correct lock-free code, it is now possible to implement lock-free code in an entirely portable and (almost) painless way.


<https://stackoverflow.com/questions/195853/spinlock-versus-semaphore>
