## Optional Dependencies and Dependency Exclusions

## MAVEN基础系列（六） 依赖项排除与可选依赖

相关文章:

- [MAVEN基础系列（〇） Maven五分钟入门教程](./maven-in-five-minutes.md)
- [MAVEN基础系列（一） 项目构建的各个阶段](./introduction-to-the-lifecycle.md)
- [MAVEN基础系列（二） POM文件](./README.md)
- [MAVEN基础系列（三） Profiles配置打包环境](./introduction-to-profiles.md)
- [MAVEN基础系列（四） 标准的Maven项目结构](./standard-directory-layout.md)
- [MAVEN基础系列（五） 浅析pom依赖机制](./introduction-to-dependency-mechanism.md)
- [MAVEN基础系列（六） 依赖项排除与可选依赖](./optional-and-excludes-dependencies.md)


This section discusses optional dependencies and dependency exclusions. This will help users to understand what they are and when and how to use them. It also explains why exclusions are made on a per dependency basis instead of at the POM level.

本节讨论可选依赖(optional dependency)与依赖排除(dependency exclusion)。 这有助于理解它们是什么、什么时候用、以及怎么用。 同时也会解释，为什么排除规则是针对单个依赖项设置的，而不是在 POM 级别设置。

### Optional Dependencies

可选依赖(Optional Dependencies)

Optional dependencies are used when it's not possible (for whatever reason) to split a project into sub-modules. The idea is that some of the dependencies are only used for certain features in the project and will not be needed if that feature isn't used. Ideally, such a feature would be split into a sub-module that depends on the core functionality project. This new subproject would have only non-optional dependencies, since you'd need them all if you decided to use the subproject's functionality.

当由于某种原因无法把项目拆分成多个子模块时，就可以使用可选依赖。 其核心思想是：有些依赖只用于项目中的某些特定功能，如果不使用该功能，就不需要这些依赖。 理想情况下，这类功能应该拆分为一个子模块，让该子模块依赖于核心功能项目。 这个新的子项目只包含非可选依赖，因为如果要使用该子项目的功能，这些依赖全都是必需的。

However, since the project cannot be split up (again, for whatever reason), these dependencies are declared optional. If a user wants to use functionality related to an optional dependency, they have to redeclare that optional dependency in their own project. This is not the clearest way to handle this situation, but both optional dependencies and dependency exclusions are stop-gap solutions.

但是，既然项目无法拆分(同样是由于某种原因)，就只能把这些依赖声明为可选。 如果用户想要使用与某个可选依赖相关的功能，就必须在自己的项目中重新声明该可选依赖。 这并非处理这种情况的最清晰的方式，但可选依赖和依赖排除都只是临时的权宜之计。

#### Why use optional dependencies?

为什么要使用可选依赖？

Optional dependencies save space and memory. They prevent problematic jars that violate a license agreement or cause classpath issues from being bundled into a WAR, EAR, fat jar, or the like.

可选依赖可以节省空间和内存。 它们能避免那些违反许可协议、或者引起 classpath 问题的 jar 包被打包进 WAR、EAR、fat jar 之类的文件中。

#### How do I use the optional tag?

如何使用 optional 标签？

A dependency is declared optional by setting the <optional> element to true in its dependency declaration:

在依赖声明中，把 <optional> 元素设置为 true，即可将该依赖声明为可选依赖：

```
<project>  ...  <dependencies>    <!-- declare the dependency to be set as optional -->    <dependency>      <groupId>sample.ProjectA</groupId>      <artifactId>Project-A</artifactId>      <version>1.0</version>      <scope>compile</scope>      <optional>true</optional> <!-- value will be true or false only -->    </dependency>  </dependencies></project>
```

#### How do optional dependencies work?

可选依赖是如何生效的？

```
Project-A -> Project-B
```

The diagram above says that Project-A depends on Project-B. When A declares B as an optional dependency in its POM, this relationship remains unchanged. It's just like a normal build where Project-B will be added in Project-A's classpath.

上面的示意图表示 Project-A 依赖于 Project-B。 当 A 在其 POM 中把 B 声明为可选依赖时，这种依赖关系保持不变。 和普通的构建一样， Project-B 仍然会被加入 Project-A 的 classpath。

```
Project-X -> Project-A
```

When another project (Project-X) declares Project-A as a dependency in its POM, the optional nature of the dependency takes effect. Project-B is not included in the classpath of Project-X. You need to declare it directly in the POM of Project X for B to be included in X's classpath.

当另一个项目(Project-X)在其 POM 中声明依赖于 Project-A 时，可选依赖的特性就会生效。 Project-B 不会被包含到 Project-X 的 classpath 中。 如果希望 B 出现在 X 的 classpath 中，就必须在 Project-X 的 POM 中直接声明它。

#### Example

示例

Suppose there is a project named *X2* that has similar functionality to *Hibernate*. It supports many databases such as MySQL, PostgreSQL, and several versions of Oracle. Each supported database requires an additional dependency on a driver jar. All of these dependencies are needed at compile time to build X2. However your project only uses one specific database and doesn't need drivers for the others. X2 can declare these dependencies as optional, so that when your project declares X2 as a direct dependency in its POM, all the drivers supported by the X2 are not automatically included in your project's classpath. Your project will have to include an explicit dependency on the specific driver for the one database it does use.

假设有一个名为 *X2* 的项目，功能与 *Hibernate* 类似。 它支持多种数据库，例如 MySQL、PostgreSQL，以及 Oracle 的几个版本。 每支持一种数据库，就需要额外依赖一个驱动 jar 包。 编译 X2 时，所有这些依赖都是必需的。 但我们的项目只使用其中某一个特定的数据库，不需要其他数据库的驱动。 此时 X2 就可以把这些依赖声明为可选，这样当我们的项目在 POM 中把 X2 声明为直接依赖时， X2 所支持的所有驱动都不会自动进入我们项目的 classpath。 我们的项目必须显式声明它实际使用的那一个数据库的驱动依赖。

### Dependency Exclusions

依赖排除(Dependency Exclusions)

Since Maven resolves dependencies transitively, it is possible for unwanted dependencies to be included in your project's classpath. For example, a certain older jar may have security issues or be incompatible with the Java version you're using. To address this, Maven allows you to exclude specific dependencies. Exclusions are set on a specific dependency in your POM, and are targeted at a specific groupId and artifactId. When you build your project, that artifact will not be added to your project's classpath *by way of the dependency in which the exclusion was declared*.

由于 Maven 会以传递的方式解析依赖，因此项目 classpath 中可能会引入一些不想要的依赖。 例如，某个老版本的 jar 可能存在安全问题，或者与我们使用的 Java 版本不兼容。 为了解决这个问题，Maven 允许排除特定的依赖。 排除规则设置在 POM 中的某个具体依赖上，并针对特定的 groupId 和 artifactId。 构建项目时，该组件不会*通过声明排除规则的那个依赖*被加入到项目的 classpath 中。

#### How to use dependency exclusions

如何使用依赖排除

Add an <exclusions> element in the <dependency> element by which the problematic jar is included.

在引入问题 jar 的那个 <dependency> 元素中，添加一个 <exclusions> 元素：

```
<project>  ...  <dependencies>    <dependency>      <groupId>sample.ProjectA</groupId>      <artifactId>Project-A</artifactId>      <version>1.0</version>      <scope>compile</scope>      <exclusions>        <exclusion>  <!-- declare the exclusion here -->          <groupId>sample.ProjectB</groupId>          <artifactId>Project-B</artifactId>        </exclusion>      </exclusions>     </dependency>  </dependencies></project>
```

#### How dependency exclusion works and when to use it **( as a last resort! )**

依赖排除是如何生效的，什么时候使用它 **( 最后的手段！ )**

```
Project-A   -> Project-B        -> Project-D <! -- This dependency should be excluded -->              -> Project-E              -> Project-F   -> Project C
```

The diagram shows that Project-A depends on both Project-B and C. Project-B depends on Project-D. Project-D depends on both Project-E and F. By default, Project A's classpath will include:

从图中可以看出， Project-A 同时依赖于 Project-B 和 Project C。 Project-B 依赖于 Project-D。 Project-D 又同时依赖于 Project-E 和 Project F。 默认情况下， Project A 的 classpath 会包含：

```
B, C, D, E, F
```

Suppose you don't want project D and its dependencies to be added to Project A's classpath because some of Project-D's dependencies are missing from the repository, and you don't need the functionality in Project-B that depends on Project-D anyway. Project-B's developers could have marked the dependency on Project-D <optional>true</optional>:

假设因为 Project-D 的某些依赖在仓库中缺失，而且我们也不需要 Project-B 中依赖 Project-D 的那部分功能，所以不希望把 Project D 及其依赖加入到 Project A 的 classpath 中。 Project-B 的开发者本可以把对 Project-D 的依赖标记为 <optional>true</optional>：

```
<dependency>  <groupId>sample.ProjectD</groupId>  <artifactId>ProjectD</artifactId>  <version>1.0-SNAPSHOT</version>  <optional>true</optional></dependency>
```

Unfortunately, they didn't. As a last resort, you can exclude it on your own POM for Project-A like this:

遗憾的是，他们并没有这样做。 作为最后的手段，我们可以在自己的 Project-A 的 POM 中这样排除它：

```
<project>  <modelVersion>4.0.0</modelVersion>  <groupId>sample.ProjectA</groupId>  <artifactId>Project-A</artifactId>  <version>1.0-SNAPSHOT</version>  <packaging>jar</packaging>  ...  <dependencies>    <dependency>      <groupId>sample.ProjectB</groupId>      <artifactId>Project-B</artifactId>      <version>1.0-SNAPSHOT</version>      <exclusions>        <exclusion>          <groupId>sample.ProjectD</groupId> <!-- Exclude Project-D from Project-B -->          <artifactId>Project-D</artifactId>        </exclusion>      </exclusions>    </dependency>  </dependencies></project>
```

If you deploy Project-A to a repository, and Project-X declares a normal dependency on Project-A, will Project-D still be excluded from the classpath?

如果我们把 Project-A 部署到仓库中，而 Project-X 声明了一个对 Project-A 的普通依赖，那么 Project-D 还会被从 classpath 中排除吗？

```
Project-X -> Project-A
```

The answer is **Yes**. Project-A has declared that it doesn't need Project-D to run, so it won't be brought in as a transitive dependency of Project-A.

答案是**会**。 Project-A 已经声明它运行时不依赖 Project-D，因此 Project-D 不会被作为 Project-A 的传递依赖引入。

Now, consider that Project-X depends on Project-Y, as in the diagram below:

现在再考虑一种情况： Project-X 依赖于 Project-Y，如下图所示：

```
Project-X -> Project-Y               -> Project-B                    -> Project-D                       ...
```

Project-Y also has a dependency on Project-B, and it does need the features supported by Project-D. Therefore, it will NOT place an exclusion on Project-D in its dependency list. It may also supply an additional repository, from which it can resolve Project-E. In this case, it's important that Project-D **is not** excluded globally, since it is a legitimate dependency of Project-Y.

Project-Y 同样依赖于 Project-B，而且它确实需要 Project-D 提供的功能。 因此，它不会在自己的依赖列表中排除 Project-D。 它还可能会额外提供一个仓库，以便解析 Project-E。 在这种情况下，重要的是 Project-D **不能**被全局排除，因为它是 Project-Y 的一个正当依赖。

As another scenario, suppose the dependency you don't want is Project-E instead of Project-D. How do you exclude it? See the diagram below:

再来看另一种场景：假设我们要排除的不是 Project-D，而是 Project-E，该怎么排除呢？ 请看下图：

```
Project-A   -> Project-B        -> Project-D               -> Project-E <!-- Exclude this dependency -->              -> Project-F   -> Project C
```

Exclusions work on the entire dependency graph below the point where they are declared. If you want to exclude Project-E instead of Project-D, simply change the exclusion to point at Project-E, but you don't move the exclusion down to Project-D. You cannot change Project-D's POM. If you could, you would use optional dependencies instead of exclusions, or split Project-D up into multiple subprojects, each with nothing but normal dependencies.

排除规则作用于声明位置之下的整棵依赖图。 如果想排除的是 Project-E 而不是 Project-D，只要把排除规则改为指向 Project-E 即可，不需要把排除规则下移到 Project-D。 我们无法修改 Project-D 的 POM。 如果能修改，就应该改用可选依赖而不是排除，或者把 Project-D 拆分成多个子项目，让每个子项目只包含普通依赖。

```
<project>  <modelVersion>4.0.0</modelVersion>  <groupId>sample.ProjectA</groupId>  <artifactId>Project-A</artifactId>  <version>1.0-SNAPSHOT</version>  <packaging>jar</packaging>  ...  <dependencies>    <dependency>      <groupId>sample.ProjectB</groupId>      <artifactId>Project-B</artifactId>      <version>1.0-SNAPSHOT</version>      <exclusions>        <exclusion>          <groupId>sample.ProjectE</groupId> <!-- Exclude Project-E from Project-B -->          <artifactId>Project-E</artifactId>        </exclusion>      </exclusions>    </dependency>  </dependencies></project>
```

#### Why exclusions are made on a per-dependency basis, rather than at the POM level

为什么排除规则是针对单个依赖项设置的，而不是在 POM 级别设置

This is mainly to be sure the dependency graph is predictable, and to keep inheritance effects from excluding a dependency that should not be excluded. If you get to the method of last resort and have to put in an exclusion, you should be absolutely certain which of your dependencies is bringing in that unwanted transitive dependency.

这主要是为了保证依赖图是可预测的，并避免由于继承的影响而排除了本不该排除的依赖。 如果到了不得不使用排除这最后手段的地步，我们应该非常确定，是哪一个依赖引入了那个不想要的传递依赖。

If you truly want to ensure that a particular dependency appears nowhere in your classpath, regardless of path, the [banned dependencies rule](https://maven.apache.org/enforcer/enforcer-rules/bannedDependencies.html) can be configured to fail the build if a problematic dependency is found. When the build fails, you'll need to add specific exclusions on each path the enforcer finds.

如果真的想确保某个依赖无论通过哪条路径都不会出现在 classpath 中，可以配置 [banned dependencies rule](https://maven.apache.org/enforcer/enforcer-rules/bannedDependencies.html)，一旦发现存在问题的依赖就让构建失败。 构建失败之后，再根据 enforcer 找到的每一条路径分别添加具体的排除规则。



### 参考链接

原文链接: <https://maven.apache.org/guides/introduction/introduction-to-optional-and-excludes-dependencies.html>
