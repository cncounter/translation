# class文件中常量池条目数量与方法指令数限制


实际生成大量代码的测试类 `GenConstants.java` :

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
        appendNLine(buffer, 65536);
        buffer.append("    }").append("\n");
        buffer.append("}").append("\n");
        //
        Path filePath = Path.of(path, className + suffix);
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

执行测试:

```
$ java -version
java 11.0.6 2020-01-14 LTS
Java(TM) SE Runtime Environment 18.9 (build 11.0.6+8-LTS)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.6+8-LTS, mixed mode)

javac -version
javac 11.0.6

$ javac -g GenConstants.java
$ java GenConstants
$ javac -g MyConstantsTest.java

$ javac -g MyConstantsTest.java
MyConstantsTest.java:4: 错误: 代码过长
    public static void main(String[] args) {
                       ^
MyConstantsTest.java:2: 错误: 常量过多
public class MyConstantsTest {
       ^
2 个错误
```

可以看到, 常量超过限制了。

我之前在Idea编辑器工作目录中生成并打开 MyConstantsTest.java 文件, 直接卡死并最终导致了内存溢出。

class文件中我, 变量名可能会占用1个常量池槽位, String 值也会占用一个常量池槽位。

如果生成的变量数减小呢?

```java
appendNLine(buffer, 10000);
```

报的错误是:

```
$ javac MyConstantsTest.java
$ javac -g MyConstantsTest.java

MyConstantsTest.java:4: 错误: 代码过长
    public static void main(String[] args) {
                       ^
1 个错误
```

使用二分法, 逐渐降低这个生成的数量, 最终找到一个安全的数字是 9471;

```java
appendNLine(buffer, 9471);
```

然后继续执行:

```sh
# 生成代码:
$ javac -g GenConstants.java
$ java GenConstants
$ javac -g MyConstantsTest.java


# 编译代码
$ javac -g MyConstantsTest.java

# 使用javap工具查看
$ javap -v MyConstantsTest.class

...
# 可以看到这里常量池的数量比2字节表示的最大值 65535 小一点点;
65530       1  9471 str9470   Ljava/lang/String;

```

不只是常量池有限制, 一个方法中的字节码指令下标数量也有限制;


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

然后执行;

```
      65527: iconst_1
      65528: istore_w      13209
      65532: return

```


如果修改为 `appendNLine(buffer, 13210);`, 则会报错:

```
$ javac -g:none  MyConstantsTest.java
MyConstantsTest.java:4: 错误: 代码过长
    public static void main(String[] args) {
                       ^
1 个错误
```

其他类似的代码也可以执行。
