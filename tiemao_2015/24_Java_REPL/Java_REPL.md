# Java9: REPL环境与编程


### 副标题: Java 9开始提供 REPL环境 —— JShell 有可能会改变程序员Java的使用和学习方式

> 译者注: 推荐一个在线的REPL演示环境: [Java WEB控制台 http://www.javarepl.com/console.html](http://www.javarepl.com/console.html)

> 你可以在里面试着执行一些简单的Java代码,比如:

> `System.out.println("See See REPL")`

> `System.getProperty("user.name")`

> `2 + 2 * 5`



**有个段子说： 为什么程序员看起来整天都无所事事的呢? 因为他们正在编译代码。。。**

> 如果有一个交互式的控制台有什么好处呢? 译者的体验是, 在测试字符串，正则等很简单的程序时，简直是太方便了.


也许你曾写过 Clojure 和 Scala 代码, 或者你还用 LISP 写过程序。 如果你曾深爱过他们, 那么你肯定和 REPL 相处得相当愉快了。 **REPL**, 全称为 `read-eval-print-loop`, 是一个shell 界面，用来逐行读取输入内容, 计算输入内容的值, 然后打印输出执行结果。 这是一种很友好的即时交互环境, 我很喜欢!


在使用 REPL 时, 采用的是交互式的代码编写,输入完后立即执行。 预计在2016年Java 9 发布时,将会 [提供一个功能齐全的REPL环境](http://www.javaworld.com/article/2955273/java-platform/java-9-repl-faster-feedback.html) ，名字叫做 JShell(代号为Kulla)。 本文先简单介绍 Java REPL，然后探讨将来编写Java代码时, 可能会如何使用它。


## 神马！ Java 居然没有 REPL 环境?


对于像 Java 这种稳定广泛的语言那是必须要有一个REPL环境呀! 但事实上并不是所有语言都支持REPL，比如Java(以前)就没有。 可以说,比起其他语言来说,Java的开发人员要多得多,也就更应该提供REPL环境。 Java 也有类似于 REPL 的环境: [Java BeanShell](http://www.beanshell.org/), 但这个项目功能一直不全，而且只支持部分 Java 语法。


## REPL 可以减少思维转向时间


缩短思维转向时间并即使反馈对于程序员的健康来说非常重要。 对于想要这种特性的程序员来说, REPL 是一种非常给力的工具。 一般来说，可以立即看到执行结果对人类大脑来说是效率最高的编程方式。 有了Java REPL 环境, 开发者就可以编写代码,执行, 然后继续编写。 不再需要打断思维, 去编译一下，打包一下，执行一下，然后，奇怪，刚才想到哪儿了?  


虽然很多用Java编写的程序和系统已经远远超出了交互式命令行环境可以处理的范围, 但如果在 JDK 中内置一个 REPL，那么我们不论在什么时候都可以很方便地使用，当然使用频率应该是很高的。 事实上JShell也会开放API，让 IDE 环境可以非常方便地把它集成进来。当然，也需要大多数IDE支持才比较现实，而开发者也需要使用最新的IDE!

## 开始使用JShell


需要解释一下, 在写这篇文章时, JDK 9 开发者预览版(preview bundle)中并不包含 Kulla 项目, 因为 REPL 还处于开发阶段。所以你需要克隆 Mercurial 里面的项目源码, 编译JDK, 还要自己编译JShell。


这个过程可能需要几个小时, 特别是如果你对JDK源码不熟的情况下。 必须把警告当成错误这个选项给禁用掉, 如果是在 OSX 上编译，还要确保已经安装了 XCode 以及 XQuartz 这个 freetype 库。 可以按照下面的步骤来安装和运行 Kulla项目。


### 1.安装Java 9

使用 JShell，需要下载并安装 [最新的Java 9开发者预览版](https://jdk9.java.net/download/) 。 安装完成后需要设置环境变量 **`JAVA_HOME`** , 接着可以在命令行执行 `java - version` 来检查配置是否正确。 这中间有一些坑，特别是在 OSX 系统上, 所以特别提醒一下!

### 2. 安装Kulla Mercurial和项目

Kulla 是一个 OpenJDK项目, 使用的是分布式版本控制系统 Mercurial , 所以需要 [克隆 Mercurial 仓库](https://mercurial.selenic.com/downloads)并执行编译。

接着是 [克隆 Kulla 库](http://hg.openjdk.java.net/kulla/dev/kulla) :

	hg clone http://hg.openjdk.java.net/kulla/dev/kulla

然后配置编译环境:

	cd kulla
	bash ./configure --disable-warnings-as-errors
	make images


### 3. 编译并运行REPL

下面是编译 REPL 的命令:

	cd langtools/repl
	bash ./scripts/compile.sh


用下面的脚本来启动:

	bash ./scripts/run.sh 

前面也解释过了, Java 的 REPL 功能还没到一般用户可用的阶段, 但我们这些程序员可以抢先玩一玩!


## 执行数学运算


JShell 能做什么? 先来做一个简单的数学运算吧, 使用现成的 `java.lang.Math` 库:


> **清单1** 用 REPL 来计算数学表达式


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


在这里我们计算了一个数的平方根, 然后把两个数加起来。 这并不复杂, 可以发现, `/var` 命令用来显示在 JShell 会话中创建的变量列表。 还可以通过美元符号($) 来引用未赋值表达式的值。 最后创建了一个新的变量并为其赋值。【Web控制台不支持这种斜线开头的命令】


## 定义方法


下面我们要做点有趣的事。 在这个例子中,我们定义一个方法来计算斐波那契数列(Fibonacci sequence)。 在方法定义以后, 我们可以用 `/methods` 命令来查看会话中定义的方法。 最后,我们代码来调用该函数, 打印出这些数字对应的序列。

>**清单2** 计算斐波那契数列


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



在同一个 JShell 窗口中也可以重新定义 Fibonacci 方法并执行同样的代码。 因为支持这种迭代替换的特性，我们可以用 REPL 快速执行,修改和测试新的算法。

> **清单3** REPL 中重写方法


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

下面的代码演示了如何在JShell中定义一个完整的类，然后在表达式中引用这个类 —— 整个过程全部都在 REPL 中执行。在这里我们可以动态地创建和测试代码, 并且能试验和替换新的代码。

>**清单4** 动态地定义类

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


虽然动态定义类的功能很强大, 但并不符合我们开发人员的需求，毕竟在一个交互式的shell环境中去写很长很长的代码是很土的做法。 这就引申出了 **历史记录** 的概念，在启动 REPL 时可以加载以前保存的状态。 使用 `/history` 命令可以列出所有在REPL 中执行过的语句和表达式。

> **清单5** 查询历史记录 /history


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


我们还可以将 REPL历史记录保存到某个文件中, 以后可以重复加载。 示例如下:


	-> /save output.repl
	
	-> /reset
	|  Resetting state.
	
	-> /vars
	
	-> /open output.repl
	
	-> /vars
	|    Person p1 = Tom
	|    Person p2 = Zach


`/save` 命令将REPL历史保存到文件中, `/reset` 命令重置REPL的状态, 而 `/open` 命令则用来读取并在 REPL中执行某个文件。 通过保存和打开功能，程序员可以设置比较复杂的REPL脚本, 用来配置不同的REPL场景。


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


如果去看 Clojure 或 LISP 程序员如何写代码, 你会发现他们主要是在REPL环境中做开发。 而不是像Java一样,先写代码,编译构建，然后才能执行，说实话写Java程序时浪费了大量的时间来做交互。 如果你有空的话, 可以和 Scala 或Clojure 程序员聊一聊 REPL，看看他们是怎么干活的。

与 Scala、Clojure 不同，Java 是另一种不同的语言。 Java 开发人员不会花太多时间来关注某几行普通的代码，而LISP程序的逻辑可能就只包含在某几行核心代码中。 Java程序大多需要先进行安装，配置好了才能正常运行, 虽然最新版的语言减少了要编写的代码行数，但我们总是随随便便就能用Java写出上万行代码的复杂系统。 上面所举例的 `Person` 类并没有多大用处, 在Java中最有用的代码往往非常复杂,也很难在 REPL 这种环境中写完。

Scala和Clojure 开发人员的编程环境被 《Clojure Programming》的作者[Chas Emerick](http://cemerick.com/) 称为 “迭代开发(iterative development)”， 因为不需要依赖文件系统。 而Java 程序需要依赖很多的类库, 有很复杂的依赖, 可能还要依赖容器(如Tomcat或TomEE)。 因此我认为, 面向 REPL 的编程方式并不会取代传统的IDE编程。 但是,我觉得Java 的 REPL在下面这些地方会用得比较好。



####1. 学习Java 

因为Java开发需要很多配置。对于初学者来说，使用 REPL 可以快速理解语法和基本概念。 Java 9的REPL将会成为新入门程序员的快速入门方式。

####2. 学习和尝试新的类库

Java有上百个好用的开源类库, 例如数学运算，日期时间库等等。 在没有REPL的日子里, 每次都要写一堆 "public static void main" 才能进行测试。但如果有了命令行交互环境，那就只要输入关键的代码就能看到执行结果。

####3. 快速原型 

这与 Clojure 和 Scala 开发差不多, 如果需要集中精力搞定某个问题, 使用REPL 能很方便地进行迭代修改类和算法。不必等待编译完成, 就可以快速调整一个类的定义,重置REPL, 然后就可以再试一次。【比如正则匹配，字符串截取等等】

####4. 与 build 工具集成 

Gradle 提供了一个交互式的 “shell” 模式, Maven社区也推出了类似的工具。 我们可以通过REPL减少构建的复杂性，同时控制其他系统的运行。


## 未来

我认为在未来几年，随着Java9的流行，REPL会越来越多地影响我们开发和编程的方式。 当然Java社区也需要时间来慢慢适应新的开发方式，总结和跨越 REPL 中的美好与陷阱。 

我并不认为多数Java程序员会经常使用 REPL 来做开发，但新入行的程序员将会慢慢习惯 REPL 环境，作为他们学习Java的方式。 随着新的Java程序员和 REPL度过一段美好的时光, 毫无疑问, 它将会改变我们构建和开发Java程序的模式。



### 参考文章:


原文链接:  [What REPL means for Java](http://www.javaworld.com/article/2971152/core-java/what-repl-means-for-java.html)


原文日期: 2015年08月13日

翻译日期: 2015年09月16日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

