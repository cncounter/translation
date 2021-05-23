## Introduction to the Build Lifecycle

## MAVEN基础系列（一） 项目构建的各个阶段

相关文章:

- [MAVEN基础系列（〇） Maven五分钟入门教程](./maven-in-five-minutes.md)
- [MAVEN基础系列（一） 项目构建的各个阶段](./introduction-to-the-lifecycle.md)
- [MAVEN基础系列（二） POM文件](./README.md)
- [MAVEN基础系列（三） Profiles配置打包环境](./introduction-to-profiles.md)
- [MAVEN基础系列（四） 标准的Maven项目结构](./standard-directory-layout.md)
- [MAVEN基础系列（五） 浅析pom依赖机制](./introduction-to-dependency-mechanism.md)
- [MAVEN基础系列（六） 依赖项排除与可选依赖](./optional-and-excludes-dependencies.md)


### Build Lifecycle Basics

Maven is based around the central concept of a build lifecycle. What this means is that the process for building and distributing a particular artifact (project) is clearly defined.

For the person building a project, this means that it is only necessary to learn a small set of commands to build any Maven project, and the [POM](./README.md) will ensure they get the results they desired.

There are three built-in build lifecycles: default, clean and site. The `default` lifecycle handles your project deployment, the `clean` lifecycle handles project cleaning, while the `site` lifecycle handles the creation of your project's site documentation.

### 1.1 Maven生命周期

Maven 以构建生命周期（build lifecycle）为核心，明确定义了一个项目的构建和分发需要经历哪些处理过程。

对于构建项目的人来说，只需要学习少量的命令即可构建任何一个Maven项目，通过 [POM](./README.md) 就能确保获得所需的结果。

Maven内置了三个构建生命周期： `default`, `clean` 和 `site`。

- `default` 默认生命周期，处理项目部署相关的操作。
- `clean` 清理周期，执行项目清理。
- `site` 站点周期， 负责创建项目的站点文档。

#### A Build Lifecycle is Made Up of Phases

Each of these build lifecycles is defined by a different list of build phases, wherein a build phase represents a stage in the lifecycle.

For example, the default lifecycle comprises of the following phases (for a complete list of the lifecycle phases, refer to the [Lifecycle Reference](#Lifecycle_Reference)):

- `validate` - validate the project is correct and all necessary information is available
- `compile` - compile the source code of the project
- `test` - test the compiled source code using a suitable unit testing framework. These tests should not require the code be packaged or deployed
- `package` - take the compiled code and package it in its distributable format, such as a JAR.
- `verify` - run any checks on results of integration tests to ensure quality criteria are met
- `install` - install the package into the local repository, for use as a dependency in other projects locally
- `deploy` - done in the build environment, copies the final package to the remote repository for sharing with other developers and projects.

These lifecycle phases (plus the other lifecycle phases not shown here) are executed sequentially to complete the `default` lifecycle. Given the lifecycle phases above, this means that when the default lifecycle is used, Maven will first validate the project, then will try to compile the sources, run those against the tests, package the binaries (e.g. jar), run integration tests against that package, verify the integration tests, install the verified package to the local repository, then deploy the installed package to a remote repository.

#### 由多个阶段组成的构建生命周期

每一个构建生命周期都由不同的构建阶段列表来定义，其中，构建阶段（build phase）表示生命周期中的一个阶段。

例如， `default` 生命周期包含以下阶段：

- `validate` - 验证项目的正确性，确保所有必要的信息均可用。
- `compile` - 编译项目的源代码。
- `test` - 使用适当的单元测试框架来测试编译后的代码。这些测试不应该要求将代码打包或部署。
- `package` - 将编译后的代码打包为可分发的格式，例如JAR。
- `verify` - 对集成测试的结果进行检查，以确保符合质量标准。
- `install` - 将打包后的结果安装到本地仓库， 作为其他项目的本地依赖项。
- `deploy` - 在构建环境中完成，将最终的结果软件包发布到远程仓库中，让其他项目的开发人员可以使用。

这些生命周期阶段将按固定的顺序执行，以完成 `default` 生命周期。
看上面列出的生命周期阶段可以发现，当使用默认生命周期时， Maven首先验证项目（`validate`），然后尝试编译源代码（`compile`），执行测试用例（`test`），打包二进制文件（`package`），针对软件包执行集成测试验证（`verify`），将经过验证的软件包安装到本地仓库（`install`），然后将已安装的软件包部署到远程仓库（`deploy`）。


#### Usual Command Line Calls

You should select the phase that matches your outcome. If you want your jar, run `package`. If you want to run the unit tests, run `test`.

If you are uncertain what you want, the preferred phase to call is

#### 常用命令行

在使用时，我们应该选择与结果相匹配的阶段。
如果想要生产 jar 文件，则执行 `package`。
如果要运行单元测试，请运行 `test`。

如果不确定想要什么阶段，则可以调用：

```shell
mvn verify
```

This command executes each default lifecycle phase in order (`validate`, `compile`, `package`, etc.), before executing `verify`. You only need to call the last build phase to be executed, in this case, `verify`. In most cases the effect is the same as `package`. However, in case there are integration-tests, these will be executed as well. And during the `verify` phase some additional checks can be done, e.g. if your code written according to the predefined checkstyle rules.

In a build environment, use the following call to cleanly build and deploy artifacts into the shared repository.

此命令按顺序执行默认生命周期中 `verify` 之前的每个阶段（`validate`, `compile`, `test`, `package` 等）。
我们只需要调用要执行的最后一个构建阶段即可，这里对应的是 `verify`。
在大多数情况下，效果与 `package` 相同。
但如果有集成测试，则也会执行这些测试。
并且在 `verify` 阶段还可以执行一些其他检查，例如代码格式是否符合预定义的 checkstyle 规则。

在构建环境中，使用以下命令来清理干净，并部署到远程仓库中。


```shell
mvn clean deploy
```

The same command can be used in a multi-module scenario (i.e. a project with one or more subprojects). Maven traverses into every subproject and executes `clean`, then executes `deploy` (including all of the prior build phase steps).

可以在多模块方案中使用同一命令（即具有一个或多个子项目的项目）。 Maven遍历每个子项目并执行“清理”，然后执行“部署”（包括所有先前的构建阶段步骤）。

#### A Build Phase is Made Up of Plugin Goals

However, even though a build phase is responsible for a specific step in the build lifecycle, the manner in which it carries out those responsibilities may vary. And this is done by declaring the plugin goals bound to those build phases.

A plugin goal represents a specific task (finer than a build phase) which contributes to the building and managing of a project. It may be bound to zero or more build phases. A goal not bound to any build phase could be executed outside of the build lifecycle by direct invocation. The order of execution depends on the order in which the goal(s) and the build phase(s) are invoked. For example, consider the command below. The `clean` and `package` arguments are build phases, while the `dependency:copy-dependencies` is a goal (of a plugin).

#### 由插件目标组成的构建阶段

即使构建阶段负责构建生命周期中特定的步骤，执行这些职责的方式也可以不同。 这是通过声明插件目标与这些构建阶段绑定来完成的。

插件目标代表一个特定的任务（比构建阶段还要具体），该任务有助于项目的构建和管理。
可以绑定到零到多个构建阶段。
没有绑定任何构建生命周期的插件目标，也可以通过直接调用来执行，不受任何构建阶段约束。
执行的顺序取决于调用目标和构建阶段的顺序。
 例如下面的命令，构建阶段是  `clean` 和 `package` 参数，而 `dependency:copy-dependencies` 则是插件的目标。

```shell
mvn clean dependency:copy-dependencies package
```

If this were to be executed, the `clean` phase will be executed first (meaning it will run all preceding phases of the clean lifecycle, plus the `clean` phase itself), and then the `dependency:copy-dependencies` goal, before finally executing the `package` phase (and all its preceding build phases of the default lifecycle).

Moreover, if a goal is bound to one or more build phases, that goal will be called in all those phases.

Furthermore, a build phase can also have zero or more goals bound to it. If a build phase has no goals bound to it, that build phase will not execute. But if it has one or more goals bound to it, it will execute all those goals.

(*Note: In Maven 2.0.5 and above, multiple goals bound to a phase are executed in the same order as they are declared in the POM, however multiple instances of the same plugin are not supported. Multiple instances of the same plugin are grouped to execute together and ordered in Maven 2.0.11 and above*).


运行此命令，则首先会执行 `clean` 阶段（也就是执行清理周期之前的所有阶段，以及“清理”阶段本身），然后执行 `dependency:copy-dependencies` 目标，最后执行 `package` 阶段（以及默认生命周期中，打包之前的所有构建阶段）。

当然，如果某个目标绑定到一个或多个构建阶段，则在这些阶段中都会调用这个目标。

此外，构建阶段也可以绑定零到多个目标。 如果某个构建阶段没有绑定目标，则该构建阶段就不会执行。 但如果绑定了一个或多个目标，它将挨个执行所有绑定的目标。

> 注意：在 Maven 2.0.5 及更高版本中，绑定到某个阶段的多个目标, 将按照在POM中声明的顺序执行，但是不支持同一插件的多个实例。  而在 Maven 2.0.11 及更高版本中， 同一插件的多个实例会分到一个组并按顺序执行。

#### Some Phases Are Not Usually Called From the Command Line

The phases named with hyphenated-words (`pre-*`, `post-*`, or `process-*`) are not usually directly called from the command line. These phases sequence the build, producing intermediate results that are not useful outside the build. In the case of invoking `integration-test`, the environment may be left in a hanging state.

Code coverage tools such as Jacoco and execution container plugins such as Tomcat, Cargo, and Docker bind goals to the `pre-integration-test` phase to prepare the integration test container environment. These plugins also bind goals to the `post-integration-test` phase to collect coverage statistics or decommission the integration test container.

Failsafe and code coverage plugins bind goals to `integration-test` and `verify` phases. The net result is test and coverage reports are available after the `verify` phase. If `integration-test` were to be called from the command line, no reports are generated. Worse is that the integration test container environment is left in a hanging state; the Tomcat webserver or Docker instance is left running, and Maven may not even terminate by itself.


#### 某些阶段通常不从命令行调用

通常不从命令行直接调用以连字符命名的阶段（如 `pre-*`, `post-*`, or `process-*`）。
这些阶段对构建进行排序，产生中间结果，这些结果在构建外部无用。 在调用 `integration-test` 的情况下，环境可能处于挂起状态。

Jacoco 等代码覆盖率检测工具, 以及Tomcat，Cargo  和Docker 等执行容器插件将目标绑定到 `pre-integration-test` 阶段，以准备集成测试容器环境。这些插件还将目标绑定到 `post-integration-test` 阶段，以收集覆盖率统计信息，或者停用集成测试容器。

故障安全和代码覆盖检测插件将目标绑定到 `integration-test` 和 `verify` 阶段。 最终结果是测试报告和覆盖率报告，并且在 `verify` 阶段之后可用。 如果直接从命令行调用 `integration-test`，则不会生成任何报告。 更糟糕的是，集成测试容器环境处于挂起状态； Tomcat Web服务器或Docker实例保持运行状态，甚至 Maven 还无法自行终止。

### Setting Up Your Project to Use the Build Lifecycle

The build lifecycle is simple enough to use, but when you are constructing a Maven build for a project, how do you go about assigning tasks to each of those build phases?

### 设置项目以使用构建生命周期

构建生命周期很容易使用， 但是当您为项目配置Maven构建时，如何为每个构建阶段分配任务呢？

#### Packaging

The first, and most common way, is to set the packaging for your project via the equally named POM element `<packaging>`. Some of the valid packaging values are `jar`, `war`, `ear` and `pom`. If no packaging value has been specified, it will default to `jar`.

Each packaging contains a list of goals to bind to a particular phase. For example, the `jar` packaging will bind the following goals to build phases of the default lifecycle.

#### 打包

首先，最常见的方法是通过POM元素 `<packaging>` 设置项目的打包类型。 可用的类型包括 `jar`, `war`, `ear` 以及 `pom`。 如果未指定打包类型，则默认值为 `jar`。

每个打包类型都包含绑定到特定阶段的目标列表。 例如，`jar` 类型将以下目标绑定到默认生命周期的各个阶段。

| Phase                    | plugin:goal               |
| :----------------------- | :------------------------ |
| `process-resources`      | `resources:resources`     |
| `compile`                | `compiler:compile`        |
| `process-test-resources` | `resources:testResources` |
| `test-compile`           | `compiler:testCompile`    |
| `test`                   | `surefire:test`           |
| `package`                | `jar:jar`                 |
| `install`                | `install:install`         |
| `deploy`                 | `deploy:deploy`           |

This is an almost [standard set of bindings](https://maven.apache.org/ref/current/maven-core/default-bindings.html); however, some packagings handle them differently. For example, a project that is purely metadata (packaging value is `pom`) only binds goals to the `install` and `deploy` phases (for a complete list of goal-to-build-phase bindings of some of the packaging types, refer to the [Lifecycle Reference](#Lifecycle_Reference)).

Note that for some packaging types to be available, you may also need to include a particular plugin in the `<build>` section of your POM and specify `<extensions>true</extensions>` for that plugin. One example of a plugin that requires this is the Plexus plugin, which provides a `plexus-application` and `plexus-service` packaging.

这基本上算是 [标准绑定集](https://maven.apache.org/ref/current/maven-core/default-bindings.html)；
但是，有些打包类型对它们的处理方式有所不同。
例如，纯粹是元数据的项目（类型为`pom`）只将目标绑定到 `install` 和 `deploy` 阶段。

请注意，对于某些可用的打包类型，我们可能还需要在POM的 `<build>` 部分中包含特定的插件，并为插件指定`<extensions>true</extensions>`。 Plexus 插件是其中的一个示例，它可以提供 `plexus-application` 和 `plexus-service` 包。

--------------

#### Plugins

The second way to add goals to phases is to configure plugins in your project. Plugins are artifacts that provide goals to Maven. Furthermore, a plugin may have one or more goals wherein each goal represents a capability of that plugin. For example, the Compiler plugin has two goals: `compile` and `testCompile`. The former compiles the source code of your main code, while the latter compiles the source code of your test code.

As you will see in the later sections, plugins can contain information that indicates which lifecycle phase to bind a goal to. Note that adding the plugin on its own is not enough information - you must also specify the goals you want to run as part of your build.

The goals that are configured will be added to the goals already bound to the lifecycle from the packaging selected. If more than one goal is bound to a particular phase, the order used is that those from the packaging are executed first, followed by those configured in the POM. Note that you can use the `<executions>` element to gain more control over the order of particular goals.

For example, the Modello plugin binds by default its goal `modello:java` to the `generate-sources` phase (Note: The `modello:java` goal generates Java source codes). So to use the Modello plugin and have it generate sources from a model and incorporate that into the build, you would add the following to your POM in the `<plugins>` section of `<build>`:

#### Maven插件

在构建阶段中添加目标的第二种方法是使用Maven插件。
插件是向Maven提供目标的组件，可以有一个或多个目标，每个目标都代表该插件的功能。
例如，Compiler 插件有两个目标：`compile` 和 `testCompile`。
前者编译我们的主代码，而后者编译测试代码。

下面我们会讲到，插件可以通过配置将目标绑定到具体的某个生命周期阶段。
请注意，仅仅是添加插件是不够的，还必须指定要在构建过程中运行的目标。

从所选的包中，将配置的目标添加到绑定的生命周期的目标列表中。
如果某个阶段绑定了多个目标，则先执行包中的目标，然后再执行POM文件中配置的目标。
注意，我们可以使用 `<executions>` 元素来控制特定目标的顺序。

例如，Modello 插件默认情况下将其目标 `modello:java` 绑定到 `generate-sources` 阶段。`modello:java` 目标用于生成Java源代码。
因此，要使用Modello插件并将其从模型生成的代码合并到构建中，可以在POM中,  `<build>` 元素下的 `<plugins>` 中添加以下配置：

```xml
...
 <plugin>
   <groupId>org.codehaus.modello</groupId>
   <artifactId>modello-maven-plugin</artifactId>
   <version>1.8.1</version>
   <executions>
     <execution>
       <configuration>
         <models>
           <model>src/main/mdo/maven.mdo</model>
         </models>
         <version>4.0.0</version>
       </configuration>
       <goals>
         <goal>java</goal>
       </goals>
     </execution>
   </executions>
 </plugin>
...
```

You might be wondering why that `<executions>` element is there. That is so that you can run the same goal multiple times with different configuration if needed. Separate executions can also be given an ID so that during inheritance or the application of profiles you can control whether goal configuration is merged or turned into an additional execution.

When multiple executions are given that match a particular phase, they are executed in the order specified in the POM, with inherited executions running first.

Now, in the case of `modello:java`, it only makes sense in the `generate-sources` phase. But some goals can be used in more than one phase, and there may not be a sensible default. For those, you can specify the phase yourself. For example, let's say you have a goal `display:time` that echos the current time to the commandline, and you want it to run in the `process-test-resources` phase to indicate when the tests were started. This would be configured like so:

为什么要在这里配置 `<executions>` 元素呢？ 通过这种方式，我们可以根据需要，用不同的配置来运行同一个目标。
还可以为每次执行分配一个ID，以便在继承或应用配置文件期间，控制目标配置是合并呢还是转换为其他执行。

当某个阶段匹配多个 execution 时，将按照在POM文件中的顺序来执行，而且先执行继承来的 execution 。

`modello:java` 目标，仅在 `generate-sources` 阶段才有意义。
但某些目标可以在多个阶段中使用，可能还没有明显的默认配置。
对于这种情况，我们可以自己指定阶段。 例如，假设有一个目标 `display:time`， 将当前时间打印到控制台， 并且希望在 `process-test-resources` 阶段执行，以标识开始测试的时间点。 可以这样配置：

```xml
...
 <plugin>
   <groupId>com.mycompany.example</groupId>
   <artifactId>display-maven-plugin</artifactId>
   <version>1.0</version>
   <executions>
     <execution>
       <phase>process-test-resources</phase>
       <goals>
         <goal>time</goal>
       </goals>
     </execution>
   </executions>
 </plugin>
...
```

<a name="Lifecycle_Reference"></a>

### Lifecycle Reference

The following lists all build phases of the `default`, `clean` and `site` lifecycles, which are executed in the order given up to the point of the one specified.

### 生命周期参考文档

下面列出了 `default`, `clean` 和 `site` 生命周期的所有构建阶段，这些阶段的执行顺序也跟给出的顺序一致。


**Clean Lifecycle**

| Phase        | Description                                                  |
| :----------- | :----------------------------------------------------------- |
| `pre-clean`  | execute processes needed prior to the actual project cleaning |
| `clean`      | remove all files generated by the previous build             |
| `post-clean` | execute processes needed to finalize the project cleaning    |


> `clean` 生命周期的构建阶段

| 阶段名称       | 说明信息                                                  |
| :----------- | :----------------------------------------------------------- |
| `pre-clean`  | 在执行实际的项目清理之前，处理所需的操作 |
| `clean`      | 删除前次构建生成的所有文件             |
| `post-clean` | 项目清理完成时，所需执行的操作   |


**Default Lifecycle**

| Phase                     | Description                                                  |
| :------------------------ | :----------------------------------------------------------- |
| `validate`                | validate the project is correct and all necessary information is available. |
| `initialize`              | initialize build state, e.g. set properties or create directories. |
| `generate-sources`        | generate any source code for inclusion in compilation.       |
| `process-sources`         | process the source code, for example to filter any values.   |
| `generate-resources`      | generate resources for inclusion in the package.             |
| `process-resources`       | copy and process the resources into the destination directory, ready for packaging. |
| `compile`                 | compile the source code of the project.                      |
| `process-classes`         | post-process the generated files from compilation, for example to do bytecode enhancement on Java classes. |
| `generate-test-sources`   | generate any test source code for inclusion in compilation.  |
| `process-test-sources`    | process the test source code, for example to filter any values. |
| `generate-test-resources` | create resources for testing.                                |
| `process-test-resources`  | copy and process the resources into the test destination directory. |
| `test-compile`            | compile the test source code into the test destination directory |
| `process-test-classes`    | post-process the generated files from test compilation, for example to do bytecode enhancement on Java classes. |
| `test`                    | run tests using a suitable unit testing framework. These tests should not require the code be packaged or deployed. |
| `prepare-package`         | perform any operations necessary to prepare a package before the actual packaging. This often results in an unpacked, processed version of the package. |
| `package`                 | take the compiled code and package it in its distributable format, such as a JAR. |
| `pre-integration-test`    | perform actions required before integration tests are executed. This may involve things such as setting up the required environment. |
| `integration-test`        | process and deploy the package if necessary into an environment where integration tests can be run. |
| `post-integration-test`   | perform actions required after integration tests have been executed. This may including cleaning up the environment. |
| `verify`                  | run any checks to verify the package is valid and meets quality criteria. |
| `install`                 | install the package into the local repository, for use as a dependency in other projects locally. |
| `deploy`                  | done in an integration or release environment, copies the final package to the remote repository for sharing with other developers and projects. |



> `default` 生命周期的构建阶段

| 阶段名称                   | 说明信息                                                      |
| :------------------------ | :----------------------------------------------------------- |
| `validate`                | 验证项目的正确性，以及所有必要的信息都已提供。 |
| `initialize`              | 初始化构建状态，例如，设置属性或创建目录。    |
| `generate-sources`        | 生成所有要在编译过程中使用的源代码。         |
| `process-sources`         | 处理源代码，例如替换各种值。                |
| `generate-resources`      | 生成资源文件，以备在打包阶段使用             |
| `process-resources`       | 拷贝和处理资源到目标目录中，以备打包。        |
| `compile`                 | 编译项目源代码。                          |
| `process-classes`         | 对编译后生成的文件进行后处理，例如对Java类进行字节码增强。 |
| `generate-test-sources`   | 生成需要在编译阶段使用的所有测试代码           |
| `process-test-sources`    | 处理测试代码，例如替换各种值。                |
| `generate-test-resources` | 创建测试的资源文件。                        |
| `process-test-resources`  | 拷贝和处理资源到测试的目标目录中              |
| `test-compile`            | 将测试代码编译到测试目标目录中。              |
| `process-test-classes`    | 对测试编译生成的文件进行后期处理，例如对Java类进行字节码增强。 |
| `test`                    | 使用合适的单元测试框架运行测试。 这些测试不应要求打包或部署代码。 |
| `prepare-package`         | 准备打包，在实际打包之前进行一些必要的准备工作。 这通常会生产未打包的，但已处理过的版本。 |
| `package`                 | 将编译后的代码打包为可分发格式，例如JAR。 |
| `pre-integration-test`    | 在执行集成测试前进行所需的操作。 可能涉及准备集成环境等操作。 |
| `integration-test`        | 集成测试， 在必要时将打包好的程序部署到可运行集成测试的环境中。 |
| `post-integration-test`   | 在集成测试完成后需要执行的操作。 包括清理环境等。 |
| `verify`                  | 运行各种检查验证，以确保打包的结果有效并符合质量标准。 |
| `install`                 | 将软件包安装到本地Maven仓库，作为本地的其他项目的依赖项。 |
| `deploy`                  | 在集成或发布环境完成后，将最终的程序包部署到远程Maven仓库，以便与其他开发人员和项目共享。 |



**Site Lifecycle**

| Phase         | Description                                                  |
| :------------ | :----------------------------------------------------------- |
| `pre-site`    | execute processes needed prior to the actual project site generation |
| `site`        | generate the project's site documentation                    |
| `post-site`   | execute processes needed to finalize the site generation, and to prepare for site deployment |
| `site-deploy` | deploy the generated site documentation to the specified web server |


> `site` 生命周期的构建阶段

| 阶段名称       | 说明信息                                                  |
| :------------ | :----------------------------------------------------------- |
| `pre-site`    | 在实际生成项目站点之前，执行所需的操作 |
| `site`        | 生成项目的站点文档                    |
| `post-site`   | 站点生成阶段结束时，执行的操作，还可以为站点部署做准备 |
| `site-deploy` | 将生成的站点文档部署到指定Web服务器 |

### Built-in Lifecycle Bindings

Some phases have goals bound to them by default. And for the default lifecycle, these bindings depend on the packaging value. Here are some of the goal-to-build-phase bindings.

### 内置生命周期绑定

某些阶段绑定有默认的目标。 对于 default 生命周期，这些绑定取决于需要打包的类型。
下面列出了常见的目标和构建阶段绑定关系。

#### Clean Lifecycle Bindings

| Phase   | plugin:goal   |
| :------ | :------------ |
| `clean` | `clean:clean` |

#### Default Lifecycle Bindings - Packaging `ejb` / `ejb3` / `jar` / `par` / `rar` / `war`

| Phase                    | plugin:goal                                                  |
| :----------------------- | :----------------------------------------------------------- |
| `process-resources`      | `resources:resources`                                        |
| `compile`                | `compiler:compile`                                           |
| `process-test-resources` | `resources:testResources`                                    |
| `test-compile`           | `compiler:testCompile`                                       |
| `test`                   | `surefire:test`                                              |
| `package`                | `ejb:ejb` *or* `ejb3:ejb3` *or* `jar:jar` *or* `par:par` *or* `rar:rar` *or* `war:war` |
| `install`                | `install:install`                                            |
| `deploy`                 | `deploy:deploy`                                              |

#### Default Lifecycle Bindings - Packaging `ear`

| Phase                | plugin:goal                    |
| :------------------- | :----------------------------- |
| `generate-resources` | `ear:generate-application-xml` |
| `process-resources`  | `resources:resources`          |
| `package`            | `ear:ear`                      |
| `install`            | `install:install`              |
| `deploy`             | `deploy:deploy`                |

#### Default Lifecycle Bindings - Packaging `maven-plugin`

| Phase                    | plugin:goal                                        |
| :----------------------- | :------------------------------------------------- |
| `generate-resources`     | `plugin:descriptor`                                |
| `process-resources`      | `resources:resources`                              |
| `compile`                | `compiler:compile`                                 |
| `process-test-resources` | `resources:testResources`                          |
| `test-compile`           | `compiler:testCompile`                             |
| `test`                   | `surefire:test`                                    |
| `package`                | `jar:jar` *and* `plugin:addPluginArtifactMetadata` |
| `install`                | `install:install`                                  |
| `deploy`                 | `deploy:deploy`                                    |

#### Default Lifecycle Bindings - Packaging `pom`

| Phase     | plugin:goal       |
| :-------- | :---------------- |
| `package` |                   |
| `install` | `install:install` |
| `deploy`  | `deploy:deploy`   |

#### Site Lifecycle Bindings

| Phase         | plugin:goal   |
| :------------ | :------------ |
| `site`        | `site:site`   |
| `site-deploy` | `site:deploy` |

#### References

The full Maven lifecycle is defined by the `components.xml` file in the `maven-core` module, with [associated documentation](https://maven.apache.org/ref/current/maven-core/lifecycles.html) for reference.

Default lifecycle bindings are defined in a separate `default-bindings.xml` descriptor.

See [Lifecycles Reference](https://maven.apache.org/ref/current/maven-core/lifecycles.html) and [Plugin Bindings for default Lifecycle Reference](https://maven.apache.org/ref/current/maven-core/default-bindings.html) for latest documentation taken directly from source code.

#### 参考链接

完整的Maven生命周期由 `maven-core` 模块中的 `components.xml` 文件定义，相关文档请参考: [lifecycles.html](https://maven.apache.org/ref/current/maven-core/lifecycles.html)。

Default 生命周期的绑定关系单独在 `default-bindings.xml` 文件中定义。

最新文档请参考:

- [生命周期参考手册](https://maven.apache.org/ref/current/maven-core/lifecycles.html)
- [default生命周期绑定的插件](https://maven.apache.org/ref/current/maven-core/default-bindings.html)
- [原文链接](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)
