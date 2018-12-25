## Chapter 11. Exceptions

When a program violates the semantic constraints of the Java programming language, the Java Virtual Machine signals this error to the program as an *exception*.

An example of such a violation is an attempt to index outside the bounds of an array. Some programming languages and their implementations react to such errors by peremptorily terminating the program; other programming languages allow an implementation to react in an arbitrary or unpredictable way. Neither of these approaches is compatible with the design goals of the Java SE platform: to provide portability and robustness.

Instead, the Java programming language specifies that an exception will be thrown when semantic constraints are violated and will cause a non-local transfer of control from the point where the exception occurred to a point that can be specified by the programmer.

An exception is said to be *thrown* from the point where it occurred and is said to be *caught* at the point to which control is transferred.

Programs can also throw exceptions explicitly, using `throw` statements ([§14.18](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.18)).

Explicit use of `throw` statements provides an alternative to the old-fashioned style of handling error conditions by returning funny values, such as the integer value `-1` where a negative value would not normally be expected. Experience shows that too often such funny values are ignored or not checked for by callers, leading to programs that are not robust, exhibit undesirable behavior, or both.

Every exception is represented by an instance of the class `Throwable` or one of its subclasses ([§11.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1)). Such an object can be used to carry information from the point at which an exception occurs to the handler that catches it. Handlers are established by `catch` clauses of `try` statements ([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20)).

During the process of throwing an exception, the Java Virtual Machine abruptly completes, one by one, any expressions, statements, method and constructor invocations, initializers, and field initialization expressions that have begun but not completed execution in the current thread. This process continues until a handler is found that indicates that it handles that particular exception by naming the class of the exception or a superclass of the class of the exception ([§11.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2)). If no such handler is found, then the exception may be handled by one of a hierarchy of uncaught exception handlers ([§11.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.3)) - thus every effort is made to avoid letting an exception go unhandled.

The exception mechanism of the Java SE platform is integrated with its synchronization model ([§17.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.1)), so that monitors are unlocked as `synchronized` statements ([§14.19](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.19)) and invocations of `synchronized` methods ([§8.4.3.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.3.6), [§15.12](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12)) complete abruptly.

## 11.1. The Kinds and Causes of Exceptions

### 11.1.1. The Kinds of Exceptions

An exception is represented by an instance of the class `Throwable` (a direct subclass of `Object`) or one of its subclasses.

`Throwable` and all its subclasses are, collectively, the *exception classes*.

The classes `Exception` and `Error` are direct subclasses of `Throwable`:

- `Exception` is the superclass of all the exceptions from which ordinary programs may wish to recover.

  The class `RuntimeException` is a direct subclass of `Exception`. `RuntimeException` is the superclass of all the exceptions which may be thrown for many reasons during expression evaluation, but from which recovery may still be possible.

  `RuntimeException` and all its subclasses are, collectively, the *run-time exception classes*.

- `Error` is the superclass of all the exceptions from which ordinary programs are not ordinarily expected to recover.

  `Error` and all its subclasses are, collectively, the *error classes*.

The *unchecked exception classes* are the run-time exception classes and the error classes.

The *checked exception classes* are all exception classes other than the unchecked exception classes. That is, the checked exception classes are `Throwable` and all its subclasses other than `RuntimeException` and its subclasses and `Error` and its subclasses.

Programs can use the pre-existing exception classes of the Java SE platform API in `throw` statements, or define additional exception classes as subclasses of `Throwable` or of any of its subclasses, as appropriate. To take advantage of compile-time checking for exception handlers ([§11.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2)), it is typical to define most new exception classes as checked exception classes, that is, as subclasses of `Exception` that are not subclasses of `RuntimeException`.

The class `Error` is a separate subclass of `Throwable`, distinct from `Exception` in the class hierarchy, to allow programs to use the idiom "`} catch (Exception e) {`" ([§11.2.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.3)) to catch all exceptions from which recovery may be possible without catching errors from which recovery is typically not possible.

Note that a subclass of `Throwable` cannot be generic ([§8.1.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.1.2)).

### 11.1.2. The Causes of Exceptions

An exception is thrown for one of three reasons:

- A `throw` statement ([§14.18](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.18)) was executed.

- An abnormal execution condition was synchronously detected by the Java Virtual Machine, namely:

  - evaluation of an expression violates the normal semantics of the Java programming language ([§15.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.6)), such as an integer divide by zero.
  - an error occurs while loading, linking, or initializing part of the program ([§12.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.2), [§12.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.3), [§12.4](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4)); in this case, an instance of a subclass of `LinkageError` is thrown.
  - an internal error or resource limitation prevents the Java Virtual Machine from implementing the semantics of the Java programming language; in this case, an instance of a subclass of `VirtualMachineError` is thrown.

  These exceptions are not thrown at an arbitrary point in the program, but rather at a point where they are specified as a possible result of an expression evaluation or statement execution.

- An asynchronous exception occurred ([§11.1.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1.3)).

### 11.1.3. Asynchronous Exceptions

Most exceptions occur synchronously as a result of an action by the thread in which they occur, and at a point in the program that is specified to possibly result in such an exception. An *asynchronous exception* is, by contrast, an exception that can potentially occur at any point in the execution of a program.

Asynchronous exceptions occur only as a result of:

- An invocation of the (deprecated) `stop` method of class `Thread` or `ThreadGroup`.

  The (deprecated) `stop` methods may be invoked by one thread to affect another thread or all the threads in a specified thread group. They are asynchronous because they may occur at any point in the execution of the other thread or threads.

- An internal error or resource limitation in the Java Virtual Machine that prevents it from implementing the semantics of the Java programming language. In this case, the asynchronous exception that is thrown is an instance of a subclass of `VirtualMachineError`.

  Note that `StackOverflowError`, a subclass of `VirtualMachineError`, may be thrown synchronously by method invocation ([§15.12.4.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.4.5)) as well as asynchronously due to `native`method execution or Java Virtual Machine resource limitations. Similarly, `OutOfMemoryError`, another subclass of `VirtualMachineError`, may be thrown synchronously during class instance creation ([§15.9.4](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9.4), [§12.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.5)), array creation ([§15.10.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.10.2), [§10.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-10.html#jls-10.6)), class initialization ([§12.4.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4.2)), and boxing conversion ([§5.1.7](https://docs.oracle.com/javase/specs/jls/se8/html/jls-5.html#jls-5.1.7)), as well as asynchronously.

The Java SE platform permits a small but bounded amount of execution to occur before an asynchronous exception is thrown.

Asynchronous exceptions are rare, but proper understanding of their semantics is necessary if high-quality machine code is to be generated.

The delay noted above is permitted to allow optimized code to detect and throw these exceptions at points where it is practical to handle them while obeying the semantics of the Java programming language. A simple implementation might poll for asynchronous exceptions at the point of each control transfer instruction. Since a program has a finite size, this provides a bound on the total delay in detecting an asynchronous exception. Since no asynchronous exception will occur between control transfers, the code generator has some flexibility to reorder computation between control transfers for greater performance. The paper *Polling Efficiently on Stock Hardware* by Marc Feeley, *Proc. 1993 Conference on Functional Programming and Computer Architecture*, Copenhagen, Denmark, pp. 179-187, is recommended as further reading.

## 11.2. Compile-Time Checking of Exceptions

The Java programming language requires that a program contains handlers for *checked exceptions* which can result from execution of a method or constructor ([§8.4.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.6), [§8.8.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.8.5)). This compile-time checking for the presence of exception handlers is designed to reduce the number of exceptions which are not properly handled. For each checked exception which is a possible result, the `throws` clause for the method or constructor must mention the class of that exception or one of the superclasses of the class of that exception ([§11.2.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.3)).

The checked exception classes ([§11.1.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1.1)) named in the `throws` clause are part of the contract between the implementor and user of the method or constructor. The `throws` clause of an overriding method may not specify that this method will result in throwing any checked exception which the overridden method is not permitted, by its `throws` clause, to throw ([§8.4.8.3](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.8.3)). When interfaces are involved, more than one method declaration may be overridden by a single overriding declaration. In this case, the overriding declaration must have a `throws` clause that is compatible with all the overridden declarations ([§9.4.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-9.html#jls-9.4.1)).

The unchecked exception classes ([§11.1.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.1.1)) are exempted from compile-time checking.

Error classes are exempted because they can occur at many points in the program and recovery from them is difficult or impossible. A program declaring such exceptions would be cluttered, pointlessly. Sophisticated programs may yet wish to catch and attempt to recover from some of these conditions.

Run-time exception classes are exempted because, in the judgment of the designers of the Java programming language, having to declare such exceptions would not aid significantly in establishing the correctness of programs. Many of the operations and constructs of the Java programming language can result in exceptions at run time. The information available to a Java compiler, and the level of analysis a compiler performs, are usually not sufficient to establish that such run-time exceptions cannot occur, even though this may be obvious to the programmer. Requiring such exception classes to be declared would simply be an irritation to programmers.

For example, certain code might implement a circular data structure that, by construction, can never involve null references; the programmer can then be certain that a `NullPointerException` cannot occur, but it would be difficult for a Java compiler to prove it. The theorem-proving technology that is needed to establish such global properties of data structures is beyond the scope of this specification.

We say that a statement or expression *can throw* an exception class E if, according to the rules in [§11.2.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.1) and [§11.2.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html#jls-11.2.2), the execution of the statement or expression can result in an exception of class E being thrown.

We say that a `catch` clause *can catch* its catchable exception class(es):

- The catchable exception class of a uni-`catch` clause is the declared type of its exception parameter ([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20)).
- The catchable exception classes of a multi-`catch` clause are the alternatives in the union that denotes the type of its exception parameter.

### 11.2.1. Exception Analysis of Expressions

A class instance creation expression ([§15.9](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9)) can throw an exception class E iff either:

- The expression is a qualified class instance creation expression and the qualifying expression can throw E; or
- Some expression of the argument list can throw E; or
- E is one of the exception types of the invocation type of the chosen constructor ([§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.2.6)); or
- The class instance creation expression includes a *ClassBody*, and some instance initializer or instance variable initializer in the *ClassBody* can throw E.

A method invocation expression ([§15.12](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12)) can throw an exception class E iff either:

- The method invocation expression is of the form *Primary* `.` *[TypeArguments]* *Identifier* and the *Primary* expression can throw E; or
- Some expression of the argument list can throw E; or
- E is one of the exception types of the invocation type of the chosen method ([§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.2.6)).

A lambda expression ([§15.27](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.27)) can throw no exception classes.

For every other kind of expression, the expression can throw an exception class E iff one of its immediate subexpressions can throw E.

Note that a method reference expression ([§15.13](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.13)) of the form *Primary :: [TypeArguments] Identifier* can throw an exception class if the *Primary* subexpression can throw an exception class. In contrast, a lambda expression can throw nothing, and has no immediate subexpressions on which to perform exception analysis. It is the *body* of a lambda expression, containing expressions and statements, that can throw exception classes.

### 11.2.2. Exception Analysis of Statements

A `throw` statement ([§14.18](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.18)) whose thrown expression has static type E and is not a final or effectively final exception parameter can throw E or any exception class that the thrown expression can throw.

For example, the statement `throw new java.io.FileNotFoundException();` can throw `java.io.FileNotFoundException` only. Formally, it is not the case that it "can throw" a subclass or superclass of `java.io.FileNotFoundException`.

A `throw` statement whose thrown expression is a final or effectively final exception parameter of a `catch` clause C can throw an exception class E iff:

- E is an exception class that the `try` block of the `try` statement which declares C can throw; and
- E is assignment compatible with any of C's catchable exception classes; and
- E is not assignment compatible with any of the catchable exception classes of the `catch` clauses declared to the left of C in the same `try` statement.

A `try` statement ([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20)) can throw an exception class E iff either:

- The `try` block can throw E, or an expression used to initialize a resource (in a `try`-with-resources statement) can throw E, or the automatic invocation of the `close()` method of a resource (in a `try`-with-resources statement) can throw E, and E is not assignment compatible with any catchable exception class of any `catch` clause of the `try` statement, and either no `finally` block is present or the `finally` block can complete normally; or
- Some `catch` block of the `try` statement can throw E and either no `finally` block is present or the `finally` block can complete normally; or
- A `finally` block is present and can throw E.

An explicit constructor invocation statement ([§8.8.7.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.8.7.1)) can throw an exception class E iff either:

- Some expression of the constructor invocation's parameter list can throw E; or
- E is determined to be an exception class of the `throws` clause of the constructor that is invoked ([§15.12.2.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12.2.6)).

Any other statement *S* can throw an exception class E iff an expression or statement immediately contained in *S* can throw E.

### 11.2.3. Exception Checking

It is a compile-time error if a method or constructor body *can throw* some exception class E when E is a checked exception class and E is not a subclass of some class declared in the `throws` clause of the method or constructor.

It is a compile-time error if a lambda body *can throw* some exception class E when E is a checked exception class and E is not a subclass of some class declared in the `throws` clause of the function type targeted by the lambda expression.

It is a compile-time error if a class variable initializer ([§8.3.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.3.2)) or static initializer ([§8.7](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.7)) of a named class or interface *can throw* a checked exception class.

It is a compile-time error if an instance variable initializer ([§8.3.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.3.2)) or instance initializer ([§8.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.6)) of a named class *can throw* a checked exception class, unless the named class has at least one explicitly declared constructor and the exception class or one of its superclasses is explicitly declared in the `throws` clause of each constructor.

Note that no compile-time error is due if an instance variable initializer or instance initializer of an anonymous class ([§15.9.5](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9.5)) can throw an exception class. In a named class, it is the responsibility of the programmer to propagate information about which exception classes can be thrown by initializers, by declaring a suitable `throws` clause on any explicit constructor declaration. This relationship between the checked exception classes thrown by a class's initializers and the checked exception classes declared by a class's constructors is assured for an anonymous class declaration, because no explicit constructor declarations are possible and a Java compiler always generates a constructor with a suitable `throws` clause for the anonymous class declaration based on the checked exception classes that its initializers can throw.

It is a compile-time error if a `catch` clause *can catch* checked exception class E1 and it is not the case that the `try` block corresponding to the `catch` clause *can throw* a checked exception class that is a subclass or superclass of E1, unless E1 is `Exception` or a superclass of `Exception`.

It is a compile-time error if a `catch` clause *can catch* an exception class E1 and a preceding `catch` clause of the immediately enclosing `try` statement *can catch* E1 or a superclass of E1.

A Java compiler is encouraged to issue a warning if a `catch` clause can catch checked exception class E1 and the `try` block corresponding to the `catch` clause can throw checked exception class E2, where E2 `<:` E1, and a preceding `catch` clause of the immediately enclosing `try` statement can catch checked exception class E3, where E2 `<:` E3 `<:` E1.

**Example 11.2.3-1. Catching Checked Exceptions**

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

```
try { ... }
catch (Foo f) { ... }
catch (Bar | SubclassOfFoo e) { ... }

```

## 11.3. Run-Time Handling of an Exception

When an exception is thrown ([§14.18](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.18)), control is transferred from the code that caused the exception to the nearest dynamically enclosing `catch` clause, if any, of a `try` statement ([§14.20](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20)) that can handle the exception.

A statement or expression is *dynamically enclosed* by a `catch` clause if it appears within the `try` block of the `try` statement of which the `catch` clause is a part, or if the caller of the statement or expression is dynamically enclosed by the `catch` clause.

The caller of a statement or expression depends on where it occurs:

- If within a method, then the caller is the method invocation expression ([§15.12](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.12)) that was executed to cause the method to be invoked.
- If within a constructor or an instance initializer or the initializer for an instance variable, then the caller is the class instance creation expression ([§15.9](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.9)) or the method invocation of `newInstance` that was executed to cause an object to be created.
- If within a static initializer or an initializer for a `static` variable, then the caller is the expression that used the class or interface so as to cause it to be initialized ([§12.4](https://docs.oracle.com/javase/specs/jls/se8/html/jls-12.html#jls-12.4)).

Whether a particular `catch` clause *can handle* an exception is determined by comparing the class of the object that was thrown to the catchable exception classes of the `catch` clause. The `catch` clause can handle the exception if one of its catchable exception classes is the class of the exception or a superclass of the class of the exception.

Equivalently, a `catch` clause will catch any exception object that is an `instanceof` ([§15.20.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.20.2)) one of its catchable exception classes.

The control transfer that occurs when an exception is thrown causes abrupt completion of expressions ([§15.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.6)) and statements ([§14.1](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.1)) until a `catch` clause is encountered that can handle the exception; execution then continues by executing the block of that `catch` clause. The code that caused the exception is never resumed.

All exceptions (synchronous and asynchronous) are *precise*: when the transfer of control takes place, all effects of the statements executed and expressions evaluated before the point from which the exception is thrown must appear to have taken place. No expressions, statements, or parts thereof that occur after the point from which the exception is thrown may appear to have been evaluated.

If optimized code has speculatively executed some of the expressions or statements which follow the point at which the exception occurs, such code must be prepared to hide this speculative execution from the user-visible state of the program.

If no `catch` clause that can handle an exception can be found, then the current thread (the thread that encountered the exception) is terminated. Before termination, all `finally`clauses are executed and the uncaught exception is handled according to the following rules:

- If the current thread has an uncaught exception handler set, then that handler is executed.
- Otherwise, the method `uncaughtException` is invoked for the `ThreadGroup` that is the parent of the current thread. If the `ThreadGroup` and its parent `ThreadGroup`s do not override `uncaughtException`, then the default handler's `uncaughtException` method is invoked.

In situations where it is desirable to ensure that one block of code is always executed after another, even if that other block of code completes abruptly, a `try` statement with a `finally`clause ([§14.20.2](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html#jls-14.20.2)) may be used.

If a `try` or `catch` block in a `try`-`finally` or `try`-`catch`-`finally` statement completes abruptly, then the `finally` clause is executed during propagation of the exception, even if no matching `catch` clause is ultimately found.

If a `finally` clause is executed because of abrupt completion of a `try` block and the `finally` clause itself completes abruptly, then the reason for the abrupt completion of the `try`block is discarded and the new reason for abrupt completion is propagated from there.

The exact rules for abrupt completion and for the catching of exceptions are specified in detail with the specification of each statement in [§14 (*Blocks and Statements*)](https://docs.oracle.com/javase/specs/jls/se8/html/jls-14.html) and for expressions in [§15 (*Expressions*)](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html) (especially [§15.6](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.6)).

**Example 11.3-1. Throwing and Catching Exceptions**

The following program declares an exception class `TestException`. The `main` method of class `Test` invokes the `thrower` method four times, causing exceptions to be thrown three of the four times. The `try` statement in method `main` catches each exception that the thrower throws. Whether the invocation of `thrower` completes normally or abruptly, a message is printed describing what happened.

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

```
divide null not test

```

it produces the output:

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

Notice that the `finally` clause is executed on every invocation of `thrower`, whether or not an exception occurs, as shown by the "`[thrower(...) done]`" output that occurs for each invocation.















<https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html>

