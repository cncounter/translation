# Java Regex - Tutorial

# Java正则表达式教程

> This tutorial introduces the usage of regular expressions and describes their implementation in Java. It also provides several Java regular expression examples.

> 本教程通过实例介绍正则表达式的用法,以及Java中 正则表达式的实现。

## 1. Regular Expressions

## 1. 正则表达式

### 1.1. What are regular expressions?

### 1.1. 正则表达式简介

A *regular expression* defines a search pattern for strings. The abbreviation for regular expression is *regex*. The search pattern can be anything from a simple character, a fixed string or a complex expression containing special characters describing the pattern. The pattern defined by the regex may match one or several times or not at all for a given string.

*正则表达式(regular expression)* 定义了一种字符串的搜索模式。缩写是 *regex*. 搜索模式(search pattern)包括多种形式, 如 简单字符(character), 固定字符串(fixed string), 或以及包含转义字符的复杂表达式等等. 对于给定的字符串, 正则表达式所定义的模式可以匹配一次或多次,也可能一次都不匹配。

Regular expressions can be used to search, edit and manipulate text.

正则表达式常用来搜索,编辑和操纵文本。

The process of analyzing or modifying a text with a regex is called: *The regular expression is applied to the text/string*. The pattern defined by the regex is applied on the text from left to right. Once a source character has been used in a match, it cannot be reused. For example, the regex `aba` will match *ababababa* only two times (aba_aba__).

使用正则表达式来分析/修改文本的过程称为: *应用于文本/字符串的正则表达式* 。正则表达式是从左到右进行匹配的. 一旦string中的某个源字符被匹配到,就不能再次配匹配了。例如, 正则表达式 `aba` 只能匹配 *ababababa* 两次(`aba_aba__`)。

### 1.2. Regex examples

### 1.2. 示例

A simple example for a regular expression is a (literal) string. For example, the *Hello World* regex matches the "Hello World" string. `.` (dot) is another example for a regular expression. A dot matches any single character; it would match, for example, "a" or "1".

最简单的例子是文本字符串。例如, 正则表达式 `Hello World` 匹配的就是字符串 "Hello World"。 正则表达式中的 `.`(dot,英文句号 ,点号)则是另一种用法。每个点号匹配任意的单个字符(character); 例如, "a" 或者 "1" 之类的字符。

The following tables lists several regular expressions and describes which pattern they would match.

下表列出了一些简单正则表达式,以及匹配的模式。


| Regex              | Matches                                  |
| ------------------ | ---------------------------------------- |
| `this is text`     | 完全匹配 "this is text"                      |
| `this\s+is\s+text` | 匹配的内容为: 字符串 "this", 加上1到多个空白字符(whitespace characters), 加上字符串 "is", 加上1到多个空白字符(whitespace characters),  再加上字符串 "text". |
| `^\d+(\.\d+)?`     | 转义字符 `^`(非) 在此处表示：必须匹配一行的开始处. `\d+` 匹配1到多个数字. 英文问号 `?` 表示小括号中的部分是可选的(即出现 0~1次). `\.` 匹配的是字符 ".", 圆括号(parentheses) 表示一个分组. 整个正则匹配的是正整数或小数,例如: "5", "1.5" 或者 "2.21" 等等. |

> 说明,中文全角空格(`　`)不是(whitespace characters)，可以认为其属于特殊字符,或者属于汉字。

### 1.3. Support for regular expressions in programming languages

### 1.3. 编程语言对正则表达式的支持

Regular expressions are supported by most programming languages, e.g., Java, Perl, Groovy, etc. Unfortunately each language supports regular expressions slightly different.

大多数编程语言都支持正则表达式, 例如 Java、Perl, Groovy 等等。但各种语言支持的正则表达式都有一些不同。

## 2. Prerequisites

## 2. 预备知识

The following tutorial assumes that you have basic knowledge of the Java programming language.

本教程假设读者基本掌握Java编程语言。

Some of the following examples use JUnit to validate the result. You should be able to adjust them in case if you do not want to use JUnit. To learn about JUnit please see [JUnit Tutorial](http://www.vogella.com/tutorials/JUnit/article.html).

部分示例使用JUnit来验证结果。如果不想使用JUnit,可以自己修改测试代码。关于 JUnit 的教程请参考 [JUnit教程: http://www.vogella.com/tutorials/JUnit/article.html](http://www.vogella.com/tutorials/JUnit/article.html)。

## 3. Rules of writing regular expressions

## 3. 正则表达式的语法规则

The following description is an overview of available meta characters which can be used in regular expressions. This chapter is supposed to be a references for the different regex elements.

下面简要介绍正则表达式中的元字符。本章可以作为各种正则元素的参考。

### 3.1. Common matching symbols

### 3.1. 通用表达式简介



| Regular Expression | Description                              |
| ------------------ | ---------------------------------------- |
| `.`                | 点号(`.`),匹配任意字符                           |
| `^regex`           | 小尖号(`^`), 起始标识, 前面不能出现其他字符.              |
| `regex$`           | 美元符号(`$`), 结束标识,后面不能再出现其他字符.             |
| `[abc]`            | 字符集合(set), 匹配 a 或者 b 或者 c.               |
| `[abc][vz]`        | 字符集合(set), 匹配 a 或者 b 或者 c ,紧接着加上 v 或者 z. |
| `[^abc]`           | 如果小尖号(`^`, caret, 此处读作 `非`) 出现在中括号里面的首位, , 则表示否定(negate). 此示例匹配除了 `a`, `b`, `c` 三个字符之外的其他任意字符. |
| `[a-d1-7]`         | 范围表示法: 匹配 `a` 到 `d` 之间的单个字符,或者 `1` 到 `7`之间的单个字符, 此示例不匹配`d1`这种. |
| `X|Z`              | 匹配 `X` 或者 `Z`.                           |
| `XZ`               | 匹配`XZ`, X和Z必须按顺序全部出现.                    |
| `$`                | 判断一行是否结束.                                |

### 3.2. Meta characters

### 3.2. Meta characters(元字符)

The following meta characters have a pre-defined meaning and make certain common patterns easier to use, e.g., `\d` instead of `[0..9]`.

下面的元字符有预置的含义, 可以用于提取通用模式, 例如, 使用 `\d` 代替 `[0..9]`。



| Regular Expression | Description                              |
| ------------------ | ---------------------------------------- |
| `\d`               | 任意数字, 等价于 `[0-9]` 但更简洁                   |
| `\D`               | 非数字, 等价于  `[^0-9]` 但更简洁                  |
| `\s`               | 空白字符(whitespace), 等价于 `[ \t\n\x0b\r\f]`  |
| `\S`               | 非空白字符, 等价于 `[^\s]`                       |
| `\w`               | 单词字符,(word character),字母数字下划线, 等价于 `[a-zA-Z_0-9]` |
| `\W`               | 非单词字符, 等价于 `[^\w]`                       |
| `\S+`              | 匹配1到多个非空白字符                              |
| `\b`               | 匹配单词边界(word boundary), 单词字符指的是 `[a-zA-Z0-9_]` |


> These meta characters have the same first letter as their representation, e.g., digit, space, word, and boundary. Uppercase symbols define the opposite. 

> 为什么使用这些符号表示元字符? 主要取自于英文单词的首字母, 例如: digit(数字), space(空白), word (单词), 以及 boundary(边界)。对应的大写字符则表示相反的意思。

### 3.3. Quantifier

### 3.3. Quantifier(量词)

A quantifier defines how often an element can occur. The symbols ?, *, + and {} define the quantity of the regular expressions

量词定义某个元素可以出现的次数。`?`, `*`, `+` 和 `{}` 符号定义了正则表达式的数量。



| Regular Expression | Description                              | Examples                             |
| ------------------ | ---------------------------------------- | ------------------------------------ |
| `*`                | 0到多次, 等价于 `{0,}`                         | `X*` 匹配0到多个连续的X,  `.*` 则匹配任意字符串      |
| `+`                | 1到多次, 等价于 `{1,}`                         | `X+`- 匹配1到多个连续的X                     |
| `?`                | 0到1次, 等价于 `{0,1}`                        | `X?` 匹配0个,后者1个X                      |
| `{X}`              | 精确匹配 X 次, `{}` 指定前面序列的出现次数               | `\d{3}` 匹配3位数字, `.{10}` 匹配任意的10个字符.  |
| `{X,Y}`            | 出现 X 到 Y 次,                              | `\d{1,4}` 表示 `\d` 至少出现1次数字,最多出现4个数字. |
| `*?`               | 在量词后面加上 `?`, 则表示懒惰模式(*reluctant quantifier*). 尝试匹配最少的字符串. 找到第一个满足正则表达式的地方就停止搜索. |                                      |


### 3.4. Grouping and back reference

### 3.4. 分组(Grouping)与向后引用(back reference)

You can group parts of your regular expression. In your pattern you group elements with round brackets, e.g., `()`. This allows you to assign a repetition operator to a complete group.

可以把正则表达式的一部分进行分组,  用圆括号 `()` 括起来。这样就可以对某个部分进行重复。

In addition these groups also create a back reference to the part of the regular expression. This captures the group. A back reference stores the part of the `String` which matched the group. This allows you to use this part in the replacement.

此外, 还可以在替换时对正则表达式中的分组进行引用。也就是捕获组(captures the group)。向后引用(back reference) 保存的是该分组所匹配的那部分`String`。进行字符串替换的时候可以使用这些部分。

Via the `$` you can refer to a group. `$1` is the first group, `$2` the second, etc.

使用 `$` 来引用一个捕获组。例如 `$1` 表示第一组, `$2` 表示第二组, 以此类推, `$0`则表示整个正则匹配的部分。

Let’s, for example, assume you want to replace all whitespace between a letter followed by a point or a comma. This would involve that the point or the comma is part of the pattern. Still it should be included in the result.

例如, 想要去除字母和句号/逗号之间的所有空格。这时候句号/逗号也是整个正则中的一部分,所以应该原样保留在结果中。

```
// 去除字母与 . 或 , 之间的空格
String pattern = "(\\w)(\\s+)([\\.,])";
System.out.println(EXAMPLE_TEST.replaceAll(pattern, "$1$3"));
```



This example extracts the text between a title tag.

下面的示例提取 title 标签中的内容。

```
// 提取2个 title 元素之间的内容
pattern = "(?i)(<title.*?>)(.+?)()";
String updated = EXAMPLE_TEST.replaceAll(pattern, "$2");
```



### 3.5. Negative look ahead

### 3.5. 环视否定(Negative look ahead)

Negative look ahead provides the possibility to exclude a pattern. With this you can say that a string should not be followed by another string.

环视否定(Negative look ahead, 又叫零宽度断言) 用来排除符合某种模式的内容。也就是说后面不能跟着符合某种特征的字符串。

Negative look ahead are defined via `(?!pattern)`. For example, the following will match "a" if "a" is not followed by "b".

环视否定(Negative look ahead) 使用 `(?!pattern)` 这种格式定义。例如, 下面的正则, 只能匹配后面不是 b 字母的 “a”字母。

```
a(?!b)
```

类似的, 匹配a字母,要求后面必须是 b 字母的情况:

```
a(?=b)
```

> 注意，我们有一个向前查找的语法(也叫顺序环视): `(?=exp)`, 会查找前后【位置】的 exp; 所环视的内容却不包含在正则表达式匹配中。
>
> 如果将等号换成感叹号, 零宽度断言 `(?!exp)`, 就变成了否定语义，也就是说查找的位置的后面不能是exp。
>
> 参考: 利用正则表达式排除特定字符串 <http://www.cnblogs.com/wangqiguo/archive/2012/05/08/2486548.html>




### 3.6. Specifying modes inside the regular expression

### 3.6. 指定正则表达式的模式

You can add the mode modifiers to the start of the regex. To specify multiple modes, simply put them together as in (?ismx).

可以在正则表达式的开头指定模式修饰符。如果要指定多个模式,  把它们放在一起即可, 如 `(?ismx)`。

- (?i) makes the regex case insensitive.

- (?s) for "single line mode" makes the dot match all characters, including line breaks.

- (?m) for "multi-line mode" makes the caret and dollar match at the start and end of each line in the subject string.

  ​

- `(?i) ` 使正则表达式不区分大小写。

- `(?s)` 单行模式(single line mode), 使点号(`.`) 匹配所有的字符, 包括换行(`\n`)。

- `(?m)` 多行模式(multi-line mode),  使 小尖号(`^`,caret ) 和 美元符号(`$`, dollar)  匹配目标字符串中每一行的开始和结束。

### 3.7. Backslashes in Java

### 3.7. Java中的反斜杠 `\`

The backslash `\` is an escape character in Java Strings. That means backslash has a predefined meaning in Java. You have to use double backslash `\\` to define a single backslash. If you want to define `\w`, then you must be using `\\w` in your regex. If you want to use backslash as a literal, you have to type `\\\\` as `\` is also an escape character in regular expressions.

在Java字符串中, 反斜杠(`\`, backslash) 是转义字符。也就是说反斜杠在Java有预定的含义。在程序源代码中, 必须使用两个反斜杠`\\`来表示一个反斜杠符号。如果想定义的正则表达式是 `\w`, 就必须使用 `\\w` 这种形式。如果想要匹配文本中的反斜杠,  则需要使用4个反斜杠 `\\\\` 形式的正则表达式。



## 4. Using regular expressions with String methods

## 4. 在 String 的方法中使用正则表达式

### 4.1. Redefined methods on String for processing regular expressions

### 4.1. String 类中正则表达式相关的方法

`Strings` in Java have built-in support for regular expressions. `Strings` have four built-in methods for regular expressions, i.e., the `matches()`, `split())`, `replaceFirst()` and`replaceAll()` methods. The `replace()` method does NOT support regular expressions.

`Strings` 类内置了4个支持正则表达式的方法, 即: `matches()`, `split()`, `replaceFirst()` 和`replaceAll()` 方法。注意 `replace()` 方法并不支持正则表达式。

These methods are not optimized for performance. We will later use classes which are optimized for performance.

这些方法并没有专门进行性能优化。 稍后我们将使用优化过的 class。



| Method                                   | Description                              |
| ---------------------------------------- | ---------------------------------------- |
| `s.matches("regex")`                     | 判断 s 是否匹配正在表达式  `"regex"` .  只有整个字符串匹配正则表达式时才返回 `true` . |
| `s.split("regex")`                       | 使用正则表达式 `"regex"` 作为分隔符来拆分字符串, 返回结果是 String[] 数组. 注意  `"regex"` 对应的字符串并不包含在返回结果中. |
| `s.replaceFirst("regex", "replacement"`) | 将第一个匹配  `"regex"` 的内容替换为 `"replacement`. |
| `s.replaceAll("regex", "replacement")`   | 将所有匹配  `"regex"` 的内容替换为 `"replacement`.  |

Create for the following example the Java project `de.vogella.regex.test`.

下面是对应的示例代码。



```
package de.vogella.regex.test;

public class RegexTestStrings {
        public static final String EXAMPLE_TEST = "This is my small example "
                        + "string which I'm going to " + "use for pattern matching.";

        public static void main(String[] args) {
                System.out.println(EXAMPLE_TEST.matches("\\w.*"));
                String[] splitString = (EXAMPLE_TEST.split("\\s+"));
                System.out.println(splitString.length);// should be 14
                for (String string : splitString) {
                        System.out.println(string);
                }
                // replace all whitespace with tabs
                System.out.println(EXAMPLE_TEST.replaceAll("\\s+", "\t"));
        }
}
```

### 4.2. Examples

### 4.2。例子



```
 The following class gives several examples for the usage of
regular expressions with strings. See the comment for the purpose.
```

If you want to test these examples, create for the Java project `de.vogella.regex.string`.

如果你想测试这些示例,创建Java项目`de.vogella.regex.string`。


```
package de.vogella.regex.string;

public class StringMatcher {
        // returns true if the string matches exactly "true"
        public boolean isTrue(String s){
                return s.matches("true");
        }
        // returns true if the string matches exactly "true" or "True"
        public boolean isTrueVersion2(String s){
                return s.matches("[tT]rue");
        }

        // returns true if the string matches exactly "true" or "True"
        // or "yes" or "Yes"
        public boolean isTrueOrYes(String s){
                return s.matches("[tT]rue|[yY]es");
        }

        // returns true if the string contains exactly "true"
        public boolean containsTrue(String s){
                return s.matches(".*true.*");
        }


        // returns true if the string contains of three letters
        public boolean isThreeLetters(String s){
                return s.matches("[a-zA-Z]{3}");
                // simpler from for
//                return s.matches("[a-Z][a-Z][a-Z]");
        }



        // returns true if the string does not have a number at the beginning
        public boolean isNoNumberAtBeginning(String s){
                return s.matches("^[^\\d].*");
        }
        // returns true if the string contains a arbitrary number of characters except b
        public boolean isIntersection(String s){
                return s.matches("([\\w&&[^b]])*");
        }
        // returns true if the string contains a number less than 300
        public boolean isLessThenThreeHundred(String s){
                return s.matches("[^0-9]*[12]?[0-9]{1,2}[^0-9]*");
        }

}
```

And a small JUnit Test to validates the examples.

和一个小JUnit测试验证的例子。


```
package de.vogella.regex.string;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class StringMatcherTest {
        private StringMatcher m;

        @Before
        public void setup(){
                m = new StringMatcher();
        }

        @Test
        public void testIsTrue() {
                assertTrue(m.isTrue("true"));
                assertFalse(m.isTrue("true2"));
                assertFalse(m.isTrue("True"));
        }

        @Test
        public void testIsTrueVersion2() {
                assertTrue(m.isTrueVersion2("true"));
                assertFalse(m.isTrueVersion2("true2"));
                assertTrue(m.isTrueVersion2("True"));;
        }

        @Test
        public void testIsTrueOrYes() {
                assertTrue(m.isTrueOrYes("true"));
                assertTrue(m.isTrueOrYes("yes"));
                assertTrue(m.isTrueOrYes("Yes"));
                assertFalse(m.isTrueOrYes("no"));
        }

        @Test
        public void testContainsTrue() {
                assertTrue(m.containsTrue("thetruewithin"));
        }

        @Test
        public void testIsThreeLetters() {
                assertTrue(m.isThreeLetters("abc"));
                assertFalse(m.isThreeLetters("abcd"));
        }

        @Test
        public void testisNoNumberAtBeginning() {
                assertTrue(m.isNoNumberAtBeginning("abc"));
                assertFalse(m.isNoNumberAtBeginning("1abcd"));
                assertTrue(m.isNoNumberAtBeginning("a1bcd"));
                assertTrue(m.isNoNumberAtBeginning("asdfdsf"));
        }

        @Test
        public void testisIntersection() {
                assertTrue(m.isIntersection("1"));
                assertFalse(m.isIntersection("abcksdfkdskfsdfdsf"));
                assertTrue(m.isIntersection("skdskfjsmcnxmvjwque484242"));
        }

        @Test
        public void testLessThenThreeHundred() {
                assertTrue(m.isLessThenThreeHundred("288"));
                assertFalse(m.isLessThenThreeHundred("3288"));
                assertFalse(m.isLessThenThreeHundred("328 8"));
                assertTrue(m.isLessThenThreeHundred("1"));
                assertTrue(m.isLessThenThreeHundred("99"));
                assertFalse(m.isLessThenThreeHundred("300"));
        }

}
```

## 5. Pattern and Matcher

## 5。模式和匹配器

For advanced regular expressions the `java.util.regex.Pattern` and `java.util.regex.Matcher` classes are used.

先进的正则表达式`java.util.regex.Pattern`和`java.util.regex.Matcher`类是使用。

You first create a `Pattern` object which defines the regular expression. This `Pattern` object allows you to create a `Matcher` object for a given string. This `Matcher` object then allows you to do regex operations on a `String`.

首先创建一个`Pattern`对象定义正则表达式。这`Pattern`允许你创建一个对象`Matcher`对于一个给定的字符串对象。这`Matcher`对象允许您做regex操作`String`。



```
package de.vogella.regex.test;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegexTestPatternMatcher {
        public static final String EXAMPLE_TEST = "This is my small example string which I'm going to use for pattern matching.";

        public static void main(String[] args) {
                Pattern pattern = Pattern.compile("\\w+");
                // in case you would like to ignore case sensitivity,
                // you could use this statement:
                // Pattern pattern = Pattern.compile("\\s+", Pattern.CASE_INSENSITIVE);
                Matcher matcher = pattern.matcher(EXAMPLE_TEST);
                // check all occurance
                while (matcher.find()) {
                        System.out.print("Start index: " + matcher.start());
                        System.out.print(" End index: " + matcher.end() + " ");
                        System.out.println(matcher.group());
                }
                // now create a new pattern and matcher to replace whitespace with tabs
                Pattern replace = Pattern.compile("\\s+");
                Matcher matcher2 = replace.matcher(EXAMPLE_TEST);
                System.out.println(matcher2.replaceAll("\t"));
        }
}
```

## 6. Java Regex Examples

## 6。Java正则表达式的例子

The following lists typical examples for the usage of regular expressions. I hope you find similarities to your real-world problems.

以下列出了使用正则表达式的典型例子。我希望你找到相似之处你的现实问题。

### 6.1. Or

### 6.1。或

Task: Write a regular expression which matches a text line if this text line contains either the word "Joe" or the word "Jim" or both.

任务:写一个正则表达式匹配一个文本行如果这个文本行包含单词“乔”或“吉姆”这个词。

Create a project `de.vogella.regex.eitheror` and the following class.

创建一个项目`de.vogella.regex.eitheror`和下面的类。



```
package de.vogella.regex.eitheror;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class EitherOrCheck {
        @Test
        public void testSimpleTrue() {
                String s = "humbapumpa jim";
                assertTrue(s.matches(".*(jim|joe).*"));
                s = "humbapumpa jom";
                assertFalse(s.matches(".*(jim|joe).*"));
                s = "humbaPumpa joe";
                assertTrue(s.matches(".*(jim|joe).*"));
                s = "humbapumpa joe jim";
                assertTrue(s.matches(".*(jim|joe).*"));
        }
}
```

### 6.2. Phone number

### 6.2。电话号码

Task: Write a regular expression which matches any phone number.

任务:写一个正则表达式匹配任何电话号码。

A phone number in this example consists either out of 7 numbers in a row or out of 3 number, a (white)space or a dash and then 4 numbers.

电话号码在这个例子中包含连续7的数字或3号,(白色)空间或少许,然后4号。



```
package de.vogella.regex.phonenumber;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;


public class CheckPhone {

        @Test
        public void testSimpleTrue() {
                String pattern = "\\d\\d\\d([,\\s])?\\d\\d\\d\\d";
                String s= "1233323322";
                assertFalse(s.matches(pattern));
                s = "1233323";
                assertTrue(s.matches(pattern));
                s = "123 3323";
                assertTrue(s.matches(pattern));
        }
}
```

### 6.3. Check for a certain number range

### 6.3。检查一定数量范围

The following example will check if a text contains a number with 3 digits.

下面的例子将检查文本是否包含一个数字3位数。

Create the Java project `de.vogella.regex.numbermatch` and the following class.

创建Java项目`de.vogella.regex.numbermatch`和下面的类。



```
package de.vogella.regex.numbermatch;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class CheckNumber {


        @Test
        public void testSimpleTrue() {
                String s= "1233";
                assertTrue(test(s));
                s= "0";
                assertFalse(test(s));
                s = "29 Kasdkf 2300 Kdsdf";
                assertTrue(test(s));
                s = "99900234";
                assertTrue(test(s));
        }




        public static boolean test (String s){
                Pattern pattern = Pattern.compile("\\d{3}");
                Matcher matcher = pattern.matcher(s);
                if (matcher.find()){
                        return true;
                }
                return false;
        }

}
```

### 6.4. Building a link checker

### 6.4。建立一个链接检查器

The following example allows you to extract all valid links from a webpage. It does not consider links which start with "javascript:" or "mailto:".

下面的示例允许您从网页中提取所有有效链接。它不考虑链接开始“javascript:”或“mailto:”。

Create a Java project called *de.vogella.regex.weblinks* and the following class:

创建一个名为* de.vogella.regex的Java项目。树立自信*和下面的类:



```
package de.vogella.regex.weblinks;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LinkGetter {
        private Pattern htmltag;
        private Pattern link;

        public LinkGetter() {
                htmltag = Pattern.compile("<a\\b[^>]*href=\"[^>]*>(.*?)</a>");
                link = Pattern.compile("href=\"[^>]*\">");
        }

        public List<String> getLinks(String url) {
                List<String> links = new ArrayList<String>();
                try {
                        BufferedReader bufferedReader = new BufferedReader(
                                        new InputStreamReader(new URL(url).openStream()));
                        String s;
                        StringBuilder builder = new StringBuilder();
                        while ((s = bufferedReader.readLine()) != null) {
                                builder.append(s);
                        }

                        Matcher tagmatch = htmltag.matcher(builder.toString());
                        while (tagmatch.find()) {
                                Matcher matcher = link.matcher(tagmatch.group());
                                matcher.find();
                                String link = matcher.group().replaceFirst("href=\"", "")
                                                .replaceFirst("\">", "")
                                                .replaceFirst("\"[\\s]?target=\"[a-zA-Z_0-9]*", "");
                                if (valid(link)) {
                                        links.add(makeAbsolute(url, link));
                                }
                        }
                } catch (MalformedURLException e) {
                        e.printStackTrace();
                } catch (IOException e) {
                        e.printStackTrace();
                }
                return links;
        }

        private boolean valid(String s) {
                if (s.matches("javascript:.*|mailto:.*")) {
                        return false;
                }
                return true;
        }

        private String makeAbsolute(String url, String link) {
                if (link.matches("http://.*")) {
                        return link;
                }
                if (link.matches("/.*") && url.matches(".*$[^/]")) {
                        return url + "/" + link;
                }
                if (link.matches("[^/].*") && url.matches(".*[^/]")) {
                        return url + "/" + link;
                }
                if (link.matches("/.*") && url.matches(".*[/]")) {
                        return url + link;
                }
                if (link.matches("/.*") && url.matches(".*[^/]")) {
                        return url + link;
                }
                throw new RuntimeException("Cannot make the link absolute. Url: " + url
                                + " Link " + link);
        }
}
```

### 6.5. Finding duplicated words

### 6.5。发现重复的单词

The following regular expression matches duplicated words.

下面的正则表达式匹配重复的单词。

```
\b(\w+)\s+\1\b
```



`\b` is a word boundary and `\1` references to the captured match of the first group, i.e., the first word.

`\b`是一个单词边界和`\1`引用了第一组的匹配,即。,第一个单词。

The `(?!-in)\b(\w+) \1\b` finds duplicate words if they do not start with "-in".

的`(?!-in)\b(\w+) \1\b`发现重复的单词,如果他们不从“——”开始。

TIP:Add `(?s)` to search across multiple lines.

提示:添加`(?s)`跨多行搜索。

### 6.6. Finding elements which start in a new line

### 6.6。发现元素中开始一个新行

The following regular expression allows you to find the "title" word, in case it starts in a new line, potentially with leading spaces.

下面的正则表达式允许您找到“标题”这个词,它开始在一个新行,可能与领先的空间。

```
(\n\s*)title
```



### 6.7. Finding (Non-Javadoc) statements

### 6.7。找到(Non-Javadoc)语句

Sometimes (Non-Javadoc) are used in Java source code to indicate that the method overrides a super method. As of Java 1.6 this can be done via the `@Override` annotation and it is possible to remove these statements from your code. The following regular expression can be used to identify these statements.

有时(Non-Javadoc)在Java源代码中使用表明该方法覆盖一个超级方法。在Java 1.6可以通过`@Override`注释和可以将这些语句从您的代码。下面的正则表达式可以用来识别这些语句。

```
(?s) /\* \(non-Javadoc\).*?\*/
```



#### 6.7.1. Replacing the DocBook table statement with Asciidoc

#### 6.7.1。用Asciidoc取代DocBook表声明

You can replace statements like the following:

你可以替换语句如下:

```
<programlisting language="java">
        <xi:include xmlns:xi="http://www.w3.org/2001/XInclude" parse="text" href="./examples/statements/MyClass.java" />
</programlisting>
```



Corresponding regex:

相应的正则表达式:

```
`\s+<programlisting language="java">\R.\s+<xi:include xmlns:xi="http://www\.w3\.org/2001/XInclude" parse="text" href="\./examples/(.*).\s+/>\R.\s+</programlisting>`
```



Target could be your example:

目标可能是你的例子:



```
`\R[source,java]\R----\R include::res/$1[]\R----
```

## 7. Processing regular expressions in Eclipse

## 7所示。在Eclipse中处理正则表达式

The Eclipse IDE allows to perform search and replace across a set of files using regular expressions. In Eclipse use the Ctrl+H shortcut to open the *Search* dialog.

执行搜索和替换的Eclipse IDE允许跨一组文件使用正则表达式。在Eclipse中使用Ctrl + H快捷方式打开搜索* *对话框。

Select the *File Search* tab and check the *Regular expression* flag before entering your regular expression. You can also specify the file type and the scope for the search and replace operation.

选择搜索* *文件选项卡,并检查*正则表达式*国旗在进入你的正则表达式。您还可以指定文件类型和范围的搜索和替换操作。

The following screenshots demonstrate how to search for the <![CDATA[]]]> XML tag with leading whitespace and how to remove the whitespace.

下面的截图演示如何搜索< ![CDATA[]]]> XML标记与领先的空白,如何删除空格。

image::regularexpressioneclipse10.png[Search and replace in Eclipse part 1,pdfwidth=40%}

图片::regularexpressioneclipse10。png(第1部分在Eclipse中搜索和替换,pdfwidth = 40% }

![Search and replace in Eclipse part 2](http://www.vogella.com/tutorials/JavaRegularExpressions/img/xregularexpressioneclipse20.png.pagespeed.ic.blZ0iUfGRU.webp)



The resulting dialog allows you to review the changes and remove elements which should not be replaced. If you press the `OK` button, the changes are applied.

结果对话框允许您查看更改和删除元素不应该被取代。如果你按下`OK`应用按钮,更改。

![Search and replace in Eclipse part 3](http://www.vogella.com/tutorials/JavaRegularExpressions/img/xregularexpressioneclipse30.png.pagespeed.ic.lnmFei5IPp.webp)




## 8. About this website

[Support free content![Support free tutorials](http://www.vogella.com/img/common/50x57xvogella-donate.png.pagespeed.ic.UDQmaK-2g7.webp)](http://www.vogella.com/support.html)

[Questions and discussion![Questions and discussion](http://www.vogella.com/img/common/xquestions.png.pagespeed.ic.8WW9jZNPm-.webp)](http://www.vogella.com/contact.html)

[Tutorial & code license![License](http://www.vogella.com/img/common/xlicense.png.pagespeed.ic.CHvbzakxya.webp)](http://www.vogella.com/license.html)

[Get source code![Source Code](http://www.vogella.com/img/common/xcode.png.pagespeed.ic.2NM8n8v5dG.webp)](http://www.vogella.com/code/index.html)

## 9. Links and Literature

[Regular-Expressions.info on Using Regular Expressions in Java](http://www.regular-expressions.info/java.html)

[Regulare xpressions examples](http://www.regular-expressions.info/examples.html)

[The Java Tutorials: Lesson: Regular Expressions](http://docs.oracle.com/javase/tutorial/essential/regex/)

### 9.1. vogella GmbH training and consulting support

| [TRAINING](http://www.vogella.com/training/) | [SERVICE & SUPPORT](http://www.vogella.com/consulting/) |
| ---------------------------------------- | ---------------------------------------- |
| The vogella company provides comprehensive [training and education services](http://www.vogella.com/training/) from experts in the areas of Eclipse RCP, Android, Git, Java, Gradle and Spring. We offer both public and inhouse training. Whichever course you decide to take, you are guaranteed to experience what many before you refer to as [“The best IT class I have ever attended”](http://www.vogella.com/training/). | The vogella company offers [expert consulting](http://www.vogella.com/consulting/)services, development support and coaching. Our customers range from Fortune 100 corporations to individual developers. |

## Appendix A: Copyright and License

Copyright © 2012-2016 vogella GmbH. Free use of the software examples is granted under the terms of the EPL License. This tutorial is published under the [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Germany](http://creativecommons.org/licenses/by-nc-sa/3.0/de/deed.en) license.

See [Licence](http://www.vogella.com/license.html).



原文链接: <http://www.vogella.com/tutorials/JavaRegularExpressions/article.html>

原文日期: 2016.06.24

