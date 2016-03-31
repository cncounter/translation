# 反应式系统宣言

##(The Reactive Manifesto)


Organisations working in disparate domains are independently discovering patterns for building software that look the same. These systems are more robust, more resilient, more flexible and better positioned to meet modern demands.

各个领域的不同组织都在追寻一种相似的软件构建模式。这种系统鲁棒性更好、更有韧性, 更加灵活, 也能更好地应对现代化开发的需求。


These changes are happening because application requirements have changed dramatically in recent years. Only a few years ago a large application had tens of servers, seconds of response time, hours of offline maintenance and gigabytes of data. Today applications are deployed on everything from mobile devices to cloud-based clusters running thousands of multi-core processors. Users expect millisecond response times and 100% uptime. Data is measured in Petabytes. Today's demands are simply not met by yesterday’s software architectures.


由于系统需求在近年来发生了巨大的改变, 所以软件开发方式也正在改变。前些年, 大型应用系统会部署在几十台服务器上, 响应时间为秒级, 通常还需要数小时的离线维护时间, 数据量一般也只是GB级。今天的系统分布在各种移动终端,服务端会部署云集群上, 通常会有上万个CPU核心在支持。用户需要的是毫秒级的响应速度, 而且是100%的正常服务时间。数据量则以PB为单位。过去的软件架构再也不能满足当今的各种需求。



We believe that a coherent approach to systems architecture is needed, and we believe that all necessary aspects are already recognised individually: we want systems that are Responsive, Resilient, Elastic and Message Driven. We call these Reactive Systems.


我们认为, 需要一种清晰的系统架构方法, 很多必要的特性已得到各自的认可: 我们想要的系统要具备 **响应迅速**(`Responsive`)、**韧性**(`Resilient`)、**弹性扩容**(`Elastic`) 以及 **消息驱动**(`Message Driven`) 等特征。我们把这样的系统称为 **反应式系统**(`Reactive System`)。



Systems built as Reactive Systems are more flexible, loosely-coupled and scalable. This makes them easier to develop and amenable to change. They are significantly more tolerant of failure and when failure does occur they meet it with elegance rather than disaster. Reactive Systems are highly responsive, giving users effective interactive feedback.

反应式系统可以更加灵活(flexible)、松耦合(loosely-coupled),而且是可扩展的(scalable)。 也使得这类系统更容易开发和应对需求变更。 对故障的容忍度更高, 故障发生时能从容应对, 而不会整个崩溃。 反应式系统响应迅速, 给用户更高效的交互体验。


### 反应式系统的四大特性:


Responsive: The system responds in a timely manner if at all possible. Responsiveness is the cornerstone of usability and utility, but more than that, responsiveness means that problems may be detected quickly and dealt with effectively. Responsive systems focus on providing rapid and consistent response times, establishing reliable upper bounds so they deliver a consistent quality of service. This consistent behaviour in turn simplifies error handling, builds end user confidence, and encourages further interaction.

**快速响应**(`Responsive`): 系统在各种情况下都会尽全力保证及时响应。响应性是可用性和实用性的基础, 此外,响应性还意味着问题能被迅速发现,并得到有效处理。反应式系统专注于提供快速和一致的响应时间,确立可靠的时间上限,以此来交付稳定质量的服务。这种一致的行为反过来又简化了错误处理，逐渐增强终端用户的信心，并且推动了进一步的交互。



Resilient: The system stays responsive in the face of failure. This applies not only to highly-available, mission critical systems — any system that is not resilient will be unresponsive after a failure. Resilience is achieved by replication, containment, isolation and delegation. Failures are contained within each component, isolating components from each other and thereby ensuring that parts of the system can fail and recover without compromising the system as a whole. Recovery of each component is delegated to another (external) component and high-availability is ensured by replication where necessary. The client of a component is not burdened with handling its failures.

**韧性**(`Resilient`): 系统在面临失败时依然保持快速响应。不仅对高可用系统,关键任务系统是这样; 所有不具备韧性的系统, 在失败后都不再具有快速响应特性。韧性是通过复制(replication)、封闭(containment)、隔离(isolation)和委托(delegation)来实现的. 失败被包含在单个组件中,将组建互相隔离, 使得系统在部分失败和恢复时,可以不影响整体功能. 每个组件的恢复都委托给另一个(外部)组件, 高可用是在必要时通过复制来保证的. 组件的客户端没有处理组件失败的负担。


Elastic: The system stays responsive under varying workload. Reactive Systems can react to changes in the input rate by increasing or decreasing the resources allocated to service these inputs. This implies designs that have no contention points or central bottlenecks, resulting in the ability to shard or replicate components and distribute inputs among them. Reactive Systems support predictive, as well as Reactive, scaling algorithms by providing relevant live performance measures. They achieve elasticity in a cost-effective way on commodity hardware and software platforms.

**可伸缩性**(`Elastic`,弹性扩容): 系统在不同的负载下都能保持快速响应。反应式系统可以根据服务的请求量, 动态地增加或减少相应的系统资源. 这表示,系统设计中没有竞争点(contention point)和中心瓶颈(central bottleneck), 通过分片和组件复制, 将请求分发给他们。 通过实时性能监测, 提供相应的缩放算法, 支持预测(predictive),伸缩算法, 确保其反应特性。 在商业的软件和硬件平台上, 以具有成本优势的方式实现了可伸缩性。
。


Message Driven: Reactive Systems rely on asynchronous message-passing to establish a boundary between components that ensures loose coupling, isolation, location transparency, and provides the means to delegate errors as messages. Employing explicit message-passing enables load management, elasticity, and flow control by shaping and monitoring the message queues in the system and applying back-pressure when necessary. Location transparent messaging as a means of communication makes it possible for the management of failure to work with the same constructs and semantics across a cluster or within a single host. Non-blocking communication allows recipients to only consume resources while active, leading to less system overhead.

**消息驱动**(`Message Driven`): 反应式系统依赖异步消息传递机制, 以确定各种组件的边界, 并确保松耦合(loose coupling)、隔离性(isolation)、位置透明性(location transparency), 并提供将错误封装为消息的手段。采用显式的消息传递, 通过监测系统中的消息队列, 以支持负载管理(load management), 弹性扩容(elasticity) 和流量控制(flow control)。必要时甚至可以采用背压(back-pressure)。 位置透明的消息传递机制, 使得对集群和单个主机的失败管理具有相同的结构和语义。非阻塞通信允许接收者只在活动时消耗资源，有效减少系统开销。


<img src="01_reactive-traits.svg" style="width: 600px;">




Large systems are composed of smaller ones and therefore depend on the Reactive properties of their constituents. This means that Reactive Systems apply design principles so these properties apply at all levels of scale, making them composable. The largest systems in the world rely upon architectures based on these properties and serve the needs of billions of people daily. It is time to apply these design principles consciously from the start instead of rediscovering them each time.

大系统由多个小系统组成, 因此也依赖于小系统的反应式特性. 也就是说,反应式系统的设计原则适用于各种规模级别的系统, 使它们可以很好地组合. 世界上最大的系统要依赖具备这种特性的架构, 以服务几十亿人的需求. 是时候应用这些设计原则了,而且是从一开始就有意识地运用, 而不是等有问题了才想到这些。


> **说明:** `Reactive System` 翻译为 `反应式系统`。如有更恰当的词汇,请留言!


快翻译完时百度搜索, 发现04年的一篇翻译: [http://www.ituring.com.cn/article/131783](http://www.ituring.com.cn/article/131783)


欢迎加入: [CNC开源组件开发交流群 316630025](http://jq.qq.com/?_wv=1027&k=Z4v6kn)


翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)


翻译日期: 2016年3月29日

原文日期: 2014年9月16日

原文链接: [http://www.reactivemanifesto.org/](http://www.reactivemanifesto.org/)





