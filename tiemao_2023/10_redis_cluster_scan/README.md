# 遍历Redis集群中的所有Key

## 1. 背景

公司有一个外采项目, 数据存储使用 Redis 集群, 数据量在200GB~300GB之间。

## 2. 需求

由于成本上的考虑, 需要清理一部分满足特定条件的数据。

## 3. 实现思路

由于是 Redis 集群, 大致可以分为以下步骤:

- 1. 根据Redis节点信息, 获取此集群中所有的Redis节点。
- 2. 对每个节点, 执行 `scan 100 match *** ` 命令。
- 3. 获取key并执行回调方法/特定业务逻辑。
- 4. 迭代下一个Redis节点。

## 4.  SCAN 简介

`SCAN` 是 redis 支持的一个命令, 可用来:

1. 分页查询当前Redis节点, 对应数据库中的所有Key。
2. 分页查询匹配特定模式的Key。

时间复杂度为 `O(N)`, 主要使用场景是遍历所有Key。

另一个类似的命令是 `keys`, 但是 `keys` 命令存在严重的性能问题, 某些环境下管理员会直接禁掉这个命令。

`SCAN` 命令的语法格式为:

```sh
SCAN cursor [MATCH pattern] [COUNT count] [TYPE type]
```

其中:

- `cursor` 表示游标序号, 默认是 `0`; 每次查询都会返回下一页需要使用的游标序号;
- `MATCH pattern` 是简单的模式匹配, 使用通配符 `*` 表示任意字符;
- `COUNT count` 指定每次查询返回的最大数量, 类似于分页查询的 pageSize, 默认值 `10`;
- `TYPE type` 用来可以过滤具体的数据类型, 满足类型的Key才会返回, 某个Key的具体类型可以使用 [TYPE xxxKey](https://redis.io/commands/type/) 来探测。 一般取值包括: `string`, `list`, `set`, `zset`, `hash` 以及 `stream`。

示例:

```sh
scan 0

scan 0 MATCH cnc:*

scan 0 MATCH *cnc:* COUNT 100

scan 0 MATCH *cnc:* COUNT 100 TYPE zset

```

此外, SCAN 还有一些变种命令, 用来遍历某个主Key下面对应的集合中的Key。

如果是很庞大的集合, 比如几十万个元素, 没有进行拆分的话, 有些时候可以使用这几个变种命令。

- `Sscan` 用来分页遍历 `set` 类型集合中的子元素;
- `Hscan` 用来分页遍历 `hash` 类型集合中的子KEY;
- `Zscan` 用来分页遍历 `zset` 类型集合中的子KEY;

至于list数据类型这不需要专门的分页遍历命令, 因为有 `lindex` 和 `lrange` 可以很方便进行分页了。

示例:

```sh
hscan xxxHashKey 0
```



## 5. 用Jedis来实现Key扫描

由于我们的项目中使用了 Jedis 依赖库, 所以直接以这个库为基础。

jedis的依赖库可以到 [mvnrepository.com](https://mvnrepository.com/artifact/redis.clients/jedis) 网站搜索, 该网站目前启动了防刷校验, 如果展示有问题, 刷新页面即可。 

例如:

```xml
<!-- https://mvnrepository.com/artifact/redis.clients/jedis -->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>4.4.2</version>
</dependency>
```

Jedis提供的方法, 命名和Redis命令很类似, 使用起来很方面。

如果直接对 `JedisCluster` 调用 `scan` 方法, 则会提示报错信息:

```java
Error: Cluster mode only supports SCAN command
  with MATCH pattern containing hash-tag
    ( curly-brackets enclosed string )
```

报错代码和详情可以参考: [Scan a Redis Cluster](https://www.dontpanicblog.co.uk/2022/07/30/scan-a-redis-cluster/)

所以需要使用我们前面提到的思路: 挨个遍历Redis节点并执行扫描。

### 5.1 基础的辅助工具类

我们先创建一个基础的工具类, 用来对相关的逻辑进行简单的组织和封装, 避免代码杂乱。

```java
# 相关依赖附在此处
import com.alibaba.fastjson.JSON;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import redis.clients.jedis.*;

import java.lang.reflect.Field;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

// Redis的Key扫描辅助工具类
public class RedisKeyScanHelper {
    // ...
}
```


### 5.2 批处理停止开关

由于Key扫描是一个耗时较长的批处理任务, 如果需要中途干预或者终止, 有一个控制开关是比较优雅的做法。 否则只能暴力停机重启了。

```java
    // 增加一个开关, 控制是否停止
    public static AtomicBoolean stopFlag = new AtomicBoolean(false);
```

执行扫描遍历的代码, 在每个批次执行之前, 可以判断开关状态, 确定退出或者抛异常。

示例代码:

```java
    if (stopFlag.get()) {
        return; // 退出;
        // 可以考虑抛出业务异常:
        // throw new RuntimeException("收到停止信号");
    }
```

### 5.3 扫描结果回调函数

由于我们封装了工具类, 所以使用回调方法是一种比较方便的设计方式。

好处是将后续的业务处理逻辑剥离出去, 避免代码耦合在一起。

先定义一个 interface 接口。


```java
    // 扫描结果回调函数
    public interface ScanResultCallBack {
        // 根据需要, 也可以定制对应的方法参数;
        public void process(String key, Jedis jedis);
    }
```


由于我们扫描Key时, 想要统计一下各个节点的数据量, 所以回调方法的参数有2个: 

- `String key` 就是扫描到的key;
- `Jedis jedis` 是对应Key所在的Redis节点;

从这个代码可以看到, 扫描到对应的Key才会调用这个回调类。

如果需要在其他时机回调, 比如:

- 扫描到Redis节点
- 连接Redis成功
- 集群信息
- Key遍历
- 扫描到具体Key类型
- 扫描到某种类型的某类值
- 发生某种异常情况时


等等之类的操作, 根据需要定制具体逻辑即可。


### 5.4 实现单个Redis节点的Key扫描

`Jedis` 类封装了 `scan` 命令, 我们直接使用即可。

对应的方法为:

```java
// 在Redis节点内部遍历和扫描
public static void scanRedisNode(Jedis jedis, ScanResultCallBack callBack) {
    // 每次扫描的数量
    final Integer pageSize = 100;
    ScanParams scanParams = new ScanParams()
            //.match("*")
            .count(pageSize);
    // 游标: 直接使用 ScanParams 的常量
    String cursor = ScanParams.SCAN_POINTER_START;
    do {
        if (stopFlag.get()) {
            return; // 退出;
            // 可以考虑抛出业务异常:
            // throw new RuntimeException("收到停止信号");
        }
        // 执行扫描
        ScanResult<String> scanResult = jedis.scan(cursor, scanParams);
        // 获取对应的key-list
        List<String> keys = scanResult.getResult();
        for (String key : keys) {
            // 判空
            if (Objects.isNull(key)) {
                continue;
            }
            if (Objects.isNull(callBack)) {
                continue;
            }
            // 执行回调
            try {
                callBack.process(key, jedis);
            } catch (Exception e) {
                String message = ("执行回调异常: key=: " + key + ";" + e.getMessage());
                System.out.println(message);
                // 根据需要选择是否抛出异常; 或者打印堆栈
                // throw new RuntimeException(message, e);
            }
        }
        //
        // 设置下一次扫描的游标
        cursor = scanResult.getCursor();
        // 只要返回的游标不是起始值0, 就继续执行下一次循环
    } while (!cursor.equals(ScanParams.SCAN_POINTER_START));
}
```

因为我们使用 `static` 来声明了静态方法, 所以通过方法入参的方式传入回调函数。

如果是普通方法, 那就可以采用依赖注入之类的方式设置回调字段。 比如常用的 


### 5.5 实现Redis集群的扫描

Redis集群中, 分为主节点(`master`)和从节点(`slave`), 所以我们需要判断 Redis 节点的角色.

```java
// 判断 Redis 节点的角色
public static String role(Jedis jedis) {
    try {
        // info replication
        String replicationInfo = jedis.info("replication");
        // 其实可以按行解析;
        // 这里简单粗暴直接判断
        if (replicationInfo.contains("role:master")) {
            // 主节点
            return "master";
        }
        if (replicationInfo.contains("role:slave")) {
            // 从节点
            return "slave";
        }
    } catch (Exception ignore) {
    }
    return "";
}
```


`JedisCluster` 是 Jedis 对集群的封装, 构造方法非常多, 开发时可以根据需要选择。

```java
// 扫描 Redis 集群的Key
public static void scanRedisCluster(JedisCluster cluster, ScanResultCallBack callBack) {
    // 获取集群的所有节点
    Map<String, JedisPool> clusterNodes = cluster.getClusterNodes();
    Set<String> keySet = clusterNodes.keySet();
    for (String nodeKey : keySet) {
        JedisPool jedisPool = clusterNodes.get(nodeKey);
        Jedis jedis = jedisPool.getResource();
        System.out.println("scanRedisCluster: 探测到Redis节点: " + hostPort(jedis));
    }
    // 遍历Redis节点
    for (String nodeKey : keySet) {
        if (stopFlag.get()) {
            return; // 退出;
            // 可以考虑抛出业务异常:
            // throw new RuntimeException("收到停止信号");
        }
        JedisPool jedisPool = clusterNodes.get(nodeKey);
        Jedis jedis = jedisPool.getResource();
        // 判断节点角色
        String role = role(jedis);
        if (!"master".equals(role)) {
            System.out.println("scanRedisCluster: 忽略从节点: " + hostPort(jedis) + "; role=" + role);
            continue;
        } else {
            System.out.println("scanRedisCluster: 开始扫描主节点: " + hostPort(jedis) + "; role=" + role);
        }
        // 扫描该节点
        try {
            scanRedisNode(jedis, callBack);
        } catch (Exception e) {
            String message = ("扫描节点异常: jedis=: " + jedis + ";" + e.getMessage());
            System.out.println(message);
            // 根据需要选择是否抛出异常; 或者打印堆栈
            // throw new RuntimeException(message, e);
        }
    }
}
```

实现逻辑也不复杂,  `System.out.println` 部分的代码可以根据项目, 决定是否使用 `logger` 输出。

一般来说, 作为批处理, 需要兼容处理掉各种意外情况, 同时也应当保留一定的通知能力, 将异常情况告知外部。


### 5.6 创建JedisCluster的示例代码 

`JedisCluster` 是 Jedis 对集群的封装, 构造方法非常多, 开发时可以根据具体情况选择。

这里给出创建JedisCluster的2段示例代码。

```java

// 创建Jedis集群
public static JedisCluster createJedisCluster(RedisProperties properties) {
    Set<HostAndPort> jedisClusterNode = new HashSet<>();
    //
    String clientName = properties.getClientName();
    String password = properties.getPassword();
    //
    RedisProperties.Cluster clusterProperties = properties.getCluster();
    List<String> nodeStrList = clusterProperties.getNodes();
    //
    // System.out.println("createJedisCluster: nodeStrList=" + JSON.toJSON(nodeStrList));
    //
    for (String str : nodeStrList) {
        if (StringUtils.isEmpty(str)) {
            continue;
        }
        String host = str;
        int port = 6379;
        if (str.contains(":")) {
            String[] arrays = str.split(":");
            host = arrays[0];
            port = Integer.parseInt(arrays[1]);
        }
        // 其实只要有1个可连接的节点就行;
        HostAndPort hostAndPort = new HostAndPort(host, port);
        jedisClusterNode.add(hostAndPort);
    }
    return createJedisCluster(jedisClusterNode, password, clientName);
}

// 创建Jedis集群
public static JedisCluster createJedisCluster(Set<HostAndPort> nodes, String password, String clientName) {
    //
    int DEFAULT_MAX_ATTEMPTS = 5;
    int DEFAULT_TIMEOUT = 2000;
    //
    int connectionTimeout = DEFAULT_TIMEOUT;
    int soTimeout = DEFAULT_TIMEOUT;
    int maxAttempts = DEFAULT_MAX_ATTEMPTS;
    GenericObjectPoolConfig poolConfig = new GenericObjectPoolConfig();

    JedisCluster jedisCluster = new JedisCluster(nodes, connectionTimeout,
            soTimeout, maxAttempts, password, clientName, poolConfig);
    return jedisCluster;

    // public JedisCluster(Set<HostAndPort> jedisClusterNode, int connectionTimeout, int soTimeout,
    //      int maxAttempts, String password, String clientName, final GenericObjectPoolConfig poolConfig) {
    //    super(jedisClusterNode, connectionTimeout, soTimeout, maxAttempts, password, clientName, poolConfig);
    // }
}
```

逻辑并不复杂, 关键是使用哪个构造方法。

具体开发时, 根据已有的参数和Redis集群情况, 根据入参选择对应的构造函数即可。


### 5.7 解析Jedis对应的IP和端口号

因为业务逻辑需要, 创建一个解析方法:

```java
// 反射获取Redis节点的IP和端口号
public static HostAndPort hostPort(Jedis jedis) {
    if (Objects.isNull(jedis)) {
        return null;
    }
    // 获取private 属性时, 需要使用直接定义该字段的类;
    // 当然, 也可以遍历迭代所有超类和接口来查找。
    Class<BinaryJedis> clazzJedis = BinaryJedis.class;
    Class<Connection> clazzClient = Connection.class;

    try {
        // 获取字段
        Field clientField = clazzJedis.getDeclaredField("client");
        Field jedisSocketFactoryField = clazzClient.getDeclaredField("jedisSocketFactory");
        // 不同版本Jedis字段名称有所变化; 如果反射报错, 可以查看 Connection 类里面的字段是什么; 
        //Field jedisSocketFactoryField = clazzClient.getDeclaredField("socketFactory");
        // 临时设置这个字段包装允许访问/读取
        clientField.setAccessible(true);
        jedisSocketFactoryField.setAccessible(true);
        // 反射获取对应的属性
        Client client = (Client) clientField.get(jedis);
        JedisSocketFactory jedisSocketFactory = 
            (JedisSocketFactory) jedisSocketFactoryField.get(client);
        // 拼装 HostAndPort
        String host = jedisSocketFactory.getHost();
        int port = jedisSocketFactory.getPort();
        HostAndPort hostAndPort = new HostAndPort(host, port);
        // HostAndPort 实现了 toString() 方法, 使用很方便.
        return hostAndPort;
    } catch (Exception e) {
        String message = ("解析Jedis的HostAndPort出错; errorMsg: " + e.getMessage());
        System.out.println(message);
        return null;
    }
}
```

需要其他属性, 也可以采用类似的方法来获取。


### 5.8 扫描结果回调示例


这里提供一个简单的回调示例, 具体代码可根据需求进行改写。

```java

// 扫描结果回调逻辑实现
public static class ScanResultCallBackImpl implements ScanResultCallBack {
    // 缓存Jedis与IP端口的映射关系
    private Map<Jedis, String> hostMap = new HashMap<>();
    // IP端口与Key数量的简单统计
    private Map<String, AtomicLong> countMap = new HashMap<>();

    // 解析Jedis的IP端口并缓存
    private String parseHostPort(Jedis jedis) {
        if (hostMap.containsKey(jedis)) {
            return hostMap.get(jedis);
        }
        HostAndPort hostAndPort = RedisKeyScanHelper.hostPort(jedis);
        if (Objects.nonNull(hostAndPort)) {
            hostMap.put(jedis, hostAndPort.toString());
            return hostMap.get(jedis);
        }
        return "UNKNOWN";
    }

    // 自增统计
    private long incrementCount(String hostAndPort) {
        AtomicLong counter = countMap.getOrDefault(hostAndPort, new AtomicLong());
        long curCount = counter.incrementAndGet();
        countMap.put(hostAndPort, counter);
        return curCount;
    }

    // 回调入口
    @Override
    public void process(String key, Jedis jedis) {
        String hostAndPort = parseHostPort(jedis);
        // System.out.println("扫描到Key:" + key + "; 所在节点:" + hostAndPort);
        // 计数
        long curCount = incrementCount(hostAndPort);
        // 采样
        if (curCount % 10000L == 1L) {
            String type = jedis.type(key);
            // 一般取值包括: `string`, `list`, `set`, `zset`, `hash` 以及 `stream`
            if ("string".equals(type)) {
                String value = jedis.get(key);
                System.out.println("==回调采样" + curCount + "; 扫描到Key=" + key +
                        "; value=" + value + "; 所在节点: " + hostAndPort);
            } else {
                System.out.println("==回调采样" + curCount + "; 扫描到Key:" + key +
                        "; type=" + type + "; 所在节点: " + hostAndPort);
            }
        }
        // 判断Key满足某种标准;
        if (key.startsWith("cnc:")) {
            // doSomething
            // 比如满足某种特征的Key,
            // 或者满足某种特征的VALUE, 执行某些操作
        }
    }

    // 这里通过 toString() 暴露一些信息
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("ClusterHostList: " + JSON.toJSON(hostMap.values())).append("\n");
        builder.append("countMap: " + JSON.toJSON(countMap)).append("\n");
        return builder.toString();
    }
}
```

如果不想实现其他方法, 重写 `toString()` 是一个简单的方法。


### 5.9 测试代码

我们写一个简单的 main 方法来测试:

```java


public static void main(String[] args) {
    // 只需要传入1个节点的IP和端口即可
    Set<HostAndPort> jedisClusterNode = new HashSet<>();
    jedisClusterNode.add(new HostAndPort("cluster-1.cnc.com", 7000));
    // 密码信息, 没有传 null
    String password = "Your_Password";
    String clientName = "RedisKeyScanner";
    // 创建Jedis集群
    JedisCluster jedisCluster = createJedisCluster(jedisClusterNode, password, clientName);
    // 回调
    ScanResultCallBack callBack = new ScanResultCallBackImpl();
    // 开始扫描
    scanRedisCluster(jedisCluster, callBack);
    // 汇总结果信息
    System.out.println("结果汇总:" + callBack.toString());
}

```

测试时需要先准备好 Redis 集群, 根据集群信息配置即可。


## 6. Lettuce 实现代码

> TODO 准备研究 Lettuce, 如果读者有参考实现, 欢迎交流探讨。

- [Introduction to Lettuce – the Java Redis Client](https://www.baeldung.com/java-redis-lettuce)


## 7. 简单总结

遍历Redis集群中所有Key的步骤并不复杂:

1. 连接Redis集群
2. 查询所有节点
3. 判断节点角色
4. 扫描Redis节点的所有Key
5. 回调和统计


## 8. Key数量与Redis内存的关系

Key与内存使用量的关系:

清理完成后, 存活Key的数量为 `3.9亿``, Redis主节点的内存占用量为: `70G`。


Key的长度平均为 `18字符`, Value的长度大约为 `40~50个字符`。

换算下来, `1千万`个Key和对应的VALUE, 只占用了 `2GB` 的Redis内存。


## 参考链接

- Redis官方文档: [SCAN命令](https://redis.io/commands/scan/)
- [Scan a Redis Cluster](https://www.dontpanicblog.co.uk/2022/07/30/scan-a-redis-cluster/)
- [List All Available Redis Keys](https://www.baeldung.com/redis-list-available-keys)
- [铁锚的CSDN博客](https://renfufei.blog.csdn.net/)

作者: [铁锚](https://github.com/cncounter/translation/)
日期: 2023年06月14日

