```java
public class ReentrantReadWriteLock
extends Object
implements ReadWriteLock, Serializable
```



An implementation of [`ReadWriteLock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReadWriteLock.html) supporting similar semantics to [`ReentrantLock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html).

`ReadWriteLock` 的一个实现, 其语义与 [`ReentrantLock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html) 类似。

This class has the following properties:

该类具有以下属性:

- **Acquisition order**

- **获取顺序**

This class does not impose a reader or writer preference ordering for lock access. However, it does support an optional *fairness* policy.

该类不对锁的访问施加读者或写者优先的顺序。 不过, 它支持一个可选的*公平性(fairness)*策略。

- **Non-fair mode (default)**

- **非公平模式(默认)**

When constructed as non-fair (the default), the order of entry to the read and write lock is unspecified, subject to reentrancy constraints. A nonfair lock that is continuously contended may indefinitely postpone one or more reader or writer threads, but will normally have higher throughput than a fair lock.

当以非公平模式(默认)构造时, 进入读锁和写锁的顺序是不确定的, 受可重入性约束的限制。 一个持续被争用的非公平锁可能无限期地推迟一个或多个读线程或写线程, 但通常比公平锁拥有更高的吞吐量。

- **Fair mode**

- **公平模式**

When constructed as fair, threads contend for entry using an approximately arrival-order policy. When the currently held lock is released, either the longest-waiting single writer thread will be assigned the write lock, or if there is a group of reader threads waiting longer than all waiting writer threads, that group will be assigned the read lock.

当以公平模式构造时, 线程按照大致先到先得(arrival-order)的策略竞争进入。 当当前持有的锁被释放时, 要么把写锁分配给等待时间最长的那个写线程, 要么如果存在一组等待时间比所有等待写线程都长的读线程, 就把读锁分配给这一组读线程。

A thread that tries to acquire a fair read lock (non-reentrantly) will block if either the write lock is held, or there is a waiting writer thread. The thread will not acquire the read lock until after the oldest currently waiting writer thread has acquired and released the write lock. Of course, if a waiting writer abandons its wait, leaving one or more reader threads as the longest waiters in the queue with the write lock free, then those readers will be assigned the read lock.

一个试图以非重入方式获取公平读锁的线程, 如果写锁已被持有、或存在正在等待的写线程, 就会被阻塞。 该线程要等到当前等待时间最长的写线程获取并释放了写锁之后, 才能获取读锁。 当然, 如果某个等待的写线程放弃等待, 使得一个或多个读线程成为队列中等待时间最长者、而此时写锁空闲, 那么这些读线程就会被分配读锁。

A thread that tries to acquire a fair write lock (non-reentrantly) will block unless both the read lock and write lock are free (which implies there are no waiting threads). (Note that the non-blocking [`ReentrantReadWriteLock.ReadLock.tryLock()`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantReadWriteLock.ReadLock.html#tryLock--) and [`ReentrantReadWriteLock.WriteLock.tryLock()`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantReadWriteLock.WriteLock.html#tryLock--)methods do not honor this fair setting and will immediately acquire the lock if it is possible, regardless of waiting threads.)

一个试图以非重入方式获取公平写锁的线程, 除非读锁和写锁都空闲(这意味着没有等待中的线程), 否则就会阻塞。 (注意, 非阻塞的 [`ReentrantReadWriteLock.ReadLock.tryLock()`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantReadWriteLock.ReadLock.html#tryLock--) 和 [`ReentrantReadWriteLock.WriteLock.tryLock()`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantReadWriteLock.WriteLock.html#tryLock--) 方法并不遵守这种公平设置, 只要有可能就会立即获取锁, 而不理会等待中的线程。)

- **Reentrancy**

- **可重入性**

This lock allows both readers and writers to reacquire read or write locks in the style of a [`ReentrantLock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html). Non-reentrant readers are not allowed until all write locks held by the writing thread have been released.

该锁允许读者和写者以 [`ReentrantLock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html) 的风格重新获取读锁或写锁。 在写线程所持有的全部写锁被释放之前, 不允许非重入的读者进入。

Additionally, a writer can acquire the read lock, but not vice-versa. Among other applications, reentrancy can be useful when write locks are held during calls or callbacks to methods that perform reads under read locks. If a reader tries to acquire the write lock it will never succeed.

此外, 写者可以获取读锁, 反之则不行。 除了其他用途之外, 当在持有写锁期间调用或在回调中调用那些需要在读锁下执行读取的方法时, 可重入性会很有用。 如果读者试图获取写锁, 则永远不会成功。

- **Lock downgrading**

- **锁降级**

Reentrancy also allows downgrading from the write lock to a read lock, by acquiring the write lock, then the read lock and then releasing the write lock. However, upgrading from a read lock to the write lock is **not** possible.

可重入性还允许从写锁降级为读锁: 先获取写锁, 再获取读锁, 然后释放写锁。 然而, 从读锁升级为写锁是**不可能**的。

- **Interruption of lock acquisition**

- **锁获取的中断**

The read lock and write lock both support interruption during lock acquisition.

读锁和写锁在获取锁的过程中都支持中断。

- **Condition support**

- **条件(Condition)支持**

The write lock provides a [`Condition`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html) implementation that behaves in the same way, with respect to the write lock, as the [`Condition`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html) implementation provided by[`ReentrantLock.newCondition()`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html#newCondition--) does for [`ReentrantLock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html). This [`Condition`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html) can, of course, only be used with the write lock.

写锁提供了一个 [`Condition`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html) 实现, 就写锁而言, 它的行为与 [`ReentrantLock.newCondition()`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html#newCondition--) 为 [`ReentrantLock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html) 提供的 [`Condition`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html) 实现相同。 当然, 这个 [`Condition`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html) 只能与写锁一起使用。

The read lock does not support a [`Condition`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html) and `readLock().newCondition()` throws `UnsupportedOperationException`.

读锁不支持 [`Condition`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html), `readLock().newCondition()` 会抛出 `UnsupportedOperationException`。

- **Instrumentation**

- **监测(Instrumentation)**

This class supports methods to determine whether locks are held or contended. These methods are designed for monitoring system state, not for synchronization control.

该类提供了用于判断锁是否被持有或被争用的方法。 这些方法是为监视系统状态而设计的, 不用于同步控制。

Serialization of this class behaves in the same way as built-in locks: a deserialized lock is in the unlocked state, regardless of its state when serialized.

该类的序列化行为与内置锁相同: 无论序列化时处于何种状态, 反序列化后的锁都处于未锁定状态。

**Sample usages**. Here is a code sketch showing how to perform lock downgrading after updating a cache (exception handling is particularly tricky when handling multiple locks in a non-nested fashion):

**示例用法**。 下面这段代码草图展示了在更新缓存之后如何执行锁降级(当以非嵌套方式处理多个锁时, 异常处理会格外棘手):

```java
 class CachedData {
   Object data;
   volatile boolean cacheValid;
   final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();

   void processCachedData() {
     rwl.readLock().lock();
     if (!cacheValid) {
       // Must release read lock before acquiring write lock
       rwl.readLock().unlock();
       rwl.writeLock().lock();
       try {
         // Recheck state because another thread might have
         // acquired write lock and changed state before we did.
         if (!cacheValid) {
           data = ...
           cacheValid = true;
         }
         // Downgrade by acquiring read lock before releasing write lock
         rwl.readLock().lock();
       } finally {
         rwl.writeLock().unlock(); // Unlock write, still hold read
       }
     }

     try {
       use(data);
     } finally {
       rwl.readLock().unlock();
     }
   }
 }
```



ReentrantReadWriteLocks can be used to improve concurrency in some uses of some kinds of Collections. This is typically worthwhile only when the collections are expected to be large, accessed by more reader threads than writer threads, and entail operations with overhead that outweighs synchronization overhead. For example, here is a class using a TreeMap that is expected to be large and concurrently accessed.

在某些集合类的某些用法中, 可以使用 ReentrantReadWriteLock 来提升并发性。 通常只有在集合预计会很大、访问它的读线程多于写线程, 并且其操作的开销超过同步开销时才值得这样做。 例如, 下面这个类使用了预计会很大且会被并发访问的 TreeMap。

```java
 class RWDictionary {
   private final Map<String, Data> m = new TreeMap<String, Data>();
   private final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
   private final Lock r = rwl.readLock();
   private final Lock w = rwl.writeLock();

   public Data get(String key) {
     r.lock();
     try { return m.get(key); }
     finally { r.unlock(); }
   }
   public String[] allKeys() {
     r.lock();
     try { return m.keySet().toArray(); }
     finally { r.unlock(); }
   }
   public Data put(String key, Data value) {
     w.lock();
     try { return m.put(key, value); }
     finally { w.unlock(); }
   }
   public void clear() {
     w.lock();
     try { m.clear(); }
     finally { w.unlock(); }
   }
 }
```



### Implementation Notes

### 实现注意事项

This lock supports a maximum of 65535 recursive write locks and 65535 read locks. Attempts to exceed these limits result in [`Error`](https://docs.oracle.com/javase/8/docs/api/java/lang/Error.html) throws from locking methods.

该锁最多支持 65535 个递归写锁和 65535 个读锁。 试图超过这些限制时, 加锁方法会抛出 [`Error`](https://docs.oracle.com/javase/8/docs/api/java/lang/Error.html)。

- Since:

- 自:

1.5

1.5

<https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantReadWriteLock.html>


