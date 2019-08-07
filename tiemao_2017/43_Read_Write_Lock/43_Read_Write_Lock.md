
读写锁
==

读写锁的特性:

1. 多个读锁可以共存, 不互斥
2. 写锁（的钥匙）只能同时存在1个, 也就是互斥。
3. 有写锁的时候, 不能存在读锁。 反之也成立。
4. 同一个线程, 读锁可以升级成写锁, 但需要满足前面的条件。
5. 当然,也可以直接申请获得写锁, 需要满足前面的条件。

推导场景:

1. 如果某个线程写锁没释放,则其他线程不能获得读锁，也不能获得写锁。
2. 如果




创建语法如下:

```
ReadWriteLock locks = new ReentrantReadWriteLock();
```






官方说明文档如下:

> ReadWriteLock


- <./ReadWriteLock.md>

- <./ReentrantReadWriteLock.md>
