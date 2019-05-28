# Spring Data MongoDB: Projections and Aggregations

# Spring Data MongoDB系列(八): 映射与聚合

## 1. Overview

## 1. 概述

Spring Data MongoDB provides simple high-level abstractions to MongoDB native query language. In this article, we will explore the support for Projections and Aggregation framework.

Spring Data MongoDB 包装了原生查询，封装为上层的简单抽象。 本文将探索框架对映射与聚合的支持。

If you’re new to this topic, refer to our introductory article [Introduction to Spring Data MongoDB](https://www.baeldung.com/spring-data-mongodb-tutorial).

如果你没有相关的基础，请阅读前置文章: [Spring Data MongoDB系列(一): 简介](./05_01_spring-data-mongodb-tutorial.md)。

## 2. Projection

## 2. 映射(Projection)

In MongoDB, Projections are a way to fetch only the required fields of a document from a database. This reduces the amount of data that has to be transferred from database server to client and hence increases performance.

在MongoDB中, 映射可以只从数据库中获取需要的字段. 这减少了从服务器传输到客户端的数据量, 从而提高性能。

With Spring Data MongDB, projections can be used both with `MongoTemplate` and `MongoRepository.`

Spring Data MongDB中, 可以使用 `MongoTemplate` 和 `MongoRepository` 来实现映射。

Before we move further, let’s look at the data model we will be using:

先来看看要使用的数据模型:

```
@Document
public class User {
    @Id
    private String id;
    private String name;
    private Integer age;
     
    // standard getters and setters
}
```

### 2.1. Projections Using MongoTemplate

### 2.1. 用MongoTemplate实现映射功能

The `include()` and `exclude()` methods on the `Field` class is used to include and exclude fields respectively:

`Field` 类的 `include()` 和 `exclude()` 方法用于包括和排除字段:

```
Query query = new Query();
query.fields().include("name").exclude("id");
List<User> john = mongoTemplate.find(query, User.class);
```

These methods can be chained together to include or exclude multiple fields. The field marked as `@Id` (`_id` in the database) is always fetched unless explicitly excluded.

可以使用链式写法, 来包括或排除多个字段。其中使用 `@Id` 标记的字段(对应MongoDB中的`_id`)默认会获取, 除非明确指定需要排除。

Excluded fields are `null` in the model class instance when records are fetched with projection. In the case where fields are of a primitive type or their wrapper class, then the value of excluded fields are default values of the primitive types.

使用映射, 被排除的字段在对应Model中就是 `null`. 如果是原生类型或其包装类, 被排除字段的值则是原生类型的默认值。?

For example, `String` would be `null`, `int`/`Integer` would be `0` and `boolean`/`Boolean` would be `false`.

例如, `String` 类型则填入 `null`, `int`/`Integer` 则填入 `0`,  `boolean`/`Boolean` 则填入 `false`。

Thus in the above example, the `name` field would be `John`, `id` would be `null` and `age` would be `0.`

因此上面示例的返回结果, `name` 字段的值是 `John`, `id` 字段的值是 `null`, `age` 字段的值是 `0`。

### 2.2. Projections Using MongoRepository

### 2.2. 在MongoRepository中使用注解实现映射

While using MongoRepositories, the `fields` of `@Query` annotation can be defined in JSON format:

使用 MongoRepository 时, 可以在 `@Query` 注解中用 JSON 指定需要排除和包含的具体字段:

```
@Query(value="{}", fields="{name : 1, _id : 0}")
List<User> findNameAndExcludeId();
```

The result would be same as using the MongoTemplate. The `value="{}"` denotes no filters and hence all the documents will be fetched.

结果和前面的 MongoTemplate 示例一样。 `value="{}"` 表示不使用过滤器, 因此所有的文档将会被获取。

## 3. Aggregation

## 3. 聚合(Aggregation)

Aggregation in MongoDB was built to process data and return computed results. Data is processed in stages and the output of one stage is provided as input to the next stage. This ability to apply transformations and do computations on data in stages makes aggregation a very powerful tool for analytics.

MongoDB支持聚合查询，方便处理数据并返回计算结果。 数据分成多个阶段处理，一个阶段的输出作为下一阶段的输入。 这种分阶段进行转换和计算的特征、使聚合成为一种强大的分析工具。

Spring Data MongoDB provides an abstraction for native aggregation queries using the three classes `Aggregation` which wraps an aggregation query, `AggregationOperation` which wraps individual pipeline stages and `AggregationResults` which is the container of the result produced by aggregation.

Spring Data MongoDB 对聚合查询进行封装和抽象，提供了3个class， `Aggregation`类包装一个聚合查询, `AggregationOperation`包装单个管道阶段,  `AggregationResults` 则是聚合生成的结果容器。

To perform and aggregation, first, create aggregation pipelines using the static builder methods on `Aggregation` class, then create an instance of `Aggregation` using the `newAggregation()` method on the `Aggregation` class and finally run the aggregation using `MongoTemplate`:

先用 Aggregation 类的静态构建方法来创建聚合管道上, 然后使用 `newAggregation()` 方法生成 `Aggregation` 实例,  最后通过 `MongoTemplate` 执行聚合查询:

```
MatchOperation matchStage = Aggregation.match(new Criteria("foo").is("bar"));
ProjectionOperation projectStage = Aggregation.project("foo", "bar.baz");
         
Aggregation aggregation 
  = Aggregation.newAggregation(matchStage, projectStage);
 
AggregationResults<OutType> output 
  = mongoTemplate.aggregate(aggregation, "foobar", OutType.class);
```

Please note that both `MatchOperation` and `ProjectionOperation` implement `AggregationOperation`. There are similar implementations for other aggregation pipelines. `OutType` is the data model for expected output.

请注意, `MatchOperation` 和 `ProjectionOperation` 类都实现了 `AggregationOperation`。 此外还有其他类似的聚合管道实现. `OutType` 是预期的输出数据模型。

Now, we will look at a few examples and their explanations to cover the major aggregation pipelines and operators.

下面通过示例来介绍常用的聚合管道与操作。

The dataset which we will be using in this article lists details about all the zip codes in the US which can be downloaded from [MongoDB repository](http://media.mongodb.org/zips.json).

在本文中, 我们使用的数据集是美国邮政编码,可以通过 [MongoDB repository](http://media.mongodb.org/zips.json) 下载。

Let’s look at a sample document after importing it into a collection called `zips` in the `test` database.

`test数据库, `zips` 集合中有一条导入的数据。

```
{
    "_id" : "01001",
    "city" : "AGAWAM",
    "loc" : [
        -72.622739,
        42.070206
    ],
    "pop" : 15338,
    "state" : "MA"
}
```

For the sake of simplicity and to make code concise, in the next code snippets, we will assume that all the `static` methods of `Aggregation` class are statically imported.

为了让代码简洁,在下面的代码中, 我们假定 `Aggregation` 类的所有静态方法都被静态导入了。

### 3.1. Get all the States with a Population Greater Than 10 Million Order by Population Descending

### 3.1. 查询人口超过1000万的州, 以人口数量降序排列

Here we will have three pipelines:

在这里我们有三个管道:

1. `$group` stage summing up the population of all zip codes
2. `$match` stage to filter out states with population over 10 million
3. `$sort` stage to sort all the documents in descending order of population

1. `$group` 阶段汇总(summing)所有邮政编码的人口数量
2. `$match` 阶段过滤出人口超过1000万的州(state)
3. `$sort`  阶段按人口数量降序排列

The expected output will have a field `_id` as state and a field `statePop` with the total state population. Let’s create a data model for this and run the aggregation:

预期的输出将会有一个字段 `_id` 表示州的名称, 以及一个 `statePop` 字段表示对应的人口数量。 先创建输出数据模型:

```
public class StatePoulation {
  
    @Id
    private String state;
    private Integer statePop;
  
    // standard getters and setters
}
```

The `@Id` annotation will map the `_id` field from output to `state` in the model:

`@Id` 注解会将 `_id` 字段映射给输出模型的 `state`:

```
GroupOperation groupByStateAndSumPop = Aggregation.group("state")
  .sum("pop").as("statePop");
MatchOperation filterStates = Aggregation.match(new Criteria("statePop").gt(10000000));
SortOperation sortByPopDesc = Aggregation.sort(new Sort(Direction.DESC, "statePop"));
 
Aggregation aggregation = newAggregation(
  groupByStateAndSumPop, filterStates, sortByPopDesc);
AggregationResults<StatePopulation> result = mongoTemplate.aggregate(
  aggregation, "zips", StatePopulation.class);
```

The `AggregationResults` class implements `Iterable` and hence we can iterate over it and print the results.

`AggregationResults` 类实现了 `Iterable`接口, 因此我们可以遍历并打印出结果。

If the output data model is not known, the standard MongoDB class `Document` can be used.

如果输出数据模型是未知的, 则可以使用MongoDB的标准类 `Document`。

### 3.2. Get Smallest State by Average City Population

### 3.2。获取城市平均人口最低的州

For this problem, we will need four stages:

对于这个问题, 我们将需要四个阶段:

1. `$group` to sum the total population of each city
2. `$group` to calculate average population of each state
3. `$sort` stage to order states by their average city population in ascending order
4. `$limit` to get the first state with lowest average city population

1. `$group` 计算出每个城市(city)的总人口
2. `$group` 计算出每个州的城市平均人口
3. `$sort`  阶段以城市平均人口数来升序排序各个州
4. `$limit` 来获取第一条数据,也就是城市平均人口最低的州

Although it’s not necessarily required, we will use an additional `$project` stage to reformat the document as per out `StatePopulation` data model.

虽然不是必需的, 但我们也使用了一个额外的 `$project` 阶段按 `StatePopulation` 模型来重新格式化文档。

```
GroupOperation sumTotalCityPop = Aggregation.group("state", "city")
  .sum("pop").as("cityPop");
GroupOperation averageStatePop = Aggregation.group("_id.state")
  .avg("cityPop").as("avgCityPop");
SortOperation sortByAvgPopAsc = Aggregation.sort(new Sort(Direction.ASC, "avgCityPop"));
LimitOperation limitToOnlyFirstDoc = limit(1);
ProjectionOperation projectToMatchModel = Aggregation.project()
  .andExpression("_id").as("state")
  .andExpression("avgCityPop").as("statePop");
 
Aggregation aggregation = Aggregation.newAggregation(
  sumTotalCityPop, averageStatePop, sortByAvgPopAsc,
  limitToOnlyFirstDoc, projectToMatchModel);
 
AggregationResults<StatePopulation> result = mongoTemplate
  .aggregate(aggregation, "zips", StatePopulation.class);
StatePopulation smallestState = result.getUniqueMappedResult();
```

In this example, we already know that there will be only one document in the result since we limit the number of output documents to 1 in the last stage. As such, we can invoke `getUniqueMappedResult()` to get the required `StatePopulation` instance.

在这个示例中, 我们已经知道结果只会有一条数据, 因为我们将输出文档的数量限制为1. 因此,我们可以调用`getUniqueMappedResult()`来获取对应的  `StatePopulation`对象。

Another thing to notice is that, instead of relying on the `@Id` annotation to map `_id` to state, we have explicitly done it in projection stage.

另外要注意的是, 这个示例中没有使用 `@Id` 注解来映射`_id`, 而是直接在映射阶段就转换了。

### 3.3. Get the State with Maximum and Minimum Zip Codes

### 3.3. 获取邮政编码最多和最少的州

For this example, we need three stages:

对于这个示例, 我们需要三个阶段:

1. `$group` to count the number of zip codes for each state
2. `$sort` to order the states by the number of zip codes
3. `$group` to find the state with max and min zip codes using `$first` and `$last` operators

1. `$group` 来统计每个州的邮政编码数量
2. `$sort`  来根据邮政编码数量排序
3. `$group` 找出邮政编码最多和最少的州, 使用的是 `$first` 和 `$last` 操作符

```
GroupOperation sumZips = Aggregation.group("state").count().as("zipCount");
SortOperation sortByCount = Aggregation.sort(Direction.ASC, "zipCount");
GroupOperation groupFirstAndLast = Aggregation.group().first("_id").as("minZipState")
  .first("zipCount").as("minZipCount").last("_id").as("maxZipState")
  .last("zipCount").as("maxZipCount");
 
Aggregation aggregation = Aggregation.newAggregation(sumZips, sortByCount, groupFirstAndLast);
 
AggregationResults<Document> result = mongoTemplate
  .aggregate(aggregation, "zips", Document.class);
Document document= result.getUniqueMappedResult();
```

Here we have not used any model but used the `Document` already provided with MongoDB driver.

这里没有使用自定义模型， 而是使用了MongoDB驱动中提供的 `Document`。

## 4. Conclusion

## 4. 结论

In this article, we learned how to fetch specified fields of a document in MongoDB using projections in Spring Data MongoDB.

在本文中, 我们学习了Spring Data MongoDB 中,如何使用 projections 来获取文档的指定字段。

We also learned about the MongoDB aggregation framework support in Spring Data. We covered major aggregation phases – group, project, sort, limit, and match and looked at some examples of its practical applications. The complete source code is [available over on GitHub](https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb).

还学习了 MongoDB 和 Spring Data 框架的聚合函数. 通过示例介绍了主要的聚合阶段, group, project, sort, limit, 和 match. 完整的代码请参考: <https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb>。

原文链接: <https://www.baeldung.com/spring-data-mongodb-projections-aggregations>


相关链接:

- [Spring Data MongoDB系列(一): 简介](05_01_spring-data-mongodb-tutorial.md)
- [Spring Data MongoDB系列(二): 简单查询](05_02_queries-in-spring-data-mongodb.md)
- [Spring Data MongoDB系列(八): 映射与聚合](05_08_spring-data-mongodb-projections-aggregations.md)
