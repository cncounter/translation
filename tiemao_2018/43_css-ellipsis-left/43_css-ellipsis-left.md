# CSS Ellipsis Beginning of String

I was incredibly happy when CSS text-overflow: ellipsis (married with fixed width and overflow: hidden was introduced to the CSS spec and browsers; the feature allowed us to stop trying to marry JavaScript width calculation with string width calculation and truncation.  CSS ellipsis was also very friendly to accessibility.

The CSS `text-overflow: ellipsis` feature is great but is essentially meant to ellipsize strings only at the end; what if we want to ellipsize the beginning of a screen?  The use case is fairly reasonable: think displaying a file path -- many times the directory for a set of files is the same, in which case you'd want to display the end of the string, not the beginning.

Let me show you a trick for ellipsis at the begging of the string!

###The CSS

Showing an ellipsis at the front of a string is mostly the same as ellipsis at the end, only with one simple trick:

```
.ellipsize-left {
    /* 标准的CSS省略样式 */
    white-space: nowrap;                   
    overflow: hidden;
    text-overflow: ellipsis;  
    width: 200px;
    
    /* 让省略样式出现在文本的左边 */
    direction: rtl;
    text-align: left;
}
```

To add an ellipsis at the beginning of a string, use RTL and and `text-align` to clip the beginning of the string!

Playing RTL off of `text-align` is a genius way to get the desired effect of CSS ellipsis at the beginning of an element or string.  It would be great for the CSS spec to implement a more robust ellipsis system but, for now, I worship amazing CSS tricks like this!


在线Demo页面的地址为: <https://davidwalsh.name/demo/css-left-ellipsis.php>

从中可以看到,

相关的CSS代码如下:

```
<style type="text/css">
    .ellipsize-me {
        white-space: nowrap;                   
	/* 很显然,overflow的值不能是: visible */  
        overflow: hidden; 
        text-overflow: ellipsis;  
        direction: rtl;
        text-align: left;
        width: 200px;
        border: 1px solid #999;
        padding: 10px;
    }
</style>
```



HTML代码如下:

```
<p class="ellipsize-me">
    first &gt; second &gt; third<br>
    second &gt; third &gt; fourth &gt; fifth &gt; sixth<br>
    fifth &gt; sixth &gt; seventh &gt; eighth &gt; ninth
</p>
```

显示效果类似这样:


```
first > second > third
...ourth > fifth > sixth
...nth > eighth > ninth
```

其中的省略符(`...`)是不可选择的。

效果截图:

![#pic_center](43_01_ellipsis.png)






原文链接: <https://davidwalsh.name/css-ellipsis-left>

Demo地址: <https://davidwalsh.name/demo/css-left-ellipsis.php>


翻译人员: 铁锚 - <https://blog.csdn.net/renfufei>

翻译日期: 2018年12月21日

