# Quiz Yourself: Comparing Loop Constructs (Intermediate)

＃ Java坑人面试题系列: 比对while与for循环（中级难度）


If you have worked on our quiz questions in the past, you know none of them is easy. They model the more difficult questions from certification examinations. The levels marked “intermediate” and “advanced” refer to the exams, rather than the questions. Although in almost all cases, “advanced” questions will be harder. We write questions for the certification exams, and we intend that the same rules apply. Take words at their face value and trust that the questions are not intended to deceive you, but straightforwardly test your knowledge of the ins and outs of the language.

Java Magazine上面有一个专门坑人的面试题系列: <https://blogs.oracle.com/javamagazine/quiz-2>。

这些问题的设计宗旨，主要是测试面试者对Java语言的了解程度，而不是为了用弯弯绕绕的手段把面试者搞蒙。

如果你看过往期的问题，就会发现每一个都不简单。

这些试题模拟了认证考试中的一些难题。 而 “中级(intermediate)” 和 “高级(advanced)” 指的是试题难度，而不是说这些知识本身很深。 一般来说，“高级”问题会稍微难一点。


> Which loop construct would you use when looping on manual user input? Subtleties abound...

> 请回答一个问题: 在使用循环进行遍历时，你更喜欢使用哪种循环？ `for` 还是 `while`。


### Question (intermediate).

### 问题（中级难度）

The objective is to compare loop constructs.

Imagine that you are writing an interactive console application that does the following:

1. Prints a prompt
2. Reads a command as input
3. If the input was `quit`, exits; otherwise, executes the specified command and restarts at step 1

Which code construction would be the best option to implement the scenario? Choose one.

- A、 A `for` loop with a `break` statement
- B、 An enhanced `for` loop
- C、 A `while` loop with a `continue` statement
- D、 A `do/while` loop

问题的目标是比较Java中各种循环的语法。

假设需要编写程序，在控制台引导用户输入，并进行响应， 执行的步骤大致是这样的：

1. 输出提示和引导信息;
2. 读取用户输入的指令；
3. 如果指令为 `quit`, 则退出程序；如果输入其他指令，则执行对应的逻辑，完成后跳转到第1步。

要实现上述功能，使用哪种语法和方式最好？ 请选择:

- A、 使用 `for` 循环和 `break` 语句;
- B、 使用简写/增强的 `for` 循环;
- C、 使用 `while` 循环和 `continue` 语句;
- D、 使用 `do/while` 循环;




### Answer.

This question asks you to make a value judgment and that’s often frowned upon in a multiple-choice exam. However, in this case, the judgment is fairly standard, and by the time the entire explanation has been presented, we’re inclined to think you’ll agree.

Two key observations can be made here that will guide selection of an appropriate loop. One is that steps 1 and 2 must be executed at least once; that is, the code is not expected to exit until after at least one command has been read. Another observation—closely related to the first—is that it’s not possible to make the decision to exit the program until after a command has been read.

Let’s consider how these requirements would affect your implementation if you try to use a `while` loop. The first observation is that a `while` loop performs its test right at the entry to the loop; that test is performed before the body of the loop is executed at all. Therefore, if the loop is used to control the program’s life and shutdown, one possibility would be to print a prompt and read a command before the loop starts, as in this pseudocode:

### 答案和解析

这个问题要求做一个最佳选择，一般不会让你选择多个答案。

有两个关键的地方，可以帮助我们进行判断。
一、 步骤1和步骤2都必须至少执行一次; 也就是说，至少要读取一个命令之后，代码才会退出。
二、 在读取命令之前，不可能做出退出程序的决定。

让我们考虑一下，如果使用 【`while`循环】需要怎么处理。
首先 `while` 循环在入口处执行条件判断; 该测试是在循环体执行之前执行的。
所以，如果使用`while` 循环来进行控制，一种可能的方式，是在循环开始之前打印提示并读取命令，伪代码所下所示:


```
Issue prompt                  // 打印提示引导信息
Read command                  // 读取用户指令
While (command is not "quit") // 判断如果命令不是quit才进入循环
  Execute the command         // 执行命令...
  ...
```

Now, that approach might not look like a problem, but you still need to issue subsequent prompts and read the subsequent commands. That must be done every time through the loop, so the relevant code must be inside the loop. That means the code must be in two places at once, which is an indirect way of saying that it must be duplicated. The code would look like this:

可能初看起来没有什么问题，但我们还需要提示并并读取后续命令。
每次的循环操作中都需要执行这个操作的相关代码。
也就是说会有代码重复。伪代码示例如下:

```
Issue prompt                  // 打印提示引导信息
Read command                  // 读取用户指令
While (command is not "quit") // 判断如果命令不是quit才进入循环
  Execute the command         // 执行命令
  Issue prompt                // 打印提示引导信息; 【重复代码】
  Read command                // 读取用户指令; 【重复代码】
End-while                     // while循环结束
```

Duplication of code is ugly and error-prone during maintenance. An alternative approach would be to set the command to some dummy value before the loop, and make sure that executing the dummy command does nothing. This would avoid duplication but it’s still additional complexity, and it might be difficult to understand, because it uses special values to effectively “hack” its own behavior.

This problem must surely be a strike against the use of a `while` loop, but consider the other possibilities before you make your value judgment.

Next, let’s consider the standard `for` loop. A `for` loop is really only a `while` loop with some decorations, and the decorations address two scenarios common in loop constructions. One is the initialization (and perhaps declaration) of some variables that will be used in the loop. The other is updating variables that change through the iterations. However, at its heart, a `for` loop is just a `while` loop with extras. It’s possible that one of those extras might be useful in this scenario, but you still have the fundamental problem that you’ll need to duplicate the prompting and input-reading code.


重复代码不仅看起来不爽，在维护过程中也容易出错，对于追求卓越的程序员来说是不好的习惯。
另一种方式，是在循环之前将命令设置为某个虚拟值，并确保在碰到虚拟命令时不会执行任何操作。
这能避免重复代码，但也会带来额外的复杂性，以后阅读代码的人可能难以理解，因为必须使用特殊的值来进行“hack”。

这种情景直接使用 `while` 循环肯定不太合理，下面我们再来看看其他方案。

接下来，看看如果使用 【`for`循环】 怎么处理。
`for` 循环实际上是另一种方式的 `while` 循环， 目的是为了在某些场景下编程更加直观和容易理解。
常见的两种场景是:

- 一、 将循环中使用的一些变量进行声明和初始化。
- 二、 在迭代过程中更新某些变化量。

从根本上来说,  `for` 是 `while` 循环加一些额外部分形成的。
在这个场景中，这些额外部分可能会有用，但仍然会存在重复的 [提示和读取输入] 代码。

Next, let’s consider the enhanced `for` loop. An enhanced `for` loop provides a cleaner means of processing every element from an Iterable object. (The target Iterable is commonly, but not necessarily, provided by a collection such as a List.) In the specified problem, items must be read from the console as input, and termination of the loop occurs when the input value is `quit`. By contrast, the enhanced `for` loop takes items from an Iterable and terminates when no more items are available. Although it’s possible to create an Iterable object that prompts the user, reads a line of text, returns a String if the user’s input wasn’t `quit`, and terminates the iteration if the user’s input was `quit`, this is convoluted and rather indirect for this scenario. There doesn’t seem to be much to recommend the enhanced `for` loop in this situation, so let’s consider the final option.

然后我们一起来考察【简写的`for`循环】（enhanced for loop，增强的for循环）。
增强的`for`循环提供了一种简洁的方式来遍历可迭代对象（Iterable object，如集合/数组）。
在本文指定的问题中，必须从控制台读取输入命令，当输入值为 `quit` 时循环终止。
虽然也可以创建一个 Iterable 对象来引导提示用户，并读取文本内容，如果输入不是`quit`时就返回字符串。 如果用户的输入是 `quit`，则终止迭代，但对于这个场景来说，这种实现方式就很复杂了，而且也不直观。
在这种情况下，似乎不能推荐使用增强的`for`循环，可以把它留下作为备选，看看有没有更好的方式。


The remaining option is the `do/while` loop. The test that determines whether to iterate this loop is placed at the end of the `do/while` construction, which has consequences. Any `do/while` loop always executes at least once, because execution has to pass through the body of the loop to reach the test. Another perspective on this is to note that the body of the loop executes before the test is performed. This is much more appropriate for the proposed scenario. The prompt can be issued, and the command input can be read, in the body of the loop. The result, without any duplicated code, ensures that the prompt and input happen before the test, and the resulting structure will be clean and simple.

At this point, it’s probably clear that option D fits the scenario perfectly and, as such, it’s a much better choice than the others. Therefore, you can finally say that option D is correct and options A, B, and C are incorrect.

Here are a few side notes. Option A mentions using a `break` statement and option C mentions using a `continue`. A structure using `for` and a `break` could be pressed into service, but neither of these suggestions results in an elegant solution. Option A might be coded along these lines:


剩下的选项是 `do/while` 循环。 这种方式将决定是否继续循环的测试条件放在 `do/while` 结构的末尾，
效果就是 `do/while` 循环的body至少会被执行一次，因为必须先执行body之后才能到达测试条件判断。
也就是循环体是在判断条件之前执行的。
`do/while` 主要就是适用于这样的场景: 可以在循环体中进行引导提示，并读取命令输入。
这样就没有重复的代码，确保提示和输入发生在条件判断之前，代码结构会比较干净和简洁。

那么很明显， 选项`D`非常适合这个场景， 因此，它是比其他选项更好的选择。

通过这些解析，我们最终可以说 `选项D是正确答案`，而选项A、B和C是不正确的。

> 注: 选项A中提到使用 `break` 语句，而选项C提到使用 `continue` 语句。
> 虽然使用 `for` 和 `break`的方式也可以让循环体强制执行，但这两种方式的代码也不会很优雅。

选项A的伪代码大致如下:

```
for (;;) {                   // 死循环
    ......                   // 展示引导和提示信息
    String input = ...       // 读取用户输入
    if (input.equals("quit"))
        break;               // 如果是quit则退出循环
    executeCommand(input);   // 否则就执行命令...
}
```

However, this is still ugly compared to the use of a `do/while` loop. Similarly, the use of a `continue` in a `while` loop does not offer any obvious route to a clean solution.

The correct option is D .

但依然没有 `do/while` 方式直观和简洁。  

而在 `while` 循环中使用 `continue` 则是标准的错误答案，你没法构造出一个可执行的解决方案。

### 总结

正确的选项是D。

`do/while` 主要就适用这种至少执行1次的场景。

当然，在某些开源代码中你会发现只执行一次的代码 `do{ if-break; } while(true);` 的方式，这种方式的好处是可以减少if嵌套的深度，而且可以进行中断。 一层一层的嵌套代码实际上是难以维护和理解的，而抽象为方法又涉及传值的问题，所以怎么方便就怎么来是比较好的选择。




### 相关链接

- [Java坑人面试题系列: 包装类（中级难度）](https://renfufei.blog.csdn.net/article/details/104163518)
- [Java坑人面试题系列: 哪种循环效率高（中级）](https://blogs.oracle.com/javamagazine/quiz-intermediate-loop-constructs)
- [Java坑人面试题系列: 集合（高级）](https://blogs.oracle.com/javamagazine/quiz-advanced-collectors)
- [Java坑人面试题系列: 线程/线程池（高级）](https://blogs.oracle.com/javamagazine/quiz-advanced-executor-service)

原文链接: <https://blogs.oracle.com/javamagazine/quiz-intermediate-loop-constructs>
