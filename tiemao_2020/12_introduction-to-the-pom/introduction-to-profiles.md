## Introduction to Build Profiles

## MAVEN基础系列（三） Profiles配置打包环境

相关文章:

- [MAVEN基础系列（〇） Maven五分钟入门教程](./maven-in-five-minutes.md)
- [MAVEN基础系列（一） 项目构建的各个阶段](./introduction-to-the-lifecycle.md)
- [MAVEN基础系列（二） POM文件](./README.md)
- [MAVEN基础系列（三） Profiles配置打包环境](./introduction-to-profiles.md)
- [MAVEN基础系列（四） 标准的Maven项目结构](./standard-directory-layout.md)
- [MAVEN基础系列（五） 浅析pom依赖机制](./introduction-to-dependency-mechanism.md)
- [MAVEN基础系列（六） 依赖项排除与可选依赖](./optional-and-excludes-dependencies.md)

Apache Maven goes to great lengths to ensure that builds are portable. Among other things, this means allowing build configuration inside the POM, avoiding **all** filesystem references (in inheritance, dependencies, and other places), and leaning much more heavily on the local repository to store the metadata needed to make this possible.

However, sometimes portability is not entirely possible. Under certain conditions, plugins may need to be configured with local filesystem paths. Under other circumstances, a slightly different dependency set will be required, and the project's artifact name may need to be adjusted slightly. And at still other times, you may even need to include a whole plugin in the build lifecycle depending on the detected build environment.

To address these circumstances, Maven supports build profiles. Profiles are specified using a subset of the elements available in the POM itself (plus one extra section), and are triggered in any of a variety of ways. They modify the POM at build time, and are meant to be used in complementary sets to give equivalent-but-different parameters for a set of target environments (providing, for example, the path of the appserver root in the development, testing, and production environments). As such, profiles can easily lead to differing build results from different members of your team. However, used properly, profiles can be used while still preserving project portability. This will also minimize the use of `-f` option of maven which allows user to create another POM with different parameters or configuration to build which makes it more maintainable since it is runnning with one POM only.

Apache Maven 竭尽全力确保构建可移植。除其他外，这意味着允许在POM内进行构建配置，避免“所有”文件系统引用（在继承、依赖关系和其他位置），并更多地依赖于本地存储库来存储实现此目的所需的元数据。

但是，有时不能完全实现可移植性。在某些情况下，可能需要使用本地文件系统路径来配置插件。在其他情况下，将需要稍微不同的依赖项集，并且项目的组件名称可能需要稍作调整。在其他时候，根据检测到的构建环境，您甚至可能需要在构建生命周期中包括整个插件。

为了解决这些情况，Maven支持构建配置文件(profile)。配置文件是使用POM本身中可用元素的子集（加上一个额外的部分）指定的，并以多种方式触发。它们在构建时修改POM，旨在以互补的集合配合使用，从而为一组目标环境提供等效但不同的参数（例如，在开发、测试和生产环境中提供 appserver 根目录的路径）。因此，配置文件很容易导致团队中不同成员的构建结果不同。但是，如果使用得当，可以在保持项目可移植性的同时使用配置文件。这也能尽量减少使用Maven的 `-f` 选项——该选项允许用户创建另一个具有不同参数或配置的POM来进行构建，由于只用一个POM运行，这样更易于维护。

### What are the different types of profile? Where is each defined?

### Profile 有哪些类型？各自定义在哪里？

- Per Project

  \- Defined in the POM itself `(pom.xml)`.

- Per User

  \- Defined in the [Maven-settings](https://maven.apache.org/ref/current/maven-settings/settings.html) `(%USER_HOME%/.m2/settings.xml)`.

- Global

  \- Defined in the [global Maven-settings](https://maven.apache.org/ref/current/maven-settings/settings.html) `(${maven.home}/conf/settings.xml)`.

- Profile descriptor

  \- a descriptor located in [project basedir `(profiles.xml)`](https://maven.apache.org/ref/2.2.1/maven-profile/profiles.html) (no longer supported in Maven 3.0 and above; see [Maven 3 compatibility notes](https://cwiki.apache.org/confluence/display/MAVEN/Maven+3.x+Compatibility+Notes#Maven3.xCompatibilityNotes-profiles.xml))

- 项目级(Per Project)

  \- 定义在项目自身的 POM 中 `(pom.xml)`。

- 用户级(Per User)

  \- 定义在用户的 [Maven-settings](https://maven.apache.org/ref/current/maven-settings/settings.html) `(%USER_HOME%/.m2/settings.xml)` 中。

- 全局(Global)

  \- 定义在全局的 [Maven-settings](https://maven.apache.org/ref/current/maven-settings/settings.html) `(${maven.home}/conf/settings.xml)` 中。

- Profile 描述符(Profile descriptor)

  \- 位于 [项目根目录 `(profiles.xml)`](https://maven.apache.org/ref/2.2.1/maven-profile/profiles.html) 中的描述符(Maven 3.0 及更高版本已不再支持; 请参阅 [Maven 3 兼容性说明](https://cwiki.apache.org/confluence/display/MAVEN/Maven+3.x+Compatibility+Notes#Maven3.xCompatibilityNotes-profiles.xml))

### How can a profile be triggered? How does this vary according to the type of profile being used?

### Profile 如何触发？不同类型 profile 的触发方式有何区别？

A profile can be activated in several ways:

Profile 可以通过以下几种方式激活：

- From the command line
- Through Maven settings
- Based on environment variables
- OS settings
- Present or missing files

- 通过命令行
- 通过 Maven settings 配置文件
- 基于环境变量
- 操作系统设置(OS settings)
- 文件存在或文件缺失

#### Details on profile activation

#### Profile 激活方式详解

Profiles can be explicitly specified using the `-P` command line flag.

可以使用命令行参数 `-P` 显式指定 profile。

This flag is followed by a comma-delimited list of profile IDs to use. The profile(s) specified in the option are activated in addition to any profiles which are activated by their activation configuration or the `<activeProfiles>` section in `settings.xml`. From Maven 4 onward, Maven will refuse to activate or deactivate a profile that cannot be resolved. To prevent this, prefix the profile identifier with an `?`, marking it as optional:

该参数后面跟一个用逗号分隔的 profile ID 列表。 通过该选项指定的 profile 会被激活，此外，通过自身激活配置或 `settings.xml` 中的 `<activeProfiles>` 小节激活的 profile 也会一并生效。 从 Maven 4 开始，Maven 会拒绝激活或停用无法解析的 profile。 为了避免这种情况，可以在 profile 标识符前面加上 `?`，将其标记为可选：

```shell
mvn groupId:artifactId:goal -P profile-1,profile-2,?profile-3
```

Profiles can be activated in the Maven settings, via the `<activeProfiles>` section. This section takes a list of `<activeProfile>` elements, each containing a profile-id inside.

也可以在 Maven settings 中通过 `<activeProfiles>` 小节来激活 profile。 该小节接受一组 `<activeProfile>` 元素，每个元素内部包含一个 profile-id。

```xml
<settings>
  ...
  <activeProfiles>
    <activeProfile>profile-1</activeProfile>
  </activeProfiles>
  ...
</settings>
```

Profiles listed in the `<activeProfiles>` tag would be activated by default every time a project use it.

`<activeProfiles>` 标签中列出的 profile，每次项目使用该 settings 时都会默认激活。

Profiles can be automatically triggered based on the detected state of the build environment. These triggers are specified via an `<activation>` section in the profile itself. Currently, this detection is limited to prefix-matching of the JDK version, the presence of a system property or the value of a system property. Here are some examples.

Profile 也可以根据检测到的构建环境状态自动触发。 这些触发条件通过 profile 自身的 `<activation>` 小节来指定。 目前，这种检测仅限于 JDK 版本的前缀匹配、系统属性是否存在、或者系统属性的值。 下面是几个示例。

The following configuration will trigger the profile when the JDK's version starts with "1.4" (eg. "1.4.0_08", "1.4.2_07", "1.4"):

当 JDK 版本以 "1.4" 开头时(例如 "1.4.0_08"、"1.4.2_07"、"1.4")，下面的配置会触发该 profile：

```xml
<profiles>
  <profile>
    <activation>
      <jdk>1.4</jdk>
    </activation>
    ...
  </profile>
</profiles>
```

Ranges can also be used as of Maven 2.1 (refer to the [Enforcer Version Range Syntax](https://maven.apache.org/enforcer/enforcer-rules/versionRanges.html) for more information). The following honours versions 1.3, 1.4 and 1.5.

从 Maven 2.1 开始还可以使用版本区间(更多信息请参考 [Enforcer Version Range Syntax](https://maven.apache.org/enforcer/enforcer-rules/versionRanges.html))。 下面的配置会匹配 1.3、1.4 和 1.5 版本。

```xml
<profiles>
  <profile>
    <activation>
      <jdk>[1.3,1.6)</jdk>
    </activation>
    ...
  </profile>
</profiles>
```

*Note:* an upper bound such as `,1.5]` is likely not to include most releases of 1.5, since they will have an additional "patch" release such as `_05` that is not taken into consideration in the above range.

*注意：* 像 `,1.5]` 这样的上界，很可能匹配不到 1.5 的大多数发行版，因为它们还会有一个额外的 "补丁" 版本号，例如 `_05`，这在上面的区间中并未考虑在内。

This next one will activate based on OS settings. See the [Maven Enforcer Plugin](https://maven.apache.org/enforcer/enforcer-rules/requireOS.html) for more details about OS values.

下面这个示例将根据操作系统设置来激活。 关于 OS 取值的更多细节，请参考 [Maven Enforcer Plugin](https://maven.apache.org/enforcer/enforcer-rules/requireOS.html)。

```xml
<profiles>
  <profile>
    <activation>
      <os>
        <name>Windows XP</name>
        <family>Windows</family>
        <arch>x86</arch>
        <version>5.1.2600</version>
      </os>
    </activation>
    ...
  </profile>
</profiles>
```

The profile below will be activated when the system property "debug" is specified with any value:

当系统属性 "debug" 被指定为任意值时，下面的 profile 就会被激活：

```xml
<profiles>
  <profile>
    <activation>
      <property>
        <name>debug</name>
      </property>
    </activation>
    ...
  </profile>
</profiles>
```

The following profile will be activated when the system property "debug" is not defined at all:

当系统属性 "debug" 完全没有定义时，下面的 profile 会被激活：

```xml
<profiles>
  <profile>
    <activation>
      <property>
        <name>!debug</name>
      </property>
    </activation>
    ...
  </profile>
</profiles>
```

The following profile will be activated when the system property "debug" is not defined, or is defined with a value which is not "true".

当系统属性 "debug" 未定义，或者定义的值不是 "true" 时，下面的 profile 会被激活。

```xml
<profiles>
  <profile>
    <activation>
      <property>
        <name>debug</name>
        <value>!true</value>
      </property>
    </activation>
    ...
  </profile>
</profiles>
```

To activate this you would type one of those on the command line:

要激活它，可以在命令行中输入以下命令之一：

```
mvn groupId:artifactId:goal
mvn groupId:artifactId:goal -Ddebug=false
```

The next example will trigger the profile when the system property "environment" is specified with the value "test":

下一个示例会在系统属性 "environment" 被指定为值 "test" 时触发该 profile：

```xml
<profiles>
  <profile>
    <activation>
      <property>
        <name>environment</name>
        <value>test</value>
      </property>
    </activation>
    ...
  </profile>
</profiles>
```

To activate this you would type this on the command line:

要激活它，可以在命令行中输入以下命令：

```
mvn groupId:artifactId:goal -Denvironment=test
```

As of Maven 3.0, profiles in the POM can also be activated based on properties from active profiles from the `settings.xml`.

从 Maven 3.0 开始，POM 中的 profile 还可以根据 `settings.xml` 中已激活 profile 的属性来激活。

**Note**: Environment variables like `FOO` are available as properties of the form `env.FOO`. Further note that environment variable names are normalized to all upper-case on Windows.

**注意**：像 `FOO` 这样的环境变量，可以通过 `env.FOO` 形式的属性来访问。 另外请注意，在 Windows 上环境变量名会被规范化为全大写。

This example will trigger the profile when the generated file `target/generated-sources/axistools/wsdl2java/org/apache/maven` is missing.

这个示例会在生成的文件 `target/generated-sources/axistools/wsdl2java/org/apache/maven` 缺失时触发该 profile。

```xml
<profiles>
  <profile>
    <activation>
      <file>
        <missing>target/generated-sources/axistools/wsdl2java/org/apache/maven</missing>
      </file>
    </activation>
    ...
  </profile>
</profiles>
```

As of Maven 2.0.9, the tags `<exists>` and `<missing>` could be interpolated. Supported variables are system properties like `${user.home}` and environment variables like `${env.HOME}`. Please note that properties and values defined in the POM itself are not available for interpolation here, e.g. the above example activator cannot use `${project.build.directory}` but needs to hard-code the path `target`.

从 Maven 2.0.9 开始， `<exists>` 和 `<missing>` 标签支持变量插值。 支持的变量包括系统属性(如 `${user.home}`)和环境变量(如 `${env.HOME}`)。 请注意，POM 自身定义的属性和值在这里不可用于插值，例如上面的激活条件不能使用 `${project.build.directory}`，而必须硬编码路径 `target`。

Profiles can also be active by default using a configuration like the following:

Profile 也可以像下面这样配置为默认激活：

```xml
<profiles>
  <profile>
    <id>profile-1</id>
    <activation>
      <activeByDefault>true</activeByDefault>
    </activation>
    ...
  </profile>
</profiles>
```

This profile will automatically be active for all builds unless another profile in the same POM is activated using one of the previously described methods. All profiles that are active by default are automatically deactivated when a profile in the POM is activated on the command line or through its activation config.

除非同一个 POM 中的其他 profile 通过前面介绍的方式被激活，否则这个 profile 会在所有构建中自动激活。 当 POM 中的某个 profile 通过命令行或其激活配置被激活时，所有默认激活的 profile 都会自动停用。

#### Deactivating a profile

#### 停用 profile

Starting with Maven 2.0.10, one or more profiles can be deactivated using the command line by prefixing their identifier with either the character '!' or '-' as shown below:

从 Maven 2.0.10 开始，可以在命令行中通过在标识符前面加上字符 '!' 或 '-' 来停用一个或多个 profile，如下所示：

```
mvn groupId:artifactId:goal -P !profile-1,!profile-2,!?profile-3
```

This can be used to deactivate profiles marked as activeByDefault or profiles that would otherwise be activated through their activation config.

这可以用来停用标记为 activeByDefault 的 profile，或者那些原本会通过激活配置自动激活的 profile。

### Which areas of a POM can be customized by each type of profile? Why?

### 每种 profile 可以定制 POM 的哪些部分？为什么？

Now that we've talked about where to specify profiles, and how to activate them, it will be useful to talk about *what* you can specify in a profile. As with the other aspects of profile configuration, this answer is not straightforward.

前面已经介绍了 profile 在哪里定义、以及如何激活，接下来有必要讨论一下在 profile 中*可以*指定哪些内容。 和其他 profile 配置问题一样，这个答案并不简单。

Depending on where you choose to configure your profile, you will have access to varying POM configuration options.

根据我们选择配置 profile 的位置不同，可用的 POM 配置选项也不同。

#### Profiles in external files

#### 外部文件中的 profile

Profiles specified in external files (i.e in `settings.xml` or `profiles.xml`) are not portable in the strictest sense. Anything that seems to stand a high chance of changing the result of the build is restricted to the inline profiles in the POM. Things like repository lists could simply be a proprietary repository of approved artifacts, and won't change the outcome of the build. Therefore, you will only be able to modify the `<repositories>` and `<pluginRepositories>` sections, plus an extra `<properties>` section.

在外部文件(即 `settings.xml` 或 `profiles.xml`)中指定的 profile，严格来说是不可移植的。 任何很可能改变构建结果的内容，都被限制在 POM 中的内联 profile 里。 像仓库列表这类东西，可能只是一个存放已审核组件的私有仓库，并不会改变构建的结果。 因此，我们只能修改 `<repositories>` 和 `<pluginRepositories>` 小节，外加一个额外的 `<properties>` 小节。

The `<properties>` section allows you to specify free-form key-value pairs which will be included in the interpolation process for the POM. This allows you to specify a plugin configuration in the form of `${profile.provided.path}`.

`<properties>` 小节允许指定自由形式的键值对，这些键值对会参与到 POM 的插值过程中。 这样就可以用 `${profile.provided.path}` 的形式来指定插件的配置。

#### Profiles in POMs

#### POM 中的 profile

On the other hand, if your profiles can be reasonably specified *inside* the POM, you have many more options. The trade-off, of course, is that you can only modify *that* project and it's sub-modules. Since these profiles are specified inline, and therefore have a better chance of preserving portability, it's reasonable to say you can add more information to them without the risk of that information being unavailable to other users.

另一方面，如果 profile 可以合理地定义在 POM *内部*，那么可选项就多得多。 当然，代价是只能修改*该*项目及其子模块。 由于这些 profile 是内联指定的，因此更有可能保持可移植性，所以可以放心地给它们添加更多信息，而不必担心这些信息对其他用户不可用。

Profiles specified in the POM can modify [the following POM elements](https://maven.apache.org/ref/current/maven-model/maven.html):

在 POM 中指定的 profile 可以修改[以下 POM 元素](https://maven.apache.org/ref/current/maven-model/maven.html)：

- `<repositories>`

- `<pluginRepositories>`

- `<dependencies>`

- `<plugins>`

- `<properties>` (not actually available in the main POM, but used behind the scenes)

- `<modules>`

- `<reports>`

- `<reporting>`

- `<dependencyManagement>`

- `<distributionManagement>`

- a subset of the



  ```
  <build>
  ```



  element, which consists of:

  element，即 `<build>` 元素的一个子集，该子集包括：

  - `<defaultGoal>`
  - `<resources>`
  - `<testResources>`
  - `<directory>`
  - `<finalName>`
  - `<filters>`
  - `<pluginManagement>`
  - `<plugins>`

#### POM elements outside <profiles>

#### `<profiles>` 之外的 POM 元素

We don't allow modification of some POM elements outside of POM-profiles because these runtime modifications will not be distributed when the POM is deployed to the repository system, making that person's build of that project completely unique from others. While you can do this to some extent with the options given for external profiles, the danger is limited. Another reason is that this POM info is sometimes being reused from the parent POM.

我们不允许在 POM profile 之外修改某些 POM 元素，因为当 POM 部署到仓库系统时，这些运行时修改不会被分发出去，会使得该成员对项目的构建结果与其他人的完全不同。 虽然用外部 profile 提供的选项也能在某种程度上做到这一点，但风险是有限的。 另一个原因是，这些 POM 信息有时是从父 POM 中复用来的。

External files such as `settings.xml` and `profiles.xml` also does not support elements outside the POM-profiles. Let us take this scenario for elaboration. When the effective POM get deployed to a remote repository, any person can pickup its info out of the repository and use it to build a Maven project directly. Now, imagine that if we can set profiles in dependencies, which is very important to a build, or in any other elements outside POM-profiles in `settings.xml` then most probably we cannot expect someone else to use that POM from the repository and be able to build it. And we have to also think about how to share the `settings.xml` with others. Note that too many files to configure is very confusing and very hard to maintain. Bottom line is that since this is build data, it should be in the POM. One of the goals in Maven 2 is to consolidate all the information needed to run a build into a single file, or file hierarchy which is the POM.

像 `settings.xml` 和 `profiles.xml` 这样的外部文件，同样不支持 POM profile 之外的元素。 让我们用一个场景来详细说明。 当生效的 POM 被部署到远程仓库后，任何人都可以从仓库中取出它的信息，并直接用来构建一个 Maven 项目。 现在设想一下，如果我们能在 dependencies 这个对构建非常重要的元素中设置 profile，或者在 `settings.xml` 中 POM profile 之外的任何其他元素中设置 profile，那么很可能就无法指望别人从仓库中取出该 POM 并成功构建。 而且我们还得考虑如何把 `settings.xml` 分享给其他人。 请注意，需要配置的文件太多会非常混乱，也很难维护。 归根结底，因为这是构建数据，所以应该放在 POM 中。 Maven 2 的目标之一，就是把运行构建所需的所有信息集中到一个文件(即 POM)或文件层次结构中。

### Profile Order

### Profile 的顺序

All profile elements in a POM from active profiles overwrite the global elements with the same name of the POM or extend those in case of collections. In case multiple profiles are active in the same POM or external file, the ones which are defined **later** take precedence over the ones defined **earlier** (independent of their profile id and activation order).

POM 中所有处于激活状态的 profile 元素，会覆盖 POM 中同名的全局元素；如果该元素是集合类型，则进行扩展。 如果同一个 POM 或外部文件中有多个 profile 处于激活状态，那么**后**定义的 profile 优先于**先**定义的 profile(与 profile id 和激活顺序无关)。

Example:

示例：

```xml
<project>
  ...
  <repositories>
    <repository>
      <id>global-repo</id>
      ...
    </repository>
  </repositories>
  ...
  <profiles>
    <profile>
      <id>profile-1</id>
      <activation>
        <activeByDefault>true</activeByDefault>
      </activation>
      <repositories>
        <repository>
          <id>profile-1-repo</id>
          ...
        </repository>
      </repositories>
    </profile>
    <profile>
      <id>profile-2</id>
      <activation>
        <activeByDefault>true</activeByDefault>
      </activation>
      <repositories>
        <repository>
          <id>profile-2-repo</id>
          ...
        </repository>
      </repositories>
    </profile>
    ...
  </profiles>
  ...
</project>
```

This leads to the repository list: `profile-2-repo, profile-1-repo, global-repo`.

这样得到的仓库列表为： `profile-2-repo, profile-1-repo, global-repo`。

### Profile Pitfalls

### Profile 的常见陷阱

We've already mentioned the fact that adding profiles to your build has the potential to break portability for your project. We've even gone so far as to highlight circumstances where profiles are likely to break project portability. However, it's worth reiterating those points as part of a more coherent discussion about some pitfalls to avoid when using profiles.

前面已经提到，向构建中添加 profile 有可能破坏项目的可移植性。 我们甚至还专门指出了哪些情况容易破坏项目的可移植性。 不过，在用更连贯的方式讨论使用 profile 时应该避免的一些陷阱时，还是值得重申一下这些要点。

There are two main problem areas to keep in mind when using profiles. First are external properties, usually used in plugin configurations. These pose the risk of breaking portability in your project. The other, more subtle area is the incomplete specification of a natural set of profiles.

使用 profile 时要记住两个主要的问题领域。 第一是外部属性，通常用于插件配置。 它们会带来破坏项目可移植性的风险。 另一个更隐蔽的问题领域，是某一组本应自然的 profile 集合定义不完整。

#### External Properties

#### 外部属性

External property definition concerns any property value defined outside the `pom.xml` but not defined in a corresponding profile inside it. The most obvious usage of properties in the POM is in plugin configuration. While it is certainly possible to break project portability without properties, these critters can have subtle effects that cause builds to fail. For example, specifying appserver paths in a profile that is specified in the `settings.xml` may cause your integration test plugin to fail when another user on the team attempts to build without a similar `settings.xml`. Consider the following `pom.xml` snippet for a web application project:

外部属性的定义，指的是任何定义在 `pom.xml` 之外、但内部又没有在对应 profile 中定义的属性值。 POM 中属性最常见的用途就是插件配置。 虽然不用属性也可能会破坏项目可移植性，但这些小家伙会产生一些微妙的影响，导致构建失败。 例如，在 `settings.xml` 中指定的 profile 里设置 appserver 路径，当团队中其他成员没有类似的 `settings.xml` 却尝试构建时，就可能导致集成测试插件失败。 看看下面这个 Web 应用项目的 `pom.xml` 片段：

```xml
<project>
  ...
  <build>
    <plugins>
      <plugin>
        <groupId>org.myco.plugins</groupId>
        <artifactId>spiffy-integrationTest-plugin</artifactId>
        <version>1.0</version>
        <configuration>
          <appserverHome>${appserver.home}</appserverHome>
        </configuration>
      </plugin>
      ...
    </plugins>
  </build>
  ...
</project>
```

Now, in your local `${user.home}/.m2/settings.xml`, you have:

而你在本地的 `${user.home}/.m2/settings.xml` 中配置了：

```xml
<settings>
  ...
  <profiles>
    <profile>
      <id>appserverConfig</id>
      <properties>
        <appserver.home>/path/to/appserver</appserver.home>
      </properties>
    </profile>
  </profiles>

  <activeProfiles>
    <activeProfile>appserverConfig</activeProfile>
  </activeProfiles>
  ...
</settings>
```

When you build the **integration-test** lifecycle phase, your integration tests pass, since the path you've provided allows the test plugin to install and test this web application.

当你构建到 **integration-test** 生命周期阶段时，集成测试能够通过，因为你提供的路径让测试插件可以安装并测试这个 Web 应用。

*However*, when your colleague attempts to build to **integration-test**, his build fails spectacularly, complaining that it cannot resolve the plugin configuration parameter `<appserverHome>`, or worse, that the value of that parameter - literally `${appserver.home}` - is invalid (if it warns you at all).

*但是*，当你的同事尝试构建到 **integration-test** 时，他的构建会惨烈地失败，报错说无法解析插件配置参数 `<appserverHome>`，更糟的是，说该参数的值——也就是字面上的 `${appserver.home}`——是无效的(前提是它会给出警告)。

Congratulations, your project is now non-portable. Inlining this profile in your `pom.xml` can help alleviate this, with the obvious drawback that each project hierarchy (allowing for the effects of inheritance) now have to specify this information. Since Maven provides good support for project inheritance, it's possible to stick this sort of configuration in the `<pluginManagement>` section of a team-level POM or similar, and simply inherit the paths.

恭喜，你的项目现在不可移植了。 把这个 profile 内联到 `pom.xml` 中可以缓解这个问题，但明显的缺点是，每一层项目结构(考虑到继承的影响)现在都必须指定这些信息。 由于 Maven 对项目继承提供了良好的支持，可以把这类配置放在团队级 POM 的 `<pluginManagement>` 小节或类似位置，然后直接继承这些路径。

Another, less attractive answer might be standardization of development environments. However, this will tend to compromise the productivity gain that Maven is capable of providing.

另一个不太有吸引力的答案是标准化开发环境。 不过，这往往会损害 Maven 所能带来的生产力提升。

#### Incomplete Specification of a Natural Profile Set

#### 自然 profile 集合的定义不完整

In addition to the above portability-breaker, it's easy to fail to cover all cases with your profiles. When you do this, you're usually leaving one of your target environments high and dry. Let's take the example `pom.xml` snippet from above one more time:

除了上面这个可移植性杀手之外，用 profile 覆盖所有情况也很容易漏掉。 一旦漏掉，通常就会有某个目标环境得不到支持。 我们再来看看上面那个 `pom.xml` 片段示例：

```xml
<project>
  ...
  <build>
    <plugins>
      <plugin>
        <groupId>org.myco.plugins</groupId>
        <artifactId>spiffy-integrationTest-plugin</artifactId>
        <version>1.0</version>
        <configuration>
          <appserverHome>${appserver.home}</appserverHome>
        </configuration>
      </plugin>
      ...
    </plugins>
  </build>
  ...
</project>
```

Now, consider the following profile, which would be specified inline in the `pom.xml`:

现在，考虑下面这个在 `pom.xml` 中内联指定的 profile：

```xml
<project>
  ...
  <profiles>
    <profile>
      <id>appserverConfig-dev</id>
      <activation>
        <property>
          <name>env</name>
          <value>dev</value>
        </property>
      </activation>
      <properties>
        <appserver.home>/path/to/dev/appserver</appserver.home>
      </properties>
    </profile>

    <profile>
      <id>appserverConfig-dev-2</id>
      <activation>
        <property>
          <name>env</name>
          <value>dev-2</value>
        </property>
      </activation>
      <properties>
        <appserver.home>/path/to/another/dev/appserver2</appserver.home>
      </properties>
    </profile>
  </profiles>
  ..
</project>
```

This profile looks quite similar to the one from the last example, with a few important exceptions: it's plainly geared toward a development environment, a new profile named `appserverConfig-dev-2` is added and it has an activation section that will trigger its inclusion when the system properties contain "env=dev" for a profile named `appserverConfig-dev` and "env=dev-2" for a profile named `appserverConfig-dev-2`. So, executing:

这个 profile 与上一个例子中的 profile 看起来很像，但有几个重要的区别：它显然是面向开发环境的，还新增了一个名为 `appserverConfig-dev-2` 的 profile，并且带有激活配置小节——当系统属性中 `appserverConfig-dev` 对应 "env=dev"、`appserverConfig-dev-2` 对应 "env=dev-2" 时，就会触发它生效。 所以，执行：

```
mvn -Denv=dev-2 integration-test
```

will result in a successful build, applying the properties given by profile named `appserverConfig-dev-2`. And when we execute

会得到一次成功的构建，并应用名为 `appserverConfig-dev-2` 的 profile 所提供的属性。 而当我们执行

```
mvn -Denv=dev integration-test
```

it will result in a successful build applying the properties given by the profile named `appserverConfig-dev`. However, executing:

则会得到一次成功的构建，并应用名为 `appserverConfig-dev` 的 profile 所提供的属性。 然而，执行：

```
mvn -Denv=production integration-test
```

will not do a successful build. Why? Because, the resulting non-interpolated literal value of `${appserver.home}` will not be a valid path for deploying and testing your web application. We haven't considered the case for the production environment when writing our profiles. The "production" environment (env=production), along with "test" and possibly even "local" constitute a natural set of target environments for which we may want to build the integration-test lifecycle phase. The incomplete specification of this natural set means we have effectively limited our valid target environments to the development environment. Your teammates - and probably your manager - will not see the humor in this. When you construct profiles to handle cases such as these, be sure to address the entire set of target permutations.

则不会构建成功。 为什么呢？ 因为 `${appserver.home}` 未被插值，其字面值不是一个有效的路径，无法用来部署和测试你的 Web 应用。 我们在编写 profile 时没有考虑生产环境的情况。 "production" 环境(env=production)，连同 "test"、甚至可能还有 "local"，构成了一组自然的候选目标环境，我们可能希望针对它们来构建 integration-test 生命周期阶段。 这组自然集合定义不完整，意味着我们实际上把有效的目标环境限定在了开发环境。 你的同事——很可能还有你的经理——是不会觉得这好笑的。 当我们构造 profile 来处理这类情况时，一定要覆盖全部的目标环境组合。

As a quick aside, it's possible for user-specific profiles to act in a similar way. This means that profiles for handling different environments which are keyed to the user can act up when the team adds a new developer. While I suppose this *could* act as useful training for the newbie, it just wouldn't be nice to throw them to the wolves in this way. Again, be sure to think of the *whole* set of profiles.

顺便提一下，用户级的 profile 也可能出现类似的问题。 也就是说，那些按用户区分、用于处理不同环境的 profile，在团队新增开发人员时可能会出状况。 虽然我觉得这*也许*能算作对新手有用的训练，但这样把人扔进狼群可不太好。 再强调一次，一定要考虑到*完整*的 profile 集合。

### How can I tell which profiles are in effect during a build?

### 如何知道构建期间哪些 profile 生效了？

Determining active profiles will help the user to know what particular profiles has been executed during a build. We can use the [Maven Help Plugin](https://maven.apache.org/plugins/maven-help-plugin/) to tell what profiles are in effect during a build.

确定处于激活状态的 profile，有助于用户了解构建期间到底执行了哪些 profile。 我们可以使用 [Maven Help Plugin](https://maven.apache.org/plugins/maven-help-plugin/) 来查看构建期间哪些 profile 生效。

```
  mvn help:active-profiles
```

Let us have some small samples that will help us to understand more on the *active-profiles* goal of that plugin.

我们来看几个小例子，以便更好地理解该插件的 *active-profiles* 目标。

From the last example of profiles in the `pom.xml`, you'll notice that there are two profiles named `appserverConfig-dev` and `appserverConfig-dev-2` which has been given different values for properties. If we go ahead and execute:

从上面 `pom.xml` 中 profile 的最后一个示例可以看到，有两个名为 `appserverConfig-dev` 和 `appserverConfig-dev-2` 的 profile，它们被赋予了不同的属性值。 接下来我们执行：

```
  mvn help:active-profiles -Denv=dev
```

The result will be a bulleted list of the id of the profile with an activation property of "env=dev" together with the source where it was declared. See sample below.

结果会以一个项目符号列表的形式，列出激活属性为 "env=dev" 的 profile 的 id，以及它声明的位置。 示例见下。

```
The following profiles are active:

 - appserverConfig-dev (source: pom)
```

Now if we have a profile declared in `settings.xml` (refer to the sample of profile in `settings.xml`) and that have been set to be an active profile and execute:

现在，如果我们在 `settings.xml` 中声明了一个 profile(参考 `settings.xml` 中 profile 的示例)，并把它设置为激活的 profile，然后执行：

```
  mvn help:active-profiles
```

The result should be something like this

结果大概会是这样：

```
The following profiles are active:

 - appserverConfig (source: settings.xml)
```

Even though we don't have an activation property, a profile has been listed as active. Why? Like we mentioned before, a profile that has been set as an active profile in the `settings.xml` is automatically activated.

尽管没有激活属性，仍然有一个 profile 被列为激活状态。 为什么呢？ 正如前面提到的，在 `settings.xml` 中被设置为激活 profile 的 profile 会自动激活。

Now if we have something like a profile in the `settings.xml` that has been set as an active profile and also triggered a profile in the POM. Which profile do you think will have an effect on the build?

现在，如果 `settings.xml` 中有一个被设置为激活的 profile，同时又触发了 POM 中的一个 profile。 你觉得哪个 profile 会对构建产生影响？

```
  mvn help:active-profiles -P appserverConfig-dev
```

This will list the activated profiles:

这会列出已激活的 profile：

```
The following profiles are active:

 - appserverConfig-dev (source: pom)
 - appserverConfig (source: settings.xml)
```

Even though it listed the two active profiles, we are not sure which one of them has been applied. To see the effect on the build execute:

尽管它列出了两个激活的 profile，但我们并不确定实际应用的是哪一个。 要查看对构建的实际影响，可以执行：

```
  mvn help:effective-pom -P appserverConfig-dev
```

This will print the effective POM for this build configuration out to the console. Take note that profiles in the `settings.xml` takes higher priority than profiles in the POM. So the profile that has been applied here is `appserverConfig` not `appserverConfig-dev`.

这会把该构建配置的 effective POM 打印到控制台。 注意， `settings.xml` 中 profile 的优先级高于 POM 中的 profile。 所以这里实际应用的是 `appserverConfig`，而不是 `appserverConfig-dev`。

If you want to redirect the output from the plugin to a file called `effective-pom.xml`, use the command-line option `-Doutput=effective-pom.xml`.

如果想把插件的输出重定向到名为 `effective-pom.xml` 的文件，可以使用命令行选项 `-Doutput=effective-pom.xml`。

### Naming Conventions

### 命名约定

By now you've noticed that profiles are a natural way of addressing the problem of different build configuration requirements for different target environments. Above, we discussed the concept of a "natural set" of profiles to address this situation, and the importance of considering the whole set of profiles that will be required.

到这里我们应该已经注意到，profile 是解决不同目标环境需要不同构建配置这一问题的自然方式。 前面我们讨论了用一组 "自然" 的 profile 来应对这种情况的概念，以及考虑所需的整套 profile 的重要性。

However, the question of how to organize and manage the evolution of that set is non-trivial as well. Just as a good developer strives to write self-documenting code, it's important that your profile id's give a hint to their intended use. One good way to do this is to use the common system property trigger as part of the name for the profile. This might result in names like **env-dev**, **env-test**, and **env-prod** for profiles that are triggered by the system property **env**. Such a system leaves a highly intuitive hint on how to activate a build targeted at a particular environment. Thus, to activate a build for the test environment, you need to activate **env-test** by issuing:

不过，如何组织和管理这组 profile 的演进，同样不是一件简单的事。 就像优秀的开发者会努力编写自解释的代码一样，profile id 最好也能暗示其用途。 一个不错的做法是，把常用的系统属性触发器作为 profile 名称的一部分。 例如，由系统属性 **env** 触发的 profile，可以命名为 **env-dev**、**env-test** 和 **env-prod**。 这种命名方式会给出非常直观的提示，告诉我们如何激活针对特定环境的构建。 因此，要为测试环境激活构建，就需要激活 **env-test**，执行：

```
mvn -Denv=test <phase>
```

The right command-line option can be had by simply substituting "=" for "-" in the profile id.

只要把 profile id 中的 "-" 换成 "="，就能得到正确的命令行选项。

### 参考链接

原文链接: <https://maven.apache.org/guides/introduction/introduction-to-profiles.html>
