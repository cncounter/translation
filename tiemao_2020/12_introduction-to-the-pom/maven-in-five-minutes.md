## Maven in 5 Minutes

## MAVEN基础系列（〇）Maven五分钟入门教程

相关文章:

- [MAVEN基础系列（〇）Maven五分钟入门教程](./maven-in-five-minutes.md)
- [MAVEN基础系列（一）项目构建的各个阶段](./introduction-to-the-lifecycle.md)
- [MAVEN基础系列（二）POM文件](./README.md)
- [MAVEN基础系列（三）按环境Profiles打包](./introduction-to-profiles.md)
- [MAVEN基础系列（四）标准的Maven项目结构](./standard-directory-layout.md)
- [MAVEN基础系列（五）浅析pom依赖机制](./introduction-to-dependency-mechanism.md)
- [MAVEN基础系列（六）依赖项排除与可选依赖](./optional-and-excludes-dependencies.md)

### Prerequisites

You must have an understanding of how to install software on your computer. If you do not know how to do this, please ask someone at your office, school, etc or pay someone to explain this to you. The Maven mailing lists are not the best place to ask for this advice.

### 1. 基础知识准备

要想使用Maven, 至少应该了解如何安装软件。 如果不知道怎么安装软件, 请咨询你的同事、同学、或者带你入门的人。

### Installation

Maven is a Java tool, so you must have [Java](https://www.oracle.com/technetwork/java/javase/downloads/index.html) installed in order to proceed.

First, [download Maven](https://maven.apache.org/download.html) and follow the [installation instructions](https://maven.apache.org/install.html). After that, type the following in a terminal or in a command prompt:

### 2. Maven安装与配置

Maven是一款Java工具, 因此必须先安装JDK, 可参考: [Windows下载安装JDK](https://github.com/cncounter/translation/blob/master/tiemao_2014/Win_JDK7/Win_JDK7.md)。

安装步骤很简单, 细节信息可参考 [Apache Maven 安装说明](https://maven.apache.org/install.html):

- 1. 打开 [Maven下载页面](https://maven.apache.org/download.html)。
- 2. 找到相关的文件, 例如 `apache-maven-3.8.1-bin.zip` 之类的文件, 记住是 bin, 不是src文件。
- 3. 下载并解压到某个英文目录。
- 4. 将Maven发行包解压后的bin目录加到系统路径 `PATH` 中。
- 5. 验证安装, 在命令行或者shell终端执行以下脚本:

```
mvn --version
```

It should print out your installed version of Maven, for example:

如果配置正确, 会输出安装完成的Maven版本信息, 例如:

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

### 3. 初始化Maven项目

首先需要准备好工作目录, 可以使用 `mkdir -p xxxxxx` 之类的命令。 然后在该目录中启动Shell。 在命令行中执行以下Maven目标:

```
mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=my-app -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

If you have just installed Maven, it may take a while on the first run. This is because Maven is downloading the most recent artifacts (plugin jars and other files) into your local repository. You may also need to execute the command a couple of times before it succeeds. This is because the remote server may time out before your downloads are complete. Don't worry, there are ways to fix that.

You will notice that the *generate* goal created a directory with the same name given as the artifactId. Change into that directory.

如果刚刚安装Maven, 则第一次执行需要等待一段时间。 因为Maven需要将最新的组件(artifact, 比如 plugin和其他文件)下载到本地。
如果网络不好, 从远程服务器下载某些文件会超时, 可能需要重复执行几次才会成功。 当然, 这有其他解决办法, 这里先不管。

generate 目标命令执行成功后, 可以看到创建了一个目录,  目录名称就是 artifactId 的值。

我们使用 cd 命令切换到这个目录。

```
cd my-app
```

Under this directory you will notice the following [standard project structure](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html).

使用 `ls -l` 或者 `dir` 命令, 或者通过文件查看器, 可以看到这是一个 [标准的Maven项目结构](./standard-directory-layout.md)。

```
my-app
~-- pom.xml
|-- src
    |-- main
        |-- java
        |   |-- com
        |       |-- mycompany
        |           |-- app
        |               ~-- App.java
    |-- test
        |-- java
        |    |-- com
        |        |-- mycompany
        |            |-- app
        |                ~-- AppTest.java
```

The `src/main/java` directory contains the project source code, the `src/test/java` directory contains the test source, and the `pom.xml` file is the project's Project Object Model, or POM.

- `src/main/java` 目录用于存放项目源代码
- `src/test/java` 目录则用于存放测试代码
- `pom.xml` 文件是项目的 Project Object Model(POM, 项目对象模型)。


#### The POM

The `pom.xml` file is the core of a project's configuration in Maven. It is a single configuration file that contains the majority of information required to build a project in just the way you want. The POM is huge and can be daunting in its complexity, but it is not necessary to understand all of the intricacies just yet to use it effectively. This project's POM is:

#### 3.1 项目对象模型(POM)

`pom.xml` 文件是Maven项目的核心配置。 这个配置文件中, 包含了构建Maven项目所需的大部分信息。
有些项目的POM文件非常庞大, 复杂性也非常高, 但作为初学者, 不需要了解这些复杂性。
我们生成的这个项目, POM大致如下:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.mycompany.app</groupId>
  <artifactId>my-app</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>my-app</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.7</maven.compiler.source>
    <maven.compiler.target>1.7</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <!-- ...... -->
</project>
```

#### What did I just do?

You executed the Maven goal *archetype:generate*, and passed in various parameters to that goal. The prefix *archetype* is the [plugin](https://maven.apache.org/plugins/index.html) that provides the goal. If you are familiar with [Ant](http://ant.apache.org/), you may conceive of this as similar to a task. This *archetype:generate* goal created a simple project based upon a [maven-archetype-quickstart](https://maven.apache.org/archetypes/maven-archetype-quickstart/) archetype. Suffice it to say for now that a *plugin* is a collection of *goals* with a general common purpose. For example the jboss-maven-plugin, whose purpose is "deal with various jboss items".

#### 3.2 简单介绍生成项目的参数

我们执行的Maven目标是 `archetype:generate`(原型:生成), 并传入了各种参数配置。
目标前缀 `archetype` 表示执行这个目标的 [plugin](https://maven.apache.org/plugins/index.html) 名称。
如果用过 [Ant](http://ant.apache.org/) 构建工具, 可以将目标看成是一项 task。
这个 `archetype:generate` 目标, 基于 [maven-archetype-quickstart](https://maven.apache.org/archetypes/maven-archetype-quickstart/) 原型创建了一个简单的项目。
可以说, plugin 就是组合了一堆 goals, 他们具有通用的目的。 例如 jboss-maven-plugin, 其目的就是 "处理各种jboss事项"。

#### Build the Project

#### 3.3 执行项目构建

```
mvn package
```

The command line will print out various actions, and end with the following:

这个命令执行时, 会打印各种操作的信息, 如果构建成功, 最后的输出内容会类似这样:

```
 ...
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  15.336 s
[INFO] Finished at: 2021-04-25T10:55:01+08:00
[INFO] ------------------------------------------------------------------------
```

Unlike the first command executed (*archetype:generate*) you may notice the second is simply a single word - *package*. Rather than a *goal*, this is a *phase*. A phase is a step in the [build lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html), which is an ordered sequence of phases. When a phase is given, Maven will execute every phase in the sequence up to and including the one defined. For example, if we execute the *compile* phase, the phases that actually get executed are:

我们这次执行的命令很简单,只有一个 `package`, 与前面执行的原型生成命令 `archetype:generate` 不太一样。
因为这不是目标(goal), 而是阶段(phase)。 阶段是[构建生命周期](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html) 中的一个步骤, 而且这些阶段是有顺序的。
给定一个阶段时, Maven将会按顺序从前面开始执行每个阶段, 一直到我们所指定的阶段。
例如, 执行 `compile` 阶段, 则实际执行的阶段包括:

1. validate
2. generate-sources
3. process-sources
4. generate-resources
5. process-resources
6. compile

You may test the newly compiled and packaged JAR with the following command:

我们可以用下面的命令来测试刚刚编译打包生成的JAR:

```
java -cp target/my-app-1.0-SNAPSHOT.jar com.mycompany.app.App
```

Which will print the quintessential:

输出的内容很经典:

```
Hello World!
```

### Java 9 or later

By default your version of Maven might use an old version of the `maven-compiler-plugin` that is not compatible with Java 9 or later versions. To target Java 9 or later, you should at least use version 3.6.0 of the `maven-compiler-plugin` and set the `maven.compiler.release` property to the Java release you are targetting (e.g. 9, 10, 11, 12, etc.).

In the following example, we have configured our Maven project to use version 3.8.1 of `maven-compiler-plugin` and target Java 11:

### 4. Java 9及更高版本

默认情况下使用的 `maven-compiler-plugin` 版本, 可能不支持Java 9或更高的版本。
要兼容 Java 9或更高版本, `maven-compiler-plugin' 至少需要 3.6.0 以上版本, 并将 `maven.compiler.release` 属性设置为目标Java版本(例如 9, 10, 11, 12, 15, 16 等等)。

在以下Maven项目配置示例中, 我们将使用 `maven-compiler-plugin` 的3.8.1版本, 并以Java 11为目标:

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

要了解  `javac`  的 `--release` 选项, 请参考规范 [JEP 247](https://openjdk.java.net/jeps/247)。


### Running Maven Tools

#### Maven Phases

Although hardly a comprehensive list, these are the most common *default* lifecycle phases executed.

### 5. 运行Maven工具

#### 5.1 Maven阶段

下面列出了 `default` 生命周期最常用的阶段, 当然, 这不是完整的列表。

- `validate`: validate the project is correct and all necessary information is available
- `compile`: compile the source code of the project
- `test`: test the compiled source code using a suitable unit testing framework. These tests should not require the code be packaged or deployed
- `package`: take the compiled code and package it in its distributable format, such as a JAR.
- `integration-test`: process and deploy the package if necessary into an environment where integration tests can be run
- `verify`: run any checks to verify the package is valid and meets quality criteria
- `install`: install the package into the local repository, for use as a dependency in other projects locally
- `deploy`: done in an integration or release environment, copies the final package to the remote repository for sharing with other developers and projects.

- `validate`: 验证项目是否正确, 以及所有必要的信息是否可用
- `compile`: 编译项目的源代码
- `test`: 使用合适的单元测试框架来测试编译后的代码。 这些测试不需要将代码打包或部署
- `package`: 获取编译后的代码, 并将其打包为可分发格式, 例如JAR。
- `integration-test`: 处理软件包, 并将其部署到可以运行集成测试的环境中
- `verify`: 运行各种检查, 以验证软件包是否有效并符合质量标准
- `install`: 将软件包安装到本地仓库中, 以作为其他本地项目的依赖项
- `deploy`: 在集成环境或发布环境中, 将最终的软件包部署到远程仓库中, 以便其他开发人员和项目共享。

There are two other Maven lifecycles of note beyond the *default* list above. They are

- `clean`: cleans up artifacts created by prior builds

- `site`: generates site documentation for this project

除了上面列出的 `default` 生命周期, 还有两个 Maven 生命周期需要关注:

- `clean`: 清理先前的项目构建所生成的文件

- `site`: 为该项目生成站点文档

Phases are actually mapped to underlying goals. The specific goals executed per phase is dependant upon the packaging type of the project. For example, *package* executes *jar:jar* if the project type is a JAR, and *war:war* if the project type is - you guessed it - a WAR.

An interesting thing to note is that phases and goals may be executed in sequence.

这些阶段实际上都映射到了各种基本目标。
每个阶段执行的特定目标取决于项目的打包类型。
例如, 如果打包类型是JAR, 那么 `package` 将执行 `jar:jar`, 如果打包类型是WAR, 则将执行 `war:war`。

需要注意的一点是, 阶段和目标可以按顺序执行。

```
mvn clean dependency:copy-dependencies package
```

This command will clean the project, copy dependencies, and package the project (executing all phases up to *package*, of course).

该命令将清理项目, 复制依赖, 并对项目进行打包(当然, 会执行所有阶段, 直到 `package` 为止)。

#### Generating the Site

#### 5.2 生成项目站点

```
mvn site
```

This phase generates a site based upon information on the project's pom. You can look at the documentation generated under `target/site`.

此阶段根据项目pom信息生成一个站点。 可以在 `target/site` 下查看生成的文档。

### Conclusion

We hope this quick overview has piqued your interest in the versatility of Maven. Note that this is a very truncated quick-start guide. Now you are ready for more comprehensive details concerning the actions you have just performed. Check out the [Maven Getting Started Guide](https://maven.apache.org/guides/getting-started/index.html).

### 6. 小结

希望这篇 Maven 快速入门的文章能引起您的兴趣。
更全面的信息, 请阅读后续的章节。




### 参考链接

原文链接: <https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html>
