# MySQL Optimization Reference Manual

# MySQL优化手册 - 官方文档[中文版]


Table of Contents

目录


- [8.1 Optimization Overview](./README.md)
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

本章通过实际案例来介绍如何优化MySQL数据库的性能。 涉及多个层级的配置参数调整以及性能指标检测。
根据工作角色（开发人员，DBA或两者皆有）的不同， 可以在不同的层级上进行优化： 单个SQL语句，整个应用程序， 单个数据库服务器， 或者多个网络数据库服务器级别。
有时后可以主动进行提前的性能规划，而有时则需要在问题发生后，迅速对配置或代码问题进行诊断并排除故障。
优化CPU和内存使用率也可以提高可伸缩性，从而使数据库能够应对更大的负载而不降低速度。




- https://dev.mysql.com/doc/refman/5.7/en/optimization.html
