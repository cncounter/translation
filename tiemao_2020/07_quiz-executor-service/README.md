# Quiz Yourself: Threads and `Executors` (Advanced)

＃ Java坑人面试题系列: 线程/线程池（高级难度）

> The details of relying on specific operations from `ExecutorService`


If you have worked on our quiz questions in the past, you know none of them is easy. They model the difficult questions from certification examinations. The levels marked “intermediate” and “advanced” refer to the exams, rather than the questions. Although in almost all cases, “advanced” questions will be harder. We write questions for the certification exams, and we intend that the same rules apply: Take words at their face value and trust that the questions are not intended to deceive you, but straightforwardly test your knowledge of the ins and outs of the language.


>  `ExecutorService` 接口及相关API细节详解。


Java Magazine上面有一个专门坑人的面试题系列: <https://blogs.oracle.com/javamagazine/quiz-2>。

这些问题的设计宗旨，主要是测试面试者对Java语言的了解程度，而不是为了用弯弯绕绕的手段把面试者搞蒙。

如果你看过往期的问题，就会发现每一个都不简单。

这些试题模拟了认证考试中的一些难题。 而 “中级(intermediate)” 和 “高级(advanced)” 指的是试题难度，而不是说这些知识本身很深。 一般来说，“高级”问题会稍微难一点。



### Question (advanced).


The objective is to create worker threads using `Runnable` and `Callable` and to use an `ExecutorService` to concurrently execute tasks. Given the following class:


### 问题（高级难度）

此问题的目的是考察如何通过 `Runnable` 和 `Callable` 来创建任务，并使用 `ExecutorService` 来并发执行。

我们有一个 `Logger` 类，定义如下所示：


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

并给出如下使用的代码:

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

这里省略了相关的 `import` 语句, 假设代码能编译并正常启动。 请选择两项可能的输出结果：

- A、 Error Debug Warning
- B、 Error Warning Debug
- C、 Error Error Debug
- D、 Error Debug

### Answer.

### 答案和解析

The exam objectives include topics related to the `Executors` class and the `ExecutorService` interface, along with thread pools that implement the `ExecutorService` interface offered by the `Executors` class.

In the first versions of Java, the programmer had the responsibility for creating and managing threads, and because threads are expensive to create and they are limited, kernel-level resources, it was common to create a “thread pool” so a few threads could be used to process a large number of small, independent jobs. The idea of a thread pool is that instead of creating a thread for every little background job and then destroying the threads after each job is completed, a smaller number of threads are created and configured so that packages of work (for example, `Runnable` objects) can be passed to these threads. The first thread that has no work to do takes the job and runs it, and when the job is complete, that thread goes back to look for another job.

这道试题属于 `Executors` 类和 `ExecutorService` 接口相关的考点，顺带考察 `Executors` 工具类自带的 `ExecutorService` 线程池实现。

在Java的早期版本中，需要程序员手工创建和管理线程。
线程是系统内核级的重要资源，并不能无限创建; 而且创建线程的开销很大，所以开发中一般会使用资源池模式，也就是创建 “线程池”。
通过线程池，可以用少量的线程，来执行大量的任务。
线程池的思路是这样的： 与其为每个任务创建一个线程，执行完就销毁； 倒不如统一创建少量的线程， 然后将任务逻辑用 `Runnable` 包装起来， 提交给线程池来调度执行。
有任务需要调度的时候，线程池找一个空闲的线程，并通知他干活。 任务执行完成后，再将这个线程放回池子里，等待下一次调度。

Thread pools became part of Java’s APIs in Java 5. The `Executor` and `ExecutorService` interfaces are provided as generalizations of thread pools and the interactions they support. Additionally, a number of implementations of `ExecutorService` can be instantiated from a class containing static factory methods. That class is called `Executors`. The `java.util.concurrent` package contains these three types along with many more high-level classes and interfaces aimed at helping a developer address common problems in concurrent programming.

The base interface, `Executor`, can execute tasks that implement `Runnable`. More commonly you use an `ExecutorService`, which is a subinterface of `Executor`. `ExecutorService` adds the ability to process a task that implements the `Callable` interface and to control the shutdown of the thread pool. The `Callable` interface allows a task to produce a result that can be picked up asynchronously by a manager task that is often, but not always, the code that originally submitted the job.

Implementations of `Executor` and `ExecutorService` are not required to use a particular strategy to execute the work submitted to them. Some provide concurrent execution in a fixed-size pool, making new work wait until one of the threads becomes available. Others start more threads when the workload rises and clean them up in times of low demand. Another simply processes the jobs sequentially using a single thread. All of this depends on the particular implementation, and a programmer should be careful to choose something appropriate to the architectural needs of the application. Three factory methods in the `Executors` class produce the behaviors just discussed:

Java 5.0 开始提供标准的线程池API。
`Executor` 和 `ExecutorService` 接口定义了线程池以及支持的交互操作。
另外，我们可以使用 `Executors` 的静态工厂方法来实例化 `ExecutorService` 的各种实现。
相关的基础类和接口都位于 `java.util.concurrent` 包中， 在编写简单的并发任务时，一般可以直接使用。

`Executor` 是顶层接口, 定义了执行 `Runnable` 任务的方法；
但我们一般用的是子接口 `ExecutorService` 及其实现。
`ExecutorService` 接口中增加了处理 `Callable` 的方法， 以及关闭线程池的功能。
实现 `Callable` 接口的任务会返回一个结果， 调用方可以通过提交任务时返回的 `Future` 对象，来异步获取任务的执行状态和结果，这样就对任务有了一定的管理和控制能力。

`Executor` 和 `ExecutorService` 接口并没有规定使用哪种调度策略来执行。

- 有些线程池，使用固定数量的线程来并发地执行任务，新提交的任务要等到有空闲线程才会被执行。
- 有的线程池, 在工作负载上升时自动增加线程，并在需求降低时清理掉一部分线程。
- 还有的线程池只使用单个线程，直接按顺序执行提交的任务。

这些特征取决于具体的实现，需要开发者根据业务系统的特征来权衡，并选择适当的线程池。
上面讨论的这几类线程池，`Executors` 工具类提供了三种对应的工厂方法：

- `newFixedThreadPool`
- `newCachedThreadPool`
- `newSingleThreadExecutor`

While the first two create pools that use multiple worker threads, `newSingleThreadExecutor` creates a service that runs all tasks one after another in a single background thread.

The code in this question uses a cached thread pool. This type of executor service spawns new worker threads as needed and cleans up threads that remain unused for a period of time. However, a cached thread pool has a serious drawback: There is no maximum limit to the number of threads it might create. This behavior can lead to high resource consumption and poor performance under high load.

Given that the pool created by the code in the question has multiple threads, you can expect that the jobs submitted to it might well run concurrently. Because of that, regardless of the order they start in, no assumptions can be made about their relative progress. That, in turn, means that the output messages could show up in any order. This tells you that options A and B both are correct.

前两个方法创建的线程池可以有多个worker线程， 而 `newSingleThreadExecutor` 方法创建的线程池则只有单个线程。

回到前面的问题， 试题中给出的代码创建了缓存模式的线程池。
这类线程池会根据需要生成新的worker线程，并清理一段时间内没有使用到的线程。
但缓存模式的线程池有一个严重缺点： 创建的线程数有可能不被限制, 那样的话会导致大量的资源占用。 在高负载场景下，可能会由于资源争用而导致性能急剧下降。

因为创建的线程池具有多个线程， 所以后面提交的任务可以并发执行。
无论谁先开始，我们都无法对其执行进度做出精确预测。
也就是说，他们输出消息的顺序可能是任意的。
由此得知， `选项A` 和 `选项B` 都 `正确`。

An `ExecutorService` runs each job that’s submitted to it at most one time. There are some circumstances when a job might not be run, or it could possibly be shut down before completion. However, no job runs more than once. This means that you will definitely not see any duplicated message. Therefore, option C is incorrect.

When you call the `shutdown` method, an `ExecutorService` responds by rejecting any new job requests, but it continues to run until the last job is completed. Because of this, there is no possibility in the given code that you will not see all three messages. Because of this, you know that option D is incorrect.

`ExecutorService` 会保证提交的任务最多被执行一次。
在某些情况下，任务可能不会执行，或者在执行完成之前线程池就被关闭了。
因为具有最多执行一次的特征，所以我们不会看到任何重复的消息。因此可以判断，`选项C不正确`。

在调用 `shutdown` 方法之后，`ExecutorService` 会拒绝新的任务提交请求， 但已有的任务会继续运行，直到所有的作业全部执行完才会关闭。
因此在这里给的代码中， 三个消息都会看到。 因此可知，`选项D不正确`。


As a side note, you might wonder whether it’s possible to assert that option D is correct on the basis that if the shutdown is not completed in 10 seconds, the code runs off the end of the example; therefore, how can you be sure the messages are printed?

A couple of observations are relevant here. One consideration is that the chances of the jobs shown taking 10 seconds to complete are unreasonably low, and given that two options (A and B) are clearly correct, you can safely reject such an improbable consideration.

Of course, you might still be tempted by option D because an extreme situation in the host might prevent the jobs from completing in 10 seconds. For example, suppose your OS starts installing updates right at the moment the given code is launched. Notice that there’s nothing in the given code that shows the virtual machine being shut down forcibly. The threads in this thread pool are nondaemon threads and, therefore, the virtual machine will not shut down until the jobs have been completed. Consequently, the messages will be printed if the program is allowed to run.

The correct options are A and B.

顺便提一句，可能有些读者会认为，如果在10秒内执行不完， 那么选项D也可能是正确的。
但反过来说，如何确定这个消息会被打印呢？

因为试题中给出的任务逻辑非常简单，很明显不可能10秒钟还执行不完。
而且我们通过分析能判断出 `选项A` 和 `选项B` 是正确的， 那么做题时就可以将这种不可能的情况排除。

当然，你可能对选项D感兴趣，因为在其他某些极端的情况下, 作业无法在10秒内完成，比如恰好在这个时刻操作系统启动升级或更新。
请注意，在给定的代码中，没有任何证据表明 JVM 将被强行关闭。
而且默认创建的线程都是 `非守护线程`(nondaemon thread)，因此，在作业完成之前，JVM 不会退出。

所以，如果允许程序运行，则对应的消息都会被打印出来。


### 总结

正确的选项是 `A` 和 `B`。



### 相关链接

- [Java坑人面试题系列: 包装类（中级难度）](https://renfufei.blog.csdn.net/article/details/104163518)
- [Java坑人面试题系列: 比对while与for循环（中级）](https://renfufei.blog.csdn.net/article/details/104378574)
- [Java坑人面试题系列: 集合（高级）](https://blogs.oracle.com/javamagazine/quiz-advanced-collectors)
- [Java坑人面试题系列: 线程/线程池（高级）](https://renfufei.blog.csdn.net/article/details/104726229)
- [Java坑人面试题系列: 变量声明（中级）](https://renfufei.blog.csdn.net/article/details/105962238)

原文链接:  <https://blogs.oracle.com/javamagazine/quiz-advanced-executor-service>
