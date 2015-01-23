# AngularJS最佳实践: 请小心使用 ng-repeat 中的 $index


“有客户投诉，说在删除指定的某条记录时,结果删掉的却是另外一条记录!”

看起来是个很严重的BUG。 有一次我们在工作中碰到了这个问题。 要定位这个BUG非常麻烦, 因为客户也不清楚如何重现这个问题。

后来发现这个Bug是由于在 `ng-repeat` 中使用了 `$index` 引发的。下面一起来看看这个错误是如何引发的, 以及如何避免这种bug产生,然后说说我们从中得到的经验和教训。


### 一个简单动作(action)的列表


先来看看一个完整有效的`ng-repeat`示例。

	<ul ng-controller="ListCtrl">
	  <li ng-repeat="item in items">
	    {{item.name}}
	    <button ng-click="remove($index)">remove</button>
	  </li>
	</ul>

对应的控制器(controller)如下:

	app.controller('ListCtrl', ['$scope', function($scope) {
	  //items come from somewhere, from where doesn't matter for this example
	  $scope.items = getItems();
	 
	  $scope.remove = function(index) {
	    var item = $scope.items[index];
	    removeItem(item);
	  };
	}]);

看起来没什么问题,对吗? 这段代码也没有任何特别值得注意的。


### 添加一个过滤器(filter)

然后,让我们来做一个小小的修改: 给列表添加一个过滤器。 这是很常见的做法,如果列表很长的话,例如允许用户进行搜索。

为了方便起见, 假设我们通过 `searchFilter` 来查询列表中的记录。

	<ul ng-controller="ListCtrl">
	  <li ng-repeat="item in items | searchFilter">
	    {{item.name}}
	    <button ng-click="remove($index)">remove</button>
	  </li>
	</ul>


控制器的代码保持不变。 看起来仍然没有问题,是吧?

事实上,有一个bug藏在里面。 如果我不说, 你能找到吗? 如果能找到,你就已经是Angular大牛了.


### 请尽量避免使用 `$index`

BUG其实是在控制器里面:

	$scope.remove = function(index) {
	  var item = $scope.items[index];
	  removeItem(item);
	};


这里使用了 index参数, 然后就遇到了BUG: 过滤后的索引(indexs)不匹配原始列表的索引。


幸运的是,有一个很简单的方法来避免这种问题: 不要使用`$index`,而改成实际的item对象。

	<ul ng-controller="ListCtrl">
	  <li ng-repeat="item in items | searchFilter">
	    {{item.name}}
	    <button ng-click="remove(item)">remove</button>
	  </li>
	</ul>

控制器如下所示:

	$scope.remove = function(item) {
	  removeItem(item);
	};


注意, 这里将 `remove($index)` 改成 `remove(item)`, 并修改了 `$scope.remove` 函数来直接操作传过来的对象。


这个小小的修改就完全避免了刚才的BUG。

为了更好地说明问题以及解决方案,请参考 [interactive example](http://plnkr.co/edit/JVQ1yURgQEIrwXFoQQxl?p=preview) 。


### 从中可以学到什么?


The first lesson is of course that we should be careful when using `$index`, as it can easily cause bugs when used in certain ways.


当然第一个教训是,我们应该在使用时要小心 美元指数 ,因为它可以很容易地导致错误使用时在某些方面。

The second lesson is that by recognizing patterns like this, you can establish better ways of doing things that can avoid certain types of bugs entirely. I’m definitely recommending everyone to avoid `$index` now, and as a result, their code will have less bugs from just this simple change of thinking.



第二个教训是,认识到这样的模式,您可以建立更好的做事方式,完全可以避免某些类型的错误。 我绝对推荐大家避免的 美元指数 现在,因此,他们的代码会减少错误的思维从这个简单的改变。


The third lesson is tests won’t always help you. Even if you have automated tests covering something like this, it’s quite easy for them to miss this, because the bugs caused by this depend so much on the specific inputs given. The bug won’t always show itself, even when using filtering.


第三个教训是测试并不总是帮助你。 即使你有自动化测试覆盖这样的事情,很容易错过这个,因为造成的错误这如此依赖特定的输入。 错误本身并不总是显示,即使使用过滤。


The fourth lesson is don’t break abstraction – This one is very easy to miss. Technically `$index` is a “template variable” created by `ng-repeat`. It’s only accurate and has meaning inside the repeat block. When we pass the value out, it loses its context and it’s no longer valid. In order for it to be valid outside the repeat, we would also have to filter the list in our controller, which would require some code duplication which should be avoided. Thankfully the pattern introduced in this article can be used to avoid this.

第四个教训是不要打破抽象——这个小姐很容易在技术上 美元指数 是一个“模板变量”了吗 ng-repeat 。 这只是在重复块准确和有意义。 当我们通过价值,它失去了它的上下文不再有效。 为了让它有效重复外,我们还必须过滤列表在我们的控制器,这将需要一些应该避免代码重复。 值得庆幸的是在这篇文章中介绍的模式可以避免这种情况。






原文链接: [AngularJS best practices: Be careful when using ng-repeat’s $index](http://codeutopia.net/blog/2014/11/10/angularjs-best-practices-avoid-using-ng-repeats-index/)

原文日期: 2014-11-10

翻译日期: 2015-01-23

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

