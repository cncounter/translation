# JDWP 简介

对于调试Java程序来说,Java Debug Wire Protocol (JDWP, Java调试线协议)是不可多得的好东西。

## 使用JDWP调试应用程序的步骤如下:


### 1. 打开命令行,并将 jdk 安装路径下的 bin 目录添加到 `PATH` 环境变量。


### 2. 通过以下命令来启动想要调试的程序(本例中假设为`Test`): 


* 在Windows上:


    
        java -Xdebug -Xrunjdwp:transport=dt_shmem,address=debug,server=y,suspend=y Test

    

* 在Oracle Solaris 和/或 Linux操作系统上:


    
        java -Xdebug -Xrunjdwp:transport=dt_socket,address=8888,server=y,suspend=y Test

    

通过这些启动参数, `Test` 类将运行在调试模式下, 并等待调试器连接到JVM的调试地址: 在Windows上是 `debug`, 在Oracle Solaris 或 Linux操作系统上是 `8888`端口 。


### 3. 新开一个命令行窗口, 并使用以下命令来启动 “jdb” 并将它连接到正在运行的调试服务器:


* 在Windows上:


    
        jdb -attach 'debug'

    

* 在Oracle Solaris和Linux操作系统上:


    
        jdb -attach 8888

    

当 jdb初始化并连接到 `Test` 之后, 就可以进行 Java代码级(Java-level)的调试。


### 4. 设置断点,并运行应用程序。例如, 在 `Test` 的 `main` 方法开始位置设置断点, 可以执行以下命令:



    stop in Test.main run



当 `jdb` 工具执行到断点时, 就可以探查程序的当前上下文,以判断程序是否按预期正常运行。


### 5。(可选) 要进行 native-level 的调试, 请在运行JDWP的Java进程上附加 native debuggers 。


在 Oracle Solaris上, 可以使用 `dbx` 工具, 在 Linux 上, 可以使用 `gdb` 工具。


在Windows上, 则可以使用 Visual Studio, 进行 native-level 调试的步骤如下:

1. 打开 Visual Studio。
2. 点击 **Debug** 菜单, 选择 **Attach to Process**。然后选择运行JDWP的Java进程。
3. 点击 **Project** 菜单, 选择 **Settings** 项,然后打开 **Debug** 标签(tab). 在 **Category** 下拉列表中, 选择 **Additional DLLs**, 并添加您想要调试的 native DLL (例如, Test.dll)。
4. 打开 Test.dll 的源文件(一个或多个),并设置断点。
5. 在 `jdb` 窗口输入 `cont`, 则进程将在 Visual Studio 中设置的断点处暂停。


## 示例

在 Linux 下启动Tomcat的脚本中,可以使用:



	export JAVA_OPTS="-Xms1024m -Xmx1024m
	-verbose:gc -XX:+PrintGCDateStamps -XX:+PrintGCDetails 
	-Xloggc:$CATALINA_BASE/logs/gc.log -server
	-Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,suspend=n,server=y,address=12346"


相关参数的含义可以参考: [http://calvinliu.iteye.com/blog/876009](http://calvinliu.iteye.com/blog/876009)

关于 Idea 如何连接，请参考: [http://www.cnphp6.com/archives/33956](http://www.cnphp6.com/archives/33956)


原文链接: [https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/introclientissues005.html](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/introclientissues005.html)


