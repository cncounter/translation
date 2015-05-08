# What you need to know about Hadoop right now

# 程序员应该了解的Hadoop现状

### Phoenix, Kafka, and Falcon fill some important niches in Hadoop's growing ecosystem

### 副标题: Phoenix, Kafka 和 Falcon 填补了 Hadoop 生态重要的市场空白


Last year I gave a crunch list of [what you should know about Hadoop](http://www.infoworld.com/article/2608249/application-development/know-this-right-now-about-hadoop.html). It has been a couple months short of a year since then, but I thought I'd check in and see how you’re coming along -- and add a few more technologies to the list.

去年我写了一篇文章:  [程序员应该了解的Hadoop知识](http://www.infoworld.com/article/2608249/application-development/know-this-right-now-about-hadoop.html) 。 转眼一年过去了,我认为应该更新一下,看看有哪些变化, 并且增加一些技术列表。


To start, I hope you didn’t forget your fundamentals. Yarn and HDFS are no less important now than last year. Plus, I hope you remembered the ecosystem stuff. In fact, HBase is even more vital and Cassandra is on fire in the marketplace, although many now consider it to be its own thing outside of Hadoop. (If you think your brain is running out of room, at least you can forget that HAWQ or Greenplum ever existed, since [Pivotal soon will](http://www.infoworld.com/article/2885334/application-development/what-pivotals-big-open-source-move-really-means.html).)


首先,我希望你没有忘记你的基本面。 纱和HDFS是现在比去年同样重要。 另外,我希望你记住了生态系统的东西。 事实上,HBase更为重要和卡桑德拉在市场上着火,尽管许多人现在认为它是Hadoop以外的自己的东西。 (如果你认为你的大脑的房间,至少你可以忘记干或Greenplum存在, [关键的很快就会](http://www.infoworld.com/article/2885334/application-development/what-pivotals-big-open-source-move-really-means.html) )。


Today, you should probably know about Phoenix -- similar to [Splice Machine, which I covered last year](http://www.infoworld.com/article/2608749/application-development/with-hadoop-hbase--splice-machine-breathes-new-life-into-old-rdbms.html), but totally open source. It's essentially an RDBMS built on top of HBase and supports a healthy SQL subset: JDBC and the works. It's also a heck of a lot [faster than Hive](http://phoenix.apache.org/performance.html). I don’t think of it as a replacement for Hive, which is still a good fit for a bunch of flat files that you don’t want to mangle into HBase and might analyze other ways. Anyway, best of all, Pheonix was founded by James Taylor, who is totally not tired of jokes based on his name.

今天,你应该知道凤凰——类似 [拼接机,我去年所覆盖](http://www.infoworld.com/article/2608749/application-development/with-hadoop-hbase--splice-machine-breathes-new-life-into-old-rdbms.html) ,但完全开源。 它本质上是RDBMS之上的HBase和支持一个健康的SQL子集:JDBC和作品。 它也是非常非常多的 [比蜂房](http://phoenix.apache.org/performance.html) 。 我不认为它是一个替代蜂巢,这仍然是一个适合一群平面文件,你不想乱砍成HBase和可能分析其他方式。 无论如何,最重要的是,菲尼克斯是由詹姆斯·泰勒,他完全是根据他的名字不累的笑话。


If you didn’t take my advice to learn a little [Spark and Storm](http://www.infoworld.com/article/2854894/application-development/spark-and-storm-for-real-time-computation.html), now's the time. (Note: You can forget about Shark and learn Spark SQL instead.) Spark is setting the world on fire (pun intended), and at the moment, when people say “real time” and “Hadoop” in the same sentence, “[Storm](http://www.infoworld.com/article/2860740/application-development/twitter-analytics-with-storm.html)” will probably be in there too. The two have some overlap, but there are places where [one is a better fit than the other](http://www.infoworld.com/article/2854894/application-development/spark-and-storm-for-real-time-computation.html).



如果你不听我的劝告去学习 [火花和风暴](http://www.infoworld.com/article/2854894/application-development/spark-and-storm-for-real-time-computation.html) ,现在是时候了。 (注意:你可以忘记鲨鱼和学习火花SQL代替。) 火花点燃世界(双关语),此刻,当人们说“实时”和“Hadoop”相同的句子,“ [风暴](http://www.infoworld.com/article/2860740/application-development/twitter-analytics-with-storm.html) “可能会在那里。 这两个有一些重叠,但也有地方 [一个是比其他的更适合你](http://www.infoworld.com/article/2854894/application-development/spark-and-storm-for-real-time-computation.html) 。



You should probably [know about Kafka](http://kafka.apache.org/documentation.html), too. If you have used JMS, AMQ, or any messaging tool, then you already know a little about Kafka. If you're using Storm, most of the time you'll also use it with Kafka to make sure the little streams of bits end up somewhere and are not merely dropped into dev/null.

你应该 [了解卡夫卡](http://kafka.apache.org/documentation.html) ,太。 如果你有使用JMS,AMQ,或任何通讯工具,那么你已经知道一点关于卡夫卡。 如果你使用风暴,大部分的时间你也会使用它与卡夫卡以确保最终位地方的小溪,不仅仅是掉进dev / null。


You may also want to learn [Falcon](http://falcon.apache.org/index.html) -- writing a whole stream processing thing when all you want to do is feed data from Hadoop A to Hadoop B is a waste and [managing data evictions](http://falcon.apache.org/HiveIntegration.html) with Oozie can be laborious.


你也可以学习 [猎鹰](http://falcon.apache.org/index.html) ——写一整个流处理的事情当所有你要做的是将数据从Hadoop和Hadoop B是一种浪费 [数据管理拆迁](http://falcon.apache.org/HiveIntegration.html) Oozie可以费力。



As fun as Ambari is for setting up clusters, it might not be how you want to set up, configure, and reconfigure a massive farm. Moreover, what if you have a big fat data center and don't want to decide that some set of servers will only ever be used for batch rather than stream processing? What if you simply want to pool your resources? Maybe [Mesos](http://mesos.apache.org/) is your daddy.

洋麻用于设置集群一样有趣,它可能不是你想要设置,配置和重新配置一个巨大的农场。 此外,如果你有一个大胖数据中心和不想决定一些组服务器将只用于批处理而不是流处理? 如果你只是想共享资源吗? 也许 [可](http://mesos.apache.org/) 是你的爸爸。



If someone makes you do security at the perimeter you might have to use Knox, but it's probably more important to start boning up on Ranger. In a way, Ranger is a side effect of the disjointed way in which the Hadoop ecosystem was created. The idea is that a user is a user, security is security, and I ought not have to create the concept separately in Hive, HBase, Storm, Knox, and so on. It plugs into all of them. Don’t get too excited -- it doesn’t plug into everything yet and [the documentation](https://cwiki.apache.org/confluence/display/RANGER/Index) isn't quite done, but you can [find more on the Hortonworks site](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.2.0/Ranger_U_Guide_v22/index.html#Item1.1).


如果有人让你做安全周边你可能不得不使用诺克斯,但可能更重要的是开始去骨管理员。 在某种程度上,管理员是脱节的副作用Hadoop生态系统被创建。 用户是一个用户的想法是,安全是安全,我不应该在蜂巢必须创建单独的概念,HBase,风暴,诺克斯等等。 把它插进所有的人。 不要太激动,它不插入,一切 [的文档](https://cwiki.apache.org/confluence/display/RANGER/Index) 不太做,但是你可以 [Hortonworks网站找到更多](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.2.0/Ranger_U_Guide_v22/index.html#Item1.1) 。


A few notes outside of Hadoop you should know about, too. For example, you should familiarize yourself with LDAP. I mean, no one likes Active Directory, but everyone is doing it and LDAP is one of the key ways to integrate with it. Unfortunately, the most complete security model in Hadoop is Kerberos. Yes, that old piece of, er, engineering is still the thing to configure most of the time. You should probably know how to set that up from point A to B to C.

Hadoop以外的一些笔记你应该知道,。 例如,你应该熟悉LDAP。 我的意思是,没有人喜欢活动目录,但每个人都这样做,LDAP是集成的关键途径之一。 不幸的是,最完整的Hadoop是Kerberos安全模型。 是的,旧的,呃,工程仍是配置大部分时间。 你应该知道如何设置,从A点到B,C。


I would also recommend learning a little about [Docker](http://www.infoworld.com/resources/16373/application-virtualization/the-beginners-guide-to-docker) and what it is. Luckily, if you know what Solaris Zones are and can imagine packaging, you probably have a good handle on what Docker does and is.


我也学习一点关于推荐 [码头工人](http://www.infoworld.com/resources/16373/application-virtualization/the-beginners-guide-to-docker) 和它是什么。 幸运的是,如果你知道Solaris区域,可以想象包装,你可能有一个很好的处理在什么码头工人。


Most important, you need to learn a bit about [machine learning](https://www.coursera.org/learn/machine-learning/). This is the stuff that can prevent a meat-cloud from munging Excel reports and help you guess, using predictive analytics, where the bodies -- or [earthquakes](http://recovery.doi.gov/press/us-geological-survey-twitter-earthquake-detector-ted/) -- are buried. There are several libraries from [Mahout](http://mahout.apache.org/) to MLib, but to set up problems for them to solve,  you should understand at least the basics of the techniques and algorithms.

最重要的是,你需要了解一点 [机器学习](https://www.coursera.org/learn/machine-learning/) 。 这个东西可以防止meat-cloud绿豆Excel报表,帮助你猜测,尸体——或者使用预测分析 [地震](http://recovery.doi.gov/press/us-geological-survey-twitter-earthquake-detector-ted/) ——埋葬。 有一些库 [Mahout](http://mahout.apache.org/) 来 MLIB ,但设置的问题解决,你至少应该了解基本的技术和算法。


I hope you boned up last year and are ready for these little additions to your knowledge base. I hope Kerberos didn’t bite you too hard or Phoenix didn’t burn you too much. Hadoop is an ever-growing ecosystem and it can be a challenge to keep up, but I believe in you!


我希望你去年去骨,准备好这些小增加你的知识基础。 我希望Kerberos没有咬你太难或凤凰不消耗你太多。 Hadoop是一个日益增长的生态系统,它可以是一个挑战,但我相信你!


相关链接: 

- [Storm or Spark: Choose your real-time weapon](http://www.javaworld.com/article/2855755/big-data/storm-or-spark-choose-your-real-time-weapon.html)
- [Know this right now about Hadoop](http://www.javaworld.com/article/2158789/data-storage/know-this-right-now-about-hadoop.html)
- [Review: The big 4 Java IDEs compared](http://www.javaworld.com/article/2866811/developer-tools-ide/java-ide-shoot-out-eclipse-vs-netbeans-vs-jdeveloper-vs-intellij-idea.html)
- [HTTP/2: A jump-start for Java developers](http://www.javaworld.com/article/2916548/java-web-development/http-2-for-java-developers.html)



原文链接： [What you need to know about Hadoop right now](http://www.javaworld.com/article/2896317/big-data/what-you-need-to-know-about-hadoop-right-now.html)

原文日期: 2015年03月12日

翻译日期: 2015年05月09日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
