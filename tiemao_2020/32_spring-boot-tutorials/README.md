# Spring Boot 实战教程

Spring的官方网站为: <https://spring.io/>

![](spring-logo.svg)


Spring Boot is a Spring framework module which provides RAD (Rapid Application Development) feature to the Spring framework. It is highly dependent on the starter templates feature which is very powerful and works flawlessly.

Spring Boot 是Spring框架的一个模块，提供了快速开发程序的功能(Rapid Application Development)。
高度依赖 starter 模板功能，非常简洁又功能强大，代码结构十分优雅。

## 1. What is starter template? (什么是 starter 模板？)

Spring Boot starters are templates that contain a collection of all the relevant transitive dependencies that are needed to start a particular functionality. For example, If you want to create a Spring WebMVC application then in a traditional setup, you would have included all required dependencies yourself. It leaves the chances of version conflict which ultimately result in more runtime exceptions.

Spring Boot starter 是一种模板，其中包含了启用某个特定功能所需的全部相关传递依赖。举例来说，如果想创建一个 Spring WebMVC 应用，按照传统方式，你需要自己引入所有必需的依赖，这样就可能出现版本冲突，最终导致更多的运行时异常。

With Spring boot, to create MVC application all you need to import is spring-boot-starter-web dependency.

而使用 Spring Boot，要创建 MVC 应用，只需引入 spring-boot-starter-web 这一个依赖即可。

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

上面的 spring-boot-starter-web 依赖，会在内部引入上面列出的所有依赖并添加到你的项目中。注意其中一些是直接依赖，另一些还会进一步引用其他的 starter 模板，进而以传递的方式下载更多依赖。

Also, notice that you do not need to provide version information into child dependencies. All versions are resolved in relation to version of parent starter (in our example it’s 2.0.4.RELEASE).

另外注意，子依赖不需要指定版本信息。所有版本都会相对于父 starter 的版本来解析(在我们的示例中是 2.0.4.RELEASE)。


Dependencies brought in by webmvc starter template:

webmvc starter 模板引入的依赖如下：


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


## 2. Spring boot autoconfiguration (Spring Boot 自动配置)

Autoconfiguration is enabled with `@EnableAutoConfiguration` annotation. Spring boot auto configuration scans the classpath, finds the libraries in the classpath and then attempt to guess the best configuration for them, and finally configure all such beans.

自动配置通过 `@EnableAutoConfiguration` 注解开启。Spring Boot 的自动配置会扫描 classpath，找到其中的类库，然后尝试为它们推测出最佳配置，最后把这类 bean 全部配置好。

Auto-configuration tries to be as intelligent as possible and will back-away as you define more of your own configuration.

自动配置会尽可能做得智能：你自己定义的配置越多，它退出的地方就越多。

Auto-configuration is always applied after user-defined beans have been registered.

自动配置总是在用户自定义的 bean 注册完成之后才生效。

Spring boot auto-configuration logic is implemented in spring-boot-autoconfigure.jar. Yoy can verify the [list of packages here](https://docs.spring.io/spring-boot/docs/2.0.4.RELEASE/api/).

Spring Boot 自动配置的逻辑实现在 spring-boot-autoconfigure.jar 中。可以在这里查看[相关包的列表](https://docs.spring.io/spring-boot/docs/2.0.4.RELEASE/api/)。

For example, look at auto-configuration for Spring AOP. It does the followings-

例如，看看 Spring AOP 的自动配置，它会做以下几件事：

1. Scan classpath to see if EnableAspectJAutoProxy, Aspect, Advice and AnnotatedElement classes are present.
2. If classes are not present, no autoconfiguration will be made for Spring AOP.
3. If classes are found then AOP is configured with Java config annotation @EnableAspectJAutoProxy.
4. It checks for property spring.aop which value can be true or false.
5. Based on the value of property, proxyTargetClass attribute is set.

1. 扫描 classpath，检查 EnableAspectJAutoProxy、Aspect、Advice 和 AnnotatedElement 这些类是否存在。
2. 如果这些类不存在，就不会为 Spring AOP 做任何自动配置。
3. 如果找到了这些类，就使用 Java 配置注解 @EnableAspectJAutoProxy 来配置 AOP。
4. 接着检查 spring.aop 属性，其取值可以是 true 或 false。
5. 再根据该属性的值来设置 proxyTargetClass 特性。


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

## 3. Embedded server (内嵌服务器)

Spring boot applications always include tomcat as embedded server dependency. It means you can run the Spring boot applications from the command prompt without needling complex server infrastructure.

Spring Boot 应用总是把 tomcat 作为内嵌服务器依赖引入。这意味着你可以直接从命令行运行 Spring Boot 应用，而不需要复杂的服务器基础设施。

You can exclude tomcat and include any other embedded server if you want. Or you can make exclude server environment altogether. It’s all configuration based.

如果有需要，你可以排除 tomcat，换用其他内嵌服务器；也可以把服务器环境完全排除掉。这一切都是基于配置来完成的。

For example, below configuration exclude tomcat and include jetty as embedded server.

例如，下面的配置排除了 tomcat，改用 jetty 作为内嵌服务器。


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

## 4. Bootstrap the application (引导启动应用)

To run the application, we need to use `@SpringBootApplication` annotation. Behind the scenes, that’s equivalent to `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan` together.

要运行应用，需要使用 `@SpringBootApplication` 注解。它实际上等价于 `@Configuration`、`@EnableAutoConfiguration` 和 `@ComponentScan` 三者的组合。

It enables the scanning of config classes, files and load them into spring context. In below example, execution start with main() method. It start loading all the config files, configure them and bootstrap the application based on application properties in application.properties file in /resources folder.

它会开启对配置类和配置文件的扫描，并把它们加载到 Spring 上下文中。在下面的示例中，执行从 main() 方法开始：先加载所有配置文件并进行配置，然后根据 /resources 目录下 application.properties 文件中的应用属性来引导启动应用。

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

要执行应用，可以在 eclipse 之类的 IDE 中直接运行 main() 方法，也可以构建出 jar 文件后从命令行执行。

Console:

控制台输出：

```shell
$ java -jar spring-boot-demo.jar
```

## 5. Advantages of Spring boot (Spring Boot 的优点)

- Spring boot helps in resolving dependency conflict. It identifies required dependencies and import them for you.
- It has information of compatible version for all dependencies. It minimizes the runtime classloader issues.
- It’s “opinionated defaults configuration” approach helps you in configuring most important pieces behind the scene. Override them only when you need. Otherwise everything just works, perfectly. It helps in avoiding boilerplate code, annotations and XML configurations.
- It provides embedded HTTP server Tomcat so that you can develop and test quickly.
- It has excellent integration with IDEs like eclipse and intelliJ idea.

- Spring Boot 帮助解决依赖冲突：它会识别出所需的依赖并替你引入。
- 它掌握所有依赖的兼容版本信息，能尽量减少运行时的类加载器问题。
- 它采用"约定优先的默认配置(opinionated defaults configuration)"方式，在幕后帮你配置好最重要的部分。只在需要时才去覆盖，否则一切都开箱即用、运行良好。这有助于避免样板代码、注解和 XML 配置。
- 它提供了内嵌的 HTTP 服务器 Tomcat，让你可以快速开发和测试。
- 它与 eclipse、intelliJ idea 等 IDE 集成得非常好。





- [Spring Boot Tutorial](https://howtodoinjava.com/spring-boot-tutorials/)
- [How to Configure Spring Boot Tomcat](https://www.baeldung.com/spring-boot-configure-tomcat)
- [How to Embedded Web Servers](https://docs.spring.io/spring-boot/docs/2.1.9.RELEASE/reference/html/howto-embedded-web-servers.html)
