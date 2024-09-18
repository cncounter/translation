# 5分钟快速创建Redis集群


## 0. 系列文章

- 1. Redis集群入门教程: [01-cluster-tutorial.md](./01-cluster-tutorial.md)
- 2. Redis集群规范文档: [02-cluster-spec.md](./02-cluster-spec.md)
- 3. 5分钟快速创建Redis集群: [03-cluster-5-minutes](./03-cluster-5-minutes.md)



## 1. 简介

本文介绍如何快速搭建一个简单的集群。

本文档对应的可执行脚本文件为: [./install-redis-cluster.sh](./install-redis-cluster.sh); 可按需修改;

系统环境:

- 操作系统: Linux

软件环境:

- GCC

基础工具软件:

- wget
- tar



## 2. 下载源代码并编译

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


## 3. 使用 create-cluster 脚本创建集群

创建集群:

```sh
cd utils/create-cluster


# 查看帮助
./create-cluster


# 如果要修改端口号, 直接修改脚本 create-cluster 即可
# 注意: 如果需要内网其他机器访问, 需要关闭保护模式;

# 启动实例
./create-cluster start

# 创建集群; -f表示不要弹提示
./create-cluster create -f

# Linux 下查看端口号监听
lsof -iTCP -sTCP:LISTEN -n -P | grep TCP


```


默认启动的是30001开始的端口【30001 ~ 30006】。

如果需要修改端口号, 可以修改 `utils/create-cluster/create-cluster` 脚本文件中的 `PORT` 信息;

```js
CLUSTER_HOST=127.0.0.1
PORT=30000
TIMEOUT=2000
NODES=6
REPLICAS=1
PROTECTED_MODE=yes
ADDITIONAL_OPTIONS=""
```

将其中的 `PROTECTED_MODE` 修改为 `no`,
将其中的 `CLUSTER_HOST`   修改为 当前机器的IP,

```js
CLUSTER_HOST=192.168.1.100
PORT=30000
TIMEOUT=2000
NODES=6
REPLICAS=1
PROTECTED_MODE=no
ADDITIONAL_OPTIONS=""
```




查看客户端帮助信息:

```sh
redis-cli --help
```

查看客户端集群命令帮助信息:

```sh
redis-cli --cluster help
```


本文档对应的可执行脚本文件为: [./install-redis-cluster.sh](./install-redis-cluster.sh)


## 4. docker创建Redis集群

如果想要在Docker容器中使用Redis集群, 可以使用 VMware 公司出品的: [bitnami/redis-cluster](https://hub.docker.com/r/bitnami/redis-cluster)

官方提供了一个参考的文件: [docker-compose.yml](https://github.com/bitnami/containers/blob/main/bitnami/redis-cluster/docker-compose.yml)

当然, 这创建的是一个 docker 网络内的Redis集群, 只能通过创建 `docker network` 方式, 让其他Docker容器访问。 相关命令可在: [bitnami/redis-cluster](https://hub.docker.com/r/bitnami/redis-cluster) 页面中搜索  `docker network` 查找到。

有没有现成的案例可参考呢?





## 5. 相关信息

- 原文作者: 铁锚
- 原文链接: [5分钟快速创建Redis集群](https://github.com/cncounter/translation/blob/master/tiemao_2021/31_redis_cluster/03-cluster-5-minutes.md)
- 原文日期: 2022年07月06日
- 本文日期: 2024年09月14日
