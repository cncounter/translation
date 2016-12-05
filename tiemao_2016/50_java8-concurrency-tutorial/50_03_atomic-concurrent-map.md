# Java 8 Concurrency Tutorial: Atomic Variables and ConcurrentMap

<span class="post-date">May 22, 2015</span>  
<span class="share-count-total"></span>

<div class="post">

Welcome to the third part of my tutorial series about multi-threaded programming in Java 8\. This tutorial covers two important parts of the Concurrency API: Atomic Variables and Concurrent Maps. Both have been greatly improved with the introduction of lambda expressions and functional programming in the latest Java 8 release. All those new features are described with a bunch of easily understood code samples. Enjoy!

*   Part 1: [Threads and Executors](/posts/2015/04/07/java8-concurrency-tutorial-thread-executor-examples/)
*   Part 2: [Synchronization and Locks](/posts/2015/04/30/java8-concurrency-tutorial-synchronized-locks-examples/)
*   Part 3: Atomic Variables and ConcurrentMap

For simplicity the code samples of this tutorial make use of the two helper methods `sleep(seconds)` and `stop(executor)` as defined [here](https://github.com/winterbe/java8-tutorial/blob/master/src/com/winterbe/java8/samples/concurrent/ConcurrentUtils.java).

### AtomicInteger

The package `java.concurrent.atomic` contains many useful classes to perform atomic operations. An operation is atomic when you can safely perform the operation in parallel on multiple threads without using the `synchronized` keyword or locks as shown in my [previous tutorial](/posts/2015/04/30/java8-concurrency-tutorial-synchronized-locks-examples/).

Internally, the atomic classes make heavy use of [compare-and-swap](http://en.wikipedia.org/wiki/Compare-and-swap) (CAS), an atomic instruction directly supported by most modern CPUs. Those instructions usually are much faster than synchronizing via locks. So my advice is to prefer atomic classes over locks in case you just have to change a single mutable variable concurrently.

Now let's pick one of the atomic classes for a few examples: `AtomicInteger`

<div class="highlight">

    AtomicInteger atomicInt = new AtomicInteger(0);

    ExecutorService executor = Executors.newFixedThreadPool(2);

    IntStream.range(0, 1000)
        .forEach(i -> executor.submit(atomicInt::incrementAndGet));

    stop(executor);

    System.out.println(atomicInt.get());    // => 1000

</div>

By using `AtomicInteger` as a replacement for `Integer` we're able to increment the number concurrently in a thread-safe manor without synchronizing the access to the variable. The method `incrementAndGet()` is an atomic operation so we can safely call this method from multiple threads.

AtomicInteger supports various kinds of atomic operations. The method `updateAndGet()` accepts a lambda expression in order to perform arbitrary arithmetic operations upon the integer:

<div class="highlight">

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

</div>

The method `accumulateAndGet()` accepts another kind of lambda expression of type `IntBinaryOperator`. We use this method to sum up all values from 0 to 1000 concurrently in the next sample:

<div class="highlight">

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

</div>

Other useful atomic classes are [AtomicBoolean](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/AtomicBoolean.html), [AtomicLong](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/AtomicLong.html) and [AtomicReference](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/AtomicReference.html).

### LongAdder

The class `LongAdder` as an alternative to `AtomicLong` can be used to consecutively add values to a number.

<div class="highlight">

    ExecutorService executor = Executors.newFixedThreadPool(2);

    IntStream.range(0, 1000)
        .forEach(i -> executor.submit(adder::increment));

    stop(executor);

    System.out.println(adder.sumThenReset());   // => 1000

</div>

LongAdder provides methods `add()` and `increment()` just like the atomic number classes and is also thread-safe. But instead of summing up a single result this class maintains a set of variables internally to reduce contention over threads. The actual result can be retrieved by calling `sum()` or `sumThenReset()`.

This class is usually preferable over atomic numbers when updates from multiple threads are more common than reads. This is often the case when capturing statistical data, e.g. you want to count the number of requests served on a web server. The drawback of `LongAdder` is higher memory consumption because a set of variables is held in-memory.

### LongAccumulator

LongAccumulator is a more generalized version of LongAdder. Instead of performing simple add operations the class `LongAccumulator` builds around a lambda expression of type `LongBinaryOperator` as demonstrated in this code sample:

<div class="highlight">

    LongBinaryOperator op = (x, y) -> 2 * x + y;
    LongAccumulator accumulator = new LongAccumulator(op, 1L);

    ExecutorService executor = Executors.newFixedThreadPool(2);

    IntStream.range(0, 10)
        .forEach(i -> executor.submit(() -> accumulator.accumulate(i)));

    stop(executor);

    System.out.println(accumulator.getThenReset());     // => 2539

</div>

We create a LongAccumulator with the function `2 * x + y` and an initial value of one. With every call to `accumulate(i)` both the current result and the value `i` are passed as parameters to the lambda expression.

A `LongAccumulator` just like `LongAdder` maintains a set of variables internally to reduce contention over threads.

### ConcurrentMap

The interface `ConcurrentMap` extends the map interface and defines one of the most useful concurrent collection types. Java 8 introduces functional programming by adding new methods to this interface.

In the next code snippets we use the following sample map to demonstrates those new methods:

<div class="highlight">

    ConcurrentMap<String, String> map = new ConcurrentHashMap<>();
    map.put("foo", "bar");
    map.put("han", "solo");
    map.put("r2", "d2");
    map.put("c3", "p0");

</div>

The method `forEach()` accepts a lambda expression of type `BiConsumer` with both the key and value of the map passed as parameters. It can be used as a replacement to for-each loops to iterate over the entries of the concurrent map. The iteration is performed sequentially on the current thread.

<div class="highlight">

    map.forEach((key, value) -> System.out.printf("%s = %s\n", key, value));

</div>

The method `putIfAbsent()` puts a new value into the map only if no value exists for the given key. At least for the `ConcurrentHashMap` implementation of this method is thread-safe just like `put()` so you don't have to synchronize when accessing the map concurrently from different threads:

<div class="highlight">

    String value = map.putIfAbsent("c3", "p1");
    System.out.println(value);    // p0

</div>

The method `getOrDefault()` returns the value for the given key. In case no entry exists for this key the passed default value is returned:

<div class="highlight">

    String value = map.getOrDefault("hi", "there");
    System.out.println(value);    // there

</div>

The method `replaceAll()` accepts a lambda expression of type `BiFunction`. BiFunctions take two parameters and return a single value. In this case the function is called with the key and the value of each map entry and returns a new value to be assigned for the current key:

<div class="highlight">

    map.replaceAll((key, value) -> "r2".equals(key) ? "d3" : value);
    System.out.println(map.get("r2"));    // d3

</div>

Instead of replacing all values of the map `compute()` let's us transform a single entry. The method accepts both the key to be computed and a bi-function to specify the transformation of the value.

<div class="highlight">

    map.compute("foo", (key, value) -> value + value);
    System.out.println(map.get("foo"));   // barbar

</div>

In addition to `compute()` two variants exist: `computeIfAbsent()` and `computeIfPresent()`. The functional parameters of these methods only get called if the key is absent or present respectively.

Finally, the method `merge()` can be utilized to unify a new value with an existing value in the map. Merge accepts a key, the new value to be merged into the existing entry and a bi-function to specify the merging behavior of both values:

<div class="highlight">

    map.merge("foo", "boo", (oldVal, newVal) -> newVal + " was " + oldVal);
    System.out.println(map.get("foo"));   // boo was foo

</div>

### ConcurrentHashMap

All those methods above are part of the `ConcurrentMap` interface, thereby available to all implementations of that interface. In addition the most important implementation `ConcurrentHashMap` has been further enhanced with a couple of new methods to perform parallel operations upon the map.

Just like parallel streams those methods use a special `ForkJoinPool` available via `ForkJoinPool.commonPool()` in Java 8\. This pool uses a preset parallelism which depends on the number of available cores. Four CPU cores are available on my machine which results in a parallelism of three:

<div class="highlight">

    System.out.println(ForkJoinPool.getCommonPoolParallelism());  // 3

</div>

This value can be decreased or increased by setting the following JVM parameter:

<div class="highlight">

    -Djava.util.concurrent.ForkJoinPool.common.parallelism=5

</div>

We use the same example map for demonstrating purposes but this time we work upon the concrete implementation `ConcurrentHashMap` instead of the interface `ConcurrentMap`, so we can access all public methods from this class:

<div class="highlight">

    ConcurrentHashMap<String, String> map = new ConcurrentHashMap<>();
    map.put("foo", "bar");
    map.put("han", "solo");
    map.put("r2", "d2");
    map.put("c3", "p0");

</div>

Java 8 introduces three kinds of parallel operations: `forEach`, `search` and `reduce`. Each of those operations are available in four forms accepting functions with keys, values, entries and key-value pair arguments.

All of those methods use a common first argument called `parallelismThreshold`. This threshold indicates the minimum collection size when the operation should be executed in parallel. E.g. if you pass a threshold of 500 and the actual size of the map is 499 the operation will be performed sequentially on a single thread. In the next examples we use a threshold of one to always force parallel execution for demonstrating purposes.

#### ForEach

The method `forEach()` is capable of iterating over the key-value pairs of the map in parallel. The lambda expression of type `BiConsumer` is called with the key and value of the current iteration step. In order to visualize parallel execution we print the current threads name to the console. Keep in mind that in my case the underlying `ForkJoinPool` uses up to a maximum of three threads.

<div class="highlight">

    map.forEach(1, (key, value) ->
        System.out.printf("key: %s; value: %s; thread: %s\n",
            key, value, Thread.currentThread().getName()));

    // key: r2; value: d2; thread: main
    // key: foo; value: bar; thread: ForkJoinPool.commonPool-worker-1
    // key: han; value: solo; thread: ForkJoinPool.commonPool-worker-2
    // key: c3; value: p0; thread: main

</div>

#### Search

The method `search()` accepts a `BiFunction` returning a non-null search result for the current key-value pair or `null` if the current iteration doesn't match the desired search criteria. As soon as a non-null result is returned further processing is suppressed. Keep in mind that `ConcurrentHashMap` is unordered. The search function should not depend on the actual processing order of the map. If multiple entries of the map match the given search function the result may be non-deterministic.

<div class="highlight">

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

</div>

Here's another example searching solely on the values of the map:

<div class="highlight">

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

</div>

#### Reduce

The method `reduce()` already known from Java 8 Streams accepts two lambda expressions of type `BiFunction`. The first function transforms each key-value pair into a single value of any type. The second function combines all those transformed values into a single result, ignoring any possible `null` values.

<div class="highlight">

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

</div>

I hope you've enjoyed reading the third part of my tutorial series about Java 8 Concurrency. The code samples from this tutorial are [hosted on GitHub](https://github.com/winterbe/java8-tutorial) along with many other Java 8 code snippets. You're welcome to fork the repo and try it by your own.

If you want to support my work, please share this tutorial with your friends. You should also [follow me on Twitter](https://twitter.com/winterbe_) as I constantly tweet about Java and programming related stuff.

*   Part 1: [Threads and Executors](/posts/2015/04/07/java8-concurrency-tutorial-thread-executor-examples/)
*   Part 2: [Synchronization and Locks](/posts/2015/04/30/java8-concurrency-tutorial-synchronized-locks-examples/)
*   Part 3: Atomic Variables and ConcurrentMap

</div>

<div class="social-share"><iframe allowtransparency="true" scrolling="no" frameborder="0" src="https://buttons.github.io/buttons.html#href=https%3A%2F%2Fgithub.com%2Fwinterbe&amp;text=Follow%20%40winterbe&amp;data-count-api=&amp;data-count-href=&amp;data-count-aria-label=&amp;data-style=mega&amp;data-icon=&amp;aria-label=Follow%20%40winterbe%20on%20GitHub" style="width: 140px; height: 28px; border: none;"></iframe><iframe id="twitter-widget-0" scrolling="no" frameborder="0" allowtransparency="true" class="twitter-follow-button twitter-follow-button-rendered" title="Twitter Follow Button" src="http://platform.twitter.com/widgets/follow_button.f7908d4abf5ce27173c69bdbb93aedb6.en.html#dnt=true&amp;id=twitter-widget-0&amp;lang=en&amp;screen_name=winterbe_&amp;show_count=false&amp;show_screen_name=true&amp;size=l&amp;time=1480908486304" style="position: static; visibility: visible; width: 150px; height: 28px;" data-screen-name="winterbe_"></iframe><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script> <iframe id="twitter-widget-1" scrolling="no" frameborder="0" allowtransparency="true" class="twitter-share-button twitter-share-button-rendered twitter-tweet-button" title="Twitter Tweet Button" src="http://platform.twitter.com/widgets/tweet_button.f7908d4abf5ce27173c69bdbb93aedb6.en.html#dnt=true&amp;id=twitter-widget-1&amp;lang=en&amp;original_referer=http%3A%2F%2Fwinterbe.com%2Fposts%2F2015%2F05%2F22%2Fjava8-concurrency-tutorial-atomic-concurrent-map-examples%2F&amp;size=l&amp;text=Java%208%20Concurrency%20Tutorial%3A%20Atomic%20Variables%20and%20ConcurrentMap%20-%20Benjamin%20Winterberg&amp;time=1480908486306&amp;type=share&amp;url=http%3A%2F%2Fwinterbe.com%2Fposts%2F2015%2F05%2F22%2Fjava8-concurrency-tutorial-atomic-concurrent-map-examples%2F&amp;via=winterbe_" style="position: static; visibility: visible; width: 75px; height: 28px;"></iframe><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script></div>

<section class="author">Benjamin is Software Engineer, Full Stack Developer at [Pondus](http://pondus.de/en/homepage/), an excited runner and table foosball player. Get in touch on [Twitter](https://twitter.com/winterbe_), [Google+](https://plus.google.com/105973259367211176218/posts) and [GitHub](https://github.com/winterbe).</section>

### Read More

*   [Recent](#)
*   [All Posts](/blog/)
*   [Java](/java/)
*   [JavaScript](/javascript/)
*   [Tutorials](/tutorials/)

*   [Recent](#)
*   [All Posts](/blog/)
*   [Java](/java/)
*   [Tutorials](/tutorials/)

*   [

    # Integrating React.js into Existing jQuery Web Applications

    ](/posts/2015/08/24/integrate-reactjs-into-jquery-webapps/)
*   [

    # Java 8 Concurrency Tutorial: Synchronization and Locks

    ](/posts/2015/04/30/java8-concurrency-tutorial-synchronized-locks-examples/)
*   [

    # Java 8 Concurrency Tutorial: Threads and Executors

    ](/posts/2015/04/07/java8-concurrency-tutorial-thread-executor-examples/)
*   [

    # Java 8 API by Example: Strings, Numbers, Math and Files

    ](/posts/2015/03/25/java8-examples-string-number-math-files/)


原文链接: [http://winterbe.com/posts/2015/05/22/java8-concurrency-tutorial-atomic-concurrent-map-examples/](http://winterbe.com/posts/2015/05/22/java8-concurrency-tutorial-atomic-concurrent-map-examples/)

