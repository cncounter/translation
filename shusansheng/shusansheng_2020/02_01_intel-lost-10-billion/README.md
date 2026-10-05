# How Intel Lost $10 Billion — and the Mobile Market

# 英特尔移动战略败局（一）： 痛失百亿美金市场


![](https://www.extremetech.com/wp-content/uploads/2020/04/Intel-HQ-Logo-Press-Image-640x360.jpg)


Update (6/1/2020): We’ve republished the story below as a discussion of how Intel’s mobile efforts consumed so much of the company’s attention, yet ultimately came to naught. In the years since this story was published in 2016, Intel attempted to build a competitive 5G modem that would put it on the cutting edge of the new market. Unfortunately, that effort ultimately failed and Intel sold its 5G modem business to Apple. Atom has continued to develop as a low power mobile solution for entry-level Windows systems and Chromebooks.

更新（2020 年 6 月 1 日）：我们把下面的文章重新发布，用来讨论英特尔的移动业务如何消耗了公司如此多的注意力，最终却一无所获。自本文于 2016 年发表以来，英特尔试图打造一款有竞争力的 5G 基带(modem)，让自己站上新市场的前沿。遗憾的是，这一努力最终失败，英特尔把 5G 基带业务卖给了苹果。Atom 则继续演进，成为面向入门级 Windows 系统和 Chromebook 的低功耗移动解决方案。

The observations on foundry models are more salient now than they were in 2016. Back then, Intel’s 10nm was only a little late and the company was still considered to be on the cutting edge of semiconductor tech. TSMC currently occupies that position, though Intel wants to reclaim its crown by 5nm. Back in 2016, we occasionally heard analysts opine that Intel should sell its fabs and embrace the fabless model due to the increased competition from TSMC. Those whispers have only grown louder. I’m not saying I agree with them, but it’s interesting to see how this article frames the TSMC versus Intel fight. Back in 2016, things looked very different than they do today.

如今，关于晶圆代工模式的这些观察，比 2016 年时更加切中要害。当年，英特尔的 10nm 只是稍微延期，公司仍被视为处在半导体技术的前沿。目前占据这一位置的是台积电(TSMC)，尽管英特尔希望借 5nm 重新夺回桂冠。2016 年时，我们偶尔会听到分析师认为，由于来自台积电的竞争加剧，英特尔应当卖掉自己的晶圆厂、转向无晶圆厂(fabless)模式。这些耳语如今只变得更响亮了。我并不是说我认同他们，但看看本文如何描述台积电与英特尔之争，很有意思。2016 年时，情况看起来与今天大不相同。

The Qualcomm antitrust lawsuit disclosures paint Intel’s failure to gain market share in a very different light, but I have more to say about that in Part 2 of this updated story.

高通(Qualcomm)反垄断诉讼所披露的内容，让“英特尔未能赢得市场份额”这件事有了完全不同的解读，关于这一点，我在本次更新文章的第二部分还会多说一些。

Original Story Below:

以下是原文：

Just over four years ago, we reviewed Intel’s first plausible smartphone, the Xolo 900. While it couldn’t match more powerful devices of the day, it was a solid initial effort. More importantly, the Medfield SoC that powered the Xolo 900 was meant to be a beachhead, a harbinger, a sign of things to come.

就在四年多以前，我们评测了英特尔第一款像样的智能手机 Xolo 900。虽然它比不上当时更强大的设备，但作为初次尝试已经相当扎实。更重要的是，为 Xolo 900 提供动力的 Medfield SoC，本应是一个滩头阵地、一个先兆、一个未来走向的信号。

Four years and billions of dollars later, it’s now clear that the long-awaited ARM-versus-x86 war won’t be fought in the tablet or smartphone market. Intel has canceled all of its publicly announced 14nm smartphone SoCs and most of its 14nm tablet SoCs that would have shipped in Android devices. The company is diving into 5G research and hopes to lead the industry in developing 5G products. But its 3G and 4G modems are still built on the 28nm process node at TSMC, even as competitors like Qualcomm move to 14nm for their own products.

四年之后、花掉数十亿美元之后，现在很清楚：人们期待已久的 ARM 与 x86 之战，不会在平板或智能手机市场上打响。英特尔已取消所有公开宣布的 14nm 智能手机 SoC，以及大部分本应搭载于 Android 设备的 14nm 平板 SoC。公司正投身 5G 研究，希望在 5G 产品的开发上引领行业。但它的 3G 和 4G 基带至今仍由台积电以 28nm 工艺节点制造，而高通等竞争对手已经把自家产品推进到 14nm。

How did Intel manage to spend up to $10 billion and have so little to show for it? There’s no single, simple answer — but there are definitely some smoking guns. If you want to understand what went wrong for Intel, we need to talk about the semiconductor industry as a whole.

英特尔究竟是如何花掉高达 100 亿美元，却几乎没有拿得出手的成果？答案并不唯一，也不简单——但确实有一些确凿的线索。如果你想弄清英特尔到底哪里出了问题，我们得先聊聊整个半导体行业。

## Of Fabs and Foundries

## 晶圆厂与晶圆代工厂

The semiconductor industry is dominated by four companies: GlobalFoundries, Intel, Samsung, and TSMC. Three of these companies — GlobalFoundries, Samsung, and TSMC — are known as pure-play foundries or merchant foundries. Their business model is based on manufacturing silicon for other companies, not designing and launching products that they sell themselves. (Samsung does build some custom silicon for itself, but the bulk of its foundry business comes from external customers).

半导体行业由四家公司主导：GlobalFoundries、英特尔、三星和台积电。其中三家——GlobalFoundries、三星和台积电——被称为纯粹晶圆代工厂(pure-play foundry)或商用晶圆代工厂(merchant foundry)。它们的商业模式是为其他公司制造芯片，而不是自行设计并推出自己销售的产品。（三星确实会为自己制造一些定制芯片，但其代工业务的大头来自外部客户。）


![](https://www.extremetech.com/wp-content/uploads/2016/05/Intel-Smartphone.jpg)

Unlike the merchant foundries, Intel designs and builds both its fabrication plants and its microprocessors. Until the last few years, Intel never took foundry customers. Intel’s recent attempts to break into the merchant foundry business by attracting a handful of high-margin customers weren’t all that successful and have yet to generate significant revenue for the company.

与商用晶圆代工厂不同，英特尔既自行设计、也自行建造晶圆厂(fab)和微处理器。直到最近几年，英特尔从不接代工客户。英特尔近期试图通过吸引少数高利润客户来进军商用代工业务，但都不太成功，也尚未给公司带来可观的收入。

The distinction between merchant foundries and IDMs (integrated device manufacturers) like Intel is a critical part of why Intel’s mobile efforts played out the way they did.

商用晶圆代工厂与英特尔这类 IDM（集成器件制造商，integrated device manufacturer）之间的区别，是理解英特尔移动业务为何走到这一步的关键。

Intel’s manufacturing strategy historically relied on rapidly adopting new process technology. The bulk of the company’s revenue is derived from leading-edge nodes; older facilities were either upgraded or shut down as they became obsolete. The chart below shows Intel’s R&D expenses as a percentage of total sales as compared to Samsung and TSMC:

英特尔过去的制造战略依赖于快速采用新工艺技术。公司收入的大头来自最先进的工艺节点；较老的工厂一旦过时，要么被升级，要么被关停。下图对比了英特尔、三星和台积电的研发费用占销售额的比例：

![](https://www.extremetech.com/wp-content/uploads/2016/05/bulletin020513Fig1.jpg)

TSMC pursues a very different optimization strategy. While it also invests in leading-edge semiconductor technology, the bulk of TSMC’s revenue is earned on older technology nodes. The chart below is based on TSMC’s Q1 2015 results:

台积电追求一种截然不同的优化策略。它同样投资于最先进的半导体技术，但台积电收入的大头来自较老的工艺节点。下图基于台积电 2015 年第一季度的业绩：

![](https://www.extremetech.com/wp-content/uploads/2016/05/TSMCRevenue.png)

TSMC’s revenue by process node

台积电按工艺节点划分的收入

As of Q1 2015, 39 percent of TSMC’s revenue was earned on technology nodes it deployed 10-20 years ago. 54 percent of its revenue came from nodes that were in volume production at least eight years ago. Intel made limited use of older facilities to build its chipsets, but its business model is fundamentally different.

截至 2015 年第一季度，台积电有 39% 的收入来自它 10 到 20 年前部署的工艺节点，54% 的收入来自至少八年前就已量产的节点。英特尔也会有限地利用较老的工厂来制造芯片组，但其商业模式有着本质的不同。

For most of 30 years, that difference didn’t really matter. From the 1980s through 2010, Intel beat its low-volume RISC competitors and seized the data center by leveraging the economies of scale it created in the consumer PC market. It crushed its only serious competitor in the x86 market and forced AMD to sell its own fabs in an effort to survive.

在长达 30 年的大部分时间里，这种差异其实无关紧要。从上世纪 80 年代到 2010 年，英特尔凭借在消费级 PC 市场创造的规模经济，击败了出货量较低的 RISC 竞争对手，并占领了数据中心。它击溃了 x86 市场上唯一认真的对手，并迫使 AMD 为了生存而出售自家晶圆厂。

![](https://www.extremetech.com/wp-content/uploads/2016/05/Intel-Business.jpg)

Intel drove volume in new markets by exploiting economies of scale it had created elsewhere

英特尔利用它在别处创造的规模经济，在新市场拉动出货量

The pure-play foundries and Intel worked in parallel tracks, often contending with some of the same problems, but prioritizing and solving them in different ways. Intel built its foundries to rigorous standards using a philosophy it called “Copy Exactly.” It prioritized high yields, focused almost exclusively on microprocessors, and enforced strict design rules. Intel products were designed to be built at Intel foundries with Intel tools and Intel’s established best practices.

纯粹晶圆代工厂和英特尔沿着平行的轨道运作，常常要面对一些同样的问题，但处理优先级和解决方式却不同。英特尔用一套它称之为“完全复制(Copy Exactly)”的理念，按严苛标准建造晶圆厂。它优先保证高良率，几乎只专注于微处理器，并强制执行严格的设计规则。英特尔的产品，就是为在英特尔晶圆厂、用英特尔工具和英特尔既定最佳实践来制造而设计的。

In contrast, TSMC and the other merchant foundries designed their process nodes to meet the needs of many different clients. Their fabs prioritize throughput and flexibility while minimizing cost. Both models worked beautifully for their respective businesses — until their businesses started to collide.

相比之下，台积电和其他商用晶圆代工厂设计工艺节点，是为了满足许多不同客户的需求。它们的晶圆厂优先考虑产能和灵活性，同时尽可能压低成本。两种模式在各自业务中都运行得很好——直到两者的业务开始正面碰撞。

## The Limits of Technology

## 技术的极限

Intel’s failure to gain traction in the mobile market highlights the flaws in treating technological progress as a roadmap for corporate success. Despite recent delays and its own decision to abandon its tick-tock model, Intel still owns the most technologically advanced foundries in the world. It’s the only company to have deployed a true 14nm die shrink and it’ll be the first company to deploy a true 10nm node as opposed to a 10/14 or 10/16 hybrid. All of this is true — as is the fact that Intel spent $10 billion (according to Re/code) in mobile with nothing to show for it.

英特尔在移动市场未能打开局面，凸显出把技术进步当作企业成功路线图的缺陷。尽管最近遭遇延期，公司自己也决定放弃“嘀嗒(tick-tock)”模式，英特尔依然拥有世界上技术最先进的晶圆厂。它是唯一一家实现真正 14nm 晶片微缩(die shrink)的公司，也将是第一家部署真正 10nm 节点（而非 10/14 或 10/16 混合节点）的公司。这些都是事实——同样属实的是，据 Re/code 报道，英特尔在移动业务上花了 100 亿美元，却毫无成果。

Technology sites, including ExtremeTech, have often discussed x86 versus ARM or AMD versus Nvidia strictly in terms of process node and roadmap. This works extremely well when discussing advances in battery life or performance, but much less well when applied to corporations who suddenly find themselves in direct competition for the first time in decades.

包括 ExtremeTech 在内的科技媒体，常常只用工艺节点和路线图来讨论 x86 与 ARM、或 AMD 与 Nvidia 的优劣。这在讨论电池续航或性能提升时非常管用，但一旦套用到那些几十年来头一回突然陷入直接竞争的公司身上，就不太灵了。

In Part 2 of this two-part series, we discuss how Intel’s business model and development priorities slowed and sabotaged its ability to compete effectively in the mobile world. We also discuss why the myriad ARM-versus-Atom debates failed to capture the real problems plaguing Chipzilla, and why the company saw such limited adoption of its products.

在这个由两部分组成的系列的第二部分中，我们将讨论英特尔的商业模式和开发优先级如何拖慢并破坏了它在移动领域有效竞争的能力。我们还会讨论，为什么围绕 ARM 与 Atom 的无数争论都没能抓住困扰这家“Chipzilla”的真正问题，以及为什么它的产品采用率如此有限。




- https://www.extremetech.com/extreme/227720-how-intel-lost-10-billion-and-the-mobile-market
