# A Guide to Queries in Spring Data MongoDB

# Spring Data MongoDB系列(二): 简单查询

## **1. Overview**

## 1、概览

This article will focus on building out different **types of queries in Spring Data MongoDB**.

本文主要介绍 **Spring Data MongoDB** 中的各种查询。

We’re going to be looking at querying documents with *Query* and *Criteria* classes, auto-generated query methods, JSON queries and QueryDSL.

查询文档可以使用 `Query` 和 `Criteria` 类, 以及自动生成的query方法, JSON查询, 还有 QueryDSL。

For the Maven setup, have a look at our [introductory article](https://www.baeldung.com/spring-data-mongodb-tutorial).

关于Maven项目的设置, 请参考上一篇文章: <https://www.baeldung.com/spring-data-mongodb-tutorial>。

## **2. Documents Query**

## 2、文档查询

One of the more common ways to query MongoDB with Spring Data is by making use of the *Query* and *Criteria* classes – which very closely mirror native operators.

Spring Data MongoDB 查询，最常用的是 `Query` 和 `Criteria` 类的方法,和MongoDB的原生操作非常类似。

### **2.1. Is**

### 2.1、相等判断(`is`)

This is simply a criterion using equality – let’s see how it works.

`is` 方法是标准的相等(equality)判断。

In the following example – we’re looking for users named *Eric*.

下面我们查询名叫 `Eric` 的User。

Let’s look at our database:

假设数据库中存在以下记录:

```
[ 
  {
    "_id" : ObjectId("55c0e5e5511f0a164a581907"),
    "_class" : "org.baeldung.model.User",
    "name" : "Eric",
    "age" : 45 
  },
  {
    "_id" : ObjectId("55c0e5e5511f0a164a581908"),
    "_class" : "org.baeldung.model.User",
    "name" : "Antony",
    "age" : 55 
  }
]
```



Now let’s look at query code:

下面是查询代码:

```
Query query = new Query();
query.addCriteria(Criteria.where("name").is("Eric"));
List<User> users = mongoTemplate.find(query, User.class);

```



This logic returns, as expected:

执行这段代码返回的结果为:

```
{
  "_id" : ObjectId("55c0e5e5511f0a164a581907"),
  "_class" : "org.baeldung.model.User",
  "name" : "Eric",
  "age" : 45
}
```



### **2.2. Regex**

### 2.2、 正则匹配(regex)

A more flexible and powerful type of query is the regex. This creates a criterion using a MongoDB *$regex* that returns all records suitable for this regexp for this field.

正则表达式，是更强大更灵活的查询方式。 MongoDB 提供了 `$regex` 操作符来匹配正则查询。

It works similar to *startingWith, endingWith* operations – let’s look at an example.

它的工作原理类似于 startingWith, endingWith 操作, 请看下面的例子。

We’re now looking for all users that have names starting with *A*.

下面查询名字以`A`开始的User。

Here’s the state of the database:

假设数据库中的记录为:

```
[ 
  {
    "_id" : ObjectId("55c0e5e5511f0a164a581907"),
    "_class" : "org.baeldung.model.User",
    "name" : "Eric",
    "age" : 45 
  },
  {
    "_id" : ObjectId("55c0e5e5511f0a164a581908"),
    "_class" : "org.baeldung.model.User",
    "name" : "Antony",
    "age" : 33 
  },
  {
    "_id" : ObjectId("55c0e5e5511f0a164a581909"),
    "_class" : "org.baeldung.model.User",
    "name" : "Alice",
    "age" : 35 
  }
]
```



Let’s now create the query:

查询代码如下:

```
Query query = new Query();
query.addCriteria(Criteria.where("name").regex("^A"));
List<User> users = mongoTemplate.find(query, User.class);
```



This runs and returns 2 records:

执行的结果是返回2条记录:

```
[
  {
    "_id" : ObjectId("55c0e5e5511f0a164a581908"),
    "_class" : "org.baeldung.model.User",
    "name" : "Antony",
    "age" : 33
  },
  {
    "_id" : ObjectId("55c0e5e5511f0a164a581909"),
    "_class" : "org.baeldung.model.User",
    "name" : "Alice",
    "age" : 35
  }
]
```



Here’s another quick example, this time looking for all users that have names ending with *c*:

接下来是另一个简单的示例, 查询名字以 `c` 结尾的所有User:

```
Query query = new Query();
query.addCriteria(Criteria.where("name").regex("c$"));
List<User> users = mongoTemplate.find(query, User.class);
```



So the result will be:

结果将会是:

```
{
  "_id" : ObjectId("55c0e5e5511f0a164a581907"),
  "_class" : "org.baeldung.model.User",
  "name" : "Eric",
  "age" : 45
}
```



### **2.3. Lt and gt**

### 2.3、大于小于判断( `lt` 和 `gt`)

These operators create a criterion using the *$lt* (less than) operator and *$gt* (greater than).

这两个操作符对应的是 `$lt` (less than, 小于)和 `$gt` (greater than,大于)操作符。

Let’s have a quick look at an example – we’re looking for all users with age between 20 and 50.

示例, 查询年龄在20到50之间的所有User。

The database is:

数据库中的记录为:

```
[
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581907"),
        "_class" : "org.baeldung.model.User",
        "name" : "Eric",
        "age" : 45
    },
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581908"),
        "_class" : "org.baeldung.model.User",
        "name" : "Antony",
        "age" : 55
    }
}
```



This query code:

查询代码为:

```
Query query = new Query();
query.addCriteria(Criteria.where("age").lt(50).gt(20));
List<User> users = mongoTemplate.find(query,User.class);
```



And the result – all user who with an age of greater than 20 and less than 50:

结果, 列出了年龄大于20,小于50的所有User:

```
{
    "_id" : ObjectId("55c0e5e5511f0a164a581907"),
    "_class" : "org.baeldung.model.User",
    "name" : "Eric",
    "age" : 45
}
```



### **2.4. Sort**

### 2.4、结果排序(`Sort`)

*Sort* is used to specify a sort order for the results.

`Sort` 对象用于指定结果集的排序顺序。

The example below returns all users sorted by age in ascending order.

下面的示例， 将所有User按年龄升序排序，并返回。

First – here’s the existing data:

假设数据中的记录:

```
[
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581907"),
        "_class" : "org.baeldung.model.User",
        "name" : "Eric",
        "age" : 45
    },
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581908"),
        "_class" : "org.baeldung.model.User",
        "name" : "Antony",
        "age" : 33
    },
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581909"),
        "_class" : "org.baeldung.model.User",
        "name" : "Alice",
        "age" : 35
    }
]
```



After executing *sort*:

执行排序:

```
Query query = new Query();
query.with(new Sort(Sort.Direction.ASC, "age"));
List<User> users = mongoTemplate.find(query,User.class);
```



And here’s the result of the query – nicely sorted by *age*:

查询得到的结果, 按年龄排好了序(`age`):

```
[
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581908"),
        "_class" : "org.baeldung.model.User",
        "name" : "Antony",
        "age" : 33
    },
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581909"),
        "_class" : "org.baeldung.model.User",
        "name" : "Alice",
        "age" : 35
    },
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581907"),
        "_class" : "org.baeldung.model.User",
        "name" : "Eric",
        "age" : 45
    }
]
```



### **2.5. Pageable**

### 2.5. 分页(`Pageable`)

Let’s look at a quick example using pagination.

让我们看一个简单的分页(pagination)示例。

Here’s the state of the database:

数据库中的记录:

```
[
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581907"),
        "_class" : "org.baeldung.model.User",
        "name" : "Eric",
        "age" : 45
    },
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581908"),
        "_class" : "org.baeldung.model.User",
        "name" : "Antony",
        "age" : 33
    },
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581909"),
        "_class" : "org.baeldung.model.User",
        "name" : "Alice",
        "age" : 35
    }
]
```



Now, the query logic, simply asking for a page of size 2:

设置每页条数为2, 执行查询:

```
final Pageable pageableRequest = PageRequest.of(0, 2);
Query query = new Query();
query.with(pageableRequest);
```



And the result – the 2 documents, as expected:

返回2条记录:

```
[
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581907"),
        "_class" : "org.baeldung.model.User",
        "name" : "Eric",
        "age" : 45
    },
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581908"),
        "_class" : "org.baeldung.model.User",
        "name" : "Antony",
        "age" : 33
    }
]
```



## **3. Generated Query Methods**

## 3、生成查询方法

Let’s now explore the more common type of query that Spring Data usually provides – auto-generated queries out of method names.

接下来、一起来看 Spring Data 支持的 —— 自动生成查询方法。

The only thing we need to do to leverage these kinds of queries is to declare the method on the repository interface:

我们唯一需要做的,利用这些类型的查询是声明库接口上的方法:

```
public interface UserRepository 
  extends MongoRepository<User, String>, QueryDslPredicateExecutor<User> {
    ...
}
```



### 3.1、 FindByXxx

We’ll start simple, by exploring the findBy type of query – in this case, find by name: 


先看看简单的例子, `findBy` 这一类的查询, 比如说, 按 name 查找:

```
List<User> findByName(String name);
```



Same as in the previous section – 2.1 – the query will have the same results, finding all users with the given name:

和前一节(2.1)中的一样, 查询结果是相同的, 找到了对应名字的所有 User:

```
List<User> users = userRepository.findByName("Eric");
```



### **3.2. StartingWith and** ***endingWith.***

### 3.2、 StartingWith 与 endingWith

In 2.2, we explored a *regex* based query. Starts and ends with are of course less powerful, but nevertheless quite useful – especially if we don’t have to actually implement them.

在2.2小节中, 我们介绍了基于正则表达式的查询。 开始和结束判断对人不是很强大, 但非常实用, 最好是不需要我们自己来实现这种判断。


Here’s a quick example of how the operations would look like: 


下面是一个简单的示例:

```
List<User> findByNameStartingWith(String regexp);

List<User> findByNameEndingWith(String regexp);
```



The example of actually using this would, of course, be very simple:

使用也非常简单:

```
List<User> users = userRepository.findByNameStartingWith("A");

List<User> users2 = userRepository.findByNameEndingWith("c");
```



And the results are exactly the same.

结果也是一样的。

### **3.3. Between**

### 3.3、 Between

Similar to 2.3, this will return all users with age between *ageGT* and *ageLT:*

和 2.3 节类似, Between 会返回年龄在 `ageGT` 和 `ageLT` 之间的所有User:

```
List<User> findByAgeBetween(int ageGT, int ageLT);
```



Calling the method will result in exactly the same documents being found:

执行的结果也是一样的:

```
List<User> users = userRepository.findByAgeBetween(20, 50);
```



### **3.4. Like and OrderBy**

### 3.4、 Like 与 OrderBy

Let’s have a look at a more advanced example this time – combining two types of modifiers for the generated query.

让我们看一看一个更先进的例子,结合两种类型的修饰符生成的查询。

We’re going to be looking for all users that have names containing the letter *A* and we’re also going to order the results by age, in ascending order:

我们要查询所有User名称包含信* *,我们也将结果按年龄顺序,以升序排序:

```
List<User> users = userRepository.findByNameLikeOrderByAgeAsc("A");
```



For the database we used in 2.4 – the result will be:

2.4中使用的数据库,结果将是:

```
[
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581908"),
        "_class" : "org.baeldung.model.User",
        "name" : "Antony",
        "age" : 33
    },
    {
        "_id" : ObjectId("55c0e5e5511f0a164a581909"),
        "_class" : "org.baeldung.model.User",
        "name" : "Alice",
        "age" : 35
    }
]
```



## **4. JSON Query Methods**

## * * 4。* * JSON查询方法

If we can’t represent a query with the help of a method name, or criteria, we can do something more low level – **use the @Query annotation**.

如果我们不能代表一个查询的帮助下一个方法名,或者标准,我们可以做一些更低水平——* *使用@Query注释* *。

With this annotation, we can specify a raw query – as a Mongo JSON query string.

这个注释,我们可以指定一个原始查询——Mongo JSON查询字符串。

### **4.1. FindBy**

### * * 4.1。FindBy * *

Let’s start simple and look at how we would represent **a find by type of method** first:

让我们开始简单的看看如何代表* * * *第一:找到类型的方法

```
@Query("{ 'name' : ?0 }")
List<User> findUsersByName(String name);
```



This method should return users by name – the placeholder *?0* references the first parameter of the method.

此方法应该返回User的名字——占位符* ?0 *引用方法的第一个参数。

```
List<User> users = userRepository.findUsersByName("Eric");
```



### **4.2 $regex**

### * * * *正则表达式(4.2美元)

Let’s also look at **a regex driven query** – which of course produces the same result as in 2.2 and 3.2:

让我们也看看* *一个正则表达式查询驱动的* *,当然会产生相同的结果在2.2和3.2:

```
@Query("{ 'name' : { $regex: ?0 } }")
List<User> findUsersByRegexpName(String regexp);
```



The usage is also exactly the same:

使用也是一样的:

```
List<User> users = userRepository.findUsersByRegexpName("^A");

List<User> users = userRepository.findUsersByRegexpName("c$");
```



### **4.3. $lt and $gt**

### * * 4.3。$ lt和$ gt * *

Let’s now implement the lt and *gt* query:

现在让我们实现lt和* gt *查询:

```
@Query("{ 'age' : { $gt: ?0, $lt: ?1 } }")
List<User> findUsersByAgeBetween(int ageGT, int ageLT);
```



Now how, now that the method has 2 parameters, we’re referencing each of these by index in the raw query: *?0* and *?1*.

现在如何,方法有两个参数,我们通过索引引用这些原始查询:* ?0 *和* ? 1 *。

```
List<User> users = userRepository.findUsersByAgeBetween(20, 50);
```



## **5. QueryDSL Queries**

## * * 5。QueryDSL Queries * *

*MongoRepository* has good support for the [QueryDSL](http://www.querydsl.com/) project – so we can leverage that nice, type-safe API here as well.

* MongoRepository *有很好的支持(QueryDSL)(http://www.querydsl.com/)的项目,所以我们可以利用好,类型安全的API。

### **5.1. The Maven Dependencies**

### * * 5.1。Maven的依赖* *

First, let’s make sure we have the correct Maven dependencies defined in the pom:

首先,让我们确保我们有正确的Maven pom中定义的依赖关系:

```
<dependency>
    <groupId>com.mysema.querydsl</groupId>
    <artifactId>querydsl-mongodb</artifactId>
    <version>3.6.6</version>
</dependency>
<dependency>
    <groupId>com.mysema.querydsl</groupId>
    <artifactId>querydsl-apt</artifactId>
    <version>3.6.6</version>
</dependency>
```



### **5.2. Q-classes**

### * * 5.2。Q-classes * *

QueryDSL used Q-classes for creating queries. But, since we don’t really want to create these by hand, **we need to generate them** somehow.

QueryDSL Q-classes用于创建查询。但是,因为我们不想创建这些,* *我们需要生成他们* *。

We’re going to use the apt-maven-plugin to do that:

我们要用apt-maven-plugin这样做:

```
<plugin>    
    <groupId>com.mysema.maven</groupId>
    <artifactId>apt-maven-plugin</artifactId>
    <version>1.1.3</version>
    <executions>
        <execution>
            <goals>
                <goal>process</goal>
            </goals>
            <configuration>
                <outputDirectory>target/generated-sources/java</outputDirectory>
                <processor>
                  org.springframework.data.mongodb.repository.support.MongoAnnotationProcessor
                </processor>
            </configuration>
        </execution>
     </executions>
</plugin>
```



Let’s look at the *User* class – focusing specifically at the *@QueryEntity* annotation:

让我们看看*User*类——着重* @QueryEntity *注释:

```
@QueryEntity
@Document
public class User {
  
    @Id
    private String id;
    private String name;
    private Integer age;
  
    // standard getters and setters
}
```



After running the *process* goal of the Maven lifecycle (or anything another goal after that one) – the apt plugin **will generate the new classes** under *target/generated-sources/java/{your package structure}*:

跑后的* *过程目标Maven生命周期(或任何另一个目标后,)- apt插件* *将生成新类* * *目标/生成的源代码/ java / {您的软件包 结构}:*

```
/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.mysema.query.codegen.EntitySerializer")
public class QUser extends EntityPathBase<User> {
 
    private static final long serialVersionUID = ...;
 
    public static final QUser user = new QUser("user");
 
    public final NumberPath<Integer> age = createNumber("age", Integer.class);
 
    public final StringPath id = createString("id");
 
    public final StringPath name = createString("name");
 
    public QUser(String variable) {
        super(User.class, forVariable(variable));
    }
 
    public QUser(Path<? extends User> path) {
        super(path.getType(), path.getMetadata());
    }
 
    public QUser(PathMetadata<?> metadata) {
        super(User.class, metadata);
    }
}
```



It’s with the help of this class that we’re not going to be creating our queries.

在这个类的帮助,我们不会创建查询。

As a side note – if you’re using Eclipse, introducing this plugin will generate the following warning in pom:

作为边注——如果你使用Eclipse,引入这个插件在pom将生成以下警告:

> *You need to run build with JDK or have tools.jar on the classpath. If this occurs during eclipse build make sure you run eclipse under JDK as well (com.mysema.maven:apt-maven-plugin:1.1.3:process:default:generate-sources*

> *与JDK或您需要运行构建工具。jar的类路径中。如果这发生在eclipse构建确保你运行eclipse在JDK(com.mysema.maven:apt-maven-plugin:1.1.3:过程:默认值:generate-sources *

Maven *install* works fine and *QUser* class is generated, but a plugin is highlighted in the pom.

安装Maven * *和* QUser *类生成没问题,但在pom插件被高亮显示。

A quick fix is to manually point to the JDK in *eclipse.ini*:

一个快速修复是手动指向JDK * eclipse.ini *:

```
...
-vm
{path_to_jdk}\jdk{your_version}\bin\javaw.exe
```



### **5.3. The New Repository**

### * * 5.3。新存储库* *

Now we need to actually enable QueryDSL support in our repositories – which is done by simply **extending the QueryDslPredicateExecutor interface**:

实际上现在我们需要启用QueryDSL支持我们的存储库——这是由* * * *扩展QueryDslPredicateExecutor界面:

```
public interface UserRepository extends
  MongoRepository<User, String>, QuerydslPredicateExecutor<User>
```



### **5.4. Eq**

### * * 5.4。co2 * *

With support enabled, **let’s now implement the same queries** as the ones we illustrated before.

启用的支持下,* * * *让我们实现相同的查询的我们之前了。

We’ll start with simple equality:

我们先简单的平等:

```
QUser qUser = new QUser("user");
Predicate predicate = qUser.name.eq("Eric");
List<User> users = (List<User>) userRepository.findAll(predicate);
```



### **5.5. StartingWith and EndingWith**

### * * 5.5。StartingWith EndingWith * *

Similarly, let’s implement the previous queries – and find users with names that are starting with *A*:

同样,让我们实现前面的查询,找到User的名字,从* *:

```
QUser qUser = new QUser("user");
Predicate predicate = qUser.name.startsWith("A");
List<User> users = (List<User>) userRepository.findAll(predicate);
```



And ending with *c*:

和结束* c *:

```
QUser qUser = new QUser("user");
Predicate predicate = qUser.name.endsWith("c");
List<User> users = (List<User>) userRepository.findAll(predicate);
```



The result with same as in 2.2, 3.2 or 4.2.

一样的结果2.2,3.2或4.2。

### **5.6. Between**

### * * 5.6。* *之间

The next one query will return users with age between 20 and 50 – similar to the previous sections:

下一个查询将返回User年龄在20到50之间,类似于前面的部分:

```
QUser qUser = new QUser("user");
Predicate predicate = qUser.age.between(20, 50);
List<User> users = (List<User>) userRepository.findAll(predicate);
```



## **6. Conclusion**

## * * 6。结论* *

In this article, we explored the many ways we can query using Spring Data MongoDB.

在本文中,我们探讨了很多方面我们可以查询数据MongoDB使用Spring。

It’s interesting to take a step back and see just how many powerful ways we have to query MongoDB – varying from limited control all the way to full control with raw queries.

有趣的后退一步,看看我们有多少强大的方式来查询MongoDB——不同从有限的控制与原始查询完全控制。

The implementation of all these examples and code snippets **can be found in** [**the GitHub project**](https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb) – this is an Eclipse based project, so it should be easy to import and run as it is.

所有这些例子的实现和代码片段可以找到* * * *(* * GitHub项目* *)(https://github).com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb)——这是一个基于Eclipse的项目,所以它应该易于导入并运行。



<https://www.baeldung.com/queries-in-spring-data-mongodb>

Last modified: November 6, 2018

最后修改:2018年11月6日

本系列课程对应的代码: <https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb>

count操作: <http://www.technicalkeeda.com/mongodb-tutorial/mongodb-document-count-for-matched-query-using-spring-data>



