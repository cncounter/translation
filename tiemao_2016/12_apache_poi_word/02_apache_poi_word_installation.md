# Apache POI Word 安装

Apache POI Word - Installation


This chapter takes you through the process of setting up Apache POI on Windows and Linux based systems. Apache POI can be easily installed and integrated with your current Java environment, following a few simple steps without any complex setup procedures. User administration is required while installation.

本章将带你完成在 Windows 和 Linux 系统上安装 Apache POI 的过程。只需几个简单步骤, 无需任何复杂的配置流程, 就可以轻松安装 Apache POI 并将其与你当前的 Java 环境集成。安装过程中需要用户管理员权限。

System Requirements

系统要求


<table class="table table-bordered">
<tbody><tr>
<th>JDK</th>
<td>Java SE 2 JDK 1.5 或更高版本</td>
</tr>
<tr>
<th>Memory</th>
<td>1 GB RAM(推荐)</td>
</tr>
<tr>
<th>Disk Space</th>
<td>无最低要求</td>
</tr>
<tr>
<th>Operating System Version</th>
<td>Windows XP 或更高版本, Linux</td>
</tr>
</tbody></table>



Let us now proceed with the steps to install Apache POI.

下面我们继续介绍安装 Apache POI 的步骤。

Step 1: Verify your Java Installation

第 1 步: 验证 Java 是否已安装

First of all, you need to have Java Software Development Kit (SDK) installed on your system. To verify this, execute any of the two commands mentioned below, depending on the platform you are working on.

首先, 你的系统上需要已安装 Java Software Development Kit(SDK)。要验证这一点, 请根据你所使用的平台, 执行下面两条命令中的任意一条。

If the Java installation has been done properly, then it will display the current version and specification of your Java installation. A sample output is given in the following table:

如果 Java 安装正确, 它会显示你当前 Java 安装的版本和规格。下表给出了一份示例输出:


<table class="table table-bordered">
<tbody><tr>
<th>Platform</th>
<th>Command</th>
<th>Sample Output</th>
</tr>
<tr>
<td>Windows</td>
<td><p>Open command console and type:</p>
<p><b>\&gt;java –version</b></p></td>
<td><p>Java version "1.7.0_60"</p>
<p>Java (TM) SE Run Time Environment (build 1.7.0_60-b19)</p>
<p>Java Hotspot (TM) 64-bit Server VM (build 24.60-b09,mixed mode)</p></td>
</tr>
<tr>
<td>Linux</td>
<td><p>Open command terminal and type:</p>
<p><b>$java –version</b></p></td>
<td><p>java version "1.7.0_25"</p>
<p>Open JDK Runtime Environment (rhel-2.3.10.4.el6_4-x86_64)</p>
<p>Open JDK 64-Bit Server VM (build 23.7-b01, mixed mode)</p></td>
</tr>
</tbody></table>



We assume that the readers of this tutorial have Java SDK version 1.7.0_60 installed on their system.

我们假设本教程的读者在自己系统上已安装 Java SDK 1.7.0_60 版本。

In case you do not have Java SDK, download its current version from http://www.oracle.com/technetwork/java/javase/downloads/index.html and have it installed.

如果你还没有 Java SDK, 请从 http://www.oracle.com/technetwork/java/javase/downloads/index.html 下载其当前版本并安装。


Step 2: Set your Java Environment

第 2 步: 设置 Java 环境

Set the environment variable JAVA_HOME to point to the base directory location where Java is installed on your machine. For example,

将环境变量 JAVA_HOME 设置为指向你机器上 Java 安装的基础目录位置。例如:


<table class="table table-bordered">
<tbody><tr>
<th>Platform</th>
<th>Description</th>
</tr>
<tr>
<td>Windows</td>
<td>Set JAVA_HOME to C:\ProgramFiles\java\jdk1.7.0_60</td>
</tr>
<tr>
<td>Linux</td>
<td>Export  JAVA_HOME=/usr/local/java-current</td>
</tr>
</tbody></table>


Append the full path of Java compiler location to the System Path.

将 Java 编译器位置的完整路径追加到系统 Path 中。


<table class="table table-bordered">
<tbody><tr>
<th>Platform</th>
<th>Description</th>
</tr>
<tr>
<td>Windows</td>
<td>Append the String "C:\Program Files\Java\jdk1.7.0_60\bin" to the end of the system variable PATH.</td>
</tr>
<tr>
<td>Linux</td>
<td>Export PATH=$PATH:$JAVA_HOME/bin/</td>
</tr>
</tbody></table>

Execute the command java - version from the command prompt as explained above.

如上所述, 在命令提示符下执行 java - version 命令。


Step 3: Install Apache POI Library

第 3 步: 安装 Apache POI 库

Download the latest version of Apache POI from http://poi.apache.org/download.html and unzip its contents to a folder from where the required libraries can be linked to your Java program. Let us assume the files are collected in a folder on C drive.

从 http://poi.apache.org/download.html 下载最新版本的 Apache POI, 并将其内容解压到一个文件夹, 之后即可从这个文件夹把所需的类库链接到你的 Java 程序。我们假设这些文件都放在 C 盘的一个文件夹中。

The following images shows the directories and the file structure inside the downloaded folder:

下图展示了下载后的文件夹内的目录和文件结构:


	002_01_jar_hirarchi.jpg


	002_02_jar_hirarchi_2.jpg


Add the complete path of the five jars as highlighted in the above image to the CLASSPATH.

把上图中高亮显示的五个 jar 的完整路径添加到 CLASSPATH 中。


<table class="table table-bordered">
<tbody><tr>
<th>Platform</th>
<th>Description</th>
</tr>
<tr>
<td>Windows</td>
<td><p>Append the following strings to the end of the user variable CLASSPATH:</p>
<p>“C:\poi-3.9\poi-3.9-20121203.jar;”</p> 
<p>“C:\poi-3.9\poi-ooxml-3.9-20121203.jar;”</p> 
<p>“C:\poi-3.9\poi-ooxml-schemas-3.9-20121203.jar;”</p> 
<p>“C:\poi-3.9\ooxml-lib\dom4j-1.6.1.jar;”</p>  
<p>“C:\poi-3.9\ooxml-lib\xmlbeans-2.3.0.jar;.;” </p></td>
</tr>
<tr>
<td>Linux</td>
<td><p>Export CLASSPATH=$CLASSPATH:</p>
<p>/usr/share/poi-3.9/poi-3.9-20121203.tar:</p>
<p>/usr/share/poi-3.9/poi-ooxml-schemas-3.9-20121203.tar:</p>
<p>/usr/share/poi-3.9/poi-ooxml-3.9-20121203.tar:</p>
<p>/usr/share/poi-3.9/ooxml-lib/dom4j-1.6.1.tar:</p>
<p>/usr/share/poi-3.9/ooxml-lib/xmlbeans-2.3.0.tar</p></td>
</tr>
</tbody></table>
