获取HTML5视频的时间长度
==

HTML5视频的Bigger体验是非常令人振奋的,很简单的道理，不用加载和依赖烦人的Flash或其他第三方插件来播放视频，也是大功一件。我们可以通过自定义控件对视频进行显示和操控,其中一个常见的需求是显示视频的时长(duration)。下面我们一起来看看如何获得并显示视频的持续时间!


## JavaScript 代码

`video` 元素有一个属性(property)叫做 `duration`,表示的是视频内容的时间长度,单位是秒。要比较好地显示视频的持续时间，我们需要使用到 `parseInt` 函数，以及取模运算(`%` , modulus )：


	//  假设"video" 是获取的视频节点对象
	var i = setInterval(function() {
		// 这里注意, 必须判断视频的 readyState。
		// 因为有可能没加载完，则获取到的视频时长信息是不正确的。
		if(video.readyState > 0) {
			// 计算,10进制，以及取模
			var minutes = parseInt(video.duration / 60, 10);
			var seconds = video.duration % 60;
	
			// (此处可以添加代码，将分钟，秒数显示到需要的地方)
			// ...
			// 执行到这里，就将循环定时器清除。
			clearInterval(i);
		}
	}, 200);









原文链接: [Get HTML5 Video Duration](http://davidwalsh.name/html5-video-duration)

原文日期: 2015年03月10日

翻译日期: 2015年03月14日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
