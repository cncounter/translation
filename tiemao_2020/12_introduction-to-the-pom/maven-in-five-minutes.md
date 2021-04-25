## Maven in 5 Minutes

## MAVEN基础系列（〇） Maven五分钟入门教程

相关文章:

- [MAVEN基础系列（〇） Maven五分钟入门教程](./maven-in-five-minutes.md)
- [MAVEN基础系列（一） 项目构建的各个阶段](./introduction-to-the-lifecycle.md)
- [MAVEN基础系列（二） POM文件](./README.md)
- [MAVEN基础系列（三） 按环境Profiles打包](./introduction-to-profiles.md)
- [MAVEN基础系列（四） 标准目录结构](./standard-directory-layout.md)
- [MAVEN基础系列（五） 浅析pom依赖机制](./introduction-to-dependency-mechanism.md)
- [MAVEN基础系列（六） 依赖项排除与可选依赖](./optional-and-excludes-dependencies.md)

### Prerequisites

You must have an understanding of how to install software on your computer. If you do not know how to do this, please ask someone at your office, school, etc or pay someone to explain this to you. The Maven mailing lists are not the best place to ask for this advice.

### 1. 基础知识准备

要想使用Maven, 至少应该了解如何安装软件。 如果不知道怎么安装软件, 请咨询你的同事、同学、或者带你入门的人。

### Installation

Maven is a Java tool, so you must have [Java](https://www.oracle.com/technetwork/java/javase/downloads/index.html) installed in order to proceed.

First, [download Maven](https://maven.apache.org/download.html) and follow the [installation instructions](https://maven.apache.org/install.html). After that, type the following in a terminal or in a command prompt:

### 2. Maven安装与配置

Maven是一款Java工具, 因此必须先安装JDK, 可参考: [Windows下载安装JDK](https://github.com/cncounter/translation/blob/master/tiemao_2014/Win_JDK7/Win_JDK7.md)。

安装步骤很简单, 细节信息可参考 [Apache Maven 安装说明](https://maven.apache.org/install.html) 页面:

- 1. 打开 [Maven下载页面](https://maven.apache.org/download.html)。
- 2. 找到相关的文件, 例如 `apache-maven-3.8.1-bin.zip` 之类的文件, 记住是 bin, 不是src文件。
- 3. 下载并解压到某个英文目录。
- 4. 将Maven发行包解压后的bin目录加入到系统路径 `PATH` 中。
- 5. 验证安装, 在命令行或者shell终端执行以下脚本:

```
mvn --version
```

It should print out your installed version of Maven, for example:

如果配置正确, 会输出安装完成的Maven版本信息, 例如：

```
$ mvn --version
Apache Maven 3.6.1 (d66c9c0b3152b2e69ee9bac180bb8fcc8e6af555; 2019-04-05T03:00:29+08:00)
Maven home: /Users/renfufei/SOFT_ALL/apache-maven-3.6.1
Java version: 1.8.0_162, vendor: Oracle Corporation, runtime: /Library/Java/JavaVirtualMachines/jdk1.8.0_162.jdk/Contents/Home/jre
Default locale: zh_CN, platform encoding: UTF-8
OS name: "mac os x", version: "10.14.5", arch: "x86_64", family: "mac"
```

Depending upon your network setup, you may require extra configuration. Check out the [Guide to Configuring Maven](https://maven.apache.org/guides/mini/guide-configuring-maven.html) if necessary.

> If you are using Windows, you should look at [Windows Prerequisites](https://maven.apache.org/guides/getting-started/windows-prerequisites.html) to ensure that you are prepared to use Maven on Windows.

如果网络环境不同, 可能需要额外的配置。 有问题的话, 也可以参考 [Maven配置指南](https://maven.apache.org/guides/mini/guide-configuring-maven.html)。

> 如果使用的是 Windows 操作系统, 则需要查看 [Windows环境配置](https://maven.apache.org/guides/getting-started/windows-prerequisites.html), 确保配置好Maven。

### Creating a Project

You will need somewhere for your project to reside, create a directory somewhere and start a shell in that directory. On your command line, execute the following Maven goal:

### 创建一个项目

您将需要将项目放置在某个地方, 在某个地方创建一个目录, 然后在该目录中启动Shell。 在命令行上, 执行以下Maven目标：

```
mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=my-app -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

If you have just installed Maven, it may take a while on the first run. This is because Maven is downloading the most recent artifacts (plugin jars and other files) into your local repository. You may also need to execute the command a couple of times before it succeeds. This is because the remote server may time out before your downloads are complete. Don't worry, there are ways to fix that.

You will notice that the *generate* goal created a directory with the same name given as the artifactId. Change into that directory.

如果您刚刚安装了Maven, 则第一次运行可能需要一段时间。 这是因为Maven正在将最新的工件（插件jar和其他文件）下载到本地存储库中。 您可能还需要执行几次命令才能成功。 这是因为远程服务器可能会在下载完成之前超时。 不用担心, 有解决此问题的方法。

您会注意到* generate *目标创建了一个目录, 该目录具有与artifactId相同的名称。 转到该目录。

```
cd my-app
```

Under this directory you will notice the following [standard project structure](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html).

在此目录下, 您会注意到以下[标准项目结构]（https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html）。

```
my-app
|-- pom.xml
`-- src
    |-- main
    |   `-- java
    |       `-- com
    |           `-- mycompany
    |               `-- app
    |                   `-- App.java
    `-- test
        `-- java
            `-- com
                `-- mycompany
                    `-- app
                        `-- AppTest.java
```

The `src/main/java` directory contains the project source code, the `src/test/java` directory contains the test source, and the `pom.xml` file is the project's Project Object Model, or POM.

src / main / java目录包含项目源代码, src / test / java目录包含测试源, pom.xml文件是项目的项目对象模型或POM。

#### The POM

The `pom.xml` file is the core of a project's configuration in Maven. It is a single configuration file that contains the majority of information required to build a project in just the way you want. The POM is huge and can be daunting in its complexity, but it is not necessary to understand all of the intricacies just yet to use it effectively. This project's POM is:

#### POM

pom.xml文件是Maven中项目配置的核心。 它是一个配置文件, 其中包含以所需方式构建项目所需的大多数信息。 POM非常庞大, 其复杂性可能令人生畏, 但不必有效地使用它就不必了解所有复杂性。 该项目的POM为：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.mycompany.app</groupId>
  <artifactId>my-app</artifactId>
  <version>1.0-SNAPSHOT</version>

  <properties>
    <maven.compiler.source>1.7</maven.compiler.source>
    <maven.compiler.target>1.7</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
```

#### What did I just do?

You executed the Maven goal *archetype:generate*, and passed in various parameters to that goal. The prefix *archetype* is the [plugin](https://maven.apache.org/plugins/index.html) that provides the goal. If you are familiar with [Ant](http://ant.apache.org/), you may conceive of this as similar to a task. This *archetype:generate* goal created a simple project based upon a [maven-archetype-quickstart](https://maven.apache.org/archetypes/maven-archetype-quickstart/) archetype. Suffice it to say for now that a *plugin* is a collection of *goals* with a general common purpose. For example the jboss-maven-plugin, whose purpose is "deal with various jboss items".

#### 我刚刚做了什么？

您执行了Maven目标* archetype：generate *, 并将各种参数传递给该目标。 前缀* archetype *是提供目标的[plugin]（https://maven.apache.org/plugins/index.html）。 如果您熟悉[Ant]（http://ant.apache.org/）, 您可能会认为这类似于一项任务。 这个[原型：生成]目标基于[maven-archetype-quickstart]（https://maven.apache.org/archetypes/maven-archetype-quickstart/）原型创建了一个简单的项目。 现在就可以说* plugin *是具有通用目的的* goals *的集合。 例如jboss-maven-plugin, 其目的是“处理各种jboss项目”。

#### Build the Project

####建立专案

```
mvn package
```

The command line will print out various actions, and end with the following:

命令行将打印出各种操作, 并以以下内容结束：

```
 ...
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  2.953 s
[INFO] Finished at: 2019-11-24T13:05:10+01:00
[INFO] ------------------------------------------------------------------------
```

Unlike the first command executed (*archetype:generate*) you may notice the second is simply a single word - *package*. Rather than a *goal*, this is a *phase*. A phase is a step in the [build lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html), which is an ordered sequence of phases. When a phase is given, Maven will execute every phase in the sequence up to and including the one defined. For example, if we execute the *compile* phase, the phases that actually get executed are:

与执行的第一个命令不同（* archetype：generate *）, 您可能会注意到第二个命令只是一个单词-* package *。 而不是目标, 这是一个阶段。 阶段是[构建生命周期]（https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html）中的步骤, 这是阶段的有序序列。 当给出一个阶段时, Maven将执行序列中的每个阶段, 直到并包括所定义的阶段。 例如, 如果执行* compile *阶段, 则实际执行的阶段为：

1. validate
2. generate-sources
3. process-sources
4. generate-resources
5. process-resources
6. compile

You may test the newly compiled and packaged JAR with the following command:

您可以使用以下命令测试新编译和打包的JAR：

```
java -cp target/my-app-1.0-SNAPSHOT.jar com.mycompany.app.App
```

Which will print the quintessential:

它将打印出最典型的内容：

```
Hello World!
```

### Java 9 or later

By default your version of Maven might use an old version of the `maven-compiler-plugin` that is not compatible with Java 9 or later versions. To target Java 9 or later, you should at least use version 3.6.0 of the `maven-compiler-plugin` and set the `maven.compiler.release` property to the Java release you are targetting (e.g. 9, 10, 11, 12, etc.).

In the following example, we have configured our Maven project to use version 3.8.1 of `maven-compiler-plugin` and target Java 11:

### Java 9或更高版本

默认情况下, 您的Maven版本可能使用与Java 9或更高版本不兼容的旧版本的“ maven-compiler-plugin”。 要定位Java 9或更高版本, 您至少应使用`maven-compiler-plugin'的3.6.0版本, 并将`maven.compiler.release`属性设置为您要定位的Java版本（例如9、10、11）。 , 12等）。

在以下示例中, 我们已将Maven项目配置为使用`maven-compiler-plugin`版本3.8.1, 并以Java 11为目标：

```xml
    <properties>
        <maven.compiler.release>11</maven.compiler.release>
    </properties>

    <build>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.8.1</version>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
```

To learn more about `javac`'s `--release` option, see [JEP 247](https://openjdk.java.net/jeps/247).

要了解有关Javac的--release选项的更多信息, 请参见[JEP 247]（https://openjdk.java.net/jeps/247）。

### Running Maven Tools

#### Maven Phases

Although hardly a comprehensive list, these are the most common *default* lifecycle phases executed.

### 运行Maven工具

#### Maven阶段

尽管这不是一个完整的列表, 但它们是最常见的* default *生命周期阶段。

- `validate`: validate the project is correct and all necessary information is available
- `compile`: compile the source code of the project
- `test`: test the compiled source code using a suitable unit testing framework. These tests should not require the code be packaged or deployed
- `package`: take the compiled code and package it in its distributable format, such as a JAR.
- `integration-test`: process and deploy the package if necessary into an environment where integration tests can be run
- `verify`: run any checks to verify the package is valid and meets quality criteria
- `install`: install the package into the local repository, for use as a dependency in other projects locally
- `deploy`: done in an integration or release environment, copies the final package to the remote repository for sharing with other developers and projects.

- `validate`：验证项目是否正确并且所有必要的信息均可用
- `compile`：编译项目的源代码
- `test`：使用合适的单元测试框架测试编译后的源代码。 这些测试不应要求将代码打包或部署
- `package`：获取编译后的代码并将其打包为可分发格式, 例如JAR。
- `integration-test`：处理软件包并将其部署到可以运行集成测试的环境中
- `verify`：运行任何检查以验证包装是否有效并符合质量标准
- `install`：将软件包安装到本地存储库中, 以作为本地其他项目中的依赖项
- `deploy`：在集成或发布环境中完成, 将最终软件包复制到远程存储库中, 以便与其他开发人员和项目共享。

There are two other Maven lifecycles of note beyond the *default* list above. They are

- `clean`: cleans up artifacts created by prior builds

- `site`: generates site documentation for this project

除了上面的* default *列表以外, 还有其他两个Maven生命周期值得注意。 他们是

- `clean`：清理先前构建创建的工件

- `site`：为该项目生成站点文档

Phases are actually mapped to underlying goals. The specific goals executed per phase is dependant upon the packaging type of the project. For example, *package* executes *jar:jar* if the project type is a JAR, and *war:war* if the project type is - you guessed it - a WAR.

An interesting thing to note is that phases and goals may be executed in sequence.

阶段实际上映射到基本目标。 每个阶段执行的特定目标取决于项目的包装类型。 例如, 如果项目类型是JAR, * package *将执行* jar：jar *, 如果项目类型是-您猜到了-WAR, 则将执行* war：war *。

需要注意的有趣一点是, 阶段和目标可以按顺序执行。

```
mvn clean dependency:copy-dependencies package
```

This command will clean the project, copy dependencies, and package the project (executing all phases up to *package*, of course).

该命令将清除项目, 复制依赖关系, 并对项目进行打包（当然, 执行所有阶段, 直到* package *为止）。

#### Generating the Site

#### 生成站点

```
mvn site
```

This phase generates a site based upon information on the project's pom. You can look at the documentation generated under `target/site`.

此阶段根据有关项目pom的信息生成一个站点。 您可以查看在“ target / site”下生成的文档。

### Conclusion

We hope this quick overview has piqued your interest in the versatility of Maven. Note that this is a very truncated quick-start guide. Now you are ready for more comprehensive details concerning the actions you have just performed. Check out the [Maven Getting Started Guide](https://maven.apache.org/guides/getting-started/index.html).

### 结论

我们希望这篇快速的概述引起您对Maven多功能性的兴趣。 请注意, 这是一本截短的快速入门指南。 现在, 您可以准备有关刚刚执行的操作的更全面的详细信息。 请查看[Maven入门指南]（https://maven.apache.org/guides/getting-started/index.html）。





### 参考链接

原文链接: <https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html>
