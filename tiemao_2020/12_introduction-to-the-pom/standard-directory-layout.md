## Introduction to the Standard Directory Layout

## MAVEN基础系列（四） 标准的Maven项目结构

相关文章:

- [MAVEN基础系列（〇） Maven五分钟入门教程](./maven-in-five-minutes.md)
- [MAVEN基础系列（一） 项目构建的各个阶段](./introduction-to-the-lifecycle.md)
- [MAVEN基础系列（二） POM文件](./README.md)
- [MAVEN基础系列（三） Profiles配置打包环境](./introduction-to-profiles.md)
- [MAVEN基础系列（四） 标准的Maven项目结构](./standard-directory-layout.md)
- [MAVEN基础系列（五） 浅析pom依赖机制](./introduction-to-dependency-mechanism.md)
- [MAVEN基础系列（六） 依赖项排除与可选依赖](./optional-and-excludes-dependencies.md)


Having a common directory layout allows users familiar with one Maven project to immediately feel at home in another Maven project. The advantages are analogous to adopting a site-wide look-and-feel.

采用统一的目录结构，可以让熟悉某一个 Maven 项目的用户，很快就能适应另一个 Maven 项目。 这种优势类似于整个网站采用统一的外观风格(look-and-feel)。

The next section documents the directory layout expected by Maven and the directory layout created by Maven. Try to conform to this structure as much as possible. However, if you can't, these settings can be overridden via the project descriptor.

下一节介绍了 Maven 期望的目录结构，以及 Maven 创建的目录结构。 请尽量遵循这种结构。 当然，如果实在做不到，也可以通过项目描述符(project descriptor，即 POM)来覆盖这些设置。

| `src/main/java`      | Application/Library sources                                  |
| -------------------- | ------------------------------------------------------------ |
| `src/main/resources` | Application/Library resources                                |
| `src/main/filters`   | Resource filter files                                        |
| `src/main/webapp`    | Web application sources                                      |
| `src/test/java`      | Test sources                                                 |
| `src/test/resources` | Test resources                                               |
| `src/test/filters`   | Test resource filter files                                   |
| `src/it`             | Integration Tests (primarily for plugins)                    |
| `src/assembly`       | Assembly descriptors                                         |
| `src/site`           | Site                                                         |
| `LICENSE.txt`        | Project's license                                            |
| `NOTICE.txt`         | Notices and attributions required by libraries that the project depends on |
| `README.txt`         | Project's readme                                             |

中文对照:

| 目录                 | 说明                                                          |
| -------------------- | ------------------------------------------------------------ |
| `src/main/java`      | 应用程序/类库的源代码                                          |
| `src/main/resources` | 应用程序/类库的资源文件                                        |
| `src/main/filters`   | 资源过滤配置文件                                              |
| `src/main/webapp`    | Web 应用程序的源代码                                          |
| `src/test/java`      | 测试代码                                                      |
| `src/test/resources` | 测试资源文件                                                  |
| `src/test/filters`   | 测试资源过滤配置文件                                          |
| `src/it`             | 集成测试(主要针对插件)                                        |
| `src/assembly`       | Assembly 打包描述符                                           |
| `src/site`           | 站点资源                                                      |
| `LICENSE.txt`        | 项目的许可证                                                  |
| `NOTICE.txt`         | 项目所依赖的类库要求的声明和归属信息                            |
| `README.txt`         | 项目的 readme                                                 |

At the top level, files descriptive of the project: a `pom.xml` file. In addition, there are textual documents meant for the user to be able to read immediately on receiving the source: `README.txt`, `LICENSE.txt`, etc.

在项目顶层，是描述项目信息的文件： `pom.xml`。 此外还有一些文本文件，方便用户拿到源码后直接阅读： `README.txt`, `LICENSE.txt` 等。

There are just two subdirectories of this structure: `src` and `target`. The only other directories that would be expected here are metadata like `CVS`, `.git` or `.svn`, and any subprojects in a multiproject build (each of which would be laid out as above).

这种结构中只有两个子目录： `src` 和 `target`。 除此之外可能存在的目录，只有版本控制工具的元数据目录，比如 `CVS`, `.git` 或 `.svn`，以及多项目构建中的各个子项目(每个子项目都按上述结构组织)。

The `target` directory is used to house all output of the build.

`target` 目录用于存放构建过程产生的所有输出。

The `src` directory contains all of the source material for building the project, its site and so on. It contains a subdirectory for each type: `main` for the main build artifact, `test` for the unit test code and resources, `site` and so on.

`src` 目录包含构建项目、站点等所需的所有源材料。 每种类型对应一个子目录： `main` 用于存放主构建产物， `test` 用于存放单元测试代码和资源，还有 `site` 等等。

Within artifact producing source directories (ie. `main` and `test`), there is one directory for the language `java` (under which the normal package hierarchy exists), and one for `resources` (the structure which is copied to the target classpath given the default resource definition).

在产出构建产物的源码目录中(即 `main` 和 `test`)，有一个 `java` 目录用于存放 Java 语言的代码(其下是常规的包层次结构)，还有一个 `resources` 目录(在默认资源定义下，该目录中的结构会被拷贝到目标 classpath 中)。

If there are other contributing sources to the artifact build, they would be under other subdirectories. For example `src/main/antlr` would contain Antlr grammar definition files.

如果构建过程中还有其他类型的源文件，可以放在其他子目录中。 例如 `src/main/antlr` 可以存放 Antlr 语法定义文件。



### 参考链接

原文链接: <https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html>
