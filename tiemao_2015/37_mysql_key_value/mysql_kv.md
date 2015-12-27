Scaling to 100M: MySQL is a Better NoSQL
==

# 直面亿级数据量: MySQL 是更好的 NoSQL 解决方案



MySQL is a better NoSQL. When considering a NoSQL use case, such as key/value storage, MySQL makes more sense in terms of performance, ease of use, and stability. MySQL is a solid engine with lots of online material, ranging from operations and failure cases, to replication and different patterns of usage. For this reason, it has an advantage over newer NoSQL engines that are not as battle tested.

In recent years, NoSQL engines have become mainstream. Many developers look at NoSQL engines—such as MongoDB, Cassandra, Redis, or Hadoop—as their first choice for building applications, considering them a single family of products that deprecates the old SQL engines.

The choice to use a NoSQL database is often based on hype, or a wrong assumption that relational databases cannot perform as well as a NoSQL database. Operational costs, as well as other stability and maturity concerns, are often overlooked by engineers when it comes to selecting a database. For more information about the limitations and shortcomings of different NoSQL (and SQL) engines, take a look at the Jepsen series of articles from Aphyr.


This post will explain why we’ve found that using MySQL for the key/value use case is better than most of the dedicated NoSQL engines, and provide guidelines to follow when using MySQL in this way.


##Wix Site Resolution


When someone clicks a link to a Wix site, his browser sends an HTTP request to a server at Wix with the site address. This happens whether the address is to a Wix premium site with a custom domain (e.g., domain.com) or a free site on a subdomain of the Wix domain (e.g., user.wix.com/site). That server has to resolve the requested site from the site address by performing a key/value lookup URL to a site. We denote the URL as a route for the following discussion.


The routes table is used to resolve the site address to a site object. Because sites may be exposed on multiple routes, the relation is many to one. Once the site is found, the application loads it for use. The site object itself has a complex structure that includes two lists of child objects—different services that the site utilizes. Here is a sample model of our objects, assuming a standard SQL database and a normalized schema:


![](01_sql_scheme.png)


When updating a site with the traditional normalized model, we need to use a transaction to update multiple tables to ensure we preserve data consistency. (Note that a transaction is using a DB-level lock that prevents concurrent writes—and sometimes reads—from the affected tables.) Continuing with this model, we would probably have a serial key in each table, foreign keys, and an index in the URL field in the routes table.


However, there are a number of issues with the normalized schema way of modeling:


- Locks limit access to the table, so on a high throughput use case it may limit our performance.
- Reading the object involves either a few SQL queries (4 in this case) or joins—with latency implications again.
- Serial keys impose locks and again limit the write throughput.


Those issues amount to limitations in the throughput and concurrency we can get from MySQL (or any other SQL engine). Because of those shortcomings, and the fact that the use case is actually key/value, many developers opt to look for a NoSQL solution that provides better throughput and concurrency, even at the expense of stability, consistency, or availability.


At Wix we’ve found that MySQL, when used creatively as a key/value store, can do a better job compared to MySQL with a normalized data model (like the one above)—and to most NoSQL engines. Simply use MySQL as a NoSQL engine. Our existing system has scaling / throughput / concurrency / latency figures that are impressive for any NoSQL engine. Here’s some of our data:




- An active-active-active setup across three data centers.
- Throughput is of the order of magnitude of 200,000 RPM.
- The routes table is of the order of magnitude of 100,000,000 records, 10GB of storage.
- The sites table is of the order of magnitude of 100,000,000 records, 200GB of storage.
- Read latency is 1.0-1.5 msec average (in fact, 0.2-0.3 msec in one data center).


Note that latency of around 1.0 msec is considered impressive with most key/value engines, both open source and cloud-based! And we achieve that with MySQL (considered to be the basic SQL engine).


Here is the actual schema we are using:

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


Any field that is not used as a condition in a query has been folded into a single blob field (the site_data text field). This includes the sub-obj tables, as well as any field on the object table itself. Also notice that we are not using serial keys; instead, we are using varchar(50), which stores client-generated GUID values—more about that in the next section.


Below is the query we are using, which has high throughput and low latency:


	select * from sites where site_id = (
	  select site_id from routes where route = ?
	)

It works by first performing a query on the routes table by a unique index, which should return only one result. Then we look up the site by primary key, again looking for one record. The nested query syntax ensures that we are doing only one round-trip to the database to run both SQL queries.


The result, shown above, is an average ~1 msec consistent performance, given high traffic and a high update rate. The updates are semitransactional, even without using transactions. This is because we enter the full site in one insert statement, and until we enter the routes, it will not be found in queries. So if we enter the site first, and then the routes, we are ensured to have a consistent state, even in edge cases where we may have orphan data in the sites table.


##Guidelines for Using MySQL as a NoSQL Engine

## MySQL变NoSQL引擎指南


Using the experience gained from the above example (and other such cases at Wix), we have crafted a short list of guidelines for using MySQL as a NoSQL engine.

The main thing to keep in mind when using MySQL as a NoSQL engine is to avoid using DB locks or complex queries.

从上面的例子中使用经验(和其他此类案件Wix),我们精心制作了一个简短的列表使用MySQL作为指南NoSQL引擎。

最主要的要记住当使用MySQL作为NoSQL引擎是避免使用DB锁或复杂的查询。



- Do not use transactions, which introduce locks. Instead, use applicative transactions.
- Do not use serial keys. Serial keys introduce locks and complicate active-active configurations.
- Use client-generated unique keys. We use GUIDs.


When designing your schema to be optimized for reads, here are some additional guidelines to follow:


- Do not normalize.
- Fields only exist to be indexed. If a field is not needed for an index, store it in one blob/text field (such as JSON or XML).
- Do not use foreign keys.
- Design your schema to enable reading a single row on query.
- Do not perform table alter commands. Table alter commands introduce locks and downtimes. Instead, use live migrations.

When querying data:


- 使用主键(primary key)和索引(index)来进行查询(query).
- 不使用 join.
- 不使用聚合函数(aggregation).
- 只在副本(replica)中执行辅助查询(housekeeping queries),如商业智能(BI), 数据研究(data exploration)等, 而不在主库(master database)上执行.


We intend to write another blog post with further information about live migrations and applicative transactions.

我们打算再写一篇博客文章来深入介绍实时迁移(live migrations)和应用事务(applicative transactions)。


## Summary


The most important takeaway from this post is that you are allowed to think differently. It is great to use MySQL as a NoSQL engine, which is not the way it was designed to work. As demonstrated in this post, an example of this is using MySQL instead of dedicated NoSQL engines that are built for key/value access. 

At Wix, MySQL is the engine of choice for key/value cases (among others) because it is easy to use and operate, and it’s a great ecosystem. And as a bonus, it provides latency, throughput, and concurrency metrics that match, if not surpass, most NoSQL engines.


本文最主要的目的是让你认识 MySQL 的新特性。将 MySQL 作为NoSQL引擎是很棒的, 虽然MySQL不是专为NoSQL设计的。作为示例, 文中展示了如何使用 MySQL 代替专用 NoSQL引擎来存储 键/值(key/value) 信息。

在 Wix, 保存键/值信息(等情况下)会选择MySQL引擎, 原因是其易于使用和操作, 且是一个庞大的生态系统。另外,比起多数NoSQL引擎来说,在延迟(latency)、吞吐量(throughput)和并发性(concurrency)等指标(metrics)方面并不逊色。



原文链接: [http://engineering.wix.com/2015/12/10/scaling-to-100m-mysql-is-a-better-nosql/](http://engineering.wix.com/2015/12/10/scaling-to-100m-mysql-is-a-better-nosql/)

原文日前: 2015年12月10日

翻译日期: 2015年12月27日

作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

