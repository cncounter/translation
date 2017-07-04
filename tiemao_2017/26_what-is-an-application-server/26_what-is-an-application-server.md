# Java EE Fundamentals – What is an Application Server?

# JavaEE基础系列—— 什么是应用服务器?


This is the fourth in the Java EE Fundamentals series

这是第四个Java EE基本面系列


[Java EE Fundamentals – What is Java EE?](https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-java-ee.html)

(Java EE基本面——Java EE是什么?)(https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-java-ee.html)


[Java EE Fundamentals – What is a Java Specification Request (JSR)?](https://pedanticdevs.com/2017/06/java-ee-fundamentals-java-specification-request-what-is-a-jsr.html)

[Java EE基本面- Java规范(JSR)请求是什么?)(https://pedanticdevs.com/2017/06/java-ee-fundamentals-java-specification-request-what-is-a-jsr.html)


[Java EE Fundamentals – What is a JSR Reference Implementation?](https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-a-jsr-reference-implementation.html)

(Java EE基本面——JSR参考实现是什么?)(https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-a-jsr-reference-implementation.html)


In the previous post, we talked about what a JSR reference implementation is. Also in our definition of [Java EE](https://www.udemy.com/the-theory-and-practice-of-java-ee-for-java-software-developers/learn/v4/), we did mention that it is a collection of abstract specifications. Now Java EE itself, is a Java Specification Request.

在前面的帖子,我们讨论了什么是JSR参考实现。也在我们的定义(Java EE)(https://www.udemy.com/the-theory-and-practice-of-java-ee-for-java-software-developers/learn/v4/),我们提到这是一个抽象的规范集合。现在Java EE本身,是一个Java规范要求。


Better still, Java EE is what is termed an umbrella JSR in that it encapsulates a number of JSRs. So Java EE 7 for instance, is [JSR 342](https://www.jcp.org/en/jsr/detail?id=342). Java EE 8 is [JSR 366](https://www.jcp.org/en/jsr/detail?id=366). So Java EE itself is a JSR that goes through the JCP JSR process and is subject to the requirements of every JSR.

更好的是,Java EE就是称为伞JSR,它封装了一些JSR。例如,Java EE 7是[JSR 342](https://www.jcp.org/en/jsr/detail?id=342).Java EE 8[JSR 366](https://www.jcp.org/en/jsr/detail?id=366)。所以Java EE本身就是一个JSR穿过JCP JSR进程,每一个JSR的需求。


Flowing from the above, and remember we did say that the JSR process requires every JSR to have a reference implementation, this means Java EE as an umbrella JSR must also have a reference implementation.

流动从上面,记得我们说JSR过程需要每一个JSR参考实现,这意味着Java EE伞JSR也必须有一个参考实现。


So an implementation of the umbrella JSR or Java EE is what is commonly referred to as an application server. An app server essentially is a concrete implementation of the Java EE spec that you can actually run your code on. The reference implementation of Java EE is [Glassfish Application Server](https://github.com/javaee/glassfish).

所以伞JSR的实现或Java EE是通常被称为一个应用程序服务器.一个应用程序服务器本质上是一个Java EE规范的具体实现,你可以运行您的代码.Java EE的参考实现(Glassfish应用服务器)(https://github.com/javaee/glassfish)。


An application server generally abstracts you the developer away from a lot of mundane stuff that you would have had to manage on your own, like datasource pooling, caching, clustering, and other overheads.

应用程序服务器一般抽象你开发人员远离很多世俗的东西,你必须管理自己,像数据源池、缓存、集群,


The application server generally must also pass the TCK to be fully certified as being compliant with a given umbrella JSR. An app server is also the basis for the portability of Java EE. As a developer, you generally are encouraged to code against the javax.* packages, which is the standard Java EE package namespace.

应用服务器通常也必须通过TCK完全认证是符合给定的雨伞JSR。应用程序服务器也是Java EE的可移植性的基础.


Now because an app server is subject to a standard, using the Java EE package will mean you can swap out application servers and your code will generally run with little to no modifications. This is really powerful if you think about it.

现在因为一个应用服务器的标准,使用Java EE的包将意味着你可以替换应用程序服务器和你的代码通常会运行没有修改.如果你仔细想想这真是强大。


How so? Because for starters, no single application vendor can lock you in. Because you can swap out application servers, theoretically you could change vendors at any time should you be dissatisfied with one vendor.

所以如何?因为首先,没有一个应用程序供应商可以锁定你.因为你可以替换应用程序服务器,理论上你可以改变供应商在任何时候你应该不满意供应商之一。


There are a number of application vendors out there, some free some very expensive. Popular among the open source ones is[Payara Server](http://payara.fish), a Glassfish derived, fully patched, application server that is freely available for download.

有许多应用程序供应商,一些自由非常昂贵。流行的开源的Payara服务器(http://payara.鱼),Glassfish派生,完全修补,免费下载的应用程序服务器。


So Java EE is an abstract spec and it’s concrete realization or implementation is what is called an application server. And as a JSR, the required reference implementation of Java EE is the Glassfish application server.

所以Java EE规范是一个抽象和具体实现或实现所谓的应用程序服务器.作为一个JSR,所需的参考实现Java EE的Glassfish应用服务器。


In recent times, there has been much about microservices, and there has developed a school of thought that is convinced that given the application server-centric nature of Java EE, it is not suitable for microservices. In the next installment of this Java EE fundamentals series, we will be addressing that.


近年来,已经有很多关于microservices,已经开发出一种思想学派,相信给Java EE应用服务器为中心的本质,它是不适合microservices。在Java EE基本面系列的下一篇文章中,我们将解决它。

























原文链接: <https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-an-application-server.html>

原文日期: 2017年06月29日

