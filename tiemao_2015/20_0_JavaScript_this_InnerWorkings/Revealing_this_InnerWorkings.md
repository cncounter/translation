# 掌握JS中的“`this`” (一)


学会一门语言编程，并不代表就真正地理解它和正确地使用它。JavaScript 同样如此。尽管JS(JavaScript的简称)是一个很容易上手的语言, 但是里面有许多细节,初学者是不了解的, 即使是经验丰富的JS高手也经常会掉进坑里去。

对很多有经验的程序员来说, `this` 关键字如何运作也是一个谜题。简单地讲, this 只是一个别名引用(referencing alias) - 他只知道当前指向谁, 这才是最棘手的地方。

本文的目的是消除混乱并介绍 this 关键字的内部运作原理。


## 那么, this是什么呢?

##

简而言之,这是一个特殊的标识符keyword-automatically范围中定义的每个function-pointing函数正在执行的“所有者”。但是,充分把握其棘手的特性,我们需要回答两个关键问题:

这是怎么形成的?
每次调用一个JavaScript函数,创建一个新对象包含参数被传递的信息,如何调用函数,函数被调用的地方,等等。的一个主要属性的对象是这个引用,这是自动绑定到对象的函数是一个方法。

注意:好奇,这是详细的§10.4.3 ECMAScript语言规范和部分的链接。

	var car = {
	  brand: "Nissan",
	  getBrand: function(){
	    console.log(this.brand);
	  }
	};
	
	car.getBrand();
	// output: Nissan


在这个例子中,使用。品牌,是汽车对象的引用。所以,这。品牌car.brand是一样的。

这是指什么呢?

它的价值,传递给所有的功能,是基于上下文在运行时调用的函数。这不是关心的范围和函数声明,而是从哪里被称为(即上下文)。

每一行JavaScript代码在执行上下文中运行。这指的是重新定义的对象每次输入一个新的执行上下文和仍是固定的,直到它转移到一个不同的上下文。找到执行上下文(绑定)我们需要找到call-site-the位置的函数被调用的代码(不宣布的)。

让我们展示在下面的例子:


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


即使两个myCar.getBrand()和getBrand()指向同一个函数,这是不同的,因为它的价值是基于的上下文getBrand()被调用。

我们已经知道,在一个函数,这是绑定到对象的函数是一个方法。在第一个函数调用,myCar对象,而在第二个对象窗口(getBrand window.getBrand()是一样的())。因此,一个不同的上下文产生不同的结果。

调用上下文
现在,让我们看看这个点的时候放入不同的上下文。

全局作用域
所有JavaScript运行时都有独特的对象称为全局对象。在浏览器中,全局对象窗口对象。在节点。js,叫做全局对象。

在全球执行上下文(以外的任何函数),这指的是全局对象,是否在严格模式下。

局部作用域
在一个函数,这取决于函数的值。有三个主要变化:

这个用在一个简单的函数调用
第一个变化是一个独立的函数调用,我们直接调用一个函数。


	function simpleCall(){
	  console.log(this);
	}
	
	simpleCall();
	// output: the Window object

在这种情况下,这不是价值设定的电话。由于代码没有运行在严格模式下,这必须是一个对象的价值它默认为全局对象。

在严格模式下,这是无论设置为当进入执行上下文。如果没有定义,它仍然是未定义的,在接下来的例子中我们可以看出:

	function simpleCall(){
	  "use strict";
	  console.log(this);
	}
	
	simpleCall();
	// output: undefined

这用于对象的方法

我们可以存储一个函数在一个对象的属性,将它转化为一个方法,我们可以通过这个对象调用。当一个函数被调用对象的方法,它的这个值设置为调用对象的方法。


	var message = {
	  content: "I'm a JavaScript Ninja!",
	  showContent: function() {
	    console.log(this.content);
	  }
	};
	
	message.showContent();   
	// output: I'm a JavaScript Ninja!

在这里,showContent消息的对象()是一个方法,因此这。等于message.content内容。

这用于构造器函数
我们可以通过新操作符调用一个函数。在这种情况下,函数变成一个构造函数工厂对象。与上面所讨论的,简单的函数调用和方法调用构造函数调用通过一个全新的对象的值,和隐式返回新对象的结果。

当一个函数作为构造函数(新关键字),它的这个值绑定到新创建的对象。如果我们错过了新的关键字,那么这将是一个普通函数,这将指向窗口对象。

	function Message(content){
	  this.content = content;
	  this.showContent = function(){
	    console.log(this.content);
	  };
	}
	
	var message = new Message("I'm JavaScript Ninja!");
	
	message.showContent();
	// output: I'm JavaScript Ninja!

在上面的例子中,我们有一个构造函数指定消息()。通过使用新的操作符我们创建一个全新的对象命名的消息。我们还通过构造函数的一个字符串,它作为我们的新对象的内容属性集。最后一行代码中我们看到,成功输出这个字符串,因为这是指向新创建的对象,而不是构造函数本身。

如何成功地操纵它吗
在本节中,我们将研究一些内置的机制控制的行为。

在JavaScript中,函数是所有对象,因此他们可以有方法。两种方法,所有功能,适用于()和()。我们可以用这些方法来改变上下文无论我们需要,因此,显式地设置的值。

apply()方法接受两个参数:一个对象设置这个,和(可选)数组传递给函数的参数。

call()方法一样适用于(),但我们通过单独的参数而不是一个数组。

让我们看看在行动:


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


在上面的例子中,我们有一个构造函数指定消息()。通过使用新的操作符我们创建一个全新的对象命名的消息。我们还通过构造函数的一个字符串,它作为我们的新对象的内容属性集。最后一行代码中我们看到,成功输出这个字符串,因为这是指向新创建的对象,而不是构造函数本身。

如何成功地操纵它吗
在本节中,我们将研究一些内置的机制控制的行为。

在JavaScript中,函数是所有对象,因此他们可以有方法。两种方法,所有功能,适用于()和()。我们可以用这些方法来改变上下文无论我们需要,因此,显式地设置的值。

apply()方法接受两个参数:一个对象设置这个,和(可选)数组传递给函数的参数。

call()方法一样适用于(),但我们通过单独的参数而不是一个数组。

让我们看看在行动:


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


在这个例子中,使用bind()方法以类似的方式,但与调用()和()方法,应用warrior.bind()创建一个新的函数(战士一样的身体和范围()),而不是修改原始战士()函数。新功能的行为就像旧的一样,但由于其接收对象绑定到属性,而旧的保持不变。

总结
所以,就是这样。这几乎是所有你需要知道的关于这个关键字,以便正确使用它,有更多的信心。当然,也有一些棘手的零件和一些常见的路上你可能面对的问题。这些将在后续文章中探讨,所以请继续关注。



原文链接: [Revealing the Inner Workings of JavaScript’s “this” Keyword](http://www.sitepoint.com/inner-workings-javascripts-this-keyword/)

原文日期: 2015年05月01日

翻译日期: 2015年09月17日

作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

