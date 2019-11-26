# How the Java virtual machine handles exceptions

> A detailed study with examples of classes and methods

# 深入分析JVM异常处理机制

> 通过类和方法的示例进行详细研究

Welcome to another installment of [**Under The Hood**](https://www.javaworld.com/blog/under-the-hood/). This column aims to give Java developers a glimpse of the mysterious mechanisms clicking and whirring beneath their running Java programs. This month's article continues the discussion of the bytecode instruction set of the Java virtual machine by examining the manner in which the Java virtual machine handles exception throwing and catching, including the relevant bytecodes. This article does not discuss `finally` clauses -- that's next month's topic. Subsequent articles will discuss other members of the bytecode family.

欢迎来到[《引擎盖下的秘密》](https://www.javaworld.com/blog/under-the-hood/)的另一期。 本专栏的目的是使Java开发人员能够一窥其运行的Java程序下的神秘机制。 本月的文章通过检查Java虚拟机处理异常引发和捕获的方式（包括相关的字节码），继续讨论Java虚拟机的字节码指令集。 本文不讨论 `finally` 子句-这是下个月的主题。 随后的文章将讨论字节码家族的其他成员。

## Exceptions

Exceptions allow you to smoothly handle unexpected conditions that occur as your programs run. To demonstrate the way the Java virtual machine handles exceptions, consider a class named `NitPickyMath` that provides methods that perform addition, subtraction, multiplication, division, and remainder on integers.

异常使您可以顺利处理程序运行时发生的意外情况。 为了演示Java虚拟机处理异常的方式，请考虑一个名为`NitPickyMath`的类，该类提供对整数执行加，减，乘，除和除法的方法。

`NitPickyMath` performs these mathematical operations the same as the normal operations offered by Java's `+`, `-`, `*`, `/`, and `%` operators, except the methods in `NitPickyMath` throw checked exceptions on overflow, underflow, and divide-by-zero conditions. The Java virtual machine will throw an `ArithmeticException` on an integer divide-by-zero, but will not throw any exceptions on overflow and underflow. The exceptions thrown by the methods of `NitPickyMath` are defined as follows:

`NitPickyMath` 执行这些数学运算的方式与Java的 `+`, `-`, `*`, `/`, and `%` 运算符提供的常规运算相同，但`NitPickyMath`中的方法会在溢出时引发检查异常 ，下溢和除零条件。 Java虚拟机将对整数除以零抛出`ArithmeticException`，但不会在上溢和下溢时引发任何异常。 NitPickyMath方法抛出的异常定义如下：

```
class OverflowException extends Exception {
}
class UnderflowException extends Exception {
}
class DivideByZeroException extends Exception {
}
```

A simple method that catches and throws exceptions is the `remainder` method of class `NitPickyMath`:

捕获并引发异常的简单方法是类`NitPickyMath`的`remainder`方法：

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

`remainder`方法仅对作为参数传递的两个`ints`进行余数运算。如果余数运算的除数为零，则余数运算将引发`ArithmeticException`。此方法捕获此`ArithmeticException`并抛出`DivideByZeroException`。

The difference between a `DivideByZero` and an `ArithmeticException` exception is that the `DivideByZeroException` is a`checked`exception and the `ArithmeticException` is`unchecked`. Because the `ArithmeticException` is unchecked, a method need not declare this exception in a throws clause even though it might throw it. Any exceptions that are subclasses of either `Error` or `RuntimeException` are unchecked. (`ArithmeticException` is a subclass of `RuntimeException`.) By catching `ArithmeticException` and then throwing `DivideByZeroException`, the `remainder` method forces its clients to deal with the possibility of a divide-by-zero exception, either by catching it or declaring `DivideByZeroException` in their own throws clauses. This is because checked exceptions, such as `DivideByZeroException`, thrown within a method must be either caught by the method or declared in the method's throws clause. Unchecked exceptions, such as `ArithmeticException`, need not be caught or declared in the throws clause.


`DivideByZero`和`ArithmeticException`异常之间的区别在于，`DivideByZeroException`是`已检查`异常，而`ArithmeticException`是`未检查`。由于未检查`ArithmeticException`，因此即使该方法可能会抛出异常，也无需在throws子句中声明此异常。属于Error或RuntimeException子类的任何异常均未选中。 （`ArithmeticException`是`RuntimeException`的子类。）通过捕获`ArithmeticException`然后抛出`DivideByZeroException`，`remainder`方法强制其客户端处理被零除的异常，方法是捕获或在自己的throws子句中声明`DivideByZeroException`。这是因为方法中引发的检查异常（例如` DivideByZeroException`）必须被方法捕获或在方法的throws子句中声明。未检查的异常，例如`ArithmeticException`，不需要在`throws`子句中捕获或声明。

`javac` generates the following bytecode sequence for the `remainder` method:

`javac`为`remainder`方法生成以下字节码序列：

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

其余方法的字节码序列分为两个部分。第一部分是该方法的正常执行路径。这部分从pc偏移量0到3。第二部分是catch子句，它从pc偏移量4到12。


The`irem`instruction in the main bytecode sequence may throw an `ArithmeticException`. If this occurs, the Java virtual machine knows to jump to the bytecode sequence that implements the catch clause by looking up and finding the exception in a table. Each method that catches exceptions is associated with an exception table that is delivered in the class file along with the bytecode sequence of the method. The exception table has one entry for each exception that is caught by each try block. Each entry has four pieces of information: the start and end points, the pc offset within the bytecode sequence to jump to, and a constant pool index of the exception class that is being caught. The exception table for the `remainder` method of class `NitPickyMath` is shown below:

主字节码序列中的 `irem` 指令可能会抛出`ArithmeticException`。如果发生这种情况，Java虚拟机将通过查找并在表中查找异常来跳转到实现catch子句的字节码序列。捕获异常的每个方法都与一个异常表相关联，该异常表与该方法的字节码序列一起在类文件中提供。对于每个try块捕获的每个异常，异常表都有一个条目。每个条目都有四段信息：起点和终点，要跳转到的字节码序列内的pc偏移以及要捕获的异常类的常量池索引。下面显示了类`NitPickyMath`的`remainder`方法的异常表：

```
Exception table:
   from   to  target type
     0     4     4   <Class java.lang.ArithmeticException>
```

The above exception table indicates that from pc offset zero through three, inclusive, `ArithmeticException` is caught. The try block's endpoint value, listed in the table under the label `to`, is always one more than the last pc offset for which the exception is caught. In this case the endpoint value is listed as four, but the last pc offset for which the exception is caught is three. This range, zero to three inclusive, corresponds to the bytecode sequence that implements the code inside the try block of `remainder`. The target listed in the table is the pc offset to jump to if an `ArithmeticException` is thrown between the pc offsets zero and three, inclusive.

上面的异常表表明，从pc偏移量0到3（包括3）（包括两端），捕获了ArithmeticException。表中标签`to`下列出的try块的端点值始终比捕获异常的最后一个pc偏移量大一个。在这种情况下，端点值列出为4，但是捕获到异常的最后一个pc偏移为3。此范围（从零到三）（包括零），与字节代码序列相对应，该字节代码序列在`其余`的try块内实现了代码。表中列出的目标是在pc偏移量0和3（含零）之间抛出 `ArithmeticException` 时要跳转到的pc偏移量。

If an exception is thrown during the execution of a method, the Java virtual machine searches through the exception table for a matching entry. An exception table entry matches if the current program counter is within the range specified by the entry, and if the exception class thrown is the exception class specified by the entry (or is a subclass of the specified exception class). The Java virtual machine searches through the exception table in the order in which the entries appear in the table. When the first match is found, the Java Virtual Machine sets the program counter to the new pc offset location and continues execution there. If no match is found, the Java virtual machine pops the current stack frame and rethrows the same exception. When the Java virtual machine pops the current stack frame, it effectively aborts execution of the current method and returns to the method that called this method. But instead of continuing execution normally in the previous method, it throws the same exception in that method, which causes the Java virtual machine to go through the same process of searching through the exception table of that method.

如果在方法执行期间引发异常，则Java虚拟机将在异常表中搜索匹配的条目。如果当前程序计数器在该条目指定的范围内，并且抛出的异常类是该条目指定的异常类（或者是指定异常类的子类），则异常表条目匹配。 Java虚拟机按照条目在表中出现的顺序搜索异常表。找到第一个匹配项后，Java虚拟机将程序计数器设置为新的pc偏移位置，并在该位置继续执行。如果未找到匹配项，则Java虚拟机将弹出当前堆栈帧并抛出相同的异常。当Java虚拟机弹出当前堆栈框架时，它将有效地中止当前方法的执行，并返回到调用此方法的方法。但是，它没有在先前的方法中正常继续执行，而是在该方法中引发了相同的异常，这使Java虚拟机经历了相同的搜索该方法的异常表的过程。


A Java programmer can throw an exception with a throw statement such as the one in the catch (`ArithmeticException`) clause of `remainder`, where a `DivideByZeroException` is created and thrown. The bytecode that does the throwing is shown in the following table:

Java程序员可以使用throw语句抛出异常，例如在mainmain的catch（`ArithmeticException`）子句中创建并抛出DivideByZeroException的异常。下表显示了进行抛出的字节码：

| Opcode   | Operand(s) | Description                              |
| -------- | ---------- | ---------------------------------------- |
|`athrow`| (none)     | pops Throwable object reference, throws the exception |

The`athrow`instruction pops the top word from the stack and expects it to be a reference to an object that is a subclass of `Throwable` (or `Throwable` itself). The exception thrown is of the type defined by the popped object reference.

`athrow`指令从堆栈中弹出最高位字，并期望它是对对象的引用，该对象是Throwable（或Throwable本身）的子类。 抛出的异常是由弹出的对象引用定义的类型。

## Play Ball!: a Java virtual machine simulation

## Play Ball！：Java虚拟机模拟

The applet below demonstrates a Java virtual machine executing a sequence of bytecodes. The bytecode sequence in the simulation was generated by `javac` for the `playBall` method of the class shown below:

下面的applet演示了执行字节码序列的Java虚拟机。 模拟中的字节码序列是由javac为下面所示类的playBall方法生成的：

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

下面显示了javac为playBall方法生成的字节码：

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

playball方法永远循环。每四分之一的循环，玩球都会抛出一个`球`并抓住它，只是因为它很有趣。因为try块和catch子句都位于无尽的while循环中，所以乐趣永远不会停止。局部变量`i`从0开始，并在每次循环中递增。当if语句为true时，每次`i`等于3时，都会抛出Ball异常。

The Java virtual machine checks the exception table and discovers that there is indeed an applicable entry. The entry's valid range is from 2 to 15, inclusive, and the exception is thrown at pc offset 12. The exception caught by the entry is of class `Ball`, and the exception thrown is of class `Ball`. Given this perfect match, the Java virtual machine pushes the thrown exception object onto the stack, and continues execution at pc offset 19. The catch clause merely resets`int``i`to 0, and the loop starts over.


Java虚拟机检查异常表并发现确实存在适用的条目。条目的有效范围是2到15（含），并且在pc偏移量12处引发异常。条目捕获的异常属于`球`类，引发的异常属于`球`类。有了这种完美匹配，Java虚拟机将抛出的异常对象压入堆栈，并在pc偏移量19处继续执行。catch子句仅将`int ``i`重置为0，然后循环重新开始。

To drive the simulation, just press the `Step` button. Each press of the `Step` button will cause the Java virtual machine to execute one bytecode instruction. To start the simulation over, press the `Reset` button. To cause the Java virtual machine to repeatedly execute bytecodes with no further coaxing on your part, press the `Run` button. The Java virtual machine will then execute the bytecodes until the `Stop` button is pressed. The text area at the bottom of the applet describes the next instruction to be executed. Happy clicking.


要进行仿真，只需按`Step`按钮。每按一次`Step`按钮将使Java虚拟机执行一个字节码指令。要重新开始仿真，请按`重置`按钮。要使Java虚拟机重复执行字节码而无需您再进行任何编码，请按`运行`按钮。然后，Java虚拟机将执行字节码，直到按下`停止`按钮为止。小程序底部的文本区域描述了要执行的下一条指令。点击愉快。

Bill Venners has been writing software professionally for 12 years. Based in Silicon Valley, he provides software consulting and training services under the name Artima Software Company. Over the years he has developed software for the consumer electronics, education, semiconductor, and life insurance industries. He has programmed in many languages on many platforms: assembly language on various microprocessors, C on Unix, C++ on Windows, Java on the Web. He is author of the book: Inside the Java Virtual Machine, published by McGraw-Hill.

Bill Venners从事专业软件编写已有12年了。他位于硅谷，以Artima Software Company的名义提供软件咨询和培训服务。多年来，他为消费电子，教育，半导体和人寿保险行业开发了软件。他在许多平台上用多种语言编程：各种微处理器上的汇编语言，Unix上的C，Windows上的C ++，Web上的Java。他是McGraw-Hill出版的《 Java虚拟机内部》一书的作者。

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

- Tim Lindholm and Frank Yellin (ISBN 0-201-63452-X) 所著的《Java虚拟机规范》,  [The Java Series](http://www.aw.com/cp/javaseries.html) 的一部分（http://www.aw.com/cp/javaseries.html）, 是Addison-Wesley的权威Java虚拟机参考。
- [http://www.aw.com/cp/lindholm-yellin.html](http://www.aw.com/cp/lindholm-yellin.html)
- [Previous Under The Hood articles](https://www.javaworld.com/blog/under-the-hood/)
- [The lean, mean virtual machine](http://www.javaworld.com/javaworld/jw-06-1996/jw-06-vm.html) -- 介绍Java虚拟机。在这里查看垃圾收集堆如何与Java虚拟机的其他部分配合。
- [The Java class file lifestyle](http://www.javaworld.com/javaworld/jw-07-1996/jw-07-classfile.html) -- 概述了Java类文件，将文件格式转换为编译所有Java程序。
- [Java's garbage-collected heap](http://www.javaworld.com/javaworld/jw-08-1996/jw-08-gc.html) -- 概述垃圾收集和垃圾收集特别是Java虚拟机的堆。
- [Bytecode basics](http://www.javaworld.com/javaworld/jw-09-1996/jw-09-bytecodes.html) -- 介绍Java虚拟机的字节码，并讨论基本类型，转换操作，尤其是堆栈操作。
- [Floating Point Arithmetic](http://www.javaworld.com/javaworld/jw-10-1996/jw-10-hood.html) -- 描述了Java虚拟机的浮点支持以及执行浮点的字节码操作。
- [Logic and Arithmetic](http://www.javaworld.com/javaworld/jw-11-1996/jw-11-hood.html) -- 描述Java虚拟机对逻辑和整数算术的支持以及相关的内容字节码。
- [Objects and Arrays](http://www.javaworld.com/javaworld/jw-12-1996/jw-12-hood.html) -- 描述了Java虚拟机如何处理对象和数组，并讨论了相关的字节码。


原文链接: <https://www.javaworld.com/article/2076868/learn-java/how-the-java-virtual-machine-handles-exceptions.html>
