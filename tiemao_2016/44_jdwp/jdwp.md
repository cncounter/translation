# JDWP


The Java Debug Wire Protocol (JDWP) is very useful for debugging applications as well as applets.

To debug an application using JDWP:

1.  Open the command line and set the `PATH` environment variable to jdk/bin where jdk is the installation directory of the JDK.

2.  Use the following command to run the application (called `Test` in this example) which you want to debug:

    *   On Windows:

        ```
        java -Xdebug -Xrunjdwp:transport=dt_shmem,address=debug,server=y,suspend=y Test

        ```

    *   On Oracle Solaris and Linux operating systems:

        ```
        java -Xdebug -Xrunjdwp:transport=dt_socket,address=8888,server=y,suspend=y Test

        ```

    The `Test` class will start in the debugging mode and wait for a debugger to attach to it at address `debug` (on Windows) or `8888` (on Oracle Solaris and Linux operating systems).

3.  Open another command line and use the following command to run `jdb` and attach it to the running debug server:

    *   On Windows:

        ```
        jdb -attach 'debug'

        ```

    *   On Oracle Solaris and Linux operating systems:

        ```
        jdb -attach 8888

        ```

    After `jdb` initializes and attaches to `Test`, you can perform Java-level debugging.

4.  Set your breakpoints and run the application. For example, to set the breakpoint at the beginning of the `main` method in `Test`, run the following command:

    ```
    stop in Test.main run

    ```

    When the `jdb` utility hits the breakpoint, you will be able to inspect the environment in which the application is running and see if it is functioning as expected.

5.  (Optional) To perform native-level debugging along with Java-level debugging, use native debuggers to attach to the Java process running with JDWP.

    On Oracle Solaris, you can use the `dbx` utility and on Linux you can use the `gdb` utility.

    In Windows, you can use Visual Studio for native-level debugging as follows:

    1.  Open Visual Studio.

    2.  On the **Debug** menu, select **Attach to Process**. Select the Java process that is running with JDWP.

    3.  On the **Project** menu, select **Settings**, and open the **Debug** tab. In the **Category** drop-down list, select **Additional DLLs** and add the native DLL that you want to debug (for example, Test.dll).

    4.  Open the source file (one or more) of Test.dll and set your breakpoints.

    5.  Type `cont` in the `jdb` window. The process will hit the breakpoint in Visual Studio.

To debug an applet using JDWP:

1.  Launch the Java Control Panel, open the **Java** tab and click **View**. On the Java Runtime Environment Settings window, specify the following in the **Runtime Parameters** field for the necessary platform:

    *   On Windows:

        ```
        Djavaplugin.trace=true -Xdebug -Xrunjdwp:transport=dt_shmem,address=debug,server=y,suspend=y

        ```

    *   On Oracle Solaris and Linux operating systems:

        ```
        Djavaplugin.trace=true -Xdebug -Xrunjdwp:transport=dt_shmem,address=8888,server=y,suspend=y

        ```

    When you launch a web browser and load an applet, the Java Plug-in will start in the debugging mode and wait for a debugger to attach to it at the address `debug` (on Windows) or `8888` (on Oracle Solaris and Linux operating systems).

2.  Open the command line and use the following command to run `jdb` and attach it to the running debug server.

    *   On Windows:

        ```
        jdb -attach 'debug'

        ```

    *   On Oracle Solaris and Linux operating systems:

        ```
        jdb -attach 8888

        ```

    After `jdb` initializes and attaches to `Test`, you can perform Java-level debugging.

3.  Set your breakpoints and run the applet. For example, to set the breakpoint at the beginning of the `func1` method in `MyApplet`, run the following command:

    ```
    stop in MyApplet.func1 run

    ```

    When the `jdb` utility hits the breakpoint, you will be able to inspect the environment in which the application is running and see if it is functioning as expected.


原文链接: [https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/introclientissues005.html](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/introclientissues005.html)










