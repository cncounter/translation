```java
public interface ReadWriteLock
```



A `ReadWriteLock` maintains a pair of associated [`locks`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Lock.html), one for read-only operations and one for writing. The [`read lock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReadWriteLock.html#readLock--) may be held simultaneously by multiple reader threads, so long as there are no writers. The [`write lock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReadWriteLock.html#writeLock--) is exclusive.

读写锁(`ReadWriteLock`)持有着一对相关联的锁([`locks`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Lock.html)), 一个用于只读操作, 一个用于写操作。[`read lock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReadWriteLock.html#readLock--) 允许多个线程同时持有, 当然, 读锁和写锁不能同时共存。 [`write lock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReadWriteLock.html#writeLock--) 只允许单个线程独占(exclusive)。

All `ReadWriteLock` implementations must guarantee that the memory synchronization effects of `writeLock` operations (as specified in the [`Lock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Lock.html) interface) also hold with respect to the associated `readLock`. That is, a thread successfully acquiring the read lock will see all updates made upon previous release of the write lock.

`ReadWriteLock` 的实现类必须保证 `writeLock`操作对内存同步的效果(参见 [`Lock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Lock.html) 接口说明文档), 同时也必须遵守 `readLock` 相关的规范。 也就是说, 某个线程获取到读锁的时候, 必须能看到前面的写锁线程所做的更新。

A read-write lock allows for a greater level of concurrency in accessing shared data than that permitted by a mutual exclusion lock. It exploits the fact that while only a single thread at a time (a *writer* thread) can modify the shared data, in many cases any number of threads can concurrently read the data (hence *reader* threads). In theory, the increase in concurrency permitted by the use of a read-write lock will lead to performance improvements over the use of a mutual exclusion lock. In practice this increase in concurrency will only be fully realized on a multi-processor, and then only if the access patterns for the shared data are suitable.

读写锁允许的并发访问共享数据大于允许的互斥锁.它引用的事实是:一次只有一个线程(*作家*线程)可以修改共享数据,在许多情况下任意数量的线程可以同时读取数据(因此*读者*线程).理论上,并发性的增加允许的使用读写锁会导致性能改进在使用互斥锁.在实践中这种并发性的增加只会完全实现在多处理器,然后只有在共享数据的访问模式是合适的。

Whether or not a read-write lock will improve performance over the use of a mutual exclusion lock depends on the frequency that the data is read compared to being modified, the duration of the read and write operations, and the contention for the data - that is, the number of threads that will try to read or write the data at the same time. For example, a collection that is initially populated with data and thereafter infrequently modified, while being frequently searched (such as a directory of some kind) is an ideal candidate for the use of a read-write lock. However, if updates become frequent then the data spends most of its time being exclusively locked and there is little, if any increase in concurrency.

lock read-write在不同的论坛将使用业绩over了相互排斥,采集lock定on the read is某些数据的当务之急转基因,读和写操作的持续时间,争用数据——也就是说,线程的数量,将尝试读或写数据在同一时间.例如,一组最初填充数据,此后经常修改,虽然经常被搜索(如某种目录)是一个理想的候选人使用读写锁.然而,如果更新变得频繁,数据花费的大部分时间被完全锁定,几乎没有,如果有增加并发性。

Further, if the read operations are too short the overhead of the read-write lock implementation (which is inherently more complex than a mutual exclusion lock) can dominate the execution cost, particularly as many read-write lock implementations still serialize all threads through a small section of code. Ultimately, only profiling and measurement will establish whether the use of a read-write lock is suitable for your application.

进一步,如果读取操作太短读写锁实现的开销(本质上是更复杂的比一个互斥锁)可以主导执行成本,特别是许多读写锁的实现仍然序列化所有线程通过一小段代码.最终,只有分析和测量将建立使用读写锁是否适合您的应用程序。

Although the basic operation of a read-write lock is straight-forward, there are many policy decisions that an implementation must make, which may affect the effectiveness of the read-write lock in a given application. Examples of these policies include:

虽然读写锁的基本操作是直接的,有很多政策实现必须做出的决定,可能影响的有效性读写锁在一个给定的应用程序。这些政策的例子包括:

- Determining whether to grant the read lock or the write lock, when both readers and writers are waiting, at the time that a writer releases the write lock. Writer preference is common, as writes are expected to be short and infrequent. Reader preference is less common as it can lead to lengthy delays for a write if the readers are frequent and long-lived as expected. Fair, or "in-order" implementations are also possible.
- Determining whether readers that request the read lock while a reader is active and a writer is waiting, are granted the read lock. Preference to the reader can delay the writer indefinitely, while preference to the writer can reduce the potential for concurrency.
- Determining whether the locks are reentrant: can a thread with the write lock reacquire it? Can it acquire a read lock while holding the write lock? Is the read lock itself reentrant?
- Can the write lock be downgraded to a read lock without allowing an intervening writer? Can a read lock be upgraded to a write lock, in preference to other waiting readers or writers?

- 决定是否授予读锁和写锁,当读者和作家都是等待,当时一个作家释放写锁.作家偏爱是很常见的,因为写预计将短和罕见的.读者偏好不常见,因为它会导致长时间的延迟写如果读者频繁和长寿。公平的,或“顺序”也有可能实现。
- 决定读者是否请求读取锁而活跃的读者和作家是等待,获得读锁.读者的偏好可以无限期拖延的作家,而偏好作者可以减少潜在的并发性。
- 确定是否可重入锁:可以写锁的线程重新获取吗?它能获得读锁,同时保持写锁吗?读锁本身可重入吗?
- Can the将downgraded to a lock be)每年733名无lock read作品?lock upgraded be read a Can,将肯定了lock readers其实正在迅速进行黄金作家?

You should consider all of these things when evaluating the suitability of a given implementation for your application.

在判断某种读写锁实现是否满足系统需求时, 应该综合考虑以上几点。

- Since: 1.5

- 此接口由 JDK 1.5 引入


<https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReadWriteLock.html>



