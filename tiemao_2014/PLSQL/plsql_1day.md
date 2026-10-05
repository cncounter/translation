# PL/SQL基础教程

本文来自《Sams Teach Yourself PL/SQL in 21 Days, Second Edition》(21天自学PL/SQL, 第二版)。 如果你是Oracle环境的新手, 这本书将帮助你快速学习和掌握Oracle的内置过程语言。 无论你使用Oracle的哪种产品, PL/SQL(Procedural Language/Structured Query Language, 过程语言/结构化查询语言)的知识都是一项基本技能。

今天, 也就是第一天, 你将完成这些任务:

- 了解PL/SQL是什么, 以及为什么要学习并掌握它
- 了解Oracle PL/SQL与其他产品的关系
- 了解完成本书学习所需的资源
- 编写你的第一个PL/SQL函数

在剩下的20天里, 你将深入了解这门语言的力量和能力, 学习如何在应用程序中运用它的威力 —— 无论你是在使用Oracle的工具(如Developer/2000)进行客户端/服务器编程, 使用其他前端工具(比如PowerBuilder), 还是仅仅在服务器上编写一些批处理作业。


PL/SQL是什么?
================

Oracle PL/SQL是一种过程语言, 它是作为标准SQL的扩展而发展起来的, 提供了一种在数据库上执行过程逻辑的方式。

**新术语:** 如果你以前接触过关系数据库, 毫无疑问你熟悉SQL —— 它代表 结构化查询语言。 SQL本身是一种强大的声明式语言。 所谓 声明式, 是指你描述想要的结果, 而不是描述如何获得它。 这很好, 因为它让你的应用程序摆脱了数据物理存储的细节。 高明的SQL程序员还可以通过创造性地使用SQL, 把大量处理工作推回到服务器层面。

不过, 用一条声明式查询能完成的事情是有限的。 现实世界很少像我们希望的那样整洁。 开发人员经常发现自己需要连续执行多个查询, 并在处理下一个查询之前先处理上一个查询的具体结果。 这在客户端/服务器环境中导致两个问题:

- 程序逻辑(也就是过程的定义)驻留在客户机上。
- 需要从一个查询中读取数据, 并把它作为下一个查询的基础, 这增加了网络流量。

为什么这些问题很严重? 客户机上的程序逻辑在软件升级时可能很快变得不同步。 它还可能引入错误, 导致数据库完整性的丧失。 把大量中间数据拉回客户端, 会让最终用户长时间干等着, 盯着沙漏看数据一点一点传到自己的机器上。 当客户端数量很多时, 通过网络传输大量数据会进一步降低性能。

PL/SQL为开发人员提供了一种在服务器层面添加过程化组件的机制。 它已经在不断增强, 如今开发人员可以在服务器层面访问一门功能完备的过程语言的所有特性。 它也构成了Oracle不断推陈出新的客户端/服务器开发工具(尤其是Developer/2000)的编程基础。


为什么学习PL/SQL?
==================

如果你正在使用Oracle的产品(例如Developer/2000)进行开发, 这个问题的答案很简单: 你需要了解PL/SQL, 因为这些产品使用PL/SQL过程代码。 但如果你不是在用Oracle的产品开发呢? 如果你只是在用Oracle数据库引擎呢? PL/SQL还有用吗? 是的! 绝对有用。

无论你使用什么前端工具, 你都可以用PL/SQL在服务器上执行处理, 而不是在客户端。 你可以用PL/SQL封装业务规则和其他复杂逻辑。 它提供了模块化和抽象。 你可以用它编写数据库触发器, 执行复杂的约束、维护数据库完整性、记录数据变化、复制数据。 你还可以用PL/SQL存储过程和函数来增强数据库安全性。 最后, 它为你提供了平台独立性。 Oracle在许多硬件平台上都有实现, 但PL/SQL在所有平台上都一样。 无论你是在笔记本电脑上运行个人版Oracle, 还是在UNIX上运行Oracle8i Enterprise, 都没有区别。

无论你使用什么开发工具, 只要你是在Oracle环境中开发, 你掌握并运用PL/SQL的能力, 都会让你比不具备这些知识的人更有竞争优势。 PL/SQL让你有能力写出更健壮、更高效、更安全的应用程序。


SQL、SQL\*Plus和PL/SQL有什么区别吗?
====================================

这个问题一直困扰着很多Oracle新手。 有好几个产品名称里都带有“SQL”字样, 其中SQL、SQL*Plus和PL/SQL这三个经常一起使用。 正因如此, 人们很容易搞混: 各个产品分别负责什么工作, 以及工作究竟由谁来完成。 本节简要介绍这三个产品。

### SQL

SQL即结构化查询语言。 它已经成为 通用 的数据库访问语言, 已被国际标准化组织(ISO)和美国国家标准协会(ANSI)采纳。 当你的代码里有 选择(SELECT)、插入(INSERT)、更新(UPDATE)、删除(DELETE) 这类语句时, 你使用的正是SQL。 它是一种声明式语言, 总是在数据库服务器上执行。 你常常会在Developer/2000或Visual Basic这类开发工具里编写SQL语句, 但运行时这些语句会被发送到服务器上执行。

### PL/SQL

PL/SQL是Oracle对SQL的 过程语言 扩展。 它通常也运行在数据库服务器上, 但Oracle的某些产品(如Developer/2000)也在客户机上内置了PL/SQL引擎。 因此, 你可以根据手头任务的需要, 在客户端或服务器上运行PL/SQL代码。 与SQL不同, PL/SQL是 过程化 的, 而不是声明式的。 这意味着代码要指定如何完成事情。 而在SQL中, 你需要某种方式把PL/SQL代码发送到服务器执行。 PL/SQL还允许你在过程代码中嵌入SQL语句。 PL/SQL、SQL和SQL*Plus之间的这种紧密关系, 正是造成一些混淆的原因。

### SQL*Plus

SQL*Plus是一个交互式程序, 允许你输入并执行SQL语句。 它也允许你键入PL/SQL代码并把它发送到服务器执行。 SQL*Plus是开发和创建PL/SQL存储过程与函数时最常用的前端工具之一。

当你使用SQL*Plus运行SQL语句时会发生什么? 处理发生在哪里? SQL*Plus究竟做了什么, 数据库又做了什么? 如果你处在Windows环境中, 数据库服务器在网络上的某个地方, 那么会发生下面这些事:

- SQL*Plus把你的SQL查询通过网络发送到数据库服务器。
- SQL*Plus等待数据库服务器的回复。
- 数据库服务器执行查询, 并把结果返回给SQL*Plus。
- SQL*Plus把查询结果显示在你的电脑屏幕上。

即使你不是在联网的Windows环境下运行, 情况也一样。 唯一的区别可能是数据库服务器和SQL*Plus运行在同一台物理机器上。 例如, 当你在单台电脑上运行个人版Oracle时, 情况就是如此。

PL/SQL的执行方式也一样。 你把PL/SQL块输入到SQL*Plus中, 它被传送到数据库服务器执行。 如果PL/SQL代码中包含任何SQL语句, 它们会被发送到服务器的SQL引擎执行, 结果再返回给PL/SQL程序。

重要的一点是: SQL*Plus并不执行SQL查询。 SQL*Plus也不执行你的PL/SQL代码。 SQL*Plus只是你通向Oracle数据库的窗口, 真正的执行发生在数据库里。 图1.1说明了这种关系。

图1.1

SQL*Plus、SQL和Oracle PL/SQL之间的关系。

除了SQL*Plus, 还有几种工具也可以作为你通向数据库的窗口。 Server Manager就是这样一个工具, 它的界面与SQL*Plus类似, 不过Oracle计划在将来某个时候停止支持它。 如果你安装了Oracle Enterprise Manager, 可以看看SQLPlus Worksheet。 SQLPlus Worksheet是一个GUI工具, 与SQL*Plus完全兼容, 但更易用。 如果你是一名Developer/2000程序员, 你会用到Oracle Procedure Builder —— 这是一个用于开发和调试PL/SQL代码的工具。 本章后面你会进一步了解SQLPlus Worksheet和Procedure Builder。

本书大部分示例都使用SQL*Plus, 因为它对开发者来说普遍可用。 它可能仍然是开发、测试和创建PL/SQL存储子程序及SQL查询时使用最广泛的工具。

> 注意: 除了Oracle的工具之外, 一些第三方厂商也提供了可用于开发PL/SQL代码的工具。 这个领域的一些主要产品包括:

- SQL-Programmer, 由Sylvain Faust Inc.出品, 网址: http://www.bmc.com/
- SQL-Station, 由Platinum Technology出品, 网址: http://www.cai.com/
- SQL-Navigator, 由Quest Software出品, 网址: http://www.quest.com/
- Oracle应用程序开发工具(TOAD, Tool for Oracle Application Developers), 由Quest出品, 网址: http://www.quest.com/


你需要先准备什么
==================

为了尝试并完成本书的练习和示例, 你需要访问:

- Oracle8i数据库(个人版也可以)
- SQL*Plus或SQLPlus Worksheet

> 注意: 在可能的情况下, 本书中的练习和示例都设计为在Oracle8和Oracle8i上同样可以运行。 很多内容(尤其是前九天)甚至可以在Oracle7下运行。 不过, Oracle8i包含许多旧版本中没有的新特性。 第10、11、12、20和21天会特别关注这些新特性。

如果你目前没有可访问的Oracle数据库, 至少有两种办法可以获得一个。 你可以花一点钱访问Oracle在线商店, 购买几乎所有Oracle产品(包括数据库)的30天评估版。 你可以从Oracle主页 http://www.oracle.com 进入在线商店。 另一种办法是加入Oracle技术网(OTN)。 OTN会员可以免费下载开发者许可的Oracle数据库软件副本, 还可以选择订阅各种技术专题, 以便定期收到Oracle软件光盘。 你可以免费注册成为OTN会员, 网址是 http://technet.oracle.com 。

你需要具备以下数据库权限(角色):

- CREATE PROCEDURE(创建过程)
- CREATE SEQUENCE(创建序列)
- CREATE SESSION(创建会话)
- CREATE TABLE(创建表)
- CREATE TRIGGER(创建触发器)
- CREATE VIEW(创建视图)
- CREATE TYPE(创建类型)

应当提供以下Oracle自带的包:

- DBMS_OUTPUT
- DBMS_SQL
- 来实现
- DBMS_PIPE
- DBMS_ALERT

你的数据库管理员可以帮你确认这些包是否可用。

如果你使用的是Oracle8i个人版, 可以以 SYSTEM 用户登录并执行下面的查询来验证这些包是否存在:

--
SELECT object_name
FROM dba_objects
WHERE owner='SYS'
AND object_type = 'PACKAGE';
--

生成的列表会显示 SYSTEM 用户拥有的数据库中所有包。 本章提到的包都应该出现在列表中。 其中 DBMS_OUTPUT 最重要, 本书大部分练习和示例都用它来显示结果。 其他包只会在特定的章节中讨论。

> 警告: 我建议你不要在生产数据库上创建示例表, 也不要让示例表模式与其他用户共享。 如果你在自己的电脑上使用个人版Oracle, 不会有问题。 如果你使用的是雇主的设施, 可能需要和你的老板以及数据库管理员(DBA)商量一下可用的数据库。 这些练习和示例本身并没有什么危险, 但编码错误的风险总是存在, 比如死循环可能占用CPU和I/O资源。 尽量减少自己的错误对其他开发人员和最终用户可能造成的影响, 始终是一种良好的礼貌。


开始使用PL/SQL
================

现在你应该对PL/SQL是什么, 以及它与其他Oracle产品的关系有了基本了解。 你应该能在工作中或家里的Oracle数据库环境上动手了。 在本章余下的部分, 你将了解一些PL/SQL基础知识, 并编写你的第一个Oracle存储函数。

### PL/SQL块的结构

**新术语:** PL/SQL被称为 块结构 语言。 一个PL/SQL块是一个语法单元, 可以包含程序代码、变量声明、错误处理程序、过程、函数, 甚至其他PL/SQL块。

PL/SQL块的语法:

--
DECLARE
 variable_declarations
BEGIN
 program_code
EXCEPTION
 exception_handlers
END;
--

在这个语法中, variable_declarations 是你要定义的任何变量。 嵌套的游标定义以及PL/SQL过程和函数也在这里定义。 program_code 指的是PL/SQL语句组成的块。 exception_handlers 是程序代码, 用于处理运行时错误或异常。

PL/SQL块的声明部分是可选的, 但实践中很少没有任何声明。 PL/SQL块的异常处理程序部分也是可选的, 直到第7天“过程、包、错误和异常”你才会用到它。

> 注意: 当你定义PL/SQL函数、过程和触发器时, 一般不使用 DECLARE 关键字。 定义函数时, 函数规范(或函数头)有时被称为块的开始。 同样, 过程和触发器的规范分别以过程头和触发器头开始。 关于函数、过程和触发器块, 会在第2天“编写声明和块”中详细介绍。

**新术语:** 任何变量声明都必须紧跟在 DECLARE 之后、BEGIN 之前。 BEGIN 和 END 关键字划分出程序部分, 也就是代码本身。 EXCEPTION 关键字表示代码主体的结束, 并开启一段包含异常处理代码的部分。 每条语句末尾都要有分号; PL/SQL语句的 终止符(terminator) 表示块的结束。

> 提示: 忘记在块末尾写分号是一种很常见的疏忽。 漏掉它, 你就会得到一个语法错误。 记住加上它, 能省去很多烦恼。

如上所示, 块是 所有 PL/SQL编程的基础。 Oracle存储过程由一个PL/SQL块组成。 Oracle存储函数由一个PL/SQL块组成。 Oracle数据库触发器也由一个PL/SQL块组成。 除了作为块的一部分, 无法执行PL/SQL代码。

PL/SQL块可以 嵌套。 一个块可以像下面这样包含另一个块:

--
DECLARE
 variable declarations go here
BEGIN
 some program code
 BEGIN
  code in a nested block
 EXCEPTION
  exception_handling_code
 END;
 more program code
END;
--

### 编译并执行一个简单的块

你准备好编写自己的第一段PL/SQL代码了吗? 好。 记住, 和本书所有其他示例一样, 你将使用SQL*Plus把PL/SQL代码发送到Oracle数据库执行。

先运行SQL*Plus并连接到Oracle数据库。 你最初的SQL*Plus屏幕应该类似于图1.2所示。

接下来, 键入清单1.1所示的代码。 注意末尾的斜杠, 必须像下面这样输入。

图1.2

最初的SQL*Plus屏幕。

清单1.1 第一个PL/SQL块

--
DECLARE
 x   NUMBER;
BEGIN
 x := 72600;
END;
/
--

> 提示: 末尾的斜杠告诉SQL*Plus, 你已经输入完PL/SQL代码。 SQL*Plus会把代码发送到Oracle数据库执行。 对SQL*Plus来说, 斜杠有特殊的含义。

> 提示: 斜杠字符必须单独占一行, 且必须是该行的第一个字符; 否则它会被发送到数据库并产生一条错误消息。

你输入斜杠后, SQL*Plus就把代码传送给Oracle执行。 代码执行后, 你的输出应该类似下面这样:

--
declare
 x  integer;
begin
 x := 65400;
end;
/
--

PL/SQL procedure successfully completed

你刚刚执行的代码可能并不很令人兴奋, 原因大概是没有输出。 PL/SQL确实有一些有限的输出手段, 明天你将学习如何生成一些简单的屏幕输出。

### 那输出呢?

PL/SQL最初设计时并没有输出设备。 记住, PL/SQL不是一门独立的语言。 它几乎总是与其他程序或工具结合使用, 来处理输入、输出和其他用户交互。

Oracle现在随PL/SQL提供了 DBMS_OUTPUT 包, 为你提供一些有限的输出能力。 第8天“使用SQL”你会学到更多关于包的知识, 但现在只需知道你可以使用 dbms_output.put_line 过程, 如清单1.2所示。

清单1.2 使用PL/SQL块中的 dbms_output.put_line 过程

--
DECLARE
 x   NUMBER;
BEGIN
 x := 72600;
 dbms_output.put_line('The variable X = ');
 dbms_output.put_line(x);
END;
/
--

这个 dbms_output.put_line() 过程接受一个参数, 并生成一行文本作为数据库服务器的输出。 为了让你看到这行文本, 你必须告诉SQL*Plus把它显示出来。 这可以通过下面的SQL*Plus命令完成:

--
SQL> SET SERVEROUTPUT ON
--

现在输入前面的命令。 每个会话只需要执行一次, 所以除非你退出SQL*Plus又回来, 否则不需要重新执行。

接下来, 键入清单1.2中的PL/SQL代码。 从SQL*Plus得到的输出应该如下所示:

--
The variable x=
72600
--

> 注意: SQL*Plus会把服务器输出打印到屏幕上供你查看。 你必须记住执行 SET SERVEROUTPUT 命令, 否则看不到任何输出。 当你不想看到输出时, 也可以使用 SET SERVEROUTPUT OFF 命令关闭输出。

----------------------------------------------------------------

### 替代重打

到目前为止, 你都是把试过的每个PL/SQL块重新敲一遍。 如果犯了错, 就得重新输入代码。 其实有一些替代直接输入PL/SQL到SQL*Plus的方法。 根据你的个人喜好和想做的事情, 有三种基本方法:

- 在记事本中剪切和粘贴。
- 使用SQL*Plus的 @ 命令执行文本文件。
- 使用SQL*Plus的 EDIT 命令。

第一种方法是运行Windows记事本, 输入你的PL/SQL代码(或SQL查询), 然后从记事本复制并粘贴到SQL*Plus中执行。 这种方法非常适合尝试简短的PL/SQL代码和SQL查询。 你可以把几个相关项目保存在同一个文本文件里, 想用的时候就能轻松调用。

第二种方法使用一个SQL*Plus命令来执行文件。 例如, 如果你有一个名为 test.sql 的文本文件, 里面是清单1.2中的代码, 可以通过输入下面的命令来执行它:

SQL> @c:\a\test

产生的输出会像这样:

The variable X =
65400

> 注意: 当你执行文件时, 默认的扩展名是 .sql。 SQL*Plus会先在默认目录中查找文件, 然后沿着你可以定义的搜索路径查找。 如何定义这个路径是操作系统相关的, 超出了本书的范围。 你应该查阅 SQL*Plus用户指南 以及操作系统的文档。

当你需要反复重建某个存储在文本文件中的存储过程、函数或数据库触发器时, 这类从文件执行命令的方式最为有用。

第三种方法是使用SQL*Plus的 EDIT 命令来调用系统的文本编辑器。 在Windows下, 这通常是记事本, 除非你专门指定了其他编辑器。 当你在提示符下输入 EDIT 命令时, SQL*Plus会启动记事本, 并自动载入最近的PL/SQL块或刚刚执行的SQL语句。 这方面的例子见图1.3。

图1.3 使用SQL*Plus的 EDIT 命令。

在打开的记事本中, 你可以尽情编辑PL/SQL块, 然后退出记事本并确认保存。 当你保存文件时, SQL*Plus并不会立即重新编译它, 只是把它放进一个内部缓冲区。 你必须使用 / 命令(单独输入一行 /)才能执行编辑后的代码。

使用 EDIT 命令时, 只要你记住一个重要事项, 它就能很好地工作: SQL*Plus只记得最近的SQL语句或PL/SQL块。 如果你一直在编辑一个PL/SQL块, 然后执行了一条SQL语句, 那么这条语句会替换掉你刚编辑的PL/SQL块。

> 警告: 不要让SQL*Plus缓冲区里只留下你复制的一段长长的过程。 很容易在不加思索的情况下输入一条SQL命令, 把你正在开发的长PL/SQL过程给毁掉。

这三种方法选哪一种, 取决于你, 也在某种程度上取决于你的个人喜好。 你可能会发现, 第一种方法(在记事本和SQL*Plus之间复制粘贴)在本书前几章最有用。 当你开始编写更大的PL/SQL函数和过程时, 你会发现自己更倾向于把它们各自放进单独的文件。


编写你的第一个函数
====================

也许用PL/SQL能做的最有用的事情之一, 就是用它编写存储函数和存储过程。 前面你写的代码可以封装成一个函数, 让你把它编译一次并存储在数据库中, 供以后使用。 下次你想运行这段PL/SQL块时, 只需调用这个函数即可。 使用SQL*Plus, 键入清单1.3所示的代码, 它会创建一个PL/SQL函数, 返回的值与清单1.2输出的一致。

清单1.3 SS_THRESH 函数

--
CREATE OR REPLACE FUNCTION ss_thresh
RETURN NUMBER AS
 x   NUMBER;
BEGIN
 x := 72600;
 RETURN x;
END;
/

Function created
--

把清单1.3中的代码与清单1.2做个比较。 注意, 关键字 DECLARE 已被第1、2行的 创建或替换函数ss_thresh返回数量 取代。 这将在第3天进一步解释。 还要注意, 对 dbms_output.put_line() 的调用已被 RETURN 命令(第6行)取代, 它把变量 X 的值返回给调用者。 清单1.3唯一的输出是一条确认函数创建成功的消息, 如第9行所示。

注意, Oracle已经创建了该函数。 SQL*Plus通过显示文字 函数已创建 来表明这一点。

### 查找编译错误

你可能能够顺利输入清单1.3中的代码并创建 SS_THRESH 函数, 而没有任何错误。 但也许不会这么顺利。 为了向你演示如何处理错误, 清单1.4包含了与清单1.3相同的代码, 但故意留了一个小错误。

清单1.4 带有一个错误的 SS_THRESH 函数

--
CREATE OR REPLACE FUNCTION ss_thresh
 RETURN NUMBER AS
  x   NUMBER;
 BEGIN
  x = 72600;
  RETURN x;
END;
/

Warning: Function created with compilation errors.
--

与大多数编译器不同, 这里的错误不会随源代码清单一起显示出来; Oracle把发现的任何错误都存储在一个名为 USER_ERRORS 的数据库表中。 如果你想查看具体细节, 需要自己去检索错误清单。 可以使用清单1.5所示的SQL*Plus命令 SHOW ERRORS 来完成。

清单1.5 SHOW ERRORS 命令

--
 1: SHOW ERRORS
Errors for FUNCTION SS_THRESH:

 LINE/COL ERROR
 -------- ---------------------------------------------------------------
 5/5   PLS-00103: Encountered the symbol "=" when expecting one of the
     following:
     := . ( @ % ;
     The symbol ":= was inserted before "=" to continue.
--

如你所见, 错误清单的输出有两列。 第一列包含错误发生的行号以及该行中的字符位置。 第二列包含具体的错误消息。 在本例中, 错误发生在第5行第5个字符位置。 错误消息告诉你, Oracle遇到了一个等号, 但它期待的其实是别的东西。 这里的“别的东西”, 就是赋值运算符 := 。

图1.4显示了SQL*Plus执行清单1.4和1.5之后的屏幕。

图1.4

SS_THRESH 的错误清单。

> 提示: 把 = 打成 := 是一种常见的错误, 尤其是当你在其他语言里习惯了用 = 做赋值的时候。

### 显示函数的返回值

现在你已经编写并编译了这个函数, 是时候执行它、看看结果了。 最简单的方法是使用SQL*Plus发出下面的SQL命令:

--
SELECT SS_THRESH FROM DUAL;
SS_THRESH
---------
  72600
--

SS_THRESH 函数没有参数, 所以调用它时一定不要加括号。 换句话说, 不要写成 SS_THRESH(), 否则Oracle会返回错误。 表 DUAL 是一种特殊的Oracle表, 它始终存在、始终只有一行、始终只有一列。 测试函数时用它再合适不过了。 从 DUAL 表中选择函数, 就能让函数的结果显示出来。

### 这么简单的函数也有用吗?

SS_THRESH 函数是一个非常简单的函数, 你可能会觉得这么简单甚至有点荒唐的东西不可能有用。 这个函数返回的是社保缴费和福利的基数, 这个值每年都会变化。 如果你是一个薪资管理系统中的程序员, 需要编写一些使用这个值的查询, 就可以用这样一个函数把该信息 封装 起来。 封装信息意味着把它嵌入到一个函数里, 这样这些值就不必在整段代码里到处复制, 任何修改都能在一个中心位置完成。 这种做法还有一个好处: 你的查询变得更具可读性。 当你六个月后回来看代码时, 记住下面这样写的意思, 会比直接硬编码数值更容易:

SELECT * FROM employee_table
 WHERE emp_salary > 72600;

使用Developer/2000的Procedure Builder执行PL/SQL
=================================================

Procedure Builder(过程构建器)是Oracle Developer/2000开发环境的一部分。 它允许你使用Developer/2000开发的应用程序中使用的PL/SQL程序单元来进行开发和调试。 使用Developer/2000时, 你在客户端用PL/SQL程序来实现窗体、报表和菜单背后的行为; 最终客户端和服务器上都会有PL/SQL引擎。 一个很好的好处是, Procedure Builder可以在不连接数据库的情况下执行PL/SQL代码。

> 注意: 本书后面讨论的许多高级特性, 只有在数据库中执行PL/SQL代码时才能使用。

### 启动Procedure Builder

如果你安装了Developer/2000, 可以依次选择“开始”、“程序”、“Developer/2000 R2.0”、“Procedure Builder”来启动它。 打开的屏幕如图1.5所示, 分为三个部分。

图1.5

Procedure Builder的初始屏幕。

如你所见, Procedure Builder窗口分为三个主要部分。 对象导航器(Object Navigator)窗口允许你浏览各种程序单元、PL/SQL库以及可以访问的数据库对象。 另外两个部分合在一起构成了PL/SQL解释器(Interpreter)窗口。 上面的窗格在调试PL/SQL代码时用于显示正在调试的代码; 下面的窗格则用于键入并执行临时的PL/SQL块。

**新术语:** PL/SQL可以用来编写过程、函数、包体、包规范和触发器。 这些结构被称为 程序单元(program units)。

### 使用交互式PL/SQL

PL/SQL解释器允许你输入PL/SQL匿名块并执行它。 你之前输入的清单1.2中的小块就是一个匿名块。 你可以把块输入到Procedure Builder中并执行, 但首先需要做一点小改动。 清单1.2中的代码包含下面两行对 DBMS_OUTPUT 的调用:

dbms_output.put_line('The variable X = ');
dbms_output.put_line(x);

DBMS_OUTPUT 是一个只存在于数据库服务器上的包。 如果你现在就尝试执行这段代码, Procedure Builder会返回错误。 幸运的是, Oracle有一个类似 DBMS_OUTPUT 的包, 可以在客户端执行代码时使用。 这个包叫 TEXT_IO, 它也包含一个入口点 PUT_LINE 。 把清单1.2中的代码里的 dbms_output.put_line 调用替换为 TEXT_IO.PUT_LINE , 就得到了清单1.6。 这段代码将从Procedure Builder中运行。

清单1.6 在Procedure Builder中运行、使用 TEXT_IO 的PL/SQL块

DECLARE
 x   INTEGER;
BEGIN
 x := 72600;
 text_io.put_line('The variable X = ');
 text_io.put_line(x);
END;

现在你可以把这段代码键入Procedure Builder的PL/SQL解释器。 当你输入完最后一行时, 解释器会自动执行这个块。 结果会像下面这样:

The variable X =
72600

Procedure Builder是专门使用PL/SQL编写的。 与SQL*Plus不同, 你不需要输入斜杠来告诉Procedure Builder PL/SQL块的输入已经结束。

### 创建 SS_THRESH 函数

用Procedure Builder创建函数(或过程、包等其他任何程序单元)并不仅仅是在解释器里输入 CREATE FUNCTION 语句那么简单。 要创建一个函数, 你需要告诉Procedure Builder你想创建一个新的程序单元。 为此, 选择“文件”、“新建”、“程序单元”菜单项。 你会看到如图1.6所示的对话框。

图1.6

创建一个新的程序单元。

该对话框包含单选按钮, 让你选择要创建的程序单元类型, 还包含一个用于填写程序单元名称的文本框。 选择“函数”, 在名称文本框中输入 SS_THRESH , 然后单击“确定”。 你会看到类似图1.7所示的屏幕。

图1.7

输入 SS_THRESH 的代码。

图1.7显示的是已经写好的函数代码。 当然, Procedure Builder并不会替你写代码。 Procedure Builder打开这个窗口时, 只是在文本框中搭好函数的骨架, 需要你填写细节。 当你按自己想要的代码填好之后, 单击“编译”按钮进行编译, 然后单击“关闭”按钮关闭窗口。

要执行你刚创建的函数, 在PL/SQL解释器中输入下面的语句:

TEXT_IO.PUT_LINE(SS_THRESH);

执行这条语句时, Procedure Builder会执行该函数并显示下面的结果:

72600

### 连接到数据库

除了在客户端创建PL/SQL程序单元, Procedure Builder还可以用来在数据库中创建和执行程序单元。 要做到这一点, 首先需要连接到数据库。 使用“文件”、“连接”菜单项来连接数据库。 登录之后, 你就可以用对象导航器浏览数据库中的程序单元。 图1.8显示了名为 杰夫 的用户所拥有的程序单元。

图1.8

杰夫 模式下的程序单元。

要在数据库中创建存储函数或其他程序单元, 请按以下步骤操作:

- 单击以高亮选中用户名下的 存储程序单元 条目。
- 单击工具栏上的“新建(Create)”按钮。
- 继续操作, 你就会创建一个本地程序单元。

除了需要选择模式之外, 在数据库中创建PL/SQL函数的过程与创建本地函数完全相同。

### 使用SQLPlus Worksheet

如果你能用Oracle Enterprise Manager, 可以考虑使用本书示例中的SQLPlus Worksheet。 SQLPlus Worksheet与SQL*Plus完全兼容, 可用于本书的所有示例。 相比SQL*Plus, SQLPlus Worksheet的优势在于它的界面。 你不必再输入大量单行命令, 而是可以使用类似文本编辑器的界面。 当你按自己想要的代码填好之后, 单击工具栏按钮即可执行它。

### 使用SQLPlus Worksheet执行PL/SQL块

图1.9显示了SQLPlus Worksheet。


小结
=====

本章中, 你初步了解了PL/SQL是什么以及为什么要使用它。 你知道了PL/SQL是Oracle对SQL的过程语言扩展, 可以用它编写在服务器上执行的过程和函数。

本章还解释了PL/SQL、SQL和SQL*Plus之间的关系。 这应该能让你很好地理解Oracle PL/SQL在整个图景中的位置。

你编写了第一个PL/SQL存储函数, 这也让你对PL/SQL编程有了初步的感觉和技巧。

SQL*Plus是本书示例中用来执行PL/SQL代码的工具。 SQLPlus Worksheet和Procedure Builder是另外两个也可以用来编写和执行PL/SQL代码的工具。

问答
====

可以看出, SQLPlus Worksheet的屏幕分为上下两半。 上半部分用于输入和编辑SQL语句及PL/SQL块。 下半部分用于显示输出。 执行工具栏按钮(图标是一道闪电)用于执行你在上面窗格中输入的语句。

从文件使用SQLPlus Worksheet执行命令有两种方法。 一种是用“文件”、“打开”菜单项把文件内容加载到上方面板, 然后单击“闪电”按钮。 另一种是用“工作表”、“运行本地脚本”菜单项。

**问: PL/SQL代码是在哪里执行的?**

通常, 执行发生在服务器层面。 本书中的示例一向如此。 有些Oracle产品(比如Developer/2000)也有能力在客户机上本地执行PL/SQL块。

**问: 我可以用PL/SQL编写一个完整的应用程序吗?**

一般来说你不能, 至少不是大多数人想象的那种应用程序。 对于终端用户应用程序, 你仍然需要PowerBuilder或Developer/2000这样的工具来设计屏幕和生成报表。

**问: 我用 dbms_output.put_line() 执行了一些PL/SQL代码来打印数据, 但什么都没看到, 这是怎么回事?**

你可能忘了启用服务器输出选项。 使用下面的SQL*Plus命令:

SET SERVEROUTPUT ON

如果你忘了, PL/SQL的输出就会被忽略掉。

**问: 我在使用Procedure Builder时, 执行包含 dbms_output.put_line() 调用的代码报错了, 为什么?**

当你使用Procedure Builder执行本地代码时, 必须用 TEXT_IO.PUT_LINE 而不是 dbms_output.put_line() 。 如果你用的是Procedure Builder, 并且已经连接到数据库, 那么你可以执行对 dbms_output.put_line() 的调用, 但看不到结果。


练习
=====

使用下面的练习来检验你对本章的理解, 把学到的东西付诸实践。 测验和练习的答案见附录A“答案”。

### 测验

- 用什么把PL/SQL代码发送到Oracle数据库执行?
- 所有PL/SQL代码的基本构成单位是什么?
- 列出把程序逻辑推到服务器层面的一个好处。
- 列出三个使用PL/SQL的Oracle产品。
- 什么命令能让SQL*Plus显示PL/SQL输出?
- 说出管理PL/SQL代码的至少两种方式。

### 练习

- 如果你在编译第一个函数时没有遇到任何错误, 试着故意引入一些错误, 然后尝试 SHOW ERRORS 命令。
- 尝试本章提到的三种管理源代码的方式。 熟悉SQL*Plus的 EDIT 命令。 试着使用 @ 命令或 START 命令从文本文件执行你的PL/SQL代码。

版权 © 培生教育。 保留所有权利。



原文链接: [http://www.developer.com/tech/article.php/777761/Day-1-Learning-the-Basics-of-PLSQL.htm](http://www.developer.com/tech/article.php/777761/Day-1-Learning-the-Basics-of-PLSQL.htm)
