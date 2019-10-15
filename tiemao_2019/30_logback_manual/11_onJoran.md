# Chapter 11: Joran

*The answer, my friend, is blowin' in the wind, The answer is blowin' in the wind.*

—BOB DYLAN, *The Freewheelin' Bob Dylan*

This chapter is outdated and needs to be re-written to account for the massive changes occuring in 1.3

Joran stands for a cold north-west wind which, every now and then, blows forcefully on Lake Geneva. Located right in the middle of Western-Europe, the surface of Lake Geneva is smaller than many other European lakes. However, with its average depth of 153 meters, it is unusually deep, and happens to be, by volume, the largest sweet water reserve in Western-Europe.

As apparent in previous chapters, logback relies on Joran, a mature, flexible and powerful configuration framework. Many of the capabilities offered by logback modules are only possible on account of Joran. This chapter focuses on Joran, its basic design and its salient features.

Joran is actually a generic configuration system which can be used independently of logging. To emphasize this point, we should mention that the logback-core module does not have a notion of loggers. In that spirit, most of the examples in this chapter have nothing to do with loggers, appenders or layouts.

The examples presented in this chapter can be found under *LOGBACK_HOME/logback-examples/src/main/java/chapters/onJoran/* folder.

To install Joran, simply [download](http://logback.qos.ch/download.html) logback and add *logback-core-1.3.0-alpha5.jar* to your classpath.

## Historical perspective

Reflection is a powerful feature of the Java language, making it possible to configure software systems declaratively. For example, many important properties of an EJB are configured with the *ejb.xml* file. While EJBs are written in Java, many of their properties are specified within the *ejb.xml* file. Similarly, logback settings can be specified in a configuration file, expressed in XML format. Annotations available in JDK 1.5 and heavily used in EJB 3.0 replace many directives previously found in XML files. Joran also makes use of annotations but at a much smaller extent. Due to the dynamic nature of logback configuration data (compared to EJBs) Joran's use of annotations is rather limited.

In log4j, logback's predecessor, the `DOMConfigurator` class, which is part of log4j version 1.2.x and later, could also parse configuration files written in XML. `DOMConfigurator` was written in a way that forced us, the developers, to tweak the code each time the structure of the configuration file changed. The modified code had to be recompiled and redeployed. Just as importantly, the code of the `DOMConfigurator` consisted of loops dealing with child elements containing many interspersed if/else statements. One could not help but notice that this particular code reeked of redundancy and duplication. The [commons-digester project](http://jakarta.apache.org/commons/digester/) had shown us that it was possible to parse XML files using pattern matching rules. At parse time, digester would apply rules that matched designated patterns. Rule classes were usually quite small and specialized. Consequently, they were relatively easy to understand and maintain.

Armed with the `DOMConfigurator` experience, we began developing `Joran`, a powerful configuration framework to be used in logback. Joran was largely inspired by the commons-digester project. Nevertheless, it uses a slightly different terminology. In commons-digester, a rule can be seen as consisting of a pattern and a rule, as shown by the `Digester.addRule(String pattern, Rule rule)` method. We find it unnecessarily confusing to have a rule to consist of itself, not recursively but with a different meaning. In Joran, a rule consists of a pattern and an action. An action is invoked when a match occurs for the corresponding pattern. This relation between patterns and actions lies at the core of Joran. Quite remarkably, one can deal with quite complex requirements by using simple patterns, or more precisely with exact matches and wildcard matches.

### SAX or DOM?

Due to the event-based architecture of the SAX API, a tool based on SAX cannot easily deal with forward references, that is, references to elements which are defined later than the current element being processed. Elements with cyclical references are equally problematic. More generally, the DOM API allows the user to perform searches on all the elements and make forward jumps.

This extra flexibility initially led us to choose the DOM API as the underlying parsing API for Joran. After some experimentation, it quickly became clear that dealing with jumps to distant elements while parsing the DOM tree did not make sense when the interpretation rules were expressed in the form of patterns and actions. *Joran only needs to be given the elements in the XML document in a sequential, depth-first order.*

Moreover, the SAX API offers element location information which allows Joran to display the exact line and column number where an error occurred. Location information comes in very handy in the identification of parsing problems.

### Non goals

Given its highly dynamic nature, the Joran API is not intended to be used to parse very large XML documents with many thousands of elements.

### Pattern

A Joran pattern is essentially a string. There are two kind of patterns, *exact* and *wildcard*. The pattern "a/b" can be used to match a `` element nested within a top-level `` element. The "a/b" pattern will not match any other element, hence the *exact* match designation.

Wildcards can be used to match suffixes or prefixes. For example, the "*/a" pattern can be used to match any suffix ending with "a", that is any `` element within an XML document but not any elements nested within ``. The "a/*" pattern will match any element prefixed by ``, that is any element nested within an `` element.

### Actions

As mentioned above, Joran parsing rules consists of the association of patterns. Actions extend the [`Action`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/Action.html) class, consisting of the following abstract methods. Other methods have been omitted for brevity.

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

### RuleStore

As mentioned previously, the invocation of actions according to matching patterns is a central concept in Joran. A rule is an association of a pattern and an action. Rules are stored in a [RuleStore](http://logback.qos.ch/xref/ch/qos/logback/core/joran/spi/RuleStore.html).

As mentioned above, Joran is built on top of the SAX API. As an XML document is parsed, each element generates events corresponding to the start, body and end of each element. When a Joran configurator receives these events, it will attempt to find in its rule store an action corresponding to the *current pattern*. For example, the current pattern for the start, body or end event of element *B* nested within a top-level *A* element is "A/B". The current pattern is a data structure maintained automatically by Joran as it receives and processes SAX events.

When several rules match the current pattern, then exact matches override suffix matches, and suffix matches override prefix matches. For exact details of the implementation, please see the [SimpleRuleStore](http://logback.qos.ch/xref/ch/qos/logback/core/joran/spi/SimpleRuleStore.html) class.

### Interpretation context

To allow various actions to collaborate, the invocation of begin and end methods include an interpretation context as the first parameter. The interpretation context includes an object stack, an object map, an error list and a reference to the Joran interpreter invoking the action. Please see the [`InterpretationContext`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/spi/InterpretationContext.html) class for the exact list of fields contained in the interpretation context.

Actions can collaborate together by fetching, pushing or popping objects from the common object stack, or by putting and fetching keyed objects on the common object map. Actions can report any error conditions by adding error items on the interpretation context's `StatusManager`.

### Hello world

The first example in this chapter illustrates the minimal plumbing required for using Joran. The example consists of a trivial action called [`HelloWorldAction`](http://logback.qos.ch/xref/chapters/onJoran/helloWorld/HelloWorldAction.html) which prints "Hello World" on the console when its `begin()` method is invoked. The parsing of XML files is done by a configurator. For the purposes of this chapter, we have developed a very simple configurator called [`SimpleConfigurator`](http://logback.qos.ch/xref/chapters/onJoran/SimpleConfigurator.html). The [`HelloWorld`](http://logback.qos.ch/xref/chapters/onJoran/helloWorld/HelloWorld.html) application brings all these pieces together:

- It creates a map of rules and a `Context`
- It creates a parsing rule by associating the *hello-world* pattern with a corresponding `HelloWorldAction` instance
- It creates a `SimpleConfigutator`, passing it the aforementioned rules map
- It then invokes the `doConfigure` method of the configurator, passing the designated XML file as parameter
- As a last step, the accumulated Status message in the context, if any, are printed

The *hello.xml* file contains one <hello-world> element, without any other nested elements. See the *logback-examples/src/main/java/chapters/onJoran/helloWorld/* folder for exact contents.

Running the HelloWorld application with *hello.xml* file will print "Hello World" on the console.

java chapters.onJoran.helloWorld.HelloWorld src/main/java/chapters/onJoran/helloWorld/hello.xml

You are highly encouraged to poke about in this example, by adding new rules on the rule store, modifying the XML document (hello.xml) and adding new actions.

### Collaborating actions

The *logback-examples/src/main/java/joran/calculator/* directory includes several actions which collaborate together through the common object stack in order to accomplish simple computations.

The *calculator1.xml* file contains a `computation` element, with a nested `literal` element. Here are its contents.

*Example 10.: First calculator example (logback-examples/src/main/java/chapters/onJoran/calculator/calculator1.xml)*

In the [`Calculator1`](http://logback.qos.ch/xref/chapters/onJoran/calculator/Calculator1.html) application, we declare various parsing rules (patterns and actions) collaborating together to compute a result based on the contents of an XML document.

Running `Calculator1` application with *calculator1.xml*

java chapters.onJoran.calculator.Calculator1 src/main/java/chapters/onJoran/calculator/calculator1.xml

will print:

The computation named [total] resulted in the value 3

Parsing the *calculator1.xml* document (listed above) involves the following steps:

- The start event corresponding to the <computation> element translates into the current pattern "/computation". Since in the [`Calculator1`](http://logback.qos.ch/xref/chapters/onJoran/calculator/Calculator1.html) application we associated the pattern "/computation" with a [`ComputationAction1`](http://logback.qos.ch/xref/chapters/onJoran/calculator/ComputationAction1.html) instance, the `begin()` method of that `ComputationAction1` instance is invoked.
- The start event corresponding to the <literal> element translates into the current pattern "/computation/literal". Given the association of the "/computation/literal" pattern with a [`LiteralAction`](http://logback.qos.ch/xref/chapters/onJoran/calculator/LiteralAction.html) instance, the `begin()` method of that `LiteralAction` instance is called.
- By the same token, the end event corresponding to the <literal> element triggers the invocation of the `end`() method of the same `LiteralAction` instance.
- Similarly, the event corresponding to the end of <computation> element triggers the invocation the `end()` method of the `ComputationAction1` same instance.

What is interesting here is the way actions collaborate. The `LiteralAction` reads a literal value and pushes it in the object stack maintained by the `InterpretationContext`. Once done, any other action can pop the value to read or modify it. Here, the `end()` method of the `ComputationAction1` class pops the value from the stack and prints it.

The next example, *calculator2.xml* file is a bit more complex, but also more interesting.

*Example 10.: Calculator configuration file (logback-examples/src/main/java/chapters/onJoran/calculator/calculator2.xml)*

As in the previous example, in response to the <literal> element,the appropriate [`LiteralAction`](http://logback.qos.ch/xref/chapters/onJoran/calculator/LiteralAction.html) instance will push an integer, corresponding to the value attribute, at the top of the interpretation context's object stack. In this example, that is *calculator2.xml*, the values are 7 and 3. In response to the <add> element, the appropriate [`AddAction`](http://logback.qos.ch/xref/chapters/onJoran/calculator/AddAction.html) will pop two previously pushed integers, compute their sum and push the result, i.e. 10 (=7+3), at the top of the interpretation context's stack. The next literal element will cause LiteralAction to push an integer with value 3 at the top of the stack. In response to the <multiply> element, the appropriate [`MultiplyAction`](http://logback.qos.ch/xref/chapters/onJoran/calculator/MultiplyAction.html) will pop two previously pushed integers, i.e. 10 and 3, and compute their product. It will push the result, i.e. 30, at the top of the stack. At the very end, in reponse to the end event corresponding to the </computation> tag, the ComputationAction1 will print the object at the top of the stack. Thus, running:

java chapters.onJoran.calculator.Calculator1 src/main/java/chapters/onJoran/calculator/calculator2.xml 

will yield

The computation named [toto] resulted in the value 30 

### Implicit actions

The rules defined thus far are called explicit actions because an pattern/action association could be found in the rule store for the current element. However, in highly extensible systems, the number and type of components can be so large so as to make it very tedious to associate an explicit action for all patterns.

At the same time, even in highly extensible systems one can observe recurrent rules linking various parts together. Assuming we could identify such rules, we could process components composed of sub-components unknown at compilation time (of logback). For example, Apache Ant is capable of handling tasks which contain tags unknown at compile time, simply by inspecting the component for methods whose names start with *add*, as in `addFile`, or `addClassPath`. When Ant encounters an embedded tag within a task, it simply instantiates an object that matches the signature of the task class' add method and attaches the resulting object to the parent.

Joran supports a similar capability in the form of implicit actions. Joran keeps a list of implicit actions which are applied if no explicit pattern could match the current pattern. However, applying an implicit action may not be always appropriate. Before executing the implicit action, Joran asks a given implicit action whether it is appropriate in the current situation. Only if the action replies in the affirmative does the Joran configurator invoke the (implicit) action. Note that this extra step makes it possible to support multiple implicit actions or possibly none, if no implicit action is appropriate for a given situation.

You can create and register a custom implicit action as illustrated in the next example contained within the *logback-examples/src/main/java/chapters/onJoran/implicit* folder.

The [`PrintMe`](http://logback.qos.ch/xref/chapters/onJoran/implicit/PrintMe.html) application associates an [`NOPAction`](http://logback.qos.ch/xref/chapters/onJoran/implicit/NOPAction.html) instance with the pattern "*/foo", that is any element named as "foo". As its name indicates, the `begin`() and `end`() methods of `NOPAction` are empty. The `PrintMe` application also registers an instance of [PrintMeImplicitAction](http://logback.qos.ch/xref/chapters/onJoran/implicit/PrintMeImplicitAction.html) in its list of implicit actions. The `PrintMeImplicitAction` is applicable for any element which has a *printme* attribute set to true. See the `isApplicable()` method in `PrintMeImplicitAction`. The `begin()`() method of `PrintMeImplicitAction` prints the name of the current element on the console.

The XML document *implicit1.xml* is designed to illustrate how implicit actions come into play.

*Example 10.: Usage of implicit rules (logback-examples/src/main/java/chapters/onJoran/implicit/implicit1.xml)*

Running

java chapters.onJoran.implicit.PrintMe src/main/java/chapters/onJoran/implicit/implicit1.xml

yields:

Element [xyz] asked to be printed. Element [abc] asked to be printed. 20:33:43,750 |-ERROR in c.q.l.c.joran.spi.Interpreter@**10:9** - no applicable action for [xyz], current pattern is [[foo][xyz]]

Given that `NOPAction` instance is explicitly associated with the "*/foo" pattern, `NOPAction`'s `begin()` and `end()` methods are invoked on <foo> elements. `PrintMeImplicitAction` is never triggered for any of the <foo> elements. For other elements, since there are no matching explicit actions, the `isApplicable()` method of `PrintMeImplicitAction` is invoked. It will return true only for elements having a *printme* attribute set to true, namely the first <xyz> element (but not the second) and the <abc> element. The second <xyz> element on line 10, there are no applicable actions, an internal error message is generated. This message is printed by the `StatusPrinter.print` invocation, the last statement in the `PrintMe` application. This explains the output shown above (see previous paragraph).

### Implicit actions in practice

The respective Joran configurators of logback-classic and logback-access include just two implicit actions, namely [`NestedBasicPropertyIA`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/NestedBasicPropertyIA.html) and [`NestedComplexPropertyIA`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/NestedComplexPropertyIA.html).

`NestedBasicPropertyIA` is applicable for any property whose type is a primitive type (or equivalent object type in the `java.lang` package), an enumeration type, or any type adhering to the "valueOf" convention. Such properties are said to be *basic* or *simple*. A class is said to adhere to the "valueOf" convention if it contains a static method named `valueOf`() taking a `java.lang.String` as parameter and returning an instance of the type in question. At present, the [`Level`](http://logback.qos.ch/xref/ch/qos/logback/classic/Level.html), [`Duration`](http://logback.qos.ch/xref/ch/qos/logback/core/util/Duration.html) and [`FileSize`](http://logback.qos.ch/xref/ch/qos/logback/core/util/FileSize.html) classes follow this convention.

`NestedComplexPropertyIA` action is applicable, in the remaining cases where `NestedBasicPropertyIA` is not applicable *and* if the object at the top of the object stack has a setter or adder method for a property name equal to the current element name. Note that such properties can in turn contain other components. Thus, such properties are said to be *complex*. In presence of a complex property, [`NestedComplexPropertyIA`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/NestedComplexPropertyIA.html) will instantiate the appropriate class for the nested component and attach it to the parent component (at the top of the object stack) by using the setter/adder method of the parent component and the nested element's name. The corresponding class is specified by the *class* attribute of the (nested) current element. However, if the *class* attribute is missing, the class name can be deduced implicitly, if any of the following is true:

1. there is an internal rule associating the parent object's property with a designated class
2. the setter method contains a @DefaultClass attribute designating a given class
3. the parameter type of the setter method is a concrete class possessing a public constructor

#### Default class mapping

In logback-classic, there are a handful of internal rules mapping parent class/property name pairs to a default class. These are listed in the table below.

This list may change in future releases. Please see logback-classic [JoranConfigurator](http://logback.qos.ch/xref/ch/qos/logback/classic/joran/JoranConfigurator.html)'s `addDefaultNestedComponentRegistryRules` method for the latest rules.

In logback-access, the rules are very similar. In the default class for the nested component, the ch.qos.logback.classic package is replaced by ch.qos.logback.access. See logback-access [JoranConfigurator](http://logback.qos.ch/xref/ch/qos/logback/access/joran/JoranConfigurator.html)'s `addDefaultNestedComponentRegistryRules` method for the latest rules.

#### Collection of properties

Note that in addition to single simple properties or single complex properties, logback's implicit actions support collections of properties, be they simple or complex. Instead of a setter method, the property is specified by an "adder" method.

### New rules on the fly

Joran includes an action which allows the Joran interpreter to learn new rules on the fly, that is while interpreting an XML document. See the *logback-examples/src/main/java/chapters/onJoran/newRule/* directory for sample code. In this package, the [`NewRuleCalculator`](http://logback.qos.ch/xref/chapters/onJoran/newRule/NewRuleCalculator.html) application sets up just two rules, one rule to process the top-most element, and a second rule to learn new rules. Here is the relevant code from `NewRuleCalculator`.

```
ruleMap.put(new Pattern("*/computation"), new ComputationAction1());
ruleStore.addRule(new Pattern("/computation/newRule"), new NewRuleAction());
```

[`NewRuleAction`](http://logback.qos.ch/xref/ch/qos/logback/core/joran/action/NewRuleAction.html), part of logback-core, works pretty much like the other actions. It has a `begin()` and `end()` method, and is called each time the parser finds a *newRule* element. When invoked, the `begin()` method looks for *pattern* and *actionClass* attributes. It then instantiates the corresponding action class and adds the pattern/action association as a new rule in Joran's rule store.

Here is how new rules can be declared in an xml file:

```
<newRule pattern="*/computation/literal"
          actionClass="chapters.onJoran.calculator.LiteralAction"/>
```

Using such newRule declarations, we can transform `NewRuleCalculator` to behave like the `Calculator1` application we saw earlier. involving the calculation, could be expressed this way:

*Example 10..: Configuration file using new rules on the fly (logback-examples/src/main/java/chapters/onJoran/newrule/newRule.xml)*

java java chapters.onJoran.newRule.NewRuleCalculator src/main/java/chapters/onJoran/newRule/newRule.xml

yields

The computation named [toto] resulted in the value 30

which is identical to the output of the [original calculator example](http://logback.qos.ch/manual/onJoran.html#calculator).



<http://logback.qos.ch/manual/onJoran.html>