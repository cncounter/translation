# How is a query executed in MySQL?

This post is for the testers who have some basic idea about MySQL database. I want to put up few things I came across when I dove deeper into MySQL. Here’s a brief overview of the order in which a query is executed inside a MySQL server.

------

When you execute a SQL query, the order in which the SQL directives get executed is:

- `FROM` clause
- `WHERE` clause
- `GROUP BY` clause
- `HAVING` clause
- `SELECT` clause
- `ORDER BY` clause

However, `HAVING` and `GROUP BY` clauses can come after `SELECT` depending on the order it is specified in the query.

How are queries executed at the back-end by the database engine? Let’s take an example for each of the clauses and understand the sequence.

```sql
SELECT * 
  FROM order_details 
  WHERE category = 'produce';
```

The first clause which gets executed is the `FROM` clause, which is used to list the tables and any joins required for the query. It is through this clause we can narrow down possible record set sizes. The above query is straight forward without any joins.

Let’s take another example with `JOIN` in the query

```sql
SELECT order_details.order_id, customers.customer_name 
  FROM customers 
  INNER JOIN order_details 
  ON customers.customer_id = order_details.customer_id;
```

In the above query, `JOIN` condition is evaluated in the first step. The order of `JOIN` operation is determined dynamically by the query optimizer when it constructs its query plan. The `ON` condition is the criteria for deciding which rows to join from each table. The result of the `FROM` clause is a temporary result (like a temporary table), consisting of combined rows which satisfy all the join conditions. In the above example, MySQL would return all rows from the `customers` and `order_details` tables where there is a matching `customer_id` value in both the `customers` and `order_details` tables.

Next, comes the `WHERE` clause. If you don’t specify the `WHERE` clause in the statement the optimizer retrieves all the rows from the temporary result. In a query with a `WHERE` clause, each row in the temporary result is evaluated according to the `WHERE` conditions, and either discarded or retained.

Next, comes the `GROUP BY` clause, which is an optional part of the `SELECT` statement. If there’s a `GROUP BY` clause, the temporary result is now split into groups, one group for every combination of values in the columns in the `GROUP BY` clause. When you perform `GROUP BY` on table it will retrieve the first row in that group. The below `GROUP BY` example uses the `COUNT` function to return the product and the number of orders (for that product) that are in the produce category.

```sql
SELECT product, COUNT(*) AS "Number of orders"  
  FROM order_details  
  WHERE category = 'produce' 
  GROUP BY product;
```

Now comes the `HAVING` clause. The `HAVING` clause enables you to specify conditions that filter which group results appear in the final results. It operates once on each group, and all rows from groups which do not satisfy the `HAVING` clause are eliminated. In the below query, after having assembled an entire temporary result table, the optimizer will filter the results so that only products with more than 20 orders will be returned. After the `HAVING` clause has filtered the groups, a new temporary result set is produced, and in this new temporary result, there is only one row per group.

```sql
SELECT product, COUNT(*) AS "Number of orders" 
  FROM order_details 
  WHERE category = 'produce' 
  GROUP BY product 
  HAVING COUNT(*) > 20;
```

The MySQL `HAVING` clause is used in combination with the `GROUP BY` clause to restrict the groups of returned rows to only those whose the condition is TRUE.

Next, comes the `SELECT` clause. From the rows of the new temporary result produced by the `GROUP BY` and `HAVING` clauses, the `SELECT` now assembles the columns it needs.

Finally, the last step is the `ORDER BY` clause. The `ORDER BY` clause is used to sort the records in the result set. In queries with both a `GROUP BY` and `ORDER BY` clause, you can reference columns in the `ORDER BY` only if they are in the new temporary result produced by the grouping process, i.e. columns in the `GROUP BY` or aggregate functions.

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

------

That’s all folks! Query execution is not that complicated. MySQL simply follows its plan, fetching rows from each table in order and joining based on the relevant columns. Along the way, it may need to create a temporary table to store the results. Once all the rows are available, it sends them to the client.

------


## 相关链接

- 原文链接: <https://qxf2.com/blog/mysql-query-execution/>
