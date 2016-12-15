# Eliminating Noisy Neighbors in the Public Cloud

# 在公共云中避免坏邻居效应


An IaaS provider is using all-SSD arrays and storage QoS to ensure that some tenants can’t disrupt performance of others by overconsuming resources.

IaaS提供商使用all-SSD数组和存储QoS保证一些租户不能干扰其他人通过过度消费资源的性能。


One problem with multitenant public cloud environments is the "noisy neighbor" phenomenon, when one or more customers monopolize available resources and thus significantly degrade the performance of other customers' systems.

多租户的公共云环境的一个问题是“吵闹的邻居”现象,当一个或多个客户垄断可用资源,从而显著降低其他客户的系统的性能。


One way to address this problem is via storage-based quality of service that provides defined service levels to all tenants. An infrastructure-as-a-service provider, CloudSigma, is using all-SSD arrays from SolidFire to create an architecture to eliminate noisy neighbors.

之一是通过互联网is to address,市民服务质量storage-based主张所有各级服务办法.CloudSigma iaas提供商,使用从SolidFire all-SSD数组创建一个架构消除吵闹的邻居。


CloudSigma has decided to replace all of its Tier 1 primary storage hard disk arrays with SolidFire all-SSD arrays. In addition to this significant move, the company also offers solid-state drive storage at the same price as hard disk for the same capacity. How can CloudSigma do this when flash memory is more expensive on a per-unit basis than hard disk?

CloudSigma决定替换所有的一级主要存储硬盘阵列SolidFire all-SSD数组.除了这一重大举措,公司还提供固态硬盘驱动器存储以同样的价格同样的能力.CloudSigma怎么能这样当闪存更昂贵比硬盘在单位的基础上吗?


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

我们都知道闪电的时候来了,应该是明显的是,时间就是现在。


Neither CloudSigma nor SolidFire is a client of David Hill and the Mesabi Group.


无论是CloudSigma还是SolidFire大卫·希尔是一个客户端和Mesabi组。





http://www.networkcomputing.com/storage/eliminating-noisy-neighbors-public-cloud/22442379/page/0/1


相关链接: 


[IT之家公告：完成阿里云至百度云站点迁移工作](http://www.ithome.com/html/it/267407.htm)

http://searchcloudcomputing.techtarget.com/definition/noisy-neighbor-cloud-computing-performance


