# MySQL Performance Boosting with Indexes and Explain

# MySQL索引和解释的性能提高

**Techniques to improve application performance can come from a lot of different places, but normally the first thing we look at — the most common bottleneck — is the database. Can it be improved? How can we measure and understand what needs and can be improved?**

* *技术来提高应用程序的性能可以来自很多不同的地方,但通常我们看的第一件事是数据库——最常见的瓶颈.它可以改善吗?我们如何衡量和理解需求和可以提高什么? * *

One very simple yet very useful tool is query profiling. Enabling profiling is a simple way to get a more accurate time estimate of running a query. This is a two-step process. First, we have to enable profiling. Then, we call `show profiles` to actually get the query running time.

一个非常简单但非常有用的工具是查询分析。分析是一个简单的方式来运行一个查询的更精确的时间估计。这是一个两步的过程.首先,我们要使分析。然后,我们调用`show profiles`得到查询运行时间。

Let’s imagine we have the following insert in our database (and let’s assume User 1 and Gallery 1 are already created):

假设我们有以下插入我们的数据库(假设用户1和画廊已经创建的):

```
INSERT INTO `homestead`.`images` (`id`, `gallery_id`, `original_filename`, `filename`, `description`) VALUES
(1, 1, 'me.jpg', 'me.jpg', 'A photo of me walking down the street'),
(2, 1, 'dog.jpg', 'dog.jpg', 'A photo of my dog on the street'),
(3, 1, 'cat.jpg', 'cat.jpg', 'A photo of my cat walking down the street'),
(4, 1, 'purr.jpg', 'purr.jpg', 'A photo of my cat purring');    

```


Obviously, this amount of data will not cause any trouble, but let’s use it to do a simple profile. Let’s consider the following query:

显然,这的数据量并不会造成任何麻烦,但我们用它来做一个简单的概要文件。让我们考虑以下查询:

```
SELECT * FROM `homestead`.`images` AS i
WHERE i.description LIKE '%street%';

```



This query is a good example of one that can become problematic in the future if we get a lot of photo entries.

这个查询是一个很好的例子,一个能够在未来成为问题如果我们得到很多照片条目。

To get an accurate running time on this query, we would use the following SQL:

得到一个准确的运行时间在这个查询,我们将使用以下SQL:

```
set profiling = 1;
SELECT * FROM `homestead`.`images` AS i
WHERE i.description LIKE '%street%';
show profiles;

```



The result would look like the following:

结果看起来像下面的:

<table><thead><tr><th>Query_Id</th>
<th>Duration</th>
<th>Query</th>
</tr></thead><tbody><tr><td>1</td>
<td>0.00016950</td>
<td>SHOW WARNINGS</td>
</tr><tr><td>2</td>
<td>0.00039200</td>
<td>SELECT * FROM `homestead`.`images` AS i \nWHERE i.description LIKE \’%street%\’\nLIMIT 0, 1000</td>
</tr><tr><td>3</td>
<td>0.00037600</td>
<td>SHOW KEYS FROM `homestead`.`images`</td>
</tr><tr><td>4</td>
<td>0.00034625</td>
<td>SHOW DATABASES LIKE \’homestead\</td>
</tr><tr><td>5</td>
<td>0.00027600</td>
<td>SHOW TABLES FROM `homestead` LIKE \’images\’</td>
</tr><tr><td>6</td>
<td>0.00024950</td>
<td>SELECT * FROM `homestead`.`images` WHERE 0=1</td>
</tr><tr><td>7</td>
<td>0.00104300</td>
<td>SHOW FULL COLUMNS FROM `homestead`.`images` LIKE \’id\’</td>
</tr></tbody></table>



As we can see, the `show profiles;` command gives us times not only for the original query but also for all the other queries that are made. This way we can accurately profile our queries.

我们可以看到,`show profiles;`命令给了我们时间不仅对原始查询,还对其他所有的查询。这样我们可以准确的资料查询。

But how can we actually improve them?

但实际上我们如何改善?

We can either rely on our knowledge of SQL and improvise, or we can rely on the MySQL `explain` command and improve our query performance based on actual information.

我们可以依靠我们的知识的SQL和即兴发挥,或者我们可以依靠MySQL`explain`命令和根据实际信息提高查询性能。

**Explain** is used to obtain a query execution plan, or how MySQL will execute our query. It works with `SELECT`, `DELETE`, `INSERT`, `REPLACE`, and `UPDATE` statements, and it displays information from the optimizer about the statement execution plan. The [official documentation](https://dev.mysql.com/doc/refman/5.7/en/explain.html) does a pretty good job of describing how `explain` can help us:

* * * *是用来解释获得查询执行计划,或MySQL将如何执行我们的查询。它的工作原理与`SELECT`,`DELETE`,`INSERT`,`REPLACE`,`UPDATE`语句,它显示的信息优化器关于语句的执行计划。(官方文档)(https://dev.mysql.com/doc/refman/5.7/en/explain).html)很好地描述`explain`可以帮助我们:

> With the help of EXPLAIN, you can see where you should add indexes to tables so that the statement executes faster by using indexes to find rows. You can also use EXPLAIN to check whether the optimizer joins the tables in an optimal order.

> 解释的帮助下,你可以看到,你应该添加索引表的语句执行更快找到行通过使用索引.您还可以使用解释检查是否优化器连接的表以最优的秩序。

To exemplify the usage of `explain`, we’ll use the query made by our `UserManager.php` to find a user by email:

举例说明使用`explain`我们将使用的查询`UserManager.php`找到一个用户通过电子邮件:

```
SELECT * FROM `homestead`.`users` WHERE email = 'claudio.ribeiro@examplemail.com';

```



To use the `explain` command, we simply prepend it before select type queries:

使用`explain`命令,我们只是预谋之前选择查询类型:

```
EXPLAIN SELECT * FROM `homestead`.`users` WHERE email = 'claudio.ribeiro@examplemail.com';

```



This is the result (scroll right to see all):

这是结果(滚动看到所有的权利):

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

这些结果并不容易理解一见钟情,让我们仔细看看每一个人:

*   `id`: this is just the sequential identifier for each of the queries within the SELECT.

*`id`:这只是序列标识符为每个查询中选择。

*   `select_type`: the type of SELECT query. This field can take a number of different values, so we will focus on the most important ones:

*`select_type`:选择查询的类型。这个领域可以采取许多不同的值,所以我们将专注于最重要的:


    *   `SIMPLE`: a simple query without subqueries or unions
    *   `PRIMARY`: the select is in the outermost query in a join
    *   `DERIVED`: the select is a part of a subquery within a from
    *   `SUBQUERY`: the first select in a subquery
    *   `UNION`: the select is the second or later statement of a union.

*`SIMPLE`:一个简单的查询没有子查询或工会
*`PRIMARY`在最外层查询:选择加入
*`DERIVED`:选择是在从子查询的一部分
*`SUBQUERY`子查询:第一选择
*`UNION`:选择第二个语句的一个联盟。


    The full list of values that can appear in a `select_type` field can be found [here](https://dev.mysql.com/doc/refman/5.5/en/explain-output.html#explain_select_type).

维多利亚list of价值,或in a`select_type`土地退化问题融资信息搜索引擎年度出版物](https://dev.mysql.com/doc/refman/5.5/en/explain-output.html #[explain_select_type)。

*   `table`: the table referred to by the row.

*`table`:表引用行。

*   `type`: this field is how MySQL joins the tables used. This is probably **the most important** field in the explain output. It can indicate missing indexes and it can also show how the query should be rewritten. The possible values for this field are the following (ordered from the best type to the worst):

*`type`:这个字段是MySQL连接所使用的表。这可能是最重要的* * * *字段解释输出.它可以显示缺失索引也可以显示查询应该重写。这个领域的可能值以下(命令从最好到最差的):

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

*`system`:表为零或一行。
*`const`:表只有一个匹配的行索引。加入的是最快的类型。
*`eq_ref`:索引的所有部分正在使用的连接和索引PRIMARY_KEY或独特的NOT NULL。
*`ref`:所有索引列的匹配行读取每个组合从以前的表的行。这种类型的连接通常看起来与索引的列`=`或`&lt;=&gt;`操作符。
*`fulltext`:加入使用全文索引表。
*`ref_or_null`:这是一样的裁判也包含行和空值的列。
*`index_merge`:连接使用索引的列表生成结果集的键列`explain`将包含所使用的密钥。
*`unique_subquery`在子查询只返回一个结果:一个主键的表和利用。
*`range`:索引是用来在一个特定的范围内找到匹配的行。
*`index`:整个索引树扫描查找匹配的行。
*`all`:扫描整个表来查找匹配的行连接。这是最糟糕的一种加入,常常表示缺乏适当的表上的索引。
*`possible_keys`:显示了可以使用MySQL的钥匙从表中找到的行。这些键可能是也可能不是在实践中使用。

*   `keys`: indicates the actual index used by MySQL. MySQL always looks for an optimal key that can be used for the query. While joining many tables, it may figure out some other keys which are not listed in `possible_keys` but are more optimal.

*`keys`:表示实际索引使用的MySQL。MySQL总是寻找一个最优的关键,可用于查询。虽然加入许多表,可以算出其他键不列入`possible_keys`但更优。

*   `key_len`: indicates the length of the index the query optimizer chose to use.

*`key_len`:表示的长度指数查询优化器选择使用。

*   `ref`: Shows the columns or constants that are compared to the index named in the key column.

*`ref`:显示的列或常数相比索引键列命名。

*   `rows`: lists the number of records that were examined to produce the output. This is a very important indicator; the fewer records examined, the better.

*`rows`:列出的记录数检查产生的输出。这是一个非常重要的指标;记录检查,越少越好。

*   `Extra`: contains additional information. Values such as `Using filesort` or `Using temporary` in this column may indicate a troublesome query.

*`Extra`:包含额外的信息。值如`Using filesort`或`Using temporary`在本专栏中可能表明麻烦查询。

The full documentation on the `explain` output format may be found [on the official MySQL page](https://dev.mysql.com/doc/refman/5.5/en/explain-output.html).

完整的文档上`explain`输出格式可能会发现(MySQL的官方页面上)(https://dev.mysql.com/doc/refman/5.5/en/explain-output.html)。

Going back to our simple query: it is a `SIMPLE` type of select with a const type of join. This is the best case of query we can possibly have. But what happens when we need bigger and more complex queries?

回到我们的简单查询:这是一个`SIMPLE`类型的选择与一个const类型的加入。这是最好的情况下的查询我们可以。但当我们需要更大、更复杂的查询吗?

Going back to our application schema, we might want to obtain all gallery images. We also might want to have only photos that contain the word “cat” in the description. This is definitely a case that we could find on the project requirements. Let’s take a look at the query:

回到我们的应用程序模式,我们想获得所有画廊图片。我们也想只有照片包含单词“猫”的描述.这绝对是一个案例,我们可以发现在项目需求。让我们看看查询:

```
SELECT gal.name, gal.description, img.filename, img.description FROM `homestead`.`users` AS users
LEFT JOIN `homestead`.`galleries` AS gal ON users.id = gal.user_id
LEFT JOIN `homestead`.`images` AS img on img.gallery_id = gal.id
WHERE img.description LIKE '%dog%';

```



In this more complex case we should have some more information to analyze on our `explain`:

在更复杂的情况下,我们应该有一些分析在我们的更多信息`explain`:

```
EXPLAIN SELECT gal.name, gal.description, img.filename, img.description FROM `homestead`.`users` AS users
LEFT JOIN `homestead`.`galleries` AS gal ON users.id = gal.user_id
LEFT JOIN `homestead`.`images` AS img on img.gallery_id = gal.id
WHERE img.description LIKE '%dog%';

```



This gives the following results (scroll right to see all cells):

这给了以下结果(滚动看到所有细胞):

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

让我们仔细看看我们可以改善我们的查询。

As we saw earlier, the main columns we should look at first are the `type` column and the `rows` columns. The goal should get a better value in the `type` column and reduce as much as we can on the `rows` column.

正如我们之前看到的,我们应该先看看主要列`type`列和`rows`列。目标应该得到更好的价值`type`列和减少尽可能多的`rows`列。

Our result on the first query is `index`, which is not a good result at all. This means we can probably improve it.

我们的第一个查询结果`index`,这不是一个好的结果。这意味着我们可以改进它。

Looking at our query, there are two ways of approaching it. First, the `Users` table is not being used. We either expand the query to make sure we’re targeting users, or we should completely remove the `users` part of the query. It is only adding complexity and time to our overall performance.

看着我们的查询,有两种方式接近它。首先,`Users`表没有被使用。我们要么扩大查询,以确保我们的目标用户,或者我们应该完全移除`users`查询的一部分。只有增加复杂性和时间对我们的整体性能。

```
SELECT gal.name, gal.description, img.filename, img.description FROM `homestead`.`galleries` AS gal
LEFT JOIN `homestead`.`images` AS img on img.gallery_id = gal.id
WHERE img.description LIKE '%dog%';

```



So now we have the exact same result. Let’s take a look at `explain`:

现在我们有相同的结果。让我们看一看`explain`:

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

我们只剩下一个`ALL`在类型。而`ALL`可能最严重类型的加入,也有时代的唯一的选择.根据我们的需求,我们希望所有画廊图片,所以我们需要搜索整个表画廊.而索引是很好的桌子上试图寻找特定信息时,他们不能帮助我们当我们需要的所有信息.当我们有一个这样的情况,我们要采取不同的方法,比如缓存。

One last improvement we can make, since we’re dealing with a `LIKE`, is to add a FULLTEXT index to our description field. This way, we could change the `LIKE` to a `match()` and improve performance. More on full-text indexes [can be found here](https://dev.mysql.com/doc/refman/5.6/en/innodb-fulltext-index.html).

最后一次改进我们可以,因为我们处理`LIKE`,是添加一个全文索引描述字段。这种方式,我们可以改变`LIKE`到一个`match()`和提高性能。在全文索引(可以在这里找到)(https://dev.mysql.com/doc/refman/5.6/en/innodb-fulltext-index.html)。

There are also two very interesting cases we must look at: the `newest` and `related` functionality in our application. These apply to galleries and touch on some corner cases that we should be aware of:

还有两个很有趣的情况下,我们必须看看:`newest`和`related`在我们的应用程序的功能。这些适用于某个角落画廊和接触情况下,我们应该意识到:

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

这些queries电子first At they’re也各不相同,应当利用blazing fast`LIMIT`。‘is the case据most queries using`LIMIT`。对我们来说不幸的是,我们的应用程序中,这些查询也使用`ORDER BY`。因为我们需要订购所有的结果在限制查询之前,我们失去了使用的优点`LIMIT`。

Since we know `ORDER BY` might be tricky, let’s apply our trusty `explain`.

因为我们知道`ORDER BY`可能很棘手,我们应用可靠的`explain`。

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

我们可以看到,我们有最坏的情况下的连接类型:`ALL`为我们的查询。

Historically, MySQL’s `ORDER BY` implementation, especially together with `LIMIT`, is often the cause for MySQL performance problems. This combination is also used in most interactive applications with large datasets. Functionalities like newly registered users and top tags normally use this combination.

从历史上看,MySQL的`ORDER BY`实现,尤其是在一起`LIMIT`,往往是MySQL性能问题的原因。这种组合也与大型数据集在大多数交互式应用程序中使用.功能新注册用户和高级标签通常使用这个组合。

Because this is a common problem, there’s also a small list of common solutions we should apply to take care of performance issues.

因为这是一个常见的问题,还有一个小列表常见解决方案我们应该适用于照顾性能问题。

*   **Make sure we’re using indexes**. In our case, `created_at` is a great candidate, since it’s the field we’re ordering by. This way, we have both `ORDER BY` and `LIMIT` executed without scanning and sorting the full result set.
*   **Sort by a column in the leading table**. Normally, if the `ORDER BY` is going by field from the table which is not the first in the join order, then the index can’t be used.
*   **Don’t sort by expressions**. Expressions and functions don’t allow index usage by `ORDER BY`.
*   **Beware of a large `LIMIT` value**. Large `LIMIT` values will force `ORDER BY` to sort a bigger number of rows. This affects performance.

* * * * *确保我们使用的索引。在我们的例子中,`created_at`是一个很好的候选人,因为它是我们订购。这样,我们都有`ORDER BY`和`LIMIT`没有执行扫描和排序结果集。
* * *主要表中按列排序* *。通常情况下,如果`ORDER BY`是由从表中字段不是第一个连接顺序,然后索引不能被使用。
* * * * *不排序表达式。不允许使用索引表达式和函数`ORDER BY`。
* * *小心的`LIMIT`价值* *。广泛的`LIMIT`值将迫使`ORDER BY`更大的行数进行排序。这会影响性能。

These are some of the measures we should take when we have both `LIMIT` and `ORDER BY` in order to minimize performance issues.

而且,我们应该谨慎措施以为我们both`LIMIT`和`ORDER BY`为了减少性能问题。

## Conclusion

## 结论

As we can see, `explain` can be very useful for spotting problems in our queries early on. There are a lot of problems that we only notice when our applications are in production and have big amounts of data or a lot of visitors hitting the database. If these things can be spotted early on using `explain`, there’s much less room for performance problems in the future.

我们可以看到,`explain`可以是非常有用的在我们查询在早期发现问题.有很多问题,我们只注意到当我们的应用程序在生产和大数据量或访问数据库的大量游客.如果这些事情可以发现早期使用`explain`有更少的性能问题在未来的空间。

Our application has all the indexes it needs, and it’s pretty fast, but we now know we can always resort to `explain` and indexes whenever we need to check for performance boosts.

我们的应用程序所需的所有索引,非常快,但我们现在知道我们可以采取`explain`和索引时,我们需要检查性能的提高。

<https://www.sitepoint.com/mysql-performance-indexes-explain/>
