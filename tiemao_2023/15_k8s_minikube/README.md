# MiniKube安装与使用教程

处理生产级流量的 Kubernetes 集群至少应具有三个节点。

Minikube 是一种轻量级的 Kubernetes 实现，可在本地计算机上创建 VM 并部署仅包含一个节点的简单集群。 

参考官方文档, k8s集群搭建的工具主要包括:

- minikube, 用于在开发或测试环境运行 kubernetes 环境, 支持 Windows、macOS 和 Linux 系统。
- kind, 能够在本地计算机上运行 Kubernetes
- kubeadm, 可以创建一个符合最佳实践的最小化 Kubernetes 集群
- 二进制安装包



## 1. 安装minikube

首先, 打开 minikube start 教程页面

> [https://minikube.sigs.k8s.io/docs/start/](https://minikube.sigs.k8s.io/docs/start/)

在页面中, 选择对应的操作系统平台, CPU 架构等信息, 确定具体的安装命令, 例如Linux平台的:

```sh
# 下载 minikube-linux-amd64 安装包, 需要网络畅通;
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

```

当然, 也可以从 github releases 页面选择安装包下载:

> [https://github.com/kubernetes/minikube/releases](https://github.com/kubernetes/minikube/releases)


## 2. 启动 minikube

minikube 要求不能使用 `root` 用户启动, 但是启动用户需要具有 admin 权限。

```sh
# 切换到非root的管理员用户
sudo su ubuntu

```

启动命令很简单:

```sh
minikube start

# 从cn站拉取docker镜像
minikube start --image-mirror-country='cn'


# 强制使用root用户启动
sudo minikube start --force --driver=docker


# 启动时-附带插件一起启用
minikube start --addons ingress --addons dashboard

```

如果启动失败, 可能需要检查, 本地是否安装了Docker或者VM驱动工具, 可参考:

> [https://minikube.sigs.k8s.io/docs/drivers/](https://minikube.sigs.k8s.io/docs/drivers/)


## 3. 停止 minikube

如果暂时不用，可以停止集群，需要的时候再启动即可。

```sh
minikube stop
```


## 4. 启动Kubernetes控制台

```sh
# 启动 dashboard 并输出一个url访问地址
minikube dashboard --url
```

这是一个前台进程, `CTRL+C` 结束.


## 5. 安装 kubectl 工具

`kubectl` 命令行工具可以对 Kubernetes 集群运行命令。 比如: 部署应用、监测和管理集群资源以及查看日志。

需要单独安装的话可以参考:

> [https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)


```sh
# 检测是否安装成功
kubectl version --client

```


如果本地机器没有单独安装, 也可以使用 minikube 内置提供的:

```sh
# 语法: minikube kubectl -- <kubectl commands>

# 
minikube kubectl -- get po -A

# 可以加别名
alias kubectl="minikube kubectl --"



```

minikube 会自动下载对应版本的 `kubectl` 工具


## 6. 启用ingress服务

```sh

# 列出当前支持的插件,以及状态
minikube addons list

# 启用ingress插件
minikube addons enable ingress 


# 查看ingress地址
kubectl get ingress

```



## 管理 minikube 集群

参考:

> [https://kubernetes.io/zh-cn/docs/tutorials/hello-minikube/](https://kubernetes.io/zh-cn/docs/tutorials/hello-minikube/)

```sh
# 查看服务
kubectl get services
```





## TODO

集成 gitlab CICD





## 相关链接

- [你好，Minikube](https://kubernetes.io/zh-cn/docs/tutorials/hello-minikube/)
- [Kubernetes 安装工具](https://kubernetes.io/zh-cn/docs/tasks/tools/)
- [Minikube踩坑实录](https://blog.csdn.net/a765717/article/details/120193786)
- [The minikube handbook](https://minikube.sigs.k8s.io/docs/handbook/)

