# 跨域图片资源权限 - HTML | MDN


HTML 规范文档为 images 引入了 `[crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-crossorigin)` 属性, 通过设置适当的头信息 [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS) , 可以从其他站点加载 [`img`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) 图片, 并用在 canvas 中,就像从当前站点(current origin)直接下载的一样.

`crossorigin` 属性的使用细节, 请参考 [CORS settings attributes](https://developer.mozilla.org/en/HTML/CORS_settings_attributes).


## 什么是 "被污染的(tainted)" canvas?


尽管没有CORS授权也可以在 canvas 中使用图像, 但这样做就会污染(**taints**)画布。 只要 canvas 被污染, 就不能再从画布中提取数据, 也就是说不能再调用 `toBlob()`, `toDataURL()` 和 `getImageData()` 等方法, 否则会抛出安全错误(security error).


这实际上是为了保护用户的个人信息,避免未经许可就从远程web站点加载用户的图像信息,造成隐私泄漏。

> (译者注: 如果用户登陆过QQ等社交网站, **假若不做保护** ,则可能打开某个网站后,该网站利用 canvas 将用户的图片信息获取,上传,进而引发泄露.)


## 示例: 从其他站点保存图片

首先, 图片服务器必须设置相应的 `Access-Control-Allow-Origin` 响应头。添加 img 元素的 crossOrigin 属性来请求头。比如Apache服务器,可以拷贝 [HTML5 Boilerplate Apache server configs](https://github.com/h5bp/server-configs-apache/blob/fc379c45f52a09dd41279dbf4e60ae281110a5b0/src/.htaccess#L36-L53) 中的配置信息, 来进行回应:



	<IfModule mod_setenvif.c>
	    <IfModule mod_headers.c>
		<FilesMatch "\.(cur|gif|ico|jpe?g|png|svgz?|webp)$">
		    SetEnvIf Origin ":" IS_CORS
		    Header set Access-Control-Allow-Origin "*" env=IS_CORS
		</FilesMatch>
	    </IfModule>
	</IfModule> 



这些设置生效之后, 就可以像本站的资源一样, 保存其他站点的图片到 [DOM存储]((https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage)) 之中(或者其他地方)。


	var img = new Image,
	    canvas = document.createElement("canvas"),
	    ctx = canvas.getContext("2d"),
	    src = "http://example.com/image"; // 具体的图片地址
	
	img.crossOrigin = "Anonymous";
	
	img.onload = function() {
	    canvas.width = img.width;
	    canvas.height = img.height;
	    ctx.drawImage( img, 0, 0 );
	    localStorage.setItem( "savedImageData", 
		canvas.toDataURL("image/png") );
	}
	img.src = src;
	//  确保缓存的图片也触发 load 事件
	if ( img.complete || img.complete === undefined ) {
	    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
	    img.src = src;
	}


## 浏览器兼容性

### Desktop

<table border="1">
 <tbody>
  <tr>
   <th>Feature</th>
   <th>Chrome</th>
   <th>Firefox (Gecko)</th>
   <th>Internet Explorer</th>
   <th>Opera</th>
   <th>Safari</th>
  </tr>
  <tr>
   <td>Basic support</td>
   <td>13</td>
   <td>8</td>
   <td><span>No&nbsp;support</span></td>
   <td><span>No&nbsp;support</span></td>
   <td><span>?</span></td>
  </tr>
 </tbody>
</table>

### Mobile

<table border="1">
 <tbody>
  <tr>
   <th>Feature</th>
   <th>Android</th>
   <th>Firefox Mobile (Gecko)</th>
   <th>IE Mobile</th>
   <th>Opera Mobile</th>
   <th>Safari Mobile</th>
  </tr>
  <tr>
   <td>Basic support</td>
   <td><span>?</span></td>
   <td><span>?</span></td>
   <td><span>?</span></td>
   <td><span>?</span></td>
   <td><span>?</span></td>
  </tr>
 </tbody>
</table>



## 另请参见

*   [Chrome:在WebGL中使用跨域图片](http://blog.chromium.org/2011/07/using-cross-domain-images-in-webgl-and.html)

*   [HTML规范-`crossorigin`属性](http://whatwg.org/html#attr-img-crossorigin)


翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)


翻译日期: 2016年3月29日

原文日期: 2014年9月16日

原文链接: [https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)
