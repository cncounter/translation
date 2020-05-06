# Using MySQL UNIQUE Index

how to use the MySQL UNIQUE index to prevent duplicate values in one or more columns in a table.

##

```sql
CREATE [UNIQUE | FULLTEXT | SPATIAL] INDEX index_name
    [index_type]
    ON tbl_name (key_part,...)
    [index_option]
    [algorithm_option | lock_option] ...

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

## Unique Indexes

A UNIQUE index creates a constraint such that all values in the index must be distinct. An error occurs if you try to add a new row with a key value that matches an existing row. If you specify a prefix value for a column in a UNIQUE index, the column values must be unique within the prefix length. A UNIQUE index permits multiple NULL values for columns that can contain NULL.

If a table has a PRIMARY KEY or UNIQUE NOT NULL index that consists of a single column that has an integer type, you can use _rowid to refer to the indexed column in SELECT statements, as follows:

_rowid refers to the PRIMARY KEY column if there is a PRIMARY KEY consisting of a single integer column. If there is a PRIMARY KEY but it does not consist of a single integer column, _rowid cannot be used.

Otherwise, _rowid refers to the column in the first UNIQUE NOT NULL index if that index consists of a single integer column. If the first UNIQUE NOT NULL index does not consist of a single integer column, _rowid cannot be used.

## Introduction to the MySQL UNIQUE index

To enforce the uniqueness value of one or more columns, you often use the PRIMARY KEY constraint. However, each table can have only one primary key. Hence, if you want to have a more than one column or a set of columns with unique values, you cannot use the primary key constraint.

Luckily, MySQL provides another kind of index called UNIQUE index that allows you to enforce the uniqueness of values in one or more columns. Unlike the PRIMARY KEY index, you can have more than one UNIQUE index per table.

To create a UNIQUE index, you use the CREATE UNIQUE INDEX statement as follows:

```sql
CREATE UNIQUE INDEX index_name
ON table_name(index_column_1,index_column_2,...);
```

Another way to enforce the uniqueness of value in one or more columns is to use the UNIQUE constraint.

When you create a UNIQUE constraint, MySQL creates a UNIQUE index behind the scenes.

The following statement illustrates how to create a unique constraint when you create a table.

```sql
CREATE TABLE table_name(
...
   UNIQUE KEY(index_column_,index_column_2,...)
);
```

In this statement, you can also use the UNIQUE INDEX instead of the UNIQUE KEY because they are synonyms.

If you want to add a unique constraint to an existing table, you can use the ALTER TABLE statement as follows:

```
ALTER TABLE table_name
ADD CONSTRAINT constraint_name UNIQUE KEY(column_1,column_2,...);
```

## MySQL UNIQUE Index & NULL

Unlike other database systems, MySQL considers NULL values as distinct values. Therefore, you can have multiple NULL values in the UNIQUE index.

This is how MySQL was designed. It is not a bug even though it was reported as a bug.

Another important point is that the UNIQUE constraint does not apply to NULL values except for the BDB storage engine.

## MySQL UNIQUE index examples

Suppose, you want to manage contacts in an application. You also want that email of every contact in the contacts table must be unique.

To enforce this rule, you create a unique constraint in the CREATE TABLE statement as follows:

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

```sql
SHOW INDEXES FROM contacts;
```


Let’s insert a row into the contacts table.

```sql
INSERT INTO contacts(first_name,last_name,phone,email)
VALUES('John','Doe','(408)-999-9765','john.doe@mysqltutorial.org');
```

Now if you try to insert a row whose email is john.doe@mysqltutorial.org, you will get an error message.

```sql
INSERT INTO contacts(first_name,last_name,phone,email)
VALUES('Johny','Doe','(408)-999-4321','john.doe@mysqltutorial.org');
```

```
Error Code: 1062. Duplicate entry 'john.doe@mysqltutorial.org' for key 'unique_email'
```

Suppose you want the combination of first_name, last_name, and  phone is also unique among contacts. In this case, you use the CREATE INDEX statement to create a UNIQUE index for those columns as follows:

```sql
CREATE UNIQUE INDEX idx_name_phone
ON contacts(first_name,last_name,phone);
```

Adding the following row into the contacts table causes an error because the combination of the first_name, last_name, and phone already exists.

```sql
INSERT INTO contacts(first_name,last_name,phone,email)
VALUES('john','doe','(408)-999-9765','john.d@mysqltutorial.org');
```

```
Error Code: 1062. Duplicate entry 'john-doe-(408)-999-9765' for key 'idx_name_phone'
```

## Reference

- https://www.mysqltutorial.org/mysql-unique/

- https://dev.mysql.com/doc/refman/8.0/en/create-index.html

- https://dev.mysql.com/doc/refman/8.0/en/create-table.html
