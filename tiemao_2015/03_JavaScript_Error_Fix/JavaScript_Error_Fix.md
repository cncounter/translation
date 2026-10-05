# JavaScript 的坑人错误(Error)及修正

看到一篇译文: [JS错误的诊断与修复](http://blog.csdn.net/whqet/article/details/43222709)

JavaScript can be a nightmare to debug: Some errors it gives can be very difficult to understand at first, and the line numbers given aren’t always helpful either. Wouldn’t it be useful to have a list where you could look to find out what they mean and how to fix them? Here you go!

JavaScript 调试起来可能是一场噩梦: 它给出的某些错误一开始非常难以理解, 而且提供的行号也未必有用。如果能有一份列表, 让你可以查到这些错误的含义以及修复方法, 那该多有用啊? 下面就是了!


Below is a list of the strange errors in JavaScript. Different browsers can give you different messages for the same error, so there are several different examples where applicable.

下面列出了 JavaScript 中那些奇怪的错误。对于同一个错误, 不同的浏览器可能会给出不同的提示信息, 所以只要适用, 就会给出好几个不同的示例。

### 如何阅读错误信息?


Before the list, let’s quickly look at the structure of an error message. Understanding the structure helps understand the errors, and you’ll have less trouble if you run into any errors not listed here.

在看列表之前, 我们先快速看一下错误信息的结构。理解这个结构有助于理解各种错误, 这样即使遇到本文未列出的错误, 你也不会太头疼。

A typical error from Chrome looks like this:

Chrome 中一个典型的错误信息长这样:

	Uncaught TypeError: undefined is not a function

The structure of the error is as follows:

错误信息的结构如下:


1. **Uncaught TypeError**: This part of the message is usually not very useful. Uncaught means the error was not caught in a catch statement, and TypeError is the error’s name.
2. **undefined is not a function**: This is the message part. With error messages, you have to read them very literally. For example in this case it literally means that the code attempted to use undefined like it was a function.

1. **Uncaught TypeError**: 这部分信息通常没什么用。Uncaught 表示该错误没有被 catch 语句捕获, 而 TypeError 是这个错误的名称。
2. **undefined is not a function**: 这是错误的消息部分。对于错误信息, 你必须非常字面地去理解。例如在这个例子中, 它的字面意思就是: 代码试图把 undefined 当作函数来使用。

Other webkit-based browsers, like Safari, give errors in a similar format to Chrome. Errors from Firefox are similar, but do not always include the first part, and recent versions of Internet Explorer also give simpler errors than Chrome – but in this case, simpler does not always mean better.

其他基于 webkit 的浏览器(如 Safari)给出的错误格式与 Chrome 类似。Firefox 的错误与之相似, 但并非总是包含第一部分; 较新版本的 Internet Explorer 给出的错误也比 Chrome 更简单 —— 但在这种情况下, 更简单并不总是意味着更好。

Now onto the actual errors.

下面进入正题, 看看实际的错误。

### Uncaught TypeError: undefined is not a function

**Related errors**: number is not a function, object is not a function, string is not a function, Unhandled Error: ‘foo’ is not a function, Function Expected

**相关错误**: number is not a function, object is not a function, string is not a function, Unhandled Error: ‘foo’ is not a function, Function Expected

Occurs when attempting to call a value like a function, where the value is not a function. For example:

当试图把一个不是函数的值当作函数来调用时, 就会发生这种错误。例如:

	var foo = undefined;
	foo();

This error typically occurs if you are trying to call a function in an object, but you typed the name wrong.

这种错误通常发生在你想调用对象中的某个函数, 但把名字写错了的时候。

	var x = document.getElementByID('foo');


Since object properties that don’t exist are undefined by default, the above would result in this error.

由于不存在的对象属性默认就是 undefined, 所以上面的代码会导致这个错误。

The other variations such as “number is not a function” occur when attempting to call a number like it was a function.

其他变体(如 “number is not a function”)则发生在试图把数字当作函数来调用的时候。

**How to fix this error**: Ensure the function name is correct. With this error, the line number will usually point at the correct location.

**如何修复这个错误**: 确保函数名是正确的。对于这个错误, 行号通常会指向正确的位置。


### Uncaught ReferenceError: Invalid left-hand side in assignment

**Related errors**: Uncaught exception: ReferenceError: Cannot assign to ‘functionCall()’, Uncaught exception: ReferenceError: Cannot assign to ‘this’

**相关错误**: Uncaught exception: ReferenceError: Cannot assign to ‘functionCall()’, Uncaught exception: ReferenceError: Cannot assign to ‘this’

Caused by attempting to assign a value to something that cannot be assigned to.

原因是在试图给一个不能被赋值的对象赋值。

The most common example of this error is with if-clauses:

这种错误最常见的例子出现在 if 子句中:

	if(doSomething() = 'somevalue')

In this example, the programmer accidentally used a single equals instead of two. The message “left-hand side in assignment” is referring to the part on the left side of the equals sign, so like you can see in the above example, the left-hand side contains something you can’t assign to, leading to the error.

在这个例子中, 程序员不小心只写了一个等号, 而不是两个。“left-hand side in assignment” 这条消息指的是等号左侧的部分, 所以正如你在上面的例子中看到的, 左侧包含了一个你不能赋值的对象, 从而导致了该错误。

**How to fix this error**: Make sure you’re not attempting to assign values to function results or to the this keyword.

**如何修复这个错误**: 确保你没有试图给函数结果或 this 关键字赋值。

### Uncaught TypeError: Converting circular structure to JSON

**Related errors**: Uncaught exception: TypeError: JSON.stringify: Not an acyclic Object, TypeError: cyclic object value, Circular reference in value argument not supported

**相关错误**: Uncaught exception: TypeError: JSON.stringify: Not an acyclic Object, TypeError: cyclic object value, Circular reference in value argument not supported

Always caused by a circular reference in an object, which is then passed into `JSON.stringify`.

总是由对象中的循环引用引起的, 然后该对象被传入了 `JSON.stringify`。

	var a = { };
	var b = { a: a };
	a.b = b;
	JSON.stringify(a);

Because both `a` and `b` in the above example have a reference to each other, the resulting object cannot be converted into JSON.

因为上面例子中的 `a` 和 `b` 互相引用, 所以生成的对象无法转换为 JSON。

**How to fix this error**: Remove circular references like in the example from any objects you want to convert into JSON.

**如何修复这个错误**: 从任何你想转换为 JSON 的对象中移除类似示例中的循环引用。


### Unexpected token ;

**Related errors**: Expected ), missing ) after argument list

**相关错误**: Expected ), missing ) after argument list

The JavaScript interpreter expected something, but it wasn’t there. Typically caused by mismatched parentheses or brackets.

JavaScript 解释器期望出现某些东西, 但它却不在那里。通常是由不匹配的圆括号或方括号引起的。

The token in this error can vary – it might say “Unexpected token ]” or “Expected {” etc.

这个错误中的 token 可能各不相同 —— 它可能显示 “Unexpected token ]” 或 “Expected {” 等等。

**How to fix this error**: Sometimes the line number with this error doesn’t point to the correct place, making it difficult to fix.

**如何修复这个错误**: 有时这个错误的行号并不能指向正确的位置, 导致难以修复。

- An error with [ ] { } ( ) is usually caused by a mismatching pair. Check that all your parentheses and brackets have a matching pair. In this case, line number will often point to something else than the problem character
- Unexpected / is related to regular expressions. The line number for this will usually be correct.
- Unexpected ; is usually caused by having a ; inside an object or array literal, or within the argument list of a function call. The line number will usually be correct for this case as well

- 与 [ ] { } ( ) 相关的错误通常是由不匹配的配对引起的。检查你所有的圆括号和方括号是否都有配对的另一半。在这种情况下, 行号常常会指向问题字符之外的其他地方
- Unexpected / 与正则表达式有关。它的行号通常是正确的。
- Unexpected ; 通常是由对象或数组字面量内部, 或者函数调用的参数列表中出现了 ; 引起的。这种情况下行号通常也是正确的


### Uncaught SyntaxError: Unexpected token ILLEGAL

**Related errors**: Unterminated String Literal, Invalid Line Terminator

**相关错误**: Unterminated String Literal, Invalid Line Terminator

A string literal is missing the closing quote.

字符串字面量缺少了结尾的引号。

**How to fix this error**: Ensure all strings have the correct closing quote.

**如何修复这个错误**: 确保所有字符串都有正确的结尾引号。


### Uncaught TypeError: Cannot read property ‘foo’ of null, 
### Uncaught TypeError: Cannot read property ‘foo’ of undefined

**Related errors**: TypeError: someVal is null, Unable to get property ‘foo’ of undefined or null reference

**相关错误**: TypeError: someVal is null, Unable to get property ‘foo’ of undefined or null reference

Attempting to read `null` or `undefined` as if it was an object. For example:

试图把 `null` 或 `undefined` 当作对象来读取。例如:

	var someVal = null;
	console.log(someVal.foo);

**How to fix this error**: Usually caused by typos. Check that the variables used near the line number pointed by the error are correctly named.

**如何修复这个错误**: 通常是由拼写错误引起的。检查错误所指行号附近使用的变量是否命名正确。


### Uncaught TypeError: Cannot set property ‘foo’ of null, 
### Uncaught TypeError: Cannot set property ‘foo’ of undefined

**Related errors**: TypeError: someVal is undefined, Unable to set property ‘foo’ of undefined or null reference

**相关错误**: TypeError: someVal is undefined, Unable to set property ‘foo’ of undefined or null reference

Attempting to write `null` or `undefined` as if it was an object. For example:

试图把 `null` 或 `undefined` 当作对象来写入。例如:

	var someVal = null;
	someVal.foo = 1;

**How to fix this error**: This too is usually caused by typos. Check the variable names near the line the error points to.

**如何修复这个错误**: 这通常也是由拼写错误引起的。检查错误所指行附近的变量名。


### Uncaught RangeError: Maximum call stack size exceeded

**Related errors**: Uncaught exception: RangeError: Maximum recursion depth exceeded, too much recursion, Stack overflow

**相关错误**: Uncaught exception: RangeError: Maximum recursion depth exceeded, too much recursion, Stack overflow

Usually caused by a bug in program logic, causing infinite recursive function calls.

通常是由程序逻辑中的 bug 引起的, 导致无限递归的函数调用。

**How to fix this error**: Check recursive functions for bugs that could cause them to keep recursing forever.

**如何修复这个错误**: 检查递归函数中是否有会导致它们一直无限递归下去的 bug。


### Uncaught URIError: URI malformed

**Related errors**: URIError: malformed URI sequence

**相关错误**: URIError: malformed URI sequence

Caused by an invalid decodeURIComponent call.

由一次无效的 decodeURIComponent 调用引起。

**How to fix this error**: Check that the `decodeURIComponent` call at the error’s line number gets correct input.

**如何修复这个错误**: 检查错误行号处的 `decodeURIComponent` 调用是否接收到了正确的输入。

### XMLHttpRequest cannot load http://some/url/. No ‘Access-Control-Allow-Origin’ header is present on the requested resource

**Related errors**: Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://some/url/

**相关错误**: Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://some/url/

This error is always caused by the usage of XMLHttpRequest.

这个错误总是由使用 XMLHttpRequest 引起的。

How to fix this error: Ensure the request URL is correct and it respects the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy). A good way to find the offending code is to look at the URL in the error message and find it from your code.

如何修复这个错误: 确保请求 URL 是正确的, 并且遵守 [同源策略](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)。找出问题代码的一个好方法是: 查看错误信息中的 URL, 然后在你的代码里找到它。


### InvalidStateError: An attempt was made to use an object that is not, or is no longer, usable

**Related errors**: InvalidStateError, DOMException code 11

**相关错误**: InvalidStateError, DOMException code 11

Means the code called a function that you should not call at the current state. Occurs usually with `XMLHttpRequest`, when attempting to call functions on it before it’s ready.

意味着代码调用了在当前状态下不应该调用的函数。通常发生在 `XMLHttpRequest` 上, 在它准备好之前就试图调用它的函数。

	var xhr = new XMLHttpRequest();
	xhr.setRequestHeader('Some-Header', 'val');

In this case, you would get the error because the setRequestHeader function can only be called after calling `xhr.open`.

在这种情况下, 你会得到这个错误, 因为 setRequestHeader 函数只能在调用 `xhr.open` 之后才能被调用。

**How to fix this error**: Look at the code on the line pointed by the error and make sure it runs at the correct time, or add any necessary calls before it (such as `xhr.open`)

**如何修复这个错误**: 查看错误所指行上的代码, 确保它在正确的时间运行, 或者在它之前添加任何必要的调用(如 `xhr.open`)。

### 结论

JavaScript has some of the most unhelpful errors I’ve seen, with the exception of the notorious `Expected T_PAAMAYIM_NEKUDOTAYIM` in PHP. With more familiarity the errors start to make more sense. Modern browsers also help, as they no longer give the completely useless errors they used to.

JavaScript 的错误是我见过的最没帮助的错误之一, 只有 PHP 中那个臭名昭著的 `Expected T_PAAMAYIM_NEKUDOTAYIM` 除外。随着越来越熟悉, 这些错误也开始变得更有意义。现代浏览器也提供了帮助, 因为它们不再给出过去那种完全没用的错误了。

What’s the most confusing error you’ve seen? Share the frustration in the comments

你见过最难懂的错误是什么? 在评论里分享一下你的抓狂经历吧


**About Jani Hartikainen**

Jani Hartikainen has spent over 10 years building web applications. His clients include companies like Nokia and hot super secret startups. When not programming or playing games, Jani writes about JavaScript and high quality code on his site.

Jani Hartikainen 花了 10 多年时间构建 Web 应用。他的客户包括 Nokia 以及一些炙手可热的神秘创业公司。不写代码也不玩游戏的时候, Jani 会在他的网站上撰写关于 JavaScript 和高质量代码的文章。

个人网站: [http://codeutopia.net/](http://codeutopia.net/)






原文链接: [JavaScript Errors and How to Fix Them](http://davidwalsh.name/fix-javascript-errors)

原文日期: 2009-10-19

翻译日期: 2015-01-18

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
