# Java正则系列: (2)量词

>###翻译说明
>
>`greedy`: 贪婪型, 最大匹配方式;
>
>`reluctant`: 懒惰型, 最小匹配方式;
>
>`possessive`: 独占型, 全部匹配方式; 也翻译为[`支配型`];
>
> 这3种量词, 是修饰量词的量词, 可以理解为正则格式重复的匹配类型。


### Quantifiers

### 量词

Quantifiers allow you to specify the number of occurrences to match against. For convenience, the three sections of the Pattern API specification describing greedy, reluctant, and possessive quantifiers are presented below. At first glance it may appear that the quantifiers X?, X?? and X?+ do exactly the same thing, since they all promise to match "X, once or not at all". There are subtle implementation differences which will be explained near the end of this section.


量词(Quantifier)用来指定某部分正则所重复的次数。为了方便，本文分别介绍 Pattern API 规范中的3种类型, 分别是 greedy(贪婪), reluctant(懒惰), 和 possessive(独占) 量词。表面上看, `X?`, `X??` 和 `X?+` 这几种量词都差不多, 都是匹配 "出现0到1次大写的X"。 下文将会讲解他们在实现上的细微差别。



<table>
<tbody><tr>
<th>Greedy(贪婪)</th>
<th>Reluctant(懒惰)</th>
<th>Possessive(独占)</th>
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

我们创建3个基本的正则表达式：字母 "`a`" 后面紧跟 `?`, `*`, 或者 `+`。然后使用贪婪型来进行匹配。 先来看看碰到空字符串 `""` 是什么情况：


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


### 零长匹配


In the above example, the match is successful in the first two cases because the expressions a? and a* both allow for zero occurrences of the letter a. You'll also notice that the start and end indices are both zero, which is unlike any of the examples we've seen so far. The empty input string "" has no length, so the test simply matches nothing at index 0. Matches of this sort are known as a zero-length matches. A zero-length match can occur in several cases: in an empty input string, at the beginning of an input string, after the last character of an input string, or in between any two characters of an input string. Zero-length matches are easily identifiable because they always start and end at the same index position.

上面的示例中, 前两个正则成功匹配, 因为 `a?` 和 `a*` 都允许出现 0 次 `a`.  且开始索引和结束索引 都是 0, 这和之前所见的情形略有不同。空字符串` ""` 的长度为0, 所以只能在索引0处匹配。这种情况称为零长匹配(Zero-Length Match).

零长匹配可能出现的情况包括:  空文本, 字符串起始处, 字符串结尾处, 以及任意两个字符之间.  零长匹配很容易辨认, 因为开始索引和结束索引的位置相等。


Let's explore zero-length matches with a few more examples. Change the input string to a single letter "a" and you'll notice something interesting:

下面来看几个零长匹配的示例。输入文本为单个字母 "`a`" , 你会看到一些有趣的地方:


```
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
```


All three quantifiers found the letter "a", but the first two also found a zero-length match at index 1; that is, after the last character of the input string. Remember, the matcher sees the character "a" as sitting in the cell between index 0 and index 1, and our test harness loops until it can no longer find a match. Depending on the quantifier used, the presence of "nothing" at the index after the last character may or may not trigger a match.

3种量词都可以匹配到字母"a", 但前两个还找到了一次零长匹配, 在 index=1 的位置, 也就是字符串结尾之处. 可以看到, 匹配器先在 index=0 和 index=1 之间找到了字符 "a", 往后类推, 直到再也匹配不到为止. 根据使用量词的不同, 文本结尾处的空白(nothing)可能被匹配到, 也可能不被匹配到。


Now change the input string to the letter "a" five times in a row and you'll get the following:

我们看看连续输入5个字母"`a`"的情况:


```
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
```

The expression a? finds an individual match for each character, since it matches when "a" appears zero or one times. The expression a* finds two separate matches: all of the letter "a"'s in the first match, then the zero-length match after the last character at index 5. And finally, a+ matches all occurrences of the letter "a", ignoring the presence of "nothing" at the last index.

正则 `a?` 对每个字母进行1次匹配, 因为它匹配的是0到1个 `"a"`. 正则 `a*` 会匹配2次: 其中第1次匹配多个连续的字母 "a" , 第2次是零长匹配, 字符串结束位置 index=5 的地方. 而 `a+` 只会匹配所有出现的"a"字母, 忽略最后的空白(nothing)。


At this point, you might be wondering what the results would be if the first two quantifiers encounter a letter other than "a". For example, what happens if it encounters the letter "b", as in "ababaaaab"?

现在, 我们想知道, 前2个正则在碰到其他字母时会发生什么. 例如碰到 "ababaaaab" 之中的 `b` 字母时。


Let's find out:

请看示例:


```
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
```

Even though the letter "b" appears in cells 1, 3, and 8, the output reports a zero-length match at those locations. The regular expression a? is not specifically looking for the letter "b"; it's merely looking for the presence (or lack thereof) of the letter "a". If the quantifier allows for a match of "a" zero times, anything in the input string that's not an "a" will show up as a zero-length match. The remaining a's are matched according to the rules discussed in the previous examples.

字母 "b" 出现在索引为 1, 3, 8 的位置, 输出结果也表明零长匹配出现在这些地方. 正则 `a?` 不会专门查找字母"b", 而只查找 存在/或不存在字母 "a" 的地方. 如果量词允许0次匹配, 则只要不是 "a" 字母的地方都会出现一次零长匹配. 其余的"a"则根据前面介绍的规则进行匹配。


To match a pattern exactly n number of times, simply specify the number inside a set of braces:

要精确匹配某个格式 n 次, 只需要在大括号内指定数字即可:

```
Enter your regex: a{3}
Enter input string to search: aa
No match found.

Enter your regex: a{3}
Enter input string to search: aaa
I found the text "aaa" starting at index 0 and ending at index 3.

Enter your regex: a{3}
Enter input string to search: aaaa
I found the text "aaa" starting at index 0 and ending at index 3.
```

Here, the regular expression a{3} is searching for three occurrences of the letter "a" in a row. The first test fails because the input string does not have enough a's to match against. The second test contains exactly 3 a's in the input string, which triggers a match. The third test also triggers a match because there are exactly 3 a's at the beginning of the input string. Anything following that is irrelevant to the first match. If the pattern should appear again after that point, it would trigger subsequent matches:

正则 `a{3}` 匹配连续出现的三个“`a`”字母。第一次测试匹配失败, 是因为字母`a`的数量不足. 第二次测试时, 字符串中刚好包含3个 `a` 字母, 所以匹配了一次。第三次测试也触发了一次匹配, 因为输入文本的签名有3个 `a` 字母. 后面再出现的字母, 与第一次匹配无关。如果后面还有这种格式的字符串, 则使用后面的子串触发后续匹配:


```
Enter your regex: a{3}
Enter input string to search: aaaaaaaaa
I found the text "aaa" starting at index 0 and ending at index 3.
I found the text "aaa" starting at index 3 and ending at index 6.
I found the text "aaa" starting at index 6 and ending at index 9.
```

To require a pattern to appear at least n times, add a comma after the number:

要求某种格式至少出现`n`次，可以在数字后面加一个逗号,例如:

```
Enter your regex: a{3,}
Enter input string to search: aaaaaaaaa
I found the text "aaaaaaaaa" starting at index 0 and ending at index 9.
```

With the same input string, this test finds only one match, because the 9 a's in a row satisfy the need for "at least" 3 a's.

同样是9个字母a, 这里就只匹配了一次，因为9个 `a` 字母的序列也满足 "最少3个a字母" 的需求。

Finally, to specify an upper limit on the number of occurances, add a second number inside the braces:

如果要指定出现次数的最大值，在大括号内加上第二个数字即可:


```
Enter your regex: a{3,6} // 最少3个,最多6个a字母
Enter input string to search: aaaaaaaaa
I found the text "aaaaaa" starting at index 0 and ending at index 6.
I found the text "aaa" starting at index 6 and ending at index 9.
```

Here the first match is forced to stop at the upper limit of 6 characters. The second match includes whatever is left over, which happens to be three a's — the mimimum number of characters allowed for this match. If the input string were one character shorter, there would not be a second match since only two a's would remain.

这里的第一个匹配在达到上限的6个字符时停止. 第二个匹配包含了剩下的字母, 恰好是要求的最小字符个数: 三个 `a`. 如果输入的文本再少一个字符, 第二次匹配就不会发生, 因为只有2个 `a` 则匹配不了该格式。


### Capturing Groups and Character Classes with Quantifiers

### 关联到捕获组和/或字符组的量词

Until now, we've only tested quantifiers on input strings containing one character. In fact, quantifiers can only attach to one character at a time, so the regular expression "abc+" would mean "a, followed by b, followed by c one or more times". It would not mean "abc" one or more times. However, quantifiers can also attach to Character Classes and Capturing Groups, such as [abc]+ (a or b or c, one or more times) or (abc)+ (the group "abc", one or more times).

到目前为止, 我们只是用量词来测试了单个字符的情况. 但实际上, 量词只关联到一个字符上, 所以正则 “`abc+`” 的含义是:  “字母`a`, 后面跟着字母`b`, 然后再跟着1到多个字母`c`”. 而不表示1到多次的 “abc”. 当然, 量词可以关联到字符组(Character Class)和捕获组(Capturing Group), 例如 `[abc]+`, 表示 "出现1到多次的a或b或c, 也就是abc三个字母组成的任意组合"), 而正则 `(abc)+` 表示 “`abc`” 这个 group 整体出现 1次到多次, 例如 `abcabcabc`。

Let's illustrate by specifying the group (dog), three times in a row.

让我们看一个具体的示例, 指定分组 `dog` 连续出现三次。

```
Enter your regex: (dog){3}
Enter input string to search: dogdogdogdogdogdog
I found the text "dogdogdog" starting at index 0 and ending at index 9.
I found the text "dogdogdog" starting at index 9 and ending at index 18.

Enter your regex: dog{3}
Enter input string to search: dogdogdogdogdogdog
No match found.
```

Here the first example finds three matches, since the quantifier applies to the entire capturing group. Remove the parentheses, however, and the match fails because the quantifier {3} now applies only to the letter "g".

第一个示例, 匹配了3次, 因为量词作用于整个捕获组. 如果把小括号去掉, 就会匹配失败, 因为这时候量词`{3}`只作用于字母"`g`"。

Similarly, we can apply a quantifier to an entire character class:

类似地,我们将量词作用于整个字符组(character class):

```
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
```

Here the quantifier {3} applies to the entire character class in the first example, but only to the letter "c" in the second.

第一个示例中, 量词 `{3}` 作用于整个字符组, 在第二个示例中, 量词只作用于字母 "c"。

### Differences Among Greedy, Reluctant, and Possessive Quantifiers

### 贪婪,懒惰和全量量词之间的区别

There are subtle differences among greedy, reluctant, and possessive quantifiers.

贪婪(Greedy),懒惰(Reluctant)和全量(Possessive)这三种量词模式之间有一些细微的差别。


Greedy quantifiers are considered "greedy" because they force the matcher to read in, or eat, the entire input string prior to attempting the first match. If the first match attempt (the entire input string) fails, the matcher backs off the input string by one character and tries again, repeating the process until a match is found or there are no more characters left to back off from. Depending on the quantifier used in the expression, the last thing it will try matching against is 1 or 0 characters.

贪婪量词(Greedy quantifier), 其试图在第一次匹配时就吃掉所有的输入字符. 如果尝试吃掉整个字符串失败, 则放过最后一个字符, 并再次尝试匹配, 重复这个过程, 直到找到一个匹配, 或者是没有可回退的字符为止. 根据正则中的量词, 最后尝试匹配的可能是0或1个字符。

The reluctant quantifiers, however, take the opposite approach: They start at the beginning of the input string, then reluctantly eat one character at a time looking for a match. The last thing they try is the entire input string.

懒惰量词(reluctant quantifier),采取的策略正好相反: 从输入字符串的起始处, 每吃下一个字符,就尝试进行一次匹配. 最后才会尝试匹配整个输入字符串。

Finally, the possessive quantifiers always eat the entire input string, trying once (and only once) for a match. Unlike the greedy quantifiers, possessive quantifiers never back off, even if doing so would allow the overall match to succeed.

独占量词(possessive quantifier), 则是吃下整个输入字符串, 只进行一次匹配尝试. 独占量词从不后退, 即使匹配失败, 这点是和贪婪量词的不同。

To illustrate, consider the input string xfooxxxxxxfoo.

请看下面的示例:


```
Enter your regex: .*foo  // Java默认贪婪型
Enter input string to search: xfooxxxxxxfoo
I found the text "xfooxxxxxxfoo" starting at index 0 and ending at index 13.

Enter your regex: .*?foo  // 懒惰型
Enter input string to search: xfooxxxxxxfoo
I found the text "xfoo" starting at index 0 and ending at index 4.
I found the text "xxxxxxfoo" starting at index 4 and ending at index 13.

Enter your regex: .*+foo // 独占模式
Enter input string to search: xfooxxxxxxfoo
No match found.
```

The first example uses the greedy quantifier .* to find "anything", zero or more times, followed by the letters "f" "o" "o". Because the quantifier is greedy, the .* portion of the expression first eats the entire input string. At this point, the overall expression cannot succeed, because the last three letters ("f" "o" "o") have already been consumed. So the matcher slowly backs off one letter at a time until the rightmost occurrence of "foo" has been regurgitated, at which point the match succeeds and the search ends.

第一个示例使用的是贪婪量词 `.*`, 匹配0到多个的任意字符(anything), 紧随其后的是字母 "f" "o" "o"。因为是贪婪量词, `.*` 部分首先吃掉整个输入字符串, 发现整个表达式匹配不成功, 因为最后三个字母("f" "o" "o")已经被 `.*` 吃掉了; 然后, 匹配器放开最后1个字符,再放开最后1个字符,再放开最后1个字符, 直到右边剩下 "foo" 为止, 这时候匹配成功, 查找结束。

The second example, however, is reluctant, so it starts by first consuming "nothing". Because "foo" doesn't appear at the beginning of the string, it's forced to swallow the first letter (an "x"), which triggers the first match at 0 and 4. Our test harness continues the process until the input string is exhausted. It finds another match at 4 and 13.

第二个示例是懒惰型, 所以最开始什么都不吃. 因为后面不是 "foo"，所以不得不吃下第一个字母("x"), 然后就触发了第一次匹配, 在索引0到4之间。接着从索引4的后面再次进行匹配尝试, 直到尝试完整个输入字符串。在索引4到13之间触发了第二次匹配。

The third example fails to find a match because the quantifier is possessive. In this case, the entire input string is consumed by .*+, leaving nothing left over to satisfy the "foo" at the end of the expression. Use a possessive quantifier for situations where you want to seize all of something without ever backing off; it will outperform the equivalent greedy quantifier in cases where the match is not immediately found.

第三个例子, 使用的是独占量词, 所以没有匹配成功。在这个示例中, 因为整个输入字符串都被 `.*+` 吃掉了, 剩下的空白自然不能对应 "foo". 由此可知, 独占量词只能用于匹配所有字符的情况, 它从不后退; 如果都不能匹配到, 独占量词的性能会比贪婪型好一些。


原文链接: <https://docs.oracle.com/javase/tutorial/essential/regex/quant.html>



相关链接:

- [Pattern-API文档](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html)

- [regex教程目录](https://docs.oracle.com/javase/tutorial/essential/regex/index.html)

- [Grok 正则捕获](https://doc.yonyoucloud.com/doc/logstash-best-practice-cn/filter/grok.html)


翻译日期: 2018年1月2日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei/)
