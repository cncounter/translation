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



第一个教训当然是在使用 `$index` 要小心一点,因为以某些方式使用时很可能会产生BUG。


第二个教训是,请记住类似这样的模式,则可以用更好的做事方式,可以完全避免某些类型的BUG。 我强烈建议大家现在不要使用 `$index`, 从这种简单的思维转变中,就可以减少代码中的很多BUG。


第三个教训是测试并不是什么时候都有用。 即便有自动化测试,也覆盖了足够多的情形, 但对于依赖特定输入的情况,也很容易错过某些BUG。 错误本身并不是每次都会出现,即使你也用过滤来测试。


第四个教训是不要破坏抽象 —— 这一点很容易被忽略。理论上 `$index` 是由 `ng-repeat` 创建的一个 “模板变量(template variable)”。 这只在 repeat 块里面有意义(并正确起作用)。 当我们将它的值传递到外面时,它就失去了上下文从而不再有效。 如果确实想让它在 repeat 之外依然有效,则必须在控制器中也进行过滤,这就需要一些不是很必要的重复代码。 值得庆幸的是本文中介绍的模式可以用来避免这种情况。


GitHub版: [https://github.com/cncounter/translation/blob/master/tiemao_2015/04_ng_repeat_%24index/ng_repeat_%24index.md](https://github.com/cncounter/translation/blob/master/tiemao_2015/04_ng_repeat_%24index/ng_repeat_%24index.md)

原文链接: [AngularJS best practices: Be careful when using ng-repeat’s $index](http://codeutopia.net/blog/2014/11/10/angularjs-best-practices-avoid-using-ng-repeats-index/)

原文日期: 2014-11-10

翻译日期: 2015-01-23

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

