Hadoop的发展开辟了对数据迁移工具的需求
==

### Hadoop 的成功,催生了对开箱即用的数据迁移解决方案不断增长的需求


过去几年里,Hadoop 的火爆已经成为一种现象。[一项估计](http://www.alliedmarketresearch.com/hadoop-market) 认为,其市场规模将同比增长近 60%,达到 500 亿美元。随着供应商对 Hadoop 需求的热切吸纳,一种新的需求也由此形成:需要供应商出售 Hadoop 数据迁移工具和服务。

理论上,把数据导入 Hadoop 是软件和用户能力范围内的事。Apache 的 [Sqoop](http://sqoop.apache.org/) 项目就是为处理 Hadoop 的导入导出而创建的,原生支持那些常见的“嫌疑犯”:MySQL、Oracle、PostgreSQL、HSQLDB。但并不是每个人都愿意干这种活,所以供应商们提供了需要更少人工的导入/导出解决方案。

对于那些已经拥有其他数据迁移解决方案的公司来说,这些既有平台是一个自然的机会。例如,Attunity 是各种数据移动解决方案的制造商,[Attunity Replicate](http://www.attunity.com/products/attunity-replicate) 除了 Hadoop,还能处理许多数据源和目标,如 Oracle、SQL Server、DB2 和 Teradata。Attunity 提供了专为广域网传输优化的方案,显然是想吸引那些试图迁移数 TB 数据的用户。

同样,[Diyotta DataMover](http://diyotta.com/wp-content/uploads/2013/04/Diyotta-DataMover-Data-Sheet.pdf) 也支持把 Hadoop 作为源或目标,同时还支持数量同样庞大的一批数据格式和存储库。

[Syncsort](http://www.cloudera.com/content/cloudera/en/solutions/partner/Syncsort.html) 专门针对大型机领域,它与 Cloudera 合作创建了一个系统,可以直接从现有主机采集数据并加载到 Hadoop。Syncsort 首席执行官 Lonna Jaffe [形容它](http://searchdatamanagement.techtarget.com/opinion/Hadoop-role-eyed-in-mainframe-modernization-and-migration) 是“一个你可以按下的按钮,把昂贵的工作负载吸走”。

这些产品的主要卖点并不是支持的数据源数量,而是它的便利性和“expertise-in-a-box”(把专业知识装进盒子)的做法。像 [Hortonworks](http://hortonworks.com/support/) 这样的 Hadoop 供应商,通过提供自己的支持和迁移服务来竞争,所以它们可能没有多少动力把 Sqoop 打造成一个成熟的第三方替代产品。

对于任何一款详细的 Hadoop 数据迁移产品来说,至关重要的一点是它能否经得住时间的考验——具体来说,就是能否应对 Hadoop 后续所做的更改。这不只是把 MapReduce 换成 YARN 那么简单,还需要包含对即将推出的 Hadoop 数据安全框架 [Apache Argus](http://argus.incubator.apache.org/) 的支持。

在处理 Hadoop 数据迁移方面,最好的长期投资也许就是理解现有的工具集并充分利用它们。你可能不会愿意让自己写的 Sqoop 导入连接器去承担关键任务,但从长远来看,这些工作可能会带来回报——无论是为了将来向内迁移,还是在有更大、更有雄心的 Hadoop 方案可选时。



#### 相关阅读:

* [**大数据分析的8大趋势**](http://www.javaworld.com/article/2848033/big-data/8-big-trends-in-big-data-analytics.html)
* 
* [**DataStax Enterprise 4.5 超强的速度与安全性**](http://www.javaworld.com/article/2452982/big-data/datastax-enterprise-4-5-turbocharges-speed-and-security.html)
* 
* [**团队竞争: Hortonworks, 与 Pivotal加入Hadoop项目组**](http://www.javaworld.com/article/2597522/learn-java/what-i-wish-id-known-starting-out-as-a-programmer.html)


原文链接: [Hadoop's growth opens up demand for data migration tools](http://www.javaworld.com/article/2840352/data-storage/hadoops-growth-opens-up-demand-for-data-migration-tools.html)



原文日期: 2014年10月27日

翻译日期: 2014年11月14日

翻译人员: [铁锚: http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)





