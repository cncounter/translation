# How Intel Lost the Mobile Market, Part 2: The Rise and Neglect of Atom

# 英特尔移动战略败局（二）： Atom的崛起与疏忽

![](https://www.extremetech.com/wp-content/uploads/2016/05/Intel-Silverthorne2-640x354.jpg)

Update (6/1/2020): The article below may have been written in 2016, but it still stands up as a postmortem of what went wrong with Intel’s mobile efforts — with one very important omission. Back in 2016, we didn’t know Qualcomm had been ruthlessly enforcing licensing and purchasing terms that made it effectively impossible for manufacturers to offer Intel-based mobile devices. I remember wondering why Intel couldn’t find a single US company to produce a phone around its hardware platform for love or money when the original Xolo X900 compared well enough against a then-current iPhone.

更新（2020 年 6 月 1 日）：下面这篇文章虽写于 2016 年，但作为英特尔移动业务失败的事后剖析仍然站得住脚——只不过漏掉了一个非常重要的情况。2016 年时，我们还不知道高通一直在强硬地执行授权和采购条款，使得厂商实际上无法推出基于英特尔平台的移动设备。我记得当时很纳闷：初代 Xolo X900 与当时的 iPhone 相比并不逊色，英特尔为什么无论出多少钱、托多少关系，都找不到一家美国公司基于它的硬件平台来做一款手机。

Intel still made a number of mistakes with Atom, as this article discusses, but the fact that Qualcomm had a stranglehold on the market behind the scenes obviously had an impact on what kind of success Intel was ever going to achieve.

正如本文所讨论的，英特尔在 Atom 上确实犯了不少错误，但高通在幕后扼住了整个市场，这显然也影响了英特尔本可能取得的成绩。

I genuinely liked the Xolo X900 device I tested all those years ago, and the Bay Trail tablets I had circa 2013 were great devices. Atom’s mobile efforts will always remain an enticing might-have-been.

当年我亲手测试的那台 Xolo X900，我是真心喜欢；2013 年前后我用的那些 Bay Trail 平板也是很好的设备。Atom 在移动领域的努力，将永远是一个令人向往却未能实现的“本可以”。

Original story below.

以下是原文。

In Part 1 of this two-part series, we discussed the difference between Intel and TSMC’s foundry models and how these differences made it extremely difficult for Intel to compete in mobile. In Part 2 we’ll explore the specific decisions Intel made, the rise and neglect of Atom, and why the company’s superior foundry technology wasn’t enough to conquer the market.

在这个由两部分组成的系列的第一部分中，我们讨论了英特尔与台积电晶圆代工模式的差异，以及这些差异如何让英特尔在移动领域极难竞争。在第二部分里，我们将探讨英特尔做出的具体决策、Atom 的崛起与被忽视，以及为什么公司更先进的晶圆制造技术仍不足以征服市场。

The common explanation for why Intel lost the mobile market is that its x86 mobile processors either drew too much power or weren’t powerful enough compared with their ARM counterparts. Intel’s decision to sell its ARM division and XScale processor line in 2006 has been widely derided as a critical error. It’s a simple, common-sense explanation with just one flaw: It mistakes symptoms for cause.

对“英特尔为何丢掉移动市场”的常见解释是：与 ARM 阵营的产品相比，它的 x86 移动处理器要么功耗太高，要么性能不够。英特尔在 2006 年卖掉 ARM 部门和 XScale 处理器产品线的决定，被普遍讥为重大失误。这个解释简单、符合直觉，但只有一个毛病：它把症状当成了病因。

## All of This Has Happened Before

## 这一切早已发生过

Intel’s struggles in the mobile market didn’t begin with Medfield, Moorestown, or even the decision to sell its ARM business and XScale chip division ten years ago. As EETimes reported in 2006:

英特尔在移动市场的挣扎，并非始于 Medfield、Moorestown，甚至也不是始于十年前卖掉 ARM 业务和 XScale 芯片部门的决定。正如 EETimes 在 2006 年报道的那样：

Intel (Santa Clara, Calif.) spent more than $10 billion to enter the communications business over the years, but the microprocessor giant lost its shirt — if not millions of dollars in the arena. The reported communications-chip sale is said to be part of Intel’s plan to overhaul the company. Intel is also set to include the layoff or redeployment of 16,000 employees, according to speculation from one Web site.

英特尔（加州圣克拉拉）多年来为进军通信业务花掉了超过 100 亿美元，但这位微处理器巨头却输得精光——在这个竞技场上亏损了数百万美元也不止。据称，出售通信芯片业务是英特尔重组公司计划的一部分。据某家网站猜测，英特尔还打算裁员或重新调配 16,000 名员工。

Change “communications” to mobile, adjust the number of fired employees, and that paragraph could’ve been written today. Intel’s problems in mobile aren’t new; Santa Clara has been struggling to enter new markets for nearly 20 years. Other articles from 2006 emphasize that XScale sales had been fairly low, as had revenue from Intel’s networking and communications division.

把“通信”换成“移动”，再调整一下被裁员工的人数，这段话放到今天也照样成立。英特尔在移动领域的问题并不新鲜；近 20 年来，圣克拉拉一直在艰难地打入新市场。2006 年的其他文章也强调，XScale 的销量相当低，英特尔网络与通信部门的收入也同样低迷。

From Intel’s perspective, selling XScale made sense. Building a mobile processor business around ARM cores would have limited Intel’s ability to leverage its own IP and expertise in x86 manufacturing, while simultaneously cutting into its profits (Intel would have owed significant royalties to ARM if such a design ever became popular). Atom was already well into development in 2006 and Intel decided to bet on its own hardware expertise and software development skills.

从英特尔的角度看，卖掉 XScale 是说得通的。围绕 ARM 核心来打造移动处理器业务，会限制英特尔利用自身在 x86 制造上的知识产权和专长，同时还会侵蚀利润（如果这种设计真的流行起来，英特尔就欠 ARM 一大笔版税）。2006 年时 Atom 的研发已经推进得很深入，英特尔决定押注自己的硬件专长和软件开发能力。

## Atom and the Rise of x86 Everywhere

## Atom 与 x86 无所不在的崛起

Contrary to popular belief, Intel wasn’t caught completely off-guard by the rise of smartphones or the popularity of small, Internet-connected devices. Atom development began in 2004; the Silverthorne core that Intel debuted in 2008 had a TDP of just 2-3W at a time when most mobile Core 2 Duo processors were stuck in 35W territory.

与流行的看法相反，英特尔的脚步并没有完全被智能手机的兴起，或是小型联网设备的流行打乱。Atom 的研发始于 2004 年；英特尔 2008 年首发的 Silverthorne 核心，热设计功耗(TDP)仅 2-3W，而当时大多数移动版 Core 2 Duo 处理器还停留在 35W 的水平。

![](https://www.extremetech.com/wp-content/uploads/2016/05/Intel-Penny.jpg)

Most people remember Atom as the chip that launched a thousand netbooks, but that wasn’t Intel’s original plan. The company thought nettops and netbooks would be a niche market for Atom, not the chip’s primary platform. Atom and its successors were supposed to launch an armada of Mobile Internet Devices, known as MIDs.

在大多数人的记忆里，Atom 是催生上千款上网本的那颗芯片，但这并不是英特尔最初的打算。公司认为上网机(nettop)和上网本只是 Atom 的细分市场，而非该芯片的主战场。Atom 及其后续产品，本应推出一支庞大的移动互联网设备(Mobile Internet Device，简称 MID)舰队。

![](https://www.extremetech.com/wp-content/uploads/2016/05/Gigabyte-MID-768x576.jpg)

Devices like the Gigabyte MID M528, shown above, look hopelessly quaint today, but Intel was clearly thinking about the future of mobile computing. The company envisioned an ecosystem of netbooks and MIDs driven by its own custom x86 architecture, a goal the press dubbed “x86 everywhere.”

上图这类设备，比如技嘉(Gigabyte) MID M528，今天看来已显得无比古旧，但英特尔当时显然在思考移动计算的未来。公司设想了一个由自家定制 x86 架构驱动的上网本和 MID 生态，媒体把这个目标称为“x86 无所不在(x86 everywhere)”。

## Conflicting Priorities

## 相互冲突的优先级

There were clearly executives at Intel who understood how critical mobile would be to the company’s long-term future and pushed for aggressive positioning and product ramps. Unfortunately, those efforts were stymied by others who were concerned about the impact Atom and the low-cost devices it was supposed to enable would have on Intel’s primary business. MIDs and later netbooks were supposed to be bare-bones, low-cost devices, useful as secondary machines and for basic tasks, but no more.

英特尔内部显然有高管明白移动业务对公司长远未来有多关键，并力主采取激进的布局和产品爬坡。遗憾的是，这些努力被另一些人挡住了，他们担心 Atom 以及它本应带动的低成本设备会冲击英特尔的主营业务。MID 以及后来的上网本，被定位成简陋、廉价的设备，适合当备用机、做些基础任务，仅此而已。

![](https://www.extremetech.com/wp-content/uploads/2016/05/IntelSoC.jpg)

Intel was working on Atom SoCs in 2008, but its first fully unified chip wouldn’t ship until 2012.

英特尔 2008 年就在研发 Atom SoC，但它的第一款完全整合的芯片直到 2012 年才出货。

Intel’s post-launch attitude towards Atom is best summarized as benign neglect. While the chip went through several revisions to integrate components and reduce costs, Intel refused to commit the resources that would have made Atom a best-in-class player in the mobile market. From 2008 to 2013, Intel launched a cost-reduced version of its Nehalem architecture, the Westmere 32nm die shrink, a new architecture with integrated graphics (Sandy Bridge), a high-end enthusiast platform (Sandy Bridge-E), a new 22nm CPU with FinFET technology (Ivy Bridge), another architectural refresh (Haswell), and a second-generation enthusiast platform (Ivy Bridge-E). That’s two full tick-tock cadences for Intel’s big-core business, while Atom didn’t even make the jump to 32nm until 2012. Its single architectural refresh to date arrived in 2013, just after the launch of Ivy Bridge-E.

英特尔对 Atom 发布后的态度，用“善意的忽视”来概括最为贴切。虽然这颗芯片经历了几次改版以整合组件、降低成本，但英特尔始终不愿投入足以让 Atom 成为移动市场一流玩家的资源。从 2008 到 2013 年，英特尔推出了 Nehalem 架构的降本版本、Westmere 32nm 晶片微缩、集成显卡的新架构(Sandy Bridge)、高端发烧平台(Sandy Bridge-E)、采用 FinFET 技术的 22nm 新 CPU(Ivy Bridge)、又一次架构更新(Haswell)，以及第二代发烧平台(Ivy Bridge-E)。这是英特尔大核心业务整整两轮“嘀嗒”节奏，而 Atom 直到 2012 年才跨入 32nm。它至今唯一的一次架构更新出现在 2013 年，就在 Ivy Bridge-E 发布之后。

Despite being initially starved for resources, 32nm Atom chips were competitive in the midrange mobile market. With Medfield, Intel seemed to have turned a corner, but the company’s designs generally failed to find much traction in the market. Only Intel’s contra-revenue strategy won the company significant tablet market share, and those gains were only sustained through heavy financial losses.

尽管最初资源匮乏，32nm 的 Atom 芯片在中端移动市场仍有竞争力。借助 Medfield，英特尔似乎迎来了转机，但公司的设计总体上没能在市场上打开局面。唯有英特尔的“反向补贴(contra-revenue)”策略为公司赢得了可观的平板市场份额，而这些份额只有靠巨额亏损才得以维持。

![](https://www.extremetech.com/wp-content/uploads/2016/05/intel-mobile-chart.png)

Intel’s mobile and communications revenue and losses from Q1 2013 through Q2 2014.

英特尔移动与通信业务 2013 年第一季度至 2014 年第二季度的收入与亏损。

Atom wasn’t the problem — Atom was the solution Intel didn’t have the guts to chase.

Atom 不是问题所在——Atom 正是英特尔没有胆量去追求的那个答案。

## The Tough Decisions Intel Didn’t Make

## 英特尔没有做出的艰难决定

Intel failed to gain traction in mobile because it wasn’t willing to risk upsetting the economic model that had transformed it into a titan of computing. The company’s fabs, manufacturing strategies, and resources were geared towards large, expensive processors, not churning out huge numbers of low-cost mobile cores. Prioritizing Atom over Core would’ve required the company to retool at least some of its fabs to emphasize throughput and lower costs in order to compete with the ARM processors built at Samsung and TSMC. It would’ve meant lower gross margins and less profit per unit sold.

英特尔之所以在移动领域打不开局面，是因为它不愿冒险打破那套把它变成计算巨头的经济模式。公司的晶圆厂、制造战略和资源，都是为又大又贵的处理器服务的，而不是为海量生产低成本移动核心而生的。要把 Atom 置于 Core 之上，公司至少得改造一部分晶圆厂，转而强调产能和低成本，才能与三星、台积电制造的 ARM 处理器竞争。这意味着更低的毛利率和更少的单件利润。

![](https://www.extremetech.com/wp-content/uploads/2012/09/AtomRoadmap-1024x576.jpg)

Intel tried to speed things up eventually, but both its 14nm process and the next-generation Goldmont CPU core were delayed.

英特尔最终试图加快进度，但它的 14nm 工艺和下一代 Goldmont CPU 核心都延期了。

Intel did take steps to improve its competitive standing vis-a-vis ARM and ARM’s foundry partners, but it rarely took them quickly and often failed to follow through. Intel bought Infineon Wireless in 2011 for $1.4 billion, but to this day all of its publicly announced wireless products, including the XMM 7480 modem, are still built on 28nm at TSMC. Smartphones and tablets have always used SoCs, but Intel didn’t launch its first Atom-based SoC until 2012 — five years after the iPhone launched and four years after Atom’s own debut.

英特尔确实采取过一些措施来改善相对 ARM 及其代工伙伴的竞争地位，但很少能迅速行动，也常常虎头蛇尾。英特尔 2011 年以 14 亿美元收购了英飞凌无线(Infineon Wireless)，但时至今日，它所有公开宣布的无线产品，包括 XMM 7480 基带，仍在台积电以 28nm 制造。智能手机和平板一直都用 SoC，可英特尔直到 2012 年才推出第一款基于 Atom 的 SoC——那是 iPhone 发布五年、Atom 自身亮相四年之后。

![](https://www.extremetech.com/wp-content/uploads/2014/12/sofia-3g_large.png)

The SoFIA partnership with TSMC raised eyebrows, but not revenue.

与台积电的 SoFIA 合作让人侧目，却没能带来收入。

One thing we want to stress here is that Intel’s decision to protect its core (Core) business and product margins may have been wrong, but it wasn’t crazy. Refitting fabs, building expertise in SoC design, and porting modems from TSMC would have required large cash infusions and take significant amounts of time. If Intel had launched Atom with an aggressive plan to put the chip in smartphones by 2010, things might have played out very differently. By the time the company woke up to the threat it faced from ARM and merchant foundries, it was too late to make up the gap.

这里要强调一点：英特尔保护其核心(Core)业务和产品利润率的决定也许是错的，但并不荒唐。改造晶圆厂、建立 SoC 设计专长、把基带从台积电迁移过来，都需要大笔资金投入和大量时间。如果英特尔当年推出 Atom 时就带着一个激进的计划——到 2010 年把这颗芯片装进智能手机，事情可能会截然不同。等到公司惊醒过来、意识到来自 ARM 和商用晶圆代工厂的威胁时，要弥补差距已经太晚了。

## Why Intel’s Foundry Tech Couldn’t Save Its Mobile Business

## 为什么英特尔的晶圆制造技术救不了它的移动业务

Intel’s process technology leadership couldn’t save the company’s mobile division because it wasn’t designed to do so. Smartphone and tablet OEMs wanted devices with integrated LTE radios; Intel didn’t have them. Even the SoFIA partnership with TSMC never came to market, apparently because Intel couldn’t secure enough volume to kickstart production.

英特尔在工艺技术上的领先救不了它的移动部门，因为这套技术本就不是为此设计的。智能手机和平板 OEM 想要集成 LTE 射频的器件，而英特尔没有。就连与台积电的 SoFIA 合作也从未上市，显然是因为英特尔无法锁定足够的产量来启动生产。

Intel’s 14nm problems delayed its next-generation tablet processors from 2014 to 2015. Its 10nm node, once expected to secure enormous economies of scale over TSMC, has been pushed to 2017 as well. I don’t think these delays played a huge role in Intel’s decision to leave the mobile market, but they may have influenced it. In 2012, Intel still expected to be on 10nm by 2016 with EUV (extreme ultraviolet lithography) ramping towards full production. The now-canceled 450mm wafers weren’t expected in-market quite this soon, but Chipzilla expected to recognize significant cost savings from moving to the larger wafers in the 2018 to 2020 timeframe — cost savings that could’ve further improved its standing against Samsung, TSMC, and GlobalFoundries.

英特尔的 14nm 问题把它的下一代平板处理器从 2014 年推迟到 2015 年。它的 10nm 节点，曾被寄望于对台积电取得巨大的规模经济优势，也同样被推迟到了 2017 年。我认为这些延期在英特尔退出移动市场的决定中并非主因，但可能起到了影响。2012 年时，英特尔仍预期在 2016 年进入 10nm，并让 EUV（极紫外光刻）逐步走向量产。如今已被取消的 450mm 晶圆，当时并不预期会这么快上市，但这家“Chipzilla”预期在 2018 到 2020 年间能从转向更大晶圆中获得可观的成本节约——这种节约本可进一步提升它相对三星、台积电和 GlobalFoundries 的地位。

If Intel had begun reorienting towards Atom when it launched the chip in 2008, it might’ve weathered these delays and cancellations without much trouble. Failing to do so left its beleaguered mobile business facing higher-than-expected costs and minimal revenue.

如果英特尔在 2008 年推出 Atom 时就开始向它倾斜，本可以不太费力地扛过这些延期和取消。但它没有这样做，于是本已举步维艰的移动业务，只能面对高于预期的成本和微薄的收入。

Intel didn’t lose the mobile market because Atom’s performance and power consumption didn’t compete with ARM; research and evaluation showed that Atom was capable of matching ARM performance in multiple market segments. It lost the mobile market because it didn’t make the changes that would have allowed it to compete on cost with products manufactured at TSMC and Samsung. The exacting rules and unique layouts that drove Intel to the top of one market could not be easily adapted to others, and Intel was unwilling to risk its position at the top of the conventional x86 market for a risky payoff in mobile. There’s no evidence that keeping XScale or developing ARM products would have changed that — if anything, the ARM division would’ve been under even more pressure to ensure it never became a threat to the x86 business.

英特尔丢掉移动市场，并不是因为 Atom 的性能和功耗拼不过 ARM；研究和评估表明，Atom 有能力在多个细分市场追平 ARM 的性能。它丢掉移动市场，是因为它没有做出那些能让它在成本上与台积电、三星制造的产品竞争的改变。那些把英特尔推上一个市场巅峰的严苛规则和独特版图，很难照搬到其他市场；而英特尔也不愿为了移动领域里风险难测的回报，去赌上自己在传统 x86 市场的老大地位。没有证据表明保留 XScale 或开发 ARM 产品就能改变这一切——真要说的话，那个 ARM 部门反而会承受更大压力，以确保它永远不会成为 x86 业务的威胁。




- https://www.extremetech.com/computing/227816-how-intel-lost-the-mobile-market-part-2-the-rise-and-neglect-of-atom
