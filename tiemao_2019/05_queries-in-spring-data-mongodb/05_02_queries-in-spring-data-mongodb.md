# A Guide to Queries in Spring Data MongoDB

# Spring Data MongoDB系列(二): 简单查询

## **1. Overview**

## 1、概览

This article will focus on building out different **types of queries in Spring Data MongoDB**.

本文主要介绍 **Spring Data MongoDB** 中怎样构建各种查询。

We’re going to be looking at querying documents with *Query* and *Criteria* classes, auto-generated query methods, JSON queries and QueryDSL.

可以使用 `Query` 和 `Criteria` 类来查询文档, 此外还可以使用自动生成的query方法, JSON查询, 还有 QueryDSL。

For the Maven setup, have a look at our [introductory article](https://www.baeldung.com/spring-data-mongodb-tutorial).

关于Maven项目的设置, 请参考前文: <./05_01_spring-data-mongodb-tutorial.md>。

## **2. Documents Query**

## 2、文档查询

One of the more common ways to query MongoDB with Spring Data is by making use of the *Query* and *Criteria* classes – which very closely mirror native operators.

Spring Data MongoDB中，查询最常用的组合是 `Query` 和 `Criteria` 类, 非常类似于MongoDB命令行操作符。

### **2.1. Is**

### 2.1、相等判断(`is`)

This is simply a criterion using equality – let’s see how it works.

标准的相等(equality)判断使用`is` 方法。

In the following example – we’re looking for users named *Eric*.

下面查询name等于 `Eric` 的用户信息。

Let’s look at our database:

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
    "age" : 55 
  }
]
```



Now let’s look at query code:

查询代码如下:

```
Query query = new Query();
query.addCriteria(Criteria.where("name").is("Eric"));
List<User> users = mongoTemplate.find(query, User.class);

```


This logic returns, as expected:

执行这段代码, 返回的结果为:

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

正则表达式查询，是一种更强大更灵活的方式。 MongoDB 提供了 `$regex` 操作符来匹配正则查询。

It works similar to *startingWith, endingWith* operations – let’s look at an example.

其工作原理类似于 `startingWith`, `endingWith` 操作, 请看下面的示例。

We’re now looking for all users that have names starting with *A*.

下面需要查询name以 `A` 开头的用户。

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

执行后返回了2条记录:

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

接下来查询name以 `c` 结尾的用户:

```
Query query = new Query();
query.addCriteria(Criteria.where("name").regex("c$"));
List<User> users = mongoTemplate.find(query, User.class);
```



So the result will be:

结果是:

```
{
  "_id" : ObjectId("55c0e5e5511f0a164a581907"),
  "_class" : "org.baeldung.model.User",
  "name" : "Eric",
  "age" : 45
}
```



### **2.3. Lt and gt**

### 2.3、大小判断( `lt` 和 `gt`)

These operators create a criterion using the *$lt* (less than) operator and *$gt* (greater than).

这两个操作对应的是 `$lt` (less than, 小于)和 `$gt` (greater than, 大于)操作符。

Let’s have a quick look at an example – we’re looking for all users with age between 20 and 50.

示例, 查询age在20到50之间的所有User。

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

结果返回了年龄大于20,小于50的所有用户:

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

`Sort` 用于指定结果集的排序。

The example below returns all users sorted by age in ascending order.

下面将所有返回的User按年龄升序排序。

First – here’s the existing data:

假设数据中的记录为:

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

执行排序的代码:

```
Query query = new Query();
query.with(new Sort(Sort.Direction.ASC, "age"));
List<User> users = mongoTemplate.find(query, User.class);
```



And here’s the result of the query – nicely sorted by *age*:

查询返回的结果, 按年龄(`age`)排好了序:

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

看一个简单的分页示例。

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

## 3、Spring自动实现的查询方法

Let’s now explore the more common type of query that Spring Data usually provides – auto-generated queries out of method names.

接下来、一起来看 Spring Data 支持的 —— 自动生成的查询方法。

The only thing we need to do to leverage these kinds of queries is to declare the method on the repository interface:

我们唯一需要做的,就是在自定义的Repository接口上声明对应类型的方法:

```
public interface UserRepository 
  extends MongoRepository<User, String>, QueryDslPredicateExecutor<User> {
    ...
}
```



### 3.1、 FindByXxx

### 3.1、 FindByXxx 模式

We’ll start simple, by exploring the findBy type of query – in this case, find by name: 


先看看简单的例子, `findBy` 这一类的查询, 比如说, 按 name 查找:

```
List<User> findByName(String name);
```



Same as in the previous section – 2.1 – the query will have the same results, finding all users with the given name:

和前一节(2.1)类似, 查询结果也是相同的, 查找对应name的所有 User:

```
List<User> users = userRepository.findByName("Eric");
```



### **3.2. StartingWith and** ***endingWith.***

### 3.2、 StartingWith 与 endingWith 模式

In 2.2, we explored a *regex* based query. Starts and ends with are of course less powerful, but nevertheless quite useful – especially if we don’t have to actually implement them.

在2.2小节中, 我们介绍了正则表达式查询。 开始和结束字符判断并不是很强大, 但非常实用, 特别是不需要我们编写具体的代码。


Here’s a quick example of how the operations would look like: 


下面是简单的示例:

```
List<User> findByNameStartingWith(String regexp);

List<User> findByNameEndingWith(String regexp);
```



The example of actually using this would, of course, be very simple:

使用起来也很简单:

```
List<User> users = userRepository.findByNameStartingWith("A");

List<User> users2 = userRepository.findByNameEndingWith("c");
```



And the results are exactly the same.

结果也一样。

### **3.3. Between**

### 3.3、 findBy...Between 模式

Similar to 2.3, this will return all users with age between *ageGT* and *ageLT:*

和 2.3 节类似, Between 会返回年龄在 `ageGT` 和 `ageLT` 之间的所有User:

```
List<User> findByAgeBetween(int ageGT, int ageLT);
```



Calling the method will result in exactly the same documents being found:

执行结果也一样:

```
List<User> users = userRepository.findByAgeBetween(20, 50);
```



### **3.4. Like and OrderBy**

### 3.4、 Like 与 OrderBy

Let’s have a look at a more advanced example this time – combining two types of modifiers for the generated query.

下面看一个高级点的用法, 组合两种类型的查询修饰符。

We’re going to be looking for all users that have names containing the letter *A* and we’re also going to order the results by age, in ascending order:

查询名字中包含字母`A`的所有User, 对结果以age升序排序(ascending):

```
List<User> users = userRepository.findByNameLikeOrderByAgeAsc("A");
```



For the database we used in 2.4 – the result will be:

使用2.4节中的数据, 结果是:

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

## 4、JSON方式的查询

If we can’t represent a query with the help of a method name, or criteria, we can do something more low level – **use the @Query annotation**.

如果不好将查询条件表示为某个方法名, 或者标准查询(criteria), 则可以使用底层API进行操作 —— 比如使用 `@Query` 注解。

With this annotation, we can specify a raw query – as a Mongo JSON query string.

可以使用 `@Query` 注解定义原生查询 —— 也就是作为 Mongo JSON 查询字符串。

### **4.1. FindBy**

### 4.1、 FindBy方式

Let’s start simple and look at how we would represent **a find by type of method** first:

先来看看怎样实现简单的 find by 方法:

```
@Query("{ 'name' : ?0 }")
List<User> findUsersByName(String name);
```


This method should return users by name – the placeholder *?0* references the first parameter of the method.

这个方法根据name返回对应的User —— 占位符 `?0` 表示对应方法的第 0 个参数。

```
List<User> users = userRepository.findUsersByName("Eric");
```



### **4.2 $regex**

### 4.2 $regex方式

Let’s also look at **a regex driven query** – which of course produces the same result as in 2.2 and 3.2:

下面看一个正则方式的查询, 当然结果和 2.2、3.2 是一致的:

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

### 4.3. $lt 和 $gt

Let’s now implement the lt and *gt* query:

下面实现lt和gt查询:

```
@Query("{ 'age' : { $gt: ?0, $lt: ?1 } }")
List<User> findUsersByAgeBetween(int ageGT, int ageLT);
```



Now how, now that the method has 2 parameters, we’re referencing each of these by index in the raw query: *?0* and *?1*.

这个方法有两个参数, 我们在原生查询中通过: `?0` 和`?1` 来引用这些参数。

```
List<User> users = userRepository.findUsersByAgeBetween(20, 50);

```



## **5. QueryDSL Queries**

## 5. QueryDSL 查询

*MongoRepository* has good support for the [QueryDSL](http://www.querydsl.com/) project – so we can leverage that nice, type-safe API here as well.

`MongoRepository` 对 [QueryDSL项目](http://www.querydsl.com/) 的支持非常好, 所以我们可以好好利用其简洁又安全的API。

### **5.1. The Maven Dependencies**

### 5.1. Maven依赖

First, let’s make sure we have the correct Maven dependencies defined in the pom:

首先, 确保 Maven 项目的依赖关系:

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

### 5.2. Q-classes

QueryDSL used Q-classes for creating queries. But, since we don’t really want to create these by hand, **we need to generate them** somehow.

QueryDSL 使用 Q-classes 来创建查询。但是, 我们不想手动创建查询, 最好是能自动生成。

We’re going to use the apt-maven-plugin to do that:

可以使用 apt-maven-plugin 插件:

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

再来看看 `User` 类 —— 其中有个 `@QueryEntity` 注解:

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

在Maven生命周期的 process 目标(或之后的任何目标) 之后, apt插件会生成新的class到 `target/generated-sources/java/{your package structure}` 目录下:

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

有了这个类, 我们就不用去手工编写查询代码了。

As a side note – if you’re using Eclipse, introducing this plugin will generate the following warning in pom:

另外 —— 如果使用Eclipse, 引入这个插件会在pom中产生以下警告:

> *You need to run build with JDK or have tools.jar on the classpath. If this occurs during eclipse build make sure you run eclipse under JDK as well (com.mysema.maven:apt-maven-plugin:1.1.3:process:default:generate-sources*


Maven *install* works fine and *QUser* class is generated, but a plugin is highlighted in the pom.

Maven 中install没什么问题, `QUser`类的生成也没问题,但在pom中这个插件被高亮显示。

A quick fix is to manually point to the JDK in *eclipse.ini*:

快速修复方式是在 `eclipse.ini` 文件中手动指定JDK的位置:

```
...
-vm
{path_to_jdk}\jdk{your_version}\bin\javaw.exe
```



### **5.3. The New Repository**

### 5.3. 新的 Repository

Now we need to actually enable QueryDSL support in our repositories – which is done by simply **extending the QueryDslPredicateExecutor interface**:

那么需要启用QueryDSL以支持Repository —— 只需要继承 `QueryDslPredicateExecutor` 接口即可:

```
public interface UserRepository extends
  MongoRepository<User, String>, QuerydslPredicateExecutor<User>
```



### **5.4. Eq**

### 5.4. Eq

With support enabled, **let’s now implement the same queries** as the ones we illustrated before.

启用了QueryDSL支持, 我们来实现和前面小节相同的查询。

We’ll start with simple equality:

简单的相等查询:

```
QUser qUser = new QUser("user");
Predicate predicate = qUser.name.eq("Eric");
List<User> users = (List<User>) userRepository.findAll(predicate);
```



### **5.5. StartingWith and EndingWith**

### 5.5. StartingWith 与 EndingWith

Similarly, let’s implement the previous queries – and find users with names that are starting with *A*:

同样, 实现前面的查询, 找到名字以 `A` 开始的User:

```
QUser qUser = new QUser("user");
Predicate predicate = qUser.name.startsWith("A");
List<User> users = (List<User>) userRepository.findAll(predicate);
```



And ending with *c*:

找到名字以 `c` 结尾的User:

```
QUser qUser = new QUser("user");
Predicate predicate = qUser.name.endsWith("c");
List<User> users = (List<User>) userRepository.findAll(predicate);
```



The result with same as in 2.2, 3.2 or 4.2.

结果和 2.2、 3.2、 4.2一致。

### **5.6. Between**

### 5.6. Between

The next one query will return users with age between 20 and 50 – similar to the previous sections:

查询年龄在20到50之间的年龄, 代码也类似:

```
QUser qUser = new QUser("user");
Predicate predicate = qUser.age.between(20, 50);
List<User> users = (List<User>) userRepository.findAll(predicate);
```



## **6. Conclusion**

## 6. 结论

In this article, we explored the many ways we can query using Spring Data MongoDB.

本文介绍了 Spring Data MongoDB 支持的各种查询方式。

It’s interesting to take a step back and see just how many powerful ways we have to query MongoDB – varying from limited control all the way to full control with raw queries.

可以用很多强大的方式来查询MongoDB —— 包括很局限的方式、以及使用原生查询来完全控制。

The implementation of all these examples and code snippets **can be found in** [**the GitHub project**](https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb) – this is an Eclipse based project, so it should be easy to import and run as it is.

这些示例的代码、请参考: <https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb>。

本系列课程对应的代码: <https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb>


相关链接:

- [Spring Data MongoDB系列(一): 简介](05_01_spring-data-mongodb-tutorial.md)
- [Spring Data MongoDB系列(二): 简单查询](05_02_queries-in-spring-data-mongodb.md)
- [Spring Data MongoDB系列(三): 索引、注解和转换器](05_02_queries-in-spring-data-mongodb.md)
- [Spring Data MongoDB系列(八): 映射与聚合](05_08_spring-data-mongodb-projections-aggregations.md)


原文日期: 2018年11月6日

原文链接: <https://www.baeldung.com/queries-in-spring-data-mongodb>

