# What you need to know about Hadoop right now

# 程序员应该了解的 Hadoop 现状

### Phoenix, Kafka, and Falcon fill some important niches in Hadoop's growing ecosystem

### 副标题: Phoenix, Kafka 和 Falcon 填补了 Hadoop 生态重要的市场空白


Last year I gave a crunch list of [what you should know about Hadoop](http://www.infoworld.com/article/2608249/application-development/know-this-right-now-about-hadoop.html). It has been a couple months short of a year since then, but I thought I'd check in and see how you’re coming along -- and add a few more technologies to the list.

去年我写了一篇文章: [程序员应该了解的 Hadoop 知识](http://www.infoworld.com/article/2608249/application-development/know-this-right-now-about-hadoop.html)。转眼差不多过去一年了, 我觉得应该更新一下, 看看有哪些变化, 并且增加一些新的技术。


To start, I hope you didn’t forget your fundamentals. Yarn and HDFS are no less important now than last year. Plus, I hope you remembered the ecosystem stuff. In fact, HBase is even more vital and Cassandra is on fire in the marketplace, although many now consider it to be its own thing outside of Hadoop. (If you think your brain is running out of room, at least you can forget that HAWQ or Greenplum ever existed, since [Pivotal soon will](http://www.infoworld.com/article/2885334/application-development/what-pivotals-big-open-source-move-really-means.html).)


首先, 希望你没有忘记基础的东西。YARN 和 HDFS 现在和去年一样重要。另外, 希望你记住了生态系统里的那些技术。实际上, HBase 甚至更加重要, 而 Cassandra 在市场上非常火爆, 尽管现在很多人认为它已经算是 Hadoop 之外的东西了。(如果你觉得脑子快要装不下了, 至少可以忘掉 HAWQ 或 Greenplum 曾经存在过, 因为 [Pivotal 很快就会让它们消失](http://www.infoworld.com/article/2885334/application-development/what-pivotals-big-open-source-move-really-means.html)。)


Today, you should probably know about Phoenix -- similar to [Splice Machine, which I covered last year](http://www.infoworld.com/article/2608749/application-development/with-hadoop-hbase--splice-machine-breathes-new-life-into-old-rdbms.html), but totally open source. It's essentially an RDBMS built on top of HBase and supports a healthy SQL subset: JDBC and the works. It's also a heck of a lot [faster than Hive](http://phoenix.apache.org/performance.html). I don’t think of it as a replacement for Hive, which is still a good fit for a bunch of flat files that you don’t want to mangle into HBase and might analyze other ways. Anyway, best of all, Pheonix was founded by James Taylor, who is totally not tired of jokes based on his name.

今天, 你应该了解 Phoenix —— 它类似 [Splice Machine(我去年介绍过)](http://www.infoworld.com/article/2608749/application-development/with-hadoop-hbase--splice-machine-breathes-new-life-into-old-rdbms.html), 但完全开源。它本质上是一个构建在 HBase 之上的 RDBMS, 支持相当完整的 SQL 子集: JDBC 以及各种相关功能。它也比 Hive [快得多](http://phoenix.apache.org/performance.html)。我不认为它是 Hive 的替代品, Hive 仍然很适合处理一堆你不想塞进 HBase、又可能想用其他方式分析的平面文件。总之, 最棒的是, Phoenix 的创始人是 James Taylor, 他完全不会厌倦人们拿他的名字开玩笑。


If you didn’t take my advice to learn a little [Spark and Storm](http://www.infoworld.com/article/2854894/application-development/spark-and-storm-for-real-time-computation.html), now's the time. (Note: You can forget about Shark and learn Spark SQL instead.) Spark is setting the world on fire (pun intended), and at the moment, when people say “real time” and “Hadoop” in the same sentence, “[Storm](http://www.infoworld.com/article/2860740/application-development/twitter-analytics-with-storm.html)” will probably be in there too. The two have some overlap, but there are places where [one is a better fit than the other](http://www.infoworld.com/article/2854894/application-development/spark-and-storm-for-real-time-computation.html).



如果你没有听从我的建议去学习一点 [Spark 和 Storm](http://www.infoworld.com/article/2854894/application-development/spark-and-storm-for-real-time-computation.html), 那么现在是时候了。(注意: 你可以忘掉 Shark, 改学 Spark SQL。)Spark 正在点燃世界(双关语), 而且目前, 当人们在同一个句子里说 “实时” 和 “Hadoop” 时, “[Storm](http://www.infoworld.com/article/2860740/application-development/twitter-analytics-with-storm.html)” 很可能也会出现在其中。两者有一些重叠, 但在某些场景下 [其中一个比另一个更合适](http://www.infoworld.com/article/2854894/application-development/spark-and-storm-for-real-time-computation.html)。



You should probably [know about Kafka](http://kafka.apache.org/documentation.html), too. If you have used JMS, AMQ, or any messaging tool, then you already know a little about Kafka. If you're using Storm, most of the time you'll also use it with Kafka to make sure the little streams of bits end up somewhere and are not merely dropped into dev/null.

你也应该 [了解 Kafka](http://kafka.apache.org/documentation.html)。如果你用过 JMS、AMQ 或任何消息工具, 那么你对 Kafka 已经有了一点了解。如果你在使用 Storm, 大多数时候你也会配合 Kafka 来使用它, 以确保这些比特流最终能到达某个地方, 而不只是被丢进 dev/null。


You may also want to learn [Falcon](http://falcon.apache.org/index.html) -- writing a whole stream processing thing when all you want to do is feed data from Hadoop A to Hadoop B is a waste and [managing data evictions](http://falcon.apache.org/HiveIntegration.html) with Oozie can be laborious.


你可能还想学习 [Falcon](http://falcon.apache.org/index.html) —— 当你只是想将数据从 Hadoop A 喂给 Hadoop B 时, 却要写一整套流处理程序, 这实在是一种浪费; 而用 Oozie 来 [管理数据清理](http://falcon.apache.org/HiveIntegration.html) 也很费劲。



As fun as Ambari is for setting up clusters, it might not be how you want to set up, configure, and reconfigure a massive farm. Moreover, what if you have a big fat data center and don't want to decide that some set of servers will only ever be used for batch rather than stream processing? What if you simply want to pool your resources? Maybe [Mesos](http://mesos.apache.org/) is your daddy.

虽然用 Ambari 来搭建集群很有趣, 但它可能并不是你搭建、配置和重新配置一个超大规模集群时想要的方式。此外, 如果你有一个庞大的数据中心, 并且不想规定某些服务器只能用于批处理而不能用于流处理呢? 如果你只是想把自己的资源池化呢? 也许 [Mesos](http://mesos.apache.org/) 才是你要找的。



If someone makes you do security at the perimeter you might have to use Knox, but it's probably more important to start boning up on Ranger. In a way, Ranger is a side effect of the disjointed way in which the Hadoop ecosystem was created. The idea is that a user is a user, security is security, and I ought not have to create the concept separately in Hive, HBase, Storm, Knox, and so on. It plugs into all of them. Don’t get too excited -- it doesn’t plug into everything yet and [the documentation](https://cwiki.apache.org/confluence/display/RANGER/Index) isn't quite done, but you can [find more on the Hortonworks site](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.2.0/Ranger_U_Guide_v22/index.html#Item1.1).


如果有人要你做边界安全, 你可能不得不使用 Knox, 但更重要的也许是开始钻研 Ranger。从某种意义上说, Ranger 是 Hadoop 生态各自为政地发展所带来的产物。它的理念是: 用户就是用户, 安全就是安全, 我不应该必须在 Hive、HBase、Storm、Knox 等等里面分别去创建这些概念。它能接入所有这些组件。别太兴奋 —— 它目前还不能接入所有东西, [文档](https://cwiki.apache.org/confluence/display/RANGER/Index) 也还没完全写好, 但你可以在 [Hortonworks 网站上找到更多内容](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.2.0/Ranger_U_Guide_v22/index.html#Item1.1)。


A few notes outside of Hadoop you should know about, too. For example, you should familiarize yourself with LDAP. I mean, no one likes Active Directory, but everyone is doing it and LDAP is one of the key ways to integrate with it. Unfortunately, the most complete security model in Hadoop is Kerberos. Yes, that old piece of, er, engineering is still the thing to configure most of the time. You should probably know how to set that up from point A to B to C.

在 Hadoop 之外, 还有一些你应该了解的要点。例如, 你应该熟悉 LDAP。我的意思是, 没人喜欢 Active Directory, 但大家都在用它, 而 LDAP 是与它集成的关键方式之一。遗憾的是, Hadoop 中最完整的安全模型是 Kerberos。是的, 那个古老的、呃、工程, 在大多数时候仍然是需要配置的东西。你大概应该知道如何从 A 点到 B 点再到 C 点把它搭起来。


I would also recommend learning a little about [Docker](http://www.infoworld.com/resources/16373/application-virtualization/the-beginners-guide-to-docker) and what it is. Luckily, if you know what Solaris Zones are and can imagine packaging, you probably have a good handle on what Docker does and is.


我也推荐你稍微了解一下 [Docker](http://www.infoworld.com/resources/16373/application-virtualization/the-beginners-guide-to-docker) 以及它是什么。幸运的是, 如果你知道 Solaris Zones 是什么, 并且能想象出打包的过程, 那你大概就能很好地理解 Docker 是做什么的、又是什么。


Most important, you need to learn a bit about [machine learning](https://www.coursera.org/learn/machine-learning/). This is the stuff that can prevent a meat-cloud from munging Excel reports and help you guess, using predictive analytics, where the bodies -- or [earthquakes](http://recovery.doi.gov/press/us-geological-survey-twitter-earthquake-detector-ted/) -- are buried. There are several libraries from [Mahout](http://mahout.apache.org/) to MLib, but to set up problems for them to solve,  you should understand at least the basics of the techniques and algorithms.

最重要的是, 你需要了解一点 [机器学习](https://www.coursera.org/learn/machine-learning/)。这东西可以避免肉云(meat-cloud)去捣鼓 Excel 报表, 并借助预测分析帮你猜测尸体 —— 或者 [地震](http://recovery.doi.gov/press/us-geological-survey-twitter-earthquake-detector-ted/) —— 被埋在哪里。从 [Mahout](http://mahout.apache.org/) 到 MLlib 都有不少库, 但要为它们设定问题去解决, 你至少应该了解这些技术和算法的基础。


I hope you boned up last year and are ready for these little additions to your knowledge base. I hope Kerberos didn’t bite you too hard or Phoenix didn’t burn you too much. Hadoop is an ever-growing ecosystem and it can be a challenge to keep up, but I believe in you!


我希望你去年用功过了, 已经准备好把这些小知识点加入你的知识库。希望 Kerberos 没有咬你太狠, Phoenix 也没有烧到你太多。Hadoop 是一个不断壮大的生态系统, 跟上它可能是一个挑战, 但我相信你!


相关链接: 

- [Storm or Spark: Choose your real-time weapon](http://www.javaworld.com/article/2855755/big-data/storm-or-spark-choose-your-real-time-weapon.html)
- [Know this right now about Hadoop](http://www.javaworld.com/article/2158789/data-storage/know-this-right-now-about-hadoop.html)
- [Review: The big 4 Java IDEs compared](http://www.javaworld.com/article/2866811/developer-tools-ide/java-ide-shoot-out-eclipse-vs-netbeans-vs-jdeveloper-vs-intellij-idea.html)
- [HTTP/2: A jump-start for Java developers](http://www.javaworld.com/article/2916548/java-web-development/http-2-for-java-developers.html)



原文链接: [What you need to know about Hadoop right now](http://www.javaworld.com/article/2896317/big-data/what-you-need-to-know-about-hadoop-right-now.html)

原文日期: 2015年03月12日

翻译日期: 2015年05月09日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
