# Memory Barriers Are Like Source Control Operations

# 内存屏障: 通过版本控制来理解



If you use source control, you’re on your way towards understanding memory ordering, an important consideration when writing lock-free code in C, C++ and other languages.

如果你用过版本控制工具(如Git,SVN), 那就可以很容易地理解内存排序(memory ordering), 在C、C++、Java等语言中编写 **无锁**(lock-free)代码时，指令乱序问题是需要特别注意的地方。


In my last post, I wrote about memory ordering at compile time, which forms one half of the memory ordering puzzle. This post is about the other half: memory ordering at runtime, on the processor itself. Like compiler reordering, processor reordering is invisible to a single-threaded program. It only becomes apparent when lock-free techniques are used – that is, when shared memory is manipulated without any mutual exclusion between threads. However, unlike compiler reordering, the effects of processor reordering are only visible in multicore and multiprocessor systems.


在前面的博文中, 介绍了[编译期内存排序](http://preshing.com/20120625/memory-ordering-at-compile-time), 这是内存排序中比较困难的一部分。
本文则是剩下的部分: 处理器内部运行时的内存排序。 和编译期重排序(compiler reordering)一样, 处理器重排序(processor reordering)在单线程应用中是不会发生的。
只在使用[无锁技术(lock-free techniques)](http://preshing.com/20120612/an-introduction-to-lock-free-programming) 时才会出现，也就是多个线程之间读写共享内存(shared memory,如堆内存)，却没有使用互斥锁(mutual exclusion)的情况下才会发生。
与编译器重排序的不同点在于, 处理器重排序[只在多核心/多处理器的系统中才会发生](http://preshing.com/20120515/memory-reordering-caught-in-the-act)。


You can enforce correct memory ordering on the processor by issuing any instruction which acts as a memory barrier. In some ways, this is the only technique you need to know, because when you use such instructions, compiler ordering is taken care of automatically. Examples of instructions which act as memory barriers include (but are not limited to) the following:

我们可以插入一些充当 **内存屏障**(memory barrier)的指令, 强制CPU按预定的指令顺序执行。
简单点的话, 我们只需要了解这一种技术就够了, 因为使用这类指令时, 编译器重排序也会自动进行特殊处理。
一部分可以充当内存屏障的指令包括:


- Certain inline assembly directives in GCC, such as the PowerPC-specific asm volatile("lwsync" ::: "memory")
- Any Win32 Interlocked operation, except on Xbox 360
- Many operations on C++11 atomic types, such as load(std::memory_order_acquire)
- Operations on POSIX mutexes, such as pthread_mutex_lock

<br/>

- GCC内置的某些汇编指令, 如PowerPC专用的 `asm volatile("lwsync" ::: "memory")`
- Win32所有的 [Interlocked操作](http://msdn.microsoft.com/en-us/library/windows/desktop/ms684122.aspx), 但Xbox 360除外.
- C++11的一些[原子操作(atomic types)](http://en.cppreference.com/w/cpp/atomic/atomic), 如 `load(std::memory_order_acquire)``
- POSIX系统中的互斥锁(mutexes), 例如 [`pthread_mutex_lock`](http://linux.die.net/man/3/pthread_mutex_lock)


Just as there are many instructions which act as memory barriers, there are many different types of memory barriers to know about. Indeed, not all of the above instructions produce the same kind of memory barrier – leading to another possible area of confusion when writing lock-free code. In an attempt to clear things up to some extent, I’d like to offer an analogy which I’ve found helpful in understanding the vast majority (but not all) of possible memory barrier types.

既然有很多可作为内存屏障的指令, 也就存在多种不同类型的内存屏障。
事实上,前面提到的这些指令并不是同一种类型的内存屏障, 在编写无锁代码时可能会存在一些困扰。
为了更清楚地说明, 我会做一些类比, 应该能帮助您理解大部分的内存屏障类型。



To begin with, consider the architecture of a typical multicore system. Here’s a device with two cores, each having 32 KiB of private L1 data cache. There’s 1 MiB of L2 cache shared between both cores, and 512 MiB of main memory.

首先, 考虑典型的多核心CPU系统平台。 假设CPU有两个核心, 每个core有`32 KB`的私有L1 data cache. 以及`1 MB`的共享L2 cache, 物理内存为`512 MB`。


![](01_cpu-diagram.png)




A multicore system is a bit like a group of programmers collaborating on a project using a bizarre kind of source control strategy. For example, the above dual-core system corresponds to a scenario with just two programmers. Let’s name them Larry and Sergey.

多核心CPU的系统平台, 类似于多个程序员通过版本工具的协作来开发项目。 例如, 双核系统对应于两个程序员的场景。 假设他们的名字是Larry(Larry)和谢尔盖(Sergey)。

> 这哥俩是Google的创始人

![](02_source-control-analogy.png)


On the right, we have a shared, central repository – this represents a combination of main memory and the shared L2 cache. Larry has a complete working copy of the repository on his local machine, and so does Sergey – these (effectively) represent the L1 caches attached to each CPU core. There’s also a scratch area on each machine, to privately keep track of registers and/or local variables. Our two programmers sit there, feverishly editing their working copy and scratch area, all while making decisions about what to do next based on the data they see – much like a thread of execution running on that core.

有一个共享的代码服务器, 就类似系统中的内存+L2缓存。 Larry的PC上有这个仓库的完整副本, 谢尔盖的PC也一样, 类似于每个CPU内核的L1缓存。
每个程序员的PC上都有草稿区域(scratch area), 就类似于内核私有的寄存器(register) 和 局部变量(local variables).  
然后两个程序员坐在那里, 疯狂地加班写BUG, 也就是编辑PC上的工作副本和草稿区域, 至于下一步要做什么则完全取决于他们看到的信息 —— 他们就像是在CPU核心上执行的线程。


Which brings us to the source control strategy. In this analogy, the source control strategy is very strange indeed. As Larry and Sergey modify their working copies of the repository, their modifications are constantly leaking in the background, to and from the central repository, at totally random times. Once Larry edits the file X, his change will leak to the central repository, but there’s no guarantee about when it will happen. It might happen immediately, or it might happen much, much later. He might go on to edit other files, say Y and Z, and those modifications might leak into the respository before X gets leaked. In this manner, stores are effectively reordered on their way to the repository.


看看代码版本控制策略。 在这个类比中, 代码版本控制策略非常奇怪。
Larry和谢尔盖修改各自的工作副本, 他们在后台不断地修改BUG, 随时可能和中央仓库同步。 只要Larry编辑X文件, 他的修改就会写入将到中央仓库, 但是不能保证什么时候会同步, 可能会立即推送, 也可能稍后再推送。 还可能去编辑其他文件, 比如Y和Z, 而且这些修改还可能在X同步之前写入到中央仓库中。 通过这种方式, 有效地重排了将各个文件保存到仓库的顺序。


Similarly, on Sergey’s machine, there’s no guarantee about the timing or the order in which those changes leak back from the repository into his working copy. In this manner, loads are effectively reordered on their way out of the repository.

同样, 谢尔盖的机器, 也就不能保证从中央仓库同步文件到本地副本的顺序。 以这种方式, 从仓库load代码的顺序被打乱了。


Now, if each programmer works on completely separate parts of the repository, neither programmer will be aware of these background leaks going on, or even of the other programmer’s existence. That would be analogous to running two independent, single-threaded processes. In this case, the cardinal rule of memory ordering is upheld.

现在, 如果每个程序员操作的文件和别人完全不同, 则他们都不会意识到底层会有这些问题, 甚至意识不到其他程序员的存在.
就类似于两个独立的单线程的进程。这种情况, 符合[内存排序的基本规则](http://preshing.com/20120625/memory-ordering-at-compile-time)。


The analogy becomes more useful once our programmers start working on the same parts of the repository. Let’s revisit the example I gave in an earlier post. X and Y are global variables, both initially 0:

一旦多个程序员开始处理相同的文件，这种类比就会变得更加明显。让我们回顾[前一篇文章中的例子](http://preshing.com/20120515/memory-reordering-caught-in-the-act)。X和Y是全局变量，初始值都为0:


![](03_marked-example2-2.png)




Think of X and Y as files which exist on Larry’s working copy of the repository, Sergey’s working copy, and the central repository itself. Larry writes 1 to his working copy of X and Sergey writes 1 to his working copy of Y at roughly the same time. If neither modification has time to leak to the repository and back before each programmer looks up his working copy of the other file, they’ll end up with both r1 = 0 and r2 = 0. This result, which may have seemed counterintuitive at first, actually becomes pretty obvious in the source control analogy.

可以将X和Y看作文件， 存在于Larry的工作副本、Sergey的工作副本，以及中央仓库中。 Larry将工作副本中X文件的内容设置为1, 谢尔盖大约在同一时间将工作副本中Y文件的内容设置为1。
如果在每个程序员查找另一个文件之前，这两次修改都没有保存到中央仓库并返回， 那么代码最终得到的结果将会是 r1=0和r2=0.
乍一看这个结果似乎违反直觉，但实际上在代码控制的类比中变得非常明显。


![](04_iriw-state.png)





## 内存屏障的类型


Fortunately, Larry and Sergey are not entirely at the mercy of these random, unpredictable leaks happening in the background. They also have the ability to issue special instructions, called fence instructions, which act as memory barriers. For this analogy, it’s sufficient to define four types of memory barrier, and thus four different fence instructions. Each type of memory barrier is named after the type of memory reordering it’s designed to prevent: for example, #StoreLoad is designed to prevent the reordering of a store followed by a load.

还好, Larry和谢尔盖并不是完全被这些后台的随机操作摆布。 他们可以发出一些特别的指令, 称为栅栏指令（fence instruction）, 用来充当内存屏障（memory barrier）。对于这个类比, 可以定义四种类型的内存屏障, 因此有四个不同的栅栏指令. 每种类型的内存屏障，根据其阻止的内存重排序类型命名: 例如, `#StoreLoad` 旨在防止 `store` 与后面的 `load` 被重排序。


![](05_barrier-types.png)




As Doug Lea points out, these four categories map pretty well to specific instructions on real CPUs – though not exactly. Most of the time, a real CPU instruction acts as some combination of the above barrier types, possibly in addition to other effects. In any case, once you understand these four types of memory barriers in the source control analogy, you’re in a good position to understand a large number of instructions on real CPUs, as well as several higher-level programming language constructs.

[Doug Lea指出](http://gee.cs.oswego.edu/dl/jmm/cookbook.html), 这4种类型能很好地映射为CPU的特定指令 —— 尽管不是所有CPU都支持。
大部分时候, 真正的CPU指令会实现以上多个屏障的效果，也就是会有其他效果。 无论如何，只要理解了这四种类型的内存屏障，也就能很好地理解真实CPU的大量指令, 以及一些高级编程语言的构造。


### `#LoadLoad`



A LoadLoad barrier effectively prevents reordering of loads performed before the barrier with loads performed after the barrier.

LoadLoad屏障能防止屏障之前load与屏障之后的load被重排序。


In our analogy, the `#LoadLoad` fence instruction is basically equivalent to a pull from the central repository. Think git pull, hg pull, p4 sync, svn update or cvs update, all acting on the entire repository. If there are any merge conflicts with his local changes, let’s just say they’re resolved randomly.

在版本库类比中, `#LoadLoad` 栅栏指令基本上相当于将从中央仓库拉取代码。比如 `git pull`, `hg pull`, `p4 sync`, `svn update` 或者 `cvs update`, 作用于整个仓库。 如果与本地代码存在冲突, 此处假定为随机解决。


![](06_loadload.png)




Mind you, there’s no guarantee that #LoadLoad will pull the latest, or head, revision of the entire repository! It could very well pull an older revision than the head, as long as that revision is at least as new as the newest value which leaked from the central repository into his local machine.

请注意, `#LoadLoad` 并不能保证会拉取到整个仓库最新的状态! 很可能会pull到一个比head要旧的修订, 只要能保证拉取到本地的修订至少和本地机器的修改一样新。


This may sound like a weak guarantee, but it’s still a perfectly good way to prevent seeing stale data. Consider the classic example, where Sergey checks a shared flag to see if some data has been published by Larry. If the flag is true, he issues a #LoadLoad barrier before reading the published value:

可能听起来这个保证有点弱, 但仍然是一个防止看到陈旧数据的好方案。 考虑经典的例子, 谢尔盖检查一个共享标志, 确定某些数据是否已经发送到Larry的机器。如果标志是true, 则在读取发布的数据前，插入一个 `#LoadLoad` 屏障:

```
	if (IsPublished)                   // Load and check shared flag
	{
	    LOADLOAD_FENCE();              // Prevent reordering of loads
	    return Value;                  // Load published value
	}
```



Obviously, this example depends on having the IsPublished flag leak into Sergey’s working copy by itself. It doesn’t matter exactly when that happens; once the leaked flag has been observed, he issues a #LoadLoad fence to prevent reading some value of Value which is older than the flag itself.

显然, 这个例子取决于 `IsPublished` 标志是否发布到了谢尔盖的工作副本中。 不管什么时候, 只要标志被检测到, 就发送一条 `#LoadLoad` 栅栏指令, 保证不会读取到比 flag 更古老的 Value 值。


### `#StoreStore`



A StoreStore barrier effectively prevents reordering of stores performed before the barrier with stores performed after the barrier.

StoreStore 屏障能有效防止在屏障之前的store，与屏障之后的store指令被重排序执行。


In our analogy, the #StoreStore fence instruction corresponds to a push to the central repository. Think git push, hg push, p4 submit, svn commit or cvs commit, all acting on the entire repository.

类比代码版本库, `#StoreStore` 栅栏指令对应push到中央存储库的操作。比如 `git push`, `hg push`, `p4 submit`, s`vn commit` 或者 `cvs commit`, 都是作用于整个存储库的。


![](07_storestore.png)




As an added twist, let’s suppose that #StoreStore instructions are not instant. They’re performed in a delayed, asynchronous manner. So, even though Larry executes a #StoreStore, we can’t make any assumptions about when all his previous stores finally become visible in the central repository.

作为额外的开关, 假设 `#StoreStore` 指令也不即时执行。 而是以延迟,异步的方式执行。 所以, 即使Larry执行了`#StoreStore`, 我们不能预判出他之前的store操作什么时候才会在中央存储库可见。


This, too, may sound like a weak guarantee, but again, it’s perfectly sufficient to prevent Sergey from seeing any stale data published by Larry. Returning to the same example as above, Larry needs only to publish some data to shared memory, issue a #StoreStore barrier, then set the shared flag to true:

这听起来也像是一个弱保证, 但同样, 它也能完全阻止Sergey看到Larry发布的陈旧数据。
回到上面的例子, Larry只需要发布一些数据到共享内存, 发送 `#StoreStore` 屏障, 然后再将共享标志设置为true:

```
	Value = x;                         // Publish some data
	STORESTORE_FENCE();
	IsPublished = 1;                   // Set shared flag to indicate availability of data
```



Again, we’re counting on the value of IsPublished to leak from Larry’s working copy over to Sergey’s, all by itself. Once Sergey detects that, he can be confident he’ll see the correct value of Value. What’s interesting is that, for this pattern to work, Value does not even need to be an atomic type; it could just as well be a huge structure with lots of elements.

再次, 我们指望从Larry工作副本将 IsPublished 的值同步到 Sergey 的机器。一旦Sergey检测到, 他有可以确信 看到的 Value 值是正确的. 有趣的是,这种模式工作, Value 甚至可以不是原子类型; 它可以是一个有很多元素的庞大结构体。


### `#LoadStore`



Unlike #LoadLoad and #StoreStore, there’s no clever metaphor for #LoadStore in terms of source control operations. The best way to understand a #LoadStore barrier is, quite simply, in terms of instruction reordering.

与 `#LoadLoad` , `#StoreStore` 屏障不同, `#LoadStore` 在版本控制操作中没有适当的类比。
要理解`#LoadStore`屏障的比较好的方法，是理解一个简单的术语, 指令重排序(instruction reordering)。


![](08_get-back-to-later.png)




Imagine Larry has a set of instructions to follow. Some instructions make him load data from his private working copy into a register, and some make him store data from a register back into the working copy. Larry has the ability to juggle instructions, but only in specific cases. Whenever he encounters a load, he looks ahead at any stores that are coming up after that; if the stores are completely unrelated to the current load, then he’s allowed to skip ahead, do the stores first, then come back afterwards to finish up the load. In such cases, the cardinal rule of memory ordering – never modify the behavior of a single-threaded program – is still followed.

想象Larry有一组指令要执行。 一些指令让他将私人工作副本的数据load到寄存器, 另一些让他从寄存器中将数据store回工作副本。
Larry有能力调整指令的执行顺序, 但只在某些特定的情况下允许。
每当他遇到load指令时, 往后面查找是否有store指令, 如果后面的store和当前load完全不相关, 他可以跳过load,先执行store,完成后再回来执行load。
在这种情况下,指令重排序的基本规则 - 不影响单线程程序的行为, 仍然是符合的。


On a real CPU, such instruction reordering might happen on certain processors if, say, there is a cache miss on the load followed by a cache hit on the store. But in terms of understanding the analogy, such hardware details don’t really matter. Let’s just say Larry has a boring job, and this is one of the few times when he’s allowed to get creative. Whether or not he chooses to do it is completely unpredictable. Fortunately, this is a relatively inexpensive type of reordering to prevent; when Larry encounters a #LoadStore barrier, he simply refrains from such reordering around that barrier.

如果是真正的CPU, 指令重排序上可能在某些处理器上发生, 比如, 有一个load的操作数在缓存中未命中, 而后面紧跟的store却命中了缓存.
但在理解类比时,这种底层的硬件实现细节并不重要。 假设Larry的工作有点无聊, 在为数不多的时候, 他可以自作主张.是否如此选择是完全不可预测的。
幸运的是, 这是一种相对廉价的防止重排序的方式; 当Larry遇到 `#LoadStore` 屏障时, 只要在屏障附件去除重排序功能即可。


In our analogy, it’s valid for Larry to perform this kind of LoadStore reordering even when there is a #LoadLoad or #StoreStore barrier between the load and the store. However, on a real CPU, instructions which act as a #LoadStore barrier typically act as at least one of those other two barrier types.

在我们的示例中, 即使在 load 和 store 指令之间存在 `#LoadLoad` 或 `#StoreStore` 屏障,  Larry也是可以执行 LoadStore 这种重排序的。
当然, 在真正的CPU中, `#LoadStore` 屏障对应的指令，至少也会起到另外两个屏障之一的作用。


### `#StoreLoad`



A StoreLoad barrier ensures that all stores performed before the barrier are visible to other processors, and that all loads performed after the barrier receive the latest value that is visible at the time of the barrier. In other words, it effectively prevents reordering of all stores before the barrier against all loads after the barrier, respecting the way a sequentially consistent multiprocessor would perform those operations.

StoreLoad屏障, 能确保屏障之前执行的所有store操作，都对其他处理器可见; 在屏障后面执行的load指令, 都能接收到最新的值。
换句话说, 有效阻止屏障之前的store指令，与屏障之后的load指令乱序 、即使是多核心处理器，在执行这些操作时的[]顺序也是一致的](http://preshing.com/20120612/an-introduction-to-lock-free-programming#sequential-consistency)。


#StoreLoad is unique. It’s the only type of memory barrier that will prevent the result r1 = r2 = 0 in the example given in Memory Reordering Caught in the Act; the same example I’ve repeated earlier in this post.

`#StoreLoad` 是独一无二的. 这是 [Memory Reordering Caught in the Act](http://preshing.com/20120515/memory-reordering-caught-in-the-act) 示例中, 唯一一个可以防止 `r1 = r2 = 0` 重排序的内存屏障类型; 同样的例子在这篇文章中也重申了。


If you’ve been following closely, you might wonder: How is #StoreLoad different from a #StoreStore followed by a #LoadLoad? After all, a #StoreStore pushes changes to the central repository, while #LoadLoad pulls remote changes back. However, those two barrier types are insufficient. Remember, the push operation may be delayed for an arbitrary number of instructions, and the pull operation might not pull from the head revision. This hints at why the PowerPC’s lwsync instruction – which acts as all three #LoadLoad, #LoadStore and #StoreStore memory barriers, but not #StoreLoad – is insufficient to prevent r1 = r2 = 0 in that example.

如果你密切关注, 可能会想知道: `#StoreLoad` 屏障，与 `#StoreStore` + `#LoadLoad` 屏障的组合有什么区别?
毕竟, `#StoreStore` 将更改推送到中央仓库, 而 `#LoadLoad` 将远程更改拉回来。 然而,这两个屏障类型是不够的。
记住, push 操作可能会推迟到任意数量的指令后面, 而 pull 操作可能也拉取不到 head 修正。
这业务暗示了为什么 PowerPC 的 `lwsync`指令并不能阻止该示例中的 `r1 = r2 = 0` 重排序,(`lwsync` 充当的是 `#LoadLoad`、`#LoadStore`和`#StoreStore`这3个内存屏障，却不是`#StoreLoad` 屏障.)


In terms of the analogy, a #StoreLoad barrier could be achieved by pushing all local changes to the central repostitory, waiting for that operation to complete, then pulling the absolute latest head revision of the repository. On most processors, instructions that act as a #StoreLoad barrier tend to be more expensive than instructions acting as the other barrier types.

在类比中, `#StoreLoad` 屏障可以通过将所有的本地更改推送到中央仓库中，并等待操作完成, 然后pull仓库中绝对最新的修订来实现。在大多数的处理器上, 作为 `#StoreLoad` 屏障的指令往往比其他的屏障指令代价更高。


![](09_storeload.png)




If we throw a #LoadStore barrier into that operation, which shouldn’t be a big deal, then what we get is a full memory fence – acting as all four barrier types at once. As Doug Lea also points out, it just so happens that on all current processors, every instruction which acts as a #StoreLoad barrier also acts as a full memory fence.

如果我们把 `#LoadStore`(???) 屏障扔进指令中, 可能问题不大, 我们得到的是一个完整的内存栅栏,充当所有四个屏障类型。
[Doug Lea还指出](http://gee.cs.oswego.edu/dl/jmm/cookbook.html), 碰巧了, 在限制的所有处理器中, 充当 `#StoreLoad` 屏障的指令，也能扮演一个完整的内存内存栅栏。



## 这个类比对你有多少帮助?


As I’ve mentioned previously, every processor has different habits when it comes to memory ordering. The x86/64 family, in particular, has a strong memory model; it’s known to keep memory reordering to a minimum. PowerPC and ARM have weaker memory models, and the Alpha is famous for being in a league of its own. Fortunately, the analogy presented in this post corresponds to a weak memory model. If you can wrap your head around it, and enforce correct memory ordering using the fence instructions given here, you should be able to handle most CPUs.

正如我前面所提到的, 各种处理器的内存排序行为都是不同的。尤其是 x86/64 家族,拥有强内存模型(strong memory model), 很少有内存重排序。而PowerPC和ARM 的是弱内存模型(weaker memory models),和 Alpha 而闻名的联盟。幸运的是, 这篇文章中给出的类比对应于一个弱内存模型(weak memory model)。如果你在大脑中记住, 并使用栅栏指令执行正确的内存排序, 你应该能应付大部分的 cpu。


The analogy also corresponds pretty well to the abstract machine targeted by both C++11 (formerly known as C++0x) and C11. Therefore, if you write lock-free code using the standard library of those languages while keeping the above analogy in mind, it’s more likely to function correctly on any platform.

这个类比也很好地对应了 C++11(原名 C++0x)和 C11中的抽象机器。因此,如果你写无锁代码时使用到这些语言的标准库,请记住上述的类比,
这可以让你的代码在任何平台都会正确执行。


In this analogy, I’ve said that each programmer represents a single thread of execution running on a separate core. On a real operating system, threads tend to move between different cores over the course of their lifetime, but the analogy still works. I’ve also alternated between examples in machine language and examples written in C/C++. Obviously, we’d prefer to stick with C/C++, or another high-level language; this is possible because again, any operation which acts as a memory barrier also prevents compiler reordering.

在这个比喻中,每个程序员代表运行在单独核心上的单个线程。在真正的操作系统中, 线程在生命周期中会在不同的 core 核之间执行, 但这个类比仍然是有效的。我也时常在机器语言和 C/C++ 程序的示例中选择. 显然,我们更喜欢 C/C++ 这样的高级语言, 这可能是因为, 充当内存屏障的任何操作同时也阻止了编译器重排序。


I haven’t written about every type of memory barrier yet. For instance, there are also data dependency barriers. I’ll describe those further in a future post. Still, the four types given here are the big ones.


我没有介绍所有类型的内存屏障。例如,存在数据依赖关系的屏障。我将在今后的博文中介绍这些。当然,这里介绍的四种类型是最常见的。


If you’re interested in how CPUs work under the hood – things like stores buffers, cache coherency protocols and other hardware implementation details – and why they perform memory reordering in the first place, I’d recommend the fine work of Paul McKenney & David Howells. Indeed, I suspect most programmers who have successfully written lock-free code have at least a passing familiarity with such hardware details.


如果你对cpu在幕后如何工作感兴趣 —— 如存储缓冲区(stores buffers), 缓存一致性协议(cache coherency protocols) 或者 硬件相关的实现细节, 为什么他们会先执行内存重排序? 我推荐 Paul McKenney & David Howells 的相关文档: [whymb.2010.07.23a.pdf](whymb.2010.07.23a.pdf), [memory-barriers.txt](http://www.kernel.org/doc/Documentation/memory-barriers.txt), 。 事实上,我怀疑大多数写过无锁代码的程序员都不清楚硬件实现的细节。









欢迎加入: [CNC开源技术交流群 316630025](http://jq.qq.com/?_wv=1027&k=Z4v6kn)


原文链接: [http://preshing.com/20120710/memory-barriers-are-like-source-control-operations/](http://preshing.com/20120710/memory-barriers-are-like-source-control-operations/)


原文日期: 2012年07月10日


翻译日期: 2016年03月05日


翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
