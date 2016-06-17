# 禁止页面Body在后台滚动




One of my pet peeves with fixed or absolute positioned elements is the `<body>` scrolling while you scroll the the positioned element.  Have you ever tried scrolling a dialog and seeing the page scroll in the background?  Awful user experience, bordering on embarrassing.  Yikes.

我最讨厌的一种情况, 是在滚动弹出框的时候, 后台的 `<body>` 也跟着一起滚了。你可能也碰到过这种情况: 想滚动一下对话框, 却看到底层的页面也跟着一起滚动? 这真是种糟糕的用户体验, 很杯具、呵呵。


So what's the best way to prevent the `<body>`  scrolling in the background?  Pass on `scroll` events and `preventDefault` or `stopPropagation`, that wont work.  The easiest way is a simple CSS snippet:

那么怎样才算是比较好的处理方式?  监听 `scroll` 事件并且执行 `preventDefault` 和/或 `stopPropagation`, 但却没什么用。 最简单的方式是使用CSS:


	/* ...或者其他类名,如: body.dialogShowing */
	body.noScroll,html.noScroll { 
		overflow: hidden;
		height:100%;
	}



Preventing overflow on the entire `<body>`  assures scrolling on elements other than the desired fixed or absolute element wont happen.  It's an easy way to freeze the page for a hovered focus element.

对整个 `<body>` 禁止溢出, 可以保证只有获取焦点的元素会滚动, 其他的元素不会连带着滚动。这是一种简单却实用的方法, 当然,你需要JS代码来配合,动态的增加/移除`body`元素上相应的CSS类。


This trick has been used forever -- make sure you keep it in your toolbox!

这确实是个挺好的方式,建议将代码收藏备用!


本文最先发布于: [http://zcfy.cc/article/334](http://zcfy.cc/article/334)


原文链接: https://davidwalsh.name/prevent-body-scrolling


翻译日期: 2016年5月26日
