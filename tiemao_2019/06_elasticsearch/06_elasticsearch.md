# elasticsearch 入门实战

elasticsearch，简称es, 是一个封装好的搜索引擎服务器。

> Lucene 是由一个 Java 语言开发的开源全文检索引擎工具包。
> 把 Lucene 用 Netty 封装成服务，使用 JSON 访问就是 Elasticsearch。
> 引用《Elasticsearch 搜索引擎开发实战》

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

安装完成之后, 双击或者命令行执行bin目录下的 `elasticsearch.bat` 文件即可启动。 全路径如同: `D:\Develop\elasticsearch-6.6.0\bin\elasticsearch.bat`

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

健康检测相关的URL为: <http://localhost:9200/_cluster/health>


## Java-API简介



## 从MySQL抽数据


## 简单查询


## 引入中文分词器




## 相关链接


- 入门教程英文版: <https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html>


铁锚 <http://blog.csdn.net/renfufei>

时间: 2019年02月12日