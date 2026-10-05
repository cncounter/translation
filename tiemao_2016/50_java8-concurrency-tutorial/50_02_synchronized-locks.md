# Java 8 并发教程：同步与锁

> 原文: Java 8 Concurrency Tutorial: Synchronization and Locks

2015年4月30日

欢迎阅读我的 Java 8 并发教程第二部分，这是一系列通过易于理解的代码示例来讲解 Java 8 多线程编程的指南。在接下来的 15 分钟里，你将学会如何通过 synchronized 关键字、锁和信号量来同步对可变共享变量的访问。


*   第 1 部分：[线程与执行器](50_01_thread-executor.md)
*   第 2 部分：[同步与锁](50_02_synchronized-locks.md)
*   第 3 部分：[原子变量与 ConcurrentMap](50_03_atomic-concurrent-map.md)


本文展示的大部分概念在更早版本的 Java 中同样适用。不过代码示例聚焦于 Java 8，并大量使用了 lambda 表达式和新的并发特性。如果你还不熟悉 lambda，建议先阅读我的 [Java 8 教程](http://winterbe.com/posts/2014/03/16/java-8-tutorial/)。

为简单起见，本教程的代码示例使用了两个辅助方法 `sleep(seconds)` 和 `stop(executor)`，它们的定义见[这里](https://github.com/winterbe/java8-tutorial/blob/master/src/com/winterbe/java8/samples/concurrent/ConcurrentUtils.java)。

### 同步(Synchronized)

在[上一篇教程](/posts/2015/04/07/java8-concurrency-tutorial-thread-executor-examples/)中，我们学会了如何通过 executor 服务并行执行代码。编写这类多线程代码时，从多个线程并发访问共享可变变量必须格外小心。假设我们想要对一个可被多个线程同时访问的整数进行自增。

我们定义了一个字段 `count`，以及一个将其加一的方法 `increment()`：

    int count = 0;

    void increment() {
        count = count + 1;
    }

当从多个线程并发调用这个方法时，我们就会遇到大麻烦：

    ExecutorService executor = Executors.newFixedThreadPool(2);

    IntStream.range(0, 10000)
        .forEach(i -> executor.submit(this::increment));

    stop(executor);

    System.out.println(count);  // 9965

结果并不是固定的 10000，而是每次执行上面的代码都会得到不同的实际结果。原因在于我们在不同线程之间共享了一个可变变量，却没有同步对该变量的访问，从而导致了[竞态条件](http://en.wikipedia.org/wiki/Race_condition)。

要让这个数字自增，必须执行三个步骤：(i) 读取当前值，(ii) 将该值加一，(iii) 把新值写回变量。如果两个线程并行执行这些步骤，它们有可能同时执行第 1 步，从而读到相同的当前值。这会导致写丢失，因此实际结果偏低。在上面的示例中，由于对 count 的并发且未同步的访问，丢失了 35 次自增，但你自己执行这段代码时可能会看到不同的结果。

幸运的是，Java 从早期开始就通过 `synchronized` 关键字支持线程同步。我们可以利用 `synchronized` 来修复上面自增 count 时的竞态条件：

    synchronized void incrementSync() {
        count = count + 1;
    }

并发使用 `incrementSync()` 时，我们得到了期望的结果 10000。不再发生竞态条件，每次执行代码的结果都是稳定的：

    ExecutorService executor = Executors.newFixedThreadPool(2);

    IntStream.range(0, 10000)
        .forEach(i -> executor.submit(this::incrementSync));

    stop(executor);

    System.out.println(count);  // 10000

`synchronized` 关键字也可以作为块语句使用。

    void incrementSync() {
        synchronized (this) {
            count = count + 1;
        }
    }

在内部，Java 使用一种称为 _监视器_（monitor）的机制来管理同步，它也被称为[监视器锁或内置锁](https://docs.oracle.com/javase/tutorial/essential/concurrency/locksync.html)。这个监视器绑定到一个对象上，例如使用 synchronized 方法时，每个方法都共享对应对象的同一个监视器。

所有隐式监视器都具备 _可重入_ 特性。可重入意味着锁绑定到当前线程。一个线程可以安全地多次获取同一把锁而不会陷入死锁（例如一个 synchronized 方法调用同一对象上的另一个 synchronized 方法）。

### 锁(Locks)

除了通过 `synchronized` 关键字使用隐式锁，并发 API 还支持由 `Lock` 接口定义的各种显式锁。锁提供了多种方法以实现更细粒度的锁控制，因此比隐式监视器更具表达力。

标准 JDK 中提供了多种锁的实现，将在后续各节中演示。

#### ReentrantLock

`ReentrantLock` 类是一种互斥锁，其基本行为与通过 `synchronized` 关键字访问的隐式监视器相同，但具备更强的扩展能力。顾名思义，这种锁和隐式监视器一样实现了可重入特性。

让我们看看使用 `ReentrantLock` 时上面的示例是什么样子：

    ReentrantLock lock = new ReentrantLock();
    int count = 0;

    void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock();
        }
    }

锁通过 `lock()` 获取，通过 `unlock()` 释放。重要的是要把代码包裹在 `try/finally` 块中，以确保发生异常时也能解锁。这个方法与 synchronized 版本一样是线程安全的。如果另一个线程已经获取了锁，那么后续对 `lock()` 的调用会暂停当前线程，直到锁被释放。任意时刻只能有一个线程持有该锁。

锁提供了多种方法以实现细粒度控制，如下一个示例所示：

    ExecutorService executor = Executors.newFixedThreadPool(2);
    ReentrantLock lock = new ReentrantLock();

    executor.submit(() -> {
        lock.lock();
        try {
            sleep(1);
        } finally {
            lock.unlock();
        }
    });

    executor.submit(() -> {
        System.out.println("Locked: " + lock.isLocked());
        System.out.println("Held by me: " + lock.isHeldByCurrentThread());
        boolean locked = lock.tryLock();
        System.out.println("Lock acquired: " + locked);
    });

    stop(executor);

第一个任务持有锁一秒钟，同时第二个任务获取了关于锁当前状态的不同信息：

    Locked: true
    Held by me: false
    Lock acquired: false

`tryLock()` 方法作为 `lock()` 的替代方案，尝试获取锁而不暂停当前线程。在访问任何共享可变变量之前，必须使用布尔返回值来检查锁是否真的获取成功。

#### ReadWriteLock

`ReadWriteLock` 接口定义了另一种锁，它维护一对分别用于读访问和写访问的锁。读写锁背后的思想是：只要没有线程在写入某个可变变量，并发读取它通常是安全的。因此，只要没有线程持有写锁，读锁就可以被多个线程同时持有。在读操作比写操作更频繁的情况下，这可以提升性能和吞吐量。

    ExecutorService executor = Executors.newFixedThreadPool(2);
    Map<String, String> map = new HashMap<>();
    ReadWriteLock lock = new ReentrantReadWriteLock();

    executor.submit(() -> {
        lock.writeLock().lock();
        try {
            sleep(1);
            map.put("foo", "bar");
        } finally {
            lock.writeLock().unlock();
        }
    });

上面的示例先获取写锁，以便在休眠一秒后向 map 中放入一个新值。在这个任务完成之前，又提交了另外两个任务，它们尝试从 map 中读取条目并休眠一秒钟：

    Runnable readTask = () -> {
        lock.readLock().lock();
        try {
            System.out.println(map.get("foo"));
            sleep(1);
        } finally {
            lock.readLock().unlock();
        }
    };

    executor.submit(readTask);
    executor.submit(readTask);

    stop(executor);

执行这个代码示例时，你会注意到两个读任务都必须等待整整一秒，直到写任务完成。写锁释放之后，两个读任务会并行执行，并同时把结果打印到控制台。它们不必互相等待完成，因为只要没有其他线程持有写锁，读锁就可以被安全地并发获取。

#### StampedLock

Java 8 附带了一种名为 `StampedLock` 的新锁，它和上面的示例一样也支持读锁和写锁。与 `ReadWriteLock` 不同的是，`StampedLock` 的加锁方法会返回一个由 `long` 值表示的 stamp（时间戳）。你可以用这些 stamp 来释放锁，或检查锁是否仍然有效。此外，stamped 锁还支持另一种称为 _乐观锁_ 的锁模式。

让我们把上一个示例的代码改用 `StampedLock` 而不是 `ReadWriteLock`：

    ExecutorService executor = Executors.newFixedThreadPool(2);
    Map<String, String> map = new HashMap<>();
    StampedLock lock = new StampedLock();

    executor.submit(() -> {
        long stamp = lock.writeLock();
        try {
            sleep(1);
            map.put("foo", "bar");
        } finally {
            lock.unlockWrite(stamp);
        }
    });

    Runnable readTask = () -> {
        long stamp = lock.readLock();
        try {
            System.out.println(map.get("foo"));
            sleep(1);
        } finally {
            lock.unlockRead(stamp);
        }
    };

    executor.submit(readTask);
    executor.submit(readTask);

    stop(executor);

通过 `readLock()` 或 `writeLock()` 获取读锁或写锁会返回一个 stamp，稍后在 finally 块中用它来解锁。请记住，stamped 锁不实现可重入特性。每次加锁都会返回一个新的 stamp，即使同一个线程已经持有了锁，只要没有可用的锁它就会阻塞。因此你必须格外注意，避免陷入死锁。

和前面的 `ReadWriteLock` 示例一样，两个读任务都必须等待写锁被释放。然后两个读任务会同时向控制台打印，因为只要没有持有写锁，多个读操作就不会互相阻塞。

下一个示例演示 _乐观锁_：

    ExecutorService executor = Executors.newFixedThreadPool(2);
    StampedLock lock = new StampedLock();

    executor.submit(() -> {
        long stamp = lock.tryOptimisticRead();
        try {
            System.out.println("Optimistic Lock Valid: " + lock.validate(stamp));
            sleep(1);
            System.out.println("Optimistic Lock Valid: " + lock.validate(stamp));
            sleep(2);
            System.out.println("Optimistic Lock Valid: " + lock.validate(stamp));
        } finally {
            lock.unlock(stamp);
        }
    });

    executor.submit(() -> {
        long stamp = lock.writeLock();
        try {
            System.out.println("Write Lock acquired");
            sleep(2);
        } finally {
            lock.unlock(stamp);
            System.out.println("Write done");
        }
    });

    stop(executor);

乐观读锁通过调用 `tryOptimisticRead()` 获取，它总是返回一个 stamp 而不会阻塞当前线程，无论锁实际上是否可用。如果当前已经有写锁处于活动状态，返回的 stamp 等于 0。你随时可以通过调用 `lock.validate(stamp)` 来检查某个 stamp 是否有效。

执行上面的代码会得到如下输出：

    Optimistic Lock Valid: true
    Write Lock acquired
    Optimistic Lock Valid: false
    Write done
    Optimistic Lock Valid: false

乐观锁在获取之后立即是有效的。与普通读锁不同，乐观锁不会阻止其他线程立刻获取写锁。在让第一个线程休眠一秒之后，第二个线程无需等待乐观读锁被释放就获取了写锁。从这一刻起，乐观读锁不再有效。即使写锁被释放，乐观读锁仍然保持无效。

因此，使用乐观锁时，你必须在访问任何共享可变变量 _之后_ 每次都验证锁，以确保这次读取仍然有效。

有时，在不先解锁再重新加锁的情况下把读锁转换为写锁是很有用的。为此，`StampedLock` 提供了 `tryConvertToWriteLock()` 方法，如下一个示例所示：

    ExecutorService executor = Executors.newFixedThreadPool(2);
    StampedLock lock = new StampedLock();

    executor.submit(() -> {
        long stamp = lock.readLock();
        try {
            if (count == 0) {
                stamp = lock.tryConvertToWriteLock(stamp);
                if (stamp == 0L) {
                    System.out.println("Could not convert to write lock");
                    stamp = lock.writeLock();
                }
                count = 23;
            }
            System.out.println(count);
        } finally {
            lock.unlock(stamp);
        }
    });

    stop(executor);

这个任务首先获取读锁，并把字段 `count` 的当前值打印到控制台。但如果当前值为 0，我们就想赋予它一个新值 `23`。首先必须把读锁转换为写锁，以免破坏其他线程可能的并发访问。调用 `tryConvertToWriteLock()` 不会阻塞，但可能返回一个为 0 的 stamp，表示当前没有可用的写锁。这种情况下，我们调用 `writeLock()` 来阻塞当前线程，直到有写锁可用为止。

### 信号量(Semaphores)

除了锁之外，并发 API 还支持计数信号量。锁通常授予对变量或资源的独占访问，而信号量能够维护一整套许可。在你需要限制对应用某些部分的并发访问量的各种场景中，这非常有用。

下面是一个示例，演示如何限制对一个由 `sleep(5)` 模拟的长时间运行任务的访问：

    ExecutorService executor = Executors.newFixedThreadPool(10);

    Semaphore semaphore = new Semaphore(5);

    Runnable longRunningTask = () -> {
        boolean permit = false;
        try {
            permit = semaphore.tryAcquire(1, TimeUnit.SECONDS);
            if (permit) {
                System.out.println("Semaphore acquired");
                sleep(5);
            } else {
                System.out.println("Could not acquire semaphore");
            }
        } catch (InterruptedException e) {
            throw new IllegalStateException(e);
        } finally {
            if (permit) {
                semaphore.release();
            }
        }
    }

    IntStream.range(0, 10)
        .forEach(i -> executor.submit(longRunningTask));

    stop(executor);

这个执行器理论上可以并发运行 10 个任务，但我们使用了一个大小为 5 的信号量，从而把并发访问限制为 5。重要的是要使用 `try/finally` 块，以便即使发生异常也能正确释放信号量。

执行上面的代码会得到如下输出：

    Semaphore acquired
    Semaphore acquired
    Semaphore acquired
    Semaphore acquired
    Semaphore acquired
    Could not acquire semaphore
    Could not acquire semaphore
    Could not acquire semaphore
    Could not acquire semaphore
    Could not acquire semaphore

信号量最多允许 5 个线程访问由 `sleep(5)` 模拟的实际长时间运行操作。之后每次对 `tryAcquire()` 的调用都会耗尽最长一秒的等待超时，从而在控制台输出相应的信息，表示无法获取信号量。

这是并发教程系列的第二部分。近期还会发布更多部分，敬请关注。和往常一样，你可以在 [GitHub](https://github.com/winterbe/java8-tutorial) 上找到本文的所有代码示例，欢迎 fork 这个仓库并亲自尝试。

希望你喜欢这篇文章。如果你还有任何疑问，欢迎在下方评论区把反馈发给我。你也可以[在 Twitter 上关注我](https://twitter.com/winterbe_)，获取更多与开发相关的内容！

*   Part 1: [Threads and Executors](50_01_thread-executor.md)
*   Part 2: [Synchronization and Locks](50_02_synchronized-locks.md)
*   Part 3: [Atomic Variables and ConcurrentMap](50_03_atomic-concurrent-map.md)


[Follow @winterbe](https://github.com/winterbe)

    [Follow @winterbe_](https://twitter.com/winterbe_)

    [Tweet](https://twitter.com/share)

Benjamin is Software Engineer, Full Stack Developer at [Pondus](http://pondus.de/en/homepage/), an excited runner and table foosball player.
    Get in touch on [Twitter](https://twitter.com/winterbe_), [Google+](https://plus.google.com/105973259367211176218/posts) and [GitHub](https://github.com/winterbe).

### Read More

*   [Recent](#)
*   [All Posts](http://winterbe.com/blog/)
*   [Java](http://winterbe.com/java/)
*   [JavaScript](http://winterbe.com/javascript/)
*   [Tutorials](http://winterbe.com/tutorials/)

*   [Recent](#)
*   [All Posts](http://winterbe.com/blog/)
*   [Java](http://winterbe.com/java/)
*   [Tutorials](http://winterbe.com/tutorials/)

*   [# Integrating React.js into Existing jQuery Web Applications](http://winterbe.com/posts/2015/08/24/integrate-reactjs-into-jquery-webapps/)
*   [# Java 8 Concurrency Tutorial: Atomic Variables and ConcurrentMap](http://winterbe.com/posts/2015/05/22/java8-concurrency-tutorial-atomic-concurrent-map-examples/)
*   [# Java 8 Concurrency Tutorial: Threads and Executors](http://winterbe.com/posts/2015/04/07/java8-concurrency-tutorial-thread-executor-examples/)
*   [# Java 8 API by Example: Strings, Numbers, Math and Files](http://winterbe.com/posts/2015/03/25/java8-examples-string-number-math-files/)


### 相关链接

- [深入浅出Java并发包—锁机制(一)](https://www.cnblogs.com/longshiyVip/p/5213771.html)
- [深入浅出Java并发包—锁机制(二)](https://www.cnblogs.com/longshiyVip/p/5213812.html)
- [深入浅出Java并发包—锁机制(三)](https://www.cnblogs.com/longshiyVip/p/5213821.html)
- [内存屏障](https://www.cnblogs.com/longshiyVip/p/5189629.html)
- 人生设计师: <http://blog.longjiazuo.com/>

原文链接: [http://winterbe.com/posts/2015/04/30/java8-concurrency-tutorial-synchronized-locks-examples/](http://winterbe.com/posts/2015/04/30/java8-concurrency-tutorial-synchronized-locks-examples/)
