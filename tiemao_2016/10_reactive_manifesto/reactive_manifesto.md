# 反应式系统宣言

##(The Reactive Manifesto)


Organisations working in disparate domains are independently discovering patterns for building software that look the same. These systems are more robust, more resilient, more flexible and better positioned to meet modern demands.

各个领域的不同组织都在追寻一种相同的软件构建模式。这种系统鲁棒性更好、更有弹性, 更加灵活, 也能更好地满足各种现代化的需求。


These changes are happening because application requirements have changed dramatically in recent years. Only a few years ago a large application had tens of servers, seconds of response time, hours of offline maintenance and gigabytes of data. Today applications are deployed on everything from mobile devices to cloud-based clusters running thousands of multi-core processors. Users expect millisecond response times and 100% uptime. Data is measured in Petabytes. Today's demands are simply not met by yesterday’s software architectures.


由于应用程序的需求在近年来发生了巨大的变化,所以软件构建也正在发生改变。前几年,一个大型应用程序会部署在几十台服务器上, 响应时间为秒级别, 通常需要几个小时的离线维护, 数据量一般也只有GB级。今天的系统分布在移动设备上,以及基于云的集群服务器上, 通常有成千上万的多核处理器。用户期望的响应时间是毫秒级别, 而且是100%的正常运行时间。数据以PB为单位。昨天的软件架构再也满足不了今天的需求。



We believe that a coherent approach to systems architecture is needed, and we believe that all necessary aspects are already recognised individually: we want systems that are Responsive, Resilient, Elastic and Message Driven. We call these Reactive Systems.


我们认为, 一个连贯的系统架构方法是必要的, 而且我们相信所有必要的方面已经得到大家的认可: 需要的系统具有 响应迅速(Responsive)、韧性(Resilient)、弹性(Elastic)以及 消息驱动(Message Driven)。我们称这样的系统为反应式系统(Reactive Systems)。



Systems built as Reactive Systems are more flexible, loosely-coupled and scalable. This makes them easier to develop and amenable to change. They are significantly more tolerant of failure and when failure does occur they meet it with elegance rather than disaster. Reactive Systems are highly responsive, giving users effective interactive feedback.

构建为反应式系统可以更加灵活、松耦合,而且是可伸缩的。这使得它们更容易开发和变更. 对于故障的容忍性更强, 当故障发生时能够从容应对, 而不是变成一场灾难。 反应式系统高度敏感,让用户有更有效的互动反馈。


### 反应式系统的特征:


Responsive: The system responds in a timely manner if at all possible. Responsiveness is the cornerstone of usability and utility, but more than that, responsiveness means that problems may be detected quickly and dealt with effectively. Responsive systems focus on providing rapid and consistent response times, establishing reliable upper bounds so they deliver a consistent quality of service. This consistent behaviour in turn simplifies error handling, builds end user confidence, and encourages further interaction.

**及时响应(Responsive)**: 系统采用及时响应的方式(如果可能的话)。响应性是可用性和效用的基石,但不止于此,响应性意味着问题可能会发现迅速和有效地处理。专注于提供快速响应系统和一致的响应时间,建立可靠的上界所以他们提供一致的服务质量。这种一致的行为反过来又简化了错误处理,建立终端用户的信心,并鼓励进一步互动。


Resilient: The system stays responsive in the face of failure. This applies not only to highly-available, mission critical systems — any system that is not resilient will be unresponsive after a failure. Resilience is achieved by replication, containment, isolation and delegation. Failures are contained within each component, isolating components from each other and thereby ensuring that parts of the system can fail and recover without compromising the system as a whole. Recovery of each component is delegated to another (external) component and high-availability is ensured by replication where necessary. The client of a component is not burdened with handling its failures.

**韧性(Resilient)**: 系统保持响应面对失败。这不仅适用于可用性,关键任务系统,任何系统不是弹性失败后将反应迟钝。弹性是通过复制、密封、隔离和代表团.失败是包含在每个组件中,互相隔离组件,从而确保系统的部分可以失败和恢复不影响系统作为一个整体.复苏的每个组件都是委托给另一个组件(外部)和高可用性是确保在必要时通过复制.组件的客户端没有承担处理失败。


Elastic: The system stays responsive under varying workload. Reactive Systems can react to changes in the input rate by increasing or decreasing the resources allocated to service these inputs. This implies designs that have no contention points or central bottlenecks, resulting in the ability to shard or replicate components and distribute inputs among them. Reactive Systems support predictive, as well as Reactive, scaling algorithms by providing relevant live performance measures. They achieve elasticity in a cost-effective way on commodity hardware and software platforms.

**弹性(Elastic)**: 不同工作负载下的系统都可以作出快速响应。反应式系统可以根据需要服务的量来动态增加或减少资源. 这意味着设计中没有争用点或者中央瓶颈, 具有分片能力或者组件复制, 并将输入分发给他们. 反应式系统支持预测, 以及反应性、通过动态性能措施提供相应的缩放算法. 他们以具有成本效益的方式实现弹性商品硬件和软件平台
。


Message Driven: Reactive Systems rely on asynchronous message-passing to establish a boundary between components that ensures loose coupling, isolation, location transparency, and provides the means to delegate errors as messages. Employing explicit message-passing enables load management, elasticity, and flow control by shaping and monitoring the message queues in the system and applying back-pressure when necessary. Location transparent messaging as a means of communication makes it possible for the management of failure to work with the same constructs and semantics across a cluster or within a single host. Non-blocking communication allows recipients to only consume resources while active, leading to less system overhead.

**消息驱动(Message Driven)**: 反应式系统依赖于异步消息传递, 来确定组件的边界, 确保松耦合(loose coupling)、隔离性(isolation)、位置透明性(location transparency), 并提供将错误代理为消息的手段。采用显式消息传递, 通过塑造和监测系统中的消息队列来支持负载管理, 弹性扩容(elasticity),和流量控制通过。

必要时和应用背压时必要的.位置透明的消息传递的通信使失败的管理工作具有相同结构和语义在集群或在一个主机.非阻塞通信允许收件人只消耗资源而活跃,导致更少的系统开销。


<img src="01_reactive-traits.svg" style="width: 600px;">




Large systems are composed of smaller ones and therefore depend on the Reactive properties of their constituents. This means that Reactive Systems apply design principles so these properties apply at all levels of scale, making them composable. The largest systems in the world rely upon architectures based on these properties and serve the needs of billions of people daily. It is time to apply these design principles consciously from the start instead of rediscovering them each time.

大型系统由小系统组成, 因此取决于其组成部分的反应特性. 这就是说 反应式系统()的设计原则应该应用到各个层级之中, 使得它们可以很好地进行组合. 世界上最大的系统需要依赖基于这些属性的架构, 并服务每天几十亿人的需要. 从一开始就应该有意识地应用这些设计原则, 而不要每次都等出问题了才知道这回事。


> **说明:** `Reactive System` 翻译为 `反应式系统`,如果需要精确一点的话则是 `快速反应式系统`。如有更恰当的词汇,请留言!


欢迎加入: [CNC开源组件开发交流群 316630025](http://jq.qq.com/?_wv=1027&k=Z4v6kn)


翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)


翻译日期: 2016年3月29日

原文日期: 2014年9月16日

原文链接: [http://www.reactivemanifesto.org/](http://www.reactivemanifesto.org/)





