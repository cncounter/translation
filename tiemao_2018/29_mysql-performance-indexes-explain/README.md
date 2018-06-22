# MySQL Performance Boosting with Indexes and Explain

**Techniques to improve application performance can come from a lot of different places, but normally the first thing we look at — the most common bottleneck — is the database. Can it be improved? How can we measure and understand what needs and can be improved?**

One very simple yet very useful tool is query profiling. Enabling profiling is a simple way to get a more accurate time estimate of running a query. This is a two-step process. First, we have to enable profiling. Then, we call `show profiles` to actually get the query running time.

Let’s imagine we have the following insert in our database (and let’s assume User 1 and Gallery 1 are already created):

```
`INSERT INTO `homestead`.`images` (`id`, `gallery_id`, `original_filename`, `filename`, `description`) VALUES
(1, 1, 'me.jpg', 'me.jpg', 'A photo of me walking down the street'),
(2, 1, 'dog.jpg', 'dog.jpg', 'A photo of my dog on the street'),
(3, 1, 'cat.jpg', 'cat.jpg', 'A photo of my cat walking down the street'),
(4, 1, 'purr.jpg', 'purr.jpg', 'A photo of my cat purring');    
`
```

<svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 30 30" xml:space="preserve"><g><path d="M23.3,14.9c0-0.4-0.3-0.9-0.8-1.2l-10-6.4c-1.1-0.7-2-0.1-2,1.3v7.5C15.8,13.7,23.1,14.9,23.3,14.9z M23.3,15 c-7.9,0.6-11.4,3.5-12.8,5.7v0.8c0,1.4,0.9,2,2,1.3l10-6.4C23.1,16,23.4,15.5,23.3,15z"></path></g></svg><svg class="circle" width="70" height="70" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="35" r="32"></circle></svg><svg class="circle active" width="70" height="70" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="35" r="32"></circle></svg>

skip

Ads by Hooly

Obviously, this amount of data will not cause any trouble, but let’s use it to do a simple profile. Let’s consider the following query:

```
`SELECT * FROM `homestead`.`images` AS i
WHERE i.description LIKE '%street%';
`
```

This query is a good example of one that can become problematic in the future if we get a lot of photo entries.

To get an accurate running time on this query, we would use the following SQL:

```
`set profiling = 1;
SELECT * FROM `homestead`.`images` AS i
WHERE i.description LIKE '%street%';
show profiles;
`
```

The result would look like the following:

<table><thead><tr><th style="text-align:center;">Query_Id</th>
<th style="text-align:right;">Duration</th>
<th style="text-align:left;">Query</th>
</tr></thead><tbody><tr><td style="text-align:center;">1</td>
<td style="text-align:right;">0.00016950</td>
<td style="text-align:left;">SHOW WARNINGS</td>
</tr><tr><td style="text-align:center;">2</td>
<td style="text-align:right;">0.00039200</td>
<td style="text-align:left;">SELECT * FROM `homestead`.`images` AS i \nWHERE i.description LIKE \’%street%\’\nLIMIT 0, 1000</td>
</tr><tr><td style="text-align:center;">3</td>
<td style="text-align:right;">0.00037600</td>
<td style="text-align:left;">SHOW KEYS FROM `homestead`.`images`</td>
</tr><tr><td style="text-align:center;">4</td>
<td style="text-align:right;">0.00034625</td>
<td style="text-align:left;">SHOW DATABASES LIKE \’homestead\</td>
</tr><tr><td style="text-align:center;">5</td>
<td style="text-align:right;">0.00027600</td>
<td style="text-align:left;">SHOW TABLES FROM `homestead` LIKE \’images\’</td>
</tr><tr><td style="text-align:center;">6</td>
<td style="text-align:right;">0.00024950</td>
<td style="text-align:left;">SELECT * FROM `homestead`.`images` WHERE 0=1</td>
</tr><tr><td style="text-align:center;">7</td>
<td style="text-align:right;">0.00104300</td>
<td style="text-align:left;">SHOW FULL COLUMNS FROM `homestead`.`images` LIKE \’id\’</td>
</tr></tbody></table>

As we can see, the `show profiles;` command gives us times not only for the original query but also for all the other queries that are made. This way we can accurately profile our queries.

But how can we actually improve them?

We can either rely on our knowledge of SQL and improvise, or we can rely on the MySQL `explain` command and improve our query performance based on actual information.

**Explain** is used to obtain a query execution plan, or how MySQL will execute our query. It works with `SELECT`, `DELETE`, `INSERT`, `REPLACE`, and `UPDATE` statements, and it displays information from the optimizer about the statement execution plan. The [official documentation](https://dev.mysql.com/doc/refman/5.7/en/explain.html) does a pretty good job of describing how `explain` can help us:

> With the help of EXPLAIN, you can see where you should add indexes to tables so that the statement executes faster by using indexes to find rows. You can also use EXPLAIN to check whether the optimizer joins the tables in an optimal order.

To exemplify the usage of `explain`, we’ll use the query made by our `UserManager.php` to find a user by email:

```
`SELECT * FROM `homestead`.`users` WHERE email = 'claudio.ribeiro@examplemail.com';
`
```

To use the `explain` command, we simply prepend it before select type queries:

```
`EXPLAIN SELECT * FROM `homestead`.`users` WHERE email = 'claudio.ribeiro@examplemail.com';
`
```

This is the result (scroll right to see all):

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

*   `id`: this is just the sequential identifier for each of the queries within the SELECT.

*   `select_type`: the type of SELECT query. This field can take a number of different values, so we will focus on the most important ones:

    *   `SIMPLE`: a simple query without subqueries or unions
    *   `PRIMARY`: the select is in the outermost query in a join
    *   `DERIVED`: the select is a part of a subquery within a from
    *   `SUBQUERY`: the first select in a subquery
    *   `UNION`: the select is the second or later statement of a union.

    The full list of values that can appear in a `select_type` field can be found [here](https://dev.mysql.com/doc/refman/5.5/en/explain-output.html#explain_select_type).

*   `table`: the table referred to by the row.

*   `type`: this field is how MySQL joins the tables used. This is probably **the most important** field in the explain output. It can indicate missing indexes and it can also show how the query should be rewritten. The possible values for this field are the following (ordered from the best type to the worst):

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

*   `keys`: indicates the actual index used by MySQL. MySQL always looks for an optimal key that can be used for the query. While joining many tables, it may figure out some other keys which are not listed in `possible_keys` but are more optimal.

*   `key_len`: indicates the length of the index the query optimizer chose to use.

*   `ref`: Shows the columns or constants that are compared to the index named in the key column.

*   `rows`: lists the number of records that were examined to produce the output. This is a very important indicator; the fewer records examined, the better.

*   `Extra`: contains additional information. Values such as `Using filesort` or `Using temporary` in this column may indicate a troublesome query.

The full documentation on the `explain` output format may be found [on the official MySQL page](https://dev.mysql.com/doc/refman/5.5/en/explain-output.html).

Going back to our simple query: it is a `SIMPLE` type of select with a const type of join. This is the best case of query we can possibly have. But what happens when we need bigger and more complex queries?

Going back to our application schema, we might want to obtain all gallery images. We also might want to have only photos that contain the word “cat” in the description. This is definitely a case that we could find on the project requirements. Let’s take a look at the query:

```
`SELECT gal.name, gal.description, img.filename, img.description FROM `homestead`.`users` AS users
LEFT JOIN `homestead`.`galleries` AS gal ON users.id = gal.user_id
LEFT JOIN `homestead`.`images` AS img on img.gallery_id = gal.id
WHERE img.description LIKE '%dog%';
`
```

In this more complex case we should have some more information to analyze on our `explain`:

```
`EXPLAIN SELECT gal.name, gal.description, img.filename, img.description FROM `homestead`.`users` AS users
LEFT JOIN `homestead`.`galleries` AS gal ON users.id = gal.user_id
LEFT JOIN `homestead`.`images` AS img on img.gallery_id = gal.id
WHERE img.description LIKE '%dog%';
`
```

This gives the following results (scroll right to see all cells):

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

As we saw earlier, the main columns we should look at first are the `type` column and the `rows` columns. The goal should get a better value in the `type` column and reduce as much as we can on the `rows` column.

Our result on the first query is `index`, which is not a good result at all. This means we can probably improve it.

Looking at our query, there are two ways of approaching it. First, the `Users` table is not being used. We either expand the query to make sure we’re targeting users, or we should completely remove the `users` part of the query. It is only adding complexity and time to our overall performance.

```
`SELECT gal.name, gal.description, img.filename, img.description FROM `homestead`.`galleries` AS gal
LEFT JOIN `homestead`.`images` AS img on img.gallery_id = gal.id
WHERE img.description LIKE '%dog%';
`
```

So now we have the exact same result. Let’s take a look at `explain`:

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

One last improvement we can make, since we’re dealing with a `LIKE`, is to add a FULLTEXT index to our description field. This way, we could change the `LIKE` to a `match()` and improve performance. More on full-text indexes [can be found here](https://dev.mysql.com/doc/refman/5.6/en/innodb-fulltext-index.html).

There are also two very interesting cases we must look at: the `newest` and `related` functionality in our application. These apply to galleries and touch on some corner cases that we should be aware of:

```
`EXPLAIN SELECT * FROM `homestead`.`galleries` AS gal
LEFT JOIN `homestead`.`users` AS u ON u.id = gal.user_id
WHERE u.id = 1
ORDER BY gal.created_at DESC
LIMIT 5;
`
```

The above is for the related galleries.

```
`EXPLAIN SELECT * FROM `homestead`.`galleries` AS gal
ORDER BY gal.created_at DESC
LIMIT 5;
`
```

The above is for the newest galleries.

At first sight, these queries should be blazing fast because they’re using `LIMIT`. And that is the case on most queries using `LIMIT`. Unfortunately for us and our application, these queries are also using `ORDER BY`. Because we need to order all the results before limiting the query, we lose the advantages of using `LIMIT`.

Since we know `ORDER BY` might be tricky, let’s apply our trusty `explain`.

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

Historically, MySQL’s `ORDER BY` implementation, especially together with `LIMIT`, is often the cause for MySQL performance problems. This combination is also used in most interactive applications with large datasets. Functionalities like newly registered users and top tags normally use this combination.

Because this is a common problem, there’s also a small list of common solutions we should apply to take care of performance issues.

*   **Make sure we’re using indexes**. In our case, `created_at` is a great candidate, since it’s the field we’re ordering by. This way, we have both `ORDER BY` and `LIMIT` executed without scanning and sorting the full result set.
*   **Sort by a column in the leading table**. Normally, if the `ORDER BY` is going by field from the table which is not the first in the join order, then the index can’t be used.
*   **Don’t sort by expressions**. Expressions and functions don’t allow index usage by `ORDER BY`.
*   **Beware of a large `LIMIT` value**. Large `LIMIT` values will force `ORDER BY` to sort a bigger number of rows. This affects performance.

These are some of the measures we should take when we have both `LIMIT` and `ORDER BY` in order to minimize performance issues.

## Conclusion

As we can see, `explain` can be very useful for spotting problems in our queries early on. There are a lot of problems that we only notice when our applications are in production and have big amounts of data or a lot of visitors hitting the database. If these things can be spotted early on using `explain`, there’s much less room for performance problems in the future.

Our application has all the indexes it needs, and it’s pretty fast, but we now know we can always resort to `explain` and indexes whenever we need to check for performance boosts.

<https://www.sitepoint.com/mysql-performance-indexes-explain/>
