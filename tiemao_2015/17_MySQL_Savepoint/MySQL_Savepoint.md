# MySQL的事务陷阱和艺术


作者在之前的文章 “[MySQL事务及为何不能在PHP模仿事务](http://www.sitepoint.com/mysql-transactions-php-emulation)” 里面, 详细说明了事务的优点，并介绍了一些简单的SQL命令，使得应用程序更加健壮。但在web程序员的生命旅程中并没有多少事情是看起来那样简单的。。。。。

## 不能回滚的语句(Statements you can’t ROLLBACK)

很遗憾滴通知你, 并不是所有的数据库操作都支持回滚( ROLLBACK ) 。如果你更改数据库/表结构(schema), 所有当前事务都会被提交, 而升级(alteration )将会在其独有的事务中运行(不属于任何客户端事务)。这些语句包括:

- CREATE DATABASE
- ALTER DATABASE
- DROP DATABASE
- CREATE TABLE
- ALTER TABLE
- DROP TABLE
- RENAME TABLE
- TRUNCATE TABLE
- CREATE INDEX
- DROP INDEX
- CREATE EVENT
- DROP EVENT
- CREATE FUNCTION
- DROP FUNCTION
- CREATE PROCEDURE
- DROP PROCEDURE



我们不能撤消数据库根本上的变化, 例如:


	START TRANSACTION; 
	
	DROP TABLE MyImportantData;
	-- 所有事务会被强制提交, existing (empty) transaction is COMMIT-ed
	-- 然后该表就被永久地删除了(table is dropped permanently)
	
	ROLLBACK;
	-- 没机会了,数据已经不要你了. no chance, mate - your data's gone


>###提示: 临时表(TEMPORARY)
> 创建、升级和删除(CREATE, ALTER, and DROP)临时表并不会引起隐式提交(implicit COMMIT. )。当然,这些操作也是不能回滚的。


## 保存点(Savepoint)

我们对异常那是爱之深责之切,那么让我们来看看另一个设计优美的部分。保存点(Savepoint)是事务中有效的命名位置。你可以回滚到某个保存点而不影响改点之前的SQL更新。。。有点像Photoshop中的历史面板。

最简单的方法，我们一起来看个示例:

	START TRANSACTION;
	
	-- 增加 tableA 的记录
	INSERT INTO tableA VALUES (1,2,3);
	
	-- 创建保存点 tableAupdated
	SAVEPOINT tableAupdated;
	
	-- 增加 tableB 的记录
	INSERT INTO tableB VALUES (4,5,6);
	
	-- 反正发生了些什么不愉快的事,要取消对 tableB 所做的更新...
	ROLLBACK TO tableAupdated;
	
	-- 这时候提交,就只有 tableA 被更新了
	COMMIT;

当然, 也可以设置多个保存点标识符(SAVEPOINT identifiers), 并且在事务中回滚到任意一处。

也可以删除一个保存点,语法如下:

	RELEASE SAVEPOINT savepointName;

只要事务提交或者(整个)回滚,那么所有的保存点都会被删除。

事务和保存点的使用非常简单，能有效保护 InnoDB 中重要的数据。你还有什么理由坚持使用 MyISAM 呢,现在MyISAM的效率也不如InnoDB了。

> 注意: 想要订阅更多信息吗?
> 
> 你可以 [订阅 Tech Times 每周的 tech geek newsletter](http://www.sitepoint.com/newsletter/)。





GitHub版本: [https://github.com/cncounter/translation/blob/master/tiemao_2015/17_MySQL_Savepoint/MySQL_Savepoint.md](https://github.com/cncounter/translation/blob/master/tiemao_2015/17_MySQL_Savepoint/MySQL_Savepoint.md)

原文链接: [http://www.sitepoint.com/mysql-transaction-gotchas-good-parts/](http://www.sitepoint.com/mysql-transaction-gotchas-good-parts/)

作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

日期: 2015年06月29日
