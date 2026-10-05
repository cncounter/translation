# Java 8 并发教程：原子变量与 ConcurrentMap

> 原文: Java 8 Concurrency Tutorial: Atomic Variables and ConcurrentMap

2015年5月22日

欢迎阅读我的 Java 8 多线程编程教程系列第三部分。本教程涵盖并发 API 的两个重要部分：原子变量(Atomic Variables)和并发 Map(Concurrent Maps)。随着最新 Java 8 版本引入 lambda 表达式和函数式编程，这两者都得到了极大的改进。所有这些新特性都通过一系列易于理解的代码示例来讲解。祝你阅读愉快！


*   第 1 部分：[线程与执行器](50_01_thread-executor.md)
*   第 2 部分：[同步与锁](50_02_synchronized-locks.md)
*   第 3 部分：[原子变量与 ConcurrentMap](50_03_atomic-concurrent-map.md)


为简单起见，本教程的代码示例使用了两个辅助方法 `sleep(seconds)` 和 `stop(executor)`，它们的定义见[这里](https://github.com/winterbe/java8-tutorial/blob/master/src/com/winterbe/java8/samples/concurrent/ConcurrentUtils.java)。

### AtomicInteger

`java.concurrent.atomic` 包中包含许多用于执行原子操作的有用类。当你可以安全地在多个线程上并行执行某个操作，而无需像我在[上一篇教程](http://winterbe.com/posts/2015/04/30/java8-concurrency-tutorial-synchronized-locks-examples/)中展示的那样使用 `synchronized` 关键字或锁时，这个操作就是原子的。

在内部，原子类大量使用了[比较并交换](http://en.wikipedia.org/wiki/Compare-and-swap)(CAS)，这是大多数现代 CPU 直接支持的一种原子指令。这类指令通常比通过锁进行同步要快得多。所以我的建议是：如果你只需要并发地修改单个可变变量，那么优先使用原子类而不是锁。

现在让我们挑一个原子类来举几个例子：`AtomicInteger`

    AtomicInteger atomicInt = new AtomicInteger(0);

    ExecutorService executor = Executors.newFixedThreadPool(2);

    IntStream.range(0, 1000)
        .forEach(i -> executor.submit(atomicInt::incrementAndGet));

    stop(executor);

    System.out.println(atomicInt.get());    // => 1000

通过用 `AtomicInteger` 替代 `Integer`，我们能够以线程安全的方式并发地自增这个数字，而无需同步对该变量的访问。`incrementAndGet()` 方法是一个原子操作，因此我们可以安全地从多个线程调用它。

AtomicInteger 支持多种原子操作。`updateAndGet()` 方法接受一个 lambda 表达式，以便对该整数执行任意的算术运算：

    AtomicInteger atomicInt = new AtomicInteger(0);

    ExecutorService executor = Executors.newFixedThreadPool(2);

    IntStream.range(0, 1000)
        .forEach(i -> {
            Runnable task = () ->
                atomicInt.updateAndGet(n -> n + 2);
            executor.submit(task);
        });

    stop(executor);

    System.out.println(atomicInt.get());    // => 2000

`accumulateAndGet()` 方法接受另一种类型为 `IntBinaryOperator` 的 lambda 表达式。在下一个示例中，我们用这个方法来并发地对 0 到 1000 的所有值求和：

    AtomicInteger atomicInt = new AtomicInteger(0);

    ExecutorService executor = Executors.newFixedThreadPool(2);

    IntStream.range(0, 1000)
        .forEach(i -> {
            Runnable task = () ->
                atomicInt.accumulateAndGet(i, (n, m) -> n + m);
            executor.submit(task);
        });

    stop(executor);

    System.out.println(atomicInt.get());    // => 499500

其他有用的原子类还有 [AtomicBoolean](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/AtomicBoolean.html)、[AtomicLong](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/AtomicLong.html) 和 [AtomicReference](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/AtomicReference.html)。

### LongAdder

`LongAdder` 类作为 `AtomicLong` 的替代方案，可用于连续地向一个数字累加值。

    ExecutorService executor = Executors.newFixedThreadPool(2);

    IntStream.range(0, 1000)
        .forEach(i -> executor.submit(adder::increment));

    stop(executor);

    System.out.println(adder.sumThenReset());   // => 1000

LongAdder 和原子数字类一样提供了 `add()` 和 `increment()` 方法，并且也是线程安全的。但它不是汇总成单个结果，而是在内部维护一组变量，以减少线程之间的竞争。可以调用 `sum()` 或 `sumThenReset()` 获取实际结果。

当来自多个线程的更新比读取更频繁时，通常更适合使用这个类而不是原子数字类。捕获统计数据时往往就是这种情况，例如你想统计 Web 服务器处理的请求数量。`LongAdder` 的缺点是内存消耗更高，因为它会在内存中保存一组变量。

### LongAccumulator

LongAccumulator 是 LongAdder 的更通用的版本。`LongAccumulator` 类不是执行简单的加法操作，而是围绕一个类型为 `LongBinaryOperator` 的 lambda 表达式构建，如下面的代码示例所示：

    LongBinaryOperator op = (x, y) -> 2 * x + y;
    LongAccumulator accumulator = new LongAccumulator(op, 1L);

    ExecutorService executor = Executors.newFixedThreadPool(2);

    IntStream.range(0, 10)
        .forEach(i -> executor.submit(() -> accumulator.accumulate(i)));

    stop(executor);

    System.out.println(accumulator.getThenReset());     // => 2539

我们用一个函数 `2 * x + y` 和一个初始值 1 创建了一个 LongAccumulator。每次调用 `accumulate(i)` 时，当前结果和值 `i` 都会作为参数传给该 lambda 表达式。

`LongAccumulator` 和 `LongAdder` 一样，会在内部维护一组变量，以减少线程之间的竞争。

### ConcurrentMap

`ConcurrentMap` 接口扩展了 map 接口，定义了最有用的并发集合类型之一。Java 8 通过向该接口添加新方法引入了函数式编程。

在接下来的代码片段中，我们使用下面这个示例 map 来演示这些新方法：

    ConcurrentMap<String, String> map = new ConcurrentHashMap<>();
    map.put("foo", "bar");
    map.put("han", "solo");
    map.put("r2", "d2");
    map.put("c3", "p0");

`forEach()` 方法接受一个类型为 `BiConsumer` 的 lambda 表达式，map 的键和值都会作为参数传入。它可以用作 for-each 循环的替代方案，用来遍历并发 map 的各个条目。该遍历在当前线程上顺序执行。

    map.forEach((key, value) -> System.out.printf("%s = %s\n", key, value));

`putIfAbsent()` 方法仅当给定的键尚不存在对应值时才把新值放入 map。至少对于 `ConcurrentHashMap` 的实现而言，这个方法和 `put()` 一样是线程安全的，因此从不同线程并发访问 map 时你无需进行同步：

    String value = map.putIfAbsent("c3", "p1");
    System.out.println(value);    // p0

`getOrDefault()` 方法返回给定键对应的值。如果该键不存在任何条目，则返回传入的默认值：

    String value = map.getOrDefault("hi", "there");
    System.out.println(value);    // there

`replaceAll()` 方法接受一个类型为 `BiFunction` 的 lambda 表达式。BiFunction 接受两个参数并返回单个值。在这个例子中，该函数会以每个 map 条目的键和值作为参数被调用，并返回一个要赋给当前键的新值：

    map.replaceAll((key, value) -> "r2".equals(key) ? "d3" : value);
    System.out.println(map.get("r2"));    // d3

`compute()` 让我们能够转换单个条目，而不是替换 map 中的所有值。该方法接受要计算的键，以及一个用于指定值转换方式的 bi-function。

    map.compute("foo", (key, value) -> value + value);
    System.out.println(map.get("foo"));   // barbar

除了 `compute()` 之外，还提供了两个变体：`computeIfAbsent()` 和 `computeIfPresent()`。这些方法的函数式参数仅在键不存在或存在时才会被调用（分别对应）。

最后，`merge()` 方法可用于把一个新值与 map 中已有的值合并。merge 接受一个键、要合并到已有条目的新值，以及一个用于指定两个值合并方式的 bi-function：

    map.merge("foo", "boo", (oldVal, newVal) -> newVal + " was " + oldVal);
    System.out.println(map.get("foo"));   // boo was foo

### ConcurrentHashMap

上面所有这些方法都属于 `ConcurrentMap` 接口，因此对该接口的所有实现都可用。此外，最重要的实现 `ConcurrentHashMap` 还通过若干新方法进一步增强，以便对 map 执行并行操作。

和并行流一样，这些方法使用一个特殊的 `ForkJoinPool`，在 Java 8 中可通过 `ForkJoinPool.commonPool()` 获取。这个池使用一个预设的并行度，具体取决于可用的核心数。我的机器上有四个 CPU 核心，因此并行度为三：

    System.out.println(ForkJoinPool.getCommonPoolParallelism());  // 3

可以通过设置以下 JVM 参数来降低或提高这个值：

    -Djava.util.concurrent.ForkJoinPool.common.parallelism=5

出于演示目的，我们使用同一个示例 map，但这次我们操作的是具体实现 `ConcurrentHashMap` 而不是接口 `ConcurrentMap`，这样就能访问这个类的所有 public 方法：

    ConcurrentHashMap<String, String> map = new ConcurrentHashMap<>();
    map.put("foo", "bar");
    map.put("han", "solo");
    map.put("r2", "d2");
    map.put("c3", "p0");

Java 8 引入了三种并行操作：`forEach`、`search` 和 `reduce`。每种操作都有四种形式，分别接受以键、值、条目和键值对为参数的函数。

所有这些方法都使用一个共同的第一个参数，称为 `parallelismThreshold`。这个阈值表示操作应以并行方式执行时的最小集合大小。例如，如果你传入阈值 500，而 map 的实际大小是 499，那么操作将在单个线程上顺序执行。在接下来的示例中，出于演示目的，我们使用阈值 1 来始终强制并行执行。

#### ForEach

`forEach()` 方法能够并行遍历 map 的键值对。类型为 `BiConsumer` 的 lambda 表达式会以当前迭代步骤的键和值作为参数被调用。为了直观展示并行执行，我们把当前线程名打印到控制台。请记住，在我的机器上，底层的 `ForkJoinPool` 最多使用三个线程。

    map.forEach(1, (key, value) ->
        System.out.printf("key: %s; value: %s; thread: %s\n",
            key, value, Thread.currentThread().getName()));

    // key: r2; value: d2; thread: main
    // key: foo; value: bar; thread: ForkJoinPool.commonPool-worker-1
    // key: han; value: solo; thread: ForkJoinPool.commonPool-worker-2
    // key: c3; value: p0; thread: main

#### Search

`search()` 方法接受一个 `BiFunction`，它为当前键值对返回一个非 null 的搜索结果，或者在当前迭代不匹配所需搜索条件时返回 `null`。一旦返回了非 null 结果，后续处理就会被抑制。请记住，`ConcurrentHashMap` 是无序的。搜索函数不应依赖 map 的实际处理顺序。如果 map 中有多个条目匹配给定的搜索函数，结果可能是不确定的。

    String result = map.search(1, (key, value) -> {
        System.out.println(Thread.currentThread().getName());
        if ("foo".equals(key)) {
            return value;
        }
        return null;
    });
    System.out.println("Result: " + result);

    // ForkJoinPool.commonPool-worker-2
    // main
    // ForkJoinPool.commonPool-worker-3
    // Result: bar

下面是另一个示例，仅根据 map 的值进行搜索：

    String result = map.searchValues(1, value -> {
        System.out.println(Thread.currentThread().getName());
        if (value.length() > 3) {
            return value;
        }
        return null;
    });

    System.out.println("Result: " + result);

    // ForkJoinPool.commonPool-worker-2
    // main
    // main
    // ForkJoinPool.commonPool-worker-1
    // Result: solo

#### Reduce

`reduce()` 方法在 Java 8 的流中已经为人熟知，它接受两个类型为 `BiFunction` 的 lambda 表达式。第一个函数把每个键值对转换为任意类型的单个值。第二个函数把所有这些转换后的值合并成单个结果，并忽略任何可能为 `null` 的值。

    String result = map.reduce(1,
        (key, value) -> {
            System.out.println("Transform: " + Thread.currentThread().getName());
            return key + "=" + value;
        },
        (s1, s2) -> {
            System.out.println("Reduce: " + Thread.currentThread().getName());
            return s1 + ", " + s2;
        });

    System.out.println("Result: " + result);

    // Transform: ForkJoinPool.commonPool-worker-2
    // Transform: main
    // Transform: ForkJoinPool.commonPool-worker-3
    // Reduce: ForkJoinPool.commonPool-worker-3
    // Transform: main
    // Reduce: main
    // Reduce: main
    // Result: r2=d2, c3=p0, han=solo, foo=bar

希望你喜欢阅读我的 Java 8 并发教程系列第三部分。本教程的代码示例与许多其他 Java 8 代码片段一起[托管在 GitHub 上](https://github.com/winterbe/java8-tutorial)。欢迎 fork 这个仓库并亲自尝试。

如果你想支持我的工作，请把这个教程分享给你的朋友。你也可以[在 Twitter 上关注我](https://twitter.com/winterbe_)，因为我会经常发布与 Java 和编程相关的内容。


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
*   [# Java 8 Concurrency Tutorial: Synchronization and Locks](http://winterbe.com/posts/2015/04/30/java8-concurrency-tutorial-synchronized-locks-examples/)
*   [# Java 8 Concurrency Tutorial: Threads and Executors](http://winterbe.com/posts/2015/04/07/java8-concurrency-tutorial-thread-executor-examples/)
*   [# Java 8 API by Example: Strings, Numbers, Math and Files](http://winterbe.com/posts/2015/03/25/java8-examples-string-number-math-files/)

原文链接: [http://winterbe.com/posts/2015/05/22/java8-concurrency-tutorial-atomic-concurrent-map-examples/](http://winterbe.com/posts/2015/05/22/java8-concurrency-tutorial-atomic-concurrent-map-examples/)
