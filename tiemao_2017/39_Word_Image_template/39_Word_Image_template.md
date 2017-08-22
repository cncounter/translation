# Word-docx文件图片信息分析

本文为笔记、仅作参考。 前文为: [用FreeMarker生成Word文档](http://blog.csdn.net/renfufei/article/details/53283320)。

现在新需求来了，导出的Word文档中、需要包含图片。

大致的处理流程为:

1. 解析导出信息、将 `<img ... src="xxx" ...>` 抽取出来。 替换为 `[img[xxxIdInt]]`;
2. 替换 HTML 标签
3. 将 `[img[xxxIdInt]]` 格式的字符串、使用XML标签替换回去。 参考下面的代码段。
4. 下载 src 为 byte[];
5. 处理为对象;
6. 处理对应的 XML 文档,生成 String 和 byte[]
6. 替换 docx/zip 文件的某些 entry, 加上图片的 entry.

## 相关源代码


图片部分的XML大致如下:

```
public static String template_t_start = "</w:t></w:r><w:r>";
public static String template_t_end = "</w:r><w:r><w:t>";
public static String template_drawing 
  = "<w:drawing>" +
    "<wp:inline>" +
    "<wp:extent cx=\"{{imgWEMU}}\" cy=\"{{imgHEMU}}\"/>" +
    "<wp:docPr id=\"{{imgId}}\" name=\"图片 {{imgId}}\"/>" +
    "<a:graphic xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\">" +
    "<a:graphicData uri=\"http://schemas.openxmlformats.org/drawingml/2006/picture\">" +
    "<pic:pic xmlns:pic=\"http://schemas.openxmlformats.org/drawingml/2006/picture\">" +
    "<pic:nvPicPr>" +
    "<pic:cNvPr id=\"{{imgId}}\" name=\"Picture {{imgId}}\"/>" +
    "<pic:cNvPicPr/>" +
    "</pic:nvPicPr>" +
    "<pic:blipFill>" +
    "<a:blip r:embed=\"rId{{imgId}}\"></a:blip>" +
    "<a:stretch><a:fillRect/></a:stretch>" +
    "</pic:blipFill>" +
    "<pic:spPr bwMode=\"auto\">" +
    "<a:xfrm><a:ext cx=\"{{imgWEMU}}\" cy=\"{{imgHEMU}}\"/></a:xfrm>" +
    "<a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom>" +
    "<a:noFill/><a:ln><a:noFill/></a:ln>" +
    "</pic:spPr>" +
    "</pic:pic>" +
    "</a:graphicData>" +
    "</a:graphic>" +
    "</wp:inline>" +
    "</w:drawing>";

public static String imgTemplate = template_t_start + template_drawing + template_t_end;
```

如果文件版本不一致、请自己抽取 docx 文件中的相关文档来对比。


图片信息模型如下:

```
public class WordImagePropertyVO {
    public static int emuWeight = 9525; // emu全职; EMU = 像素*weight;

    private String imgId; // ID,如20,21,22
    private String relationshipId;
    private Integer width=0; // 图片的宽度
    private Integer height=0;// 图片的高度
    private Integer imgHEMU; // EMU = 像素*weight;
    private Integer imgWEMU;
    private String imgSrc;
    private byte[] imgByte;
    ...
}
```

ZipUtils 类增加了一些方法:

```
/**
 * 自定义的ZIP工具
 */
public class ZipUtils {
    /**
     * 替换ZIP中的部分条目
     * @param zipInputStream 输入zip流
     * @param zipOutputStream 写出zip流
     * @param replaceItems 替换列表
     */
    public static void replaceItems(ZipInputStream zipInputStream,
                                   ZipOutputStream zipOutputStream,
                                 Map<String, InputStream> replaceItems
    ) {
        if (null == zipInputStream || null == zipOutputStream) {
            return;
        }
        if (null == replaceItems) {
            replaceItems = new HashMap<>();
        }
        ZipEntry entryIn;
        try {
            // 1. 替换
            while ((entryIn = zipInputStream.getNextEntry()) != null) {
                String entryName = entryIn.getName();
                //
                boolean shouldReplaceItem = replaceItems.containsKey(entryName);
                InputStream targetItemInputStream = replaceItems.get(entryName);
                //
                if(shouldReplaceItem && null == targetItemInputStream){
                    continue;// 需要删除的item;
                }
                // 只使用 name
                ZipEntry entryOut = new ZipEntry(entryName);
                zipOutputStream.putNextEntry(entryOut);
                // 缓冲区
                byte[] buf = new byte[8 * 1024];
                int len;
                if (shouldReplaceItem) {
                    // 使用替换流
                    while ((len = (targetItemInputStream.read(buf))) > 0) {
                        zipOutputStream.write(buf, 0, len);
                    }
                } else {
                    // 输出普通Zip流
                    while ((len = (zipInputStream.read(buf))) > 0) {
                        zipOutputStream.write(buf, 0, len);
                    }
                }
                // 关闭此 entry
                zipOutputStream.closeEntry();
            }
            // 2. 添加 items
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
    // 添加 items
    public static void addItems(ZipInputStream zipInputStream,
                                    ZipOutputStream zipOutputStream,
                                    Map<String, InputStream> addItems
    ) {
        if (null == zipInputStream || null == zipOutputStream || null == addItems || addItems.isEmpty()) {
            return;
        }
        Set<String> itemKeys = addItems.keySet();
        // 2. 添加 items
        try {
            for(String entryName :itemKeys){
                //
                InputStream targetItemInputStream = addItems.get(entryName);
                //
                if(null == entryName || null == targetItemInputStream){
                    continue;
                }
                //
                ZipEntry entryOut = new ZipEntry(entryName);
                zipOutputStream.putNextEntry(entryOut);
                // 缓冲区
                byte[] buf = new byte[8 * 1024];
                int len;
                // 使用替换流
                while ((len = (targetItemInputStream.read(buf))) > 0) {
                    zipOutputStream.write(buf, 0, len);
                }
                // 关闭此 entry
                zipOutputStream.closeEntry();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```




## 1.  引入文件格式:

根据需要增加, 如 `png` 或 `jpeg`

> `[Content_Types].xml` 文件中需要增加以下内容:

```xml
<Default Extension="png" ContentType="image/png"/>
<Default Extension="jpeg" ContentType="image/jpeg"/>
```




## 2. `word/document.xml`引入命名空间:

此部分、可以将一个无图的docx、一个有图的docx、抽取相关xml文件格式化后对比得出。


```xml
<w:document 
            ......
            xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
            xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
            xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
            xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
            xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
            xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
            xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14"
            >
```



## 图片绘制元素`w:drawing`

```xml
<w:r>
    <w:drawing>
      ...
    </w:drawing>
</w:r>
```

Docx文件具体的API和参考文档请访问: <https://msdn.microsoft.com/en-us/library/documentformat.openxml.drawing.wordprocessing(v=office.14).aspx>



### `w:drawing`子元素: 内联

```xml
<w:drawing>
    <wp:inline distT="0" distB="0" distL="0" distR="0">
      ...
    </wp:inline>
</w:drawing>
```

其中 `distT` 之类的属性是距离上方Text的间距。(Distance From Text on Top Edge)



#### `wp:inline`子元素:

```xml
<wp:inline distT="0" distB="0" distL="0" distR="0">

<wp:extent cx="5274310" cy="3620117"/>
<wp:effectExtent l="0" t="0" r="2540" b="0"/>
<wp:docPr id="20" name="图片 20"/>
<wp:cNvGraphicFramePr>
    <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 noChangeAspect="1"/>
</wp:cNvGraphicFramePr>
  ......
</wp:inline>
```

其中:

- 必需元素:  `<wp:extent cx="5274310" cy="3620117"/>` 是图片的宽高= `像素值*9525`; 后面还有一个 `<a:ext cx="5274310" cy="3620117"/>` 与之对应。为什么是9525我也不知道, 参考<https://msdn.microsoft.com/en-us/library/ee342530(v=office.12).aspx>。 
- 非必需元素:  `<wp:effectExtent l="0" t="0" r="2540" b="0"/>`,估计是用于控制特效之类的扩展属性。
- 必需元素:  `<wp:docPr id="20" name="图片 20"/>` ; 应该是图片的文档属性, 其中ID互相之间不重复即可。
- 非必需元素:  `<wp:cNvGraphicFramePr>`; 不可见元素的属性。(Common DrawingML Non-Visual Properties)



#### `wp:inline`子元素`<a:graphic>`:

```xml
<wp:inline distT="0" distB="0" distL="0" distR="0">
  ......
   <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
     ...
   </a:graphic>
</wp:inline>
```



#### `a:graphic`单一子元素`<a:graphicData>`

```xml
<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
    <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
      ...
    </a:graphicData>
</a:graphic>
```



##### `<a:graphicData>` 子元素:

```xml
<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
    <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
      ...
    </pic:pic>
</a:graphicData>
```

##### `pic:pic`子元素列表:

```xml
<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
    <pic:nvPicPr>
        <pic:cNvPr id="20" name="Picture 20"/>
        <pic:cNvPicPr/>
    </pic:nvPicPr>
    <pic:blipFill>
      ...
    </pic:blipFill>
    <pic:spPr bwMode="auto">
      ...
    </pic:spPr>
</pic:pic>
```



###### 必需元素: `<pic:nvPicPr>`:

表示 **Non-Visual Picture Properties**:

- `<pic:nvPicPr>`。
  - `cNvPicPr ` 表示 (Non-Visual Picture Drawing Properties)
  - - 非必需元素 `a:picLocks`, 指定生成程序的行为等。
  - `cNvPr` 表示(Non-Visual Drawing Properties),是必需元素, 其中ID互相之间不重复即可



###### 必需元素: `<pic:blipFill>` :

Picture Fill, 如下所示:

```
<pic:blipFill>
  <a:blip r:embed="rId20">
  </a:blip>
  <a:srcRect/>
  <a:stretch>
    <a:fillRect/>
  </a:stretch>
</pic:blipFill>
```

其中, 重要元素是`<a:blip r:embed="rId20">`: 

- 重要属性: `embed` (Embedded Picture Reference),表示嵌入的图片引用。 
  - 引用关系处于文件: `word/_rels/document.xml.rels` 文件中.
- 重要子元素:`<a:stretch>` 控制缩放, `<a:fillRect/>` 表示填满?


- `<a:extLst>`扩展属性列表, BlipExtensionList, 可以忽略





###### 必需元素: `<pic:spPr>`：

Shape Properties.

```xml
<pic:spPr bwMode="auto">
    <a:xfrm>
        <a:off x="0" y="0"/>
        <a:ext cx="5274310" cy="3620117"/>
    </a:xfrm>
    <a:prstGeom prst="rect">
        <a:avLst/>
    </a:prstGeom>
    <a:noFill/>
    <a:ln>
        <a:noFill/>
    </a:ln>
</pic:spPr>
```

其中:

- `bwMode` 属性(Black and White Mode)
- `<a:xfrm>` - Transform2D, 属性。
  - `<a:off x="0" y="0"/>` 表示 Offset; 有默认值可忽略。
  - 重要属性: `<a:ext cx="5274310" cy="3620117"/>` 表示大小, 参考上文。




## 3. `word/_rels/document.xml.rels`文件中存在对应的 Rid

形如:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships
    xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    ....
    <Relationship Id="rId20" 
        Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"
        Target="media/image20.png"/>
    ...
</Relationships>
```

可以看到,  `rId20` 的关系。



## 4. 相关的media文件:

如 `word/media/image20.png`



注意事项:



- 不能有`&nbsp;` ?
























