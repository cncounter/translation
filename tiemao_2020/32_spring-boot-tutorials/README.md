# Spring Boot 实战教程

Spring的官方网站为: <https://spring.io/>

![](spring-logo.svg)


Spring Boot is a Spring framework module which provides RAD (Rapid Application Development) feature to the Spring framework. It is highly dependent on the starter templates feature which is very powerful and works flawlessly.

Spring Boot 是Spring框架的一个模块，提供了快速开发程序的功能(Rapid Application Development)。
高度依赖 starter 模板功能，非常简洁又功能强大，代码结构十分优雅。

## 1. What is starter template?

Spring Boot starters are templates that contain a collection of all the relevant transitive dependencies that are needed to start a particular functionality. For example, If you want to create a Spring WebMVC application then in a traditional setup, you would have included all required dependencies yourself. It leaves the chances of version conflict which ultimately result in more runtime exceptions.

With Spring boot, to create MVC application all you need to import is spring-boot-starter-web dependency.

> pom.xml

```xml
<!-- Parent pom is mandatory to control versions of child dependencies -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.1.6.RELEASE</version>
    <relativePath />
</parent>

<!-- Spring web brings all required dependencies to build web application. -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Above spring-boot-starter-web dependency, internally imports all given dependencies and add to your project. Notice how some dependencies are direct, and some dependencies further refer to other starter templates which transitively downloads more dependencies.

Also, notice that you do not need to provide version information into child dependencies. All versions are resolved in relation to version of parent starter (in our example it’s 2.0.4.RELEASE).


Dependencies brought in by webmvc starter template:


```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-json</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-tomcat</artifactId>
    </dependency>
    <dependency>
        <groupId>org.hibernate.validator</groupId>
        <artifactId>hibernate-validator</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
    </dependency>
</dependencies>
```

Read More : [Spring boot starter templates list](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-starters/)


## 2. Spring boot autoconfiguration

Autoconfiguration is enabled with `@EnableAutoConfiguration` annotation. Spring boot auto configuration scans the classpath, finds the libraries in the classpath and then attempt to guess the best configuration for them, and finally configure all such beans.

Auto-configuration tries to be as intelligent as possible and will back-away as you define more of your own configuration.

Auto-configuration is always applied after user-defined beans have been registered.

Spring boot auto-configuration logic is implemented in spring-boot-autoconfigure.jar. Yoy can verify the [list of packages here](https://docs.spring.io/spring-boot/docs/2.0.4.RELEASE/api/).

For example, look at auto-configuration for Spring AOP. It does the followings-

1. Scan classpath to see if EnableAspectJAutoProxy, Aspect, Advice and AnnotatedElement classes are present.
2. If classes are not present, no autoconfiguration will be made for Spring AOP.
3. If classes are found then AOP is configured with Java config annotation @EnableAspectJAutoProxy.
4. It checks for property spring.aop which value can be true or false.
5. Based on the value of property, proxyTargetClass attribute is set.


> AopAutoConfiguration.java

```java
@Configuration
@ConditionalOnClass({ EnableAspectJAutoProxy.class, Aspect.class, Advice.class,
        AnnotatedElement.class })
@ConditionalOnProperty(prefix = "spring.aop", name = "auto", havingValue = "true", matchIfMissing = true)
public class AopAutoConfiguration
{

    @Configuration
    @EnableAspectJAutoProxy(proxyTargetClass = false)
    @ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "false", matchIfMissing = false)
    public static class JdkDynamicAutoProxyConfiguration {

    }

    @Configuration
    @EnableAspectJAutoProxy(proxyTargetClass = true)
    @ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "true", matchIfMissing = true)
    public static class CglibAutoProxyConfiguration {

    }

}
```

## 3. Embedded server

Spring boot applications always include tomcat as embedded server dependency. It means you can run the Spring boot applications from the command prompt without needling complex server infrastructure.

You can exclude tomcat and include any other embedded server if you want. Or you can make exclude server environment altogether. It’s all configuration based.

For example, below configuration exclude tomcat and include jetty as embedded server.


```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
```

## 4. Bootstrap the application

To run the application, we need to use `@SpringBootApplication` annotation. Behind the scenes, that’s equivalent to `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan` together.

It enables the scanning of config classes, files and load them into spring context. In below example, execution start with main() method. It start loading all the config files, configure them and bootstrap the application based on application properties in application.properties file in /resources folder.

> MyApplication.java

```java
@SpringBootApplication
public class MyApplication
{
    public static void main(String[] args)
    {
        SpringApplication.run(Application.class, args);
    }
}
```

> application.properties

```shell
### Server port #########
server.port=8080

### Context root ########
server.contextPath=/home
```

To execute the application, you can run the main() method from IDE such eclipse, or you can build the jar file and execute from command prompt.

Console:

```shell
$ java -jar spring-boot-demo.jar
```

## 5. Advantages of Spring boot

- Spring boot helps in resolving dependency conflict. It identifies required dependencies and import them for you.
- It has information of compatible version for all dependencies. It minimizes the runtime classloader issues.
- It’s “opinionated defaults configuration” approach helps you in configuring most important pieces behind the scene. Override them only when you need. Otherwise everything just works, perfectly. It helps in avoiding boilerplate code, annotations and XML configurations.
- It provides embedded HTTP server Tomcat so that you can develop and test quickly.
- It has excellent integration with IDEs like eclipse and intelliJ idea.





- [Spring Boot Tutorial](https://howtodoinjava.com/spring-boot-tutorials/)
- [How to Configure Spring Boot Tomcat](https://www.baeldung.com/spring-boot-configure-tomcat)
- [How to Embedded Web Servers](https://docs.spring.io/spring-boot/docs/2.1.9.RELEASE/reference/html/howto-embedded-web-servers.html)
