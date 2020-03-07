# Quiz Yourself: Threads and `Executors` (Advanced)

＃ Java坑人面试题系列: 线程/线程池（高级难度）

> The details of relying on specific operations from `ExecutorService`


If you have worked on our quiz questions in the past, you know none of them is easy. They model the difficult questions from certification examinations. The levels marked “intermediate” and “advanced” refer to the exams, rather than the questions. Although in almost all cases, “advanced” questions will be harder. We write questions for the certification exams, and we intend that the same rules apply: Take words at their face value and trust that the questions are not intended to deceive you, but straightforwardly test your knowledge of the ins and outs of the language.


>  `ExecutorService` 及相关API的细节面试题。


Java Magazine上面有一个专门坑人的面试题系列: <https://blogs.oracle.com/javamagazine/quiz-2>。

这些问题的设计宗旨，主要是测试面试者对Java语言的了解程度，而不是为了用弯弯绕绕的手段把面试者搞蒙。

如果你看过往期的问题，就会发现每一个都不简单。

这些试题模拟了认证考试中的一些难题。 而 “中级(intermediate)” 和 “高级(advanced)” 指的是试题难度，而不是说这些知识本身很深。 一般来说，“高级”问题会稍微难一点。



### Question (advanced).


The objective is to create worker threads using `Runnable` and `Callable` and to use an `ExecutorService` to concurrently execute tasks. Given the following class:


### 问题（高级难度）

问题的目标是考察通过 `Runnable` 和 `Callable` 创建工作线程的任务，并使用 `ExecutorService` 来并发执行任务。

有一个 `Logger` 类，定义如下所示：


```
class Logger implements Runnable {
    String msg;
    public Logger(String msg) {
        this.msg = msg;
    }
    public void run() {
        System.out.print(msg);
    }
}
```


And given this code fragment:

下面是对应的使用方式:

```
Stream<Logger> s = Stream.of(
    new Logger("Error "),
    new Logger("Warning "),
    new Logger("Debug "));
ExecutorService es =
    Executors.newCachedThreadPool();
s.sequential().forEach(l -> es.execute(l));         
es.shutdown();
es.awaitTermination(10, TimeUnit.SECONDS);
```

Assuming all `import` statements (not shown) are properly configured and the code compiles, which are possible outputs? Choose two.

这里省略了相关的 `import` 语句, 假设代码能编译通过并启动运行。 请选择两项可能的输出：

- A、 Error Debug Warning
- B、 Error Warning Debug
- C、 Error Error Debug
- D、 Error Debug

### Answer.

### 答案和解析

The exam objectives include topics related to the `Executors` class and the `ExecutorService` interface, along with thread pools that implement the `ExecutorService` interface offered by the `Executors` class.

In the first versions of Java, the programmer had the responsibility for creating and managing threads, and because threads are expensive to create and they are limited, kernel-level resources, it was common to create a “thread pool” so a few threads could be used to process a large number of small, independent jobs. The idea of a thread pool is that instead of creating a thread for every little background job and then destroying the threads after each job is completed, a smaller number of threads are created and configured so that packages of work (for example, `Runnable` objects) can be passed to these threads. The first thread that has no work to do takes the job and runs it, and when the job is complete, that thread goes back to look for another job.

这道试题属于 `Executors` 类和 `ExecutorService` 接口相关的考点，顺带考察了 `Executors` 工具类自带的`ExecutorService`线程池实现。

在Java的早期版本中，需要手工创建和管理线程。
线程是系统内核级的重要资源，不能无限创建; 而且创建线程的开销也很大，所以我们开发中一般会使用资源池的模式，也就是创建 “线程池”。
通过线程池，就可以用少量的线程，来执行大量的任务。
线程池的思路是这样的： 与其为每个后台任务创建一个线程，执行完少量的任务后就销毁； 不如统一创建少量的线程， 将任务代码用 `Runnable` 包装起来， 提交给线程池来调度执行。
调度的时候，找到空闲的线程，然后让他干活。 任务执行完成后，将对应的线程放到线程池里面，等待下一次调度。

Thread pools became part of Java’s APIs in Java 5. The `Executor` and `ExecutorService` interfaces are provided as generalizations of thread pools and the interactions they support. Additionally, a number of implementations of `ExecutorService` can be instantiated from a class containing static factory methods. That class is called `Executors`. The `java.util.concurrent` package contains these three types along with many more high-level classes and interfaces aimed at helping a developer address common problems in concurrent programming.

The base interface, `Executor`, can execute tasks that implement `Runnable`. More commonly you use an `ExecutorService`, which is a subinterface of `Executor`. `ExecutorService` adds the ability to process a task that implements the `Callable` interface and to control the shutdown of the thread pool. The `Callable` interface allows a task to produce a result that can be picked up asynchronously by a manager task that is often, but not always, the code that originally submitted the job.

Implementations of `Executor` and `ExecutorService` are not required to use a particular strategy to execute the work submitted to them. Some provide concurrent execution in a fixed-size pool, making new work wait until one of the threads becomes available. Others start more threads when the workload rises and clean them up in times of low demand. Another simply processes the jobs sequentially using a single thread. All of this depends on the particular implementation, and a programmer should be careful to choose something appropriate to the architectural needs of the application. Three factory methods in the `Executors` class produce the behaviors just discussed:

Java 5.0 开始提供标准的线程池API。 `Executor` 和 `ExecutorService` 接口定义了线程池及其支持的交互操作。
另外，可以使用 `Executors` 的静态工厂方法来实例化 `ExecutorService` 的许多实现。
这些基础的类和接口都位于 `java.util.concurrent` 包中， 在编写大部分简单的并发任务时可以使用这些类。

基本接口 `Executor` 定义了执行 `Runnable` 任务的方法； 但使用更多的是子接口 `ExecutorService`。
`ExecutorService` 接口中增加了处理 `Callable` 的方法， 以及关闭线程池的功能。
实现 `Callable` 接口的任务会返回一个结果， 调用方可以通过返回的 `Future` 来异步获取执行状态和结果，这样就对任务有了一定的管理能力。

`Executor` 和 `ExecutorService` 接口并没有规定使用哪种调度策略来执行。

- 有些线程池，使用固定数量的线程来并发执行任务，新提交的任务，要等到有某个线程空闲才会被执行。
- 有的线程池, 在工作负载增加时启动更多线程，并在需求降低时清理一部分线程。
- 还有使用单个线程的线程池，直接按顺序来处理作业。

这些特征取决于具体的实现，根据业务特征，开发者需要选择适合的线程池。
`Executors` 类提供了三种工厂方法来提供刚才讨论的这几种行为：

- `newFixedThreadPool`
- `newCachedThreadPool`
- `newSingleThreadExecutor`

While the first two create pools that use multiple worker threads, `newSingleThreadExecutor` creates a service that runs all tasks one after another in a single background thread.

The code in this question uses a cached thread pool. This type of executor service spawns new worker threads as needed and cleans up threads that remain unused for a period of time. However, a cached thread pool has a serious drawback: There is no maximum limit to the number of threads it might create. This behavior can lead to high resource consumption and poor performance under high load.

Given that the pool created by the code in the question has multiple threads, you can expect that the jobs submitted to it might well run concurrently. Because of that, regardless of the order they start in, no assumptions can be made about their relative progress. That, in turn, means that the output messages could show up in any order. This tells you that options A and B both are correct.

前两个方法创建的是多个worker线程的线程池，而 `newSingleThreadExecutor` 方法创建的则是在单个线程中依次执行所有任务。

回到前面的问题， 试题中的代码使用了缓存方式的线程池。
这类线程池会根据需要生成新的worker线程，并清理一段时间内没有使用到的线程。
但是，缓存方式的线程池有一个严重的缺点： 创建的线程数可能没有最大限制。 可能会有大量的资源消耗，而且在高负载场景下，会由于资源争用导致性能急剧下降。

代码中创建的线程池具有多个线程， 所以，提交的任务有可能会并发运行。
因此，无论它们谁先开始，都无法对其执行进度做出精确判断。
也就是说，输出的消息可能是任意顺序的。 由此得知 `选项A` 和 `选项B` 都是`正确`的。

An `ExecutorService` runs each job that’s submitted to it at most one time. There are some circumstances when a job might not be run, or it could possibly be shut down before completion. However, no job runs more than once. This means that you will definitely not see any duplicated message. Therefore, option C is incorrect.

When you call the `shutdown` method, an `ExecutorService` responds by rejecting any new job requests, but it continues to run until the last job is completed. Because of this, there is no possibility in the given code that you will not see all three messages. Because of this, you know that option D is incorrect.

提交给 `ExecutorService` 的任务，会保证最多被执行一次。
在某些情况下，任务可能不会被执行，或者在执行完之前线程池被关闭了。
因为最多执行一次，所以我们绝对不会看到任何重复的消息。因此，`选项C不正确`。

在调用 `shutdown` 方法时，`ExecutorService` 会拒绝新的作业提交请求， 但是会继续运行，一直将已收到的作业全部执行完。
因此，在这里给的代码中， 三个消息都会看到。 因此，`选项D不正确`。


As a side note, you might wonder whether it’s possible to assert that option D is correct on the basis that if the shutdown is not completed in 10 seconds, the code runs off the end of the example; therefore, how can you be sure the messages are printed?

A couple of observations are relevant here. One consideration is that the chances of the jobs shown taking 10 seconds to complete are unreasonably low, and given that two options (A and B) are clearly correct, you can safely reject such an improbable consideration.

Of course, you might still be tempted by option D because an extreme situation in the host might prevent the jobs from completing in 10 seconds. For example, suppose your OS starts installing updates right at the moment the given code is launched. Notice that there’s nothing in the given code that shows the virtual machine being shut down forcibly. The threads in this thread pool are nondaemon threads and, therefore, the virtual machine will not shut down until the jobs have been completed. Consequently, the messages will be printed if the program is allowed to run.

The correct options are A and B.

顺便提一句，可能有些读者会认为，如果在10秒内线程池未关闭， 那么选项D也可能是正确的。
但反过来说，如何确定这个消息会被打印呢？

基于这里的代码，里面的逻辑非常简单，很明显不可能10秒钟执行不完。
而且我们能判断出 `选项A` 和 `选项B` 是正确的， 那么我们在做题时就可以将这种不可能的情况排除。

当然，你可能对选项D很感兴趣，因为在其他某些极端情况下, 作业无法在10秒内完成，比如恰好在这个时刻操作系统启动升级或更新。
请注意，在给定的代码中，没有任何证据表明 JVM 将被强行关闭。
而且这里的线程是 `非守护线程`(nondaemon thread)，因此，在作业完成之前，JVM 都不会退出。

所以，如果允许程序运行，则对应的消息都会被打印出来。


### 总结

正确的选项是 `A` 和 `B`。



### 相关链接

- [Java坑人面试题系列: 包装类（中级难度）](https://renfufei.blog.csdn.net/article/details/104163518)
- [Java坑人面试题系列: 比对while与for循环（中级）](https://renfufei.blog.csdn.net/article/details/104378574)
- [Java坑人面试题系列: 集合（高级）](https://blogs.oracle.com/javamagazine/quiz-advanced-collectors)
- [Java坑人面试题系列: 线程/线程池（高级）](https://blogs.oracle.com/javamagazine/quiz-advanced-executor-service)

原文链接:  <https://blogs.oracle.com/javamagazine/quiz-advanced-executor-service>
