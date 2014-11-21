Java Heap转储文件分析工具jhat简介
==

jhat是用于分析Java堆转储文件的工具. 在JDK6u7之后成为JDK标配. 使用该命令需要具有一定的Java开发经验,官方不对此工具提供技术支持和客户服务。

## 用法: ##
	
	jHat [ options ] heap-dump-file

参数: 

- *options* 可选命令行参数,详情请参考下面的 [Options](#Options)

- *heap-dump-file*   要解析的Java堆转储文件(Java binary heap dump file)。 如果某个转储文件中包含了多份堆转储, 则可以在文件名之后加上 `#<number>` 的方式来指定解析哪一个 dump. 例如: `myfile.hprof#3`

## 详细说明 ##

**jhat** 命令可以解析Java堆转储文件,并启动一个 web server. 然后通过浏览器来查看/浏览 dump 出来的 heap.  jhat 命令支持预先设计的查询, 例如显示某个类的所有实例. 支持的查询语言叫做**对象查询语言**(OQL, Object Query Language)。 OQL有点类似SQL,专门用来查询堆转储。 OQL相关的帮助信息页面可以在浏览器访问 jhat 命令所提供的页面中看到. 如果使用默认端口, 则OQL帮助信息页面为: [http://localhost:7000/oqlhelp/](http://localhost:7000/oqlhelp/)

生成Java堆转储有多种方式:

- 使用 `jmap  -dump` 选项可以获得运行时的一个 heap dump. 详情参见: [jmap(1)](https://docs.oracle.com/javase/jp/8/technotes/tools/unix/jmap.html#CEGBCFBC)
- 使用 `jconsole` 选项通过 HotSpotDiagnosticMXBean 来获得一个运行时的堆转储。 请参考: [jconsole(1)](https://docs.oracle.com/javase/jp/8/technotes/tools/unix/jconsole.html#CACDDJCH) 以及 [`HotSpotDiagnosticMXBean` 的接口描述](http://docs.oracle.com/javase/8/docs/jre/api/management/extension/com/sun/management/HotSpotDiagnosticMXBean.html).  
- 在虚拟机启动时如果指定了 `-XX:+HeapDumpOnOutOfMemoryError` 选项, 发生 **OutOfMemoryError** 时, 会自动进行堆转储。
- 使用 `hprof` 命令。 请参考 [一个 Heap/CPU 性能分析工具](http://docs.oracle.com/javase/8/docs/technotes/samples/hprof.html)


##<a name="Options">Options</a>

##### -stack false|true

关闭对象分配调用栈跟踪。 如果分配位置信息在堆转储中不可用. 则必须将此标志设置为 false. 默认值为 `true`.

##### -refs false|true

关闭对象引用跟踪。 默认值为 `true`. 默认情况下,返回的指针是指向其他对象指定的对象,如反向链接或输入引用, 计算所有对象在堆中。

(Turns off tracking of references to objects. Default is true. By default, back pointers, which are objects that point to a specified object such as referrers or incoming references, are calculated for all objects in the heap.)

##### -port port-number

设置 jhat HTTP server 的端口号. 默认是 `7000`.

##### -exclude exclude-file

指定一个文件,列出数据成员,应该排除在可访问的对象查询。 例如,如果文件列表 java.lang.String.value ,然后,当从一个特定的对象访问的对象的列表 O 计算,参考路径,包括 java.lang.String.value 不考虑。

##### -baseline exclude-file

指定一个基线堆转储(baseline heap dump)。 在多个堆转储中有相同 object ID的对象不会被标记为 new. 其他对象标记为 new. 这在比较两个不同的堆转储时会很有用.

##### -debug int

设置 debug 级别. `0` 表示不输出调试信息。 更详细的debug信息输出模式需要设定更大的值。

##### -version

启动后只显示版本信息就退出

##### -h

启动后只显示帮助信息就退出.

##### -help

启动后只显示帮助信息就退出.

##### -J< flag > 

因为 jhat 命令实际上会启动一个JVM来执行, 通过 **-J** 可以在启动JVM时传入一些启动参数<flag>. 例如, `-J-Xmx512m` 则指定运行 jhat 的Java虚拟机使用的最大堆内存为 512 MB.

## 另请参阅: ##

* [jmap(1)](https://docs.oracle.com/javase/jp/8/technotes/tools/unix/jmap.html#CEGBCFBC)
* [jconsole(1)](https://docs.oracle.com/javase/jp/8/technotes/tools/unix/jconsole.html#CACDDJCH)
* [一个 Heap/CPU 性能分析工具](http://docs.oracle.com/javase/8/docs/technotes/samples/hprof.html)







原文链接: [https://docs.oracle.com/javase/jp/8/technotes/tools/unix/jhat.html](https://docs.oracle.com/javase/jp/8/technotes/tools/unix/jhat.html)

原文日期: 2014-05-04

翻译日期: 2014-11-21

翻译人员: [铁锚](http://blog.csdn.net/renfufei)