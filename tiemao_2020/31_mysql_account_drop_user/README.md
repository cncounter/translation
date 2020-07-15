# MySQL删除用户语法



```sql
DROP USER [IF EXISTS] user [, user] ...
```

The [`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) statement removes one or more MySQL accounts and their privileges. It removes privilege rows for the account from all grant tables.

Roles named in the [`mandatory_roles`](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_mandatory_roles) system variable value cannot be dropped.

To use [`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html), you must have the global [`CREATE USER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_create-user) privilege, or the [`DELETE`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_delete) privilege for the `mysql` system schema. When the [`read_only`](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_read_only) system variable is enabled, [`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) additionally requires the [`CONNECTION_ADMIN`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_connection-admin) privilege (or the deprecated [`SUPER`](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html#priv_super) privilege).

[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) either succeeds for all named users or rolls back and has no effect if any error occurs. By default, an error occurs if you try to drop a user that does not exist. If the `IF EXISTS` clause is given, the statement produces a warning for each named user that does not exist, rather than an error.

The statement is written to the binary log if it succeeds, but not if it fails; in that case, rollback occurs and no changes are made. A statement written to the binary log includes all named users. If the `IF EXISTS` clause is given, this includes even users that do not exist and were not dropped.

Each account name uses the format described in [Section 6.2.4, “Specifying Account Names”](https://dev.mysql.com/doc/refman/8.0/en/account-names.html). For example:

```sql
DROP USER 'jeffrey'@'localhost';
```

The host name part of the account name, if omitted, defaults to `'%'`.

Important

[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) does not automatically close any open user sessions. Rather, in the event that a user with an open session is dropped, the statement does not take effect until that user's session is closed. Once the session is closed, the user is dropped, and that user's next attempt to log in will fail. *This is by design*.

[`DROP USER`](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html) does not automatically drop or invalidate databases or objects within them that the old user created. This includes stored programs or views for which the `DEFINER` attribute names the dropped user. Attempts to access such objects may produce an error if they execute in definer security context. (For information about security context, see [Section 24.6, “Stored Object Access Control”](https://dev.mysql.com/doc/refman/8.0/en/stored-objects-security.html).)



## 参考链接

- [MySQL官方文档: DROP USER Statement](https://dev.mysql.com/doc/refman/8.0/en/drop-user.html)
