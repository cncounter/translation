# Java EE Fundamentals – What is an Application Server?

This is the fourth in the Java EE Fundamentals series

[Java EE Fundamentals – What is Java EE?](https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-java-ee.html)

[Java EE Fundamentals – What is a Java Specification Request (JSR)?](https://pedanticdevs.com/2017/06/java-ee-fundamentals-java-specification-request-what-is-a-jsr.html)

[Java EE Fundamentals – What is a JSR Reference Implementation?](https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-a-jsr-reference-implementation.html)

In the previous post, we talked about what a JSR reference implementation is. Also in our definition of [Java EE](https://www.udemy.com/the-theory-and-practice-of-java-ee-for-java-software-developers/learn/v4/), we did mention that it is a collection of abstract specifications. Now Java EE itself, is a Java Specification Request.

Better still, Java EE is what is termed an umbrella JSR in that it encapsulates a number of JSRs. So Java EE 7 for instance, is [JSR 342](https://www.jcp.org/en/jsr/detail?id=342). Java EE 8 is [JSR 366](https://www.jcp.org/en/jsr/detail?id=366). So Java EE itself is a JSR that goes through the JCP JSR process and is subject to the requirements of every JSR.

Flowing from the above, and remember we did say that the JSR process requires every JSR to have a reference implementation, this means Java EE as an umbrella JSR must also have a reference implementation.

So an implementation of the umbrella JSR or Java EE is what is commonly referred to as an application server. An app server essentially is a concrete implementation of the Java EE spec that you can actually run your code on. The reference implementation of Java EE is [Glassfish Application Server](https://github.com/javaee/glassfish).

An application server generally abstracts you the developer away from a lot of mundane stuff that you would have had to manage on your own, like datasource pooling, caching, clustering, and other overheads.

The application server generally must also pass the TCK to be fully certified as being compliant with a given umbrella JSR. An app server is also the basis for the portability of Java EE. As a developer, you generally are encouraged to code against the javax.* packages, which is the standard Java EE package namespace.

Now because an app server is subject to a standard, using the Java EE package will mean you can swap out application servers and your code will generally run with little to no modifications. This is really powerful if you think about it.

How so? Because for starters, no single application vendor can lock you in. Because you can swap out application servers, theoretically you could change vendors at any time should you be dissatisfied with one vendor.

There are a number of application vendors out there, some free some very expensive. Popular among the open source ones is[Payara Server](http://payara.fish), a Glassfish derived, fully patched, application server that is freely available for download.

So Java EE is an abstract spec and it’s concrete realization or implementation is what is called an application server. And as a JSR, the required reference implementation of Java EE is the Glassfish application server.

In recent times, there has been much about microservices, and there has developed a school of thought that is convinced that given the application server-centric nature of Java EE, it is not suitable for microservices. In the next installment of this Java EE fundamentals series, we will be addressing that.























原文链接: <https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-an-application-server.html>

原文日期: 2017年06月29日

