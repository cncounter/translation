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
[ERROR in query 1] Out of resoucnces when opening file 'xxx' (Ercncode: 24 - Too many open files)
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




### 设置时区

```
select now();

set global time_zone = '+8:00';

flush privileges;
```


## 主从配置相关

参考:

> https://dev.mysql.com/doc/refman/5.7/en/replication-configuration.html


## 开启Bin-log

> vim /etc/mysql/my.cnf

```
[mysqld]
log-bin=/data/hh/mysql/mysql-bin-log
server-id=28

# innodb_flush_log_at_trx_commit=1
# sync_binlog=1
```


重启服务器

```
service mysql restart

```

查看Binlog相关的文件:

```
# ll /data/hh/mysql/mysql-bin-log*
-rw-r----- 1 mysql mysql 2057339 Sep 14 16:32 /data/hh/mysql/mysql-bin-log.000001
-rw-r----- 1 mysql mysql      39 Sep 14 16:26 /data/hh/mysql/mysql-bin-log.index
```



## 创建主从同步用户

```sql
-- 创建主从同步用户
CREATE USER 'replication29'@'%' IDENTIFIED BY 'replication29';
GRANT REPLICATION SLAVE ON *.* TO 'replication29'@'%';
FLUSH PRIVILEGES;

-- 查看bin-log文件以及位置
SHOW MASTER STATUS;

-- 查询用户信息
select host, user from mysql.user;

-- 查询数据库列表
show databases;

-- 退出客户端
quit

```

## 备份和还原数据库快照

> 此操作需要在连接主库之前完成。

```shell

cd /data/

# 导出所有数据库
mysqldump --all-databases --master-data > dbdump.db

# 导出特定的数据库
mysqldump -u root -p --databases db_name1 db_name2 --master-data > dbdump.db

mysqldump -u root -p --databases  hh_rr_test-1 hh_rr_test-2 hh_rr_test-5 hh_rr_test-6 hh_rr_test-7 --master-data > hh_rr_28_dbdump.db

```


## 从库配置


> vim /etc/mysql/my.cnf

```
[mysqld]
# log-bin=/data/mysql/mysql-bin-log
server-id=29

# 限定需要复制的数据库, 每行一个, 使用逗号时不生效，因为数据库名称中可能有逗号^_^。
replicate-do-db=hh_rr_test-1
replicate-do-db=hh_rr_test-2
replicate-do-db=hh_rr_test-5
replicate-do-db=hh_rr_test-6
replicate-do-db=hh_rr_test-7

```

- [replicate-do-db](https://dev.mysql.com/doc/refman/5.7/en/replication-options-replica.html#option_mysqld_replicate-do-db)


重启服务器

```
service mysql restart

```


## 设置主库的配置信息

```sql
-- 停止从库复制
STOP SLAVE;

-- 停止 slave io thread
STOP SLAVE IO_THREAD FOR CHANNEL ''；

-- 设置主库信息; 未启动 SLAVE
CHANGE MASTER TO MASTER_HOST='192.168.1.28',MASTER_PORT=3306,
  MASTER_USER='replication29',MASTER_PASSWORD='replication29';

-- 显示从库状态
SHOW SLAVE STATUS;
```

因为之前Dump时指定了 --master-data 信息, 所以可以不指定 MASTER_LOG_FILE 和 MASTER_LOG_POS 值，下面导入时自动覆盖配置。



导入数据库:

```
mysql -u root -p < hh_rr_28_dbdump.db

```



启动主从复制

```
START SLAVE;

-- 显示从库状态
SHOW SLAVE STATUS;


-- 查询只读模式
show variables like 'read_only';


-- 设置为只读模式;
SET GLOBAL read_only = ON;


-- 关闭只读模式;
SET GLOBAL read_only = OFF;



```


用户授权

```sql

-- 创建用户
CREATE USER 'cnc_server'@'%' IDENTIFIED BY 'cnc666';

-- 授权; 不影响已连接会话的权限；
GRANT DELETE, INSERT, SELECT, UPDATE ON `cnc_server_test-1`.* TO 'cnc_server'@'%';
GRANT DELETE, INSERT, SELECT, UPDATE ON `cnc_server_test-2`.* TO 'cnc_server'@'%';
FLUSH PRIVILEGES;

-- 撤销写权限; 不影响已连接会话的权限；

revoke DELETE, INSERT, UPDATE ON `cnc_server_test-2`.* from 'cnc_server'@'%';
FLUSH PRIVILEGES;

```



- <>
