10分钟折腾HBase
==

## HBase简介

### 官方简介

Apache HBase 是基于 Hadoop 的数据库(database), 具有分布式(distributed), 可扩展(scalable), 大数据存储(big data store)等特性。

### 适用情境

当需要对大数据进行实时的随机读/写访问时可以使用Apache HBase. HBase项目的目标是管理非常大的表 —— 几十亿行 X 几百万列, 在普通硬件所组成的集群上。 Apache HBase是一个开源的、分布式、带版本的非关系型数据库. 参考谷歌 Chang et al 发表的 [Bigtable: A Distributed Storage System for Structured Data](http://research.google.com/archive/bigtable.html). 就像 Bigtable 使用了分布式文件系统Google File System一样, Apache HBase 在 Hadoop 和 HDFS 的基础上提供 Bigtable 的功能。

### 特性

- 线性和模块化的可伸缩性。
- 严格一致的读和写。
- 表的自动且可配置的分片(sharding)。
- 支持 RegionServers 之间的自动故障转移。
- 用于以 Apache HBase 表作为 Apache Hadoop MapReduce 作业后端的便捷基类。
- 用于客户端访问的易用 Java API。
- 用于实时查询的块缓存和布隆过滤器(Bloom Filters)。
- 通过服务端过滤器实现查询谓词下推。
- Thrift 网关，以及支持 XML、Protobuf 和二进制数据编码选项的 REST-ful Web 服务。
- 可扩展的、基于 jruby 的外壳(JIRB)。
- 支持通过 Hadoop 指标子系统将指标导出到文件或 Ganglia；也可通过 JMX 导出。



相关链接如下:

HBase官网: [http://hbase.apache.org/](http://hbase.apache.org/)

HBase 手册中文版: [http://hbase.apache.org/book/book.html](http://hbase.apache.org/book/book.html)

HBase官方文档中文版: [http://abloz.com/hbase/book.html](http://abloz.com/hbase/book.html)


下面是一段简短的快速入门文档, 原文地址为: [http://hbase.apache.org/book/quickstart.html](http://hbase.apache.org/book/quickstart.html)




























日期: 2014-11-24

人员: [铁锚](http://blog.csdn.net/renfufei)