# Plain old Java object

From Wikipedia, the free encyclopedia


In software engineering, a plain old Java object (POJO) is an ordinary Java object, not bound by any special restriction and not requiring any class path. The term was coined by Martin Fowler, Rebecca Parsons and Josh MacKenzie in September 2000: [1]

> "We wondered why people were so against using regular objects in their systems and concluded that it was because simple objects lacked a fancy name. So we gave them one, and it's caught on very nicely."

The term "POJO" initially denoted a Java object which does not follow any of the major Java object models, conventions, or frameworks; nowadays "POJO" may be used as an acronym for "Plain Old JavaScript Object" as well, in which case the term denotes a JavaScript object of similar pedigree.[2]

The term continues the pattern of older terms for technologies that do not use fancy new features, such as POTS (Plain Old Telephone Service) in telephony and Pod (Plain Old Documentation) in Perl. The equivalent to POJO on the .NET framework is Plain Old CLR Object (POCO).[3] For PHP, it is Plain Old PHP Object (POPO).

The POJO phenomenon has most likely gained widespread acceptance because of the need for a common and easily understood term that contrasts with complicated object frameworks.[citation needed]


## Definition

Ideally speaking, a POJO is a Java object not bound by any restriction other than those forced by the Java Language Specification; i.e. a POJO **should not** have to

1.  Extend prespecified classes, as in

```java
public class Foo extends javax.servlet.http.HttpServlet { ...

```

2.  Implement prespecified interfaces, as in

```java
public class Bar implements javax.ejb.EntityBean { ...

```

3.  Contain prespecified [annotations](https://en.wikipedia.org/wiki/Java_annotation "Java annotation"), as in

```java
@javax.persistence.Entity public class Baz { ...

```

However, due to technical difficulties and other reasons, many software products or frameworks described as POJO-compliant actually still require the use of prespecified annotations for features such as persistence to work properly. The idea is that if the object (actually class) was a POJO before any annotations were added, and would return to POJO status if the annotations are removed then it can still be considered a POJO. Then the basic object remains a POJO in that it has no special characteristics (such as an implemented interface) that makes it a "Specialized Java Object" (SJO or (sic) SoJO).

## Contextual variations

### JavaBeans

A [JavaBean](https://en.wikipedia.org/wiki/JavaBean "JavaBean") is a POJO that is [serializable](https://en.wikipedia.org/wiki/Serialization#Java "Serialization"), has a no-argument [constructor](https://en.wikipedia.org/wiki/Constructor_(computer_science) "Constructor (computer science)"), and allows access to properties using [getter and setter methods](https://en.wikipedia.org/wiki/Mutator_method "Mutator method") that follow a simple naming convention. Because of this convention, simple declarative references can be made to the properties of arbitrary JavaBeans. Code using such a declarative reference does not have to know anything about the type of the bean, and the bean can be used with many frameworks without these frameworks having to know the exact type of the bean. The JavaBeans specification, if fully implemented, slightly breaks the POJO model as the class must implement the [Serializable](https://en.wikipedia.org/wiki/Serialization#Java "Serialization") interface to be a true JavaBean. Many POJO classes still called JavaBeans do not meet this requirement. Since [Serializable](https://en.wikipedia.org/wiki/Serialization "Serialization") is a marker (method-less) interface, this is not much of a burden.

The following shows an example of a [JavaServer Faces](https://en.wikipedia.org/wiki/JavaServer_Faces "JavaServer Faces") (JSF) component having a [bidirectional](https://en.wikipedia.org/wiki/Duplex_(telecommunications) "Duplex (telecommunications)") binding to a POJO's property:

```html
<h:inputText value="#{MyBean.someProperty}"/>

```

The definition of the POJO can be as follows:

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

### Transparently adding services

As designs using POJOs have become more commonly used, systems have arisen that give POJOs the full functionality used in frameworks and more choice about which areas of functionality are actually needed. In this model, the programmer creates nothing more than a POJO. This POJO purely focuses on [business logic](https://en.wikipedia.org/wiki/Business_logic "Business logic") and has no dependencies on (enterprise) frameworks. [Aspect-oriented programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming "Aspect-oriented programming") (AOP) frameworks then transparently add cross-cutting concerns like persistence, transactions, security, and so on.

[Spring](https://en.wikipedia.org/wiki/Spring_Framework "Spring Framework") was an early implementation of this idea and one of the driving forces behind popularizing this model.

An example of an EJB bean being a POJO:

*   [Enterprise JavaBeans](https://en.wikipedia.org/wiki/Enterprise_JavaBeans "Enterprise JavaBeans") (EJB),
*   [Java Persistence API](https://en.wikipedia.org/wiki/Java_Persistence_API "Java Persistence API") (JPA) (including [Hibernate](https://en.wikipedia.org/wiki/Hibernate_(Java) "Hibernate (Java)"))
*   [CDI (Contexts and Dependency Injection for the Java EE platform)](http://jcp.org/en/jsr/summary?id=299)

The following shows a fully functional EJB bean, demonstrating how EJB3 leverages the POJO model:

```java
public class HelloWorldService {

    public String sayHello() {
        return "Hello, world!";
    }
}
```

As given, the bean does not need to extend any EJB class or implement any EJB interface and also does not need to contain any EJB annotations. Instead, the programmer declares in an external [XML](https://en.wikipedia.org/wiki/XML "XML") file which EJB services should be added to the bean:

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

Thus, as an alternative to XML, many frameworks (e.g. Spring, EJB and JPA) allow annotations to be used instead of or in addition to XML. The following shows the same EJB bean as showed above but with an annotation added. In this case the XML file is no longer needed:

```java
@Stateless
public class HelloWorldService {

    public String sayHello() {
        return "Hello, world!";
    }
}

```

With the annotation as given above the bean isn't a truly pure POJO anymore, but since annotations are merely passive metadata this has far fewer harmful drawbacks compared to the invasiveness of having to extend classes and/or implement interfaces. Accordingly, the programming model is still very much like the pure POJO model.

## See also

*   [Data transfer object](https://en.wikipedia.org/wiki/Data_transfer_object "Data transfer object") (DTO)
*   [Anemic domain model](https://en.wikipedia.org/wiki/Anemic_domain_model "Anemic domain model")




# Understanding POJOs

> From <https://spring.io/understanding/POJO>

POJO means **Plain Old Java Object**. It refers to a Java object (instance of definition) that isn't bogged down by framework extensions.

For example, to receive messages from JMS, you need to write a class that implements the `MessageListener` interface.

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

A POJO-driven approach means writing your message handling solution free of interfaces.

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

This is just one example. It is not meant to illustrate JMS vs. RabbitMQ, but instead the value of coding without being tied to specific interfaces. By using **plain old Java objects**, your code can be much simpler. This lends itself to better testing, flexibility, and ability to make new decisions in the future.

The Spring Framework and its various portfolio projects are always aiming for ways to reduce coupling between your code and existing libraries. This is a principle concept of dependency injection, where the way your service is utilized should be part of wiring the application and not the service itself.



# What is POJO in Java?

> From <https://www.quora.com/What-is-POJO-in-Java>

POJO stands for “Plain Old Java Object” — it’s a pure data structure that has fields with getters and possibly setters, and may override some methods from Object (e.g. equals) or some other interface like Serializable, but does not have behavior of its own. It’s the Java equivalent of a C `struct`

For example, this is a POJO:

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

POJOs can have all of their methods defined automatically based on their field names and types — IDEs can do this for you, but the most elegant way is to use the annotations defined by [Project Lombok](https://projectlombok.org/):

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

