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


一般来说,用不区分大小写的方式并不能比较 `BLOB` 值或者其他二进制串, 因为二进制串是没有字符集的,因此也没有字母的概念。如果要不区分大小写, 可以用 `CONVERT()` 将值转换为非二进制的字符串再来比较。比较的结果根据字符集排序而定。例如,假设字符集不区分大小写, 那么 `like` 操作也就不区分大小写:

	SELECT 'A' LIKE CONVERT(blob_col USING latin1) FROM tbl_name;

要使用其他字符集, 只要把里面的 `latin1` 替换掉就行。为转换后的字符串指定特定的排序规则, 可以在 `CONVERT()` 函数调用后面跟上 `COLLATE` 从句, 正如 [10.1.9.2 节 “CONVERT() and CAST()”](http://dev.mysql.com/doc/refman/5.6/en/charset-convert.html) 中所描述的. 例如,使用 `latin1_german1_ci` 排序:

	SELECT 'A' LIKE CONVERT(blob_col USING latin1) COLLATE latin1_german1_ci
	  FROM tbl_name;

`CONVERT()` 可以在不同的字符集之中进行比较。

`LOWER()` 和 `UPPER()` 对于二进制字符串是无效的(包括 `BINARY`, `VARBINARY`, `BLOB`)。要进行大小写转换,需要先将字符串转换成非二进制形式:

	mysql> SET @str = BINARY 'New York';
	mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING latin1));
	+-------------+-----------------------------------+
	| LOWER(@str) | LOWER(CONVERT(@str USING latin1)) |
	+-------------+-----------------------------------+
	| New York    | new york                          |
	+-------------+-----------------------------------+

转换函数可以用来创建特定类型的列,比如在 ` CREATE TABLE ... SELECT`语句之中:

	CREATE TABLE new_table SELECT CAST('2000-01-01' AS DATE);

转换函数也可以用来按定义的单词将 `ENUM` 列排序 。正常情况下, 枚举列是根据内部的数值表示来进行排序的。按字母排序 `CHAR` 类型的结果:

	SELECT enum_col FROM tbl_name ORDER BY CAST(enum_col AS CHAR);

`CAST(str AS BINARY)` 和  `BINARY str` 等价。`CAST(expr AS CHAR)` 将表达式当作默认字符集来处理。

`CAST()` 可能会改变复杂表达式的结果，例如 ` CONCAT('Date: ',CAST(NOW() AS DATE))`。

这里就不应该使用 `CAST()` 来提取不同格式的数据,而应该使用字符串函数，如  `LEFT()` 或者 `EXTRACT()`。详情请参考  [Section 12.7, “Date and Time Functions”](http://dev.mysql.com/doc/refman/5.6/en/date-and-time-functions.html)。

要把字符串转换为数值来进行处理, 一般是不需要手工处理的，MySQL会进行隐式的类型转换:

	SELECT 1+'1';

> 2


在算术运算中, string 会在表达式求值阶段转换为浮点数。

如果需要将数字当成字符串来处理, MySQL也会自动进行转换:

	SELECT CONCAT('hello you ',2);

> 'hello you 2'


在 MySQL 5.6.4之前的版本,用 `CAST()` 处理 `TIMESTAMP` 时， 如果不从具体的表中选取值, MySQL 5.6 会在执行转换之前把值优先当成字符串来对待。这在转换为数字时可能会导致截断,如下所示:

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


但如果从一张表中选取行时并不会这样,如下所示:

	USE test;
	
>Database changed

	CREATE TABLE c_test (col TIMESTAMP);

>Query OK, 0 rows affected (0.07 sec)
	
	INSERT INTO c_test VALUES ('2014-09-08 18:07:54');

>Query OK, 1 row affected (0.05 sec)
	
	SELECT col, CAST(col AS UNSIGNED) AS c_col FROM c_test;
>
	+---------------------+----------------+
	| col                 | c_col          |
	+---------------------+----------------+
	| 2014-09-08 18:07:54 | 20140908180754 |
	+---------------------+----------------+
	1 row in set (0.00 sec)


在MySQL 5.6.4 之后, 修复了这个问题,如下所示:

	SELECT CAST(TIMESTAMP '2014-09-08 18:07:54' AS SIGNED);

>
	+-------------------------------------------------+
	| CAST(TIMESTAMP '2014-09-08 18:05:07' AS SIGNED) |
	+-------------------------------------------------+
	|                                  20140908180754 |
	+-------------------------------------------------+
	1 row in set (0.00 sec)


关于数字和字符串的隐式转换, 参见 [12.2节 “Type Conversion in Expression Evaluation”](http://dev.mysql.com/doc/refman/5.6/en/type-conversion.html).

MySQL支持有符号的和无符号的64位算术运算。如果您使用的是数字运算符(如加 `+` 或减 `-`), 其中的一个操作数是无符号整数, 那默认情况下结果就是无符号数(参见 [12.6.1 算术运算符](http://dev.mysql.com/doc/refman/5.6/en/arithmetic-functions.html))。可以通过指定 `SIGNED` 或者 `UNSIGNED` 来进行转换。

	SELECT CAST(1-2 AS UNSIGNED)

> 18446744073709551615

	SELECT CAST(CAST(1-2 AS UNSIGNED) AS SIGNED);

> -1

如果有操作数是浮点值, 那么结果就是浮点值, 不受前面规则的影响。(在这种情况下, ` DECIMAL` 列被视为浮点值。)

	SELECT CAST(1 AS UNSIGNED) - 2.0;

> -1.0


SQL模式影响转换操作的结果。例如:

- 如果转换零值的日期串为日期,  **CONVERT()** 和 **CAST()** 都会返回 `NULL` , 并在 **NO_ZERO_DATE** 模式下产生警告。

- 对于整数的减法,如果启用了 `NO_UNSIGNED_SUBTRACTION` 模式, 减法结果是有符号数,即便其中一个是无符号数。

更多信息请参见 [5.1.7节 “Server SQL Modes”](http://dev.mysql.com/doc/refman/5.6/en/sql-mode.html)。







####**如何将 BLOB 转换为 UTF8 的 `char`**

> 首先，请查看 BLOB 里面存储的是什么编码的byte。是 `utf8` 还是其他字符集?


	CAST(a.ar_options AS CHAR(10000) CHARACTER SET utf8) 

> 在这里必须指定正确的字符集,  对应于 BLOB 中存储的编码。如果里面存储的是 utf8编码, 那么就是上面这样。如果存储的是 `latin1` 字符集, 那么就需要设置为 `latin1` 。




原文链接: [Cast Functions and Operators](http://dev.mysql.com/doc/refman/5.6/en/cast-functions.html)

翻译日期: 2015年10月03日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
