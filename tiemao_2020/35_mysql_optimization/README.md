# MySQL Optimization Reference Manual

# MySQL优化手册 - 官方文档[中文版]


Table of Contents

目录


- [8.1 Optimization Overview](./8.1-optimize-overview.md) 【粗翻】
- [8.2 Optimizing SQL Statements](./README.md)
- [8.3 Optimization and Indexes](./README.md)
- [8.4 Optimizing Database Structure](./README.md)
- [8.5 Optimizing for InnoDB Tables](./README.md)
- [8.6 Optimizing for MyISAM Tables](./README.md)
- [8.7 Optimizing for MEMORY Tables](./README.md)
- [8.8 Understanding the Query Execution Plan](./README.md)
- [8.9 Controlling the Query Optimizer](./README.md)
- [8.10 Buffering and Caching](./README.md)
- [8.11 Optimizing Locking Operations](./README.md)
- [8.12 Optimizing the MySQL Server](./README.md)
- [8.13 Measuring Performance (Benchmarking)](./README.md)
- [8.14 Examining Server Thread (Process) Information](./README.md)



This chapter explains how to optimize MySQL performance and provides examples. Optimization involves configuring, tuning, and measuring performance, at several levels. Depending on your job role (developer, DBA, or a combination of both), you might optimize at the level of individual SQL statements, entire applications, a single database server, or multiple networked database servers. Sometimes you can be proactive and plan in advance for performance, while other times you might troubleshoot a configuration or code issue after a problem occurs. Optimizing CPU and memory usage can also improve scalability, allowing the database to handle more load without slowing down.

本章通过具体实例来讲解如何进行MySQL数据库的性能优化。
涉及多个层次的调优，包括配置参数调整以及性能指标度量。
根据工作角色的划分（开发人员，DBA，或者两者皆有），可以在不同的层面进行优化：

- 开发人员-角色:
  * 单个SQL语句
  * 整个应用程序

- DBA角色:
  * 单个数据库服务器
  * 数据库集群和服务网络

- 调优时机划分
  * 提前进行主动的性能规划
  * 诊断问题并修复代码问题
  * 定位性能问题与排除故障


系统扩容: 增加配置, 应对更高的负载(数据量、用户数、连接数、QPS)

- CPU
- 内存
- 网络
- 存储设备


- https://dev.mysql.com/doc/refman/5.7/en/optimization.html
