# NFS server and client installation on CentOS 7

# CentOS 7 安装 NFS 服务端和客户端


This guide explains how to configure NFS server in CentOS 7.0 Network File System (NFS) is a popular distributed filesystem protocol that enables users to mount remote directories on their server. The system lets you leverage storage space in a different location and write onto the same space from multiple servers in an effortless manner. It, thus, works fairly well for directories that users need to access frequently. This tutorial explains the process of mounting NFS share on an CentOS 7.0 server in an simple and easy-to-follow steps.

本文介绍如何在CentOS 7.0上配置NFS服务, NFS(网络文件系统)是一种流行的分布式文件系统协议, 允许用户挂载远端的文件系统. 这样就可以在多台服务器上, 共享地读写同一个地方的数据. 因此, 对于经常访问的数据来说非常友好。本教程讲解 NFS 服务的挂载,以及共享。 主机操作系统为 CentOS 7.0 ; 步骤非常简单。

关于 CentOS 5 和 CentOS 6 安装和使用 NFS,请参考: [http://blog.csdn.net/renfufei/article/details/17789817](http://blog.csdn.net/renfufei/article/details/17789817)


### 1 Preliminary Note

### 1. 使用情景


I have fresh installed CentOS 7.0 server, on which I am going to install the NFS server. My CentOS server have hostname `download1.cncounter.com` and IP as `10.172.115.120`

有一台 CentOS 7.0 的服务器, 里面存储了一些数据。准备作为NFS服务器, hostname 为 `download1.cncounter.com`; 内网IP为: `10.172.115.120`


You can have your CentOS server installed from the [tutorial](http://www.howtoforge.com/centos-7-server). Alternatively we need a CentOS 7.0 client machine either server/desktop. I my case I will use an CentOS 7.0 desktop with hostname  `download2.cncounter.com` and IP as `10.172.104.25` Again I will be running all the commands with root credentials.

安装CentOS服务器的教程请参考: [http://www.howtoforge.com/centos-7-server](http://www.howtoforge.com/centos-7-server)。 另外新买了一台 CentOS 7.0, 也是WEB服务器, 准备共享 download1 机器上的存储, 这样就可以充分利用两台机器的带宽. 域名为 `download2.cncounter.com` and IP as `10.172.104.25`, 


在安装过程中, 使用 `root` 用户登录和操作。 如果不是 root 用户, 可以通过 sudo 执行, 或者切换到 root; 如果没有 sudo 权限, 那么请联系系统管理员。


### 2 At NFS server end

### 2. NFS服务端配置


Now we will install these packages at the CentOS 7.0 server end as:

首先安装 nfs-utils 包:


    yum install nfs-utils


Now the configuration part will include as:

现在配置的部分将包括:


    mkdir -p /usr/local/download



Change the permissions of the folder as follows:


修改此文件夹的权限:


    chmod -R 777 /usr/local/download




We have used `/usr/local/download` as, if we uses any other drive such as any `/home` directory then it will cause a massive permissions problem and ruin the whole hierarchy. If in case we want to share the `/home` directory then permissions must not be changed.

请注意, 有些目录不应该在多个系统之间共享, 例如 `/home` 目录等等, 操作不当可能会导致某些隐患甚至引起系统崩溃.

要共享的目录必须修改权限, 此处是: `/usr/local/download`。


Next we need to start the services and add them to the boot menu. 

接下来, 添加相应的服务并启动。


    systemctl enable rpcbind

    systemctl enable nfs-server

    systemctl enable nfs-lock

    systemctl enable nfs-idmap

    systemctl start rpcbind

    systemctl start nfs-server

    systemctl start nfs-lock

    systemctl start nfs-idmap


Now we will share the NFS directory over the network a follows:

接着编辑`/etc/exports` 文件


    vim /etc/exports


输入以下内容, 共享NFS目录:

    /usr/local/download    10.172.104.25(rw,sync,no_root_squash,no_all_squash)


Note 10.172.104.25 is the IP of client machine, if you wish that any other client should access it you need to add the it IP wise other wise you can add "***"** instead of IP for all IP access.


注意这里限定了哪些客户端IP可以挂载此NFS, `10.172.104.25` 的意思是只有这一个IP 能访问. 如果希望通过网段的方式进行授权、 则可以使用下面这些形式:


	10.172.104.0/24
	10.172.0.0/16
	*

其中 `/24` 表明网段为 `10.172.104.*` ; `/16` 表示网段为 `10.172.*.*`; 如果只指定一个星号 `*`, 则表示不限制客户端IP.


Condition is that it must be pingable at both ends.

服务端和客户端之间必须能互相 ping 通。


Finally start the NFS service as follows:

最后, 需要重新启动NFS服务:


    systemctl restart nfs-server



Again we need to add the NFS service override in CentOS 7.0 firewall-cmd public zone service as:

当然, 需要配置防火墙,以允许 NFS 服务:


    firewall-cmd --permanent --zone=public --add-service=nfs
    firewall-cmd --reload


Note: If it will be not done, then it will give error for Connection Time Out at client side.

注意: 如果被防火墙拦截, 那么客户端会显示连接超时错误(Connection Time Out)。


Now we are ready with the NFS server part.

现在我们已经准备好与NFS服务器部分。


### 3 NFS client end

### 3. NFS客户端


In my case I have the client as CentOS 7.0 desktop. Other CentOS versions will also work for the same. Install the packages as follows:

就我而言我有CentOS 7.0桌面客户端。其他CentOS版本也将同样的工作。安装包如下:


    yum install nfs-utils




Now create the NFS directory mount point as follows:

现在创建NFS挂载点的目录如下:


    mkdir -p /mnt/nfs/home

    mkdir -p /mnt/nfs/usr/local/download

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


It will mount /homeof NFS server. Next we will /usr/local/download mount as follows:

它将挂载/赛场NFS服务器。接下来我们将/usr/local/download安装如下:


    mount -t nfs 10.172.115.120:/usr/local/download /mnt/nfs/usr/local/download/




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

    10.172.115.120:/usr/local/download   39G  980M   38G   3% /mnt/nfs/usr/local/download

    10.172.115.120:/home           19G   33M   19G   1% /mnt/nfs/home


So we are connected with NFS share.

所以我们与NFS共享。


Now we will check the read/write permissions in the shared path. At client enter the command:

现在我们将检查共享路径的读/写权限。在客户端输入命令:


    touch /mnt/nfs/usr/local/download/test_nfs




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
    10.172.115.120:/usr/local/download    /mnt/nfs/usr/local/download   nfs defaults 0 0




Note 10.172.115.120 is the server NFS-share  IP address, it will vary in your case.

注意10.172.115.120服务器nfs共享IP地址时,它在你的情况下会有所不同。


This will make the permanent mount of the NFS-share. Now you can reboot the machine and mount points will be permanent even after the reboot.

这将使永久挂载nfs共享的。现在你可以重新启动机器和挂载点永久即使在重新启动。


Cheers now we have a successfully configured NFS-server over CentOS 7.0 :)

欢呼声现在我们有一个成功配置nfs服务器在CentOS 7.0:)





作者Twitter: [Srijan Kishore](http://twitter.com/howtoforgecom)

最后编辑时间: 2014-12-16, 版本： Version 1.0 

原文链接: [https://www.howtoforge.com/nfs-server-and-client-on-centos-7](https://www.howtoforge.com/nfs-server-and-client-on-centos-7)

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

