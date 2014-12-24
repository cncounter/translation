JDK7的HotSpot启动参数
==

**请注意: 此文档只适用于 JDK 7 及更早期版本. 如果是 JDK 8,请参考 [Windows](http://docs.oracle.com/javase/8/docs/technotes/tools/windows/java.html), [Solaris](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html), [Linux](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html) 以及 [Mac OS X](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html) 版本参考手册的相关页面.**


本文档展示说明会影响Java HotSpot虚拟机性能特征的典型命令行选项和环境变量。除非另外注明,本文档中的所有信息都适用于 Java HotSpot Client VM 和 Java HotSpot Server VM.


## Java HotSpot VM 参数分类 ##
  
Java HotSpot VM 识别的标准参数在 Java Application Launcher 参考手册中描述:  [Windows Java参考手册](http://docs.oracle.com/javase/7/docs/technotes/tools/windows/java.html) 和 [Solaris & Linux Java参考手册](http://docs.oracle.com/javase/7/docs/technotes/tools/solaris/java.html). 本文档只介绍 Java HotSpot VM 识别的非标准参数(non-standard):

- 以 `-X` 开头的参数选项是非标准的(non-standard, 不保证所有的JVM实现都支持), 而且如果后续版本的JDK有变更,并不一定另行通知用户.
- 以 `-XX` 开头指定的选项是不固定的(not stable),如果有变更,也不另行通知.

JDK 1.3.0 及以下版本如果想要使用Java HotSpot VM, 请参考 [Java HotSpot Equivalents of Exact VM flags](http://www.oracle.com/technetwork/java/javase/tech/exactoptions-jsp-141536.html).

## 常用的 -XX 参数 ##
  
下面列出的默认值是在Solaris Sparc的Java SE 6 下面附带了  `-server` 选项时显示的. 有些选项的默认值在各种架构/操作系统/JVM版本(architecture/OS/JVM version)中是不同的. 如果具有不同的默认值,则会在说明部分指出.

- 布尔型(Boolean)的选项,开启时使用加号: `-XX:+<option>` ;关闭则使用减号: `-XX:-<option>`.(这里有一个Disa,不知道什么意思)
- 数字型(Numeric)的选项,使用等号设置: `-XX:<option>=<number>`. 数字类型支持缩略符号 '`m`' 或 '`M`' 表示MB(megabytes), '`k`' 或 '`K`' 表示KB(kilobytes), 还有 'g' 或 'G' 表示GB(gigabytes). 例如, 32k 等价于 32768.
- 字符串型(String)的选项,使用等号设置: `-XX:<option>=<string>`, 通常用于指定文件,路径,或者命令列表

标记为可管理的那些标志位(Flags),都可以通过JDK管理接口(com.sun.management.HotSpotDiagnosticMXBean API) 以及 JConsole动态修改.

在 [监控和管理Java SE 6 系统平台](http://www.oracle.com/technetwork/articles/javase/monitoring-141801.html#Heap_Dump) 一文中, Heap Dump 小节的 Figure 3 展示了一个示例. 可管理的标志位(flags) 还可以使用 [jinfo -flag](http://docs.oracle.com/javase/6/docs/technotes/tools/share/jinfo.html) 来设置. 


JVM选项大致可以分为以下几类:

- [Behavioral options](http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html#BehavioralOptions) 虚拟机行为控制选项, 改变JVM的基本行为.
- [Garbage First (G1)](http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html#G1Options) G1垃圾收集器选项(Garbage Collection Options)
- [Performance tuning](http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html#PerformanceTuning) 性能调优选项.
- [Debugging options](http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html#DebuggingOptions) 调试相关选项, 常用来跟踪、打印、或输出JVM信息(tracing, printing, or output of VM information).
  
## 虚拟机行为控制选项(Behavioral Options) ##


<table width="100%" cellspacing="1" cellpadding="1" border="1">
	<tbody>
		<tr>
			<th width="45%" valign="top" align="left">选项与默认值</th><th width="55%" valign="top" align="left">说明</th>
		</tr>
		<tr valign="top">
			<td>-XX:-AllowUserSignalHandlers</td><td>允许应用程序注册信号量处理器(installs signal handlers). (只适用于 Solaris 以及 Linux.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:AltStackSize=16384</td><td>备用(Alternate)信号栈(signal stack)大小.(单位是Kbytes). (只适用于 Solaris, 从 5.0 起已被移除.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-DisableExplicitGC</td><td>默认情况下应用程序调用 System.gc()是启用(enable)的(-XX:-DisableExplicitGC). 如果使用 -XX:+DisableExplicitGC 则禁止(disable)调用  System.gc(). 注意 JVM 在必要时仍然会执行垃圾回收.</td>
		</tr>
		<tr valign="top">
			<td>-XX:+FailOverToOldVerifier</td><td>当新类型的检查器失败时故障转移到老的验证程序(verifier). (开始引入: 6.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:+HandlePromotionFailure</td><td>年轻代的垃圾收集(youngest generation collection)不需要保证所有的存活对象都得到提升(a guarantee of full promotion). (开始引入: 1.4.2 update 11) [5.0 及之前的默认值: false.]</td>
		</tr>
		<tr valign="top">
			<td>-XX:+MaxFDLimit</td><td>提升(Bump)文件描述符(file descriptors)的数量到最大值. (仅 Solaris 有效.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:PreBlockSpin=10</td><td>使用 -XX:+UseSpinning 多线程自旋锁优化的自旋次数(Spin count variable). 用于控制进入操作系统线程同步代码前,所允许的最大自旋次数 (Controls the maximum spin iterations allowed). (开始引入: 1.4.2.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-RelaxAccessControlCheck</td><td>放宽(Relax)验证器(verifier)中的访问控制检查(access control checks). (开始引入: 6.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:+ScavengeBeforeFullGC</td><td>在full GC之前先执行一次年轻代GC. (开始引入: 1.4.1.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseAltSigs</td><td>为JVM内部信号使用备用信号(alternate signals)来代替(instead of) SIGUSR1和SIGUSR2 . (开始引入: 1.3.1 update 9, 1.4.1. 只适用于 Solaris.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseBoundThreads</td><td>绑定用户级别的线程到内核线程(Bind user level threads to kernel threads). (只适用于 Solaris.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-UseConcMarkSweepGC</td><td>对老年代使用CMS垃圾收集器. (开始引入: 1.4.1)</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseGCOverheadLimit</td><td>使用一种政策,限制在抛出OutOfMemory错误前JVM花费在GC上的那部分时间. (开始引入: 6.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseLWPSynchronization</td><td>使用 LWP-based 来取代基于线程的同步(thread based synchronization). (开始引入: 1.4.0. 只适用于 Solaris only.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-UseParallelGC</td><td>使用并行垃圾收集(parallel garbage collection)来清扫内存(scavenges). (开始引入: 1.4.1)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-UseParallelOldGC</td><td>对 FullGC使用并行垃圾收集. 如果设置 -XX:+UseParallelGC 则会自动启用本选项. (开始引入: 5.0 update 6.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-UseSerialGC</td><td>使用串行垃圾收集(serial garbage collection). (开始引入: 5.0.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-UseSpinning</td><td>进入操作系统线程同步代码之前,在Java监视器锁(monitor)上启用自旋锁优化(naive spinning). (只适用于 1.4.2 以及 5.0.) [1.4.2, multi-processor Windows platforms: true]</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseTLAB</td><td>使用 thread-local 对象分配 (从 1.4.0 开始引入, 使用的是 UseTLE 优先.) [1.4.2 及更早版本, x86架构或者带 -client 选项时为: false]</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseSplitVerifier</td><td>使用新型 checker, 基于 StackMapTable 特性(attributes). (开始引入: 5.0.)[5.0: false]</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseThreadPriorities</td><td>使用本机线程优先级(native thread priorities).</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseVMInterruptibleIO</td><td>对于会导致OS_INTRPT的 I/O 操作, 在EINTR之前/时进行线程中断. (开始引入: 6. 只适用于 Solaris.)</td>
		</tr>
	</tbody>
</table>




## G1垃圾收集器选项 ##

<table width="100%" cellspacing="1" cellpadding="1" border="1">
	<tbody>
		<tr>
			<th width="45%" valign="top" align="left">选项与默认值</th><th width="55%" valign="top" align="left">说明</th>
		</tr>
		<tr valign="top">
			<td>-XX:+UseG1GC</td><td>使用G1收集器(垃圾优先,Garbage First)</td>
		</tr>
		<tr valign="top">
			<td>-XX:MaxGCPauseMillis=n</td><td>设置最大GC停顿时间目标值. 这是一个软指标, JVM会尽量去努力达成.</td>
		</tr>
		<tr valign="top">
			<td>-XX:InitiatingHeapOccupancyPercent<span id="MainContent" class="wcm-region" style="display: inline">=n</span></td><td>启动并发GC周期(concurrent GC cycle)时整个堆内存的占用百分比. 垃圾收集器用它来根据整个堆内存(entire heap)的占用比触发一次并发GC周期(concurrent GC cycle) , 而不只是某一代内存的占用比 (如G1). 值为 0 则表示一直执行GC('do constant GC cycles'). 默认值为 45.</td>
		</tr>
		<tr valign="top">
			<td>-XX:NewRatio=n</td><td>老年代与年轻代(old/new generation)空间比值. 默认值为 2.</td>
		</tr>
		<tr valign="top">
			<td>-XX:SurvivorRatio=n</td><td>新生区与存活区(eden/survivor)的比值. 默认值为 8.</td>
		</tr>
		<tr valign="top">
			<td>-XX:MaxTenuringThreshold=n</td><td>对象在年轻代中存活周期(tenuring threshold)的最大值. 默认值为 15.</td>
		</tr>
		<tr valign="top">
			<td>-XX:ParallelGCThreads=n</td><td>设置垃圾收集器在并行阶段(parallel phases)使用的线程数量. 各个平台上的JVM默认值会有很大差别.</td>
		</tr>
		<tr valign="top">
			<td>-XX:ConcGCThreads=n</td><td>并发垃圾收集器(concurrent garbage collectors)所使用的线程数量. 各个平台上的JVM默认值不相同.</td>
		</tr>
		<tr valign="top">
			<td>-XX:G1ReservePercent<span id="MainContent2" class="wcm-region" style="display: inline">=n</span></td><td>设置作为假天花板的保留堆内存大小, 用来降低转移失败(promotion failure)发生的可能性. 默认值为 10.</td>
		</tr>
		<tr valign="top">
			<td>-XX:G1HeapRegionSize<span id="MainContent3" class="wcm-region" style="display: inline">=n</span></td><td>使用G1时Java堆内存被切分为大小相等的很多块(regions). 这个值设定每个单独的块(individual sub-divisions)的大小. 默认这个参数的值由启动时堆内存大小计算优化得出. 允许的最小值为 1Mb,最大为 32Mb.</td>
		</tr>
	</tbody>
</table>


## 性能调优选项(Performance Options) ##

<table width="100%" cellspacing="1" cellpadding="1" border="1">
	<tbody>
		<tr>
			<th width="45%" valign="top" align="left">选项与默认值</th><th width="55%" valign="top" align="left">说明</th>
		</tr>
		<tr valign="top">
			<td>-XX:+AggressiveOpts</td><td>Turn on point performance compiler optimizations that are expected to be default in upcoming releases. (从 5.0 update 6 开始引入.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:CompileThreshold=10000</td><td>Number of method invocations/branches before compiling [-client: 1,500]</td>
		</tr>
		<tr valign="top">
			<td>-XX:LargePageSizeInBytes=4m</td><td>Sets the large page size used for the Java heap. (从 1.4.0 update 1 开始引入.) [amd64: 2m.]</td>
		</tr>
		<tr valign="top">
			<td>-XX:MaxHeapFreeRatio=70</td><td>Maximum percentage of heap free after GC to avoid shrinking.</td>
		</tr>
		<tr valign="top">
			<td>-XX:MaxNewSize=size</td><td>Maximum size of new generation (in bytes). Since 1.4, MaxNewSize is computed as a function of NewRatio. [1.3.1 Sparc: 32m; 1.3.1 x86: 2.5m.]</td>
		</tr>
		<tr valign="top">
			<td>-XX:MaxPermSize=64m</td><td>Size of the Permanent Generation.&nbsp; [5.0 and newer: 64 bit VMs are scaled 30% larger; 1.4 amd64: 96m; 1.3.1 -client: 32m.]</td>
		</tr>
		<tr valign="top">
			<td>-XX:MinHeapFreeRatio=40</td><td>Minimum percentage of heap free after GC to avoid expansion.</td>
		</tr>
		<tr valign="top">
			<td>-XX:NewRatio=2</td><td>Ratio of old/new generation sizes. [Sparc -client: 8; x86 -server: 8; x86 -client: 12.]-client: 4 (1.3) 8 (1.3.1+), x86: 12]</td>
		</tr>
		<tr valign="top">
			<td>-XX:NewSize=2m</td><td>Default size of new generation (in bytes) [5.0 and newer: 64 bit VMs are scaled 30% larger; x86: 1m; x86, 5.0 and older: 640k]</td>
		</tr>
		<tr valign="top">
			<td>-XX:ReservedCodeCacheSize=32m</td><td>Reserved code cache size (in bytes) - maximum code cache size. [Solaris 64-bit, amd64, and -server x86: 2048m; in 1.5.0_06 and earlier, Solaris 64-bit and amd64: 1024m.]</td>
		</tr>
		<tr valign="top">
			<td>-XX:SurvivorRatio=8</td><td>Ratio of eden/survivor space size [Solaris amd64: 6; Sparc in 1.3.1: 25; other Solaris platforms in 5.0 and earlier: 32]</td>
		</tr>
		<tr valign="top">
			<td>-XX:TargetSurvivorRatio=50</td><td>Desired percentage of survivor space used after scavenge.</td>
		</tr>
		<tr valign="top">
			<td>-XX:ThreadStackSize=512</td><td>Thread Stack Size (in Kbytes). (0 means use default stack size) [Sparc: 512; Solaris x86: 320 (was 256 prior in 5.0 and earlier); Sparc 64 bit: 1024; Linux amd64: 1024 (was 0 in 5.0 and earlier); all others 0.]</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseBiasedLocking</td><td>Enable biased locking. For more details, see this <a href="/technetwork/java/tuning-139912.html#section4.2.5">tuning example</a>. (从 5.0 update 6 开始引入.) [5.0: false]</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseFastAccessorMethods</td><td>Use optimized versions of Get&lt;Primitive&gt;Field.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-UseISM</td><td>Use Intimate Shared Memory. [对 non-Solaris 平台不可用.] For details, see <a href="/technetwork/java/ism-139376.html">Intimate Shared Memory</a>.</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseLargePages</td><td>Use large page memory. (从 5.0 update 5 开始引入.) For details, see <a href="/technetwork/java/javase/tech/largememory-jsp-137182.html">Java Support for Large Memory Pages</a>.</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseMPSS</td><td>Use Multiple Page Size Support w/4mb pages for the heap. Do not use with ISM as this replaces the need for ISM. (从 1.4.0 update 1 开始引入, 只适用于 Solaris 9 and newer.) [1.4.1 and earlier: false]</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseStringCache</td><td>为一般分配的字符串启用缓存.
			<br>
			&nbsp;</td>
		</tr>
		<tr valign="top">
			<td>-XX:AllocatePrefetchLines=1</td><td>Number of cache lines to load after the last object allocation using prefetch instructions generated in JIT compiled code. Default values are 1 if the last allocated object was an instance and 3 if it was an array.
			<br>
			&nbsp;</td>
		</tr>
		<tr valign="top">
			<td>-XX:AllocatePrefetchStyle=1</td><td> 为预取指令(prefetch instructions)生成代码样式(code style).
			<br>
			0 - 不生成(generate*d*)预取指令,
			<br>
			1 - 在每次分配(each allocation)之后执行预取指令,
			<br>
			2 - use TLAB allocation watermark pointer to gate when prefetch instructions are executed.
			<br>
			&nbsp;</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseCompressedStrings</td><td>对于可以用纯ASCII字符表示的 Strings，使用 byte[]. (Java 6 Update 21  性能版? 引入【Performance Release】)
			<br>
			&nbsp;</td>
		</tr>
		<tr valign="top">
			<td>-XX:+OptimizeStringConcat</td><td>如有可能,优化字符串连接操作(Optimize String concatenation operations). (Java 6 Update 20 开始引进)
			<br>
			&nbsp;</td>
		</tr>
	</tbody>
</table>


## 调试相关选项(Debugging Options) ##

<table width="100%" cellspacing="1" cellpadding="1" border="1">
	<tbody>
		<tr valign="top">
			<th width="45%" valign="top" align="left">选项与默认值</th><th width="55%" valign="top" align="left">说明</th>
		</tr>
		<tr valign="top">
			<td>-XX:-CITime</td><td>打印 JIT 编译(器)花费的时间. (从 1.4.0 开始引入.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:ErrorFile=./hs_err_pid&lt;pid&gt;.log</td><td>如果发生错误,将错误数据保存到此文件. (从 6 开始引入.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-ExtendedDTraceProbes</td><td>启用性能影响(performance-impacting) <a href="http://docs.oracle.com/javase/6/docs/technotes/guides/vm/dtrace.html">dtrace</a> 探测. (从 6 开始引入. 只适用于 Solaris.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:HeapDumpPath=./java_pid&lt;pid&gt;.hprof</td><td>堆转储(heap dump)的文件或目录(Path to directory or filename ). <em>可动态配置(Manageable)</em>. (从 1.4.2 update 12 , 5.0 update 7 开始引入.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-HeapDumpOnOutOfMemoryError</td><td>在抛出 java.lang.OutOfMemoryError 时转储(dump)堆内存到文件中. <em>可动态配置(Manageable)</em>. (从 1.4.2 update 12, 5.0 update 7 开始引入.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:OnError="&lt;cmd args&gt;;&lt;cmd args&gt;"</td><td>在致命错误(fatal error)发生时运行用户指定的命令(user-defined commands). (从 1.4.2 update 9 开始引入.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:OnOutOfMemoryError="&lt;cmd args&gt;;
			<br clear="none">
			&lt;cmd args&gt;"</td><td>在首次抛出 OutOfMemoryError 时运行用户指定的命令(user-defined commands). (从 1.4.2 update 12 , 以及 JDK 6 开始引入)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintClassHistogram</td><td>在按下 Ctrl-Break 时打印出类实例直方图(Print a histogram of class instances on Ctrl-Break). <em>可动态配置(Manageable)</em>. (从 1.4.2 开始引入.) 命令 <a href="http://docs.oracle.com/javase/6/docs/technotes/tools/share/jmap.html">jmap -histo</a> 提供了等价的功能.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintConcurrentLocks</td><td>在使用 Ctrl-Break 进行线程转储时(thread dump)打印 java.util.concurrent 锁. <em>可动态配置(Manageable)</em>. (从 JDK6 开始引入.) 命令 <a href="http://docs.oracle.com/javase/6/docs/technotes/tools/share/jstack.html">jstack -l</a> 提供了等价的功能.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintCommandLineFlags</td><td>打印命令行中的参数标志(flags). (从 5.0 开始引入.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintCompilation</td><td>当一个方法被编译时打印消息.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintGC</td><td>在GC时打印消息. <em>可动态配置(Manageable)</em>.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintGCDetails</td><td>在GC时打印更多细节信息. <em>可动态配置(Manageable)</em>. (从 1.4.0 开始引入.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintGCTimeStamps</td><td>在GC时打印时间戳. <em>可动态配置(Manageable)</em> (从 1.4.0 开始引入.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintTenuringDistribution</td><td>打印对象生命周期年龄信息(tenuring age information).</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintAdaptiveSizePolicy</td><td>启用自适应分代大小信息的打印(Enables printing of information about adaptive generation sizing).</td>
		</tr>
		<tr valign="top">
			<td>-XX:-TraceClassLoading</td><td>跟踪(Trace)类的加载.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-TraceClassLoadingPreorder</td><td>跟踪所有类加载引用顺序(Trace all classes loaded in order referenced) (不是 loaded 状态). (从 1.4.2 开始引入.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-TraceClassResolution</td><td>跟踪常量池解析(Trace constant pool resolutions). (从 1.4.2 开始引入.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-TraceClassUnloading</td><td>跟踪(Trace)类的卸载(unloading).</td>
		</tr>
		<tr valign="top">
			<td>-XX:-TraceLoaderConstraints</td><td>跟踪加载器限制记录(Trace recording of loader constraints). (从 Java6 开始引入.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:+PerfDataSaveToFile</td><td>在退出时保存 jvmstat 二进制数据.</td>
		</tr>
		<tr valign="top">
			<td>-XX:ParallelGCThreads=n</td><td>设置 年轻代与老年代垃圾收集的并行线程数. 各个平台上的JVM默认值会有很大差别.</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseCompressedOops</td><td>启用指针压缩(对象引用使用32位偏移量表示,而不是64位指针),在Java堆内存大小 小于 32gb 时用来对64位JVM进行优化.</td>
		</tr>
		<tr valign="top">
			<td>-XX:+AlwaysPreTouch</td><td> 在 JVM 初始化期间对Java堆内存进行摸底(Pre-touch). 因此能可以在初始化期间将堆内存的每一页(Every page of the heap)都写0 (demand-zeroed),而不必等到应用程序执行时再慢慢进行.</td>
		</tr>
		<tr valign="top">
			<td>-XX:AllocatePrefetchDistance=n</td><td>为对象内存分配(object allocation)设置预取距离(prefetch distance). 即将写入新对象值的内存,会连同最近分配的对象地址后一段距离(单位: 字节 byte)被一起预取到 cache 中. 每个 Java 线程都有自己的分配点(allocation point). 各个平台上的JVM默认值会有很大差别.</td>
		</tr>
		<tr valign="top">
			<td>-XX:InlineSmallCode=n</td><td>只有在以前编译好的方法生成的本地机器码数量小于这个值时才会被内联(Inline). 各个平台上的JVM默认值会有很大差别.</td>
		</tr>
		<tr valign="top">
			<td>-XX:MaxInlineSize=35</td><td>一个方法要被内联(inlined),最多允许有多少个字节码(Maximum bytecode size).</td>
		</tr>
		<tr valign="top">
			<td>-XX:FreqInlineSize=n</td><td>一个频繁使用的方法(frequently executed method)要被内联(inlined),最多允许有多少个字节码(Maximum bytecode size). 各个平台上的JVM默认值会有很大差别.</td>
		</tr>
		<tr valign="top">
			<td>-XX:LoopUnrollLimit=n</td><td>对小于此值的循环体,server模式编译器将其展开(Unroll). server模式编译器根据一个函数计算出限制值,而不是直接使用指定值. 各平台JVM的默认值会有很大差别.</td>
		</tr>
		<tr valign="top">
			<td>-XX:InitialTenuringThreshold=7</td><td>为年轻代收集器(parallel young collector)中的 自适应GC(adaptive GC)设置初始生命周期阀值(initial tenuring threshold). 生命周期阀值是指一个对象被提升到老年代(old, or tenured)之前,在年轻代GC中存活的次数.</td>
		</tr>
		<tr valign="top">
			<td>-XX:MaxTenuringThreshold=n</td><td>为自适应GC(adaptive GC sizing)设置对象的最大生命期阀值(tenuring threshold) . 当前允许的最大值是 15. 并行垃圾收集器(parallel collector)的默认值为 15, CMS 默认值为 4 .</td>
		</tr>
		<tr valign="top">
			<td>-Xloggc:&lt;filename&gt;</td><td>记录 GC verbose 日志输出到指定的文件. verbose 输出由正常的 verbose GC flags 控制.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-UseGCLogFileRotation</td><td>启用 GC 日志轮换(rotation), 要求设置了 -Xloggc.</td>
		</tr>
		<tr valign="top">
			<td>-XX:NumberOfGClogFiles=1</td><td>设置日志轮换(rotating)的文件数量, 必须大于等于(&gt;= 1). 轮换日志文件会使用如下命名规则(naming scheme), &lt;filename&gt;.0, &lt;filename&gt;.1, ..., &lt;filename&gt;.n-1.</td>
		</tr>
		<tr valign="top">
			<td>-XX:GCLogFileSize=8K</td><td>单个日志文件的大小,大于这个值则进行日志切换(rotated), 必须大于等于(&gt;= 8K).</td>
		</tr>
	</tbody>
</table>



原文链接: [http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html](http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html)

翻译参考: [JVM 不稳定参数](http://286.iteye.com/blog/1924947)