# Introduction to Spring Data MongoDB

# Spring Data MongoDB系列(一): 简介

## 1. Overview

## 1. 概述

This article will be a quick and practical introduction to Spring Data MongoDB.

本文将是一个快速和实用介绍弹簧数据MongoDB。

We’ll go over the basics using both the *MongoTemplate* as well as *MongoRepository* using practical tests to illustrate each operation.

我们就去了基本使用* MongoTemplate *以及* MongoRepository *使用说明每个操作的实际测试。

## 2. MongoTemplate and MongoRepository

## 2. MongoTemplate和MongoRepository

The MongoTemplate follows the standard template pattern in Spring and provides a ready to go, basic API to the underlying persistence engine.

MongoTemplate遵循标准模板模式在春天和提供了一个准备好了,基本的底层持久性引擎API。

The repository follows the Spring Data-centric approach and comes with more flexible and complex API operations, based on the well-known access patterns in all Spring Data projects.

存储库之前,春天以数据为中心的方法和更灵活和复杂的API操作,基于众所周知的在春天所有数据访问模式项目。

For both, we need to start by defining the dependency – for example, in the *pom.xml*, with Maven:

两个,我们需要首先定义的依赖——例如,*砰的一声。xml *, Maven:

```
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-mongodb</artifactId>
    <version>2.1.0.RELEASE</version>
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

请注意,我们需要添加里程碑* pom库。xml *:

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

检查是否有新版本的图书馆已经发布[跟踪版本)(https://search.maven.org/search?q=g org.springframework.data % 20和% 20:spring-data-mongodb)。

## 3. Configuration for MongoTemplate

## 3.配置MongoTemplate

### 3.1. XML Configuration

### 3.1。XML配置

Let’s start with the simple XML configuration for the Mongo template:

让我们先从简单的XML配置Mongo模板:

```
<mongo:mongo-client id="mongoClient" host="localhost" />
<mongo:db-factory id="mongoDbFactory" dbname="test" mongo-ref="mongoClient" />
```



First, we need to define the factory bean responsible for creating Mongo instances.

首先,我们需要定义工厂bean负责创建Mongo实例。

Next – we need to actually define (and configure) the template bean:

接下来,我们需要定义模板bean(和配置):

```
<bean id="mongoTemplate" class="org.springframework.data.mongodb.core.MongoTemplate"> 
    <constructor-arg ref="mongoDbFactory"/> 
</bean>
```



And finally we need to define a post processor to translate any *MongoExceptions* thrown in *@Repository* annotated classes:

最后,我们需要定义一个后置处理程序翻译任何* @ MongoExceptions *扔进* *带注释的类:

```
<bean class=
  "org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor"/>
```



### 3.2. Java Configuration

### 3.2。Java配置

Let’s now create a similar configuration using Java config by extending the base class for MongoDB configuration *AbstractMongoConfiguration*:

现在让我们创建一个类似的配置使用Java配置通过扩展基类MongoDB配置* AbstractMongoConfiguration *:

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

注意:我们不需要定义* MongoTemplate * bean中定义在前面的配置已经* AbstractMongoConfiguration *

We can also use our configuration from scratch without extending *AbstractMongoConfiguration* – as follows:

我们还可以使用配置从头没有扩展* AbstractMongoConfiguration *,如下:

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

## 4. 配置MongoRepository

### 4.1. XML Configuration

### 4.1。XML配置

To make use of custom repositories (extending the *MongoRepository*) – we need to continue the configuration from section 3.1 and set up the repositories:

使用自定义存储库(扩展* MongoRepository *)——我们需要继续从3.1节和设置配置存储库:

```
<mongo:repositories
  base-package="org.baeldung.repository" mongo-template-ref="mongoTemplate"/>
```



### 4.2. Java Configuration

### 4.2。Java配置

Similarly, we’ll build on the configuration we already created in section 3.2 and add a new annotation into the mix:

同样,我们将建立在3.2节中我们已经创建的配置和添加一个新的注释为组合:

```
@EnableMongoRepositories(basePackages = "org.baeldung.repository")
```



### 4.3. Create the Repository

### 4.3。创建存储库

Now, after the configuration, we need to create a repository – extending the existing *MongoRepository* interface:

现在,经过配置,我们需要创建一个存储库——扩展现有* MongoRepository *接口:

```
public interface UserRepository extends MongoRepository<User, String> {
    // 
}
```



Now we can auto-wire this *UserRepository* and use operations from *MongoRepository* or add custom operations.

现在我们可以auto-wire这个从* MongoRepository * * UserRepository *和使用操作或添加自定义操作。

## 5. Using MongoTemplate

## 5. 使用MongoTemplate

### 5.1. Insert

### 5.1。插入

Let’s start with the insert operation; let’s also start with a empty database:

先插入操作;我们也从一个空数据库:

```
{
}
```



Now if we insert a new user:

现在如果我们插入一个新用户:

```
User user = new User();
user.setName("Jon");
mongoTemplate.insert(user, "user");
```



The database will look like this:

数据库将会看起来像这样:

```
{
    "_id" : ObjectId("55b4fda5830b550a8c2ca25a"),
    "_class" : "org.baeldung.model.User",
    "name" : "Jon"
}
```



### 5.2. Save – Insert

### 5.2。保存——插入

The *save* operation has save-or-update semantics: if an id is present, it performs an update, if not – it does an insert.

*存*操作save-or-update语义:如果存在一个id,它执行一个更新,如果不是——它插入。

Let’s look at the first semantic – the insert; here’s the initial state of the database*:*

让我们看看第一个语义-插入;这是数据库的初始状态*:*

```
{}
```



When we now *save* a new user:

当我们现在*存*新用户:

```
{
}
```



The entity will be inserted in the database:

实体会被插入到数据库:

```
User user = new User();
user.setName("Albert"); 
mongoTemplate.save(user, "user");
```



Next, we’ll look at the same operation – *save* – with update semantics.

接下来,我们将看看相同的操作- *存*更新语义。

### 5.3. Save – Update

### 5.3。保存,更新

Let’s now look at *save* with update semantics, operating on an existing entity:

现在让我们看看*存*更新语义,在现有的实体操作:

```
{
    "_id" : ObjectId("55b52bb7830b8c9b544b6ad5"),
    "_class" : "org.baeldung.model.User",
    "name" : "Albert"
}
```



Now, when we *save* the existing user – we will update it:

现在,当我们*存*现有的用户,我们将更新:

```
`user = mongoTemplate.findOne(``  ``Query.query(Criteria.where(``"name"``).is(``"Jack"``)), User.``class``);``user.setName(``"Jim"``);``mongoTemplate.save(user, ``"user"``);`
```



The database will look like this:

数据库将会看起来像这样:

```
{
    "_id" : ObjectId("55b52bb7830b8c9b544b6ad5"),
    "_class" : "org.baeldung.model.User",
    "name" : "Jack"
}
```



As you can see, in this particular example, *save* uses the semantics of *update*, because we use an object with given *_id*.

如您所见,在这个特定的例子中,*存*使用*更新*的语义,因为我们使用一个对象* _id *。

### 5.4. UpdateFirst

### 5.4。UpdateFirst

*updateFirst* updates the very first document that matches the query.

* updateFirst *更新第一个文档匹配的查询。

Let’s start with the initial state of the database:

让我们先从数据库的初始状态:

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

当我们现在运行* updateFirst *:

```
Query query = new Query();
query.addCriteria(Criteria.where("name").is("Alex"));
Update update = new Update();
update.set("name", "James");
mongoTemplate.updateFirst(query, update, User.class);
```



Only the first entry will be updated:

只有第一项将被更新:

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

### 5.5。UpdateMulti

*UpdateMulti* updates all document that matches the given query.

* UpdateMulti *更新所有文档匹配给定的查询。

First – here’s the state of the database before doing the *updateMulti*:

第一,这是数据库的状态之前做* updateMulti *:

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

现在,让我们现在运行* updateMulti *操作:

```
Query query = new Query();
query.addCriteria(Criteria.where("name").is("Eugen"));
Update update = new Update();
update.set("name", "Victor");
mongoTemplate.updateMulti(query, update, User.class);
```



Both existing objects will be updated in the database:

现有的对象将被更新在数据库中:

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

### 5.6。FindAndModify

This operation works like *updateMulti*, but it returns the object before it was modified.

这个操作就像* updateMulti *,但它返回之前修改的对象。

First – the state of the database before calling *findAndModify*:

——数据库调用* findAndModify *前的状态:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Markus"
}
```



Let’s look at actual operation code:

让我们来看看实际操作代码:

```
Query query = new Query();
query.addCriteria(Criteria.where("name").is("Markus"));
Update update = new Update();
update.set("name", "Nick");
User user = mongoTemplate.findAndModify(query, update, User.class);
```



The returned *user object* has the same values as the initial state in the database.

返回的* *用户对象具有相同的值作为初始状态到数据库中。

However, the new state in the database is:

然而,数据库中的新国家是:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Nick"
}
```



### 5.7. Upsert

### 5.7。插入

The *upsert* works operate on the find and modify else create semantics: if the ``document is matched, update it, else create a new document by combining the query and update object``.

* upsert *工作操作的查找和修改其他创建语义:如果``其他文档匹配、更新它,创建一个新文档结合查询和更新对象``。

Let’s start with the initial state of the database:

让我们先从数据库的初始状态:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Markus"
}
```



Now – let’s run the *upsert*:

现在,让我们来运行* upsert *:

```
Query query = new Query();
query.addCriteria(Criteria.where("name").is("Markus"));
Update update = new Update();
update.set("name", "Nick");
mongoTemplate.upsert(query, update, User.class);
```



Here’s the state of the database after the operation:

这是手术后的状态数据库:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Nick"
}
```



### 5.8. Remove

### 5.8。删除

The state of the database before calling *remove*:

之前的状态数据库调用*删除*:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Benn"
}
```



Let’s now run *remove*:

Let ' s now run *删除*:

```
mongoTemplate.remove(user, "user");
```



The result will be as expected:

结果会如预期:

```
{
}
```



## 6. Using MongoRepository

## 6. 使用MongoRepository

### 6.1. Insert

### 6.1。插入

First – the state of the database before running the *insert:*

首先,数据库在运行*之前插入的状态:*

```
{
}
```



Now, when we insert a new user:

现在,当我们插入一个新用户:

```
User user = new User();
user.setName("Jon");
userRepository.insert(user);
```



Here’s the end state of the database:

这是数据库的最终状态:

```
{
    "_id" : ObjectId("55b4fda5830b550a8c2ca25a"),
    "_class" : "org.baeldung.model.User",
    "name" : "Jon"
}
```



Note how the operation works the same as the *insert* in the *MongoTemplate* API.

注意操作工作一样*插入* * MongoTemplate * API。

### 6.2. Save – Insert

### 6.2。保存——插入

Similarly – *save* works the same as the *save* operation in the *MongoTemplate* API.

同样,*存*作品一样的* *操作保存在* MongoTemplate * API。

Let’s start by looking at the insert semantics of the operation; here’s the initial state of the database:

让我们开始通过查看插入操作的语义;这是数据库的初始状态:

```
{
}
```



Now – we execute the *save* operation:

现在,我们执行*存*操作:

```
User user = new User();
user.setName("Aaron");
userRepository.save(user);
```



This results in the user being added to the database:

这导致用户被添加到数据库:

```
{
    "_id" : ObjectId("55b52bb7830b8c9b544b6ad5"),
    "_class" : "org.baeldung.model.User",
    "name" : "Aaron"
}
```



Note again how, in this example, *save* works with *insert* semantics, because we are inserting a new object.

再次注意,在这个例子中,*存*与* *插入语义,因为我们是插入一个新对象。

### 6.3. Save – Update

### 6.3。保存,更新

Let’s now look at the same operation but with update semantics.

现在让我们看看相同的操作,但更新语义。

First – here’s the state of the database before running the new *save:*

第一,这是数据库在运行新*之前的状态保存:*

```
{
    "_id" : ObjectId("55b52bb7830b8c9b544b6ad5"),
    "_class" : "org.baeldung.model.User",
    "name" : "Jack"81*6
}
```



Now – we execute the operation:

现在,我们执行操作:

```
user = mongoTemplate.findOne(
  Query.query(Criteria.where("name").is("Jack")), User.class);
user.setName("Jim");
userRepository.save(user);
```



Finally, here is the state of the database:

最后,这是数据库的状态:

```
{
    "_id" : ObjectId("55b52bb7830b8c9b544b6ad5"),
    "_class" : "org.baeldung.model.User",
    "name" : "Jim"
}
```



Note again how, in this example, *save* works with *update* semantics, because we are using an existing object.

再次注意,在这个例子中,*存*与* *更新语义,因为我们是使用现有对象。

### 6.4. Delete

### 6.4。删除

The state of the database before calling *delete*:

之前的状态数据库调用*删除*:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Benn"
}
```



Let’s run *delete*:

让我们运行*删除*:

```
userRepository.delete(user);
```



The result will simply be:

结果只会是:

```
{
}
```



### 6.5. FindOne

### 6.5。FindOne

The state of the database when *findOne* is called:

的状态数据库调用* findOne *时:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Chris"
}
```



Let’s now execute the *findOne*:

现在让我们执行* findOne *:

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

之前的状态数据库调用* *存在:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Harris"
}
```



Now, let’s run *exists*:

现在,让我们来运行* *存在:

```
boolean isExists = userRepository.exists(user.getId());
```



Which of course will return *true*.

这当然会返回* *。

### 6.7. FindAll with Sort

### 6.7。FindAll与排序

The state of the database before calling *findAll*:

数据库调用* findAll *前的状态:

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

现在让我们运行* findAll *与* *:

```
List<User> users = userRepository.findAll(new Sort(Sort.Direction.ASC, "name"));
```



The result will be sorted by name in ascending order:

结果将是按名字按升序排序:

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

### 6.8。FindAll与可分页

The state of the database before calling *findAll*:

数据库调用* findAll *前的状态:

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

现在让我们用分页请求执行* findAll *:

```
Pageable pageableRequest = PageRequest.of(0, 1);
Page<User> page = userRepository.findAll(pageableRequest);
List<User> users = pages.getContent();
```



The result in *users* list will be only one user:

*用户*的结果列表将只有一个用户:

```
{
    "_id" : ObjectId("55b5ffa5511fee0e45ed614b"),
    "_class" : "org.baeldung.model.User",
    "name" : "Brendan"
}
```



## 7. Annotations

## 7. 注释

Finally, let’s also go over the simple annotations that Spring Data uses to drive these API operations.

最后,让我们也会在简单的注释,弹簧数据使用这些API操作。

```
@Id
private String id;
```



The field level *@Id* annotation can decorate any type, including *long* and *string*.

字段级别* * @ id注释可以装饰任何类型,包括字符串* *和* *。

If the value of the *@Id* field is not null, it’s stored in the database as-is; otherwise, the converter will assume you want to store an *ObjectId* in the database (either*ObjectId, String* or *BigInteger* work).

如果* * @ id字段的值不是零,按原样存储在数据库中;否则,转换器将假设您想要在数据库中存储一个* ObjectId * (* ObjectId,字符串先导入BigInteger * *或*工作)。

Next – *@Document*:

下一个——* @Document *:

```
@Document
public class User {
    //
}
```



This annotation simply marks a class as being a domain object that needs to be persisted to the database, along with allowing us to choose the name of the collection to be used.

这个注释仅仅标志着一个类作为一个域对象,需要被持久化到数据库,让我们一起来选择使用的集合的名称。

## 8. Conclusion

## 8. 结论

This article was a quick but comprehensive introduction to using MongoDB with Spring Data, both via the *MongoTemplate* API as well as making use of *MongoRepository*.

这篇文章是一个快速而全面的介绍使用MongoDB和弹簧数据,同时通过* MongoTemplate * API以及利用* MongoRepository *。

The implementation of all these examples and code snippets can be found [over on Github](https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb) – this is a Maven-based project, so it should be easy to import and run as it is.

所有这些例子的实现和代码片段可以找到在Github (https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb)——这是一个Maven-based项目,所以它应该易于导入和运行。




<https://www.baeldung.com/spring-data-mongodb-tutorial>



相关链接:

- [Spring Data MongoDB系列(一): 简介](05_01_spring-data-mongodb-tutorial.md)
- [Spring Data MongoDB系列(二): 简单查询](05_02_queries-in-spring-data-mongodb.md)
- [Spring Data MongoDB系列(八): 映射与聚合](05_08_spring-data-mongodb-projections-aggregations.md)
