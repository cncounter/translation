# 深入JVM - 一个class文件最多包含多少个常量?

> 副标题: class文件中常量池条目数量限制与方法指令数限制

class文件与方法体字节码相关的知识, 请参考前文:

- [深入JVM - 实例详解invoke相关操作码](../../tiemao_2020/41_invoke_opcode/README.md)
- [深入JVM - 案例讲解方法体字节码](../../tiemao_2020/42_method_byte_code/README.md)


实际编程中, 一个类的规模不会特别大, 一个方法的代码行数一般不会超过1000行。 很多标准约定一个方法不能超过10行逻辑代码。

所以我们专门编写一个程序, 用来生成大量的重复代码。

## 测试代码

> 测试类 `GenConstants.java` :

```java
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;

public class GenConstants {

    public static void main(String[] args) throws IOException {
        // 生成一个.java文件; 路径信息:
        String className = "MyConstantsTest";
        String suffix = ".java";
        String path = "/Users/renfufei/GITHUB_ALL/DEMO_ALL/test-gen/";
        // 拼出一个类的代码
        StringBuffer buffer = new StringBuffer();
        buffer.append("\n");
        buffer.append("public class ");
        buffer.append(className);
        buffer.append(" {").append("\n");
        buffer.append("\n");
        buffer.append("    public static void main(String[] args) {").append("\n");
        // 循环输出N行相似的代码
        appendNLine(buffer, 65536);
        buffer.append("    }").append("\n");
        buffer.append("}").append("\n");
        // 写入文件
        Path filePath = Path.of(path, className + suffix);
        // 记得设置 UTF-8 编码
        Files.writeString(filePath, buffer.toString(), Charset.forName("UTF-8"));
    }

    private static void appendNLine(StringBuffer buffer, int lines) {
        for (int i = 0; i < lines; i++) {
            buffer.append("String str" + i + " = ");
            buffer.append("\"str_" + i + "\";");
            buffer.append("\n");
        }
    }
}

```

然后我们执行这个程序:

```shell
# 查看java环境版本号
$ java -version
java 11.0.6 2020-01-14 LTS
Java(TM) SE Runtime Environment 18.9 (build 11.0.6+8-LTS)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.6+8-LTS, mixed mode)

$ javac -version
javac 11.0.6

# 编译代码并执行
$ javac -g GenConstants.java
$ java GenConstants

# 然后尝试编译刚刚生成的java代码
$ javac -g MyConstantsTest.java
MyConstantsTest.java:4: 错误: 代码过长
    public static void main(String[] args) {
                       ^
MyConstantsTest.java:2: 错误: 常量过多
public class MyConstantsTest {
       ^
2 个错误
```

可以看到, 编译报错; 提示信息是:

- "错误: 代码过长"
- "错误: 常量过多"

根据提示信息, 可以推断得知常量的个数超过限制了。

我之前是在Idea编辑器中执行的, 生成后打开 MyConstantsTest.java 文件时, 直接将Idea卡死并最终导致了内存溢出。


## 原因分析

class文件有一些限制:

- 每个方法的局部变量表, 使用2个字节表示索引, 所以理论上最多支持 2的16次方, 也就是65536个 "局部变量槽位";
- 常量池默认也是使用2个字节来表示索引, 所以理论上最多支持 65536 个 "常量值";

每个字面量的 String 值都是常量, 会占用一个常量池槽位。
如果javac生成调试信息, 那么每个局部变量名都是字符串常量, 也会占用1个常量池槽位。


## 修改临界值

如果我们减小生成的代码行数, 到多少个时才会报错呢?

修改代码, 减少到1万个:

```java
appendNLine(buffer, 10000);
```

继续执行前面的流程, 报错信息为:

```
$ javac MyConstantsTest.java
$ javac -g MyConstantsTest.java

MyConstantsTest.java:4: 错误: 代码过长
    public static void main(String[] args) {
                       ^
1 个错误
```

这里错误提示信息少了一个, 不再提示常量过多, 只有"代码过长"的提示了。

使用二分法, 逐渐降低生成的代码行数, 最终找到一个安全的数字是 9471;

```java
appendNLine(buffer, 9471);
```

当然, 如果你的编译环境不同, 这个数字可能会有一些不同。

继续执行测试流程:

```sh
# 生成代码:
$ javac -g GenConstants.java
$ java GenConstants

# 编译代码:
$ javac -g MyConstantsTest.java

# 使用 javap 工具查看
$ javap -v MyConstantsTest.class

...
# 可以看到这里常量池的数量比2字节表示的最大值 65535 小一点点;
65530       1  9471 str9470   Ljava/lang/String;

```

不只是常量池有限制, 一个方法中的字节码指令的下标(索引数)也有限制;

我们修改 appendNLine 方法中生成的代码:


```java
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;

public class GenConstants {

    public static void main(String[] args) throws IOException {
        String className = "MyConstantsTest";
        String suffix = ".java";
        String path = "/Users/renfufei/GITHUB_ALL/DEMO_ALL/test-gen/";

        StringBuffer buffer = new StringBuffer();
        buffer.append("\n");
        buffer.append("public class ");
        buffer.append(className);
        buffer.append(" {").append("\n");
        buffer.append("\n");
        buffer.append("    public static void main(String[] args) {").append("\n");
        appendNLine(buffer, 13209);
        buffer.append("    }").append("\n");
        buffer.append("}").append("\n");
        //
        Path filePath = Path.of(path, className + suffix);
        Files.writeString(filePath, buffer.toString(), Charset.forName("UTF-8"));
    }

    private static void appendNLine(StringBuffer buffer, int lines) {
        for (int i = 0; i < lines; i++) {
            buffer.append("int num" + i + " = 1;");
            buffer.append("\n");
        }
    }
}

```

经过多次尝试, 找到了一个比较安全的临界值: 13209;

然后执行之前的测试流程;

使用 javap 查看反编译代码:

```
      65527: iconst_1
      65528: istore_w      13209
      65532: return

```

可以看到字节码指令的下标达到了 65532, 也是比 65535 小一点。

如果修改为 `appendNLine(buffer, 13210);`, 则会报错:

```
$ javac -g:none  MyConstantsTest.java
MyConstantsTest.java:4: 错误: 代码过长
    public static void main(String[] args) {
                       ^
1 个错误
```

其他类似的代码需要各位读者自己尝试执行。


## 简单总结

由于class文件规范的约定, 每个部分所使用的字节数有限制, 所以class文件支持的最大常量数, 最大指令条数都收到限制.

一般来说，在实际业务编程中很少会碰到这类限制。

这个有趣的知识点, 可以作为一个验证方式来辅助我们，加深对class文件和字节码的理解。


## 相关链接

- Java虚拟机指令集英文文档: [Chapter 6. The Java Virtual Machine Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)
