# LESS Tutorial

# LESS 教程



LESS is a CSS pre-processor that enables customizable, manageable and reusable style sheet for website. LESS is a dynamic style sheet language that extends the capability of CSS. LESS is also cross browser friendly.

LESS 是一种 CSS 预处理器(CSS pre-processor), 可以为网站生成可定制、可管理、可复用的样式表。 LESS 是一种动态样式表语言, 扩展了 CSS 的能力, 同时对各种浏览器都很友好。

# Audience

# 读者对象

This tutorial will help both students as well as professionals who want to make their websites or personal blogs more attractive.

本教程可以帮助那些想让自己的网站或者个人博客更有吸引力的学生和专业人士。

# Prerequisites

# 前置知识

You should be familiar with −

你应该熟悉以下内容 −

- Basic word processing using any text editor.
- How to create directories and files.
- How to navigate through different directories.
- Internet browsing using popular browsers like Internet Explorer or Firefox.
- Developing simple webpages using HTML or XHTML.

- 使用任意文本编辑器进行基本的文字处理。
- 如何创建目录和文件。
- 如何在不同的目录之间切换。
- 使用 IE、Firefox 等常见浏览器上网。
- 使用 HTML 或 XHTML 编写简单的网页。

If you are new to HTML and XHTML, then we suggest you go through our HTML Tutorial or XHTML Tutorial first.

如果你是 HTML 和 XHTML 的新手, 建议先学习我们的 HTML 教程或 XHTML 教程。

# LESS - Overview

# LESS - 概述

LESS is a CSS pre-processor that enables customizable, manageable and reusable style sheet for website. LESS is a dynamic style sheet language that extends the capability of CSS. LESS is also cross browser friendly.

LESS 是一种 CSS 预处理器, 可以为网站生成可定制、可管理、可复用的样式表。 LESS 是一种动态样式表语言, 扩展了 CSS 的能力, 同时对各种浏览器都很友好。

CSS Preprocessor is a scripting language that extends CSS and gets compiled into regular CSS syntax, so that it can be read by your web browser. It provides functionalities like *variables*, *functions*, *mixins* and *operations* that allow you to build dynamic CSS.

CSS 预处理器是一种脚本语言, 它扩展了 CSS, 并最终编译为常规的 CSS 语法, 这样浏览器才能读取。它提供了*变量(variable)*、*函数(function)*、*混入(mixin)*和*运算(operation)*等功能, 让你可以构建动态的 CSS。

## Why LESS?

## 为什么使用 LESS?

Let us now understand why do we use LESS.

下面我们来了解一下为什么要使用 LESS。

- LESS supports creating cleaner, cross-browser friendly CSS faster and easier.
- LESS is designed in JavaScript and also created to be used in *live*, which compiles faster than other CSS pre-processors.
- LESS keeps your code in modular way which is really important by making it readable and easily changeable.
- Faster maintenance can be achieved by the use of LESS *variables*.

- LESS 支持更快、更轻松地编写更简洁、跨浏览器兼容的 CSS。
- LESS 使用 JavaScript 设计, 并且支持*实时(live)*使用, 编译速度比其他 CSS 预处理器更快。
- LESS 以模块化的方式组织代码, 让代码可读且易于修改, 这一点非常重要。
- 使用 LESS 的*变量*可以实现更快的维护。

## History

## 历史

LESS was designed by **Alexis Sellier** in 2009. LESS is an open-source. The first version of LESS was written in Ruby; in the later versions, the use of Ruby was replaced by JavaScript.

LESS 由 **Alexis Sellier** 于 2009 年设计, 是一个开源项目。LESS 的第一个版本使用 Ruby 编写, 在后来的版本中, Ruby 被替换为 JavaScript。

## Features

## 特性

- Cleaner and more readable code can be written in an organized way.
- We can define styles and it can be reused throughout the code.
- LESS is based on JavaScript and is a super set of CSS.
- LESS is an agile tool that sorts out the problem of code redundancy.

- 可以有组织地编写更简洁、可读性更强的代码。
- 样式只需定义一次, 就可以在整个代码中复用。
- LESS 基于 JavaScript, 是 CSS 的超集。
- LESS 是一个敏捷的工具, 可以解决代码冗余的问题。

## Advantages

## 优点

- LESS easily generates CSS that works across the browsers.
- LESS enables you to write better and well organized code by using *nesting*.
- Maintenance can be achieved faster by the use of *variables*.
- LESS enables you to reuse the whole classes easily by referencing them in your rule sets.
- LESS provides the use of *operations* that makes coding faster and saves time.

- LESS 可以轻松生成跨浏览器兼容的 CSS。
- 使用*嵌套(nesting)*, LESS 可以让你写出更好、组织更良好的代码。
- 使用*变量*可以更快地进行维护。
- 在规则集中引用整个类, LESS 可以让你轻松复用它们。
- LESS 提供*运算*功能, 让编码更快、节省时间。

## Disadvantages

## 缺点

- It takes time to learn if you are new to CSS preprocessing.
- Due to the tight coupling between the modules, more efforts should be taken to reuse and/or test dependent modules.
- LESS has less framework compared to older preprocessor like SASS, which consists of frameworks *Compass*, *Gravity* and *Susy*.

- 如果你不熟悉 CSS 预处理, 则需要花费一些时间学习。
- 由于模块之间耦合紧密, 复用和/或测试依赖模块时需要付出更多的精力。
- 与 SASS 这类更早的预处理器相比, LESS 的框架较少; SASS 生态中有 *Compass*、*Gravity* 和 *Susy* 等框架。

# LESS - Installation

# LESS - 安装

In this chapter, we will understand, in a step-by-step manner, how to install LESS.

本章中, 我们将逐步了解如何安装 LESS。

## System Requirements for LESS

## LESS 的系统要求

- **Operating System** − Cross-platform
- **Browser Support** − IE (Internet Explorer 8+), Firefox, Google Chrome, Safari.

- **操作系统** − 跨平台
- **浏览器支持** − IE (Internet Explorer 8+)、Firefox、Google Chrome、Safari。

## Installation of LESS

## LESS 的安装

Let us now understand the installation of LESS.

下面我们来了解 LESS 的安装过程。

**Step 1** − We need **NodeJs** to run LESS examples. To download NodeJs, open the link [https://nodejs.org/en/](https://nodejs.org/en/), you will see a screen as shown below −

**第 1 步** − 运行 LESS 示例需要 **NodeJs**。要下载 NodeJs, 请打开链接 [https://nodejs.org/en/](https://nodejs.org/en/), 你会看到如下图所示的界面 −

Dowload the *Latest Features* version of the zip file.

下载 *Latest Features* 版本的 zip 文件。

**Step 2** − Run the setup to install the *Node.js* on your system.

**第 2 步** − 运行安装程序, 在你的系统上安装 *Node.js*。

**Step 3** − Next, Install LESS on the server via NPM (Node Package Manager). Run the following command in the command prompt.

**第 3 步** − 接着, 通过 NPM (Node Package Manager) 安装 LESS。在命令行提示符中运行以下命令。

```
npm install -g less
```

**Step 4** − After successful installation of LESS, you will see the following lines on the command prompt −

**第 4 步** − LESS 安装成功后, 你会在命令行提示符中看到如下输出 −

```
`-- less@2.6.1
   +-- errno@0.1.4
   | `-- prr@0.0.0
   +-- graceful-fs@4.1.3
   +-- image-size@0.4.0
   +-- mime@1.3.4
   +-- mkdirp@0.5.1
   | `-- minimist@0.0.8
   +-- promise@7.1.1
   | `-- asap@2.0.3
   +-- request@2.69.0
   | +-- aws-sign2@0.6.0
   | +-- aws4@1.3.2
   | | `-- lru-cache@4.0.0
   | |   +-- pseudomap@1.0.2
   | |   `-- yallist@2.0.0
   | +-- bl@1.0.3
   | | `-- readable-stream@2.0.6
   | |   +-- core-util-is@1.0.2
   | |   +-- inherits@2.0.1
   | |   +-- isarray@1.0.0
   | |   +-- process-nextick-args@1.0.6
   | |   +-- string_decoder@0.10.31
   | |   `-- util-deprecate@1.0.2
   | +-- caseless@0.11.0
   | +-- combined-stream@1.0.5
   | | `-- delayed-stream@1.0.0
   | +-- extend@3.0.0
   | +-- forever-agent@0.6.1
   | +-- form-data@1.0.0-rc4
   | | `-- async@1.5.2
   | +-- har-validator@2.0.6
   | | +-- chalk@1.1.1
   | | | +-- ansi-styles@2.2.0
   | | | | `-- color-convert@1.0.0
   | | | +-- escape-string-regexp@1.0.5
   | | | +-- has-ansi@2.0.0
   | | | | `-- ansi-regex@2.0.0
   | | | +-- strip-ansi@3.0.1
   | | | `-- supports-color@2.0.0
   | | +-- commander@2.9.0
   | | | `-- graceful-readlink@1.0.1
   | | +-- is-my-json-valid@2.13.1
   | | | +-- generate-function@2.0.0
   | | | +-- generate-object-property@1.2.0
   | | | | `-- is-property@1.0.2
   | | | +-- jsonpointer@2.0.0
   | | | `-- xtend@4.0.1
   | | `-- pinkie-promise@2.0.0
   | |   `-- pinkie@2.0.4
   | +-- hawk@3.1.3
   | | +-- boom@2.10.1
   | | +-- cryptiles@2.0.5
   | | +-- hoek@2.16.3
   | | `-- sntp@1.0.9
   | +-- http-signature@1.1.1
   | | +-- assert-plus@0.2.0
   | | +-- jsprim@1.2.2
   | | | +-- extsprintf@1.0.2
   | | | +-- json-schema@0.2.2
   | | | `-- verror@1.3.6
   | | `-- sshpk@1.7.4
   | |   +-- asn1@0.2.3
   | |   +-- dashdash@1.13.0
   | |   | `-- assert-plus@1.0.0
   | |   +-- ecc-jsbn@0.1.1
   | |   +-- jodid25519@1.0.2
   | |   +-- jsbn@0.1.0
   | |   `-- tweetnacl@0.14.1
   | +-- is-typedarray@1.0.0
   | +-- isstream@0.1.2
   | +-- json-stringify-safe@5.0.1
   | +-- mime-types@2.1.10
   | | `-- mime-db@1.22.0
   | +-- node-uuid@1.4.7
   | +-- oauth-sign@0.8.1
   | +-- qs@6.0.2
   | +-- stringstream@0.0.5
   | +-- tough-cookie@2.2.2
   | `-- tunnel-agent@0.4.2
   `-- source-map@0.5.3

```

## Example

## 示例

Following is a simple example of LESS.

下面是 LESS 的一个简单示例。

### hello.htm

```
<!doctype html>
   <head>
      <link rel = "stylesheet" href = "style.css" type = "text/css" />
   </head>
   
   <body>
      <h1>Welcome to TutorialsPoint</h1>
      <h3>Hello!!!!!</h3>
   </body>
</html>
```

Let us now create a file *style.less* which is quite similar to CSS, the only difference is that it will be saved with *.less* extension. Both the files, *.html* and *.less* should be created inside the folder **nodejs**.

现在我们创建一个 *style.less* 文件, 它与 CSS 非常相似, 唯一的区别是它以 *.less* 扩展名保存。*.html* 和 *.less* 这两个文件都应创建在 **nodejs** 文件夹中。

### style.less

```
@primarycolor: #FF7F50;
@color:#800080;
h1 {
   color: @primarycolor;
}

h3 {
   color: @color;
}
```

Compile *style.less* file to *style.css* by using the following command −

使用以下命令将 *style.less* 文件编译为 *style.css* −

```
lessc style.less style.css
```

When you run the above command, it will create the *style.css* file automatically. Whenever you change the LESS file, it's necessary to run the above command in the cmd and then the *style.css* file will get updated.

运行上面的命令后, 会自动创建 *style.css* 文件。每次修改 LESS 文件之后, 都需要在命令行中重新运行上面的命令, *style.css* 文件才会更新。

The *style.css* file will have the following code when you run the above command −

运行上面的命令后, *style.css* 文件的内容如下 −

### style.css

```
h1 {
  color: #FF7F50;
}

h3 {
  color: #800080;
}
```

## Output

## 输出结果

Let us now carry out the following steps to see how the above code works −

现在我们执行以下步骤, 看看上面的代码是如何工作的 −

- Save the above html code in the **hello.htm** file.
- Open this HTML file in a browser, the following output will gets displayed.

- 将上面的 HTML 代码保存到 **hello.htm** 文件中。
- 在浏览器中打开这个 HTML 文件, 将显示如下输出。

















<https://www.tutorialspoint.com/less/index.htm>

