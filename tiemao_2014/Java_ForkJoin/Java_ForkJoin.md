Java框架ForkJoin入门简介
==


##Introduction

These notes describe the bare basics of the Java ForkJoin Framework (JSR-166) for students new to parallel programming. This material is only enough to code up basic parallel maps and reductions for pedagogical purposes. The focus is on installation issues and the few classes and methods you need to get started. Separate lecture notes and a programming project give much more detail on benefits of the library, how to approach programming with it, asymptotic guarantees, etc.

We focus on using Java's library, not on how it is implemented. Libraries/languages with similar facilities exist for other environments including Cilk and Intel's Thread Building Blocks (TBB) for C/C++ and the Task Parallel Library for C#.

We will first describe how to install the framework (or use it if it is already installed). We will mostly assume you are using the Eclipse IDE, but it should be easy to translate the installation instructions for other environments, including the command line. We will then describe the 3 or 4 classes you will need to write basic divide-and-conquer parallel algorithms manually. We will present a full working program that you can use as a template. We will mention a few complications in case you stumble into them. Finally, we will discuss best practices for timing how long a computation takes and reasons why a sequential version might appear faster.

##Installation

###Java 7:

The ForkJoin Framework is part of Java 7's standard libraries, so we strongly encourage using Java 7. Java 7 was released in July 2011, so you may not yet have it. You can get it from [http://jdk7.java.net/](http://jdk7.java.net/): the appropriate current JDK7 for your computer will suffice. A stable release is not yet available for the Mac, however, so follow the Java 6 instructions below for Mac OSX.

### Eclipse: ###

The key issue is to make sure you are using Java 7 and not an earlier version. If you download a new up-to-date version of Eclipse for Java Developers (any of the various flavors that supports Java) from [http://eclipse.org/downloads](http://eclipse.org/downloads), then Java 7 should be the default, especially if Java 7 is the only version of Java on your computer.

You can confirm when creating a Java project in Eclipse that the execution environment JRE is JRE-SE1.7.

**If using Java 7 and an up-to-date Eclipse, you can ignore the rest of the installation instructions. Skip to the next section.**

If you are using a version of Eclipse from 2011 or earlier, you may need to do some additional work to set up a Java project to use Java 7. First, you may get a warning, "The 1.7 compiler compliance level is not yet supported. The new project will use a project specific compiler compliance level of 1.6." You can ignore this warning: we are using only new libraries in Java 7, not any new language features, so Eclipse's Java 1.6 compiler compliance should not cause problems.

Second, the JavaSE-1.7 JRE may not be the default for Java projects, but we need it. When creating a Java project, change the JRE to be a project specific JRE and choose JavaSE-1.7 if this is not already chosen (see next paragraph if nothing with a 7 in it is an option). This is all you should need to do, at least if you installed Eclipse after Java 7. For an existing project, or if you forgot the step above, go to Run, then Run Configurations, then Java Application to create a New Configuration, then the JRE tab, then Alternate JRE, then choose jre7. If you do not see any options for 1.7 or jre7, then presumably Java 7 is not installed, at least not that Eclipse knows about.

If you have an older version of Eclipse and have never used Java 7 for a project before, you may need to follow these steps when creating the first such project:

* Click the 'Configure JREs' link
* Click 'Add' to add a new JRE to the table
* It will ask you what type; select 'Standard VM' and hit Next
* In the 'JRE home' box, type the path at which Java 7 was installed - the other items should get auto-filled-in as soon as you supply the correct path (under Windows, a common location is C:\Program Files\Java\jre7, but you may have chosen a different location when you installed Java 7)
* Click 'Finish'
* 'jre7' should now have a row in the table; click 'Ok'
* Now when you select 'Use a project specific JRE', 'jre7' should show up - select it for this project
* Fill in the usual stuff for your project (name, path, etc.)

If you need additional information, "[Working with JREs](http://help.eclipse.org/indigo/index.jsp?topic=%2Forg.eclipse.jdt.doc.user%2Ftasks%2Ftask-add_new_jre.htm)" may help.

### Command-line: ###

If using a command-line, just confirm that `javac -version` and `java -version` refer to 1.7.something.

### Java 6: ###

If you need to use Java 6 for some reason, you can still use the ForkJoin Framework, but you must download it explicitly and use some strange arguments as described in detail below. Java 5 and earlier will definitely not work.

You need a copy of jsr166.jar. Newer versions are released occasionally and posted at [http://gee.cs.oswego.edu/dl/jsr166/dist/jsr166.jar](http://gee.cs.oswego.edu/dl/jsr166/dist/jsr166.jar). To create a project that uses the library, you can follow the steps below in order. There are alternatives for some of these steps (e.g., you could put the .jar file in a different directory), but these should work.

1. Outside of Eclipse, make a new directory (folder) and put jsr166.jar and other relevant Java code in it. Make sure it is called jsr166.jar, renaming the file if your web browser somehow changed the name when downloading it.
1. In Eclipse, create a new Java project. Choose "Create project from existing source" and choose the directory you created in the previous step.
1. In the project, choose Project → Properties from the menu. Under "Java Compiler" check "Enable project specific settings" and make sure the choice is Java 1.6 (earlier versions will not work).
1. In the list of files in the package viewer (over on the left), right-click on jsr166.jar and choose "Add to Build Path."
1. Make a new class for your project. Define a main method you can run.
1. Under Run → Configurations, create a new configuration. Under Arguments, you are used to putting program arguments in the top and that is as usual. But also under "VM arguments" on the bottom you need to enter: **-Xbootclasspath/p:jsr166.jar** exactly like that.

If you instead run javac and java from a command-line, you need jsr166.jar to be in your build path when you compile and you need -Xbootclasspath/p:jsr166.jar as an option when you run javac and when you run java.

## Documentation ##

The main web site for JSR-166 is [http://gee.cs.oswego.edu/dl/concurrency-interest/index.html](http://gee.cs.oswego.edu/dl/concurrency-interest/index.html). It has much more information than beginners need, which is why we have distilled the basics into these notes. If you need the javadoc, see [http://gee.cs.oswego.edu/dl/jsr166/dist/jsr166ydocs/](http://gee.cs.oswego.edu/dl/jsr166/dist/jsr166ydocs/) or the documentation provided with Java 7.



## Getting Started

For learning about basic parallel operations, there are only 2-4 classes you need to know about:

1. **ForkJoinPool**: you create exactly one of these to run all your fork-join tasks in the whole program
1. **RecursiveTask<V>**: you run a subclass of this in a pool and have it return a result; see the examples below
1. **RecursiveAction**: just like `RecursiveTask` except it does not return a result
1. **ForkJoinTask<V>**: superclass of `RecursiveTask<V>` and RecursiveAction. fork and join are methods defined in this class. You won't use this class directly, but it is the class with most of the useful javadoc documentation, in case you want to learn about additional methods.

All the classes are in the package `java.util.concurrent`, so it is natural to have import statements like this:

	import java.util.concurrent.ForkJoinPool;
	import java.util.concurrent.RecursiveTask;

To use the library, first create a ForkJoinPool object. You should do this only once -- there is no good reason to have more than one pool in your program. It is the job of the pool to take all the tasks that can be done in parallel and actually use the available processors effectively. A static field holding the pool works great:

	public static ForkJoinPool fjPool = new ForkJoinPool();

(The default constructor is for when you want the pool to use all the processors made available to it. That is a good choice.)

If you can compile and run a "Hello, World!" program that includes the field declaration above, then you followed the installation instructions correctly. Of course, you are not actually using the pool yet.

##A Useless Example

To use the pool you create a subclass of RecursiveTask<V> for some type V (or you create a subclass of RecursiveAction). In your subclass, you override the compute() method. Then you call the invoke method on the ForkJoinPool passing an object of type RecursiveTask<V>. Here is a dumb example:

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
	int fortyThree = fjPool.invoke(new Incrementor(42));

The reason this example is dumb is there is no parallelism. We just hand an object over to the pool, the pool uses some processor to run the `compute` method, and then we get the answer back. We could just as well have done:

	int fortyThree = (new Incrementor(42)).compute();

Nonetheless, this dumb example shows one nice thing: the idiom for passing data to the `compute()` method is to pass it to the constructor and then store it into a field. Because you are overriding the `compute` method, it **must** take zero arguments and return `Integer` (or whatever type argument you use for `RecursiveTask`).

## A Useful Example ##

The key for non-dumb examples, which is hinted at nicely by the name RecursiveTask, is that your compute method can create other RecursiveTask objects and have the pool run them in parallel. First you create another object. Then you call its fork method. That actually starts parallel computation -- fork itself returns quickly, but more computation is now going on. When you need the answer, you call the join method on the object you called fork on. The join method will get you the answer from compute() that was figured out by fork. If it is not ready yet, then join will block (i.e., not return) until it is ready. So the point is to call fork "early" and call join "late", doing other useful work in-between.

Those are the "rules" of how fork, join, and compute work, but in practice a lot of the parallel algorithms you write in this framework have a very similar form, best seen with an example. What this example does is sum all the elements of an array, using parallelism to potentially process different 5000-element segments in parallel. (The types long / Long are just like int / Integer except they are 64 bits instead of 32. They can be a good choice if your data can be large -- a sum could easily exceed `2^32`, but exceeding `2^64` is less likely.)

	import java.util.concurrent.ForkJoinPool;
	import java.util.concurrent.RecursiveTask;
	
	class Globals {
	    static ForkJoinPool fjPool = new ForkJoinPool();
	}
	
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
	         return Globals.fjPool.invoke(new Sum(array,0,array.length));
	     }
	}

How does this code work? A Sum object is given an array and a range of that array. The compute method sums the elements in that range. If the range has fewer than SEQUENTIAL_THRESHOLD elements, it uses a simple for-loop like you learned in introductory programming. Otherwise, it creates two Sum objects for problems of half the size. It uses fork to compute the left half in parallel with computing the right half, which this object does itself by calling right.compute(). To get the answer for the left, it calls left.join().

Why do we have a SEQUENTIAL_THRESHOLD? It would be correct instead to keep recurring until high==low+1 and then return array[low]. But this creates a lot more Sum objects and calls to fork, so it will end up being much less efficient despite the same asymptotic complexity.

Why do we create more Sum objects than we are likely to have procesors? Because it is the framework's job to make a reasonable number of parallel tasks execute efficiently and to schedule them in a good way. By having lots of fairly small parallel tasks it can do a better job, especially if the number of processors available to your program changes during execution (e.g., because the operating system is also running other programs) or the tasks end up taking different amounts of time.

So setting SEQUENTIAL_THRESHOLD to a good-in-practice value is a trade-off. The documentation for the ForkJoin framework suggests creating parallel subtasks until the number of basic computation steps is somewhere over 100 and less than 10,000. The exact number is not crucial provided you avoid extremes.

## Gotchas ##

There are a few "gotchas" when using the library that you might need to be aware of:

1.It might seem more natural to call fork twice for the two subproblems and then call join twice. This is naturally a little less efficient than just calling compute for no benefit since you are creating more parallel tasks than is helpful. But it turns out to be a lot less efficient, for reasons that are specific to the current implementation of the library and related to the overhead of creating tasks that do very little work themselves.

2.Remember that calling join blocks until the answer is ready. So if you look at the code:

    left.fork();
    long rightAns = right.compute();
    long leftAns  = left.join();
    return leftAns + rightAns;

you'll see that the order is crucial. If we had written:

    left.fork();
    long leftAns  = left.join();
    long rightAns = right.compute();
    return leftAns + rightAns;

our entire array-summing algorithm would have no parallelism since each step would completely compute the left before starting to compute the right. Similarly, this version is non-parallel because it computes the right before starting to compute the left:

    long rightAns = right.compute();
    left.fork();
    long leftAns  = left.join();
    return leftAns + rightAns;

3.You should not use the invoke method of a ForkJoinPool from within a RecursiveTask or RecursiveAction. Instead you should always call compute or fork directly even if the object is a different subclass of RecursiveTask or RecursiveAction. You may be conceptually doing a "different" parallel computation, but it is still part of the same parallel task. Only sequential code should call invoke to begin parallelism.

4.When debugging an uncaught exception, it is common to examine the "stack trace" in the debugger: the methods on the call stack when the exception occurred. With a fork-join computation, this is not as simple since the call to compute occurs in a different thread than the conceptual caller (the code that called fork). The library and debugger try to give helpful information including stack information for the thread running compute and the thread that called fork, but it can be hard to read and it includes a number of calls related to the library implementation that you should ignore. You may find it easier to debug by catching the exception inside the call to compute and just printing that stack trace.

5.In terms of performance, there are many reasons a fork-join computation might run slower than you expect, even slower than a sequential version of the algorithm. See the next section.

## Timing Issues ##

It is natural to write a simple fork-join program and compare its performance to a sequential program solving the same problem. Doing so is trickier than you might like for a variety of good reasons. Here we list various reasons and what to do about them. You can use this as a list of things to check when you are not seeing the parallel speed-up you might expect. Some of these issues are relevant for any microbenchmarking on modern systems while others are more specific to parallelism.

1. Time for long enough: To compare the time to run two pieces of code, make sure they each run for at least a few seconds. You can put the computation you care about in a loop, but see below for how to do this without creating artificial effects.
1. Have enough data elements: For a computation over an array, for example, use an array with at least a million elements.
1. Make sure you have the number of processors you think you do: A parallel computation is unlikely to "win" with 1 processor nor produce the results you expect if the operating system is not providing as many processors as you think. One thing you can do is pass an explicit number to the ForkJoinPool constructor (e.g., 1, 2, 4, 8) and see if larger numbers (up to the number of processors you expect are available) lead to better performance.
1. Warm up the library: The framework itself is just Java code and the Java implementation "takes a while" to decide this code is performance critical and optimize it. For timing purposes, it is best to run a couple fork-join computations before timing a fork-join computation as otherwise the first, slow run will dominate the results.
1. Do enough computation on each element: Very simple operations like adding together numbers take so little time that many computers will be limited by the time to get the data from memory, which may prevent effective use of parallelism. While a fork-join reduction that sums a ten-million element array may outperform a sequential version, a map that sets out[i] = in1[i]+in2[i] for similar-length arrays may not because doing three memory operations and one addition may cause processors to wait for each other to access memory. Try a more sophisticated operation like out[i] = (Math.abs(in[i-1])+Math.abs(in[i])+Math.abs(in[i+1]))/3 or even just out[i] = in[i]*in[i].
1. Use the result of your computation: A clever compiler might skip doing computations it can tell are not used by a program. After computing a result and after timing, do something like print the answer out. To avoid prining out a large array, you could choose a random element of the array to print.
1. Do not use very simple inputs: Some compilers might be so clever to notice that simple arrays where, for example, arr[i] = i have a structure that can be optimized, leading to sequential code that is "unfairly" fast. (It is unfair: nobody wants to sum an array with such inputs, we have constant-time algorithms to sum the integers from 1 to n.) Perhaps fill the array with random elements, or at least change a few of the elements to other values after the initialization.
1. Use slightly different inputs for each iteration: For various reasons above (long enough timing runs, warming up the library), you may perform the same computation many times in a loop. Again the compiler might "notice" that the sequential or parallel code is doing the same thing across iterations and avoid doing unnecessary computations, leading to you not timing what you think you are. You should be able to "confuse" the compiler by swapping around a few array elements between iterations.
1. Double-check your sequential cut-offs: Make sure your fork-join code isn't miscomputing when to switch to a sequential algorithm. You want lots of small tasks, but each should still be doing a few thousand or tens of thousands of arithmetic operations. If too low, you will slow down the fork-join code due to the overhead of task creation. If too large, you will leave processors idle, which naturally slows things down.

原文链接: [Beginner's Introduction to Java's ForkJoin Framework](http://homes.cs.washington.edu/~djg/teachingMaterials/grossmanSPAC_forkJoinFramework.html)

参考地址: [使用Java7 ForkJoin Framework进行并发编程](http://www.williamsang.com/archives/1724.html)

翻译人员: [铁锚](http://blog.csdn.net/renfufei)

翻译日期: 2014-12-19日

原文日期: 2012-03-25日更新