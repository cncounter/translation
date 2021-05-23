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

Apache Maven 竭尽全力确保构建可移植。除其他外，这意味着允许在POM内进行配置配置，避免“所有”文件系统引用（在继承，依赖关系和其他位置），并更多地依赖于本地存储库来存储实现此目的所需的元数据。

但是，有时不能完全实现可移植性。在某些情况下，可能需要使用本地文件系统路径来配置插件。在其他情况下，将需要稍微不同的依赖项集，并且项目的工件名称可能需要稍作调整。在其他时候，根据检测到的构建环境，您甚至可能需要在构建生命周期中包括整个插件。

为了解决这些情况，Maven支持构建配置文件。配置文件是使用POM本身中可用元素的子集（加上一个额外的部分）指定的，并以多种方式触发。它们在构建时修改POM，并且打算在补充集中使用，以为一组目标环境提供等效但不同的参数（例如，在开发，测试和开发过程中提供appserver根的路径）生产环境）。因此，概要文件很容易导致团队中不同成员的构建结果不同。但是，如果使用得当，可以在保持项目可移植性的同时使用配置文件。这也将最小化maven的-f选项的使用，该选项允许用户创建具有不同参数或配置的另一个POM，这使其更易于维护，因为它仅使用一个POM运行。

### What are the different types of profile? Where is each defined?

- Per Project

  \- Defined in the POM itself `(pom.xml)`.

- Per User

  \- Defined in the [Maven-settings](https://maven.apache.org/ref/current/maven-settings/settings.html) `(%USER_HOME%/.m2/settings.xml)`.

- Global

  \- Defined in the [global Maven-settings](https://maven.apache.org/ref/current/maven-settings/settings.html) `(${maven.home}/conf/settings.xml)`.

- Profile descriptor

  \- a descriptor located in [project basedir `(profiles.xml)`](https://maven.apache.org/ref/2.2.1/maven-profile/profiles.html) (no longer supported in Maven 3.0 and above; see [Maven 3 compatibility notes](https://cwiki.apache.org/confluence/display/MAVEN/Maven+3.x+Compatibility+Notes#Maven3.xCompatibilityNotes-profiles.xml))

### How can a profile be triggered? How does this vary according to the type of profile being used?

A profile can be activated in several ways:

- From the command line
- Through Maven settings
- Based on environment variables
- OS settings
- Present or missing files

#### Details on profile activation

Profiles can be explicitly specified using the `-P` command line flag.

This flag is followed by a comma-delimited list of profile IDs to use. The profile(s) specified in the option are activated in addition to any profiles which are activated by their activation configuration or the `<activeProfiles>` section in `settings.xml`. From Maven 4 onward, Maven will refuse to activate or deactivate a profile that cannot be resolved. To prevent this, prefix the profile identifier with an `?`, marking it as optional:

```shell
mvn groupId:artifactId:goal -P profile-1,profile-2,?profile-3
```

Profiles can be activated in the Maven settings, via the `<activeProfiles>` section. This section takes a list of `<activeProfile>` elements, each containing a profile-id inside.

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

Profiles can be automatically triggered based on the detected state of the build environment. These triggers are specified via an `<activation>` section in the profile itself. Currently, this detection is limited to prefix-matching of the JDK version, the presence of a system property or the value of a system property. Here are some examples.

The following configuration will trigger the profile when the JDK's version starts with "1.4" (eg. "1.4.0_08", "1.4.2_07", "1.4"):

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

This next one will activate based on OS settings. See the [Maven Enforcer Plugin](https://maven.apache.org/enforcer/enforcer-rules/requireOS.html) for more details about OS values.

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

```
mvn groupId:artifactId:goal
mvn groupId:artifactId:goal -Ddebug=false
```

The next example will trigger the profile when the system property "environment" is specified with the value "test":

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

```
mvn groupId:artifactId:goal -Denvironment=test
```

As of Maven 3.0, profiles in the POM can also be activated based on properties from active profiles from the `settings.xml`.

**Note**: Environment variables like `FOO` are available as properties of the form `env.FOO`. Further note that environment variable names are normalized to all upper-case on Windows.

This example will trigger the profile when the generated file `target/generated-sources/axistools/wsdl2java/org/apache/maven` is missing.

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

Profiles can also be active by default using a configuration like the following:

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

#### Deactivating a profile

Starting with Maven 2.0.10, one or more profiles can be deactivated using the command line by prefixing their identifier with either the character '!' or '-' as shown below:

```
mvn groupId:artifactId:goal -P !profile-1,!profile-2,!?profile-3
```

This can be used to deactivate profiles marked as activeByDefault or profiles that would otherwise be activated through their activation config.

### Which areas of a POM can be customized by each type of profile? Why?

Now that we've talked about where to specify profiles, and how to activate them, it will be useful to talk about *what* you can specify in a profile. As with the other aspects of profile configuration, this answer is not straightforward.

Depending on where you choose to configure your profile, you will have access to varying POM configuration options.

#### Profiles in external files

Profiles specified in external files (i.e in `settings.xml` or `profiles.xml`) are not portable in the strictest sense. Anything that seems to stand a high chance of changing the result of the build is restricted to the inline profiles in the POM. Things like repository lists could simply be a proprietary repository of approved artifacts, and won't change the outcome of the build. Therefore, you will only be able to modify the `<repositories>` and `<pluginRepositories>` sections, plus an extra `<properties>` section.

The `<properties>` section allows you to specify free-form key-value pairs which will be included in the interpolation process for the POM. This allows you to specify a plugin configuration in the form of `${profile.provided.path}`.

#### Profiles in POMs

On the other hand, if your profiles can be reasonably specified *inside* the POM, you have many more options. The trade-off, of course, is that you can only modify *that* project and it's sub-modules. Since these profiles are specified inline, and therefore have a better chance of preserving portability, it's reasonable to say you can add more information to them without the risk of that information being unavailable to other users.

Profiles specified in the POM can modify [the following POM elements](https://maven.apache.org/ref/current/maven-model/maven.html):

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

  - `<defaultGoal>`
  - `<resources>`
  - `<testResources>`
  - `<directory>`
  - `<finalName>`
  - `<filters>`
  - `<pluginManagement>`
  - `<plugins>`

#### POM elements outside <profiles>

We don't allow modification of some POM elements outside of POM-profiles because these runtime modifications will not be distributed when the POM is deployed to the repository system, making that person's build of that project completely unique from others. While you can do this to some extent with the options given for external profiles, the danger is limited. Another reason is that this POM info is sometimes being reused from the parent POM.

External files such as `settings.xml` and `profiles.xml` also does not support elements outside the POM-profiles. Let us take this scenario for elaboration. When the effective POM get deployed to a remote repository, any person can pickup its info out of the repository and use it to build a Maven project directly. Now, imagine that if we can set profiles in dependencies, which is very important to a build, or in any other elements outside POM-profiles in `settings.xml` then most probably we cannot expect someone else to use that POM from the repository and be able to build it. And we have to also think about how to share the `settings.xml` with others. Note that too many files to configure is very confusing and very hard to maintain. Bottom line is that since this is build data, it should be in the POM. One of the goals in Maven 2 is to consolidate all the information needed to run a build into a single file, or file hierarchy which is the POM.

### Profile Order

All profile elements in a POM from active profiles overwrite the global elements with the same name of the POM or extend those in case of collections. In case multiple profiles are active in the same POM or external file, the ones which are defined **later** take precedence over the ones defined **earlier** (independent of their profile id and activation order).

Example:

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

### Profile Pitfalls

We've already mentioned the fact that adding profiles to your build has the potential to break portability for your project. We've even gone so far as to highlight circumstances where profiles are likely to break project portability. However, it's worth reiterating those points as part of a more coherent discussion about some pitfalls to avoid when using profiles.

There are two main problem areas to keep in mind when using profiles. First are external properties, usually used in plugin configurations. These pose the risk of breaking portability in your project. The other, more subtle area is the incomplete specification of a natural set of profiles.

#### External Properties

External property definition concerns any property value defined outside the `pom.xml` but not defined in a corresponding profile inside it. The most obvious usage of properties in the POM is in plugin configuration. While it is certainly possible to break project portability without properties, these critters can have subtle effects that cause builds to fail. For example, specifying appserver paths in a profile that is specified in the `settings.xml` may cause your integration test plugin to fail when another user on the team attempts to build without a similar `settings.xml`. Consider the following `pom.xml` snippet for a web application project:

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

*However*, when your colleague attempts to build to **integration-test**, his build fails spectacularly, complaining that it cannot resolve the plugin configuration parameter `<appserverHome>`, or worse, that the value of that parameter - literally `${appserver.home}` - is invalid (if it warns you at all).

Congratulations, your project is now non-portable. Inlining this profile in your `pom.xml` can help alleviate this, with the obvious drawback that each project hierarchy (allowing for the effects of inheritance) now have to specify this information. Since Maven provides good support for project inheritance, it's possible to stick this sort of configuration in the `<pluginManagement>` section of a team-level POM or similar, and simply inherit the paths.

Another, less attractive answer might be standardization of development environments. However, this will tend to compromise the productivity gain that Maven is capable of providing.

#### Incomplete Specification of a Natural Profile Set

In addition to the above portability-breaker, it's easy to fail to cover all cases with your profiles. When you do this, you're usually leaving one of your target environments high and dry. Let's take the example `pom.xml` snippet from above one more time:

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

```
mvn -Denv=dev-2 integration-test
```

will result in a successful build, applying the properties given by profile named `appserverConfig-dev-2`. And when we execute

```
mvn -Denv=dev integration-test
```

it will result in a successful build applying the properties given by the profile named `appserverConfig-dev`. However, executing:

```
mvn -Denv=production integration-test
```

will not do a successful build. Why? Because, the resulting non-interpolated literal value of `${appserver.home}` will not be a valid path for deploying and testing your web application. We haven't considered the case for the production environment when writing our profiles. The "production" environment (env=production), along with "test" and possibly even "local" constitute a natural set of target environments for which we may want to build the integration-test lifecycle phase. The incomplete specification of this natural set means we have effectively limited our valid target environments to the development environment. Your teammates - and probably your manager - will not see the humor in this. When you construct profiles to handle cases such as these, be sure to address the entire set of target permutations.

As a quick aside, it's possible for user-specific profiles to act in a similar way. This means that profiles for handling different environments which are keyed to the user can act up when the team adds a new developer. While I suppose this *could* act as useful training for the newbie, it just wouldn't be nice to throw them to the wolves in this way. Again, be sure to think of the *whole* set of profiles.

### How can I tell which profiles are in effect during a build?

Determining active profiles will help the user to know what particular profiles has been executed during a build. We can use the [Maven Help Plugin](https://maven.apache.org/plugins/maven-help-plugin/) to tell what profiles are in effect during a build.

```
  mvn help:active-profiles
```

Let us have some small samples that will help us to understand more on the *active-profiles* goal of that plugin.

From the last example of profiles in the `pom.xml`, you'll notice that there are two profiles named `appserverConfig-dev` and `appserverConfig-dev-2` which has been given different values for properties. If we go ahead and execute:

```
  mvn help:active-profiles -Denv=dev
```

The result will be a bulleted list of the id of the profile with an activation property of "env=dev" together with the source where it was declared. See sample below.

```
The following profiles are active:

 - appserverConfig-dev (source: pom)
```

Now if we have a profile declared in `settings.xml` (refer to the sample of profile in `settings.xml`) and that have been set to be an active profile and execute:

```
  mvn help:active-profiles
```

The result should be something like this

```
The following profiles are active:

 - appserverConfig (source: settings.xml)
```

Even though we don't have an activation property, a profile has been listed as active. Why? Like we mentioned before, a profile that has been set as an active profile in the `settings.xml` is automatically activated.

Now if we have something like a profile in the `settings.xml` that has been set as an active profile and also triggered a profile in the POM. Which profile do you think will have an effect on the build?

```
  mvn help:active-profiles -P appserverConfig-dev
```

This will list the activated profiles:

```
The following profiles are active:

 - appserverConfig-dev (source: pom)
 - appserverConfig (source: settings.xml)
```

Even though it listed the two active profiles, we are not sure which one of them has been applied. To see the effect on the build execute:

```
  mvn help:effective-pom -P appserverConfig-dev
```

This will print the effective POM for this build configuration out to the console. Take note that profiles in the `settings.xml` takes higher priority than profiles in the POM. So the profile that has been applied here is `appserverConfig` not `appserverConfig-dev`.

If you want to redirect the output from the plugin to a file called `effective-pom.xml`, use the command-line option `-Doutput=effective-pom.xml`.

### Naming Conventions

By now you've noticed that profiles are a natural way of addressing the problem of different build configuration requirements for different target environments. Above, we discussed the concept of a "natural set" of profiles to address this situation, and the importance of considering the whole set of profiles that will be required.

However, the question of how to organize and manage the evolution of that set is non-trivial as well. Just as a good developer strives to write self-documenting code, it's important that your profile id's give a hint to their intended use. One good way to do this is to use the common system property trigger as part of the name for the profile. This might result in names like **env-dev**, **env-test**, and **env-prod** for profiles that are triggered by the system property **env**. Such a system leaves a highly intuitive hint on how to activate a build targeted at a particular environment. Thus, to activate a build for the test environment, you need to activate **env-test** by issuing:

```
mvn -Denv=test <phase>
```

The right command-line option can be had by simply substituting "=" for "-" in the profile id.

### 参考链接

原文链接: <https://maven.apache.org/guides/introduction/introduction-to-profiles.html>
