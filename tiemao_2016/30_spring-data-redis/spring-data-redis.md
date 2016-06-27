

# Lightning fast NoSQL with Spring Data Redis

## 6 uses cases for Redis in server-side Java applications


A multi-tiered architecture built on top of Java EE presents a powerful server-side programming solution. As a Java EE developer for many years, I've been mostly satisfied with a three-tiered approach for enterprise development: a JPA/Hibernate persistence layer at the bottom, a Spring or EJB application layer in the middle, and a web tier on top. For more complex use cases I've integrated a workflow-driven solution with BPM (business process management), a rules engine like [Drools](http://www.ibm.com/developerworks/library/j-drools5/), and an integration framework such as [Camel](http://www.javaworld.com/article/2078883/open-source-tools/java-tip-write-an-soa-integration-layer-with-apache-camel.html).

Recently, however, I was tasked to design a system supporting hundreds of thousands of concurrent users, with sub-second response latency. I immediately saw the limits of my normal Java EE stack. Conventional RDBMS-based web applications, including those built on Hibernate/JPA, have second-order latency and do not scale well. A traditional Java EE persistence architecture would not meet the performance and throughput requirements for the system I was designing. I turned to NoSQL, and eventually found [Redis](http://redis.io/).

Being an in-memory key-value datastore, Redis breaks from the conventional definition of a database, where data is saved on a hard drive. Instead, it can be used in combination with a persistent NoSQL datastore such as MongoDB, HBase, Cassandra, or DynamoDB. Redis excels as a remote cache server, and is an exceptionally fast datastore for volatile data.

In this article I introduce simple and advanced use cases and performance tuning with Redis. I'll provide a brief overview, but I assume you are basically familiar with NoSQL and the [variety of solutions](http://www.javaworld.com/article/3030214/big-data/open-source-java-projects-apache-phoenix.html) available in that field.

 



### Spring Data Redis

Redis has client libraries for almost every programming language, including Java. [Jedis](https://github.com/xetorthio/jedis) is perhaps the most popular Java client library. Examples in this article are based on [Spring Data Redis](http://docs.spring.io/spring-data/redis/docs/current/reference/html/), which I've used as a higher level wrapper API. Spring Data Redis offers easy configuration, friendly APIs, and useful add-ons.



## Overview of Redis

Like most NoSQL data stores, Redis abandons the relational concepts of tables, rows, and columns. Instead, it is a key-value data store, where each record is stored and retrieved using a unique string key. Redis supports the following built-in data structures as the value of all records:

*   `STRING` holds a single string value.

*   `LIST`, `SET`, and `HASH` are semantically identical to the same data structures in Java.

*   `ZSET` is a list of strings ordered by float-point score, resembling `PriorityQueue` in Java.

Unlike tables in RDBMS, Redis data structures are instantiated on the fly. When you query anything not existing in Redis, it simply returns null. Although Redis doesn't allow nested structures, you can implement a custom Java or JSON serializer/deserializer to map POJOs to strings. In this way, you can save an arbitrary Java bean as a `STRING`, or place it in a `LIST`, a `SET`, and so on.

### Performance and scalability

The first thing you will likely notice about Redis is that it is extremely fast. Performance benchmarks vary based on record size and number of connections, but latency is typically in the single-digit milliseconds. For most use cases, Redis can sustain up to 50,000 requests per second (RPS). If you're using higher end hardware, you could get throughput up to 700,000 RPS (though this number could be throttled by the bandwidth of your NIC cards).

Being an in-memory database, Redis has limited storage; the largest instance in AWS EC2 is r3.8xlarge with 244 GB memory. Due to its indexing and performance-optimized data structures, Redis consumes much more memory than the size of the data stored. Sharding Redis can help overcome this limitation. In order to backup in-memory data to a hard drive, you can do point-in-time dumps in scheduled jobs, or run a `dump` command as needed.

 

## Remote data caching with Spring

Data caching is perhaps the most cost-effective approach for improving application server performance. Enabling data caching is effortless using Spring's cache abstraction annotations: `@Cacheable`, `@CachePut`, `@CacheEvict`, `@Caching`, and `@CacheConfig`. In a Spring configuration, you could use Ehcache, Memcached, or Redis as the underlying cache server.

Ehcache is typically configured as a local cache layer, nested and running on the application's JVM. Memcached or Redis would run as an independent cache server. To integrate a Redis cache into a Spring-based application, you will use the [Spring Data Redis](http://caseyscarborough.com/blog/2014/12/18/caching-data-in-spring-using-redis/) `RedisTemplate` and `RedisCacheManager`.

Accessing cached objects in Redis takes less than a couple of milliseconds in general, which could give you a big boost in application performance when compared to relational database queries.



### Latency and revenue

Amazon relies heavily on cache servers to minimize the latency of its retail websites, and even published a [case study](http://blog.gigaspaces.com/amazon-found-every-100ms-of-latency-cost-them-1-in-sales/) documenting the connection between latency and revenue.



### Local cache vs. remote cache

In a system without network overhead, a local cache is faster than a remote cache. The downside of local caching is that multiple copies of the same object can be out-synced across different nodes in a server cluster. Because of this, a local cache is only suitable for static data, such as systemwide settings where small lags and inconsistencies are tolerable. If you use a local cache for volatile business data, such as user data and transaction data, you will very likely end up running a single instance of the application server.

A remote cache server doesn't have this limitation. Given the same key, it is guaranteed a single copy of the object on the cache server. As long as you keep objects in the cache in-sync with their database value, you don't need to deal with stale data.

Listing 1 shows a Spring data caching example.

#### Listing 1\. Enabling caching in Spring-based applications


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

But what if the same object is updated in the database by another process (such as another server node), or even another thread in the same JVM? With just the `@Cacheable` annotation employed, you might receive a stale copy from the remote cache server.

To prevent this from happening, you could add a `@CachePut` annotation to all database update operations. Every time these methods are invoked, the return value replaces the old object in the remote cache. Updating the cache on both database reads and writes keeps the records in-sync between the cache server and the backend database.

### Fault tolerance

This sounds perfect, right? Actually, no. With the config in Listing 1 you might not experience any issues under light load, but as you gradually increase the load on the server cluster you will start to see stale data in the remote cache. Be prepared for contention from server nodes, or worse. Even with a successful write in the database, you could end up with a failed `PUT` in the cache server due to a network glitch. Additionally, NoSQL generally doesn't support full transaction semantics in relational databases, which can lead to partial commits. In order to make your code fault tolerant, consider adding a version number for optimistic locking to your data model.

Upon receiving `OptimisticLockingFailureException` or `CurrentModificationException` (depending on your persistence solution), you would call a method annotated with `@CacheEvict` to purge the stale copy from the cache, then retry the same operation:

#### Listing 2\. Resolving stale objects in the cache


	 try{
	    User user = userDao.get(id);    // user fetched in cache server
	    userDao.update(user, oldname, newname);      
	}catch(ConcurrentModificationException ex) {   // cached user object may be stale
	    userDao.evictCache(user);
	    user =  userDao.get(id);     // refresh user object
	    userDao.update(user, oldname, newname);    // retry the same operation. Note it may still throw legitimate ConcurrentModificationException.
	} 




### Using Redis with Elasticache

Amazon Elasticache is an in-memory cache service that can be combined with either Memcached or Redis as a cache server. While Elasticache is out the scope of this article, I'd like to offer a tip to developers using Elasticache with Redis. While we can live with the default values of most Redis parameters, the default Redis settings for `tcp-keepalive` and `timeout` don't remove dead client connections, and could eventually exhaust the sockets on the cache server. Always set these two values explicitly when using Redis with Elasticache.



## Use cases for Redis as a database

Now let's look at a variety of ways that you can use Redis as a database in server-side Java EE systems. Whether the use case is simple or complex, Redis can help you achieve performance, throughput, and latency that would be formidable to a normal Java EE technology stack.

### 1\. Globally unique incremental counter

This is a relatively simple use case to start with: an incremental counter that displays how many hits a website receives. Spring Data Redis offers two classes that you can use for this utility: `RedisAtomicInteger` and `RedisAtomicLong`. Unlike `AtomicInteger` and `AtomicLong` in the Java concurrency package, these Spring classes work across multiple JVMs.

#### Listing 3\. Globally unique increment counter


	 RedisAtomicLong counter = 
	  new RedisAtomicLong("UNIQUE_COUNTER_NAME", redisTemplate.getConnectionFactory()); 
	Long myCounter = counter.incrementAndGet();    // return the incremented value 


Watch out for integer overflow and remember that operations on these two classes are relatively expensive.

### 2\. Global pessimistic lock

From time to time you will need to deal with contention in a server cluster. Say you're running a scheduled job from a server cluster. Without a global lock, nodes in the cluster will launch redundant job instances. In the case of a chat room partition, you might have a capacity of 50\. When that chat room is full, you need to create a new chat room instance to accommodate the next 50.

Detecting a full chat room without a global lock could lead each node in the cluster to create its own chat-room instance, making the whole system unpredictable. Listing 4 shows how to leverage the [SETNX](http://redis.io/commands/SETNX) (**SET** if **N**ot e**X**ists) Redis command to implement a global pessimistic lock.




> Listing 4. Global pessimistic locking


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

3. Bit Mask

Hypothetically a web client needs to poll a web server for client-specific updates against many tables in a database. Blindly querying all these tables for possible updates is costly. To get around this, try saving one integer per client in Redis as a dirty indicator, of which every bit represents one table. A bit is set when there are updates for the client in that table. During polling, no query will be fired on a table unless the corresponding bit is set. Redis is highly efficient in getting and setting such a bit mask as STRING.

4. Leaderboard

Redis's ZSET data structure offers a neat solution for game player leaderboards. ZSET works somewhat like PriorityQueue in Java, where objects are organized in a sorted data structure. Game players may be sorted in terms of their score in a leaderboard. Redis ZSET defines a rich list of commands supporting powerful and nimble queries. For example, ZRANGE (including ZREVRANGE) returns the specified range of elements in the sorted set.

You could use this command to list the top 100 players on a leaderboard. ZRANGEBYSCORE returns the elements within the specified score range (for instance by listing players with score between 1000 and 2000), ZRNK returns the rank of an element in the sorted set, and so forth.



5. Bloom filter

A Bloom filter is a space-efficient probabilistic data structure used to test whether an element is a member of a set. False positive matches are possible, but false negatives are not. A query returns either "possibly in set" or "definitely not in set."

The bloom filter data structure has a wide variety of uses in both online and offline services, including big data analytics. Facebook uses bloom filters for typeahead searches, to fetch friends and friends of friends to a user-typed query. Apache HBase uses it to filter out disk reads of HFile blocks that don't contain a particular row or column, thus boosting the speed of reads. Bitly uses a bloom filter to avoid redirecting users to malicious websites, and Quora implemented a sharded bloom filter in the feed backend to filter out previously viewed stories. In my own project, I applied a bloom filter to track user votes on different subjects.

With its speed and throughput, Redis combines exceptionally well with a bloom filter. Searching GitHub turns up many Redis bloom filter projects, some of which support tunable precision.

6. Efficient global notifications: Publish/subscribe channels

A Redis publish/subscribe channel works like a fan-out messaging system, or a topic in JMS semantics. A difference between a JMS topic and a Redis pub/sub channel is that messages published through Redis are not durable. Once a message is pushed to all the connected clients, the message is removed from Redis. In other words, subscribers must stay online to accept new messages. Typical use cases for Redis pub/sub channels include realtime configuration distribution, simple chat server, etc.

In a web server cluster, each node can be a subscriber to a Redis pub/sub channel. A message published to the channel is pushed instantaneously to all the connected nodes. This message could be a configuration change or a global notification to all online users. Obviously this push communication model is extremely efficient compared with constant polling.

Performance optimizing Redis

Redis is extremely powerful, and it can be optimized both generally and for specific programming scenarios. Consider the following techniques.

Time-to-live

All Redis data structures have a time-to-live (TTL) attribute. When you set this attribute, the data structure will be removed automatically after it expires. Making good use of this feature will keep memory consumption low in Redis.

Pipelining

Sending multiple commands to Redis in a single request is called pipelining. This technique saves cost on network round-trips, which is important because network latency could be orders of magnitude higher than Redis latency. But there is a catch: the list of Redis commands inside a pipeline must be pre-determined and independent from each other. Pipelining doesn't work if one command's arguments are computed from the results of preceding commands. Listing 5 shows an example of Redis pipelining.

> Listing 5. Pipelining


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

Redis supports master-slave replica configuration. Like MongoDB, the replica set is asymmetric, as slave nodes are read-only to share read workloads. As I mentioned at the beginning of this article, it's also possible to implement sharding to scale out Redis throughput and memory capacity. In reality, Redis is so powerful that an internal Amazon benchmark reveals that one EC2 instance of type r3.4xlarge easily handles 100,000 requests per second. Some have informally reported 700,000 requests per second as a benchmark. For small-to-medium applications, you generally will not need to bother with sharding in Redis. (See the essential Redis in Action for more about performance optimization and sharding in Redis.)

Transactions in Redis

Although Redis doesn't support full ACID transaction like an RDBMS does, its own flavor of transaction is quite effective. In essence, a Redis transaction is a combination of pipelining, optimistic locking, commits, and rollbacks. The idea is to execute a list of commands in a pipeline, then watch for possible updates on a critical record (optimistic lock). Depending on whether or not the watched record is updated by another process, the list of commands will either commit as a whole or roll back entirely.

As an example, consider seller inventory in an auction website. When a buyer tries to buy an item from a seller, you watch for changes on the seller's inventory inside the Redis transaction. In the meantime, you remove the item from the same inventory. Before the transaction closes, if the inventory was touched by more than one process (for instance, if two buyers purchased the same item at the same moment), the transaction will roll back; otherwise, the transaction will commit. A retry can kick in after a rollback.

A transaction pitfall in Spring Data Redis

I learned a hard lesson when enabling Redis transactions in the Spring RedisTemplate class redisTemplate.setEnableTransactionSupport(true);: Redis started returning junk data after running for a few days, causing serious data corruption. A similar case was reported on StackOverflow.

By running a monitor command, my team discovered that after a Redis operation or RedisCallback, Spring doesn't close the Redis connection automatically, as it should do. Reusing an unclosed connection may return junk data from an unexpected key in Redis. Interestingly, this issue doesn't show up when transaction support is set to false in RedisTemplate.

We discovered that we could make Spring close Redis connections automatically by configuring a PlatformTransactionManager (such as DataSourceTransactionManager) in the Spring context, then using the @Transactional annotation to declare the scope of Redis transactions.

Based on this experience, we believe it's good practice to configure two separate RedisTemplates in the Spring context: One with transaction set to false is used on most Redis operations; the other with transaction enabled is only applied to Redis transactions. Of course PlatformTransactionManager and @Transactional must be declared to prevent junk values from being returned.

Moreover, we learned the downside of mixing a Redis transaction with a relational database transaction, in this case JDBC. Mixed transactions do not behave as you would expect.

Conclusion

With this article I've hoped to introduce other Java enterprise developers to the power of Redis, particularly when used as a remote data cache and for volatile data. I've introduced six effective uses cases for Redis, shared a few performance optimizing techniques, and explained how my team at Glu Mobile worked around getting junk data as a result of mis-configured transactions in Spring Data Redis. I hope that this article has piqued your curiosity about Redis NoSQL and offered some pathways for exploring it in your own Java EE systems.


原文链接： [http://www.javaworld.com/article/3062899/big-data/lightning-fast-nosql-with-spring-data-redis.html?page=2](http://www.javaworld.com/article/3062899/big-data/lightning-fast-nosql-with-spring-data-redis.html?page=2)














