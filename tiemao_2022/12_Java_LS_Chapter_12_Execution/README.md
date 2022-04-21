# Java Language Specification

## Chapter 12. Execution


# Java语言规范文档

> Java虚拟机, 全称为 Java Virtual Machine, 简称JVM。
> 常量值, constant value
> 常量变量, constant variable


<a name="jls-12"></a>

## 第12章. 执行(Execution)

This chapter specifies activities that occur during execution of a program. It is organized around the life cycle of the Java Virtual Machine and of the classes, interfaces, and objects that form a program.

The Java Virtual Machine starts up by loading a specified class or interface, then invoking the method `main` in this specified class or interface. Section [§12.1](#jls-12.1) outlines the loading, linking, and initialization steps involved in executing `main`, as an introduction to the concepts in this chapter. Further sections specify the details of loading ([§12.2](#jls-12.2)), linking ([§12.3](#jls-12.3)), and initialization ([§12.4](#jls-12.4)).

The chapter continues with a specification of the procedures for creation of new class instances ([§12.5](#jls-12.5)); and finalization of class instances ([§12.6](#jls-12.6)). It concludes by describing the unloading of classes ([§12.7](#jls-12.7)) and the procedure followed when a program exits ([§12.8](#jls-12.8)).


本章规定了程序执行期间发生的活动。 主要围绕 Java 虚拟机，以及构成程序的类、接口和对象的生命周期进行组织。

Java 虚拟机启动时，先加载指定的类(class)或接口(interface)，然后调用在该类或接口中声明的 `main` 方法。

>【从Java8开始, 接口中支持static方法和default方法, interface中也就支持 main 方法了】

[§12.1](#jls-12.1) 小节概述了执行 `main` 方法所涉及的加载(loading)、链接(linking)和初始化(initialization)步骤，作为本章中基础概念的介绍。
接下来的部分，详细说明了加载 ([§12.2](#jls-12.2))、链接 ([§12.3](#jls-12.3)) 和初始化 ([§12.4](#jls-12.4)) 的细节与规范。

接着 [§12.5](#jls-12.5) 介绍类的新实例创建过程；以及类对象的最终确定（[§12.6](#jls-12.6)）。
最后 [§12.7](#jls-12.7) 描述了类的卸载；还有程序退出时需要遵循的过程 ([§12.8](#jls-12.8))。


<a name="jls-12.1"></a>

## 12.1. Java Virtual Machine Startup

The Java Virtual Machine starts execution by invoking the method `main` of some specified class or interface, passing it a single argument which is an array of strings. In the examples in this specification, this first class is typically called `Test`.

The precise semantics of Java Virtual Machine startup are given in Chapter 5 of *The Java Virtual Machine Specification, Java SE 11 Edition*. Here we present an overview of the process from the viewpoint of the Java programming language.

The manner in which the initial class or interface is specified to the Java Virtual Machine is beyond the scope of this specification, but it is typical, in host environments that use command lines, for the fully qualified name of the class or interface to be specified as a command line argument and for following command line arguments to be used as strings to be provided as the argument to the method `main`.

For example, in a UNIX implementation, the command line:


## 12.1. Java虚拟机启动

Java虚拟机通过调用某个指定类或接口的 `main` 方法开始执行，并向main方法传递一个参数, 类型为字符串数组。 在本规范的示例中，第一个类通常命名为 `Test`。

Java 虚拟机启动的精确语义在 *The Java Virtual Machine Specification, Java SE 11 Edition* 的第 5 章中给出。 在这里，我们从 Java 编程语言的角度来概述这个过程。

为 Java 虚拟机指定初始类或接口的方式超出了本规范的范围，但在命令行环境中，通常需要指定类或接口的完全限定名作为命令行参数，并将后续的命令行参数作为字符串数组提供给 `main` 方法。

例如，在 UNIX 系统中，执行下面的命令行脚本:


```
java Test reboot Bob Dot Enzo
```

will typically start a Java Virtual Machine by invoking method `main` of class `Test` (a class in an unnamed package), passing it an array containing the four strings "`reboot`", "`Bob`", "`Dot`", and "`Enzo`".

We now outline the steps the Java Virtual Machine may take to execute `Test`, as an example of the loading, linking, and initialization processes that are described further in later sections.

通过命令调用 `Test` 类的 `main` 方法来启动 Java 虚拟机, 这个 `Test` 类没有包名, 传递给main方法的参数是一个数组, 包含 "`reboot`", "`Bob`", "`Dot`", 以及 "`Enzo`" 四个字符串。

我们现在将 Java 虚拟机执行`Test`类可能采取的步骤，归纳为: 加载(loading)、链接(linking)和初始化(initialization)过程，这些过程在后面的部分中详细介绍。

<a name="jls-12.1.1"></a>

### 12.1.1. Load the Class `Test`

The initial attempt to execute the method `main` of class `Test` discovers that the class `Test` is not loaded - that is, that the Java Virtual Machine does not currently contain a binary representation for this class. The Java Virtual Machine then uses a class loader to attempt to find such a binary representation. If this process fails, then an error is thrown. This loading process is described further in [§12.2](#jls-12.2).


### 12.1.1. 加载`Test`类

JVM最初尝试执行 `Test` 类的 `main` 方法时, 发现尚未加载类 `Test` - 也就是说，Java虚拟机当前还未包含此类的二进制表示。
Java 虚拟机然后通过类加载器尝试找到这样的二进制表示。 如果此过程失败，则会引发错误。 [§12.2](#jls-12.2) 中进一步描述了这个加载过程。

<a name="jls-12.1.2"></a>

### 12.1.2. Link `Test`: Verify, Prepare, (Optionally) Resolve

After `Test` is loaded, it must be initialized before `main` can be invoked. And `Test`, like all (class or interface) types, must be linked before it is initialized. Linking involves verification, preparation, and (optionally) resolution. Linking is described further in [§12.3](#jls-12.3).

Verification checks that the loaded representation of `Test` is well-formed, with a proper symbol table. Verification also checks that the code that implements `Test` obeys the semantic requirements of the Java programming language and the Java Virtual Machine. If a problem is detected during verification, then an error is thrown. Verification is described further in [§12.3.1](#jls-12.3.1).

### 12.1.2. 链接 `Test`: 验证、准备、解析（可选）

`Test` 类加载后，必须在调用 `main` 之前对其进行初始化(initialized)。 与所有类型（类或接口）一样， `Test` 必须在初始化之前进行链接。 链接涉及验证(verification)、准备(preparation)和(可选的)解析（resolution）。 [§12.3](#jls-12.3) 中进一步描述了链接过程。

验证过程会检查加载到的 `Test` 字节码格式正确，具有正确的符号表。 验证还检查实现 `Test` 的代码是否符合 Java 编程语言和 Java 虚拟机的语义要求。 如果在验证过程中检测到问题，则会引发错误。 [§12.3.1](#jls-12.3.1) 中进一步描述了验证。

Preparation involves allocation of static storage and any data structures that are used internally by the implementation of the Java Virtual Machine, such as method tables. Preparation is described further in [§12.3.2](#jls-12.3.2).

Resolution is the process of checking symbolic references from `Test` to other classes and interfaces, by loading the other classes and interfaces that are mentioned and checking that the references are correct.

The resolution step is optional at the time of initial linkage. An implementation may resolve symbolic references from a class or interface that is being linked very early, even to the point of resolving all symbolic references from the classes and interfaces that are further referenced, recursively. (This resolution may result in errors from these further loading and linking steps.) This implementation choice represents one extreme and is similar to the kind of "static" linkage that has been done for many years in simple implementations of the C language. (In these implementations, a compiled program is typically represented as an "`a.out`" file that contains a fully-linked version of the program, including completely resolved links to library routines used by the program. Copies of these library routines are included in the "`a.out`" file.)

准备过程(Preparation)包括分配静态存储和 Java 虚拟机实现内部使用的任何数据结构，例如方法表。 [§12.3.2](#jls-12.3.2) 中进一步描述了准备过程。

解析是检查从 `Test` 到其他类和接口的符号引用的过程，会加载引用到的其他类和接口, 并检查引用是否正确。

在初始化链接时，解析步骤是可选的。 JVM实现可以在链接类或接口的早期阶段解析符号引用，甚至可以递归地解析来自更深层引用的类和接口中的所有符号引用。 （但这种递归解决方案可能会导致进一步的加载和链接步骤出错。）这种实现选择代表了一个极端，类似于多年来在 C 语言的简单实现中所做的那种“静态”链接。 （在这些C编译器实现中，编译的程序通常表示为 "`a.out`" 文件，其中包含程序的完全链接版本，包括程序使用的库例程的完全解析链接。这些库例程的副本被打包到 "`a.out`" 文件中。）

An implementation may instead choose to resolve a symbolic reference only when it is actively used; consistent use of this strategy for all symbolic references would represent the "laziest" form of resolution. In this case, if `Test` had several symbolic references to another class, then the references might be resolved one at a time, as they are used, or perhaps not at all, if these references were never used during execution of the program.

The only requirement on when resolution is performed is that any errors detected during resolution must be thrown at a point in the program where some action is taken by the program that might, directly or indirectly, require linkage to the class or interface involved in the error. Using the "static" example implementation choice described above, loading and linkage errors could occur before the program is executed if they involved a class or interface mentioned in the class `Test` or any of the further, recursively referenced, classes and interfaces. In a system that implemented the "laziest" resolution, these errors would be thrown only when an incorrect symbolic reference is actively used.

The resolution process is described further in [§12.3.3](#jls-12.3.3).

具体的JVM实现可能会选择仅在主动使用符号引用时才去解析；对所有符号引用一致使用此策略将代表“最懒惰”的解决形式。 在这种情况下，如果 `Test` 有多个对另其它类的符号引用，那么这些引用可能会在使用时, 用到一个解析一个，或者如果在程序执行期间从未使用过这些引用，则可能根本不进行解析。

关于何时执行解析的唯一要求是，在解析期间检测到的任何错误必须在程序中的某个点抛出，程序可能需要在链接到涉及的类或接口出错时, 对这种错误采取某些直接或间接的操作.  如果JVM使用上面描述的“静态”方式实现，在加载和链接 `Test` 类中提到的类或接口, 或任何进一步的递归引用的类和接口，假如报错，则可能会在程序执行之前发生加载和链接错误。 在使用“最懒惰”解决方案的系统中，只有在主动使用错误的符号引用时才会抛出这些错误。

[§12.3.3](#jls-12.3.3) 中进一步描述了解析过程。

<a name="jls-12.1.3"></a>

### 12.1.3. Initialize Test: Execute Initializers

In our continuing example, the Java Virtual Machine is still trying to execute the method `main` of class `Test`. This is permitted only if the class has been initialized ([§12.4.1](#jls-12.4.1)).

Initialization consists of execution of any class variable initializers and static initializers of the class `Test`, in textual order. But before `Test` can be initialized, its direct superclass must be initialized, as well as the direct superclass of its direct superclass, and so on, recursively. In the simplest case, `Test` has `Object` as its implicit direct superclass; if class `Object` has not yet been initialized, then it must be initialized before `Test` is initialized. Class `Object` has no superclass, so the recursion terminates here.

If class `Test` has another class `Super` as its superclass, then `Super` must be initialized before `Test`. This requires loading, verifying, and preparing `Super` if this has not already been done and, depending on the implementation, may also involve resolving the symbolic references from `Super` and so on, recursively.

Initialization may thus cause loading, linking, and initialization errors, including such errors involving other types.

The initialization process is described further in [§12.4](#jls-12.4).

### 12.1.3. Test初始化：执行初始化代码

继续我们的示例，Java 虚拟机仍在尝试执行 `Test` 类的 `main` 方法。 但是只有在类已初始化时才允许这样做 ([§12.4.1](#jls-12.4.1))。

初始化就是按源代码中的文本顺序执行 `Test` 类的所有类变量初始化代码, 以及静态初始化块。 但是在 `Test` 可以被初始化之前，它的直接超类必须先被初始化，以及超类的超类，以此类推。 在最简单的情况下，`Test` 将 `Object` 作为其隐式直接超类； 如果类 `Object` 尚未初始化，则必须在初始化 `Test` 之前先对其进行初始化。 `Object` 类没有超类，因此递归在此终止。

如果 `Test` 类有另一个类`Super`作为超类，那么`Super`类必须在`Test`之前进行初始化。这就需要加载、验证和准备`Super`（如果尚未完成），并且根据JVM实现，还可能涉及递归地解析`Super`类中的符号引用等等。

因此，初始化可能会导致加载、链接, 还可能会导致初始化错误，包括其他相关类的这些错误。

[§12.4](#jls-12.4) 中进一步描述了初始化过程。

<a name="jls-12.1.4"></a>

### 12.1.4. Invoke `Test.main`

Finally, after completion of the initialization for class `Test` (during which other consequential loading, linking, and initializing may have occurred), the method `main` of `Test` is invoked.

The method `main` must be declared `public`, `static`, and `void`. It must specify a formal parameter ([§8.4.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.4.1)) whose declared type is array of `String`. Therefore, either of the following declarations is acceptable:

### 12.1.4. 调用`Test.main`

在`Test` 类初始化此期间可能发生其他相关类的加载、链接和初始化；最后，在完成 `Test` 类的初始化之后，调用`Test`的`main`方法。

`main`方法必须声明为 `public`, `static`, `void`。 而且必须指定一个声明类型为 `String`数组的形参（[§8.4.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.4.1)）。 因此，JVM可以接受以下任何一种形式的方法声明：


```java
public static void main(String[] args)
public static void main(String []args)
public static void main(String... args)
public static void main(String... aaa)
```


<a name="jls-12.2"></a>

## 12.2. Loading of Classes and Interfaces

*Loading* refers to the process of finding the binary form of a class or interface type with a particular name, perhaps by computing it on the fly, but more typically by retrieving a binary representation previously computed from source code by a Java compiler, and constructing, from that binary form, a `Class` object to represent the class or interface.

The precise semantics of loading are given in Chapter 5 of *The Java Virtual Machine Specification, Java SE 11 Edition*. Here we present an overview of the process from the viewpoint of the Java programming language.

The binary format of a class or interface is normally the `class` file format described in *The Java Virtual Machine Specification, Java SE 11 Edition* cited above, but other formats are possible, provided they meet the requirements specified in [§13.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.1). The method `defineClass` of class `ClassLoader` may be used to construct `Class` objects from binary representations in the `class` file format.

## 12.2. 类和接口的加载

加载(Loading)是指根据特定名称查找类或接口类型的二进制表示形式的过程，可以在运行时通过动态计算得出，但一般都是通过检索由 Java 编译器从源代码编译得出的二进制表示； 然后通过这种二进制形式来构建出一个 `Class` 对象来表示类或接口。

JVM规范的第 5 章中给出了加载的精确语义。 在这里，我们从 Java 编程语言的角度来概述这个过程。

类或接口的二进制格式通常是 `class` 文件格式, 由Java 虚拟机规范所定义，当然，其他格式也是可能的，只要它们满足 [§13.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.1) 中指定的要求。 `ClassLoader` 类的 `defineClass` 方法可用于从 `class` 文件格式的二进制表示来构造出 `Class` 对象。


Well-behaved class loaders maintain these properties:

- Given the same name, a good class loader should always return the same class object.
- If a class loader `L1` delegates loading of a class C to another loader `L2`, then for any type T that occurs as the direct superclass or a direct superinterface of C, or as the type of a field in C, or as the type of a formal parameter of a method or constructor in C, or as a return type of a method in C, `L1` and `L2` should return the same `Class` object.

A malicious class loader could violate these properties. However, it could not undermine the security of the type system, because the Java Virtual Machine guards against this.

For further discussion of these issues, see *The Java Virtual Machine Specification, Java SE 11 Edition* and the paper *Dynamic Class Loading in the Java Virtual Machine*, by Sheng Liang and Gilad Bracha, in *Proceedings of OOPSLA '98*, published as *ACM SIGPLAN Notices*, Volume 33, Number 10, October 1998, pages 36-44. A basic principle of the design of the Java programming language is that the run-time type system cannot be subverted by code written in the Java programming language, not even by implementations of such otherwise sensitive system classes as `ClassLoader` and `SecurityManager`.


行为良好的类加载器支持这些特性：

- 给定相同的名称，一个好的类加载器应该总是返回相同的类对象。
- 如果类加载器 `L1` 将类 C 的加载委托给另一个加载器`L2`；那么对于任何类型 T，作为 C 的直接超类，或C的直接超接口, 或作为 C 中字段的类型，或作为 C 中方法或构造函数的形参类型，或者作为 C 中方法的返回类型，`L1` 和 `L2` 都应该返回相同的 `Class` 对象。

恶意类加载器可能会违反这些特性。 但是，它不会破坏类型系统的安全性， 因为 Java 虚拟机对此进行了防范。

有关这些问题的进一步讨论，请参阅 *The Java Virtual Machine Specification, Java SE 11 Edition* 和论文 *Dynamic Class Loading in the Java Virtual Machine*，作者 Sheng Liang 和 Gilad Bracha，在 *Proceedings of OOPSLA '98*，出版为 *ACM SIGPLAN Notices*，第 33 卷，第 10 期，1998 年 10 月，第 36-44 页。 Java 编程语言的一个基本设计原则是，运行时类型系统不能被 Java 编程语言编写的代码所颠覆，即使是 `ClassLoader` and `SecurityManager` 等敏感系统类的实现也不行。

<a name="jls-12.2.1"></a>

### 12.2.1. The Loading Process

The loading process is implemented by the class `ClassLoader` and its subclasses.

Different subclasses of `ClassLoader` may implement different loading policies. In particular, a class loader may cache binary representations of classes and interfaces, prefetch them based on expected usage, or load a group of related classes together. These activities may not be completely transparent to a running application if, for example, a newly compiled version of a class is not found because an older version is cached by a class loader. It is the responsibility of a class loader, however, to reflect loading errors only at points in the program where they could have arisen without prefetching or group loading.

If an error occurs during class loading, then an instance of one of the following subclasses of class `LinkageError` will be thrown at any point in the program that (directly or indirectly) uses the type:

- `ClassCircularityError`: A class or interface could not be loaded because it would be its own superclass or superinterface ([§8.1.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.1.4), [§9.1.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-9.html#jls-9.1.3), [§13.4.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.4)).
- `ClassFormatError`: The binary data that purports to specify a requested compiled class or interface is malformed.
- `NoClassDefFoundError`: No definition for a requested class or interface could be found by the relevant class loader.

Because loading involves the allocation of new data structures, it may fail with an `OutOfMemoryError`.


### 12.2.1. 加载过程

加载过程(Loading Process, 或者称为装载过程)由 `ClassLoader` 类及其子类实现。

`ClassLoader` 的不同子类可能实现不同的加载策略。 特别是，类加载器可以缓存类和接口的二进制表示，根据预期使用情况执行预加载，或者一次性加载一组相关的类。 这些活动对正在运行的应用程序而言可能不是完全透明的，例如，如果由于类加载器缓存了旧版本的class文件，而导致找不到新编译的class等问题。 然而，类加载器的职责是只在程序中没有预取或组加载的情况下可能出现加载错误的地方反映加载错误。

如果在类加载过程中发生错误，可能在程序中（直接或间接）使用该类型的任何位置，抛出以下 `LinkageError` 子类的错误：

- `ClassCircularityError`：无法加载类或接口，因为它是自己的超类或超接口（ [§8.1.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.1.4), [§9.1.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-9.html#jls-9.1.3), [§13.4.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.4) ）。
- `ClassFormatError`： 请求的类或接口, 对应的class文件二进制数据格式错误。
- `NoClassDefFoundError`：相关类加载器找不到请求的类或接口定义。

因为加载涉及到新数据结构的分配，所以可能会失败并抛出 `OutOfMemoryError`。

<a name="jls-12.3"></a>

## 12.3. Linking of Classes and Interfaces

*Linking* is the process of taking a binary form of a class or interface type and combining it into the run-time state of the Java Virtual Machine, so that it can be executed. A class or interface type is always loaded before it is linked.

Three different activities are involved in linking: verification, preparation, and resolution of symbolic references.

The precise semantics of linking are given in Chapter 5 of *The Java Virtual Machine Specification, Java SE 11 Edition*. Here we present an overview of the process from the viewpoint of the Java programming language.

This specification allows an implementation flexibility as to when linking activities (and, because of recursion, loading) take place, provided that the semantics of the Java programming language are respected, that a class or interface is completely verified and prepared before it is initialized, and that errors detected during linkage are thrown at a point in the program where some action is taken by the program that might require linkage to the class or interface involved in the error.

For example, an implementation may choose to resolve each symbolic reference in a class or interface individually, only when it is used (lazy or late resolution), or to resolve them all at once while the class is being verified (static resolution). This means that the resolution process may continue, in some implementations, after a class or interface has been initialized.

Because linking involves the allocation of new data structures, it may fail with an `OutOfMemoryError`.

## 12.3. 类和接口的链接

链接(Linking): 主要是将类或接口的二进制形式, 组合到Java虚拟机的运行时状态中，并使其可以执行的过程。 在链接开始之前类或接口就已经加载完成了。

链接涉及三种不同的活动： 验证、准备、符号引用的解析。

*The Java Virtual Machine Specification, Java SE 11 Edition* 的第 5 章给出了链接的精确语义。 在这里，我们从 Java 编程语言的角度概述该过程。

本规范允许在JVM实现在任意时刻灵活地执行链接活动（以及递归链接而产生的加载行为），前提是尊重 Java 编程语言的语义， 在初始化之前对类或接口进行完全的验证和准备，并且在链接期间检测到的错误会在程序执行过程中的某个点被抛出，在该点上，程序执行了一些可能需要链接到错误中所涉及的类或接口的操作。

例如，JVM实现可以选择懒惰或延迟解析(lazy or late resolution), 仅在用到时单独解析类或接口中的每一个符号引用； 或者选择静态解析(static resolution)，在验证类时一次性解析。 这意味着在某些JVM实现中，在类或接口完成初始化之后，解析过程还可能在断断续续执行。

因为链接涉及新数据结构的分配，所以可能会失败并抛出 `OutOfMemoryError`。

<a name="jls-12.3.1"></a>

### 12.3.1. Verification of the Binary Representation

*Verification* ensures that the binary representation of a class or interface is structurally correct. For example, it checks that every instruction has a valid operation code; that every branch instruction branches to the start of some other instruction, rather than into the middle of an instruction; that every method is provided with a structurally correct signature; and that every instruction obeys the type discipline of the Java Virtual Machine language.

If an error occurs during verification, then an instance of the following subclass of class `LinkageError` will be thrown at the point in the program that caused the class to be verified:

- `VerifyError`: The binary definition for a class or interface failed to pass a set of required checks to verify that it obeys the semantics of the Java Virtual Machine language and that it cannot violate the integrity of the Java Virtual Machine. (See [§13.4.2](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.2), [§13.4.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.4), [§13.4.9](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.9), and [§13.4.17](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.17) for some examples.)

### 12.3.1. 对二进制数据进行验证

*验证(Verification)*：确保类或接口的二进制表示在结构上是正确的。 例如，检查每条指令是否包含一个有效的操作码；每条分支指令的跳转索引都是其他指令的开头，而不是跳转到某条指令的中间；每个方法都提供了结构正确的签名；并且每条指令都遵循 Java 虚拟机语言的类型规则。

如果在验证过程中发生错误，则会在程序中导致该类被验证的执行处, 抛出以下 `LinkageError` 子类的实例：

- `VerifyError`：类或接口的二进制定义未能通过一组必需的检查，以验证它是否符合 Java 虚拟机语言的语义，并且不能违反 Java 虚拟机的完整性。 （示例请参见[§13.4.2](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.2), [§13.4.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.4), [§13.4.9](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.9), 以及 [§13.4.17](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.17)。）

<a name="jls-12.3.2"></a>

### 12.3.2. Preparation of a Class or Interface Type

*Preparation* involves creating the `static` fields (class variables and constants) for a class or interface and initializing such fields to the default values ([§4.12.5](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.5)). This does not require the execution of any source code; explicit initializers for static fields are executed as part of initialization ([§12.4](#jls-12.4)), not preparation.

Implementations of the Java Virtual Machine may precompute additional data structures at preparation time in order to make later operations on a class or interface more efficient. One particularly useful data structure is a "method table" or other data structure that allows any method to be invoked on instances of a class without requiring a search of superclasses at invocation time.

### 12.3.2. 类或接口类型的准备

*准备(Preparation)*：涉及为类或接口创建`static`字段（类变量和常量），并将这些字段初始化为默认值（[§4.12.5](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.5))。 这个过程不需要执行任何源代码； 对静态字段的显式初始化赋值是初始化（initialization）过程的一部分（[§12.4](#jls-12.4)），准备阶段并不处理。

Java 虚拟机的实现可以在准备阶段, 预先计算额外的数据结构，以使后续对类或接口的操作更高效。 一种特别有用的数据结构是 "method table(方法表)" 或类似的其他数据结构，它允许在类的实例上调用任何方法，而无需在调用时再搜索超类。

<a name="jls-12.3.3"></a>

### 12.3.3. Resolution of Symbolic References

The binary representation of a class or interface references other classes and interfaces and their fields, methods, and constructors symbolically, using the binary names ([§13.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.1)) of the other classes and interfaces ([§13.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.1)). For fields and methods, these symbolic references include the name of the class or interface type of which the field or method is a member, as well as the name of the field or method itself, together with appropriate type information.

Before a symbolic reference can be used it must undergo resolution, wherein a symbolic reference is checked to be correct and, typically, replaced with a direct reference that can be more efficiently processed if the reference is used repeatedly.

If an error occurs during resolution, then an error will be thrown. Most typically, this will be an instance of one of the following subclasses of the class `IncompatibleClassChangeError`, but it may also be an instance of some other subclass of `IncompatibleClassChangeError` or even an instance of the class `IncompatibleClassChangeError` itself. This error may be thrown at any point in the program that uses a symbolic reference to the type, directly or indirectly:

### 12.3.3. 解析符号引用

类或接口的二进制表示, 通过二进制格式的名称作为符号, 来引用其他类和接口，以及相应的字段、方法和构造函数（[§13.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.1)) 的其他类和接口。 对于字段和方法，这些符号引用包括:

- 字段或方法所属的类/接口类型的名称，
- 以及字段或方法本身的名称，
- 以及相关的类型信息。

在符号引用可以使用前，必须经过解析；解析过程会检查符号引用是否正确，通常会替换为直接引用；如果多个地方重复使用该引用, 那么这种替换就可以提升处理效率。

如果在解析过程中发生错误，则会抛出错误。 最典型的情况下，抛出的错误是 `IncompatibleClassChangeError` 类及其子类的实例。 这些错误会在程序中直接或间接使用该类型的符号引用的任何位置引发：

- `IllegalAccessError`: A symbolic reference has been encountered that specifies a use or assignment of a field, or invocation of a method, or creation of an instance of a class, to which the code containing the reference does not have access because the field or method was declared with `private`, `protected`, or package access (not `public`), or because the class was not declared `public` in a package that is exported or opened to the code containing the reference.

  This can occur, for example, if a field that is originally declared `public` is changed to be `private` after another class that refers to the field has been compiled ([§13.4.7](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.7)); or if the package in which a `public` class is declared ceases to be exported by its module after another module that refers to the class has been compiled ([§13.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.3)).

- `InstantiationError`: A symbolic reference has been encountered that is used in class instance creation expression, but an instance cannot be created because the reference turns out to refer to an interface or to an abstract class.

  This can occur, for example, if a class that is originally not `abstract` is changed to be `abstract` after another class that refers to the class in question has been compiled ([§13.4.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.1)).

- `IllegalAccessError`：非法访问错误; 遇到一个符号引用，对某个字段进行使用或赋值，或调用某个方法，或创建某个类的实例，但是包含这个引用的代码无权限访问，因为该字段或方法被声明为  `private`, `protected` 或包访问（非 `public` ），或者因为在导出或打开到包含引用的代码的包中未将类声明为 `public`。

  例如，一个类的某个字段, 原先声明为 `public`, 其他类引用这个字段完全没问题, 可以通过编译; 但是在编译完成后 又将 `public` 声明的字段改为 `private` 访问权限, 如果只编译修改后的这个类, 那么在运行时就会出现这种问类; 或者，一个package中导出的public类, 如果在引用该类的另一个模块被编译后，这个package却不再由其模块导出该类等情况（([§13.4.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.1)))。

- `InstantiationError`：实例化错误; 遇到一个符号引用，用来对某个类进行实例创建，但无法创建对应的实例，因为该引用指向的是接口或者抽象类。

  例如，如果一个原本不是 `abstract` 的类，在另一个引用该类的类被编译后，更改为  `abstract`（[§13.4.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.1))。


- `NoSuchFieldError`: A symbolic reference has been encountered that refers to a specific field of a specific class or interface, but the class or interface does not contain a field of that name.

  This can occur, for example, if a field declaration was deleted from a class after another class that refers to the field was compiled ([§13.4.8](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.8)).

- `NoSuchMethodError`: A symbolic reference has been encountered that refers to a specific method of a specific class or interface, but the class or interface does not contain a method of that signature.

  This can occur, for example, if a method declaration was deleted from a class after another class that refers to the method was compiled ([§13.4.12](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.12)).

- `NoSuchFieldError`：没有这个字段； 遇到了引用特定类或接口的特定字段的符号引用，但该类或接口不包含该名称的字段。

   例如，如果在引用该字段的另一个类编译之后，从被引用类中删除了字段声明（ [§13.4.8](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.8) ）。

- `NoSuchMethodError`：没有这个方法; 遇到了引用特定类或接口的特定方法的符号引用，但该类或接口不包含该签名的方法。

   例如，如果在引用该方法的另一个类编译之后, 从被引用类中删除了方法声明（ [§13.4.12](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.12) )。

Additionally, an `UnsatisfiedLinkError`, a subclass of `LinkageError`, may be thrown if a class declares a `native` method for which no implementation can be found. The error will occur if the method is used, or earlier, depending on what kind of resolution strategy is being used by an implementation of the Java Virtual Machine ([§12.3](#jls-12.3)).

此外，如果一个类声明了 `native` 方法却找不到对应的实现，则可能会抛出错误 `UnsatisfiedLinkError`，这也是 `LinkageError` 的子类。
抛出的实际可能是调用这个方法时，或者更早的时间点，具体取决于 Java 虚拟机实现使用哪种解析策略 ([§12.3](#jls-12.3))。

<a name="jls-12.4"></a>

## 12.4. Initialization of Classes and Interfaces

*Initialization* of a class consists of executing its static initializers and the initializers for `static` fields (class variables) declared in the class.

*Initialization* of an interface consists of executing the initializers for fields (constants) declared in the interface.

## 12.4. 类和接口的初始化

*初始化(Initialization)*:

- 类的初始化, 包括执行其静态初始化块, 以及类中 `static` 字段（类变量）的声明式赋值代码。
- 接口初始化, 包括执行接口中 `static` 字段（类变量）的声明式赋值代码。

<a name="jls-12.4.1"></a>

### 12.4.1. When Initialization Occurs

A class or interface type T will be initialized immediately before the first occurrence of any one of the following:

- T is a class and an instance of T is created.
- A `static` method declared by T is invoked.
- A `static` field declared by T is assigned.
- A `static` field declared by T is used and the field is not a constant variable ([§4.12.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.4)).

### 12.4.1. 初始化发生的时机

类或接口类型 `T` 将在以下任何一项第一次出现之前, 立即初始化：

- 如果 `T` 是一个类，创建一个 `T` 的实例。
- 调用由 `T` 声明的 `static` 方法。
- 赋值给 `T` 声明的 `static` 字段。
- 从 `T` 声明的 `static` 字段取值，并且该字段不是常量变量（constant variable， [§4.12.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.4) ）。


When a class is initialized, its superclasses are initialized (if they have not been previously initialized), as well as any superinterfaces ([§8.1.5](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.1.5)) that declare any default methods ([§9.4.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-9.html#jls-9.4.3)) (if they have not been previously initialized). Initialization of an interface does not, of itself, cause initialization of any of its superinterfaces.

A reference to a `static` field ([§8.3.1.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.3.1.1)) causes initialization of only the class or interface that actually declares it, even though it might be referred to through the name of a subclass, a subinterface, or a class that implements an interface.

Invocation of certain reflective methods in class `Class` and in package `java.lang.reflect` also causes class or interface initialization.

A class or interface will not be initialized under any other circumstance.

一个类被初始化时，它的超类也会被初始化（如果之前已经执行过初始化则不会重复执行）；如果有声明了默认方法的超接口也会被初始化（如果之前没有被初始化）。 接口的初始化本身不会导致其任何超接口的初始化。

对`static`字段的引用（[§8.3.1.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.3.1.1)）, 会导致仅初始化实际声明它的类或接口，即使代码中可能通过子类、子接口或实现接口的类名称来引用。

在类 `Class` 和包 `java.lang.reflect` 中调用某些反射方法也会导致类或接口初始化。

在任何其他情况下, 都不会初始化类或接口。

Note that a compiler may generate *synthetic* default methods in an interface, that is, default methods that are neither explicitly nor implicitly declared ([§13.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.1)). Such methods will trigger the interface's initialization despite the source code giving no indication that the interface should be initialized.

The intent is that a class or interface type has a set of initializers that put it in a consistent state, and that this state is the first state that is observed by other classes. The static initializers and class variable initializers are executed in textual order, and may not refer to class variables declared in the class whose declarations appear textually after the use, even though these class variables are in scope ([§8.3.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.3.3)). This restriction is designed to detect, at compile time, most circular or otherwise malformed initializations.

The fact that initialization code is unrestricted allows examples to be constructed where the value of a class variable can be observed when it still has its initial default value, before its initializing expression is evaluated, but such examples are rare in practice. (Such examples can be also constructed for instance variable initialization ([§12.5](#jls-12.5)).) The full power of the Java programming language is available in these initializers; programmers must exercise some care. This power places an extra burden on code generators, but this burden would arise in any case because the Java programming language is concurrent ([§12.4.2](#jls-12.4.2)).

请注意，编译器可能会在接口中生成一些合成的默认方法，即既是不显式也是不隐式声明的默认方法。 尽管源代码中没有表明应该初始化接口，但这些方法将触发接口的连带自动初始化。

目的是因为类或接口类型有一组初始化器，将其置于一致状态，并且此状态是其他类观察到的第一个状态。 静态初始化器和类变量初始化器以源代码中的文本顺序执行，并且不允许引用该类中在其后声明的类变量。 此限制旨在编译时检测大多数循环或其他格式的错误初始化。

初始化代码不受限制的事实允许构建示例，在其初始化表达式执行完成之前，类变量的值仍然具有初始默认值时可以观察到， 但这样的示例在实践中很少见。 （也可以为实例变量初始化构建此类示例 ([§12.5](#jls-12.5))。） Java 编程语言的全部功能在这些初始化程序中可用； 程序员必须小心谨慎。这种能力给代码生成器带来了额外的负担，但无论如何都会出现这种负担，因为 Java 编程语言是并发的 ([§12.4.2](#jls-12.4.2))。


> **Example 12.4.1-1. Superclasses Are Initialized Before Subclasses**

> **Example 12.4.1-1. 超类在子类之前初始化**

```java
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

程序的执行结果如下:

```java
Super Two false
```

The class `One` is never initialized, because it not used actively and therefore is never linked to. The class `Two` is initialized only after its superclass `Super` has been initialized.

在这个示例中, `One` 类永远不会被初始化，因为它没有被主动使用，因此永远不会被链接到。
类 `Two` 必须在其超类 `Super` 初始化完成之后才会被初始化。



> **Example 12.4.1-2. Only The Class That Declares `static` Field Is Initialized**

> **Example 12.4.1-2. 在使用static字段时, 只有直接声明 `static` 字段的类, 才会被初始化 **


```java
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

程序的执行结果如下:

```java
1729
```

because the class `Sub` is never initialized; the reference to `Sub.taxi` is a reference to a field actually declared in class `Super` and does not trigger initialization of the class `Sub`.


因为类 `Sub` 从未被初始化； `Sub.taxi` 引用的实际上是在 `Super` 类中声明的字段， 所以不会触发 `Sub` 类的初始化。


> **Example 12.4.1-3. Interface Initialization Does Not Initialize Superinterfaces**

> **Example 12.4.1-3. 接口的初始化不会触发超接口的初始化 **

```java
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

程序的执行结果如下:

```java
1
j=3
jj=4
3
```

The reference to `J.i` is to a field that is a constant variable ([§4.12.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.4)); therefore, it does not cause `I` to be initialized ([§13.4.9](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.9)).

The reference to `K.j` is a reference to a field actually declared in interface `J` that is not a constant variable; this causes initialization of the fields of interface `J`, but not those of its superinterface `I`, nor those of interface `K`.

Despite the fact that the name `K` is used to refer to field `j` of interface `J`, interface `K` is not initialized.


对 `J.i` 的引用是一个常量变量字段（[§4.12.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.4)); 因此，它不会导致`I`被初始化（[§13.4.9](https://docs.oracle.com/javase/specs/jls/se11/html/jls-13.html#jls-13.4.9))。

对 `K.j` 的引用是实际在接口 `J` 中声明的字段，该字段不是常量变量； 这会导致接口 `J` 的字段初始化，但不会初始化其超接口 `I` 的字段，也不会初始化接口  `K` 的字段。

尽管代码中使用了  `K` 类来引用接口 `J` 的字段`j`，但接口 `K` 并未初始化。


<a name="jls-12.4.2"></a>

### 12.4.2. Detailed Initialization Procedure

Because the Java programming language is multithreaded, initialization of a class or interface requires careful synchronization, since some other thread may be trying to initialize the same class or interface at the same time. There is also the possibility that initialization of a class or interface may be requested recursively as part of the initialization of that class or interface; for example, a variable initializer in class A might invoke a method of an unrelated class B, which might in turn invoke a method of class A. The implementation of the Java Virtual Machine is responsible for taking care of synchronization and recursive initialization by using the following procedure.

### 12.4.2. 详细的初始化过程

Java 编程语言是多线程的，所以类或接口的初始化需要仔细同步，因为其他线程可能会并发地尝试初始化同一个类或接口。 还有一种可能性是，作为类或接口初始化时的某些调用，可以会递归地请求类或接口的初始化； 例如，类 A 中的变量初始化器, 可能会调用不相关的类 B 的方法，而后者初始化时又可能调用类 A 的方法。 Java 虚拟机实现通过使用以下处理过程来负责同步和递归初始化。

The procedure assumes that the `Class` object has already been verified and prepared, and that the `Class` object contains state that indicates one of four situations:

- This `Class` object is verified and prepared but not initialized.
- This `Class` object is being initialized by some particular thread `T`.
- This `Class` object is fully initialized and ready for use.
- This `Class` object is in an erroneous state, perhaps because initialization was attempted and failed.

该过程假定 `Class` 对象已经过验证和准备，并且 `Class` 对象包含指示以下四种情况之一的状态：

- 这个 `Class` 对象已经过验证和准备，但还没有初始化。
- 这个 `Class` 对象正在被某个特定线程 `T` 初始化。
- 这个 `Class` 对象已完全初始化并可以使用。
- 这个 `Class` 对象处于错误状态，可能是因为尝试初始化但失败了。

For each class or interface C, there is a unique initialization lock `LC`. The mapping from C to `LC` is left to the discretion of the Java Virtual Machine implementation. The procedure for initializing C is then as follows:

对于每个类或接口 `C`，都有一个唯一的初始化锁 `LC`。 从 `C` 到 `LC` 的映射由 Java 虚拟机实现自行维护。 初始化 C 的过程如下：


1. Synchronize on the initialization lock, `LC`, for C. This involves waiting until the current thread can acquire `LC`.

2. If the `Class` object for C indicates that initialization is in progress for C by some other thread, then release `LC` and block the current thread until informed that the in-progress initialization has completed, at which time repeat this step.

3. If the `Class` object for C indicates that initialization is in progress for C by the current thread, then this must be a recursive request for initialization. Release `LC` and complete normally.

4. If the `Class` object for C indicates that C has already been initialized, then no further action is required. Release `LC` and complete normally.

5. If the `Class` object for C is in an erroneous state, then initialization is not possible. Release `LC` and throw a `NoClassDefFoundError`.

1. 同步 `C` 的初始化锁 `LC` 。 这包括等待当前线程可以获取`LC`。

2. 如果 `C` 的 `Class` 对象表明其他线程正在对 `C` 进行初始化，则释放 `LC` 并阻塞当前线程，直到收到通知之前正在进行的初始化已完成，此时重复此步骤 .

3. 如果 `C` 的 `Class` 对象表明当前线程正在对 `C`进行初始化，那么这一定是一个递归的初始化请求。 释放 `LC` 并正常完成。

4. 如果 `C` 的 `Class` 对象表明 `C` 已经被初始化，则不需要进一步的操作。 释放`LC`并正常完成。

5. 如果 `C` 的 `Class` 对象处于错误状态，则无法进行初始化。 释放 `LC` 并抛出 `NoClassDefFoundError`。

6. Otherwise, record the fact that initialization of the `Class` object for C is in progress by the current thread, and release `LC`.

   Then, initialize the `static` fields of C which are constant variables ([§4.12.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.4), [§8.3.2](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.3.2), [§9.3.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-9.html#jls-9.3.1)).

6. 否则，走到这一步，则记下当前线程正在对`C`的`Class`对象进行初始化，并释放`LC`。

    然后，初始化 `C` 中属于 常量变量 的`static`字段（[§4.12.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.4), [§8.3.2](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.3.2), [§9.3.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-9.html#jls-9.3.1)）。

7. Next, if C is a class rather than an interface, then let SC be its superclass and let SI1, ..., SIn be all superinterfaces of C that declare at least one default method. The order of superinterfaces is given by a recursive enumeration over the superinterface hierarchy of each interface directly implemented by C (in the left-to-right order of C's `implements` clause). For each interface I directly implemented by C, the enumeration recurs on I's superinterfaces (in the left-to-right order of I's `extends` clause) before returning I.

   For each S in the list [ SC, SI1, ..., SIn ], if S has not yet been initialized, then recursively perform this entire procedure for S. If necessary, verify and prepare S first.

   If the initialization of S completes abruptly because of a thrown exception, then acquire `LC`, label the `Class` object for C as erroneous, notify all waiting threads, release `LC`, and complete abruptly, throwing the same exception that resulted from initializing S.

7. 接下来，如果 `C` 是类而不是接口，则令 `SC` 为其超类，并令 `SI1`，`...`，`SIn` 为声明至少一个默认方法(default method)的 `C` 的所有超接口。 超级接口的顺序由 `C` 直接实现的每个接口的超级接口层次结构上的递归枚举给出（深度优先，并按照 `C` 的 `implements` 子句从左到右的顺序）。 对于由 `C` 直接实现的每个接口 `I` ，在返回 `I` 之前，会在 `I` 的超接口上重复枚举（按 `I` 的 `extends` 子句从左到右的顺序）。

    对于 [ SC, SI1, ..., SIn ] 列表中的每个 `S` ，如果 `S` 还没有被初始化，那么递归地对S执行整个过程。 如果需要，还要先验证和准备 `S` 。

    如果对 `S` 的初始化由于抛出异常而突然结束，则获取`LC`锁，将 `C` 的`Class` 对象标记为错误，通知所有等待线程，释放`LC`，然后突然完成，抛出初始化S时抛出的同一个异常。

8. Next, determine whether assertions are enabled ([§14.10](https://docs.oracle.com/javase/specs/jls/se11/html/jls-14.html#jls-14.10)) for C by querying its defining class loader.

9. Next, execute either the class variable initializers and static initializers of the class, or the field initializers of the interface, in textual order, as though they were a single block.

10. If the execution of the initializers completes normally, then acquire `LC`, label the `Class` object for C as fully initialized, notify all waiting threads, release `LC`, and complete this procedure normally.

11. Otherwise, the initializers must have completed abruptly by throwing some exception E. If the class of E is not `Error` or one of its subclasses, then create a new instance of the class `ExceptionInInitializerError`, with E as the argument, and use this object in place of E in the following step. If a new instance of `ExceptionInInitializerError` cannot be created because an `OutOfMemoryError` occurs, then instead use an `OutOfMemoryError` object in place of E in the following step.

12. Acquire `LC`, label the `Class` object for C as erroneous, notify all waiting threads, release `LC`, and complete this procedure abruptly with reason E or its replacement as determined in the previous step.

8. 接下来，通过查询定义 `C` 的类加载器, 确定是否启用了断言（[§14.10](https://docs.oracle.com/javase/specs/jls/se11/html/jls-14.html#jls-14.10)）。

9. 接下来，按照源代码中的文本顺序，依次执行类变量初始化程序和静态初始化块，或者接口的字段初始化程序，就好像它们在一个单独的块中一样。

10. 如果初始化程序的执行正常完成，则获取`LC`，将`C`的`Class`对象标记为完全初始化，通知所有等待线程，释放`LC`，正常完成此过程。

11. 其他情况，则初始化程序必须通过抛出异常 `E` 突然完成。 如果 `E` 的类不是 `Error` 或其子类， 则创建 `ExceptionInInitializerError` 类的新实例，以 `E` 作为参数，并在接下来的步骤中使用此对象代替 `E`。 如果由于发生 `OutOfMemoryError` 而无法创建 `ExceptionInInitializerError` 的新实例， 则在接下来的步骤中使用 `OutOfMemoryError` 对象代替 `E`。

12. 获取`LC`， 将`C`的`Class`对象标记为错误，通知所有等待的线程，然后释放`LC`，并根据上一步确定的原因 E 或替换原因突然完成此过程。

An implementation may optimize this procedure by eliding the lock acquisition in step 1 (and release in step 4/5) when it can determine that the initialization of the class has already completed, provided that, in terms of the memory model, all happens-before orderings that would exist if the lock were acquired, still exist when the optimization is performed.

Code generators need to preserve the points of possible initialization of a class or interface, inserting an invocation of the initialization procedure just described. If this initialization procedure completes normally and the `Class` object is fully initialized and ready for use, then the invocation of the initialization procedure is no longer necessary and it may be eliminated from the code - for example, by patching it out or otherwise regenerating the code.

Compile-time analysis may, in some cases, be able to eliminate many of the checks that a type has been initialized from the generated code, if an initialization order for a group of related types can be determined. Such analysis must, however, fully account for concurrency and for the fact that initialization code is unrestricted.

JVM实现如果确定类的初始化已经完成时，可以优化这个过程, 比如省略步骤 1 中的锁获取（并在步骤 4/5 中释放），但去掉锁的一个前提是，从内存模型而言，需要保证，获取锁过程的时候对应的所有 happens-before 操作，在进行锁优化操作替换时，对应的状态仍然一致。

代码生成器需要保留类或接口可能的初始化点，插入刚刚描述的初始化过程的调用。 如果此初始化过程正常完成并且`Class`对象已完全初始化并已准备好， 则不再需要调用初始化过程，并且可以从代码中消除它 - 例如，通过修补它或以其他方式重新生成编码。

在某些情况下，编译时分析器如果确定一组相关类型都已经完成初始化，则可以从生成的代码中修剪掉很多对某个类型进行初始化的检查。 然而，这种分析必须充分考虑并发性和初始化代码不受限制的事实。


<a name="jls-12.5"></a>

## 12.5. Creation of New Class Instances

A new class instance is explicitly created when evaluation of a class instance creation expression ([§15.9](https://docs.oracle.com/javase/specs/jls/se11/html/jls-15.html#jls-15.9)) causes a class to be instantiated.

A new class instance may be implicitly created in the following situations:

## 12.5. 创建类的新实例对象

在执行类实例创建表达式时, 会显式创建对应类的一个新实例（[§15.9](https://docs.oracle.com/javase/specs/jls/se11/html/jls-15.html#jls-15.9)) ，会导致类被实例化。

在以下情况下，可能会隐式创建新的类实例：

- Loading of a class or interface that contains a string literal ([§3.10.5](https://docs.oracle.com/javase/specs/jls/se11/html/jls-3.html#jls-3.10.5)) may create a new `String` object to represent the literal. (This will not occur if a string denoting the same sequence of Unicode code points has previously been interned.)
- Execution of an operation that causes boxing conversion ([§5.1.7](https://docs.oracle.com/javase/specs/jls/se11/html/jls-5.html#jls-5.1.7)). Boxing conversion may create a new object of a wrapper class (`Boolean`, `Byte`, `Short`, `Character`, `Integer`, `Long`, `Float`, `Double`) associated with one of the primitive types.
- Execution of a string concatenation operator `+` ([§15.18.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-15.html#jls-15.18.1)) that is not part of a constant expression ([§15.28](https://docs.oracle.com/javase/specs/jls/se11/html/jls-15.html#jls-15.28)) always creates a new `String` object to represent the result. String concatenation operators may also create temporary wrapper objects for a value of a primitive type.
- Evaluation of a method reference expression ([§15.13.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-15.html#jls-15.13.3)) or a lambda expression ([§15.27.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-15.html#jls-15.27.4)) may require that a new instance of a class that implements a functional interface type be created.


- 加载包含字符串值的类或接口时, 可以创建一个新的 `String` 对象来表示这些字符。 （如果表示相同 Unicode 编码序列的字符串先前已被内联，则不会发生这种情况。）
- 执行导致装箱转换的操作（[§5.1.7](https://docs.oracle.com/javase/specs/jls/se11/html/jls-5.html#jls-5.1.7)）. 装箱转换可能会创建与原生类型相关联的包装类（`Boolean`、`Byte`、`Short`、`Character`、`Integer`、`Long`、`Float`、`Double`）的新对象。
- 字符串连接运算符 `+` 不是常量表达式的一部分, 总是创建一个新的`String` 对象来表示结果。 字符串连接运算符还可以为原始类型的值创建临时包装对象。【这里可能会发生javac编译器优化, 消除纯字面量的 `+` 操作】
- 执行方法引用表达式 ([§15.13.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-15.html#jls-15.13.3)) 或lambda 表达式 ([§15.27.4](https://docs.oracle.com/javase/specs/jls/se11/html/jls-15.html#jls-15.27.4)) 可能需要创建一个实现函数接口类型的类的实例。


Each of these situations identifies a particular constructor ([§8.8](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.8)) to be called with specified arguments (possibly none) as part of the class instance creation process.

Whenever a new class instance is created, memory space is allocated for it with room for all the instance variables declared in the class type and all the instance variables declared in each superclass of the class type, including all the instance variables that may be hidden ([§8.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.3)).

If there is not sufficient space available to allocate memory for the object, then creation of the class instance completes abruptly with an `OutOfMemoryError`. Otherwise, all the instance variables in the new object, including those declared in superclasses, are initialized to their default values ([§4.12.5](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.5)).

Just before a reference to the newly created object is returned as the result, the indicated constructor is processed to initialize the new object using the following procedure:

每一种场景都唯一标识了调用某个特定的构造函数（[§8.8](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.8)）, 通过特定参数来进行构造（也可能是无参构造）。

每当创建类的一个新实例时，都会为其分配内存空间，并为该类中声明的所有实例变量, 以及每个超类中声明的所有实例变量（包括所有可能被隐藏的实例变量）分配空间（[§8.3](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.3))。

如果没有足够的可用内存空间分配给新对象，则实例的创建会突然完成，并出现 `OutOfMemoryError`。 否则，新对象中的所有实例变量，包括在超类中声明的变量，都将初始化为其默认值（[§4.12.5](https://docs.oracle.com/javase/specs/jls/se11/html/jls-4.html#jls-4.12.5))。

就在将新创建对象的引用作为结果返回之前，使用以下过程, 处理指定的构造函数以初始化新对象：

1. Assign the arguments for the constructor to newly created parameter variables for this constructor invocation.
2. If this constructor begins with an explicit constructor invocation ([§8.8.7.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.8.7.1)) of another constructor in the same class (using `this`), then evaluate the arguments and process that constructor invocation recursively using these same five steps. If that constructor invocation completes abruptly, then this procedure completes abruptly for the same reason; otherwise, continue with step 5.
3. This constructor does not begin with an explicit constructor invocation of another constructor in the same class (using `this`). If this constructor is for a class other than `Object`, then this constructor will begin with an explicit or implicit invocation of a superclass constructor (using `super`). Evaluate the arguments and process that superclass constructor invocation recursively using these same five steps. If that constructor invocation completes abruptly, then this procedure completes abruptly for the same reason. Otherwise, continue with step 4.
4. Execute the instance initializers and instance variable initializers for this class, assigning the values of instance variable initializers to the corresponding instance variables, in the left-to-right order in which they appear textually in the source code for the class. If execution of any of these initializers results in an exception, then no further initializers are processed and this procedure completes abruptly with that same exception. Otherwise, continue with step 5.
5. Execute the rest of the body of this constructor. If that execution completes abruptly, then this procedure completes abruptly for the same reason. Otherwise, this procedure completes normally.

Unlike C++, the Java programming language does not specify altered rules for method dispatch during the creation of a new class instance. If methods are invoked that are overridden in subclasses in the object being initialized, then these overriding methods are used, even before the new object is completely initialized.

1. 将要创建的参数值赋值给新创建对象的构造函数参数。
2. 如果此构造函数（通过使用 `this`）显式调用（[§8.8.7.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.8.7.1)) 同一个类中的另一个构造函数，然后评估参数并使用这相同的五个步骤递归地处理该构造函数调用。 如果该构造函数调用突然抛出异常，则此过程出于相同原因而突然完成；否则，继续执行步骤 5。
3. 这个构造函数不是以显式调用同一个类中的另一个构造函数开始的（使用`this`）。 如果此构造函数不是 `Object` 类，则此构造函数将从显式或隐式调用超类构造函数开始（使用 `super`）。使用这五个相同的步骤递归地计算超类构造函数调用的参数和过程。如果该构造函数调用突然抛出异常，则此过程出于相同的原因突然完成。否则，继续执行步骤 4。
4. 执行该类的实例初始化块和实例变量初始化代码，将实例变量初始化器的值分配给相应的实例变量，按照它们在源文件中的出现顺序从左到右。如果执行这些初始化程序中的任何一个导致异常，则不会处理更多初始化程序，并且此过程会以相同的异常突然完成。否则，继续执行步骤 5。
5. 执行此构造函数的其余部分。 如果该执行突然完成，则此过程出于同样的原因突然完成。否则，此过程正常完成。

与 C++ 不同，Java 编程语言在新实例创建期间没有为方法分派指定更改的规则。 如果对象在被初始化时调用的方法在子类中被覆写，那么即使在新对象还没有完成初始化之前，也会使用这些被子类覆写的方法。


> **Example 12.5-1. Evaluation of Instance Creation**

> **Example 12.5-1. 执行实例创建**

```java
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

这个示例中创建了一个新的 `ColoredPoint` 实例。 首先，为新的 `ColoredPoint` 对象分配内存空间，以保存字段 `x`、`y` 和 `color`。 然后将所有这些字段初始化为其默认值（在这种情况下，三个字段都为`0`值）。 接下来，首先调用不带参数的 `ColoredPoint` 构造函数。 由于 `ColoredPoint` 没有声明构造函数，因此隐式声明了以下形式的默认构造函数：

```java
ColoredPoint() { super(); }
```

This constructor then invokes the `Point` constructor with no arguments. The `Point` constructor does not begin with an invocation of a constructor, so the Java compiler provides an implicit invocation of its superclass constructor of no arguments, as though it had been written:

然后，ColoredPoint 构造函数中会自动调用不带参数的`Point`构造函数。 `Point` 构造函数中的第一行代码不是以调用构造函数开始的，因此 Java 编译器自动为其生成了对超类无参数构造函数的隐式调用，就等价于它是这样写的：

```java
Point() { super(); x = 1; y = 1; }
```

Therefore, the constructor for `Object` which takes no arguments is invoked.

The class `Object` has no superclass, so the recursion terminates here. Next, any instance initializers and instance variable initializers of `Object` are invoked. Next, the body of the constructor of `Object` that takes no arguments is executed. No such constructor is declared in `Object`, so the Java compiler supplies a default one, which in this special case is:

因此，调用了 `Object` 的无参构造函数。

`Object` 类没有超类，因此递归在此终止。 接下来，调用“ `Object` 的所有实例初始化块和实例变量初始化器。 接下来，执行不带参数的 `Object` 的构造函数主体。 `Object` 中没有声明这样的构造函数，因此 Java 编译器提供了一个默认构造函数，在这种特殊情况下是：

```java
Object() { }
```

This constructor executes without effect and returns.

Next, all initializers for the instance variables of class `Point` are executed. As it happens, the declarations of `x` and `y` do not provide any initialization expressions, so no action is required for this step of the example. Then the body of the `Point` constructor is executed, setting `x` to `1` and `y` to `1`.

Next, the initializers for the instance variables of class `ColoredPoint` are executed. This step assigns the value `0xFF00FF` to `color`. Finally, the rest of the body of the `ColoredPoint` constructor is executed (the part after the invocation of `super`); there happen to be no statements in the rest of the body, so no further action is required and initialization is complete.

此构造函数执行没有任何效果, 也没有返回值。

接下来，执行 `Point` 类的实例变量的所有初始化程序。 碰巧的是，`x` 和 `y` 的声明不提供任何初始化表达式，所以在此示例中, 这一步不需要任何操作。 然后执行 `Point` 构造函数的方法体，将 `x` 设置为 `1`，将 `y` 也设置为 `1`。

接下来，执行 `ColoredPoint` 类的实例变量的初始化程序。 此步骤将 `0xFF00FF` 赋值给 `color`。 最后，执行 `ColoredPoint` 构造函数的其余部分（ `super` 调用之后的部分，如果有的话）； 方法体的其余部分恰好没有语句，因此不需要进一步的操作，初始化执行完成。



> **Example 12.5-2. Dynamic Dispatch During Instance Creation**

> **Example 12.5-2. 在实例创建时的动态分发/多态 **

```java
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

程序的执行结果如下:

```java
0
3
```

This shows that the invocation of `printThree` in the constructor for class `Super` does not invoke the definition of `printThree` in class `Super`, but rather invokes the overriding definition of `printThree` in class `Test`. This method therefore runs before the field initializers of `Test` have been executed, which is why the first value output is `0`, the default value to which the field `three` of `Test` is initialized. The later invocation of `printThree` in method `main` invokes the same definition of `printThree`, but by that point the initializer for instance variable `three` has been executed, and so the value `3` is printed.

这表明在  `Super` 类的构造函数中调用 `printThree` 方法时, 并没有调用`Super`类中自己定义的那个 `printThree`方法，而是调用了 `Test` 类中覆写的 `printThree` 方法。 因此，此方法在 `Test` 类的字段初始化代码执行之前运行，这就是为什么输出的第一个值是 `0`，这是 `Test` 类实例变量 `three` 的默认值。 稍后在方法 `main` 中调用 `printThree` 时, 会调用同样的 `printThree` 方法定义，但此时实例变量 `three` 的初始化程序已经执行完成，因此打印输出的值是 `3`。


<a name="jls-12.6"></a>

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

```java
protected void finalize() throws Throwable {
    super.finalize();
}
```

We encourage implementations to treat such objects as having a finalizer that is not overridden, and to finalize them more efficiently, as described in [§12.6.1](#jls-12.6.1).

A finalizer may be invoked explicitly, just like any other method.

The package `java.lang.ref` describes weak references, which interact with garbage collection and finalization. As with any API that has special interactions with the Java programming language, implementors must be cognizant of any requirements imposed by the `java.lang.ref` API. This specification does not discuss weak references in any way. Readers are referred to the API documentation for details.

<a name="jls-12.6.1"></a>

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

```java
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

<a name="jls-12.6.2"></a>

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

<a name="jls-12.7"></a>

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

<a name="jls-12.8"></a>

## 12.8. Program Exit

A program terminates all its activity and *exits* when one of two things happens:

- All the threads that are not daemon threads terminate.
- Some thread invokes the `exit` method of class `Runtime` or class `System`, and the `exit` operation is not forbidden by the security manager.

## 12.8. 程序退出

当发生以下两种情况之一时，程序将终止其所有活动并 *退出*：

- 所有的前台线程(非守护线程, not daemon threads)都已经停止了。
- 某些线程调用了`Runtime`类或者 `System`类的`exit`方法, 而且 `exit` 操作没有被安全管理器(security manager)禁止。


<a name="jls-12.end"></a>

## 相关链接

- [Java Language Specification: Chapter 12. Execution](https://docs.oracle.com/javase/specs/jls/se11/html/jls-12.html)
