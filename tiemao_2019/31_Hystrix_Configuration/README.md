# Hystrix Configuration



实例:

```
```


Hystrix默认的属性配置工具是Archaius。

每个属性都有4种取值方式：

- 1. 全局默认配置，也就是硬编码的默认值。
- 2. properties 文件配置的全局 default 属性
- 3. 代码方式配置HystrixCommandProperties
- 4. 指定HystrixCommandKey并设置这个名称下的属性

这4种取值方式的优先级依次递增，看有哪一个最匹配。


## 1. 运行模式

HystrixCommand 支持两种模式:

- `THREAD` — 单独开线程来执行注解的方法，注意因为是新线程，可能原来线程的ThreadLocal等取不到值, 修改并发线程数需要配置 thread-pool。
- `SEMAPHORE` — 在原来的线程上执行, 并发数由 semaphore count 配置。

官方默认推荐的是 `THREAD` 模式。 适合大部分场景, 但可能造成线程浪费什么的，并不适用于高并发场景，如果再有点框架限制的话，就只能使用 `SEMAPHORE` 模式了。

默认配置:

```
hystrix.command.default.execution.isolation.strategy: THREAD
```

如果自己定义的 `commandKey=XXX`, 配置时把 `default` 替换为 `XXX` 即可, 其他配置以此类推。


## 2. 超时

超过设置的时间, Hystrix 就会将对应的请求标记为超时，然后调用降级方法(fallbackMethod)。 注意降级方法的参数，必须和 `@HystrixCommand` 注解的方法一致。


### 2.1 启用超时配置

默认是开启的:

```
hystrix.command.default.execution.timeout.enabled: true
```

### 2.2 超时时间配置


默认配置:

```
hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds: 1000
```

比如在注解的方法中执行了 `TimeUnit.MILLISECONDS.sleep(999)`, 如果超过限制就会执行降级， 给调用方的返回值也会使用降级方法的返回值。

问题来了， 调用降级方法时, 原先的方法执行到一半，要怎么处理呢?

如果使用 `THREAD` 模式, 则可以配置超时中断，见下文。

如果使用 `SEMAPHORE` 模式, 又达到了超时时间，那么 Hystrix 是没办法中断原来的线程的， 只是在新线程中执行 fallback 并返回。

所以官方说 `SEMAPHORE` 这种模式只适合高并发并且响应非常迅速的场景。 使用不当可能出现莫名其妙的情况:
如果有网络请求等耗时操作，原操作执行到一半却因为默认的超时(1000ms)掉进了 fallback 方法，告诉调用方失败了，实际上却执行成功了。


### 2.3 超时是否中断原方法执行

> 注意: 此配置只支持 `THREAD` 模式

在超时发生时是否打断原线程的执行。 实际上就是给执行线程发送中断信号, 会抛出 `InterruptedException` 异常.

默认配置:

```
hystrix.command.default.execution.isolation.thread.interruptOnTimeout: true
```

如果使用的是 `SEMAPHORE` 模式, 那没办法了，自己写代码进行线程间通信之类的操作吧。


### 2.4 取消任务是否中断原方法执行

默认配置:

```
hystrix.command.default.execution.isolation.thread.interruptOnCancel
```


## 3. 设置并发数

使用 `SEMAPHORE` 模式，配置最大并发数。 也就是允许同时进入注解方法的请求数。


默认配置:

```
hystrix.command.default.execution.isolation.semaphore.maxConcurrentRequests: 10
```

不能进入的请求，直接执行 fallback 降级方法。

如果使用 `THREAD` 模式, 则需要配置线程池来限制并发线程数。


## 4. 设置线程池

线程池可以配置:

核心线程数量.


默认配置:

```
hystrix.threadpool.default.coreSize: 10
```

1.5.9 版本增加了配置, 最大线程数量.

默认配置:

```
hystrix.threadpool.default.maximumSize: 10
```

需要 `maximumSize` 生效，还需要允许 `maximumSize` 和 `coreSize` 不一致, 配置 `allowMaximumSizeToDivergeFromCoreSize=true` 才行:

默认配置:

```
hystrix.threadpool.default.allowMaximumSizeToDivergeFromCoreSize: false
```

如果 `maximumSize` 大于 `coreSize`, 可以配置线程的最小存活时间。

默认配置:

```
hystrix.threadpool.default.keepAliveTimeMinutes=1
```

最大的阻塞队列长度:

```
hystrix.threadpool.default.maxQueueSize: -1
```

队列中超过此阈值直接拒绝：

```
hystrix.threadpool.default.queueSizeRejectionThreshold: 5
```








<https://github.com/Netflix/Hystrix/wiki/Configuration>
