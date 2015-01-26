JavaScript 复制内容到剪贴板
==

>译者注: ios明确不支持 Flash, android上的浏览器默认页不支持Flash, 而Chrome不支持纯JS的方式复制内容到剪贴板. 所以实现思路是检测Flash支持,如果支持则使用Flash方式,否则使用HTML5或者JS方式. 如果还不支持,那就没办法了,可能是浏览器太古老或者是很奇葩的浏览器,对其提供兼容简直是得不偿失. 如果浏览器中禁用了JavaScript脚本,则现代网站大多都不能进行良好的交互.

点一下按钮就将需要的内容拷贝到剪贴板,对于网站的易用性和用户的好评度都会有很大提升，特别是手机浏览器，触摸屏选择文本是很低效的一种操作。

## Flash 相关的部分

杯具的是 Flash 10 将API和处理方式都改变了,此时 [ZeroClipboard](https://github.com/zeroclipboard/zeroclipboard) 应运而生. ZeroClipboard库封装了一个Flash文件以及相应的JS代码,使得在浏览器中将内容拷贝到剪贴板变得简单易用.

项目首页: [http://zeroclipboard.org/](http://zeroclipboard.org/)

GitHub地址: [https://github.com/zeroclipboard/zeroclipboard](https://github.com/zeroclipboard/zeroclipboard)

在线示例: [http://davidwalsh.name/demo/zero-clipboard.php](http://davidwalsh.name/demo/zero-clipboard.php)

打开项目首页之后,就能看到下载链接: [https://github.com/zeroclipboard/zeroclipboard/archive/v2.2.0.zip](https://github.com/zeroclipboard/zeroclipboard/archive/v2.2.0.zip)

### HTML代码

	<script type="text/javascript" 
		src="ZeroClipboard.js"></script>
	<textarea name="box-content" 
		id="box-content" rows="5" cols="70"
		>铁锚的博客希望能尽量少灌一些水!
	</textarea>
	<br /><br />
	<p>
		<input type="button" id="copy" name="copy" 
			value="拷贝到剪贴板" />
	</p>

上面的HTML代码创建了一个ID为 "box-content" 的表单元素. 以及一个ID为 "copy" 的按钮. 这是与ZeroClipboard交互时需要的2个重要元素.

### 调用ZeroClipboard

	// 设置ZeroClipboard需要使用的Flash下载地址
	// 可以放在自己的网站内部,因为可能会部署到局域网测试
	ZeroClipboard.setMoviePath(
		'http://davidwalsh.name/demo/ZeroClipboard.swf');
	// 创建客户端对象
	var clip = new ZeroClipboard.Client();
	// 添加事件监听
	clip.addEventListener('mousedown',function() {
		clip.setText(document.getElementById('box-content').value);
	});
	clip.addEventListener('complete',function(client,text) {
		alert('拷贝成功! 你可以在其他地方粘贴测试:\n ' + text);
	});
	//粘附(glue)到对应ID的DOM元素
	clip.glue('copy');

上面使用 ZeroClipboard 的例子中我们执行了以下步骤:

- 设置 SWF 文件的下载地址.
- 创建一个ZeroClipboard的`client`: 在同一个页面中,client是一个单例对象, 可以关联到某个按钮,或者其他DOM元素上.
- 添加 mousedown 事件监听.设置要粘贴的内容
- 添加可选的complete事件监听. 用来通知拷贝完成信息,实际使用时可能只是显示提示信息,而不用alert.
- 将设置好的client粘附(glue)到对应ID的DOM元素

OK,很简单吧? ZeroClipboard 是基于Flash的跨浏览器解决方案,好用的拷贝大多是通过Flash来执行的.

ZeroClipboard 2.x 配置选项详解

	var globalConfig = {

	  // 指定SWF文件的URL，相对于当前页面。
	  // 其默认值指向与ZeroClipboard JS 文件同目录下的"ZeroClipboard.swf"文件
	  swfPath: _swfPath,

	  // SWF入内的脚本策略: 用于指定SWF应该信任的页面域名
	  // (单个字符串，字符串数组)
	  // 默认为当前域名
	  trustedDomains: window.location.host ? [window.location.host] : [],

	  // 是否阻止SWF文件缓存，默认为true
	  // 此时，将在SWF请求上添加一个"noCache"的查询参数后缀来阻止访问缓存内容
	  cacheBust: true,

	  // 启用功能花哨的"桌面"剪贴板，甚至在Linux上，它是众所周知的让人讨厌
	  forceEnhancedClipboard: false,

	  // 指定等待加载Flash SWF文件的毫秒数，超过该时间就假定Flash在用户浏览器上是未激活的
	  // 如果你不在意加载花费的时间，你可以将其设为null
	  flashLoadTimeout: 30000,

	  // 将其设为false，将允许用户调用ZeroClipboard.focus(...)来处理
	  // 而不是依赖于每个DOM元素的mouseover处理程序
	  autoActivate: true,

	  // 当Flash对象接收处理后，是否在JS中冒泡Flash模拟的对应事件。
	  // 例如，你点击进行复制之后，是否让Flash模拟一个click事件，以便于该元素去冒泡触发对应的JS事件
	  bubbleEvents: true,

	  // 设置放置Flash对象的div的ID属性
	  // 其值将会经过针对ID属性的HTML4 规范验证.
	  containerId: "global-zeroclipboard-html-bridge",

	  // 设置放置Flash对象的div的CSS类名
	  containerClass: "global-zeroclipboard-container",

	  // 设置Flash对象的div的ID属性和name属性
	  // 其值将会经过针对ID属性和name属性的HTML4 规范验证.
	  swfObjectId: "global-zeroclipboard-flash-bridge",

	  // 将鼠标滑过复制载体元素时使用的CSS类名
	  hoverClass: "zeroclipboard-is-hover",

	  // The class used to indicate that a clipped element is active (is being clicked).
	  activeClass: "zeroclipboard-is-active",



	  // 强制所有复制载体元素使用手形光标("cursor: pointer")
	  // 重要: 该配置的值可以被一个活动的嵌入SWF修改
	  forceHandCursor: false,

	  // 设置放置Flash对象的div的title属性，鼠标悬停时显示的提示文本
	  // 重要: 该配置的值可以被一个活动的嵌入SWF修改
	  title: null,

	  //Flash对象的 z-index CSS属性
	  // 最大值为(332位): 2147483647.
	  // 重要: 该配置的值可以被一个活动的嵌入SWF修改
	  zIndex: 999999999

	};


原文链接: [JavaScript Copy to Clipboard](http://davidwalsh.name/clipboard)

原文日期: 2009-10-19

翻译日期: 2015-01-18

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

