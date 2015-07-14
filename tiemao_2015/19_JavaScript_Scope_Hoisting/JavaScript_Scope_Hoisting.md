# JavaScript 变量作用域及声明提前



Every building needs strong foundation to build on. Understanding variable scope in JavaScript is one of the keys to building a solid foundation. This article will explain how JavaScript’s scoping system works. We’ll also cover a related topic known as [hoisting](http://www.sitepoint.com/back-to-basics-javascript-hoisting/).


## Variable Scope

To work with JavaScript efficiently, one of the first things you need to understand is the concept of variable scope. The scope of a variable is controlled by the location of the variable declaration, and defines the part of the program where a particular variable is accessible.

Scoping rules vary from language to language. JavaScript has two scopes – global and local. Any variable declared outside of a function belongs to the global scope, and is therefore accessible from anywhere in your code. Each function has its own scope, and any variable declared within that function is only accessible from that function and any nested functions. Because local scope in JavaScript is created by functions, it’s also called function scope. When we put a function inside another function, then we create nested scope.

Currently, JavaScript, unlike many other languages, does not support block level scoping. This means that declaring a variable inside of a block structure like a `for` loop, does not restrict that variable to the loop. Instead, the variable will be accessible from the entire function. It’s worth noting that the upcoming [ECMAScript 6 will support block level scopes via the `let` keyword](http://www.sitepoint.com/preparing-ecmascript-6-let-const/).

To make things clear let’s use a simple metaphor. Every country in our world has frontiers. Everything inside these frontiers belongs to the country’s scope. In every country there are many cities, and each one of them has its own city’s scope. The countries and cities are just like JavaScript functions – they have their local scopes. The same is true for the continents. Although they are huge in size they also can be defined as locales. On the other hand, the world’s oceans can’t be defined as having local scope, because it actually wraps all local objects – continents, countries, and cities – and thus, its scope is defined as global. Let’s visualize this in the next example:

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

Now that we understand what local and global scopes are, and how they are created, it’s time to learn how the JavaScript interpreter uses them to find a particular variable.

Back to the given metaphor, let’s say I want to find a friend of mine whose name is Monique. I know that she lives in Paris, so I start my searching from there. When I can’t find her in Paris I go one level up and expand my searching in all of France. But again, she is not there. Next, I expand my searching again by going another level up. Finally, I found her in Italy, which in our case is the local scope of Europe.

In the previous example my friend Monique is represented by the variable `myFriend`. In the last line we call the `europe()` function, which calls `france()`, and finally when the `paris()` function is called, the searching begins. The JavaScript interpreter works from the currently executing scope and works it way out until it finds the variable in question. If the variable is not found in any scope, then an exception is thrown.

This type of look up is called [lexical (static) scope](http://en.wikipedia.org/wiki/Lexical_scoping#Lexical_scoping). The static structure of a program determines the variable scope. The scope of a variable is defined by its location within the source code, and nested functions have access to variables declared in their outer scope. No matter where a function is called from, or even how it’s called, its lexical scope depends only by where the function was declared.

In JavaScript, variables with the same name can be specified at multiple layers of nested scope. In such case local variables gain priority over global variables. If you declare a local variable and a global variable with the same name, the local variable will take precedence when you use it inside a function. This type of behavior is called shadowing. Simply put, the inner variable shadows the outer.

That’s the exact mechanism used when a JavaScript interpreter is trying to find a particular variable. It starts at the innermost scope being executed at the time, and continue until the first match is found, no matter whether there are other variables with the same name in the outer levels or not. Let’s see an example:

	var test = "I'm global";
	 
	function testScope() {
	  var test = "I'm local";
	 
	  console.log (test);     
	}
	 
	testScope();           // output: I'm local
	 
	console.log(test);     // output: I'm global


[Try out the example in JS Bin](http://jsbin.com/lewufuroqi/2/edit?js,console,output)

As we can see even with the same name the local variable doesn’t overwrite the global one after the execution of `testScope()` function. But this is not always the truth. Let’s consider this:


	var test = "I'm global";
	 
	function testScope() {
	  test = "I'm local";
	 
	  console.log(test);     
	}
	 
	console.log(test);     // output: I'm global
	 
	testScope();           // output: I'm local
	 
	console.log(test);     // output: I'm local (the global variable is reassigned)


[Try out the example in JS Bin](http://jsbin.com/lewufuroqi/3/edit?js,console,output)

This time the local variable `test` overwrites the global variable with the same name. When we run the code inside `testScope()` function the global variable is reassigned. If a local variable is assigned without first being declared with the `var` keyword, it becomes a global variable. To avoid such unwanted behavior you should always declare your local variables before you use them. Any variable declared with the `var` keyword inside of a function is a local variable. It’s considered best practice to declare your variables.

Note – In [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode), it is an error, if you assign value to variable without first declaring the variable.


## Hoisting

A JavaScript interpreter performs many things behind the scene, and one of them is called hoisting. If you are not aware of this “hidden” behavior, it can cause a lot of confusion. The best way of thinking about the behavior of JavaScript variables is to always visualize them as consisting of two parts: a declaration and an assignment:


	var state;             // variable declaration
	state = "ready";       // variable definition (assignment)
	 
	var state = "ready";   // declaration plus definition


In the above code we first declare variable `state`, and then we assign the value “ready” to it. And in the last line of code we see that these two steps can be combined. But what you need to bear in mind is, even though they seem like one statement, in practice, the JavaScript engine treats that single statement as two separate statements, just like in the first two lines in the example.

We already know that any variable declared within a scope belongs to that scope. But what we don’t know yet, is that no matter where variables are declared within a particular scope, all variable declarations are moved to the top of their scope (global or local). This is called hoisting, as the variable declarations are hoisted to the top of the scope. Note that hoisting only moves the declaration. Any assignments are left in place. Let’s see an example:

	console.log(state);   // output: undefined
	var state = "ready";

[Try out the example in JS Bin](http://jsbin.com/lewufuroqi/4/edit?js,console,output)

As you can see when we log the value of `state`, the output is `undefined`, because we reference it before the actual assignment. You may have expected a ReferenceError to be thrown because `state` is not declared yet. But what you don’t know is that the variable is declared behind the scene. Here is how the code is interpreted by a JavaScript engine:


	var state;           // moved to the top
	console.log(state);   
	state = "ready";     // left in place

Hoisting also affects function declarations. But before we see some examples, let’s first learn the difference between function declaration and function expression.

	function showState() {}          // function declaration
	var showState = function() {};   // function expression


The easiest way to distinguish a function declaration from a function expression is to check the position of the word `function` in the statement. If `function` is the very first thing in the statement, then it’s a function declaration. Otherwise, it’s a function expression.

Function declarations are hoisted completely. This means that the entire function’s body is moved to the top. This allows you to call a function before it has been declared:


	showState();            // output: Ready
	 
	function showState() {
	  console.log("Ready");
	} 
	 
	var showState = function() {
	  console.log("Idle");
	};


[Try out the example in JS Bin](http://jsbin.com/lewufuroqi/5/edit?js,console,output)

The reason the preceding code works is that JavaScript engine moves the declaration of `showState()` function, and all its content, to the beginning of the scope. The code is interpreted like this:


	function showState() {     // moved to the top (function declaration)
	  console.log("Ready");
	} 
	 
	var showState;            // moved to the top (variable declaration)
	 
	showState();  
	 
	showState = function() {   // left in place (variable assignment)
	  console.log("Idle");
	};


As you may have noticed, only the function declaration is hoisted, but the function expression is not. When a function is assigned to a variable, the rules are the same as for variable hoisting (only the declaration is moved, while the assignment is left in place).

In the code above we saw that the function declaration takes precedence over the variable declaration. And in the next example we’ll see that when we have function declaration versus variable assignment, the last takes priority.

	var showState = function() {
	  console.log("Idle");
	};
	 
	function showState() {
	  console.log("Ready");
	} 
	 
	showState();            // output: Idle


[Try out the example in JS Bin](http://jsbin.com/lewufuroqi/6/edit?js,console,output)

This time we call showState() function in the last line of code which change the situation. Now we get output “Idle”. Here is how it looks when interpreted by JavaScript engine:


	function showState(){        // moved to the top (function declaration)
	  console.log("Ready");
	} 
	 
	var showState;               // moved to the top (variable declaration)
	 
	showState = function(){      // left in place (variable assignment)
	  console.log("Idle");
	};
	 
	showState();


## Things to Remember

- All declarations, both functions and variables, are hoisted to the top of the containing scope, before any part of your code is executed.
- Functions are hoisted first, and then variables.
- Function declarations have priority over variable declarations, but not over variable assignments.






GitHub版本: [https://github.com/cncounter/translation/blob/master/tiemao_2015/19_JavaScript_Scope_Hoisting/JavaScript_Scope_Hoisting.md](https://github.com/cncounter/translation/blob/master/tiemao_2015/19_JavaScript_Scope_Hoisting/JavaScript_Scope_Hoisting.md)

原文链接: [http://www.sitepoint.com/demystifying-javascript-variable-scope-hoisting/](http://www.sitepoint.com/demystifying-javascript-variable-scope-hoisting/)

作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

日期: 2015年07月14日
