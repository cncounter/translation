# MongoDB中对数组元素进行查询

MongoDB中根据数组子元素进行匹配,有两种方式。

1. 使用 "[数组名].[子元素字段名]" 的方式进行匹配。
2. 使用 "[数组名]" $elemMatch { [子元素字段名] }的方式。

不同点在于所匹配的主体不同。

"[数组名].[子元素字段名]" 的方式匹配的主体为 "[数组名]", 适用于单个条件，如果是多个条件, 则变成数组子元素之间的“或”运算。

请看示例:


假设某个集合内有2条数据:

> document1 如下:
```javascript
{ 
    "_id" : "123", 
    "name" : "人文医学", 
    "qList" : [
        {
            "qid" : 1, 
            "content" : "医学伦理学的公正原则",  
            "reorderFlag" : 1
        }, 
        {
            "qid" : 2, 
            "content" : "制定有关人体实验的基本原则", 
            "reorderFlag" : 0
        }
    ]
}
```

> document2 如下：
```javascript
{ 
    "_id" : "124", 
    "name" : "人文医学2", 
    "qList" : [
        {
            "qid" : 1, 
            "content" : "医学伦理学的公正原则",  
            "reorderFlag" : 0
        }, 
        {
            "qid" : 2, 
            "content" : "制定有关人体实验的基本原则", 
            "reorderFlag" : 1
        }
    ]
}
```


### 找出数组中, 具有 qid=1并且reorderFlag=0的记录

查询数组内同一条记录同时满足2个条件的语句:

```javascript
{ "qList": { $elemMatch: { "qid": 1, "reorderFlag": 0} } }
```

查询结果是: 
```
{ 
    "_id" : "124", 
    "name" : "人文医学2", 
    "qList" : [
        {
            "qid" : NumberInt(1), 
            "content" : "医学伦理学的公正原则", 
            "reorderFlag" : NumberInt(0)
        }, 
        {
            "qid" : NumberInt(2), 
            "content" : "制定有关人体实验的基本原则", 
            "reorderFlag" : NumberInt(1)
        }
    ]
}

```

可以看到, 其执行结果是, 对数组内的每一个子元素, 执行 $elemMatch 匹配, 可以进行多个条件的匹配。


### 找出数组中, qid=1 或者 reorderFlag=0的记录

数组整体能满足以下2个条件:

```javascript
{ "qList.qid": 1, "qList.reorderFlag": 0}
```

执行的主体是 `qList`, 要求: 有某些子元素满足 `qid=1`, 也要有某些子元素满足 reorderFlag=0`。


查询结果是: 
```
{ 
    "_id" : "123", 
    "name" : "人文医学", 
    "qList" : [
        {
            "qid" : NumberInt(1), 
            "content" : "医学伦理学的公正原则", 
            "reorderFlag" : NumberInt(1)
        }, 
        {
            "qid" : NumberInt(2), 
            "content" : "制定有关人体实验的基本原则", 
            "reorderFlag" : NumberInt(0)
        }
    ]
}
{ 
    "_id" : "124", 
    "name" : "人文医学2", 
    "qList" : [
        {
            "qid" : NumberInt(1), 
            "content" : "医学伦理学的公正原则", 
            "reorderFlag" : NumberInt(0)
        }, 
        {
            "qid" : NumberInt(2), 
            "content" : "制定有关人体实验的基本原则", 
            "reorderFlag" : NumberInt(1)
        }
    ]
}

```

可以看到, 其执行结果是, 对数组进行匹配, 其中需要有子元素 满足 `"qList.qid": 1`, 还需要有子元素 满足 `"qList.qid": 1`, , 适合进行单个条件的匹配。


如果是单个条件匹配,  则以下方式结果是一样的。

```javascript
{ "qList.qid": 1}
```

或者

```javascript
{ "qList": { $elemMatch: { "qid": 1} } }
```

查询的结果都是2条记录。


日期: 2017年10月23日

作者: [铁锚: http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

