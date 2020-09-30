# Using MySQL UNIQUE Index

how to use the MySQL UNIQUE index to prevent duplicate values in one or more columns in a table.

# 实战MySQL唯一索引

本文介绍如何使用MySQL的唯一索引，防止表中出现逻辑上重复的值。

## Introduction to the MySQL UNIQUE index

To enforce the uniqueness value of one or more columns, you often use the PRIMARY KEY constraint. However, each table can have only one primary key. Hence, if you want to have a more than one column or a set of columns with unique values, you cannot use the primary key constraint.

Luckily, MySQL provides another kind of index called UNIQUE index that allows you to enforce the uniqueness of values in one or more columns. Unlike the PRIMARY KEY index, you can have more than one UNIQUE index per table.

To create a UNIQUE index, you use the CREATE UNIQUE INDEX statement as follows:

## 简介

要保证一列或多列的数据唯一性，通常使用主键约束(PRIMARY KEY)。
但每个表只能有一个主键。 如果其他列还要保证唯一性，就不能再使用主键约束了。

为了应对这种情况，MySQL提供了唯一索引(UNIQUE index)， 可以在一个或多个列中保证数据的唯一性。
与PRIMARY KEY索引不同，每个表可以有多个 UNIQUE index 索引。

要创建 UNIQUE index 索引，可以使用 `CREATE UNIQUE INDEX`语句，示例如下：


```sql
CREATE UNIQUE INDEX index_name
ON table_name(index_column_1,index_column_2,...);
```

Another way to enforce the uniqueness of value in one or more columns is to use the UNIQUE constraint.

When you create a UNIQUE constraint, MySQL creates a UNIQUE index behind the scenes.

The following statement illustrates how to create a unique constraint when you create a table.

另一种方法是在建表语句中使用唯一约束(UNIQUE constraint)。

创建唯一约束时，MySQL会自动创建对应的唯一索引。

建表时同时创建唯一约束的语法为:

```sql
CREATE TABLE table_name(
...
   UNIQUE KEY(index_column_,index_column_2,...)
);
```

In this statement, you can also use the UNIQUE INDEX instead of the UNIQUE KEY because they are synonyms.

If you want to add a unique constraint to an existing table, you can use the ALTER TABLE statement as follows:


在建表语句中，也可以使用 `UNIQUE INDEX` 代替 `UNIQUE KEY`，因为它们是同义词(synonyms)。

如果要向现有的表添加唯一约束，则可以使用 `ALTER TABLE` 语句，如下所示：

```
ALTER TABLE table_name
ADD CONSTRAINT constraint_name UNIQUE KEY(column_1,column_2,...);
```


## CREATE INDEX Statement

## 创建索引的语法

`CREATE INDEX` 创建索引的语法格式定义为 ：

```sql
CREATE [UNIQUE | FULLTEXT | SPATIAL] INDEX index_name
    [index_type]
    ON tbl_name (key_part,...)
    [index_option]
    [algorithm_option | lock_option] ...
```

其各个部分的定义如下:

```sql
key_part: {col_name [(length)] | (expr)} [ASC | DESC]

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
  | {VISIBLE | INVISIBLE}
}

index_type:
    USING {BTREE | HASH}

algorithm_option:
    ALGORITHM [=] {DEFAULT | INPLACE | COPY}

lock_option:
    LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
```


## 建表语句的语法



## 修改表结构的语法




## Unique Indexes

A UNIQUE index creates a constraint such that all values in the index must be distinct. An error occurs if you try to add a new row with a key value that matches an existing row. If you specify a prefix value for a column in a UNIQUE index, the column values must be unique within the prefix length. A UNIQUE index permits multiple NULL values for columns that can contain NULL.

If a table has a PRIMARY KEY or UNIQUE NOT NULL index that consists of a single column that has an integer type, you can use _rowid to refer to the indexed column in SELECT statements, as follows:

_rowid refers to the PRIMARY KEY column if there is a PRIMARY KEY consisting of a single integer column. If there is a PRIMARY KEY but it does not consist of a single integer column, _rowid cannot be used.

Otherwise, _rowid refers to the column in the first UNIQUE NOT NULL index if that index consists of a single integer column. If the first UNIQUE NOT NULL index does not consist of a single integer column, _rowid cannot be used.

## 唯一索引的特性

问题:

- 1. MySQL唯一索引列中, 可以有多行包含NULL值吗？

唯一索引不仅是索引，同时还会创建唯一约束，使索引中的每个值都不同。
如果尝试添加与现有的key值一样的新行，则会报错。
如果唯一索引只约束对应列中最前面的N个字符，那么对应列中前面的N个字符也就必须保持唯一。
对于允许NULL值的列，唯一索引允许存在多个NULL值。

如果存在整数类型的单列 PRIMARY KEY, 或者具有 UNIQUE NOT NULL 的单列索引, 则可以使用虚拟列 `_rowid` 来引用SELECT语句中的索引列，如下所示：

- 如果是单列主键，并且为整数类型, 则 `_rowid` 就是指向 PRIMARY KEY 列。如果主键不是单列的整数，则不能使用 `_rowid`。
- 此外, 如果第一个 UNIQUE NOT NULL 索引是单个整数列, 则 `_rowid` 指向符合条件的列。如果第一个 UNIQUE NOT NULL 索引不由单个整数列组成，则不能使用 `_rowid`。

示例:

```
select _rowid from t1;
```


## MySQL UNIQUE Index & NULL

Unlike other database systems, MySQL considers NULL values as distinct values. Therefore, you can have multiple NULL values in the UNIQUE index.

This is how MySQL was designed. It is not a bug even though it was reported as a bug.

Another important point is that the UNIQUE constraint does not apply to NULL values except for the BDB storage engine.

## 唯一索引与 `NULL` 值

与其他数据库不同之处在于，MySQL将`NULL`视为独特的值(distinct values)。 因此，在UNIQUE索引中可以有多个NULL值。

这就是MySQL的设计方式。 虽然有人认为这是BUG，但我们不认为这是BUG。

另外很重要的一点是，除了BDB存储引擎之外，其他的数据库引擎都不会在 UNIQUE constraint 中索引NULL值。


## MySQL UNIQUE index examples

Suppose, you want to manage contacts in an application. You also want that email of every contact in the contacts table must be unique.

To enforce this rule, you create a unique constraint in the CREATE TABLE statement as follows:

## 示例

假设我们有一个系统用例管理联系人信息。 希望联系人信息表中，email 地址保持唯一。

要强制执行此规则，可以在建表语句中创建唯一约束，如下所示：


```sql
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    UNIQUE KEY unique_email (email)
);
```

If you use the SHOW INDEXES statement, you will see that MySQL created a UNIQUE index for email column.

查看索引信息，可以使用 `SHOW INDEXES` 语句，例如:

```sql
SHOW INDEXES FROM contacts;
```

Let’s insert a row into the contacts table.

插入数据:

```sql
INSERT INTO contacts(first_name,last_name,phone,email)
VALUES('John','Doe','(408)-999-9765','john.doe@mysqltutorial.org');
```

Now if you try to insert a row whose email is john.doe@mysqltutorial.org, you will get an error message.

如果尝试插入重复数据, 则会报错:

```sql
INSERT INTO contacts(first_name,last_name,phone,email)
VALUES('Johny','Doe','(408)-999-4321','john.doe@mysqltutorial.org');
```

会收到类似下面这样的错误提示信息:

```
Error Code: 1062. Duplicate entry 'john.doe@mysqltutorial.org' for key 'unique_email'
```

Suppose you want the combination of first_name, last_name, and  phone is also unique among contacts. In this case, you use the CREATE INDEX statement to create a UNIQUE index for those columns as follows:

如果还希望 `first_name`, `last_name`, 和 `phone` 的组合在表中唯一。
则可以使用 CREATE INDEX 语句来增加唯一索引，示例为:

```sql
CREATE UNIQUE INDEX idx_name_phone
ON contacts(first_name,last_name,phone);
```

Adding the following row into the contacts table causes an error because the combination of the first_name, last_name, and phone already exists.

添加 first_name，last_name和phone 的相同组合则会报错。


```sql
INSERT INTO contacts(first_name,last_name,phone,email)
VALUES('john','doe','(408)-999-9765','john.d@mysqltutorial.org');
```

错误提示信息差不多, 提示也很明确:

```
Error Code: 1062. Duplicate entry 'john-doe-(408)-999-9765' for key 'idx_name_phone'
```

## Reference

## 参考链接

- https://www.mysqltutorial.org/mysql-unique/

- https://dev.mysql.com/doc/refman/8.0/en/create-index.html

- https://dev.mysql.com/doc/refman/8.0/en/create-table.html
