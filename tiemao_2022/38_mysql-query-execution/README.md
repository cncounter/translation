# How is a query executed in MySQL?

This post is for the testers who have some basic idea about MySQL database. I want to put up few things I came across when I dove deeper into MySQL. Here’s a brief overview of the order in which a query is executed inside a MySQL server.

# MySQL入门系列：SQL查询语句的执行顺序

本文主要面向具有一定 MySQL 经验的测试人员。 

在深入研究 MySQL 时，我想到和遇到的一些情况。 下文简要描述了 MySQL 服务器执行SQL查询语句的顺序。


------

When you execute a SQL query, the order in which the SQL directives get executed is:

执行 SQL 单表查询时，各个SQL指令的执行顺序一般是：

- `FROM` 子句
- `WHERE` 子句
- `GROUP BY` 子句
- `HAVING` 子句
- `SELECT` 子句
- `ORDER BY` 子句

However, `HAVING` and `GROUP BY` clauses can come after `SELECT` depending on the order it is specified in the query.

How are queries executed at the back-end by the database engine? Let’s take an example for each of the clauses and understand the sequence.

当然，`HAVING` 子句和 `GROUP BY` 子句, 可能会在 `SELECT` 之后执行，具体取决于查询中指定的顺序。

数据库引擎在后端数如何执行查询的？ 我们通过实例来对每个子句的执行顺序加深理解。

```sql
SELECT * 
  FROM order_details 
  WHERE category = 'produce';
```

The first clause which gets executed is the `FROM` clause, which is used to list the tables and any joins required for the query. It is through this clause we can narrow down possible record set sizes. The above query is straight forward without any joins.

这里第一个执行的是 `FROM` 子句, 也就是列出查询所需的表, 以及需要连接的表。 

通过 `FROM` 子句，限定了可能查询的记录的范围。 

这个查询是直接查询，没有任何连接。

Let’s take another example with `JOIN` in the query

接下来我们看一个带有 `JOIN` 的实例：

```sql
SELECT order_details.order_id, customers.customer_name 
  FROM customers 
  INNER JOIN order_details 
  ON customers.customer_id = order_details.customer_id;
```

In the above query, `JOIN` condition is evaluated in the first step. The order of `JOIN` operation is determined dynamically by the query optimizer when it constructs its query plan. The `ON` condition is the criteria for deciding which rows to join from each table. The result of the `FROM` clause is a temporary result (like a temporary table), consisting of combined rows which satisfy all the join conditions. In the above example, MySQL would return all rows from the `customers` and `order_details` tables where there is a matching `customer_id` value in both the `customers` and `order_details` tables.

在这个查询中， `JOIN` 条件在第一步进行评估。 `JOIN` 操作的顺序，由查询优化器，在构建查询计划时动态确定。 `ON` 条件是决定每张表中连接哪些数据行的标准。 
`FROM` 子句的结果是一个临时结果（逻辑上有点像一张临时表），由满足所有连接条件的行组合组成。
在上面的示例中，MySQL 将返回 `customers` 和 `order_details` 表中, 满足条件的所有行，其中 `customers` 和 `order_details` 表中都有匹配的 `customer_id` 值。

Next, comes the `WHERE` clause. If you don’t specify the `WHERE` clause in the statement the optimizer retrieves all the rows from the temporary result. In a query with a `WHERE` clause, each row in the temporary result is evaluated according to the `WHERE` conditions, and either discarded or retained.

接下来是 `WHERE` 子句。 如果在语句中没有指定 `WHERE` 子句，优化器将从临时结果中取出所有行。
在带有 `WHERE` 子句的查询中，临时结果中的每一行, 都根据 `WHERE` 条件进行比对，要么丢弃要么保留。

Next, comes the `GROUP BY` clause, which is an optional part of the `SELECT` statement. If there’s a `GROUP BY` clause, the temporary result is now split into groups, one group for every combination of values in the columns in the `GROUP BY` clause. When you perform `GROUP BY` on table it will retrieve the first row in that group. The below `GROUP BY` example uses the `COUNT` function to return the product and the number of orders (for that product) that are in the produce category.

接下来是 `GROUP BY` 子句，这在 `SELECT` 语句中是可选的部分。
如果存在 `GROUP BY` 子句，临时结果将会被分组，一个组对应 `GROUP BY` 子句中的列的每个值的组合。
对表执行 `GROUP BY` 时，将获取这个组中的第一行。 

下面的 `GROUP BY` 示例, 使用 `COUNT` 函数返回产品类别中的 product, 以及该产品对应的订单数量。

```sql
SELECT product, COUNT(*) AS "Number of orders"  
  FROM order_details  
  WHERE category = 'produce' 
  GROUP BY product;
```

Now comes the `HAVING` clause. The `HAVING` clause enables you to specify conditions that filter which group results appear in the final results. It operates once on each group, and all rows from groups which do not satisfy the `HAVING` clause are eliminated. In the below query, after having assembled an entire temporary result table, the optimizer will filter the results so that only products with more than 20 orders will be returned. After the `HAVING` clause has filtered the groups, a new temporary result set is produced, and in this new temporary result, there is only one row per group.

接下来是 `HAVING` 子句。 
`HAVING` 子句使我们能够指定过滤哪些 Group 结果。 它在每个组上运行一次，并且将不满足 `HAVING` 子句的所有行都删除。 
在下面的查询中，在构造了一个完整的临时结果表之后，优化器将过滤结果，以便只返回订单数超过 20 个的产品。 
`HAVING` 子句过滤完这些分组数据后，会产生一个新的临时结果集，在这个新的临时结果中，每个组只有一行结果。

```sql
SELECT product, COUNT(*) AS "Number of orders" 
  FROM order_details 
  WHERE category = 'produce' 
  GROUP BY product 
  HAVING COUNT(*) > 20;
```

The MySQL `HAVING` clause is used in combination with the `GROUP BY` clause to restrict the groups of returned rows to only those whose the condition is TRUE.


MySQL `HAVING` 子句与 `GROUP BY` 子句结合使用，以将返回行的组限制为仅条件为 TRUE 的行。

Next, comes the `SELECT` clause. From the rows of the new temporary result produced by the `GROUP BY` and `HAVING` clauses, the `SELECT` now assembles the columns it needs.

接下来是 `SELECT` 子句。 
从 `GROUP BY` 和 `HAVING` 子句产生的新临时结果中，`SELECT` 接着组装它需要的列。

Finally, the last step is the `ORDER BY` clause. The `ORDER BY` clause is used to sort the records in the result set. In queries with both a `GROUP BY` and `ORDER BY` clause, you can reference columns in the `ORDER BY` only if they are in the new temporary result produced by the grouping process, i.e. columns in the `GROUP BY` or aggregate functions.

最后一步是 `ORDER BY` 子句。 
`ORDER BY` 子句用于对结果集中的记录进行排序。 
在同时包含 `GROUP BY` 和 `ORDER BY` 子句的查询中，只有在分组之后生成的新临时结果中存在的列，才能在 `ORDER BY` 中引用，比如 `GROUP BY` 中的列或 聚合函数的结果。


```sql
SELECT * 
  FROM (
    SELECT product, COUNT(*) AS "Number of orders" 
    FROM order_details 
    WHERE supplier_name = 'Microsoft' 
    GROUP BY product
  ) AS temp_table 
  ORDER BY supplier_city DESC;
```

In the above example, `GROUP BY` will be executed first and then `ORDER BY` Clause. Using non-aggregate columns in a `SELECT` with a `GROUP BY` clause is non-standard. MySQL will generally return the values of the first row it finds and discards the rest. Any `ORDER BY` clauses will only apply to the returned column value, not to the discarded ones.

在上面的例子中，先执行子查询中的 `GROUP BY` 操作，然后是外层 `ORDER BY` 子句。 
在带有 `GROUP BY` 子句的 `SELECT` 中使用非聚合列是非标准的(MySQL中有参数开关)。 MySQL 通常会返回它找到的第一行的值, 丢弃余下的。 
任何 `ORDER BY` 子句仅适用于返回的列值，而不管被丢弃的值。

------

That’s all folks! Query execution is not that complicated. MySQL simply follows its plan, fetching rows from each table in order and joining based on the relevant columns. Along the way, it may need to create a temporary table to store the results. Once all the rows are available, it sends them to the client.

就是这些！ 查询的执行过程并不复杂。 MySQL 只是按照它的计划，按顺序从每个表中获取行, 并根据相关列进行连接。 
在这个过程中，它可能需要创建一个临时表来存储结果。 一旦所有行都处理完，则将结果返回给客户端。


------


## 相关链接

- 原文链接: <https://qxf2.com/blog/mysql-query-execution/>
