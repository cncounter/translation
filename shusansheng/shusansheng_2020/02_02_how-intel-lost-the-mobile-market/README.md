# How Intel Lost the Mobile Market, Part 2: The Rise and Neglect of Atom

# 英特尔移动战略败局（二）： Atom的崛起与疏忽

![](https://www.extremetech.com/wp-content/uploads/2016/05/Intel-Silverthorne2-640x354.jpg)

Update (6/1/2020): The article below may have been written in 2016, but it still stands up as a postmortem of what went wrong with Intel’s mobile efforts — with one very important omission. Back in 2016, we didn’t know Qualcomm had been ruthlessly enforcing licensing and purchasing terms that made it effectively impossible for manufacturers to offer Intel-based mobile devices. I remember wondering why Intel couldn’t find a single US company to produce a phone around its hardware platform for love or money when the original Xolo X900 compared well enough against a then-current iPhone.

Intel still made a number of mistakes with Atom, as this article discusses, but the fact that Qualcomm had a stranglehold on the market behind the scenes obviously had an impact on what kind of success Intel was ever going to achieve.

I genuinely liked the Xolo X900 device I tested all those years ago, and the Bay Trail tablets I had circa 2013 were great devices. Atom’s mobile efforts will always remain an enticing might-have-been.

Original story below.

In Part 1 of this two-part series, we discussed the difference between Intel and TSMC’s foundry models and how these differences made it extremely difficult for Intel to compete in mobile. In Part 2 we’ll explore the specific decisions Intel made, the rise and neglect of Atom, and why the company’s superior foundry technology wasn’t enough to conquer the market.

The common explanation for why Intel lost the mobile market is that its x86 mobile processors either drew too much power or weren’t powerful enough compared with their ARM counterparts. Intel’s decision to sell its ARM division and XScale processor line in 2006 has been widely derided as a critical error. It’s a simple, common-sense explanation with just one flaw: It mistakes symptoms for cause.

## All of This Has Happened Before

Intel’s struggles in the mobile market didn’t begin with Medfield, Moorestown, or even the decision to sell its ARM business and XScale chip division ten years ago. As EETimes reported in 2006:

Intel (Santa Clara, Calif.) spent more than $10 billion to enter the communications business over the years, but the microprocessor giant lost its shirt — if not millions of dollars in the arena. The reported communications-chip sale is said to be part of Intel’s plan to overhaul the company. Intel is also set to include the layoff or redeployment of 16,000 employees, according to speculation from one Web site.

Change “communications” to mobile, adjust the number of fired employees, and that paragraph could’ve been written today. Intel’s problems in mobile aren’t new; Santa Clara has been struggling to enter new markets for nearly 20 years. Other articles from 2006 emphasize that XScale sales had been fairly low, as had revenue from Intel’s networking and communications division.

From Intel’s perspective, selling XScale made sense. Building a mobile processor business around ARM cores would have limited Intel’s ability to leverage its own IP and expertise in x86 manufacturing, while simultaneously cutting into its profits (Intel would have owed significant royalties to ARM if such a design ever became popular). Atom was already well into development in 2006 and Intel decided to bet on its own hardware expertise and software development skills.

## Atom and the Rise of x86 Everywhere

Contrary to popular belief, Intel wasn’t caught completely off-guard by the rise of smartphones or the popularity of small, Internet-connected devices. Atom development began in 2004; the Silverthorne core that Intel debuted in 2008 had a TDP of just 2-3W at a time when most mobile Core 2 Duo processors were stuck in 35W territory.

![](https://www.extremetech.com/wp-content/uploads/2016/05/Intel-Penny.jpg)

Most people remember Atom as the chip that launched a thousand netbooks, but that wasn’t Intel’s original plan. The company thought nettops and netbooks would be a niche market for Atom, not the chip’s primary platform. Atom and its successors were supposed to launch an armada of Mobile Internet Devices, known as MIDs.

![](https://www.extremetech.com/wp-content/uploads/2016/05/Gigabyte-MID-768x576.jpg)

Devices like the Gigabyte MID M528, shown above, look hopelessly quaint today, but Intel was clearly thinking about the future of mobile computing. The company envisioned an ecosystem of netbooks and MIDs driven by its own custom x86 architecture, a goal the press dubbed “x86 everywhere.”

## Conflicting Priorities

There were clearly executives at Intel who understood how critical mobile would be to the company’s long-term future and pushed for aggressive positioning and product ramps. Unfortunately, those efforts were stymied by others who were concerned about the impact Atom and the low-cost devices it was supposed to enable would have on Intel’s primary business. MIDs and later netbooks were supposed to be bare-bones, low-cost devices, useful as secondary machines and for basic tasks, but no more.

![](https://www.extremetech.com/wp-content/uploads/2016/05/IntelSoC.jpg)

Intel was working on Atom SoCs in 2008, but its first fully unified chip wouldn’t ship until 2012.

Intel’s post-launch attitude towards Atom is best summarized as benign neglect. While the chip went through several revisions to integrate components and reduce costs, Intel refused to commit the resources that would have made Atom a best-in-class player in the mobile market. From 2008 to 2013, Intel launched a cost-reduced version of its Nehalem architecture, the Westmere 32nm die shrink, a new architecture with integrated graphics (Sandy Bridge), a high-end enthusiast platform (Sandy Bridge-E), a new 22nm CPU with FinFET technology (Ivy Bridge), another architectural refresh (Haswell), and a second-generation enthusiast platform (Ivy Bridge-E). That’s two full tick-tock cadences for Intel’s big-core business, while Atom didn’t even make the jump to 32nm until 2012. Its single architectural refresh to date arrived in 2013, just after the launch of Ivy Bridge-E.

Despite being initially starved for resources, 32nm Atom chips were competitive in the midrange mobile market. With Medfield, Intel seemed to have turned a corner, but the company’s designs generally failed to find much traction in the market. Only Intel’s contra-revenue strategy won the company significant tablet market share, and those gains were only sustained through heavy financial losses.

![](https://www.extremetech.com/wp-content/uploads/2016/05/intel-mobile-chart.png)

Intel’s mobile and communications revenue and losses from Q1 2013 through Q2 2014.

Atom wasn’t the problem — Atom was the solution Intel didn’t have the guts to chase.

## The Tough Decisions Intel Didn’t Make

Intel failed to gain traction in mobile because it wasn’t willing to risk upsetting the economic model that had transformed it into a titan of computing. The company’s fabs, manufacturing strategies, and resources were geared towards large, expensive processors, not churning out huge numbers of low-cost mobile cores. Prioritizing Atom over Core would’ve required the company to retool at least some of its fabs to emphasize throughput and lower costs in order to compete with the ARM processors built at Samsung and TSMC. It would’ve meant lower gross margins and less profit per unit sold.

![](https://www.extremetech.com/wp-content/uploads/2012/09/AtomRoadmap-1024x576.jpg)

Intel tried to speed things up eventually, but both its 14nm process and the next-generation Goldmont CPU core were delayed.

Intel did take steps to improve its competitive standing vis-a-vis ARM and ARM’s foundry partners, but it rarely took them quickly and often failed to follow through. Intel bought Infineon Wireless in 2011 for $1.4 billion, but to this day all of its publicly announced wireless products, including the XMM 7480 modem, are still built on 28nm at TSMC. Smartphones and tablets have always used SoCs, but Intel didn’t launch its first Atom-based SoC until 2012 — five years after the iPhone launched and four years after Atom’s own debut.

![](https://www.extremetech.com/wp-content/uploads/2014/12/sofia-3g_large.png)

The SoFIA partnership with TSMC raised eyebrows, but not revenue.

One thing we want to stress here is that Intel’s decision to protect its core (Core) business and product margins may have been wrong, but it wasn’t crazy. Refitting fabs, building expertise in SoC design, and porting modems from TSMC would have required large cash infusions and take significant amounts of time. If Intel had launched Atom with an aggressive plan to put the chip in smartphones by 2010, things might have played out very differently. By the time the company woke up to the threat it faced from ARM and merchant foundries, it was too late to make up the gap.

## Why Intel’s Foundry Tech Couldn’t Save Its Mobile Business

Intel’s process technology leadership couldn’t save the company’s mobile division because it wasn’t designed to do so. Smartphone and tablet OEMs wanted devices with integrated LTE radios; Intel didn’t have them. Even the SoFIA partnership with TSMC never came to market, apparently because Intel couldn’t secure enough volume to kickstart production.

Intel’s 14nm problems delayed its next-generation tablet processors from 2014 to 2015. Its 10nm node, once expected to secure enormous economies of scale over TSMC, has been pushed to 2017 as well. I don’t think these delays played a huge role in Intel’s decision to leave the mobile market, but they may have influenced it. In 2012, Intel still expected to be on 10nm by 2016 with EUV (extreme ultraviolet lithography) ramping towards full production. The now-canceled 450mm wafers weren’t expected in-market quite this soon, but Chipzilla expected to recognize significant cost savings from moving to the larger wafers in the 2018 to 2020 timeframe — cost savings that could’ve further improved its standing against Samsung, TSMC, and GlobalFoundries.

If Intel had begun reorienting towards Atom when it launched the chip in 2008, it might’ve weathered these delays and cancellations without much trouble. Failing to do so left its beleaguered mobile business facing higher-than-expected costs and minimal revenue.

Intel didn’t lose the mobile market because Atom’s performance and power consumption didn’t compete with ARM; research and evaluation showed that Atom was capable of matching ARM performance in multiple market segments. It lost the mobile market because it didn’t make the changes that would have allowed it to compete on cost with products manufactured at TSMC and Samsung. The exacting rules and unique layouts that drove Intel to the top of one market could not be easily adapted to others, and Intel was unwilling to risk its position at the top of the conventional x86 market for a risky payoff in mobile. There’s no evidence that keeping XScale or developing ARM products would have changed that — if anything, the ARM division would’ve been under even more pressure to ensure it never became a threat to the x86 business.




- https://www.extremetech.com/computing/227816-how-intel-lost-the-mobile-market-part-2-the-rise-and-neglect-of-atom
