# Apache Maven Assembly Plugin 简介

## Apache Maven Assembly Plugin

### <a name="Introduction"></a>简介

Maven 的 Assembly Plugin 主要用于将项目的输出与其依赖、模块、站点文档及其他文件聚合为单个可分发的归档包。

你可以使用一个方便的[预制 assembly 描述符](http://maven.apache.org/plugins/maven-assembly-plugin/descriptor-refs.html), 轻松为项目构建分发包("assembly")。这些描述符处理了许多常见操作, 例如将项目的构件连同生成的文档打包成一个 [zip 归档包](http://maven.apache.org/plugins/maven-assembly-plugin/descriptor-refs.html#bin)。或者, 你的项目可以提供自己的[描述符](http://maven.apache.org/plugins/maven-assembly-plugin/assembly.html), 从而对依赖、模块、文件集以及单个文件如何打包进 assembly 拥有高得多的控制力。

目前它可以创建以下格式的分发包:

*   zip
*   tar
*   tar.gz (or tgz)
*   tar.bz2 (or tbz2)
*   jar
*   dir
*   war
*   以及 ArchiveManager 已配置支持的其他任意格式

如果你的项目想将构件打包成 uber-jar, assembly 插件只提供基本的支持。若需要更多控制, 请使用 [Maven Shade Plugin](http://maven.apache.org/plugins/maven-shade-plugin/)。

要在 Maven 中使用 Assembly Plugin, 你只需:

*   选择或编写要使用的 assembly 描述符,
*   在你的项目 <tt>pom.xml</tt> 中配置 Assembly Plugin, 以及
*   在你的项目上运行 "mvn assembly:single"。

要编写自己的自定义 assembly, 你需要参考 [Assembly Descriptor Format](http://maven.apache.org/plugins/maven-assembly-plugin/assembly.html) 参考文档。

### <a name="What_is_an_Assembly"></a>什么是 Assembly?

一个 "assembly" 是一组文件、目录和依赖, 它们被打包成某种归档格式并分发。例如, 假设一个 Maven 项目定义了一个单独的 JAR 构件, 其中同时包含一个控制台应用和一个 Swing 应用。这样的项目可以定义两个 "assembly", 分别用不同的配套脚本和依赖集来打包该应用。一个 assembly 是控制台应用的 assembly, 另一个可以是捆绑了一组稍有不同依赖的 Swing 应用 assembly。

Assembly Plugin 提供了一种描述符格式, 允许你从项目中定义由任意文件和目录组成的 assembly。例如, 如果你的 Maven 项目包含 "src/main/bin" 目录, 你可以指示 Assembly Plugin 将该目录的内容复制到 assembly 的 "bin" 目录, 并将 "bin" 目录中文件的权限改成 UNIX mode 755。用于配置此行为的参数通过 [assembly 描述符](http://maven.apache.org/plugins/maven-assembly-plugin/assembly.html)提供给 Assembly Plugin。

### <a name="Goals"></a>目标(Goals)

assembly 插件的核心目标是 [single](http://maven.apache.org/plugins/maven-assembly-plugin/single-mojo.html) 目标。它用于创建所有的 assembly。**其他所有目标均已废弃, 并将在未来的版本中移除。**

有关 Assembly Plugin 中可用目标的更多信息, 请参阅[插件文档页面](http://maven.apache.org/plugins/maven-assembly-plugin/plugin-info.html)。

对 <tt>assembly:assembly</tt>、<tt>assembly:attached</tt>、<tt>assembly:directory</tt> 和 <tt>assembly:directory-inline</tt> 的使用方式是**已废弃**的, 因为它们会破坏正常的构建过程, 并助长非标准的构建实践。

<tt>assembly:single-directory</tt> 目标是多余的, 已被**废弃**, 建议改用 <tt>dir</tt> assembly 格式。

最后, <tt>assembly:unpack</tt> 目标已被**废弃**, 建议改用功能全面得多的 [Maven Dependency Plugin](http://maven.apache.org/plugins/maven-dependency-plugin/)。

### 用法

有关如何使用 Assembly Plugin 的通用说明, 请参阅[用法页面](http://maven.apache.org/plugins/maven-assembly-plugin/usage.html)。一些更具体的用例在下面的示例中描述。最后但同样重要的是, 用户偶尔会向[插件的 wiki 页面](http://docs.codehaus.org/display/MAVENUSER/Assembly+Plugin)贡献额外的示例、技巧或勘误。

如果你对插件的用法仍有疑问, 请查看 [FAQ](http://maven.apache.org/plugins/maven-assembly-plugin/faq.html), 并欢迎联系[用户邮件列表](http://maven.apache.org/plugins/maven-assembly-plugin/mail-lists.html)。发往邮件列表的帖子会被归档, 其中较早的讨论串可能已经包含了你的问题的答案。因此, 也值得浏览/搜索[邮件归档](http://maven.apache.org/plugins/maven-assembly-plugin/mail-lists.html)。

如果你觉得插件缺少某个功能或有缺陷, 可以在我们的[问题跟踪器](http://maven.apache.org/plugins/maven-assembly-plugin/issue-tracking.html)中提交功能请求或缺陷报告。创建新问题时, 请提供对你所关注问题的全面描述。特别是对于修复缺陷来说, 开发者能够重现你的问题至关重要。为此, 非常欢迎在问题中附上完整的调试日志、POM, 最好是小型演示项目。当然, 补丁也欢迎。贡献者可以从我们的[源码仓库](http://maven.apache.org/plugins/maven-assembly-plugin/source-repository.html)检出项目, 并会在[帮助改进 Maven 指南](http://maven.apache.org/guides/development/guide-helping.html)中找到补充信息。

### 示例

为了让你更好地理解 Assembly Plugin 的一些用法, 你可以查看[这里](http://maven.apache.org/plugins/maven-assembly-plugin/examples/index.html)的示例。

## 用法

为了处理过滤, 此版本的 Maven Assembly Plugin 使用 [Maven Filtering](http://maven.apache.org/shared/maven-filtering/index.html) 1.3。

为了处理归档, 此版本的 Maven Assembly Plugin 使用 [Maven Archiver](http://maven.apache.org/shared/maven-archiver/index.html) 2.5。

本文档旨在提供使用 maven-assembly-plugin 的说明。为了让这一讨论有用, 必须涵盖两个主题: 插件的配置——既包括 POM 内部的配置, 也包括在可能情况下的命令行配置——以及不同的执行方式。为清楚起见, 我们将先讲配置, 再讲执行。

### <a name="Deprecation_notice"></a>废弃声明

除 <tt>assembly:single</tt> 之外的所有目标均已**废弃**。更多细节见[简介页面](http://maven.apache.org/plugins/maven-assembly-plugin/index.html)。

### <a name="Configuration"></a>配置

Assembly Plugin 的入门相当简单。如果你想使用某个预制的 assembly 描述符, 通过 <<tt>descriptorRefs></tt>/<<tt>descriptorRef></tt> 参数配置要使用哪个描述符。如果你想使用自定义的 assembly 描述符, 通过 <<tt>descriptors></tt>/<<tt>descriptor></tt> 参数配置描述符的路径。

注意, 一次调用 Assembly Plugin 实际上可以根据多个描述符生成 assembly, 让你最大限度地灵活定制项目产生的各类二进制包。创建 assembly 时, 它会使用 assemblyId 作为构件的 classifier, 并将创建好的 assembly 附加到项目上, 以便在 install 和 deploy 目标时上传到仓库。

例如, 假设我们的项目会产出一个 JAR。如果我们想创建一个包含项目依赖的 assembly 二进制包, 可以利用 Assembly Plugin 的一个预制描述符。在你的项目 <tt>pom.xml</tt> 中配置如下:

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

注意, Assembly Plugin 允许你一次性指定多个 <tt>descriptorRefs</tt>, 从而在单次调用中生成多种类型的 assembly。

或者, 我们在 <tt>src/assembly</tt> 目录下创建了一个名为 <tt>src.xml</tt> 的自定义 assembly 描述符(更多信息请参见 [Resources](http://maven.apache.org/plugins/maven-assembly-plugin/usage.html#Resources) 小节)。我们可以告诉 Assembly Plugin 改用这个描述符:

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

同样, 注意这里可以指定多个自定义 assembly 描述符。此外, 也可以在同一份配置中混合使用 <tt>descriptors</tt> 和 <tt>descriptorRefs</tt>。

**注意:** Assembly Plugin 中各种目标还有许多其他配置选项可用。更多信息请参见[示例小节](http://maven.apache.org/plugins/maven-assembly-plugin/examples/index.html)或[插件参数文档](http://maven.apache.org/plugins/maven-assembly-plugin/plugin-info.html)。

### <a name="Execution:_Building_an_Assembly"></a>执行: 构建 Assembly

一旦你为项目想要生成的各个 assembly 配置好了 <tt>descriptors</tt> 和 <tt>descriptorRefs</tt>, 就该构建它们了。

在大多数情况下, 你会希望确保 assembly 作为常规构建过程的一部分被创建。这样可以保证 assembly 归档包可用于安装和部署, 并且会在项目发布期间生成。这由 <tt>assembly:single</tt> 目标来处理。

要将 <tt>single</tt> 目标绑定到项目的构建生命周期上, 可以添加如下配置(假设你使用的是 <tt>jar-with-dependencies</tt> 预制描述符):

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

然后, 要创建项目的 assembly, 只需执行默认生命周期中常规的 <tt>package</tt> 阶段:

```
mvn package
```

构建完成后, 你应该会在 <tt>target</tt> 目录中看到一个名称类似如下的文件:

```
target/sample-1.0-SNAPSHOT-jar-with-dependencies.jar
```

注意其中位于版本号末尾与文件扩展名开头之间的构件 classifier, 即 <tt>jar-with-dependencies</tt>。它正是用于创建该构件的 assembly 描述符的 <tt>id</tt>。

#### <a name="GOTCHA"></a>注意!

在大多数情况下, <tt>single</tt> 目标应当绑定到构建的 <tt>package</tt> 阶段。但是, 如果你的 assembly 不需要二进制文件, 或者你需要用一个 assembly 作为另一个 assembly 的输入, 则可能需要改动这一点。虽然可以把 <tt>single</tt> 目标分配到构建生命周期的任意阶段, 但你要小心确保 assembly 中包含的资源在该 assembly 被创建之前就已经存在。

### <a name="Advanced_Configuration"></a>高级配置

#### <a name="Creating_an_Executable_JAR"></a>创建可执行 JAR

你肯定已经注意到, Assembly Plugin 是一种非常有用的方式, 可以为项目创建自包含的二进制构件, 诸如此类。不过, 一旦创建了这个自包含的 JAR, 你可能希望用 JVM 的 <tt>-jar</tt> 开关来执行它。

为满足这一点, Assembly Plugin 支持配置一个由 <tt>maven-archiver</tt> 处理的 <tt><archive></tt> 元素(参见 [Resources](http://maven.apache.org/plugins/maven-assembly-plugin/usage.html#Resources))。使用该配置, 可以很容易地设置 JAR manifest 的 <tt>Main-Class</tt> 属性:

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

如果我们把这份配置加到上面 <tt>single</tt> 目标的示例中再重新构建, 就会在生成的 JAR 的 <tt>META-INF/MANIFEST.MF</tt> 文件中看到类似这样的一行:

```
[...]
Main-Class: org.sample.App
```

有关 Assembly Plugin 高级配置的更多信息, 请参见 [Resources](http://maven.apache.org/plugins/maven-assembly-plugin/usage.html#Resources) 小节。

#### <a name="GOTCHA"></a>注意!

目前, 只有 <tt>jar</tt> 和 <tt>war</tt> 两种 assembly 格式支持 <tt><archive></tt> 配置元素。

### <a name="Resources">资源</a>

1.  有关编写自己的 assembly 描述符的更多信息, 请阅读 [Assembly Descriptor](http://maven.apache.org/plugins/maven-assembly-plugin/assembly.html)
2.  有关 <tt>maven-archiver</tt> 的更多信息, 请看[这里](http://maven.apache.org/shared/maven-archiver/index.html)。
3.  有关高级 <tt>maven-assembly-plugin</tt> 配置的更多信息, 请参阅[示例](http://maven.apache.org/plugins/maven-assembly-plugin/examples/index.html)。




原文地址: [http://maven.apache.org/plugins/maven-assembly-plugin/](http://maven.apache.org/plugins/maven-assembly-plugin/)
