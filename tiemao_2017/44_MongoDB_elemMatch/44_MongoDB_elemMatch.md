# MongoDB中对数组元素进行查询

## 查询

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



### 查询数组长度大于1的记录:

```
{ "qList": {$exists : true}, $where: 'this.qList.length>1' }
```

2条结果都匹配。



## MongoDB下载

MongoDB 下载地址:  <https://www.mongodb.com/download-center>

在其中可以选择各种版本，例如企业版(Enterprise Server)


### Windows版MongoDB下载

Windows版下载地址: <https://www.mongodb.org/dl/win32/>

在其中找到最新版的zip文件, 例如 [mongodb-win32-x86_64-v3.4-latest.zip](http://downloads.mongodb.org/win32/mongodb-win32-x86_64-v3.4-latest.zip?_ga=2.63154223.1629277877.1509681508-565722504.1498706182)

下载之后解压即可。

其中2个比较重要的文件:

- `mongo.exe` 客户端程序
- `mongod.exe` 服务器程序

查看帮助 `mongod.exe -h`:

```
D:\mongo\mongodb-win32-x86_64-3.4.10\bin>mongod.exe -h

```

可以看到各种帮助信息， 例如安装Windows服务, 启动服务器等。


```
--dbpath arg		directory for datafiles 
    - defaults to \data\db\ 
    which is D:\data\db\ based on the current working drive
```

如果在CMD执行 mongod.exe 文件, 会提示工作目录不存在, 并且闪退。 所以需要保证data目录存在, 例如 `D:\data\db\` 之类的。

所以最好是手动指定 data 目录。

```
cd D:\mongo\mongodb-win32-x86_64-3.4.10\bin

mongod.exe --dbpath D:\data\db\

```

其他命令请参考官网。


至于MongoDB的GUI客户端, 推荐使用 Studio 3T, 下载页面： <https://studio3t.com/download/>

安装之后， 如果是个人使用，选择非商业授权许可就可以免费使用。

Studio 3T 支持 IntelliShell 控制台,在 Edit --> Preferences 中指定 `mongo.exe` 即可。




日期: 2017年10月23日

作者: [铁锚: http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

