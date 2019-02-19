# Tools For Software Engineering Teams

# Web开发团队常用软件介绍

The effect of poorly performing web applications echoes across various parts of the business. The more breakage there is, the more busy support teams get. There is less traction, and product teams are puzzled about user retention. Engineers are inundated with bug-fixes, leaving no time for feature development. Business stakeholders receive no insight into performance improvements. Engineering managers cannot clearly justify the efforts being taken. The list goes on. 


如果Web应用的性能不行, 就会影响到各种业务的开展。
如果系统漏洞很多, 运营团队就会疲于奔命. 
如果缺少各种监控数据, 产品经理可能会对用户行为困惑。

开发永远改不完的BUG, 自然没时间去进行性能优化. 
业务方更受不了响应迟钝的系统。
但项目经理却没有证据来表明整个团队做了哪些努力。

类似这样的情形经常会出现。

What are the available options to keep this risk at bay? The answer lies in providing your development team with the right kind of tools they can use to deal with common problems that arise from each stage in software development.

怎样控制和防范这些风险呢? 这就需要在项目过程中, 根据不同的阶段引入相应的工具。

## Planning tools

## 任务排期

The beginning of most software products/projects lies in planning and tracking development. Planning tools are used from the time a project begins until the time a project is under active development. Planning a project is the start of every iteration in cyclical project management followed in most places today. It is justified as helping herd cats, or prevent yak shaving. The most common tool is [Jira](https://www.atlassian.com/software/jira). There are a few alternatives too which engineering teams pick up based on their needs. 


大多数软件产品/项目从一开始就伴随着开发计划的发展变更。计划工具跨越整个项目开发周期, 从项目开始前, 到开发完成. 在大多数时候, 每个项目迭代都需要进行规划。可以是合理的硬核计划, 也可以是为了防止无限期拖延. 最常用的工具是[Jira](https://www.atlassian.com/software/jira)。 当然, 开发团队可以根据自身情况, 选择其他的工具。

## Version control tools

## 版本控制

Gone are the days when the person holding the rubber duck is the only one who can make changes to the source code. Version control is the first tool that every engineering team decides upon before anything else. Even among small teams or hobby projects with a single programmer, version control is employed. Engineering teams have a clear choice among [Git](https://git-scm.com/), Mercurial, and [Apache Subversion](https://subversion.apache.org/)provided by several vendors. There is immense maturity in the realm of version control, as a result of which teams know exactly what they’re getting into.

只准单人提代码的方式早已过时; 随着软件工程的规模越来越庞大, 版本控制工具对每个团队来说, 都是需要最先确定的。即便是小型团队或者个人开发者, 版本控制都是必须的选择, 有句话说的好: “无版本、不编程！” 

比较成熟的工具包括 Git, SVN, Mercurial 等等。 当然现在Git是最优先的选择。

> 关于Git, 请参考: <https://blog.csdn.net/renfufei/article/details/41647875>


## Testing tools

## 测试工具

Nearly every engineering team in the world that does web application development uses [Selenium](https://www.seleniumhq.org/) in their testing environment. When deployed using the [Robot Framework](http://robotframework.org/), a generic test automation setup is available for acceptance testing. It provides a powerful way of asserting if applications work, and gives a good sanity check for the laundry list of requirements. 


使用最广泛的测试工具是 [Selenium](https://www.seleniumhq.org/). 使用[Robot Framework](http://robotframework.org/) 进行部署时, 可用于验收测试的自动化测试配置就已经准备好了.  其提供了强大的断言功能, 并给出一个好的完整性检查清单。

## CI/CD tools

## CI/CD工具

> CI, Continuous integration, 持续集成
>
> CD, Continuous delivery, 持续交付
>
> 参考: [What is CI/CD?](https://www.infoworld.com/article/3271126/ci-cd/what-is-cicd-continuous-integration-and-continuous-delivery-explained.html) 

With a change in the way software was developed, it was only natural for the methods of software release to evolve as well. To facilitate faster release cycles, where teams released software more frequently, the CI/CD pipeline was conceived. This stands for the combined practices of continuous integration and continuous delivery. [Jenkins](https://jenkins.io/), [Travis](https://travis-ci.org/), and [CircleCI](https://circleci.com/) are among the most popular tools used by engineering teams to have functional CI/CD pipelines.

开发过程中随时会面临需求变更, 所以发布的方法也需要自然进化. 想要更快地频繁发布, 则需要 CI/CD管道的方式. 这与持续集成和持续交付的实践相结合。[Jenkins](https://jenkins.io/), [Travis](https://travis-ci.org/), 和 [CircleCI](https://circleci.com/) 都是常用的CI/CD工具。

## Configuration tools

## 配置工具

The fundamental goal of configuration tools is to manage large-scale infrastructure efficiently. Some of the ancillary goals are to minimize interference and input required from engineers and sysadmins, reduce complexity involved in configuring distributed infrastructure. [Ansible](https://www.ansible.com/) is the most prevalent tool, and alternatives like [Chef](https://www.chef.io/chef/), [Puppet](https://puppet.com/), and [Salt](https://www.saltstack.com/) are available too.

使用配置工具的根本目的, 是为了有效管理庞大规模的机器设施(infrastructure).  另外还有一些目标, 包括尽量减少工程师/系统管理员的人工干预, 降低分布式系统的配置复杂度等待。最常用的工具是 [Ansible](https://www.ansible.com/), 此外还有 [Chef](https://www.chef.io/chef/), [Puppet](https://puppet.com/), 以及 [Salt](https://www.saltstack.com/)。

## Monitoring tools

## 监控工具

This is a very scattered space at the moment. That said, there is enormous evolution happening with monitoring tools. Early monitoring tools began to inspect server parameters when software was released and used these as indicators of application health. Correlation existed between how the server held up and what a user experienced. This approach unfortunately raises more questions than it actually answers. Today, there is a shift in this paradigm owing to different evolutions in browsers, communication protocols, and other pieces. It is possible to record the experience of a user by attaching agents to the browser. 


监控领域相关的工具, 又多又杂, 而且一直在努力发展和进化。
早期的监控工具, 只在系统发布时监测服务器参数，并将这些参数作为系统健康状况的指标。
服务器环境与用户体验之间确实存在一些关联。杯具的是，这种方式下发生的问题比实际监控到的要多很多。 如今，随着浏览器、通信协议和其他方面的发展，这种模式发生了转变。已经可以在浏览器中增加一层agent来记录用户的体验。

There is also a lot of effort invested in areas like log management, alerting, telemetry, and reporting in the name of monitoring. Some of these are valid. Logging security events, meaningful alerting, resource utilization are valuable parameters to track, but only if accompanied by a clear strategy of monitoring users. A handful of tools like [Zabbix](https://www.zabbix.com/), [Nagios](https://www.nagios.org/), and [Prometheus](https://prometheus.io/) are used by engineers, but none of them solve the problem of real-user monitoring.

此外还有很多进步, 比如日志管理、预警、遥测以及监控报告。这都是有效的监控手段. 记录安全事件, 有意义的警报, 资源利用率, 都是有价值的跟踪数据, 但前提是有一个清晰的策略来伴随用户使用的整个链路. 有一些工具, 比如 [Zabbix](https://www.zabbix.com/), [Nagios](https://www.nagios.org/), and [Prometheus](https://prometheus.io/) 都有很多工程师, 但他们都没有解决用户真实体验相关的监测问题。

Simply investing in software will not help you mitigate your performance problems. There are many steps you need to take to be able to get there. It is not for the faint-hearted, or for the easily-distracted. Tuning web applications for good performance is a serious commitment and requires enormous effort to do well. It also demands discipline to maintain web applications that way. The returns that await teams who undertake this effort are huge!

只依赖这些软件并不能帮你解决性能问题。需要很多步骤来达成这个目标, 但需要勇气和坚持。调优Web系统性能是一件严肃的事, 需要付出很多努力. 还需要严格遵守纪律。当然, 对这些努力的汇报也是巨大的!

Please remember – performance is about people. About your users.

请记住 —— 性能问题最关键的是人, 也就是你的用户。

We’re all united in our goal to make software faster, and provide a reliable digital user experience. There are many means to achieve this end, [Plumbr](https://www.plumbr.io/) being one among them. Plumbr provides a real-user monitoring system that provides performance insights based on the interactions of your users. [Sign up today for a free trial](http://app.plumbr.io/signup), and stay on top of performance issues faced by your users.

> 我们的目标都是让系统跑得更快, 并提供一个可靠的用户体验。 有很多办法可以用于实现这一目的, 比如 [Plumbr](https://www.plumbr.io/) 就是其中之一. 喜欢的可以注册: [Sign up today for a free trial](http://app.plumbr.io/signup)。


原文链接: <https://plumbr.io/blog/devops/tools-for-software-engineering-teams>

原文日期: 2018年12月19日

翻译日期: 2019年01月14日

翻译人员: 铁锚 - <https://blog.csdn.net/renfufei>

