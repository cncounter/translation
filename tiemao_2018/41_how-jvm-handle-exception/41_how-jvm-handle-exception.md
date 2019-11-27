# How the Java virtual machine handles exceptions

> A detailed study with examples of classes and methods

# 深入分析JVM异常处理机制

> 通过实例代码带你入手研究JVM底层对异常处理的实现原理。

Welcome to another installment of [**Under The Hood**](https://www.javaworld.com/blog/under-the-hood/). This column aims to give Java developers a glimpse of the mysterious mechanisms clicking and whirring beneath their running Java programs. This month's article continues the discussion of the bytecode instruction set of the Java virtual machine by examining the manner in which the Java virtual machine handles exception throwing and catching, including the relevant bytecodes. This article does not discuss `finally` clauses -- that's next month's topic. Subsequent articles will discuss other members of the bytecode family.

欢迎来到新一期 [《引擎盖下的秘密》](https://www.javaworld.com/blog/under-the-hood/) 。 本专栏的目的是帮助Java开发人员一窥Java程序底层的运行机制。
下面继续讨论Java虚拟机的字节码指令集, 主要是探讨Java虚拟机的处理异常机制，包括抛出异常和捕获异常的方式，以及相关的字节码。
这里暂时不讨论 `finally` 主题，留待下一期进行探讨。 随后的文章将讨论其他字节码。

## Exceptions

## 异常机制

Exceptions allow you to smoothly handle unexpected conditions that occur as your programs run. To demonstrate the way the Java virtual machine handles exceptions, consider a class named `NitPickyMath` that provides methods that perform addition, subtraction, multiplication, division, and remainder on integers.

异常机制让我们可以顺利处理程序运行过程中发生的意外情况。 为了演示Java虚拟机处理异常的方式， 假设有一个类叫做 `NitPickyMath`， 提供对整数执行 加减乘除和取余的方法。

`NitPickyMath` performs these mathematical operations the same as the normal operations offered by Java's `+`, `-`, `*`, `/`, and `%` operators, except the methods in `NitPickyMath` throw checked exceptions on overflow, underflow, and divide-by-zero conditions. The Java virtual machine will throw an `ArithmeticException` on an integer divide-by-zero, but will not throw any exceptions on overflow and underflow. The exceptions thrown by the methods of `NitPickyMath` are defined as follows:

`NitPickyMath` 类的这些数学运算方法和Java的 `+`, `-`, `*`, `/`, 和 `%` 运算符相同，但会在上溢(overflow)、下溢(underflow)、除零(divide-by-zero)时抛出受检查的异常。 Java虚拟机将对整数除以零时抛出 `ArithmeticException` ，但不会在上溢和下溢时引发任何异常。 抛出的异常定义如下：

```
class OverflowException extends Exception {
}
class UnderflowException extends Exception {
}
class DivideByZeroException extends Exception {
}
```

A simple method that catches and throws exceptions is the `remainder` method of class `NitPickyMath`:

`NitPickyMath`类的`remainder`方法捕获并抛出异常的代码是：

```
static int remainder(int dividend, int divisor)
    throws DivideByZeroException {
    try {
        return dividend % divisor;
    }
    catch (ArithmeticException e) {
        throw new DivideByZeroException();
    }
}
```

The `remainder` method simply performs the remainder operation upon the two`ints`passed as arguments. The remainder operation throws an `ArithmeticException` if the divisor of the remainder operation is a zero. This method catches this `ArithmeticException` and throws a `DivideByZeroException`.

`remainder` 方法对传进来的两个 `int` 参数进行余数运算(%取模运算)。 如果余数运算的除数为零，则余数运算将抛出 `ArithmeticException`。 此方法捕获 `ArithmeticException`并抛出`DivideByZeroException`异常。

The difference between a `DivideByZero` and an `ArithmeticException` exception is that the `DivideByZeroException` is a`checked`exception and the `ArithmeticException` is`unchecked`. Because the `ArithmeticException` is unchecked, a method need not declare this exception in a throws clause even though it might throw it. Any exceptions that are subclasses of either `Error` or `RuntimeException` are unchecked. (`ArithmeticException` is a subclass of `RuntimeException`.) By catching `ArithmeticException` and then throwing `DivideByZeroException`, the `remainder` method forces its clients to deal with the possibility of a divide-by-zero exception, either by catching it or declaring `DivideByZeroException` in their own throws clauses. This is because checked exceptions, such as `DivideByZeroException`, thrown within a method must be either caught by the method or declared in the method's throws clause. Unchecked exceptions, such as `ArithmeticException`, need not be caught or declared in the throws clause.


区别在于，`DivideByZeroException` 是受检查的异常，而`ArithmeticException` 是 不强制检查的异常。
如果不需要强制检查， 即使可能抛出异常，也可以不在 throws 子句中声明。
不强制检查的异常包括 `Error`和 `RuntimeException` 及他们的所有子类。
`remainder`方法通过捕获`ArithmeticException`并抛出`DivideByZeroException`，强制调用方去处理被零除的异常， 或者也需要声明抛出 `DivideByZeroException` 异常。
不强制检查的异常,如`ArithmeticException`，可以不捕获，也可以不在 throws 子句中声明。

`javac` generates the following bytecode sequence for the `remainder` method:

`javac` 为 `remainder` 方法生成以下字节码：

```
The main bytecode sequence for remainder:
   0 iload_0               // Push local variable 0 (arg passed as divisor)
   1 iload_1               // Push local variable 1 (arg passed as dividend)
   2 irem                  // Pop divisor, pop dividend, push remainder
   3 ireturn               // Return int on top of stack (the remainder)
The bytecode sequence for the catch (ArithmeticException) clause:
   4 pop                   // Pop the reference to the ArithmeticException
                           // because it isn't used by this catch clause.
   5 new #5 <Class DivideByZeroException>
                           // Create and push reference to new object of class
                           // DivideByZeroException.
DivideByZeroException
   8 dup           // Duplicate the reference to the new
                           // object on the top of the stack because it
                           // must be both initialized
                           // and thrown. The initialization will consume
                           // the copy of the reference created by the dup.
   9 invokenonvirtual #9 <Method DivideByZeroException.<init>()V>
                           // Call the constructor for the DivideByZeroException
                           // to initialize it. This instruction
                           // will pop the top reference to the object.
  12 athrow                // Pop the reference to a Throwable object, in this
                           // case the DivideByZeroException,
                           // and throw the exception.
```

The bytecode sequence of the `remainder` method has two separate parts. The first part is the normal path of execution for the method. This part goes from pc offset zero through three. The second part is the catch clause, which goes from pc offset four through twelve.

`remainder`方法的字节码序列分为两个部分。
第一部分是该方法的正常执行路径。这部分对应的pc偏移量是0到3。
第二部分是catch子句，对应的pc偏移量是4到12。


The`irem`instruction in the main bytecode sequence may throw an `ArithmeticException`. If this occurs, the Java virtual machine knows to jump to the bytecode sequence that implements the catch clause by looking up and finding the exception in a table. Each method that catches exceptions is associated with an exception table that is delivered in the class file along with the bytecode sequence of the method. The exception table has one entry for each exception that is caught by each try block. Each entry has four pieces of information: the start and end points, the pc offset within the bytecode sequence to jump to, and a constant pool index of the exception class that is being caught. The exception table for the `remainder` method of class `NitPickyMath` is shown below:

主字节码序列中的 `irem` 指令可能会抛出`ArithmeticException`。
如果发生这种情况，Java虚拟机将查找异常表, 并根据找到的异常跳转到实现catch子句的字节码序列。
捕获异常的每个方法都与一个异常表关联， 异常表与该方法的字节码一起放在类文件中。
try语句块的每一个异常捕获，都有一个异常表的条目对应。 每个条目有四段信息： 起点、终点，在字节码序列中跳转的pc偏移量、以及要捕获异常类对应的常量池索引。类`NitPickyMath`的`remainder`方法异常表如下所示：

```
Exception table:
   from   to  target type
     0     4     4   <Class java.lang.ArithmeticException>
```

The above exception table indicates that from pc offset zero through three, inclusive, `ArithmeticException` is caught. The try block's endpoint value, listed in the table under the label `to`, is always one more than the last pc offset for which the exception is caught. In this case the endpoint value is listed as four, but the last pc offset for which the exception is caught is three. This range, zero to three inclusive, corresponds to the bytecode sequence that implements the code inside the try block of `remainder`. The target listed in the table is the pc offset to jump to if an `ArithmeticException` is thrown between the pc offsets zero and three, inclusive.

从上面的异常表可知， from 的 pc偏移量是 [0~3]，会捕获 `ArithmeticException`。
`to`标签下列出的是 try 语句块的端点值, 恰好比要捕获异常的最后一个pc偏移量大1。
在这里， 端点值列出的是 `4`，但是捕获到异常的最后一个pc偏移是`3`。
此范围[0~3]与try语句块中代码的字节码序列相对应。
表中列出的 target 值, 是指当pc偏移量在0到3之间抛出 `ArithmeticException` 异常时, 要跳转到的pc偏移量。

If an exception is thrown during the execution of a method, the Java virtual machine searches through the exception table for a matching entry. An exception table entry matches if the current program counter is within the range specified by the entry, and if the exception class thrown is the exception class specified by the entry (or is a subclass of the specified exception class). The Java virtual machine searches through the exception table in the order in which the entries appear in the table. When the first match is found, the Java Virtual Machine sets the program counter to the new pc offset location and continues execution there. If no match is found, the Java virtual machine pops the current stack frame and rethrows the same exception. When the Java virtual machine pops the current stack frame, it effectively aborts execution of the current method and returns to the method that called this method. But instead of continuing execution normally in the previous method, it throws the same exception in that method, which causes the Java virtual machine to go through the same process of searching through the exception table of that method.

如果在方法执行过程中抛出了异常，则Java虚拟机将在异常表中查找匹配的条目。
如果当前pc的值在某个条目指定的范围内，并且抛出的异常类也是该条目指定的异常类(或者是指定异常类的子类)，则异常表条目就会匹配。
Java虚拟机按照条目在异常表中出现的顺序依次遍历。
找到第一个匹配项后，Java虚拟机将 pc 设置为新的pc偏移值，并从新位置继续执行。
如果未找到匹配项，则Java虚拟机将弹出当前栈帧, 并抛出同一个异常。
当Java虚拟机弹出当前栈帧时，也就会中止当前方法的执行，并返回到调用此方法的外层方法。
但并不是继续在外层方法中正常执行，而是在该方法中抛出同一个异常，这使得Java虚拟机继续搜索该方法的异常表, 继续执行类似的流程。


A Java programmer can throw an exception with a throw statement such as the one in the catch (`ArithmeticException`) clause of `remainder`, where a `DivideByZeroException` is created and thrown. The bytecode that does the throwing is shown in the following table:

Java程序员可以使用throw语句抛出异常，例如在 `remainder` 的 catch(`ArithmeticException`) 子句中, 创建并抛出 `DivideByZeroException` 异常。 抛出异常的字节码如下表所示：

| Opcode   | Operand(s) | Description                              |
| -------- | ---------- | ---------------------------------------- |
|`athrow`| (none)     | pops Throwable object reference, throws the exception |

The`athrow`instruction pops the top word from the stack and expects it to be a reference to an object that is a subclass of `Throwable` (or `Throwable` itself). The exception thrown is of the type defined by the popped object reference.

`athrow` 指令从堆栈中弹出最顶部的 word， 并期望这是一个引用，指向 `Throwable` 或其子类对象。
抛出的异常类型也就是弹出引用的对象类型。

## Play Ball!: a Java virtual machine simulation

## 动手实践: 模拟Java虚拟机

The applet below demonstrates a Java virtual machine executing a sequence of bytecodes. The bytecode sequence in the simulation was generated by `javac` for the `playBall` method of the class shown below:

下面的 applet 演示了执行字节码序列的Java虚拟机。 模拟的字节码序列是由javac为下面的 `playBall` 方法生成的：

```
class Ball extends Exception {
}
class Pitcher {
    private static Ball ball = new Ball();
    static void playBall() {
        int i = 0;
        while (true) {
            try {
                if (i % 4 == 3) {
                    throw ball;
                }
                ++i;
            }
            catch (Ball b) {
                i = 0;
            }
        }
    }
}
```

The bytecodes generated by `javac` for the `playBall` method are shown below:

javac为playBall方法生成的字节码如下：

```
   0 iconst_0             // Push constant 0
   1 istore_0             // Pop into local var 0: int i = 0;
                          // The try block starts here (see exception table, below).
   2 iload_0              // Push local var 0
   3 iconst_4             // Push constant 4
   4 irem                 // Calc remainder of top two operands
   5 iconst_3             // Push constant 3
   6 if_icmpne 13         // Jump if remainder not equal to 3: if (i % 4 == 3) {
                          // Push the static field at constant pool location #5,
                          // which is the Ball exception itching to be thrown
   9 getstatic #5 <Field Pitcher.ball LBall;>
  12 athrow               // Heave it home: throw ball;
  13 iinc 0 1             // Increment the int at local var 0 by 1: ++i;
                          // The try block ends here (see exception table, below).
  16 goto 2               // jump always back to 2: while (true) {}
                          // The following bytecodes implement the catch clause:
  19 pop                  // Pop the exception reference because it is unused
  20 iconst_0             // Push constant 0
  21 istore_0             // Pop into local var 0: i = 0;
  22 goto 2               // Jump always back to 2: while (true) {}
Exception table:
   from   to  target type
     2    16    19   <Class Ball>
```

The `playball` method loops forever. Every fourth pass through the loop, playball throws a `Ball` and catches it, just because it is fun. Because the try block and the catch clause are both within the endless while loop, the fun never stops. The local variable`i`starts at 0 and increments each pass through the loop. When the `if` statement is `true`, which happens every time`i`is equal to 3, the `Ball` exception is thrown.

playball 方法里面是个死循环。 每四次循环就会抛出一个 `Ball` 异常并捕获它， 只是因为它好玩。
因为try语句和catch语句都位于无限的while循环中， 所以这个程序永远不会停止。
局部变量`i`从0开始，并在每次循环中递增。 当`i`等于3时，if语句的结果为true，就会抛出 `Ball` 异常。

The Java virtual machine checks the exception table and discovers that there is indeed an applicable entry. The entry's valid range is from 2 to 15, inclusive, and the exception is thrown at pc offset 12. The exception caught by the entry is of class `Ball`, and the exception thrown is of class `Ball`. Given this perfect match, the Java virtual machine pushes the thrown exception object onto the stack, and continues execution at pc offset 19. The catch clause merely resets`int i`to 0, and the loop starts over.


Java虚拟机检查异常表并发现确实存在匹配的条目。 条目的有效范围是 [2~15]， 并且在pc偏移量12处引发`Ball`类的异常，条目捕获的异常也属于 `Ball` 类。
有了这种完美匹配，Java虚拟机将抛出的异常对象压入堆栈，并在pc偏移量19处继续执行。
catch子句仅将`int i`重置为0，然后重新开始循环。

To drive the simulation, just press the `Step` button. Each press of the `Step` button will cause the Java virtual machine to execute one bytecode instruction. To start the simulation over, press the `Reset` button. To cause the Java virtual machine to repeatedly execute bytecodes with no further coaxing on your part, press the `Run` button. The Java virtual machine will then execute the bytecodes until the `Stop` button is pressed. The text area at the bottom of the applet describes the next instruction to be executed. Happy clicking.


要进行模拟，只需按下界面中的`Step`按钮。每按一次`Step`按钮将使Java虚拟机执行一个字节码指令。要重新开始仿真，请按`Reset`按钮。
要使Java虚拟机重复执行字节码而无需您再进行任何编码，请按`Run`按钮。然后，Java虚拟机将执行字节码，直到按下`Stop`按钮为止。
小程序底部的文本区域描述了要执行的下一条指令。点击愉快。

Bill Venners has been writing software professionally for 12 years. Based in Silicon Valley, he provides software consulting and training services under the name Artima Software Company. Over the years he has developed software for the consumer electronics, education, semiconductor, and life insurance industries. He has programmed in many languages on many platforms: assembly language on various microprocessors, C on Unix, C++ on Windows, Java on the Web. He is author of the book: Inside the Java Virtual Machine, published by McGraw-Hill.

作者 Bill Venners 编写本文时已经从事软件开发12年了。
他在硅谷上班，以Artima Software Company的名义提供软件咨询和培训服务。
多年来，他为消费电子，教育，半导体和人寿保险行业开发软件。
在许多平台上用过多种语言编程： 各种微处理器上的汇编语言，Unix上的C，Windows上的C++，Web上的Java。
同时也是 McGraw-Hill 出版的《Inside the Java Virtual Machine》一书的作者。

### Learn more about this topic

###了解有关此主题的更多信息

- The book _The Java Virtual Machine Specification_, by Tim Lindholm and Frank Yellin (ISBN 0-201-63452-X), part of [The Java Series](http://www.aw.com/cp/javaseries.html), from Addison-Wesley, is be the definitive Java virtual machine reference.
- [http://www.aw.com/cp/lindholm-yellin.html](http://www.aw.com/cp/lindholm-yellin.html)
- [Previous Under The Hood articles](https://www.javaworld.com/blog/under-the-hood/)
- [The lean, mean virtual machine](http://www.javaworld.com/javaworld/jw-06-1996/jw-06-vm.html) -- Gives an introduction to the Java virtual machine. Look here to see how the garbage collected heap fits in with the other parts of the Java virtual machine.
- [The Java class file lifestyle](http://www.javaworld.com/javaworld/jw-07-1996/jw-07-classfile.html) -- Gives an overview to the Java class file, the file format into which all Java programs are compiled.
- [Java's garbage-collected heap](http://www.javaworld.com/javaworld/jw-08-1996/jw-08-gc.html) -- Gives an overview of garbage collection in general and the garbage-collected heap of the Java virtual machine in particular.
- [Bytecode basics](http://www.javaworld.com/javaworld/jw-09-1996/jw-09-bytecodes.html) -- Introduces the bytecodes of the Java virtual machine, and discusses primitive types, conversion operations, and stack operations in particular.
- [Floating Point Arithmetic](http://www.javaworld.com/javaworld/jw-10-1996/jw-10-hood.html) -- Describes the Java virtual machine's floating point support and the bytecodes that perform floating point operations.
- [Logic and Arithmetic](http://www.javaworld.com/javaworld/jw-11-1996/jw-11-hood.html) -- Describes the Java virtual machine's support for logical and integer arithmetic, and the related bytecodes.
- [Objects and Arrays](http://www.javaworld.com/javaworld/jw-12-1996/jw-12-hood.html) -- Describes how the Java virtual machine deals with objects and arrays, and discusses the relevant bytecodes.

------

- Tim Lindholm 和 Frank Yellin (ISBN 0-201-63452-X) 所著的《Java虚拟机规范》,  是Addison-Wesley的 [The Java Series](http://www.aw.com/cp/javaseries.html) 的一部分(http://www.aw.com/cp/javaseries.html) 序列的一部分。
- [http://www.aw.com/cp/lindholm-yellin.html](http://www.aw.com/cp/lindholm-yellin.html)
- [Under The Hood 系列文章](https://www.javaworld.com/blog/under-the-hood/)
- [The lean, mean virtual machine](http://www.javaworld.com/javaworld/jw-06-1996/jw-06-vm.html) -- 介绍Java虚拟机。 包括垃圾收集堆如何与Java虚拟机的其他部分配合。
- [The Java class file lifestyle](http://www.javaworld.com/javaworld/jw-07-1996/jw-07-classfile.html) -- 概述Java类文件，所有Java程序都需要编译为这种格式。
- [Java's garbage-collected heap](http://www.javaworld.com/javaworld/jw-08-1996/jw-08-gc.html) -- 概述垃圾收集, 特别是Java虚拟机的垃圾收集。
- [Bytecode basics](http://www.javaworld.com/javaworld/jw-09-1996/jw-09-bytecodes.html) -- 介绍Java虚拟机的字节码，并讨论基本类型，转换操作，尤其是栈操作。
- [Floating Point Arithmetic](http://www.javaworld.com/javaworld/jw-10-1996/jw-10-hood.html) -- 描述了Java虚拟机的浮点支持以及执行浮点的字节码操作。
- [Logic and Arithmetic](http://www.javaworld.com/javaworld/jw-11-1996/jw-11-hood.html) -- 描述Java虚拟机对逻辑运算和整数算术运算的支持以及相关的字节码。
- [Objects and Arrays](http://www.javaworld.com/javaworld/jw-12-1996/jw-12-hood.html) -- 描述了Java虚拟机如何处理对象和数组，并讨论相关的字节码。


原文链接: <https://www.javaworld.com/article/2076868/learn-java/how-the-java-virtual-machine-handles-exceptions.html>
