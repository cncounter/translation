# noisy neighbor (cloud computing performance)

# 云计算性能篇之 —— 坏邻居(noisy neighbor)


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







http://www.networkcomputing.com/storage/eliminating-noisy-neighbors-public-cloud/22442379/page/0/1


http://www.ithome.com/html/it/267407.htm

http://searchcloudcomputing.techtarget.com/definition/noisy-neighbor-cloud-computing-performance


