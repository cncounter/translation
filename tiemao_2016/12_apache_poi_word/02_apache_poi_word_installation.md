Apache POI Word - Installation


This chapter takes you through the process of setting up Apache POI on Windows and Linux based systems. Apache POI can be easily installed and integrated with your current Java environment, following a few simple steps without any complex setup procedures. User administration is required while installation.

System Requirements


<table class="table table-bordered">
<tbody><tr>
<th>JDK</th>
<td>Java SE 2 JDK 1.5 or above</td>
</tr>
<tr>
<th>Memory</th>
<td>1 GB RAM (recommended)</td>
</tr>
<tr>
<th>Disk Space</th>
<td>No minimum requirement</td>
</tr>
<tr>
<th>Operating System Version</th>
<td>Windows XP or above, Linux</td>
</tr>
</tbody></table>



Let us now proceed with the steps to install Apache POI.

Step 1: Verify your Java Installation
First of all, you need to have Java Software Development Kit (SDK) installed on your system. To verify this, execute any of the two commands mentioned below, depending on the platform you are working on.

If the Java installation has been done properly, then it will display the current version and specification of your Java installation. A sample output is given in the following table:


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

In case you do not have Java SDK, download its current version from http://www.oracle.com/technetwork/java/javase/downloads/index.html and have it installed.


Step 2: Set your Java Environment
Set the environment variable JAVA_HOME to point to the base directory location where Java is installed on your machine. For example,


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


Step 3: Install Apache POI Library
Download the latest version of Apache POI from http://poi.apache.org/download.html and unzip its contents to a folder from where the required libraries can be linked to your Java program. Let us assume the files are collected in a folder on C drive.

The following images shows the directories and the file structure inside the downloaded folder:


	002_01_jar_hirarchi.jpg


	002_02_jar_hirarchi_2.jpg


Add the complete path of the five jars as highlighted in the above image to the CLASSPATH.


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
















