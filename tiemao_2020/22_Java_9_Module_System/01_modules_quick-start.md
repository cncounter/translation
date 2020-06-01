# Java 9 Modules Quick Start Example

# Java模块系统快速入门


Java 9 Platform Module System (JPMS) introduces the concept of named 'module'.

从Java9版本开始, 引入了模块系统，英文名称为 Java 9 Platform Module System，简称JPMS，其中最核心的概念就是 `module`, 中文称为“模块”。

## What are Java Modules?

## 什么是模块？

Similar to Java packages, modules introduce another level of Java artifacts groupings. Each such group (module) encloses a number of packages. A module is declared by adding a file `module-info.java` at the root of source code. This file uses following syntax:

类似于Java包（package）的概念， 模块引入了另一种层次的Java构件分组功能。
一个分组(group)就是一个模块(module)，可以包含1到多个package。
我们使用源代码根目录下的 `module-info.java` 文件来定义模块, 语法如下:

```java
module com.cncounter{
 ....
}
```

Where `com.cncounter` declares the module name.

其中， `com.cncounter` 指定了模块的名称。

### The 'exports' clause

### 'exports' 语句简介


The file `module-info.java` may specify what public classes of a package it wants to make visible to outside world. It does so by using a new keyword exports.

`module-info.java` 文件中，可以指定向外部暴露哪些包（package），当然，根据Java语言层面的约定，只有public类才会被暴露出去。 这里说的暴露的意思， 是指外部可见性。 暴露使用的关键字为 `exports`, 示例如下:

```java
module com.cncounter{
  exports com.cncounter.api;
 }
```

Where `com.cncounter.api` represents a package.

其中，`com.cncounter.api` 表示Java包的名称。


> `public` might not be visible outside anymore

> 有了模块系统之后， `public` 类对外部的可见性，在原来的基础上增加了限制。

It is important to understand that even if classes in a given package are public, they cannot be visible outside (both at compile time and runtime) if their packages are not explicitly exported via 'exports' clause. Modules, therefore, can hide public functionality and that improves Java encapsulation system.

也就是说，即使某个类定义为 `public class`,  但如果所在的 package 没有显式地通过 'exports' 暴露出去， 那么不管是编译时期，还是运行时期，外部都不能访问。 那么模块系统的作用就看出来了， 其屏蔽了public的一部分功能，提升了Java的封装性(encapsulation)。


### The `requires` clause

### `requires` 语句简介

Another module which wants to use the exported packages can use another new keyword `requires` in its `module-info.java` file to import (read) the target module.

如果其他模块要使用某个模块暴露的包，可以在 `module-info.java` 文件中声明依赖关系, 关键字是 `requires`:

```java
module def.stu{
 requires com.cncounter;
}
```

The Module system introduces other various features which we will be exploring in this series of tutorials. In the following example, we will see how to create modules and use 'exports' and 'requires' clauses. We will use 'java' and 'javac' command line tools to build and run the classes to get familiar with the new module-related options introduced with these tools. We are going to use JDK 9 general availability release.

模块系统也引入了其他的新特性，后续的文章会进行介绍。
下面，我们通过具体代码来演示如何创建模块，怎样使用 `exports` and `requires` 语句。
在这个过程中，我们会使用到的命令包括 `java` 和 `javac`.
要求Java版本至少是 JDK9 及以上。

## Example

In this example, we will create two modules 'common.widget' and 'data.widget' and will place them under a single folder 'modules-examples/src'. The file 'module-info.java' will be placed under each of the main folder of the modules.

接下来我们创建2个模块: '`common.widget`' 和 '`data.widget`'，两个模块都位于目录 '`modules-examples/src`' 中。 每个模块对应的 'module-info.java' 则位于自身的主目录中。


### First Module

### 模块1

> modules-example/src/common.widget/org/jwidgets/SimpleRenderer.java

```java
package org.jwidgets;

public class SimpleRenderer {
  public void renderAsString(Object object) {
      System.out.println(object);
  }
}
```


> modules-example/src/common.widget/com/logicbig/RendererSupport.java

```java
package com.logicbig;

import org.jwidgets.SimpleRenderer;

public class RendererSupport {
  public void render(Object object) {
      new SimpleRenderer().renderAsString(object);
  }
}
```


> modules-example/src/common.widget/module-info.java

```java
module common.widget{
  exports com.logicbig;
}
```

### Second Module

### 模块2

> modules-example/src/data.widget/com/example/Component.java

```java
package com.example;

import com.logicbig.RendererSupport;

public class Component {
  public static void main(String[] args) {
      RendererSupport support = new RendererSupport();
      support.render("Test Object");
  }
}
```

> modules-example/src/data.widget/module-info.java

```java
module data.widget {
  requires common.widget;
}
```

### Compiling with javac

### 使用 `javac` 编译代码

I have already install JDK 9 (the general availability release) and set it on the system path. We are going to use Windows cmd to execute Java tools.

需要安装JDK9或者以上版本，并设置好系统 PATH。

例如Windows系统中：

```
D:\modules-example>java -version
java version "9"
Java(TM) SE Runtime Environment (build 9+181)
Java HotSpot(TM) 64-Bit Server VM (build 9+181, mixed mode)
```

Our project has following structure:

对应的源码文件为：

```
D:\modules-example>tree /F /A
\---src
    +---common.widget
    |   |   module-info.java
    |   |   
    |   +---com
    |   |   \---logicbig
    |   |           RendererSupport.java
    |   |           
    |   \---org
    |       \---jwidgets
    |               SimpleRenderer.java
    |               
    \---data.widget
        |   module-info.java
        |   
        \---com
            \---example
                    Component.java
```

We are going to save our first module's java classes list in a file by using windows 'dir' command:

首先，我们通过 `dir` 命令将第一个模块对应的java源文件归集到一个文件中：

```
D:\modules-example>dir  /B  /S  src\common.widget\*.java > src1.txt
```

打开看看，里面的内容类似于这样:

```
D:\modules-example>type src1.txt
D:\modules-example\src\common.widget\module-info.java
D:\modules-example\src\common.widget\com\logicbig\RendererSupport.java
D:\modules-example\src\common.widget\org\jwidgets\SimpleRenderer.java
```


When it comes to compiling multiple java classes from command line, we can conveniently use the @filename option of the javac command to include a file that lists the source file paths.

然后，我们使用 `javac` 的 `@filename` 这种方式，指定文件清单， 一次性编译多个源文件。

```
D:\modules-example>javac -d out/common.widget @src1.txt
```

`-d` 选项指定编译后的class文件输出目录。

On a Linux system, we can alternatively use the followings:

如果是Linux系统，则可以使用以下命令：

```
$ find src/common.widget/ -name *.java > sources.txt
$ javac @sources.txt
```

Similarly, we are going to compile our second module:

同样的方式，我们归集第二个模块的文件清单：

```
D:\modules-example>dir  /B  /S  src\data.widget\*.java > src2.txt
```


然后执行编译。

```
D:\modules-example>javac --module-path out -d out/data.widget @src2.txt
```

This time we specified new javac option '--module-path' with the value 'out' (our output folder). we can also specify a short form of this option as '-p out' . This option declares where to find application modules. In this case we needed to specify this option because 'data.widget' is using 'common.widget' classes so compiler needs to resolve the references.

可以看到，我们指定了 `--module-path` 选项，这个选项告诉编译器去哪里查找依赖的模块信息。
因为 'data.widget' 模块需要依赖 'common.widget' 中的类， 所以选项后面带上了参数值： `out`， 这个选项对应的简写格式为: `-p out`;


### After compilation

### 编译之后

编译完成后的文件目录结构为：

```
D:\modules-example>tree /F /A
|   src1.txt
|   src2.txt
|   
+---out
|   +---common.widget
|   |   |   module-info.class
|   |   |   
|   |   +---com
|   |   |   \---logicbig
|   |   |           RendererSupport.class
|   |   |           
|   |   \---org
|   |       \---jwidgets
|   |               SimpleRenderer.class
|   |               
|   \---data.widget
|       |   module-info.class
|       |   
|       \---com
|           \---example
|                   Component.class
|                   
\---src
    +---common.widget
    |   |   module-info.java
    |   |   
    |   +---com
    |   |   \---logicbig
    |   |           RendererSupport.java
    |   |           
    |   \---org
    |       \---jwidgets
    |               SimpleRenderer.java
    |               
    \---data.widget
        |   module-info.java
        |   
        \---com
            \---example
                    Component.java
```

Note that module-info.java is compiled into module-info.class as well.

可以看到, `module-info.java` 编译后的class文件是 `module-info.class`，除了后缀，名字都是一样的。

### Running the main class

### 运行主类

```
D:\modules-example>java --module-path out -m data.widget/com.example.Component
Test Object
```

'java' command also has the new option '--module-path' (short form -p ). This is to specify what directories (semicolon-separated if there are many) to be searched for the modules.

`java` 命令也支持新的选项 `--module-path`, 简写格式 `-p`. 用于指定从哪里查找模块， 如果有多个目录，Windows系统使用英文分号来间隔，Linux则使用英文冒号来分隔，和 PATH、CLASSPATH 的配置类似。

The -m option specifies the module where our main class is to be executed. Here is the general format of this option:

`-m` 选项用于指定要执行的模块和 main class。 格式为:

```
-m <modulename>[/mainclass]
# 或者
--module <modulename>[/mainclass]
```

### Attempting to use non-exported classes

### 反例: 使用未暴露的class

In our example, since the package 'org.jwidgets' has not been exported by 'common.widget' module, 'data.widget' cannot use classes under that package. Let's try doing that and see what happens:

在前面的示例中， 'common.widget' 模块并没有暴露 'org.jwidgets' 这个包，所以 'data.widget' 就不能使用这个包下面的类。 我们看一个反例：

```
package com.example;
import org.jwidgets.SimpleRenderer;

public class Component {
  public static void main(String[] args) {
    SimpleRenderer simpleRenderer = new SimpleRenderer();
    simpleRenderer.renderAsString("Test Object");
  }
}
```

Now let's try to compile 'data.widget' module again:

试试看能不能编译：

```
D:\modules-example>javac --module-path out -d out/data.widget @src2.txt
D:\modules-example\src\data.widget\com\example\Component.java:3: error: package org.jwidgets is not visible
import org.jwidgets.SimpleRenderer;
          ^
  (package org.jwidgets is declared in module common.widget, which does not export it)
1 error
```


### Module Path

### 模块路径

As seen in above example, Java Module system uses module path instead of class path to locate the modules. The module path solves many issues of class path; most notably issues like making no distinction between the loaded artifacts, no reporting of missing artifacts in advance, allowing conflicts between same classes of different version residing in the different jars on the class path. As opposed to class path, the module path locates whole modules rather than individual classes.

可以看到， Java模块系统使用 module path 来定位模块。 模块路径解决了很多 class path 的问题； 比如类版本冲突，找不到类等等，使用模块系统之后，多个jar文件中具有相同名称的class就不再是问题。 与class path 相比，模块路径会将整个模块都放到一起解析，而不是单独查找每个类。

### JDK API and Modules

### JDK模块与API

The module system has been applied to JDK itself. Now Java classes are grouped into modules then into packages. check out Java API documents. All modules implicitly import java.base. I will also suggest to browse though <jdk-home>/src.zip to see how modules are organised.

模块系统已经应用到JDK内部。 各种Java类先是归类到模块内部，以及不同的包之中。 详情请参考: [Java API documents](https://docs.oracle.com/javase/9/docs/api/overview-summary.html)。 所有的模块都默认引入了 `java.base`. 有兴趣的同学可以通过 `<jdk-home>/src.zip` 文件来查看这些模块是如何组织的。



### 参考链接

- [示例代码: java-modules-kick-start.zip](https://www.logicbig.com/tutorials/core-java-tutorial/modules/quick-start/java-modules-kick-start.zip)

- [Java 9 Modules Quick Start Example](https://www.logicbig.com/tutorials/core-java-tutorial/modules/quick-start.html)
