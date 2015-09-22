# 掌握JS中的“`this`” (二)


在上一篇文章 [掌握JS的“`this`” (一)](../20_0_JavaScript_this_InnerWorkings/Revealing_this_InnerWorkings.md) 里面, 我们学会了如何正确使用JavaScript中的 `this` 关键字及其基本原理。我们也知道决定 `this` 指向哪个对象的关键因素, 是找出当前的执行上下文(execution context)。但如果执行上下文不按正常的方式进行设置,问题可能就会变得很棘手。在本文中,我会着重提示在哪些地方会发生这种情况, 以及用什么方式可以弥补。

## 解决常见问题

在本节中,我们将探讨一些使用 this 关键字时最常见的问题, 并了解如何处理这种情况。

### 1. 在拆出来(Extracted)的方法中使用 `this`

最常见的错误,就是将对象的方法(method)赋值给一个变量, 并认为 function 中的 `this` 仍然指向原来那个对象。从下面的例子中我们可以看到, 完全不是这么回事。


	var car = {
	  brand: "Nissan",
	  getBrand: function(){
	    console.log(this.brand);
	  }
	};
	
	var getCarBrand = car.getBrand;
	
	getCarBrand();   // output: undefined


看起来 `getCarBrand` 似乎引用的是 `car.getBrand()`, 但实际上他指向的仅仅是 `getBrand()` 自身。我们已经知道在确定上下文时最重要的是调用点(call-site), 上面的代码中,调用点是 `getCarBrand()`, 这只是一个普通的函数调用。

证明 `getCarBrand` 指向一个普通函数(baseless function, 没有绑定到任何特定对象的函数) 的方法, 是使用 `alert(getCarBrand);` 来查看对应的内容, alert 的输出如下所示:

	function(){
	  console.log(this.brand);
	}


`getCarBrand` 仅仅是一个普通的函数, 它不再是 `car` 对象的方法。所以,在这种情况下, `this.brand` 实际上会被转换为 `window.brand`。 输出的结果当然就是 `undefined`。

如果我们从对象中拆取出(extract)某个方法, 那么这个方法(method)就会变成了一个普通的函数(function)。他和原来对象的联系被切断了(severed), 所以不再按照原来的方式运行。换句话说, 一个拆取出来的函数就不再绑定到原来的对象上了。

如何处理这种情况呢? OK,如果还想指向原来的那个对象的话,就需要在赋值给 `getCarBrand` 的时候显式地将 `getBrand()` 函数绑定(bind) 到 `car` 对象, 当然, 我们可以使用 [bind()方法](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)。


	var getCarBrand = car.getBrand.bind(car);
	getCarBrand();   // output: Nissan


现在,我们得到了期望的正确输出,因为我们成功地重新定义想要的上下文。

### 2.在回调函数中使用 `this` 

第二类问题是将某个(使用了 `this` 的)方法作为回调函数。例如:


> `<button id="btn" type="button">查看汽车品牌</button>`

	var car = {
	  brand: "Nissan",
	  getBrand: function(){
	    console.log(this.brand);
	  }
	};
	
	var el = document.getElementById("btn");
	el.addEventListener("click", car.getBrand);


虽然使用的是 `car.getBrand`, 但实际上只是将 `getBrand()` 函数关联到 `button` 对象。

将参数传递给一个函数是一种隐式的赋值, 所以此处和上一个示例基本上是一样的。区别在于此时 `car.getBrand` 没有显式地赋值。结果是一样的,得到的只是一个普通函数,绑定的对象是 `button`。

换句话说,当我们在某个对象上执行一个方法, 虽然这个方法可能是在其他对象里面定义的, 但此时 `this` 关键字已经不再指向原来的对象了, 而是指向调用此方法的对象。

比如说在上面的示例中: 我们用的是 `el`(即 button) 来执行 `car.getBrand`,而没用 `car` 对象, 尽管最初是定义在 `car` 对象里面。因此, `this`指向的是 `el`,而不是 `car`。

如果确实需要保持对原来对象的引用, 那么需要显式地将 `getBrand()` 函数绑定到 `car` 对象, 可以使用每个 function 都有的 `bind()` 方法。


	el.addEventListener("click", car.getBrand.bind(car));

那么现在, 就可以按照想要的方式运行了。

### 3. 在闭包(Closure)之中使用 `this`

在闭包之中使用 `this` 也可能会引起错误。看下面的示例:


	var car = {
	  brand: "Nissan",
	  getBrand: function(){
	    var closure = function(){
	      console.log(this.brand);
	    };
	    return closure();
	  }
	};
	
	car.getBrand();   // output: undefined


在这里,我们得到的输出是 `undefined`, 因为闭包函数(即内部函数)不能访问到外部函数的 `this` 变量。所以最终的结果就是 `this.brand` 等价于 `window.brand`, 因为内部函数中的 `this` 绑定的是全局对象。

针对这种问题, 我们可以把 `this` 绑定给 `getBrand()` 函数。


	var car = {
	  brand: "Nissan",
	  getBrand: function(){
	    var closure = function(){
	      console.log(this.brand);
	    }.bind(this);// 注意这里
	    return closure();
	  }
	};
	
	car.getBrand();   // output: Nissan


此处的绑定相当于 `car.getBrand.bind(car)` 。

另一种处理闭包的常用方法是先将 `this` 赋值给另一个变量, 来避免不必要的改变。

	var car = {
	  brand: "Nissan",
	  getBrand: function(){
	    var self = this;
	    var closure = function(){
	      console.log(self.brand);
	    };
	    return closure();
	  }
	};
	
	car.getBrand();   // output: Nissan


这里, 我们可以把_this 值赋给 `_this`, `that`, `self`, `me`, `my`, `context` 之类的变量, 或者是其他有这一类含义的变量名。关键是保留下外层的对象引用。

## ECMAScript 6 中的高科技


在上面的示例中, 我们看到了 “语法形式上的 `this`” 用法，也就是我们可以把 `this` 赋值给另一个变量。在 ECMAScript 6 中我们可以用更优雅的新技术, 箭头函数(arrow function) 来实现类似的效果。

[Arrow-functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 并不是通过 `function` 关键字创建的, 而是通过所谓的“胖箭头” 运算符(fat arrow， `=>`)来实现的。 与一般的函数不一样, 箭头函数从其所处的封闭范围(enclosing scope)中取得 `this`值 。箭头函数的语法绑定不会被覆盖, 即使使用了 new 操作符。

下面我们来看看箭头函数是如何替代 `var self = this;` 这种语句的:


	var car = {
	  brand: "Nissan",
	  getBrand: function(){
	    // 箭头函数保留了语法上的 "this" 作用域.
	    var closure = () => {   
	      console.log(this.brand);
	    };
	    return closure();
	  }
	};
	
	car.getBrand();   // output: Nissan


## 关于 `this` 的知识点

和其他机制一样, `this` 关键字也遵循一些简单的规则, 如果你了解了这些规则，那就可以用得顺畅一些。下面快速回顾这两节中所学的知识点:

- 在下列情况下 `this` 指向的是全局对象:
  - 在最外层的代码中, 不在任何 function 里面
  - 不是对象方法(method)的函数(method)里面
  - 不是构造函数(constructor)的函数里面
- 当函数作为父对象的属性被调用时, `this` 指向的是父对象(parent object)。
- 当函数通过  `call()` 、 `apply()` 或者 `bind()`调用时, `this`指向的是传递给这些方法的第一个参数。如果第一个参数是 `null`
- 或者不是一个对象, 那么 `this` 指向的是全局对象。
- 在使用 `new` 操作符来调用一个函数时, `this` 指向的是新创建的这个对象。
- 在 ECMAScript 6 中使用箭头函数时,  `this` 根据所处的语法作用域指向上级对象(parent object)。

了解了这些简单直接的规则,我们就可以很容易地看出 `this` 指向的是哪个对象, 如果指向不正确, 那可以用学过的这些黑科技来搞定。

## 总结

要掌握 JavaScript 中的 `this` 是不太容易的, 但如果你用得足够多, 你自然就理解了。希望本系列的博文能帮你打好基础，并加深理解，然后下次你碰到相关问题的时候能够心中有数。



## 推荐阅读

阮一峰老师的:  [ECMAScript 6入门](http://es6.ruanyifeng.com/)

CNBlog : [Javascript Context和Scope的一些学习总结](http://www.cnblogs.com/rush/archive/2013/03/24/2979432.html)

infoq: [深入浅出ES6(1~10)系列](http://www.infoq.com/cn/articles/es6-in-depth-an-introduction)

babeljs-ES6: [https://babeljs.io/repl/](https://babeljs.io/repl/)

[掌握JS的“`this`” (一)](../20_0_JavaScript_this_InnerWorkings/Revealing_this_InnerWorkings.md)

 [掌握JS中的“`this`” (二)](../20_JavaScript_Mastering_this/JavaScript_Mastering_this.md)



## 相关链接

GitHub版本: [https://github.com/cncounter/translation/blob/master/tiemao_2015/20_JavaScript_Mastering_this/JavaScript_Mastering_this.md](https://github.com/cncounter/translation/blob/master/tiemao_2015/20_JavaScript_Mastering_this/JavaScript_Mastering_this.md)

原文链接: [http://www.sitepoint.com/mastering-javascripts-this-keyword/](http://www.sitepoint.com/mastering-javascripts-this-keyword/)

作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

日期: 2015年07月14日
