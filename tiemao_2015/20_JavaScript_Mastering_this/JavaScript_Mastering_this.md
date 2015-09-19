# 掌控JS的“`this`” (二)


在上一篇文章 [掌控JS的“`this`” (一)](../20_0_JavaScript_this_InnerWorkings/Revealing_this_InnerWorkings.md) 里面, 我们学会了如何正确使用JavaScript中的 `this` 关键字及其基本原理。我们也知道决定 `this` 指向哪个对象的关键因素, 是找出当前的执行上下文(execution context)。但如果执行上下文不按正常的方式进行设置,问题可能就会变得很棘手。在本文中,我会着重提示在哪些地方会发生这种情况, 以及用什么方式可以弥补。

## 解决常见问题

在本节中,我们将探讨一些使用 this 关键字时最常见的问题, 并了解如何处理这种情况。

### 1. 在拆取后(Extracted)的方法中使用 `this`

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

如果我们从对象中拆取(extract)某个方法, 那么这个方法(method)就会变成了一个普通的函数(function)。他和原来对象的联系被切断了(severed), 所以不再按照原来的方式运行。换句话说, 一个拆取出来的函数就不再绑定到原来的对象上了。

如何处理这种情况呢? OK,如果还想指向原来的那个对象的话,就需要在赋值给 `getCarBrand` 的时候显式地将 `getBrand()` 函数绑定(bind) 到 `car` 对象, 当然, 我们可以使用 [bind()方法](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)。


	var getCarBrand = car.getBrand.bind(car);
	getCarBrand();   // output: Nissan


现在,我们得到了期望的正确输出,因为我们成功地重新定义想要的上下文。

### 2. this 用于回调
下一个问题发生在我们通过一个方法(使用这个作为参数)作为一个回调函数。例如:


> `<button id="btn" type="button">Get the car's brand</button>`

	var car = {
	  brand: "Nissan",
	  getBrand: function(){
	    console.log(this.brand);
	  }
	};
	
	var el = document.getElementById("btn");
	el.addEventListener("click", car.getBrand);


即使我们使用汽车。getBrand,我们只有getBrand()函数附加到按钮对象上。

传递一个函数的参数是一个隐式作业,这里所发生的是几乎与前面的示例相同。所不同的是,现在的车。getBrand没有显式地指定,但隐式。,结果都是一样,我们得到的是一个普通函数,对象绑定到按钮。

换句话说,当我们执行一个方法一个对象,这是不同于最初定义对象的方法,这个关键字不再是指原来的对象,而不是调用方法的对象。

参照我们的例子:我们正在执行的车。el getBrand(按钮元素),而不是汽车对象,在它最初的定义。因此,这不再是指汽车,而埃尔。

如果我们想要保持对原始对象的引用完整,再一次,我们需要显式地将getBrand()函数绑定到汽车对象通过使用bind()方法。


	el.addEventListener("click", car.getBrand.bind(car));

现在,一切都按预期工作。

3这个内部使用闭包
当这另一个实例的上下文可能会被误认为是当我们使用这一个闭包的内部。考虑下面的例子:


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


在这里,我们得到的输出是未定义的,因为关闭功能(内部函数)无法获得外部函数的变量。最终的结果是这样。品牌等于窗口。品牌,因为这在内部函数绑定到全局对象。

为了解决这个问题,我们需要把这个绑定到getBrand()函数。


	var car = {
	  brand: "Nissan",
	  getBrand: function(){
	    var closure = function(){
	      console.log(this.brand);
	    }.bind(this);
	    return closure();
	  }
	};
	
	car.getBrand();   // output: Nissan



这个绑定相当于car.getBrand.bind(汽车)。

修复闭包,另一个流行的方法是将这个值分配给另一个变量,从而防止不必要的改变。

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


这里,这个可以分配给_this的值,,自我,我,我,上下文对象的伪名字,或者其他适合你的。重点是保持原来的对象的引用。

ECMAScript 6拯救
在前面的示例中,我们看到一个引物在被称为“词法”当我们将这个值设置为另一个变量。ECMAScript 6中我们可以使用类似,但更优雅,通过新技术,适用于箭头功能。

Arrow-functions不是通过创建函数关键字,而是通过所谓的“肥箭头”运算符(= >)。与常规函数,箭头函数取这个值从他们立即封闭范围。箭的词法绑定函数不能被覆盖,即使有新的操作员。

现在让我们看看箭头函数可以用来替代var自我=;语句。


	var car = {
	  brand: "Nissan",
	  getBrand: function(){
	    // the arrow function keeps the scope of "this" lexical
	    var closure = () => {   
	      console.log(this.brand);
	    };
	    return closure();
	  }
	};
	
	car.getBrand();   // output: Nissan


你需要记住什么
我们看到这个字,像其他机制,遵循一些简单的规则,如果我们知道,然后我们可以用信心十足的机制。所以,让我们快速回顾一下所学(这和前一篇文章):

这指的是全球对象在下列情况下:
在最外层的背景下,以外的任何功能块
函数没有方法的对象
在没有对象构造函数的函数
当一个函数被调用作为父对象的一个属性,这指的是父对象。
当一个函数被调用时使用电话()或(),应用或bind(),这是指第一个参数传递给这些方法。如果第一个参数为空或不是对象,这指的是全局对象。
当一个函数被调用新运营商,这指的是新创建的对象。
箭函数时使用(ECMAScript中引入6),这依赖于词法作用域,指的是父对象。
了解这些直接和简单的规则,我们可以很容易地预测这将指出,如果它不是我们想要的,我们知道哪些方法可以用来解决它。

总结
JavaScript是掌握这个字是一个棘手的概念,但有足够的实践中,掌握它。我希望本文和前一篇文章,作为你的理解和良好的基础被证明是一个有价值的参考下次让你头痛。





GitHub版本: [https://github.com/cncounter/translation/blob/master/tiemao_2015/20_JavaScript_Mastering_this/JavaScript_Mastering_this.md](https://github.com/cncounter/translation/blob/master/tiemao_2015/20_JavaScript_Mastering_this/JavaScript_Mastering_this.md)

原文链接: [http://www.sitepoint.com/mastering-javascripts-this-keyword/](http://www.sitepoint.com/mastering-javascripts-this-keyword/)

作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

日期: 2015年07月14日
