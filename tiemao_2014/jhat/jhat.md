JDK内置故障排查工具: jhat 简介
==

> 更详细的校对版-请转到Windows版本系列: <https://github.com/cncounter/java-tools-cn/blob/master/15_Troubleshooting/jhat.md>

jhat 是Java堆分析工具(Java heap Analyzes Tool). 在JDK6u7之后成为JDK标配. 使用该命令需要有一定的Java开发经验,官方不对此工具提供技术支持和客户服务。

## 用法: ##
	
	jhat [ options ] heap-dump-file

参数: 

- ***options*** 可选命令行参数,请参考下面的 [Options](#Options)

- ***heap-dump-file***   要查看的二进制Java堆转储文件(Java binary heap dump file)。 如果某个转储文件中包含了多份 heap dumps, 可在文件名之后加上 `#<number>` 的方式指定解析哪一个 dump, 如: `myfile.hprof#3`


## 示例 ##

使用jmap工具转储堆内存、可以使用如下方式: 

```
jmap -dump:file=DumpFileName.txt,format=b <pid>
```
	
例如: 

```
jmap -dump:file=D:/javaDump.hprof,format=b 3614
Dumping heap to D:\javaDump.hprof ...
Heap dump file created
```

其中, 3614 是java进程的ID,一般来说, jmap 需要和目标JVM的版本一致或者兼容,才能成功导出. 如果不知道如何使用,直接输入 `jmap`, 或者 `jmap -h` 可看到提示信息.

然后分析时使用jhat命令,如下所示:

```
jhat -J-Xmx1024m D:/javaDump.hprof
...... 其他信息 ...
Snapshot resolved.
Started HTTP server on port 7000
Server is ready.
```

使用参数 `-J-Xmx1024m` 是因为默认JVM的堆内存可能不足以加载整个dump 文件. 可根据需要进行调整. 根据提示知道端口号是 7000,

接着使用浏览器访问 <http://localhost:7000/> 即可看到相关信息.

## 详细说明 ##

**jhat** 命令解析Java堆转储文件,并启动一个 web server. 然后用浏览器来查看/浏览 dump 出来的 heap.  jhat 命令支持预先设计的查询, 比如显示某个类的所有实例. 还支持 **对象查询语言**(OQL, Object Query Language)。 OQL有点类似SQL,专门用来查询堆转储。 OQL相关的帮助信息可以在 jhat 命令所提供的服务器页面最底部. 如果使用默认端口, 则OQL帮助信息页面为: [http://localhost:7000/oqlhelp/](http://localhost:7000/oqlhelp/)

Java生成堆转储的方式有多种:

- 使用 `jmap  -dump` 选项可以在JVM运行时获取 heap dump. (可以参考上面的示例)详情参见: [jmap(1)](https://docs.oracle.com/javase/jp/8/technotes/tools/unix/jmap.html#CEGBCFBC)
- 使用 `jconsole` 选项通过 HotSpotDiagnosticMXBean 从运行时获得堆转储。 请参考: [jconsole(1)](https://docs.oracle.com/javase/jp/8/technotes/tools/unix/jconsole.html#CACDDJCH) 以及 `HotSpotDiagnosticMXBean` 的接口描述: [http://docs.oracle.com/javase/8/docs/jre/api/management/extension/com/sun/management/HotSpotDiagnosticMXBean.html](http://docs.oracle.com/javase/8/docs/jre/api/management/extension/com/sun/management/HotSpotDiagnosticMXBean.html).  
- 在虚拟机启动时如果指定了 `-XX:+HeapDumpOnOutOfMemoryError` 选项, 则抛出 **OutOfMemoryError** 时, 会自动执行堆转储。
- 使用 `hprof` 命令。 请参考 A Heap/CPU Profiling Tool:  [http://docs.oracle.com/javase/8/docs/technotes/samples/hprof.html](http://docs.oracle.com/javase/8/docs/technotes/samples/hprof.html)


##<a name="Options">Options</a>

##### -stack false|true

关闭对象分配调用栈跟踪(tracking object allocation call stack)。 如果分配位置信息在堆转储中不可用. 则必须将此标志设置为 false. 默认值为 `true`.

##### -refs false|true

关闭对象引用跟踪(tracking of references to objects)。 默认值为 `true`. 默认情况下, 返回的指针是指向其他特定对象的对象,如反向链接或输入引用(referrers or incoming references), 会统计/计算堆中的所有对象。

##### -port port-number

设置 jhat HTTP server 的端口号. 默认值 `7000`.

##### -exclude exclude-file

指定对象查询时需要排除的数据成员列表文件(a file that lists data members that should be excluded from the reachable objects query)。 例如, 如果文件列列出了 `java.lang.String.value` , 那么当从某个特定对象 Object o 计算可达的对象列表时, 引用路径涉及 `java.lang.String.value` 的都会被排除。

##### -baseline exclude-file

指定一个基准堆转储(baseline heap dump)。 在两个 heap dumps 中有相同 object ID 的对象会被标记为不是新的(marked as not being new). 其他对象被标记为新的(new). 在比较两个不同的堆转储时很有用.

##### -debug int

设置 debug 级别. `0` 表示不输出调试信息。 值越大则表示输出更详细的 debug 信息.

##### -version

启动后只显示版本信息就退出

##### -h

显示帮助信息并退出. 同 `-help`

##### -help

显示帮助信息并退出. 同 `-h`

##### -J< flag > 

因为 jhat 命令实际上会启动一个JVM来执行, 通过 **-J** 可以在启动JVM时传入一些启动参数<flag>. 例如, `-J-Xmx512m` 则指定运行 jhat 的Java虚拟机使用的最大堆内存为 512 MB. 如果需要使用多个JVM启动参数,则传入多个 -Jxxxxxx.

## 另请参阅: ##

* [jmap(1)](https://docs.oracle.com/javase/jp/8/technotes/tools/unix/jmap.html#CEGBCFBC)
* [jconsole(1)](https://docs.oracle.com/javase/jp/8/technotes/tools/unix/jconsole.html#CACDDJCH)
* [一个 Heap/CPU 性能分析工具](http://docs.oracle.com/javase/8/docs/technotes/samples/hprof.html)







原文链接:  <https://docs.oracle.com/javase/8/docs/technotes/tools/unix/jhat.html>

原文日期: 2014-05-04

翻译日期: 2014-11-21

翻译人员: [铁锚](http://blog.csdn.net/renfufei)

> 更详细的校对版-请转到Windows版本系列: <https://github.com/cncounter/java-tools-cn/blob/master/15_Troubleshooting/jhat.md>
