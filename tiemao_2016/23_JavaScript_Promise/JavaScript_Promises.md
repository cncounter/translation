# 自己编写 JavaScript Promise API


> 译者注: 到处是回调函数,代码非常臃肿难看, Promise 主要是拿来解决编程方式, 将某些代码封装于内部。

> Promise 直译为“承诺”，但一般直接称为 Promise;

> 代码的可读性非常重要,因为开发人员支出一般比计算机硬件的支出要大很多倍。


While synchronous code is easier to follow and debug, async is generally better for performance and flexibility. Why "hold up the show" when you can trigger numerous requests at once and then handle them when each is ready?  Promises are becoming a big part of the JavaScript world, with many new APIs being implemented with the promise philosophy. Let's take a look at promises, the API, how it's used!


虽然同步代码更容易跟踪和调试, 但异步方式却具有更好的性能与灵活性. 
怎样在同一时刻发起多个请求, 然后分别处理响应结果?  Promise 现已成为 JavaScript 中非常重要的一个组成部分, 很多新的API都以 promise 的方式来实现。下面简要介绍 promise, 以及相应的 API 和使用示例!


## Promises in the Wild

## 承诺在野外


The XMLHttpRequest API is async but does _not_ use the Promises API.  There are a few native APIs that now use promises, however:

XMLHttpRequest 是异步API, 但不算 Promise 方式。当前使用 Promise 的原生 api 包括:


*   [Battery API](https://davidwalsh.name/javascript-battery-api)
*   [fetch API](https://davidwalsh.name/fetch) (用来替代 XHR)
*   ServiceWorker API (参见后期文章!)



Promises will only become more prevalent so it's important that all front-end developers get used to them.  It's also worth noting that Node.js is another platform for Promises (obviously, as Promise is a core language feature).

Promise 会越来越流行,所以前端开发需要快速掌握它们。当然, Node.js 是另一个使用 Promise 的平台(显然, Promise 在Node中是一个核心特性)。


_Testing promises is probably easier than you think because `setTimeout` can be used as your async "task"!_

测试 promises 可能比你想象的还要容易, 因为 `setTimeout` 可以用来当作异步“任务”! 



## Promise 基本用法


The `new Promise()` constructor should only be used for legacy async tasks, like usage of `setTimeout` or `XMLHttpRequest`. A new Promise is created with the `new` keyword and the promise provides `resolve` and `reject` functions to the provided callback:

直接使用 `new Promise()` 构造函数的方式, 应该只用来处理遗留的异步任务编程, 例如 `setTimeout` 或者 `XMLHttpRequest`。 通过 `new` 关键字创建一个新的 Promise 对象, 该对象有 `resolve`(搞定!) 和 `reject`(拒绝!) 两个回调函数:


	var p = new Promise(function(resolve, reject) {
		// ... ... 
		// 此处,可以执行某些异步任务,然后...
		// 在回调中,或者任何地方执行 resolve/reject

		if(/* good condition */) {
			resolve('传入成果结果信息,如 data');
		}
		else {
			reject('失败:原因...!');
		}
	});

	p.then(function(data) { 
		/* do something with the result */
	}).catch(function(err) {
		/* error :( */
	});



It's up to the developer to manually call `resolve` or `reject` within the body of the callback based on the result of their given task.  A realistic example would be converting XMLHttpRequest to a promise-based task:

一般是由开发人员根据异步任务执行的结果,来手动调用 `resolve` 或者 `reject`. 一个典型的例子是将 XMLHttpRequest 转换为基于Promise的任务:


	// 本段示例代码来源于 Jake Archibald's Promises and Back:
	// http://www.html5rocks.com/en/tutorials/es6/promises/#toc-promisifying-xmlhttprequest

	function get(url) {
	  // 返回一个 promise 对象.
	  return new Promise(function(resolve, reject) {
	    // 执行常规的 XHR 请求
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
	      reject(Error("网络出错"));
	    };

	    // Make the request
	    req.send();
	  });
	};

	// 使用!
	get('story.json').then(function(response) {
	  console.log("Success!", response);
	}, function(error) {
	  console.error("Failed!", error);
	});




Sometimes you don't _need_ to complete an async tasks within the promise -- if it's _possible_ that an async action will be taken, however, returning a promise will be best so that you can always count on a promise coming out of a given function. In that case you can simply call `Promise.resolve()` or `Promise.reject()` without using the `new` keyword. For example:

有时候在 promise 方法体中不需要执行异步任务 —— 当然,在有可能会执行异步任务的情况下, 返回 promise 将是最好的方式, 这样只需要给定结果处理函数就行。在这种情况下, 不需要使用 new 关键字, 直接返回 `Promise.resolve()` 或者 `Promise.reject()`即可。例如:


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
	};




Since a promise is always returned, you can always use the `then` and `catch` methods on its return value!

因为总是会返回 promise, 所以只需要通过 `then` 和 `catch` 方法处理结果即可!


## then



All promise instances get a `then` method which allows you to react to the promise.  The first `then` method callback receives the result given to it by the `resolve()` call:


每个 promise 实例都有 `then` 方法, 用来处理执行结果。 第一个 `then` 方法回调的参数, 就是 `resolve()` 传入的那个值:


	new Promise(function(resolve, reject) {
		// 通过 setTimeout 模拟异步任务
		setTimeout(function() { resolve(10); }, 3000);
	})
	.then(function(result) {
		console.log(result);
	});

	// console 输出的结果:
	// 10




The `then` callback is triggered when the promise is resolved.  You can also chain `then` method callbacks:

`then` 回调由 promise 的 resolved 触发。你也可以使用链式的 then` 回调方法:


	new Promise(function(resolve, reject) { 
		// 通过 setTimeout 模拟异步任务
		setTimeout(function() { resolve(10); }, 3000);
	})
	.then(function(num) { console.log('first then: ', num); return num * 2; })
	.then(function(num) { console.log('second then: ', num); return num * 2; })
	.then(function(num) { console.log('last then: ', num);});

	// console 输出的结果:
	// first then:  10
	// second then:  20
	// last then:  40




Each `then` receives the result of the previous `then`'s return value.

每个 `then` 收到的结果都是之前那个 `then` 返回的值。


If a promise has already resolved but `then` is called again, the callback immediately fires.  If the promise is rejected and you call `then` after rejection, the callback is never called.

如果 promise 已经 resolved, 但之后才调用 `then` 方法, 则立即触发回调。如果promise被拒绝之后才调用 `then`, 则回调函数不会被触发。


## catch



The `catch` callback is executed when the promise is rejected:

当 promise 被拒绝时, `catch` 回调就会被执行:


	new Promise(function(resolve, reject) {
		// 通过 setTimeout 模拟异步任务
		setTimeout(function() { reject('Done!'); }, 3000);
	})
	.then(function(e) { console.log('done', e); })
	.catch(function(e) { console.log('catch: ', e); });

	// console 输出的结果:
	// 'catch: Done!'




What you provide to the `reject` method is up to you.  A frequent pattern is sending an `Error` to the `catch`:

传入 `reject` 方法的参数由你自己决定。一般来说是传入一个 `Error` 对象:


	reject(Error('Data could not be found'));




## `Promise.all`



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
