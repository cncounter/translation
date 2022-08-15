# The Z Garbage Collector

A Scalable Low-Latency Garbage Collector for Java



## ZGC简介


### 设计目标

- Multi-terabyte heaps: TB级
- Max GC pause time: 10ms; 
- Easy to tune
- Max application throughput reduction: 15%


Scalable:

ZGC pause times do not increase with the heap or live-set size;
ZGC pause times do increase with the root-set size;





> 11

The Z Garbage Collector (ZGC) is a scalable low latency garbage collector. ZGC performs all expensive work concurrently, without stopping the execution of application threads for more than 10ms, which makes is suitable for applications which require low latency and/or use a very large heap (multi-terabytes).

> 18:

The Z Garbage Collector (ZGC) is a scalable low latency garbage collector. ZGC performs all expensive work concurrently, without stopping the execution of application threads for more than a few milliseconds. It is suitable for applications which require low latency. Pause times are independent of heap size that is being used. ZGC supports heap sizes from 8MB to 16TB.




## ZGC使用示例



### 常用配置

> 11

The Z Garbage Collector is available as an experimental feature, and is enabled with the command-line options `-XX:+UnlockExperimentalVMOptions -XX:+UseZGC`.

> 18:

The Z Garbage Collector is enabled with the command-line option `-XX:+UseZGC`.


> 11


### Setting the Heap Size

The most important tuning option for ZGC is setting the max heap size (`-Xmx`). Since ZGC is a concurrent collector a max heap size must be selected such that, 1) the heap can accommodate the live-set of your application, and 2) there is enough headroom in the heap to allow allocations to be serviced while the GC is running. How much headroom is needed very much depends on the allocation rate and the live-set size of the application. In general, the more memory you give to ZGC the better. But at the same time, wasting memory is undesirable, so it’s all about finding a balance between memory usage and how often the GC needs to run.


> 18:

### Setting the Heap Size

The most important tuning option for ZGC is setting the max heap size (`-Xmx`). Since ZGC is a concurrent collector a max heap size must be selected such that, 1) the heap can accommodate the live-set of your application, and 2) there is enough headroom in the heap to allow allocations to be serviced while the GC is running. How much headroom is needed very much depends on the allocation rate and the live-set size of the application. In general, the more memory you give to ZGC the better. But at the same time, wasting memory is undesirable, so it’s all about finding a balance between memory usage and how often the GC needs to run.


> 11

### Setting Number of Concurrent GC Threads

The second tuning option one might want to look at is setting the number of concurrent GC threads (`-XX:ConcGCThreads`). ZGC has heuristics to automatically select this number. This heuristic usually works well but depending on the characteristics of the application this might need to be adjusted. This option essentially dictates how much CPU-time the GC should be given. Give it too much and the GC will steal too much CPU-time from the application. Give it too little, and the application might allocate garbage faster than the GC can collect it.

> 18:

### Setting Number of Concurrent GC Threads

The second tuning option one might want to look at is setting the number of concurrent GC threads (`-XX:ConcGCThreads`). ZGC has heuristics to automatically select this number. This heuristic usually works well but depending on the characteristics of the application this might need to be adjusted. This option essentially dictates how much CPU-time the GC should be given. Give it too much and the GC will steal too much CPU-time from the application. Give it too little, and the application might allocate garbage faster than the GC can collect it.



> 18:

### Returning Unused Memory to the Operating System

By default, ZGC uncommits unused memory, returning it to the operating system. This is useful for applications and environments where memory footprint is a concern. This feature can be disabled using `-XX:-ZUncommit`. Furthermore, memory will not be uncommitted so that the heap size shrinks below the minimum heap size (`-Xms`). This means this feature will be implicitly disabled if the minimum heap size (`-Xms`) is configured to be equal to the maximum heap size (`-Xmx`).

An uncommit delay can be configured using `-XX:ZUncommitDelay=<seconds>` (default is 300 seconds). This delay specifies for how long memory should have been unused before it's eligible for uncommit.





## ZGC实现原理





ZGC的基本特征:

- Concurrent
- Tracing
- Compacting
- Single generation
- Region-based
- NUMA-aware
- Load barriers
- Colored pointers

### GC Cycle 示意图



#### Mark

- Concurrent & Parallel

- Load barrier: Detects loads of non-marked object pointers

- Striped
  – Heap divided into logical stripes
  – Isolate each GC thread to work on its own stripe
  – Minimized shared state


Pause Mark Start 示意图

Concurrent Mark 示意图

Pause Mark End 示意图

#### Relocation

* Concurrent & Parallel
* Load barrier
  – Detects loads of object pointers pointing into the relocation set
  – Java threads help out with relocation if needed

* Off-heap forwarding tables
  – No forwarding information stored in old copies of objects
  – Important for immediate reuse of heap memory



### Colored Pointers

### Load Barrier


- A small piece of code injected by the JIT in strategic places: When loading an object reference from the heap

- Checks if the loaded object reference has a bad color: If so, take action and heal it


加载堆内存中的对象属性:

```java
String personName = person.name;      // Loading an object reference from heap
<load barrier needed here>
int nameLenth = personName.length();  //No barrier, not a load from heap
int personAge = person.age;           // No barrier, not an object reference
```

判断:

barrier: // Bad color? jnz slow_path // Yes -> Enter slow path and mark/relocate/remap, adjust 0x10(%rax) and %rbx

~4% execution overhead o



## ZGC日志分析


## 相关链接

- [23_zgc_intro(2020)](../../tiemao_2020/23_zgc_intro/README.md)
- [20.Pauseless-GC算法(2019)](../../tiemao_2019/20_Azul-The-Pauseless-GC-Algorithm/README.md)
- [The Design of ZGC: ZGC-PLMeetup-2019.pdf](https://cr.openjdk.java.net/~pliden/slides/ZGC-PLMeetup-2019.pdf)
- [JDK11版: HotSpot Virtual Machine Garbage Collection Tuning Guide](https://docs.oracle.com/en/java/javase/11/gctuning/introduction-garbage-collection-tuning.html)
- [JDK18版: HotSpot Virtual Machine Garbage Collection Tuning Guide](https://docs.oracle.com/en/java/javase/18/gctuning/introduction-garbage-collection-tuning.html)


