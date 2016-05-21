# fetch简介:  未来的Ajax API


One of the worst kept secrets about AJAX on the web is that the underlying API for it, XMLHttpRequest, wasn't really made for what we've been using it for.  We've done well to create elegant APIs around XHR but we know we can do better.  Our effort to do better is the fetch API.  Let's have a basic look at the new window.fetch method, available now in Firefox and Chrome Canary.

AJAX最恶心的事情莫过于丑陋的底层API了.  **XMLHttpRequest** 的设计并非是为如今的使用方式而考虑的. 虽然各种框架对 **XHR** 的封装已足够好用, 但我们还可以做得更好。更好的方式是使用 `fetch` API。下面简单介绍下 `window.fetch` 方法, 在最新版的 Firefox 和 Chrome 中已经可以使用了。


## XMLHttpRequest

XHR is a bit overcomplicated in my opinion, and don't get me started on why "XML" is uppercase but "Http" is camel-cased.  Anyways, this is how you use XHR now:

[XHR](https://davidwalsh.name/xmlhttprequest) 在我看来有点复杂, 别让我解释为什么“XML”是大写,而“Http”是“骆峰式”写法。不管怎样, 使用XHR的方式大致如下:


	// 获取 XHR 非常混乱!
	if (window.XMLHttpRequest) { // Mozilla, Safari, ...
	  request = new XMLHttpRequest();
	} else if (window.ActiveXObject) { // IE
	  try {
	    request = new ActiveXObject('Msxml2.XMLHTTP');
	  } 
	  catch (e) {
	    try {
	      request = new ActiveXObject('Microsoft.XMLHTTP');
	    } 
	    catch (e) {}
	  }
	}
	
	// 打开连接, 发送数据.
	request.open('GET', 'https://davidwalsh.name/ajax-endpoint', true);
	request.send(null);


Of course our JavaScript frameworks make XHR more pleasant to work with, but what you see above is a simple example of the XHR mess.

当然JavaScript框架使得操作XHR也很方便,但你在上面看到的是一个XHR混乱的简单例子。



##  `fetch` 的基本使用

A fetch function is now provided in the global window scope, with the first argument being the URL:

`fetch` 函数是全局量 `window` 的一个方法, 第一个参数是URL:


	// url (必须), options (可选)
	fetch('/some/url', {
		method: 'get'
	}).then(function(response) {
		
	}).catch(function(err) {
		// 出错了;等价于 then 的第二个参数,但这样更直观 :(
	});


Much like the updated [Battery API](https://davidwalsh.name/javascript-battery-api), the fetch API uses JavaScript Promises to handle results/callbacks:

和[Battery API](https://davidwalsh.name/javascript-battery-api) 一样, fetch API 也使用了 [JavaScript Promises](https://davidwalsh.name/promises) 来处理结果/回调:


	// 对响应的简单处理
	fetch('/some/url').then(function(response) {
		
	}).catch(function(err) {
		// 出错了;等价于 then 的第二个参数,但这样更直观 :(
	});
	
	// 链式处理,将异步变为类似单线程的写法: 高级用法.
	fetch('/some/url').then(function(response) {
		return //... 执行成功, 第1步...
	}).then(function(returnedValue) {
		// ... 执行成功, 第2步...
	}).catch(function(err) {
		// 中途任何地方出错...在此处理 :( 
	});


If you aren't used to then yet, get used to it -- it will soon be everywhere.

如果你还不习惯这种 `then` 方式的写法,那最好学习一下,因为很快就会全面流行。



## 请求头(Request Headers)


The ability to set request headers is important in request flexibility. You can work with request headers by executing new Headers():

允许自己设置请求头极大地增强了请求的灵活性。可以通过 `new Headers()` 来处理请求头:


	// 创建一个空的 Headers 对象,注意是Headers，不是Header
	var headers = new Headers();
	
	// 添加(append)请求头信息
	headers.append('Content-Type', 'text/plain');
	headers.append('X-My-Custom-Header', 'CustomValue');
	
	// 判断(has), 获取(get), 以及修改(set)请求头的值
	headers.has('Content-Type'); // true
	headers.get('Content-Type'); // "text/plain"
	headers.set('Content-Type', 'application/json');
	
	// 删除某条请求头信息(a header)
	headers.delete('X-My-Custom-Header');
	
	// 创建对象时设置初始化信息
	var headers = new Headers({
		'Content-Type': 'text/plain',
		'X-My-Custom-Header': 'CustomValue'
	});


You can use the append, has, get, set, and delete methods to modify request headers. To use request headers, create a Request instance :

可以使用 **append**, **has**, **get**, **set**, 以及 **delete** 方法来修改请求头。使用请求头需要创建一个 `Request `  对象:


	var request = new Request('/some-url', {
		headers: new Headers({
			'Content-Type': 'text/plain'
		})
	});
	
	fetch(request).then(function() { /* handle response */ });


Let's have a look at what Response and Request do!

下面介绍 `Response` 和`Request` 怎么使用!



## Request 简介


A Request instance represents the request piece of a fetch call. By passing fetch a Request you can make advanced and customized requests:

Request 对象表示一次 fetch 调用的请求信息。通过 Request  参数调用 fetch, 可以执行高级的自定义请求:




* `method` - 支持 `GET`, `POST`, `PUT`, `DELETE`, `HEAD`
* `url` - 请求的 URL
* `headers` - 对应的 `Headers` 对象
* `referrer` - 请求的 referrer 信息
* `mode` - 可以设置 `cors`, `no-cors`, `same-origin`
* `credentials` - 设置 cookies 是否随请求一起发送。可以设置: `omit`, `same-origin`
* `redirect` - `follow`, `error`, `manual`
* `integrity` - subresource integrity value
* `cache` - 设置 cache 模式 (`default`, `reload`, `no-cache`)




A sample Request usage may look like:

`Request` 的示例如下:


	var request = new Request('/users.json', {
		method: 'POST', 
		mode: 'cors', 
		redirect: 'follow',
		headers: new Headers({
			'Content-Type': 'text/plain'
		})
	});
	
	// 使用!
	fetch(request).then(function() { /* handle response */ });



Only the first parameter, the URL, is required. Each property becomes read only once the Request instance has been created. Also important to note that Request has a clone method which is important when using fetch within the Service Worker API -- a Request is a stream and thus must be cloned when passing to another fetch call.

只有第一个参数 URL 是必需的。只要 `Request`  对象创建完成, 那么所有属性都变成只读属性. 也请注意, `Request` 有一个很重要的 `clone ` 方法, 特别是在 Service Worker API 中使用时 —— 一个 Request 就是一个流(stream), 因此如果要传递给另一个 `fetch` 方法,则需要进行克隆。


The fetch signature, however, acts like Request so you could also do:

`fetch` 的方法签名(signature,可理解为参数配置), 和 `Request` 很像, 示例如下:


	fetch('/users.json', {
		method: 'POST', 
		mode: 'cors', 
		redirect: 'follow',
		headers: new Headers({
			'Content-Type': 'text/plain'
		})
	}).then(function() { /* handle response */ });



You'll likely only use Request instances within Service Workers since the Request and fetch signatures can be the same. ServiceWorker post coming soon!

因为 Request and fetch 的签名一致, 所以在 Service Workers 中, 你可能会更喜欢使用 Request 实例。关于 ServiceWorker 的相关博客请等待后续更新!



##Response 简介


The fetch's then method is provided a Response instance but you can also manually create Response objects yourself -- another situation you may encounter when using service workers. With a Response you can configure:

**Response** 代表响应, **fetch** 的 `then` 方法提供了一个 `Response` 实例, 但你也可以手动创建 `Response` 对象 —— 比如在 service workers 中可能会用到. **Response** 可以配置的参数包括:

* `type` - 类型,支持: `basic`, `cors`
* `url`
* `useFinalURL` - Boolean 值, 代表 `url` 是否是最终 URL
* `status` - 状态码 (例如: `200`, `404`, 等等)
* `ok` - Boolean值,代表成功响应(status 值在 200-299 之间)
* `statusText` - 状态值(例如: `OK`)
* `headers` - 与响应相关联的 Headers 对象.




	// 在 service worker 测试中手动创建 response
	// new Response(BODY, OPTIONS)
	var response = new Response('.....', {
		ok: false,
		status: 404,
		url: '/'
	});
	
	// fetch 的 `then` 会传入一个 Response 对象
	fetch('/')
		.then(function(responseObj) {
			console.log('status: ', responseObj.status);
		});



The Response also provides the following methods:

`Response`  提供的方法如下:


* `clone()` -  创建一个新的 Response 克隆对象.
* `error()` - 返回一个新的,与网络错误相关的 Response 对象.
* `redirect()` - 重定向,使用新的 URL 创建新的 response 对象..
* `arrayBuffer()` - Returns a promise that resolves with an ArrayBuffer.
* `blob()` - 返回一个 promise,   resolves 是一个 Blob.
* `formData()` - 返回一个 promise,   resolves 是一个 FormData 对象.
* `json()` - 返回一个 promise,   resolves 是一个 JSON 对象.
* `text()` - 返回一个 promise,   resolves 是一个 USVString (text).





## Handling JSON

## 处理 JSON


Let's say you make a request for JSON -- the resulting callback data has a json method for converting the raw data to a JavaScript object:

假设需要请求 JSON —— 结果的回调数据中有一个`json`方法,用来将原始数据转换成一个 JavaScript 对象:


	fetch('https://davidwalsh.name/demo/arsenal.json').then(function(response) { 
		// Convert to JSON
		return response.json();
	}).then(function(j) {
		// Yay, `j` is a JavaScript object
		console.log(j); 
	});


Of course that's a simple JSON.parse(jsonString), but the json method is a handy shortcut.

当然这很简单 ,只是封装了 `JSON.parse(jsonString)` 而已, 但 `json` 方法还是很方便的。




## Handling Basic Text/HTML Responses

## 处理基本的Text / HTML响应



JSON isn't always the desired request response format so here's how you can work with an HTML or text response:

 JSON 并不总是理想的请求/响应数据格式, 那么我们看看如何处理 HTML或文本响应:


	fetch('/next/page')
	  .then(function(response) {
	    return response.text();
	  }).then(function(text) { 
		// <!DOCTYPE ....
		console.log(text); 
	  });


You can get the response text via chaining the Promise's then method along with the text() method.

如上面的代码所示, 可以在 Promise 的链式 `then` 方法中, 先返回 `text()` 结果 ,再获取 text 。




## Handling Blob Responses

## 处理Blob结果



If you want to load an image via fetch, for example, that will be a bit different:

如果你想通过 fetch 加载图像, 则会略有不同:




	fetch('flowers.jpg')
		.then(function(response) {
		  return response.blob();
		})
		.then(function(imageBlob) {
		  document.querySelector('img').src = URL.createObjectURL(imageBlob);
		});



The blob() method of the Body mixin takes a Response stream and reads it to completion.

Body mixin 的 `blob()` 方法接受响应流(Response stream), 并且将其读完。



## 提交表单数据(Posting Form Data)


Another common use case for AJAX is sending form data -- here's how you would use fetch to post form data:

另一个常用的 AJAX 用例是提交表单数据 —— 示例代码如下:


	fetch('/submit', {
		method: 'post',
		body: new FormData(document.getElementById('comment-form'))
	});


And if you want to POST JSON to the server:

如果你想发送JSON给服务器:


	fetch('/submit-json', {
		method: 'post',
		body: JSON.stringify({
			email: document.getElementById('email').value
			answer: document.getElementById('answer').value
		})
	});


Very easy, very eye-pleasing as well!

非常非常简单, 妈妈再也不用担心我的心情!



## 还没说完的故事(Unwritten Story)

While fetch is a nicer API to use, the API current doesn't allow for canceling a request, which makes it a non-starter for many developers.

`fetch` 是个很实用的API , 但不允许取消请求, 这就是使得很多开发人员暂时不会采用它。


The new fetch API seems much saner and simpler to use than XHR.  After all, it was created so that we could do AJAX the right way; fetch has the advantage of hindsight.  I can't wait until fetch is more broadly supported!

新的 `fetch`  API 比起 XHR 更智能也更简单。毕竟,它就是为了让我们创建AJAX而设计的, 具有后发的优势. 我已经迫不及待了, 即使现在支持度没那么广!


This is meant to be an introduction to fetch.  For a more in depth look, please visit Introduction to Fetch.  And if you're looking for a polyfill, check out GitHub's implementation.

这只是一篇对 `fetch` 的介绍文章。更深入地看,请访问 [Fetch简介](https://developers.google.com/web/updates/2015/03/introduction-to-fetch)。如果你要寻找一个 [polyfill](http://www.cnblogs.com/ziyunfei/archive/2012/09/17/2688829.html), 可以参考GitHub上的 [fetch实现](https://github.com/github/fetch)。



翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)


翻译时间: 2016年5月21日

原文时间: 2016年4月15日

原文链接: [https://davidwalsh.name/fetch](https://davidwalsh.name/fetch)

