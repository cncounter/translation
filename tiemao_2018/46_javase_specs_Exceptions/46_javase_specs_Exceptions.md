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

在异常抛出的过程中, JVM会依次放弃当前线程尚未执行的所有代码,一个方法一个方法地往外跳, 直到碰到对应的异常处理器为止。 包块各种表达式、语句、方法调用、构造函数、初始化语句块、属性域初始化赋值等等。

这一过程持续进行直到处理程序发现表明它处理特定的异常被命名的类异常或异常的类的父类([§11.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 11. - 11.2))。如果没有找到这样的处理程序,那么异常可能是由一个未捕获的异常处理程序的层次结构([§11.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 11. - 11.3)),因此会尽力避免让走了未处理的异常。

The exception mechanism of the Java SE platform is integrated with its synchronization model ([§17.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.1)), so that monitors are unlocked as `synchronized` statements ([§14.19](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.19)) and invocations of `synchronized` methods ([§8.4.3.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.3.6), [§15.12](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12)) complete abruptly.

Java SE平台集成的异常机制的同步模型((§17.1)(https://docs.oracle.com/javase/specs/jls/se8/html/jls - 17. # jls-17 html.1)),所以,显示器是解锁`synchronized`语句((§14.19)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 14. - 14.19))和调用`synchronized`方法((§8.4.3.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 8. - html # jls-8.4.3.6),(§15.12)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 15. - 15.))完整的突然。


<a name="The_Kinds_of_Exceptions"></a>

## 11.1. The Kinds and Causes of Exceptions

## 11.1. 异常的类型和原因

### 11.1.1. The Kinds of Exceptions

### 11.1.1。的各种异常

An exception is represented by an instance of the class `Throwable` (a direct subclass of `Object`) or one of its subclasses.

一个例外是由类的实例`Throwable`(直接的子类`Object`)或它的一个子类。

`Throwable` and all its subclasses are, collectively, the *exception classes*.

`Throwable`和所有的子类,总的来说,* *的异常类。

The classes `Exception` and `Error` are direct subclasses of `Throwable`:

的类`Exception`和`Error`直接的子类`Throwable`:

- `Exception` is the superclass of all the exceptions from which ordinary programs may wish to recover.

- `Exception`是所有的异常超类的普通程序可能希望恢复。

  The class `RuntimeException` is a direct subclass of `Exception`. `RuntimeException` is the superclass of all the exceptions which may be thrown for many reasons during expression evaluation, but from which recovery may still be possible.



类`RuntimeException`的直接子类`Exception`。`RuntimeException`超类的异常可能是扔在表达式求值的原因很多,但从复苏可能仍然是可能的。

  `RuntimeException` and all its subclasses are, collectively, the *run-time exception classes*.


`RuntimeException`和所有的子类,总的来说,* *运行时异常类。

- `Error` is the superclass of all the exceptions from which ordinary programs are not ordinarily expected to recover.

- `Error`是所有的异常超类的普通程序并不通常将恢复。

  `Error` and all its subclasses are, collectively, the *error classes*.


`Error`和所有的子类,总的来说,* *的错误类。

The *unchecked exception classes* are the run-time exception classes and the error classes.

*未经检查的异常类*是运行时异常类和类的错误。

The *checked exception classes* are all exception classes other than the unchecked exception classes. That is, the checked exception classes are `Throwable` and all its subclasses other than `RuntimeException` and its subclasses and `Error` and its subclasses.

*检查异常类*都异常类以外的其他未经检查的异常类。也就是说,检查异常类`Throwable`和其他所有的子类`RuntimeException`和它的子类`Error`和它的子类。

Programs can use the pre-existing exception classes of the Java SE platform API in `throw` statements, or define additional exception classes as subclasses of `Throwable` or of any of its subclasses, as appropriate. To take advantage of compile-time checking for exception handlers ([§11.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2)), it is typical to define most new exception classes as checked exception classes, that is, as subclasses of `Exception` that are not subclasses of `RuntimeException`.

程序可以使用预先存在的异常类的API在Java SE平台`throw`声明或定义额外的异常类的子类`Throwable`或它的任何子类,合适。利用编译时检查异常处理程序((§11.2)(https://docs.oracle.com/javase/specs/jls/se8/html/jls - 11. - html # jls-11.2)),是典型的大多数新异常类定义为检查异常类,也就是说,作为的子类`Exception`不的子类`RuntimeException`。

The class `Error` is a separate subclass of `Throwable`, distinct from `Exception` in the class hierarchy, to allow programs to use the idiom "`} catch (Exception e) {`" ([§11.2.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.3)) to catch all exceptions from which recovery may be possible without catching errors from which recovery is typically not possible.

类`Error`是一个单独的子类`Throwable`,不同于`Exception`在类层次结构,允许程序使用成语“`} catch (Exception e) {`“(§11.2.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls # jls - 11.2 - 11. - html.3)捕获所有的异常的复苏可能没有发现错误的复苏通常是不可能的。

Note that a subclass of `Throwable` cannot be generic ([§8.1.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.1.2)).

注意的一个子类`Throwable`不能通用([§8.1.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 8. - html # jls-8.1.2))。

### 11.1.2. The Causes of Exceptions

### 11.1.2。异常的原因

An exception is thrown for one of three reasons:

抛出异常的三个原因:

- A `throw` statement ([§14.18](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.18)) was executed.

- 一个`throw`语句((§14.18)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 14. - 14.))被执行死刑。

- An abnormal execution condition was synchronously detected by the Java Virtual Machine, namely:

- 异常执行由Java虚拟机同步检测条件,即:

  - evaluation of an expression violates the normal semantics of the Java programming language ([§15.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.6)), such as an integer divide by zero.
  - an error occurs while loading, linking, or initializing part of the program ([§12.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.2), [§12.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.3), [§12.4](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4)); in this case, an instance of a subclass of `LinkageError` is thrown.
  - an internal error or resource limitation prevents the Java Virtual Machine from implementing the semantics of the Java programming language; in this case, an instance of a subclass of `VirtualMachineError` is thrown.

- 评价一个表达式违背了正常的Java编程语言的语义((§15.6)(https://docs.oracle.com/javase/specs/jls/se8/html/jls - 15. # jls-15 html.6)),比如一个整数除以零。
  - 在加载时出现错误,链接,或者初始化程序的一部分((§12.2)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 12. - 12.),(§12.3)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 12. - 12.3),(§12.4)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 12. - 12.4));在这种情况下,一个子类的一个实例`LinkageError`抛出。
  - 一个内部错误或资源限制阻止Java虚拟机执行Java编程语言的语义;在这种情况下,一个子类的一个实例`VirtualMachineError`抛出。

  These exceptions are not thrown at an arbitrary point in the program, but rather at a point where they are specified as a possible result of an expression evaluation or statement execution.


这些例外不是扔在一个程序中任意点,而是他们被指定为一个可能的结果评价表达式或语句执行。

- An asynchronous exception occurred ([§11.1.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1.3)).

- 异步发生异常([§11.1.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 11. - html # jls-11.1.3))。

### 11.1.3. Asynchronous Exceptions

### 11.1.3。异步异常

Most exceptions occur synchronously as a result of an action by the thread in which they occur, and at a point in the program that is specified to possibly result in such an exception. An *asynchronous exception* is, by contrast, an exception that can potentially occur at any point in the execution of a program.

大多数异常发生同步线程由于一个动作的发生,在一个点在指定的程序可能导致这样一个例外.* * is An asynchronous的空中,与其,例外情况,可以在任何能力造成in the point execution of a方案。

Asynchronous exceptions occur only as a result of:

异步异常发生的结果:

- An invocation of the (deprecated) `stop` method of class `Thread` or `ThreadGroup`.

- 一个调用(弃用)`stop`方法的类`Thread`或`ThreadGroup`。

  The (deprecated) `stop` methods may be invoked by one thread to affect another thread or all the threads in a specified thread group. They are asynchronous because they may occur at any point in the execution of the other thread or threads.


(弃用)`stop`方法可能是由一个线程调用影响另一个线程或指定的线程组中的所有线程.他们是异步的,因为他们可能会出现在任何时候在其他线程和线程的执行。

- An internal error or resource limitation in the Java Virtual Machine that prevents it from implementing the semantics of the Java programming language. In this case, the asynchronous exception that is thrown is an instance of a subclass of `VirtualMachineError`.

- 一个内部错误或资源限制阻止它的Java虚拟机实现Java编程语言的语义.在这种情况下,异步异常,抛出的一个子类的实例`VirtualMachineError`。

  Note that `StackOverflowError`, a subclass of `VirtualMachineError`, may be thrown synchronously by method invocation ([§15.12.4.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.4.5)) as well as asynchronously due to `native`method execution or Java Virtual Machine resource limitations. Similarly, `OutOfMemoryError`, another subclass of `VirtualMachineError`, may be thrown synchronously during class instance creation ([§15.9.4](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9.4), [§12.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.5)), array creation ([§15.10.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.10.2), [§10.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-10.html#jls-10.6)), class initialization ([§12.4.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4.2)), and boxing conversion ([§5.1.7](https://docs.oracle.com/javase/specs/jls/se8/html/jls-5.html#jls-5.1.7)), as well as asynchronously.


请注意,`StackOverflowError`,一个子类`VirtualMachineError`,可能会被同步方法调用([§15.12.4.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 15. - html # jls-15.12.4.5))以及由于异步`native`方法执行或Java虚拟机资源的局限性。同样的,`OutOfMemoryError`的,另一个子类`VirtualMachineError`类实例创建期间,可能会被同步((§15.9.4](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 15. - html # jls-15.9.4),(§12.5)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 12. - 12.5)),数组创建((§15.10.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 15. - html # jls-15.10.2),(§10.6)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 10. - 10.6)),类初始化((§12.4.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 12. - html # jls-12.4.2)),((§5.1和拳击转换.7](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 5. - html # jls-5.1.7)),以及异步。

The Java SE platform permits a small but bounded amount of execution to occur before an asynchronous exception is thrown.

Java SE平台许可证数量小但有界的执行异步异常之前发生。

Asynchronous exceptions are rare, but proper understanding of their semantics is necessary if high-quality machine code is to be generated.

异步异常罕见,但正确理解的语义是必要是否生成高质量的机器代码。

The delay noted above is permitted to allow optimized code to detect and throw these exceptions at points where it is practical to handle them while obeying the semantics of the Java programming language. A simple implementation might poll for asynchronous exceptions at the point of each control transfer instruction. Since a program has a finite size, this provides a bound on the total delay in detecting an asynchronous exception. Since no asynchronous exception will occur between control transfers, the code generator has some flexibility to reorder computation between control transfers for greater performance. The paper *Polling Efficiently on Stock Hardware* by Marc Feeley, *Proc. 1993 Conference on Functional Programming and Computer Architecture*, Copenhagen, Denmark, pp. 179-187, is recommended as further reading.

允许延迟上面所提到的让优化的代码检测和扔这些异常点处理它们是实用而遵循Java编程的语义 语言。简单的实现可能会轮询异步异常点的每个控制转移指令.你在为2%的方案,在这方面finite size bound on the delay in an asynchronous总detecting空中.因为没有异步异常控制之间会发生转移,代码生成器有一些灵活性之间的重新排序计算控制转移提供更好的性能.论文投票有效股票硬件由马克•Feeley * * Proc。1993年大会在函数式编程和计算机体系结构*,哥本哈根,丹麦、pp.179 - 187,建议进一步阅读。

## 11.2. Compile-Time Checking of Exceptions

## 11.2。编译时检查的异常

The Java programming language requires that a program contains handlers for *checked exceptions* which can result from execution of a method or constructor ([§8.4.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.6), [§8.8.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.8.5)). This compile-time checking for the presence of exception handlers is designed to reduce the number of exceptions which are not properly handled. For each checked exception which is a possible result, the `throws` clause for the method or constructor must mention the class of that exception or one of the superclasses of the class of that exception ([§11.2.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.3)).

Java编程语言需要一个程序包含* *检查异常的处理程序可以从方法或者构造函数的执行结果((§8.4.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 8. - html # jls-8.4.6),(§8.8.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 8. - html # jls-8.8.5)).这个编译时检查异常处理程序的存在是为了减少异常不妥善处理.对于每个受控异常是一个可能的结果,`throws`条款的方法或者构造函数必须提到异常的类或类的超类之一,异常((§11.2.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 11. - html # jls-11.2.3))。

The checked exception classes ([§11.1.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1.1)) named in the `throws` clause are part of the contract between the implementor and user of the method or constructor. The `throws` clause of an overriding method may not specify that this method will result in throwing any checked exception which the overridden method is not permitted, by its `throws` clause, to throw ([§8.4.8.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.8.3)). When interfaces are involved, more than one method declaration may be overridden by a single overriding declaration. In this case, the overriding declaration must have a `throws` clause that is compatible with all the overridden declarations ([§9.4.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-9.html#jls-9.4.1)).

检查异常类((§11.1.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 11. - html # jls-11.1.1))命名的`throws`条款是合同的一部分的实现者和用户之间的方法或构造函数。的`throws`条款覆盖的方法可能不指定,该方法将导致抛出任何异常检查覆盖方法是不允许的,通过它`throws`条款,把([§8.4.8.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 8. - html # jls-8.4.8.3)).涉及接口时,不止一个方法声明可以覆盖一个压倒一切的宣言。在这种情况下,必须有一个压倒一切的声明`throws`兼容所有的条款覆盖声明((§9.4.1)(https://docs.oracle.com/javase/specs/jls/se8/html/jls - 9. - html # jls-9.4.1))。

The unchecked exception classes ([§11.1.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1.1)) are exempted from compile-time checking.

未经检查的异常类((§11.1.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 11. - html # jls-11.1.1))是免除编译时检查。

Error classes are exempted because they can occur at many points in the program and recovery from them is difficult or impossible. A program declaring such exceptions would be cluttered, pointlessly. Sophisticated programs may yet wish to catch and attempt to recover from some of these conditions.

错误类豁免,因为他们可以发生在许多分程序和恢复从他们是困难的或不可能的。程序声明这样的异常凌乱,漫无目标地.复杂的程序可能希望捕获并试图从这些条件中恢复过来。

Run-time exception classes are exempted because, in the judgment of the designers of the Java programming language, having to declare such exceptions would not aid significantly in establishing the correctness of programs. Many of the operations and constructs of the Java programming language can result in exceptions at run time. The information available to a Java compiler, and the level of analysis a compiler performs, are usually not sufficient to establish that such run-time exceptions cannot occur, even though this may be obvious to the programmer. Requiring such exception classes to be declared would simply be an irritation to programmers.

运行时异常类是免除,因为在Java编程语言的设计者的判断,不得不宣布这种异常不会大幅援助建立程序的正确性.的许多操作和构造Java编程语言会导致在运行时异常.信息到一个Java编译器,编译器执行水平的分析,通常是不够的建立这样的运行时异常不可能发生,尽管这可能是明显的程序员。要求这样的异常类声明只会是一个刺激的程序员。

For example, certain code might implement a circular data structure that, by construction, can never involve null references; the programmer can then be certain that a `NullPointerException` cannot occur, but it would be difficult for a Java compiler to prove it. The theorem-proving technology that is needed to establish such global properties of data structures is beyond the scope of this specification.

例如,某些代码可能实现循环数据结构,通过建设,不能包含空引用;程序员可以确定`NullPointerException`不能发生,但很难Java编译器来证明这一点.定理证明的技术,需要建立这样的全局属性数据结构超出了本规范的范围。

We say that a statement or expression *can throw* an exception class E if, according to the rules in [§11.2.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.1) and [§11.2.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.2), the execution of the statement or expression can result in an exception of class E being thrown.

我们说一个语句或表达式* E可以抛出*一个异常类,如果根据规则(§11.2.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 11. - html # jls-11.2.1)和(§11.2.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 11. - html # jls-11.2.2),声明或者表达式的执行会导致类E抛出的异常。

We say that a `catch` clause *can catch* its catchable exception class(es):

我们说一个`catch`*能*其条款明显异常类(es):

- The catchable exception class of a uni-`catch` clause is the declared type of its exception parameter ([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20)).
- The catchable exception classes of a multi-`catch` clause are the alternatives in the union that denotes the type of its exception parameter.

- The catchable exception class of uni - a`catch`子句声明类型的异常参数((§14.20)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 14. - 14.))。
- 多的明显异常类`catch`条款中选择联盟表示其异常的类型参数。

### 11.2.1. Exception Analysis of Expressions

### 11.2.1。异常的分析表达式

A class instance creation expression ([§15.9](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9)) can throw an exception class E iff either:

一个类实例创建表达式((§15.9)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 15. - 15.))可以抛出一个异常类E敌我识别:

- The expression is a qualified class instance creation expression and the qualifying expression can throw E; or
- Some expression of the argument list can throw E; or
- E is one of the exception types of the invocation type of the chosen constructor ([§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.2.6)); or
- The class instance creation expression includes a *ClassBody*, and some instance initializer or instance variable initializer in the *ClassBody* can throw E.

- 表达式是一个合格的类实例创建表达式和排位赛表达式可以把E;或
- 一些表达式的参数列表可以把E;或
- E是一种异常类型的调用构造函数的类型选择((§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 15. - html # jls-15.12.2.6));或
- 类的实例创建表达式包括* ClassBody *,和一些实例初始化或实例变量初始化* ClassBody *可以把E。

A method invocation expression ([§15.12](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12)) can throw an exception class E iff either:

一个方法调用表达式((§15.12)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 15. - 15.))可以抛出一个异常类E敌我识别:

- The method invocation expression is of the form *Primary* `.` *[TypeArguments]* *Identifier* and the *Primary* expression can throw E; or
- Some expression of the argument list can throw E; or
- E is one of the exception types of the invocation type of the chosen method ([§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.2.6)).

- 表单的方法调用表达式*主*`.`*[TypeArguments]*和*主* * *标识符表达式可以把E;或
- 一些表达式的参数列表可以把E;或
- E是一种异常类型的调用类型的选择方法((§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 15. - html # jls-15.12.2.6))。

A lambda expression ([§15.27](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.27)) can throw no exception classes.

一个lambda表达式((§15.27)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 15. - 15.))可以抛出任何异常类。

For every other kind of expression, the expression can throw an exception class E iff one of its immediate subexpressions can throw E.

对于每一个其他类型的表达式,表达式可以抛出一个异常类E敌我识别它的一个直接的子表达式可以把E。

Note that a method reference expression ([§15.13](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.13)) of the form *Primary :: [TypeArguments] Identifier* can throw an exception class if the *Primary* subexpression can throw an exception class. In contrast, a lambda expression can throw nothing, and has no immediate subexpressions on which to perform exception analysis. It is the *body* of a lambda expression, containing expressions and statements, that can throw exception classes.

注意,方法引用表达式((§15.13)(https://docs.oracle.com/javase/specs/jls/se8/html/jls - 15. # jls-15 html.*主要:13))的形式:[TypeArguments]标识符*可以抛出一个异常类,如果*主*子表达式可以抛出一个异常类.相比之下,一个lambda表达式可以扔什么,并没有立即执行异常分析的子表达式.这是lambda表达式的身体* *,包含表达式和语句,可以抛出异常类。

### 11.2.2. Exception Analysis of Statements

### 11.2.2。异常的分析报表

A `throw` statement ([§14.18](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.18)) whose thrown expression has static type E and is not a final or effectively final exception parameter can throw E or any exception class that the thrown expression can throw.

一个`throw`语句(html(§14.18)(https://docs.oracle.com/javase/specs/jls/se8/html/jls - 14. # jls-14.18)抛出表达式的静态类型E和有效final异常参数可以不是最终或扔E或者抛出的任何异常类的表达。

For example, the statement `throw new java.io.FileNotFoundException();` can throw `java.io.FileNotFoundException` only. Formally, it is not the case that it "can throw" a subclass or superclass of `java.io.FileNotFoundException`.

例如,语句`throw new java.io.FileNotFoundException();`可以把`java.io.FileNotFoundException`只有。在形式上,它并非如此“可以”或超类的一个子类`java.io.FileNotFoundException`。

A `throw` statement whose thrown expression is a final or effectively final exception parameter of a `catch` clause C can throw an exception class E iff:

一个`throw`声明抛出表达式最终或有效的最终异常的参数`catch`条款C可以抛出一个异常类E敌我识别:

- E is an exception class that the `try` block of the `try` statement which declares C can throw; and
- E is assignment compatible with any of C's catchable exception classes; and
- E is not assignment compatible with any of the catchable exception classes of the `catch` clauses declared to the left of C in the same `try` statement.

- E是一个异常类`try`块的`try`声明宣称C可以扔;和
- E是赋值兼容C的任何明显异常类;和
- E不是赋值兼容任何明显异常类的`catch`条款宣布C在左边的一样的`try`声明。

A `try` statement ([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20)) can throw an exception class E iff either:

一个`try`语句((§14.20)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 14. - 14.))可以抛出一个异常类E敌我识别:

- The `try` block can throw E, or an expression used to initialize a resource (in a `try`-with-resources statement) can throw E, or the automatic invocation of the `close()` method of a resource (in a `try`-with-resources statement) can throw E, and E is not assignment compatible with any catchable exception class of any `catch` clause of the `try` statement, and either no `finally` block is present or the `finally` block can complete normally; or
- Some `catch` block of the `try` statement can throw E and either no `finally` block is present or the `finally` block can complete normally; or
- A `finally` block is present and can throw E.

- 的`try`块可以把E,或者一个表达式用来初始化一个资源(在一个`try`与资源语句)可以把E,或自动调用的`close()`的资源(在一个方法`try`与资源声明)可以把E,E不是赋值兼容的任何明显异常类`catch`条款的`try`声明,要么没有`finally`块或礼物`finally`块可以正常完成;或
- 一些`catch`块的`try`语句可以把E,要么没有`finally`块或礼物`finally`块可以正常完成;或
- 一个`finally`块存在,可以把E。

An explicit constructor invocation statement ([§8.8.7.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.8.7.1)) can throw an exception class E iff either:

一个显式构造函数调用语句((§8.8.7.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 8. - html # jls-8.8.7.1))可以抛出一个异常类E敌我识别:

- Some expression of the constructor invocation's parameter list can throw E; or
- E is determined to be an exception class of the `throws` clause of the constructor that is invoked ([§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.2.6)).

- 一些表达式构造函数调用的参数列表可以把E;或
- E的决心是一个异常类`throws`条款的构造函数调用([§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 15. - html # jls-15.12.2.6))。

Any other statement *S* can throw an exception class E iff an expression or statement immediately contained in *S* can throw E.

任何其他声明* *可以抛出一个异常类E iff立即一个表达式或语句中包含* *可以把E。

### 11.2.3. Exception Checking

### 11.2.3。异常检查

It is a compile-time error if a method or constructor body *can throw* some exception class E when E is a checked exception class and E is not a subclass of some class declared in the `throws` clause of the method or constructor.

这是一个编译时错误,如果一个方法或者构造函数体*可以*检查一些异常类E,E是一个异常类和E不是一些类中声明的一个子类`throws`条款的方法或构造函数。

It is a compile-time error if a lambda body *can throw* some exception class E when E is a checked exception class and E is not a subclass of some class declared in the `throws` clause of the function type targeted by the lambda expression.

这是一个编译时错误如果身体λ*能*一些异常类E,E是一个受控异常类和E不是一些类中声明的一个子类`throws`函数类型的条款有针对性的lambda表达式。

It is a compile-time error if a class variable initializer ([§8.3.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.3.2)) or static initializer ([§8.7](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.7)) of a named class or interface *can throw* a checked exception class.

这是一个编译时错误如果一个类变量的初始化((§8.3.2)(https://docs.oracle.com/javase/specs/jls/se8/html/jls - 8. - html # jls-8.3.2))或静态初始化器(§8.7(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 8. - 8.7))的一个命名的类或接口*可以*检查异常类。

It is a compile-time error if an instance variable initializer ([§8.3.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.3.2)) or instance initializer ([§8.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.6)) of a named class *can throw* a checked exception class, unless the named class has at least one explicitly declared constructor and the exception class or one of its superclasses is explicitly declared in the `throws` clause of each constructor.

这是一个编译时错误如果一个实例变量的初始化((§8.3.2)(https://docs.oracle.com/javase/specs/jls/se8/html/jls - 8. - html # jls-8.3.2))或实例初始化(§8.6(https://docs.oracle.# jls-8 com/javase/specs/jls/se8/html/jls - 8. - html.6))的一个命名类*可以*检查异常类,除非指定类至少有一个显式声明构造函数和异常类或者它的一个超类中显式声明`throws`每个构造函数的条款。

Note that no compile-time error is due if an instance variable initializer or instance initializer of an anonymous class ([§15.9.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9.5)) can throw an exception class. In a named class, it is the responsibility of the programmer to propagate information about which exception classes can be thrown by initializers, by declaring a suitable `throws` clause on any explicit constructor declaration. This relationship between the checked exception classes thrown by a class's initializers and the checked exception classes declared by a class's constructors is assured for an anonymous class declaration, because no explicit constructor declarations are possible and a Java compiler always generates a constructor with a suitable `throws` clause for the anonymous class declaration based on the checked exception classes that its initializers can throw.

注意,没有编译时错误是因为如果一个实例变量初始化器或一个匿名类的实例初始化((§15.9.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html # jls-15.9.5))可以抛出一个异常类.在命名类,它是程序员的责任传播信息可以抛出异常类初始化器,通过声明一个合适的`throws`条款在任何显式的构造函数声明.这类抛出检查异常之间的关系由一个类的初始化和检查异常类声明一个类的构造函数是一个匿名类保证 声明,因为没有显式的构造函数声明是可能的和Java编译器总是生成一个构造函数与一个合适的`throws`条款的匿名类声明基于受控异常类,其初始值设定项可以扔。

It is a compile-time error if a `catch` clause *can catch* checked exception class E1 and it is not the case that the `try` block corresponding to the `catch` clause *can throw* a checked exception class that is a subclass or superclass of E1, unless E1 is `Exception` or a superclass of `Exception`.

如果它是一个编译时错误`catch`条款*能*检查异常类E1,它不是这样的`try`块对应`catch`条款*可以把*检查异常类的一个子类或父类E1,除非E1`Exception`或超类`Exception`。

It is a compile-time error if a `catch` clause *can catch* an exception class E1 and a preceding `catch` clause of the immediately enclosing `try` statement *can catch* E1 or a superclass of E1.

如果它是一个编译时错误`catch`*能*例外条款类E1和前`catch`立即封闭的条款`try`声明*能* E1或E1的超类。

A Java compiler is encouraged to issue a warning if a `catch` clause can catch checked exception class E1 and the `try` block corresponding to the `catch` clause can throw checked exception class E2, where E2 `<:` E1, and a preceding `catch` clause of the immediately enclosing `try` statement can catch checked exception class E3, where E2 `<:` E3 `<:` E1.

Java编译器发出警告,如果一个鼓励`catch`条款可以捕获异常类E1和检查`try`块对应`catch`条款可以抛出检查异常类E2,E2`<:`E1和前`catch`立即封闭的条款`try`检查语句可以捕捉异常类E3,E2`<:`E3`<:`E1。

**Example 11.2.3-1. Catching Checked Exceptions**

* * 11.2.3-1示例。已检查的异常* *

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

上述规则的,每项替代天敌in a`catch`§([条款]https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html # jls-14.20 14.20(ce)必须thrown七some例外的装置`try`块,之前未捕获`catch`条款。例如,第二`catch``SubclassOfFoo`已经被第一`catch`条款:

```
try { ... }
catch (Foo f) { ... }
catch (Bar | SubclassOfFoo e) { ... }

```



## 11.3. Run-Time Handling of an Exception

## 11.3。运行时异常的处理

When an exception is thrown ([§14.18](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.18)), control is transferred from the code that caused the exception to the nearest dynamically enclosing `catch` clause, if any, of a `try` statement ([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20)) that can handle the exception.

当一个异常((§14.18)(https://docs.oracle.com/javase/specs/jls/se8/html/jls - 14. # jls-14 html.18)),控制从引起异常的代码转移到最近的动态封闭`catch`条款(如果有的话)`try`语句((§14.20)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 14. - 14.))可以处理例外。

A statement or expression is *dynamically enclosed* by a `catch` clause if it appears within the `try` block of the `try` statement of which the `catch` clause is a part, or if the caller of the statement or expression is dynamically enclosed by the `catch` clause.

一个语句或表达式由一个*动态封闭*`catch`如果它出现在条款`try`块的`try`声明的`catch`条款是一个部分,或者调用者的声明或者表达式是动态地包围`catch`条款。

The caller of a statement or expression depends on where it occurs:

调用者的声明或者表达式取决于它出现的地方:

- If within a method, then the caller is the method invocation expression ([§15.12](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12)) that was executed to cause the method to be invoked.
- If within a constructor or an instance initializer or the initializer for an instance variable, then the caller is the class instance creation expression ([§15.9](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9)) or the method invocation of `newInstance` that was executed to cause an object to be created.
- If within a static initializer or an initializer for a `static` variable, then the caller is the expression that used the class or interface so as to cause it to be initialized ([§12.4](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4)).

- 如果在一个方法,那么调用者是方法调用表达式((§15.12)(https://docs.oracle.com/javase/specs/jls/se8/html/jls - 15. # jls-15 html.12))引起的方法被调用执行。
- 如果在一个构造函数初始化一个实例或实例变量的初始化,然后调用者是类实例创建表达式(§15.9(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 15. - 15.9))或的方法调用`newInstance`这是导致创建一个对象执行。
- 如果在一个静态初始化器或一个初始值设定项`static`变量,那么调用者的表达式使用类或接口,使它被初始化((§12.4)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 12. - 12.))。

Whether a particular `catch` clause *can handle* an exception is determined by comparing the class of the object that was thrown to the catchable exception classes of the `catch` clause. The `catch` clause can handle the exception if one of its catchable exception classes is the class of the exception or a superclass of the class of the exception.

是否一个特定的`catch`*能*例外条款是由比较的对象的类被明显的异常类`catch`条款。的`catch`条款可以处理这个异常,如果它的一个明显异常类是异常的类或类的父类的例外。

Equivalently, a `catch` clause will catch any exception object that is an `instanceof` ([§15.20.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.20.2)) one of its catchable exception classes.

同样,一个`catch`这是一个条款将会捕获任何异常对象`instanceof`([§15.20.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 15. - html # jls-15.20.2))的一个明显异常类。

The control transfer that occurs when an exception is thrown causes abrupt completion of expressions ([§15.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.6)) and statements ([§14.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.1)) until a `catch` clause is encountered that can handle the exception; execution then continues by executing the block of that `catch` clause. The code that caused the exception is never resumed.

控制转移发生时抛出异常原因突然完成表达式(html(§15.6)(https://docs.oracle.com/javase/specs/jls/se8/html/jls - 15. # jls-15.6))和语句((§14.1)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 14. - 14.)),直到一个`catch`遇到条款可以处理异常;然后继续执行由执行的块`catch`条款。导致异常的代码永远不会恢复。

All exceptions (synchronous and asynchronous) are *precise*: when the transfer of control takes place, all effects of the statements executed and expressions evaluated before the point from which the exception is thrown must appear to have taken place. No expressions, statements, or parts thereof that occur after the point from which the exception is thrown may appear to have been evaluated.

所有的异常精确(同步和异步)* *:传送控制发生时,所有执行的语句和表达式之前评估的观点发生了异常必须出现.没有表情,语句,或部分后出现的异常点的可能似乎被评估。

If optimized code has speculatively executed some of the expressions or statements which follow the point at which the exception occurs, such code must be prepared to hide this speculative execution from the user-visible state of the program.

如果有大胆执行优化代码的表达式或语句遵循发生异常的点,这样的代码必须准备隐藏这个投机执行从用户可见的程序。

If no `catch` clause that can handle an exception can be found, then the current thread (the thread that encountered the exception) is terminated. Before termination, all `finally`clauses are executed and the uncaught exception is handled according to the following rules:

如果没有`catch`条款可以处理异常可以找到,然后当前线程(遇到异常的线程)终止。在终止之前,所有`finally`条款和执行异常处理按照下列规则:

- If the current thread has an uncaught exception handler set, then that handler is executed.
- Otherwise, the method `uncaughtException` is invoked for the `ThreadGroup` that is the parent of the current thread. If the `ThreadGroup` and its parent `ThreadGroup`s do not override `uncaughtException`, then the default handler's `uncaughtException` method is invoked.

- 如果当前线程未捕获的异常处理程序集,然后处理程序执行。
- 否则,该方法`uncaughtException`被调用的`ThreadGroup`这是当前线程的母公司。如果`ThreadGroup`和它的父`ThreadGroup`年代不覆盖`uncaughtException`,那么默认处理程序的`uncaughtException`方法被调用。

In situations where it is desirable to ensure that one block of code is always executed after another, even if that other block of code completes abruptly, a `try` statement with a `finally`clause ([§14.20.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20.2)) may be used.

在需要的情况下确保总是执行一块代码,即使其他的代码块突然完成,`try`声明的`finally`条款([§14.20.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls - 14. - html # jls-14.20.2))可以使用。

If a `try` or `catch` block in a `try`-`finally` or `try`-`catch`-`finally` statement completes abruptly, then the `finally` clause is executed during propagation of the exception, even if no matching `catch` clause is ultimately found.

如果一个`try`或`catch`块在一个`try`- - - - - -`finally`或`try`- - - - - -`catch`- - - - - -`finally`突然声明完成,那么`finally`传播过程中执行条款的例外,即使没有匹配`catch`条款最终发现。

If a `finally` clause is executed because of abrupt completion of a `try` block and the `finally` clause itself completes abruptly, then the reason for the abrupt completion of the `try`block is discarded and the new reason for abrupt completion is propagated from there.

如果一个`finally`因为突然完成条款执行`try`块和`finally`突然条款本身完成,然后突然完成的原因`try`块被丢弃和新的原因突然完成传播。

The exact rules for abrupt completion and for the catching of exceptions are specified in detail with the specification of each statement in [§14 (*Blocks and Statements*)](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html) and for expressions in [§15 (*Expressions*)](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html) (especially [§15.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.6)).

突然的规则完成和捕获的异常详细指定每个语句的规范(§14(*块和语句*))(https://docs.oracle).com/javase/specs/jls/se8/html/jls - 14. - html)和表达式(§15表达式(* *))(https://docs.oracle.com/javase/specs/jls/se8/html/jls - 15. - html)(特别是(§15.6)(https://docs.oracle.com/javase/specs/jls/se8/html/jls html # jls - - 15. - 15.6))。


**Example 11.3-1. Throwing and Catching Exceptions**

** 示例 11.3-1. 抛出异常和捕获异常**

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

`thrower` 方法的声明中必须指定 `throws` 子句, 因为会抛出 `TestException` 异常, 而且这是一个受检查的异常(<#The_Kinds_of_Exceptions>)。 如果没有指定 `throws` 子句则会发生编译时错误。

Notice that the `finally` clause is executed on every invocation of `thrower`, whether or not an exception occurs, as shown by the "`[thrower(...) done]`" output that occurs for each invocation.

请注意，每次调用 `throws` 时都会执行 `finally` 语句块，不管有没有发生异常, 从上面的输出可以看到、每次都会打印输出 `[thrower(...) done]`。


原文链接: <https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html>

