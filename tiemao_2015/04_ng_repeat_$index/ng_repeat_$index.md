# AngularJS最佳实践: 请小心使用 ng-repeat 中的 $index


“A customer reported they deleted an item and the wrong item got deleted!”

“一个客户说他们删除一个条目和错误的条目被删除!”


Sounds like a pretty serious bug. This is what we got one time at work. Attempting to locate it was quite difficult, because naturally the customer had no idea what they did to reproduce the issue.


听起来像一个非常严重的错误。 这就是我们有一个时间在工作。 试图找到它很困难,因为自然客户不知道他们做了什么重现这个问题。


Turns out the bug was caused by using `$index` in an `ng-repeat`. Let’s take a look at how this happens, and a super simple way to avoid this type of bug entirely, and also a few lessons we can learn from this.


错误是由于使用 美元指数 在一个 ng-repeat 。 让我们看看这一切发生的时候,和一个超级简单的方法,要完全避免这种类型的错误,我们可以从中学习也有一些教训。

### A simple list with an action

Let’s look at an example of a perfectly valid `ng-repeat`, and its controller.

### 一个简单的列表,一个动作

让我们来看看一个完全有效的例子 ng-repeat ,它的控制器。

	<ul ng-controller="ListCtrl">
	  <li ng-repeat="item in items">
	    {{item.name}}
	    <button ng-click="remove($index)">remove</button>
	  </li>
	</ul>

<br/>

	app.controller('ListCtrl', ['$scope', function($scope) {
	  //items come from somewhere, from where doesn't matter for this example
	  $scope.items = getItems();
	 
	  $scope.remove = function(index) {
	    var item = $scope.items[index];
	    removeItem(item);
	  };
	}]);

Looks OK, right? Nothing particularly special about this code.

看起来好了,对吗? 这段代码看上去没有任何特别之处。

### Adding a filter

### 添加一个过滤器

Now, let’s do a small change: Let’s add a filter to the list. This is a reasonably common thing to do if you have a long list, for example to allow the user to search the list.

现在,让我们来做一个小改变:让我们添加一个过滤器列表中。 这是一个相当常见的事情如果你有一长串,例如允许用户搜索列表。

For sake of this example, assume `searchFilter` allows us to filter the list by some search query.

对于这个例子,假设 searchFilter 让我们通过一些搜索过滤列表查询。

	<ul ng-controller="ListCtrl">
	  <li ng-repeat="item in items | searchFilter">
	    {{item.name}}
	    <button ng-click="remove($index)">remove</button>
	  </li>
	</ul>

The controller code stays the same. Still looks good, right?

控制器代码保持不变。 仍然看起来不错,是吧?

There’s actually a bug in there now. Can you find it? Would you have thought about it if I hadn’t mentioned it?

实际上,这里有一个错误在那里了。 你能找到它吗? 你会想如果我没有提到吗?


### Using $index should be avoided

The bug is in the controller:


### 使用 美元指数 应该避免

这个错误是在控制器:

	$scope.remove = function(index) {
	  var item = $scope.items[index];
	  removeItem(item);
	};

As we use the index here, we will run into problems as soon as we have filtered the list in a way which causes the indexes to not match the original list.


我们这里使用索引,我们遇到问题就会过滤列表的方式导致索引不匹配原始列表。



Thankfully there’s a really simple way to avoid this: Instead of using `$index`, prefer to pass the actual objects around.


幸运的是有一个很简单的方法来避免这种情况:代替使用 美元指数 ,更喜欢通过实际的对象。

	<ul ng-controller="ListCtrl">
	  <li ng-repeat="item in items | searchFilter">
	    {{item.name}}
	    <button ng-click="remove(item)">remove</button>
	  </li>
	</ul>

<br/>

	$scope.remove = function(item) {
	  removeItem(item);
	};


Notice how I changed `remove($index)` into `remove(item)`, and changed the `$scope.remove` function to operate directly on the object instead.

注意,我改变了 删除(美元指数) 成 删除(项目) ,改变了 scope.remove美元 函数来直接操作的对象。


This simple change avoids the bug issue entirely.

这个简单的改变完全避免了错误问题。


To better illustrate the problem and the solution, you can use this [interactive example](http://plnkr.co/edit/JVQ1yURgQEIrwXFoQQxl?p=preview).


为了更好的说明问题和解决方案,你可以使用这个 互动的例子 。

### What can we learn from this?

### 我们可以从这里学到什么?

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

