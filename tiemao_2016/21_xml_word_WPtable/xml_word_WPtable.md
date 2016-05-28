# XML格式Word中的表格(Wordprocessing Tables)



## 格式(Structure)

A table consists of rows and cells and is structured much like an HTML table. It is defined with the `<w:tbl>` element.


Word(XML格式,OOXML)中的表格(table)由行(row)和单元格(cell) 组成, 与 HTML 中的 table 元素结构相似. 使用 `<w:tbl>` 元素来定义.


	<w:tbl>
		<w:tblPr>
			<w:tblStyle w:val="TableGrid"/>
			<w:tblW w:w="5000" w:type="pct"/>
		</w:tblPr>
		<w:tblGrid>
			<w:gridCol w:w="2880"/>
			<w:gridCol w:w="2880"/>
			<w:gridCol w:w="2880"/>
		</w:tblGrid>
		<w:tr>
			<w:tc>
				<w:tcPr>
					<w:tcW w:w="2880" w:type="dxa"/>
				</w:tcPr>
				<w:p>
					<w:r>
						<w:t>AAA</w:t>
					</w:r>
				</w:p>
			</w:tc>
			<w:tc>
				<w:tcPr>
					<w:tcW w:w="2880" w:type="dxa"/>
				</w:tcPr>
				<w:p>
					<w:r>
						<w:t>BBB</w:t>
					</w:r>
				</w:p>
			</w:tc>
			<w:tc>
				<w:tcPr>
					<w:tcW w:w="2880" w:type="dxa"/>
				</w:tcPr>
				<w:p>
					<w:r>
						<w:t>CCC</w:t>
					</w:r>
				</w:p>
			</w:tc>
		</w:tr>
		. . .
	</w:tbl>




> **Note**:  When two adjacent tables having the same style are present together without any intervening `<w:p>` elements, the tables are treated as a single table.

> **提示**:  如果两个相邻的 table, 样式相同,并且中间没有 `<w:p>` 元素间隔, 则被当作单个 table。


Reference:  ECMA-376, 3rd Edition (June, 2011), Fundamentals and Markup Language Reference § 17.4.38.



## Word 2007 的效果图如下:


![Table](wp-table-1.gif)



### 子元素(Element):

The `<w:tbl>` element can contain a whole host of elements, mostly related to tracking revisions and adding custom XML. The core elements are shown below.

`<w:tbl>` 可以包含各种元素, 主要是跟踪修改相关的,或者是自定义的XML。主要的核心元素如下所示。



<table  width="100%">
  <thead>
    <tr>
      <th>元素(Element)</th>
      <th>说明(Description)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <span >tblGrid</span>
      </td>
      <td>
        Specifies the columns for the table.  See Table
        <a href="WPtableGrid.php">Table Columns</a>.
        <div class="ECMAref">
          <span style="font-weight:bold">Reference:</span>  ECMA-376, 3rd Edition (June, 2011), Fundamentals and Markup Language Reference § 17.4.49.
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <span >tblGrid</span>
      </td>
      <td>
        指定表格的列.  详情请参考: 
        <a href="WPtableGrid.php">Table Columns</a>.
        <div class="ECMAref">
          <span style="font-weight:bold">规范参考:</span>  ECMA-376, 3rd Edition (June, 2011), Fundamentals and Markup Language Reference § 17.4.49.
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <span >tblPr</span>
      </td>
      <td>
        Specifies the table-wide properties for the table.  These properties can be overridden by individual table level exception, row, and cell-level properties.  See Table
        <a href="WPtableProperties.php">Table properties</a>.
        <div class="ECMAref">
          <span style="font-weight:bold">Reference:</span>  ECMA-376, 3rd Edition (June, 2011), Fundamentals and Markup Language Reference § 17.4.60.
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <span >tblPr</span>
      </td>
      <td>
        指定表格级别的默认属性(table-wide properties).  这些属性可以被各个子元素自己的属性覆盖(table, row, and cell-level properties).  详情请参考: 
        <a href="WPtableProperties.php">Table properties</a>.
        <div class="ECMAref">
          <span style="font-weight:bold">规范参考:</span>  ECMA-376, 3rd Edition (June, 2011), Fundamentals and Markup Language Reference § 17.4.60.
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <span >tr</span>
      </td>
      <td>
        Specifies a table row.  See Table
        <a href="WPtableRow.php">Table Row</a>.
        <div class="ECMAref">
          <span style="font-weight:bold">Reference:</span>  ECMA-376, 3rd Edition (June, 2011), Fundamentals and Markup Language Reference § 17.4.79.
        </div>
        <p></p>
      </td>
    </tr>
    <tr>
      <td>
        <span >tr</span>
      </td>
      <td>
        指定表格的列(row).  详情请参考: 
        <a href="WPtableRow.php">Table Row</a>.
        <div class="ECMAref">
          <span style="font-weight:bold">规范参考:</span>  ECMA-376, 3rd Edition (June, 2011), Fundamentals and Markup Language Reference § 17.4.79.
        </div>
        <p></p>
      </td>
    </tr>
  </tbody>
</table>


<br/>

> ### 相关的ODF(Open Document Format) 属性:


A table in the ODF format is specified with `<table:table>` element. A table consists of rows and columns. Rows are divided into cells, and columns are implied by taking all cells with the same position within the rows. A table can appear within a `<office:text>`, within a section, within a table cell, a header, or a footer, among others.

Reference: Open Document Format for Office Applications Version 1.2 (May, 2011) § 9.1.2.


	<table:table table:name="Table1" table:style-name="Table1">
	  <table:table-column table:style-name="Table1.A" table:number-columns-repeated="3"/>
	  <table:row>
	    <table:table-cell table:style-name="Table1.A1" office:value="string">
	      <text:p text:style-name="Table_20_Contents">AAA</text:p>
	    </table:table-cell>
	    <table:table-cell table:style-name="Table1.A1" office:value="string">
	      <text:p text:style-name="Table_20_Contents">BBB</text:p>
	    </table:table-cell>
	    <table:table-cell table:style-name="Table1.C1" office:value="string">
	      <text:p text:style-name="Table_20_Contents">CCC</text:p>
	    </table:table-cell>
	  <table:row>
	</table:table>


### Attributes:

The most commonly used attributes are below.


<table class="odfAttributes" width="100%">
  <thead>
    <tr>
      <th>Attributes</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <span class="attributeName">table:name</span>
      </td>
      <td>
        <p>指定唯一名字(unique name).</p>
      </td>
    </tr>
    <tr>
      <td>
        <span class="attributeName">table:style-name</span>
      </td>
      <td>
        <p>定义表格样式(table style).</p>
      </td>
    </tr>
    <tr>
      <td>
        <span class="attributeName">xml:id</span>
      </td>
      <td>
        <p>指定唯一ID,遵循W3C (xml-id)标准.</p>
      </td>
    </tr>
    <tr>
      <td>
        <span class="attributeName">table:protected</span>
      </td>
      <td>
        <p>
          指定 table 是否被保护, 如果被保护,则用户不能编辑. 可指定的值包括:
          <span class="attributeValue">true</span> 和
          <span class="attributeValue">false</span>.
        </p>
      </td>
    </tr>
  </tbody>
</table>



### Elements:

The most commonly used elements are below.


<table class="odfElements" width="100%">
  <thead>
    <tr>
      <th>Element</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>

    <tr>
      <td style="width:30%">
        <span class="elementName">&lt;table:table-column&gt;</span>
      </td>
      <td>Specifies properties for one or more adjacent columns.</td>
    </tr>
    <tr>
      <td style="width:30%">
        <span class="elementName">&lt;table:table-column-group&gt;</span>
      </td>
      <td>Groups adjacent columns</td>
    </tr>
    <tr>
      <td style="width:30%">
        <span class="elementName">&lt;table:table-columns&gt;</span>
      </td>
      <td>
        Contains groups of
        <span class="elementName">&lt;table:table-column&gt;</span> elements that don't repeat when a table spans pages.
      </td>
    </tr>
    <tr>
      <td style="width:30%">
        <span class="elementName">&lt;table:table-header-columns&gt;</span>
      </td>
      <td>Represents column headers.</td>
    </tr>
    <tr>
      <td style="width:30%">
        <span class="elementName">&lt;table:table-header-rows&gt;</span>
      </td>
      <td>Represents row headers.</td>
    </tr>
    <tr>
      <td style="width:30%">
        <span class="elementName">&lt;table:table-row&gt;</span>
      </td>
      <td>Represents a row.</td>
    </tr>
    <tr>
      <td style="width:30%">
        <span class="elementName">&lt;table:table-row-group&gt;</span>
      </td>
      <td>Groups adjacent rows that do not appear as table headers.</td>
    </tr>
    <tr>
      <td style="width:30%">
        <span class="elementName">&lt;table:table-rows&gt;</span>
      </td>
      <td>
        Contains groups of
        <span class="elementName">&lt;table:table-row&gt;</span> elements that don't repeat when a table spans pages.
      </td>
    </tr>
    <tr>
      <td style="width:30%">
        <span class="elementName">&lt;table:title&gt;</span>
      </td>
      <td>Specifies a title for the table.</td>
    </tr>
  </tbody>
</table>


## 对应的 HTML/CSS 属性为:


	<table style="width:100%;">
		<tr>
			<td>AAA</td>
			<td>BBB</td>
			<td>CCC</td>
		</tr>
		. . .
	</table>



### HTML/CSS 示例效果如下:


<table style="width:100%">
  <tbody>
    <tr>
      <td>AAA</td>
      <td>BBB</td>
      <td>CCC</td>
    </tr>
    <tr>
      <td>DDD</td>
      <td>EEE</td>
      <td>FFF</td>
    </tr>
    <tr>
      <td>GGG</td>
      <td>HHH</td>
      <td>III</td>
    </tr>
  </tbody>
</table>



原文链接: [http://officeopenxml.com/WPtable.php](http://officeopenxml.com/WPtable.php)

原文日期:  约 2012-05-01
