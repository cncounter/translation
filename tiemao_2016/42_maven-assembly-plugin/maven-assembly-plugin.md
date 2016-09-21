# Apache Maven Assembly Plugin 简介

## Apache Maven Assembly Plugin

### <a name="Introduction"></a>Introduction

The Assembly Plugin for Maven is primarily intended to allow users to aggregate the project output along with its dependencies, modules, site documentation, and other files into a single distributable archive.

Your project can build distribution "assemblies" easily, using one of the convenient, [prefabricated assembly descriptors](http://maven.apache.org/plugins/maven-assembly-plugin/descriptor-refs.html). These descriptors handle many common operations, such as packaging a project's artifact along with generated documentation into a [single zip archive](http://maven.apache.org/plugins/maven-assembly-plugin/descriptor-refs.html#bin). Alternatively, your project can provide its own [descriptor](http://maven.apache.org/plugins/maven-assembly-plugin/assembly.html) and assume a much higher level of control over how dependencies, modules, file-sets, and individual files are packaged in the assembly.

Currently it can create distributions in the following formats:

*   zip
*   tar
*   tar.gz (or tgz)
*   tar.bz2 (or tbz2)
*   jar
*   dir
*   war
*   and any other format that the ArchiveManager has been configured for

If your project wants to package your artifact in an uber-jar, the assembly plugin provides only basic support. For more control, use the [Maven Shade Plugin](http://maven.apache.org/plugins/maven-shade-plugin/).

To use the Assembly Plugin in Maven, you simply need to:

*   choose or write the assembly descriptor to use,
*   configure the Assembly Plugin in your project's <tt>pom.xml</tt>, and
*   run "mvn assembly:single" on your project.

To write your own custom assembly, you will need to refer to the [Assembly Descriptor Format](http://maven.apache.org/plugins/maven-assembly-plugin/assembly.html) reference.

### <a name="What_is_an_Assembly"></a>What is an Assembly?

An "assembly" is a group of files, directories, and dependencies that are assembled into an archive format and distributed. For example, assume that a Maven project defines a single JAR artifact that contains both a console application and a Swing application. Such a project could define two "assemblies" that bundle the application with a different set of supporting scripts and dependency sets. One assembly would be the assembly for the console application, and the other assembly could be a Swing application bundled with a slightly different set of dependencies.

The Assembly Plugin provides a descriptor format which allows you to define an arbitrary assembly of files and directories from a project. For example, if your Maven project contains the directory "src/main/bin", you can instruct the Assembly Plugin to copy the contents of this directory to the "bin" directory of an assembly and to change the permissions of the files in the "bin" directory to UNIX mode 755\. The parameters for configuring this behavior are supplied to the Assembly Plugin by way of the [assembly descriptor](http://maven.apache.org/plugins/maven-assembly-plugin/assembly.html).

### <a name="Goals"></a>Goals

The main goal in the assembly plugin is the [single](http://maven.apache.org/plugins/maven-assembly-plugin/single-mojo.html) goal. It is used to create all assemblies. **All other goals are deprecated and will be removed in a future release.**

For more information about the goals that are available in the Assembly Plugin, see [the plugin documentation page](http://maven.apache.org/plugins/maven-assembly-plugin/plugin-info.html).

Usage of the <tt>assembly:assembly</tt>, <tt>assembly:attached</tt>, <tt>assembly:directory</tt>, and <tt>assembly:directory-inline</tt> are **deprecated**, since they wreak havoc with normal build processes and promote non-standard build practices.

The <tt>assembly:single-directory</tt> goal is redundant, and has been **deprecated** in favor of the <tt>dir</tt> assembly format.

Finally, the <tt>assembly:unpack</tt> goal has been **deprecated** in favor of the far more comprehensive [Maven Dependency Plugin](http://maven.apache.org/plugins/maven-dependency-plugin/).

### Usage

General instructions on how to use the Assembly Plugin can be found on the [usage page](http://maven.apache.org/plugins/maven-assembly-plugin/usage.html). Some more specific use cases are described in the examples given below. Last but not least, users occasionally contribute additional examples, tips or errata to the [plugin's wiki page](http://docs.codehaus.org/display/MAVENUSER/Assembly+Plugin).

In case you still have questions regarding the plugin's usage, please have a look at the [FAQ](http://maven.apache.org/plugins/maven-assembly-plugin/faq.html) and feel free to contact the [user mailing list](http://maven.apache.org/plugins/maven-assembly-plugin/mail-lists.html). The posts to the mailing list are archived and could already contain the answer to your question as part of an older thread. Hence, it is also worth browsing/searching the [mail archive](http://maven.apache.org/plugins/maven-assembly-plugin/mail-lists.html).

If you feel like the plugin is missing a feature or has a defect, you can fill a feature request or bug report in our [issue tracker](http://maven.apache.org/plugins/maven-assembly-plugin/issue-tracking.html). When creating a new issue, please provide a comprehensive description of your concern. Especially for fixing bugs it is crucial that the developers can reproduce your problem. For this reason, entire debug logs, POMs or most preferably little demo projects attached to the issue are very much appreciated. Of course, patches are welcome, too. Contributors can check out the project from our [source repository](http://maven.apache.org/plugins/maven-assembly-plugin/source-repository.html) and will find supplementary information in the [guide to helping with Maven](http://maven.apache.org/guides/development/guide-helping.html).

### Examples

To provide you with better understanding on some usages of the Assembly Plugin, you can take a look into the examples which can be found [here](http://maven.apache.org/plugins/maven-assembly-plugin/examples/index.html).

## Usage

To handle filtering this version of Maven Assembly Plugin uses [Maven Filtering](http://maven.apache.org/shared/maven-filtering/index.html) 1.3.

To handle archiving this version of Maven Assembly Plugin uses [Maven Archiver](http://maven.apache.org/shared/maven-archiver/index.html) 2.5.

This document is intended to provide instructions for using the maven-assembly-plugin. In order for this discussion to be useful, it's critical to cover two topics: configuration of the plugin - both inside the POM and, where possible, from the command line - and the different execution styles. For the sake of clarity, we'll cover configuration before execution.

### <a name="Deprecation_notice"></a>Deprecation notice

All goals except <tt>assembly:single</tt> have been **deprecated**. See the [introduction page](http://maven.apache.org/plugins/maven-assembly-plugin/index.html) for more details.

### <a name="Configuration"></a>Configuration

Getting started with the Assembly Plugin is pretty simple. If you want to use one of the prefabricated assembly descriptors, you configure which descriptor to use with the <<tt>descriptorRefs></tt>/<<tt>descriptorRef></tt> parameter. If you want to use a custom assembly descriptor, you configure the path to your descriptor using the <<tt>descriptors></tt>/<<tt>descriptor></tt> parameter.

Note that a single invocation of the Assembly Plugin can actually produce assemblies from multiple descriptors, allowing you maximum flexibility to customize the suite of binaries your project produces. When the assembly is created it will use the assemblyId as the artifact's classifier and will attach the created assembly to the project so that it will be uploaded into the repository on the install and deploy goals.

For example, imagine that our project produces a JAR. If we want to create an assembly binary that includes our project's dependencies, we can take advantage of one of the Assembly Plugin's prefabricated descriptors. You configure it as follows in your project's <tt>pom.xml</tt>:

```
<project>
  [...]
  <build>
    [...]
    <plugins>
      <plugin>
        <!-- NOTE: We don't need a groupId specification because the group is
             org.apache.maven.plugins ...which is assumed by default.
         -->
        <artifactId>maven-assembly-plugin</artifactId>
        <version>2.6</version>
        <configuration>
          <descriptorRefs>
            <descriptorRef>jar-with-dependencies</descriptorRef>
          </descriptorRefs>
        </configuration>
        [...]
</project>
```

Note that the Assembly Plugin allows you to specify multiple <tt>descriptorRefs</tt> at once, to produce multiple types of assemblies in a single invocation.

Alternatively, we've created a custom assembly descriptor called <tt>src.xml</tt> in the <tt>src/assembly</tt> directory (see the [Resources](http://maven.apache.org/plugins/maven-assembly-plugin/usage.html#Resources) section for more information). We can tell the Assembly Plugin to use that instead:

```
<project>
  [...]
  <build>
    [...]
    <plugins>
      <plugin>
        <artifactId>maven-assembly-plugin</artifactId>
        <version>2.6</version>
        <configuration>
          <descriptors>
            <descriptor>src/assembly/src.xml</descriptor>
          </descriptors>
        </configuration>
        [...]
</project>
```

Again, note that we could specify multiple custom assembly descriptors here. Additionally, it's possible to specify a mixture of <tt>descriptors</tt> and <tt>descriptorRefs</tt> within the same configuration.

**Note:** Many other configuration options are available for the various goals in the Assembly Plugin. For more information, see the [examples section](http://maven.apache.org/plugins/maven-assembly-plugin/examples/index.html) or the [plugin parameter documentation](http://maven.apache.org/plugins/maven-assembly-plugin/plugin-info.html).

### <a name="Execution:_Building_an_Assembly"></a>Execution: Building an Assembly

Once you've configured the various <tt>descriptors</tt> and <tt>descriptorRefs</tt> for the assemblies you want the project to produce, it's time to build them.

In most cases, you'll want to make sure your assemblies are created as part of your normal build process. This ensures the assembly archives are made available for installation and deployment, and that they are created during the release of your project. This is handled by the <tt>assembly:single</tt> goal.

To bind the <tt>single</tt> goal to a project's build lifecycle, you can add this configuration (assuming you're using the <tt>jar-with-dependencies</tt> prefabricated descriptor):

```
<project>
  [...]
  <build>
    [...]
    <plugins>
      <plugin>
        <artifactId>maven-assembly-plugin</artifactId>
        <version>2.6</version>
        <configuration>
          <descriptorRefs>
            <descriptorRef>jar-with-dependencies</descriptorRef>
          </descriptorRefs>
        </configuration>
        <executions>
          <execution>
            <id>make-assembly</id> <!-- this is used for inheritance merges -->
            <phase>package</phase> <!-- bind to the packaging phase -->
            <goals>
              <goal>single</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
      [...]
</project>
```

Then, to create a project assembly, simple execute the normal <tt>package</tt> phase from the default lifecycle:

```
mvn package
```

When this build completes, you should see a file in the <tt>target</tt> directory with a name similar to the following:

```
target/sample-1.0-SNAPSHOT-jar-with-dependencies.jar
```

Notice the artifact classifier, between the end of the version and the beginning of the file extension, <tt>jar-with-dependencies</tt>. This is the <tt>id</tt> of the assembly descriptor used to create this artifact.

#### <a name="GOTCHA"></a>GOTCHA!

In most cases, the <tt>single</tt> goal should be bound to the <tt>package</tt> phase of the build. However, if your assembly doesn't require binaries, or if you need to use one assembly as input for another, you may need to change this. While it's possible to assign the <tt>single</tt> goal to any phase of the build lifecycle, you should be careful to make sure the resources included in your assembly exist before that assembly is created.

### <a name="Advanced_Configuration"></a>Advanced Configuration

#### <a name="Creating_an_Executable_JAR"></a>Creating an Executable JAR

As you've no doubt noticed, the Assembly Plugin can be a very useful way to create a self-contained binary artifact for your project, among many other things. However, once you've created this self-contained JAR, you will probably want the ability to execute it using the <tt>-jar</tt> JVM switch.

To accommodate this, the Assembly Plugin supports configuration of an <tt><archive></tt> element which is handled by <tt>maven-archiver</tt> (see [Resources](http://maven.apache.org/plugins/maven-assembly-plugin/usage.html#Resources)). Using this configuration, it's easy to configure the <tt>Main-Class</tt> attribute of the JAR manifest:

```
<project>
  [...]
  <build>
    [...]
    <plugins>
      <plugin>
        <artifactId>maven-assembly-plugin</artifactId>
        <version>2.6</version>
        <configuration>
          [...]
          <archive>
            <manifest>
              <mainClass>org.sample.App</mainClass>
            </manifest>
          </archive>
        </configuration>
        [...]
      </plugin>
      [...]
</project>
```

If we add this configuration to the <tt>single</tt> goal example above and rebuild, we will see an entry like this in the <tt>META-INF/MANIFEST.MF</tt> file of the resulting JAR:

```
[...]
Main-Class: org.sample.App
```

For more information on advanced configuration for the Assembly Plugin, see the [Resources](http://maven.apache.org/plugins/maven-assembly-plugin/usage.html#Resources) section.

#### <a name="GOTCHA"></a>GOTCHA!

At this point, only the <tt>jar</tt> and <tt>war</tt> assembly formats support the <tt><archive></tt> configuration element.

### <a name="Resources">Resources</a>

1.  For more information on writing your own assembly descriptor, read the [Assembly Descriptor](http://maven.apache.org/plugins/maven-assembly-plugin/assembly.html)
2.  For more information about <tt>maven-archiver</tt>, look [here](http://maven.apache.org/shared/maven-archiver/index.html).
3.  For more information on advanced <tt>maven-assembly-plugin</tt> configuration, see the [examples](http://maven.apache.org/plugins/maven-assembly-plugin/examples/index.html).





原文地址: [http://maven.apache.org/plugins/maven-assembly-plugin/](http://maven.apache.org/plugins/maven-assembly-plugin/)

