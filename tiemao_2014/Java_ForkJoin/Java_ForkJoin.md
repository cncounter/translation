# Java框架ForkJoin入门简介



## Introduction

These notes describe the bare basics of the Java ForkJoin Framework (JSR-166) for students new to parallel programming. This material is only enough to code up basic parallel maps and reductions for pedagogical purposes. The focus is on the few classes and methods you need to get started. Separate lecture notes and a programming project give much more detail on benefits of the library, how to approach programming with it, asymptotic guarantees, etc.

We focus on using Java's library, not on how it is implemented. Libraries/languages with similar facilities exist for other environments including Cilk and Intel's Thread Building Blocks (TBB) for C/C++ and the Task Parallel Library for C#.

We will first describe what Java version you need. We will then describe the 3 or 4 classes you will need to write basic divide-and-conquer parallel algorithms manually. We will present a full working program that you can use as a template. We will mention a few complications in case you stumble into them. Finally, we will discuss best practices for timing how long a computation takes and reasons why a sequential version might appear faster.

## Java Versions

We do not describe here how to determine what version of Java you are using, but that is clearly an important consideration. You probably have Java 8 (or later), in which case there is nothing more you need to do.

Java 8 (or higher):

The ForkJoin Framework is part of Java 8's standard libraries, and most of the rest of this file assumes you have (any version of) Java 8. If you do not, keep reading.

Java 7:

The ForkJoin Framework is part of Java 7's standard libraries, but the `ForkJoinPool` class does not have the `commonPool` method that we advocate using, so you will need to create your own `ForkJoinPool` object as described in Getting Started, below.

Java 6:

If you need to use Java 6 for some reason, you can still use the ForkJoin Framework, but you must download it explicitly and use some strange arguments as described in detail below.

You need a copy of `jsr166.jar`. Newer versions are released occasionally and posted at http://gee.cs.oswego.edu/dl/jsr166/dist/jsr166.jar. To create an Eclipse project that uses the library, you can follow the steps below in order. There are alternatives for some of these steps (e.g., you could put the `.jar` file in a different directory), but these should work.

1. Outside of Eclipse, make a new directory (folder) and put `jsr166.jar` and other relevant Java code in it. Make sure it is called `jsr166.jar`, renaming the file if your web browser somehow changed the name when downloading it.
2. In Eclipse, create a new Java project. Choose "Create project from existing source" and choose the directory you created in the previous step.
3. In the project, choose Project → Properties from the menu. Under "Java Compiler" check "Enable project specific settings" and make sure the choice is Java 1.6 (earlier versions will not work).
4. In the list of files in the package viewer (over on the left), right-click on `jsr166.jar` and choose "Add to Build Path."
5. Make a new class for your project. Define a `main` method you can run.
6. Under Run → Configurations, create a new configuration. Under Arguments, you are used to putting program arguments in the top and that is as usual. But also under "VM arguments" on the bottom you need to enter: `-Xbootclasspath/p:jsr166.jar` exactly like that.

If you instead run `javac` and `java` from a command-line, you need `jsr166.jar` to be in your build path when you compile and you need `-Xbootclasspath/p:jsr166.jar` as an option when you run `javac` and when you run `java`.

Java 5 and earlier:

The ForkJoin Framework is not available for Java 5 and earlier.

## Documentation

As the ForkJoin Framework is standard in Java 8 and Java 7, you can view the javadoc documentation for all the classes in the [standard places](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/package-summary.html), though the documentation has much more information than beginners need. The classes are in the package `java.util.concurrent` and methods are often defined (and therefore documented) in superclasses of the classes you are using.

For cutting-edge documentation and potential upcoming changes, the main web site for JSR-166 is http://gee.cs.oswego.edu/dl/concurrency-interest/index.html. It has much more information than beginners need, which is why we have distilled the basics into these notes. If you need the javadoc for the cutting-edge versions, see http://gee.cs.oswego.edu/dl/jsr166/dist/jsr166ydocs/.

## Getting Started

For learning about basic parallel operations, there are only 2-4 classes you need to know about:

1. `ForkJoinPool`: An instance of this class is used to run all your fork-join tasks in the whole program.
2. `RecursiveTask<V>`: You run a subclass of this in a pool and have it return a result; see the examples below.
3. `RecursiveAction`: just like `RecursiveTask` except it does not return a result
4. `ForkJoinTask<V>`: superclass of `RecursiveTask<V>` and `RecursiveAction`. `fork` and `join` are methods defined in this class. You won't use this class directly, but it is the class with most of the useful javadoc documentation, in case you want to learn about additional methods.

All the classes are in the package `java.util.concurrent`, so it is natural to have import statements like this:

```
  import java.util.concurrent.ForkJoinPool;
  import java.util.concurrent.RecursiveTask;
```

To use the library, you need a `ForkJoinPool` object. In Java 8, get the object you want by calling the static method `ForkJoinPool.commonPool()`. In Java 7 or 6 only, you need to create a pool via `new ForkJoinPool()`, but do this only once and store the result in a static field of some class, so your whole program can use it:

```
  public static ForkJoinPool fjPool = new ForkJoinPool();
```

(This constructor encourages the pool to use all the available processors, which is a good choice. In Java 8, the common-pool object does this too.) You do not want to have more than one `ForkJoinPool` object in your program — the library supports it for advanced uses but discourages even experts from doing it.

It is the job of the pool to take all the tasks that can be done in parallel and actually use the available processors effectively.

## A Useless Example

To use the pool you create a subclass of `RecursiveTask<V>` for some type `V` (or you create a subclass of `RecursiveAction`). In your subclass, you override the `compute()` method. Then you call the `invoke` method on the `ForkJoinPool` passing an object of type `RecursiveTask<V>`. Here is a dumb example:

```
// define your class
class Incrementor extends RecursiveTask<Integer> {
   int theNumber;
   Incrementor(int x) {
     theNumber = x;
   }
   public Integer compute() {
     return theNumber + 1;
   }
}
// then in some method in your program use the global pool we made above:
int fortyThree = ForkJoinPool.commonPool().invoke(new Incrementor(42));
```

The reason this example is dumb is there is no parallelism. We just hand an object over to the pool, the pool uses some processor to run the `compute` method, and then we get the answer back. We could just as well have done:

```
   int fortyThree = (new Incrementor(42)).compute();
```

Nonetheless, this dumb example shows one nice thing: the idiom for passing data to the `compute()` method is to pass it to the constructor and then store it into a field. Because you are overriding the `compute` method, it must\ take zero arguments and return `Integer` (or whatever type argument you use for `RecursiveTask`).

In Java 7 or Java 6, recall that `ForkJoinPool.commonPool()` will not work. Replace this expression with the (static) field where you have stored the result of your once-ever-while-the-program-runs call to `new ForkJoinPool()`. From here on, we will assume Java 8 or higher, but remember this details for Java 7 or Java 6 if you need it.

## A Useful Example

The key for non-dumb examples, which is hinted at nicely by the name `RecursiveTask`, is that your `compute` method can create other `RecursiveTask` objects and have the pool run them in parallel. First you create another object. Then you call its `fork` method. That actually starts parallel computation — `fork` itself returns quickly, but more computation is now going on. When you need the answer, you call the `join` method on the object you called `fork` on. The `join` method will get you the answer from `compute()` that was figured out by `fork`. If it is not ready yet, then `join` will block (i.e., not return) until it is ready. So the point is to call `fork` “early” and call `join` “late”, doing other useful work in-between.

Those are the “rules” of how `fork`, `join`, and `compute` work, but in practice a lot of the parallel algorithms you write in this framework have a very similar form, best seen with an example. What this example does is sum all the elements of an array, using parallelism to potentially process different 5000-element segments in parallel. (The types `long` / `Long` are just like `int` / `Integer` except they are 64 bits instead of 32. They can be a good choice if your data can be large — a sum could easily exceed 232, but exceeding 264 is less likely.)

```
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

class Sum extends RecursiveTask<Long> {
    static final int SEQUENTIAL_THRESHOLD = 5000;

    int low;
    int high;
    int[] array;

    Sum(int[] arr, int lo, int hi) {
        array = arr;
        low   = lo;
        high  = hi;
    }

    protected Long compute() {
        if(high - low <= SEQUENTIAL_THRESHOLD) {
            long sum = 0;
            for(int i=low; i < high; ++i)
                sum += array[i];
            return sum;
         } else {
            int mid = low + (high - low) / 2;
            Sum left  = new Sum(array, low, mid);
            Sum right = new Sum(array, mid, high);
            left.fork();
            long rightAns = right.compute();
            long leftAns  = left.join();
            return leftAns + rightAns;
         }
     }

     static long sumArray(int[] array) {
         return ForkJoinPool.commonPool().invoke(new Sum(array,0,array.length));
     }
}
```

How does this code work? A `Sum` object is given an array and a range of that array. The `compute` method sums the elements in that range. If the range has fewer than `SEQUENTIAL_THRESHOLD` elements, it uses a simple for-loop like you learned in introductory programming. Otherwise, it creates two `Sum` objects for problems of half the size. It uses `fork` to compute the left half in parallel with computing the right half, which this object does itself by calling `right.compute()`. To get the answer for the left, it calls `left.join()`.

Why do we have a `SEQUENTIAL_THRESHOLD`? It would be correct instead to keep recurring until `high==low+1` and then return `array[low]`. But this creates a lot more `Sum` objects and calls to `fork`, so it will end up being much less efficient despite the same asymptotic complexity.

Why do we create more `Sum` objects than we are likely to have procesors? Because it is the framework's job to make a reasonable number of parallel tasks execute efficiently and to schedule them in a good way. By having lots of fairly small parallel tasks it can do a better job, especially if the number of processors available to your program changes during execution (e.g., because the operating system is also running other programs) or the tasks end up taking different amounts of time.

So setting `SEQUENTIAL_THRESHOLD` to a good-in-practice value is a trade-off. The documentation for the ForkJoin framework suggests creating parallel subtasks until the number of basic computation steps is somewhere over 100 and less than 10,000. The exact number is not crucial provided you avoid extremes.

## Gotchas

There are a few “gotchas” when using the library that you might need to be aware of:

1. It might seem more natural to call `fork` twice for the two subproblems and then call `join` twice. This is naturally a little less efficient than just calling `compute` for no benefit since you are creating more parallel tasks than is helpful. But it turns out to be a lot less efficient, for reasons that are specific to the current implementation of the library and related to the overhead of creating tasks that do very little work themselves.

2. Remember that calling



   ```
   join
   ```



   blocks until the answer is ready. So if you look at the code:

   ```
       left.fork();
       long rightAns = right.compute();
       long leftAns  = left.join();
       return leftAns + rightAns;
   ```

   you'll see that the order is crucial. If we had written:

   ```
       left.fork();
       long leftAns  = left.join();
       long rightAns = right.compute();
       return leftAns + rightAns;
   ```

   our entire array-summing algorithm would have no parallelism since each step would completely compute the left before starting to compute the right. Similarly, this version is non-parallel because it computes the right before starting to compute the left:

   ```
       long rightAns = right.compute();
       left.fork();
       long leftAns  = left.join();
       return leftAns + rightAns;
   ```

3. You should not use the `invoke` method of a `ForkJoinPool` from within a `RecursiveTask` or `RecursiveAction`. Instead you should always call `compute` or `fork` directly even if the object is a different subclass of `RecursiveTask` or `RecursiveAction`. You may be conceptually doing a “different” parallel computation, but it is still part of the same parallel task. Only sequential code should call `invoke` to begin parallelism. (More recent versions of the library may have made this less of an issue, but if you are having problems, this may be the reason.)

4. When debugging an uncaught exception, it is common to examine the “stack trace” in the debugger: the methods on the call stack when the exception occurred. With a fork-join computation, this is not as simple since the call to `compute` occurs in a different thread than the conceptual caller (the code that called `fork`). The library and debugger try to give helpful information including stack information for the thread running `compute` and the thread that called `fork`, but it can be hard to read and it includes a number of calls related to the library implementation that you should ignore. You may find it easier to debug by catching the exception inside the call to `compute` and just printing that stack trace.

5. In terms of performance, there are many reasons a fork-join computation might run slower than you expect, even slower than a sequential version of the algorithm. See the next section.

## Timing Issues

It is natural to write a simple fork-join program and compare its performance to a sequential program solving the same problem. Doing so is trickier than you might like for a variety of good reasons. Here we list various reasons and what to do about them. You can use this as a list of things to check when you are not seeing the parallel speed-up you might expect. Some of these issues are relevant for any microbenchmarking on modern systems while others are more specific to parallelism.

1. Time for long enough: To compare the time to run two pieces of code, make sure they each run for at least a few seconds. You can put the computation you care about in a loop, but see below for how to do this without creating artificial effects.
2. Have enough data elements: For a computation over an array, for example, use an array with at least a million elements.
3. Make sure you have the number of processors you think you do: A parallel computation is unlikely to “win” with 1 processor nor produce the results you expect if the operating system is not providing as many processors as you think. One thing you can do is pass an explicit number to the `ForkJoinPool` constructor (e.g., 1, 2, 4, 8) and see if larger numbers (up to the number of processors you expect are available) lead to better performance.
4. Warm up the library: The framework itself is just Java code and the Java implementation “takes a while” to decide this code is performance critical and optimize it. For timing purposes, it is best to run a couple fork-join computations before timing a fork-join computation as otherwise the first, slow run will dominate the results.
5. Do enough computation on each element: Very simple operations like adding together numbers take so little time that many computers will be limited by the time to get the data from memory, which may prevent effective use of parallelism. While a fork-join reduction that sums a ten-million element array may outperform a sequential version, a map that sets `out[i] = in1[i]+in2[i]` for similar-length arrays may not because doing three memory operations and one addition may cause processors to wait for each other to access memory. Try a more sophisticated operation like `out[i] = (Math.abs(in[i-1])+Math.abs(in[i])+Math.abs(in[i+1]))/3` or even just `out[i] = in[i]in[i]`.
6. Use the result of your computation: A clever compiler might skip doing computations it can tell are not used by a program. After computing a result and after timing, do something like print the answer out. To avoid printing out a large array, you could choose a random element of the array to print.
7. Do not use very simple inputs: Some compilers might be so clever to notice that simple arrays where, for example, `arr[i] = i` have a structure that can be optimized, leading to sequential code that is “unfairly” fast. (It is unfair: nobody wants to sum an array with such inputs, we have constant-time algorithms to sum the integers from 1 to n.) Perhaps fill the array with random elements, or at least change a few of the elements to other values after the initialization.
8. Use slightly different inputs for each iteration: For various reasons above (long enough timing runs, warming up the library), you may perform the same computation many times in a loop. Again the compiler might “notice” that the sequential or parallel code is doing the same thing across iterations and avoid doing unnecessary computations, leading to you not timing what you think you are. You should be able to “confuse” the compiler by swapping around a few array elements between iterations.
9. Double-check your sequential cut-offs: Make sure your fork-join code is correctly computing when to switch to a sequential algorithm. You want lots of small tasks, but each should still be doing a few thousand or tens of thousands of arithmetic operations. If too low, you will slow down the fork-join code due to the overhead of task creation. If too large, you will leave processors idle, which naturally slows things down.



原文链接: [Beginner's Introduction to Java's ForkJoin Framework](http://homes.cs.washington.edu/~djg/teachingMaterials/grossmanSPAC_forkJoinFramework.html)

参考地址: [使用Java7 ForkJoin Framework进行并发编程](http://www.williamsang.com/archives/1724.html)

翻译人员: [铁锚](http://blog.csdn.net/renfufei)

翻译日期: 2014-12-19日

原文日期: 2012-03-25日更新
