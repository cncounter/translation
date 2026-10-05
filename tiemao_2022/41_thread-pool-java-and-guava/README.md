# Introduction to Thread Pools in Java

# Java 线程池简介

## 1. Overview

This tutorial is a look at thread pools in Java. We'll start with the different implementations in the standard Java library and then look at Google's Guava library.

## 1. 概述

本教程将探讨 Java 中的线程池。我们先从标准 Java 库中的各种实现入手，然后看看 Google 的 Guava 库。

## 2. The Thread Pool

In Java, threads are mapped to system-level threads, which are the operating system's resources. If we create threads uncontrollably, we may run out of these resources quickly.

The operating system does the context switching between threads as well — in order to emulate parallelism. A simplistic view is that the more threads we spawn, the less time each thread spends doing actual work.

The Thread Pool pattern helps to save resources in a multithreaded application and to contain the parallelism in certain predefined limits.

When we use a thread pool, we write our concurrent code in the form of parallel tasks and submit them for execution to an instance of a thread pool. This instance controls several re-used threads for executing these tasks.
[![2016-08-10_10-16-52-1024x572](https://www.baeldung.com/wp-content/uploads/2016/08/2016-08-10_10-16-52-1024x572-300x168.png)](https://www.baeldung.com/wp-content/uploads/2016/08/2016-08-10_10-16-52-1024x572.png)

The pattern allows us to control the number of threads the application creates and their life cycle. We're also able to schedule tasks' execution and keep incoming tasks in a queue.

## 2. 线程池

在 Java 中，线程会映射到系统级线程，而系统级线程属于操作系统的资源。如果我们不加控制地创建线程，这些资源可能很快就会被耗尽。

操作系统还会在线程之间做上下文切换——以此来模拟并行。一个简单的理解是：我们创建的线程越多，每个线程花在实际工作上的时间就越少。

线程池模式有助于在多线程应用中节省资源，并把并行度限制在预先设定的范围内。

当我们使用线程池时，我们会把并发代码写成一个个并行的任务，再把它们提交给线程池的实例去执行。这个实例控制着若干个可复用的线程来执行这些任务。

该模式让我们可以控制应用创建的线程数量及其生命周期。我们还能调度任务的执行，并把新到的任务保存在队列中。

## 3. Thread Pools in Java

## 3. Java 中的线程池

### 3.1. `Executors`, `Executor` and `ExecutorService`

The `Executors` helper class contains several methods for the creation of preconfigured thread pool instances. Those classes are a good place to start. We can use them if we don't need to apply any custom fine-tuning.

We use the `Executor` and `ExecutorService` interfaces to work with different thread pool implementations in Java. Usually, we should keep our code decoupled from the actual implementation of the thread pool and use these interfaces throughout our application.

### 3.1. `Executors`、`Executor` 和 `ExecutorService`

`Executors` 这个工具类包含若干用于创建预配置线程池实例的方法。这些类很适合作为起点。如果不需要做任何自定义的精细调优，就可以直接使用它们。

我们通过 `Executor` 和 `ExecutorService` 这两个接口来使用 Java 中不同的线程池实现。通常，我们应该让代码与线程池的具体实现解耦，并在整个应用中统一使用这些接口。

#### 3.1.1. `Executor`

#### 3.1.1. Executor(执行器)

The `Executor` interface has a single `execute` method to submit `Runnable` instances for execution.

Let's look at a quick example of how to use the `Executors` API to acquire an `Executor` instance backed by a single thread pool and an unbounded queue for executing tasks sequentially.

Here, we run a single task that simply prints “Hello World“ on the screen. We'll submit the task as a lambda (a Java 8 feature), which is inferred to be `Runnable`:

```java
Executor executor = Executors.newSingleThreadExecutor();
executor.execute(() -> System.out.println("Hello World"));Copy
```

`Executor` 接口只有一个 `execute` 方法，用于提交 `Runnable` 实例去执行。

我们来看一个简单的例子：如何使用 `Executors` API 获取一个 `Executor` 实例，其背后是一个单线程池和一个无界队列，用来按顺序执行任务。

这里我们运行一个简单的任务，它只是在屏幕上打印 “Hello World”。我们把任务以 lambda 表达式(Java 8 的特性)的形式提交，它会被推断为 `Runnable`。

#### 3.1.2. `ExecutorService`

#### 3.1.2. ExecutorService(执行器服务)

The `ExecutorService` interface contains a large number of methods to control the progress of the tasks and manage the termination of the service. Using this interface, we can submit the tasks for execution and also control their execution using the returned `Future` instance.

Now we'll create an `ExecutorService`, submit a task and then use the returned `Future`‘s `get` method to wait until the submitted task finishes and the value is returned:

```java
ExecutorService executorService = Executors.newFixedThreadPool(10);
Future<String> future = executorService.submit(() -> "Hello World");
// some operations
String result = future.get();Copy
```

Of course, in a real-life scenario, we usually don't want to call `future.get()` right away but defer calling it until we actually need the value of the computation.

Here, we overload the `submit` method to take either `Runnable` or `Callable`. Both of these are functional interfaces, and we can pass them as lambdas (starting with Java 8).

`Runnable`‘s single method does not throw an exception and does not return a value. The `Callable` interface may be more convenient, as it allows us to throw an exception and return a value.

Finally, to let the compiler infer the `Callable` type, simply return a value from the lambda.

For more examples of using the `ExecutorService` interface and futures, have a look at [A Guide to the Java ExecutorService](https://www.baeldung.com/java-executor-service-tutorial).

`ExecutorService` 接口包含大量方法，用于控制任务的进度以及管理服务的终止。通过这个接口，我们可以提交任务去执行，还可以用返回的 `Future` 实例来控制它们的执行。

现在我们创建一个 `ExecutorService`，提交一个任务，然后用返回的 `Future` 的 `get` 方法等待提交的任务完成并返回结果。

当然，在真实场景中，我们通常不会立刻调用 `future.get()`，而是等到真正需要计算结果的值时再调用。

这里我们对 `submit` 方法做了重载，它可以接收 `Runnable` 或 `Callable`。两者都是函数式接口，我们可以把它们当作 lambda 传入(从 Java 8 开始)。

`Runnable` 的单个方法不抛异常也不返回值。`Callable` 接口可能更方便，因为它允许抛出异常并返回一个值。

最后，要让编译器推断出 `Callable` 类型，只需在 lambda 中返回一个值即可。

关于 `ExecutorService` 接口和 future 的更多示例，请查看 [A Guide to the Java ExecutorService](https://www.baeldung.com/java-executor-service-tutorial)。

### 3.2. `ThreadPoolExecutor`

### 3.2. ThreadPoolExecutor(线程池执行器)

The `ThreadPoolExecutor` is an extensible thread pool implementation with lots of parameters and hooks for fine-tuning.

The main configuration parameters that we'll discuss here are `corePoolSize`, `maximumPoolSize` and `keepAliveTime`.

The pool consists of a fixed number of core threads that are kept inside all the time. It also consists of some excessive threads that may be spawned and then terminated when they are no longer needed.

The `corePoolSize` parameter is the number of core threads that will be instantiated and kept in the pool. When a new task comes in, if all core threads are busy and the internal queue is full, the pool is allowed to grow up to `maximumPoolSize`.

The `keepAliveTime` parameter is the interval of time for which the excessive threads (instantiated in excess of the `corePoolSize`) are allowed to exist in the idle state. By default, the `ThreadPoolExecutor` only considers non-core threads for removal. In order to apply the same removal policy to core threads, we can use the [allowCoreThreadTimeOut(true)](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html#allowCoreThreadTimeOut(boolean)) method.

These parameters cover a wide range of use cases, but the most typical configurations are predefined in the `Executors` static methods.

`ThreadPoolExecutor` 是一个可扩展的线程池实现，带有大量用于精细调优的参数和钩子。

我们这里要讨论的主要配置参数是 `corePoolSize`、`maximumPoolSize` 和 `keepAliveTime`。

线程池由固定数量的核心线程组成，这些核心线程会始终保留在池中。此外它还包含一些多余线程，这些线程可能被创建，并在不再需要时被终止。

`corePoolSize` 参数是会被实例化并保留在池中的核心线程数量。当新任务到来时，如果所有核心线程都在忙，并且内部队列已满，线程池就允许扩容到 `maximumPoolSize`。

`keepAliveTime` 参数是多余线程(超出 `corePoolSize` 而实例化的线程)被允许以空闲状态存在的时间间隔。默认情况下，`ThreadPoolExecutor` 只考虑移除非核心线程。要想对核心线程应用同样的移除策略，可以使用 [allowCoreThreadTimeOut(true)](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html#allowCoreThreadTimeOut(boolean)) 方法。

这些参数覆盖了很广的使用场景，但最典型的配置已经在 `Executors` 的静态方法中预定义好了。

#### 3.2.1. `newFixedThreadPool`

#### 3.2.1. newFixedThreadPool(固定大小线程池)

Let's look at an example. `newFixedThreadPool` method creates a `ThreadPoolExecutor` with equal `corePoolSize` and `maximumPoolSize` parameter values and a zero `keepAliveTime`. This means that the number of threads in this thread pool is always the same:

```java
ThreadPoolExecutor executor = 
  (ThreadPoolExecutor) Executors.newFixedThreadPool(2);
executor.submit(() -> {
    Thread.sleep(1000);
    return null;
});
executor.submit(() -> {
    Thread.sleep(1000);
    return null;
});
executor.submit(() -> {
    Thread.sleep(1000);
    return null;
});

assertEquals(2, executor.getPoolSize());
assertEquals(1, executor.getQueue().size());Copy
```

Here, we instantiate a `ThreadPoolExecutor` with a fixed thread count of 2. This means that if the number of simultaneously running tasks is always less than or equal to two, they get executed right away. Otherwise, some of these tasks may be put into a queue to wait for their turn.

We created three `Callable` tasks that imitate heavy work by sleeping for 1000 milliseconds. The first two tasks will be run at once, and the third one will have to wait in the queue. We can verify it by calling the `getPoolSize()` and `getQueue().size()` methods immediately after submitting the tasks.

来看一个例子。`newFixedThreadPool` 方法创建的 `ThreadPoolExecutor`，其 `corePoolSize` 与 `maximumPoolSize` 参数取值相等，`keepAliveTime` 为 0。这意味着这个线程池中的线程数量始终相同：

这里我们实例化了一个固定线程数为 2 的 `ThreadPoolExecutor`。这意味着，如果同时运行的任务数始终小于或等于 2，它们就会立即被执行。否则，其中一些任务可能被放进队列，等待轮到自己。

我们创建了三个 `Callable` 任务，通过休眠 1000 毫秒来模拟耗时工作。前两个任务会立即运行，第三个则必须在队列中等待。我们可以在提交任务后立刻调用 `getPoolSize()` 和 `getQueue().size()` 方法来验证这一点。

#### 3.2.2. `Executors.newCachedThreadPool()`

#### 3.2.2. Executors.newCachedThreadPool()(缓存线程池)

We can create another preconfigured `ThreadPoolExecutor` with the `Executors.newCachedThreadPool()` method. This method does not receive a number of threads at all. We set the `corePoolSize` to 0 and set the `maximumPoolSize` to `Integer.MAX_VALUE`. Finally, the `keepAliveTime` is 60 seconds:

```java
ThreadPoolExecutor executor = 
  (ThreadPoolExecutor) Executors.newCachedThreadPool();
executor.submit(() -> {
    Thread.sleep(1000);
    return null;
});
executor.submit(() -> {
    Thread.sleep(1000);
    return null;
});
executor.submit(() -> {
    Thread.sleep(1000);
    return null;
});

assertEquals(3, executor.getPoolSize());
assertEquals(0, executor.getQueue().size());Copy
```

These parameter values mean that the cached thread pool may grow without bounds to accommodate any number of submitted tasks. But when the threads are not needed anymore, they will be disposed of after 60 seconds of inactivity. A typical use case is when we have a lot of short-living tasks in our application.

The queue size will always be zero because internally a `SynchronousQueue` instance is used. In a `SynchronousQueue`, pairs of `insert` and `remove` operations always occur simultaneously. So, the queue never actually contains anything.

我们还可以用 `Executors.newCachedThreadPool()` 方法创建另一种预配置的 `ThreadPoolExecutor`。这个方法根本不接收线程数量参数。我们把 `corePoolSize` 设为 0，把 `maximumPoolSize` 设为 `Integer.MAX_VALUE`。最后，`keepAliveTime` 是 60 秒：

这些参数取值意味着，缓存线程池可以无限制地增长，以容纳任意数量的已提交任务。但当这些线程不再需要时，它们会在空闲 60 秒后被回收。一个典型的使用场景是：应用中有大量短生命周期的任务。

队列大小始终为 0，因为内部使用的是 `SynchronousQueue` 实例。在 `SynchronousQueue` 中，`insert` 和 `remove` 操作总是成对同时发生。所以，队列实际上从不存放任何东西。

#### 3.2.3. `Executors.newSingleThreadExecutor()`

#### 3.2.3. Executors.newSingleThreadExecutor()(单线程执行器)

The `Executors.newSingleThreadExecutor()` API creates another typical form of `ThreadPoolExecutor` containing a single thread. The single thread executor is ideal for creating an event loop. The `corePoolSize` and `maximumPoolSize` parameters are equal to 1, and the `keepAliveTime` is 0.

Tasks in the above example will be run sequentially, so the flag value will be 2 after the task's completion:

```java
AtomicInteger counter = new AtomicInteger();

ExecutorService executor = Executors.newSingleThreadExecutor();
executor.submit(() -> {
    counter.set(1);
});
executor.submit(() -> {
    counter.compareAndSet(1, 2);
});Copy
```

Additionally, this `ThreadPoolExecutor` is decorated with an immutable wrapper, so it can't be reconfigured after creation. Note that this is also the reason we can't cast it to a `ThreadPoolExecutor`.

`Executors.newSingleThreadExecutor()` API 创建的是另一种典型的 `ThreadPoolExecutor` 形式，其中只包含一个线程。单线程执行器非常适合用来创建事件循环。它的 `corePoolSize` 和 `maximumPoolSize` 参数都等于 1，`keepAliveTime` 为 0。

上面例子中的任务会按顺序运行，所以任务完成之后标志值会是 2：

此外，这个 `ThreadPoolExecutor` 被一个不可变包装器装饰过，因此它在创建之后无法重新配置。注意，这也是我们不能把它强制转换为 `ThreadPoolExecutor` 的原因。

### 3.3. `ScheduledThreadPoolExecutor`

### 3.3. ScheduledThreadPoolExecutor(定时线程池执行器)

The `ScheduledThreadPoolExecutor` extends the `ThreadPoolExecutor` class and also implements the `ScheduledExecutorService` interface with several additional methods:

- `schedule` method allows us to run a task once after a specified delay.
- `scheduleAtFixedRate` method allows us to run a task after a specified initial delay and then run it repeatedly with a certain period. The `period` argument is the time measured between the starting times of the tasks, so the execution rate is fixed.
- `scheduleWithFixedDelay` method is similar to `scheduleAtFixedRate` in that it repeatedly runs the given task, but the specified delay is measured between the end of the previous task and the start of the next. The execution rate may vary depending on the time it takes to run any given task.

We typically use the `Executors.newScheduledThreadPool()` method to create a `ScheduledThreadPoolExecutor` with a given `corePoolSize`, unbounded `maximumPoolSize` and zero `keepAliveTime`.

Here's how to schedule a task for execution in 500 milliseconds:

```java
ScheduledExecutorService executor = Executors.newScheduledThreadPool(5);
executor.schedule(() -> {
    System.out.println("Hello World");
}, 500, TimeUnit.MILLISECONDS);Copy
```

The following code shows how to run a task after 500 milliseconds delay and then repeat it every 100 milliseconds. After scheduling the task, we wait until it fires three times using the `CountDownLatch` lock. Then we cancel it using the `Future.cancel()` method:

```java
CountDownLatch lock = new CountDownLatch(3);

ScheduledExecutorService executor = Executors.newScheduledThreadPool(5);
ScheduledFuture<?> future = executor.scheduleAtFixedRate(() -> {
    System.out.println("Hello World");
    lock.countDown();
}, 500, 100, TimeUnit.MILLISECONDS);

lock.await(1000, TimeUnit.MILLISECONDS);
future.cancel(true);Copy
```

`ScheduledThreadPoolExecutor` 继承自 `ThreadPoolExecutor` 类，同时实现了 `ScheduledExecutorService` 接口，并增加了几个额外方法：

- `schedule` 方法允许我们在指定的延迟之后运行一次任务。
- `scheduleAtFixedRate` 方法允许我们在指定的初始延迟之后运行任务，然后以某个固定周期反复运行它。`period` 参数是任务开始时刻之间的时间间隔，因此执行速率是固定的。
- `scheduleWithFixedDelay` 方法与 `scheduleAtFixedRate` 类似，也是反复运行给定的任务，但指定的延迟是上一次任务结束到下一次任务开始之间的时间间隔。执行速率可能会随着每个任务运行所需时间的不同而变化。

我们通常用 `Executors.newScheduledThreadPool()` 方法来创建 `ScheduledThreadPoolExecutor`，并指定 `corePoolSize`，其 `maximumPoolSize` 无界，`keepAliveTime` 为 0。

下面演示如何把一个任务安排在 500 毫秒后执行：

下面的代码演示了如何在延迟 500 毫秒后运行一个任务，然后每 100 毫秒重复一次。安排完任务后，我们用 `CountDownLatch` 锁等待它触发三次。然后我们用 `Future.cancel()` 方法取消它：

### 3.4. `ForkJoinPool`

### 3.4. ForkJoinPool(fork/join 线程池)

`ForkJoinPool` is the central part of the `fork/join` framework introduced in Java 7. It solves a common problem of spawning multiple tasks in recursive algorithms. We'll run out of threads quickly by using a simple `ThreadPoolExecutor`, as every task or subtask requires its own thread to run.

In a `fork/join` framework, any task can spawn (`fork`) a number of subtasks and wait for their completion using the `join` method. The benefit of the `fork/join` framework is that it does not create a new thread for each task or subtask, instead implementing the work-stealing algorithm. This framework is thoroughly described in our [Guide to the Fork/Join Framework in Java](https://www.baeldung.com/java-fork-join).

Let’s look at a simple example of using `ForkJoinPool` to traverse a tree of nodes and calculate the sum of all leaf values. Here’s a simple implementation of a tree consisting of a node, an `int` value and a set of child nodes:

```java
static class TreeNode {

    int value;

    Set<TreeNode> children;

    TreeNode(int value, TreeNode... children) {
        this.value = value;
        this.children = Sets.newHashSet(children);
    }
}Copy
```

Now if we want to sum all values in a tree in parallel, we need to implement a `RecursiveTask<Integer>` interface. Each task receives its own node and adds its value to the sum of values of its `children`. To calculate the sum of `children` values, task implementation does the following:

- streams the `children` set
- maps over this stream, creating a new `CountingTask` for each element
- runs each subtask by forking it
- collects the results by calling the `join` method on each forked task
- sums the results using the `Collectors.summingInt` collector

```java
public static class CountingTask extends RecursiveTask<Integer> {

    private final TreeNode node;

    public CountingTask(TreeNode node) {
        this.node = node;
    }

    @Override
    protected Integer compute() {
        return node.value + node.children.stream()
          .map(childNode -> new CountingTask(childNode).fork())
          .collect(Collectors.summingInt(ForkJoinTask::join));
    }
}Copy
```

The code to run the calculation on an actual tree is very simple:

```java
TreeNode tree = new TreeNode(5,
  new TreeNode(3), new TreeNode(2,
    new TreeNode(2), new TreeNode(8)));

ForkJoinPool forkJoinPool = ForkJoinPool.commonPool();
int sum = forkJoinPool.invoke(new CountingTask(tree));Copy
```

`ForkJoinPool` 是 Java 7 引入的 `fork/join` 框架的核心部分。它解决了递归算法中创建大量任务这一常见问题。如果使用简单的 `ThreadPoolExecutor`，我们很快就会耗尽线程，因为每个任务或子任务都需要自己的线程来运行。

在 `fork/join` 框架中，任何任务都可以创建(`fork`)若干子任务，并用 `join` 方法等待它们完成。`fork/join` 框架的好处在于，它不会为每个任务或子任务都新建线程，而是实现了工作窃取(work-stealing)算法。我们的 [Guide to the Fork/Join Framework in Java](https://www.baeldung.com/java-fork-join) 一文对这个框架做了详细介绍。

我们来看一个使用 `ForkJoinPool` 遍历节点树并计算所有叶子节点值之和的简单示例。下面是一棵树的简单实现，它由一个节点、一个 `int` 值以及一组子节点组成：

现在，如果我们想并行地对树中所有值求和，就需要实现一个 `RecursiveTask<Integer>` 接口。每个任务接收自己的节点，并把它的值加到所有 `children` 的值之和上。为了计算 `children` 的值之和，任务实现会做以下几件事：

- 把 `children` 集合转为流
- 在这个流上做映射，为每个元素创建一个新的 `CountingTask`
- 通过 fork 来运行每个子任务
- 对每个已 fork 的任务调用 `join` 方法，收集结果
- 使用 `Collectors.summingInt` 收集器对结果求和

在实际的树上运行计算的代码非常简单：

## 4. Thread Pool's Implementation in Guava

## 4. Guava 中的线程池实现

[Guava](https://github.com/google/guava) is a popular Google library of utilities. It has many useful concurrency classes, including several handy implementations of `ExecutorService`. The implementing classes are not accessible for direct instantiation or subclassing, so the only entry point for creating their instances is the `MoreExecutors` helper class.

[Guava](https://github.com/google/guava) 是 Google 一个很流行的工具库。它包含许多有用的并发类，其中包括几个便捷的 `ExecutorService` 实现。这些实现类无法直接实例化，也无法被继承，因此创建它们实例的唯一入口是 `MoreExecutors` 工具类。

### 4.1. Adding Guava as a Maven Dependency

### 4.1. 将 Guava 添加为 Maven 依赖

We add the following dependency to our Maven pom file to include the Guava library to our project. Find the latest version of Guava library in the [Maven Central](https://search.maven.org/classic/#search|gav|1|g%3A"com.google.guava" AND a%3A"guava") Repository:

```java
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>31.0.1-jre</version>
</dependency>Copy
```

我们在 Maven 的 pom 文件中加入下面的依赖，把 Guava 库引入项目。可以在 [Maven Central](https://search.maven.org/classic/#search|gav|1|g%3A"com.google.guava" AND a%3A"guava") 仓库中找到 Guava 库的最新版本：

### 4.2. Direct Executor and Direct Executor Service

### 4.2. Direct Executor 和 Direct Executor Service

Sometimes we want to run the task either in the current thread or in a thread pool, depending on some conditions. We would prefer to use a single `Executor` interface and just switch the implementation. Although it's not so hard to come up with an implementation of `Executor` or `ExecutorService` that runs the tasks in the current thread, this still requires writing some boilerplate code.

Gladly, Guava provides predefined instances for us.

Here's an example that demonstrates the execution of a task in the same thread. Although the provided task sleeps for 500 milliseconds, it blocks the current thread, and the result is available immediately after the `execute` call is finished:

```java
Executor executor = MoreExecutors.directExecutor();

AtomicBoolean executed = new AtomicBoolean();

executor.execute(() -> {
    try {
        Thread.sleep(500);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    executed.set(true);
});

assertTrue(executed.get());Copy
```

The instance returned by the `directExecutor()` method is actually a static singleton, so using this method does not provide any overhead on object creation at all.

We should prefer this method to the `MoreExecutors.newDirectExecutorService()` because that API creates a full-fledged executor service implementation on every call.

有时我们想根据某些条件，决定任务是在当前线程中运行，还是在某个线程池中运行。我们更希望只使用单一的 `Executor` 接口，然后切换实现即可。虽然写一个在当前线程中运行任务的 `Executor` 或 `ExecutorService` 实现并不难，但这仍然需要写一些样板代码。

所幸，Guava 为我们提供了预定义的实例。

下面这个示例演示了在同一个线程中执行任务。虽然提交的任务会休眠 500 毫秒，但它会阻塞当前线程，所以 `execute` 调用一结束结果就立刻可用了：

`directExecutor()` 方法返回的实例实际上是一个静态单例，因此使用这个方法完全不会带来对象创建的开销。

我们应优先使用这个方法，而不是 `MoreExecutors.newDirectExecutorService()`，因为后者每次调用都会创建一个完整的执行器服务实现。

### 4.3. Exiting Executor Services

### 4.3. 可退出的执行器服务(Exiting Executor Services)

Another common problem is shutting down the virtual machine while a thread pool is still running its tasks. Even with a cancellation mechanism in place, there is no guarantee that the tasks will behave nicely and stop their work when the executor service shuts down. This may cause JVM to hang indefinitely while the tasks keep doing their work.

To solve this problem, Guava introduces a family of exiting executor services. They are based on daemon threads that terminate together with the JVM.

These services also add a shutdown hook with the `Runtime.getRuntime().addShutdownHook()` method and prevent the VM from terminating for a configured amount of time before giving up on hung tasks.

In the following example, we're submitting the task that contains an infinite loop, but we use an exiting executor service with a configured time of 100 milliseconds to wait for the tasks upon VM termination.

```java
ThreadPoolExecutor executor = 
  (ThreadPoolExecutor) Executors.newFixedThreadPool(5);
ExecutorService executorService = 
  MoreExecutors.getExitingExecutorService(executor, 
    100, TimeUnit.MILLISECONDS);

executorService.submit(() -> {
    while (true) {
    }
});Copy
```

Without the `exitingExecutorService` in place, this task would cause the VM to hang indefinitely.

另一个常见问题是：在线程池仍在运行任务时关闭虚拟机。即便有取消机制，也无法保证任务会乖乖地在执行器服务关闭时停止工作。这可能导致 JVM 无限期挂起，而任务还在继续干活。

为了解决这个问题，Guava 引入了一系列可退出的执行器服务(exiting executor services)。它们基于守护线程(daemon threads)，会随 JVM 一起终止。

这些服务还会通过 `Runtime.getRuntime().addShutdownHook()` 方法添加一个关闭钩子，并在放弃挂起的任务之前，让 VM 在一段可配置的时间内不终止。

在下面的示例中，我们提交了一个包含无限循环的任务，但使用了一个可退出的执行器服务，并把 VM 终止时等待任务的时间配置为 100 毫秒：

如果没有这个 `exitingExecutorService`，这个任务会导致 VM 无限期挂起。

### 4.4. Listening Decorators

### 4.4. 监听装饰器(Listening Decorators)

Listening decorators allow us to wrap the `ExecutorService` and receive `ListenableFuture` instances upon task submission instead of simple `Future` instances. The `ListenableFuture` interface extends `Future` and has a single additional method `addListener`. This method allows adding a listener that is called upon future completion.

We'll rarely want to use `ListenableFuture.addListener()` method directly. But it is essential to most of the helper methods in the `Futures` utility class.

For instance, with the `Futures.allAsList()` method, we can combine several `ListenableFuture` instances in a single `ListenableFuture` that completes upon the successful completion of all the futures combined:

```java
ExecutorService executorService = Executors.newCachedThreadPool();
ListeningExecutorService listeningExecutorService = 
  MoreExecutors.listeningDecorator(executorService);

ListenableFuture<String> future1 = 
  listeningExecutorService.submit(() -> "Hello");
ListenableFuture<String> future2 = 
  listeningExecutorService.submit(() -> "World");

String greeting = Futures.allAsList(future1, future2).get()
  .stream()
  .collect(Collectors.joining(" "));
assertEquals("Hello World", greeting);Copy
```

监听装饰器允许我们包装 `ExecutorService`，并在提交任务时收到 `ListenableFuture` 实例，而不是简单的 `Future` 实例。`ListenableFuture` 接口继承自 `Future`，并增加了一个额外方法 `addListener`。这个方法允许添加一个监听器，在 future 完成时被调用。

我们很少会想直接使用 `ListenableFuture.addListener()` 方法。但它对 `Futures` 工具类中的大多数辅助方法来说是不可或缺的。

例如，使用 `Futures.allAsList()` 方法，我们可以把多个 `ListenableFuture` 实例合并成一个 `ListenableFuture`，它在所有被合并的 future 都成功完成时完成：

## 5. Conclusion

In this article, we discussed the Thread Pool pattern and its implementations in the standard Java library and in Google's Guava library.

The source code for the article is available [over on GitHub](https://github.com/eugenp/tutorials/tree/master/core-java-modules/core-java-concurrency-advanced).

## 5. 结论

在本文中，我们讨论了线程池模式，以及它在标准 Java 库和 Google Guava 库中的实现。

本文的源代码可以在 [over on GitHub](https://github.com/eugenp/tutorials/tree/master/core-java-modules/core-java-concurrency-advanced) 上找到。




- 原文链接: https://www.baeldung.com/thread-pool-java-and-guava
