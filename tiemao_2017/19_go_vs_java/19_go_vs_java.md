# Java vs. Google's Go: An epic battle for developer mind share

# Java 与 Google Go 之争：争夺开发者心智份额的史诗级对决


The upstart Go is giving stalwart Java a run for its money on greenfield server-side web apps

后起之秀 Go 正在全新的服务器端 Web 应用领域向老牌劲旅 Java 发起有力挑战


Go vs. Java isn’t a well-matched battle between equals. One is a monstrous heavyweight that has dominated the industry for years. The other is a scrappy, lightweight newcomer that shows plenty of youth and promise but has only a few punches.

Go 与 Java 并不是一场势均力敌的较量。一方是多年来统治整个行业的庞然大物，另一方则是初出茅庐、轻装上阵的新秀，充满青春与潜力，却还只有寥寥几记重拳。


Java and Go also tackle different niches. One is aimed squarely at server-side web apps, an area where the other was once a major player. The other has outgrown life in the racks and is now a popular choice for devices.

Java 和 Go 面向的领域也各不相同。一个直指服务器端 Web 应用，而这正是另一个曾经的主战场；另一个则早已不局限于机架之中，如今成了设备端的热门之选。


But not everyone has moved away from Java on the server side of web applications, territory Go is attacking, eating away at Java’s base. And the switch isn’t a terribly great leap, as the two are similar in many aspects. Both are loving homages to C, if not underneath, at least on the surface where many developers spend their lives grappling with syntax. They are both straightforward and imperative with enough structural similarities that it’s not hard to convert code between the two. (The [TardisGo](http://tardisgo.github.io/) project, for instance, is one tool that will turn Go into Java, C#, or JavaScript.)

但在 Web 应用的服务器端——也就是 Go 正在进攻、不断蚕食 Java 地盘的地方——并非所有人都已经离开 Java。而且这种切换也算不上什么巨大的飞跃，因为两者在许多方面都很相似。它们都是对 C 语言的深情致敬：即使底层不是，至少在表层语法上如此，而许多开发者一生都在与语法较劲。两者都直白而偏命令式，结构上相似到足以在二者之间转换代码。(例如 [TardisGo](http://tardisgo.github.io/) 项目，就是一个能把 Go 转换成 Java、C# 或 JavaScript 的工具。)


Consider this a cage match that pits two cousins from different sides of the programming tracks competing for your next application stack.

不妨把它看成一场笼中格斗：两位出身不同编程赛道的表亲，正为你下一套应用技术栈的归属而一决高下。


### Java’s long history brings network effects that help everyone

### Java 的悠久历史带来惠及所有人的网络效应


Java has been around since 1995, attracting more mind share each year. Everything from tiny embedded processors to massive server chips run Java quickly and efficiently thanks to its agile just-in-time virtual machine. Android has become a boon for Java, as the most popular platform in the mobile world by far. That’s why Java remains top dog on rankings like the [Tiobe index](https://www.tiobe.com/tiobe-index/) and [PyPL](http://pypl.github.io/PYPL.html). This wide adoption means there is plenty of code for reuse, and much of it is open source to simplify your life. You’ll be standing on the shoulders of giants when you start stitching together the bazillion lines of freely available Java code.

Java 自 1995 年诞生至今，每年都在吸引更多的开发者。从微小的嵌入式处理器到大型服务器芯片，凭借敏捷的即时编译(JIT)虚拟机，都能快速高效地运行 Java。Android 已成为 Java 的一大福音，至今仍是移动领域最受欢迎的平台。这正是 Java 在 [Tiobe 指数](https://www.tiobe.com/tiobe-index/)和 [PyPL](http://pypl.github.io/PYPL.html) 等排行榜上名列前茅的原因。如此广泛的使用意味着有大量代码可以复用，其中很多还是开源的，能大大简化你的工作。当你开始把无数行免费可得的 Java 代码拼接起来时，你将站在巨人的肩膀上。


### Go’s short history makes it instantly relevant

### Go 短暂的历史让它立刻具有现实意义


Sure, it’s cool to snarf free Java code from the web. But wait, it’s written for Java 1.3, and your boss wants you to use Java 1.8. Don’t worry, you can probably get it working again with a bit of rewriting. Let’s move that deadline again ... and again. Old code may seem like a gift, but it’s not always a slam dunk, and sometimes it’s more trouble than it’s worth.

当然，从网上白捡免费的 Java 代码很爽。但等等，这些代码是为 Java 1.3 写的，而你的老板却要你用 Java 1.8。别担心，重写一点大概就能让它重新跑起来。那就再把截止日期往后推吧……一推再推。旧代码看起来像份礼物，但未必总能轻松搞定，有时候它带来的麻烦比它的价值还多。


Go’s short history, on the other hand, means it’s written for today’s web standards. There’s no cruft left over from the days when applets were going to dominate the world. There are no long-forgotten ideas like Java Beans or J2EE sitting around as tempting nuisances. It’s simply new and engineered for how people are building the web today.

而 Go 的历史很短，这意味着它是为当今的 Web 标准而写的。它没有 applet 即将统治世界那个年代遗留下来的陈腐包袱，也没有 Java Beans 或 J2EE 这类早已被遗忘、却仍然诱人地碍手碍脚的旧概念。它就是全新的，并且是为人们今天构建 Web 的方式而设计的。


### Java lets you tap other languages

### Java 允许你利用其他语言


The JVM is the foundation for [dozens of interesting languages](https://en.wikipedia.org/wiki/List_of_JVM_languages) that depend on Java at runtime. Each can be linked easily to your code, letting you write one part in Kotlin, another in Scala, and maybe glue it all together with Clojure. If you want to use languages like Python, JavaScript, or Ruby, all three can run directly in Java land using emulators that are often the first choice. Java gives you the freedom to let each subteam and subproject choose the right language for the job while still running in the same JVM. You don’t need to use it, but the opportunity is always there.

JVM 是[几十种有趣语言](https://en.wikipedia.org/wiki/List_of_JVM_languages)的基石，这些语言在运行时都依赖 Java。每一种都能轻松地与你的代码链接，让你可以用 Kotlin 写一部分、用 Scala 写另一部分，也许再用 Clojure 把它们粘到一起。如果你想使用 Python、JavaScript 或 Ruby 这类语言，这三者都能借助通常作为首选的模拟器直接在 Java 的地盘上运行。Java 赋予你自由，让每个子团队、子项目都能为手头的活儿挑选合适的语言，同时仍运行在同一个 JVM 之中。你不一定要用它，但机会始终摆在那里。


### Go promotes harmony

### Go 促进和谐


Yes, you can knit together a superclever application that mixes in the best of the new and the trendy, choosing the absolutely best language for each part of your wonderful magnum opus on the JVM. You can even mix in oldies like Rexx and Common Lisp to honor their place in ’70s-era computing history. Good luck finding someone with the same tastes and talents who will maintain this Tower of Babel. Aside from mixing in a few well-crafted libraries, it’s not always a good plan to emulate Rube Goldberg when designing good code. Sometimes it’s expedient and necessary, but that doesn’t mean it’s a good plan. Harmony and consistency make life easier for all. The Go world delivers that.

是的，你可以在 JVM 上把一部精妙的应用程序编织起来，混入各种最新最潮的东西，为你那部伟大的代表作挑选绝对最好的语言。你甚至可以混入 Rexx 和 Common Lisp 这样的老古董，向它们在 70 年代计算史上的地位致敬。但祝你好运，能找到一位与你口味和才华相投的人来维护这座巴别塔。除了混入几个精心打造的库之外，在设计优秀代码时效仿鲁布·戈德堡(Rube Goldberg)并不总是一个好方案。有时它省事又必要，但这并不意味着它是个好方案。和谐与一致性会让所有人都更轻松。Go 的世界正是如此。


### Java’s JVM is lean and powerful

### Java 的 JVM 精简而强大


Java class files are often measured in hundreds of bytes. The JAR files that link them together are usually only a few megabytes. Java code itself is small because the virtual machine holds so much power for memory management and security. If you plan to move around lots of code, it makes sense to leave the functionality in a common runtime tool. There are other advantages to centralization. If a security problem appears in the lowest levels of Java, there’s no need to recompile and relink all your code. Many problems are solved by upgrading the JVM alone.

Java 类文件通常只有几百字节，将它们链接在一起的 JAR 文件通常也只有几兆字节。Java 代码本身很小，因为虚拟机在内存管理和安全方面承担了大量功能。如果你打算频繁搬动大量代码，把功能留在统一的运行时工具里是明智之举。集中化还有其他好处：如果 Java 的最底层出现了安全问题，你无需重新编译并重新链接所有代码，只要升级 JVM 本身就能解决很多问题。


### Go creates the complete package

### Go 打造完整的包


The JVM is wonderful until you find that you have the wrong version installed. If you want to run a JAR packed with Java 1.8, but have only the 1.6 version of the JVM, you’re not going anywhere until you find it. The Go compiler produces binaries that are ready to run. Yes, they’re a bit big, but that’s because Go adds all the extra code into the binary for you. It’s all there in one easy package.

JVM 很棒，直到你发现自己装错了版本。如果你想运行一个用 Java 1.8 打包的 JAR，手头却只有 1.6 版本的 JVM，那在找到正确版本之前你哪儿也去不了。Go 编译器生成的二进制文件开箱即用。没错，它们有点大，但那是因为 Go 已经把所有的额外代码都塞进了二进制文件里。一切都在一个简单方便的包里。


### Java makes threads dead simple

### Java 让线程变得异常简单


Getting various parts of a program to run independently is no easy task. Java won early fans because its model for threads was simple enough to understand while powerful enough to be useful. The JVM does a good job mapping threads to different cores on the machine. It’s not easy to do, but that’s because of the complexity of the problem, not Java’s. Go users may love their goroutines and channels, but they add another knotty layer of complexity onto an already gnarly mess. You’ll find yourself asking whether it’s a green thread or an OS thread. Then you’ll wonder about the complexity of the synchronization channels. Java is more straightforward.

让程序的各个部分独立运行绝非易事。Java 早期赢得拥趸，是因为它的线程模型既简单易懂，又强大实用。JVM 能很好地把线程映射到机器上的不同核心。这并不容易做到，但那是问题本身复杂，而不是 Java 复杂。Go 用户也许会喜欢他们的 goroutine 和 channel，但它们在一个本就棘手的烂摊子上又添了一层难解的复杂度。你会忍不住琢磨：这到底是绿色线程还是操作系统线程？接着你又会纠结于同步 channel 的复杂性。而 Java 则更直白。


### Go lightens the thread load, intelligently

### Go 更智能地减轻线程负担


Java’s threads and synchronization primitives may do the job, but at a heavy cost. Creating and destroying threads is so laborious and memory-intensive that Java programmers are always recycling them with thread pools. Java has lost traction on the server because each hit on the website needs its own thread. Go has lighter weight and more flexible objects called goroutines that are linked with intelligent synchronization queues called channels. While most servers seem to top out at 1,000 or maybe 10,000 Java threads, people regularly report running hundreds of thousands of goroutines on the same hardware.

Java 的线程和同步原语也许能完成任务，但代价高昂。创建和销毁线程既费力又耗内存，以至于 Java 程序员总是用线程池来回收它们。Java 在服务器端失去了优势，因为网站上的每次请求都需要自己的线程。Go 拥有更轻量、更灵活的对象，称为 goroutine，它们通过称为 channel 的智能同步队列连接起来。大多数服务器似乎最多只能跑到 1,000 个、也许 10,000 个 Java 线程，而人们经常报告在同一台硬件上运行着数十万个 goroutine。


Go’s model is more sophisticated and modern because it’s younger. The field has learned much about delivering sophisticated multiprocessor algorithms, and you might as well take advantage of it.

Go 的模型更精巧、更现代，因为它更年轻。这个领域已经在实现精巧的多处理器算法方面积累了很多经验，你何不加以利用呢。


### Java tools are tried and true

### Java 工具久经考验、值得信赖


Java’s maturity means you have plenty of great options for tools: Eclipse, IntelliJ, and more. There are sophisticated build tools like Ant and Maven, and the major repositories are optimized to handle Java code. There are also meta code analytics for everything from enforcing code rules to searching for race conditions. They may not work with your version of the code, but they often do. This is why Java is such a juggernaut.

Java 的成熟意味着你在工具方面有大量出色的选择：Eclipse、IntelliJ 等等。还有 Ant 和 Maven 这样精巧的构建工具，而且各大仓库都对处理 Java 代码做了优化。还有元代码分析工具，从强制代码规范到排查竞态条件，用途广泛。它们也许不支持你这个版本的代码，但往往是可以的。这正是 Java 如此强大的原因。


### Go tools are modern and new

### Go 的工具现代而新颖


Go was built for the modern multithreaded world, and the code tools are optimized for today’s challenges. There’s a race condition detector built into the debugger and runtime, so it's much simpler to deal with nasty problems. The source code can be audited by golint and a static analyzer called “go vet” that has a number of heuristics for catching bad or even poorly written Go code. All of these and more are optimized for keeping your code running quickly in a multicore machine.

Go 是为现代多线程世界而打造的，其代码工具也针对当今的挑战做了优化。调试器和运行时内置了竞态条件检测器，因此处理棘手问题要简单得多。源代码可以用 golint 以及一个名为 “go vet” 的静态分析器来审查，后者带有许多启发式规则，能发现糟糕甚至写得很差的 Go 代码。所有这些以及更多特性，都是为了让你的代码在多核机器上快速运行而优化的。


### Java has the constructs you want

### Java 拥有你想要的构造


Over the years, the Java community has wished for many features; some of the time, they’ve been granted. Closures, generics, lambdas, and more have been added. If there’s a new idea in programming languages, there’s a good chance someone has shoehorned it into the Java world. It may not be ideal, but the options are there. You can write the brilliant code your brain imagines thanks to Java’s ongoing evolution.

多年来，Java 社区期盼过许多特性，其中一些时候愿望得以实现。闭包、泛型、lambda 等等都已被加入。如果编程语言里出现了什么新点子，很可能已经有人把它硬塞进了 Java 世界。它也许并不理想，但选项就摆在那里。得益于 Java 的持续演进，你可以写出脑海中想象的出色代码。


### Go avoids construct confusion

### Go 避免构造混乱


The freedom to use dozens of clever coding structures sounds great until everyone on the team starts doing it. Then reading someone else’s code becomes harder because they’re using clever feature A while your brain is acclimated to clever feature B. The combinatorial confusion compounds with each developer who throws in his or her favorite construct into the mix.

可以使用几十种聪明编码结构的自由听起来很棒，直到团队里每个人都开始这么干。这时读别人的代码就变得更难了，因为对方用的是聪明特性 A，而你的脑子却习惯了聪明特性 B。每一位把自己最爱的构造丢进这锅大杂烩的开发者，都会让这种组合式的混乱愈发严重。


Go, on the other hand, was designed to be simple. It was explicitly built so that a good programmer could learn Go in a few hours. There aren’t dozens of clever ideas that fill hundreds of pages of documentation. That may be limiting when writing code, but it’s relaxing when reading code from others on the team. Everyone uses the same idioms because everyone is using the same core features. It’s not merely a team-building experience, like Outward Bound. It’s about efficiency.

而 Go 则被设计得很简单。它被刻意打造成这样：一个好程序员能在几个小时内学会 Go。没有几十种聪明点子塞满数百页文档。这在写代码时也许是一种限制，但在读团队里别人写的代码时却让人轻松。每个人都使用同样的惯用法，因为每个人用的都是同一套核心特性。这不仅像 Outward Bound 那样是一次团建体验，它关乎的是效率。


### Java is mature

### Java 是成熟的


Age brings wisdom, maturity, and stability—all the reasons for choosing a broad, well-engineered codebase that’s more than two decades deep. The kids today continue to learn Java at the beginning of their journey with computer science, and the most dominant platform, Android, is built on it. Unless there’s a good reason to change, you should stick with the best.

岁月带来智慧、成熟与稳定——这些都是选择一套经过二十多年沉淀、范围广泛且精心设计的代码库的理由。如今的孩子们在踏入计算机科学之旅时仍在学习 Java，而最具统治力的平台 Android 正是构建于其上。除非有充分的理由要改变，否则你就应该坚持用最好的那个。


### Go is a clean slate

### Go 是一张白纸


Sometimes it’s best to leave the past behind. After all, progress often means starting fresh. Go offers you the opportunity to work with a clean, crisp, modern tool that’s optimized for what we do today. It allows you to enjoy the simplicity and the freedom of leaving the past behind.

有时候，最好还是把过去抛在身后。毕竟，进步往往意味着重新开始。Go 给你机会去使用一件干净、利落、现代的工具，它针对我们今天所做的事做了优化。它让你享受简单，以及把过去甩在身后的自由。


And simply because Google started Go to bring some simplicity to coding for their endless server farms, it doesn't mean it can't outgrow it. Some are already using it to [run drones, robots, and other devices](https://gobot.io/). Can smartphones be far behind?

仅仅因为 Google 发起 Go 是为了给他们那些无穷无尽的服务器农场带来一点编码上的简洁，并不意味着 Go 不能超越这一初衷。有些人已经在用它来[运行无人机、机器人和其他设备](https://gobot.io/)。智能手机还会远吗？




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
