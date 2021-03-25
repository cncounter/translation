# 删除MySQL用户帐号 - DROP USER语句简介


## 语法格式

删除MySQL用户帐号的语法格式为:

```sql
DROP USER [IF EXISTS] user [, user] ...
```

The [`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) statement removes one or more MySQL accounts and their privileges. It removes privilege rows for the account from all grant tables.

可以看到, 一条 [`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) 语句能删除多个用户。

删除用户帐号的同时, 也会将授权信息表中对应的权限一起删除。
帐号
Roles named in the [`mandatory_roles`](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_mandatory_roles) system variable value cannot be dropped.

注意, 名字在 [`mandatory_roles`](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_mandatory_roles) 系统变量中的角色不能删除。

## 删除用户需要具有的权限

To use [`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html), you must have the global [`CREATE USER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_create-user) privilege, or the [`DELETE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_delete) privilege for the `mysql` system schema. When the [`read_only`](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_read_only) system variable is enabled, [`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) additionally requires the [`CONNECTION_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_connection-admin) privilege (or the deprecated [`SUPER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_super) privilege).

要删除用户，则当前登录的管理员帐号至少要具备以下权限之一：

- 1. 全局的 [`CREATE USER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_create-user) 权限。
- 2. `mysql` 系统数据库的 [`DELETE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_delete) 权限。

如果启用了系统变量 [`read_only`](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_read_only)，则删除用户时还会额外校验权限，要求至少具备以下一项权限：

- [`CONNECTION_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_connection-admin) 权限。
- [`SUPER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_super) 权限（不建议使用这个，官方已废弃）。


[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) either succeeds for all named users or rolls back and has no effect if any error occurs. By default, an error occurs if you try to drop a user that does not exist. If the `IF EXISTS` clause is given, the statement produces a warning for each named user that does not exist, rather than an error.

[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) 具有原子性，要么将指定的所有用户一次性全部成功删除，有任何错误都会进行回滚。 默认情况下，如果删除不存在的用户，则会报错。 但如果指定了 `IF EXISTS` 子句，则不再报错，而是将不存在的错误提示转为警告。

The statement is written to the binary log if it succeeds, but not if it fails; in that case, rollback occurs and no changes are made. A statement written to the binary log includes all named users. If the `IF EXISTS` clause is given, this includes even users that do not exist and were not dropped.

如果成功删除用户，则将SQL语句写入 bin-log；执行失败则不会写入，并进行回滚，相当于没进行任何变更。
写入 bin-log 的语句中包含指定的所有命名用户。
如果带有 `IF EXISTS` 子句，则 bin-log 中还会包含主库中不存在且未删除的用户。【场景: 主从库的用户不一致】

## 使用示例

Each account name uses the format described in [Section 6.2.4, “Specifying Account Names”](https://dev.mysql.com/doc/refman/8.0/en/account-names.html). For example:

用户名称的格式详情，请参考: [MySQL用户命名规范](https://github.com/cncounter/translation/blob/master/tiemao_2020/30_mysql_account_username/README.md)

简单示例:

```sql
DROP USER 'jeffrey'@'localhost';
```

The host name part of the account name, if omitted, defaults to `'%'`.

如果不指定帐号的 host name 部分, 则默认为 `'%'`。

## 重要提示

Important

[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) does not automatically close any open user sessions. Rather, in the event that a user with an open session is dropped, the statement does not take effect until that user's session is closed. Once the session is closed, the user is dropped, and that user's next attempt to log in will fail. *This is by design*.

[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) 操作不会断开已登录用户的session连接。
如果被删除的用户还有存活的连接和会话，则 DROP USER 语句在该用户的所有会话关闭之前并不会生效。
一旦被删除的用户关闭了所有会话，则用户会被删除。 并且该用户下一次登录时将被拒绝。 **MySQL就是这样设计的^_^**。

> 特殊情况可以先撤销授权、并且需要强制杀掉对应用户的所有连接。


[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) does not automatically drop or invalidate databases or objects within them that the old user created. This includes stored programs or views for which the `DEFINER` attribute names the dropped user. Attempts to access such objects may produce an error if they execute in definer security context. (For information about security context, see [Section 24.6, “Stored Object Access Control”](https://dev.mysql.com/doc/refman/8.0/en/stored-objects-security.html).)

[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) 只删用户和权限，而不会删除该用户创建的数据库或对象。
也不会删除 `DEFINER` 属性等于该用户的存储过程和视图。

但如果尝试在安全限制严格的应用上下文环境中执行，则访问这类对象可能会报错。
关于安全上下文的信息，请参考: [Section 24.6, “Stored Object Access Control”](https://dev.mysql.com/doc/refman/8.0/en/stored-objects-security.html)。



## 参考链接

- [MySQL官方文档: DROP USER Statement](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html)
- [GitHub双语对照版: 删除MySQL用户帐号 - DROP USER语句简介](https://github.com/cncounter/translation/blob/master/tiemao_2020/31_mysql_account_drop_user/README.md)
