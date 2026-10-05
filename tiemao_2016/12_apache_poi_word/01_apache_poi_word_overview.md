# Apache POI Word 概览

Apache POI Word - Overview


Many a time, a software application is required to generate reference documents in Microsoft Word file format. Sometimes, an application is even expected to receive Word files as input data.

很多时候, 软件应用需要生成 Microsoft Word 文件格式的参考文档。有时, 应用甚至需要把 Word 文件作为输入数据来接收。

Any Java programmer who wants to produce MS-Office files as output must use a predefined and read-only API to do so.

任何想要输出 MS-Office 文件的 Java 程序员, 都必须使用一套预定义的只读 API 来实现。

What is Apache POI?

什么是 Apache POI?

Apache POI is a popular API that allows programmers to create, modify, and display MS-Office files using Java programs. It is an open source library developed and distributed by Apache Software Foundation to design or modify MS-Office files using Java program. It contains classes and methods to decode the user input data or a file into MS-Office documents.

Apache POI 是一套流行的 API, 允许程序员用 Java 程序创建、修改和显示 MS-Office 文件。它是由 Apache Software Foundation 开发和分发的开源库, 用于借助 Java 程序设计或修改 MS-Office 文件。它包含各种类和方法, 能把用户输入的数据或文件解码成 MS-Office 文档。

Components of Apache POI

Apache POI 的组件

Apache POI contains classes and methods to work on all OLE2 Compound documents of MS-Office. The list of components of this API is given below:

Apache POI 包含用于处理所有 MS-Office OLE2 复合文档(OLE2 Compound document)的类和方法。该 API 的组件列表如下:




POIFS (Poor Obfuscation Implementation File System) : This component is the basic factor of all other POI elements. It is used to read different files explicitly.

POIFS(Poor Obfuscation Implementation File System): 该组件是所有其他 POI 元素的基础。它用于显式地读取不同的文件。

HSSF (Horrible SpreadSheet Format) : It is used to read and write .xls format of MS-Excel files.

HSSF(Horrible SpreadSheet Format): 用于读写 MS-Excel 的 .xls 格式文件。

XSSF (XML SpreadSheet Format) : It is used for .xlsx file format of MS-Excel.

XSSF(XML SpreadSheet Format): 用于 MS-Excel 的 .xlsx 文件格式。

HPSF (Horrible Property Set Format) : It is used to extract property sets of the MS-Office files.

HPSF(Horrible Property Set Format): 用于提取 MS-Office 文件的属性集。

HWPF (Horrible Word Processor Format) : It is used to read and write .doc extension files of MS-Word.

HWPF(Horrible Word Processor Format): 用于读写 MS-Word 的 .doc 扩展名文件。

XWPF (XML Word Processor Format) : It is used to read and write .docx extension files of MS-Word.

XWPF(XML Word Processor Format): 用于读写 MS-Word 的 .docx 扩展名文件。

HSLF (Horrible Slide Layout Format) : It is used to read, create, and edit PowerPoint presentations.

HSLF(Horrible Slide Layout Format): 用于读取、创建和编辑 PowerPoint 演示文稿。

HDGF (Horrible DiaGram Format) : It contains classes and methods for MS-Visio binary files.

HDGF(Horrible DiaGram Format): 包含用于处理 MS-Visio 二进制文件的类和方法。

HPBF (Horrible PuBlisher Format) : It is used to read and write MS-Publisher files.

HPBF(Horrible PuBlisher Format): 用于读写 MS-Publisher 文件。


This tutorial guides you through the process of working on MS-Word files using Java. Therefore the discussion is confined to HWPF and XWPF components.

本教程将带你了解如何使用 Java 处理 MS-Word 文件。因此, 讨论范围仅限于 HWPF 和 XWPF 组件。


http://www.tutorialspoint.com/apache_poi_word/apache_poi_word_overview.htm
