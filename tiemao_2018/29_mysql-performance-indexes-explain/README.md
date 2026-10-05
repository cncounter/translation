# MySQL Performance Boosting with Indexes and Explain

# 通过explain利用索引调优MySQL性能

**Techniques to improve application performance can come from a lot of different places, but normally the first thing we look at — the most common bottleneck — is the database. Can it be improved? How can we measure and understand what needs and can be improved?**

> **提升系统性能的技术和途径多种多样, 但我们通常最先关注的 —— 也是最常见的瓶颈 —— 是数据库。它能优化吗? 又该如何衡量、理解哪些地方需要并且能够优化呢?**

One very simple yet very useful tool is query profiling. Enabling profiling is a simple way to get a more accurate time estimate of running a query. This is a two-step process. First, we have to enable profiling. Then, we call `show profiles` to actually get the query running time.

一个非常简单但非常有用的工具是查询分析(profiling)。启用 profiling 很简单, 却能更准确地估算查询的执行耗时。分为两步: 首先, 我们要启用 profiling; 然后, 调用`show profiles`来获取查询的实际运行时间。

Let’s imagine we have the following insert in our database (and let’s assume User 1 and Gallery 1 are already created):

假设我们已经在数据库中执行了下面的插入语句(并假设用户1和画廊1已经创建):

```
INSERT INTO `homestead`.`images` (`id`, `gallery_id`, `original_filename`, `filename`, `description`) VALUES
(1, 1, 'me.jpg', 'me.jpg', 'A photo of me walking down the street'),
(2, 1, 'dog.jpg', 'dog.jpg', 'A photo of my dog on the street'),
(3, 1, 'cat.jpg', 'cat.jpg', 'A photo of my cat walking down the street'),
(4, 1, 'purr.jpg', 'purr.jpg', 'A photo of my cat purring');    

```


Obviously, this amount of data will not cause any trouble, but let’s use it to do a simple profile. Let’s consider the following query:

显然, 这点数据量不会造成任何麻烦, 但我们可以用它来做一次简单的性能分析。来看下面这个查询:

```
SELECT * FROM `homestead`.`images` AS i
WHERE i.description LIKE '%street%';

```



This query is a good example of one that can become problematic in the future if we get a lot of photo entries.

这个查询是一个很好的例子: 如果照片条目越来越多, 它将来就可能出问题。

To get an accurate running time on this query, we would use the following SQL:

为了得到这个查询的准确运行时间, 我们使用以下SQL:

```
set profiling = 1;
SELECT * FROM `homestead`.`images` AS i
WHERE i.description LIKE '%street%';
show profiles;

```



The result would look like the following:

结果大致如下:

<table><thead><tr><th>Query_Id</th>
<th>Duration</th>
<th>Query</th>
</tr></thead><tbody><tr><td>1</td>
<td>0.00016950</td>
<td>SHOW WARNINGS</td>
</tr><tr><td>2</td>
<td>0.00039200</td>
<td>SELECT * FROM `homestead`.`images` AS i <br>WHERE i.description LIKE '%street%'<br>LIMIT 0, 1000</td>
</tr><tr><td>3</td>
<td>0.00037600</td>
<td>SHOW KEYS FROM `homestead`.`images`</td>
</tr><tr><td>4</td>
<td>0.00034625</td>
<td>SHOW DATABASES LIKE 'homestead'</td>
</tr><tr><td>5</td>
<td>0.00027600</td>
<td>SHOW TABLES FROM `homestead` LIKE 'images'</td>
</tr><tr><td>6</td>
<td>0.00024950</td>
<td>SELECT * FROM `homestead`.`images` WHERE 0=1</td>
</tr><tr><td>7</td>
<td>0.00104300</td>
<td>SHOW FULL COLUMNS FROM `homestead`.`images` LIKE 'id'</td>
</tr></tbody></table>



As we can see, the `show profiles;` command gives us times not only for the original query but also for all the other queries that are made. This way we can accurately profile our queries.

我们可以看到,`show profiles;`命令不仅给出了原始查询的耗时, 还给出了其他所有查询的耗时。这样我们就能准确地分析各条查询了。

But how can we actually improve them?

但实际上我们该如何改进呢?

We can either rely on our knowledge of SQL and improvise, or we can rely on the MySQL `explain` command and improve our query performance based on actual information.

我们可以凭借自己的SQL知识即兴发挥, 也可以依靠MySQL的`explain`命令, 根据实际信息来提升查询性能。

**Explain** is used to obtain a query execution plan, or how MySQL will execute our query. It works with `SELECT`, `DELETE`, `INSERT`, `REPLACE`, and `UPDATE` statements, and it displays information from the optimizer about the statement execution plan. The [official documentation](https://dev.mysql.com/doc/refman/5.7/en/explain.html) does a pretty good job of describing how `explain` can help us:

**Explain** 用于获取查询执行计划, 也就是MySQL将如何执行我们的查询。它适用于`SELECT`、`DELETE`、`INSERT`、`REPLACE`和`UPDATE`语句, 会显示优化器关于语句执行计划的信息。[官方文档](https://dev.mysql.com/doc/refman/5.7/en/explain.html)很好地描述了`explain`如何帮助我们:

> With the help of EXPLAIN, you can see where you should add indexes to tables so that the statement executes faster by using indexes to find rows. You can also use EXPLAIN to check whether the optimizer joins the tables in an optimal order.

> 借助 EXPLAIN, 可以看到应该在哪里给表添加索引, 让语句利用索引查找行、执行得更快。还可以用 EXPLAIN 检查优化器是否以最优的顺序连接表。

To exemplify the usage of `explain`, we’ll use the query made by our `UserManager.php` to find a user by email:

为了演示`explain`的用法, 我们使用`UserManager.php`中通过电子邮箱查找用户的查询:

```
SELECT * FROM `homestead`.`users` WHERE email = 'claudio.ribeiro@examplemail.com';

```



To use the `explain` command, we simply prepend it before select type queries:

使用`explain`命令, 只需把它放在SELECT类查询之前:

```
EXPLAIN SELECT * FROM `homestead`.`users` WHERE email = 'claudio.ribeiro@examplemail.com';

```



This is the result (scroll right to see all):

这是结果(向右滚动可查看所有列):

<table><thead><tr><th>id</th>
<th>select_type</th>
<th>table</th>
<th>partitions</th>
<th>type</th>
<th>possible_keys</th>
<th>key</th>
<th>key_len</th>
<th>ref</th>
<th>rows</th>
<th>filtered</th>
<th>Extra</th>
</tr></thead><tbody><tr><td>1</td>
<td>SIMPLE</td>
<td>‘users’</td>
<td>NULL</td>
<td>‘const’</td>
<td>‘UNIQ_1483A5E9E7927C74’</td>
<td>‘UNIQ_1483A5E9E7927C74’</td>
<td>‘182’</td>
<td>‘const’</td>
<td>100.00</td>
<td>NULL</td>
<td></td>
</tr></tbody></table>



These results are not easy to understand at first sight, so let’s take a closer look at each one of them:

这些结果乍一看并不容易理解, 下面我们逐一仔细分析:

*   `id`: this is just the sequential identifier for each of the queries within the SELECT.

*`id`: 这只是SELECT中每条查询的顺序编号。

*   `select_type`: the type of SELECT query. This field can take a number of different values, so we will focus on the most important ones:

*`select_type`: SELECT查询的类型。这个字段可以取多种不同的值, 这里只关注最重要的几个:


    *   `SIMPLE`: a simple query without subqueries or unions
    *   `PRIMARY`: the select is in the outermost query in a join
    *   `DERIVED`: the select is a part of a subquery within a from
    *   `SUBQUERY`: the first select in a subquery
    *   `UNION`: the select is the second or later statement of a union.

*`SIMPLE`: 简单查询, 不包含子查询或UNION
*`PRIMARY`: 连接中最外层的SELECT查询
*`DERIVED`: FROM子句中子查询的一部分
*`SUBQUERY`: 子查询中的第一个SELECT
*`UNION`: UNION中第二个及之后的SELECT语句。


    The full list of values that can appear in a `select_type` field can be found [here](https://dev.mysql.com/doc/refman/5.5/en/explain-output.html#explain_select_type).

`select_type`字段可能出现的完整取值列表可以[在这里](https://dev.mysql.com/doc/refman/5.5/en/explain-output.html#explain_select_type)找到。

*   `table`: the table referred to by the row.

*`table`: 该行所引用的表。

*   `type`: this field is how MySQL joins the tables used. This is probably **the most important** field in the explain output. It can indicate missing indexes and it can also show how the query should be rewritten. The possible values for this field are the following (ordered from the best type to the worst):

*`type`: 表示MySQL连接各表所采用的方式。这可能是explain输出中**最重要的**字段。它既能提示缺失的索引, 也能说明查询是否应该重写。该字段可能的取值如下(从最优到最差排序):

    *   `system`: the table has zero or one row.
    *   `const`: the table has only one matching row which is indexed. The is the fastest type of join.
    *   `eq_ref`: all parts of the index are being used by the join and the index is either PRIMARY_KEY or UNIQUE NOT NULL.
    *   `ref`: all the matching rows of an index column are read for each combination of rows from the previous table. This type of join normally appears for indexed columns compared with `=` or `&lt;=&gt;` operators.
    *   `fulltext`: the join uses the table FULLTEXT index.
    *   `ref_or_null`: this is the same as ref but also contains rows with a NULL value from the column.
    *   `index_merge`: the join uses a list of indexes to produce the result set. The KEY column of the `explain` will contain the keys used.
    *   `unique_subquery`: an IN subquery returns only one result from the table and makes use of the primary key.
    *   `range`: an index is used to find matching rows in a specific range.
    *   `index`: the entire index tree is scanned to find matching rows.
    *   `all`: the entire table is scanned to find matching rows for the join. This is the worst type of join and often indicates the lack of appropriate indexes on the table.
*   `possible_keys`: shows the keys that can be used by MySQL to find rows from the table. These keys may or may not be used in practice.

*`system`: 表中只有零行或一行记录。
*`const`: 表中只有一行匹配的记录, 且已建立索引。这是最快的连接类型。
*`eq_ref`: 连接用到了索引的全部部分, 且索引为PRIMARY_KEY或UNIQUE NOT NULL。
*`ref`: 对于前一张表中每一行的记录组合, 都会读取索引列中所有匹配的行。这种连接类型通常出现在索引列与`=`或`&lt;=&gt;`操作符进行比较的情况下。
*`fulltext`: 连接使用表的FULLTEXT全文索引。
*`ref_or_null`: 与ref类似, 但还包含该列取NULL值的行。
*`index_merge`: 连接使用一组索引来生成结果集。`explain`的KEY列将包含所用到的索引。
*`unique_subquery`: IN子查询只从表中返回一个结果, 并且利用了主键。
*`range`: 使用索引在特定范围内查找匹配的行。
*`index`: 扫描整个索引树来查找匹配的行。
*`all`: 扫描整个表来查找连接所需的匹配行。这是最糟糕的连接类型, 通常表明表上缺少合适的索引。
*`possible_keys`: 显示MySQL可以用来从表中查找记录的索引。这些索引在实际执行中可能用到, 也可能没用到。

*   `keys`: indicates the actual index used by MySQL. MySQL always looks for an optimal key that can be used for the query. While joining many tables, it may figure out some other keys which are not listed in `possible_keys` but are more optimal.

*`keys`: 表示MySQL实际使用的索引。MySQL总是寻找可用于查询的最优索引。在连接多个表时, 可能会找出某些没有列在`possible_keys`中、却更优的索引。

*   `key_len`: indicates the length of the index the query optimizer chose to use.

*`key_len`: 表示查询优化器选择使用的索引长度。

*   `ref`: Shows the columns or constants that are compared to the index named in the key column.

*`ref`: 显示与key列中所命名索引进行比较的列或常量。

*   `rows`: lists the number of records that were examined to produce the output. This is a very important indicator; the fewer records examined, the better.

*`rows`: 列出为了产生结果而检查过的记录数量。这是一个非常重要的指标: 检查的记录越少越好。

*   `Extra`: contains additional information. Values such as `Using filesort` or `Using temporary` in this column may indicate a troublesome query.

*`Extra`: 包含附加信息。该列中出现`Using filesort`或`Using temporary`之类的值, 可能表明查询有问题。

The full documentation on the `explain` output format may be found [on the official MySQL page](https://dev.mysql.com/doc/refman/5.5/en/explain-output.html).

`explain`输出格式的完整文档可以在[MySQL官方页面上](https://dev.mysql.com/doc/refman/5.5/en/explain-output.html)找到。

Going back to our simple query: it is a `SIMPLE` type of select with a const type of join. This is the best case of query we can possibly have. But what happens when we need bigger and more complex queries?

回到我们的简单查询: 这是一个`SIMPLE`类型的SELECT, 连接类型为const。这是我们所能遇到的最好情况。但当我们需要更大、更复杂的查询时, 又会怎样呢?

Going back to our application schema, we might want to obtain all gallery images. We also might want to have only photos that contain the word “cat” in the description. This is definitely a case that we could find on the project requirements. Let’s take a look at the query:

回到我们的应用场景, 我们可能想获取某个画廊的所有图片, 也可能只想获取描述中包含"猫"这个单词的照片。这绝对是项目需求中可能出现的场景。来看这个查询:

```
SELECT gal.name, gal.description, img.filename, img.description FROM `homestead`.`users` AS users
LEFT JOIN `homestead`.`galleries` AS gal ON users.id = gal.user_id
LEFT JOIN `homestead`.`images` AS img on img.gallery_id = gal.id
WHERE img.description LIKE '%dog%';

```



In this more complex case we should have some more information to analyze on our `explain`:

在这个更复杂的例子中, `explain`会给出更多信息供我们分析:

```
EXPLAIN SELECT gal.name, gal.description, img.filename, img.description FROM `homestead`.`users` AS users
LEFT JOIN `homestead`.`galleries` AS gal ON users.id = gal.user_id
LEFT JOIN `homestead`.`images` AS img on img.gallery_id = gal.id
WHERE img.description LIKE '%dog%';

```



This gives the following results (scroll right to see all cells):

这给出了以下结果(向右滚动可查看所有单元格):

<table><thead><tr><th>id</th>
<th>select_type</th>
<th>table</th>
<th>partitions</th>
<th>type</th>
<th>possible_keys</th>
<th>key</th>
<th>key_len</th>
<th>ref</th>
<th>rows</th>
<th>filtered</th>
<th>Extra</th>
</tr></thead><tbody><tr><td>1</td>
<td>SIMPLE</td>
<td>‘users’</td>
<td>NULL</td>
<td>‘index’</td>
<td>‘PRIMARY,UNIQ_1483A5E9BF396750’</td>
<td>‘UNIQ_1483A5E9BF396750’</td>
<td>‘108’</td>
<td>NULL</td>
<td>100.00</td>
<td>‘Using index’</td>
<td></td>
</tr><tr><td>1</td>
<td>SIMPLE</td>
<td>‘gal’</td>
<td>NULL</td>
<td>‘ref’</td>
<td>‘PRIMARY,UNIQ_F70E6EB7BF396750,IDX_F70E6EB7A76ED395’</td>
<td>‘UNIQ_1483A5E9BF396750’</td>
<td>‘108’</td>
<td>‘homestead.users.id’</td>
<td>100.00</td>
<td>NULL</td>
<td></td>
</tr><tr><td>1</td>
<td>SIMPLE</td>
<td>‘img’</td>
<td>NULL</td>
<td>‘ref’</td>
<td>‘IDX_E01FBE6A4E7AF8F’</td>
<td>‘IDX_E01FBE6A4E7AF8F’</td>
<td>‘109’</td>
<td>‘homestead.gal.id’</td>
<td>‘25.00’</td>
<td>‘Using where’</td>
<td></td>
</tr></tbody></table>



Let’s take a closer look and see what we can improve in our query.

让我们仔细看看这个查询有哪些可以改进的地方。

As we saw earlier, the main columns we should look at first are the `type` column and the `rows` columns. The goal should get a better value in the `type` column and reduce as much as we can on the `rows` column.

正如我们之前看到的, 最应该优先关注的是`type`列和`rows`列。目标是在`type`列上取得更好的值, 同时尽可能减少`rows`列的数值。

Our result on the first query is `index`, which is not a good result at all. This means we can probably improve it.

我们的第一个查询结果是`index`, 这并不是一个好的结果。这意味着我们很可能可以改进它。

Looking at our query, there are two ways of approaching it. First, the `Users` table is not being used. We either expand the query to make sure we’re targeting users, or we should completely remove the `users` part of the query. It is only adding complexity and time to our overall performance.

分析我们的查询, 有两种改进思路。首先, `Users`表根本没被用到。我们要么扩展查询, 使其真正以用户为目标; 要么把`users`这部分从查询中完全移除。它只是徒增复杂度, 拖累整体性能。

```
SELECT gal.name, gal.description, img.filename, img.description FROM `homestead`.`galleries` AS gal
LEFT JOIN `homestead`.`images` AS img on img.gallery_id = gal.id
WHERE img.description LIKE '%dog%';

```



So now we have the exact same result. Let’s take a look at `explain`:

现在我们得到了完全相同的结果。来看看`explain`:

<table><thead><tr><th>id</th>
<th>select_type</th>
<th>table</th>
<th>partitions</th>
<th>type</th>
<th>possible_keys</th>
<th>key</th>
<th>key_len</th>
<th>ref</th>
<th>rows</th>
<th>filtered</th>
<th>Extra</th>
</tr></thead><tbody><tr><td>1</td>
<td>SIMPLE</td>
<td>‘gal’</td>
<td>NULL</td>
<td>‘ALL’</td>
<td>‘PRIMARY,UNIQ_1483A5E9BF396750’</td>
<td>NULL</td>
<td>NULL</td>
<td>NULL</td>
<td>100.00</td>
<td>NULL</td>
<td></td>
</tr><tr><td>1</td>
<td>SIMPLE</td>
<td>‘img’</td>
<td>NULL</td>
<td>‘ref’</td>
<td>‘IDX_E01FBE6A4E7AF8F’</td>
<td>‘IDX_E01FBE6A4E7AF8F’</td>
<td>‘109’</td>
<td>‘homestead.gal.id’</td>
<td>‘25.00’</td>
<td>‘Using where’</td>
<td></td>
</tr></tbody></table>



We are left with an `ALL` on type. While `ALL` might be the worst type of join possible, there are also times where it’s the only option. According to our requirements, we want all gallery images, so we need to scour through the whole galleries table. While indexes are really good when trying to find particular information on a table, they can’t help us when we need all the information in it. When we have a case like this, we have to resort to a different method, like caching.

type列上我们只剩下了`ALL`。虽然`ALL`可能是最糟糕的连接类型, 但有时它也是唯一的选择。按照我们的需求, 我们要获取画廊的所有图片, 所以必须检索整个galleries表。索引在查找表中特定信息时非常有用, 但当我们需要表中的全部信息时就帮不上忙了。遇到这种情况, 就得换用别的方法, 比如缓存。

One last improvement we can make, since we’re dealing with a `LIKE`, is to add a FULLTEXT index to our description field. This way, we could change the `LIKE` to a `match()` and improve performance. More on full-text indexes [can be found here](https://dev.mysql.com/doc/refman/5.6/en/innodb-fulltext-index.html).

最后一个可以做的改进: 因为我们用到了`LIKE`, 可以给description字段添加FULLTEXT全文索引。这样就能把`LIKE`改写为`match()`, 从而提升性能。关于全文索引的更多内容, [可以在这里找到](https://dev.mysql.com/doc/refman/5.6/en/innodb-fulltext-index.html)。

There are also two very interesting cases we must look at: the `newest` and `related` functionality in our application. These apply to galleries and touch on some corner cases that we should be aware of:

还有两个非常值得关注的例子: 应用中的`newest`和`related`功能。它们都作用于galleries表, 并涉及一些需要留意的边界情况:

```
EXPLAIN SELECT * FROM `homestead`.`galleries` AS gal
LEFT JOIN `homestead`.`users` AS u ON u.id = gal.user_id
WHERE u.id = 1
ORDER BY gal.created_at DESC
LIMIT 5;

```



The above is for the related galleries.

以上是相关的画廊。

```
EXPLAIN SELECT * FROM `homestead`.`galleries` AS gal
ORDER BY gal.created_at DESC
LIMIT 5;

```



The above is for the newest galleries.

以上是最新的画廊。

At first sight, these queries should be blazing fast because they’re using `LIMIT`. And that is the case on most queries using `LIMIT`. Unfortunately for us and our application, these queries are also using `ORDER BY`. Because we need to order all the results before limiting the query, we lose the advantages of using `LIMIT`.

乍看之下, 这些查询因为使用了`LIMIT`, 应该会非常快。大多数使用`LIMIT`的查询也确实如此。但对我们的应用来说很不巧, 这些查询还用到了`ORDER BY`。因为必须先对所有结果排序、然后再执行限制, 所以`LIMIT`的优势就没了。

Since we know `ORDER BY` might be tricky, let’s apply our trusty `explain`.

既然知道`ORDER BY`可能暗藏玄机, 就让我们用上得力的`explain`。

<table><thead><tr><th>id</th>
<th>select_type</th>
<th>table</th>
<th>partitions</th>
<th>type</th>
<th>possible_keys</th>
<th>key</th>
<th>key_len</th>
<th>ref</th>
<th>rows</th>
<th>filtered</th>
<th>Extra</th>
</tr></thead><tbody><tr><td>1</td>
<td>SIMPLE</td>
<td>‘gal’</td>
<td>NULL</td>
<td>‘ALL’</td>
<td>‘IDX_F70E6EB7A76ED395’</td>
<td>NULL</td>
<td>NULL</td>
<td>NULL</td>
<td>100.00</td>
<td>‘Using where; Using filesort’</td>
<td></td>
</tr><tr><td>1</td>
<td>SIMPLE</td>
<td>‘u’</td>
<td>NULL</td>
<td>‘eq_ref’</td>
<td>‘PRIMARY,UNIQ_1483A5E9BF396750’</td>
<td>‘PRIMARY</td>
<td>‘108’</td>
<td>‘homestead.gal.id’</td>
<td>‘100.00’</td>
<td>NULL</td>
<td></td>
</tr></tbody></table>



And,

而且,

<table><thead><tr><th>id</th>
<th>select_type</th>
<th>table</th>
<th>partitions</th>
<th>type</th>
<th>possible_keys</th>
<th>key</th>
<th>key_len</th>
<th>ref</th>
<th>rows</th>
<th>filtered</th>
<th>Extra</th>
</tr></thead><tbody><tr><td>1</td>
<td>SIMPLE</td>
<td>‘gal’</td>
<td>NULL</td>
<td>‘ALL’</td>
<td>NULL</td>
<td>NULL</td>
<td>NULL</td>
<td>NULL</td>
<td>100.00</td>
<td>‘Using filesort’</td>
<td></td>
</tr></tbody></table>



As we can see, we have the worst case of join type: `ALL` for both of our queries.

我们可以看到, 两个查询的连接类型都是最糟糕的情况:`ALL`。

Historically, MySQL’s `ORDER BY` implementation, especially together with `LIMIT`, is often the cause for MySQL performance problems. This combination is also used in most interactive applications with large datasets. Functionalities like newly registered users and top tags normally use this combination.

从历史上看, MySQL的`ORDER BY`实现, 尤其是与`LIMIT`一起使用时, 往往是MySQL性能问题的根源。这种组合也广泛用于带有大数据集的大多数交互式应用中, 例如新注册用户、热门标签之类的功能通常都会用到它。

Because this is a common problem, there’s also a small list of common solutions we should apply to take care of performance issues.

因为这是一个常见问题, 所以也有一份常见解决方案的小清单, 可以用来应对性能问题。

*   **Make sure we’re using indexes**. In our case, `created_at` is a great candidate, since it’s the field we’re ordering by. This way, we have both `ORDER BY` and `LIMIT` executed without scanning and sorting the full result set.
*   **Sort by a column in the leading table**. Normally, if the `ORDER BY` is going by field from the table which is not the first in the join order, then the index can’t be used.
*   **Don’t sort by expressions**. Expressions and functions don’t allow index usage by `ORDER BY`.
*   **Beware of a large `LIMIT` value**. Large `LIMIT` values will force `ORDER BY` to sort a bigger number of rows. This affects performance.

*   **确保我们使用了索引**。在我们的例子中, `created_at`是很好的候选, 因为我们正是按它排序的。这样, `ORDER BY`和`LIMIT`的执行就无需扫描并排序完整的结果集。
*   **按连接顺序中第一个表的列排序**。通常情况下, 如果`ORDER BY`所按的字段并非连接顺序中第一个表的字段, 那么索引就无法使用。
*   **不要按表达式排序**。表达式和函数会导致`ORDER BY`无法使用索引。
*   **当心过大的`LIMIT`值**。过大的`LIMIT`值会迫使`ORDER BY`对更多行进行排序。这会影响性能。

These are some of the measures we should take when we have both `LIMIT` and `ORDER BY` in order to minimize performance issues.

以上就是在同时使用`LIMIT`和`ORDER BY`时, 为尽量减少性能问题而应当采取的一些措施。

## Conclusion

## 结论

As we can see, `explain` can be very useful for spotting problems in our queries early on. There are a lot of problems that we only notice when our applications are in production and have big amounts of data or a lot of visitors hitting the database. If these things can be spotted early on using `explain`, there’s much less room for performance problems in the future.

我们可以看到, `explain`对于及早发现查询中的问题非常有用。很多问题只有当应用上线、数据量变大、或者访问数据库的流量很大时才会被注意到。如果能在早期通过`explain`发现这些问题, 未来的性能问题空间就会小得多。

Our application has all the indexes it needs, and it’s pretty fast, but we now know we can always resort to `explain` and indexes whenever we need to check for performance boosts.

我们的应用程序已经有了所需的全部索引, 运行也相当快, 但我们现在知道, 今后需要排查性能提升点时, 随时可以借助`explain`和索引。

<https://www.sitepoint.com/mysql-performance-indexes-explain/>
