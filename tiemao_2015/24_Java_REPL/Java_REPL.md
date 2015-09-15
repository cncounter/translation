# Java9: REPL环境与编程

What REPL means for Java

> 译者注: 推荐一个在线的REPL演示环境: [Java WEB控制台 http://www.javarepl.com/console.html](http://www.javarepl.com/console.html)

> 你可以在里面试着执行一些简单的Java代码,比如:

> `System.out.println("See See REPL")`

> `2 + 2 * 5`


### 副标题: Java 9即将支持 REPL, JShell 有可能会改变程序员学习和使用 Java 的方式


> **有个段子说： 为什么程序员看起来整天都无所事事的呢? 他们正在编译代码。。。**

> 如果有一个交互式的控制台有什么好处呢? 译者的体验是, 在测试字符串，正则等很简单的程序时，真的是太方便了.

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

Kulla 也是一个 OpenJDK项目, 使用的是分布式版本控制系统 Mercurial , 所以你需要 [克隆 Mercurial 仓库](https://mercurial.selenic.com/downloads)并执行编译。

然后才是 [克隆 Kulla 仓库](http://hg.openjdk.java.net/kulla/dev/kulla) :

	hg clone http://hg.openjdk.java.net/kulla/dev/kulla

接着配置编译环境:

	cd kulla
	bash ./configure --disable-warnings-as-errors
	make images


### 3. 编译并运行REPL

下面是编译 REPL 的脚本:

	cd langtools/repl;
	bash ./scripts/compile.sh


通过下面的脚本来运行:

	bash ./scripts/run.sh 

前面也解释过了, Java 的 REPL 功能还没到一般用户可用的阶段, 但我们这些程序员可以抢先玩一玩!


## 执行数学运算


JShell 能做什么, 先来做一些简单的数学运算吧, 使用现成的 `java.lang.Math` 库:

For an initial example of what JShell can do, let's evaluate some simple expressions using `java.lang.Math`:

> 清单1 用 REPL 来计算数学表达式


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


在这里我们计算了一个数的平方根, 然后是把两个数加起来。 这不是很复杂, 但你也应该看到, `/var` 命令可以显示在 JShell 会话中创建的变量列表。 我们还可以通过美元符号($) 来引用未赋值表达式的值。 最后创建了一个新的变量并为其赋值。【Web控制台还不支持这种斜线的命令】


## 定义方法


下面我们要做点有趣的事。 在这个例子中,我们定义一个方法来计算斐波那契数列(Fibonacci sequence)。 在定义方法以后, 我们可以用 `/methods` 命令来查看有会话中定义的方法 。 最后,我们用一段代码来执行该函数, 打印出这些数字对应的序列。

>清单2 计算斐波那契数列


	$ bash ./scripts/run.sh 
	|  Welcome to JShell -- Version 0.710
	|  Type /help for help
	
	-> long fibonacci(long number) {
	       if ((number == 0) || (number == 1))
	          return number;
	       else
	          return fibonacci(number - 1) + fibonacci(number - 2);
	    }
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



在同一个 JShell 会话窗口中可以重新定义 Fibonacci 方法并执行同样的代码。 这样就可以通过 REPL快速执行,修改和测试新的算法了。

> 清单3 REPL 中重写方法


	-> long fibonacci(long number) {
	     return 1;
	   }
	|  Modified method fibonacci(long)
	
	-> for( long i : array ) { System.out.println(fibonacci( i )); }
	1
	1
	1
	1
	1
	1
	1


## 定义类

下面的代码演示了如何在JShell中定义一个完整的类，然后在表达式中引用这个类 —— 整个过程全部在 REPL 中执行。在里面你可以动态地创建和测试代码, 让你能试验和替换新的代码。

>清单4 动态地定义类

	MacOSX:repl tobrien$ bash ./scripts/run.sh 
	|  Welcome to JShell -- Version 0.710
	|  Type /help for help
	
	-> 	class Person {
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
	|  Added class Person
	
	-> Person p1 = new Person( "Tom", 4, "Likes Spiderman" );
	|  Added variable p1 of type Person with initial value Tom
	
	-> /vars
	|    Person p1 = Tom


虽然动态定义类的功能很强大, 但是不怎么符合开发人员的需求，毕竟在一个交互式shell中去写很长,很多行的代码是一件很蠢的事。 这就引申出了 历史记录 的概念，在启动 REPL 时加载之前保存的状态就变得很有用了。 使用 `/history` 命令可以快速列出所有在REPL 中运行过的语句和表达式。

> 清单5 查询历史记录 /history


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


你还可以保存 REPL历史记录到某个文件之中, 以后可以再次加载。 示例如下:


	-> /save output.repl
	
	-> /reset
	|  Resetting state.
	
	-> /vars
	
	-> /open output.repl
	
	-> /vars
	|    Person p1 = Tom
	|    Person p2 = Zach


`/save` 命令将REPL历史保存到文件中, `/reset` 命令重置REPL的状态, 而 `/open` 命令则用来读取并在 REPL中执行某个文件。 通过保存和打开功能使得程序员可以设置比较复杂的REPL脚本, 以便用来配置不同的REPL场景。

## 中途修改类的定义

JShell还可以设置初始化配置文件并自动加载。 你可以随意编辑源码条目。 例如, 比如想要修改前面定义的 `Person` 类, 就可以使用类 `/list` 和 `/edit` 命令。

>清单6 修改Person



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


执行 `/edit` 命令会打开一个简单的编辑器, 在里面可以改变类的定义,然后类会被立即更新。


## 这算什么高科技?


如果问 Clojure 或 LISP 程序员如何写代码, 你会发现他们都是在REPL环境中做的开发。 而不是先写代码,然后再去执行， 因为这样会浪费大量的时间来做交互。 如果你有空的话, 可以和 Scala 或Clojure 程序员聊一聊 REPL。看看他们是如何工作的。

与 Scala或Clojure 不同，Java 是另一种不同的语言。 Java 开发人员不会花太多时间来关注某几行普通的代码，而LISP程序可能就只包含在这几句话之中。 大多数Java程序都需要进行安装，配置才能正常运行, 虽然最新版的语言减少了代码的行数，但我们还是随随便便就能用Java编写出上万行代码的复杂系统。 上面所列出的 Person 类并没有多少用处, 在Java中最有用的代码往往非常复杂,也很难在 REPL-based 编程环境中书写。

Scala和Clojure 开发人员的编程环境被 《Clojure Programming》的作者[Chas Emerick](http://cemerick.com/) 称为 “迭代开发(iterative development)”， 不需要依赖文件系统。 但是 Java 开发需要依赖很多类库, 会有很复杂的依赖, 还要依赖容器(如Tomcat或TomEE)。 因此我想说, 面向 REPL 的这种编程方式并不会取代传统的 IDE编程。 相反,我觉得Java 的 REPL 用在下面这些地方会比较好。



####1. 学习Java 

因为Java开发需要有一些配置。所以对于初学者来说，使用 REPL 可以快速理解语法和基本的概念。 Java 9的REPL将成为新入门程序员的快速入门方式。

####2. 学习新的类库

Java有上百个好用的开源类库, 例如数学运算库，日期时间库等等。 在没有REPL的日子里, 每次都要写一堆 "public static void main" 来进行测试。但如果有了命令行交互环境，那么只要简单的输入关键代码就能看到结果。

####3. 快速原型 

这与 Clojure 和 Scala 开发差不多, 如果需要攻克一个核心问题, 使用REPL 能很方便地进行迭代修改类和算法。不必等待编译完成, 就可以快速调整一个类的定义,重置REPL, 再试一次。【比如正则，字符串范围等等】

####4. 与 build 工具集成 

Gradle 提供了一个交互式 “shell” 模式, Maven社区也推出过类似的工具。 开发人员可以通过REPL减少构建的复杂性，同时控制其他系统的运行。


## 未来

我认为在未来几年，随着Java9的发布和流行，REPL会越来越多地影响我们的开发和编程模式。 我也认为Java社区需要时间来完全适应新的开发方式，总结和跨越 REPL 中的美好与陷阱。 

我并不觉得多数Java程序员会过渡到经常使用 REPL 的开发模式，但我确实认为,新入行的程序员将会慢慢习惯 REPL 环境，深切地影响到他们学习Java的方式。 随着新的Java开发人员与 REPL一起度过一些美好的时光, 毫无疑问, 它将会影响我们如何构建和建模 Java程序。






### 参考文章:


原文链接:  [What REPL means for Java](http://www.javaworld.com/article/2971152/core-java/what-repl-means-for-java.html)


原文日期: 2015年08月13日

翻译日期: 2015年09月05日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

