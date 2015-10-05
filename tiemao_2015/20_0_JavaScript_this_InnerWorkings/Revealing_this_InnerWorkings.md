# 掌握JS中的“`this`” (一)

> **译者注:** 一般来说，`function` 翻译为函数, `method` 翻译为方法。
> 
> 我们一般说， 某某对象的方法， 而不说 “某某对象的函数”。原因是在面向对象中, 一个对象就是一个具体额实例，有自己的方法。 而函数，是和对象没关系的。
>
> 另外,  `scope`(作用域) 和 `context`(上下文) 也是一个容易迷糊的地方。请参考: [Javascript Context和Scope的一些学习总结](http://www.cnblogs.com/rush/archive/2013/03/24/2979432.html)
>
> 推荐阅读: [深入浅出ES6(1~10)系列](http://www.infoq.com/cn/articles/es6-in-depth-an-introduction)

会用一门语言来写程序，并不代表就能正确地理解和使用该语言。当然， JavaScript 也是如此。尽管 **JS**(JavaScript 的简称)是一门很容易上手的语言, 但里面其实有许多细节, 初学者可能并不了解, 即使是经验丰富的JS高手也偶尔会掉到坑里去。

很多有经验的程序员对 `this` 在 JS 内部是如何运作的也是一头雾水。通俗点讲, `this` 只是一个引用别名(referencing alias) - 这个别名只知道当前指向的那个对象, 而这也是最棘手的地方。

本文为你理清思路，并介绍 `this` 关键字的内部运作原理。


## 那么, `this` 是个什么鬼?

简而言之, `this` 是一个特殊的标识符关键字 —— 在每个 function 中自动根据作用域(scope) 确定, 指向的是此次调用的 “**所有者,owner**”。但要完全搞定这个问题, 我们需要回答两个关键问题:

### `this` 是如何创建的?

每调用一次 JavaScript 函数时，都会创建一个新的对象， 其中的信息包括: 传入了哪些参数, 函数是如何调用(invoked)的, 函数是在哪里被调用(called)的,等等。该对象中还有一个重要的属性是 `this` 引用, 函数是哪个对象的方法，`this` 就会自动绑定到该对象。

>**提示:** 详情请参考 [ECMAScript 语言规范 §10.4.3节](http://www.ecma-international.org/ecma-262/5.1/#sec-10.4.3) 以及其中的相关链接。

	var car = {
	  brand: "Nissan",
	  getBrand: function(){
	    console.log(this.brand);
	  }
	};
	
	car.getBrand();
	// output: Nissan


在这个例子中, 使用的是 `this.brand`, 这是 `car` 对象的引用。所以此时, `this.brand` 等价于 `car.brand` 。

### `this` 指向的是谁


在所有 function 中, `this` 的值都是根据上下文(**context**, 函数在调用时刻所处的环境)来决定的。`this` 的作用域(scope) 与函数定义的位置没有关系, 而是取决于函数在哪里被调用( where they are called from ;i.e. the context)。

每一行JavaScript代码都是在**执行上下文**([execution context](http://davidshariff.com/blog/what-is-the-execution-context-in-javascript/))中运行的。`this` 指向的对象在每次进入新的执行上下文后是固定的, 直到跳转(shifted)到另一个不同的上下文才发生改变。决定执行上下文(以及 `this` 的绑定)需要我们去找出调用点(call-site), 调用点即函数在代码中调用的位置。

让我们看下面的示例:


	var brand = 'Nissan';
	var myCar = {brand: 'Honda'};
	
	var getBrand = function() {
	  console.log(this.brand);
	};
	
	myCar.getBrand = getBrand;
	myCar.getBrand();
	// output: Honda
	
	getBrand();
	// output: Nissan


虽然 `myCar.getBrand()` 和 `getBrand()` 指向的是同一个函数, 但其中的 `this` 是不同的,因为它取决于 `getBrand()` 在哪个上下文中调用。

我们已经知道,  function 是哪个对象的方法, 在函数中, `this` 就绑定到这个对象。

上面的代码里，第一次函数调用对应的是 `myCar` 对象, 而第二次对应的是 `window` 【 此时 `getBrand()` 等价于 `window.getBrand()` 】。因此,不同的上下文产生的是不同的结果。

## 调用上下文


下面,让我们看看不同的上下文中`this`的指向。

### 全局作用域(Global Scope)

所有的JavaScript 运行时都有唯一的全局对象(**global object**)。在浏览器中,全局对象是`window` 。而在 **Node.js**里面是 `global`。

在全局执行上下文中(任何函数之外的代码), `this` 指向的是全局对象, 不管是否在严格模式下(`strict mode`)。


### 局部作用域(Local Scope)

在函数中, `this` 取决于函数是怎么调用的。分三种情况:

#### 1. 在简单函数调用(Simple Function Call)中使用`this` 

第一种情形是直接调用一个独立的函数。


	function simpleCall(){
	  console.log(this);
	}
	
	simpleCall();
	// output: the Window object


在这种情况下,`this`值没有被 call 设置。因为代码不是运行在严格模式下,  `this` 又必须是一个对象, 所以他的值默认为全局对象。

如果是在严格模式([strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode))下, 进入执行上下文时设置为什么值那就是什么值。如果没有指定, 那么就一直是`undefined`, 如下所示:

	function simpleCall(){
	  "use strict";
	  console.log(this);
	}
	
	simpleCall();
	// output: undefined

#### 2. 在对象的方法(Object’s Method)中使用 `this` 

将函数保存为对象的属性, 这样就转化为一个方法, 可以通过对象调用这个方法。当函数被当成对象的方法来调用时, 里面的 `this` 值就被设置为调用方法的对象。


	var message = {
	  content: "I'm a JavaScript Ninja!",
	  showContent: function() {
	    console.log(this.content);
	  }
	};
	
	message.showContent();   
	// output: I'm a JavaScript Ninja!

`showContent()` 是 `message` 对象的一个方法, 所以此时 `this.content` 等价于 `message.content`。

### 3. 在构造函数(Constructor Function)中使用 `this`

我们可以通过 `new` 操作符来调用函数。在这种情况下,这个函数就变成了构造函数(也就是一个对象工厂)。与前面讨论的简单函数调用和方法调用不同， 构造函数调用会传入一个全新的对象作为 `this` 的值, 并且隐式地返回新构造的这个对象作为结果【简言之, 新构造对象的内存是 new 操作符分配的, 构造函数只是做了一些初始化工作】。

当一个函数作为构造器使用时(通过 `new` 关键字), 它的 `this` 值绑定到新创建的那个对象。如果没使用 `new` 关键字, 那么他就只是一个普通的函数, `this` 将指向 `window` 对象。

	function Message(content){
	  this.content = content;
	  this.showContent = function(){
	    console.log(this.content);
	  };
	}
	
	var message = new Message("I'm JavaScript Ninja!");
	
	message.showContent();
	// output: I'm JavaScript Ninja!

在上面的示例中, 有一个名为 `Message()` 的构造函数。通过使用 `new` 操作符创建了一个全新的对象，名为 `message`。同时还通传给构造函数一个字符串, 作为新对象的`content `属性。通过最后一行代码中可以看到这个字符串成功地打印出来了, 因为 `this` 指向的是新创建的对象, 而不是构造函数本身。

## 如何正确地使用 `this`

在本节中,我们将学习一些决定 `this` 行为的内部机制。

在JavaScript中,所有的函数都是对象, 因此函数也可以有自己的方法。所有的函数都有的两个方法， 是 [apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 和 [call()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call). 。我们可以通过这两个方法来改变函数的上下文, 在任何时候都有效, 用来显式地设置 `this` 的值。

`apply()` 方法接收两个参数: 第一个是要设置为 `this` 的那个对象,  第二个参数是可选的，如果要传入参数, 则封装为数组作为 `apply()` 的第二个参数即可。

`call()` 方法 和 `apply()` 基本上是一样的, 除了后面的参数不是数组， 而是分散开一个一个地附加在后面。

下面来演练一下:


	function warrior(speed, strength){
	  console.log(
	    "Warrior: " + this.kind +
	    ", weapon: " + this.weapon +
	    ", speed: " + speed +
	    ", strength: " + strength
	  );
	}
	
	var warrior1 = {
	  kind: "ninja",
	  weapon: "shuriken"
	};
	
	var warrior2 = {
	  kind: "samurai",
	  weapon: "katana"
	};
	
	warrior.call(warrior1, 9, 5);
	// output: Warrior: ninja, weapon: shuriken, speed: 9, strength: 5
	warrior.apply(warrior2, [6, 10]);
	// output: Warrior: samurai, weapon: katana, speed: 6, strength: 10


在这里,我们有一个工厂函数 `warrior()`, 通过传入不同的战士对象创建不同类型的warrior(战士)。那么，在工厂函数里面,  `this` 将指向我们通过`call()` 和/或 `apply()`传入的对象。

在第一个函数调用中,我们使用`call()` 方法来将 `this` 设置为 `warrior1`对象, 并传入需要的其他参数, 参数间用逗号分隔。在第二个函数调用中, 其实都差不多, 只是传入的是 `warrior2` 对象, 并将必要参数封装为一个数组。

除了`call()` 和 `apply()` 以外, ECMAScript 5还增加了 [bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) 方法, 在调用一个函数或方法时也可以通过 `bind` 方法来绑定 `this` 对象。让我们看下面的例子:



	function warrior(kind){
	  console.log(
	    "Warrior: " + kind +
	    ". Favorite weapon: " + this.weapon +
	    ". Main mission: " + this.mission
	  );
	}
	
	var attributes = {
	  weapon: "shuriken",
	  mission: "espionage"
	};
	
	var ninja = warrior.bind(attributes, "ninja");
	
	ninja();
	// output: Warrior: ninja. Favorite weapon: shuriken. Main mission: espionage


在这个例子中, `bind()`方法的使用方式还是类似的, 但 `warrior.bind()` 创建了一个新的函数(方法体和作用域跟`warrior()`一样)，并没有改动原来的 `warrior()` 函数。新函数的功能和老的一样, 只是绑定到了 `attributes`对象。

>【`bind` 方法和 `call`， `apply` 的区别在于, `bind()` 之后函数并没有执行, 可以传给其他函数, 在某个适当的时机再调用 】

## 总结

So, 与 `this` 有关的知识差不多就是这些。作为初学者，掌握这些你就足够来正确地使用它了, 对自己多点信心！ 当然, 在使用的过程中也可能有一些问题会困扰你, 那么, 欢迎阅读下一篇文章 [掌握JS中的“`this`” (二)](../20_JavaScript_Mastering_this/JavaScript_Mastering_this.md)。


## 推荐阅读

阮一峰老师的:  [ECMAScript 6入门](http://es6.ruanyifeng.com/)

CNBlog : [Javascript Context和Scope的一些学习总结](http://www.cnblogs.com/rush/archive/2013/03/24/2979432.html)

infoq: [深入浅出ES6(1~10)系列](http://www.infoq.com/cn/articles/es6-in-depth-an-introduction)

babeljs-ES6: [https://babeljs.io/repl/](https://babeljs.io/repl/)

[掌握JS中的“`this`” (一)](../20_0_JavaScript_this_InnerWorkings/Revealing_this_InnerWorkings.md)

 [掌握JS中的“`this`” (二)](../20_JavaScript_Mastering_this/JavaScript_Mastering_this.md)



## 相关链接


原文链接: [Revealing the Inner Workings of JavaScript’s “this” Keyword](http://www.sitepoint.com/inner-workings-javascripts-this-keyword/)

原文日期: 2015年05月01日


翻译日期: 2015年09月17日

作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

