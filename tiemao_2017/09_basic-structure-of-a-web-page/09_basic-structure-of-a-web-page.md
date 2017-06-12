# Basic Structure of a Web Page

# HTML页面基本结构


While this reference aims to provide a thorough breakdown of the various HTML elements and their respective attributes, you also need to understand how these items fit into the bigger picture. A web page is structured as follows.


本文简要介绍各种HTML元素与相关的属性，但读者还需要理解一个概念: 整个HTML都是由这些基本元素组合成的。HTML页面的结构如下。



## The Doctype

## Doctype 声明

The first item to appear in the source code of a web page is the [doctype](https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/doctypes) declaration. This provides the web browser (or other user agent) with information about the type of markup language in which the page is written, which may or may not affect the way the browser renders the content. It may look a little scary at first glance, but the good news is that most WYSIWYG web editors will create the doctype for you automatically after you’ve selected from a dialog the type of document you’re creating. If you aren’t using a WYSIWYG web editing package, you can refer to the [list of doctypes contained in this reference](https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/doctypes) and copy the one you want to use.

HTML页面的源代码中, 首先是 [doctype](https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/doctypes) 声明。 这告诉浏览器, 该页面是用何种标记语言编写的, 这可能会影响浏览器渲染内容的方式。看起来可能有点复杂，但好消息是，大部分所见即所得(WYSIWYG)的web编辑器自动为您创建了doctype。如果您没有使用WYSIWYG 编辑工具，那么您可以参考其他网页中包含的 doctype, 例如参考此网页中列出的 [doctype列表](https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/doctypes), 并复制您想要使用的文件类型。


The doctype looks like this (as seen in the context of a very simple HTML 4.01 page without any content):

doctype看起来是这样的(在一个非常简单的HTML 4.01页面中，没有任何内容):


```
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN""http://www.w3.org/TR/html4/strict.dtd"><html><head><title>Page title</title></head><body></body></html>
```

In the example above, the doctype relates to HTML 4.01 Strict. In this reference, you’ll see examples ofHTML 4.01 and also XHTfML 1.0 and 1.1, identified as such. While many of the elements and attributes may have the same names, there are some distinct syntactic differences between the various versions of HTML andXHTML. You can find out more about this in the sections entitled [HTML Versus XHTML](http://www.sitepoint.com/web-foundations/differences-html-xhtml/) and [HTML and XHTML Syntax](http://reference.sitepoint.com/html/html-xhtml-syntax).


在上面的例子中，doctype与HTML 4.01相关。在本文中，您将看到html 4.01和XHTfML 1.0和1.1的示例。虽然许多元素和属性可能具有相同的名称，但是在不同版本的HTML和xhtml之间存在一些明显的语法差异。您可以在标题为HTML和XHTML(http://www.sitepoint.com/web foundations/差异-HTML-xhtml/)以及HTML和XHTML语法(http://refer.sitepoint.com/html/HTML-XHTML语法)的章节中找到更多关于这方面的内容。


## The Document Tree

## 文档树

A web page could be considered as a document tree that can contain any number of branches.There are rules as to what items each branch can contain (and these are detailed in each element’s reference in the “Contains” and “Contained by”sections). To understand the concept of a document tree, it’s useful to consider a simple web page with typical content features alongside its tree view, as shown in [Figure 1](https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/#page-structure__fig-doc-tree).

可以将web页面视为可以包含任意数量分支的文档树。对于每个分支可以包含什么项，有一些规则(这些内容在每个元素的“包含”和“包含”部分中都有详细的说明)。要理解文档树的概念，可以考虑一个简单的web页面，其中包含典型的内容特性，以及它的树视图，如图1所示(https://www.sitepoint.com/web foundations/basic-web页面/页面结构图-doc-doctree)。


![Document Tree](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/04/1397707822DocTree-300x149.png)

Figure 1. The document tree of a simple web page

If we look at this comparison, we can see that the`html` element in fact contains two elements:`head` and `body`.`head` has two subbranches—a `meta`element and a `title`. The `body`element contains a number of headings, paragraphs, and a`block quote`.

Note that there’s some symmetry in the way the tags are opened and closed. For example, the paragraph that reads, “It has lots of lovely content …” contains three text nodes, the second of which is wrapped in an `em` element (for emphasis). The paragraph is closed after the content has ended, and before the next element in the tree begins (in this case, it’s a`blockquote`); placing the closing `</p>`after the `blockquote` would break the tree’s structure.

如果我们看一下这个比较，我们可以看到html元素实际上包含两个元素:head和body。head有两个子分支——一个元元素和一个标题。body元素包含大量的标题、段落和块引用。

注意，标签被打开和关闭的方式有一些对称性。例如，“它有很多可爱的内容……”的段落包含三个文本节点，第二个节点被包装在em元素中(为了强调这一点)。段落在内容结束后关闭，并且在树的下一个元素开始之前(在本例中是一个blockquote);在块引号结束后，关闭该段将会破坏树的结构。


## `html` 元素


Immediately after the doctype comes the [`html`]()element—this is the root element of the document tree and everything that follows is a descendant of that root element.

If the root element exists within the context of a document that’s identified by its doctype as XHTML, then the `html`element also requires an `xmlns` (XML Namespace) attribute (this isn’t needed for HTML documents):

在doctype出现了html()元素之后，这是文档树的根元素，接下来的所有内容都是根元素的后代。

如果根元素存在于文档的上下文中，其文档类型为XHTML，那么html元素也需要一个xmlns(XML名称空间)属性(这对于html文档不需要):


```
<html xmlns="http://www.w3.org/1999/xhtml">
```

Here’s an example of an XHTML transitional page:

下面是一个XHTML过渡页面的示例:


```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>Page title</title></head><body></body></html>
```

The`html` element breaks the document into two mainsections: the [`head`]() and the [`body`]().


html元素将文档分为两个主要部分:head()和body()。


## `head` 元素

The `head` element contains metadata—information that describes the document itself, or associates it with related resources, such as scripts and style sheets.

The simple example below contains the compulsory [`title`]() element, which represents the document’s title or name—essentially, it identifies what this document is. The content inside the `title` may be used to provide a heading that appears in the browser’s title bar, and when the user saves the page as a favorite. It’s also a very important piece of information in terms of providing a meaningful summary of the page for the search engines, which display the `title`content in the search results. Here’s the `title` inaction:


head元素包含描述文档本身的元数据信息，或者将其与相关的资源关联起来，比如脚本和样式表。

下面的简单示例包含强制title()元素，它表示文档的标题或名称，它标识该文档是什么。标题内的内容可用于提供在浏览器标题栏中出现的标题，以及用户将页面保存为最受欢迎的页面。它也是一个非常重要的信息，它为搜索引擎提供了一个有意义的摘要，在搜索结果中显示标题内容。这里的“标题”不作为:


```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>Page title</title></head><body></body></html>
```

In addition to the`title` element, the `head` may also contain:

除了`title`元素,`head`也可能包含:


- [`base`]()

- (`base`)()



  defines baseURLs for links or resources on the page, and target windows in which to open linked content

定义了页面上的链接或资源,baseurl和目标窗口中打开链接内容


- [`link`]()

- (`link`)()



  refers to are source of some kind, most often to a style sheet that provides instructions about how to style the various elements on the webpage

指的是某种类型的来源,通常一个样式表,它提供说明如何风格网页上的各种元素


- [`meta`]()

- (`meta`)()



  provides additional information about the page; for example, which character encoding the page uses, a summary of the page’s content, instructions to search engines about whether or not to index content, and soon

提供了额外的信息页面;例如,字符编码页面使用的页面的内容的摘要,指示搜索引擎是否索引内容,而且很快


- [`object`]()

- (`object`)()



  represents a generic, multipurpose container for a media object

代表了一个通用的、多功能媒体对象的容器


- [`script`]()

- (`script`)()



  used either to embed or refer to an external script

embed to构件所用的外在一年黄金列脚本


- [`style`]()

- (`style`)()



  provides an area for defining embedded (page-specific) CSS styles

提供了一个区域定义嵌入式CSS样式(特殊页面)


All of these elements are optional and can appear in any order within the `head`. Note that none of the elements listed here actually appear on the rendered page, but they are used to affect the content on the page, all of which is defined inside the`body` element.

所有这些元素都是可选的,可以出现在任何顺序`head`。注意,这里没有列出的元素实际上页面上呈现的,但他们是用来影响页面上的内容,这些都是内部定义的`body`元素。




## `body` 元素

This is where the bulk of the page is contained. Everything that you can see in the browser window (or viewport) is contained inside this element, including paragraphs, lists, links, images, tables, and more. The [`body`]() element has some unique attributes of its own, all of which are now deprecated, but aside from that, there’s little to say about this element. How the page looks will depend entirely upon the content that you decide to fill it with; refer to the alphabetical listing of all HTML elements to ascertain what these contents might be.


这就是页面的大部分内容所在。在浏览器窗口(或viewport)中可以看到的所有内容都包含在这个元素中，包括段落、列表、链接、图像、表等等。body()元素有其自身的一些独特属性，所有这些属性现在都已被弃用，但除此之外，这个元素几乎没有什么可说的。页面的外观将完全取决于您决定填充它的内容;参考所有HTML元素的字母列表，以确定这些内容可能是什么。


原文链接: [https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/](https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/)

By [Ophelie Lechat](https://www.sitepoint.com/author/ophelie/) April 16, 2014

