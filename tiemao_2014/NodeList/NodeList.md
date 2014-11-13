为何getElementsByTagName()比querySelectorAll()快100倍
==

![](01_vs.png)

昨天,我在雅虎的同事 [Scott Schiller](http://www.schillmania.com/) (斯科特·席勒, 同时也是SoundManager创造者) 发Twitter询问为何 `getElementsByTagName("a")` 在所有浏览器上都比 `querySelectorAll("a")` 要快好多倍。 有一个 专门的 [JSPerf测试页面](http://jsperf.com/queryselectorall-vs-getelementsbytagname), 通过对比就能发现两者的速度差异相当明显。 比如作者在Windows XP下使用的 Firefox 3.6.8 浏览器, `querySelectorAll("a")` 比 `getElementsByTagName("a")` 的运行速度要低98%. 我和 Scott, 以及 YUI团队的 [Ryan Grove](http://www.wonko.com/) 有一个活跃的Twitter-sation， 关于这种现象的原因,以及情理之中让人沮丧的结果。 我想好好地解释说明下到底为什么会发生这种情况,以及为什么未来也可能不会改变。

在深入细节之前需要了解这两个方法间一个非常重要的区别,我想说的并不是他们接收的参数一个是标签名,另一个是整个CSS选择器。 而其**最大的区别在于返回值的不同**: `getElementsByTagName()` 方法返回一个动态的(live) `NodeList`,  而 `querySelectorAll()` 返回的是一个静态的(static) `NodeList`. 理解这一点是非常必要的.

## 动态 NodeList ##

这是文档对象模型(DOM,Document Object Model)中的一个大坑.  `NodeList` 对象(以及 HTML DOM 中的 `HTMLCollection` 对象)是一种特殊类型的对象. [DOM Level 3 spec 规范](http://www.w3.org/TR/DOM-Level-3-Core/core.html#td-live) 对 `HTMLCollection` 对象的描述如下:

DOM中的 `NodeList` 和 `NamedNodeMap` 对象是动态的(live); 
也就是说,对底层文档结构的修改会动态地反映到相关的集合 `NodeList` 和 `NamedNodeMap` 中。 例如, 如果先获取了某个元素(`Element`)的子元素的动态集合 `NodeList` 对象, 然后又在其他地方顺序添加更多子元素到这个DOM父元素中( 可以说添加, 修改, 删除子元素等操作), 这些更改将自动反射到 `NodeList`, 不需要手动进行其他调用. 同样地, 对DOM树上某个`Node`节点的修改,也会实时影响引用了该节点的 `NodeList` 和 `NamedNodeMap` 对象。

`getElementsByTagName()` 方法返回对应标签名的元素的一个动态集合, 只要document发生变化,就会自动更新对应的元素。 因此, 下面的代码实际上是一个死循环:

	// XXX 实际中请注意... 
	// 适当的中间变量是一个好习惯
	var divs = document.getElementsByTagName("div");
	var i=0;
	
	while(i < divs.length){
	    document.body.appendChild(document.createElement("div"));
	    i++;
	}

死循环的原因是每次循环都会重新计算 `divs.length`. 每次迭代都会添加一个新的 `<div>`, 所以每次 `i++` ,对应的 `divs.length` 也在增加, 所以 `i` 永远比`divs.length`小, 循环终止条件也就不会触发[例外情况是dom中没有div,不进入循环]。

你可能会觉得这种动态集合是个坏主意, 但通过动态集合可以保证某些使用非常普遍的对象在各种情况下都是同一个, 如 `document.images` , `document.forms`, 以及其他类似的 pre-DOM集合。

## 需要整理

## 静态 NodeList ##

的 querySelectorAll() 方法是不同的,因为它是一个静态的 节点列表 而不是一个生活。 这是表示的 选择器API规范 :

的 节点列表 返回的对象 querySelectorAll() 方法 必须 是静态的,而不是生活((dom level 3 core) 1.1.1节)。 后续更改底层文档的结构 不得 是反映在 节点列表 对象。 这意味着对象将包含匹配的列表 元素 节点在文档的创建列表。

所以即使的返回值 querySelectorAll() 有相同的方法和行为返回的相同吗 getElementsByTagName() 实际上,他们是非常不同的。 在前一种情况下, 节点列表 是文档的状态的快照方法被调用时,而后者总是会及时了解文档的当前状态。 这是 不 一个无限循环:


	var divs = document.querySelectorAll("div"),
	    i=0;
	
	while(i < divs.length){
	    document.body.appendChild(document.createElement("div"));
	    i++;
	}


在这种情况下没有无限循环。 的价值 divs.length 永远不会改变,所以循环将本质上的数量增加一倍 < div > 文档中的元素,然后退出。

## 那么,为什么动态节点更快呢? ##

生活 节点列表 对象可以创建并返回浏览器更快,因为他们不需要静态时前面的所有信息 节点列表 年代需要从一开始就有他们所有的数据。 再三强调这一点,WebKit的源代码有单独为每个类型的源文件 节点列表 : DynamicNodeList.cpp 和 StaticNodeList.cpp 。 中创建的两个对象类型是非常不同的方式。

的 DynamicNodeList 创建的对象 注册它的存在 在一个缓存。 从本质上讲,听到创建一个新的 DynamicNodeList 是令人难以置信的小,因为它没有做任何前期工作。 每当 DynamicNodeList 访问,必须查询文档的变化,证明了这一点吗 长度 财产 和 项目() 方法 (这是一样使用括号)。

相比之下, StaticNodeList 对象,其中的实例中创建另一个文件,然后填充所有的数据 在一个循环 。 前期成本上运行一个查询文档比当使用更重要 DynamicNodeList 实例。

如果你看一看真正的WebKit的源代码 创建一个返回值 为 querySelectorAll() ,您将看到一个循环使用每一个结果和建立一个 节点列表 这是最终返回。

## 结论 ##

`getElementsByTagName()` 速度比 `querySelectorAll()` 快的根本原因在于**动态NodeList**和**静态NodeList**对象的不同。 尽管我可以肯定地说有某种方法来优化这一点, 在获取`NodeList`时不需要执行很多前期处理操作的动态列表,总比获取静态的集合(返回之前完成各种处理)要快很多。 哪个方法更好用主要还是看你的需求, 如果只是要根据 tag name 来查找元素, 也不需要获取此一个快照, 那就应该使用 `getElementsByTagName()`方法; 如果需要快照结果(静态),或者需要使用复杂的CSS查询, 则可以考虑 `querySelectorAll()`。







原文链接: [Why is getElementsByTagName() faster than querySelectorAll()?](http://www.nczonline.net/blog/2010/09/28/why-is-getelementsbytagname-faster-that-queryselectorall/)

原文日期: 2010-09-28

翻译日期: 2014-11-23


标签: [getElementsByTagName](http://www.nczonline.net/blog/tag/getelementsbytagname/), [JavaScript](http://www.nczonline.net/blog/tag/javascript/), [NodeList](http://www.nczonline.net/blog/tag/nodelist/), [querySelectorAll](http://www.nczonline.net/blog/tag/queryselectorall/)