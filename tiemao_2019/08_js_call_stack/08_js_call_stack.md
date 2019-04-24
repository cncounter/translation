# 获取JS中的调用栈

## 1、 arguments 简介

JavaScript中，函数被执行时, 相关的参数和信息, 会封装到一个类似数组(array-like)的对象中, 通过 `arguments` 可以引用到。

`arguments` 只能在函数之中使用, 属于约定好的符号, 不是关键字，而 `this` 则是关键字。

类数组(array-like)对象, 本质是一个普通对象, 但具有数组的某些特征; 比如:  `length`, 以及可以通过下标(index)来访问某些值; 

类数组对象, 可能不具备数组的某些方法。所以会看到类似这样的代码: `Array.prototype.slice.call(arguments, 0, 1)`

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

## 2、 callee 简介

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



### 3、 获取当前函数的名称

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
```


执行结果为:

```
demoFuncion() return: demoFuncion
func2() return: demoFuncion
func3() return: func1
```

可以看到, 匿名函数第一次赋值给 func1, 所以 func3 引用的函数的名字实际上是 func1。



## 4、获取JS中的调用栈

一般来说，创建 Error 对象时会自动收集堆栈信息。

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
```

执行后，输出结果如下:

```

"Error: hahaha
    at checkCallStack (<anonymous>:1:37)
    at testSS (<anonymous>:2:26)
    at <anonymous>:3:1"
```


## 5、创建一个空对象



一般来说有3种方式, 至于 eval和JSON反序列化之类的则不讨论。

在控制台执行以下代码：

```
// 创建空对象
c = {};
d = new Object();
e = Object.create(null);
//
console.log("c:", c);
console.log("d:", d);
console.log("e:", e);
```

展开之后

```
c: 
{}
__proto__: Object

d: 
{}
__proto__: Object

e: 
{}
No properties

```

可以看到, e 没有任何属性, 连 `__proto__` 都没有。


## 6、 数组去重

```
j = [...new Set([1, 2, 3, 3])]
// 结果是 [1, 2, 3]
```

其中，使用了 [剩余参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters) 和 Set 类。


## 7、 合并对象属性

```
person = { name: 'David Walsh', gender: 'Male' };
tools = { computer: 'Mac', editor: 'Atom' };
attributes = { handsomeness: 'Extreme', hair: 'Brown', eyes: 'Blue' };

summary = {...person, ...tools, ...attributes};
```

结果是:

```
{
  computer: "Mac"
  editor: "Atom"
  eyes: "Blue"
  gender: "Male"
  hair: "Brown"
  handsomeness: "Extreme"
  name: "David Walsh"
}
```

## 8、URL地址栏的请求参数


```
// 假设查询参数是: "?name=tiemao&action=list"

//
var paramStr= window.location.search;

paramStr = "?name=tiemao&action=list"; // 临时赋值-演示


var urlParams = new URLSearchParams(paramStr);

console.log(urlParams.has('name')); // true
console.log(urlParams.get('action')); // "list"
console.log(urlParams.getAll('action')); // ["list"]
console.log(urlParams.toString()); // "name=tiemao&action=list"
//
urlParams.append('active', '1')
console.log(urlParams.toString()); // "name=tiemao&action=list&active=1"
urlParams.append('active', '2')
console.log(urlParams.toString()); // "name=tiemao&action=list&active=1&active=2"
console.log(urlParams.getAll('active')); // ["1", "2"]
```

可以看到， URLSearchParams 还是很方便的。



2019年4月24日

部分参考: <https://davidwalsh.name/javascript-tricks>
