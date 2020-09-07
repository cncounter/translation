# Embedded Rules of Thumb

# 系统设计最佳实践

[TOC]

You may call them guidelines, heuristics, or rules of thumb. No matter, the purpose is the same: to provide a reasonable approximation of the truth. These rules of thumb can help guide your understanding of the systems you work on, focus you toward the right solutions, and highlight potential problem areas.

These are just the initial rules of thumb that I’ve collected over the past year. If you have any other useful rules or heuristics, please [send me an email](https://embeddedartistry.com/contact) or leave a comment below.

Additional links to other rules of thumb are included in the [Further Reading](https://embeddedartistry.com/blog/2018/04/26/embedded-rules-of-thumb/#furtherreading) section.

本文要介绍的内容，可称之为设计准则，避坑指南，或者最佳实践。
不管怎么命名，这些内容的目的都是要尽最大可能地探索真理。
这些是作者在去年初步收集整理的经验法则, 通过这些汇总的实践经验，可以帮助理解我们所使用的系统，把精力放在正确的解决方案上，并突显出潜在的问题。

更多避坑指南，请参考文末的 [相关链接](#furtherreading) 部分。

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

## 一般原则

- 让系统跑起来并不难，但挖坑之后再去填就不容易了。[by: James Grenning]
- 错误暴露的时机，尽可能保持在编译期，而不要到运行时
- 没有文档的程序简直就是垃圾
- 无意义的注释，只在简单地重复代码直观表达的信息。
- 注释信息，应该是描述意图，以方便后期维护。
- 保证头文件中的每个声明，（预期）至少被两个以上的源文件使用
- 通过消除分心和干扰，可以显著提高开发人员的生产力
  * “如果在小隔间办公的程序员工作效率不高。请检查他们如何管理中断。” [by: Jack Ganssle]
- “复杂度会指数级增长；罗伯特·格拉斯（Robert Glass）认为，问题难度每增加25％，代码行数就会翻倍。 上百万行的代码，则会有无数状态，这种规模是任何人类无法掌控的。”  [by: Jack Ganssle]
- 自然界中的最佳状态，几乎总是处于中间位置。 不信任断言最优是在极端点。 （阿金定律）
- 历史教训非常适合用来审查当前状况。但是，太多的现实会注定原本不值得的设计失败 （阿金定律）
- 根据经验，预防缺陷所花费的每一个小时，都能够节省修复BUG时的3到10个小时。 ([Steve McConnell](https://stevemcconnell.com/articles/software-quality-at-top-speed/))

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

- 复杂系统都是由能跑起来的简单系统演变而来（by John Gall）
  * “你会发现一个简单而有趣的事实: 能有效运行的复杂系统, 都是从一个能运行的简单系统演变而来。 与此相反的命题似乎也是对的：一开始就设计得太过复杂的系统永远也跑不起来，谁也无法让他运转。 我们必须从设计一个简单却能运行的系统开始。” (John Gall)
- 如果不能用简单的语言来描述其行为，也就无法转换为代码来表述
- 将复杂问题拆解成较小的子问题
  * 如果一个问题可以分解为两个或多个能独立解决的问题，则可以先独立解决！
  * 方案实现并通过测试后，将各部分组装为一个更大的操作。
- 一个方法只做一件事
- 不要去解决那些不存在的问题
- 去解决特定问题，而不要纠结一般情况
- 宇宙飞船的正确设计需要无限的努力。这就是为什么最好将它们设计为在出现某些问题时依然可以运行的原因。 （阿金法则）
- 设计是一项反复迭代的过程。 永远需要比当前完成的迭代多1次。 在任何时间点都是如此。 （阿金法则）
- 从来没有一个正确的解决方案。 总是会有很多错误的地方。 （阿金法则）
- （爱迪生定律）“更好” 是 “良好” 的敌人。 （阿金法则）
- （Shea定律）改进设计的能力主要发生在表面。这也是将其拧紧的主要位置。 （阿金法则）
- 研究发现，因缺陷导致的返工需求，设计和编码通常会消耗软件开发总成本的40％到50％。 ([Steve McConnell](https://stevemcconnell.com/articles/software-quality-at-top-speed/), 引用Capers Jones的话)
  * 在最坏的情况下，软件投入运行之后，再处理软件需求问题的成本，通常是需求阶段重新处理的50到200倍。 （[Steve McConnell]（https://stevemcconnell.com/articles/software-quality-at-top-speed/），引用Boehm和Papaccio的话）

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

- 软件开发是一件昂贵的事情
  * “大量研究表明，在未记录的混乱情况下，商业软件中每行代码的价格为15至30美元。 糟糕的1000行代码，其实际成本可能约为30,000美元，而且很难在1000行中完成很多工作。 “这只是一个小小的需求变更” 相当于 “这需要一块金砖的开销”。 （杰克·甘斯勒）
  * “每行代码的价格约为15至40美元。 每行代码的成本在40美元时，可以获得相对健壮，设计良好的代码，适合于行业应用。 15美元一行的成本往往只能换来简单的设计和测试。 换句话说，有些人写一行代码的成本只需要15美元，但他们的代码质量令人怀疑。”（Phil Koopman）
  * “【2015年10月更新】。 如今每行代码的成本大约是 $25-$50 的样子。 外包给亚洲的项目成本已经大大增加，因为工资和招聘程序员的竞争都加剧了。” （菲尔·考夫曼）
- 如果想压缩软件开发的成本，直接从需求文档中删除某些功能即可。 （杰克·甘斯勒）
  * 功能过多，等价于进度缓慢+庞大的开发成本（Jack Ganssle）
- 非经常性工程（NRE，Non-recurring engineering）的费用必须分摊到所售出的每类产品中
  * 通过减少功能节省NRE开支
  * 通过将软件功能转移到硬件组件中来节省NRE开支（当然这会增加BOM成本）
    - 仅在硬件已经存在的情况下才有用！
    - 应在系统设计的早期就评估软件/硬件的功能边界
  * 通过更快交付产品来节省NRE开销（Jack Ganssle）
- 那有问题的5％的函数，完全重写比修复现有的实现要更简单，也更便宜
  * 这些函数的开销是其他代码的四倍（Barry Boehm）
  * “也许我们真的对某些初次编写的代码不满意，但如果能够识别出这些糟糕的部分，将其丢弃，然后重新开始，那么我们将节省很多钱。” （杰克·甘斯勒）

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

## Software Reuse

- Prefer to use existing, reviewed code that has already been re-used by others
  * e.g. use the [STL](https://embeddedartistry.com/fieldmanual-terms/standard-template-library/) instead of writing your own containers
- Prefer simple, standard communication protocols over custom communication protocols
- Follow the “Rule of Three”: you are allowed to copy and paste the code once, but that when the same code is replicated three times, it should be extracted into a new procedure (Martin Fowler)
- Before a package is truly reusable, it must have been reused at least three times (Jack Ganssle)
  * “We’re not smart enough to truly understand the range of applications where a chunk of software may be used. Every domain requires its own unique features and tweaks; till we’ve actually used the code several times, over a wide enough range of apps, we won’t have generalized it enough to have it truly reusable.” (Jack Ganssle)
- Reuse works best when done in large sections of code – think about reusing entire drivers or libraries, not functions (Jack Ganssle)

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

## Humorous

- If anyone says you are to work with an acoustic modem, ask them if it will be located in another building. Refuse unless the answer is yes. (Elecia White)

<a name="furtherreading"></a>

## Further Reading

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
