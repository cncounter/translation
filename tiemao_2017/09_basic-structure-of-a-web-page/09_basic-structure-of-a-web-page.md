# Basic Structure of a Web Page

# Web页面的基本结构


While this reference aims to provide a thorough breakdown of the various HTML elements and their respective attributes, you also need to understand how these items fit into the bigger picture. A web page is structured as follows.


本文简要介绍各种HTML元素及其各自的属性，但读者还需要与一个概念, 整个HTML都是由这些基本元素构建而成的。web页面的结构如下。



## The Doctype

## Doctype 声明

The first item to appear in the source code of a web page is the [doctype](https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/doctypes) declaration. This provides the web browser (or other user agent) with information about the type of markup language in which the page is written, which may or may not affect the way the browser renders the content. It may look a little scary at first glance, but the good news is that most WYSIWYG web editors will create the doctype for you automatically after you’ve selected from a dialog the type of document you’re creating. If you aren’t using a WYSIWYG web editing package, you can refer to the [list of doctypes contained in this reference](https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/doctypes) and copy the one you want to use.

The doctype looks like this (as seen in the context of a very simple HTML 4.01 page without any content):

```
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN""http://www.w3.org/TR/html4/strict.dtd"><html><head><title>Page title</title></head><body></body></html>
```

In the example above, the doctype relates to HTML 4.01 Strict. In this reference, you’ll see examples ofHTML 4.01 and also XHTfML 1.0 and 1.1, identified as such. While many of the elements and attributes may have the same names, there are some distinct syntactic differences between the various versions of HTML andXHTML. You can find out more about this in the sections entitled [HTML Versus XHTML](http://www.sitepoint.com/web-foundations/differences-html-xhtml/) and [HTML and XHTML Syntax](http://reference.sitepoint.com/html/html-xhtml-syntax).

## The Document Tree

## 文档树

A web page could be considered as a document tree that can contain any number of branches.There are rules as to what items each branch can contain (and these are detailed in each element’s reference in the “Contains” and “Contained by”sections). To understand the concept of a document tree, it’s useful to consider a simple web page with typical content features alongside its tree view, as shown in [Figure 1](https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/#page-structure__fig-doc-tree).


![Document Tree](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/04/1397707822DocTree-300x149.png)

Figure 1. The document tree of a simple web page

If we look at this comparison, we can see that the`html` element in fact contains two elements:`head` and `body`.`head` has two subbranches—a `meta`element and a `title`. The `body`element contains a number of headings, paragraphs, and a`block quote`.

Note that there’s some symmetry in the way the tags are opened and closed. For example, the paragraph that reads, “It has lots of lovely content …” contains three text nodes, the second of which is wrapped in an `em` element (for emphasis). The paragraph is closed after the content has ended, and before the next element in the tree begins (in this case, it’s a`blockquote`); placing the closing `</p>`after the `blockquote` would break the tree’s structure.

## `html` 元素


Immediately after the doctype comes the [`html`]()element—this is the root element of the document tree and everything that follows is a descendant of that root element.

If the root element exists within the context of a document that’s identified by its doctype as XHTML, then the `html`element also requires an `xmlns` (XML Namespace) attribute (this isn’t needed for HTML documents):

```
<html xmlns="http://www.w3.org/1999/xhtml">
```

Here’s an example of an XHTML transitional page:

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>Page title</title></head><body></body></html>
```

The`html` element breaks the document into two mainsections: the [`head`]() and the [`body`]().

## `head` 元素

The `head` element contains metadata—information that describes the document itself, or associates it with related resources, such as scripts and style sheets.

The simple example below contains the compulsory [`title`]() element, which represents the document’s title or name—essentially, it identifies what this document is. The content inside the `title` may be used to provide a heading that appears in the browser’s title bar, and when the user saves the page as a favorite. It’s also a very important piece of information in terms of providing a meaningful summary of the page for the search engines, which display the `title`content in the search results. Here’s the `title` inaction:

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>Page title</title></head><body></body></html>
```

In addition to the`title` element, the `head` may also contain:

- [`base`]()

  defines baseURLs for links or resources on the page, and target windows in which to open linked content

- [`link`]()

  refers to are source of some kind, most often to a style sheet that provides instructions about how to style the various elements on the webpage

- [`meta`]()

  provides additional information about the page; for example, which character encoding the page uses, a summary of the page’s content, instructions to search engines about whether or not to index content, and soon

- [`object`]()

  represents a generic, multipurpose container for a media object

- [`script`]()

  used either to embed or refer to an external script

- [`style`]()

  provides an area for defining embedded (page-specific) CSS styles

All of these elements are optional and can appear in any order within the `head`. Note that none of the elements listed here actually appear on the rendered page, but they are used to affect the content on the page, all of which is defined inside the`body` element.

## `body` 元素

This is where the bulk of the page is contained. Everything that you can see in the browser window (or viewport) is contained inside this element, including paragraphs, lists, links, images, tables, and more. The [`body`]() element has some unique attributes of its own, all of which are now deprecated, but aside from that, there’s little to say about this element. How the page looks will depend entirely upon the content that you decide to fill it with; refer to the alphabetical listing of all HTML elements to ascertain what these contents might be.



原文链接: [https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/](https://www.sitepoint.com/web-foundations/basic-structure-of-a-web-page/)

By [Ophelie Lechat](https://www.sitepoint.com/author/ophelie/) April 16, 2014

