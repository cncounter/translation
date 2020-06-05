# 迁移Ubuntu下MySQL的data目录

> 背景是默认的系统盘空间不够，需要将data目录迁移到挂载大磁盘的目录下。


一般需要先备份，再进行迁移。

Ubuntu下MySQL的数据目录是 `/var/lib/mysql`, 改变这个目录比较麻烦，所以我们的策略是将目录下的数据迁移到另一个地方，然后使用 ln 软链接将这个目录指向目标地址。



## 首先切换到 root 权限

```
sudo su
# 或者
sudo sudo su
```


## 查看磁盘使用情况

```
# 磁盘挂载与使用量
df -h

# 目录文件大小统计
cd /data
du -sh *
```

## 停止MySQL服务

```
# 查看状态
service mysql status
# 停止服务
service mysql stop
```

## 拷贝目录


```
# 创建目录
mkdir -p /data/mysql
# 修改权限
chown -R mysql:mysql /data/mysql
# 拷贝文件
nohup cp -a -r /var/lib/mysql/* /data/mysql/

# 备份并创建新目录
mv /var/lib/mysql /var/lib/mysql_bak

# 创建软链接
ln -s /data/mysql /var/lib/mysql
# 修改权限
chown -R mysql:mysql /var/lib/mysql

```



## 启动MySQL服务

```
# 启动服务
service mysql start
# 查看状态
service mysql status
```




如果迁移失败，需要重新安装MySQL。




## 卸载MySQL服务

```
apt-get purge -y mysql-server mysql-client mysql-common mysql-server-core-* mysql-client-core-*
rm -rf /etc/mysql /var/lib/mysql
apt-get autoremove -y
apt-get autoclean
```


## 安装MySQL

```
apt-get install -y mysql-server
```

## 暂停服务器

```
# 停止服务
service mysql stop

```

## 修改配置文件

文件 `/etc/mysql/mysql.conf.d/mysqld.cnf`

修改以下内容:

```
# bind-address          = 127.0.0.1
bind-address            = 0.0.0.0

# datadir         = /var/lib/mysql
datadir         = /var/lib/mysql
```


## 启动服务器

```
# 启动服务
service mysql start

```


## 免密登录

```
mysql --defaults-file=/etc/mysql/debian.cnf

```

## root 登录

```
mysql -u root -proot

```


## 创建用户和授权



```
CREATE USER 'someuser'@'%' IDENTIFIED BY 'someuser';
grant all privileges on *.* to 'someuser'@'%' IDENTIFIED BY 'someuser';
flush privileges;

```



## 处理文件数量限制

因为数据库太多，建表时报错:

```
[ERROR in query 1] Out of resources when opening file 'xxx' (Errcode: 24 - Too many open files)
Execution stopped!
```

修改文件 `/etc/systemd/system.conf`, 设置以下内容

```
DefaultLimitNOFILE=infinity
DefaultLimitMEMLOCK=infinity
```

然后执行:

```shell
systemctl daemon-reload

service mysql restart

```

参考: https://stackoverflow.com/questions/44006977/how-to-fix-too-many-open-files-in-mysql



注意安全组件的限制：

- SeLinux
- ACL
- AppArmor











- <>
