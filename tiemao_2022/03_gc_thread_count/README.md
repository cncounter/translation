## JVM调优经验系列文章: GC线程数

![thread dump patterns](https://i0.wp.com/blog.fastthread.io/wp-content/uploads/2015/09/too-many-cleaners.jpg?fit=640%2C359&ssl=1)

### Description

Based on the type of GC algorithm (Serial, parallel, G1, CMS) used, default number of garbage collection threads gets created. Details on default number of threads that will be created are documented below. Sometimes too many extraneous GC threads would get created based on the default configuration. We have seen scenarios where `128`, `256`, `512`  GC threads got created based on default configuration. Too many GC threads can also affect your application’s performance. So GC thread count should be carefully configured.



### Parallel GC

If you are using Parallel GC algorithm, then number of GC threads is controlled by `-XX:ParallelGCThreads` property. Default value for `-XX:ParallelGCThreads` on Linux/x86 machine is derived based on the formula:

```c
if (num of processors <=8) {
   return num of processors;
} else {
  return 8+(num of processors-8)*(5/8);
}
```

So if your JVM is running on server with 32 processors, then ParallelGCThread value is going to be: `23`(i.e. `8 + (32 – 8)*(5/8`)).

### CMS GC

If you are using CMS GC algorithm, then number of GC threads is controlled by `-XX:ParallelGCThreads` and `-XX:ConcGCThreads` properties. Default value of `-XX:ConcGCThreads` is derived based on the formula:

> `max((ParallelGCThreads+2)/4, 1)`

So if your JVM is running on server with 32 processors, then

- ParallelGCThread value is going to be: 23 (i.e. `8 + (32 – 8)*(5/8)`)
- ConcGCThreads value is going to be: `6`.
- So total GC thread count is: `29` (i.e. ParallelGCThread  count + ConcGCThreads  i.e. `23 + 6`)

### G1 GC

If you are using G1 GC algorithm, then number of GC threads is controlled by `-XX:ParallelGCThreads,` `-XX:ConcGCThreads, -XX:G1ConcRefinementThreads` properties. Default value of `-XX:G1ConcRefinementThreads` is derived based on the formula:

> `ParallelGCThreads+1`

So if your JVM is running on server with `32` processors, then

- ParallelGCThread value is going to be: `23` (i.e. `8 + (32 – 8)*(5/8)`)
- ConcGCThreads value is going to be: `6`
- G1ConcRefinementThreads value is going to be `24` (i.e. `23 + 1`)
- So total GC thread count is: `53` (i.e. ParallelGCThread  count + ConcGCThreads + G1ConcRefinementThreads i.e. `23 + 6 + 24`)

53 threads for GC is quite a high number. It should be tuned down appropriately.

### Why named as Several Scavengers?

Scavenger is a person who searches for and cleans-up discarded items. GC threads also do exactly same thing. Too many Scavengers in one single spot doesn’t yield productive result. Similarly, too many GC threads wouldn’t help JVM either.





- [THREAD DUMP ANALYSIS PATTERN – SEVERAL SCAVENGERS](https://blog.fastthread.io/2015/09/02/thread-dump-analysis-pattern-several-scavengers/)
