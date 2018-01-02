# Java基础系列(3): 正则量词与模式

>###名词解释
>
>`greedy`: 贪婪模式,最大匹配模式;
>
>`reluctant`: 懒惰模式,最小匹配模式;
>
>`possessive`: 占有型,全部匹配模式; 也翻译为[`支配型`];


### Quantifiers

### 量词

Quantifiers allow you to specify the number of occurrences to match against. For convenience, the three sections of the Pattern API specification describing greedy, reluctant, and possessive quantifiers are presented below. At first glance it may appear that the quantifiers X?, X?? and X?+ do exactly the same thing, since they all promise to match "X, once or not at all". There are subtle implementation differences which will be explained near the end of this section.


量词(Quantifier)用来指定正则匹配需要的次数。为了方便，分为3个部分介绍 Pattern API 规范, 分别是 greedy(贪婪), reluctant(懒惰), 和 possessive(占有) 量词。表面上看, `X?`, `X??` 和 `X?+` 这几种量词都差不多, 都是匹配 "出现0到1次大写的X"。 下文将会讲解他们在实现上的细微差别。



<table>
<tbody><tr>
<th>Greedy(贪婪)</th>
<th>Reluctant(懒惰)</th>
<th>Possessive(占有)</th>
<th>说明</th>
</tr>
<tr>
<td><code>X?</code></td>
<td><code>X??</code></td>
<td><code>X?+</code></td>
<td><code>X</code>, 出现0或1次</td>
</tr>
<tr>
<td><code>X*</code></td>
<td><code>X*?</code></td>
<td><code>X*+</code></td>
<td><code>X</code>, 出现0到多次</td>
</tr>
<tr>
<td><code>X+</code></td>
<td><code>X+?</code></td>
<td><code>X++</code></td>
<td><code>X</code>, 出现1到多次</td>
</tr>
<tr>
<td><code>X{n}</code></td>
<td><code>X{n}?</code></td>
<td><code>X{n}+</code></td>
<td><code>X</code>, 精确匹配 <code>n</code> 次</td>
</tr>
<tr>
<td><code>X{n,}</code></td>
<td><code>X{n,}?</code></td>
<td><code>X{n,}+</code></td>
<td><code>X</code>, 最少出现 <code>n</code> 次</td>
</tr>
<tr>
<td><code>X{n,m}</code></td>
<td><code>X{n,m}?</code></td>
<td><code>X{n,m}+</code></td>
<td><code>X</code>, 最少出现 <code>n</code> 次, 最多出现 <code>m</code> 次</td>
</tr>
</tbody></table>


Let's start our look at greedy quantifiers by creating three different regular expressions: the letter "a" followed by either ?, *, or +. Let's see what happens when these expressions are tested against an empty input string "":

下面通过示例来分析：字母 "`a`" 后面紧跟 `?`, `*`, 或者 `+` 这三种量词的区别。 先测试一下空字符串 `""` 的情形：


```
Enter your regex: a?
Enter input string to search: 
I found the text "" starting at index 0 and ending at index 0.

Enter your regex: a*
Enter input string to search: 
I found the text "" starting at index 0 and ending at index 0.

Enter your regex: a+
Enter input string to search: 
No match found.
```


### 零长度匹配(Zero-Length Matches)


In the above example, the match is successful in the first two cases because the expressions a? and a* both allow for zero occurrences of the letter a. You'll also notice that the start and end indices are both zero, which is unlike any of the examples we've seen so far. The empty input string "" has no length, so the test simply matches nothing at index 0. Matches of this sort are known as a zero-length matches. A zero-length match can occur in several cases: in an empty input string, at the beginning of an input string, after the last character of an input string, or in between any two characters of an input string. Zero-length matches are easily identifiable because they always start and end at the same index position.

在上面的演示中, 前两次都匹配成功, 因为 `a?` 和 `a*` 都允许出现 0 个 `a`.  您还应该注意到, 开始索引和结束索引 都是 0, 这可能和以前所见过的情况不同。输入的空字符串` ""` 长度,  所以只会在索引0处匹配。这种匹配被称为零长度匹配. 

可能出现在下列情况:  输入值为空字符串, 或者在字符串的开头, 或者在字符串结尾字符之后, 或在任意两个字符之间.  零长度匹配很容易辨认,  因为开始位置和结束位置一样。


Let's explore zero-length matches with a few more examples. Change the input string to a single letter "a" and you'll notice something interesting:

让我们来看几个更复杂的零长度匹配示例。输入单个字母 "`a`" , 你会发现一些有趣的事情:



	Enter your regex: a?
	Enter input string to search: a
	I found the text "a" starting at index 0 and ending at index 1.
	I found the text "" starting at index 1 and ending at index 1.
	
	Enter your regex: a*
	Enter input string to search: a
	I found the text "a" starting at index 0 and ending at index 1.
	I found the text "" starting at index 1 and ending at index 1.
	
	Enter your regex: a+
	Enter input string to search: a
	I found the text "a" starting at index 0 and ending at index 1.


All three quantifiers found the letter "a", but the first two also found a zero-length match at index 1; that is, after the last character of the input string. Remember, the matcher sees the character "a" as sitting in the cell between index 0 and index 1, and our test harness loops until it can no longer find a match. Depending on the quantifier used, the presence of "nothing" at the index after the last character may or may not trigger a match.

这三种量词都可以查找到字母"a",  但前两个还在 index=1 的位置找到了一次 零长度匹配;  也就是字符串的最后一个字符之后的地方.  记住,  匹配器在 index 0 和 index 1 中间找到了字符  "a", 以此循环, 直到再也找不到匹配为止. 根据使用的量词, 最后一个字符之后的空白(nothing) 可能会匹配, 也可能不会被匹配到。


Now change the input string to the letter "a" five times in a row and you'll get the following:

现在输入5个字母"`a`", 你会看到:



	Enter your regex: a?
	Enter input string to search: aaaaa
	I found the text "a" starting at index 0 and ending at index 1.
	I found the text "a" starting at index 1 and ending at index 2.
	I found the text "a" starting at index 2 and ending at index 3.
	I found the text "a" starting at index 3 and ending at index 4.
	I found the text "a" starting at index 4 and ending at index 5.
	I found the text "" starting at index 5 and ending at index 5.
	
	Enter your regex: a*
	Enter input string to search: aaaaa
	I found the text "aaaaa" starting at index 0 and ending at index 5.
	I found the text "" starting at index 5 and ending at index 5.
	
	Enter your regex: a+
	Enter input string to search: aaaaa
	I found the text "aaaaa" starting at index 0 and ending at index 5.

The expression a? finds an individual match for each character, since it matches when "a" appears zero or one times. The expression a* finds two separate matches: all of the letter "a"'s in the first match, then the zero-length match after the last character at index 5. And finally, a+ matches all occurrences of the letter "a", ignoring the presence of "nothing" at the last index.

表达式 `a?` 对每个字符都会进行一次匹配, 因为它匹配的是0次或1次  `"a"`. 表达式 `a*` 会找到两次匹配: 第一次匹配多个连续的字母 "a" , 第二次匹配零长度的字符串, 字符串结束后的 index=5 位置.  而 `a+` 则匹配所有出现的字母"a", 忽略最后的空串(nothing)。


At this point, you might be wondering what the results would be if the first two quantifiers encounter a letter other than "a". For example, what happens if it encounters the letter "b", as in "ababaaaab"?

此时, 您可能想知道, 如果遇到其他字母时会发生什么. 例如 "ababaaaab" 这样的字符串。


Let's find out:

让我们来看看:



	Enter your regex: a?
	Enter input string to search: ababaaaab
	I found the text "a" starting at index 0 and ending at index 1.
	I found the text "" starting at index 1 and ending at index 1.
	I found the text "a" starting at index 2 and ending at index 3.
	I found the text "" starting at index 3 and ending at index 3.
	I found the text "a" starting at index 4 and ending at index 5.
	I found the text "a" starting at index 5 and ending at index 6.
	I found the text "a" starting at index 6 and ending at index 7.
	I found the text "a" starting at index 7 and ending at index 8.
	I found the text "" starting at index 8 and ending at index 8.
	I found the text "" starting at index 9 and ending at index 9.
	
	Enter your regex: a*
	Enter input string to search: ababaaaab
	I found the text "a" starting at index 0 and ending at index 1.
	I found the text "" starting at index 1 and ending at index 1.
	I found the text "a" starting at index 2 and ending at index 3.
	I found the text "" starting at index 3 and ending at index 3.
	I found the text "aaaa" starting at index 4 and ending at index 8.
	I found the text "" starting at index 8 and ending at index 8.
	I found the text "" starting at index 9 and ending at index 9.
	
	Enter your regex: a+
	Enter input string to search: ababaaaab
	I found the text "a" starting at index 0 and ending at index 1.
	I found the text "a" starting at index 2 and ending at index 3.
	I found the text "aaaa" starting at index 4 and ending at index 8.


Even though the letter "b" appears in cells 1, 3, and 8, the output reports a zero-length match at those locations. The regular expression a? is not specifically looking for the letter "b"; it's merely looking for the presence (or lack thereof) of the letter "a". If the quantifier allows for a match of "a" zero times, anything in the input string that's not an "a" will show up as a zero-length match. The remaining a's are matched according to the rules discussed in the previous examples.

虽然字母"b"出现在了下标 1, 3, 8 处, 输出也显示了零长匹配出现在这里. 正则表达式 `a?` 不会专门查找字母"b", 而是只寻找存在(或不存在) "a" 字母的地方. 如果量词允许匹配零次, 则只要不是 "a" 字母的地方都显示一次零长度匹配. 其余的"a"则根据前面讨论的规则进行匹配。


To match a pattern exactly n number of times, simply specify the number inside a set of braces:

要精确匹配一个模式 n 次, 只需要在大括号内指定数字即可:


	Enter your regex: a{3}
	Enter input string to search: aa
	No match found.
	
	Enter your regex: a{3}
	Enter input string to search: aaa
	I found the text "aaa" starting at index 0 and ending at index 3.
	
	Enter your regex: a{3}
	Enter input string to search: aaaa
	I found the text "aaa" starting at index 0 and ending at index 3.


Here, the regular expression a{3} is searching for three occurrences of the letter "a" in a row. The first test fails because the input string does not have enough a's to match against. The second test contains exactly 3 a's in the input string, which triggers a match. The third test also triggers a match because there are exactly 3 a's at the beginning of the input string. Anything following that is irrelevant to the first match. If the pattern should appear again after that point, it would trigger subsequent matches:

此处, `a{3}`匹配三个连续出现的字母“`a`”。第一个输入字符串测试失败, 因为没有足够的`a`. 第二个测试字符串中包含3个字母 'a', 所以触发了一次匹配。第三个测试也触发了一次匹配, 因为在输入字符串开头, 出现了3个字母'a'.后面如果再出现其他字母,也与第一次匹配无关。如果模式该点之后还可以继续进行匹配, 那么就会触发后续匹配:



	Enter your regex: a{3}
	Enter input string to search: aaaaaaaaa
	I found the text "aaa" starting at index 0 and ending at index 3.
	I found the text "aaa" starting at index 3 and ending at index 6.
	I found the text "aaa" starting at index 6 and ending at index 9.

To require a pattern to appear at least n times, add a comma after the number:

要求一个模式至少出现`n`次，可以在数字后面加一个逗号,例如:


	Enter your regex: a{3,}
	Enter input string to search: aaaaaaaaa
	I found the text "aaaaaaaaa" starting at index 0 and ending at index 9.

With the same input string, this test finds only one match, because the 9 a's in a row satisfy the need for "at least" 3 a's.

同样的输入字符串，这个测试只匹配了一次，因为9 个 `a` 字母的序列也满足 “至少3个a字母” 的需求。

Finally, to specify an upper limit on the number of occurances, add a second number inside the braces:

如果要指定出现次数的上限，在括号内添加第二个数字即可:


	Enter your regex: a{3,6} // find at least 3 (but no more than 6) a's in a row
	Enter input string to search: aaaaaaaaa
	I found the text "aaaaaa" starting at index 0 and ending at index 6.
	I found the text "aaa" starting at index 6 and ending at index 9.

Here the first match is forced to stop at the upper limit of 6 characters. The second match includes whatever is left over, which happens to be three a's — the mimimum number of characters allowed for this match. If the input string were one character shorter, there would not be a second match since only two a's would remain.

这里的第一个匹配在到6个字符上限时停止. 第二个匹配包含了剩下的字母, 恰好是三个 `a` —— 该模式要求的最小字符个数. 如果输入的字符串再短一点点, 就不会发生第二个匹配, 因为2个 `a` 字母匹配不上该模式。

### Capturing Groups and Character Classes with Quantifiers

### 作用于捕获组(Capturing Groups)或字符集合(Character Class)的量词

Until now, we've only tested quantifiers on input strings containing one character. In fact, quantifiers can only attach to one character at a time, so the regular expression "abc+" would mean "a, followed by b, followed by c one or more times". It would not mean "abc" one or more times. However, quantifiers can also attach to Character Classes and Capturing Groups, such as [abc]+ (a or b or c, one or more times) or (abc)+ (the group "abc", one or more times).

到目前为止, 我们对量词只测试了单个字符的情况. 事实上, 量词每次只能连接到一个字符上, 所以正则表达式 “`abc +`” 的含义是:  “字母a, 后面跟着字母b, 然后再跟着 1到多个字母c”.  而不是出现1到多次的 “abc”. 当然, 量词也可以关联到字符集合(Character Class)和捕获组(Capturing Group), 例如 `[abc]+`, 表示 "a或b或c, 出现1到多次"), 而 `(abc)+` 则表示 “`abc`” 这个组整体出现 1次到多次。

Let's illustrate by specifying the group (dog), three times in a row.

让我们看看具体的示例, 指定group (`dog`) 连续出现三次。


	Enter your regex: (dog){3}
	Enter input string to search: dogdogdogdogdogdog
	I found the text "dogdogdog" starting at index 0 and ending at index 9.
	I found the text "dogdogdog" starting at index 9 and ending at index 18.
	
	Enter your regex: dog{3}
	Enter input string to search: dogdogdogdogdogdog
	No match found.

Here the first example finds three matches, since the quantifier applies to the entire capturing group. Remove the parentheses, however, and the match fails because the quantifier {3} now applies only to the letter "g".

第一个例子需要匹配3次, 因为量词作用于整个捕获组. 如果把小括号去掉, 那么就会匹配失败, 因为量词`{3}`现在只作用于字母"`g`"。

Similarly, we can apply a quantifier to an entire character class:

类似地,我们可以测试作用于整个字符集合(character class)的量词:

	Enter your regex: [abc]{3}
	Enter input string to search: abccabaaaccbbbc
	I found the text "abc" starting at index 0 and ending at index 3.
	I found the text "cab" starting at index 3 and ending at index 6.
	I found the text "aaa" starting at index 6 and ending at index 9.
	I found the text "ccb" starting at index 9 and ending at index 12.
	I found the text "bbc" starting at index 12 and ending at index 15.
	
	Enter your regex: abc{3}
	Enter input string to search: abccabaaaccbbbc
	No match found.


Here the quantifier {3} applies to the entire character class in the first example, but only to the letter "c" in the second.

第一个示例这量词 `{3}` 作用于整个字符集合, 在第二个示例这则只作用于字母 "c"。

### Differences Among Greedy, Reluctant, and Possessive Quantifiers

### 贪婪,懒惰和全量之间的不同

There are subtle differences among greedy, reluctant, and possessive quantifiers.

在 贪婪,懒惰和全量 这三种量词之间有一些小小的不同。



Greedy quantifiers are considered "greedy" because they force the matcher to read in, or eat, the entire input string prior to attempting the first match. If the first match attempt (the entire input string) fails, the matcher backs off the input string by one character and tries again, repeating the process until a match is found or there are no more characters left to back off from. Depending on the quantifier used in the expression, the last thing it will try matching against is 1 or 0 characters.

贪婪量词(Greedy quantifier), 其试图在第一个匹配时就吃掉所有的输入字符. 如果第一个匹配试图吃掉整个输入字符串失败, 匹配器吐掉最后一个字符, 并再次尝试匹配, 重复这个过程, 直到找到一个匹配, 或者是一个字符都不剩下. 根据表达式中的量词, 最后才尝试匹配0或者是1个字符。

The reluctant quantifiers, however, take the opposite approach: They start at the beginning of the input string, then reluctantly eat one character at a time looking for a match. The last thing they try is the entire input string.

懒惰量词(reluctant quantifier),采取的策略正好相反: 他们从输入字符串的开头开始, 每吃下一个字符,就尝试进行一次匹配. 最后才尝试匹配整个输入字符串。

Finally, the possessive quantifiers always eat the entire input string, trying once (and only once) for a match. Unlike the greedy quantifiers, possessive quantifiers never back off, even if doing so would allow the overall match to succeed.

占有量词(possessive quantifier) 总是吃下整个输入字符串, 只尝试一次匹配. 与贪婪量词不同,占有量词从不后退, 即使匹配失败。

To illustrate, consider the input string xfooxxxxxxfoo.

请看下面的示例:



	Enter your regex: .*foo  // greedy quantifier
	Enter input string to search: xfooxxxxxxfoo
	I found the text "xfooxxxxxxfoo" starting at index 0 and ending at index 13.
	
	Enter your regex: .*?foo  // reluctant quantifier
	Enter input string to search: xfooxxxxxxfoo
	I found the text "xfoo" starting at index 0 and ending at index 4.
	I found the text "xxxxxxfoo" starting at index 4 and ending at index 13.
	
	Enter your regex: .*+foo // possessive quantifier
	Enter input string to search: xfooxxxxxxfoo
	No match found.


The first example uses the greedy quantifier .* to find "anything", zero or more times, followed by the letters "f" "o" "o". Because the quantifier is greedy, the .* portion of the expression first eats the entire input string. At this point, the overall expression cannot succeed, because the last three letters ("f" "o" "o") have already been consumed. So the matcher slowly backs off one letter at a time until the rightmost occurrence of "foo" has been regurgitated, at which point the match succeeds and the search ends.

第一个示例使用贪婪量词。`.*` 查找的是任意字符(anything), 零到多次, 紧随其后的是字母 "f" "o" "o"。因为是贪婪量词, `.*` 部分首先吃掉整个输入字符串。此时整个表达式匹配不成功, 因为最后三个字母("f" "o" "o")已经被 `.*` 吃掉了. 然后, 匹配器慢慢地吐出最后1个字符,再吐出最后1个字符,再吐出最后1个字符, 直到最右边出现 "foo" 为止, 这时候匹配成功, 查找结束。

The second example, however, is reluctant, so it starts by first consuming "nothing". Because "foo" doesn't appear at the beginning of the string, it's forced to swallow the first letter (an "x"), which triggers the first match at 0 and 4. Our test harness continues the process until the input string is exhausted. It finds another match at 4 and 13.

第二个例子是懒惰模式的, 所以它最开始什么都不吃. 因为紧接着后面没有出现 "foo"，所以它被迫吞下第一个字母("x"), 然后触发了第一个匹配, 在0和4之间。然后从索引4的后面继续匹配过程, 直到输入字符串耗尽为止。它在4和13之间找到了另一个匹配。

The third example fails to find a match because the quantifier is possessive. In this case, the entire input string is consumed by .*+, leaving nothing left over to satisfy the "foo" at the end of the expression. Use a possessive quantifier for situations where you want to seize all of something without ever backing off; it will outperform the equivalent greedy quantifier in cases where the match is not immediately found.

第三个例子, 由于使用占有量词, 所以未能找到匹配。在这种情况下, 整个输入字符串都被 `.*+` 吃掉了, 剩下的空字符串不能满足"foo". 占有量词只适用于想匹配所有的字符的情况, 而且它寸步不让;  如果不能立即匹配, 它的性能会比贪婪模式要好。







原文链接: <https://docs.oracle.com/javase/tutorial/essential/regex/quant.html>



相关链接: 

[Pattern-API文档](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html)

[regex教程目录](https://docs.oracle.com/javase/tutorial/essential/regex/index.html)



