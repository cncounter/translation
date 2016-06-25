# Promise API 简介


> 译者注: 到处是回调函数,代码非常臃肿难看, Promise 主要用来解决这种编程方式, 将某些代码封装于内部。

> Promise 直译为“承诺”，但一般直接称为 Promise;

> 代码的可读性非常重要,因为开发人员支出一般比计算机硬件的支出要大很多倍。


虽然同步代码更容易跟踪和调试, 但异步方式却具有更好的性能与灵活性. 
怎样在同一时刻发起多个请求, 然后分别处理响应结果?  Promise 现已成为 JavaScript 中非常重要的一个组成部分, 很多新的API都以 promise 的方式来实现。下面简要介绍 promise, 以及相应的 API 和使用示例!


## Promises 周边


XMLHttpRequest 是异步API, 但不算 Promise 方式。当前使用 Promise 的原生 api 包括:


*   [Battery API](https://davidwalsh.name/javascript-battery-api)
*   [fetch API](http://blog.csdn.net/renfufei/article/details/51494396) (用来替代 XHR)
*   ServiceWorker API (参见后期文章!)


Promise 会越来越流行,所以前端开发需要快速掌握它们。当然, Node.js 是另一个使用 Promise 的平台(显然, Promise 在Node中是一个核心特性)。


测试 promises 可能比你想象的还要容易, 因为 `setTimeout` 可以用来当作异步“任务”! 


## Promise 基本用法


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




因为总是会返回 promise, 所以只需要通过 `then` 和 `catch` 方法处理结果即可!


## then



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



每个 `then` 收到的结果都是之前那个 `then` 返回的值。


如果 promise 已经 resolved, 但之后才调用 `then` 方法, 则立即触发回调。如果promise被拒绝之后才调用 `then`, 则回调函数不会被触发。


## catch


当 promise 被拒绝时, `catch` 回调就会被执行:


	new Promise(function(resolve, reject) {
		// 通过 setTimeout 模拟异步任务
		setTimeout(function() { reject('Done!'); }, 3000);
	})
	.then(function(e) { console.log('done', e); })
	.catch(function(e) { console.log('catch: ', e); });

	// console 输出的结果:
	// 'catch: Done!'



传入 `reject` 方法的参数由你自己决定。一般来说是传入一个 `Error` 对象:


	reject(Error('Data could not be found'));




## `Promise.all`


想想JavaScript加载器的情形: 有时候会触发多个异步交互, 但只在所有请求完成之后才会做出响应。—— 这种情况可以使用 `Promise.all` 来处理。`Promise.all` 方法接受一个 promise 数组, 在所有 promises 都搞定之后, 触发一个回调:


	Promise.all([promise1, promise2]).then(function(results) {
		// Both promises resolved
	})
	.catch(function(error) {
		// One or more promises was rejected
	});



`Promise.all` 的最佳示例是通过`fetch`同时发起多个 AJAX请求时:


	var request1 = fetch('/users.json');
	var request2 = fetch('/articles.json');

	Promise.all([request1, request2]).then(function(results) {
		// Both promises done!
	});


你也可以组合使用 `fetch` 和 Battery 之类的 API ,因为他们都返回 promises:


	Promise.all([fetch('/users.json'), navigator.getBattery()]).then(function(results) {
		// Both promises done!
	});



当然, 处理拒绝的情况比较复杂。如果某个 promise 被拒绝, 则 `catch` 将会被第一个拒绝(rejection)所触发:


	var req1 = new Promise(function(resolve, reject) { 
		// 通过 setTimeout 模拟异步任务
		setTimeout(function() { resolve('First!'); }, 4000);
	});
	var req2 = new Promise(function(resolve, reject) { 
		// 通过 setTimeout 模拟异步任务
		setTimeout(function() { reject('Second!'); }, 3000);
	});
	Promise.all([req1, req2]).then(function(results) {
		console.log('Then: ', one);
	}).catch(function(err) {
		console.log('Catch: ', err);
	});

	// From the console:
	// Catch: Second!


随着越来越多的 API 支持 promise, `Promise.all` 将会变得超级有用。



## `Promise.race`


`Promise.race` 是一个有趣的函数. 与 `Promise.all` 相反,  只要某个 priomise 被 resolved 或者 rejected, 就会触发 `Promise.race`:


	var req1 = new Promise(function(resolve, reject) { 
		// 通过 setTimeout 模拟异步任务
		setTimeout(function() { resolve('First!'); }, 8000);
	});
	var req2 = new Promise(function(resolve, reject) { 
		// 通过 setTimeout 模拟异步任务
		setTimeout(function() { resolve('Second!'); }, 3000);
	});
	Promise.race([req1, req2]).then(function(one) {
		console.log('Then: ', one);
	}).catch(function(one, two) {
		console.log('Catch: ', one);
	});

	// From the console:
	// Then: Second!



一个案例是请求的资源有 主站资源和备用资源(以防某个不可用)。


## 改变习惯, 使用 Promise


在过去几年中 Promise 一直是个热门话题(如果你是 Dojo Toolkit 用户,那么就是已经有10年了), 已经从一个JavaScript框架变成了语言的一个主要成分. 很快你就会看到大多数新的 JavaScript api 都会基于 Promise 的方式来实现……


... 当然这是一件好事! 开发人员能够避开回调的地狱, 异步交互也可以像其他变量一样传递.  Promise 还需要一段时间来普及, 现在是时候去学习他们了!

本文最初发布于: [http://zcfy.cc/article/351](http://zcfy.cc/article/351)



翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)


翻译时间: 2016年6月25日

原文时间: 2015年11月2日

原文链接: [https://davidwalsh.name/promises](https://davidwalsh.name/promises)

