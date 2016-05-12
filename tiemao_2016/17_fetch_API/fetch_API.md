# fetch API


One of the worst kept secrets about AJAX on the web is that the underlying API for it, XMLHttpRequest, wasn't really made for what we've been using it for.  We've done well to create elegant APIs around XHR but we know we can do better.  Our effort to do better is the fetch API.  Let's have a basic look at the new window.fetch method, available now in Firefox and Chrome Canary.

最糟糕的一个AJAX在web上保持秘密在于底层API,XMLHttpRequest,并不是真的为我们已经使用它了.我们已经做得很好创造优雅的api在XHR但我们知道,我们可以做得更好。我们努力做得更好是获取API。让我们有一个基本的新窗口.获取方法,可用在Firefox和Chrome金丝雀。


## XMLHttpRequest

XHR is a bit overcomplicated in my opinion, and don't get me started on why "XML" is uppercase but "Http" is camel-cased.  Anyways, this is how you use XHR now:

XHR有点复杂的在我看来,,别让我开始为什么“XML”大写,但“Http”是“骆峰式”。不管怎样,这是你如何使用XHR现在:


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

当然我们的JavaScript框架使XHR更加愉快,但你在上面看到的是一个简单的例子XHR混乱。


## Basic `fetch` Usage

## 基本的“获取”使用

A fetch function is now provided in the global window scope, with the first argument being the URL:

获取函数现在在全球提供窗口范围,第一个参数是网址:


	// url (required), options (optional)
	fetch('/some/url', {
		method: 'get'
	}).then(function(response) {
		
	}).catch(function(err) {
		// Error :(
	});


Much like the updated Battery API, the fetch API uses JavaScript Promises to handle results/callbacks:

就像电池更新的API,fetch API使用JavaScript将处理结果/回调:


	// Simple response handling
	fetch('/some/url').then(function(response) {
		
	}).catch(function(err) {
		// Error :(
	});

	// Chaining for more "advanced" handling
	fetch('/some/url').then(function(response) {
		return //...
	}).then(function(returnedValue) {
		// ...
	}).catch(function(err) {
		// Error :(
	});


If you aren't used to then yet, get used to it -- it will soon be everywhere.

如果你不习惯,习惯它,它很快就会无处不在。


## Request Headers

## 请求头


The ability to set request headers is important in request flexibility. You can work with request headers by executing new Headers():

在请求设置请求头的能力是重要的灵活性。你可以处理请求头通过执行新标题():


	// Create an empty Headers instance
	var headers = new Headers();

	// Add a few headers
	headers.append('Content-Type', 'text/plain');
	headers.append('X-My-Custom-Header', 'CustomValue');

	// Check, get, and set header values
	headers.has('Content-Type'); // true
	headers.get('Content-Type'); // "text/plain"
	headers.set('Content-Type', 'application/json');

	// Delete a header
	headers.delete('X-My-Custom-Header');

	// Add initial values
	var headers = new Headers({
		'Content-Type': 'text/plain',
		'X-My-Custom-Header': 'CustomValue'
	});


You can use the append, has, get, set, and delete methods to modify request headers. To use request headers, create a Request instance :

得到,你可以使用附加的,集和delete方法修改请求头。使用请求头,创建一个请求实例:


	var request = new Request('/some-url', {
		headers: new Headers({
			'Content-Type': 'text/plain'
		})
	});

	fetch(request).then(function() { /* handle response */ });


Let's have a look at what Response and Request do!

让我们看一看响应和请求做!


## Request

## 请求


A Request instance represents the request piece of a fetch call. By passing fetch a Request you can make advanced and customized requests:

一块请求实例表示请求的取回电话。通过获取请求你可以先进和定制的请求:


* method - GET, POST, PUT, DELETE, HEAD
* url - URL of the request
* headers - associated Headers object
* referrer - referrer of the request
* mode - cors, no-cors, same-origin
* credentials - should cookies go with the request? omit, same-origin
* redirect - follow, error, manual
* integrity - subresource integrity value
* cache - cache mode (default, reload, no-cache)

* method - GET、POST、PUT、删除、头
* url - url of the request
* headers headers object -美联社
* referrer referrer of the request -
* mode -连续,no-cors,same-origin
*凭证——饼干应该请求吗?省略,同源
*重定向-,错误,手工
*完整性——子资源完整性价值
*缓存,缓存模式(默认情况下,刷新,no - cache)


A sample Request usage may look like:

一个示例请求使用可能看起来像:


	var request = new Request('/users.json', {
		method: 'POST', 
		mode: 'cors', 
		redirect: 'follow',
		headers: new Headers({
			'Content-Type': 'text/plain'
		})
	});
	
	// Now use it!
	fetch(request).then(function() { /* handle response */ });


Only the first parameter, the URL, is required. Each property becomes read only once the Request instance has been created. Also important to note that Request has a clone method which is important when using fetch within the Service Worker API -- a Request is a stream and thus must be cloned when passing to another fetch call.

URL,只有第一个参数是必需的。每个属性变成只读一次请求实例创建.也一定要注意,要求有一个克隆的方法是很重要的,在使用中获取服务工人API——请求流,因此必须采用克隆时传递到另一个地方 取回电话。


The fetch signature, however, acts like Request so you could also do:

获取签名,然而,就像请求你也可以做:


	fetch('/users.json', {
		method: 'POST', 
		mode: 'cors', 
		redirect: 'follow',
		headers: new Headers({
			'Content-Type': 'text/plain'
		})
	}).then(function() { /* handle response */ });


You'll likely only use Request instances within Service Workers since the Request and fetch signatures can be the same. ServiceWorker post coming soon!

你可能会只使用请求实例在服务工人自请求和获取签名可以是相同的。ServiceWorker帖子很快!


##Response

##响应


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

