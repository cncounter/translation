MySQL 转换函数与运算符
==

> Table 12.14 转换函数(Cast Function)

<table summary="Cast Functions" border="1"><colgroup><col class="name"><col class="description"></colgroup><thead><tr><th scope="col">名称</th><th scope="col">说明</th></tr></thead><tbody><tr><td scope="row">
<code class="literal">BINARY</code></td><td>
将 string 转换为二进制 string
</td></tr><tr><td scope="row">
<code class="literal">CAST()</code></td><td>
将某个值转换为特定类型
</td></tr><tr><td scope="row">
<code class="literal">CONVERT()</code>
</td><td>
将某个值转换为特定类型
</td></tr></tbody></table>


- **`BINARY`**

`BINARY` 运算符将紧随其后的 string 转换为 二进制字符串。主要用来强制进行按字节进行比较(byte by byte),字节而不是字符的字符。这使得字符串比较是区分大小写的, 不管原始的列定义是否是 `BINARY` 或者 `BLOB`。`BINARY` 也对字符串末尾的空格敏感。

	SELECT 'a' = 'A';

 > 1
 
	SELECT BINARY 'a' = 'A';

> 0

	SELECT 'a' = 'a    ';

> 1

	SELECT BINARY 'a' = 'a   ';

> 0


在上面的比较中, `BINARY` 影响的是整个比较操作; 不管哪个操作数放在前面, 结果都是一样的。

还有一种情况，`BINARY` 不对等号起作用：

	 SELECT 'a' = BINARY 'a    ';

> 1

`BINARY str` 其实是 `CAST(str AS BINARY)` 的缩写。

有时候, 如果将索引列转换为 `BINARY`, MySQL可能不会使用索引。

 - **`CAST(expr AS type)`**


`CAST()` 函数接收任意类型的表达式, 并根据指定类型返回相应的结果值, 跟 `CONVERT()` 很相似, 除了使用的语法形式上有一点区别, 所以请参考下面的 `CONVERT()` 函数。


- **`CONVERT(expr,type)`, `CONVERT(expr USING transcoding_name)`**

`CONVERT()`和 `CAST()` 函数都是接收任意类型的表达式, 并根据指定类型返回相应的结果值。

`CAST()` 和 `CONVERT(... USING ...)` 都是标准的SQL语法。而没有 USING 的 `CONVERT()` 是 ODBC 的语法。

`USING` 方式的 `CONVERT()` 在不同的字符集之间进行数据转换。在MySQL中, 转码的名称和相应的字符集名称一致。例如, 下面的语句将字符串 '`abc`' 从默认字符集转换为 `utf8` 字符集:

	SELECT CONVERT('abc' USING utf8);


转换函数的结果可以是以下这些类型:


- `BINARY[(N)]`

- `CHAR[(N)]`

- `DATE`

- `DATETIME`

- `DECIMAL[(M[,D])]`

- `SIGNED [INTEGER]`

- `TIME`

- `UNSIGNED [INTEGER]`

`BINARY` 生成的是二进制形式的 string 数据类型。更多细节请参考  [11.4.2节, “The BINARY and VARBINARY Types”](http://dev.mysql.com/doc/refman/5.6/en/binary-varbinary.html) 。如果传入了可选参数**N**, 那么 `BINARY(N)` 的转换结果最多为 **N** 个字节。如果结果小于N个字节,则用 `0x00` 来填充。

`CHAR(N)`的结果为最多N个字符。

##
##
##


通常情况下,你不能比较一个BLOB值或其他二进制字符串以不区分大小写的方式,因为二进制字符串没有字符集,因此没有字母盘的概念。执行不区分大小写的比较,使用()函数将值转换为一个二进制字符串。使用字符串排序的比较结果。例如,如果结果的字符集不区分大小写排序,这样操作是不区分大小写:

	SELECT 'A' LIKE CONVERT(blob_col USING latin1) FROM tbl_name;

使用不同的字符集,用它的名字代替latin1前声明中的一个。为转换后的字符串,指定一个特定的排序使用核对条款()调用转换后,正如10.1.9.2节中所描述的那样,“把()和()。例如,要使用latin1_german1_ci:

	SELECT 'A' LIKE CONVERT(blob_col USING latin1) COLLATE latin1_german1_ci
	  FROM tbl_name;

转换()可以更广泛用于比较的字符串表示在不同的字符集。

低()(和上())应用于二进制时无效的字符串(二进制、VARBINARY BLOB)。执行文书夹转换,将字符串转换成一个二进制字符串:

	mysql> SET @str = BINARY 'New York';
	mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING latin1));
	+-------------+-----------------------------------+
	| LOWER(@str) | LOWER(CONVERT(@str USING latin1)) |
	+-------------+-----------------------------------+
	| New York    | new york                          |
	+-------------+-----------------------------------+

演员功能是有用的,当你想创建一个列与一个特定的类型在创建表……SELECT语句:

	CREATE TABLE new_table SELECT CAST('2000-01-01' AS DATE);

功能也可以用于词法顺序排序枚举列。正常情况下,分类枚举列使用内部发生数值。铸造CHAR结果的值在一个词汇:

	SELECT enum_col FROM tbl_name ORDER BY CAST(enum_col AS CHAR);

铸造(str作为二进制)是一样的二进制str。铸造(expr为CHAR)将表达式作为字符串的默认字符集。

铸造()也改变了结果如果你使用它作为一个更复杂的表达式如CONCAT(日期:,(()现在日期))。

你不应该使用CAST()来提取不同格式的数据,而是使用字符串函数像左()或()提取。参见12.7节,“日期和时间函数”。

字符串转换为数值在数字环境中,您通常不需要做任何事除了使用字符串值,好像一个号码:


	mysql> SELECT 1+'1';
	       -> 2


如果你使用一个字符串在算术运算,它是在表达式求值转换为浮点数。

如果你使用一个数字在字符串背景下,数字自动转换为一个字符串:

	mysql> SELECT CONCAT('hello you ',2);
	        -> 'hello you 2'


MySQL 5.6.4之前,当使用一个显式的演员()在一份声明中时间戳值,不选择任何表,MySQL 5.6作为字符串处理的价值之前执行任何转换。这导致被截断值转换为数字类型时,如下所示:

	mysql> SELECT CAST(TIMESTAMP '2014-09-08 18:07:54' AS SIGNED);
	+-------------------------------------------------+
	| CAST(TIMESTAMP '2014-09-08 18:07:54' AS SIGNED) |
	+-------------------------------------------------+
	|                                            2014 |
	+-------------------------------------------------+
	1 row in set, 1 warning (0.00 sec)
	
	mysql> SHOW WARNINGS;
	+---------+------+----------------------------------------------------------+
	| Level   | Code | Message                                                  |
	+---------+------+----------------------------------------------------------+
	| Warning | 1292 | Truncated incorrect INTEGER value: '2014-09-08 18:07:54' |
	+---------+------+----------------------------------------------------------+
	1 row in set (0.00 sec)


这并不适用于选择时从一个表行,如下所示:

	mysql> USE test;
	
	Database changed
	mysql> CREATE TABLE c_test (col TIMESTAMP);
	Query OK, 0 rows affected (0.07 sec)
	
	mysql> INSERT INTO c_test VALUES ('2014-09-08 18:07:54');
	Query OK, 1 row affected (0.05 sec)
	
	mysql> SELECT col, CAST(col AS UNSIGNED) AS c_col FROM c_test;
	+---------------------+----------------+
	| col                 | c_col          |
	+---------------------+----------------+
	| 2014-09-08 18:07:54 | 20140908180754 |
	+---------------------+----------------+
	1 row in set (0.00 sec)


在MySQL 5.6.4后来,CAST()处理时间戳值查询不选择任何行以同样的方式,对于那些这样做,如下所示:

	mysql> SELECT CAST(TIMESTAMP '2014-09-08 18:07:54' AS SIGNED);
	+-------------------------------------------------+
	| CAST(TIMESTAMP '2014-09-08 18:05:07' AS SIGNED) |
	+-------------------------------------------------+
	|                                  20140908180754 |
	+-------------------------------------------------+
	1 row in set (0.00 sec)


隐式转换信息的数字字符串,参见12.2节,“表达式求值类型转换”。

MySQL支持64位算术与签署和无符号值。如果您使用的是数字运营商(比如+或-)的一个操作数是一个无符号整数,其结果是无符号在默认情况下(参见12.6.1算术运算符)。你可以覆盖使用符号(或无符号把操作符将签署或无符号值64位整数,分别。

	mysql> SELECT CAST(1-2 AS UNSIGNED)
	        -> 18446744073709551615
	mysql> SELECT CAST(CAST(1-2 AS UNSIGNED) AS SIGNED);
	        -> -1

如果操作数是一个浮点值,结果是一个浮点值,不影响前面的规则。(在这种情况下,小数列值被视为浮点值。)

	mysql> SELECT CAST(1 AS UNSIGNED) - 2.0;
	        -> -1.0


SQL模式影响转换操作的结果。例子:

- 如果你“零”日期字符串转换为日期,()和()返回NULL和转换时产生警告NO_ZERO_DATE启用SQL模式。

- 为整数减法,如果启用了NO_UNSIGNED_SUBTRACTION SQL模式,减法结果即使签署任何操作数是无符号的。

有关更多信息,请参见5.1.7部分,“服务器SQL模式”。







> **如何将 BLOB 转换为 UTF8 的 `char`**

> 首先，请查看 BLOB 里面存储的是什么编码的byte。是 `utf8` 还是其他字符集?


	CAST(a.ar_options AS CHAR(10000) CHARACTER SET utf8) 

> 在这里必须指定正确的字符集,  对应于 BLOB 中存储的编码。如果里面存储的是 utf8编码, 那么就是上面这样。如果存储的是 `latin1` 字符集, 那么就需要设置为 `latin1` 。




原文链接: [Cast Functions and Operators](http://dev.mysql.com/doc/refman/5.6/en/cast-functions.html)

原文日期: 

翻译日期: 

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
