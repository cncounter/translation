# How To Implement Inter-thread Communication In Java

# Java进阶知识 - 线程间通信

> `CountdownLatch`, `CyclicBarrier` 分别适合什么场景呢?

Though normally each child thread just need to complete its own task, sometimes we may want multiple threads to work together to fulfil a task, which involves the inter-thread communication.

大部分情况下, 子线程只需要关心自身执行的任务. 但在某些复杂的情况下, 需要使用多个线程来协同完成某个任务, 这就涉及到线程间通信(inter-thread communication)的问题了. 

The methods and classes covered in this article are: `thread.join()`, `object.wait()`, `object.notify()`, `CountdownLatch`, `CyclicBarrier`, `FutureTask`, `Callable`, etc.

主要涉及的内容有:

- `thread.join()` 方法
- `object.wait()` 方法
- `object.notify()` 方法
- `CountdownLatch` 类
- `CyclicBarrier` 类
- `FutureTask` 类
- `Callable` 类

[Here](https://github.com/wingjay/HelloJava/blob/master/multi-thread/src/ForArticle.java) is the code covered in this article

示例代码可参考: <https://github.com/wingjay/HelloJava/blob/master/multi-thread/src/ForArticle.java>

I'll use several examples to explain how to implement inter-thread communication in Java.

本文通过示例, 讲解Java语言中, 如何实现线程间通信. 

> - How to make two threads execute in sequence?
> - How to make two threads intersect orderly in a specified manner?
> - There are four threads: A, B, C, and D (D won't be executed until A, B and C all have finished executing, and A, B, and C are to be executed synchronously.).
> - Three athletes prepare themselves apart, and then they start to run at the same time after each of them is ready.
> - After the child thread completes a task, it returns the result to the main thread.

> - 如何让两个线程顺序执行
> - 怎样让两个线程交替执行
> - 假设有四个线程: A,B,C,D, 如何实现ABC一起执行, 全部完成后再执行D线程. 
> - 短跑比赛, 在所有人都准备完成后, 让运动员们同时起跑. 
> - 子线程执行完成后, 怎么将结果值返回给主线程. 

## How To Make Two Threads Execute In Sequence?

## 如何让两个线程顺序执行



The implementation for `printNumber(String)` is as follows, which is used to print the three numbers of 1, 2 and 3 in sequence:

先看看基础方法 `printNumber(String)` 的实现, 该方法按顺序打印三个数字 1、2、3:

```java
private static void printNumber(String threadName) {
    int i=0;
    while (i++ < 3) {
        try {
            Thread.sleep(100); // 注意这里加入了延迟时间
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(threadName + "print:" + i);
    }
}
```

Suppose there are two threads: thread A and thread B. Both of the two threads can print three numbers (1-3) in sequence. Let's take a look at the code:

假设有两个线程: 线程A和线程B. 代码如下:

```java
/**
 * A、B线程启动顺序是随机的, 可多次执行来验证
 */
private static void demo1() {
    Thread A = new Thread(new Runnable() {
        @Override
        public void run() {
            printNumber("A");
        }
    });
    Thread B = new Thread(new Runnable() {
        @Override
        public void run() {
            printNumber("B");
        }
    });

    A.start();
    B.start();
}
```

每个线程都会调用 `printNumber()` 方法. 


And the result we get is:

AB的执行顺序随机, 结果可能是这样:

```bash
B print: 1
A print: 1
B print: 2
A print: 2
A print: 3
B print: 3
```



You can see that A and B print numbers at the same time.

可以看到, A和B会一起执行. 

So, what if we want B to start printing after A has printed over? We can use the `thread.join()` method, and the code is as follows:

假设需求发生变化, 线程A打印完成之后, 线程B才能执行打印. 那么可以使用 `thread.join()` 方法,代码如下:

```java
/**
 * 打印顺序: A 1, A 2, A 3, B 1, B 2, B 3
 */
private static void demo2() {
    final Thread A = new Thread(new Runnable() {
        @Override
        public void run() {
            printNumber("A");
        }
    });

    Thread B = new Thread(new Runnable() {
        @Override
        public void run() {
            System.out.println("B线程需要等待A线程执行完成");
            try {
                A.join(); // 等待线程A执行完成之后与当前线程“汇合”
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            printNumber("B");
        }
    });

    A.start();
    B.start();
}
```

> join, 加入, 合并, 汇合


Now the result obtained is:

执行结果为:

```bash
B线程需要等待A线程执行完成
A print: 1
A print: 2
A print: 3
B print: 1
B print: 2
B print: 3
```



So we can see that the `A.join()` method will make B wait until A finishes printing.

可以看到, B线程执行的方法里面, 调用了 `A.join()` 方法, 会等待A线程先执行完成, B再继续往下走. 


## How To Make Two Threads Intersect Orderly In a Specified Manner?

## 怎样让两个线程交替执行以指定的顺序交替执行

So what if now we want B to start printing 1, 2, 3 just after A has printed 1, and then A continues printing 2, 3? Obviously, we need more fine-grained locks to take the control of the order of execution.

假设需要先让A打印1、然后B打印1,2,3, 再让A打印2、3. 那么, 可以使用细粒度的锁(fine-grained locks)来控制执行顺序. 

Here, we can take the advantage of the `object.wait()` and `object.notify()` methods. The code is as below:

比如使用Java内置的 `object.wait()` 和 `object.notify()` 方法. 代码如下:

```java
/**
 * 打印顺序: A 1, B 1, B 2, B 3, A 2, A 3
 */
private static void demo3() {
    final Object lock = new Object();
    Thread A = new Thread(new Runnable() {
        @Override
        public void run() {
            synchronized (lock) {
                System.out.println("A 1");
                try {
        System.out.println("A waiting…");
                    lock.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("A 2");
                System.out.println("A 3");
            }
        }
    });
    Thread B = new Thread(new Runnable() {
        @Override
        public void run() {
            synchronized (lock) {
                System.out.println("B 1");
                System.out.println("B 2");
                System.out.println("B 3");
                lock.notify();
            }
        }
    });
    A.start();
    //
    try {
        TimeUnit.MILLISECONDS.sleep(50L);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    B.start();
}
```



The results are as follows:

执行结果如下:

```bash
A 1
A waiting…
 
B 1
B 2
B 3
A 2
A 3
```



That's what we want.

这就实现了需要的效果. 

> **What happens?**
>
> 1. First we create an object lock shared by A and B: `lock = new Object();`
> 2. When A gets the lock, it prints 1 first, and then it calls the `lock.wait()` method which will make it go into the wait state, and hands over control of the lock then;
> 3. B won't be executed until A calls the `lock.wait()` method to release control and B gets the lock;
> 4. B prints 1, 2, 3 after getting the lock, and then calls the `lock.notify()` method to wake up A which is waiting;
> 5. A continues printing the remaining 2, 3 after it wakes up.

> **主流程说明**
>
> 1. 首先创建一个对象锁: `lock = new Object();`
> 2. A获取锁, 得到后先打印1, 然后调用 `lock.wait()` 进入等待状态, 同时移交锁的控制权;
> 3. B暂时不会执行打印, 需要等A调用`lock.wait()`释放锁之后, B 获得锁才开始执行打印;
> 4. B打印出1、2、3, 然后调用`lock.notify()`方法来唤醒等待这个锁的线程(A);
> 5. A被唤醒之后, 等待获得锁, 之后继续打印剩下的2和3. 

I add the log to the above code to make it easier to understand.

下面加上一些日志, 来帮助我们理解这段代码. 


```java
    /**
 * demo3的基础上-加日志
 * 打印顺序: A 1, B 1, B 2, B 3, A 2, A 3
 */
private static void demo4() {
    final Object lock = new Object();

    Thread A = new Thread(new Runnable() {
        @Override
        public void run() {
            System.out.println("====提示: A 等待锁...");
            synchronized (lock) {
                System.out.println("====提示: A 得到了锁 lock");
                System.out.println("A 1");
                try {
                    System.out.println("====提示: A 调用lock.wait()放弃锁的控制权,并等待...");
                    lock.wait();
                    System.out.println("====提示: A在lock.wait()之后,再次获得锁的控制权,HAHAHA");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("====提示: A线程被唤醒, A 重新获得锁 lock");
                System.out.println("A 2");
                System.out.println("A 3");
            }

        }
    });

    Thread B = new Thread(new Runnable() {
        @Override
        public void run() {
            System.out.println("====提示: B 等待锁...");
            synchronized (lock) {
                System.out.println("====提示: B 得到了锁 lock");
                System.out.println("B 1");
                System.out.println("B 2");
                System.out.println("B 3");

                System.out.println("====提示: B 打印完毕, 调用 lock.notify() 方法");
                lock.notify();
                // 看看A能不能获得锁
                try {
                    System.out.println("====提示: B 调用 lock.notify()完成,睡10秒看看...");
                    TimeUnit.SECONDS.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("====提示: B 调用 lock.notify()完成,退出synchronized块");
            }
        }
    });

    A.start();
    //
    try {
        TimeUnit.MILLISECONDS.sleep(50L);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    //
    B.start();
}
```



The results are as follows:

在其中, 我们加入了一些调皮的逻辑, 执行结果如下:

```bash
====提示: A 等待锁...
====提示: A 得到了锁 lock
A 1
====提示: A 调用lock.wait()放弃锁的控制权,并等待...
====提示: B 等待锁...
====提示: B 得到了锁 lock
B 1
B 2
B 3
====提示: B 打印完毕, 调用 lock.notify() 方法
====提示: B 调用 lock.notify()完成,睡10秒看看...
====提示: B 调用 lock.notify()完成,退出synchronized块
====提示: A在lock.wait()之后,再次获得锁的控制权,HAHAHA
====提示: A线程被唤醒, A 重新获得锁 lock
A 2
A 3
```

> 可以看到, 虽然B调用了 `lock.notify()`方法唤醒了某个等待的线程(A), 但因为同步代码块还未执行完, 所以没有释放这个锁; 直到睡了10秒钟, 继续执行后面的代码, 退出同步代码块之后, A 才获得执行机会. 

- synchronized代码块结束, 会自动释放锁. 
- `Object#wait()` 则是临时放弃锁, 进入沉睡, 必须有人唤醒(notify), 否则会睡死, 或者被超时打断. 
- `Object#notify()` 只是唤醒某个线程, 并没有释放锁. 




## D Is Executed After A, B and C All Have Finished Executing Synchronously

## ABC全部执行完成后再执行D

The method `thread.join()` introduced earlier allows one thread to continue executing after waiting for another thread to finish running. But if we join A, B, and C orderly into the D thread, it will make A, B, and C execute in turn, while we want them three to run synchronously.

前面介绍的 `thread.join()` 方法, 等待另一个线程(thread)运行完成后, 当前线程才执行(: 等TA忙完了来汇合). 但如果我们使用 join 方法来等待A、B和C的话, 它将使A,B,C依次执行, 但我们希望的是他们仨同步运行. 

The goal we want to achieve is: The three threads A, B, and C can start to run at the same time, and each will notify D after finishing running independently; D won't start to run until A, B, and C all finish running. So we use `CountdownLatch` to implement this type of communication. Its basic usage is:

想要达成的目标是: A,B,C 三个线程同时运行, 每个线程完成后, 通知D一声; 等A,B,C都运行完成, D才开始运行. 我们可以使用`CountdownLatch` 来实现这种类型的通信. 其基本用法为:

1. Create a counter, and set an initial value, `CountdownLatch countDownLatch = new CountDownLatch(3;`
2. Call the `countDownLatch.await()` method in the waiting thread and go into the wait state until the count value becomes 0;
3. Call the `countDownLatch.countDown()` method in other threads, and the method will reduce the count value by one;
4. When the `countDown()` method in other threads turns the count value to 0, the `countDownLatch.await()` method in the waiting thread will exit immediately and continue to execute the following code.

1. 创建一个计数器(counter), 并设置初始值: `CountdownLatch countDownLatch = new CountDownLatch(3);`
2. 需要等待的线程, 调用 `countDownLatch.await()` 方法进入等待状态, 直到 count 值变成0为止;
3. 其他线程调用 `countDownLatch.countDown()` 来将 count 值减小;
4. 当其他线程调用 `countDown()` 将 count 值减小为到0, 等待线程中的 `countDownLatch.await()` 方法将立即返回, 那么这个线程也就可以继续执行后续的代码. 

The implementation code is as follows:

实现代码如下:

```java
private static void runDAfterABC() {
    int worker = 3;
    final CountDownLatch countDownLatch = new CountDownLatch(worker);
    Thread D = new Thread(new Runnable() {
        @Override
        public void run() {
            System.out.println("D 线程即将调用 countDownLatch.await(); 等待其他线程通知. ");
            try {
                countDownLatch.await();
                System.out.println("其他线程全部执行完成, D 开始干活...");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    });
    D.start();
    //
    for (char threadName='A'; threadName <= 'C'; threadName++) {
        final String tN = String.valueOf(threadName);
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println(tN + " 线程正在执行...");
                try {
                    Thread.sleep(100);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                System.out.println(tN + " 线程执行完毕, 调用 countDownLatch.countDown()");
                countDownLatch.countDown();
            }
        }).start();
    }
}
```



The result is as follows:

结果如下:

```bash
D 线程即将调用 countDownLatch.await(); 等待其他线程通知. 
A 线程正在执行...
B 线程正在执行...
C 线程正在执行...
B 线程执行完毕, 调用 countDownLatch.countDown()
C 线程执行完毕, 调用 countDownLatch.countDown()
A 线程执行完毕, 调用 countDownLatch.countDown()
其他线程全部执行完成, D 开始干活...
```



In fact, `CountDownLatch` itself is a countdown counter, and we set the initial count value to 3. When D runs, it first call the `countDownLatch.await()` method to check whether the counter value is 0, and it will stay in wait state if the value is not 0. A, B, and C each will use the `countDownLatch.countDown()`method to decrement the countdown counter by 1 after they finish running separately. And when all of them three finish running, the counter will be reduced to 0; then, the `await()` method of D will be triggered to end A, B, and C, and D will start to go on executing.

事实上, `CountDownLatch` 本身是一个倒计数计数器, 我们将初始值设置为3. 当D运行时, 首先调用 `countDownLatch.await()` 方法检查 counter 值是否为0, 如果counter值不是则会等待. A、B和C线程在自身运行完成后, 通过 `countDownLatch.countDown()` 方法将 counter 值减1. 当3个线程都执行完, A, B, C将 counter 值将会减小到0; 然后,D线程中的 `await()` 方法就会返回, D线程将继续执行. 

Therefore, `CountDownLatch` is suitable for the situation where one thread needs to wait for multiple threads.

因此, `CountDownLatch` 适用于一个线程等待多个线程的场景. 

## 3 Runners Preparing To Run

## 运动员同时起跑的问题

Three runners prepare themselves apart, and then they start to run at the same time after each of them is ready.

假设3个运动员都确定做好预备, 然后同时起跑. 

This time, each of the three threads A, B, and C need to prepare separately, and then they start to run simultaneously after all of them three are ready. How should we achieve that?

用3个线程来模拟, A,B,C线程各自准备, 等全部准备就绪, 同时开始运行. 如何用代码来实现呢?

The `CountDownLatch` above can be used to count down, but when the count is completed, only one of the threads' `await()` method will get a response, so multiple threads cannot be triggered at the same time.

前面介绍的`CountDownLatch`可以用来计数, 但计数完成后, 只会有一个线程的 `await()` 方法得到响应, 所以不太适合多个线程同时等待的情况. 

In order to achieve the effect of threads' waiting for each other, we can use the `CyclicBarrier` data structure, and its basic usage is:

要达到线程互相等待的效果, 可以使用 `CyclicBarrier`, 其基本用法为:

1. First create a public object `CyclicBarrier`, and set the number of threads waiting at the same time, `CyclicBarrier cyclicBarrier = new CyclicBarrier(3);`
2. These threads start to prepare simultaneously. After they are ready, they need to wait for others to finish preparing, so call the `cyclicBarrier.await()` method to wait for others;
3. When the specified threads that need to wait at the same time all call the `cyclicBarrier.await()` method, which means that these threads are ready, then these threads will start to continue executing simultaneously.

1. 首先创建一个公开的 `CyclicBarrier` 对象, 并设置同时等待的线程数量, `CyclicBarrier cyclicBarrier = new CyclicBarrier(3);`
2. 这些线程各自进行准备, 自身准备好之后, 还需要等其他线程准备完毕, 即调用 `cyclicBarrier.await()` 方法来等待;
3. 当需要同时等待的线程全部调用了 `cyclicBarrier.await()` 方法, 也就意味着这些线程都准备好了, 那么这些线程就可以继续执行. 

> 注意是 `Cyclic`, 不是 *Cycle*.

The implementation code is as follows. Imagine that there are three runners who need to start to run simultaneously, so they need to wait for others until all of them are ready.

实现代码如下. 假设有三个运动员同时开始赛跑, 每个人都需要等其他人准备就绪. 

```java
private static void runABCWhenAllReady() {
    int runner = 3;
    CyclicBarrier cyclicBarrier = new CyclicBarrier(runner);
    final Random random = new Random();
    for (char runnerName='A'; runnerName <= 'C'; runnerName++) {
        final String rN = String.valueOf(runnerName);
        new Thread(new Runnable() {
            @Override
            public void run() {
                long prepareTime = random.nextInt(10000) + 100;
                System.out.println(rN + " 需要的准备时间:" + prepareTime);
                try {
                    Thread.sleep(prepareTime);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                try {
                    System.out.println(rN + " 准备完毕, 等其他人... ");
                    cyclicBarrier.await(); // 当前线程准备就绪, 等待其他人的反馈
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
                System.out.println(rN + " 开始跑动~加速~"); // 所有线程一起开始
            }
        }).start();
    }
}
```



The result is as follows:

结果如下:

```bash
A 需要的准备时间: 4131
B 需要的准备时间: 6349
C 需要的准备时间: 8206
 
A  准备完毕, 等其他人... 
B  准备完毕, 等其他人... 
C  准备完毕, 等其他人... 
 
C 开始跑动~加速~
A 开始跑动~加速~
B 开始跑动~加速~
```



## Child Thread Returns The Result To The Main Thread

## 将子线程的执行结果返回给主线程

> 当然, 也有简单的办法, 比如使用 `ConcurrentHashMap`

In actual development, often we need to create child threads to do some time-consuming tasks, and then pass the execution results back to the main thread. So how to implement this in Java?

在实际开发中, 经常需要使用新线程来执行一些耗时任务, 然后将执行结果返回给主线程.

So generally, when creating the thread, we'll pass the Runnable object to Thread for execution. The definition for Runnable is as follows:

一般情况下, 创建新线程时, 我们会将Runnable对象传给线程来执行. Runnable接口的定义如下:

```java
public interface Runnable {
    public abstract void run();
}
```



You can see that `run()` method does not return any results after execution. Then what if you want to return the results? Here you can use another similar interface class `Callable`:

`run()` 方法不返回任何结果. 那么如果想要获取返回结果时怎么办呢?  我们可以使用一个类似的接口: `Callable`:

```java
@FunctionalInterface
public interface Callable<V> {
    /**
     * 返回执行结果, 如果出错则可以抛出异常.
     *
     * @return 执行结果(computed result)
     * @throws Exception, 如果不能计算出结果
     */
    V call() throws Exception;
}
```



It can be seen that the biggest difference for `Callable` is that it returns the generics.

可以看出, `Callable` 最大的区别在于返回泛型结果(generics, `<V>`). 

So the next question is, how to pass the results of the child thread back? Java has a class, `FutureTask`, which can work with `Callable`, but note that the `get` method which is used to get the result will block the main thread.

下面演示如何将子线程返回的结果传给主线程. Java提供了 `FutureTask` 类, 一般和 `Callable` 一起使用, 但请注意, `FutureTask#get()` 方法会阻塞调用的线程. 

For example, we want the child thread to calculate the sum from 1 to 100 and return the result to the main thread.

例如, 开新线程来计算金额(从1到100), 并将结果返回给主线程. 

```java
private static void doTaskWithResultInWorker() {
    Callable<Integer> callable = new Callable<Integer>() {
        @Override
        public Integer call() throws Exception {
            System.out.println("Task starts");
            Thread.sleep(1000);
            int result = 0;
            for (int i=0; i<=100; i++) {
                result += i;
            }
            System.out.println("Task finished and return result");
            return result;
        }
    };
    FutureTask<Integer> futureTask = new FutureTask<>(callable);
    new Thread(futureTask).start();
    try {
        System.out.println("Before futureTask.get()");
        System.out.println("Result:" + futureTask.get());
        System.out.println("After futureTask.get()");
    } catch (InterruptedException e) {
        e.printStackTrace();
    } catch (ExecutionException e) {
        e.printStackTrace();
    }
}
```



The result is as follows:

结果如下:

```bash
Before futureTask.get()
 
Task starts
Task finished and return result
 
Result: 5050
After futureTask.get()
```



It can be seen that it blocks the main thread when the main thread calls the `futureTask.get()` method; then the `Callable` starts to execute internally and returns the result of the operation; and then the `futureTask.get()` gets the result and the main thread resumes running.

可以看到, 主线程调用 `futureTask.get()` 方法时被阻塞; 然后开始执行 `Callable` 内部的任务并返回结果; 接着 `futureTask.get()` 获取结果, 主线程才继续运行.

Here we can learn that the `FutureTask` and `Callable` can get the result of the child thread directly in the main thread, but they will block the main thread. Of course, if you don't want to block the main thread, you can consider using `ExecutorService` to put the `FutureTask` into the thread pool to manage execution.

使用 `FutureTask` 和 `Callable`, 可以直接在主线程得到子线程的执行结果, 但这会阻塞主线程. 如果不想阻塞主线程, 可以将 `FutureTask` 交给线程池来执行(使用`ExecutorService`). 

## Summary

## 总结

Multithreading is a common feature for modern languages, and inter-thread communication, thread synchronization, and thread safety are very important topics.

多线程(Multithreading)是现代编程语言都具有的共同特征. 其中, 线程间通信(inter-thread communication), 线程同步(thread synchronization), 线程安全(thread safety) 都是非常重要的知识. 

原文链接: <https://www.tutorialdocs.com/article/java-inter-thread-communication.html>

原文日期: 2019年01月22日

翻译日期: 2019年03月12日

翻译人员: 铁锚 - <https://renfufei.blog.csdn.net/>

