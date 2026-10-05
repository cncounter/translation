# JavaScript Array: slice vs splice

# JavaScript 数组: slice 与 splice


在 JavaScript 中, 把 `slice` 误当成 `splice`(或者反过来) 是新手甚至老手都常犯的错误。这两个函数虽然**名字相似**, 但做的事情**完全不同**。在实践中, 只要选择一个能表明函数是否会修改原对象的 API, 就能避免这种混淆。

数组的 `slice`(ECMAScript 5.1 规范 [15.4.4.10](http://es5.github.io/#x15.4.4.10) 节)与字符串的 `slice` 非常相似。根据规范, `slice` 需要接受两个参数, _start_ 和 _end_。它会返回**一个新数组**, 包含从给定起始索引开始, 直到指定结束索引之前(不包含结束索引)的元素。理解 slice 的作用并不难:

```
'abc'.slice(1,2)           // "b"
[14, 3, 77].slice(1, 2)    //  [3] 
```

slice 的一个重要特点是, 它**不会改变**调用它的那个数组。下面的代码片段演示了这一行为。可以看到, _x_ 仍保留原有的元素, 而 _y_ 得到的是切片后的版本。

```
var x = [14, 3, 77];
var y = x.slice(1, 2);
console.log(x);          // [14, 3, 77]
console.log(y);          // [3] 
```

虽然 `splice`([15.4.4.12](http://es5.github.io/#x15.4.4.12) 节)也接受两个参数(至少两个), 但含义差别很大:

```
[14, 3, 77].slice(1, 2)     //  [3]
[14, 3, 77].splice(1, 2)    //  [3, 77] 
```

除此之外, `splice` 还会**修改**调用它的数组。这不应当让人意外, 毕竟 _splice_ 这个名字本身就暗示了这一点。

```
var x = [14, 3, 77]
var y = x.splice(1, 2)
console.log(x)           // [14]
console.log(y)           // [3, 77] 
```

在编写自己的模块时, 选择一个能尽量减少这种 _slice vs splice_ 混淆的 API 非常重要。理想情况下, 模块的使用者不应该总要翻文档才能弄清自己到底想要哪一个。那么我们应该遵循什么样的命名约定呢?

我熟悉的一种约定(来自我过去参与 Qt 的经历)是: 选择正确的动词形式——用_现在时_表示可能会修改对象的操作, 用_过去分词_表示返回一个不修改原对象的新版本。如果可能, 同时提供这样一对方法。下面的示例演示了这一概念。

```
var p = new Point(100, 75);
p.translate(25, 25);
console.log(p);       // { x: 125, y: 100 }

var q = new Point(200, 100);
var s = q.translated(10, 50);
console.log(q);       // { x: 200, y: 100 }
console.log(s);       // { x: 210, y: 150 } 
```

注意 `translate()` 和 `translated()` 的区别: 前者会移动这个点(在二维笛卡尔坐标系中), 而后者只是创建一个平移后的版本。点对象 _p_ 发生了变化, 因为它调用了 `translate`。而对象 _q_ 保持不变, 因为 `translated()` **不会修改**它, 它只是返回一个**新的副本**作为新对象 _s_。

如果在整个应用中一致地使用这种约定, 这种混淆就会大大减少。总有一天, 你可以让你的用户开心地唱起 _I Can See Clearly Now_！



感谢: [众成翻译: http://www.zcfy.cc/original/1035](http://www.zcfy.cc/original/1035)



原文链接: [https://ariya.io/2014/02/javascript-array-slice-vs-splice](https://ariya.io/2014/02/javascript-array-slice-vs-splice)

2016年8月11日
