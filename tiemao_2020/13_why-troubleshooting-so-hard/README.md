# Why is troubleshooting so hard?

# 为什么问题诊断和故障排查这么困难？

[By definition](https://en.wikipedia.org/wiki/Troubleshooting), troubleshooting is supposed to be a logical, systematic search for the source of a problem in order to solve it. Now if you recall the last time you had to troubleshoot a particular issue happening in a production system – would you call it logical and systematic? Or would you agree that words such as hectic and guess-driven are more likely to describe the process you went through?

If you tend to answer YES to the latter question, then you end up wasting a lot of time trying to find the answer. Even worse, as the process is completely unpredictable, it builds tensions within the team and finger-pointing is likely to start happening:


根据定义，[故障排查(Troubleshooting)](https://zh.wikipedia.org/wiki/%E6%8E%92%E9%94%99) 被认为是对问题的来源进行逻辑严密和系统性的排查，以解决问题。
如果对生产系统进行过故障排查的话，您觉得针对这些问题，您的排查过程算得上是系统性的排查吗？ 逻辑严密吗？ 还是因为匆忙而通过猜测来驱动您所执行的诊断过程？

如果您倾向于选择后一种方式，那么可能会浪费大量的时间，效果得看运气。  更糟糕的是，因为基本靠蒙， 所以这个过程是完全不可预测的，如果时间很紧张，就会在团队内部造成压力，甚至升级为甩锅和互相指责。

![troubleshooting war room](https://plumbr.io/app/uploads/2016/09/war-room-finger-pointing.jpg)

In this post I am going to analyze different aspects leading to such situations. First part of the post focuses on the fundamental problems built into the environments where troubleshooting occurs. Second part of the post will describe the tooling and human-related problems in the field. In the closing section I will show that there is still some light at the end of the tunnel.

接下来我们将分析为什么会导致这种情况。
第一部分先重点介绍故障排除时需要注意的基本问题。
第二部分将描述相关的工具和人力。
最后给出一些可以尝试的点子。

## Troubleshooting in production

A particular set of problems tend to happen when you are troubleshooting a particular problem in production. Many different aspects are now likely to make the process a misery:

First and foremost, you are competing with the pressure of “**let’s just restart the instance to get back to normal**”. The desire to use the fastest way to get rid of the impact on end users is natural. Unfortunately, the restart is also likely to destroy any evidence regarding the actual root cause. If the instance is restarted, you no longer can harvest the evidence of what was actually happening. Even when the restart resolves the issue at hand, the root cause itself is still there and is just waiting to happen again.

## 生产环境中进行故障排查的困难

在生产环境中针对特定问题进行故障排除时，往往会有很多限制，可能会导致排查的过程变得痛苦：

首先，最快的办法可能是： “ **只要重启机器就能让系统恢复正常**”。
用最快的方法来避免对用户产生影响是很自然的需求。
但重启可能会破坏故障现场，那样就很难排查问题的根本原因了。
如果重新启动实例，则无法再采集实际发生的情况。
再说，即使重启解决了目前的问题，但问题原因本身仍然存在，后面还会接二连三地发生。

Next in line are different security-related aspects, which tend to **isolate engineering from production environments**. If you do not have the access to the environment yourself, you are forced to troubleshoot remotely, with all the problems related to it: every operation to be carried out now includes multiple persons, increasing both the time it takes to carry out each action and potentially losing information along the way.

The situation goes from bad to worse when you are shipping “let’s hope this works” patches to production. **Testing and applying the patch tends to take hours or even days**, further increasing the time it takes to actually fix the issue at hand. If multiple “let’s hope” patches are required, the resolution is delayed for week(s).


接下来是安全性相关的限制， 这些限制导致生产环境是独立和隔离的。
如果没有权限访问生产环境，那么久只能进行远程故障排除，并涉及到所有与之相关的问题：
- 每个要执行的操作都需要多人参与或审核，这不仅增加了执行单个操作所需的时间，而且沟通交流过程中可能会丢失一些信息。

特别是将临时程序发布到生产环境时， “希望它能生效”， 但情况却可能越来越糟糕。
**因为测试和发布流程可能又要消耗几小时甚至几天**， 进一步增加了解决问题实际消耗的时间。
如果还需要分多次上线这种“不一定生效的补丁程序”，则解决方案很可能会消耗几个星期。

Last but not least in line are the tools to be used themselves. **Some of the tools you would like to deploy are likely to make the situation even worse** for end users. Just as examples:

- Taking heap dumps from the JVM would stop the JVM for tens of seconds.
- Increased verbosity in logging is likely to introduce additional concurrency issues.
- The sheer overhead of an attached profiler can bring an already slow application completely down.

最后但并也很重要的一点是需要使用的工具。 **对于最终用户来说，您希望安装的某些工具可能会使情况变得更糟**。
例如：

- 对JVM进行堆转储(heap dump)可能会使JVM暂停几十秒或更长时间。
- 打印更细粒度的日志可能会引入其他的并发问题。
- 增加的探测器或者分析器可能会有很大开销，导致本就缓慢的系统彻底卡死。

So it is likely that you end up in a situation where days or even weeks are spent in passing yet another telemetry gathering script or yet another “let’s hope it works” patch to production:

因此，要想给系统打补丁或者增加新的远程监测程序，可能最终会花费很多天的时间：

![isolating engineers from operations](https://plumbr.io/app/uploads/2016/09/wall-of-confusion.jpg)

Looking at the problems you are facing when troubleshooting in production, it is only natural that in many cases the troubleshooting activities are carried out in a different environment.

既然在生产环境中进行故障诊断排查会面临这么多的问题，很自然地，大部分情况下，我们都是在开发或测试环境中进行故障排查。

## Troubleshooting in test/development

When troubleshooting in a different environment you can escape the menaces haunting you in production. However, you are now facing a completely different problem which can end up being even worse: namely the challenge of reproducing the performance issue happening in production. There are different aspects making the reproducing process a misery:

- The test environment is not using the same datasource(s) as the production. This means that issues triggered by the data volume might not reproduce in the test environment.
- The usage patterns revealing certain issues are not easy to recreate. Just imagine an issue which happens only on 29th of February and requires two users on Windows ME to access a particular function at the same time triggering a specific concurrency issue.
- The application itself is not the same. The production deployment might have significantly different configuration. The differences can include a different OS, clustering features, startup parameters or even different builds.

## 测试和开发环境中进行问题排查需要注意哪些问题？

如果在开发环境或者测试环境中进行问题诊断和故障排查，则可以避免生产环境中的那些麻烦。
但是，因为开发环境和生产环境配置不同，有些时候可能也会有问题： 即很难复现生产环境中产生的性能问题。
例如：

- 测试环境和生产环境使用的数据源不同。 这意味着由数据量引发的性能问题可能不会在测试环境中重现。
- 某些问题的使用方式可能不容易复现。 例如只在2月29日这个特殊时间引起的并发问题，只在多个用户同时访问某个功能时引发，如果事先不知道原因，那也很难排查。
- 两个环境下的应用程序可能还不一样。 生产部署的配置可能明显不同。 这些差异包括： 操作系统，群集，启动参数, 以及不同的打包版本。

These difficulties lead to the infamous “works on my machine” quote being brought into the discussion:

这些困难会引起 “在我的机器上是好的” 这种很尴尬的局面：

![works on my machine](https://plumbr.io/app/uploads/2016/09/cannot-reproduce.jpg)

So as can be seen, independent of the environment at hand, when you have to troubleshoot something, the nature of the environment at hand will toss several obstacles in your way.

Besides the environment-specific constraints, there are other aspects also contributing to the unpredictable nature of the troubleshooting process. This will be covered in the next section.

可以看出，因为和手头的环境不同，所以在对某些问题进行故障排除时，当前系统环境的性质可能会让你遇到的一些莫名其妙的障碍。

除了特定环境的约束之外，还有其他方面的因素也会导致故障排除过程的不可预测性。 下面我们一起来看一下。

## Tooling and experienced people to the rescue?

The environmental constraints would not be actual showstoppers if the tools used and the discipline of troubleshooting were mature. In reality it is far from it – the engineers responsible for solving the issue often do not have a predefined process to tackle the problem. Honestly, do you recognize yourself in the following sequence of actions taken in shell:

## 临时专家与趁手工具

如果使用趁手的工具, 并且对于故障排除的规则已经胸有成竹，那么环境限制就不再是什么大问题。
实际上，负责排查和解决问题的工程师通常没有预先规划好的处理流程。
老实说，您是否有过像下面这样的 shell 操作：

```
my-precious:~ me$ sar
sar: failed to open input file [-1][/var/log/sa/sa06]
/usr/bin/sar [-Adgpu] [-n { DEV | EDEV | PPP }] [-e time] [-f filename] [-i sec] [-s time]

my-precious:~ me$ man sar

my-precious:~ me$ sar 1
15:29:02  %usr  %nice   %sys   %idle
15:29:03    1      0      2     97
Average:      1      0      2     97   

my-precious:~ me$ sar 1 1000
15:29:06  %usr  %nice   %sys   %idle
15:29:07    2      0      2     97
15:29:08    1      0      2     97
^CAverage:      1      0      1     97

my-precious:~ me$ man sar
my-precious:~ me$ sar -G 1 3
sar: illegal option -- G
/usr/bin/sar [-Adgpu] [-n { DEV | EDEV | PPP }] [-e time] [-f filename] [-i sec] [-s time]

my-precious:~ me$ asdöäaskdasäl;
-bash: asdöäaskdasäl: command not found

my-precious:~ me$
```

If you found the above to be too familiar, don’t be afraid, you are not alone. Far from it, most of the engineers lack the in-depth experience in the field which makes it impossible to make progress based on the familiar patterns recognized. This is not something to be ashamed of – unless you are [Brendan Gregg](http://www.brendangregg.com/) or [Peter Lawrey](https://twitter.com/PeterLawrey), you just don’t have the 10,000 hours of troubleshooting down your belt to make you an expert on the subject.

如果您觉得上面这个过程很熟悉，别紧张，其实大家都这样干。
大多数工程师在故障排除和诊断调优领域都缺乏经验，因此也就很难使用标准的套路。
这没什么丢人的 – 除非是 [Brendan Gregg](http://www.brendangregg.com/) or [Peter Lawrey](https://twitter.com/PeterLawrey) 这种专业大牛，否则您很难有1万小时的故障排除经历，也就很难成为这个领域的专家。

This lack of experience tends to result in tossing different evidence-gathering tools towards the problem at hand, including but not limited to:

- Harvesting different metrics (CPU, memory, IO, network, etc).
- Analyzing application logs
- Analyzing GC logs
- Capturing and analyzing thread dumps
- Capturing and analyzing heap dumps

缺乏经验的话，针对当前问题， 往往需要使用不同的工具来收集信息，例如：

- 收集不同的指标（CPU，内存，磁盘IO，网络等等）。
- 分析应用日志
- 分析GC日志
- 获取线程转储并分析
- 获取堆转储来进行分析

The number of such tools you can use is almost unlimited. Just check out the lists [here](https://github.com/deephacks/awesome-jvm) and [here](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr.html#diagnostic_tools) if you are not convinced. The approach of randomly trying out different tools results in more time spent in choosing and trying out the tools than in actually solving the issue at hand.

我们可以使用的工具几乎是无限的。 如果你不信，可以看:
- [here](https://github.com/deephacks/awesome-jvm)
- [here](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr.html#diagnostic_tools)。

与实际解决问题相比，随机使用各种不熟悉的工具，可能会浪费更多的时间。

## Solving the troubleshooting nightmare

Besides accumulating minutes towards the 10,000 hours which would make you the expert in the field, there are faster solutions to alleviate the pain caused by troubleshooting.

## 解决故障排查带来的痛苦

除了累积将近10,000小时的分钟数（这将使您成为该领域的专家）之外，还有更快速的解决方案来减轻故障排除所带来的痛苦。

### Profiling in development

To make it clear, the post is not about bashing the profiling as a technique. There is nothing wrong in profiling the code, especially before it gets shipped to production. On the contrary, understanding the hotspots and memory consumption of various parts of the app will prevent some issues impacting your end users in production in the first place.

However, the differences in data, usage patterns and environments will only end up exposing a subset of the issues you eventually will be faced in production. The same techniques which worked well as pre-emptive measures will only rarely help while troubleshooting the problem retroactively.

### 在开发过程中进行抽样分析

为了清楚起见，该文章不是关于将剖析作为一种技巧。 对代码进行概要分析没有错，尤其是在将代码交付生产之前。 相反，了解应用程序各个部分的热点和内存消耗将首先防止某些问题影响生产中的最终用户。

但是，数据，使用模式和环境的差异最终只会暴露出您最终将在生产中面临的部分问题。 可以很好地用作先发制人的措施的技术只能在追溯解决问题时极有帮助。

### Testing in QA

Investing into QA, especially if the investments result in automation of the process is the next line of defence you can build. Testing will further reduce the number of incidents in production if applied thoughtfully and thoroughly.

However it is often hard to justify the investments in QA. Everything labelled “performance test something” or “acceptance test something” will eventually be competing with new features driven by clear and measurable business goals. Now when the only things the developer pushing for the “performance something” task are some acronyms, such tasks will never make it out of the backlog:

### QA测试

投资质量保证，尤其是如果投资导致流程自动化是您可以构建的下一道防线。 如果进行周全和彻底的应用，测试将进一步减少生产中的事件数量。

但是，通常很难证明对质量检查的投资是合理的。 一切标有“性能测试”或“验收测试”的产品最终都将与清晰而可衡量的业务目标驱动的新功能竞争。 现在，当开发人员推动“执行某项性能”任务的唯一条件是某些缩写词时，此类任务将永远不会使其积压下来：

| **Priority** | **Type** | **Description**                     | **ROI**                                 |
| :----------- | :------- | :---------------------------------- | :-------------------------------------- |
| 1            | Feature  | Integrate invoicing with Salesforce | BigCO will sign a 250K contract with us |
| 2            | Feature  | Support Windows 10                  | 10% more trials sign-ups will convert   |
| …            | …        | …                                   | ….                                      |
| 99           | Task     | Load test customer search           | ???                                     |

To justify such investments, you need to link the return of the investment to the activity. Reducing the P1 performance incidents in production by 3x can be linked to its dollar value and in such case it has a chance against the next feature the sales team is pushing.

为了证明这种投资的合理性，您需要将投资的回报与活动联系起来。 将生产中的P1性能事件减少3倍可以与它的美元价值联系起来，在这种情况下，它就有机会与销售团队推动的下一个功能相抵触。

### Monitoring in production

### 生产环境中的监控

First thing you need to accept is that problems will occur in production deployment. Even NASA tends to blow up their craft every once in a while, so you’d better be prepared for issues happening in production. No matter how well you profile or how thoroughly you test, bugs will still slip through.

So you cannot avoid troubleshooting production issues. To be better equipped for the task at hand, you should have transparency to your production environment. Whenever an issue arises, you ideally already have all the evidence you need to fix it. If you have all the information you need, you can effectively skip the problematic reproducing and evidence gathering steps.


您需要接受的第一件事是在生产部署中会出现问题。 即使是NASA也会不时地炸毁飞船，因此您最好为生产中发生的问题做好准备。 无论您的配置如何好或测试的透彻程度如何，错误仍然会漏掉。

因此，您无法避免对生产问题进行故障排除。 为了更好地完成手头的任务，您应该对生产环境保持透明。 每当出现问题时，理想情况下，您已经拥有解决该问题所需的所有证据。 如果您拥有所需的所有信息，则可以有效地跳过有问题的复制和证据收集步骤。

Unfortunately the state of the art in monitoring world offers no single silver bullet to expose all the information you need in different circumstances. The set of tools to deploy for a typical web-based application should include at least the following:

- Log monitoring. Logs from various nodes of your production stack should be aggregated so that the engineering team can quickly search for information, visualize the logs and register alerts on anomalies. One of most frequently used solution is the ELK stack, where the logs are stored in [Elasticsearch](http://www.elastic.co/), analyzed in [Logstash](http://www.elastic.co/products/logstash) and visualized with [Kibana](http://www.elastic.co/products/kibana).
- System monitoring. Aggregating and visualizing system-level metrics in your infrastructure is both beneficial and simple to set up. Keeping an eye on CPU, memory, network and disk usage allows you to spot system-level problems and register alerts on anomalies.
- Application Performance Monitoring/User Experience Monitoring. Keeping an eye on individual user interactions will reveal performance and availability issues impacting your end users. At minimum you will be aware when particular services your application(s) offer are malfunctioning. At best, when [Plumbr](https://plumbr.io/) is being used, you are also zoomed in to the actual root cause in source code.


不幸的是，监视世界的最新技术无法提供任何灵丹妙药来揭示您在不同情况下所需的所有信息。 为典型的基于Web的应用程序部署的工具集应至少包括以下内容：

- 日志监控。应该汇总来自生产堆栈各个节点的日志，以便工程团队可以快速搜索信息，可视化日志并注册异常警报。最常用的解决方案之一是ELK堆栈，其中日志存储在 [Elasticsearch](http://www.elastic.co/) 中，并在 [Logstash](http://www.elastic.co/products/logstash) 中进行分析，并使用 [Kibana](http://www.elastic.co/products/kibana) 进行可视化。
- 系统监控。在基础架构中汇总和可视化系统级指标既有益又易于设置。密切关注CPU，内存，网络和磁盘的使用情况，可以发现系统级问题并注册异常警报。
- 应用程序性能监视/用户体验监视。密切关注单个用户的交互将揭示影响最终用户的性能和可用性问题。至少，您会知道您的应用程序提供的特定服务何时发生故障。充其量，当使用 [Plumbr](https://plumbr.io/) 时，还可以放大源代码中的实际根本原因。

## Take-away

Troubleshooting is a necessary evil. You cannot avoid it, so it is only fair that you are aware of the related problems. You cannot bypass the constraints posed by different environments nor can you make yourself an expert overnight.

Making sure you apply profiling in development and test your code before the release reduces the frequency of troubleshooting issues in production. Having transparency to your production deployment allows you to respond faster and in a predictable way whenever the two safety nets have failed.

## 带走

故障排除是必不可少的。 您无法避免，因此您知道相关问题是很公平的。 您无法绕过不同环境所带来的约束，也无法一夜之间成为专家。

确保在发布之前在开发中应用性能分析并测试代码，从而减少了生产中故障排除的频率。 当两个安全网出现故障时，对生产部署保持透明可让您以可预测的方式更快地做出响应。


<https://plumbr.io/blog/monitoring/why-is-troubleshooting-so-hard>
