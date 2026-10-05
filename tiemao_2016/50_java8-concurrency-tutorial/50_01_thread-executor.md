# Java 8 并发教程：线程与执行器

> 原文: Java 8 Concurrency Tutorial: Threads and Executors

2015年4月7日

欢迎阅读我的 Java 8 并发教程第一部分。本指南通过易于理解的代码示例，教你 Java 8 中的[并发编程](http://en.wikipedia.org/wiki/Concurrent_computing)。这是涵盖 Java 并发 API 系列教程的第一篇。在接下来的 15 分钟里，你将学会如何通过线程、任务和 executor 服务并行执行代码。


*   第 1 部分：[线程与执行器](50_01_thread-executor.md)
*   第 2 部分：[同步与锁](50_02_synchronized-locks.md)
*   第 3 部分：[原子变量与 ConcurrentMap](50_03_atomic-concurrent-map.md)


[并发 API](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/package-summary.html) 最早随 Java 5 的发布引入，之后随着每个新的 Java 版本不断增强。本文展示的大部分概念在更早版本的 Java 中同样适用。不过我的代码示例聚焦于 Java 8，并大量使用了 lambda 表达式和其他新特性。如果你还不熟悉 lambda，建议先阅读我的 [Java 8 教程](http://winterbe.com/posts/2014/03/16/java-8-tutorial/)。

### 线程与 Runnable

所有现代操作系统都通过[进程](http://en.wikipedia.org/wiki/Process_(computing))和[线程](http://en.wikipedia.org/wiki/Thread_%28computing%29)来支持并发。进程是程序的实例，通常彼此独立运行，例如启动一个 Java 程序时，操作系统会派生一个新进程，与其他程序并行运行。在这些进程内部，我们可以利用线程来并发执行代码，从而充分利用 CPU 可用的核心。

Java 自 JDK 1.0 起就支持[线程](https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html)。在启动一个新线程之前，你必须指定该线程要执行的代码，通常称为 _任务_。这通过实现 `Runnable` 来完成——它是一个函数式接口，定义了唯一的无参数、无返回值的 `run()` 方法，如下例所示：

    Runnable task = () -> {
        String threadName = Thread.currentThread().getName();
        System.out.println("Hello " + threadName);
    };

    task.run();

    Thread thread = new Thread(task);
    thread.start();

    System.out.println("Done!");


不使用 lambda 的代码如下所示:

    public static void main(String[] args) {
        testRunnable();
    }
    public static void testRunnable() {
        //
        Runnable task =  new Runnable(){
            public void run() {
                String name = Thread.currentThread().getName();
                System.out.println("Hello " + name);
            }
        };
        // 在当前线程,当中普通方法调用
        task.run();
        // 创建线程,以前面创建的 task 作为初始任务
        Thread thread = new Thread(task);
        // 启动线程; 注意,调用的是 start(); 而不是 run() 方法
        thread.start();
        //
        System.out.println("Done!");
    }

由于 `Runnable` 是函数式接口，我们可以利用 Java 8 的 lambda 表达式把当前线程名打印到控制台。我们先在主线程上直接执行这个 runnable，然后再启动一个新线程。

控制台的输出可能像这样：

    Hello main
    Hello Thread-0
    Done!

也可能像这样：

    Hello main
    Done!
    Hello Thread-0

由于并发执行，我们无法预测 runnable 会在打印 'done' 之前还是之后被调用。顺序是不确定的，这也使得并发编程在大型应用中成为一项复杂的任务。

线程可以休眠一段指定的时间。在本文后续的代码示例中，这非常便于模拟长时间运行的任务：

    Runnable runnable = () -> {
        try {
            String name = Thread.currentThread().getName();
            System.out.println("Foo " + name);
            TimeUnit.SECONDS.sleep(1);
            System.out.println("Bar " + name);
        }
        catch (InterruptedException e) {
            e.printStackTrace();
        }
    };

    Thread thread = new Thread(runnable);
    thread.start();


不使用 lambda 的代码如下所示:

    public static void main(String[] args) {
        testRunnableSleep();
    }
    public static void testRunnableSleep() {
        //
        Runnable runnable =  new Runnable(){
            public void run() {
                String name = Thread.currentThread().getName();
                System.out.println("线程准备 sleep :" + name);
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("线程 sleep 结束:" + name);
            }
        };
        // 创建线程,以前面创建的 runnable 作为初始任务
        Thread thread = new Thread(runnable);
        // 启动线程; 注意,调用的是 start(); 而不是 run() 方法
        thread.start();
    }



运行上面的代码时，你会注意到第一条和第二条打印语句之间有一秒的延迟。`TimeUnit` 是一个处理时间单位的有用枚举。或者，你也可以通过调用 `Thread.sleep(1000)` 达到同样的效果。

直接使用 `Thread` 类可能非常繁琐且容易出错。正因如此，**并发 API** 早在 2004 年随 Java 5 发布时就被引入。该 API 位于 `java.util.concurrent` 包中，包含许多用于处理并发编程的有用类。自那时起，并发 API 随着每个新的 Java 版本不断增强，甚至 Java 8 也提供了处理并发的新类和方法。

现在，让我们更深入地了解并发 API 中最重要的部分之一——executor 服务。

### 执行器(Executors)

并发 API 引入了 `ExecutorService` 的概念，作为直接操作线程的更高层替代方案。执行器能够运行异步任务，通常还会管理一个线程池，因此我们不必手动创建新线程。内部池中的所有线程都会在底层被复用来处理后续任务，所以我们可以在应用的整个生命周期内用单个 executor 服务运行任意数量的并发任务。

下面是使用执行器实现第一个线程示例的写法：

    ExecutorService executor = Executors.newSingleThreadExecutor();
    executor.submit(() -> {
        String threadName = Thread.currentThread().getName();
        System.out.println("Hello " + threadName);
    });

    // => Hello pool-1-thread-1


不使用 lambda 的代码如下所示:

    public static void main(String[] args) {
        testSingle();
    }
    public static void testSingle() {
        // 创建单线程的线程池
        ExecutorService executorS = Executors.newSingleThreadExecutor();
        // 提交任务; 此处使用匿名内部类
        executorS.submit(new Runnable(){
            public void run() {
                String threadName = Thread.currentThread().getName();
                System.out.println("threadName:" + threadName);
            }
        });
    }
    // 输出内容如 threadName: pool-1-thread-1



`Executors` 类提供了便捷的工厂方法，用于创建不同类型的 executor 服务。在这个示例中，我们使用了一个线程池大小为 1 的执行器。

结果看起来与上面的示例类似，但运行代码时你会注意到一个重要区别：Java 进程永远不会停止！执行器必须被显式停止——否则它们会一直监听新任务。

`ExecutorService` 为此提供了两个方法：`shutdown()` 会等待当前正在运行的任务完成，而 `shutdownNow()` 会中断所有正在运行的任务并立即关闭执行器。

下面是我通常关闭执行器的首选方式：

    try {
        System.out.println("attempt to shutdown executor");
        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);
    }
    catch (InterruptedException e) {
        System.err.println("tasks interrupted");
    }
    finally {
        if (!executor.isTerminated()) {
            System.err.println("cancel non-finished tasks");
        }
        executor.shutdownNow();
        System.out.println("shutdown finished");
    }

执行器通过等待一段时间让当前运行的任务终止来温和地关闭。最多五秒之后，执行器会中断所有正在运行的任务，最终关闭。

#### Callable 与 Future

除了 `Runnable`，执行器还支持另一种名为 `Callable` 的任务。Callable 和 runnable 一样也是函数式接口，但它们不像 runnable 那样返回 `void`，而是会返回一个值。

下面这个 lambda 表达式定义了一个 callable，它休眠一秒后返回一个整数：

    Callable<Integer> task = () -> {
        try {
            TimeUnit.SECONDS.sleep(1);
            return 123;
        }
        catch (InterruptedException e) {
            throw new IllegalStateException("task interrupted", e);
        }
    };

Callable 可以和 runnable 一样提交给 executor 服务。但 callable 的结果怎么办呢？由于 `submit()` 不会等待任务完成，executor 服务无法直接返回 callable 的结果。取而代之，执行器会返回一个类型为 `Future` 的特殊结果，可在稍后的时间点用来获取真正的结果。

    ExecutorService executor = Executors.newFixedThreadPool(1);
    Future<Integer> future = executor.submit(task);

    System.out.println("future done? " + future.isDone());

    Integer result = future.get();

    System.out.println("future done? " + future.isDone());
    System.out.print("result: " + result);

把 callable 提交给执行器之后，我们首先通过 `isDone()` 检查这个 future 是否已经执行完成。我基本可以肯定它还没有完成，因为上面的 callable 在返回整数之前会休眠一秒钟。

调用 `get()` 方法会阻塞当前线程，等待 callable 完成之后才返回真正的结果 `123`。现在这个 future 终于完成了，我们在控制台上看到如下结果：

    future done? false
    future done? true
    result: 123

Future 与底层的 executor 服务紧密耦合。请记住，如果你关闭了执行器，那么每个尚未终止的 future 都会抛出异常：

    executor.shutdownNow();
    future.get();

你可能已经注意到，这里创建执行器的方式与上一个示例略有不同。我们使用 `newFixedThreadPool(1)` 创建一个由大小为 1 的线程池支撑的 executor 服务。它等价于 `newSingleThreadExecutor()`，但之后我们可以简单地通过传入大于 1 的值来增大线程池大小。

#### 超时

任何对 `future.get()` 的调用都会阻塞，直到底层 callable 终止。最坏情况下，callable 会永远运行下去——从而使你的应用失去响应。你只需传入一个超时时间，就能应对这类情况：

    ExecutorService executor = Executors.newFixedThreadPool(1);

    Future<Integer> future = executor.submit(() -> {
        try {
            TimeUnit.SECONDS.sleep(2);
            return 123;
        }
        catch (InterruptedException e) {
            throw new IllegalStateException("task interrupted", e);
        }
    });

    future.get(1, TimeUnit.SECONDS);

执行上面的代码会抛出 `TimeoutException`：

    Exception in thread "main" java.util.concurrent.TimeoutException
        at java.util.concurrent.FutureTask.get(FutureTask.java:205)

你可能已经猜到为什么会抛出这个异常：我们指定了最长等待时间为 1 秒，但 callable 实际上需要 2 秒才能返回结果。

#### InvokeAll

执行器支持通过 `invokeAll()` 一次性批量提交多个 callable。该方法接受一个 callable 集合，并返回一个 future 列表。

    ExecutorService executor = Executors.newWorkStealingPool();

    List<Callable<String>> callables = Arrays.asList(
            () -> "task1",
            () -> "task2",
            () -> "task3");

    executor.invokeAll(callables)
        .stream()
        .map(future -> {
            try {
                return future.get();
            }
            catch (Exception e) {
                throw new IllegalStateException(e);
            }
        })
        .forEach(System.out::println);

在这个示例中，我们利用 Java 8 的函数式流来处理 `invokeAll` 调用返回的所有 future。我们先把每个 future 映射为它的返回值，然后逐个打印到控制台。如果你还不熟悉流，可以阅读我的 [Java 8 Stream 教程](http://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/)。

#### InvokeAny

另一种批量提交 callable 的方法是 `invokeAny()`，它的工作方式与 `invokeAll()` 略有不同。它不返回 future 对象，而是阻塞直到第一个 callable 终止，并返回那个 callable 的结果。

为了测试这种行为，我们使用下面这个辅助方法来模拟具有不同耗时的 callable。该方法返回一个 callable，它休眠指定时间后返回给定的结果：

    Callable<String> callable(String result, long sleepSeconds) {
        return () -> {
            TimeUnit.SECONDS.sleep(sleepSeconds);
            return result;
        };
    }

我们用这个方法创建一批耗时从 1 秒到 3 秒不等的 callable。通过 `invokeAny()` 把这些 callable 提交给执行器，会返回最快完成的 callable 的字符串结果——在这个例子中是 task2：

    ExecutorService executor = Executors.newWorkStealingPool();

    List<Callable<String>> callables = Arrays.asList(
        callable("task1", 2),
        callable("task2", 1),
        callable("task3", 3));

    String result = executor.invokeAny(callables);
    System.out.println(result);

    // => task2

上面的例子使用了另一种通过 `newWorkStealingPool()` 创建的执行器。这个工厂方法是 Java 8 的一部分，返回一个 `ForkJoinPool` 类型的执行器，它的工作方式与普通执行器略有不同。它不是使用固定大小的线程池，而是针对给定的并行度大小创建 [ForkJoinPool](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ForkJoinPool.html)，默认值为宿主机 CPU 可用的核心数。

ForkJoinPool 自 Java 7 起就存在，将在本系列的后续教程中详细介绍。让我们通过深入了解定时执行器来结束本教程。

### 定时执行器(Scheduled Executors)

我们已经学会了如何在执行器上提交并运行一次性任务。为了周期性地多次运行常规任务，我们可以利用定时线程池。

`ScheduledExecutorService` 能够调度任务周期性地运行，或者在经过一定时间后运行一次。

下面这段代码示例调度一个任务在 3 秒的初始延迟之后运行：

    ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);

    Runnable task = () -> System.out.println("Scheduling: " + System.nanoTime());
    ScheduledFuture<?> future = executor.schedule(task, 3, TimeUnit.SECONDS);

    TimeUnit.MILLISECONDS.sleep(1337);

    long remainingDelay = future.getDelay(TimeUnit.MILLISECONDS);
    System.out.printf("Remaining Delay: %sms", remainingDelay);

调度任务会生成一个 `ScheduledFuture` 类型的专用 future，它在 `Future` 的基础上还提供了 `getDelay()` 方法，用于获取剩余延迟。延迟结束后，任务将被并发执行。

为了调度任务周期性执行，执行器提供了两个方法：`scheduleAtFixedRate()` 和 `scheduleWithFixedDelay()`。第一个方法能够以固定的时间频率执行任务，例如下面这个示例演示的每秒一次：

    ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);

    Runnable task = () -> System.out.println("Scheduling: " + System.nanoTime());

    int initialDelay = 0;
    int period = 1;
    executor.scheduleAtFixedRate(task, initialDelay, period, TimeUnit.SECONDS);

此外，该方法还接受一个初始延迟，表示任务第一次执行之前的等待时间。

请记住，`scheduleAtFixedRate()` 并不考虑任务的实际耗时。所以如果你指定周期为 1 秒，而任务需要 2 秒才能执行完，那么线程池很快就会满负荷运转。

这种情况下，你应该考虑改用 `scheduleWithFixedDelay()`。该方法的工作方式与上面描述的那个方法类似。区别在于，等待时间间隔作用于一个任务结束到下一个任务开始之间。例如：

    ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);

    Runnable task = () -> {
        try {
            TimeUnit.SECONDS.sleep(2);
            System.out.println("Scheduling: " + System.nanoTime());
        }
        catch (InterruptedException e) {
            System.err.println("task interrupted");
        }
    };

    executor.scheduleWithFixedDelay(task, 0, 1, TimeUnit.SECONDS);

这个示例调度一个任务，在每次执行结束到下次执行开始之间固定延迟 1 秒。初始延迟为 0，任务耗时为 2 秒。因此执行时间点依次为 0s、3s、6s、9s，依此类推。如你所见，当你无法预测被调度任务的耗时时，`scheduleWithFixedDelay()` 会非常方便。

这是并发教程系列的第一部分。我建议你亲自练习文中展示的代码示例。你可以在 [GitHub](https://github.com/winterbe/java8-tutorial) 上找到本文的所有代码示例，欢迎 fork 这个仓库并[给我点个 star](https://github.com/winterbe/java8-tutorial/stargazers)。

希望你喜欢这篇文章。如果你还有任何疑问，欢迎在下方评论区或通过 [Twitter](https://twitter.com/winterbe_) 把你的反馈发给我。


*   Part 1: [Threads and Executors](50_01_thread-executor.md)
*   Part 2: [Synchronization and Locks](50_02_synchronized-locks.md)
*   Part 3: [Atomic Variables and ConcurrentMap](50_03_atomic-concurrent-map.md)


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
*   [# Java 8 Concurrency Tutorial: Synchronization and Locks](http://winterbe.com/posts/2015/04/30/java8-concurrency-tutorial-synchronized-locks-examples/)
*   [# Java 8 API by Example: Strings, Numbers, Math and Files](http://winterbe.com/posts/2015/03/25/java8-examples-string-number-math-files/)




原文链接: [http://winterbe.com/posts/2015/04/07/java8-concurrency-tutorial-thread-executor-examples/](http://winterbe.com/posts/2015/04/07/java8-concurrency-tutorial-thread-executor-examples/)
