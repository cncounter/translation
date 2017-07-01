# Java EE Fundamentals – What is a JSR Reference Implementation?

#  3. 什么是JSR参考实现 - JavaEE基础系列


This post is the third installment in the Java EE Fundamentals series

本文是JavaEE基础系列的第三节。


1. [Java EE简介 - JavaEE基础系列](http://blog.csdn.net/renfufei/article/details/74073705)
2. [JSR简介 - JavaEE基础系列](http://blog.csdn.net/renfufei/article/details/74074616)



In the previous post, we looked at what a JSR is. We did say that a JSR is an abstract request to the JCP that contains proposed additions to the Java technology platform.

上一节中, 我们介绍了什么是JSR。我们说, JSR就是一个提交到JCP的抽象请求，包含对Java技术平台的补充。


Because it is abstract, it cannot on its own be used in any way. A JSR needs to have some form of implementation, or concrete realization to be useful to us end developers. And that is where the concept of Reference Implementation comes in.


因为是抽象的，所以不能直接被调用。JSR需要有某种形式的实现, 或者有我们开发人员能直接使用的某种具现。这就是参考实现(Reference Implementation)的概念。



Every JSR must have a reference implementation, which is a concrete implementation of the specification contained in the JSR document. This is a requirement of the JCP. Every single JSR has a reference implementation that is freely available and mostly bundled with the application servers.

每个JSR都必须有一个参考实现, 就是JSR文档中对规范的一个具体实现。这是JCP的一项要求. 每个JSR都有其自身的一个参考实现, 可以自由使用, 一般是与应用服务器打包在一起发布。


A JSR also has TCK or Technology Compatibility Kit which is “a suite of tests that at least nominally checks a particular alleged implementation of a Java Specification Request (JSR) for compliance.”

JSR也含有一个TCK(Technology Compatibility Kit, 技术兼容性工具包), 这是一套测试工具, 用于测试一个特定的JSR实现是否符合规范的要求。


Essentially a TCK is used to test a JSR implementation for compliance to the spec. This is part of why Java EE is said to be a standardized set of specifications.

基本上,TCK是用来测试JSR实现是否符合规范。这也部分说明了, 为什么Java EE是一套标准化规范。


This rigorous process also ensures the quality of the APIs that are derived from the JSR document. Some popular RIs of some JSRs are

这个严格的过程也确保了JSR文档中API的质量。一些著名的JSR包括:



*   [JSR 380](https://jcp.org/en/jsr/detail?id=380) (Bean Validation 2.0)  – Hibernate Validator 6
*   [JSR 367](https://jcp.org/en/jsr/detail?id=367) (JSON-B Binding) – Eclipse Yasson 1.0
*   [JSR 370](https://jcp.org/en/jsr/detail?id=370) (JAX-RS 2.1) – Jersey
*   [JSR 365](https://jcp.org/en/jsr/detail?id=365) ([CDI 2.](https://is.gd/ee7cdi)0) – WELD 3.0



These are some of the new and popular JSRs and their respective reference implementations. And most of these reference implementations are bundled with applications servers, which is the subject of the next installment of this series.


以上是一些新的JSR和各自的参考实现。大多数参考实现都与应用服务器捆绑在一起， 但这是下一篇文章的主题了。



原文链接: <https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-a-jsr-reference-implementation.html>

原文日期: 2017年06月27日
