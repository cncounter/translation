## Optional Dependencies and Dependency Exclusions


This section discusses optional dependencies and dependency exclusions. This will help users to understand what they are and when and how to use them. It also explains why exclusions are made on a per dependency basis instead of at the POM level.

### Optional Dependencies

Optional dependencies are used when it's not possible (for whatever reason) to split a project into sub-modules. The idea is that some of the dependencies are only used for certain features in the project and will not be needed if that feature isn't used. Ideally, such a feature would be split into a sub-module that depends on the core functionality project. This new subproject would have only non-optional dependencies, since you'd need them all if you decided to use the subproject's functionality.

However, since the project cannot be split up (again, for whatever reason), these dependencies are declared optional. If a user wants to use functionality related to an optional dependency, they have to redeclare that optional dependency in their own project. This is not the clearest way to handle this situation, but both optional dependencies and dependency exclusions are stop-gap solutions.

#### Why use optional dependencies?

Optional dependencies save space and memory. They prevent problematic jars that violate a license agreement or cause classpath issues from being bundled into a WAR, EAR, fat jar, or the like.

#### How do I use the optional tag?

A dependency is declared optional by setting the <optional> element to true in its dependency declaration:

```
<project>  ...  <dependencies>    <!-- declare the dependency to be set as optional -->    <dependency>      <groupId>sample.ProjectA</groupId>      <artifactId>Project-A</artifactId>      <version>1.0</version>      <scope>compile</scope>      <optional>true</optional> <!-- value will be true or false only -->    </dependency>  </dependencies></project>
```

#### How do optional dependencies work?

```
Project-A -> Project-B
```

The diagram above says that Project-A depends on Project-B. When A declares B as an optional dependency in its POM, this relationship remains unchanged. It's just like a normal build where Project-B will be added in Project-A's classpath.

```
Project-X -> Project-A
```

When another project (Project-X) declares Project-A as a dependency in its POM, the optional nature of the dependency takes effect. Project-B is not included in the classpath of Project-X. You need to declare it directly in the POM of Project X for B to be included in X's classpath.

#### Example

Suppose there is a project named *X2* that has similar functionality to *Hibernate*. It supports many databases such as MySQL, PostgreSQL, and several versions of Oracle. Each supported database requires an additional dependency on a driver jar. All of these dependencies are needed at compile time to build X2. However your project only uses one specific database and doesn't need drivers for the others. X2 can declare these dependencies as optional, so that when your project declares X2 as a direct dependency in its POM, all the drivers supported by the X2 are not automatically included in your project's classpath. Your project will have to include an explicit dependency on the specific driver for the one database it does use.

### Dependency Exclusions

Since Maven resolves dependencies transitively, it is possible for unwanted dependencies to be included in your project's classpath. For example, a certain older jar may have security issues or be incompatible with the Java version you're using. To address this, Maven allows you to exclude specific dependencies. Exclusions are set on a specific dependency in your POM, and are targeted at a specific groupId and artifactId. When you build your project, that artifact will not be added to your project's classpath *by way of the dependency in which the exclusion was declared*.

#### How to use dependency exclusions

Add an <exclusions> element in the <dependency> element by which the problematic jar is included.

```
<project>  ...  <dependencies>    <dependency>      <groupId>sample.ProjectA</groupId>      <artifactId>Project-A</artifactId>      <version>1.0</version>      <scope>compile</scope>      <exclusions>        <exclusion>  <!-- declare the exclusion here -->          <groupId>sample.ProjectB</groupId>          <artifactId>Project-B</artifactId>        </exclusion>      </exclusions>     </dependency>  </dependencies></project>
```

#### How dependency exclusion works and when to use it **( as a last resort! )**

```
Project-A   -> Project-B        -> Project-D <! -- This dependency should be excluded -->              -> Project-E              -> Project-F   -> Project C
```

The diagram shows that Project-A depends on both Project-B and C. Project-B depends on Project-D. Project-D depends on both Project-E and F. By default, Project A's classpath will include:

```
B, C, D, E, F
```

Suppose you don't want project D and its dependencies to be added to Project A's classpath because some of Project-D's dependencies are missing from the repository, and you don't need the functionality in Project-B that depends on Project-D anyway. Project-B's developers could have marked the dependency on Project-D <optional>true</optional>:

```
<dependency>  <groupId>sample.ProjectD</groupId>  <artifactId>ProjectD</artifactId>  <version>1.0-SNAPSHOT</version>  <optional>true</optional></dependency>
```

Unfortunately, they didn't. As a last resort, you can exclude it on your own POM for Project-A like this:

```
<project>  <modelVersion>4.0.0</modelVersion>  <groupId>sample.ProjectA</groupId>  <artifactId>Project-A</artifactId>  <version>1.0-SNAPSHOT</version>  <packaging>jar</packaging>  ...  <dependencies>    <dependency>      <groupId>sample.ProjectB</groupId>      <artifactId>Project-B</artifactId>      <version>1.0-SNAPSHOT</version>      <exclusions>        <exclusion>          <groupId>sample.ProjectD</groupId> <!-- Exclude Project-D from Project-B -->          <artifactId>Project-D</artifactId>        </exclusion>      </exclusions>    </dependency>  </dependencies></project>
```

If you deploy Project-A to a repository, and Project-X declares a normal dependency on Project-A, will Project-D still be excluded from the classpath?

```
Project-X -> Project-A
```

The answer is **Yes**. Project-A has declared that it doesn't need Project-D to run, so it won't be brought in as a transitive dependency of Project-A.

Now, consider that Project-X depends on Project-Y, as in the diagram below:

```
Project-X -> Project-Y               -> Project-B                    -> Project-D                       ...
```

Project-Y also has a dependency on Project-B, and it does need the features supported by Project-D. Therefore, it will NOT place an exclusion on Project-D in its dependency list. It may also supply an additional repository, from which it can resolve Project-E. In this case, it's important that Project-D **is not** excluded globally, since it is a legitimate dependency of Project-Y.

As another scenario, suppose the dependency you don't want is Project-E instead of Project-D. How do you exclude it? See the diagram below:

```
Project-A   -> Project-B        -> Project-D               -> Project-E <!-- Exclude this dependency -->              -> Project-F   -> Project C
```

Exclusions work on the entire dependency graph below the point where they are declared. If you want to exclude Project-E instead of Project-D, simply change the exclusion to point at Project-E, but you don't move the exclusion down to Project-D. You cannot change Project-D's POM. If you could, you would use optional dependencies instead of exclusions, or split Project-D up into multiple subprojects, each with nothing but normal dependencies.

```
<project>  <modelVersion>4.0.0</modelVersion>  <groupId>sample.ProjectA</groupId>  <artifactId>Project-A</artifactId>  <version>1.0-SNAPSHOT</version>  <packaging>jar</packaging>  ...  <dependencies>    <dependency>      <groupId>sample.ProjectB</groupId>      <artifactId>Project-B</artifactId>      <version>1.0-SNAPSHOT</version>      <exclusions>        <exclusion>          <groupId>sample.ProjectE</groupId> <!-- Exclude Project-E from Project-B -->          <artifactId>Project-E</artifactId>        </exclusion>      </exclusions>    </dependency>  </dependencies></project>
```

#### Why exclusions are made on a per-dependency basis, rather than at the POM level

This is mainly to be sure the dependency graph is predictable, and to keep inheritance effects from excluding a dependency that should not be excluded. If you get to the method of last resort and have to put in an exclusion, you should be absolutely certain which of your dependencies is bringing in that unwanted transitive dependency.

If you truly want to ensure that a particular dependency appears nowhere in your classpath, regardless of path, the [banned dependencies rule](https://maven.apache.org/enforcer/enforcer-rules/bannedDependencies.html) can be configured to fail the build if a problematic dependency is found. When the build fails, you'll need to add specific exclusions on each path the enforcer finds.



### 参考链接

原文链接: <https://maven.apache.org/guides/introduction/introduction-to-optional-and-excludes-dependencies.html>
