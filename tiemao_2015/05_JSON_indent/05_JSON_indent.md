# 巧用`JSON.stringify()`生成漂亮格式的JSON字符串



使用JavaScript处理XML基本上就是一个杯具,这也是JSON在程序开发中广受欢迎的原因。我曾经写过一个 JavaScript函数来[将XML转换为JSON](http://davidwalsh.name/convert-xml-json),那种~duang~duang~的痛点简直是折腾得你欲死欲仙。如果要将现有的对象转换为JSON字符串, 则可以使用 `JSON.stringify(obj)`函数, 可能你已经用过这个函数(在IE6，IE7中不支持)。但可能你还不知道在转换时可以通过参数控制生成漂亮的JSON格式!

## 生成JSON数据

其实很简单，就是通过 `JSON.stringify` 函数的第三个参数来指定缩进的空格数:


```js
// 此处为了示例, 采用字面量的形式构造了一个对象
// 实际使用中, 一般是某个POJO,或者VO之类的值对象
var myObject = 	{
		"myProp": "myValue",
		"subObj": {
			"prop": "value"
		}
	};
// 格式化: 序列化: 对象转换为字符串
var formattedStr = JSON.stringify(myObject, null, 2);
// 2个空格; 等效;
var formattedStr2 = JSON.stringify(myObject, null, "  "); 
// 输出日志
console.log(formattedStr);
// console中执行, 拷贝到剪贴板
copy(formattedStr);

// 反序列化: 字符串转换为对象;
var obj2 = JSON.parse(formattedStr);
console.dir(obj2);
```

生成的字符串如下所示:

```json
{
	"myProp": "myValue",
	"subObj": {
	"prop": "value"
	}
}
```

## JSON文本排序比对


需求: 比对2个JSON消息
背景: 2个JSON的key顺序不一致

执行步骤:

1. 打开JSON排序页面: <https://www.bejson.com/json/jsonsort/>
2. 粘贴JSON, 选择升序, 复制右侧代码;
3. 打开并粘贴到JSON比对页面: <https://www.sojson.com/jsondiff.html>
4. 重复 1、2步骤, 将结果粘贴到步骤3的页面右侧中. 
5. 查看比对结果。





原文链接: [Indent JSON with JavaScript](http://davidwalsh.name/indent-json-javascript)

原文日期: 2015年03月02日

翻译日期: 2015年03月09日

翻译人员: 铁锚 [https://blog.csdn.net/renfufei/article/details/44156509](https://blog.csdn.net/renfufei/article/details/44156509)
