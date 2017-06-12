# Basic Structure of a Web Page

# HTML页面基本结构


While this reference aims to provide a thorough breakdown of the various HTML elements and their respective attributes, you also need to understand how these items fit into the bigger picture. A web page is structured as follows.


本文简要介绍各种HTML元素与相关的属性，读者需要理解: 整个HTML都是由这些基本元素组合成的。HTML页面的结构如下。



## The Doctype

## Doctype 声明

The first item to appear in the source code of a web page is the [doctype](https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/doctypes) declaration. This provides the web browser (or other user agent) with information about the type of markup language in which the page is written, which may or may not affect the way the browser renders the content. It may look a little scary at first glance, but the good news is that most WYSIWYG web editors will create the doctype for you automatically after you’ve selected from a dialog the type of document you’re creating. If you aren’t using a WYSIWYG web editing package, you can refer to the [list of doctypes contained in this reference](https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/doctypes) and copy the one you want to use.

HTML 源码中, 首先出现的是 [doctype](https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/doctypes) 声明。 这告诉浏览器, 该页面用何种标记语言编写, 这可能会影响浏览器渲染内容的方式。看起来有点复杂，但大部分所见即所得(WYSIWYG)的web编辑器都会自动创建 doctype。如果不使用WYSIWYG 编辑工具，那么可以拷贝其他网页中包含的 doctype, 也可以参考以下 doctype列表。

Doctypes are simply a way to tell the browser—or any other parsers—what type of document they’re looking at. In the case of HTML files, they refer to the specific version and flavor of HTML. The doctype should always be the first item at the top of all your HTML files. In the past, the doctype declaration was an ugly and hard-to-remember mess. For XHTML 1.0 Strict:

Doctypes 是告诉浏览器,它们所看到的文档是什么类型。在HTML文件中，它们指的是HTML的特定版本和展示风格。doctype 应该是所有HTML文件中最顶部的那一行。在之前，doctype 声明很丑,并且也不好记。例如 XHTML 1.0 Strict 写法:


```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

And for HTML4 Transitional:


还有HTML4过渡式写法:


```
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
  "http://www.w3.org/TR/html4/loose.dtd">
```

Over the years, code editing software began to provide HTML templates with the doctype already included, or else they offered a way to automatically insert one. And naturally, a quick web search will easily bring up the code to insert whatever doctype you require.

多年来，代码编辑器在HTML模板中都自动包含了doctype，或者提供了一种自动插入的方式。自然,他们很容易插入您需要的各种doctype。

Although having that long string of text at the top of our documents hasn’t really hurt us (other than forcing our sites’ viewers to download a few extra bytes), HTML5 has done away with that indecipherable eyesore. Now all you need is this:

尽管在文档顶部有这么一长串文本并没有多少坏处, 但 HTML5 消除了这些可读性差的东西。现在你所需要的就是:


```
 <!doctype html>
```

Simple, and to the point. You’ll notice that the “5” is conspicuously missing from the declaration. Although the current iteration of web markup is known as “HTML5,” it really is just an evolution of previous HTML standards—and future specifications will simply be a development of what we have today. Because browsers have to support all existing content on the Web, there’s no reliance on the doctype to tell them which features should be supported in a given document.

简单又直接。您会看到，声明中并没有版本号 "5"。尽管当前的版本被称为 HTML5, 但实际上它只是对以前HTML标准的一个演进。因为浏览器必须支持Web上的各种现有内容，所以并不需要 doctype 来说明依赖哪些特性。



The doctype looks like this (as seen in the context of a very simple HTML 4.01 page without any content):

在一个非常简单的HTML 4.01页面中, doctype 看起来是这样的:


```
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN""http://www.w3.org/TR/html4/strict.dtd">
<html><head><title>Page title</title></head><body></body></html>
```

In the example above, the doctype relates to HTML 4.01 Strict. In this reference, you’ll see examples of HTML 4.01 and also XHTfML 1.0 and 1.1, identified as such. While many of the elements and attributes may have the same names, there are some distinct syntactic differences between the various versions of HTML andXHTML. You can find out more about this in the sections entitled [HTML Versus XHTML](http://www.sitepoint.com/web-foundations/differences-html-xhtml/) and [HTML and XHTML Syntax](http://reference.sitepoint.com/html/html-xhtml-syntax).


在上面的例子中，doctype与HTML 4.01 Strict相关。在本文中，您将看到 HTML 4.01 以及 XHTfML 1.0 , 1.1 的示例。虽然许多元素和属性可能具有相同的名称，但在不同版本的HTML和xhtml之间存在一些明显的语法差异。详情请参考 [HTML Versus XHTML](http://www.sitepoint.com/web-foundations/differences-html-xhtml/) 以及 [HTML and XHTML Syntax](http://reference.sitepoint.com/html/html-xhtml-syntax).


## The Document Tree

## Document 树

A web page could be considered as a document tree that can contain any number of branches.There are rules as to what items each branch can contain (and these are detailed in each element’s reference in the “Contains” and “Contained by”sections). To understand the concept of a document tree, it’s useful to consider a simple web page with typical content features alongside its tree view, as shown in [Figure 1](https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/#page-structure__fig-doc-tree).

可以将web页面看做包含任意数量枝干的文档树。对于每个分支可以包含什么项，有一些规则(这些内容在每个元素的“包含”和“包含”部分中都有详细的说明)。要理解文档树的概念，可以考虑一个简单的web页面，其中包含典型的内容特性，以及它的树视图，如图1所示:


![Document Tree](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/04/1397707822DocTree-300x149.png)

Figure 1. The document tree of a simple web page


If we look at this comparison, we can see that the`html` element in fact contains two elements:`head` and `body`.`head` has two subbranches—a `meta`element and a `title`. The `body`element contains a number of headings, paragraphs, and a`block quote`.

可以看到, `html`元素实际上包含两个元素: `head` 和 `body`。 `head` 有两个子元素: 一个`meta`, 和一个`title`。`body` 元素包含很多 标题、段落和 `block quote`。

Note that there’s some symmetry in the way the tags are opened and closed. For example, the paragraph that reads, “It has lots of lovely content …” contains three text nodes, the second of which is wrapped in an `em` element (for emphasis). The paragraph is closed after the content has ended, and before the next element in the tree begins (in this case, it’s a`blockquote`); placing the closing `</p>` after the `blockquote` would break the tree’s structure.

注意，标签的打开和关闭有对称性。例如一个段落，“It has lots of lovely content …” 包含三个 text 节点，第二个节点被包装在 `em` 元素中(`em`是强调元素)。 内容结束后段落被关闭，并且在树的下一个元素开始之前(在本例中是一个 `blockquote`); 如果将 `</p>` 标签放到 `blockquote` 之后, 则会破坏树结构。


## `html` 元素


Immediately after the doctype comes the [`html`]()element—this is the root element of the document tree and everything that follows is a descendant of that root element.

在doctype之后紧着着出现了 [`html`] 元素，这是文档的根元素，接下来的所有内容都是根元素的后代。


If the root element exists within the context of a document that’s identified by its doctype as XHTML, then the `html`element also requires an `xmlns` (XML Namespace) attribute (this isn’t needed for HTML documents):

如果根元素(root element)存在于文档的上下文中，其文档类型为XHTML，那么 `html` 元素也需要指定 xmlns(XML名称空间)属性(html则不需要):


```
<html xmlns="http://www.w3.org/1999/xhtml">
```

Here’s an example of an XHTML transitional page:

下面是一个XHTML过渡页面的示例:


```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Page title</title></head>
<body></body>
</html>
```

The`html` element breaks the document into two mainsections: the [`head`]() and the [`body`]().


`html`元素将文档分为两个主要部分: [`head`]() 和 [`body`]()。


## `head` 元素

The `head` element contains metadata—information that describes the document itself, or associates it with related resources, such as scripts and style sheets.


`head` 元素包含描述文档本身的 metadata 信息，以及相关的资源，比如脚本和样式表。


The simple example below contains the compulsory [`title`]() element, which represents the document’s title or name—essentially, it identifies what this document is. The content inside the `title` may be used to provide a heading that appears in the browser’s title bar, and when the user saves the page as a favorite. It’s also a very important piece of information in terms of providing a meaningful summary of the page for the search engines, which display the `title`content in the search results. Here’s the `title` inaction:

下面的简单示例包含 [`title`]() 元素, 它表示文档的标题或名称，它标识该文档是什么。 `title` 的内容用于在浏览器标题栏中展示，或者是用户收藏夹中的名称。对于搜索引擎来说, 这也是一个非常重要的信息，因为这就是一段有意义的摘要，下面是一个示例:


```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Page title</title></head>
<body></body>
</html>
```

In addition to the`title` element, the `head` may also contain:

除了`title`元素,`head` 还可以包含:


- [`base`]()


  defines baseURLs for links or resources on the page, and target windows in which to open linked content

  定义了页面上的链接或资源的 baseURL, 打开链接内容所对应的基地址。


- [`link`]()


  refers to are source of some kind, most often to a style sheet that provides instructions about how to style the various elements on the webpage

  指向某种类型的资源, 通常是样式表, 它提供了如何展示网页上各种元素的说明。


- [`meta`]()


  provides additional information about the page; for example, which character encoding the page uses, a summary of the page’s content, instructions to search engines about whether or not to index content, and soon

  提供了额外的页面信息; 例如, 字符编码, 页面的内容摘要, 指示搜索引擎是否索引内容, 等等。


- [`object`]()


  represents a generic, multipurpose container for a media object

  代表一个通用的、多功能的媒体对象容器


- [`script`]()


  used either to embed or refer to an external script

  用于嵌入脚本, 或者引入外部脚本.


- [`style`]()


  provides an area for defining embedded (page-specific) CSS styles

  用于嵌入样式(页面级).


All of these elements are optional and can appear in any order within the `head`. Note that none of the elements listed here actually appear on the rendered page, but they are used to affect the content on the page, all of which is defined inside the`body` element.

这些元素都是可选的, 可以是任何顺序。注意, 这里的元素不会显示在页面内, 但他们可以用来影响页面上的内容, 这些内容在 `body` 元素内定义。




## `body` 元素

This is where the bulk of the page is contained. Everything that you can see in the browser window (or viewport) is contained inside this element, including paragraphs, lists, links, images, tables, and more. The [`body`]() element has some unique attributes of its own, all of which are now deprecated, but aside from that, there’s little to say about this element. How the page looks will depend entirely upon the content that you decide to fill it with; refer to the alphabetical listing of all HTML elements to ascertain what these contents might be.


页面中的大部分内容都在 body 内。在浏览器窗口(或viewport)中, 可以看到包含在这个元素中的所有内容，包括 paragraphs, lists, links, images, tables 等等。[`body`]()元素有一些独有的属性，现在这些属性都被弃用，除此之外，这个元素几乎没有什么可说的。 页面的外观将完全取决于填充的内容; 参考所有HTML元素的列表，以确定这些内容可以是什么。


原文链接: <https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/>

