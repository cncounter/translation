## Introduction to the POM

## MAVEN基础系列（二） POM文件

### What is a POM?

A Project Object Model or POM is the fundamental unit of work in Maven. It is an XML file that contains information about the project and configuration details used by Maven to build the project. It contains default values for most projects. Examples for this is the build directory, which is `target`; the source directory, which is `src/main/java`; the test source directory, which is `src/test/java`; and so on. When executing a task or goal, Maven looks for the POM in the current directory. It reads the POM, gets the needed configuration information, then executes the goal.

Some of the configuration that can be specified in the POM are the project dependencies, the plugins or goals that can be executed, the build profiles, and so on. Other information such as the project version, description, developers, mailing lists and such can also be specified.

### 2.1 POM定义

项目对象模型（Project Object Model，POM）是Maven的基本工作单元。
POM是一个XML文件，其中包含项目相关的信息，以及用于构建Maven项目的详细配置信息。
POM包含了一般项目所需的默认值。 例如构建目录是 `target`; 源代码目录是 `src/main/java`; 测试源码目录是 `src/test/java`; 等等。
当执行某个任务(task)或目标(goal)时，Maven会在当前目录下查找POM文件。 读取并解析POM文件，获取所需的配置信息，然后再执行。

在POM中可以指定项目的依赖项，插件，可执行目标，配置文件等等。 当然也可以指定其他信息，例如项目版本，描述，开发人员，邮件列表等。


### Super POM

The Super POM is Maven's default POM. All POMs extend the Super POM unless explicitly set, meaning the configuration specified in the Super POM is inherited by the POMs you created for your projects. The snippet below is the Super POM for Maven 3.5.4.

### 2.2 Super POM

Super POM可称为超级POM，是Maven的默认POM。 所有项目的POM都隐式继承 Super POM，除非明确指定。 也就是说 Super POM 中指定的配置都会被我们项目的的POM继承。 下面是 [Maven 3.6.3 的超级POM文件](https://maven.apache.org/ref/3.6.3/maven-model-builder/super-pom.html)。


```xml
<project>
  <modelVersion>4.0.0</modelVersion>

  <!-- 中央仓库的地址 -->
  <repositories>
    <repository>
      <id>central</id>
      <name>Central Repository</name>
      <url>https://repo.maven.apache.org/maven2</url>
      <layout>default</layout>
      <snapshots>
        <enabled>false</enabled>
      </snapshots>
    </repository>
  </repositories>

  <!-- 默认插件的中央仓库地址 -->
  <pluginRepositories>
    <pluginRepository>
      <id>central</id>
      <name>Central Repository</name>
      <url>https://repo.maven.apache.org/maven2</url>
      <layout>default</layout>
      <snapshots>
        <enabled>false</enabled>
      </snapshots>
      <releases>
        <updatePolicy>never</updatePolicy>
      </releases>
    </pluginRepository>
  </pluginRepositories>

  <!-- 默认目录相对位置; 以及默认插件版本号 -->
  <build>
    <directory>${project.basedir}/target</directory>
    <outputDirectory>${project.build.directory}/classes</outputDirectory>
    <finalName>${project.artifactId}-${project.version}</finalName>
    <testOutputDirectory>${project.build.directory}/test-classes</testOutputDirectory>
    <sourceDirectory>${project.basedir}/src/main/java</sourceDirectory>
    <scriptSourceDirectory>${project.basedir}/src/main/scripts</scriptSourceDirectory>
    <testSourceDirectory>${project.basedir}/src/test/java</testSourceDirectory>
    <resources>
      <resource>
        <directory>${project.basedir}/src/main/resources</directory>
      </resource>
    </resources>
    <testResources>
      <testResource>
        <directory>${project.basedir}/src/test/resources</directory>
      </testResource>
    </testResources>
    <pluginManagement>
      <!-- NOTE: These plugins will be removed from future versions of the super POM -->
      <!-- They are kept for the moment as they are very unlikely to conflict with lifecycle mappings (MNG-4453) -->
      <plugins>
        <plugin>
          <artifactId>maven-antrun-plugin</artifactId>
          <version>1.3</version>
        </plugin>
        <plugin>
          <artifactId>maven-assembly-plugin</artifactId>
          <version>2.2-beta-5</version>
        </plugin>
        <plugin>
          <artifactId>maven-dependency-plugin</artifactId>
          <version>2.8</version>
        </plugin>
        <plugin>
          <artifactId>maven-release-plugin</artifactId>
          <version>2.5.3</version>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>

  <reporting>
    <outputDirectory>${project.build.directory}/site</outputDirectory>
  </reporting>

  <!-- 默认配置信息 -->
  <profiles>
    <!-- NOTE: The release profile will be removed from future versions of the super POM -->
    <profile>
      <id>release-profile</id>

      <activation>
        <property>
          <name>performRelease</name>
          <value>true</value>
        </property>
      </activation>

      <build>
        <plugins>
          <plugin>
            <inherited>true</inherited>
            <artifactId>maven-source-plugin</artifactId>
            <executions>
              <execution>
                <id>attach-sources</id>
                <goals>
                  <goal>jar-no-fork</goal>
                </goals>
              </execution>
            </executions>
          </plugin>
          <plugin>
            <inherited>true</inherited>
            <artifactId>maven-javadoc-plugin</artifactId>
            <executions>
              <execution>
                <id>attach-javadocs</id>
                <goals>
                  <goal>jar</goal>
                </goals>
              </execution>
            </executions>
          </plugin>
          <plugin>
            <inherited>true</inherited>
            <artifactId>maven-deploy-plugin</artifactId>
            <configuration>
              <updateReleaseInfo>true</updateReleaseInfo>
            </configuration>
          </plugin>
        </plugins>
      </build>
    </profile>
  </profiles>

</project>
```

可以看到，其中指定了中央仓库的地址，默认插件的中央仓库地址，默认目录相对位置; 以及默认插件版本号，默认配置信息。



### Minimal POM

The minimum requirement for a POM are the following:

- project root
- modelVersion - should be set to 4.0.0
- groupId - the id of the project's group.
- artifactId - the id of the artifact (project)
- version - the version of the artifact under the specified group

Here's an example:

### 2.3 最小POM

POM文件必须包含以下信息：

- project root
- modelVersion - 应该设置为 `4.0.0`
- groupId - 项目组/工作组的标识
- artifactId - 项目标识， 项目可称为 artifact（组件） 或者 project（项目）
- version - 在指定 group（工作组） 名下的 artifact 版本号

示例：

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.mycompany.app</groupId>
  <artifactId>my-app</artifactId>
  <version>1</version>
</project>
```

A POM requires that its groupId, artifactId, and version be configured. These three values form the project's fully qualified artifact name. This is in the form of `<groupId>:<artifactId>:<version>`. As for the example above, its fully qualified artifact name is "com.mycompany.app:my-app:1".

Also, as mentioned in the [first section](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#What_is_a_POM), if the configuration details are not specified, Maven will use their defaults. One of these default values is the packaging type. Every Maven project has a packaging type. If it is not specified in the POM, then the default value "jar" would be used.

Furthermore, you can see that in the minimal POM the *repositories* were not specified. If you build your project using the minimal POM, it would inherit the *repositories* configuration in the Super POM. Therefore when Maven sees the dependencies in the minimal POM, it would know that these dependencies will be downloaded from `https://repo.maven.apache.org/maven2` which was specified in the Super POM.

POM文件必须指定 groupId, artifactId, 以及 version。 这三个配置可以唯一定位一个项目， 其格式为 `<groupId>:<artifactId>:<version>`。
对于上面的示例，其完全限定名称为 "com.mycompany.app:my-app:1"。

POM简介我们提到，如果未指定某个配置的信息，则Maven使用默认值。
其中的一个默认值是打包类型（packaging type）。每个Maven项目都有打包类型。如果未在POM中指定，则使用默认值 "jar"。

可以看到，最小POM中并未指定 `repositories`。
如果我们使用最小POM来构建项目，则将继承Super POM中的 `repositories` 配置。
因此，当Maven在最小POM中看到依赖项时，就知道这些依赖应该从Super POM中指定的仓库地址 `https://repo.maven.apache.org/maven2` 下载。



### Project Inheritance

Elements in the POM that are merged are the following:

- dependencies
- developers and contributors
- plugin lists (including reports)
- plugin executions with matching ids
- plugin configuration
- resources

The Super POM is one example of project inheritance, however you can also introduce your own parent POMs by specifying the parent element in the POM, as demonstrated in the following examples.


<a name="Project_Inheritance"></a>

### 2.4 项目继承结构

POM中的这些元素会被合并：

- 依赖， dependencies
- 开发人员和贡献者
- 插件列表（包括报告插件）
- 插件的可执行信息
- 插件配置信息
- 资源信息

Super POM 是项目继承结构的一个示例，当然我们也可以在POM中直接指定 `parent` 元素来引入父POM，情况下面的演示。

#### Example 1

##### The Scenario

As an example, let us reuse our previous artifact, com.mycompany.app:my-app:1. And let us introduce another artifact, com.mycompany.app:my-module:1.

#### 第1个例子

##### 场景描述

假设我们的项目和前面一样，是 `com.mycompany.app:my-app:1`.
新引入的项目为 `com.mycompany.app:my-module:1`.

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.mycompany.app</groupId>
  <artifactId>my-module</artifactId>
  <version>1</version>
</project>
```

And let us specify their directory structure as the following:

项目的目录结构如下:

```
.
 |-- my-module
 |   ~-- pom.xml
 ~-- pom.xml
```

**Note:** `my-module/pom.xml` is the POM of com.mycompany.app:my-module:1 while `pom.xml` is the POM of com.mycompany.app:my-app:1

> 可以看到, `my-module/pom.xml` 是 `com.mycompany.app:my-module:1` 项目的POM文件; 而 `com.mycompany.app:my-app:1` 对应的POM文件是顶层目录下的 `pom.xml`

##### The Solution

Now, if we were to turn com.mycompany.app:my-app:1 into a parent artifact of com.mycompany.app:my-module:1,we will have to modify com.mycompany.app:my-module:1's POM to the following configuration:

**com.mycompany.app:my-module:1's POM**

##### 实现方式

如果要将 com.mycompany.app:my-app:1 作为 com.mycompany.app:my-module:1 的父级项目, 则可以修改 com.mycompany.app:my-module:1 的 POM 文件配置:

**com.mycompany.app:my-module:1's POM**

```xml
<project>
  <parent>
    <groupId>com.mycompany.app</groupId>
    <artifactId>my-app</artifactId>
    <version>1</version>
  </parent>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.mycompany.app</groupId>
  <artifactId>my-module</artifactId>
  <version>1</version>
</project>
```

Notice that we now have an added section, the parent section. This section allows us to specify which artifact is the parent of our POM. And we do so by specifying the fully qualified artifact name of the parent POM. With this setup, our module can now inherit some of the properties of our parent POM.

Alternatively, if we want the groupId and / or the version of your modules to be the same as their parents, you can remove the groupId and / or the version identity of your module in its POM.


可以看到，我们在xml文件中加入了 `<parent>` 部分, 用来指定当前POM的父级项目.
包括父级项目的完全组件名称.
这样配置之后， 新的 module 就继承了 parent POM 中的属性.

所以，如果和父级项目的组织、版本一致，则可以从子模块POM中去除 `groupId` 和 `version` 元素.

```xml
<project>
  <parent>
    <groupId>com.mycompany.app</groupId>
    <artifactId>my-app</artifactId>
    <version>1</version>
  </parent>
  <modelVersion>4.0.0</modelVersion>
  <!-- 继承parent项目的 groupId ... 省略 -->
  <artifactId>my-module</artifactId>
  <!-- 继承parent项目的 version ... 省略 -->
</project>
```

This allows the module to inherit the groupId and / or the version of its parent POM.

通过这种继承关系，很多项目开发都很省事。



#### Example 2

##### The Scenario

However, that would work if the parent project was already installed in our local repository or was in that specific directory structure (parent `pom.xml` is one directory higher than that of the module's `pom.xml`).

But what if the parent is not yet installed and if the directory structure is as in the following example?


#### 第2个例子

##### 场景描述

上面的例子能够正常运行，因为 parent 项目位于子项目的上层目录。
或者父项目已经install到本地仓库，也能正确找到parent项目。
除了这两种情况，别的要如何引入呢？
比如下面这样的目录结构：


```
.
 |-- my-module
 |   ~-- pom.xml
 |-- parent
     ~-- pom.xml
```

##### The Solution

To address this directory structure (or any other directory structure), we would have to add the `<relativePath>` element to our parent section.

##### 实现方式

我们使用 `<relativePath>` 来指定 parent 项目的相对位置.

```xml
<project>
  <parent>
    <groupId>com.mycompany.app</groupId>
    <artifactId>my-app</artifactId>
    <version>1</version>
    <relativePath>../parent/pom.xml</relativePath>
  </parent>
  <modelVersion>4.0.0</modelVersion>
  <artifactId>my-module</artifactId>
</project>
```

As the name suggests, it's the relative path from the module's `pom.xml` to the parent's `pom.xml`.

顾名思义，就是根据当前模块的 `pom.xml` 文件以及相对位置，来定位 parent 项目的 `pom.xml` 文件。


### Project Aggregation

Project Aggregation is similar to [Project Inheritance](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#Project_Inheritance). But instead of specifying the parent POM from the module, it specifies the modules from the parent POM. By doing so, the parent project now knows its modules, and if a Maven command is invoked against the parent project, that Maven command will then be executed to the parent's modules as well. To do Project Aggregation, you must do the following:

- Change the parent POMs packaging to the value "pom".
- Specify in the parent POM the directories of its modules (children POMs).


### 2.5 项目聚合结构

项目聚合类似于上面提到的 [项目继承结构](#Project_Inheritance).
但不再采用每个模块指定 parent POM 的方式, 而是直接在 parent POM 中指定每一个子模块.
所以 parent 项目需要知道每一个模块的信息,
如果在 parent 项目目录下执行Maven命令, 则同样会对每一个子模块都执行相同的操作.
执行项目组合的操作为:

- 将 parent POM 的打包类型修改为 "pom".
- 在 parent POM 中指定每个子模块(children POMs)的目录.



#### Example 3

##### The Scenario

Given the previous original artifact POMs and directory structure:

**com.mycompany.app:my-app:1's POM**


#### 第3个例子

##### 场景描述

和前面的项目名称一样， POM 文件如下所示:

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.mycompany.app</groupId>
  <artifactId>my-app</artifactId>
  <version>1</version>
</project>
```

子模块的 POM 文件如下所示:

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.mycompany.app</groupId>
  <artifactId>my-module</artifactId>
  <version>1</version>
</project>
```

目录结构为:

```
.
 |-- my-module
 |   ~-- pom.xml
 ~-- pom.xml
```

##### The Solution

If we are to aggregate my-module into my-app, we would only have to modify my-app.

##### 实现方式

我们修改父项目的POM文件，将子模块引入:


```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.mycompany.app</groupId>
  <artifactId>my-app</artifactId>
  <version>1</version>
  <packaging>pom</packaging>

  <modules>
    <module>my-module</module>
  </modules>
</project>
```

In the revised com.mycompany.app:my-app:1, the packaging section and the modules sections were added. For the packaging, its value was set to "pom", and for the modules section, we have the element `<module>my-module</module>`. The value of `<module>` is the relative path from the com.mycompany.app:my-app:1 to com.mycompany.app:my-module:1's POM (*by practice, we use the module's artifactId as the module directory's name*).

Now, whenever a Maven command processes com.mycompany.app:my-app:1, that same Maven command would be ran against com.mycompany.app:my-module:1 as well. Furthermore, some commands (goals specifically) handle project aggregation differently.


很简单，我们修改父项目 my-app 的打包类型 `<packaging>pom</packaging>`, 并添加了 `modules` 和子模块描述信息 `<module>my-module</module>`.
其中 `<module>` 元素的值，是指子模块POM的相对目录。
一般来说，为了方便，子模块的模块名称（artifactId）和所在目录同名.

这样配置之后， 对 `com.mycompany.app:my-app:1` 执行的Maven命令，都会对子模块 `com.mycompany.app:my-module:1` 执行一次。
当然，某些命令/目标也会有特例。


#### Example 4

##### The Scenario

But what if we change the directory structure to the following:


#### 第4个例子

##### 场景描述

如果父项目和子项目不是上下级目录关系怎么办？ 比如:

```
.
 |-- my-module
 |   ~-- pom.xml
 |-- parent
     ~-- pom.xml
```

How would the parent POM specify its modules?

parent POM 如何指定子模块的位置呢？

##### The Solution

The answer? - the same way as Example 3, by specifying the path to the module.

##### 实现方式

聪明的你是否想到了？ 指定模块的相对目录即可：

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.mycompany.app</groupId>
  <artifactId>my-app</artifactId>
  <version>1</version>
  <packaging>pom</packaging>

  <modules>
    <module>../my-module</module>
  </modules>
</project>
```


-------------

### Project Inheritance vs Project Aggregation

If you have several Maven projects, and they all have similar configurations, you can refactor your projects by pulling out those similar configurations and making a parent project. Thus, all you have to do is to let your Maven projects inherit that parent project, and those configurations would then be applied to all of them.

And if you have a group of projects that are built or processed together, you can create a parent project and have that parent project declare those projects as its modules. By doing so, you'd only have to build the parent and the rest will follow.

But of course, you can have both Project Inheritance and Project Aggregation. Meaning, you can have your modules specify a parent project, and at the same time, have that parent project specify those Maven projects as its modules. You'd just have to apply all three rules:

- Specify in every child POM who their parent POM is.
- Change the parent POMs packaging to the value "pom" .
- Specify in the parent POM the directories of its modules (children POMs)

### 2.6 项目继承结构 vs. 项目聚合结构

如果有多个Maven项目的配置相似， 那么可以将公共的配置提取到一个 parent 项目中。 然后，重构这些Maven项目以继承 parent 项目，这些配置就生效了。

如果有一组项目需要一起构建或处理，则可以创建一个 parent 项目，把其他项目声明为子模块。 这样我们就只需要构建父项目即可。

当然，我们可以同时使用项目继承结构和项目聚合结构。
比如为子模块指定 parent 项目，同时 parent 项目也将这些 Maven 项目指定为子模块。 只需要符合以下3个规则即可：

- 在每个子POM中指定其父POM。
- 将父POM的打包类型修改为 "pom"。
- 在父POM中指定子模块的相对目录。


#### Example 5

##### The Scenario

Given the previous original artifact POMs again,

**com.mycompany.app:my-app:1's POM**



#### 第4个例子

##### 场景描述

还是前面的项目， `my-app` 的POM文件:


```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.mycompany.app</groupId>
  <artifactId>my-app</artifactId>
  <version>1</version>
</project>
```

**com.mycompany.app:my-module:1's POM**

`my-module` 的POM文件:

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.mycompany.app</groupId>
  <artifactId>my-module</artifactId>
  <version>1</version>
</project>
```

and this **directory structure**

目录结构如下:

```
.
 |-- my-module
 |   ~-- pom.xml
 |-- parent
     ~-- pom.xml
```

##### The Solution

To do both project inheritance and aggregation, you only have to apply all three rules.

**com.mycompany.app:my-app:1's POM**

##### 实现方式

想要同时使用项目继承 和 项目聚合结构，符合上面提到的3个规则即可。

`my-app` 的POM文件，修改 `packaging` 和 `modules`:


```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.mycompany.app</groupId>
  <artifactId>my-app</artifactId>
  <version>1</version>
  <packaging>pom</packaging>

  <modules>
    <module>../my-module</module>
  </modules>
</project>
```

**com.mycompany.app:my-module:1's POM**

修改 `my-module` 的POM文件，加上 `parent`:

```xml
<project>
  <parent>
    <groupId>com.mycompany.app</groupId>
    <artifactId>my-app</artifactId>
    <version>1</version>
    <relativePath>../parent/pom.xml</relativePath>
  </parent>
  <modelVersion>4.0.0</modelVersion>
  <artifactId>my-module</artifactId>
</project>
```

**NOTE:** Profile inheritance the same inheritance strategy as used for the POM itself.

> **提示**: Profile 的继承策略与POM一样。



### Project Interpolation and Variables

One of the practices that Maven encourages is *don't repeat yourself*. However, there are circumstances where you will need to use the same value in several different locations. To assist in ensuring the value is only specified once, Maven allows you to use both your own and pre-defined variables in the POM.

For example, to access the `project.version` variable, you would reference it like so:

```xml
  <version>${project.version}</version>
```

One factor to note is that these variables are processed *after* inheritance as outlined above. This means that if a parent project uses a variable, then its definition in the child, not the parent, will be the one eventually used.

#### Available Variables

##### Project Model Variables

Any field of the model that is a single value element can be referenced as a variable. For example, `${project.groupId}`, `${project.version}`, `${project.build.sourceDirectory}` and so on. Refer to the POM reference to see a full list of properties.

These variables are all referenced by the prefix "`project.`". You may also see references with `pom.` as the prefix, or the prefix omitted entirely - these forms are now deprecated and should not be used.

##### Special Variables

| `project.basedir`       | The directory that the current project resides in.           |
| ----------------------- | ------------------------------------------------------------ |
| `project.baseUri`       | The directory that the current project resides in, represented as an URI. *Since Maven 2.1.0* |
| `maven.build.timestamp` | The timestamp that denotes the start of the build (UTC). *Since Maven 2.1.0-M1* |

The format of the build timestamp can be customized by declaring the property `maven.build.timestamp.format` as shown in the example below:

```xml
<project>
  ...
  <properties>
    <maven.build.timestamp.format>yyyy-MM-dd'T'HH:mm:ss'Z'</maven.build.timestamp.format>
  </properties>
  ...
</project>
```

The format pattern has to comply with the rules given in the API documentation for [SimpleDateFormat](https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html). If the property is not present, the format defaults to the value already given in the example.

##### Properties

You are also able to reference any properties defined in the project as a variable. Consider the following example:

```xml
<project>
  ...
  <properties>
    <mavenVersion>3.0</mavenVersion>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.apache.maven</groupId>
      <artifactId>maven-artifact</artifactId>
      <version>${mavenVersion}</version>
    </dependency>
    <dependency>
      <groupId>org.apache.maven</groupId>
      <artifactId>maven-core</artifactId>
      <version>${mavenVersion}</version>
    </dependency>
  </dependencies>
  ...
</project>
```



<https://maven.apache.org/guides/introduction/introduction-to-the-pom.html>
