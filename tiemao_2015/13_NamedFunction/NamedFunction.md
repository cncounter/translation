# Named function expressions demystified


###Introduction

Surprisingly, a topic of named function expressions doesn’t seem to be covered well enough on the web. This is probably why there are so many misconceptions floating around. In this article, I’ll try to summarize both — theoretical and practical aspects of these wonderful Javascript constructs; the good, bad and ugly parts of them.

In a nutshell, named function expressions are useful for one thing only — descriptive function names in debuggers and profilers. Well, there is also a possibility of using function names for recursion, but you will soon see that this is often impractical nowadays. If you don’t care about debugging experience, you have nothing to worry about. Otherwise, read on to see some of the cross-browser glitches you would have to deal with and tips on how work around them.

I’ll start with a general explanation of what function expressions are how modern debuggers handle them. Feel free to skip to a final solution, which explains how to use these constructs safely.


### Function expressions vs. Function declarations

One of the two most common ways to create a function object in ECMAScript is by means of either Function Expression or Function Declaration. The difference between two is rather confusing. At least it was to me. The only thing ECMA specs make clear is that Function Declaration must always have an Identifier (or a function name, if you prefer), and Function Expression may omit it:

>FunctionDeclaration :
>
>function Identifier ( FormalParameterList <sub>opt</sub> ){ FunctionBody }
>
>FunctionExpression :
>function Identifier <sub>opt</sub> ( FormalParameterList <sub>opt</sub> ){ FunctionBody }


We can see that when identifier is omitted, that “something” can only be an expression. But what if identifier is present? How can one tell whether it is a function declaration or a function expression — they look identical after all? It appears that ECMAScript differentiates between two based on a context. If a function foo(){} is part of, say, assignment expression, it is considered a function expression. If, on the other hand, function foo(){} is contained in a function body or in a (top level of) program itself — it is parsed as a function declaration.

	function foo(){} // declaration, since it's part of a <em>Program</em>
	var bar = function foo(){}; // expression, since it's part of an <em>AssignmentExpression</em>
	
	new function bar(){}; // expression, since it's part of a <em>NewExpression</em>
	
	(function(){
	  function bar(){} // declaration, since it's part of a <em>FunctionBody</em>
	})();

A somewhat less obvious example of function expression is the one where function is wrapped with parenthesis — (function foo(){}). The reason it is an expression is again due to a context: "(" and ")" constitute a grouping operator and grouping operator can only contain an expression:

To demonstrate with examples:

	function foo(){} // function declaration
	(function foo(){}); // function expression: due to grouping operator
	
	try {
	  (var x = 5); // grouping operator can only contain expression, not a statement (which `var` is)
	} catch(err) {
	  // SyntaxError
	}

You might also recall that when evaluating JSON with eval, the string is usually wrapped with parenthesis — eval('(' + json + ')'). This is of course done for the same reason — grouping operator, which parenthesis are, forces JSON brackets to be parsed as expression rather than as a block:

	try {
	  { "x": 5 }; // "{" and "}" are parsed as a block
	} catch(err) {
	  // SyntaxError
	}
	
	({ "x": 5 }); // grouping operator forces "{" and "}" to be parsed as object literal

There’s a subtle difference in behavior of declarations and expressions.

First of all, function declarations are parsed and evaluated before any other expressions are. Even if declaration is positioned last in a source, it will be evaluated foremost any other expressions contained in a scope. The following example demonstrates how fn function is already defined by the time alert is executed, even though it’s being declared right after it:

	alert(fn());
	
	function fn() {
	  return 'Hello world!';
	}

Another important trait of function declarations is that declaring them conditionally is non-standardized and varies across different environments. You should never rely on functions being declared conditionally and use function expressions instead.

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

If you're curious about actual production rules of function declarations, read on. Otherwise, feel free to skip the following excerpt.

>FunctionDeclarations are only allowed to appear in Program or FunctionBody. Syntactically, they can not appear in Block ({ ... }) — such as that of if, while or for statements. This is because Blocks can only contain Statements, not SourceElements, which FunctionDeclaration is. If we look at production rules carefully, we can see that the only way Expression is allowed directly within Block is when it is part of ExpressionStatement. However, ExpressionStatement is explicitly defined to not begin with "function" keyword, and this is exactly why FunctionDeclaration cannot appear directly within a Statement or Block (note that Block is merely a list of Statements).

Because of these restrictions, whenever function appears directly in a block (such as in the previous example) it should actually be considered a syntax error, not function declaration or expression. The problem is that almost none of the implementations I've seen parse these functions strictly per rules (exceptions are BESEN and DMDScript). They interpret them in proprietary ways instead.

It's worth mentioning that as per specification, implementations are allowed to introduce syntax extensions (see section 16), yet still be fully conforming. This is exactly what happens in so many clients these days. Some of them interpret function declarations in blocks as any other function declarations — simply hoisting them to the top of the enclosing scope; Others — introduce different semantics and follow slightly more complex rules.


Function statements
One of such syntax extensions to ECMAScript is Function Statements, currently implemented in Gecko-based browsers (tested in Firefox 1-3.7a1pre on Mac OS X). Somehow, this extension doesn't seem to be widely known, either for good or bad (MDC mentions them, but very briefly). Please remember, that we are discussing it here only for learning purposes and to satisfy our curiosity; unless you're writing scripts for specific Gecko-based environment, I do not recommend relying on this extension.

So, here are some of the traits of these non-standard constructs:

Function statements are allowed to be anywhere where plain Statements are allowed. This, of course, includes Blocks:
if (true) {
  function f(){ }
}
else {
  function f(){ }
}
Function statements are interpreted as any other statements, including conditional execution:
if (true) {
  function foo(){ return 1; }
}
else {
  function foo(){ return 2; }
}
foo(); // 1
// Note that other clients interpet `foo` as function declaration here,
// overwriting first `foo` with the second one, and producing "2", not "1" as a result
Function statements are NOT declared during variable instantiation. They are declared at run time, just like function expressions. However, once declared, function statement's identifier becomes available to the entire scope of the function. This identifier availability is what makes function statements different from function expressions (you will see exact behavior of named function expressions in next chapter).
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
Generally, we can emulate function statements behavior from the previous example with this standards-compliant (and unfortunately, more verbose) code:
var foo;
if (true) {
  foo = function foo(){ return 1; };
}
else {
  foo = function foo() { return 2; };
}
String representation of functions statements is similar to that of function declarations or named function expressions (and includes identifier — "foo" in this example):
if (true) {
  function foo(){ return 1; }
}
String(foo); // function foo() { return 1; }
Finally, what appears to be a bug in earlier Gecko-based implementations (present in <= Firefox 3), is the way function statements overwrite function declarations. Earlier versions were somehow failing to overwrite function declarations with function statements:
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
Note that older Safari (at least 1.2.3, 2.0 - 2.0.4 and 3.0.4, and possibly earlier versions too) implement function statements identically to SpiderMonkey. All examples from this chapter, except the last "bug" one, produce same results in those versions of Safari as they do in, say, Firefox. Another browser that seems to follow same semantics is Blackberry one (at least 8230, 9000 and 9530 models). This diversity in behavior demonstrates once again what a bad idea it is to rely on these extensions.

Named function expressions
Function expressions can actually be seen quite often. A common pattern in web development is to “fork” function definitions based on some kind of a feature test, allowing for the best performance. Since such forking usually happens in the same scope, it is almost always necessary to use function expressions. After all, as we know by now, function declarations should not be executed conditionally:

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
Quite obviously, when a function expression has a name (technically — Identifier), it is called a named function expression. What you’ve seen in the very first example — var bar = function foo(){}; — was exactly that — a named function expression with foo being a function name. An important detail to remember is that this name is only available in the scope of a newly-defined function; specs mandate that an identifier should not be available to an enclosing scope:

var f = function foo(){
  return typeof foo; // "foo" is available in this inner scope
};
// `foo` is never visible "outside"
typeof foo; // "undefined"
f(); // "function"
So what’s so special about these named function expressions? Why would we want to give them names at all?

It appears that named functions make for a much more pleasant debugging experience. When debugging an application, having a call stack with descriptive items makes a huge difference.

Function names in debuggers
When a function has a corresponding identifier, debuggers show that identifier as a function name, when inspecting call stack. Some debuggers (e.g. Firebug) helpfully show names of even anonymous functions — making them identical to names of variables that functions are assigned to. Unfortunately, these debuggers usually rely on simple parsing rules; Such extraction is usually quite fragile and often produces false results.

Let’s look at a simple example:

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
We can see that foo called bar which in its turn called baz (and that foo itself was called from the global scope of expr_test.html document). What’s really nice, is that Firebug manages to parse the “name” of a function even when an anonymous expression is used:

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
What’s not very nice, though, is that if a function expression gets any more complex (which, in real life, it almost always is) all of the debugger’s efforts turn out to be pretty useless; we end up with a shiny question mark in place of a function name:

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
Another confusion appears when a function is being assigned to more than one variable:

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
You can see call stack showing that foo invoked bar. Clearly, that’s not what has happened. The confusion is due to the fact that baz was “exchanged” references with another function — the one alerting “spoofed”. As you can see, such parsing — while great in simple cases — is often useless in any non-trivial script.

What it all boils down to is the fact that named function expressions is the only way to get a truly robust stack inspection. Let’s rewrite our previous example with named functions in mind. Notice how both of the functions returning from self-executing wrapper, are named as bar:

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
Before we start dancing happily celebrating this holy grail finding, I’d like to bring a beloved JScript into the picture.

JScript bugs
Unfortunately, JScript (i.e. Internet Explorer’s ECMAScript implementation) seriously messed up named function expressions. JScript is responsible for named function expressions being recommended against by many people these days. It's also quite sad that even last version of JScript — 5.8 — used in Internet Explorer 8, still exhibits every single quirk described below

Let’s look at what exactly is wrong with its broken implementation. Understanding all of its issues will allow us to work around them safely. Note that I broke these discrepancies into few examples — for clarity — even though all of them are most likely a consequence of one major bug.

Example #1: Function expression identifier leaks into an enclosing scope
var f = function g(){};
typeof g; // "function"
Remember how I mentioned that an identifier of named function expression is not available in an enclosing scope? Well, JScript doesn’t agree with specs on this one — g in the above example resolves to a function object. This is a most widely observed discrepancy. It’s dangerous in that it inadvertedly pollutes an enclosing scope — a scope that might as well be a global one — with an extra identifier. Such pollution can, of course, be a source of hard-to-track bugs.

Example #2: Named function expression is treated as BOTH — function declaration AND function expression
typeof g; // "function"
var f = function g(){};
As I explained before, function declarations are parsed foremost any other expressions in a particular execution context. The above example demonstrates how JScript actually treats named function expressions as function declarations. You can see that it parses g before an “actual declaration” takes place.

This brings us to a next example:

Example #3: Named function expression creates TWO DISTINCT function objects!
var f = function g(){};
f === g; // false

f.expando = 'foo';
g.expando; // undefined
This is where things are getting interesting. Or rather — completely nuts. Here we are seeing the dangers of having to deal with two distinct objects — augmenting one of them obviously does not modify the other one; This could be quite troublesome if you decided to employ, say, caching mechanism and store something in a property of f, then tried accessing it as a property of g, thinking that it is the same object you’re working with.

Let’s look at something a bit more complex.

Example #4: Function declarations are parsed sequentially and are not affected by conditional blocks
var f = function g() {
  return 1;
};
if (false) {
  f = function g(){
    return 2;
  };
}
g(); // 2
An example like this could cause even harder to track bugs. What happens here is actually quite simple. First, g is being parsed as a function declaration, and since declarations in JScript are independent of conditional blocks, g is being declared as a function from the “dead” if branch — function g(){ return 2 }. Then all of the “regular” expressions are being evaluated and f is being assigned another, newly created function object to. “dead” if branch is never entered when evaluating expressions, so f keeps referencing first function — function g(){ return 1 }. It should be clear by now, that if you’re not careful enough, and call g from within f, you’ll end up calling a completely unrelated g function object.

You might be wondering how all this mess with different function objects compares to arguments.callee. Does callee reference f or g? Let’s take a look:

var f = function g(){
  return [
    arguments.callee == f,
    arguments.callee == g
  ];
};
f(); // [true, false]
g(); // [false, true]
As you can see, arguments.callee references whatever function is being invoked. This is actually good news, as you will see later on.

Another interesting example of "unexpected behavior" can be observed when using named function expression in undeclared assignment, but only when function is "named" the same way as identifier it's being assigned to:

(function(){
  f = function f(){};
})();
As you might know, undeclared assignment (which is not recommended and is only used here for demonstration purposes) should result in creation of global f property. This is exactly what happens in conforming implementations. However, JScript bug makes things a bit more confusing. Since named function expression is parsed as function declaration (see example #2), what happens here is that f becomes declared as a local variable during the phase of variable declarations. Later on, when function execution begins, assignment is no longer undeclared, so function f(){} on the right hand side is simply assigned to this newly created local f variable. Global f is never created.

This demonstrates how failing to understand JScript peculiarities can lead to drastically different behavior in code.

Looking at JScript deficiencies, it becomes pretty clear what exactly we need to avoid. First, we need to be aware of a leaking identifier (so that it doesn’t pollute enclosing scope). Second, we should never reference identifier used as a function name; A troublesome identifier is g from the previous examples. Notice how many ambiguities could have been avoided if we were to forget about g’s existance. Always referencing function via f or arguments.callee is the key here. If you use named expression, think of that name as something that’s only being used for debugging purposes. And finally, a bonus point is to always clean up an extraneous function created erroneously during NFE declaration.

I think last point needs a bit of an explanation:

JScript memory management
Being familiar with JScript discrepancies, we can now see a potential problem with memory consumption when using these buggy constructs. Let’s look at a simple example:

var f = (function(){
  if (true) {
    return function g(){};
  }
  return function g(){};
})();
We know that a function returned from within this anonymous invocation — the one that has g identifier — is being assigned to outer f. We also know that named function expressions produce superfluous function object, and that this object is not the same as returned function. The memory issue here is caused by this extraneous g function being literally “trapped” in a closure of returning function. This happens because inner function is declared in the same scope as that pesky g one. Unless we explicitly break reference to g function it will keep consuming memory.

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
Note that we explicitly declare g as well, so that g = null assignment wouldn’t create a global g variable in conforming clients (i.e. non-JScript ones). By nulling reference to g, we allow garbage collector to wipe off this implicitly created function object that g refers to.

When taking care of JScript NFE memory leak, I decided to run a simple series of tests to confirm that nulling g actually does free memory.

Tests
The test was simple. It would simply create 10000 functions via named function expressions and store them in an array. I would then wait for about a minute and check how high the memory consumption is. After that I would null-out the reference and repeat the procedure again. Here’s a test case I used:

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
Results as seen in Process Explorer on Windows XP SP2 were:

  IE6:

    without `null`:   7.6K -> 20.3K
    with `null`:      7.6K -> 18K

  IE7:

    without `null`:   14K -> 29.7K
    with `null`:      14K -> 27K
The results somewhat confirmed my assumptions — explicitly nulling superfluous reference did free memory, but the difference in consumption was relatively insignificant. For 10000 function objects, there would be a ~3MB difference. This is definitely something that should be kept in mind when designing large-scale applications, applications that will run for either long time or on devices with limited memory (such as mobile devices). For any small script, the difference probably doesn’t matter.

You might think that it’s all finally over, but we are not just quite there yet :) There’s a tiny little detail that I’d like to mention and that detail is Safari 2.x

Safari bug
Even less widely known bug with NFE is present in older versions of Safari; namely, Safari 2.x series. I’ve seen some claims on the web that Safari 2.x does not support NFE at all. This is not true. Safari does support it, but has bugs in its implementation which you will see shortly.

When encountering function expression in a certain context, Safari 2.x fails to parse the program entirely. It doesn’t throw any errors (such as SyntaxError ones). It simply bails out:

(function f(){})(); // <== NFE
alert(1); // this line is never reached, since previous expression fails the entire program
After fiddling with various test cases, I came to conclusion that Safari 2.x fails to parse named function expressions, if those are not part of assignment expressions. Some examples of assignment expressions are:

// part of variable declaration
var f = 1;

// part of simple assignment
f = 2, g = 3;

// part of return statement
(function(){
  return (f = 2);
})();
This means that putting named function expression into an assignment makes Safari “happy”:

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
It also means that we can’t use such common pattern as returning named function expression without an assignment:

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
If Safari 2.x compatibility is important, we need to make sure “incompatible” constructs do not even appear in the source. This is of course quite irritating, but is definitely possible to achieve, especially when knowing the root of the problem.

It’s also worth mentioning that declaring a function as NFE in Safari 2.x exhibits another minor glitch, where function representation does not contain function identifier:

var f = function g(){};

// Notice how function representation is lacking `g` identifier
String(f); // function () { }
This is not really a big deal. As I have already mentioned before, function decompilation is something that should not be relied upon anyway.

SpiderMonkey peculiarity
We know that identifier of named function expression is only available to the local scope of a function. But how does this "magic" scoping actually happen? It appears to be very simple. When named function expression is evaluated, a special object is created. The sole purpose of that object is to hold a property with the name corresponding to function identifier, and value corresponding to function itself. That object is then injected into the front of the current scope chain, and this "augmented" scope chain is then used to initialize a function.

The interesting part here, however, is the way ECMA-262 defines this "special" object — the one that holds function identifier. Spec says that an object is created "as if by expression new Object()" which, when interpreted literally, makes this object an instance of built-in Object constructor. However, only one implementation — SpiderMonkey — followed this specification requirement literally. In SpiderMonkey, it is possible to interfere with function local variables by augmenting Object.prototype:

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
Note that later versions of SpiderMonkey actually changed this behavior, as it was probably considered a security hole. A "special" object no longer inherits from Object.prototype. You can, however, still see it in Firefox <=3.

Another environment implementing internal object as an instance of global Object is Blackberry browser. Only this time, it's Activation Object that inherits from Object.prototype. Note that specification actually doesn't codify Activation Object to be created "as if by expression new Object()" (as is the case with NFE's identifier holder object). It states that Activation Object is merely a specification mechanism.

So, let's see what happens in Blackberry browser:

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
This might look bizarre, but what's really disturbing is that there's even more chance of conflict with already existing Object.prototype members:

(function(){

  var constructor = function(){ return 1; };

  (function(){

    constructor(); // evaluates to an object `{ }`, not `1`

    constructor === Object.prototype.constructor; // true
    toString === Object.prototype.toString; // true

    // etc.

  })();
})();
Solution to this Blackberry discrepancy is obvious: avoid naming variables as Object.prototype properties — toString, valueOf, hasOwnProperty, and so on.

JScript solution
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
Finally, here’s how we would apply this “techinque” in real life, when writing something like a cross-browser addEvent function:

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
Alternative solution
It’s worth mentioning that there actually exist alternative ways of having descriptive names in call stacks. Ways that don’t require one to use named function expressions. First of all, it is often possible to define function via declaration, rather than via expression. This option is only viable when you don’t need to create more than one function:

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
This obviously wouldn’t work when forking function definitions. Nevertheless, there’s an interesting pattern that I first seen used by Tobie Langel. The way it works is by defining all functions upfront using function declarations, but giving them slightly different identifiers:

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
While it’s an elegant approach, it has its own drawbacks. First, by using different identifiers, you lose naming consistency. Whether it’s good or bad thing is not very clear. Some might prefer to have identical names, while others wouldn’t mind varying ones; after all, different names can often “speak” about implementation used. For example, seeing “attachEvent” in debugger, would let you know that it is an attachEvent-based implementation of addEvent. On the other hand, implementation-related name might not be meaningful at all. If you’re providing an API and name “inner” functions in such way, the user of API could easily get lost in all of these implementation details.

A solution to this problem might be to employ different naming convention. Just be careful not to introduce extra verbosity. Some alternatives that come to mind are:

  `addEvent`, `altAddEvent` and `fallbackAddEvent`
  // or
  `addEvent`, `addEvent2`, `addEvent3`
  // or
  `addEvent_addEventListener`, `addEvent_attachEvent`, `addEvent_asProperty`
Another minor issue with this pattern is increased memory consumption. By defining all of the function variations upfront, you implicitly create N-1 unused functions. As you can see, if attachEvent is found in document.documentElement, then neither addEventListener nor addEventAsProperty are ever really used. Yet, they already consume memory; memory which is never deallocated for the same reason as with JScript’s buggy named expressions — both functions are “trapped” in a closure of returning one.

This increased consumption is of course hardly an issue. If a library such as Prototype.js was to use this pattern, there would be not more than 100-200 extra function objects created. As long as functions are not created in such way repeatedly (at runtime) but only once (at load time), you probably shouldn’t worry about it.

WebKit's displayName
A somewhat different approach was taken by WebKit team. Frustrated with poor representation of functions — both, anonymous and named — WebKit introduced "special" displayName property (essentially a string) that when assigned to a function is displayed in debugger/profiler in place of that function's "name". Francisco Tolmasky explains in details the rationale and implementation of this solution.

Future considerations
Upcoming version of ECMAScript — ECMA-262, 5th edition — introduces so-called strict mode. The purpose of strict mode is to disallow certain parts of the language which are considered to be fragile, unreliable or dangerous. One of such parts is arguments.callee, "banned" presumably due to security concerns. When in strict mode, access to arguments.callee results in TypeError (see section 10.6). The reason I'm bringing up strict mode is because inability to use arguments.callee for recursion in 5th edition will most likely result in increased use of named function expressions. Understanding their semantics and bugs will become even more important.

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
Credits
Richard Cornford, for being one of the first people to explain JScript bug with named function expressions. Richard explains most of the bugs mentioned in this article. I highly recommend reading his explanation. I would also like to thank Yann-Erwan Perio and Douglas Crockford for mentioning and discussing NFE issues in comp.lang.javascript as far back as in 2003.

John-David Dalton, for giving useful suggestions about “final solution”.

Tobie Langel, for ideas presented in “alternative solution”.

Garrett Smith and Dmitry A. Soshnikov for various additions and corrections.

For an extensive explanation of functions in ECMAScript in Russian, see this article by Dmitry A. Soshnikov.

















































































































































原文链接: [http://kangax.github.io/nfe/](http://kangax.github.io/nfe/)


原文日期: 2009年06月17日

翻译日期: 2015年04月21日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)