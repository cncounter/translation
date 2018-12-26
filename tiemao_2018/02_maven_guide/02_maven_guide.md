# Building Java Projects with Maven

# Maven项目构建入门

This guide walks you through using Maven to build a simple Java project.

本文演示如何通过Maven,来构建一个简单的Java项目。


You’ll create an application that provides the time of day and then build it with Maven.

我们使用Maven, 来构建创建一个简单的应用程序, 展示当前的时间。

## What you’ll need

## 环境准备

*   A favorite text editor or IDE
*   [JDK 6](http://www.oracle.com/technetwork/java/javase/downloads/index.html) or later

* 准备一款常用的文本编辑器, 当然有IDE也行,比如Idea或者Eclipse;
* 安装 [JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html)  6.0或更高版本, 并设置好 `JAVA_HOME` 环境变量;

## How to complete this guide

## 如何完成

Like most Spring [Getting Started guides](/guides), you can start from scratch and complete each step, or you can bypass basic setup steps that are already familiar to you. Either way, you end up with working code.

本文摘自于Spring官方网站的[Maven教程](https://spring.io/guides/gs/maven/), 可以从头开始, 也可以跳过某些步骤. 到最后,工作目录中的代码应该是基本一致的。


*   [Download](https://github.com/spring-guides/gs-maven/archive/master.zip) and unzip the source repository for this guide, or clone it using [Git](/understanding/Git): `git clone [https://github.com/spring-guides/gs-maven.git](https://github.com/spring-guides/gs-maven.git)`
*   cd into `gs-maven/initial`

* 首先, 下载并解压项目包, <https://github.com/spring-guides/gs-maven/archive/master.zip>,  当然, 直接使用git克隆也行; `git clone https://github.com/spring-guides/gs-maven.git`
* 切换工作目录: `cd gs-maven/initial`

`initial`中是初始代码, 跟着后面的步骤执行;

**When you’re finished**, you can check your results against the code in `gs-maven/complete`.

最终的代码结构, 请参考 `gs-maven/complete` 目录。

## Set up the project

## 配置项目结构

First you’ll need to setup a Java project for Maven to build. To keep the focus on Maven, make the project as simple as possible for now. Create this structure in a project folder of your choosing.

首先你需要设置Maven构建的Java项目。我们的目的是学习Maven, 所以项目会非常简单。

### Create the directory structure

### 创建项目目录结构

In a project directory of your choosing, create the following subdirectory structure; for example, with `mkdir -p src/main/java/hello` on *nix systems:

在工作目录中, 创建如下的目录结构; 在Linux或者Mac中可以使用命令: `mkdir -p src/main/java/hello`:

```
└── src
    └── main
        └── java
            └── hello
```



Within the `src/main/java/hello` directory, you can create any Java classes you want. To maintain consistency with the rest of this guide, create these two classes: `HelloWorld.java` and `Greeter.java`.

其中, `src/main/java` 是Java源代码目录, `/hello` 则是对应的包名;

在 `hello` 包/目录下, 创建两个类: 

> `src/main/java/hello/HelloWorld.java`


```
package hello;

public class HelloWorld {
    public static void main(String[] args) {
        Greeter greeter = new Greeter();
        System.out.println(greeter.sayHello());
    }
}
```



> `src/main/java/hello/Greeter.java`



```
package hello;

public class Greeter {
    public String sayHello() {
        return "Hello world!";
    }
}
```



Now that you have a project that is ready to be built with Maven, the next step is to install Maven.

Maven项目的基本结构创建好了。

下面我们来安装Maven。

Maven is downloadable as a zip file at [http://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi). Only the binaries are required, so look for the link to apache-maven-_{version}_-bin.zip or apache-maven-_{version}_-bin.tar.gz.

Maven的下载页面是: <http://maven.apache.org/download.cgi>. 我们需要下载对应的压缩包bin文件。根据平台,对应的是 `apache-maven-_{version}_-bin.zip` 或者 `apache-maven-_{version}_-bin.tar.gz`。

Once you have downloaded the zip file, unzip it to your computer. Then add the _bin_ folder to your path.

下载之后解压。然后将解压后对应的 `bin` 目录全路径, 加到系统环境变量path中。

To test the Maven installation, run `mvn` from the command-line:

要验证Maven是否安装正确, 在命令行中执行 `mvn` 命令即可:


```
mvn -v
```


If all goes well, you should be presented with some information about the Maven installation. It will look similar to (although perhaps slightly different from) the following:

如果安装正确, 则可以看到Maven相关的信息。类似这样:

```
Apache Maven 3.3.9 (bb52d8502b132ec0a5a3f4c09453c07478323dc5; 2015-11-10T16:41:47+00:00)
Maven home: /home/dsyer/Programs/apache-maven
Java version: 1.8.0_152, vendor: Azul Systems, Inc.
Java home: /home/dsyer/.sdkman/candidates/java/8u152-zulu/jre
Default locale: en_GB, platform encoding: UTF-8
OS name: "linux", version: "4.15.0-36-generic", arch: "amd64", family: "unix"
```


Congratulations! You now have Maven installed.

Maven安装很简单, 应该没多大问题。

## Define a simple Maven build

## 定义简单的Maven构建

Now that Maven is installed, you need to create a Maven project definition. Maven projects are defined with an XML file named _pom.xml_. Among other things, this file gives the project’s name, version, and dependencies that it has on external libraries.

安装Maven之后, 我们需要定义一个Maven项目。Maven项目的定义, 使用一个XML文件, 名为 `pom.xml`. 在这个文件中, 配置项目名称,项目版本,以及需要依赖哪些外部库。

Create a file named _pom.xml_ at the root of the project (i.e. put it next to the `src` folder) and give it the following contents:

在项目的根目录下创建 `pom.xml` 文件。和 `src` 目录平级, 内容如下:

> `pom.xml`, 直接拷贝即可;

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.springframework</groupId>
    <artifactId>gs-maven</artifactId>
    <packaging>jar</packaging>
    <version>0.1.0</version>

    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>2.1</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <transformers>
                                <transformer
                                    implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass>hello.HelloWorld</mainClass>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```



With the exception of the optional `<packaging>` element, this is the simplest possible _pom.xml_ file necessary to build a Java project. It includes the following details of the project configuration:

除了 `<packaging>` 是可选的, 其他的顶级元素都是 `pom.xml` 必须的元素. 说明如下:

*   `<modelVersion>`. POM model version (always 4.0.0).
*   `<groupId>`. Group or organization that the project belongs to. Often expressed as an inverted domain name.
*   `<artifactId>`. Name to be given to the project’s library artifact (for example, the name of its JAR or WAR file).
*   `<version>`. Version of the project that is being built.
*   `<packaging>` - How the project should be packaged. Defaults to "jar" for JAR file packaging. Use "war" for WAR file packaging.


*   `<modelVersion>`, POM模型版本号(固定为 4.0.0)。
*   `<groupId>`, 该项目所属的项目组或者组织。和Java的基本包名类似, 一般使用网站域名的反转, 如 [`com.cncounter`](http://www.cncounter.com)。
*   `<artifactId>`, 项目的名字, 一般会设置为 JAR/WAR 包的名字。
*   `<version>`, 版本的构建项目号。
*   `<packaging>` —— 打包类型, 告诉Maven如何打包项目。默认为 `jar`, 即打包为JAR文件。如果需要打包为WAR文件, 则设置为 `war`。

> When it comes to choosing a versioning scheme, Spring recommends the [semantic versioning](http://semver.org) approach.

> Spring组织推荐使用 [语义化版本号](http://semver.org)。



At this point you have a minimal, yet capable Maven project defined.

现在, 我们有了一个最简单的, 可用的Maven项目定义模板。

## Build Java code

## 构建Java代码

Maven is now ready to build the project. You can execute several build lifecycle goals with Maven now, including goals to compile the project’s code, create a library package (such as a JAR file), and install the library in the local Maven dependency repository.

现在可以使用Maven来构建项目了. Maven可以执行多个构建目标, 比如编译代码(compile),打包(package), 安装到本地Maven仓库。

To try out the build, issue the following at the command line:

我们可以在命令行中, 切换到项目目录, 然后执行:


```
mvn compile
```



This will run Maven, telling it to execute the _compile_ goal. When it’s finished, you should find the compiled _.class_ files in the _target/classes_ directory.

这个命令会启动Maven, 并告诉它, 你的目标是进行编译(`compile`)。 执行完成之后, 就可以在 `target/classes` 目录下找到对应的 `.class` 文件。

Since it’s unlikely that you’ll want to distribute or work with _.class_ files directly, you’ll probably want to run the _package_ goal instead:

一般不直接使用 `.class` 文件, 而是会进行打包(`package`):



```
mvn package
```



The _package_ goal will compile your Java code, run any tests, and finish by packaging the code up in a JAR file within the _target_ directory. The name of the JAR file will be based on the project’s `<artifactId>` and `<version>`. For example, given the minimal _pom.xml_ file from before, the JAR file will be named _gs-maven-0.1.0.jar_.

`package`目标, 将会编译Java代码, 执行所有测试用例(除非指定 `-DskipTests`之类的参数), 并将编译后的文件打包为 JAR, 放到 `target` 目录下。

JAR文件的名称取决于项目的 `<artifactId>`和`<version>`属性。例如, 基于前面的 `pom.xml` 文件, JAR文件的名字默认是 `gs-maven-0.1.0.jar`。

```
    <artifactId>gs-maven</artifactId>
    <version>0.1.0</version>
```

> If you’ve changed the value of `<packaging>` from "jar" to "war", the result will be a WAR file within the _target_ directory instead of a JAR file. 

> 如果将`<packaging>` 的值修改为 `war`, 则会在 `target` 目录下生成WAR文件。


Maven also maintains a repository of dependencies on your local machine (usually in a _.m2/repository_ directory in your home directory) for quick access to project dependencies. If you’d like to install your project’s JAR file to that local repository, then you should invoke the `install` goal:

Maven在还维护着一个本地仓库, 一般位于当前用户HomePod目录下的 `.m2/repository` 子目录中, 如 `C:\Users\Administrator\.m2\repository`, 本质是一个镜像缓存, 以方便快速获取到项目的依赖. 如果想将项目的JAR文件安装到本地仓库, 可以指定 `install` 目标:



```
mvn install
```


The _install_ goal will compile, test, and package your project’s code and then copy it into the local dependency repository, ready for another project to reference it as a dependency.

`install` 目标包含编译(`compile`)、测试(`test`)和打包(`package`), 并且将打包后的文件安装到本地仓库, 这样的话, 依赖这个项目的其他项目, 就可以直接在本机使用了。

Speaking of dependencies, now it’s time to declare dependencies in the Maven build.

说到依赖, 我们先来看看如何声明Maven项目的依赖关系。

## Declare Dependencies

## 声明项目依赖

The simple Hello World sample is completely self-contained and does not depend on any additional libraries. Most applications, however, depend on external libraries to handle common and complex functionality.

上面的简单示例中, Hello World 是完全独立的, 不依赖任何第三方库. 但在实际应用中, 很多项目都会依赖外部库, 以处理和实现各种复杂的功能。

For example, suppose that in addition to saying "Hello World!", you want the application to print the current date and time. While you could use the date and time facilities in the native Java libraries, you can make things more interesting by using the Joda Time libraries.

例如, 需要打印当前的日期和时间. 当然,我们可以使用JDK自带的日期和时间相关的类, 但也可以使用Joda Time库,让编程更节省生命。

First, change HelloWorld.java to look like this:

首先, 修改 `HelloWorld.java` 文件的内容:

> `src/main/java/hello/HelloWorld.java`


```
package hello;

import org.joda.time.LocalTime;

public class HelloWorld {
    public static void main(String[] args) {
        LocalTime currentTime = new LocalTime();
        System.out.println("The current local time is: " + currentTime);
        Greeter greeter = new Greeter();
        System.out.println(greeter.sayHello());
    }
}
```



Here `HelloWorld` uses Joda Time’s `LocalTime` class to get and print the current time.

在这里, `HelloWorld`使用了 Joda Time 库中的 `LocalTime`类, 来打印当前时间。

If you were to run `mvn compile` to build the project now, the build would fail because you’ve not declared Joda Time as a compile dependency in the build. You can fix that by adding the following lines to _pom.xml_ (within the `<project>` element):

如果我们执行 `mvn compile` 命令来构建项目, 则会提示编译失败, 因为没有将 Joda Time 声明为项目依赖, 编译程序完全不知道去哪里找对应的类。

然后我们修改一下 `pom.xml` 文件, 在 `<project>` 中添加子元素:



```
<dependencies>
        <dependency>
            <groupId>joda-time</groupId>
            <artifactId>joda-time</artifactId>
            <version>2.9.2</version>
        </dependency>
</dependencies>
```



This block of XML declares a list of dependencies for the project. Specifically, it declares a single dependency for the Joda Time library. Within the `<dependency>` element, the dependency coordinates are defined by three sub-elements:

这段XML声明了项目的依赖列表。当然在这里只是列出了一个 `joda-time` 依赖库。`<dependency>` 元素一般包含三个子元素:

*   `<groupId>` - The group or organization that the dependency belongs to.
*   `<artifactId>` - The library that is required.
*   `<version>` - The specific version of the library that is required.


*   `<groupId>` —— 依赖项所属的团体或组织标识。
*   `<artifactId>` —— 依赖项的标识。
*   `<version>` —— 依赖项的版本号。

By default, all dependencies are scoped as `compile` dependencies. That is, they should be available at compile-time (and if you were building a WAR file, including in the _/WEB-INF/libs_ folder of the WAR). Additionally, you may specify a `<scope>` element to specify one of the following scopes:

默认情况下, 依赖的生命周期(`scope`) 是 `compile`, 即编译时就依赖。如果构建一个WAR文件, 则会放到 `/WEB-INF/libs` 目录中。

当然,也可以通过`<scope>`元素指定具体的范围:

*   `provided` - Dependencies that are required for compiling the project code, but that will be provided at runtime by a container running the code (e.g., the Java Servlet API).
*   `test` - Dependencies that are used for compiling and running tests, but not required for building or running the project’s runtime code.

* `provided` —— 由运行时环境提供, 该依赖项在编译时就需要提供, 但在运行时由执行的容器提供(也就是说, 该依赖不会被打包到WAR包之中), 例如, Java Servlet API。
* `test` —— 测试时依赖, 该依赖项用于编译和运行测试, 但在正式的运行时代码中不是必须的。


Now if you run `mvn compile` or `mvn package`, Maven should resolve the Joda Time dependency from the Maven Central repository and the build will be successful.

再次执行 `mvn compile` 或 `mvn package`, Maven应该就能解决Joda Time对应的依赖, 然后构建成功。

## Write a Test

## 编写测试用例

First add JUnit as a dependency to your pom.xml, in the test scope:

首先需要在 `pom.xml` 文件中添加 JUnit 依赖项。并指定 `scope` 为 `test`:



```
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
    <scope>test</scope>
</dependency>
```



Then create a test case like this:

然后,编写测试用例文件:

> `src/test/java/hello/GreeterTest.java`


```
package hello;

import static org.hamcrest.CoreMatchers.containsString;
import static org.junit.Assert.*;

import org.junit.Test;

public class GreeterTest {

    private Greeter greeter = new Greeter();

    @Test
    public void greeterSaysHello() {
        assertThat(greeter.sayHello(), containsString("Hello"));
    }

}
```



Maven uses a plugin called "surefire" to run unit tests. The default configuration of this plugin compiles and runs all classes in `src/test/java` with a name matching `*Test`. You can run the tests on the command line like this

Maven使用 "`surefire`" 插件来运行单元测试。这个插件默认会编译并执行 `src/test/java` 目录下, 所有匹配 `*Test` 这种类名的class。

通过命令行启动Maven测试:


```
mvn test
```


or just use `mvn install` step as we already showed above (there is a lifecycle definition where "test" is included as a stage in "install").

或者是 `mvn install`, `mvn package` 等等, 因为这种目标, 默认包含了 `test` 阶段。

Here’s the completed `pom.xml` file:

下面给出完整的`pom.xml`文件内容:

> `pom.xml`



```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>org.springframework</groupId>
  <artifactId>gs-maven</artifactId>
  <packaging>jar</packaging>
  <version>0.1.0</version>

  <properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    <!-- tag::joda[] -->
    <dependency>
      <groupId>joda-time</groupId>
      <artifactId>joda-time</artifactId>
      <version>2.9.2</version>
    </dependency>
    <!-- end::joda[] -->
    <!-- tag::junit[] -->
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
      <scope>test</scope>
    </dependency>
    <!-- end::junit[] -->
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <version>2.1</version>
        <executions>
          <execution>
            <phase>package</phase>
            <goals>
              <goal>shade</goal>
            </goals>
            <configuration>
              <transformers>
                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                  <mainClass>hello.HelloWorld</mainClass>
                </transformer>
              </transformers>
            </configuration>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>

</project>
```


> The completed **pom.xml** file is using the [Maven Shade Plugin](https://maven.apache.org/plugins/maven-shade-plugin/) for the simple convenience of making the JAR file executable. The focus of this guide is getting started with Maven, not using this particular plugin. 

> 这个 `pom.xml` 中使用了 [Maven Shade Plugin](https://maven.apache.org/plugins/maven-shade-plugin/), 通过这个插件, 可以打包可执行JAR文件。 如果不喜欢, 可以将这个插件的内容移除。


## Summary

## 总结

Congratulations! You’ve created a simple yet effective Maven project definition for building Java projects.

很简单吧! 我们创建了一个简单的Maven项目, 能跑起来那就是好项目。

## See Also

## 相关链接


*   [Building Java Projects with Gradle](https://spring.io/guides/gs/gradle/)
*   [使用 Gradle 构建Java项目](https://spring.io/guides/gs/gradle/)

原文链接: <https://spring.io/guides/gs/maven/>



