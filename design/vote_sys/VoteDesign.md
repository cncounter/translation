# 投票_问卷表设计

问卷系统，投票系统。

问卷一般分为多个题目。但投票一般只有1个题目。

每个题目具有多个选项，可以是单选,多选,建议,或者 单选/多选 +自定义答案。

每个选项都有标题,以及说明。还有可能会接受自定义答案。

用户投票可能是匿名，或者实名，所以需要用户系统的支持。

此外，需要记录投票记录的IP，用户ID，时间等。

附加的，投票选项可能有一些额外的限制。比如自定义输入等.


#  问卷主题表

建表语句如下:

	CREATE TABLE `vote_topic` (
		`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增ID',
		`title` VARCHAR(256) NULL DEFAULT NULL COMMENT '标题-名称',
		`content` LONGTEXT NULL COMMENT '简短说明',
		`anonym` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '是否匿名,0实名,1匿名',
		`internal` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '0公开,1私有',
		`type` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '投票类型,0每人一票,1每IP一票',
		`reselect` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '是否允许改选-0不允许',
		`category` VARCHAR(512) NULL DEFAULT NULL COMMENT '所属分类',
		`keyword` VARCHAR(512) NULL DEFAULT NULL COMMENT '关键字,逗号分隔',
		`start_time` DATE NULL DEFAULT NULL COMMENT '开始时间',
		`end_time` DATE NULL DEFAULT NULL COMMENT '结束时间',
		`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
		`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
		`create_userid` INT(11) NULL DEFAULT NULL COMMENT '创建者ID',
		`originator` VARCHAR(128) NULL DEFAULT NULL COMMENT '发起人名字',
		PRIMARY KEY (`id`)
	)
	COMMENT='问卷_主题'
	COLLATE='utf8_general_ci'
	ENGINE=InnoDB;




#  投票主表

建表语句如下:



	CREATE TABLE `vote_master` (
		`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增ID',
		`topic_id` INT(10) UNSIGNED NOT NULL COMMENT '话题ID',
		`type` INT(10) NOT NULL DEFAULT '0' COMMENT '0单选,1多选,2自由输入',
		`title` VARCHAR(512) NOT NULL DEFAULT '' COMMENT '标题',
		`content` LONGTEXT NULL COMMENT '内容及说明',
		`create_userid` VARCHAR(256) NULL DEFAULT NULL COMMENT '创建者ID',
		`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
		`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
		PRIMARY KEY (`id`)
	)
	COMMENT='投票主表'
	COLLATE='utf8_general_ci'
	ENGINE=InnoDB;




#  投票细节选项表

建表语句如下:

	CREATE TABLE `vote_detail` (
		`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增ID',
		`topic_id` INT(10) UNSIGNED NOT NULL COMMENT '话题ID',
		`master_id` INT(10) UNSIGNED NOT NULL COMMENT '投票主表ID',
		`custom_input` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '输入框,0无,1有',
		`title` VARCHAR(512) NULL DEFAULT NULL COMMENT '标题,如果有',
		`content` LONGTEXT NULL COMMENT '内容及说明',
		`create_userid` VARCHAR(256) NULL DEFAULT NULL COMMENT '创建者ID',
		`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
		`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
		PRIMARY KEY (`id`)
	)
	COMMENT='投票细节选项表'
	COLLATE='utf8_general_ci'
	ENGINE=InnoDB;




#  投票记录表

建表语句如下:


	CREATE TABLE `vote_record` (
		`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增ID',
		`topic_id` INT(10) UNSIGNED NOT NULL COMMENT '话题ID',
		`master_id` INT(10) UNSIGNED NOT NULL COMMENT '投票主表ID',
		`detail_id` INT(10) UNSIGNED NOT NULL COMMENT '投票选项ID',
		`checked` INT(10) UNSIGNED NOT NULL DEFAULT '1' COMMENT '值选择,1为选中,2为自定义',
		`idea` TEXT NULL COMMENT '自定义答案',
		`anonymous` INT(10) NULL DEFAULT '0' COMMENT '是否匿名投票,0为否,1为是',
		`userid` VARCHAR(256) NULL DEFAULT NULL COMMENT '投票者ID',
		`userip` VARCHAR(256) NULL DEFAULT NULL COMMENT '投票者IP地址',
		`vote_time` DATETIME NULL DEFAULT NULL COMMENT '投票时间',
		`create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
		`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
		PRIMARY KEY (`id`)
	)
	COMMENT='投票记录表'
	COLLATE='utf8_general_ci'
	ENGINE=InnoDB;






GitHub版本: [https://github.com/cncounter/translation/blob/master/design/vote_sys/VoteDesign.md](https://github.com/cncounter/translation/blob/master/design/vote_sys/VoteDesign.md)

作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

日期: 2015年07月18日
