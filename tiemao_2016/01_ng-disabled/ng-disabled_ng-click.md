ng-disabled 不起作用的解决办法
==



不知道这算不算 Angular.js 的一个bug。但搜索一番后找到了一个变通的解决办法。

业务需求是这样的, 按钮被点击一次之后就设置为禁用状态, 以阻止多次无效的点击。但现在很多框架都用 `<div>` 或者其他标签来实现 button 效果。我并不是专业的UI, 不知道这样做到底好不好,该怎么样就怎么样呗。


在 `<button>` 上面时 `ng-disabled` 一切正常(因为 `<button>` 支持 disabled ):


	<button ng-click="do_something()" 
		ng-disabled="button_clicked">Click Me</button>


相关的逻辑代码如下:

	angular.module('ngToggle', [])
	    .controller('AppCtrl',['$scope', function($scope){
	    $scope.button_clicked = false;
	    $scope.do_something = function() {
		alert("Clicked!");
		$scope.button_clicked = true;
		return false;
	    }
	}]);


但将 `button` 变为 `<div>`后, `ng-disabled` 标志就不起作用了。它将元素设置为禁用状态(disabled), 但点击的时候依然会触发 `ng-click` 。


解决办法是在 `ng-click` 里面先判断参数的值:

	<div ng-click="button_clicked || do_something()" 
		ng-disabled="button_clicked">Click Me</div>


很简单也很有效, 一个短路或。 短路或 `||` 的运算规则是,如果左边的表达式为 `true`,则返回true, 不再计算右边表达式。





欢迎加入: [CNC开源组件开发交流群 316630025](http://jq.qq.com/?_wv=1027&k=Z4v6kn)

原文链接: [http://baudehlo.com/2014/02/24/angular-js-ng-click-still-fires-when-div-is-ngdisabled/](http://baudehlo.com/2014/02/24/angular-js-ng-click-still-fires-when-div-is-ngdisabled/)

原文日期: 2014年02月24日

翻译日期: 2016年01月07日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
