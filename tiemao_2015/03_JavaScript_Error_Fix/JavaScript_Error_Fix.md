# JavaScript 的坑人错误(Error)及修正

看到一篇译文: [JS错误的诊断与修复](http://blog.csdn.net/whqet/article/details/43222709)

JavaScript can be a nightmare to debug: Some errors it gives can be very difficult to understand at first, and the line numbers given aren’t always helpful either. Wouldn’t it be useful to have a list where you could look to find out what they mean and how to fix them? Here you go!


Below is a list of the strange errors in JavaScript. Different browsers can give you different messages for the same error, so there are several different examples where applicable.

### How to read errors?


Before the list, let’s quickly look at the structure of an error message. Understanding the structure helps understand the errors, and you’ll have less trouble if you run into any errors not listed here.

A typical error from Chrome looks like this:

	Uncaught TypeError: undefined is not a function

The structure of the error is as follows:


1. **Uncaught TypeError**: This part of the message is usually not very useful. Uncaught means the error was not caught in a catch statement, and TypeError is the error’s name.
2. **undefined is not a function**: This is the message part. With error messages, you have to read them very literally. For example in this case it literally means that the code attempted to use undefined like it was a function.

Other webkit-based browsers, like Safari, give errors in a similar format to Chrome. Errors from Firefox are similar, but do not always include the first part, and recent versions of Internet Explorer also give simpler errors than Chrome – but in this case, simpler does not always mean better.

Now onto the actual errors.

### Uncaught TypeError: undefined is not a function

**Related errors**: number is not a function, object is not a function, string is not a function, Unhandled Error: ‘foo’ is not a function, Function Expected

Occurs when attempting to call a value like a function, where the value is not a function. For example:

	var foo = undefined;
	foo();

This error typically occurs if you are trying to call a function in an object, but you typed the name wrong.

	var x = document.getElementByID('foo');


Since object properties that don’t exist are undefined by default, the above would result in this error.

The other variations such as “number is not a function” occur when attempting to call a number like it was a function.

**How to fix this error**: Ensure the function name is correct. With this error, the line number will usually point at the correct location.


### Uncaught ReferenceError: Invalid left-hand side in assignment

**Related errors**: Uncaught exception: ReferenceError: Cannot assign to ‘functionCall()’, Uncaught exception: ReferenceError: Cannot assign to ‘this’

Caused by attempting to assign a value to something that cannot be assigned to.

The most common example of this error is with if-clauses:

	if(doSomething() = 'somevalue')

In this example, the programmer accidentally used a single equals instead of two. The message “left-hand side in assignment” is referring to the part on the left side of the equals sign, so like you can see in the above example, the left-hand side contains something you can’t assign to, leading to the error.

**How to fix this error**: Make sure you’re not attempting to assign values to function results or to the this keyword.

### Uncaught TypeError: Converting circular structure to JSON

**Related errors**: Uncaught exception: TypeError: JSON.stringify: Not an acyclic Object, TypeError: cyclic object value, Circular reference in value argument not supported

Always caused by a circular reference in an object, which is then passed into `JSON.stringify`.

	var a = { };
	var b = { a: a };
	a.b = b;
	JSON.stringify(a);

Because both `a` and `b` in the above example have a reference to each other, the resulting object cannot be converted into JSON.

**How to fix this error**: Remove circular references like in the example from any objects you want to convert into JSON.


### Unexpected token ;

**Related errors**: Expected ), missing ) after argument list

The JavaScript interpreter expected something, but it wasn’t there. Typically caused by mismatched parentheses or brackets.

The token in this error can vary – it might say “Unexpected token ]” or “Expected {” etc.

**How to fix this error**: Sometimes the line number with this error doesn’t point to the correct place, making it difficult to fix.

- An error with [ ] { } ( ) is usually caused by a mismatching pair. Check that all your parentheses and brackets have a matching pair. In this case, line number will often point to something else than the problem character
- Unexpected / is related to regular expressions. The line number for this will usually be correct.
- Unexpected ; is usually caused by having a ; inside an object or array literal, or within the argument list of a function call. The line number will usually be correct for this case as well


### Uncaught SyntaxError: Unexpected token ILLEGAL

**Related errors**: Unterminated String Literal, Invalid Line Terminator

A string literal is missing the closing quote.

**How to fix this error**: Ensure all strings have the correct closing quote.


### Uncaught TypeError: Cannot read property ‘foo’ of null, 
### Uncaught TypeError: Cannot read property ‘foo’ of undefined

**Related errors**: TypeError: someVal is null, Unable to get property ‘foo’ of undefined or null reference

Attempting to read `null` or `undefined` as if it was an object. For example:

	var someVal = null;
	console.log(someVal.foo);

**How to fix this error**: Usually caused by typos. Check that the variables used near the line number pointed by the error are correctly named.


### Uncaught TypeError: Cannot set property ‘foo’ of null, 
### Uncaught TypeError: Cannot set property ‘foo’ of undefined

**Related errors**: TypeError: someVal is undefined, Unable to set property ‘foo’ of undefined or null reference

Attempting to write `null` or `undefined` as if it was an object. For example:

	var someVal = null;
	someVal.foo = 1;

**How to fix this error**: This too is usually caused by typos. Check the variable names near the line the error points to.


### Uncaught RangeError: Maximum call stack size exceeded

**Related errors**: Uncaught exception: RangeError: Maximum recursion depth exceeded, too much recursion, Stack overflow

Usually caused by a bug in program logic, causing infinite recursive function calls.

**How to fix this error**: Check recursive functions for bugs that could cause them to keep recursing forever.


### Uncaught URIError: URI malformed

**Related errors**: URIError: malformed URI sequence

Caused by an invalid decodeURIComponent call.

**How to fix this error**: Check that the `decodeURIComponent` call at the error’s line number gets correct input.

### XMLHttpRequest cannot load http://some/url/. No ‘Access-Control-Allow-Origin’ header is present on the requested resource

**Related errors**: Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://some/url/

This error is always caused by the usage of XMLHttpRequest.

How to fix this error: Ensure the request URL is correct and it respects the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy). A good way to find the offending code is to look at the URL in the error message and find it from your code.


### InvalidStateError: An attempt was made to use an object that is not, or is no longer, usable

**Related errors**: InvalidStateError, DOMException code 11

Means the code called a function that you should not call at the current state. Occurs usually with `XMLHttpRequest`, when attempting to call functions on it before it’s ready.

	var xhr = new XMLHttpRequest();
	xhr.setRequestHeader('Some-Header', 'val');

In this case, you would get the error because the setRequestHeader function can only be called after calling `xhr.open`.

**How to fix this error**: Look at the code on the line pointed by the error and make sure it runs at the correct time, or add any necessary calls before it (such as `xhr.open`)

### Conclusion

JavaScript has some of the most unhelpful errors I’ve seen, with the exception of the notorious `Expected T_PAAMAYIM_NEKUDOTAYIM` in PHP. With more familiarity the errors start to make more sense. Modern browsers also help, as they no longer give the completely useless errors they used to.

What’s the most confusing error you’ve seen? Share the frustration in the comments


**About Jani Hartikainen**

Jani Hartikainen has spent over 10 years building web applications. His clients include companies like Nokia and hot super secret startups. When not programming or playing games, Jani writes about JavaScript and high quality code on his site.

个人网站: [http://codeutopia.net/](http://codeutopia.net/)






原文链接: [JavaScript Errors and How to Fix Them](http://davidwalsh.name/fix-javascript-errors)

原文日期: 2009-10-19

翻译日期: 2015-01-18

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

