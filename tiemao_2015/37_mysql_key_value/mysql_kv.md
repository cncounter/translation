# MySQL 作为新的 NoSQL 解决方案: 轻松应对亿级数据


MySQL现在是一个更好的NoSQL解决方案。我们这样说是因为在存储 **键/值**(key/value) 之类数据时,  MySQL 具有性能、易用性和稳定性方面的优势。MySQL引擎稳定可靠，并且社区和官方支持良好，有非常丰富的在线资料, 涵盖了各种操作、故障排查,复制以及各种使用模式等方面。基于这个原因, MySQL比起新兴的NoSQL引擎具有很大优势。


近年来,NoSQL引擎已成为主流。许多开发者将NoSQL引擎(包括:  MongoDB, Cassandra, Redis, 和 Hadoop等)视为最优解，同时不赞成使用旧的 SQL 引擎。


选择NoSQL数据库通常是因为炒作,或者是认为关系数据库解决不了和NoSQL相关的事。普通工程师在选择数据库时往往会忽视运营成本,稳定性和成熟度等问题。更多关于各种NoSQL(以及SQL)引擎的区别,以及局限性等方面的问题，请参考 Aphyr 上的 [Jepsen专栏文章](https://aphyr.com/tags/jepsen)。


本文将阐释为什么用MySQL存储 键/值 数据比大多数专用NoSQL引擎更适合的原因,并提供相应的指导步骤。


## Wix 网站的解决方案


当用户访问Wix上的某个网站页面时, 浏览器会向Wix网站服务器发送一个HTTP请求。不管是自定义域名(例如, `cncounter.com`)还是免费的Wix二级域名(如: `user.wix.com/site`)。服务器需要通过查询键/值对来将URL请求解析为相应的站点。在下面的讨论中我们将URL视为 route(路由)。


`routes` 表用来将网址解析为 site 对象。因为网站可能有多个路由, 所以是多对一的关系(many to one, N:1)。找到网站以后, 程序就加载它。site 对象机构比较复杂, 包括两个子对象列表 —— 网站使用的不同服务。下面是示例对象模型, 假设使用标准SQL数据库和规范化表结构:


![](01_sql_scheme.png)



当更新 site时, 如果使用传统的范式模型来更新多个表, 需要用事务(transaction)来保证数据的一致性(data consistency)。(注意,事务使用数据库级别的锁(DB-level lock),这会阻止并发写操作,有时也会影响相关表的并发读操作。)  使用这种模型, 可能需要在每个表中设置一个序列键(serial key),并使用外键，以及为 routes 表的 URL 字段创建索引。


但是,使用范式设计会碰到很多问题:


- 锁限制了对表的访问, 所以在高吞吐量情景下会严重影响性能。
- 读取一个对象需要使用多条SQL语句(此处是4条), 或者使用 join (这又会受延迟影响)。
- 系列键的生成使用了锁, 限制了写吞吐量。


在MySQL或者其他SQL引擎中, 并发情况和吞吐量问题都是大量出现的。因为这些缺点,实际上在存储 键/值对形式的数据时,很多开发者都倾向于使用 NoSQL 解决方案, 为了提供更好的吞吐量和并发性能, 而牺牲一些 稳定性(stability)、一致性(consistency)、和可用性(availability)。


在 Wix, 我们发现 MySQL 作为键/值存储使用时，比起作为关系数据模型时要强悍得多, 也比大多数NoSQL引擎要优秀很多。仅仅是使用MySQL作为NoSQL引擎,我们的现有系统在扩展性/吞吐量/并发/延迟等指标上都可以媲美任何NoSQL引擎。下面是一些数据:


- 跨三个数据中心的结构 (active-active-active setup, 三活)。
- 吞吐量在 200,000 RPM 数量级。
- routes 表的记录在 1亿 数量级, 占用空间为 10 GB级。
- sites 表的记录在 1亿数量级,存储空间 200 GB以上。
- 平均读取延迟在 1.0 -1.5毫秒之间(事实上,同一数据中心是 0.2 - 0.3 毫秒)。


请注意，在大多数 键/值 引擎中, 1.0 毫秒左右的延迟都是卓越的,包括开源的和基于云的! 而我们是用MySQL实现的(MySQL被认为是标准的SQL引擎)。



表结构如下:


![](02_kv_mysql.png)


	CREATE TABLE `routes` (
	  `route` varchar(255) NOT NULL,
	  `site_id` varchar(50) NOT NULL,
	  `last_update_date` bigint NOT NULL,
	  PRIMARY KEY (`key`),
	  KEY (`site_id`)
	)
	 
	CREATE TABLE `sites` (
	  `site_id` varchar(50) NOT NULL,
	  `owner_id` varchar(50) NOT NULL,
	  `schema_version` varchar(10) NOT NULL DEFAULT '1.0',
	  `site_data` text NOT NULL,
	  `last_update_date` bigint NOT NULL,
	  PRIMARY KEY (`site_id`)
	) /*ENGINE=InnoDB DEFAULT CHARSET=utf8 
		ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=16*/;


所有不需要作为查询条件的字段都已经合并到单个 blob 字段中(site_data text 字段)。其中包含了 sub-obj 记录,以及 site 对象自身的其他属性域。也请注意,这里没有使用自增序列键;相反,我们使用 `varchar(50)` 来存储客户端生成的 GUID 值。


下面是我们使用的查询语句, 具有高吞吐量和低延迟特性:


	select * from sites where site_id = (
	  select site_id from routes where route = ?
	)


首先通过唯一索引查询 routes 表,这只返回一个结果。然后通过主键查找 site, 也只有一条记录。嵌套查询语法确保 2个SQL查询却只需一次数据库交互。


结果前面提到了, 在高流量和高更新率的情况下, 保持在平均 ~1毫秒左右 的性能。虽然没有使用事务，但 update 是半事务性质的(semi-transactional)。这是因为, 先输入一个 site, 但在输入 route 记录之前，都不会查询到相关的记录。所以如果我们先输入 site, 再输入 route, 依然能确保数据一致性状态, 即使在 sites 表中有很多孤儿数据的情况下。



## MySQL当做 NoSQL引擎使用指南


通过上面的例子(以及Wix的其他类似情景), 我们精心制作了一份用MySQL作为NoSQL引擎的经验指南。

最主要的是要记住, 使用MySQL作为NoSQL引擎时要**避免数据库锁**(DB locks)以及**复杂的查询**。



- 不使用事务,因为会导致锁(locks)。相反, 应该使用应用层事务(applicative transactions)。
- 不使用序列键(serial key)。序列键会导致锁以及引起复杂的 active-active 配置。
- 使用客户端生成的唯一键(client-generated unique keys)。我们使用的是 GUID。



设计数据库时,进行查询优化时还有如下要点:



- 不要使用范式(Do not normalize)。
- 只存储有索引的字段。如果某个字段不需要索引, 那么将其存储在 blob/text 字段中(如JSON或XML)。
- 不要使用外键(foreign key)。
- 必须允许读取单行数据。
- 不准执行 alter 命令。表的 alter 命令会导致锁以及宕机。如果不得不这样做, 应该使用动态迁移(live migrations)。


在查询数据时:


- 使用主键(primary key)和索引(index)作为条件来查询.
- 不要使用 join.
- 不要使用聚合函数(aggregation).
- 只在副本(replica)中执行繁重的查询(housekeeping queries), 比如商业智能(BI), 数据研究(data exploration)等操作, 尽量不要在主库(master database)上执行.


我们准备在另一篇博客中深入介绍实时迁移(live migrations)和应用层事务(applicative transactions)。



## 总结


本文最主要的目的是让你认识 MySQL 的新特性。将 MySQL 作为NoSQL引擎是很棒的, 虽然MySQL不是专为NoSQL设计的。文中展示了如何使用 MySQL 代替专用 NoSQL引擎来存储 键/值(key/value) 信息。

在 Wix , 保存键/值信息(等情况下)会选择MySQL引擎, 原因是其易于使用和操作, 并且MySQL强大的生态系统。另外,比起多数NoSQL引擎来说,在延迟(latency)、吞吐量(throughput)和并发性(concurrency)等指标(metrics)上MySQL并不逊色。



原文链接(需要翻墙): [http://engineering.wix.com/2015/12/10/scaling-to-100m-mysql-is-a-better-nosql/](http://engineering.wix.com/2015/12/10/scaling-to-100m-mysql-is-a-better-nosql/) 

原文日前: 2015年12月10日

翻译日期: 2015年12月27日

作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

