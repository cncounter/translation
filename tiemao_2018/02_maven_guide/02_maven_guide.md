# Building Java Projects with Maven

This guide walks you through using Maven to build a simple Java project.

## What you’ll build

You’ll create an application that provides the time of day and then build it with Maven.

## What you’ll need

*   About 15 minutes

*   A favorite text editor or IDE

*   [JDK 6](http://www.oracle.com/technetwork/java/javase/downloads/index.html) or later

## How to complete this guide

Like most Spring [Getting Started guides](/guides), you can start from scratch and complete each step, or you can bypass basic setup steps that are already familiar to you. Either way, you end up with working code.

To **start from scratch**, move on to [Set up the project](#scratch).

To **skip the basics**, do the following:

*   [Download](https://github.com/spring-guides/gs-maven/archive/master.zip) and unzip the source repository for this guide, or clone it using [Git](/understanding/Git): `git clone [https://github.com/spring-guides/gs-maven.git](https://github.com/spring-guides/gs-maven.git)`

*   cd into `gs-maven/initial`

*   Jump ahead to [[initial]](#initial).

**When you’re finished**, you can check your results against the code in `gs-maven/complete`.

## Set up the project

First you’ll need to setup a Java project for Maven to build. To keep the focus on Maven, make the project as simple as possible for now. Create this structure in a project folder of your choosing.

### Create the directory structure

In a project directory of your choosing, create the following subdirectory structure; for example, with `mkdir -p src/main/java/hello` on *nix systems:

```
└── src
    └── main
        └── java
            └── hello
```

Within the `src/main/java/hello` directory, you can create any Java classes you want. To maintain consistency with the rest of this guide, create these two classes: `HelloWorld.java` and `Greeter.java`.

`src/main/java/hello/HelloWorld.java`

<button class="copy-button snippet" id="copy-button-0" data-clipboard-target="#code-block-0"></button>

```
`packagehello;publicclassHelloWorld{publicstaticvoidmain(String[]args){Greetergreeter=newGreeter();System.out.println(greeter.sayHello());}}`
```

`src/main/java/hello/Greeter.java`

<button class="copy-button snippet" id="copy-button-1" data-clipboard-target="#code-block-1"></button>

```
`packagehello;publicclassGreeter{publicStringsayHello(){return"Hello world!";}}`
```

Now that you have a project that is ready to be built with Maven, the next step is to install Maven.

Maven is downloadable as a zip file at [http://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi). Only the binaries are required, so look for the link to apache-maven-_{version}_-bin.zip or apache-maven-_{version}_-bin.tar.gz.

Once you have downloaded the zip file, unzip it to your computer. Then add the _bin_ folder to your path.

To test the Maven installation, run `mvn` from the command-line:

<button class="copy-button snippet" id="copy-button-2" data-clipboard-target="#code-block-2"></button>

```
mvn -v
```

If all goes well, you should be presented with some information about the Maven installation. It will look similar to (although perhaps slightly different from) the following:

```
Apache Maven 3.0.5 (r01de14724cdef164cd33c7c8c2fe155faf9602da; 2013-02-19 07:51:28-0600)
Maven home: /usr/share/maven
Java version: 1.7.0_09, vendor: Oracle Corporation
Java home: /Library/Java/JavaVirtualMachines/jdk1.7.0_09.jdk/Contents/Home/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "mac os x", version: "10.8.3", arch: "x86_64", family: "mac"
```

Congratulations! You now have Maven installed.

## Define a simple Maven build

Now that Maven is installed, you need to create a Maven project definition. Maven projects are defined with an XML file named _pom.xml_. Among other things, this file gives the project’s name, version, and dependencies that it has on external libraries.

Create a file named _pom.xml_ at the root of the project (i.e. put it next to the `src` folder) and give it the following contents:

`pom.xml`

<button class="copy-button snippet" id="copy-button-3" data-clipboard-target="#code-block-3"></button>

```
`<?xml version="1.0"encoding="UTF-8"?><projectxmlns="http://maven.apache.org/POM/4.0.0"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd"><modelVersion>4.0.0</modelVersion><groupId>org.springframework</groupId><artifactId>gs-maven</artifactId><packaging>jar</packaging><version>0.1.0</version><build><plugins><plugin><groupId>org.apache.maven.plugins</groupId><artifactId>maven-shade-plugin</artifactId><version>2.1</version><executions><execution><phase>package</phase><goals><goal>shade</goal></goals><configuration><transformers><transformerimplementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer"><mainClass>hello.HelloWorld</mainClass></transformer></transformers></configuration></execution></executions></plugin></plugins></build></project>`
```

With the exception of the optional `&lt;packaging&gt;` element, this is the simplest possible _pom.xml_ file necessary to build a Java project. It includes the following details of the project configuration:

*   `&lt;modelVersion&gt;`. POM model version (always 4.0.0).

*   `&lt;groupId&gt;`. Group or organization that the project belongs to. Often expressed as an inverted domain name.

*   `&lt;artifactId&gt;`. Name to be given to the project’s library artifact (for example, the name of its JAR or WAR file).

*   `&lt;version&gt;`. Version of the project that is being built.

*   `&lt;packaging&gt;` - How the project should be packaged. Defaults to "jar" for JAR file packaging. Use "war" for WAR file packaging.

<table>
<tbody>
<tr>
<td class="icon">  </td>
<td class="content"> When it comes to choosing a versioning scheme, Spring recommends the [semantic versioning](http://semver.org) approach. </td>
</tr>
</tbody>
</table>

At this point you have a minimal, yet capable Maven project defined.

## Build Java code

Maven is now ready to build the project. You can execute several build lifecycle goals with Maven now, including goals to compile the project’s code, create a library package (such as a JAR file), and install the library in the local Maven dependency repository.

To try out the build, issue the following at the command line:

<button class="copy-button snippet" id="copy-button-4" data-clipboard-target="#code-block-4"></button>

```
mvn compile
```

This will run Maven, telling it to execute the _compile_ goal. When it’s finished, you should find the compiled _.class_ files in the _target/classes_ directory.

Since it’s unlikely that you’ll want to distribute or work with _.class_ files directly, you’ll probably want to run the _package_ goal instead:

<button class="copy-button snippet" id="copy-button-5" data-clipboard-target="#code-block-5"></button>

```
mvn package
```

The _package_ goal will compile your Java code, run any tests, and finish by packaging the code up in a JAR file within the _target_ directory. The name of the JAR file will be based on the project’s `&lt;artifactId&gt;` and `&lt;version&gt;`. For example, given the minimal _pom.xml_ file from before, the JAR file will be named _gs-maven-0.1.0.jar_.

<table>
<tbody>
<tr>
<td class="icon">  </td>
<td class="content"> If you’ve changed the value of `&lt;packaging&gt;` from "jar" to "war", the result will be a WAR file within the _target_ directory instead of a JAR file. </td>
</tr>
</tbody>
</table>

Maven also maintains a repository of dependencies on your local machine (usually in a _.m2/repository_ directory in your home directory) for quick access to project dependencies. If you’d like to install your project’s JAR file to that local repository, then you should invoke the `install` goal:

<button class="copy-button snippet" id="copy-button-6" data-clipboard-target="#code-block-6"></button>

```
mvn install
```

The _install_ goal will compile, test, and package your project’s code and then copy it into the local dependency repository, ready for another project to reference it as a dependency.

Speaking of dependencies, now it’s time to declare dependencies in the Maven build.

## Declare Dependencies

The simple Hello World sample is completely self-contained and does not depend on any additional libraries. Most applications, however, depend on external libraries to handle common and complex functionality.

For example, suppose that in addition to saying "Hello World!", you want the application to print the current date and time. While you could use the date and time facilities in the native Java libraries, you can make things more interesting by using the Joda Time libraries.

First, change HelloWorld.java to look like this:

`src/main/java/hello/HelloWorld.java`

<button class="copy-button snippet" id="copy-button-7" data-clipboard-target="#code-block-7"></button>

```
`packagehello;importorg.joda.time.LocalTime;publicclassHelloWorld{publicstaticvoidmain(String[]args){LocalTimecurrentTime=newLocalTime();System.out.println("The current local time is: "+currentTime);Greetergreeter=newGreeter();System.out.println(greeter.sayHello());}}`
```

Here `HelloWorld` uses Joda Time’s `LocalTime` class to get and print the current time.

If you were to run `mvn compile` to build the project now, the build would fail because you’ve not declared Joda Time as a compile dependency in the build. You can fix that by adding the following lines to _pom.xml_ (within the `&lt;project&gt;` element):

<button class="copy-button snippet" id="copy-button-8" data-clipboard-target="#code-block-8"></button>

```
`<dependencies><dependency><groupId>joda-time</groupId><artifactId>joda-time</artifactId><version>2.9.2</version></dependency></dependencies>`
```

This block of XML declares a list of dependencies for the project. Specifically, it declares a single dependency for the Joda Time library. Within the `&lt;dependency&gt;` element, the dependency coordinates are defined by three sub-elements:

*   `&lt;groupId&gt;` - The group or organization that the dependency belongs to.

*   `&lt;artifactId&gt;` - The library that is required.

*   `&lt;version&gt;` - The specific version of the library that is required.

By default, all dependencies are scoped as `compile` dependencies. That is, they should be available at compile-time (and if you were building a WAR file, including in the _/WEB-INF/libs_ folder of the WAR). Additionally, you may specify a `&lt;scope&gt;` element to specify one of the following scopes:

*   `provided` - Dependencies that are required for compiling the project code, but that will be provided at runtime by a container running the code (e.g., the Java Servlet API).

*   `test` - Dependencies that are used for compiling and running tests, but not required for building or running the project’s runtime code.

Now if you run `mvn compile` or `mvn package`, Maven should resolve the Joda Time dependency from the Maven Central repository and the build will be successful.

## Write a Test

First add JUnit as a dependency to your pom.xml, in the test scope:

<button class="copy-button snippet" id="copy-button-9" data-clipboard-target="#code-block-9"></button>

```
`<dependency><groupId>junit</groupId><artifactId>junit</artifactId><version>4.12</version><scope>test</scope></dependency>`
```

Then create a test case like this:

`src/test/java/hello/GreeterTest.java`

<button class="copy-button snippet" id="copy-button-10" data-clipboard-target="#code-block-10"></button>

```
`packagehello;importstaticorg.hamcrest.CoreMatchers.containsString;importstaticorg.junit.Assert.*;importorg.junit.Test;publicclassGreeterTest{privateGreetergreeter=newGreeter();@TestpublicvoidgreeterSaysHello(){assertThat(greeter.sayHello(),containsString("Hello"));}}`
```

Maven uses a plugin called "surefire" to run unit tests. The default configuration of this plugin compiles and runs all classes in `src/test/java` with a name matching `*Test`. You can run the tests on the command line like this

<button class="copy-button snippet" id="copy-button-11" data-clipboard-target="#code-block-11"></button>

```
mvn test
```

or just use `mvn install` step as we already showed above (there is a lifecycle definition where "test" is included as a stage in "install").

Here’s the completed `pom.xml` file:

`pom.xml`

<button class="copy-button snippet" id="copy-button-12" data-clipboard-target="#code-block-12"></button>

```
`<?xml version="1.0"encoding="UTF-8"?><projectxmlns="http://maven.apache.org/POM/4.0.0"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd"><modelVersion>4.0.0</modelVersion><groupId>org.springframework</groupId><artifactId>gs-maven</artifactId><packaging>jar</packaging><version>0.1.0</version><dependencies><!-- tag::joda[] --><dependency><groupId>joda-time</groupId><artifactId>joda-time</artifactId><version>2.9.2</version></dependency><!-- end::joda[] --><!-- tag::junit[] --><dependency><groupId>junit</groupId><artifactId>junit</artifactId><version>4.12</version><scope>test</scope></dependency><!-- end::junit[] --></dependencies><build><plugins><plugin><groupId>org.apache.maven.plugins</groupId><artifactId>maven-shade-plugin</artifactId><version>2.1</version><executions><execution><phase>package</phase><goals><goal>shade</goal></goals><configuration><transformers><transformerimplementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer"><mainClass>hello.HelloWorld</mainClass></transformer></transformers></configuration></execution></executions></plugin></plugins></build></project>`
```

<table>
<tbody>
<tr>
<td class="icon">  </td>
<td class="content"> The completed **pom.xml** file is using the [Maven Shade Plugin](https://maven.apache.org/plugins/maven-shade-plugin/) for the simple convenience of making the JAR file executable. The focus of this guide is getting started with Maven, not using this particular plugin. </td>
</tr>
</tbody>
</table>

## Summary

Congratulations! You’ve created a simple yet effective Maven project definition for building Java projects.

## See Also

The following guides may also be helpful:

*   [Building Java Projects with Gradle](https://spring.io/guides/gs/gradle/)

原文链接: <https://spring.io/guides/gs/maven/>
