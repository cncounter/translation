# Optimizing regular expressions in Java
# Java正则表达式优化


### A guide to pattern matching without the performance drag

### 消除模式匹配的性能障碍


If you've struggled with regular expressions that took hours to match when you needed them to complete in seconds, this article is for you. Java developer Cristian Mocanu explains where and why the regex pattern-matching engine tends to stall, then shows you how to make the most of backtracking rather than getting lost in it, how to optimize greedy and reluctant quantifiers, and why possessive quantifiers, independent grouping, and lookarounds are your friends.

如果你只是偶尔需要,却花了大量的时间来匹配正则表达式,那么这篇文章很适合你看。 Java程序员 Cristian Mocanu 将为你讲解正则表达式模式匹配引擎(regex pattern-matching engine)在什么地方会停滞(stall),以及停滞的原因； 然后向您展示如何充分利用回溯(backtracking)，而不要迷失； 如何优化贪婪量词(greedy quantifiers)以及 惰性量词(reluctant quantifiers)； 以及为什么 占有量词(possessive quantifiers), 固化分组(independent grouping), 环视(lookarounds)是很有效的处理方法。


> Writing a regular expression is more than a skill -- it's an art.
> 
> 编写正则表达式不仅仅是一种技巧 —— 更是一门艺术。
> 
> -- Jeffrey Friedl


##



In this article I introduce some of the common weaknesses in regular expressions using the default java.util.regex package. I explain why backtracking is both the foundation of pattern matching with regular expressions and a frequent bottleneck in application code, why you should exercise caution when using greedy and reluctant quantifiers, and why it is essential to benchmark your regex optimizations. I then introduce several techniques for optimizing regular expressions, and discuss what happens when I run my new expressions through the Java pattern-matching engine.

在本文中,我将介绍一些常见的弱点在正则表达式中使用默认值 java.util.regex 包中。 我解释为什么回溯是用正则表达式模式匹配的基础和频繁的瓶颈在应用程序代码中,为什么时,您应该保持谨慎使用贪婪和不情愿的量词,以及为什么基准你的正则表达式的优化至关重要。 然后我介绍几个技术优化正则表达式,并讨论发生了什么当我运行我的新表达式通过Java模式匹配引擎。


For the purpose of this article I assume that you already have some experience using regular expressions and are most interested in learning how to optimize them in Java code. Topics covered include simple and automated optimization techniques as well as how to optimize greedy and reluctant quantifiers using possessive quantifiers, independent grouping, and lookarounds. See the Resources section for an [introduction to regular expressions in Java](http://www.javaworld.com/article/2077757/core-java/optimizing-regular-expressions-in-java.html#resources).



对于本文的目的,我认为你已经有一些经验使用正则表达式和最感兴趣的学习如何优化Java代码。 主题包括简单和自动优化技术以及如何优化贪婪和不情愿的量词使用物主量词,独立的分组,看看。 请参见参考资料部分的 [介绍用Java正则表达式](http://www.javaworld.com/article/2077757/core-java/optimizing-regular-expressions-in-java.html#resources) 。

> ####Notation
> 
> I use double quotes ("") to delimit regular expressions and input strings, X, Y, Z to denote regular sub-expressions or a portion of a regular expression, and a, b, c, d (et-cetera) to denote single characters.

符号

我使用双引号( ”“ )划入正则表达式和输入字符串, x,y,z 表示普通子表达式或正则表达式的一部分,和 a,b,c,d (等等)来表示单个字符。


### The Java pattern-matching engine and backtracking

### Java模式匹配引擎和回溯



The `java.util.regex` package uses a type of pattern-matching engine called a Nondeterministic Finite Automaton, or NFA. It's called *nondeterministic* because while trying to match a regular expression on a given string, each character in the input string might be checked several times against different parts of the regular expression. This is a widely used type of engine also found in .NET, PHP, Perl, Python, and Ruby. It puts great power into the hands of the programmer, offering a wide range of quantifiers and other special constructs such as lookarounds, which I'll discuss later in the article.

的 java.util.regex 包使用一种模式匹配引擎称为非确定性有限自动机,或NFA。 这就是所谓的 不确定性 因为在试图匹配正则表达式在给定的字符串,输入字符串中的每个字符可能会检查几次对正则表达式的不同部分。 这是一种广泛使用的引擎还发现。 净、PHP、Perl、Python和Ruby。 它让大国手中的程序员,提供一个广泛的量词和其他特殊结构如看看,我将在本文后面讨论。


At heart, the NFA uses *backtracking*. Usually there isn't only one way to apply a regular expression on a given string, so the pattern-matching engine will try to exhaust all possibilities until it declares failure. To better understand the NFA and backtracking, consider the following example:


从本质上说,NFA的用途 回溯 。 通常没有只有一种方式应用正则表达式在给定的字符串,所以模式匹配引擎将尝试排气所有可能性,直到宣布失败。 为了更好地理解NFA,回溯,考虑下面的例子:


> The regular expression is "`sc(ored|ared|oring)x`" The input string is "`scared`"


正则表达式是“ sc(或|火鸟|打鼾)x “输入字符串” 害怕 ”

First, the engine will look for "`sc`" and find it immediately as the first two characters in the input string. It will then try to match "`ored`" starting from the third character in the input string. That won't match, so it will go back to the third character and try "`ared`". This will match, so it will go forward and try to match "`x`". Finding no match there, it will go back again to the third character and search for "`oring`". This won't match either, and so it will go back to the second character in the input string and try to search for another "`sc`". Upon reaching the end of the input string it will declare failure.


首先,引擎将寻找” SC ”,立即找到它的前两个字符输入字符串。 它将尝试匹配” 或 “从第三输入字符串中的字符。 不匹配,所以它将回到第三性格和尝试“ 火鸟 ”。 这将匹配,所以它会继续前进,试图匹配” X ”。 在这里没有发现匹配,它将再次回到第三性格和搜索“ 打鼾 ”。 这也不匹配,所以它将回到第二个输入字符串中的字符并尝试寻找另一个“ SC ”。 到达输入字符串的结束,它将宣布失败。

### Optimization tips for backtracking

### 优化技巧回溯

With the above example you've seen how the NFA uses backtracking for pattern matching, and you've also discovered one of the problems with backtracking. Even in the simple example above the engine had to backtrack several times while trying to match the input string to the regular expression. It's easy to imagine what could happen to your application performance if backtracking got out of hand. An important part of optimizing a regular expression is minimizing the amount of backtracking that it does.


在上面的例子中您已经看到NFA如何使用模式匹配的回溯,和你也发现回溯的问题之一。 即使在发动机上面的简单的例子必须回溯几次,试图匹配输入字符串的正则表达式。 很容易想象会发生什么你的应用程序的性能,如果回溯失控。 优化正则表达式的一个重要组成部分是最小化的回溯。


> ... 其他部分页面










原文链接: [http://www.javaworld.com/article/2077757/core-java/optimizing-regular-expressions-in-java.html](http://www.javaworld.com/article/2077757/core-java/optimizing-regular-expressions-in-java.html)


> 杯具. http://blog.csdn.net/mydeman/article/details/1800636

