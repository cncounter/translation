# 类型转换异常特殊情形 - 实现类的对象转换为接口类型报错


## 判断类是否实现了某个接口

- check-class-implements-interface: [https://www.baeldung.com/java-check-class-implements-interface](https://www.baeldung.com/java-check-class-implements-interface)



## 类型转换异常



- classcastexception: [https://www.baeldung.com/java-classcastexception](https://www.baeldung.com/java-classcastexception)






## 案例

有个项目使用了开源的LTS定时任务调度:

- [https://gitee.com/hugui/light-task-scheduler](https://gitee.com/hugui/light-task-scheduler)

在从JDK8 升级到JDK11的过程中遇到了一系列问题。


比如 blockedOn 问题, 这个是JDK内部类名切换导致的: 

```java
        //sun.misc.SharedSecrets.getJavaLangAccess().blockedOn(Thread.currentThread(), interruptible);
        jdk.internal.access.SharedSecrets.getJavaLangAccess().blockedOn(interruptible);
```

以及 jaxb 报错问题, 这是由于JDK9之后, 默认移除了 JAXB 依赖导致的问题, MAVEN加上以下依赖解决:

```xml
        <dependency>
            <groupId>javax.xml.bind</groupId>
            <artifactId>jaxb-api</artifactId>
            <version>2.2.11</version>
        </dependency>
        <dependency>
            <groupId>com.sun.xml.bind</groupId>
            <artifactId>jaxb-core</artifactId>
            <version>2.2.11</version>
        </dependency>
        <dependency>
            <groupId>com.sun.xml.bind</groupId>
            <artifactId>jaxb-impl</artifactId>
            <version>2.2.11</version>
        </dependency>
        <dependency>
            <groupId>javax.activation</groupId>
            <artifactId>activation</artifactId>
            <version>1.1.1</version>
        </dependency>

```

参考:  [JAXB (with Java 11) - Tutorial](https://www.vogella.com/tutorials/JAXB/article.html)


还有今天的主题,  类加载器问题, 主要原因是:

- 父类由上层Classloader加载
- 之类由下层ClassLoader加载

导致类型转换问题.


```java

// 第一组 类和接口
@SPI(key = ExtConfig.JDBC_DATASOURCE_PROVIDER, dftValue = "mysql")
public interface DataSourceProvider {
    DataSource getDataSource(Config config);
}

public class MysqlDataSourceProvider implements DataSourceProvider {
}

// 第2组雷和接口
@SPI(key = ExtConfig.EVENT_CENTER, dftValue = "injvm")
public interface EventCenter {
}

//...
public class InjvmEventCenter implements EventCenter {
}

// 调用服务加载类
DataSourceProvider dataSourceProvider = ServiceLoader.load(DataSourceProvider.class, config);
ServiceLoader.load(EventCenter.class, config);

// 服务加载类的实现
public class ServiceLoader {
    public static <T> T load(Class<T> clazz, Config config) {
        ServiceProvider serviceProvider = getServiceProvider(clazz);
        String dynamicServiceName = config.getParameter(serviceProvider.dynamicConfigKey);
        String identity = config.getIdentity();
        if(StringUtils.isEmpty(identity)){
            throw new IllegalArgumentException("config.identity should not be null");
        }
        return load(clazz, dynamicServiceName, identity);
    }

    @SuppressWarnings("unchecked")
    public static <T> T load(Class<T> clazz, String name, String identity) {
        Object obj = null;
        try {
            ServiceProvider serviceProvider = getServiceProvider(clazz);
            if (StringUtils.isEmpty(name)) {
                // 加载默认的
                name = serviceProvider.defaultName;
            }
            ServiceDefinition definition = serviceProvider.nameMaps.get(name);
            if (definition == null) {
                throw new IllegalStateException("Service loader could not load name:" + name + "  class:" + clazz.getName() + "'s ServiceProvider from '" + LTS_DIRECTORY + "' or '" + LTS_INTERNAL_DIRECTORY + "' It may be empty or does not exist.");
            }

            // 用来保证每个节点都是一个各自的对象
            IdentityUniqueKey uniqueKey = new IdentityUniqueKey(identity, definition);

            obj = cachedObjectMap.get(uniqueKey);
            if (obj != null) {
                return (T) obj;
            }
            synchronized (definition) {
                obj = cachedObjectMap.get(uniqueKey);
                if (obj != null) {
                    return (T) obj;
                }
                String className = definition.clazz;
                // !!!! 这里两个 classLoader 不一致...........
                ClassLoader classLoader = definition.classLoader;
                //ClassLoader classLoader = clazz.getClassLoader();
                obj = (ClassLoaderUtil.newInstance(classLoader, className));
                // T srv = clazz.cast(ClassLoaderUtil.newInstance(classLoader, className));
                // !!!!!! 这里抛异常
                T srv = clazz.cast(obj);
                cachedObjectMap.putIfAbsent(uniqueKey, srv);
                return srv;
            }
        } catch (Exception e) {
            System.out.println("=========");
            System.out.println("clazz.getName(): " + clazz.getName());
            System.out.println("clazz.isInstance(obj): " + clazz.isInstance(obj));
            System.out.println("clazz.loader: " + clazz.getClassLoader());
            System.out.println("obj.class: " + obj.getClass().getName());
            System.out.println("obj.class.loader: " + obj.getClass().getClassLoader());
            e.printStackTrace();
            System.out.println("=========");
            throw new IllegalStateException("Service loader could ...", e);
        }
    }
}
```

报错示例1:

```java

=========
clazz.getName(): com.github.ltsopensource.store.jdbc.datasource.DataSourceProvider
clazz.isInstance(obj): false
clazz.loader: ContextLoader@LTS Admin
obj.class: com.github.ltsopensource.store.jdbc.datasource.MysqlDataSourceProvider
obj.class.loader: jdk.internal.loader.ClassLoaders$AppClassLoader@4b85612c
java.lang.ClassCastException: Cannot cast 
   com.github.ltsopensource.store.jdbc.datasource.MysqlDataSourceProvider
   to com.github.ltsopensource.store.jdbc.datasource.DataSourceProvider
        at java.base/java.lang.Class.cast(Class.java:3605)
        at com.github.ltsopensource.core.spi.ServiceLoader.load(ServiceLoader.java:102)
        at com.github.ltsopensource.core.spi.ServiceLoader.load(ServiceLoader.java:40)
        at com.github.ltsopensource.store.jdbc.SqlTemplateFactory.create(SqlTemplateFactory.java:21)
        at com.github.ltsopensource.store.jdbc.JdbcAbstractAccess.<init>(JdbcAbstractAccess.java:23)
        at com.github.ltsopensource.monitor.access.mysql.MysqlAbstractJdbcAccess.<init>(MysqlAbstractJdbcAccess.java:12)
        at com.github.ltsopensource.monitor.access.mysql.MysqlJobTrackerMAccess.<init>(MysqlJobTrackerMAccess.java:16)
        at com.github.ltsopensource.monitor.access.mysql.MysqlMonitorAccessFactory.getJobTrackerMAccess(MysqlMonitorAccessFactory.java:14)
        at com.github.ltsopensource.monitor.MonitorAgent.intConfig(MonitorAgent.java:124)
        at com.github.ltsopensource.monitor.MonitorAgent.start(MonitorAgent.java:60)
        at com.github.ltsopensource.monitor.MonitorAgentStartup.start(MonitorAgentStartup.java:42)
        at com.github.ltsopensource.admin.support.SystemInitListener.contextInitialized(SystemInitListener.java:60)
        ...
        at org.mortbay.jetty.Server.doStart(Server.java:224)
        at org.mortbay.component.AbstractLifeCycle.start(AbstractLifeCycle.java:50)
        at com.github.ltsopensource.startup.admin.JettyContainer.main(JettyContainer.java:50)

Caused by: java.lang.ClassCastException: Cannot cast com.github.ltsopensource.store.jdbc.datasource.MysqlDataSourceProvider to com.github.ltsopensource.store.jdbc.datasource.DataSourceProvider
        at java.base/java.lang.Class.cast(Class.java:3605)

=========

```


报错示例2:

```java
=========
clazz.getName(): com.github.ltsopensource.ec.EventCenter
clazz.isInstance(obj): false
clazz.loader: ContextLoader@LTS Admin
obj.class: com.github.ltsopensource.ec.injvm.InjvmEventCenter
obj.class.loader: jdk.internal.loader.ClassLoaders$AppClassLoader@4b85612c
java.lang.ClassCastException: 
  Cannot cast com.github.ltsopensource.ec.injvm.InjvmEventCenter
           to com.github.ltsopensource.ec.EventCenter

        at java.base/java.lang.Class.cast(Class.java:3605)
        at com.github.ltsopensource.core.spi.ServiceLoader.load(ServiceLoader.java:102)
        at com.github.ltsopensource.core.spi.ServiceLoader.load(ServiceLoader.java:40)
        at com.github.ltsopensource.admin.support.BackendAppContextFactoryBean.afterPropertiesSet(BackendAppContextFactoryBean.java:76)
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods
        ...
        at org.mortbay.jetty.Server.doStart(Server.java:224)
        at org.mortbay.component.AbstractLifeCycle.start(AbstractLifeCycle.java:50)
        at com.github.ltsopensource.startup.admin.JettyContainer.main(JettyContainer.java:50)
=========

```

更古老的报错信息为:

```java
Caused by: java.lang.ClassCastException: 
  class com.github.ltsopensource.ec.injvm.InjvmEventCenter 
  cannot be cast to 
  class com.github.ltsopensource.ec.EventCenter
   (com.github.ltsopensource.ec.injvm.InjvmEventCenter
      is in unnamed module of loader 'app'; 
    com.github.ltsopensource.ec.EventCenter
      is in unnamed module of loader
       org.mortbay.jetty.webapp.WebAppClassLoader @ed9d034)
```


## 解决方案

根据日志分析信息, 可以得知是 obj 和 clazz 的 classloader 不一致导致的类型转换错误.

简单粗暴的修改:

```java
                // 直接使用 clazz 的 ClassLoader;
                //ClassLoader classLoader = definition.classLoader;
                ClassLoader classLoader = clazz.getClassLoader();
```

问题解决。




## 参考链接

- classcastexception: [https://www.baeldung.com/java-classcastexception](https://www.baeldung.com/java-classcastexception)
- check-class-implements-interface: [https://www.baeldung.com/java-check-class-implements-interface](https://www.baeldung.com/java-check-class-implements-interface)

