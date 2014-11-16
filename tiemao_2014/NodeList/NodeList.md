DOM中的动态NodeList与静态NodeList
==

### 副标题:  为何getElementsByTagName()比querySelectorAll()快100倍 ###


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


## 静态 NodeList ##

`querySelectorAll()` 方法的不同是它返回一个静态的 `NodeList`. 这是表示的 选择器API规范 :

`querySelectorAll()` 方法返回的 `NodeList` 对象**必须是静态的**, 而不能是动态的([DOM-LEVEL-3-CORE], section 1.1.1). 后续对底层document的更改不能影响到返回的这个 `NodeList` 对象. 这意味着返回的对象将包含在创建列表那一刻匹配的所有元素节点。

所以即便是让 `querySelectorAll()` 和  `getElementsByTagName()` 具有相同的参数和行为, 他们也是有很大的不同点。 在前一种情况下, 返回的 `NodeList` 就是方法被调用时刻的文档状态的快照, 而后者总是会随时根据document的状态而更新。 下面的代码就不会是死循环:


	var divs = document.querySelectorAll("div"),
	    i=0;
	
	while(i < divs.length){
	    document.body.appendChild(document.createElement("div"));
	    i++;
	}


在这种情况下没有死循环, `divs.length`的值永远不会改变, 所以循环实际上就是将 `<div>` 元素的数量增加一倍, 然后就退出循环。


## 为什么动态 NodeList 更快呢? ##

动态 `NodeList` 对象在浏览器中可以更快地被创建并返回,因为他们不需要预先获取所有的信息, 而静态 `NodeList` 从一开始就需要取得并封装所有相关数据. 再三强调要彻底了解这一点, WebKit 的源码中对每种 `NodeList` 类型都有一个单独的源文件: [DynamicNodeList.cpp](http://trac.webkit.org/browser/trunk/WebCore/dom/DynamicNodeList.cpp) 和 [StaticNodeList.cpp](http://trac.webkit.org/browser/trunk/WebCore/dom/StaticNodeList.cpp). 两种对象类型的创建方式是完全不同的。

`DynamicNodeList` 对象通过在cache缓存中 [注册它的存在](http://trac.webkit.org/browser/trunk/WebCore/dom/DynamicNodeList.cpp?rev=41093#L48) 并创建。 从本质上讲, 创建一个新的 `DynamicNodeList` 是非常轻量级的, 因为不需要做任何前期工作。 每次访问 `DynamicNodeList` 时, 必须查询 document 的变化, length 属性 以及 item() 方法证明了这一点(使用中括号的方式访问也是一样的).

相比之下, `StaticNodeList` 对象实例由另一个文件创建,然后[循环填充](http://trac.webkit.org/browser/trunk/WebCore/dom/SelectorNodeList.cpp?rev=41093#L61)所有的数据 。 在 document 中执行静态查询的前期成本上比起 `DynamicNodeList` 要显著提高很多倍。

如果真正的查看WebKit的源码,你会发现他为 `querySelectorAll()` 明确地 [创建一个返回对象](http://trac.webkit.org/browser/trunk/WebCore/dom/SelectorNodeList.cpp?rev=41093#L61) ,在其中又使用一个循环来获取每一个结果,并创建最终返回的一个 `NodeList`.

## 结论 ##

`getElementsByTagName()` 速度比 `querySelectorAll()` 快的根本原因在于**动态NodeList**和**静态NodeList**对象的不同。 尽管我可以肯定地说有某种方法来优化这一点, 在获取`NodeList`时不需要执行很多前期处理操作的动态列表,总比获取静态的集合(返回之前完成各种处理)要快很多。 哪个方法更好用主要还是看你的需求, 如果只是要根据 tag name 来查找元素, 也不需要获取此一个快照, 那就应该使用 `getElementsByTagName()`方法; 如果需要快照结果(静态),或者需要使用复杂的CSS查询, 则可以考虑 `querySelectorAll()`。







原文链接: [Why is getElementsByTagName() faster than querySelectorAll()?](http://www.nczonline.net/blog/2010/09/28/why-is-getelementsbytagname-faster-that-queryselectorall/)

原文日期: 2010-09-28

翻译日期: 2014-11-13


标签: [getElementsByTagName](http://www.nczonline.net/blog/tag/getelementsbytagname/), [JavaScript](http://www.nczonline.net/blog/tag/javascript/), [NodeList](http://www.nczonline.net/blog/tag/nodelist/), [querySelectorAll](http://www.nczonline.net/blog/tag/queryselectorall/)