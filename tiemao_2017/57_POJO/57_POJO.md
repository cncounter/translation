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

术语仍然旧条款的模式技术,不使用新奇的特性,如锅(普通电话服务)电话和Pod在Perl(旧的纯文本文档).上相当于POJO。净框架是普通CLR对象(略)。[3]为PHP,这是普通PHP对象(泡泡)。

The POJO phenomenon has most likely gained widespread acceptance because of the need for a common and easily understood term that contrasts with complicated object frameworks.[citation needed]

POJO现象最有可能得到广泛的接受,因为需要一个共同的和容易理解的术语,与复杂的对象框架。[引文需要]

## Definition

## 定义

Ideally speaking, a POJO is a Java object not bound by any restriction other than those forced by the Java Language Specification; i.e. a POJO **should not** have to

理论上讲,一个POJO是一个Java对象不受任何限制其他比Java语言规范强制的;即一个POJO * *不* *

1.  Extend prespecified classes, as in

```java
public class Foo extends javax.servlet.http.HttpServlet { ...

```

2.  Implement prespecified interfaces, as in

2. 实现指定的接口,如

```java
public class Bar implements javax.ejb.EntityBean { ...

```

3.  Contain prespecified [annotations](https://en.wikipedia.org/wiki/Java_annotation "Java annotation"), as in

3. 包含指定[注释](https://en.wikipedia.org/wiki/Java_annotation“Java注释”),如

```java
@javax.persistence.Entity public class Baz { ...

```

However, due to technical difficulties and other reasons, many software products or frameworks described as POJO-compliant actually still require the use of prespecified annotations for features such as persistence to work properly. The idea is that if the object (actually class) was a POJO before any annotations were added, and would return to POJO status if the annotations are removed then it can still be considered a POJO. Then the basic object remains a POJO in that it has no special characteristics (such as an implemented interface) that makes it a "Specialized Java Object" (SJO or (sic) SoJO).

然而,由于技术上的困难和其他原因,许多软件产品或框架描述为POJO-compliant实际上仍然需要指定注释的使用特性,比如坚持正常工作.实际上我们的想法是,如果对象(类)是一个POJO之前添加了注释,并将返回POJO状态如果注释删除然后它仍然可以被认为是一个POJO.然后基本的对象仍然是一个POJO,它没有特色(如一个接口实现),使其成为一个“专业Java对象”(SJO或(原文如此)SoJO)。

## Contextual variations

## 上下文的变化

### JavaBeans

### javabean

A [JavaBean](https://en.wikipedia.org/wiki/JavaBean "JavaBean") is a POJO that is [serializable](https://en.wikipedia.org/wiki/Serialization#Java "Serialization"), has a no-argument [constructor](https://en.wikipedia.org/wiki/Constructor_(computer_science) "Constructor (computer science)"), and allows access to properties using [getter and setter methods](https://en.wikipedia.org/wiki/Mutator_method "Mutator method") that follow a simple naming convention. Because of this convention, simple declarative references can be made to the properties of arbitrary JavaBeans. Code using such a declarative reference does not have to know anything about the type of the bean, and the bean can be used with many frameworks without these frameworks having to know the exact type of the bean. The JavaBeans specification, if fully implemented, slightly breaks the POJO model as the class must implement the [Serializable](https://en.wikipedia.org/wiki/Serialization#Java "Serialization") interface to be a true JavaBean. Many POJO classes still called JavaBeans do not meet this requirement. Since [Serializable](https://en.wikipedia.org/wiki/Serialization "Serialization") is a marker (method-less) interface, this is not much of a burden.

(JavaBean)(https://en.wikipedia.org/wiki/JavaBean“对象”)是一个POJO(序列化)(https://en.wikipedia.org/wiki/Serialization # Java“序列化”),有一个无参数构造函数(https://en.wikipedia.org/wiki/Constructor_(computer_science)“构造函数(计算机科学)”),并允许访问属性使用getter和setter方法(https://en.wikipedia.org/wiki/Mutator_method Mutator方法),遵循一个简单的命名约定。因为本公约,简单声明属性的引用可以任意的javabean.代码使用这样一个声明引用不需要知道任何关于类型的bean,与许多框架可以使用bean没有这些框架需要知道确切的类型的bean.JavaBeans规范,如果完全实现,略休息POJO模型的类必须实现Serializable(https://en.wikipedia.org/wiki/Serialization # Java序列化)接口是一个真正的JavaBean。许多POJO类仍然叫javabean不符合这个要求。因为(序列化)(https://en.wikipedia.org/wiki/Serialization“序列化”)是一个标记(method-less)接口,这不是太大的负担。

The following shows an example of a [JavaServer Faces](https://en.wikipedia.org/wiki/JavaServer_Faces "JavaServer Faces") (JSF) component having a [bidirectional](https://en.wikipedia.org/wiki/Duplex_(telecommunications) "Duplex (telecommunications)") binding to a POJO's property:

下面展示了一个示例(JavaServer Faces)(https://en.wikipedia.org/wiki/JavaServer_Faces JavaServer Faces)(JSF)组件(双向)(https://en.wikipedia.org/wiki/Duplex_(电信)“满足”(电信))binding to a POJO的财产:

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

因为JavaBean命名约定单一“someProperty”引用可以自动翻译“getSomeProperty()”(或“isSomeProperty()“如果[布尔的属性 类型)(https://en.wikipedia.org/wiki/Boolean_type“布尔类型”))方法获取一个值,和“setSomeProperty(字符串)“方法设置一个值。

### Transparently adding services

### 透明地添加服务

As designs using POJOs have become more commonly used, systems have arisen that give POJOs the full functionality used in frameworks and more choice about which areas of functionality are actually needed. In this model, the programmer creates nothing more than a POJO. This POJO purely focuses on [business logic](https://en.wikipedia.org/wiki/Business_logic "Business logic") and has no dependencies on (enterprise) frameworks. [Aspect-oriented programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming "Aspect-oriented programming") (AOP) frameworks then transparently add cross-cutting concerns like persistence, transactions, security, and so on.

使用pojo的设计变得更加常用,系统出现给pojo中使用的完整功能框架和更多的选择哪些领域的功能实际上是必要的.在这个模型中,程序员创建一个POJO。这个POJO纯粹关注业务逻辑(https://en.wikipedia.org/wiki/Business_logic“业务逻辑”)和没有依赖关系(企业)框架。面向方面的编程(https://en.wikipedia.org/wiki/Aspect-oriented_programming“面向方面编程”)(AOP)框架然后透明地添加横切关注点,如持久性、事务、安全性,等等。

[Spring](https://en.wikipedia.org/wiki/Spring_Framework "Spring Framework") was an early implementation of this idea and one of the driving forces behind popularizing this model.

(春天)(https://en.wikipedia.org/wiki/Spring_Framework“Spring框架”)是一个早期实施这个想法和推广这种模式背后的驱动力之一。

An example of an EJB bean being a POJO:

一个EJB bean是一个POJO的例子:

*   [Enterprise JavaBeans](https://en.wikipedia.org/wiki/Enterprise_JavaBeans "Enterprise JavaBeans") (EJB),
*   [Java Persistence API](https://en.wikipedia.org/wiki/Java_Persistence_API "Java Persistence API") (JPA) (including [Hibernate](https://en.wikipedia.org/wiki/Hibernate_(Java) "Hibernate (Java)"))
*   [CDI (Contexts and Dependency Injection for the Java EE platform)](http://jcp.org/en/jsr/summary?id=299)

*(Enterprise javabean)(https://en.wikipedia.org/wiki/Enterprise_JavaBeans Enterprise javabean)(EJB),
*[](API https://en.wikipedia.org/wiki/Java_Persistence_API爪哇持久性”(API爪哇坚忍不拔的JPA)”)(包括[Hibernate](https://en.wikipedia.org/wiki/Hibernate_(爪哇)“Hibernate(爪哇)”))
*(CDI(Java EE平台的上下文和依赖注入))(http://jcp.org/en/jsr/summary?id=299)

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

鉴于,豆不需要扩展任何EJB类或实现任何EJB接口,也不需要包含任何EJB注释.相反,程序员声明在一个外部文件(XML)(https://en.wikipedia.org/wiki/XML“XML”)应该被添加到bean:EJB服务

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

因此,作为替代XML,许多框架(如弹簧、EJB和JPA)允许注释,而不是使用或除了XML.下面显示了相同的EJB bean如上显示,但是添加了一个注释。在这种情况下,XML文件不再需要:

```java
@Stateless
public class HelloWorldService {

    public String sayHello() {
        return "Hello, world!";
    }
}

```

With the annotation as given above the bean isn't a truly pure POJO anymore, but since annotations are merely passive metadata this has far fewer harmful drawbacks compared to the invasiveness of having to extend classes and/or implement interfaces. Accordingly, the programming model is still very much like the pure POJO model.

与注释上面给出的bean并不是一个真正纯粹的POJO,但由于仅仅是被动的元数据注释这相比有更少的有害缺陷的侵袭性扩展类和/或接口实现.因此,编程模型还很像纯POJO模型。

## See also

## 另请参阅

*   [Data transfer object](https://en.wikipedia.org/wiki/Data_transfer_object "Data transfer object") (DTO)
*   [Anemic domain model](https://en.wikipedia.org/wiki/Anemic_domain_model "Anemic domain model")

*(数据传输对象)(https://en.wikipedia.org/wiki/Data_transfer_object数据传输对象)(DTO)
*(贫血领域模型)(https://en.wikipedia.org/wiki/Anemic_domain_model域模型)



# Understanding POJOs

> From <https://spring.io/understanding/POJO>

> 从< https://spring.io/understanding/POJO >

POJO means **Plain Old Java Object**. It refers to a Java object (instance of definition) that isn't bogged down by framework extensions.

POJO意味着* * * *普通Java对象。它指的是一个Java对象(实例定义)这不是框架扩展的泥潭。

For example, to receive messages from JMS, you need to write a class that implements the `MessageListener` interface.

例如,JMS接收消息,您需要编写一个类,它实现了`MessageListener`接口。

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

这关系你的代码到一个特定的解决方案(在这个例子中JMS),以后很难迁移到另一个消息传递解决方案.如果您构建您的应用程序有很多听众,选择AMQP或别的东西可以变得很难或不可能基于咬掉这么多技术债务。

A POJO-driven approach means writing your message handling solution free of interfaces.

POJO-driven方法意味着编写消息处理解决方案的接口。

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

在这个例子中,您的代码不直接绑定到任何接口。相反,连接到一个JMS队列的责任是进入注释,这是容易更新.在这个特定的例子中,你可以替换`@JmsListener`与`@RabbitListener`。在其他情况下,可以基于pojo的解决方案没有任何具体的注释。

This is just one example. It is not meant to illustrate JMS vs. RabbitMQ, but instead the value of coding without being tied to specific interfaces. By using **plain old Java objects**, your code can be much simpler. This lends itself to better testing, flexibility, and ability to make new decisions in the future.

这只是一个例子。这不是为了说明JMS和RabbitMQ,而是编码的值没有被绑定到特定的接口.通过使用* * * *普通Java对象,代码可以简单得多。这有助于更好地测试、灵活性和能力在未来做出新的决定。

The Spring Framework and its various portfolio projects are always aiming for ways to reduce coupling between your code and existing libraries. This is a principle concept of dependency injection, where the way your service is utilized should be part of wiring the application and not the service itself.

Spring框架和它的各种组合项目总是瞄准方法来减少代码之间的耦合和现有的库.这是一个依赖注入的原理概念,您的服务的方式是利用应该是连接应用程序的一部分,而不是服务本身。


# What is POJO in Java?

# 用Java POJO是什么?

> From <https://www.quora.com/What-is-POJO-in-Java>

> 从https://www.quora.com/What-is-POJO-in-Java > <

POJO stands for “Plain Old Java Object” — it’s a pure data structure that has fields with getters and possibly setters, and may override some methods from Object (e.g. equals) or some other interface like Serializable, but does not have behavior of its own. It’s the Java equivalent of a C `struct`

POJO代表“普通旧式Java对象”——这是一个纯粹的数据结构,字段getter和setter,并且可能覆盖一些方法从对象(如.equals)或some,目的Serializable like界面other减损父母亲of its own。“the爪哇差别of a C`struct`

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

一旦你开始添加方法,操作点,向量加法或复杂的乘法,你不再有一个POJO。

POJOs can have all of their methods defined automatically based on their field names and types — IDEs can do this for you, but the most elegant way is to use the annotations defined by [Project Lombok](https://projectlombok.org/):

pojo可以定义所有的方法自动根据字段名称和类型——ide可以为你这样做,但最优雅的方式是使用定义的注释(Project Lombok)(https://projectlombok.org/):

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

