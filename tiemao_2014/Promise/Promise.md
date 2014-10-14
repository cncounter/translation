Promise详解

原文链接: Promise
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
原文日期: 2014年06月03日
翻译日期: 2014年7月26日
翻译人员: 铁锚

现在的JS领域，处处都是 Promise、 Callback 这一类概念,但是在国内对Promise却没发现什么入门的讲解和介绍. 本文应该算是一篇入门的介绍, 将 Promise 翻译为 "保证",异步执行,保证通知你执行结果(成功、失败).

说明: 这篇文章还需要技术评审(technical review).

这还是一种实验性质的技术 
因为技术规范尚未稳定(stabilized),在使用之前,请为各种浏览器使用正确的前缀, 你可以检查 兼容性表 (compatibility table). 还需要注意,实验技术的语法和行为在将来的浏览器版本中可能因为规范的变化而改变.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Browser_compatibility

Promise 接口代表一个代表一个值不一定知道创建承诺时. 它允许您将处理程序异步操作的最终的成功或失败的原因. 这让异步方法返回值像同步方法:最后的价值,而是返回一个异步的方法 承诺 在未来的价值.

可以成为悬而未决的承诺 实现了 与一个值,或 拒绝了 一个理由. 当这些发生时,排队承诺的相关联的处理程序 然后 被称为方法. (如果已经履行或拒绝承诺当一个相应的处理程序,该处理程序将调用,因此不存在竞争条件之间的异步操作完成,其处理程序.)

因为 Promise.prototype.then 和 Promise.prototype.catch 方法返回 promises, 所以可以被串联起来(chained) —— 称为 composition(复合) 操作.

方法(Methods)

Promise.prototype.then(onFulfilled, onRejected)

附加履行承诺和拒绝处理程序,并返回一个新的承诺解决的返回值称为处理程序.

Promise.prototype.catch(onRejected)

附加承诺拒绝处理程序回调,并返回一个新的承诺解决回调的返回值如果它被调用时,或者如果承诺而不是原来的实现价值实现.

静态方法(Static methods)

Promise.resolve(value)

返回一个 承诺 对象解决给定的值. 如果该值是一个thenable(即有 然后 方法),返回thenable承诺将“关注”,采用其最终状态;否则返回的承诺会实现的价值.

Promise.reject(reason)

指定拒绝的原因并返回一个 Promise 对象,.

Promise.all(iterable)

返回一个承诺,解决当所有iterable承诺的解决. 结果是通过一组值的承诺. 如果通过了iterable数组中不是一个承诺,由Promise.cast转换为一. 如果任何通过承诺拒绝, 所有 承诺立即拒绝的价值承诺,拒绝,丢弃所有其他承诺是否已经解决.

--
var p = new Promise(function(resolve, reject) { resolve(3); });
Promise.all([true, p]).then(function(values) {
  // values == [ true, 3 ]
});
--

Promise.race(iterable)

返回一个承诺尽快解决或拒绝一个iterable解析或拒绝承诺,这一承诺的价值或原因.

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

这个小例子显示的机制 承诺 . 的 testPromise() 每次的方法被调用 <按钮> 是点击. 它创建了一个承诺,将会解决,使用 window.setTimeout 的字符串 “结果” 后 1 - 3年代 (随机).

承诺的实现仅仅是记录,通过使用一组实现回调 p1.then . 一些日志显示了同步方法是解耦的一部分的异步完成的承诺.

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

单击按钮时执行这个例子. 你需要一个浏览器支持 承诺 . 点击几次按钮在很短的时间,你甚至还可以看到不同的承诺履行一个接一个.

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
domenic / promises-unwrapping 	草案	最初的工作是发生在这里
es6	草案	这最终将会被转移到整个ES6草案

浏览器兼容性

桌面
功能	铬	Firefox(壁虎)	Internet Explorer	歌剧	Safari
基本支持	32	24.0 (24.0) 未来 
25.0 (25.0) 承诺 在国旗后面[1] 
29.0 在默认情况下(29.0)	不支持	19	不支持

移动
功能	安卓	移动版Firefox(壁虎)	即移动	opera移动	Safari移动	铬为Android
基本支持	不支持	24.0(24.0) 未来 
25.0(25.0) 承诺 在国旗后面[1] 
默认29.0(29.0)	不支持	不支持	不支持	32

[1]壁虎24有一个实验的实现 承诺 在最初的名字 未来 . 重命名了它最后的名字在壁虎25,但默认情况下禁用背后的旗帜 dom.promise.enabled . 错误918806 承诺中默认启用壁虎29.



另请参阅
JavaScript承诺:那里回来 
承诺/ +规范