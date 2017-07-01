# Java EE Fundamentals – What is a Java Specification Request (JSR)?

# 2.JSR简介 - JavaEE基础系列

> JSR, Java Specification Request, Java规范请求

In the [previous post](https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-java-ee.html), we looked at Java EE and what it means. We did mention that Java EE is made up of various components grouped into APIs under a program called the Java Specification Request (JSR).

在前面的[文章](https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-java-ee.html)中, 简要介绍了Java EE的含义. 我们提到, Java EE 由各种组件构成, 这些组件需要实现 Java Specification Request(JSR) 所规定的各种 API。


In this post, we are going to take a deeper look at what a JSR is. At its core, a Java Specification Request is a formal, open standard document proposal that is made by an individual or organization to the [Java Community Process](http://jcp.org/), that contains proposed changes, additions and improvements to the Java technology platform.

在本文中, 我们将深入了解JSR到底是什么. 

核心概念: 每个JSR都是正式的、开放的标准文档, 由个人或组织提交给 [Java Community Process](http://jcp.org/) 进行审议, 其中包括对Java技术平台的修改(changes),补充(additions)和改进(improvements)。


A number of very important points could be gleaned from the above definition. First is that a JSR is a formal document. What this means is that a JSR or a request for adding to the Java technology group must take a certain predefined format. A format defined by the JCP.

上述定义中的重点是: 

1、每个JSR都是正式的文档, JSR请求必须符合JCP规定的格式。


Secondly is that a JSR is an open standard document. What this means again, is that a JSR is a document that conforms to certain laid down rules and regulations regarding its distribution and contribution to it. It also means that whatever is contained in the JSR is easily accessible to anyone interested in assessing it.

2、JSR是开放的标准文档. JSR文档的分发和贡献符合某些法律条款. 任何人都可以很容易地获取这份文档。


Flowing thirdly from our definition of a Java Specification Request is that a JSR can be made by either an individual or organization. Essentially any member of the JCP can make a JSR. JCP membership is opened to the general public; free for individuals as well. So what this also means is that one cannot make a request to the JCP without being a member of the organization.

3、可以由个人或组织发起JSR请求。原则上, JCP 组织的会员都可以发起JSR. JCP会员对公众开放, 个人会员是免费的。 假如你不是JCP组织的会员, 也就不能发起JSR请求。

> 可以在官网注册JCP会员,当前是Oracle公司在维护。 注册向导: <https://jcp.org/en/participation/membership>


Then finally, a JSR is a document that proposed changes, additions and improvements to the Java technology platform. This means that every JSR is an addition of new features or bug fixes or general improvements, in one way or the other, to the Java technology stack.

4、JSR文档是对Java技术平台提出的修改,补充和改进. 每个JSR的目的都是对Java技术栈增加新功能、修正BUG或者进行某些方面的提升。


Every major API available on Java EE is actually a JSR specification that has gone through the process of being approved by the JCP. All JSRs have a process they have to go through to be approved by the JCP.

Java EE中的每个API, 实际上都是由某个JSR规范所定义的, 并且通过了JCP组织的审核. 所有JSR都有JCP审核的过程。


Once a JSR is approved by the JCP, it becomes a part of the Java stack and can be safely used in production. The JSR process ensures that only well tested technologies are made a part of the Java stack, preventing unnecessary bloat to the platform in the form of adding fad technologies.

一旦某个 JSR通过了JCP的审核, 它就变成了Java技术栈的一部分, 可以安全地用于生产环境. JSR的审核过程确保了只有可靠稳定的技术才能变成Java的一部分, 避免过度臃肿和膨胀。


The JSR process also ensures that APIs are careful crafted in such a way to preserve backward compatibility. If there is one thing Java is know for, it’s backward compatibility, and the JSR process ensures this very important Java feature is maintained.

JSR进程也保证了 API 是经过仔细设计的, 同时能保持向后兼容。向后兼容性就是说, 老版本中的Java平台存在某个功能/API, JSR进程就确保在新版本中可以继续使用【这不包括第三方API和私有API】。


As a JSR is just an abstract specification, it needs some form of implementation to be any useful. That is where the concept of reference implementation comes in. Let’s look at that our the next installment of this Java EE fundamentals series.


每个JSR都只是一个抽象的规范, 需要一种具体的实现。这就是参考实现的概念。请关注 Java EE 系列的下一篇文章。




原文链接: <https://pedanticdevs.com/2017/06/java-ee-fundamentals-java-specification-request-what-is-a-jsr.html>

原文日期: 2017年06月23日

翻译日期: 2017年07月01日

翻译人员: 铁锚: <http://blog.csdn.net/renfufei>

