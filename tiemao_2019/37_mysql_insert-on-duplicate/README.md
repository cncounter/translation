# 一条SQL语句搞定MySQL数据库插入或更新

存在则更新，不存在则插入，这是很常见的业务需求。

业务开发中，一般都会使用主键约束，还有一些业务则会增加唯一索引。

`INSERT ... ON DUPLICATE KEY UPDATE` 是MySQL在唯一键/主键的值重复时，将插入操作降级，使用后面的更新操作。
当然， 隐含的 `WHERE` 条件就是唯一键相等了。

## 官方示例

先来看看MySQL官方文档给出的示例用法：

```
INSERT INTO t_code_count(r_id, r_code, r_count) VALUES (1, 'code1', 1)
ON DUPLICATE KEY UPDATE r_count=r_count+1;
```

UPDATE 后面可以指定多个列。

如果 r_id 是主键，r_code 是唯一键， 那么上面的更新语句效果等价于：

```
UPDATE t_code_count SET r_count=r_count+1 WHERE r_id=1 OR r_code='code1' LIMIT 1;
```

为什么会有个 `LIMIT 1` 的效果呢? 原因在于 `INSERT ... ON DUPLICATE KEY UPDATE` 只会插入或更新一行。
但极端情况是 `r_id=1 OR r_code='code1'` 匹配了2行记录，也就是 r_id 和 r_code 没有对应好的时候。



## 试验验证

让我们来试验一下。

先建表:

```sql
-- 删除
DROP TABLE IF EXISTS `t_code_count`;
-- 创建
CREATE TABLE IF NOT EXISTS `t_code_count` (
  `r_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `r_code` varchar(200) NOT NULL DEFAULT '' COMMENT '编码',
  `r_count` bigint(20) NOT NULL DEFAULT '0' COMMENT '次数',
  `r_create_time` datetime NOT NULL COMMENT '创建时间',
  `r_update_time` datetime NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`r_id`),
  UNIQUE KEY `uniq_code` (`r_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='编码出现计数表';

```

然后执行多次下面的SQL语句:

```

INSERT INTO t_code_count(r_id, r_code, r_count, r_create_time, r_update_time) VALUES (1, 'code1', 1, now(), now())
ON DUPLICATE KEY UPDATE  r_count=r_count+1, r_update_time=now();

select LAST_INSERT_ID();

```

每执行一次, r_count的值加1，r_update_time 的值也会更新, 这应该没什么疑问。

这种语句的好处是什么呢? 避免了一次 select 判断是否存在的操作，或者是在程序中根据抛出重复键冲突的异常的处理代码。

特别是在批处理，流处理系统中会比较有用， 在shell中也会很方便， 直接拼SQL就行了。



但是 LAST_INSERT_ID() 返回的结果是`0`，为什么？

这真是个悲剧啊，因为我们这个会话还没有id发生自增呢，也就是 r_id 实际上没有用到 AUTO_INCREMENT 配置，所以返回的结果是 0。


## 2.


然后我们断开客户端，再重新打开，多次执行下面的SQL语句:

```

INSERT INTO t_code_count(r_id, r_code, r_count, r_create_time, r_update_time) VALUES (1, 'code1', 1, now(), now())
ON DUPLICATE KEY UPDATE  r_count=r_count+1, r_update_time=now();

select LAST_INSERT_ID();
```

LAST_INSERT_ID() 返回的结果也还是`0`。


再多次执行下面的代码:


```

INSERT INTO t_code_count(r_id, r_code, r_count, r_create_time, r_update_time) VALUES (null, 'code2', 1, now(), now())
ON DUPLICATE KEY UPDATE  r_count=r_count+1, r_update_time=now();

select LAST_INSERT_ID();
```

LAST_INSERT_ID() 返回的结果是 `2`, 为什么呢？ 因为用到了主键自增，而且因为1已经存在，所以本次会话最近自增的ID值是2。

多次执行，返回结果也不变，就是本次会话中最初生成的那个 自增ID， 后面的多次语句并没有使用到主键自增【相当于 UPDATE 了】。






官方文档: https://dev.mysql.com/doc/refman/8.0/en/insert-on-duplicate.html
