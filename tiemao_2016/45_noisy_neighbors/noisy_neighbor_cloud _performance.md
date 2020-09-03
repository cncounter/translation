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

所有的flash数组可以有更好的经济比私有数据中心的所有磁盘存储阵列时考虑到整个系统,包括服务器,存储和软件(特别是软件许可成本),是由IBM证明基于Wikibon研究.IaaS没有所有的软件许可成本优势,但CloudSigma克服失去领袖通过出售更多的计算周期的存储成本。


CloudSigma's profit margins on consumption of computing resources are greater than that of storage. Key customers, such as big science in Europe and big media in the United States, have burst requirements. Being able to house all of a big data set on SSD improves performance, which means things get done in a more timely (that is, valuable) manner, and the compute fees go to CloudSigma instead of to a competitor.

CloudSigma利润率的计算资源的消耗大于存储.关键客户,如大科学在欧洲和美国大媒体,有破裂的要求.能够房子的大数据集在SSD的性能得到了很大的提高,这就意味着事情做在一个更及时(有价值的),和计算费用去CloudSigma而不是一个竞争对手。


But the burst requirements of some customers may create noisy-neighbor problems for subscription customers with more traditional storage provisioning needs. CloudSigma needed an SSD-array supplier that could solve this noisy-neighbor QoS problem, and so it turned to SolidFire.

但是有些客户可能的破裂需求创建noisy-neighbor问题订阅客户与更传统的存储配置需求.CloudSigma需要一个SSD-array供应商可以解决这个noisy-neighbor QoS问题,所以它变成了SolidFire。


Solving the Noisy-Neighbor Problem

解决Noisy-Neighbor问题


With an IT product like a storage array, architecture encompasses both the hardware and software components that give the product its character and style. For example, an enterprise-class disk array is more than a just-a-bunch-of-disks offering. Among other features, it contains a controller that has one or more processors running a specialized operating system and software algorithms that manage RAM cache to improve overall performance.

与IT产品存储阵列,架构包含硬件和软件组件,产品个性和风格.例如,一个企业级磁盘阵列是一个多just-a-bunch-of-disks祭.等特性,它包含一个控制器,一个或多个处理器运行专门的操作系统和软件的算法管理RAM缓存来提高整体性能。


SolidFire's SF3010 and SF6010 appliances are controller-less, all-flash arrays where one node is 1U high, for an effective capacity of 12 Tbytes (with 10 128-Gbyte drives in an SF3010) and 24 Tbytes (with 256-Gbyte drives in an SF6010). The company's scale-out clustered architecture enables a single cluster of appliances to scale to more than 2 petabytes of effective capacity.

SolidFire SF3010和SF6010电器controller-less,所有的flash数组一个节点在哪里1 u高,的有效容量12 Tbytes(10 128 -千兆字节驱动器在SF3010)和24 Tbytes(256 -在SF6010千兆字节驱动器).公司的横向扩展集群架构允许单个集群设备规模超过2 pb有效的能力。


But the true power of SolidFire resides in its Element operating system, which manages all the functions of the array. That includes SolidFire Helix data protection to manage device failure without performance impact (a key element in meeting QoS commitments). SolidFire software also offers thin provisioning, deduplication and compression to get the most out of the available storage. For example, thin provisioning is necessary for elasticity in the cloud as allocated, but not-yet-used system resources, such as IOPS and gigabytes, can be made available on demand for peak load (that is, burst) requirements.

但SolidFire的真正威力驻留在其元素的操作系统,管理所有数组的函数.包括SolidFire螺旋数据保护管理设备故障没有性能影响(会议QoS承诺的一个关键因素).SolidFire软件还提供了自动精简配置,重复数据删除和压缩得到的可用的存储空间.例如,自动精简配置必要的弹性云中的分配,但尚未使用的系统资源,如IOPS,g,可以对高峰负荷需求(即破裂)的要求。


In a CloudSigma cloud, customers purchase both the gigabytes and IOPS necessary for a guaranteed minimum performance level for applications as a whole (and not just for the 5% of data that is traditionally considered performance-sensitive). This delivers predictable performance, but also means that SolidFire has to have some mechanisms that eliminate potential noisy-neighbor threats. The company achieves this through balanced load distribution, which eliminates hot spots that create unpredictable latency and performance virtualization that enables on-demand control of performance independent of capacity, as well as fine-grain volume control.

在一个CloudSigma云,客户购买g和IOPS保证最低性能水平所需应用程序作为一个整体(而不仅仅是传统上被认为是5%的数据 性能敏感的部分)。这提供可预测的性能,但也意味着SolidFire必须有一些机制,消除潜在的noisy-neighbor威胁.公司实现了通过平衡负载分布,消除热点,创造不可预测的延迟和性能虚拟化,使按需控制性能无关的容量,以及精密音量控制。


Key to all this is the use of a REST-based API that delivers multitenant provisioning, reporting and performance isolation. The key word is "isolation." Each cloud tenant needs to be assured that its reserved resources will be available as guaranteed. That means SolidFire has to find the necessary physical resources when they are needed, even though the customer has been allocated resources on a physical basis.

这一切的关键是使用基于rest的API,提供了多租户供应、报告和性能隔离。关键词是“隔离.“每个云租户需要保证其预留资源将提供保证.这意味着SolidFire必须找到必要的物理资源时需要的,即使客户已经分配资源在物理的基础上。


Altogether, SolidFire delivers not only predictable performance but also the necessary reliability, data protection and security characteristics that enable the running of business- and mission-critical applications. Though a number of enterprises might not want to entrust those systems to a public cloud, SolidFire's offerings make that decision based on reasons other than technology considerations. And CloudSigma's customer base, which includes CERN (a stickler when it comes to technology and security requirements), would argue that not everyone feels that way.

完全,不仅SolidFire提供可预测的性能也是必要的可靠性,数据保护和安全特性,使业务和关键任务应用程序的运行.虽然很多企业可能不希望委托这些系统公共云,SolidFire的产品做决定基于技术因素以外的原因.和CloudSigma的客户群,其中包括欧洲核子研究中心(固执己见时,技术和安全需求),认为并不是每个人都感觉如此而已。


Note also that the level of guaranteed QoS SolidFire promises is difficult, if not impossible, to achieve with all-hard disk arrays, mainly because they are electromechanical products versus an all-electronic SSD array. Rather than getting into details, suffice to say that managing available IOPS is more straightforward with SSDs than with hundreds or thousands of moving actuator arms. And that's one reason that all-flash arrays will eventually prevail over all-disk arrays when QoS is a strict requirement.

还要注意保证QoS SolidFire承诺的水平是困难的,如果不是不可能的话)与所有硬盘磁盘阵列来实现,主要因为他们是机电产品,而不是一台SSD数组.而不是进入细节,我想说的是,管理可用的IOPS比与直接用ssd成百上千的致动器臂移动.和这是一个原因,所有的flash数组最终将战胜所有磁盘阵列QoS时严格要求。


Mesabi Musings

Mesabi沉思


The IT industry does not officially declare "The Year of..." awards, but if it did for storage, 2013 might be called "The Year of All-Flash Arrays." IBM in its recently announced flash initiative stood as a "Good Housekeeping Seal of Approval" for all-flash arrays in data centers based on a purely economic analysis.

IT行业并没有正式宣布“年”…”奖项,但如果做存储,2013年被称为“今年所有的flash的数组.“IBM在其最近宣布flash倡议站作为一个“好管家批准印章”所有的flash中的数组数据中心基于纯粹的经济分析。


CloudSigma and SolidFire have extended that point to public cloud infrastructures. In a multitenant cloud, economics is a critically important consideration, of course, but so is being able to provide a guaranteed QoS. Without predictable performance (and that's not just for performance-sensitive data, but all data on a day-to-day basis), customers cannot commit to a public cloud.

CloudSigma和SolidFire扩展,指出公共云基础设施.在一个多租户云,经济学是一门非常重要的考虑因素,当然,但能够提供一个保证QoS.没有可预测的性能(不仅对性能敏感的数据,但日常所有数据),客户不能提交公共云。


SolidFire eliminates the noisy-neighbor QoS problem, and CloudSigma attests to the technical and economical value of this approach with its full commitment to all-SSD SolidFire arrays for primary storage. To achieve this, SolidFire has created a sophisticated architecture that provides differentiation in the same sense that an enterprise-class disk array is much more than just a bunch of disks. From an economic performance and QoS manageability perspective, all-flash arrays now command the high ground for Tier 1 primary storage arrays.

SolidFire消除了noisy-neighbor QoS问题,和CloudSigma证明了这种方法的技术经济价值的全面承诺all-SSD SolidFire主存储器阵列.为了达到这个目标,SolidFire创造了一个复杂的架构,提供差异化在同样的意义上,企业级磁盘阵列不仅仅是一堆磁盘.从经济性能和QoS管理角度来看,现在所有的flash阵列命令一级主存储器阵列的高地。


We all knew that flash's time was coming; what should be apparent to all is that time is now.

我们都知道,闪存大放光彩的时代到来了,当然,现在就是。


Neither CloudSigma nor SolidFire is a client of David Hill and the Mesabi Group.


无论是CloudSigma还是SolidFire大卫·希尔是一个客户端和Mesabi组。



## Cloud storage providers moving to all-flash platform

## 云存储提供商搬到所有的flash平台

> Colm Keegan explains why some cloud storage providers are moving to an all-flash platform and how bursting workloads into an all-flash cloud can reduce costs.

> 克莱基冈解释了为什么一些云存储提供商正在一个所有的flash平台以及破裂工作量为所有的flash云如何降低成本。

Cloud performance. It's perceived by many to be the soft underbelly of the cloud service provider industry. And it's one of the main reasons that businesses today are resisting the move to deploy their mission-critical applications into the cloud.

云计算的性能。它让人感觉是云服务提供商行业的软肋.它的一个主要原因,企业今天抵制搬到他们的任务关键型应用程序部署到云中。

In this tip, you will learn what some cloud storage providers are doing to help guarantee application performance while mitigating the risk of resource contention within their multi-tenant infrastructures. You will also learn the types of questions you can ask a prospective cloud storage provider to see if it's up to the task of managing your business systems.

在本技巧中,you will learnalots what some cloud储存供应商are doing帮助保证执行业绩风险评价的资源对原来的束缚multi-tenant their清册的基础设施.您还将学习类型的问题你可以问未来的云存储提供商是否胜任这一任务的管理你的业务系统。

### All flash, all the time?

### 所有flash,所有的时间吗?

Some cloud storage providers have designed their [storage infrastructure](http://searchcloudstorage.techtarget.com/definition/cloud-storage-infrastructure)with all-flash storage arrays to, in effect, guarantee that all application workloads will have access to blazing-fast storage resources. But the obvious question is one of cost. Compared to conventional [hard disk drives](http://searchstorage.techtarget.com/definition/hard-disk-drive)(HDDs), flash carries a significant premium. And if only a relatively small percentage of data needs flash access, isn't it likely that businesses would be overpaying for the luxury of deploying into an all-flash environment?

一些云存储提供商已经设计他们的存储基础设施(http://searchcloudstorage.techtarget.com/definition/cloud-storage-infrastructure)和所有的flash存储阵列,实际上,保证所有应用程序工作负载瞬间将可以访问存储资源.但一个明显的问题是成本之一。相比传统(硬盘驱动器)(http://searchstorage.techtarget.com/definition/hard-disk-drive)(hdd),flash带有明显的溢价.如果只有一个相对较小的部分数据需要flash访问不可能报价过高,企业将部署到所有的flash的豪华环境?

Interestingly, to attract clients that might otherwise be reluctant to commit to the higher premiums of operating in an [all-flash storage infrastructure](http://searchsolidstatestorage.techtarget.com/essentialguide/Flash-storage-Guide-to-enterprise-all-flash-storage-arrays); some cloud storage providers are offering flash capacity at the same cost as conventional HDD space. The provider, in effect, uses flash storage as a loss leader, then makes up for it in CPU consumption. So, those businesses running heavy application workloads in their cloud will accrue higher monthly costs than a business will that has sporadic application activity.

有趣的是,为了吸引客户,否则可能会不愿意承诺更高的溢价的操作在一个所有的flash存储基础设施(http://searchsolidstatestorage.techtarget.com/essentialguide/Flash-storage-Guide-to-enterprise-all-flash-storage-arrays);一些云存储提供商提供闪存容量成本与传统硬盘空间.实际上,提供者使用闪存作为损失领袖,然后弥补在CPU消耗.所以,这些企业运行大量应用程序工作负载的云业务将每月的成本高于积累的零星的应用程序活动。

### **Noisy neighbor nuisance

### * *吵邻居讨厌

While flash is capable of driving much higher I/O throughput rates than spinning media can, all-flash arrays are equally vulnerable to the [noisy neighbor](http://storageswiss.com/2013/12/20/what-is-a-noisy-neighbor/) issues that often plague heavily virtualized environments. A noisy neighbor is when a rogue virtual machine monopolizes the storage I/O resources to the performance detriment of the other VMs in the environment. To circumvent this problem, some cloud storage providers are deploying [all-flash arrays](http://searchsolidstatestorage.techtarget.com/definition/Flash-array), such as SolidFire's platform, that have built-in storage I/O quotas that can be set at an individual VM layer.

虽然flash能够驱动I / O吞吐率远高于媒体可以旋转,所有的flash数组是同样容易吵闹的邻居(http://storageswiss.com/2013/12/20/what-is-a-noisy-neighbor/)问题经常困扰严重虚拟化环境.垄断一个吵闹的邻居就是一个流氓虚拟机存储I / O资源的性能损害其他虚拟机环境.为了规避这一问题,一些云存储提供商部署所有的flash数组(http://searchsolidstatestorage.techtarget.com/definition/Flash-array),比如SolidFire的平台,有内置存储I / O配额,可以设置在一个单独的虚拟机层。

Large enterprise environments and cloud storage providers, in particular, need this level of management detail to ensure that storage I/O resources are assigned to those applications that have the highest demand for them. This can help ensure that each virtualized application tenant in the environment will always have access to a predetermined number of storage IOPS and prevent rogue VMs from upsetting the virtualized infrastructure applecart.

特别是大型企业环境和云存储提供商,需要这种级别的管理细节,确保存储I / O资源分配给那些需求最高的应用程序.这可以帮助确保每个虚拟化应用环境中的租户总是获得预定数量的存储IOPS和防止流氓vm倾覆 虚拟化基础设施阵脚。

### **Variable service level support

### * *变量服务水平的支持

These types of flash systems allow the provider to set up various service levels -- platinum, gold, silver, bronze, for example -- and then allocate resources based on the customer's application storage I/O throughput needs. But predicting application performance needs can be an inexact science. As is stated in any financial prospectus, past performance is no indicator of what future performance will be. So, a good question to ask a prospective cloud storage provider is whether they can dynamically handle moving between various service levels on the fly. In other words, if your application is set to a gold service level and is assigned a fixed number of IOPS, what happens when performance spikes and you need to suddenly change to a platinum service level? Likewise, how can you drop back down to gold or silver, when application performance demands vacillate over time?

这些类型的flash系统允许提供者设置各种服务水平——白金、金、银、铜牌,例如,然后根据客户的应用程序分配资源存储I / O吞吐量的需求。但预测应用程序性能需要可以是一个不精确的科学.任何金融招股说明书中所述,过去的表现并没有未来表现的指标.所以,一个好的问题要问未来的云存储提供商是他们是否可以动态地处理各种服务水平之间的移动.换句话说,如果您的应用程序将分配一个黄金服务水平和固定数量的IOPS,当性能峰值和需要突然改变一个白金服务水平?同样的,你怎么能回到黄金或白银下降,随着时间的推移,当应用程序性能要求动摇?

### **Testing the waters

### * *试水

Some of the early adopters of heavy computational workload computing in the cloud are big governmental and scientific agencies that need auxiliary computing and storage space to process enormous volumes of data. Think of the Large Hadron Collider in Geneva, where simulations of the Big Bang are taking place. Processing the output from these experiments requires enormous computational power and as a result, institutions like these are bursting workloads into the cloud to help speed the time it takes to process the output from these experiments.

的一些早期采用者重计算工作量计算在云大政府和科学机构,需要辅助计算和存储空间巨大的过程 量的数据。认为在日内瓦的大型强子对撞机(lhc),模拟大爆炸发生.处理这些实验的输出需要巨大的计算能力和结果,Institutions like these are bursting workloads into the cloud to help speed the time it takes to process the output from these experiments.

Bursting application workloads into the cloud is a good way for businesses to test-drive cloud application provider services. For example, application owners can deploy a nonproduction instance of a heavily utilized database in the cloud and simulate peak activity to see how well the application performs. In fact, some companies like Load DynamiX have virtual testing appliances that can simulate application workloads and run them in the cloud to help IT planners determine exactly what their storage I/O throughput rates need to be. Then the virtual appliance can generate the load to see if the cloud provider's infrastructure is up to the task.

破裂向云应用程序工作负载是一个很好的方式为企业试驾云应用程序提供者的服务.例如,应用程序所有者可以部署在云中nonproduction大量利用数据库的实例和模拟峰值活动看看应用程序执行.事实上,一些公司,如负载DynamiX虚拟测试设备,可以模拟云中的应用程序工作负载和运行它们帮助规划者决定正是他们存储I / O 吞吐率需要。虚拟设备可以生成负载云提供商的基础设施是否胜任这一任务。

The all-flash cloud storage service provider could offer some interesting capabilities for those businesses that need a storage performance pressure relief valve. With many businesses mandating their IT organizations to cut costs and reduce capital spending, IT planners need to find creative ways to satisfy business needs without breaking the bank. By selectively bursting critical business application workloads into the cloud, it is possible to meet application service levels and keep costs in check. The key, however, is to make sure your provider has the ability to meet your needs as they change over time.

所有的flash的云存储服务提供商可以提供一些有趣的功能对于那些企业需要一个存储性能压力安全阀.与许多企业要求他们的IT组织削减成本、减少资本支出,规划者需要寻找有创意的方法来满足业务需求,没有打破银行.通过选择性地破裂的关键业务应用程序工作负载到云端,可以满足应用程序的服务级别和控制成本.然而,关键是确保你的供应商有能力满足您的需求随时间变化。

------

------

# Bare-metal cloud means more flexibility at a cost

# 裸机云成本意味着更大的灵活性

## Businesses face the challenge of finding the right cloud for their needs. With the ability to customize software for unique app requirements, bare-metal cloud may be the best option.

## 企业面临的挑战是找到合适的云的需求。能够定制软件独特的应用需求,裸机云可能是最好的选择。

In a crowded cloud market, differentiation is everything. Cloud service providers seek common themes to generate new customers and grow revenue. Bare-metal cloud is one such differentiator, offering flexibility and the ability to host high-performance applications. But is it right for your enterprise?

在一个拥挤的云市场,区别就是一切。云服务提供商共同主题生成新客户和收入增长.裸机云就是这样的一个区别,提供灵活性和主机高性能应用程序的能力。但这是适合您的企业吗?

Unlike typical cloud services, bare-metal clouds come with hardware, not software. It has no operating system (OS), virtualization or applications. Enterprises need to configure the cloud platform themselves, which has its advantages and disadvantages.

不像典型的云服务,与硬件裸机云来,而不是软件。它没有操作系统(OS),虚拟化或应用程序.企业需要配置云平台本身,都有其优点和缺点。

Flexibility is one major advantage of bare-metal cloud's customization. Businesses with unique application requirements can configure the platform to meet their specific needs. Because of how the server is sequestered, bare-metal cloud can also offer better performance than traditional cloud services. Research shows that [bare-metal cloud servers](http://searchcloudcomputing.techtarget.com/news/2240203392/Bare-metal-servers-in-the-cloud-aid-performance-compliance) run 10% to 50% faster than hypervisor-based, multi-tenant cloud platforms.

灵活性是裸机云定制的一个主要优势。企业具有独特的应用程序需求可以配置平台来满足他们的特定需求.因为服务器隔离,裸机云也可以提供更好的性能比传统的云服务.研究表明,裸机云服务器(http://searchcloudcomputing.techtarget.com/news/2240203392/Bare-metal-servers-in-the-cloud-aid-performance-compliance)10%至50%的速度比基于管理程序的运行,多租户云平台。

With multi-tenant cloud, companies put multiple virtualized workloads on a shared physical server to increase overall resource use. However, different apps compete for the same processor and memory resources. The worst-case scenario is that computing resources are not available when needed.

多租户云,公司把多个虚拟化工作负载共享物理服务器来提高整体资源利用.然而,不同的应用程序争夺相同的处理器和内存资源。最坏的情况是,在需要的时候计算资源不可用。

Virtualizing cloud workloads also takes a toll on performance. Hypervisor tax is the amount of processing capacity the hypervisor layer consumes. Despite virtualization, service providers improved the software layer to make it thinner. But hypervisors still consume a percentage of the server's available processing power. The tax negatively affects performance for workloads that require large amounts of capacity.

虚拟化云计算工作负载也会对性能产生负面影响。Hypervisor税是Hypervisor的处理容量层消耗.尽管虚拟化、服务供应商改进了软件层,使它更薄。但是虚拟机监控程序仍然消耗的比例可用服务器的处理能力.税务工作负载的性能产生不利影响,需要大量的能力。

The hypervisor, like each additional software layer, delays the system. Even though these delays are only milliseconds, they create problems with high-I/O, sensitive workloads.

虚拟机监控程序,就像每一个额外的软件层,延迟系统。尽管这些延迟毫秒,他们创造高i / O问题,敏感的工作负载。

In a shared cloud service, workloads fluctuate; slower application response times occur when an app encounters a [noisy neighbor](http://searchaws.techtarget.com/news/2240209703/AWS-fends-off-bouncy-cloud-computing-performance-perception) or another customer gobbling up system resources. Bare-metal cloud only runs one application, which eliminates the noisy neighbor issue.

在一个共享的云服务,工作负载波动;应用程序响应时间慢发生当一个应用程序遇到一个吵闹的邻居(http://searchaws.techtarget.com/news/2240209703/AWS-fends-off-bouncy-cloud-computing-performance-perception)或另一个客户消耗系统资源.裸机云只运行一个应用程序,它消除了吵闹的邻居的问题。

Bare-metal cloud also enables rapid deployment. Bare-metal servers can be deployed quickly because they lack much of the infrastructure software.

裸机云还支持快速部署。裸机服务器可以快速部署,因为他们缺少的大部分基础设施软件。

### ****Application use cases for bare-metal cloud**

### * * * *应用程序用例裸机云* *

High-volume, high-performance workloads and [big data applications](http://searchcloudcomputing.techtarget.com/news/2240219702/Cloud-based-data-analytics-levels-the-BI-playing-field) are suited to bare-metal deployments. These apps are disk I/O-intensive, so traditional servers and storage systems struggle to keep up with these high volume and velocity requests.

大容量、高性能的工作负载和大数据应用(http://searchcloudcomputing.techtarget.com/news/2240219702/Cloud-based-data-analytics-levels-the-BI-playing-field)适合裸机部署.这些磁盘I / o密集型应用程序,因此传统的服务器和存储系统难以跟上这些高容量和速度的要求。

Media encoding for user-generated content, such as social networking and video sharing, is a good application to run on a bare-metal cloud. When a user uploads a video, it must be transcoded into a common format for viewing. Transcoding software for audio and video is processor-intensive, which degrades performance if it's located on the same machine as the Web server or used in a multi-tenant environment.

媒体编码用户生成的内容,如社交网络和视频分享,是一个很好的应用程序运行在裸机云.当一个用户上传一个视频,它必须被转换成一个共同的格式以供查看.为音频和视频转码软件处理器密集型,降解性能如果它位于同一台机器作为Web服务器或在多租户环境中使用。

[Compliance regulations](http://searchcloudcomputing.techtarget.com/feature/Understanding-ITs-role-in-cloud-security-and-compliance) also push certain enterprises to use bare-metal clouds. Verticals such as finance, government and healthcare must follow strict guidelines for storing, managing and sharing data. Shared infrastructure, such as public cloud, creates uncertainty regarding data security because the customer does not control the infrastructure or the other apps. A bare-metal cloud gives enterprise IT more control over the data center infrastructure.

(合规规定)(http://searchcloudcomputing.techtarget.com/feature/Understanding-ITs-role-in-cloud-security-and-compliance)也推动某些企业使用云裸机.垂直行业如金融、政府和医疗必须遵循严格的指导方针,存储、管理和共享数据.共享基础设施,如公共云,创造了不确定性关于数据安全,因为客户不控制基础设施或其他应用程序.裸机云给了企业更多的控制数据中心基础设施。

### ****High performance equals high prices**

### * * * * * *高性能=高价格

Despite all of the benefits and use cases listed for bare-metal cloud, cost may deter the average enterprise from its use. Bare-metal cloud services generally are more expensive than hypervisor-based cloud services. Vendors cannot recoup infrastructure investments among a bevy of customers because the charges go solely to the firm using the bare-metal cloud.

尽管所有的好处和用例上市裸机云,可能阻止企业平均使用成本.裸机云服务通常更昂贵的比基于管理程序的云服务.供应商不能弥补基础设施投资在一群客户因为这些指控仅仅使用裸机云公司。

Although many enterprises use bare-metal services for private cloud apps, a number of public cloud service providers are moving into the space. [IBM’s SoftLayer](http://searchcloudcomputing.techtarget.com/news/2240225338/IBM-SoftLayer-a-few-pieces-short-of-a-finished-puzzle) is a bare-metal service that runs CentOS, Red Hat, FreeBSD and Ubuntu OSes; it bills customers on an hourly basis. [Rackspace OnMetal](http://searchcloudcomputing.techtarget.com/news/2240223375/Rackspace-pushes-bare-metal-cloud-amid-shaky-future) is a single-tenant bare-metal product that uses OpenStack APIs.

尽管许多企业使用裸机私有云服务应用,大量的公共云服务提供商正在进入空间。IBM的SoftLayer(http://searchcloudcomputing.techtarget.com/news/2240225338/IBM-SoftLayer-a-few-pieces-short-of-a-finished-puzzle)是一个服务运行CentOS的裸机,Red Hat、FreeBSD和Ubuntu操作系统;这账单客户每小时.(Rackspace OnMetal)(http://searchcloudcomputing.techtarget.com/news/2240223375/Rackspace-pushes-bare-metal-cloud-amid-shaky-future)是一个单租户裸机产品使用OpenStack api。

------

------

# AWS fends off 'bouncy' cloud computing performance perception

# AWS规避“弹性”云计算性能感知

## Some Amazon Web Services customers blame 'noisy neighbors' for fluctuating cloud performance, but AWS officials say that's not what's happening.

## 一些Amazon Web服务客户责怪“吵闹的邻居”云性能波动,但AWS官员说,并不是发生了什么。

Amazon Web Services shops said they've seen fluctuating performance on the company's Elastic Compute Cloud due to "noisy neighbors," but Amazon officials said that's a misconception.

亚马逊网络服务商店表示,他们已经看到波动表现公司的弹性计算云由于“吵闹的邻居”,但亚马逊官员表示,这是一个误解。

A "noisy neighbor" in the [context of cloud computing](http://www.theserverside.com/news/2240210976/Overprovisioning-A-costly-cloud-computing-mistake) refers to a co-tenant on a piece of virtualized server hardware that [hogs resources](http://searchaws.techtarget.com/answer/Can-I-silence-noisy-neighbor-and-restore-cloud-bandwidth), slowing other tenants' virtual machines down in the process.

“吵闹的邻居”的云计算(http://www.theserverside.com/news/2240210976/Overprovisioning-A-costly-cloud-computing-mistake)指一块合租在一个虚拟化的服务器硬件,猪资源(http://searchaws.techtarget.com/answer/Can-I-silence-noisy-neighbor-and-restore-cloud-bandwidth),减缓其他租户的虚拟机的过程。

"The Achilles' heel for Amazon is the noisy neighbor," said Devon Lazarus, cloud services manager for an electronic equipment manufacturer on the West Coast.

亚马逊的“阿基里斯之踵是吵闹的邻居,”云服务经理说德文拉撒路电子设备制造商在西海岸。

Lazarus said the key to avoiding this problem is to pick the largest appropriate [instance type](http://searchcloudcomputing.techtarget.com/tip/Choosing-the-right-Amazon-EC2-instance-type) to run performance-sensitive applications -- that way, in theory, the application shares a server with fewer other machines.

拉撒路说,避免这个问题的关键是选择最大的适当的实例类型(http://searchcloudcomputing.techtarget.com/tip/Choosing-the-right-Amazon-EC2-instance-type)运行性能敏感的应用程序,这样,从理论上讲,用更少的其他应用程序共享一个服务器机器。

"The micro and small instances are not for production," he said. "We usually use them for testing and validation, then move into larger instances."

“微型和小型实例不适合生产,”他说。“我们通常使用他们进行测试和验证,然后进入更大的实例。”

Another Elastic Compute Cloud (EC2) customer, who asked to remain anonymous, also said he has seen [the noisy neighbor problem](http://searchdatacenter.techtarget.com/tip/Navigate-noisy-neighbor-challenges-in-cloud-vs-colocation)when it comes to network bandwidth.

另一个弹性计算云(EC2)客户,他要求匿名,还说他见过吵闹的邻居问题(http://searchdatacenter.techtarget.com/tip/Navigate-noisy-neighbor-challenges-in-cloud-vs-colocation)时网络带宽。

These comments came on the heels of a survey by [Cloud Spectator](http://searchcloudcomputing.techtarget.com/news/2240208550/Cloud-computing-users-want-answers-during-AWS-reInvent), commissioned by AWS competitor Virtustream, which ranked [Amazon Web Services](http://searchcloudcomputing.techtarget.com/news/2240209113/AWS-ventures-far-beyond-IaaS-with-latest-cloud-services) (AWS) at the bottom of a list of competitors in [cloud computing performance](http://searchcloudcomputing.techtarget.com/news/2240208529/Rackspace-launches-cloud-computing-performance-surge-against-AWS). Since the survey was commissioned by a competitor, it is to be taken with a grain of salt, but it is also one data point in support of customers' perceptions about EC2 performance.

这些评论的一项调查显示,云观众(http://searchcloudcomputing.techtarget.AWS的竞争对手Virtustream com/news/2240208550/Cloud-computing-users-want-answers-during-AWS-reInvent),委托,排名(Amazon Web Services)(http://searchcloudcomputing.techtarget.com/news/2240209113/AWS-ventures-far-beyond-IaaS-with-latest-cloud-services)(AWS)一个列表的底部(云计算性能)的竞争对手(http://searchcloudcomputing.techtarget.com/news/2240208529/Rackspace-launches-cloud-computing-performance-surge-against-AWS).由于委托进行这一调查的一个竞争对手,它是用一粒盐,但它也是一个数据点,以支持客户的看法EC2的性能。

Meanwhile, AWS officials said that while performance may vary, there is no noisy neighbor problem in EC2.

同时,AWS官员表示,尽管性能可能有所不同,没有吵闹的邻居EC2的问题。

"What customers are really reporting there is a difference in performance from one instance to another, but it's not due to other people [sharing the hardware]," said Matt Wood, general manager of data science for AWS.

“客户真正性能报告存在差异从一个到另一个实例,但这不是由于别人(共享硬件),“马特·伍德说,总经理AWS的科学数据。

Instead, Wood said, Amazon might have refreshed its host hardware, so customers might see an instance restart on a server with a faster processor and conclude that the previous host suffered from contention problems.

相反,伍德说,亚马逊可能会刷新其主机硬件,所以客户可能看到一个实例重启服务器上有更快的处理器和得出结论,前面的主机遭受争用问题。

"At a high level, we have hard partitioning at the CPU level, and we provide [Provisioned IOPS]- and [Elastic Block Storage]-optimized instances to [ensure consistent IO performance](http://searchcloudstorage.techtarget.com/answer/How-can-I-ensure-peak-cloud-storage-performance)," Wood said. "On C3 instances, we also have single-root IO virtualization, which enhances networking further."

“在一个较高的水平,我们有硬分区CPU层面,我们提供(供应IOPS)——(弹性块存储)优化实例确保IO性能的一致性(http:/ /searchcloudstorage.techtarget.com/answer/How-can-I-ensure-peak-cloud-storage-performance),”伍德说.“C3的实例,我们也有单牙根IO虚拟化,进一步提高网络。”

But analysts say customers' observations have some merit.

但分析师表示客户的观察都有一定的优点。

"Noisy neighbor" is only supposed to apply to situations where resources are oversubscribed, which is typical for Web hosting and virtual private servers, said Carl Brooks, analyst with the 451 Group based in Boston. AWS does not oversubscribe, so this shouldn't happen.

“吵闹的邻居”只是应该适用于资源超额认购的情况下,这是典型的Web托管和虚拟专用服务器,卡尔·布鲁克斯说,分析师与451年在波士顿。AWS不超额认购,这不该发生。

"What happens instead is that other parts of the host system get overtaxed -- RAM, bandwidth, traffic to disk," Brooks said. "As AWS pointed out, they have additional for-pay services to mitigate that effect, but that doesn't change the user's experience. It's not technically a noisy neighbor, but it is your neighbors being too noisy overall."

“取而代之的是,主机系统的其他部分得到不堪重负,RAM,带宽、流量到磁盘,”布鲁克斯说.“AWS指出,他们有额外的付费服务,以减轻的效果,但这并不能改变用户体验.这不是技术上一个吵闹的邻居,但这是你的邻居太吵了。”

Some customers at the show said [fluctuations in cloud computing performance](http://searchcloudcomputing.techtarget.com/news/2240211236/AWS-C3-shortage-signals-thirst-for-cloud-computing-performance) must be expected from any service provider, and the appropriate response is just to spin up more instances.

一些客户在展会上说云计算性能的波动(http://searchcloudcomputing.techtarget.com/news/2240211236/AWS-C3-shortage-signals-thirst-for-cloud-computing-performance)必须预期从任何服务提供者,和适当的反应只是旋转更多的实例。

"Spot instances are two cents apiece -- what do I care about having to spin up more?" said Brian Tarbox, a software engineer at Cabot Research, a financial data analysis firm based in Boston. "You have to assume failures happen and that there will be bouncy latency and throughput; you have to build systems that can handle those things."

“现货实例两个美分——我多关心需要自旋向上吗?”说的学监布莱恩·塔波克斯兼任,卡博特软件工程师研究,基于金融数据分析公司在波士顿.“你必须假定故障发生,会有弹性延迟和吞吐量;你必须建立系统可以处理这些事情。”









原文链接:

http://searchcloudcomputing.techtarget.com/definition/noisy-neighbor-cloud-computing-performance

http://searchsolidstatestorage.techtarget.com/tip/Cloud-storage-providers-moving-to-all-flash-platform

http://searchcloudcomputing.techtarget.com/tip/Bare-metal-cloud-means-more-flexibility-at-a-cost

http://searchaws.techtarget.com/news/2240209703/AWS-fends-off-bouncy-cloud-computing-performance-perception


http://www.networkcomputing.com/storage/eliminating-noisy-neighbors-public-cloud/22442379/page/0/1



相关链接:


[IT之家公告：完成阿里云至百度云站点迁移工作](http://www.ithome.com/html/it/267407.htm)
