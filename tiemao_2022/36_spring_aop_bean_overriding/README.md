# spring AOP与Bean名称冲突

## 背景

一个应用迁移到Apollo时, 因为使用了二方封装的starter, 出现了一个错误:

```c
The bean 'refreshScope', defined in class path resource
  [org/springframework/cloud/autoconfigure/RefreshAutoConfiguration.class], 
  could not be registered. 
A bean with that name has already been defined in class path resource
  [com/xxx/apollo/spring/autoconfigure/RefreshAutoConfiguration.class]
  and overriding is disabled.
```

## 排查

网上搜索各种资料, 找到了一篇文章: [The BeanDefinitionOverrideException in Spring Boot](https://www.baeldung.com/spring-boot-bean-definition-override-exception)

看完感觉很有用, 而且有很大帮助。


## 文章内容








## 解决方法

其实是一个低级错误,  如果排查 `target` 目录应该能快速定位问题。

`<resource>` 的 `<directory>` 中不要使用 `/src/main/resources.apollo`, 改为相对路径: `src/main/resources.apollo`;

```xml
    <profiles>
        <profile>
            <id>apollo</id>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
            <dependencies>
                <dependency>
                    <groupId>com.cncounter.web</groupId>
                    <artifactId>cncounter-apollo-starter</artifactId>
                </dependency>
            </dependencies>
            <build>
                <resources>
                    <resource>
                        <directory>src/main/resources</directory>
                    </resource>
                    <resource>
                        <directory>src/main/resources.apollo</directory>
                    </resource>
                </resources>
            </build>
        </profile>
        <!-- ....... 其他 profile -->
    </profiles>
```



## 结论











- [The BeanDefinitionOverrideException in Spring Boot](https://www.baeldung.com/spring-boot-bean-definition-override-exception)
- [Introduction to Advice Types in Spring](https://www.baeldung.com/spring-aop-advice-tutorial)
- [Introduction to Pointcut Expressions in Spring](https://www.baeldung.com/spring-aop-pointcut-tutorial)
- [5. Aspect Oriented Programming with Spring](https://docs.spring.io/spring-framework/docs/5.2.5.RELEASE/spring-framework-reference/core.html#aop)
