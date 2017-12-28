## Organizing information with tables

## MarkDown表格语法及示例

> 说明: Markdown解析器一般都支持 HTML 标签的方式, 如 '<table>', 只需要在前后间隔一个空行即可。

You can build tables to organize information in comments, issues, pull requests, and wikis.

在Github上, comment(注释/评论), issue(问题反馈), pull request(代码推送请求), 以及 wiki(项目知识库) 都支持 Markdown语法, 当然也包括表格(table);

### Creating a table

### 创建表格的语法

You can create tables with pipes `|` and hyphens `-`. Hyphens are used to create each column's header, while pipes separate each column. You must include a blank line before your table in order for it to correctly render.

在Markdown中我们使用管道符号(`|`, pipe, 竖线)以及短横线(`-`, hyphen, 减号) 来创建表格。 竖线(`|`)用于分隔各个列, 短横线的上一行会解析为表头(column's header, 字体加粗, `<th>`)。

要让表格生效, 需要在前后都有空行间隔。

```
| 表头第一列    | 表头第一列    |
| ------------- | ------------- |
| 第一行第一列  | 第1行第2列    |
| 第2行第一列   | 第二行第2列   |

```

![Rendered table](https://help.github.com/assets/images/help/writing/table-basic-rendered.png)

The pipes on either end of the table are optional.

每一行最末尾的竖线是可选的, 可有可无, 有的话可能源码格式更整齐和美观。

Cells can vary in width and do not need to be perfectly aligned within columns. There must be at least three hyphens in each column of the header row.

在 MarkDown 级别, 每个单元格(Cell)并不需要对齐, 当然对齐的话看起来可能会漂亮一些。 要定义表头, 至少需要3条短横线才行。

```
| 命令 | 说明 |
| --- | --- |
| git status | 列出所有新增或修改过的文件  |
| git diff | 显示未被贮存(staged)的文件差异|

```

![Rendered table with varied cell width](https://help.github.com/assets/images/help/writing/table-varied-columns-rendered.png)

### Formatting content within your table

### 表格内容支持的各种格式

You can use [formatting](https://help.github.com/articles/basic-writing-and-formatting-syntax) such as links, inline code blocks, and text styling within your table:

支持各种常见的 [MarkDown样式](https://help.github.com/articles/basic-writing-and-formatting-syntax), 如超链接(link), 行内代码块(inline code block), 以及其他文本样式。


```
| 命令 | 说明 |
| --- | --- |
| `git status` | 列出所有 *新增或修改过* 的文件 |
| `git diff` | 显示 **未被** 贮存(staged)的文件差异 |

```

![Rendered table with formatted text](https://help.github.com/assets/images/help/writing/table-inline-formatting-rendered.png)

You can align text to the left, right, or center of a column by including colons `:` to the left, right, or on both sides of the hyphens within the header row.

可以使用英文冒号(`:`, colon)来指定单元格的对齐方式。 放在横线左边就是左对齐(`:---`), 放在横线右边就是右对齐(`---:`), 两边都放就是居中对齐(`:---:`), 如下所示:

```
| 向左对齐   |    居中对齐 |    向右对齐 |
| :---       |     :---:   |        ---: |
| git status | git status  | git status  |
| git diff   | git diff    | git diff    |

```

![Rendered table with left, center, and right text alignment](https://help.github.com/assets/images/help/writing/table-aligned-text-rendered.png)

To include a pipe `|` as content within your cell, use a `\` before the pipe:

如果在表格内容里要展示竖线(`|`), 那么需要使用反斜杠 `\|` 来进行转义。

```
| Name     | Character |
| ---      | ---       |
| Backtick | `         |
| Pipe     | \|        |
```

![Rendered table with an escaped pipe](https://help.github.com/assets/images/help/writing/table-escaped-character-rendered.png)

### Further reading

### 相关链接

- "[MarkDown语法格式基础](https://help.github.com/articles/basic-writing-and-formatting-syntax)"






原文链接: <https://help.github.com/articles/organizing-information-with-tables/>

翻译日期: 2017-12-28

翻译人员: [铁锚 http://blog.csdn.net/renfufei/](http://blog.csdn.net/renfufei/)

