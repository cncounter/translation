# 专题: Java与数字

介绍Java中数字相关的专题文章。

主要内容包括:

- 基础数值类型: 类型、精度
- 包装类型
- 基础使用示例
- 进制表示: 二进制、八进制、十六进制、十进制、转换、多字节与左移
- BigDecimal: 加减乘除与精度、四舍五入。

## Java中的基础数据类型


按照Java语言标准, Java支持整数与浮点数。


根据Java语言规范, 其中共有7种基本数据类型, 分别是:

- byte, 表示一个字节; 占用1个字节的存储空间;
- boolean, 表示布尔值、逻辑值, 取值有: `true` 和 `false`;
- char,



## 二进制基础

```
2^2 = 4
2^4 = 16
2^8 = 256
2^10=1024
```

`2^9`,与 `2^8`，相差几倍？ 是2倍的关系

那2^10,与2^8呢？ 4倍

2^10=1024，约等于1000

所以磁盘的1GB,一般是1000MB, 厂商是这么算的； 操作系统，算的是1024MB,这不太一致，但也差不多

所以，可以近似认为，2^10~=1000; 2的10次方约等于1000，那么,2^20约等于多少？ 100万；

那2^30呢？ 100万*1000 = 10亿

所以 2^32约等于40亿


## 基本数据类型

Java的8种原生类型:

`int`, `long`, `double`, `boolean`, `byte`最常用;  `char`, `short`, `float` 用的少一些

int，4个字节，32位(bit)

能放下多大的数字呢？

最大存放2^32，但有正负数，所以是2^31，正数从0开始计数，所以最大值是2^31 - 1,

int 的范围是 【 `-1*2^31` ~~ `2^31-1`】


## 包装类

```
valueOf与缓存, intValue
```



## 简单示例


## 自动装箱与自动拆箱

编译期间,

反编译效果

实现原理;

## 包装类equals

Long.valueOf(1).equals(1);


## BigDecimal

0值比较是否相等;

四则运算;

精度与四舍五入;

示例代码:

```java

import java.math.BigDecimal;
import java.math.RoundingMode;

public class TestBigDecimalScale {

    public static void main(String[] args) {
        // num1: 带后导0的数字
        BigDecimal num1 = new BigDecimal("1.0200000");
        // num2: 普通的2位小数
        BigDecimal num2 = new BigDecimal("1.02");
        // num3: 很小的小数
        BigDecimal num3 = new BigDecimal("0.0000000000000102");

        // num1.scale=7
        System.out.println("num1.scale=" + num1.scale());
        // num1.toPlainString=1.0200000
        System.out.println("num1.toPlainString=" + num1.toPlainString());
        // num1.equals(num2)=false
        System.out.println("num1.equals(num2)=" + num1.equals(num2));

        // 1. scale精度 与 数值相等, 才算equals
        // num1.setScale(2).equals(num2)=true
        System.out.println("num1.setScale(2).equals(num2)=" + num1.setScale(2).equals(num2));
        // num2.scale=2
        System.out.println("num2.scale=" + num2.scale());
        // num2.toPlainString=1.02
        System.out.println("num2.toPlainString=" + num2.toPlainString());
        // num3.scale=16
        System.out.println("num3.scale=" + num3.scale());
        // 2. 这里输出了科学计数法方式表示的字符串
        // num3.toString=1.02E-14
        System.out.println("num3.toString=" + num3.toString());
        // 3. 可以看到: toPlainString 方法用于防止输出科学计数法
        // num3.toPlainString=0.0000000000000102
        System.out.println("num3.toPlainString=" + num3.toPlainString());

        System.out.println("=========");
        // 4. 设置1位小数; 指定四舍五入模式;
        // num1.scale_1_up.toPlainString=1.0
        System.out.println("num1.scale_1_up.toPlainString=" + num1.setScale(1, RoundingMode.HALF_UP).toPlainString());

        // 5. 不指定 RoundingMode 会报错: java.lang.ArithmeticException: Rounding necessary
        // System.out.println("num1.scale_1.toPlainString=" + num1.setScale(1).toPlainString());
        // 6. 设置5位小数; 不足的补后导0;
        // num2.scale_5_up.toPlainString=1.02000
        System.out.println("num2.scale_5_up.toPlainString=" + num1.setScale(5, RoundingMode.HALF_UP).toPlainString());
        // 7. 这种方式隐含了报错风险:
        // num2.scale_5.toPlainString=1.02000
        System.out.println("num2.scale_5.toPlainString=" + num1.setScale(5).toPlainString());

    }
}

```

## BigInteger


## 伪随机数

随机数种子;


##

数组

链表

单链表

List

HashMap


二叉树

B-Tree
B+Tree
