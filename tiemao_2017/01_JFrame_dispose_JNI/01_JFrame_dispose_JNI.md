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

**修正:** 请参考关于 [ local vs. global references](http://journals.ecs.soton.ac.uk/java/tutorial/native1.1/implementing/refs.html) 的更多信息. 其中介绍了为什么要使用全局引用(以及如何进行释放)。





## 回答2



A JNI global reference is a reference from "native" code to a Java object managed by the Java garbage collector. Its purpose is to prevent collection of an object that is still in use by native code, but doesn't appear to have any live references in the Java code.

JNI全局引用(JNI global reference), 是从 "native" 代码中指向堆内存里Java对象的引用. 其存在的目的是为了阻止垃圾收集器, 不要误将 native 代码仍在使用的对象给回收了, 假如这些Java对象没有其他代码引用到他们的话。


A JFrame is a java.awt.Window, and is associated with a "native" Window object. When you are completely finished with a particular JFrame instance, you should invoke its dispose() method to clean up.

一个 JFrame 实例就是一个窗口(`java.awt.Window`), 并关联到一个本地的 Window 对象。如果某个特定 JFrame 实例的任务已经结束,那么就应该调用 `dispose()` 方法来进行清理。


I am not sure if any native code is creating a global reference to the JFrame, but it seems likely. If it does, this will prevent the JFrame from being garbage collected. If you are creating many Windows (or subclasses) and seeing that they are never collected, make sure that they are disposed.

我不确定本地代码是否创建了一个全局引用指向 JFrame, 但应该是这样没错。如果确实创建了全局引用, 那就会阻止 JFrame 对象被GC回收. 如果程序中创建了许多 Window 对象(或者其子类), 又没有调用 dispose(), 则他们永远不会被GC回收掉, 这就造成了隐形的内存泄露。


## Local and Global References

## 局部引用和全局引用简介


So far, we have used data types such as jobject, jclass, and jstring to denote references to Java objects. The JNI creates references for all object arguments passed in to native methods, as well as all objects returned from JNI functions.

到目前为止,我们已经使用数据类型,如jobject jclass,jstring表示对Java对象的引用.JNI创建引用的所有对象的参数传递给本地方法,以及所有从JNI函数返回对象。


These references will keep the Java objects from being garbage collected. To make sure that Java objects can eventually be freed, the JNI by default creates local references. Local references become invalid when the execution returns from the native method in which the local reference is created. Therefore, a native method must not store away a local reference and expect to reuse it in subsequent invocations.

这些引用将Java对象被垃圾收集。确保Java对象可以最终被释放,JNI默认创建本地引用.本地引用成为无效的本机方法的执行返回创建的本地引用.因此,本机方法不得储存地方引用,并期待在后续调用重用它。


For example, the following program (a variation of the native method in FieldAccess.c) mistakenly caches the Java class for the field ID so that it does not have to repeatedly search for the field ID based on the field name and signature:

例如,以下程序(FieldAccess本机方法的一种变体.c)错误地缓存的Java类字段ID,不必反复搜索字段ID基于字段名称和签名:


	/* This code is illegal */
	static jclass cls = 0;
	static jfieldID fld;

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
To overcome this problem, you need to create a global reference. This global reference will remain valid until it is explicitly freed:

这一方案的相同,强奸的地方GetObjectClass参考,以便增进对哥伦比亚土著人在英国astm d1078 - 05.当Java_FieldAccess_accessField is the second绞刑,每年将由当地references无效。这一结果作这种权利leads to a VM坠毁。
为了克服这个问题,您需要创建一个全球参考。这个全局引用将仍然有效,直到显式释放:


	/* This code is OK */
	static jclass cls = 0;
	static jfieldID fld;

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

一全局引用Java类从开始卸货,因此也确保了字段ID仍然有效,作为讨论访问Java字段.本机代码必须调用deleteglobalref当它不再需要访问全球引用;否则,对应的Java对象(如.上面引用的Java类,由cls)永远不会被卸载。


In most cases, the native programmer should rely on the VM to free all local references after the native method returns. In certain situations, however, the native code may need to call the DeleteLocalRef function to explicitly delete a local reference. These situations are:

在大多数情况下,本机程序员应该依靠VM免费的本机方法返回后所有的本地引用.在某些情况下,然而,本机代码可能需要调用DeleteLocalRef函数显式地删除本地引用。这些情况是:


You may know that you are holding the only reference to a large Java object, and you do not want to wait until the current native method returns before the Java object can be reclaimed by the garbage collector. For example, in the following program segment, the garbage collector may be able to free the Java object referred to by lref when it is running inside lengthyComputation:

你可能知道你的唯一参考Java对象,你不想等待,直到当前的本地方法返回之前的Java对象可以被垃圾回收器回收.例如,在下面的程序段,垃圾收集器可以免费的Java对象引用lref lengthyComputation内部运行时:


	  lref = ...            /* a large Java object */
	  ...                   /* last use of lref */
	  (*env)->DeleteLocalRef(env, lref);

	  lengthyComputation(); /* may take some time */

	  return;               /* all local refs will now be freed */
	}




You may need to create a large number of local references in a single native method invocation. This may result in an overflow of the internal JNI local reference table. It is a good idea to delete those local references that will not be needed. For example, in the following program segment, the native code iterates through a potentially large array arr consisting of java strings. After each iteration, the local reference to the string element can be freed:

您可能需要创建大量的本地引用一个本地方法调用。这可能会导致一个溢出的内部JNI本地参考表.这是一个好主意删除那些不需要的本地引用.例如,在下面的程序段,本机代码遍历一个潜在的大阵arr java字符串组成.每一次迭代后,本地引用字符串元素可以释放:


	  for(i = 0; i < len; i++) {
	    jstring jstr = (*env)->GetObjectArrayElement(env, arr, i);
	    ...                                /* processes jstr */ 
	    (*env)->DeleteLocalRef(env, jstr); /* no longer needs jstr */
	  }




## 参考:  

- [stackoverflow: What is 'JNI Global reference'](http://stackoverflow.com/questions/112603/what-is-jni-global-reference/112720#112720)

- [Local and Global References](http://journals.ecs.soton.ac.uk/java/tutorial/native1.1/implementing/refs.html)


