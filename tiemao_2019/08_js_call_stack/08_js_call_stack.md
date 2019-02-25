# 获取JS中的调用栈

在函数执行时, 相关的参数和信息,会被封装到一个类数组(array-like)对象中, 通过 `arguments` 来引用。

`arguments` 只能在函数之中使用, 属于约定好的符号, 而比如 `this` 之类的就是关键字。

类数组(array-like)对象, 就是一个普通对象, 但具有数组的某些特征; 比如:  `length`, 以及通过下标(index)访问某些值; 

类数组对象, 可能不具备数组的某些方法。所以你会看到类似这样的代码: `Array.prototype.slice.call(arguments, 0, 1)`。

言归正传, 请看示例:

```
function demo1(){
  console.dir(arguments);
}
//
demo1("6", 66, 666);

```

在浏览器控制台执行, 结果类似这样:

```
Arguments(3)
	0: "6"
	1: 66
	2: 666
	> callee: ƒ demo1()
	length: 3
	> Symbol(Symbol.iterator): ƒ values()
	> __proto__: Object
```

可以看到, 其中有一个属性叫做 `callee`,  本质上是一个函数, 展开之后内容为:

```
callee: ƒ demo1()
	arguments: null
	caller: null
	length: 0
	name: "demo1"
	> prototype: {constructor: ƒ}
	> __proto__: ƒ ()
	[[FunctionLocation]]: VM162:1
	> [[Scopes]]: Scopes[1]
```

`arguments.callee` 就表示当前函数, 



1、 获取当前函数的名称

请看代码1:

```
function demoFuncion(){
  return arguments.callee.name;
}
var func1 = function(){
  return arguments.callee.name;
}
//
var func2 = demoFuncion;
var func3 = func1;
//
console.log("demoFuncion() return: " + demoFuncion());
console.log("func2() return: " + func2());
console.log("func3() return: " + func3());

// 执行结果为:
// demoFuncion() return: demoFuncion
// func2() return: demoFuncion
// func3() return: func1

```

可以看到, 匿名函数赋值会影响



请看代码2:

```


```




// 获取JS中的调用栈
function checkCallStack(){
  var stack = "";
  try{
    throw new Error("test-for-call-stack")
  }catch(e){
    stack = e.stack;
  }
  //
  var stackArray = stack.split("\n");
  //
  // var curFuncName = arguments.callee.name;
  // 去掉前2个
  return stackArray.slice(2);
};


function testSS(){
  return checkCallStack();
};
stack = testSS();

/*
"Error: hahaha
    at checkCallStack (<anonymous>:1:37)
    at testSS (<anonymous>:2:26)
    at <anonymous>:3:1"
*/

