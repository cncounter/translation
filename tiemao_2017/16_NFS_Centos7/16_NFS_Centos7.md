# NFS server and client installation on CentOS 7

# NFS服务器和客户端安装CentOS 7


    Version 1.0 

    Author: Srijan Kishore &lt;s [dot] kishore [at] ispconfig [dot] org&gt;

    [Follow howtoforge on Twitter](http://twitter.com/howtoforgecom)

    Last edited 16/Dec/2014

This guide explains how to configure NFS server in CentOS 7.0 Network File System (NFS) is a popular distributed filesystem protocol that enables users to mount remote directories on their server. The system lets you leverage storage space in a different location and write onto the same space from multiple servers in an effortless manner. It, thus, works fairly well for directories that users need to access frequently. This tutorial explains the process of mounting NFS share on an CentOS 7.0 server in an simple and easy-to-follow steps.

本指南解释了如何配置NFS服务器在CentOS 7.0网络文件系统(NFS)是一种流行的分布式文件系统的协议,它允许用户安装远程目录服务器.系统可以利用存储空间在不同的位置和写在同一空间以一种毫不费力的方式从多个服务器.,因此,工作相当好目录,用户经常需要访问。本教程说明安装NFS共享的过程在一个CentOS 7.0服务器在一个简单和后续步骤。


### 1 Preliminary Note

### 1初步报告


I have fresh installed CentOS 7.0 server, on which I am going to install the NFS server. My CentOS server have hostname `download1.cncounter.com` and IP as `10.172.115.120`

我有新的安装CentOS 7.0服务器,我要安装NFS服务器。我的CentOS服务器主机名“download1.cncounter.com”和IP作为“10.172.115.120”


You can have your CentOS server installed from the [tutorial](http://www.howtoforge.com/centos-7-server). Alternatively we need a CentOS 7.0 client machine either server/desktop. I my case I will use an CentOS 7.0 desktop with hostname  `download2.cncounter.com` and IP as `10.172.104.25` Again I will be running all the commands with root credentials.

你可以安装CentOS服务器(教程)(http://www.howtoforge.com/centos-7-server)。另外我们需要一个CentOS 7.0客户机或服务器/桌面.我我的情况我将使用一个CentOS 7.0桌面与主机名“download2.cncounter.com”和IP的10.172.104.25再次我将运行所有的命令和根证书。


### 2 At NFS server end

### 2在NFS服务器


Now we will install these packages at the CentOS 7.0 server end as:

现在我们的学生,特别是这些CentOS at the end as:7.0 server


    yum install nfs-utils




Now the configuration part will include as:

现在配置的部分将包括:


    mkdir /var/nfsshare




Change the permissions of the folder as follows:

改变文件夹的权限如下:


    chmod -R 777 /var/nfsshare/




We have used `/var/nfsshare` as, if we uses any other drive such as any `/home` directory then it will cause a massive permissions problem and ruin the whole hierarchy. If in case we want to share the `/home` directory then permissions must not be changed.

我们使用“/ var / nfsshare”,如果我们使用其他驱动等任何的/ home目录就会导致大规模的权限问题,毁了整个层次结构.如果如果我们想分享的/ home目录权限必须不被改变。


Next we need to start the services and add them to the boot menu. 

接下来我们需要启动的服务并将它们添加到启动菜单。


    systemctl enable rpcbind

    systemctl enable nfs-server

    systemctl enable nfs-lock

    systemctl enable nfs-idmap

    systemctl start rpcbind

    systemctl start nfs-server

    systemctl start nfs-lock

    systemctl start nfs-idmap

Now we will share the NFS directory over the network a follows:

现在我们将分享NFS目录通过网络:


    nano /etc/exports




We will make two sharing points  `/home` and `/var/nfs`. Edit it as follows:

我们将两个共享点/ home和/ var / nfs。编辑它如下:


    /var/nfsshare    10.172.104.25(rw,sync,no_root_squash,no_all_squash)
    /home            10.172.104.25(rw,sync,no_root_squash,no_all_squash)




Note 10.172.104.25 is the IP of client machine, if you wish that any other client should access it you need to add the it IP wise other wise you can add "***"** instead of IP for all IP access.

注意10.172.104.25客户机的IP,如果你希望其他客户机应该访问您需要添加它IP明智的其他明智的您可以添加“* * * * *而不是IP为所有IP访问。


Condition is that it must be pingable at both ends.

条件是它必须pingable两端。


Finally start the NFS service as follows:

最后启动NFS服务如下:


    systemctl restart nfs-server




Again we need to add the NFS service override in CentOS 7.0 firewall-cmd public zone service as:

我们需要添加NFS服务覆盖在CentOS 7.0 firewall-cmd公共区域服务:


    firewall-cmd --permanent --zone=public --add-service=nfs
    firewall-cmd --reload




Note: If it will be not done, then it will give error for Connection Time Out at client side.

注意:如果没有完成,那么它将在客户端连接超时错误。


Now we are ready with the NFS server part.

现在我们已经准备好与NFS服务器部分。


### 3 NFS client end

### 3 NFS客户端


In my case I have the client as CentOS 7.0 desktop. Other CentOS versions will also work for the same. Install the packages as follows:

就我而言我有CentOS 7.0桌面客户端。其他CentOS版本也将同样的工作。安装包如下:


    yum install nfs-utils




Now create the NFS directory mount point as follows:

现在创建NFS挂载点的目录如下:


    mkdir -p /mnt/nfs/home

    mkdir -p /mnt/nfs/var/nfsshare

Start the services and add them to boot menu.

启动服务并将它们添加到启动菜单。


    systemctl enable rpcbind

    systemctl enable nfs-server

    systemctl enable nfs-lock

    systemctl enable nfs-idmap

    systemctl start rpcbind

    systemctl start nfs-server

    systemctl start nfs-lock

    systemctl start nfs-idmap

Next we will mount the NFS shared content in the client machine as shown below:

接下来,我们将在客户端机器挂载NFS共享内容如下所示:


mount -t nfs 10.172.115.120:/home /mnt/nfs/home/

挂载nfs - t 10.172.115.120:/ home / mnt / nfs / home /


It will mount /homeof NFS server. Next we will /var/nfsshare mount as follows:

它将挂载/赛场NFS服务器。接下来我们将/var/nfsshare安装如下:


    mount -t nfs 10.172.115.120:/var/nfsshare /mnt/nfs/var/nfsshare/




Now we are connected with the NFS share, we will crosscheck it as follows:

现在我们与NFS共享,我们将反复核对如下:


    df -kh




> [root@client1 ~]# df -kh

    Filesystem                    Size  Used Avail Use% Mounted on

    /dev/mapper/centos-root        39G  1.1G   38G   3% /

    devtmpfs                      488M     0  488M   0% /dev

    tmpfs                         494M     0  494M   0% /dev/shm

    tmpfs                         494M  6.7M  487M   2% /run

    tmpfs                         494M     0  494M   0% /sys/fs/cgroup

    /dev/mapper/centos-home        19G   33M   19G   1% /home

    /dev/sda1                     497M  126M  372M  26% /boot

    10.172.115.120:/var/nfsshare   39G  980M   38G   3% /mnt/nfs/var/nfsshare

    10.172.115.120:/home           19G   33M   19G   1% /mnt/nfs/home


So we are connected with NFS share.

所以我们与NFS共享。


Now we will check the read/write permissions in the shared path. At client enter the command:

现在我们将检查共享路径的读/写权限。在客户端输入命令:


    touch /mnt/nfs/var/nfsshare/test_nfs




So successfull NFS-share done.

所以成功nfs共享。


### 4 Permanent NFS mounting

### 4永久NFS挂载


We need to mount the NFS share at client end permanent that it must be mounted even after reboot. So we need to add the NFS-share in `/etc/fstab` file of client machine as follows:

我们需要在客户端永久挂载NFS共享,必须安装后重新启动。所以我们需要添加nfs共享的客户机机器的/ etc / fstab文件如下:


    nano /etc/fstab




Add the entries like this:

添加条目如下:


    [...]




    10.172.115.120:/home    /mnt/nfs/home   nfs defaults 0 0
    10.172.115.120:/var/nfsshare    /mnt/nfs/var/nfsshare   nfs defaults 0 0




Note 10.172.115.120 is the server NFS-share  IP address, it will vary in your case.

注意10.172.115.120服务器nfs共享IP地址时,它在你的情况下会有所不同。


This will make the permanent mount of the NFS-share. Now you can reboot the machine and mount points will be permanent even after the reboot.

这将使永久挂载nfs共享的。现在你可以重新启动机器和挂载点永久即使在重新启动。


Cheers now we have a successfully configured NFS-server over CentOS 7.0 :)

欢呼声现在我们有一个成功配置nfs服务器在CentOS 7.0:)


原文链接: [https://www.howtoforge.com/nfs-server-and-client-on-centos-7](https://www.howtoforge.com/nfs-server-and-client-on-centos-7)





