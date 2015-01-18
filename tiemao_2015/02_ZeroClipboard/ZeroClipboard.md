JavaScript 复制到剪贴板
==

译者注: ios明确不支持 Flash,android上的浏览器默认页不支持Flash, 而Chrome不支持纯JS的方式复制内容到剪贴板. 所以实现思路是检测Flash支持,如果支持则使用Flash方式,否则使用HTML5或者JS方式. 如果还不支持,那就没办法了,可能是浏览器太古老或者是很奇葩的浏览器,对其提供兼容其实是得不偿失的. 如果浏览器中禁用了JavaScript脚本,则现代网站大多都不能良好进行交互.

点一下按钮就将需要的内容拷贝到剪贴板,对于网站的易用性和用户的好评度都会有很大提升. 杯具的是 Flash 10 将API和处理方式都改变了,此时 [ZeroClipboard](http://code.google.com/p/zeroclipboard/) 应运而生. ZeroClipboard库封装了一个Flash文件以及相应的JS代码,使得在浏览器中将内容拷贝到剪贴板变得简单易用.


在线示例: [http://davidwalsh.name/demo/zero-clipboard.php](http://davidwalsh.name/demo/zero-clipboard.php)

##HTML部分

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

##调用ZeroClipboard

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




原文链接: [JavaScript Copy to Clipboard](http://davidwalsh.name/clipboard)

原文日期: 2009-10-19

翻译日期: 2015-01-18

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

