# Java EE Fundamentals – What is a JSR Reference Implementation?

This post is the third installment in the Java EE Fundamentals series

[Java EE Fundamentals – What is Java EE?](https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-java-ee.html)

[Java EE Fundamentals – What is a Java Specification Request (JSR)?](https://pedanticdevs.com/2017/06/java-ee-fundamentals-java-specification-request-what-is-a-jsr.html)

In the previous post, we looked at what a JSR is. We did say that a JSR is an abstract request to the JCP that contains proposed additions to the Java technology platform.

Because it is abstract, it cannot on its own be used in any way. A JSR needs to have some form of implementation, or concrete realization to be useful to us end developers. And that is where the concept of Reference Implementation comes in.

Every JSR must have a reference implementation, which is a concrete implementation of the specification contained in the JSR document. This is a requirement of the JCP. Every single JSR has a reference implementation that is freely available and mostly bundled with the application servers.

A JSR also has TCK or Technology Compatibility Kit which is “a suite of tests that at least nominally checks a particular alleged implementation of a Java Specification Request (JSR) for compliance.”

Essentially a TCK is used to test a JSR implementation for compliance to the spec. This is part of why Java EE is said to be a standardized set of specifications.

This rigorous process also ensures the quality of the APIs that are derived from the JSR document. Some popular RIs of some JSRs are

*   [JSR 380](https://jcp.org/en/jsr/detail?id=380) (Bean Validation 2.0)  – Hibernate Validator 6
*   [JSR 367](https://jcp.org/en/jsr/detail?id=367) (JSON-B Binding) – Eclipse Yasson 1.0
*   [JSR 370](https://jcp.org/en/jsr/detail?id=370) (JAX-RS 2.1) – Jersey
*   [JSR 365](https://jcp.org/en/jsr/detail?id=365) ([CDI 2.](https://is.gd/ee7cdi)0) – WELD 3.0

These are some of the new and popular JSRs and their respective reference implementations. And most of these reference implementations are bundled with applications servers, which is the subject of the next installment of this series.


原文链接: <https://pedanticdevs.com/2017/06/java-ee-fundamentals-what-is-a-jsr-reference-implementation.html>

原文日期: 2017年06月27日
