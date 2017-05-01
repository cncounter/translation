# NFS server and client installation on CentOS 7

Version 1.0 

Author: Srijan Kishore &lt;s [dot] kishore [at] ispconfig [dot] org&gt;

[Follow howtoforge on Twitter](http://twitter.com/howtoforgecom)

Last edited 16/Dec/2014

This guide explains how to configure NFS server in CentOS 7.0 Network File System (NFS) is a popular distributed filesystem protocol that enables users to mount remote directories on their server. The system lets you leverage storage space in a different location and write onto the same space from multiple servers in an effortless manner. It, thus, works fairly well for directories that users need to access frequently. This tutorial explains the process of mounting NFS share on an CentOS 7.0 server in an simple and easy-to-follow steps.

### 1 Preliminary Note

I have fresh installed CentOS 7.0 server, on which I am going to install the NFS server. My CentOS server have hostname server1.example.com and IP as 192.168.0.100

You can have your CentOS server installed from the [tutorial](http://www.howtoforge.com/centos-7-server). Alternatively we need a CentOS 7.0 client machine either server/desktop. I my case I will use an CentOS 7.0 desktop with hostname  client1.example.com and IP as 192.168.0.101 Again I will be running all the commands with root credentials.

### 2 At NFS server end

Now we will install these packages at the CentOS 7.0 server end as:

yum install nfs-utils

Now the configuration part will include as:

mkdir /var/nfsshare

Change the permissions of the folder as follows:

chmod -R 777 /var/nfsshare/

We have used /var/nfsshare as, if we uses any other drive such as any /home directory then it will cause a massive permissions problem and ruin the whole hierarchy. If in case we want to share the /home directory then permissions must not be changed.

Next we need to start the services and add them to the boot menu. 

systemctl enable rpcbind

systemctl enable nfs-server

systemctl enable nfs-lock

systemctl enable nfs-idmap

systemctl start rpcbind

systemctl start nfs-server

systemctl start nfs-lock

systemctl start nfs-idmap

Now we will share the NFS directory over the network a follows:

nano /etc/exports

We will make two sharing points  /home and /var/nfs. Edit it as follows:

    /var/nfsshare    192.168.0.101(rw,sync,no_root_squash,no_all_squash)
    /home            192.168.0.101(rw,sync,no_root_squash,no_all_squash)

Note 192.168.0.101 is the IP of client machine, if you wish that any other client should access it you need to add the it IP wise other wise you can add "***"** instead of IP for all IP access.

Condition is that it must be pingable at both ends.

Finally start the NFS service as follows:

systemctl restart nfs-server

Again we need to add the NFS service override in CentOS 7.0 firewall-cmd public zone service as:

firewall-cmd --permanent --zone=public --add-service=nfs

firewall-cmd --reload

Note: If it will be not done, then it will give error for Connection Time Out at client side.

Now we are ready with the NFS server part.

### 3 NFS client end

In my case I have the client as CentOS 7.0 desktop. Other CentOS versions will also work for the same. Install the packages as follows:

yum install nfs-utils

Now create the NFS directory mount point as follows:

mkdir -p /mnt/nfs/home

mkdir -p /mnt/nfs/var/nfsshare

Start the services and add them to boot menu.

systemctl enable rpcbind

systemctl enable nfs-server

systemctl enable nfs-lock

systemctl enable nfs-idmap

systemctl start rpcbind

systemctl start nfs-server

systemctl start nfs-lock

systemctl start nfs-idmap

Next we will mount the NFS shared content in the client machine as shown below:

mount -t nfs 192.168.0.100:/home /mnt/nfs/home/

It will mount /homeof NFS server. Next we will /var/nfsshare mount as follows:

 mount -t nfs 192.168.0.100:/var/nfsshare /mnt/nfs/var/nfsshare/

Now we are connected with the NFS share, we will crosscheck it as follows:

df -kh

[root@client1 ~]# df -kh

Filesystem                    Size  Used Avail Use% Mounted on

/dev/mapper/centos-root        39G  1.1G   38G   3% /

devtmpfs                      488M     0  488M   0% /dev

tmpfs                         494M     0  494M   0% /dev/shm

tmpfs                         494M  6.7M  487M   2% /run

tmpfs                         494M     0  494M   0% /sys/fs/cgroup

/dev/mapper/centos-home        19G   33M   19G   1% /home

/dev/sda1                     497M  126M  372M  26% /boot

192.168.0.100:/var/nfsshare   39G  980M   38G   3% /mnt/nfs/var/nfsshare

192.168.0.100:/home           19G   33M   19G   1% /mnt/nfs/home

[root@client1 ~]#

So we are connected with NFS share.

Now we will check the read/write permissions in the shared path. At client enter the command:

touch /mnt/nfs/var/nfsshare/test_nfs

So successfull NFS-share done.

### 4 Permanent NFS mounting

We need to mount the NFS share at client end permanent that it must be mounted even after reboot. So we need to add the NFS-share in /etc/fstab file of client machine as follows:

nano /etc/fstab

Add the entries like this:

    [...]

    192.168.0.100:/home    /mnt/nfs/home   nfs defaults 0 0
    192.168.0.100:/var/nfsshare    /mnt/nfs/var/nfsshare   nfs defaults 0 0

Note 192.168.0.100 is the server NFS-share  IP address, it will vary in your case.

This will make the permanent mount of the NFS-share. Now you can reboot the machine and mount points will be permanent even after the reboot.

Cheers now we have a successfully configured NFS-server over CentOS 7.0 :)


原文链接: [https://www.howtoforge.com/nfs-server-and-client-on-centos-7](https://www.howtoforge.com/nfs-server-and-client-on-centos-7)
