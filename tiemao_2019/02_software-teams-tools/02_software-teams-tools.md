# Tools For Software Engineering Teams

# Web开发团队常备工具

The effect of poorly performing web applications echoes across various parts of the business. The more breakage there is, the more busy support teams get. There is less traction, and product teams are puzzled about user retention. Engineers are inundated with bug-fixes, leaving no time for feature development. Business stakeholders receive no insight into performance improvements. Engineering managers cannot clearly justify the efforts being taken. The list goes on. 


Web系统的性能问题会影响企业的各项业务。 

- 漏洞太多，运营团队就只能疲于奔命。 
- 缺少吸引力, 产品团队则会受困于用户留存率。
- 改不完的BUG, 开发团队就没时间进行新功能开发。
- 业务人员的效率跟着提升不上去。
- 技术经理不能清楚证明团队所做的努力是否合理。

类似的情形常常出现。

What are the available options to keep this risk at bay? The answer lies in providing your development team with the right kind of tools they can use to deal with common problems that arise from each stage in software development.

有什么方法可以避免这些风险呢? 工欲善其事必先利其器，我们需要引入一些趁手的工具，在项目开发的各个阶段。

## Planning tools

## 规划工具

The beginning of most software products/projects lies in planning and tracking development. Planning tools are used from the time a project begins until the time a project is under active development. Planning a project is the start of every iteration in cyclical project management followed in most places today. It is justified as helping herd cats, or prevent yak shaving. The most common tool is [Jira](https://www.atlassian.com/software/jira). There are a few alternatives too which engineering teams pick up based on their needs. 


大部分软件项目/产品都要先进行设计和规划、并且持续跟踪开发进度。规划工具跨越整个生命周期, 在今天的软件工程中，项目规划就是一个项目的开始。就像是合理的养猫(Herd Cats), 或者是阻止给牦牛剃毛(Yak Shaving)。 最常用的是[Jira](https://www.atlassian.com/software/jira) ，或者根据自身情况选择其他工具。

> Herd Cats，养猫, 不同的软件开发团队, 就像养猫一样, 非常难以管理; 几乎不可能组织起来。
> Yak Shaving，给牦牛剃毛，是一个编程术语，用来描述项目中看似无穷无尽的一系列小任务，必须完成这些小任务才能将项目推进到下一阶段。

## Version control tools

## 版本控制工具

Gone are the days when the person holding the rubber duck is the only one who can make changes to the source code. Version control is the first tool that every engineering team decides upon before anything else. Even among small teams or hobby projects with a single programmer, version control is employed. Engineering teams have a clear choice among [Git](https://git-scm.com/), Mercurial, and [Apache Subversion](https://subversion.apache.org/)provided by several vendors. There is immense maturity in the realm of version control, as a result of which teams know exactly what they’re getting into.

持有小黄鸭(rubber duck)才能修改代码的时代早已过去; 代码的版本控制是每个团队首先需要解决的问题。 即使是小型团队、甚至是单人团队, 版本控制都是必要的, 有句话说的好: “无版本、不编程！” 

比较成熟的工具包括 Git, SVN, Mercurial 等等。 当然现在Git是优先选择。

> Git的安装和使用, 请参考: <https://blog.csdn.net/renfufei/article/details/41647875>


## Testing tools

## 测试工具

Nearly every engineering team in the world that does web application development uses [Selenium](https://www.seleniumhq.org/) in their testing environment. When deployed using the [Robot Framework](http://robotframework.org/), a generic test automation setup is available for acceptance testing. It provides a powerful way of asserting if applications work, and gives a good sanity check for the laundry list of requirements. 


使用最广泛的是 [Selenium](https://www.seleniumhq.org/) 测试工具. 使用[Robot Framework](http://robotframework.org/) 进行部署时, 可以使用通用测试自动化设置进行验收测试。 它提供了一种强大的方式来断言应用程序是否有效，并为需求清单提供了良好的健全性检查。

## CI/CD tools

## CI/CD工具

> CI, Continuous integration, 持续集成
>
> CD, Continuous delivery, 持续交付
>
> 参考: [What is CI/CD?](https://www.infoworld.com/article/3271126/ci-cd/what-is-cicd-continuous-integration-and-continuous-delivery-explained.html) 

With a change in the way software was developed, it was only natural for the methods of software release to evolve as well. To facilitate faster release cycles, where teams released software more frequently, the CI/CD pipeline was conceived. This stands for the combined practices of continuous integration and continuous delivery. [Jenkins](https://jenkins.io/), [Travis](https://travis-ci.org/), and [CircleCI](https://circleci.com/) are among the most popular tools used by engineering teams to have functional CI/CD pipelines.

随着软件开发方式的改变，软件的发布方式自热也跟着发展。 为了促进更快的发布周期，团队想要更频繁地快速发布软件，则需要 CI/CD管道的方式。 这代表了持续集成和持续交付的综合实践。 [Jenkins](https://jenkins.io/), [Travis](https://travis-ci.org/), 和 [CircleCI](https://circleci.com/) 都是常流行的CI/CD工具。

## Configuration tools

## 配置工具

The fundamental goal of configuration tools is to manage large-scale infrastructure efficiently. Some of the ancillary goals are to minimize interference and input required from engineers and sysadmins, reduce complexity involved in configuring distributed infrastructure. [Ansible](https://www.ansible.com/) is the most prevalent tool, and alternatives like [Chef](https://www.chef.io/chef/), [Puppet](https://puppet.com/), and [Salt](https://www.saltstack.com/) are available too.

配置工具的基本目标, 是有效管理大规模的机器设备(infrastructure)。 另外还有一些目标, 包括尽量减少工程师/系统管理员的人工干预，降低配置分布式系统的复杂性。常用工具有 [Ansible](https://www.ansible.com/), 以及 [Chef](https://www.chef.io/chef/), [Puppet](https://puppet.com/), 以及 [Salt](https://www.saltstack.com/)。

## Monitoring tools

## 监控工具

This is a very scattered space at the moment. That said, there is enormous evolution happening with monitoring tools. Early monitoring tools began to inspect server parameters when software was released and used these as indicators of application health. Correlation existed between how the server held up and what a user experienced. This approach unfortunately raises more questions than it actually answers. Today, there is a shift in this paradigm owing to different evolutions in browsers, communication protocols, and other pieces. It is possible to record the experience of a user by attaching agents to the browser. 


监控领域相关的工具, 又多又杂, 而且一直在努力发展和迭代。
早期的监控工具, 只在系统发布时检查服务器参数，并将这些参数用作系统运行状况的指标。
服务器的健康状况保持，与用户体验之间存在相关性。杯具在于，这种方式下发生的问题比实际检测的要多。 
如今，随着浏览器、通信协议和其他方面的发展，这种模式发生了变化。已经为浏览器设置代理(agent)来记录用户的体验。

There is also a lot of effort invested in areas like log management, alerting, telemetry, and reporting in the name of monitoring. Some of these are valid. Logging security events, meaningful alerting, resource utilization are valuable parameters to track, but only if accompanied by a clear strategy of monitoring users. A handful of tools like [Zabbix](https://www.zabbix.com/), [Nagios](https://www.nagios.org/), and [Prometheus](https://prometheus.io/) are used by engineers, but none of them solve the problem of real-user monitoring.


这些年在日志管理、预警、遥测以及报告等领域投入了大量精力。其中一些是有效的。记录安全事件, 有意义的警报, 资源使用量等都是有价值的跟踪数据, 但前提是有一个清晰的策略来伴随用户体验的整个链路. 有一些工具, 比如 [Zabbix](https://www.zabbix.com/), [Nagios](https://www.nagios.org/), 以及 [Prometheus](https://prometheus.io/) 都被广泛使用, 但都没能解决实际用户体验的监控。

Simply investing in software will not help you mitigate your performance problems. There are many steps you need to take to be able to get there. It is not for the faint-hearted, or for the easily-distracted. Tuning web applications for good performance is a serious commitment and requires enormous effort to do well. It also demands discipline to maintain web applications that way. The returns that await teams who undertake this effort are huge!


只购买这些软件并不能缓解性能问题。 我们还需要采取各种措施，但这需要勇气、专注、和不懈的坚持。Web系统性能调优是一件很严肃的事情, 需要付出很多努力。 还需要严格遵守纪律。当然, 这项工作对团队的回报也是巨大的!

Please remember – performance is about people. About your users.

请记住 —— 性能问题的关键点是人, 也就是我们的用户。

We’re all united in our goal to make software faster, and provide a reliable digital user experience. There are many means to achieve this end, [Plumbr](https://www.plumbr.io/) being one among them. Plumbr provides a real-user monitoring system that provides performance insights based on the interactions of your users. [Sign up today for a free trial](http://app.plumbr.io/signup), and stay on top of performance issues faced by your users.


> 我们致力于更高的系统性能, 提供可靠的数字用户体验。 有很多方法可用于实现这一目标, 比如 [Plumbr](https://www.plumbr.io/) 。 喜欢的朋友可以注册: <http://app.plumbr.io/signup>


原文链接: <https://plumbr.io/blog/devops/tools-for-software-engineering-teams>

原文日期: 2018年12月19日

翻译日期: 2019年01月14日

翻译人员: 铁锚 - <https://blog.csdn.net/renfufei>

