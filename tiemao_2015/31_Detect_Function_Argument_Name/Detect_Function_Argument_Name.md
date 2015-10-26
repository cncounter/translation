JavaScript: 取得 function 的所有参数名
==

在阅读 [promisify-node](https://github.com/nodegit/promisify-node) 源码的时候, 想看看作者是如何将基本的函数和对象转换为对应的 promised-based API 的。我很快意识到他们通过函数的签名来查找通用的回调参数名称, 如 `callback` 或者 `cb`。代码看起来有点古怪但确实很有效。【注: 新一代的JS框架大多采用这种探测策略,如 **AngularJS**】

我写了一个 JavaScrip t函数来解析函数的参数名称, 代码如下:


	
	function getArgs(func) {
	  // 先用正则匹配,取得符合参数模式的字符串.
	  // 第一个分组是这个:  ([^)]*) 非右括号的任意字符
	  var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
	 
	  // 用逗号来分隔参数(arguments string).
	  return args.split(",").map(function(arg) {
	    // 去除注释(inline comments)以及空格
	    return arg.replace(/\/\*.*\*\//, "").trim();
	  }).filter(function(arg) {
	    // 确保没有 undefined.
	    return arg;
	  });
	}


上面是检测的函数, 示例代码如下:


	function myCustomFn(arg1, arg2,arg3) {
	  // ...
	}
	
	// ["arg1", "arg2", "arg3"]
	console.log(getArgs(myCustomFn)); 


正则表达式(regular expression) 是个好东西吗?  别的我不知道, 但在适当的场景用起来还是很给力的!



















原文链接: [Detect Function Argument Names with JavaScript](http://davidwalsh.name/javascript-arguments)

原文日期: 2015年10月21日

翻译日期: 2015年10月26日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
