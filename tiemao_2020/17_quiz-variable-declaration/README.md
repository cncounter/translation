# Quiz Yourself: Variable Declaration (Intermediate)

＃ Java坑人面试题系列: 变量声明（中级难度）

> The scope rules of Java variables and an examination of shadowing

If you have worked on our quiz questions in the past, you know none of them is easy. They model the difficult questions from certification examinations. The “intermediate” and “advanced” designations refer to the exams, rather than to the questions, although in almost all cases, “advanced” questions will be harder. We write questions for the certification exams, and we intend that the same rules apply: Take words at their face value, and trust that the questions are not intended to deceive you but to straightforwardly test your knowledge of the ins and outs of the language.


> 作用域规则与变量覆盖面试题

Java Magazine上面有一个专门坑人的面试题系列: <https://blogs.oracle.com/javamagazine/quiz-2>。

这些问题的设计宗旨，主要是测试面试者对Java语言的了解程度，而不是为了用弯弯绕绕的手段把面试者搞蒙。

如果你看过往期的问题，就会发现每一个都不简单。

这些试题模拟了认证考试中的一些难题。 而 “中级(intermediate)” 和 “高级(advanced)” 指的是试题难度，而不是说这些知识本身很深。 一般来说，“高级”问题会稍微难一点。

### Given the following code snippets:


### 问题（中级难度）

下面哪些代码是正确的写法？

- A.

```java
class C1 {
    void foo(int a) {
       for (int a = 0; a < 5; a++) { }
    }
}
```


- B.

```java
class C2 {
    int a = 0;
    { int a = 1; }
}
```

- C.


```java
class C3 {
    { int a = 0; }
    { int a = 1; }
}
```


- D.


```java
class C4 {
    {
        int a = 0;
        for (int a = 0; a < 5; a++) { }
    }
}
```


- E.


```java
class C5 {
    {
        for (int a = 0; a < 5; a++) { }
        int a = 0;
    }
}
```

Which snippets successfully compile? Choose three.

到底是哪些选项正确呢？ 请先思考，再看下面的解答。

### Answer.

### 答案和解析

This question investigates the scope rules of Java along with an effect referred to as shadowing, where two identifiers of the same name exist in the same scope, but referring to the simple, unqualified name reaches one and ignores the other. In general, a local-scoped variable may be defined in such a way that it shadows another variable in a class or instance scope. However, this may not be done to local-scoped variables. Notice this choice is a useful one, because you can always refer explicitly to the class or instance field using the class name or the implicit variable `this`.

Consider this example:

这道题主要考察变量的作用域以及优先级：同一作用域下如果存在两个相同的变量名称(标识符)，那么会简单会指向一个变量而忽略另一个。
一般来说，局部变量会覆盖同名的类属性和实例属性，但方法作用域内的局部变量则不允许覆盖。
在编写程序代码时，一般规范都会要求明确指定类名或者 `this` 来引用对应的字段。

下面是一个简单的使用示例：


```java
public class MyClass {
  static int x = 99;
  int y = 100;
  public static void showX() {
    int x = 9;
    System.out.println("x is " + x); // x is 9
    System.out.println("MyClass.x is " + MyClass.x); // MyClass.x is 99
  }
  public void showY() {
    int y = 10;
    System.out.println("y is " + y); // y is 10
    System.out.println("this.y is " + this.y); // this.y is 100
  }
}
```

Let’s take a look at the options.

In option `A`, you see a method parameter called `a`. Method parameters are local variables and have a scope that starts from the argument list and continues to the closing curly brace that ends the method declaration. But there is also another local variable named `a` that is declared in the `for` loop. Because of this, and the rule that prohibits having two local variables with the same name and overlapping scope, this code will not compile, and option `A` is incorrect.


接下来依次解读试题中的选项。

看选项 `A` ，


```java
class C1 {
    void foo(int a) {
       for (int a = 0; a < 5; a++) { }
    }
}
```

可以看到有一个变量 `a` 作为方法参数。
方法参数也是局部变量，其作用域范围从参数列表开始，一直到方法结束。
在方法内部的`for`循环中，也声明了一个名为 `a` 的局部变量。
因此，根据规则，`在某个作用域范围内，不允许存在多个同名的局部变量`， 所以这段代码无法编译，  `选项A不正确`。


Option `B` defines an instance variable called `a` and also an instance initializer block that declares a local variable of the same name. However, because the variable defined in the instance initializer is a local variable (just as it would be in a method), that local variable shadows the instance-scoped variable successfully. Therefore, the code compiles correctly and option `B` is correct.

选项 `B` ，

```java
class C2 {
    int a = 0;
    { int a = 1; }
}
```

类中定义了实例变量 `a`，在初始化语句块中又定义了一个局部变量`a`，类似于方法代码中的局部变量声明。
所以在初始化块的作用域范围内, 局部变量覆盖了实例属性。
这段代码可以正确编译并运行, 所以 `选项B正确` 。

Option `C` declares two independent instance initializer blocks and each has a local variable named `a`, but their scopes, limited by their enclosing initializer blocks, do not overlap in any way so the variables do not conflict. This code is useless because variables inside instance initializer blocks are not visible anywhere else in the class and are immediately lost after the initializer completes. You could be forgiven for expecting the compiler to object in the same way that it does with unreachable code, but it does not; the syntax is valid, and option `C` is correct.


选项 `C` ，

```java
class C3 {
    { int a = 0; }
    { int a = 1; }
}
```

在两个单独的初始块中， 都声明了局部变量`a`， 但各自的作用域范围都被限制为代码块之中， 所以不会发生重叠，也就没有变量冲突。
当然，这段代码没什么实际的作用，因为在初始化块中声明的变量，在其他地方都不可看，在语句块执行完成后会被丢弃。
可能有些同学会觉得编译器会报错，但实际上这些代码块都是会执行的，并没有不可达代码。
既然语法没问题, 那么 `选项C正确` 。

In option `D` the code declares a local variable and immediately declares another with the same name in the loop. A variable declared in a for loop is a local variable having a scope that starts at the point of declaration and ends with the end of the loop. Of course, this means that two local variables of the same name appear to be in scope through the body of the loop, and this is prohibited. This situation is closely parallel to the code in option `A`, with the difference that in option `A`, the first-declared local variable was a method parameter, and in this option, the first-declared local variable is a simple local variable. However, you can see from this that option `D` is also incorrect.


看选项 `D`，


```java
class C4 {
    {
        int a = 0;
        for (int a = 0; a < 5; a++) { }
    }
}
```

代码​​块中先是声明了一个局部变量， 然后`for`循环中又声明了同名的变量。
因为for循环中声明的局部变量，作用域范围从声明处开始，直到循环结束。
也就是说, 在循环体范围内，存在两个同名的局部变量，这是违反语法规定的。
跟选项 `A` 中的情况有点类似，区别只在于选项 `A` 中声明的是方法参数，而选项D中声明的是普通局部变量。
由此可知， `选项D不正确`。


In option E, the code is somewhat similar to option `D`, but the loop and local variable declarations are in the opposite order. As a result, the loop variable is out of scope before the second declaration. Therefore, the two variables do not conflict, the code is valid, and option `E` is correct.


最后看选项 `E`，

```java
class C5 {
    {
        for (int a = 0; a < 5; a++) { }
        int a = 0;
    }
}
```

和选项`D`看起来有点像， 但这次是循环先声明自己的局部变量，循环结束后，后面的代码接着声明了一个同名的普通局部变量。
这两个局部变量的作用域并不重叠，也不冲突，所以代码有效，`选项E正确`。


### 小结

The topic of the scope of declarations is detailed in the Java Language Specification, particularly section 6.3, “Scope of a Declaration.”

From that section, two quotations are particularly relevant. The following one pertains to the scope of method parameters:

The scope of a formal parameter of a `method`, `constructor`, or `lambda expression` is the entire body of the method, constructor, or lambda expression.

And this one pertains to variables declared in `for` loops:

The scope of a local variable declared in the ForInit part of a basic `for` statement  includes all of the following:

Its own initializer
Any further declarators to the right in the ForInit part of the `for` statement
The Expression and ForUpdate parts of the `for` statement
The contained Statement



在 [《Java语言规范 - 6.3 变量声明与作用域》](https://docs.oracle.com/javase/specs/jls/se11/html/jls-6.html#jls-6.3) 一节中对变量声明的作用域范围做了详细说明。

有两个需要着重强调的点:

1. 方法参数的作用域范围： 形参的作用域范围，是方法，构造函数或lambda表达式对应的body。
2. `for`循环初始化语句中声明的局部变量, 作用域范围包括： 初始化部分、初始化后面的条件判断部分，递增更新语句，以及循环体中的语句。


The correct answer is options `B`,  `C`, and `E`.

通过我们的分析可知，正确选项为: `B`,  `C`,  `E`.


### 相关链接

- [Java坑人面试题系列: 包装类（中级难度）](https://renfufei.blog.csdn.net/article/details/104163518)
- [Java坑人面试题系列: 比对while与for循环（中级）](https://renfufei.blog.csdn.net/article/details/104378574)
- [Java坑人面试题系列: 集合（高级）](https://renfufei.blog.csdn.net/article/details/104378574)
- [Java坑人面试题系列: 线程/线程池（高级）](https://renfufei.blog.csdn.net/article/details/104726229)
- [Java坑人面试题系列: 变量声明（中级）](https://renfufei.blog.csdn.net/article/details/105962238)

原文链接:  <https://blogs.oracle.com/javamagazine/quiz-yourself-variable-declaration-intermediate>
