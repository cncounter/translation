# CentOS 7 配置 NFS 服务端和客户端


本文主要介绍 CentOS 7.0 上如何配置NFS服务。 NFS(网络文件系统)是一种流行的分布式文件存储协议, 允许挂载远程文件系统。这样就可以在多台服务器上共享数据. 对于经常读写的数据来说这非常友好。本教程通过简单的步骤, 依次讲解如何为CentOS 7.0启动 NFS 服务, 以及怎样挂载NFS文件系统。 

关于 CentOS 5 和 CentOS 6 如何安装和使用 NFS, 也可参考本文部分内容, 或者参考: [http://blog.csdn.net/renfufei/article/details/17789817](http://blog.csdn.net/renfufei/article/details/17789817)


安装CentOS服务器的教程请参考: [http://www.howtoforge.com/centos-7-server](http://www.howtoforge.com/centos-7-server)。 


### 1. 使用场景


NFS服务器,操作系统为 CentOS 7.0, 内网IP为: `10.172.104.25`, hostname 为 `web2`, 有40GB的磁盘空间, 并且存储了一些资源数据。

NFS客户端, CentOS 7.0, IP地址为 `10.172.115.120`, hostname为 `web1`, 准备共享 web2 机器上的存储, 这样就可以合并两台机器的存储.  

安装服务和挂载文件系统需要root权限, 所以本文通过 `root` 用户进行操作。 

如果不是 root 用户, 可以通过 sudo 执行, 或者通过 `sudo su` 切换到 root。



### 2. NFS服务端配置


首先安装 nfs-utils 包:


    yum -y install nfs-utils


如果服务端是 CentOS 6,使用下面的安装语句

```
# CentOS 6安装软件包  
yum -y install nfs-utils rpcbind 
chkconfig nfs on 

```


接着创建需要共享的目录, 例如:


    mkdir -p /usr/local/download


修改目录权限:


    chmod -R 777 /usr/local/download



请注意, 某些特殊的目录请不要在多个系统之间共享, 例如 `/home`, `/etc` 等, 操作不当可能会造成安全隐患甚至引起系统崩溃.

要共享的目录权限必须是`7=rwx`, 此处是: `/usr/local/download`。

然后添加启动项:


```

# CentOS7
systemctl enable rpcbind

systemctl enable nfs-server

systemctl enable nfs-lock

systemctl enable nfs-idmap
```

并启动服务:

```
# CentOS7
systemctl start rpcbind

systemctl start nfs-server

systemctl start nfs-lock

systemctl start nfs-idmap
```



然后我们编辑`/etc/exports` 文件:


    vim /etc/exports


输入以下内容, 共享NFS目录:


    /usr/local/download    10.172.115.120(rw,sync,no_root_squash,no_all_squash)


注意这里限定了哪些客户端IP可以挂载此NFS, 意思是只允许 `10.172.115.120` 这一个IP访问. 

如果需要共享多个目录,则可以在此处配置多条记录。

如果希望通过网段的方式进行授权、 则可以使用下面这些形式:


```
	10.172.104.0/24
	10.172.0.0/16
	*
```

其中 `10.172.104.0/24` 表示网段为 `10.172.104.*` ; `10.172.0.0/16` 表示网段为 `10.172.*.*`; 如果指定星号 `*`, 则不限制客户端IP.


服务端和客户端之间必须能互相 ping 通。


最后, 需要重新启动NFS服务:


    systemctl restart nfs-server


如果服务端是 CentOS 6,安装后使用下面的语句启动:

```
# CentOS 6 
/etc/init.d/rpcbind start 
/etc/init.d/nfs start 

```


当然, 需要配置防火墙,以允许 NFS 服务:


    firewall-cmd --permanent --zone=public --add-service=nfs
    firewall-cmd --reload


注意: 如果被防火墙拦截, 那么客户端会显示连接超时错误(Connection Time Out)。


现在我们已经准备好与NFS服务器部分。



### 3. NFS客户端


客户端 CentOS 7.0上, 首先安装 nfs-utils 包:


    yum install nfs-utils -y

如果客户端是 CentOS 6,使用下面的安装语句

```
# CentOS 6安装软件包  
yum -y install nfs-utils rpcbind 
```

显示`10.172.104.25`服务器上的nfs磁盘:

    showmount -e 10.172.104.25


然后创建NFS挂载点, 这个挂载点一般是一个空目录:

    mkdir -p /usr/local/download/web2


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



CentOS6客户端不需要这些设置。 可以直接执行下面的挂载语句

在客户端机器挂载NFS目录:


	mount -t nfs 10.172.104.25:/usr/local/download /usr/local/download/web2


意思是将 10.172.104.25 上的 /usr/local/download 节点挂载到本机的 /usr/local/download/web2 目录。



如果不报错, 那就挂载好了 NFS 文件系统, 下面进行校验:



```
[root@cnc-web1 ~ ]$ df -h
Filesystem            Size  Used Avail Use% Mounted on
/dev/xvda1             20G   18G  1.7G  92% /
tmpfs                 498M  7.6M  490M   2% /dev/shm
10.172.104.25:/usr/local/download
                       40G   17G   21G  46% /usr/local/download/web2
```

证明 NFS 系统挂载成功。


然后测试一下 读/写权限。在客户端输入:


    touch /usr/local/download/web2/test_nfs



OK,去服务端检查一下吧!


### 4. 开机自启动NFS挂载


如果需要在客户端重启后, 自动挂载 NFS 文件系统, 则需要将挂载信息添加到 `/etc/fstab` 文件中:


    vim /etc/fstab



添加下面这一项:


    10.172.104.25:/usr/local/download    /usr/local/download/web2   nfs defaults 0 0


其中 `10.172.104.25` 是NFS服务器的地址, 请根据实际情况修改。


现在, 即使系统重新启动, 依然会自动挂载 NFS 系统。


OK, 大功告成 :)


### 5. 卸载 nfs 挂载

找到挂载的目录，执行umount命令:

```
umount -f -l /usr/local/download/web2
```

其中:

* `-f`参数 – Force unmount (in case of an unreachable NFS system). (Requires kernel 2.1.116 or later.)

* `-l`参数 – Lazy unmount. Detach the filesystem from the filesystem hierarchy now, and cleanup all references to the filesystem as soon as it is not busy anymore. (Requires kernel 2.4.11 or later.)



作者Twitter: [Srijan Kishore](http://twitter.com/howtoforgecom)

原文链接: [https://www.howtoforge.com/nfs-server-and-client-on-centos-7](https://www.howtoforge.com/nfs-server-and-client-on-centos-7)

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

