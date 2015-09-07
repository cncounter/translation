# Java9: REPL抢先玩!

What REPL means for Java

> 译者注: 推荐一个在线的REPL演示环境: [http://www.javarepl.com/console.html](http://www.javarepl.com/console.html)

> 你可以在里面试着执行一些简单的Java代码,比如:

> `System.out.println("See See REPL");`

> `2 + 2 * 5`


### 副标题: Java 9即将支持 REPL, JShell 有可能会改变程序员学习和使用 Java 的方式

Coming in Java 9, JShell will change how developers learn and write Java code



也许你曾写过 Clojure 和 Scala 代码, 或者你还用过 LISP 做开发。 如果你曾深爱过他们, 那很有可能你已经使用在开发生涯中和 REPL 相处愉快了。 REPL, 全称为 `read-eval-print-loop`, 是一个shell 界面，用来一行一行地读取输入内容, 计算这一行的值, 然后打印执行结果。 这是一种友好的即时反馈, 我很喜欢!


Maybe you're a closet Clojure or Scala developer, or perhaps you've worked with LISP in the past. If so, there's a good chance you've used a REPL as a part of your daily routine. REPL, or read-eval-print-loop, is a shell interface that reads each line of input, evaluates that line, and then prints the result. Instant feedback, nice!


在使用 REPL 时, 采用的是交互式的代码编写,输入完成立即执行。 Java 9 在2016年发布时,将会 [提供一个功能齐全的REPL环境](http://www.javaworld.com/article/2955273/java-platform/java-9-repl-faster-feedback.html) ，名字叫做 JShell(代号为Kulla)。 本文简要概述 Java REPL 并讨论将来编写代码时可能会如何使用它。在你编写Java代码的时候!

When you use a REPL, you are writing code interactively and executing it without delay. The release of Java 9 in 2016 will deliver a fully functional REPL environment named JShell (code-named Kulla). This article provides an overview of the Java REPL and discusses some possibilities for how you might use it in your Java programming -- yeah, you!


## 神马！ Java 居然没有 REPL 环境?

Wait, Java doesn't have a REPL already?


对于像 Java 这种稳定广泛的语言那是必须要有一个REPL环境呀! 但事实上并不是所有语言都支持REPL，比如Java(以前)就没有。 可以说,比起其他语言来说,Java的开发人员要多得多,也就更应该提供REPL环境。 Java 也有类似于 REPL 的环境: [Java BeanShell](http://www.beanshell.org/), 但这个项目一直没有提供功能齐全的REPL环境，只支持 Java 语法的一个子集。


Surely an established language like Java must have a REPL! Well, actually, not all languages have them and Java is one of those that has been missing it. Arguably, with more ceremony and boilerplate than most languages, Java is one of the languages whose developers have deserved it most. Java has had something a bit REPL-like for a while in the form of Java BeanShell, but this project was never a fully featured REPL on par with those of other languages. It was just a subset of the full Java language syntax.


## REPL 减少思维转向时间

REPL reduces turnaround

缩短思维转向时间并即使反馈对于程序员的健康来说非常重要。 对于想要这种特性的程序员来说, REPL 是一个非常给力的工具。 一般来说，可以立即看到执行结果对人类大脑来说是效率最高的编程方式。 有了Java REPL 环境, 开发者就可以编写代码,执行, 然后继续编写。 不再需要退出思维, 去编译一下，打包一下，执行一下，然后，奇怪，刚才写到哪儿了?  

Shortening turnaround time and feedback loops as much as possible is incredibly important to a developer's sanity. A REPL is a great tool for developers wanting to achieve just that. Developers are most productive when they can see the results of their work immediately. With a Java REPL, developers will be able to write code, execute that code, and then continue to evolve their code on-the-fly without having to exit in order to run a build and so forth. 


虽然很多用Java编写的程序和系统已经远远超出了交互式命令行环境可以处理的范围, 但是在 JDK 中内置一个 REPL，就会让你不论在什么时候都可以随手用它，而且使用频率应该是很高的。 事实上JShell开放了API，使得 IDE 环境可以非常方便地集成进来。当然，需要等到大多数IDE都支持才比较现实，而开发者也许有更新到最新的IDE版本!


While many of the systems using Java are beyond the complexity of what could be handled by an interactive REPL, the mere presence of a REPL in the JDK means that someone, somewhere will find an amazing use case for it in no time. The fact that JShell exposes an API basically ensures that IDE developers are going to integrate this REPL into the tools we use to write code. Just wait till the Java REPL is part of every IDE!

<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

## 开始使用JShell

Get started with JShell

需要解释一下, 在写这篇文章时, JDK 9  开发者预览版中并不包含 Kulla 项目, 因为 REPL环境还处于开发阶段。所以你需要克隆 Mercurial 项目的源代码, 编译JDK, 还要自己编译JShell。


It's important to realize that using the in-development REPL, Project Kulla, is not for the faint of heart. Kulla, aka JShell, isn't part of the JDK 9 preview bundle at the time of writing, so you'll have to clone a Mercurial project, compile the JDK, and compile JShell yourself. 


这个过程可能需要几个小时, 特别是如果你对JDK源码不熟的情况下。 必须禁止把警告当成错误, 如果是在 OSX 上编译，请确保已经安装了 XCode 以及 XQuartz 这个  freetype 库。 可以按照下面的步骤来安装和运行 Kulla项目。

Set aside an hour for this process, especially if you aren't normally throwing around JDK source code. You'll have to disable warnings as errors, and if you are building on OSX make sure that you've installed XCode along with XQuartz for the freetype library. Follow the instructions below to install and run Project Kulla in your Java development environment.


### 1.安装Java 9

使用 JShell，需要下载并安装 [最新的Java 9开发者早起预览版](https://jdk9.java.net/download/) 。 安装完成后需要设置环境变量 **`JAVA_HOME`** , 接着可以在命令行运行 `java - version` 来看看配置是否正确。 这中间有一些坑，特别是在 OSX 系统上, 所以特别提醒一下!

To run JShell you'll need to [download and install the latest early access preview build for Java 9](https://jdk9.java.net/download/). Once you've downloaded Java 9 set your **`JAVA_HOME`** environment variable and run java –version to verify your installation. This can be a pain, particularly on OSX, so it's worth double checking!

### 2. 安装Kulla Mercurial和项目

Kulla 也是一个 OpenJDK项目, 所以你需要 [克隆 Mercurial 仓库](https://mercurial.selenic.com/downloads)并执行编译。

然后需要 [克隆 Kulla 仓库](http://hg.openjdk.java.net/kulla/dev/kulla) :

	hg clone http://hg.openjdk.java.net/kulla/dev/kulla

接着是配置编译环境:

	cd kulla
	bash ./configure --disable-warnings-as-errors
	make images


### 3. 编译并运行REPL

下面是编译 REPL 的脚本:

	cd langtools/repl;
	bash ./scripts/compile.sh


通过下面的脚本来运行:

	bash ./scripts/run.sh 

前面我们也解释过了, Java 的 REPL 功能还没到一般人可以使用的阶段, 但我们这些程序员可以抢先玩一玩!


## 执行数学运算


初始的示例JShell能做什么,让我们评估使用一些简单的表达式 java.lang.Math :

清单1。 评估与REPL数学表达式


	$ bash ./scripts/run.sh 
	|  Welcome to JShell -- Version 0.710
	|  Type /help for help
	
	-> Math.sqrt( 144.0f );
	|  Expression value is: 12.0
	|    assigned to temporary variable $1 of type double
	
	-> $1 + 100;
	|  Expression value is: 112.0
	|    assigned to temporary variable $2 of type double
	
	-> /vars
	|    double $1 = 12.0
	|    double $2 = 112.0
	
	-> double val = Math.sqrt( 9000 );
	|  Added variable val of type double with initial value 94.86832980505137


在这里我们评估表达式,发现数的平方根,然后把两个数字加起来。 这不是最复杂的代码,但是你应该注意 / var 命令给我们的能力JShell会话中创建的变量列表。 我们可以引用未赋值的表达式的值使用美元符号($)符号。 最后我们可以创建一个新的变量并为其分配一个值。

## 定义一个方法

现在它变得更加有趣。 在这个例子中,我们定义了一个方法来计算斐波那契序列。 定义的方法后,我们查看哪些方法的定义 /方法 命令。 最后,我们执行一段代码来遍历一个数组并打印序列中的前几个数字。

清单2。 计算斐波那契序列


	$ bash ./scripts/run.sh 
	|  Welcome to JShell -- Version 0.710
	|  Type /help for help
	
	-> long fibonacci(long number) {
	>>       if ((number == 0) || (number == 1))
	>>          return number;
	>>       else
	>>          return fibonacci(number - 1) + fibonacci(number - 2);
	>>    }
	|  Added method fibonacci(long)
	
	-> /methods
	|    fibonacci (long)long
	
	-> fibonacci( 12 )
	|  Expression value is: 144
	|    assigned to temporary variable $1 of type long
	
	-> int[] array = { 1,2,3,4,5,6,7,8 };
	|  Added variable array of type int[] with initial value [I@4f4a7090
	
	-> for( long i : array ) { System.out.println(fibonacci( i )); }
	1
	1
	2
	3
	5
	8
	13
	21



在同一JShell会话我可以重新定义斐波那契法的定义和执行相同的代码。 这样你可以使用REPL快速执行,修改和测试新算法。

清单3。 REPL的重用


	-> long fibonacci(long number) {
	>>     return 1;
	>> }
	|  Modified method fibonacci(long)
	
	-> for( long i : array ) { System.out.println(fibonacci( i )); }
	1
	1
	1
	1
	1
	1
	1


## 定义一个类

下面的示例演示了如何定义一个完整的类在JShell然后表达式中引用这个类——所有没有离开REPL。 动态地创建和测试代码的能力让你快速试验和迭代的新代码。

清单4。 动态类定义

	MacOSX:repl tobrien$ bash ./scripts/run.sh 
	|  Welcome to JShell -- Version 0.710
	|  Type /help for help
	
	-> class Person {
	>>     public String name;
	>>     public int age;
	>>     public String description;
	>> 
	>>     public Person( String name, int age, String description ) {
	>>         this.name = name;
	>>         this.age = age;
	>>         this.description = description;
	>>     }
	>> 
	>>     public String toString() {
	>>         return this.name;
	>>     }
	>> }
	|  Added class Person
	
	-> Person p1 = new Person( "Tom", 4, "Likes Spiderman" );
	|  Added variable p1 of type Person with initial value Tom
	
	-> /vars
	|    Person p1 = Tom


虽然动态定义类的能力是强大的它不像开发人员要求写大,多行定义在一个交互式shell。 这就是的概念 历史 和被加载和保存REPL的状态开始变得重要。 与 /历史 命令可以列出所有的语句和表达式在REPL评估。

清单5。 知道你/历史


	-> /history
	
	class Person {
	    public String name;
	    public int age;
	    public String description;
	    public Person( String name, int age, String description ) {
	        this.name = name;
	        this.age = age;
	        this.description = description;
	    }
	    public String toString() {
	        return this.name;
	    }
	}
	Person p1 = new Person( "Tom", 4, "Likes Spiderman" );
	Person p2 = new Person( "Zach", 10, "Good at Math" );
	/vars
	p1
	p2
	/history


然后您可以保存您的REPL历史文件和名称,可以稍后再加载。 这里有一个例子:


	-> /save output.repl
	
	-> /reset
	|  Resetting state.
	
	-> /vars
	
	-> /open output.repl
	
	-> /vars
	|    Person p1 = Tom
	|    Person p2 = Zach


的 /保存 命令将REPL历史保存到一个文件, /重置 命令重置REPL的状态, /开放 命令读取文件并执行州REPL。 保存和打开功能使您能够设置非常复杂的REPL脚本,您可以使用配置不同的REPL场景。

编辑类定义

JShell还可以设置自动启动定义文件和负载定义。 你可以跳来跳去REPL历史和编辑命名源条目。 例如,如果我想修改的定义 人 从这个例子中我可以使用类 /列表 和 /编辑 命令。

清单6。 修改人



	-> /l
	
	   1 : class Person {
	           public String name;
	           public int age;
	           public String description;
	           public Person( String name, int age, String description ) {
	               this.name = name;
	               this.age = age;
	               this.description = description;
	           }
	           public String toString() {
	               return this.name;
	           }
	       }
	   2 : Person p1 = new Person( "Tom", 4, "Likes Spiderman" );
	   3 : Person p2 = new Person( "Zach", 10, "Good at Math" );
	   4 : p1
	   5 : p2
	
	-> /edit 1


运行这个 /编辑 命令加载一个简单的编辑,我可以改变类定义和类立即更新。

有什么大不了的?

Clojure或LISP程序员谈论他们如何发展每天,和你会发现他们在REPL代码。 他们不写脚本,然后执行它们一样他们花费了大量的开发时间改变代码交互。 如果你有几个小时空闲,问一个Scala或Clojure REPL开发人员。 它们是如何工作的。

从Scala或Clojure Java的另一种语言。 Java开发人员支出的日子不专注于单一的LISP程序可能包含整个结构在一些语句。 大多数Java程序需要安装正常运行,虽然最近的更改语言减少了系统的行数用Java编写我们还测量我们的系统的复杂性在成千上万行代码。 一个简单的 人 上面列出的例子不是有用的代码,和最有用的代码在Java中带有的复杂性将很难适应REPL-based编程环境。

Scala和Clojure开发人员实践的东西 Clojure编程 作者 底盘Emerick “迭代开发”这并不依赖于一个基于文件的工作流。 Java开发人员依赖的库,复杂的依赖关系层次结构,如Tomcat或TomEE容器。 因为这个原因我不预测,REPL-oriented IDE编程将取代传统的Java开发。 相反,我看到Java REPL提供几个不同的利益和机遇。

1。 学习Java :因为Java程序开发人员需要如此多的设置可以挑战学习快速理解语法的语言。 Java 9的REPL将成为主要方式,新的开发人员面对的基本语法。

2。 尝试新的图书馆 :Java有数百个有用的开源库,从数学库操作日期和时间。 没有REPL,每当一个开发者想要了解一个新图书馆他们不可避免地造成了一些一次性与通常的类” 公共静态孔隙主要 ”仪式。 REPL你能火起来,玩没有这个开销。

3。 快速原型 :这是迭代接近大多数Clojure和Scala开发人员是如何工作的,但如果你工作在一个集中的问题,一个REPL便于迭代修改类和算法。 REPL你不必等待一个构建完成,你可以快速调整一个类的定义,重置你的REPL,再试一次。

4。 与构建系统的集成 :它提供了一个交互式“壳”模式,和Maven社区运送过去类似的工具。 开发人员希望减少构建复杂性可以探索使用REPL作为工具来安排其他系统。

我最后的2摄氏度

我看到Java REPL的东西会影响日常的发展在未来的几年里,对那些升级到Java 9。 我也认为Java社区将需要时间来完全适应新的发展方式和理解REPL提供的机遇和挑战。 我不期望,大多数Java开发人员将过渡到REPL-oriented开发像Clojure编程堂兄弟,但我确实认为,我们将看到REPL影响新的开发人员学习Java的方式。 随着新的Java开发人员首次遇到Java在REPL,毫无疑问,它将会影响我们如何构建和基于Java的系统原型。








### 参考文章:


原文链接:  [What REPL means for Java](http://www.javaworld.com/article/2971152/core-java/what-repl-means-for-java.html)


原文日期: 2015年08月13日

翻译日期: 2015年09月05日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

