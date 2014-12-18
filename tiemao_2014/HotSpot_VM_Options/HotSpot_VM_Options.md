JDK7的HotSpot启动参数
==

**请注意: 此文档只适用于 JDK 7 及更早期版本. 如果是 JDK 8,请参考 [Windows](http://docs.oracle.com/javase/8/docs/technotes/tools/windows/java.html), [Solaris](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html), [Linux](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html) 以及 [Mac OS X](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html) 版本参考手册的相关页面.**


本文档展示说明会影响Java HotSpot虚拟机性能特征的典型命令行选项和环境变量。除非另外注明,本文档中的所有信息都适用于 Java HotSpot Client VM 和 Java HotSpot Server VM.


## Java HotSpot VM 参数分类 ##
  
Java HotSpot VM 识别的标准参数在 Java Application Launcher 参考手册中描述:  [Windows参考手册](http://docs.oracle.com/javase/7/docs/technotes/tools/windows/java.html) 和 [Solaris & Linux 参考手册](http://docs.oracle.com/javase/7/docs/technotes/tools/solaris/java.html). 本文档只讲述 Java HotSpot VM 识别的非标准参数(non-standard):

- 以 `-X` 开头的参数选项是非标准的(non-standard, 不保证所有的JVM实现都支持), 而且如果后续版本的JDK有变更,并不一定另行通知用户.
- 以 `-XX` 开头指定的选项是不固定的(not stable),如果有变更,也不另行通知.

JDK 1.3.0 及以下版本如果想要使用Java HotSpot VM, 请参考 [Java HotSpot Equivalents of Exact VM flags](http://www.oracle.com/technetwork/java/javase/tech/exactoptions-jsp-141536.html).

## 常用的 -XX 参数 ##
  
Default values are listed for Java SE 6 for Solaris Sparc with -server. Some options may vary per architecture/OS/JVM version. Platforms with a differing default value are listed in the description.

- 布尔型(Boolean)的选项,开启时使用加号: `-XX:+<option>` ;关闭则使用减号: `-XX:-<option>`.(这里有一个Disa,不知道什么意思)
- 数字型(Numeric)的选项,使用等号设置: `-XX:<option>=<number>`. 数字类型支持缩略符号 '`m`' 或 '`M`' 表示MB(megabytes), '`k`' 或 '`K`' 表示KB(kilobytes), 还有 'g' 或 'G' 表示GB(gigabytes). 例如, 32k 等价于 32768.
- 字符串型(String)的选项,使用等号设置: `-XX:<option>=<string>`, 通常用于指定文件,路径,或者命令列表

Flags marked as manageable are dynamically writeable through the JDK management interface (com.sun.management.HotSpotDiagnosticMXBean API) and also through JConsole. In [Monitoring and Managing Java SE 6 Platform Applications](http://www.oracle.com/technetwork/articles/javase/monitoring-141801.html#Heap_Dump), Figure 3 shows an example. The manageable flags can also be set through [jinfo -flag](http://docs.oracle.com/javase/6/docs/technotes/tools/share/jinfo.html). 

The options below are loosely grouped into categories.

- [Behavioral options](http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html#BehavioralOptions) change the basic behavior of the VM.
- [Garbage First (G1)](http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html#G1Options) Garbage Collection Options
- [Performance tuning](http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html#PerformanceTuning) options are knobs which can be used to tune VM performance.
- [Debugging options](http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html#DebuggingOptions) generally enable tracing, printing, or output of VM information.
  
## 虚拟机行为控制选项(Behavioral Options) ##


<table width="100%" cellspacing="1" cellpadding="1" border="1">
	<tbody>
		<tr>
			<th width="45%" valign="top" align="left">Option and Default Value</th><th width="55%" valign="top" align="left">Description</th>
		</tr>
		<tr valign="top">
			<td>-XX:-AllowUserSignalHandlers</td><td>Do not complain if the application installs signal handlers. (Relevant to Solaris and Linux only.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:AltStackSize=16384</td><td>Alternate signal stack size (in Kbytes). (Relevant to Solaris only, removed from 5.0.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-DisableExplicitGC</td><td>By default calls to System.gc() are enabled (-XX:-DisableExplicitGC). Use -XX:+DisableExplicitGC to disable calls to System.gc(). Note that the JVM still performs garbage collection when necessary.</td>
		</tr>
		<tr valign="top">
			<td>-XX:+FailOverToOldVerifier</td><td>Fail over to old verifier when the new type checker fails. (Introduced in 6.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:+HandlePromotionFailure</td><td>The youngest generation collection does not require a guarantee of full promotion of all live objects. (Introduced in 1.4.2 update 11) [5.0 and earlier: false.]</td>
		</tr>
		<tr valign="top">
			<td>-XX:+MaxFDLimit</td><td>Bump the number of file descriptors to max. (Relevant&nbsp; to Solaris only.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:PreBlockSpin=10</td><td>Spin count variable for use with -XX:+UseSpinning. Controls the maximum spin iterations allowed before entering operating system thread synchronization code. (Introduced in 1.4.2.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-RelaxAccessControlCheck</td><td>Relax the access control checks in the verifier. (Introduced in 6.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:+ScavengeBeforeFullGC</td><td>Do young generation GC prior to a full GC. (Introduced in 1.4.1.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseAltSigs</td><td>Use alternate signals instead of SIGUSR1 and SIGUSR2 for VM internal signals. (Introduced in 1.3.1 update 9, 1.4.1. Relevant to Solaris only.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseBoundThreads</td><td>Bind user level threads to kernel threads. (Relevant to Solaris only.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-UseConcMarkSweepGC</td><td>Use concurrent mark-sweep collection for the old generation. (Introduced in 1.4.1)</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseGCOverheadLimit</td><td>Use a policy that limits the proportion of the VM's time that is spent in GC before an OutOfMemory error is thrown. (Introduced in 6.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseLWPSynchronization</td><td>Use LWP-based instead of thread based synchronization. (Introduced in 1.4.0. Relevant to Solaris only.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-UseParallelGC</td><td>Use parallel garbage collection for scavenges. (Introduced in 1.4.1)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-UseParallelOldGC</td><td>Use parallel garbage collection for the full collections. Enabling this option automatically sets -XX:+UseParallelGC. (Introduced in 5.0 update 6.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-UseSerialGC</td><td>Use serial garbage collection. (Introduced in 5.0.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-UseSpinning</td><td>Enable naive spinning on Java monitor before entering operating system thread synchronizaton code. (Relevant to 1.4.2 and 5.0 only.) [1.4.2, multi-processor Windows platforms: true]</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseTLAB</td><td>Use thread-local object allocation (Introduced in 1.4.0, known as UseTLE prior to that.) [1.4.2 and earlier, x86 or with -client: false]</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseSplitVerifier</td><td>Use the new type checker with StackMapTable attributes. (Introduced in 5.0.)[5.0: false]</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseThreadPriorities</td><td>Use native thread priorities.</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseVMInterruptibleIO</td><td>Thread interrupt before or with EINTR for I/O operations results in OS_INTRPT. (Introduced in 6. Relevant to Solaris only.)</td>
		</tr>
	</tbody>
</table>




## G1垃圾收集器选项 ##

<table width="100%" cellspacing="1" cellpadding="1" border="1">
	<tbody>
		<tr>
			<th width="45%" valign="top" align="left">Option and Default Value</th><th width="55%" valign="top" align="left">Description</th>
		</tr>
		<tr valign="top">
			<td>-XX:+UseG1GC</td><td>Use the Garbage First (G1) Collector</td>
		</tr>
		<tr valign="top">
			<td>-XX:MaxGCPauseMillis=n</td><td>Sets a target for the maximum GC pause time. This is a soft goal, and the JVM will make its best effort to achieve it.</td>
		</tr>
		<tr valign="top">
			<td>-XX:InitiatingHeapOccupancyPercent<span id="MainContent" class="wcm-region" style="display: inline">=n</span></td><td>Percentage of the (entire) heap occupancy to start a concurrent GC cycle. It is used by GCs that trigger a concurrent GC cycle based on the occupancy of the entire heap, not just one of the generations (e.g., G1). A value of 0 denotes 'do constant GC cycles'. The default value is 45.</td>
		</tr>
		<tr valign="top">
			<td>-XX:NewRatio=n</td><td>Ratio of old/new generation sizes. The default value is 2.</td>
		</tr>
		<tr valign="top">
			<td>-XX:SurvivorRatio=n</td><td>Ratio of eden/survivor space size. The default value is 8.</td>
		</tr>
		<tr valign="top">
			<td>-XX:MaxTenuringThreshold=n</td><td>Maximum value for tenuring threshold. The default value is 15.</td>
		</tr>
		<tr valign="top">
			<td>-XX:ParallelGCThreads=n</td><td>Sets the number of threads used during parallel phases of the garbage collectors. The default value varies with the platform on which the JVM is running.</td>
		</tr>
		<tr valign="top">
			<td>-XX:ConcGCThreads=n</td><td>Number of threads concurrent garbage collectors will use. The default value varies with the platform on which the JVM is running.</td>
		</tr>
		<tr valign="top">
			<td>-XX:G1ReservePercent<span id="MainContent2" class="wcm-region" style="display: inline">=n</span></td><td>Sets the amount of heap that is reserved as a false ceiling to reduce the possibility of promotion failure. The default value is 10.</td>
		</tr>
		<tr valign="top">
			<td>-XX:G1HeapRegionSize<span id="MainContent3" class="wcm-region" style="display: inline">=n</span></td><td>With G1 the Java heap is subdivided into uniformly sized regions. This sets the size of the individual sub-divisions. The default value of this parameter is determined ergonomically based upon heap size. The minimum value is 1Mb and the maximum value is 32Mb.</td>
		</tr>
	</tbody>
</table>


## 性能调优选项(Performance Options) ##

<table width="100%" cellspacing="1" cellpadding="1" border="1">
	<tbody>
		<tr>
			<th width="45%" valign="top" align="left">Option and Default Value</th><th width="55%" valign="top" align="left">Description</th>
		</tr>
		<tr valign="top">
			<td>-XX:+AggressiveOpts</td><td>Turn on point performance compiler optimizations that are expected to be default in upcoming releases. (Introduced in 5.0 update 6.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:CompileThreshold=10000</td><td>Number of method invocations/branches before compiling [-client: 1,500]</td>
		</tr>
		<tr valign="top">
			<td>-XX:LargePageSizeInBytes=4m</td><td>Sets the large page size used for the Java heap. (Introduced in 1.4.0 update 1.) [amd64: 2m.]</td>
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
			<td>-XX:+UseBiasedLocking</td><td>Enable biased locking. For more details, see this <a href="/technetwork/java/tuning-139912.html#section4.2.5">tuning example</a>. (Introduced in 5.0 update 6.) [5.0: false]</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseFastAccessorMethods</td><td>Use optimized versions of Get&lt;Primitive&gt;Field.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-UseISM</td><td>Use Intimate Shared Memory. [Not accepted for non-Solaris platforms.] For details, see <a href="/technetwork/java/ism-139376.html">Intimate Shared Memory</a>.</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseLargePages</td><td>Use large page memory. (Introduced in 5.0 update 5.) For details, see <a href="/technetwork/java/javase/tech/largememory-jsp-137182.html">Java Support for Large Memory Pages</a>.</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseMPSS</td><td>Use Multiple Page Size Support w/4mb pages for the heap. Do not use with ISM as this replaces the need for ISM. (Introduced in 1.4.0 update 1, Relevant to Solaris 9 and newer.) [1.4.1 and earlier: false]</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseStringCache</td><td>Enables caching of commonly allocated strings.
			<br>
			&nbsp;</td>
		</tr>
		<tr valign="top">
			<td>-XX:AllocatePrefetchLines=1</td><td>Number of cache lines to load after the last object allocation using prefetch instructions generated in JIT compiled code. Default values are 1 if the last allocated object was an instance and 3 if it was an array.
			<br>
			&nbsp;</td>
		</tr>
		<tr valign="top">
			<td>-XX:AllocatePrefetchStyle=1</td><td>Generated code style for prefetch instructions.
			<br>
			0 - no prefetch instructions are generate*d*,
			<br>
			1 - execute prefetch instructions after each allocation,
			<br>
			2 - use TLAB allocation watermark pointer to gate when prefetch instructions are executed.
			<br>
			&nbsp;</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseCompressedStrings</td><td>Use a byte[] for Strings which can be represented as pure ASCII. (Introduced in Java 6 Update 21 Performance Release)
			<br>
			&nbsp;</td>
		</tr>
		<tr valign="top">
			<td>-XX:+OptimizeStringConcat</td><td>Optimize String concatenation operations where possible. (Introduced in Java 6 Update 20)
			<br>
			&nbsp;</td>
		</tr>
	</tbody>
</table>


## 调试相关选项(Debugging Options) ##

<table width="100%" cellspacing="1" cellpadding="1" border="1">
	<tbody>
		<tr valign="top">
			<th width="45%" valign="top" align="left">Option and Default Value</th><th width="55%" valign="top" align="left">Description</th>
		</tr>
		<tr valign="top">
			<td>-XX:-CITime</td><td>Prints time spent in JIT Compiler. (Introduced in 1.4.0.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:ErrorFile=./hs_err_pid&lt;pid&gt;.log</td><td>If an error occurs, save the error data to this file. (Introduced in 6.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-ExtendedDTraceProbes</td><td>Enable performance-impacting <a href="http://docs.oracle.com/javase/6/docs/technotes/guides/vm/dtrace.html">dtrace</a> probes. (Introduced in 6. Relevant to Solaris only.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:HeapDumpPath=./java_pid&lt;pid&gt;.hprof</td><td>Path to directory or filename for heap dump. <em>Manageable</em>. (Introduced in 1.4.2 update 12, 5.0 update 7.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-HeapDumpOnOutOfMemoryError</td><td>Dump heap to file when java.lang.OutOfMemoryError is thrown. <em>Manageable</em>. (Introduced in 1.4.2 update 12, 5.0 update 7.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:OnError="&lt;cmd args&gt;;&lt;cmd args&gt;"</td><td>Run user-defined commands on fatal error. (Introduced in 1.4.2 update 9.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:OnOutOfMemoryError="&lt;cmd args&gt;;
			<br clear="none">
			&lt;cmd args&gt;"</td><td>Run user-defined commands when an OutOfMemoryError is first thrown. (Introduced in 1.4.2 update 12, 6)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintClassHistogram</td><td>Print a histogram of class instances on Ctrl-Break. <em>Manageable</em>. (Introduced in 1.4.2.) The <a href="http://docs.oracle.com/javase/6/docs/technotes/tools/share/jmap.html">jmap -histo</a> command provides equivalent functionality.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintConcurrentLocks</td><td>Print java.util.concurrent locks in Ctrl-Break thread dump. <em>Manageable</em>. (Introduced in 6.) The <a href="http://docs.oracle.com/javase/6/docs/technotes/tools/share/jstack.html">jstack -l</a> command provides equivalent functionality.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintCommandLineFlags</td><td>Print flags that appeared on the command line. (Introduced in 5.0.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintCompilation</td><td>Print message when a method is compiled.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintGC</td><td>Print messages at garbage collection. <em>Manageable</em>.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintGCDetails</td><td>Print more details at garbage collection. <em>Manageable</em>. (Introduced in 1.4.0.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintGCTimeStamps</td><td>Print timestamps at garbage collection. <em>Manageable</em> (Introduced in 1.4.0.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintTenuringDistribution</td><td>Print tenuring age information.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-PrintAdaptiveSizePolicy</td><td>Enables printing of information about adaptive generation sizing.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-TraceClassLoading</td><td>Trace loading of classes.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-TraceClassLoadingPreorder</td><td>Trace all classes loaded in order referenced (not loaded). (Introduced in 1.4.2.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-TraceClassResolution</td><td>Trace constant pool resolutions. (Introduced in 1.4.2.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:-TraceClassUnloading</td><td>Trace unloading of classes.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-TraceLoaderConstraints</td><td>Trace recording of loader constraints. (Introduced in 6.)</td>
		</tr>
		<tr valign="top">
			<td>-XX:+PerfDataSaveToFile</td><td>Saves jvmstat binary data on exit.</td>
		</tr>
		<tr valign="top">
			<td>-XX:ParallelGCThreads=n</td><td>Sets the number of garbage collection threads in the young and old parallel garbage collectors. The default value varies with the platform on which the JVM is running.</td>
		</tr>
		<tr valign="top">
			<td>-XX:+UseCompressedOops</td><td>Enables the use of compressed pointers (object references represented as 32 bit offsets instead of 64-bit pointers) for optimized 64-bit performance with Java heap sizes less than 32gb.</td>
		</tr>
		<tr valign="top">
			<td>-XX:+AlwaysPreTouch</td><td>Pre-touch the Java heap during JVM initialization. Every page of the heap is thus demand-zeroed during initialization rather than incrementally during application execution.</td>
		</tr>
		<tr valign="top">
			<td>-XX:AllocatePrefetchDistance=n</td><td>Sets the prefetch distance for object allocation. Memory about to be written with the value of new objects is prefetched into cache at this distance (in bytes) beyond the address of the last allocated object. Each Java thread has its own allocation point. The default value varies with the platform on which the JVM is running.</td>
		</tr>
		<tr valign="top">
			<td>-XX:InlineSmallCode=n</td><td>Inline a previously compiled method only if its generated native code size is less than this. The default value varies with the platform on which the JVM is running.</td>
		</tr>
		<tr valign="top">
			<td>-XX:MaxInlineSize=35</td><td>Maximum bytecode size of a method to be inlined.</td>
		</tr>
		<tr valign="top">
			<td>-XX:FreqInlineSize=n</td><td>Maximum bytecode size of a frequently executed method to be inlined. The default value varies with the platform on which the JVM is running.</td>
		</tr>
		<tr valign="top">
			<td>-XX:LoopUnrollLimit=n</td><td>Unroll loop bodies with server compiler intermediate representation node count less than this value. The limit used by the server compiler is a function of this value, not the actual value. The default value varies with the platform on which the JVM is running.</td>
		</tr>
		<tr valign="top">
			<td>-XX:InitialTenuringThreshold=7</td><td>Sets the initial tenuring threshold for use in adaptive GC sizing in the parallel young collector. The tenuring threshold is the number of times an object survives a young collection before being promoted to the old, or tenured, generation.</td>
		</tr>
		<tr valign="top">
			<td>-XX:MaxTenuringThreshold=n</td><td>Sets the maximum tenuring threshold for use in adaptive GC sizing. The current largest value is 15. The default value is 15 for the parallel collector and is 4 for CMS.</td>
		</tr>
		<tr valign="top">
			<td>-Xloggc:&lt;filename&gt;</td><td>Log GC verbose output to specified file. The verbose output is controlled by the normal verbose GC flags.</td>
		</tr>
		<tr valign="top">
			<td>-XX:-UseGCLogFileRotation</td><td>Enabled GC log rotation, requires -Xloggc.</td>
		</tr>
		<tr valign="top">
			<td>-XX:NumberOfGClogFiles=1</td><td>Set the number of files to use when rotating logs, must be &gt;= 1. The rotated log files will use the following naming scheme, &lt;filename&gt;.0, &lt;filename&gt;.1, ..., &lt;filename&gt;.n-1.</td>
		</tr>
		<tr valign="top">
			<td>-XX:GCLogFileSize=8K</td><td>The size of the log file at which point the log will be rotated, must be &gt;= 8K.</td>
		</tr>
	</tbody>
</table>



原文链接: [http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html](http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html)

