# NFS server and client installation on CentOS 7

# CentOS 7 配置 NFS 服务端和客户端


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


    yum install nfs-utils -y


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

接着添加启动项, 并启动服务。


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


注意这里限定了哪些客户端IP可以挂载此NFS, `10.172.104.25` 的意思是只有这一个IP 能访问. 

如果需要共享多个目录,则可以在此处配置多条记录。

如果希望通过网段的方式进行授权、 则可以使用下面这些形式:


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


客户端 CentOS 7.0上, 首先安装 nfs-utils 包:


    yum install nfs-utils -y

如果客户端是 CentOS 6,使用下面的安装语句

```
# CentOS 6安装软件包  
yum -y install nfs-utils rpcbind 
```

显示`10.172.115.120`服务器上的nfs磁盘:

    showmount -e 10.172.115.120


Now create the NFS directory mount point as follows:

然后创建NFS挂载点:

    mkdir -p /usr/local/download/web2


Start the services and add them to boot menu.

接着添加启动项, 并启动服务。

```
# CentOS7

systemctl enable rpcbind

systemctl enable nfs-server

systemctl enable nfs-lock

systemctl enable nfs-idmap

systemctl start rpcbind

systemctl start nfs-server

systemctl start nfs-lock

systemctl start nfs-idmap
```

CentOS6客户端不需要设置这些服务。 可以直接执行下面的挂载语句


Next we will mount the NFS shared content in the client machine as shown below:

接下来, 在客户端机器挂载NFS目录:


	mount -t nfs 10.172.115.120:/usr/local/download /usr/local/download/web2


意思是将 10.172.115.120 上的 /usr/local/download 节点挂载到本机的 /usr/local/download/web2 目录。


Now we are connected with the NFS share, we will crosscheck it as follows:

如果不报错, 那就挂载好了 NFS 文件系统, 下面进行校验:




> [root@client1 ~]# df -kh

    Filesystem                    Size  Used Avail Use% Mounted on

    /dev/mapper/centos-root        39G  1.1G   38G   3% /

    devtmpfs                      488M     0  488M   0% /dev

    tmpfs                         494M     0  494M   0% /dev/shm

    tmpfs                         494M  6.7M  487M   2% /run

    tmpfs                         494M     0  494M   0% /sys/fs/cgroup

    /dev/mapper/centos-home        19G   33M   19G   1% /home

    /dev/sda1                     497M  126M  372M  26% /boot

    10.172.115.120:/usr/local/download   39G  980M   38G   3% /usr/local/download

    10.172.115.120:/home           19G   33M   19G   1% /mnt/nfs/home


So we are connected with NFS share.

证明 NFS 系统挂载成功。


Now we will check the read/write permissions in the shared path. At client enter the command:

然后测试一下 读/写权限。在客户端输入:


    touch /usr/local/download/test_nfs



So successfull NFS-share done.

OK,去服务端检查一下吧!


### 4 Permanent NFS mounting

### 4. 永久NFS挂载


We need to mount the NFS share at client end permanent that it must be mounted even after reboot. So we need to add the NFS-share in `/etc/fstab` file of client machine as follows:


如果需要在客户端永久挂载 NFS 文件系统, 则必须在重启之后依然自动挂载。 所以添加将 NFS 挂载信息添加到客户机的 `/etc/fstab`:


    nano /etc/fstab


Add the entries like this:

添加一个条目:


    10.172.115.120:/usr/local/download    /usr/local/download/web2   nfs defaults 0 0


Note 10.172.115.120 is the server NFS-share  IP address, it will vary in your case.

其中 10.172.115.120 是NFS服务器的IP地址, 请根据实际情况修改。


This will make the permanent mount of the NFS-share. Now you can reboot the machine and mount points will be permanent even after the reboot.

现在, 即使系统重新启动, 依然会自动挂载 NFS 系统。


Cheers now we have a successfully configured NFS-server over CentOS 7.0 :)

OK, 大功告成 :)




作者Twitter: [Srijan Kishore](http://twitter.com/howtoforgecom)

最后编辑时间: 2014-12-16, 版本： Version 1.0 

原文链接: [https://www.howtoforge.com/nfs-server-and-client-on-centos-7](https://www.howtoforge.com/nfs-server-and-client-on-centos-7)

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

