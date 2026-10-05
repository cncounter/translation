
# AUTO_INCREMENT Handling in InnoDB

# InnoDB引擎中AUTO_INCREMENT的处理机制

[TOC]


### 背景

有1张表300万数据，另一张表3000万数据。
因为涉及到数据加密方式变更，需要修补数据, 采用了 【挂起请求存到Redis + 新旧2套表切换的方式】。
通过SQL rename，以及将备份表的自增id去除，新表加上自增id的方式: 这2个步骤耗时【1小时】。

经验教训: 大数据量的表, 不要修改自增id。


### Examples Using AUTO_INCREMENT

### AUTO_INCREMENT 使用示例


The `AUTO_INCREMENT` attribute can be used to generate a unique identity for new rows:

`AUTO_INCREMENT` 属性可用于为新行生成唯一标识:

```sql
CREATE TABLE animals (
     id MEDIUMINT NOT NULL AUTO_INCREMENT,
     name CHAR(30) NOT NULL,
     PRIMARY KEY (id)
);

INSERT INTO animals (name) VALUES
    ('dog'),('cat'),('penguin'),
    ('lax'),('whale'),('ostrich');

SELECT * FROM animals;
```

Which returns:

查询结果如下:

```none
+----+---------+
| id | name    |
+----+---------+
|  1 | dog     |
|  2 | cat     |
|  3 | penguin |
|  4 | lax     |
|  5 | whale   |
|  6 | ostrich |
+----+---------+
```

No value was specified for the `AUTO_INCREMENT` column, so MySQL assigned sequence numbers automatically. You can also explicitly assign 0 to the column to generate sequence numbers, unless the [`NO_AUTO_VALUE_ON_ZERO`](https://dev.mysql.com/doc/refman/5.6/en/sql-mode.html#sqlmode_no_auto_value_on_zero) SQL mode is enabled. For example:

没有为 `AUTO_INCREMENT` 列指定值，因此 MySQL 自动为其分配了序列号。也可以显式地将 0 赋给该列来生成序列号，除非启用了 [`NO_AUTO_VALUE_ON_ZERO`](https://dev.mysql.com/doc/refman/5.6/en/sql-mode.html#sqlmode_no_auto_value_on_zero) SQL 模式。例如:

```sql
INSERT INTO animals (id,name) VALUES(0,'groundhog');
```

If the column is declared `NOT NULL`, it is also possible to assign `NULL` to the column to generate sequence numbers. For example:

如果该列声明为 `NOT NULL`，也可以将 `NULL` 赋给该列来生成序列号。例如:

```sql
INSERT INTO animals (id,name) VALUES(NULL,'squirrel');
```

When you insert any other value into an `AUTO_INCREMENT` column, the column is set to that value and the sequence is reset so that the next automatically generated value follows sequentially from the largest column value. For example:

向 `AUTO_INCREMENT` 列插入任何其他值时，该列会被设置为那个值，并且序列会被重置，下一个自动生成的值将从当前最大的列值开始依次递增。例如:

```sql
INSERT INTO animals (id,name) VALUES(100,'rabbit');
INSERT INTO animals (id,name) VALUES(NULL,'mouse');
SELECT * FROM animals;
+-----+-----------+
| id  | name      |
+-----+-----------+
|   1 | dog       |
|   2 | cat       |
|   3 | penguin   |
|   4 | lax       |
|   5 | whale     |
|   6 | ostrich   |
|   7 | groundhog |
|   8 | squirrel  |
| 100 | rabbit    |
| 101 | mouse     |
+-----+-----------+
```

Updating an existing `AUTO_INCREMENT` column value in an `InnoDB` table does not reset the `AUTO_INCREMENT` sequence as it does for `MyISAM` and `NDB` tables.

在 `InnoDB` 表中更新已有的 `AUTO_INCREMENT` 列值，不会像 `MyISAM` 和 `NDB` 表那样重置 `AUTO_INCREMENT` 序列。

You can retrieve the most recent automatically generated `AUTO_INCREMENT` value with the [`LAST_INSERT_ID()`](https://dev.mysql.com/doc/refman/5.6/en/information-functions.html#function_last-insert-id) SQL function or the [`mysql_insert_id()`](https://dev.mysql.com/doc/c-api/5.6/en/mysql-insert-id.html) C API function. These functions are connection-specific, so their return values are not affected by another connection which is also performing inserts.

可以使用 [`LAST_INSERT_ID()`](https://dev.mysql.com/doc/refman/5.6/en/information-functions.html#function_last-insert-id) SQL 函数或 [`mysql_insert_id()`](https://dev.mysql.com/doc/c-api/5.6/en/mysql-insert-id.html) C API 函数来获取最近一次自动生成的 `AUTO_INCREMENT` 值。这些函数是连接级别的，所以它们的返回值不会受到同样在执行插入操作的其他连接的影响。

Use the smallest integer data type for the `AUTO_INCREMENT` column that is large enough to hold the maximum sequence value you will need. When the column reaches the upper limit of the data type, the next attempt to generate a sequence number fails. Use the `UNSIGNED` attribute if possible to allow a greater range. For example, if you use [`TINYINT`](https://dev.mysql.com/doc/refman/5.6/en/integer-types.html), the maximum permissible sequence number is 127. For [`TINYINT UNSIGNED`](https://dev.mysql.com/doc/refman/5.6/en/integer-types.html), the maximum is 255. See [Section 11.1.2, “Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT”](https://dev.mysql.com/doc/refman/5.6/en/integer-types.html) for the ranges of all the integer types.

`AUTO_INCREMENT` 列应使用足以容纳所需最大序列值的最小整数类型。当该列达到数据类型的上限时，下一次生成序列号的尝试就会失败。如果可能，请使用 `UNSIGNED` 属性以获得更大的取值范围。例如，如果使用 [`TINYINT`](https://dev.mysql.com/doc/refman/5.6/en/integer-types.html)，最大序列号为 127; 对于 [`TINYINT UNSIGNED`](https://dev.mysql.com/doc/refman/5.6/en/integer-types.html)，最大值为 255。所有整数类型的取值范围请参见 [Section 11.1.2, “Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT”](https://dev.mysql.com/doc/refman/5.6/en/integer-types.html)。

Note

注意

For a multiple-row insert, [`LAST_INSERT_ID()`](https://dev.mysql.com/doc/refman/5.6/en/information-functions.html#function_last-insert-id) and [`mysql_insert_id()`](https://dev.mysql.com/doc/c-api/5.6/en/mysql-insert-id.html) actually return the `AUTO_INCREMENT` key from the *first* of the inserted rows. This enables multiple-row inserts to be reproduced correctly on other servers in a replication setup.

对于多行插入，[`LAST_INSERT_ID()`](https://dev.mysql.com/doc/refman/5.6/en/information-functions.html#function_last-insert-id) 和 [`mysql_insert_id()`](https://dev.mysql.com/doc/c-api/5.6/en/mysql-insert-id.html) 实际返回的是*第一批*插入行中的 `AUTO_INCREMENT` 键值。这使得在复制环境中，多行插入能够在其他服务器上被正确地重现。

To start with an `AUTO_INCREMENT` value other than 1, set that value with [`CREATE TABLE`](https://dev.mysql.com/doc/refman/5.6/en/create-table.html) or [`ALTER TABLE`](https://dev.mysql.com/doc/refman/5.6/en/alter-table.html), like this:

如果想让 `AUTO_INCREMENT` 序列从 1 以外的值开始，可以使用 [`CREATE TABLE`](https://dev.mysql.com/doc/refman/5.6/en/create-table.html) 或 [`ALTER TABLE`](https://dev.mysql.com/doc/refman/5.6/en/alter-table.html) 来设置该值，示例如下:

```sql
mysql> ALTER TABLE tbl AUTO_INCREMENT = 100;
```

### AUTO_INCREMENT Handling in InnoDB

### InnoDB对AUTO_INCREMENT的处理机制

> 此部分内容为官方文档: [14.6.1.6  InnoDB对AUTO_INCREMENT的处理机制](https://github.com/cncounter/translation/tiemao_2020/44_innodb-storage-engine/14.6_innodb-on-disk-structures.md#14.6.1.6)


`InnoDB` provides a configurable locking mechanism that can significantly improve scalability and performance of SQL statements that add rows to tables with `AUTO_INCREMENT` columns. To use the `AUTO_INCREMENT` mechanism with an `InnoDB` table, an `AUTO_INCREMENT` column must be defined as part of an index such that it is possible to perform the equivalent of an indexed `SELECT MAX(*`ai_col`*)` lookup on the table to obtain the maximum column value. Typically, this is achieved by making the column the first column of some table index.

`InnoDB` 提供了一种可配置的锁机制，能够显著提升向带有 `AUTO_INCREMENT` 列的表中添加行的 SQL 语句的可扩展性和性能。要在 `InnoDB` 表中使用 `AUTO_INCREMENT` 机制，必须将 `AUTO_INCREMENT` 列定义为某个索引的一部分，这样才能在表上执行等价于带索引的 `SELECT MAX(*`ai_col`*)` 查找，以获取该列的最大值。通常的做法是让该列作为某个表索引的第一列。

This section describes the behavior of `AUTO_INCREMENT` lock modes, usage implications for different `AUTO_INCREMENT` lock mode settings, and how `InnoDB` initializes the `AUTO_INCREMENT` counter.

本节介绍 `AUTO_INCREMENT` 各种锁模式的行为、不同 `AUTO_INCREMENT` 锁模式设置带来的使用影响，以及 `InnoDB` 如何初始化 `AUTO_INCREMENT` 计数器。



##### InnoDB AUTO_INCREMENT Lock Modes

##### InnoDB AUTO_INCREMENT 锁模式



This section describes the behavior of `AUTO_INCREMENT` lock modes used to generate auto-increment values, and how each lock mode affects replication. Auto-increment lock modes are configured at startup using the `innodb_autoinc_lock_mode` configuration parameter.

本节介绍用于生成自增值的 `AUTO_INCREMENT` 锁模式的行为，以及各种锁模式对复制的影响。自增锁模式在启动时通过 `innodb_autoinc_lock_mode` 配置参数来设置。

The following terms are used in describing `innodb_autoinc_lock_mode` settings:

在描述 `innodb_autoinc_lock_mode` 的设置时，会用到以下术语:

- “`INSERT`-like” statements

  “`INSERT`-like”语句（类 INSERT 语句）

  All statements that generate new rows in a table, including `INSERT`. Includes “simple-inserts”, “bulk-inserts”, and “mixed-mode” inserts.

  所有在表中生成新行的语句，包括 `INSERT`。包含“简单插入（simple-inserts）”、“批量插入（bulk-inserts）”和“混合模式插入（mixed-mode inserts）”。

- “Simple inserts”

  “简单插入（Simple inserts）”

  Statements for which the number of rows to be inserted can be determined in advance (when the statement is initially processed). This includes single-row and multiple-row `INSERT`.

  可以预先确定插入行数的语句（在语句最初被处理时）。包括单行和多行 `INSERT`。

- “Bulk inserts”

  “批量插入（Bulk inserts）”

  Statements for which the number of rows to be inserted (and the number of required auto-increment values) is not known in advance. This includes `INSERT ... SELECT` statements, but not plain `INSERT`. `InnoDB` assigns new values for the `AUTO_INCREMENT` column one at a time as each row is processed.

  无法预先确定插入行数（以及所需自增值数量）的语句。包括 `INSERT ... SELECT` 语句，但不包括普通 `INSERT`。`InnoDB` 在处理每一行时逐个为 `AUTO_INCREMENT` 列分配新值。

- “Mixed-mode inserts”

  “混合模式插入（Mixed-mode inserts）”

  These are “simple insert” statements that specify the auto-increment value for some (but not all) of the new rows. An example follows, where `c1` is an `AUTO_INCREMENT` column of table `t1`:

  这类语句是“简单插入”，但只为部分（而非全部）新行指定自增值。下面是一个示例，其中 `c1` 是表 `t1` 的 `AUTO_INCREMENT` 列:

  ```sql
  INSERT INTO t1 (c1,c2) VALUES (1,'a'), (NULL,'b'), (5,'c'), (NULL,'d');
  ```

  Another type of “mixed-mode insert” is `INSERT ... ON DUPLICATE KEY UPDATE`, where the allocated value for the `AUTO_INCREMENT` column may or may not be used during the update phase.

  另一类“混合模式插入”是 `INSERT ... ON DUPLICATE KEY UPDATE`，在更新阶段，为 `AUTO_INCREMENT` 列分配的值可能会被用到，也可能不会被用到。

There are three possible settings for the `innodb_autoinc_lock_mode` configuration parameter. The settings are 0, 1, or 2, for “traditional”, “consecutive”, or “interleaved” lock mode, respectively.

`innodb_autoinc_lock_mode` 配置参数有三种可能的取值: 0、1 或 2，分别对应“traditional（传统）”、“consecutive（连续）”或“interleaved（交错）”锁模式。

- `innodb_autoinc_lock_mode = 0` (“traditional” lock mode)

  The traditional lock mode provides the same behavior that existed before the `innodb_autoinc_lock_mode` configuration parameter was introduced in MySQL 5.1. The traditional lock mode option is provided for backward compatibility, performance testing, and working around issues with “mixed-mode inserts”, due to possible differences in semantics.

  传统锁模式提供的行为与 MySQL 5.1 引入 `innodb_autoinc_lock_mode` 配置参数之前的行为相同。提供传统锁模式选项是为了向后兼容、性能测试，以及应对“混合模式插入”因语义上可能存在差异而带来的问题。

  In this lock mode, all “INSERT-like” statements obtain a special table-level `AUTO-INC` lock for inserts into tables with `AUTO_INCREMENT` columns. This lock is normally held to the end of the statement (not to the end of the transaction) to ensure that auto-increment values are assigned in a predictable and repeatable order for a given sequence of `INSERT` statements, and to ensure that auto-increment values assigned by any given statement are consecutive.

  在这种锁模式下，所有“INSERT-like”语句在向带有 `AUTO_INCREMENT` 列的表中插入数据时，都会获取特殊的表级 `AUTO-INC` 锁。该锁通常持有到语句结束（而不是事务结束），以确保对于给定的 `INSERT` 语句序列，自增值按照可预期、可重现的顺序分配，并确保任意一条语句分配到的自增值是连续的。

  In the case of statement-based replication, this means that when an SQL statement is replicated on a replica server, the same values are used for the auto-increment column as on the source server. The result of execution of multiple `INSERT` statements would be nondeterministic, and could not reliably be propagated to a replica server using statement-based replication.

  在使用基于语句的复制（statement-based replication）时，这意味着当一条 SQL 语句被复制到从库（replica）上执行时，自增列使用的值与主库（source）上的相同。否则，多条 `INSERT` 语句的执行结果将是不确定的，无法可靠地通过基于语句的复制传播到从库。

  To make this clear, consider an example that uses this table:

  为了便于理解，请看一个使用如下表的示例:

  ```sql
  CREATE TABLE t1 (
    c1 INT(11) NOT NULL AUTO_INCREMENT,
    c2 VARCHAR(10) DEFAULT NULL,
    PRIMARY KEY (c1)
  ) ENGINE=InnoDB;
  ```

  Suppose that there are two transactions running, each inserting rows into a table with an `AUTO_INCREMENT` column. One transaction is using an `INSERT ... SELECT` statement that inserts one row:

  假设有两个事务在运行，各自向带有 `AUTO_INCREMENT` 列的表中插入行。其中一个事务使用 `INSERT ... SELECT` 语句插入行:

  ```sql
  Tx1: INSERT INTO t1 (c2) SELECT 1000 rows from another table ...
  Tx2: INSERT INTO t1 (c2) VALUES ('xxx');
  ```

  `InnoDB` cannot tell in advance how many rows are retrieved from the `SELECT` statement in Tx2 is either be smaller or larger than all those used for Tx1, depending on which statement executes first.

  `InnoDB` 无法提前知道 `SELECT` 语句会检索多少行，Tx2 用到的自增值可能小于也可能大于 Tx1 所用的所有值，具体取决于哪条语句先执行。

  As long as the SQL statements execute in the same order when replayed from the binary log (when using statement-based replication, or in recovery scenarios), the results are the same as they were when Tx1 and Tx2 first ran. Thus, table-level locks held until the end of a statement make `INSERT` statements using auto-increment safe for use with statement-based replication. However, those table-level locks limit concurrency and scalability when multiple transactions are executing insert statements at the same time.

  只要 SQL 语句在从二进制日志重放时（使用基于语句的复制，或在恢复场景中）按相同的顺序执行，结果就与 Tx1 和 Tx2 最初运行时相同。因此，持有到语句结束的表级锁，使得使用自增值的 `INSERT` 语句可以安全地用于基于语句的复制。但是，当多个事务同时执行插入语句时，这些表级锁会限制并发性和可扩展性。

  In the preceding example, if there were no table-level lock, the value of the auto-increment column used for the `INSERT` statements are nondeterministic, and may vary from run to run.

  在前面的示例中，如果没有表级锁，`INSERT` 语句所使用的自增列的值将是不确定的，并且每次运行可能都不相同。

  Under the [consecutive]() lock mode, `InnoDB` can avoid using table-level `AUTO-INC` locks for “simple insert” statements where the number of rows is known in advance, and still preserve deterministic execution and safety for statement-based replication.

  在 [consecutive]()（连续）锁模式下，对于行数可以预先确定的“简单插入”语句，`InnoDB` 可以避免使用表级 `AUTO-INC` 锁，同时仍能保持确定的执行结果，以及对基于语句的复制安全。

  If you are not using the binary log to replay SQL statements as part of recovery or replication, the [interleaved]() lock mode can be used to eliminate all use of table-level `AUTO-INC` locks for even greater concurrency and performance, at the cost of permitting gaps in auto-increment numbers assigned by a statement and potentially having the numbers assigned by concurrently executing statements interleaved.

  如果不把二进制日志用作恢复或复制的一部分来重放 SQL 语句，则可以使用 [interleaved]()（交错）锁模式，完全消除表级 `AUTO-INC` 锁的使用，以获得更高的并发性和性能，代价是允许某条语句分配的自增编号出现空洞，并且并发执行的语句所分配的编号可能相互交错。

- `innodb_autoinc_lock_mode = 1` (“consecutive” lock mode)

  This is the default lock mode. In this mode, “bulk inserts” use the special `AUTO-INC` table-level lock and hold it until the end of the statement. This applies to all `INSERT ... SELECT` statements. Only one statement holding the `AUTO-INC` lock can execute at a time. If the source table of the bulk insert operation is different from the target table, the `AUTO-INC` lock on the target table is taken after a shared lock is taken on the first row selected from the source table. If the source and target of the bulk insert operation are the same table, the `AUTO-INC` lock is taken after shared locks are taken on all selected rows.

  这是默认的锁模式。在这种模式下，“批量插入”会使用特殊的 `AUTO-INC` 表级锁，并持有到语句结束。这适用于所有 `INSERT ... SELECT` 语句。同一时刻只能有一条持有 `AUTO-INC` 锁的语句在执行。如果批量插入操作的源表与目标表不同，则在对从源表中选取的第一行加共享锁之后，再获取目标表上的 `AUTO-INC` 锁。如果批量插入的源表和目标表是同一张表，则在对所有被选取的行加共享锁之后，再获取 `AUTO-INC` 锁。

  “Simple inserts” (for which the number of rows to be inserted is known in advance) avoid table-level `AUTO-INC` locks by obtaining the required number of auto-increment values under the control of a mutex (a light-weight lock) that is only held for the duration of the allocation process, *not* until the statement completes. No table-level `AUTO-INC` lock is used unless an `AUTO-INC` lock is held by another transaction. If another transaction holds an `AUTO-INC` lock, a “simple insert” waits for the `AUTO-INC` lock, as if it were a “bulk insert”.

  “简单插入”（插入行数可以预先确定的语句）不使用表级 `AUTO-INC` 锁，而是在互斥量（mutex，一种轻量级锁）的控制下获取所需数量的自增值，该互斥量只在分配过程中持有，*而不是*持有到语句执行完毕。除非其他事务持有 `AUTO-INC` 锁，否则不会使用表级 `AUTO-INC` 锁。如果有另一个事务持有 `AUTO-INC` 锁，“简单插入”就会像“批量插入”一样等待 `AUTO-INC` 锁。

  This lock mode ensures that, in the presence of `INSERT`-like” statement are consecutive, and operations are safe for statement-based replication.

  这种锁模式确保，在存在“INSERT-like”语句的情况下，任意给定语句分配的自增值都是连续的，并且操作对于基于语句的复制是安全的。

  Simply put, this lock mode significantly improves scalability while being safe for use with statement-based replication. Further, as with “traditional” lock mode, auto-increment numbers assigned by any given statement are *consecutive*. There is *no change* in semantics compared to “traditional” mode for any statement that uses auto-increment, with one important exception.

  简而言之，这种锁模式显著提升了可扩展性，同时对于基于语句的复制是安全的。此外，与“传统”锁模式一样，任意给定语句分配的自增编号都是*连续的*。对于任何使用自增值的语句，其语义与“传统”模式相比*没有变化*，但有一个重要的例外。

  The exception is for “mixed-mode inserts”, where the user provides explicit values for an `AUTO_INCREMENT` column for some, but not all, rows in a multiple-row “simple insert”. For such inserts, `InnoDB` allocates more auto-increment values than the number of rows to be inserted. However, all values automatically assigned are consecutively generated (and thus higher than) the auto-increment value generated by the most recently executed previous statement. “Excess” numbers are lost.

  这个例外就是“混合模式插入”，即用户在多行“简单插入”中只为部分（而非全部）行显式指定了 `AUTO_INCREMENT` 列的值。对于这类插入，`InnoDB` 分配的自增值数量会多于要插入的行数。不过，所有自动分配的值都是连续生成的（因此大于）前一条最近执行的语句所生成的自增值。多出来的“多余”编号会被丢弃。

- `innodb_autoinc_lock_mode = 2` (“interleaved” lock mode)

  In this lock mode, no “`INSERT`-like” statements use the table-level `AUTO-INC` lock, and multiple statements can execute at the same time. This is the fastest and most scalable lock mode, but it is *not safe* when using statement-based replication or recovery scenarios when SQL statements are replayed from the binary log.

  在这种锁模式下，任何“INSERT-like”语句都不使用表级 `AUTO-INC` 锁，多条语句可以同时执行。这是最快、可扩展性最好的锁模式，但在使用基于语句的复制时，或在从二进制日志重放 SQL 语句的恢复场景中，它是*不安全的*。

  In this lock mode, auto-increment values are guaranteed to be unique and monotonically increasing across all concurrently executing “`INSERT`-like” statements. However, because multiple statements can be generating numbers at the same time (that is, allocation of numbers is *interleaved* across statements), the values generated for the rows inserted by any given statement may not be consecutive.

  在这种锁模式下，可以保证自增值在所有并发执行的“INSERT-like”语句中是唯一的、单调递增的。但是，由于多条语句可能同时在生成编号（也就是说，编号的分配在语句之间是*交错的*），为某条语句插入的行所生成的值可能不是连续的。

  If the only statements executing are “simple inserts” where the number of rows to be inserted is known ahead of time, there are no gaps in the numbers generated for a single statement, except for “mixed-mode inserts”. However, when “bulk inserts” are executed, there may be gaps in the auto-increment values assigned by any given statement.

  如果正在执行的只有“简单插入”（插入行数可以提前确定）语句，那么除了“混合模式插入”之外，为单条语句生成的编号不会出现空洞。但是，当执行“批量插入”时，任意给定语句分配到的自增值可能出现空洞。

##### InnoDB AUTO_INCREMENT Lock Mode Usage Implications

##### InnoDB AUTO_INCREMENT 锁模式的使用影响

- Using auto-increment with replication

  在复制中使用自增

  If you are using statement-based replication, set `innodb_autoinc_lock_mode` or configurations where the source and replicas do not use the same lock mode.

  如果使用的是基于语句的复制，需要正确设置 `innodb_autoinc_lock_mode`，不要采用主库与从库使用不同锁模式的配置。

  If you are using row-based or mixed-format replication, all of the auto-increment lock modes are safe, since row-based replication is not sensitive to the order of execution of the SQL statements (and the mixed format uses row-based replication for any statements that are unsafe for statement-based replication).

  如果使用的是基于行或混合格式的复制，则所有的自增锁模式都是安全的，因为基于行的复制对 SQL 语句的执行顺序不敏感（而混合格式对于基于语句的复制不安全的语句，会采用基于行的复制）。

- “Lost” auto-increment values and sequence gaps

  “丢失”的自增值与序列空洞

  In all lock modes (0, 1, and 2), if a transaction that generated auto-increment values rolls back, those auto-increment values are “lost”. Once a value is generated for an auto-increment column, it cannot be rolled back, whether or not the “`INSERT`-like” statement is completed, and whether or not the containing transaction is rolled back. Such lost values are not reused. Thus, there may be gaps in the values stored in an `AUTO_INCREMENT` column of a table.

  在所有锁模式（0、1 和 2）下，如果生成了自增值的事务发生回滚，这些自增值就“丢失”了。一旦为自增列生成了某个值，它就无法回滚，无论“INSERT-like”语句是否执行完成，也无论所在事务是否回滚。这些丢失的值不会被重用。因此，表的 `AUTO_INCREMENT` 列中存储的值可能出现空洞。

- Specifying NULL or 0 for the `AUTO_INCREMENT` column

  为 `AUTO_INCREMENT` 列指定 NULL 或 0

  In all lock modes (0, 1, and 2), if a user specifies NULL or 0 for the `AUTO_INCREMENT` column in an `INSERT`, `InnoDB` treats the row as if the value was not specified and generates a new value for it.

  在所有锁模式（0、1 和 2）下，如果用户在 `INSERT` 中为 `AUTO_INCREMENT` 列指定了 NULL 或 0，`InnoDB` 会将该行视为未指定值，并为它生成一个新值。

- Assigning a negative value to the `AUTO_INCREMENT` column

  为 `AUTO_INCREMENT` 列指定负值

  In all lock modes (0, 1, and 2), the behavior of the auto-increment mechanism is not defined if you assign a negative value to the `AUTO_INCREMENT` column.

  在所有锁模式（0、1 和 2）下，如果为 `AUTO_INCREMENT` 列指定负值，自增机制的行为是不确定的。

- If the `AUTO_INCREMENT` value becomes larger than the maximum integer for the specified integer type

  如果 `AUTO_INCREMENT` 值超过了指定整数类型的最大值

  In all lock modes (0, 1, and 2), the behavior of the auto-increment mechanism is not defined if the value becomes larger than the maximum integer that can be stored in the specified integer type.

  在所有锁模式（0、1 和 2）下，如果值超过了指定整数类型所能存储的最大整数，自增机制的行为是不确定的。

- Gaps in auto-increment values for “bulk inserts”

  “批量插入”自增值的空洞

  With `innodb_autoinc_lock_mode`, the auto-increment values generated by any given statement are consecutive, without gaps, because the table-level `AUTO-INC` lock is held until the end of the statement, and only one such statement can execute at a time.

  在该 `innodb_autoinc_lock_mode` 设置下，任意给定语句生成的自增值是连续的、没有空洞的，因为表级 `AUTO-INC` 锁会持有到语句结束，并且同一时刻只有一条这样的语句在执行。

  With `innodb_autoinc_lock_mode`-like” statements.

  > 译注: 原文此处语句不完整。

  For lock modes 1 or 2, gaps may occur between successive statements because for bulk inserts the exact number of auto-increment values required by each statement may not be known and overestimation is possible.

  对于锁模式 1 或 2，相邻语句之间可能出现空洞，因为对于批量插入，每条语句所需自增值的确切数量可能无法预先知道，可能出现高估。

- Auto-increment values assigned by “mixed-mode inserts”

  “混合模式插入”分配的自增值

  Consider a “mixed-mode insert,” where a “simple insert” specifies the auto-increment value for some (but not all) resulting rows. Such a statement behaves differently in lock modes 0, 1, and 2. For example, assume `c1` is an `AUTO_INCREMENT` column of table `t1`, and that the most recent automatically generated sequence number is 100.

  考虑一个“混合模式插入”，即“简单插入”只为部分（而非全部）结果行指定自增值。这样的语句在锁模式 0、1、2 下的表现各不相同。例如，假设 `c1` 是表 `t1` 的 `AUTO_INCREMENT` 列，并且最近自动生成的序列号是 100。

  ```sql
  mysql> CREATE TABLE t1 (
      -> c1 INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      -> c2 CHAR(1)
      -> ) ENGINE = INNODB;
  ```

  Now, consider the following “mixed-mode insert” statement:

  现在，考虑下面这条“混合模式插入”语句:

  ```sql
  mysql> INSERT INTO t1 (c1,c2) VALUES (1,'a'), (NULL,'b'), (5,'c'), (NULL,'d');
  ```

  With `innodb_autoinc_lock_mode`, the four new rows are:

  在该 `innodb_autoinc_lock_mode` 设置下，四条新行如下:

  ```sql
  mysql> SELECT c1, c2 FROM t1 ORDER BY c2;
  +-----+------+
  | c1  | c2   |
  +-----+------+
  |   1 | a    |
  | 101 | b    |
  |   5 | c    |
  | 102 | d    |
  +-----+------+
  ```

  The next available auto-increment value is 103 because the auto-increment values are allocated one at a time, not all at once at the beginning of statement execution. This result is true whether or not there are concurrently executing “`INSERT`-like” statements (of any type).

  下一个可用的自增值是 103，因为自增值是逐个分配的，而不是在语句执行开始时一次性全部分配。无论是否存在并发执行的“INSERT-like”语句（任何类型），这个结果都成立。

  With `innodb_autoinc_lock_mode`, the four new rows are also:

  在该 `innodb_autoinc_lock_mode` 设置下，四条新行同样如下:

  ```sql
  mysql> SELECT c1, c2 FROM t1 ORDER BY c2;
  +-----+------+
  | c1  | c2   |
  +-----+------+
  |   1 | a    |
  | 101 | b    |
  |   5 | c    |
  | 102 | d    |
  +-----+------+
  ```

  However, in this case, the next available auto-increment value is 105, not 103 because four auto-increment values are allocated at the time the statement is processed, but only two are used. This result is true whether or not there are concurrently executing “`INSERT`-like” statements (of any type).

  不过在这种情况下，下一个可用的自增值是 105 而不是 103，因为在语句被处理时一次性分配了四个自增值，但只使用了两个。无论是否存在并发执行的“INSERT-like”语句（任何类型），这个结果都成立。

  With `innodb_autoinc_lock_mode`, the four new rows are:

  在该 `innodb_autoinc_lock_mode` 设置下，四条新行如下:

  ```sql
  mysql> SELECT c1, c2 FROM t1 ORDER BY c2;
  +-----+------+
  | c1  | c2   |
  +-----+------+
  |   1 | a    |
  |   x | b    |
  |   5 | c    |
  |   y | d    |
  +-----+------+
  ```

  The values of *`x`* and *`y`* are unique and larger than any previously generated rows. However, the specific values of *`x`* and *`y`* depend on the number of auto-increment values generated by concurrently executing statements.

  x 和 y 的值是唯一的，并且大于之前生成的任何值。不过，x 和 y 的具体取值取决于并发执行的语句所生成的自增值数量。

  Finally, consider the following statement, issued when the most-recently generated sequence number is 100:

  最后，考虑下面这条语句，它是在最近生成的序列号为 100 时执行的:

  ```sql
  mysql> INSERT INTO t1 (c1,c2) VALUES (1,'a'), (NULL,'b'), (101,'c'), (NULL,'d');
  ```

  With any `innodb_autoinc_lock_mode`` fails.

  无论 `innodb_autoinc_lock_mode` 采用哪种设置，这条语句都会执行失败（出现重复键错误）。

  > 译注: 原文此处语句不完整。

- Modifying `AUTO_INCREMENT` column values in the middle of a sequence of `INSERT` statements

  在 `INSERT` 语句序列中间修改 `AUTO_INCREMENT` 列的值

  In all lock modes (0, 1, and 2), modifying an `AUTO_INCREMENT` column value in the middle of a sequence of `INSERT` operations that do not specify an unused auto-increment value could encounter “Duplicate entry” errors. This behavior is demonstrated in the following example.

  在所有锁模式（0、1 和 2）下，在一系列 `INSERT` 操作的中间修改 `AUTO_INCREMENT` 列的值（未指定未使用过的自增值时），可能会遇到“Duplicate entry”错误。下面的示例演示了这种行为。

  ```sql
  mysql> CREATE TABLE t1 (
      -> c1 INT NOT NULL AUTO_INCREMENT,
      -> PRIMARY KEY (c1)
      ->  ) ENGINE = InnoDB;

  mysql> INSERT INTO t1 VALUES(0), (0), (3);

  mysql> SELECT c1 FROM t1;
  +----+
  | c1 |
  +----+
  |  1 |
  |  2 |
  |  3 |
  +----+

  mysql> UPDATE t1 SET c1 = 4 WHERE c1 = 1;

  mysql> SELECT c1 FROM t1;
  +----+
  | c1 |
  +----+
  |  2 |
  |  3 |
  |  4 |
  +----+

  mysql> INSERT INTO t1 VALUES(0);
  ERROR 1062 (23000): Duplicate entry '4' for key 'PRIMARY'
  ```

##### InnoDB AUTO_INCREMENT Counter Initialization

##### InnoDB AUTO_INCREMENT 计数器的初始化



This section describes how `InnoDB` initializes `AUTO_INCREMENT` counters.

本节介绍 `InnoDB` 如何初始化 `AUTO_INCREMENT` 计数器。

If you specify an `AUTO_INCREMENT` column for an `InnoDB` table, the table handle in the `InnoDB` data dictionary contains a special counter called the auto-increment counter that is used in assigning new values for the column. This counter is stored only in main memory, not on disk.

如果为 `InnoDB` 表指定了 `AUTO_INCREMENT` 列，那么 `InnoDB` 数据字典中的表句柄会包含一个名为自增计数器（auto-increment counter）的特殊计数器，用于为该列分配新值。该计数器只保存在主内存中，不保存在磁盘上。

To initialize an auto-increment counter after a server restart, `InnoDB` executes the equivalent of the following statement on the first insert into a table containing an `AUTO_INCREMENT` column.

服务器重启后，在第一次向包含 `AUTO_INCREMENT` 列的表中插入数据时，`InnoDB` 会执行等价于如下语句的操作来初始化自增计数器。

```sql
SELECT MAX(ai_col) FROM table_name FOR UPDATE;
```

`InnoDB` increments the value retrieved by the statement and assigns it to the column and to the auto-increment counter for the table. By default, the value is incremented by 1. This default can be overridden by the `auto_increment_increment` configuration setting.

`InnoDB` 会将语句取回的值加 1 之后，赋给该列以及该表的自增计数器。默认递增量为 1，这个默认值可以通过 `auto_increment_increment` 配置项来修改。

If the table is empty, `InnoDB` uses the value `1`. This default can be overridden by the `auto_increment_offset` configuration setting.

如果表是空的，`InnoDB` 会使用值 `1`。这个默认值可以通过 `auto_increment_offset` 配置项来修改。

If a `SHOW TABLE STATUS` statement examines the table before the auto-increment counter is initialized, `InnoDB` initializes but does not increment the value. The value is stored for use by later inserts. This initialization uses a normal exclusive-locking read on the table and the lock lasts to the end of the transaction. `InnoDB` follows the same procedure for initializing the auto-increment counter for a newly created table.

如果在自增计数器初始化之前执行 `SHOW TABLE STATUS` 语句检查该表，`InnoDB` 会初始化但不递增该值。这个值会被保存下来供后续插入使用。这种初始化会对表使用普通的排他锁读取，锁持续到事务结束。对于新建的表，`InnoDB` 也使用同样的过程来初始化自增计数器。

After the auto-increment counter has been initialized, if you do not explicitly specify a value for an `AUTO_INCREMENT` column, `InnoDB` increments the counter and assigns the new value to the column. If you insert a row that explicitly specifies the column value, and the value is greater than the current counter value, the counter is set to the specified column value.

自增计数器初始化之后，如果没有为 `AUTO_INCREMENT` 列显式指定值，`InnoDB` 会递增计数器并将新值赋给该列。如果插入的行显式指定了该列的值，并且该值大于当前计数器的值，那么计数器会被设置为指定的列值。

`InnoDB` uses the in-memory auto-increment counter as long as the server runs. When the server is stopped and restarted, `InnoDB` reinitializes the counter for each table for the first `INSERT` to the table, as described earlier.

只要服务器在运行，`InnoDB` 就会一直使用内存中的自增计数器。当服务器停止并重新启动时，如前所述，`InnoDB` 会在对每张表的第一次 `INSERT` 时重新初始化该表的计数器。

A server restart also cancels the effect of the `AUTO_INCREMENT = *`N`*` table option in `CREATE TABLE` statements, which you can use with `InnoDB` tables to set the initial counter value or alter the current counter value.

服务器重启还会使 `CREATE TABLE` 语句中 `AUTO_INCREMENT = N` 表选项的效果失效，该选项可用于 `InnoDB` 表，用来设置计数器的初始值或修改当前计数值。

##### Notes

##### 注意事项



- When an `AUTO_INCREMENT` integer column runs out of values, a subsequent `INSERT` operation returns a duplicate-key error. This is general MySQL behavior.

  当 `AUTO_INCREMENT` 整数列的取值耗尽时，后续的 `INSERT` 操作会返回重复键错误。这是 MySQL 的通用行为。

- When you restart the MySQL server, `InnoDB` may reuse an old value that was generated for an `AUTO_INCREMENT` column but never stored (that is, a value that was generated during an old transaction that was rolled back).

  重启 MySQL 服务器之后，`InnoDB` 可能会重用之前为 `AUTO_INCREMENT` 列生成但从未存储的旧值（也就是在已回滚的旧事务中生成的值）。










- https://dev.mysql.com/doc/refman/5.7/en/innodb-auto-increment-handling.html
- https://dev.mysql.com/doc/refman/5.6/en/example-auto-increment.html
