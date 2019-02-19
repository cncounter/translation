# How To Implement Inter-thread Communication In Java

Though normally each child thread just need to complete its own task, sometimes we may want multiple threads to work together to fulfil a task, which involves the inter-thread communication.

The methods and classes covered in this article are: `thread.join()`, `object.wait()`, `object.notify()`, `CountdownLatch`, `CyclicBarrier`, `FutureTask`, `Callable`, etc.

[Here](https://github.com/wingjay/HelloJava/blob/master/multi-thread/src/ForArticle.java) is the code covered in this article

I'll use several examples to explain how to implement inter-thread communication in Java.

> - How to make two threads execute in sequence?
> - How to make two threads intersect orderly in a specified manner?
> - There are four threads: A, B, C, and D (D won't be executed until A, B and C all have finished executing, and A, B, and C are to be executed synchronously.).
> - Three athletes prepare themselves apart, and then they start to run at the same time after each of them is ready.
> - After the child thread completes a task, it returns the result to the main thread.

## How To Make Two Threads Execute In Sequence?

Suppose there are two threads: thread A and thread B. Both of the two threads can print three numbers (1-3) in sequence. Let's take a look at the code:

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
    A.start();
    B.start();
}
```

The implementation for `printNumber(String)` is as follows, which is used to print the three numbers of 1, 2 and 3 in sequence:

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

And the result we get is:

```bash
B print: 1
A print: 1
B print: 2
A print: 2
B print: 3
A print: 3
```

You can see that A and B print numbers at the same time.

So, what if we want B to start printing after A has printed over? We can use the `thread.join()` method, and the code is as follows:

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
                A.join();
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

## How To Make Two Threads Intersect Orderly In a Specified Manner?

So what if now we want B to start printing 1, 2, 3 just after A has printed 1, and then A continues printing 2, 3? Obviously, we need more fine-grained locks to take the control of the order of execution.

Here, we can take the advantage of the `object.wait()` and `object.notify()` methods. The code is as below:

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

> **What happens?**
>
> 1. First we create an object lock shared by A and B: `lock = new Object();`
> 2. When A gets the lock, it prints 1 first, and then it calls the `lock.wait()` method which will make it go into the wait state, and hands over control of the lock then;
> 3. B won't be executed until A calls the `lock.wait()` method to release control and B gets the lock;
> 4. B prints 1, 2, 3 after getting the lock, and then calls the `lock.notify()` method to wake up A which is waiting;
> 5. A continues printing the remaining 2, 3 after it wakes up.

I add the log to the above code to make it easier to understand.

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

The method `thread.join()` introduced earlier allows one thread to continue executing after waiting for another thread to finish running. But if we join A, B, and C orderly into the D thread, it will make A, B, and C execute in turn, while we want them three to run synchronously.

The goal we want to achieve is: The three threads A, B, and C can start to run at the same time, and each will notify D after finishing running independently; D won't start to run until A, B, and C all finish running. So we use `CountdownLatch` to implement this type of communication. Its basic usage is:

1. Create a counter, and set an initial value, `CountdownLatch countDownLatch = new CountDownLatch(3;`
2. Call the `countDownLatch.await()` method in the waiting thread and go into the wait state until the count value becomes 0;
3. Call the `countDownLatch.countDown()` method in other threads, and the method will reduce the count value by one;
4. When the `countDown()` method in other threads turns the count value to 0, the `countDownLatch.await()` method in the waiting thread will exit immediately and continue to execute the following code.

The implementation code is as follows:

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

Therefore, `CountDownLatch` is suitable for the situation where one thread needs to wait for multiple threads.

## 3 Runners Preparing To Run

Three runners prepare themselves apart, and then they start to run at the same time after each of them is ready.

This time, each of the three threads A, B, and C need to prepare separately, and then they start to run simultaneously after all of them three are ready. How should we achieve that?

The `CountDownLatch` above can be used to count down, but when the count is completed, only one of the threads' `await()` method will get a response, so multiple threads cannot be triggered at the same time.

In order to achieve the effect of threads' waiting for each other, we can use the `CyclicBarrier` data structure, and its basic usage is:

1. First create a public object `CyclicBarrier`, and set the number of threads waiting at the same time, `CyclicBarrier cyclicBarrier = new CyclicBarrier(3);`
2. These threads start to prepare simultaneously. After they are ready, they need to wait for others to finish preparing, so call the `cyclicBarrier.await()` method to wait for others;
3. When the specified threads that need to wait at the same time all call the `cyclicBarrier.await()` method, which means that these threads are ready, then these threads will start to continue executing simultaneously.

The implementation code is as follows. Imagine that there are three runners who need to start to run simultaneously, so they need to wait for others until all of them are ready.

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

In actual development, often we need to create child threads to do some time-consuming tasks, and then pass the execution results back to the main thread. So how to implement this in Java?

So generally, when creating the thread, we'll pass the Runnable object to Thread for execution. The definition for Runnable is as follows:

```java
public interface Runnable {
    public abstract void run();
}
```

You can see that `run()` method does not return any results after execution. Then what if you want to return the results? Here you can use another similar interface class `Callable`:

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

So the next question is, how to pass the results of the child thread back? Java has a class, `FutureTask`, which can work with `Callable`, but note that the `get` method which is used to get the result will block the main thread.

For example, we want the child thread to calculate the sum from 1 to 100 and return the result to the main thread.

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

```bash
Before futureTask.get()
 
Task starts
Task finished and return result
 
Result: 5050
After futureTask.get()
```

It can be seen that it blocks the main thread when the main thread calls the `futureTask.get()` method; then the `Callable` starts to execute internally and returns the result of the operation; and then the `futureTask.get()` gets the result and the main thread resumes running.

Here we can learn that the `FutureTask` and `Callable` can get the result of the child thread directly in the main thread, but they will block the main thread. Of course, if you don't want to block the main thread, you can consider using `ExecutorService` to put the `FutureTask` into the thread pool to manage execution.

## Summary

Multithreading is a common feature for modern languages, and inter-thread communication, thread synchronization, and thread safety are very important topics.

<https://www.tutorialdocs.com/article/java-inter-thread-communication.html>
