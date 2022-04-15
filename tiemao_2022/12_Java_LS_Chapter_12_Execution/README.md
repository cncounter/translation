# Java Language Specification

## Chapter 12. Execution

This chapter specifies activities that occur during execution of a program. It is organized around the life cycle of the Java Virtual Machine and of the classes, interfaces, and objects that form a program.

The Java Virtual Machine starts up by loading a specified class or interface, then invoking the method `main` in this specified class or interface. Section [§12.1](#jls-12.1) outlines the loading, linking, and initialization steps involved in executing `main`, as an introduction to the concepts in this chapter. Further sections specify the details of loading ([§12.2](#jls-12.2)), linking ([§12.3](#jls-12.3)), and initialization ([§12.4](#jls-12.4)).

The chapter continues with a specification of the procedures for creation of new class instances ([§12.5](#jls-12.5)); and finalization of class instances ([§12.6](#jls-12.6)). It concludes by describing the unloading of classes ([§12.7](#jls-12.7)) and the procedure followed when a program exits ([§12.8](#jls-12.8)).

## 12.1. Java Virtual Machine Startup

The Java Virtual Machine starts execution by invoking the method `main` of some specified class or interface, passing it a single argument which is an array of strings. In the examples in this specification, this first class is typically called `Test`.

The precise semantics of Java Virtual Machine startup are given in Chapter 5 of *The Java Virtual Machine Specification, Java SE 11 Edition*. Here we present an overview of the process from the viewpoint of the Java programming language.

The manner in which the initial class or interface is specified to the Java Virtual Machine is beyond the scope of this specification, but it is typical, in host environments that use command lines, for the fully qualified name of the class or interface to be specified as a command line argument and for following command line arguments to be used as strings to be provided as the argument to the method `main`.

For example, in a UNIX implementation, the command line:

```
java Test reboot Bob Dot Enzo
```

will typically start a Java Virtual Machine by invoking method `main` of class `Test` (a class in an unnamed package), passing it an array containing the four strings "`reboot`", "`Bob`", "`Dot`", and "`Enzo`".

We now outline the steps the Java Virtual Machine may take to execute `Test`, as an example of the loading, linking, and initialization processes that are described further in later sections.

### 12.1.1. Load the Class `Test`

The initial attempt to execute the method `main` of class `Test` discovers that the class `Test` is not loaded - that is, that the Java Virtual Machine does not currently contain a binary representation for this class. The Java Virtual Machine then uses a class loader to attempt to find such a binary representation. If this process fails, then an error is thrown. This loading process is described further in [§12.2](#jls-12.2).

### 12.1.2. Link `Test`: Verify, Prepare, (Optionally) Resolve

After `Test` is loaded, it must be initialized before `main` can be invoked. And `Test`, like all (class or interface) types, must be linked before it is initialized. Linking involves verification, preparation, and (optionally) resolution. Linking is described further in [§12.3](#jls-12.3).

Verification checks that the loaded representation of `Test` is well-formed, with a proper symbol table. Verification also checks that the code that implements `Test` obeys the semantic requirements of the Java programming language and the Java Virtual Machine. If a problem is detected during verification, then an error is thrown. Verification is described further in [§12.3.1](#jls-12.3.1).

Preparation involves allocation of static storage and any data structures that are used internally by the implementation of the Java Virtual Machine, such as method tables. Preparation is described further in [§12.3.2](#jls-12.3.2).

Resolution is the process of checking symbolic references from `Test` to other classes and interfaces, by loading the other classes and interfaces that are mentioned and checking that the references are correct.

The resolution step is optional at the time of initial linkage. An implementation may resolve symbolic references from a class or interface that is being linked very early, even to the point of resolving all symbolic references from the classes and interfaces that are further referenced, recursively. (This resolution may result in errors from these further loading and linking steps.) This implementation choice represents one extreme and is similar to the kind of "static" linkage that has been done for many years in simple implementations of the C language. (In these implementations, a compiled program is typically represented as an "`a.out`" file that contains a fully-linked version of the program, including completely resolved links to library routines used by the program. Copies of these library routines are included in the "`a.out`" file.)

An implementation may instead choose to resolve a symbolic reference only when it is actively used; consistent use of this strategy for all symbolic references would represent the "laziest" form of resolution. In this case, if `Test` had several symbolic references to another class, then the references might be resolved one at a time, as they are used, or perhaps not at all, if these references were never used during execution of the program.

The only requirement on when resolution is performed is that any errors detected during resolution must be thrown at a point in the program where some action is taken by the program that might, directly or indirectly, require linkage to the class or interface involved in the error. Using the "static" example implementation choice described above, loading and linkage errors could occur before the program is executed if they involved a class or interface mentioned in the class `Test` or any of the further, recursively referenced, classes and interfaces. In a system that implemented the "laziest" resolution, these errors would be thrown only when an incorrect symbolic reference is actively used.

The resolution process is described further in [§12.3.3](#jls-12.3.3).

### 12.1.3. Initialize Test: Execute Initializers

In our continuing example, the Java Virtual Machine is still trying to execute the method `main` of class `Test`. This is permitted only if the class has been initialized ([§12.4.1](#jls-12.4.1)).

Initialization consists of execution of any class variable initializers and static initializers of the class `Test`, in textual order. But before `Test` can be initialized, its direct superclass must be initialized, as well as the direct superclass of its direct superclass, and so on, recursively. In the simplest case, `Test` has `Object` as its implicit direct superclass; if class `Object` has not yet been initialized, then it must be initialized before `Test` is initialized. Class `Object` has no superclass, so the recursion terminates here.

If class `Test` has another class `Super` as its superclass, then `Super` must be initialized before `Test`. This requires loading, verifying, and preparing `Super` if this has not already been done and, depending on the implementation, may also involve resolving the symbolic references from `Super` and so on, recursively.

Initialization may thus cause loading, linking, and initialization errors, including such errors involving other types.

The initialization process is described further in [§12.4](#jls-12.4).

### 12.1.4. Invoke `Test.main`

Finally, after completion of the initialization for class `Test` (during which other consequential loading, linking, and initializing may have occurred), the method `main` of `Test` is invoked.

The method `main` must be declared `public`, `static`, and `void`. It must specify a formal parameter ([§8.4.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.4.1)) whose declared type is array of `String`. Therefore, either of the following declarations is acceptable:

```
public static void main(String[] args)
public static void main(String... args)
```

## 12.2. Loading of Classes and Interfaces

*Loading* refers to the process of finding the binary form of a class or interface type with a particular name, perhaps by computing it on the fly, but more typically by retrieving a binary representation previously computed from source code by a Java compiler, and constructing, from that binary form, a `Class` object to represent the class or interface.

The precise semantics of loading are given in Chapter 5 of *The Java Virtual Machine Specification, Java SE 11 Edition*. Here we present an overview of the process from the viewpoint of the Java programming language.

The binary format of a class or interface is normally the `class` file format described in *The Java Virtual Machine Specification, Java SE 11 Edition* cited above, but other formats are possible, provided they meet the requirements specified in [§13.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.1). The method `defineClass` of class `ClassLoader` may be used to construct `Class` objects from binary representations in the `class` file format.

Well-behaved class loaders maintain these properties:

- Given the same name, a good class loader should always return the same class object.
- If a class loader `L1` delegates loading of a class C to another loader `L2`, then for any type T that occurs as the direct superclass or a direct superinterface of C, or as the type of a field in C, or as the type of a formal parameter of a method or constructor in C, or as a return type of a method in C, `L1` and `L2` should return the same `Class` object.

A malicious class loader could violate these properties. However, it could not undermine the security of the type system, because the Java Virtual Machine guards against this.

For further discussion of these issues, see *The Java Virtual Machine Specification, Java SE 11 Edition* and the paper *Dynamic Class Loading in the Java Virtual Machine*, by Sheng Liang and Gilad Bracha, in *Proceedings of OOPSLA '98*, published as *ACM SIGPLAN Notices*, Volume 33, Number 10, October 1998, pages 36-44. A basic principle of the design of the Java programming language is that the run-time type system cannot be subverted by code written in the Java programming language, not even by implementations of such otherwise sensitive system classes as `ClassLoader` and `SecurityManager`.

### 12.2.1. The Loading Process

The loading process is implemented by the class `ClassLoader` and its subclasses.

Different subclasses of `ClassLoader` may implement different loading policies. In particular, a class loader may cache binary representations of classes and interfaces, prefetch them based on expected usage, or load a group of related classes together. These activities may not be completely transparent to a running application if, for example, a newly compiled version of a class is not found because an older version is cached by a class loader. It is the responsibility of a class loader, however, to reflect loading errors only at points in the program where they could have arisen without prefetching or group loading.

If an error occurs during class loading, then an instance of one of the following subclasses of class `LinkageError` will be thrown at any point in the program that (directly or indirectly) uses the type:

- `ClassCircularityError`: A class or interface could not be loaded because it would be its own superclass or superinterface ([§8.1.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.1.4), [§9.1.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-9.html#jls-9.1.3), [§13.4.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.4)).
- `ClassFormatError`: The binary data that purports to specify a requested compiled class or interface is malformed.
- `NoClassDefFoundError`: No definition for a requested class or interface could be found by the relevant class loader.

Because loading involves the allocation of new data structures, it may fail with an `OutOfMemoryError`.

## 12.3. Linking of Classes and Interfaces

*Linking* is the process of taking a binary form of a class or interface type and combining it into the run-time state of the Java Virtual Machine, so that it can be executed. A class or interface type is always loaded before it is linked.

Three different activities are involved in linking: verification, preparation, and resolution of symbolic references.

The precise semantics of linking are given in Chapter 5 of *The Java Virtual Machine Specification, Java SE 11 Edition*. Here we present an overview of the process from the viewpoint of the Java programming language.

This specification allows an implementation flexibility as to when linking activities (and, because of recursion, loading) take place, provided that the semantics of the Java programming language are respected, that a class or interface is completely verified and prepared before it is initialized, and that errors detected during linkage are thrown at a point in the program where some action is taken by the program that might require linkage to the class or interface involved in the error.

For example, an implementation may choose to resolve each symbolic reference in a class or interface individually, only when it is used (lazy or late resolution), or to resolve them all at once while the class is being verified (static resolution). This means that the resolution process may continue, in some implementations, after a class or interface has been initialized.

Because linking involves the allocation of new data structures, it may fail with an `OutOfMemoryError`.

### 12.3.1. Verification of the Binary Representation

*Verification* ensures that the binary representation of a class or interface is structurally correct. For example, it checks that every instruction has a valid operation code; that every branch instruction branches to the start of some other instruction, rather than into the middle of an instruction; that every method is provided with a structurally correct signature; and that every instruction obeys the type discipline of the Java Virtual Machine language.

If an error occurs during verification, then an instance of the following subclass of class `LinkageError` will be thrown at the point in the program that caused the class to be verified:

- `VerifyError`: The binary definition for a class or interface failed to pass a set of required checks to verify that it obeys the semantics of the Java Virtual Machine language and that it cannot violate the integrity of the Java Virtual Machine. (See [§13.4.2](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.2), [§13.4.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.4), [§13.4.9](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.9), and [§13.4.17](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.17) for some examples.)

### 12.3.2. Preparation of a Class or Interface Type

*Preparation* involves creating the `static` fields (class variables and constants) for a class or interface and initializing such fields to the default values ([§4.12.5](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.5)). This does not require the execution of any source code; explicit initializers for static fields are executed as part of initialization ([§12.4](#jls-12.4)), not preparation.

Implementations of the Java Virtual Machine may precompute additional data structures at preparation time in order to make later operations on a class or interface more efficient. One particularly useful data structure is a "method table" or other data structure that allows any method to be invoked on instances of a class without requiring a search of superclasses at invocation time.

### 12.3.3. Resolution of Symbolic References

The binary representation of a class or interface references other classes and interfaces and their fields, methods, and constructors symbolically, using the binary names ([§13.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.1)) of the other classes and interfaces ([§13.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.1)). For fields and methods, these symbolic references include the name of the class or interface type of which the field or method is a member, as well as the name of the field or method itself, together with appropriate type information.

Before a symbolic reference can be used it must undergo resolution, wherein a symbolic reference is checked to be correct and, typically, replaced with a direct reference that can be more efficiently processed if the reference is used repeatedly.

If an error occurs during resolution, then an error will be thrown. Most typically, this will be an instance of one of the following subclasses of the class `IncompatibleClassChangeError`, but it may also be an instance of some other subclass of `IncompatibleClassChangeError` or even an instance of the class `IncompatibleClassChangeError` itself. This error may be thrown at any point in the program that uses a symbolic reference to the type, directly or indirectly:

- `IllegalAccessError`: A symbolic reference has been encountered that specifies a use or assignment of a field, or invocation of a method, or creation of an instance of a class, to which the code containing the reference does not have access because the field or method was declared with `private`, `protected`, or package access (not `public`), or because the class was not declared `public` in a package that is exported or opened to the code containing the reference.

  This can occur, for example, if a field that is originally declared `public` is changed to be `private` after another class that refers to the field has been compiled ([§13.4.7](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.7)); or if the package in which a `public` class is declared ceases to be exported by its module after another module that refers to the class has been compiled ([§13.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.3)).

- `InstantiationError`: A symbolic reference has been encountered that is used in class instance creation expression, but an instance cannot be created because the reference turns out to refer to an interface or to an abstract class.

  This can occur, for example, if a class that is originally not `abstract` is changed to be `abstract` after another class that refers to the class in question has been compiled ([§13.4.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.1)).

- `NoSuchFieldError`: A symbolic reference has been encountered that refers to a specific field of a specific class or interface, but the class or interface does not contain a field of that name.

  This can occur, for example, if a field declaration was deleted from a class after another class that refers to the field was compiled ([§13.4.8](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.8)).

- `NoSuchMethodError`: A symbolic reference has been encountered that refers to a specific method of a specific class or interface, but the class or interface does not contain a method of that signature.

  This can occur, for example, if a method declaration was deleted from a class after another class that refers to the method was compiled ([§13.4.12](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.12)).

Additionally, an `UnsatisfiedLinkError`, a subclass of `LinkageError`, may be thrown if a class declares a `native` method for which no implementation can be found. The error will occur if the method is used, or earlier, depending on what kind of resolution strategy is being used by an implementation of the Java Virtual Machine ([§12.3](#jls-12.3)).

## 12.4. Initialization of Classes and Interfaces

*Initialization* of a class consists of executing its static initializers and the initializers for `static` fields (class variables) declared in the class.

*Initialization* of an interface consists of executing the initializers for fields (constants) declared in the interface.

### 12.4.1. When Initialization Occurs

A class or interface type T will be initialized immediately before the first occurrence of any one of the following:

- T is a class and an instance of T is created.
- A `static` method declared by T is invoked.
- A `static` field declared by T is assigned.
- A `static` field declared by T is used and the field is not a constant variable ([§4.12.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.4)).

When a class is initialized, its superclasses are initialized (if they have not been previously initialized), as well as any superinterfaces ([§8.1.5](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.1.5)) that declare any default methods ([§9.4.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-9.html#jls-9.4.3)) (if they have not been previously initialized). Initialization of an interface does not, of itself, cause initialization of any of its superinterfaces.

A reference to a `static` field ([§8.3.1.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.3.1.1)) causes initialization of only the class or interface that actually declares it, even though it might be referred to through the name of a subclass, a subinterface, or a class that implements an interface.

Invocation of certain reflective methods in class `Class` and in package `java.lang.reflect` also causes class or interface initialization.

A class or interface will not be initialized under any other circumstance.

Note that a compiler may generate *synthetic* default methods in an interface, that is, default methods that are neither explicitly nor implicitly declared ([§13.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.1)). Such methods will trigger the interface's initialization despite the source code giving no indication that the interface should be initialized.

The intent is that a class or interface type has a set of initializers that put it in a consistent state, and that this state is the first state that is observed by other classes. The static initializers and class variable initializers are executed in textual order, and may not refer to class variables declared in the class whose declarations appear textually after the use, even though these class variables are in scope ([§8.3.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.3.3)). This restriction is designed to detect, at compile time, most circular or otherwise malformed initializations.

The fact that initialization code is unrestricted allows examples to be constructed where the value of a class variable can be observed when it still has its initial default value, before its initializing expression is evaluated, but such examples are rare in practice. (Such examples can be also constructed for instance variable initialization ([§12.5](#jls-12.5)).) The full power of the Java programming language is available in these initializers; programmers must exercise some care. This power places an extra burden on code generators, but this burden would arise in any case because the Java programming language is concurrent ([§12.4.2](#jls-12.4.2)).



**Example 12.4.1-1. Superclasses Are Initialized Before Subclasses**

```
class Super {
    static { System.out.print("Super "); }
}
class One {
    static { System.out.print("One "); }
}
class Two extends Super {
    static { System.out.print("Two "); }
}
class Test {
    public static void main(String[] args) {
        One o = null;
        Two t = new Two();
        System.out.println((Object)o == (Object)t);
    }
}
```

This program produces the output:

```
Super Two false
```

The class `One` is never initialized, because it not used actively and therefore is never linked to. The class `Two` is initialized only after its superclass `Super` has been initialized.





**Example 12.4.1-2. Only The Class That Declares `static` Field Is Initialized**

```
class Super {
    static int taxi = 1729;
}
class Sub extends Super {
    static { System.out.print("Sub "); }
}
class Test {
    public static void main(String[] args) {
        System.out.println(Sub.taxi);
    }
}
```

This program prints only:

```
1729
```

because the class `Sub` is never initialized; the reference to `Sub.taxi` is a reference to a field actually declared in class `Super` and does not trigger initialization of the class `Sub`.





**Example 12.4.1-3. Interface Initialization Does Not Initialize Superinterfaces**

```
interface I {
    int i = 1, ii = Test.out("ii", 2);
}
interface J extends I {
    int j = Test.out("j", 3), jj = Test.out("jj", 4);
}
interface K extends J {
    int k = Test.out("k", 5);
}
class Test {
    public static void main(String[] args) {
        System.out.println(J.i);
        System.out.println(K.j);
    }
    static int out(String s, int i) {
        System.out.println(s + "=" + i);
        return i;
    }
}
```

This program produces the output:

```
1
j=3
jj=4
3
```

The reference to `J.i` is to a field that is a constant variable ([§4.12.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.4)); therefore, it does not cause `I` to be initialized ([§13.4.9](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.9)).

The reference to `K.j` is a reference to a field actually declared in interface `J` that is not a constant variable; this causes initialization of the fields of interface `J`, but not those of its superinterface `I`, nor those of interface `K`.

Despite the fact that the name `K` is used to refer to field `j` of interface `J`, interface `K` is not initialized.



### 12.4.2. Detailed Initialization Procedure

Because the Java programming language is multithreaded, initialization of a class or interface requires careful synchronization, since some other thread may be trying to initialize the same class or interface at the same time. There is also the possibility that initialization of a class or interface may be requested recursively as part of the initialization of that class or interface; for example, a variable initializer in class A might invoke a method of an unrelated class B, which might in turn invoke a method of class A. The implementation of the Java Virtual Machine is responsible for taking care of synchronization and recursive initialization by using the following procedure.

The procedure assumes that the `Class` object has already been verified and prepared, and that the `Class` object contains state that indicates one of four situations:

- This `Class` object is verified and prepared but not initialized.
- This `Class` object is being initialized by some particular thread `T`.
- This `Class` object is fully initialized and ready for use.
- This `Class` object is in an erroneous state, perhaps because initialization was attempted and failed.

For each class or interface C, there is a unique initialization lock `LC`. The mapping from C to `LC` is left to the discretion of the Java Virtual Machine implementation. The procedure for initializing C is then as follows:

1. Synchronize on the initialization lock, `LC`, for C. This involves waiting until the current thread can acquire `LC`.

2. If the `Class` object for C indicates that initialization is in progress for C by some other thread, then release `LC` and block the current thread until informed that the in-progress initialization has completed, at which time repeat this step.

3. If the `Class` object for C indicates that initialization is in progress for C by the current thread, then this must be a recursive request for initialization. Release `LC` and complete normally.

4. If the `Class` object for C indicates that C has already been initialized, then no further action is required. Release `LC` and complete normally.

5. If the `Class` object for C is in an erroneous state, then initialization is not possible. Release `LC` and throw a `NoClassDefFoundError`.

6. Otherwise, record the fact that initialization of the `Class` object for C is in progress by the current thread, and release `LC`.

   Then, initialize the `static` fields of C which are constant variables ([§4.12.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.4), [§8.3.2](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.3.2), [§9.3.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-9.html#jls-9.3.1)).

7. Next, if C is a class rather than an interface, then let SC be its superclass and let SI1, ..., SIn be all superinterfaces of C that declare at least one default method. The order of superinterfaces is given by a recursive enumeration over the superinterface hierarchy of each interface directly implemented by C (in the left-to-right order of C's `implements` clause). For each interface I directly implemented by C, the enumeration recurs on I's superinterfaces (in the left-to-right order of I's `extends` clause) before returning I.

   For each S in the list [ SC, SI1, ..., SIn ], if S has not yet been initialized, then recursively perform this entire procedure for S. If necessary, verify and prepare S first.

   If the initialization of S completes abruptly because of a thrown exception, then acquire `LC`, label the `Class` object for C as erroneous, notify all waiting threads, release `LC`, and complete abruptly, throwing the same exception that resulted from initializing S.

8. Next, determine whether assertions are enabled ([§14.10](https://docs.oracle.com/javase/specs/jls/se11/html/jls-14.html#jls-14.10)) for C by querying its defining class loader.

9. Next, execute either the class variable initializers and static initializers of the class, or the field initializers of the interface, in textual order, as though they were a single block.

10. If the execution of the initializers completes normally, then acquire `LC`, label the `Class` object for C as fully initialized, notify all waiting threads, release `LC`, and complete this procedure normally.

11. Otherwise, the initializers must have completed abruptly by throwing some exception E. If the class of E is not `Error` or one of its subclasses, then create a new instance of the class `ExceptionInInitializerError`, with E as the argument, and use this object in place of E in the following step. If a new instance of `ExceptionInInitializerError` cannot be created because an `OutOfMemoryError` occurs, then instead use an `OutOfMemoryError` object in place of E in the following step.

12. Acquire `LC`, label the `Class` object for C as erroneous, notify all waiting threads, release `LC`, and complete this procedure abruptly with reason E or its replacement as determined in the previous step.

An implementation may optimize this procedure by eliding the lock acquisition in step 1 (and release in step 4/5) when it can determine that the initialization of the class has already completed, provided that, in terms of the memory model, all happens-before orderings that would exist if the lock were acquired, still exist when the optimization is performed.

Code generators need to preserve the points of possible initialization of a class or interface, inserting an invocation of the initialization procedure just described. If this initialization procedure completes normally and the `Class` object is fully initialized and ready for use, then the invocation of the initialization procedure is no longer necessary and it may be eliminated from the code - for example, by patching it out or otherwise regenerating the code.

Compile-time analysis may, in some cases, be able to eliminate many of the checks that a type has been initialized from the generated code, if an initialization order for a group of related types can be determined. Such analysis must, however, fully account for concurrency and for the fact that initialization code is unrestricted.

## 12.5. Creation of New Class Instances

A new class instance is explicitly created when evaluation of a class instance creation expression ([§15.9](https://docs.oracle.com/javase/specs/jls/se11/html/jls-15.html#jls-15.9)) causes a class to be instantiated.

A new class instance may be implicitly created in the following situations:

- Loading of a class or interface that contains a string literal ([§3.10.5](https://docs.oracle.com/javase/specs/jls/se11/html/jls-3.html#jls-3.10.5)) may create a new `String` object to represent the literal. (This will not occur if a string denoting the same sequence of Unicode code points has previously been interned.)
- Execution of an operation that causes boxing conversion ([§5.1.7](https://docs.oracle.com/javase/specs/jls/se11/html/jls-5.html#jls-5.1.7)). Boxing conversion may create a new object of a wrapper class (`Boolean`, `Byte`, `Short`, `Character`, `Integer`, `Long`, `Float`, `Double`) associated with one of the primitive types.
- Execution of a string concatenation operator `+` ([§15.18.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-15.html#jls-15.18.1)) that is not part of a constant expression ([§15.28](https://docs.oracle.com/javase/specs/jls/se11/html/jls-15.html#jls-15.28)) always creates a new `String` object to represent the result. String concatenation operators may also create temporary wrapper objects for a value of a primitive type.
- Evaluation of a method reference expression ([§15.13.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-15.html#jls-15.13.3)) or a lambda expression ([§15.27.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-15.html#jls-15.27.4)) may require that a new instance of a class that implements a functional interface type be created.

Each of these situations identifies a particular constructor ([§8.8](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.8)) to be called with specified arguments (possibly none) as part of the class instance creation process.

Whenever a new class instance is created, memory space is allocated for it with room for all the instance variables declared in the class type and all the instance variables declared in each superclass of the class type, including all the instance variables that may be hidden ([§8.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.3)).

If there is not sufficient space available to allocate memory for the object, then creation of the class instance completes abruptly with an `OutOfMemoryError`. Otherwise, all the instance variables in the new object, including those declared in superclasses, are initialized to their default values ([§4.12.5](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.5)).

Just before a reference to the newly created object is returned as the result, the indicated constructor is processed to initialize the new object using the following procedure:

1. Assign the arguments for the constructor to newly created parameter variables for this constructor invocation.
2. If this constructor begins with an explicit constructor invocation ([§8.8.7.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.8.7.1)) of another constructor in the same class (using `this`), then evaluate the arguments and process that constructor invocation recursively using these same five steps. If that constructor invocation completes abruptly, then this procedure completes abruptly for the same reason; otherwise, continue with step 5.
3. This constructor does not begin with an explicit constructor invocation of another constructor in the same class (using `this`). If this constructor is for a class other than `Object`, then this constructor will begin with an explicit or implicit invocation of a superclass constructor (using `super`). Evaluate the arguments and process that superclass constructor invocation recursively using these same five steps. If that constructor invocation completes abruptly, then this procedure completes abruptly for the same reason. Otherwise, continue with step 4.
4. Execute the instance initializers and instance variable initializers for this class, assigning the values of instance variable initializers to the corresponding instance variables, in the left-to-right order in which they appear textually in the source code for the class. If execution of any of these initializers results in an exception, then no further initializers are processed and this procedure completes abruptly with that same exception. Otherwise, continue with step 5.
5. Execute the rest of the body of this constructor. If that execution completes abruptly, then this procedure completes abruptly for the same reason. Otherwise, this procedure completes normally.

Unlike C++, the Java programming language does not specify altered rules for method dispatch during the creation of a new class instance. If methods are invoked that are overridden in subclasses in the object being initialized, then these overriding methods are used, even before the new object is completely initialized.



**Example 12.5-1. Evaluation of Instance Creation**

```
class Point {
    int x, y;
    Point() { x = 1; y = 1; }
}
class ColoredPoint extends Point {
    int color = 0xFF00FF;
}
class Test {
    public static void main(String[] args) {
        ColoredPoint cp = new ColoredPoint();
        System.out.println(cp.color);
    }
}
```

Here, a new instance of `ColoredPoint` is created. First, space is allocated for the new `ColoredPoint`, to hold the fields `x`, `y`, and `color`. All these fields are then initialized to their default values (in this case, `0` for each field). Next, the `ColoredPoint` constructor with no arguments is first invoked. Since `ColoredPoint` declares no constructors, a default constructor of the following form is implicitly declared:

```
ColoredPoint() { super(); }
```

This constructor then invokes the `Point` constructor with no arguments. The `Point` constructor does not begin with an invocation of a constructor, so the Java compiler provides an implicit invocation of its superclass constructor of no arguments, as though it had been written:

```
Point() { super(); x = 1; y = 1; }
```

Therefore, the constructor for `Object` which takes no arguments is invoked.

The class `Object` has no superclass, so the recursion terminates here. Next, any instance initializers and instance variable initializers of `Object` are invoked. Next, the body of the constructor of `Object` that takes no arguments is executed. No such constructor is declared in `Object`, so the Java compiler supplies a default one, which in this special case is:

```
Object() { }
```

This constructor executes without effect and returns.

Next, all initializers for the instance variables of class `Point` are executed. As it happens, the declarations of `x` and `y` do not provide any initialization expressions, so no action is required for this step of the example. Then the body of the `Point` constructor is executed, setting `x` to `1` and `y` to `1`.

Next, the initializers for the instance variables of class `ColoredPoint` are executed. This step assigns the value `0xFF00FF` to `color`. Finally, the rest of the body of the `ColoredPoint` constructor is executed (the part after the invocation of `super`); there happen to be no statements in the rest of the body, so no further action is required and initialization is complete.





**Example 12.5-2. Dynamic Dispatch During Instance Creation**

```
class Super {
    Super() { printThree(); }
    void printThree() { System.out.println("three"); }
}
class Test extends Super {
    int three = (int)Math.PI;  // That is, 3
    void printThree() { System.out.println(three); }

    public static void main(String[] args) {
        Test t = new Test();
        t.printThree();
    }
}
```

This program produces the output:

```
0
3
```

This shows that the invocation of `printThree` in the constructor for class `Super` does not invoke the definition of `printThree` in class `Super`, but rather invokes the overriding definition of `printThree` in class `Test`. This method therefore runs before the field initializers of `Test` have been executed, which is why the first value output is `0`, the default value to which the field `three` of `Test` is initialized. The later invocation of `printThree` in method `main` invokes the same definition of `printThree`, but by that point the initializer for instance variable `three` has been executed, and so the value `3` is printed.



## 12.6. Finalization of Class Instances

The class `Object` has a `protected` method called `finalize`; this method can be overridden by other classes. The particular definition of `finalize` that can be invoked for an object is called the *finalizer* of that object. Before the storage for an object is reclaimed by the garbage collector, the Java Virtual Machine will invoke the finalizer of that object.

Finalizers provide a chance to free up resources that cannot be freed automatically by an automatic storage manager. In such situations, simply reclaiming the memory used by an object would not guarantee that the resources it held would be reclaimed.

The Java programming language does not specify how soon a finalizer will be invoked, except to say that it will happen before the storage for the object is reused.

The Java programming language does not specify which thread will invoke the finalizer for any given object.

It is important to note that many finalizer threads may be active (this is sometimes needed on large shared memory multiprocessors), and that if a large connected data structure becomes garbage, all of the `finalize` methods for every object in that data structure could be invoked at the same time, each finalizer invocation running in a different thread.

The Java programming language imposes no ordering on `finalize` method calls. Finalizers may be called in any order, or even concurrently.

As an example, if a circularly linked group of unfinalized objects becomes unreachable (or finalizer-reachable), then all the objects may become finalizable together. Eventually, the finalizers for these objects may be invoked, in any order, or even concurrently using multiple threads. If the automatic storage manager later finds that the objects are unreachable, then their storage can be reclaimed.

It is straightforward to implement a class that will cause a set of finalizer-like methods to be invoked in a specified order for a set of objects when all the objects become unreachable. Defining such a class is left as an exercise for the reader.

It is guaranteed that the thread that invokes the finalizer will not be holding any user-visible synchronization locks when the finalizer is invoked.

If an uncaught exception is thrown during the finalization, the exception is ignored and finalization of that object terminates.

The completion of an object's constructor happens-before ([§17.4.5](https://docs.oracle.com/javase/specs/jls/se11/html/jls-17.html#jls-17.4.5)) the execution of its `finalize` method (in the formal sense of happens-before).

The `finalize` method declared in class `Object` takes no action. The fact that class `Object` declares a `finalize` method means that the `finalize` method for any class can always invoke the `finalize` method for its superclass. This should always be done, unless it is the programmer's intent to nullify the actions of the finalizer in the superclass. (Unlike constructors, finalizers do not automatically invoke the finalizer for the superclass; such an invocation must be coded explicitly.)

For efficiency, an implementation may keep track of classes that do not override the `finalize` method of class `Object`, or override it in a trivial way.

For example:

```
protected void finalize() throws Throwable {
    super.finalize();
}
```

We encourage implementations to treat such objects as having a finalizer that is not overridden, and to finalize them more efficiently, as described in [§12.6.1](#jls-12.6.1).

A finalizer may be invoked explicitly, just like any other method.

The package `java.lang.ref` describes weak references, which interact with garbage collection and finalization. As with any API that has special interactions with the Java programming language, implementors must be cognizant of any requirements imposed by the `java.lang.ref` API. This specification does not discuss weak references in any way. Readers are referred to the API documentation for details.

### 12.6.1. Implementing Finalization

Every object can be characterized by two attributes: it may be *reachable*, *finalizer-reachable*, or *unreachable*, and it may also be *unfinalized*, *finalizable*, or *finalized*.

A *reachable* object is any object that can be accessed in any potential continuing computation from any live thread.

A *finalizer-reachable* object can be reached from some finalizable object through some chain of references, but not from any live thread.

An *unreachable* object cannot be reached by either means.

An *unfinalized* object has never had its finalizer automatically invoked.

A *finalized* object has had its finalizer automatically invoked.

A *finalizable* object has never had its finalizer automatically invoked, but the Java Virtual Machine may eventually automatically invoke its finalizer.

An object `o` is not finalizable until its constructor has invoked the constructor for `Object` on `o` and that invocation has completed successfully (that is, without throwing an exception). Every pre-finalization write to a field of an object must be visible to the finalization of that object. Furthermore, none of the pre-finalization reads of fields of that object may see writes that occur after finalization of that object is initiated.

Optimizing transformations of a program can be designed that reduce the number of objects that are reachable to be less than those which would naively be considered reachable. For example, a Java compiler or code generator may choose to set a variable or parameter that will no longer be used to `null` to cause the storage for such an object to be potentially reclaimable sooner.

Another example of this occurs if the values in an object's fields are stored in registers. The program may then access the registers instead of the object, and never access the object again. This would imply that the object is garbage. Note that this sort of optimization is only allowed if references are on the stack, not stored in the heap.

For example, consider the *Finalizer Guardian* pattern:

```
class Foo {
    private final Object finalizerGuardian = new Object() {
        protected void finalize() throws Throwable {
            /* finalize outer Foo object */
        }
    }
}
```

The finalizer guardian forces `super.finalize` to be called if a subclass overrides `finalize` and does not explicitly call `super.finalize`.

If these optimizations are allowed for references that are stored on the heap, then a Java compiler can detect that the `finalizerGuardian` field is never read, null it out, collect the object immediately, and call the finalizer early. This runs counter to the intent: the programmer probably wanted to call the `Foo` finalizer when the `Foo` instance became unreachable. This sort of transformation is therefore not legal: the inner class object should be reachable for as long as the outer class object is reachable.

Transformations of this sort may result in invocations of the `finalize` method occurring earlier than might be otherwise expected. In order to allow the user to prevent this, we enforce the notion that synchronization may keep the object alive. *If an object's finalizer can result in synchronization on that object, then that object must be alive and considered reachable whenever a lock is held on it.*

Note that this does not prevent synchronization elimination: synchronization only keeps an object alive if a finalizer might synchronize on it. Since the finalizer occurs in another thread, in many cases the synchronization could not be removed anyway.

### 12.6.2. Interaction with the Memory Model

It must be possible for the memory model ([§17.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-17.html#jls-17.4)) to decide when it can commit actions that take place in a finalizer. This section describes the interaction of finalization with the memory model.

Each execution has a number of *reachability decision points*, labeled *di*. Each action either *comes-before di* or *comes-after di*. Other than as explicitly mentioned, the comes-before ordering described in this section is unrelated to all other orderings in the memory model.

If *r* is a read that sees a write *w* and *r* comes-before *di*, then *w* must come-before *di*.

If *x* and *y* are synchronization actions on the same variable or monitor such that *so(x, y)* ([§17.4.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-17.html#jls-17.4.4)) and *y* comes-before *di*, then *x* must come-before *di*.

At each reachability decision point, some set of objects are marked as unreachable, and some subset of those objects are marked as finalizable. These reachability decision points are also the points at which references are checked, enqueued, and cleared according to the rules provided in the API documentation for the package `java.lang.ref`.

The only objects that are considered definitely reachable at a point *di* are those that can be shown to be reachable by the application of these rules:

- An object `B` is definitely reachable at *di* from `static` fields if there exists a write *w1* to a `static` field `v` of a class C such that the value written by *w1* is a reference to `B`, the class C is loaded by a reachable classloader, and there does not exist a write *w2* to `v` such that *hb(w2, w1)* is not true and both *w1* and *w2* come-before *di*.
- An object `B` is definitely reachable from `A` at *di* if there is a write *w1* to an element `v` of `A` such that the value written by *w1* is a reference to `B` and there does not exist a write *w2* to `v` such that *hb(w2, w1)* is not true and both *w1* and *w2* come-before *di*.
- If an object `C` is definitely reachable from an object `B`, and object `B` is definitely reachable from an object `A`, then `C` is definitely reachable from `A`.

If an object `X` is marked as unreachable at *di*, then:

- `X` must not be definitely reachable at *di* from `static` fields; and
- All *active uses* of `X` in thread `t` that come-after *di* must occur in the finalizer invocation for `X` or as a result of thread `t` performing a read that comes-after *di* of a reference to `X`; and
- All reads that come-after *di* that see a reference to `X` must see writes to elements of objects that were unreachable at *di*, or see writes that came-after *di*.

An action *a* is an active use of `X` if and only if at least one of the following is true:

- *a* reads or writes an element of `X`
- *a* locks or unlocks `X` and there is a lock action on `X` that happens-after the invocation of the finalizer for `X`
- *a* writes a reference to `X`
- *a* is an active use of an object `Y`, and `X` is definitely reachable from `Y`

If an object `X` is marked as finalizable at *di*, then:

- `X` must be marked as unreachable at *di*; and
- *di* must be the only place where `X` is marked as finalizable; and
- actions that happen-after the finalizer invocation must come-after *di*.

## 12.7. Unloading of Classes and Interfaces

An implementation of the Java programming language may *unload* classes.

A class or interface may be unloaded if and only if its defining class loader may be reclaimed by the garbage collector as discussed in [§12.6](#jls-12.6).

Classes and interfaces loaded by the bootstrap loader may not be unloaded.

Class unloading is an optimization that helps reduce memory use. Obviously, the semantics of a program should not depend on whether and how a system chooses to implement an optimization such as class unloading. To do otherwise would compromise the portability of programs. Consequently, whether a class or interface has been unloaded or not should be transparent to a program.

However, if a class or interface C was unloaded while its defining loader was potentially reachable, then C might be reloaded. One could never ensure that this would not happen. Even if the class was not referenced by any other currently loaded class, it might be referenced by some class or interface, D, that had not yet been loaded. When D is loaded by C's defining loader, its execution might cause reloading of C.

Reloading may not be transparent if, for example, the class has `static` variables (whose state would be lost), static initializers (which may have side effects), or `native` methods (which may retain static state). Furthermore, the hash value of the `Class` object is dependent on its identity. Therefore it is, in general, impossible to reload a class or interface in a completely transparent manner.

Since we can never guarantee that unloading a class or interface whose loader is potentially reachable will not cause reloading, and reloading is never transparent, but unloading must be transparent, it follows that one must not unload a class or interface while its loader is potentially reachable. A similar line of reasoning can be used to deduce that classes and interfaces loaded by the bootstrap loader can never be unloaded.

One must also argue why it is safe to unload a class C if its defining class loader can be reclaimed. If the defining loader can be reclaimed, then there can never be any live references to it (this includes references that are not live, but might be resurrected by finalizers). This, in turn, can only be true if there are can never be any live references to any of the classes defined by that loader, including C, either from their instances or from code.

Class unloading is an optimization that is only significant for applications that load large numbers of classes and that stop using most of those classes after some time. A prime example of such an application is a web browser, but there are others. A characteristic of such applications is that they manage classes through explicit use of class loaders. As a result, the policy outlined above works well for them.

Strictly speaking, it is not essential that the issue of class unloading be discussed by this specification, as class unloading is merely an optimization. However, the issue is very subtle, and so it is mentioned here by way of clarification.

## 12.8. Program Exit

A program terminates all its activity and *exits* when one of two things happens:

- All the threads that are not daemon threads terminate.
- Some thread invokes the `exit` method of class `Runtime` or class `System`, and the `exit` operation is not forbidden by the security manager.

## 12.8. 程序退出

当发生以下两种情况之一时，程序将终止其所有活动并 *退出*：

- 所有的前台线程(非守护线程, not daemon threads)都已经停止了。
- 某些线程调用了`Runtime`类或者 `System`类的`exit`方法, 而且 `exit` 操作没有被安全管理器(security manager)禁止。


## 相关链接

- [Java Language Specification: Chapter 12. Execution](https://docs.oracle.com/javase/specs/jls/se11/html/jls-12.html)
