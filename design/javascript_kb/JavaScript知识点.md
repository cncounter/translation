# JavaScript 知识点


## 外部知识

1. Chrome控制台

   审查、CSS、JS

2. 基本调试

   断点、debugger、console

3. 网络知识

   HTTP、状态码

4. HTML + CSS 基础

   优先级、解析

## JS语法

1. 定义变量,基本类型

  var, 全局赋值, window["xxx"], window.xxx
  typeof: number,string,boolean,object,undefined,function


2. 函数基础

   普通函数
   构造函数

3. DOM 基础

4. BOM 基础

5. AJAX基础

6. jQuery基础



## 高级用法

1. 继承、扩展

  prototype

2. 闭包

   函数内的函数引用溢出.

   分析,堆内存,垃圾回收,scope,


3. 属性、特性

   不可删除
   括号表达式
   声明提前

	
	!(function(){
	   var age = 18;
	   testDel();
	   function testDel(){
	       alert("声明提前:age=" + age);
	       var age = 20;
	       alert("赋值之后:age=" + age);
	       var delResult = delete age;
	       alert("delete age: " + delResult + ";删除之后:age=" + age);
	       //
	       var obj = {};
	       obj.age = age;
	       alert("赋值之后: obj.age=" + obj.age);
	       var delObjAge = delete obj.age;
	       alert("delete obj.age: " + delObjAge + ";删除之后:obj.age=" + obj.age);

	   };
	})()
