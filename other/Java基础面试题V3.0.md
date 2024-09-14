# Java语言面试题(3.0版)


## 1. 面向对象相关

### 1.1 面向对象编程有哪些优势?

> 面向对象编程, 对应的英文是 Object Oriented Programming, 简称 OOP, 其优势包括:


• Modular development of code, which leads to easy maintenance and modification.
• Reusability of code.
• Improved reliability and flexibility of code.
• Increased understanding of code.


Java 是一门基于类的, 面向对象的计算机编程语言。


### 1.2 面向对象编程有三大特征是什么?

 such as encapsulation, inheritance, polymorphism and abstraction. 


### 1.3 谈谈你对封装的理解?

Encapsulation provides objects with the ability to hide their internal characteristics and behavior. Each object provides a number of methods, which can be accessed by other objects and change its internal data. In Java, there are three access modifiers: public, private and protected. Each modifier imposes different access rights to other classes, either in the same or in external packages.

Some of the advantages of using encapsulation are listed below:
• The internal state of every objected is protected by hiding its attributes.
• It increases usability and maintenance of code, because the behavior of an object can be independently changed or extended.
• It improves modularity by preventing objects to interact with each other, in an undesired way.

You can refer to our tutorial here for more details and examples on encapsulation.


### 1.4 谈谈你对多态的理解?


Polymorphism is the ability of programming languages to present the same interface for differing underlying data types. A
polymorphic type is a type whose operations can also be applied to values of some other type.


### 1.5 谈谈你对继承的理解?


Inheritance provides an object with the ability to acquire the fields and methods of another class, called base class. Inheritance provides re-usability of code and can be used to add additional features to an existing class, without modifying it.



### 1.6 什么是抽象, 谈谈你的理解?

Abstraction is the process of separating ideas from specific instances and thus, develop classes in terms of their own functionality,
instead of their implementation details. Java supports the creation and existence of abstract classes that expose interfaces, without including the actual imp



### 1.7 抽象和封装有什么区别, 谈谈你的理解?

Abstraction and encapsulation are complementary concepts. On the one hand, abstraction focuses on the behavior of an object.
On the other hand, encapsulation focuses on the implementation of an object’s behavior. Encapsulation is usually achieved by
hiding information about the internal state of an object and thus, can be seen as a strategy used in order to provide abstraction.



## 2. Java基础相关

### 2.1 什么是JVM?

A Java virtual machine (JVM) is a process virtual machine that can execute Java bytecode. Each Java source file is compiled
into a bytecode file, which is executed by the JVM. 



### 2.2 为什么说Java是平台独立的语言?

Java was designed to allow application programs to be built that could be run on any platform, without having to be rewritten or recompiled by the programmer for each separate platform. A Java virtual machine makes this possible, because it is aware of the specific instruction lengths and other particularities of the underlying hardware platform.



### 2.3 JDK和JRE有什么区别?


The Java Runtime Environment (JRE) is basically the Java Virtual Machine (JVM) where your Java programs are being executed.
It also includes browser plugins for applet execution. The Java Development Kit (JDK) is the full featured Software Development Kit for Java, including the JRE, the compilers and tools (like JavaDoc, and Java Debugger), in order for a user to develop, compile and execute Java applications.




### 2.4 static关键字有什么作用?

The static keyword denotes that a member variable or method can be accessed, without requiring an instantiation of the class to which it belongs. A user cannot override static methods in Java, because method overriding is based upon dynamic binding at runtime and static methods are statically binded at compile time. A static method is not associated with any instance of a class so the concept is not applicable.


### 2.5 什么是静态块?



### 2.6 可以在static方法中直接调用实例方法吗?

A static variable in Java belongs to its class and its value remains the same for all its instances. A static variable is initialized
when the class is loaded by the JVM. If your code tries to access a non-static variable, without any instance, the compiler will
complain, because those variables are not created yet and they are not associated with any instance.


### 2.7 Java语言中的7大基本数据类型是什么?

The eight primitive data types supported by the Java programming language are:
• byte
• short
• char
• int
• long
• float
• double
• boolean



### 2.8 什么是自动装箱?

Autoboxing is the automatic conversion made by the Java compiler between the primitive types and their corresponding object
wrapper classes. For example, the compiler converts an int to an Integer, a double to a Double, and so on. 


示例:

### 2.9 什么是自动拆箱?

this operation is called unboxing.

示例:


### 2.10 自动装箱的底层原理是什么?


### 2.11 自动拆箱的底层原理是什么?




### 2.12 什么是方法重载?

Method overloading in Java occurs when two or more methods in the same class have the exact same name, but different
parameters. The overriding method may not limit the
access of the method it overrides.



### 2.13 什么是方法覆写?


On the other hand, method overriding is defined as the case when a child class redefines the same method as a parent
class. Overridden methods must have the same name, argument list, and return type. 




### 2.14 什么是自动生成的构造函数?


What is a Constructor, Constructor Overloading in Java and Copy-Constructor
A constructor gets invoked when a new object is created. Every class has a constructor. In case the programmer does not provide
a constructor for a class, the Java compiler (Javac) creates a default constructor for that class. The constructor overloading is
similar to method overloading in Java. Different constructors can be created for a single class. Each constructor must have its
own unique parameter list. Finally, Java does support copy constructors like C++, but the difference lies in the fact that Java
doesn’t create a default copy constructor if you don’t write your own.


### 2.15 Java支持多继承吗?


No, Java does not support multiple inheritance. Each class is able to extend only on one class, but is able to implement more than
one interfaces.



### 2.16 接口可以继承多个接口吗?


### 2.17 接口定义中可以有方法实现吗?



### 2.18 接口语抽象类有什么区别?

Java provides and supports the creation both of abstract classes and interfaces. Both implementations share some common
characteristics, but they differ in the following features:

• All methods in an interface are implicitly abstract. On the other hand, an abstract class may contain both abstract and nonabstract methods.
• A class may implement a number of Interfaces, but can extend only one abstract class.
• In order for a class to implement an interface, it must implement all its declared methods. However, a class may not implement
all declared methods of an abstract class. Though, in this case, the sub-class must also be declared as abstract.
• Abstract classes can implement interfaces without even providing the implementation of interface methods.
• Variables declared in a Java interface is by default final. An abstract class may contain non-final variables.
• Members of a Java interface are public by default. A member of an abstract class can either be private, protected or public.
• An interface is absolutely abstract and cannot be instantiated. An abstract class also cannot be instantiated, but can be invoked
if it contains a main method.




### 2.19 值传递与引用传递是怎么回事?

When an object is passed by value, this means that a copy of the object is passed. Thus, even if changes are made to that object,
it doesn’t affect the original value. When an object is passed by reference, this means that the actual object is not passed, rather
a reference of the object is passed. Thus, any changes made by the external method, are also reflected in all places.




## 3. 线程与并发


### 3.1 进程与线程有什么区别?


A process is an execution of a program, while a Thread is a single execution sequence within a process. A process can contain
multiple threads. A Thread is sometimes called a lightweight process



### 3.2 如何创建线程?


There are three ways that can be used in order for a Thread to be created:
• A class may extend the Thread class.
• A class may implement the Runnable interface.
• An application can use the Executor framework, in order to create a thread pool.
The Runnable interface is preferred, as it does not require an object to inherit the Thread class. In case your application design
requires multiple in


### 3.3 在Java中如何创建新进程?


### 3.4 Java中的线程状态有哪些?

During its execution, a thread can reside in one of the following states:
• Runnable: A thread becomes ready to run, but does not necessarily start running immediately.
• Running: The processor is actively executing the thread code.
• Waiting: A thread is in a blocked state waiting for some external processing to finish.
• Sleeping: The thread is forced to sleep.
• Blocked on I/O: Waiting for an I/O operation to complete.
• Blocked on Synchronization: Waiting to acquire a lock.
• Dead: The thread has finished its execution.



### 3.5 Java语言中同步的关键字是什么?


### 3.6 同步方法和同步块有什么区别?

In Java programming, each object has a lock. A thread can acquire the lock for an object by using the synchronized keyword.
The synchronized keyword can be applied in a method level (coarse grained lock) or block level of code (fine grained lock).




### 3.7 管程锁的原理是什么? 同步可以保证什么?


How does thread synchronization occurs inside a monitor ? What levels of synchronization can you apply ?

The JVM uses locks in conjunction with monitors. A monitor is basically a guardian that watches over a sequence of synchronized
code and ensuring that only one thread at a time executes a synchronized piece of code. Each monitor is associated with an object
reference. The thread is not allowed to execute the code until it obtains the lock.


### 3.8 什么是死锁?


What’s a deadlock ?
A condition that occurs when two processes are waiting for each other to complete, before proceeding. The result is that both
processes wait endlessly.


### 3.8 如何避免死锁?


How do you ensure that N threads can access N resources without deadlock ?
A very simple way to avoid deadlock while using N threads is to impose an ordering on the locks and force each thread to follow
that ordering. Thus, if all threads lock and unlock the mutexes in the same order, no deadlocks can arise.




## 4. 集合



### 4.1 你在编程中经常使用哪些集合类?



### 4.2 集合类的顶层接口有哪些?

Java Collections Framework provides a well designed set of interfaces and classes that support operations on a collections of
objects. The most basic interfaces that reside in the Java Collections Framework are:
• Collection, which represents a group of objects known as its elements.
• Set, which is a collection that cannot contain duplicate elements.
• List, which is an ordered collection and can contain duplicate elements.
• Map, which is an object that maps keys to values and cannot contain duplicate keys.


### 4.3 Cloneable 接口有什么作用?


### 4.4 Serializable 接口是什么? 有什么注意事项?


### 4.5 集合类为什么不实现 Cloneable 接口?

Why Collection doesn’t extend Cloneable and Serializable interfaces ?
The Collection interface specifies groups of objects known as elements. Each concrete implementation of a Collection can choose
its own way of how to maintain and order its elements. Some collections allow duplicate keys, while some other collections don’t.
The semantics and the implications of either cloning or serialization come into play when dealing with actual implementations.
Thus, the concrete implementations of collections should decide how they can be cloned or serialized.


### 4.6 集合类为什么不实现Serializable 接口?



### 4.7 Iterator 是什么? 有什么作用?

The Iterator interface provides a number of methods that are able to iterate over any Collection. Each Java Collection contains
the iterator method that returns an Iterator instance. Iterators are capable of removing elements from the underlying collection
during the iteration.



### 4.8 Iterator 和 ListIterator 有什么区别?



The differences of these elements are listed below:
• An Iterator can be used to traverse the Set and List collections, while the ListIterator can be used to iterate only over Lists.
• The Iterator can traverse a collection only in forward direction, while the ListIterator can traverse a List in both directions.
• The ListIterator implements the Iterator interface and contains extra functionality, such as adding an element, replacing an
element, getting the index position for previous and next elements, etc.


### 4.9 遍历过程中碰到修改会发生什么事?

What is difference between fail-fast and fail-safe ?
The Iterator’s fail-safe property works with the clone of the underlying collection and thus, it is not affected by any modification
in the collection. All the collection classes in java.util package are fail-fast, while the collection classes in java.util.concurrent
are fail-safe. Fail-fast iterators throw a ConcurrentModificationException, while fail-safe iterator never throws such
an exception.


### 4.10 请简述 HashMap 的实现原理?

How HashMap works in Java ?
A HashMap in Java stores key-value pairs. The HashMap requires a hash function and uses hashCode and equals methods,
in order to put and retrieve elements to and from the collection respectively. When the put method is invoked, the HashMap
calculates the hash value of the key and stores the pair in the appropriate index inside the collection. If the key exists, its value
is updated with the new value. Some important characteristics of a HashMap are its capacity, its load factor and the threshold
resizing.

What is the importance of hashCode() and equals() methods ?
In Java, a HashMap uses the hashCode and equals methods to determine the index of the key-value pair and to detect duplicates.
More specifically, the hashCode method is used in order to determine where the specified key will be stored. Since different keys
may produce the same hash value, the equals method is used, in order to determine whether the specified key actually exists in
the collection or not. Therefore, the implementation of both methods is crucial to the accuracy and efficiency of the HashMap.




### 4.11 HashMap 和 Hashtable 有什么区别?


Both the HashMap and Hashtable classes implement the Map interface and thus, have very similar characteristics. However, they
differ in the following features:
• A HashMap allows the existence of null keys and values, while a Hashtable doesn’t allow neither null keys, nor null values.
• A Hashtable is synchronized, while a HashMap is not. Thus, HashMap is preferred in single-threaded environments, while a
Hashtable is suitable for multi-threaded environments.
• A HashMap provides its set of keys and a Java application can iterate over them. Thus, a HashMap is fail-fast. On the other
hand, a Hashtable provides an Enumeration of its keys.
• The Hashtable class is considered to be a legacy class.



### 4.12 ArrayList 和数组有什么区别?

The Array and ArrayList classes differ on the following features:
• Arrays can contain primitive or objects, while an ArrayList can contain only objects.
• Arrays have fixed size, while an ArrayList is dynamic.
• An ArrayList provides more methods and features, such as addAll, removeAll, iterator, etc.
• For a list of primitive data types, the collections use autoboxing to reduce the coding effort. However, this approach makes
them slower when working on fixed size primitive data types.



### 4.13 ArrayList 和 LinkedList 有什么区别?

Both the ArrayList and LinkedList classes implement the List interface, but they differ on the following features:
• An ArrayList is an index based data structure backed by an Array. It provides random access to its elements with a performance
equal to O(1). On the other hand, a LinkedList stores its data as list of elements and every element is linked to its previous and
next element. In this case, the search operation for an element has execution time equal to O(n).
• The Insertion, addition and removal operations of an element are faster in a LinkedList compared to an ArrayList, because
there is no need of resizing an array or updating the index when an element is added in some arbitrary position inside the
collection.
• A LinkedList consumes more memory than an ArrayList, because every node in a LinkedList stores two references, one for its
previous element and one for its next element.



### 4.13 Comparable 和 Comparator 接口有什么区别?

Java provides the Comparable interface, which contains only one method, called compareTo. This method compares two objects,
in order to impose an order between them. Specifically, it returns a negative integer, zero, or a positive integer to indicate that the
input object is less than, equal or greater than the existing object. Java provides the Comparator interface, which contains two
methods, called compare and equals. The first method compares its two input arguments and imposes an order between them.
It returns a negative integer, zero, or a positive integer to indicate that the first argument is less than, equal to, or greater than
the second. The second method requires an object as a parameter and aims to decide whether the input object is equal to the
comparator. The method returns true, only if the specified object is also a comparator and it imposes the same ordering as the
comparator


### 4.14 什么是 Queue?

The PriorityQueue is an unbounded queue, based on a priority heap and its elements are ordered in their natural order. At the time
of its creation, we can provide a Comparator that is responsible for ordering the elements of the PriorityQueue. A PriorityQueue
doesn’t allow null values, those objects that doesn’t provide natural ordering, or those objects that don’t have any comparator
associated with them. Finally, the Java PriorityQueue is not thread-safe and it requires O(log(n)) time for its enqueing and
dequeing operations.


### 4.14 什么是时间复杂度?


The Big-O notation simply describes how well an algorithm scales or performs in the worst case scenario as the number of elements in a data structure increases. The Big-O notation can also be used to describe other behavior such as memory consumption.
Since the collection classes are actually data structures, we usually use the Big-O notation to chose the best implementation to
use, based on time, memory and performance. Big-O notation can give a good indication about performance for large amounts
of data.


### 4.15 在遍历过程中可以用 HashMap 来执行哪些优化?


### 4.16 Enumeration 和 Iterator 接口有什么区别?

between Enumeration and Iterator interfaces ?
Enumeration is twice as fast as compared to an Iterator and uses very less memory. However, the Iterator is much safer compared
to Enumeration, because other threads are not able to modify the collection object that is currently traversed by the iterator. Also,
Iteratorsallow the caller to remove elements from the underlying collection, something which is not possible with Enumerations.



### 4.17 HashSet 和 TreeSet 接口有什么区别?

The HashSet is Implemented using a hash table and thus, its elements are not ordered. The add, remove, and contains methods of
a HashSet have constant time complexity O(1). On the other hand, a TreeSet is implemented using a tree structure. The elements
in a TreeSet are sorted, and thus, the add, remove, and contains methods have time complexity of O(logn).




## 5. 垃圾收集



### 5.1 什么是垃圾回收?


### 5.2 在Java中什么对象可以被回收?

The purpose of garbage collection is to identify and discard those objects that are no longer needed by the application, in order for the resources to be reclaimed and reused.


### 5.3 System.gc() 有什么注意事项?

What does System.gc() and Runtime.gc() methods do ?
These methods can be used as a hint to the JVM, in order to start a garbage collection. However, this it is up to the Java Virtual Machine (JVM) to start the garbage collection immediately or later in time.



### 5.4 finalize() 方法有什么坑?

The finalize method is called by the garbage collector, just before releasing the object’s memory. It is normally advised to release resources held by the object inside the finalize method.


### 5.5 引用设置为null,对应的对象会被立即回收吗?

No, the object will be available for garbage collection in the next cycle of the garbage collector.


### 5.6 请简要描述Java堆内存的结构划分

The JVM has a heap that is the runtime data area from which memory for all class instances and arrays is allocated. It is created
at the JVM start-up. Heap memory for objects is reclaimed by an automatic memory management system which is known as a
garbage collector. Heap memory consists of live and dead objects. Live objects are accessible by the application and will not
be a subject of garbage collection. Dead objects are those which will never be accessible by the application, but have not been
collected by the garbage collector yet. Such objects occupy the heap memory space until they are eventually collected by the
garbage collector.



### 5.7 请简要描述JVM的内存区域划分


### 5.8 你认识哪些垃圾收集器?



### 5.9 对象什么变成垃圾?

An Object becomes eligible for Garbage collection in Java ?
A Java object is subject to garbage collection when it becomes unreachable to the program in which it is currently used.


### 5.10 GC会处理永久代吗?

Garbage Collection does occur in PermGen space and if PermGen space is full or cross a threshold, it can trigger a full garbage
collection. If you look carefully at the output of the garbage collector, you will find that PermGen space is also garbage collected.
This is the reason why correct sizing of PermGen space is important to avoid frequent full garbage collections. Also check our
article Java 8: PermGen to Metaspace.


## 6 异常捕获与处理


### 6.1 异常可以分为哪两类?

Java has two types of exceptions: checked exceptions and unchecked exceptions. Unchecked exceptions do not need to be
declared in a method or a constructor’s throws clause, if they can be thrown by the execution of the method or the constructor,
and propagate outside the method or constructor boundary. On the other hand, checked exceptions must be declared in a method
or a constructor’s throws clause. See here for tips on Java exception handling.



### 6.2 请简要描述异常的类层次结构


### 6.3 Exception 和 Error 有什么区别?

Exception and Error classes are both subclasses of the Throwable class. The Exception class is used for exceptional conditions
that a user’s program should catch. The Error class defines exceptions that are not excepted to be caught by the user program.


### 6.4 throw 和 throws 这两个关键字有什么区别?


主动与被动;

The throw keyword is used to explicitly raise a exception within the program. On the contrary, the throws clause is used to
indicate those exceptions that are not handled by a method. Each method must explicitly specify which exceptions does not
handle, so the callers of that method can guard against possible exceptions. Finally, multiple exceptions are separated by a comma.



### 6.5 finally语句块有什么作用?

What is the importance of finally block in exception handling ?
A finally block will always be executed, whether or not an exception is actually thrown. Even in the case where the catch
statement is missing and an exception is thrown, the finally block will still be executed. Last thing to mention is that the finally
block is used to release resources like I/O buffers, database connections, etc


### 6.6 异常处理完成后, 对应的 Exception 对象还在吗?

The Exception object will be garbage collected in the next garbage collection.


### 6.7  finally语句块 和 finalize 方法有什么区别?

How does finally block differ from finalize() method ?
A finally block will be executed whether or not an exception is thrown and is used to release those resources held by the
application. Finalize is a protected method of the Object class, which is called by the Java Virtual Machine (JVM) just before an object is garbage collected.



## 7. JDBC


### 7.1 请简单说说什么是 JDBC?

JDBC is an abstraction layer that allows users to choose between databases. JDBC enables developers to write database applications in Java, without having to concern themselves with the underlying details of a particular database.



### 7.2 请简单说说什么是JDBC驱动?

The JDBC Driver provides vendor-specific implementations of the abstract classes provided by the JDBC API. Each driver
must provide implementations for the following classes of the java.sql package:Connection, Statement, PreparedStatement,
CallableStatement, ResultSet and Driver.


### 7.3 使用JDBC时执行 `Class.forName` 方法有什么作用?

This method is used to method is used to load the driver that will establish a connection to the database.


### 7.4 PreparedStatement 和 Statement 有什么注意事项?

PreparedStatements are precompiled and thus, their performance is much better. Also, PreparedStatement objects can be reused
with different input values to their queries.

### 7.5 请简要说明你对 CallableStatement 的理解.

A CallableStatement is used to execute stored procedures. Stored procedures are stored and offered by a database. Stored
procedures may take input values from the user and may return a result. The usage of stored procedures is highly encouraged,
because it offers security and modularity.The method that prepares a CallableStatement is the following: CallableStament.
prepareCall();



### 7.6 什么是连接池?

The interaction with a database can be costly, regarding the opening and closing of database connections. Especially, when the
number of database clients increases, this cost is very high and a large number of resources is consumed.A pool of database
connections is obtained at start up by the application server and is maintained in a pool. A request for a connection is served by a
connection residing in the pool. In the end of the connection, the request is returned to the pool and can be used to satisfy future
requests.





更多阅读: 

- [Java Interview Questions](https://javacodegeeks.tradepub.com/free/w_java04/prgm.cgi?a=1)
- [Spring Interview Questions](https://javacodegeeks.tradepub.com/free/w_java10/prgm.cgi?a=1)
- [Multithreading and Concurrency Interview Questions](https://javacodegeeks.tradepub.com/free/w_java15/prgm.cgi?a=1)



