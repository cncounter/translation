## Introduction to the Dependency Mechanism

## MAVEN基础系列（五） 浅析pom依赖机制

相关文章:

- [MAVEN基础系列（〇） Maven五分钟入门教程](./maven-in-five-minutes.md)
- [MAVEN基础系列（一） 项目构建的各个阶段](./introduction-to-the-lifecycle.md)
- [MAVEN基础系列（二） POM文件](./README.md)
- [MAVEN基础系列（三） Profiles配置打包环境](./introduction-to-profiles.md)
- [MAVEN基础系列（四） 标准的Maven项目结构](./standard-directory-layout.md)
- [MAVEN基础系列（五） 浅析pom依赖机制](./introduction-to-dependency-mechanism.md)
- [MAVEN基础系列（六） 依赖项排除与可选依赖](./optional-and-excludes-dependencies.md)

Dependency management is a core feature of Maven. Managing dependencies for a single project is easy. Managing dependencies for multi-module projects and applications that consist of hundreds of modules is possible. Maven helps a great deal in defining, creating, and maintaining reproducible builds with well-defined classpaths and library versions.

Learn more about:

- Transitive Dependencies
  - Excluded/Optional Dependencies
- [Dependency Scope](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#Dependency_Scope)
- Dependency Management
  - [Importing Dependencies](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#Importing_Dependencies)
  - [Bill of Materials (BOM) POMs](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)
- [System Dependencies](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#System_Dependencies)

依赖管理(dependency management)是 Maven 的核心功能之一。管理单个项目的依赖很容易；管理多模块项目、以及由数百个模块组成的应用的依赖也是可行的。Maven 通过定义良好的类路径(classpath)和库版本，帮助我们定义、创建和维护可重复构建(reproducible build)。

了解更多：

- 传递性依赖(Transitive Dependencies)
  - 被排除的依赖 / 可选依赖(Excluded/Optional Dependencies)
- [依赖作用域(Dependency Scope)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#Dependency_Scope)
- 依赖管理(Dependency Management)
  - [导入依赖(Importing Dependencies)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#Importing_Dependencies)
  - [物料清单(BOM) POM](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)
- [系统依赖(System Dependencies)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#System_Dependencies)

### Transitive Dependencies

Maven avoids the need to discover and specify the libraries that your own dependencies require by including transitive dependencies automatically.

### 5.1 传递性依赖(Transitive Dependencies)

Maven 会自动引入传递性依赖，从而避免了自行发现和声明「你的依赖还需要哪些库」这一麻烦。

This feature is facilitated by reading the project files of your dependencies from the remote repositories specified. In general, all dependencies of those projects are used in your project, as are any that the project inherits from its parents, or from its dependencies, and so on.

这一功能是通过从指定的远程仓库读取依赖项目的项目文件来实现的。通常来说，这些项目的所有依赖都会被引入到你的项目中，包括项目从父项目继承的依赖、以及它的依赖所带的依赖，依此类推。

There is no limit to the number of levels that dependencies can be gathered from. A problem arises only if a cyclic dependency is discovered.

依赖可以层层收集，层数没有限制。只有出现循环依赖(cyclic dependency)时才会产生问题。

With transitive dependencies, the graph of included libraries can quickly grow quite large. For this reason, there are additional features that limit which dependencies are included:

引入传递性依赖之后，所包含的库依赖图会迅速膨胀得非常大。因此，Maven 提供了一些附加功能，用来限制哪些依赖会被包含进来：

- Dependency mediation



  \- this determines what version of an artifact will be chosen when multiple versions are encountered as dependencies. Maven picks the "nearest definition". That is, it uses the version of the closest dependency to your project in the tree of dependencies. You can always guarantee a version by declaring it explicitly in your project's POM. Note that if two dependency versions are at the same depth in the dependency tree, the first declaration wins.

  \- 依赖调解(Dependency mediation)：当同一个组件(artifact)以多个版本作为依赖出现时，用来决定选用哪个版本。Maven 采用「最近定义(nearest definition)」原则，也就是说，使用依赖树中距离你的项目最近的那个依赖的版本。你随时可以在项目的 POM 中显式声明版本，来保证使用某个版本。注意，如果两个依赖版本在依赖树中处于相同的深度，则以先声明的那个为准。

  - "nearest definition" means that the version used will be the closest one to your project in the tree of dependencies. Consider this tree of dependencies:

  - 「最近定义」是指：最终使用的版本，是依赖树中距离你的项目最近的那一个版本。请看下面的依赖树：

    ```
      A
      ├── B
      │   └── C
      │       └── D 2.0
      └── E
          └── D 1.0
    ```

    In text, dependencies for A, B, and C are defined as A -> B -> C -> D 2.0 and A -> E -> D 1.0, then D 1.0 will be used when building A because the path from A to D through E is shorter. You could explicitly add a dependency to D 2.0 in A to force the use of D 2.0, as shown here:

    用文字来描述：A、B、C 的依赖关系为 A -> B -> C -> D 2.0 和 A -> E -> D 1.0，那么构建 A 时会使用 D 1.0，因为从 A 经过 E 到 D 的路径更短。你也可以在 A 中显式添加对 D 2.0 的依赖，强制使用 D 2.0，如下所示：

    ```
      A
      ├── B
      │   └── C
      │       └── D 2.0
      ├── E
      │   └── D 1.0
      │
      └── D 2.0      
    ```

- *Dependency management* - this allows project authors to directly specify the versions of artifacts to be used when they are encountered in transitive dependencies or in dependencies where no version has been specified. In the example in the preceding section a dependency was directly added to A even though it is not directly used by A. Instead, A can include D as a dependency in its dependencyManagement section and directly control which version of D is used when, or if, it is ever referenced.

- *依赖管理(Dependency management)* - 它允许项目作者直接指定：当在传递性依赖中遇到某个组件、或者在未指定版本的依赖中遇到某个组件时，应当使用哪个版本。上一节的例子中，虽然 A 并没有直接使用 D，却给 A 直接添加了对 D 的依赖。其实更合适的做法是：A 可以把 D 作为依赖放到自己的 dependencyManagement 节中，从而直接控制（当 D 被引用时）使用 D 的哪个版本。

- *Dependency scope* - this allows you to only include dependencies appropriate for the current stage of the build. This is described in more detail below.

- *依赖作用域(Dependency scope)* - 它让你只引入适用于当前构建阶段的依赖。详情见下文。

- *Excluded dependencies* - If project X depends on project Y, and project Y depends on project Z, the owner of project X can explicitly exclude project Z as a dependency, using the "exclusion" element.

- *排除依赖(Excluded dependencies)* - 如果项目 X 依赖项目 Y，而项目 Y 又依赖项目 Z，那么 X 的拥有者可以使用 `exclusion` 元素显式地把项目 Z 排除掉。

- *Optional dependencies* - If project Y depends on project Z, the owner of project Y can mark project Z as an optional dependency, using the "optional" element. When project X depends on project Y, X will depend only on Y and not on Y's optional dependency Z. The owner of project X may then explicitly add a dependency on Z, at her option. (It may be helpful to think of optional dependencies as "excluded by default.")

- *可选依赖(Optional dependencies)* - 如果项目 Y 依赖项目 Z，那么 Y 的拥有者可以使用 `optional` 元素把项目 Z 标记为可选依赖。当项目 X 依赖项目 Y 时，X 只会依赖 Y，而不会依赖 Y 的可选依赖 Z。X 的拥有者可以根据需要，再显式地添加对 Z 的依赖。（可以把可选依赖理解为「默认被排除」。）

Although transitive dependencies can implicitly include desired dependencies, it is a good practice to explicitly specify the dependencies your source code uses directly. This best practice proves its value especially when the dependencies of your project change their dependencies.

虽然传递性依赖可以隐式地引入我们需要的依赖，但更好的做法是：把源代码中直接使用的依赖都显式声明出来。当你的项目所依赖的库改变了它自身的依赖时，这一最佳实践尤其能体现出价值。

For example, assume that your project A specifies a dependency on another project B, and project B specifies a dependency on project C. If you are directly using components in project C, and you don't specify project C in your project A, it may cause build failure when project B suddenly updates/removes its dependency on project C.

例如，假设项目 A 依赖项目 B，项目 B 依赖项目 C。如果你的代码直接使用了项目 C 中的组件，却没有在项目 A 中声明对项目 C 的依赖，那么当项目 B 突然更新或移除对项目 C 的依赖时，就可能导致构建失败。

Another reason to directly specify dependencies is that it provides better documentation for your project: one can learn more information by just reading the POM file in your project, or by executing **mvn dependency:tree**.

直接声明依赖的另一个原因，是它能更好地为项目提供文档：别人只要阅读项目中的 POM 文件，或者执行 **mvn dependency:tree**，就能了解到更多信息。

Maven also provides [dependency:analyze](https://maven.apache.org/plugins/maven-dependency-plugin/analyze-mojo.html) plugin goal for analyzing the dependencies: it helps making this best practice more achievable.

Maven 还提供了 [dependency:analyze](https://maven.apache.org/plugins/maven-dependency-plugin/analyze-mojo.html) 插件目标来分析依赖关系：它有助于让这一最佳实践更容易落地。

### Dependency Scope

Dependency scope is used to limit the transitivity of a dependency and to determine when a dependency is included in a classpath.

There are 6 scopes:

- **compile**
  This is the default scope, used if none is specified. Compile dependencies are available in all classpaths of a project. Furthermore, those dependencies are propagated to dependent projects.
- **provided**
  This is much like `compile`, but indicates you expect the JDK or a container to provide the dependency at runtime. For example, when building a web application for the Java Enterprise Edition, you would set the dependency on the Servlet API and related Java EE APIs to scope `provided` because the web container provides those classes. A dependency with this scope is added to the classpath used for compilation and test, but not the runtime classpath. It is not transitive.
- **runtime**
  This scope indicates that the dependency is not required for compilation, but is for execution. Maven includes a dependency with this scope in the runtime and test classpaths, but not the compile classpath.
- **test**
  This scope indicates that the dependency is not required for normal use of the application, and is only available for the test compilation and execution phases. This scope is not transitive. Typically this scope is used for test libraries such as JUnit and Mockito. It is also used for non-test libraries such as Apache Commons IO if those libraries are used in unit tests (src/test/java) but not in the model code (src/main/java).
- **system**
  This scope is similar to `provided` except that you have to provide the JAR which contains it explicitly. The artifact is always available and is not looked up in a repository.
- **import**
  This scope is only supported on a dependency of type `pom` in the `<dependencyManagement>` section. It indicates the dependency is to be replaced with the effective list of dependencies in the specified POM's `<dependencyManagement>` section. Since they are replaced, dependencies with a scope of `import` do not actually participate in limiting the transitivity of a dependency.

### 5.2 依赖作用域(Dependency Scope)

依赖作用域用于限制依赖的传递性，并决定一个依赖在何时被加入到类路径(classpath)中。

共有 6 种作用域：

- **compile**
  这是默认作用域，未指定时使用。compile 依赖在项目的所有类路径中都可用；而且这些依赖会传递（传播）到依赖它的项目。
- **provided**
  与 `compile` 很类似，但表示你期望由 JDK 或容器在运行时提供该依赖。例如，为 Java 企业版构建 Web 应用时，Servlet API 及相关 Java EE API 的依赖就应当设为 `provided` 作用域，因为这些类由 Web 容器提供。此作用域的依赖会被加入编译和测试所用的类路径，但不会加入运行时类路径。它不具备传递性。
- **runtime**
  此作用域表示该依赖在编译时不需要，但在运行时需要。Maven 会把此作用域的依赖加入运行时类路径和测试类路径，但不会加入编译类路径。
- **test**
  此作用域表示该依赖在应用的正常使用中不需要，只在测试的编译和执行阶段可用。此作用域不具备传递性。通常用于 JUnit、Mockito 之类的测试库；如果 Apache Commons IO 之类的非测试库只在单元测试（src/test/java）中使用，而不在业务代码（src/main/java）中使用，也会用到此作用域。
- **system**
  此作用域与 `provided` 类似，区别在于你必须显式提供包含该依赖的 JAR 包。该组件始终可用，不会到仓库中去查找。
- **import**
  此作用域只支持 `<dependencyManagement>` 中类型为 `pom` 的依赖。它表示该依赖将被替换为指定 POM 的 `<dependencyManagement>` 中的有效依赖列表。由于会被替换，作用域为 `import` 的依赖实际上并不参与限制依赖的传递性。

Each of the scopes (except for `import`) affects transitive dependencies in different ways, as is demonstrated in the table below. If a dependency is set to the scope in the left column, a transitive dependency of that dependency with the scope across the top row results in a dependency in the main project with the scope listed at the intersection. If no scope is listed, it means the dependency is omitted.

每一种作用域（`import` 除外）对传递性依赖的影响各不相同，如下表所示。如果某个依赖被设置为左侧一列的作用域，而该依赖的某个传递性依赖属于最上面一行对应的作用域，那么主项目中该依赖最终的作用域就是两者交叉处的取值。如果交叉处没有列出作用域，就表示该依赖会被忽略（不引入）。

|          | compile    | provided | runtime  | test |
| -------- | ---------- | -------- | -------- | ---- |
| compile  | compile(*) | -        | runtime  | -    |
| provided | provided   | -        | provided | -    |
| runtime  | runtime    | -        | runtime  | -    |
| test     | test       | -        | test     | -    |

**(\*) Note:** it is intended that this should be runtime scope instead, so that all compile dependencies must be explicitly listed. However, if a library you depend on extends a class from another library, both must be available at compile time. For this reason, compile time dependencies remain as compile scope even when they are transitive.

**(\*) 注意：** 这里本意是应当为 runtime 作用域，这样所有 compile 依赖都必须显式列出。但是，如果你依赖的某个库继承了另一个库中的类，那么这两个库在编译期都必须可用。因此，即使是传递而来的 compile 依赖，也仍然保持 compile 作用域。

### Dependency Management

The dependency management section is a mechanism for centralizing dependency information. When you have a set of projects that inherit from a common parent, it's possible to put all information about the dependency in the common POM and have simpler references to the artifacts in the child POMs. The mechanism is best illustrated through some examples. Given these two POMs which extend the same parent:

### 5.3 依赖管理(Dependency Management)

依赖管理(dependencyManagement)这一节，是用来集中管理依赖信息的机制。当你有一组继承自同一个父项目的项目时，可以把依赖的全部信息都放到这个公共父 POM 中，子 POM 里只需要更简单地引用这些组件即可。这一机制最好通过示例来说明。假设有下面这两个继承自同一父项目的 POM：

Project A:

项目 A：

```xml
<project>
  ...
  <dependencies>
    <dependency>
      <groupId>group-a</groupId>
      <artifactId>artifact-a</artifactId>
      <version>1.0</version>
      <exclusions>
        <exclusion>
          <groupId>group-c</groupId>
          <artifactId>excluded-artifact</artifactId>
        </exclusion>
      </exclusions>
    </dependency>
    <dependency>
      <groupId>group-a</groupId>
      <artifactId>artifact-b</artifactId>
      <version>1.0</version>
      <type>bar</type>
      <scope>runtime</scope>
    </dependency>
  </dependencies>
</project>
```

Project B:

项目 B：

```xml
<project>
  ...
  <dependencies>
    <dependency>
      <groupId>group-c</groupId>
      <artifactId>artifact-b</artifactId>
      <version>1.0</version>
      <type>war</type>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>group-a</groupId>
      <artifactId>artifact-b</artifactId>
      <version>1.0</version>
      <type>bar</type>
      <scope>runtime</scope>
    </dependency>
  </dependencies>
</project>
```

These two example POMs share a common dependency and each has one non-trivial dependency. This information can be put in the parent POM like this:

这两个示例 POM 共享一个公共依赖，并且各自还有一个不那么简单的依赖。这些信息可以像下面这样放到父 POM 中：

```xml
<project>
  ...
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>group-a</groupId>
        <artifactId>artifact-a</artifactId>
        <version>1.0</version>

        <exclusions>
          <exclusion>
            <groupId>group-c</groupId>
            <artifactId>excluded-artifact</artifactId>
          </exclusion>
        </exclusions>

      </dependency>

      <dependency>
        <groupId>group-c</groupId>
        <artifactId>artifact-b</artifactId>
        <version>1.0</version>
        <type>war</type>
        <scope>runtime</scope>
      </dependency>

      <dependency>
        <groupId>group-a</groupId>
        <artifactId>artifact-b</artifactId>
        <version>1.0</version>
        <type>bar</type>
        <scope>runtime</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
</project>
```

Then the two child POMs become much simpler:

这样，两个子 POM 就变得简单多了：

```xml
<project>
  ...
  <dependencies>
    <dependency>
      <groupId>group-a</groupId>
      <artifactId>artifact-a</artifactId>
    </dependency>

    <dependency>
      <groupId>group-a</groupId>
      <artifactId>artifact-b</artifactId>
      <!-- This is not a jar dependency, so we must specify type. -->
      <type>bar</type>
    </dependency>
  </dependencies>
</project>
```

```xml
<project>
  ...
  <dependencies>
    <dependency>
      <groupId>group-c</groupId>
      <artifactId>artifact-b</artifactId>
      <!-- This is not a jar dependency, so we must specify type. -->
      <type>war</type>
    </dependency>

    <dependency>
      <groupId>group-a</groupId>
      <artifactId>artifact-b</artifactId>
      <!-- This is not a jar dependency, so we must specify type. -->
      <type>bar</type>
    </dependency>
  </dependencies>
</project>
```

**NOTE:** In two of these dependency references, we had to specify the <type/> element. This is because the minimal set of information for matching a dependency reference against a dependencyManagement section is actually **{groupId, artifactId, type, classifier}**. In many cases, these dependencies will refer to jar artifacts with no classifier. This allows us to shorthand the identity set to **{groupId, artifactId}**, since the default for the type field is `jar`, and the default classifier is null.

**注意：** 这些依赖引用中有两处必须指定 `<type/>` 元素。这是因为，要让某个依赖引用与 dependencyManagement 节中的条目相匹配，所需的最小信息集合实际上是 **{groupId, artifactId, type, classifier}**。很多时候，这些依赖指向的是没有 classifier 的 jar 组件。由于 type 字段的默认值是 `jar`，classifier 的默认值是 null，所以我们可以把标识集合简写为 **{groupId, artifactId}**。

A second, and very important use of the dependency management section is to control the versions of artifacts used in transitive dependencies. As an example consider these projects:

依赖管理节的第二个、也是非常重要的用途，是控制传递性依赖中所用组件的版本。举例来说，看下面这些项目：

Project A:

项目 A：

```xml
<project>
 <modelVersion>4.0.0</modelVersion>
 <groupId>maven</groupId>
 <artifactId>A</artifactId>
 <packaging>pom</packaging>
 <name>A</name>
 <version>1.0</version>
 <dependencyManagement>
   <dependencies>
     <dependency>
       <groupId>test</groupId>
       <artifactId>a</artifactId>
       <version>1.2</version>
     </dependency>
     <dependency>
       <groupId>test</groupId>
       <artifactId>b</artifactId>
       <version>1.0</version>
       <scope>compile</scope>
     </dependency>
     <dependency>
       <groupId>test</groupId>
       <artifactId>c</artifactId>
       <version>1.0</version>
       <scope>compile</scope>
     </dependency>
     <dependency>
       <groupId>test</groupId>
       <artifactId>d</artifactId>
       <version>1.2</version>
     </dependency>
   </dependencies>
 </dependencyManagement>
</project>
```

Project B:

项目 B：

```xml
<project>
  <parent>
    <artifactId>A</artifactId>
    <groupId>maven</groupId>
    <version>1.0</version>
  </parent>
  <modelVersion>4.0.0</modelVersion>
  <groupId>maven</groupId>
  <artifactId>B</artifactId>
  <packaging>pom</packaging>
  <name>B</name>
  <version>1.0</version>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>test</groupId>
        <artifactId>d</artifactId>
        <version>1.0</version>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>test</groupId>
      <artifactId>a</artifactId>
      <version>1.0</version>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>test</groupId>
      <artifactId>c</artifactId>
      <scope>runtime</scope>
    </dependency>
  </dependencies>
</project>
```

When maven is run on project B, version 1.0 of artifacts a, b, c, and d will be used regardless of the version specified in their POM.

当对项目 B 执行 Maven 时，组件 a、b、c、d 都会使用 1.0 版本，而不管它们各自的 POM 中指定的是什么版本。

- a and c both are declared as dependencies of the project so version 1.0 is used due to dependency mediation. Both also have runtime scope since it is directly specified.
- b is defined in B's parent's dependency management section and since dependency management takes precedence over dependency mediation for transitive dependencies, version 1.0 will be selected should it be referenced in a or c's POM. b will also have compile scope.
- Finally, since d is specified in B's dependency management section, should d be a dependency (or transitive dependency) of a or c, version 1.0 will be chosen - again because dependency management takes precedence over dependency mediation and also because the current POM's declaration takes precedence over its parent's declaration.

- a 和 c 都在项目中声明为依赖，因此根据依赖调解，使用 1.0 版本。由于是直接声明的，两者也都是 runtime 作用域。
- b 定义在 B 的父项目的依赖管理节中；由于对传递性依赖来说，依赖管理优先于依赖调解，所以如果 a 或 c 的 POM 中引用了 b，就会选用 1.0 版本。b 还拥有 compile 作用域。
- 最后，由于 d 在 B 的依赖管理节中指定，因此如果 d 是 a 或 c 的依赖（或传递性依赖），就会选用 1.0 版本——同样是因为依赖管理优先于依赖调解，也因为当前 POM 中的声明优先于其父项目的声明。

The reference information about the dependency management tags is available from the [project descriptor reference](https://maven.apache.org/ref/current/maven-model/maven.html#class_DependencyManagement).

关于依赖管理标签的参考信息，可以查阅 [项目描述符参考手册(project descriptor reference)](https://maven.apache.org/ref/current/maven-model/maven.html#class_DependencyManagement)。

#### Importing Dependencies

The examples in the previous section describe how to specify managed dependencies through inheritance. However, in larger projects it may be impossible to accomplish this since a project can only inherit from a single parent. To accommodate this, projects can import managed dependencies from other projects. This is accomplished by declaring a POM artifact as a dependency with a scope of "import".

#### 5.3.1 导入依赖(Importing Dependencies)

上一节的示例演示了如何通过继承来指定受管理的依赖(managed dependencies)。但在较大的项目中，这样做可能行不通，因为一个项目只能继承一个父项目。为了应对这种情况，项目可以从其他项目导入受管理的依赖。具体做法是：把一个 POM 组件声明为依赖，并把作用域设为 `import`。

Project B:

项目 B：

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>maven</groupId>
  <artifactId>B</artifactId>
  <packaging>pom</packaging>
  <name>B</name>
  <version>1.0</version>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>maven</groupId>
        <artifactId>A</artifactId>
        <version>1.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
      <dependency>
        <groupId>test</groupId>
        <artifactId>d</artifactId>
        <version>1.0</version>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>test</groupId>
      <artifactId>a</artifactId>
      <version>1.0</version>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>test</groupId>
      <artifactId>c</artifactId>
      <scope>runtime</scope>
    </dependency>
  </dependencies>
</project>
```

Assuming A is the POM defined in the preceding example, the end result would be the same. All of A's managed dependencies would be incorporated into B except for d since it is defined in this POM.

假设 A 就是前一示例中定义的 POM，那么最终结果是一样的。A 中所有受管理的依赖都会被合并到 B 中，唯独 d 例外，因为它在本 POM 中已经定义过了。

Project X:

项目 X：

```xml
<project>
 <modelVersion>4.0.0</modelVersion>
 <groupId>maven</groupId>
 <artifactId>X</artifactId>
 <packaging>pom</packaging>
 <name>X</name>
 <version>1.0</version>

 <dependencyManagement>
   <dependencies>
     <dependency>
       <groupId>test</groupId>
       <artifactId>a</artifactId>
       <version>1.1</version>
     </dependency>
     <dependency>
       <groupId>test</groupId>
       <artifactId>b</artifactId>
       <version>1.0</version>
       <scope>compile</scope>
     </dependency>
   </dependencies>
 </dependencyManagement>
</project>
```

Project Y:

项目 Y：

```xml
<project>
 <modelVersion>4.0.0</modelVersion>
 <groupId>maven</groupId>
 <artifactId>X</artifactId>
 <packaging>pom</packaging>
 <name>X</name>
 <version>1.0</version>

 <dependencyManagement>
   <dependencies>
     <dependency>
       <groupId>test</groupId>
       <artifactId>a</artifactId>
       <version>1.1</version>
     </dependency>
     <dependency>
       <groupId>test</groupId>
       <artifactId>b</artifactId>
       <version>1.0</version>
       <scope>compile</scope>
     </dependency>
   </dependencies>
 </dependencyManagement>
</project>
<project>
 <modelVersion>4.0.0</modelVersion>
 <groupId>maven</groupId>
 <artifactId>Y</artifactId>
 <packaging>pom</packaging>
 <name>Y</name>
 <version>1.0</version>

 <dependencyManagement>
   <dependencies>
     <dependency>
       <groupId>test</groupId>
       <artifactId>a</artifactId>
       <version>1.2</version>
     </dependency>
     <dependency>
       <groupId>test</groupId>
       <artifactId>c</artifactId>
       <version>1.0</version>
       <scope>compile</scope>
     </dependency>
   </dependencies>
 </dependencyManagement>
</project>
```

Project Z:

项目 Z：

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>maven</groupId>
  <artifactId>Z</artifactId>
  <packaging>pom</packaging>
  <name>Z</name>
  <version>1.0</version>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>maven</groupId>
        <artifactId>X</artifactId>
        <version>1.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
      <dependency>
        <groupId>maven</groupId>
        <artifactId>Y</artifactId>
        <version>1.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
</project>
```

In the example above Z imports the managed dependencies from both X and Y. However, both X and Y contain dependency a. Here, version 1.1 of a would be used since X is declared first and a is not declared in Z's dependencyManagement.

在上面的示例中，Z 同时从 X 和 Y 导入了受管理的依赖。但是 X 和 Y 中都含有依赖 a。这里会使用 a 的 1.1 版本，因为 X 声明在前，而且 a 没有在 Z 的 dependencyManagement 中声明。

This process is recursive. For example, if X imports another POM, Q, when Z is processed it will simply appear that all of Q's managed dependencies are defined in X.

这个过程是递归的。例如，如果 X 又导入了另一个 POM 叫 Q，那么在处理 Z 时，Q 中所有受管理的依赖就仿佛都定义在 X 中一样。

#### Bill of Materials (BOM) POMs

Imports are most effective when used for defining a "library" of related artifacts that are generally part of a multiproject build. It is fairly common for one project to use one or more artifacts from these libraries. However, it has sometimes been difficult to keep the versions in the project using the artifacts in synch with the versions distributed in the library. The pattern below illustrates how a "bill of materials" (BOM) can be created for use by other projects.

#### 5.3.2 物料清单(BOM) POM

当用于定义一组相关组件的「库」时，导入最为有效，这类库通常也是多项目构建的一部分。一个项目使用这些库中的一个或多个组件是很常见的。但有时很难让使用这些组件的项目中的版本，与库中发布的版本保持同步。下面的模式演示了如何创建一份「物料清单(bill of materials，BOM)」供其他项目使用。

The root of the project is the BOM POM. It defines the versions of all the artifacts that will be created in the library. Other projects that wish to use the library should import this POM into the dependencyManagement section of their POM.

项目的根 POM 就是 BOM POM。它定义了该库中将要创建的所有组件的版本。其他想要使用这个库的项目，只需把这个 POM 导入到自己 POM 的 dependencyManagement 节中即可。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.test</groupId>
  <artifactId>bom</artifactId>
  <version>1.0.0</version>
  <packaging>pom</packaging>
  <properties>
    <project1Version>1.0.0</project1Version>
    <project2Version>1.0.0</project2Version>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.test</groupId>
        <artifactId>project1</artifactId>
        <version>${project1Version}</version>
      </dependency>
      <dependency>
        <groupId>com.test</groupId>
        <artifactId>project2</artifactId>
        <version>${project2Version}</version>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <modules>
    <module>parent</module>
  </modules>
</project>
```

The parent subproject has the BOM POM as its parent. It is a normal multiproject pom.

parent 子项目把 BOM POM 作为它的父项目。它就是一个普通的多项目 POM。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.test</groupId>
    <version>1.0.0</version>
    <artifactId>bom</artifactId>
  </parent>

  <groupId>com.test</groupId>
  <artifactId>parent</artifactId>
  <version>1.0.0</version>
  <packaging>pom</packaging>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.12</version>
      </dependency>
      <dependency>
        <groupId>commons-logging</groupId>
        <artifactId>commons-logging</artifactId>
        <version>1.1.1</version>
      </dependency>
    </dependencies>
  </dependencyManagement>
  <modules>
    <module>project1</module>
    <module>project2</module>
  </modules>
</project>
```

Next are the actual project POMs.

下面是实际项目的 POM。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.test</groupId>
    <version>1.0.0</version>
    <artifactId>parent</artifactId>
  </parent>
  <groupId>com.test</groupId>
  <artifactId>project1</artifactId>
  <version>${project1Version}</version>
  <packaging>jar</packaging>

  <dependencies>
    <dependency>
      <groupId>log4j</groupId>
      <artifactId>log4j</artifactId>
    </dependency>
  </dependencies>
</project>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.test</groupId>
    <version>1.0.0</version>
    <artifactId>parent</artifactId>
  </parent>
  <groupId>com.test</groupId>
  <artifactId>project2</artifactId>
  <version>${project2Version}</version>
  <packaging>jar</packaging>

  <dependencies>
    <dependency>
      <groupId>commons-logging</groupId>
      <artifactId>commons-logging</artifactId>
    </dependency>
  </dependencies>
</project>
```

The project that follows shows how the library can now be used in another project without having to specify the dependent project's versions.

接下来的项目演示了：现在如何在另一个项目中使用这个库，而无需指定所依赖项目的版本。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.test</groupId>
  <artifactId>use</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.test</groupId>
        <artifactId>bom</artifactId>
        <version>1.0.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.test</groupId>
      <artifactId>project1</artifactId>
    </dependency>
    <dependency>
      <groupId>com.test</groupId>
      <artifactId>project2</artifactId>
    </dependency>
  </dependencies>
</project>
```

Finally, when creating projects that import dependencies, beware of the following:

- Do not attempt to import a POM that is defined in a submodule of the current POM. Attempting to do that will result in the build failing since it won't be able to locate the POM.
- Never declare the POM importing a POM as the parent (or grandparent, etc) of the target POM. There is no way to resolve the circularity and an exception will be thrown.
- When referring to artifacts whose POMs have transitive dependencies, the project needs to specify versions of those artifacts as managed dependencies. Not doing so results in a build failure since the artifact may not have a version specified. (This should be considered a best practice in any case as it keeps the versions of artifacts from changing from one build to the next).

最后，在创建会导入依赖的项目时，要注意以下几点：

- 不要试图导入定义在当前 POM 的子模块中的 POM。这样做会导致构建失败，因为无法定位到该 POM。
- 绝不要把「导入某个 POM 的 POM」声明为目标 POM 的父项目（或祖父项目等）。这种循环关系无法解析，会抛出异常。
- 当引用的组件其 POM 含有传递性依赖时，项目需要把这些组件的版本指定为受管理的依赖。否则会导致构建失败，因为该组件可能没有指定版本。（无论如何，这都应被视为最佳实践，因为它可以让组件版本在不同构建之间保持不变。）

### System Dependencies

```
Important note: This is deprecated.
```

Dependencies with the scope *system* are always available and are not looked up in repository. They are usually used to tell Maven about dependencies which are provided by the JDK or the VM. Thus, system dependencies are especially useful for resolving dependencies on artifacts which are now provided by the JDK, but were available as separate downloads earlier. Typical examples are the JDBC standard extensions or the Java Authentication and Authorization Service (JAAS).

### 5.4 系统依赖(System Dependencies)

> 重要提示：系统依赖(System Dependencies)已经被废弃。

作用域为 *system* 的依赖始终可用，并且不会到仓库中去查找。它们通常用来告诉 Maven：某些依赖是由 JDK 或虚拟机(VM)提供的。因此，在解析那些现已由 JDK 提供、但早期需要单独下载的组件依赖时，系统依赖特别有用。典型的例子是 JDBC 标准扩展(JDBC standard extensions)或者 Java 认证与授权服务(JAAS)。

A simple example would be:

一个简单的例子：

```xml
<project>
  ...
  <dependencies>
    <dependency>
      <groupId>javax.sql</groupId>
      <artifactId>jdbc-stdext</artifactId>
      <version>2.0</version>
      <scope>system</scope>
      <systemPath>${java.home}/lib/rt.jar</systemPath>
    </dependency>
  </dependencies>
  ...
</project>
```

If your artifact is provided by the JDK's `tools.jar`, the system path would be defined as follows:

如果你的组件是由 JDK 的 `tools.jar` 提供的，那么 systemPath 可以定义如下：

```xml
<project>
  ...
  <dependencies>
    <dependency>
      <groupId>sun.jdk</groupId>
      <artifactId>tools</artifactId>
      <version>1.5.0</version>
      <scope>system</scope>
      <systemPath>${java.home}/../lib/tools.jar</systemPath>
    </dependency>
  </dependencies>
  ...
</project>
```

------



### 参考链接

原文链接: <https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html>
