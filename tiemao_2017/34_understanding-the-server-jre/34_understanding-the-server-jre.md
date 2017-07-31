# Understanding the Server JRE



The [Java SE download Page](http://www.oracle.com/technetwork/java/javase/downloads/index.html) offers downloads of the Java Runtime Environment ([JRE](http://www.oracle.com/technetwork/java/glossary-135216.html#jre)), the Server JRE, and the Java Development Kit ([JDK](http://www.oracle.com/technetwork/java/glossary-135216.html#jdk)).

The JRE is used to run a broad variety of Java programs including Java applications on desktops.  The JDK is for Java developers. It contains a complete JRE as described above and tools required to create Java programs, sign code, generate documentation, etc. The JDK also ships several tools meant to monitor and debug programs.

So where does the Server JRE fit in?  From the perspective of common server-side applications, the JRE is missing monitoring tools and, in the case of applications that compile Java source code at run-time, javac. On the other hand, the JDK includes additional functionality that system administrators may not need on their production systems like the Java Plugin for web browsers, auto update agents, and development tools like javadoc.

Enter the Server JRE: The Server JRE was designed for server-side applications by including just the commonly required features from the JRE and JDK. The Server JRE does not have a dedicated installer: It is simply a compressed directory for easier use.

**Will the Server JRE work for all server applications?**
No. If an application requires functionality outside of what is provided in the Server JRE, such as additional development tools or JavaFX, then the Server JRE would not be an adequate choice for that application.

**If the JDK is a super-set of the Server JRE, why not simply use that?**
Removing unused components decreases the potential attack surface, and the smaller size makes storage and deployment faster and easier.  On a Linux x64 system, the Server JRE 8 is around 40% of the size of the full JDK 8.

**My software vendor claims their applications needs the JDK, but can I use the Server JRE instead?**
Please contact your software vendor and ask them if you may use the Server JRE instead of the full JDK.  If you have the ability to experiment – you should try it.  The Server JRE is always recommended where possible over the JDK for running applications.

**Can I suggest changes for what is included in the Server JRE?**
Yes. The goal of the Server JRE is to provide the tools needed by most, but admittedly not all, server applications. We are constantly re-evaluating which components are included.



原文链接: <https://blogs.oracle.com/java-platform-group/understanding-the-server-jre>

