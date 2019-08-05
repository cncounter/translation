# Spring Data MongoDB: Indexes, Annotations and Converters

## 1. Overview

## 1. 概述

This tutorial will explore some of the core features of Spring Data MongoDB – indexing, common annotations and converters.

本教程将探讨一些春天的核心特性数据MongoDB——索引、注释和转换器。

## 2. Indexes

## 2. 索引

### 2.1. `@Indexed`

This annotation marks the field as indexed in MongoDB:


这在MongoDB注释标志字段的索引:

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

现在`name`字段索引——让我们看看MongoDB的索引:

```
db.user.getIndexes();
```

Here’s what we have at the database level:

这就是我们已经在数据库级:

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

正如您可以看到的,我们有两个索引——其中一个是`_id`——这是默认情况下由于创建的`@Id`注释和第二个是我们的名称字段。

### 2.2. Create an Index Programmatically

### 2.2。以编程方式创建一个索引

We can also create an index programmatically:

我们也可以通过编程方式创建索引:

```
mongoOps.indexOps(User.class).
  ensureIndex(new Index().on("name", Direction.ASC));
```



We’ve now created an index for the field `name` and the result will be the same as in the previous section.

现在我们已经创建了一个索引的字段`name`结果将与上一节相同。

### 2.3. Compound Indexes

### 2.3。复合索引

MongoDB supports compound indexes, where a single index structure holds references to multiple fields.

MongoDB支持复合索引,一个索引结构包含多个字段的引用。

Let’s see a quick example using compound indexes:

让我们看看一个简单的例子使用复合索引:

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

我们创建了一个复合索引的`email`和`age`字段。现在让我们看看实际的指标:

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

请注意,`DBRef`字段不能用`@Index`——字段只能复合索引的一部分。

## 3. Common Annotations

## 3.常见的注释

### 3.1 `@Transient`

### 3.1`@Transient`

As you would expect, this simple annotation excludes the field from being persisted in the database:

如你所愿,排除了这个简单的注释字段被持久化到数据库:

```
public class User {

    @Transient
    private Integer yearOfBirth;
    // standard getter and setter

}
```



Let’s insert user with the setting field `yearOfBirth`:

让我们插入用户设置的字段`yearOfBirth`:

```
User user = new User();
user.setName("Alex");
user.setYearOfBirth(1985);
mongoTemplate.insert(user);
```

Now if we look the state of database, we see that the filed `yearOfBirth` was not saved:



现在如果我们看数据库的状态,我们看到了`yearOfBirth`并不是保存:

```
{
    "_id" : ObjectId("55d8b30f758fd3c9f374499b"),
    "name" : "Alex",
    "age" : null
}
```



So if we query and check:

如果我们查询并检查:

```
mongoTemplate.findOne(
    Query.query(Criteria.where("name").is("Alex")), User.class
  ).getYearOfBirth()
```



The result will be `null`.

结果将是`null`。

### 3.2. `@Field`

### 3.2.`@Field`

`@Field` indicates the key to be used for the field in the JSON document:

`@Field`表示关键领域用于JSON文档:

```
@Field("email")
private EmailAddress emailAddress;
```



Now `emailAddress` will be saved in the database using the key `email`:

现在`emailAddress`将被保存在数据库中使用的关键`email`:

```
User user = new User();
user.setName("Brendan");
EmailAddress emailAddress = new EmailAddress();
emailAddress.setValue("a@gmail.com");
user.setEmailAddress(emailAddress);
mongoTemplate.insert(user);
```



And the state of the database:

和数据库的状态:

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

### 3.3.`@PersistenceConstructor`和`@Value`

`@PersistenceConstructor` marks a constructor, even one that’s package protected, to be the primary constructor used by the persistence logic. The constructor arguments are mapped by name to the key values in the retrieved `DBObject`.

`@PersistenceConstructor`标志着一个构造函数,甚至一个包的保护,主构造函数使用的持久性逻辑。构造函数参数是按名称映射中的键值检索`DBObject`。

Let’s look at this constructor for our `User` class:

让我们看看这个构造函数`User`类:

```
@PersistenceConstructor
public User(String name, @Value("#root.age ?: 0") Integer age, EmailAddress emailAddress) {
    this.name =  name;
    this.age = age;
    this.emailAddress =  emailAddress;
}
```



Notice the use of the standard Spring `@Value` annotation here. It’s with the help of this annotation that we can use the Spring Expressions to transform a key’s value retrieved from the database before it is used to construct a domain object. That is a very powerful and highly useful feature here.

通告标准标新局使用`@Value`旁注的出版物。“对于本注释help with the我们can缔约方使用了key’s部门表现标新局收到的美元价值的数据库construct了马来西亚为天体命名域.这是一个非常强大的和非常有用的功能。

In our example if `age` is not set that it will be set to `0` by default.

在我们的示例中,如果`age`没有设置将被设置为`0`默认情况下。

Let’s now see how it works:

现在让我们看看它是如何工作的:

```
User user = new User();
user.setName("Alex");
mongoTemplate.insert(user);
```



Our database will look:

我们的数据库将会:

```
{
    "_id" : ObjectId("55d074ca0bad45f744a71318"),
    "name" : "Alex",
    "age" : null
}
```



So the `age` field is `null`, but when we query the document and retrieve `age`:

因此,`age`字段是`null`,但当我们查询和检索的文档`age`:

```
mongoTemplate.findOne(Query.query(Criteria.where("name").is("Alex")), User.class).getAge();
```



The result will be `0`.

结果将是`0`。

## 4. Converters

Let’s now take a look at another very useful feature in Spring Data MongoDB – converters, and specifically at the `MongoConverter`.


现在让我们看一下另一个非常有用的功能在春天MongoDB的数据转换器,和特别的`MongoConverter`。

This is used to handle the mapping of all Java types to `DBObjects` when storing and querying these objects.

这是用于处理所有的Java类型的映射`DBObjects`当这些对象存储和查询。

We have two options – we can either work with `MappingMongoConverter –` or `SimpleMongoConverter` in earlier versions (this was deprecated in Spring Data MongoDB M3 and its functionality has been moved into `MappingMongoConverter`).

我们有两个选择——我们可以一起工作`MappingMongoConverter –`或`SimpleMongoConverter`在早期版本(这是在春天弃用数据MongoDB M3和其功能已进入`MappingMongoConverter`).

Or we can write our own custom converter. To do that, we would need to implement the `Converter` interface and register the implementation in `MongoConfig.`

或者我们可以编写自己的自定义转换器。要做到这一点,我们需要实现`Converter`界面和注册的实现`MongoConfig.`

Let’s look at a quick example. As you’ve seen in some of the JSON output here, all objects saved in a database have the field `_class` which is saved automatically. If however we’d like to skip that particular field during persistence, we can do that using a `MappingMongoConverter`.

让我们看看一个简单的例子。正如您所看到的一些JSON输出,保存在一个数据库中所有对象的字段`_class`这是自动保存的。如果我们想要跳过这个字段在坚持,我们可以使用`MappingMongoConverter`。

First – here’s the custom converter implementation:

——这是自定义转换器实现:

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

注意我们不容易击中的目标坚持`_class`直接通过专门删除字段。

Now we need to register the custom converter:

现在我们需要注册自定义转换器:

```
private List<Converter<?,?>> converters = new ArrayList<Converter<?,?>>();

@Override
public MongoCustomConversions customConversions() {
    converters.add(new UserWriterConverter());
    return new MongoCustomConversions(converters);
}
```



We can of course achieve the same result with XML configuration as well, if we need to:

当然我们可以实现与XML配置相同的结果,如果我们需要:

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

现在,当我们拯救一个新用户:

```
User user = new User();
user.setName("Chris");
mongoOps.insert(user);
```



The resulting document in the database no longer contains the class information:

结果文档数据库中不再包含类信息:

```
{
    "_id" : ObjectId("55cf09790bad4394db84b853"),
    "name" : "Chris",
    "age" : null
}
```



## 5. Conclusion

In this tutorial we’ve covered some core concepts of working with Spring Data MongoDB – indexing, common annotations and converters.

The implementation of all these examples and code snippets can be found in [`my github project`](https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb) – this is an Eclipse based project, so it should be easy to import and run as it is.

所有这些例子的实现和代码片段中可以找到`my github project`)(https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb)——这是一个基于Eclipse的项目,所以它应该易于导入并运行。



原文链接: <https://www.baeldung.com/spring-data-mongodb-index-annotations-converter>

相关链接:

- [Spring Data MongoDB系列(一): 简介](05_01_spring-data-mongodb-tutorial.md)
- [Spring Data MongoDB系列(二): 简单查询](05_02_queries-in-spring-data-mongodb.md)
- [Spring Data MongoDB系列(八): 映射与聚合](05_08_spring-data-mongodb-projections-aggregations.md)
