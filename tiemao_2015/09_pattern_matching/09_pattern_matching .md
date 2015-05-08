# Regular expressions simplify pattern-matching code

# 用正则表达式简化你的模式匹配代码

### Discover the elegance of regular expressions in text-processing scenarios that involve pattern matching

### 副标题: 在文本处理中发现正则表达式的优雅



Text processing frequently requires code to match text against patterns. That capability makes possible text searches, email header validation, custom text creation from generic text (e.g., "Dear Mr. Smith" instead of "Dear Customer"), and so on. Java supports pattern matching via its character and assorted string classes. Because that low-level support commonly leads to complex pattern-matching code, Java also offers regular expressions to help you write simpler code.


文本处理频繁需要的代码对模式匹配的文本。这种能力使可能的文本搜索,邮件头验证,创建自定义文本从通用的文本(如。“亲爱的史密斯先生”,而不是“亲爱的客户”),等等。Java支持通过人物和各种模式匹配字符串类。因为这低级的支持通常会导致复杂的模式匹配代码,Java还提供了正则表达式来帮助你编写简单的代码。


Regular expressions often confuse newcomers. However, this article dispels much of that confusion. After introducing regular expression terminology, the java.util.regex package's classes, and a program that demonstrates regular expression constructs, I explore many of the regular expression constructs that the Pattern class supports. I also examine the methods comprising Pattern and other java.util.regex classes. A practical application of regular expressions concludes my discussion.


正则表达式经常混淆新人。然而,本文消除大部分的混乱。引入正则表达式术语后,java.util。正则表达式包的类和一个程序,演示了正则表达式构造,我探索许多类支持的正则表达式构造模式。我也检查方法包括模式和其他java.util。regex类。正则表达式的一个实际应用总结我的讨论。


> ##Note
> Regular expressions' long history begins in the theoretical computer science fields of automata theory and formal language theory. That history continues to Unix and other operating systems, where regular expressions are often used in Unix and Unix-like utilities: examples include awk (a programming language that enables sophisticated text analysis and manipulation—named after its creators, Aho, Weinberger, and Kernighan), emacs (a developer's editor), and grep (a program that matches regular expressions in one or more text files and stands for global regular expression print).

<br/>

> ##提示
>正则表达式的悠久的历史开始于自动机的理论计算机科学领域的理论和形式语言理论。历史继续Unix和其他操作系统,在正则表达式中经常使用Unix和类Unix实用程序:例子包括awk(一种编程语言,使复杂的文本分析和manipulation-named后其创造者,阿霍,温伯格,和克尼汉),emacs(开发人员的编辑),grep(一个程序匹配正则表达式在一个或多个文本文件和代表全局正则表达式打印)。


###What are regular expressions?

### 正则表达式(regular expression)简介

A regular expression, also known as a regex or regexp, is a string whose pattern (template) describes a set of strings. The pattern determines what strings belong to the set, and consists of literal characters and metacharacters, characters that have special meaning instead of a literal meaning. The process of searching text to identify matches—strings that match a regex's pattern—is pattern matching.

Java's java.util.regex package supports pattern matching via its Pattern, Matcher, and PatternSyntaxException classes:

- Pattern objects, also known as patterns, are compiled regexes
- Matcher objects, or matchers, are engines that interpret patterns to locate matches in character sequences, objects whose classes implement the java.lang.CharSequence interface and serve as text sources
- PatternSyntaxException objects describe illegal regex patterns

- Pattern 对象, 也称为模式, 是编译后的 regex
- Matcher 对象, or matchers, are engines that interpret patterns to locate matches in character sequences, objects whose classes implement the java.lang.CharSequence interface and serve as text sources
- PatternSyntaxException 对象用来描述不合法的 regex patterns

Listing 1 introduces those classes:

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

To accomplish pattern matching, RegexDemo calls various methods in java.util.regex's classes. Don't concern yourself with understanding those methods right now; we'll explore them later in this article. More importantly, compile Listing 1: you need RegexDemo.class to explore Pattern's regex constructs.


### Explore Pattern's regex constructs

Pattern's SDK documentation presents a section on regular expression constructs. Unless you're an avid regex user, an initial examination of that section might confuse you. What are quantifiers and the differences among greedy, reluctant, and possessive quantifiers? What are character classes, boundary matchers, back references, and embedded flag expressions? To answer those and other questions, we explore many of the regex constructs, or regex pattern categories, that Pattern recognizes. We begin with the simplest regex construct: literal strings.


> ##Caution
> Do not assume that Pattern's and Perl 5's regex constructs are identical. Although they share many similarities, they also share differences, ranging from disparities in the constructs they support to their treatment of dangling metacharacters. (For more information, examine your SDK documentation on the Pattern class, which you should have on your platform.)


### Literal strings

You specify the literal string regex construct whenever you type a literal string in the search text field of your word processor's search dialog box. Execute the following RegexDemo command line to see this regex construct in action:

	java RegexDemo apple applet

The command line above identifies apple as a literal string regex construct that consists of literal characters a, p, p, l, and e (in that order). The command line also identifies applet as text for pattern-matching purposes. After executing the command line, observe the following output:

	Regex = apple
	Text = applet
	Found apple
	  starting at index 0 and ending at index 5

The output identifies the regex and text command-line arguments, indicates a successful match of apple within applet, and presents the starting and ending indexes of that match: 0 and 5, respectively. The starting index identifies the first text location where a pattern match occurs, and the ending index identifies the first text location after the match. In other words, the range of matching text is inclusive of the starting index and exclusive of the ending index.


### Metacharacters

Although literal string regex constructs are useful, more powerful regex constructs combine literal characters with metacharacters. For example, in a.b, the period metacharacter (.) represents any character that appears between a and b. To see the period metacharacter in action, execute the following command line:

	java RegexDemo .ox "The quick brown fox jumps over the lazy ox."

The command line above specifies .ox as the regex and The quick brown fox jumps over the lazy ox. as the text command-line argument. RegexDemo searches the text for matches that begin with any character and end with ox, and produces the following output:

	Regex = .ox
	Text = The quick brown fox jumps over the lazy ox.
	Found fox
	  starting at index 16 and ending at index 19
	Found  ox
	  starting at index 39 and ending at index 42


The output reveals two matches: fox and ox (with a leading space character). The . metacharacter matches the f in the first match and the space character in the second match.

What happens if we replace .ox with the period metacharacter? That is, what outputs when we specify java . "The quick brown fox jumps over the lazy ox."? Because the period metacharacter matches any character, RegexDemo outputs a match for each character in its text command-line argument, including the terminating period character.


> ##Tip
> To specify . or any metacharacter as a literal character in a regex construct, quote—convert from meta status to literal status—the metacharacter in one of two ways:
> 
> - Precede the metacharacter with a backslash character.
> - Place the metacharacter between `\Q` and `\E` (e.g., `\Q.\E`).
> 
> In either scenario, don't forget to double each backslash character (as in `\\.` or `\\Q.\\E`) that appears in a string literal (e.g., `String regex = "\\.";`). Do not double the backslash character when it appears as part of a command-line argument.


### Character classes

We sometimes limit those characters that produce matches to a specific set of characters. For example, we might search text for vowels a, e, i, o, and u, where any occurrence of any vowel indicates a match. A character class, a regex construct that identifies a set of characters between open and close square bracket metacharacters ([ ]), helps us accomplish that task. Pattern supports the following character classes:


- **Simple**: consists of characters placed side by side and matches only those characters. Example: [abc] matches characters a, b, and c. The following command line offers a second example:

	java RegexDemo [csw] cave

`java RegexDemo [csw] cave` matches c in [csw] with c in cave. No other matches exist.

- **Negation**: begins with the ^ metacharacter and matches only those characters not in that class. Example: [^abc] matches all characters except a, b, and c. The following command line offers a second example:
- 
	java RegexDemo [^csw] cave

`java RegexDemo [^csw] cave` matches a, v, and e with their counterparts in cave. No other matches exist.

- **Range**: consists of all characters beginning with the character on the left of a hyphen metacharacter (-) and ending with the character on the right of the hyphen metacharacter, matching only those characters in that range. Example: [a-z] matches all lowercase alphabetic characters. The following command line offers a second example:

	java RegexDemo [a-c] clown

`java RegexDemo [a-c] clown` matches c in [a-c] with c in clown. No other matches exist.


> ## **Tip**
>
>Combine multiple ranges within the same range character class by placing them side by side. Example: [a-zA-Z] matches all lowercase and uppercase alphabetic characters.


- **Union**: consists of multiple nested character classes and matches all characters that belong to the resulting union. Example: [a-d[m-p]] matches characters a through d and m through p. The following command line offers a second example:

	java RegexDemo [ab[c-e]] abcdef

`java RegexDemo [ab[c-e]] abcdef` matches a, b, c, d, and e with their counterparts in abcdef. No other matches exist.


- **Intersection**: consists of characters common to all nested classes and matches only common characters. Example: [a-z&&[d-f]] matches characters d, e, and f. The following command line offers a second example:

	java RegexDemo [aeiouy&&[y]] party

`java RegexDemo [aeiouy&&[y]] party` matches y in [aeiou&&[y]] with y in party. No other matches exist.



- **Subtraction**: consists of all characters except for those indicated in nested negation character classes and matches the remaining characters. Example: [a-z&&[^m-p]] matches characters a through l and q through z. The following command line offers a second example:

	java RegexDemo [a-f&&[^a-c]&&[^e]] abcdefg

`java RegexDemo [a-f&&[^a-c]&&[^e]] abcdefg` matches d and f with their counterparts in abcdefg. No other matches exist.


### Predefined character classes

Some character classes occur often enough in regexes to warrant shortcuts. Pattern provides such shortcuts with predefined character classes, which Table 1 presents. Use predefined character classes to simplify your regexes and minimize regex syntax errors.

### Table 1. Predefined character classes


<table border="0" cellspacing="1" celpadding="5"><tbody><tr bgcolor="#990033"><td>Predefined character class </td><td>Description </td></tr><tr bgcolor="cccccc"><td><code>\d</code> </td><td>A digit. Equivalent to <code>[0-9]</code>.</td></tr><tr bgcolor="#ffffff"><td><code>\D</code> </td><td>A nondigit. Equivalent to <code>[^0-9]</code>.</td></tr><tr bgcolor="cccccc"><td><code>\s</code> </td><td>A whitespace character. Equivalent to <code>[ \t\n\x0B\f\r]</code>.</td></tr><tr bgcolor="#ffffff"><td><code>\S</code> </td><td>A nonwhitespace character. Equivalent to <code>[^\s]</code>.</td></tr><tr bgcolor="cccccc"><td><code>\w</code> </td><td>A word character. Equivalent to <code>[a-zA-Z_0-9]</code>.</td></tr><tr bgcolor="#ffffff"><td><code>\W</code> </td><td>A nonword character. Equivalent to <code>[^\w]</code>.</td></tr></tbody></table>




The following command-line example uses the \w predefined character class to identify all word characters in its text command-line argument:

	java RegexDemo \w "aZ.8 _"

The command line above produces the following output, which shows that the period and space characters are not considered word characters:


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


### Capturing groups

Pattern supports a regex construct called a capturing group that saves a match's characters for later recall during pattern matching; that construct is a character sequence surrounded by parentheses metacharacters (( )). All characters within that capturing group are treated as a single unit during pattern matching. For example, the (Java) capturing group combines letters J, a, v, and a into a single unit. This capturing group matches the Java pattern against all occurrences of Java in text. Each match replaces the previous match's saved Java characters with the next match's Java characters.

Capturing groups can nest inside other capturing groups. For example, in (Java( language)), ( language) nests inside (Java). Each nested or nonnested capturing group receives its own number, numbering starts at 1, and capturing groups number from left to right. In the example, (Java( language)) is capturing group number 1, and ( language) is capturing group number 2. In (a)(b), (a) is capturing group number 1, and (b) is capturing group number 2.

Each capturing group saves its match for later recall by a back reference. Specified as a backslash character followed by a digit character denoting a capturing group number, the back reference recalls a capturing group's captured text characters. The presence of a back reference causes a matcher to use the back reference's capturing group number to recall the capturing group's saved match and then use that match's characters to attempt a further match operation. The following example demonstrates the usefulness of a back reference in searching text for a grammatical error:


	java RegexDemo "(Java( language)\2)" "The Java language language"


The example uses the (Java( language)\2) regex to search the text The Java language language for a grammatical error, where Java immediately precedes two consecutive occurrences of language. That regex specifies two capturing groups: number 1 is (Java( language)\2), which matches Java language language, and number 2 is ( language), which matches a space character followed by language. The \2 back reference recalls number 2's saved match, which allows the matcher to search for a second occurrence of a space character followed by language, which immediately follows the first occurrence of the space character and language. The following output shows what RegexDemo's matcher finds:


	Regex = (Java( language)\2)
	Text = The Java language language
	Found Java language language
	  starting at index 4 and ending at index 26


### Quantifiers

Quantifiers are probably the most confusing regex constructs to understand. Part of that confusion comes from trying to grasp Pattern's 18 quantifier categories (organized as three major categories of six fundamental quantifier categories). Another part of that confusion comes from trying to decipher the concept of zero-length matches. Once you understand that concept and those 18 categories, much (if not all) of the confusion disappears.

> ###Note
> For brevity, this section discusses only the basics of the 18 quantifier categories and the zero-length match concept. Study The Java Tutorial's "Quantifiers" section for a more detailed discussion and more examples.


A quantifier is a regex construct that implicitly or explicitly binds a numeric value to a pattern. That numeric value determines how many times to match a pattern. Pattern's six fundamental quantifiers match a pattern once or not at all, zero or more times, one or more times, an exact number of times, at least x times, and at least x times but no more than y times.

The six fundamental quantifier categories replicate in each of three major categories: greedy, reluctant, and possessive. Greedy quantifiers attempt to find the longest match. In contrast, reluctant quantifiers attempt to find the shortest match. Possessive quantifiers also try to find the longest match. However, they differ from greedy quantifies in how they work. Although greedy and possessive quantifiers force a matcher to read in the entire text prior to attempting a first match, greedy quantifiers often cause a matcher to make multiple attempts to find a match, whereas possessive quantifiers cause a matcher to attempt a match only once.

The following examples illustrate the behavior of the six fundamental quantifiers in the greedy category, and the behavior of a single fundamental quantifier in each of the reluctant and possessive categories. These examples also introduce the zero-length match concept:


**1**、 java RegexDemo a? abaa: uses a greedy quantifier to match a in abaa once or not at all. The following output results:


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


**2**、java RegexDemo a* abaa: uses a greedy quantifier to match a in abaa zero or more times. The following output results:


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


**3**、java RegexDemo a+ abaa: uses a greedy quantifier to match a in abaa one or more times. The following output results:


	Regex = a+
	Text = abaa
	Found a
	  starting at index 0 and ending at index 1
	Found aa
	  starting at index 2 and ending at index 4


The output reveals two matches. Unlike a? and a*, a+ does not match the absence of a. Thus, no zero-length matches result. Like a*, a+ matches all consecutive as.

**4**、java RegexDemo a{2} aababbaaaab: uses a greedy quantifier to match every aa sequence in aababbaaaab. The following output results:



	Regex = a{2}
	Text = aababbaaaab
	Found aa
	  starting at index 0 and ending at index 2
	Found aa
	  starting at index 6 and ending at index 8
	Found aa
	  starting at index 8 and ending at index 10


**5**、 java RegexDemo a{2,} aababbaaaab: uses a greedy quantifier to match two or more consecutive as in aababbaaaab. The following output results:

	Regex = a{2,}
	Text = aababbaaaab
	Found aa
	  starting at index 0 and ending at index 2
	Found aaaa
	  starting at index 6 and ending at index 10


**6**、java RegexDemo a{1,3} aababbaaaab: uses a greedy quantifier to match every a, aa, or aaa in aababbaaaab. The following output results:

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

	Regex = a+?
	Text = abaa
	Found a
	  starting at index 0 and ending at index 1
	Found a
	  starting at index 2 and ending at index 3
	Found a
	  starting at index 3 and ending at index 4


Unlike its greedy variant in the third example, the reluctant example produces three matches of a single a because the reluctant quantifier tries to find the shortest match.

**8**、 java RegexDemo .*+end "This is the end": uses a possessive quantifier to match all characters followed by end in This is the end zero or more times. The following output results:


	Regex = .*+end
	Text = This is the end

The possessive quantifier produces no matches because it causes a matcher to consume the entire text, leaving nothing left to match end. In contrast, the greedy quantifier in java RegexDemo .*end "This is the end" produces a match because it causes a matcher to keep backing off one character at a time until the rightmost end matches.


### Boundary matchers

We sometimes want to match patterns at the beginning of lines, at word boundaries, at the end of text, and so on. Accomplish that task with a boundary matcher, a regex construct that identifies a match location. Table 2 presents Pattern's supported boundary matchers.


> ###Table 2. Boundary matchers


<table border="0" cellpadding="5" cellspacing="1"><tbody><tr bgcolor="#990033"><td>Boundary Matcher </td><td>Description </td></tr><tr bgcolor="#cccccc"><td><code>^</code> </td><td>The beginning of a line</td></tr><tr bgcolor="#ffffff"><td><code>$</code> </td><td>The end of a line</td></tr><tr bgcolor="#cccccc"><td><code>\b</code> </td><td>A word boundary</td></tr><tr bgcolor="#ffffff"><td><code>\B</code> </td><td>A nonword boundary</td></tr><tr bgcolor="#cccccc"><td><code>\A</code> </td><td>The beginning of the text</td></tr><tr bgcolor="#ffffff"><td><code>\G</code> </td><td>The end of the previous match</td></tr><tr bgcolor="#cccccc"><td><code>\Z</code> </td><td>The end of the text (but for the final line terminator, if any)</td></tr><tr bgcolor="#ffffff"><td><code>\z</code> </td><td>The end of the text</td></tr></tbody></table>


The following command-line example uses the ^ boundary matcher metacharacter to ensure that a line begins with The followed by zero or more word characters:

	java RegexDemo ^The\w* Therefore


`^` indicates that the first three text characters must match the pattern's subsequent T, h, and e characters. Any number of word characters may follow. The command line above produces the following output:

	Regex = ^The\w*
	Text = Therefore
	Found Therefore
	  starting at index 0 and ending at index 9


Change the command line to java RegexDemo ^The\w* " Therefore". What happens? No match is found because a space character precedes Therefore.

### Embedded flag expressions

Matchers assume certain defaults, such as case-sensitive pattern matching. A program may override any default by using an embedded flag expression, that is, a regex construct specified as parentheses metacharacters surrounding a question mark metacharacter (?) followed by a specific lowercase letter. Pattern recognizes the following embedded flag expressions:


- (?i): enables case-insensitive pattern matching. Example: java RegexDemo (?i)tree Treehouse matches tree with Tree. Case-sensitive pattern matching is the default.
- (?x): permits whitespace and comments beginning with the # metacharacter to appear in a pattern. A matcher ignores both. Example: java RegexDemo ".at(?x)#match hat, cat, and so on" matter matches .at with mat. By default, whitespace and comments are not permitted; a matcher regards them as characters that contribute to a match.
- (?s): enables dotall mode. In that mode, the period metacharacter matches line terminators in addition to any other character. Example: java RegexDemo (?s). \n matches . with \n. Nondotall mode is the default: line-terminator characters do not match.
- (?m): enables multiline mode. In multiline mode, ^ and $ match just after or just before (respectively) a line terminator or the text's end. Example: java RegexDemo (?m)^.ake make\rlake\n\rtake matches .ake with make, lake, and take. Non-multiline mode is the default: ^ and $ match only at the beginning and end of the entire text.
- (?u): enables Unicode-aware case folding. This flag works with (?i) to perform case-insensitive matching in a manner consistent with the Unicode Standard. The default: case-insensitive matching that assumes only characters in the US-ASCII character set match.
- (?d): enables Unix lines mode. In that mode, a matcher recognizes only the \n line terminator in the context of the ., ^, and $ metacharacters. Non-Unix lines mode is the default: a matcher recognizes all terminators in the context of the aforementioned metacharacters.


Embedded flag expressions resemble capturing groups because both regex constructs surround their characters with parentheses metacharacters. Unlike a capturing group, an embedded flag expression does not capture a match's characters. Thus, an embedded flag expression is an example of a noncapturing group, that is, a regex construct that does not capture text characters; it's specified as a character sequence surrounded by parentheses metacharacters. Several kinds of noncapturing groups appear in Pattern's SDK documentation.


> ###Tip
> To specify multiple embedded flag expressions in a regex, either place them side by side (e.g., (?m)(?i)) or place their lowercase letters side by side (e.g., (?mi)).


###Explore the java.util.regex classes' methods

java.util.regex's three classes offer various methods to help us write more robust regex source code and create powerful tools to manipulate text. Our exploration of those methods begins in the Pattern class.


> ###Note
> You might also want to explore the CharSequence interface's methods, which you can implement when you create a new character sequence class. The only classes currently implementing CharSequence are java.nio.CharBuffer, String, and StringBuffer.


### Pattern methods

A regex is useless until code compiles that string into a Pattern object. Accomplish that task with either of the following compilation methods:


- public static Pattern compile(String regex): compiles regex's contents into a tree-structured object representation stored in a new Pattern object. A reference to that object returns. Example: Pattern p = Pattern.compile ("(?m)^\\."); creates a Pattern object that stores a compiled representation of the regex for matching all lines starting with a period character.

- public static Pattern compile(String regex, int flags): accomplishes the same task as the previous method. However, it also considers a bitwise inclusive ORed set of flag constant bit values (which flags specifies). Flag constants are declared in Pattern and serve (except the canonical equivalence flag, CANON_EQ) as an alternative to embedded flag expressions. Example: Pattern p = Pattern.compile ("^\\.", Pattern.MULTILINE); is equivalent to the previous example, where the Pattern.MULTILINE constant and the (?m) embedded flag expression accomplish the same task. (Consult the SDK's Pattern documentation to learn about other constants.) This method throws an IllegalArgumentException object if bit values other than those bit values that Pattern's constants represent appear in flags.


When needed, obtain a copy of a Pattern object's flags and the original regex that compiled into that object by calling the following methods:


- public int flags(): returns the Pattern object's flags specified when a regex compiles. Example: System.out.println (p.flags ()); outputs the flags associated with the Pattern object that p references.

- public String pattern(): returns the original regex that compiled into the Pattern object. Example: System.out.println (p.pattern ()); outputs the regex corresponding to the Pattern that p references. (The Matcher class includes a similar Pattern pattern() method that returns a matcher's associated Pattern object.)


After creating a Pattern object, you commonly obtain a Matcher object from Pattern by calling Pattern's public matcher(CharSequence text) method. That method requires a single text object argument, whose class implements the CharSequence interface. The obtained matcher scans the characters in the text object during a pattern match operation. Example: Pattern p = Pattern.compile ("[^aeiouy]"); Matcher m = p.matcher ("This is a test."); obtains a matcher to match nonvowel characters in This is a test..

Creating Pattern and Matcher objects is bothersome when you wish to quickly check if a pattern completely matches a text sequence. Fortunately, Pattern offers a convenience method to help you accomplish that task: public static boolean matches(String regex, CharSequence text). That static method returns a Boolean true value if and only if the entire text character sequence matches regex's pattern. Example: System.out.println (Pattern.matches ("[a-z[\\s]]*", "all lowercase letters and whitespace only")); returns a Boolean true value, indicating only whitespace characters and lowercase letters appear in all lowercase letters and whitespace only.

Writing code to break text into its component parts (such as a text file's employee record into a set of fields) is a task many developers find tedious. Pattern relieves that tedium by providing a pair of text-splitting methods:


- public String [] split(CharSequence text, int limit): splits text around matches of the current Pattern object's pattern. This method returns an array, where each entry specifies a text sequence separated from the next text sequence by a pattern match (or the text's end); and all array entries store in the same order as they appear in the text. The number of array entries depends on limit, which also controls the number of matches that occur. A positive value means that, at most, limit-1 matches are considered and the array's length is no greater than limit entries. A negative value means all possible matches are considered and the array can have any length. A zero value means all possible matches are considered, the array can have any length, and trailing empty strings are discarded.

- public String [] split(CharSequence text): invokes the previous method with zero as the limit and returns the method call's result.

Suppose you want to split an employee record, consisting of name, age, street address, and salary, into its field components. The following code fragment uses split(CharSequence text) to accomplish that task:

	Pattern p = Pattern.compile (",\\s");
	String [] fields = p.split ("John Doe, 47, Hillsboro Road, 32000");
	for (int i = 0; i < fields.length; i++)
	     System.out.println (fields [i]);


The code fragment above specifies a regex that matches a comma character immediately followed by a single-space character and produces the following output:


	John Doe
	47
	Hillsboro Road
	32000


> ### Note
> String incorporates three convenience methods that invoke their equivalent Pattern methods: public boolean matches(String regex), public String [] split(String regex), and public String [] split(String regex, int limit).



### Matcher methods

Matcher objects support different kinds of pattern match operations, such as scanning text for the next match; attempting to match the entire text against a pattern; and attempting to match a portion of text against a pattern. Accomplish those match operations with the following methods:


- public boolean find(): scans text for the next match. That method either starts its scan at the beginning of the text or, if a previous invocation of the method returned true and the matcher has not been reset, at the first character following the previous match. A Boolean true value returns if a match is found. Listing 1 presents an example.
- public boolean find(int start): resets the matcher and scans text for the next match. The scan begins at the index specified by start. A Boolean true value returns if a match is found. Example: m.find (1); scans text beginning at index 1. (Index 0 is ignored.) If start contains a negative value or a value exceeding the length of the matcher's text, this method throws an IndexOutOfBoundsException object.
- public boolean matches(): attempts to match the entire text against the pattern. That method returns a Boolean true value if the entire text matches. Example: Pattern p = Pattern.compile ("\\w*"); Matcher m = p.matcher ("abc!"); System.out.println (p.matches ()); outputs false because the entire abc! text lacks word characters.
- public boolean lookingAt(): attempts to match the text against the pattern. That method returns a Boolean true value if the text matches. Unlike matches(), the entire text does not need to be matched. Example: Pattern p = Pattern.compile ("\\w*"); Matcher m = p.matcher ("abc!"); System.out.println (p.lookingAt ()); outputs true because the beginning of the abc! text consists of word characters only.


Unlike Pattern objects, Matcher objects record state information. Occasionally, you might want to reset a matcher to clear that information after performing a pattern match. The following methods reset a matcher:


- public Matcher reset(): resets a matcher's state, including the matcher's append position (which clears to 0). The next pattern match operation begins at the start of the matcher's text. A reference to the current Matcher object returns. Example: m.reset (); resets the matcher referenced by m.

- public Matcher reset(CharSequence text): resets a matcher's state and sets the matcher's text to text's contents. The next pattern match operation begins at the start of the matcher's new text. A reference to the current Matcher object returns. Example: m.reset ("new text"); resets the m-referenced matcher and also specifies new text as the matcher's new text.


A matcher's append position identifies the start of the matcher's text that appends to a StringBuffer object. The following methods use the append position:


- public Matcher appendReplacement(StringBuffer sb, String replacement): reads the matcher's text characters and appends them to the sb-referenced StringBuffer object. The method stops reading after the last character preceding the previous pattern match. This method next appends the characters in the replacement-referenced String object to the StringBuffer object. (The replacement string may contain references to text sequences captured during the previous match, via dollar-sign characters ($) and capturing group numbers.) Finally, the method sets the matcher's append position to the index of the last matched character plus one. A reference to the current matcher returns. This method throws an IllegalStateException object if the matcher has not yet made a match or if the previous match attempt failed. An IndexOutOfBoundsException object is thrown if replacement specifies a capturing group that does not exist in the pattern.
- public StringBuffer appendTail(StringBuffer sb): appends all text to the StringBuffer object and returns that object's reference. Following a final call to the appendReplacement(StringBuffer sb, String replacement) method, call appendTail(StringBuffer sb) to copy remaining text to the StringBuffer object.


The following example calls the appendReplacement(StringBuffer sb, String replacement) and appendTail(StringBuffer sb) methods to replace all occurrences of cat within one cat, two cats, or three cats on a fence with caterpillar. A capturing group and a reference to that capturing group in the replacement text allows the insertion of erpillar after each cat match:



	Pattern p = Pattern.compile ("(cat)");
	Matcher m = p.matcher ("one cat, two cats, or three cats on a fence");
	StringBuffer sb = new StringBuffer ();
	while (m.find ())
	   m.appendReplacement (sb, "erpillar");
	m.appendTail (sb);
	System.out.println (sb);


The example produces the following output:

	one caterpillar, two caterpillars, or three caterpillars on a fence


Two other text replacement methods make it possible to replace either the first match or all matches with replacement text:

- public String replaceFirst(String replacement): resets the matcher, creates a new String object, copies all the matcher's text characters (up to the first match) to String, appends the replacement characters to String, copies remaining characters to String, and returns that object's reference. (The replacement string may contain references to text sequences captured during the previous match, via dollar-sign characters and capturing group numbers.)
- public String replaceAll(String replacement): operates similarly to the previous method. However, replaceAll(String replacement) replaces all matches with replacement's characters.


The \s+ regex detects one or more occurrences of whitespace characters in text. The following example uses that regex and calls the replaceAll(String replacement) method to remove duplicate whitespace from text:

	Pattern p = Pattern.compile ("\\s+");
	Matcher m = p.matcher ("Remove     the \t\t duplicate whitespace.   ");
	System.out.println (m.replaceAll (" "));


The example produces the following output:


	Remove the duplicate whitespace. 


Listing 1 includes System.out.println ("Found " + m.group ());. Notice the call to group(). That method is one of three capturing group-oriented Matcher methods:


- public int groupCount(): returns the number of capturing groups in a matcher's pattern. That count does not include the special capturing group number 0, which captures the previous match (whether or not a pattern includes capturing groups).
- public String group(): returns the previous match's characters as recorded by capturing group number 0. That method may return an empty string to indicate a successful match against the empty string. An IllegalStateException object is thrown if either the matcher has not yet attempted a match or the previous match operation failed.
- public String group(int group): resembles the previous method, except it returns the previous match's characters as recorded by the capturing group number that group specifies. If no capturing group with the specified group number exists in the pattern, the method throws an IndexOutOfBoundsException object.


The following example demonstrates the capturing group methods:


	Pattern p = Pattern.compile ("(.(.(.)))");
	Matcher m = p.matcher ("abc");
	m.find ();
	System.out.println (m.groupCount ());
	for (int i = 0; i <= m.groupCount (); i++)
	     System.out.println (i + ": " + m.group (i));


The example produces the following output:


	3
	0: abc
	1: abc
	2: bc
	3: c


Capturing group number 0 saves the previous match and has nothing to do with whether a capturing group appears in the pattern, which is (.(.(.))). The other three capturing groups capture the characters of the previous match belonging to those capturing groups. For example, number 2, (.(.)), captures bc; and number 3, (.), captures c.

Before we leave our discussion of Matcher's methods, we should examine four more match position methods:



- public int start(): returns the previous match's start index. That method throws an IllegalStateException object if either the matcher has not yet attempted a match or the previous match operation failed.
- public int start(int group): resembles the previous method, except it returns the previous match's start index associated with the capturing group that group specifies. If no capturing group with the specified capturing group number exists in the pattern, start(int group) throws an IndexOutOfBoundsException object.
- public int end(): returns the index of the last matched character plus 1 in the previous match. That method throws an IllegalStateException object if either the matcher has not yet attempted a match or the previous match operation failed.
- public int end(int group): resembles the previous method, except it returns the previous match's end index associated with the capturing group that group specifies. If no capturing group with the specified group number exists in the pattern, end(int group) throws an IndexOutOfBoundsException object.


The following example demonstrates two of the match position methods reporting start/end match positions for capturing group number 2:


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

	Found bc
	  starting at index 1 and ending at index 3
	Found bc
	  starting at index 4 and ending at index 6
	Found bc
	  starting at index 7 and ending at index 9


The output shows we are interested in displaying only all matches associated with capturing group number 2, as well as those matches' starting and ending positions.


> ##Note
> String incorporates two convenience methods that invoke their equivalent Matcher methods: public String replaceFirst(String regex, String replacement) and public String replaceAll(String regex, String replacement).


### PatternSyntaxException methods

Pattern's compilation methods throw PatternSyntaxException objects when they detect illegal syntax in a regex's pattern. An exception handler may call the following PatternSyntaxException methods to obtain information from a thrown PatternSyntaxException object about the syntax error:


- public String getDescription(): returns the syntax error's description
- public int getIndex(): returns either the approximate index (within a pattern) where the syntax error occurs or -1 if the index is unknown
- public String getMessage(): builds a multiline string that contains the combined information the other three methods return along with a visual indication of the syntax error position within the pattern
- public String getPattern(): returns the erroneous regex pattern


Because PatternSyntaxException inherits from java.lang.RuntimeException, code doesn't need to specify an exception handler. This proves appropriate when regexes are known to have correct patterns. But when potential for bad pattern syntax exists, an exception handler is necessary. Thus, RegexDemo's source code (see Listing 1) includes try { ... } catch (ParseSyntaxException e) { ... }, which calls each of the four previous PatternSyntaxException methods to obtain information about an illegal pattern.

What constitutes an illegal pattern? Not specifying the closing parentheses metacharacter in an embedded flag expression represents one example. Suppose you execute java RegexDemo (?itree Treehouse. That command line's illegal (?tree pattern causes p = Pattern.compile (args [0]); to throw a PatternSyntaxException object. You then observe the following output:


	Regex syntax error: Unknown inline modifier near index 3
	(?itree
	   ^
	Error description: Unknown inline modifier
	Error index: 3
	Erroneous pattern: (?itree


> ##Note
> The public PatternSyntaxException(String desc, String regex, int index) constructor lets you create your own PatternSyntaxException objects. That constructor comes in handy should you ever create your own preprocessing compilation method that recognizes your own pattern syntax, translates that syntax to syntax recognized by Pattern's compilation methods, and calls one of those compilation methods. If your method's caller violates your custom pattern syntax, you can throw an appropriate PatternSyntaxException object from that method.


### A practical application of regexes

Regexes let you create powerful text-processing applications. One application you might find helpful extracts comments from a Java, C, or C++ source file, and records those comments in another file. Listing 2 presents that application's source code:

> ####Listing 2. `ExtCmnt.java`


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


	// ExtCmnt.java
	         // The following pattern lets this extract multiline comments that
	         // appear on a single line (e.g., /* same line */) and single-line
	         // comments (e.g., // some line). Furthermore, the comment may
	         // appear anywhere on the line.
	         p = Pattern.compile (".*/\\*.*\\*/|.*//.*$");
	             if (m.matches ()) /* entire line must match */
	      finally // Close file.


The output shows that ExtCmnt is not perfect: p = Pattern.compile (".*/\\*.*\\*/|.*//.*$"); doesn't represent a comment. That line appears in out because ExtCmnt's matcher matches the // characters.

There is something interesting about the pattern in ".*/\\*.*\\*/|.*//.*$": the vertical bar metacharacter (|). According to the SDK documentation, the parentheses metacharacters in a capturing group and the vertical bar metacharacter are logical operators. The vertical bar tells a matcher to use that operator's left regex construct operand to locate a match in the matcher's text. If no match exists, the matcher uses that operator's right regex construct operand in another match attempt.


## Review

Although regexes simplify pattern-matching code in text-processing applications, you cannot effectively use regexes in your applications until you understand them. This article gave you a basic understanding of regexes by introducing you to regex terminology, the java.util.regex package, and a program that demonstrates regex constructs. Now that you possess a basic understanding of regexes, build onto that understanding by reading additional articles (see Resources) and studying java.util.regex's SDK documentation, where you can learn about more regex constructs, such as POSIX (Portable Operating System Interface for Unix) character classes.

I encourage you to email me with any questions you might have involving either this or any previous article's material. (Please keep such questions relevant to material discussed in this column's articles.) Your questions and my answers will appear in the relevant study guides.

After writing Java 101 articles for 28 consecutive months, I'm taking a two-month break. I'll return in May and introduce a series on data structures and algorithms.

Jeff Friesen has been involved with computers for the past 23 years. He holds a degree in computer science and has worked with many computer languages. Jeff has also taught introductory Java programming at the college level. In addition to writing for JavaWorld, he has written his own Java book for beginners— Java 2 by Example, Second Edition (Que Publishing, 2001; ISBN: 0789725932)—and helped write Using Java 2 Platform, Special Edition (Que Publishing, 2001; ISBN: 0789724685). Jeff goes by the nickname Java Jeff (or JavaJeff). To see what he's working on, check out his Website at http://www.javajeff.com.


### Learn more about this topic

- [Download this article's source code and resource files](http://images.techhive.com/downloads/idge/imported/article/jvw/2003/02/jw-0207-java101.zip)
- For a glossary specific to this article, homework, and more, see the Java 101 study guide that accompanies this article
- http://www.javaworld.com/javaworld/jw-02-2003/jw-0207-java101guide.html
- "Magic with MerlinParse Sequences of Characters with the New regex Library," John Zukowski (IBM developerWorks, August 2002) explores java.util.regex's support for pattern matching and presents a complete example that finds the longest word in a text file
- http://www-106.ibm.com/developerworks/java/library/j-mer0827/
- "Matchmaking with Regular Expressions," Benedict Chng (JavaWorld, July 2001) explores regexes in the context of Apache's Jakarta ORO library
- http://www.javaworld.com/javaworld/jw-07-2001/jw-0713-regex.html
- "Regular Expressions and the Java Programming Language," Dana Nourie and Mike McCloskey (Sun Microsystems, August 2002) presents a brief overview of java.util.regex, including five illustrative regex-based applications
- http://developer.java.sun.com/developer/technicalArticles/releases/1.4regex/
- In "The Java Platform" (onJava.com), an excerpt from Chapter 4 of O'Reilly's Java in a Nutshell, 4th Edition, David Flanagan presents short examples of CharSequence and java.util.regex methods
- http://www.onjava.com/pub/a/onjava/excerpt/javanut4_ch04
- The Java Tutorial's "Regular Expressions" lesson teaches the basics of Sun's java.util.regex package
- http://java.sun.com/docs/books/tutorial/extra/regex/index.html
- Wikipedia defines some regex terminology, presents a brief history of regexes, and explores various regex syntaxes
- http://www.wikipedia.org/wiki/Regular_expression
- Read Jeff's previous Java 101 column"Tools of the Trade, Part 3" (JavaWorld, January 2003)
- http://www.javaworld.com/javaworld/jw-01-2003/jw-0103-java101.html?
- Check out past Java 101 articles
- http://www.javaworld.com/javaworld/topicalindex/jw-ti-java101.html
- Browse the Core Java section of JavaWorld's Topical Index
- http://www.javaworld.com/channel_content/jw-core-index.shtml
- Need some Java help? Visit our Java Beginner discussion
- http://forums.idg.net/webx?50@@.ee6b804
- Java experts answer your toughest Java questions in JavaWorld's Java Q&A column
- http://www.javaworld.com/javaworld/javaqa/javaqa-index.html
- For Tips 'N Tricks, see
- http://www.javaworld.com/javaworld/javatips/jw-javatips.index.html
- Sign up for JavaWorld's free weekly Core Java email newsletter
- http://www.javaworld.com/subscribe
- You'll find a wealth of IT-related articles from our sister publications at IDG.net




#### 更多阅读

- [Java 101: Datastructures and algorithms, Part 1](http://www.javaworld.com/article/2073390/core-java/datastructures-and-algorithms-part-1.html)
- [Study guide: Regular expressions simplify pattern-matching code](http://www.javaworld.com/article/2073175/core-java/study-guide--regular-expressions-simplify-pattern-matching-code.html)
- [Get ready for the new stack](http://www.javaworld.com/article/2882614/enterprise-java/get-ready-for-the-new-stack.html)


原文链接: [http://www.javaworld.com/article/2073192/core-java/regular-expressions-simplify-pattern-matching-code.html](http://www.javaworld.com/article/2073192/core-java/regular-expressions-simplify-pattern-matching-code.html)

原文日期: 2013年02月07日

翻译日期: 2015年3月24日

翻译人员: [铁锚: http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

