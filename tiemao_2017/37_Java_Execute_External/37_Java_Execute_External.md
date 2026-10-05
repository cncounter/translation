#### Execute an external program

#### Java调用外部程序

Be sure to **read** this [Javaworld article](http://www.javaworld.com/javaworld/jw-12-2000/jw-1229-traps.html?page=1). It describes the various **pitfalls** related to the Runtime.exec() method.

基础知识请参考 Javaworld 的文章：[Runtime.exec() 的错误用法集锦](http://www.javaworld.com/article/2071275/core-java/when-runtime-exec---won-t.html)。它描述了与 Runtime.exec() 方法相关的各种**陷阱**。

##### Using Runtime.exec()

##### 使用Runtime.exec()

This example will

这个例子将

capture the output (from stdio) of an external program.

捕获一个外部程序的输出（来自 stdio）。

```
import java.io.*;
import java.util.Arrays;

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
            Arrays.asList();

            bre.close();
            p.waitFor();
            System.out.println("Done.");
        } catch (Exception err) {
            err.printStackTrace();
        }
    }
}
```



The next example, launch CMD.EXE, grab stdin/stdout and push to stdin command to be interpreted by the shell.

下一个例子中，启动 CMD.EXE，抓取 stdin 和 stdout，并向 stdin 推入命令交由 shell 解释。

```
import java.io.*;

public class Exec2 {
    public static void main(String args[]) {
        try {
            String line;
            OutputStream stdin = null;
            InputStream stderr = null;
            InputStream stdout = null;

            // launch EXE and grab stdin/stdout and stderr
            Process process = Runtime.getRuntime().exec("/folder/exec.exe");
            stdin = process.getOutputStream();
            stderr = process.getErrorStream();
            stdout = process.getInputStream();

            // "write" the parms into stdin
            line = "param1" + "\n";
            stdin.write(line.getBytes());
            stdin.flush();

            line = "param2" + "\n";
            stdin.write(line.getBytes());
            stdin.flush();

            line = "param3" + "\n";
            stdin.write(line.getBytes());
            stdin.flush();

            stdin.close();

            // clean up if any output in stdout
            BufferedReader brCleanUp =
                    new BufferedReader(new InputStreamReader(stdout));
            while ((line = brCleanUp.readLine()) != null) {
                //System.out.println ("[Stdout] " + line);
            }
            brCleanUp.close();

            // clean up if any output in stderr
            brCleanUp =
                    new BufferedReader(new InputStreamReader(stderr));
            while ((line = brCleanUp.readLine()) != null) {
                //System.out.println ("[Stderr] " + line);
            }
            brCleanUp.close();
        } catch (Exception err) {
            err.printStackTrace();
        }
    }
}
```



##### Launch a Windows CMD (or BAT) file and retrieve the errorlevel or exitcode

##### 启动 Windows CMD（或 BAT）文件并获取 errorlevel 或 exitcode

```
// win xp
public class CmdExec {
    public static void main(String argv[]) {
        try {
            String line;
            Process p = Runtime.getRuntime().exec("E:\\Test_Repo\\test.cmd");
            p.waitFor();
            System.out.println(p.exitValue());
        } catch (Exception err) {
            err.printStackTrace();
        }
    }
}
```



test.cmd (set the errorlevel manually)

test.cmd（手动设置 errorlevel）

```
@echo hello world
@exit 42
```



test.cmd (set the errorlevel 1 (problem detected)

test.cmd（将 errorlevel 设为 1（检测到问题））

```
@java -garbage
```



test.cmd (set the errorlevel 0 (execution Ok)

test.cmd（将 errorlevel 设为 0（执行成功））

```
@java -version
```



##### Launch a Unix script

##### 启动Unix脚本

```
public class ExecUnix {
    public static void main(String args[]) {
        try {
            String[] cmd = {"/bin/sh", "-c", "ls > hello"};
            Runtime.getRuntime().exec(cmd);
        } catch (Exception err) {
            err.printStackTrace();
        }
    }
}
```



##### Using the ProcessBuilder

##### 使用ProcessBuilder

Since 1.5, the ProcessBuilder class provides more controls overs the process to be started. It's possible to set a starting directory.

自 1.5 起，ProcessBuilder 类对将要启动的进程提供了更多的控制。可以设置一个起始目录。

```
import java.io.*;
import java.util.*;

public class CmdProcessBuilder {
    public static void main(String args[])
            throws InterruptedException, IOException {
        List<String> command = new ArrayList<String>();
        command.add(System.getenv("windir") + "\\system32\\" + "tree.com");
        command.add("/A");

        ProcessBuilder builder = new ProcessBuilder(command);
        Map<String, String> environ = builder.environment();
        builder.directory(new File(System.getenv("temp")));

        System.out.println("Directory : " + System.getenv("temp"));
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

Windows 文件关联

Any program using the Windows file association mechanism can be started with the rundll32 utility.

任何使用 Windows 文件关联机制的程序都可以通过 rundll32 工具启动。

```
// "file" is the filename of the data file
//  ex. myresume.doc
//  to start Word if the doc extension is associated with it.
Runtime.getRuntime().exec
  ("rundll32 SHELL32.DLL,ShellExec_RunDLL " + file.getAbsolutePath());

```



See also this [HowTo](http://www.rgagnon.com/javadetails/java-0579.html) about the new Desktop API, the recommended solution (but you need JDK1.6).

另请参阅这个 [HowTo](http://www.rgagnon.com/javadetails/java-0579.html)，它介绍新的 Desktop API，是官方推荐的解决方案（但需要 JDK1.6）。

See also this [one](http://www.rgagnon.com/javadetails/java-0071.html) to open the default browser.

另请参阅这个[链接](http://www.rgagnon.com/javadetails/java-0071.html)，用于打开默认浏览器。

The following example **start a Dial-up connection** on the Win plateform :

下面的例子在 Win 平台上**启动拨号连接**：

```
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

“MyConnection”是 DUN（拨号网络连接），且区分大小写。

You still need to press ENTER to CONNECT, there is an option in the Connection properties to connect automatically.

你仍然需要按 ENTER 键来连接，连接属性中有一个可自动连接的选项。

On NT and W2K, rnaui.dll is not available. Use rasdial.exe instead.

在 NT 和 W2K 上，rnaui.dll 不可用。请改用 rasdial.exe。

```
rasdial "connection name"
rasdial "connection name" /d to drop
rasdial /? for more options

```



##### PDF (Windows only)

##### PDF(Windows)

```
public class ShowPDFWin {
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
public class ShowPDFMac {
    public static void main(String[] args) throws Exception {
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

你可以为要执行的程序指定路径。在 Win 平台上，如果**路径中包含空格**，你就需要把路径放在引号里。

```
public class TestExecute {
    public static void main(String[] args) throws Exception {
        Process p = Runtime.getRuntime().exec(
                "\"c:/program files/windows/notepad.exe\"");
        p.waitFor();
    }
}

```



If you need to **pass arguments**, it's safer to a String array especially if they contain spaces.

如果你需要**传递参数**，使用字符串数组会更安全，尤其是当参数中包含空格时。

```
String[] cmd = { "myProgram.exe", "-o=This is an option" };
Runtime.getRuntime().exec(cmd);

```



If using the start command and the path of the file to be started contains a space then you must specified a title to the start command.

如果使用 start 命令，且要启动的文件的路径中包含空格，那么必须为 start 命令指定一个标题。

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

// or

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
public class StartExcel {
    public static void main(String args[])
            throws Exception {
        Runtime.getRuntime().exec("cmd /c start excel.exe");
    }
}

```



To load a worksheet

加载一个工作表

```
public class StartExcel2 {
    public static void main(String args[])
            throws Exception {
        String fileName = "c:\\temp\\xls\\test2.xls";
        String[] commands = {"cmd", "/c", "start", "\"DummyTitle\"", fileName};
        Runtime.getRuntime().exec(commands);
    }
}

```



It's important to pass a dummy title to the Windows start command where there is a possibility that the filename contains a space. It's a feature.

当文件名可能包含空格时，向 Windows 的 start 命令传递一个占位标题(虚拟标题)很重要。这是一个特性。

##### Start a Windows application under another account

##### 开始一个Windows应用程序在另一个帐户

You use the RUNAS command from the command line to start an application under another account (not available with XP Home edition). There are many switches that can enhance the behaviour of RUNAS. Typing "runas /?" from the command prompt gets you all the options.

你可以在命令行使用 RUNAS 命令，以另一个帐户的身份启动应用程序（XP 家庭版不可用）。有很多开关可以增强 RUNAS 的行为。在命令提示符下输入 "runas /?" 就能看到所有选项。

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



The `/savecred` option allows you to save a password for that account and then reuse it later. For example, The command `runas /savecred /user:administrator regedit.exe` prompts for the password, and then Regedit runs. Next time you use the same command, there is no password prompt.

`/savecred` 选项允许你为该帐户保存密码，以便之后复用。例如，命令 `runas /savecred /user:administrator regedit.exe` 会提示输入密码，然后运行 Regedit。下次你再使用同一命令时，就不会再提示密码了。

One potential problem is that when `/SaveCred` saves the credentials it saves it for whenever RUNAS invokes that user account. This can be a huge security risk so be careful using it!

一个潜在的问题是，`/SaveCred` 保存凭证后，每当 RUNAS 调用该用户帐户时都会使用它。这可能是一个巨大的安全风险，因此使用时要小心！

RUNAS capability can be disabled by editing the Registry or by disabling the RUNAS or Secondary Logon Services. The appropriate registry key is `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\policies\Explorer`, create a new DWORD value named `HideRunAsVerb` and assign it a value of 1 to disable Run as.

可以通过编辑注册表，或禁用 RUNAS / 二次登录(Secondary Logon)服务来禁用 RUNAS 功能。相应的注册表键为 `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\policies\Explorer`，新建一个名为 `HideRunAsVerb` 的 DWORD 值，并将其赋值为 1，即可禁用“运行方式(Run as)”。

RUNAS doesn't work when used from a Windows service.

从 Windows 服务中使用 RUNAS 是无效的。

##### Windows : execute something in Program Files

##### Windows：在 Program Files 中执行程序

We want to execute the textpad editor located in `C:\Program Files\TextPad 4` but without hard coding the path since it can be different for a localized version of Windows.

我们想执行位于 `C:\Program Files\TextPad 4` 的 TextPad 编辑器，但不硬编码该路径，因为对于本地化版本的 Windows，它可能不同。

We simply extract to environnment variable called *%programfiles%* and build the complete path from there.

我们只需提取名为 *%programfiles%* 的环境变量，并据此构建完整路径。

[JDK1.5]

[JDK1.5]

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



NOTE : Prior Vista, System folders were localized on disk like `C:\Program Files` -> `C:\Archivos de programa` on the Windows with the Spanish localization. Since Vista, System Folders always exists with the english name BUT when viewed through Explorer, the localized name is shown. See <http://msmvps.com/blogs/carlosq/archive/2007/02/12/windows-vista-junctions-points-mui-and-localized-folder-names.aspx>.

注意：在 Vista 之前，系统文件夹在磁盘上是本地化的，例如在西班牙语本地化的 Windows 上，`C:\Program Files` 对应 `C:\Archivos de programa`。从 Vista 起，系统文件夹始终以英文名存在，但当通过资源管理器(Explorer)查看时，显示的是本地化名称。参见 <http://msmvps.com/blogs/carlosq/archive/2007/02/12/windows-vista-junctions-points-mui-and-localized-folder-names.aspx>。

原文链接: <http://www.rgagnon.com/javadetails/java-0014.html>



