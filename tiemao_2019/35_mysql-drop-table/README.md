# 删除MySQL表（DROP TABLE）简介

> 辨析: 在SQL中, `DROP` 用于删除表结构等信息, 属于数据格式定义 DDL的范畴；
> 而 `DELETE` 用于删除数据，属于数据内容操作 DML 的范畴。

官方给出的 DROP 关键字删除表结构的语法如下:

```sql
DROP [TEMPORARY] TABLE [IF EXISTS]
    tbl_name [, tbl_name] ...
    [RESTRICT | CASCADE]
```

当然, 删除表结构需要你使用的数据库账号具有对应的权限。

从中可以看出, DROP TABLE 可以一次性删除多个表结构， 用逗号分隔即可。

带上 `IF EXISTS` 条件则可以避免报错，将错误信息转换为警告。

如果不带 if 判断，假如有一个表不存在，则会连带当前这条SQL语句操作失败， 也就不会有Table被删除。

示例:

```
DROP TABLE IF EXISTS `t_test_user`;
DROP TABLE IF EXISTS `t_test_role`;
DROP TABLE IF EXISTS `t_test_user`, `t_test_role`;
```

既然表都被删除了，那么里面的数据自然也就没了，所以定时备份，以及操作前的备份都很重要。

- 如果删除的表是分区表(partition)， 则会删除表定义，对应的分区以及所有数据。

- 如果有触发器和索引，也都会一起删除。

- 但是对表的授权不会被连带删除。 这也很合理，测试环境中删表之后一般为了都是重建这个表。

- 默认 DROP 语句会将当前连接中的事务提交。

> 原则上，在如今的MySQL开发中, 不准使用存储过程/触发器/外键/分区表/大批量数据更新/无主键等等情况。

如果带上 `TEMPORARY` 关键字，则只会删除临时表，而且不会自动提交事务。 临时表指只有当前会话可见的表，所以也就没必要进行权限检查。

`RESTRICT` 和 `CASCADE` 关键字在MySQL中则没什么用，只是为了兼容其他数据库迁移等情况而加上的，有这个也不报错。



官方文档: https://dev.mysql.com/doc/refman/8.0/en/drop-table.html
