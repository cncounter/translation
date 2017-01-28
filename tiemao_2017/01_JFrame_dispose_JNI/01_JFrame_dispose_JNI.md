# JNI Global reference 与 JFrame#dispose() 方法


## 问题描述


I am using jProfiler to find memory leaks in a Java swing application. I have identified instances of a JFrame which keeps growing in count.

我在用 jProfiler 分析 Java swing 程序中的内存泄漏问题时, 发现内存中 JFrame 实例的数量一直在增加。


This frame is opened, and then closed.

各个 frame 被打开(opened),然后被关闭(closed)。


Using jProfiler, and viewing the Paths to GC Root there is only one reference, 'JNI Global reference'.

通过 jProfiler, 并查看GC Root时, 只找到一项: 'JNI Global reference'。


What does this mean? Why is it hanging on to each instance of the frame?


这是什么意思? 为什么他 hang 住了所有的 frame 实例?


## 回答1

Wikipedia has a good overview of [Java Native Interface](http://en.wikipedia.org/wiki/Java_Native_Interface), essentially it allows communication between Java and native operating system libraries writen in other languages.


请查看《维基百科》中关于 [Java本地接口](https://zh.wikipedia.org/wiki/Java%E6%9C%AC%E5%9C%B0%E6%8E%A5%E5%8F%A3) 的介绍, 本质上它允许 Java程序 和系统库之间进行通信。




JNI global references are prone to memory leaks, as they are not automatically garbage collected, and the programmer must explicitly free them.  If you are not writing any JNI code yourself, it is possible that the library you are using has a memory leak.

JNI全局引用很容易造成内存泄漏, 因为它们不能被自动垃圾收集所清理, 程序员必须显式地释放它们. 如果你没有编写任何JNI代码, 那么狠可能是使用的库中存在内存泄漏。


**edit** [here](http://journals.ecs.soton.ac.uk/java/tutorial/native1.1/implementing/refs.html) is a bit more info on local vs. global references, and why global references are used (and how they should be freed)

**修正:** 请参考关于 [ local vs. global references](http://journals.ecs.soton.ac.uk/java/tutorial/native1.1/implementing/refs.html) 的更多信息. 其中介绍了为什么要使用全局引用(以及如何进行释放)。





## 回答2



A JNI global reference is a reference from "native" code to a Java object managed by the Java garbage collector. Its purpose is to prevent collection of an object that is still in use by native code, but doesn't appear to have any live references in the Java code.

JNI全局引用(JNI global reference), 是从 "native" 代码指向堆内存中Java对象的引用. 其存在的目的是阻止垃圾收集器, 不要误将 native 代码中仍在使用的对象给回收了, 假如这些Java对象没有Java代码引用到他们的话。


A JFrame is a java.awt.Window, and is associated with a "native" Window object. When you are completely finished with a particular JFrame instance, you should invoke its dispose() method to clean up.

一个 JFrame 实例就是一个窗口(`java.awt.Window`), 并关联到一个本地的 `Window` 对象。如果某个特定 JFrame 实例的任务已经结束,那么就应该调用 `dispose()` 方法来执行清理。


I am not sure if any native code is creating a global reference to the JFrame, but it seems likely. If it does, this will prevent the JFrame from being garbage collected. If you are creating many Windows (or subclasses) and seeing that they are never collected, make sure that they are disposed.

我不确定本地代码是否创建了全局引用来指向 JFrame, 但应该是这样没错。如果确实创建了全局引用, 那就会阻止 JFrame 对象被GC回收. 如果程序中创建了很多 Window 对象(或其子类对象), 而又没有调用 dispose(), 则他们永远都不会被GC回收掉, 这就造成了隐形的内存泄露。


## Local and Global References

## 局部引用和全局引用简介


The JNI creates references for all object arguments passed in to native methods, as well as all objects returned from JNI functions.

JNI为所有传递给 native 方法的对象型参数创建了引用, 同时也对所有从JNI函数返回的对象创建引用。


These references will keep the Java objects from being garbage collected. To make sure that Java objects can eventually be freed, the JNI by default creates local references. Local references become invalid when the execution returns from the native method in which the local reference is created. Therefore, a native method must not store away a local reference and expect to reuse it in subsequent invocations.

这些引用会阻止Java对象被GC清理。为了确保Java对象最终被释放, JNI默认创建的是局部引用(local references). 当本机方法返回时, 其创建的局部引用就会失效。当然, native 方法不应该将局部引用存到其他地方, 妄图在后续调用中进行重用。


For example, the following program (a variation of the native method in FieldAccess.c) mistakenly caches the Java class for the field ID so that it does not have to repeatedly search for the field ID based on the field name and signature:

例如,以下程序(`FieldAccess.c` 中的一种变体native方法) 错误地将Java类的 ID field 缓存起来, 期待不必每次都通过字段名称和签名去搜索 ID field ,:


	/* !!! 本段代码有问题 */
	static jclass cls = 0;
	static jfieldID fid;
	
	JNIEXPORT void JNICALL
	Java_FieldAccess_accessFields(JNIEnv *env, jobject obj)
	{
	  ...
	  if (cls == 0) {
	    cls = (*env)->GetObjectClass(env, obj);
	    if (cls == 0)
	      ... /* error */
	    fid = (*env)->GetStaticFieldID(env, cls, "si", "I");
	  }
	  ... /* access the field using cls and fid */
	}




This program is illegal because the local reference returned from GetObjectClass is only valid before the native method returns. When Java_FieldAccess_accessField is entered the second time, an invalid local reference will be used. This leads to wrong results or to a VM crash.

这个程序是错误的,因为从 `GetObjectClass` 返回的局部引用只在 native 方法返回前才有效。第二次进入 `Java_FieldAccess_accessField` 方法时, 将会引用到一个无效的 local reference。 这会引起错误的结果甚至导致 JVM 崩溃。


To overcome this problem, you need to create a global reference. This global reference will remain valid until it is explicitly freed:

要解决这种问题, 可以创建全局引用(global reference)。全局引用将一直有效,直到显式释放:


	/* This code is OK */
	static jclass cls = 0;
	static jfieldID fid;
	
	JNIEXPORT void JNICALL
	Java_FieldAccess_accessFields(JNIEnv *env, jobject obj)
	{
	  ...
	  if (cls == 0) {
	    jclass cls1 = (*env)->GetObjectClass(env, obj);
	    if (cls1 == 0)
	      ... /* error */
	    cls = (*env)->NewGlobalRef(env, cls1);
	    if (cls == 0)
	      ... /* error */      
	    fid = (*env)->GetStaticFieldID(env, cls, "si", "I");
	  }
	  ... /* access the field using cls and fid */
	}




A global reference keeps the Java class from begin unloaded, and therefore also ensures that the field ID remains valid, as discussed in Accessing Java Fields. The native code must call DeleteGlobalRefs when it no longer needs access to the global reference; otherwise, the corresponding Java object (e.g., the Java class referenced to by cls above) will never be unloaded.

全局引用一直存在,直到Java类被卸载之后。 因此保证了在下次用到Java类的ID字段时其一直有效。 native 代码不再使用全局引用时必须调用 `DeleteGlobalRefs` 函数; 否则,对应的Java对象(如 cls引用的Java类)永远都不会被卸载。


In most cases, the native programmer should rely on the VM to free all local references after the native method returns. In certain situations, however, the native code may need to call the DeleteLocalRef function to explicitly delete a local reference. These situations are:

在大多数情况下, native 程序员应该依靠VM来释放所有的局部引用. 在某些特殊情况下,native 代码也可以调用 `DeleteLocalRef` 函数来显式地删除局部引用。这些情况包括:


You may know that you are holding the only reference to a large Java object, and you do not want to wait until the current native method returns before the Java object can be reclaimed by the garbage collector. For example, in the following program segment, the garbage collector may be able to free the Java object referred to by lref when it is running inside lengthyComputation:

引用了某个庞大的Java对象, 不想等当前 native 方法返回时才让Java对象被GC回收。例如,在下面的程序中, GC 可以释放`lref`所引用的Java对象, 而此时 lengthyComputation 方法还在执行中:


	  lref = ...            /* a large Java object */
	  ...                   /* last use of lref */
	  (*env)->DeleteLocalRef(env, lref);
	
	  lengthyComputation(); /* may take some time */
	
	  return;               /* all local refs will now be freed */
	}




You may need to create a large number of local references in a single native method invocation. This may result in an overflow of the internal JNI local reference table. It is a good idea to delete those local references that will not be needed. For example, in the following program segment, the native code iterates through a potentially large array arr consisting of java strings. After each iteration, the local reference to the string element can be freed:

也可能会在 native 方法中创建大量的局部引用。这很可能会导致 JNI local reference table 溢出. 这时候删除那些不用的局部引用是挺有必要的。 例如下面的程序中, native 代码遍历一个由 java字符串组成的大数组. 每次迭代之后,都可以释放字符串元素的局部引用:


	  for(i = 0; i < len; i++) {
	    jstring jstr = (*env)->GetObjectArrayElement(env, arr, i);
	    ...                                /* processes jstr */ 
	    (*env)->DeleteLocalRef(env, jstr); /* no longer needs jstr */
	  }




## 参考:  

- [stackoverflow: What is 'JNI Global reference'](http://stackoverflow.com/questions/112603/what-is-jni-global-reference/112720#112720)

- [Local and Global References](http://journals.ecs.soton.ac.uk/java/tutorial/native1.1/implementing/refs.html)


