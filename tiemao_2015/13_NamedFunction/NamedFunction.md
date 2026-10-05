# JavaScript函数表达式详解

###

看到一篇译文: [揭秘命名函数表达式](http://www.cnblogs.com/TomXu/archive/2011/12/29/2290308.html)


### 简介

令人意外的是, 命名函数表达式(named function expression)这个话题在网上似乎没有得到足够好的覆盖。这大概就是为什么会有那么多误解流传。在本文中, 我会尝试对这类奇妙的 JavaScript 结构做一个梳理——既有理论层面, 也有实践层面; 包括它们好的一面、坏的一面以及丑陋的一面。

一句话概括, 命名函数表达式只有一个用途——在调试器和性能分析工具(profiler)中显示更具描述性的函数名。当然, 也可以用函数名来做递归, 但你很快就会发现, 如今这往往并不实用。如果你不在意调试体验, 那就没什么好担心的。否则, 请继续往下读, 看看你会遇到哪些跨浏览器的怪异行为, 以及规避它们的技巧。

我会先从总体上解释什么是函数表达式, 以及现代调试器是如何处理它们的。你也可以直接跳到最后的解决方案部分, 那里说明了如何安全地使用这些结构。


### 函数表达式 vs. 函数声明

在 ECMAScript 中, 创建函数对象最常见的两种方式之一, 就是函数表达式(Function Expression)或函数声明(Function Declaration)。两者的区别相当令人困惑。至少对我来说是这样。ECMA 规范唯一说明白的一点是: 函数声明必须始终带有一个标识符(Identifier, 也可以理解成函数名), 而函数表达式则可以省略:

>FunctionDeclaration :
>
>function Identifier ( FormalParameterList <sub>opt</sub> ){ FunctionBody }
>
>FunctionExpression :
>function Identifier <sub>opt</sub> ( FormalParameterList <sub>opt</sub> ){ FunctionBody }


可以看到, 当省略标识符时, 这个“东西”只能是一个表达式。但如果标识符存在呢? 又怎么判断它是函数声明还是函数表达式——毕竟它们看起来一模一样? 原来 ECMAScript 是根据上下文来区分的。如果 `function foo(){}` 是某个赋值表达式的一部分, 那它就被视为函数表达式; 反之, 如果 `function foo(){}` 位于函数体内部, 或者位于(顶层的)程序代码中, 那它就会被解析为函数声明。

	function foo(){} // declaration, since it's part of a <em>Program</em>
	var bar = function foo(){}; // expression, since it's part of an <em>AssignmentExpression</em>
	
	new function bar(){}; // expression, since it's part of a <em>NewExpression</em>
	
	(function(){
	  function bar(){} // declaration, since it's part of a <em>FunctionBody</em>
	})();

函数表达式的另一个不太明显的例子, 是用括号包裹起来的函数——`(function foo(){})`。它是一个表达式, 同样是因为上下文: `(` 和 `)` 构成了分组运算符(grouping operator), 而分组运算符里只能放表达式:

用例子来演示:

	function foo(){} // function declaration
	(function foo(){}); // function expression: due to grouping operator
	
	try {
	  (var x = 5); // grouping operator can only contain expression, not a statement (which `var` is)
	} catch(err) {
	  // SyntaxError
	}

你可能还记得, 用 eval 解析 JSON 时, 通常会给字符串套上括号——`eval('(' + json + ')')`。这当然也是同样的原因——分组运算符(即这里的括号)会强制 JSON 的大括号被解析为表达式, 而不是语句块:

	try {
	  { "x": 5 }; // "{" and "}" are parsed as a block
	} catch(err) {
	  // SyntaxError
	}
	
	({ "x": 5 }); // grouping operator forces "{" and "}" to be parsed as object literal

声明和表达式在行为上有一个微妙的差别。

首先, 函数声明会先于任何其他表达式被解析和求值。即使声明位于源码的最后, 它也会先于作用域中的其他表达式被求值。下面的例子演示了: 当 alert 执行时, fn 函数已经被定义好了, 尽管它是在 alert 之后才声明的:

	alert(fn());
	
	function fn() {
	  return 'Hello world!';
	}

函数声明的另一个重要特点是, 有条件地声明函数并非标准行为, 在不同环境下的表现也不一样。你绝不应该依赖这种有条件声明的函数, 而应该改用函数表达式。

	// Never do this!
	// Some browsers will declare `foo` as the one returning 'first',
	// while others — returning 'second'
	
	if (true) {
	  function foo() {
	    return 'first';
	  }
	}
	else {
	  function foo() {
	    return 'second';
	  }
	}
	foo();
	
	// Instead, use function expressions:
	var foo;
	if (true) {
	  foo = function() {
	    return 'first';
	  };
	}
	else {
	  foo = function() {
	    return 'second';
	  };
	}
	foo();

如果你对函数声明的实际产生式规则(production rules)感兴趣, 可以继续往下读; 否则, 完全可以跳过下面这段摘录。

> 函数声明只允许出现在 Program 或 FunctionBody 中。从语法上说, 它们不能出现在块(Block, 即 `{ ... }`)里——例如 if、while 或 for 语句的块。这是因为块中只能包含语句(Statement), 而不能包含 SourceElement, 而 FunctionDeclaration 属于 SourceElement。如果仔细研究产生式规则就会发现, 表达式想要直接出现在 Block 中, 唯一的途径是作为 ExpressionStatement 的一部分。然而, ExpressionStatement 被明确规定为不能以 `function` 关键字开头, 这正是 FunctionDeclaration 不能直接出现在 Statement 或 Block 中的原因(注意, Block 不过是一组 Statement 的列表)。

由于这些限制, 每当函数直接出现在块中时(比如前面的例子), 它实际上应该被视为语法错误, 而不是函数声明或函数表达式。问题在于, 我见过的几乎所有实现都没有严格按照规则来解析这类函数(例外是 BESEN 和 DMDScript), 它们反而各按自己的私有方式去解释。

值得一提的是, 按照规范, 实现是允许引入语法扩展的(见第 16 节), 同时仍然保持完全合规。这正是如今许多客户端所做的事情。有些客户端把块内的函数声明当作普通的函数声明——直接提升(hoist)到所在作用域的顶部; 另一些则引入不同的语义, 遵循稍微复杂一些的规则。


### 函数语句
ECMAScript 的这类语法扩展之一就是函数语句(Function Statements), 目前由基于 Gecko 的浏览器实现(在 Mac OS X 上的 Firefox 1-3.7a1pre 中测试过)。不知为何, 这个扩展似乎并不广为人知, 无论这是好事还是坏事(MDC 提到过它们, 但非常简略)。请记住, 我们在这里讨论它只是为了学习、满足好奇心; 除非你是在为特定的 Gecko 环境编写脚本, 否则我不建议依赖这个扩展。

那么, 这类非标准结构具有以下一些特点:

函数语句可以出现在任何允许普通语句出现的地方。这当然也包括块:
if (true) {
  function f(){ }
}
else {
  function f(){ }
}
函数语句会像其他任何语句一样被解释, 包括条件执行:
if (true) {
  function foo(){ return 1; }
}
else {
  function foo(){ return 2; }
}
foo(); // 1
// Note that other clients interpet `foo` as function declaration here,
// overwriting first `foo` with the second one, and producing "2", not "1" as a result
函数语句不会在变量实例化(variable instantiation)阶段被声明。它们和函数表达式一样, 是在运行时才声明的。不过, 一旦声明, 函数语句的标识符就对该函数的整个作用域可用。正是这种标识符的可用性, 让函数语句区别于函数表达式(你会在下一章看到命名函数表达式的确切行为)。
// at this point, `foo` is not yet declared
typeof foo; // "undefined"
if (true) {
  // once block is entered, `foo` becomes declared and available to the entire scope
  function foo(){ return 1; }
}
else {
  // this block is never entered, and `foo` is never redeclared
  function foo(){ return 2; }
}
typeof foo; // "function"
一般来说, 我们可以用下面这段符合标准(可惜也更啰嗦)的代码, 来模拟上一个例子中函数语句的行为:
var foo;
if (true) {
  foo = function foo(){ return 1; };
}
else {
  foo = function foo() { return 2; };
}
函数语句的字符串表示与函数声明或命名函数表达式类似(并且会包含标识符——本例中的 `foo`):
if (true) {
  function foo(){ return 1; }
}
String(foo); // function foo() { return 1; }
最后, 早期基于 Gecko 的实现(<= Firefox 3)中似乎存在一个 bug, 即函数语句覆盖函数声明的方式。较早的版本不知为何无法用函数语句覆盖函数声明:
// function declaration
function foo(){ return 1; }
if (true) {
  // overwritting with function statement
  function foo(){ return 2; }
}
foo(); // 1 in FF<= 3, 2 in FF3.5 and later

// however, this doesn't happen when overwriting function expression
var foo = function(){ return 1; };
if (true) {
  function foo(){ return 2; }
}
foo(); // 2 in all versions
注意, 较旧的 Safari(至少 1.2.3、2.0 - 2.0.4 和 3.0.4, 也可能包括更早的版本)实现函数语句的方式与 SpiderMonkey 相同。本章中的所有例子(除了最后一个“bug”例子), 在这些版本的 Safari 中的结果, 与在 Firefox 等浏览器中的结果相同。另一个似乎遵循相同语义的浏览器是黑莓浏览器(至少 8230、9000 和 9530 机型)。这种行为的多样性再次说明, 依赖这些扩展是多么糟糕的主意。

### 命名函数表达式
函数表达式其实相当常见。Web 开发中一种常见的模式是: 根据某种特性检测(feature test)来“分支(fork)”函数定义, 以便获得最佳性能。由于这种分支通常发生在同一个作用域内, 所以几乎总是必须使用函数表达式。毕竟, 正如我们现在所知, 函数声明不应该被有条件地执行:

// `contains` is part of "APE Javascript library" (http://dhtmlkitchen.com/ape/) by Garrett Smith
var contains = (function() {
  var docEl = document.documentElement;

  if (typeof docEl.compareDocumentPosition != 'undefined') {
    return function(el, b) {
      return (el.compareDocumentPosition(b) & 16) !== 0;
    };
  }
  else if (typeof docEl.contains != 'undefined') {
    return function(el, b) {
      return el !== b && el.contains(b);
    };
  }
  return function(el, b) {
    if (el === b) return false;
    while (el != b && (b = b.parentNode) != null);
    return el === b;
  };
})();
很明显, 当函数表达式带有名字时(从技术上讲就是 Identifier), 它就被称为命名函数表达式。你在第一个例子中看到的——`var bar = function foo(){};`——正是如此, 其中 foo 就是函数名。需要记住的一个重要细节是: 这个名字只在新定义的函数作用域内可用; 规范要求该标识符不应对外层作用域可用:

var f = function foo(){
  return typeof foo; // "foo" is available in this inner scope
};
// `foo` is never visible "outside"
typeof foo; // "undefined"
f(); // "function"
那么这些命名函数表达式究竟有什么特别之处呢? 我们为什么想要给它们起名字呢?

原来, 命名函数能带来更愉悦的调试体验。在调试应用程序时, 一个带有描述性条目的调用栈会带来巨大的差别。

#### 调试器中的函数名
当函数有对应的标识符时, 调试器在查看调用栈时会显示该标识符作为函数名。有些调试器(例如 Firebug)还会贴心地显示匿名函数的名字——使它们与函数所赋值的变量名相同。可惜的是, 这类调试器通常依赖简单的解析规则; 这种提取往往非常脆弱, 经常产生错误的结果。

来看一个简单的例子:

function foo(){
  return bar();
}
function bar(){
  return baz();
}
function baz(){
  debugger;
}
foo();

// Here, we used function declarations when defining all of 3 functions
// When debugger stops at the `debugger` statement,
// the call stack (in Firebug) looks quite descriptive:
baz
bar
foo
expr_test.html()
可以看到, foo 调用了 bar, bar 又调用了 baz(而且 foo 本身是从 expr_test.html 文档的全局作用域调用的)。真正棒的是, 即使使用匿名表达式, Firebug 也能设法解析出函数的“名字”:

function foo(){
  return bar();
}
var bar = function(){
  return baz();
}
function baz(){
  debugger;
}
foo();

// Call stack
baz
bar()
foo
expr_test.html()
然而不太妙的是, 如果函数表达式稍微复杂一点(而在现实中, 几乎总是如此), 调试器的所有这些努力就变得毫无用处; 我们最终只会得到一个亮闪闪的问号, 而不是函数名:

function foo(){
  return bar();
}
var bar = (function(){
  if (window.addEventListener) {
    return function(){
      return baz();
    };
  }
  else if (window.attachEvent) {
    return function() {
      return baz();
    };
  }
})();
function baz(){
  debugger;
}
foo();

// Call stack
baz
(?)()
foo
expr_test.html()
当一个函数被赋值给多个变量时, 又会出现另一种困惑:

function foo(){
  return baz();
}
var bar = function(){
  debugger;
};
var baz = bar;
bar = function() {
  alert('spoofed');
};
foo();

// Call stack:
bar()
foo
expr_test.html()
你可以看到调用栈显示 foo 调用了 bar。显然, 事实并非如此。造成困惑的原因是 baz 与另一个函数(那个弹出 “spoofed” 的函数)交换了引用。如你所见, 这种解析——在简单场景下很棒——在任何非平凡(non-trivial)的脚本中往往毫无用处。

归根结底, 命名函数表达式是获得真正可靠调用栈检查的唯一方法。让我们带着命名函数的思路重写前面的例子。注意, 从自执行包装器返回的两个函数, 都被命名为 bar:

function foo(){
  return bar();
}
var bar = (function(){
  if (window.addEventListener) {
    return function bar(){
      return baz();
    };
  }
  else if (window.attachEvent) {
    return function bar() {
      return baz();
    };
  }
})();
function baz(){
  debugger;
}
foo();

// And, once again, we have a descriptive call stack!
baz
bar
foo
expr_test.html()
在我们开始欢天喜地地庆祝这个“圣杯”般的发现之前, 我想把亲爱的 JScript 请上台来。

### JScript 的 bug
很不幸, JScript(即 Internet Explorer 的 ECMAScript 实现)把命名函数表达式搞得一团糟。正是 JScript 导致如今很多人不建议使用命名函数表达式。同样令人难过的是, 就连 Internet Explorer 8 中使用的最后一版 JScript——5.8——仍然存在下面描述的每一个怪异行为。

让我们看看它的损坏实现到底错在哪里。理解它的所有问题, 将使我们能够安全地绕开它们。请注意, 为了清晰起见, 我把这些差异拆成了几个例子——尽管它们很可能都源于同一个重大 bug。

#### 示例 #1: 函数表达式的标识符泄漏到外层作用域
var f = function g(){};
typeof g; // "function"
还记得我说过命名函数表达式的标识符在外层作用域不可用吗? 嗯, JScript 在这点上不认同规范——上面例子中的 g 解析成了一个函数对象。这是最广为人知的差异。它的危险在于, 它会在不知不觉中用一个额外的标识符污染外层作用域——这个作用域很可能就是全局作用域。这种污染当然可能成为难以追踪的 bug 来源。

#### 示例 #2: 命名函数表达式被同时当作函数声明和函数表达式
typeof g; // "function"
var f = function g(){};
正如我之前解释的, 在特定的执行上下文中, 函数声明会先于任何其他表达式被解析。上面的例子演示了 JScript 实际上是如何把命名函数表达式当作函数声明来处理的。你可以看到, 它在“真正的声明”发生之前就解析了 g。

这把我们引到下一个例子:

#### 示例 #3: 命名函数表达式创建了两个不同的函数对象!
var f = function g(){};
f === g; // false

f.expando = 'foo';
g.expando; // undefined
这里事情开始变得有趣了。或者说——彻底疯了。我们看到了不得不处理两个不同对象的危险——给其中一个添加属性显然不会修改另一个; 如果你决定使用某种缓存机制, 把某些东西存到 f 的属性上, 然后以为 g 就是同一个对象而去访问 g 的属性, 那就会相当麻烦。

再看一个稍微复杂一点的例子。

#### 示例 #4: 函数声明按顺序解析, 且不受条件块影响
var f = function g() {
  return 1;
};
if (false) {
  f = function g(){
    return 2;
  };
}
g(); // 2
像这样的例子可能造成更难以追踪的 bug。实际发生的事情其实很简单。首先, g 被解析为一个函数声明, 而由于 JScript 中的声明与条件块无关, g 被声明为来自“死”分支(dead branch)的函数——`function g(){ return 2 }`。然后, 所有“常规”表达式被求值, f 被赋值为另一个新创建的函数对象。求值时“死”的 if 分支从未进入, 所以 f 仍然引用第一个函数——`function g(){ return 1 }`。到这时应该清楚了: 如果你不够小心, 在 f 内部调用 g, 最终会调用一个完全不相干的 g 函数对象。

你可能想知道, 这些关于不同函数对象的混乱, 与 arguments.callee 相比又如何? callee 引用的是 f 还是 g? 我们来看一看:

var f = function g(){
  return [
    arguments.callee == f,
    arguments.callee == g
  ];
};
f(); // [true, false]
g(); // [false, true]
如你所见, arguments.callee 引用的是当前被调用的那个函数。这其实是好消息, 你稍后会看到。

另一个“意外行为”的有趣例子可以在未声明赋值(undeclared assignment)中使用命名函数表达式时观察到, 但仅当函数的“名字”与它被赋值给的标识符相同时:

(function(){
  f = function f(){};
})();
你可能知道, 未声明赋值(不推荐使用, 这里仅用于演示)本应创建一个全局的 f 属性。在符合规范的实现中正是如此。然而, JScript 的 bug 让事情变得有点令人困惑。由于命名函数表达式被解析为函数声明(见示例 #2), 这里发生的是: 在变量声明阶段, f 被声明为局部变量。之后, 当函数开始执行时, 赋值不再是未声明的, 于是右侧的 `function f(){}` 就被简单地赋给了这个新创建的局部变量 f。全局的 f 从未被创建。

这说明, 如果没能理解 JScript 的这些特性, 代码行为可能天差地别。

看看 JScript 的这些缺陷, 我们需要避免什么就很清楚了。首先, 要意识到标识符会泄漏(以免污染外层作用域)。其次, 绝不要引用用作函数名的那个标识符; 前面例子中那个麻烦的标识符就是 g。注意, 如果我们忘掉 g 的存在, 可以避免多少歧义。这里的关键是: 始终通过 f 或 arguments.callee 来引用函数。如果你使用命名表达式, 就把那个名字当作仅用于调试的东西。最后, 还有额外一点: 始终清理掉 NFE 声明期间被错误创建出来的多余函数。

我觉得最后一点需要稍微解释一下:

#### JScript 的内存管理
熟悉了 JScript 的这些差异后, 我们现在就能看到使用这些有 bug 的结构时, 内存消耗方面的一个潜在问题。来看一个简单的例子:

var f = (function(){
  if (true) {
    return function g(){};
  }
  return function g(){};
})();
我们知道, 从这个匿名调用中返回的函数——那个带有 g 标识符的函数——被赋值给了外层的 f。我们还知道, 命名函数表达式会产生一个多余的函数对象, 并且这个对象与返回的函数并不是同一个。这里的内存问题, 源于这个多余的 g 函数被字面意义上地“困”在返回函数的闭包中。之所以会这样, 是因为内部函数与那个讨厌的 g 声明在同一个作用域里。除非我们显式地断开对 g 函数的引用, 否则它会一直占用内存。

var f = (function(){
  var f, g;
  if (true) {
    f = function g(){};
  }
  else {
    f = function g(){};
  }
  // null `g`, so that it doesn't reference extraneous function any longer
  g = null;
  return f;
})();
注意, 我们也显式声明了 g, 这样 `g = null` 赋值就不会在符合规范的客户端(即非 JScript 客户端)中创建全局变量 g。通过把对 g 的引用置空, 我们让垃圾回收器得以清除 g 所引用的那个隐式创建的函数对象。

在处理 JScript 的 NFE 内存泄漏时, 我决定运行一组简单的测试, 以确认把 g 置空确实能释放内存。

#### 测试
测试很简单。它通过命名函数表达式创建 10000 个函数, 并把它们存到一个数组里。然后我会等待大约一分钟, 检查内存消耗有多高。之后我会把引用置空, 再重复一遍这个过程。下面是我用的测试用例:

function createFn(){
  return (function(){
    var f;
    if (true) {
      f = function F(){
        return 'standard';
      };
    }
    else if (false) {
      f = function F(){
        return 'alternative';
      };
    }
    else {
      f = function F(){
        return 'fallback';
      };
    }
    // var F = null;
    return f;
  })();
}

var arr = [ ];
for (var i=0; i<10000; i++) {
  arr[i] = createFn();
}
在 Windows XP SP2 上用 Process Explorer 看到的结果如下:

  IE6:

    without `null`:   7.6K -> 20.3K
    with `null`:      7.6K -> 18K

  IE7:

    without `null`:   14K -> 29.7K
    with `null`:      14K -> 27K
结果多少证实了我的假设——显式地把多余的引用置空确实释放了内存, 但消耗上的差异相对微不足道。对于 10000 个函数对象, 大约有 3MB 的差别。在设计大型应用、长时间运行的应用, 或者运行在内存受限设备(如移动设备)上的应用时, 这一点绝对值得牢记。对于任何小型脚本, 这点差异大概无关紧要。

你可能以为这下总算结束了, 但我们其实还没完全到头 :) 还有一个小细节我想提一下, 那就是 Safari 2.x。

### Safari 的 bug
关于 NFE 还有一个更少人知的 bug, 存在于较旧版本的 Safari 中, 也就是 Safari 2.x 系列。我在网上看到过一些说法, 称 Safari 2.x 完全不支持 NFE。这是不正确的。Safari 确实支持它, 但它的实现中有 bug, 你很快就会看到。

在特定上下文中遇到函数表达式时, Safari 2.x 会完全无法解析整个程序。它不会抛出任何错误(比如 SyntaxError)。它只是直接罢工:

(function f(){})(); // <== NFE
alert(1); // this line is never reached, since previous expression fails the entire program
在摆弄了各种测试用例之后, 我得出结论: 如果命名函数表达式不是赋值表达式的一部分, Safari 2.x 就无法解析它们。赋值表达式的一些例子如下:

// part of variable declaration
var f = 1;

// part of simple assignment
f = 2, g = 3;

// part of return statement
(function(){
  return (f = 2);
})();
这意味着, 把命名函数表达式放进赋值中会让 Safari“开心”:

(function f(){}); // fails

var f = function f(){}; // works

(function(){
  return function f(){}; // fails
})();

(function(){
  return (f = function f(){}); // works
})();

setTimeout(function f(){ }, 100); // fails

Person.prototype = {
  say: function say() { ... } // fails
}

Person.prototype.say = function say(){ ... }; // works
这也意味着, 我们不能使用像“返回命名函数表达式而没有赋值”这样的常见模式:

// Instead of this non-Safari-2x-compatible syntax:
(function(){
  if (featureTest) {
    return function f(){};
  }
  return function f(){};
})();

// we should use this slightly more verbose alternative:
(function(){
  var f;
  if (featureTest) {
    f = function f(){};
  }
  else {
    f = function f(){};
  }
  return f;
})();

// or another variation of it:
(function(){
  var f;
  if (featureTest) {
    return (f = function f(){});
  }
  return (f = function f(){});
})();

/*
  Unfortunately, by doing so, we introduce an extra reference to a function
  which gets trapped in a closure of returning function. To prevent extra memory usage,
  we can assign all named function expressions to one single variable.
*/

var __temp;

(function(){
  if (featureTest) {
    return (__temp = function f(){});
  }
  return (__temp = function f(){});
})();

...

(function(){
  if (featureTest2) {
    return (__temp = function g(){});
  }
  return (__temp = function g(){});
})();

/*
  Note that subsequent assignments destroy previous references,
  preventing any excessive memory usage.
*/
如果兼容 Safari 2.x 很重要, 我们就必须确保“不兼容”的结构根本不出现在源码里。这当然很烦人, 但绝对可以做到, 尤其是在知道问题根源的情况下。

还值得一提的是, 在 Safari 2.x 中把函数声明为 NFE 还有另一个小毛病: 函数的字符串表示不包含函数标识符:

var f = function g(){};

// Notice how function representation is lacking `g` identifier
String(f); // function () { }
这其实没什么大不了。正如我之前提到的, 函数反编译(function decompilation)本来就不应该被依赖。

### SpiderMonkey 的特殊之处
我们知道, 命名函数表达式的标识符只对函数的局部作用域可用。但这个“魔法”般的作用域究竟是如何实现的呢? 它其实非常简单。当命名函数表达式被求值时, 会创建一个特殊对象。这个对象的唯一用途, 就是持有一个属性, 其名称对应函数标识符, 其值对应函数本身。然后这个对象会被注入到当前作用域链的最前端, 而这条被“增强”的作用域链随后被用来初始化函数。

不过, 这里有趣的地方在于 ECMA-262 定义这个“特殊的”对象——即持有函数标识符的那个对象——的方式。规范说, 这个对象是“as if by expression new Object()”创建的, 如果字面理解, 就把这个对象变成了内置 Object 构造器的实例。然而, 只有一种实现——SpiderMonkey——严格遵循了这条规范要求。在 SpiderMonkey 中, 可以通过扩展 Object.prototype 来干扰函数的局部变量:

Object.prototype.x = 'outer';

(function(){

  var x = 'inner';

  /*
    `foo` function here has a special object in its scope chain — to hold an identifier. That object is practically a —
    `{ foo: <function object> }`. When `x` is being resolved through the scope chain, it is first searched for in
    `foo`'s local context. When not found, it is searched in the next object from the scope chain. That object turns out
    to be the one that holds identifier — { foo: <function object> } and since it inherits from `Object.prototype`,
    `x` is found right here, and is the one that's `Object.prototype.x` (with value of 'outer'). Outer function's scope
    (with x === 'inner') is never even reached.
  */

  (function foo(){

    alert(x); // alerts `outer`

  })();
})();
注意, 后来的 SpiderMonkey 版本实际上改变了这种行为, 因为它可能被认为是一个安全漏洞。这个“特殊”对象不再继承自 Object.prototype。不过, 在 Firefox <=3 中你仍然能看到它。

另一个把内部对象实现为全局 Object 实例的环境是黑莓浏览器。只不过这次继承自 Object.prototype 的是活动对象(Activation Object)。注意, 规范其实并没有把活动对象规定为“as if by expression new Object()”那样创建(与 NFE 的标识符持有对象不同)。规范只是说, 活动对象仅是一种规范机制(specification mechanism)。

那么, 让我们看看在黑莓浏览器中会发生什么:

Object.prototype.x = 'outer';

(function(){

  var x = 'inner';

  (function(){

    /*
    When `x` is being resolved against scope chain, this local function's Activation Object is searched first.
    There's no `x` in it, of course. However, since Activation Object inherits from `Object.prototype`, it is
    `Object.prototype` that's being searched for `x` next. `Object.prototype.x` does in fact exist and so `x`
    resolves to its value — 'outer'. As in the previous example, outer function's scope (Activation Object)
    with its own x === 'inner' is never even reached.
    */

    alert(x); // alerts 'outer'

  })();
})();
这看起来可能很离奇, 但真正令人不安的是, 它与已存在的 Object.prototype 成员发生冲突的可能性更大:

(function(){

  var constructor = function(){ return 1; };

  (function(){

    constructor(); // evaluates to an object `{ }`, not `1`

    constructor === Object.prototype.constructor; // true
    toString === Object.prototype.toString; // true

    // etc.

  })();
})();
针对黑莓这一差异的解决方案很明显: 避免把变量命名为 Object.prototype 的属性名——如 toString、valueOf、hasOwnProperty 等等。

### JScript 的解决方案
var fn = (function(){

  // declare a variable to assign function object to
  var f;

  // conditionally create a named function
  // and assign its reference to `f`
  if (true) {
    f = function F(){ };
  }
  else if (false) {
    f = function F(){ };
  }
  else {
    f = function F(){ };
  }

  // Assign `null` to a variable corresponding to a function name
  // This marks the function object (referred to by that identifier)
  // available for garbage collection
  var F = null;

  // return a conditionally defined function
  return f;
})();
最后, 在现实中, 当我们编写类似跨浏览器 addEvent 函数这样的代码时, 可以这样应用这个“技巧”:

// 1) enclose declaration with a separate scope
var addEvent = (function(){

  var docEl = document.documentElement;

  // 2) declare a variable to assign function to
  var fn;

  if (docEl.addEventListener) {

    // 3) make sure to give function a descriptive identifier
    fn = function addEvent(element, eventName, callback) {
      element.addEventListener(eventName, callback, false);
    };
  }
  else if (docEl.attachEvent) {
    fn = function addEvent(element, eventName, callback) {
      element.attachEvent('on' + eventName, callback);
    };
  }
  else {
    fn = function addEvent(element, eventName, callback) {
      element['on' + eventName] = callback;
    };
  }

  // 4) clean up `addEvent` function created by JScript
  //    make sure to either prepend assignment with `var`,
  //    or declare `addEvent` at the top of the function
  var addEvent = null;

  // 5) finally return function referenced by `fn`
  return fn;
})();
### 替代方案
值得一提的是, 其实还存在获得描述性调用栈名字的替代方式, 无需使用命名函数表达式。首先, 通常可以通过函数声明而不是表达式来定义函数。只有当你不需要创建多个函数时, 这个选项才可行:

var hasClassName = (function(){

  // define some private variables
  var cache = { };

  // use function declaration
  function hasClassName(element, className) {
    var _className = '(?:^|\\s+)' + className + '(?:\\s+|$)';
    var re = cache[_className] || (cache[_className] = new RegExp(_className));
    return re.test(element.className);
  }

  // return function
  return hasClassName;
})();
在需要给函数定义“分支(fork)”时, 这显然行不通。不过, 有一个我最初在 Tobie Langel 那里看到的有趣模式。它的做法是: 事先用函数声明定义好所有函数, 但给它们取稍微不同的标识符:

var addEvent = (function(){

  var docEl = document.documentElement;

  function addEventListener(){
    /* ... */
  }
  function attachEvent(){
    /* ... */
  }
  function addEventAsProperty(){
    /* ... */
  }

  if (typeof docEl.addEventListener != 'undefined') {
    return addEventListener;
  }
  else if (typeof docEl.attachEvent != 'undefined') {
    return attachEvent;
  }
  return addEventAsProperty;
})();
虽然这是一种优雅的做法, 但它也有自己的缺点。首先, 使用不同的标识符, 你就失去了命名的一致性。这是好是坏并不十分明确。有些人可能偏好完全相同的名字, 而另一些人则不介意不同的名字; 毕竟, 不同的名字往往能“说明”所用的是哪种实现。例如, 在调试器中看到 “attachEvent”, 就能让你知道这是 addEvent 基于 attachEvent 的实现。另一方面, 与实现相关的名字可能根本没有意义。如果你在提供 API, 并以这种方式命名“内部”函数, API 的使用者很容易在这些实现细节中迷失。

这个问题的一个解决方案可能是采用不同的命名约定。只是要小心别引入多余的冗长。我想到的一些替代方案是:

  `addEvent`, `altAddEvent` and `fallbackAddEvent`
  // or
  `addEvent`, `addEvent2`, `addEvent3`
  // or
  `addEvent_addEventListener`, `addEvent_attachEvent`, `addEvent_asProperty`
这个模式的另一个小问题是内存消耗增加。通过事先定义所有函数变体, 你会隐式地创建 N-1 个用不到的函数。如你所见, 如果在 document.documentElement 中找到了 attachEvent, 那么 addEventListener 和 addEventAsProperty 都不会真正被用到。然而它们已经占用了内存; 这些内存永远不会被释放, 原因与 JScript 有 bug 的命名表达式相同——两个函数都被“困”在返回函数的闭包里。

这种增加的消耗当然算不上大问题。如果像 Prototype.js 这样的库使用这个模式, 也只会多创建不超过 100-200 个函数对象。只要这些函数不是反复(在运行时)以这种方式创建, 而是只创建一次(在加载时), 你大概就不必担心。

### WebKit 的 displayName
WebKit 团队采取了稍微不同的做法。由于对函数(无论匿名还是命名)的糟糕表示感到沮丧, WebKit 引入了一个“特殊的” displayName 属性(本质上是一个字符串), 当它被赋给函数时, 会在调试器/性能分析器中显示, 以代替该函数的 “name”。Francisco Tolmasky 详细解释了该方案的原理与实现。

### 未来的考量
ECMAScript 即将发布的版本——ECMA-262 第 5 版——引入了所谓的严格模式(strict mode)。严格模式的目的是禁用语言中被认为脆弱、不可靠或危险的部分。其中一部分就是 arguments.callee, 它大概因安全考虑而被“封禁”。在严格模式下, 访问 arguments.callee 会导致 TypeError(见第 10.6 节)。我提到严格模式的原因是: 在第 5 版中无法使用 arguments.callee 做递归, 很可能会导致命名函数表达式的使用增多。理解它们的语义和 bug 将变得更加重要。

// Before, you could use arguments.callee
(function(x) {
  if (x <= 1) return 1;
  return x * arguments.callee(x - 1);
})(10);

// In strict mode, an alternative solution is to use named function expression
(function factorial(x) {
  if (x <= 1) return 1;
  return x * factorial(x - 1);
})(10);

// or just fall back to slightly less flexible function declaration
function factorial(x) {
  if (x <= 1) return 1;
  return x * factorial(x - 1);
}
factorial(10);
### 致谢
Richard Cornford, 他是最早解释 JScript 命名函数表达式 bug 的人之一。本文提到的大部分 bug 都由 Richard 做出解释。我强烈推荐阅读他的说明。我还要感谢 Yann-Erwan Perio 和 Douglas Crockford, 他们早在 2003 年就在 comp.lang.javascript 中提到并讨论了 NFE 的问题。

John-David Dalton, 就“最终解决方案”给出了有用的建议。

Tobie Langel, 提供了“替代方案”中的想法。

Garrett Smith 和 Dmitry A. Soshnikov, 提供了各种补充和更正。

关于 ECMAScript 中函数的详尽俄文解释, 参见 Dmitry A. Soshnikov 的这篇文章。

















































































































































原文链接: [http://kangax.github.io/nfe/](http://kangax.github.io/nfe/)


原文日期: 2009年06月17日

翻译日期: 2015年04月21日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)