# The InnoDB Storage Engine

# 深入系列: InnoDB存储引擎

##### Table of Contents

##### 目录

- [14.1 Introduction to InnoDB](14.1_innodb-introduction.md)【粗翻】
- [14.2 InnoDB和ACID模型](14.2_mysql-acid.md)【粗翻】
- [14.3 InnoDB与MVCC](14.3_innodb-multi-versioning.md)【粗翻】
- [14.4 InnoDB整体架构](14.4_innodb-architecture.md)【已校对】
- [14.5 InnoDB在内存中的数据结构](14.5_innodb-in-memory-structures.md)【粗翻】
- [14.6 InnoDB在磁盘上的存储结构](14.6_innodb-on-disk-structures.md)【粗翻】
- [14.7 InnoDB的锁和事务模型](14.7_innodb-locking-transaction-model.md)【校对完成】
- [14.8 InnoDB Configuration](14.8_innodb-configuration.md)
- [14.9 InnoDB Table and Page Compression](14.9_innodb-compression.md)
- [14.10 InnoDB File-Format Management]()
- [14.11 InnoDB Row Formats]()
- [14.12 InnoDB Disk I/O and File Space Management]()
- [14.13 InnoDB and Online DDL]()
- [14.14 InnoDB Data-at-Rest Encryption]()
- [14.15 InnoDB Startup Options and System Variables]()
- [14.16 InnoDB INFORMATION_SCHEMA Tables]()
- [14.17 InnoDB Integration with MySQL Performance Schema]()
- [14.18 InnoDB Monitors]()
- [14.19 InnoDB Backup and Recovery]()
- [14.20 InnoDB and MySQL Replication]()
- [14.21 InnoDB memcached Plugin]()
- [14.22 InnoDB Troubleshooting]()
- [14.23 InnoDB的极限限制](14.23_innodb-limits.md)【粗翻】
- [14.24 InnoDB Restrictions and Limitations](14.24_innodb-restrictions-limitations.md)


##### 部分技巧

```

-- 查询客户端连接(服务器线程)
SHOW FULL PROCESSLIST;

-- 查询InnoDB状态
SHOW ENGINE INNODB STATUS;

-- 查询理论上的MySQL内存最大使用量
SELECT ( @@key_buffer_size
+ @@query_cache_size
+ @@innodb_buffer_pool_size
+ @@innodb_log_buffer_size
+ @@max_connections * (
    @@read_buffer_size
    + @@read_rnd_buffer_size
    + @@sort_buffer_size
    + @@join_buffer_size
    + @@binlog_cache_size
    + @@thread_stack
    + @@tmp_table_size )
) / (1024 * 1024 * 1024) AS MAX_MEMORY_GB;
```

##### 相关链接

- [InnoDB存储引擎官方文档-中文翻译-GitHub](https://github.com/cncounter/translation/tree/master/tiemao_2020/44_innodb-storage-engine)
- [MySQL5.7英文文档 - Chapter 14 The InnoDB Storage Engine](https://dev.mysql.com/doc/refman/5.7/en/innodb-storage-engine.html)
- [MySQL5.7中文文档](https://www.docs4dev.com/docs/zh/mysql/5.7/reference)
- [MySQL Internals Manual - Chapter 6 Transaction Handling in the Server](./transaction-management.md)
- [MySQL Internals Manual](https://dev.mysql.com/doc/internals/en/)
- [MySQL调优手册官方文档-中文翻译-GitHub](https://github.com/cncounter/translation/tree/master/tiemao_2020/35_mysql_optimization/)
