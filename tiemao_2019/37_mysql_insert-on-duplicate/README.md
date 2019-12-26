# 一条SQL语句搞定MySQL数据库插入或更新

业务开发中一般都会使用主键约束，还有一些业务则会增加唯一索引。

存在则更新，不存在则插入，这是很常见的业务需求。

先来看看MySQL官方文档给出的示例用法：

```
INSERT INTO t1 (r_id, r_code, r_count) VALUES (1, 'xxx', 1)
  ON DUPLICATE KEY UPDATE r_count=r_count+1;
```









当然，这种判断也可以在业务代码中进行， 例如:

```

```





官方文档: https://dev.mysql.com/doc/refman/8.0/en/insert-on-duplicate.html
