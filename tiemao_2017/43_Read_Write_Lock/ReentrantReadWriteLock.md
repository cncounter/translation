```java
public class ReentrantReadWriteLock
extends Object
implements ReadWriteLock, Serializable
```



An implementation of [`ReadWriteLock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReadWriteLock.html) supporting similar semantics to [`ReentrantLock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html).

的实现(`ReadWriteLock`)(https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReadWriteLock.html)支持类似的语义(`ReentrantLock`(https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html)。]

This class has the following properties:

这类具有以下属性:

- **Acquisition order**

- * * * *购置order

This class does not impose a reader or writer preference ordering for lock access. However, it does support an optional *fairness* policy.

这个类不强加给读者或作者偏好排序锁访问。然而,它支持一个可选的* *公平政策。

- **Non-fair mode (default)**

- * * * *那块模式(默认)

When constructed as non-fair (the default), the order of entry to the read and write lock is unspecified, subject to reentrancy constraints. A nonfair lock that is continuously contended may indefinitely postpone one or more reader or writer threads, but will normally have higher throughput than a fair lock.

当构造块(默认),加入的顺序读写锁不明,可重入性约束.nonfair锁不断声称可能无限期推迟一个或多个读者或作者线程,但通常会有更高的吞吐量比公平锁。

- **Fair mode**

- * * * *公平方式

When constructed as fair, threads contend for entry using an approximately arrival-order policy. When the currently held lock is released, either the longest-waiting single writer thread will be assigned the write lock, or if there is a group of reader threads waiting longer than all waiting writer threads, that group will be assigned the read lock.

当构建公平、线程争条目使用大约arrival-order政策.目前释放锁时,要么是最长的排队时间单写线程将被指派写锁,或者如果有一群读线程等待时间比所有等待写线程,这个群体将被指派读锁。

A thread that tries to acquire a fair read lock (non-reentrantly) will block if either the write lock is held, or there is a waiting writer thread. The thread will not acquire the read lock until after the oldest currently waiting writer thread has acquired and released the write lock. Of course, if a waiting writer abandons its wait, leaving one or more reader threads as the longest waiters in the queue with the write lock free, then those readers will be assigned the read lock.

一个线程试图获得一个公平的读锁(不可重入)将块如果写锁,或有一个写线程等待.不会获得读锁的线程,直到目前最古老的等待写线程获取和释放写锁.当然,如果一个等待作家放弃等待,离开一个或多个读线程的队列最长的服务员写锁自由,那么这些读者将被指派读锁。

A thread that tries to acquire a fair write lock (non-reentrantly) will block unless both the read lock and write lock are free (which implies there are no waiting threads). (Note that the non-blocking [`ReentrantReadWriteLock.ReadLock.tryLock()`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantReadWriteLock.ReadLock.html#tryLock--) and [`ReentrantReadWriteLock.WriteLock.tryLock()`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantReadWriteLock.WriteLock.html#tryLock--)methods do not honor this fair setting and will immediately acquire the lock if it is possible, regardless of waiting threads.)

一个线程试图获得一个公平的写锁(不可重入)将阻止,除非读锁和写锁都是免费的(这意味着没有等待线程).(注意,非阻塞`ReentrantReadWriteLock.ReadLock.tryLock()``ReentrantReadWriteLock.WriteLock.tryLock()`)(https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantReadWriteLock.WriteLock.html # tryLock——)方法不尊重这种公平的设置将立即获得锁,如果它是可能的,不管等待线程)。

- **Reentrancy**

- Reentrancy * * * *

This lock allows both readers and writers to reacquire read or write locks in the style of a [`ReentrantLock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html). Non-reentrant readers are not allowed until all write locks held by the writing thread have been released.

这个锁允许读者和作家重新获取读写锁的风格(`ReentrantLock`)(https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html)。不可重入的读者是不允许直到所有写写线程持有的锁被释放。

Additionally, a writer can acquire the read lock, but not vice-versa. Among other applications, reentrancy can be useful when write locks are held during calls or callbacks to methods that perform reads under read locks. If a reader tries to acquire the write lock it will never succeed.

此外,一个作家可以获得读锁,但不是亦然..如果一个读者试图获取写入锁它永远不会成功。

- **Lock downgrading**

- * * * *锁降级

Reentrancy also allows downgrading from the write lock to a read lock, by acquiring the write lock, then the read lock and then releasing the write lock. However, upgrading from a read lock to the write lock is **not** possible.

可重入性还允许从写锁降级读锁,通过收购写锁,然后读锁,然后释放写锁.然而,从读锁升级写锁* *不* *是可能的。

- **Interruption of lock acquisition**

- * * * * lock of购置中断

The read lock and write lock both support interruption during lock acquisition.

读锁和写锁锁获取期间都支持中断。

- **Condition support**

- * * * *地位支架

The write lock provides a [`Condition`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html) implementation that behaves in the same way, with respect to the write lock, as the [`Condition`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html) implementation provided by[`ReentrantLock.newCondition()`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html#newCondition--) does for [`ReentrantLock`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html). This [`Condition`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html) can, of course, only be used with the write lock.

写锁提供了(`Condition`)(https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html)实现的行为同样,关于写锁,(`Condition`https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html](执行)的[`ReentrantLock.newCondition()`为[](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html newCondition——)`ReentrantLock`(https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantLock.html)。]这一[`Condition`)(https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html),当然,只用于写锁。

The read lock does not support a [`Condition`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html) and `readLock().newCondition()` throws `UnsupportedOperationException`.

读锁不支持(`Condition`https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html](和)`readLock().newCondition()`抛出`UnsupportedOperationException`。

- **Instrumentation**

- * * * *配器法

This class supports methods to determine whether locks are held or contended. These methods are designed for monitoring system state, not for synchronization control.

这类支持方法来确定是否锁争用。这些方法用于监测系统状态,而不是用于同步控制。

Serialization of this class behaves in the same way as built-in locks: a deserialized lock is in the unlocked state, regardless of its state when serialized.

序列化的类行为以同样的方式作为内置锁:反序列化锁处于解锁状态,无论序列化时其状态。

**Sample usages**. Here is a code sketch showing how to perform lock downgrading after updating a cache (exception handling is particularly tricky when handling multiple locks in a non-nested fashion):

这位用途* * * *.这是一个代码草图显示如何执行锁降级后更新缓存(异常处理时尤为棘手的处理多个锁non-nested方式):

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

ReentrantReadWriteLocks可以用来改善并发性在某些使用一些类型的集合.这通常是有价值的只有当预计将大集合,由比作家更读线程的线程访问,和需要操作的开销超过同步开销。例如,这是一个类使用TreeMap有望大并发访问。

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

这锁最多支持65535递归写65535年锁和读锁。试图超越这些限制导致(`Error`)(https://docs.oracle.com/javase/8/docs/api/java/lang/Error.html)将从锁定的方法。

- Since:

- 自:

1.5

1.5

<https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/ReentrantReadWriteLock.html>



