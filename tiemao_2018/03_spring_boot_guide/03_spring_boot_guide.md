# Building an Application with Spring Boot

This guide provides a sampling of how [Spring Boot](https://github.com/spring-projects/spring-boot) helps you accelerate and facilitate application development. As you read more Spring Getting Started guides, you will see more use cases for Spring Boot. It is meant to give you a quick taste of Spring Boot. If you want to create your own Spring Boot-based project, visit [Spring Initializr](https://start.spring.io/), fill in your project details, pick your options, and you can download either a Maven build file, or a bundled up project as a zip file.

## What you’ll build

You’ll build a simple web application with Spring Boot and add some useful services to it.

## What you’ll need

*   About 15 minutes

*   A favorite text editor or IDE

*   [JDK 1.8](http://www.oracle.com/technetwork/java/javase/downloads/index.html) or later

*   [Gradle 2.3+](http://www.gradle.org/downloads) or [Maven 3.0+](https://maven.apache.org/download.cgi)

*   You can also import the code straight into your IDE:

    *   [Spring Tool Suite (STS)](/guides/gs/sts)

        *   [IntelliJ IDEA](/guides/gs/intellij-idea/)

## How to complete this guide

Like most Spring [Getting Started guides](/guides), you can start from scratch and complete each step, or you can bypass basic setup steps that are already familiar to you. Either way, you end up with working code.

To **start from scratch**, move on to [Build with Gradle](#scratch).

To **skip the basics**, do the following:

*   [Download](https://github.com/spring-guides/gs-spring-boot/archive/master.zip) and unzip the source repository for this guide, or clone it using [Git](/understanding/Git): `git clone [https://github.com/spring-guides/gs-spring-boot.git](https://github.com/spring-guides/gs-spring-boot.git)`

*   cd into `gs-spring-boot/initial`

*   Jump ahead to [[initial]](#initial).

**When you’re finished**, you can check your results against the code in `gs-spring-boot/complete`.

## Build with Gradle

## Build with Gradle

First you set up a basic build script. You can use any build system you like when building apps with Spring, but the code you need to work with [Gradle](http://gradle.org) and [Maven](https://maven.apache.org) is included here. If you’re not familiar with either, refer to [Building Java Projects with Gradle](/guides/gs/gradle) or [Building Java Projects with Maven](/guides/gs/maven).

### Create the directory structure

In a project directory of your choosing, create the following subdirectory structure; for example, with `mkdir -p src/main/java/hello` on *nix systems:

```
└── src
    └── main
        └── java
            └── hello
```

### Create a Gradle build file

Below is the [initial Gradle build file](https://github.com/spring-guides/gs-spring-boot/blob/master/initial/build.gradle).

`build.gradle`

<button class="copy-button snippet" id="copy-button-0" data-clipboard-target="#code-block-0"></button>

```
`buildscript{repositories{mavenCentral()}dependencies{classpath("org.springframework.boot:spring-boot-gradle-plugin:1.5.9.RELEASE")}}apply plugin:'java'apply plugin:'eclipse'apply plugin:'idea'apply plugin:'org.springframework.boot'jar{baseName='gs-spring-boot'version='0.1.0'}repositories{mavenCentral()}sourceCompatibility=1.8targetCompatibility=1.8dependencies{compile("org.springframework.boot:spring-boot-starter-web")testCompile("junit:junit")}`
```

The [Spring Boot gradle plugin](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-tools/spring-boot-gradle-plugin) provides many convenient features:

*   It collects all the jars on the classpath and builds a single, runnable "über-jar", which makes it more convenient to execute and transport your service.

*   It searches for the `public static void main()` method to flag as a runnable class.

*   It provides a built-in dependency resolver that sets the version number to match [Spring Boot dependencies](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-dependencies/pom.xml). You can override any version you wish, but it will default to Boot’s chosen set of versions.

## Build with Maven

## Build with Maven

First you set up a basic build script. You can use any build system you like when building apps with Spring, but the code you need to work with [Maven](https://maven.apache.org) is included here. If you’re not familiar with Maven, refer to [Building Java Projects with Maven](/guides/gs/maven).

### Create the directory structure

In a project directory of your choosing, create the following subdirectory structure; for example, with `mkdir -p src/main/java/hello` on *nix systems:

```
└── src
    └── main
        └── java
            └── hello
```

`pom.xml`

<button class="copy-button snippet" id="copy-button-1" data-clipboard-target="#code-block-1"></button>

```
`<?xml version="1.0"encoding="UTF-8"?><projectxmlns="http://maven.apache.org/POM/4.0.0"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"><modelVersion>4.0.0</modelVersion><groupId>org.springframework</groupId><artifactId>gs-spring-boot</artifactId><version>0.1.0</version><parent><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-parent</artifactId><version>1.5.9.RELEASE</version></parent><dependencies><dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency></dependencies><properties><java.version>1.8</java.version></properties><build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin></plugins></build></project>`
```

The [Spring Boot Maven plugin](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-tools/spring-boot-maven-plugin) provides many convenient features:

*   It collects all the jars on the classpath and builds a single, runnable "über-jar", which makes it more convenient to execute and transport your service.

*   It searches for the `public static void main()` method to flag as a runnable class.

*   It provides a built-in dependency resolver that sets the version number to match [Spring Boot dependencies](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-dependencies/pom.xml). You can override any version you wish, but it will default to Boot’s chosen set of versions.

## Build with your IDE

## Build with your IDE

*   Read how to import this guide straight into [Spring Tool Suite](/guides/gs/sts/).

*   Read how to work with this guide in [IntelliJ IDEA](/guides/gs/intellij-idea).

## Learn what you can do with Spring Boot

Spring Boot offers a fast way to build applications. It looks at your classpath and at beans you have configured, makes reasonable assumptions about what you’re missing, and adds it. With Spring Boot you can focus more on business features and less on infrastructure.

For example:

*   Got Spring MVC? There are several specific beans you almost always need, and Spring Boot adds them automatically. A Spring MVC app also needs a servlet container, so Spring Boot automatically configures embedded Tomcat.

*   Got Jetty? If so, you probably do NOT want Tomcat, but instead embedded Jetty. Spring Boot handles that for you.

*   Got Thymeleaf? There are a few beans that must always be added to your application context; Spring Boot adds them for you.

These are just a few examples of the automatic configuration Spring Boot provides. At the same time, Spring Boot doesn’t get in your way. For example, if Thymeleaf is on your path, Spring Boot adds a `SpringTemplateEngine` to your application context automatically. But if you define your own `SpringTemplateEngine` with your own settings, then Spring Boot won’t add one. This leaves you in control with little effort on your part.

<table>
<tbody>
<tr>
<td class="icon">  </td>
<td class="content"> Spring Boot doesn’t generate code or make edits to your files. Instead, when you start up your application, Spring Boot dynamically wires up beans and settings and applies them to your application context. </td>
</tr>
</tbody>
</table>

## Create a simple web application

Now you can create a web controller for a simple web application.

`src/main/java/hello/HelloController.java`

<button class="copy-button snippet" id="copy-button-2" data-clipboard-target="#code-block-2"></button>

```
`packagehello;importorg.springframework.web.bind.annotation.RestController;importorg.springframework.web.bind.annotation.RequestMapping;@RestControllerpublicclassHelloController{@RequestMapping("/")publicStringindex(){return"Greetings from Spring Boot!";}}`
```

The class is flagged as a `@RestController`, meaning it’s ready for use by Spring MVC to handle web requests. `@RequestMapping` maps `/` to the `index()` method. When invoked from a browser or using curl on the command line, the method returns pure text. That’s because `@RestController` combines `@Controller` and `@ResponseBody`, two annotations that results in web requests returning data rather than a view.

## Create an Application class

Here you create an `Application` class with the components:

`src/main/java/hello/Application.java`

<button class="copy-button snippet" id="copy-button-3" data-clipboard-target="#code-block-3"></button>

```
`packagehello;importjava.util.Arrays;importorg.springframework.boot.CommandLineRunner;importorg.springframework.boot.SpringApplication;importorg.springframework.boot.autoconfigure.SpringBootApplication;importorg.springframework.context.ApplicationContext;importorg.springframework.context.annotation.Bean;@SpringBootApplicationpublicclassApplication{publicstaticvoidmain(String[]args){SpringApplication.run(Application.class,args);}@BeanpublicCommandLineRunnercommandLineRunner(ApplicationContextctx){returnargs->{System.out.println("Let's inspect the beans provided by Spring Boot:");String[]beanNames=ctx.getBeanDefinitionNames();Arrays.sort(beanNames);for(StringbeanName:beanNames){System.out.println(beanName);}};}}`
```

`@SpringBootApplication` is a convenience annotation that adds all of the following:

*   `@Configuration` tags the class as a source of bean definitions for the application context.

*   `@EnableAutoConfiguration` tells Spring Boot to start adding beans based on classpath settings, other beans, and various property settings.

*   Normally you would add `@EnableWebMvc` for a Spring MVC app, but Spring Boot adds it automatically when it sees **spring-webmvc** on the classpath. This flags the application as a web application and activates key behaviors such as setting up a `DispatcherServlet`.

*   `@ComponentScan` tells Spring to look for other components, configurations, and services in the `hello` package, allowing it to find the controllers.

The `main()` method uses Spring Boot’s `SpringApplication.run()` method to launch an application. Did you notice that there wasn’t a single line of XML? No **web.xml** file either. This web application is 100% pure Java and you didn’t have to deal with configuring any plumbing or infrastructure.

There is also a `CommandLineRunner` method marked as a `@Bean` and this runs on start up. It retrieves all the beans that were created either by your app or were automatically added thanks to Spring Boot. It sorts them and prints them out.

## Run the application

To run the application, execute:

<button class="copy-button snippet" id="copy-button-4" data-clipboard-target="#code-block-4"></button>

```
./gradlew build &amp;&amp; java -jar build/libs/gs-spring-boot-0.1.0.jar
```

If you are using Maven, execute:

<button class="copy-button snippet" id="copy-button-5" data-clipboard-target="#code-block-5"></button>

```
mvn package &amp;&amp; java -jar target/gs-spring-boot-0.1.0.jar
```

You should see some output like this:

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

Check out the service.

```
$ curl localhost:8080
Greetings from Spring Boot!
```

## Add Unit Tests

You will want to add a test for the endpoint you added, and Spring Test already provides some machinery for that, and it’s easy to include in your project.

Add this to your build file’s list of dependencies:

<button class="copy-button snippet" id="copy-button-6" data-clipboard-target="#code-block-6"></button>

```
`testCompile("org.springframework.boot:spring-boot-starter-test")`
```

If you are using Maven, add this to your list of dependencies:

<button class="copy-button snippet" id="copy-button-7" data-clipboard-target="#code-block-7"></button>

```
`<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-test</artifactId><scope>test</scope></dependency>`
```

Now write a simple unit test that mocks the servlet request and response through your endpoint:

`src/test/java/hello/HelloControllerTest.java`

<button class="copy-button snippet" id="copy-button-8" data-clipboard-target="#code-block-8"></button>

```
`packagehello;importstaticorg.hamcrest.Matchers.equalTo;importstaticorg.springframework.test.web.servlet.result.MockMvcResultMatchers.content;importstaticorg.springframework.test.web.servlet.result.MockMvcResultMatchers.status;importorg.junit.Test;importorg.junit.runner.RunWith;importorg.springframework.beans.factory.annotation.Autowired;importorg.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;importorg.springframework.boot.test.context.SpringBootTest;importorg.springframework.http.MediaType;importorg.springframework.test.context.junit4.SpringRunner;importorg.springframework.test.web.servlet.MockMvc;importorg.springframework.test.web.servlet.request.MockMvcRequestBuilders;@RunWith(SpringRunner.class)@SpringBootTest@AutoConfigureMockMvcpublicclassHelloControllerTest{@AutowiredprivateMockMvcmvc;@TestpublicvoidgetHello()throwsException{mvc.perform(MockMvcRequestBuilders.get("/").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andExpect(content().string(equalTo("Greetings from Spring Boot!")));}}`
```

The `MockMvc` comes from Spring Test and allows you, via a set of convenient builder classes, to send HTTP requests into the `DispatcherServlet` and make assertions about the result. Note the use of the `@AutoConfigureMockMvc` together with `@SpringBootTest` to inject a `MockMvc` instance. Having used `@SpringBootTest` we are asking for the whole application context to be created. An alternative would be to ask Spring Boot to create only the web layers of the context using the `@WebMvcTest`. Spring Boot automatically tries to locate the main application class of your application in either case, but you can override it, or narrow it down, if you want to build something different.

As well as mocking the HTTP request cycle we can also use Spring Boot to write a very simple full-stack integration test. For example, instead of (or as well as) the mock test above we could do this:

`src/test/java/hello/HelloControllerIT.java`

<button class="copy-button snippet" id="copy-button-9" data-clipboard-target="#code-block-9"></button>

```
`packagehello;importstaticorg.hamcrest.Matchers.equalTo;importstaticorg.junit.Assert.assertThat;importjava.net.URL;importorg.junit.Before;importorg.junit.Test;importorg.junit.runner.RunWith;importorg.springframework.beans.factory.annotation.Autowired;importorg.springframework.boot.context.embedded.LocalServerPort;importorg.springframework.boot.test.context.SpringBootTest;importorg.springframework.boot.test.web.client.TestRestTemplate;importorg.springframework.http.ResponseEntity;importorg.springframework.test.context.junit4.SpringRunner;@RunWith(SpringRunner.class)@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT)publicclassHelloControllerIT{@LocalServerPortprivateintport;privateURLbase;@AutowiredprivateTestRestTemplatetemplate;@BeforepublicvoidsetUp()throwsException{this.base=newURL("http://localhost:"+port+"/");}@TestpublicvoidgetHello()throwsException{ResponseEntity<String>response=template.getForEntity(base.toString(),String.class);assertThat(response.getBody(),equalTo("Greetings from Spring Boot!"));}}`
```

The embedded server is started up on a random port by virtue of the `webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT` and the actual port is discovered at runtime with the `@LocalServerPort`.

## Add production-grade services

If you are building a web site for your business, you probably need to add some management services. Spring Boot provides several out of the box with its [actuator module](https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/#production-ready), such as health, audits, beans, and more.

Add this to your build file’s list of dependencies:

<button class="copy-button snippet" id="copy-button-10" data-clipboard-target="#code-block-10"></button>

```
`compile("org.springframework.boot:spring-boot-starter-actuator")`
```

If you are using Maven, add this to your list of dependencies:

<button class="copy-button snippet" id="copy-button-11" data-clipboard-target="#code-block-11"></button>

```
`<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-actuator</artifactId></dependency>`
```

Then restart the app:

<button class="copy-button snippet" id="copy-button-12" data-clipboard-target="#code-block-12"></button>

```
./gradlew build &amp;&amp; java -jar build/libs/gs-spring-boot-0.1.0.jar
```

If you are using Maven, execute:

<button class="copy-button snippet" id="copy-button-13" data-clipboard-target="#code-block-13"></button>

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

<table>
<tbody>
<tr>
<td class="icon">  </td>
<td class="content"> There is also a `/shutdown` endpoint, but it’s only visible by default via JMX. To [enable it as an HTTP endpoint](https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/#production-ready-customizing-endpoints), add `endpoints.shutdown.enabled=true` to your `application.properties` file. </td>
</tr>
</tbody>
</table>

It’s easy to check the health of the app.

<button class="copy-button snippet" id="copy-button-14" data-clipboard-target="#code-block-14"></button>

```
$ curl localhost:8080/health
{"status":"UP","diskSpace":{"status":"UP","total":397635555328,"free":328389529600,"threshold":10485760}}}
```

You can try to invoke shutdown through curl.

<button class="copy-button snippet" id="copy-button-15" data-clipboard-target="#code-block-15"></button>

```
$ curl -X POST localhost:8080/shutdown
{"timestamp":1401820343710,"error":"Method Not Allowed","status":405,"message":"Request method 'POST' not supported"}
```

Because we didn’t enable it, the request is blocked by the virtue of not existing.

For more details about each of these REST points and how you can tune their settings with an `application.properties` file, you can read detailed [docs about the endpoints](https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/#production-ready-endpoints).

## View Spring Boot’s starters

You have seen some of [Spring Boot’s "starters"](https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/#using-boot-starter). You can see them all [here in source code](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-starters).

## JAR support and Groovy support

The last example showed how Spring Boot makes it easy to wire beans you may not be aware that you need. And it showed how to turn on convenient management services.

But Spring Boot does yet more. It supports not only traditional WAR file deployments, but also makes it easy to put together executable JARs thanks to Spring Boot’s loader module. The various guides demonstrate this dual support through the `spring-boot-gradle-plugin` and `spring-boot-maven-plugin`.

On top of that, Spring Boot also has Groovy support, allowing you to build Spring MVC web apps with as little as a single file.

Create a new file called **app.groovy** and put the following code in it:

<button class="copy-button snippet" id="copy-button-16" data-clipboard-target="#code-block-16"></button>

```
`@RestControllerclassThisWillActuallyRun{@RequestMapping("/")Stringhome(){return"Hello World!"}}`
```

<table>
<tbody>
<tr>
<td class="icon">  </td>
<td class="content"> It doesn’t matter where the file is. You can even fit an application that small inside a [single tweet](https://twitter.com/rob_winch/status/364871658483351552)! </td>
</tr>
</tbody>
</table>

Next, [install Spring Boot’s CLI](https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/#getting-started-installing-the-cli).

Run it as follows:

<button class="copy-button snippet" id="copy-button-17" data-clipboard-target="#code-block-17"></button>

```
$ spring run app.groovy
```

<table>
<tbody>
<tr>
<td class="icon">  </td>
<td class="content"> This assumes you shut down the previous application, to avoid a port collision. </td>
</tr>
</tbody>
</table>

From a different terminal window:

<button class="copy-button snippet" id="copy-button-18" data-clipboard-target="#code-block-18"></button>

```
$ curl localhost:8080
Hello World!
```

Spring Boot does this by dynamically adding key annotations to your code and using [Groovy Grape](http://groovy.codehaus.org/Grape) to pull down libraries needed to make the app run.

## Summary

Congratulations! You built a simple web application with Spring Boot and learned how it can ramp up your development pace. You also turned on some handy production services. This is only a small sampling of what Spring Boot can do. Checkout [Spring Boot’s online docs](https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle) if you want to dig deeper.

## See Also

The following guides may also be helpful:

*   [Securing a Web Application](https://spring.io/guides/gs/securing-web/)

*   [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)

Want to write a new guide or contribute to an existing one? Check out our [contribution guidelines](https://github.com/spring-guides/getting-started-guides/wiki).


原文链接: <https://spring.io/guides/gs/spring-boot/>

