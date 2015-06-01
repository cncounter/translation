# MySQL自增长主键


MySQL自动增长使用的关键字是 `AUTO_INCREMENT`; 因为属于 DDL，所以不区分大小写.  使用的列,必须被定义为 key， 比如主键,唯一键等。

> 本文中使用的数据库是 MariaDB 5.5.5
> 
> 默认事务隔离界别是 REPEATABLE-READ
> 
> 客户端是安装 Windows版本 MariaDB时附带安装的 HeidiSQL .
> 
> 社区免费版的下载页面为: [https://downloads.mariadb.org/mariadb/](https://downloads.mariadb.org/mariadb/)

## 创建测试表

使用客户端连接到服务器, 用户为 root,密码也是 root 如: 

	mysql -h localhost -P 3306 -u root -proot


先选择切换 database:


	USE `test`;


创建测试表:


	DROP TABLE IF EXISTS `test_auto`;
	
	CREATE TABLE `test_auto` (
		`id` INT NOT NULL AUTO_INCREMENT,
		PRIMARY KEY (`id`)
	)
	COMMENT='测试自动增长'
	COLLATE='utf8_general_ci'
	ENGINE=InnoDB;




## 客户端1的操作


使用新的客户端1连接到服务器, 用户为 root,密码也是 root 如: 

	mysql -h localhost -P 3306 -u root -proot


切换 database:

	USE `test`;


然后,在客户端1之中, 开启事务, 插入一些数据, 但是不提交.

	# 在客户端1中执行
	begin ;
	insert into test_auto() values();
	insert into test_auto() values();
	insert into test_auto() values();
	insert into test_auto() values();
	insert into test_auto() values();
	insert into test_auto() values();


此时,可以使用查询语句


	SELECT * FROM `test`.`test_auto`;

可以看到, 得到了6条数据, id 是 1-6, 对应着我们插入数据的SQL数。因为我们没有提交, 所以这个结果只能在客户端1中看见。





## 客户端2的操作


使用新的客户端2连接到服务器, 用户为 root,密码也是 root 如: 

	mysql -h localhost -P 3306 -u root -proot


切换 database:

	USE `test`;


然后,在客户端2之中, 开启事务, 插入一些数据, 也不提交.

	# 在客户端2中执行
	begin ;
	insert into test_auto() values();
	insert into test_auto() values();
	insert into test_auto() values();
	insert into test_auto() values();
	insert into test_auto() values();


此时,可以使用查询语句


	SELECT * FROM `test`.`test_auto`;

可以看到, 得到了5条数据, id 是 7-11, 对应着我们插入数据的SQL数。因为我们没有提交, 所以这个结果只能在客户端2中看见。

这里我们可以看到,自增的主键是全局唯一的,如果有事务回滚,那么已经自增的部分,是不会受影响的。多个事务之间的自增主键也不会互相影响, 能保证唯一,但不能保证最终的记录是连续的。

> ###注意
> 通过客户端1和客户端2的操作,可以发现没提交的事务操作其他客户端是不能看到的。
> 
> 这是 **REPEATABLE-READ** 事务隔离级别, 在开启事务后, 还没提交前, 客户端看到的记录, 是 事务开启那一刻的快照, 加上本次会话中执行操作的结果。保证在事务执行过程中,不受其他会话所提交事务的影响。
>
> 如果事务的隔离级别是 **READ COMMITtED** , 只能看到提交成功的记录。
>
> 查询事务隔离级别:  `select @@tx_isolation`



## 客户端3的操作


使用新的客户端3连接到服务器, 用户为 root,密码也是 root 如: 

	mysql -h localhost -P 3306 -u root -proot


切换 database:

	USE `test`;


然后,在客户端3之中, 先使用查询语句: 

	SELECT * FROM `test`.`test_auto`;

可以看到, 一条数据也没有,因为还没有数据被提交。


## 客户端1的操作-续

回到客户端1的窗口, 执行查询语句: 

	SELECT * FROM `test`.`test_auto`;

可以看到还是原先的6条记录。接着提交事务

	commit;



## 客户端2的操作-续

回到客户端2的窗口, 执行查询语句: 

	SELECT * FROM `test`.`test_auto`;

可以看到还是原先的5条记录。接着**回滚**事务

	rollback;

再执行查询语句: 

	SELECT * FROM `test`.`test_auto`;

可以看到6条记录(ID为1-6),为什么是6条? 因为回滚时本次事务就结束,然后也不读取快照版本,而是读取所有可见的数据,即客户端1提交的数据。

## 其他操作

接着在客户端1中看到的也是6条记录.

也可以继续执行几次插入或者事务操作,中途查询数据,并分析结果。


## 小结

MySQL的自动增长列, 保证了不重复,不保证中间不跳号(当然,不跳号只有某些特殊业务有需求)。特别是在事务执行环境里执行时, 为了不影响逻辑与性能，也只能采用这种处理方式。


GitHub版本: [https://github.com/cncounter/translation/blob/master/tiemao_2015/16_MySQL_AUTO_INCREMENT/MySQL_AUTO_INCREMENT.md](https://github.com/cncounter/translation/blob/master/tiemao_2015/16_MySQL_AUTO_INCREMENT/MySQL_AUTO_INCREMENT.md)

作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

日期: 2015年06月01日
