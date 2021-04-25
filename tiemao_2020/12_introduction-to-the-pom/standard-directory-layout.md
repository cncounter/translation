## Introduction to the Standard Directory Layout

## MAVEN基础系列（四） 标准的Maven项目结构

相关文章:

- [MAVEN基础系列（〇） Maven五分钟入门教程](./maven-in-five-minutes.md)
- [MAVEN基础系列（一） 项目构建的各个阶段](./introduction-to-the-lifecycle.md)
- [MAVEN基础系列（二） POM文件](./README.md)
- [MAVEN基础系列（三） 按环境Profiles打包](./introduction-to-profiles.md)
- [MAVEN基础系列（四） 标准的Maven项目结构](./standard-directory-layout.md)
- [MAVEN基础系列（五） 浅析pom依赖机制](./introduction-to-dependency-mechanism.md)
- [MAVEN基础系列（六） 依赖项排除与可选依赖](./optional-and-excludes-dependencies.md)


Having a common directory layout allows users familiar with one Maven project to immediately feel at home in another Maven project. The advantages are analogous to adopting a site-wide look-and-feel.

The next section documents the directory layout expected by Maven and the directory layout created by Maven. Try to conform to this structure as much as possible. However, if you can't, these settings can be overridden via the project descriptor.

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

At the top level, files descriptive of the project: a `pom.xml` file. In addition, there are textual documents meant for the user to be able to read immediately on receiving the source: `README.txt`, `LICENSE.txt`, etc.

There are just two subdirectories of this structure: `src` and `target`. The only other directories that would be expected here are metadata like `CVS`, `.git` or `.svn`, and any subprojects in a multiproject build (each of which would be laid out as above).

The `target` directory is used to house all output of the build.

The `src` directory contains all of the source material for building the project, its site and so on. It contains a subdirectory for each type: `main` for the main build artifact, `test` for the unit test code and resources, `site` and so on.

Within artifact producing source directories (ie. `main` and `test`), there is one directory for the language `java` (under which the normal package hierarchy exists), and one for `resources` (the structure which is copied to the target classpath given the default resource definition).

If there are other contributing sources to the artifact build, they would be under other subdirectories. For example `src/main/antlr` would contain Antlr grammar definition files.



### 参考链接

原文链接: <https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html>
