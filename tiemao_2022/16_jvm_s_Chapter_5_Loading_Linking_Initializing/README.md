# Java Virtual Machine Specification

## Chapter 5. Loading, Linking, and Initializing

# Java虚拟机规范文档

## 第5章. 加载、链接和初始化


The Java Virtual Machine dynamically loads, links and initializes classes and interfaces. Loading is the process of finding the binary representation of a class or interface type with a particular name and *creating* a class or interface from that binary representation. Linking is the process of taking a class or interface and combining it into the run-time state of the Java Virtual Machine so that it can be executed. Initialization of a class or interface consists of executing the class or interface initialization method `<clinit>` ([§2.9.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.9.2)).

Java虚拟机(Java Virtual Machine)动态地加载(load)、链接(link)和初始化(initialize)类与接口。
加载, 是根据特定名称, 查找对应类或接口的二进制表示形式, 并根据该二进制表示 *创建* 类或接口的过程。
链接, 是获取类或接口, 并将其组合到 Java 虚拟机的运行时状态, 以便可以执行的过程。
类或接口的初始化, 则是指执行类或接口初始化方法 `<clinit>` ([§2.9.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.9.2))。

In this chapter, [§5.1](#jvms-5.1) describes how the Java Virtual Machine derives symbolic references from the binary representation of a class or interface. [§5.2](#jvms-5.2) explains how the processes of loading, linking, and initialization are first initiated by the Java Virtual Machine. [§5.3](#jvms-5.3) specifies how binary representations of classes and interfaces are loaded by class loaders and how classes and interfaces are created. Linking is described in [§5.4](#jvms-5.4). [§5.5](#jvms-5.5) details how classes and interfaces are initialized. [§5.6](#jvms-5.6) introduces the notion of binding native methods. Finally, [§5.7](#jvms-5.7) describes when a Java Virtual Machine exits.

在本章中:
[§5.1](#jvms-5.1) 描述了 Java 虚拟机如何根据类或接口的二进制格式数据, 得到符号引用.
[§5.2](#jvms-5.2) 解释了加载、链接和初始化过程是如何由 Java 虚拟机启动的.
[§5.3](#jvms-5.3) 指定了类和接口的二进制数据, 是如何由类加载器加载的, 以及如何创建类和接口.
[§5.4](#jvms-5.4) 中描述了链接.
[§5.5](#jvms-5.5) 详细说明了如何初始化类和接口.
[§5.6](#jvms-5.6) 引入了绑定本地方法(Native Method)的概念。
最后, [§5.7](#jvms-5.7) 描述了 Java 虚拟机何时退出。


<a name="jvms-5.1"></a>
## 5.1. The Run-Time Constant Pool

## 5.1. 运行时常量池(Run-Time Constant Pool)

The Java Virtual Machine maintains a run-time constant pool for each class and interface ([§2.5.5](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.5.5)). This data structure serves many of the purposes of the symbol table of a conventional programming language implementation. The `constant_pool` table in the binary representation of a class or interface ([§4.4](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4)) is used to construct the run-time constant pool upon class or interface creation ([§5.3](#jvms-5.3)).

Java 虚拟机为每个类和接口维护一个运行时常量池([§2.5.5](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.5.5)). 这种数据结构有多种作用, 服务于传统编程语言实现的符号表. 类或接口的二进制格式 classfile 中的 `constant_pool` 表([§4.4](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4)), 用于在创建类或接口时构造运行时常量池 ([§5.3](#jvms-5.3))。


There are two kinds of entry in the run-time constant pool: symbolic references, which may later be resolved ([§5.4.3](#jvms-5.4.3)), and static constants, which require no further processing.

运行时常量池中有两种条目(entry):

- 符号引用(symbolic reference), 后续可能会被解析（[§5.4.3](#jvms-5.4.3)）；
- 静态常量(static constant), 不需要进一步处理。

The symbolic references in the run-time constant pool are derived from entries in the `constant_pool` table in accordance with the structure of each entry:

运行时常量池中的符号引用, 是从classfile的 `constant_pool` 表中, 根据每个条目的结构导出的:

- A symbolic reference to a class or interface is derived from a `CONSTANT_Class_info` structure ([§4.4.1](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.1)). Such a reference gives the name of the class or interface in the following form:

  - For a nonarray class or an interface, the name is the binary name ([§4.2.1](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.2.1)) of the class or interface.
  - For an array class of *n* dimensions, the name begins with *n* occurrences of the ASCII `[` character followed by a representation of the element type:
    - If the element type is a primitive type, it is represented by the corresponding field descriptor ([§4.3.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.3.2)).
    - Otherwise, if the element type is a reference type, it is represented by the ASCII `L` character followed by the binary name of the element type followed by the ASCII `;` character.

  Whenever this chapter refers to the name of a class or interface, the name should be understood to be in the form above. (This is also the form returned by the `Class.getName` method.)

- 类或接口的符号引用, 源自 `CONSTANT_Class_info` 结构([§4.4.1](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.1))。 这样的引用给出了类或接口的名称, 格式为:

  - 对于非数组类(nonarray class)或接口, name 是类或接口的二进制名称（[§4.2.1](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.2.1)) 。
  - 对于 *n* 维数组类, name 以 *n* 个 ASCII 字符 `[` 开头, 后跟元素类型的表示:
    - 如果元素类型是原生类型(primitive type), 则元素类型由相应的字段描述符表示（([§4.3.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.3.2))。
    - 其他情况, 如果元素是引用类型, 元素类型部分由 ASCII 字符 `L` 开头, 后跟元素类型的二进制名称, 后跟 ASCII 分号字符 `;` 表示。

  在本章中提到类或接口的名称时, 该名称应理解为上述形式. （这也是 `Class.getName` 方法返回的形式。）


- A symbolic reference to a field of a class or an interface is derived from a `CONSTANT_Fieldref_info` structure ([§4.4.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.2)). Such a reference gives the name and descriptor of the field, as well as a symbolic reference to the class or interface in which the field is to be found.

- 类或接口字段的符号引用, 源自 `CONSTANT_Fieldref_info` 结构（[§4.4.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.2))。 这样的引用给出了字段的名称(name)和描述符(descriptor), 以及对要在其中找到这个字段的类或接口的符号引用。

- A symbolic reference to a method of a class is derived from a `CONSTANT_Methodref_info` structure ([§4.4.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.2)). Such a reference gives the name and descriptor of the method, as well as a symbolic reference to the class in which the method is to be found.

- 类方法的符号引用, 源自 `CONSTANT_Methodref_info` 结构（[§4.4.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.2))。这样的引用给出了方法的名称和描述符, 以及对要在其中找到方法的类的符号引用。

- A symbolic reference to a method of an interface is derived from a `CONSTANT_InterfaceMethodref_info` structure ([§4.4.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.2)). Such a reference gives the name and descriptor of the interface method, as well as a symbolic reference to the interface in which the method is to be found.

- 接口方法的符号引用, 源自 `CONSTANT_InterfaceMethodref_info` 结构（[§4.4.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.2))。 这样的引用给出了接口方法的名称和描述符, 以及对要在其中找到该方法的接口的符号引用。

- A symbolic reference to a method handle is derived from a `CONSTANT_MethodHandle_info` structure ([§4.4.8](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.8)). Such a reference gives a symbolic reference to a field of a class or interface, or a method of a class, or a method of an interface, depending on the kind of the method handle.

- 方法句柄的符号引用, 源自 `CONSTANT_MethodHandle_info` 结构（[§4.4.8](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.8))。 根据方法句柄的类型, 这种引用给出了对类字段或接口字段、类方法或接口方法的符号引用。

- A symbolic reference to a method type is derived from a `CONSTANT_MethodType_info` structure ([§4.4.9](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.9)). Such a reference gives a method descriptor ([§4.3.3](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.3.3)).

- 方法类型的符号引用, 源自`CONSTANT_MethodType_info`结构（[§4.4.9](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.9))。这样的引用给出了一个方法描述符（[§4.3.3]（https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.3.3））。


- A symbolic reference to a *dynamically-computed constant* is derived from a `CONSTANT_Dynamic_info` structure ([§4.4.10](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.10)). Such a reference gives:

  - a symbolic reference to a method handle, which will be invoked to compute the constant's value;
  - a sequence of symbolic references and static constants, which will serve as *static arguments* when the method handle is invoked;
  - an unqualified name and a field descriptor.

- 对 *动态计算常量(dynamically-computed constant)* 的符号引用, 源自 `CONSTANT_Dynamic_info` 结构（[§4.4.10](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.10))。 这样的引用给出:

  - 对方法句柄的符号引用, 将调用该方法句柄来计算常量的值；
  - 一系列的符号引用和静态常量, 在调用方法句柄时将用作 *静态参数*；
  - 非限定名称和字段描述符。

- A symbolic reference to a *dynamically-computed call site* is derived from a `CONSTANT_InvokeDynamic_info` structure ([§4.4.10](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.10)). Such a reference gives:

  - a symbolic reference to a method handle, which will be invoked in the course of an *invokedynamic* instruction ([§*invokedynamic*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.invokedynamic)) to compute an instance of `java.lang.invoke.CallSite`;
  - a sequence of symbolic references and static constants, which will serve as *static arguments* when the method handle is invoked;
  - an unqualified name and a method descriptor.

- 对 *动态计算调用点(dynamically-computed call site)* 的符号引用, 源自 `CONSTANT_InvokeDynamic_info` 结构（[§4.4.10](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.10))。这样的引用给出:

  - 对方法句柄的符号引用, 它将在 [invokedynamic](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.invokedynamic) 指令的过程中被调用, 来计算一个 `java.lang.invoke.CallSite` 的实例；
  - 一系列的符号引用和静态常量, 在调用方法句柄时将用作 *静态参数*；
  - 非限定名称和方法描述符。

The static constants in the run-time constant pool are also derived from entries in the `constant_pool` table in accordance with the structure of each entry:

运行时常量池中的静态常量, 也是从 `constant_pool` 表中根据每个条目的结构导出的:

- A string constant is a `reference` to an instance of class `String`, and is derived from a `CONSTANT_String_info` structure ([§4.4.3](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.3)). To derive a string constant, the Java Virtual Machine examines the sequence of code points given by the `CONSTANT_String_info` structure:

  - If the method `String.intern` has previously been invoked on an instance of class `String` containing a sequence of Unicode code points identical to that given by the `CONSTANT_String_info` structure, then the string constant is a `reference` to that same instance of class `String`.
  - Otherwise, a new instance of class `String` is created containing the sequence of Unicode code points given by the `CONSTANT_String_info` structure. The string constant is a `reference` to the new instance. Finally, the method `String.intern` is invoked on the new instance.


- 字符串常量, 是一个引用(reference), 指向 `String` 类的一个实例, 派生自 `CONSTANT_String_info` 结构（[§4.4.3](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.3))。 为了得出字符串常量, Java 虚拟机检查由 `CONSTANT_String_info` 结构给出的码点序列(sequence of code points):

  - 如果之前已经在等价于 `CONSTANT_String_info` 结构给出的相同 Unicode 码点序列的 `String` 实例上, 调用过 `String.intern` 方法, 则字符串常量是对 `String` 类相同实例的`reference（引用）`。
  - 否则, 会创建一个新的 `String` 实例, 其中包含 `CONSTANT_String_info` 结构给出的 Unicode 码点序列。 字符串常量是对新实例的引用。 最后, 在新实例上调用方法 `String.intern`。

- Numeric constants are derived from `CONSTANT_Integer_info`, `CONSTANT_Float_info`, `CONSTANT_Long_info`, and `CONSTANT_Double_info` structures ([§4.4.4](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.4), [§4.4.5](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.5)).

  Note that `CONSTANT_Float_info` structures represent values in IEEE 754 single format and `CONSTANT_Double_info` structures represent values in IEEE 754 double format. The numeric constants derived from these structures must thus be values that can be represented using IEEE 754 single and double formats, respectively.

- 数字常量, 源自 `CONSTANT_Integer_info`、`CONSTANT_Float_info`、`CONSTANT_Long_info` 和 `CONSTANT_Double_info` 结构 ([§4.4.4](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.4), [§4.4.5](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4.5))。

  请注意, `CONSTANT_Float_info` 结构表示 IEEE 754 中规定的单格式(single format)的值, 而 `CONSTANT_Double_info` 结构表示 IEEE 754 中双精度格式(double format)的值。 因此, 从这些结构派生的数字常量, 必须是 IEEE 754 标准中, 可以使用single格式或者double格式表示的值。

The remaining structures in the `constant_pool` table - the descriptive structures `CONSTANT_NameAndType_info`, `CONSTANT_Module_info`, and `CONSTANT_Package_info`, and the foundational structure `CONSTANT_Utf8_info` - are only used indirectly when constructing the run-time constant pool. No entries in the run-time constant pool correspond directly to these structures.

`constant_pool` 表中的其余结构, 仅在构建运行时常量池时, 间接使用:

- 描述性结构 `CONSTANT_NameAndType_info`、`CONSTANT_Module_info` 和 `CONSTANT_Package_info`,
- 以及基础结构 `CONSTANT_Utf8_info`

运行时常量池中没有任何条目直接对应于这些结构。

Some entries in the run-time constant pool are *loadable*, which means:

- They may be pushed onto the stack by the *ldc* family of instructions ([§*ldc*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.ldc), [§*ldc_w*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.ldc_w), [§*ldc2_w*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.ldc2_w)).
- They may be static arguments to bootstrap methods for dynamically-computed constants and call sites ([§5.4.3.6](#jvms-5.4.3.6)).


运行时常量池中有一些条目是 *loadable* 的, 这意味着:

- 它们可以被 *ldc* 系列指令推入操作数栈（[§*ldc*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.ldc), [§*ldc_w*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.ldc_w), [§*ldc2_w*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.ldc2_w) ）。
- 它们可能是 bootstrap 方法的静态参数, 比如动态计算常量和调用点;  ([§5.4.3.6](#jvms-5.4.3.6))。

An entry in the run-time constant pool is loadable if it is derived from an entry in the `constant_pool` table that is loadable (see [Table 4.4-C](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4-310)). Accordingly, the following entries in the run-time constant pool are loadable:

- Symbolic references to classes and interfaces
- Symbolic references to method handles
- Symbolic references to method types
- Symbolic references to dynamically-computed constants
- Static constants

运行时常量池中的条目, 如果是源自于 `constant_pool` 表中的可加载条目, 则它是 loadable(可加载的);（请参阅 [Table 4.4-C](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.4-310)).
因此, 运行时常量池中的这些条目都是可加载的:

- 对类和接口（classes and interfaces）的符号引用
- 对方法句柄（method handles）的符号引用
- 对方法类型（method types）的符号引用
- 对动态计算常量（dynamically-computed constants）的符号引用
- 静态常量（Static constants）


<a name="jvms-5.2"></a>
## 5.2. Java Virtual Machine Startup

## 5.2. Java 虚拟机启动

The Java Virtual Machine starts up by creating an initial class or interface using the bootstrap class loader ([§5.3.1](#jvms-5.3.1)) or a user-defined class loader ([§5.3.2](#jvms-5.3.2)). The Java Virtual Machine then links the initial class or interface, initializes it, and invokes the `public` `static` method `void main(String[])`. The invocation of this method drives all further execution. Execution of the Java Virtual Machine instructions constituting the `main` method may cause linking (and consequently creation) of additional classes and interfaces, as well as invocation of additional methods.

Java 虚拟机启动时，会通过启动类加载器 (bootstrap class loader, [§5.3.1](#jvms-5.3.1)) , 或者用户自定义的类加载器 (user-defined class loader, [§5.3.2](#jvms-5.3.2)), 创建一个初始的类或接口.  然后Java 虚拟机链接初始类或接口, 对其进行初始化, 并调用 `public` `static` `void main(String[])` 方法。 调用此方法会驱动所有进一步的执行过程。 执行 `main` 方法中的 JVM指令, 可能会导致链接（和创建）其他类以及接口, 以及调用其他方法。

The initial class or interface is specified in an implementation-dependent manner. For example, the initial class or interface could be provided as a command line argument. Alternatively, the implementation of the Java Virtual Machine could itself provide an initial class that sets up a class loader which in turn loads an application. Other choices of the initial class or interface are possible so long as they are consistent with the specification given in the previous paragraph.

初始类或接口以JVM具体实现支持的相关方式指定。 例如, 初始类或接口可以通过命令行参数提供。 或者, Java 虚拟机的实现本身也可以提供一个初始类, 该类设置一个类加载器, 使用该类加载器反过来加载应用程序。 使用其他方式来指定初始类或接口也是可能的, 只要与前一段中给出的规范一致。


<a name="jvms-5.3"></a>
## 5.3. Creation and Loading

## 5.3. 创建和加载

Creation of a class or interface C denoted by the name `N` consists of the construction in the method area of the Java Virtual Machine ([§2.5.4](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.5.4)) of an implementation-specific internal representation of C. Class or interface creation is triggered by another class or interface D, which references C through its run-time constant pool. Class or interface creation may also be triggered by D invoking methods in certain Java SE Platform class libraries ([§2.12](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.12)) such as reflection.

`N` 类或接口 C 的创建过程, 由JVM通过方法区中的名称`N`来构造（[§2.5.4](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.5.4)),  C 的内部表示由具体的JVM实现来决定。 类或接口的创建由另一个类或接口 D 触发, 该类或接口 D 通过其运行时常量池引用 C。 类或接口的创建也可能由某些 Java SE 平台类库中的 D 调用方法触发（[§2.12](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.12)) 比如反射。

If C is not an array class, it is created by loading a binary representation of C ([§4 (*The `class` File Format*)](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html)) using a class loader. Array classes do not have an external binary representation; they are created by the Java Virtual Machine rather than by a class loader.

如果 C 不是数组类, 它是通过使用类加载器, 加载 C 的二进制表示来创建的（[§4 (*The `class` File Format*)](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html)）。 数组类没有外部的二进制表示；它们是由 Java 虚拟机而不是类加载器创建的。

There are two kinds of class loaders: the bootstrap class loader supplied by the Java Virtual Machine, and user-defined class loaders. Every user-defined class loader is an instance of a subclass of the abstract class `ClassLoader`. Applications employ user-defined class loaders in order to extend the manner in which the Java Virtual Machine dynamically loads and thereby creates classes. User-defined class loaders can be used to create classes that originate from user-defined sources. For example, a class could be downloaded across a network, generated on the fly, or extracted from an encrypted file.

有两种类加载器: Java 虚拟机提供的启动类加载器(bootstrap class loader), 和用户自定义的类加载器。
每个用户定义的类加载器都是抽象类`ClassLoader`的子类的一个实例。 应用程序使用用户定义的类加载器来扩展 Java 虚拟机，实现动态加载并由此创建类的方式。 用户定义的类加载器可用于创建源自用户自定义来源的类。 例如, 可以通过网络下载、动态生成或从加密文件中提取出来一个类。

A class loader `L` may create C by defining it directly or by delegating to another class loader. If `L` creates C directly, we say that `L` *defines* C or, equivalently, that `L` is the *defining loader* of C.

类加载器`L`可以通过直接定义或委托给另一个类加载器来创建 C.  如果`L`直接创建C, 我们说 `L` *定义了（defines）* C, 或者说, `L`是C的 *定义加载器（defining loader）*。

When one class loader delegates to another class loader, the loader that initiates the loading is not necessarily the same loader that completes the loading and defines the class. If `L` creates C, either by defining it directly or by delegation, we say that `L` initiates loading of C or, equivalently, that `L` is an *initiating loader* of C.

当一个类加载器委托另一个类加载器时, 初始启动加载的 loader 不一定是最终完成加载并定义类的加载器.  如果`L`通过直接定义或通过委托来创建 C, 我们说`L`启动了C 的加载, 或者等效地, `L`是 C 的 *启动加载器*。

At run time, a class or interface is determined not by its name alone, but by a pair: its binary name ([§4.2.1](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.2.1)) and its defining class loader. Each such class or interface belongs to a single *run-time package*. The run-time package of a class or interface is determined by the package name and defining class loader of the class or interface.

在运行时, 类或接口不仅仅只由名称决定, 而是由两项因素共同确定:

- 类或接口的二进制名称（[§4.2.1](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.2.1))
- 定义它的类加载器.

每个这样的类或接口都属于一个 *运行时包(run-time package)*.  类或接口的运行时包, 由包名和定义类或接口的类加载器决定。

The Java Virtual Machine uses one of three procedures to create class or interface C denoted by `N`:

- If `N` denotes a nonarray class or an interface, one of the two following methods is used to load and thereby create C:
  - If D was defined by the bootstrap class loader, then the bootstrap class loader initiates loading of C ([§5.3.1](#jvms-5.3.1)).
  - If D was defined by a user-defined class loader, then that same user-defined class loader initiates loading of C ([§5.3.2](#jvms-5.3.2)).
- Otherwise `N` denotes an array class. An array class is created directly by the Java Virtual Machine ([§5.3.3](#jvms-5.3.3)), not by a class loader. However, the defining class loader of D is used in the process of creating array class C.

Java 虚拟机通过以下3种过程中的一种, 来创建由`N`表示的类或接口 C:

- 如果`N`表示非数组类或接口, 则使用以下两种方法之一来加载并由此创建 C:
   - 如果 D 由启动类加载器定义, 则启动类加载器启动 C 的加载（[§5.3.1](#jvms-5.3.1)）。
   - 如果 D 由用户定义的类加载器定义, 则使用相同的用户自定义类加载器来启动 C 的加载（[§5.3.2](#jvms-5.3.2)）。
- 否则 `N` 表示一个数组类.  数组类由 Java 虚拟机 ([§5.3.3](#jvms-5.3.3)) 直接创建, 而不是由类加载器创建. 但是在创建数组类C的过程中会使用D的定义类加载器。


If an error occurs during class loading, then an instance of a subclass of `LinkageError` must be thrown at a point in the program that (directly or indirectly) uses the class or interface being loaded.

如果在类加载期间发生错误, 则必须在程序中（直接或间接）使用正在加载的类或接口的某个位置, 抛出一个 `LinkageError` 子类的Error实例。

If the Java Virtual Machine ever attempts to load a class C during verification ([§5.4.1](#jvms-5.4.1)) or resolution ([§5.4.3](#jvms-5.4.3)) (but not initialization ([§5.5](#jvms-5.5))), and the class loader that is used to initiate loading of C throws an instance of `ClassNotFoundException`, then the Java Virtual Machine must throw an instance of `NoClassDefFoundError` whose cause is the instance of `ClassNotFoundException`.

如果 Java 虚拟机加载一个类时, 在验证 ([§5.4.1](#jvms-5.4.1)) 或解析 ([§5.4.3](#jvms-5.4.3)) 期间（尚未初始化（[§5.5](#jvms-5.5))）, 并且用于启动 C 加载的类加载器抛出了一个 `ClassNotFoundException` 的Exception实例, 那么 Java 虚拟机必须抛出一个 `NoClassDefFoundError` 的Error实例, 其中设置 Cause 为 `ClassNotFoundException` 实例。

(A subtlety here is that recursive class loading to load superclasses is performed as part of resolution ([§5.3.5](#jvms-5.3.5), step 3). Therefore, a `ClassNotFoundException` that results from a class loader failing to load a superclass must be wrapped in a `NoClassDefFoundError`.)

（这里的一个微妙之处在于, 递归加载超类时, 是作为解析的一部分执行的（[§5.3.5](#jvms-5.3.5), 第 3 步）。 因此, 导致类加载器未能成功加载超类的 `ClassNotFoundException` 异常, 必须包在 `NoClassDefFoundError` 中。）


A well-behaved class loader should maintain three properties:

- Given the same name, a good class loader should always return the same `Class` object.
- If a class loader `L1` delegates loading of a class C to another loader `L2`, then for any type T that occurs as the direct superclass or a direct superinterface of C, or as the type of a field in C, or as the type of a formal parameter of a method or constructor in C, or as a return type of a method in C, `L1` and `L2` should return the same `Class` object.
- If a user-defined classloader prefetches binary representations of classes and interfaces, or loads a group of related classes together, then it must reflect loading errors only at points in the program where they could have arisen without prefetching or group loading.

行为良好的类加载器应该支持这三个特性:

- 给定相同的名称, 一个好的类加载器应该总是返回相同的 `Class` 对象。
- 如果类加载器 `L1` 将类 C 的加载委托给另一个加载器`L2`；那么对于任何类型 T，作为 C 的直接超类，或C的直接超接口, 或作为 C 中字段的类型，或作为 C 中方法或构造函数的形参类型，或者作为 C 中方法的返回类型，`L1` 和 `L2` 这两个类加载器都应该返回相同的 `Class` 对象。
- 如果用户自定义的类加载器, 预取了类和接口的二进制表示, 或者批量加载一组相关的类, 那么必须在没有预取或批量加载的情况下, 可能出现加载错误的地方才能抛出加载错误。



We will sometimes represent a class or interface using the notation `<``N`, `Ld``>`, where `N` denotes the name of the class or interface and `Ld` denotes the defining loader of the class or interface.

我们有时会使用符号 `<N, Ld>` 来表示一个类或接口,  其中`N`表示类或接口的名称, `Ld`表示类或接口的定义加载器 .

We will also represent a class or interface using the notation `N``Li`, where `N` denotes the name of the class or interface and `Li` denotes an initiating loader of the class or interface.

我们还会使用符号 `NLi` 表示类或接口, 其中`N`表示类或接口的名称, `Li`表示类或接口的初始加载器。


<a name="jvms-5.3.1"></a>
### 5.3.1. Loading Using the Bootstrap Class Loader

### 5.3.1. 启动类加载器执行的加载

The following steps are used to load and thereby create the nonarray class or interface C denoted by `N` using the bootstrap class loader.

以下步骤, 启动类加载器用于加载并创建由`N`表示的非数组类 C, 或接口 C。

First, the Java Virtual Machine determines whether the bootstrap class loader has already been recorded as an initiating loader of a class or interface denoted by `N`. If so, this class or interface is C, and no class creation is necessary.

首先, Java 虚拟机需要确定, 启动类加载器是否已经被登记为由`N`表示的类或接口的初始加载器. 如果是这样, 则此类或接口是 C, 并且不需要创建类。

Otherwise, the Java Virtual Machine passes the argument `N` to an invocation of a method on the bootstrap class loader to search for a purported representation of C in a platform-dependent manner. Typically, a class or interface will be represented using a file in a hierarchical file system, and the name of the class or interface will be encoded in the pathname of the file.

否则, Java 虚拟机将参数`N`传递给启动类加载器上的方法调用, 以依赖于平台的方式搜索 C 的声明表示. 通常, 类或接口使用的是分层目录结构文件系统中的文件表示, 并且类或接口的名称对应了文件的路径名。

Note that there is no guarantee that a purported representation found is valid or is a representation of C. This phase of loading must detect the following error:

- If no purported representation of C is found, loading throws an instance of `ClassNotFoundException`.

请注意, 并不能保证一定会找到 C 的声明表示, 或者找到了但格式不一定合法。 这个加载阶段必须检测到以下错误:

- 如果没有找到 C 的声明表示, 加载过程会抛出一个 `ClassNotFoundException` 类的异常实例。

Then the Java Virtual Machine attempts to derive a class denoted by `N` using the bootstrap class loader from the purported representation using the algorithm found in [§5.3.5](#jvms-5.3.5). That class is C.

然后, Java 虚拟机尝试使用 [§5.3.5](#jvms-5.3.5) 中介绍的算法, 使用启动类加载器, 从声称的表示中派生一个由 `N` 表示的类. 那个类就是C。


<a name="jvms-5.3.2"></a>
### 5.3.2. Loading Using a User-defined Class Loader

### 5.3.2. 用户自定义类加载器执行的加载

The following steps are used to load and thereby create the nonarray class or interface C denoted by `N` using a user-defined class loader `L`.

用户自定义的类加载器`L`, 通过以下步骤, 加载并创建由`N`表示的, 非数组类 C, 或者接口 C。

First, the Java Virtual Machine determines whether `L` has already been recorded as an initiating loader of a class or interface denoted by `N`. If so, this class or interface is C, and no class creation is necessary.

首先, Java 虚拟机确定`L`是否已被记录为由`N`表示的类或接口的初始加载器. 如果是这样, 则需要定义的类或接口就是 C, 并且不需要创建类。

Otherwise, the Java Virtual Machine invokes `loadClass(N)` on `L`. The value returned by the invocation is the created class or interface C. The Java Virtual Machine then records that `L` is an initiating loader of C ([§5.3.4](#jvms-5.3.4)). The remainder of this section describes this process in more detail.

否则, Java 虚拟机在 `L` 上调用 `loadClass(N)`. 调用返回的值是创建的类或接口 C。 JVM 然后记录`L`是 C 的初始加载器（[§5.3.4](#jvms-5.3.4)）. 本节剩下的部分更详细地描述了这个过程。

When the `loadClass` method of the class loader `L` is invoked with the name `N` of a class or interface C to be loaded, `L` must perform one of the following two operations in order to load C:

当使用名称`N`，要加载类或接口 C，调用类加载器`L`的`loadClass`方法时, `L`必须执行以下两个操作之一才能加载 C:

1. The class loader `L` can create an array of bytes representing C as the bytes of a `ClassFile` structure ([§4.1](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.1)); it then must invoke the method `defineClass` of class `ClassLoader`. Invoking `defineClass` causes the Java Virtual Machine to derive a class or interface denoted by `N` using `L` from the array of bytes using the algorithm found in [§5.3.5](#jvms-5.3.5).
2. The class loader `L` can delegate the loading of C to some other class loader `L'`. This is accomplished by passing the argument `N` directly or indirectly to an invocation of a method on `L`' (typically the `loadClass` method). The result of the invocation is C.

1. 类加载器 `L` 可以创建一个字节数组, 将 C 表示为 `ClassFile` 结构的字节数组（[§4.1](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.1)); 然后它必须调用 `ClassLoader` 类的方法`defineClass`。 调用 `defineClass` 会导致 Java 虚拟机使用 [§5.3.5](#jvms-5.3.5) 中的算法, 从字节数组中通过 `L` 派生出一个由名称 `N` 表示的类或接口。
2. 类加载器`L`可以将 C 的加载委托给其他类加载器`L'`。 这是通过将参数`N`直接或间接传递给`L'`上的方法（通常是`loadClass`方法）调用来实现的。调用的结果是 C。

In either (1) or (2), if the class loader `L` is unable to load a class or interface denoted by `N` for any reason, it must throw an instance of `ClassNotFoundException`.

Since JDK release 1.1, Oracle’s Java Virtual Machine implementation has invoked the `loadClass` method of a class loader in order to cause it to load a class or interface. The argument to `loadClass` is the name of the class or interface to be loaded. There is also a two-argument version of the `loadClass` method, where the second argument is a `boolean` that indicates whether the class or interface is to be linked or not. Only the two-argument version was supplied in JDK release 1.0.2, and Oracle’s Java Virtual Machine implementation relied on it to link the loaded class or interface. From JDK release 1.1 onward, Oracle’s Java Virtual Machine implementation links the class or interface directly, without relying on the class loader.

不管是在 (1) 或 (2) 步骤中, 如果类加载器`L`由于任何原因, 无法加载由`N`表示的类或接口, 它必须抛出一个 `ClassNotFoundException` 异常实例。

自 JDK 1.1 版以来, Oracle 的 Java 虚拟机实现, 调用某个类加载器的 `loadClass` 方法, 以使其加载类或接口. `loadClass` 的参数是要加载的类或接口的名称. `loadClass` 方法还有一个双参数版本, 其中第二个参数是一个 `boolean`, 指示是否要链接类或接口.  早期的 JDK 1.0.2 版中只提供了两个参数的版本, Oracle 的 Java 虚拟机实现, 依赖它来链接加载的类或接口。 从 JDK 1.1 版开始, Oracle 的 Java 虚拟机实现直接链接类或接口, 而不依赖于类加载器。


<a name="jvms-5.3.3"></a>
### 5.3.3. Creating Array Classes

### 5.3.3. 创建数组类

The following steps are used to create the array class C denoted by `N` using class loader `L`. Class loader `L` may be either the bootstrap class loader or a user-defined class loader.

使用类加载器`L`, 创建由名称 `N` 表示的数组类 C, 采取下面的步骤。 类加载器`L` 可以是启动类加载器, 或者用户定义的类加载器。

If `L` has already been recorded as an initiating loader of an array class with the same component type as `N`, that class is C, and no array class creation is necessary.

如果`L`已经被记录为与`N`具有相同组件类型的数组类的初始加载器, 则该类就是C, 不需要再创建数组类。

Otherwise, the following steps are performed to create C:

否则, 执行以下步骤来创建 C:

1. If the component type is a `reference` type, the algorithm of this section ([§5.3](#jvms-5.3)) is applied recursively using class loader `L` in order to load and thereby create the component type of C.

2. The Java Virtual Machine creates a new array class with the indicated component type and number of dimensions.

   If the component type is a `reference` type, C is marked as having been defined by the defining class loader of the component type. Otherwise, C is marked as having been defined by the bootstrap class loader.

   In any case, the Java Virtual Machine then records that `L` is an initiating loader for C ([§5.3.4](#jvms-5.3.4)).

   If the component type is a `reference` type, the accessibility of the array class is determined by the accessibility of its component type ([§5.4.4](#jvms-5.4.4)). Otherwise, the array class is accessible to all classes and interfaces.

1. 如果组件类型是 `reference` 类型, 则使用类加载器 `L` , 递归应用本节的算法（[§5.3](#jvms-5.3)）, 以加载并创建组件类型C。

2. Java 虚拟机创建一个具有指定组件类型和维数的新数组类。

   如果组件类型是 `引用` 类型, 则 C 被标记为已由组件类型的定义类加载器定义。 否则, C 被标记为已由启动类加载器定义。

   在任何情况下, Java 虚拟机都会记录`L`是 C 的初始加载器（[§5.3.4](#jvms-5.3.4)）。

   如果组件类型是`引用`类型, 则数组类的可访问性, 由其组件类型的可访问性决定（[§5.4.4](#jvms-5.4.4)）。 否则, 所有类和接口都可以访问数组类。


<a name="jvms-5.3.4"></a>
### 5.3.4. Loading Constraints

### 5.3.4. 加载约束

Ensuring type safe linkage in the presence of class loaders requires special care. It is possible that when two different class loaders initiate loading of a class or interface denoted by `N`, the name `N` may denote a different class or interface in each loader.

在存在类加载器的情况下, 确保类型的安全链接, 需要特别小心。 当两个不同的类加载器, 开始加载一个由 `N` 表示的类或接口时, 名称`N`可能表示每个加载器中的不同类或接口。

When a class or interface C = `<N1, L1>` makes a symbolic reference to a field or method of another class or interface D = `<N2, L2>`, the symbolic reference includes a descriptor specifying the type of the field, or the return and argument types of the method. It is essential that any type name `N` mentioned in the field or method descriptor denote the same class or interface when loaded by `L1` and when loaded by `L2`.

当一个类或接口 C = `<N1, L1>`, 有一个符号引用 D = `<N2, L2>`, 指向另一个类或接口的字段或方法, 符号引用包括了指定字段类型的描述符, 或者方法的返回值类型和参数类型。 重要的是, 字段或方法描述符中提到的任何类型名称`N`, 在被`L1`加载时和被`L2`加载时, 都表示相同的类或接口。

To ensure this, the Java Virtual Machine imposes *loading constraints* of the form `N(L1` = `N(L2` during preparation ([§5.4.2](#jvms-5.4.2)) and resolution ([§5.4.3](#jvms-5.4.3)). To enforce these constraints, the Java Virtual Machine will, at certain prescribed times (see [§5.3.1](#jvms-5.3.1), [§5.3.2](#jvms-5.3.2), [§5.3.3](#jvms-5.3.3), and [§5.3.5](#jvms-5.3.5)), record that a particular loader is an initiating loader of a particular class. After recording that a loader is an initiating loader of a class, the Java Virtual Machine must immediately check to see if any loading constraints are violated. If so, the record is retracted, the Java Virtual Machine throws a `LinkageError`, and the loading operation that caused the recording to take place fails.

为了确保这一点, Java 虚拟机在准备 ([§5.4.2](#jvms-5.4.2)) 和解析 ( [§5.4.3](#jvms-5.4.3))阶段, 施加了加载约束 `N(L1` = `N(L2`。 为了强制这种约束, Java 虚拟机将在某些规定的时间（参见 [§5.3.1](#jvms-5.3.1)、[§5.3.2](#jvms-5.3.2)、[§5.3 .3](#jvms-5.3.3) 和 [§5.3.5](#jvms-5.3.5)), 记录特定加载器为特定类的初始加载器。 在记录加载器是某个类的初始加载器之后, Java 虚拟机必须立即检查是否违反了任何加载约束。 如果是这样, 记录将被收回, Java 虚拟机抛出一个 `LinkageError`, 导致发生记录操作的加载行为失败。

Similarly, after imposing a loading constraint (see [§5.4.2](#jvms-5.4.2), [§5.4.3.2](#jvms-5.4.3.2), [§5.4.3.3](#jvms-5.4.3.3), and [§5.4.3.4](#jvms-5.4.3.4)), the Java Virtual Machine must immediately check to see if any loading constraints are violated. If so, the newly imposed loading constraint is retracted, the Java Virtual Machine throws a `LinkageError`, and the operation that caused the constraint to be imposed (either resolution or preparation, as the case may be) fails.

同样, 在施加加载约束之后（参见 [§5.4.2](#jvms-5.4.2)、[§5.4.3.2](#jvms-5.4.3.2)、[§5.4.3.3](#jvms-5.4.3.3) 和 [§5.4.3.4](#jvms-5.4.3.4)), Java 虚拟机必须立即检查是否违反了任何加载约束。 如果是这样, 则收回新施加的加载约束, Java 虚拟机抛出一个 `LinkageError`, 导致施加约束的操作（解析或准备, 看具体情况）失败。

The situations described here are the only times at which the Java Virtual Machine checks whether any loading constraints have been violated. A loading constraint is violated if, and only if, all the following four conditions hold:

这里描述的情况, 是 Java 虚拟机检查是否违反任何加载约束的唯一时间。 当且仅当以下所有四个条件全部成立时, 才违反加载约束:

- There exists a loader `L` such that `L` has been recorded by the Java Virtual Machine as an initiating loader of a class C named `N`.
- There exists a loader `L'` such that `L`' has been recorded by the Java Virtual Machine as an initiating loader of a class C' named `N`.
- The equivalence relation defined by the (transitive closure of the) set of imposed constraints implies `N``L` = `N``L`'.
- `C ≠ C'`.


- 存在一个加载器`L`, 因此`L`已被 Java 虚拟机记录为名为`N`的类 C 的初始加载器。
- 存在一个加载器`L'`, 因此 `L'` 已被 Java 虚拟机记录为名为`N`的类 `C'` 的初始加载器。
- 由施加约束的（传递闭包）集合定义的等价关系意味着`N(L` = `N(L'`。
- `C ≠ C'`。


A full discussion of class loaders and type safety is beyond the scope of this specification. For a more comprehensive discussion, readers are referred to *Dynamic Class Loading in the Java Virtual Machine* by Sheng Liang and Gilad Bracha (*Proceedings of the 1998 ACM SIGPLAN Conference on Object-Oriented Programming Systems, Languages and Applications*).


对类加载器和类型安全的完整讨论超出了本规范的范围。 如需更全面的讨论, 读者可参阅 Sheng Liang 和 Gilad Bracha 的文章: [Dynamic class loading in the Java virtual machine](https://dl.acm.org/doi/10.1145/286942.286945)。


<a name="jvms-5.3.5"></a>
### 5.3.5. Deriving a Class from a `class` File Representation

### 5.3.5. 从`class`文件数据派生出一个类

The following steps are used to derive a `Class` object for the nonarray class or interface C denoted by `N` using loader `L` from a purported representation in `class` file format.


以下步骤, 用于加载器`L`, 从所谓的 `class` 文件格式的表示中, 为非数组类或接口 C 派生出一个名为 `N` 的 `Class`对象。

1. First, the Java Virtual Machine determines whether it has already recorded that `L` is an initiating loader of a class or interface denoted by `N`. If so, this creation attempt is invalid and loading throws a `LinkageError`.

1. 首先, Java虚拟机判断是否已经记录了 `L` 是名为 `N` 的类或接口的初始加载器。 如果是这样, 则本次尝试创建无效, 并且加载过程会抛出 `LinkageError`。

2. Otherwise, the Java Virtual Machine attempts to parse the purported representation. However, the purported representation may not in fact be a valid representation of C.

   This phase of loading must detect the following errors:

   - If the purported representation is not a `ClassFile` structure ([§4.1](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.1), [§4.8](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.8)), loading throws an instance of `ClassFormatError`.

   - Otherwise, if the purported representation is not of a supported major or minor version ([§4.1](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.1)), loading throws an instance of `UnsupportedClassVersionError`.

     `UnsupportedClassVersionError`, a subclass of `ClassFormatError`, was introduced to enable easy identification of a `ClassFormatError` caused by an attempt to load a class whose representation uses an unsupported version of the `class` file format. In JDK release 1.1 and earlier, an instance of `NoClassDefFoundError` or `ClassFormatError` was thrown in case of an unsupported version, depending on whether the class was being loaded by the system class loader or a user-defined class loader.

   - Otherwise, if the purported representation does not actually represent a class named `N`, loading throws an instance of `NoClassDefFoundError` or an instance of one of its subclasses.

     This occurs when the purported representation has either a `this_class` item which specifies a name other than `N`, or an `access_flags` item which has the `ACC_MODULE` flag set.

2. 然后, Java 虚拟机尝试解析二进制格式的数据。 但实际上, 这份二进制数据有可能不是 C 的有效表示。

加载的这个阶段必须检测以下错误:

  - 如果声称的表示不是 `ClassFile` 结构（[§4.1](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.1), [§4.8](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.8)）, 加载会抛出 `ClassFormatError` 实例。

  - 然后, 如果声称的表示, 不是受支持的大版本和小版本（major or minor version, [§4.1](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.1)), 加载过程会抛出一个 `UnsupportedClassVersionError` 的实例。

  > `UnsupportedClassVersionError` 是 `ClassFormatError` 的子类, 引入它的目的是为了能够轻松识别由于尝试加载不支持版本的 `class` 文件格式的类而导致的 `ClassFormatError`。 在 JDK 1.1 和更早的版本中, 如果版本不受支持, 则会抛出 `NoClassDefFoundError` 或 `ClassFormatError` 的实例, 具体取决于类是由系统类加载器还是用户定义的类加载器加载的。

  - 然后, 如果声称的表示实际上并不表示名为 `N` 的类, 则加载会抛出 `NoClassDefFoundError` 或其子类的实例。

  > 当声称的表示具有指定`N`以外的名称的`this_class`项或设置了`ACC_MODULE`标志的`access_flags`项时, 就会发生这种情况。


3. If C has a direct superclass, the symbolic reference from C to its direct superclass is resolved using the algorithm of [§5.4.3.1](#jvms-5.4.3.1). Note that if C is an interface it must have `Object` as its direct superclass, which must already have been loaded. Only `Object` has no direct superclass.

   Any exceptions that can be thrown due to class or interface resolution can be thrown as a result of this phase of loading. In addition, this phase of loading must detect the following errors:

   - If the class or interface named as the direct superclass of C is in fact an interface, loading throws an `IncompatibleClassChangeError`.
   - Otherwise, if any of the superclasses of C is C itself, loading throws a `ClassCircularityError`.

3. 如果 C 具有直接超类, 则使用 [§5.4.3.1](#jvms-5.4.3.1) 的算法解析从 C 到其直接超类的符号引用。 请注意, 如果 C 是一个接口, 它必须将 `Object` 作为其直接超类, 该超类一定已经被加载。 只有 `Object` 没有直接的超类。

   由于类或接口解析而抛出的任何异常, 都可能在此加载阶段抛出。 此外, 这个加载阶段必须检测以下错误:

   - 如果命名为 C 的直接超类的类或接口实际上是一个接口, 则加载时会抛出一个 `IncompatibleClassChangeError`。
   - 然后, 如果 C 的任何超类是 C 本身, 则加载会抛出 `ClassCircularityError`。

4. If C has any direct superinterfaces, the symbolic references from C to its direct superinterfaces are resolved using the algorithm of [§5.4.3.1](#jvms-5.4.3.1).

   Any exceptions that can be thrown due to class or interface resolution can be thrown as a result of this phase of loading. In addition, this phase of loading must detect the following errors:

   - If any of the classes or interfaces named as direct superinterfaces of C is not in fact an interface, loading throws an `IncompatibleClassChangeError`.
   - Otherwise, if any of the superinterfaces of C is C itself, loading throws a `ClassCircularityError`.

4. 如果 C 有任何直接超接口, 则使用 [§5.4.3.1](#jvms-5.4.3.1) 的算法解析从 C 到其直接超接口的符号引用。

   由于类或接口解析而抛出的任何异常, 都可能在此加载阶段抛出。 此外, 这个加载阶段必须检测以下错误:

   - 如果命名为 C 的直接超接口的任何类或接口, 实际上不是接口, 则加载会抛出 `IncompatibleClassChangeError`。
   - 然后, 如果 C 的任何超接口是 C 本身, 则加载会抛出 `ClassCircularityError`。

5. The Java Virtual Machine marks C as having `L` as its defining class loader and records that `L` is an initiating loader of C ([§5.3.4](#jvms-5.3.4)).

5. Java 虚拟机将 C 标记为具有 `L` 作为其定义类加载器, 并记录`L`是 C 的初始加载器（[§5.3.4](#jvms-5.3.4)）。


<a name="jvms-5.3.6"></a>
### 5.3.6. Modules and Layers

The Java Virtual Machine supports the organization of classes and interfaces into modules. The membership of a class or interface C in a module `M` is used to control access to C from classes and interfaces in modules other than `M` ([§5.4.4](#jvms-5.4.4)).

Module membership is defined in terms of run-time packages ([§5.3](#jvms-5.3)). A program determines the names of the packages in each module, and the class loaders that will create the classes and interfaces of the named packages; it then specifies the packages and class loaders to an invocation of the `defineModules` method of the class `ModuleLayer`. Invoking `defineModules` causes the Java Virtual Machine to create new *run-time modules* that are associated with the run-time packages of the class loaders.

Every run-time module indicates the run-time packages that it *exports*, which influences access to the `public` classes and interfaces in those run-time packages. Every run-time module also indicates the other run-time modules that it *reads*, which influences access by its own code to the `public` types and interfaces in those run-time modules.

We say that *a class is in a run-time module* iff the class's run-time package is associated (or will be associated, if the class is actually created) with that run-time module.

A class created by a class loader is in exactly one run-time package and therefore exactly one run-time module, because the Java Virtual Machine does not support a run-time package being associated with (or more evocatively, "split across") multiple run-time modules.

A run-time module is implicitly bound to exactly one class loader, by the semantics of `defineModules`. On the other hand, a class loader may create classes in more than one run-time module, because the Java Virtual Machine does not require all the run-time packages of a class loader to be associated with the same run-time module.

In other words, the relationship between class loaders and run-time modules need not be 1:1. For a given set of modules to be loaded, if a program can determine that the names of the packages in each module are found only in that module, then the program may specify only one class loader to the invocation of `defineModules`. This class loader will create classes across multiple run-time modules.

Every run-time module created by `defineModules` is part of a *layer*. A layer represents a set of class loaders that jointly serve to create classes in a set of run-time modules. There are two kinds of layers: the boot layer supplied by the Java Virtual Machine, and user-defined layers. The boot layer is created at Java Virtual Machine startup in an implementation-dependent manner. It associates the standard run-time module `java.base` with standard run-time packages defined by the bootstrap class loader, such as `java.lang`. User-defined layers are created by programs in order to construct sets of run-time modules that depend on `java.base` and other standard run-time modules.

A run-time module is implicitly part of exactly one layer, by the semantics of `defineModules`. However, a class loader may create classes in the run-time modules of different layers, because the same class loader may be specified to multiple invocations of `defineModules`. Access control is governed by a class's run-time module, not by the class loader which created the class or by the layer(s) which the class loader serves.

The set of class loaders specified for a layer, and the set of run-time modules which are part of a layer, are immutable after the layer is created. However, the `ModuleLayer` class affords programs a degree of dynamic control over the relationships between the run-time modules in a user-defined layer.

If a user-defined layer contains more than one class loader, then any delegation between the class loaders is the responsibility of the program that created the layer. The Java Virtual Machine does not check that the layer's class loaders delegate to each other in accordance with how the layer's run-time modules read each other. Moreover, if the layer's run-time modules are modified via the `ModuleLayer` class to read additional run-time modules, then the Java Virtual Machine does not check that the layer's class loaders are modified by some out-of-band mechanism to delegate in a corresponding fashion.

There are similarities and differences between class loaders and layers. On the one hand, a layer is similar to a class loader in that each may delegate to, respectively, one or more parent layers or class loaders that created, respectively, modules or classes at an earlier time. That is, the set of modules specified to a layer may depend on modules not specified to the layer, and instead specified previously to one or more parent layers. On the other hand, a layer may be used to create new modules only once, whereas a class loader may be used to create new classes or interfaces at any time via multiple invocations of the `defineClass` method.

It is possible for a class loader to define a class or interface in a run-time package that was not associated with a run-time module by any of the layers which the class loader serves. This may occur if the run-time package embodies a named package that was not specified to `defineModules`, or if the class or interface has a simple binary name ([§4.2.1](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.2.1)) and thus is a member of a run-time package that embodies an unnamed package (JLS §7.4.2). In either case, the class or interface is treated as a member of a special run-time module which is implicitly bound to the class loader. This special run-time module is known as the *unnamed module* of the class loader. The run-time package of the class or interface is associated with the unnamed module of the class loader. There are special rules for unnamed modules, designed to maximize their interoperation with other run-time modules, as follows:

- A class loader's unnamed module is distinct from all other run-time modules bound to the same class loader.
- A class loader's unnamed module is distinct from all run-time modules (including unnamed modules) bound to other class loaders.
- Every unnamed module reads every run-time module.
- Every unnamed module exports, to every run-time module, every run-time package associated with itself.

### 5.3.6. 模块和层

Java 虚拟机支持将类和接口组织成模块。模块`M`中的类或接口 C 的成员资格用于控制从`M`以外的模块中的类和接口对 C 的访问（[§5.4.4](#jvms-5.4.4)）。

模块成员是根据运行时包定义的 ([§5.3](#jvms-5.3))。程序确定每个模块中包的名称, 以及将创建命名包的类和接口的类加载器；然后, 它将包和类加载器指定为调用`ModuleLayer`类的`defineModules`方法。调用 `defineModules` 会导致 Java 虚拟机创建新的*运行时模块*, 这些模块与类加载器的运行时包相关联。

每个运行时模块都指示它*导出*的运行时包, 这会影响对这些运行时包中的`公共`类和接口的访问。每个运行时模块还指示它*读取*的其他运行时模块, 这会影响其自己的代码对这些运行时模块中的`公共`类型和接口的访问。

我们说*一个类在一个运行时模块中*, 如果该类的运行时包与该运行时模块关联（或将关联, 如果该类是实际创建的）。

由类加载器创建的类恰好位于一个运行时包中, 因此恰好位于一个运行时模块中, 因为 Java 虚拟机不支持与（或者更令人回味的是, `拆分`）关联的运行时包多个运行时模块。

通过`defineModules`的语义, 一个运行时模块被隐式地绑定到一个类加载器。另一方面, 类加载器可以在多个运行时模块中创建类, 因为 Java 虚拟机不要求类加载器的所有运行时包都与同一个运行时模块相关联。

换句话说, 类加载器和运行时模块之间的关系不必是 1:1。对于要加载的一组给定模块, 如果程序可以确定每个模块中的包的名称仅在该模块中找到, 那么程序可以仅指定一个类加载器来调用`defineModules`。这个类加载器将跨多个运行时模块创建类。

`defineModules` 创建的每个运行时模块都是 *layer* 的一部分。层表示一组类加载器, 它们共同用于在一组运行时模块中创建类。有两种层: Java 虚拟机提供的引导层和用户定义的层。引导层是在 Java 虚拟机启动时以实现相关的方式创建的。它将标准运行时模块`java.base`与启动类加载器定义的标准运行时包相关联, 例如`java.lang`。用户定义层由程序创建, 以构建依赖于 java.base 和其他标准运行时模块的运行时模块集。

根据`defineModules`的语义, 运行时模块隐含地恰好是一层的一部分。然而, 一个类加载器可能会在不同层的运行时模块中创建类, 因为同一个类加载器可能会被指定给`defineModules`的多个调用。访问控制由类的运行时模块管理, 而不是由创建类的类加载器或类加载器所服务的层管理。

为层指定的类加载器集和作为层一部分的运行时模块集在创建层后是不可变的。但是, `ModuleLayer`类为程序提供了对用户定义层中运行时模块之间关系的一定程度的动态控制。

如果用户定义的层包含多个类加载器, 那么类加载器之间的任何委托都是创建该层的程序的责任. Java 虚拟机不会根据层的运行时模块相互读取的方式检查层的类加载器是否相互委托。此外, 如果层的运行时模块通过 `ModuleLayer` 类修改以读取额外的运行时模块, 则 Java 虚拟机不会检查层的类加载器是否被某些带外机制修改以委托以相应的方式。

类加载器和层之间有相似之处和不同之处。一方面, 层类似于类加载器, 因为每个层都可以分别委托给一个或多个父层或类加载器, 这些父层或类加载器分别在较早的时间创建了模块或类。也就是说, 指定给层的模块集可能依赖于未指定给层的模块, 而是先前指定给一个或多个父层的模块。另一方面, 一个层只能用于创建新模块一次, 而类加载器可用于在任何时候通过多次调用来创建新的类或接口


<a name="jvms-5.4"></a>
## 5.4. Linking

Linking a class or interface involves verifying and preparing that class or interface, its direct superclass, its direct superinterfaces, and its element type (if it is an array type), if necessary. Linking also involves resolution of symbolic references in the class or interface, though not necessarily at the same time as the class or interface is verified and prepared.

This specification allows an implementation flexibility as to when linking activities (and, because of recursion, loading) take place, provided that all of the following properties are maintained:

- A class or interface is completely loaded before it is linked.

- A class or interface is completely verified and prepared before it is initialized.

- Errors detected during linkage are thrown at a point in the program where some action is taken by the program that might, directly or indirectly, require linkage to the class or interface involved in the error.

- A symbolic reference to a dynamically-computed constant is not resolved until either (i) an *ldc*, *ldc_w*, or *ldc2_w* instruction that refers to it is executed, or (ii) a bootstrap method that refers to it as a static argument is invoked.

  A symbolic reference to a dynamically-computed call site is not resolved until a bootstrap method that refers to it as a static argument is invoked.

For example, a Java Virtual Machine implementation may choose a "lazy" linkage strategy, where each symbolic reference in a class or interface (other than the symbolic references above) is resolved individually when it is used. Alternatively, an implementation may choose an "eager" linkage strategy, where all symbolic references are resolved at once when the class or interface is being verified. This means that the resolution process may continue, in some implementations, after a class or interface has been initialized. Whichever strategy is followed, any error detected during resolution must be thrown at a point in the program that (directly or indirectly) uses a symbolic reference to the class or interface.

Because linking involves the allocation of new data structures, it may fail with an `OutOfMemoryError`.

## 5.4. 链接

如果需要, 链接一个类或接口涉及验证和准备该类或接口、其直接超类、其直接超接口及其元素类型（如果它是数组类型）。链接还涉及到类或接口中的符号引用的解析, 尽管不一定在验证和准备类或接口的同时。

该规范允许在何时发生链接活动（以及由于递归, 加载）时实现灵活性, 前提是维护以下所有属性:

- 类或接口在链接之前已完全加载。

- 一个类或接口在初始化之前已经完全验证和准备好了。

- 在链接过程中检测到的错误会在程序中的某个点抛出, 在该点程序可能会直接或间接地执行某些操作, 这些操作可能需要链接到错误中涉及的类或接口。

- 直到 (i) 引用它的 *ldc*、*ldc_w* 或 *ldc2_w* 指令被执行, 或 (ii) 引用它的引导方法时, 才会解析对动态计算常量的符号引用作为静态参数被调用。

  在调用将其称为静态参数的引导方法之前, 不会解析对动态计算的调用站点的符号引用。

例如, Java 虚拟机实现可能会选择`惰性`链接策略, 其中类或接口中的每个符号引用（除了上面的符号引用）在使用时都会单独解析。或者, 实现可以选择`急切`的链接策略, 其中在验证类或接口时立即解析所有符号引用。这意味着在某些实现中, 在初始化类或接口之后, 解析过程可能会继续。无论采用哪种策略, 在解析期间检测到的任何错误都必须在程序中（直接或间接）使用对类或接口的符号引用的点处抛出。

因为链接涉及新数据结构的分配, 所以它可能会失败并出现`OutOfMemoryError`。


<a name="jvms-5.4.1"></a>
### 5.4.1. Verification

*Verification* ([§4.10](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.10)) ensures that the binary representation of a class or interface is structurally correct ([§4.9](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.9)). Verification may cause additional classes and interfaces to be loaded ([§5.3](#jvms-5.3)) but need not cause them to be verified or prepared.

If the binary representation of a class or interface does not satisfy the static or structural constraints listed in [§4.9](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.9), then a `VerifyError` must be thrown at the point in the program that caused the class or interface to be verified.

If an attempt by the Java Virtual Machine to verify a class or interface fails because an error is thrown that is an instance of `LinkageError` (or a subclass), then subsequent attempts to verify the class or interface always fail with the same error that was thrown as a result of the initial verification attempt.

### 5.4.1. 确认

*验证* ([§4.10](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.10)) 确保类或接口的二进制表示在结构上是正确的（[§4.9](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.9)）。验证可能会导致加载其他类和接口 ([§5.3](#jvms-5.3)), 但不需要验证或准备它们。

如果类或接口的二进制表示不满足 [§4.9](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.9), 则必须在程序中导致类或接口被验证的点处抛出一个 `VerifyError`。

如果 Java 虚拟机验证类或接口的尝试失败, 因为抛出了一个错误, 该错误是 `LinkageError`（或子类）的一个实例, 那么随后验证类或接口的尝试总是会失败, 并返回相同的错误作为初始验证尝试的结果被抛出。

<a name="jvms-5.4.2"></a>
### 5.4.2. Preparation

*Preparation* involves creating the static fields for a class or interface and initializing such fields to their default values ([§2.3](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.3), [§2.4](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.4)). This does not require the execution of any Java Virtual Machine code; explicit initializers for static fields are executed as part of initialization ([§5.5](#jvms-5.5)), not preparation.

During preparation of a class or interface C, the Java Virtual Machine also imposes loading constraints ([§5.3.4](#jvms-5.3.4)):

1. Let `L1` be the defining loader of C. For each instance method `m` declared in C that can override ([§5.4.5](#jvms-5.4.5)) an instance method declared in a superclass or superinterface `<`D, `L2``>`, the Java Virtual Machine imposes loading constraints as follows.

   Given that the return type of `m` is Tr, and that the formal parameter types of `m` are Tf1, ..., Tfn:

   If Tr not an array type, let T0 be Tr; otherwise, let T0 be the element type of Tr.

   For *i* = 1 to *n*: If Tfi is not an array type, let Ti be Tfi; otherwise, let Ti be the element type of Tfi.

   Then Ti`L1` = Ti`L2` for *i* = 0 to *n*.

2. For each instance method `m` declared in a superinterface `<`I, `L3``>` of C, if C does not itself declare an instance method that can override `m`, then a method is selected ([§5.4.6](#jvms-5.4.6)) with respect to C and the method `m` in `<`I, `L3``>`. Let `<`D, `L2``>` be the class or interface that declares the selected method. The Java Virtual Machine imposes loading constraints as follows.

   Given that the return type of `m` is Tr, and that the formal parameter types of `m` are Tf1, ..., Tfn:

   If Tr not an array type, let T0 be Tr; otherwise, let T0 be the element type of Tr.

   For *i* = 1 to *n*: If Tfi is not an array type, let Ti be Tfi; otherwise, let Ti be the element type of Tfi.

   Then Ti`L2` = Ti`L3` for *i* = 0 to *n*.

Preparation may occur at any time following creation but must be completed prior to initialization.

### 5.4.2. 准备

*准备*涉及为类或接口创建静态字段并将这些字段初始化为其默认值（[§2.3](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.3)、[§2.4](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.4))。这不需要执行任何 Java 虚拟机代码；静态字段的显式初始化程序作为初始化的一部分执行（[§5.5](#jvms-5.5)）, 而不是准备。

在准备类或接口 C 期间, Java 虚拟机还施加了加载约束（[§5.3.4](#jvms-5.3.4)）:

1. 让 `L1` 成为 C 的定义加载器。对于在 C 中声明的每个实例方法 `m` 可以覆盖（[§5.4.5](#jvms-5.4.5)）在超类中声明的实例方法或超接口`<`D, `L2`>`, Java虚拟机施加如下加载约束。

   假设 `m` 的返回类型是 Tr, 并且 `m` 的形参类型是 Tf1, ..., Tfn:

   如果 Tr 不是数组类型, 则令 T0 为 Tr；否则, 令 T0 为 Tr 的元素类型。

   For *i* = 1 to *n*: 如果Tfi不是数组类型, 则令Ti为Tfi；否则, 令 Ti 为 Tfi 的元素类型。

   那么 Ti`L1` = Ti`L2` 对于 *i* = 0 到 *n*。

2.对于在C的超接口`<`I,`L3`>`中声明的每个实例方法`m`, 如果C本身没有声明可以覆盖`m`的实例方法, 则选择一个方法（[§5.4.6](#jvms-5.4.6)) 关于 C 和 `<`I, `L3`>` 中的方法 `m`。让 `<`D, `L2``>` 为声明所选方法的类或接口. Java 虚拟机施加如下加载约束。

   假设 `m` 的返回类型是 Tr, 并且 `m` 的形参类型是 Tf1, ..., Tfn:

   如果 Tr 不是数组类型, 则令 T0 为 Tr；否则, 令 T0 为 Tr 的元素类型。

   For *i* = 1 to *n*: 如果Tfi不是数组类型, 则令Ti为Tfi；否则, 令 Ti 为 Tfi 的元素类型。

   然后 Ti`L2` = Ti`L3` 对于 *i* = 0 到 *n*。

准备工作可以在创建后的任何时间进行, 但必须在初始化之前完成。



<a name="jvms-5.4.3"></a>
### 5.4.3. Resolution

Many Java Virtual Machine instructions - *anewarray*, *checkcast*, *getfield*, *getstatic*, *instanceof*, *invokedynamic*, *invokeinterface*, *invokespecial*, *invokestatic*, *invokevirtual*, *ldc*, *ldc_w*, *ldc2_w*, *multianewarray*, *new*, *putfield*, and *putstatic* - rely on symbolic references in the run-time constant pool. Execution of any of these instructions requires *resolution* of the symbolic reference.

Resolution is the process of dynamically determining one or more concrete values from a symbolic reference in the run-time constant pool. Initially, all symbolic references in the run-time constant pool are unresolved.

Resolution of an unresolved symbolic reference to (i) a class or interface, (ii) a field, (iii) a method, (iv) a method type, (v) a method handle, or (vi) a dynamically-computed constant, proceeds in accordance with the rules given in [§5.4.3.1](#jvms-5.4.3.1) through [§5.4.3.5](#jvms-5.4.3.5). In the first three of those sections, the class or interface in whose run-time constant pool the symbolic reference appears is labeled D. Then:

- If no error occurs during resolution of the symbolic reference, then resolution succeeds.

  Subsequent attempts to resolve the symbolic reference always succeed trivially and result in the same entity produced by the initial resolution. If the symbolic reference is to a dynamically-computed constant, the bootstrap method is not re-executed for these subsequent attempts.

- If an error occurs during resolution of the symbolic reference, then it is either (i) an instance of `IncompatibleClassChangeError` (or a subclass); (ii) an instance of `Error` (or a subclass) that arose from resolution or invocation of a bootstrap method; or (iii) an instance of `LinkageError` (or a subclass) that arose because class loading failed or a loader constraint was violated. The error must be thrown at a point in the program that (directly or indirectly) uses the symbolic reference.

  Subsequent attempts to resolve the symbolic reference always fail with the same error that was thrown as a result of the initial resolution attempt. If the symbolic reference is to a dynamically-computed constant, the bootstrap method is not re-executed for these subsequent attempts.

Because errors occurring on an initial attempt at resolution are thrown again on subsequent attempts, a class in one module that attempts to access, via resolution of a symbolic reference in its run-time constant pool, an unexported `public` type in a different module will always receive the same error indicating an inaccessible type ([§5.4.4](#jvms-5.4.4)), *even if the Java SE Platform API is used to dynamically export the `public` type's package at some time after the class's first attempt*.

Resolution of an unresolved symbolic reference to a dynamically-computed call site proceeds in accordance with the rules given in [§5.4.3.6](#jvms-5.4.3.6). Then:

- If no error occurs during resolution of the symbolic reference, then resolution succeeds *solely for the instruction in the `class` file that required resolution*. This instruction necessarily has an opcode of *invokedynamic*.

  Subsequent attempts to resolve the symbolic reference *by that instruction in the `class` file* always succeed trivially and result in the same entity produced by the initial resolution. The bootstrap method is not re-executed for these subsequent attempts.

  The symbolic reference is still unresolved for all other instructions in the `class` file, of any opcode, which indicate the same entry in the run-time constant pool as the *invokedynamic* instruction above.

- If an error occurs during resolution of the symbolic reference, then it is either (i) an instance of `IncompatibleClassChangeError` (or a subclass); (ii) an instance of `Error` (or a subclass) that arose from resolution or invocation of a bootstrap method; or (iii) an instance of `LinkageError` (or a subclass) that arose because class loading failed or a loader constraint was violated. The error must be thrown at a point in the program that (directly or indirectly) uses the symbolic reference.

  Subsequent attempts *by the same instruction in the `class` file* to resolve the symbolic reference always fail with the same error that was thrown as a result of the initial resolution attempt. The bootstrap method is not re-executed for these subsequent attempts.

  The symbolic reference is still unresolved for all other instructions in the `class` file, of any opcode, which indicate the same entry in the run-time constant pool as the *invokedynamic* instruction above.

Certain of the instructions above require additional linking checks when resolving symbolic references. For instance, in order for a *getfield* instruction to successfully resolve the symbolic reference to the field on which it operates, it must not only complete the field resolution steps given in [§5.4.3.2](#jvms-5.4.3.2) but also check that the field is not `static`. If it is a `static` field, a linking exception must be thrown.

Linking exceptions generated by checks that are specific to the execution of a particular Java Virtual Machine instruction are given in the description of that instruction and are not covered in this general discussion of resolution. Note that such exceptions, although described as part of the execution of Java Virtual Machine instructions rather than resolution, are still properly considered failures of resolution.

### 5.4.3. 解析度

许多 Java 虚拟机指令 - *anewarray*、*checkcast*、*getfield*、*getstatic*、*instanceof*、*invokedynamic*、*invokeinterface*、*invokespecial*、*invokestatic*、*invokevirtual*、*ldc*、 *ldc_w*、*ldc2_w*、*multianewarray*、*new*、*putfield* 和 *putstatic* - 依赖于运行时常量池中的符号引用。执行这些指令中的任何一个都需要符号引用的*解析*。

解析是从运行时常量池中的符号引用动态确定一个或多个具体值的过程。最初, 运行时常量池中的所有符号引用都未解析。

解析对 (i) 类或接口、(ii) 字段、(iii) 方法、(iv) 方法类型、(v) 方法句柄或 (vi) 动态计算常量的未解析符号引用, 按照 [§5.4.3.1](#jvms-5.4.3.1) 到 [§5.4.3.5](#jvms-5.4.3.5) 中给出的规则进行。在这些部分的前三个部分中, 符号引用出现在其运行时常量池中的类或接口标记为 D。然后:

- 如果在解析符号引用期间没有发生错误, 则解析成功。

  解析符号引用的后续尝试总是很成功, 并导致初始解析产生相同的实体。如果符号引用是对动态计算的常量, 则不会为这些后续尝试重新执行引导方法。

- 如果在解析符号引用期间发生错误, 则它是 (i) `IncompatibleClassChangeError` 的实例（或子类）； (ii) 由解决或调用引导方法引起的`错误`（或子类）实例；或 (iii) 由于类加载失败或违反加载器约束而出现的`LinkageError`（或子类）实例。错误必须在程序中（直接或间接）使用符号引用的地方抛出。

  解析符号引用的后续尝试总是失败, 并抛出与初始解析尝试相同的错误。如果符号引用是对动态计算的常量, 则不会为这些后续尝试重新执行引导方法。

因为在最初尝试解析时发生的错误会在后续尝试中再次抛出, 一个模块中的类试图通过解析其运行时常量池中的符号引用来访问另一个模块中未导出的`公共`类型将始终收到相同的错误, 指示不可访问的类型 ([§5.4.4](#jvms-5.4.4)), *即使 Java SE 平台 API 用于在之后的某个时间动态导出 `public` 类型的包班级的第一次尝试*。

根据 [§5.4.3.6](#jvms-5.4.3.6) 中给出的规则, 对动态计算的调用站点的未解析符号引用的解析进行。然后:

- 如果在解析符号引用期间没有发生错误, 则解析成功*仅针对需要解析的 `class` 文件中的指令*。该指令必须具有 *invokedynamic* 的操作码。

  随后尝试*通过`类`文件中的该指令*解析符号引用*总是成功并导致初始解析产生相同的实体。对于这些后续尝试, 不会重新执行引导方法。

  对于任何操作码的 `class` 文件中的所有其他指令, 符号引用仍未解析, 这些指令指示运行时常量池中的条目与上面的 *invokedynamic* 指令相同。

- 如果在解析符号引用期间发生错误, 则它是 (i) `IncompatibleClassChangeError` 的实例（或子类）； (ii) 由解决或调用引导方法引起的`错误`（或子类）实例；或 (iii) 由于类加载失败或违反加载器约束而出现的`LinkageError`（或子类）实例。错误必须在程序中（直接或间接）使用符号引用的地方抛出。

  后续尝试*通过 `class` 文件中的相同指令* 解析符号引用总是失败, 并出现与初始解析尝试相同的错误。对于这些后续尝试, 不会重新执行引导方法。

  对于任何操作码的 `class` 文件中的所有其他指令, 符号引用仍未解析, 这些指令指示运行时常量池中的条目与上面的 *invokedynamic* 指令相同。

在解析符号引用时, 上述某些说明需要额外的链接检查。例如, 为了让 *getfield* 指令成功解析对其操作的字段的符号引用, 它不仅必须完成 [§5.4.3.2](#jvms-5.4.3.2) 中给出的字段解析步骤但还要检查该字段是否不是`静态`。如果我



<a name="jvms-5.4.3.1"></a>
#### 5.4.3.1. Class and Interface Resolution

To resolve an unresolved symbolic reference from D to a class or interface C denoted by `N`, the following steps are performed:

1. The defining class loader of D is used to create a class or interface denoted by `N`. This class or interface is C. The details of the process are given in [§5.3](#jvms-5.3).

   Any exception that can be thrown as a result of failure of class or interface creation can thus be thrown as a result of failure of class and interface resolution.

2. If C is an array class and its element type is a `reference` type, then a symbolic reference to the class or interface representing the element type is resolved by invoking the algorithm in [§5.4.3.1](#jvms-5.4.3.1) recursively.

3. Finally, access control is applied for the access from D to C ([§5.4.4](#jvms-5.4.4)).

If steps 1 and 2 succeed but step 3 fails, C is still valid and usable. Nevertheless, resolution fails, and D is prohibited from accessing C.

#### 5.4.3.1. 类和接口解析

要将未解析的符号引用从 D 解析到由`N`表示的类或接口 C, 请执行以下步骤:

1. D 的定义类加载器用于创建一个用`N`表示的类或接口. 此类或接口是 C。过程的详细信息在 [§5.3](#jvms-5.3) 中给出。

    因此, 由于类或接口创建失败而抛出的任何异常都可能因类和接口解析失败而抛出。

2. 如果 C 是一个数组类并且它的元素类型是 `reference` 类型, 那么通过调用 [§5.4.3.1](#jvms-5.4.3.1) 递归。

3. 最后, 对从 D 到 C 的访问应用访问控制（[§5.4.4](#jvms-5.4.4)）。

如果步骤 1 和 2 成功但步骤 3 失败, 则 C 仍然有效且可用. 然而, 解析失败, D被禁止访问C。


<a name="jvms-5.4.3.2"></a>
#### 5.4.3.2. Field Resolution

To resolve an unresolved symbolic reference from D to a field in a class or interface C, the symbolic reference to C given by the field reference must first be resolved ([§5.4.3.1](#jvms-5.4.3.1)). Therefore, any exception that can be thrown as a result of failure of resolution of a class or interface reference can be thrown as a result of failure of field resolution. If the reference to C can be successfully resolved, an exception relating to the failure of resolution of the field reference itself can be thrown.

When resolving a field reference, field resolution first attempts to look up the referenced field in C and its superclasses:

1. If C declares a field with the name and descriptor specified by the field reference, field lookup succeeds. The declared field is the result of the field lookup.
2. Otherwise, field lookup is applied recursively to the direct superinterfaces of the specified class or interface C.
3. Otherwise, if C has a superclass S, field lookup is applied recursively to S.
4. Otherwise, field lookup fails.

#### 5.4.3.2. 场分辨率

要将未解析的符号引用从 D 解析到类或接口 C 中的字段, 必须首先解析由字段引用给出的对 C 的符号引用 ([§5.4.3.1](#jvms-5.4.3.1))。因此, 任何因类或接口引用解析失败而抛出的异常都可能因字段解析失败而抛出。如果可以成功解析对 C 的引用, 则可以抛出与字段引用本身解析失败有关的异常。

解析字段引用时, 字段解析首先尝试在 C 及其超类中查找引用的字段:

1. 如果 C 声明了一个字段引用指定的名称和描述符的字段, 则字段查找成功。声明的字段是字段查找的结果。
2. 否则, 字段查找将递归地应用于指定类或接口 C 的直接超接口。
3. 否则, 如果 C 具有超类 S, 则将字段查找递归地应用于 S。
4. 否则, 字段查找失败。


Then, the result of field resolution is determined:

- If field lookup failed, field resolution throws a `NoSuchFieldError`.

- Otherwise, field lookup succeeded. Access control is applied for the access from D to the field which is the result of field lookup ([§5.4.4](#jvms-5.4.4)). Then:

  - If access control failed, field resolution fails for the same reason.

  - Otherwise, access control succeeded. Loading constraints are imposed, as follows.

    Let `<`E, `L1``>` be the class or interface in which the referenced field is actually declared. Let `L2` be the defining loader of D. Given that the type of the referenced field is Tf: if Tf is not an array type, let T be Tf; otherwise, let T be the element type of Tf.

    The Java Virtual Machine imposes the loading constraint that T`L1` = T`L2`.

    If imposing this constraint results in any loading constraints being violated ([§5.3.4](#jvms-5.3.4)), then field resolution fails. Otherwise, field resolution succeeds.

然后, 确定场解析的结果:

- 如果字段查找失败, 字段解析会抛出`NoSuchFieldError`。

- 否则, 字段查找成功. 访问控制适用于从 D 访问作为字段查找结果的字段 ([§5.4.4](#jvms-5.4.4)). 然后:

   - 如果访问控制失败, 则字段解析因相同原因而失败。

   - 否则, 访问控制成功. 加载约束如下。

     让 `<`E, `L1``>` 为实际声明引用字段的类或接口. 令 L2 为 D 的定义加载器。假设引用字段的类型为 Tf: 如果 Tf 不是数组类型, 则令 T 为 Tf； 否则, 令 T 为 Tf 的元素类型。

     Java 虚拟机施加了 T`L1` = T`L2` 的加载约束。

     如果施加此约束导致违反任何加载约束 ([§5.3.4](#jvms-5.3.4)), 则字段解析失败. 否则, 字段解析成功。


<a name="jvms-5.4.3.3"></a>
#### 5.4.3.3. Method Resolution

To resolve an unresolved symbolic reference from D to a method in a class C, the symbolic reference to C given by the method reference is first resolved ([§5.4.3.1](#jvms-5.4.3.1)). Therefore, any exception that can be thrown as a result of failure of resolution of a class reference can be thrown as a result of failure of method resolution. If the reference to C can be successfully resolved, exceptions relating to the resolution of the method reference itself can be thrown.

When resolving a method reference:

1. If C is an interface, method resolution throws an `IncompatibleClassChangeError`.

2. Otherwise, method resolution attempts to locate the referenced method in C and its superclasses:

   - If C declares exactly one method with the name specified by the method reference, and the declaration is a signature polymorphic method ([§2.9.3](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.9.3)), then method lookup succeeds. All the class names mentioned in the descriptor are resolved ([§5.4.3.1](#jvms-5.4.3.1)).

     *The resolved method is the signature polymorphic method declaration.* It is not necessary for C to declare a method with the descriptor specified by the method reference.

   - Otherwise, if C declares a method with the name and descriptor specified by the method reference, method lookup succeeds.

   - Otherwise, if C has a superclass, step 2 of method resolution is recursively invoked on the direct superclass of C.

3. Otherwise, method resolution attempts to locate the referenced method in the superinterfaces of the specified class C:

   - If the *maximally-specific superinterface methods* of C for the name and descriptor specified by the method reference include exactly one method that does not have its `ACC_ABSTRACT` flag set, then this method is chosen and method lookup succeeds.
   - Otherwise, if any superinterface of C declares a method with the name and descriptor specified by the method reference that has neither its `ACC_PRIVATE` flag nor its `ACC_STATIC` flag set, one of these is arbitrarily chosen and method lookup succeeds.
   - Otherwise, method lookup fails.

A *maximally-specific superinterface method* of a class or interface C for a particular method name and descriptor is any method for which all of the following are true:

- The method is declared in a superinterface (direct or indirect) of C.
- The method is declared with the specified name and descriptor.
- The method has neither its `ACC_PRIVATE` flag nor its `ACC_STATIC` flag set.
- Where the method is declared in interface I, there exists no other maximally-specific superinterface method of C with the specified name and descriptor that is declared in a subinterface of I.

#### 5.4.3.3. 方法解析

要解析从 D 到类 C 中的方法的未解析符号引用, 首先解析由方法引用给出的对 C 的符号引用 ([§5.4.3.1](#jvms-5.4.3.1))。因此, 任何因类引用解析失败而抛出的异常都可能因方法解析失败而抛出。如果可以成功解析对 C 的引用, 则可以抛出与方法引用本身的解析相关的异常。

解析方法引用时:

1.如果C是接口, 方法解析会抛出`IncompatibleClassChangeError`。

2. 否则, 方法解析会尝试在 C 及其超类中定位引用的方法:

   - 如果 C 声明了一个方法引用指定的名称的方法, 并且声明是签名多态方法（[§2.9.3](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.9.3)), 则方法查找成功。描述符中提到的所有类名都已解析（[§5.4.3.1](#jvms-5.4.3.1)）。

     *resolved 方法是签名多态方法声明。* C 没有必要用方法引用指定的描述符声明方法。

   - 否则, 如果 C 用方法引用指定的名称和描述符声明方法, 则方法查找成功。

   - 否则, 如果 C 具有超类, 则在 C 的直接超类上递归调用方法解析的步骤 2。

3. 否则, 方法解析会尝试在指定类 C 的超接口中定位引用的方法:

   - 如果 C 的 *maximally-specific superinterface methods* 为方法引用指定的名称和描述符包含一个没有设置其 `ACC_ABSTRACT` 标志的方法, 则选择此方法并且方法查找成功。
   - 否则, 如果 C 的任何超接口声明了一个具有由方法引用指定的名称和描述符的方法, 该方法既没有设置 `ACC_PRIVATE` 标志也没有设置 `ACC_STATIC` 标志, 则任意选择其中一个并且方法查找成功。
   - 否则, 方法查找失败。

特定方法名称和描述符的类或接口 C 的*最大特定超接口方法*是满足以下所有条件的任何方法:

- 该方法在 C 的超接口（直接或间接）中声明。
- 使用指定的名称和描述符声明该方法。
- 该方法既没有设置`ACC_PRIVATE`标志, 也没有设置`ACC_STATIC`标志。
- 在接口 I 中声明该方法的情况下, 不存在具有在 I 的子接口中声明的指定名称和描述符的 C 的其他最大特定超接口方法。


The result of method resolution is determined as follows:

- If method lookup failed, method resolution throws a `NoSuchMethodError`.

- Otherwise, method lookup succeeded. Access control is applied for the access from D to the method which is the result of method lookup ([§5.4.4](#jvms-5.4.4)). Then:

  - If access control failed, method resolution fails for the same reason.

  - Otherwise, access control succeeded. Loading constraints are imposed, as follows.

    Let `<`E, `L1``>` be the class or interface in which the referenced method `m` is actually declared. Let `L2` be the defining loader of D. Given that the return type of `m` is Tr, and that the formal parameter types of `m` are Tf1, ..., Tfn:

    If Tr is not an array type, let T0 be Tr; otherwise, let T0 be the element type of Tr.

    For *i* = 1 to *n*: If Tfi is not an array type, let Ti be Tfi; otherwise, let Ti be the element type of Tfi.

    The Java Virtual Machine imposes the loading constraints Ti`L1` = Ti`L2` for *i* = 0 to *n*.

    If imposing these constraints results in any loading constraints being violated ([§5.3.4](#jvms-5.3.4)), then method resolution fails. Otherwise, method resolution succeeds.

When resolution searches for a method in the class's superinterfaces, the best outcome is to identify a maximally-specific non-`abstract` method. It is possible that this method will be chosen by method selection, so it is desirable to add class loader constraints for it.

Otherwise, the result is nondeterministic. This is not new: *The Java® Virtual Machine Specification* has never identified exactly which method is chosen, and how "ties" should be broken. Prior to Java SE 8, this was mostly an unobservable distinction. However, beginning with Java SE 8, the set of interface methods is more heterogenous, so care must be taken to avoid problems with nondeterministic behavior. Thus:

- Superinterface methods that are `private` and `static` are ignored by resolution. This is consistent with the Java programming language, where such interface methods are not inherited.
- Any behavior controlled by the resolved method should not depend on whether the method is `abstract` or not.

Note that if the result of resolution is an `abstract` method, the referenced class C may be non-`abstract`. Requiring C to be `abstract` would conflict with the nondeterministic choice of superinterface methods. Instead, resolution assumes that the run time class of the invoked object has a concrete implementation of the method.

方法解析的结果确定如下:

- 如果方法查找失败, 方法解析会抛出 `NoSuchMethodError`。

- 否则, 方法查找成功。访问控制适用于从 D 访问作为方法查找结果的方法 ([§5.4.4](#jvms-5.4.4))。然后:

  - 如果访问控制失败, 方法解析失败, 原因相同。

  - 否则, 访问控制成功。加载约束如下。

    让 `<`E, `L1`>` 为实际声明引用方法 `m` 的类或接口。让 `L2` 是 D 的定义加载器。假设 `m` 的返回类型是 Tr, 并且 `m` 的形参类型是 Tf1, ..., Tfn:

    如果 Tr 不是数组类型, 则令 T0 为 Tr；否则, 令 T0 为 Tr 的元素类型。

    For *i* = 1 to *n*: 如果Tfi不是数组类型, 则令Ti为Tfi；否则, 令 Ti 为 Tfi 的元素类型。

    Java 虚拟机对 *i* = 0 到 *n* 施加加载约束 Ti`L1` = Ti`L2`。

    如果施加这些约束导致违反任何加载约束 ([§5.3.4](#jvms-5.3.4)), 则方法解析失败。否则, 方法解析成功。

当解析在类的超接口中搜索方法时, 最好的结果是确定一个最大特定的非抽象方法。该方法可能会被方法选择所选择, 因此最好为其添加类加载器约束。

否则, 结果是不确定的。这并不新鲜: *Java® 虚拟机规范* 从未明确确定选择了哪种方法, 以及应该如何打破`联系`。在 Java SE 8 之前, 这主要是一种无法观察到的区别。但是, 从 Java SE 8 开始, 接口方法集更加异构, 因此必须注意避免出现不确定行为的问题。因此:

- `private` 和 `static` 的超接口方法被解析忽略。这与不继承此类接口方法的 Java 编程语言一致。
- 由已解析方法控制的任何行为不应取决于该方法是否为`抽象`。

请注意, 如果解析的结果是`抽象`方法, 则引用的类 C 可能不是`抽象`。要求 C 是`抽象的`会与超接口方法的非确定性选择相冲突。相反, 解析假定被调用对象的运行时类具有该方法的具体实现。


<a name="jvms-5.4.3.4"></a>
#### 5.4.3.4. Interface Method Resolution

To resolve an unresolved symbolic reference from D to an interface method in an interface C, the symbolic reference to C given by the interface method reference is first resolved ([§5.4.3.1](#jvms-5.4.3.1)). Therefore, any exception that can be thrown as a result of failure of resolution of an interface reference can be thrown as a result of failure of interface method resolution. If the reference to C can be successfully resolved, exceptions relating to the resolution of the interface method reference itself can be thrown.

When resolving an interface method reference:

1. If C is not an interface, interface method resolution throws an `IncompatibleClassChangeError`.
2. Otherwise, if C declares a method with the name and descriptor specified by the interface method reference, method lookup succeeds.
3. Otherwise, if the class `Object` declares a method with the name and descriptor specified by the interface method reference, which has its `ACC_PUBLIC` flag set and does not have its `ACC_STATIC` flag set, method lookup succeeds.
4. Otherwise, if the maximally-specific superinterface methods ([§5.4.3.3](#jvms-5.4.3.3)) of C for the name and descriptor specified by the method reference include exactly one method that does not have its `ACC_ABSTRACT` flag set, then this method is chosen and method lookup succeeds.
5. Otherwise, if any superinterface of C declares a method with the name and descriptor specified by the method reference that has neither its `ACC_PRIVATE` flag nor its `ACC_STATIC` flag set, one of these is arbitrarily chosen and method lookup succeeds.
6. Otherwise, method lookup fails.

#### 5.4.3.4. 接口方法解析

要将未解析的符号引用从 D 解析到接口 C 中的接口方法, 首先解析由接口方法引用给出的对 C 的符号引用 ([§5.4.3.1](#jvms-5.4.3.1))。因此, 任何因接口引用解析失败而抛出的异常都可能因接口方法解析失败而抛出。如果对 C 的引用可以成功解析, 则可以抛出与接口方法引用本身的解析相关的异常。

解析接口方法引用时:

1.如果C不是接口, 接口方法解析会抛出`IncompatibleClassChangeError`。
2.否则, 如果C用接口方法引用指定的名称和描述符声明了一个方法, 则方法查找成功。
3. 否则, 如果类 `Object` 声明了具有接口方法引用指定的名称和描述符的方法, 该方法设置了 `ACC_PUBLIC` 标志但没有设置 `ACC_STATIC` 标志, 则方法查找成功。
4. 否则, 如果 C 的最大特定超接口方法 ([§5.4.3.3](#jvms-5.4.3.3)) 用于方法引用指定的名称和描述符, 则恰好包含一个没有其 `ACC_ABSTRACT 的方法` 标志设置, 则选择此方法并且方法查找成功。
5. 否则, 如果 C 的任何超接口声明了一个名称和描述符由方法引用指定的方法, 该方法既没有设置 `ACC_PRIVATE` 标志也没有设置 `ACC_STATIC` 标志, 则任意选择其中一个并且方法查找成功。
6. 否则, 方法查找失败。

The result of interface method resolution is determined as follows:

- If method lookup failed, interface method resolution throws a `NoSuchMethodError`.

- Otherwise, method lookup succeeded. Access control is applied for the access from D to the method which is the result of method lookup ([§5.4.4](#jvms-5.4.4)). Then:

  - If access control failed, interface method resolution fails for the same reason.

  - Otherwise, access control succeeded. Loading constraints are imposed, as follows.

    Let `<`E, `L1``>` be the class or interface in which the referenced interface method `m` is actually declared. Let `L2` be the defining loader of D. Given that the return type of `m` is Tr, and that the formal parameter types of `m` are Tf1, ..., Tfn:

    If Tr is not an array type, let T0 be Tr; otherwise, let T0 be the element type of Tr.

    For *i* = 1 to *n*: If Tfi is not an array type, let Ti be Tfi; otherwise, let Ti be the element type of Tfi.

    The Java Virtual Machine imposes the loading constraints Ti`L1` = Ti`L2` for *i* = 0 to *n*.

    If imposing these constraints results in any loading constraints being violated ([§5.3.4](#jvms-5.3.4)), then interface method resolution fails. Otherwise, interface method resolution succeeds.

Access control is necessary because interface method resolution may pick a `private` method of interface C. (Prior to Java SE 8, the result of interface method resolution could be a non-`public` method of class `Object` or a `static` method of class `Object`; such results were not consistent with the inheritance model of the Java programming language, and are disallowed in Java SE 8 and above.)

接口方法解析的结果确定如下:

- 如果方法查找失败, 接口方法解析会抛出 `NoSuchMethodError`。

- 否则, 方法查找成功。访问控制适用于从 D 访问作为方法查找结果的方法 ([§5.4.4](#jvms-5.4.4))。然后:

  - 如果访问控制失败, 接口方法解析失败, 原因相同。

  - 否则, 访问控制成功。加载约束如下。

    让 `<`E, `L1``>` 是实际声明了引用的接口方法 `m` 的类或接口。让 `L2` 是 D 的定义加载器。假设 `m` 的返回类型是 Tr, 并且 `m` 的形参类型是 Tf1, ..., Tfn:

    如果 Tr 不是数组类型, 则令 T0 为 Tr；否则, 令 T0 为 Tr 的元素类型。

    For *i* = 1 to *n*: 如果Tfi不是数组类型, 则令Ti为Tfi；否则, 令 Ti 为 Tfi 的元素类型。

    Java 虚拟机对 *i* = 0 到 *n* 施加加载约束 Ti`L1` = Ti`L2`。

    如果施加这些约束导致违反任何加载约束（[§5.3.4](#jvms-5.3.4)）, 则接口方法解析失败。否则, 接口方法解析成功。

访问控制是必要的, 因为接口方法解析可能会选择接口 C 的`私有`方法。（在 Java SE 8 之前, 接口方法解析的结果可能是`Object`类的非`公共`方法或`静态`方法`Object` 类的方法；这样的结果与 Java 编程语言的继承模型不一致, 在 Java SE 8 及更高版本中是不允许的。）


<a name="jvms-5.4.3.5"></a>
#### 5.4.3.5. Method Type and Method Handle Resolution

To resolve an unresolved symbolic reference to a method type, it is as if resolution occurs of unresolved symbolic references to classes and interfaces ([§5.4.3.1](#jvms-5.4.3.1)) whose names correspond to the types given in the method descriptor ([§4.3.3](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.3.3)).

Any exception that can be thrown as a result of failure of resolution of a class reference can thus be thrown as a result of failure of method type resolution.

The result of successful method type resolution is a `reference` to an instance of `java.lang.invoke.MethodType` which represents the method descriptor.

Method type resolution occurs regardless of whether the run-time constant pool actually contains symbolic references to classes and interfaces indicated in the method descriptor. Also, the resolution is deemed to occur on *unresolved* symbolic references, so a failure to resolve one method type will not necessarily lead to a later failure to resolve another method type with the same textual method descriptor, if suitable classes and interfaces can be loaded by the later time.

Resolution of an unresolved symbolic reference to a method handle is more complicated. Each method handle resolved by the Java Virtual Machine has an equivalent instruction sequence called its *bytecode behavior*, indicated by the method handle's *kind*. The integer values and descriptions of the nine kinds of method handle are given in [Table 5.4.3.5-A](#jvms-5.4.3.5-220).

Symbolic references by an instruction sequence to fields or methods are indicated by `C.x:T`, where `x` and `T` are the name and descriptor ([§4.3.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.3.2), [§4.3.3](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.3.3)) of the field or method, and `C` is the class or interface in which the field or method is to be found.

#### 5.4.3.5. 方法类型和方法句柄解析

要解析对方法类型的未解析符号引用, 就好像解析对类和接口的未解析符号引用 ([§5.4.3.1](#jvms-5.4.3.1)), 其名称对应方法描述符（[§4.3.3](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.3.3)）。

因此, 由于类引用解析失败而抛出的任何异常都可能因方法类型解析失败而抛出。

成功的方法类型解析的结果是对表示方法描述符的 java.lang.invoke.MethodType 实例的`引用`。

无论运行时常量池是否实际包含对方法描述符中指示的类和接口的符号引用, 都会发生方法类型解析。此外, 该解析被视为发生在 *未解析* 符号引用上, 因此如果可以使用合适的类和接口, 则解析一种方法类型的失败不一定会导致稍后无法解析具有相同文本方法描述符的另一种方法类型稍后加载。

对方法句柄的未解析符号引用的解析更为复杂. Java虚拟机解析的每个方法句柄都有一个等效的指令序列, 称为它的*字节码行为*, 由方法句柄的*种类*指示。九种方法句柄的整数值和描述见[表5.4.3.5-A](#jvms-5.4.3.5-220)。

指令序列对字段或方法的符号引用由`C.x:T`指示, 其中`x`和`T`是名称和描述符（[§4.3.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.3.2), [§4.3.3](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.3.3)) 的字段或方法, 而 `C` 是要在其中找到字段或方法的类或接口。


**Table 5.4.3.5-A. Bytecode Behaviors for Method Handles**

| Kind | Description            | Interpretation                             |
| ---- | ---------------------- | ------------------------------------------ |
| 1    | `REF_getField`         | `getfield C.f:T`                           |
| 2    | `REF_getStatic`        | `getstatic C.f:T`                          |
| 3    | `REF_putField`         | `putfield C.f:T`                           |
| 4    | `REF_putStatic`        | `putstatic C.f:T`                          |
| 5    | `REF_invokeVirtual`    | `invokevirtual C.m:(A*)T`                  |
| 6    | `REF_invokeStatic`     | `invokestatic C.m:(A*)T`                   |
| 7    | `REF_invokeSpecial`    | `invokespecial C.m:(A*)T`                  |
| 8    | `REF_newInvokeSpecial` | `new C; dup; invokespecial C.<init>:(A*)V` |
| 9    | `REF_invokeInterface`  | `invokeinterface C.m:(A*)T`                |



Let `MH` be the symbolic reference to a method handle ([§5.1](#jvms-5.1)) being resolved. Also:

- Let R be the symbolic reference to the field or method contained within `MH`.

  R is derived from the `CONSTANT_Fieldref`, `CONSTANT_Methodref`, or `CONSTANT_InterfaceMethodref` structure referred to by the `reference_index` item of the `CONSTANT_MethodHandle` from which `MH` is derived.

  For example, R is a symbolic reference to C `.` `f` for bytecode behavior of kind 1, and a symbolic reference to C `.` `<init>` for bytecode behavior of kind 8.

  If `MH`'s bytecode behavior is kind 7 (`REF_invokeSpecial`), then C must be the current class or interface, a superclass of the current class, a direct superinterface of the current class or interface, or `Object`.

- Let T be the type of the field referenced by R, or the return type of the method referenced by R. Let A* be the sequence (perhaps empty) of parameter types of the method referenced by R.

  T and A* are derived from the `CONSTANT_NameAndType` structure referred to by the `name_and_type_index` item in the `CONSTANT_Fieldref`, `CONSTANT_Methodref`, or `CONSTANT_InterfaceMethodref` structure from which R is derived.

让 `MH` 是对正在解析的方法句柄 ([§5.1](#jvms-5.1)) 的符号引用。还:

- 令 R 为对 `MH` 中包含的字段或方法的符号引用。

  R 派生自 `CONSTANT_Fieldref`、`CONSTANT_Methodref` 或 `CONSTANT_InterfaceMethodref` 结构, 由 `MH` 派生的`CONSTANT_MethodHandle` 的`reference_index` 项引用。

  例如, R 是对 C `.` `f` 的符号引用, 用于第 1 类字节码行为, 对 C `.` `<init>` 进行符号引用, 用于第 8 类字节码行为。

  如果`MH`的字节码行为是种类7（`REF_invokeSpecial`）, 那么C必须是当前类或接口, 当前类的超类, 当前类或接口的直接超接口, 或`Object`。

- 令 T 为 R 引用的字段的类型, 或 R 引用的方法的返回类型。令 A* 为 R 引用的方法的参数类型的序列（可能为空）。

  T 和 A* 派生自 CONSTANT_NameAndType 结构, 由派生 R 的 `CONSTANT_Fieldref`、`CONSTANT_Methodref` 或 `CONSTANT_InterfaceMethodref` 结构中的 `name_and_type_index` 项引用。


To resolve `MH`, all symbolic references to classes, interfaces, fields, and methods in `MH`'s bytecode behavior are resolved, using the following four steps:

1. R is resolved. This occurs as if by field resolution ([§5.4.3.2](#jvms-5.4.3.2)) when `MH`'s bytecode behavior is kind 1, 2, 3, or 4, and as if by method resolution ([§5.4.3.3](#jvms-5.4.3.3)) when `MH`'s bytecode behavior is kind 5, 6, 7, or 8, and as if by interface method resolution ([§5.4.3.4](#jvms-5.4.3.4)) when `MH`'s bytecode behavior is kind 9.

2. The following constraints apply to the result of resolving R. These constraints correspond to those that would be enforced during verification or execution of the instruction sequence for the relevant bytecode behavior.

   - If `MH`'s bytecode behavior is kind 8 (`REF_newInvokeSpecial`), then R must resolve to an instance initialization method declared in class C.
   - If R resolves to a `protected` member, then the following rules apply depending on the kind of `MH`'s bytecode behavior:
     - For kinds 1, 3, and 5 (`REF_getField`, `REF_putField`, and `REF_invokeVirtual`): If `C.f` or `C.m` resolved to a `protected` field or method, and C is in a different run-time package than the current class, then C must be assignable to the current class.
     - For kind 8 (`REF_newInvokeSpecial`): If C `.` `<init>` resolved to a `protected` method, then C must be declared in the same run-time package as the current class.
   - R must resolve to a `static` or non-`static` member depending on the kind of `MH`'s bytecode behavior:
     - For kinds 1, 3, 5, 7, and 9 (`REF_getField`, `REF_putField`, `REF_invokeVirtual`, `REF_invokeSpecial`, and `REF_invokeInterface`): `C.f` or `C.m` must resolve to a non-`static` field or method.
     - For kinds 2, 4, and 6 (`REF_getStatic`, `REF_putStatic`, and `REF_invokeStatic`): `C.f` or `C.m` must resolve to a `static` field or method.

3. Resolution occurs as if of unresolved symbolic references to classes and interfaces whose names correspond to each type in A*, and to the type T, in that order.

4. A reference to an instance of `java.lang.invoke.MethodType` is obtained as if by resolution of an unresolved symbolic reference to a method type that contains the method descriptor specified in [Table 5.4.3.5-B](#jvms-5.4.3.5-250) for the kind of `MH`.

   It is as if the symbolic reference to a method handle contains a symbolic reference to the method type that the resolved method handle will eventually have. The detailed structure of the method type is obtained by inspecting [Table 5.4.3.5-B](#jvms-5.4.3.5-250).

要解析`MH`, 使用以下四个步骤来解析`MH`字节码行为中对类、接口、字段和方法的所有符号引用:

1. R 已解决。当 `MH` 的字节码行为是种类 1、2、3 或 4 时, 就好像通过字段解析 ([§5.4.3.2](#jvms-5.4.3.2)) 和方法解析 ([§5.4.3.3](#jvms-5.4.3.3)) 当 `MH` 的字节码行为是种类 5、6、7 或 8, 并且好像通过接口方法解析 ([§5.4.3.4](#jvms-5.4.3.4)) 当 `MH` 的字节码行为是 kind 9 时。

2. 以下约束适用于解析 R 的结果。这些约束对应于将在验证或执行相关字节码行为的指令序列期间强制执行的约束。

   - 如果 `MH` 的字节码行为是类型 8 (`REF_newInvokeSpecial`), 则 R 必须解析为 C 类中声明的实例初始化方法。
   - 如果 R 解析为 `protected` 成员, 则适用以下规则, 具体取决于 `MH` 字节码行为的类型:
     - 对于种类 1、3 和 5（`REF_getField`、`REF_putField` 和 `REF_invokeVirtual`）: 如果 `C.f` 或 `C.m` 解析为 `protected` 字段或方法, 并且 C 在不同的运行中-时间包比当前类, 那么C必须可分配给当前类。
     - 对于种类 8 (`REF_newInvokeSpecial`): 如果 C `.` `<init>` 解析为 `protected` 方法, 则 C 必须在与当前类相同的运行时包中声明。
   - R 必须根据 `MH` 的字节码行为类型解析为`static` 或非`static` 成员:
     - 对于种类 1、3、5、7 和 9（`REF_getField`、`REF_putField`、`REF_invokeVirtual`、`REF_invokeSpecial` 和 `REF_invokeInterface`）: `C.f` 或 `C.m` 必须解析为非` static` 字段或方法。
     - 对于类型 2、4 和 6（`REF_getStatic`、`REF_putStatic` 和 `REF_invokeStatic`）: `C.f` 或 `C.m` 必须解析为 `static` 字段或方法。

3. 解析就像对类和接口的未解析符号引用一样, 这些类和接口的名称对应于 A* 中的每个类型, 并按顺序对应于类型 T。

4. 对 `java.lang.invoke.MethodType` 实例的引用是通过解析对包含 [表 5.4.3.5-B] 中指定的方法描述符的方法类型的未解析符号引用获得的（#jvms-5.4.3.5-250) 用于 `MH` 的种类。

   就好像对方法句柄的符号引用包含对已解析方法句柄最终将具有的方法类型的符号引用。方法类型的详细结构通过查看[Table 5.4.3.5-B](#jvms-5.4.3.5-250)得到。



   **Table 5.4.3.5-B. Method Descriptors for Method Handles**

   | Kind | Description            | Method descriptor |
   | ---- | ---------------------- | ----------------- |
   | 1    | `REF_getField`         | `(C)T`            |
   | 2    | `REF_getStatic`        | `()T`             |
   | 3    | `REF_putField`         | `(C,T)V`          |
   | 4    | `REF_putStatic`        | `(T)V`            |
   | 5    | `REF_invokeVirtual`    | `(C,A*)T`         |
   | 6    | `REF_invokeStatic`     | `(A*)T`           |
   | 7    | `REF_invokeSpecial`    | `(C,A*)T`         |
   | 8    | `REF_newInvokeSpecial` | `(A*)C`           |
   | 9    | `REF_invokeInterface`  | `(C,A*)T`         |


In steps 1, 3, and 4, any exception that can be thrown as a result of failure of resolution of a symbolic reference to a class, interface, field, or method can be thrown as a result of failure of method handle resolution. In step 2, any failure due to the specified constraints causes a failure of method handle resolution due to an `IllegalAccessError`.

The intent is that resolving a method handle can be done in exactly the same circumstances that the Java Virtual Machine would successfully verify and resolve the symbolic references in the bytecode behavior. In particular, method handles to `private`, `protected`, and `static` members can be created in exactly those classes for which the corresponding normal accesses are legal.

The result of successful method handle resolution is a `reference` to an instance of `java.lang.invoke.MethodHandle` which represents the method handle `MH`.

The type descriptor of this `java.lang.invoke.MethodHandle` instance is the `java.lang.invoke.MethodType` instance produced in the third step of method handle resolution above.

The type descriptor of a method handle is such that a valid call to `invokeExact` in `java.lang.invoke.MethodHandle` on the method handle has exactly the same stack effects as the bytecode behavior. Calling this method handle on a valid set of arguments has exactly the same effect and returns the same result (if any) as the corresponding bytecode behavior.

If the method referenced by R has the `ACC_VARARGS` flag set ([§4.6](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.6)), then the `java.lang.invoke.MethodHandle` instance is a variable arity method handle; otherwise, it is a fixed arity method handle.

A variable arity method handle performs argument list boxing (JLS §15.12.4.2) when invoked via `invoke`, while its behavior with respect to `invokeExact` is as if the `ACC_VARARGS` flag were not set.

Method handle resolution throws an `IncompatibleClassChangeError` if the method referenced by R has the `ACC_VARARGS` flag set and either A* is an empty sequence or the last parameter type in A* is not an array type. That is, creation of a variable arity method handle fails.

An implementation of the Java Virtual Machine is not required to intern method types or method handles. That is, two distinct symbolic references to method types or method handles which are structurally identical might not resolve to the same instance of `java.lang.invoke.MethodType` or `java.lang.invoke.MethodHandle` respectively.

The `java.lang.invoke.MethodHandles` class in the Java SE Platform API allows creation of method handles with no bytecode behavior. Their behavior is defined by the method of `java.lang.invoke.MethodHandles` that creates them. For example, a method handle may, when invoked, first apply transformations to its argument values, then supply the transformed values to the invocation of another method handle, then apply a transformation to the value returned from that invocation, then return the transformed value as its own result.

在步骤 1、3 和 4 中, 由于对类、接口、字段或方法的符号引用解析失败而抛出的任何异常都可能因方法句柄解析失败而抛出。在第 2 步中, 由于指定约束导致的任何失败都会导致由于`IllegalAccessError`而导致方法句柄解析失败。

目的是解析方法句柄可以在 Java 虚拟机成功验证和解析字节码行为中的符号引用的完全相同的情况下完成。特别是, `private`、`protected`和`static`成员的方法句柄可以在相应的正常访问是合法的那些类中创建。

成功的方法句柄解析的结果是对代表方法句柄 MH 的 java.lang.invoke.MethodHandle 实例的引用。

这个java.lang.invoke.MethodHandle实例的类型描述符就是上面方法句柄解析第三步产生的java.lang.invoke.MethodType实例。

方法句柄的类型描述符使得对方法句柄上的 `java.lang.invoke.MethodHandle` 中的 `invokeExact` 的有效调用具有与字节码行为完全相同的堆栈效果。对一组有效的参数调用此方法句柄具有完全相同的效果, 并返回与相应字节码行为相同的结果（如果有）。

如果 R 引用的方法设置了 `ACC_VARARGS` 标志（[§4.6](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.6)） , 那么 `java.lang.invoke.MethodHandle` 实例是一个可变的 arity 方法句柄；否则, 它是一个固定的方法句柄。

变量 arity 方法句柄在通过`invoke`调用时执行参数列表装箱（JLS §15.12.4.2）, 而它相对于`invokeExact`的行为就像没有设置`ACC_VARARGS`标志一样。

如果 R 引用的方法设置了 `ACC_VARARGS` 标志并且 A* 是空序列或 A* 中的最后一个参数类型不是数组类型, 则方法句柄解析会抛出 `IncompatibleClassChangeError`。也就是说, 创建变量arity 方法句柄失败。

Java 虚拟机的实现不需要实习方法类型或方法句柄。也就是说, 对结构相同的方法类型或方法句柄的两个不同符号引用可能不会分别解析为相同的 java.lang.invoke.MethodType 或 java.lang.invoke.MethodHandle 实例。

Java SE Platform API 中的 `java.lang.invoke.MethodHandles` 类允许创建没有字节码行为的方法句柄。它们的行为由创建它们的 `java.lang.invoke.MethodHandles` 方法定义。例如, 一个方法句柄可以在被调用时首先对其参数值应用转换, 然后将转换后的值提供给另一个方法句柄的调用, 然后对从该调用返回的值应用转换, 然后将转换后的值返回为自己的结果。


<a name="jvms-5.4.3.6"></a>
#### 5.4.3.6. Dynamically-Computed Constant and Call Site Resolution

To resolve an unresolved symbolic reference R to a dynamically-computed constant or call site, there are three tasks. First, R is examined to determine which code will serve as its *bootstrap method*, and which arguments will be passed to that code. Second, the arguments are packaged into an array and the bootstrap method is invoked. Third, the result of the bootstrap method is validated, and used as the result of resolution.

The first task involves the following steps:

#### 5.4.3.6. 动态计算的常数和调用点分辨率

要将未解析的符号引用 R 解析为动态计算的常量或调用站点, 需要完成三个任务。首先, 检查 R 以确定哪些代码将用作其*引导方法*, 以及哪些参数将传递给该代码。其次, 将参数打包到一个数组中, 并调用 bootstrap 方法。第三, 对bootstrap方法的结果进行验证, 并作为解析的结果。

第一项任务涉及以下步骤:

1. R gives a symbolic reference to a *bootstrap method handle*. The bootstrap method handle is resolved ([§5.4.3.5](#jvms-5.4.3.5)) to obtain a `reference` to an instance of `java.lang.invoke.MethodHandle`.

   Any exception that can be thrown as a result of failure of resolution of a symbolic reference to a method handle can be thrown in this step.

   If R is a symbolic reference to a dynamically-computed constant, then let D be the type descriptor of the bootstrap method handle. (That is, D is a `reference` to an instance of `java.lang.invoke.MethodType`.) The first parameter type indicated by D must be `java.lang.invoke.MethodHandles.Lookup`, or else resolution fails with a `BootstrapMethodError`. For historical reasons, the bootstrap method handle for a dynamically-computed call site is not similarly constrained.

2. If R is a symbolic reference to a dynamically-computed constant, then it gives a field descriptor.

   If the field descriptor indicates a primitive type, then a `reference` to the pre-defined `Class` object representing that type is obtained (see the method `isPrimitive` in class `Class`).

   Otherwise, the field descriptor indicates a class or interface type, or an array type. A `reference` to the `Class` object representing the type indicated by the field descriptor is obtained, as if by resolution of an unresolved symbolic reference to a class or interface ([§5.4.3.1](#jvms-5.4.3.1)) whose name corresponds to the type indicated by the field descriptor.

   Any exception that can be thrown as a result of failure of resolution of a symbolic reference to a class or interface can be thrown in this step.



1. R 给出了一个*引导方法句柄*的符号引用。引导方法句柄被解析 ([§5.4.3.5](#jvms-5.4.3.5)) 以获得对 `java.lang.invoke.MethodHandle` 实例的`reference`。

   任何由于方法句柄的符号引用解析失败而抛出的异常都可以在此步骤中抛出。

   如果 R 是对动态计算常量的符号引用, 则令 D 为引导方法句柄的类型描述符. （也就是说, D 是对 `java.lang.invoke.MethodType` 实例的`reference`。） D 指示的第一个参数类型必须是 `java.lang.invoke.MethodHandles.Lookup`, 否则解析失败带有`BootstrapMethodError`。由于历史原因, 动态计算调用站点的引导方法句柄没有类似的约束。

2. 如果 R 是对动态计算常量的符号引用, 则它给出一个字段描述符。

   如果字段描述符指示原始类型, 则获得对表示该类型的预定义`Class`对象的`引用`（参见类`Class`中的`isPrimitive`方法）。

   否则, 字段描述符指示类或接口类型, 或数组类型。获得对表示字段描述符指示的类型的`Class`对象的`引用`, 就像通过解析对类或接口的未解析符号引用一样（[§5.4.3.1](#jvms-5.4.3.1) ), 其名称对应于字段描述符所指示的类型。

   由于对类或接口的符号引用解析失败而抛出的任何异常都可以在此步骤中抛出。

3. If R is a symbolic reference to a dynamically-computed call site, then it gives a method descriptor.

   A `reference` to an instance of `java.lang.invoke.MethodType` is obtained, as if by resolution of an unresolved symbolic reference to a method type ([§5.4.3.5](#jvms-5.4.3.5)) with the same parameter and return types as the method descriptor.

   Any exception that can be thrown as a result of failure of resolution of a symbolic reference to a method type can be thrown in this step.

3. 如果 R 是对动态计算调用站点的符号引用, 则它给出方法描述符。

    获得了对`java.lang.invoke.MethodType`实例的`引用`, 就好像通过解析对方法类型的未解析符号引用（[§5.4.3.5](#jvms-5.4.3.5)） 与方法描述符相同的参数和返回类型。

    由于无法解析对方法类型的符号引用而抛出的任何异常都可以在此步骤中抛出。

4. R gives zero or more *static arguments*, which communicate application-specific metadata to the bootstrap method. Each static argument A is resolved, in the order given by R, as follows:

   - If A is a string constant, then a `reference` to its instance of class `String` is obtained.
   - If A is a numeric constant, then a `reference` to an instance of `java.lang.invoke.MethodHandle` is obtained by the following procedure:
     1. Let `v` be the value of the numeric constant, and let T be a field descriptor which corresponds to the type of the numeric constant.
     2. Let `MH` be a method handle produced as if by invocation of the `identity` method of `java.lang.invoke.MethodHandles` with an argument representing the class `Object`.
     3. A `reference` to an instance of `java.lang.invoke.MethodHandle` is obtained as if by the invocation `MH.invoke(v)` with method descriptor `(T)Ljava/lang/Object;`.
   - If A is a symbolic reference to a dynamically-computed constant with a field descriptor indicating a primitive type T, then A is resolved, producing a primitive value `v`. Given `v` and T, a `reference` is obtained to an instance of `java.lang.invoke.MethodHandle` according to the procedure specified above for numeric constants.
   - If A is any other kind of symbolic reference, then the result is the result of resolving A.

   Among the symbolic references in the run-time constant pool, symbolic references to dynamically-computed constants are special because they are derived from `constant_pool` entries that can syntactically refer to themselves via the `BootstrapMethods` attribute ([§4.7.23](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.7.23)). However, the Java Virtual Machine does not support resolving a symbolic reference to a dynamically-computed constant that depends on itself (that is, as a static argument to its own bootstrap method). Accordingly, when both R and A are symbolic references to dynamically-computed constants, if A is the same as R or A gives a static argument that (directly or indirectly) references R, then resolution fails with a `StackOverflowError` at the point where re-resolution of R would be required.

   Unlike class initialization ([§5.5](#jvms-5.5)), where cycles are allowed between uninitialized classes, resolution does not allow cycles in symbolic references to dynamically-computed constants. If an implementation of resolution makes recursive use of a stack, then a `StackOverflowError` will occur naturally. If not, the implementation is required to detect the cycle rather than, say, looping infinitely or returning a default value for the dynamically-computed constant.

   A similar cycle may arise if the body of a bootstrap method makes reference to a dynamically-computed constant currently being resolved. This has always been possible for *invokedynamic* bootstraps, and does not require special treatment in resolution; the recursive `invokeWithArguments` calls will naturally lead to a `StackOverflowError`.

   Any exception that can be thrown as a result of failure of resolution of a symbolic reference can be thrown in this step.

4. R 给出零个或多个*静态参数*, 它们将特定于应用程序的元数据传递给引导方法。每个静态参数 A 都按照 R 给出的顺序解析, 如下所示:

   - 如果 A 是字符串常量, 则获取到其类 `String` 实例的`reference`。
   - 如果 A 是数字常量, 则通过以下过程获得对 `java.lang.invoke.MethodHandle` 实例的`reference`:
     1.设`v`为数值常量的值, 设T为对应于数值常量类型的字段描述符。
     2. 让`MH` 是一个方法句柄, 就好像通过调用`java.lang.invoke.MethodHandles` 的`identity` 方法和代表`Object` 类的参数一样。
     3. 对`java.lang.invoke.MethodHandle`实例的`引用`是通过使用方法描述符`(T)Ljava/lang/Object;`调用`MH.invoke(v)`获得的。
   - 如果 A 是对动态计算常量的符号引用, 其字段描述符指示原始类型 T, 则解析 A, 生成原始值`v`。给定 `v` 和 T, 根据上面为数字常量指定的过程, 获得对 `java.lang.invoke.MethodHandle` 实例的`reference`。
   - 如果 A 是任何其他类型的符号引用, 则结果是解析 A 的结果。

   在运行时常量池中的符号引用中, 对动态计算常量的符号引用是特殊的, 因为它们派生自 `constant_pool` 条目, 这些条目可以通过 `BootstrapMethods` 属性在语法上引用它们自己（[§4.7.23]（ https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.7.23))。但是, Java 虚拟机不支持解析对依赖于自身的动态计算常量的符号引用（即, 作为其自身引导方法的静态参数）。因此, 当 R 和 A 都是对动态计算常量的符号引用时, 如果 A 与 R 相同, 或者 A 给出（直接或间接）引用 R 的静态参数, 则解析失败并在该点处出现`StackOverflowError`需要重新解析 R。

   与类初始化 ([§5.5](#jvms-5.5)) 不同, 在未初始化的类之间允许循环, 解析不允许符号引用动态计算常量的循环。如果解决方案的实现递归使用堆栈, 则自然会发生`StackOverflowError`。如果不是, 则需要实现来检测循环, 而不是无限循环或返回动态计算常量的默认值。

   如果引导方法的主体引用当前正在解析的动态计算常量, 则可能会出现类似的循环。对于 *invokedynamic* 引导程序, 这一直是可能的, 并且不需要在解析中进行特殊处理；递归的 `invokeWithArguments` 调用自然会导致 `StackOverflowError`。

   由于符号引用解析失败而抛出的任何异常都可以在此步骤中抛出。

The second task, to invoke the bootstrap method handle, involves the following steps:

1. An array is allocated with component type `Object` and length *n*+3, where *n* is the number of static arguments given by R (*n* ≥ 0).

   The zeroth component of the array is set to a `reference` to an instance of `java.lang.invoke.MethodHandles.Lookup` for the class in which R occurs, produced as if by invocation of the `lookup` method of `java.lang.invoke.MethodHandles`.

   The first component of the array is set to a `reference` to an instance of `String` that denotes `N`, the unqualified name given by R.

   The second component of the array is set to the `reference` to an instance of `Class` or `java.lang.invoke.MethodType` that was obtained earlier for the field descriptor or method descriptor given by R.

   Subsequent components of the array are set to the `reference`s that were obtained earlier from resolving R's static arguments, if any. The `reference`s appear in the array in the same order as the corresponding static arguments are given by R.

   A Java Virtual Machine implementation may be able to skip allocation of the array and, without any change in observable behavior, pass the arguments directly to the bootstrap method.

2. The bootstrap method handle is invoked, as if by the invocation `BMH.invokeWithArguments(args)`, where `BMH` is the bootstrap method handle and `args` is the array allocated above.

   Due to the behavior of the `invokeWithArguments` method of `java.lang.invoke.MethodHandle`, the type descriptor of the bootstrap method handle need not exactly match the run-time types of the arguments. For example, the second parameter type of the bootstrap method handle (corresponding to the unqualified name given in the first component of the array above) could be `Object` instead of `String`. If the bootstrap method handle is variable arity, then some or all of the arguments may be collected into a trailing array parameter.

   The invocation occurs within a thread that is attempting resolution of this symbolic reference. If there are several such threads, the bootstrap method handle may be invoked concurrently. Bootstrap methods which access global application data should take the usual precautions against race conditions.

   If the invocation fails by throwing an instance of `Error` or a subclass of `Error`, resolution fails with that exception.

   If the invocation fails by throwing an exception that is not an instance of `Error` or a subclass of `Error`, resolution fails with a `BootstrapMethodError` whose cause is the thrown exception.

   If several threads concurrently invoke the bootstrap method handle for this symbolic reference, the Java Virtual Machine chooses the result of one invocation and installs it visibly to all threads. Any other bootstrap methods executing for this symbolic reference are allowed to complete, but their results are ignored.

第二个任务, 调用引导方法句柄, 包括以下步骤:

1. 分配一个数组, 其组件类型为 `Object`, 长度为 *n*+3, 其中 *n* 是 R 给出的静态参数的数量（*n* ≥ 0）。

   数组的第零部分设置为对出现 R 的类的 java.lang.invoke.MethodHandles.Lookup 实例的`引用`, 就像调用 java 的`lookup`方法一样.lang.invoke.MethodHandles`。

   数组的第一个组件被设置为一个 `reference` 到一个 `String` 的实例, 它表示 `N`, R 给出的非限定名称。

   数组的第二个组件设置为对 R 给出的字段描述符或方法描述符先前获得的 Class 或 java.lang.invoke.MethodType 实例的引用。

   数组的后续组件设置为之前从解析 R 的静态参数（如果有）中获得的`引用`. `reference` 出现在数组中的顺序与 R 给出的相应静态参数的顺序相同。

   Java 虚拟机实现可能能够跳过数组的分配, 并且在不改变可观察行为的情况下, 将参数直接传递给引导方法。

2. 调用引导方法句柄, 就像调用`BMH.invokeWithArguments(args)`, 其中`BMH`是引导方法句柄, `args`是上面分配的数组。

   由于 `java.lang.invoke.MethodHandle` 的 `invokeWithArguments` 方法的行为, 引导方法句柄的类型描述符不需要与参数的运行时类型完全匹配。例如, 引导方法句柄的第二个参数类型（对应于上面数组的第一个组件中给出的非限定名称）可以是`Object`而不是`String`。如果引导方法句柄是可变参数, 则可以将部分或全部参数收集到尾随数组参数中。

   调用发生在尝试解析此符号引用的线程中。如果有多个这样的线程, 则可以同时调用引导方法句柄。访问全局应用程序数据的引导方法应该对竞争条件采取通常的预防措施。

   如果调用因抛出 `Error` 的实例或 `Error` 的子类而失败, 则解析失败并出现该异常。

   如果调用因抛出不是`Error`实例或`Error`子类的异常而失败, 则解析失败并出现`BootstrapMethodError`, 其原因是抛出的异常。

   如果多个线程同时调用此符号引用的引导方法句柄, Java 虚拟机将选择一次调用的结果并将其安装到所有线程可见。允许为此符号引用执行的任何其他引导方法完成, 但它们的结果将被忽略。

The third task, to validate the `reference`, `o`, produced by invocation of the bootstrap method handle, is as follows:

- If R is a symbolic reference to a dynamically-computed constant, then `o` is converted to type T, the type indicated by the field descriptor given by R.

  `o`'s conversion occurs as if by the invocation `MH.invoke(o)` with method descriptor `(Ljava/lang/Object;)T`, where `MH` is a method handle produced as if by invocation of the `identity` method of `java.lang.invoke.MethodHandles` with an argument representing the class `Object`.

  The result of `o`'s conversion is the result of resolution.

  If the conversion fails by throwing a `NullPointerException` or a `ClassCastException`, resolution fails with a `BootstrapMethodError`.

- If R is a symbolic reference to a dynamically-computed call site, then `o` is the result of resolution if it has all of the following properties:

  - `o` is not `null`.
  - `o` is an instance of `java.lang.invoke.CallSite` or a subclass of `java.lang.invoke.CallSite`.
  - The type of the `java.lang.invoke.CallSite` is semantically equal to the method descriptor given by R.

  If `o` does not have these properties, resolution fails with a `BootstrapMethodError`.

第三个任务, 验证通过调用引导方法句柄产生的`reference`, `o`, 如下所示:

- 如果 R 是对动态计算常量的符号引用, 则 `o` 转换为类型 T, 由 R 给出的字段描述符指示的类型。

  `o` 的转换就像通过使用方法描述符`(Ljava/lang/Object;)T` 调用`MH.invoke(o)` 发生, 其中`MH` 是一个方法句柄, 好像通过调用`java.lang.invoke.MethodHandles` 的`identity` 方法, 其参数表示`Object` 类。

  `o` 的转换结果是解析的结果。

  如果转换因抛出`NullPointerException`或`ClassCastException`而失败, 则解析失败并出现`BootstrapMethodError`。

- 如果 R 是对动态计算调用站点的符号引用, 那么如果它具有以下所有属性, 则 `o` 是解析的结果:

  - `o` 不是 `null`。
  - `o` 是 `java.lang.invoke.CallSite` 的实例或 `java.lang.invoke.CallSite` 的子类。
  - `java.lang.invoke.CallSite` 的类型在语义上等于 R 给出的方法描述符。

  如果 `o` 没有这些属性, 则解析失败并出现 `BootstrapMethodError`。

Many of the steps above perform computations "as if by invocation" of certain methods. In each case, the invocation behavior is given in detail by the specifications for *invokestatic* and *invokevirtual*. The invocation occurs in the thread and from the class that is attempting resolution of the symbolic reference R. However, no corresponding method references are required to appear in the run-time constant pool, no particular method's operand stack is necessarily used, and the value of the `max_stack` item of any method's `Code` attribute is not enforced for the invocation.

If several threads attempt resolution of R at the same time, the bootstrap method may be invoked concurrently. Therefore, bootstrap methods which access global application data must take precautions against race conditions.

上面的许多步骤`好像通过调用`某些方法执行计算. 在每种情况下, 调用行为由 *invokestatic* 和 *invokevirtual* 的规范详细给出. 调用发生在线程中, 并且来自尝试解析符号引用 R 的类。但是, 运行时常量池中不需要出现相应的方法引用, 也不需要使用特定方法的操作数堆栈, 并且值 任何方法的 `Code` 属性的 `max_stack` 项的调用都不会被强制执行。

如果多个线程同时尝试解析 R, 则可能会同时调用引导方法. 因此, 访问全局应用程序数据的引导方法必须对竞争条件采取预防措施。


<a name="jvms-5.4.4"></a>
### 5.4.4. Access Control

Access control is applied during resolution ([§5.4.3](#jvms-5.4.3)) to ensure that a reference to a class, interface, field, or method is permitted. Access control succeeds if a specified class, interface, field, or method is *accessible* to the referring class or interface.

A class or interface C is accessible to a class or interface D if and only if one of the following is true:

- C is `public`, and a member of the same run-time module as D ([§5.3.6](#jvms-5.3.6)).
- C is `public`, and a member of a different run-time module than D, and C's run-time module is read by D's run-time module, and C's run-time module exports C's run-time package to D's run-time module.
- C is not `public`, and C and D are members of the same run-time package.

### 5.4.4. 访问控制

在解析期间应用访问控制 ([§5.4.3](#jvms-5.4.3)) 以确保允许对类、接口、字段或方法的引用. 如果指定的类、接口、字段或方法对引用的类或接口*可访问*, 则访问控制成功。

当且仅当满足以下条件之一时, 类或接口 D 才能访问类或接口 C:

- C 是`公共`, 并且是与 D 相同的运行时模块的成员（[§5.3.6](#jvms-5.3.6)）。
- C是`public`, 并且是与D不同的运行时模块的成员, 并且C的运行时模块被D的运行时模块读取, 并且C的运行时模块将C的运行时包导出到D的运行 -时间模块。
- C 不是 `public`, 并且 C 和 D 是同一个运行时包的成员。


If C is not accessible to D, access control throws an `IllegalAccessError`. Otherwise, access control succeeds.

A field or method R is accessible to a class or interface D if and only if any of the following is true:

- R is `public`.

- R is `protected` and is declared in a class C, and D is either a subclass of C or C itself.

  Furthermore, if R is not `static`, then the symbolic reference to R must contain a symbolic reference to a class T, such that T is either a subclass of D, a superclass of D, or D itself.

  During verification of D, it was required that, even if T is a superclass of D, the target reference of a `protected` field access or method invocation must be an instance of D or a subclass of D ([§4.10.1.8](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.10.1.8)).

- R is either `protected` or has default access (that is, neither `public` nor `protected` nor `private`), and is declared by a class in the same run-time package as D.

- R is `private` and is declared by a class or interface C that belongs to the same nest as D, according to the nestmate test below.

如果 D 无法访问 C, 则访问控制会抛出`IllegalAccessError`。否则, 访问控制成功。

当且仅当满足以下任一条件时, 类或接口 D 才能访问字段或方法 R:

- R 是`公共`。

- R 是`受保护的`并在 C 类中声明, 而 D 是 C 的子类或 C 本身。

  此外, 如果 R 不是`静态的`, 那么对 R 的符号引用必须包含对类 T 的符号引用, 这样 T 要么是 D 的子类, 要么是 D 的超类, 要么是 D 本身。

  在验证 D 期间, 即使 T 是 D 的超类, `受保护`字段访问或方法调用的目标引用也必须是 D 的实例或 D 的子类（[§4.10.1.8] （https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.10.1.8））。

- R 要么是`受保护`, 要么具有默认访问权限（即, 既不是`公共`也不是`受保护`或`私有`）, 并且由与 D 相同的运行时包中的类声明。

- R 是`私有的`, 由与 D 属于同一嵌套的类或接口 C 声明, 根据下面的嵌套测试。


If R is not accessible to D, then:

- If R is `public`, `protected`, or has default access, then access control throws an `IllegalAccessError`.
- If R is `private`, then the nestmate test failed, and access control fails for the same reason.

Otherwise, access control succeeds.

A *nest* is a set of classes and interfaces that allow mutual access to their `private` members. One of the classes or interfaces is the *nest host*. It enumerates the classes and interfaces which belong to the nest, using the `NestMembers` attribute ([§4.7.29](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.7.29)). Each of them in turn designates it as the nest host, using the `NestHost` attribute ([§4.7.28](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.7.28)). A class or interface which lacks a `NestHost` attribute belongs to the nest hosted by itself; if it also lacks a `NestMembers` attribute, this nest is a singleton consisting only of the class or interface itself.

如果 D 无法访问 R, 则:

- 如果 R 是 `public`、`protected` 或具有默认访问权限, 则访问控制会抛出 `IllegalAccessError`。
- 如果 R 是`private`, 则nestmate 测试失败, 并且访问控制由于同样的原因而失败。

否则, 访问控制成功。

*nest* 是一组允许相互访问其`私有`成员的类和接口。类或接口之一是*嵌套主机*。它使用`NestMembers`属性（[§4.7.29](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.7.29))。它们中的每一个依次使用 `NestHost` 属性将其指定为嵌套主机（[§4.7.28](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.7.28))。缺少`NestHost`属性的类或接口属于自己托管的嵌套；如果它还缺少`NestMembers`属性, 则该嵌套是仅由类或接口本身组成的单例。



To determine whether a class or interface C belongs to the same nest as a class or interface D, the *nestmate test* is applied. C and D belong to the same nest if and only if the nestmate test succeeds. The nestmate test is as follows:

- If C and D are the same class or interface, then the nestmate test succeeds.
- Otherwise, the following steps are performed, in order:
  1. The nest host of D, H, is determined (below). If an exception is thrown, then the nestmate test fails for the same reason.
  2. The nest host of C, H', is determined (below). If an exception is thrown, then the nestmate test fails for the same reason.
  3. H and H' are compared. If H and H' are the same class or interface, then the nestmate test succeeds. Otherwise, the nestmate test fails by throwing an `IllegalAccessError`.

为了确定类或接口 C 是否与类或接口 D 属于同一个嵌套, 应用 *nestmate test*. C 和 D 属于同一个巢当且仅当巢友测试成功. 巢友测试如下:

- 如果 C 和 D 是相同的类或接口, 则nestmate 测试成功。
- 否则, 按顺序执行以下步骤:
   1、确定D、H的巢宿主（下）. 如果抛出异常, 则由于同样的原因, nestmate 测试会失败。
   2. 确定C, H'的巢宿主（下）. 如果抛出异常, 则由于同样的原因, nestmate 测试会失败。
   3. 比较 H 和 H'. 如果 H 和 H' 是相同的类或接口, 则 nestmate 测试成功. 否则, nestmate 测试会因抛出`IllegalAccessError`而失败。


The nest host of a class or interface `M` is determined as follows:

- If `M` lacks a `NestHost` attribute, then `M` is its own nest host.

- Otherwise, `M` has a `NestHost` attribute, and its `host_class_index` item is used as an index into the run-time constant pool of `M`. The symbolic reference at that index is resolved to a class or interface H ([§5.4.3.1](#jvms-5.4.3.1)).

  During resolution of this symbolic reference, any of the exceptions pertaining to class or interface resolution can be thrown. Otherwise, resolution of H succeeds.

  If any of the following is true, an `IncompatibleClassChangeError` is thrown:

  - H is not in the same run-time package as `M`.
  - H lacks a `NestMembers` attribute.
  - H has a `NestMembers` attribute, but there is no entry in its `classes` array that refers to a class or interface with the name `N`, where `N` is the name of `M`.

  Otherwise, H is the nest host of `M`.

类或接口`M`的嵌套宿主确定如下:

- 如果 `M` 缺少 `NestHost` 属性, 则 `M` 是它自己的嵌套主机。

- 否则, `M` 具有`NestHost` 属性, 并且它的`host_class_index` 项用作`M` 的运行时常量池的索引. 该索引处的符号引用被解析为类或接口 H ([§5.4.3.1](#jvms-5.4.3.1))。

   在解析此符号引用期间, 可以抛出与类或接口解析有关的任何异常. 否则, H 的解析成功。

   如果以下任何一项为真, 则会抛出`IncompatibleClassChangeError`:

   - H 与 `M` 不在同一个运行时包中。
   - H 缺少`NestMembers`属性。
   - H 有一个 `NestMembers` 属性, 但它的 `classes` 数组中没有条目引用名为 `N` 的类或接口, 其中 `N` 是 `M` 的名称。

   否则, H 是 `M` 的嵌套宿主。


<a name="jvms-5.4.5"></a>
### 5.4.5. Method Overriding

An instance method `mC` *can override* another instance method `mA` iff all of the following are true:

- `mC` has the same name and descriptor as `mA`.
- `mC` is not marked `ACC_PRIVATE`.
- One of the following is true:
  - `mA` is marked `ACC_PUBLIC`.
  - `mA` is marked `ACC_PROTECTED`.
  - `mA` is marked neither `ACC_PUBLIC` nor `ACC_PROTECTED` nor `ACC_PRIVATE`, and either (a) the declaration of `mA` appears in the same run-time package as the declaration of `mC`, or (b) if `mA` is declared in a class A and `mC` is declared in a class C, then there exists a method `mB` declared in a class B such that C is a subclass of B and B is a subclass of A and `mC` can override `mB` and `mB` can override `mA`.

Part (b) of the final case allows for "transitive overriding" of methods with default access. For example, given the following class declarations in a package P:

### 5.4.5. 方法覆盖

如果满足以下所有条件, 则实例方法 `mC` *可以覆盖*另一个实例方法 `mA`:

- `mC` 与 `mA` 具有相同的名称和描述符。
- `mC` 未标记为 `ACC_PRIVATE`。
- 以下其中一项为真:
   - `mA` 标记为 `ACC_PUBLIC`。
   - `mA` 标记为 `ACC_PROTECTED`。
   - `mA` 既没有标记为 `ACC_PUBLIC` 也没有 `ACC_PROTECTED` 也没有 `ACC_PRIVATE`, 并且要么 (a) `mA` 的声明出现在与 `mC` 的声明相同的运行时包中, 或者 (b) 如果在 A 类中声明了`mA`, 在 C 类中声明了`mC`, 则在 B 类中声明了一个`mB`方法, 使得 C 是 B 的子类, B 是 A 的子类, 并且 `mC` 可以覆盖 `mB` 并且 `mB` 可以覆盖 `mA`。

最后一种情况的 (b) 部分允许`传递覆盖`具有默认访问权限的方法. 例如, 给定包 P 中的以下类声明:

```
public class A           {        void m() {} }
public class B extends A { public void m() {} }
public class C extends B {        void m() {} }
```

and the following class declaration in a different package:

以及不同包中的以下类声明:

```
public class D extends P.C { void m() {} }
```

then:

- `B.m` can override `A.m`.
- `C.m` can override `B.m` and `A.m`.
- `D.m` can override `B.m` and, transitively, `A.m`, but it cannot override `C.m`.

然后:

- `B.m` 可以覆盖 `A.m`。
- `C.m` 可以覆盖 `B.m` 和 `A.m`。
- `D.m` 可以覆盖 `B.m` 和传递性的 `A.m`, 但它不能覆盖 `C.m`。


<a name="jvms-5.4.6"></a>
### 5.4.6. Method Selection

During execution of an *invokeinterface* or *invokevirtual* instruction, a method is *selected* with respect to (i) the run-time type of the object on the stack, and (ii) a method that was previously *resolved* by the instruction. The rules to select a method with respect to a class or interface C and a method `mR` are as follows:

1. If `mR` is marked `ACC_PRIVATE`, then it is the selected method.

2. Otherwise, the selected method is determined by the following lookup procedure:

   - If C contains a declaration of an instance method `m` that can override `mR` ([§5.4.5](#jvms-5.4.5)), then `m` is the selected method.

   - Otherwise, if C has a superclass, a search for a declaration of an instance method that can override `mR` is performed, starting with the direct superclass of C and continuing with the direct superclass of that class, and so forth, until a method is found or no further superclasses exist. If a method is found, it is the selected method.

   - Otherwise, the maximally-specific superinterface methods of C are determined ([§5.4.3.3](#jvms-5.4.3.3)). If exactly one matches `mR`'s name and descriptor and is not `abstract`, then it is the selected method.

     Any maximally-specific superinterface method selected in this step can override `mR`; there is no need to check this explicitly.

While C will typically be a class, it may be an interface when these rules are applied during preparation ([§5.4.2](#jvms-5.4.2)).

### 5.4.6. 方法选择

在执行 *invokeinterface* 或 *invokevirtual* 指令期间, 根据 (i) 堆栈上对象的运行时类型和 (ii) 先前 *resolved* 的方法*选择*该指令。关于类或接口 C 和方法 `mR` 选择方法的规则如下:

1.如果`mR`被标记为`ACC_PRIVATE`, 那么它就是被选择的方法。

2. 否则, 所选方法由以下查找过程确定:

   - 如果 C 包含可以覆盖 `mR` 的实例方法 `m` 的声明（[§5.4.5](#jvms-5.4.5)）, 则 `m` 是选定的方法。

   - 否则, 如果 C 有超类, 则搜索可以覆盖 `mR` 的实例方法的声明, 从 C 的直接超类开始, 然后继续该类的直接超类, 依此类推, 直到找到方法或不存在进一步的超类。如果找到一个方法, 它就是选定的方法。

   - 否则, 确定 C 的最大特定超接口方法 ([§5.4.3.3](#jvms-5.4.3.3))。如果恰好有一个匹配`mR`的名称和描述符并且不是`abstract`, 那么它就是被选择的方法。

     在此步骤中选择的任何最大特定超接口方法都可以覆盖`mR`；无需明确检查。

虽然 C 通常是一个类, 但在准备期间应用这些规则时, 它可能是一个接口 ([§5.4.2](#jvms-5.4.2))。


<a name="jvms-5.5"></a>
## 5.5. Initialization

*Initialization* of a class or interface consists of executing its class or interface initialization method ([§2.9.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.9.2)).

A class or interface C may be initialized only as a result of:

## 5.5. 初始化(Initialization)

*类或接口的初始化*包括执行其类或接口的初始化方法（[§2.9.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.9.2))。

类或接口 C 只能作为以下结果进行初始化:


- The execution of any one of the Java Virtual Machine instructions *new*, *getstatic*, *putstatic*, or *invokestatic* that references C ([§*new*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.new), [§*getstatic*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.getstatic), [§*putstatic*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.putstatic), [§*invokestatic*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.invokestatic)).

  Upon execution of a *new* instruction, the class to be initialized is the class referenced by the instruction.

  Upon execution of a *getstatic*, *putstatic*, or *invokestatic* instruction, the class or interface to be initialized is the class or interface that declares the resolved field or method.

- The first invocation of a `java.lang.invoke.MethodHandle` instance which was the result of method handle resolution ([§5.4.3.5](#jvms-5.4.3.5)) for a method handle of kind 2 (`REF_getStatic`), 4 (`REF_putStatic`), 6 (`REF_invokeStatic`), or 8 (`REF_newInvokeSpecial`).

  This implies that the class of a bootstrap method is initialized when the bootstrap method is invoked for an *invokedynamic* instruction ([§*invokedynamic*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.invokedynamic)), as part of the continuing resolution of the call site specifier.

- Invocation of certain reflective methods in the class library ([§2.12](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.12)), for example, in class `Class` or in package `java.lang.reflect`.

- If C is a class, the initialization of one of its subclasses.

- If C is an interface that declares a non-`abstract`, non-`static` method, the initialization of a class that implements C directly or indirectly.

- Its designation as the initial class or interface at Java Virtual Machine startup ([§5.2](#jvms-5.2)).

- 执行任何引用 C 的 Java 虚拟机指令 *new*、*getstatic*、*putstatic* 或 *invokestatic*（[§*new*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.new), [§*getstatic*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.getstatic）, [§*putstatic*]（https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.putstatic ), [§*invokestatic*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.invokestatic))。

  在执行 *new* 指令时, 要初始化的类是指令引用的类。

  在执行 *getstatic*、*putstatic* 或 *invokestatic* 指令时, 要初始化的类或接口是声明已解析字段或方法的类或接口。

- `java.lang.invoke.MethodHandle` 实例的第一次调用, 这是方法句柄解析的结果（[§5.4.3.5](#jvms-5.4.3.5)）, 用于类型 2 的方法句柄（`REF_getStatic `)、4 (`REF_putStatic`)、6 (`REF_invokeStatic`) 或 8 (`REF_newInvokeSpecial`)。

  这意味着在为 *invokedynamic* 指令调用引导方法时初始化引导方法的类（[§*invokedynamic*](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-6.html#jvms-6.5.invokedynamic)), 作为调用站点说明符的持续解析的一部分。

- 在类库中调用某些反射方法（[§2.12](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-2.html#jvms-2.12)）, 例如, 在类`Class`或包`java.lang.reflect`中。

- 如果 C 是一个类, 则初始化它的一个子类。

- 如果 C 是一个声明非抽象、非静态方法的接口, 则初始化直接或间接实现 C 的类。

- 在 Java 虚拟机启动时将其指定为初始类或接口 ([§5.2](#jvms-5.2))。


Prior to initialization, a class or interface must be linked, that is, verified, prepared, and optionally resolved.

Because the Java Virtual Machine is multithreaded, initialization of a class or interface requires careful synchronization, since some other thread may be trying to initialize the same class or interface at the same time. There is also the possibility that initialization of a class or interface may be requested recursively as part of the initialization of that class or interface. The implementation of the Java Virtual Machine is responsible for taking care of synchronization and recursive initialization by using the following procedure. It assumes that the `Class` object has already been verified and prepared, and that the `Class` object contains state that indicates one of four situations:

- This `Class` object is verified and prepared but not initialized.
- This `Class` object is being initialized by some particular thread.
- This `Class` object is fully initialized and ready for use.
- This `Class` object is in an erroneous state, perhaps because initialization was attempted and failed.

在初始化之前, 必须链接一个类或接口, 即验证、准备和可选地解析。

因为 Java 虚拟机是多线程的, 所以类或接口的初始化需要仔细同步, 因为其他一些线程可能同时尝试初始化同一个类或接口。也有可能作为该类或接口的初始化的一部分递归地请求类或接口的初始化. Java 虚拟机的实现负责通过使用以下过程来处理同步和递归初始化。它假定 `Class` 对象已经过验证和准备, 并且 `Class` 对象包含指示以下四种情况之一的状态:

- 这个 `Class` 对象已经过验证和准备, 但没有初始化。
- 这个 `Class` 对象正在被某个特定线程初始化。
- 这个 `Class` 对象已完全初始化并可以使用。
- 这个 `Class` 对象处于错误状态, 可能是因为尝试初始化但失败。


For each class or interface C, there is a unique initialization lock `LC`. The mapping from C to `LC` is left to the discretion of the Java Virtual Machine implementation. For example, `LC` could be the `Class` object for C, or the monitor associated with that `Class` object. The procedure for initializing C is then as follows:

1. Synchronize on the initialization lock, `LC`, for C. This involves waiting until the current thread can acquire `LC`.

2. If the `Class` object for C indicates that initialization is in progress for C by some other thread, then release `LC` and block the current thread until informed that the in-progress initialization has completed, at which time repeat this procedure.

   Thread interrupt status is unaffected by execution of the initialization procedure.

3. If the `Class` object for C indicates that initialization is in progress for C by the current thread, then this must be a recursive request for initialization. Release `LC` and complete normally.

4. If the `Class` object for C indicates that C has already been initialized, then no further action is required. Release `LC` and complete normally.

5. If the `Class` object for C is in an erroneous state, then initialization is not possible. Release `LC` and throw a `NoClassDefFoundError`.

6. Otherwise, record the fact that initialization of the `Class` object for C is in progress by the current thread, and release `LC`.

   Then, initialize each `final` `static` field of C with the constant value in its `ConstantValue` attribute ([§4.7.2](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.7.2)), in the order the fields appear in the `ClassFile` structure.

对于每个类或接口 C, 都有一个唯一的初始化锁`LC`。从 C 到`LC`的映射由 Java 虚拟机实现自行决定。例如, `LC` 可以是 C 的`Class` 对象, 或与该`Class` 对象关联的监视器。初始化 C 的过程如下:

1. 在 C 的初始化锁`LC`上同步。这包括等待当前线程可以获取`LC`。

2. 如果 C 的 `Class` 对象表明其他线程正在对 C 进行初始化, 则释放 `LC` 并阻塞当前线程, 直到通知正在进行的初始化已完成, 此时重复此过程.

   线程中断状态不受初始化过程执行的影响。

3. 如果 C 的 `Class` 对象表明当前线程正在对 C 进行初始化, 那么这一定是一个递归的初始化请求。释放`LC`并正常完成。

4. 如果 C 的 `Class` 对象表明 C 已经被初始化, 则不需要进一步的操作。释放`LC`并正常完成。

5. 如果 C 的 `Class` 对象处于错误状态, 则无法进行初始化。释放 `LC` 并抛出 `NoClassDefFoundError`。

6. 否则, 记录当前线程正在对C的`Class`对象进行初始化, 并释放`LC`。

   然后, 用其`ConstantValue`属性中的常量值初始化C的每个`final``static`字段（[§4.7.2]（https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-4.html#jvms-4.7.2)), 按照字段在 `ClassFile` 结构中出现的顺序。

7. Next, if C is a class rather than an interface, then let SC be its superclass and let SI1, ..., SIn be all superinterfaces of C (whether direct or indirect) that declare at least one non-`abstract`, non-`static` method. The order of superinterfaces is given by a recursive enumeration over the superinterface hierarchy of each interface directly implemented by C. For each interface I directly implemented by C (in the order of the `interfaces` array of C), the enumeration recurs on I's superinterfaces (in the order of the `interfaces` array of I) before returning I.

   For each S in the list [ SC, SI1, ..., SIn ], if S has not yet been initialized, then recursively perform this entire procedure for S. If necessary, verify and prepare S first.

   If the initialization of S completes abruptly because of a thrown exception, then acquire `LC`, label the `Class` object for C as erroneous, notify all waiting threads, release `LC`, and complete abruptly, throwing the same exception that resulted from initializing SC.

8. Next, determine whether assertions are enabled for C by querying its defining class loader.

9. Next, execute the class or interface initialization method of C.

10. If the execution of the class or interface initialization method completes normally, then acquire `LC`, label the `Class` object for C as fully initialized, notify all waiting threads, release `LC`, and complete this procedure normally.

11. Otherwise, the class or interface initialization method must have completed abruptly by throwing some exception E. If the class of E is not `Error` or one of its subclasses, then create a new instance of the class `ExceptionInInitializerError` with E as the argument, and use this object in place of E in the following step. If a new instance of `ExceptionInInitializerError` cannot be created because an `OutOfMemoryError` occurs, then use an `OutOfMemoryError` object in place of E in the following step.

12. Acquire `LC`, label the `Class` object for C as erroneous, notify all waiting threads, release `LC`, and complete this procedure abruptly with reason E or its replacement as determined in the previous step.

7. 接下来, 如果 C 是类而不是接口, 则令 SC 为其超类, 并令 SI1, ..., SIn 为声明至少一个非抽象的 C 的所有超接口（无论是直接的还是间接的） , 非`static`方法。超级接口的顺序由 C 直接实现的每个接口的超级接口层次结构上的递归枚举给出。​​对于我由 C 直接实现的每个接口（按照 C 的 `interfaces` 数组的顺序）, 枚举在我的超级接口上重复（按 I 的 `interfaces` 数组的顺序）在返回 I 之前。

   对于列表[ SC, SI1, ..., SIn ]中的每个S, 如果S还没有被初始化, 那么递归地对S执行整个过程。如果有必要, 首先验证和准备S。

   如果 S 的初始化由于抛出异常而突然完成, 则获取`LC`, 将 C 的`Class` 对象标记为错误, 通知所有等待线程, 释放`LC`, 然后突然完成, 抛出与导致的相同的异常从初始化 SC。

8. 接下来, 通过查询其定义的类加载器来确定是否为 C 启用了断言。

9、接下来执行C的类或接口初始化方法。

10、如果类或接口初始化方法的执行正常完成, 则获取`LC`, 将C的`Class`对象标记为完全初始化, 通知所有等待线程, 释放`LC`, 正常完成此过程。

11. 否则, 类或接口的初始化方法必须通过抛出异常 E 突然完成。如果 E 的类不是 `Error` 或其子类之一, 则创建一个新的类 `ExceptionInInitializerError` 实例, 其中 E 为参数, 并在接下来的步骤中使用此对象代替 E。如果由于发生 `OutOfMemoryError` 而无法创建 `ExceptionInInitializerError` 的新实例, 则在以下步骤中使用 `OutOfMemoryError` 对象代替 E。

12.获取`LC`, 将C的`Class`对象标记为错误, 通知所有等待的线程, 释放`LC`, 并根据上一步确定的原因E或替换原因突然完成此过程。


A Java Virtual Machine implementation may optimize this procedure by eliding the lock acquisition in step 1 (and release in step 4/5) when it can determine that the initialization of the class has already completed, provided that, in terms of the Java memory model, all *happens-before* orderings (JLS §17.4.5) that would exist if the lock were acquired, still exist when the optimization is performed.

当 Java 虚拟机实现可以确定类的初始化已经完成时, 可以通过省略步骤 1 中的锁获取（并在步骤 4/5 中释放）来优化此过程, 前提是根据 Java 内存模型 , 如果获得锁, 所有 *happens-before* 排序（JLS §17.4.5）在执行优化时仍然存在。


<a name="jvms-5.6"></a>
## 5.6. Binding Native Method Implementations

*Binding* is the process by which a function written in a language other than the Java programming language and implementing a `native` method is integrated into the Java Virtual Machine so that it can be executed. Although this process is traditionally referred to as linking, the term binding is used in the specification to avoid confusion with linking of classes or interfaces by the Java Virtual Machine.

## 5.6. 绑定本地方法(Native Method)

*绑定(Binding)* 是将用 Java 之外的其他编程语言编写的函数来实现的 "本地" 方法, 集成到 Java 虚拟机中以便可以执行的过程.  尽管这个过程传统上被称为链接(linking), 但在本规范中, 为了避免与 Java 虚拟机的类或接口链接相混淆, 所以使用单独的术语。


<a name="jvms-5.7"></a>
## 5.7. Java Virtual Machine Exit

The Java Virtual Machine exits when some thread invokes the `exit` method of class `Runtime` or class `System`, or the `halt` method of class `Runtime`, and the `exit` or `halt` operation is permitted by the security manager.

In addition, the JNI (Java Native Interface) Specification describes termination of the Java Virtual Machine when the JNI Invocation API is used to load and unload the Java Virtual Machine.

## 5.7. Java虚拟机退出

当某个线程调用 `Runtime` 类或 `System` 类的 `exit` 方法, 或 `Runtime` 类的 `halt` 方法, 并且 `exit` 或 `halt` 操作被 security manager (安全管理器)允许, Java虚拟机退出。

此外, JNI (Java Native Interface)规范描述了Java虚拟机的终止, 当使用 JNI Invocation API 来加载和卸载Java虚拟机时, 。

## 相关链接

- [Java Virtual Machine Specification: Chapter 5. Loading, Linking, and Initializing](https://docs.oracle.com/javase/specs/jvms/se11/html/jvms-5.html)
- [12.Java语言规范文档: 第12章. 执行(Execution)](../12_Java_LS_Chapter_12_Execution/README.md)
