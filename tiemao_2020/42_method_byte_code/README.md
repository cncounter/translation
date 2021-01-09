# 深入JVM - 案例讲解方法体字节码


Java虚拟机规范中, 定义了class文件中使用的各种字节码, 也就是Java虚拟机指令集。 英文文档为: [Chapter 6. The Java Virtual Machine Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)

另外，官方单独整理了一份操作码助记符, 对应的链接为: [Java Virtual Machine Specification: Chapter 7. Opcode Mnemonics by Opcode](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-7.html)


下面依次进行讲解，并通过实际的例子来加深理解。

## 常量(Constant)相关的操作符

常量相关的操作符, 大部分都很简单。

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

可以看到, 用常量字面量给变量赋值, 会涉及到2个操作: 常量值入栈, 以及将栈顶元素出栈并存储到局部变量表中的槽位;

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

简单参考一下即可, 重点关注本节介绍的指令, 暂时不进行详细的讲解。









更多文章请参考GitHub上的文章翻译项目: <https://github.com/cncounter/translation>

同时也请各位大佬点赞Star支持!

原文链接: [2020年文章: 42.深入JVM - 案例讲解方法体字节码](https://github.com/cncounter/translation/blob/master/tiemao_2020/42_method_byte_code/README.md)
