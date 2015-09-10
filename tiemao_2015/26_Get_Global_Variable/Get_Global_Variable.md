如何检测 JavaScript 中的自定义全局变量
==

> 译者注: 全局变量的滥用是一种很糟糕的程序设计。很容易造成依赖和状态混乱。 而在 Java 和 JavaScript 这种自动垃圾回收的语言里面，全局(可见的)变量一直是内存泄露的隐藏杀手。

>  本文提供了一种靠谱的检测全局变量实现方式.

在 JavaScript中随意设置全局变量并不是个好习惯。原文作者参与了 MooTools 项目, 据他所说, 已经有十年时间天天听到与此相关的谈论。 MooTools 扩展了浏览器的原生JS对象, 但也使用了一些全局变量, 如 `Browser` 和 `$$`。我觉得 "全局变量太恐怖了!(原文 global vars are terrible)" , 有点无奈的是, jQuery 和 JavaScript loaders 都用了至少一个全局变量。


JavaScript globals are considered bad.  And as a contributor to the MooTools project, I've heard this on a daily basis for the better part of a decade.  MooTools got knocked for extending natives but also for placing objects in the global space, like `Browser` and `$$`.  I find the "global vars are terrible" philosophy a bit funny since even jQuery and JavaScript loaders use a global variable.


除了故意的全局变量, 否则将一个对象泄漏到全局空间其实是很糟糕的习惯实践, 一般就是烂代码才会这样做。那么怎么检测有哪些全局变量是我们自己放进去的呢? 明白了原理代码就很简单:


Intentional globals aside, leaking global variables is bad practice and a result of sloppy coding.  So how can we see what properties are custom within the global namespace?  It's easier than you think:

	
	// 创建一个新的  iframe, 然后将其 `contentWindow` 中的属性值
	// 与当前 window 中的属性值对比, 不在其中的就是自定义对象
	(function() {
		var iframe = document.createElement('iframe');
		iframe.onload = function() {
			// 使用 Object.keys() 获取对象的所有属性名 
			var iframeKeys = Object.keys(iframe.contentWindow);
			Object.keys(window).forEach(function(key) {
				// 如果存在 window 中,而 iframe 中却没有
				if(!(key in iframeKeys)) {
					// 输出到控制台,也可以加入数组,自己处理
					console && console.log && console.log(key);
				}
			});
		};
		iframe.src = 'about:blank';
		document.body.appendChild(iframe);
	})();


当然,因为是2个 window 对象,也是 2个不同的 document, 所以你会看到 `window`, `document`, `top`, 和 `location` 都被输出了。但其他的都是有意或无意地被 JavaScript 代码泄露到全局空间。

You will see some variables there that you know you didn't set, like `window`, `document`, `top`, and `location`, but the others will have been leaked (or intentional) globals set by custom JavaScript code!



原文链接: [Get Global Variables with JavaScript](http://davidwalsh.name/global-variables-javascript)

原文日期: 2015年08月31日

翻译日期: 2015年09月10日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
