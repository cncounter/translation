# Building an Application with Spring Boot

# Spring Boot示例入门教程

This guide provides a sampling of how [Spring Boot](https://github.com/spring-projects/spring-boot) helps you accelerate and facilitate application development. As you read more Spring Getting Started guides, you will see more use cases for Spring Boot. It is meant to give you a quick taste of Spring Boot. If you want to create your own Spring Boot-based project, visit [Spring Initializr](https://start.spring.io/), fill in your project details, pick your options, and you can download either a Maven build file, or a bundled up project as a zip file.

本文通过示例, 详细介绍如何通过[Spring Boot](https://github.com/spring-projects/spring-boot) 快速开发应用程序。 当然,还可以阅读Spring相关的教程, 来学习更多Spring Boot的用法. 如果想要自己创建一个基于 Spring Boot 的项目, 可以使用 [Spring Initializr](https://start.spring.io/) 工具, 在其中填写项目相关的信息, 勾选相关的配置项, 就可以快速得到Maven构建文件, 或者是项目zip包。

## What you’ll build

## 课程目标

You’ll build a simple web application with Spring Boot and add some useful services to it.

用Spring Boot构建一款简单的web应用项目, 并加入一些常用的服务。

## What you’ll need

## 课前准备

*  A favorite text editor or IDE

* 需要准备好常用的文本编辑器或IDE

*  [JDK 1.8](http://www.oracle.com/technetwork/java/javase/downloads/index.html) or later

* 安装 [JDK 1.8](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 或者更高版本

*  [Gradle 2.3+](http://www.gradle.org/downloads) or [Maven 3.0+](https://maven.apache.org/download.cgi)

* 项目构建工具 [Maven 3.0+](https://maven.apache.org/download.cgi), 或者是 [Gradle 2.3+](http://www.gradle.org/downloads)

*   You can also import the code straight into your IDE:

*  可以从头开始, 也可以将初始工程直接导入 [IntelliJ IDEA](/guides/gs/intellij-idea/)


## How to complete this guide

## 学习步骤

Like most Spring [Getting Started guides](/guides), you can start from scratch and complete each step, or you can bypass basic setup steps that are already familiar to you. Either way, you end up with working code.

和Spring的其他[Getting Started guides](https://spring.io/guides) 类似, 读者可以从头开始一步步完成, 也可以跳过初始阶段, 直接使用现成的代码, 结果都是一样的。

To **start from scratch**, move on to [Build with Gradle](#scratch).

如果想要从头开始, 请略过下面的步骤, 直接下拉到后面的 【使用Maven构建】 小节.

To **skip the basics**, do the following:

下面的步骤可以省略初始化过程, 直接得到初始化之后的项目:

*   [Download](https://github.com/spring-guides/gs-spring-boot/archive/master.zip) and unzip the source repository for this guide, or clone it using [Git](/understanding/Git): `git clone [https://github.com/spring-guides/gs-spring-boot.git](https://github.com/spring-guides/gs-spring-boot.git)`

*   cd into `gs-spring-boot/initial`

*   Jump ahead to [[initial]](#initial).

**When you’re finished**, you can check your results against the code in `gs-spring-boot/complete`.

* 下载 <https://github.com/spring-guides/gs-spring-boot/archive/master.zip> 并解压, 或者通过 [Git](/understanding/Git) clone项目 <https://github.com/spring-guides/gs-spring-boot.git>

* 进入 `gs-spring-boot/initial` 目录

* 参照 [[initial]](#initial) 小节。

完成之后, 可以将你的代码和 `gs-spring-boot/complete` 目录进行比对。

## Build with Maven

## 使用Maven构建


First you set up a basic build script. You can use any build system you like when building apps with Spring, but the code you need to work with [Maven](https://maven.apache.org) is included here. If you’re not familiar with Maven, refer to [Building Java Projects with Maven](/guides/gs/maven).

首先需要创建一个基本的Maven构建脚本。当然也可以使用其他构建工具, 如果使用[Maven](https://maven.apache.org), 请参考本节. 如果对Maven不熟悉, 可以参考 [Building Java Projects with Maven](https://spring.io/guides/gs/maven) 教程。

### Create the directory structure

### 创建目录结构

In a project directory of your choosing, create the following subdirectory structure; for example, with `mkdir -p src/main/java/hello` on *nix systems:

在工作目录下, 创建一个目录作为项目的根目录, 并创建以下的目录结构; 例如,在Linux系统上可以使用`mkdir -p src/main/java/hello` 命令:

```
└── src
    └── main
        └── java
            └── hello
```



`pom.xml` 文件如下所示:



```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.springframework</groupId>
    <artifactId>gs-spring-boot</artifactId>
    <version>0.1.0</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.9.RELEASE</version>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

    <properties>
        <java.version>1.8</java.version>
    </properties>


    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```



The [Spring Boot Maven plugin](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-tools/spring-boot-maven-plugin) provides many convenient features:

[Spring Boot Maven 插件](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-tools/spring-boot-maven-plugin) 提供了许多便捷的特性:

*   It collects all the jars on the classpath and builds a single, runnable "über-jar", which makes it more convenient to execute and transport your service.

*   It searches for the `public static void main()` method to flag as a runnable class.

*   It provides a built-in dependency resolver that sets the version number to match [Spring Boot dependencies](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-dependencies/pom.xml). You can override any version you wish, but it will default to Boot’s chosen set of versions.

* 将所有需要的 jar 文件归结到一起, 打包成单个的"über-jar", 这样会使得项目更方便执行和分发。

* 将Jar包的 runnable class 标志指向设置的 `public static void main()` 方法。

* 提供内置的依赖解析器, 以设置 [Spring Boot dependencies](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-dependencies/pom.xml) 相关的版本号。你可以根据需要,覆盖任何一个依赖项的版本。

## Build with your IDE

## 使用IDE构建


*   Read how to work with this guide in [IntelliJ IDEA](/guides/gs/intellij-idea).

* 如果不熟悉Idea, 请参考 [IntelliJ IDEA 入门教程](https://spring.io/guides/gs/intellij-idea)。


## Learn what you can do with Spring Boot

## Spring Boot有什么优势?

Spring Boot offers a fast way to build applications. It looks at your classpath and at beans you have configured, makes reasonable assumptions about what you’re missing, and adds it. With Spring Boot you can focus more on business features and less on infrastructure.

Spring Boot 提供了一种快速构建应用程序的方法。查找classpath中配置的bean, 设置合理的默认值. 通过 Spring Boot 使开发者专注于业务逻辑的开发, 降低基础配置的时间和复杂性。

For example:

例如:

*   Got Spring MVC? There are several specific beans you almost always need, and Spring Boot adds them automatically. A Spring MVC app also needs a servlet container, so Spring Boot automatically configures embedded Tomcat.

* 使用Spring MVC, 总免不了配置一些特定的Bean, 而Spring Boot可以自动添加这些Bean. Spring MVC 应用还需要 servlet 容器, 而 Spring Boot 可以自动配置嵌入式的Tomcat。

*   Got Jetty? If so, you probably do NOT want Tomcat, but instead embedded Jetty. Spring Boot handles that for you.

* 使用Jetty, 如果是这样, 可能不想要Tomcat, 没关系, Spring Boot也可以使用嵌入式的Jetty。

*   Got Thymeleaf? There are a few beans that must always be added to your application context; Spring Boot adds them for you.

* 使用Thymeleaf, 总要添加一些特定的Bean到应用程序环境中; Spring Boot 也可以自动添加。

These are just a few examples of the automatic configuration Spring Boot provides. At the same time, Spring Boot doesn’t get in your way. For example, if Thymeleaf is on your path, Spring Boot adds a `SpringTemplateEngine` to your application context automatically. But if you define your own `SpringTemplateEngine` with your own settings, then Spring Boot won’t add one. This leaves you in control with little effort on your part.

这只是Spring Boot自动配置的几个示例。同时, Spring Boot不会妨碍到你。例如, 如果path中有Thymeleaf, Spring Boot 自动添加 `SpringTemplateEngine` 到应用程序环境中。但是定义了自己的`SpringTemplateEngine`, 则Spring Boot不会自动添加。这就使得你的控制得心应手。

Spring Boot doesn’t generate code or make edits to your files. Instead, when you start up your application, Spring Boot dynamically wires up beans and settings and applies them to your application context. 

Spring Boot并不修改代码或者任何文件,只是在必要时,动态组装运行时需要的Bean。



## Create a simple web application

## 创建简单的web应用程序

Now you can create a web controller for a simple web application.

现在, 我们创建一个简单的 web controller。

对应的文件为 `src/main/java/hello/HelloController.java`



```
package hello;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class HelloController {

    @RequestMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }

}
```



The class is flagged as a `@RestController`, meaning it’s ready for use by Spring MVC to handle web requests. `@RequestMapping` maps `/` to the `index()` method. When invoked from a browser or using curl on the command line, the method returns pure text. That’s because `@RestController` combines `@Controller` and `@ResponseBody`, two annotations that results in web requests returning data rather than a view.

该类使用 `@RestController` 注解来标记, 表明这是 Spring MVC 用来处理web请求的类。 `@RequestMapping` 注解将 `/` 映射到 `index()` 方法。 使用浏览器或curl命令来执行请求, 该方法返回一串纯文本。 因为 `@RestController` 注解组合了 `@Controller` 和 `@ResponseBody` 这两个注解, 使得web请求返回的结果是数据而非视图。

## Create an Application class

## 创建 Application 类

Here you create an `Application` class with the components:

创建一个`Application`类: `src/main/java/hello/Application.java`




```
package hello;

import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
        return args -> {

            System.out.println("Let's inspect the beans provided by Spring Boot:");

            String[] beanNames = ctx.getBeanDefinitionNames();
            Arrays.sort(beanNames);
            for (String beanName : beanNames) {
                System.out.println(beanName);
            }

        };
    }

}
```



`@SpringBootApplication` is a convenience annotation that adds all of the following:

`@SpringBootApplication` 是一个方便的注释, 相当于添加了以下配置:

*   `@Configuration` tags the class as a source of bean definitions for the application context.

* `@Configuration` 标记该类作为应用程序环境中 bean定义的来源。

*   `@EnableAutoConfiguration` tells Spring Boot to start adding beans based on classpath settings, other beans, and various property settings.

* `@EnableAutoConfiguration` 告诉Spring Boot, 基于 classpath,其他 bean, 和各种属性设置来添加bean。

*   Normally you would add `@EnableWebMvc` for a Spring MVC app, but Spring Boot adds it automatically when it sees **spring-webmvc** on the classpath. This flags the application as a web application and activates key behaviors such as setting up a `DispatcherServlet`.

* 对于 Spring MVC应用程序, 通常需要添加 `@EnableWebMvc` ,但Spring Boot在扫描 classpath 时如果发现 **spring-webmvc**, 将会自动添加该注解. 标志这此应用是一个web应用程序, 会自动激活 `DispatcherServlet` 等行为。

*   `@ComponentScan` tells Spring to look for other components, configurations, and services in the `hello` package, allowing it to find the controllers.

* `@ComponentScan` 告诉Spring Boot去查找`hello`包中的其他 component、configuration 和 service, 以及 controller。

The `main()` method uses Spring Boot’s `SpringApplication.run()` method to launch an application. Did you notice that there wasn’t a single line of XML? No **web.xml** file either. This web application is 100% pure Java and you didn’t have to deal with configuring any plumbing or infrastructure.

`main()`方法使用 Spring Boot 的`SpringApplication.run()`方法来启动应用程序。注意到没有一行XML,对吧? 也没有 **web.xml**文件. 这是100%的纯Java应用, 不需要配置任何管道或基础设施。

There is also a `CommandLineRunner` method marked as a `@Bean` and this runs on start up. It retrieves all the beans that were created either by your app or were automatically added thanks to Spring Boot. It sorts them and prints them out.

还有, `commandLineRunner` 方法上标记了一个 `@Bean` 注解, 在应用启动时会被执行。它将应用程序创建的, 以及 Spring Boot 自动加载的bean打印出来。

## Run the application

## 运行应用程序


If you are using Maven, execute:

如果使用Maven,执行应用程序:



```
mvn package && java -jar target/gs-spring-boot-0.1.0.jar
```



You should see some output like this:

应该可以看到类似这样的输出:

```
Let's inspect the beans provided by Spring Boot:
application
beanNameHandlerMapping
defaultServletHandlerMapping
dispatcherServlet
embeddedServletContainerCustomizerBeanPostProcessor
handlerExceptionResolver
helloController
httpRequestHandlerAdapter
messageSource
mvcContentNegotiationManager
mvcConversionService
mvcValidator
org.springframework.boot.autoconfigure.MessageSourceAutoConfiguration
org.springframework.boot.autoconfigure.PropertyPlaceholderAutoConfiguration
org.springframework.boot.autoconfigure.web.EmbeddedServletContainerAutoConfiguration
org.springframework.boot.autoconfigure.web.EmbeddedServletContainerAutoConfiguration$DispatcherServletConfiguration
org.springframework.boot.autoconfigure.web.EmbeddedServletContainerAutoConfiguration$EmbeddedTomcat
org.springframework.boot.autoconfigure.web.ServerPropertiesAutoConfiguration
org.springframework.boot.context.embedded.properties.ServerProperties
org.springframework.context.annotation.ConfigurationClassPostProcessor.enhancedConfigurationProcessor
org.springframework.context.annotation.ConfigurationClassPostProcessor.importAwareProcessor
org.springframework.context.annotation.internalAutowiredAnnotationProcessor
org.springframework.context.annotation.internalCommonAnnotationProcessor
org.springframework.context.annotation.internalConfigurationAnnotationProcessor
org.springframework.context.annotation.internalRequiredAnnotationProcessor
org.springframework.web.servlet.config.annotation.DelegatingWebMvcConfiguration
propertySourcesBinder
propertySourcesPlaceholderConfigurer
requestMappingHandlerAdapter
requestMappingHandlerMapping
resourceHandlerMapping
simpleControllerHandlerAdapter
tomcatEmbeddedServletContainerFactory
viewControllerHandlerMapping
```



You can clearly see **org.springframework.boot.autoconfigure** beans. There is also a `tomcatEmbeddedServletContainerFactory`.

可以清楚地看到 **org.springframework.boot.autoconfigure** 下面的 bean。以及 `tomcatEmbeddedServletContainerFactory`。

Check out the service.

测试一下。

```
$ curl localhost:8080
Greetings from Spring Boot!
```



## Add Unit Tests

## 添加单元测试

You will want to add a test for the endpoint you added, and Spring Test already provides some machinery for that, and it’s easy to include in your project.

您想要添加一个测试端点添加,和弹簧测试已经提供了一些机械,并且很容易包含在您的项目。

Add this to your build file’s list of dependencies:

添加到你的构建文件的依赖关系:



```
`testCompile("org.springframework.boot:spring-boot-starter-test")`
```



If you are using Maven, add this to your list of dependencies:

如果你是使用Maven,添加你的依赖关系列表:



```
`<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-test</artifactId><scope>test</scope></dependency>`
```



Now write a simple unit test that mocks the servlet request and response through your endpoint:

现在写一个简单的单元测试,模拟servlet请求和响应通过端点:

`src/test/java/hello/HelloControllerTest.java`



```
`packagehello;importstaticorg.hamcrest.Matchers.equalTo;importstaticorg.springframework.test.web.servlet.result.MockMvcResultMatchers.content;importstaticorg.springframework.test.web.servlet.result.MockMvcResultMatchers.status;importorg.junit.Test;importorg.junit.runner.RunWith;importorg.springframework.beans.factory.annotation.Autowired;importorg.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;importorg.springframework.boot.test.context.SpringBootTest;importorg.springframework.http.MediaType;importorg.springframework.test.context.junit4.SpringRunner;importorg.springframework.test.web.servlet.MockMvc;importorg.springframework.test.web.servlet.request.MockMvcRequestBuilders;@RunWith(SpringRunner.class)@SpringBootTest@AutoConfigureMockMvcpublicclassHelloControllerTest{@AutowiredprivateMockMvcmvc;@TestpublicvoidgetHello()throwsException{mvc.perform(MockMvcRequestBuilders.get("/").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andExpect(content().string(equalTo("Greetings from Spring Boot!")));}}`
```



The `MockMvc` comes from Spring Test and allows you, via a set of convenient builder classes, to send HTTP requests into the `DispatcherServlet` and make assertions about the result. Note the use of the `@AutoConfigureMockMvc` together with `@SpringBootTest` to inject a `MockMvc` instance. Having used `@SpringBootTest` we are asking for the whole application context to be created. An alternative would be to ask Spring Boot to create only the web layers of the context using the `@WebMvcTest`. Spring Boot automatically tries to locate the main application class of your application in either case, but you can override it, or narrow it down, if you want to build something different.

的`MockMvc`来自Spring Boot的测试,并允许您通过一组方便构建器类,发送HTTP请求到`DispatcherServlet`并对结果做出断言。注意使用`@AutoConfigureMockMvc`在一起`@SpringBootTest`注入一个`MockMvc`实例。使用`@SpringBootTest`我们要求要创建整个应用程序环境。另一种只被要求Spring Boot创建web层的环境中使用`@WebMvcTest`。弹簧启动自动试图定位的主要应用程序类应用程序在任何一种情况下,你可以覆盖它,或缩小它,如果你想建立不同的东西。

As well as mocking the HTTP request cycle we can also use Spring Boot to write a very simple full-stack integration test. For example, instead of (or as well as) the mock test above we could do this:

以及模拟HTTP请求周期我们也可以使用Spring Boot写一个非常简单的完整的集成测试。例如,而不是上面的模拟测试(或一样)我们可以这样做:

`src/test/java/hello/HelloControllerIT.java`



```
`packagehello;importstaticorg.hamcrest.Matchers.equalTo;importstaticorg.junit.Assert.assertThat;importjava.net.URL;importorg.junit.Before;importorg.junit.Test;importorg.junit.runner.RunWith;importorg.springframework.beans.factory.annotation.Autowired;importorg.springframework.boot.context.embedded.LocalServerPort;importorg.springframework.boot.test.context.SpringBootTest;importorg.springframework.boot.test.web.client.TestRestTemplate;importorg.springframework.http.ResponseEntity;importorg.springframework.test.context.junit4.SpringRunner;@RunWith(SpringRunner.class)@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT)publicclassHelloControllerIT{@LocalServerPortprivateintport;privateURLbase;@AutowiredprivateTestRestTemplatetemplate;@BeforepublicvoidsetUp()throwsException{this.base=newURL("http://localhost:"+port+"/");}@TestpublicvoidgetHello()throwsException{ResponseEntity<String>response=template.getForEntity(base.toString(),String.class);assertThat(response.getBody(),equalTo("Greetings from Spring Boot!"));}}`
```



The embedded server is started up on a random port by virtue of the `webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT` and the actual port is discovered at runtime with the `@LocalServerPort`.

嵌入式服务器已经启动了一个随机端口的美德`webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT`和实际端口在运行时被发现的`@LocalServerPort`。

## Add production-grade services

## 添加产品级服务

If you are building a web site for your business, you probably need to add some management services. Spring Boot provides several out of the box with its [actuator module](https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/#production-ready), such as health, audits, beans, and more.

如果您正在构建一个网站为你的业务,你可能需要添加一些管理服务。Spring Boot提供了几个的开箱即用的致动器模块(https://docs.spring.io / spring-boot / docs / 1.5.9.RELEASE /引用/ htmlsingle / #生产就绪),如健康、审计,豆类等等。

Add this to your build file’s list of dependencies:

添加到你的构建文件的依赖关系:


```
`compile("org.springframework.boot:spring-boot-starter-actuator")`
```



If you are using Maven, add this to your list of dependencies:

如果你是使用Maven,添加你的依赖关系列表:



```
`<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-actuator</artifactId></dependency>`
```



If you are using Maven, execute:

如果你是使用Maven,执行:


```
mvn package &amp;&amp; java -jar target/gs-spring-boot-0.1.0.jar
```



You will see a new set of RESTful end points added to the application. These are management services provided by Spring Boot.



```
2014-06-03 13:23:28.119  ... : Mapped "{[/error],methods=[],params=[],headers=[],consumes...
2014-06-03 13:23:28.119  ... : Mapped "{[/error],methods=[],params=[],headers=[],consumes...
2014-06-03 13:23:28.136  ... : Mapped URL path [/**] onto handler of type [class org.spri...
2014-06-03 13:23:28.136  ... : Mapped URL path [/webjars/**] onto handler of type [class ...
2014-06-03 13:23:28.440  ... : Mapped "{[/info],methods=[GET],params=[],headers=[],consum...
2014-06-03 13:23:28.441  ... : Mapped "{[/autoconfig],methods=[GET],params=[],headers=[],...
2014-06-03 13:23:28.441  ... : Mapped "{[/mappings],methods=[GET],params=[],headers=[],co...
2014-06-03 13:23:28.442  ... : Mapped "{[/trace],methods=[GET],params=[],headers=[],consu...
2014-06-03 13:23:28.442  ... : Mapped "{[/env/{name:.*}],methods=[GET],params=[],headers=...
2014-06-03 13:23:28.442  ... : Mapped "{[/env],methods=[GET],params=[],headers=[],consume...
2014-06-03 13:23:28.443  ... : Mapped "{[/configprops],methods=[GET],params=[],headers=[]...
2014-06-03 13:23:28.443  ... : Mapped "{[/metrics/{name:.*}],methods=[GET],params=[],head...
2014-06-03 13:23:28.443  ... : Mapped "{[/metrics],methods=[GET],params=[],headers=[],con...
2014-06-03 13:23:28.444  ... : Mapped "{[/health],methods=[GET],params=[],headers=[],cons...
2014-06-03 13:23:28.444  ... : Mapped "{[/dump],methods=[GET],params=[],headers=[],consum...
2014-06-03 13:23:28.445  ... : Mapped "{[/beans],methods=[GET],params=[],headers=[],consu...
```



They include: errors, [environment](http://localhost:8080/env), [health](http://localhost:8080/health), [beans](http://localhost:8080/beans), [info](http://localhost:8080/info), [metrics](http://localhost:8080/metrics), [trace](http://localhost:8080/trace), [configprops](http://localhost:8080/configprops), and [dump](http://localhost:8080/dump).

它们包括:错误,(环境)(http://localhost:8080 / env),(健康)(http://localhost:8080 /健康),(bean)(http://localhost:8080 / bean),[信息](http://localhost:8080 /信息),[标准](http:/ / localhost:8080 /指标),(跟踪)(http://localhost:8080 /跟踪),[configprops](http://localhost:8080 / configprops)和(垃圾场)(http://localhost:8080 /转储)。


There is also a `/shutdown` endpoint, but it’s only visible by default via JMX. To [enable it as an HTTP endpoint](https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/#production-ready-customizing-endpoints), add `endpoints.shutdown.enabled=true` to your `application.properties` file. 



It’s easy to check the health of the app.

很容易检查应用程序的健康状况。




```
$ curl localhost:8080/health
{"status":"UP","diskSpace":{"status":"UP","total":397635555328,"free":328389529600,"threshold":10485760}}}
```



You can try to invoke shutdown through curl.

你可以试着通过curl调用关闭。



```
$ curl -X POST localhost:8080/shutdown
{"timestamp":1401820343710,"error":"Method Not Allowed","status":405,"message":"Request method 'POST' not supported"}
```



Because we didn’t enable it, the request is blocked by the virtue of not existing.

因为我们没有启用它,请求被不存在的美德。

For more details about each of these REST points and how you can tune their settings with an `application.properties` file, you can read detailed [docs about the endpoints](https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/#production-ready-endpoints).

更多细节关于每一个休息点和如何优化他们的设置`application.properties`文件,你可以阅读详细(文档的端点)(https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/ # production-ready-endpoints)。

## View Spring Boot’s starters

## Spring Boot初学者的观点

You have seen some of [Spring Boot’s "starters"](https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/#using-boot-starter). You can see them all [here in source code](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-starters).

您已经看到了一些(Spring Boot的“初学者”)(https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/ # using-boot-starter).你可以看到他们都在源代码(https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-starters)。

## JAR support and Groovy support

## JAR和Groovy支持

The last example showed how Spring Boot makes it easy to wire beans you may not be aware that you need. And it showed how to turn on convenient management services.

最后一个例子展示了Spring Boot很容易线豆你可能没有意识到,你所需要的。它展示了如何打开方便管理服务。

But Spring Boot does yet more. It supports not only traditional WAR file deployments, but also makes it easy to put together executable JARs thanks to Spring Boot’s loader module. The various guides demonstrate this dual support through the `spring-boot-gradle-plugin` and `spring-boot-maven-plugin`.

但Spring Boot更多。不仅支持传统WAR文件部署,但也很容易放在一起可执行jar由于Spring Boot加载程序模块.通过各种指南演示这种双重支持`spring-boot-gradle-plugin`和`spring-boot-maven-plugin`。

On top of that, Spring Boot also has Groovy support, allowing you to build Spring MVC web apps with as little as a single file.

最重要的是,Spring Boot的也有Groovy支持,允许您构建Spring MVC web应用程序与一个单独的文件中。

Create a new file called **app.groovy** and put the following code in it:

创建一个新的名为* *应用程序的文件。groovy * *,把下面的代码:



```
`@RestControllerclassThisWillActuallyRun{@RequestMapping("/")Stringhome(){return"Hello World!"}}`
```



It doesn’t matter where the file is. You can even fit an application that small inside a [single tweet](https://twitter.com/rob_winch/status/364871658483351552)! 




Next, [install Spring Boot’s CLI](https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/#getting-started-installing-the-cli).

接下来,(安装Spring Boot的CLI)(https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/ # getting-started-installing-the-cli)。

Run it as follows:

运行如下:



```
$ spring run app.groovy
```


This assumes you shut down the previous application, to avoid a port collision. 



From a different terminal window:

使用另一个终端来执行:


```
$ curl localhost:8080
Hello World!
```



Spring Boot does this by dynamically adding key annotations to your code and using [Groovy Grape](http://groovy.codehaus.org/Grape) to pull down libraries needed to make the app run.

Spring Boot通过动态地添加关键注释你的代码和使用(Groovy Grape)(http://groovy.codehaus.org/Grape)下拉库需要使应用程序运行。

## Summary

## 总结

Congratulations! You built a simple web application with Spring Boot and learned how it can ramp up your development pace. You also turned on some handy production services. This is only a small sampling of what Spring Boot can do. Checkout [Spring Boot’s online docs](https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle) if you want to dig deeper.

牛B! 我们创建了一个简单的Spring Boot应用, 并学会了如何提高开发效率。在开发实际应用系统时非常方便. 如果想深入学习Spring Boot, 请参考 [Spring Boot’s online docs](https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle)。

## See Also

## 另请参阅

The following guides may also be helpful:

也可以参考下面的教程:

*   [Securing a Web Application](https://spring.io/guides/gs/securing-web/)

*   [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)


原文链接: <https://spring.io/guides/gs/spring-boot/>

