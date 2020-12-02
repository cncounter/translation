# Embedded Rules of Thumb

# 系统设计原则与最佳实践

[TOC]

You may call them guidelines, heuristics, or rules of thumb. No matter, the purpose is the same: to provide a reasonable approximation of the truth. These rules of thumb can help guide your understanding of the systems you work on, focus you toward the right solutions, and highlight potential problem areas.

These are just the initial rules of thumb that I’ve collected over the past year. If you have any other useful rules or heuristics, please [send me an email](https://embeddedartistry.com/contact) or leave a comment below.

Additional links to other rules of thumb are included in the [Further Reading](https://embeddedartistry.com/blog/2018/04/26/embedded-rules-of-thumb/#furtherreading) section.

我们可以称之为系统设计原则，避坑指南，或者最佳实践。不管叫什么，目的都是为了尽可能地探索世间的真理。 帮助我们理解当前的系统，凸显潜在的问题，并把精力用到正确的解决方案上。

下面是这几年收集整理的最佳实践汇总, 你也可以联系作者: [https://embeddedartistry.com/contact](https://embeddedartistry.com/contact)

更多信息，请参考文末的 [相关链接](#furtherreading) 部分。

## General

- It’s easier to keep a system working than to fix it after you break it. (James Grenning)
- Move errors from run-time to compile time whenever possible
- Programs without documentation have no value
- Comments should never restate what the code *obviously* does.
- Comments should aid maintenance by describing intention.
- Everything in a header file should be used in at least two source files
- Developer productivity is dramatically increased by eliminating distractions and interrupts
  - “Developers who live in cubicles probably aren’t very productive. Check how they manage interruptions.” (Jack Ganssle)
- “Complexity grows exponentially; Robert Glass figures for every 25% increase in the problem’s difficulty the code doubles in size. A many-million line program can assume a number of states whose size no human can grasp.” (Jack Ganssle)
- In nature, the optimum is almost always in the middle somewhere. Distrust assertions that the optimum is at an extreme point. (Akin’s Laws)
- Past experience is excellent for providing a reality check. Too much reality can doom an otherwise worthwhile design, though (Akin’s Laws)
- As a rule of thumb, every hour you spend on defect prevention will reduce your repair time from three to ten hours. ([Steve McConnell](https://stevemcconnell.com/articles/software-quality-at-top-speed/))

## 通用经验法则

- 让系统跑起来并不难，但崩溃之后再去修正就不容易了。[by: James Grenning]
- 尽可能将错误暴露在编译期，而不要等到运行时。
- 没有文档的程序不能称之为软件，简直就是一坨垃圾。
- 机械地复述代码的含义, 这种注释毫无意义。
- 注释信息应该是在描述意图，这样才有利于后期维护。
- 头文件中的声明，应该被至少两个以上的源文件所使用。
- 消除分心和干扰，可以显著提高码农们的开发效率。
  * “在小办公室的码农工作效率不一定就高。还要看他们如何处理干扰。” [by: Jack Ganssle]
- “软件的复杂度，会随规模的扩大，呈指数级增长；罗伯特·格拉斯(Robert Glass)指出，问题难度每增加25％，代码行数就要翻倍。 上百万行代码，会有无数种状态，这种规模是谁都无法掌控的。”  [by: Jack Ganssle]
- 世界上的最优解, 总是很自然地出现在中间的平衡位置。 不要相信最好答案出现在极端位置的那些论断。 (阿金定律)
- 曾经的经验教训很适合用来审查当前状况。 但约束太多则会让有价值的设计偏离方向 (阿金定律)
- 根据经验，在防御缺陷方面消耗的每一分每一秒，都能节省3到10倍修复BUG所需的功夫。 ([Steve McConnell](https://stevemcconnell.com/articles/software-quality-at-top-speed/))

## Design

- Complex systems evolve out of simple systems that worked (John Gall)
  - “A complex system that works is invariably found to have evolved from a simple system that worked. The inverse proposition also appears to be true: A complex system designed from scratch never works and cannot be made to work. You have to start over, beginning with a working simple system.” (John Gall)
- If you can’t describe the behavior in plain English, you can’t successfully describe it with code
- Decompose complex problems into smaller sub-problems
  - If a problem can be decomposed into two or more independently solvable problems, then solve them independently first!
  - After you have implemented and tested the solutions, combine the parts into a larger operation
- A function should perform only one conceptual task
- Don’t solve problems that don’t exist
- Solve the specific problem, not the general case
- To design a spacecraft right takes an infinite amount of effort. This is why it’s a good idea to design them to operate when some things are wrong. (Akin’s Laws)
- Design is an iterative process. The necessary number of iterations is one more than the number you have currently done. This is true at any point in time. (Akin’s Laws)
- There is never a single right solution. There are always multiple wrong ones, though. (Akin’s Laws)
- (Edison’s Law) “Better” is the enemy of “good”. (Akin’s Laws)
- (Shea’s Law) The ability to improve a design occurs primarily at the interfaces. This is also the prime location for screwing it up. (Akin’s Laws)
- Studies have found that reworking defective requirements, design, and code typically consumes 40 to 50 percent of the total cost of software development. (Steve McConnell, citing Capers Jones)
  - In the worst case, reworking a software requirements problem once the software is in operation typically costs 50 to 200 times what it would take to rework the problem in the requirements stage. ([Steve McConnell](https://stevemcconnell.com/articles/software-quality-at-top-speed/), citing Boehm and Papaccio)

## 设计原则

- 复杂系统都是由能跑起来的简单系统演变而来(by John Gall)
  * “你会发现一个简单而有趣的事实: 能有效运行的复杂系统, 都是从一个能运行的简单系统演变而来。 与此相反的命题似乎也是对的：一来就设计得高大上的复杂系统总是会难产，这种事情谁也阻止不了。 我们必须从设计一个简单却能运行的系统开始。” (John Gall)
- 如果不能用简单的语言来描述其行为，也就无法转换为代码来表述
- 将复杂问题拆解成较小的子问题
  * 如果一个问题可以分解为两个或多个能独立解决的问题，则可以先独立解决！
  * 方案实现并通过测试后，将各部分组装为一个更大的操作。
- 一个方法只做一件事
- 不要去解决那些不存在的问题
- 去解决特定问题，而不要纠结一般情况
- 宇宙飞船的正确设计需要无限的努力。这就是为什么最好将它们设计为在出现某些问题时依然可以运行的原因。 (阿金守则)
- 设计是一项反复迭代的过程。 永远需要比当前完成的迭代多1次。 在任何时间点都是如此。 (阿金守则)
- 从来没有一个正确的解决方案。 总是会有很多错误的地方。 (阿金守则)
- (爱迪生定律)“更好” 是 “良好” 的敌人。 (阿金守则)
- (Shea定律)改进设计的能力主要发生在表面。这也是将其拧紧的主要位置。 (阿金守则)
- 研究发现，因缺陷导致的返工需求，设计和编码通常会消耗软件开发总成本的40％到50％。 ([Steve McConnell](https://stevemcconnell.com/articles/software-quality-at-top-speed/), 引用Capers Jones的话)
  * 在最坏的情况下，软件投入运行之后再进行需求变更，其成本通常是需求阶段变更的50到200倍。 ([Steve McConnell](https://stevemcconnell.com/articles/software-quality-at-top-speed/)，引用Boehm和Papaccio的话)

## Cost

- Software is expensive
  * “Study after study shows that commercial code, in all of the realities of its undocumented chaos, costs $15 to $30 per line. A lousy 1000 lines of code – and it’s hard to do much in a thousand lines – has a very real cost of perhaps $30,000. The old saw ‘it’s only a software change’ is equivalent to ‘it’s only a brick of gold bullion’.” (Jack Ganssle)
  * “The answer is $15 to $40 per line of code. At the $40 end you can get relatively robust, well designed code suitable for industry applications. The $15 end tends to be code with skimpy design packages and skimpy testing. (In other words, some people spend only $15/line, but their code is of doubtful quality.)” (Phil Koopman)
  * “UPDATE, October 2015. It’s probably more like $25-$50 per line of code now. Costs for projects outsourced to Asia have done up dramatically as wages and competition for scarce coders have increased.” (Phil Koopman)
- If you want to reduce software development costs, look at every requirements document and brutally strip out features. (Jack Ganssle)
  * Lots of features equals slow progress and expensive development (Jack Ganssle)
- Non-recurring engineering(NRE) costs must be amortized over every product sold
  * Save NRE dollars by reducing features
  * Save NRE dollars by offloading software functionality into hardware components (increases BOM cost)
    - Only useful if that hardware already exists!
    - Software/hardware partitioning should be assessed early in the design process
  * Save NRE dollars by delivering the product faster (Jack Ganssle)
- It is easier and cheaper to completely rewrite the 5% of problematic functions than to fix the existing implementation
  * These functions cost four times as much as other functions (Barry Boehm)
  * “Perhaps we really blew it when first writing the code, but if we can identify these crummy routines, toss them out, and start over, we’ll save big bucks.” (Jack Ganssle)

## 费用开销

- 开发软件是一件成本开销非常大的事情
  * “大量研究表明，虽然没有完全统计，商业软件中每行代码的成本大致为15至30美元。 有些糟糕的代码，1000行的成本可能会达到 30,000 美元， 而且也没能实现多少功能。 【一个小小的需求变更】就相当于 【又用出去了一块金砖】。 (杰克·甘斯勒)
  * “每行代码的成本约为15到40美元。 为每行代码支付的成本在40美元时，可以获得相对健壮，设计良好的代码，适合于行业应用。 而每行代码15美元的成本往往只能换来粗糙的设计和简单的测试。 换句话说，虽然有些公司一行代码的成本只要15美元，但其质量到底怎样就谁用谁知道了。”(Phil Koopman)
  * “【2015年10月更新】现在每行代码的成本一般在 $25~$50 左右。 因为外包给亚洲人开发的项目成本大幅上涨，而且程序员的工资和招聘成本还在上涨。” (菲尔·考夫曼)
- 如果想要缩减系统开发的花销，直接从需求文档砍掉一些功能即可。 (杰克·甘斯勒)
  * 功能太多，就等价于【进度缓慢+庞大的开发成本】(Jack Ganssle)
- 非经常性工程(NRE，Non-recurring engineering)的费用必须分摊到所售出的每类产品中
  * 精简功能可以节省NRE开支
  * 通过将软件功能转移到硬件组件中来节省NRE开支(当然这会增加BOM成本)
    - 仅在硬件已经存在的情况下才有用！
    - 应在系统设计的早期就评估软件/硬件的功能边界
  * 通过更快交付产品来节省NRE开销(Jack Ganssle)
- 那有问题的5％的函数，完全重写比修复现有的实现要更简单，也更便宜
  * 这些函数的开销是其他代码的四倍(Barry Boehm)
  * “也许我们真的对某些初次编写的代码不满意，但如果能够识别出这些糟糕的部分，将其丢弃，然后重新开始，那么我们将节省很多钱。” (杰克·甘斯勒)

## Scheduling

- There’s never enough time to do it right, but somehow, there’s always enough time to do it over. (Akin’s Laws)
- Estimating dates instead of hours guarantees a late project (Jack Ganssle)
  * “Scheduling disasters are inevitable when developers don’t separate calendar time from engineering hours.” (Jack Ganssle)
- “If the schedule hallucinates a people-utilization factor of much over 50% the project will be behind proportionately.” (Jack Ganssle)
  * “Some data suggests the average developer is only about 55% engaged on new product work. Other routine activities, from handling paperwork to talking about Survivor XVI, burn almost half the work week.” (Jack Ganssle)
- We often fail to anticipate the difficult areas of development
  * “Isn’t it amazing how badly we estimate schedules for most projects? 80% of embedded systems are delivered late. Most pundits figure the average project consumes twice the development effort originally budgeted.” (Jack Ganssle)
- 5% of functions consume 80% of debugging time (Jack Ganssle)
  * “I’ve observed that most projects wallow in the debug cycle, which often accounts for half of the entire schedule. Clearly, if we can do something about those few functions that represent most of our troubles, the project will get out the door that much sooner.” (Jack Ganssle)
- Timelines grow much faster than firmware size – double the lines of code, and the delivery date increases by more than 2x (Barry Boehm)
- “The first 90 percent of the code accounts for the first 90 percent of the development time. The remaining 10 percent of the code accounts for the other 90 percent of the development time.” (Tom Cargill)
- When porting old code to a new project, if more than about 25% gets modified there’s not much of a schedule boost (Richard Selby)
- Systems loaded to 90% of the processor capability require 2x development time over systems loaded at 70% or less. 95% loading triples development time. (Jack Ganssle)
  * “When only a few bytes are left, even trivial features can take weeks as developers must rewrite massive sections of code to free up memory or CPU cycles.” (Jack Ganssle)
- The schedule you develop will seem like a complete work of fiction up until the time your customer fires you for not meeting it. (Akin’s Laws)
- Sometimes, the fastest way to get to the end is to throw everything out and start over. (Akin’s Laws)
- (Patton’s Law of Program Planning) A good plan violently executed now is better than a perfect plan next week. (Akin’s Laws)

## 项目排期

- 将系统做得完美有多少时间都不够，完成功能开发倒是可以在预期时间内完成。 (阿金守则)
- 估算日期而不是小时数, 可以保证项目的及时完成(Jack Ganssle)
  * “如果开发人员不将日历时间与工时区分开，不可避免地会发生排期灾难。” (杰克·甘斯勒)
- “如果进度表中的人员利用率已经超过50％，则该项目将成比例落后。” (杰克·甘斯勒)
  * “一些数据表明，平均每个开发人员只有55％的时间用于新项目的研发工作。 其他日常活动，从处理文档工作，以及谈论 Survivor XVI，几乎会占用一半的工作时间。” (杰克·甘斯勒)
- 我们常常无法预见开发中的困难领域
  * “大部分的项目排期有多糟糕，你们心里有点B树吗？ 80％的系统交付都会延期。 大多数专家认为，项目开发工作平均花费的时间是最初预算的两倍。” (杰克·甘斯勒)
- 有5％的功能会占用80％的调试时间(Jack Ganssle)
  * “我观察到，大部分项目都耗在了调试期间，通常占整个排期的一半时间。 显然，如果能够将造成困扰的少数几个功能单独做处理，那么项目就会及早完工。” (杰克·甘斯勒)
- 时间线的增长速度远远超过项目规模的增加 - 代码行数增加一倍，则交付周期会增加两倍以上(Barry Boehm)
- “行百里者半九十: 前面90％的代码会占用90％的开发时间。 剩下10％的代码也会占用90％的开发时间。” (汤姆·嘉吉)
- 将旧代码移植到新项目时，如果修改超过25％，那么进度排期就不会增加(Richard Selby)
- 【嵌入式系统】如果CPU负载达到了90％，那么所需的开发时间，至少是70％负载时的两倍。 如果系统负载达到95％，则开发时间至少要增加三倍。 (杰克·甘斯勒)
  * “内存快要耗尽时，即使增加一个小小的功能也需要数周时间，因为开发人员必须重写大量代码来释放内存或降低CPU消耗。” (杰克·甘斯勒)
- 您制定的排期表看起来就像是一件虚构的完美作品，直到客户因不不满意而解雇您为止。 (阿金守则)
- 有时候，最快抵达终点的方法，是丢掉所有包袱并重新开始。 (阿金守则)
-【帕顿的计划规划法】现在暴力执行一个良好的计划，胜过下周再执行一个完美的计划。 (阿金守则)

## Hardware

- Adding hardware increases power requirements
- Use of hardware accelerators to offload CPU-based algorithms can reduce power requirements
- Every sensor is a temperature sensor. Some sensors measure other things as well. (Elecia White)
- Break out nasty real-time hardware functions into independent CPUs (Jack Ganssle)
  * Handling 1000 interrupts per second from a device? Partition it to its own controller and offload all of the ISR overhead off of the main processor
- Add hardware whenever it can simplify the software (Jack Ganssle)
  * This will dramatically reduce NRE and software development costs, at a tradeoff for an increase in BOM costs.
  * Systems loaded to 90% of the processor capability require 2x development time over systems loaded at 70% or less. 95% loading triples development time. Add additional hardware to reduce loading. (Jack Ganssle)
- (Atkin’s Law of Demonstrations) When the hardware is working perfectly, the really important visitors don’t show up. (Akin’s Laws)

## 硬件设计

- 增加硬件的同时也会增加功耗
- 使用硬件加速器来替代基于CPU的算法可以降低功耗
- 每个传感器都是温度传感器。某些传感器也可以测量其他东西。 (埃莉西亚·怀特)
- 将讨厌的硬件实时处理功能拆解到独立的CPU上(Jack Ganssle)
  * 这个设备每秒会有1000次中断？快拆分到它自己的控制器上，让主处理器不用负担它的ISR开销
- 只要可以简化软件，那就添加硬件(Jack Ganssle)
  * 这将显著降低NRE和软件开发成本，但也需要权衡BOM成本的增加。
  * 在处理器负载达到90％的系统上，开发功能所需的时间是70％系统负载的两倍。 而在95％的系统负载上开发功能的时间则会扩大三倍。 添加其他硬件来减少CPU开销。 (杰克·甘斯勒)
- (阿特金演示法则)在硬件运行正常时，真正重要的访客不会出现。 (阿金法则)

## Software Reuse

- Prefer to use existing, reviewed code that has already been re-used by others
  * e.g. use the [STL](https://embeddedartistry.com/fieldmanual-terms/standard-template-library/) instead of writing your own containers
- Prefer simple, standard communication protocols over custom communication protocols
- Follow the “Rule of Three”: you are allowed to copy and paste the code once, but that when the same code is replicated three times, it should be extracted into a new procedure (Martin Fowler)
- Before a package is truly reusable, it must have been reused at least three times (Jack Ganssle)
  * “We’re not smart enough to truly understand the range of applications where a chunk of software may be used. Every domain requires its own unique features and tweaks; till we’ve actually used the code several times, over a wide enough range of apps, we won’t have generalized it enough to have it truly reusable.” (Jack Ganssle)
- Reuse works best when done in large sections of code – think about reusing entire drivers or libraries, not functions (Jack Ganssle)

## 软件重用原则

- 优先使用已存在的，经过审查的代码。
  * 例如，使用 [STL](https://embeddedartistry.com/fieldmanual-terms/standard-template-library/) 而不要自己造一个容器
- 使用简单的标准通信协议，不要再去造轮子搞个自定义协议。
- 遵循 “三次原则”: 你可以拷贝粘贴一次代码，但同一份代码被复制三次时，应将其提取到新的函数中(Martin Fowler)
- 在一个软件包真正可重用之前，至少应该已被重用三次(Jack Ganssle)
  * “我们的大脑有极限，无法真正理解大量软件可能的使用范围。 而每个领域都需要自己独特的功能和优化； 只有在足够广泛的应用程序中实际使用过多次之后，我们才能对代码进行泛化，使其真正地可重用。” (杰克·甘斯勒)
- 重用在处理大部分代码时效果最好 – 想一想重用整个驱动程序或库，而不只是功能(Jack Ganssle)

## Optimization

- Premature optimization is a waste of time
  * “More computing sins are committed in the name of efficiency (without necessarily achieving it) than for any other single reason — including blind stupidity.” (W.A. Wulf)
  * “The First Rule of Program Optimization: Don’t do it. The Second Rule of Program Optimization (for experts only!): Don’t do it yet.” (Michael A. Jackson)
- Only optimize code after you have profiled it to identify the problem area
  * “Bottlenecks occur in surprising places, so don’t try to second guess and put in a speed hack until you have proven that’s where the bottleneck is.” (Rob Pike)
  * “We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil. Yet we should not pass up our opportunities in that critical 3%. A good programmer will not be lulled into complacency by such reasoning, he will be wise to look carefully at the critical code; but only after that code has been identified” (Donald Knuth)
- The Pareto principle can be applied to resource optimization: 80% of resources are used by 20% of operations
  * Alternatively, there is the 90/10 law in software engineering: 90% of the execution time of a program is spent executing 10% of the code
- Algorithmic optimizations have a greater impact than micro optimizations
  * “Real efficiency gains come from changing the order of complexity of the algorithm, such as changing from O(N2) to O(NlogN) complexity”
- Never sacrifice clarity for perceived efficiency, especially when the efficiency improvement has not been proven with data

## 性能优化

- 盲目优化纯粹是浪费时间
  * “以性能优化为名犯下的罪, 比任何其他原因导致的都要多. 很多性能优化是没有必要的, 而且是盲目和愚蠢的” (沃尔夫·沃夫)
  * “性能优化第一原则：没必要优化。 性能优化第二原则：还是不需要优化(听专家的意见)。” (Michael A. Jackson)
- 只有在对代码进行性能分析并诊断出问题领域之后才对其进行优化
  * “瓶颈总是在出乎意料的地方出现，因此在验证性能瓶颈之前，不要靠猜测进行盲目的更改。” (罗伯·派克)
  * “我们应该把性能低下的问题忘了，大约97％的时候是这样： 过早优化是万恶之源。 但是呢，我们也不能放弃那3％的关键部分。 一个好的程序员不会因这种推理而沾沾自喜，他应该明智地仔细审查关键代码。当然他需要先识别出哪些是关键代码”(Donald Knuth)
- 可将帕累托原理(Pareto principle)应用于资源优化：80％的资源由20％的操作使用。
  * 类似的也有，软件工程中的 `90/10法则`：90％的程序执行时间消耗在10％的代码执行上。
- 算法优化比底层优化的影响更大
  * “真正的性能提升来自于算法的复杂度改进，例如从 `O(N^2)` 提升为  `O(NlogN)`”
- 切勿为了提升性能而牺牲代码的可读性，尤其是在没有证据可表明性能提升的情况下

## Red Flags and Problem Areas

- When developers are afraid to change a function, it’s time to rewrite that code from scratch (Jack Ganssle)
- Duplicate code is an indication of poor design or poor programming habits. It must be eliminated.
  * “Duplication is a bad practice because it makes code harder to maintain. When the rule encoded in a replicated piece of code changes, whoever maintains the code will have to change it in all places correctly. This process is error-prone and often leads to problems. If the code exists in only one place, then it can be easily changed there.” (Jack Ganssle)
  * “This rule is can even be applied to small number of lines of code, or even single lines of code. For example, if you want to call a function, and then call it again when it fails, it’s OK to have two call sites; however, if you want to try it five times before giving up, there should only be one call site inside a loop rather than 5 independent calls.” (Jack Ganssle)
- Avoid shared resources wherever possible (Jack Ganssle)
- Eliminate globals!
- Disabling interrupts tends to be A Bad Thing (Jack Ganssle)
  * Even in the best of cases it’ll increase system latency and probably decrease performance
  * Increased latency leads to missed interrupts and mismanaged devices
- Be wary of solo Enable Interrupt (EI) commands (Jack Ganssle)
  * “An EI located outside an interrupt service routine (ISR) often suggests peril – with the exception of the initial EI in the startup code.” (Jack Ganssle)
  * “When the enable is not part of a DI/EI pair (and these two instructions must be very close to each other to keep latency down and maintainability up) then the code is likely a convoluted, cryptic well; plumbing these depths will age the most eager of developers.” (Jack Ganssle)
- Be wary when code is peppered with DI/EI Pairs (Jack Ganssle)
  * Excessive use of Disable Interrupt instructions suggests poor design
  * “But these DI/EI pairs slip into code in great numbers when there’s a systemic design problem that yields lots of critical regions susceptible to reentrancy problems. You know how it is: chasing a bug the intrepid developer uncovers a variable trashed by context switching. Pop in quick DI/EI pair. Then there’s another. And another. It’s like a heroin user taking his last hit. It never ends.” (Jack Ganssle)

## 标红和问题区域

- 开发人员害怕修改某个函数时，就应该从头开始重写这部分代码了（Jack Ganssle）
- 重复代码意味着拙劣的设计或者不好的编程习惯。必须消除它。
  * “复制代码是种不好的做法，会让代码难以维护。 在问题修正或者业务处理逻辑变更时，维护代码的人员必须在修改相应的所有位置。 这个过程容易出错，而且经常造成BUG。 如果只有一处代码，则可以很方便地进行修改和维护。” （杰克·甘斯勒）
  * “此规则甚至可以应用于少量的代码行，甚至是单个代码行。 例如，如果想要调用一个函数，如果失败则再次调用，则可以有两个调用点； 但是，但如果我们想要在放弃之前重试5次，则循环内只应该有一个调用点，而不是写5次调用。” （杰克·甘斯勒）
- 尽可能避免共享资源（Jack Ganssle）
- 消除全局变量！
- 禁用中断往往是一件坏事（Jack Ganssle）
  * 即使在最好的情况下，也会增加系统延迟，并可能降低性能
  * 延迟增加导致丢失中断和设备管理不当
- 警惕单独启用中断（EI）命令（Jack Ganssle）
  * “位于中断服务程序（ISR）外部的EI通常会带来危险-启动代码中的初始EI除外。” （杰克·甘斯勒）
  * “当使能不是DI / EI对的一部分（并且这两个指令必须彼此非常接近以保持等待时间缩短和可维护性提高）时，代码很可能是令人费解的，隐秘的；深入这些深度将使最渴望开发的人老化。” （杰克·甘斯勒）
- 使用DI / EI对添加代码时要小心（Jack Ganssle）
  * 过多使用“禁用中断”指令表明设计较差
  * “但是，当存在系统性设计问题时，这些DI / EI对会大量插入代码中，从而产生许多容易出现折返问题的关键区域。您知道这是怎么回事：勇敢的开发人员追逐错误，发现上下文切换破坏了变量。弹出快速DI / EI对。然后还有另一个。还有一个。就像是海洛因使用者遭受了最后一击。它永远不会结束。” （杰克·甘斯勒）

## Interrupts

- Leave interrupts on, for all but the briefest times and in the most compelling of needs. (Jack Ganssle)
- If you disable interrupts in a block of code, re-enable them in the same block (Jack Ganssle)
- Keep ISRs small
  * Be wary of ISRs longer than half a page of code (Jack Ganssle)
  * In most cases, there should be little-to-no processing inside of the handler (Phillip Johnston)
  * Set a flag, add a value to a queue, and then rely on user-space code to handle more complex tasks
- Minimize ISR latency to ensure the system does not miss interrupts (Jack Ganssle)
- Check the design of any ISR that reenables interrupts immediately before returning (Jack Ganssle)
  * Minimize critical sections within the ISR.
  * “It’s perfectly fine to allow another device to interrupt an ISR! or even to allow the same interrupt to do so, given enough stack space. That suggests we should create service routines that do all of the non-reentrant stuff (like servicing hardware) early, issue the EI, and continue with the reentrant activities. Then pop registers and return.” (Jack Ganssle)

Avoid the following operations within interrupt handlers: (Phillip Johnston)

- Don’t declare any non-static variables inside the handler
- Avoid blocking function calls
- Avoid non-reentrant function calls
- Avoid any processing that takes non-trivial time
- Avoid operations with locks as you can deadlock your program in an ISR
- Avoid operations that involve dynamic memory allocations, as the allocation may require a lock and will take a non-determinate amount of time
- Avoid stack allocations
  * Depending on your architecture and operational model, your interrupt handler may utilize the stack of the interrupted thread or a common “interrupt stack”.

## 硬件中断

- 在最短的时间内和最迫切的需求中，保持中断。 （杰克·甘斯勒）
- 如果您在某个代码块中禁用了中断，请在同一块代码中重新启用它们（Jack Ganssle）
- 保持较小的ISR
  * 警惕ISR长度超过一半的代码（Jack Ganssle）
  * 在大多数情况下，处理程序内部基本上都没有处理（Phillip Johnston）
  * 设置一个标志，向队列添加一个值，然后依靠用户空间代码来处理更复杂的任务
- 最小化ISR延迟，以确保系统不会错过中断（Jack Ganssle）
- 在返回之前立即检查所有重新启用中断的ISR设计（杰克·甘斯尔）
  * 最小化ISR中的关键部分。
  * “允许另一台设备中断ISR很好！给定足够的堆栈空间，甚至允许相同的中断执行此操作。这表明我们应该创建服务例程，该例程应尽早处理所有非可重入任务（例如，维修硬件），发布EI，然后继续可重入活动。然后弹出寄存器并返回。” （杰克·甘斯勒）

避免在中断处理程序中进行以下操作：（Phillip Johnston）

- 不要在处理程序中声明任何非静态变量
- 避免调用阻塞函数
- 避免调用非重入函数
- 避免进行任何长时间的处理
- 避免使用锁进行操作，因为这样会使ISR中的程序死锁
- 避免涉及动态内存分配的操作，因为分配可能需要锁定，并且将花费不确定的时间
- 避免调用栈分配
  * 根据您的体系结构和操作模型，您的中断处理程序可能会使用被中断线程的调用栈或常见的“中断栈”。

## Function Point Rules of Thumb

A function point is the measure of functionality of a part of a software, which [you can read about here](https://www.ifpug.org/content/documents/Jones-OriginsOfFunctionPointMetrics.pdf). One [C](https://embeddedartistry.com/fieldmanual-terms/c/) function point is about 130 lines of code, on average.

Here are Capers’s rules of thumb, where “FP” means function points. These were extracted from Jack Ganssle’s newsletter.

- Approximate number of bugs injected in a project: FP^1.25
  * Manual code inspections will find about 65% of the bugs. The number is much higher for very disciplined teams.
- Number of people on the project is about: FP/150
- Approximate page count for paper documents associated with a project: FP^1.15
- Each test strategy will find about 30% of the bugs that exist.
- The schedule in months is about: FP^0.4
- Full time number of people required to maintain a project after release: FP/750
- Requirements grow about 2%/month from the design through coding phases.
- Rough number of test cases that will be created: FP^1.2

## 功能点经验法则

功能点是软件功能的一种度量方式，有关信息请参考: [OriginsOfFunctionPointMetrics.pdf](https://www.ifpug.org/content/documents/Jones-OriginsOfFunctionPointMetrics.pdf),  平均一个 [C级功能点](https://embeddedartistry.com/fieldmanual-terms/c/) 需要130行左右的代码。

下面是Capers的经验法则，“FP” 表示功能点。 摘录自 Jack Ganssle’s newsletter。

- 项目中的BUG数约等于：`FP^1.25`
  * 人工代码检查将发现大约`65％`的BUG。 对于专业团队来说，这个数字还会高得多。
- 项目组的最佳成员数： `FP/150`
- 项目相关的纸质文档页数约等于：`FP^1.15`
- 每种测试策略大约可以发现`30％`的错误。
- 项目排期大约为(月为单位)：`FP^0.4`
- 项目发布后需要的后期全职维护人员大约为：`FP/750`
- 从设计到编码阶段，每月增长的需求大约为 `2%`
- 要创建的测试用例数量： `FP^1.2`

## Humorous

- If anyone says you are to work with an acoustic modem, ask them if it will be located in another building. Refuse unless the answer is yes. (Elecia White)

## 幽默

- 如果有人说有一个通信基本靠吼的声控路由器，那你需要先问清楚是否放在了其他房间。 如果不在其他房间则应该直接拒绝。 (Elecia White)

<a name="furtherreading"></a>

## Further Reading

## 相关内容

- [Akin’s Laws of Spacecraft Design](https://spacecraft.ssl.umd.edu/akins_laws.html)
- [Jack’s Rules of Thumb](http://www.ganssle.com/articles/Jacksrules.htm)
- [Origins of the Function Point Metric](https://www.ifpug.org/content/documents/Jones-OriginsOfFunctionPointMetrics.pdf)
- [Interrupt Handler Rules of Thumb](https://embeddedartistry.com/blog/2017/9/1/interrupt-handler-rules-of-thumb)
- [Choosing the Right STL Container: General Rules of Thumb](https://embeddedartistry.com/blog/2017/8/23/choosing-the-right-stl-container-general-rules-of-thumb)
- [Debugging: 9 Indispensable Rules](https://embeddedartistry.com/blog/2017/9/6/debugging-9-indispensable-rules)
- [Altera: Adding Hardware Accelerators to Reduce Power in Embedded Systems](https://www.altera.com/en_US/pdfs/literature/wp/wp-01112-hw-reduce-power.pdf)
- [Bogatin’s Rules of Thumb (For Electrical Engineers)](https://www.edn.com/collections/4435129/Bogatin-s-Rules-of-Thumb)
- [Decoupling Capacitors (and Other Power Rules of Thumb)](https://stratifylabs.co/embedded design tips/2013/10/10/Tips-Decoupling-Capacitors/)
- [Embedded System Engineering Economics](https://www.ece.cmu.edu/~ece649/lectures/12_product_economics.pdf)
- [Important Programming “Rules of Thumb”](http://www.wou.edu/las/cs/csclasses/cs161/Lectures/rulesofthumb.html)
- [Best Practices in Embedded Systems Programming](https://www.edn.com/collections/4398825/Best-practices-in-programming)
- [Embedded Software Costs $15-$40 per Line of Code](https://betterembsw.blogspot.com/2010/10/embedded-software-costs-15-40-per-line.html)
- [Embedded.fm episode 290: Rule of Thumbs](https://embedded.fm/episodes/290)
- [Steve McConnell: Software Quality at Top Speed](https://stevemcconnell.com/articles/software-quality-at-top-speed/)



- [Embedded Rules of Thumb](https://embeddedartistry.com/blog/2018/04/26/embedded-rules-of-thumb/)
