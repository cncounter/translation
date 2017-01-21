# JNI Global reference 与 JFrame#dispose() 方法


## 问题描述


I am using jProfiler to find memory leaks in a Java swing application. I have identified instances of a JFrame which keeps growing in count.

当我用 jProfiler 来分析一个 Java swing 程序中内存泄漏的问题时。我发现并确定程序中的 JFrame 实例数量一直在持续增长。


This frame is opened, and then closed.

frame 被打开(opened),然后被关闭(closed)。


Using jProfiler, and viewing the Paths to GC Root there is only one reference, 'JNI Global reference'.

通过 jProfiler, 并查看GC Root时, 只找到一项, 'JNI Global reference'。


What does this mean? Why is it hanging on to each instance of the frame?


这是什么意思? 为什么他 hang 住了每一个 frame 实例?


## 回答1

Wikipedia has a good overview of [Java Native Interface](http://en.wikipedia.org/wiki/Java_Native_Interface), essentially it allows communication between Java and native operating system libraries writen in other languages.


请查看《维基百科》中关于 [Java本地接口](https://zh.wikipedia.org/wiki/Java%E6%9C%AC%E5%9C%B0%E6%8E%A5%E5%8F%A3) 的介绍, 本质上它允许 Java程序 和本地操作系统库之间进行通信。




JNI global references are prone to memory leaks, as they are not automatically garbage collected, and the programmer must explicitly free them.  If you are not writing any JNI code yourself, it is possible that the library you are using has a memory leak.

JNI全局引用很容易造成内存泄漏, 因为它们不能被自动垃圾收集所清理, 程序员必须显式地释放它们. 如果你没有编写任何JNI代码, 那么狠可能是您正在使用的库中存在内存泄漏。


**edit** [here](http://journals.ecs.soton.ac.uk/java/tutorial/native1.1/implementing/refs.html) is a bit more info on local vs. global references, and why global references are used (and how they should be freed)

**修正:** [此处](http://journals.ecs.soton.ac.uk/java/tutorial/native1.1/implementing/refs.html) 查看关于 local vs. global references 的更多信息. 为什么要使用全局引用(以及如何进行释放)。





## 回答2



A JNI global reference is a reference from "native" code to a Java object managed by the Java garbage collector. Its purpose is to prevent collection of an object that is still in use by native code, but doesn't appear to have any live references in the Java code.

JNI全局引用(JNI global reference), 是从 "native" 代码中指向堆内存里Java对象的引用. 其存在的目的是为了阻止垃圾收集器, 不要误将 native 代码仍在使用的对象给回收了, 假如这些Java对象没有其他代码引用到他们的话。


A JFrame is a java.awt.Window, and is associated with a "native" Window object. When you are completely finished with a particular JFrame instance, you should invoke its dispose() method to clean up.

一个 JFrame 实例就是一个窗口(`java.awt.Window`), 并关联到一个本地的 Window 对象。如果某个特定 JFrame 实例的任务已经结束,那么就应该调用 `dispose()` 方法来进行清理。


I am not sure if any native code is creating a global reference to the JFrame, but it seems likely. If it does, this will prevent the JFrame from being garbage collected. If you are creating many Windows (or subclasses) and seeing that they are never collected, make sure that they are disposed.

我不确定本地代码是否创建了一个全局引用指向 JFrame, 但应该是这样没错。如果确实创建了全局引用, 那就会阻止 JFrame 对象被GC回收. 如果程序中创建了许多 Window 对象(或者其子类), 又没有调用 dispose(), 则他们永远不会被GC回收掉, 这就造成了隐形的内存泄露。



参考:  [stackoverflow: What is 'JNI Global reference'](http://stackoverflow.com/questions/112603/what-is-jni-global-reference/112720#112720)

