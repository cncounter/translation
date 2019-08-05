# Introduction to Spring Data MongoDB

# Spring Data MongoDB系列(一): 简介

## 1. Overview

## 1. 概述

This article will be a quick and practical introduction to Spring Data MongoDB.

本文通过示例简要介绍 Spring Data MongoDB。

We’ll go over the basics using both the *MongoTemplate* as well as *MongoRepository* using practical tests to illustrate each operation.

涉及 `MongoTemplate`以及`MongoRepository` 基础，并演示每种操作的实际用法。

## 2. MongoTemplate and MongoRepository

## 2. MongoTemplate和MongoRepository

The MongoTemplate follows the standard template pattern in Spring and provides a ready to go, basic API to the underlying persistence engine.

MongoTemplate遵循Spring的标准模板模式，并提供一个可以使用的, 底层持久化引擎的基础API。

The repository follows the Spring Data-centric approach and comes with more flexible and complex API operations, based on the well-known access patterns in all Spring Data projects.

而 repository 则遵循 Spring 以数据为中心的方法， 提供更灵活的复杂API操作, 基于流行的Spring Data项目访问模式。

For both, we need to start by defining the dependency – for example, in the *pom.xml*, with Maven:

首先需要定义依赖 —— 例如 Maven 的 pom.xml 文件:

```
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-mongodb</artifactId>
    <version>2.1.8.RELEASE</version>
</dependency>

<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-releasetrain</artifactId>
    <version>Lovelace-M3</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```



Note that we need to add the milestone repository to our *pom.xml* as well:

请注意, 可能还需要在 pom.xml 文件中添加milestone仓库地址:

```
<repositories>
    <repository>
        <id>spring-milestones</id>
        <name>Spring Milestones</name>
        <url>https://repo.spring.io/milestone</url>
        <snapshots>
            <enabled>false</enabled>
        </snapshots>
    </repository>
</repositories>
```



To check if any new version of the library has been released – [track the releases here](https://search.maven.org/search?q=g:org.springframework.data%20AND%20a:spring-data-mongodb).

spring-data-mongodb的新版本列表可参考: <https://mvnrepository.com/artifact/org.springframework.data/spring-data-mongodb>。

## 3. Configuration for MongoTemplate

## 3. 配置MongoTemplate

### 3.1. XML Configuration

### 3.1. XML配置

Let’s start with the simple XML configuration for the Mongo template:

先从简单的XML配置开始:

```
<mongo:mongo-client id="mongoClient" host="localhost" />
<mongo:db-factory id="mongoDbFactory" dbname="test" mongo-ref="mongoClient" />
```

First, we need to define the factory bean responsible for creating Mongo instances.

首先, 定义factory bean, 负责创建Mongo实例。

Next – we need to actually define (and configure) the template bean:

接下来, 定义 template bean 和配置:

```
<bean id="mongoTemplate" class="org.springframework.data.mongodb.core.MongoTemplate"> 
    <constructor-arg ref="mongoDbFactory"/> 
</bean>
```

And finally we need to define a post processor to translate any *MongoExceptions* thrown in *@Repository* annotated classes:

最后, 定义一个后置处理器,来转换 `@Repository` 抛出的所有 `MongoExceptions`:

```
<bean class=
  "org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor"/>
```



### 3.2. Java Configuration

### 3.2. Java配置

Let’s now create a similar configuration using Java config by extending the base class for MongoDB configuration *AbstractMongoConfiguration*:

也可以用Java类，继承 `AbstractMongoConfiguration` 类来创建类似的配置:

```
@Configuration
public class MongoConfig extends AbstractMongoConfiguration {
  
    @Override
    protected String getDatabaseName() {
        return "test";
    }
  
    @Override
    public MongoClient mongoClient() {
        return new MongoClient("127.0.0.1", 27017);
    }
  
    @Override
    protected String getMappingBasePackage() {
        return "org.baeldung";
    }
}
```



Note: We didn’t need to define *MongoTemplate* bean in the previous configuration as it’s already defined in *AbstractMongoConfiguration*

注意: 并不需要像前面的配置那样定义 `MongoTemplate`, 因为 `AbstractMongoConfiguration` 类已经定义了。

We can also use our configuration from scratch without extending *AbstractMongoConfiguration* – as follows:

当然，不继承 `AbstractMongoConfiguration` 类也是可以的，从头配置即可:

```
@Configuration
public class SimpleMongoConfig {
  
    @Bean
    public MongoClient mongo() {
        return new MongoClient("localhost");
    }
 
    @Bean
    public MongoTemplate mongoTemplate() throws Exception {
        return new MongoTemplate(mongo(), "test");
    }
}
```



## 4. Configuration for MongoRepository

## 4. 配置 MongoRepository

### 4.1. XML Configuration

### 4.1. XML配置

To make use of custom repositories (extending the *MongoRepository*) – we need to continue the configuration from section 3.1 and set up the repositories:

要使用自定义仓库(继承 `MongoRepository`) —— 我们需要在 3.1节的基础上加上repositories配置:

```
<mongo:repositories
  base-package="org.baeldung.repository" mongo-template-ref="mongoTemplate"/>
```



### 4.2. Java Configuration

### 4.2。Java 配置

Similarly, we’ll build on the configuration we already created in section 3.2 and add a new annotation into the mix:

同样, 在3.2节的基础上，加入一个新的注解:

```
@EnableMongoRepositories(basePackages = "org.baeldung.repository")
```



### 4.3. Create the Repository

### 4.3. 创建存储库

Now, after the configuration, we need to create a repository – extending the existing *MongoRepository* interface:

经过前面的配置, 我们可以创建一个repository —— 扩展现有的 `MongoRepository` 接口:

```
public interface UserRepository extends MongoRepository<User, String> {
    // 
}
```



Now we can auto-wire this *UserRepository* and use operations from *MongoRepository* or add custom operations.

现在，在项目中就可以自动注入 `UserRepository`, 并且使用 `MongoRepository`提供的操作，或者添加自定义操作。

## 5. Using MongoTemplate

## 5. 使用MongoTemplate

### 5.1. Insert

### 5.1. 插入操作(insert)

Let’s start with the insert operation; let’s also start with a empty database:

先来看看插入操作; 我们从一个空数据库开始:

```
{
}
```



Now if we insert a new user:

插入一个新用户:

```
User user = new User();
user.setName("Jon");
mongoTemplate.insert(user, "user");
```


The database will look like this:

数据库看起来将会像这样:

```
{
    "_id" : ObjectId("55b4fda5830b550a8c2ca25a"),
    "_class" : "org.baeldung.model.User",
    "name" : "Jon"
}
```


### 5.2. Save – Insert

### 5.2. Save – Insert

The *save* operation has save-or-update semantics: if an id is present, it performs an update, if not – it does an insert.

save 操作具有 保存/更新 的语义: 如果id存在, 则执行update, 否则执行insert。

Let’s look at the first semantic – the insert; here’s the initial state of the database*:*

先看看 insert 语义; 下面是数据库的初始状态:

```
{
}
```



When we now *save* a new user:

save 新用户时:


```
User user = new User();
user.setName("Albert"); 
mongoTemplate.save(user, "user");
```



The entity will be inserted in the database:

实体会被插入到数据库:

```
{
    "_id" : ObjectId("55b52bb7830b8c9b544b6ad5"),
    "_class" : "org.baeldung.model.User",
    "name" : "Albert"
}
```


Next, we’ll look at the same operation – *save* – with update semantics.

接下来, 看看 save 操作的 update 语义。

### 5.3. Save – Update

### 5.3. Save – Update

Let’s now look at *save* with update semantics, operating on an existing entity:

看看 save 操作的 update 语义, 假设现有的数据库为:

```
{
    "_id" : ObjectId("55b52bb7830b8c9b544b6ad5"),
    "_class" : "org.baeldung.model.User",
    "name" : "Jack"
}
```


Now, when we *save* the existing user – we will update it:

现在,当我们 save 现有的用户时:

```
user = mongoTemplate.findOne(
  Query.query(Criteria.where("name").is("Jack")), User.class);
user.setName("Jim");
mongoTemplate.save(user, "user");
```



The database will look like this:

数据库结果为:

```
{
    "_id" : ObjectId("55b52bb7830b8c9b544b6ad5"),
    "_class" : "org.baeldung.model.User",
    "name" : "Jim"
}
```



As you can see, in this particular example, *save* uses the semantics of *update*, because we use an object with given *_id*.

如您所见,在这个特定的例子中, `save` 使用 `update` 语义, 因为有 `_id`。

### 5.4. UpdateFirst

### 5.4. UpdateFirst

*updateFirst* updates the very first document that matches the query.

`updateFirst` 会更新第一个匹配的文档。

Let’s start with the initial state of the database:

数据库的初始状态:

```
[
    {
        "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
        "_class" : "org.baeldung.model.User",
        "name" : "Alex"
    },
    {
        "_id" : ObjectId("55b5ffa5511fee0e45ed614c"),
        "_class" : "org.baeldung.model.User",
        "name" : "Alex"
    }
]
```


When we now run the *updateFirst*:

现在运行 `updateFirst`:

```
Query query = new Query();
query.addCriteria(Criteria.where("name").is("Alex"));
Update update = new Update();
update.set("name", "James");
mongoTemplate.updateFirst(query, update, User.class);
```



Only the first entry will be updated:

只有第一条记录被更新:

```
[
    {
        "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
        "_class" : "org.baeldung.model.User",
        "name" : "James"
    },
    {
        "_id" : ObjectId("55b5ffa5511fee0e45ed614c"),
        "_class" : "org.baeldung.model.User",
        "name" : "Alex"
    }
]
```



### 5.5. UpdateMulti

### 5.5. UpdateMulti

*UpdateMulti* updates all document that matches the given query.

`UpdateMulti` 会更新给定查询匹配到的所有文档。

First – here’s the state of the database before doing the *updateMulti*:

下面是updateMulti之前的数据库内容:

```
[
    {
        "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
        "_class" : "org.baeldung.model.User",
        "name" : "Eugen"
    },
    {
        "_id" : ObjectId("55b5ffa5511fee0e45ed614c"),
        "_class" : "org.baeldung.model.User",
        "name" : "Eugen"
    }
]
```



Now, let’s now run the *updateMulti* operation:

运行 `updateMulti` 操作:

```
Query query = new Query();
query.addCriteria(Criteria.where("name").is("Eugen"));
Update update = new Update();
update.set("name", "Victor");
mongoTemplate.updateMulti(query, update, User.class);
```



Both existing objects will be updated in the database:

在数据库中的2个对象都被更新了:

```
[
    {
        "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
        "_class" : "org.baeldung.model.User",
        "name" : "Victor"
    },
    {
        "_id" : ObjectId("55b5ffa5511fee0e45ed614c"),
        "_class" : "org.baeldung.model.User",
        "name" : "Victor"
    }
]
```



### 5.6. FindAndModify

### 5.6. FindAndModify

This operation works like *updateMulti*, but it returns the object before it was modified.

这个操作就像 `updateMulti` 一样, 但会返回修改之前的对象。

First – the state of the database before calling *findAndModify*:

调用 `findAndModify` 之前的数据库内容:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Markus"
}
```



Let’s look at actual operation code:

看实际操作代码:

```
Query query = new Query();
query.addCriteria(Criteria.where("name").is("Markus"));
Update update = new Update();
update.set("name", "Nick");
User user = mongoTemplate.findAndModify(query, update, User.class);
```



The returned *user object* has the same values as the initial state in the database.

返回的 user 对象和数据库初始状态具有相同的值。

However, the new state in the database is:

当然, 数据库新的状态是:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Nick"
}
```



### 5.7. Upsert

### 5.7. 替换(`upsert`)

The *upsert* works operate on the find and modify else create semantics: if the document is matched, update it, else create a new document by combining the query and update object.

`upsert` 操作具有 “找到就修改, 否则就创建” 的语义: 如果文档匹配则更新, 否则就结合查询和更新对象创建一个新的文档。

Let’s start with the initial state of the database:

数据库的初始状态:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Markus"
}
```



Now – let’s run the *upsert*:

运行 *upsert*:

```
Query query = new Query();
query.addCriteria(Criteria.where("name").is("Markus"));
Update update = new Update();
update.set("name", "Nick");
mongoTemplate.upsert(query, update, User.class);
```


Here’s the state of the database after the operation:

操作后的数据库内容:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Nick"
}
```



### 5.8. Remove

### 5.8. 删除(`remove`)

The state of the database before calling *remove*:

之前的数据库内容:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Benn"
}
```



Let’s now run *remove*:

执行删除 *remove*:

```
mongoTemplate.remove(user, "user");
```



The result will be as expected:

结果符合预期:

```
{
}
```



## 6. Using MongoRepository

## 6. 使用MongoRepository

### 6.1. Insert

### 6.1. 插入(`insert`)

First – the state of the database before running the *insert:*

数据库在运行`insert`之前的状态:

```
{
}
```


Now, when we insert a new user:

现在, 插入一个新用户:

```
User user = new User();
user.setName("Jon");
userRepository.insert(user);
```



Here’s the end state of the database:

这是数据库的结果:

```
{
    "_id" : ObjectId("55b4fda5830b550a8c2ca25a"),
    "_class" : "org.baeldung.model.User",
    "name" : "Jon"
}
```


Note how the operation works the same as the *insert* in the *MongoTemplate* API.

可以看到， 和 MongoTemplate API 执行 `insert` 的结果一样。

### 6.2. Save – Insert

### 6.2. 保存/插入

Similarly – *save* works the same as the *save* operation in the *MongoTemplate* API.

和 MongoTemplate API的 `save` 操作一样。

Let’s start by looking at the insert semantics of the operation; here’s the initial state of the database:

让我们看看插入语义; 数据库的初始状态:

```
{
}
```



Now – we execute the *save* operation:

执行 *save* 操作:

```
User user = new User();
user.setName("Aaron");
userRepository.save(user);
```



This results in the user being added to the database:

用户被添加到数据库中:

```
{
    "_id" : ObjectId("55b52bb7830b8c9b544b6ad5"),
    "_class" : "org.baeldung.model.User",
    "name" : "Aaron"
}
```



Note again how, in this example, *save* works with *insert* semantics, because we are inserting a new object.

再次注意, 在这个例子中, *save* 具有 *insert* 语义, 因为插入了一个新对象。

### 6.3. Save – Update

### 6.3. 保存/更新

Let’s now look at the same operation but with update semantics.

看看更新语义。

First – here’s the state of the database before running the new *save:*

数据库在运行*save*之前的状态:

```
{
    "_id" : ObjectId("55b52bb7830b8c9b544b6ad5"),
    "_class" : "org.baeldung.model.User",
    "name" : "Jack"
}
```



Now – we execute the operation:

执行操作:

```
user = mongoTemplate.findOne(
  Query.query(Criteria.where("name").is("Jack")), User.class);
user.setName("Jim");
userRepository.save(user);
```



Finally, here is the state of the database:

最后数据库的状态:

```
{
    "_id" : ObjectId("55b52bb7830b8c9b544b6ad5"),
    "_class" : "org.baeldung.model.User",
    "name" : "Jim"
}
```



Note again how, in this example, *save* works with *update* semantics, because we are using an existing object.

再次注意, 在这个例子中, *save* 具有 *insert* 语义, 因为使用现有的对象。

### 6.4. Delete

### 6.4. 删除(`delete`)

The state of the database before calling *delete*:

调用*删除*之前的数据库内容:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Benn"
}
```



Let’s run *delete*:

运行*删除*:

```
userRepository.delete(user);
```



The result will simply be:

结果是:

```
{
}
```



### 6.5. FindOne

### 6.5. FindOne

The state of the database when *findOne* is called:

数据库内容:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Chris"
}
```


Let’s now execute the *findOne*:

执行 *findOne*:

```
userRepository.findOne(user.getId())
```



The result which will return the existing data:

结果将返回现有的数据:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Chris"
}
```



### 6.6. Exists

### 6.6。存在

The state of the database before calling *exists*:

之前的数据库内容:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Harris"
}
```



Now, let’s run *exists*:

执行 `exists` 查询:

```
boolean isExists = userRepository.exists(user.getId());
```



Which of course will return *true*.

当然, 返回结果是 `true`。

### 6.7. FindAll with Sort

### 6.7. FindAll与Sort排序

The state of the database before calling *findAll*:

数据库内容:

```
[
    {
        "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
        "_class" : "org.baeldung.model.User",
        "name" : "Brendan"
    },
    {
       "_id" : ObjectId("67b5ffa5511fee0e45ed614b"),
       "_class" : "org.baeldung.model.User",
       "name" : "Adam"
    }
]
```



Let’s now run *findAll* with *Sort*:

执行 *findAll* 与 *Sort*:

```
List<User> users = userRepository.findAll(new Sort(Sort.Direction.ASC, "name"));
```



The result will be sorted by name in ascending order:

结果是按名字升序排序:

```
[
    {
        "_id" : ObjectId("67b5ffa5511fee0e45ed614b"),
        "_class" : "org.baeldung.model.User",
        "name" : "Adam"
    },
    {
        "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
        "_class" : "org.baeldung.model.User",
        "name" : "Brendan"
    }
]
```



### 6.8. FindAll with Pageable

### 6.8. FindAll与Pageable分页

The state of the database before calling *findAll*:

数据库内容:

```
[
    {
        "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
        "_class" : "org.baeldung.model.User",
        "name" : "Brendan"
    },
    {
        "_id" : ObjectId("67b5ffa5511fee0e45ed614b"),
        "_class" : "org.baeldung.model.User",
        "name" : "Adam"
    }
]
```



Let’s now execute *findAll* with a pagination request:

分页请求执行findAll:

```
Pageable pageableRequest = PageRequest.of(0, 1);
Page<User> page = userRepository.findAll(pageableRequest);
List<User> users = pages.getContent();
```



The result in *users* list will be only one user:

结果是只返回一个用户:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Brendan"
}
```



## 7. Annotations

## 7. 注解

Finally, let’s also go over the simple annotations that Spring Data uses to drive these API operations.

最后, 我们使用简单的注解, Spring Data 统一支持使用注解来操作。

```
@Id
private String id;
```



The field level *@Id* annotation can decorate any type, including *long* and *string*.

字段上的 `@Id` 注解可以修饰多种类型, 包括 *long* 和 *String*。

If the value of the *@Id* field is not null, it’s stored in the database as-is; otherwise, the converter will assume you want to store an *ObjectId* in the database (either*ObjectId, String* or *BigInteger* work).

如果 `@Id` 指定的字段值不是null, 则按原样存储到数据库中; 如果为null则默认使用 ObjectId。 ( `ObjectId`, `String` 和 `BigInteger` 都支持)。

Next – *@Document*:

下一个注解是 `@Document` :

```
@Document
public class User {
    //
}
```


This annotation simply marks a class as being a domain object that needs to be persisted to the database, along with allowing us to choose the name of the collection to be used.

`@Document` 注解只是将一个类标记为需要持久化到数据库的 domain 对象,也支持指定对应的数据库集合。

## 8. Conclusion

## 8. 总结

This article was a quick but comprehensive introduction to using MongoDB with Spring Data, both via the *MongoTemplate* API as well as making use of *MongoRepository*.

本文只是一篇快速入门的介绍, 通过 Spring Data 来操作MongoDB，可以使用 *MongoTemplate* API 和*MongoRepository*。

The implementation of all these examples and code snippets can be found [over on Github](https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb) – this is a Maven-based project, so it should be easy to import and run as it is.

文中示例的代码请参考Github仓库: <https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb>。




原文链接: <https://www.baeldung.com/spring-data-mongodb-tutorial>


相关链接:

- [Spring Data MongoDB系列(一): 简介](05_01_spring-data-mongodb-tutorial.md)
- [Spring Data MongoDB系列(二): 简单查询](05_02_queries-in-spring-data-mongodb.md)
- [Spring Data MongoDB系列(三): 索引、注解和转换器](05_02_queries-in-spring-data-mongodb.md)
- [Spring Data MongoDB系列(八): 映射与聚合](05_08_spring-data-mongodb-projections-aggregations.md)
