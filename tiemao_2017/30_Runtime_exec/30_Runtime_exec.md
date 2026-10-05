#### Execute an external program

#### Java-执行外部程序

>  Be sure to **read** this [Javaworld article](http://www.javaworld.com/javaworld/jw-12-2000/jw-1229-traps.html?page=1). It describes the various **pitfalls** related to the Runtime.exec() method.

>  关于 `Runtime.exec()` 的各种坑, 请参考 [Runtime.exec() 填坑详解](http://www.javaworld.com/article/2071275/core-java/when-runtime-exec---won-t.html)。

##### Using Runtime.exec()

##### 使用Runtime.exec()

This example will capture  the output (from stdio) of an external program.

下面的示例, 从 stdio 获取外部程序的输出结果。

```
package com.rgagnon.howto;

import java.io.*;

public class Exec {
  public static void main(String args[]) {
    try {
      String line;
      Process p = Runtime.getRuntime().exec("cmd /c dir");
      BufferedReader bri = new BufferedReader
        (new InputStreamReader(p.getInputStream()));
      BufferedReader bre = new BufferedReader
        (new InputStreamReader(p.getErrorStream()));
      while ((line = bri.readLine()) != null) {
        System.out.println(line);
      }
      bri.close();
      while ((line = bre.readLine()) != null) {
        System.out.println(line);
      }
      bre.close();
      p.waitFor();
      System.out.println("Done.");
    }
    catch (Exception err) {
      err.printStackTrace();
    }
  }
}

```



The next example, launch `CMD.EXE`, grab stdin/stdout and push to stdin command to be interpreted by the shell.

下一个例子中,启动`CMD.EXE`,抓取 stdin/stdout,并向 stdin 推送命令,交由 shell 解释。

```
    String line;
    OutputStream stdin = null;
    InputStream stderr = null;
    InputStream stdout = null;

      // launch EXE and grab stdin/stdout and stderr
      Process process = Runtime.getRuntime ().exec ("/folder/exec.exe");
      stdin = process.getOutputStream ();
      stderr = process.getErrorStream ();
      stdout = process.getInputStream ();

      // "write" the parms into stdin
      line = "param1" + "\n";
      stdin.write(line.getBytes() );
      stdin.flush();

      line = "param2" + "\n";
      stdin.write(line.getBytes() );
      stdin.flush();

      line = "param3" + "\n";
      stdin.write(line.getBytes() );
      stdin.flush();

      stdin.close();

      // clean up if any output in stdout
      BufferedReader brCleanUp =
        new BufferedReader (new InputStreamReader (stdout));
      while ((line = brCleanUp.readLine ()) != null) {
        //System.out.println ("[Stdout] " + line);
      }
      brCleanUp.close();

      // clean up if any output in stderr
      brCleanUp =
        new BufferedReader (new InputStreamReader (stderr));
      while ((line = brCleanUp.readLine ()) != null) {
        //System.out.println ("[Stderr] " + line);
      }
      brCleanUp.close();

```



##### Launch a Windows CMD (or BAT) file and retrieve the errorlevel or exitcode

##### 启动 Windows CMD(或 BAT)文件并获取 errorlevel 或 exitcode

```
// win xp
import java.io.*;
public class CmdExec {
  public static void main(String argv[]) {
    try {
      String line;
      Process p = Runtime.getRuntime().exec("test.cmd");
      p.waitFor();
      System.out.println(p.exitValue());
    }
    catch (Exception err) {
      err.printStackTrace();
    }
  }
}

```



test.cmd (set the errorlevel manually)

test.cmd(手动设置返回码)

```
@echo hello world
@exit 42

```



test.cmd (set the errorlevel 1 (problem detected)

test.cmd(设置返回码 1(发现问题))

```
@java -garbage

```



test.cmd (set the errorlevel 0 (execution Ok)

test.cmd(设置返回码 0(执行正常))

```
@java -version

```



##### Launch a Unix script

##### 启动Unix脚本

```
String[] cmd = {"/bin/sh", "-c", "ls > hello"};
Runtime.getRuntime().exec(cmd);

```



##### Using the ProcessBuilder

##### 使用ProcessBuilder

Since 1.5, the ProcessBuilder class provides more controls overs the process to be started. It's possible to set a starting directory.

从 1.5 开始,ProcessBuilder 类为要启动的进程提供了更多控制。还可以设置起始目录。

```
import java.io.*;
import java.util.*;

public class CmdProcessBuilder {
  public static void main(String args[])
     throws InterruptedException,IOException
  {
    List<String> command = new ArrayList<String>();
    command.add(System.getenv("windir") +"\\system32\\"+"tree.com");
    command.add("/A");

    ProcessBuilder builder = new ProcessBuilder(command);
    Map<String, String> environ = builder.environment();
    builder.directory(new File(System.getenv("temp")));

    System.out.println("Directory : " + System.getenv("temp") );
    final Process process = builder.start();
    InputStream is = process.getInputStream();
    InputStreamReader isr = new InputStreamReader(is);
    BufferedReader br = new BufferedReader(isr);
    String line;
    while ((line = br.readLine()) != null) {
      System.out.println(line);
    }
    System.out.println("Program terminated!");
  }
}
```



##### Windows rundll32 utility

##### Windows rundll32 工具

Windows File association

Windows文件关联

Any program using the Windows file association mechanism can be started with the rundll32 utility.

任何使用 Windows 文件关联机制的程序,都可以通过 rundll32 工具启动。

```
// "file" is the filename of the data file
//  ex. myresume.doc
//  to start Word if the doc extension is associated with it.
Runtime.getRuntime().exec
  ("rundll32 SHELL32.DLL,ShellExec_RunDLL " + file.getAbsolutePath());

```



See also this [HowTo](http://www.rgagnon.com/javadetails/java-0579.html) about the new Desktop API, the recommended solution (but you need JDK1.6).
See also this [one](http://www.rgagnon.com/javadetails/java-0071.html) to open the default browser.

另请参阅关于新 Desktop API 的这篇 [HowTo](http://www.rgagnon.com/javadetails/java-0579.html),这是推荐的解决方案(但需要 JDK1.6)。
另请参阅这篇 [文章](http://www.rgagnon.com/javadetails/java-0071.html) 来打开默认浏览器。

The following example **start a Dial-up connection** on the Win plateform :

下面的例子 **在 Win 平台上启动拨号连接** :

```
[Dialup.java]
public class Dialup {
  public static void main(String[] args) throws Exception {
    Process p = Runtime.getRuntime()
      .exec("rundll32.exe rnaui.dll,RnaDial MyConnection");
    p.waitFor();
    System.out.println("Done.");
  }
}

```



The "MyConnection" is the DUN and it's case sensitive.

“MyConnection” 是 DUN,并且区分大小写。

You still need to press ENTER to CONNECT, there is an option in the Connection properties to connect automatically.

你仍然需要按 ENTER 键来连接,连接属性中有一个选项可以自动连接。

On NT and W2K, rnaui.dll is not available. Use rasdial.exe instead.

在 NT 和 W2K 上,rnaui.dll 不可用,请改用 rasdial.exe。

```
rasdial "connection name"
rasdial "connection name" /d to drop
rasdial /? for more options

```



##### PDF (Windows only)

##### PDF(Windows)

```
public class ShowPDF {
  public static void main(String[] args) throws Exception {
    Process p =
      Runtime.getRuntime()
        .exec("rundll32 url.dll,FileProtocolHandler c:/pdf/mypdf.pdf");
    p.waitFor();
    System.out.println("Done.");
  }
}

```



##### PDF (Mac only)

##### PDF(Mac)

```
public class ShowPDF {
  public static void main (String[] args) throws Exception{
    Process p = Runtime.getRuntime().exec("open /Documents/mypdf.pdf");
  }
}

```



[More runddl32 examples](http://www.rgagnon.com/pbdetails/pb-0204.html)

[更多 runddl32 示例](http://www.rgagnon.com/pbdetails/pb-0204.html)

------

- - - - - -

##### Path to executable with spaces in them

##### 可执行文件路径中包含空格

You can include a path for the program to be executed. On the Win plateform, you need to put the path in quotes if **the path contains spaces**.

你可以为要执行的程序指定路径。在 Win 平台上,如果路径包含空格,就需要把路径放在引号中。

```
public class Test {
  public static void main(String[] args) throws Exception {
    Process p = Runtime.getRuntime().exec(
       "\"c:/program files/windows/notepad.exe\"");
    p.waitFor();
  }
}

```



If you need to **pass arguments**, it's safer to a String array especially if they contain spaces.

如果需要传递参数,使用字符串数组会更安全,尤其是当参数包含空格时。

```
String[] cmd = { "myProgram.exe", "-o=This is an option" };
Runtime.getRuntime().exec(cmd);

```



If using the start command and the path of the file to be started contains a space then you must specified a title to the start command.

如果使用 start 命令,并且要启动的文件路径包含空格,那么必须为 start 命令指定一个标题。

```
String fileName = "c:\\Applications\\My Documents\\test.doc";
String[] commands = {"cmd", "/c", "start", "\"DummyTitle\"",fileName};
Runtime.getRuntime().exec(commands);

```



------

- - - - - -

##### VBSCRIPT

##### VBSCRIPT

```
// Win9x
Runtime.getRuntime().exec("start myscript.vbs");

// WinNT
Runtime.getRuntime().exec("cmd /c start myscript.vbs");

or

// with a visible console
Runtime.getRuntime().exec("cscript myscript.vbs");

// with no visible console
Runtime.getRuntime().exec("wscript myscript.vbs");

```



##### HTML Help (Windows only)

##### HTML帮助(Windows)

```
Runtime.getRuntime().exec("hh.exe myhelpfile.chm");

```



##### Start Excel

##### 启动Excel

```
import java.io.IOException;

class StartExcel {
    public static void main(String args[])
        throws IOException
    {
        Runtime.getRuntime().exec("cmd /c start excel.exe");
    }
}
```



To load a worksheet

加载一个工作表

```
import java.io.IOException;

class StartExcel {
    public static void main(String args[])
        throws IOException
    {
        String fileName = "c:\\temp\\xls\\test2.xls";
        String[] commands = {"cmd", "/c", "start", "\"DummyTitle\"",fileName};
        Runtime.getRuntime().exec(commands);
    }
}

```



It's important to pass a dummy title  to the Windows start command where there is a possibility that the filename contains a space. It's a feature.

当文件名可能包含空格时,重要的是给 Windows start 命令传一个虚拟标题。这是它的一个特性。

##### Start a Windows application under another account

##### 以另一个账户启动 Windows 应用程序

You use the RUNAS command from the command line to start an application under another account (not available with XP Home edition). There are many switches that can enhance the behaviour of RUNAS. Typing "runas /?" from the command prompt gets you all the options.

可以从命令行使用 RUNAS 命令以另一个账户启动应用程序(XP 家庭版不支持)。有很多开关可以增强 RUNAS 的行为。在命令提示符下输入 “runas /?” 即可获得所有选项。

```
  String  commands [] = new String [] {
    "CMD.EXE",
    "/C",
    "RUNAS /profile  /savecred /user:"
    + "administrator"
    + " " + "regedit.exe"
  };

  Runtime.getRuntime().exec(commands);
```



`/SaveCred`  option allows you to save a password for that account and then reuse it later. For example, The command prompts for the password, and then Regedit runs. Next time you use the same command, there is no password prompt.

`/SaveCred` 选项允许你为该账户保存密码,以便以后复用。例如,命令会提示输入密码,然后运行 Regedit。下次使用相同的命令时,就不会再提示输入密码。

One potential problem is that when `/SaveCred` saves the credentials it saves it for whenever RUNAS invokes that user account. This can be a huge security risk so be careful using it!

一个潜在的问题是,当`/SaveCred`保存凭证后,只要 RUNAS 调用该用户账户都会使用保存的凭证。这是一个巨大的安全风险,所以要小心使用它!

RUNAS capability can be disabled by editing the Registry or by disabling the RUNAS or Secondary Logon Services. The appropriate registry key  is `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\policies\Explorer`, create a new DWORD value named `HideRunAsVerb` and assign it a value of 1 to disable Run as.

RUNAS 功能可以通过编辑注册表或禁用 RUNAS(二次登录)服务来禁用。相应的注册表键是 `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\policies\Explorer`,新建一个名为 `HideRunAsVerb` 的 DWORD 值,并将其设为 1,即可禁用“运行方式”。

RUNAS doesn't work when used from a Windows service.

在 Windows 服务中无法使用 RUNAS。

##### Windows : execute something in Program Files

##### Windows:在 Program Files 中执行程序

We want to execute the textpad editor located in  `C:\Program Files\TextPad 4`,  but without hard coding the path since it can be different for a localized version of Windows.

我们想执行位于 `C:\Program Files\TextPad 4` 的 TextPad 编辑器,但不硬编码路径,因为在本地化版本的 Windows 上该路径可能不同。

We simply extract to environnment variable called *`%programfiles%`* and build the complete path from there.

我们只需提取名为 *`%programfiles%`* 的环境变量,并据此构建完整的路径。

[JDK1.5]

(JDK1.5)

```
public class Exec {
    static String WIN_PROGRAMFILES = System.getenv("programfiles");
    static String FILE_SEPARATOR   = System.getProperty("file.separator");

    public static void main(String[] args) throws Exception {
     String[] commands =
       {"cmd.exe",
        "/c",
        WIN_PROGRAMFILES
        + FILE_SEPARATOR
        + "textpad 4"
        + FILE_SEPARATOR + "textpad.exe"};
     Runtime.getRuntime().exec(commands);
    }
}

```



NOTE : Prior Vista, System folders were localized on disk like  `C:\Program Files  -> C:\Archivos de programa`  on the Windows with the Spanish localization. Since Vista, System Folders always exists with the english name BUT when viewed through Explorer, the localized name is shown. See http://msmvps.com/blogs/carlosq/archive/2007/02/12/windows-vista-junctions-points-mui-and-localized-folder-names.aspx

注意:在 Vista 之前,系统文件夹在磁盘上是本地化的,比如在西班牙语本地化的 Windows 上 `C:\Program Files  -> C:\Archivos de programa`。从 Vista 开始,系统文件夹始终以英文名存在,但通过资源管理器查看时会显示本地化的名称。参见 http://msmvps.com/blogs/carlosq/archive/2007/02/12/windows-vista-junctions-points-mui-and-localized-folder-names.aspx

原文链接: <http://www.rgagnon.com/javadetails/java-0014.html>
