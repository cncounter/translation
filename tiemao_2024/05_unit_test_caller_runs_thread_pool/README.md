# 让调用者自己干活的特殊线程池

## 1. 相关背景

单元测试时, 我们的某些业务代码可能是在线程池中运行的，可能会出现各种不一致的情况。

这时候可以hack一下, 创建一个调用者直接执行的线程池，避免干扰;

Spring-core之中也有一个对应的同步线程池, 简单任务也可以使用，根据需要确定使用哪个即可:

> `org.springframework.core.task.SyncTaskExecutor implements TaskExecutor { }`

下面我们继承 `ThreadPoolExecutor`, 并创建一个让调用者自己干活的特殊线程池;

## 2. 实现代码

```java


import java.util.concurrent.*;

// 让调用者自己执行的线程池
public class CallerRunsExecutor extends ThreadPoolExecutor {
    public CallerRunsExecutor() {
        super(0, 1, 0, TimeUnit.MILLISECONDS, new ArrayBlockingQueue<Runnable>(1));
    }

    @Override
    public void execute(Runnable command) {
        command.run();
    }

    // 获取实例
    public static CallerRunsExecutor getInstance() {
        return new CallerRunsExecutor();
    }
}

```

## 3. SpringBoot配置实例

在 SpringBoot 对应的 `@Configuration` 配置中对Bean进行hack:

```java

    // 是否是集成测试环境
    public static final AtomicBoolean itEnv = new AtomicBoolean(false);

    @Bean
    public ExecutorService longtimeExecutor() {
        if (itEnv.get()){
            // 是否是集成测试环境
            return CallerRunsExecutor.getInstance();
        }
        return new ThreadPoolExecutor(1, 10,
                60L,
                TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(2),
                new CustomizableThreadFactory("xxxExecutor-"));
    }

```

然后在基础的单元测试代码中对相应的值进行设置:

```java

    @BeforeClass
    public static void initEnv() {
        // ...
        // 是否是集成测试环境
        XXXXConfiguration.itEnv.set(true);

    }
```

如果需要的话，也可以配合 `@ConditionalOnMissingBean(name = "xxxBeanName")` 来定制 Bean 。

- 需要先在Test配置之中创建Bean， 并指定Bean的名字。
- 主配置之中则使用 `@ConditionalOnMissingBean` 注解来指定创建条件，避免冲突。




## 4. 测试代码

这里通过一个main方法来测试:

```java

    public static void main(String[] args) {
        // 测试 execute 方法;
        CallerRunsExecutor.getInstance()
                .execute(new Runnable() {
                    @Override
                    public void run() {
                        System.out.println("execute run in " + Thread.currentThread().getName());
                    }
                });

        // 测试 submit 方法;
        Future<?> future = CallerRunsExecutor.getInstance()
                .submit(new Runnable() {
                    @Override
                    public void run() {
                        System.out.println("submit run in " + Thread.currentThread().getName());
                    }
                });

        try {
            Object result = future.get();
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 正常输出
        System.out.println("main in " + Thread.currentThread().getName());

    }

```

## 5. 测试结果

测试结果为:

> execute run in main
> submit run in main
> main in main

结果符合预期。

应用到我们的单元测试环境之中，也是符合预期的。


## 6. 相关问题

- 1、注意限制使用环境, 不要影响生产;
- 2、需要演示多个线程交互执行的某些代码可能会有问题;

日期: 2024年05月15日
作者: [铁锚 at CSDN](https://blog.csdn.net/renfufei)

