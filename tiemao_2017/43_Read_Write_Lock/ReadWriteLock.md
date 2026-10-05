```java
public interface ReadWriteLock
```



A `ReadWriteLock` maintains a pair of associated [`locks`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Lock.html), one for read-only operations and one for writing. The [`read lock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReadWriteLock.html#readLock--) may be held simultaneously by multiple reader threads, so long as there are no writers. The [`write lock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReadWriteLock.html#writeLock--) is exclusive.

读写锁(`ReadWriteLock`)持有一对相关联的锁([`locks`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Lock.html)), 一个用于只读操作, 一个用于写操作。 只要没有写线程, [`read lock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReadWriteLock.html#readLock--) 就可以被多个读线程同时持有。 [`write lock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReadWriteLock.html#writeLock--) 则是独占的(exclusive)。

All `ReadWriteLock` implementations must guarantee that the memory synchronization effects of `writeLock` operations (as specified in the [`Lock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Lock.html) interface) also hold with respect to the associated `readLock`. That is, a thread successfully acquiring the read lock will see all updates made upon previous release of the write lock.

`ReadWriteLock` 的实现类必须保证 `writeLock` 操作对内存同步的效果(参见 [`Lock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Lock.html) 接口说明文档), 对其关联的 `readLock` 也同样成立。 也就是说, 成功获取到读锁的线程, 必须能看到此前写锁释放时所做的全部更新。

A read-write lock allows for a greater level of concurrency in accessing shared data than that permitted by a mutual exclusion lock. It exploits the fact that while only a single thread at a time (a *writer* thread) can modify the shared data, in many cases any number of threads can concurrently read the data (hence *reader* threads). In theory, the increase in concurrency permitted by the use of a read-write lock will lead to performance improvements over the use of a mutual exclusion lock. In practice this increase in concurrency will only be fully realized on a multi-processor, and then only if the access patterns for the shared data are suitable.

读写锁在访问共享数据时所能达到的并发程度, 高于互斥锁。 它利用了这样一个事实: 同一时刻只有一个线程(*写*线程)可以修改共享数据, 但在很多场景下, 任意数量的线程都可以并发地读取数据(因而称为*读*线程)。 理论上, 使用读写锁所带来的并发度提升, 相比互斥锁会带来性能改善。 但在实践中, 这种并发度的提升只有在多处理器上才能充分体现, 并且只有在共享数据的访问模式合适时才行。

Whether or not a read-write lock will improve performance over the use of a mutual exclusion lock depends on the frequency that the data is read compared to being modified, the duration of the read and write operations, and the contention for the data - that is, the number of threads that will try to read or write the data at the same time. For example, a collection that is initially populated with data and thereafter infrequently modified, while being frequently searched (such as a directory of some kind) is an ideal candidate for the use of a read-write lock. However, if updates become frequent then the data spends most of its time being exclusively locked and there is little, if any increase in concurrency.

读写锁相比互斥锁能否带来性能提升, 取决于数据被读取相对于被修改的频率、读写操作的持续时间, 以及数据上的竞争情况——也就是同一时刻尝试读写数据的线程数量。 例如, 一个初始化时写入数据、之后很少修改、却频繁被检索的集合(比如某种目录)就非常适合使用读写锁。 然而, 如果更新变得频繁, 数据大部分时间都处于独占锁定状态, 并发度就几乎不会提升。

Further, if the read operations are too short the overhead of the read-write lock implementation (which is inherently more complex than a mutual exclusion lock) can dominate the execution cost, particularly as many read-write lock implementations still serialize all threads through a small section of code. Ultimately, only profiling and measurement will establish whether the use of a read-write lock is suitable for your application.

此外, 如果读操作耗时太短, 读写锁实现本身的开销(天然比互斥锁更复杂)可能会主导执行成本, 尤其是许多读写锁实现仍然要让所有线程串行地经过一小段代码。 最终, 只有通过性能分析(profiling)和实际测量, 才能确定读写锁是否适合你的应用。

Although the basic operation of a read-write lock is straight-forward, there are many policy decisions that an implementation must make, which may affect the effectiveness of the read-write lock in a given application. Examples of these policies include:

虽然读写锁的基本操作很直观, 但实现时必须做出许多策略性的决策, 这些决策会影响读写锁在给定应用中的效果。 此类策略的例子包括:

- Determining whether to grant the read lock or the write lock, when both readers and writers are waiting, at the time that a writer releases the write lock. Writer preference is common, as writes are expected to be short and infrequent. Reader preference is less common as it can lead to lengthy delays for a write if the readers are frequent and long-lived as expected. Fair, or "in-order" implementations are also possible.
- Determining whether readers that request the read lock while a reader is active and a writer is waiting, are granted the read lock. Preference to the reader can delay the writer indefinitely, while preference to the writer can reduce the potential for concurrency.
- Determining whether the locks are reentrant: can a thread with the write lock reacquire it? Can it acquire a read lock while holding the write lock? Is the read lock itself reentrant?
- Can the write lock be downgraded to a read lock without allowing an intervening writer? Can a read lock be upgraded to a write lock, in preference to other waiting readers or writers?

- 当读线程和写线程都在等待, 而某个写线程释放写锁时, 决定是授予读锁还是写锁。 写者优先(writer preference)很常见, 因为写操作通常短促且不频繁; 读者优先(reader preference)则不太常见, 因为如果读线程频繁且如预期那样长期存活, 会导致写操作长时间延迟。 公平(fair)或者说"按序(in-order)"的实现也是可行的。
- 当某个读线程正在持锁、且有写线程在等待时, 决定是否把读锁授予那些请求读锁的读线程。 偏向读者可能无限期地拖延写者, 而偏向写者则可能降低潜在的并发度。
- 确定锁是否可重入: 持有写锁的线程能否再次获取写锁? 持有写锁时能否获取读锁? 读锁本身是否可重入?
- 写锁能否在不允许其他写者插入的情况下降级为读锁? 读锁能否优先于其他等待的读者或写者升级为写锁?

You should consider all of these things when evaluating the suitability of a given implementation for your application.

在判断某种读写锁实现是否满足系统需求时, 应该综合考虑以上几点。

- Since: 1.5

- 此接口由 JDK 1.5 引入


<https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReadWriteLock.html>


