




# Lightning fast NoSQL with Spring Data Redis

# 轻量级 NoSQL 解决方案: Spring Data Redis


## 6 uses cases for Redis in server-side Java applications

## 在服务器端 Java 应用程序中使用 Redis 的 6 种场景


A multi-tiered architecture built on top of Java EE presents a powerful server-side programming solution. As a Java EE developer for many years, I've been mostly satisfied with a three-tiered approach for enterprise development: a JPA/Hibernate persistence layer at the bottom, a Spring or EJB application layer in the middle, and a web tier on top. For more complex use cases I've integrated a workflow-driven solution with BPM (business process management), a rules engine like [Drools](http://www.ibm.com/developerworks/library/j-drools5/), and an integration framework such as [Camel](http://www.javaworld.com/article/2078883/open-source-tools/java-tip-write-an-soa-integration-layer-with-apache-camel.html).

建立在 Java EE 之上的多层架构提供了一套强大的服务器端编程方案。作为一名多年的 Java EE 开发者,我对企业开发中采用三层架构总体上很满意:底层是 JPA/Hibernate 持久化层,中间是 Spring 或 EJB 应用层,顶层是 Web 层。对于更复杂的用例,我还集成过工作流驱动的 BPM(业务流程管理)方案、像 [Drools](http://www.ibm.com/developerworks/library/j-drools5/) 这样的规则引擎,以及像 [Camel](http://www.javaworld.com/article/2078883/open-source-tools/java-tip-write-an-soa-integration-layer-with-apache-camel.html) 这样的集成框架。


Recently, however, I was tasked to design a system supporting hundreds of thousands of concurrent users, with sub-second response latency. I immediately saw the limits of my normal Java EE stack. Conventional RDBMS-based web applications, including those built on Hibernate/JPA, have second-order latency and do not scale well. A traditional Java EE persistence architecture would not meet the performance and throughput requirements for the system I was designing. I turned to NoSQL, and eventually found [Redis](http://redis.io/).

然而最近,我接到一个任务,要设计一个支持数十万并发用户、响应延迟低于一秒的系统。我立刻意识到自己惯用的 Java EE 技术栈的局限。传统的基于 RDBMS 的 Web 应用(包括构建在 Hibernate/JPA 之上的那些)存在次级延迟,且伸缩性不佳。传统的 Java EE 持久化架构无法满足我正在设计的系统对性能和吞吐量的要求。于是我转向 NoSQL,最终找到了 [Redis](http://redis.io/)。


Being an in-memory key-value datastore, Redis breaks from the conventional definition of a database, where data is saved on a hard drive. Instead, it can be used in combination with a persistent NoSQL datastore such as MongoDB, HBase, Cassandra, or DynamoDB. Redis excels as a remote cache server, and is an exceptionally fast datastore for volatile data.

作为一种内存键值数据存储,Redis 打破了数据库的传统定义——在传统定义里,数据保存在硬盘上。相反,它可以与 MongoDB、HBase、Cassandra 或 DynamoDB 之类的持久化 NoSQL 数据存储配合使用。Redis 作为远程缓存服务器表现出色,也是存储易失性数据的极快数据存储。


In this article I introduce simple and advanced use cases and performance tuning with Redis. I'll provide a brief overview, but I assume you are basically familiar with NoSQL and the [variety of solutions](http://www.javaworld.com/article/3030214/big-data/open-source-java-projects-apache-phoenix.html) available in that field.

在本文中,我将介绍 Redis 的简单与高级用例以及性能调优。我会给出简要概述,但假定你已经基本熟悉 NoSQL 以及该领域[各种各样的解决方案](http://www.javaworld.com/article/3030214/big-data/open-source-java-projects-apache-phoenix.html)。


 




### Spring Data Redis


Redis has client libraries for almost every programming language, including Java. [Jedis](https://github.com/xetorthio/jedis) is perhaps the most popular Java client library. Examples in this article are based on [Spring Data Redis](http://docs.spring.io/spring-data/redis/docs/current/reference/html/), which I've used as a higher level wrapper API. Spring Data Redis offers easy configuration, friendly APIs, and useful add-ons.

Redis 几乎为每种编程语言都提供了客户端库,包括 Java。[Jedis](https://github.com/xetorthio/jedis) 也许是最流行的 Java 客户端库。本文中的示例基于 [Spring Data Redis](http://docs.spring.io/spring-data/redis/docs/current/reference/html/),我把它当作更高层次的封装 API 来使用。Spring Data Redis 提供了简便的配置、友好的 API 和实用的附加组件。


## Overview of Redis

## Redis 概述


Like most NoSQL data stores, Redis abandons the relational concepts of tables, rows, and columns. Instead, it is a key-value data store, where each record is stored and retrieved using a unique string key. Redis supports the following built-in data structures as the value of all records:

像大多数 NoSQL 数据存储一样,Redis 抛弃了表、行、列这些关系型概念。相反,它是一个键值数据存储,每条记录都使用唯一的字符串键来存储和检索。Redis 支持以下内置数据结构作为所有记录的值:


*   `STRING` holds a single string value.

*   `STRING` 保存单个字符串值。


*   `LIST`, `SET`, and `HASH` are semantically identical to the same data structures in Java.

*   `LIST`、`SET` 和 `HASH` 在语义上与 Java 中同名的数据结构相同。


*   `ZSET` is a list of strings ordered by float-point score, resembling `PriorityQueue` in Java.

*   `ZSET` 是一个按浮点分数排序的字符串列表,类似 Java 中的 `PriorityQueue`。


Unlike tables in RDBMS, Redis data structures are instantiated on the fly. When you query anything not existing in Redis, it simply returns null. Although Redis doesn't allow nested structures, you can implement a custom Java or JSON serializer/deserializer to map POJOs to strings. In this way, you can save an arbitrary Java bean as a `STRING`, or place it in a `LIST`, a `SET`, and so on.

与 RDBMS 中的表不同,Redis 的数据结构是即时实例化的。当你查询 Redis 中不存在的东西时,它只会返回 null。尽管 Redis 不允许嵌套结构,但你可以实现自定义的 Java 或 JSON 序列化器/反序列化器,把 POJO 映射为字符串。这样一来,你就可以把任意 Java bean 保存为一个 `STRING`,或者把它放进 `LIST`、`SET` 等等之中。


### Performance and scalability

### 性能和可伸缩性


The first thing you will likely notice about Redis is that it is extremely fast. Performance benchmarks vary based on record size and number of connections, but latency is typically in the single-digit milliseconds. For most use cases, Redis can sustain up to 50,000 requests per second (RPS). If you're using higher end hardware, you could get throughput up to 700,000 RPS (though this number could be throttled by the bandwidth of your NIC cards).

关于 Redis,你很可能注意到的第一件事就是它极快。性能基准会随记录大小和连接数而变化,但延迟通常在个位数毫秒。对于大多数用例,Redis 可以维持每秒 50,000 个请求(RPS)的吞吐量。如果你使用更高端的硬件,吞吐量可以达到 700,000 RPS(不过这个数字可能受网卡带宽的限制)。


Being an in-memory database, Redis has limited storage; the largest instance in AWS EC2 is r3.8xlarge with 244 GB memory. Due to its indexing and performance-optimized data structures, Redis consumes much more memory than the size of the data stored. Sharding Redis can help overcome this limitation. In order to backup in-memory data to a hard drive, you can do point-in-time dumps in scheduled jobs, or run a `dump` command as needed.

作为一个内存数据库,Redis 的存储有限;AWS EC2 中最大的实例是 r3.8xlarge,拥有 244 GB 内存。由于其索引和经过性能优化的数据结构,Redis 消耗的内存远大于所存数据的大小。对 Redis 进行分片有助于克服这一限制。为了把内存中的数据备份到硬盘,你可以在定时任务中做时间点转储,或者按需运行 `dump` 命令。


 




## Remote data caching with Spring

## 使用 Spring 实现远程数据缓存


Data caching is perhaps the most cost-effective approach for improving application server performance. Enabling data caching is effortless using Spring's cache abstraction annotations: `@Cacheable`, `@CachePut`, `@CacheEvict`, `@Caching`, and `@CacheConfig`. In a Spring configuration, you could use Ehcache, Memcached, or Redis as the underlying cache server.

数据缓存也许是提升应用服务器性能最具成本效益的方法。使用 Spring 的缓存抽象注解启用数据缓存毫不费力:`@Cacheable`、`@CachePut`、`@CacheEvict`、`@Caching` 和 `@CacheConfig`。在 Spring 配置中,你可以使用 Ehcache、Memcached 或 Redis 作为底层的缓存服务器。


Ehcache is typically configured as a local cache layer, nested and running on the application's JVM. Memcached or Redis would run as an independent cache server. To integrate a Redis cache into a Spring-based application, you will use the [Spring Data Redis](http://caseyscarborough.com/blog/2014/12/18/caching-data-in-spring-using-redis/) `RedisTemplate` and `RedisCacheManager`.

Ehcache 通常配置为本地缓存层,嵌套运行在应用的 JVM 中。Memcached 或 Redis 则作为独立的缓存服务器运行。要把 Redis 缓存集成到基于 Spring 的应用中,你将用到 [Spring Data Redis](http://caseyscarborough.com/blog/2014/12/18/caching-data-in-spring-using-redis/) 的 `RedisTemplate` 和 `RedisCacheManager`。


Accessing cached objects in Redis takes less than a couple of milliseconds in general, which could give you a big boost in application performance when compared to relational database queries.

一般来说,在 Redis 中访问缓存对象只需不到几毫秒,与关系数据库查询相比,这能给应用性能带来很大的提升。


### Latency and revenue

### 延迟和收入


Amazon relies heavily on cache servers to minimize the latency of its retail websites, and even published a [case study](http://blog.gigaspaces.com/amazon-found-every-100ms-of-latency-cost-them-1-in-sales/) documenting the connection between latency and revenue.

亚马逊非常依赖缓存服务器来最小化其零售网站的延迟,甚至还发布了一份[案例研究](http://blog.gigaspaces.com/amazon-found-every-100ms-of-latency-cost-them-1-in-sales/),记录了延迟与收入之间的联系。


### Local cache vs. remote cache

### 本地缓存与远程缓存


In a system without network overhead, a local cache is faster than a remote cache. The downside of local caching is that multiple copies of the same object can be out-synced across different nodes in a server cluster. Because of this, a local cache is only suitable for static data, such as systemwide settings where small lags and inconsistencies are tolerable. If you use a local cache for volatile business data, such as user data and transaction data, you will very likely end up running a single instance of the application server.

在没有网络开销的系统中,本地缓存比远程缓存更快。本地缓存的缺点是,同一对象的多个副本可能在服务器集群的不同节点之间失去同步。正因如此,本地缓存只适用于静态数据,比如那些可以容忍轻微延迟和不一致的全局系统设置。如果你把本地缓存用于易变的业务数据,例如用户数据和事务数据,那么你很可能最终只能运行应用服务器的一个单实例。


A remote cache server doesn't have this limitation. Given the same key, it is guaranteed a single copy of the object on the cache server. As long as you keep objects in the cache in-sync with their database value, you don't need to deal with stale data.

远程缓存服务器没有这个限制。给定相同的键,缓存服务器上保证只有对象的一份副本。只要你让缓存中的对象与数据库中的值保持同步,就不必处理过期数据。


Listing 1 shows a Spring data caching example.

清单 1 展示了一个 Spring 数据缓存的示例。


#### Listing 1. Enabling caching in Spring-based applications

#### 清单 1. 在基于 Spring 的应用中启用缓存


	 @Cacheable(value="User_CACHE_REPOSITORY", key = "#id")
	public User get(Long id) {
	  return em.find(User.class, id);
	}
	@Caching(put = {@CachePut(value="USER_CACHE_REPOSITORY", key = "#user.getId()")})  
	public User update(User user) {
	    em.merge(user);
	    return user;  
	}
	@Caching(evict = {@CacheEvict(value="USER_CACHE_REPOSITORY", key = "#user.getId()")})  
	public void delete(User user) {
	    em.remove(user);
	}
	@Caching(evict = {@CacheEvict(value="USER_CACHE_REPOSITORY", key = "#user.getId()")})  
	public void evictCache(User user) {
	} 




Here the read operation is surrounded with Spring's `@Cacheable` annotation, which is implemented as an AOP advisor under the hood. A time-to-live setting in Spring also specifies how long these objects will remain in the cache. When the `get()` method is invoked, Spring tries to fetch and return the object from the remote cache first. If the object isn't found, Spring will execute the body of the method and place the database result in the remote cache before returning it.

这里的读操作被 Spring 的 `@Cacheable` 注解包围,该注解在底层实现为一个 AOP 通知(advisor)。Spring 中的 time-to-live 设置还指定了这些对象在缓存中保留多久。当调用 `get()` 方法时,Spring 会先尝试从远程缓存中获取并返回对象。如果找不到该对象,Spring 将执行方法体,并在返回之前把数据库结果放入远程缓存。


But what if the same object is updated in the database by another process (such as another server node), or even another thread in the same JVM? With just the `@Cacheable` annotation employed, you might receive a stale copy from the remote cache server.

但如果同一个对象被另一个进程(比如另一个服务器节点),甚至是同一 JVM 中的另一个线程在数据库里更新了,会怎样呢? 只使用 `@Cacheable` 注解的话,你可能会从远程缓存服务器收到一份过期的副本。


To prevent this from happening, you could add a `@CachePut` annotation to all database update operations. Every time these methods are invoked, the return value replaces the old object in the remote cache. Updating the cache on both database reads and writes keeps the records in-sync between the cache server and the backend database.

为防止这种情况发生,你可以为所有数据库更新操作加上 `@CachePut` 注解。每当调用这些方法时,返回值都会替换远程缓存中的旧对象。在数据库的读和写上同时更新缓存,可以让缓存服务器与后端数据库之间的记录保持同步。


### Fault tolerance

### 容错


This sounds perfect, right? Actually, no. With the config in Listing 1 you might not experience any issues under light load, but as you gradually increase the load on the server cluster you will start to see stale data in the remote cache. Be prepared for contention from server nodes, or worse. Even with a successful write in the database, you could end up with a failed `PUT` in the cache server due to a network glitch. Additionally, NoSQL generally doesn't support full transaction semantics in relational databases, which can lead to partial commits. In order to make your code fault tolerant, consider adding a version number for optimistic locking to your data model.

这听起来很完美,对吧? 其实不然。用清单 1 中的配置,在轻负载下你可能不会遇到任何问题,但随着你逐渐增大服务器集群的负载,你就会开始看到远程缓存中出现过期数据。要做好应对服务器节点争用——甚至更糟情况的准备。即使数据库写入成功,由于网络故障,缓存服务器中的 `PUT` 也可能失败。此外,NoSQL 通常不像关系数据库那样支持完整的事务语义,这可能导致部分提交。为了让你的代码具备容错能力,可以考虑在数据模型中添加版本号以实现乐观锁。


Upon receiving `OptimisticLockingFailureException` or `CurrentModificationException` (depending on your persistence solution), you would call a method annotated with `@CacheEvict` to purge the stale copy from the cache, then retry the same operation:

在收到 `OptimisticLockingFailureException` 或 `CurrentModificationException`(取决于你的持久化方案)时,你会调用一个标注了 `@CacheEvict` 的方法,从缓存中清除过期的副本,然后重试同一操作:


#### Listing 2. Resolving stale objects in the cache

#### 清单 2. 解决缓存中的过期对象


	 try{
	    User user = userDao.get(id);    // user fetched in cache server
	    userDao.update(user, oldname, newname);      
	}catch(ConcurrentModificationException ex) {   // cached user object may be stale
	    userDao.evictCache(user);
	    user =  userDao.get(id);     // refresh user object
	    userDao.update(user, oldname, newname);    // retry the same operation. Note it may still throw legitimate ConcurrentModificationException.
	} 




### Using Redis with Elasticache

### 将 Redis 与 Elasticache 一起使用


Amazon Elasticache is an in-memory cache service that can be combined with either Memcached or Redis as a cache server. While Elasticache is out the scope of this article, I'd like to offer a tip to developers using Elasticache with Redis. While we can live with the default values of most Redis parameters, the default Redis settings for `tcp-keepalive` and `timeout` don't remove dead client connections, and could eventually exhaust the sockets on the cache server. Always set these two values explicitly when using Redis with Elasticache.

Amazon Elasticache 是一项内存缓存服务,可以搭配 Memcached 或 Redis 作为缓存服务器。虽然 Elasticache 不在本文讨论范围之内,但我想给使用 Elasticache 搭配 Redis 的开发者一个提示。虽然大多数 Redis 参数的默认值我们都能接受,但 Redis 对 `tcp-keepalive` 和 `timeout` 的默认设置不会清除已死的客户端连接,最终可能耗尽缓存服务器上的套接字(socket)。在使用 Redis 搭配 Elasticache 时,一定要显式设置这两个值。


## Use cases for Redis as a database

## Redis 作为数据库的用例


Now let's look at a variety of ways that you can use Redis as a database in server-side Java EE systems. Whether the use case is simple or complex, Redis can help you achieve performance, throughput, and latency that would be formidable to a normal Java EE technology stack.

现在让我们看看在服务器端 Java EE 系统中,把 Redis 当作数据库使用的各种方式。无论用例简单还是复杂,Redis 都能帮你实现令普通 Java EE 技术栈望尘莫及的性能、吞吐量和延迟。


### 1. Globally unique incremental counter

### 1. 全局唯一递增计数器


This is a relatively simple use case to start with: an incremental counter that displays how many hits a website receives. Spring Data Redis offers two classes that you can use for this utility: `RedisAtomicInteger` and `RedisAtomicLong`. Unlike `AtomicInteger` and `AtomicLong` in the Java concurrency package, these Spring classes work across multiple JVMs.

先从一个相对简单的用例开始:一个显示网站访问量的递增计数器。Spring Data Redis 提供了两个可用于此功能的类:`RedisAtomicInteger` 和 `RedisAtomicLong`。与 Java 并发包中的 `AtomicInteger` 和 `AtomicLong` 不同,这两个 Spring 类可以跨多个 JVM 工作。


#### Listing 3. Globally unique increment counter

#### 清单 3. 全局唯一递增计数器


	 RedisAtomicLong counter = 
	  new RedisAtomicLong("UNIQUE_COUNTER_NAME", redisTemplate.getConnectionFactory()); 
	Long myCounter = counter.incrementAndGet();    // return the incremented value 




Watch out for integer overflow and remember that operations on these two classes are relatively expensive.

注意整数溢出,并记住这两个类的操作相对昂贵。


### 2. Global pessimistic lock

### 2. 全局悲观锁


From time to time you will need to deal with contention in a server cluster. Say you're running a scheduled job from a server cluster. Without a global lock, nodes in the cluster will launch redundant job instances. In the case of a chat room partition, you might have a capacity of 50. When that chat room is full, you need to create a new chat room instance to accommodate the next 50.

你有时需要处理服务器集群中的争用问题。比如说,你从一个服务器集群运行一个定时任务。如果没有全局锁,集群中的节点就会启动多余的作业实例。再以聊天室分区为例,假设一个聊天室的容量是 50。当该聊天室满员时,你需要创建一个新的聊天室实例,以容纳接下来的 50 人。


Detecting a full chat room without a global lock could lead each node in the cluster to create its own chat-room instance, making the whole system unpredictable. Listing 4 shows how to leverage the [SETNX](http://redis.io/commands/SETNX) (**SET** if **N**ot e**X**ists) Redis command to implement a global pessimistic lock.

在没有全局锁的情况下检测聊天室是否满员,可能会导致集群中的每个节点都创建自己的聊天室实例,使整个系统变得不可预测。清单 4 展示了如何利用 [SETNX](http://redis.io/commands/SETNX)(**S**ET if **N**ot e**X**ists,若不存在则设置)这条 Redis 命令来实现全局悲观锁。


> Listing 4. Global pessimistic locking

> 清单 4. 全局悲观锁



	public String aquirePessimisticLockWithTimeout(String lockName,
				int acquireTimeout, int lockTimeout) {
			if (StringUtils.isBlank(lockName) || lockTimeout <= 0)
				return null;
			final String lockKey = lockName;
			String identifier = UUID.randomUUID().toString(); 
			Calendar atoCal = Calendar.getInstance();
			atoCal.add(Calendar.SECOND, acquireTimeout);
			Date atoTime = atoCal.getTime();




			while (true) {
				// try to acquire the lock
				if (redisTemplate.execute(new RedisCallback<Boolean>() {
					@Override
					public Boolean doInRedis(RedisConnection connection)
							throws DataAccessException {
						return connection.setNX(
	redisTemplate.getStringSerializer().serialize(lockKey), redisTemplate.getStringSerializer().serialize(identifier));
					}
				})) { 	// successfully acquired the lock, set expiration of the lock
					redisTemplate.execute(new RedisCallback<Boolean>() {
						@Override
						public Boolean doInRedis(RedisConnection connection)
								throws DataAccessException {
							return connection.expire(redisTemplate
									.getStringSerializer().serialize(lockKey),
									lockTimeout);
						}
					});
					return identifier;
				} else { // fail to acquire the lock
					// set expiration of the lock in case ttl is not set yet.
					if (null == redisTemplate.execute(new RedisCallback<Long>() {
						@Override
						public Long doInRedis(RedisConnection connection)
								throws DataAccessException {
							return connection.ttl(redisTemplate
									.getStringSerializer().serialize(lockKey));
						}
					})) {
						// set expiration of the lock
						redisTemplate.execute(new RedisCallback<Boolean>() {
							@Override
							public Boolean doInRedis(RedisConnection connection)
									throws DataAccessException {
								return connection.expire(redisTemplate
									.getStringSerializer().serialize(lockKey),
										lockTimeout);
							}
						}); 
	}
					if (acquireTimeout < 0) // no wait
						return null;
					else {
						try {
							Thread.sleep(100l); // wait 100 milliseconds before retry
						} catch (InterruptedException ex) {
						}
					}
					if (new Date().after(atoTime))
						break;
				}
			}
			return null;
		}




		public void releasePessimisticLockWithTimeout(String lockName, String identifier) {
			if (StringUtils.isBlank(lockName) || StringUtils.isBlank(identifier))
				return;
			final String lockKey = lockName;




			redisTemplate.execute(new RedisCallback<Void>() {
						@Override
						public Void doInRedis(RedisConnection connection)
								throws DataAccessException {
							byte[] ctn = connection.get(redisTemplate
									.getStringSerializer().serialize(lockKey));
							if(ctn!=null && identifier.equals(redisTemplate.getStringSerializer().deserialize(ctn)))
								connection.del(redisTemplate.getStringSerializer().serialize(lockKey));
							return null;
						}
					});
		}	 




With a relational database you risk the possibility that the lock will never be released, if the program creating the lock in the first place quits unexpectedly. Redis's EXPIRE setting ensures that the lock will be released under any circumstances.

使用关系数据库时,如果最初创建锁的程序意外退出,你就面临锁永远无法释放的风险。Redis 的 EXPIRE 设置可以确保锁在任何情况下都会被释放。


3. Bit Mask

3. 位掩码



Hypothetically a web client needs to poll a web server for client-specific updates against many tables in a database. Blindly querying all these tables for possible updates is costly. To get around this, try saving one integer per client in Redis as a dirty indicator, of which every bit represents one table. A bit is set when there are updates for the client in that table. During polling, no query will be fired on a table unless the corresponding bit is set. Redis is highly efficient in getting and setting such a bit mask as STRING.

假设一个 Web 客户端需要轮询 Web 服务器,以获取针对该客户端在许多数据库表中的更新。盲目地查询所有这些表以寻找可能的更新,代价高昂。为解决这个问题,可以尝试在 Redis 中为每个客户端保存一个整数作为脏标记(dirty indicator),其中每一位代表一张表。当该客户端在某张表中有更新时,就置位相应的位。轮询期间,除非对应位被置位,否则不会对某张表发起查询。Redis 以 STRING 形式获取和设置这样的位掩码非常高效。


4. Leaderboard

4. 排行榜



Redis's ZSET data structure offers a neat solution for game player leaderboards. ZSET works somewhat like PriorityQueue in Java, where objects are organized in a sorted data structure. Game players may be sorted in terms of their score in a leaderboard. Redis ZSET defines a rich list of commands supporting powerful and nimble queries. For example, ZRANGE (including ZREVRANGE) returns the specified range of elements in the sorted set.

Redis 的 ZSET 数据结构为游戏玩家排行榜提供了一种简洁的解决方案。ZSET 的工作方式有点类似 Java 中的 PriorityQueue,对象以有序的数据结构组织起来。游戏玩家可以按他们在排行榜中的得分排序。Redis ZSET 定义了一组丰富的命令,支持强大而灵活的查询。例如,ZRANGE(包括 ZREVRANGE)返回有序集合中指定范围的元素。


You could use this command to list the top 100 players on a leaderboard. ZRANGEBYSCORE returns the elements within the specified score range (for instance by listing players with score between 1000 and 2000), ZRNK returns the rank of an element in the sorted set, and so forth.

你可以用这条命令列出排行榜的前 100 名玩家。ZRANGEBYSCORE 返回指定分数范围内的元素(例如列出得分在 1000 到 2000 之间的玩家),ZRNK 返回某个元素在有序集合中的排名,等等。


5. Bloom filter

5. 布隆过滤器



A Bloom filter is a space-efficient probabilistic data structure used to test whether an element is a member of a set. False positive matches are possible, but false negatives are not. A query returns either "possibly in set" or "definitely not in set."

布隆过滤器是一种节省空间的概率型数据结构,用于测试某个元素是否属于一个集合。可能出现假阳性(误判为存在),但不会出现假阴性(漏判)。查询结果要么是"可能在集合中",要么是"肯定不在集合中"。


The bloom filter data structure has a wide variety of uses in both online and offline services, including big data analytics. Facebook uses bloom filters for typeahead searches, to fetch friends and friends of friends to a user-typed query. Apache HBase uses it to filter out disk reads of HFile blocks that don't contain a particular row or column, thus boosting the speed of reads. Bitly uses a bloom filter to avoid redirecting users to malicious websites, and Quora implemented a sharded bloom filter in the feed backend to filter out previously viewed stories. In my own project, I applied a bloom filter to track user votes on different subjects.

布隆过滤器数据结构在线上和线下服务中都有广泛的用途,包括大数据分析。Facebook 用布隆过滤器来做输入联想(typeahead)搜索,针对用户输入的查询取出其朋友以及朋友的朋友。Apache HBase 用它来避免对不包含特定行或列的 HFile 块进行磁盘读取,从而提升读取速度。Bitly 用布隆过滤器避免把用户重定向到恶意网站,Quora 则在信息流后端实现了一个分片布隆过滤器,用来过滤掉此前看过的内容。在我自己的项目中,我也用布隆过滤器来跟踪用户对不同主题的投票。


With its speed and throughput, Redis combines exceptionally well with a bloom filter. Searching GitHub turns up many Redis bloom filter projects, some of which support tunable precision.

凭借其速度和吞吐量,Redis 与布隆过滤器结合得非常好。在 GitHub 上搜索,能找到许多 Redis 布隆过滤器项目,其中一些支持可调的精度。


6. Efficient global notifications: Publish/subscribe channels

6. 高效的全局通知:发布/订阅频道



A Redis publish/subscribe channel works like a fan-out messaging system, or a topic in JMS semantics. A difference between a JMS topic and a Redis pub/sub channel is that messages published through Redis are not durable. Once a message is pushed to all the connected clients, the message is removed from Redis. In other words, subscribers must stay online to accept new messages. Typical use cases for Redis pub/sub channels include realtime configuration distribution, simple chat server, etc.

Redis 的发布/订阅频道就像一个扇出(fan-out)的消息系统,或者 JMS 语义中的一个主题(topic)。JMS 主题与 Redis 发布/订阅频道的一个区别在于,通过 Redis 发布的消息不是持久化的。一旦消息被推送到所有已连接的客户端,该消息就会从 Redis 中移除。换句话说,订阅者必须保持在线才能接收新消息。Redis 发布/订阅频道的典型用例包括实时下发配置、简单的聊天服务器等。


In a web server cluster, each node can be a subscriber to a Redis pub/sub channel. A message published to the channel is pushed instantaneously to all the connected nodes. This message could be a configuration change or a global notification to all online users. Obviously this push communication model is extremely efficient compared with constant polling.

在一个 Web 服务器集群中,每个节点都可以是某个 Redis 发布/订阅频道的订阅者。发布到该频道的消息会被即时推送给所有已连接的节点。这条消息可能是一次配置变更,或者发给所有在线用户的全局通知。显然,与持续轮询相比,这种推送式通信模型极其高效。


Performance optimizing Redis

性能优化 Redis


Redis is extremely powerful, and it can be optimized both generally and for specific programming scenarios. Consider the following techniques.

Redis 极其强大,既可以做通用优化,也可以针对特定编程场景进行优化。请考虑以下技术。


Time-to-live

生存时间


All Redis data structures have a time-to-live (TTL) attribute. When you set this attribute, the data structure will be removed automatically after it expires. Making good use of this feature will keep memory consumption low in Redis.

所有 Redis 数据结构都有一个 time-to-live(TTL,生存时间)属性。设置了这个属性后,数据结构会在过期后自动被移除。善用这一特性能让 Redis 的内存占用保持在较低水平。


Pipelining

流水线


Sending multiple commands to Redis in a single request is called pipelining. This technique saves cost on network round-trips, which is important because network latency could be orders of magnitude higher than Redis latency. But there is a catch: the list of Redis commands inside a pipeline must be pre-determined and independent from each other. Pipelining doesn't work if one command's arguments are computed from the results of preceding commands. Listing 5 shows an example of Redis pipelining.

在单个请求中向 Redis 发送多条命令,称为流水线(pipelining)。这种技术能节省网络往返的开销,这一点很重要,因为网络延迟可能比 Redis 的延迟高出几个数量级。但有一个前提:流水线内的 Redis 命令列表必须是预先确定的,并且彼此独立。如果某条命令的参数是根据前面命令的结果计算出来的,流水线就不起作用。清单 5 展示了一个 Redis 流水线的示例。


> Listing 5. Pipelining

> 清单 5. 流水线



	@Override
	public List<LeaderboardEntry> fetchLeaderboard(String key, String... playerIds) {
		final List<LeaderboardEntry> entries = new ArrayList<>();
		redisTemplate.executePipelined(new RedisCallback<Object>() {	// enable Redis Pipeline
			@Override 
			public Object doInRedis(RedisConnection connection) throws DataAccessException { 
				for(String playerId : playerIds) {
					Long rank = connection.zRevRank(key.getBytes(), playerId.getBytes());
					Double score = connection.zScore(key.getBytes(), playerId.getBytes());
					LeaderboardEntry entry = new LeaderboardEntry(playerId, 
					score!=null?score.intValue():-1, rank!=null?rank.intValue():-1);
					entries.add(entry);
				}		 
				return null; 
			}
		}); 
		return entries; 
	}




Replica set and sharding

副本集和分片


Redis supports master-slave replica configuration. Like MongoDB, the replica set is asymmetric, as slave nodes are read-only to share read workloads. As I mentioned at the beginning of this article, it's also possible to implement sharding to scale out Redis throughput and memory capacity. In reality, Redis is so powerful that an internal Amazon benchmark reveals that one EC2 instance of type r3.4xlarge easily handles 100,000 requests per second. Some have informally reported 700,000 requests per second as a benchmark. For small-to-medium applications, you generally will not need to bother with sharding in Redis. (See the essential Redis in Action for more about performance optimization and sharding in Redis.)

Redis 支持主从副本配置。像 MongoDB 一样,副本集是不对称的,因为从节点是只读的,用来分担读负载。正如我在本文开头提到的,也可以实现分片,以横向扩展 Redis 的吞吐量和内存容量。事实上,Redis 强大到亚马逊的一份内部基准测试显示,一台 r3.4xlarge 类型的 EC2 实例可以轻松处理每秒 100,000 个请求。也有人非正式地报告了每秒 700,000 个请求的基准。对于中小型应用,你通常不必为 Redis 的分片费心。(关于 Redis 的性能优化和分片,更多内容可参见必读的《Redis in Action》一书。)


Transactions in Redis

Redis 中的事务


Although Redis doesn't support full ACID transaction like an RDBMS does, its own flavor of transaction is quite effective. In essence, a Redis transaction is a combination of pipelining, optimistic locking, commits, and rollbacks. The idea is to execute a list of commands in a pipeline, then watch for possible updates on a critical record (optimistic lock). Depending on whether or not the watched record is updated by another process, the list of commands will either commit as a whole or roll back entirely.

尽管 Redis 不像 RDBMS 那样支持完整的 ACID 事务,但它自己那套事务机制相当有效。本质上,Redis 的事务是流水线、乐观锁、提交和回滚的组合。其思路是在一个流水线中执行一组命令,然后监视某个关键记录是否可能被更新(乐观锁)。根据被监视的记录是否被另一个进程更新,这组命令要么整体提交,要么整体回滚。


As an example, consider seller inventory in an auction website. When a buyer tries to buy an item from a seller, you watch for changes on the seller's inventory inside the Redis transaction. In the meantime, you remove the item from the same inventory. Before the transaction closes, if the inventory was touched by more than one process (for instance, if two buyers purchased the same item at the same moment), the transaction will roll back; otherwise, the transaction will commit. A retry can kick in after a rollback.

举个例子,考虑一个拍卖网站中卖家的库存。当买家试图从某卖家处购买一件商品时,你在 Redis 事务内部监视该卖家库存的变化。与此同时,你从同一份库存中移除该商品。在事务结束之前,如果该库存被不止一个进程改动过(例如两个买家在同一时刻购买了同一件商品),事务就会回滚;否则,事务就会提交。回滚之后可以触发一次重试。


A transaction pitfall in Spring Data Redis

Spring Data Redis 中的一个事务陷阱


I learned a hard lesson when enabling Redis transactions in the Spring RedisTemplate class redisTemplate.setEnableTransactionSupport(true);: Redis started returning junk data after running for a few days, causing serious data corruption. A similar case was reported on StackOverflow.

在 Spring 的 RedisTemplate 类中启用 Redis 事务(`redisTemplate.setEnableTransactionSupport(true);`)时,我吃了大亏:运行几天之后,Redis 开始返回垃圾数据,导致严重的数据损坏。StackOverflow 上也报告过类似的案例。


By running a monitor command, my team discovered that after a Redis operation or RedisCallback, Spring doesn't close the Redis connection automatically, as it should do. Reusing an unclosed connection may return junk data from an unexpected key in Redis. Interestingly, this issue doesn't show up when transaction support is set to false in RedisTemplate.

通过运行 monitor 命令,我的团队发现,在 Redis 操作或 RedisCallback 之后,Spring 并不会像它应该做的那样自动关闭 Redis 连接。重用一条未关闭的连接,可能会从 Redis 中某个意料之外的键返回垃圾数据。有趣的是,当 RedisTemplate 中的事务支持设置为 false 时,这个问题不会出现。


We discovered that we could make Spring close Redis connections automatically by configuring a PlatformTransactionManager (such as DataSourceTransactionManager) in the Spring context, then using the @Transactional annotation to declare the scope of Redis transactions.

我们发现,可以通过在 Spring 上下文中配置一个 PlatformTransactionManager(例如 DataSourceTransactionManager),然后使用 @Transactional 注解来声明 Redis 事务的范围,从而让 Spring 自动关闭 Redis 连接。


Based on this experience, we believe it's good practice to configure two separate RedisTemplates in the Spring context: One with transaction set to false is used on most Redis operations; the other with transaction enabled is only applied to Redis transactions. Of course PlatformTransactionManager and @Transactional must be declared to prevent junk values from being returned.

基于这次经验,我们认为在 Spring 上下文中配置两个独立的 RedisTemplate 是一种好做法:一个把事务设为 false,用于大多数 Redis 操作;另一个启用事务,只用于 Redis 事务。当然,必须声明 PlatformTransactionManager 和 @Transactional,以防止返回垃圾值。


Moreover, we learned the downside of mixing a Redis transaction with a relational database transaction, in this case JDBC. Mixed transactions do not behave as you would expect.

此外,我们还体会到了把 Redis 事务与关系数据库事务(这里指 JDBC)混用的弊端。混用的事务并不会像你预期的那样运作。


Conclusion

结论


With this article I've hoped to introduce other Java enterprise developers to the power of Redis, particularly when used as a remote data cache and for volatile data. I've introduced six effective uses cases for Redis, shared a few performance optimizing techniques, and explained how my team at Glu Mobile worked around getting junk data as a result of mis-configured transactions in Spring Data Redis. I hope that this article has piqued your curiosity about Redis NoSQL and offered some pathways for exploring it in your own Java EE systems.

写这篇文章,是希望向其他 Java 企业开发者介绍 Redis 的强大之处,尤其是它在作为远程数据缓存以及处理易变数据时的用途。我介绍了 Redis 的六个有效用例,分享了一些性能优化技巧,并解释了我在 Glu Mobile 的团队是如何解决因 Spring Data Redis 事务配置错误而返回垃圾数据这一问题。希望本文能激起你对 Redis NoSQL 的好奇心,并为你自己的 Java EE 系统中探索它提供一些路径。


原文链接： [http://www.javaworld.com/article/3062899/big-data/lightning-fast-nosql-with-spring-data-redis.html?page=2](http://www.javaworld.com/article/3062899/big-data/lightning-fast-nosql-with-spring-data-redis.html?page=2)
