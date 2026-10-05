# The Ultimate Guide to Data Cleaning

# 数据清洗终极指南



> When the data is spewing garbage
>
> 当数据在喷涌垃圾时


![img](https://miro.medium.com/max/1240/1*LUK1pAU235VHhRJmNe6Ymw.png)


I spent the last couple of months analyzing data from sensors, surveys, and logs. No matter how many charts I created, how well sophisticated the algorithms are, the results are always misleading.

Throwing a random forest at the data is the same as injecting it with a virus. A virus that has no intention other than hurting your insights as if your data is spewing garbage.

Even worse, when you show your new findings to the CEO, and Oops guess what? He/she found a flaw, something that doesn’t smell right, your discoveries don’t match their understanding about the domain — After all, they are domain experts who know better than you, you as an analyst or a developer.

Right away, the blood rushed into your face, your hands are shaken, a moment of silence, followed by, probably, an apology.

That’s not bad at all. What if your findings were taken as a guarantee, and your company ended up making a decision based on them?.

You ingested a bunch of dirty data, didn’t clean it up, and you told your company to do something with these results that turn out to be wrong. You’re going to be in a lot of trouble!.

过去几个月, 我一直在分析来自传感器、调查问卷和日志的数据。无论我画了多少图表, 算法多么精巧复杂, 结果总是带有误导性。

把随机森林(random forest)直接套到数据上, 就相当于给数据注入了一种病毒。这种病毒别无他意, 只会破坏你的洞察结论, 就好像你的数据本身就在喷涌垃圾一样。

更糟的是, 当你把新发现展示给 CEO 时, 结果怎样? 他/她发现了一个缺陷, 哪里闻着不对劲, 你的发现和他们对业务领域的理解对不上号 —— 毕竟他们是领域专家, 比你——作为一名分析师或开发者——更懂行。

瞬间, 血液冲上脸颊, 双手发抖, 一阵沉默, 紧接着, 大概就是道歉。

这还不算太糟。可要是你的发现被当成了保证, 而你的公司据此做出了决策呢?

你摄入了一堆脏数据, 没有清洗, 却告诉公司要基于这些结果去做事, 而结果却是错的。那你可就要有大麻烦了!

---

Incorrect or inconsistent data leads to false conclusions. And so, how well you clean and understand the data has a high impact on the quality of the results.

Two real examples were given on [Wikipedia](https://en.wikipedia.org/wiki/Data_cleansing#Motivation).

> For instance, the government may want to analyze population census figures to decide which regions require further spending and investment on infrastructure and services. In this case, it will be important to have access to reliable data to avoid erroneous fiscal decisions.
>
> In the business world, incorrect data can be costly. Many companies use customer information databases that record data like contact information, addresses, and preferences. For instance, if the addresses are inconsistent, the company will suffer the cost of resending mail or even losing customers.

不正确或不一致的数据会导致错误的结论。因此, 你清洗和理解数据的水平, 对结果质量有着重大影响。

[Wikipedia](https://en.wikipedia.org/wiki/Data_cleansing#Motivation) 上给出了两个真实案例。

> 例如, 政府可能想要分析人口普查数据, 以决定哪些地区需要在基础设施和服务上追加支出与投资。在这种情况下, 能够获取可靠数据就很重要, 可以避免错误的财政决策。
>
> 在商业世界里, 错误的数据可能代价高昂。很多公司使用客户信息数据库, 其中记录着联系方式、地址、偏好等数据。例如, 如果地址不一致, 公司就要承担重新寄送邮件的成本, 甚至流失客户。

#### Garbage in, garbage out.

In fact, a simple algorithm can outweigh a complex one just because it was given enough and high-quality data.

#### 垃圾进, 垃圾出。

事实上, 一个简单的算法也能胜过复杂的算法, 仅仅因为它拿到了足够多的高质量数据。

#### Quality data beats fancy algorithms.

For these reasons, it was important to have a step-by-step guideline, a cheat sheet, that walks through the quality checks to be applied.

But first, what’s the thing we are trying to achieve?. What does it mean quality data?. What are the measures of quality data?. Understanding what are you trying to accomplish, your ultimate goal is critical prior to taking any actions.

#### 高质量数据胜过花哨的算法。

正因如此, 才需要一份循序渐进的指南、一份速查表(cheat sheet), 来走查应当执行的质量检查。

但首先, 我们想达成的目标是什么? 什么是高质量数据? 高质量数据的衡量标准又是什么? 在采取任何行动之前, 先弄清楚你究竟想完成什么、你的终极目标是什么, 这一点至关重要。



## Data quality

Frankly speaking, I couldn’t find a better explanation for the quality criteria other than the one on [Wikipedia](https://en.wikipedia.org/wiki/Data_cleansing#Data_quality). So, I am going to summarize it here.

## 数据质量

坦白说, 关于数据质量的评判标准, 我找不到比 [Wikipedia](https://en.wikipedia.org/wiki/Data_cleansing#Data_quality) 上更好的解释了。所以, 我在这里做个总结。

### Validity

The degree to which the data conform to defined business rules or constraints.

- `Data-Type Constraints`: values in a particular column must be of a particular datatype, e.g., boolean, numeric, date, etc.
- `Range Constraints`: typically, numbers or dates should fall within a certain range.
- `Mandatory Constraints`: certain columns cannot be empty.
- `Unique Constraints`: a field, or a combination of fields, must be unique across a dataset.
- `Set-Membership constraints`: values of a column come from a set of discrete values, e.g. enum values. For example, a person’s gender may be male or female.
- `Foreign-key constraints`: as in relational databases, a foreign key column can’t have a value that does not exist in the referenced primary key.
- `Regular expression patterns`: text fields that have to be in a certain pattern. For example, phone numbers may be required to have the pattern `(999) 999–9999`.
- `Cross-field validation`: certain conditions that span across multiple fields must hold. For example, a patient’s date of discharge from the hospital cannot be earlier than the date of admission.

### 有效性(Validity)

数据符合既定业务规则或约束的程度。

- `Data-Type Constraints`(数据类型约束): 某一列中的值必须属于特定的数据类型, 例如布尔型、数值型、日期型等。
- `Range Constraints`(范围约束): 通常, 数字或日期应落在某个范围之内。
- `Mandatory Constraints`(强制约束): 某些列不能为空。
- `Unique Constraints`(唯一性约束): 某个字段或字段组合在数据集中必须唯一。
- `Set-Membership constraints`(集合成员约束): 某列的值取自一组离散值, 例如枚举值。比如, 一个人的性别可能是男或女。
- `Foreign-key constraints`(外键约束): 就像关系数据库中那样, 外键列不能出现被引用主键中不存在的值。
- `Regular expression patterns`(正则表达式模式): 必须符合特定模式的文本字段。例如, 电话号码可能要求匹配 `(999) 999–9999` 这种模式。
- `Cross-field validation`(跨字段校验): 跨越多个字段的某些条件必须成立。例如, 患者的出院日期不能早于入院日期。

### Accuracy

The degree to which the data is close to the true values.

While defining all possible valid values allows invalid values to be easily spotted, it does not mean that they are accurate.

A valid street address mightn’t actually exist. A valid person’s eye colour, say blue, might be valid, but not true (doesn’t represent the reality).

Another thing to note is the difference between accuracy and precision. Saying that you live on the earth is, actually true. But, not precise. Where on the earth?. Saying that you live at a particular street address is more precise.

### 准确性(Accuracy)

数据接近真实值的程度。

虽然定义出所有可能的有效值能让无效值很容易被发现, 但这并不意味着这些值就是准确的。

一个有效的街道地址实际上可能并不存在。一个人眼睛颜色填 “蓝色” 可能是有效的, 但未必属实(并不反映现实)。

另一点需要注意的是准确性和精确性之间的区别。说你住在地球上是真实的, 但不精确。在地球上的哪里? 说你住在某个具体的街道地址则更为精确。

### Completeness

The degree to which all required data is known.

Missing data is going to happen for various reasons. One can mitigate this problem by questioning the original source if possible, say re-interviewing the subject.

Chances are, the subject is either going to give a different answer or will be hard to reach again.

### 完整性(Completeness)

所有必需数据都已掌握的程度。

由于种种原因, 数据缺失在所难免。如果可能的话, 可以通过向原始来源追问来缓解这个问题, 例如重新访谈受访者。

但很可能, 受访者要么给出不同的答案, 要么就再也联系不上了。

### Consistency

The degree to which the data is consistent, within the same data set or across multiple data sets.

Inconsistency occurs when two values in the data set contradict each other.

A valid age, say 10, mightn’t match with the marital status, say divorced. A customer is recorded in two different tables with two different addresses.

Which one is true?.

### 一致性(Consistency)

数据在同一数据集内或跨多个数据集保持一致的程度。

当数据集中的两个值相互矛盾时, 就出现了一致性问题。

一个有效的年龄, 比如 10 岁, 可能与婚姻状况不匹配, 比如 “离异”。同一个客户被记录在两张不同的表里, 对应两个不同的地址。

哪一个才是真的?

### Uniformity

The degree to which the data is specified using the same unit of measure.

The weight may be recorded either in pounds or kilos. The date might follow the USA format or European format. The currency is sometimes in USD and sometimes in YEN.

And so data must be converted to a single measure unit.

### 统一性(Uniformity)

数据使用同一计量单位来表示的程度。

重量既可能用磅记录, 也可能用千克记录。日期可能遵循美式格式, 也可能遵循欧式格式。货币有时是美元, 有时是日元。

因此, 数据必须转换成统一的计量单位。

## The workflow

The workflow is a sequence of three steps aiming at producing high-quality data and taking into account all the criteria we’ve talked about.

1. `Inspection`: Detect unexpected, incorrect, and inconsistent data.
2. `Cleaning`: Fix or remove the anomalies discovered.
3. `Verifying`: After cleaning, the results are inspected to verify correctness.
4. `Reporting`: A report about the changes made and the quality of the currently stored data is recorded.

What you see as a sequential process is, in fact, an iterative, endless process. One can go from verifying to inspection when new flaws are detected.

## 工作流程

这个工作流程由三个步骤组成, 目标是产出高质量数据, 并兼顾我们前面谈到的所有标准。

1. `Inspection`(检查): 发现意外的、错误的和不一致的数据。
2. `Cleaning`(清洗): 修复或移除发现的问题数据。
3. `Verifying`(验证): 清洗之后, 检查结果以确认正确性。
4. `Reporting`(报告): 记录一份关于所做更改以及当前所存数据质量的报告。

你看到的是一条顺序流程, 但实际上它是一个迭代的、没有尽头的过程。一旦检测到新缺陷, 就可以从验证阶段回到检查阶段。

## Inspection

Inspecting the data is time-consuming and requires using many methods for exploring the underlying data for error detection. Here are some of them:

## 检查(Inspection)

检查数据很耗时, 需要使用多种方法来探查底层数据以发现错误。下面是其中一些方法:

### Data profiling

A `summary statistics` about the data, called data profiling, is really helpful to give a general idea about the quality of the data.

For example, check whether a particular column conforms to particular standards or pattern. Is the data column recorded as a string or number?.

How many values are missing?. How many unique values in a column, and their distribution?. Is this data set is linked to or have a relationship with another?.

### 数据剖析(Data profiling)

对数据进行 `summary statistics`(汇总统计), 也就是所谓的数据剖析, 非常有助于对数据质量形成一个总体印象。

例如, 检查某一列是否符合特定的标准或模式。这一列数据记录成的是字符串还是数字?

有多少值缺失? 某一列有多少个唯一值, 它们的分布如何? 这个数据集是否与另一个数据集相关联?

### Visualizations

By analyzing and visualizing the data using statistical methods such as mean, standard deviation, range, or quantiles, one can find values that are unexpected and thus erroneous.

For example, by visualizing the average income across the countries, one might see there are some [`outliers`](https://medium.com/omarelgabrys-blog/statistics-probability-exploratory-data-analysis-714f361b43d1#a7e5) (link has an image). Some countries have people who earn much more than anyone else. Those outliers are worth investigating and are not necessarily incorrect data.

### 可视化(Visualizations)

借助均值、标准差、极差或分位数等统计方法对数据进行分析和可视化, 可以找出那些出乎意料、因而有问题的值。

例如, 将各国的平均收入可视化之后, 你可能会看到一些 [`outliers`(离群值)](https://medium.com/omarelgabrys-blog/statistics-probability-exploratory-data-analysis-714f361b43d1#a7e5)(链接中带图)。有些国家的人收入远高于其他国家的人。这些离群值值得进一步调查, 但它们未必就是错误数据。

### Software packages

Several software packages or libraries available at your language will let you specify constraints and check the data for violation of these constraints.

Moreover, they can not only generate a report of which rules were violated and how many times but also create a graph of which columns are associated with which rules.

### 软件包(Software packages)

你所用语言有不少可用的软件包或库, 可以让你指定约束条件, 并检查数据是否违反了这些约束。

此外, 它们不仅能生成一份报告, 说明哪些规则被违反、各违反了多少次, 还能画出一张图, 展示哪些列与哪些规则相关联。

![img](https://miro.medium.com/max/3432/1*K8R0xzjflmxtDYn7qGf7Pg.png)

![img](https://miro.medium.com/max/2812/1*-iqiWT0R7q1c4g746J2Zew.png)

[source](https://cran.r-project.org/doc/contrib/de_Jonge+van_der_Loo-Introduction_to_data_cleaning_with_R.pdf)

The age, for example, can’t be negative, and so the height. Other rules may involve multiple columns in the same row, or across datasets.

例如, 年龄不能为负数, 身高也是如此。其他规则可能涉及同一行中的多个列, 或者跨越多个数据集。

## Cleaning

Data cleaning involve different techniques based on the problem and the data type. Different methods can be applied with each has its own trade-offs.

Overall, incorrect data is either removed, corrected, or imputed.

## 清洗(Cleaning)

数据清洗会根据问题和数据类型采用不同的技术。可以采用不同方法, 每种方法都有各自的取舍。

总的来说, 错误数据要么被移除, 要么被修正, 要么被填补。

### Irrelevant data

Irrelevant data are those that are not actually needed, and don’t fit under the context of the problem we’re trying to solve.

For example, if we were analyzing data about the general health of the population, the phone number wouldn’t be necessary — `column-wise`.

Similarly, if you were interested in only one particular country, you wouldn’t want to include all other countries. Or, study only those patients who went to the surgery, we wouldn’t include everyone — `row-wise`.

`Only if` you are sure that a piece of data is unimportant, you may drop it. Otherwise, explore the correlation matrix between feature variables.

And even though you noticed no correlation, you should ask someone who is domain expert. You never know, a feature that seems irrelevant, could be very relevant from a domain perspective such as a clinical perspective.

### 无关数据(Irrelevant data)

无关数据是指那些实际上并不需要、也不属于我们试图解决的问题语境的数据。

例如, 如果我们分析的是全体人口的整体健康状况, 那么电话号码就是不必要的 —— 这是从 `列(column-wise)` 的角度。

同样地, 如果你只关心某一个特定的国家, 你就不会想把其他国家都包含进来。或者, 只研究那些去做过手术的患者, 我们就不会把所有人都纳入 —— 这是从 `行(row-wise)` 的角度。

`只有`当你确信某条数据不重要时, 才可以丢弃它。否则, 请探究特征变量之间的相关矩阵。

而且, 即便你没有发现相关性, 也应该去请教领域专家。说不定, 某个看似无关的特征, 从领域角度(比如临床角度)看却是非常相关的。

### Duplicates

Duplicates are data points that are repeated in your dataset.

It often happens when for example

- Data are combined from different sources
- The user may hit submit button twice thinking the form wasn’t actually submitted.
- A request to online booking was submitted twice correcting wrong information that was entered accidentally in the first time.

A common symptom is when two users have the same identity number. Or, the same article was scrapped twice.

And therefore, they simply should be removed.

### 重复数据(Duplicates)

重复数据是指数据集中重复出现的数据点。

它经常发生在如下情况:

- 数据来自不同来源, 被合并到了一起
- 用户以为表单没有真正提交, 于是点了两次提交按钮。
- 在线预订请求提交了两次, 第二次是为了修正第一次不小心填错的信息。

一个常见的征兆是两个用户拥有相同的身份编号。或者, 同一篇文章被抓取了两次。

因此, 这些数据应该被直接移除。

### Type conversion

Make sure numbers are stored as numerical data types. A date should be stored as a date object, or a Unix timestamp (number of seconds), and so on.

Categorical values can be converted into and from numbers if needed.

This is can be spotted quickly by taking a peek over the data types of each column in the summary (we’ve discussed above).

A word of caution is that the values that can’t be converted to the specified type should be converted to NA value (or any), with a warning being displayed. This indicates the value is incorrect and must be fixed.

### 类型转换(Type conversion)

要确保数字以数值类型存储。日期应以日期对象或 Unix 时间戳(秒数)等形式存储。

类别值在需要时可以在数值与类别之间相互转换。

只需看一眼汇总信息中每一列的数据类型(前面已经讨论过), 就能很快发现这类问题。

需要提醒的是, 那些无法转换成指定类型的值应转换成 NA 值(或其他表示缺失的值), 并显示一条警告。这表明该值不正确, 必须修复。

### Syntax errors

`Remove white spaces`: Extra white spaces at the beginning or the end of a string should be removed.

`Remove white spaces`(去除空白): 字符串开头或结尾多余的空格应当被去除。

```
"   hello world  " => "hello world
```

`Pad strings`: Strings can be padded with spaces or other characters to a certain width. For example, some numerical codes are often represented with prepending zeros to ensure they always have the same number of digits.

`Pad strings`(补位): 字符串可以用空格或其他字符填充到某个固定宽度。例如, 一些数字编码常常在前面补零, 以保证它们始终具有相同的位数。

```
313 => 000313 (6 digits)
```

`Fix typos`: Strings can be entered in many different ways, and no wonder, can have mistakes.

`Fix typos`(修正拼写错误): 字符串可能以各种不同的方式输入, 出现错误也就不足为奇了。

```
Gender
m
Male
fem.
FemalE
Femle
```

This categorical variable is considered to have 5 different classes, and not 2 as expected: male and female since each value is different.

这个类别变量会被认为有 5 个不同的类别, 而不是预期的 2 个(男和女), 因为每个值都不一样。

> A [bar plot](https://medium.com/omarelgabrys-blog/statistics-probability-exploratory-data-analysis-714f361b43d1#5f54) is useful to visualize all the unique values. One can notice some values are different but do mean the same thing i.e. “information_technology” and “IT”. Or, perhaps, the difference is just in the capitalization i.e. “other” and “Other”.

> 用[柱状图(bar plot)](https://medium.com/omarelgabrys-blog/statistics-probability-exploratory-data-analysis-714f361b43d1#5f54)来可视化所有唯一值很有用。你能注意到有些值虽然写法不同, 但表达的是同一个意思, 例如 “information_technology” 和 “IT”。又或者, 区别仅仅在于大小写, 例如 “other” 和 “Other”。

Therefore, our duty is to recognize from the above data whether each value is male or female. How can we do that?.

因此, 我们的任务是从上面的数据中辨别每个值究竟是男还是女。该怎么做呢?

The first solution is to manually `map` each value to either “male” or “female”.

第一种方案是手动地把每个值 `map`(映射)到 “male” 或 “female”。

```
dataframe['gender'].map({'m': 'male', fem.': 'female', ...})
```

The second solution is to use `pattern match`. For example, we can look for the occurrence of m or M in the gender at the beginning of the string.

第二种方案是使用 `pattern match`(模式匹配)。例如, 我们可以在字符串开头查找性别中 m 或 M 的出现。

```
re.sub(r"\^m\$", 'Male', 'male', flags=re.IGNORECASE)
```

The third solution is to use `fuzzy matching`: An algorithm that identifies the distance between the expected string(s) and each of the given one. Its basic implementation counts how many operations are needed to turn one string into another.

第三种方案是使用 `fuzzy matching`(模糊匹配): 一种识别期望字符串与各个给定字符串之间距离的算法。它的基本实现会统计把一个字符串转换成另一个字符串需要多少次操作。

```
Gender   male  female
m         3      5
Male      1      3
fem.      5      3
FemalE    3      2
Femle     3      1
```

Furthermore, if you have a variable like a city name, where you suspect typos or similar strings should be treated the same. For example, “lisbon” can be entered as “lisboa”, “lisbona”, “Lisbon”, etc.

此外, 如果你有一个像城市名这样的变量, 你怀疑存在拼写错误, 或是有一些相似的字符串应该被当作同一个来看待。例如, “lisbon” 可能被输入成 “lisboa”、“lisbona”、“Lisbon” 等。

```
City     Distance from "lisbon"
lisbon       0
lisboa       1
Lisbon       1
lisbona      2
london       3
...
```

If so, then we should replace all values that mean the same thing to one unique value. In this case, replace the first 4 strings with “lisbon”.

如果是这样, 我们就应该把所有表达同一个意思的值替换成一个唯一值。在这个例子里, 把前 4 个字符串替换成 “lisbon”。

> Watch out for values like “0”, “Not Applicable”, “NA”, “None”, “Null”, or “INF”, they might mean the same thing: The value is missing.

> 要当心 “0”、“Not Applicable”、“NA”、“None”、“Null” 或 “INF” 这类值, 它们可能表达的是同一个意思: 该值缺失。

### Standardize

Our duty is to not only recognize the typos but also put each value in the same standardized format.

For strings, make sure all values are either in lower or upper case.

For numerical values, make sure all values have a certain measurement unit.

The hight, for example, can be in meters and centimetres. The difference of 1 meter is considered the same as the difference of 1 centimetre. So, the task here is to convert the heights to one single unit.

For dates, the USA version is not the same as the European version. Recording the date as a timestamp (a number of milliseconds) is not the same as recording the date as a date object.

### 标准化(Standardize)

我们的职责不仅是识别拼写错误, 还要把每个值统一成同一种标准格式。

对于字符串, 确保所有值要么全小写, 要么全大写。

对于数值, 确保所有值使用同一种计量单位。

例如, 身高可以用米和厘米表示。1 米的差值与 1 厘米的差值不能等同看待。因此, 这里的任务是把身高统一成单一单位。

对于日期, 美式格式与欧式格式不一样。把日期记录成时间戳(毫秒数)与记录成日期对象也不一样。

### Scaling / Transformation

Scaling means to transform your data so that it fits within a specific scale, such as 0–100 or 0–1.

For example, exam scores of a student can be re-scaled to be percentages (0–100) instead of GPA (0–5).

It can also help in [making certain types of data easier to plot](https://medium.com/omarelgabrys-blog/statistics-probability-exploratory-data-analysis-714f361b43d1#cd13). For example, we might want to reduce skewness to assist in plotting (when having such many outliers). The most commonly used functions are log, square root, and inverse.

Scaling can also take place on data that has different measurement units.

Student scores on different exams say, SAT and ACT, can’t be compared since these two exams are on a different scale. The difference of 1 SAT score is considered the same as the difference of 1 ACT score. In this case, we need [re-scale SAT and ACT scores](https://medium.com/omarelgabrys-blog/statistics-probability-probability-distribution-35818d301cf4#fbef) to take numbers, say, between 0–1.

By scaling, we can plot and compare different scores.

### 缩放 / 变换(Scaling / Transformation)

缩放是指对数据进行变换, 使其落在某个特定的刻度范围内, 比如 0–100 或 0–1。

例如, 学生的考试成绩可以从 GPA(0–5)重新缩放到百分比(0–100)。

它还有助于[让某些类型的数据更容易绘图](https://medium.com/omarelgabrys-blog/statistics-probability-exploratory-data-analysis-714f361b43d1#cd13)。例如, 我们可能想降低偏度以便于绘图(当存在大量离群值时)。最常用的函数是对数、平方根和倒数。

缩放也可以作用在具有不同计量单位的数据上。

学生在不同考试(比如 SAT 和 ACT)中的成绩无法直接比较, 因为这两种考试采用不同的量表。1 分的 SAT 成绩差值与 1 分的 ACT 成绩差值不能等同看待。在这种情况下, 我们需要[重新缩放 SAT 和 ACT 成绩](https://medium.com/omarelgabrys-blog/statistics-probability-probability-distribution-35818d301cf4#fbef), 让数值落在比如 0–1 之间。

通过缩放, 我们就可以绘制并比较不同的成绩。

### Normalization

While normalization also rescales the values into a range of 0–1, the intention here is to transform the data so that it is normally distributed. `Why?`

In most cases, we normalize the data if we’re going to be using statistical methods that rely on normally distributed data. `How?`

One can use the log function, or perhaps, [use one of these methods](https://en.wikipedia.org/wiki/Normalization_(statistics)#Examples).

> Depending on the scaling method used, the shape of the data distribution might change. For example, the “[Standard Z score](https://en.wikipedia.org/wiki/Standard_score)” and “[Student’s t-statistic](https://en.wikipedia.org/wiki/Student's_t-statistic)” (given in the link above) preserve the shape, while the log function mighn’t.

![img](https://miro.medium.com/max/1280/1*zw27rR2u4TgMkbM2mKgnZA.png)

![img](https://miro.medium.com/max/1280/1*GLhdrtwEwMxet6fGcZ0w1w.png)

Normalization vs Scaling (using [Feature scaling](https://en.wikipedia.org/wiki/Feature_scaling)) — [source](https://kharshit.github.io/blog/2018/03/23/scaling-vs-normalization)

### 归一化(Normalization)

归一化同样把数值重新缩放到 0–1 的范围, 但它的目的是把数据变换成服从正态分布的形式。`为什么?`

在大多数情况下, 如果我们要使用依赖正态分布数据的统计方法, 就需要对数据做归一化。`怎么做?`

可以使用对数函数, 或者, [采用这些方法之一](https://en.wikipedia.org/wiki/Normalization_(statistics)#Examples)。

> 取决于所使用的缩放方法, 数据分布的形状可能会改变。例如, “[Standard Z score](https://en.wikipedia.org/wiki/Standard_score)” 和 “[Student’s t-statistic](https://en.wikipedia.org/wiki/Student's_t-statistic)”(见上方链接)会保持分布形状, 而对数函数则可能不会。

归一化 vs 缩放(使用 [Feature scaling](https://en.wikipedia.org/wiki/Feature_scaling)) —— [来源](https://kharshit.github.io/blog/2018/03/23/scaling-vs-normalization)

### Missing values

Given the fact the missing values are unavoidable leaves us with the question of what to do when we encounter them. Ignoring the missing data is the same as digging holes in a boat; It will sink.

There are three, or perhaps more, ways to deal with them.

### 缺失值(Missing values)

缺失值不可避免, 这就引出了一个问题: 遇到缺失值时该怎么办。忽略缺失数据就像在船上凿洞; 船会沉。

有三种, 或者可能更多, 处理方式。

### One. Drop.

If the missing values in a column rarely happen and occur at random, then the easiest and most forward solution is to drop observations (rows) that have missing values.

If most of the column’s values are missing, and occur at random, then a typical decision is to drop the whole column.

This is particularly useful when doing statistical analysis, since filling in the missing values may yield unexpected or biased results.

### 一、删除(Drop)。

如果某一列中的缺失值很少出现, 而且是随机出现的, 那么最简单、最直接的办法就是删除含有缺失值的观测(行)。

如果该列的大部分值都缺失, 而且也是随机出现的, 那么通常的做法是删除整列。

这在做统计分析时尤其有用, 因为填补缺失值可能产生出乎意料的或有偏的结果。

### Two. Impute.

It means to calculate the missing value based on other observations. There are quite a lot of methods to do that.

- `First` one is using `statistical values` like mean, median. However, none of these guarantees unbiased data, especially if there are many missing values.

Mean is most useful when the original data is not [skewed](https://medium.com/omarelgabrys-blog/statistics-probability-exploratory-data-analysis-714f361b43d1#92d4), while the [median is more robust](https://medium.com/omarelgabrys-blog/statistics-probability-exploratory-data-analysis-714f361b43d1#7e7b), not sensitive to outliers, and thus used when data is skewed.

In a normally distributed data, one can get all the values that are within 2 standard deviations from the mean. Next, fill in the missing values by generating random numbers between `(mean — 2 * std) & (mean + 2 * std)`

### 二、填补(Impute)。

指的是根据其他观测值来推算缺失值。做法有很多。

- `第一`, 是使用 `statistical values`(统计值), 比如均值、中位数。然而, 这些方法都不能保证数据无偏, 尤其是在缺失值很多的时候。

当原始数据不[偏斜](https://medium.com/omarelgabrys-blog/statistics-probability-exploratory-data-analysis-714f361b43d1#92d4)时, 均值最有用; 而[中位数更稳健](https://medium.com/omarelgabrys-blog/statistics-probability-exploratory-data-analysis-714f361b43d1#7e7b), 对离群值不敏感, 因此用于数据偏斜的情况。

在服从正态分布的数据中, 可以取出所有落在均值 2 个标准差以内的值。然后, 通过在 `(mean — 2 * std) & (mean + 2 * std)` 之间生成随机数来填补缺失值

```
rand = np.random.randint(average_age - 2*std_age, average_age + 2*std_age, size = count_nan_age)dataframe["age"][np.isnan(dataframe["age"])] = rand
```

- `Second`. Using a `linear regression`. Based on the existing data, one can calculate the best fit line between two variables, say, house price vs. size m².

It is worth mentioning that linear regression models are sensitive to outliers.

- `Third`. `Hot-deck`: Copying values from other similar records. This is only useful if you have enough available data. And, it can be applied to numerical and categorical data.

One can take the random approach where we fill in the missing value with a `random` value. Taking this approach one step further, one can first divide the dataset into `two groups (strata)`, based on some characteristic, say gender, and then fill in the missing values for different genders separately, at random.

In `sequential` hot-deck imputation, the column containing missing values is sorted according to [auxiliary variable(s](https://www.iriseekhout.com/missing-data/auxiliary-variables/)) so that records that have similar auxiliaries occur sequentially. Next, each missing value is filled in with the value of the first following available record.

What is more interesting is that `𝑘 nearest` neighbour imputation, which classifies similar records and put them together, can also be utilized. A missing value is then filled out by finding first the 𝑘 records closest to the record with missing values. Next, a value is chosen from (or computed out of) the 𝑘 nearest neighbours. In the case of computing, statistical methods like mean (as discussed before) can be used.

- `第二`. 使用 `linear regression`(线性回归)。基于现有数据, 可以计算出两个变量之间的最佳拟合直线, 比如房价 vs. 面积(m²)。

值得一提的是, 线性回归模型对离群值很敏感。

- `第三`. `Hot-deck`(热卡填补): 从其他相似的记录中复制值。这只有在你拥有足够可用数据时才有用。而且, 它既适用于数值数据, 也适用于类别数据。

可以采用随机的方式, 用一个 `random`(随机)值来填补缺失值。再进一步, 可以先根据某个特征(比如性别)把数据集分成 `两组(分层 strata)`, 然后分别为不同性别随机填补缺失值。

在 `sequential`(顺序)热卡填补中, 含有缺失值的列会按照[辅助变量](https://www.iriseekhout.com/missing-data/auxiliary-variables/)排序, 使具有相似辅助变量的记录相邻出现。然后, 每个缺失值都用其后第一条可用记录的值来填补。

更有意思的是 `𝑘 nearest`(`k` 近邻)填补, 它对相似记录进行分类并把它们放在一起, 也可以使用。填补某个缺失值时, 先找出与含缺失值记录最近的 𝑘 条记录。然后, 从这 𝑘 个最近邻中选取(或计算出)一个值。在计算的情况下, 可以使用均值之类的统计方法(如前所述)。

### Three. Flag.

Some argue that filling in the missing values leads to a loss in information, no matter what imputation method we used.

That’s because saying that the data is missing is informative in itself, and the algorithm should know about it. Otherwise, we’re just reinforcing the pattern already exist by other features.

This is particularly important when the missing data doesn’t happen at random. Take for example a conducted survey where most people from a specific race refuse to answer a certain question.

Missing `numeric data` can be filled in with say, 0, but has these zeros must be ignored when calculating any statistical value or plotting the distribution.

While `categorical data` can be filled in with say, “Missing”: A new category which tells that this piece of data is missing.

### 三、标记(Flag)。

有人主张, 无论使用哪种填补方法, 填补缺失值都会造成信息丢失。

这是因为 “数据缺失” 这件事本身就含有信息, 算法理应知道这一点。否则, 我们只不过是在强化其他特征已经形成的模式。

当缺失数据不是随机出现时, 这一点尤其重要。举个例子, 在一项开展的调查中, 来自某个特定种族的多数人都拒绝回答某个问题。

缺失的 `numeric data`(数值数据)可以填入比如 0, 但在计算任何统计值或绘制分布时, 必须忽略这些 0。

而 `categorical data`(类别数据)可以填入比如 “Missing”: 一个告诉人们这条数据缺失的新类别。

### Take into consideration …

Missing values are not the same as default values. For instance, zero can be interpreted as either missing or default, but not both.

Missing values are not “unknown”. A conducted research where some people didn’t remember whether they have been bullied or not at the school, should be treated and labelled as unknown and not missing.

Every time we drop or impute values we are losing information. So, flagging might come to the rescue.

### 需要考虑的几点 …

缺失值并不等同于默认值。例如, 零既可以理解为缺失, 也可以理解为默认值, 但不能同时兼作两者。

缺失值也不等于 “未知”。在一项开展的研究中, 有些人记不清自己在学校是否被霸凌过, 这类情况应当被当作并标记为 “未知”, 而不是 “缺失”。

每次我们删除或填补值, 都在丢失信息。因此, 标记或许能救场。

### Outliers

They are values that are significantly different from all other observations. Any data value that [lies more than (1.5 * IQR) away from the Q1 and Q3 quartiles](https://medium.com/omarelgabrys-blog/statistics-probability-exploratory-data-analysis-714f361b43d1#48f7) is considered an outlier.

Outliers are innocent until proven guilty. With that being said, they should not be removed unless there is a good reason for that.

For example, one can notice some weird, suspicious values that are unlikely to happen, and so decides to remove them. Though, they worth investigating before removing.

It is also worth mentioning that some models, like linear regression, are very sensitive to outliers. In other words, outliers might throw the model off from where most of the data lie.

### 离群值(Outliers)

它们是与所有其他观测值显著不同的值。任何[距离 Q1 和 Q3 四分位数超过 (1.5 * IQR)](https://medium.com/omarelgabrys-blog/statistics-probability-exploratory-data-analysis-714f361b43d1#48f7)的数据值都被视为离群值。

离群值在被证明有罪之前是无辜的。话虽如此, 除非有充分理由, 否则不应删除它们。

例如, 有人注意到一些奇怪、可疑、不太可能出现的值, 于是决定把它们删掉。不过, 在删除之前, 它们值得先调查一下。

同样值得一提的是, 某些模型(比如线性回归)对离群值非常敏感。换句话说, 离群值可能会让模型偏离大多数数据所在的区域。

### In-record & cross-datasets errors

These errors result from having two or more values in the same row or across datasets that contradict with each other.

For example, if we have a dataset about the cost of living in cities. The total column must be equivalent to the sum of rent, transport, and food.

```
city       rent  transportation food  total
libson     500        20         40    560
paris      750        40         60    850
```

Similarly, a child can’t be married. An employee’s salary can’t be less than the calculated taxes.

The same idea applies to related data across different datasets.

### 记录内及跨数据集错误(In-record & cross-datasets errors)

这类错误源于同一行中、或跨数据集存在两个或多个相互矛盾的值。

例如, 假设我们有一个关于城市生活成本的数据集。total(总计)列必须等于 rent(租金)、transportation(交通)和 food(食品)之和。

同样地, 一个孩子不可能已婚。员工的工资不可能小于计算出的税额。

同样的道理也适用于不同数据集之间的关联数据。

## Verifying

When done, one should verify correctness by re-inspecting the data and making sure it rules and constraints do hold.

For example, after filling out the missing data, they might violate any of the rules and constraints.

It might involve some manual correction if not possible otherwise.

## 验证(Verifying)

完成之后, 应当通过重新检查数据、确认规则和约束确实成立, 来验证正确性。

例如, 填补缺失数据之后, 它们可能会违反某些规则和约束。

如果别无他法, 可能还需要一些人工修正。

## Reporting

Reporting how healthy the data is, is equally important to cleaning.

As mentioned before, software packages or libraries can generate reports of the changes made, which rules were violated, and how many times.

In addition to logging the violations, the causes of these errors should be considered. Why did they happen in the first place?.

## 报告(Reporting)

报告数据的健康程度, 与清洗本身同样重要。

如前所述, 软件包或库可以生成报告, 说明做了哪些更改、违反了哪些规则以及违反了多少次。

除了记录违规情况之外, 还应考虑这些错误产生的原因。它们当初为什么会发生?

## Final words …

If you made it that far, I am happy you were able to hold until the end. But, None of what mentioned is valuable without embracing the quality culture.

No matter how robust and strong the validation and cleaning process is, one will continue to suffer as new data come in.

It is better to guard yourself against a disease instead of spending the time and effort to remedy it.

These questions help to evaluate and improve the data quality:

> How the data is collected, and under what conditions.

The environment where the data was collected does matter. The environment includes, but not limited to, the location, timing, weather conditions, etc.

Questioning subjects about their opinion regarding whatever while they are on their way to work is not the same as while they are at home. Patients under a study who have difficulties using the tablets to answer a questionnaire might throw off the results.

> What does the data represent?.

Does it include everyone? Only the people in the city?. Or, perhaps, only those who opted to answer because they had a strong opinion about the topic.

> What are the methods used to clean the data and why?.

Different methods can be better in different situations or with different data types.

> Do you invest the time and money in improving the process?.

Investing in people and the process is as critical as investing in the technology.

And finally, … it doesn’t go without saying,

Thank you for reading!

## 结语 …

如果你读到了这里, 我很高兴你能坚持到最后。但是, 如果不拥抱质量文化, 上面提到的这些都没有价值。

无论验证和清洗流程多么健壮、多么强大, 只要新数据不断涌入, 你就还会继续受苦。

与其花时间和精力去治病, 不如提前做好预防。

下面这些问题有助于评估和提升数据质量:

> 数据是如何收集的, 在什么条件下收集的。

数据收集所处的环境确实很重要。环境包括但不限于地点、时间、天气状况等。

在受试者上班路上询问他们对某事的看法, 与在他们在家时询问是不一样的。参与研究的患者如果难以使用平板电脑来回答问卷, 可能会让结果失真。

> 数据代表了什么?

它包含所有人吗? 只包含城市里的人吗? 又或者, 只包含那些因为对该话题有强烈看法而选择作答的人?

> 清洗数据用了哪些方法, 为什么?

不同方法在不同情境下、面对不同数据类型时, 可能各有优劣。

> 你是否投入了时间和金钱来改进流程?

在人和流程上的投入, 与在技术上的投入同样关键。

最后, … 这句话说得并不多余,

感谢阅读!



- [LinkedIn](https://www.linkedin.com/in/omarelgabry/)
- [Medium](https://medium.com/@OmarElGabry).
- 原文链接: <https://towardsdatascience.com/the-ultimate-guide-to-data-cleaning-3969843991d4?gi=6de2d4f9b8b>
