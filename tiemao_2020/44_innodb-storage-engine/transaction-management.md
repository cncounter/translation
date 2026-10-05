## Chapter 6 Transaction Handling in the Server

## 第6章 服务器中的事务处理

Table of Contents

目录

6.1 Historical Note

6.1 历史渊源

6.2 Current Situation

6.2 现状

6.3 Data Layout

6.3 数据布局

6.4 Transaction Life Cycle

6.4 事务的生命周期

6.5 Roles and Responsibilities

6.5 角色与职责

6.6 Additional Notes on DDL and the Normal Transaction

6.6 关于DDL与普通事务的补充说明

In each client connection, MySQL maintains two transactional states:

在每个客户端连接中, MySQL维护两种事务状态:

- A statement transaction
- A standard transaction, also called a normal transaction

- 语句事务(statement transaction)
- 标准事务(standard transaction), 也称为普通事务(normal transaction)


原文链接: [Transaction Handling in the Server](https://dev.mysql.com/doc/internals/en/transaction-management.html)


### 6.1 Historical Note

### 6.1 历史渊源

"Statement transaction" is a non-standard term that comes from the days when MySQL supported the BerkeleyDB storage engine.

"语句事务"是一个非标准术语, 源自MySQL支持BerkeleyDB存储引擎的年代。

First, observe that in BerkeleyDB the "auto-commit" mode causes automatic commit of operations that are atomic from the storage engine's perspective, such as a write of a record, but are too fine-grained to be atomic from the application's (MySQL's) perspective. One SQL statement could involve many BerkeleyDB auto-committed operations. So BerkeleyDB auto-commit was of little use to MySQL.

首先要注意, 在BerkeleyDB中, "auto-commit"模式会让那些从存储引擎角度看具有原子性的操作(比如写入一条记录)自动提交, 但这些操作的粒度太细, 从应用程序(MySQL)的角度看并不具备原子性。一条SQL语句可能涉及多次BerkeleyDB自动提交的操作。因此BerkeleyDB的auto-commit对MySQL几乎没有用处。

Second, observe that BerkeleyDB provided the concept of "nested transactions" instead of SQL standard savepoints. In a nutshell: transactions could be arbitrarily nested, but when the parent transaction was committed or aborted, all its child (nested) transactions were committed or aborted as well. Commit of a nested transaction, in turn, made its changes visible, but not durable: it destroyed the nested transaction, so all the nested transaction's changes would become visible to the parent and to other currently active nested transactions of the same parent.

其次要注意, BerkeleyDB提供的是"嵌套事务"的概念, 而不是SQL标准的保存点(savepoint)。简而言之: 事务可以任意嵌套, 但当父事务提交或中止时, 它的所有子(嵌套)事务也会随之提交或中止。嵌套事务的提交会让它的修改变为可见, 但并不是持久的: 提交会销毁该嵌套事务, 因此嵌套事务的所有修改会对父事务以及同一父事务下其他当前活跃的嵌套事务可见。

So MySQL employed the mechanism of nested transactions to provide the "all or nothing" guarantee for SQL statements that the standard requires. MySQL would create a nested transaction at the start of each SQL statement, and destroy (commit or abort) the nested transaction at statement end. MySQL people internally called such a nested transaction a "statement transaction". And that's what gave birth to the term "statement transaction".

于是MySQL采用了嵌套事务机制, 为SQL语句提供标准所要求的"要么全做, 要么全不做"的保证。MySQL会在每条SQL语句开始时创建一个嵌套事务, 并在语句结束时销毁(提交或中止)该嵌套事务。MySQL内部人员把这样的嵌套事务称为"语句事务"(statement transaction)。术语"语句事务"就是这样来的。

### 6.2 Current Situation

### 6.2 现状

Nowadays a statement transaction is started for each statement that accesses transactional tables or uses the binary log. If the statement succeeds, the statement transaction is committed. If the statement fails, the transaction is rolled back. Commits of statement transactions are not durable -- each statement transaction is nested in the normal transaction, and if the normal transaction is rolled back, the effects of all enclosed statement transactions are undone as well. Technically, a statement transaction can be viewed as a transaction which starts with a savepoint which MySQL maintains automatically, in order to make the effects of one statement atomic.

如今, 每条访问事务表或使用二进制日志的语句都会开启一个语句事务。如果语句执行成功, 语句事务被提交; 如果语句失败, 事务被回滚。语句事务的提交不是持久的 -- 每个语句事务都嵌套在普通事务之中, 如果普通事务被回滚, 其中包含的所有语句事务的效果也会被撤销。从技术上讲, 语句事务可以看作一个以保存点开始的事务, 该保存点由MySQL自动维护, 目的是让单条语句的效果具有原子性。

The normal transaction is started by the user and is usually completed by a user request as well. The normal transaction encloses all statement transactions that are issued between its beginning and its end. In autocommit mode, the normal transaction is equivalent to the statement transaction.

普通事务由用户开启, 通常也由用户请求来结束。普通事务包含在其开始与结束之间发出的所有语句事务。在autocommit模式下, 普通事务等价于语句事务。

Since MySQL supports pluggable storage engine architecture (PSEA), more than one transactional engine may be active at a time. So from the server point of view, transactions are always distributed. In particular, MySQL maintains transactional state is independently for each engine. To commit a transaction, MySQL employs a two-phase commit protocol.

由于MySQL支持可插拔存储引擎架构(PSEA), 同一时刻可能有多个事务型引擎处于活跃状态。因此从服务器的角度看, 事务总是分布式的。特别地, MySQL会为每个引擎独立地维护事务状态。为了提交事务, MySQL采用两阶段提交协议。

Not all statements are executed in the context of a transaction. Administrative and status-information statements don't modify engine data, so they don't start a statement transaction and they don't affect a normal transaction. Examples of such statements are SHOW STATUS and RESET SLAVE.

并非所有语句都在事务上下文中执行。管理类语句和状态信息类语句不会修改引擎数据, 因此它们既不会开启语句事务, 也不会影响普通事务。这类语句的例子有SHOW STATUS和RESET SLAVE。

Similarly, DDL statements are not transactional, and therefore a transaction is (almost) never started for a DDL statement. But there's a difference between a DDL statement and an administrative statement: the DDL statement always commits the current transaction (if any) before proceeding; the administrative statement doesn't.

类似地, DDL语句不是事务性的, 因此(几乎)从来不会为DDL语句开启事务。但DDL语句与管理类语句有一个区别: DDL语句在继续执行之前总会提交当前事务(如果有的话); 管理类语句则不会。

Finally, SQL statements that work with nontransactional engines also have no effect on the transaction state of the connection. Even though they cause writes to the binary log, (and the binary log is by and large transactional), they write in "write-through" mode directly to the binlog file, then they do an OS cache sync -- in other words, they bypass the binlog undo log (translog). They do not commit the current normal transaction. A failure of a statement that uses nontransactional tables would cause a rollback of the statement transaction, but that's irrelevant if no nontransactional tables are used, because no statement transaction was started.

最后, 使用非事务引擎的SQL语句同样不影响连接的事务状态。尽管它们会引起二进制日志的写入(而二进制日志大体上是事务性的), 但它们以"直写"(write-through)方式直接写入binlog文件, 然后执行一次OS缓存同步 -- 换句话说, 它们绕过了binlog的undo日志(translog)。它们不会提交当前的普通事务。使用非事务表的语句失败会导致语句事务回滚, 但如果没有使用非事务表, 这一点无关紧要, 因为根本不会开启语句事务。


### 6.3 Data Layout

### 6.3 数据布局

The server stores its transaction-related data in thd->transaction. This structure has two members of type THD_TRANS. These members correspond to the statement and normal transactions respectively:

服务器把与事务相关的数据保存在`thd->transaction`中。该结构有两个`THD_TRANS`类型的成员, 分别对应语句事务和普通事务:

thd->transaction.stmt contains a list of engines that are participating in the given statement

`thd->transaction.stmt`保存了参与当前语句的引擎列表

thd->transaction.all contains a list of engines that have participated in any of the statement transactions started within the context of the normal transaction. Each element of the list contains a pointer to the storage engine, engine-specific transactional data, and engine-specific transaction flags.

`thd->transaction.all`保存了在普通事务上下文中开启的各个语句事务里参与过的引擎列表。列表的每个元素包含一个指向存储引擎的指针、引擎特有的事务数据, 以及引擎特有的事务标志。

In autocommit mode, thd->transaction.all is empty. In that case, data of thd->transaction.stmt is used to commit/roll back the normal transaction.

在autocommit模式下, `thd->transaction.all`为空。此时, 提交/回滚普通事务使用的是`thd->transaction.stmt`中的数据。

The list of registered engines has a few important properties:

已注册引擎的列表有以下几个重要性质:

No engine is registered in the list twice.

任何引擎都不会在列表中被注册两次。

Engines are present in the list in reverse temporal order -- new participants are always added to the beginning of the list.

引擎在列表中按时间逆序排列 -- 新加入的参与者总是被添加到列表的开头。


### 6.4 Transaction Life Cycle

### 6.4 事务的生命周期

When a new connection is established, thd->transaction members are initialized to an empty state. If a statement uses any tables, all affected engines are registered in the statement engine list. In non-autocommit mode, the same engines are registered in the normal transaction list. At the end of the statement, the server issues a commit or a rollback for all engines in the statement list. At this point the transaction flags of an engine, if any, are propagated from the statement list to the list of the normal transaction. When commit/rollback is finished, the statement list is cleared. It will be filled in again by the next statement, and emptied again at the next statement's end.

建立新连接时, `thd->transaction`的成员被初始化为空状态。如果某条语句用到了一些表, 所有受影响的引擎都会注册到语句引擎列表中。在非autocommit模式下, 相同的引擎还会注册到普通事务列表中。语句结束时, 服务器对语句列表中的所有引擎发出提交或回滚。此时, 引擎的事务标志(如果有的话)会从语句列表传递到普通事务列表。提交/回滚完成后, 语句列表被清空。它会在下一条语句执行时再次被填充, 并在该语句结束时再次被清空。

The normal transaction is committed in a similar way (by going over all engines in thd->transaction.all list) but at different times:

普通事务以类似的方式提交(即遍历`thd->transaction.all`列表中的所有引擎), 但时机不同:

When the user issues an SQL COMMIT statement

用户发出SQL COMMIT语句时

Implicitly, when the server begins handling a DDL statement or SET AUTOCOMMIT={0|1} statement

隐式地, 当服务器开始处理DDL语句或SET AUTOCOMMIT={0|1}语句时

The normal transaction can be rolled back as well:

普通事务也可能被回滚:

When the user isues an SQL ROLLBACK statement

用户发出SQL ROLLBACK语句时

When one of the storage engines requests a rollback by setting thd->transaction_rollback_request

某个存储引擎通过设置`thd->transaction_rollback_request`请求回滚时

For example, the latter condition may occur when the transaction in the engine was chosen as a victim of the internal deadlock resolution algorithm and rolled back internally. In such situations there is little the server can do and the only option is to roll back transactions in all other participating engines, and send an error to the user.

例如, 当引擎中的事务被内部死锁解决算法选为牺牲者并在引擎内部回滚时, 就会出现后一种情况。在这种情况下服务器几乎无能为力, 唯一的选择是把所有其他参与引擎中的事务都回滚, 并向用户发送一个错误。

From the use cases above, it follows that a normal transaction is never committed when there is an outstanding statement transaction. In most cases there is no conflict, because commits of a normal transaction are issued by a stand-alone administrative or DDL statement, and therefore no outstanding statement transaction of the previous statement can exist. Besides, all statements that operate via a normal transaction are prohibited in stored functions and triggers, therefore no conflicting situation can occur in a sub-statement either. The remaining rare cases, when the server explicitly must commit a statement transaction prior to committing a normal transaction, are error-handling cases (see for example SQLCOM_LOCK_TABLES).

从上述用例可以得出: 只要还存在未完成的语句事务, 普通事务就永远不会被提交。在大多数情况下不会有冲突, 因为普通事务的提交是由一条独立的管理类语句或DDL语句发出的, 因此前一条语句的语句事务不可能仍未完成。此外, 所有通过普通事务操作的语句在存储函数和触发器中都是被禁止的, 因此子语句中也不会出现冲突情况。剩下的少数特殊情况, 即服务器必须在提交普通事务之前显式提交语句事务的情形, 属于错误处理的情况(例如SQLCOM_LOCK_TABLES)。

When committing a statement or a normal transaction, the server either uses the two-phase commit protocol, or issues a commit in each engine independently. The server uses the two-phase commit protocol only if:

提交语句事务或普通事务时, 服务器要么使用两阶段提交协议, 要么在每个引擎中独立地发出提交。服务器只在以下条件下才使用两阶段提交协议:

All participating engines support two-phase commit (by providing a handlerton::prepare PSEA API call), and

所有参与的引擎都支持两阶段提交(即提供了`handlerton::prepare`这个PSEA API调用), 并且

Transactions in at least two engines modify data (that is, are not read-only)

至少有两个引擎中的事务修改了数据(即不是只读的)

Note that the two-phase commit is used for statement transactions, even though statement transactions are not durable anyway. This ensures logical consistency of data in a multiple- engine transaction. For example, imagine that some day MySQL supports unique constraint checks deferred until the end of the statement. In such a case, a commit in one of the engines could yield ER_DUP_KEY, and MySQL should be able to gracefully abort the statement transactions of other participants.

注意, 即使语句事务本来就不是持久的, 两阶段提交仍然会用于语句事务。这是为了保证多引擎事务中数据的逻辑一致性。例如, 设想将来某天MySQL支持把唯一约束检查推迟到语句结束时进行。在这种情况下, 某个引擎中的提交可能产生ER_DUP_KEY错误, MySQL应当能够优雅地中止其他参与者的语句事务。

After the normal transaction has been committed, the thd->transaction.all list is cleared.

普通事务提交之后, `thd->transaction.all`列表会被清空。

When a connection is closed, the current normal transaction, if any, is rolled back.

连接关闭时, 当前的普通事务(如果有的话)会被回滚。


### 6.5 Roles and Responsibilities

### 6.5 角色与职责

The server has only one way to know that an engine participates in the statement and a transaction has been started in an engine: the engine says so. So, in order to be a part of a transaction, an engine must "register" itself. This is done by invoking the trans_register_ha() server call. Normally the engine registers itself whenever handler::external_lock() is called. Although trans_register_ha() can be invoked many times, it does nothing if the engine is already registered. If autocommit is not set, the engine must register itself twice -- both in the statement list and in the normal transaction list. A parameter of trans_register_ha() specifies which list to register.

服务器只有一种途径知道某个引擎参与了语句、并且在该引擎中开启了事务: 那就是引擎自己声明。因此, 引擎要想成为事务的一部分, 必须"注册"自己。这是通过调用服务器的`trans_register_ha()`完成的。通常, 每当`handler::external_lock()`被调用时, 引擎就会注册自己。虽然`trans_register_ha()`可以被多次调用, 但如果引擎已经注册过, 它什么也不做。如果未设置autocommit, 引擎必须注册两次 -- 语句列表和普通事务列表各一次。`trans_register_ha()`的一个参数用于指定注册到哪个列表。

Note: Although the registration interface in itself is fairly clear, the current usage practice often leads to undesired effects. For example, since a call to trans_register_ha() in most engines is embedded into an implementation of handler::external_lock(), some DDL statements start a transaction (at least from the server point of view) even though they are not expected to. For example CREATE TABLE does not start a transaction, since handler::external_lock() is never called during CREATE TABLE. But CREATE TABLE ... SELECT does, since handler::external_lock() is called for the table that is being selected from. This has no practical effects currently, but we must keep it in mind nevertheless.

注意: 尽管注册接口本身相当清晰, 但当前的使用实践常常导致不符合预期的效果。例如, 由于大多数引擎对`trans_register_ha()`的调用都嵌入在`handler::external_lock()`的实现里, 某些DDL语句会开启事务(至少从服务器的角度看是这样), 尽管按理说它们不应该这样做。例如CREATE TABLE不会开启事务, 因为在CREATE TABLE期间从不调用`handler::external_lock()`; 但CREATE TABLE ... SELECT会, 因为对被查询的表调用了`handler::external_lock()`。这在目前没有实际影响, 但我们仍然必须牢记这一点。

Once an engine is registered, the server will do the rest of the work.

引擎一旦注册, 剩下的工作就由服务器来完成。

During statement execution, whenever any data-modifying PSEA API methods are used (for example, handler::write_row() or handler::update_row()), the read-write flag is raised in the statement transaction for the relevant engine. Currently All PSEA calls are "traced", and the only way to change data is to issue a PSEA call. Important: Unless this invariant is preserved, the server will not know that a transaction in a given engine is read-write and will not involve the two-phase commit protocol!

在语句执行期间, 只要使用了任何修改数据的PSEA API方法(例如`handler::write_row()`或`handler::update_row()`), 相关引擎在语句事务中的读写标志就会被置位。目前所有PSEA调用都会被"追踪", 修改数据的唯一途径就是发出PSEA调用。重要: 除非保持这一不变式, 否则服务器将无法知道给定引擎中的事务是读写的, 也不会启用两阶段提交协议!

The end of a statement causes invocation of the ha_autocommit_or_rollback() server call, which in turn invokes handlerton::prepare() for every involved engine. After handlerton::prepare(), there's a call to handlerton::commit_one_phase(). If a one-phase commit will suffice, handlerton::prepare() is not invoked and the server only calls handlerton::commit_one_phase(). At statement commit, the statement-related read-write engine flag is propagated to the corresponding flag in the normal transaction. When the commit is complete, the list of registered engines is cleared.

语句结束会触发服务器的`ha_autocommit_or_rollback()`调用, 它进而对每个涉及的引擎调用`handlerton::prepare()`。在`handlerton::prepare()`之后, 会调用`handlerton::commit_one_phase()`。如果单阶段提交即可满足要求, 则不调用`handlerton::prepare()`, 服务器只调用`handlerton::commit_one_phase()`。语句提交时, 与语句相关的引擎读写标志会传递到普通事务中对应的标志。提交完成后, 已注册引擎的列表被清空。

Rollback is handled in a similar way.

回滚的处理方式类似。

### 6.6 Additional Notes on DDL and the Normal Transaction

### 6.6 关于DDL与普通事务的补充说明

DDL statements and operations with nontransactional engines do not "register" in thd->transaction lists, and thus do not modify the transaction state. Besides, each DDL statement in MySQL begins with an implicit normal transaction commit (a call to end_active_trans()), and thus leaves nothing to modify. However, as noted above for CREATE TABLE .. SELECT, some DDL statements can start a *new* transaction.

DDL语句和使用非事务引擎的操作不会在`thd->transaction`列表中"注册", 因此不会修改事务状态。此外, MySQL中每条DDL语句都以一次隐式的普通事务提交开始(即调用`end_active_trans()`), 因此没有什么可修改的。不过, 正如上文关于CREATE TABLE .. SELECT所指出的, 某些DDL语句可以开启一个*新*事务。

Behavior of the server in this case is currently badly defined. DDL statements use a form of "semantic" logging to maintain atomicity: If CREATE TABLE t .. SELECT fails, table t is deleted. In addition, some DDL statements issue interim transaction commits: for example, ALTER TABLE issues a commit after data is copied from the original table to the internal temporary table. Other statements, for example, CREATE TABLE ... SELECT, do not always commit after themselves. And finally there is a group of DDL statements such as RENAME/DROP TABLE, which don't start new transactions and don't commit.

服务器在这种情况下的行为目前定义得很不明确。DDL语句使用一种"语义"日志的方式来维护原子性: 如果CREATE TABLE t .. SELECT失败, 表t会被删除。此外, 某些DDL语句会发出中间事务提交: 例如, ALTER TABLE在把数据从原表复制到内部临时表之后会发出一次提交。另一些语句, 例如CREATE TABLE ... SELECT, 则不一定在执行完之后提交。最后还有一组DDL语句, 比如RENAME/DROP TABLE, 它们既不开起新事务, 也不提交。

This diversity makes it hard to say what will happen if by chance a stored function is invoked during a DDL statement -- it's not clear whether any modifications it makes will be committed or not. Fortunately, SQL grammar allows only a few DDL statements to invoke stored functions. Perhaps, for consistency, MySQL should always commit a normal transaction after a DDL statement, just as it commits a statement transaction at the end of a statement.

这种多样性使得我们很难说如果在DDL语句执行期间碰巧调用了存储函数会发生什么 -- 它所做的修改会不会被提交并不明确。所幸SQL语法只允许少数DDL语句调用存储函数。或许出于一致性的考虑, MySQL应当在DDL语句之后总是提交普通事务, 就像它在语句结束时提交语句事务一样。
