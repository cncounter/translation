# Quiz Yourself: Wrapper Classes (Intermediate)

＃ Java坑人面试题系列: 包装类（中级难度）


If you have worked on our quiz questions in the past, you know none of them is easy. They model the difficult questions from certification examinations. The levels marked “intermediate” and “advanced” refer to the exams, rather than the questions. Although in almost all cases, “advanced” questions will be harder. We write questions for the certification exams, and we intend that the same rules apply: Take words at their face value and trust that the questions are not intended to deceive you, but straightforwardly test your knowledge of the ins and outs of the language.

Java Magazine上面有一个专门坑人的面试题系列: <https://blogs.oracle.com/javamagazine/quiz-2>。

这些问题的设计宗旨，主要是测试面试者对Java语言的了解程度，而不是为了用弯弯绕绕的手段把面试者搞蒙。

如果你看过往期的问题，就会发现每一个都不简单。

这些试题模拟了认证考试中的一些难题。 而 “中级(intermediate)” 和 “高级(advanced)” 指的是试题难度，而不是说这些知识本身很深。 一般来说，“高级”问题会稍微难一点。



> Two integers are instantiated with the `Integer` wrapper class. How do you compare their values correctly?

> 先思考一个简单的问题: 两个 `Integer` 包装类对象。 怎样比较它们的值是否相等，有哪些方法？


### Question (intermediate).

### 问题（中级难度）

The objective is to develop code that uses wrapper classes such as `Boolean`, `Double`, and `Integer`. Given the following code fragment:

在开发中我们经常会使用包装类（例如 `Boolean`, `Double`, 以及 `Integer` 等等）。

请看下面的代码片段：

```
String one = "1";
Boolean b1 = Boolean.valueOf(one);  // line n1
Integer i1 = new Integer(one);
Integer i2 = 1;
if (b1) {
    System.out.print(i1 == i2);
}
```

What is the result? Choose one.

执行结果是什么， 请选择:

- A、 抛出运行时异常
- B、 true
- C、 false
- D、 无任何输出

### Answer.

### 答案和解析

This question investigates primitive wrapper classes, particularly an odd aspect of the `Boolean` class and its factory. The exact topic of this question is perhaps unlikely on the real exam because it hinges on a piece of rote learning, and the exam tries to avoid such questions. However, this question tests multiple aspects of understanding and knowledge in a single question that, with luck, make it more interesting.


这个问题考察原生数据的包装类（primitive wrapper），主要是 `Boolean` 类比较生僻的 `valueOf` 工厂方法。
在认证考试和面试中，这个问题可能不太容易碰到，因为主要还是靠死记硬背， 大部分考试都会避免此类问题。
但是，这个问题从多个方面综合考察了面试者对Java语言的理解和认识水平， 有一点小坑，但关键在于解答的过程。

Wrappers provide three main ways to obtain instances. Each wrapper provides a static factory in the method called `valueOf`. Also, if the context is sufficiently explicit, such as an assignment to a variable of the wrapper type from a primitive of matching type, autoboxing will occur. Autoboxing is simply a syntactic shorthand that allows the compiler to write the code to invoke the `valueOf` method and results in cleaner source code. The third approach is to call a constructor, using the `new` keyword. This third approach actually has been deprecated in Java 9, and one goal of this question is to investigate why it was deprecated.

包装类主要提供了三种获取对象实例的方法:

- 1. 每个包装类都有名为 `valueOf` 的静态工厂方法。
- 2. 如果语义很清晰， 在代码中将原生数据类型赋值给包装类的变量，则会发生自动装箱 (autoboxing)。 自动装箱只是语法上的简写，它允许编译器 (`javac`) 自动调用`valueOf`方法, 目的是为了编码更简洁。
- 3. 第三种方法是使用构造器, 也就是通过 `new` 关键字来调用构造函数。 实际上，在 Java 9 中已经不推荐使用第三种方法， 而本文的一个目标是解释为什么不赞成使用它。

In Java, anytime a constructor is invoked using the `new` keyword, only two outcomes are possible. Either a new instance of exactly the named type is created and returned, or an exception arises. This is actually a limitation and, today, factory methods are generally preferred because they can have these two effects, but they can also have additional outcomes.

在Java中，只要使用 `new` 关键字调用构造函数，只会发生两种情况： 要么成功创建指定类型的新对象并返回，要么就抛异常。
这实际上是一个限制，如今一般是推荐使用工厂方法， 因为工厂方法除了达成构造函数的效果之外， 还会有一些优化。

One capability of a factory, which is impossible for a constructor, is to return an existing object that matches the request. Given that the `Integer` wrapper is immutable, two objects of this type representing the same number are entirely interchangeable. Because of this, it’s a waste of memory to create two objects to represent the same value. Further, such an approach allows comparing such objects using `==` instead of the `equals(Object o)` method. With the `Integer` class, values in the range of -128 to +127 are typically reused in this way.

工厂方法的有些功能是用构造函数实现不了的:  比如返回与请求参数相匹配的已缓存的实例对象。
因为 `Integer` 包装器是不可变的， 表示相同数值的两个`Integer`对象一般是可以互换的。
因此，创建多个表示相同值的对象实例会浪费内存。
很多情况下，工厂方法返回的两个对象允许使用 `==` 来比较， 而不必每次都写成 `equals(Object o)` 这种方式。
对于 `Integer` 类来说，一般只缓存了 `-128 到 +127` 范围内的值。

(As a side note, this behavior is similar in effect to using `String` literals instead of creating a `String` object—such as with `new String("1")`.)

> 这种行为类似于在编码中直接使用 `"XXX"` 这种字面量表示方式， 而不是 `new String("XXX")`。

Factory methods have two more advantages. If multiple factories are created, each method can have a different name, which means they could take identical argument type lists if that is appropriate. Doing that would be impossible with constructors, which must form valid overloads of one another.

工厂方法更加灵活：

- 如果有多个工厂方法，则每个方法都可以使用不同的名称，因为名称不同，也就可以使用相同的入参声明。
- 对于构造函数而言，因为必须参数类型不同才能形成重载，也就不可能根据同样的参数构造不同的对象。

A third advantage is that a constructor inevitably returns an object of exactly the named type. A factory can return anything that’s assignment-compatible with the declared type (including implementations of interfaces, which can be an excellent way of hiding implementation details).

第三个优点是, Java中用 `new ` 调用构造函数只能返回固定类型的对象。
而用工厂方法则可以返回兼容的各种类型对象实例（例如接口的实现类，而且这是一种隐藏实现细节的绝佳方法）。

What’s most relevant in this question is that when you use `Boolean.valueOf(...)`, you get exactly two constant objects: one `Boolean.TRUE` and one `Boolean.FALSE`. These two are reused as many times as needed without taking up additional memory. This is impossible with calls to `new`.

回到这个问题，最关键的地方在于， 我们使用 `Boolean.valueOf(...)` 方法时， 只会得到两个常量对象： `Boolean.TRUE` 和 `Boolean.FALSE`。
这两个对象可以被重复利用，不会浪费多余的内存。 如果使用 `new` 调用显然是不可能的。

Now, the factories for most of the wrappers will throw an exception if they are provided with a `null` argument or with a string that doesn’t properly represent the type to be created (for example, if the `Integer.valueOf` factory is called with an argument "`five`" instead of "`5`"). However, the factory for the `java.lang.Boolean` class tests to see whether the argument string exists and contains the value "`true`" (without caring about capitalization). If so, it returns the value `Boolean.TRUE`. If not, it takes no further notice of the argument and returns `Boolean.FALSE`. This means that calling the factory with a `null` argument, or with the text "`nonsense`", results in `Boolean.FALSE` and no exception is thrown.


大部分包装类的工厂方法, 如果传入了 `null` 参数, 或者字符串参数不符合目标值的表现形式就会抛出异常,例如，`Integer.valueOf("six")` 就会抛异常。

但 `java.lang.Boolean` 类的工厂方法是个特例， 内部实现判断的是非空(`null`)并且等于 "`true`"（忽略大小写）。

内部实现如下所示：

```
public static boolean parseBoolean(String s) {
    return ((s != null) && s.equalsIgnoreCase("true"));
}
```

如果满足这两个条件则返回 `Boolean.TRUE`。
否则直接返回 `Boolean.FALSE`。
这意味着： 如果传入 `null` 或者无意义的字符串, 则会返回 `Boolean.FALSE`，并不会抛出异常。


Based on this, you can determine that the code in line n1 does not throw an exception, and it assigns `Boolean.FALSE` to the variable `b1`. Therefore, option A is incorrect.

基于这点，我们可以确定 n1 行那里不会抛出异常，而是返回 `Boolean.FALSE`, 被赋值给变量 `b1`。
因此，可以确定 `选项A不正确`。

Now you need to investigate the behavior of the `if` statement and the comparison it contains.

然后我们看一下 `if` 语句和里面的比较代码。

The general rule is that the test expression of an `if` statement must have `boolean` type. It’s probably obvious that a `Boolean` object will simply be unboxed to provide that type. If you had any doubt about this, you might wonder if the code would fail to compile. That’s not an unreasonable concern, because before the introduction of autoboxing with Java 5, the code would indeed have failed to compile. But even if you had such a concern, there’s no option expressing this, so it’s safe to assume that the obvious behavior occurs.

一般来说 `if` 语句小括号中的表达式必须是 `boolean` 类型。
显然，这里会自动将 `Boolean` 对象进行拆箱操作, 变为 `boolean` 类型。
这算是Java的基础知识，当然，如果在 Java 5 之前的版本这样写, 代码确实会无法编译。
即使有这样的担忧，但因为没有【编译错误】的选项，所以我们不关注这个问题。

In this case, you’ve established that the object referred to by `b1` represents a `false` value. Because of that, the `if` test fails, and the body of the code is not executed. From that, you can determine that option D is correct.

在这种情况下，我们已经确定 `b1` 所引用的对象值相当于 `false`。 因此，`if` 判断不通过，里面的代码不会被执行。
所以我们可以确定 `选项D是正确的`。

Although you know it’s not executed, in the context of this discussion, it seems worthwhile to consider what would have happened if the argument to the `print` call that’s inside the `if` statement were evaluated.

虽然我们已经确定 `if` 语句内部的代码没有执行，但是面试过程中可能会问到： 如果执行了呢，又是什么结果。

Java provides two forms of equality comparison. One, the `==` operator, is part of the core language. The other, the `equals(Object o)` method, is essentially an API feature. It’s available on every object because it’s defined in the `java.lang.Object` class, but it doesn’t necessarily do anything useful unless a particular class chooses to implement it. It’s important to know when to use each of them and to apply them correctly, but this question is concerned only with the `==` operator, so let’s just look at that.

Java语言中有两种形式的相等比较。

- 第一种是 `==` 运算符，是Java语法的一部分。
- 第二种是 `equals(Object o)` 方法，本质上是一个API。

每个对象都可以使用 `equals(Object o)` 方法，因为这个方法是在 `java.lang.Object` 类中定义的。
除非某个类覆写了equals方法，否则这个方法一般不定返回 `true`。
下面我们主要讨论 `==` 运算符，如果对 equals 方法的实现感兴趣, 请参考: [Java中hashCode与equals方法的约定及重写原则](https://blog.csdn.net/renfufei/article/details/14163329)。

The `==` operator compares the values of two expressions. That sounds simple enough except each value can be one of two different types depending on what the basic type of the expression is. This fact is important because the apparent effect of `==` is very different between the two types. By the way, the term “expression” is used here deliberately, and a variable is a simple expression. So if you prefer to think in terms of the values and types of variables, the discussion will still be `true`; you’ll just have a smaller chunk of truth than you might otherwise have had.

`==` 运算符比较两个表达式的值。
听起来很简单，但是表达式的值可能有两种不同的类型。这两种类型使用 `==` 的结果可能会不同。
顺便说一下，这里故意使用术语“`表达式`”， 而变量是一种简单的表达式。


The two broad types of an expression are primitive (which is one of the eight types `boolean`, `byte`, `short`, `char`, `int`, `long`, `float`, and `double`) and what’s called a `reference`. A `reference` is much like a pointer in that it’s a value that’s used to locate an object elsewhere in memory.

表达式主要有两种类型：

- 原生数据类型/基本数据类型 (`primitive`, 共8种: `boolean`, `byte`, `short`, `char`, `int`, `long`, `float`, `double`)
- 引用类型(`reference`)。  引用类似于指针， 表示内存中某个对象的地址值(可以认为是一个偏移量数值)。

If the expression is a primitive type, the value of the expression actually is the thing you care about. Therefore, if an `int` expression has the value 32, the expression’s value actually is a binary representation of 32. Of course it is, you say! Well, yes, but the problem is that if a variable is of a reference type, for example, the type `Integer`, and you use it to refer to an object with the value 32, the value of the variable is not 32. Instead, it’s some magical number—a reference—that allows the JVM to find the object containing 32. And that means that for reference types (remember: that means anything except those eight primitives and, therefore, includes `Integer` expressions) the `==` test tells you not whether the expressions have equivalent meaning, but whether they refer to the exact same object. Crucially, if you have two `Integer` objects containing the value 32, but they’re different objects, they will have different reference values, and then comparing the expressions that refer to them by using `==` will produce the result `false`.

如果表达式是原生数据类型，则表达式的值很直观。 例如，如果 `int` 表达式的值为 `32`，则该表达式的值就是`32`的二进制表示形式。

但问题是，如果变量是引用类型呢（例如，`Integer` 类型）， 它所引用对象内部的值为`32`，那么这个引用的值 `并不是32`。
而是一个神秘的数字（引用地址），通过这个引用地址，JVM可以找到对应的 `Integer` 对象。

也就是说，对于引用类型(即除了8种原生数据类型之外的所有类型)， `==` 表达式判断的是这两个引用的内存地址值是否相等，即判断它们是否引用了同一个对象。
最重要的是，即使两个 `Integer` 对象里面的值都是 `32`，但如果它们是不同的对象， 那么它们的引用地址也就不同，使用`==`比较会返回 `false`。

At this point, it should be clear that if you had this code:

这一点应该很好理解，再看下面这样的代码：

```
Integer v1 = new Integer("1");
Integer v2 = new Integer("1");
System.out.print(v1 == v2);
```

then the output would definitely be `false`. As mentioned earlier, any call to `new` must produce either a new object of exactly the named type or an exception. That means that  and `v2` must refer to different objects, and that means the `==` operation must produce `false`.

这里的输出肯定是 `false`。
前面提到过，`new` 关键字的任何调用，要么产生一个新对象, 要么抛异常。
这意味着 `v2` 和 `v1` 引用了不同的对象，`==` 操作的结果为 `false`。

If instead you had this code:

换一种方式，如果有以下代码：

```
Integer v1 = new Integer("1");
Integer v2 = 1;
System.out.print(v1 == v2);
```

which is closely parallel to the code in the question, using one constructor call and one use of autoboxing would still definitely print `false`. The object created by the constructor will be a unique new object and, therefore, not the one returned by the factory that provides the autoboxed value.

这与面试题中的代码很像，一个使用构造函数, 一个使用自动装箱，可以肯定这也会输出 `false`。
构造函数创建的对象必定是唯一的新对象，因此，不可能 `==` 自动装箱为工厂方法返回的对象。


###############

Factories for immutable objects are often coded so that they return the same object every time they’re called with the same arguments. The `Integer` class API documentation for the `valueOf(int)` method states the following:

不可变对象的工厂方法一般都会有特殊处理，只要在一个范围内，并且参数相等，就返回同一个（缓存的）对象。

`Integer` 类的API文档中，对 `valueOf(int)` 方法有如下说明：

“This method will always cache values in the range -128 to 127, inclusive, and may cache other values outside of this range.”

“此方法将始终缓存 `[-128 ~ 127]` 范围内的值， 可能还会缓存这个范围之外的其他值。”

In other words, the following code:


```
Integer v1 = Integer.valueOf(1);
Integer v2 = Integer.valueOf(1);
System.out.print(v1 == v2);
```

would definitely print `true`.


也就是说，上面这段代码肯定会输出 `true`。

The guarantee quoted earlier is mentioned only in the documentation for the `valueOf(int)` method and for `valueOf(String)`. However, in practice, both of these methods exhibit the same pooling behavior.

虽然只在 `valueOf(int)` 和 `valueOf(String)` 方法的文档说明中提到了这个缓存保证。
但在实际的实现中， 其他包装类也表现出相同的缓存行为。

Of course, the question here discusses two `Integer` objects: one created with a constructor and the other using autoboxing (which uses the `Integer.valueOf(int)` method). This means that if the body of the `if` statement had been entered, the output would have been false. But you’ve already established that option D is correct, so options B and C must be incorrect, and this is just an interesting side discussion. We hope it’s an interesting one, of course! The correct option is D.

当然，这里讨论了两个 `Integer` 对象： 一个是使用构造函数创建，另一个是使用自动装箱创建（`Integer.valueOf(int)` 方法）。
假如我们稍微改变一下面试题中 `if` 语句，则输出内容将为 `false`。

总结: 本文开始提到的面试题， 选项D是正确答案。 这里只是附带的讨论。

### 相关链接

- [Java坑人面试题系列: 包装类（中级难度）](https://renfufei.blog.csdn.net/article/details/104163518)
- [Java坑人面试题系列: 比对while与for循环（中级）](https://renfufei.blog.csdn.net/article/details/104378574)
- [Java坑人面试题系列: 集合（高级）](https://blogs.oracle.com/javamagazine/quiz-advanced-collectors)
- [Java坑人面试题系列: 线程/线程池（高级）](https://renfufei.blog.csdn.net/article/details/104726229)
- [Java坑人面试题系列: 变量声明（中级）](https://renfufei.blog.csdn.net/article/details/105962238)

原文链接: <https://blogs.oracle.com/javamagazine/quiz-intermediate-wrapper-classes>
