# Spring Data MongoDB: Projections and Aggregations

## 1. Overview

Spring Data MongoDB provides simple high-level abstractions to MongoDB native query language. In this article, we will explore the support for Projections and Aggregation framework.

If you’re new to this topic, refer to our introductory article [Introduction to Spring Data MongoDB](https://www.baeldung.com/spring-data-mongodb-tutorial).

## 2. Projection

In MongoDB, Projections are a way to fetch only the required fields of a document from a database. This reduces the amount of data that has to be transferred from database server to client and hence increases performance.

With Spring Data MongDB, projections can be used both with *MongoTemplate* and *MongoRepository.*

Before we move further, let’s look at the data model we will be using:

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

The *include()* and *exclude()* methods on the *Field* class is used to include and exclude fields respectively:

```
Query query = new Query();
query.fields().include("name").exclude("id");
List<User> john = mongoTemplate.find(query, User.class);
```

These methods can be chained together to include or exclude multiple fields. The field marked as *@Id* (*_id* in the database) is always fetched unless explicitly excluded.

Excluded fields are *null* in the model class instance when records are fetched with projection. In the case where fields are of a primitive type or their wrapper class, then the value of excluded fields are default values of the primitive types.

For example, *String* would be *null*, *int*/*Integer* would be *0* and *boolean*/*Boolean* would be *false*.

Thus in the above example, the *name* field would be *John*, *id* would be *null* and *age* would be *0.*

### 2.2. Projections Using MongoRepository

While using MongoRepositories, the *fields* of *@Query* annotation can be defined in JSON format:

```
@Query(value="{}", fields="{name : 1, _id : 0}")
List<User> findNameAndExcludeId();
```

The result would be same as using the MongoTemplate. The *value=”{}”* denotes no filters and hence all the documents will be fetched.

## 3. Aggregation

Aggregation in MongoDB was built to process data and return computed results. Data is processed in stages and the output of one stage is provided as input to the next stage. This ability to apply transformations and do computations on data in stages makes aggregation a very powerful tool for analytics.

Spring Data MongoDB provides an abstraction for native aggregation queries using the three classes *Aggregation* which wraps an aggregation query, *AggregationOperation* which wraps individual pipeline stages and *AggregationResults* which is the container of the result produced by aggregation.

To perform and aggregation, first, create aggregation pipelines using the static builder methods on *Aggregation* class, then create an instance of *Aggregation*using the *newAggregation()* method on the *Aggregation* class and finally run the aggregation using *MongoTemplate*:

```
MatchOperation matchStage = Aggregation.match(new Criteria("foo").is("bar"));
ProjectionOperation projectStage = Aggregation.project("foo", "bar.baz");
         
Aggregation aggregation 
  = Aggregation.newAggregation(matchStage, projectStage);
 
AggregationResults<OutType> output 
  = mongoTemplate.aggregate(aggregation, "foobar", OutType.class);
```

Please note that both *MatchOperation* and *ProjectionOperation* implement *AggregationOperation*. There are similar implementations for other aggregation pipelines. *OutType* is the data model for expected output.

Now, we will look at a few examples and their explanations to cover the major aggregation pipelines and operators.

The dataset which we will be using in this article lists details about all the zip codes in the US which can be downloaded from [MongoDB repository](http://media.mongodb.org/zips.json).

Let’s look at a sample document after importing it into a collection called *zips* in the *test* database.

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

### 3.1. Get all the States with a Population Greater Than 10 Million Order by Population Descending

Here we will have three pipelines:

1. *$group* stage summing up the population of all zip codes
2. *$match* stage to filter out states with population over 10 million
3. *$sort* stage to sort all the documents in descending order of population

The expected output will have a field *_id* as state and a field *statePop* with the total state population. Let’s create a data model for this and run the aggregation:

```
public class StatePoulation {
  
    @Id
    private String state;
    private Integer statePop;
  
    // standard getters and setters
}
```

The *@Id* annotation will map the *_id* field from output to *state* in the model:

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

If the output data model is not known, the standard MongoDB class *Document* can be used.

### 3.2. Get Smallest State by Average City Population

For this problem, we will need four stages:

1. *$group* to sum the total population of each city
2. *$group* to calculate average population of each state
3. *$sort* stage to order states by their average city population in ascending order
4. *$limit* to get the first state with lowest average city population

Although it’s not necessarily required, we will use an additional *$project* stage to reformat the document as per out *StatePopulation* data model.

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

Another thing to notice is that, instead of relying on the *@Id* annotation to map *_id* to state, we have explicitly done it in projection stage.

### 3.3. Get the State with Maximum and Minimum Zip Codes

For this example, we need three stages:

1. *$group* to count the number of zip codes for each state
2. *$sort* to order the states by the number of zip codes
3. *$group* to find the state with max and min zip codes using *$first* and *$last* operators

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

## 4. Conclusion

In this article, we learned how to fetch specified fields of a document in MongoDB using projections in Spring Data MongoDB.

We also learned about the MongoDB aggregation framework support in Spring Data. We covered major aggregation phases – group, project, sort, limit, and match and looked at some examples of its practical applications. The complete source code is [available over on GitHub](https://github.com/eugenp/tutorials/tree/master/persistence-modules/spring-data-mongodb).


<https://www.baeldung.com/spring-data-mongodb-projections-aggregations>
