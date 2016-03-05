Memory Barriers Are Like Source Control Operations
==

记忆障碍就像源控制操作


If you use source control, you’re on your way towards understanding memory ordering, an important consideration when writing lock-free code in C, C++ and other languages.

如果你使用源代码控制,朝着理解记忆点,路上一个重要的考虑在编写锁定代码用C,c++和其他语言。


In my last post, I wrote about memory ordering at compile time, which forms one half of the memory ordering puzzle. This post is about the other half: memory ordering at runtime, on the processor itself. Like compiler reordering, processor reordering is invisible to a single-threaded program. It only becomes apparent when lock-free techniques are used – that is, when shared memory is manipulated without any mutual exclusion between threads. However, unlike compiler reordering, the effects of processor reordering are only visible in multicore and multiprocessor systems.

,处理器本身。像编译器重新排序,处理器重新排序是无形的一个单线程的程序。它使用锁定技术时,才会显现,当共享内存操作没有任何线程之间相互排斥。但是,与编译器重新排序,处理器重新排序的影响只是可见多核、多处理器系统。


You can enforce correct memory ordering on the processor by issuing any instruction which acts as a memory barrier. In some ways, this is the only technique you need to know, because when you use such instructions, compiler ordering is taken care of automatically. Examples of instructions which act as memory barriers include (but are not limited to) the following:

你可以执行正确的内存排序处理器通过发出任何指令充当内存屏障。在某些方面,这是你需要知道的唯一技术,因为当你使用说明等,“ordering is采取护理of automatically。举例说明,其作为memory的障碍包括(但不限于)是以下:


- Certain inline assembly directives in GCC, such as the PowerPC-specific asm volatile("lwsync" ::: "memory")
- Any Win32 Interlocked operation, except on Xbox 360
- Many operations on C++11 atomic types, such as load(std::memory_order_acquire)
- Operations on POSIX mutexes, such as pthread_mutex_lock

——某些内联汇编指令在GCC,比如PowerPC-specific asm挥发性(“lwsync”:::“记忆”)
在c++ 11日——许多操作原子类型,如负载(std::memory_order_acquire)


Just as there are many instructions which act as memory barriers, there are many different types of memory barriers to know about. Indeed, not all of the above instructions produce the same kind of memory barrier – leading to another possible area of confusion when writing lock-free code. In an attempt to clear things up to some extent, I’d like to offer an analogy which I’ve found helpful in understanding the vast majority (but not all) of possible memory barrier types.

就像有许多指令作为记忆障碍,有许多不同类型的记忆障碍了解。事实上,不是所有的上述指令产生同样的记忆障碍,导致另一个可能的混乱地区当编写无锁代码。在某种程度上为了澄清一些事情,


To begin with, consider the architecture of a typical multicore system. Here’s a device with two cores, each having 32 KiB of private L1 data cache. There’s 1 MiB of L2 cache shared between both cores, and 512 MiB of main memory.

首先,考虑一个典型的多核系统的体系结构。这里有一个设备有两个核心,各有32个简约的私人L1缓存数据.有1 MiB的L2高速缓存之间共享核心,和512 MiB的主内存。


![](01_cpu-diagram.png)




A multicore system is a bit like a group of programmers collaborating on a project using a bizarre kind of source control strategy. For example, the above dual-core system corresponds to a scenario with just two programmers. Let’s name them Larry and Sergey.

多核系统有点像一群程序员合作项目使用一种奇异的源代码控制策略。例如,上述双核系统对应于一个场景只有两个程序员。让他们的名字拉里和谢尔盖。


![](02_source-control-analogy.png)




On the right, we have a shared, central repository – this represents a combination of main memory and the shared L2 cache. Larry has a complete working copy of the repository on his local machine, and so does Sergey – these (effectively) represent the L1 caches attached to each CPU core. There’s also a scratch area on each machine, to privately keep track of registers and/or local variables. Our two programmers sit there, feverishly editing their working copy and scratch area, all while making decisions about what to do next based on the data they see – much like a thread of execution running on that core.

在右边,有一个共享的中央存储库,这是主内存和共享L2高速缓存。拉里有一个完整的工作副本的存储库在本地机器上,,谢尔盖-这些(有效)代表了L1缓存连接到每个CPU核心。在每台机器上也有划痕区域,私下跟踪注册和/或局部变量.我们两个程序员坐在那里,狂热地编辑他们的工作副本和划痕区域,同时决定下一步要做什么基于他们看到的数据——就像一个核心的执行的线程上运行。


Which brings us to the source control strategy. In this analogy, the source control strategy is very strange indeed. As Larry and Sergey modify their working copies of the repository, their modifications are constantly leaking in the background, to and from the central repository, at totally random times. Once Larry edits the file X, his change will leak to the central repository, but there’s no guarantee about when it will happen. It might happen immediately, or it might happen much, much later. He might go on to edit other files, say Y and Z, and those modifications might leak into the respository before X gets leaked. In this manner, stores are effectively reordered on their way to the repository.

这就是我们所说的源代码控制策略。在这个比喻中,源代码控制策略是非常奇怪的。拉里和谢尔盖修改他们的工作副本的存储库,他们在后台修改不断泄漏,并从中央存储库,完全随机。一旦拉里编辑文件X,他的变化将泄漏到中央存储库中,但是不能保证什么时候会发生。它可能会立即发生,也可能发生得晚。他可能继续编辑其他文件,说Y和Z,之前,这些修改可能泄漏到资源库中X被泄露。通过这种方式,商店都有效地重新排序在存储库。


Similarly, on Sergey’s machine, there’s no guarantee about the timing or the order in which those changes leak back from the repository into his working copy. In this manner, loads are effectively reordered on their way out of the repository.

同样,谢尔盖的机器,没有保证这些变化的时间或顺序泄漏从存储库到他的工作副本。以这种方式,负载上有效地重新排序的存储库。


Now, if each programmer works on completely separate parts of the repository, neither programmer will be aware of these background leaks going on, or even of the other programmer’s existence. That would be analogous to running two independent, single-threaded processes. In this case, the cardinal rule of memory ordering is upheld.

现在,如果每个程序员工作的完全独立的部分存储库,既不是程序员将会意识到这些背景泄漏,甚至其他的程序员的存在.这将是类似于运行两个独立的单线程的过程。在这种情况下,内存排序是维持的基本规则。


The analogy becomes more useful once our programmers start working on the same parts of the repository. Let’s revisit the example I gave in an earlier post. X and Y are global variables, both initially 0:

《关于analogy becomes more programmers我们在裁武会谈盲人The same subject份额of The持有人。《学校读书在发生一例口追究犯有严重汉服。X和Y are全面变量,最初两个0:


![](03_marked-example2-2.png)




Think of X and Y as files which exist on Larry’s working copy of the repository, Sergey’s working copy, and the central repository itself. Larry writes 1 to his working copy of X and Sergey writes 1 to his working copy of Y at roughly the same time. If neither modification has time to leak to the repository and back before each programmer looks up his working copy of the other file, they’ll end up with both r1 = 0 and r2 = 0. This result, which may have seemed counterintuitive at first, actually becomes pretty obvious in the source control analogy.

X和Y as Think of Larry’s workingpaper廉政which files有保存人,Sergey’s workingpaper照搬西方持有人的合作等等,中央and the持有人.拉里写1到他工作副本的X和Sergey写1到他工作副本的Y在大致相同的时间.如果修改都没有时间泄漏到存储库中,每个程序员查找之前他的其他文件的工作副本,他们最终会与r1 = 0和r2 = 0。这个结果,这可能似乎是违反直觉的,实际上在源代码控制类比会变得非常明显。


![](04_iriw-state.png)




## Types of Memory Barrier

# #类型的记忆障碍


Fortunately, Larry and Sergey are not entirely at the mercy of these random, unpredictable leaks happening in the background. They also have the ability to issue special instructions, called fence instructions, which act as memory barriers. For this analogy, it’s sufficient to define four types of memory barrier, and thus four different fence instructions. Each type of memory barrier is named after the type of memory reordering it’s designed to prevent: for example, #StoreLoad is designed to prevent the reordering of a store followed by a load.

幸运的是,拉里和谢尔盖并不完全的摆布这些随机的,不可预知的泄漏发生在后台。他们也有能力问题的特别指示,叫栅栏指令,它作为记忆障碍。对于这个比喻,它足以定义四种类型的记忆障碍,因此四个不同栅栏指令.每种类型的内存屏障命名类型的内存重新排序旨在防止:例如,# StoreLoad旨在防止商店,后跟一个负载的重新排序。


![](05_barrier-types.png)




As Doug Lea points out, these four categories map pretty well to specific instructions on real CPUs – though not exactly. Most of the time, a real CPU instruction acts as some combination of the above barrier types, possibly in addition to other effects. In any case, once you understand these four types of memory barriers in the source control analogy, you’re in a good position to understand a large number of instructions on real CPUs, as well as several higher-level programming language constructs.

Doug Lea指出,这四个类别很好地映射到特定指令——尽管不是在真正的cpu。大部分的时间,针对社区劳教as a real指示上述认为some示范年东耶鲁撒冷。其他加法综合报告,一旦你理解了这四种类型的记忆障碍的源代码控制类比,你在一个好的位置理解大量的说明真正的cpu,以及一些高级编程语言构造。


### #LoadLoad

# # # # LoadLoad


A LoadLoad barrier effectively prevents reordering of loads performed before the barrier with loads performed after the barrier.

LoadLoad障碍有效防止重新排序的加载执行之前执行的障碍与负载之后的障碍。


In our analogy, the #LoadLoad fence instruction is basically equivalent to a pull from the central repository. Think git pull, hg pull, p4 sync, svn update or cvs update, all acting on the entire repository. If there are any merge conflicts with his local changes, let’s just say they’re resolved randomly.

在我们的类比,# LoadLoad栅栏指令基本上相当于将从中央仓库。认为git拉,hg拉,p4同步,svn cvs更新或更新,所有作用于整个存储库。如果有任何和他的本地更改合并冲突,假设他们解决随机。


![](06_loadload.png)




Mind you, there’s no guarantee that #LoadLoad will pull the latest, or head, revision of the entire repository! It could very well pull an older revision than the head, as long as that revision is at least as new as the newest value which leaked from the central repository into his local machine.

请注意,不能保证# LoadLoad将最新的,或头,整个库的修改!它很可能将比头一个年长的修订,只要修改至少是一样新最新的价值从中央存储库泄露到本地机器上。


This may sound like a weak guarantee, but it’s still a perfectly good way to prevent seeing stale data. Consider the classic example, where Sergey checks a shared flag to see if some data has been published by Larry. If the flag is true, he issues a #LoadLoad barrier before reading the published value:

这可能听起来像一个虚弱的保证,但它仍然是一个完美的方法来防止看到陈旧的数据。考虑到经典的例子,谢尔盖在检查一个共享的国旗,看看一些数据已经发表的拉里。如果国旗是真的,他的问题# LoadLoad屏障前阅读发布的值:


	if (IsPublished)                   // Load and check shared flag
	{
	    LOADLOAD_FENCE();              // Prevent reordering of loads
	    return Value;                  // Load published value
	}

如果(发表)/ /加载和检查共享国旗


Obviously, this example depends on having the IsPublished flag leak into Sergey’s working copy by itself. It doesn’t matter exactly when that happens; once the leaked flag has been observed, he issues a #LoadLoad fence to prevent reading some value of Value which is older than the flag itself.

显然,这个例子取决于拥有发表标志本身泄漏到谢尔盖的工作副本。不管什么时候发生,一旦泄露的国旗被观察到,他问题# LoadLoad栅栏防止阅读一些价值的价值比国旗本身。


### #StoreStore

# # # # StoreStore


A StoreStore barrier effectively prevents reordering of stores performed before the barrier with stores performed after the barrier.

StoreStore障碍有效防止执行的商店之前执行障碍与商店重新排序后障碍。


In our analogy, the #StoreStore fence instruction corresponds to a push to the central repository. Think git push, hg push, p4 submit, svn commit or cvs commit, all acting on the entire repository.

在我们的类比,# StoreStore栅栏指令对应一个推到中央存储库中。认为git push,hg push,p4提交、svn cvs提交或提交,所有作用于整个存储库。


![](07_storestore.png)




As an added twist, let’s suppose that #StoreStore instructions are not instant. They’re performed in a delayed, asynchronous manner. So, even though Larry executes a #StoreStore, we can’t make any assumptions about when all his previous stores finally become visible in the central repository.

作为一个额外的扭转,假设# StoreStore指令不即时。他们在延迟执行,异步方式。所以,即使拉里执行# StoreStore,我们不能做出任何假设当所有他以前商店最终成为可见的中央存储库。


This, too, may sound like a weak guarantee, but again, it’s perfectly sufficient to prevent Sergey from seeing any stale data published by Larry. Returning to the same example as above, Larry needs only to publish some data to shared memory, issue a #StoreStore barrier, then set the shared flag to true:

这也可能听起来像一个虚弱的保证,但同样,它是完全足以防止Sergey看到任何陈旧的数据发表的拉里。回到上面的例子一样,拉里只需要发布一些数据共享内存,# StoreStore障碍问题,然后设置共享国旗真:


	Value = x;                         // Publish some data
	STORESTORE_FENCE();
	IsPublished = 1;                   // Set shared flag to indicate availability of data

值= x;/ /发布一些数据


Again, we’re counting on the value of IsPublished to leak from Larry’s working copy over to Sergey’s, all by itself. Once Sergey detects that, he can be confident he’ll see the correct value of Value. What’s interesting is that, for this pattern to work, Value does not even need to be an atomic type; it could just as well be a huge structure with lots of elements.

再次,我们指望的价值发表泄漏从拉里工作副本交给布林的本身。一旦Sergey检测到,他有信心他会看到正确的价值的价值.有趣的是,这种模式工作,甚至不需要一个价值原子类型;它可以是一个巨大的结构有很多元素。


### #LoadStore

# # # # LoadStore


Unlike #LoadLoad and #StoreStore, there’s no clever metaphor for #LoadStore in terms of source control operations. The best way to understand a #LoadStore barrier is, quite simply, in terms of instruction reordering.

与# LoadLoad和# StoreStore,巧妙的比喻# LoadStore源代码控制操作。要理解一个# LoadStore障碍的最好方法是,很简单,的指令重新排序。


![](08_get-back-to-later.png)




Imagine Larry has a set of instructions to follow. Some instructions make him load data from his private working copy into a register, and some make him store data from a register back into the working copy. Larry has the ability to juggle instructions, but only in specific cases. Whenever he encounters a load, he looks ahead at any stores that are coming up after that; if the stores are completely unrelated to the current load, then he’s allowed to skip ahead, do the stores first, then come back afterwards to finish up the load. In such cases, the cardinal rule of memory ordering – never modify the behavior of a single-threaded program – is still followed.

想象拉里有一组指令。一些指令让他从他的私人工作副本数据加载到一个寄存器,和一些使他从一个寄存器存储数据回工作副本。拉里有能力处理指令,但只有在特定的情况下。每当他遇到一个负载,之前他看起来在任何商店出现之后,如果商店是完全不相关的当前负载,然后他可以跳过,先做商店,然后回来之后完成加载。在这种情况下,内存的基本规则排序-不修改单线程程序的行为仍然是紧随其后。


On a real CPU, such instruction reordering might happen on certain processors if, say, there is a cache miss on the load followed by a cache hit on the store. But in terms of understanding the analogy, such hardware details don’t really matter. Let’s just say Larry has a boring job, and this is one of the few times when he’s allowed to get creative. Whether or not he chooses to do it is completely unpredictable. Fortunately, this is a relatively inexpensive type of reordering to prevent; when Larry encounters a #LoadStore barrier, he simply refrains from such reordering around that barrier.

等一个真正的CPU,指令重新排序上可能发生某些处理器,如果小姐说,有一个缓存负载,后跟一个缓存命中的商店.但在理解类比,这样硬件细节真的不重要。假设拉里有一份无聊的工作,这是为数不多的时候,他可以得到创新.他选择这样做是否完全不可预测的。幸运的是,这是一种相对廉价的重新排序,以防止;当拉里遇到一个# LoadStore障碍,他只是没有从这样的重新排序,障碍。


In our analogy, it’s valid for Larry to perform this kind of LoadStore reordering even when there is a #LoadLoad or #StoreStore barrier between the load and the store. However, on a real CPU, instructions which act as a #LoadStore barrier typically act as at least one of those other two barrier types.

在我们的类比,拉里有效执行这种LoadStore重新排序,即使有一个# LoadLoad或# StoreStore加载和存储之间的屏障。然而,在一个真正的CPU,指令通常作为# LoadStore屏障作为至少其他两个障碍类型之一。


### #StoreLoad

# # # # StoreLoad


A StoreLoad barrier ensures that all stores performed before the barrier are visible to other processors, and that all loads performed after the barrier receive the latest value that is visible at the time of the barrier. In other words, it effectively prevents reordering of all stores before the barrier against all loads after the barrier, respecting the way a sequentially consistent multiprocessor would perform those operations.

StoreLoad屏障确保所有商店之前执行其他处理器的障碍是可见的,障碍后,所有加载执行接收最新的价值,可见时的障碍。换句话说,prevents根源的reordering of all遮阳窗帘墙against all受理、报告员after the way a sequentially包括其他multiprocessor元。而使之配套


#StoreLoad is unique. It’s the only type of memory barrier that will prevent the result r1 = r2 = 0 in the example given in Memory Reordering Caught in the Act; the same example I’ve repeated earlier in this post.

# StoreLoad是独一无二的.这是唯一类型的内存屏障,防止结果r1 = r2 = 0的例子在内存中重新排序在行为;同样的例子我重申稍早在这篇文章中。


If you’ve been following closely, you might wonder: How is #StoreLoad different from a #StoreStore followed by a #LoadLoad? After all, a #StoreStore pushes changes to the central repository, while #LoadLoad pulls remote changes back. However, those two barrier types are insufficient. Remember, the push operation may be delayed for an arbitrary number of instructions, and the pull operation might not pull from the head revision. This hints at why the PowerPC’s lwsync instruction – which acts as all three #LoadLoad, #LoadStore and #StoreStore memory barriers, but not #StoreLoad – is insufficient to prevent r1 = r2 = 0 in that example.

如果你一直密切关注,您可能想知道:# StoreLoad如何不同于# StoreStore后跟一个# LoadLoad吗?毕竟,# StoreStore推动改变中央存储库,虽然# LoadLoad拉远程更改。然而,这两个障碍类型是不够的。记住,推动操作为任意数量的指令可能会被推迟,不可能吸引和运作吸引from the head订正。at This hints why the PowerPC的lwsync as all,特地号——3 # # # # # # # # # # # # LoadLoad,LoadStore和StoreStore memory障碍,但不是# StoreLoad -不足以防止r1 = r2 = 0的例子。


In terms of the analogy, a #StoreLoad barrier could be achieved by pushing all local changes to the central repostitory, waiting for that operation to complete, then pulling the absolute latest head revision of the repository. On most processors, instructions that act as a #StoreLoad barrier tend to be more expensive than instructions acting as the other barrier types.

的类比,# StoreLoad障碍可以通过将所有本地更改中央repostitory等待操作完成,然后把绝对最新修订的存储库。在大多数的处理器,指令作为# StoreLoad障碍往往更昂贵的比其他指令充当障碍类型。


![](09_storeload.png)




If we throw a #LoadStore barrier into that operation, which shouldn’t be a big deal, then what we get is a full memory fence – acting as all four barrier types at once. As Doug Lea also points out, it just so happens that on all current processors, every instruction which acts as a #StoreLoad barrier also acts as a full memory fence.

如果我们把# LoadStore屏障扔进操作,然后不应该是一个大问题,我们得到的是一个完整的记忆栅栏,充当所有四个障碍类型。Doug Lea还指出,碰巧在所有当前的处理器,每个指令充当# StoreLoad栅栏屏障也作为一个完整的记忆。


## How Far Does This Analogy Get You?

# #这个类比让你多远?


As I’ve mentioned previously, every processor has different habits when it comes to memory ordering. The x86/64 family, in particular, has a strong memory model; it’s known to keep memory reordering to a minimum. PowerPC and ARM have weaker memory models, and the Alpha is famous for being in a league of its own. Fortunately, the analogy presented in this post corresponds to a weak memory model. If you can wrap your head around it, and enforce correct memory ordering using the fence instructions given here, you should be able to handle most CPUs.

正如我前面所提到的,每个处理器都有不同的习惯时,内存排序。尤其是x86/64家族,拥有强大的内存模型,将记忆重新排序最低。PowerPC和手臂有较弱的内存模型,和α而闻名的联盟。幸运的是,在这篇文章中给出的类比对应于一个弱内存模型。如果你能充实你的大脑,并执行正确的内存排序使用栅栏指示,你应该能够处理大多数cpu。


The analogy also corresponds pretty well to the abstract machine targeted by both C++11 (formerly known as C++0x) and C11. Therefore, if you write lock-free code using the standard library of those languages while keeping the above analogy in mind, it’s more likely to function correctly on any platform.

这个类比也很好对应的抽象机器都c++ 11(原名c++ 0 x)和C11。因此,如果你写锁定代码使用这些语言的标准库,同时保持上述类比,更有可能在任何平台功能正确。


In this analogy, I’ve said that each programmer represents a single thread of execution running on a separate core. On a real operating system, threads tend to move between different cores over the course of their lifetime, but the analogy still works. I’ve also alternated between examples in machine language and examples written in C/C++. Obviously, we’d prefer to stick with C/C++, or another high-level language; this is possible because again, any operation which acts as a memory barrier also prevents compiler reordering.

在这个比喻中,我表示,每个程序员代表单个执行线程运行在一个单独的核心。在一个真正的操作系统,线程在不同核之间倾向于移动的一生,但类比仍然有效。我也时而例子在机器语言和用C / c++编写的示例.显然,我们宁愿坚持C / c++,或另一种高级语言,这是可能的因为,任何操作也充当一个内存屏障阻止编译器重新排序。


I haven’t written about every type of memory barrier yet. For instance, there are also data dependency barriers. I’ll describe those further in a future post. Still, the four types given here are the big ones.

我还没有写过任何类型的记忆障碍。例如,也有数据依赖关系的障碍。我将描述这些在以后的帖子中进一步。仍然,这里给出的四种类型是大的。


If you’re interested in how CPUs work under the hood – things like stores buffers, cache coherency protocols and other hardware implementation details – and why they perform memory reordering in the first place, I’d recommend the fine work of Paul McKenney & David Howells. Indeed, I suspect most programmers who have successfully written lock-free code have at least a passing familiarity with such hardware details.


如果你感兴趣如何cpu工作在幕后,比如存储缓冲区,缓存一致性协议和其他硬件的实现细节,为什么他们执行内存重新排序首先,我推荐的精品保罗·麦肯尼&大卫·豪厄尔斯。事实上,我怀疑大多数程序员已经成功锁定代码写至少一个路过熟悉这样的硬件细节。









欢迎加入: [CNC开源组件交流群 316630025](http://jq.qq.com/?_wv=1027&k=Z4v6kn)


原文链接: [http://preshing.com/20120710/memory-barriers-are-like-source-control-operations/](http://preshing.com/20120710/memory-barriers-are-like-source-control-operations/)


原文日期: 2012年07月10日


翻译日期: 2016年03月05日


翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
