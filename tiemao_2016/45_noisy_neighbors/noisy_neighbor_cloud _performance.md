# noisy neighbor (cloud computing performance)

# 云计算性能篇之 —— 坏邻居(noisy neighbor)


Noisy neighbor is a phrase used to describe a cloud computing infrastructure co-tenant that monopolizes bandwidth, disk I/O, CPU and other resources, and can negatively affect other users' cloud performance. The noisy neighbor effect causes other virtual machines and applications that share the infrastructure to suffer from uneven cloud network performance.

坏邻居(noisy neighbor)是一个词用来描述云计算基础设施共有人垄断带宽,磁盘I / O、CPU和其他资源,并能影响其他用户的云的性能.坏邻居效应引起其他虚拟机和应用程序共享基础设施遭受云网络性能不均匀。


The cloud is a multi-tenant environment, which means that a single architecture hosts multiple customers' applications and data. The noisy neighbor effect occurs when an application or virtual machine uses the majority of available resources and causes network performance issues for others on the shared infrastructure.

云计算是一个多租户环境,这意味着一个架构拥有多个客户的应用程序和数据.坏邻居效应发生在应用程序或虚拟机利用可用资源,导致网络性能问题的多数为他人共享基础设施。


A lack of bandwidth is one cause of network performance issues. Bandwidth carries data throughout a network, so when one application or instance uses too much, other applications suffer from slow speeds or latency. Noisy neighbor can affect Web hosting, databases, networks, storage and servers.

缺乏带宽是网络性能问题的一个原因.在网络带宽带来的数据,因此,当一个应用程序或实例使用太多,其他应用程序遭受缓慢的速度或延迟.坏邻居会影响虚拟主机、数据库、网络、存储和服务器。


One way to avoid the noisy neighbor effect is to use a bare-metal cloud. The bare-metal cloud runs one application at a time directly on the hardware, which creates a single-tenant environment and eliminates noisy neighbors. While single-tenant environments avoid the noisy neighbor effect, they do not solve the problem. Infrastructure over-commitment, or when an environment is shared by too many applications, limits overall cloud performance.

避免坏邻居效应的一种方法是使用一个裸机云.根据《bare-metal cloud runs one获得直接on The硬件在具体计划中得到体现single-tenant noisy获得环境和eliminates.而单租户环境避免坏邻居效应,他们不解决问题.基础设施过度承诺,或者当一个环境由太多的应用程序共享,限制了云的整体性能。


Another way to avoid noisy neighbors in the cloud is to ensure an application receives the necessary resources by moving workloads across physical servers. In addition, storage quality of service (QoS) controls a VM's input/output operations per second (IOPS), which can limit the noisy neighbor effect. Set IOPS limits can control the amount of resources each VM receives. Therefore, no single VM, application or instance monopolizes resources and hinders the performance of others.

另一种避免坏邻居在云中是确保应用程序接收必要的资源通过移动物理服务器上的工作负载.此外,存储的服务质量(QoS)控制VM的每秒输入/输出操作(IOPS),它可以限制坏邻居效应.设置IOPS限制可以控制每个VM接收的资源数量。因此,没有一个VM、应用程序或实例垄断资源和阻碍他人的表现。
























http://www.networkcomputing.com/storage/eliminating-noisy-neighbors-public-cloud/22442379/page/0/1


http://www.ithome.com/html/it/267407.htm

http://searchcloudcomputing.techtarget.com/definition/noisy-neighbor-cloud-computing-performance


