#### Execute an external program

#### Java调用外部程序

Be sure to **read** this [Javaworld article](http://www.javaworld.com/javaworld/jw-12-2000/jw-1229-traps.html?page=1). It describes the various **pitfalls** related to the Runtime.exec() method.

基础知识请参考Javaworld的文章: [Runtime.exec() 的错误用法集锦](http://www.javaworld.com/article/2071275/core-java/when-runtime-exec---won-t.html)。它描述了各种相关* *陷阱* * Runtime.exec()方法。

##### Using Runtime.exec()

##### 使用Runtime.exec()

This example will

这个例子将

capture the output (from stdio) of an external program.

捕获一个外部程序的输出(头)。

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

下一个例子中,启动CMD。EXE,抓住stdin和stdout,推动stdin命令解释的壳。

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

##### 启动Windows CMD文件(或蝙蝠)和检索返回码或exitcode

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

测试。cmd(手动设置的返回码)

```
@echo hello world
@exit 42
```



test.cmd (set the errorlevel 1 (problem detected)

测试。cmd(设置返回码1(发现问题)

```
@java -garbage
```



test.cmd (set the errorlevel 0 (execution Ok)

测试。cmd(设置返回码为0(执行好)

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

自1.5以来,ProcessBuilder类提供了更多的控制筛渣要启动这个过程。可以设置一个目录开始。

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

##### Windows rundll32效用

Windows File association

Windows文件关联

Any program using the Windows file association mechanism can be started with the rundll32 utility.

任何程序使用Windows文件关联机制可以从rundll32效用。

```
// "file" is the filename of the data file
//  ex. myresume.doc
//  to start Word if the doc extension is associated with it.
Runtime.getRuntime().exec
  ("rundll32 SHELL32.DLL,ShellExec_RunDLL " + file.getAbsolutePath());

```



See also this [HowTo](http://www.rgagnon.com/javadetails/java-0579.html) about the new Desktop API, the recommended solution (but you need JDK1.6).

看到这个[HowTo](http://www.rgagnon.com/javadetails/java - 0579. - html)的新桌面API,(但你需要JDK1.6)推荐的解决方案。

See also this [one](http://www.rgagnon.com/javadetails/java-0071.html) to open the default browser.

看到这个[1](http://www.rgagnon.com/javadetails/java - 0071. - html)打开默认浏览器。

The following example **start a Dial-up connection** on the Win plateform :

下面的例子* *开始拨号连接* *赢平台:

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

“MyConnection”DUN和它是区分大小写的。

You still need to press ENTER to CONNECT, there is an option in the Connection properties to connect automatically.

你仍然需要按ENTER键连接,连接属性中有一个选项自动连接。

On NT and W2K, rnaui.dll is not available. Use rasdial.exe instead.

在NT和能正常,rnaui。dll是不可用的。使用rasdial。exe。

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

[http://www.rgagnon.com/pbdetails/pb-0204.html](runddl32 More实例)

------

- - - - - -

##### Path to executable with spaces in them

##### 可执行路径和空间

You can include a path for the program to be executed. On the Win plateform, you need to put the path in quotes if **the path contains spaces**.

你可以包括一个程序执行路径。赢得的园地,你需要把路径在引号中* * * *的路径是否包含空格。

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

如果你需要* * * *传递参数,是安全的一个字符串数组特别是如果他们包含空格。

```
String[] cmd = { "myProgram.exe", "-o=This is an option" };
Runtime.getRuntime().exec(cmd);

```



If using the start command and the path of the file to be started contains a space then you must specified a title to the start command.

如果使用启动命令和文件的路径开始包含一个空间然后你必须指定一个标题开始命令。

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

重要的是要通过一个虚拟的Windows启动命令,有可能文件名包含一个空格。这是一个功能。

##### Start a Windows application under another account

##### 开始一个Windows应用程序在另一个帐户

You use the RUNAS command from the command line to start an application under another account (not available with XP Home edition). There are many switches that can enhance the behaviour of RUNAS. Typing "runas /?" from the command prompt gets you all the options.

你使用RUNAS命令从命令行启动一个应用程序在另一个帐户与XP家庭版(不可用)。有很多开关可以增强RUNAS的行为.输入“runas / ?“从命令提示让你所有的选项。

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

的`/savecred`选项允许您保存密码的帐户,然后重用它。例如,命令`runas /savecred /user:administrator regedit.exe`提示输入密码,然后运行注册表编辑器。下次你使用相同的命令,没有密码提示。

One potential problem is that when `/SaveCred` saves the credentials it saves it for whenever RUNAS invokes that user account. This can be a huge security risk so be careful using it!

一个潜在的问题是,当`/SaveCred`保存凭证保存它,每当RUNAS调用用户帐户。这是一个巨大的安全风险,所以要小心使用它!

RUNAS capability can be disabled by editing the Registry or by disabling the RUNAS or Secondary Logon Services. The appropriate registry key is `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\policies\Explorer`, create a new DWORD value named `HideRunAsVerb` and assign it a value of 1 to disable Run as.

RUNAS能力可以禁用编辑注册表或禁用RUNAS或二次登录服务。适当的注册表键`HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\policies\Explorer`,创建一个新的DWORD值命名`HideRunAsVerb`并为其分配一个值1禁用运行。

RUNAS doesn't work when used from a Windows service.

RUNAS不使用时从一个Windows服务工作。

##### Windows : execute something in Program Files

##### Windows:一些程序文件执行

We want to execute the textpad editor located in `C:\Program Files\TextPad 4` but without hard coding the path since it can be different for a localized version of Windows.

我们想执行文本编辑编辑器位于`C:\Program Files\TextPad 4`但是没有硬编码的路径,因为它可以是不同的本地化版本的Windows。

We simply extract to environnment variable called *%programfiles%* and build the complete path from there.

我们只是提取environnment变量* % programfiles % *和构建完整的路径。

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



NOTE : Prior Vista, System folders were localized on disk like `C:\Program Files` -> `C:\Archivos de programa` on the Windows with the Spanish localization. Since Vista, System Folders always exists with the english name BUT when viewed through Explorer, the localized name is shown. See <http://msmvps.com/blogs/carlosq/archive/2007/02/12/windows-vista-junctions-points-mui-and-localized-folder-names.aspx>.

注意:之前Vista系统文件夹是本地化的磁盘上`C:\Program Files`- >`C:\Archivos de programa`在Windows与西班牙本地化。因为Vista系统文件夹的英文名字总是存在,但当通过浏览器查看,显示本地化名称。看到< http://msmvps.com/blogs/carlosq/archive/2007/02/12/windows-vista-junctions-points-mui-and-localized-folder-names.aspx >。

原文链接: <http://www.rgagnon.com/javadetails/java-0014.html>



