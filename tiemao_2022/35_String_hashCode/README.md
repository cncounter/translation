# 浅析String与hashCode

 String 类的 hash 冲突比较严重, 我们在系统开发和设计中, 要避开这个潜在的性能坑。

## 1. 示例代码

先来看一段示例代码:

```java

import org.junit.Assert;
import org.junit.Test;
// 演示String类的hash冲突
public class StringHashCodeTest {
    @Test
    public void testMain() {
        main(null);
    }
    public static void main(String[] args) {
        testHash("Aa", "BB"); // 2112
        // 2031744
        testHash("AaAa", "AaBB");
        testHash("BBAa", "AaBB");
    }
    private static void testHash(String s1, String s2) {
        Assert.assertNotNull(s1);
        Assert.assertNotNull(s2);
        int hash1 = s1.hashCode();
        int hash2 = s2.hashCode();
        System.out.println("s1=" + s1 + "; " + "s1.hash=" + hash1 + ";" + " s2=" + s1 + "; " + "s2.hash=" + hash2);
        Assert.assertEquals(hash1, hash2);
    }
}

```

执行代码, 通过断言和注释, 我们可以发现, String 类的hash冲突比较严重。 

当然, 这个允许的, 一个类的 hashCode 方法, 不管哪个对象, 全部返回 `1` 都是允许的, 只是这样不太好而已。 相关信息可以参考:

> [Java中hashCode与equals方法的约定及重写原则](https://renfufei.blog.csdn.net/article/details/14163329)


## 2. `String#hashCode()`实现

点开String类的源代码, 参考注释信息, 可以看到 `String#hashCode()` 的计算公式为:

```java
s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
```

其中, `s[0]`, `s[1]` 表示第 i 个字符的char值。 `n` 就是字符的个数。

JDK11中, `String#hashCode()` 方法的实现代码为:

```java

public final class String
    implements java.io.Serializable,
      Comparable<String>, CharSequence {

    public int hashCode() {
        int h = hash;
        if (h == 0 && value.length > 0) {
            hash = h = isLatin1() ? StringLatin1.hashCode(value)
                                  : StringUTF16.hashCode(value);
        }
        return h;
    }
    // ...
}    
```

这里有一个小知识点, `Comparable<String>`, 这个接口是支持泛型的, 实现 compareTo 时可以只比较自己的类型/及子类 ; 

```java
public interface Comparable<T> {
    // 比较; 返回值类似于减法; this-o; 
    public int compareTo(T o);
}
```

String类的hashCode实现, 使用了2个包级别访问权限的类:

- `java.lang.StringLatin1`
- `java.lang.StringUTF16`


根据 `isLatin1()` 的返回值判断使用哪个方法;

Latin1编码是可以用1个字节表示的编码, 有点类似于 ANSI 编码;  参考百度百科:

> Latin1是ISO-8859-1的别名, 有些环境下写作Latin-1。 ISO-8859-1编码是单字节编码，向下兼容ASCII，其编码范围是0x00-0xFF，0x00-0x7F之间完全和ASCII一致，0x80-0x9F之间是控制字符，0xA0-0xFF之间是文字符号。


`StringLatin1.hashCode(value)` 的实现代码为:

```java

final class StringLatin1 {
    public static int hashCode(byte[] value) {
        int h = 0;
        for (byte v : value) {
            h = 31 * h + (v & 0xff);
        }
        return h;
    }
    // ...
}
```

该实现通过累加值 `h` 乘以一个素数 `31`, 加上后一字符的  `(v & 0xff)`, 因为只需要1个字节即可表示, 所以用 `0xff` 来擦除高位, 没毛病。

这个实现和前面列出的公式是等价的。


接着我们看看 `StringUTF16.hashCode(value)` 方法的实现: 


```java

final class StringUTF16 {
    public static int hashCode(byte[] value) {
        //  初始值0;
        int h = 0;
        // 每个UTF16字符占2字节, 向右移位1次, 相当于除以2, 得到真实的字符个数;
        int length = value.length >> 1;
        for (int i = 0; i < length; i++) {
            h = 31 * h + getChar(value, i);
        }
        return h;
    }
```

## 3. 字节序

这里面 `getChar` 方法的实现有意思, 涉及到了字节序这个东西。

```java

final class StringUTF16 {
    static char getChar(byte[] val, int index) {
        assert index >= 0 && index < length(val) : "Trusted caller missed bounds check";
        index <<= 1;
        return (char)(((val[index++] & 0xff) << HI_BYTE_SHIFT) |
                      ((val[index]   & 0xff) << LO_BYTE_SHIFT));
    }
}
```

大端字节序与小端字节序的具体内容, 可以参考 阮一峰的网络日志:

> [理解字节序](https://www.ruanyifeng.com/blog/2016/11/byte-order.html)

简单的理解, 可以参考这部分代码:

```java

final class StringUTF16 {
    // 当前系统平台/OS/CPU 是否是大端字节序;
    private static native boolean isBigEndian();

    static final int HI_BYTE_SHIFT;
    static final int LO_BYTE_SHIFT;
    static {
        if (isBigEndian()) {
            HI_BYTE_SHIFT = 8;
            LO_BYTE_SHIFT = 0;
        } else {
            HI_BYTE_SHIFT = 0;
            LO_BYTE_SHIFT = 8;
        }
    }
}
```

简单解读, 字节序, 实际上也就是多个字节怎么解读或转换的定义:

- 怎么将多字节的结构体序列化为字节数组 `byte[]`, 因为 `byte[]` 是严格有序的。
- 怎么将字节数组解读为多字节的结构体, 比如: `char` 占2字节, `int` 占 4字节, `long` 占8字节。

回头看前面的 `StringLatin1#getChar(byte[] val, int index)` 方法, 可以加深理解, 同时我们也可以看到移位操作服的作用是什么。

## 4. 小结

既然 String 类的 hash 冲突比较严重, 我们在系统开发和设计中, 就要避开这个潜在的性能坑。

> 2022年08月23日


相关链接: [shipilev](https://twitter.com/shipilev)

