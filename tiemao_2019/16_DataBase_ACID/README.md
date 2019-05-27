# 事务特性ACID简介


ACID是事务相关的四个主要特性的英文首字母缩写，关系型数据库的 [事务管理器](https://searchcio.techtarget.com/definition/transaction) 必须支持这四个特性。（原子性 atomicity，一致性 consistency，隔离性 isolation 和持久性 durability）：


汉语名词多听几遍就记住了： 原子性、一致性、隔离性、持久性。

首先自我训练一下，尝试写出 ACID 对应的4个英文单词。

- 原子性： atomic， Java程序员比较熟悉的有 AtomicInteger。对应的名词是: Atomicity（原子数；原子价；原子性）。

- 一致性： consistent，对应的名词是 Consistency（一致性；稠度；相容性）。

- 隔离性： isolate，对应的名词是 Isolation（隔离；孤立；绝缘；离析）。

- 持久性： durable，对应的名词是 durability（耐久性；坚固；耐用年限）。


- 原子性。 在涉及多个部分的事务中，要么所有部分都提交，要么都没有。

- 一致性。 事务或者创建新的有效数据状态，或者，如果发生任何故障，则在事务启动之前将所有数据返回到其状态。

- 隔离性。 正在进行且尚未提交的事务必须与任何其他事务保持隔离。

- 耐用性。 系统保存提交的数据，即使在发生故障和系统重启的情况下，数据也可以以正确的状态获得。

- Atomicity. In a transaction involving two or more discrete pieces of information, either all of the pieces are committed or none are.

- Consistency. A transaction either creates a new and valid state of data, or, if any failure occurs, returns all data to its state before the transaction was started.

- Isolation. A transaction in process and not yet committed must remain isolated from any other transaction.

- Durability. Committed data is saved by the system such that, even in the event of a failure and system restart, the data is available in its correct state.

ACID概念是在标准化文档 `ISO/IEC 10026-1:1992` 第4节中提出的。 其中的每一个特性都可以通过 [基准测试](https://searchcio.techtarget.com/definition/benchmark) 进行测量。 但一般而言，事务管理器或监视器的目的就是为了实现ACID概念。 在 [分布式系统](https://whatis.techtarget.com/definition/distributed) 中，ACID的一种实现方法是两阶段提交（2PC, two-phase commit），确保事务涉及的所有服务点，都必须提交事务。如果有一个失败，那么事务就必须 [回滚](https://searchsqlserver.techtarget.com/definition/rollback)。

The ACID concept is described in ISO/IEC 10026-1:1992 Section 4. Each of these attributes can be measured against a benchmark. In general, however, a transaction manager or monitor is designed to realize the ACID concept. In a distributed system, one way to achieve ACID is to use a two-phase commit (2PC), which ensures that all involved sites must commit to transaction completion or none do, and the transaction is rolled back (see rollback).









CAP

Consistency, 一致性
Availability, 可用性
Partition tolerance, 分区容错





### 相关链接:

- What is ACID: <https://searchsqlserver.techtarget.com/definition/ACID>
- whatis名词解释: <https://whatis.techtarget.com/>
- Java Tutorials: <https://howtodoinjava.com/>
- ISO/IEC 10026-1:1998: <https://www.iso.org/obp/ui/#iso:std:iso-iec:10026:-1:ed-2:v1:en>
- ISO/IEC 9804:1998: <https://www.iso.org/obp/ui/#iso:std:iso-iec:9804:ed-3:v1:en>
- CAP定理的含义: <http://www.ruanyifeng.com/blog/2018/07/cap.html>
