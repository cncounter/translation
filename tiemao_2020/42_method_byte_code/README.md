# 深入JVM - 案例讲解方法体字节码

[TOC]


Java虚拟机规范中, 定义了class文件中使用的各种字节码, 也就是Java虚拟机指令集。 英文文档为: [Chapter 6. The Java Virtual Machine Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)

另外，官方单独整理了一份操作码助记符, 对应的链接为: [Java Virtual Machine Specification: Chapter 7. Opcode Mnemonics by Opcode](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-7.html)


## 0. 局部变量表的规则

在开始之前, 先简单介绍字节码文件中, 方法局部变量表的规则:

- 如果是实例方法, 则局部变量表中第0号槽位中保存的是 this 指针。
- 然后排列的是方法的入参。 前面的this, 以及入参都是方法执行前就已经设置好的。
- 接下来就是按照局部变量定义的顺序, 依次分配槽位。
- 注意 long 和 double 会占据2个槽位, 那么可以算出每个槽位是32bit，也就是4字节, 这是历史债了。
- 可能存在匿名的局部变量以及槽位。
- 可能存在变量槽位重用的情况，依据局部变量的作用域范围而定, 这都是编译器干的事。
- 具体的汇总和映射信息, 在 class 文件中每个方法的局部变量表中进行描述。

局部变量表, `LocalVariableTable`, 有时候也称为本地变量表，都是一回事，重点是理解其含义。


下面依次进行讲解，并通过实际的例子来加深理解。

## 1. 常量(Constant)相关的操作符

常量相关的操作符, 大部分都很简单。 表示直接从字节码中取值, 或者从本类的运行时常量池中取值, 然后压入操作数栈的栈顶。

| 十进制 | 十六进制 | 助记符          |  说明           |
| :---  | :---    | :---           | :---           |
| 00    | (0x00)  | nop            | 没有操作, 可以看到编码是00 |
| 01    | (0x01)  | aconst_null    | 将常量 `null` 压入操作数栈的栈顶  |
| 02    | (0x02)  | iconst_m1      | 将int常量值 `-1` 压入操作数栈    |
| 03    | (0x03)  | iconst_0       | 将int常量值 `0` 压入操作数栈     |
| 04    | (0x04)  | iconst_1       | 将int常量值 `1` 压入操作数栈     |
| 05    | (0x05)  | iconst_2       | 将int常量值 `2` 压入操作数栈     |
| 06    | (0x06)  | iconst_3       | 将int常量值 `3` 压入操作数栈     |
| 07    | (0x07)  | iconst_4       | 将int常量值 `4` 压入操作数栈     |
| 08    | (0x08)  | iconst_5       | 将int常量值 `5` 压入操作数栈     |
| 09    | (0x09)  | lconst_0       | 将long常量值 `0` 压入操作数栈    |
| 10    | (0x0a)  | lconst_1       | 将long常量值 `1` 压入操作数栈    |
| 11    | (0x0b)  | fconst_0       | 将float常量值 `0` 压入操作数栈   |
| 12    | (0x0c)  | fconst_1       | 将float常量值 `1` 压入操作数栈   |
| 13    | (0x0d)  | fconst_2       | 将float常量值 `2` 压入操作数栈   |
| 14    | (0x0e)  | dconst_0       | 将double常量值 `0` 压入操作数栈  |
| 15    | (0x0f)  | dconst_1       | 将double常量值 `1` 压入操作数栈  |
| 16    | (0x10)  | bipush         | 将byte 常量值压入操作数栈, 后面带的操作数是1个字节 |
| 17    | (0x11)  | sipush         | 将short常量值压入操作数栈, 后面带的操作数占2个字节 |
| 18    | (0x12)  | ldc            | 将运行时常量池中的item压入操作数栈,load constant,后面带的操作数是1字节的常量池index |
| 19    | (0x13)  | ldc_w          | 将运行时常量池中的item压入操作数栈, 后面带的操作数是2字节的wide index        |
| 20    | (0x14)  | ldc2_w         | 将运行时常量池中的long或者double值压入操作数栈, 后面带的操作数是2字节的index  |


这一块很简单，也很容易记忆。

下面我们用代码来简单演示, 以加深印象:

```java
package com.cncounter.opcode;

/**
 * 演示常量相关的操作码
 */
public class DemoConstantsOpcode {

    public static void testConstOpcode() {
        int m1 = -1; // iconst_m1; istore_0;
        int i0 = 0;  // iconst_0; istore_1;
        int i1 = 1;  // iconst_1; istore_2;
        int i2 = 2;  // iconst_2; istore_3;
        int i3 = 3;  // iconst_3; istore 4;
        int i4 = 4;  // iconst_4; istore 5;
        int i5 = 5;  // iconst_5; istore 6;

        long l0 = 0L;     // lconst_0; lstore 7;
        long l1 = 1L;     // lconst_1; lstore 9;
        float f0 = 0F;    // fconst_0; fstore 11;
        float f1 = 1F;    // fconst_1; fstore 12;
        float f2 = 2F;    // fconst_2; fstore 13;
        double d0 = 0D;   // dconst_0; dstore 14;
        double d1 = 1D;   // dconst_1; dstore 16;

        int i127 = 127;  // bipush 127; istore 18;
        int i128 = 128;  // sipush 128; istore 19;

        Object obj = null;  // aconst_null; astore 20;
        float f520 = 5.20f; // ldc #2 <5.2>; fstore 21;
        String name = "tiemao"; // ldc #3 <tiemao>; astore 22;
        long l65536 = 65536L;   // ldc2_w #4 <65536>; lstore 23;
        double d86400 = 86400.0D; // ldc2_w #6 <86400.0>; dstore 25;
        double d00 = 0.0D;        // dconst_0; dstore 27;
    }

    public static void main(String[] args) {
        testConstOpcode();
    }
}
```

可以看到, 定义一个变量并赋值常量字面量, 会涉及到2个操作: 常量值入栈, 以及将栈顶元素出栈并存储到局部变量表中的槽位;

下文会详细介绍赋值相关的指令。 为了方便理解, 这里简单说一下:

- `istore_0` 表示将栈顶的int值弹出, 保存到局部变量表的第0号槽位。
- `istore 4` 表示将栈顶的int值弹出, 保存到局部变量表的第4号槽位。
- `lstore 7` 表示将栈顶的long值弹出, 保存到局部变量表的第7号槽位; 注意long值会在局部变量表中占2个槽位。
- `fstore 11` 表示将栈顶的float值弹出, 保存到局部变量表的第11号槽位。
- `dstore 14` 表示将栈顶的double值弹出, 保存到局部变量表的第14号槽位; 注意double值也会在局部变量表中占2个槽位。
- `astore 20` 表示将栈顶的引用地址(address)弹出, 保存到局部变量表的第20号槽位。

其他的store指令也可以进行类似的理解。


我们可以通过以下命令进行编译和反编译以验证:

```shell
# 查看JDK工具的帮助信息
javac -help
javap -help

# 带调试信息编译
javac -g DemoConstantsOpcode.java
# 反编译
javap -v DemoConstantsOpcode.class

# 因为带了package, 所以执行时需要注意路径:
cd ../../..
java com.cncounter.opcode.DemoConstantsOpcode
```

反编译工具 javap 输出的字节码信息很多, 节选出我们最关心的 testConstOpcode 方法部分：

```java
  public static void testConstOpcode();
    descriptor: ()V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=29, args_size=0
         0: iconst_m1
         1: istore_0
         2: iconst_0
         3: istore_1
         4: iconst_1
         5: istore_2
         6: iconst_2
         7: istore_3
         8: iconst_3
         9: istore        4
        11: iconst_4
        12: istore        5
        14: iconst_5
        15: istore        6
        17: lconst_0
        18: lstore        7
        20: lconst_1
        21: lstore        9
        23: fconst_0
        24: fstore        11
        26: fconst_1
        27: fstore        12
        29: fconst_2
        30: fstore        13
        32: dconst_0
        33: dstore        14
        35: dconst_1
        36: dstore        16
        38: bipush        127
        40: istore        18
        42: sipush        128
        45: istore        19
        47: aconst_null
        48: astore        20
        50: ldc           #2                  // float 5.2f
        52: fstore        21
        54: ldc           #3                  // String tiemao
        56: astore        22
        58: ldc2_w        #4                  // long 65536l
        61: lstore        23
        63: ldc2_w        #6                  // double 86400.0d
        66: dstore        25
        68: dconst_0
        69: dstore        27
        71: return
      LineNumberTable:
        line 9: 0
        line 10: 2
        line 11: 4
        line 12: 6
        line 13: 8
        line 14: 11
        line 15: 14
        line 17: 17
        line 18: 20
        line 19: 23
        line 20: 26
        line 21: 29
        line 22: 32
        line 23: 35
        line 25: 38
        line 26: 42
        line 28: 47
        line 29: 50
        line 30: 54
        line 31: 58
        line 32: 63
        line 33: 68
        line 34: 71
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            2      70     0    m1   I
            4      68     1    i0   I
            6      66     2    i1   I
            8      64     3    i2   I
           11      61     4    i3   I
           14      58     5    i4   I
           17      55     6    i5   I
           20      52     7    l0   J
           23      49     9    l1   J
           26      46    11    f0   F
           29      43    12    f1   F
           32      40    13    f2   F
           35      37    14    d0   D
           38      34    16    d1   D
           42      30    18  i127   I
           47      25    19  i128   I
           50      22    20   obj   Ljava/lang/Object;
           54      18    21  f520   F
           58      14    22  name   Ljava/lang/String;
           63       9    23 l65536   J
           68       4    25 d86400   D
           71       1    27   d00   D
```

因为我们在javac编译时指定了 `-g` 参数, 生成详细的调试信息， 所以 javap 能看到行号映射表(LineNumberTable), 以及详细的局部变量表信息(LocalVariableTable)。

简单参考一下即可, 重点关注本节介绍的指令, 暂时不进行详细的讲解。


## 2. 取值(Load)相关的操作符

取值操作(Load)是指从局部变量表之中取值, 然后压入操作数栈的栈顶。

Load也可以称为加载。

对应的操作码指令如下:


| 十进制 | 十六进制 | 助记符    |  说明                                            |
| :---  | :---    | :---     | :---                                            |
| 21    | (0x15)  | iload    | 从局部变量表槽位中将int值压入操作数栈                 |
| 22    | (0x16)  | lload    | 从局部变量表槽位中将long值压入操作数栈                |
| 23    | (0x17)  | fload    | 从局部变量表槽位中将float值压入操作数栈               |
| 24    | (0x18)  | dload    | 从局部变量表槽位中将double值压入操作数栈              |
| 25    | (0x19)  | aload    | 从局部变量表槽位中将引用address值压入操作数栈          |
| 26    | (0x1a)  | iload_0  | 将局部变量表0号槽位中的int值压入操作数栈               |
| 27    | (0x1b)  | iload_1  | 将局部变量表1号槽位中的int值压入操作数栈               |
| 28    | (0x1c)  | iload_2  | 将局部变量表2号槽位中的int值压入操作数栈               |
| 29    | (0x1d)  | iload_3  | 将局部变量表3号槽位中的int值压入操作数栈               |
| 30    | (0x1e)  | lload_0  | 将局部变量表0号槽位中的long值压入操作数栈              |
| 31    | (0x1f)  | lload_1  | 将局部变量表1号槽位中的long值压入操作数栈              |
| 32    | (0x20)  | lload_2  | 将局部变量表2号槽位中的long值压入操作数栈              |
| 33    | (0x21)  | lload_3  | 将局部变量表3号槽位中的long值压入操作数栈              |
| 34    | (0x22)  | fload_0  | 将局部变量表0号槽位中的float值压入操作数栈             |
| 35    | (0x23)  | fload_1  | 将局部变量表1号槽位中的float值压入操作数栈             |
| 36    | (0x24)  | fload_2  | 将局部变量表2号槽位中的float值压入操作数栈             |
| 37    | (0x25)  | fload_3  | 将局部变量表3号槽位中的float值压入操作数栈             |
| 38    | (0x26)  | dload_0  | 将局部变量表0号槽位中的double值压入操作数栈            |
| 39    | (0x27)  | dload_1  | 将局部变量表0号槽位中的double值压入操作数栈            |
| 40    | (0x28)  | dload_2  | 将局部变量表0号槽位中的double值压入操作数栈            |
| 41    | (0x29)  | dload_3  | 将局部变量表0号槽位中的double值压入操作数栈            |
| 42    | (0x2a)  | aload_0  | 将局部变量表0号槽位中的引用类型addreass压入操作数栈     |
| 43    | (0x2b)  | aload_1  | 将局部变量表1号槽位中的引用类型addreass压入操作数栈     |
| 44    | (0x2c)  | aload_2  | 将局部变量表2号槽位中的引用类型addreass压入操作数栈     |
| 45    | (0x2d)  | aload_3  | 将局部变量表3号槽位中的引用类型addreass压入操作数栈     |
| 46    | (0x2e)  | iaload   | 将int[]数组(array)某个下标位置的值压入操作数栈        |
| 47    | (0x2f)  | laload   | 将long[]数组某个下标位置的值压入操作数栈              |
| 48    | (0x30)  | faload   | 将float[]数组某个下标位置的值压入操作数栈             |
| 49    | (0x31)  | daload   | 将double[]数组某个下标位置的值压入操作数栈            |
| 50    | (0x32)  | aaload   | 将引用类型数组某个下标位置的值压入操作数栈             |
| 51    | (0x33)  | baload   | 将boolean[]或者byte[]数组某个下标位置的值压入操作数栈  |
| 52    | (0x34)  | caload   | 将char[]数组某个下标位置的值压入操作数栈              |
| 53    | (0x35)  | saload   | 将short[]数组某个下标位置的值压入操作数栈             |



都是load相关的指令, 都是相同的套路，也很容易记忆。

下面我们构造一段代码, 用来演示这些指令, 个别的可能涵盖不到, 为了简单就不强行构造了, 读者照搬套路即可:

```java
package com.cncounter.opcode;

import java.util.Arrays;

/**
 * 演示常量相关的操作码; 这些方法纯粹是为了演示;
 */
public class DemoLoadOpcode {

    public static void testIntLoad(int num0, int num1, int num2,
                                   int num3, int num4) {
        // 方法的每个int参数占一个槽位
        // iload_0; iload_1; iadd; iload_2; iadd;
        // iload_3; iadd; iload 4; iadd; istore 5;
        int total = num0 + num1 + num2 + num3 + num4;
        // 所以 total 排到第5号槽位
        // iload 5; iload 5;
        Integer.valueOf(total);
    }

    public static void testLongLoad(long num0, long num1, long num2) {
        // 每个 long 型入参占2个槽位
        // lload_0; lload_2; ladd; lload 4; ladd;
        Long.valueOf(num0 + num1 + num2);
    }

    public void testInstanceLongLoad(long num1, long num2) {
        // 实例方法中, 局部变量表的0号槽位被 this 占了
        // 然后是方法入参, 每个long占2个槽位
        // aload_0; lload_1; l2d; lload_3; l2d;
        this.testInstanceDoubleLoad(num1, num2);
    }

    public static void testFloatLoad(float num0, float num1, float num2,
                                     float num3, float num4) {
        // fload_0; fload_1; fadd; fload_2; fadd;
        // fload_3; fadd; fload 4; fadd;
        Float.valueOf(num0 + num1 + num2 + num3 + num4);
    }

    public static void testDoubleLoad(double num0, double num1, double num2) {
        // 每个 double 型入参占2个槽位
        // dload_0; dload_2; dadd; dload 4; dadd;
        Double.valueOf(num0 + num1 + num2);
    }

    // FIXME: 这是一个死循环递归方法, 此处仅用于演示
    public void testInstanceDoubleLoad(double num1, double num2) {
        // 实例方法, 局部变量表的0号槽位同来存放 this
        // aload_0; dload_1; dload_3;
        testInstanceDoubleLoad(num1, num2);
    }

    public static void testReferenceAddrLoad(String str0, Object obj1, Integer num2,
                                             Long num3, Float num4, Double num5) {
        // 方法每个 obj 参数占一个槽位; 部分字节码:
        // aload_0; aload_1; aload_2; aload_3; aload 4; aload 5
        Arrays.asList(str0, obj1, num2, num3, num4, num5);
    }

    public static void testArrayLoad(int[] array0, long[] array1, float[] array2,
                                     double[] array3, String[] array4, boolean[] array5,
                                     byte[] array6, char[] array7, short[] array8) {
        // 这几个操作的字节码套路都是一样的:
        // 数组引用; 下标;     数组取值; 赋值给局部变量;
        // aload_0; iconst_0; iaload; istore 9;
        int num0 = array0[0];
        // aload_1; iconst_1; laload; lstore 10;
        long num1 = array1[1];
        // aload_2; iconst_2; faload; fstore 12;
        float num2 = array2[2];
        // aload_3; iconst_3; daload; dstore 13;
        double num3 = array3[3];
        // aload 4; iconst_4; aaload; astore 15;
        Object obj4 = array4[4];
        // aload 5; iconst_5; baload; istore 16;
        boolean bool5 = array5[5];
        // aload 6; bipush 6; baload; istore 17;
        byte byte6 = array6[6];
        // aload 7; bipush 7; caload; istore 18;
        char char7 = array7[7];
        // aload 8; bipush 8; saload; istore 19;
        short num8 = array8[8];
    }

    public static void main(String[] args) {
    }
}
```

字节码中, 每个指令后面附带的操作数, 其含义由操作码不同而不同, 分析时需要辨别。

其实代码中的注释信息已经很明确了。

我们先编译和反编译代码。


```shell
# 带调试信息编译
javac -g DemoLoadOpcode.java
# 反编译
javap -v DemoLoadOpcode.class
```

反编译之后查看到的字节码信息很多, 我们一个一个来看。

#### 2.1 testIntLoad 方法

这个方法演示从局部变量表取int值的指令。

关键代码是:

```java
int total = num0 + num1 + num2 + num3 + num4;
```

反编译后的字节码信息为:

```java
public static void testIntLoad(int, int, int, int, int);
  descriptor: (IIIII)V
  flags: ACC_PUBLIC, ACC_STATIC
  Code:
    stack=2, locals=6, args_size=5
       0: iload_0
       1: iload_1
       2: iadd
       3: iload_2
       4: iadd
       5: iload_3
       6: iadd
       7: iload         4
       9: iadd
      10: istore        5
      12: iload         5
      14: invokestatic  #2                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
      17: pop
      18: return
    LineNumberTable:
      line 15: 0
      line 18: 12
      line 19: 18
    LocalVariableTable:
      Start  Length  Slot  Name   Signature
          0      19     0  num0   I
          0      19     1  num1   I
          0      19     2  num2   I
          0      19     3  num3   I
          0      19     4  num4   I
         12       7     5 total   I
```

和代码中的注释信息进行对照和验证。 可以发现套路都差不多, 记住1个就记住了5个。

解读如下:

- `iload_0`; `iload_1`; `iload_2`; `iload_3`; `iload 4`; 从对应的槽位加载int值。
- `iadd`; 执行int相加; 消耗2个操作数栈中的int值, 压入一个int值。
- `istore 5`; 前面介绍过, 将栈顶int值弹出并保存到局部变量表的 5 号槽位中。


####  2.2 testLongLoad 方法

这个方法演示从局部变量表取long值的指令。


关键代码是:

```java
Long.valueOf(num0 + num1 + num2);
```

反编译后的字节码信息为:

```java

public static void testLongLoad(long, long, long);
  descriptor: (JJJ)V
  flags: ACC_PUBLIC, ACC_STATIC
  Code:
    stack=4, locals=6, args_size=3
       0: lload_0
       1: lload_2
       2: ladd
       3: lload         4
       5: ladd
       6: invokestatic  #3                  // Method java/lang/Long.valueOf:(J)Ljava/lang/Long;
       9: pop
      10: return
    LineNumberTable:
      line 24: 0
      line 25: 10
    LocalVariableTable:
      Start  Length  Slot  Name   Signature
          0      11     0  num0   J
          0      11     2  num1   J
          0      11     4  num2   J
```

解读如下:

- 每个 long 类型的占2个槽位, 所以3个long类型入参占据了0号,2号,4号槽位;
- `lload_0` 从0号槽位取值;
- `lload_2` 从2号槽位取值;
- `lload 4` 从4号槽位取值。
- `pop` 则是因为我们调用的 `Long.valueOf` 方法有返回值, 这里没用到, 所以要扔掉, 也就是从操作数栈中弹出.

那么如何从1号和3号槽位取long类型的值呢？


#### 2.3 testInstanceLongLoad 方法

这个方法演示从局部变量表取long值的指令, 注意这不是 static 方法, 而是一个实例方法。

关键代码是:

```java
this.testInstanceDoubleLoad(num1, num2);
```

可以看到, 内部调用了另一个实例方法。

反编译后的字节码信息为:


```java
public void testInstanceLongLoad(long, long);
  descriptor: (JJ)V
  flags: ACC_PUBLIC
  Code:
    stack=5, locals=5, args_size=3
       0: aload_0
       1: lload_1
       2: l2d
       3: lload_3
       4: l2d
       5: invokevirtual #4                  // Method testInstanceDoubleLoad:(DD)V
       8: return
    LineNumberTable:
      line 31: 0
      line 32: 8
    LocalVariableTable:
      Start  Length  Slot  Name   Signature
          0       9     0  this   Lcom/cncounter/opcode/DemoLoadOpcode;
          0       9     1  num1   J
          0       9     3  num2   J
```

解读如下:

- `aload_0` 加载0号槽位的引用, 也就是this指针。
- `lload_1` 加载1号槽位的long值, 这里就是第一个方法入参。
- `lload_3` 加载3号槽位的long值, 因为前一个局部变量(方法入参)是long, 所以不存在2号槽位。
- `l2d` 是执行类型转换的, 学习Java基础时, 我们就知道long允许自动转型为 double。
- `invokevirtual` 是执行普通的实例方法。


#### 2.4 testFloatLoad 方法

这个方法演示从局部变量表取float值的指令。

关键代码是:

```java
Float.valueOf(num0 + num1 + num2 + num3 + num4);
```

反编译后的字节码信息为:


```java
public static void testFloatLoad(float, float, float, float, float);
  descriptor: (FFFFF)V
  flags: ACC_PUBLIC, ACC_STATIC
  Code:
    stack=2, locals=5, args_size=5
       0: fload_0
       1: fload_1
       2: fadd
       3: fload_2
       4: fadd
       5: fload_3
       6: fadd
       7: fload         4
       9: fadd
      10: invokestatic  #5                  // Method java/lang/Float.valueOf:(F)Ljava/lang/Float;
      13: pop
      14: return
    LineNumberTable:
      line 38: 0
      line 39: 14
    LocalVariableTable:
      Start  Length  Slot  Name   Signature
          0      15     0  num0   F
          0      15     1  num1   F
          0      15     2  num2   F
          0      15     3  num3   F
          0      15     4  num4   F
```

解读如下:

- `fload_0`; `fload_1`; `fload_2`; `fload_3`; `fload  4`; 分别从各个槽位取float值, 压入栈顶。
- `fadd`; 浮点数相加;
- `pop`: 我们调用的方法有返回值, 却没用到, 所以要从操作数栈中弹出.


// TODO



更多文章请参考GitHub上的文章翻译项目: <https://github.com/cncounter/translation>

同时也请各位大佬点赞Star支持!

原文链接: [2020年文章: 42.深入JVM - 案例讲解方法体字节码](https://github.com/cncounter/translation/blob/master/tiemao_2020/42_method_byte_code/README.md)
