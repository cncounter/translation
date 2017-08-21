# When Runtime.exec() won't

### Navigate yourself around pitfalls related to the Runtime.exec() method

As part of the Java language, the `java.lang` package is implicitly imported into every Java program. This package's pitfalls surface often, affecting most programmers. This month, I'll discuss the traps lurking in the `Runtime.exec()`method.

## Pitfall 4: When Runtime.exec() won't

The class `java.lang.Runtime` features a static method called `getRuntime()`, which retrieves the current Java Runtime Environment. That is the only way to obtain a reference to the `Runtime` object. With that reference, you can run external programs by invoking the `Runtime` class's `exec()` method. Developers often call this method to launch a browser for displaying a help page in HTML.

There are four overloaded versions of the `exec()` command:

- `public Process exec(String command);`
- `public Process exec(String [] cmdArray);`
- `public Process exec(String command, String [] envp);`
- `public Process exec(String [] cmdArray, String [] envp);`

For each of these methods, a command -- and possibly a set of arguments -- is passed to an operating-system-specific function call. This subsequently creates an operating-system-specific process (a running program) with a reference to a `Process` class returned to the Java VM. The `Process` class is an abstract class, because a specific subclass of `Process` exists for each operating system.

You can pass three possible input parameters into these methods:

1. A single string that represents both the program to execute and any arguments to that program
2. An array of strings that separate the program from its arguments
3. An array of environment variables

Pass in the environment variables in the form `name=value`. If you use the version of `exec()` with a single string for both the program and its arguments, note that the string is parsed using white space as the delimiter via the `StringTokenizer`class.

#### Stumbling into an IllegalThreadStateException

The first pitfall relating to `Runtime.exec()` is the `IllegalThreadStateException`. The prevalent first test of an API is to code its most obvious methods. For example, to execute a process that is external to the Java VM, we use the `exec()`method. To see the value that the external process returns, we use the `exitValue()` method on the `Process` class. In our first example, we will attempt to execute the Java compiler (`javac.exe`):

**Listing 4.1 BadExecJavac.java**

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

A run of `BadExecJavac` produces:

```
E:\classes\com\javaworld\jpitfalls\article2>java BadExecJavac
java.lang.IllegalThreadStateException: process has not exited
        at java.lang.Win32Process.exitValue(Native Method)
        at BadExecJavac.main(BadExecJavac.java:13)
```

If an external process has not yet completed, the `exitValue()` method will throw an `IllegalThreadStateException`; that's why this program failed. While the documentation states this fact, why can't this method wait until it can give a valid answer?

A more thorough look at the methods available in the `Process` class reveals a `waitFor()` method that does precisely that. In fact, `waitFor()` also returns the exit value, which means that you would not use `exitValue()` and `waitFor()` in conjunction with each other, but rather would choose one or the other. The only possible time you would use `exitValue()` instead of `waitFor()` would be when you don't want your program to block waiting on an external process that may never complete. Instead of using the `waitFor()` method, I would prefer passing a boolean parameter called `waitFor` into the `exitValue()` method to determine whether or not the current thread should wait. A boolean would be more beneficial because `exitValue()` is a more appropriate name for this method, and it isn't necessary for two methods to perform the same function under different conditions. Such simple condition discrimination is the domain of an input parameter.

Therefore, to avoid this trap, either catch the `IllegalThreadStateException` or wait for the process to complete.

Now, let's fix the problem in Listing 4.1 and wait for the process to complete. In Listing 4.2, the program again attempts to execute `javac.exe` and then waits for the external process to complete:

**Listing 4.2 BadExecJavac2.java**

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

Unfortunately, a run of `BadExecJavac2` produces no output. The program hangs and never completes. Why does the `javac` process never complete?

#### Why Runtime.exec() hangs

The JDK's Javadoc documentation provides the answer to this question:

> Because some native platforms only provide limited buffer size for standard input and output streams, failure to promptly write the input stream or read the output stream of the subprocess may cause the subprocess to block, and even deadlock.

Is this just a case of programmers not reading the documentation, as implied in the oft-quoted advice: read the fine manual (RTFM)? The answer is partially yes. In this case, reading the Javadoc would get you halfway there; it explains that you need to handle the streams to your external process, but it does not tell you how.

Another variable is at play here, as is evident by the large number of programmer questions and misconceptions concerning this API in the newsgroups: though `Runtime.exec()` and the Process APIs seem extremely simple, that simplicity is deceiving because the simple, or obvious, use of the API is prone to error. The lesson here for the API designer is to reserve simple APIs for simple operations. Operations prone to complexities and platform-specific dependencies should reflect the domain accurately. It is possible for an abstraction to be carried too far. The `JConfig` library provides an example of a more complete API to handle file and process operations (see [Resources](http://www.javaworld.com/article/2071275/core-java/when-runtime-exec---won-t.html#resources) below for more information).

Now, let's follow the JDK documentation and handle the output of the `javac`process. When you run `javac` without any arguments, it produces a set of usage statements that describe how to run the program and the meaning of all the available program options. Knowing that this is going to the `stderr` stream, you can easily write a program to exhaust that stream before waiting for the process to exit. Listing 4.3 completes that task. While this approach will work, it is not a good general solution. Thus, Listing 4.3's program is named `MediocreExecJavac`; it provides only a mediocre solution. A better solution would empty both the standard error stream and the standard output stream. And the best solution would empty these streams simultaneously (I'll demonstrate that later).

**Listing 4.3 MediocreExecJavac.java**

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

A run of `MediocreExecJavac` generates:

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

So, `MediocreExecJavac` works and produces an exit value of `2`. Normally, an exit value of `0` indicates success; any nonzero value indicates an error. The meaning of these exit values depends on the particular operating system. A Win32 error with a value of `2` is a "file not found" error. That makes sense, since `javac`expects us to follow the program with the source code file to compile.

Thus, to circumvent the second pitfall -- hanging forever in `Runtime.exec()` -- if the program you launch produces output or expects input, ensure that you process the input and output streams.

#### Assuming a command is an executable program

Under the Windows operating system, many new programmers stumble upon `Runtime.exec()` when trying to use it for nonexecutable commands like `dir` and `copy`. Subsequently, they run into `Runtime.exec()`'s third pitfall. Listing 4.4 demonstrates exactly that:

**Listing 4.4 BadExecWinDir.java**

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

A run of `BadExecWinDir` produces:

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

As stated earlier, the error value of `2` means "file not found," which, in this case, means that the executable named `dir.exe` could not be found. That's because the directory command is part of the Windows command interpreter and not a separate executable. To run the Windows command interpreter, execute either `command.com` or `cmd.exe`, depending on the Windows operating system you use. Listing 4.5 runs a copy of the Windows command interpreter and then executes the user-supplied command (e.g., `dir`).

**Listing 4.5 GoodWindowsExec.java**

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

Running `GoodWindowsExec` with the `dir` command generates:

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

Running `GoodWindowsExec` with any associated document type will launch the application associated with that document type. For example, to launch Microsoft Word to display a Word document (i.e., one with a `.doc` extension), type:

```
>java GoodWindowsExec "yourdoc.doc"
```

Notice that `GoodWindowsExec` uses the `os.name` system property to determine which Windows operating system you are running -- and thus determine the appropriate command interpreter. After executing the command interpreter, handle the standard error and standard input streams with the `StreamGobbler`class. `StreamGobbler` empties any stream passed into it in a separate thread. The class uses a simple `String` type to denote the stream it empties when it prints the line just read to the console.

Thus, to avoid the third pitfall related to `Runtime.exec()`, do not assume that a command is an executable program; know whether you are executing a standalone executable or an interpreted command. At the end of this section, I will demonstrate a simple command-line tool that will help you with that analysis.

It is important to note that the method used to obtain a process's output stream is called `getInputStream()`. The thing to remember is that the API sees things from the perspective of the Java program and not the external process. Therefore, the external program's output is the Java program's input. And that logic carries over to the external program's input stream, which is an output stream to the Java program.

#### Runtime.exec() is not a command line

One final pitfall to cover with `Runtime.exec()` is mistakenly assuming that `exec()`accepts any `String` that your command line (or shell) accepts. `Runtime.exec()` is much more limited and not cross-platform. This pitfall is caused by users attempting to use the `exec()` method to accept a single `String` as a command line would. The confusion may be due to the fact that `command` is the parameter name for the `exec()` method. Thus, the programmer incorrectly associates the parameter command with anything that he or she can type on a command line, instead of associating it with a single program and its arguments. In listing 4.6 below, a user tries to execute a command and redirect its output in one call to `exec()`:

**Listing 4.6 BadWinRedirect.java**

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

Running `BadWinRedirect` produces:

```
E:\classes\com\javaworld\jpitfalls\article2>java BadWinRedirect
OUTPUT>'Hello World' > test.txt
ExitValue: 0
```

The program `BadWinRedirect` attempted to redirect the output of an echo program's simple Java version into the file `test.txt`. However, we find that the file `test.txt` does not exist. The `jecho` program simply takes its command-line arguments and writes them to the standard output stream. (You will find the source for `jecho` in the source code available for download in [Resources](http://www.javaworld.com/article/2071275/core-java/when-runtime-exec---won-t.html?page=2#resources).) In Listing 4.6, the user assumed that you could redirect standard output into a file just as you could on a DOS command line. Nevertheless, you do not redirect the output through this approach. The incorrect assumption here is that the `exec()`method acts like a shell interpreter; it does not. Instead, `exec()` executes a single executable (a program or script). If you want to process the stream to either redirect it or pipe it into another program, you must do so programmatically, using the `java.io` package. Listing 4.7 properly redirects the standard output stream of the `jecho` process into a file.

**Listing 4.7 GoodWinRedirect.java**

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

Running `GoodWinRedirect` produces:

```
E:\classes\com\javaworld\jpitfalls\article2>java GoodWinRedirect test.txt
OUTPUT>'Hello World'
ExitValue: 0
```

After running `GoodWinRedirect`, `test.txt` does exist. The solution to the pitfall was to simply control the redirection by handling the external process's standard output stream separately from the `Runtime.exec()` method. We create a separate `OutputStream`, read in the filename to which we redirect the output, open the file, and write the output that we receive from the spawned process's standard output to the file. Listing 4.7 completes that task by adding a new constructor to our `StreamGobbler` class. The new constructor takes three arguments: the input stream to gobble, the type `String` that labels the stream we are gobbling, and the output stream to which we redirect the input. This new version of `StreamGobbler` does not break any of the code in which it was previously used, as we have not changed the existing public API -- we only extended it.

Since the argument to `Runtime.exec()` is dependent on the operating system, the proper commands to use will vary from one OS to another. So, before finalizing arguments to `Runtime.exec()` and writing the code, quickly test the arguments. Listing 4.8 is a simple command-line utility that allows you to do just that.

Here's a useful exercise: try to modify `TestExec` to redirect the standard input or standard output to a file. When executing the `javac` compiler on Windows 95 or Windows 98, that would solve the problem of error messages scrolling off the top of the limited command-line buffer.

**Listing 4.8 TestExec.java**

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

Running `TestExec` to launch the Netscape browser and load the Java help documentation produces:

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

Our first test failed with an error of `193`. The Win32 error for value 193 is "not a valid Win32 application." This error tells us that no path to an associated application (e.g., Netscape) exists, and that the process cannot run an HTML file without an associated application.

Therefore, we try the test again, this time giving it a full path to Netscape. (Alternately, we could add Netscape to our `PATH` environment variable.) A second run of `TestExec` produces:

```
E:\classes\com\javaworld\jpitfalls\article2>java TestExec 
"e:\program files\netscape\program\netscape.exe e:\java\docs\index.html"
ExitValue: 0
```

This worked! The Netscape browser launches, and it then loads the Java help documentation.

One additional improvement to `TestExec` would include a command-line switch to accept input from standard input. You would then use the `Process.getOutputStream()` method to pass the input to the spawned external program.

To sum up, follow these rules of thumb to avoid the pitfalls in `Runtime.exec()`:

1. You cannot obtain an exit status from an external process until it has exited
2. You must immediately handle the input, output, and error streams from your spawned external process
3. You must use `Runtime.exec()` to execute programs
4. You cannot use `Runtime.exec()` like a command line

## Correction to Pitfall 3

In the discussion of Pitfall 3 ("Don't mix floats and doubles when generating text or XML messages") in my last column, I incorrectly stated that the different string representation of a decimal number after casting it from a float to a double was a bug. While this is a pitfall, its cause is not a bug, but the fact that the decimal numbers in question -- 100.28 and 91.09 -- do not represent precisely in binary. I'd like to thank Thomas Okken and the others who straightened me out. If you enjoy discussing the finer points of numerical methods, you can [email Thomas](mailto:TOkken@refco.com).



The combination of forgetting my numerical methods class, the numerous bug reports on the bug parade, and the automatic rounding of floats and doubles when printing (but not after casting a float to a double) threw me. I apologize for confusing anyone who read the article, especially to new Java programmers. I present two better solutions to the problem:

The first possible solution is to always specify the desired rounding explicitly with `NumberFormat`. In my case, I use the float and double to represent dollars and cents; therefore, I need only two significant digits. Listing C3.1 demonstrates how to use the `NumberFormat` class to specify a maximum of two fraction digits.

**Listing C3.1 FormatNumbers.java**

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

When we run the `FormatNumbers` program, it produces:

```
E:\classes\com\javaworld\jpitfalls\article2>java FormatNumbers
As a float        : 100.28
Cast to a double  : 100.27999877929688
Using NumberFormat: 100.28
```

As you can see -- regardless of whether we cast the float to a double -- when we specify the number of digits we want, it properly rounds to that precision -- even if the number is infinitely repeating in binary. To circumvent this pitfall, control the formatting of your doubles and floats when converting to a `String`.

A second, simpler solution would be to not use a float to represent cents. Integers (number of pennies) can represent cents, with a legal range of 0 to 99. You can check the range in the mutator method.

## Next time

In my next column, I'll present another pitfall from `java.lang`, as well as two traps hiding in the `java.net` and the `Swing` packages. If you know of any Java pitfalls that have wasted your time and caused you frustration, please [email them to me](http://www.javaworld.com/javaworld/feedback/jw-feedback-form.html) so we can save others the same fate.

Michael C. Daconta is the director of Web and technology services for McDonald Bradley, where he conducts training seminars and develops advanced systems with Java, JavaScript, and XML. Over the past 15 years, Daconta has held every major development position, including chief scientist, technical director, chief developer, team leader, systems analyst, and programmer. He is a Sun-certified Java programmer and coauthor of Java Pitfalls (John Wiley & Sons, 2000), Java 2 and JavaScript for C and C++ Programmers (John Wiley & Sons, 1999), and XML Development with Java 2 (Sams Publishing, 2000). In addition, he is the author of C++ Pointers and Dynamic Memory Management (John Wiley & Sons, 1995).

[Learn more about this topic]()[Download the source code for all the examples in this article]()[http://www.javaworld.com/jw-12-2000/traps/jw-1229-traps.zip](http://www.javaworld.com/jw-12-2000/traps/jw-1229-traps.zip)*Java Pitfalls, Time Saving Solutions, and Workarounds to Improve Programs*, Michael C. Daconta, Eric Monk, J. Paul Keller, Keith Bohnenberger (John Wiley & Sons, 2000)
[http://www.amazon.com/exec/obidos/ASIN/0471361747/javaworld](http://www.amazon.com/exec/obidos/ASIN/0471361747/javaworld)Review the `JConfig` library or download it for evaluation
[http://tolstoy.com/samizdat/jconfig.html](http://tolstoy.com/samizdat/jconfig.html)Read Michael Daconta's previous **Java Traps** column, "Steer Clear of Java Pitfalls" (*JavaWorld,*September 22, 2000)
[http://www.javaworld.com/javaworld/jw-09-2000/jw-0922-pitfalls.html](http://www.javaworld.com/javaworld/jw-09-2000/jw-0922-pitfalls.html)Browse *JavaWorld*'s **Topical Index**
[http://www.javaworld.com/javaworld/topicalindex/jw-ti-index.html](http://www.javaworld.com/javaworld/topicalindex/jw-ti-index.html)



原文链接: <http://www.javaworld.com/article/2071275/core-java/when-runtime-exec---won-t.html>

