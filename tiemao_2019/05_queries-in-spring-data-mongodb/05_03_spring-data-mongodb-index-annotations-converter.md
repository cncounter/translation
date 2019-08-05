# Spring Data MongoDB: Indexes, Annotations and Converters

# Spring Data MongoDB系列(三): 索引、注解和转换器

## 1. Overview

## 1. 概述

This tutorial will explore some of the core features of Spring Data MongoDB – indexing, common annotations and converters.

本教程将探讨Spring Data MongoDB的核心特性:  索引、注解、以及转换器。

## 2. Indexes

## 2. 索引

### 2.1. `@Indexed` 注解

This annotation marks the field as indexed in MongoDB:

用于标记某个字段为MongoDB中的索引:

```
@QueryEntity
@Document
public class User {
    @Indexed
    private String name;

    ...
}
```

Now that the `name` field is indexed – let’s have a look at the indexes in MongoDB:

现在 `name` 字段就会被索引 —— 让看看MongoDB中的索引:

```
db.user.getIndexes();
```

Here’s what we have at the database level:

这就是数据库级的信息:

```
[
    {
        "v" : 1,
        "key" : {
             "_id" : 1
         },
        "name" : "_id_",
        "ns" : "test.user"
    },
    {
         "v" : 1,
         "key" : {
             "name" : 1
          },
          "name" : "name",
          "ns" : "test.user"
     }
]
```



As you can see, we have two indexes – one of them is `_id` – which was created by default due to the `@Id` annotation and the second one is our name field.

可以看到, 有两个索引， 一个是`_id`，这是默认情况下由 `@Id` 注解创建的，第二个是 `name` 字段。

### 2.2. Create an Index Programmatically

### 2.2. 以编程的方式创建索引

We can also create an index programmatically:

也可以通过编程方式创建索引:

```
mongoOps.indexOps(User.class).
  ensureIndex(new Index().on("name", Direction.ASC));
```



We’ve now created an index for the field `name` and the result will be the same as in the previous section.

这也为字段`name`创建了索引， 结果与上一节相同。


### 2.3. Compound Indexes

### 2.3. 复合索引

MongoDB supports compound indexes, where a single index structure holds references to multiple fields.

MongoDB支持复合索引, 即单个索引结构引用多个字段。

Let’s see a quick example using compound indexes:

让看一个使用复合索引的简单例子:

```
@QueryEntity
@Document
@CompoundIndexes({
    @CompoundIndex(name = "email_age", def = "{'email.id' : 1, 'age': 1}")
})
public class User {
    //
}
```



We created a compound index with the `email` and `age` fields. Let’s now check out the actual indexes:

创建了一个复合索引， 包含 `email`和`age`字段。看数据库中实际的索引:

```
{
    "v" : 1,
    "key" : {
        "email.id" : 1,
        "age" : 1
    },
    "name" : "email_age",
    "ns" : "test.user"
}
```



Note that a `DBRef` field cannot be marked with `@Index` – that field can only be part of a compound index.

请注意, `DBRef` 的字段不能使用 `@Index` 注解 —— 只能成为复合索引的一部分。

## 3. Common Annotations

## 3.通用注解

### 3.1 `@Transient` 注解


As you would expect, this simple annotation excludes the field from being persisted in the database:

如你所愿, 这个注解阻止将某个字段持久化到数据库:

```
public class User {

    @Transient
    private Integer yearOfBirth;
    // standard getter and setter

}
```

Let’s insert user with the setting field `yearOfBirth`:

插入设置了字段 `yearOfBirth` 的user:

```
User user = new User();
user.setName("Alex");
user.setYearOfBirth(1985);
mongoTemplate.insert(user);
```

Now if we look the state of database, we see that the filed `yearOfBirth` was not saved:

现在看数据库, 可以看到 `yearOfBirth` 字段并没有被保存:

```
{
    "_id" : ObjectId("55d8b30f758fd3c9f374499b"),
    "name" : "Alex",
    "age" : null
}
```



So if we query and check:

如果查询:

```
mongoTemplate
  .findOne(Query.query(Criteria.where("name").is("Alex")), User.class)
  .getYearOfBirth()
```



The result will be `null`.

结果将是`null`。

### 3.2. `@Field`注解


`@Field` indicates the key to be used for the field in the JSON document:

`@Field` 指定JSON文档中的key名称:

```
@Field("email")
private EmailAddress emailAddress;
```



Now `emailAddress` will be saved in the database using the key `email`:

现在`emailAddress`在数据库中使用key `email` 来保存:

```
User user = new User();
user.setName("Brendan");
EmailAddress emailAddress = new EmailAddress();
emailAddress.setValue("a@gmail.com");
user.setEmailAddress(emailAddress);
mongoTemplate.insert(user);
```



And the state of the database:

数据库的状态:

```
{
    "_id" : ObjectId("55d076d80bad441ed114419d"),
    "name" : "Brendan",
    "age" : null,
    "email" : {
        "value" : "a@gmail.com"
    }
}
```



### 3.3. `@PersistenceConstructor` and `@Value`

### 3.3. `@PersistenceConstructor`和`@Value`注解

`@PersistenceConstructor` marks a constructor, even one that’s package protected, to be the primary constructor used by the persistence logic. The constructor arguments are mapped by name to the key values in the retrieved `DBObject`.

`@PersistenceConstructor`标记构造函数,即使是包保护级别的构造函数, 持久化逻辑依然会用来作为主构造函数。 构造函数的参数根据获取的 `DBObject` 中key名称映射。

Let’s look at this constructor for our `User` class:

让看看`User`类的构造函数 :

```
@PersistenceConstructor
public User(String name, @Value("#root.age ?: 0") Integer age, EmailAddress emailAddress) {
    this.name =  name;
    this.age = age;
    this.emailAddress =  emailAddress;
}
```



Notice the use of the standard Spring `@Value` annotation here. It’s with the help of this annotation that we can use the Spring Expressions to transform a key’s value retrieved from the database before it is used to construct a domain object. That is a very powerful and highly useful feature here.

注意这里的 `@Value` 标准注解。 在这个注解中，可以使用 Spring EL 表达式来映射数据库中的值. 这是一个非常强大，非常有用的功能。

In our example if `age` is not set that it will be set to `0` by default.

在的示例中, 如果`age`没有值则将被设置为`0`。

Let’s now see how it works:

现在让看看它是如何工作的:

```
User user = new User();
user.setName("Alex");
mongoTemplate.insert(user);
```



Our database will look:

的数据库将会是:

```
{
    "_id" : ObjectId("55d074ca0bad45f744a71318"),
    "name" : "Alex",
    "age" : null
}
```



So the `age` field is `null`, but when we query the document and retrieve `age`:

因此,数据库值 `age`字段的值是`null`,但当查询和检索的文档`age`:

```
mongoTemplate.findOne(Query.query(Criteria.where("name").is("Alex")), User.class).getAge();
```



The result will be `0`.

结果将是`0`。

## 4. Converters

Let’s now take a look at another very useful feature in Spring Data MongoDB – converters, and specifically at the `MongoConverter`.


现在让看一下 Spring Data MongoDB 另一个非常有用的功能： 转换器, 特别是 `MongoConverter`。

This is used to handle the mapping of all Java types to `DBObjects` when storing and querying these objects.

这用于处理所有的Java类型和`DBObjects`的映射，比如在保存和查询时。

We have two options – we can either work with `MappingMongoConverter –` or `SimpleMongoConverter` in earlier versions (this was deprecated in Spring Data MongoDB M3 and its functionality has been moved into `MappingMongoConverter`).

有两个选择，可以使用 `MappingMongoConverter`，或者在早期版本中的 `SimpleMongoConverter` (这在Spring Data MongoDB M3中弃用，其功能已移动到`MappingMongoConverter`中).

Or we can write our own custom converter. To do that, we would need to implement the `Converter` interface and register the implementation in `MongoConfig.`

也可以自定义转换器。要做到这一点,需要实现`Converter`接口，并且在`MongoConfig`中注册.

Let’s look at a quick example. As you’ve seen in some of the JSON output here, all objects saved in a database have the field `_class` which is saved automatically. If however we’d like to skip that particular field during persistence, we can do that using a `MappingMongoConverter`.

让看看一个简单的例子。可以看到, 保存在数据库中的所有对象都有一个自动保存的 `_class` 字段。 如果想在保存时跳过这个字段,可以使用 `MappingMongoConverter`。

First – here’s the custom converter implementation:

下面是自定义转换器实现:

```
@Component
public class UserWriterConverter implements Converter<User, DBObject> {
    @Override
    public DBObject convert(User user) {
        DBObject dbObject = new BasicDBObject();
        dbObject.put("name", user.getName());
        dbObject.put("age", user.getAge());
        if (user.getEmailAddress() != null) {
            DBObject emailDbObject = new BasicDBObject();
            emailDbObject.put("value", user.getEmailAddress().getValue());
            dbObject.put("email", emailDbObject);
        }
        dbObject.removeField("_class");
        return dbObject;
    }
}
```



Notice how we can easily hit the goal of not persisting `_class` by specifically removing the field directly here.

直接删除不想要的 `_class` 字段。

Now we need to register the custom converter:

然后需要注册自定义的转换器:

```
private List<Converter<?,?>> converters = new ArrayList<Converter<?,?>>();

@Override
public MongoCustomConversions customConversions() {
    converters.add(new UserWriterConverter());
    return new MongoCustomConversions(converters);
}
```



We can of course achieve the same result with XML configuration as well, if we need to:

当然也可以使用XML配置来实现相同的结果:

```
<bean id="mongoTemplate"
  class="org.springframework.data.mongodb.core.MongoTemplate">
    <constructor-arg name="mongo" ref="mongo"/>
    <constructor-arg ref="mongoConverter" />
    <constructor-arg name="databaseName" value="test"/>
</bean>

<mongo:mapping-converter id="mongoConverter" base-package="org.baeldung.converter">
    <mongo:custom-converters base-package="com.baeldung.converter" />
</mongo:mapping-converter>
```



Now, when we save a new user:

现在, 保存一个新用户:

```
User user = new User();
user.setName("Chris");
mongoOps.insert(user);
```



The resulting document in the database no longer contains the class information:

数据库中不再包含class信息:

```
{
    "_id" : ObjectId("55cf09790bad4394db84b853"),
    "name" : "Chris",
    "age" : null
}
```



## 5. Conclusion

In this tutorial we’ve covered some core concepts of working with Spring Data MongoDB – indexing, common annotations and converters.

在本教程中，我们介绍了 Spring Data MongoDB的一些核心概念——索引、公共注解，转换器，及其使用示例。

The implementation of all these examples and code snippets can be found in [`my github project`](https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb) – this is an Eclipse based project, so it should be easy to import and run as it is.

这些例子的实现代码可以在 <https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb> 中找到，这是一个基于Eclipse的项目，应该很容易导入和运行。



原文链接: <https://www.baeldung.com/spring-data-mongodb-index-annotations-converter>

相关链接:

- [Spring Data MongoDB系列(一): 简介](05_01_spring-data-mongodb-tutorial.md)
- [Spring Data MongoDB系列(二): 简单查询](05_02_queries-in-spring-data-mongodb.md)
- [Spring Data MongoDB系列(三): 索引、注解和转换器](05_02_queries-in-spring-data-mongodb.md)
- [Spring Data MongoDB系列(八): 映射与聚合](05_08_spring-data-mongodb-projections-aggregations.md)
