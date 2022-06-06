# 5分钟快速创建Redis集群

本文介绍如何快速搭建一个简单的集群。

系统环境:

- 操作系统: Linux

软件环境:

- GCC

基础工具软件:

- wget
- tar



## 下载源代码并编译

```sh

# 创建并进入相应目录
mkdir -p redis_all
cd redis_all/

# 下载; 如果下载不了可以采用其他方式
wget http://download.redis.io/redis-stable.tar.gz

# 解压
tar xzf redis-stable.tar.gz

# 编译; 要求gcc, 没有请先安装
cd redis-stable
make

```

可以进行简单的验证。


## 使用 create-cluster 脚本创建集群

创建集群:

```
cd utils/create-cluster


# 查看帮助
./create-cluster


# 如果要修改端口号, 直接修改脚本 create-cluster 即可
# 注意: 如果需要内网其他机器访问, 需要关闭保护模式;

# 启动实例
./create-cluster start

# 创建集群
./create-cluster create

# Linux 下查看端口号监听
lsof -iTCP -sTCP:LISTEN -n -P | grep TCP


```


默认启动的是30001开始的端口【30001 ~ 30006】。

如果需要修改端口号, 可以修改 `utils/create-cluster/create-cluster` 脚本文件;





-
