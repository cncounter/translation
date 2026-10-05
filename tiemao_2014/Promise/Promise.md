Promise详解

原文链接: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
原文日期: 2014年06月03日
翻译日期: 2014年7月26日
翻译人员: 铁锚

现在的JS领域, 处处都是 Promise、Callback 这一类概念, 但是在国内对 Promise 却没发现什么入门的讲解和介绍. 本文应该算是一篇入门的介绍, 将 Promise 翻译为“保证”: 异步执行, 并在执行完成后通知你结果(成功或失败).

说明: 这篇文章还需要技术评审(technical review).

这还是一种实验性质的技术
因为技术规范尚未稳定(stabilized), 在使用之前, 请为各种浏览器使用正确的前缀, 你可以检查 兼容性表 (compatibility table). 还需要注意, 实验技术的语法和行为在将来的浏览器版本中可能因为规范的变化而改变.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Browser_compatibility

Promise 接口代表一个在创建 Promise 时还不一定知道其值的代理. 它允许你将处理程序与异步操作的最终成功值或失败原因关联起来. 这让异步方法可以像同步方法那样返回值: 不是立即返回最终值, 而是由异步方法返回一个 Promise, 在将来的某个时刻提供该值.

一个处于 pending(待定)状态的 Promise, 最终要么以某个值 fulfilled(已兑现), 要么以某个原因 rejected(已拒绝). 当其中任何一种情况发生时, 由 Promise 的 then 方法排队的相关处理程序就会被调用. (如果在附加相应处理程序时 Promise 已经被兑现或拒绝, 那么该处理程序也会被调用, 因此异步操作完成与其处理程序被附加之间不存在竞态条件.)

因为 Promise.prototype.then 和 Promise.prototype.catch 方法返回 Promise, 所以它们可以被串联起来(chained) —— 这种操作称为 composition(复合).

方法(Methods)

Promise.prototype.then(onFulfilled, onRejected)

附加履行和拒绝处理程序,并返回一个新的 Promise,其结果由被调用处理程序的返回值决定.

Promise.prototype.catch(onRejected)

向 Promise 附加一个拒绝处理程序回调,并返回一个新的 Promise:如果该回调被调用,则以回调的返回值解决;如果 Promise 反而被兑现,则以原来的兑现值解决.

静态方法(Static methods)

Promise.resolve(value)

返回一个以给定值解决的 Promise 对象. 如果该值是一个 thenable(即拥有 then 方法),返回的 Promise 将“跟随”该 thenable,采用其最终状态;否则返回的 Promise 会以该值兑现.

Promise.reject(reason)

返回一个以给定原因被拒绝的 Promise 对象.

Promise.all(iterable)

返回一个 Promise,当 iterable 参数中的所有 Promise 都解决时它才解决,结果作为一组值的数组传入. 如果 iterable 数组中有一项不是 Promise,会由 Promise.cast 转换成一个 Promise. 如果 iterable 中的任何一个 Promise 被拒绝,那么返回的 Promise 会立即以该被拒绝 Promise 的值拒绝,并丢弃其他所有 Promise,无论它们是否已经解决.

--
var p = new Promise(function(resolve, reject) { resolve(3); });
Promise.all([true, p]).then(function(values) {
  // values == [ true, 3 ]
});
--

Promise.race(iterable)

返回一个 Promise,只要 iterable 中的某个 Promise 解决或拒绝,它就会立即以该 Promise 的值或原因解决或拒绝.

--
var p1 = new Promise(function(resolve, reject) { setTimeout(resolve, 500, "one"); });
var p2 = new Promise(function(resolve, reject) { setTimeout(resolve, 100, "two"); });

Promise.race([p1, p2]).then(function(value) {
  // value === "two"
});

var p3 = new Promise(function(resolve, reject) { setTimeout(resolve, 100, "three"); });
var p4 = new Promise(function(resolve, reject) { setTimeout(reject, 500, "four"); });

Promise.race([p3, p4]).then(function(value) {
  // value === "three"               
}, function(reason) {
  // Not called
});

var p5 = new Promise(function(resolve, reject) { setTimeout(resolve, 500, "five"); });
var p6 = new Promise(function(resolve, reject) { setTimeout(reject, 100, "six"); });

Promise.race([p5, p6]).then(function(value) {
  // Not called              
}, function(reason) {
  // reason === "six"
});
--

示例(Example)

这个小例子展示了 Promise 的机制. 每当 <button>(按钮) 被点击时就会调用 testPromise() 方法. 它创建一个 Promise,会通过 window.setTimeout 在 1 - 3 秒(随机)后用字符串“result”兑现.

Promise 的兑现仅仅是被记录下来,通过使用 p1.then 设置的一个兑现回调. 一些日志显示了方法的同步部分是如何与 Promise 的异步完成解耦的.

--
var promiseCount = 0;
function testPromise() {
  var thisPromiseCount = ++promiseCount;

  var log = document.getElementById('log');
  log.insertAdjacentHTML('beforeend', thisPromiseCount + ') Started (<small>Sync code started</small>)<br/>');

  var p1 = new Promise(               /* We make a new promise: we promise the string 'result' (after waiting 3s) */
    function(resolve, reject) {       /* The resolver function is called with the ability to resolve or reject the promise */
      log.insertAdjacentHTML('beforeend', thisPromiseCount + ') Promise started (<small>Async code started</small>)<br/>');
      window.setTimeout(              /* This only is an example to create asynchronism */
        function() {
          resolve(thisPromiseCount); /* We fulfill the promise ! */
        }, Math.random() * 2000 + 1000);
    });

  p1.then(                            /* We define what to do when the promise is fulfilled */
    function(val) {                   /* Just log the message and a value */
      log.insertAdjacentHTML('beforeend', val + ') Promise fulfilled (<small>Async code terminated</small>)<br/>');
    });

  log.insertAdjacentHTML('beforeend', thisPromiseCount + ') Promise made (<small>Sync code terminated</small>)<br/>');
}
--

单击按钮时执行这个例子. 你需要一个支持 Promise 的浏览器. 在很短的时间内多次点击按钮,你甚至可以看到不同的 Promise 一个接一个地被兑现.

--
1) Started (Sync code started)
1) Promise started (Async code started)
1) Promise made (Sync code terminated)
1) Promise fulfilled (Async code terminated)
2) Started (Sync code started)
2) Promise started (Async code started)
2) Promise made (Sync code terminated)
2) Promise fulfilled (Async code terminated)
3) Started (Sync code started)
3) Promise started (Async code started)
3) Promise made (Sync code terminated)
3) Promise fulfilled (Async code terminated)
4) Started (Sync code started)
4) Promise started (Async code started)
4) Promise made (Sync code terminated)
4) Promise fulfilled (Async code terminated)
--

规范
规范	状态	评论
domenic / promises-unwrapping 	草案	最初的工作就是在这里进行的
es6	草案	这最终会被并入整个 ES6 草案

浏览器兼容性

桌面
功能	Chrome	Firefox(Gecko)	Internet Explorer	Opera	Safari
基本支持	32	24.0 (24.0) Future 
25.0 (25.0) Promise 在flag后面[1] 
29.0 默认开启(29.0)	不支持	19	不支持

移动
功能	Android	移动版Firefox(Gecko)	IE移动版	Opera移动	Safari移动	Chrome for Android
基本支持	不支持	24.0(24.0) Future 
25.0(25.0) Promise 在flag后面[1] 
默认29.0(29.0)	不支持	不支持	不支持	32

[1]Firefox 24 中有一个实验性的 Promise 实现,最初命名为 Future. 在 Firefox 25 中它被重命名为最终名称,但默认情况下仍被标志 dom.promise.enabled 禁用. Bug 918806:从 Firefox 29 起,Promise 默认启用.



另请参阅
JavaScript promises: there and back again 
Promises/A+ 规范