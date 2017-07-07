# Java EE Fundamentals – What is an Application Server?

# 4. 什么是应用服务器？ - JavaEE基础系列


This is the fourth in the Java EE Fundamentals series

本文是JavaEE基础系列的第四节。



1. [Java EE简介 - JavaEE基础系列](http://blog.csdn.net/renfufei/article/details/74073705)
2. [JSR简介 - JavaEE基础系列](http://blog.csdn.net/renfufei/article/details/74074616)
3. [什么是JSR参考实现？ - JavaEE基础系列](http://blog.csdn.net/renfufei/article/details/74094488)


In the previous post, we talked about what a JSR reference implementation is. Also in our definition of [Java EE](https://www.udemy.com/the-theory-and-practice-of-java-ee-for-java-software-developers/learn/v4/), we did mention that it is a collection of abstract specifications. Now Java EE itself, is a Java Specification Request.

上一节介绍了什么是JSR参考实现。 在[Java EE简介](http://blog.csdn.net/renfufei/article/details/74073705) 一节, 我们也提到, JavaEE 是一系列抽象的规范, 本身就是一堆 JSR 组成。


Better still, Java EE is what is termed an umbrella JSR in that it encapsulates a number of JSRs. So Java EE 7 for instance, is [JSR 342](https://www.jcp.org/en/jsr/detail?id=342). Java EE 8 is [JSR 366](https://www.jcp.org/en/jsr/detail?id=366). So Java EE itself is a JSR that goes through the JCP JSR process and is subject to the requirements of every JSR.

更好的是,Java EE就是称为综合JSR, 它封装了多个JSR。例如,Java EE 7 对应 [JSR 342](https://www.jcp.org/en/jsr/detail?id=342)。 Java EE 8 对应于 [JSR 366](https://www.jcp.org/en/jsr/detail?id=366)。 所以Java EE 自身也是一项通过JCP严格审核的JSR。


Flowing from the above, and remember we did say that the JSR process requires every JSR to have a reference implementation, this means Java EE as an umbrella JSR must also have a reference implementation.

我们知道, 每个JSR都必须有一个JSR参考实现, 那么 Java EE 也是JSR, 也必须有一个参考实现。


So an implementation of the umbrella JSR or Java EE is what is commonly referred to as an application server. An app server essentially is a concrete implementation of the Java EE spec that you can actually run your code on. The reference implementation of Java EE is [Glassfish Application Server](https://github.com/javaee/glassfish).

Java EE 的实现通常被称为应用服务器. 应用服务器本质上是一个Java EE规范的具体实现, 可以执行JavaEE项目的代码. Java EE 的参考实现是 [Glassfish Application Server](https://github.com/javaee/glassfish)。


An application server generally abstracts you the developer away from a lot of mundane stuff that you would have had to manage on your own, like datasource pooling, caching, clustering, and other overheads.

应用服务器将开发人员必须管理的很多东西抽象出来, 如数据量连接池(datasource pooling)、缓存(caching)、集群(clustering) 等等。


The application server generally must also pass the TCK to be fully certified as being compliant with a given umbrella JSR. An app server is also the basis for the portability of Java EE. As a developer, you generally are encouraged to code against the javax.* packages, which is the standard Java EE package namespace.

通常应用服务器也必须通过相关JSR的TCK完全验证。这也是 Java EE 可移植性的基础. 作为开发人员, 您应该编写使用 `javax.*` 的代码, 这是Java EE 的标准命名空间。



Now because an app server is subject to a standard, using the Java EE package will mean you can swap out application servers and your code will generally run with little to no modifications. This is really powerful if you think about it.

既然有了应用服务器标准, 那么理论上可以无缝切换应用服务器, 而不需要修改代码. 仔细想想这真的强悍。


How so? Because for starters, no single application vendor can lock you in. Because you can swap out application servers, theoretically you could change vendors at any time should you be dissatisfied with one vendor.

遵守规范有什么优势呢?  你不会被绑死在某家应用服务器厂商. 你可以根据需要切换应用服务器, 想用哪家就用哪家。


There are a number of application vendors out there, some free some very expensive. Popular among the open source ones is[Payara Server](http://payara.fish), a Glassfish derived, fully patched, application server that is freely available for download.

市面上有很多种应用服务器, 其中有些分是免费的、还有一些则收费非常昂贵。 流行的开源的服务器是 [Payara Server](http://payara.fish), 是 Glassfish 的一个分支, 可以免费下载和使用。


So Java EE is an abstract spec and it’s concrete realization or implementation is what is called an application server. And as a JSR, the required reference implementation of Java EE is the Glassfish application server.

Java EE 是一个抽象的规范, 其具体实现是应用服务器(application server). 参考实现是 Glassfish。


In recent times, there has been much about microservices, and there has developed a school of thought that is convinced that given the application server-centric nature of Java EE, it is not suitable for microservices. In the next installment of this Java EE fundamentals series, we will be addressing that.


近年来, 微服务非常火爆, 有一种思想认为, Java EE应用服务器并不适用于微服务。我们将在下一节中进行讨论。




原文链接: <https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-an-application-server.html>

原文日期: 2017年06月29日

