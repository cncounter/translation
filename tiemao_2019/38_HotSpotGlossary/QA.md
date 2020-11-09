# JVM细节你真的了解吗?

请尝试回答这些问题:

## 1、`adaptive spinning`, 适应性自旋是怎么回事?

## 2、`biased locking`, 偏向锁是怎么实现的?

## 3、`block start table`, 块起始表是什么数据结构?

## 4、`bootstrap classloader`, 启动类加载器干了哪些事情?

## 5、`bytecode verification`, 字节码验证，验证了哪些内容?

## 6、`C1 compiler`, C1编译器, 大致的处理逻辑是什么?

## 7、`C2 compiler`, C2编译器, 会进行哪些优化?

## 8、`card table`， 卡表， 用来做什么？

## 9、`class data sharing`, 类数据共享, 是怎么回事？

## 10、`class hierachy analysis`， 类层次分析，做的是什么工作?

## 11、`code cache`, 代码缓存区, 里面有什么，哪些内容被清除了?

## 12、`compaction`，整理压实，内存指针是怎么处理的?

## 13、`concurrency`，请举个实际的例子来表明你对并发和并行的理解？

## 14、`concurrent garbage collection`，并发GC有哪些优势，你用过吗?

## 15、`copying garbage collection`，GC中的拷贝过程，发生了哪些事情？

## 16、`deoptimization`，反优化技术，在什么时候会用到?

## 17、`dependency`，依赖、在JIT编译时是怎么处理的？

## 18、`eden`，新生代、对象的年龄范围是多少，怎么根据业务特征来配置大小? 为什么?

## 19、`free list`，空闲列表，里面到底存的是已使用的部分，还是未使用的部分?

## 20、`garbage collection` ，请说出5种最新的垃圾收集算法，以及对应的优势。

## 21、`garbage collection root`，请列举出所有你知道的GC根。

## 22、`GC map`， GC映射，这是怎么回事，跟哪些操作有关，你知道吗？

## 23、`generational garbage collection`， 分代GC，有什么好处，有什么不好? ZGC为什么没使用分代?

## 24、`handle` 对象句柄，这是什么意思? GC怎么处理的?

## 25、`hot lock`， 什么是热锁？

## 26、`interpreter` 解释器, 为什么要使用？怎么强制JVM使用解释模式?

## 27、`JIT compilers`，及时编译器，在JDK8之后，执行多少次代码才会使用JIT进行编译?

## 28、`JNI`， 有没有用过，哪些场景在用？请举个实际使用过的新案例。

## 29、`JVM TI`，工具接口，有没有听过，哪些工具会用到?

## 30、`klass pointer`、类指针、存放在哪里，指向哪里？

## 31、`mark word`、标记字，里面包含哪些内容？一个字宽是多少？

## 33、`nmethod`，这是什么，在哪里？

## 34、`object header`，对象头、有哪些值得解释的部分?

## 35、`object promotion`、对象提升，是怎么回事？

## 36、`old generation`， 老年代使用率不下降，有没有问题？ 有哪些问题？ 为什么？

## 37、`on-stack replacement`，栈上替换，替换的是什么？

## 38、`oop`、对象指针, object pointer，为什么缩略词是2个o, 不是一个o?

## 39、`parallel classloading`， 并行类加载，咋回事？

## 40、`parallel garbage collection`，并行GC，有哪些一般人关注不到的细节？

## 41、`permanent generation`，永久代，存在什么问题？

## 42、`remembered set`、记忆集、存的具体是什么信息？

## 43、`safepoint`、安全点是什么？有什么特征，有哪些可以称为安全点？

## 44、`sea-of-nodes`、节点海、哪个编译器在用？

## 45、`Serviceability Agent (SA)`、可服务性代理、是做什么用的？

## 46、`stackmap`、栈映射、存的是什么东西？

## 47、`StackMapTable`、栈映射表、有什么用？

## 48、`survivor space`、存活区不足，会发生什么问题？怎么配置比较合理？

## 49、`synchronization` 同步操作、你遇到过哪些坑？

## 50、`TLAB`、 请写出对应的英文单词。

## 51、`uncommon trap`、非常规陷阱、什么叫陷阱？和异常有什么关系?

## 52、`verifier`、字节码验证器、如果让你实现，你会验证哪些内容？哪些是不必要的？

## 53、`VM Operations`、JVM内部操作、维护虚拟机需要处理哪些情况？

## 54、`write barrier`、什么是写操作，什么是写屏障? JVM用它来干什么？

## 55、`young generation`、为什么叫年轻代？有哪些组成部分，有哪些GC的年轻代和别的不同？
