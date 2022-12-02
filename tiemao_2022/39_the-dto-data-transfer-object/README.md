# The DTO (Data Transfer Object)

# 合理使用DTO(Data Transfer Object)

## 1. Introduction to DTO

Having a big application that has multiple layers you will need to “transport” that data between different layers. To transport the data you have to encapsulate it into objects (DTO), that you can easily send it. This type of object doesn’t have any kind of logic, just some accessors, mutators, and parsers for serialization or deserialization.

## 1. DTO简介

如今的应用越来越复杂, 大部分都演变成了具有多个层级的大型应用程序，我们需要在不同层之间“传输”数据。 
对于需要传输的数据，最好是将其封装到对象中，以便于发送和接收。 
DTO类型的对象, 不应该掺杂任何业务逻辑; 只包含获取和设置属性的方法, 以及用于序列化或反序列化的解析器。


## 2. What is DTO?

In the programming area, a DTO is basically an object that encapsulates data to be able to send it between processes (from one system of an application to another). This type of object is most commonly used by the Service layer in an N-tier application, transferring data between its layer and the rest controller layer.

DTO basically is an OOP design pattern and is used in language environments like Python, C++, and Java. DTOs are easy to maintain and update.

In case you want to transport some information from a database and the database models contain some sensitive information, you will probably not want to send that object between layers and you will use a DTO that will transfer only the information that you require.

For more details about this concept check this [link](https://en.wikipedia.org/wiki/Data_transfer_object).

## 2.什么是DTO？

在编程领域，DTO 一般是指封装数据以便在不同进程之间传递数据的对象(比如在一个应用到另一个应用之间)。 
在 N 层应用程序(N-tier application)中, DTO类型的对象通常是服务层(Service layer)使用，在该层和控制层之间传输数据。

DTO 基本上是一种面向对象设计模式(OOP design pattern)，常用于 Python、C++ 和 Java 等语言环境。 
DTO 非常容易维护和更新。

如果想从数据库传输一些信息，但其中包含一些敏感信息，那么我们可以使用 DTO，只传输必要的信息。

关于DTO概念的更多信息，请查看维基百科 [数据传输对象](https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E4%BC%A0%E8%BE%93%E5%AF%B9%E8%B1%A1)。


## 3. DTO as POJOs

POJO acronym is referring to Plain Old Java Objects to describe the usual Java objects as opposed to EJB (Enterprise Java Beans) or anything that has to deal with dependencies.

DTOs are more special considering that this object transports data between layers or subsystems.

We can consider that all DTOs are POJO objects but not all POJOs can be DTOs. An example of POJOs that are not DTO we can consider a class that has business logic.


## 3. 将DTO用作POJO

POJO是普通Java对象的首字母缩略词(Plain Old Java Object), 目的是为了区分EJB (Enterprise Java Beans)或其他必须处理依赖关系的东西。

POJO的内在含义是指那些没有从任何类继承, 也没有实现任何接口, 更没有被其它框架侵入的Java对象。

在不同层级或子系统之间传输数据，一般使用 DTO 更为普遍。

我们可以认为所有的 DTO 都是 POJO 对象，但并不是所有的 POJO 都可以是 DTO。

不是 DTO 却是 POJO 的例子，可参考具有业务逻辑的那些类。 

关于POJO的更多说明, 可参考: [What is a POJO Class](https://www.baeldung.com/java-pojo-class)


## 4. Example in Java using DTO

In this section, you will see an example of a DTO in Java.

Let’s suppose we have a REST API that returns some information about the users from the database. The database model contains a lot of information that we don’t want to expose through the REST API. For this, we will use a DTO that will return some information about the user.

This is the database model, UserModel, that matches the database table fields.

## 4. Java 中使用DTO的例子

下面我们来看看 Java 中的 DTO 示例。

假设有一个 REST API，从数据库查询并返回一些关于用户的信息。 

数据库模型中包含很多我们不想通过 REST API 公开的信息。 为此，我们将使用一个 DTO 来返回关于用户的信息。

下面是与数据库表字段相对应的数据库模型, UserModel。

```java
@Entity
public class UserModel {
    @Id  
    @GeneratedValue(strategy = GenerationType.IDENTITY)  
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String password;
    private String country;
    private String city;
    private String address;
    private String placeName;
    private String accountNumber;
    private String socialSecurityNumber;
    private String postalCode;
    // Getters and Setters  
}
```

UserDTO object that will return through REST API

REST API 使用下面的 UserDTO 对象将数据返回给客户端;

```java

public class UserDTO {
    private String username;
    private String email;
    private String place;
    private String phone;
    // Getters and Setters  
} 

@RestController
public class UserController {
    // 自动组装
    @Autowired
    private UserService userService;
 
    // API接口路径
    @GetMapping("/users")
    // response body 实际上由 @RestController 指定了
    @ResponseBody
    public List<UserDTO> getAllUsers() {
        // 获取所有用户
        List <UserDTO> users = userService.getAllUsers();
        // 返回
        return users;
    }  
}
```

这里的层级关系为:

```

客户端(Client)
    |      ^
    |      |
    |    (DTO)
    V      |
API层(UserController)
    |      ^
    |      |
    |    (DTO)
    V      |
服务层(UserService)
    |      ^
    |      |
    |  UserModel
    V      |
存储层(UserRepository)
    ^
    |
    V
数据库(DataBase)

```



## 5. Common mistakes

Even if this design pattern is a simple one, we might make some mistakes when using this. One of the most common mistakes is overusing this pattern on every occasion. Doing that will increase the number of classes and it will be hard to maintain these objects. It is recommended to keep as few classes as much as you can and try to use the existing ones. On the other hand, do not use a class for many cases.

As I mentioned at the beginning of this article it is not recommended to have business logic in a DTO class.

## 5. 反例: 滥用DTO

虽然这种设计模式很方便也很直观，但很多程序员也可能会犯错。 
一种最常见的错误，是滥用DTO, 在任何场合都使用这种模式。 
这样会增加很多没用的类，并且很难维护。 
建议尽可能精简 Class，并尝试重用现有的类。 

当然，也不要走另一种极端: 所有场景都只用一个class。

正如前面提到的，不建议在 DTO 类中包含业务逻辑。

## 6. Final words

In the Java world, these kinds of objects are very often used when a method has multiple parameters, or you want to send different parameters from one layer to another that don’t match exactly with the objects that you initially received or return some information from the database that you don’t want to expose to the caller.

Through this article, you get familiar with what a DTO is, why you need it and when to use it, alongside some common mistakes that abuse this design pattern. 

## 6. 小结

在 Java 生态中, 使用DTO的场景一般是:

- 一个方法的参数太多
- 想将多个参数从一层传到另一层
- 需求随时可能会发生变更, 这些参数或字段经常增增减减
- 某些数据不想透传

通过本文，我们学习了什么是 DTO、为什么需要使用它、以及在哪种情况下应该使用它，以及一些滥用此设计模式的场景。

## 相关链接

英文原文:

> https://examples.javacodegeeks.com/the-dto-data-transfer-object/
