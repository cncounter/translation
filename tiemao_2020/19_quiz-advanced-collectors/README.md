# Quiz Yourself: Using Collectors (Advanced)）

> Where care is needed to get the results you expect from the Collectors class

If you have worked on our quiz questions in the past, you know none of them is easy. They model the difficult questions from certification examinations. The levels marked “intermediate” and “advanced” refer to the exams, rather than the questions. Although in almost all cases, “advanced” questions will be harder. We write questions for the certification exams, and we intend that the same rules apply: Take words at their face value and trust that the questions are not intended to deceive you, but straightforwardly test your knowledge of the ins and outs of the language.


# Java坑人面试题系列: 集合（高级难度）

> 怎样才能从 Collectors 工具类获取预期的结果

Java Magazine上面有一个专门坑人的面试题系列: <https://blogs.oracle.com/javamagazine/quiz-2>。

这些问题的设计宗旨，主要是测试面试者对Java语言的了解程度，而不是为了用弯弯绕绕的手段把面试者搞蒙。

如果你看过往期的问题，就会发现每一个都不简单。

这些试题模拟了认证考试中的一些难题。 而 “中级(intermediate)” 和 “高级(advanced)” 指的是试题难度，而不是说这些知识本身很深。 一般来说，“高级”问题会稍微难一点。

The objective is to save results to a collection using the `collect` method and group or partition data using the `Collectors` class. Given the following `Student` class and given a `Stream<Student> s` that is initialized, unused, in scope, and contains students of varying ages:

假设我们需要使用 `Collectors` 工具类的 `collect` 方法, 将结果保存到某个集合中，并使用Collectors类将数据分组或分区。
给定如下的 `Student` 类定义：

```java
class Student {
    private String name;
    private Integer age;

    Student(String name, Integer age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public Integer getAge() { return age; }
}
```

Which of the following code fragments prints the number of students under 18 and the number of students 18 years old or older in the best way? Choose one.

假设方法中已经初始化好了 `Stream<Student> s`，其中包含不同年龄的学生,
下面的哪段代码能根据年龄正确输出特定年龄段的学生数量？

- A.

```java
s.collect(Collectors.groupingBy(
             Student::getAge() >= 18,
             Collectors.counting()))
 .forEach((c, d) -> System.out.println(d));
```

- B.

```java
s.collect(Collectors.groupingBy(
      a -> a.getAge() >= 18,
          Collectors.mapping(
              Student::getName,
              Collectors.counting())))
 .forEach((c, d) -> System.out.println(d));
```

- C.

```java
s.collect(Collectors.partitioningBy(
    a -> a.getAge() >= 18, Collectors.counting()))
 .forEach((c, d) -> System.out.println(d));
```

- D.

```java
List<Integer> l = Arrays.asList(0, 0);
s.forEach(w -> {
    if (w.getAge() >= 18) {
        l.set(1, l.get(1) + 1);
    } else {
        l.set(0, l.get(0) + 1);
    }});
l.forEach(System.out::println);
```


## Answer.

This question demonstrates several ways to collect data and group it according to a criterion.
Options A, B, and C aim to do this using utilities from the `Collectors` class together with a `Stream.collect` method.
Option D takes a handcrafted approach.

Let’s address the easy option first. In option A, the code contains a significant syntax error. It attempts to use a method reference to invoke a method in this expression:

这道题考察的是采集数据并根据规则进行分组的方法。
选项A，选项B和选项C使用工具类 `Collectors` 以及 `Stream.collect` 方法。
选项D采用手工编码的方法。

让我们先从简单的选项看起。 在选项A中，代码中含有明显的语法错误。 其试图用一个方法引用来调用方法：

```java
Student::getAge()
```

This syntax is illegal; method reference syntax cannot be used in this way, which tells you that option A is incorrect.

The exam generally tries to avoid “human compiler” type tests because such a skill isn’t useful in these days of IDEs that check syntax as you type. If this were the only reason to reject this option, it would probably be rejected from the real exam. However, two additional reasons exist to reject this option. One is that the approach of another option is better designed; it’s only a marginal improvement, but it’s real, and you’ll see it soon. The second reason is that there’s another correct answer, and you must select only one. Therefore, finding the other answer should prompt you to pay close attention and notice the error. A hint here is that in this exam, it’s unwise to simply select the first answer you see that appears to be correct. Unless you’re short of time, take a moment to satisfy yourself that all the other answers are actually incorrect.

It’s worth noting that if you replace the expression containing the syntax error

在Java中这种语法是错误的；方法引用不能以这种方式来使用，所以可以判定选项A不正确。

一般来说正规考试中都会避免考察 “人为编译” 之类的试题， 老实说，这种技能在今天没多少实用价值，因为我们一般都在IDE环境中开发, 自动语法检查会自动识别这些错误。
但面试者没得选对吧，语法不过关，谁敢录用你呢。
当然，如果不确定这个选项对不对的话，我们可以看后面的其他选项，毕竟这是单选题。 如果其他答案确定没错，那就选那一项。
一个小技巧： 一上来就选A肯定是不明智的，除非你没时间看题。

那么如果问得深一点，怎么修正这种错误呢？

```java
Student::getAge() >= 18
```

with this corrected version:

可以改成下面这样的Lambda表达式：

```java
a -> a.getAge() >= 18
```

then option A would produce the correct output and only the question of design quality would remain.

For now, however, it’s clear that option A should be rejected immediately and that you will find the better-designed approach and see why it’s better designed.

The code in option B compiles successfully and prints the correct result. To understand this, let’s examine the behaviors of some of the key features of the `Collections` class. The `groupingBy` method creates a `Collector` behavior that takes a function as argument. That function is called the classifier. For example, consider this code, which performs a `groupingBy` collection operation on a stream of names:

这就能产生正确的输出结果，至于编码质量好不好那就是另外的问题了。

到目前为止，很明显选项A是错误的，接着往下看。

选项B中的代码可以成功编译并输出正确的结果。
要理解这部分代码，可以看一下 `Collections` 类中的 `groupingBy` 方法， 这个方法接收一个函数作为参数， 称为分类器(classifier)。
例如以下代码，可以对 name 流执行 `groupingBy` 收集操作：

```java
Stream.of("Fred", "Jim", "Sheila", "Chris",
          "Steve", "Hermann", "Andy", "Sophie")
      .collect(Collectors.groupingBy(n -> n.length()))
```

The following expression is the classifier; it takes the name (as a String) and returns its length:

对应的分类器表达式如下， 可以看到，其接收的参数是姓名，返回的结果是姓名对应的长度。

```java
n -> n.length()
```

The effect would be to build a `Map<Integer, List<String>>` that looks like what’s shown in Table 1:

执行后得到的结果是一个 `Map<Integer, List<String>>`, 内容大致如下所示：


| Key | Value                    |
| :-- | :----------------------- |
| 3   | List["Jim"]              |
| 4   | List["Fred", "Andy"]     |
| 5   | List["Chris", "Steve",]  |
| 6   | List["Sheila", "Sophie"] |
| 7   | List["Hermann"]          |

> Table 1. Keys and their associated values

Notice how the `Map` contains each of the values returned by the classifier as a key, and the value associated with that key is a `List` containing all the stream items that produced that key.

A variant of the `groupingBy` behavior allows you to have a “downstream collector.” Instead of simply adding the items that produce a particular key into a list of all such items, this allows you to use a subsequent collection operation to process the items. This is somewhat akin to a secondary stream process working on the items that would have been sent to the `List`. One collector that’s commonly used in the downstream position is the `counting` collector. Using this in your process would change the values from being lists of names to being a count of the number of elements that would have been in the list.

This code

注意， `Map` 将分类器返回的值作为Key，产生对应Key的数据流则放到 `List` 中，变成Value部分。

使用 `groupingBy` 行为的一种变体，可以拥有一个“下游收集器”。
与其简单地将产生特定 Key 的数据添加到 list 中，不如在后续的收集操作中来处理这些数据。
这有点类似于对要发送到 List 中的数据进行二次流处理。
下游位置常用的一种收集器是 `counting` 收集器。 在处理过程中可以把姓名列表中的值转换为列表中的元素个数。

代码示例如下:

```java
Stream.of("Fred", "Jim", "Sheila", "Chris",
          "Steve", "Hermann", "Andy", "Sophie")
      .collect(Collectors.groupingBy(
          n -> n.length(),
          Collectors.counting()))
```

would return the `Map<Integer, Long>` shown in Table 2:

返回结果如下表所示：


| Key | Value |
| :-- | :---- |
| 3   | 1     |
| 4   | 2     |
| 5   | 2     |
| 6   | 2     |
| 7   | 1     |

> Table 2. Keys and their associated values when a downstream collector is used

> 表格2: 下游处理器的执行结果

Now, the behavior of option B is similar to this idea, but it has a couple of variations. First, the classifier—and, hence, the keys in the resulting `Map` — are boolean in nature, rather than numeric. That’s fine, because it suits the purpose of classifying students who are over 18 and those who are not over 18. However, the code in option B actually has two downstream operations chained, rather than one. This is certainly permissible and can be very useful. But in this case, the first downstream collector actually performs a mapping operation that extracts from each `Student` object the name of the `Student`. The second downstream collection counts the resulting names.

可以看到，选项B的行为与问题要求比较类似，但有一些变化。
首先，分类器产生的结果Map的key本质上是布尔值，而不是数字，因为需要对18岁以上和18岁以下的学生进行分类。
但是，选项B中的代码实际上链接了两个下游操作，当然也必须链接2个。
但是第一个下游收集器执行的却是映射操作，从每个 `Student` 对象中提取名称。
第二个下游集合对结果的名称进行计数。

The mapping operation does not render the result incorrect; the code effectively counts the names of the students over or under 18 years of age and produces the same numbers. However, it’s a waste of effort and, as such, the code is not optimally efficient, nor is it the most readable, because it includes distracting, irrelevant code that risks causing confusion. You will see shortly that another option avoids this wasted effort, and that option will show you that option B is incorrect. Despite producing the correct response, option B is not the most efficient option.

映射操作在这里并不会产生错误； 而且也有效地统计了18岁以上或18岁以下的学生姓名，并产生相同的数字。
但是做了些无用功，代码的效率也不是最佳， 可读性也不好，因为使用了一些不相关的代码，容易引起混淆和分散注意力。
继续往下看我们会发现有更好的选择，所以选项B并不是最有效的选项。

In addition to the `groupingBy` behavior factory in the `Collectors` class, there is another factory that produces a result that’s somewhat similar. This factory is called `partitioningBy`, and the difference in its behavior is simply that instead of creating a `Map` with an arbitrary key type, it specifically creates a Map with a `Boolean` key. To support this, the classifier should be a predicate rather than a function. Option C uses the `partitioningBy` behavior and produces the correct output. It is better than option B for two reasons: First, it does not involve the wasted step of extracting names from the students. Second, `partitioningBy` is specifically provided exactly for the purpose of grouping by a simple true/false result and, as such, it is a (marginally) better design choice. By the same logic, it would be better than option A, even if that option had valid syntax.

`Collectors` 类中除了 `groupingBy` 工厂方法，另一个 `partitioningBy` 方法产生的结果也有点类似。
其行为上的区别仅在于，它创建的部署任意 key 类型的 `Map`，而是专门创建了具有 `Boolean` key 的 Map。
为了支持这一点，分类器需要是谓词而不是函数。
选项C使用 `partitioningBy` 方法并产生了正确的结果。
比选项B更好，原因有两个：
首先，它不需要提取学生姓名。
第二， `partitioningBy` 是为了简单地按 `true/false` 结果分组而专门提供的方法。
因此，这是一种更好的设计选择。
按照相同的逻辑，也比选项A更好，虽然选项A也具有有效的语法。

Option D uses handcrafted code and might also produce the correct answer. The major problem is that this code operates by means of side effects. Specifically, it modifies variables outside a lambda expression. This kind of behavior makes code unsafe in concurrent or parallel execution; particularly in stream-based systems, this type of code should be avoided precisely because a stream can easily be run in a parallel mode.

选项D使用手工编写的代码，也可以产生正确的结果。
主要的问题是此代码通过副作用来生效。
具体来说，它会修改lambda表达式之外的变量。
这种行为使代码在并发执行时并不安全；
特别是在基于流的系统中，应避免使用此类代码，因为流可以在并行模式下轻松地运行。

It’s worth noting that when the lambda expression (and before it, method local classes) was designed, this idea was loosely expressed by the prohibition on accessing other method local variables from inside lambdas or nested classes unless those variables are effectively final. The code in option D creates its side effects by using an effectively final reference to reach the mutable data in the `List` to which it refers.

The code compiles successfully, and if the stream ran sequentially, it would print the correct result. However, it is badly designed, and if the stream were parallel, it would fail. Because the design is unsound and would fail if the stream were parallel, option D is incorrect.

The correct answer is option C.

值得注意的是，在设计lambda表达式或者方法内部类时，禁止从lambda或内部类中访问局部变量，除非是 final 变量。
选项D中的代码通过使用有效的 final 引用来到达其所引用的 `List` 中的可变数据，从而产生其副作用。

代码可以成功编译，如果stream按顺序运行，则会打印正确的结果。
但是，这种设计不合理，如果流是并行的，将会执行失败，因此选项D不正确。

正确答案是选项C。

- [GitHub中英双语版本: ](https://github.com/cncounter/translation/blob/master/tiemao_2020/19_quiz-advanced-collectors/README.md)

- <https://blogs.oracle.com/javamagazine/quiz-advanced-collectors>
