# Java多线程与并发面试题

[TOC]


## 1. 线程基础


### 1.1 什么是线程?

线程(Thread)就是程序代码执行的一条线, 在Java代码层面看来, 是一个方法调用另一个方法，依次排列的方法调用链。

当然，线程是操作系统中的概念，被称为轻量级的进程，是分配CPU资源和调度执行的基本单位。


### 1.2 什么是进程?

进程(Processe)是操作系统中的概念，是应用程序的一次动态执行过程，操作系统会给他分配各种资源，比如内存，文件，以及CPU资源。

每个进程都有自己的内存空间，相对于静态的应用程序二进制代码来说，这个虚拟内存地址空间就是一个副本。

比如，我们用命令行启动一次Java程序，就说启动了一个JVM进程。


### 1.3 线程与进程有什么区别?

一般来说，进程中可以包含多个线程，这些线程共享一块内存地址空间。
在Linux系统中，线程和进程概念并没有严格区分。

粗略来看，它们的区别有：

线程被称为轻量级的进程，线程之间的切换开销更小，线程占用的资源比进程少。
进程之间是独立的，不能共享内存地址空间；【Linux的轻量级进程我们当做线程来看即可】


### 1.4 Java中怎么创建线程?

Java语言中创建线程本质上只有一种方式: `new Thread()`。 启动线程则是调用 `start()` 方法。

Java中,继承 Thread 类,实现 Runnable 接口,实现 Callable 接口, 这些方式创建的都是可执行任务，并没有真正地创建线程。


### 1.5  `Thread#start()` 和 `Thread#run()` 方法有什么区别？

- `Thread#start()`: 启动一个新线程并异步执行其中的任务。
- `Thread#run()`: 在当前线程执行，和调用其他对象的普通方法没什么区别。


### 1.6 Thread类与Runnable接口有什么关系?

Thread类继承了Runnable接口，创建线程对象时，可以传入需要执行的 Runnable 任务。


### 1.7 Runnable 与 Callable 接口有什么区别？

- `Runnable#run()` 没有返回值
- `Callable#call()` 方法有返回值


### 1.8 线程有哪些状态?

Thread的状态包括:

- NEW：初始状态, 尚未启动
- RUNNABLE: 可运行状态
- RUNNING: 运行中
- READY: 就绪状态
- WAITING: 等待状态
- TIMED_WAITING: 限时等待被唤醒的状态
- BLOCKED: 阻塞状态,被对象锁或者IO阻塞
- TERMINATED: 终止状态


### 1.9 什么是守护线程？与前台线程的区别在哪里?


守护线程(Daemon Thread)也叫后台线程。

在JVM中，如果没有正在运行中的前台线程，则JVM就会自动结束运行，而不管守护线程。 所以守护线程一般用于执行某些可以被放弃的任务或事件。


### 1.10 `Thread.sleep(0)` 与 `TimeUnit.MILLISECONDS.sleep(0)` 有什么不同?

`TimeUnit.MILLISECONDS.sleep(0)` 没有效果，因为数值 `0` 会被过滤掉。

两种方法都可以实现线程休眠，让出CPU资源。

`Thread.sleep(0L)` 的用处是先让出CPU资源，然后再让操作系统进行调度，和 `Thread.yield()` 类似。

`TimeUnit.MILLISECONDS.sleep()` 方法是对 `Thread.sleep()` 的快捷封装。


## 2. 多线程与并发


### 2.1 并行和并发在你看来有什么区别？

- concurrent: 并发, 指多个线程在共同完成一件事情; 互相之间有依赖/有状态, 例如多个部门做同一个系统。
- parallel: 并行, 指多个线程各做各的事情; 互相之间无共享状态, 例如两个公司, 各做各的项目。

在GC算法中: concurrent指GC线程和业务线程一起执行的阶段； parallel则是指多个GC线程之间的并行执行。


### 2.2 为什么需要多线程?

多线程是指程序中包含多个执行流，即在一个程序中可以同时运行多个不同的线程来执行不同的任务。

本质原因是摩尔定律失效，CPU进入多核时代。 加上互联网时代的来临，分布式系统开发大规模普及。


### 2.3 多线程有什么优势?

多线程编程方式，通过合理的分工，能充分利用多个CPU核心，提高程序的执行性能。

再比如一个餐馆，多个服务员之间可以看做是多个并行线程。 服务员和厨师之间则可以看多是多个并发线程。


### 2.4 多线程有什么不好的地方?

1. 多线程的程序更加复杂，开发成本更高；
2. 消耗更多的资源，比如内存，CPU等等；
3. 多线程需要协调和管理，会相互影响，有资源竞争问题。


### 2.5 如何让一个线程执行完再执行第二个？

使用 `Thread#join()` 方法，可以让当前线程阻塞, 等待指定的 thread 执行完成后，再执行当前线程。


### 2.6 怎样让两个线程以指定顺序交替执行?

可以使用细粒度的锁(fine-grained locks)来控制执行顺序。

- 比如使用Java内置的 `object.wait()` 和 `object.notify()` 方法，依次执行完并通知对方。
- 或者使用同一个锁的多个 Condition, 分别等待。
- 或者创建自定义线程时, 使用 CountDownLatch 和 CyclicBarrier 等工具进行辅助。

### 2.7 `Thread.sleep` 和 `Object#wait()` 的区别

- `Thread.sleep()`: 让出CPU
- `Object#wait()` : 释放锁


### 2.8 线程之间如何通信?


线程间通信(inter-thread communication)主要有两种方式:

1. 共享内存: 多个线程之间使用堆内存之中的对象/属性作为状态值,来进行隐式的通信。
2. 消息传递: 线程之间通过明确的发送消息来进行显式的通信。



## 3. 线程安全

### 3.1 什么是线程安全?

线程安全是多线程环境下的一个概念，保证多个线程并发执行同一段代码时, 不会出现不确定的结果, 也不会出现与单线程执行时不一致的结果。 也就是保证多个线程对共享状态操作的正确性。

在Java中, 完全由代码来控制线程安全, 共享状态一般是指堆内存中的数据（对象的属性）。


### 3.2 线程安全有哪些特征?

- 原子性: 对基本数据类型的变量的读取和赋值操作是原子性操作，即这些操作是不可被中断的，要么执行，要么不执行。
- 可见性: 一个线程执行的修改操作，对其他线程来说必须立即可见。 Java 提供了volatile 关键字来保证可见性，读取时强制从主内存读取。
- 有序性: 保证线程内的串行语义，避免指令重排，例如增加内存屏障。


### 3.3 怎么保证线程安全？

- 使用原子类。
- 加锁: 例如 `synchronized`, `Lock`
- `object.wait()` 方法
- `object.notify()` 方法
- `thread.join()` 方法
- `CountdownLatch` 类
- `CyclicBarrier` 类
- `FutureTask` 类
- `Callable` 类


### 3.4 经常使用哪些线程安全的集合类?

- `ConcurrentHashMap`
- `CopyOnWriteArrayList`
- `ConcurrentLinkedQueue`
- `ConcurrentLinkedDeque`
- `Collections` 的 `synchronizedList` 等工具方法


### 3.5 类加载和初始化的过程是线程安全的吗? 哪些情况下是不安全的?

类加载的过程是同步阻塞方式的，所以是线程安全的。

类和对象初始化的过程也是同步阻塞的，但如果初始化代码中有引用泄漏，则可能造成其他问题。

### 3.6 ThreadLocal 是什么?

ThreadLocal, 线程本地变量。

### 3.7 ThreadLocal 的实现原理是什么?

每个 ThreadLocal 对象, 为每个线程提供独立的变量副本，所以每个线程都可以独立地改变自己的副本，而不会影响其它线程对应的副本。

### 3.8 ThreadLocal 有哪些使用场景？

- 维护遗留系统，避免增加方法调用参数，修改一连串方法签名
- Spring的JDBC连接以及事务管理
- 请求上下文: Tomcat基于线程的连接模型

### 3.9 使用 ThreadLocal 有哪些需要注意的地方?

- 注意防止污染: finally中及时进行清理, 避免污染下一次的请求。
- 防止内存泄漏: 避免将持有大量数据的对象放到ThreadLocal。



## 4. 线程池

线程池从功能上看，就是一个任务执行器。

### 4.1 怎么创建线程池？

创建线程池的方式有多种，例如:

- 构造 `ThreadPoolExecutor` 对象
- 使用`Executors` 工具类


### 4.2 有哪些种类的线程池

1. `newSingleThreadExecutor`
  创建一个单线程的线程池。这个线程池只有一个线程在工作，也就是相当于单线程串行执行所有任务。如果这个唯一的线程因为异常结束，那么会有一个新的线程来替代它。此线程池保证所有任务的执行顺序按照任务的提交顺序执行。
2. `newFixedThreadPool`
  创建固定大小的线程池。每次提交一个任务就创建一个线程，直到线程达到线程池的最大大小。线程池的大小一旦达到最大值就会保持不变，如果某个线程因为执行异常而结束，那么线程池会补充一个新线程。
3. `newCachedThreadPool`
  创建一个可缓存的线程池。如果线程池的大小超过了处理任务所需要的线程，那么就会回收部分空闲（60秒不执行任务）的线程，当任务数增加时，此线程池又可以智能的添加新线程来处理任务。此线程池不会对线程池大小做限制，线程池大小完全依赖于操作系统（或者说JVM）能够创建的最大线程大小。
4. `newScheduledThreadPool`
  创建一个大小无限的线程池。此线程池支持定时以及周期性执行任务的需求。



### 4.3 创建线程池有哪些常用参数？

```
public ThreadPoolExecutor(
    int corePoolSize,                   // 核心线程数
    int maximumPoolSize,                // 最大线程数
    long keepAliveTime,                 // 空闲存活时间
    TimeUnit unit,                      // 空闲存活时间单位
    BlockingQueue<Runnable> workQueue,  // 工作队列; 排队队列
    ThreadFactory threadFactory,        // 线程工厂
    RejectedExecutionHandler handler    // 拒绝策略处理器
)
```


### 4.4 线程池在什么时候会创建新线程?

ThreadPoolExecutor 提交任务逻辑:
1. 判断corePoolSize 【创建】
2. 加入workQueue
3. 判断maximumPoolSize 【创建】
4. 执行拒绝策略处理器



### 4.5 线程池可以指定哪些拒绝策略?

1. `ThreadPoolExecutor.AbortPolicy`: 丢弃任务并抛出 `RejectedExecutionException` 异常。
2. `ThreadPoolExecutor.DiscardPolicy`:  丢弃任务，但是不抛出异常。
3. `ThreadPoolExecutor.DiscardOldestPolicy`: 丢弃队列最前面的任务，然后重新提交被拒绝的任务
4. `ThreadPoolExecutor.CallerRunsPolicy`: 由调用线程（提交任务的线程）处理该任务


### 4.6  线程池都有哪些状态？

```
/**
 * RUNNING -> SHUTDOWN
 *    On invocation of shutdown()
 * (RUNNING or SHUTDOWN) -> STOP
 *    On invocation of shutdownNow()
 * SHUTDOWN -> TIDYING
 *    When both queue and pool are empty
 * STOP -> TIDYING
 *    When pool is empty
 * TIDYING -> TERMINATED
 *    When the terminated() hook method has completed
*/

private static final int RUNNING    = -1 << COUNT_BITS; // 运行中
private static final int SHUTDOWN   =  0 << COUNT_BITS; // 关闭
private static final int STOP       =  1 << COUNT_BITS; // 停止
private static final int TIDYING    =  2 << COUNT_BITS; // 收拾
private static final int TERMINATED =  3 << COUNT_BITS; // 终止
```

### 4.7 线程池的 `submit()` 和 `execute()` 方法有什么区别？

- `submit` 方法: 有Future封装的返回值，执行中如果抛出异常, 等待的方法中可以 catch 到。
- `execute` 方法: 无返回值, 执行任务是捕捉不到异常的。


### 4.8 线程池有哪些关闭方法?

- `shutdown()`: 停止接收新任务，已有的任务继续执行
- `shutdownNow()`: 停止接收新任务，停止执行已有的任务, 正在执行的线程会抛出 InterruptedException 异常。
- `awaitTermination(long timeOut, TimeUnit unit)`: 当前线程阻塞，等待终止


### 4.9 使用线程池有哪些好处?

- 避免创建线程的开销。
- 避免线程数量爆炸，导致系统崩溃。
- 合理控制线程数量, 避免过度的资源竞争, 造成系统性能急剧下降。
- 利用特定线程池的功能特征, 例如定时调度等。


### 4.10 其他问题

- 线程池的实现原理是什么?
- 怎么提交任务？
- 怎么获取执行结果?
- 如何控制线程池的线程池容量?
- 线程池怎样监控?

这些问题可以自己思考，参考前面的问题, 或者上网搜索。


## 5. 锁


### 5.1 Java中同步加锁的关键字是什么?

`synchronized`


### 5.2 synchronized 的原理是什么?

Java中的每个对象都是对象锁(Object monitor), 主要使用对象头标记字来实现。


### 5.3 synchronized 方法使用的是哪个对象锁?

实例方法锁的是  `this` 代表的对象;
静态方法锁的是对应的 `Class` 对象;


### 5.4 synchronized 有哪些优化?

- synchronized方法优化
- 偏向锁: BiaseLock, 轻量锁, 其开销相当于没有锁。


### 5.5 wait/notify 方法有什么作用?

- `object.wait()`: 放弃锁
- `object.notify()`: 通知一个等待的线程来抢这个锁
- `object.notifyAll()`: 通知所有等待的线程来抢这个锁

### 5.6 synchronized 和 Lock 有什么区别？

Lock 是更灵活的锁，使用方式灵活可控, 支持更灵活的编程方式。性能开销小

### 5.7 synchronized 和 Lock 相比,谁的性能高？

不一定，看具体场景。

synchronized退化成重量锁（Mutex）之后，高负载情况下性能开销会很大。


### 5.8 什么是可重入锁? 对象锁是不是可重入锁？

同一个线程，在执行到不同的方法时,可以多次获取这个锁。

synchronized 对应的锁属于可重入锁。

Java中的锁, 一般都是重入锁, 例如最基本的 ReentrantLock。


### 5.9 什么是公平锁? 对象锁是不是公平锁？

公平锁就是按申请的时间顺序，排队等待, 依次分配。

synchronized 对应的锁是非公平锁, 这样做的目的是为了提高执行性能，缺点是可能会产生线程饥饿现象。

ReentrantLock 提供了公平锁和非公平锁的实现。 无参构造函数默认创建的是非公平锁。

- 公平锁: `new ReentrantLock(true)`
- 非公平锁: `new ReentrantLock(false)`


### 5.10 什么是乐观锁? 什么是悲观锁?

悲观锁和乐观锁是一种逻辑上的概念, 最早出现在数据库中。

悲观锁适用于比较悲观的场景(并发争用很激烈)，采取直接加锁的方式。悲观地认为，不加锁的并发操作一定会出问题。例如 synchronized 锁, 或者数据库的 select for update 等。

乐观锁并不真实存在锁的状态, 适用于比较乐观，并发竞争情况不高的场景。 避免了悲观锁独占锁资源的现象，同时也提高了乐观场景下的并发程序执行性能。 比如数据库操作使用版本号, Java的原子类等。

在具体使用时, 乐观锁只在更新数据的时候，通过判断现有的数据是否和原数据一致来判断数据是否被其他线程操作，如果没被其他线程修改则进行数据更新，如果被其他线程修改则不进行数据更新(+自旋重试/while循环)。


### 5.11 什么是自旋锁?

自旋一般就是while循环, 持续进行条件比较, 比如Java的CAS操作。

缺点是如果情况很悲观, 长时间获取锁不成功而一直自旋，会给 CPU 带来很大的开销。


### 5.12 什么是 AQS？他的基本原理是什么?

AQS(AbstractQueuedSynchronizer) 是一个用来构建锁和同步的框架。
Java中各种常见的锁, 例如 ReentrantLock、ReadWriteLock，以及 Semaphore、CountDownLatch 等等，都是基于 AQS 来构建的。

AQS 在内部定义了一个 volatile int state 变量，表示同步状态：
当线程调用 lock 方法时:
- 如果 state=0，说明没有任何线程占有这个锁，可以获得锁并将 state=1；
- 如果 state=1，则说明有线程目前正在使用共享变量，其他线程必须加入同步队列进行等待。


### 5.13 什么是独占锁和共享锁?

独占锁是指任何时候都只有一个线程能获取的锁。 【信号量=1的场景】

共享锁是指可以同时被多个线程共同持有的锁【信号量=N+的场景】。


### 5.14 什么是读写锁?


Java 中的 ReentrantReadWriteLock, 允许一个线程进行写操作，允许多个线程读操作。

其中包括了两把锁:

- 读锁, readerLock; 共享锁; 允许多个线程共同持有;
- 写锁, writerLock; 独占锁, 互斥锁; 只能有1个线程获取; 同时排斥对应的读锁;


### 5.15 使用锁有哪些注意实现


- 保证业务需求, 所以需要使用的时候就使用。
- 适当降低锁的粒度, 提高性能。

Doug Lea《Java 并发编程：设计原则与模式》一书中，推荐的三个用锁的最佳实践，分别是：
1. 永远只在更新对象的成员变量时加锁
2. 永远只在访问可变的成员变量时加锁
3. 永远不在调用其他对象的方法时加锁



### 5.16 其他问题

- synchronized 锁升级是怎么回事？
- synchronized 和 volatile 的区别是什么？
- 什么是死锁？怎么防止死锁？

这些问题, 请从课程中寻找答案。








-
