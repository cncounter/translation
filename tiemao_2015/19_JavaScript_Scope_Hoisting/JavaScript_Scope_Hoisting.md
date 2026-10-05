# JavaScript 变量作用域及声明提前



每一栋建筑都需要建立在坚实的地基之上。理解 JavaScript 中的变量作用域是打好坚实根基的关键之一。本文将解释 JavaScript 的作用域系统是如何运作的。我们还会介绍一个相关的话题，称为 [hoisting](http://www.sitepoint.com/back-to-basics-javascript-hoisting/)。


## 变量作用域

想要高效地使用 JavaScript，你需要首先理解的概念之一就是变量作用域。变量的作用域由变量声明的位置决定，它定义了程序中可以访问某个特定变量的范围。

作用域规则因语言而异。JavaScript 有两种作用域 —— 全局作用域和局部作用域。任何在函数外部声明的变量都属于全局作用域，因此在代码的任何地方都可以访问。每个函数都有自己的作用域，在该函数内部声明的任何变量只能从该函数及其嵌套函数中访问。因为 JavaScript 中的局部作用域是由函数创建的，所以它也被称为函数作用域。当我们把一个函数放进另一个函数内部时，就创建了嵌套作用域。

目前，与许多其他语言不同，JavaScript 不支持块级作用域。这意味着，在一个像 `for` 循环这样的块结构中声明变量，并不会把该变量限制在循环内。相反，这个变量在整个函数中都可以访问。值得注意的是，即将到来的 [ECMAScript 6 将通过 `let` 关键字支持块级作用域](http://www.sitepoint.com/preparing-ecmascript-6-let-const/)。

为了把问题讲清楚，我们来打个简单的比方。世界上的每个国家都有自己的国界。国界内的一切都属于这个国家的作用域。每个国家里都有许多城市，每个城市都有自己的城市作用域。国家和城市就像 JavaScript 函数一样 —— 它们拥有各自的局部作用域。大陆也是如此。尽管大陆面积巨大，也可以把它们定义为局部作用域。另一方面，世界上的海洋不能被定义为具有局部作用域，因为它实际上包裹着所有的局部对象 —— 大陆、国家、城市 —— 因此，大洋的作用域被定义为全局。我们来看下面的例子：

	var locales = {
	  europe: function() {          // The Europe continent's local scope
	    var myFriend = "Monique";
	 
	    var france = function() {   // The France country's local scope
	      var paris = function() {  // The Paris city's local scope
	        console.log(myFriend);
	      };
	 
	      paris();
	    };
	 
	    france();
	  }
	};
	 
	locales.europe();


[Try out the example in JS Bin](http://jsbin.com/lewufuroqi/1/edit?js,console,output)

现在我们了解了什么是局部作用域和全局作用域，以及它们是如何创建的，接下来就该学习 JavaScript 解释器如何使用它们来查找某个特定的变量了。

回到刚才打的比方，假设我想找一个名叫 Monique 的朋友。我知道她住在巴黎，所以我从那里开始找。在巴黎找不到她时，我就向上一层，把搜索范围扩大到整个法国。但还是没找到她。接着，我又向上一层，再次扩大搜索范围。最后，我在意大利找到了她，在我们的比方里，意大利就相当于欧洲的局部作用域。

在前面的例子中，我的朋友 Monique 由变量 `myFriend` 表示。在最后一行，我们调用 `europe()` 函数，它调用 `france()`，最后当 `paris()` 函数被调用时，查找就开始了。JavaScript 解释器从当前正在执行的作用域开始，一层层向外查找，直到找到目标变量为止。如果在任何作用域中都没有找到该变量，就会抛出一个异常。

这种查找方式称为[词法作用域(静态作用域)](http://en.wikipedia.org/wiki/Lexical_scoping#Lexical_scoping)。程序的静态结构决定了变量的作用域。变量的作用域由它在源代码中的位置决定，嵌套函数可以访问在其外层作用域中声明的变量。无论函数在哪里被调用，甚至以何种方式被调用，它的词法作用域都只取决于函数被声明的位置。

在 JavaScript 中，同名的变量可以在多层嵌套作用域中分别定义。在这种情况下，局部变量优先于全局变量。如果你声明了一个同名的局部变量和一个全局变量，那么在函数内部使用它时，局部变量会优先。这种行为称为遮蔽(shadowing)。简单地说，内层变量会遮蔽外层变量。

这正是一个 JavaScript 解释器查找某个特定变量时所采用的机制。它从当时正在执行的最内层作用域开始，一直向外查找，直到找到第一个匹配项为止，而不管外层是否还有其他同名变量。我们来看一个例子：

	var test = "I'm global";
	 
	function testScope() {
	  var test = "I'm local";
	 
	  console.log (test);     
	}
	 
	testScope();           // output: I'm local
	 
	console.log(test);     // output: I'm global


[Try out the example in JS Bin](http://jsbin.com/lewufuroqi/2/edit?js,console,output)

正如我们所看到的，即使名称相同，在执行完 `testScope()` 函数后，局部变量也没有覆盖全局变量。但这并不总是成立的。我们再来看这种情况：


	var test = "I'm global";
	 
	function testScope() {
	  test = "I'm local";
	 
	  console.log(test);     
	}
	 
	console.log(test);     // output: I'm global
	 
	testScope();           // output: I'm local
	 
	console.log(test);     // output: I'm local (the global variable is reassigned)


[Try out the example in JS Bin](http://jsbin.com/lewufuroqi/3/edit?js,console,output)

这一次，局部变量 `test` 覆盖了同名的全局变量。当我们运行 `testScope()` 函数内部的代码时，全局变量被重新赋值了。如果给一个局部变量赋值时没有先用 `var` 关键字声明，它就会变成全局变量。为了避免这种不期望的行为，你应该始终在使用局部变量之前先声明它们。任何在函数内部用 `var` 关键字声明的变量都是局部变量。声明变量被认为是种最佳实践。

注意 —— 在[严格模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)下，如果没有先声明变量就给变量赋值，会报错。


## 声明提前

JavaScript 解释器在幕后做了很多事情，其中之一叫做声明提前(hoisting)。如果你不了解这种“隐藏”的行为，可能会造成很多困惑。理解 JavaScript 变量行为的最好方式，是始终把它们想象成由两部分组成：声明(declaration)和赋值(assignment)：


	var state;             // variable declaration
	state = "ready";       // variable definition (assignment)
	 
	var state = "ready";   // declaration plus definition


在上面的代码中，我们先声明变量 `state`，然后给它赋值 “ready”。在最后一行代码中，我们看到这两个步骤可以合并。但你需要记住的是，尽管它们看起来像一条语句，实际上，JavaScript 引擎会把这一条语句当作两条独立的语句来处理，就像示例中前两行那样。

我们已经知道，在一个作用域内声明的任何变量都属于该作用域。但我们还不知道的是，无论变量在某个作用域的哪个位置声明，所有的变量声明都会被移动到其作用域（全局或局部）的顶部。这就是所谓的声明提前(hoisting)，因为变量声明被提升到了作用域的顶部。注意，声明提前只移动声明部分。任何赋值都留在原地。我们来看一个例子：

	console.log(state);   // output: undefined
	var state = "ready";

[Try out the example in JS Bin](http://jsbin.com/lewufuroqi/4/edit?js,console,output)

如你所见，当我们打印 `state` 的值时，输出的是 `undefined`，因为我们是在实际赋值之前引用了它。你可能以为会抛出一个 ReferenceError，因为 `state` 还没有声明。但你不知道的是，这个变量已经在幕后被声明了。下面是 JavaScript 引擎解释这段代码的方式：


	var state;           // moved to the top
	console.log(state);   
	state = "ready";     // left in place

声明提前也会影响函数声明。但在看示例之前，我们先来了解一下函数声明和函数表达式之间的区别。

	function showState() {}          // function declaration
	var showState = function() {};   // function expression


区分函数声明和函数表达式最简单的方法，是检查语句中 `function` 这个词的位置。如果 `function` 位于语句的最前面，那么它就是函数声明。否则，就是函数表达式。

函数声明会被完整地提前。这意味着整个函数体都会被移动到顶部。这让你可以在函数声明之前就调用它：


	showState();            // output: Ready
	 
	function showState() {
	  console.log("Ready");
	} 
	 
	var showState = function() {
	  console.log("Idle");
	};


[Try out the example in JS Bin](http://jsbin.com/lewufuroqi/5/edit?js,console,output)

前面这段代码之所以能工作，是因为 JavaScript 引擎把 `showState()` 函数的声明及其全部内容移动到了作用域的开头。这段代码被解释成这样：


	function showState() {     // moved to the top (function declaration)
	  console.log("Ready");
	} 
	 
	var showState;            // moved to the top (variable declaration)
	 
	showState();  
	 
	showState = function() {   // left in place (variable assignment)
	  console.log("Idle");
	};


你可能已经注意到，只有函数声明会被提前，函数表达式则不会。当一个函数被赋值给变量时，规则和变量声明提前一样（只移动声明，而赋值留在原地）。

在上面的代码中，我们看到函数声明优先于变量声明。而在下一个例子中我们会看到，当函数声明遇上变量赋值时，后者优先。

	var showState = function() {
	  console.log("Idle");
	};
	 
	function showState() {
	  console.log("Ready");
	} 
	 
	showState();            // output: Idle


[Try out the example in JS Bin](http://jsbin.com/lewufuroqi/6/edit?js,console,output)

这一次，我们在最后一行调用 showState() 函数，情况就变了。现在我们得到输出 “Idle”。下面是 JavaScript 引擎解释后的样子：


	function showState(){        // moved to the top (function declaration)
	  console.log("Ready");
	} 
	 
	var showState;               // moved to the top (variable declaration)
	 
	showState = function(){      // left in place (variable assignment)
	  console.log("Idle");
	};
	 
	showState();


## 需要记住的要点

- 所有的声明，无论是函数还是变量，都会在你代码的任何部分执行之前，被提前到所在作用域的顶部。
- 函数先被提前，然后才是变量。
- 函数声明优先于变量声明，但不优先于变量赋值。






GitHub版本: [https://github.com/cncounter/translation/blob/master/tiemao_2015/19_JavaScript_Scope_Hoisting/JavaScript_Scope_Hoisting.md](https://github.com/cncounter/translation/blob/master/tiemao_2015/19_JavaScript_Scope_Hoisting/JavaScript_Scope_Hoisting.md)

原文链接: [http://www.sitepoint.com/demystifying-javascript-variable-scope-hoisting/](http://www.sitepoint.com/demystifying-javascript-variable-scope-hoisting/)

作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

日期: 2015年07月14日
