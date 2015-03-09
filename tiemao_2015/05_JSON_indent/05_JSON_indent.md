巧用`JSON.stringify()`生成漂亮格式的JSON字符串
==


使用JavaScript处理XML基本上就是一个杯具,这也是JSON在程序开发中广受欢迎的原因。我曾经写过一个 JavaScript函数来[将XML转换为JSON](http://davidwalsh.name/convert-xml-json),那种~duang~duang~的痛点简直是折腾得你欲死欲仙。如果要将现有的对象转换为JSON字符串, 则可以使用 `JSON.stringify(obj)`函数, 可能你已经用过这个函数(在IE6，IE7中不支持)。但可能你还不知道在转换时可以通过参数控制生成漂亮的JSON格式!


其实很简单，就是通过 `JSON.stringify` 函数的第三个参数来指定缩进的空格数:


	// 此处为了示例, 采用字面量的形式构造了一个对象
	// 实际使用中, 一般是某个POJO,或者VO之类的值对象
	var myObject = 	{
			"myProp": "myValue",
			"subObj": {
				"prop": "value"
			}
		};
	// 格式化
	var formattedStr = JSON.stringify(myObject, null, 2);

生成的字符串如下所示:

	{
	  "myProp": "myValue",
	  "subObj": {
	    "prop": "value"
	  }
	}


原文链接: [Indent JSON with JavaScript](http://davidwalsh.name/indent-json-javascript)

原文日期: 2015年03月02日

翻译日期: 2015年03月09日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
