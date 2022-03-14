# elasticsearch 入门实战

elasticsearch，简称es, 是一个封装好的搜索引擎服务器。

> Lucene 是由一个 Java 语言开发的开源全文检索引擎工具包。
> 把 Lucene 用 Netty 封装成服务，使用 JSON 访问就是 Elasticsearch。
> 引用《Elasticsearch 搜索引擎开发实战》

## Docker安装

如果是本地测试或者开发, 可以试用Docker来快速搭建服务.

需要确保本地安装好了Docker服务, 内存和磁盘等资源也足够, 否则可能会启动不起来多个docker服务。

参考官方文档: [Install Elasticsearch with Docker](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#_install_docker_desktop_or_docker_engine)


### docker-compose 方式

第1种方式, 使用 docker-compose 启动;

```shell
# 创建目录和创建文件

mkdir -p es-docker
cd es-docker
touch .env
touch docker-compose.yml

# vim .env
# vim docker-compose.yml

# 启动 docker-compose:
# docker-compose up -d

```

然后使用vim或者其他工具编辑相关文件;


> `.env` 文件内容参考: [`.env`](./.env)

```shell
# 用户 'elastic' 的密码 (至少6字符, 不能纯数字)
ELASTIC_PASSWORD=abc123
# 用户 'kibana_system' 的密码 (至少6字符, 不能纯数字);
KIBANA_PASSWORD=abc123
# Elastic的Docker版本
STACK_VERSION=8.1.0
# Set the cluster name
CLUSTER_NAME=docker-cluster
# Set to 'basic' or 'trial' to automatically start the 30-day trial
LICENSE=basic
#LICENSE=trial

# Elasticsearch 暴露到宿主机的 HTTP API 端口号; 注意可能是 https 协议;
ES_PORT=9200
#ES_PORT=127.0.0.1:9200
# Kibana暴露到宿主机的端口号
KIBANA_PORT=5601
#KIBANA_PORT=80

# Increase or decrease based on the available host memory (in bytes)
MEM_LIMIT=1073741824
# Project namespace (defaults to the current folder name if not set)
#COMPOSE_PROJECT_NAME=myproject
```

注意这里的密码必须是字符串, 不能纯数字, 对应的Kibana用户名是 `elastic`;

> kibana_1   [config validation of [elasticsearch].password]: expected value of type [string] but got [number]

我设置密码为纯数字 `123456` 就报了这个错;



> `docker-compose.yml` 文件内容参考: [docker-compose.yml](./docker-compose.yml)




命令行后台启动:

```shell
# 启动 docker-compose:
docker-compose up -d

# 这个集群要求至少4g内存;

# 关闭 docker-compose
# docker-compose down

```

访问Kibana: http://localhost:5601

访问ElasticSearch: https://localhost:9200/


> 说明: 生产环境的配置请参考官方文档.


### 使用docker命令行方式


第2种方式, 使用docker命令行启动:

```shell
# 拉取elasticsearch的docker镜像到本地
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.1.0

# 创建es网络
docker network create elastic

# 启动es
docker run --name es01 --net elastic -p 9200:9200 -p 9300:9300 -it docker.elastic.co/elasticsearch/elasticsearch:8.1.0

# 使用环境变量设置堆内存
# docker run -e ES_JAVA_OPTS="-Xms1g -Xmx1g" -e ENROLLMENT_TOKEN="<token>" --name es02 -p 9201:9200 --net elastic -it docker.elastic.co/elasticsearch/elasticsearch:docker.elastic.co/elasticsearch/elasticsearch:8.1.0


# 关注控制台显示的密码
# 也可以修改密码
# docker exec -it es01 /usr/share/elasticsearch/bin/elasticsearch-reset-password

# 把CA证书拷贝到宿主机
docker cp es01:/usr/share/elasticsearch/config/certs/http_ca.crt .

# 通过ca证书访问
curl --cacert http_ca.crt -u elastic https://localhost:9200

```


## 下载与安装

首先通过百度或者谷歌, 搜索 `elasticsearch`, 找到对应的官网: <https://www.elastic.co/>

然后找到对应的下载页面, 例如: <https://www.elastic.co/downloads/elasticsearch>

根据操作系统找到对应的安装包, 然后下载即可。

一般来说, 我们需要下载的是 `.zip` 或者 `.tar.gz` 包。

因为压缩包属于绿色版软件, 下载之后解压到安装目录即可。

> 作为好习惯，Java相关的软件尽量安装到没有空格、没有中文的文件目录下。
> 例如Windows下: `D:\Develop\`, 解压后的目录为 `D:\Develop\elasticsearch-6.6.0`


因为 elasticsearch 是基于Java开发的, 需要先安装JDK并设置系统环境变量 `JAVA_HOME` 才能启动。

例如 `JAVA_HOME` 的值为 `D:\Develop\Java\jdk1.8.0_191`;

最好将对应的bin目录也加到Path环境变量的最前面, 如 `%JAVA_HOME%\bin`, 这等价于 `D:\Develop\Java\jdk1.8.0_191\bin`;

安装完成之后, 双击或者命令行执行bin目录下的 `elasticsearch.bat` 文件即可启动。 全路径如同:

```
D:\Develop\elasticsearch-6.6.0\bin\elasticsearch.bat
```

> `.bat`是Windows批处理脚本文件后缀, Linux系统对应的ES启动脚本没有这个后缀。
> 如果启动报错, 需要在命令行执行才能看到相关的错误信息提示。

从启动日志中可以看到, 默认监听了2个端口, `Netty4HttpServerTransport: 127.0.0.1:9200` 和  `TransportService: 127.0.0.1:9300`;

其中, 9200端口是http服务; 9300端口是给Java API等客户端使用的。 因为默认监听的IP是 `127.0.0.1`, 所以其他机器暂时是不能访问的。

通过浏览器访问 <http://localhost:9200/> , 可以看到下面这样的响应信息:

```
{
  "name" : "kOLJOFl",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "osSkUBltT36NpUW2obWRIw",
  "version" : {
    "number" : "6.6.0",
    "build_flavor" : "default",
    "build_type" : "zip",
    "build_hash" : "a9861f4",
    "build_date" : "2019-01-24T11:27:09.439740Z",
    "build_snapshot" : false,
    "lucene_version" : "7.6.0",
    "minimum_wire_compatibility_version" : "5.6.0",
    "minimum_index_compatibility_version" : "5.0.0"
  },
  "tagline" : "You Know, for Search"
}
```

证明安装完成, 启动成功。

健康检测相关的URL为: <http://localhost:9200/_cluster/health?pretty>

查看状态相关的URL为: <http://localhost:9200/_stats?pretty=true>

其中, `?pretty`参数表示对返回的JSON进行格式化/美化。


## Java-API简介

根据官方指南, Elasticsearch 内置两种客户端:

- 节点客户端（Node client）
  节点客户端作为一个非数据节点加入到本地集群中。换句话说，它本身不保存任何数据，但是它知道数据在集群中的哪个节点中，并且可以把请求转发到正确的节点。Java 客户端作为节点必须和 Elasticsearch 有相同的主版本号；

- 传输客户端（Transport client）
  轻量级的传输客户端可以将请求发送到远程集群。它本身不加入集群，但是它可以将请求转发到集群中的一个节点上。

两种 Java 客户端都通过 `9300` 端口并使用 Elasticsearch 的原生传输协议和集群交互。集群中的节点通过端口 `9300` 彼此通信。如果这个端口没有打开，节点将无法形成一个集群。

其他语言需要通过端口 9200 的RESTful API, 和 Elasticsearch 进行通信。当然,也有Java版本的REST Client。


一般来说，我们使用的是 Java API, 即`transport`, 对应的Maven依赖为:

```
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>transport</artifactId>
    <version>6.6.0</version>
</dependency>
```

API-参考文档的地址为: <https://www.elastic.co/guide/en/elasticsearch/client/java-api/current/index.html>



## 创建Spring项目

1. 打开Spring Initializr: https://start.spring.io/
2. 选择相关配置项;
3. 增加SpringWeb和MySQL依赖;
4. 配置页面分享: [es-demo](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.6.4&packaging=jar&jvmVersion=11&groupId=com.rc&artifactId=es-demo&name=es-demo&description=Demo%20project%20for%20Spring%20Boot%20%2B%20es&packageName=com.rc.esdemo&dependencies=web,mysql)
5. 下载项目, 解压, 导入项目;
6. 查找依赖; 打开仓库网站: http://www.mvnrepository.com/
7. 搜索 elasticsearch, 加入到项目的 `pom.xml` 中;



## 客户端API依赖

各个版本的ES的客户端API变化较大, 网络上的资源基本上不可用, 主要是参考官方文档: [Elasticsearch Java API Client](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/index.html)

```xml
    <dependency>
      <groupId>co.elastic.clients</groupId>
      <artifactId>elasticsearch-java</artifactId>
      <version>8.1.0</version>
    </dependency>
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.12.3</version>
    </dependency>
	<!-- https://mvnrepository.com/artifact/org.glassfish/jakarta.json -->
	<dependency>
		<groupId>org.glassfish</groupId>
		<artifactId>jakarta.json</artifactId>
		<version>2.0.1</version>
	</dependency>
```

加入到项目的 `pom.xml` 中;


## 简单查询


```java

```


## 从MySQL抽数据


## 引入中文分词器




## 相关链接

- [Elasticsearch Java API Client](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/index.html)
- 参考手册英文版: <https://www.elastic.co/guide/en/elasticsearch/reference/current/>
- [Install Elasticsearch with Docker](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)
- 权威指南中文版: <https://www.elastic.co/guide/cn/elasticsearch/guide/cn/>
- Elastic 中文社区: <https://elasticsearch.cn/>
- curl-Windows版本: <https://curl.haxx.se/windows/>

铁锚 <http://blog.csdn.net/renfufei>

时间: 2019年02月12日
