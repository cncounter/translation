## Chapter 6 Transaction Handling in the Server

Table of Contents

6.1 Historical Note
6.2 Current Situation
6.3 Data Layout
6.4 Transaction Life Cycle
6.5 Roles and Responsibilities
6.6 Additional Notes on DDL and the Normal Transaction

In each client connection, MySQL maintains two transactional states:

- A statement transaction
- A standard transaction, also called a normal transaction


原文链接: [Transaction Handling in the Server](https://dev.mysql.com/doc/internals/en/transaction-management.html)


### 6.1 Historical Note

"Statement transaction" is a non-standard term that comes from the days when MySQL supported the BerkeleyDB storage engine.

First, observe that in BerkeleyDB the "auto-commit" mode causes automatic commit of operations that are atomic from the storage engine's perspective, such as a write of a record, but are too fine-grained to be atomic from the application's (MySQL's) perspective. One SQL statement could involve many BerkeleyDB auto-committed operations. So BerkeleyDB auto-commit was of little use to MySQL.

Second, observe that BerkeleyDB provided the concept of "nested transactions" instead of SQL standard savepoints. In a nutshell: transactions could be arbitrarily nested, but when the parent transaction was committed or aborted, all its child (nested) transactions were committed or aborted as well. Commit of a nested transaction, in turn, made its changes visible, but not durable: it destroyed the nested transaction, so all the nested transaction's changes would become visible to the parent and to other currently active nested transactions of the same parent.

So MySQL employed the mechanism of nested transactions to provide the "all or nothing" guarantee for SQL statements that the standard requires. MySQL would create a nested transaction at the start of each SQL statement, and destroy (commit or abort) the nested transaction at statement end. MySQL people internally called such a nested transaction a "statement transaction". And that's what gave birth to the term "statement transaction".

### 6.2 Current Situation

Nowadays a statement transaction is started for each statement that accesses transactional tables or uses the binary log. If the statement succeeds, the statement transaction is committed. If the statement fails, the transaction is rolled back. Commits of statement transactions are not durable -- each statement transaction is nested in the normal transaction, and if the normal transaction is rolled back, the effects of all enclosed statement transactions are undone as well. Technically, a statement transaction can be viewed as a transaction which starts with a savepoint which MySQL maintains automatically, in order to make the effects of one statement atomic.

The normal transaction is started by the user and is usually completed by a user request as well. The normal transaction encloses all statement transactions that are issued between its beginning and its end. In autocommit mode, the normal transaction is equivalent to the statement transaction.

Since MySQL supports pluggable storage engine architecture (PSEA), more than one transactional engine may be active at a time. So from the server point of view, transactions are always distributed. In particular, MySQL maintains transactional state is independently for each engine. To commit a transaction, MySQL employs a two-phase commit protocol.

Not all statements are executed in the context of a transaction. Administrative and status-information statements don't modify engine data, so they don't start a statement transaction and they don't affect a normal transaction. Examples of such statements are SHOW STATUS and RESET SLAVE.

Similarly, DDL statements are not transactional, and therefore a transaction is (almost) never started for a DDL statement. But there's a difference between a DDL statement and an administrative statement: the DDL statement always commits the current transaction (if any) before proceeding; the administrative statement doesn't.

Finally, SQL statements that work with nontransactional engines also have no effect on the transaction state of the connection. Even though they cause writes to the binary log, (and the binary log is by and large transactional), they write in "write-through" mode directly to the binlog file, then they do an OS cache sync -- in other words, they bypass the binlog undo log (translog). They do not commit the current normal transaction. A failure of a statement that uses nontransactional tables would cause a rollback of the statement transaction, but that's irrelevant if no nontransactional tables are used, because no statement transaction was started.


### 6.3 Data Layout

The server stores its transaction-related data in thd->transaction. This structure has two members of type THD_TRANS. These members correspond to the statement and normal transactions respectively:

thd->transaction.stmt contains a list of engines that are participating in the given statement

thd->transaction.all contains a list of engines that have participated in any of the statement transactions started within the context of the normal transaction. Each element of the list contains a pointer to the storage engine, engine-specific transactional data, and engine-specific transaction flags.

In autocommit mode, thd->transaction.all is empty. In that case, data of thd->transaction.stmt is used to commit/roll back the normal transaction.

The list of registered engines has a few important properties:

No engine is registered in the list twice.

Engines are present in the list in reverse temporal order -- new participants are always added to the beginning of the list.


### 6.4 Transaction Life Cycle

When a new connection is established, thd->transaction members are initialized to an empty state. If a statement uses any tables, all affected engines are registered in the statement engine list. In non-autocommit mode, the same engines are registered in the normal transaction list. At the end of the statement, the server issues a commit or a rollback for all engines in the statement list. At this point the transaction flags of an engine, if any, are propagated from the statement list to the list of the normal transaction. When commit/rollback is finished, the statement list is cleared. It will be filled in again by the next statement, and emptied again at the next statement's end.

The normal transaction is committed in a similar way (by going over all engines in thd->transaction.all list) but at different times:

When the user issues an SQL COMMIT statement

Implicitly, when the server begins handling a DDL statement or SET AUTOCOMMIT={0|1} statement

The normal transaction can be rolled back as well:

When the user isues an SQL ROLLBACK statement

When one of the storage engines requests a rollback by setting thd->transaction_rollback_request

For example, the latter condition may occur when the transaction in the engine was chosen as a victim of the internal deadlock resolution algorithm and rolled back internally. In such situations there is little the server can do and the only option is to roll back transactions in all other participating engines, and send an error to the user.

From the use cases above, it follows that a normal transaction is never committed when there is an outstanding statement transaction. In most cases there is no conflict, because commits of a normal transaction are issued by a stand-alone administrative or DDL statement, and therefore no outstanding statement transaction of the previous statement can exist. Besides, all statements that operate via a normal transaction are prohibited in stored functions and triggers, therefore no conflicting situation can occur in a sub-statement either. The remaining rare cases, when the server explicitly must commit a statement transaction prior to committing a normal transaction, are error-handling cases (see for example SQLCOM_LOCK_TABLES).

When committing a statement or a normal transaction, the server either uses the two-phase commit protocol, or issues a commit in each engine independently. The server uses the two-phase commit protocol only if:

All participating engines support two-phase commit (by providing a handlerton::prepare PSEA API call), and

Transactions in at least two engines modify data (that is, are not read-only)

Note that the two-phase commit is used for statement transactions, even though statement transactions are not durable anyway. This ensures logical consistency of data in a multiple- engine transaction. For example, imagine that some day MySQL supports unique constraint checks deferred until the end of the statement. In such a case, a commit in one of the engines could yield ER_DUP_KEY, and MySQL should be able to gracefully abort the statement transactions of other participants.

After the normal transaction has been committed, the thd->transaction.all list is cleared.

When a connection is closed, the current normal transaction, if any, is rolled back.


## 6.5 Roles and Responsibilities

The server has only one way to know that an engine participates in the statement and a transaction has been started in an engine: the engine says so. So, in order to be a part of a transaction, an engine must "register" itself. This is done by invoking the trans_register_ha() server call. Normally the engine registers itself whenever handler::external_lock() is called. Although trans_register_ha() can be invoked many times, it does nothing if the engine is already registered. If autocommit is not set, the engine must register itself twice -- both in the statement list and in the normal transaction list. A parameter of trans_register_ha() specifies which list to register.

Note: Although the registration interface in itself is fairly clear, the current usage practice often leads to undesired effects. For example, since a call to trans_register_ha() in most engines is embedded into an implementation of handler::external_lock(), some DDL statements start a transaction (at least from the server point of view) even though they are not expected to. For example CREATE TABLE does not start a transaction, since handler::external_lock() is never called during CREATE TABLE. But CREATE TABLE ... SELECT does, since handler::external_lock() is called for the table that is being selected from. This has no practical effects currently, but we must keep it in mind nevertheless.

Once an engine is registered, the server will do the rest of the work.

During statement execution, whenever any data-modifying PSEA API methods are used (for example, handler::write_row() or handler::update_row()), the read-write flag is raised in the statement transaction for the relevant engine. Currently All PSEA calls are "traced", and the only way to change data is to issue a PSEA call. Important: Unless this invariant is preserved, the server will not know that a transaction in a given engine is read-write and will not involve the two-phase commit protocol!

The end of a statement causes invocation of the ha_autocommit_or_rollback() server call, which in turn invokes handlerton::prepare() for every involved engine. After handlerton::prepare(), there's a call to handlerton::commit_one_phase(). If a one-phase commit will suffice, handlerton::prepare() is not invoked and the server only calls handlerton::commit_one_phase(). At statement commit, the statement-related read-write engine flag is propagated to the corresponding flag in the normal transaction. When the commit is complete, the list of registered engines is cleared.

Rollback is handled in a similar way.

## 6.6 Additional Notes on DDL and the Normal Transaction

DDL statements and operations with nontransactional engines do not "register" in thd->transaction lists, and thus do not modify the transaction state. Besides, each DDL statement in MySQL begins with an implicit normal transaction commit (a call to end_active_trans()), and thus leaves nothing to modify. However, as noted above for CREATE TABLE .. SELECT, some DDL statements can start a *new* transaction.

Behavior of the server in this case is currently badly defined. DDL statements use a form of "semantic" logging to maintain atomicity: If CREATE TABLE t .. SELECT fails, table t is deleted. In addition, some DDL statements issue interim transaction commits: for example, ALTER TABLE issues a commit after data is copied from the original table to the internal temporary table. Other statements, for example, CREATE TABLE ... SELECT, do not always commit after themselves. And finally there is a group of DDL statements such as RENAME/DROP TABLE, which don't start new transactions and don't commit.

This diversity makes it hard to say what will happen if by chance a stored function is invoked during a DDL statement -- it's not clear whether any modifications it makes will be committed or not. Fortunately, SQL grammar allows only a few DDL statements to invoke stored functions. Perhaps, for consistency, MySQL should always commit a normal transaction after a DDL statement, just as it commits a statement transaction at the end of a statement.
