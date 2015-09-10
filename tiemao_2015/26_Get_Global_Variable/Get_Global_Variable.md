Get Global Variables with JavaScript
==

> Updated 9/1/2015: My original method, keys(window) gave unhelpful results in browsers other than Chrome. I've updated this post with a more reliable method.


JavaScript globals are considered bad.  And as a contributor to the MooTools project, I've heard this on a daily basis for the better part of a decade.  MooTools got knocked for extending natives but also for placing objects in the global space, like `Browser` and `$$`.  I find the "global vars are terrible" philosophy a bit funny since even jQuery and JavaScript loaders use a global variable.


Intentional globals aside, leaking global variables is bad practice and a result of sloppy coding.  So how can we see what properties are custom within the global namespace?  It's easier than you think:


	// UPDATE:  This method is too naive
	// Returns an array of window property names
	//keys(window);
	
	// Inject an iframe and compare its `contentWindow` properties to the global window properties
	(function() {
		var iframe = document.createElement('iframe');
		iframe.onload = function() {
			var iframeKeys = Object.keys(iframe.contentWindow);
			Object.keys(window).forEach(function(key) {
				if(!(key in iframeKeys)) {
					console.log(key);
				}
			});
		};
		iframe.src = 'about:blank';
		document.body.appendChild(iframe);
	})();


You will see some variables there that you know you didn't set, like `window`, `document`, `top`, and `location`, but the others will have been leaked (or intentional) globals set by custom JavaScript code!


原文链接: [Get HTML5 Video Duration](http://davidwalsh.name/html5-video-duration)

原文日期: 2015年03月10日

翻译日期: 2015年03月14日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
