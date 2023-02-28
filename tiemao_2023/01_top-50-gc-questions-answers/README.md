

# Top 50 Advanced Java Garbage Collection and Performance Interview Questions and Answers

Hello Java Developers, If you have gone through any Java Developer interview, particularly for a senior developer role then you know that a good knowledge of JVM internals and Garbage collection is important. Even though [Java](https://javarevisited.blogspot.com/2018/07/10-reasons-to-learn-java-programming.html) and [JVM](https://javarevisited.blogspot.com/2019/04/top-5-courses-to-learn-jvm-internals.html) take care of memory management for you, bad code can still cause memory leaks and performance issues. For example, if you are creating millions of objects in a loop or keeping an un-intended reference of dead objects then you are putting additional strain on the Garbage collector and creating a **memory leak** in your application. You cannot blame Java and JVM for that and the only way to avoid such errors is to know about how Garbage collection works.

In fact, for a truly high-performance application in Java, you also need to fine-tune your application to maximize performance and also need to add essential logging to troubleshoot and identify performance issues.

For example, in one of my web application projects, our Tomcat server was throwing an OutOfMemory error and requests are getting stuck. There was not much clue on the logs but when I enabled GC logging I found that it's full GC which is causing **OutOfMemory error** because it wasn't able to reclaim much space and the root cause was a memory leak.

That's why a good knowledge of GC and JVM internals is important for Java developers, particularly people with few years of experience. 

If you think you haven't spent much time on GC and don't know much about how Garbage collection works then I suggest you first go through specific [Java performance courses](https://www.java67.com/2020/04/top-5-advanced-courses-to-learn-java-perofrmance-concurrency-memory-management.html) and [books](https://www.java67.com/2019/08/best-books-to-learn-java-virtual-machine-in-depth.html), these will provide all the information and knowledge you need to answer common Garbage Collection interviews Questions.









## 50+ Java Interview questions on Garbage Collection

In this article, I have shared some Garbage collection interview questions which I have seen in many interviews. These questions are based upon the concept of How Garbage collection works, Different kinds of Garbage collectors, and **JVM parameters** used for garbage collection monitoring and tuning.

I have also added questions that force you to learn more about GC terminology and process so that you do your own research after going through this article. GC is an essential part of any Java interview, so make sure you have good command in GC.


**Question 1 - What is the difference between ParNew and DefNew Young Generation Garbage collector?**
Answer - ParNew and DefNew are two young generation garbage collectors. ParNew is a multi-threaded GC used along with concurrent Mark Sweep while DefNew is a single-threaded GC used along with Serial Garbage Collector.

[![Top 50 Garbage Collection and Java Performance Interview Questions and Answers](https://1.bp.blogspot.com/-Zv6ekanlfaE/Xjd_7BnbM3I/AAAAAAAAcrU/IK8YPDynbK4CIKqMXr68EC9AfY7QnN6hgCEwYBhgL/w606-h341/How%2Bmany%2Bobjects%2Bare%2Beligible%2Bfor%2Bgarbage%2Bcollection%2Btricky%2Bjava%2Bquestion.png)](https://1.bp.blogspot.com/-Zv6ekanlfaE/Xjd_7BnbM3I/AAAAAAAAcrU/IK8YPDynbK4CIKqMXr68EC9AfY7QnN6hgCEwYBhgL/s1600/How%2Bmany%2Bobjects%2Bare%2Beligible%2Bfor%2Bgarbage%2Bcollection%2Btricky%2Bjava%2Bquestion.png)



**
Question 2 - How do you identify minor and major garbage collections in Java?**
Minor collection prints “GC” if garbage collection logging is enabled using –verbose:gc or -XX:PrintGCDetails, while Major collection prints “Full GC.”


**Question 3 - How do you find GC resulted due to calling System.gc()?**
Similar to the major and minor collection, there will be the word “System” included in the Garbage collection output.


**Question 4 - What is the difference between Serial and Throughput Garbage collector?**
Both Serial and Throughput are stop-the-world Garbage collectors and pause application thread during full GC, but Throughput Garbage collector is better than Serial one. Also, the serial Garbage collector is defaulting on client JVM.



**Question 5 - What is the difference between -XX:ParallelGC and -XX:ParallelOldGC?**


Question 6 - When do you ConcurrentMarkSweep Garbage collector and Throughput GC?

**Question 7 - Does Garbage collection occur in permanent generation space in JVM?**
This is a tricky Garbage collection interview question as many programmers are not sure whether PermGen space is part of java heap space or not and since it maintains class Metadata and String pool, whether its eligible for garbage collection or not.

By the way, Garbage Collection does occur in PermGen space, and if PermGen space is full or cross a threshold, it can trigger Full GC. If you look at the output of GC, you will find that PermGen space is also garbage collected.

This is why the correct sizing of PermGen space is essential to avoid frequent full GC. You can control the size of PermGen space by JVM options -XX:PermGenSize
and -XX:MaxPermGenSize.


**Question 8: How do you monitor garbage collection activities?**
You can monitor garbage collection activities, either offline or in real-time. You can use tools like JConsole and VisualVM VM with its Visual GC plug-in to monitor real-time garbage collection activities, and memory status of JVM, or you can redirect Garbage collection output to a log file for offline analysis by using -XlogGC=<PATH> JVM parameter.

Anyway, you should always enable GC options to lie -XX:PrintGCDetails -X:verboseGC and -XX:PrintGCTimeStamps as it doesn't impact application performance much but provide useful states for performance monitoring.


Question 9: What is the difference between ConcurrentMarkSweep and G1 garbage collector?

Question 10: Have you done any garbage collection tuning? What was your approach?


**Questions 11: Does Garbage collection occur in permanent generation space in JVM?**
This is a tricky Garbage collection interview question as many programmers are not sure whether permgen space is part of java heap space or not and since it maintains class metadata and String pool, whether it's eligible for garbage collection or not.

By the way, Garbage Collection does occur in PermGen space, and if PermGen space is full or crosses a threshold, it can trigger Full GC. If you look at the output of GC, you will find that PermGen space is also garbage collected.

This is why the correct sizing of permgen space is important to avoid frequent full GC. you can control size of permgen space by JVM options -XX:PermGenSize and -XX:MaxPermGenSize.

If you want to learn more about the Heap structure inside JVM, I also recommend you go through the **[Understanding the Java Virtual Machine: Memory Management](https://javarevisited.blogspot.com/2019/04/top-5-courses-to-learn-jvm-internals.html)** course on Pluralsight by Kevin Jones. It's a 3-part series JVM course which deep dives into memory management, class loading, security, and reflection.



[![Java Memory Management interview questions](https://1.bp.blogspot.com/-3zxm31LRG8g/Xjd_1abAEII/AAAAAAAAcrQ/c8e2R-Lt058Efh1wcJblwHPiJhbasvNbgCLcBGAsYHQ/w603-h325/Garbage%2BCollection%2Band%2BJVM%2Bparameters.jpg)](https://medium.com/javarevisited/7-best-courses-to-learn-jvm-garbage-collection-and-performance-tuning-for-experienced-java-331705180686)



**Questions 12: What is the difference between ParNew and DefNew Young Generation Garbage collector?**

Questions 13: How do you identify minor and major garbage collections in Java?

Questions 14: How do you find GC resulted due to calling System.gc()?

Question 15: What is the difference between Serial and Throughput Garbage collector?

Question 16: What is the difference between -XX:ParallelGC and -XX:ParallelOldGC?

Question 17: When do you ConcurrentMarkSweep Garbage collector and ThroughPut GC?


**Question 18: How do you monitor garbage collection activities? You can monitor garbage collection** activities either offline or in real-time. You can use tools like JConsole and Visual VM with its Visual GC plugin to monitor real-time garbage collection activities, and memory status of JVM or you can redirect Garbage collection output to a log file for offline analysis by using -XlogGC=<PATH> JVM parameter. 

Anyway, you should always enable GC options to lie -XX:PrintGCDetails -X:verboseGC and -XX:PrintGCTimeStamps as it doesn't impact application performance much but provide useful statics for performance monitoring.


Question 19: What is the difference between ConcurrentMarkSweep and G1 garbage collector?

Question 20:  Have you done any garbage collection tuning? What was your approach?

Question 21: Difference between major and minor garbage collection?

Question 22: How will you enable Garbage collection logs?

Question 23: Can you call the finalize() method in Java?

**Question 24: Can you force Garbage collection in Java?**
This is an interesting question.  The answer is both yes and no.  We can use the call “System.gc()” to suggest to the JVM to perform a garbage collection. However, there is no guarantee this will do anything. As a java developer, we don’t know for sure what JVM our code is being run in. The JVM spec makes no guarantees on what will happen when this method is called. There is even a startup flag, -XX:+DisableExplicitGC, which will stop this from doing anything. By the way, It is considered bad practice to use System.gc().

Question 25: How does G1 Garbage Collector work?

Question 26: How do you increase heap memory in Java?

**Question 27: What is PermGen space in JVM?**
The PermGen is where the JVM stores the metadata about classes.  It no longer exists in Java 8, having been replaced with metaspace. Generally, the PermGen doesn’t require any tuning above, ensuring it has enough space, although it is possible to have leaks if Classes are not being appropriately unloaded.

Question 28: Where do objects are get created in Java?

Question 29: What are the different regions on which heap is divided for GC?

Question 30: How to request JVM to start the garbage collection process?

\31. What is the difference between serial and parallel garbage collectors?

\32. What is ConcurrentMarkSweep Garbage Collector?

\33. What is the G1 Garbage collector?

\34. How does G1 Garbage Collector achieve better timing?

\35. What is finally a method in Java?

\36. When does an object become eligible for Garbage collection?

\37. What is difference between System.gc() and Runtime.gc() ?

\38. What are ParNew and DefNew garbage collectors?

\39. How to display garbage collection details in a log file?

\40. How to store garbage collection logs in a particular file?

\41. What is Eden and survivor space in a heap?

\42. What are the best practices to help the Garbage collector?

\43. What are the different kinds of Garbage collectors available in Java?

\44. How do you find how much memory is used and total memory in Java?

\45. what are memory areas on which Java Heap is divided?

\46. Difference between Serial and Parallel Garbage collector?

\47. Can we force Garbage collection in Java?

\48. How do you increase Permgen memory in Java?

\49. What is the difference between major and minor garbage collection?

**50. How does ConcurrentMarkSweep garbage collector work?**
CMS GC minimizes pauses by doing most of the GC-related work concurrently with the processing of the application.  This reduces the amount of time when the application has to completely pause and so lends itself much better to applications that are sensitive to this.  CMS is a non-compacting algorithm that can lead to fragmentation problems. The CMS collector actually uses Parallel GC for the young generation.



Read more: https://www.java67.com/2020/02/50-garbage-collection-interview-questions-answers-java.html#ixzz7rrJ8wTHo






- 原文链接: https://www.java67.com/2020/02/50-garbage-collection-interview-questions-answers-java.html

