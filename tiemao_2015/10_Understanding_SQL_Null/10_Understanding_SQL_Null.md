# 深入详解SQL中的Null

> NULL 在计算机和编程世界中表示的是未知,不确定。虽然中文翻译为 “空”, 但此空(null)非彼空(empty)。 Null表示的是一种未知状态，未来状态,比如小明兜里有多少钱我不清楚，但也不能肯定为0，这时在计算机中就使用Null来表示未知和不确定。

虽然熟练掌握SQL的人对于Null不会有什么疑问，但总结得很全的文章还是很难找，看到一篇英文版的, 感觉还不错。


[Tony Hoare 在1965年发明了 null 引用](http://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions), 并认为这是他犯下的“几十亿美元的错误”. 即便是50年后的今天, SQL中的 null 值还是导致许多常见错误的罪魁祸首.

我们一起来看那些最令人震惊的情况。

### Null不支持大小/相等判断


下面的2个查询,不管表 `users` 中有多少条记录，返回的记录都是0行:

>`select * from users where deleted_at = null;`
>
>-- result: 0 rows
>
>`select * from users where deleted_at != null;`
>
>-- result: 0 rows


怎么会这样子? 一切只因为 `null` 是表示一种“未知”的类型。也就是说，用常规的比较操作符(normal conditional operators)来将 `null` 与其他值比较是没有意义的。 `Null` 也不等于 `Null`(近似理解: 未知的值不能等于未知的值，两者间的关系也是未知，否则数学和逻辑上就乱套了)。

>>-- **注意**: 下面的SQL适合于MySQL,如果是Oracle，你需要加上 ... from dual; 
>
>`select null > 0;`
>
>-- result: null
>
>`select null < 0;`
>
>-- result: null
>
>`select null = 0;`
>
>-- result: null
>
>`select null = null;`
>
>-- result: null
>
>`select null != null;`
>
>-- result: null

将某个值与 `null` 进行比较的正确方法是使用 `is` 关键字, 以及 `is not` 操作符:


	select * from users
	where deleted_at is null;

>-- result: 所有未被删除的 users

	select * from users
	where deleted_at is not null;

>-- result: 所有被标记为删除的 users

如果想要判断两列的值是否不相同，则可以使用 `is distinct from`:

	select * from users
	where has_address is distinct from has_photo

>-- result: 地址(address)或照片(photo)两者只有其一的用户

### not in 与 Null

子查询(subselect)是一种很方便的过滤数据的方法。例如,如果想要查询没有任何包的用户,可以编写下面这样一个查询:


	select * from users 
	where id not in (select user_id from packages)

但此时假若 `packages` 表中某一行的 `user_id` 是 `null` 的话，问题就来了: 返回结果是空的! 要理解为什么会发生这种古怪的事情, 我们需要理解SQL编译器究竟干了些什么. 下面是一个更简单的示例:

	select * from users 
	where id not in (1, 2, null)

这个SQL语句会被转换为:

	select * from users 
	where id != 1 and id != 2 and id != null

我们知道，`id != null` 结果是个未知值, `null`. 而任意值和 `null` 进行 `and` 运算的结果都是 `null`, 所以相当于没有其他条件. 那么出这种结果的原因就是 `null` 的逻辑值不为 `true`.

如果条件调换过来, 查询结果就没有问题。 现在我们查询有package的用户.

	select * from users 
	where id in (select user_id from packages)

同样我们可以使用简单的例子:

	select * from users 
	where id in (1, 2, null)

这条SQL被转换为:

	select * from users 
	where id = 1 or id = 2 or id = null

因为 `where` 子句中是一串的 `or` 条件，所以其中某个的结果为 `null` 也是无关紧要的。非真(non-true)值并不影响子句中其他部分的计算结果,相当于被忽略了。

### Null与排序

在排序时, null 值被认为是最大的. 在降序排序时(descending)这会让你非常头大,因为 null值排在了最前面。


下面这个查询是为了根据得分显示用户排名, 但它将没有得分的用户排到了最前面!

	select name, points
	from users
	order by 2 desc;

>-- points 为 `null` 的记录排在所有记录之前!

解决这类问题有两种思路。最简单的一种是用 coalesce 消除 null的影响:

> -- 在输出时将 null 转换为 0 :

	select name, coalesce(points, 0)
	from users
	order by 2 desc;

>-- 输出时保留 null, 但排序时转换为 0 :

	select name, points
	from users
	order by coalesce(points, 0) desc;

还有一种方式需要数据库的支持，指定排序时将 `null` 值放在最前面还是最后面:

	select name, coalesce(points, 0)
	from users
	order by 2 desc nulls last;

当然， null 也可以用来防止错误的发生，比如处理除数为0的数学运算错误。

### 被 0 除

除数为0是一个非常 egg-painfull 的错误。昨天还运行得好好的SQL，突然被0除一下子就出错了。一个常用的解决方法是先用 `case` 语句判断分母(denominator)是否为0，再进行除法运算。

	select case when num_users = 0 then 0 
	else total_sales/num_users end;

case 语句的方式其实很难看，而且分母被重复使用了。如果是简单的情况还好，如果分母是个很复杂的表达式，那么悲剧就来了： 很难读，很难维护和修改,一不小心就是一堆BUG.

这时候我们可以看看 `null` 的好处. 使用 `nullif` 使得分母为0时变成 `null`. 这样就不再报错, `num_users = 0` 时返回结果变为 null.

	select total_sales/nullif(num_users, 0);

> `nullif` 是将其他值转为 null, 而Oracle的 `nvl` 是将 null 转换为其他值。

如果不想要 null，而是希望转换为 0 或者其他数， 则可以在前一个SQL的基础上使用 `coalesce`函数:

	select coalesce(total_sales/nullif(num_users, 0), 0);

> null 再转换回0

### Conclusion

Tony Hoare 也许会后悔自己的错误, 但至少 null 存在的问题很容易地就解决了. 那么快去练练新的大招吧，从此远离 null 挖出来的无效大坑(nullifying)!




原文链接: [Understanding SQL's Null](https://www.periscope.io/blog/understanding-sql-null.html)

原文日期: 2015年03月17日

翻译日期: 2015年03月18日


翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)