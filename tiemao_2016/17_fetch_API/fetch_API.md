# AJAX新一代API简介: fetch


One of the worst kept secrets about AJAX on the web is that the underlying API for it, XMLHttpRequest, wasn't really made for what we've been using it for.  We've done well to create elegant APIs around XHR but we know we can do better.  Our effort to do better is the fetch API.  Let's have a basic look at the new window.fetch method, available now in Firefox and Chrome Canary.

AJAX最恶心的事情莫过于丑陋的底层API了.  **XMLHttpRequest** 的设计并非是为如今的使用方式而考虑的. 虽然各种框架对 **XHR** 的封装已足够好用, 但我们还可以做得更好。更好的方式是使用 fetch API。下面简单介绍下 `window.fetch` 方法, 在最新版的 Firefox 和 Chrome 中已经可以使用了。


## XMLHttpRequest

XHR is a bit overcomplicated in my opinion, and don't get me started on why "XML" is uppercase but "Http" is camel-cased.  Anyways, this is how you use XHR now:

XHR在我看来有点复杂, 别让我解释为什么“XML”是大写,而“Http”是“骆峰式”写法。不管怎样, 使用XHR的方式大致如下:


	// Just getting XHR is a mess!
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
	
	// Open, send.
	request.open('GET', 'https://davidwalsh.name/ajax-endpoint', true);
	request.send(null);


Of course our JavaScript frameworks make XHR more pleasant to work with, but what you see above is a simple example of the XHR mess.

当然JavaScript框架使得操作XHR也很方便,但你在上面看到的是一个XHR混乱的简单例子。


## Basic `fetch` Usage

## 基本的 `fetch` 使用

A fetch function is now provided in the global window scope, with the first argument being the URL:

`fetch` 函数在 global window 作用域下可用, 第一个参数是URL:


	// url (required), options (optional)
	fetch('/some/url', {
		method: 'get'
	}).then(function(response) {
		
	}).catch(function(err) {
		// 出错了;等价于 then 的第二个参数,但这样更直观 :(
	});


Much like the updated Battery API, the fetch API uses JavaScript Promises to handle results/callbacks:

和Battery API 一样, fetch API 也使用了 JavaScript Promises 来处理结果/回调:


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

如果你还不习惯这种写法,那最好学习一下,因为很快就会全面流行。



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

下面看一看 **Response** 和**Request** 怎么使用!



## Request 简介


A Request instance represents the request piece of a fetch call. By passing fetch a Request you can make advanced and customized requests:

Request 对象表示一次 fetch 调用的请求信息。通过 Request  参数调用 fetch, 可以执行高级的自定义请求:




* method - 支持 GET, POST, PUT, DELETE, HEAD
* url - 请求的 URL
* headers - 对应的 Headers 对象
* referrer - 请求的 referrer 信息
* mode - 可以设置 cors, no-cors, same-origin
* credentials - 设置 cookies 是否随请求一起发送。可以设置: omit, same-origin
* redirect - follow, error, manual
* integrity - subresource integrity value
* cache - 设置 cache 模式 (default, reload, no-cache)




A sample Request usage may look like:

Request 的示例如下:


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

只有第一个参数 URL 是必需的。只要 Request  对象创建完成, 那么所有属性都变成只读属性. 也请注意, Request 有一个很重要的 `clone ` 方法, 特别是在 Service Worker API 中使用时 —— 一个 Request 就是一个流(stream), 因此如果要传递给另一个 fetch 方法,则需要进行克隆。


The fetch signature, however, acts like Request so you could also do:

fetch 的参数签名(signature), 和 Request 很像, 示例如下:


	fetch('/users.json', {
		method: 'POST', 
		mode: 'cors', 
		redirect: 'follow',
		headers: new Headers({
			'Content-Type': 'text/plain'
		})
	}).then(function() { /* handle response */ });



You'll likely only use Request instances within Service Workers since the Request and fetch signatures can be the same. ServiceWorker post coming soon!

因为 Request and fetch 的签名一致, 所以在 Service Workers 中, 你可能会更喜欢使用 Request 实例。关于 ServiceWorker 的相关博客也会很快奉上!



##Response 简介


The fetch's then method is provided a Response instance but you can also manually create Response objects yourself -- another situation you may encounter when using service workers. With a Response you can configure:

获取的方法提供了一个反应实例但是你也可以自己手动创建响应对象——另一种情况,你可能会遇到当使用服务的工人.您可以配置响应:

* type - basic, cors
* url
* useFinalURL - Boolean for if url is the final URL
* status - status code (ex: 200, 404, etc.)
* ok - Boolean for successful response (status in the range 200-299)
* statusText - status code (ex: OK)
* headers - Headers object associated with the response.

*类型——基本歌珥
* url
* useFinalURL -布尔如果url是最后的url
  *状态,状态代码(例:200、404等)
  *好——布尔成功的响应(状态范围在200 - 299年)
* statusText -状态代码(例:好)
  *头-头与反应相关联的对象。


<br/>


	// Create your own response for service worker testing
	// new Response(BODY, OPTIONS)
	var response = new Response('.....', {
		ok: false,
		status: 404,
		url: '/'
	});
	
	// The fetch's `then` gets a Response instance back
	fetch('/')
		.then(function(responseObj) {
			console.log('status: ', responseObj.status);
		});


The Response also provides the following methods:

响应还提供了以下方法:


* clone() - Creates a clone of a Response object.
* error() - Returns a new Response object associated with a network error.
* redirect() - Creates a new response with a different URL.
* arrayBuffer() - Returns a promise that resolves with an ArrayBuffer.
* blob() - Returns a promise that resolves with a Blob.
* formData() - Returns a promise that resolves with a FormData object.
* json() - Returns a promise that resolves with a JSON object.
* text() - Returns a promise that resolves with a USVString (text).

*克隆()创建了一个克隆的响应对象。
*误差()返回一个新的响应对象与网络相关的错误。
*()——创建一个新的重定向响应与一个不同的URL。
* arrayBuffer()返回一个承诺,解决arrayBuffer。
* blob()返回一个承诺,解决一个blob。
* formData()返回一个承诺,解决formData对象。
* json()返回一个承诺,解析json对象。
* text(),返回一个承诺解决USVString(文本)。

## Handling JSON

## 处理JSON


Let's say you make a request for JSON -- the resulting callback data has a json method for converting the raw data to a JavaScript object:

假设你做一个JSON请求——由此产生的回调数据有一个JSON方法将原始数据转换成一个JavaScript对象:


	fetch('https://davidwalsh.name/demo/arsenal.json').then(function(response) { 
		// Convert to JSON
		return response.json();
	}).then(function(j) {
		// Yay, `j` is a JavaScript object
		console.log(j); 
	});


Of course that's a simple JSON.parse(jsonString), but the json method is a handy shortcut.

当然这是一个简单JSON.parse(jsonString),但json方法是一个方便的捷径。


## Handling Basic Text/HTML Responses

## 处理基本的Text / HTML响应


JSON isn't always the desired request response format so here's how you can work with an HTML or text response:

JSON并不总是理想的请求响应格式这里是如何使用HTML或文本响应:


	fetch('/next/page')
	  .then(function(response) {
	    return response.text();
	  }).then(function(text) { 
		// <!DOCTYPE ....
		console.log(text); 
	  });


You can get the response text via chaining the Promise's then method along with the text() method.

你可以通过链接文本承诺的响应的方法和文本()方法。


## Handling Blob Responses

## 处理Blob反应


If you want to load an image via fetch, for example, that will be a bit different:

如果你想负载通过获取图像,例如,将略有不同:


	fetch('flowers.jpg')
		.then(function(response) {
		  return response.blob();
		})
		.then(function(imageBlob) {
		  document.querySelector('img').src = URL.createObjectURL(imageBlob);
		});


The blob() method of the Body mixin takes a Response stream and reads it to completion.

身体mixin的blob()方法接受一个响应流和读取完成。


## Posting Form Data

## 发布表单数据


Another common use case for AJAX is sending form data -- here's how you would use fetch to post form data:

AJAX的另一个常见的用例是发送表单数据——这是如何使用post表单数据获取:


	fetch('/submit', {
		method: 'post',
		body: new FormData(document.getElementById('comment-form'))
	});


And if you want to POST JSON to the server:

如果你想发布JSON的服务器:


	fetch('/submit-json', {
		method: 'post',
		body: JSON.stringify({
			email: document.getElementById('email').value
			answer: document.getElementById('answer').value
		})
	});


Very easy, very eye-pleasing as well!

非常简单,非常有视觉享受!


## Unwritten Story

## 不成文的故事

While fetch is a nicer API to use, the API current doesn't allow for canceling a request, which makes it a non-starter for many developers.

获取更好的API来使用时,API当前不允许取消的请求,这使得它对许多开发人员不可能成功。


The new fetch API seems much saner and simpler to use than XHR.  After all, it was created so that we could do AJAX the right way; fetch has the advantage of hindsight.  I can't wait until fetch is more broadly supported!

新的获取API似乎比XHR更理智的和简单的使用。毕竟,它,这样我们就可以创建AJAX的正确方法,获取了事后的优势.我不能等待,直到获取更广泛的支持!


This is meant to be an introduction to fetch.  For a more in depth look, please visit Introduction to Fetch.  And if you're looking for a polyfill, check out GitHub's implementation.

这是一个介绍取回。更深入地看,请访问介绍取回。如果你正在寻找一个polyfill,看看GitHub的实现。





https://davidwalsh.name/fetch

