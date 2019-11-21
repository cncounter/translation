# Open JDK Compile

本文演示在 CentOS 7操作系统平台上编译 Open JDK 11。

参考了官方文档: https://hg.openjdk.java.net/jdk/jdk11/raw-file/tip/doc/building.html


## 0. 准备工作

如果本地已经有 CentOS 操作系统, 或者可以在阿里云之类的云平台购买虚拟机，则可以忽略 Docker, 直接从 `0.3` 步骤开始即可。

我们准备借助于 Docker 来屏蔽各种系统的复杂性。 最终在内置的CentOS操作系统上执行JDK的编译任务。

所以需要先安装 Docker， 但要求操作系统版本不能太老了.

### 0.1 安装 Docker

Windows Docker 安装: https://www.runoob.com/docker/windows-docker-install.html

其他系统请参考: https://hub.docker.com/


安装完成后, 执行命令查看 docker 信息:

```
docker info
docker -v
docker --version
```

如果不报错，那就表示安装成功.

### 0.2 Docker 安装CentOS7


首先创建一个 `Dockerfile` 文件, 内容如下:

```
# 使用centos7的基础镜像
# FROM daocloud.io/library/centos:centos7

FROM centos:7
ENV container docker
RUN (cd /lib/systemd/system/sysinit.target.wants/; for i in *; do [ $i == \
systemd-tmpfiles-setup.service ] || rm -f $i; done); \
rm -f /lib/systemd/system/multi-user.target.wants/*;\
rm -f /etc/systemd/system/*.wants/*;\
rm -f /lib/systemd/system/local-fs.target.wants/*; \
rm -f /lib/systemd/system/sockets.target.wants/*udev*; \
rm -f /lib/systemd/system/sockets.target.wants/*initctl*; \
rm -f /lib/systemd/system/basic.target.wants/*;\
rm -f /lib/systemd/system/anaconda.target.wants/*;
VOLUME [ "/sys/fs/cgroup" ]
CMD ["/usr/sbin/init"]
```

然后执行docker构建命令:

```
docker build --rm -t local/c7-systemd .
```

构建成功后，可以查看本地镜像中存在 `local/c7-systemd`：

```
docker image list
```

启动容器并进入命令行:

```
docker run -ti -v /sys/fs/cgroup:/sys/fs/cgroup:ro local/c7-systemd
docker run -ti centos:7
```

启动成功， 则自动进入CentOS命令行.


### 0.3 CentOS7的操作


1. 安装版本控制软件 Mercurial:


```
yum install -y hg

```

> 说明: `Mercurial` 的意思是 `水银`, 也就是 `汞`, 缩写是化学符号 `Hg`。

hg 和 git 有得一拼, 由于出现先后的历史原因， 以及考虑历史兼容性, 后设计出来的版本控制系统会回避掉先出现的系统的一些问题。
而 OpenJDK 等项目一直使用 `hg`。

安装完成后, 查看版本信息:

```
hg version
```


2. clone源码:


进入基本目录并下载最新源码:

```
mkdir -p /usr/local/
cd /usr/local/

hg clone http://hg.openjdk.java.net/jdk/jdk
```

JDK10之后，项目的源码都在同一个仓库中。

如果想要构建 JDK8， 则应该使用 `jdk8u`, 因为 `jdk8` 只更新到GA版本。 例如:

```
hg clone http://hg.openjdk.java.net/jdk8u/jdk8u
```

然后慢慢等待，可能得30分钟以上。


3. 配置




0.1 安装JDK8作为启动JDK。

```
yum install -y java-1.8.0-openjdk*

```


0.2 需要先安装一些依赖:

```
yum groupinstall -y "Development Tools"

yum install -y alsa-lib-devel cups-devel libX* gcc gcc-c++ freetype-devel libstdc++-static ant make autoconf which

```


进入源码目录, 并执行 `configure` 文件：

```
cd /usr/local/
cd jdk
bash configure
```


JDK 需要使用 GNU Bash.  并不支持其他 shell.



然后，尝试执行 `make` 命令，

```
make
```

提示如下:

```
make
Building OpenJDK for target 'default' in configuration 'linux-x86_64-normal-server-release'

## Starting langtools
/bin/sh: line 0: cd: /usr/local/tools/jdk8u60/langtools/make: No such file or directory
make: *** [langtools-only] Error 1
```

大致意思是缺少 `langtools` 目录, 怎么办呢?

```
chmod +x get_source.sh
./get_source.sh
```

等待下载...

如果下载报错, 请尝试再次执行...


然后执行 `make` 命令，

```
make
```

或者:

```
make CONF=linux-x86_64-normal-server-release
```

等待...


官方文档: https://hg.openjdk.java.net/jdk/jdk11/raw-file/tip/doc/building.html
