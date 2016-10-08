# JDWP

The Java Debug Wire Protocol (JDWP) is very useful for debugging applications as well as applets.

Java调试线协议(JDWP)是非常有用的对于调试应用程序以及applet。


## To debug an application using JDWP:

## 调试一个应用程序使用JDWP:


### 1.  Open the command line and set the `PATH` environment variable to jdk/bin where jdk is the installation directory of the JDK.

### 1。打开命令行,将“路径”环境变量设置为jdk / bin jdk的jdk的安装目录。


### 2.  Use the following command to run the application (called `Test` in this example) which you want to debug:

### 2。使用以下命令运行该应用程序(称为“测试”在这个例子中)您想要调试:


*   On Windows:

*在Windows上:


        ```
        java -Xdebug -Xrunjdwp:transport=dt_shmem,address=debug,server=y,suspend=y Test




        ```




*   On Oracle Solaris and Linux operating systems:

*在Oracle Solaris和Linux操作系统:


        ```
        java -Xdebug -Xrunjdwp:transport=dt_socket,address=8888,server=y,suspend=y Test




        ```




The `Test` class will start in the debugging mode and wait for a debugger to attach to it at address `debug` (on Windows) or `8888` (on Oracle Solaris and Linux operating systems).

测试的类将开始在调试模式下,等待调试器附加到它在解决“调试”(在Windows上)或“8888”(在Oracle Solaris和Linux操作系统)。


### 3.  Open another command line and use the following command to run `jdb` and attach it to the running debug server:

### 3所示。打开另一个命令行并使用以下命令运行“jdb”并将它附加到运行调试服务器:


*   On Windows:

*在Windows上:


        ```
        jdb -attach 'debug'




        ```




*   On Oracle Solaris and Linux operating systems:

*在Oracle Solaris和Linux操作系统:


        ```
        jdb -attach 8888




        ```




After `jdb` initializes and attaches to `Test`, you can perform Java-level debugging.

jdb初始化和高度后测试,您可以执行java级别调试。


### 4.  Set your breakpoints and run the application. For example, to set the breakpoint at the beginning of the `main` method in `Test`, run the following command:

### 4所示。设置断点并运行应用程序。例如,设置断点的“主要”在“测试”的方法,运行以下命令:


    ```
    stop in Test.main run




    ```




When the `jdb` utility hits the breakpoint, you will be able to inspect the environment in which the application is running and see if it is functioning as expected.

多彬的效用命中断点时,你将能够检查应用程序运行的环境和程序是否正常运行。


### 5.  (Optional) To perform native-level debugging along with Java-level debugging, use native debuggers to attach to the Java process running with JDWP.

### 5。(可选)来执行native-level调试Java级别调试,使用本机调试器与JDWP附着在Java进程运行。


On Oracle Solaris, you can use the `dbx` utility and on Linux you can use the `gdb` utility.

据Oracle,你可以使用Solaris ! ! ! ! dbx Linux和公用事业gdb ! !你到了使用公用事业。


In Windows, you can use Visual Studio for native-level debugging as follows:



1.  Open Visual Studio.
2.  On the **Debug** menu, select **Attach to Process**. Select the Java process that is running with JDWP.
3.  On the **Project** menu, select **Settings**, and open the **Debug** tab. In the **Category** drop-down list, select **Additional DLLs** and add the native DLL that you want to debug (for example, Test.dll).
4.  Open the source file (one or more) of Test.dll and set your breakpoints.
5.  Type `cont` in the `jdb` window. The process will hit the breakpoint in Visual Studio.


在Windows中,您可以使用Visual Studio native-level调试如下:

1. 打开Visual Studio。
2. 在* * * *调试菜单,选择* * * *附加到进程。选择Java进程与JDWP运行。
3. 关于项目* * * * * *情况,精选的菜单,* *和开放the * * * * tab调试版本.* * * *级下拉列表,选择* * * *额外的DLL和添加您想要调试的原生DLL(例如,Test.dll)。
4. 打开源文件(一个或多个)的测试。dll和设置断点。
5. 类型“租”“jdb”窗口。这个过程将断点在Visual Studio。






原文链接: [https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/introclientissues005.html](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/introclientissues005.html)


