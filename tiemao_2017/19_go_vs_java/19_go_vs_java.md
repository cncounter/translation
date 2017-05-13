# Java vs. Google's Go: An epic battle for developer mind share

# Java和Go语言之争:史诗争夺开发者分享


The upstart Go is giving stalwart Java a run for its money on greenfield server-side web apps

暴发户去给坚定Java竞选资金新建服务器端web应用程序


Go vs. Java isn’t a well-matched battle between equals. One is a monstrous heavyweight that has dominated the industry for years. The other is a scrappy, lightweight newcomer that shows plenty of youth and promise but has only a few punches.

去和Java之间并不是一个和谐的战斗=。是一个巨大的重量级人物,一直占据着行业多年.另一个是不连贯的,轻量级的新人显示大量的青年和承诺,但只有几拳。


Java and Go also tackle different niches. One is aimed squarely at server-side web apps, an area where the other was once a major player. The other has outgrown life in the racks and is now a popular choice for devices.

Java和也去解决不同的细分市场。一个是直接针对服务器端web应用程序,一个领域另一个曾经是一个主要参与者.


But not everyone has moved away from Java on the server side of web applications, territory Go is attacking, eating away at Java’s base. And the switch isn’t a terribly great leap, as the two are similar in many aspects. Both are loving homages to C, if not underneath, at least on the surface where many developers spend their lives grappling with syntax. They are both straightforward and imperative with enough structural similarities that it’s not hard to convert code between the two. (The [TardisGo](http://tardisgo.github.io/) project, for instance, is one tool that will turn Go into Java, C#, or JavaScript.)

但并不是每个人都能从Java web应用程序的服务器端,领土攻击,蚕食Java的基础.和开关并不是一个很伟大的飞跃,作为两个在许多方面是相似的.都是爱的敬意到C,如果不是下面,至少从表面上看,许多开发人员一生都纠结于语法.他们都是简单,必须有足够的结构相似性,不难两者之间转换的代码。([TardisGo](http://tardisgo.github.io /)项目,例如,是一个工具,它将进入Java,c#,或JavaScript)。


Consider this a cage match that pits two cousins from different sides of the programming tracks competing for your next application stack.

考虑这个笼子里比赛,来自不同的两个堂兄弟编程轨迹争夺你的下一个应用程序堆栈。


### Java’s long history brings network effects that help everyone

### Java的悠久历史带来的网络效应,帮助每一个人


Java has been around since 1995, attracting more mind share each year. Everything from tiny embedded processors to massive server chips run Java quickly and efficiently thanks to its agile just-in-time virtual machine. Android has become a boon for Java, as the most popular platform in the mobile world by far. That’s why Java remains top dog on rankings like the [Tiobe index](https://www.tiobe.com/tiobe-index/) and [PyPL](http://pypl.github.io/PYPL.html). This wide adoption means there is plenty of code for reuse, and much of it is open source to simplify your life. You’ll be standing on the shoulders of giants when you start stitching together the bazillion lines of freely available Java code.

Java已经存在自1995年以来,每年吸引更多的心灵分享.从微型嵌入式处理器大规模服务器芯片运行Java快速高效地由于其敏捷即时虚拟机.Android已经成为Java的一个福音,作为最受欢迎的平台在移动世界。这就是为什么Java仍然是排名最高的狗像Tiobe索引(https://www.tiobe.com/tiobe-index/)和(PyPL)(http://pypl.github.io/PYPL.html)。这广泛的采用意味着有大量的代码重用,和它是开源的简化你的生活.你将站在巨人的肩膀当你开始缝合在一起的无数行免费的Java代码。


### Go’s short history makes it instantly relevant

### 去相关的短暂历史使它立即


Sure, it’s cool to snarf free Java code from the web. But wait, it’s written for Java 1.3, and your boss wants you to use Java 1.8. Don’t worry, you can probably get it working again with a bit of rewriting. Let’s move that deadline again ... and again. Old code may seem like a gift, but it’s not always a slam dunk, and sometimes it’s more trouble than it’s worth.

当然,这很酷,狼吞虎咽从网上免费的Java代码。但是,等等,为Java 1.3写的,你的老板想要你使用Java 1.8.别担心,你可以得到它的重写再次工作。让我们再最后期限…一次又一次.旧代码看起来就像一个礼物,但不总是一个扣篮,有时比值得更多的麻烦。


Go’s short history, on the other hand, means it’s written for today’s web standards. There’s no cruft left over from the days when applets were going to dominate the world. There are no long-forgotten ideas like Java Beans or J2EE sitting around as tempting nuisances. It’s simply new and engineered for how people are building the web today.

短的历史,另一方面,意味着它写今天的web标准。没有繁琐的东西遗留下来的日子applet将主宰世界.没有被遗忘的想法像Java bean或J2EE坐在诱人的滋扰。这仅仅是新的和改造的今天人们如何构建web。


### Java lets you tap other languages

### Java允许您利用其他语言


The JVM is the foundation for [dozens of interesting languages](https://en.wikipedia.org/wiki/List_of_JVM_languages) that depend on Java at runtime. Each can be linked easily to your code, letting you write one part in Kotlin, another in Scala, and maybe glue it all together with Clojure. If you want to use languages like Python, JavaScript, or Ruby, all three can run directly in Java land using emulators that are often the first choice. Java gives you the freedom to let each subteam and subproject choose the right language for the job while still running in the same JVM. You don’t need to use it, but the opportunity is always there.

JVM的基础(许多有趣的语言)(https://en.wikipedia.org/wiki/List_of_JVM_languages),依赖于Java运行时.每个可以轻易联系到你的代码,让你在芬兰湾的科特林写一部分,另一个在Scala中,也许用Clojure粘合在一起.如果您想要使用语言,像Python,JavaScript或Ruby,所有三个可以直接运行在Java中土地使用仿真器通常是首选.Java给你让每个子团队的自由和子项目选择正确的语言的工作,同时在相同的JVM中运行。你不需要使用它,但是机会总是存在。


### Go promotes harmony

### 去促进和谐


Yes, you can knit together a superclever application that mixes in the best of the new and the trendy, choosing the absolutely best language for each part of your wonderful magnum opus on the JVM. You can even mix in oldies like Rexx and Common Lisp to honor their place in ’70s-era computing history. Good luck finding someone with the same tastes and talents who will maintain this Tower of Babel. Aside from mixing in a few well-crafted libraries, it’s not always a good plan to emulate Rube Goldberg when designing good code. Sometimes it’s expedient and necessary, but that doesn’t mean it’s a good plan. Harmony and consistency make life easier for all. The Go world delivers that.

是的,你可以一起编织一个superclever应用程序混合在最好的新时尚,选择绝对最好的语言对于每个你美妙的代表作在JVM上的一部分.您甚至可以混合为老歌Rexx和Common Lisp的70年代的计算历史上他们的地方.祝你好运找到有相同的品味和人才会保持这通天塔.除了混合在几个精心设计库,这并不总是一个好的计划效仿Rube Goldberg在设计好的代码.有时是有利的和必要的,但这并不意味着这是一个很好的计划。和谐和一致性使生活更容易。世界去了。


### Java’s JVM is lean and powerful

### Java的JVM精益和强大


Java class files are often measured in hundreds of bytes. The JAR files that link them together are usually only a few megabytes. Java code itself is small because the virtual machine holds so much power for memory management and security. If you plan to move around lots of code, it makes sense to leave the functionality in a common runtime tool. There are other advantages to centralization. If a security problem appears in the lowest levels of Java, there’s no need to recompile and relink all your code. Many problems are solved by upgrading the JVM alone.

Java类文件通常以几百字节。JAR文件链接在一起的通常只有几兆字节.Java code itself is small because the virtual machine doesn so much power for the memory management, and security.如果你打算移动大量的代码,离开是有意义的功能在一个共同的运行时工具。还有其他优势集中.如果安全问题出现在Java的最低水平,不需要重新编译和重新编译所有的代码。很多问题都解决了升级JVM。


### Go creates the complete package

### 创建完整的包


The JVM is wonderful until you find that you have the wrong version installed. If you want to run a JAR packed with Java 1.8, but have only the 1.6 version of the JVM, you’re not going anywhere until you find it. The Go compiler produces binaries that are ready to run. Yes, they’re a bit big, but that’s because Go adds all the extra code into the binary for you. It’s all there in one easy package.

JVM是美妙的,直到你发现你安装了错误的版本。如果你想要运行一个罐子里挤满了Java 1.8,但只有1.6版本的JVM,你不会在任何地方,直到你找到它。去编译器生成的二进制文件,已经准备好运行.是的,他们有点大,但那是因为去将所有额外的代码添加到二进制。这都是在一个简单的包。


### Java makes threads dead simple

### Java使线程死简单


Getting various parts of a program to run independently is no easy task. Java won early fans because its model for threads was simple enough to understand while powerful enough to be useful. The JVM does a good job mapping threads to different cores on the machine. It’s not easy to do, but that’s because of the complexity of the problem, not Java’s. Go users may love their goroutines and channels, but they add another knotty layer of complexity onto an already gnarly mess. You’ll find yourself asking whether it’s a green thread or an OS thread. Then you’ll wonder about the complexity of the synchronization channels. Java is more straightforward.

让程序的不同部分独立运行并不是一件容易的任务。早期Java赢得球迷,因为它的线程模型简单,容易理解,而强大到足以是有用的.JVM线程很好地映射到不同的处理器的机器上。这并不容易,但由于问题的复杂性,而不是Java的.用户可能喜欢他们了goroutine和渠道,但他们添加另一个棘手的层复杂性上已经粗糙的混乱。你会发现自己问是否绿色线程或者一个操作系统线程.然后你会怀疑同步信道的复杂性。Java是更简单。


### Go lightens the thread load, intelligently

### 去减轻线程负荷,聪明


Java’s threads and synchronization primitives may do the job, but at a heavy cost. Creating and destroying threads is so laborious and memory-intensive that Java programmers are always recycling them with thread pools. Java has lost traction on the server because each hit on the website needs its own thread. Go has lighter weight and more flexible objects called goroutines that are linked with intelligent synchronization queues called channels. While most servers seem to top out at 1,000 or maybe 10,000 Java threads, people regularly report running hundreds of thousands of goroutines on the same hardware.

Java线程和同步原语可以做这项工作,但在一个沉重的代价.创建和销毁线程很费力而内存密集型,Java程序员总是回收线程池.服务器上的Java已经失去了吸引力,因为每次攻击网站上需要它自己的线程.去有更轻的重量和更灵活的对象称为了goroutine与智能同步队列称为通道.虽然大多数服务器似乎在1000或者10000年Java线程,人们经常报告运行成千上万了goroutine在相同的硬件上。


Go’s model is more sophisticated and modern because it’s younger. The field has learned much about delivering sophisticated multiprocessor algorithms, and you might as well take advantage of it.

的模型是更复杂的和现代的,因为它是更年轻。现场了解提供先进的多处理器算法,你不妨好好利用这个机会。


### Java tools are tried and true

### Java工具都是可靠、真实的


Java’s maturity means you have plenty of great options for tools: Eclipse, IntelliJ, and more. There are sophisticated build tools like Ant and Maven, and the major repositories are optimized to handle Java code. There are also meta code analytics for everything from enforcing code rules to searching for race conditions. They may not work with your version of the code, but they often do. This is why Java is such a juggernaut.

Java的成熟意味着你有足够的选择工具:Eclipse,IntelliJ等等.有复杂的像Ant和Maven构建工具,和主要的存储库进行了优化处理Java代码.也有元从执行代码的代码分析规则来寻找竞态条件。他们可能不会处理你的版本的代码,但是他们经常做.这就是为什么Java是一个巨人。


### Go tools are modern and new

### 现代和新工具


Go was built for the modern multithreaded world, and the code tools are optimized for today’s challenges. There’s a race condition detector built into the debugger and runtime, so it's much simpler to deal with nasty problems. The source code can be audited by golint and a static analyzer called “go vet” that has a number of heuristics for catching bad or even poorly written Go code. All of these and more are optimized for keeping your code running quickly in a multicore machine.

建于现代多线程的世界,今天的代码优化工具所面临的挑战.有竞争条件探测器构建到调试器和运行时,这是更简单处理的问题.源代码可以审计golint和静态分析者称为“兽医”有很多启发式抓坏,甚至不写代码.所有这些和更多的优化,可以让你的代码运行快速的多核机器。


### Java has the constructs you want

### Java有你想要的结构


Over the years, the Java community has wished for many features; some of the time, they’ve been granted. Closures, generics, lambdas, and more have been added. If there’s a new idea in programming languages, there’s a good chance someone has shoehorned it into the Java world. It may not be ideal, but the options are there. You can write the brilliant code your brain imagines thanks to Java’s ongoing evolution.

多年来,Java社区希望许多功能;有些时候,他们被授予。闭包,泛型,λ,更添加了.如果有一个新想法在编程语言中,很有可能有人硬塞到Java世界。它可能不是最理想的,但是那里的选项.您可以编写的代码你的大脑想象由于Java的持续进化。


### Go avoids construct confusion

### 去避免结构混乱


The freedom to use dozens of clever coding structures sounds great until everyone on the team starts doing it. Then reading someone else’s code becomes harder because they’re using clever feature A while your brain is acclimated to clever feature B. The combinatorial confusion compounds with each developer who throws in his or her favorite construct into the mix.

使用许多聪明的编码结构的自由听起来很棒,直到团队中的每个人都开始这样做.然后阅读别人的代码变得更加困难,因为他们使用聪明的特性,你的大脑是适应聪明的特性.组合混乱化合物与每个开发人员扔在他或她最喜欢的构造组合。


Go, on the other hand, was designed to be simple. It was explicitly built so that a good programmer could learn Go in a few hours. There aren’t dozens of clever ideas that fill hundreds of pages of documentation. That may be limiting when writing code, but it’s relaxing when reading code from others on the team. Everyone uses the same idioms because everyone is using the same core features. It’s not merely a team-building experience, like Outward Bound. It’s about efficiency.

去,另一方面,设计简单。这是显式地构建这样一个好的程序员可以学习几个小时.没有许多聪明的想法填满数百页的文档。可能限制在编写代码,但它是团队中的阅读别人的代码时放松.每个人都使用相同的习语,因为每个人都使用相同的核心功能。它不仅仅是一个团队建设经验,拓展训练。它是关于效率。


### Java is mature

### Java是成熟的


Age brings wisdom, maturity, and stability—all the reasons for choosing a broad, well-engineered codebase that’s more than two decades deep. The kids today continue to learn Java at the beginning of their journey with computer science, and the most dominant platform, Android, is built on it. Unless there’s a good reason to change, you should stick with the best.

年龄带来智慧、成熟和稳定的原因选择广泛,精密二十多年深厚的代码库.孩子们今天继续学习Java与计算机科学,他们的旅程的开始和最主要的平台,Android系统,是建立在它.除非有很好的理由去改变,你应该坚持最好的。


### Go is a clean slate

### 是一个干净的石板


Sometimes it’s best to leave the past behind. After all, progress often means starting fresh. Go offers you the opportunity to work with a clean, crisp, modern tool that’s optimized for what we do today. It allows you to enjoy the simplicity and the freedom of leaving the past behind.

有时最好的过去甩在了身后。毕竟,进步往往意味着新的开始.给你一个机会去处理干净,清爽,现代工具,今天我们所做的优化。它可以让你享受简单和留下过去的自由。


And simply because Google started Go to bring some simplicity to coding for their endless server farms, it doesn't mean it can't outgrow it. Some are already using it to [run drones, robots, and other devices](https://gobot.io/). Can smartphones be far behind?


,因为谷歌开始去带一些简单的编码为他们没完没了的服务器农场,这并不意味着它不能超过它.一些已经使用它(运行无人机、机器人和其他设备)(https://gobot.io/)。智能手机还会远吗?




### Related articles

*   [Tap the power of Google's Go language](http://www.infoworld.com/article/3190210/application-development/tap-the-power-of-googles-go-language.html#tk.ifwrs)
*   [The best Go language IDEs and editors](http://www.infoworld.com/article/3171158/application-development/the-best-go-language-ides-and-editors.html#tk.ifwrs)
*   **Review:** [The big four Java IDEs compared](http://www.infoworld.com/article/2863432/java/java-ide-shoot-out-eclipse-vs-netbeans-vs-jdeveloper-vs-intellij-idea.html#tk.rs)
*   [Angular vs. React: An epic battle for developer mind share](http://www.infoworld.com/article/3178012/javascript/angular-vs-react-an-epic-battle-for-developer-mind-share.html#tk.ifwrs)
*   [Java vs. Node.js: An epic battle for developer mind share](http://www.infoworld.com/article/2883328/java/java-vs-nodejs-an-epic-battle-for-developer-mindshare.html#tk.ifwrs)
*   [PHP vs. Node.js: An epic battle for developer mind share](http://www.infoworld.com/article/3166109/application-development/php-vs-nodejs-an-epic-battle-for-developer-mind-share.html#tk.ifwrs)
*   [Python vs. R: The battle for data scientist mind share](http://www.infoworld.com/article/3187550/data-science/python-vs-r-the-battle-for-data-scientist-mind-share.html#tk.ifwrs)
*   [21 hot programming trends—and 21 going cold](http://www.infoworld.com/article/3039935/application-development/21-hot-programming-trends-and-21-going-cold.html#tk.ifwrs)
*   [9 lies programmers tell themselves](http://www.infoworld.com/article/3184495/application-development/9-lies-programmers-tell-themselves.html#tk.ifwrs)
*   [Career hacks: Professional do’s and don’ts for developers](http://www.infoworld.com/resources/113525/application-development/career-hacks-professional-dos-and-donts-for-deve#tk.ifwrs)


原文链接: [http://www.javaworld.com/article/3195803/application-development/java-vs-googles-go-an-epic-battle-for-developer-mind-share.html](http://www.javaworld.com/article/3195803/application-development/java-vs-googles-go-an-epic-battle-for-developer-mind-share.html)

