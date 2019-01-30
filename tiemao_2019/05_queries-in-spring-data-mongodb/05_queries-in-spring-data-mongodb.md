# A Guide to Queries in Spring Data MongoDB

## **1. Overview**

This article will focus on building out different **types of queries in Spring Data MongoDB**.

We’re going to be looking at querying documents with *Query* and *Criteria* classes, auto-generated query methods, JSON queries and QueryDSL.

For the Maven setup, have a look at our [introductory article](https://www.baeldung.com/spring-data-mongodb-tutorial).

## **2. Documents Query**

One of the more common ways to query MongoDB with Spring Data is by making use of the *Query* and *Criteria* classes – which very closely mirror native operators.

### **2.1. Is**

This is simply a criterion using equality – let’s see how it works.

In the following example – we’re looking for users named *Eric*.

Let’s look at our database:

```
`[``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581907"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Eric"``,``        ``"age"` `: 45``    ``},``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581908"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Antony"``,``        ``"age"` `: 55``    ``}``}`
```

Now let’s look at query code:

```
`Query query = ``new` `Query();``query.addCriteria(Criteria.where(``"name"``).is(``"Eric"``));``List<User> users = mongoTemplate.find(query, User.``class``);`
```

This logic returns, as expected:

```
`{``    ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581907"``),``    ``"_class"` `: ``"org.baeldung.model.User"``,``    ``"name"` `: ``"Eric"``,``    ``"age"` `: 45``}`
```

### **2.2. Regex**

A more flexible and powerful type of query is the regex. This c``reates a criterion using a MongoDB *$regex* that returns all records suitable for this regexp for this field.

It works similar to *startingWith, endingWith* operations – let’s look at an example.

We’re now looking for all users that have names starting with *A*.

Here’s the state of the database:

```
`[``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581907"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Eric"``,``        ``"age"` `: 45``    ``},``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581908"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Antony"``,``        ``"age"` `: 33``    ``},``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581909"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Alice"``,``        ``"age"` `: 35``    ``}``]`
```

Let’s now create the query:

```
`Query query = ``new` `Query();``query.addCriteria(Criteria.where(``"name"``).regex(``"^A"``));``List<User> users = mongoTemplate.find(query,User.``class``);`
```

This runs and returns 2 records:

```
`[``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581908"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Antony"``,``        ``"age"` `: 33``    ``},``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581909"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Alice"``,``        ``"age"` `: 35``    ``}``]`
```

Here’s another quick example, this time looking for all users that have names ending with *c*:

```
`Query query = ``new` `Query();``query.addCriteria(Criteria.where(``"name"``).regex(``"c$"``));``List<User> users = mongoTemplate.find(query, User.``class``);`
```

So the result will be:

```
`{``    ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581907"``),``    ``"_class"` `: ``"org.baeldung.model.User"``,``    ``"name"` `: ``"Eric"``,``    ``"age"` `: 45``}`
```

### **2.3. Lt and gt**

These operators create a criterion using the *$lt* (less than) operator and *$gt* (greater than).

Let’s have a quick look at an example – we’re looking for all users with age between 20 and 50.

The database is:

```
`[``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581907"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Eric"``,``        ``"age"` `: 45``    ``},``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581908"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Antony"``,``        ``"age"` `: 55``    ``}``}`
```

This query code:

```
`Query query = ``new` `Query();``query.addCriteria(Criteria.where(``"age"``).lt(``50``).gt(``20``));``List<User> users = mongoTemplate.find(query,User.``class``);`
```

And the result – all user who with an age of greater than 20 and less than 50:

```
`{``    ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581907"``),``    ``"_class"` `: ``"org.baeldung.model.User"``,``    ``"name"` `: ``"Eric"``,``    ``"age"` `: 45``}`
```

### **2.4. Sort**

*Sort* is used to specify a sort order for the results.

The example below returns all users sorted by age in ascending order.

First – here’s the existing data:

```
`[``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581907"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Eric"``,``        ``"age"` `: 45``    ``},``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581908"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Antony"``,``        ``"age"` `: 33``    ``},``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581909"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Alice"``,``        ``"age"` `: 35``    ``}``]`
```

After executing *sort*:

```
`Query query = ``new` `Query();``query.with(``new` `Sort(Sort.Direction.ASC, ``"age"``));``List<User> users = mongoTemplate.find(query,User.``class``);`
```

And here’s the result of the query – nicely sorted by *age*:

```
`[``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581908"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Antony"``,``        ``"age"` `: 33``    ``},``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581909"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Alice"``,``        ``"age"` `: 35``    ``},``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581907"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Eric"``,``        ``"age"` `: 45``    ``}``]`
```

### **2.5. Pageable**

Let’s look at a quick example using pagination.

Here’s the state of the database:

```
`[``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581907"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Eric"``,``        ``"age"` `: 45``    ``},``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581908"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Antony"``,``        ``"age"` `: 33``    ``},``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581909"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Alice"``,``        ``"age"` `: 35``    ``}``]`
```

Now, the query logic, simply asking for a page of size 2:

```
`final` `Pageable pageableRequest = PageRequest.of(``0``, ``2``);``Query query = ``new` `Query();``query.with(pageableRequest);`
```

And the result – the 2 documents, as expected:

```
`[``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581907"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Eric"``,``        ``"age"` `: 45``    ``},``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581908"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Antony"``,``        ``"age"` `: 33``    ``}``]`
```

## **3. Generated Query Methods**

Let’s now explore the more common type of query that Spring Data usually provides – auto-generated queries out of method names.

The only thing we need to do to leverage these kinds of queries is to declare the method on the repository interface:

```
`public` `interface` `UserRepository ``  ``extends` `MongoRepository<User, String>, QueryDslPredicateExecutor<User> {``    ``...``}`
```

### **3.1. FindByX**

We’ll start simple, by exploring the findBy type of query – in this case, find by name: 

```
`List<User> findByName(String name);`
```

Same as in the previous section – 2.1 – the query will have the same results, finding all users with the given name:

```
`List<User> users = userRepository.findByName(``"Eric"``);`
```

### **3.2. StartingWith and** ***endingWith.***

In 2.2, we explored a *regex* based query. Starts and ends with are of course less powerful, but nevertheless quite useful – especially if we don’t have to actually implement them.

Here’s a quick example of how the operations would look like: 

```
`List<User> findByNameStartingWith(String regexp);`
```

The example of actually using this would, of course, be very simple:

```
`List<User> users = userRepository.findByNameStartingWith(``"A"``);`
```

And the results are exactly the same.

### **3.3. Between**

Similar to 2.3, this will return all users with age between *ageGT* and *ageLT:*

```
`List<User> findByAgeBetween(``int` `ageGT, ``int` `ageLT);`
```

Calling the method will result in exactly the same documents being found:

```
`List<User> users = userRepository.findByAgeBetween(``20``, ``50``);`
```

### **3.4. Like and OrderBy**

Let’s have a look at a more advanced example this time – combining two types of modifiers for the generated query.

We’re going to be looking for all users that have names containing the letter *A* and we’re also going to order the results by age, in ascending order:

```
`List<User> users = userRepository.findByNameLikeOrderByAgeAsc(``"A"``);`
```

For the database we used in 2.4 – the result will be:

```
`[``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581908"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Antony"``,``        ``"age"` `: 33``    ``},``    ``{``        ``"_id"` `: ObjectId(``"55c0e5e5511f0a164a581909"``),``        ``"_class"` `: ``"org.baeldung.model.User"``,``        ``"name"` `: ``"Alice"``,``        ``"age"` `: 35``    ``}``]`
```

## **4. JSON Query Methods**

If we can’t represent a query with the help of a method name, or criteria, we can do something more low level – **use the @Query annotation**.

With this annotation, we can specify a raw query – as a Mongo JSON query string.

### **4.1. FindBy**

Let’s start simple and look at how we would represent **a find by type of method** first:

```
`@Query``(``"{ 'name' : ?0 }"``)``List<User> findUsersByName(String name);`
```

This method should return users by name – the placeholder *?0* references the first parameter of the method.

```
`List<User> users = userRepository.findUsersByName(``"Eric"``);`
```

### **4.2 $regex**

Let’s also look at **a regex driven query** – which of course produces the same result as in 2.2 and 3.2:

```
`@Query``(``"{ 'name' : { $regex: ?0 } }"``)``List<User> findUsersByRegexpName(String regexp);`
```

The usage is also exactly the same:

```
`List<User> users = userRepository.findUsersByRegexpName(``"^A"``);`
```

### **4.3. $lt and $gt**

Let’s now implement the lt and *gt* query:

```
`@Query``(``"{ 'age' : { $gt: ?0, $lt: ?1 } }"``)``List<User> findUsersByAgeBetween(``int` `ageGT, ``int` `ageLT);`
```

Now how, now that the method has 2 parameters, we’re referencing each of these by index in the raw query: *?0* and *?1*.

```
`List<User> users = userRepository.findUsersByAgeBetween(``20``, ``50``);`
```

## **5. QueryDSL Queries**

*MongoRepository* has good support for the [QueryDSL](http://www.querydsl.com/) project – so we can leverage that nice, type-safe API here as well.

### **5.1. The Maven Dependencies**

First, let’s make sure we have the correct Maven dependencies defined in the pom:

```
`<``dependency``>``    ``<``groupId``>com.mysema.querydsl</``groupId``>``    ``<``artifactId``>querydsl-mongodb</``artifactId``>``    ``<``version``>3.6.6</``version``>``</``dependency``>``<``dependency``>``    ``<``groupId``>com.mysema.querydsl</``groupId``>``    ``<``artifactId``>querydsl-apt</``artifactId``>``    ``<``version``>3.6.6</``version``>``</``dependency``>`
```

### **5.2. Q-classes**

QueryDSL used Q-classes for creating queries. But, since we don’t really want to create these by hand, **we need to generate them** somehow.

We’re going to use the apt-maven-plugin to do that:

```
`<``plugin``>    ``    ``<``groupId``>com.mysema.maven</``groupId``>``    ``<``artifactId``>apt-maven-plugin</``artifactId``>``    ``<``version``>1.1.3</``version``>``    ``<``executions``>``        ``<``execution``>``            ``<``goals``>``                ``<``goal``>process</``goal``>``            ``</``goals``>``            ``<``configuration``>``                ``<``outputDirectory``>target/generated-sources/java</``outputDirectory``>``                ``<``processor``>``                  ``org.springframework.data.mongodb.repository.support.MongoAnnotationProcessor``                ``</``processor``>``            ``</``configuration``>``        ``</``execution``>``     ``</``executions``>``</``plugin``>`
```

Let’s look at the *User* class – focusing specifically at the *@QueryEntity* annotation:

```
`@QueryEntity``@Document``public` `class` `User {`` ` `    ``@Id``    ``private` `String id;``    ``private` `String name;``    ``private` `Integer age;`` ` `    ``// standard getters and setters``}`
```

After running the *process* goal of the Maven lifecycle (or anything another goal after that one) – the apt plugin **will generate the new classes** under *target/generated-sources/java/{your package structure}*:

```
`/**`` ``* QUser is a Querydsl query type for User`` ``*/``@Generated``(``"com.mysema.query.codegen.EntitySerializer"``)``public` `class` `QUser ``extends` `EntityPathBase<User> {` `    ``private` `static` `final` `long` `serialVersionUID = ...;` `    ``public` `static` `final` `QUser user = ``new` `QUser(``"user"``);` `    ``public` `final` `NumberPath<Integer> age = createNumber(``"age"``, Integer.``class``);` `    ``public` `final` `StringPath id = createString(``"id"``);` `    ``public` `final` `StringPath name = createString(``"name"``);` `    ``public` `QUser(String variable) {``        ``super``(User.``class``, forVariable(variable));``    ``}` `    ``public` `QUser(Path<? ``extends` `User> path) {``        ``super``(path.getType(), path.getMetadata());``    ``}` `    ``public` `QUser(PathMetadata<?> metadata) {``        ``super``(User.``class``, metadata);``    ``}``}`
```

It’s with the help of this class that we’re not going to be creating our queries.

As a side note – if you’re using Eclipse, introducing this plugin will generate the following warning in pom:

> *You need to run build with JDK or have tools.jar on the classpath. If this occurs during eclipse build make sure you run eclipse under JDK as well (com.mysema.maven:apt-maven-plugin:1.1.3:process:default:generate-sources*

Maven *install* works fine and *QUser* class is generated, but a plugin is highlighted in the pom.

A quick fix is to manually point to the JDK in *eclipse.ini*:

```
`...``-vm``{path_to_jdk}\jdk{your_version}\bin\javaw.exe`
```

### **5.3. The New Repository**

Now we need to actually enable QueryDSL support in our repositories – which is done by simply **extending the QueryDslPredicateExecutor interface**:

```
`public` `interface` `UserRepository ``extends``  ``MongoRepository<User, String>, QuerydslPredicateExecutor<User>`
```

### **5.4. Eq**

With support enabled, **let’s now implement the same queries** as the ones we illustrated before.

We’ll start with simple equality:

```
`QUser qUser = ``new` `QUser(``"user"``);``Predicate predicate = qUser.name.eq(``"Eric"``);``List<User> users = (List<User>) userRepository.findAll(predicate);`
```

### **5.5. StartingWith and EndingWith**

Similarly, let’s implement the previous queries – and find users with names that are starting with *A*:

```
`QUser qUser = ``new` `QUser(``"user"``);``Predicate predicate = qUser.name.startsWith(``"A"``);``List<User> users = (List<User>) userRepository.findAll(predicate);`
```

And ending with *c*:

```
`QUser qUser = ``new` `QUser(``"user"``);``Predicate predicate = qUser.name.endsWith(``"c"``);``List<User> users = (List<User>) userRepository.findAll(predicate);`
```

The result with same as in 2.2, 3.2 or 4.2.

### **5.6. Between**

The next one query will return users with age between 20 and 50 – similar to the previous sections:

```
`QUser qUser = ``new` `QUser(``"user"``);``Predicate predicate = qUser.age.between(``20``, ``50``);``List<User> users = (List<User>) userRepository.findAll(predicate);`
```

## **6. Conclusion**

In this article, we explored the many ways we can query using Spring Data MongoDB.

It’s interesting to take a step back and see just how many powerful ways we have to query MongoDB – varying from limited control all the way to full control with raw queries.

The implementation of all these examples and code snippets **can be found in** [**the GitHub project**](https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb) – this is an Eclipse based project, so it should be easy to import and run as it is.




<https://www.baeldung.com/queries-in-spring-data-mongodb>

Last modified: November 6, 2018



<http://www.technicalkeeda.com/mongodb-tutorial/mongodb-document-count-for-matched-query-using-spring-data>


