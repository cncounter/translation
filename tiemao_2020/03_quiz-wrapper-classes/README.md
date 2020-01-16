# Quiz Yourself: Wrapper Classes (Intermediate)

＃ Java坑人面试题: 包装类（中级）


> Two integers are instantiated with the `Integer` wrapper class. How do you compare their values correctly?


> 用Integer包装类实例化两个整数。 您如何正确比较它们的值？


If you have worked on our quiz questions in the past, you know none of them is easy. They model the difficult questions from certification examinations. The levels marked “intermediate” and “advanced” refer to the exams, rather than the questions. Although in almost all cases, “advanced” questions will be harder. We write questions for the certification exams, and we intend that the same rules apply: Take words at their face value and trust that the questions are not intended to deceive you, but straightforwardly test your knowledge of the ins and outs of the language.

如果您过去曾经处理过我们的测验问题，那么您会发现其中的任何一个都不容易。 他们模拟了认证考试中的难题。 标为“中级”和“高级”的级别是指考试，而不是问题。 尽管在几乎所有情况下，“高级”问题都会更加困难。 我们为认证考试编写问题，并且我们希望遵循相同的规则：以言行一致的方式讲话，并相信这些问题并非旨在欺骗您，而是直接测试您对语言的了解。

### Question (intermediate).

###问题（中级）。

The objective is to develop code that uses wrapper classes such as `Boolean`, `Double`, and `Integer`. Given the following code fragment:

目的是开发使用包装器类（例如Boolean，Double和Integer）的代码。 给定以下代码片段：

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

- A、 Runtime exception at line n1
- B、 true
- C、 false
- D、 Code runs with no output

### Answer.

###答案。

This question investigates primitive wrapper classes, particularly an odd aspect of the `Boolean` class and its factory. The exact topic of this question is perhaps unlikely on the real exam because it hinges on a piece of rote learning, and the exam tries to avoid such questions. However, this question tests multiple aspects of understanding and knowledge in a single question that, with luck, make it more interesting.


这个问题研究原始包装器类，尤其是Boolean类及其工厂的一个奇怪方面。在实际考试中，此问题的确切主题可能不太可能，因为它取决于一项死记硬背的学习，并且考试试图避免此类问题。但是，这个问题在一个问题中测试了理解和知识的多个方面，这很幸运，使它变得更加有趣。

Wrappers provide three main ways to obtain instances. Each wrapper provides a static factory in the method called `valueOf`. Also, if the context is sufficiently explicit, such as an assignment to a variable of the wrapper type from a primitive of matching type, autoboxing will occur. Autoboxing is simply a syntactic shorthand that allows the compiler to write the code to invoke the `valueOf` method and results in cleaner source code. The third approach is to call a constructor, using the `new` keyword. This third approach actually has been deprecated in Java 9, and one goal of this question is to investigate why it was deprecated.

包装器提供了三种获取实例的主要方法。每个包装器在名为“ valueOf”的方法中提供一个静态工厂。另外，如果上下文足够明确，例如从匹配类型的原语中分配包装类型的变量，则会发生自动装箱。自动装箱只是语法上的简写，它允许编译器编写代码来调用valueOf方法并生成更干净的源代码。第三种方法是使用“ new”关键字来调用构造函数。实际上，在Java 9中已经不赞成使用这种第三种方法，而这个问题的一个目标是研究为什么不赞成使用它。

In Java, anytime a constructor is invoked using the `new` keyword, only two outcomes are possible. Either a new instance of exactly the named type is created and returned, or an exception arises. This is actually a limitation and, today, factory methods are generally preferred because they can have these two effects, but they can also have additional outcomes.

在Java中，每当使用`new`关键字调用构造函数时，只有两个结果是可能的。要么创建并返回名称类型完全相同的新实例，要么发生异常。这实际上是一个限制，如今，通常首选工厂方法，因为它们可以产生这两种效果，但是它们也可以产生其他结果。

One capability of a factory, which is impossible for a constructor, is to return an existing object that matches the request. Given that the `Integer` wrapper is immutable, two objects of this type representing the same number are entirely interchangeable. Because of this, it’s a waste of memory to create two objects to represent the same value. Further, such an approach allows comparing such objects using `==` instead of the `equals(Object o)` method. With the `Integer` class, values in the range of -128 to +127 are typically reused in this way.

工厂的一种功能（对于构造函数而言是不可能的）是返回与请求匹配的现有对象。鉴于“整数”包装器是不可变的，表示相同数字的这种类型的两个对象是完全可以互换的。因此，创建两个表示相同值的对象会浪费内存。此外，这种方法允许使用“ ==”而不是“ equals（Object o）”方法比较这些对象。对于Integer类，通常以这种方式重用-128到+127范围内的值。

(As a side note, this behavior is similar in effect to using `String` literals instead of creating a `String` object—such as with `new String("1")`.)

（作为一个旁注，此行为实际上类似于使用`String`文字而不是创建`String`对象，例如使用`new String（“ 1”）`。）

Factory methods have two more advantages. If multiple factories are created, each method can have a different name, which means they could take identical argument type lists if that is appropriate. Doing that would be impossible with constructors, which must form valid overloads of one another.

工厂方法还有两个优点。如果创建了多个工厂，则每个方法可以使用不同的名称，这意味着如果合适的话，它们可以采用相同的参数类型列表。对于构造函数而言，这样做是不可能的，因为它们必须形成彼此的有效重载。

A third advantage is that a constructor inevitably returns an object of exactly the named type. A factory can return anything that’s assignment-compatible with the declared type (including implementations of interfaces, which can be an excellent way of hiding implementation details).

第三个优点是构造函数不可避免地返回名称类型完全相同的对象。工厂可以返回与声明类型兼容的所有内容（包括接口的实现，这是隐藏实现详细信息的绝佳方法）。

What’s most relevant in this question is that when you use `Boolean.valueOf(...)`, you get exactly two constant objects: one `Boolean.TRUE` and one `Boolean.FALSE`. These two are reused as many times as needed without taking up additional memory. This is impossible with calls to `new`.

这个问题最相关的是，当您使用Boolean.valueOf（...）时，会得到两个常数对象：一个Boolean.TRUE和一个Boolean.FALSE。这两个可以根据需要重复使用多次，而不会占用额外的内存。调用`new`是不可能的。

Now, the factories for most of the wrappers will throw an exception if they are provided with a null argument or with a string that doesn’t properly represent the type to be created (for example, if the `Integer.valueOf` factory is called with an argument "`five`" instead of "`5`"). However, the factory for the java.lang.`Boolean` class tests to see whether the argument string exists and contains the value "`true`" (without caring about capitalization). If so, it returns the value `Boolean.TRUE`. If not, it takes no further notice of the argument and returns `Boolean.FALSE`. This means that calling the factory with a null argument, or with the text "`nonsense`", results in `Boolean.FALSE` and no exception is thrown.


现在，如果大多数包装器的工厂提供有null参数或不能正确表示要创建的类型的字符串（例如，如果调用了Integer.valueOf工厂，则它们将引发异常）参数为“`5`”而不是“`5`”）。但是，Boolean类的工厂进行测试以查看参数字符串是否存在并包含值“ true”（无需大写）。如果是这样，它将返回值Boolean.TRUE。如果不是，则不进一步注意该参数，并返回Boolean.FALSE。这意味着使用空参数或文本“ nonsense”调用工厂将导致Boolean.FALSE，并且不会引发异常。

Based on this, you can determine that the code in line n1 does not throw an exception, and it assigns `Boolean.FALSE` to the variable `b1`. Therefore, option A is incorrect.

基于此，您可以确定第n1行中的代码没有引发异常，并将“ Boolean.FALSE”分配给变量“ b1”。因此，选项A不正确。

Now you need to investigate the behavior of the `if` statement and the comparison it contains.

现在，您需要研究if语句的行为及其包含的比较。

The general rule is that the test expression of an `if` statement must have `boolean` type. It’s probably obvious that a `Boolean` object will simply be unboxed to provide that type. If you had any doubt about this, you might wonder if the code would fail to compile. That’s not an unreasonable concern, because before the introduction of autoboxing with Java 5, the code would indeed have failed to compile. But even if you had such a concern, there’s no option expressing this, so it’s safe to assume that the obvious behavior occurs.

一般规则是，“ if”语句的测试表达式必须具有“ boolean”类型。很显然，布尔对象将被取消装箱以提供该类型。如果对此有任何疑问，您可能想知道代码是否无法编译。这不是一个不合理的问题，因为在Java 5引入自动装箱之前，代码确实无法编译。但是，即使您有这样的担忧，也无法表达这一点，因此可以放心地假设发生了明显的行为。

In this case, you’ve established that the object referred to by b1 represents a false value. Because of that, the `if` test fails, and the body of the code is not executed. From that, you can determine that option D is correct.

在这种情况下，您已经确定b1所引用的对象代表一个假值。因此，“ if”测试失败，并且代码主体未执行。由此，您可以确定选项D是正确的。

Although you know it’s not executed, in the context of this discussion, it seems worthwhile to consider what would have happened if the argument to the `print` call that’s inside the `if` statement were evaluated.

尽管您知道它没有执行，但是在本次讨论中，似乎值得考虑一下，如果对if语句中的print调用的参数进行了评估，将会发生什么。

Java provides two forms of equality comparison. One, the `==` operator, is part of the core language. The other, the `equals(Object o)` method, is essentially an API feature. It’s available on every object because it’s defined in the `java.lang.Object` class, but it doesn’t necessarily do anything useful unless a particular class chooses to implement it. It’s important to know when to use each of them and to apply them correctly, but this question is concerned only with the `==` operator, so let’s just look at that.

Java提供了两种形式的相等比较。其中一种，即==运算符，是核心语言的一部分。另一个等于“ Objects（Object o）”方法，本质上是一种API功能。每个对象都可以使用它，因为它是在`java.lang.Object`类中定义的，但是除非有特定的类选择实现它，否则它并不一定做任何有用的事情。知道何时使用它们并正确应用它们很重要，但是这个问题仅与`==`运算符有关，因此让我们来看一下。

The `==` operator compares the values of two expressions. That sounds simple enough except each value can be one of two different types depending on what the basic type of the expression is. This fact is important because the apparent effect of `==` is very different between the two types. By the way, the term “expression” is used here deliberately, and a variable is a simple expression. So if you prefer to think in terms of the values and types of variables, the discussion will still be `true`; you’ll just have a smaller chunk of truth than you might otherwise have had.

“ ==”运算符比较两个表达式的值。听起来很简单，只是每个值可以是两种不同类型之一，具体取决于表达式的基本类型。这个事实很重要，因为两种类型之间`==`的表观效果非常不同。顺便说一下，这里故意使用术语“表达式”，变量是一个简单的表达式。因此，如果您更愿意考虑变量的值和类型，那么讨论将仍然是“ true”。您所拥有的真相将比您原本所能拥有的要少。

The two broad types of an expression are primitive (which is one of the eight types `boolean`, `byte`, `short`, `char`, `int`, `long`, `float`, and `double`) and what’s called a `reference`. A `reference` is much like a pointer in that it’s a value that’s used to locate an object elsewhere in memory.

表达式的两种主要类型是原始类型（它是boolean，byte，short，char，int，long，float和double的八种类型之一）以及所谓的“参考”。 “引用”非常类似于指针，因为它是一个用于在内存中其他位置定位对象的值。

If the expression is a primitive type, the value of the expression actually is the thing you care about. Therefore, if an `int` expression has the value 32, the expression’s value actually is a binary representation of 32. Of course it is, you say! Well, yes, but the problem is that if a variable is of a reference type, for example, the type `Integer`, and you use it to refer to an object with the value 32, the value of the variable is not 32. Instead, it’s some magical number—a reference—that allows the JVM to find the object containing 32. And that means that for reference types (remember: that means anything except those eight primitives and, therefore, includes `Integer` expressions) the `==` test tells you not whether the expressions have equivalent meaning, but whether they refer to the exact same object. Crucially, if you have two `Integer` objects containing the value 32, but they’re different objects, they will have different reference values, and then comparing the expressions that refer to them by using `==` will produce the result false.

如果表达式是原始类型，则表达式的值实际上就是您所关心的东西。因此，如果“ int”表达式的值为32，则该表达式的值实际上是32的二进制表示形式。当然，您说的是！好吧，是的，但是问题是，如果变量是引用类型（例如，类型为Integer），并且使用它来引用值32的对象，则变量的值不是32。取而代之的是，它是一个神奇的数字（一个引用），它允许JVM查找包含32的对象。这意味着对于引用类型（请记住：这意味着除了那八个原语之外的任何东西，因此包括“ Integer”表达式）， ==`test不会告诉您这些表达式是否具有相等的含义，而是告诉您它们是否引用完全相同的对象。至关重要的是，如果您有两个包含值32的“整数”对象，但是它们是不同的对象，则它们将具有不同的引用值，然后使用`==`比较引用它们的表达式将产生错误结果。

At this point, it should be clear that if you had this code:

在这一点上，应该很清楚，如果您有以下代码：

```
Integer v1 = new Integer("1");
Integer v2 = new Integer("1");
System.out.print(v1 == v2);
```

then the output would definitely be false. As mentioned earlier, any call to `new` must produce either a new object of exactly the named type or an exception. That means that  and `v2` must refer to different objects, and that means the `==` operation must produce false.

那么输出肯定是错误的。 如前所述，对new的任何调用都必须产生名称类型完全相同的新对象或异常。 这意味着和`v2`必须引用不同的对象，这意味着`==`操作必须产生false。

If instead you had this code:

相反，如果您有以下代码：

```
Integer v1 = new Integer("1");
Integer v2 = 1;
System.out.print(v1 == v2);
```

which is closely parallel to the code in the question, using one constructor call and one use of autoboxing would still definitely print `false`. The object created by the constructor will be a unique new object and, therefore, not the one returned by the factory that provides the autoboxed value.

这与问题中的代码非常相似，使用一个构造函数调用和一种自动装箱方法仍然可以肯定地打印出“ false”。 构造函数创建的对象将是唯一的新对象，因此，不是提供自动装箱值的工厂返回的对象。

Factories for immutable objects are often coded so that they return the same object every time they’re called with the same arguments. The `Integer` class API documentation for the `valueOf(int)` method states the following:

不可变对象的工厂通常经过编码，以便每次使用相同的参数调用它们时都返回相同的对象。 valueOf（int）方法的Integer类API文档指出以下内容：

“This method will always cache values in the range -128 to 127, inclusive, and may cache other values outside of this range.”

“此方法将始终缓存-128至127（包括）范围内的值，并且可能缓存该范围之外的其他值。”

In other words, the following code:

换句话说，以下代码：

```
Integer v1 = Integer.valueOf(1);
Integer v2 = Integer.valueOf(1);
System.out.print(v1 == v2);
```

would definitely print `true`.

肯定会打印`true`。

The guarantee quoted earlier is mentioned only in the documentation for the `valueOf(int)` method and for `valueOf(String)`. However, in practice, both of these methods exhibit the same pooling behavior.

仅在文档中针对valueValue（int）方法和valueOf（String）提及了前面提到的保证。 但是，实际上，这两种方法都表现出相同的合并行为。

Of course, the question here discusses two `Integer` objects: one created with a constructor and the other using autoboxing (which uses the `Integer.valueOf(int)` method). This means that if the body of the `if` statement had been entered, the output would have been false. But you’ve already established that option D is correct, so options B and C must be incorrect, and this is just an interesting side discussion. We hope it’s an interesting one, of course! The correct option is D.

当然，这里的问题讨论了两个Integer对象：一个是使用构造函数创建的，另一个是使用自动装箱创建的（使用Integer.valueOf（int）方法）。 这意味着，如果输入了if语句的主体，则输出将为false。 但是您已经确定选项D是正确的，因此选项B和C必须不正确，这只是一个有趣的附带讨论。 我们当然希望这是一个有趣的活动！ 正确的选项是D。

原文链接: <https://blogs.oracle.com/javamagazine/quiz-intermediate-wrapper-classes>
