# Java EE Fundamentals – What is Java EE?

#  1. Java EE简介 - JavaEE基础系列


What is Java EE? Like really what is?

什么是Java EE? 真的是你理解的那样吗?


[Java EE](https://is.gd/theoryee), formerly known as J2EE, at its core, is just a collection of _abstract, standardized specifications_ that prescribes solutions to commonly faced challenges in software development.

[Java EE](https://is.gd/theoryee), 原名J2EE, 其核心由一系列抽象的标准规范所组成, 是针对目前软件开发中所普遍面临问题的解决方案。


It’s important to note the words abstract in the above definition. This means that Java EE is just a set interfaces and contracts that provides a public facing API for developers.

注意以上定义中的"抽象"(abstract)这个词。 Java EE 只是一组接口和规范, 提供了面向开发者的 public API。


These abstract specifications are also said to be standardized. What does this also mean? It essentially means that the entire collection of Java EE APIs are published in accordance with well defined criteria set by experts in the subject field of the API.

这些抽象的规范, 也可以说成是标准。本质上, 所有的 Java EE API, 都是按照领域专家们所确定的标准发布的。



By standardized, it also means every Java EE API is gone through the rigorous process of the Java Community Process’s Java Specification Request program. The result of this process is a set of APIs that are industry tried and tested and are deemed to be here to stay.

通过标准化, Java Specification Request 流程中的每个 Java EE API 都经过了 Java Community Process 的严谨审核. 这个过程的结果,是一组经过生产检验和测试后, 被认为合理的API。


However, remember we said Java EE is abstract right? Well even though you will generally code against the Java EE APIs in the Javax.* packages namespace, you can’t run your application on Java EE per se.

但我们刚才说 Java EE 是抽象的对吧? 如果只是简单地使用 `javax.*` 包中的 Java EE API, 你的程序并不能跑起来。


To run a Java EE application, you will need a concrete implementation of Java EE. The official name given to the concrete implementation of Java EE is Application Server. I bet you’ve heard that before right?

因为你还需要 Java EE 具体实现的支撑。其官方的名字是 **Application Server** (应用服务器). 


An Application Server is basically a concrete implementation of the entire Java EE abstract specs. This means that you run your application coded using Java EE APIs on an Application Server.

Application Server,应用服务器, 基本上是 Java EE 规范的完整实现。可以将 Java EE 程序部署到任意一种 Application Server 上。


There are a number of application servers out there including [Payara Server](http://payara.fish), Apache TomEE, JBoss Wildfly among others.

应用服务器分为很多种, 如 Apache TomEE, IBM WebSphere, Oracle WebLogic, JBoss Wildfly, Payara Server 等等。

> 注意: 最流行的 Tomcat 只属于 Web Container、并不是 Application Server。其兄弟 TomEE 才是标准的应用服务器。

In the next installment of this post, we will take a deeper look at Application Servers and Java Specification Requests. Stay tuned.


在接下来的文章中, 我们将深入介绍 Application Servers 以及 Java Specification Request。请继续关注。


> 译者注: 并不是所有的JavaEE规范都很有市场, 例如 EJB、WebService 技术就因为笨重和开发效率低下,被Spring等技术所取代。
> 
> 猜测: Jigsaw 很可能生不逢时、在最需要的年代没出现、出现后可能会被微服务架构所替代。



原文链接: <https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-java-ee.html>

原文日期: 2017年07月17日

翻译日期: 2017年07月01日

翻译人员: 铁锚: <http://blog.csdn.net/renfufei>

