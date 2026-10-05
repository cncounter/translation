## Chapter 11. Exceptions

## Java语言规范 - 第十一章 异常(Exceptions)

> Java Language Specification, 简称JLS, 翻译为: Java语言规范

When a program violates the semantic constraints of the Java programming language, the Java Virtual Machine signals this error to the program as an *exception*.

如果Java程序违反语义约束(semantic constraints), JVM就会以一个异常通知程序: “你出错了”。

An example of such a violation is an attempt to index outside the bounds of an array. Some programming languages and their implementations react to such errors by peremptorily terminating the program; other programming languages allow an implementation to react in an arbitrary or unpredictable way. Neither of these approaches is compatible with the design goals of the Java SE platform: to provide portability and robustness.

一个示例是程序代码试图访问数组边界外的索引(`index`)位置。 在某些编程语言及其实现中，如果出现此类错误, 直接会暴力终止程序; 另一些语言则没有做出明确规定, 允许运行时(实现)以任意(不确定的)方式处理。 这些处理方式都不符合Java SE平台的设计目标: 可移植性和鲁棒性(robustness)。

Instead, the Java programming language specifies that an exception will be thrown when semantic constraints are violated and will cause a non-local transfer of control from the point where the exception occurred to a point that can be specified by the programmer.

Java语言规范明确规定： 如果程序执行时违反语义约束, 就会抛出异常, 程序的执行流程会被跳到代码中预设的点。


An exception is said to be *thrown* from the point where it occurred and is said to be *caught* at the point to which control is transferred.

异常从发生错误的那个点被抛出(thrown); 跳转到预设的那个点叫做捕获(caught)。


Programs can also throw exceptions explicitly, using `throw` statements ([§14.18](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.18)).

代码中也可以显式抛出异常，即使用`throw`语句, 参考第14章: <https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.18>。

Explicit use of `throw` statements provides an alternative to the old-fashioned style of handling error conditions by returning funny values, such as the integer value `-1` where a negative value would not normally be expected. Experience shows that too often such funny values are ignored or not checked for by callers, leading to programs that are not robust, exhibit undesirable behavior, or both.

直接使用`throw`语句来抛出异常, 可以替代过去那种返回(return)某个特殊值的方式, 比如在不返回负数的情况下, 返回`-1`。 最佳实践表明, 如果这种特殊的返回值没有被调用者处理的话, 经常导致程序出错, 或者出现某些诡异的行为。

Every exception is represented by an instance of the class `Throwable` or one of its subclasses ([§11.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1)). Such an object can be used to carry information from the point at which an exception occurs to the handler that catches it. Handlers are established by `catch` clauses of `try` statements ([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20)).

每个异常对象都是 `Throwable`类或者其子类的一个实例。Exception对象可以持有错误发生时的方法调用栈, 让捕获该异常的处理程序获取到。 异常处理器是通过 `try`语句后的`catch`子句创建的, 参考: <https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20>。

During the process of throwing an exception, the Java Virtual Machine abruptly completes, one by one, any expressions, statements, method and constructor invocations, initializers, and field initialization expressions that have begun but not completed execution in the current thread. This process continues until a handler is found that indicates that it handles that particular exception by naming the class of the exception or a superclass of the class of the exception ([§11.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2)). If no such handler is found, then the exception may be handled by one of a hierarchy of uncaught exception handlers ([§11.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.3)) - thus every effort is made to avoid letting an exception go unhandled.

在异常抛出的过程中, JVM会依次中止当前线程中所有已开始但尚未执行完毕的表达式、语句、方法调用与构造函数调用、初始化器以及字段初始化表达式, 一个方法一个方法地往外跳, 直到找到对应的异常处理器为止。

这一过程会持续进行, 直到找到某个异常处理器为止——该处理器通过指明异常的类或其父类, 来表明自己可以处理这种特定的异常([§11.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2))。 如果没有找到这样的处理器, 那么异常还可以由一组按层次结构组织的未捕获异常处理器(uncaught exception handler)来处理([§11.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.3))——因此, JVM会尽力避免让异常处于无人处理的状态。

The exception mechanism of the Java SE platform is integrated with its synchronization model ([§17.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.1)), so that monitors are unlocked as `synchronized` statements ([§14.19](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.19)) and invocations of `synchronized` methods ([§8.4.3.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.3.6), [§15.12](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12)) complete abruptly.

Java SE平台的异常机制与其同步模型([§17.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.1))集成在一起, 因此当`synchronized`语句([§14.19](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.19))和`synchronized`方法调用([§8.4.3.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.3.6), [§15.12](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12))突然中止(abruptly complete)时, 对应的监视器锁(monitor)会被自动释放。


<a name="The_Kinds_of_Exceptions"></a>

## 11.1. The Kinds and Causes of Exceptions

## 11.1. 异常的类型和原因

### 11.1.1. The Kinds of Exceptions

### 11.1.1. 异常的种类

An exception is represented by an instance of the class `Throwable` (a direct subclass of `Object`) or one of its subclasses.

异常由`Throwable`类(`Object`的直接子类)或其某个子类的实例来表示。

`Throwable` and all its subclasses are, collectively, the *exception classes*.

`Throwable`及其所有子类, 统称为*异常类(exception classes)*。

The classes `Exception` and `Error` are direct subclasses of `Throwable`:

`Exception`和`Error`类是`Throwable`的直接子类:

- `Exception` is the superclass of all the exceptions from which ordinary programs may wish to recover.

- `Exception`是所有普通程序可能希望从中恢复的异常的超类。

  The class `RuntimeException` is a direct subclass of `Exception`. `RuntimeException` is the superclass of all the exceptions which may be thrown for many reasons during expression evaluation, but from which recovery may still be possible.



`RuntimeException`类是`Exception`的直接子类。 在表达式求值过程中, 可能因多种原因抛出`RuntimeException`及其子类异常, 但仍然有可能从中恢复。

  `RuntimeException` and all its subclasses are, collectively, the *run-time exception classes*.


`RuntimeException`及其所有子类, 统称为*运行时异常类(run-time exception classes)*。

- `Error` is the superclass of all the exceptions from which ordinary programs are not ordinarily expected to recover.

- `Error`是所有普通程序一般不期望从中恢复的异常的超类。

  `Error` and all its subclasses are, collectively, the *error classes*.


`Error`及其所有子类, 统称为*错误类(error classes)*。

The *unchecked exception classes* are the run-time exception classes and the error classes.

*非受检异常类(unchecked exception classes)*是指运行时异常类和错误类。

The *checked exception classes* are all exception classes other than the unchecked exception classes. That is, the checked exception classes are `Throwable` and all its subclasses other than `RuntimeException` and its subclasses and `Error` and its subclasses.

*受检异常类(checked exception classes)*是指非受检异常类之外的所有异常类。 也就是说, 受检异常类包括`Throwable`及其所有子类中, 除`RuntimeException`及其子类、`Error`及其子类之外的部分。

Programs can use the pre-existing exception classes of the Java SE platform API in `throw` statements, or define additional exception classes as subclasses of `Throwable` or of any of its subclasses, as appropriate. To take advantage of compile-time checking for exception handlers ([§11.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2)), it is typical to define most new exception classes as checked exception classes, that is, as subclasses of `Exception` that are not subclasses of `RuntimeException`.

程序可以在`throw`语句中使用Java SE平台API中已有的异常类, 也可以根据需要, 将新的异常类定义为`Throwable`或其任意子类的子类。 为了利用编译时的异常处理器检查([§11.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2)), 通常会把大多数新定义的异常类定义为受检异常类, 也就是说, 作为`Exception`的子类, 但不是`RuntimeException`的子类。

The class `Error` is a separate subclass of `Throwable`, distinct from `Exception` in the class hierarchy, to allow programs to use the idiom "`} catch (Exception e) {`" ([§11.2.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.3)) to catch all exceptions from which recovery may be possible without catching errors from which recovery is typically not possible.

`Error`类是`Throwable`的一个独立子类, 在类层次结构中与`Exception`区分开, 这样程序就可以使用"`} catch (Exception e) {`"这种惯用法([§11.2.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.3)), 捕获所有可能从中恢复的异常, 而不必捕获那些通常无法恢复的错误。

Note that a subclass of `Throwable` cannot be generic ([§8.1.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.1.2)).

注意, `Throwable`的子类不能是泛型类([§8.1.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.1.2))。

### 11.1.2. The Causes of Exceptions

### 11.1.2. 异常的成因

An exception is thrown for one of three reasons:

抛出异常的原因有以下三种:

- A `throw` statement ([§14.18](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.18)) was executed.

- 执行了某条`throw`语句([§14.18](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.18))。

- An abnormal execution condition was synchronously detected by the Java Virtual Machine, namely:

- Java虚拟机同步检测到异常的执行条件, 即:

  - evaluation of an expression violates the normal semantics of the Java programming language ([§15.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.6)), such as an integer divide by zero.
  - an error occurs while loading, linking, or initializing part of the program ([§12.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.2), [§12.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.3), [§12.4](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4)); in this case, an instance of a subclass of `LinkageError` is thrown.
  - an internal error or resource limitation prevents the Java Virtual Machine from implementing the semantics of the Java programming language; in this case, an instance of a subclass of `VirtualMachineError` is thrown.

  - 表达式求值违反了Java编程语言的正常语义([§15.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.6)), 比如整数除以零。
  - 在加载、链接或初始化程序某一部分时发生错误([§12.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.2), [§12.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.3), [§12.4](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4)); 这种情况下会抛出`LinkageError`某个子类的实例。
  - 内部错误或资源限制导致Java虚拟机无法实现Java编程语言的语义; 这种情况下会抛出`VirtualMachineError`某个子类的实例。

  These exceptions are not thrown at an arbitrary point in the program, but rather at a point where they are specified as a possible result of an expression evaluation or statement execution.


这些异常并不会在程序中的任意位置抛出, 而是在规范中指定它们可能作为表达式求值或语句执行结果的位置抛出。

- An asynchronous exception occurred ([§11.1.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1.3)).

- 发生了异步异常(asynchronous exception)([§11.1.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1.3))。

### 11.1.3. Asynchronous Exceptions

### 11.1.3. 异步异常

Most exceptions occur synchronously as a result of an action by the thread in which they occur, and at a point in the program that is specified to possibly result in such an exception. An *asynchronous exception* is, by contrast, an exception that can potentially occur at any point in the execution of a program.

大多数异常都是同步发生的, 由异常发生所在的线程的某个动作引起, 并且发生在规范中指定可能抛出这类异常的程序位置。 与此相反, *异步异常(asynchronous exception)*是指可能在程序执行过程中的任意时刻发生的异常。

Asynchronous exceptions occur only as a result of:

异步异常只在以下情况下发生:

- An invocation of the (deprecated) `stop` method of class `Thread` or `ThreadGroup`.

- 调用了`Thread`类或`ThreadGroup`类中(已废弃的)`stop`方法。

  The (deprecated) `stop` methods may be invoked by one thread to affect another thread or all the threads in a specified thread group. They are asynchronous because they may occur at any point in the execution of the other thread or threads.


(已废弃的)`stop`方法可以由一个线程调用, 去影响另一个线程或指定线程组中的所有线程。 之所以说它们是异步的, 是因为这类异常可能发生在其他线程执行过程中的任意时刻。

- An internal error or resource limitation in the Java Virtual Machine that prevents it from implementing the semantics of the Java programming language. In this case, the asynchronous exception that is thrown is an instance of a subclass of `VirtualMachineError`.

- Java虚拟机内部发生错误或资源受限, 导致它无法实现Java编程语言的语义。 这种情况下, 抛出的异步异常是`VirtualMachineError`某个子类的实例。

  Note that `StackOverflowError`, a subclass of `VirtualMachineError`, may be thrown synchronously by method invocation ([§15.12.4.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.4.5)) as well as asynchronously due to `native`method execution or Java Virtual Machine resource limitations. Similarly, `OutOfMemoryError`, another subclass of `VirtualMachineError`, may be thrown synchronously during class instance creation ([§15.9.4](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9.4), [§12.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.5)), array creation ([§15.10.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.10.2), [§10.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-10.html#jls-10.6)), class initialization ([§12.4.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4.2)), and boxing conversion ([§5.1.7](https://docs.oracle.com/javase/specs/jls/se8/html/jls-5.html#jls-5.1.7)), as well as asynchronously.


请注意, `VirtualMachineError`的子类`StackOverflowError`, 既可能因方法调用([§15.12.4.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.4.5))而同步抛出, 也可能因执行`native`方法或Java虚拟机资源受限而异步抛出。 类似地, `VirtualMachineError`的另一个子类`OutOfMemoryError`, 既可能在类实例创建([§15.9.4](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9.4), [§12.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.5))、数组创建([§15.10.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.10.2), [§10.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-10.html#jls-10.6))、类初始化([§12.4.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4.2))以及装箱转换([§5.1.7](https://docs.oracle.com/javase/specs/jls/se8/html/jls-5.html#jls-5.1.7))过程中同步抛出, 也可能异步抛出。

The Java SE platform permits a small but bounded amount of execution to occur before an asynchronous exception is thrown.

Java SE平台允许在异步异常抛出之前, 先执行少量但有上界的代码。

Asynchronous exceptions are rare, but proper understanding of their semantics is necessary if high-quality machine code is to be generated.

异步异常很少见, 但如果要生成高质量的机器代码, 就必须正确理解其语义。

The delay noted above is permitted to allow optimized code to detect and throw these exceptions at points where it is practical to handle them while obeying the semantics of the Java programming language. A simple implementation might poll for asynchronous exceptions at the point of each control transfer instruction. Since a program has a finite size, this provides a bound on the total delay in detecting an asynchronous exception. Since no asynchronous exception will occur between control transfers, the code generator has some flexibility to reorder computation between control transfers for greater performance. The paper *Polling Efficiently on Stock Hardware* by Marc Feeley, *Proc. 1993 Conference on Functional Programming and Computer Architecture*, Copenhagen, Denmark, pp. 179-187, is recommended as further reading.

上面提到的延迟是允许存在的, 目的是让优化后的代码能够在遵循Java编程语言语义的前提下, 在便于处理这些异常的位置检测并抛出它们。 一种简单的实现方式, 是在每条控制转移指令处轮询异步异常。 由于程序的大小是有限的, 这就为检测异步异常的总延迟提供了上界。 又因为两次控制转移之间不会发生异步异常, 代码生成器可以灵活地在控制转移之间重排计算, 以获得更高的性能。 想进一步了解, 推荐阅读 Marc Feeley 的论文 *Polling Efficiently on Stock Hardware*, 载于 *Proc. 1993 Conference on Functional Programming and Computer Architecture*, 丹麦哥本哈根, pp. 179-187。

## 11.2. Compile-Time Checking of Exceptions

## 11.2. 编译时对异常的检查

The Java programming language requires that a program contains handlers for *checked exceptions* which can result from execution of a method or constructor ([§8.4.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.6), [§8.8.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.8.5)). This compile-time checking for the presence of exception handlers is designed to reduce the number of exceptions which are not properly handled. For each checked exception which is a possible result, the `throws` clause for the method or constructor must mention the class of that exception or one of the superclasses of the class of that exception ([§11.2.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.3)).

Java编程语言要求, 程序必须为方法或构造函数执行时可能产生的*受检异常*(checked exceptions)提供处理器([§8.4.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.6), [§8.8.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.8.5))。 这种针对异常处理器是否存在的编译时检查, 目的是减少未被妥善处理的异常的数量。 对于每一种可能产生的受检异常, 方法或构造函数的`throws`子句必须提及该异常的类, 或该异常类的某个父类([§11.2.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.3))。

The checked exception classes ([§11.1.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1.1)) named in the `throws` clause are part of the contract between the implementor and user of the method or constructor. The `throws` clause of an overriding method may not specify that this method will result in throwing any checked exception which the overridden method is not permitted, by its `throws` clause, to throw ([§8.4.8.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.8.3)). When interfaces are involved, more than one method declaration may be overridden by a single overriding declaration. In this case, the overriding declaration must have a `throws` clause that is compatible with all the overridden declarations ([§9.4.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-9.html#jls-9.4.1)).

`throws`子句中列出的受检异常类([§11.1.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1.1)), 是方法的实现者与使用者之间契约的一部分。 重写(override)方法的`throws`子句, 不能声明会抛出被重写方法按其`throws`子句不允许抛出的任何受检异常([§8.4.8.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.8.3))。 当涉及接口时, 一个重写声明可能同时重写多个方法声明。 这种情况下, 重写声明的`throws`子句必须与所有被重写的声明兼容([§9.4.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-9.html#jls-9.4.1))。

The unchecked exception classes ([§11.1.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1.1)) are exempted from compile-time checking.

非受检异常类([§11.1.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1.1))免于编译时检查。

Error classes are exempted because they can occur at many points in the program and recovery from them is difficult or impossible. A program declaring such exceptions would be cluttered, pointlessly. Sophisticated programs may yet wish to catch and attempt to recover from some of these conditions.

错误类之所以被豁免, 是因为它们可能在程序中的许多位置出现, 而且从中恢复往往很困难甚至不可能。 如果程序声明这类异常, 代码会被无谓地搞得很乱。 不过, 复杂的程序可能仍然希望捕获这些情况中的某些, 并尝试从中恢复。

Run-time exception classes are exempted because, in the judgment of the designers of the Java programming language, having to declare such exceptions would not aid significantly in establishing the correctness of programs. Many of the operations and constructs of the Java programming language can result in exceptions at run time. The information available to a Java compiler, and the level of analysis a compiler performs, are usually not sufficient to establish that such run-time exceptions cannot occur, even though this may be obvious to the programmer. Requiring such exception classes to be declared would simply be an irritation to programmers.

运行时异常类之所以被豁免, 是因为在Java编程语言设计者的判断中, 强制声明这类异常对保证程序正确性的帮助不大。 Java编程语言的许多操作和语法结构在运行时都可能导致异常。 Java编译器所能获得的信息以及它所做的分析, 通常不足以证明这类运行时异常不会发生, 即使这对程序员来说可能显而易见。 强制声明这类异常类只会让程序员烦恼。

For example, certain code might implement a circular data structure that, by construction, can never involve null references; the programmer can then be certain that a `NullPointerException` cannot occur, but it would be difficult for a Java compiler to prove it. The theorem-proving technology that is needed to establish such global properties of data structures is beyond the scope of this specification.

例如, 某些代码可能实现了一个循环数据结构, 按其构造方式, 其中绝不会出现null引用; 程序员可以确定不会发生`NullPointerException`, 但Java编译器很难证明这一点。 要证明数据结构的这类全局性质, 所需的定理证明技术超出了本规范的范围。

We say that a statement or expression *can throw* an exception class E if, according to the rules in [§11.2.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.1) and [§11.2.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.2), the execution of the statement or expression can result in an exception of class E being thrown.

如果按照[§11.2.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.1)和[§11.2.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.2)中的规则, 某个语句或表达式的执行可能导致类E的异常被抛出, 我们就说该语句或表达式*可以抛出*(can throw)异常类E。

We say that a `catch` clause *can catch* its catchable exception class(es):

我们说某个`catch`子句*可以捕获*(can catch)它可捕获的异常类:

- The catchable exception class of a uni-`catch` clause is the declared type of its exception parameter ([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20)).
- The catchable exception classes of a multi-`catch` clause are the alternatives in the union that denotes the type of its exception parameter.

- 单类型`catch`子句(uni-`catch` clause)的可捕获异常类, 是其异常参数的声明类型([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20))。
- 多类型`catch`子句(multi-`catch` clause)的可捕获异常类, 是表示其异常参数类型的联合类型中的各个备选类型。

### 11.2.1. Exception Analysis of Expressions

### 11.2.1. 表达式的异常分析

A class instance creation expression ([§15.9](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9)) can throw an exception class E iff either:

类实例创建表达式([§15.9](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9))可以抛出异常类E, 当且仅当以下条件之一成立:

- The expression is a qualified class instance creation expression and the qualifying expression can throw E; or
- Some expression of the argument list can throw E; or
- E is one of the exception types of the invocation type of the chosen constructor ([§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.2.6)); or
- The class instance creation expression includes a *ClassBody*, and some instance initializer or instance variable initializer in the *ClassBody* can throw E.

- 该表达式是限定的类实例创建表达式(qualified class instance creation expression), 且限定表达式可以抛出E; 或
- 参数列表中的某个表达式可以抛出E; 或
- E是所选构造函数的调用类型(invocation type)的异常类型之一([§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.2.6)); 或
- 类实例创建表达式包含*ClassBody*, 且*ClassBody*中的某个实例初始化器或实例变量初始化器可以抛出E。

A method invocation expression ([§15.12](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12)) can throw an exception class E iff either:

方法调用表达式([§15.12](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12))可以抛出异常类E, 当且仅当以下条件之一成立:

- The method invocation expression is of the form *Primary* `.` *[TypeArguments]* *Identifier* and the *Primary* expression can throw E; or
- Some expression of the argument list can throw E; or
- E is one of the exception types of the invocation type of the chosen method ([§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.2.6)).

- 方法调用表达式的形式为 *Primary* `.` *[TypeArguments]* *Identifier*, 且*Primary*表达式可以抛出E; 或
- 参数列表中的某个表达式可以抛出E; 或
- E是所选方法的调用类型(invocation type)的异常类型之一([§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.2.6))。

A lambda expression ([§15.27](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.27)) can throw no exception classes.

lambda表达式([§15.27](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.27))不能抛出任何异常类。

For every other kind of expression, the expression can throw an exception class E iff one of its immediate subexpressions can throw E.

对于其他各种表达式, 只要其某个直接子表达式可以抛出异常类E, 该表达式就可以抛出异常类E。

Note that a method reference expression ([§15.13](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.13)) of the form *Primary :: [TypeArguments] Identifier* can throw an exception class if the *Primary* subexpression can throw an exception class. In contrast, a lambda expression can throw nothing, and has no immediate subexpressions on which to perform exception analysis. It is the *body* of a lambda expression, containing expressions and statements, that can throw exception classes.

注意, 形式为 *Primary :: [TypeArguments] Identifier* 的方法引用表达式([§15.13](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.13)), 如果其*Primary*子表达式可以抛出某个异常类, 那么它也可以抛出该异常类。 相比之下, lambda表达式什么都不能抛出, 也没有可进行异常分析的直接子表达式。 能抛出异常类的, 是lambda表达式的*主体*(body), 其中包含表达式和语句。

### 11.2.2. Exception Analysis of Statements

### 11.2.2. 语句的异常分析

A `throw` statement ([§14.18](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.18)) whose thrown expression has static type E and is not a final or effectively final exception parameter can throw E or any exception class that the thrown expression can throw.

如果一条`throw`语句([§14.18](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.18))的抛出表达式具有静态类型E, 且该表达式不是final或等效final的异常参数, 那么这条语句可以抛出E, 或该抛出表达式可以抛出的任何异常类。

For example, the statement `throw new java.io.FileNotFoundException();` can throw `java.io.FileNotFoundException` only. Formally, it is not the case that it "can throw" a subclass or superclass of `java.io.FileNotFoundException`.

例如, 语句`throw new java.io.FileNotFoundException();`只能抛出`java.io.FileNotFoundException`。 严格来说, 它并不"可以抛出"`java.io.FileNotFoundException`的子类或父类。

A `throw` statement whose thrown expression is a final or effectively final exception parameter of a `catch` clause C can throw an exception class E iff:

如果一条`throw`语句的抛出表达式, 是`catch`子句C的final或等效final异常参数, 那么这条语句可以抛出异常类E, 当且仅当:

- E is an exception class that the `try` block of the `try` statement which declares C can throw; and
- E is assignment compatible with any of C's catchable exception classes; and
- E is not assignment compatible with any of the catchable exception classes of the `catch` clauses declared to the left of C in the same `try` statement.

- E是声明了C的那条`try`语句的`try`块可以抛出的异常类; 且
- E与C的任何可捕获异常类都赋值兼容; 且
- E与同一条`try`语句中声明在C左侧的任何`catch`子句的可捕获异常类都不赋值兼容。

A `try` statement ([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20)) can throw an exception class E iff either:

`try`语句([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20))可以抛出异常类E, 当且仅当以下条件之一成立:

- The `try` block can throw E, or an expression used to initialize a resource (in a `try`-with-resources statement) can throw E, or the automatic invocation of the `close()` method of a resource (in a `try`-with-resources statement) can throw E, and E is not assignment compatible with any catchable exception class of any `catch` clause of the `try` statement, and either no `finally` block is present or the `finally` block can complete normally; or
- Some `catch` block of the `try` statement can throw E and either no `finally` block is present or the `finally` block can complete normally; or
- A `finally` block is present and can throw E.

- `try`块可以抛出E, 或者(在try-with-resources语句中)用于初始化资源的表达式可以抛出E, 或者(在try-with-resources语句中)对资源自动调用`close()`方法可以抛出E, 且E与`try`语句任何`catch`子句的可捕获异常类都不赋值兼容, 且要么没有`finally`块, 要么`finally`块可以正常完成; 或
- `try`语句的某个`catch`块可以抛出E, 且要么没有`finally`块, 要么`finally`块可以正常完成; 或
- 存在`finally`块, 且它可以抛出E。

An explicit constructor invocation statement ([§8.8.7.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.8.7.1)) can throw an exception class E iff either:

显式构造函数调用语句([§8.8.7.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.8.7.1))可以抛出异常类E, 当且仅当以下条件之一成立:

- Some expression of the constructor invocation's parameter list can throw E; or
- E is determined to be an exception class of the `throws` clause of the constructor that is invoked ([§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.2.6)).

- 构造函数调用参数列表中的某个表达式可以抛出E; 或
- E被确定为被调用构造函数的`throws`子句中的异常类([§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.2.6))。

Any other statement *S* can throw an exception class E iff an expression or statement immediately contained in *S* can throw E.

任何其他语句*S*可以抛出异常类E, 当且仅当*S*中直接包含的某个表达式或语句可以抛出E。

### 11.2.3. Exception Checking

### 11.2.3. 异常检查

It is a compile-time error if a method or constructor body *can throw* some exception class E when E is a checked exception class and E is not a subclass of some class declared in the `throws` clause of the method or constructor.

如果方法或构造函数体*可以抛出*某个异常类E, 且E是受检异常类, 而E不是该方法或构造函数的`throws`子句中声明的某个类的子类, 就会产生编译时错误。

It is a compile-time error if a lambda body *can throw* some exception class E when E is a checked exception class and E is not a subclass of some class declared in the `throws` clause of the function type targeted by the lambda expression.

如果lambda体*可以抛出*某个异常类E, 且E是受检异常类, 而E不是lambda表达式所目标函数类型的`throws`子句中声明的某个类的子类, 就会产生编译时错误。

It is a compile-time error if a class variable initializer ([§8.3.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.3.2)) or static initializer ([§8.7](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.7)) of a named class or interface *can throw* a checked exception class.

如果命名类或接口的类变量初始化器([§8.3.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.3.2))或静态初始化器([§8.7](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.7))*可以抛出*某个受检异常类, 就会产生编译时错误。

It is a compile-time error if an instance variable initializer ([§8.3.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.3.2)) or instance initializer ([§8.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.6)) of a named class *can throw* a checked exception class, unless the named class has at least one explicitly declared constructor and the exception class or one of its superclasses is explicitly declared in the `throws` clause of each constructor.

如果命名类的实例变量初始化器([§8.3.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.3.2))或实例初始化器([§8.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.6))*可以抛出*某个受检异常类, 就会产生编译时错误, 除非该命名类至少有一个显式声明的构造函数, 且该异常类或其某个父类在每个构造函数的`throws`子句中被显式声明。

Note that no compile-time error is due if an instance variable initializer or instance initializer of an anonymous class ([§15.9.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9.5)) can throw an exception class. In a named class, it is the responsibility of the programmer to propagate information about which exception classes can be thrown by initializers, by declaring a suitable `throws` clause on any explicit constructor declaration. This relationship between the checked exception classes thrown by a class's initializers and the checked exception classes declared by a class's constructors is assured for an anonymous class declaration, because no explicit constructor declarations are possible and a Java compiler always generates a constructor with a suitable `throws` clause for the anonymous class declaration based on the checked exception classes that its initializers can throw.

注意, 如果匿名类([§15.9.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9.5))的实例变量初始化器或实例初始化器可以抛出某个异常类, 并不会产生编译时错误。 在命名类中, 初始化器可以抛出哪些异常类的信息, 需要程序员通过在任何显式构造函数声明上声明合适的`throws`子句来传递。 而匿名类声明自动保证了类的初始化器抛出的受检异常类与类的构造函数声明的受检异常类之间的这种关系, 因为匿名类不可能有显式构造函数声明, Java编译器总是会根据匿名类初始化器可以抛出的受检异常类, 为匿名类声明生成一个带合适`throws`子句的构造函数。

It is a compile-time error if a `catch` clause *can catch* checked exception class E1 and it is not the case that the `try` block corresponding to the `catch` clause *can throw* a checked exception class that is a subclass or superclass of E1, unless E1 is `Exception` or a superclass of `Exception`.

如果某个`catch`子句*可以捕获*受检异常类E1, 而与之对应的`try`块并非*可以抛出*E1的某个子类或父类的受检异常类, 就会产生编译时错误, 除非E1是`Exception`或`Exception`的父类。

It is a compile-time error if a `catch` clause *can catch* an exception class E1 and a preceding `catch` clause of the immediately enclosing `try` statement *can catch* E1 or a superclass of E1.

如果某个`catch`子句*可以捕获*异常类E1, 而直接包围它的`try`语句中位于其前面的某个`catch`子句*可以捕获*E1或E1的父类, 就会产生编译时错误。

A Java compiler is encouraged to issue a warning if a `catch` clause can catch checked exception class E1 and the `try` block corresponding to the `catch` clause can throw checked exception class E2, where E2 `<:` E1, and a preceding `catch` clause of the immediately enclosing `try` statement can catch checked exception class E3, where E2 `<:` E3 `<:` E1.

如果某个`catch`子句可以捕获受检异常类E1, 与之对应的`try`块可以抛出受检异常类E2, 其中E2 `<:` E1, 且直接包围的`try`语句中位于其前面的某个`catch`子句可以捕获受检异常类E3, 其中E2 `<:` E3 `<:` E1, 则鼓励Java编译器发出警告。

**Example 11.2.3-1. Catching Checked Exceptions**

**示例 11.2.3-1. 捕获受检异常**

```
import java.io.*;

class StaticallyThrownExceptionsIncludeSubtypes {
    public static void main(String[] args) {
        try {
            throw new FileNotFoundException();
        } catch (IOException ioe) {
            // "catch IOException" catches IOException 
            // and any subtype.
        }

        try {
            throw new FileNotFoundException();
              // Statement "can throw" FileNotFoundException.
              // It is not the case that statement "can throw"
              // a subtype or supertype of FileNotFoundException.
        } catch (FileNotFoundException fnfe) {
            // ... Handle exception ...
        } catch (IOException ioe) {
            // Legal, but compilers are encouraged to give
            // warnings as of Java SE 7, because all subtypes of
            // IOException that the try block "can throw" have 
            // already been caught by the prior catch clause.
        }

        try {
            m();
              // m's declaration says "throws IOException", so
              // m "can throw" IOException. It is not the case
              // that m "can throw" a subtype or supertype of
              // IOException (e.g. Exception).
        } catch (FileNotFoundException fnfe) {
            // Legal, because the dynamic type of the exception 
            // might be FileNotFoundException.
        } catch (IOException ioe) {
            // Legal, because the dynamic type of the exception
            // might be a different subtype of IOException.
        } catch (Throwable t) {
            // Can always catch Throwable.
        }
    }

    static void m() throws IOException {
        throw new FileNotFoundException();
    }
}

```



By the rules above, each alternative in a multi-`catch` clause ([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20)) must be able to catch some exception class thrown by the `try` block and uncaught by previous `catch` clauses. For example, the second `catch` clause below would cause a compile-time error because exception analysis determines that `SubclassOfFoo` is already caught by the first `catch` clause:

根据上述规则, 多类型`catch`子句([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20))中的每个备选类型, 都必须能捕获`try`块抛出的、且未被前面的`catch`子句捕获的某个异常类。 例如, 下面第二个`catch`子句会导致编译时错误, 因为异常分析判定`SubclassOfFoo`已经被第一个`catch`子句捕获:

```
try { ... }
catch (Foo f) { ... }
catch (Bar | SubclassOfFoo e) { ... }

```



## 11.3. Run-Time Handling of an Exception

## 11.3. 异常的运行时处理

When an exception is thrown ([§14.18](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.18)), control is transferred from the code that caused the exception to the nearest dynamically enclosing `catch` clause, if any, of a `try` statement ([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20)) that can handle the exception.

在抛出异常时, 控制流就从引起异常的代码处，跳转到可以处理此异常的，最近的`try`语句对应的 `catch` 语句中(如果有的话)。

A statement or expression is *dynamically enclosed* by a `catch` clause if it appears within the `try` block of the `try` statement of which the `catch` clause is a part, or if the caller of the statement or expression is dynamically enclosed by the `catch` clause.

如果语句或表达式出现在`catch`子句所属的`try`语句的`try`块内, 或者该语句或表达式的调用者被该`catch`子句动态包围, 那么该语句或表达式就被这个`catch`子句*动态包围*(dynamically enclosed)。

The caller of a statement or expression depends on where it occurs:

语句或表达式的调用者取决于它出现的位置:

- If within a method, then the caller is the method invocation expression ([§15.12](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12)) that was executed to cause the method to be invoked.
- If within a constructor or an instance initializer or the initializer for an instance variable, then the caller is the class instance creation expression ([§15.9](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9)) or the method invocation of `newInstance` that was executed to cause an object to be created.
- If within a static initializer or an initializer for a `static` variable, then the caller is the expression that used the class or interface so as to cause it to be initialized ([§12.4](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4)).

- 如果在方法内, 那么调用者是导致该方法被调用而执行的方法调用表达式([§15.12](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12))。
- 如果在构造函数、实例初始化器或实例变量初始化器内, 那么调用者是导致对象被创建而执行的类实例创建表达式([§15.9](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9))或`newInstance`方法调用。
- 如果在静态初始化器或`static`变量初始化器内, 那么调用者是使用该类或接口从而触发其初始化的表达式([§12.4](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4))。

Whether a particular `catch` clause *can handle* an exception is determined by comparing the class of the object that was thrown to the catchable exception classes of the `catch` clause. The `catch` clause can handle the exception if one of its catchable exception classes is the class of the exception or a superclass of the class of the exception.

某个特定的`catch`子句*可以处理*(can handle)某个异常, 是通过比较被抛出对象的类与该`catch`子句的可捕获异常类来判定的。 如果它的某个可捕获异常类是该异常的类或该异常类的父类, 那么该`catch`子句就可以处理这个异常。

Equivalently, a `catch` clause will catch any exception object that is an `instanceof` ([§15.20.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.20.2)) one of its catchable exception classes.

等价地说, `catch`子句会捕获任何异常对象, 只要它是其某个可捕获异常类的`instanceof`([§15.20.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.20.2))。

The control transfer that occurs when an exception is thrown causes abrupt completion of expressions ([§15.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.6)) and statements ([§14.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.1)) until a `catch` clause is encountered that can handle the exception; execution then continues by executing the block of that `catch` clause. The code that caused the exception is never resumed.

抛出异常时发生的控制转移, 会导致表达式([§15.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.6))和语句([§14.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.1))突然中止, 直到遇到可以处理该异常的`catch`子句; 然后通过执行该`catch`子句的代码块继续执行。 导致异常发生的代码永远不会被恢复执行。

All exceptions (synchronous and asynchronous) are *precise*: when the transfer of control takes place, all effects of the statements executed and expressions evaluated before the point from which the exception is thrown must appear to have taken place. No expressions, statements, or parts thereof that occur after the point from which the exception is thrown may appear to have been evaluated.

所有异常(同步的和异步的)都是*精确的*(precise): 当控制转移发生时, 在异常抛出点之前执行的所有语句和求值的所有表达式, 其效果都必须看起来已经发生。 而在异常抛出点之后出现的表达式、语句或其任何部分, 都不得看起来已被求值。

If optimized code has speculatively executed some of the expressions or statements which follow the point at which the exception occurs, such code must be prepared to hide this speculative execution from the user-visible state of the program.

如果优化后的代码投机执行了异常发生点之后的某些表达式或语句, 那么这样的代码必须做好准备, 从程序的用户可见状态中隐藏这种投机执行。

If no `catch` clause that can handle an exception can be found, then the current thread (the thread that encountered the exception) is terminated. Before termination, all `finally`clauses are executed and the uncaught exception is handled according to the following rules:

如果找不到可以处理异常的`catch`子句, 那么当前线程(遇到异常的线程)会被终止。 在终止之前, 会执行所有`finally`子句, 并按以下规则处理未捕获的异常:

- If the current thread has an uncaught exception handler set, then that handler is executed.
- Otherwise, the method `uncaughtException` is invoked for the `ThreadGroup` that is the parent of the current thread. If the `ThreadGroup` and its parent `ThreadGroup`s do not override `uncaughtException`, then the default handler's `uncaughtException` method is invoked.

- 如果当前线程设置了未捕获异常处理器(uncaught exception handler), 就执行该处理器。
- 否则, 对作为当前线程父级的`ThreadGroup`调用`uncaughtException`方法。 如果该`ThreadGroup`及其父`ThreadGroup`都没有重写`uncaughtException`, 就调用默认处理器的`uncaughtException`方法。

In situations where it is desirable to ensure that one block of code is always executed after another, even if that other block of code completes abruptly, a `try` statement with a `finally`clause ([§14.20.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20.2)) may be used.

在需要确保某段代码块总是在另一段代码块之后执行的场景中, 即使后者突然中止也要执行, 可以使用带`finally`子句的`try`语句([§14.20.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20.2))。

If a `try` or `catch` block in a `try`-`finally` or `try`-`catch`-`finally` statement completes abruptly, then the `finally` clause is executed during propagation of the exception, even if no matching `catch` clause is ultimately found.

如果在`try`-`finally`或`try`-`catch`-`finally`语句中, `try`块或`catch`块突然中止, 那么在异常传播过程中会执行`finally`子句, 即使最终没有找到匹配的`catch`子句。

If a `finally` clause is executed because of abrupt completion of a `try` block and the `finally` clause itself completes abruptly, then the reason for the abrupt completion of the `try`block is discarded and the new reason for abrupt completion is propagated from there.

如果`finally`子句因为`try`块突然中止而执行, 而`finally`子句自身又突然中止, 那么`try`块突然中止的原因会被丢弃, 新的中止原因从那里继续传播。

The exact rules for abrupt completion and for the catching of exceptions are specified in detail with the specification of each statement in [§14 (*Blocks and Statements*)](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html) and for expressions in [§15 (*Expressions*)](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html) (especially [§15.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.6)).

关于突然中止和捕获异常的确切规则, 在[§14 (*块和语句*)](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html)的每条语句规范中, 以及[§15 (*表达式*)](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html)(尤其是[§15.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.6))的表达式规范中都有详细规定。


**Example 11.3-1. Throwing and Catching Exceptions**

**示例 11.3-1. 抛出异常和捕获异常**

The following program declares an exception class `TestException`. The `main` method of class `Test` invokes the `thrower` method four times, causing exceptions to be thrown three of the four times. The `try` statement in method `main` catches each exception that the thrower throws. Whether the invocation of `thrower` completes normally or abruptly, a message is printed describing what happened.

下面的代码声明了一个异常类 `TestException`。 `Test`类的`main`方法中调用了`thrower`方法, 其中有3种情形会导致异常被抛出。 `main`方法中的 `try` 语句会捕捉 `thrower` 抛出的所有异常。 不论 `thrower` 是正常完成还是被中断, 都会打印一条消息来描述发生了什么。

```
class TestException extends Exception {
    TestException()         { super(); }
    TestException(String s) { super(s); }
}

class Test {
    public static void main(String[] args) {
        for (String arg : args) {
            try {
                thrower(arg);
                System.out.println("Test \"" + arg +
                                   "\" didn't throw an exception");
            } catch (Exception e) {
                System.out.println("Test \"" + arg +
                                   "\" threw a " + e.getClass() +
                                   "\n    with message: " +
                                   e.getMessage());
            }
        }
    }
    static int thrower(String s) throws TestException {
        try {
            if (s.equals("divide")) {
                int i = 0;
                return i/i;
            }
            if (s.equals("null")) {
                s = null;
                return s.length();
            }
            if (s.equals("test")) {
                throw new TestException("Test message");
            }
            return 0;
        } finally {
            System.out.println("[thrower(\"" + s + "\") done]");
        }
    }
}

```


If we execute the program, passing it the arguments:

如果执行程序时输入的命令行启动参数为:

```
divide null not test
```

it produces the output:

则输出内容是:

```
[thrower("divide") done]
Test "divide" threw a class java.lang.ArithmeticException
    with message: / by zero
[thrower("null") done]
Test "null" threw a class java.lang.NullPointerException
    with message: null
[thrower("not") done]
Test "not" didn't throw an exception
[thrower("test") done]
Test "test" threw a class TestException
    with message: Test message
```

The declaration of the method `thrower` must have a `throws` clause because it can throw instances of `TestException`, which is a checked exception class ([§11.1.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1.1)). A compile-time error would occur if the `throws` clause were omitted.

`thrower` 方法的声明中必须指定 `throws` 子句, 因为会抛出 `TestException` 异常, 而且这是一个受检异常(<#The_Kinds_of_Exceptions>)。 如果没有指定 `throws` 子句则会发生编译时错误。

Notice that the `finally` clause is executed on every invocation of `thrower`, whether or not an exception occurs, as shown by the "`[thrower(...) done]`" output that occurs for each invocation.

请注意，每次调用 `thrower` 时都会执行 `finally` 语句块，不管有没有发生异常，从上面的输出可以看到，每次都会打印输出 `[thrower(...) done]`。


原文链接: <https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html>

