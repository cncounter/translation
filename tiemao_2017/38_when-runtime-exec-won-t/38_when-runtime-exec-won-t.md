# 当 Runtime.exec() 失灵时

### 引导自己避开与 Runtime.exec() 方法相关的陷阱

作为 Java 语言的一部分，`java.lang` 包被隐式导入到每个 Java 程序中。这个包中的陷阱经常出现，影响着大多数程序员。本月，我将讨论潜伏在 `Runtime.exec()` 方法中的陷阱。

## 陷阱 4：当 Runtime.exec() 失灵时

`java.lang.Runtime` 类提供了一个名为 `getRuntime()` 的静态方法，用于获取当前的 Java 运行时环境。这是获得 `Runtime` 对象引用的唯一途径。借助该引用，你可以调用 `Runtime` 类的 `exec()` 方法来运行外部程序。开发者经常调用这个方法来启动浏览器，以显示 HTML 格式的帮助页面。

`exec()` 命令有四个重载版本：

- `public Process exec(String command);`
- `public Process exec(String [] cmdArray);`
- `public Process exec(String command, String [] envp);`
- `public Process exec(String [] cmdArray, String [] envp);`

对于这些方法中的每一个，命令（以及可能的参数集）都会被传递给一个特定于操作系统的函数调用。随后这会创建一个特定于操作系统的进程（一个正在运行的程序），并向 Java 虚拟机返回一个 `Process` 类的引用。`Process` 类是一个抽象类，因为针对每种操作系统都存在一个特定的 `Process` 子类。

你可以向这些方法传入三种可能的输入参数：

1. 一个字符串，同时表示要执行的程序和该程序的所有参数
2. 一个字符串数组，将程序与其参数分开
3. 一个环境变量数组

以 `name=value` 的形式传入环境变量。如果你使用以单个字符串同时表示程序和参数的 `exec()` 版本，请注意，该字符串会由 `StringTokenizer` 类以空白字符作为分隔符进行解析。

#### 陷入 IllegalThreadStateException

与 `Runtime.exec()` 相关的第一个陷阱是 `IllegalThreadStateException`。对 API 最常见的首次测试，就是编写其最显而易见的方法。例如，要执行一个 Java 虚拟机外部的进程，我们使用 `exec()` 方法。要查看外部进程返回的值，我们使用 `Process` 类上的 `exitValue()` 方法。在第一个示例中，我们将尝试执行 Java 编译器（`javac.exe`）：

**清单 4.1 BadExecJavac.java**

```
import java.util.*;
import java.io.*;
public class BadExecJavac
{
    public static void main(String args[])
    {
        try
        {            
            Runtime rt = Runtime.getRuntime();
            Process proc = rt.exec("javac");
            int exitVal = proc.exitValue();
            System.out.println("Process exitValue: " + exitVal);
        } catch (Throwable t)
          {
            t.printStackTrace();
          }
    }
}
```

运行 `BadExecJavac` 会产生：

```
E:\classes\com\javaworld\jpitfalls\article2>java BadExecJavac
java.lang.IllegalThreadStateException: process has not exited
        at java.lang.Win32Process.exitValue(Native Method)
        at BadExecJavac.main(BadExecJavac.java:13)
```

如果外部进程尚未完成，`exitValue()` 方法会抛出 `IllegalThreadStateException`；这就是该程序失败的原因。虽然文档说明了这一事实，但为什么这个方法不能等到它能给出有效答案时再返回呢？

更仔细地查看 `Process` 类中可用的方法，会发现有一个 `waitFor()` 方法，它的作用正是如此。事实上，`waitFor()` 也会返回退出值，这意味着你不会把 `exitValue()` 和 `waitFor()` 结合使用，而是二选一。唯一可能用 `exitValue()` 而不是 `waitFor()` 的场景，是你不想让程序阻塞在等待一个可能永远无法完成的对外部进程上。与其使用 `waitFor()` 方法，我更倾向于向 `exitValue()` 方法传入一个名为 `waitFor` 的布尔参数，来决定当前线程是否应该等待。用布尔参数会更有益，因为 `exitValue()` 对这个方法而言是更贴切的名称，而且没必要让两个方法在不同条件下执行相同的功能。这种简单的条件区分正是输入参数该管的事。

因此，要避开这个陷阱，要么捕获 `IllegalThreadStateException`，要么等待进程完成。

现在，让我们修复清单 4.1 中的问题，等待进程完成。在清单 4.2 中，程序再次尝试执行 `javac.exe`，然后等待外部进程完成：

**清单 4.2 BadExecJavac2.java**

```
import java.util.*;
import java.io.*;
public class BadExecJavac2
{
    public static void main(String args[])
    {
        try
        {            
            Runtime rt = Runtime.getRuntime();
            Process proc = rt.exec("javac");
            int exitVal = proc.waitFor();
            System.out.println("Process exitValue: " + exitVal);
        } catch (Throwable t)
          {
            t.printStackTrace();
          }
    }
}
```

遗憾的是，运行 `BadExecJavac2` 没有任何输出。程序挂起，永远无法完成。为什么 `javac` 进程永远不结束呢？

#### 为什么 Runtime.exec() 会挂起

JDK 的 Javadoc 文档给出了这个问题的答案：

> 因为某些原生平台为标准输入和输出流提供的缓冲区大小有限，如果未能及时写入子进程的输入流或读取其输出流，可能会导致子进程阻塞，甚至死锁。

这是否只是那句常被引用的忠告——"读读那本该死的手册(RTFM)"——所暗示的程序员不读文档？答案是部分正确。在这种情况下，读 Javadoc 只能让你走到一半；它解释了需要处理与外部进程之间的流，却没有告诉你该怎么做。

这里还有另一个因素在起作用，从新闻组中大量关于这个 API 的编程问题和误解就可以看出：尽管 `Runtime.exec()` 和 Process API 看似极其简单，但这种简单是骗人的，因为对 API 简单（或显而易见）的用法很容易出错。这里给 API 设计者的教训是：把简单的 API 留给简单的操作。容易涉及复杂性、且依赖特定平台的操作，应准确地反映其领域。抽象是有可能被推得过远的。`JConfig` 库就提供了一个更完整的 API 示例，用来处理文件和进程操作（更多信息请参阅下面的[资源](http://www.javaworld.com/article/2071275/core-java/when-runtime-exec---won-t.html#resources)）。

现在，让我们遵循 JDK 文档，处理 `javac` 进程的输出。当你不带任何参数运行 `javac` 时，它会输出一组用法说明，描述如何运行该程序以及所有可用程序选项的含义。既然知道这些内容会输出到 `stderr` 流，你就可以轻松地编写一个程序，在等待进程退出之前先排空该流。清单 4.3 完成了这项任务。虽然这种做法可行，但它不是一个好的通用解决方案。因此，清单 4.3 的程序被命名为 `MediocreExecJavac`——它只提供了一个平庸的解决方案。更好的方案会同时排空标准错误流和标准输出流。而最佳的方案会同时排空这两个流（稍后我会演示）。

**清单 4.3 MediocreExecJavac.java**

```
import java.util.*;
import java.io.*;
public class MediocreExecJavac
{
    public static void main(String args[])
    {
        try
        {            
            Runtime rt = Runtime.getRuntime();
            Process proc = rt.exec("javac");
            InputStream stderr = proc.getErrorStream();
            InputStreamReader isr = new InputStreamReader(stderr);
            BufferedReader br = new BufferedReader(isr);
            String line = null;
            System.out.println("<ERROR>");
            while ( (line = br.readLine()) != null)
                System.out.println(line);
            System.out.println("</ERROR>");
            int exitVal = proc.waitFor();
            System.out.println("Process exitValue: " + exitVal);
        } catch (Throwable t)
          {
            t.printStackTrace();
          }
    }
}
```

运行 `MediocreExecJavac` 会生成：

```
E:\classes\com\javaworld\jpitfalls\article2>java MediocreExecJavac
<ERROR>
Usage: javac <options> <source files>
where <options> includes:
  -g                     Generate all debugging info
  -g:none                Generate no debugging info
  -g:{lines,vars,source} Generate only some debugging info
  -O                     Optimize; may hinder debugging or enlarge class files
  -nowarn                Generate no warnings
  -verbose               Output messages about what the compiler is doing
  -deprecation           Output source locations where deprecated APIs are used
  -classpath <path>      Specify where to find user class files
  -sourcepath <path>     Specify where to find input source files
  -bootclasspath <path>  Override location of bootstrap class files
  -extdirs <dirs>        Override location of installed extensions
  -d <directory>         Specify where to place generated class files
  -encoding <encoding>   Specify character encoding used by source files
  -target <release>      Generate class files for specific VM version
</ERROR>
Process exitValue: 2
```

于是，`MediocreExecJavac` 能工作了，并产生退出值 `2`。通常，退出值 `0` 表示成功；任何非零值都表示出错。这些退出值的含义取决于具体的操作系统。值为 `2` 的 Win32 错误是"文件未找到(file not found)"错误。这是合理的，因为 `javac` 期望我们在程序后面跟上要编译的源代码文件。

因此，要规避第二个陷阱——在 `Runtime.exec()` 中永远挂起——如果你启动的程序会产生输出或期望输入，请确保处理其输入流和输出流。

#### 假设命令就是一个可执行程序

在 Windows 操作系统下，许多新手程序员在尝试用 `Runtime.exec()` 执行 `dir`、`copy` 这类非可执行命令时会踩坑。随后，他们就会遇到 `Runtime.exec()` 的第三个陷阱。清单 4.4 恰好演示了这一点：

**清单 4.4 BadExecWinDir.java**

```
import java.util.*;
import java.io.*;
public class BadExecWinDir
{
    public static void main(String args[])
    {
        try
        {            
            Runtime rt = Runtime.getRuntime();
            Process proc = rt.exec("dir");
            InputStream stdin = proc.getInputStream();
            InputStreamReader isr = new InputStreamReader(stdin);
            BufferedReader br = new BufferedReader(isr);
            String line = null;
            System.out.println("<OUTPUT>");
            while ( (line = br.readLine()) != null)
                System.out.println(line);
            System.out.println("</OUTPUT>");
            int exitVal = proc.waitFor();            
            System.out.println("Process exitValue: " + exitVal);
        } catch (Throwable t)
          {
            t.printStackTrace();
          }
    }
}
```

运行 `BadExecWinDir` 会产生：

```
E:\classes\com\javaworld\jpitfalls\article2>java BadExecWinDir
java.io.IOException: CreateProcess: dir error=2
        at java.lang.Win32Process.create(Native Method)
        at java.lang.Win32Process.<init>(Unknown Source)
        at java.lang.Runtime.execInternal(Native Method)
        at java.lang.Runtime.exec(Unknown Source)
        at java.lang.Runtime.exec(Unknown Source)
        at java.lang.Runtime.exec(Unknown Source)
        at java.lang.Runtime.exec(Unknown Source)
        at BadExecWinDir.main(BadExecWinDir.java:12)
```

如前所述，错误值 `2` 表示"文件未找到"，在这里意味着找不到名为 `dir.exe` 的可执行文件。这是因为 dir 命令是 Windows 命令解释器的一部分，而不是一个单独的可执行文件。要运行 Windows 命令解释器，可执行 `command.com` 或 `cmd.exe`，具体取决于你所使用的 Windows 操作系统。清单 4.5 运行一个 Windows 命令解释器副本，然后执行用户提供的命令（例如 `dir`）。

**清单 4.5 GoodWindowsExec.java**

```
import java.util.*;
import java.io.*;
class StreamGobbler extends Thread
{
    InputStream is;
    String type;
    
    StreamGobbler(InputStream is, String type)
    {
        this.is = is;
        this.type = type;
    }
    
    public void run()
    {
        try
        {
            InputStreamReader isr = new InputStreamReader(is);
            BufferedReader br = new BufferedReader(isr);
            String line=null;
            while ( (line = br.readLine()) != null)
                System.out.println(type + ">" + line);    
            } catch (IOException ioe)
              {
                ioe.printStackTrace();  
              }
    }
}
public class GoodWindowsExec
{
    public static void main(String args[])
    {
        if (args.length < 1)
        {
            System.out.println("USAGE: java GoodWindowsExec <cmd>");
            System.exit(1);
        }
        
        try
        {            
            String osName = System.getProperty("os.name" );
            String[] cmd = new String[3];
            if( osName.equals( "Windows NT" ) )
            {
                cmd[0] = "cmd.exe" ;
                cmd[1] = "/C" ;
                cmd[2] = args[0];
            }
            else if( osName.equals( "Windows 95" ) )
            {
                cmd[0] = "command.com" ;
                cmd[1] = "/C" ;
                cmd[2] = args[0];
            }
            
            Runtime rt = Runtime.getRuntime();
            System.out.println("Execing " + cmd[0] + " " + cmd[1] 
                               + " " + cmd[2]);
            Process proc = rt.exec(cmd);
            // any error message?
            StreamGobbler errorGobbler = new 
                StreamGobbler(proc.getErrorStream(), "ERROR");            
            
            // any output?
            StreamGobbler outputGobbler = new 
                StreamGobbler(proc.getInputStream(), "OUTPUT");
                
            // kick them off
            errorGobbler.start();
            outputGobbler.start();
                                    
            // any error???
            int exitVal = proc.waitFor();
            System.out.println("ExitValue: " + exitVal);        
        } catch (Throwable t)
          {
            t.printStackTrace();
          }
    }
}
```

用 `dir` 命令运行 `GoodWindowsExec` 会生成：

```
E:\classes\com\javaworld\jpitfalls\article2>java GoodWindowsExec "dir *.java"
Execing cmd.exe /C dir *.java
OUTPUT> Volume in drive E has no label.
OUTPUT> Volume Serial Number is 5C5F-0CC9
OUTPUT>
OUTPUT> Directory of E:\classes\com\javaworld\jpitfalls\article2
OUTPUT>
OUTPUT>10/23/00  09:01p                   805 BadExecBrowser.java
OUTPUT>10/22/00  09:35a                   770 BadExecBrowser1.java
OUTPUT>10/24/00  08:45p                   488 BadExecJavac.java
OUTPUT>10/24/00  08:46p                   519 BadExecJavac2.java
OUTPUT>10/24/00  09:13p                   930 BadExecWinDir.java
OUTPUT>10/22/00  09:21a                 2,282 BadURLPost.java
OUTPUT>10/22/00  09:20a                 2,273 BadURLPost1.java
... (some output omitted for brevity)
OUTPUT>10/12/00  09:29p                   151 SuperFrame.java
OUTPUT>10/24/00  09:23p                 1,814 TestExec.java
OUTPUT>10/09/00  05:47p                23,543 TestStringReplace.java
OUTPUT>10/12/00  08:55p                   228 TopLevel.java
OUTPUT>              22 File(s)         46,661 bytes
OUTPUT>                         19,678,420,992 bytes free
ExitValue: 0
```

用任何已关联的文档类型运行 `GoodWindowsExec`，都会启动与该文档类型关联的应用程序。例如，要启动 Microsoft Word 显示一个 Word 文档（即扩展名为 `.doc` 的文件），请输入：

```
>java GoodWindowsExec "yourdoc.doc"
```

请注意，`GoodWindowsExec` 使用 `os.name` 系统属性来判断你正在运行哪个 Windows 操作系统——从而确定合适的命令解释器。执行命令解释器之后，用 `StreamGobbler` 类处理标准错误流和标准输入流。`StreamGobbler` 会在一个单独的线程中排空传入它的任何流。当它把刚读到的行打印到控制台时，该类用一个简单的 `String` 类型来标注它所排空的是哪个流。

因此，要避开与 `Runtime.exec()` 相关的第三个陷阱，不要想当然地认为一个命令就是可执行程序；要弄清楚你执行的是独立的可执行文件，还是由解释器执行的命令。在本节末尾，我会演示一个简单的命令行工具，帮助你进行这种分析。

需要注意的一点是，用于获取进程输出流的方法叫做 `getInputStream()`。要记住的是，这个 API 是从 Java 程序的角度、而不是从外部进程的角度来看待事物的。因此，外部程序的输出就是 Java 程序的输入。同样的逻辑也适用于外部程序的输入流——它对 Java 程序来说是一个输出流。

#### Runtime.exec() 不是命令行

关于 `Runtime.exec()` 的最后一个陷阱，是错误地以为 `exec()` 能接受你的命令行（或 shell）所能接受的任何 `String`。`Runtime.exec()` 的局限要大得多，而且不跨平台。这个陷阱源于用户试图像命令行那样，用 `exec()` 方法接受单个 `String`。这种混淆可能是因为 `command` 正是 `exec()` 方法的参数名。于是，程序员错误地把 command 这个参数与自己在命令行上能输入的任何东西联系起来，而不是把它与单个程序及其参数联系起来。在下面的清单 4.6 中，用户试图在一次 `exec()` 调用中执行命令并重定向其输出：

**清单 4.6 BadWinRedirect.java**

```
import java.util.*;
import java.io.*;
// StreamGobbler omitted for brevity
public class BadWinRedirect
{
    public static void main(String args[])
    {
        try
        {            
            Runtime rt = Runtime.getRuntime();
            Process proc = rt.exec("java jecho 'Hello World' > test.txt");
            // any error message?
            StreamGobbler errorGobbler = new 
                StreamGobbler(proc.getErrorStream(), "ERROR");            
            
            // any output?
            StreamGobbler outputGobbler = new 
                StreamGobbler(proc.getInputStream(), "OUTPUT");
                
            // kick them off
            errorGobbler.start();
            outputGobbler.start();
                                    
            // any error???
            int exitVal = proc.waitFor();
            System.out.println("ExitValue: " + exitVal);        
        } catch (Throwable t)
          {
            t.printStackTrace();
          }
    }
}
```

运行 `BadWinRedirect` 会产生：

```
E:\classes\com\javaworld\jpitfalls\article2>java BadWinRedirect
OUTPUT>'Hello World' > test.txt
ExitValue: 0
```

`BadWinRedirect` 程序试图把 echo 程序的一个简单 Java 版本（即 `jecho`）的输出重定向到文件 `test.txt` 中。然而，我们发现文件 `test.txt` 并不存在。`jecho` 程序只是接收它的命令行参数并把它们写入标准输出流。（你可以在[资源](http://www.javaworld.com/article/2071275/core-java/when-runtime-exec---won-t.html?page=2#resources)中提供的可下载源代码里找到 `jecho` 的源码。）在清单 4.6 中，用户以为可以像在 DOS 命令行上那样把标准输出重定向到一个文件。然而，通过这种做法并不能实现重定向。这里错误的假设是：`exec()` 方法像 shell 解释器一样工作；但它并非如此。`exec()` 执行的是单个可执行文件（一个程序或脚本）。如果你想处理流，把它重定向或通过管道传给另一个程序，你必须用 `java.io` 包以编程方式来做。清单 4.7 正确地把 `jecho` 进程的标准输出流重定向到一个文件中。

**清单 4.7 GoodWinRedirect.java**

```
import java.util.*;
import java.io.*;
class StreamGobbler extends Thread
{
    InputStream is;
    String type;
    OutputStream os;
    
    StreamGobbler(InputStream is, String type)
    {
        this(is, type, null);
    }
    StreamGobbler(InputStream is, String type, OutputStream redirect)
    {
        this.is = is;
        this.type = type;
        this.os = redirect;
    }
    
    public void run()
    {
        try
        {
            PrintWriter pw = null;
            if (os != null)
                pw = new PrintWriter(os);
                
            InputStreamReader isr = new InputStreamReader(is);
            BufferedReader br = new BufferedReader(isr);
            String line=null;
            while ( (line = br.readLine()) != null)
            {
                if (pw != null)
                    pw.println(line);
                System.out.println(type + ">" + line);    
            }
            if (pw != null)
                pw.flush();
        } catch (IOException ioe)
            {
            ioe.printStackTrace();  
            }
    }
}
public class GoodWinRedirect
{
    public static void main(String args[])
    {
        if (args.length < 1)
        {
            System.out.println("USAGE java GoodWinRedirect <outputfile>");
            System.exit(1);
        }
        
        try
        {            
            FileOutputStream fos = new FileOutputStream(args[0]);
            Runtime rt = Runtime.getRuntime();
            Process proc = rt.exec("java jecho 'Hello World'");
            // any error message?
            StreamGobbler errorGobbler = new 
                StreamGobbler(proc.getErrorStream(), "ERROR");            
            
            // any output?
            StreamGobbler outputGobbler = new 
                StreamGobbler(proc.getInputStream(), "OUTPUT", fos);
                
            // kick them off
            errorGobbler.start();
            outputGobbler.start();
                                    
            // any error???
            int exitVal = proc.waitFor();
            System.out.println("ExitValue: " + exitVal);
            fos.flush();
            fos.close();        
        } catch (Throwable t)
          {
            t.printStackTrace();
          }
    }
}
```

运行 `GoodWinRedirect` 会产生：

```
E:\classes\com\javaworld\jpitfalls\article2>java GoodWinRedirect test.txt
OUTPUT>'Hello World'
ExitValue: 0
```

运行 `GoodWinRedirect` 之后，`test.txt` 确实存在了。这个陷阱的解决办法，就是通过把外部进程的标准输出流与 `Runtime.exec()` 方法分开处理来控制重定向。我们创建一个单独的 `OutputStream`，读入要重定向到的文件名，打开该文件，然后把我从衍生的子进程标准输出接收到的输出写入文件。清单 4.7 通过给 `StreamGobbler` 类添加一个新构造函数来完成任务。新构造函数接受三个参数：要排空的输入流、标注我们正在排空的流的类型 `String`，以及我们把输入重定向到的输出流。这个新版本的 `StreamGobbler` 不会破坏任何此前使用它的代码，因为我们没有改动现有的公共 API——只是扩展了它。

由于 `Runtime.exec()` 的参数依操作系统而定，应使用的正确命令会因操作系统而异。因此，在最终确定 `Runtime.exec()` 的参数并编写代码之前，请先快速测试这些参数。清单 4.8 是一个简单的命令行实用工具，可以让你做到这一点。

这里有一个有用的练习：试着修改 `TestExec`，把标准输入或标准输出重定向到一个文件。在 Windows 95 或 Windows 98 上执行 `javac` 编译器时，这能解决错误消息从有限的命令行缓冲区顶部滚掉的问题。

**清单 4.8 TestExec.java**

```
import java.util.*;
import java.io.*;
// class StreamGobbler omitted for brevity
public class TestExec
{
    public static void main(String args[])
    {
        if (args.length < 1)
        {
            System.out.println("USAGE: java TestExec \"cmd\"");
            System.exit(1);
        }
        
        try
        {
            String cmd = args[0];
            Runtime rt = Runtime.getRuntime();
            Process proc = rt.exec(cmd);
            
            // any error message?
            StreamGobbler errorGobbler = new 
                StreamGobbler(proc.getErrorStream(), "ERR");            
            
            // any output?
            StreamGobbler outputGobbler = new 
                StreamGobbler(proc.getInputStream(), "OUT");
                
            // kick them off
            errorGobbler.start();
            outputGobbler.start();
                                    
            // any error???
            int exitVal = proc.waitFor();
            System.out.println("ExitValue: " + exitVal);
        } catch (Throwable t)
          {
            t.printStackTrace();
          }
    }
}
```

运行 `TestExec` 启动 Netscape 浏览器并加载 Java 帮助文档，会产生：

```
E:\classes\com\javaworld\jpitfalls\article2>java TestExec "e:\java\docs\index.html"
java.io.IOException: CreateProcess: e:\java\docs\index.html error=193
        at java.lang.Win32Process.create(Native Method)
        at java.lang.Win32Process.<init>(Unknown Source)
        at java.lang.Runtime.execInternal(Native Method)
        at java.lang.Runtime.exec(Unknown Source)
        at java.lang.Runtime.exec(Unknown Source)
        at java.lang.Runtime.exec(Unknown Source)
        at java.lang.Runtime.exec(Unknown Source)
        at TestExec.main(TestExec.java:45)
```

我们的第一次测试失败了，错误码为 `193`。值 193 对应的 Win32 错误是"不是有效的 Win32 应用程序(not a valid Win32 application)"。这个错误告诉我们，不存在指向关联应用程序（例如 Netscape）的路径，并且进程无法在没有关联应用程序的情况下运行 HTML 文件。

因此，我们再次尝试该测试，这次给它一个指向 Netscape 的完整路径。（或者，我们也可以把 Netscape 加入 `PATH` 环境变量。）第二次运行 `TestExec` 会产生：

```
E:\classes\com\javaworld\jpitfalls\article2>java TestExec 
"e:\program files\netscape\program\netscape.exe e:\java\docs\index.html"
ExitValue: 0
```

成功了！Netscape 浏览器启动了，随后加载了 Java 帮助文档。

对 `TestExec` 的另一项改进是加入一个命令行开关，用于从标准输入接收输入。然后你就可以用 `Process.getOutputStream()` 方法把输入传递给衍生的外部程序。

总而言之，遵循以下经验法则来避开 `Runtime.exec()` 中的陷阱：

1. 在外部进程退出之前，你无法获得它的退出状态
2. 你必须立即处理衍生的外部进程的输入流、输出流和错误流
3. 你必须用 `Runtime.exec()` 来执行程序
4. 你不能像命令行那样使用 `Runtime.exec()`

## 对陷阱 3 的更正

在上一期专栏对陷阱 3（"生成文本或 XML 消息时不要混用 float 和 double"）的讨论中，我错误地断言：把一个十进制数从 float 转型为 double 后，其字符串表示不同，这是一个 bug。虽然这确实是一个陷阱，但它的原因并不是 bug，而是所涉及的那些十进制数——100.28 和 91.09——无法在二进制中精确表示。我要感谢 Thomas Okken 以及其他帮我纠正的人。如果你喜欢讨论数值方法的细节，可以[给 Thomas 发邮件](mailto:TOkken@refco.com)。



我把数值方法课上所学忘得一干二净，再加上 bug parade 上大量的 bug 报告，以及浮点数和双精度数在打印时的自动舍入（但在把 float 转型为 double 之后并不会舍入），这些都把我搞糊涂了。我为给读过那篇文章的人——尤其是 Java 新手——造成的困惑道歉。我给出这个问题的两个更好的解决方案：

第一个可能的解决方案是始终用 `NumberFormat` 显式指定所需的舍入方式。在我的场景中，我用 float 和 double 来表示美元和美分；因此我只需要两位有效数字。清单 C3.1 演示了如何用 `NumberFormat` 类指定最多两位小数。

**清单 C3.1 FormatNumbers.java**

```
import java.text.*;
public class FormatNumbers
{
    public static void main(String [] args)
    {
        try
        {
            NumberFormat fmt = NumberFormat.getInstance();
            fmt.setMaximumFractionDigits(2);
            float f = 100.28f;
            System.out.println("As a float        : " + f);
            double d = f;
            System.out.println("Cast to a double  : " + d);
            System.out.println("Using NumberFormat: " + fmt.format(d));            
        } catch (Throwable t)
          {
            t.printStackTrace();
          }          
    }
}
```

运行 `FormatNumbers` 程序时，它会产生：

```
E:\classes\com\javaworld\jpitfalls\article2>java FormatNumbers
As a float        : 100.28
Cast to a double  : 100.27999877929688
Using NumberFormat: 100.28
```

如你所见——无论我们是否把 float 转型为 double——当我们指定所需的位数时，它都能正确地舍入到该精度——即使这个数在二进制中是无限循环的。要规避这个陷阱，请在把 double 和 float 转换为 `String` 时控制其格式化。

第二个更简单的解决方案是不用 float 来表示美分。整数（便士的数量）可以表示美分，合法范围是 0 到 99。你可以在修改器(mutator)方法中检查范围。

## 下一次

在下一期专栏中，我将介绍另一个来自 `java.lang` 的陷阱，以及隐藏在 `java.net` 和 `Swing` 包中的两个陷阱。如果你知道任何浪费过你的时间、让你沮丧的 Java 陷阱，请[把它们发邮件给我](http://www.javaworld.com/javaworld/feedback/jw-feedback-form.html)，这样我们就能让别人免于同样的遭遇。

Michael C. Daconta 是 McDonald Bradley 公司的 Web 与技术服务总监，在那里他主持培训研讨会，并用 Java、JavaScript 和 XML 开发高级系统。在过去 15 年里，Daconta 担任过几乎所有主要的开发职位，包括首席科学家、技术总监、首席开发、团队负责人、系统分析师和程序员。他是 Sun 认证的 Java 程序员，也是《Java Pitfalls》（John Wiley & Sons，2000）、《Java 2 and JavaScript for C and C++ Programmers》（John Wiley & Sons，1999）和《XML Development with Java 2》（Sams Publishing，2000）的合著者。此外，他还是《C++ Pointers and Dynamic Memory Management》（John Wiley & Sons，1995）的作者。

[了解更多相关内容]()[下载本文所有示例的源代码]()[http://www.javaworld.com/jw-12-2000/traps/jw-1229-traps.zip](http://www.javaworld.com/jw-12-2000/traps/jw-1229-traps.zip)*Java Pitfalls, Time Saving Solutions, and Workarounds to Improve Programs*, Michael C. Daconta, Eric Monk, J. Paul Keller, Keith Bohnenberger (John Wiley & Sons, 2000)
[http://www.amazon.com/exec/obidos/ASIN/0471361747/javaworld](http://www.amazon.com/exec/obidos/ASIN/0471361747/javaworld)查看 `JConfig` 库，或下载以进行评估
[http://tolstoy.com/samizdat/jconfig.html](http://tolstoy.com/samizdat/jconfig.html)阅读 Michael Daconta 之前的 **Java Traps** 专栏"Steer Clear of Java Pitfalls"（*JavaWorld*，2000 年 9 月 22 日）
[http://www.javaworld.com/javaworld/jw-09-2000/jw-0922-pitfalls.html](http://www.javaworld.com/javaworld/jw-09-2000/jw-0922-pitfalls.html)浏览 *JavaWorld* 的 **Topical Index**
[http://www.javaworld.com/javaworld/topicalindex/jw-ti-index.html](http://www.javaworld.com/javaworld/topicalindex/jw-ti-index.html)



原文链接: <http://www.javaworld.com/article/2071275/core-java/when-runtime-exec---won-t.html>

