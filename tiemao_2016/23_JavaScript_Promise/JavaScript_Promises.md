# 自己编写 JavaScript Promise API


While synchronous code is easier to follow and debug, async is generally better for performance and flexibility. Why "hold up the show" when you can trigger numerous requests at once and then handle them when each is ready?  Promises are becoming a big part of the JavaScript world, with many new APIs being implemented with the promise philosophy. Let's take a look at promises, the API, how it's used!


虽然同步代码更容易跟踪和调试, 但异步具有更好的性能和灵活性. 如何在某个时刻发起大量的请求, 然后分别处理它们的结果?  Promises 现在已成为JavaScript中的重要组成部分, 很多新的API都以 promise 的方式来实现。下面介绍什么是 promise,相应的 API, 以及使用示例!


## Promises in the Wild

## 承诺在野外


The XMLHttpRequest API is async but does _not_ use the Promises API.  There are a few native APIs that now use promises, however:

XMLHttpRequest API是异步但_not_使用API的承诺。现在有一些本地api,使用承诺,然而:


*   [Battery API](https://davidwalsh.name/javascript-battery-api)

*(电池API)(https://davidwalsh.name/javascript-battery-api)


*   [fetch API](https://davidwalsh.name/fetch) (XHR's replacement)

*(获取API)(https://davidwalsh.name/fetch)(XHR的替换)


*   ServiceWorker API (post coming soon!)

* ServiceWorker API(post很快!)


Promises will only become more prevalent so it's important that all front-end developers get used to them.  It's also worth noting that Node.js is another platform for Promises (obviously, as Promise is a core language feature).

承诺只会变得越来越流行,所以重要的是所有前端开发人员习惯它们。同样值得注意的是节点.js是另一个平台的承诺(显然,承诺是一个核心语言的特性)。


_Testing promises is probably easier than you think because `setTimeout` can be used as your async "task"!_

_Testing承诺可能是比你想象的更容易因为“setTimeout”可以作为你的异步“任务”! _


## Basic Promise Usage

## 基本承诺使用


The `new Promise()` constructor should only be used for legacy async tasks, like usage of `setTimeout` or `XMLHttpRequest`. A new Promise is created with the `new` keyword and the promise provides `resolve` and `reject` functions to the provided callback:

“新承诺()构造函数应该只用于遗留异步任务,使用“setTimeout”或“XMLHttpRequest的.创建一个新的承诺“新”字,承诺提供“解决”和“拒绝”提供的回调函数:


	var p = new Promise(function(resolve, reject) {




	// Do an async task async task and then...




	if(/* good condition */) {
	resolve('Success!');
	}
	else {
	reject('Failure!');
	}
	});




	p.then(function() { 
	/* do something with the result */
	}).catch(function() {
	/* error :( */
	})




It's up to the developer to manually call `resolve` or `reject` within the body of the callback based on the result of their given task.  A realistic example would be converting XMLHttpRequest to a promise-based task:

由开发人员手动调用“解决”或“拒绝”体内的回调根据给定任务的结果.一个现实的例子是将XMLHttpRequest转换为基于承诺的任务:


	// From Jake Archibald's Promises and Back:
	// http://www.html5rocks.com/en/tutorials/es6/promises/#toc-promisifying-xmlhttprequest




	function get(url) {
	// Return a new promise.
	return new Promise(function(resolve, reject) {
	// Do the usual XHR stuff
	var req = new XMLHttpRequest();
	req.open('GET', url);




	req.onload = function() {
	// This is called even on 404 etc
	// so check the status
	if (req.status == 200) {
	// Resolve the promise with the response text
	resolve(req.response);
	}
	else {
	// Otherwise reject with the status text
	// which will hopefully be a meaningful error
	reject(Error(req.statusText));
	}
	};




	// Handle network errors
	req.onerror = function() {
	reject(Error("Network Error"));
	};




	// Make the request
	req.send();
	});
	}




	// Use it!
	get('story.json').then(function(response) {
	console.log("Success!", response);
	}, function(error) {
	console.error("Failed!", error);
	});




Sometimes you don't _need_ to complete an async tasks within the promise -- if it's _possible_ that an async action will be taken, however, returning a promise will be best so that you can always count on a promise coming out of a given function. In that case you can simply call `Promise.resolve()` or `Promise.reject()` without using the `new` keyword. For example:

有时你不_need_内完成一个异步任务的承诺——如果是_possible_异步将采取行动,然而,返回一个承诺将是最好的,这样你可以一直依靠承诺的一个给定的函数。在这种情况下,您可以简单地称之为“Promise.resolve()”或“承诺.拒绝()“不使用“新”字。例如:


	var userCache = {};




	function getUserDetail(username) {
	// In both cases, cached or not, a promise will be returned




	if (userCache[username]) {
	// Return a promise without the "new" keyword
	return Promise.resolve(userCache[username]);
	}




	// Use the fetch API to get the information
	// fetch returns a promise
	return fetch('users/' + username + '.json')
	.then(function(result) {
	userCache[username] = result;
	return result;
	})
	.catch(function() {
	throw new Error('Could not find user: ' + username);
	});
	}




Since a promise is always returned, you can always use the `then` and `catch` methods on its return value!

希望是2%的协定,you can always always使用‘‘‘‘catch和当时的方法及其对社会价值!


## then

## 然后


All promise instances get a `then` method which allows you to react to the promise.  The first `then` method callback receives the result given to it by the `resolve()` call:

所有承诺实例得到一个'然后'方法允许您反应的承诺。第一个“然后”方法的回调接收结果给它的“解决()的电话:


	new Promise(function(resolve, reject) {
	// A mock async action using setTimeout
	setTimeout(function() { resolve(10); }, 3000);
	})
	.then(function(result) {
	console.log(result);
	});




	// From the console:
	// 10




The `then` callback is triggered when the promise is resolved.  You can also chain `then` method callbacks:

“然后”承诺解决时触发回调。你也可以链“然后”回调方法:


	new Promise(function(resolve, reject) { 
	// A mock async action using setTimeout
	setTimeout(function() { resolve(10); }, 3000);
	})
	.then(function(num) { console.log('first then: ', num); return num * 2; })
	.then(function(num) { console.log('second then: ', num); return num * 2; })
	.then(function(num) { console.log('last then: ', num);});




	// From the console:
	// first then:  10
	// second then:  20
	// last then:  40




Each `then` receives the result of the previous `then`'s return value.

每个“然后”收到的结果之前的那么“年代返回值。


If a promise has already resolved but `then` is called again, the callback immediately fires.  If the promise is rejected and you call `then` after rejection, the callback is never called.

如果承诺已解决但又“然后”叫,立即回调火灾。如果承诺是拒绝和你打电话'然后'拒绝后,回调是从来不叫。


## catch

## 抓


The `catch` callback is executed when the promise is rejected:

“抓住”回调执行拒绝承诺时:


	new Promise(function(resolve, reject) {
	// A mock async action using setTimeout
	setTimeout(function() { reject('Done!'); }, 3000);
	})
	.then(function(e) { console.log('done', e); })
	.catch(function(e) { console.log('catch: ', e); });




	// From the console:
	// 'catch: Done!'




What you provide to the `reject` method is up to you.  A frequent pattern is sending an `Error` to the `catch`:

你提供的“拒绝”方法。频繁模式是发送一个“错误”“抓”:


	reject(Error('Data could not be found'));




## `Promise.all`

## “Promise.all”


Think about JavaScript loaders:  there are times when you trigger multiple async interactions but only want to respond when all of them are completed -- that's where `Promise.all` comes in.  The `Promise.all` method takes an array of promises and fires one callback once they are all resolved:

想想JavaScript加载器:有些时候你触发多个异步交互,但只是想回应当他们完成——这就是“的承诺。所有的都在.的承诺。所有的方法需要一个数组的承诺和触发一个回调一旦他们都解决了:


	Promise.all([promise1, promise2]).then(function(results) {
	// Both promises resolved
	})
	.catch(function(error) {
	// One or more promises was rejected
	});




An perfect way of thinking about `Promise.all` is firing off multiple AJAX (via `fetch`) requests at one time:

一个完美的思考方式”的承诺。所有的发射多个AJAX请求(通过“取回”)一次:


	var request1 = fetch('/users.json');
	var request2 = fetch('/articles.json');




	Promise.all([request1, request2]).then(function(results) {
	// Both promises done!
	});




You could combine APIs like `fetch` and the Battery API since they both return promises:

你可以结合“取回”之类的API和电池API,因为他们都返回承诺:


	Promise.all([fetch('/users.json'), navigator.getBattery()]).then(function(results) {
	// Both promises done!
	});




Dealing with rejection is, of course, hard.  If any promise is rejected the `catch` fires for the first rejection:

处理拒绝,当然,困难。如果任何承诺被拒绝的“捕获”火灾首先拒绝:


	var req1 = new Promise(function(resolve, reject) { 
	// A mock async action using setTimeout
	setTimeout(function() { resolve('First!'); }, 4000);
	});
	var req2 = new Promise(function(resolve, reject) { 
	// A mock async action using setTimeout
	setTimeout(function() { reject('Second!'); }, 3000);
	});
	Promise.all([req1, req2]).then(function(results) {
	console.log('Then: ', one);
	}).catch(function(err) {
	console.log('Catch: ', err);
	});




	// From the console:
	// Catch: Second!




`Promise.all` will be super useful as more APIs move toward promises.

”的承诺。所有的将超级有用的api朝着承诺。


## `Promise.race`

## “Promise.race”


`Promise.race` is an interesting function -- instead of waiting for all promises to be resolved or rejected, `Promise.race` triggers as soon as any promise in the array is resolved or rejected:

”的承诺。竞赛”是一个有趣的功能,而不是等待所有承诺或拒绝解决,”的承诺。种族的触发器就数组中的任何承诺或拒绝解决:


	var req1 = new Promise(function(resolve, reject) { 
	// A mock async action using setTimeout
	setTimeout(function() { resolve('First!'); }, 8000);
	});
	var req2 = new Promise(function(resolve, reject) { 
	// A mock async action using setTimeout
	setTimeout(function() { resolve('Second!'); }, 3000);
	});
	Promise.race([req1, req2]).then(function(one) {
	console.log('Then: ', one);
	}).catch(function(one, two) {
	console.log('Catch: ', one);
	});




	// From the console:
	// Then: Second!




A use case could be triggering a request to a primary source and a secondary source (in case the primary or secondary are unavailable).

一个用例可能会触发一个请求主要来源和第二手来源(以防主要或次要不可用)。


## Get Used to Promises

## 习惯了承诺


Promises have been a hot topic for the past few years (or the last 10 years if you were a Dojo Toolkit user) and they've gone from a JavaScript framework pattern to a language staple.  It's probably wise to assume you'll be seeing most new JavaScript APIs being implemented with a promise-based pattern...

承诺一直是一个热门的话题在过去几年中(或过去十年如果你是一个Dojo工具箱用户),他们已经从一个JavaScript框架模式主要语言.可能是明智的认为你会看到大多数新的JavaScript api实现的基于承诺的模式……


...and that's a great thing!  Developers are able to avoid callback hell and async interactions can be passed around like any other variable.  Promises take some time getting used to be the tools are (natively) there and now is the time to learn them!

…这是一个伟大的事情!开发人员能够避免回调地狱和异步交互可以传递和其他变量.承诺需要一段时间适应的工具是(本地),现在是时间去学习他们!
