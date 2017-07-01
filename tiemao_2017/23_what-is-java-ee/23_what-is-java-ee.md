# Java EE Fundamentals – What is Java EE?

What is Java EE? Like really what is?

[Java EE](https://is.gd/theoryee), formerly known as J2EE, at its core, is just a collection of _abstract, standardized specifications_ that prescribes solutions to commonly faced challenges in software development.

It’s important to note the words abstract in the above definition. This means that Java EE is just a set interfaces and contracts that provides a public facing API for developers.

These abstract specifications are also said to be standardized. What does this also mean? It essentially means that the entire collection of Java EE APIs are published in accordance with well defined criteria set by experts in the subject field of the API.

By standardized, it also means every Java EE API is gone through the rigorous process of the Java Community Process’s Java Specification Request program. The result of this process is a set of APIs that are industry tried and tested and are deemed to be here to stay.

However, remember we said Java EE is abstract right? Well even though you will generally code against the Java EE APIs in the Javax.* packages namespace, you can’t run your application on Java EE per se.

To run a Java EE application, you will need a concrete implementation of Java EE. The official name given to the concrete implementation of Java EE is Application Server. I bet you’ve heard that before right?

An Application Server is basically a concrete implementation of the entire Java EE abstract specs. This means that you run your application coded using Java EE APIs on an Application Server.

There are a number of application servers out there including [Payara Server](http://payara.fish), Apache TomEE, JBoss Wildfly among others.

In the next installment of this post, we will take a deeper look at Application Servers and Java Specification Requests. Stay tuned.


原文链接: <https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-java-ee.html>

