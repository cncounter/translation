10分钟折腾HBase
==

## HBase简介

### 官方简介

Apache HBase 是基于 Hadoop 的 database, 具有分布式(distributed), 可扩展(scalable), 大数据存储(big data store)等特性.

### 适用情境

当需要对大数据进行实时的随机读/写访问时可以使用Apache HBase. HBase项目的目标管理非常大的表 —— 几十亿行 X 几百万列, 在普通硬件所组成的集群上。 Apache HBase是一个开源的分布式版本非关系型数据库. 参考谷歌 Chang et al 发表的 [Bigtable: A Distributed Storage System for Structured Data](http://research.google.com/archive/bigtable.html). 就像 Bigtable leverages 使用了分布式文件系统Google File System一样, Apache HBase 在 Hadoop 和 HDFS 的基础上提供 Bigtable 的功能。

特性

线性和模块化的可伸缩性。
严格一致的读和写。
且可配置的自动切分的表
自动故障转移支持RegionServers之间。
方便的基类来支持与Apache Hadoop MapReduce工作HBase表。
易于使用的客户端访问的Java API。
实时查询块缓存和布鲁姆过滤器。
通过服务器端过滤查询谓词下推
节俭网关和REST-ful Web服务支持XML,Protobuf和二进制数据编码选项
可扩展jruby-based(JIRB)外壳
通过Hadoop支持出口指标指标子系统文件或神经节;或通过JMX



相关链接如下:

HBase官网: [http://hbase.apache.org/](http://hbase.apache.org/)

HBase 手册中文版: [http://hbase.apache.org/book/book.html](http://hbase.apache.org/book/book.html)

HBase官方文档中文版: [http://abloz.com/hbase/book.html](http://abloz.com/hbase/book.html)


下面是一段简短的快速入门文档, 原文地址为: [http://hbase.apache.org/book/quickstart.html](http://hbase.apache.org/book/quickstart.html)




























日期: 2014-11-24

人员: [铁锚](http://blog.csdn.net/renfufei)