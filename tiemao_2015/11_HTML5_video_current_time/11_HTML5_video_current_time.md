# 获取并设置HTML5 Video的当前进度


上周翻译了一篇文章: [如何获取HTML5视频的持续时间](http://blog.csdn.net/renfufei/article/details/44260695)。很显然这是一门简单却很实用的技术, 但我认为还有一个更重要的知识点是控制视频的时间设置。在用HTML5技术处理视频时,设置(setting)和获取(getting)时间都是很有用的,那就让我们一起来看看如何达成这个 目标吧！



在管理视频状态时，最重要的是要了解 `currentTime` 是个什么鬼。你可以通过这个属性获取当前播放到了哪个时间点:


	// https://www.youtube.com/watch?v=Cwkej79U3ek
	console.log(video.currentTime);  // 25.431747


`currentTime` 既是 getter 又是 setter 属性, 所以可以直接设置 `currentTime` 值来控制播放进度:

	video.currentTime = 0; // Restart


API 接口很容易理解,而且是自解释的(self-explanatory)。你仍然需要处理“second”来指定时间,包括内在实际的和外在显示的(both inward and outward),但是秒(second)这个单位和你预期的一样公平,所以说这个API设计是非常巧妙的。


示例可以参考 [小米空气净化器的演示页面: http://www.mi.com/air/](http://www.mi.com/air/)  


	<video id="videoIntro" class="video" 
		data-video-name="intro" 
		poster="http://c1.mifile.cn/f/i/2014/cn/goods/air/overall/video-main-poster.jpg"
		style="height: 600px; width: 800px; display: none;">
            <source type="video/mp4" 
		src="http://c1.mifile.cn/f/i/2014/cn/goods/air/overall/video-intro.mp4?2014120901">
            <source type="video/webm"
		src="http://c1.mifile.cn/f/i/2014/cn/goods/air/overall/video-intro.webm?2014120901">
	</video>

此外，苹果官网的演示也采用这样的控制模式。

原文链接: [http://davidwalsh.name/html5-video-current-time](http://davidwalsh.name/html5-video-current-time)


原文日期: 2015年03月16日

翻译日期: 2015年03月21日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)