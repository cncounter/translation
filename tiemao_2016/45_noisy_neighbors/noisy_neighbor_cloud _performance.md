# noisy neighbor (cloud computing performance)

# 谈谈云环境中的坏邻居效应

> noisy neighbor effect, 坏邻居效应, 指云环境中的资源争抢导致的性能问题。

有没有人觉得虚拟机和Docker是万能的？按量付费的公有云又便宜又划算？
但是一分钱一分货，也许是我们太天真了！
笔者碰到过很多次，阿里云的ECS服务器卡顿和性能问题。
所以最终还是要整理这篇晦涩的文章。

Noisy neighbor is a phrase used to describe a cloud computing infrastructure co-tenant that monopolizes bandwidth, disk I/O, CPU and other resources, and can negatively affect other users' cloud performance. The noisy neighbor effect causes other virtual machines and applications that share the infrastructure to suffer from uneven cloud network performance.

计算机领域有一个术语叫坏邻居(noisy neighbor), 用来描述云计算环境中, 有些客户大量抢占共享资源的行为，比如网络带宽, 磁盘I/O、CPU以及其他资源；
坏邻居效应, 会影响共享基础设施的虚拟机/容器/应用，造成性能下降，遭受云环境性能抖动的困扰。


The cloud is a multi-tenant environment, which means that a single architecture hosts multiple customers' applications and data. The noisy neighbor effect occurs when an application or virtual machine uses the majority of available resources and causes network performance issues for others on the shared infrastructure.

云环境就是一种多租户环境, 同一基础设施（物理机）会分配给多个客户来运行程序/存储数据。
坏邻居效应产生的原因, 是某个虚拟机/应用霸占了大部分的可用资源, 继而影响其他客户。


A lack of bandwidth is one cause of network performance issues. Bandwidth carries data throughout a network, so when one application or instance uses too much, other applications suffer from slow speeds or latency. Noisy neighbor can affect Web hosting, databases, networks, storage and servers.

带宽不足是网络性能问题的主要原因。 网络上传输数据的速度，主要取决于带宽的大小。
如果某个应用实例挤占了太多的网络资源, 可能会让其他用户遭受网络延迟和网速下降。
当然，不仅是网络，坏邻居还会影响虚拟机、容器、数据库、网络、存储以及其他云服务。


One way to avoid the noisy neighbor effect is to use a bare-metal cloud. The bare-metal cloud runs one application at a time directly on the hardware, which creates a single-tenant environment and eliminates noisy neighbors. While single-tenant environments avoid the noisy neighbor effect, they do not solve the problem. Infrastructure over-commitment, or when an environment is shared by too many applications, limits overall cloud performance.

有一种避免坏邻居效应的方法, 是使用裸机云(bare-metal cloud). 裸机云在硬件上直接运行一个应用, 相当于创建了一个单租户环境, 所以能消除坏邻居。虽然单租户环境避免了坏邻居效应, 但并没有解决根本问题。 超卖(over-commitment),或者共享给太多的租户, 都会限制整个云环境的性能。



Another way to avoid noisy neighbors in the cloud is to ensure an application receives the necessary resources by moving workloads across physical servers. In addition, storage quality of service (QoS) controls a VM's input/output operations per second (IOPS), which can limit the noisy neighbor effect. Set IOPS limits can control the amount of resources each VM receives. Therefore, no single VM, application or instance monopolizes resources and hinders the performance of others.

另一种避免坏邻居效应的方法, 是通过在物理机之间进行动态迁移, 以保障每个客户获得必要的资源. 此外, 还可以通过 存储服务质量保障(QoS, quality of service)控制每个虚拟机的 IOPS, 来限制坏邻居效应. 通过 IOPS 来限制每个虚拟机使用的资源量, 就不会造成某个客户的虚机/应用/实例去挤占其他客户的资源/性能。




# Eliminating Noisy Neighbors in the Public Cloud

# 避开公有云之中的坏邻居效应


An IaaS provider is using all-SSD arrays and storage QoS to ensure that some tenants can’t disrupt performance of others by overconsuming resources.

IaaS 厂商(虚机服务提供商)使用纯SSD磁盘组(all-SSD arrays),以及存储 QoS 来确保不会因为某些恶意用户的过度消费,而影响其他客户的服务性能。


One problem with multitenant public cloud environments is the "noisy neighbor" phenomenon, when one or more customers monopolize available resources and thus significantly degrade the performance of other customers' systems.

在多租户的公有云环境中,会存在一种严重的问题, 称为 "坏邻居效应"(noisy neighbor phenomenon), 当一个或多个客户过度使用了某种公共资源时, 就会明显损害到其他客户的系统性能。


One way to address this problem is via storage-based quality of service that provides defined service levels to all tenants. An infrastructure-as-a-service provider, CloudSigma, is using all-SSD arrays from SolidFire to create an architecture to eliminate noisy neighbors.

有一种解决方案,是通过基于存储的服务质量,为所有租户提供服务等级协议。IaaS厂商 CloudSigma, 使用 SolidFire 的纯固态硬盘组创建了一个能消除坏邻居效应的架构。


CloudSigma has decided to replace all of its Tier 1 primary storage hard disk arrays with SolidFire all-SSD arrays. In addition to this significant move, the company also offers solid-state drive storage at the same price as hard disk for the same capacity. How can CloudSigma do this when flash memory is more expensive on a per-unit basis than hard disk?

CloudSigma 决定用SolidFire的全SSD磁盘组来替代所有的一级主存储阵列. 此外, 该公司还提供和普通硬盘同容量同价格的固态硬盘. CloudSigma 为什么能用比硬盘昂贵得多的闪存来提供服务呢?


An all-flash array can have better economics than an all-disk storage array in private data centers when taking into account the total system, including servers, storage and software (especially software licensing costs), as attested to by IBM based on a Wikibon study. IaaS does not have all the software licensing cost advantage, but CloudSigma overcomes the loss leader costs of storage by selling more compute cycles.

在考虑整个系统（包括服务器、存储和软件, 尤其是软件许可成本）时, 全闪存阵列(all-flash array)在私有数据中心中可能比全磁盘存储阵列具有更好的经济性, 这一点已由 IBM 基于 Wikibon 的研究所证实。IaaS 并不具备全部软件许可成本方面的优势, 但 CloudSigma 通过销售更多的计算周期来弥补存储在亏损引流(loss leader)上的成本。


CloudSigma's profit margins on consumption of computing resources are greater than that of storage. Key customers, such as big science in Europe and big media in the United States, have burst requirements. Being able to house all of a big data set on SSD improves performance, which means things get done in a more timely (that is, valuable) manner, and the compute fees go to CloudSigma instead of to a competitor.

CloudSigma 在计算资源消耗上的利润率高于存储。一些关键客户, 例如欧洲的大型科研机构和美国的大型传媒公司, 存在突发性(burst)需求。能够将整个大数据集存放在 SSD 上可以提升性能, 这意味着任务能更及时地(也就是更有价值地)完成, 而计算费用也会流向 CloudSigma, 而不是竞争对手。


But the burst requirements of some customers may create noisy-neighbor problems for subscription customers with more traditional storage provisioning needs. CloudSigma needed an SSD-array supplier that could solve this noisy-neighbor QoS problem, and so it turned to SolidFire.

但是, 部分客户的突发性需求可能会给存储配置需求更传统的订阅客户带来坏邻居(noisy-neighbor)问题。CloudSigma 需要一家能够解决这一 noisy-neighbor QoS 问题的 SSD 阵列供应商, 于是它选择了 SolidFire。


Solving the Noisy-Neighbor Problem

解决 Noisy-Neighbor 问题


With an IT product like a storage array, architecture encompasses both the hardware and software components that give the product its character and style. For example, an enterprise-class disk array is more than a just-a-bunch-of-disks offering. Among other features, it contains a controller that has one or more processors running a specialized operating system and software algorithms that manage RAM cache to improve overall performance.

对于存储阵列这样的 IT 产品而言, 架构涵盖了赋予产品个性与风格的硬件和软件组件。例如, 企业级磁盘阵列远不止是"一堆磁盘"(just-a-bunch-of-disks)。除其他特性外, 它还包含一个控制器, 控制器上有一个或多个处理器, 运行着专门的操作系统和软件算法, 通过管理 RAM 缓存来提升整体性能。


SolidFire's SF3010 and SF6010 appliances are controller-less, all-flash arrays where one node is 1U high, for an effective capacity of 12 Tbytes (with 10 128-Gbyte drives in an SF3010) and 24 Tbytes (with 256-Gbyte drives in an SF6010). The company's scale-out clustered architecture enables a single cluster of appliances to scale to more than 2 petabytes of effective capacity.

SolidFire 的 SF3010 和 SF6010 设备是无控制器的全闪存阵列, 每个节点高 1U, 有效容量为 12 Tbytes(在 SF3010 中配备 10 块 128 Gbyte 的驱动器)和 24 Tbytes(在 SF6010 中配备 256 Gbyte 的驱动器)。该公司横向扩展(scale-out)的集群架构使单台设备组成的集群能够扩展到超过 2 petabytes 的有效容量。


But the true power of SolidFire resides in its Element operating system, which manages all the functions of the array. That includes SolidFire Helix data protection to manage device failure without performance impact (a key element in meeting QoS commitments). SolidFire software also offers thin provisioning, deduplication and compression to get the most out of the available storage. For example, thin provisioning is necessary for elasticity in the cloud as allocated, but not-yet-used system resources, such as IOPS and gigabytes, can be made available on demand for peak load (that is, burst) requirements.

但 SolidFire 的真正威力在于其 Element 操作系统, 它管理着阵列的所有功能。其中包括 SolidFire Helix 数据保护, 可在不影响性能的情况下应对设备故障(这是履行 QoS 承诺的关键要素)。SolidFire 软件还提供精简配置(thin provisioning)、重复数据删除和压缩, 以充分利用可用的存储空间。例如, 精简配置对于云中的弹性是必要的, 因为已分配但尚未使用的系统资源(如 IOPS 和 GB 容量)可以按需提供, 以满足峰值负载(即突发)需求。


In a CloudSigma cloud, customers purchase both the gigabytes and IOPS necessary for a guaranteed minimum performance level for applications as a whole (and not just for the 5% of data that is traditionally considered performance-sensitive). This delivers predictable performance, but also means that SolidFire has to have some mechanisms that eliminate potential noisy-neighbor threats. The company achieves this through balanced load distribution, which eliminates hot spots that create unpredictable latency and performance virtualization that enables on-demand control of performance independent of capacity, as well as fine-grain volume control.

在 CloudSigma 的云中, 客户需要同时购买 GB 容量和 IOPS, 以保证应用整体上的最低性能水平(而不仅仅是针对传统上被认为对性能敏感的那 5% 数据)。这带来了可预测的性能, 但也意味着 SolidFire 必须具备一些机制来消除潜在的坏邻居威胁。该公司通过均衡的负载分布来实现这一点, 消除会产生不可预测延迟的热点; 同时通过性能虚拟化实现独立于容量的按需性能控制, 以及细粒度的卷(volume)控制。


Key to all this is the use of a REST-based API that delivers multitenant provisioning, reporting and performance isolation. The key word is "isolation." Each cloud tenant needs to be assured that its reserved resources will be available as guaranteed. That means SolidFire has to find the necessary physical resources when they are needed, even though the customer has been allocated resources on a physical basis.

这一切的关键在于使用基于 REST 的 API, 它提供多租户的资源配置(provisioning)、报告和性能隔离。关键词是"隔离"。每个云租户都需要确信其预留的资源会如承诺般可用。这意味着, 即使客户是在物理层面被分配资源的, SolidFire 也必须在需要时找到必要的物理资源。


Altogether, SolidFire delivers not only predictable performance but also the necessary reliability, data protection and security characteristics that enable the running of business- and mission-critical applications. Though a number of enterprises might not want to entrust those systems to a public cloud, SolidFire's offerings make that decision based on reasons other than technology considerations. And CloudSigma's customer base, which includes CERN (a stickler when it comes to technology and security requirements), would argue that not everyone feels that way.

总而言之, SolidFire 不仅提供可预测的性能, 还提供必要的可靠性、数据保护和安全特性, 从而能够运行关键业务和关键任务应用。尽管不少企业可能不愿将这类系统托付给公有云, 但 SolidFire 的产品让这一决定建立在技术考量之外的原因之上。而 CloudSigma 的客户群(其中就包括 CERN —— 在技术和安全要求方面极为严苛)则会认为, 并非人人都持那种看法。


Note also that the level of guaranteed QoS SolidFire promises is difficult, if not impossible, to achieve with all-hard disk arrays, mainly because they are electromechanical products versus an all-electronic SSD array. Rather than getting into details, suffice to say that managing available IOPS is more straightforward with SSDs than with hundreds or thousands of moving actuator arms. And that's one reason that all-flash arrays will eventually prevail over all-disk arrays when QoS is a strict requirement.

还要注意, SolidFire 所承诺的 QoS 保证水平, 对全硬盘阵列来说即便不是不可能, 也是很难达到的, 主要因为它们是与全电子式 SSD 阵列相对的机电式产品。这里不深入细节, 只需说明: 在 SSD 上管理可用 IOPS 比在成百上千个移动的磁头臂(actuator arm)上要直接得多。这也是当 QoS 成为严格要求时, 全闪存阵列最终会胜过全磁盘阵列的原因之一。


Mesabi Musings

Mesabi沉思


The IT industry does not officially declare "The Year of..." awards, but if it did for storage, 2013 might be called "The Year of All-Flash Arrays." IBM in its recently announced flash initiative stood as a "Good Housekeeping Seal of Approval" for all-flash arrays in data centers based on a purely economic analysis.

IT 行业并不会正式宣布"……之年"(The Year of...)之类的奖项, 但若要为存储领域评选, 2013 年或许可以被称为"全闪存阵列之年"。IBM 在其最近公布的闪存计划中, 基于纯粹的经济分析, 为数据中心采用全闪存阵列充当了"好管家认证印章"(Good Housekeeping Seal of Approval)。


CloudSigma and SolidFire have extended that point to public cloud infrastructures. In a multitenant cloud, economics is a critically important consideration, of course, but so is being able to provide a guaranteed QoS. Without predictable performance (and that's not just for performance-sensitive data, but all data on a day-to-day basis), customers cannot commit to a public cloud.

CloudSigma 和 SolidFire 将这一观点延伸到了公有云基础设施。在多租户云中, 经济性当然是一个至关重要的考量因素, 但能否提供有保证的 QoS 同样重要。如果没有可预测的性能(而且这不仅针对性能敏感的数据, 也包括日常的所有数据), 客户就无法放心地采用公有云。


SolidFire eliminates the noisy-neighbor QoS problem, and CloudSigma attests to the technical and economical value of this approach with its full commitment to all-SSD SolidFire arrays for primary storage. To achieve this, SolidFire has created a sophisticated architecture that provides differentiation in the same sense that an enterprise-class disk array is much more than just a bunch of disks. From an economic performance and QoS manageability perspective, all-flash arrays now command the high ground for Tier 1 primary storage arrays.

SolidFire 消除了 noisy-neighbor 的 QoS 问题, 而 CloudSigma 将其主存储全面采用全 SSD 的 SolidFire 阵列, 也印证了这种方案在技术和经济上的价值。为此, SolidFire 打造了一套精密的架构, 其差异化程度就如同企业级磁盘阵列远不止是一堆磁盘一样。从经济性能和 QoS 可管理性的角度来看, 全闪存阵列如今已占据了一级主存储阵列的制高点。


We all knew that flash's time was coming; what should be apparent to all is that time is now.

我们都知道,闪存大放光彩的时代到来了,当然,现在就是。


Neither CloudSigma nor SolidFire is a client of David Hill and the Mesabi Group.


CloudSigma 和 SolidFire 都不是 David Hill 及 Mesabi Group 的客户。



## Cloud storage providers moving to all-flash platform

## 云存储提供商转向全闪存平台

> Colm Keegan explains why some cloud storage providers are moving to an all-flash platform and how bursting workloads into an all-flash cloud can reduce costs.

> Colm Keegan 解释了为什么一些云存储提供商正在转向全闪存平台, 以及将工作负载突发(burst)到全闪存云如何能够降低成本。

Cloud performance. It's perceived by many to be the soft underbelly of the cloud service provider industry. And it's one of the main reasons that businesses today are resisting the move to deploy their mission-critical applications into the cloud.

云性能。许多人认为它是云服务提供商行业的软肋。这也是当今企业抗拒将关键任务应用部署到云中的主要原因之一。

In this tip, you will learn what some cloud storage providers are doing to help guarantee application performance while mitigating the risk of resource contention within their multi-tenant infrastructures. You will also learn the types of questions you can ask a prospective cloud storage provider to see if it's up to the task of managing your business systems.

在本篇技巧(tip)中, 你将了解到一些云存储提供商正在采取哪些措施, 以帮助保证应用性能, 同时降低其多租户基础设施内资源争用的风险。你还将了解到可以向潜在云存储提供商提出哪些类型的问题, 以判断它能否胜任管理你的业务系统这一任务。

### All flash, all the time?

### 全闪存, 一直全闪存?

Some cloud storage providers have designed their [storage infrastructure](http://searchcloudstorage.techtarget.com/definition/cloud-storage-infrastructure)with all-flash storage arrays to, in effect, guarantee that all application workloads will have access to blazing-fast storage resources. But the obvious question is one of cost. Compared to conventional [hard disk drives](http://searchstorage.techtarget.com/definition/hard-disk-drive)(HDDs), flash carries a significant premium. And if only a relatively small percentage of data needs flash access, isn't it likely that businesses would be overpaying for the luxury of deploying into an all-flash environment?

一些云存储提供商已经设计了他们的存储基础设施(http://searchcloudstorage.techtarget.com/definition/cloud-storage-infrastructure), 配备全闪存存储阵列, 实际上是为了保证所有应用工作负载都能访问到极快的存储资源。但显而易见的问题是成本。与传统硬盘驱动器(http://searchstorage.techtarget.com/definition/hard-disk-drive)(HDD)相比, 闪存带有明显的溢价。如果只有相对较小比例的数据需要闪存访问, 那么企业为部署到全闪存环境而过度付费, 岂不是很有可能?

Interestingly, to attract clients that might otherwise be reluctant to commit to the higher premiums of operating in an [all-flash storage infrastructure](http://searchsolidstatestorage.techtarget.com/essentialguide/Flash-storage-Guide-to-enterprise-all-flash-storage-arrays); some cloud storage providers are offering flash capacity at the same cost as conventional HDD space. The provider, in effect, uses flash storage as a loss leader, then makes up for it in CPU consumption. So, those businesses running heavy application workloads in their cloud will accrue higher monthly costs than a business will that has sporadic application activity.

有趣的是, 为了吸引那些原本可能不愿为在全闪存存储基础设施(http://searchsolidstatestorage.techtarget.com/essentialguide/Flash-storage-Guide-to-enterprise-all-flash-storage-arrays)中运行的更高溢价买单的客户, 一些云存储提供商以与传统 HDD 空间相同的价格提供闪存容量。实际上, 提供商将闪存存储当作亏损引流商品(loss leader), 然后通过 CPU 消耗来弥补这部分成本。因此, 那些在云中运行繁重应用工作负载的企业, 每月成本会比应用活动零星的企业更高。

### **Noisy neighbor nuisance

### 吵闹的邻居之扰

While flash is capable of driving much higher I/O throughput rates than spinning media can, all-flash arrays are equally vulnerable to the [noisy neighbor](http://storageswiss.com/2013/12/20/what-is-a-noisy-neighbor/) issues that often plague heavily virtualized environments. A noisy neighbor is when a rogue virtual machine monopolizes the storage I/O resources to the performance detriment of the other VMs in the environment. To circumvent this problem, some cloud storage providers are deploying [all-flash arrays](http://searchsolidstatestorage.techtarget.com/definition/Flash-array), such as SolidFire's platform, that have built-in storage I/O quotas that can be set at an individual VM layer.

虽然闪存能够带来远高于旋转介质(spinning media)的 I/O 吞吐率, 但全闪存阵列同样容易受到[坏邻居](http://storageswiss.com/2013/12/20/what-is-a-noisy-neighbor/)问题的困扰, 而这个问题在高度虚拟化的环境中尤为常见。所谓坏邻居, 就是指某个"流氓"虚拟机独占了存储 I/O 资源, 从而损害环境中其他虚拟机的性能。为了规避这个问题, 一些云存储提供商正在部署[全闪存阵列](http://searchsolidstatestorage.techtarget.com/definition/Flash-array)(例如 SolidFire 的平台), 它们内置了可以在单个虚拟机层面设置的存储 I/O 配额。

Large enterprise environments and cloud storage providers, in particular, need this level of management detail to ensure that storage I/O resources are assigned to those applications that have the highest demand for them. This can help ensure that each virtualized application tenant in the environment will always have access to a predetermined number of storage IOPS and prevent rogue VMs from upsetting the virtualized infrastructure applecart.

特别是大型企业环境和云存储提供商, 需要这种级别的管理细节, 以确保存储 I/O 资源被分配给需求最高的那些应用。这有助于确保环境中的每个虚拟化应用租户始终能获得预定数量的存储 IOPS, 并防止流氓虚拟机打乱虚拟化基础设施的布局(applecart)。

### **Variable service level support

### 可变的服务级别支持

These types of flash systems allow the provider to set up various service levels -- platinum, gold, silver, bronze, for example -- and then allocate resources based on the customer's application storage I/O throughput needs. But predicting application performance needs can be an inexact science. As is stated in any financial prospectus, past performance is no indicator of what future performance will be. So, a good question to ask a prospective cloud storage provider is whether they can dynamically handle moving between various service levels on the fly. In other words, if your application is set to a gold service level and is assigned a fixed number of IOPS, what happens when performance spikes and you need to suddenly change to a platinum service level? Likewise, how can you drop back down to gold or silver, when application performance demands vacillate over time?

这类闪存系统允许提供商设置各种服务级别——例如白金、金、银、铜——然后根据客户的应用程序存储 I/O 吞吐量需求来分配资源。但预测应用性能需求可能是一门并不精确的科学。正如任何金融招股说明书都会说的那样, 过往表现并不能预示未来的表现。因此, 向潜在云存储提供商提出的一个好问题是: 他们能否动态处理在各类服务级别之间灵活切换。换句话说, 如果你的应用被设置为金级服务并分配了固定数量的 IOPS, 当性能出现峰值、你需要突然切换到白金级服务时该怎么办?同样, 当应用程序性能需求随时间波动时, 你又如何降回金级或银级?

### **Testing the waters

### 试水

Some of the early adopters of heavy computational workload computing in the cloud are big governmental and scientific agencies that need auxiliary computing and storage space to process enormous volumes of data. Think of the Large Hadron Collider in Geneva, where simulations of the Big Bang are taking place. Processing the output from these experiments requires enormous computational power and as a result, institutions like these are bursting workloads into the cloud to help speed the time it takes to process the output from these experiments.

云中重型计算工作负载的一些早期采用者, 是需要辅助计算和存储空间来处理海量数据的政府机构和大型科研机构。想想日内瓦的大型强子对撞机(LHC), 那里正在进行大爆炸的模拟。处理这些实验的输出需要巨大的计算能力, 因此这类机构将工作负载突发(burst)到云中, 以帮助加快处理实验输出的时间。

Bursting application workloads into the cloud is a good way for businesses to test-drive cloud application provider services. For example, application owners can deploy a nonproduction instance of a heavily utilized database in the cloud and simulate peak activity to see how well the application performs. In fact, some companies like Load DynamiX have virtual testing appliances that can simulate application workloads and run them in the cloud to help IT planners determine exactly what their storage I/O throughput rates need to be. Then the virtual appliance can generate the load to see if the cloud provider's infrastructure is up to the task.

将应用工作负载突发到云中, 是企业试驾(test-drive)云应用提供商服务的一种好方式。例如, 应用所有者可以在云中部署一个高频使用数据库的非生产(nonproduction)实例, 并模拟峰值活动, 以观察应用的表现如何。事实上, 像 Load DynamiX 这样的公司拥有虚拟测试设备, 可以模拟应用工作负载并在云中运行, 帮助 IT 规划人员准确确定其存储 I/O 吞吐率需要达到多少。随后虚拟设备可以生成负载, 以检验云提供商的基础设施能否胜任。

The all-flash cloud storage service provider could offer some interesting capabilities for those businesses that need a storage performance pressure relief valve. With many businesses mandating their IT organizations to cut costs and reduce capital spending, IT planners need to find creative ways to satisfy business needs without breaking the bank. By selectively bursting critical business application workloads into the cloud, it is possible to meet application service levels and keep costs in check. The key, however, is to make sure your provider has the ability to meet your needs as they change over time.

对于那些需要一个存储性能"减压阀"的企业来说, 全闪存云存储服务提供商可以提供一些有趣的能力。在众多企业要求其 IT 组织削减成本、减少资本支出的大环境下, IT 规划人员需要找到有创意的方式来满足业务需求, 又不至于花费过高(without breaking the bank)。通过有选择地将关键业务应用工作负载突发到云中, 就有可能既满足应用的服务级别, 又控制住成本。然而关键在于, 要确保你的提供商有能力随着需求随时间变化而满足你的需要。

------

------

# Bare-metal cloud means more flexibility at a cost

# 裸机云意味着更大的灵活性, 但代价不菲

## Businesses face the challenge of finding the right cloud for their needs. With the ability to customize software for unique app requirements, bare-metal cloud may be the best option.

## 企业面临的挑战是为自身需求找到合适的云。凭借针对独特应用需求定制软件的能力, 裸机云可能是最佳选择。

In a crowded cloud market, differentiation is everything. Cloud service providers seek common themes to generate new customers and grow revenue. Bare-metal cloud is one such differentiator, offering flexibility and the ability to host high-performance applications. But is it right for your enterprise?

在拥挤的云市场中, 差异化就是一切。云服务提供商寻找共同的主题来获取新客户、增加收入。裸机云就是这样一个差异化因素, 它提供了灵活性和承载高性能应用的能力。但它适合你的企业吗?

Unlike typical cloud services, bare-metal clouds come with hardware, not software. It has no operating system (OS), virtualization or applications. Enterprises need to configure the cloud platform themselves, which has its advantages and disadvantages.

与典型的云服务不同, 裸机云提供的是硬件, 而不是软件。它没有操作系统(OS)、虚拟化或应用程序。企业需要自行配置云平台, 这既有优点也有缺点。

Flexibility is one major advantage of bare-metal cloud's customization. Businesses with unique application requirements can configure the platform to meet their specific needs. Because of how the server is sequestered, bare-metal cloud can also offer better performance than traditional cloud services. Research shows that [bare-metal cloud servers](http://searchcloudcomputing.techtarget.com/news/2240203392/Bare-metal-servers-in-the-cloud-aid-performance-compliance) run 10% to 50% faster than hypervisor-based, multi-tenant cloud platforms.

灵活性是裸机云定制化的主要优势之一。具有独特应用需求的企业可以配置平台来满足其特定需求。由于服务器是隔离的, 裸机云还能提供比传统云服务更好的性能。研究表明, [裸机云服务器](http://searchcloudcomputing.techtarget.com/news/2240203392/Bare-metal-servers-in-the-cloud-aid-performance-compliance)比基于 hypervisor 的多租户云平台快 10% 到 50%。

With multi-tenant cloud, companies put multiple virtualized workloads on a shared physical server to increase overall resource use. However, different apps compete for the same processor and memory resources. The worst-case scenario is that computing resources are not available when needed.

在多租户云中, 企业将多个虚拟化工作负载放在同一台共享物理服务器上, 以提高整体资源利用率。然而, 不同的应用会争夺相同的处理器和内存资源。最坏的情况是, 需要时计算资源却不可用。

Virtualizing cloud workloads also takes a toll on performance. Hypervisor tax is the amount of processing capacity the hypervisor layer consumes. Despite virtualization, service providers improved the software layer to make it thinner. But hypervisors still consume a percentage of the server's available processing power. The tax negatively affects performance for workloads that require large amounts of capacity.

虚拟化云工作负载也会对性能造成损耗。Hypervisor 税(Hypervisor tax)指的是 hypervisor 层所消耗的处理能力。尽管服务提供商通过改进软件层使其更薄, 但 hypervisor 仍会消耗服务器可用处理能力的一定比例。这种损耗会对需要大量处理能力的工作负载产生负面影响。

The hypervisor, like each additional software layer, delays the system. Even though these delays are only milliseconds, they create problems with high-I/O, sensitive workloads.

hypervisor 就像每一个额外的软件层一样, 会给系统带来延迟。尽管这些延迟只有几毫秒, 却会给高 I/O、敏感型工作负载带来问题。

In a shared cloud service, workloads fluctuate; slower application response times occur when an app encounters a [noisy neighbor](http://searchaws.techtarget.com/news/2240209703/AWS-fends-off-bouncy-cloud-computing-performance-perception) or another customer gobbling up system resources. Bare-metal cloud only runs one application, which eliminates the noisy neighbor issue.

在共享云服务中, 工作负载会波动; 当某个应用遇到[吵闹的邻居](http://searchaws.techtarget.com/news/2240209703/AWS-fends-off-bouncy-cloud-computing-performance-perception), 或者另一个客户大量吞噬系统资源时, 应用响应时间就会变慢。裸机云只运行一个应用, 从而消除了坏邻居问题。

Bare-metal cloud also enables rapid deployment. Bare-metal servers can be deployed quickly because they lack much of the infrastructure software.

裸机云还支持快速部署。裸机服务器之所以能够快速部署, 是因为它们缺少大部分基础设施软件。

### ****Application use cases for bare-metal cloud**

### 裸机云的应用用例

High-volume, high-performance workloads and [big data applications](http://searchcloudcomputing.techtarget.com/news/2240219702/Cloud-based-data-analytics-levels-the-BI-playing-field) are suited to bare-metal deployments. These apps are disk I/O-intensive, so traditional servers and storage systems struggle to keep up with these high volume and velocity requests.

大容量、高性能的工作负载以及[大数据应用](http://searchcloudcomputing.techtarget.com/news/2240219702/Cloud-based-data-analytics-levels-the-BI-playing-field)适合裸机部署。这些应用是磁盘 I/O 密集型的, 因此传统的服务器和存储系统难以跟上这种高容量、高速度的请求。

Media encoding for user-generated content, such as social networking and video sharing, is a good application to run on a bare-metal cloud. When a user uploads a video, it must be transcoded into a common format for viewing. Transcoding software for audio and video is processor-intensive, which degrades performance if it's located on the same machine as the Web server or used in a multi-tenant environment.

针对用户生成内容(如社交网络和视频分享)的媒体编码, 很适合在裸机云上运行。当用户上传视频时, 必须将其转码为一种通用格式以便观看。音频和视频的转码软件是处理器密集型的, 如果它与 Web 服务器位于同一台机器上, 或在多租户环境中使用, 就会降低性能。

[Compliance regulations](http://searchcloudcomputing.techtarget.com/feature/Understanding-ITs-role-in-cloud-security-and-compliance) also push certain enterprises to use bare-metal clouds. Verticals such as finance, government and healthcare must follow strict guidelines for storing, managing and sharing data. Shared infrastructure, such as public cloud, creates uncertainty regarding data security because the customer does not control the infrastructure or the other apps. A bare-metal cloud gives enterprise IT more control over the data center infrastructure.

[合规法规](http://searchcloudcomputing.techtarget.com/feature/Understanding-ITs-role-in-cloud-security-and-compliance)也促使某些企业使用裸机云。金融、政府和医疗等垂直行业必须遵循严格的准则来存储、管理和共享数据。像公有云这样的共享基础设施会带来数据安全方面的不确定性, 因为客户无法控制基础设施或其他应用。裸机云则让企业 IT 对数据中心基础设施拥有更多的控制权。

### ****High performance equals high prices**

### 高性能等于高价格

Despite all of the benefits and use cases listed for bare-metal cloud, cost may deter the average enterprise from its use. Bare-metal cloud services generally are more expensive than hypervisor-based cloud services. Vendors cannot recoup infrastructure investments among a bevy of customers because the charges go solely to the firm using the bare-metal cloud.

尽管前面列出了裸机云的诸多好处和用例, 成本仍可能让普通企业望而却步。裸机云服务通常比基于 hypervisor 的云服务更贵。由于费用全部由使用裸机云的那一家企业承担, 供应商无法在一大群客户之间分摊基础设施投资。

Although many enterprises use bare-metal services for private cloud apps, a number of public cloud service providers are moving into the space. [IBM’s SoftLayer](http://searchcloudcomputing.techtarget.com/news/2240225338/IBM-SoftLayer-a-few-pieces-short-of-a-finished-puzzle) is a bare-metal service that runs CentOS, Red Hat, FreeBSD and Ubuntu OSes; it bills customers on an hourly basis. [Rackspace OnMetal](http://searchcloudcomputing.techtarget.com/news/2240223375/Rackspace-pushes-bare-metal-cloud-amid-shaky-future) is a single-tenant bare-metal product that uses OpenStack APIs.

尽管许多企业将裸机服务用于私有云应用, 但不少公有云服务提供商也正在进入这一领域。IBM 的 SoftLayer(http://searchcloudcomputing.techtarget.com/news/2240225338/IBM-SoftLayer-a-few-pieces-short-of-a-finished-puzzle)是一项裸机服务, 可运行 CentOS、Red Hat、FreeBSD 和 Ubuntu 等操作系统, 并按小时向客户计费。Rackspace OnMetal(http://searchcloudcomputing.techtarget.com/news/2240223375/Rackspace-pushes-bare-metal-cloud-amid-shaky-future)是一款单租户裸机产品, 使用 OpenStack API。

------

------

# AWS fends off 'bouncy' cloud computing performance perception

# AWS 反驳"弹性"云计算性能的说法

## Some Amazon Web Services customers blame 'noisy neighbors' for fluctuating cloud performance, but AWS officials say that's not what's happening.

## 一些 Amazon Web Services 客户将云性能波动归咎于"坏邻居", 但 AWS 官员表示事实并非如此。

Amazon Web Services shops said they've seen fluctuating performance on the company's Elastic Compute Cloud due to "noisy neighbors," but Amazon officials said that's a misconception.

使用 Amazon Web Services 的公司表示, 他们发现该公司的弹性计算云(Elastic Compute Cloud)由于"坏邻居"而出现性能波动, 但亚马逊官员表示这是一种误解。

A "noisy neighbor" in the [context of cloud computing](http://www.theserverside.com/news/2240210976/Overprovisioning-A-costly-cloud-computing-mistake) refers to a co-tenant on a piece of virtualized server hardware that [hogs resources](http://searchaws.techtarget.com/answer/Can-I-silence-noisy-neighbor-and-restore-cloud-bandwidth), slowing other tenants' virtual machines down in the process.

在[云计算语境](http://www.theserverside.com/news/2240210976/Overprovisioning-A-costly-cloud-computing-mistake)中, "坏邻居"指的是同一块虚拟化服务器硬件上的合租者(co-tenant), 它[大量占用资源](http://searchaws.techtarget.com/answer/Can-I-silence-noisy-neighbor-and-restore-cloud-bandwidth), 从而使其他租户的虚拟机变慢。

"The Achilles' heel for Amazon is the noisy neighbor," said Devon Lazarus, cloud services manager for an electronic equipment manufacturer on the West Coast.

"亚马逊的阿喀琉斯之踵就是坏邻居, "西海岸一家电子设备制造商的云服务经理 Devon Lazarus 说。

Lazarus said the key to avoiding this problem is to pick the largest appropriate [instance type](http://searchcloudcomputing.techtarget.com/tip/Choosing-the-right-Amazon-EC2-instance-type) to run performance-sensitive applications -- that way, in theory, the application shares a server with fewer other machines.

Lazarus 说, 避免这个问题的关键是选择最大的合适[实例类型](http://searchcloudcomputing.techtarget.com/tip/Choosing-the-right-Amazon-EC2-instance-type)来运行性能敏感的应用——这样一来, 理论上应用所共享服务器的其他机器就更少。

"The micro and small instances are not for production," he said. "We usually use them for testing and validation, then move into larger instances."

"微型和小型实例不适合生产环境, "他说。"我们通常用它们来做测试和验证, 然后再迁移到更大的实例。"

Another Elastic Compute Cloud (EC2) customer, who asked to remain anonymous, also said he has seen [the noisy neighbor problem](http://searchdatacenter.techtarget.com/tip/Navigate-noisy-neighbor-challenges-in-cloud-vs-colocation)when it comes to network bandwidth.

另一位要求匿名的弹性计算云(EC2)客户也表示, 在网络带宽方面, 他见过[坏邻居问题](http://searchdatacenter.techtarget.com/tip/Navigate-noisy-neighbor-challenges-in-cloud-vs-colocation)。

These comments came on the heels of a survey by [Cloud Spectator](http://searchcloudcomputing.techtarget.com/news/2240208550/Cloud-computing-users-want-answers-during-AWS-reInvent), commissioned by AWS competitor Virtustream, which ranked [Amazon Web Services](http://searchcloudcomputing.techtarget.com/news/2240209113/AWS-ventures-far-beyond-IaaS-with-latest-cloud-services) (AWS) at the bottom of a list of competitors in [cloud computing performance](http://searchcloudcomputing.techtarget.com/news/2240208529/Rackspace-launches-cloud-computing-performance-surge-against-AWS). Since the survey was commissioned by a competitor, it is to be taken with a grain of salt, but it is also one data point in support of customers' perceptions about EC2 performance.

这些评论出现之前, [Cloud Spectator](http://searchcloudcomputing.techtarget.com/news/2240208550/Cloud-computing-users-want-answers-during-AWS-reInvent)受 AWS 的竞争对手 Virtustream 委托进行了一项调查, 在[云计算性能](http://searchcloudcomputing.techtarget.com/news/2240208529/Rackspace-launches-cloud-computing-performance-surge-against-AWS)的竞争对手排名中将 [Amazon Web Services](http://searchcloudcomputing.techtarget.com/news/2240209113/AWS-ventures-far-beyond-IaaS-with-latest-cloud-services)(AWS)列在最后。由于该调查受竞争对手委托, 应当对它有所保留, 但它也成为一个数据点, 佐证了客户对 EC2 性能的看法。

Meanwhile, AWS officials said that while performance may vary, there is no noisy neighbor problem in EC2.

与此同时, AWS 官员表示, 尽管性能可能有所差异, 但 EC2 中并不存在坏邻居问题。

"What customers are really reporting there is a difference in performance from one instance to another, but it's not due to other people [sharing the hardware]," said Matt Wood, general manager of data science for AWS.

"客户真正反映的其实是不同实例之间的性能差异, 但这并不是由于其他人[共享硬件]造成的, "AWS 数据科学总经理 Matt Wood 说。

Instead, Wood said, Amazon might have refreshed its host hardware, so customers might see an instance restart on a server with a faster processor and conclude that the previous host suffered from contention problems.

相反, Wood 说, 亚马逊可能更新了其宿主机硬件, 因此客户可能看到某个实例在一台处理器更快的服务器上重启, 从而得出结论认为之前那台宿主机遭遇了资源争用问题。

"At a high level, we have hard partitioning at the CPU level, and we provide [Provisioned IOPS]- and [Elastic Block Storage]-optimized instances to [ensure consistent IO performance](http://searchcloudstorage.techtarget.com/answer/How-can-I-ensure-peak-cloud-storage-performance)," Wood said. "On C3 instances, we also have single-root IO virtualization, which enhances networking further."

"在较高层面上, 我们在 CPU 层面做了硬分区, 并且提供 [Provisioned IOPS] 和 [Elastic Block Storage] 优化型实例, 以[确保一致的 IO 性能](http://searchcloudstorage.techtarget.com/answer/How-can-I-ensure-peak-cloud-storage-performance), "Wood 说。"在 C3 实例上, 我们还支持 single-root IO 虚拟化, 这进一步增强了网络性能。"

But analysts say customers' observations have some merit.

但分析师表示, 客户的观察有其道理。

"Noisy neighbor" is only supposed to apply to situations where resources are oversubscribed, which is typical for Web hosting and virtual private servers, said Carl Brooks, analyst with the 451 Group based in Boston. AWS does not oversubscribe, so this shouldn't happen.

"坏邻居"本应只适用于资源被超售(oversubscribed)的情况, 而这在 Web 托管和虚拟专用服务器中很常见, 总部位于波士顿的 451 Group 分析师 Carl Brooks 说。AWS 并不超售, 所以这种情况不应发生。

"What happens instead is that other parts of the host system get overtaxed -- RAM, bandwidth, traffic to disk," Brooks said. "As AWS pointed out, they have additional for-pay services to mitigate that effect, but that doesn't change the user's experience. It's not technically a noisy neighbor, but it is your neighbors being too noisy overall."

"实际发生的是, 宿主机系统的其他部分负担过重——RAM、带宽、磁盘流量, "Brooks 说。"正如 AWS 所指出的, 他们有额外的付费服务来缓解这种影响, 但这并不能改变用户体验。严格来说这不算坏邻居, 但总体来说是你的邻居太吵了。"

Some customers at the show said [fluctuations in cloud computing performance](http://searchcloudcomputing.techtarget.com/news/2240211236/AWS-C3-shortage-signals-thirst-for-cloud-computing-performance) must be expected from any service provider, and the appropriate response is just to spin up more instances.

展会上的一些客户表示, [云计算性能的波动](http://searchcloudcomputing.techtarget.com/news/2240211236/AWS-C3-shortage-signals-thirst-for-cloud-computing-performance)对任何服务提供商来说都是预料之中的, 恰当的应对方式就是多开(spin up)一些实例。

"Spot instances are two cents apiece -- what do I care about having to spin up more?" said Brian Tarbox, a software engineer at Cabot Research, a financial data analysis firm based in Boston. "You have to assume failures happen and that there will be bouncy latency and throughput; you have to build systems that can handle those things."

"Spot 实例(竞价实例)一个才两美分——我何必在意多开几个?"总部位于波士顿的金融数据分析公司 Cabot Research 的软件工程师 Brian Tarbox 说。"你必须假定故障会发生, 延迟和吞吐量会像皮球一样起伏; 你必须构建能够应对这些情况的系统。"




原文链接:

http://searchcloudcomputing.techtarget.com/definition/noisy-neighbor-cloud-computing-performance

http://searchsolidstatestorage.techtarget.com/tip/Cloud-storage-providers-moving-to-all-flash-platform

http://searchcloudcomputing.techtarget.com/tip/Bare-metal-cloud-means-more-flexibility-at-a-cost

http://searchaws.techtarget.com/news/2240209703/AWS-fends-off-bouncy-cloud-computing-performance-perception


http://www.networkcomputing.com/storage/eliminating-noisy-neighbors-public-cloud/22442379/page/0/1



相关链接:


[IT之家公告：完成阿里云至百度云站点迁移工作](http://www.ithome.com/html/it/267407.htm)
