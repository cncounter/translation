# Regular expressions simplify pattern-matching code

# 用正则来简化模式匹配代码

### Discover the elegance of regular expressions in text-processing scenarios that involve pattern matching

### 副标题: 在文本处理中发现正则表达式的优雅



Text processing frequently requires code to match text against patterns. That capability makes possible text searches, email header validation, custom text creation from generic text (e.g., "Dear Mr. Smith" instead of "Dear Customer"), and so on. Java supports pattern matching via its character and assorted string classes. Because that low-level support commonly leads to complex pattern-matching code, Java also offers regular expressions to help you write simpler code.


文本处理经常需要用代码将文本与某种模式进行匹配。有了这种能力，就可以实现文本搜索、邮件头验证、根据通用文本生成定制文本(例如把“亲爱的客户”替换为“亲爱的史密斯先生”)等等。Java 通过其字符类和各种各样的字符串类来支持模式匹配。由于这种底层支持通常会导致复杂的模式匹配代码，Java 还提供了正则表达式，帮助你编写更简洁的代码。


Regular expressions often confuse newcomers. However, this article dispels much of that confusion. After introducing regular expression terminology, the java.util.regex package's classes, and a program that demonstrates regular expression constructs, I explore many of the regular expression constructs that the Pattern class supports. I also examine the methods comprising Pattern and other java.util.regex classes. A practical application of regular expressions concludes my discussion.


正则表达式常常让初学者感到困惑。不过，本文会消除大部分困惑。在介绍正则表达式的术语、java.util.regex 包中的类，以及一个演示正则表达式构造的程序之后，我会探讨 Pattern 类所支持的许多正则表达式构造。我还会讲解构成 Pattern 以及其他 java.util.regex 类的方法。最后，我会以一个正则表达式的实际应用来结束讨论。


> ##Note
> Regular expressions' long history begins in the theoretical computer science fields of automata theory and formal language theory. That history continues to Unix and other operating systems, where regular expressions are often used in Unix and Unix-like utilities: examples include awk (a programming language that enables sophisticated text analysis and manipulation—named after its creators, Aho, Weinberger, and Kernighan), emacs (a developer's editor), and grep (a program that matches regular expressions in one or more text files and stands for global regular expression print).

<br/>

> ##提示
>正则表达式的悠久历史，最早可以追溯到理论计算机科学中的自动机理论和形式语言理论。这段历史延续到 Unix 及其他操作系统，正则表达式经常被用于 Unix 和类 Unix 工具中:例如 awk(一种支持复杂文本分析和操作的编程语言，得名于其三位创造者 Aho、Weinberger 和 Kernighan)、emacs(一款开发者编辑器)，以及 grep(一个在一个或多个文本文件中匹配正则表达式的程序，全称为 global regular expression print)。


###What are regular expressions?

### 正则表达式(regular expression)简介

A regular expression, also known as a regex or regexp, is a string whose pattern (template) describes a set of strings. The pattern determines what strings belong to the set, and consists of literal characters and metacharacters, characters that have special meaning instead of a literal meaning. The process of searching text to identify matches—strings that match a regex's pattern—is pattern matching.

正则表达式,也称为 **regex** 或 **regexp** ,按照[大漠穷秋](http://damoqiongqiu.iteye.com/ "angularjs 牛人大漠穷秋的博客")的说法，这个名字翻译得是很差的,但由于历史原因,为了兼容性所以就一直统一为“正则表达式”。这是用来描述一类字符串的模板(pattern, template)。模板决定了哪些字符串属于这个集合，正则表达式模板由文本字符和元字符组成, metacharacters 在正则表达式中具有特殊的含义,而不只是单纯的字符。搜索文本来确定匹配哪些 strings 的过程就叫做模式匹配。


Java's `java.util.regex` package supports pattern matching via its Pattern, Matcher, and PatternSyntaxException classes:

- Pattern objects, also known as patterns, are compiled regexes
- Matcher objects, or matchers, are engines that interpret patterns to locate matches in character sequences, objects whose classes implement the java.lang.CharSequence interface and serve as text sources
- PatternSyntaxException objects describe illegal regex patterns

- Pattern 对象, 也称为模式, 是编译后的 regex
- Matcher 对象(或匹配器)是引擎，它解释模式，以便在字符序列中定位匹配;这里的字符序列对象所属的类实现了 java.lang.CharSequence 接口，并作为文本来源
- PatternSyntaxException 对象用来描述不合法的 regex patterns

Listing 1 introduces those classes:

清单 1 介绍了这些类:

> #### Listing 1. `RegexDemo.java`


	// RegexDemo.java
	import java.util.regex.*;
	class RegexDemo
	{
	   public static void main (String [] args)
	   {
	      if (args.length != 2)
	      {
	          System.err.println ("java RegexDemo regex text");
	          return;
	      }
	      Pattern p;
	      try
	      {
	         p = Pattern.compile (args [0]);
	      }
	      catch (PatternSyntaxException e)
	      {
	         System.err.println ("Regex syntax error: " + e.getMessage ());
	         System.err.println ("Error description: " + e.getDescription ());
	         System.err.println ("Error index: " + e.getIndex ());
	         System.err.println ("Erroneous pattern: " + e.getPattern ());
	         return;
	      }
	      String s = cvtLineTerminators (args [1]);
	      Matcher m = p.matcher (s);
	      System.out.println ("Regex = " + args [0]);
	      System.out.println ("Text = " + s);
	      System.out.println ();
	      while (m.find ())
	      {
	         System.out.println ("Found " + m.group ());
	         System.out.println ("  starting at index " + m.start () +
	                             " and ending at index " + m.end ());
	         System.out.println ();
	      }
	   }
	   // Convert \n and \r character sequences to their single character
	   // equivalents
	   static String cvtLineTerminators (String s)
	   {
	      StringBuffer sb = new StringBuffer (80);
	      int oldindex = 0, newindex;
	      while ((newindex = s.indexOf ("\\n", oldindex)) != -1)
	      {
	         sb.append (s.substring (oldindex, newindex));
	         oldindex = newindex + 2;
	         sb.append ('\n');
	      }
	      sb.append (s.substring (oldindex));
	      s = sb.toString ();
	      sb = new StringBuffer (80);
	      oldindex = 0;
	      while ((newindex = s.indexOf ("\\r", oldindex)) != -1)
	      {
	         sb.append (s.substring (oldindex, newindex));
	         oldindex = newindex + 2;
	         sb.append ('\r');
	      }
	      sb.append (s.substring (oldindex));
	      return sb.toString ();
	   }
	}


RegexDemo's public static void main(String [] args) method validates two command-line arguments: one that identifies a regex and another that identifies text. After creating a pattern, this method converts all the text argument's new-line and carriage-return line-terminator character sequences to their actual meanings. For example, a new-line character sequence (represented as backslash (\) followed by n) converts to one new-line character (represented numerically as 10). After outputting the regex and converted text command-line arguments, main(String [] args) creates a matcher from the pattern, which subsequently finds all matches. For each match, the match's characters and information on where the match occurs in the text output to the standard output device.

RegexDemo 的 public static void main(String [] args) 方法会校验两个命令行参数:一个用于指定正则表达式，另一个用于指定文本。创建 Pattern 之后，该方法会把文本参数里所有的换行和回车行终止符字符序列转换成它们的实际含义。例如，换行字符序列(用反斜杠 (\) 后跟 n 表示)会转换为一个换行字符(数字上表示为 10)。在输出正则表达式和转换后的文本这两个命令行参数之后，main(String [] args) 会根据该模式创建一个匹配器，随后由它找出所有匹配。对于每个匹配，匹配到的字符以及匹配在文本中出现的位置信息都会输出到标准输出设备。

To accomplish pattern matching, RegexDemo calls various methods in java.util.regex's classes. Don't concern yourself with understanding those methods right now; we'll explore them later in this article. More importantly, compile Listing 1: you need RegexDemo.class to explore Pattern's regex constructs.

为了完成模式匹配，RegexDemo 调用了 java.util.regex 各类中的各种方法。现在你不用担心是否理解这些方法;本文稍后会探讨它们。更重要的是，请先编译清单 1:你需要 RegexDemo.class 才能探究 Pattern 的正则表达式构造。


### Explore Pattern's regex constructs

### 探究 Pattern 的正则表达式构造

Pattern's SDK documentation presents a section on regular expression constructs. Unless you're an avid regex user, an initial examination of that section might confuse you. What are quantifiers and the differences among greedy, reluctant, and possessive quantifiers? What are character classes, boundary matchers, back references, and embedded flag expressions? To answer those and other questions, we explore many of the regex constructs, or regex pattern categories, that Pattern recognizes. We begin with the simplest regex construct: literal strings.

Pattern 的 SDK 文档中有一节专门介绍正则表达式的构造。除非你是正则表达式的狂热用户，否则初次看这一节可能会一头雾水。什么是量词，以及贪婪、勉强(reluctant)、占有(possessive)量词之间有什么区别?什么是字符类、边界匹配器、反向引用和嵌入式标志表达式?为了回答这些问题及其他疑问，我们会探讨 Pattern 所识别的许多正则表达式构造(也就是正则模式类别)。我们从最简单的正则表达式构造讲起:字面字符串。


> ##Caution
> Do not assume that Pattern's and Perl 5's regex constructs are identical. Although they share many similarities, they also share differences, ranging from disparities in the constructs they support to their treatment of dangling metacharacters. (For more information, examine your SDK documentation on the Pattern class, which you should have on your platform.)
>
> ##注意
> 不要以为 Pattern 和 Perl 5 的正则表达式构造完全相同。尽管它们有许多相似之处，但也存在不少差异——从二者所支持的构造范围不同，到对悬空元字符(dangling metacharacters)的处理方式不同，皆属此类。(想了解更多信息，请查阅你所用平台上 Pattern 类的 SDK 文档。)


### Literal strings

### 字面字符串

You specify the literal string regex construct whenever you type a literal string in the search text field of your word processor's search dialog box. Execute the following RegexDemo command line to see this regex construct in action:

当你在文字处理器的搜索对话框里输入一个字面字符串时，你用的就是字面字符串这种正则表达式构造。执行下面这行 RegexDemo 命令，即可看到它的实际效果:

	java RegexDemo apple applet

The command line above identifies apple as a literal string regex construct that consists of literal characters a, p, p, l, and e (in that order). The command line also identifies applet as text for pattern-matching purposes. After executing the command line, observe the following output:

上面的命令行把 apple 指定为一个字面字符串正则表达式构造，它由字面字符 a、p、p、l、e 按此顺序组成。该命令行还把 applet 指定为用于模式匹配的文本。执行后，会看到如下输出:

	Regex = apple
	Text = applet
	Found apple
	  starting at index 0 and ending at index 5

The output identifies the regex and text command-line arguments, indicates a successful match of apple within applet, and presents the starting and ending indexes of that match: 0 and 5, respectively. The starting index identifies the first text location where a pattern match occurs, and the ending index identifies the first text location after the match. In other words, the range of matching text is inclusive of the starting index and exclusive of the ending index.

输出列出了正则表达式和文本这两个命令行参数，表明在 applet 中成功匹配到了 apple，并给出了该匹配的起始和结束索引:分别是 0 和 5。起始索引表示发生模式匹配的第一个文本位置，结束索引表示匹配之后的第一个文本位置。换句话说，匹配文本的范围包含起始索引，但不包含结束索引。


### Metacharacters

### 元字符

Although literal string regex constructs are useful, more powerful regex constructs combine literal characters with metacharacters. For example, in a.b, the period metacharacter (.) represents any character that appears between a and b. To see the period metacharacter in action, execute the following command line:

虽然字面字符串这种正则表达式构造很有用，但更强大的构造会把字面字符和元字符组合起来。例如在 a.b 中，句点元字符(.)代表出现在 a 和 b 之间的任意字符。想看看句点元字符的实际效果，请执行下面这行命令:

	java RegexDemo .ox "The quick brown fox jumps over the lazy ox."

The command line above specifies .ox as the regex and The quick brown fox jumps over the lazy ox. as the text command-line argument. RegexDemo searches the text for matches that begin with any character and end with ox, and produces the following output:

上面的命令行把 .ox 指定为正则表达式，把 The quick brown fox jumps over the lazy ox. 指定为文本命令行参数。RegexDemo 会在文本中查找以任意字符开头、以 ox 结尾的匹配，并产生如下输出:

	Regex = .ox
	Text = The quick brown fox jumps over the lazy ox.
	Found fox
	  starting at index 16 and ending at index 19
	Found  ox
	  starting at index 39 and ending at index 42


The output reveals two matches: fox and ox (with a leading space character). The . metacharacter matches the f in the first match and the space character in the second match.

输出显示有两个匹配:fox 和 ox(前面带一个空格字符)。句点元字符在第一个匹配中匹配 f，在第二个匹配中匹配空格字符。

What happens if we replace .ox with the period metacharacter? That is, what outputs when we specify java . "The quick brown fox jumps over the lazy ox."? Because the period metacharacter matches any character, RegexDemo outputs a match for each character in its text command-line argument, including the terminating period character.

如果把 .ox 换成单独的句点元字符会怎样?也就是说，执行 java . "The quick brown fox jumps over the lazy ox." 时会输出什么?因为句点元字符能匹配任意字符，所以 RegexDemo 会为其文本命令行参数中的每个字符都输出一个匹配，包括末尾的句点字符。


> ##Tip
> To specify . or any metacharacter as a literal character in a regex construct, quote—convert from meta status to literal status—the metacharacter in one of two ways:
>
> - Precede the metacharacter with a backslash character.
> - Place the metacharacter between `\Q` and `\E` (e.g., `\Q.\E`).
>
> In either scenario, don't forget to double each backslash character (as in `\\.` or `\\Q.\\E`) that appears in a string literal (e.g., `String regex = "\\.";`). Do not double the backslash character when it appears as part of a command-line argument.
>
> ##提示
> 若要把 . 或任意元字符在正则表达式构造中当作字面字符，可以用以下两种方式之一对元字符进行引用(quote)——也就是把它从元字符状态转换为字面状态:
>
> - 在元字符前面加一个反斜杠字符。
> - 把元字符放在 `\Q` 和 `\E` 之间(例如 `\Q.\E`)。
>
> 无论采用哪种方式，都别忘了把出现在字符串字面量中的每个反斜杠字符写成两个(例如 `\\.` 或 `\\Q.\\E`，如 `String regex = "\\.";`)。当反斜杠作为命令行参数的一部分出现时，不要写成两个。


### Character classes

### 字符类

We sometimes limit those characters that produce matches to a specific set of characters. For example, we might search text for vowels a, e, i, o, and u, where any occurrence of any vowel indicates a match. A character class, a regex construct that identifies a set of characters between open and close square bracket metacharacters ([ ]), helps us accomplish that task. Pattern supports the following character classes:

有时我们会把能产生匹配的字符限定在某个特定字符集合内。例如，我们可能要在文本中查找元音 a、e、i、o、u，只要出现其中任意一个元音就表示匹配。字符类(character class)是一种在左方括号和右方括号元字符([ ])之间标示一组字符的正则表达式构造，它能帮我们完成这项任务。Pattern 支持以下字符类:


- **Simple**: consists of characters placed side by side and matches only those characters. Example: [abc] matches characters a, b, and c. The following command line offers a second example:

- **简单类(Simple)**: 由并排放置的字符组成，只匹配这些字符。示例: [abc] 匹配字符 a、b、c。下面这行命令给出第二个示例:

	java RegexDemo [csw] cave

`java RegexDemo [csw] cave` matches c in [csw] with c in cave. No other matches exist.

`java RegexDemo [csw] cave` 会把 [csw] 中的 c 与 cave 中的 c 匹配起来。没有其他匹配。

- **Negation**: begins with the ^ metacharacter and matches only those characters not in that class. Example: [^abc] matches all characters except a, b, and c. The following command line offers a second example:

- **否定类(Negation)**: 以 ^ 元字符开头，只匹配不在该类中的字符。示例: [^abc] 匹配除 a、b、c 之外的所有字符。下面这行命令给出第二个示例:
-
	java RegexDemo [^csw] cave

`java RegexDemo [^csw] cave` matches a, v, and e with their counterparts in cave. No other matches exist.

`java RegexDemo [^csw] cave` 会把 a、v、e 与 cave 中对应的字符匹配起来。没有其他匹配。

- **Range**: consists of all characters beginning with the character on the left of a hyphen metacharacter (-) and ending with the character on the right of the hyphen metacharacter, matching only those characters in that range. Example: [a-z] matches all lowercase alphabetic characters. The following command line offers a second example:

- **范围类(Range)**: 由连字符元字符(-)左侧字符到右侧字符之间的所有字符组成，只匹配该范围内的字符。示例: [a-z] 匹配所有小写字母。下面这行命令给出第二个示例:

	java RegexDemo [a-c] clown

`java RegexDemo [a-c] clown` matches c in [a-c] with c in clown. No other matches exist.

`java RegexDemo [a-c] clown` 会把 [a-c] 中的 c 与 clown 中的 c 匹配起来。没有其他匹配。


> ## **Tip**
>
>Combine multiple ranges within the same range character class by placing them side by side. Example: [a-zA-Z] matches all lowercase and uppercase alphabetic characters.
>
> ## **提示**
>
> 把多个范围并排放置，即可在同一个范围字符类中合并多个范围。示例: [a-zA-Z] 匹配所有小写和大写字母。


- **Union**: consists of multiple nested character classes and matches all characters that belong to the resulting union. Example: [a-d[m-p]] matches characters a through d and m through p. The following command line offers a second example:

- **并集(Union)**: 由多个嵌套的字符类组成，匹配所有属于该并集的字符。示例: [a-d[m-p]] 匹配 a 到 d 以及 m 到 p。下面这行命令给出第二个示例:

	java RegexDemo [ab[c-e]] abcdef

`java RegexDemo [ab[c-e]] abcdef` matches a, b, c, d, and e with their counterparts in abcdef. No other matches exist.

`java RegexDemo [ab[c-e]] abcdef` 会把 a、b、c、d、e 与 abcdef 中对应的字符匹配起来。没有其他匹配。


- **Intersection**: consists of characters common to all nested classes and matches only common characters. Example: [a-z&&[d-f]] matches characters d, e, and f. The following command line offers a second example:

- **交集(Intersection)**: 由所有嵌套类共有的字符组成，只匹配共有的字符。示例: [a-z&&[d-f]] 匹配字符 d、e、f。下面这行命令给出第二个示例:

	java RegexDemo [aeiouy&&[y]] party

`java RegexDemo [aeiouy&&[y]] party` matches y in [aeiou&&[y]] with y in party. No other matches exist.

`java RegexDemo [aeiouy&&[y]] party` 会把 [aeiou&&[y]] 中的 y 与 party 中的 y 匹配起来。没有其他匹配。



- **Subtraction**: consists of all characters except for those indicated in nested negation character classes and matches the remaining characters. Example: [a-z&&[^m-p]] matches characters a through l and q through z. The following command line offers a second example:

- **差集(Subtraction)**: 由除嵌套否定字符类所标示字符之外的所有字符组成，匹配剩余字符。示例: [a-z&&[^m-p]] 匹配 a 到 l 以及 q 到 z。下面这行命令给出第二个示例:

	java RegexDemo [a-f&&[^a-c]&&[^e]] abcdefg

`java RegexDemo [a-f&&[^a-c]&&[^e]] abcdefg` matches d and f with their counterparts in abcdefg. No other matches exist.

`java RegexDemo [a-f&&[^a-c]&&[^e]] abcdefg` 会把 d、f 与 abcdefg 中对应的字符匹配起来。没有其他匹配。


### Predefined character classes

### 预定义的字符类

Some character classes occur often enough in regexes to warrant shortcuts. Pattern provides such shortcuts with predefined character classes, which Table 1 presents. Use predefined character classes to simplify your regexes and minimize regex syntax errors.

有些字符类在正则表达式中出现得足够频繁，值得为它们提供快捷写法。Pattern 通过预定义字符类提供了这类快捷写法，表 1 列出了它们。使用预定义字符类可以简化你的正则表达式，并尽量减少语法错误。

### Table 1. Predefined character classes

### 表 1. 预定义的字符类


<table border="0" cellspacing="1" celpadding="5"><tbody><tr bgcolor="#990033"><td>Predefined character class </td><td>Description </td></tr><tr bgcolor="cccccc"><td><code>\d</code> </td><td>A digit. Equivalent to <code>[0-9]</code>.</td></tr><tr bgcolor="#ffffff"><td><code>\D</code> </td><td>A nondigit. Equivalent to <code>[^0-9]</code>.</td></tr><tr bgcolor="cccccc"><td><code>\s</code> </td><td>A whitespace character. Equivalent to <code>[ \t\n\x0B\f\r]</code>.</td></tr><tr bgcolor="#ffffff"><td><code>\S</code> </td><td>A nonwhitespace character. Equivalent to <code>[^\s]</code>.</td></tr><tr bgcolor="cccccc"><td><code>\w</code> </td><td>A word character. Equivalent to <code>[a-zA-Z_0-9]</code>.</td></tr><tr bgcolor="#ffffff"><td><code>\W</code> </td><td>A nonword character. Equivalent to <code>[^\w]</code>.</td></tr></tbody></table>




The following command-line example uses the \w predefined character class to identify all word characters in its text command-line argument:

下面这个命令行示例使用 \w 预定义字符类，找出其文本命令行参数中的所有单词字符:

	java RegexDemo \w "aZ.8 _"

The command line above produces the following output, which shows that the period and space characters are not considered word characters:

上面的命令行会产生如下输出，可以看到句点和空格字符不被视为单词字符:


	Regex = \w
	Text = aZ.8 _
	Found a
	  starting at index 0 and ending at index 1
	Found Z
	  starting at index 1 and ending at index 2
	Found 8
	  starting at index 3 and ending at index 4
	Found _
	  starting at index 5 and ending at index 6


> ##Note
> Pattern's SDK documentation refers to the period metacharacter as a predefined character class that matches any character except for a line terminator—a one- or two-character sequence identifying the end of a text line—unless dotall mode (discussed later) is in effect. Pattern recognizes the following line terminators:
>
> - The carriage-return character (\r\)
- The new-line (line feed) character (\n)
- The carriage-return character immediately followed by the new-line character (\r\n)
- The next-line character (\u0085)
- The line-separator character (\u2028)
- The paragraph-separator character (\u2029)
>
> ##注意
> Pattern 的 SDK 文档把句点元字符视为一种预定义字符类，它匹配除行终止符之外的任意字符——行终止符是标示文本行结束的一个或两个字符序列——除非启用了 dotall 模式(稍后讨论)。Pattern 识别以下行终止符:
>
> - 回车字符(\r)
> - 换行(换行符)字符(\n)
> - 紧跟在换行字符之后的回车字符(\r\n)
> - 下一行字符(\u0085)
> - 行分隔符字符(\u2028)
> - 段落分隔符字符(\u2029)


### Capturing groups

### 捕获组

Pattern supports a regex construct called a capturing group that saves a match's characters for later recall during pattern matching; that construct is a character sequence surrounded by parentheses metacharacters (( )). All characters within that capturing group are treated as a single unit during pattern matching. For example, the (Java) capturing group combines letters J, a, v, and a into a single unit. This capturing group matches the Java pattern against all occurrences of Java in text. Each match replaces the previous match's saved Java characters with the next match's Java characters.

Pattern 支持一种叫做捕获组(capturing group)的正则表达式构造，它会把某个匹配的字符保存下来，供模式匹配过程中后续引用;该构造是用圆括号元字符(( ))括起来的一段字符序列。模式匹配时，捕获组内的所有字符都被当作一个整体来对待。例如，(Java) 捕获组把字母 J、a、v、a 组合成一个整体。这个捕获组会匹配文本中所有出现 Java 的位置。每找到一个匹配，就用该匹配的 Java 字符替换掉上一次匹配保存的 Java 字符。

Capturing groups can nest inside other capturing groups. For example, in (Java( language)), ( language) nests inside (Java). Each nested or nonnested capturing group receives its own number, numbering starts at 1, and capturing groups number from left to right. In the example, (Java( language)) is capturing group number 1, and ( language) is capturing group number 2. In (a)(b), (a) is capturing group number 1, and (b) is capturing group number 2.

捕获组可以嵌套在其他捕获组内部。例如在 (Java( language)) 中，( language) 嵌套在 (Java) 里面。每个嵌套或非嵌套的捕获组都有自己的编号，编号从 1 开始，并按从左到右的顺序编号。在这个例子里，(Java( language)) 是编号 1 的捕获组，( language) 是编号 2 的捕获组。在 (a)(b) 中，(a) 是编号 1 的捕获组，(b) 是编号 2 的捕获组。

Each capturing group saves its match for later recall by a back reference. Specified as a backslash character followed by a digit character denoting a capturing group number, the back reference recalls a capturing group's captured text characters. The presence of a back reference causes a matcher to use the back reference's capturing group number to recall the capturing group's saved match and then use that match's characters to attempt a further match operation. The following example demonstrates the usefulness of a back reference in searching text for a grammatical error:

每个捕获组都会保存自己的匹配，供反向引用(back reference)后续引用。反向引用由一个反斜杠字符后跟一个表示捕获组编号的数字字符构成，它用来回顾某个捕获组所捕获的文本字符。反向引用的存在会使匹配器用该反向引用的捕获组编号去回顾该捕获组保存的匹配，然后用该匹配的字符去尝试进一步匹配。下面这个示例演示了反向引用在文本中查找语法错误时的用处:


	java RegexDemo "(Java( language)\2)" "The Java language language"


The example uses the (Java( language)\2) regex to search the text The Java language language for a grammatical error, where Java immediately precedes two consecutive occurrences of language. That regex specifies two capturing groups: number 1 is (Java( language)\2), which matches Java language language, and number 2 is ( language), which matches a space character followed by language. The \2 back reference recalls number 2's saved match, which allows the matcher to search for a second occurrence of a space character followed by language, which immediately follows the first occurrence of the space character and language. The following output shows what RegexDemo's matcher finds:

该示例使用 (Java( language)\2) 这个正则表达式在文本 The Java language language 中查找语法错误，也就是 Java 后面紧跟着连续两次 language 的情况。该正则表达式指定了两个捕获组:编号 1 是 (Java( language)\2)，它匹配 Java language language;编号 2 是 ( language)，它匹配一个空格字符后跟 language。\2 反向引用回顾编号 2 保存的匹配，从而让匹配器去查找第二处“空格字符后跟 language”，而它紧跟在第一处“空格字符后跟 language”之后。下面的输出显示了 RegexDemo 的匹配器找到了什么:


	Regex = (Java( language)\2)
	Text = The Java language language
	Found Java language language
	  starting at index 4 and ending at index 26


### Quantifiers

### 量词

Quantifiers are probably the most confusing regex constructs to understand. Part of that confusion comes from trying to grasp Pattern's 18 quantifier categories (organized as three major categories of six fundamental quantifier categories). Another part of that confusion comes from trying to decipher the concept of zero-length matches. Once you understand that concept and those 18 categories, much (if not all) of the confusion disappears.

量词大概是所有正则表达式构造中最令人费解的。一部分困惑来自要理解 Pattern 的 18 种量词类别(它们分为三大类，每类包含六个基本量词类别)。另一部分困惑来自要弄懂“零长度匹配(zero-length match)”这个概念。一旦你理解了那个概念和这 18 种类别，大部分(即使不是全部)困惑就会消失。

> ###Note
> For brevity, this section discusses only the basics of the 18 quantifier categories and the zero-length match concept. Study The Java Tutorial's "Quantifiers" section for a more detailed discussion and more examples.
>
> ###注意
> 为简洁起见，本节只讨论这 18 种量词类别的基础知识以及零长度匹配的概念。更详细的讨论和更多示例，请研读 The Java Tutorial 的 "Quantifiers" 一节。


A quantifier is a regex construct that implicitly or explicitly binds a numeric value to a pattern. That numeric value determines how many times to match a pattern. Pattern's six fundamental quantifiers match a pattern once or not at all, zero or more times, one or more times, an exact number of times, at least x times, and at least x times but no more than y times.

量词(quantifier)是一种正则表达式构造，它隐式或显式地把一个数值绑定到一个模式上。这个数值决定了一个模式要匹配多少次。Pattern 的六个基本量词分别用于匹配:一次或不匹配、零次或多次、一次或多次、恰好若干次、至少 x 次，以及至少 x 次但不超过 y 次。

The six fundamental quantifier categories replicate in each of three major categories: greedy, reluctant, and possessive. Greedy quantifiers attempt to find the longest match. In contrast, reluctant quantifiers attempt to find the shortest match. Possessive quantifiers also try to find the longest match. However, they differ from greedy quantifies in how they work. Although greedy and possessive quantifiers force a matcher to read in the entire text prior to attempting a first match, greedy quantifiers often cause a matcher to make multiple attempts to find a match, whereas possessive quantifiers cause a matcher to attempt a match only once.

这六个基本量词类别会各自在三大类中重现:贪婪(greedy)、勉强(reluctant)和占有(possessive)。贪婪量词试图找到最长的匹配。相反，勉强量词试图找到最短的匹配。占有量词也试图找到最长的匹配。不过，它们与贪婪量词的区别在于工作方式。虽然贪婪量词和占有量词都会迫使匹配器在尝试第一次匹配之前读入整个文本，但贪婪量词常常会使匹配器多次尝试寻找匹配，而占有量词只让匹配器尝试一次。

The following examples illustrate the behavior of the six fundamental quantifiers in the greedy category, and the behavior of a single fundamental quantifier in each of the reluctant and possessive categories. These examples also introduce the zero-length match concept:

下面的示例演示了贪婪类中六个基本量词的行为，以及勉强类和占有类中各自一个基本量词的行为。这些示例还会引入零长度匹配的概念:


**1**、 java RegexDemo a? abaa: uses a greedy quantifier to match a in abaa once or not at all. The following output results:

**1**、 java RegexDemo a? abaa: 使用一个贪婪量词来匹配 abaa 中的 a，匹配一次或不匹配。产生如下输出:


	Regex = a?
	Text = abaa
	Found a
	  starting at index 0 and ending at index 1
	Found
	  starting at index 1 and ending at index 1
	Found a
	  starting at index 2 and ending at index 3
	Found a
	  starting at index 3 and ending at index 4
	Found
	  starting at index 4 and ending at index 4


The output reveals five matches. Although the first, third, and fourth matches come as no surprise in that they reveal the positions of the three as in abaa, the second and fifth matches are probably surprising. Those matches seem to indicate that a matches b and also the text's end. However, that is not the case. a? does not look for b or the text's end. Instead, it looks for either the presence or lack of a. When a? fails to find a, it reports that fact as a zero-length match, a match of zero length where the start and end indexes are the same. Zero-length matches occur in empty text, after the last text character, or between any two text characters.

输出显示有五个匹配。第一个、第三个和第四个匹配并不令人意外，因为它们显示了 abaa 中三个 a 的位置;但第二个和第五个匹配可能让人意外。这些匹配似乎表明 a 匹配了 b，也匹配了文本末尾。然而事实并非如此。a? 并不查找 b 或文本末尾，它查找的是 a 存在与否。当 a? 找不到 a 时，它会以零长度匹配(zero-length match)的形式报告这一事实——所谓零长度匹配，就是起始索引和结束索引相同的、长度为零的匹配。零长度匹配会出现在空文本中、最后一个文本字符之后，或任意两个文本字符之间。


**2**、java RegexDemo a* abaa: uses a greedy quantifier to match a in abaa zero or more times. The following output results:

**2**、java RegexDemo a* abaa: 使用一个贪婪量词来匹配 abaa 中的 a，匹配零次或多次。产生如下输出:


	Regex = a*
	Text = abaa
	Found a
	  starting at index 0 and ending at index 1
	Found
	  starting at index 1 and ending at index 1
	Found aa
	  starting at index 2 and ending at index 4
	Found
	  starting at index 4 and ending at index 4

The output reveals four matches. As with a?, a* produces zero-length matches. The third match, where a* matches aa, is interesting. Unlike a?, a* matches either no a or all consecutive as.

输出显示有四个匹配。和 a? 一样，a* 会产生零长度匹配。第三个匹配中 a* 匹配了 aa，这一点很有意思。与 a? 不同，a* 要么不匹配 a，要么匹配所有连续的 a。


**3**、java RegexDemo a+ abaa: uses a greedy quantifier to match a in abaa one or more times. The following output results:

**3**、 java RegexDemo a+ abaa: 使用一个贪婪量词来匹配 abaa 中的 a，匹配一次或多次。产生如下输出:


	Regex = a+
	Text = abaa
	Found a
	  starting at index 0 and ending at index 1
	Found aa
	  starting at index 2 and ending at index 4


The output reveals two matches. Unlike a? and a*, a+ does not match the absence of a. Thus, no zero-length matches result. Like a*, a+ matches all consecutive as.

输出显示有两个匹配。与 a? 和 a* 不同，a+ 不匹配“没有 a”的情况。因此不会产生零长度匹配。和 a* 一样，a+ 匹配所有连续的 a。

**4**、java RegexDemo a{2} aababbaaaab: uses a greedy quantifier to match every aa sequence in aababbaaaab. The following output results:

**4**、java RegexDemo a{2} aababbaaaab: 使用一个贪婪量词来匹配 aababbaaaab 中的每个 aa 序列。产生如下输出:



	Regex = a{2}
	Text = aababbaaaab
	Found aa
	  starting at index 0 and ending at index 2
	Found aa
	  starting at index 6 and ending at index 8
	Found aa
	  starting at index 8 and ending at index 10


**5**、 java RegexDemo a{2,} aababbaaaab: uses a greedy quantifier to match two or more consecutive as in aababbaaaab. The following output results:

**5**、 java RegexDemo a{2,} aababbaaaab: 使用一个贪婪量词来匹配 aababbaaaab 中两个或更多连续的 a。产生如下输出:

	Regex = a{2,}
	Text = aababbaaaab
	Found aa
	  starting at index 0 and ending at index 2
	Found aaaa
	  starting at index 6 and ending at index 10


**6**、java RegexDemo a{1,3} aababbaaaab: uses a greedy quantifier to match every a, aa, or aaa in aababbaaaab. The following output results:

**6**、java RegexDemo a{1,3} aababbaaaab: 使用一个贪婪量词来匹配 aababbaaaab 中的每个 a、aa 或 aaa。产生如下输出:

	Regex = a{1,3}
	Text = aababbaaaab
	Found aa
	  starting at index 0 and ending at index 2
	Found a
	  starting at index 3 and ending at index 4
	Found aaa
	  starting at index 6 and ending at index 9
	Found a
	  starting at index 9 and ending at index 10


**7**、 ava RegexDemo a+? abaa: uses a reluctant quantifier to match a in abaa one or more times. The following output results:

**7**、 ava RegexDemo a+? abaa: 使用一个勉强量词来匹配 abaa 中的 a，匹配一次或多次。产生如下输出:

	Regex = a+?
	Text = abaa
	Found a
	  starting at index 0 and ending at index 1
	Found a
	  starting at index 2 and ending at index 3
	Found a
	  starting at index 3 and ending at index 4


Unlike its greedy variant in the third example, the reluctant example produces three matches of a single a because the reluctant quantifier tries to find the shortest match.

与第三个示例中的贪婪版本不同，这个勉强版本产生三个只匹配单个 a 的结果，因为勉强量词试图找到最短的匹配。

**8**、 java RegexDemo .*+end "This is the end": uses a possessive quantifier to match all characters followed by end in This is the end zero or more times. The following output results:

**8**、 java RegexDemo .*+end "This is the end": 使用一个占有量词来匹配 This is the end 中后面跟着 end 的所有字符，匹配零次或多次。产生如下输出:


	Regex = .*+end
	Text = This is the end

The possessive quantifier produces no matches because it causes a matcher to consume the entire text, leaving nothing left to match end. In contrast, the greedy quantifier in java RegexDemo .*end "This is the end" produces a match because it causes a matcher to keep backing off one character at a time until the rightmost end matches.

占有量词不产生任何匹配，因为它会让匹配器消耗掉整个文本，没剩下任何东西来匹配 end。相比之下，java RegexDemo .*end "This is the end" 中的贪婪量词会产生一个匹配，因为它会让匹配器一次回退一个字符，直到最靠右的 end 得以匹配。


### Boundary matchers

### 边界匹配器

We sometimes want to match patterns at the beginning of lines, at word boundaries, at the end of text, and so on. Accomplish that task with a boundary matcher, a regex construct that identifies a match location. Table 2 presents Pattern's supported boundary matchers.

我们有时希望在行首、单词边界、文本末尾等位置匹配模式。用边界匹配器(boundary matcher)来完成这项任务，它就是一种标示匹配位置的正则表达式构造。表 2 列出了 Pattern 支持的边界匹配器。


> ###Table 2. Boundary matchers
> ###表 2. 边界匹配器


<table border="0" cellpadding="5" cellspacing="1"><tbody><tr bgcolor="#990033"><td>Boundary Matcher </td><td>Description </td></tr><tr bgcolor="#cccccc"><td><code>^</code> </td><td>The beginning of a line</td></tr><tr bgcolor="#ffffff"><td><code>$</code> </td><td>The end of a line</td></tr><tr bgcolor="#cccccc"><td><code>\b</code> </td><td>A word boundary</td></tr><tr bgcolor="#ffffff"><td><code>\B</code> </td><td>A nonword boundary</td></tr><tr bgcolor="#cccccc"><td><code>\A</code> </td><td>The beginning of the text</td></tr><tr bgcolor="#ffffff"><td><code>\G</code> </td><td>The end of the previous match</td></tr><tr bgcolor="#cccccc"><td><code>\Z</code> </td><td>The end of the text (but for the final line terminator, if any)</td></tr><tr bgcolor="#ffffff"><td><code>\z</code> </td><td>The end of the text</td></tr></tbody></table>


The following command-line example uses the ^ boundary matcher metacharacter to ensure that a line begins with The followed by zero or more word characters:

下面这个命令行示例使用 ^ 边界匹配器元字符，确保某一行以 The 开头，后面跟零个或多个单词字符:

	java RegexDemo ^The\w* Therefore


`^` indicates that the first three text characters must match the pattern's subsequent T, h, and e characters. Any number of word characters may follow. The command line above produces the following output:

`^` 表示文本最前面的三个字符必须匹配模式中随后的 T、h、e 字符。之后可以跟任意数量的单词字符。上面的命令行会产生如下输出:

	Regex = ^The\w*
	Text = Therefore
	Found Therefore
	  starting at index 0 and ending at index 9


Change the command line to java RegexDemo ^The\w* " Therefore". What happens? No match is found because a space character precedes Therefore.

把命令行改成 java RegexDemo ^The\w* " Therefore" 会怎样?找不到匹配，因为 Therefore 前面有一个空格字符。

### Embedded flag expressions

### 嵌入式标志表达式

Matchers assume certain defaults, such as case-sensitive pattern matching. A program may override any default by using an embedded flag expression, that is, a regex construct specified as parentheses metacharacters surrounding a question mark metacharacter (?) followed by a specific lowercase letter. Pattern recognizes the following embedded flag expressions:

匹配器会采用某些默认行为，例如区分大小写的模式匹配。程序可以通过嵌入式标志表达式(embedded flag expression)来覆盖任何默认设置;所谓嵌入式标志表达式，就是用圆括号元字符括起来的、一个问号元字符(?)后跟某个小写字母的正则表达式构造。Pattern 识别以下嵌入式标志表达式:


- (?i): enables case-insensitive pattern matching. Example: java RegexDemo (?i)tree Treehouse matches tree with Tree. Case-sensitive pattern matching is the default.

- (?i): 启用不区分大小写的模式匹配。示例: java RegexDemo (?i)tree Treehouse 会把 tree 与 Tree 匹配。默认是区分大小写的模式匹配。
- (?x): permits whitespace and comments beginning with the # metacharacter to appear in a pattern. A matcher ignores both. Example: java RegexDemo ".at(?x)#match hat, cat, and so on" matter matches .at with mat. By default, whitespace and comments are not permitted; a matcher regards them as characters that contribute to a match.

- (?x): 允许模式中出现空白以及以 # 元字符开头的注释。匹配器会忽略这两者。示例: java RegexDemo ".at(?x)#match hat, cat, and so on" matter 会把 .at 与 mat 匹配。默认情况下不允许空白和注释;匹配器会把它们当作参与匹配的字符。
- (?s): enables dotall mode. In that mode, the period metacharacter matches line terminators in addition to any other character. Example: java RegexDemo (?s). \n matches . with \n. Nondotall mode is the default: line-terminator characters do not match.

- (?s): 启用 dotall 模式。在该模式下，句点元字符除匹配其他任意字符外，还匹配行终止符。示例: java RegexDemo (?s). \n 会把 . 与 \n 匹配。默认是非 dotall 模式:行终止符字符不参与匹配。
- (?m): enables multiline mode. In multiline mode, ^ and $ match just after or just before (respectively) a line terminator or the text's end. Example: java RegexDemo (?m)^.ake make\rlake\n\rtake matches .ake with make, lake, and take. Non-multiline mode is the default: ^ and $ match only at the beginning and end of the entire text.

- (?m): 启用多行模式。在多行模式下，^ 和 $ 分别匹配行终止符之后或之前的位置(以及文本末尾)。示例: java RegexDemo (?m)^.ake make\rlake\n\rtake 会把 .ake 与 make、lake、take 匹配。默认是非多行模式:^ 和 $ 只在整个文本的开头和结尾匹配。
- (?u): enables Unicode-aware case folding. This flag works with (?i) to perform case-insensitive matching in a manner consistent with the Unicode Standard. The default: case-insensitive matching that assumes only characters in the US-ASCII character set match.

- (?u): 启用支持 Unicode 的大小写折叠。该标志与 (?i) 配合使用，以符合 Unicode 标准的方式进行不区分大小写的匹配。默认行为:假定只有 US-ASCII 字符集中的字符参与不区分大小写的匹配。
- (?d): enables Unix lines mode. In that mode, a matcher recognizes only the \n line terminator in the context of the ., ^, and $ metacharacters. Non-Unix lines mode is the default: a matcher recognizes all terminators in the context of the aforementioned metacharacters.

- (?d): 启用 Unix 行模式。在该模式下，匹配器在 .、^、$ 元字符的上下文中只识别 \n 行终止符。默认是非 Unix 行模式:匹配器在上述元字符的上下文中识别所有行终止符。


Embedded flag expressions resemble capturing groups because both regex constructs surround their characters with parentheses metacharacters. Unlike a capturing group, an embedded flag expression does not capture a match's characters. Thus, an embedded flag expression is an example of a noncapturing group, that is, a regex construct that does not capture text characters; it's specified as a character sequence surrounded by parentheses metacharacters. Several kinds of noncapturing groups appear in Pattern's SDK documentation.

嵌入式标志表达式看起来和捕获组很像，因为这两种正则表达式构造都用圆括号元字符把字符括起来。与捕获组不同的是，嵌入式标志表达式不会捕获匹配的字符。因此，嵌入式标志表达式是非捕获组(noncapturing group)的一个例子——所谓非捕获组，就是不捕获文本字符的正则表达式构造，它由用圆括号元字符括起来的一段字符序列构成。Pattern 的 SDK 文档中出现了好几种非捕获组。


> ###Tip
> To specify multiple embedded flag expressions in a regex, either place them side by side (e.g., (?m)(?i)) or place their lowercase letters side by side (e.g., (?mi)).
>
> ###提示
> 要在正则表达式中指定多个嵌入式标志表达式，可以把它们并排放置(例如 (?m)(?i))，或者把它们的小写字母并排放置(例如 (?mi))。


###Explore the java.util.regex classes' methods

### 探究 java.util.regex 各类的方法

java.util.regex's three classes offer various methods to help us write more robust regex source code and create powerful tools to manipulate text. Our exploration of those methods begins in the Pattern class.

java.util.regex 的三个类提供了各种方法，帮助我们编写更健壮的正则表达式源代码，并创建强大的文本处理工具。我们对这些方法的探究从 Pattern 类开始。


> ###Note
> You might also want to explore the CharSequence interface's methods, which you can implement when you create a new character sequence class. The only classes currently implementing CharSequence are java.nio.CharBuffer, String, and StringBuffer.
>
> ###注意
> 你可能还想探究 CharSequence 接口的方法，当你创建新的字符序列类时可以实现这些方法。目前实现 CharSequence 的类只有 java.nio.CharBuffer、String 和 StringBuffer。


### Pattern methods

### Pattern 的方法

A regex is useless until code compiles that string into a Pattern object. Accomplish that task with either of the following compilation methods:

在代码把这个字符串编译成 Pattern 对象之前，正则表达式毫无用处。用下面两种编译方法之一即可完成这项任务:


- public static Pattern compile(String regex): compiles regex's contents into a tree-structured object representation stored in a new Pattern object. A reference to that object returns. Example: Pattern p = Pattern.compile ("(?m)^\\."); creates a Pattern object that stores a compiled representation of the regex for matching all lines starting with a period character.

- public static Pattern compile(String regex): 把 regex 的内容编译成树状结构的对象表示，并存储在新的 Pattern 对象中，返回对该对象的引用。示例: Pattern p = Pattern.compile ("(?m)^\\."); 创建一个 Pattern 对象，其中存储着用于匹配所有以句点字符开头的行的正则表达式编译表示。

- public static Pattern compile(String regex, int flags): accomplishes the same task as the previous method. However, it also considers a bitwise inclusive ORed set of flag constant bit values (which flags specifies). Flag constants are declared in Pattern and serve (except the canonical equivalence flag, CANON_EQ) as an alternative to embedded flag expressions. Example: Pattern p = Pattern.compile ("^\\.", Pattern.MULTILINE); is equivalent to the previous example, where the Pattern.MULTILINE constant and the (?m) embedded flag expression accomplish the same task. (Consult the SDK's Pattern documentation to learn about other constants.) This method throws an IllegalArgumentException object if bit values other than those bit values that Pattern's constants represent appear in flags.

- public static Pattern compile(String regex, int flags): 与前一个方法完成同样的任务。不过，它还会考虑按位包含或(OR)组合起来的一组标志常量位值(由 flags 指定)。标志常量声明在 Pattern 中，作用(除了规范等价标志 CANON_EQ 以外)相当于嵌入式标志表达式的替代方式。示例: Pattern p = Pattern.compile ("^\\.", Pattern.MULTILINE); 等价于前一个示例，其中 Pattern.MULTILINE 常量和 (?m) 嵌入式标志表达式完成同样的任务。(查阅 SDK 中 Pattern 的文档，了解其他常量。)如果 flags 中出现了 Pattern 常量所代表位值之外的位值，此方法会抛出 IllegalArgumentException 对象。


When needed, obtain a copy of a Pattern object's flags and the original regex that compiled into that object by calling the following methods:

在需要时，调用以下方法可以获取 Pattern 对象所用标志的副本，以及编译生成该对象的原始正则表达式:


- public int flags(): returns the Pattern object's flags specified when a regex compiles. Example: System.out.println (p.flags ()); outputs the flags associated with the Pattern object that p references.

- public int flags(): 返回编译正则表达式时为该 Pattern 对象指定的标志。示例: System.out.println (p.flags ()); 输出 p 所引用 Pattern 对象关联的标志。

- public String pattern(): returns the original regex that compiled into the Pattern object. Example: System.out.println (p.pattern ()); outputs the regex corresponding to the Pattern that p references. (The Matcher class includes a similar Pattern pattern() method that returns a matcher's associated Pattern object.)

- public String pattern(): 返回编译生成该 Pattern 对象的原始正则表达式。示例: System.out.println (p.pattern ()); 输出 p 所引用 Pattern 对应的正则表达式。(Matcher 类包含一个类似的 Pattern pattern() 方法，它返回匹配器关联的 Pattern 对象。)


After creating a Pattern object, you commonly obtain a Matcher object from Pattern by calling Pattern's public matcher(CharSequence text) method. That method requires a single text object argument, whose class implements the CharSequence interface. The obtained matcher scans the characters in the text object during a pattern match operation. Example: Pattern p = Pattern.compile ("[^aeiouy]"); Matcher m = p.matcher ("This is a test."); obtains a matcher to match nonvowel characters in This is a test..

创建 Pattern 对象之后，你通常会调用 Pattern 的 public matcher(CharSequence text) 方法，从 Pattern 获得一个 Matcher 对象。该方法需要一个文本对象参数，其类实现 CharSequence 接口。在模式匹配操作期间，所获得的匹配器会扫描该文本对象中的字符。示例: Pattern p = Pattern.compile ("[^aeiouy]"); Matcher m = p.matcher ("This is a test."); 获得一个匹配器，用来匹配 This is a test. 中的非元音字符。

Creating Pattern and Matcher objects is bothersome when you wish to quickly check if a pattern completely matches a text sequence. Fortunately, Pattern offers a convenience method to help you accomplish that task: public static boolean matches(String regex, CharSequence text). That static method returns a Boolean true value if and only if the entire text character sequence matches regex's pattern. Example: System.out.println (Pattern.matches ("[a-z[\\s]]*", "all lowercase letters and whitespace only")); returns a Boolean true value, indicating only whitespace characters and lowercase letters appear in all lowercase letters and whitespace only.

当你想快速检查某个模式是否与一段文本序列完全匹配时，创建 Pattern 和 Matcher 对象就有点麻烦了。好在 Pattern 提供了一个便捷方法来帮你完成这项任务: public static boolean matches(String regex, CharSequence text)。这个静态方法当且仅当整个文本字符序列匹配 regex 的模式时，返回布尔值 true。示例: System.out.println (Pattern.matches ("[a-z[\\s]]*", "all lowercase letters and whitespace only")); 返回布尔值 true，表示 all lowercase letters and whitespace only 中只出现空白字符和小写字母。

Writing code to break text into its component parts (such as a text file's employee record into a set of fields) is a task many developers find tedious. Pattern relieves that tedium by providing a pair of text-splitting methods:

编写代码把文本拆分成各个组成部分(例如把文本文件中的员工记录拆分成一组字段)是许多开发者觉得乏味的任务。Pattern 提供了一对拆分文本的方法，帮你摆脱这种乏味:


- public String [] split(CharSequence text, int limit): splits text around matches of the current Pattern object's pattern. This method returns an array, where each entry specifies a text sequence separated from the next text sequence by a pattern match (or the text's end); and all array entries store in the same order as they appear in the text. The number of array entries depends on limit, which also controls the number of matches that occur. A positive value means that, at most, limit-1 matches are considered and the array's length is no greater than limit entries. A negative value means all possible matches are considered and the array can have any length. A zero value means all possible matches are considered, the array can have any length, and trailing empty strings are discarded.

- public String [] split(CharSequence text, int limit): 围绕当前 Pattern 对象模式的匹配来拆分 text。该方法返回一个数组，其中每一项表示一段文本序列，它与下一段文本序列之间被一个模式匹配(或文本末尾)隔开;所有数组项按它们在文本中出现的顺序存储。数组项的数量取决于 limit，limit 同时也控制发生的匹配数量。正值表示最多考虑 limit-1 个匹配，数组长度不超过 limit 项。负值表示考虑所有可能的匹配，数组可以有任意长度。零值表示考虑所有可能的匹配，数组可以有任意长度，并且丢弃末尾的空字符串。

- public String [] split(CharSequence text): invokes the previous method with zero as the limit and returns the method call's result.

- public String [] split(CharSequence text): 以零作为 limit 调用前一个方法，并返回该调用的结果。

Suppose you want to split an employee record, consisting of name, age, street address, and salary, into its field components. The following code fragment uses split(CharSequence text) to accomplish that task:

假设你想把一条由姓名、年龄、街道地址和薪水组成的员工记录拆分成各个字段组成。下面这段代码使用 split(CharSequence text) 完成这项任务:

	Pattern p = Pattern.compile (",\\s");
	String [] fields = p.split ("John Doe, 47, Hillsboro Road, 32000");
	for (int i = 0; i < fields.length; i++)
	     System.out.println (fields [i]);


The code fragment above specifies a regex that matches a comma character immediately followed by a single-space character and produces the following output:

上面这段代码指定了一个匹配“逗号字符后紧跟单个空格字符”的正则表达式，并产生如下输出:


	John Doe
	47
	Hillsboro Road
	32000


> ### Note
> String incorporates three convenience methods that invoke their equivalent Pattern methods: public boolean matches(String regex), public String [] split(String regex), and public String [] split(String regex, int limit).
>
> ### 注意
> String 提供了三个便捷方法，它们会调用等价的 Pattern 方法: public boolean matches(String regex)、public String [] split(String regex) 和 public String [] split(String regex, int limit)。



### Matcher methods

### Matcher 的方法

Matcher objects support different kinds of pattern match operations, such as scanning text for the next match; attempting to match the entire text against a pattern; and attempting to match a portion of text against a pattern. Accomplish those match operations with the following methods:

Matcher 对象支持不同类型的模式匹配操作，例如在文本中扫描下一个匹配;尝试让整个文本与模式匹配;以及尝试让文本的一部分与模式匹配。用以下方法完成这些匹配操作:


- public boolean find(): scans text for the next match. That method either starts its scan at the beginning of the text or, if a previous invocation of the method returned true and the matcher has not been reset, at the first character following the previous match. A Boolean true value returns if a match is found. Listing 1 presents an example.

- public boolean find(): 在文本中扫描下一个匹配。该方法要么从文本开头开始扫描，要么(如果之前调用该方法返回了 true 且匹配器尚未重置)从上一次匹配之后的第一个字符开始扫描。如果找到匹配，返回布尔值 true。清单 1 给出了一个示例。
- public boolean find(int start): resets the matcher and scans text for the next match. The scan begins at the index specified by start. A Boolean true value returns if a match is found. Example: m.find (1); scans text beginning at index 1. (Index 0 is ignored.) If start contains a negative value or a value exceeding the length of the matcher's text, this method throws an IndexOutOfBoundsException object.

- public boolean find(int start): 重置匹配器并扫描文本中的下一个匹配。扫描从 start 指定的索引处开始。如果找到匹配，返回布尔值 true。示例: m.find (1); 从索引 1 开始扫描文本。(索引 0 被忽略。)如果 start 为负值或超过匹配器文本的长度，此方法会抛出 IndexOutOfBoundsException 对象。
- public boolean matches(): attempts to match the entire text against the pattern. That method returns a Boolean true value if the entire text matches. Example: Pattern p = Pattern.compile ("\\w*"); Matcher m = p.matcher ("abc!"); System.out.println (p.matches ()); outputs false because the entire abc! text lacks word characters.

- public boolean matches(): 尝试让整个文本与模式匹配。如果整个文本都匹配，该方法返回布尔值 true。示例: Pattern p = Pattern.compile ("\\w*"); Matcher m = p.matcher ("abc!"); System.out.println (p.matches ()); 输出 false，因为整个 abc! 文本并非完全由单词字符组成，无法整体匹配。
- public boolean lookingAt(): attempts to match the text against the pattern. That method returns a Boolean true value if the text matches. Unlike matches(), the entire text does not need to be matched. Example: Pattern p = Pattern.compile ("\\w*"); Matcher m = p.matcher ("abc!"); System.out.println (p.lookingAt ()); outputs true because the beginning of the abc! text consists of word characters only.

- public boolean lookingAt(): 尝试让文本与模式匹配。如果文本匹配，该方法返回布尔值 true。与 matches() 不同，它不要求整个文本都匹配。示例: Pattern p = Pattern.compile ("\\w*"); Matcher m = p.matcher ("abc!"); System.out.println (p.lookingAt ()); 输出 true，因为 abc! 文本的开头只由单词字符组成。


Unlike Pattern objects, Matcher objects record state information. Occasionally, you might want to reset a matcher to clear that information after performing a pattern match. The following methods reset a matcher:

与 Pattern 对象不同，Matcher 对象会记录状态信息。有时，你可能想在执行一次模式匹配之后重置匹配器，以清除这些信息。以下方法可以重置匹配器:


- public Matcher reset(): resets a matcher's state, including the matcher's append position (which clears to 0). The next pattern match operation begins at the start of the matcher's text. A reference to the current Matcher object returns. Example: m.reset (); resets the matcher referenced by m.

- public Matcher reset(): 重置匹配器的状态，包括匹配器的追加位置(它会被清零为 0)。下一次模式匹配操作会从匹配器文本的开头开始。返回对当前 Matcher 对象的引用。示例: m.reset (); 重置 m 引用的匹配器。

- public Matcher reset(CharSequence text): resets a matcher's state and sets the matcher's text to text's contents. The next pattern match operation begins at the start of the matcher's new text. A reference to the current Matcher object returns. Example: m.reset ("new text"); resets the m-referenced matcher and also specifies new text as the matcher's new text.

- public Matcher reset(CharSequence text): 重置匹配器的状态，并把匹配器的文本设为 text 的内容。下一次模式匹配操作会从匹配器新文本的开头开始。返回对当前 Matcher 对象的引用。示例: m.reset ("new text"); 重置 m 引用的匹配器，同时把 new text 指定为匹配器的新文本。


A matcher's append position identifies the start of the matcher's text that appends to a StringBuffer object. The following methods use the append position:

匹配器的追加位置(append position)标示匹配器文本中要追加到 StringBuffer 对象的那部分起始处。以下方法会用到追加位置:


- public Matcher appendReplacement(StringBuffer sb, String replacement): reads the matcher's text characters and appends them to the sb-referenced StringBuffer object. The method stops reading after the last character preceding the previous pattern match. This method next appends the characters in the replacement-referenced String object to the StringBuffer object. (The replacement string may contain references to text sequences captured during the previous match, via dollar-sign characters ($) and capturing group numbers.) Finally, the method sets the matcher's append position to the index of the last matched character plus one. A reference to the current matcher returns. This method throws an IllegalStateException object if the matcher has not yet made a match or if the previous match attempt failed. An IndexOutOfBoundsException object is thrown if replacement specifies a capturing group that does not exist in the pattern.

- public Matcher appendReplacement(StringBuffer sb, String replacement): 读取匹配器的文本字符并把它们追加到 sb 引用的 StringBuffer 对象。该方法会读到上一次模式匹配之前的最后一个字符处停止。接着，此方法把 replacement 引用的 String 对象中的字符追加到该 StringBuffer 对象。(替换字符串中可以包含对上一次匹配期间捕获的文本序列的引用，方式是使用美元符号字符($)和捕获组编号。)最后，该方法把匹配器的追加位置设为最后一个被匹配字符的索引加一。返回对当前匹配器的引用。如果匹配器尚未进行任何匹配，或上一次匹配尝试失败，此方法会抛出 IllegalStateException 对象。如果 replacement 指定了模式中不存在的捕获组，则会抛出 IndexOutOfBoundsException 对象。
- public StringBuffer appendTail(StringBuffer sb): appends all text to the StringBuffer object and returns that object's reference. Following a final call to the appendReplacement(StringBuffer sb, String replacement) method, call appendTail(StringBuffer sb) to copy remaining text to the StringBuffer object.

- public StringBuffer appendTail(StringBuffer sb): 把所有文本追加到 StringBuffer 对象，并返回该对象的引用。在最后一次调用 appendReplacement(StringBuffer sb, String replacement) 方法之后，调用 appendTail(StringBuffer sb) 可把剩余文本复制到 StringBuffer 对象。


The following example calls the appendReplacement(StringBuffer sb, String replacement) and appendTail(StringBuffer sb) methods to replace all occurrences of cat within one cat, two cats, or three cats on a fence with caterpillar. A capturing group and a reference to that capturing group in the replacement text allows the insertion of erpillar after each cat match:

下面这个示例调用 appendReplacement(StringBuffer sb, String replacement) 和 appendTail(StringBuffer sb) 方法，把 one cat, two cats, or three cats on a fence 中所有 cat 都替换为 caterpillar。借助一个捕获组以及对替换文本中该捕获组的引用，可以在每次匹配 cat 之后插入 erpillar:



	Pattern p = Pattern.compile ("(cat)");
	Matcher m = p.matcher ("one cat, two cats, or three cats on a fence");
	StringBuffer sb = new StringBuffer ();
	while (m.find ())
	   m.appendReplacement (sb, "erpillar");
	m.appendTail (sb);
	System.out.println (sb);


The example produces the following output:

该示例产生如下输出:

	one caterpillar, two caterpillars, or three caterpillars on a fence


Two other text replacement methods make it possible to replace either the first match or all matches with replacement text:

另外两个文本替换方法可以让你用替换文本替换第一个匹配或所有匹配:

- public String replaceFirst(String replacement): resets the matcher, creates a new String object, copies all the matcher's text characters (up to the first match) to String, appends the replacement characters to String, copies remaining characters to String, and returns that object's reference. (The replacement string may contain references to text sequences captured during the previous match, via dollar-sign characters and capturing group numbers.)

- public String replaceFirst(String replacement): 重置匹配器，创建一个新的 String 对象，把匹配器文本的所有字符(直到第一个匹配为止)复制到该 String，把 replacement 字符追加到该 String，把剩余字符复制到该 String，并返回该对象的引用。(替换字符串中可以包含对上一次匹配期间捕获的文本序列的引用，方式是使用美元符号字符和捕获组编号。)
- public String replaceAll(String replacement): operates similarly to the previous method. However, replaceAll(String replacement) replaces all matches with replacement's characters.

- public String replaceAll(String replacement): 与前一个方法操作方式类似。不过，replaceAll(String replacement) 会用 replacement 的字符替换所有匹配。


The \s+ regex detects one or more occurrences of whitespace characters in text. The following example uses that regex and calls the replaceAll(String replacement) method to remove duplicate whitespace from text:

\s+ 正则表达式会检测文本中一处或多处连续的空白字符。下面的示例使用该正则表达式并调用 replaceAll(String replacement) 方法，去除文本中重复的空白:

	Pattern p = Pattern.compile ("\\s+");
	Matcher m = p.matcher ("Remove     the \t\t duplicate whitespace.   ");
	System.out.println (m.replaceAll (" "));


The example produces the following output:

该示例产生如下输出:


	Remove the duplicate whitespace.


Listing 1 includes System.out.println ("Found " + m.group ());. Notice the call to group(). That method is one of three capturing group-oriented Matcher methods:

清单 1 中包含 System.out.println ("Found " + m.group ());。注意对 group() 的调用。该方法是三个面向捕获组的 Matcher 方法之一:


- public int groupCount(): returns the number of capturing groups in a matcher's pattern. That count does not include the special capturing group number 0, which captures the previous match (whether or not a pattern includes capturing groups).

- public int groupCount(): 返回匹配器模式中捕获组的数量。该计数不包含特殊的捕获组编号 0，它捕获的是上一次匹配(无论模式是否包含捕获组)。
- public String group(): returns the previous match's characters as recorded by capturing group number 0. That method may return an empty string to indicate a successful match against the empty string. An IllegalStateException object is thrown if either the matcher has not yet attempted a match or the previous match operation failed.

- public String group(): 返回捕获组编号 0 所记录的上一次匹配的字符。该方法可能返回空字符串，表示成功匹配了空字符串。如果匹配器尚未尝试匹配，或上一次匹配操作失败，则会抛出 IllegalStateException 对象。
- public String group(int group): resembles the previous method, except it returns the previous match's characters as recorded by the capturing group number that group specifies. If no capturing group with the specified group number exists in the pattern, the method throws an IndexOutOfBoundsException object.

- public String group(int group): 与前一个方法类似，区别在于它返回由 group 指定的捕获组编号所记录的上一次匹配的字符。如果模式中不存在具有指定组编号的捕获组，该方法会抛出 IndexOutOfBoundsException 对象。


The following example demonstrates the capturing group methods:

下面这个示例演示了这些捕获组方法:


	Pattern p = Pattern.compile ("(.(.(.)))");
	Matcher m = p.matcher ("abc");
	m.find ();
	System.out.println (m.groupCount ());
	for (int i = 0; i <= m.groupCount (); i++)
	     System.out.println (i + ": " + m.group (i));


The example produces the following output:

该示例产生如下输出:


	3
	0: abc
	1: abc
	2: bc
	3: c


Capturing group number 0 saves the previous match and has nothing to do with whether a capturing group appears in the pattern, which is (.(.(.))). The other three capturing groups capture the characters of the previous match belonging to those capturing groups. For example, number 2, (.(.)), captures bc; and number 3, (.), captures c.

捕获组编号 0 保存上一次匹配，与模式中是否出现捕获组无关，此处模式是 (.(.(.)))。另外三个捕获组捕获上一次匹配中属于各自捕获组的字符。例如，编号 2 的 (.(.)) 捕获 bc;编号 3 的 (.) 捕获 c。

Before we leave our discussion of Matcher's methods, we should examine four more match position methods:

在结束对 Matcher 方法的讨论之前，我们还应了解四个匹配位置方法:



- public int start(): returns the previous match's start index. That method throws an IllegalStateException object if either the matcher has not yet attempted a match or the previous match operation failed.

- public int start(): 返回上一次匹配的起始索引。如果匹配器尚未尝试匹配，或上一次匹配操作失败，该方法会抛出 IllegalStateException 对象。
- public int start(int group): resembles the previous method, except it returns the previous match's start index associated with the capturing group that group specifies. If no capturing group with the specified capturing group number exists in the pattern, start(int group) throws an IndexOutOfBoundsException object.

- public int start(int group): 与前一个方法类似，区别在于它返回与 group 指定的捕获组相关联的上一次匹配的起始索引。如果模式中不存在具有指定捕获组编号的捕获组，start(int group) 会抛出 IndexOutOfBoundsException 对象。
- public int end(): returns the index of the last matched character plus 1 in the previous match. That method throws an IllegalStateException object if either the matcher has not yet attempted a match or the previous match operation failed.

- public int end(): 返回上一次匹配中最后一个被匹配字符的索引加 1。如果匹配器尚未尝试匹配，或上一次匹配操作失败，该方法会抛出 IllegalStateException 对象。
- public int end(int group): resembles the previous method, except it returns the previous match's end index associated with the capturing group that group specifies. If no capturing group with the specified group number exists in the pattern, end(int group) throws an IndexOutOfBoundsException object.

- public int end(int group): 与前一个方法类似，区别在于它返回与 group 指定的捕获组相关联的上一次匹配的结束索引。如果模式中不存在具有指定组编号的捕获组，end(int group) 会抛出 IndexOutOfBoundsException 对象。


The following example demonstrates two of the match position methods reporting start/end match positions for capturing group number 2:

下面这个示例演示了其中两个匹配位置方法，报告捕获组编号 2 的起始/结束匹配位置:


	Pattern p = Pattern.compile ("(.(.(.)))");
	Matcher m = p.matcher ("abcabcabc");
	while (m.find ())
	{
	   System.out.println ("Found " + m.group (2));
	   System.out.println ("  starting at index " + m.start (2) +
	                       " and ending at index " + m.end (2));
	   System.out.println ();
	}

The example produces the following output:

该示例产生如下输出:

	Found bc
	  starting at index 1 and ending at index 3
	Found bc
	  starting at index 4 and ending at index 6
	Found bc
	  starting at index 7 and ending at index 9


The output shows we are interested in displaying only all matches associated with capturing group number 2, as well as those matches' starting and ending positions.

输出表明我们只想显示与捕获组编号 2 相关联的所有匹配，以及这些匹配的起始和结束位置。


> ##Note
> String incorporates two convenience methods that invoke their equivalent Matcher methods: public String replaceFirst(String regex, String replacement) and public String replaceAll(String regex, String replacement).
>
> ##注意
> String 提供了两个便捷方法，它们会调用等价的 Matcher 方法: public String replaceFirst(String regex, String replacement) 和 public String replaceAll(String regex, String replacement)。


### PatternSyntaxException methods

### PatternSyntaxException 的方法

Pattern's compilation methods throw PatternSyntaxException objects when they detect illegal syntax in a regex's pattern. An exception handler may call the following PatternSyntaxException methods to obtain information from a thrown PatternSyntaxException object about the syntax error:

当 Pattern 的编译方法在正则表达式模式中检测到非法语法时，会抛出 PatternSyntaxException 对象。异常处理器可以调用以下 PatternSyntaxException 方法来从抛出的 PatternSyntaxException 对象中获取有关语法错误的信息:


- public String getDescription(): returns the syntax error's description

- public String getDescription(): 返回语法错误的描述
- public int getIndex(): returns either the approximate index (within a pattern) where the syntax error occurs or -1 if the index is unknown

- public int getIndex(): 返回模式中发生语法错误的近似索引，如果索引未知则返回 -1
- public String getMessage(): builds a multiline string that contains the combined information the other three methods return along with a visual indication of the syntax error position within the pattern

- public String getMessage(): 构建一个多行字符串，其中包含另外三个方法返回的组合信息，以及语法错误在模式中位置的直观指示
- public String getPattern(): returns the erroneous regex pattern

- public String getPattern(): 返回出错的正则表达式模式


Because PatternSyntaxException inherits from java.lang.RuntimeException, code doesn't need to specify an exception handler. This proves appropriate when regexes are known to have correct patterns. But when potential for bad pattern syntax exists, an exception handler is necessary. Thus, RegexDemo's source code (see Listing 1) includes try { ... } catch (ParseSyntaxException e) { ... }, which calls each of the four previous PatternSyntaxException methods to obtain information about an illegal pattern.

由于 PatternSyntaxException 继承自 java.lang.RuntimeException，代码不必指定异常处理器。当已知正则表达式模式正确时，这样做是合适的。但当存在模式语法出错的可能性时，就必须使用异常处理器。因此，RegexDemo 的源代码(见清单 1)包含 try { ... } catch (ParseSyntaxException e) { ... }，它调用前面四个 PatternSyntaxException 方法来获取有关非法模式的信息。

What constitutes an illegal pattern? Not specifying the closing parentheses metacharacter in an embedded flag expression represents one example. Suppose you execute java RegexDemo (?itree Treehouse. That command line's illegal (?tree pattern causes p = Pattern.compile (args [0]); to throw a PatternSyntaxException object. You then observe the following output:

什么才算非法模式?在嵌入式标志表达式中没有指定右圆括号元字符就是一个例子。假设你执行 java RegexDemo (?itree Treehouse。该命令行的非法模式 (?tree 会使 p = Pattern.compile (args [0]); 抛出 PatternSyntaxException 对象。随后你会看到如下输出:


	Regex syntax error: Unknown inline modifier near index 3
	(?itree
	   ^
	Error description: Unknown inline modifier
	Error index: 3
	Erroneous pattern: (?itree


> ##Note
> The public PatternSyntaxException(String desc, String regex, int index) constructor lets you create your own PatternSyntaxException objects. That constructor comes in handy should you ever create your own preprocessing compilation method that recognizes your own pattern syntax, translates that syntax to syntax recognized by Pattern's compilation methods, and calls one of those compilation methods. If your method's caller violates your custom pattern syntax, you can throw an appropriate PatternSyntaxException object from that method.
>
> ##注意
> public PatternSyntaxException(String desc, String regex, int index) 构造函数让你可以创建自己的 PatternSyntaxException 对象。如果你曾经编写自己的预处理编译方法——它识别你自己定义的模式语法，把该语法转换为 Pattern 编译方法所能识别的语法，并调用这些编译方法之一——那么这个构造函数就能派上用场。如果你的方法调用者违反了你自定义的模式语法，你就可以从该方法中抛出合适的 PatternSyntaxException 对象。


### A practical application of regexes

### 正则表达式的一个实际应用

Regexes let you create powerful text-processing applications. One application you might find helpful extracts comments from a Java, C, or C++ source file, and records those comments in another file. Listing 2 presents that application's source code:

正则表达式让你可以创建强大的文本处理应用。有一个应用你可能会觉得有用:从 Java、C 或 C++ 源文件中提取注释，并把这些注释记录到另一个文件中。清单 2 给出了该应用的源代码:

> ####Listing 2. `ExtCmnt.java`
> #### 清单 2. `ExtCmnt.java`


	// ExtCmnt.java
	import java.io.*;
	import java.util.regex.*;
	class ExtCmnt
	{
	   public static void main (String [] args)
	   {
	      if (args.length != 2)
	      {
	          System.err.println ("usage: java ExtCmnt infile outfile");
	          return;
	      }
	      Pattern p;
	      try
	      {
	         // The following pattern lets this extract multiline comments that
	         // appear on a single line (e.g., /* same line */) and single-line
	         // comments (e.g., // some line). Furthermore, the comment may
	         // appear anywhere on the line.
	         p = Pattern.compile (".*/\\*.*\\*/|.*//.*$");
	      }
	      catch (PatternSyntaxException e)
	      {
	         System.err.println ("Regex syntax error: " + e.getMessage ());
	         System.err.println ("Error description: " + e.getDescription ());
	         System.err.println ("Error index: " + e.getIndex ());
	         System.err.println ("Erroneous pattern: " + e.getPattern ());
	         return;
	      }
	      BufferedReader br = null;
	      BufferedWriter bw = null;
	      try
	      {
	          FileReader fr = new FileReader (args [0]);
	          br = new BufferedReader (fr);
	          FileWriter fw = new FileWriter (args [1]);
	          bw = new BufferedWriter (fw);
	          Matcher m = p.matcher ("");
	          String line;
	          while ((line = br.readLine ()) != null)
	          {
	             m.reset (line);
	             if (m.matches ()) /* entire line must match */
	             {
	                 bw.write (line);
	                 bw.newLine ();
	             }
	          }
	      }
	      catch (IOException e)
	      {
	          System.err.println (e.getMessage ());
	          return;
	      }
	      finally // Close file.
	      {
	          try
	          {
	              if (br != null)
	                  br.close ();
	              if (bw != null)
	                  bw.close ();
	          }
	          catch (IOException e)
	          {
	          }
	      }
	   }
	}


After creating Pattern and Matcher objects, ExtCmnt reads a text file's contents line by line. For each read line, the matcher attempts to match that line against a pattern, identifying either a single-line comment or a multiline comment that appears on a single line. If the line matches the pattern, ExtCmnt writes that line to another text file. For example, java ExtCmnt ExtCmnt.java out reads each ExtCmnt.java line, attempts to match that line against the pattern, and outputs matched lines to a file named out. (Don't worry about understanding the file reading and writing logic. I will explore that logic in a future article.) After ExtCmnt completes, out contains the following lines:

创建 Pattern 和 Matcher 对象之后，ExtCmnt 逐行读取一个文本文件的内容。对于读取到的每一行，匹配器都会尝试让该行与某个模式匹配，以识别单行注释或出现在单行中的多行注释。如果该行匹配模式，ExtCmnt 就把该行写入另一个文本文件。例如，java ExtCmnt ExtCmnt.java out 会读取 ExtCmnt.java 的每一行，尝试让该行与模式匹配，并把匹配的行输出到名为 out 的文件中。(不用担心是否理解文件读写的逻辑。我会在以后的文章中探讨那部分逻辑。)ExtCmnt 运行结束后，out 包含以下各行:


	// ExtCmnt.java
	         // The following pattern lets this extract multiline comments that
	         // appear on a single line (e.g., /* same line */) and single-line
	         // comments (e.g., // some line). Furthermore, the comment may
	         // appear anywhere on the line.
	         p = Pattern.compile (".*/\\*.*\\*/|.*//.*$");
	             if (m.matches ()) /* entire line must match */
	      finally // Close file.


The output shows that ExtCmnt is not perfect: p = Pattern.compile (".*/\\*.*\\*/|.*//.*$"); doesn't represent a comment. That line appears in out because ExtCmnt's matcher matches the // characters.

输出表明 ExtCmnt 并不完美: p = Pattern.compile (".*/\\*.*\\*/|.*//.*$"); 并不算一条注释。该行出现在 out 中，是因为 ExtCmnt 的匹配器匹配了 // 字符。

There is something interesting about the pattern in ".*/\\*.*\\*/|.*//.*$": the vertical bar metacharacter (|). According to the SDK documentation, the parentheses metacharacters in a capturing group and the vertical bar metacharacter are logical operators. The vertical bar tells a matcher to use that operator's left regex construct operand to locate a match in the matcher's text. If no match exists, the matcher uses that operator's right regex construct operand in another match attempt.

关于 ".*/\\*.*\\*/|.*//.*$" 中的模式，有一点很有意思:竖线元字符(|)。根据 SDK 文档，捕获组中的圆括号元字符以及竖线元字符都是逻辑运算符。竖线告诉匹配器先用该运算符左侧的正则表达式构造操作数去匹配器文本中定位匹配。如果没有匹配，匹配器就用该运算符右侧的正则表达式构造操作数再尝试一次匹配。


## Review

## 回顾

Although regexes simplify pattern-matching code in text-processing applications, you cannot effectively use regexes in your applications until you understand them. This article gave you a basic understanding of regexes by introducing you to regex terminology, the java.util.regex package, and a program that demonstrates regex constructs. Now that you possess a basic understanding of regexes, build onto that understanding by reading additional articles (see Resources) and studying java.util.regex's SDK documentation, where you can learn about more regex constructs, such as POSIX (Portable Operating System Interface for Unix) character classes.

虽然正则表达式简化了文本处理应用中的模式匹配代码，但在你理解它们之前，无法在应用中高效地使用它们。本文通过向你介绍正则表达式术语、java.util.regex 包，以及一个演示正则表达式构造的程序，让你对正则表达式有了基本认识。既然你已经具备了对正则表达式的基本理解，就请在此基础上继续深入——阅读更多文章(见参考资料)并研读 java.util.regex 的 SDK 文档，在那里你可以学到更多正则表达式构造，例如 POSIX(Portable Operating System Interface for Unix)字符类。

I encourage you to email me with any questions you might have involving either this or any previous article's material. (Please keep such questions relevant to material discussed in this column's articles.) Your questions and my answers will appear in the relevant study guides.

如果你对本文或以往任何一篇文章的内容有疑问，欢迎发邮件给我。(请让问题与本专栏文章所讨论的内容相关。)你的问题和我的解答会出现在相应的学习指南中。

After writing Java 101 articles for 28 consecutive months, I'm taking a two-month break. I'll return in May and introduce a series on data structures and algorithms.

在连续 28 个月撰写 Java 101 文章之后，我要休息两个月。我会在五月回来，并推出一个关于数据结构和算法的系列。

Jeff Friesen has been involved with computers for the past 23 years. He holds a degree in computer science and has worked with many computer languages. Jeff has also taught introductory Java programming at the college level. In addition to writing for JavaWorld, he has written his own Java book for beginners— Java 2 by Example, Second Edition (Que Publishing, 2001; ISBN: 0789725932)—and helped write Using Java 2 Platform, Special Edition (Que Publishing, 2001; ISBN: 0789724685). Jeff goes by the nickname Java Jeff (or JavaJeff). To see what he's working on, check out his Website at http://www.javajeff.com.

Jeff Friesen 在过去 23 年里一直与计算机打交道。他拥有计算机科学学位，用过许多计算机语言。Jeff 还曾在大学讲授 Java 编程入门课程。除了为 JavaWorld 撰稿，他还自己写了一本面向初学者的 Java 书——《Java 2 by Example, Second Edition》(Que Publishing, 2001;ISBN: 0789725932)，并参与撰写了《Using Java 2 Platform, Special Edition》(Que Publishing, 2001;ISBN: 0789724685)。Jeff 的昵称是 Java Jeff(或 JavaJeff)。想了解他正在做什么，请访问他的网站 http://www.javajeff.com。


### Learn more about this topic

### 深入了解本主题

- [Download this article's source code and resource files](http://images.techhive.com/downloads/idge/imported/article/jvw/2003/02/jw-0207-java101.zip)

- [下载本文的源代码和资源文件](http://images.techhive.com/downloads/idge/imported/article/jvw/2003/02/jw-0207-java101.zip)
- For a glossary specific to this article, homework, and more, see the Java 101 study guide that accompanies this article

- 有关本文的术语表、课后练习以及更多内容，请参阅随本文提供的 Java 101 学习指南
- http://www.javaworld.com/javaworld/jw-02-2003/jw-0207-java101guide.html
- "Magic with MerlinParse Sequences of Characters with the New regex Library," John Zukowski (IBM developerWorks, August 2002) explores java.util.regex's support for pattern matching and presents a complete example that finds the longest word in a text file

- "Magic with MerlinParse Sequences of Characters with the New regex Library," John Zukowski(IBM developerWorks，2002 年 8 月)探讨 java.util.regex 对模式匹配的支持，并给出一个完整的示例，用于在文本文件中查找最长的单词
- http://www-106.ibm.com/developerworks/java/library/j-mer0827/
- "Matchmaking with Regular Expressions," Benedict Chng (JavaWorld, July 2001) explores regexes in the context of Apache's Jakarta ORO library

- "Matchmaking with Regular Expressions," Benedict Chng(JavaWorld，2001 年 7 月)在 Apache 的 Jakarta ORO 库背景下探讨正则表达式
- http://www.javaworld.com/javaworld/jw-07-2001/jw-0713-regex.html
- "Regular Expressions and the Java Programming Language," Dana Nourie and Mike McCloskey (Sun Microsystems, August 2002) presents a brief overview of java.util.regex, including five illustrative regex-based applications

- "Regular Expressions and the Java Programming Language," Dana Nourie 和 Mike McCloskey(Sun Microsystems，2002 年 8 月)简要概述 java.util.regex，并给出五个基于正则表达式的示例应用
- http://developer.java.sun.com/developer/technicalArticles/releases/1.4regex/
- In "The Java Platform" (onJava.com), an excerpt from Chapter 4 of O'Reilly's Java in a Nutshell, 4th Edition, David Flanagan presents short examples of CharSequence and java.util.regex methods

- 在 "The Java Platform"(onJava.com)——O'Reilly《Java in a Nutshell, 4th Edition》第 4 章的摘录——中，David Flanagan 给出了 CharSequence 和 java.util.regex 方法的简短示例
- http://www.onjava.com/pub/a/onjava/excerpt/javanut4_ch04
- The Java Tutorial's "Regular Expressions" lesson teaches the basics of Sun's java.util.regex package

- The Java Tutorial 的 "Regular Expressions" 一课讲解 Sun 的 java.util.regex 包的基础知识
- http://java.sun.com/docs/books/tutorial/extra/regex/index.html
- Wikipedia defines some regex terminology, presents a brief history of regexes, and explores various regex syntaxes

- Wikipedia 定义了一些正则表达式术语，简要介绍了正则表达式的历史，并探讨了各种正则表达式语法
- http://www.wikipedia.org/wiki/Regular_expression
- Read Jeff's previous Java 101 column"Tools of the Trade, Part 3" (JavaWorld, January 2003)

- 阅读 Jeff 之前的 Java 101 专栏 "Tools of the Trade, Part 3"(JavaWorld，2003 年 1 月)
- http://www.javaworld.com/javaworld/jw-01-2003/jw-0103-java101.html?
- Check out past Java 101 articles

- 查看往期的 Java 101 文章
- http://www.javaworld.com/javaworld/topicalindex/jw-ti-java101.html
- Browse the Core Java section of JavaWorld's Topical Index

- 浏览 JavaWorld 主题索引的 Core Java 部分
- http://www.javaworld.com/channel_content/jw-core-index.shtml
- Need some Java help? Visit our Java Beginner discussion

- 需要一些 Java 帮助?访问我们的 Java Beginner 讨论区
- http://forums.idg.net/webx?50@@.ee6b804
- Java experts answer your toughest Java questions in JavaWorld's Java Q&A column

- Java 专家在 JavaWorld 的 Java Q&A 专栏中解答你最棘手的 Java 问题
- http://www.javaworld.com/javaworld/javaqa/javaqa-index.html
- For Tips 'N Tricks, see

- 关于 Tips 'N Tricks，请见
- http://www.javaworld.com/javaworld/javatips/jw-javatips.index.html
- Sign up for JavaWorld's free weekly Core Java email newsletter

- 订阅 JavaWorld 免费的每周 Core Java 电子邮件通讯
- http://www.javaworld.com/subscribe
- You'll find a wealth of IT-related articles from our sister publications at IDG.net

- 你可以在 IDG.net 上找到来自我们姊妹出版物的大量 IT 相关文章




#### 更多阅读

- [Java 101: Datastructures and algorithms, Part 1](http://www.javaworld.com/article/2073390/core-java/datastructures-and-algorithms-part-1.html)
- [Study guide: Regular expressions simplify pattern-matching code](http://www.javaworld.com/article/2073175/core-java/study-guide--regular-expressions-simplify-pattern-matching-code.html)
- [Get ready for the new stack](http://www.javaworld.com/article/2882614/enterprise-java/get-ready-for-the-new-stack.html)

- [Grok 正则捕获](https://doc.yonyoucloud.com/doc/logstash-best-practice-cn/filter/grok.html)


原文链接: [http://www.javaworld.com/article/2073192/core-java/regular-expressions-simplify-pattern-matching-code.html](http://www.javaworld.com/article/2073192/core-java/regular-expressions-simplify-pattern-matching-code.html)


原文日期: 2013年02月07日

翻译日期: 2015年3月24日

翻译人员: [铁锚: http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
