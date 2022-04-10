# Java中数值类型的最大取值

> 面试题: Java中, long 和 double 都是8字节64位存储的, 请问哪个类型能表示的自然数范围更大?


示例代码为:

```java

package com.cncounter.test.util;

import java.math.BigDecimal;

/*
面试题: Java中, long 和 double 都是8字节64位存储的, 请问哪个类型能表示的自然数范围更大?
 */
public class LongDoubleTest {
    public static void main(String[] args) {
        // 大约 922亿亿;
        long longMax = Long.MAX_VALUE;
        double doubleMax = Double.MAX_VALUE;
        // longMax = 9223372036854775807
        System.out.println("longMax = " + longMax);
        // 1E8 = 1亿, 1后面带8个0;
        // 1E8 = 100000000
        System.out.println("1E8 = " + Double.valueOf(1E8).longValue());
        // 1.79E308大约是: 1.79亿亿亿亿亿...（重复 308/8 ~= 38 个左右的单位 "亿")
        // doubleMax = 1.7976931348623157E308
        System.out.println("doubleMax = " + doubleMax);

        // d1 = 9.223372036854776E18
        double d1 = longMax;
        System.out.println("d1 = " + d1);
        // d2 = 9.223372036854776E18
        double d2 = d1 - 10.0;
        System.out.println("d2 = " + d2);
        // 可以发现, 双精度已经丢精度了; d1 和 d2 区分不开;
        // (d1 == d2) : true
        System.out.println("(d1 == d2) : " + (d1 == d2));
        // 大数值需要使用 BigDecimal
        BigDecimal decimal = new BigDecimal(longMax);
        // bigValue = 85070591730234615847396907784232501249
        BigDecimal bigValue = decimal.multiply(decimal);
        System.out.println("bigValue = " + bigValue);
        // BigDecimal 除法计算必须指定 scale 精度, 四舍五入方法(区别在于边界值0.5的时候怎么算)
        int scale = 18;
        BigDecimal divideValue = bigValue.divide(new BigDecimal(Math.PI),
                scale, BigDecimal.ROUND_HALF_UP);
    }
}

```
