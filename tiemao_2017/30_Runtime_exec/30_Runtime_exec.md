#### Execute an external program

>  Be sure to **read** this [Javaworld article](http://www.javaworld.com/javaworld/jw-12-2000/jw-1229-traps.html?page=1). It describes the various **pitfalls** related to the Runtime.exec() method.

##### Using Runtime.exec()

This example will capture  the output (from stdio) of an external program.

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

```
@echo hello world
@exit 42

```

test.cmd (set the errorlevel 1 (problem detected)

```
@java -garbage

```

test.cmd (set the errorlevel 0 (execution Ok)

```
@java -version

```

##### Launch a Unix script

```
String[] cmd = {"/bin/sh", "-c", "ls > hello"};
Runtime.getRuntime().exec(cmd);

```

##### Using the ProcessBuilder

Since 1.5, the ProcessBuilder class provides more controls overs the process to be started. It's possible to set a starting directory.

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

Windows File association

Any program using the Windows file association mechanism can be started with the rundll32 utility.

```
// "file" is the filename of the data file
//  ex. myresume.doc
//  to start Word if the doc extension is associated with it.
Runtime.getRuntime().exec
  ("rundll32 SHELL32.DLL,ShellExec_RunDLL " + file.getAbsolutePath());

```

See also this [HowTo](http://www.rgagnon.com/javadetails/java-0579.html) about the new Desktop API, the recommended solution (but you need JDK1.6).
See also this [one](http://www.rgagnon.com/javadetails/java-0071.html) to open the default browser.

The following example **start a Dial-up connection** on the Win plateform :

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

You still need to press ENTER to CONNECT, there is an option in the Connection properties to connect automatically.

On NT and W2K, rnaui.dll is not available. Use rasdial.exe instead.

```
rasdial "connection name"
rasdial "connection name" /d to drop
rasdial /? for more options

```

##### PDF (Windows only)

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

```
public class ShowPDF {
  public static void main (String[] args) throws Exception{
    Process p = Runtime.getRuntime().exec("open /Documents/mypdf.pdf");
  }
}

```

[More runddl32 examples](http://www.rgagnon.com/pbdetails/pb-0204.html)

------

##### Path to executable with spaces in them

You can include a path for the program to be executed. On the Win plateform, you need to put the path in quotes if **the path contains spaces**.

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

```
String[] cmd = { "myProgram.exe", "-o=This is an option" };
Runtime.getRuntime().exec(cmd);

```

If using the start command and the path of the file to be started contains a space then you must specified a title to the start command.

```
String fileName = "c:\\Applications\\My Documents\\test.doc";
String[] commands = {"cmd", "/c", "start", "\"DummyTitle\"",fileName};
Runtime.getRuntime().exec(commands);

```

------

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

```
Runtime.getRuntime().exec("hh.exe myhelpfile.chm");

```

##### Start Excel

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

##### Start a Windows application under another account

You use the RUNAS command from the command line to start an application under another account (not available with XP Home edition). There are many switches that can enhance the behaviour of RUNAS. Typing "runas /?" from the command prompt gets you all the options.

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

One potential problem is that when `/SaveCred` saves the credentials it saves it for whenever RUNAS invokes that user account. This can be a huge security risk so be careful using it!

RUNAS capability can be disabled by editing the Registry or by disabling the RUNAS or Secondary Logon Services. The appropriate registry key  is `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\policies\Explorer`, create a new DWORD value named `HideRunAsVerb` and assign it a value of 1 to disable Run as.

RUNAS doesn't work when used from a Windows service.

##### Windows : execute something in Program Files

We want to execute the textpad editor located in  `C:\Program Files\TextPad 4`,  but without hard coding the path since it can be different for a localized version of Windows.

We simply extract to environnment variable called *`%programfiles%`* and build the complete path from there.

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

NOTE : Prior Vista, System folders were localized on disk like  `C:\Program Files  -> C:\Archivos de programa`  on the Windows with the Spanish localization. Since Vista, System Folders always exists with the english name BUT when viewed through Explorer, the localized name is shown. See http://msmvps.com/blogs/carlosq/archive/2007/02/12/windows-vista-junctions-points-mui-and-localized-folder-names.aspx


原文链接: <http://www.rgagnon.com/javadetails/java-0014.html>
