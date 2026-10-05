# Plain old Java object

# Java基础: POJO简介

> POJO, Plain old Java object, 纯粹的老式Java对象, 相对于 JavaBean 而言

From Wikipedia, the free encyclopedia

维基百科介绍如下:

In software engineering, a plain old Java object (POJO) is an ordinary Java object, not bound by any special restriction and not requiring any class path. The term was coined by Martin Fowler, Rebecca Parsons and Josh MacKenzie in September 2000: [1]

在软件工程领域中, plain old Java object (POJO) 属于一种普通的Java对象, 不受其他任何约束和限制, 也不需要依赖(Java标准库之外的)其他类. 这个词由 [Martin Fowler](https://www.martinfowler.com/bliki/POJO.html), Rebecca Parsons 和 Josh MacKenzie, 在准备2000年9月份的一次会议时所创造:


> In the talk we were pointing out the many benefits of encoding business logic into regular java objects rather than using Entity Beans. We wondered why people were so against using regular objects in their systems and concluded that it was because simple objects lacked a fancy name. So we gave them one, and it's caught on very nicely.

> 和Entity Bean比起来, 将业务逻辑编码到普通java对象中会有很多好处。但为什么人们不愿意这样做呢? 我们在讨论过程中得出结论： 因为名字太土、一点都不高大上。 于是我们就取了这么一个花哨的名字。 


The term "POJO" initially denoted a Java object which does not follow any of the major Java object models, conventions, or frameworks; nowadays "POJO" may be used as an acronym for "Plain Old JavaScript Object" as well, in which case the term denotes a JavaScript object of similar pedigree.[2]

"POJO" 一词最初表示普通的Java对象, 普通到什么地步呢? 那就是不需要遵循任何主流的 Java对象模型、约定,以及框架约束; 当然现在 "POJO" 也可能用来表示 "[Plain Ole JavaScript Object](http://ajaxian.com/archives/return-of-the-pojo-plain-ole-javascript)" 的缩写, 这时候表示类似的JavaScript对象。

The term continues the pattern of older terms for technologies that do not use fancy new features, such as POTS (Plain Old Telephone Service) in telephony and Pod (Plain Old Documentation) in Perl. The equivalent to POJO on the .NET framework is Plain Old CLR Object (POCO).[3] For PHP, it is Plain Old PHP Object (POPO).

这个术语延续了以往那些不使用花哨新特性的技术术语的命名模式, 例如电话领域的 POTS(Plain Old Telephone Service, 普通老式电话服务), 以及 Perl 中的 POD(Plain Old Documentation, 普通老式文档)。在 .NET 框架中, 与 POJO 对应的是 POCO(Plain Old CLR Object)[3]; 在 PHP 中则是 POPO(Plain Old PHP Object)。

The POJO phenomenon has most likely gained widespread acceptance because of the need for a common and easily understood term that contrasts with complicated object frameworks.[citation needed]

POJO 现象之所以能被广泛接受, 最可能是因为人们需要一个通俗易懂、且与复杂对象框架形成对照的术语。[需要引用]

## Definition

## 定义

Ideally speaking, a POJO is a Java object not bound by any restriction other than those forced by the Java Language Specification; i.e. a POJO **should not** have to

理论上讲, 一个 POJO 是不受除 Java 语言规范强制要求之外的任何约束的 Java 对象; 也就是说, 一个 POJO **不应** 被迫:

1.  Extend prespecified classes, as in

1. 继承预先指定的类, 例如

```java
public class Foo extends javax.servlet.http.HttpServlet { ...

```

2.  Implement prespecified interfaces, as in

2. 实现指定的接口,如

```java
public class Bar implements javax.ejb.EntityBean { ...

```

3.  Contain prespecified [annotations](https://en.wikipedia.org/wiki/Java_annotation "Java annotation"), as in

3. 包含预先指定的[注解](https://en.wikipedia.org/wiki/Java_annotation "Java annotation"), 例如

```java
@javax.persistence.Entity public class Baz { ...

```

However, due to technical difficulties and other reasons, many software products or frameworks described as POJO-compliant actually still require the use of prespecified annotations for features such as persistence to work properly. The idea is that if the object (actually class) was a POJO before any annotations were added, and would return to POJO status if the annotations are removed then it can still be considered a POJO. Then the basic object remains a POJO in that it has no special characteristics (such as an implemented interface) that makes it a "Specialized Java Object" (SJO or (sic) SoJO).

然而, 由于技术上的困难以及其他原因, 许多号称符合 POJO 的软件产品或框架, 实际上仍然要求使用预先指定的注解, 才能让持久化之类的功能正常工作。其思路是: 如果某个对象(实际上是类)在添加任何注解之前是一个 POJO, 并且在移除这些注解后又能恢复为 POJO, 那么它仍然可以被视为 POJO。此时基础对象依然是 POJO, 因为它没有使其成为"专用 Java 对象"(SJO 或 (原文如此) SoJO) 的特殊特征(例如实现了某个接口)。

## Contextual variations

## 上下文的变化

### JavaBeans

### javabean

A [JavaBean](https://en.wikipedia.org/wiki/JavaBean "JavaBean") is a POJO that is [serializable](https://en.wikipedia.org/wiki/Serialization#Java "Serialization"), has a no-argument [constructor](https://en.wikipedia.org/wiki/Constructor_(computer_science) "Constructor (computer science)"), and allows access to properties using [getter and setter methods](https://en.wikipedia.org/wiki/Mutator_method "Mutator method") that follow a simple naming convention. Because of this convention, simple declarative references can be made to the properties of arbitrary JavaBeans. Code using such a declarative reference does not have to know anything about the type of the bean, and the bean can be used with many frameworks without these frameworks having to know the exact type of the bean. The JavaBeans specification, if fully implemented, slightly breaks the POJO model as the class must implement the [Serializable](https://en.wikipedia.org/wiki/Serialization#Java "Serialization") interface to be a true JavaBean. Many POJO classes still called JavaBeans do not meet this requirement. Since [Serializable](https://en.wikipedia.org/wiki/Serialization "Serialization") is a marker (method-less) interface, this is not much of a burden.

[JavaBean](https://en.wikipedia.org/wiki/JavaBean "JavaBean") 是一种 [可序列化](https://en.wikipedia.org/wiki/Serialization#Java "Serialization")、具有无参[构造方法](https://en.wikipedia.org/wiki/Constructor_(computer_science) "Constructor (computer science)")、并允许通过遵循简单命名约定的 [getter 和 setter 方法](https://en.wikipedia.org/wiki/Mutator_method "Mutator method") 访问属性的 POJO。正因为这一约定, 我们可以对任意 JavaBean 的属性使用简单的声明式引用。使用这种声明式引用的代码无需了解 bean 类型的任何信息, 而 bean 也可以被许多框架使用, 这些框架同样无需知道 bean 的确切类型。JavaBeans 规范如果被完全实现, 会在一定程度上破坏 POJO 模型, 因为类必须实现 [Serializable](https://en.wikipedia.org/wiki/Serialization#Java "Serialization") 接口才算真正的 JavaBean。许多仍被称为 JavaBean 的 POJO 类并不满足这一要求。由于 [Serializable](https://en.wikipedia.org/wiki/Serialization "Serialization") 只是一个标记(无方法)接口, 所以这不会带来太大负担。

The following shows an example of a [JavaServer Faces](https://en.wikipedia.org/wiki/JavaServer_Faces "JavaServer Faces") (JSF) component having a [bidirectional](https://en.wikipedia.org/wiki/Duplex_(telecommunications) "Duplex (telecommunications)") binding to a POJO's property:

下面展示了一个示例: 一个 [JavaServer Faces](https://en.wikipedia.org/wiki/JavaServer_Faces "JavaServer Faces")(JSF)组件与某个 POJO 的属性之间建立了[双向](https://en.wikipedia.org/wiki/Duplex_(telecommunications) "Duplex (telecommunications)")绑定:

```html
<h:inputText value="#{MyBean.someProperty}"/>

```

The definition of the POJO can be as follows:

POJO的定义可以如下:

```java
public class MyBean {

    private String someProperty;

    public String getSomeProperty() {
         return someProperty;
    }

    public void setSomeProperty(String someProperty) {
        this.someProperty = someProperty;
    }
}

```

Because of the JavaBean naming conventions the single "someProperty" reference can be automatically translated to the "getSomeProperty()" (or "isSomeProperty()" if the property is of [Boolean type](https://en.wikipedia.org/wiki/Boolean_type "Boolean type")) method for getting a value, and to the "setSomeProperty(String)" method for setting a value.

因为 JavaBean 命名约定的存在, 单个 "someProperty" 引用可以被自动转换为 "getSomeProperty()"(如果该属性是[布尔类型](https://en.wikipedia.org/wiki/Boolean_type "Boolean type"), 则转换为 "isSomeProperty()")方法来获取值, 并转换为 "setSomeProperty(String)" 方法来设置值。

### Transparently adding services

### 透明地添加服务

As designs using POJOs have become more commonly used, systems have arisen that give POJOs the full functionality used in frameworks and more choice about which areas of functionality are actually needed. In this model, the programmer creates nothing more than a POJO. This POJO purely focuses on [business logic](https://en.wikipedia.org/wiki/Business_logic "Business logic") and has no dependencies on (enterprise) frameworks. [Aspect-oriented programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming "Aspect-oriented programming") (AOP) frameworks then transparently add cross-cutting concerns like persistence, transactions, security, and so on.

随着使用 POJO 的设计变得越来越常见, 出现了一些系统, 它们赋予 POJO 框架中所用的完整功能, 并在真正需要哪些功能领域方面提供了更多选择。在这种模型中, 程序员只需创建一个 POJO。这个 POJO 纯粹专注于[业务逻辑](https://en.wikipedia.org/wiki/Business_logic "Business logic"), 不依赖任何(企业级)框架。随后, [面向切面编程](https://en.wikipedia.org/wiki/Aspect-oriented_programming "Aspect-oriented programming")(AOP)框架会透明地添加持久化、事务、安全等横切关注点。

[Spring](https://en.wikipedia.org/wiki/Spring_Framework "Spring Framework") was an early implementation of this idea and one of the driving forces behind popularizing this model.

[Spring](https://en.wikipedia.org/wiki/Spring_Framework "Spring Framework") 是这一思想的早期实现, 也是推广这种模型的驱动力之一。

An example of an EJB bean being a POJO:

一个EJB bean是一个POJO的例子:

*   [Enterprise JavaBeans](https://en.wikipedia.org/wiki/Enterprise_JavaBeans "Enterprise JavaBeans") (EJB),
*   [Java Persistence API](https://en.wikipedia.org/wiki/Java_Persistence_API "Java Persistence API") (JPA) (including [Hibernate](https://en.wikipedia.org/wiki/Hibernate_(Java) "Hibernate (Java)"))
*   [CDI (Contexts and Dependency Injection for the Java EE platform)](http://jcp.org/en/jsr/summary?id=299)

*   [Enterprise JavaBeans](https://en.wikipedia.org/wiki/Enterprise_JavaBeans "Enterprise JavaBeans") (EJB),
*   [Java Persistence API](https://en.wikipedia.org/wiki/Java_Persistence_API "Java Persistence API") (JPA)(包括 [Hibernate](https://en.wikipedia.org/wiki/Hibernate_(Java) "Hibernate (Java)"))
*   [CDI(Java EE 平台的上下文和依赖注入)](http://jcp.org/en/jsr/summary?id=299)

The following shows a fully functional EJB bean, demonstrating how EJB3 leverages the POJO model:

下面显示了一个全功能的EJB bean,演示EJB3使用POJO模型:

```java
public class HelloWorldService {

    public String sayHello() {
        return "Hello, world!";
    }
}
```

As given, the bean does not need to extend any EJB class or implement any EJB interface and also does not need to contain any EJB annotations. Instead, the programmer declares in an external [XML](https://en.wikipedia.org/wiki/XML "XML") file which EJB services should be added to the bean:

如上所示, 这个 bean 不需要继承任何 EJB 类, 也不需要实现任何 EJB 接口, 同样不需要包含任何 EJB 注解。相反, 程序员在一个外部 [XML](https://en.wikipedia.org/wiki/XML "XML") 文件中声明应向该 bean 添加哪些 EJB 服务:

```xml
<enterprise-beans>
    <session>
        <ejb-name>helloWorld</ejb-name>
        <ejb-class>com.example.HelloWorldService</ejb-class>
        <session-type>stateless</session-type>
    </session>
</enterprise-beans>
```

In practice, some people find annotations elegant, while they see XML as verbose, ugly and hard to maintain, yet others find annotations pollute the POJO model. 


在实践中,有些人觉得注释优雅,而他们认为XML是冗长的,丑陋的,而且难于维护,然而其他人发现注释污染POJO模型。

Thus, as an alternative to XML, many frameworks (e.g. Spring, EJB and JPA) allow annotations to be used instead of or in addition to XML. The following shows the same EJB bean as showed above but with an annotation added. In this case the XML file is no longer needed:

因此, 作为 XML 的替代方案, 许多框架(例如 Spring、EJB 和 JPA)允许使用注解来替代 XML, 或者与 XML 配合使用。下面展示了与上面相同的 EJB bean, 只是添加了一个注解。在这种情况下, 不再需要 XML 文件:

```java
@Stateless
public class HelloWorldService {

    public String sayHello() {
        return "Hello, world!";
    }
}

```

With the annotation as given above the bean isn't a truly pure POJO anymore, but since annotations are merely passive metadata this has far fewer harmful drawbacks compared to the invasiveness of having to extend classes and/or implement interfaces. Accordingly, the programming model is still very much like the pure POJO model.

加上上面给出的注解之后, 这个 bean 就不再是一个真正纯粹的 POJO 了, 但由于注解仅仅是被动的元数据, 与"必须继承类和/或实现接口"这种侵入性做法相比, 它的有害缺陷要少得多。因此, 这种编程模型仍然非常接近纯粹的 POJO 模型。

## See also

## 另请参阅

*   [Data transfer object](https://en.wikipedia.org/wiki/Data_transfer_object "Data transfer object") (DTO)
*   [Anemic domain model](https://en.wikipedia.org/wiki/Anemic_domain_model "Anemic domain model")

*   [数据传输对象](https://en.wikipedia.org/wiki/Data_transfer_object "Data transfer object")(DTO)
*   [贫血领域模型](https://en.wikipedia.org/wiki/Anemic_domain_model "Anemic domain model")



# Understanding POJOs

> From <https://spring.io/understanding/POJO>

> 从 <https://spring.io/understanding/POJO>

POJO means **Plain Old Java Object**. It refers to a Java object (instance of definition) that isn't bogged down by framework extensions.

POJO 意为 **Plain Old Java Object**(普通的 Java 对象)。它指的是一个不会被框架扩展所束缚的 Java 对象(定义的实例)。

For example, to receive messages from JMS, you need to write a class that implements the `MessageListener` interface.

例如, 要从 JMS 接收消息, 你需要编写一个实现了 `MessageListener` 接口的类。

```
public class ExampleListener implements MessageListener {

    public void onMessage(Message message) {
        if (message instanceof TextMessage) {
            try {
                System.out.println(((TextMessage) message).getText());
            }
            catch (JMSException ex) {
                throw new RuntimeException(ex);
            }
        }
        else {
            throw new IllegalArgumentException(<span class="pl-pds">"Message must be of type TextMessage"</span>);
        }
    }

}
```

This ties your code to a particular solution (JMS in this example) and makes it hard to later migrate to an alternative messaging solution. If you build your application with lots of listeners, choosing AMQP or something else can become hard or impossible based on biting off this much technical debt.

这会把你的代码绑定到某个特定的解决方案(本例中是 JMS), 使得日后迁移到其他消息传递方案变得困难。如果你在应用程序中使用了大量这样的监听器, 那么由于积累了这么多技术债, 选择 AMQP 或其他方案可能会变得困难甚至不可能。

A POJO-driven approach means writing your message handling solution free of interfaces.

POJO 驱动的方式意味着在不依赖接口的前提下编写消息处理方案。

```
@Component
public class ExampleListener {

    @JmsListener(destination = <span class="pl-pds">"myDestination"</span>)
    public void processOrder(String message) {
    	System.out.println(message);
    }
}
```

In this example, your code isn't directly tied to any interface. Instead, the responsibility of connecting it to a JMS queue is moved into annotations, which are easier to update. In this specific example, you could replace `@JmsListener` with `@RabbitListener`. In other situations, it's possible to have POJO-based solutions without ANY specific annotations.

在这个例子中, 你的代码并不直接绑定到任何接口。相反, 将其连接到 JMS 队列的职责被移到了注解里, 这样更容易更新。在这个特定的例子中, 你可以把 `@JmsListener` 替换为 `@RabbitListener`。在其他情况下, 也可以实现不带任何特定注解的基于 POJO 的方案。

This is just one example. It is not meant to illustrate JMS vs. RabbitMQ, but instead the value of coding without being tied to specific interfaces. By using **plain old Java objects**, your code can be much simpler. This lends itself to better testing, flexibility, and ability to make new decisions in the future.

这只是一个例子。它并不是要说明 JMS 与 RabbitMQ 孰优孰劣, 而是要说明在不绑定特定接口的前提下编码的价值。通过使用 **普通 Java 对象**, 你的代码可以简单得多。这有助于获得更好的可测试性、灵活性, 以及在未来做出新决策的能力。

The Spring Framework and its various portfolio projects are always aiming for ways to reduce coupling between your code and existing libraries. This is a principle concept of dependency injection, where the way your service is utilized should be part of wiring the application and not the service itself.

Spring 框架及其各种组合项目始终在寻求减少代码与现有库之间耦合的方法。这是依赖注入的一个核心原则: 你的服务被使用的方式, 应当属于应用程序装配的一部分, 而不是服务本身的一部分。


# What is POJO in Java?

# Java 中的 POJO 是什么?

> From <https://www.quora.com/What-is-POJO-in-Java>

> 从 <https://www.quora.com/What-is-POJO-in-Java>

POJO stands for “Plain Old Java Object” — it’s a pure data structure that has fields with getters and possibly setters, and may override some methods from Object (e.g. equals) or some other interface like Serializable, but does not have behavior of its own. It’s the Java equivalent of a C `struct`

POJO 代表“Plain Old Java Object”(普通老式 Java 对象)——它是一种纯粹的数据结构, 包含带 getter(可能还有 setter)的字段, 并且可以覆盖 Object 中的某些方法(例如 equals)或某个接口(如 Serializable)的方法, 但它本身不具有自己的行为。它相当于 Java 世界里的 C 语言 `struct`。

For example, this is a POJO:

例如,这是一个POJO:

```

1.  classPoint{
2.  privatedoublex;
3.  privatedoubley;
4.  publicdoublegetX(){returnx;}
5.  publicdoublegetY(){returny;}
6.  publicvoidsetX(doublev){x=v;}
7.  publicvoidsetY(doublev){y=v;}
8.  publicboolean equals(Objectother){...}
9.  }
```

As soon as you start adding methods that operate on points, like vector addition or complex multiplication, you no longer have a POJO.

一旦你开始添加对点进行操作的方法, 比如向量加法或复数乘法, 它就不再是一个 POJO 了。

POJOs can have all of their methods defined automatically based on their field names and types — IDEs can do this for you, but the most elegant way is to use the annotations defined by [Project Lombok](https://projectlombok.org/):

POJO 可以根据字段名称和类型自动定义它的所有方法 —— IDE 可以帮你做到这一点, 但最优雅的方式是使用 [Project Lombok](https://projectlombok.org/) 提供的注解:

```

1.  @Data
2.  classPoint{
3.  privatedoublex;
4.  privatedoubley;
5.  }
```


# 参考


- 维基百科: <https://en.wikipedia.org/wiki/Plain_old_Java_object>

- quora的回答: <https://www.quora.com/What-is-POJO-in-Java>

- Spring文档: <https://spring.io/understanding/POJO>
