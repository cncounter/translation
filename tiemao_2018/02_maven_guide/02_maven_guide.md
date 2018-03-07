# Building Java Projects with Maven

# 用Maven构建Java项目

This guide walks you through using Maven to build a simple Java project.

本文带你用Maven来构建一个简单的Java项目。

## What you’ll build

## 任务目标

You’ll create an application that provides the time of day and then build it with Maven.

创建一个简单的应用程序, 提供一天中不同的时间, 创建完成后, 用Maven来进行构建。

## What you’ll need

## 准备工作

*   About 15 minutes

* 大约需要15分钟左右的时间。

*   A favorite text editor or IDE

* 选择一款熟悉的文本编辑器或IDE

*   [JDK 6](http://www.oracle.com/technetwork/java/javase/downloads/index.html) or later

* 安装 [JDK 6](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 或更高版本

## How to complete this guide

## 如何完成这个指南

Like most Spring [Getting Started guides](/guides), you can start from scratch and complete each step, or you can bypass basic setup steps that are already familiar to you. Either way, you end up with working code.

最喜欢春天入门指南(/指南),你可以从头开始并完成每一步,或者你可以绕过基本已经熟悉你的设置步骤.无论哪种方式,你最终得到的工作代码。

To **start from scratch**, move on to [Set up the project](#scratch).

* *从头开始* *,继续(设置项目)(#刮)。

To **skip the basics**, do the following:

* * * *跳过基础知识,做到以下几点:

*   [Download](https://github.com/spring-guides/gs-maven/archive/master.zip) and unzip the source repository for this guide, or clone it using [Git](/understanding/Git): `git clone [https://github.com/spring-guides/gs-maven.git](https://github.com/spring-guides/gs-maven.git)`

*[下载](https://github.com/spring-guides/gs-maven/archive/master.zip)并解压缩源库本指南,或者克隆使用(Git)(/理解/ Git):`git clone [https://github.com/spring-guides/gs-maven.git](https://github.com/spring-guides/gs-maven.git)`

*   cd into `gs-maven/initial`

* cd到`gs-maven/initial`

*   Jump ahead to [[initial]](#initial).

*跳过[[开始]](#初始)。

**When you’re finished**, you can check your results against the code in `gs-maven/complete`.

* * * *当你完成了,你可以检查你的结果代码`gs-maven/complete`。

## Set up the project

## 设置项目

First you’ll need to setup a Java project for Maven to build. To keep the focus on Maven, make the project as simple as possible for now. Create this structure in a project folder of your choosing.

首先你需要设置Maven构建的Java项目。保持专注于Maven,使项目尽可能简单。在你选择的项目文件夹中创建这个结构。

### Create the directory structure

### 创建目录结构

In a project directory of your choosing, create the following subdirectory structure; for example, with `mkdir -p src/main/java/hello` on *nix systems:

你选择的项目目录,创建以下目录结构;例如,使用`mkdir -p src/main/java/hello`在* nix系统:

```
└── src
    └── main
        └── java
            └── hello
```



Within the `src/main/java/hello` directory, you can create any Java classes you want. To maintain consistency with the rest of this guide, create these two classes: `HelloWorld.java` and `Greeter.java`.

在`src/main/java/hello`目录中,您可以创建任何你想要的Java类。与本指南的其余部分保持一致性,创建这两个类:`HelloWorld.java`和`Greeter.java`。

`src/main/java/hello/HelloWorld.java`

施用srs /手/ HelloWorld.java施用去/爪哇/

<button class="copy-button snippet" id="copy-button-0" data-clipboard-target="#code-block-0"></button>



```
`packagehello;publicclassHelloWorld{publicstaticvoidmain(String[]args){Greetergreeter=newGreeter();System.out.println(greeter.sayHello());}}`
```



`src/main/java/hello/Greeter.java`

' src / main / java / hello / Greeter.java '

<button class="copy-button snippet" id="copy-button-1" data-clipboard-target="#code-block-1"></button>



```
`packagehello;publicclassGreeter{publicStringsayHello(){return"Hello world!";}}`
```



Now that you have a project that is ready to be built with Maven, the next step is to install Maven.

现在,您已经有了一个项目,愿与Maven构建,下一步是安装Maven。

Maven is downloadable as a zip file at [http://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi). Only the binaries are required, so look for the link to apache-maven-_{version}_-bin.zip or apache-maven-_{version}_-bin.tar.gz.

Maven是下载的zip文件的[http://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi).只有二进制文件是必需的,所以寻找链接到apache maven _ { version } _-bin。zip或apache maven _ { version } _-bin.tar.gz。

Once you have downloaded the zip file, unzip it to your computer. Then add the _bin_ folder to your path.

一旦你已经下载的zip文件,将其解压缩到您的计算机。然后将_bin_文件夹添加到您的路径。

To test the Maven installation, run `mvn` from the command-line:

测试Maven安装、运行`mvn`从命令行:

<button class="copy-button snippet" id="copy-button-2" data-clipboard-target="#code-block-2"></button>



```
mvn -v
```



If all goes well, you should be presented with some information about the Maven installation. It will look similar to (although perhaps slightly different from) the following:

如果一切顺利,您应该看到一些Maven的安装信息。它将类似于(尽管可能略有不同):

```
Apache Maven 3.0.5 (r01de14724cdef164cd33c7c8c2fe155faf9602da; 2013-02-19 07:51:28-0600)
Maven home: /usr/share/maven
Java version: 1.7.0_09, vendor: Oracle Corporation
Java home: /Library/Java/JavaVirtualMachines/jdk1.7.0_09.jdk/Contents/Home/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "mac os x", version: "10.8.3", arch: "x86_64", family: "mac"
```



Congratulations! You now have Maven installed.

恭喜你!你现在安装了Maven。

## Define a simple Maven build

## 定义一个简单的Maven构建

Now that Maven is installed, you need to create a Maven project definition. Maven projects are defined with an XML file named _pom.xml_. Among other things, this file gives the project’s name, version, and dependencies that it has on external libraries.

现在安装Maven,您需要创建一个Maven项目定义。Maven项目定义了一个XML文件命名_pom.xml_.除此之外,这个文件给项目的名称,版本,依赖外部库。

Create a file named _pom.xml_ at the root of the project (i.e. put it next to the `src` folder) and give it the following contents:

创建一个名为_pom的文件。xml_在项目的根(即把它旁边`src`文件夹)并给它以下内容:

`pom.xml`

“pom.xml”

<button class="copy-button snippet" id="copy-button-3" data-clipboard-target="#code-block-3"></button>



```
`<?xml version="1.0"encoding="UTF-8"?><projectxmlns="http://maven.apache.org/POM/4.0.0"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd"><modelVersion>4.0.0</modelVersion><groupId>org.springframework</groupId><artifactId>gs-maven</artifactId><packaging>jar</packaging><version>0.1.0</version><build><plugins><plugin><groupId>org.apache.maven.plugins</groupId><artifactId>maven-shade-plugin</artifactId><version>2.1</version><executions><execution><phase>package</phase><goals><goal>shade</goal></goals><configuration><transformers><transformerimplementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer"><mainClass>hello.HelloWorld</mainClass></transformer></transformers></configuration></execution></executions></plugin></plugins></build></project>`
```



With the exception of the optional `&lt;packaging&gt;` element, this is the simplest possible _pom.xml_ file necessary to build a Java project. It includes the following details of the project configuration:

除了可选的`&lt;packaging&gt;`Element, and this is the simplest possible _pom. Xml_ file necessary to build a Java project. It includes the following details of the project configuration:

*   `&lt;modelVersion&gt;`. POM model version (always 4.0.0).

*`&lt;modelVersion&gt;`。POM模型版本(总是4.0.0)。

*   `&lt;groupId&gt;`. Group or organization that the project belongs to. Often expressed as an inverted domain name.

*`&lt;groupId&gt;`。该项目属于的组或组织。通常表示为一个反向域名。

*   `&lt;artifactId&gt;`. Name to be given to the project’s library artifact (for example, the name of its JAR or WAR file).

*`&lt;artifactId&gt;`。名字给图书馆项目的工件(例如,姓名JAR或WAR文件)。

*   `&lt;version&gt;`. Version of the project that is being built.

*`&lt;version&gt;`。版本的项目正在建设。

*   `&lt;packaging&gt;` - How the project should be packaged. Defaults to "jar" for JAR file packaging. Use "war" for WAR file packaging.

*`&lt;packaging&gt;`——应该如何包装项目。默认为“罐子”打包为jar文件。使用“战争”打包为war文件。

<table>
<tbody>
<tr>
<td class="icon">  </td>
<td class="content"> When it comes to choosing a versioning scheme, Spring recommends the [semantic versioning](http://semver.org) approach. </td>
</tr>
</tbody>
</table>



At this point you have a minimal, yet capable Maven project defined.

在这一点上你有一个最小的,然而Maven项目定义的能力。

## Build Java code

## 构建Java代码

Maven is now ready to build the project. You can execute several build lifecycle goals with Maven now, including goals to compile the project’s code, create a library package (such as a JAR file), and install the library in the local Maven dependency repository.

Maven现在可以构建项目.你现在可以执行几个与Maven构建生命周期的目标,包括目标编译项目的代码,创建一个库包(比如一个JAR文件),并安装在本地Maven库依赖库。

To try out the build, issue the following at the command line:

尝试构建,发出以下命令行:

<button class="copy-button snippet" id="copy-button-4" data-clipboard-target="#code-block-4"></button>



```
mvn compile
```



This will run Maven, telling it to execute the _compile_ goal. When it’s finished, you should find the compiled _.class_ files in the _target/classes_ directory.

这将运行Maven,告诉它执行_compile_目标。当它完成的时候,你应该找到编译_。class_ _target / classes_目录中的文件。

Since it’s unlikely that you’ll want to distribute or work with _.class_ files directly, you’ll probably want to run the _package_ goal instead:

因为它不太可能,你会想分发或使用_。直接class_文件,你可能会想要运行_package_目标:

<button class="copy-button snippet" id="copy-button-5" data-clipboard-target="#code-block-5"></button>



```
mvn package
```



The _package_ goal will compile your Java code, run any tests, and finish by packaging the code up in a JAR file within the _target_ directory. The name of the JAR file will be based on the project’s `&lt;artifactId&gt;` and `&lt;version&gt;`. For example, given the minimal _pom.xml_ file from before, the JAR file will be named _gs-maven-0.1.0.jar_.

_package_目标将编译Java代码,运行任何测试,并完成包装代码_target_目录中的JAR文件。JAR文件的名称将基于项目的`&lt;artifactId&gt;`和`&lt;version&gt;`。例如,鉴于_pom最小。从之前xml_文件,JAR文件将被命名为_gs-maven-0.1.0.jar_。

<table>
<tbody>
<tr>
<td class="icon">  </td>
<td class="content"> If you’ve changed the value of `&lt;packaging&gt;` from "jar" to "war", the result will be a WAR file within the _target_ directory instead of a JAR file. </td>
</tr>
</tbody>
</table>



Maven also maintains a repository of dependencies on your local machine (usually in a _.m2/repository_ directory in your home directory) for quick access to project dependencies. If you’d like to install your project’s JAR file to that local repository, then you should invoke the `install` goal:

Maven还维护一个库的依赖关系在本地机器上(通常是_。m2 / repository_目录在您的主目录)快速访问项目的依赖关系.如果你想安装项目的JAR文件,本地存储库,那么您应该调用`install`目标:

<button class="copy-button snippet" id="copy-button-6" data-clipboard-target="#code-block-6"></button>



```
mvn install
```



The _install_ goal will compile, test, and package your project’s code and then copy it into the local dependency repository, ready for another project to reference it as a dependency.

_install_目标编译、测试和包装您的项目代码,然后将其复制到本地依赖库,准备另一个项目引用的依赖。

Speaking of dependencies, now it’s time to declare dependencies in the Maven build.

说到依赖,现在是时候宣布在Maven构建依赖关系。

## Declare Dependencies

## 声明依赖性

The simple Hello World sample is completely self-contained and does not depend on any additional libraries. Most applications, however, depend on external libraries to handle common and complex functionality.

一个简单的Hello World示例是完全独立的,不依赖于任何额外的库.然而,大多数应用程序依赖外部库来处理常见的和复杂的功能。

For example, suppose that in addition to saying "Hello World!", you want the application to print the current date and time. While you could use the date and time facilities in the native Java libraries, you can make things more interesting by using the Joda Time libraries.

例如,假设除了说“Hello World !””,您希望应用程序打印当前日期和时间.虽然可以使用日期和时间在本地Java库,您可以使用Joda时间让事情更有趣的库。

First, change HelloWorld.java to look like this:

首先,改变HelloWorld。java看起来像这样:

`src/main/java/hello/HelloWorld.java`

施用srs /手/ HelloWorld.java施用去/爪哇/

<button class="copy-button snippet" id="copy-button-7" data-clipboard-target="#code-block-7"></button>



```
`packagehello;importorg.joda.time.LocalTime;publicclassHelloWorld{publicstaticvoidmain(String[]args){LocalTimecurrentTime=newLocalTime();System.out.println("The current local time is: "+currentTime);Greetergreeter=newGreeter();System.out.println(greeter.sayHello());}}`
```



Here `HelloWorld` uses Joda Time’s `LocalTime` class to get and print the current time.

在这里`HelloWorld`使用Joda时间的`LocalTime`类和打印当前时间。

If you were to run `mvn compile` to build the project now, the build would fail because you’ve not declared Joda Time as a compile dependency in the build. You can fix that by adding the following lines to _pom.xml_ (within the `&lt;project&gt;` element):

如果你运行`mvn compile`构建项目,构建会失败,因为你还没有宣布Joda编译依赖的构建。您可以通过添加以下行_pom修复。xml_(内`&lt;project&gt;`元素):

<button class="copy-button snippet" id="copy-button-8" data-clipboard-target="#code-block-8"></button>



```
`<dependencies><dependency><groupId>joda-time</groupId><artifactId>joda-time</artifactId><version>2.9.2</version></dependency></dependencies>`
```



This block of XML declares a list of dependencies for the project. Specifically, it declares a single dependency for the Joda Time library. Within the `&lt;dependency&gt;` element, the dependency coordinates are defined by three sub-elements:

这段XML声明一个项目依赖项列表。具体地说,它声明了一个Joda次依赖库。在`&lt;dependency&gt;`元素,依赖坐标是由三个子元素:

*   `&lt;groupId&gt;` - The group or organization that the dependency belongs to.

*`&lt;groupId&gt;`——依赖属于的团体或组织。

*   `&lt;artifactId&gt;` - The library that is required.

*`&lt;artifactId&gt;`图书馆,是必需的。

*   `&lt;version&gt;` - The specific version of the library that is required.

*`&lt;version&gt;`的特定版本库,是必需的。

By default, all dependencies are scoped as `compile` dependencies. That is, they should be available at compile-time (and if you were building a WAR file, including in the _/WEB-INF/libs_ folder of the WAR). Additionally, you may specify a `&lt;scope&gt;` element to specify one of the following scopes:

默认情况下,所有依赖关系范围`compile`依赖关系。也就是说,他们应该可以在编译时(如果你构建一个WAR文件,包括_ / web - inf / libs_文件夹的战争)。此外,你可以指定一个`&lt;scope&gt;`元素指定一个以下范围:

*   `provided` - Dependencies that are required for compiling the project code, but that will be provided at runtime by a container running the code (e.g., the Java Servlet API).

*`provided`——依赖项目编译所需的代码,但这将在运行时通过提供一个容器运行代码(例如,Java Servlet API)。

*   `test` - Dependencies that are used for compiling and running tests, but not required for building or running the project’s runtime code.

*`test`——依赖用于编译和运行测试,但不是必需的建设或运行项目的运行时代码。

Now if you run `mvn compile` or `mvn package`, Maven should resolve the Joda Time dependency from the Maven Central repository and the build will be successful.

现在如果你运行`mvn compile`或`mvn package`,Maven应该解决Joda时间依赖从Maven中央存储库和构建会成功。

## Write a Test

## 编写一个测试

First add JUnit as a dependency to your pom.xml, in the test scope:

第一次添加JUnit pom作为依赖项。xml,在测试范围:

<button class="copy-button snippet" id="copy-button-9" data-clipboard-target="#code-block-9"></button>



```
`<dependency><groupId>junit</groupId><artifactId>junit</artifactId><version>4.12</version><scope>test</scope></dependency>`
```



Then create a test case like this:

然后创建一个测试用例是这样的:

`src/test/java/hello/GreeterTest.java`

' src / java / hello /测试/ GreeterTest.java”

<button class="copy-button snippet" id="copy-button-10" data-clipboard-target="#code-block-10"></button>



```
`packagehello;importstaticorg.hamcrest.CoreMatchers.containsString;importstaticorg.junit.Assert.*;importorg.junit.Test;publicclassGreeterTest{privateGreetergreeter=newGreeter();@TestpublicvoidgreeterSaysHello(){assertThat(greeter.sayHello(),containsString("Hello"));}}`
```



Maven uses a plugin called "surefire" to run unit tests. The default configuration of this plugin compiles and runs all classes in `src/test/java` with a name matching `*Test`. You can run the tests on the command line like this

Maven使用一个插件称为“肯定”运行单元测试。这个插件的默认配置编译和运行所有类`src/test/java`使用一个名称匹配`*Test`。您可以在命令行上运行测试

<button class="copy-button snippet" id="copy-button-11" data-clipboard-target="#code-block-11"></button>



```
mvn test
```



or just use `mvn install` step as we already showed above (there is a lifecycle definition where "test" is included as a stage in "install").

或者只是使用`mvn install`步骤如上我们已经显示(有一个生命周期定义在“测试”是包含在“安装”阶段)。

Here’s the completed `pom.xml` file:

这是完成的`pom.xml`文件:

`pom.xml`

“pom.xml”

<button class="copy-button snippet" id="copy-button-12" data-clipboard-target="#code-block-12"></button>



```
`<?xml version="1.0"encoding="UTF-8"?><projectxmlns="http://maven.apache.org/POM/4.0.0"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd"><modelVersion>4.0.0</modelVersion><groupId>org.springframework</groupId><artifactId>gs-maven</artifactId><packaging>jar</packaging><version>0.1.0</version><dependencies><!-- tag::joda[] --><dependency><groupId>joda-time</groupId><artifactId>joda-time</artifactId><version>2.9.2</version></dependency><!-- end::joda[] --><!-- tag::junit[] --><dependency><groupId>junit</groupId><artifactId>junit</artifactId><version>4.12</version><scope>test</scope></dependency><!-- end::junit[] --></dependencies><build><plugins><plugin><groupId>org.apache.maven.plugins</groupId><artifactId>maven-shade-plugin</artifactId><version>2.1</version><executions><execution><phase>package</phase><goals><goal>shade</goal></goals><configuration><transformers><transformerimplementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer"><mainClass>hello.HelloWorld</mainClass></transformer></transformers></configuration></execution></executions></plugin></plugins></build></project>`
```



<table>
<tbody>
<tr>
<td class="icon">  </td>
<td class="content"> The completed **pom.xml** file is using the [Maven Shade Plugin](https://maven.apache.org/plugins/maven-shade-plugin/) for the simple convenience of making the JAR file executable. The focus of this guide is getting started with Maven, not using this particular plugin. </td>
</tr>
</tbody>
</table>



## Summary

## 总结

Congratulations! You’ve created a simple yet effective Maven project definition for building Java projects.

恭喜你!您已经创建了一个简单但有效的Maven项目定义构建Java项目。

## See Also

## 另请参阅

The following guides may also be helpful:

以下指南也可能是有用的:

*   [Building Java Projects with Gradle](https://spring.io/guides/gs/gradle/)

*(与Gradle构建Java项目)(https://spring.io/guides/gs/gradle/)

原文链接: <https://spring.io/guides/gs/maven/>



