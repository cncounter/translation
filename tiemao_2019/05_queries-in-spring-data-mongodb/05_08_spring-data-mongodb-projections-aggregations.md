# Spring Data MongoDB: Projections and Aggregations

# Spring Data MongoDB系列(二): 映射与聚合

## 1. Overview

## 1. 概述

Spring Data MongoDB provides simple high-level abstractions to MongoDB native query language. In this article, we will explore the support for Projections and Aggregation framework.

春天数据MongoDB提供简单的高层抽象MongoDB原生查询语言。在本文中,我们将探索支持预测和聚合框架。

If you’re new to this topic, refer to our introductory article [Introduction to Spring Data MongoDB](https://www.baeldung.com/spring-data-mongodb-tutorial).

如果你刚开始这个话题,请参考我们的介绍性文章(弹簧数据MongoDB概论)(https://www.baeldung.com/spring-data-mongodb-tutorial)。

## 2. Projection

## 2. 投影

In MongoDB, Projections are a way to fetch only the required fields of a document from a database. This reduces the amount of data that has to be transferred from database server to client and hence increases performance.

在MongoDB中,预测方法只能获取所需的字段从数据库文档.这减少了的数据量必须从数据库服务器转移到客户端,从而提高性能。

With Spring Data MongDB, projections can be used both with *MongoTemplate* and *MongoRepository.*

MongDB弹簧数据,预测可以使用* MongoTemplate *和* MongoRepository。*

Before we move further, let’s look at the data model we will be using:

在我们进一步之前,让我们看看我们将使用的数据模型:

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

### 2.1。预测使用MongoTemplate

The *include()* and *exclude()* methods on the *Field* class is used to include and exclude fields respectively:

*包括()*和*排除()* *字段*类上的方法分别用于包括和排除的字段:

```
Query query = new Query();
query.fields().include("name").exclude("id");
List<User> john = mongoTemplate.find(query, User.class);
```

These methods can be chained together to include or exclude multiple fields. The field marked as *@Id* (*_id* in the database) is always fetched unless explicitly excluded.

这些方法可以链接在一起,包括或排除多个字段。字段标记为* @ id * (* _id *数据库中)总是获取,除非明确排除在外。

Excluded fields are *null* in the model class instance when records are fetched with projection. In the case where fields are of a primitive type or their wrapper class, then the value of excluded fields are default values of the primitive types.

排除字段*空*模型中的类实例当记录被拿来与投影.如果字段是原始类型或其包装类,然后排除字段的值是原始类型的默认值。

For example, *String* would be *null*, *int*/*Integer* would be *0* and *boolean*/*Boolean* would be *false*.

例如,* *会* null字符串*,* int * / *整数* * 0 *和*布尔* / *布尔* *假*。

Thus in the above example, the *name* field would be *John*, *id* would be *null* and *age* would be *0.*

因此在上面的例子中,约翰·* *姓名*字段将* * id * *空*和* *会* 0。*岁

### 2.2. Projections Using MongoRepository

### 2.2。预测使用MongoRepository

While using MongoRepositories, the *fields* of *@Query* annotation can be defined in JSON format:

虽然使用MongoRepositories *字段* * @Query * JSON格式的注释可以定义:

```
@Query(value="{}", fields="{name : 1, _id : 0}")
List<User> findNameAndExcludeId();
```

The result would be same as using the MongoTemplate. The *value=”{}”* denotes no filters and hence all the documents will be fetched.

其结果将是使用MongoTemplate一样。= "{}" * *值表示没有过滤器,因此所有的文件将被获取。

## 3. Aggregation

## 3.聚合

Aggregation in MongoDB was built to process data and return computed results. Data is processed in stages and the output of one stage is provided as input to the next stage. This ability to apply transformations and do computations on data in stages makes aggregation a very powerful tool for analytics.

.这种能力应用转换和数据做计算阶段使聚合分析的一个非常强大的工具。

Spring Data MongoDB provides an abstraction for native aggregation queries using the three classes *Aggregation* which wraps an aggregation query, *AggregationOperation* which wraps individual pipeline stages and *AggregationResults* which is the container of the result produced by aggregation.

春天MongoDB为本地提供了一个抽象数据聚合查询使用的三个类*聚合*包装一个聚合查询,* AggregationOperation *包装个人管道阶段和* AggregationResults *聚合产生的结果的容器。

To perform and aggregation, first, create aggregation pipelines using the static builder methods on *Aggregation* class, then create an instance of *Aggregation*using the *newAggregation()* method on the *Aggregation* class and finally run the aggregation using *MongoTemplate*:

执行和聚合,首先,创建聚合管道上使用静态构造器方法*聚合*类,然后创建一个实例,* *使用* newAggregation聚合()* *聚合*类上的方法,最后运行聚合使用* MongoTemplate *:

```
MatchOperation matchStage = Aggregation.match(new Criteria("foo").is("bar"));
ProjectionOperation projectStage = Aggregation.project("foo", "bar.baz");
         
Aggregation aggregation 
  = Aggregation.newAggregation(matchStage, projectStage);
 
AggregationResults<OutType> output 
  = mongoTemplate.aggregate(aggregation, "foobar", OutType.class);
```

Please note that both *MatchOperation* and *ProjectionOperation* implement *AggregationOperation*. There are similar implementations for other aggregation pipelines. *OutType* is the data model for expected output.

请注意,* MatchOperation *和* ProjectionOperation * * AggregationOperation *实现。还有其他类似的实现聚合管道.* OutType *是预期的输出数据模型。

Now, we will look at a few examples and their explanations to cover the major aggregation pipelines and operators.

现在,我们将看看一些例子和解释的主要聚合管道和运营商。

The dataset which we will be using in this article lists details about all the zip codes in the US which can be downloaded from [MongoDB repository](http://media.mongodb.org/zips.json).

在本文中,我们将使用的数据集列表的详细信息我们所有的邮政编码,可以下载MongoDB库(http://media.mongodb.org/zips.json)。

Let’s look at a sample document after importing it into a collection called *zips* in the *test* database.

让我们看一个示例文档导入到一个集合后叫*拉链* *测试*数据库中。

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

For the sake of simplicity and to make code concise, in the next code snippets, we will assume that all the *static* methods of *Aggregation* class are statically imported.

为了简单起见,让代码简洁,在下一个代码片段,我们假定所有的*静态* *聚合*类的方法是静态导入。

### 3.1. Get all the States with a Population Greater Than 10 Million Order by Population Descending

### 3.1。得到所有美国人口超过1000万,人口下降

Here we will have three pipelines:

在这里我们将有三个管道:

1. *$group* stage summing up the population of all zip codes
2. *$match* stage to filter out states with population over 10 million
3. *$sort* stage to sort all the documents in descending order of population

1. *美元集团*阶段总结人口的邮政编码
2. * * $匹配阶段过滤州人口超过1000万
3. * $ *排序阶段人口的降序排序的所有文档

The expected output will have a field *_id* as state and a field *statePop* with the total state population. Let’s create a data model for this and run the aggregation:

预期的输出将会有一个字段* _id *状态和字段* statePop *国家总人口。让我们创建一个数据模型并运行聚合:

```
public class StatePoulation {
  
    @Id
    private String state;
    private Integer statePop;
  
    // standard getters and setters
}
```

The *@Id* annotation will map the *_id* field from output to *state* in the model:

* * @ id注释将从输出到* * _id *字段映射到模型中的状态*:

```
GroupOperation groupByStateAndSumPop = group("state")
  .sum("pop").as("statePop");
MatchOperation filterStates = match(new Criteria("statePop").gt(10000000));
SortOperation sortByPopDesc = sort(new Sort(Direction.DESC, "statePop"));
 
Aggregation aggregation = newAggregation(
  groupByStateAndSumPop, filterStates, sortByPopDesc);
AggregationResults<StatePopulation> result = mongoTemplate.aggregate(
  aggregation, "zips", StatePopulation.class);
```

The *AggregationResults* class implements *Iterable* and hence we can iterate over it and print the results.

* AggregationResults *类实现* Iterable *,因此我们可以遍历并打印结果。

If the output data model is not known, the standard MongoDB class *Document* can be used.

如果输出数据模型是未知的,标准可以使用MongoDB文档类* *。

### 3.2. Get Smallest State by Average City Population

### 3.2。被城市人口平均最小的国家

For this problem, we will need four stages:

对于这个问题,我们将需要四个阶段:

1. *$group* to sum the total population of each city
2. *$group* to calculate average population of each state
3. *$sort* stage to order states by their average city population in ascending order
4. *$limit* to get the first state with lowest average city population

1. * $组*和每个城市的总人口
2. *美元集团*计算平均每个州的人口
3. * *排序阶段美元订单状态的平均城市人口以升序排序
4. * *限制美元获得第一个状态与最低平均城市人口

Although it’s not necessarily required, we will use an additional *$project* stage to reformat the document as per out *StatePopulation* data model.

虽然不是必需的,我们将使用一个额外的美元* *项目阶段重新格式化文档按* StatePopulation *数据模型。

```
GroupOperation sumTotalCityPop = group("state", "city")
  .sum("pop").as("cityPop");
GroupOperation averageStatePop = group("_id.state")
  .avg("cityPop").as("avgCityPop");
SortOperation sortByAvgPopAsc = sort(new Sort(Direction.ASC, "avgCityPop"));
LimitOperation limitToOnlyFirstDoc = limit(1);
ProjectionOperation projectToMatchModel = project()
  .andExpression("_id").as("state")
  .andExpression("avgCityPop").as("statePop");
 
Aggregation aggregation = newAggregation(
  sumTotalCityPop, averageStatePop, sortByAvgPopAsc,
  limitToOnlyFirstDoc, projectToMatchModel);
 
AggregationResults<StatePopulation> result = mongoTemplate
  .aggregate(aggregation, "zips", StatePopulation.class);
StatePopulation smallestState = result.getUniqueMappedResult();
```

In this example, we already know that there will be only one document in the result since we limit the number of output documents to 1 in the last stage. As such, we can invoke *getUniqueMappedResult()* to get the required *StatePopulation* instance.

在这个例子中,我们已经知道会有结果,因为我们只有一个文档限制输出文档的数量为1的最后阶段.因此,我们可以调用* getUniqueMappedResult() *得到所需* StatePopulation *实例。

Another thing to notice is that, instead of relying on the *@Id* annotation to map *_id* to state, we have explicitly done it in projection stage.

另一件要注意的是,而不是依靠* * @ id注释映射* _id *,我们明确地做了它在舞台投影。

### 3.3. Get the State with Maximum and Minimum Zip Codes

### 3.3。最大和最小的国家邮政编码

For this example, we need three stages:

对于这个示例,我们需要三个阶段:

1. *$group* to count the number of zip codes for each state
2. *$sort* to order the states by the number of zip codes
3. *$group* to find the state with max and min zip codes using *$first* and *$last* operators

1. * $组*数一数每个州的邮政编码
2. * $排序*美国邮政编码的数量
3. *美元集团*找到最大和最小的国家邮政编码使用*第一* *去年美元*操作符

```
GroupOperation sumZips = group("state").count().as("zipCount");
SortOperation sortByCount = sort(Direction.ASC, "zipCount");
GroupOperation groupFirstAndLast = group().first("_id").as("minZipState")
  .first("zipCount").as("minZipCount").last("_id").as("maxZipState")
  .last("zipCount").as("maxZipCount");
 
Aggregation aggregation = newAggregation(sumZips, sortByCount, groupFirstAndLast);
 
AggregationResults<Document> result = mongoTemplate
  .aggregate(aggregation, "zips", Document.class);
Document document= result.getUniqueMappedResult();
```

Here we have not used any model but used the *Document* already provided with MongoDB driver.

我们没有使用任何模型但使用MongoDB提供的*记录*已经司机。

## 4. Conclusion

## 4. 结论

In this article, we learned how to fetch specified fields of a document in MongoDB using projections in Spring Data MongoDB.

在本文中,我们了解了如何获取指定字段的文档在MongoDB使用MongoDB在春天预测数据。

We also learned about the MongoDB aggregation framework support in Spring Data. We covered major aggregation phases – group, project, sort, limit, and match and looked at some examples of its practical applications. The complete source code is [available over on GitHub](https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb).

我们也了解了MongoDB支持在春天数据聚合框架.我们覆盖了主要的聚合阶段,集团项目,限制,和匹配,看着一些实际应用的例子.完整的源代码可以在GitHub (https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb)。

<https://www.baeldung.com/spring-data-mongodb-projections-aggregations>
