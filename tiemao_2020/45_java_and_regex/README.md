# Java正则表达式入门与实战

本文通过实例介绍Java以及正则表达式相关的知识。 帮助读者夯实正则相关的基础。

## 1. String基础

Java语言通过 `String` 类封装了字符串, 并提供了一些常用的操作方法。 例如字符串查找和替换, 请看代码:

```java
public class StringBaseTest {
    public static void main(String[] args) {
        // 具体的字符串
        String url = "https://so.csdn.net/so/search/s.do?q=renfufei%40qq.com&t=blog&u=renfufei";
        // 1. 字符个数; 字符串长度
        int len = url.length(); // 72
        // 2. 查找子串出现的索引位置
        int firstIndex = url.indexOf("renfufei"); // 37
        int index2 = url.indexOf("renfufei", firstIndex + 1); // 64
        int lastIndex = url.lastIndexOf("renfufei"); // 64
        // 3. 截取字符串; 子串
        String query = url.substring(url.indexOf("?") + 1);
        // 4. 字符串替换
        String url2 = url.replace("renfufei", "kimmking");
        // 5. 正则替换
        url2 = url2.replaceAll("%\\d+\\w+\\.com", "");
        // 6. 输出结果
        System.out.println("len=" + len);
        System.out.println("firstIndex=" + firstIndex);
        System.out.println("index2=" + index2);
        System.out.println("lastIndex=" + lastIndex);
        System.out.println("query: " + query);
        System.out.println("url2: " + url2);
    }
}
```

初学者容易出错的是 `replaceAll` 方法, 以及 `replaceFirst` 方法, 第一个参数都会被当做正则表达式来解析。

说到底这是API命名没有做好, 让新手容易混淆。 但为了兼容性, 都已经这样了那就这样吧。

再来看看String类高级一点的用法:


```java

public class StringRegexTest {
    public static void main(String[] args) {
        // XML字符串
        String xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<project>\n" +
                "    <modelVersion>4.0.0</modelVersion>\n" +
                "    <groupId>com.cncounter</groupId>\n" +
                "    <artifactId>regex-demo</artifactId>\n" +
                "    <version>1.0</version>\n" +
                "    <properties>\n" +
                "        <shardingsphere.version>4.1.1</shardingsphere.version>\n" +
                "    </properties>\n" +
                "    <dependencies>\n" +
                "        <dependency>\n" +
                "            <groupId>org.apache.shardingsphere</groupId>\n" +
                "            <artifactId>sharding-jdbc-core</artifactId>\n" +
                "            <version>${shardingsphere.version}</version>\n" +
                "        </dependency>\n" +
                "    </dependencies>\n" +
                "</project>\n";
        // 1. 字符个数; 字符串长度
        int len = xml.length(); // 72
        // 2. 查找子串出现的索引位置
        int firstIndex = xml.indexOf("renfufei"); // 37
        int index2 = xml.indexOf("renfufei", firstIndex + 1); // 64
        int lastIndex = xml.lastIndexOf("renfufei"); // 64
        // 3. 截取字符串; 子串
        String query = xml.substring(xml.indexOf("?") + 1);
        // 4. 字符串替换
        String xml2 = xml.replace("renfufei", "kimmking");
        // 5. 正则替换
        xml2 = xml2.replaceAll("%\\d+\\w+\\.com", "");
        // 6. 输出结果
        System.out.println("len=" + len);
        System.out.println("firstIndex=" + firstIndex);
        System.out.println("index2=" + index2);
        System.out.println("lastIndex=" + lastIndex);
        System.out.println("query: " + query);
        System.out.println("xml2: " + xml2);
    }
}
```



## 2. Java正则表达式基础

String类只提供了使用正则表达式来替换







## 3. 正则相关概念

## 4. 正则表达式基本使用示例

## 5. 正则表达式高级使用示例

## 6. 正则表达式反例


## 7. 更多案例与链接

- [Java正则表达式优化:GitHub](https://github.com/cncounter/translation/blob/master/tiemao_2015/08_Optimizing_Java_Regular/08_Optimizing_Java_Regular.md)
- [用正则来简化模式匹配代码:GitHub](https://github.com/cncounter/translation/tree/master/tiemao_2015/09_pattern_matching)
- [Java正则系列: (1)入门教程:GitHub](https://github.com/cncounter/translation/blob/master/tiemao_2017/11_Java_Regular_Expression/11_Java_Regular_Expression.md)
- [Java正则系列: (2)量词:GitHub](https://github.com/cncounter/translation/blob/master/tiemao_2017/17_Java_Regex_Quant/17_Java_Regex_Quant.md)
- [`java.util.regex.Pattern`使用示例:programcreek](https://www.programcreek.com/java-api-examples/index.php?api=java.util.regex.Pattern)
- [`java.util.regex.Matcher`使用示例:programcreek](https://www.programcreek.com/java-api-examples/index.php?api=java.util.regex.Matcher)
- [Regular expressions in Java - Tutorial](https://www.vogella.com/tutorials/JavaRegularExpressions/article.html)
- [Lesson: Regular Expressions:Oracle](https://docs.oracle.com/javase/tutorial/essential/regex/index.html)
- [`java.util.regex.Pattern`类-JavaDoc](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html)
- [Regular Expressions大全](https://www.regular-expressions.info/)

- [Grok 正则捕获](https://doc.yonyoucloud.com/doc/logstash-best-practice-cn/filter/grok.html)
