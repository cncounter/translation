MarkDown简单示例
==

#请对比查看源文件与显示效果

## 1. 标题,井号(#)

#  1个#号就类似于 h1,即标题1
## 2个#号就类似于 h2,即标题2
...
#########以此类推,直到 h9

	#  1个#号就类似于 h1,即标题1
	## 2个#号就类似于 h2,即标题2
	...
	#########以此类推,直到 h9

## 2.超链接

使用方括号,小括号的方式: [CNCounter](http://www.baidu.com)

	[CNCounter](http://www.baidu.com)

还可以采用嵌入html:


<a name="#relative_post">点击跳到嵌入的HTML锚点</a>

<a href="http://blog.csdn.net/renfufei">铁锚博客</a>


	<a name="#relative_post">点击跳到嵌入的HTML锚点</a>
	
	<a href="http://blog.csdn.net/renfufei">铁锚博客</a>
	
	##<a name="relative_post">相关文章</a>

## 3. 图片

类似于在超链接前面加上一个英文的感叹号:

![图片描述,可以为空,类似于 alt](http://avatar.csdn.net/4/9/C/1_renfufei.jpg)

	![图片描述,可以为空,类似于 alt](http://avatar.csdn.net/4/9/C/1_renfufei.jpg)

当然,图片也可以是相对路径啦, `./`, `../` 之类的都允许,和 html的相对路径引用是一样的:

![](11_Git_CMD.png)

	![](11_Git_CMD.png)
	![](./11_Git_CMD.png)


## 4. 字体格式

**黑体**
*斜体*
***黑体斜体***

	**黑体**
	*斜体*
	***黑体斜体***


## 5. 源代码引用

源代码引用,只需要段前和段后有空行,并且源码的每一行前面都有制表符(\t),或者4个空格的缩进就会被解析为源码原样引用显示. 类似于  html 的 code, pre 标签.

另一种行内源码的表示方式是使用键盘上方数字键那一行最左边,数字1左边的 ` 符号括起来即可,注意不是单引号.

## 6. 数字列表

## 7. 无序列表



##<a name="relative_post">相关文章</a>

1. [目录](GitHelp.md)
1. [安装及配置Git](01_GitInstall.md)
1. [安装及配置TortoiseGit](02_TortoiseGit.md)
1. [基本使用方法](03_Usage.md)
1. [MarkDown示例](04_MarkDownDemo.md)
1. [解决 TortoiseGit 诡异的 Bad file number 问题](05_BadFileNumber.md)



日期: 2014-11-27

作者: [铁锚: http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
