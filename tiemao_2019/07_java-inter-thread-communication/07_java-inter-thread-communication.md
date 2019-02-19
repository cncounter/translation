# How To Implement Inter-thread Communication In Java

# Java线程间通信的实现

Though normally each child thread just need to complete its own task, sometimes we may want multiple threads to work together to fulfil a task, which involves the inter-thread communication.

大部分情况下, 每个子线程都只需要执行自身的任务即可。 但在某些情况下, 可能需要多个线程一起来完成某个任务, 这时候可能会涉及到线程之间的通信(inter-thread communication)。

The methods and classes covered in this article are: `thread.join()`, `object.wait()`, `object.notify()`, `CountdownLatch`, `CyclicBarrier`, `FutureTask`, `Callable`, etc.

本文介绍的主要内容包括: `thread.join()`, `object.wait()`, `object.notify()`, `CountdownLatch`, `CyclicBarrier`, `FutureTask`, 以及 `Callable`。

[Here](https://github.com/wingjay/HelloJava/blob/master/multi-thread/src/ForArticle.java) is the code covered in this article

所有的代码可以参考: <https://github.com/wingjay/HelloJava/blob/master/multi-thread/src/ForArticle.java>

I'll use several examples to explain how to implement inter-thread communication in Java.

下文通过示例来讲解如何实现Java线程间的通信。

> - How to make two threads execute in sequence?
> - How to make two threads intersect orderly in a specified manner?
> - There are four threads: A, B, C, and D (D won't be executed until A, B and C all have finished executing, and A, B, and C are to be executed synchronously.).
> - Three athletes prepare themselves apart, and then they start to run at the same time after each of them is ready.
> - After the child thread completes a task, it returns the result to the main thread.

> - 如何让两个线程顺序执行?
> - 如何让两个线程交替执行?
> - 假设有四个线程: A,B,C,D, 如何实现ABC同步执行, 全部完成后才执行D线程。
> - 运动员短跑赛跑,怎样在所有人都准备好之后, 再按下发令枪, 让他们同时起跑。
> - 子线程完成任务之后, 如何将处理结果返回给主线程。

## How To Make Two Threads Execute In Sequence?

## 如何让两个线程顺序执行?



The implementation for `printNumber(String)` is as follows, which is used to print the three numbers of 1, 2 and 3 in sequence:

先看看基本方法 `printNumber(String)` 的实现, 用于按顺序打印出三个数字 1、2、3:

```java
private static void printNumber(String threadName) {
    int i=0;
    while (i++ < 3) {
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(threadName + "print:" + i);
    }
}
```

Suppose there are two threads: thread A and thread B. Both of the two threads can print three numbers (1-3) in sequence. Let's take a look at the code:

假设有两个线程: 线程A和线程B. 先来看看代码:

```java
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
    B.start();
    A.start();
}
```

每个线程都会执行按顺序打印3个数字的方法。


And the result we get is:

执行的结果为:

```bash
B print: 1
A print: 1
B print: 2
A print: 2
B print: 3
A print: 3
```



You can see that A and B print numbers at the same time.

可以看到,A和B会同时执行。

So, what if we want B to start printing after A has printed over? We can use the `thread.join()` method, and the code is as follows:

如果需求发生变化, 需要线程A打印完成之后，线程B才能执行打印。 那么我们可以使用 `thread.join()` 方法,代码如下:

```java
private static void demo2() {
    Thread A = new Thread(new Runnable() {
        @Override
        public void run() {
            printNumber("A");
        }
    });
    Thread B = new Thread(new Runnable() {
        @Override
        public void run() {
            System.out.println("B starts waiting for A");
            try {
                A.join(); // 等待线程A执行完成之后与当前线程“会师”
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            printNumber("B");
        }
    });
    B.start();
    A.start();
}
```



Now the result obtained is:

执行结果应该是这样:

```bash
B starts waiting for A
A print: 1
A print: 2
A print: 3
 
B print: 1
B print: 2
B print: 3
```



So we can see that the `A.join()` method will make B wait until A finishes printing.

可以看到， B线程之后调用了 `A.join()` 方法, 等待A先完成打印任务。

## How To Make Two Threads Intersect Orderly In a Specified Manner?

## 如何让两个线程相交以指定的方式有序?

So what if now we want B to start printing 1, 2, 3 just after A has printed 1, and then A continues printing 2, 3? Obviously, we need more fine-grained locks to take the control of the order of execution.

如果现在我们希望B开始印刷1,2,3就后打印1,然后继续打印2、3?显然,我们需要更多的细粒度锁的控制执行的顺序。

Here, we can take the advantage of the `object.wait()` and `object.notify()` methods. The code is as below:

在这里,我们可以采取的优势`object.wait()`和`object.notify()`方法。下面的代码是:

```java
/**
 * A 1, B 1, B 2, B 3, A 2, A 3
 */
private static void demo3() {
    Object lock = new Object();
    Thread A = new Thread(new Runnable() {
        @Override
        public void run() {
            synchronized (lock) {
                System.out.println("A 1");
                try {
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
    B.start();
}
```



The results are as follows:

结果如下:

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

这就是我们想要的。

> **What happens?**
>
> 1. First we create an object lock shared by A and B: `lock = new Object();`
> 2. When A gets the lock, it prints 1 first, and then it calls the `lock.wait()` method which will make it go into the wait state, and hands over control of the lock then;
> 3. B won't be executed until A calls the `lock.wait()` method to release control and B gets the lock;
> 4. B prints 1, 2, 3 after getting the lock, and then calls the `lock.notify()` method to wake up A which is waiting;
> 5. A continues printing the remaining 2, 3 after it wakes up.

> * *发生了什么? * *
>
> 1。首先我们创建一个对象锁由A和B共享:`lock = new Object();`> 2。当一个被锁,它打印1首先,然后调用`lock.wait()`方法将进入等待状态,然后手锁的控制权;
> 3。B不会执行,直到调用`lock.wait()`释放控制方法和B锁;
> 4。B打印1、2、3在得到锁,然后调用`lock.notify()`方法醒来,它是等待;
> 5。继续打印剩余的2、3后醒来。

I add the log to the above code to make it easier to understand.

我将记录添加到上面的代码,让它更容易理解。

```java
private static void demo3() {
    Object lock = new Object();
    Thread A = new Thread(new Runnable() {
        @Override
        public void run() {
            System.out.println("INFO: A is waiting for the lock");
            synchronized (lock) {
                System.out.println("INFO: A got the lock");
                System.out.println("A 1");
                try {
                    System.out.println("INFO: A is ready to enter the wait state, giving up control of the lock");
                    lock.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("INFO: B wakes up A, and A regains the lock");
                System.out.println("A 2");
                System.out.println("A 3");
            }
        }
    });
    Thread B = new Thread(new Runnable() {
        @Override
        public void run() {
            System.out.println("INFO: B is waiting for the lock");
            synchronized (lock) {
                System.out.println("INFO: B got the lock");
                System.out.println("B 1");
                System.out.println("B 2");
                System.out.println("B 3");
                System.out.println("INFO: B ends printing, and calling the notify method");
                lock.notify();
            }
        }
    });
    A.start();
    B.start();
```



The result is as follows:

结果如下:

```bash
INFO: A is waiting for the lock
INFO: A got the lock
A 1
INFO: A is ready to enter the wait state, giving up control of the lock
INFO: B is waiting for the lock
INFO: B got the lock
B 1
B 2
B 3
INFO: B ends printing, and calling the notify method
INFO: B wakes up A, and A regains the lock
A 2
A 3
```



## D Is Executed After A, B and C All Have Finished Executing Synchronously

## B和C D后执行,所有已完成执行同步

The method `thread.join()` introduced earlier allows one thread to continue executing after waiting for another thread to finish running. But if we join A, B, and C orderly into the D thread, it will make A, B, and C execute in turn, while we want them three to run synchronously.

该方法`thread.join()`介绍了早些时候允许一个线程继续等待另一个线程运行完成后执行.但是如果我们加入A、B和C有序进入D线程,它将使A,B,C依次执行,而我们希望他们三个同步运行。

The goal we want to achieve is: The three threads A, B, and C can start to run at the same time, and each will notify D after finishing running independently; D won't start to run until A, B, and C all finish running. So we use `CountdownLatch` to implement this type of communication. Its basic usage is:

我们想要达成的目标:三个线程A,B,C可以同时运行,每个独立完成运行后将通知D;D才开始运行,B和C都完成运行。所以我们使用`CountdownLatch`要实现这种类型的通信。其基本用法是:

1. Create a counter, and set an initial value, `CountdownLatch countDownLatch = new CountDownLatch(3;`
2. Call the `countDownLatch.await()` method in the waiting thread and go into the wait state until the count value becomes 0;
3. Call the `countDownLatch.countDown()` method in other threads, and the method will reduce the count value by one;
4. When the `countDown()` method in other threads turns the count value to 0, the `countDownLatch.await()` method in the waiting thread will exit immediately and continue to execute the following code.

1. 创建一个计数器,并设置一个初始值,`CountdownLatch countDownLatch = new CountDownLatch(3;`
2. 调用`countDownLatch.await()`方法在等待线程进入等待状态,直到数值变成0;
3. 调用`countDownLatch.countDown()`在其他线程的方法,该方法将计算值降低;
4. 当`countDown()`turns the method in other threads字段中,value count to 0`countDownLatch.await()`等待线程的方法将立即退出,继续执行下面的代码。

The implementation code is as follows:

实现代码如下:

```java
private static void runDAfterABC() {
    int worker = 3;
    CountDownLatch countDownLatch = new CountDownLatch(worker);
    new Thread(new Runnable() {
        @Override
        public void run() {
            System.out.println("D is waiting for other three threads");
            try {
                countDownLatch.await();
                System.out.println("All done, D starts working");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }).start();
    for (char threadName='A'; threadName <= 'C'; threadName++) {
        final String tN = String.valueOf(threadName);
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println(tN + "is working");
                try {
                    Thread.sleep(100);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                System.out.println(tN + "finished");
                countDownLatch.countDown();
            }
        }).start();
    }
}
```



The result is as follows:

结果如下:

```bash
D is waiting for other three threads
A is working
B is working
C is working
 
A finished
C finished
B finished
All done, D starts working
```



In fact, `CountDownLatch` itself is a countdown counter, and we set the initial count value to 3. When D runs, it first call the `countDownLatch.await()` method to check whether the counter value is 0, and it will stay in wait state if the value is not 0. A, B, and C each will use the `countDownLatch.countDown()`method to decrement the countdown counter by 1 after they finish running separately. And when all of them three finish running, the counter will be reduced to 0; then, the `await()` method of D will be triggered to end A, B, and C, and D will start to go on executing.

事实上,`CountDownLatch`本身就是一个倒计时计数器,我们最初的计算值设置为3。当D运行时,它首先调用`countDownLatch.await()`方法检查是否计数器值为0,它会停留在等待状态,如果值不是0。A、B和C使用`countDownLatch.countDown()`方法减量倒计时计数器1完成后单独运行。他们三个完成运行时,计数器将会减少到0;然后,`await()`D的方法将触发结束,B,C,D将开始执行。

Therefore, `CountDownLatch` is suitable for the situation where one thread needs to wait for multiple threads.

因此,`CountDownLatch`适用于一个线程的情况需要等待多个线程。

## 3 Runners Preparing To Run

## 3选手准备运行

Three runners prepare themselves apart, and then they start to run at the same time after each of them is ready.

三个运动员做好准备,然后他们开始同时运行后每个人都准备好了。

This time, each of the three threads A, B, and C need to prepare separately, and then they start to run simultaneously after all of them three are ready. How should we achieve that?

这一次,每个三个线程A,B,C需要准备分开,然后他们开始同时运行后他们三个都准备好了。我们应该如何实现?

The `CountDownLatch` above can be used to count down, but when the count is completed, only one of the threads' `await()` method will get a response, so multiple threads cannot be triggered at the same time.

的`CountDownLatch`上面可以用来倒计时,但当计算完成后,只有一个线程的`await()`方法将得到回复,所以多个线程不能同时被触发。

In order to achieve the effect of threads' waiting for each other, we can use the `CyclicBarrier` data structure, and its basic usage is:

为了达到效果的线程互相等待,我们可以使用`CyclicBarrier`数据结构,其基本用法是:

1. First create a public object `CyclicBarrier`, and set the number of threads waiting at the same time, `CyclicBarrier cyclicBarrier = new CyclicBarrier(3);`
2. These threads start to prepare simultaneously. After they are ready, they need to wait for others to finish preparing, so call the `cyclicBarrier.await()` method to wait for others;
3. When the specified threads that need to wait at the same time all call the `cyclicBarrier.await()` method, which means that these threads are ready, then these threads will start to continue executing simultaneously.

1. 首先创建一个公共对象`CyclicBarrier`,并设置数量的线程等待的同时,`CyclicBarrier cyclicBarrier = new CyclicBarrier(3);`
2. 这些线程同时开始准备。准备好之后,他们需要等待别人完成准备,所以调用`cyclicBarrier.await()`方法等;
3. 当指定的线程需要同时等待调用`cyclicBarrier.await()`方法,这意味着这些线程都准备好了,那么这些线程将同时开始继续执行。

The implementation code is as follows. Imagine that there are three runners who need to start to run simultaneously, so they need to wait for others until all of them are ready.

实现代码如下。假设有三个跑步者需要开始同时运行,所以他们需要等待其他人直到他们所有的人都准备好了。

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
                System.out.println(rN + "is preparing for time:" + prepareTime);
                try {
                    Thread.sleep(prepareTime);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                try {
                    System.out.println(rN + "is prepared, waiting for others");
                    cyclicBarrier.await(); // The current runner is ready, waiting for others to be ready
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
                System.out.println(rN + "starts running"); // All the runners are ready to start running together
            }
        }).start();
    }
}
```



The result is as follows:

结果如下:

```bash
A is preparing for time: 4131
B is preparing for time: 6349
C is preparing for time: 8206
 
A is prepared, waiting for others
 
B is prepared, waiting for others
 
C is prepared, waiting for others
 
C starts running
A starts running
B starts running
```



## Child Thread Returns The Result To The Main Thread

## 子线程返回结果给主线程

In actual development, often we need to create child threads to do some time-consuming tasks, and then pass the execution results back to the main thread. So how to implement this in Java?

在实际的开发中,我们经常需要创建子线程来做一些耗时的任务,然后通过执行结果返回给主线程。那么如何在Java实现这个?

So generally, when creating the thread, we'll pass the Runnable object to Thread for execution. The definition for Runnable is as follows:

所以一般情况下,在创建线程时,我们会将Runnable对象传递给线程来执行。可运行的定义如下:

```java
public interface Runnable {
    public abstract void run();
}
```



You can see that `run()` method does not return any results after execution. Then what if you want to return the results? Here you can use another similar interface class `Callable`:

你可以看到,`run()`方法执行后不返回任何结果。那么如果你想返回结果?在这里你可以使用另一个类似的接口类`Callable`:

```java
@FunctionalInterface
public interface Callable<V> {
    /**
     * Computes a result, or throws an exception if unable to do so.
     *
     * @return computed result
     * @throws Exception if unable to compute a result
     */
    V call() throws Exception;
}
```



It can be seen that the biggest difference for `Callable` is that it returns the generics.

可以看出,最大的区别`Callable`是,它返回泛型。

So the next question is, how to pass the results of the child thread back? Java has a class, `FutureTask`, which can work with `Callable`, but note that the `get` method which is used to get the result will block the main thread.

所以接下来的问题是,如何通过子线程返回的结果吗?Java有一个类,`FutureTask`,可以使用`Callable`,但请注意,`get`方法用于获取结果将阻塞主线程。

For example, we want the child thread to calculate the sum from 1 to 100 and return the result to the main thread.

例如,我们想要的子线程来计算金额从1到100并将结果返回给主线程。

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

可以看出它阻塞主线程,主线程调用`futureTask.get()`方法;然后`Callable`开始执行内部操作并返回结果;然后是`futureTask.get()`得到的结果和主要线程继续运行。

Here we can learn that the `FutureTask` and `Callable` can get the result of the child thread directly in the main thread, but they will block the main thread. Of course, if you don't want to block the main thread, you can consider using `ExecutorService` to put the `FutureTask` into the thread pool to manage execution.

在这里我们可以了解到`FutureTask`和`Callable`可以得到子线程的结果直接在主线程中,但他们会阻塞主线程。当然,如果你不想阻塞主线程,您可以考虑使用`ExecutorService`把`FutureTask`线程池管理执行。

## Summary

## 总结

Multithreading is a common feature for modern languages, and inter-thread communication, thread synchronization, and thread safety are very important topics.

多线程是现代语言的共同特征,以及线程间通信都必须与现实当中线程同步,线程安全是非常重要的话题。

<https://www.tutorialdocs.com/article/java-inter-thread-communication.html>



