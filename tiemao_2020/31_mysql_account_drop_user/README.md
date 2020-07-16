# MySQL删除用户DROP USER语句简介


## 语法格式

MySQL官方文档给出的删除用户语法为:

```sql
DROP USER [IF EXISTS] user [, user] ...
```

The [`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) statement removes one or more MySQL accounts and their privileges. It removes privilege rows for the account from all grant tables.

可以看到, [`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) 语句一次可以删除一到多个用户， 删除用户的同时,也会从所有授权表中删除该帐户所有的权限。

Roles named in the [`mandatory_roles`](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_mandatory_roles) system variable value cannot be dropped.

当然, [`mandatory_roles`](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_mandatory_roles) 系统变量中的角色不能删除。

## 权限限制

To use [`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html), you must have the global [`CREATE USER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_create-user) privilege, or the [`DELETE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_delete) privilege for the `mysql` system schema. When the [`read_only`](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_read_only) system variable is enabled, [`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) additionally requires the [`CONNECTION_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_connection-admin) privilege (or the deprecated [`SUPER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_super) privilege).

要执行删除用户的操作，则当前登录的用户至少具有以下权限之一：

- 1. 全局的 [`CREATE USER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_create-user) 权限。
- 2. `mysql` 库中的 [`DELETE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_delete) 权限。

如果启用了系统变量 [`read_only`](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_read_only)，则删除用户时还需要校验额外的权限，至少具有以下一项：

- [`CONNECTION_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_connection-admin) 权限。
- [`SUPER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_super) 权限（不建议，已废弃）。


[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) either succeeds for all named users or rolls back and has no effect if any error occurs. By default, an error occurs if you try to drop a user that does not exist. If the `IF EXISTS` clause is given, the statement produces a warning for each named user that does not exist, rather than an error.

[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) 也具有原子特性，要么所有用户全部删除成功，要么就回滚， 如果有任何错误发生都会回滚。 默认情况下，如果尝试删除不存在的用户，则会报错。 如果指定了 `IF EXISTS` 子句，则会将不存在的用户转换为警告，而不再报错。

The statement is written to the binary log if it succeeds, but not if it fails; in that case, rollback occurs and no changes are made. A statement written to the binary log includes all named users. If the `IF EXISTS` clause is given, this includes even users that do not exist and were not dropped.

如果删除用户执行成功，则将语句写入 bin-log；
如果失败则不会写入，并进行回滚，相当于没有任何更改。
写入 bin-log 的语句中包含所有命名的用户。
如果给出了 `IF EXISTS` 子句，则 bin-log 中会包括不存在且未删除的用户。

## 使用示例

Each account name uses the format described in [Section 6.2.4, “Specifying Account Names”](https://dev.mysql.com/doc/refman/8.0/en/account-names.html). For example:

用户名称的格式详情，请参考: [MySQL用户命名规范](../30_mysql_account_username/README.md)

简单的示例:

```sql
DROP USER 'jeffrey'@'localhost';
```

The host name part of the account name, if omitted, defaults to `'%'`.

如果不指定账号的 host 部分, 则默认值为 `'%'`。

## 重要提示

Important

[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) does not automatically close any open user sessions. Rather, in the event that a user with an open session is dropped, the statement does not take effect until that user's session is closed. Once the session is closed, the user is dropped, and that user's next attempt to log in will fail. *This is by design*.

[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) 操作不会断开已连接用户的session。
而且，如果被删除的用户当前还有连接和会话，则DROP USER语句在该用户的(所有？)会话关闭之前都不会生效。
一旦关闭（所有?）会话，则用户被删除，并且该用户下一次登录将被拒绝。 **设计如此**。


[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) does not automatically drop or invalidate databases or objects within them that the old user created. This includes stored programs or views for which the `DEFINER` attribute names the dropped user. Attempts to access such objects may produce an error if they execute in definer security context. (For information about security context, see [Section 24.6, “Stored Object Access Control”](https://dev.mysql.com/doc/refman/8.0/en/stored-objects-security.html).)

[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) 只删用户和权限，而不会删除该用户创建的数据库或对象。
也不会删除 `DEFINER` 等于对应用户的存储过程或视图。
但如果尝试在安全限制严格的程序上下文中执行，则访问这类对象可能会产生错误。
关于安全上下文的信息，请参考: [Section 24.6, “Stored Object Access Control”](https://dev.mysql.com/doc/refman/8.0/en/stored-objects-security.html)。



## 参考链接

- [MySQL官方文档: DROP USER Statement](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html)
