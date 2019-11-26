# How the Java virtual machine handles exceptions

### A detailed study with examples of classes and methods

Welcome to another installment of **Under The Hood**. This column aims to give Java developers a glimpse of the mysterious mechanisms clicking and whirring beneath their running Java programs. This month's article continues the discussion of the bytecode instruction set of the Java virtual machine by examining the manner in which the Java virtual machine handles exception throwing and catching, including the relevant bytecodes. This article does not discuss `finally` clauses -- that's next month's topic. Subsequent articles will discuss other members of the bytecode family.

## Exceptions

Exceptions allow you to smoothly handle unexpected conditions that occur as your programs run. To demonstrate the way the Java virtual machine handles exceptions, consider a class named

`NitPickyMath`

that provides methods that perform addition, subtraction, multiplication, division, and remainder on integers.

`NitPickyMath`

performs these mathematical operations the same as the normal operations offered by Java's `+`, `-`, `*`, `/`, and `%` operators, except the methods in

`NitPickyMath`


throw checked exceptions on overflow, underflow, and divide-by-zero conditions. The Java virtual machine will throw an

`ArithmeticException`

on an integer divide-by-zero, but will not throw any exceptions on overflow and underflow. The exceptions thrown by the methods of

`NitPickyMath`

are defined as follows:

```
class OverflowException extends Exception {
}
class UnderflowException extends Exception {
}
class DivideByZeroException extends Exception {
}
```

A simple method that catches and throws exceptions is the `remainder` method of class `NitPickyMath`:

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

The `remainder` method simply performs the remainder operation upon the two *ints* passed as arguments. The remainder operation throws an `ArithmeticException` if the divisor of the remainder operation is a zero. This method catches this `ArithmeticException` and throws a `DivideByZeroException`.

The difference between a `DivideByZero` and an `ArithmeticException` exception is that the `DivideByZeroException` is a *checked* exception and the `ArithmeticException` is *unchecked*. Because the `ArithmeticException` is unchecked, a method need not declare this exception in a throws clause even though it might throw it. Any exceptions that are subclasses of either `Error` or `RuntimeException` are unchecked. (`ArithmeticException` is a subclass of `RuntimeException`.) By catching `ArithmeticException` and then throwing `DivideByZeroException`, the `remainder` method forces its clients to deal with the possibility of a divide-by-zero exception, either by catching it or declaring `DivideByZeroException` in their own throws clauses. This is because checked exceptions, such as `DivideByZeroException`, thrown within a method must be either caught by the method or declared in the method's throws clause. Unchecked exceptions, such as `ArithmeticException`, need not be caught or declared in the throws clause.

`javac` generates the following bytecode sequence for the `remainder` method:

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

The *irem* instruction in the main bytecode sequence may throw an `ArithmeticException`. If this occurs, the Java virtual machine knows to jump to the bytecode sequence that implements the catch clause by looking up and finding the exception in a table. Each method that catches exceptions is associated with an exception table that is delivered in the class file along with the bytecode sequence of the method. The exception table has one entry for each exception that is caught by each try block. Each entry has four pieces of information: the start and end points, the pc offset within the bytecode sequence to jump to, and a constant pool index of the exception class that is being caught. The exception table for the `remainder` method of class `NitPickyMath` is shown below:

```
Exception table:
   from   to  target type
     0     4     4   <Class java.lang.ArithmeticException>
```

The above exception table indicates that from pc offset zero through three, inclusive, `ArithmeticException` is caught. The try block's endpoint value, listed in the table under the label `to`, is always one more than the last pc offset for which the exception is caught. In this case the endpoint value is listed as four, but the last pc offset for which the exception is caught is three. This range, zero to three inclusive, corresponds to the bytecode sequence that implements the code inside the try block of `remainder`. The target listed in the table is the pc offset to jump to if an `ArithmeticException` is thrown between the pc offsets zero and three, inclusive.

If an exception is thrown during the execution of a method, the Java virtual machine searches through the exception table for a matching entry. An exception table entry matches if the current program counter is within the range specified by the entry, and if the exception class thrown is the exception class specified by the entry (or is a subclass of the specified exception class). The Java virtual machine searches through the exception table in the order in which the entries appear in the table. When the first match is found, the Java Virtual Machine sets the program counter to the new pc offset location and continues execution there. If no match is found, the Java virtual machine pops the current stack frame and rethrows the same exception. When the Java virtual machine pops the current stack frame, it effectively aborts execution of the current method and returns to the method that called this method. But instead of continuing execution normally in the previous method, it throws the same exception in that method, which causes the Java virtual machine to go through the same process of searching through the exception table of that method.

A Java programmer can throw an exception with a throw statement such as the one in the catch (`ArithmeticException`) clause of `remainder`, where a `DivideByZeroException` is created and thrown. The bytecode that does the throwing is shown in the following table:

| Opcode   | Operand(s) | Description                              |
| -------- | ---------- | ---------------------------------------- |
| *athrow* | (none)     | pops Throwable object reference, throws the exception |

The *athrow* instruction pops the top word from the stack and expects it to be a reference to an object that is a subclass of `Throwable` (or `Throwable` itself). The exception thrown is of the type defined by the popped object reference.

## Play Ball!: a Java virtual machine simulation

The applet below demonstrates a Java virtual machine executing a sequence of bytecodes. The bytecode sequence in the simulation was generated by

`javac`

for the

`playBall`

method of the class shown below:

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

The `playball` method loops forever. Every fourth pass through the loop, playball throws a `Ball` and catches it, just because it is fun. Because the try block and the catch clause are both within the endless while loop, the fun never stops. The local variable *i* starts at 0 and increments each pass through the loop. When the `if` statement is `true`, which happens every time *i* is equal to 3, the `Ball` exception is thrown.

The Java virtual machine checks the exception table and discovers that there is indeed an applicable entry. The entry's valid range is from 2 to 15, inclusive, and the exception is thrown at pc offset 12. The exception caught by the entry is of class `Ball`, and the exception thrown is of class `Ball`. Given this perfect match, the Java virtual machine pushes the thrown exception object onto the stack, and continues execution at pc offset 19. The catch clause merely resets *int* *i* to 0, and the loop starts over.

To drive the simulation, just press the `Step` button. Each press of the `Step` button will cause the Java virtual machine to execute one bytecode instruction. To start the simulation over, press the `Reset` button. To cause the Java virtual machine to repeatedly execute bytecodes with no further coaxing on your part, press the `Run` button. The Java virtual machine will then execute the bytecodes until the `Stop` button is pressed. The text area at the bottom of the applet describes the next instruction to be executed. Happy clicking.

Bill Venners has been writing software professionally for 12 years. Based in Silicon Valley, he provides software consulting and training services under the name Artima Software Company. Over the years he has developed software for the consumer electronics, education, semiconductor, and life insurance industries. He has programmed in many languages on many platforms: assembly language on various microprocessors, C on Unix, C++ on Windows, Java on the Web. He is author of the book: Inside the Java Virtual Machine, published by McGraw-Hill.

### Learn more about this topic

*   The book _The Java Virtual Machine Specification_, by Tim Lindholm and Frank Yellin (ISBN 0-201-63452-X), part of[The Java Series](http://www.aw.com/cp/javaseries.html) (http://www.aw.com/cp/javaseries.html), from Addison-Wesley, is be the definitive Java virtual machine reference.

    [http://www.aw.com/cp/lindholm-yellin.html](http://www.aw.com/cp/lindholm-yellin.html)

*   **Previous Under The Hood articles**

*   [The lean, mean virtual machine](http://www.javaworld.com/javaworld/jw-06-1996/jw-06-vm.html) -- Gives an introduction to the Java virtual machine. Look here to see how the garbage collected heap fits in with the other parts of the Java virtual machine.
*   [The Java class file lifestyle](http://www.javaworld.com/javaworld/jw-07-1996/jw-07-classfile.html) -- Gives an overview to the Java class file, the file format into which all Java programs are compiled.
*   [Java's garbage-collected heap](http://www.javaworld.com/javaworld/jw-08-1996/jw-08-gc.html) -- Gives an overview of garbage collection in general and the garbage-collected heap of the Java virtual machine in particular.
*   [Bytecode basics](http://www.javaworld.com/javaworld/jw-09-1996/jw-09-bytecodes.html) -- Introduces the bytecodes of the Java virtual machine, and discusses primitive types, conversion operations, and stack operations in particular.
*   [Floating Point Arithmetic](http://www.javaworld.com/javaworld/jw-10-1996/jw-10-hood.html) -- Describes the Java virtual machine's floating point support and the bytecodes that perform floating point operations.
*   [Logic and Arithmetic](http://www.javaworld.com/javaworld/jw-11-1996/jw-11-hood.html) -- Describes the Java virtual machine's support for logical and integer arithmetic, and the related bytecodes.
*   [Objects and Arrays](http://www.javaworld.com/javaworld/jw-12-1996/jw-12-hood.html) -- Describes how the Java virtual machine deals with objects and arrays, and discusses the relevant bytecodes.

<https://www.javaworld.com/article/2076868/learn-java/how-the-java-virtual-machine-handles-exceptions.html>
