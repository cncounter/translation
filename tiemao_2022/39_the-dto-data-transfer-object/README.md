# The DTO (Data Transfer Object)

# 什么是DTO(Data Transfer Object)?

## 1. Introduction to DTO

Having a big application that has multiple layers you will need to “transport” that data between different layers. To transport the data you have to encapsulate it into objects (DTO), that you can easily send it. This type of object doesn’t have any kind of logic, just some accessors, mutators, and parsers for serialization or deserialization.

## 2. What is DTO?

In the programming area, a DTO is basically an object that encapsulates data to be able to send it between processes (from one system of an application to another). This type of object is most commonly used by the Service layer in an N-tier application, transferring data between its layer and the rest controller layer.

DTO basically is an OOP design pattern and is used in language environments like Python, C++, and Java. DTOs are easy to maintain and update.

In case you want to transport some information from a database and the database models contain some sensitive information, you will probably not want to send that object between layers and you will use a DTO that will transfer only the information that you require.

For more details about this concept check this [link](https://en.wikipedia.org/wiki/Data_transfer_object).

## 3. DTO as POJOs

POJO acronym is referring to Plain Old Java Objects to describe the usual Java objects as opposed to EJB (Enterprise Java Beans) or anything that has to deal with dependencies.

DTOs are more special considering that this object transports data between layers or subsystems.

We can consider that all DTOs are POJO objects but not all POJOs can be DTOs. An example of POJOs that are not DTO we can consider a class that has business logic.

## 4. Example in Java using DTO

In this section, you will see an example of a DTO in Java.

Let’s suppose we have a REST API that returns some information about the users from the database. The database model contains a lot of information that we don’t want to expose through the REST API. For this, we will use a DTO that will return some information about the user.

This is the database model, UserModel, that matches the database table fields.

```
@Entity``public` `class` `UserModel {``  ``@Id` `  ``@GeneratedValue``(strategy = GenerationType.IDENTITY) ``  ``private` `Long id;``  ``private` `String firstName;``  ``private` `String lastName;``  ``private` `String email;``  ``private` `String username;``  ``private` `String password;``  ``private` `String country;``  ``private` `String city;``  ``private` `String address;``  ``private` `String placeName;``  ``private` `String accountNumber;``  ``private` `String socialSecurityNumber;``  ``private` `String postalCode;``  ``// Getters and Setters ``}
```

UserDTO object that will return through REST API

```
public` `class` `UserDTO {``  ``private` `String username;``  ``private` `String email;``  ``private` `String place;``  ``private` `String phone;``  ``// Getters and Setters ``} 
@RestController``public` `class` `UserController {``  ``// create instance of the userService class``  ``@Autowired``  ``private` `UserService userService;` `  ``// create endpoint``  ``@GetMapping``(``"/users"``)``  ``// when user hit the endpoint, it returns the response body ``  ``@ResponseBody``  ``public` `List<UserDTO> getAllUsers() {``    ``// call getAllUsers() method from the service which we created before``    ``// store the result in a list of UserDTO``    ``List <UserDTO> users = userService.getAllUsers();``    ``// return usersLocation ``    ``return` `users;``  ``} ``} 
```

[![img](https://examples.javacodegeeks.com/wp-content/uploads/2022/11/1_result.png.webp)](https://examples.javacodegeeks.com/wp-content/uploads/2022/11/1_result.png)Fig.1: The concept of using DTO in a webservice

## 5. Common mistakes

Even if this design pattern is a simple one, we might make some mistakes when using this. One of the most common mistakes is overusing this pattern on every occasion. Doing that will increase the number of classes and it will be hard to maintain these objects. It is recommended to keep as few classes as much as you can and try to use the existing ones. On the other hand, do not use a class for many cases.

As I mentioned at the beginning of this article it is not recommended to have business logic in a DTO class.

## 6. Final words

In the Java world, these kinds of objects are very often used when a method has multiple parameters, or you want to send different parameters from one layer to another that don’t match exactly with the objects that you initially received or return some information from the database that you don’t want to expose to the caller.

Through this article, you get familiar with what a DTO is, why you need it and when to use it, alongside some common mistakes that abuse this design pattern. 


英文原文:

> https://examples.javacodegeeks.com/the-dto-data-transfer-object/
