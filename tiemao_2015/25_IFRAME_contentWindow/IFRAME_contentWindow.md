IFRAME contentWindow is null
==


我钟爱简洁的代码, 一直在全力以赴清除不必要的 [JavaScript 全局变量](../26_Get_Global_Variable/Get_Global_Variable.md)。开始我认为 `keys(window)` 会使得 `window` 属性泄露, 但其实没有效果, 因为浏览器返回不同的结果, 所以我开始使用 IFRAME 而不再使用 默认的 window 属性 key。


I like clean code so I do what I can to avoid unwanted JavaScript [global variables](http://davidwalsh.name/global-variables-javascript).  I initially thought that `keys(window)` would give me `window` property leaks but that didn't work because browsers returned different results, so I moved on to using an `IFRAME` to compare default window property keys.



初次尝试时, 碰到了一个初级的错误:  `IFRAME` 元素的  `contentWindow` 属性是 `null`。当然,很简单就能搞定: 因为需要等到  `IFRAME`  加载完毕才能取到 `contentWindow`:


When I first tried this method, I got a lame error about an `IFRAME` element's `contentWindow` property being `null`.  Ugh.  It didn't take long to figure out why:  you need to wait until the `IFRAME` has loaded to get the `contentWindow`:


	var iframe = document.createElement('iframe');
	iframe.onload = function() {
		// 此时 contentWindow 可用!	
	};
	iframe.src = 'about:blank';


当然必须在 设置 `src` 属性之前添加 `onload` 事件。如果你会使用 `load` 事件来判断  `contentWindow` 属性, 那么你就是比较专业的程序员了!

Of course you'll want to add the `onload` event before setting the `src`.  If you use the `load` event to check for the `contentWindow` property, you'll be in business!



原文链接: [IFRAME contentWindow is null](http://davidwalsh.name/iframe-contentwindow-null)

原文日期: 2015年09月02日

翻译日期: 2015年09月10日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
