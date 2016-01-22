# 通用数据字典表结构设计

>本文带领初学者一步步分析数据字典表的设计。 对于有经验的程序员来说可能有点墨迹了,所以如果你对数据字典的设计比较熟悉,那么粗略看一下即可。


## 简述

什么是数据字典? 字典的英文是 `Dict`, 翻译过来是`字典、词典`。

和字典同类的东西呢，就是 `Map`。 Map 就是`地图、映射`的意思。 

所以字典的本质就是 **映射，对应**。

在编辑或者展示的时候， `table` ，表格，其实和`对应`也是有一定关系的，当然，这和我们在理解世界和事物的时候，通常使用 `关系数据理论` 是分不开的。 因为对应关系也是关系中的一种。

字典一般分为两部分： 名称 和 描述信息。 用计算机术语说，就是 `键-值`对(Key-Value pair), 名值对、还有 `Code-Name` 等。

在系统中，因为有很多标准、规范、约定， 为了执行这些规范，**对数据分类、数据状态进行精确定位**，又或者因为多个系统之间需要进行数据交换，但叫法和显示上有差别，在存储数据时需要存储`码值`，而不能只存储显示时使用的名称。 

例如状态值和状态名称。标准做法是只存储 VALUE， 不存储名称。 如果考虑优化，减少数据表的关联查询(join),那么可以在存储 VALUE 的同时冗余存储 NAME。 当然，需要根据具体情况来设计， 如果 NAME 或者描述信息太长，占用空间较大，那么可能就不会进行冗余。 顺便提一句， **减少空间占用** 也是使用数据字典的一个原因。




## 最简设计

**名称-值**


一般来说, **名称**是为了让使用者方便(客户、运维人员、管理人员进行选择、审阅等)；而**值**是为了计算机系统和程序方便而设置的。


最常见的字典类型就是“状态”和“类型”。 

例如某种状态:

	|状态值|状态名|
	|  0  |未通过|
	|  1  |已通过|

某种分类/类型示例:

	|职业编码|职业名称|
	|   0   | 程序员 |
	|   1   |  教师  |
	|   2   |  客服  |
	|   3   | 会计师 |


要存储类似这样的数据,可以使用最简单的数据字典表,只包含两个字段： “**名称**” 和 “**值**”。

	CREATE TABLE dict_xx_status (
		dict_code INT(11),
		dict_name VARCHAR(64)
	)
	COMMENT='xx状态字典';

一般来说, “编码”是字符串类型(`VARCHAR`), 而编号、序号等可以使用整数类型。 所以在实际使用中, `dict_code` 字段的类型一般是 **VARCHAR**。 

当然,为了使用方便,一般会加上非空约束,MySQL建表语句如下:

	-- DROP TABLE `dict_xx_status`;

	CREATE TABLE dict_xx_status (
		dict_code VARCHAR(64) NOT NULL COMMENT '编码',
		dict_desc VARCHAR(64) NOT NULL COMMENT '名称',
		PRIMARY KEY (dict_code)
	);



> 当然, 字符串就不能使用自增了。 Oracle中倒是可以将序列值插入到字符串类型的字段。

再补充一点, "键值对"(Key --> Value) 多数情况下是根据键来查找值（当然,这个值是给人看的值,机器看的是码）。所以对应到上面的字段中, KEY应该是 dict_code, 而 VALUE 是 dict_name。(希望初学者思考一下。就像“长宽”和“宽高”类型,由语境决定某个字的含义。)

> 语境就是上下文(context), `context` 也可以理解为所处的情境、环境.

## 通用设计

**分类** 、分类描述

如果状态、类型都有对应的字典表，那么随着系统规模的扩大，字典表会越来越多，可能200张表里面有30-50个是字典表。 这就很烦人了，这些表的字段都是差不多的。

这时候比较好的办法就是合表。合表就会涉及到数据类型和如何区分的问题。

将相似的表结构合并时，添加一个字段来进行区分是常见的做法。

数据字典的区分,我们一般使用 **`分类`**这个字段。

分类的英文单词,大致有: `type`、`class`、`classify`、`category` 等。 个人建议是使用 **category**, 当然, 根据喜好和理解，也可以使用其他的单词。

理论上来说, 分类使用 int 类型就可以了。但是在实际使用之中并不是很方便。 因为分类是给系统后台或者程序员看的，所以一般是使用字符串类型(String, `VARCHAR(32)`).

同时,为了避免再引入一个分类类型说明的表,我们做一点冗余： 使用2个字段: 分类编码(`category_code`) 和 分类说明(`category_desc`)。 说明可以使用的单词有: `desc`,`name`,`info` 等，注意 **desc** 是SQL关键字，不能单独使用,需要和其他单词拼起来使用。


MySQL建表语句如下:

	CREATE TABLE dict_xx_status (
		dict_code VARCHAR(64) NOT NULL COMMENT '编码',
		dict_desc VARCHAR(64) NOT NULL COMMENT '名称',
		category_code VARCHAR(64) NOT NULL COMMENT '分类编码',
		category_desc VARCHAR(64) NULL DEFAULT NULL COMMENT '分类说明',
		PRIMARY KEY (dict_code)
	);


## 简单优化


ID、排序


当然,为了使用方便,一般会加上ID自增,MySQL建表语句如下:

	CREATE TABLE `dict_xx_status` (
		`id` BIGINT(20) NOT NULL COMMENT '自增ID',
		`dict_code` VARCHAR(64) NOT NULL COMMENT '编码',
		`dict_desc` VARCHAR(64) NOT NULL COMMENT '名称',
		`category_code` VARCHAR(64) NOT NULL COMMENT '分类编码',
		`category_desc` VARCHAR(64) NULL DEFAULT NULL COMMENT '分类说明',
		`sort_no` INT(8) NOT NULL DEFAULT '999' COMMENT '排序编号',
		PRIMARY KEY (`id`),
		UNIQUE INDEX `dict_code_category_code` (`dict_code`, `category_code`)
	)
	COMMENT='xx状态字典'
	COLLATE='utf8_general_ci'
	ENGINE=InnoDB;




## 运维审查方便


创建时间、更新时间、创建人、修改人

	CREATE TABLE `dict_xx_status` (
		`id` BIGINT(20) NOT NULL COMMENT '自增ID',
		`dict_code` VARCHAR(64) NOT NULL COMMENT '编码',
		`dict_desc` VARCHAR(64) NOT NULL COMMENT '名称',
		`category_code` VARCHAR(64) NOT NULL COMMENT '分类编码',
		`category_desc` VARCHAR(64) NULL DEFAULT NULL COMMENT '分类说明',
		`sort_no` INT(8) NOT NULL DEFAULT '999' COMMENT '排序编号',
		`create_user_id` BIGINT(20) NULL DEFAULT '0' COMMENT '创建人ID',
		`update_user_id` BIGINT(20) NULL DEFAULT '0' COMMENT '修改人ID',
		`create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
		`update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
		PRIMARY KEY (`id`),
		UNIQUE INDEX `dict_code_category_code` (`dict_code`, `category_code`)
	)
	COMMENT='xx状态字典'
	COLLATE='utf8_general_ci'
	ENGINE=InnoDB;




## 考虑其他情况

数据类型、附加说明、乐观锁版本号、检索标识。


	CREATE TABLE IF NOT EXISTS `dict_common` (
	  `id` bigint(20) unsigned NOT NULL COMMENT '自增ID',
	  `dict_code` varchar(64) NOT NULL COMMENT '编码',
	  `dict_desc` varchar(64) NOT NULL COMMENT '名称',
	  `category_code` varchar(64) NOT NULL COMMENT '分类编码',
	  `category_desc` varchar(64) DEFAULT NULL COMMENT '分类说明',
	  `sort_no` int(8) unsigned NOT NULL DEFAULT '999' COMMENT '排序编号',
	  `data_type` varchar(64) NOT NULL DEFAULT 'STRING' COMMENT '数据类型',
	  `remark` varchar(128) DEFAULT NULL COMMENT '附加说明',
	  `locate_code` varchar(64) DEFAULT NULL COMMENT '检索标识',
	  `create_id` bigint(20) unsigned DEFAULT '0' COMMENT '创建人ID',
	  `update_id` bigint(20) unsigned DEFAULT '0' COMMENT '修改人ID',
	  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
	  `version` int(8) NOT NULL DEFAULT '0' COMMENT '乐观锁版本号',
	  PRIMARY KEY (`id`),
	  UNIQUE KEY `dict_code_category_code` (`dict_code`,`category_code`)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='通用数据字典';






## 最终结果


设计如下:

![](01_dict_table_pdm.png)

截图如下:


![](02_dict_table_column.png)



建表语句: MySQL


	CREATE TABLE IF NOT EXISTS `dict_common` (
	  `id` bigint(20) unsigned NOT NULL COMMENT '自增ID',
	  `dict_code` varchar(64) NOT NULL COMMENT '编码',
	  `dict_desc` varchar(64) NOT NULL COMMENT '名称',
	  `category_code` varchar(64) NOT NULL COMMENT '分类编码',
	  `category_desc` varchar(64) DEFAULT NULL COMMENT '分类说明',
	  `sort_no` int(8) unsigned NOT NULL DEFAULT '999' COMMENT '排序编号',
	  `data_type` varchar(64) NOT NULL DEFAULT 'STRING' COMMENT '数据类型',
	  `remark` varchar(128) DEFAULT NULL COMMENT '附加说明',
	  `locate_code` varchar(64) DEFAULT NULL COMMENT '检索标识',
	  `create_id` bigint(20) unsigned DEFAULT '0' COMMENT '创建人ID',
	  `update_id` bigint(20) unsigned DEFAULT '0' COMMENT '修改人ID',
	  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
	  `version` int(8) NOT NULL DEFAULT '0' COMMENT '乐观锁版本号',
	  PRIMARY KEY (`id`),
	  UNIQUE KEY `dict_code_category_code` (`dict_code`,`category_code`)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='通用数据字典';


id 统一为 bigint(20); 

在 MySQL 5.6 及以后, `DATETIME` 列就可以使用 `CURRENT_TIMESTAMP` 默认值， 而且也支持多列同时设置为 `ON UPDATE CURRENT_TIMESTAMP`。




日期: 2016年01月23日

作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)


 















