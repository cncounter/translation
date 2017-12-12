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












- 维基百科: <https://en.wikipedia.org/wiki/Plain_old_Java_object>

- quora的回答: <https://www.quora.com/What-is-POJO-in-Java>

- Spring文档: <https://spring.io/understanding/POJO>

