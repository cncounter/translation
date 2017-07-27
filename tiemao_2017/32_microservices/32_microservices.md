# Java EE Fundamentals – Microservices

This is the fifth post in the [Java EE](https://is.gd/theoryee) Fundamentals series

[Java EE Fundamentals – What is Java EE?](https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-java-ee.html)
[Java EE Fundamentals – What is a Java Specification Request (JSR)?](https://pedanticdevs.com/2017/06/java-ee-fundamentals-java-specification-request-what-is-a-jsr.html)
[Java EE Fundamentals – What is a Reference Implementation?](https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-a-jsr-reference-implementation.html)
[Java EE Fundamentals – What is an Application Server?](https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-an-application-server.html)

[Microservices](https://en.wikipedia.org/wiki/Microservices) is the latest software architecture that seems to be the buzzword of the day. It has been around in[ one form](https://en.wikipedia.org/wiki/Service-oriented_architecture) or the other since the early days of software engineering.

Essentially microservices means breaking down applications into distinct components that all coordinate to form a whole. Now there are arguments against Java EE given it’s application server centric nature. There are those that think Java EE is heavy and geared towards the monolith style of application development.

However, this is very incorrect. In fact, Java EE is more than suitable for a microservices architecture. At its core, microservices basically means an application being self-contained in terms of its runtime dependencies. Meaning generally the application has a small footprint and can theoretically be deployed to almost any usable platform.

Java EE has tools available that make it super easy to create a microservices oriented application with it. The following 4 tools are more than enough to create any kind of microservices with Java EE.

# **Payara Micro**

[Payara Micro](https://www.payara.fish/payara_micro) is a microservices geared version of the popular, open source, Glassfish derived Payara Server. Payara Micro is designed for running Java EE applications in a modern containerized / virtualized infrastructure, using automated provisioning tools like Chef, Ansible or Puppet. Payara Micro makes it easy to java -jar your Java EE application.

# **JBoss Wildfly Swarm**

[WildFly Swarm](http://wildfly-swarm.io/) offers an innovative approach to packaging and running Java EE applications by packaging them with just enough of the server runtime to “java -jar” your application. Essentially it bundles your Java EE dependencies with your application making your resulting war/jar self contained.

# **KumuluzEE**

[KumuluzEE](https://ee.kumuluz.com/) is a lightweight open-source microservice framework. It’s raison d’être is to help you develop microservices with Java EE technologies and also migrate existing Java EE applications to a microservices architecture.

# **Apache Meecrowave**

[Apache Meecrowave](http://openwebbeans.apache.org/meecrowave/index.html#) is a lightweight JAX-RS, CDI and JSON server.  Meecrowave is suitable for developing microservices using the mentioned Java EE APIs. In fact, the CDI runtime that powers Meecrowave – OpenWebBeans – recently became[ CDI 2.0 (JSR 365)](https://is.gd/ee7cdi)compatible.

In subsequent posts, we will be taking all these tools one after the other and examine them in detail complete with code samples.



[JULY 23, 2017](https://pedanticdevs.com/2017/07/java-ee-fundamentals-microservices.html) BY [SEERAJ](https://pedanticdevs.com/author/seeraj)

