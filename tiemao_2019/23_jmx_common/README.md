# 常用JMX



操作系统信息

```java
// 1. 操作系统信息
OperatingSystemMXBean operatingSystemMXBean = ManagementFactory.getOperatingSystemMXBean();
//
Map<String, Object> result = new HashMap<>();
result.put("operatingSystemMXBean", operatingSystemMXBean);
```

得到的信息类似于:

```json
{
	"operatingSystemMXBean":{
		"arch":"x86_64",
		"availableProcessors":8,
		"committedVirtualMemorySize":10764525568,
		"freePhysicalMemorySize":162242560,
		"freeSwapSpaceSize":0,
		"maxFileDescriptorCount":10240,
		"name":"Mac OS X",
		"objectName":{
			"canonicalKeyPropertyListString":"type=OperatingSystem",
			"domain":"java.lang",
			"domainPattern":false,
			"keyPropertyList":{
				"type":"OperatingSystem"
			},
			"keyPropertyListString":"type=OperatingSystem",
			"pattern":false,
			"propertyListPattern":false,
			"propertyPattern":false,
			"propertyValuePattern":false
		},
		"openFileDescriptorCount":701,
		"processCpuLoad":0.013444809299587156,
		"processCpuTime":231834833000,
		"systemCpuLoad":0.06417112299465241,
		"systemLoadAverage":2.6044921875,
		"totalPhysicalMemorySize":17179869184,
		"totalSwapSpaceSize":0,
		"version":"10.14.5"
	}
}
```



运行时信息:

```java
// 1.2 运行时
RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();
//
Map<String, Object> result = new HashMap<>();
result.put("runtimeMXBean", runtimeMXBean);
```



结果:

```json
{
	"runtimeMXBean":{
		"bootClassPath":"......",
		"bootClassPathSupported":true,
		"classPath":".....",
		"inputArguments":[
			"-XX:+UseG1GC",
			"-XX:MaxGCPauseMillis=200",
			"-verbose:gc",
			"-XX:+PrintGCDateStamps",
			"-XX:+PrintGCDetails",
			"-Xloggc:gc.log",
			"-XX:+PrintClassHistogram",
			"-XX:+HeapDumpOnOutOfMemoryError",
			"-XX:HeapDumpPath=xxx.hprof",
			"-Dfile.encoding=UTF-8"
		],
		"libraryPath":"/Java/Extensions:/usr/lib/java:.",
		"managementSpecVersion":"1.2",
		"name":"20516@local",
		"objectName":{
			"canonicalKeyPropertyListString":"type=Runtime",
			"domain":"java.lang",
			"domainPattern":false,
			"keyPropertyList":{
				"type":"Runtime"
			},
			"keyPropertyListString":"type=Runtime",
			"pattern":false,
			"propertyListPattern":false,
			"propertyPattern":false,
			"propertyValuePattern":false
		},
		"specName":"Java Virtual Machine Specification",
		"specVendor":"Oracle Corporation",
		"specVersion":"1.8",
		"startTime":1562205244112,
		"systemProperties":{
			"file.encoding":"UTF-8",
			"java.version":"1.8.0_162",
			"java.vm.info":"mixed mode",
			"java.class.version":"52.0"
		},
		"uptime":26754056,
		"vmName":"Java HotSpot(TM) 64-Bit Server VM",
		"vmVendor":"Oracle Corporation",
		"vmVersion":"25.162-b12"
	}
}
```





内存信息:

```java
// 2.1 JVM内存信息
MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
//
Map<String, Object> result = new HashMap<>();
result.put("memoryMXBean", memoryMXBean);
```

结果 ：

```json
{
	"memoryMXBean":{
		"heapMemoryUsage":{
			"committed":268435456,
			"init":268435456,
			"max":4294967296,
			"used":176522232
		},
		"nonHeapMemoryUsage":{
			"committed":130220032,
			"init":2555904,
			"max":-1,
			"used":127471384
		},
		"notificationInfo":[{
			"description":"Memory Notification",
			"name":"javax.management.Notification",
			"notifTypes":["java.management.memory.threshold.exceeded","java.management.memory.collection.threshold.exceeded"]
		}],
		"objectName":{
			"canonicalKeyPropertyListString":"type=Memory",
			"domain":"java.lang",
			"domainPattern":false,
			"keyPropertyList":{
				"type":"Memory"
			},
			"keyPropertyListString":"type=Memory",
			"pattern":false,
			"propertyListPattern":false,
			"propertyPattern":false,
			"propertyValuePattern":false
		},
		"objectPendingFinalizationCount":0,
		"verbose":true
	}
}
```

JVM内存池-列表

```java
// 2.2 JVM内存池-列表
List<MemoryPoolMXBean> memoryPoolMXBeans = ManagementFactory.getMemoryPoolMXBeans();
//
Map<String, Object> result = new HashMap<>();
result.put("memoryPoolMXBeans", memoryPoolMXBeans);
```

结果:

```
// 报错
```



线程信息:

```java
// 线程
ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
//
Map<String, Object> result = new HashMap<>();
result.put("threadMXBean", threadMXBean);
```



结果:

```json
{
	"threadMXBean":{
		"allThreadIds":[454,453,450,5,3,2],
		"currentThreadCpuTime":364689000,
		"currentThreadCpuTimeSupported":true,
		"currentThreadUserTime":333704000,
		"daemonThreadCount":37,
		"objectMonitorUsageSupported":true,
		"objectName":{
			"canonicalKeyPropertyListString":"type=Threading",
			"domain":"java.lang",
			"domainPattern":false,
			"keyPropertyList":{
				"type":"Threading"
			},
			"keyPropertyListString":"type=Threading",
			"pattern":false,
			"propertyListPattern":false,
			"propertyPattern":false,
			"propertyValuePattern":false
		},
		"peakThreadCount":129,
		"synchronizerUsageSupported":true,
		"threadAllocatedMemoryEnabled":true,
		"threadAllocatedMemorySupported":true,
		"threadContentionMonitoringEnabled":false,
		"threadContentionMonitoringSupported":true,
		"threadCount":126,
		"threadCpuTimeEnabled":true,
		"threadCpuTimeSupported":true,
		"totalStartedThreadCount":441
	}
}
```





GC

```java
// GC
List<GarbageCollectorMXBean> garbageCollectorMXBeans = ManagementFactory.getGarbageCollectorMXBeans();
//
Map<String, Object> result = new HashMap<>();
result.put("garbageCollectorMXBeans", garbageCollectorMXBeans);
```



结果

```json
{
	"garbageCollectorMXBeans":[
		{
			"collectionCount":47,
			"collectionTime":733,
			"lastGcInfo":{
				"compositeType":{
					"className":"javax.management.openmbean.CompositeData",
					"description":"CompositeType for GC info for G1 Young Generation",
					"typeName":"sun.management.G1 Young Generation.GcInfoCompositeType"
				},
				"duration":11,
				"endTime":1866402,
				"id":47,
				"memoryUsageAfterGc":{
					"G1 Survivor Space":{
						"committed":8388608,
						"init":0,
						"max":-1,
						"used":8388608
					},
					"Compressed Class Space":{
						"committed":9568256,
						"init":0,
						"max":1073741824,
						"used":9130760
					},
					"Metaspace":{
						"committed":80084992,
						"init":0,
						"max":-1,
						"used":78314000
					},
					"G1 Old Gen":{
						"committed":139460608,
						"init":241172480,
						"max":4294967296,
						"used":109514232
					},
					"G1 Eden Space":{
						"committed":120586240,
						"init":27262976,
						"max":-1,
						"used":0
					},
					"Code Cache":{
						"committed":41091072,
						"init":2555904,
						"max":251658240,
						"used":40781632
					}
				},
				"memoryUsageBeforeGc":{
					"G1 Survivor Space":{
						"committed":7340032,
						"init":0,
						"max":-1,
						"used":7340032
					},
					"Compressed Class Space":{
						"committed":9568256,
						"init":0,
						"max":1073741824,
						"used":9130760
					},
					"Metaspace":{
						"committed":80084992,
						"init":0,
						"max":-1,
						"used":78314000
					},
					"G1 Old Gen":{
						"committed":138412032,
						"init":241172480,
						"max":4294967296,
						"used":109065208
					},
					"G1 Eden Space":{
						"committed":122683392,
						"init":27262976,
						"max":-1,
						"used":116391936
					},
					"Code Cache":{
						"committed":41091072,
						"init":2555904,
						"max":251658240,
						"used":40781632
					}
				},
				"startTime":1866391
			},
			"memoryPoolNames":["G1 Eden Space","G1 Survivor Space"],
			"name":"G1 Young Generation",
			"notificationInfo":[{
				"description":"GC Notification",
				"name":"javax.management.Notification",
				"notifTypes":["com.sun.management.gc.notification"]
			}],
			"objectName":{
				"canonicalKeyPropertyListString":"name=G1 Young Generation,type=GarbageCollector",
				"domain":"java.lang",
				"domainPattern":false,
				"keyPropertyList":{
					"name":"G1 Young Generation",
					"type":"GarbageCollector"
				},
				"keyPropertyListString":"type=GarbageCollector,name=G1 Young Generation",
				"pattern":false,
				"propertyListPattern":false,
				"propertyPattern":false,
				"propertyValuePattern":false
			},
			"valid":true
		},
		{
			"collectionCount":0,
			"collectionTime":0,
			"lastGcInfo":null,
			"memoryPoolNames":["G1 Eden Space","G1 Survivor Space","G1 Old Gen"],
			"name":"G1 Old Generation",
			"notificationInfo":[{
				"description":"GC Notification",
				"name":"javax.management.Notification",
				"notifTypes":["com.sun.management.gc.notification"]
			}],
			"objectName":{
				"canonicalKeyPropertyListString":"name=G1 Old Generation,type=GarbageCollector",
				"domain":"java.lang",
				"domainPattern":false,
				"keyPropertyList":{
					"name":"G1 Old Generation",
					"type":"GarbageCollector"
				},
				"keyPropertyListString":"type=GarbageCollector,name=G1 Old Generation",
				"pattern":false,
				"propertyListPattern":false,
				"propertyPattern":false,
				"propertyValuePattern":false
			},
			"valid":true
		}
	]
}
```









### whole-code



```java
// 
@RequestMapping("/jmx.json")
public Object jmxInfo(HttpServletRequest request) {
  //
  Map<String, Object> result = new HashMap<>();
  // 1. 操作系统信息
  OperatingSystemMXBean operatingSystemMXBean = ManagementFactory.getOperatingSystemMXBean();
  // 1.2 运行时
  RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();

  // 2.1 JVM内存信息
  MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
  // 2.2 JVM内存池-列表
  List<MemoryPoolMXBean> memoryPoolMXBeans = ManagementFactory.getMemoryPoolMXBeans();
  // 2.3 内存管理器-列表
  List<MemoryManagerMXBean> memoryManagerMXBeans = ManagementFactory.getMemoryManagerMXBeans();

  // 3. class加载统计信息
  ClassLoadingMXBean classLoadingMXBean = ManagementFactory.getClassLoadingMXBean();
  // 4. 编译统计信息
  CompilationMXBean compilationMXBean = ManagementFactory.getCompilationMXBean();
  // 线程
  ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();

  // GC
  List<GarbageCollectorMXBean> garbageCollectorMXBeans = ManagementFactory.getGarbageCollectorMXBeans();

  //
  //result.put("operatingSystemMXBean", operatingSystemMXBean);
  //result.put("runtimeMXBean", runtimeMXBean);
  //
  //result.put("memoryMXBean", memoryMXBean);
  //result.put("memoryPoolMXBeans", memoryPoolMXBeans);
  //result.put("memoryManagerMXBeans", memoryManagerMXBeans);
  //
  //result.put("classLoadingMXBean", classLoadingMXBean);
  //
  //result.put("compilationMXBean", compilationMXBean);
  //
  result.put("threadMXBean", threadMXBean);
  //result.put("garbageCollectorMXBeans", garbageCollectorMXBeans);
  //
  return result;
}
```





