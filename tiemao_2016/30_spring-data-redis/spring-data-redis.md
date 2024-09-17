




# Lightning fast NoSQL with Spring Data Redis

# 轻量级NoSQL解决方案: Spring Data Redis


## 6 uses cases for Redis in server-side Java applications

## 在服务器端Java应用程序中使用Redis的6种场景


A multi-tiered architecture built on top of Java EE presents a powerful server-side programming solution. As a Java EE developer for many years, I've been mostly satisfied with a three-tiered approach for enterprise development: a JPA/Hibernate persistence layer at the bottom, a Spring or EJB application layer in the middle, and a web tier on top. For more complex use cases I've integrated a workflow-driven solution with BPM (business process management), a rules engine like [Drools](http://www.ibm.com/developerworks/library/j-drools5/), and an integration framework such as [Camel](http://www.javaworld.com/article/2078883/open-source-tools/java-tip-write-an-soa-integration-layer-with-apache-camel.html).

Java EE的多层体系结构之上提供了一个强大的服务器端编程解决方案.作为一个Java EE开发人员多年来,我一直是一个三层的方法为企业发展表示满意:JPA / Hibernate持久性层底部,弹簧或EJB应用程序层在中间,和web层之上.对于更复杂的用例我集成workflow-driven与BPM解决方案(业务流程管理),这样的规则引擎[Drools](http://www.ibm.com/developerworks/library/j-drools5/),和一个集成框架,如(骆驼)(http://www.javaworld.com/article/2078883/open-source-tools/java-tip-write-an-soa-integration-layer-with-apache-camel.html)。


Recently, however, I was tasked to design a system supporting hundreds of thousands of concurrent users, with sub-second response latency. I immediately saw the limits of my normal Java EE stack. Conventional RDBMS-based web applications, including those built on Hibernate/JPA, have second-order latency and do not scale well. A traditional Java EE persistence architecture would not meet the performance and throughput requirements for the system I was designing. I turned to NoSQL, and eventually found [Redis](http://redis.io/).

然而,最近,我的任务是设计一个系统支持成千上万的并发用户,与次秒级响应延迟。我立刻看到了我正常的Java EE堆栈的限制.传统RDBMS-based web应用程序,包括基于Hibernate或JPA,二阶延迟和不很好地伸缩.传统的Java EE持久性体系结构不满足系统的性能和吞吐量需求设计。我转向NoSQL,最终发现Redis(http://redis.10 /)。


Being an in-memory key-value datastore, Redis breaks from the conventional definition of a database, where data is saved on a hard drive. Instead, it can be used in combination with a persistent NoSQL datastore such as MongoDB, HBase, Cassandra, or DynamoDB. Redis excels as a remote cache server, and is an exceptionally fast datastore for volatile data.

作为一个内存中的键值数据存储,Redis,打破传统定义的一个数据库,数据保存在硬盘.相反,它可以结合使用一个持久NoSQL数据存储如MongoDB,HBase,卡桑德拉,或者DynamoDB.Redis,擅长远程缓存服务器,异常快速挥发性数据的数据存储。


In this article I introduce simple and advanced use cases and performance tuning with Redis. I'll provide a brief overview, but I assume you are basically familiar with NoSQL and the [variety of solutions](http://www.javaworld.com/article/3030214/big-data/open-source-java-projects-apache-phoenix.html) available in that field.

在本文中,我将介绍简单和高级用例和Redis,性能调优.我会提供一个简要概述,但我假设您基本熟悉NoSQL和各种各样的解决方案(http://www.javaworld.com/article/3030214/big-data/open-source-java-projects-apache-phoenix.html)可用。


 




### Spring Data Redis


Redis has client libraries for almost every programming language, including Java. [Jedis](https://github.com/xetorthio/jedis) is perhaps the most popular Java client library. Examples in this article are based on [Spring Data Redis](http://docs.spring.io/spring-data/redis/docs/current/reference/html/), which I've used as a higher level wrapper API. Spring Data Redis offers easy configuration, friendly APIs, and useful add-ons.

Redis has client libraries for almost every programming language, o Java. [Jedis] (https://github.com/xetorthio/jedis) is perhaps the most popular Java client library.本文示例是基于[Spring Data Redis](http://docs.spring.io/spring-data/redis/docs/current/reference/html/),我作为一个更高的水平包装器API.Spring Data Redis,提供简单的配置,友好的api,和有用的插件。


## Overview of Redis

## Redis概述


Like most NoSQL data stores, Redis abandons the relational concepts of tables, rows, and columns. Instead, it is a key-value data store, where each record is stored and retrieved using a unique string key. Redis supports the following built-in data structures as the value of all records:

像大多数NoSQL数据存储,Redis,放弃关系表的概念,行和列.相反,它是一个键值数据存储,每个记录是使用一个惟一的字符串键存储和检索。Redis,支持以下内置的数据结构为所有记录的价值:


*   `STRING` holds a single string value.

*“字符串”拥有一个字符串值。


*   `LIST`, `SET`, and `HASH` are semantically identical to the same data structures in Java.

*“列表”,“设置”,“希”语义上相同的相同的数据结构的Java。


*   `ZSET` is a list of strings ordered by float-point score, resembling `PriorityQueue` in Java.

*“ZSET”是一个字符串列表,下令浮点得分,类似“PriorityQueue”Java。


Unlike tables in RDBMS, Redis data structures are instantiated on the fly. When you query anything not existing in Redis, it simply returns null. Although Redis doesn't allow nested structures, you can implement a custom Java or JSON serializer/deserializer to map POJOs to strings. In this way, you can save an arbitrary Java bean as a `STRING`, or place it in a `LIST`, a `SET`, and so on.

会议重申,Unlike RDBMS in数据结构instantiated are the environment弗来河系统。anything not existing query,一本再次重申,它将在英国null.虽然Redis,不允许嵌套结构,您可以实现一个定制的Java或JSON序列化器/反序列化器将pojo映射到字符串.通过这种方式,您可以保存任意Java bean作为一个字符串,或把它放在“列表”,一个“设置”,等等。


### Performance and scalability

### 性能和可伸缩性


The first thing you will likely notice about Redis is that it is extremely fast. Performance benchmarks vary based on record size and number of connections, but latency is typically in the single-digit milliseconds. For most use cases, Redis can sustain up to 50,000 requests per second (RPS). If you're using higher end hardware, you could get throughput up to 700,000 RPS (though this number could be throttled by the bandwidth of your NIC cards).

你可能会注意到的第一件事Redis是非常快.绩效基准随记录大小和连接数,但延迟通常在个位数毫秒.对于大多数用例,Redis,可以维持到每秒50000个请求(RPS).如果you’re using高等end硬件、throughput乘坐不确you力争70(RPS throttled可以突破this扎扎实实的bandwidth of你NIC cards)。


Being an in-memory database, Redis has limited storage; the largest instance in AWS EC2 is r3.8xlarge with 244 GB memory. Due to its indexing and performance-optimized data structures, Redis consumes much more memory than the size of the data stored. Sharding Redis can help overcome this limitation. In order to backup in-memory data to a hard drive, you can do point-in-time dumps in scheduled jobs, or run a `dump` command as needed.

作为一个内存数据库,Redis,有限的存储;最大的实例在AWS EC2 r3.8xlarge 244 GB内存.由于它的索引和performance-optimized数据结构,Redis,消耗更多的内存存储的数据的大小。分片Redis,可以帮助克服这个限制.为了备份内存数据的硬盘,你可以在预定时间点转储工作,或者根据需要运行一个“转储”命令。


 




## Remote data caching with Spring

## 远程数据缓存与Spring


Data caching is perhaps the most cost-effective approach for improving application server performance. Enabling data caching is effortless using Spring's cache abstraction annotations: `@Cacheable`, `@CachePut`, `@CacheEvict`, `@Caching`, and `@CacheConfig`. In a Spring configuration, you could use Ehcache, Memcached, or Redis as the underlying cache server.

数据缓存可能是最具成本效益的方法提高应用服务器的性能.启用缓存数据缓存是轻松使用Spring的抽象注释:‘@Cacheable’,‘@CachePut’,‘@CacheEvict’,‘@Caching’,‘@CacheConfig’.在Spring配置中,您可以使用Ehcache,Memcached,或Redis,底层的缓存服务器。


Ehcache is typically configured as a local cache layer, nested and running on the application's JVM. Memcached or Redis would run as an independent cache server. To integrate a Redis cache into a Spring-based application, you will use the [Spring Data Redis](http://caseyscarborough.com/blog/2014/12/18/caching-data-in-spring-using-redis/) `RedisTemplate` and `RedisCacheManager`.

Ehcache通常配置为本地缓存层,嵌套和JVM上运行的应用程序的。Memcached或Redis,将作为一个独立的缓存服务器运行.将Redis,缓存集成到基于Spring的应用程序中,您将使用弹簧数据Redis(http://caseyscarborough.com/blog/2014/12/18/caching-data-in-spring-using-redis/)“RedisTemplate”和“RedisCacheManager”。


Accessing cached objects in Redis takes less than a couple of milliseconds in general, which could give you a big boost in application performance when compared to relational database queries.

访问缓存对象在Redis,只需要不到几毫秒在一般情况下,这可能会给你一个大提高应用程序的性能相比,关系数据库查询。


### Latency and revenue

### 延迟和收入


Amazon relies heavily on cache servers to minimize the latency of its retail websites, and even published a [case study](http://blog.gigaspaces.com/amazon-found-every-100ms-of-latency-cost-them-1-in-sales/) documenting the connection between latency and revenue.

亚马逊在很大程度上依赖于缓存服务器的延迟最小化其零售网站,甚至出版了一本(案例研究)(http://blog.gigaspaces.com/amazon -发现-每- 100毫秒的延迟时间-成本- - 1在sales/)记录延迟和收入之间的关系。


### Local cache vs. remote cache

### 本地缓存与远程缓存


In a system without network overhead, a local cache is faster than a remote cache. The downside of local caching is that multiple copies of the same object can be out-synced across different nodes in a server cluster. Because of this, a local cache is only suitable for static data, such as systemwide settings where small lags and inconsistencies are tolerable. If you use a local cache for volatile business data, such as user data and transaction data, you will very likely end up running a single instance of the application server.

无overhead网络有系统的地方,是社会than隐藏is隐藏.本地缓存的缺点是,同一对象的多个副本可以跨不同的节点out-synced服务器集群.正因为如此,本地缓存只适用于静态数据、系统设置等小滞后和不一致是可以忍受的.如果你使用一个本地缓存不稳定的业务数据,如用户数据和事务数据,你将很有可能最终运行应用服务器的一个实例。


A remote cache server doesn't have this limitation. Given the same key, it is guaranteed a single copy of the object on the cache server. As long as you keep objects in the cache in-sync with their database value, you don't need to deal with stale data.

远程缓存服务器没有这个限制。鉴于相同的密钥,保证缓存服务器上的对象的一个副本.只要你保持缓存中对象与数据库同步的价值,你不需要处理陈旧的数据。


Listing 1 shows a Spring data caching example.

清单1显示了一个弹簧数据缓存的例子。


#### Listing 1. Enabling caching in Spring-based applications

#### 清单1 .在基于spring的应用程序启用缓存


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

这里的读操作是Spring的@Cacheable注释,这是作为AOP实现顾问.生存时间设置在春天还指定了多久这些对象将继续在缓存中.当“get()春天的方法被调用时,试图从远程缓存获取和返回对象.如果对象没有发现,春天将执行方法和地点的主体数据库导致远程缓存返回之前。


But what if the same object is updated in the database by another process (such as another server node), or even another thread in the same JVM? With just the `@Cacheable` annotation employed, you might receive a stale copy from the remote cache server.

但如果同一个对象被更新在数据库中被另一个进程(比如另一个服务器节点),或者另一个线程在同一JVM?只有“@Cacheable”注释,您可能会收到从远程缓存过期副本服务器。


To prevent this from happening, you could add a `@CachePut` annotation to all database update operations. Every time these methods are invoked, the return value replaces the old object in the remote cache. Updating the cache on both database reads and writes keeps the records in-sync between the cache server and the backend database.

为了防止这种情况的发生,您可以添加一个“@CachePut”注释所有数据库更新操作.每次调用这些方法,返回值替换旧远程缓存中的对象.更新缓存数据库读写保持记录缓存服务器和后端数据库之间的同步。


### Fault tolerance

### 容错


This sounds perfect, right? Actually, no. With the config in Listing 1 you might not experience any issues under light load, but as you gradually increase the load on the server cluster you will start to see stale data in the remote cache. Be prepared for contention from server nodes, or worse. Even with a successful write in the database, you could end up with a failed `PUT` in the cache server due to a network glitch. Additionally, NoSQL generally doesn't support full transaction semantics in relational databases, which can lead to partial commits. In order to make your code fault tolerant, consider adding a version number for optimistic locking to your data model.

这听起来完美,对吧?事实上,没有.与清单1中的配置负载较轻的你可能不会经历任何问题,但是当你逐渐增加服务器集群上的负载你将开始看到在远程缓存过期数据.准备好争用从服务器节点,或者更糟。即使有一个成功的写在数据库中,你可以得到一个失败的“把”缓存服务器由于网络故障.此外,NoSQL一般不支持完整的事务语义在关系数据库中,从而导致部分提交.为了使代码容错,考虑添加版本号为乐观锁定你的数据模型。


Upon receiving `OptimisticLockingFailureException` or `CurrentModificationException` (depending on your persistence solution), you would call a method annotated with `@CacheEvict` to purge the stale copy from the cache, then retry the same operation:

接到“OptimisticLockingFailureException”或“CurrentModificationException”(取决于你的持久性解决方案),你将会调用一个方法注释@CacheEvict从缓存中清除陈旧的副本,然后重试相同的操作:


#### Listing 2. Resolving stale objects in the cache

#### 清单2 .解决过期缓存中的对象


	 try{
	    User user = userDao.get(id);    // user fetched in cache server
	    userDao.update(user, oldname, newname);      
	}catch(ConcurrentModificationException ex) {   // cached user object may be stale
	    userDao.evictCache(user);
	    user =  userDao.get(id);     // refresh user object
	    userDao.update(user, oldname, newname);    // retry the same operation. Note it may still throw legitimate ConcurrentModificationException.
	} 




### Using Redis with Elasticache

### 用RedisElasticache


Amazon Elasticache is an in-memory cache service that can be combined with either Memcached or Redis as a cache server. While Elasticache is out the scope of this article, I'd like to offer a tip to developers using Elasticache with Redis. While we can live with the default values of most Redis parameters, the default Redis settings for `tcp-keepalive` and `timeout` don't remove dead client connections, and could eventually exhaust the sockets on the cache server. Always set these two values explicitly when using Redis with Elasticache.

亚马逊Elasticache是一个内存中的缓存服务,可以结合Memcached或Redis,缓存服务器.虽然Elasticache不在本文的讨论范围内,我想提供一个提示开发人员使用ElasticacheRedis.虽然我们可以忍受大多数Redis,参数的默认值,默认的Redis,设置“tcp-keepalive”和“超时”不要删除死客户端连接,并可能最终排在缓存服务器套接字。总是显式地设置这两个值在使用与ElasticacheRedis。


## Use cases for Redis as a database

## 用例Redis,作为一个数据库


Now let's look at a variety of ways that you can use Redis as a database in server-side Java EE systems. Whether the use case is simple or complex, Redis can help you achieve performance, throughput, and latency that would be formidable to a normal Java EE technology stack.

现在让我们看看各种各样的方式,您可以使用Redis,作为数据库服务器端Java EE系统.是否简单或复杂的用例,Redis,可以帮助您实现性能、吞吐量和延迟,将强大的一个正常的Java EE技术栈。


### 1. Globally unique incremental counter

### 1 .全局唯一递增计数器


This is a relatively simple use case to start with: an incremental counter that displays how many hits a website receives. Spring Data Redis offers two classes that you can use for this utility: `RedisAtomicInteger` and `RedisAtomicLong`. Unlike `AtomicInteger` and `AtomicLong` in the Java concurrency package, these Spring classes work across multiple JVMs.

这是一个相对简单的用例开始:增量计数器显示有多少点击一个网站接收.Spring Data Redis,提供了两个类,您可以使用这个实用程序:“RedisAtomicInteger”和“RedisAtomicLong”.与“AtomicInteger”和“AtomicLong”在Java并发方案,这些弹簧类工作跨多个jvm。


#### Listing 3. Globally unique increment counter

#### 清单3 .全局唯一增加计数器


	 RedisAtomicLong counter = 
	  new RedisAtomicLong("UNIQUE_COUNTER_NAME", redisTemplate.getConnectionFactory()); 
	Long myCounter = counter.incrementAndGet();    // return the incremented value 




Watch out for integer overflow and remember that operations on these two classes are relatively expensive.

当心整数溢出,记住,这两个类是相对昂贵的操作。


### 2. Global pessimistic lock

### 2 .全局悲观锁


From time to time you will need to deal with contention in a server cluster. Say you're running a scheduled job from a server cluster. Without a global lock, nodes in the cluster will launch redundant job instances. In the case of a chat room partition, you might have a capacity of 50. When that chat room is full, you need to create a new chat room instance to accommodate the next 50.

不时地需要处理争用在服务器集群。说你正在运行一个预定的工作从一个服务器集群.没有一个全局锁,集群中的节点将启动实例冗余的工作。在一个聊天室分区的情况下,您可能有一个50 \的能力.当聊天室已满,您需要创建一个新的聊天室实例,以适应未来50。


Detecting a full chat room without a global lock could lead each node in the cluster to create its own chat-room instance, making the whole system unpredictable. Listing 4 shows how to leverage the [SETNX](http://redis.io/commands/SETNX) (**SET** if **N**ot e**X**ists) Redis command to implement a global pessimistic lock.

检测一个完整的聊天室没有全局锁可能会导致集群中的每个节点创建自己的聊天室实例,使整个系统不可预测的.清单4显示了如何利用[SETNX](http://redis.io/commands/SETNX)(* * * * * * N * *不* * X * *包括)Redis,命令来实现全局悲观锁。


> Listing 4. Global pessimistic locking

> 清单4。全局悲观锁定



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

与关系数据库锁的可能性风险永远不会被释放,如果程序创建锁在第一时间意外退出.Redis的过期设置确保锁在任何情况下将发布。


3. Bit Mask

3. 位元遮罩



Hypothetically a web client needs to poll a web server for client-specific updates against many tables in a database. Blindly querying all these tables for possible updates is costly. To get around this, try saving one integer per client in Redis as a dirty indicator, of which every bit represents one table. A bit is set when there are updates for the client in that table. During polling, no query will be fired on a table unless the corresponding bit is set. Redis is highly efficient in getting and setting such a bit mask as STRING.

假设web客户端需要调查一个web服务器端特定的更新对许多表在数据库中。盲目地查询所有这些表可能的更新是昂贵的.为了解决这个问题,尽可能保存每个客户一个整数Redis一个肮脏的指标,其中每一点代表一个表。设置当有一点更新该表中的客户端.在轮询,桌子上没有查询将被解雇,除非已经设置了相应的位。Redis,高效的获取和设置等一些面具字符串。


4. Leaderboard

4. 排行榜



Redis's ZSET data structure offers a neat solution for game player leaderboards. ZSET works somewhat like PriorityQueue in Java, where objects are organized in a sorted data structure. Game players may be sorted in terms of their score in a leaderboard. Redis ZSET defines a rich list of commands supporting powerful and nimble queries. For example, ZRANGE (including ZREVRANGE) returns the specified range of elements in the sorted set.

Redis的ZSET玩家排行榜数据结构提供了一个简洁的解决方案。PriorityQueue ZSET工作有点像在Java中,对象是组织的一个排序的数据结构.游戏玩家可以排序的得分排行榜。Redis,ZSET定义了一个丰富的命令列表支持强大和灵活的查询.例如,ZRANGE(包括ZREVRANGE)返回指定范围的元素排序。


You could use this command to list the top 100 players on a leaderboard. ZRANGEBYSCORE returns the elements within the specified score range (for instance by listing players with score between 1000 and 2000), ZRNK returns the rank of an element in the sorted set, and so forth.

你可以用这个命令列出排行榜前100名玩家.ZRANGEBYSCORE返回元素指定的分数范围内(例如清单球员得分在1000 - 2000年间),ZRNK回报的秩排序的元素集,等等。


5. Bloom filter

5. 布隆过滤器



A Bloom filter is a space-efficient probabilistic data structure used to test whether an element is a member of a set. False positive matches are possible, but false negatives are not. A query returns either "possibly in set" or "definitely not in set."

布隆过滤器是一种空间概率数据结构用来测试是否一个元素是一组一员。假阳性比赛是可能的,但假阴性.一个查询返回设置“可能”或“绝对不是在集合。”


The bloom filter data structure has a wide variety of uses in both online and offline services, including big data analytics. Facebook uses bloom filters for typeahead searches, to fetch friends and friends of friends to a user-typed query. Apache HBase uses it to filter out disk reads of HFile blocks that don't contain a particular row or column, thus boosting the speed of reads. Bitly uses a bloom filter to avoid redirecting users to malicious websites, and Quora implemented a sharded bloom filter in the feed backend to filter out previously viewed stories. In my own project, I applied a bloom filter to track user votes on different subjects.

布隆过滤器的数据结构都有各种各样的用途线上和线下服务,包括大数据分析.Facebook使用布鲁姆过滤器typeahead搜索,获取用户输入的查询的朋友和朋友的朋友.Apache HBase使用它过滤掉磁盘读取HFile块不包含一个特定的行或列,从而提高阅读的速度.Bitly的使用布隆过滤器来避免重定向用户恶意网站,和Quora在进料端实现分片布鲁姆过滤器过滤掉先前认为的故事.在我的项目中,我应用了布隆过滤器来跟踪用户投票在不同科目。


With its speed and throughput, Redis combines exceptionally well with a bloom filter. Searching GitHub turns up many Redis bloom filter projects, some of which support tunable precision.

与throughput合并,重申高速和exceptionally美好生活”a bloom过滤。GitHub Searching turns up many重申bloom滤波器projects,tunable精密媒介。


6. Efficient global notifications: Publish/subscribe channels

6. 有效的全局通知:发布/订阅频道



A Redis publish/subscribe channel works like a fan-out messaging system, or a topic in JMS semantics. A difference between a JMS topic and a Redis pub/sub channel is that messages published through Redis are not durable. Once a message is pushed to all the connected clients, the message is removed from Redis. In other words, subscribers must stay online to accept new messages. Typical use cases for Redis pub/sub channels include realtime configuration distribution, simple chat server, etc.

Redis,发布/订阅频道作品像一扇出的消息传递系统,或在JMS主题语义.JMS主题的区别和Redis,pub / sub频道发表的消息通过Redis,不耐用.一旦消息被推到所有连接的客户端,将消息从Redis,删除。换句话说,用户必须保持在线接受新信息.典型用例Redis,pub / sub渠道包括实时配置分布,简单的聊天服务器,等等。


In a web server cluster, each node can be a subscriber to a Redis pub/sub channel. A message published to the channel is pushed instantaneously to all the connected nodes. This message could be a configuration change or a global notification to all online users. Obviously this push communication model is extremely efficient compared with constant polling.

在一个web服务器集群中,每个节点可以Redis,发布/订阅频道的用户。一条消息发布到通道是瞬间推到所有连接节点.这个消息可能是配置更改或全局通知给所有在线用户。显然这推动通信模型非常有效而持续不断的轮询。


Performance optimizing Redis

性能优化Redis,


Redis is extremely powerful, and it can be optimized both generally and for specific programming scenarios. Consider the following techniques.

Redis是非常强大的,它可以优化一般和特定的编程场景。考虑以下技术。


Time-to-live

生存时间


All Redis data structures have a time-to-live (TTL) attribute. When you set this attribute, the data structure will be removed automatically after it expires. Making good use of this feature will keep memory consumption low in Redis.

所有的Redis,数据结构有一个time - to - live(TTL)属性。当你设定这个属性,数据结构将被删除后自动失效.能更好的利用这个特性将在Redis,保持低内存消耗。


Pipelining

流水线


Sending multiple commands to Redis in a single request is called pipelining. This technique saves cost on network round-trips, which is important because network latency could be orders of magnitude higher than Redis latency. But there is a catch: the list of Redis commands inside a pipeline must be pre-determined and independent from each other. Pipelining doesn't work if one command's arguments are computed from the results of preceding commands. Listing 5 shows an example of Redis pipelining.

发送多个命令Redis,在一个单一的请求被称为流水线.这种技术可以节省成本网络流量,这很重要,因为网络延迟可能是数量级高于Redis,延迟.但是有一个问题:Redis,命令的列表内管道必须预先确定和独立于彼此.流水线不工作如果一个命令的参数计算的结果之前的命令。清单5显示了Redis,流水线的一个例子。


> Listing 5. Pipelining

> 清单5。流水线



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

Redis,支持主从复制配置。如MongoDB,副本是不对称的,设置为从节点是只读的分享阅读工作负载.正如我所提到的在本文的开始,也有可能实现分片规模Redis,吞吐量和内存容量.事实上,Redis是如此强大以至于亚马逊内部基准测试显示一个EC2实例类型的r3.4xlarge容易每秒处理100000个请求.一些非正式报告了每秒700000个请求作为基准。对于中小型应用程序,您通常不需要麻烦Redis,分片.(见更多关于性能优化的基本Redis,在行动和分片Redis)。


Transactions in Redis

交易Redis,


Although Redis doesn't support full ACID transaction like an RDBMS does, its own flavor of transaction is quite effective. In essence, a Redis transaction is a combination of pipelining, optimistic locking, commits, and rollbacks. The idea is to execute a list of commands in a pipeline, then watch for possible updates on a critical record (optimistic lock). Depending on whether or not the watched record is updated by another process, the list of commands will either commit as a whole or roll back entirely.

虽然Redis,RDBMS支持完整的ACID事务不像,自己的口味事务是很有效的.从本质上讲,流水线的Redis,事务是一个组合,乐观锁定,提交和回滚.这个想法是为了执行一个管道的命令列表,然后看可能更新关键记录(乐观锁).取决于是否看到被另一个过程,记录被更新的列表命令将完全作为一个整体提交或回滚。


As an example, consider seller inventory in an auction website. When a buyer tries to buy an item from a seller, you watch for changes on the seller's inventory inside the Redis transaction. In the meantime, you remove the item from the same inventory. Before the transaction closes, if the inventory was touched by more than one process (for instance, if two buyers purchased the same item at the same moment), the transaction will roll back; otherwise, the transaction will commit. A retry can kick in after a rollback.

作为一个例子,考虑卖方库存在一个拍卖网站。当买方从卖方购买一个项目,你看库存变化对卖方的Redis,事务.与此同时,你把物品从相同的库存.在事务结束之前,如果库存感动了不止一个过程(例如,如果两个买家购买相同的项目在同一时刻),事务将回滚,否则交易将提交。回滚后重试可以踢。


A transaction pitfall in Spring Data Redis

一个事务陷阱在Spring Data Redis


I learned a hard lesson when enabling Redis transactions in the Spring RedisTemplate class redisTemplate.setEnableTransactionSupport(true);: Redis started returning junk data after running for a few days, causing serious data corruption. A similar case was reported on StackOverflow.

我得到了沉痛的教训,使Redis,事务在春天RedisTemplate RedisTemplate类.setEnableTransactionSupport(真正);:Redis,开始返回垃圾数据运行几天后,导致严重的数据损坏。StackOverflow类似的案例被报道。


By running a monitor command, my team discovered that after a Redis operation or RedisCallback, Spring doesn't close the Redis connection automatically, as it should do. Reusing an unclosed connection may return junk data from an unexpected key in Redis. Interestingly, this issue doesn't show up when transaction support is set to false in RedisTemplate.

通过运行监控命令,我的团队发现Redis,操作或RedisCallback之后,春天不会自动关闭Redis,连接,因为它应该做的.重用一个打开的连接可能返回垃圾数据在Redis一个意想不到的关键。有趣的是,这个问题没有出现在RedisTemplate当事务支持设置为false。


We discovered that we could make Spring close Redis connections automatically by configuring a PlatformTransactionManager (such as DataSourceTransactionManager) in the Spring context, then using the @Transactional annotation to declare the scope of Redis transactions.

我们发现,我们可以让弹簧关闭Redis,连接自动配置PlatformTransactionManager在Spring上下文(比如DataSourceTransactionManager),然后使用@ transactional注释来声明Redis,交易的范围。


Based on this experience, we believe it's good practice to configure two separate RedisTemplates in the Spring context: One with transaction set to false is used on most Redis operations; the other with transaction enabled is only applied to Redis transactions. Of course PlatformTransactionManager and @Transactional must be declared to prevent junk values from being returned.

根据这一经验,我们认为这是好的做法配置两个独立RedisTemplates在Spring上下文:使用一个事务设置为false大多数Redis操作;另一个启用了事务是只应用于Redis,交易.当然PlatformTransactionManager和@ transactional必须声明,以防止垃圾值被返回。


Moreover, we learned the downside of mixing a Redis transaction with a relational database transaction, in this case JDBC. Mixed transactions do not behave as you would expect.

此外,我们学会了混合的缺点Redis,事务与关系数据库事务,在这种情况下JDBC。混合事务并没有表现得如你所愿。


Conclusion

结论


With this article I've hoped to introduce other Java enterprise developers to the power of Redis, particularly when used as a remote data cache and for volatile data. I've introduced six effective uses cases for Redis, shared a few performance optimizing techniques, and explained how my team at Glu Mobile worked around getting junk data as a result of mis-configured transactions in Spring Data Redis. I hope that this article has piqued your curiosity about Redis NoSQL and offered some pathways for exploring it in your own Java EE systems.

在本文中我希望其他Java企业开发人员介绍Redis的力量,特别是当用作远程数据缓存和不稳定的数据.我介绍了六个有效用例Redis,共享一些性能优化技术,并解释了如何在Glu移动工作让我的团队在春天垃圾数据的错误配置事务数据Redis.我希望这篇文章引起了你的好奇心关于Redis,NoSQL和提供了一些途径探索它在您自己的Java EE系统。


原文链接： [http://www.javaworld.com/article/3062899/big-data/lightning-fast-nosql-with-spring-data-redis.html?page=2](http://www.javaworld.com/article/3062899/big-data/lightning-fast-nosql-with-spring-data-redis.html?page=2)
