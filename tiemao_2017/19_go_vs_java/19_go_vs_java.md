# Java vs. Google's Go: An epic battle for developer mind share

The upstart Go is giving stalwart Java a run for its money on greenfield server-side web apps

Go vs. Java isn’t a well-matched battle between equals. One is a monstrous heavyweight that has dominated the industry for years. The other is a scrappy, lightweight newcomer that shows plenty of youth and promise but has only a few punches.

Java and Go also tackle different niches. One is aimed squarely at server-side web apps, an area where the other was once a major player. The other has outgrown life in the racks and is now a popular choice for devices.

But not everyone has moved away from Java on the server side of web applications, territory Go is attacking, eating away at Java’s base. And the switch isn’t a terribly great leap, as the two are similar in many aspects. Both are loving homages to C, if not underneath, at least on the surface where many developers spend their lives grappling with syntax. They are both straightforward and imperative with enough structural similarities that it’s not hard to convert code between the two. (The [TardisGo](http://tardisgo.github.io/) project, for instance, is one tool that will turn Go into Java, C#, or JavaScript.)

Consider this a cage match that pits two cousins from different sides of the programming tracks competing for your next application stack.

### Java’s long history brings network effects that help everyone

Java has been around since 1995, attracting more mind share each year. Everything from tiny embedded processors to massive server chips run Java quickly and efficiently thanks to its agile just-in-time virtual machine. Android has become a boon for Java, as the most popular platform in the mobile world by far. That’s why Java remains top dog on rankings like the [Tiobe index](https://www.tiobe.com/tiobe-index/) and [PyPL](http://pypl.github.io/PYPL.html). This wide adoption means there is plenty of code for reuse, and much of it is open source to simplify your life. You’ll be standing on the shoulders of giants when you start stitching together the bazillion lines of freely available Java code.

### Go’s short history makes it instantly relevant

Sure, it’s cool to snarf free Java code from the web. But wait, it’s written for Java 1.3, and your boss wants you to use Java 1.8. Don’t worry, you can probably get it working again with a bit of rewriting. Let’s move that deadline again ... and again. Old code may seem like a gift, but it’s not always a slam dunk, and sometimes it’s more trouble than it’s worth.

Go’s short history, on the other hand, means it’s written for today’s web standards. There’s no cruft left over from the days when applets were going to dominate the world. There are no long-forgotten ideas like Java Beans or J2EE sitting around as tempting nuisances. It’s simply new and engineered for how people are building the web today.

### Java lets you tap other languages

The JVM is the foundation for [dozens of interesting languages](https://en.wikipedia.org/wiki/List_of_JVM_languages) that depend on Java at runtime. Each can be linked easily to your code, letting you write one part in Kotlin, another in Scala, and maybe glue it all together with Clojure. If you want to use languages like Python, JavaScript, or Ruby, all three can run directly in Java land using emulators that are often the first choice. Java gives you the freedom to let each subteam and subproject choose the right language for the job while still running in the same JVM. You don’t need to use it, but the opportunity is always there.

### Go promotes harmony

Yes, you can knit together a superclever application that mixes in the best of the new and the trendy, choosing the absolutely best language for each part of your wonderful magnum opus on the JVM. You can even mix in oldies like Rexx and Common Lisp to honor their place in ’70s-era computing history. Good luck finding someone with the same tastes and talents who will maintain this Tower of Babel. Aside from mixing in a few well-crafted libraries, it’s not always a good plan to emulate Rube Goldberg when designing good code. Sometimes it’s expedient and necessary, but that doesn’t mean it’s a good plan. Harmony and consistency make life easier for all. The Go world delivers that.

### Java’s JVM is lean and powerful

Java class files are often measured in hundreds of bytes. The JAR files that link them together are usually only a few megabytes. Java code itself is small because the virtual machine holds so much power for memory management and security. If you plan to move around lots of code, it makes sense to leave the functionality in a common runtime tool. There are other advantages to centralization. If a security problem appears in the lowest levels of Java, there’s no need to recompile and relink all your code. Many problems are solved by upgrading the JVM alone.

### Go creates the complete package

The JVM is wonderful until you find that you have the wrong version installed. If you want to run a JAR packed with Java 1.8, but have only the 1.6 version of the JVM, you’re not going anywhere until you find it. The Go compiler produces binaries that are ready to run. Yes, they’re a bit big, but that’s because Go adds all the extra code into the binary for you. It’s all there in one easy package.

### Java makes threads dead simple

Getting various parts of a program to run independently is no easy task. Java won early fans because its model for threads was simple enough to understand while powerful enough to be useful. The JVM does a good job mapping threads to different cores on the machine. It’s not easy to do, but that’s because of the complexity of the problem, not Java’s. Go users may love their goroutines and channels, but they add another knotty layer of complexity onto an already gnarly mess. You’ll find yourself asking whether it’s a green thread or an OS thread. Then you’ll wonder about the complexity of the synchronization channels. Java is more straightforward.

### Go lightens the thread load, intelligently

Java’s threads and synchronization primitives may do the job, but at a heavy cost. Creating and destroying threads is so laborious and memory-intensive that Java programmers are always recycling them with thread pools. Java has lost traction on the server because each hit on the website needs its own thread. Go has lighter weight and more flexible objects called goroutines that are linked with intelligent synchronization queues called channels. While most servers seem to top out at 1,000 or maybe 10,000 Java threads, people regularly report running hundreds of thousands of goroutines on the same hardware.

Go’s model is more sophisticated and modern because it’s younger. The field has learned much about delivering sophisticated multiprocessor algorithms, and you might as well take advantage of it.

### Java tools are tried and true

Java’s maturity means you have plenty of great options for tools: Eclipse, IntelliJ, and more. There are sophisticated build tools like Ant and Maven, and the major repositories are optimized to handle Java code. There are also meta code analytics for everything from enforcing code rules to searching for race conditions. They may not work with your version of the code, but they often do. This is why Java is such a juggernaut.

### Go tools are modern and new

Go was built for the modern multithreaded world, and the code tools are optimized for today’s challenges. There’s a race condition detector built into the debugger and runtime, so it's much simpler to deal with nasty problems. The source code can be audited by golint and a static analyzer called “go vet” that has a number of heuristics for catching bad or even poorly written Go code. All of these and more are optimized for keeping your code running quickly in a multicore machine.

### Java has the constructs you want

Over the years, the Java community has wished for many features; some of the time, they’ve been granted. Closures, generics, lambdas, and more have been added. If there’s a new idea in programming languages, there’s a good chance someone has shoehorned it into the Java world. It may not be ideal, but the options are there. You can write the brilliant code your brain imagines thanks to Java’s ongoing evolution.

### Go avoids construct confusion

The freedom to use dozens of clever coding structures sounds great until everyone on the team starts doing it. Then reading someone else’s code becomes harder because they’re using clever feature A while your brain is acclimated to clever feature B. The combinatorial confusion compounds with each developer who throws in his or her favorite construct into the mix.

Go, on the other hand, was designed to be simple. It was explicitly built so that a good programmer could learn Go in a few hours. There aren’t dozens of clever ideas that fill hundreds of pages of documentation. That may be limiting when writing code, but it’s relaxing when reading code from others on the team. Everyone uses the same idioms because everyone is using the same core features. It’s not merely a team-building experience, like Outward Bound. It’s about efficiency.

### Java is mature

Age brings wisdom, maturity, and stability—all the reasons for choosing a broad, well-engineered codebase that’s more than two decades deep. The kids today continue to learn Java at the beginning of their journey with computer science, and the most dominant platform, Android, is built on it. Unless there’s a good reason to change, you should stick with the best.

### Go is a clean slate

Sometimes it’s best to leave the past behind. After all, progress often means starting fresh. Go offers you the opportunity to work with a clean, crisp, modern tool that’s optimized for what we do today. It allows you to enjoy the simplicity and the freedom of leaving the past behind.

And simply because Google started Go to bring some simplicity to coding for their endless server farms, it doesn't mean it can't outgrow it. Some are already using it to [run drones, robots, and other devices](https://gobot.io/). Can smartphones be far behind?

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

