# Chapter 11: Joran

# 第11章: Joran

*The answer, my friend, is blowin' in the wind, The answer is blowin' in the wind.*

*答案在风中飘荡，我的朋友，答案在风中飘荡。*

—BOB DYLAN, *The Freewheelin' Bob Dylan*

——鲍勃·迪伦，《自由驰骋的鲍勃·迪伦》

This chapter is outdated and needs to be re-written to account for the massive changes occuring in 1.3

本章内容已过时，需要重写，以反映 1.3 版本中的重大变化。

Joran stands for a cold north-west wind which, every now and then, blows forcefully on Lake Geneva. Located right in the middle of Western-Europe, the surface of Lake Geneva is smaller than many other European lakes. However, with its average depth of 153 meters, it is unusually deep, and happens to be, by volume, the largest sweet water reserve in Western-Europe.

Joran 指的是一阵寒冷的西北风，它时不时会猛烈地吹过日内瓦湖。日内瓦湖正好位于西欧的中部，湖面面积比欧洲其他许多湖都要小。不过，153 米的平均水深使它出奇地深，按蓄水量计算，它恰好是西欧最大的淡水资源。

As apparent in previous chapters, logback relies on Joran, a mature, flexible and powerful configuration framework. Many of the capabilities offered by logback modules are only possible on account of Joran. This chapter focuses on Joran, its basic design and its salient features.

从前面几章可以明显看出，logback 依赖 Joran——一个成熟、灵活且强大的配置框架。logback 各模块所提供的许多能力，都只有依靠 Joran 才可能实现。本章聚焦于 Joran，介绍它的基本设计与主要特性。

Joran is actually a generic configuration system which can be used independently of logging. To emphasize this point, we should mention that the logback-core module does not have a notion of loggers. In that spirit, most of the examples in this chapter have nothing to do with loggers, appenders or layouts.

实际上，Joran 是一个通用的配置系统，可以脱离日志独立使用。为强调这一点，需要指出：logback-core 模块中并没有 logger 的概念。本着这种精神，本章的大多数示例都与 logger、appender 或 layout 毫无关系。

The examples presented in this chapter can be found under *LOGBACK_HOME/logback-examples/src/main/java/chapters/onJoran/* folder.

本章的示例可以在 *LOGBACK_HOME/logback-examples/src/main/java/chapters/onJoran/* 目录下找到。

To install Joran, simply [download](http://logback.qos.ch/download.html) logback and add *logback-core-1.3.0-alpha5.jar* to your classpath.

要安装 Joran，只需[下载](http://logback.qos.ch/download.html) logback，并把 *logback-core-1.3.0-alpha5.jar* 加入 classpath。

## Historical perspective

## 历史回顾

Reflection is a powerful feature of the Java language, making it possible to configure software systems declaratively. For example, many important properties of an EJB are configured with the *ejb.xml* file. While EJBs are written in Java, many of their properties are specified within the *ejb.xml* file. Similarly, logback settings can be specified in a configuration file, expressed in XML format. Annotations available in JDK 1.5 and heavily used in EJB 3.0 replace many directives previously found in XML files. Joran also makes use of annotations but at a much smaller extent. Due to the dynamic nature of logback configuration data (compared to EJBs) Joran's use of annotations is rather limited.

反射(reflection)是 Java 语言的一个强大特性，使得以声明式方式配置软件系统成为可能。例如，EJB 的许多重要属性都是通过 *ejb.xml* 文件来配置的。EJB 虽然用 Java 编写，但它的许多属性都规定在 *ejb.xml* 文件中。类似地，logback 的设置可以在 XML 格式的配置文件中指定。JDK 1.5 提供并在 EJB 3.0 中大量使用的注解，取代了以前 XML 文件中的许多指令。Joran 也使用了注解，但程度要小得多。与 EJB 相比，logback 的配置数据更具动态性，因此 Joran 对注解的使用相当有限。

In log4j, logback's predecessor, the `DOMConfigurator` class, which is part of log4j version 1.2.x and later, could also parse configuration files written in XML. `DOMConfigurator` was written in a way that forced us, the developers, to tweak the code each time the structure of the configuration file changed. The modified code had to be recompiled and redeployed. Just as importantly, the code of the `DOMConfigurator` consisted of loops dealing with child elements containing many interspersed if/else statements. One could not help but notice that this particular code reeked of redundancy and duplication. The [commons-digester project](http://jakarta.apache.org/commons/digester/) had shown us that it was possible to parse XML files using pattern matching rules. At parse time, digester would apply rules that matched designated patterns. Rule classes were usually quite small and specialized. Consequently, they were relatively easy to understand and maintain.

在 logback 的前身 log4j 中，log4j 1.2.x 及之后版本所包含的 `DOMConfigurator` 类也可以解析以 XML 编写的配置文件。`DOMConfigurator` 的写法迫使我们开发者，每当配置文件的结构发生变化时都得修改代码，而修改后的代码还必须重新编译、重新部署。同样重要的是，`DOMConfigurator` 的代码由处理子元素的循环构成，其中穿插着大量 if/else 语句，让人不禁注意到这段代码充斥着冗余和重复。[commons-digester 项目](http://jakarta.apache.org/commons/digester/)向我们展示了：可以用模式匹配规则来解析 XML 文件。解析时，digester 会应用与指定模式相匹配的规则。规则类通常都很小、很专一，因此相对易于理解和维护。

Armed with the `DOMConfigurator` experience, we began developing `Joran`, a powerful configuration framework to be used in logback. Joran was largely inspired by the commons-digester project. Nevertheless, it uses a slightly different terminology. In commons-digester, a rule can be seen as consisting of a pattern and a rule, as shown by the `Digester.addRule(String pattern, Rule rule)` method. We find it unnecessarily confusing to have a rule to consist of itself, not recursively but with a different meaning. In Joran, a rule consists of a pattern and an action. An action is invoked when a match occurs for the corresponding pattern. This relation between patterns and actions lies at the core of Joran. Quite remarkably, one can deal with quite complex requirements by using simple patterns, or more precisely with exact matches and wildcard matches.

有了 `DOMConfigurator` 的经验，我们开始开发 `Joran`——一个供 logback 使用的强大配置框架。Joran 在很大程度上借鉴了 commons-digester 项目，不过使用了略有不同的术语。在 commons-digester 中，一条规则可以看作由一个模式(pattern)和一条规则(rule)组成，`Digester.addRule(String pattern, Rule rule)` 方法就体现了这一点。让一条规则由它自身组成——当然不是递归，而是含义不同的另一个词——我们认为这种命名造成了不必要的混淆。在 Joran 中，一条规则由一个模式和一个动作(action)组成。当相应的模式匹配成功时，对应的动作就会被调用。模式与动作之间的这种关系是 Joran 的核心。非常了不起的是，只需使用简单的模式——更准确地说，精确匹配与通配符匹配——就能应对相当复杂的需求。

### SAX or DOM?

### SAX 还是 DOM？

Due to the event-based architecture of the SAX API, a tool based on SAX cannot easily deal with forward references, that is, references to elements which are defined later than the current element being processed. Elements with cyclical references are equally problematic. More generally, the DOM API allows the user to perform searches on all the elements and make forward jumps.

由于 SAX API 采用基于事件的架构，基于 SAX 的工具难以处理前向引用(forward reference)，也就是对在当前正在处理的元素之后才定义的元素的引用。带有循环引用的元素同样棘手。更一般地说，DOM API 允许用户在所有元素上执行搜索、进行前向跳转。

This extra flexibility initially led us to choose the DOM API as the underlying parsing API for Joran. After some experimentation, it quickly became clear that dealing with jumps to distant elements while parsing the DOM tree did not make sense when the interpretation rules were expressed in the form of patterns and actions. *Joran only needs to be given the elements in the XML document in a sequential, depth-first order.*

正是这种额外的灵活性，让我们最初选择 DOM API 作为 Joran 的底层解析 API。但经过一些实验，我们很快意识到：当解释规则以模式和动作的形式表达时，在解析 DOM 树的过程中跳转到远处元素并没有意义。*Joran 只需要按顺序、按深度优先的次序依次获得 XML 文档中的各个元素。*

Moreover, the SAX API offers element location information which allows Joran to display the exact line and column number where an error occurred. Location information comes in very handy in the identification of parsing problems.

此外，SAX API 还提供元素的位置信息，让 Joran 能够显示出错误发生的确切行列号。位置信息对定位解析问题非常有用。

### Non goals

### 非目标

Given its highly dynamic nature, the Joran API is not intended to be used to parse very large XML documents with many thousands of elements.

鉴于其高度动态的特性，Joran API 并不打算用于解析包含成千上万个元素的超大 XML 文档。

### Pattern

### 模式(Pattern)

A Joran pattern is essentially a string. There are two kind of patterns, *exact* and *wildcard*. The pattern "a/b" can be used to match a `` element nested within a top-level `` element. The "a/b" pattern will not match any other element, hence the *exact* match designation.

Joran 的模式本质上就是一个字符串。模式分两类：*精确*(exact)和*通配符*(wildcard)。模式 "a/b" 可以用来匹配嵌套在某个顶层元素内部的子元素；"a/b" 模式不会匹配任何其他元素，因此称为*精确*匹配。

Wildcards can be used to match suffixes or prefixes. For example, the "*/a" pattern can be used to match any suffix ending with "a", that is any `` element within an XML document but not any elements nested within ``. The "a/*" pattern will match any element prefixed by ``, that is any element nested within an `` element.

通配符可以用来匹配后缀或前缀。例如，"*/a" 模式可以匹配任何以 "a" 结尾的后缀，即 XML 文档中任何以 "a" 命名的元素，但不包括嵌套在其内部的元素。"a/*" 模式会匹配任何以 "a" 为前缀的元素，即嵌套在 "a" 元素内部的任何元素。

### Actions

### 动作(Actions)

As mentioned above, Joran parsing rules consists of the association of patterns. Actions extend the [`Action`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/Action.html) class, consisting of the following abstract methods. Other methods have been omitted for brevity.

如上所述，Joran 的解析规则由模式与动作的关联构成。动作继承自 [`Action`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/Action.html) 类，该类包含以下几个抽象方法（为简洁起见，其他方法已省略）：

```
package ch.qos.logback.core.joran.action;

import org.xml.sax.Attributes;
import org.xml.sax.Locator;
import ch.qos.logback.core.joran.spi.InterpretationContext;

public abstract class Action extends ContextAwareBase {
  /**
   * Called when the parser encounters an element matching a
   * {@link ch.qos.logback.core.joran.spi.Pattern Pattern}.
   */
  public abstract void begin(InterpretationContext ic, String name,
      Attributes attributes) throws ActionException;

  /**
   * Called to pass the body (as text) contained within an element.
   */
  public void body(InterpretationContext ic, String body)
      throws ActionException {
    // NOP
  }

  /*
   * Called when the parser encounters an endElement event matching a
   * {@link ch.qos.logback.core.joran.spi.Pattern Pattern}.
   */
  public abstract void end(InterpretationContext ic, String name)
      throws ActionException;
}
```

Thus, every action must implement the `begin()` and `end()` methods. The implementation of the `body()` method is optional on account of the empty/nop implementation provided by `Action`.

因此，每个动作都必须实现 `begin()` 和 `end()` 方法。由于 `Action` 提供了空/nop 实现，`body()` 方法的实现是可选的。

### RuleStore

### RuleStore（规则仓库）

As mentioned previously, the invocation of actions according to matching patterns is a central concept in Joran. A rule is an association of a pattern and an action. Rules are stored in a [RuleStore](http://logback.qos.ch/xref/ch/qos/logback/core/joran/spi/RuleStore.html).

如前所述，按照匹配的模式调用相应的动作是 Joran 的核心概念。一条规则就是一个模式与一个动作的关联。规则存储在 [RuleStore](http://logback.qos.ch/xref/ch/qos/logback/core/joran/spi/RuleStore.html) 中。

As mentioned above, Joran is built on top of the SAX API. As an XML document is parsed, each element generates events corresponding to the start, body and end of each element. When a Joran configurator receives these events, it will attempt to find in its rule store an action corresponding to the *current pattern*. For example, the current pattern for the start, body or end event of element *B* nested within a top-level *A* element is "A/B". The current pattern is a data structure maintained automatically by Joran as it receives and processes SAX events.

如上所述，Joran 构建在 SAX API 之上。XML 文档被解析时，每个元素都会产生对应于该元素开始、正文和结束的事件。Joran 配置器收到这些事件后，会在规则仓库中查找与*当前模式*(current pattern)对应的动作。例如，对于嵌套在顶层元素 *A* 内的元素 *B*，其开始、正文或结束事件的当前模式就是 "A/B"。当前模式是 Joran 在接收和处理 SAX 事件的过程中自动维护的一个数据结构。

When several rules match the current pattern, then exact matches override suffix matches, and suffix matches override prefix matches. For exact details of the implementation, please see the [SimpleRuleStore](http://logback.qos.ch/xref/ch/qos/logback/core/joran/spi/SimpleRuleStore.html) class.

当有多条规则与当前模式匹配时，精确匹配优先于后缀匹配，后缀匹配优先于前缀匹配。实现的细节请参见 [SimpleRuleStore](http://logback.qos.ch/xref/ch/qos/logback/core/joran/spi/SimpleRuleStore.html) 类。

### Interpretation context

### 解释上下文(Interpretation context)

To allow various actions to collaborate, the invocation of begin and end methods include an interpretation context as the first parameter. The interpretation context includes an object stack, an object map, an error list and a reference to the Joran interpreter invoking the action. Please see the [`InterpretationContext`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/spi/InterpretationContext.html) class for the exact list of fields contained in the interpretation context.

为了让各个动作能够协作，begin 和 end 方法的调用都把解释上下文(interpretation context)作为第一个参数传入。解释上下文包含一个对象栈、一个对象映射、一个错误列表，以及一个指向调用该动作的 Joran 解释器的引用。解释上下文所含字段的完整清单请参见 [`InterpretationContext`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/spi/InterpretationContext.html) 类。

Actions can collaborate together by fetching, pushing or popping objects from the common object stack, or by putting and fetching keyed objects on the common object map. Actions can report any error conditions by adding error items on the interpretation context's `StatusManager`.

动作之间可以通过从公共对象栈中取出、压入或弹出对象来协作，也可以通过在公共对象映射中存取带键的对象来协作。动作可以通过向解释上下文的 `StatusManager` 添加错误条目来报告任何错误情况。

### Hello world

### Hello world

The first example in this chapter illustrates the minimal plumbing required for using Joran. The example consists of a trivial action called [`HelloWorldAction`](http://logback.qos.ch/xref/chapters/onJoran/helloWorld/HelloWorldAction.html) which prints "Hello World" on the console when its `begin()` method is invoked. The parsing of XML files is done by a configurator. For the purposes of this chapter, we have developed a very simple configurator called [`SimpleConfigurator`](http://logback.qos.ch/xref/chapters/onJoran/SimpleConfigurator.html). The [`HelloWorld`](http://logback.qos.ch/xref/chapters/onJoran/helloWorld/HelloWorld.html) application brings all these pieces together:

本章的第一个示例展示了使用 Joran 所需的最基本的组装工作。该示例包含一个极其简单的动作 [`HelloWorldAction`](http://logback.qos.ch/xref/chapters/onJoran/helloWorld/HelloWorldAction.html)，当它的 `begin()` 方法被调用时，会在控制台打印 "Hello World"。XML 文件的解析由配置器(configurator)完成。为本章的目的，我们开发了一个非常简单的配置器 [`SimpleConfigurator`](http://logback.qos.ch/xref/chapters/onJoran/SimpleConfigurator.html)。[`HelloWorld`](http://logback.qos.ch/xref/chapters/onJoran/helloWorld/HelloWorld.html) 应用把这些部件组合到一起：

- It creates a map of rules and a `Context`
- It creates a parsing rule by associating the *hello-world* pattern with a corresponding `HelloWorldAction` instance
- It creates a `SimpleConfigutator`, passing it the aforementioned rules map
- It then invokes the `doConfigure` method of the configurator, passing the designated XML file as parameter
- As a last step, the accumulated Status message in the context, if any, are printed

- 创建一个规则映射和一个 `Context`
- 通过把 *hello-world* 模式与相应的 `HelloWorldAction` 实例关联起来，创建一条解析规则
- 创建一个 `SimpleConfigutator`，并把上述规则映射传给它
- 然后调用配置器的 `doConfigure` 方法，把指定的 XML 文件作为参数传入
- 最后一步，打印上下文中累积的 Status 消息（如果有）

The *hello.xml* file contains one <hello-world> element, without any other nested elements. See the *logback-examples/src/main/java/chapters/onJoran/helloWorld/* folder for exact contents.

*hello.xml* 文件包含一个 <hello-world> 元素，没有其他嵌套元素。确切内容见 *logback-examples/src/main/java/chapters/onJoran/helloWorld/* 目录。

Running the HelloWorld application with *hello.xml* file will print "Hello World" on the console.

用 *hello.xml* 文件运行 HelloWorld 应用，会在控制台打印 "Hello World"。

java chapters.onJoran.helloWorld.HelloWorld src/main/java/chapters/onJoran/helloWorld/hello.xml

You are highly encouraged to poke about in this example, by adding new rules on the rule store, modifying the XML document (hello.xml) and adding new actions.

强烈建议你在这个示例里多折腾折腾：向规则仓库添加新规则、修改 XML 文档（hello.xml）、增加新动作，等等。

### Collaborating actions

### 协作的动作

The *logback-examples/src/main/java/joran/calculator/* directory includes several actions which collaborate together through the common object stack in order to accomplish simple computations.

*logback-examples/src/main/java/joran/calculator/* 目录包含几个动作，它们通过公共对象栈相互协作，完成简单的计算。

The *calculator1.xml* file contains a `computation` element, with a nested `literal` element. Here are its contents.

*calculator1.xml* 文件包含一个 `computation` 元素，其中嵌套了 `literal` 元素。内容如下。

*Example 10.: First calculator example (logback-examples/src/main/java/chapters/onJoran/calculator/calculator1.xml)*

In the [`Calculator1`](http://logback.qos.ch/xref/chapters/onJoran/calculator/Calculator1.html) application, we declare various parsing rules (patterns and actions) collaborating together to compute a result based on the contents of an XML document.

在 [`Calculator1`](http://logback.qos.ch/xref/chapters/onJoran/calculator/Calculator1.html) 应用中，我们声明了各种解析规则（模式和动作），它们相互协作，基于 XML 文档的内容计算出一个结果。

Running `Calculator1` application with *calculator1.xml*

用 *calculator1.xml* 运行 `Calculator1` 应用：

java chapters.onJoran.calculator.Calculator1 src/main/java/chapters/onJoran/calculator/calculator1.xml

will print:

将打印：

The computation named [total] resulted in the value 3

Parsing the *calculator1.xml* document (listed above) involves the following steps:

解析 *calculator1.xml* 文档（见上文）包括以下步骤：

- The start event corresponding to the <computation> element translates into the current pattern "/computation". Since in the [`Calculator1`](http://logback.qos.ch/xref/chapters/onJoran/calculator/Calculator1.html) application we associated the pattern "/computation" with a [`ComputationAction1`](http://logback.qos.ch/xref/chapters/onJoran/calculator/ComputationAction1.html) instance, the `begin()` method of that `ComputationAction1` instance is invoked.
- The start event corresponding to the <literal> element translates into the current pattern "/computation/literal". Given the association of the "/computation/literal" pattern with a [`LiteralAction`](http://logback.qos.ch/xref/chapters/onJoran/calculator/LiteralAction.html) instance, the `begin()` method of that `LiteralAction` instance is called.
- By the same token, the end event corresponding to the <literal> element triggers the invocation of the `end`() method of the same `LiteralAction` instance.
- Similarly, the event corresponding to the end of <computation> element triggers the invocation the `end()` method of the `ComputationAction1` same instance.

- 与 <computation> 元素对应的开始事件转化为当前模式 "/computation"。由于在 [`Calculator1`](http://logback.qos.ch/xref/chapters/onJoran/calculator/Calculator1.html) 应用中我们把模式 "/computation" 与 [`ComputationAction1`](http://logback.qos.ch/xref/chapters/onJoran/calculator/ComputationAction1.html) 实例关联了起来，该 `ComputationAction1` 实例的 `begin()` 方法会被调用。
- 与 <literal> 元素对应的开始事件转化为当前模式 "/computation/literal"。由于模式 "/computation/literal" 关联了 [`LiteralAction`](http://logback.qos.ch/xref/chapters/onJoran/calculator/LiteralAction.html) 实例，该 `LiteralAction` 实例的 `begin()` 方法会被调用。
- 同理，与 <literal> 元素对应的结束事件会触发同一个 `LiteralAction` 实例的 `end`() 方法调用。
- 类似地，与 </computation> 元素结束对应的事件会触发 `ComputationAction1` 同一实例的 `end()` 方法调用。

What is interesting here is the way actions collaborate. The `LiteralAction` reads a literal value and pushes it in the object stack maintained by the `InterpretationContext`. Once done, any other action can pop the value to read or modify it. Here, the `end()` method of the `ComputationAction1` class pops the value from the stack and prints it.

这里有意思的是动作之间的协作方式。`LiteralAction` 读取一个字面值，把它压入 `InterpretationContext` 维护的对象栈。之后，任何其他动作都可以弹出该值来读取或修改。这里，`ComputationAction1` 类的 `end()` 方法把值从栈中弹出并打印。

The next example, *calculator2.xml* file is a bit more complex, but also more interesting.

下一个示例 *calculator2.xml* 文件稍微复杂一些，但也更有意思。

*Example 10.: Calculator configuration file (logback-examples/src/main/java/chapters/onJoran/calculator/calculator2.xml)*

As in the previous example, in response to the <literal> element,the appropriate [`LiteralAction`](http://logback.qos.ch/xref/chapters/onJoran/calculator/LiteralAction.html) instance will push an integer, corresponding to the value attribute, at the top of the interpretation context's object stack. In this example, that is *calculator2.xml*, the values are 7 and 3. In response to the <add> element, the appropriate [`AddAction`](http://logback.qos.ch/xref/chapters/onJoran/calculator/AddAction.html) will pop two previously pushed integers, compute their sum and push the result, i.e. 10 (=7+3), at the top of the interpretation context's stack. The next literal element will cause LiteralAction to push an integer with value 3 at the top of the stack. In response to the <multiply> element, the appropriate [`MultiplyAction`](http://logback.qos.ch/xref/chapters/onJoran/calculator/MultiplyAction.html) will pop two previously pushed integers, i.e. 10 and 3, and compute their product. It will push the result, i.e. 30, at the top of the stack. At the very end, in reponse to the end event corresponding to the </computation> tag, the ComputationAction1 will print the object at the top of the stack. Thus, running:

与前一个示例一样，响应 <literal> 元素时，相应的 [`LiteralAction`](http://logback.qos.ch/xref/chapters/onJoran/calculator/LiteralAction.html) 实例会把与 value 属性对应的整数压入解释上下文对象栈的栈顶。在本例（即 *calculator2.xml*）中，这两个值是 7 和 3。响应 <add> 元素时，相应的 [`AddAction`](http://logback.qos.ch/xref/chapters/onJoran/calculator/AddAction.html) 会弹出先前压入的两个整数，计算它们的和，并把结果（即 10 (=7+3)）压入解释上下文栈的栈顶。下一个 literal 元素会让 LiteralAction 把值为 3 的整数压到栈顶。响应 <multiply> 元素时，相应的 [`MultiplyAction`](http://logback.qos.ch/xref/chapters/onJoran/calculator/MultiplyAction.html) 会弹出先前压入的两个整数，即 10 和 3，计算它们的乘积，并把结果（即 30）压入栈顶。最后，响应与 </computation> 标签对应的结束事件时，ComputationAction1 会打印栈顶的对象。因此，运行：

java chapters.onJoran.calculator.Calculator1 src/main/java/chapters/onJoran/calculator/calculator2.xml 

will yield

将得到

The computation named [toto] resulted in the value 30 

### Implicit actions

### 隐式动作(Implicit actions)

The rules defined thus far are called explicit actions because an pattern/action association could be found in the rule store for the current element. However, in highly extensible systems, the number and type of components can be so large so as to make it very tedious to associate an explicit action for all patterns.

到目前为止定义的规则都称为显式动作(explicit action)，因为在规则仓库中能找到与当前元素对应的模式/动作关联。然而，在高度可扩展的系统中，组件的数量和类型可能非常庞大，为所有模式都关联一个显式动作会变得极其繁琐。

At the same time, even in highly extensible systems one can observe recurrent rules linking various parts together. Assuming we could identify such rules, we could process components composed of sub-components unknown at compilation time (of logback). For example, Apache Ant is capable of handling tasks which contain tags unknown at compile time, simply by inspecting the component for methods whose names start with *add*, as in `addFile`, or `addClassPath`. When Ant encounters an embedded tag within a task, it simply instantiates an object that matches the signature of the task class' add method and attaches the resulting object to the parent.

同时，即使在高度可扩展的系统中，也能观察到把各部分联系在一起的重复性规律。假设我们能够识别出这类规律，就可以处理那些由子组件（在 logback 编译期未知）构成的组件。例如，Apache Ant 能够处理包含编译期未知标签的任务，做法很简单：检查组件中名字以 *add* 开头的方法，如 `addFile` 或 `addClassPath`。当 Ant 在任务中遇到内嵌标签时，它只需实例化一个与任务类的 add 方法签名匹配的对象，并把得到的对象挂到父对象上。

Joran supports a similar capability in the form of implicit actions. Joran keeps a list of implicit actions which are applied if no explicit pattern could match the current pattern. However, applying an implicit action may not be always appropriate. Before executing the implicit action, Joran asks a given implicit action whether it is appropriate in the current situation. Only if the action replies in the affirmative does the Joran configurator invoke the (implicit) action. Note that this extra step makes it possible to support multiple implicit actions or possibly none, if no implicit action is appropriate for a given situation.

Joran 以隐式动作(implicit action)的形式支持类似的能力。Joran 维护一个隐式动作列表，当没有显式模式能够匹配当前模式时就会应用它们。不过，应用隐式动作并不总是合适的。在执行隐式动作之前，Joran 会询问该隐式动作：它在当前情况下是否适用。只有当动作给出肯定答复时，Joran 配置器才会调用这个（隐式）动作。注意，这个额外的步骤使得支持多个隐式动作成为可能——或者，如果没有隐式动作适用于给定情况，也可能一个都不调用。

You can create and register a custom implicit action as illustrated in the next example contained within the *logback-examples/src/main/java/chapters/onJoran/implicit* folder.

你可以按照下一个示例演示的方式创建并注册自定义隐式动作，示例位于 *logback-examples/src/main/java/chapters/onJoran/implicit* 目录。

The [`PrintMe`](http://logback.qos.ch/xref/chapters/onJoran/implicit/PrintMe.html) application associates an [`NOPAction`](http://logback.qos.ch/xref/chapters/onJoran/implicit/NOPAction.html) instance with the pattern "*/foo", that is any element named as "foo". As its name indicates, the `begin`() and `end`() methods of `NOPAction` are empty. The `PrintMe` application also registers an instance of [PrintMeImplicitAction](http://logback.qos.ch/xref/chapters/onJoran/implicit/PrintMeImplicitAction.html) in its list of implicit actions. The `PrintMeImplicitAction` is applicable for any element which has a *printme* attribute set to true. See the `isApplicable()` method in `PrintMeImplicitAction`. The `begin()`() method of `PrintMeImplicitAction` prints the name of the current element on the console.

[`PrintMe`](http://logback.qos.ch/xref/chapters/onJoran/implicit/PrintMe.html) 应用把一个 [`NOPAction`](http://logback.qos.ch/xref/chapters/onJoran/implicit/NOPAction.html) 实例与模式 "*/foo"（即任何名为 "foo" 的元素）关联。顾名思义，`NOPAction` 的 `begin`() 和 `end`() 方法都是空的。`PrintMe` 应用还在其隐式动作列表中注册了一个 [PrintMeImplicitAction](http://logback.qos.ch/xref/chapters/onJoran/implicit/PrintMeImplicitAction.html) 实例。`PrintMeImplicitAction` 适用于任何 *printme* 属性为 true 的元素，参见 `PrintMeImplicitAction` 中的 `isApplicable()` 方法。`PrintMeImplicitAction` 的 `begin()`() 方法会把当前元素的名称打印到控制台。

The XML document *implicit1.xml* is designed to illustrate how implicit actions come into play.

XML 文档 *implicit1.xml* 就是用来说明隐式动作如何生效的。

*Example 10.: Usage of implicit rules (logback-examples/src/main/java/chapters/onJoran/implicit/implicit1.xml)*

Running

运行

java chapters.onJoran.implicit.PrintMe src/main/java/chapters/onJoran/implicit/implicit1.xml

yields:

得到：

Element [xyz] asked to be printed. Element [abc] asked to be printed. 20:33:43,750 |-ERROR in c.q.l.c.joran.spi.Interpreter@**10:9** - no applicable action for [xyz], current pattern is [[foo][xyz]]

Given that `NOPAction` instance is explicitly associated with the "*/foo" pattern, `NOPAction`'s `begin()` and `end()` methods are invoked on <foo> elements. `PrintMeImplicitAction` is never triggered for any of the <foo> elements. For other elements, since there are no matching explicit actions, the `isApplicable()` method of `PrintMeImplicitAction` is invoked. It will return true only for elements having a *printme* attribute set to true, namely the first <xyz> element (but not the second) and the <abc> element. The second <xyz> element on line 10, there are no applicable actions, an internal error message is generated. This message is printed by the `StatusPrinter.print` invocation, the last statement in the `PrintMe` application. This explains the output shown above (see previous paragraph).

由于 `NOPAction` 实例被显式关联到 "*/foo" 模式，<foo> 元素上调用的是 `NOPAction` 的 `begin()` 和 `end()` 方法。`PrintMeImplicitAction` 在任何 <foo> 元素上都不会被触发。对于其他元素，由于没有匹配的显式动作，`PrintMeImplicitAction` 的 `isApplicable()` 方法会被调用。只有 *printme* 属性为 true 的元素才会返回 true，即第一个 <xyz> 元素（第二个不是）和 <abc> 元素。对于第 10 行的第二个 <xyz> 元素，没有适用的动作，于是会生成一条内部错误消息。这条消息由 `PrintMe` 应用最后一条语句 `StatusPrinter.print` 的调用打印出来。这就解释了上面看到的输出（见前一段）。

### Implicit actions in practice

### 实战中的隐式动作

The respective Joran configurators of logback-classic and logback-access include just two implicit actions, namely [`NestedBasicPropertyIA`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/NestedBasicPropertyIA.html) and [`NestedComplexPropertyIA`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/NestedComplexPropertyIA.html).

logback-classic 和 logback-access 各自的 Joran 配置器都只包含两个隐式动作，即 [`NestedBasicPropertyIA`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/NestedBasicPropertyIA.html) 和 [`NestedComplexPropertyIA`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/NestedComplexPropertyIA.html)。

`NestedBasicPropertyIA` is applicable for any property whose type is a primitive type (or equivalent object type in the `java.lang` package), an enumeration type, or any type adhering to the "valueOf" convention. Such properties are said to be *basic* or *simple*. A class is said to adhere to the "valueOf" convention if it contains a static method named `valueOf`() taking a `java.lang.String` as parameter and returning an instance of the type in question. At present, the [`Level`](http://logback.qos.ch/xref/ch/qos/logback/classic/Level.html), [`Duration`](http://logback.qos.ch/xref/ch/qos/logback/core/util/Duration.html) and [`FileSize`](http://logback.qos.ch/xref/ch/qos/logback/core/util/FileSize.html) classes follow this convention.

`NestedBasicPropertyIA` 适用于任何类型为基本类型（或 `java.lang` 包中的等价对象类型）、枚举类型，或遵循 "valueOf" 约定的属性。这类属性被称为*基本*(basic)或*简单*(simple)属性。如果一个类包含名为 `valueOf`() 的静态方法——接受一个 `java.lang.String` 参数并返回该类型的一个实例——就说它遵循 "valueOf" 约定。目前，[`Level`](http://logback.qos.ch/xref/ch/qos/logback/classic/Level.html)、[`Duration`](http://logback.qos.ch/xref/ch/qos/logback/core/util/Duration.html) 和 [`FileSize`](http://logback.qos.ch/xref/ch/qos/logback/core/util/FileSize.html) 类都遵循这一约定。

`NestedComplexPropertyIA` action is applicable, in the remaining cases where `NestedBasicPropertyIA` is not applicable *and* if the object at the top of the object stack has a setter or adder method for a property name equal to the current element name. Note that such properties can in turn contain other components. Thus, such properties are said to be *complex*. In presence of a complex property, [`NestedComplexPropertyIA`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/NestedComplexPropertyIA.html) will instantiate the appropriate class for the nested component and attach it to the parent component (at the top of the object stack) by using the setter/adder method of the parent component and the nested element's name. The corresponding class is specified by the *class* attribute of the (nested) current element. However, if the *class* attribute is missing, the class name can be deduced implicitly, if any of the following is true:

`NestedComplexPropertyIA` 动作适用于其余 `NestedBasicPropertyIA` 不适用*并且*对象栈顶的对象拥有与当前元素同名的 setter 或 adder 方法的情形。注意，这类属性又可以包含其他组件，因此被称为*复杂*(complex)属性。对于复杂属性，[`NestedComplexPropertyIA`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/NestedComplexPropertyIA.html) 会为嵌套组件实例化相应的类，并使用父组件（对象栈顶）的 setter/adder 方法和嵌套元素的名称，把它挂到父组件上。对应的类由（嵌套的）当前元素的 *class* 属性指定。不过，如果缺少 *class* 属性，在满足以下条件之一时，类名也可以被隐式推断出来：

1. there is an internal rule associating the parent object's property with a designated class
2. the setter method contains a @DefaultClass attribute designating a given class
3. the parameter type of the setter method is a concrete class possessing a public constructor

1. 存在内部规则，把父对象的属性与指定的类关联起来
2. setter 方法带有 @DefaultClass 注解，指定了某个类
3. setter 方法的参数类型是拥有公共构造方法的具体类

#### Default class mapping

#### 默认类映射

In logback-classic, there are a handful of internal rules mapping parent class/property name pairs to a default class. These are listed in the table below.

在 logback-classic 中，有少量内部规则把父类/属性名对映射到默认类，如下表所示。

This list may change in future releases. Please see logback-classic [JoranConfigurator](http://logback.qos.ch/xref/ch/qos/logback/classic/joran/JoranConfigurator.html)'s `addDefaultNestedComponentRegistryRules` method for the latest rules.

这份清单在未来的版本中可能变化。最新的规则请参见 logback-classic [JoranConfigurator](http://logback.qos.ch/xref/ch/qos/logback/classic/joran/JoranConfigurator.html) 的 `addDefaultNestedComponentRegistryRules` 方法。

In logback-access, the rules are very similar. In the default class for the nested component, the ch.qos.logback.classic package is replaced by ch.qos.logback.access. See logback-access [JoranConfigurator](http://logback.qos.ch/xref/ch/qos/logback/access/joran/JoranConfigurator.html)'s `addDefaultNestedComponentRegistryRules` method for the latest rules.

在 logback-access 中，规则非常相似，只是把嵌套组件默认类中的 ch.qos.logback.classic 包换成 ch.qos.logback.access。最新的规则请参见 logback-access [JoranConfigurator](http://logback.qos.ch/xref/ch/qos/logback/access/joran/JoranConfigurator.html) 的 `addDefaultNestedComponentRegistryRules` 方法。

#### Collection of properties

#### 属性集合

Note that in addition to single simple properties or single complex properties, logback's implicit actions support collections of properties, be they simple or complex. Instead of a setter method, the property is specified by an "adder" method.

注意，除了单个简单属性或单个复杂属性之外，logback 的隐式动作还支持属性集合，无论简单还是复杂。此时不再使用 setter 方法，而是通过 "adder" 方法来指定属性。

### New rules on the fly

### 动态添加新规则

Joran includes an action which allows the Joran interpreter to learn new rules on the fly, that is while interpreting an XML document. See the *logback-examples/src/main/java/chapters/onJoran/newRule/* directory for sample code. In this package, the [`NewRuleCalculator`](http://logback.qos.ch/xref/chapters/onJoran/newRule/NewRuleCalculator.html) application sets up just two rules, one rule to process the top-most element, and a second rule to learn new rules. Here is the relevant code from `NewRuleCalculator`.

Joran 包含一个动作，允许 Joran 解释器在解释 XML 文档的过程中即时学习新规则。示例代码见 *logback-examples/src/main/java/chapters/onJoran/newRule/* 目录。在这个包中，[`NewRuleCalculator`](http://logback.qos.ch/xref/chapters/onJoran/newRule/NewRuleCalculator.html) 应用只设置了两个规则：一个用于处理最顶层元素，另一个用于学习新规则。下面是 `NewRuleCalculator` 的相关代码：

```
ruleMap.put(new Pattern("*/computation"), new ComputationAction1());
ruleStore.addRule(new Pattern("/computation/newRule"), new NewRuleAction());
```

[`NewRuleAction`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/NewRuleAction.html), part of logback-core, works pretty much like the other actions. It has a `begin()` and `end()` method, and is called each time the parser finds a *newRule* element. When invoked, the `begin()` method looks for *pattern* and *actionClass* attributes. It then instantiates the corresponding action class and adds the pattern/action association as a new rule in Joran's rule store.

[`NewRuleAction`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/NewRuleAction.html) 属于 logback-core，工作方式与其他动作差不多。它有 `begin()` 和 `end()` 方法，每次解析器发现 *newRule* 元素时都会被调用。被调用时，`begin()` 方法会查找 *pattern* 和 *actionClass* 属性，然后实例化相应的动作类，并把模式/动作关联作为新规则加入 Joran 的规则仓库。

Here is how new rules can be declared in an xml file:

下面展示了在 xml 文件中声明新规则的方式：

```
<newRule pattern="*/computation/literal"
          actionClass="chapters.onJoran.calculator.LiteralAction"/>
```

Using such newRule declarations, we can transform `NewRuleCalculator` to behave like the `Calculator1` application we saw earlier. involving the calculation, could be expressed this way:

借助这样的 newRule 声明，我们可以让 `NewRuleCalculator` 表现得和前面见过的 `Calculator1` 应用一样。其中的计算可以这样表达：

*Example 10..: Configuration file using new rules on the fly (logback-examples/src/main/java/chapters/onJoran/newrule/newRule.xml)*

java java chapters.onJoran.newRule.NewRuleCalculator src/main/java/chapters/onJoran/newRule/newRule.xml

yields

得到

The computation named [toto] resulted in the value 30

which is identical to the output of the [original calculator example](http://logback.qos.ch/manual/onJoran.html#calculator).

这与[最初的计算器示例](http://logback.qos.ch/manual/onJoran.html#calculator)的输出完全相同。



<http://logback.qos.ch/manual/onJoran.html>
