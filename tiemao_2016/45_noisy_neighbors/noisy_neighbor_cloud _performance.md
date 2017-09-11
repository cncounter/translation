# noisy neighbor (cloud computing performance)

# 公有云与坏邻居效应

> noisy neighbor effect, 坏邻居效应



Noisy neighbor is a phrase used to describe a cloud computing infrastructure co-tenant that monopolizes bandwidth, disk I/O, CPU and other resources, and can negatively affect other users' cloud performance. The noisy neighbor effect causes other virtual machines and applications that share the infrastructure to suffer from uneven cloud network performance.

坏邻居(noisy neighbor)是云计算中的一个术语，用来描述有人挤占了公共的带宽,磁盘I/O、CPU以及其他共用资源, 并影响到其他用户的性能和体验. 坏邻居效应会引起其他共享基础设施的虚拟机和应用程序性能受到影响或抖动。


The cloud is a multi-tenant environment, which means that a single architecture hosts multiple customers' applications and data. The noisy neighbor effect occurs when an application or virtual machine uses the majority of available resources and causes network performance issues for others on the shared infrastructure.

云计算是一种多租户环境,这意味着一台物理主机会运行多个客户的应用和数据. 坏邻居效应发生的原因是某个应用或虚拟机占用了大部分的可用资源,并影响其他共享基础设施的客户的性能。


A lack of bandwidth is one cause of network performance issues. Bandwidth carries data throughout a network, so when one application or instance uses too much, other applications suffer from slow speeds or latency. Noisy neighbor can affect Web hosting, databases, networks, storage and servers.

带宽不足是网络性能问题的一个主要原因. 在网络中传输数据严重依赖带宽, 因此,当某个应用或实例占用太多,其他应用就会遭受缓慢或延迟. 坏邻居会影响虚拟主机、数据库、网络、存储和服务器。


One way to avoid the noisy neighbor effect is to use a bare-metal cloud. The bare-metal cloud runs one application at a time directly on the hardware, which creates a single-tenant environment and eliminates noisy neighbors. While single-tenant environments avoid the noisy neighbor effect, they do not solve the problem. Infrastructure over-commitment, or when an environment is shared by too many applications, limits overall cloud performance.

避免坏邻居效应的一种方法是使用裸机云(bare-metal cloud). 裸机云每次在硬件上直接运行一个应用, 相当于创建一个单租户环境,并消除了坏邻居。虽然单租户环境避免了坏邻居效应, 但并没有解决根本问题。基础设施超卖(over-commitment),或者某个环境由太多的应用共享,都会限制云的整体性能。



Another way to avoid noisy neighbors in the cloud is to ensure an application receives the necessary resources by moving workloads across physical servers. In addition, storage quality of service (QoS) controls a VM's input/output operations per second (IOPS), which can limit the noisy neighbor effect. Set IOPS limits can control the amount of resources each VM receives. Therefore, no single VM, application or instance monopolizes resources and hinders the performance of others.

在云中,另一种避免坏邻居效应的方法,是通过在物理机之间进行工作负载的迁移, 确保应用获得必要的资源. 此外, 服务的存储质量(QoS)控制VM每秒的输入/输出操作(IOPS), 可以限制坏邻居效应. 限制 IOPS 可以控制每个VM得到的资源量。因此,没有VM、应用或实例挤占和阻碍其他客户的资源和性能。



------




## Cloud storage providers moving to all-flash platform

> Colm Keegan explains why some cloud storage providers are moving to an all-flash platform and how bursting workloads into an all-flash cloud can reduce costs.

Cloud performance. It's perceived by many to be the soft underbelly of the cloud service provider industry. And it's one of the main reasons that businesses today are resisting the move to deploy their mission-critical applications into the cloud.

In this tip, you will learn what some cloud storage providers are doing to help guarantee application performance while mitigating the risk of resource contention within their multi-tenant infrastructures. You will also learn the types of questions you can ask a prospective cloud storage provider to see if it's up to the task of managing your business systems.

### All flash, all the time?

Some cloud storage providers have designed their [storage infrastructure](http://searchcloudstorage.techtarget.com/definition/cloud-storage-infrastructure)with all-flash storage arrays to, in effect, guarantee that all application workloads will have access to blazing-fast storage resources. But the obvious question is one of cost. Compared to conventional [hard disk drives](http://searchstorage.techtarget.com/definition/hard-disk-drive)(HDDs), flash carries a significant premium. And if only a relatively small percentage of data needs flash access, isn't it likely that businesses would be overpaying for the luxury of deploying into an all-flash environment?

Interestingly, to attract clients that might otherwise be reluctant to commit to the higher premiums of operating in an [all-flash storage infrastructure](http://searchsolidstatestorage.techtarget.com/essentialguide/Flash-storage-Guide-to-enterprise-all-flash-storage-arrays); some cloud storage providers are offering flash capacity at the same cost as conventional HDD space. The provider, in effect, uses flash storage as a loss leader, then makes up for it in CPU consumption. So, those businesses running heavy application workloads in their cloud will accrue higher monthly costs than a business will that has sporadic application activity.

### **Noisy neighbor nuisance

While flash is capable of driving much higher I/O throughput rates than spinning media can, all-flash arrays are equally vulnerable to the [noisy neighbor](http://storageswiss.com/2013/12/20/what-is-a-noisy-neighbor/) issues that often plague heavily virtualized environments. A noisy neighbor is when a rogue virtual machine monopolizes the storage I/O resources to the performance detriment of the other VMs in the environment. To circumvent this problem, some cloud storage providers are deploying [all-flash arrays](http://searchsolidstatestorage.techtarget.com/definition/Flash-array), such as SolidFire's platform, that have built-in storage I/O quotas that can be set at an individual VM layer.

Large enterprise environments and cloud storage providers, in particular, need this level of management detail to ensure that storage I/O resources are assigned to those applications that have the highest demand for them. This can help ensure that each virtualized application tenant in the environment will always have access to a predetermined number of storage IOPS and prevent rogue VMs from upsetting the virtualized infrastructure applecart.

### **Variable service level support

These types of flash systems allow the provider to set up various service levels -- platinum, gold, silver, bronze, for example -- and then allocate resources based on the customer's application storage I/O throughput needs. But predicting application performance needs can be an inexact science. As is stated in any financial prospectus, past performance is no indicator of what future performance will be. So, a good question to ask a prospective cloud storage provider is whether they can dynamically handle moving between various service levels on the fly. In other words, if your application is set to a gold service level and is assigned a fixed number of IOPS, what happens when performance spikes and you need to suddenly change to a platinum service level? Likewise, how can you drop back down to gold or silver, when application performance demands vacillate over time?

### **Testing the waters

Some of the early adopters of heavy computational workload computing in the cloud are big governmental and scientific agencies that need auxiliary computing and storage space to process enormous volumes of data. Think of the Large Hadron Collider in Geneva, where simulations of the Big Bang are taking place. Processing the output from these experiments requires enormous computational power and as a result, institutions like these are bursting workloads into the cloud to help speed the time it takes to process the output from these experiments.

Bursting application workloads into the cloud is a good way for businesses to test-drive cloud application provider services. For example, application owners can deploy a nonproduction instance of a heavily utilized database in the cloud and simulate peak activity to see how well the application performs. In fact, some companies like Load DynamiX have virtual testing appliances that can simulate application workloads and run them in the cloud to help IT planners determine exactly what their storage I/O throughput rates need to be. Then the virtual appliance can generate the load to see if the cloud provider's infrastructure is up to the task.

The all-flash cloud storage service provider could offer some interesting capabilities for those businesses that need a storage performance pressure relief valve. With many businesses mandating their IT organizations to cut costs and reduce capital spending, IT planners need to find creative ways to satisfy business needs without breaking the bank. By selectively bursting critical business application workloads into the cloud, it is possible to meet application service levels and keep costs in check. The key, however, is to make sure your provider has the ability to meet your needs as they change over time.



------

# Bare-metal cloud means more flexibility at a cost



## Businesses face the challenge of finding the right cloud for their needs. With the ability to customize software for unique app requirements, bare-metal cloud may be the best option.

In a crowded cloud market, differentiation is everything. Cloud service providers seek common themes to generate new customers and grow revenue. Bare-metal cloud is one such differentiator, offering flexibility and the ability to host high-performance applications. But is it right for your enterprise?

Unlike typical cloud services, bare-metal clouds come with hardware, not software. It has no operating system (OS), virtualization or applications. Enterprises need to configure the cloud platform themselves, which has its advantages and disadvantages.

Flexibility is one major advantage of bare-metal cloud's customization. Businesses with unique application requirements can configure the platform to meet their specific needs. Because of how the server is sequestered, bare-metal cloud can also offer better performance than traditional cloud services. Research shows that [bare-metal cloud servers](http://searchcloudcomputing.techtarget.com/news/2240203392/Bare-metal-servers-in-the-cloud-aid-performance-compliance) run 10% to 50% faster than hypervisor-based, multi-tenant cloud platforms.

With multi-tenant cloud, companies put multiple virtualized workloads on a shared physical server to increase overall resource use. However, different apps compete for the same processor and memory resources. The worst-case scenario is that computing resources are not available when needed.

Virtualizing cloud workloads also takes a toll on performance. Hypervisor tax is the amount of processing capacity the hypervisor layer consumes. Despite virtualization, service providers improved the software layer to make it thinner. But hypervisors still consume a percentage of the server's available processing power. The tax negatively affects performance for workloads that require large amounts of capacity.

The hypervisor, like each additional software layer, delays the system. Even though these delays are only milliseconds, they create problems with high-I/O, sensitive workloads.

In a shared cloud service, workloads fluctuate; slower application response times occur when an app encounters a [noisy neighbor](http://searchaws.techtarget.com/news/2240209703/AWS-fends-off-bouncy-cloud-computing-performance-perception) or another customer gobbling up system resources. Bare-metal cloud only runs one application, which eliminates the noisy neighbor issue.

Bare-metal cloud also enables rapid deployment. Bare-metal servers can be deployed quickly because they lack much of the infrastructure software.

### ****Application use cases for bare-metal cloud**

High-volume, high-performance workloads and [big data applications](http://searchcloudcomputing.techtarget.com/news/2240219702/Cloud-based-data-analytics-levels-the-BI-playing-field) are suited to bare-metal deployments. These apps are disk I/O-intensive, so traditional servers and storage systems struggle to keep up with these high volume and velocity requests.

Media encoding for user-generated content, such as social networking and video sharing, is a good application to run on a bare-metal cloud. When a user uploads a video, it must be transcoded into a common format for viewing. Transcoding software for audio and video is processor-intensive, which degrades performance if it's located on the same machine as the Web server or used in a multi-tenant environment.

[Compliance regulations](http://searchcloudcomputing.techtarget.com/feature/Understanding-ITs-role-in-cloud-security-and-compliance) also push certain enterprises to use bare-metal clouds. Verticals such as finance, government and healthcare must follow strict guidelines for storing, managing and sharing data. Shared infrastructure, such as public cloud, creates uncertainty regarding data security because the customer does not control the infrastructure or the other apps. A bare-metal cloud gives enterprise IT more control over the data center infrastructure.

### ****High performance equals high prices**

Despite all of the benefits and use cases listed for bare-metal cloud, cost may deter the average enterprise from its use. Bare-metal cloud services generally are more expensive than hypervisor-based cloud services. Vendors cannot recoup infrastructure investments among a bevy of customers because the charges go solely to the firm using the bare-metal cloud.

Although many enterprises use bare-metal services for private cloud apps, a number of public cloud service providers are moving into the space. [IBM’s SoftLayer](http://searchcloudcomputing.techtarget.com/news/2240225338/IBM-SoftLayer-a-few-pieces-short-of-a-finished-puzzle) is a bare-metal service that runs CentOS, Red Hat, FreeBSD and Ubuntu OSes; it bills customers on an hourly basis. [Rackspace OnMetal](http://searchcloudcomputing.techtarget.com/news/2240223375/Rackspace-pushes-bare-metal-cloud-amid-shaky-future) is a single-tenant bare-metal product that uses OpenStack APIs.

------

# AWS fends off 'bouncy' cloud computing performance perception

## Some Amazon Web Services customers blame 'noisy neighbors' for fluctuating cloud performance, but AWS officials say that's not what's happening.

Amazon Web Services shops said they've seen fluctuating performance on the company's Elastic Compute Cloud due to "noisy neighbors," but Amazon officials said that's a misconception.

A "noisy neighbor" in the [context of cloud computing](http://www.theserverside.com/news/2240210976/Overprovisioning-A-costly-cloud-computing-mistake) refers to a co-tenant on a piece of virtualized server hardware that [hogs resources](http://searchaws.techtarget.com/answer/Can-I-silence-noisy-neighbor-and-restore-cloud-bandwidth), slowing other tenants' virtual machines down in the process.

"The Achilles' heel for Amazon is the noisy neighbor," said Devon Lazarus, cloud services manager for an electronic equipment manufacturer on the West Coast.

Lazarus said the key to avoiding this problem is to pick the largest appropriate [instance type](http://searchcloudcomputing.techtarget.com/tip/Choosing-the-right-Amazon-EC2-instance-type) to run performance-sensitive applications -- that way, in theory, the application shares a server with fewer other machines.

"The micro and small instances are not for production," he said. "We usually use them for testing and validation, then move into larger instances."

Another Elastic Compute Cloud (EC2) customer, who asked to remain anonymous, also said he has seen [the noisy neighbor problem](http://searchdatacenter.techtarget.com/tip/Navigate-noisy-neighbor-challenges-in-cloud-vs-colocation)when it comes to network bandwidth.

These comments came on the heels of a survey by [Cloud Spectator](http://searchcloudcomputing.techtarget.com/news/2240208550/Cloud-computing-users-want-answers-during-AWS-reInvent), commissioned by AWS competitor Virtustream, which ranked [Amazon Web Services](http://searchcloudcomputing.techtarget.com/news/2240209113/AWS-ventures-far-beyond-IaaS-with-latest-cloud-services) (AWS) at the bottom of a list of competitors in [cloud computing performance](http://searchcloudcomputing.techtarget.com/news/2240208529/Rackspace-launches-cloud-computing-performance-surge-against-AWS). Since the survey was commissioned by a competitor, it is to be taken with a grain of salt, but it is also one data point in support of customers' perceptions about EC2 performance.

Meanwhile, AWS officials said that while performance may vary, there is no noisy neighbor problem in EC2.

"What customers are really reporting there is a difference in performance from one instance to another, but it's not due to other people [sharing the hardware]," said Matt Wood, general manager of data science for AWS.

Instead, Wood said, Amazon might have refreshed its host hardware, so customers might see an instance restart on a server with a faster processor and conclude that the previous host suffered from contention problems.

"At a high level, we have hard partitioning at the CPU level, and we provide [Provisioned IOPS]- and [Elastic Block Storage]-optimized instances to [ensure consistent IO performance](http://searchcloudstorage.techtarget.com/answer/How-can-I-ensure-peak-cloud-storage-performance)," Wood said. "On C3 instances, we also have single-root IO virtualization, which enhances networking further."

But analysts say customers' observations have some merit.

"Noisy neighbor" is only supposed to apply to situations where resources are oversubscribed, which is typical for Web hosting and virtual private servers, said Carl Brooks, analyst with the 451 Group based in Boston. AWS does not oversubscribe, so this shouldn't happen.

"What happens instead is that other parts of the host system get overtaxed -- RAM, bandwidth, traffic to disk," Brooks said. "As AWS pointed out, they have additional for-pay services to mitigate that effect, but that doesn't change the user's experience. It's not technically a noisy neighbor, but it is your neighbors being too noisy overall."

Some customers at the show said [fluctuations in cloud computing performance](http://searchcloudcomputing.techtarget.com/news/2240211236/AWS-C3-shortage-signals-thirst-for-cloud-computing-performance) must be expected from any service provider, and the appropriate response is just to spin up more instances.

"Spot instances are two cents apiece -- what do I care about having to spin up more?" said Brian Tarbox, a software engineer at Cabot Research, a financial data analysis firm based in Boston. "You have to assume failures happen and that there will be bouncy latency and throughput; you have to build systems that can handle those things."





原文链接: 

http://searchcloudcomputing.techtarget.com/definition/noisy-neighbor-cloud-computing-performance

http://searchsolidstatestorage.techtarget.com/tip/Cloud-storage-providers-moving-to-all-flash-platform

http://searchcloudcomputing.techtarget.com/tip/Bare-metal-cloud-means-more-flexibility-at-a-cost

http://searchaws.techtarget.com/news/2240209703/AWS-fends-off-bouncy-cloud-computing-performance-perception



深入阅读:


http://www.networkcomputing.com/storage/eliminating-noisy-neighbors-public-cloud/22442379/page/0/1


http://www.ithome.com/html/it/267407.htm

