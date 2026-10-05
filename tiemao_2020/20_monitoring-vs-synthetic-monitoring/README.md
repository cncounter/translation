# Real User Monitoring vs. Synthetic Monitoring

> which one’s best for you?

# 真实用户监控与综合性能监控

> 哪一种更适合呢?


Every online business owner has woken up in cold sweat from this nightmare at least once in their life: you see your perfect customer, they are in their office, it’s after-lunch hours, and they are entering your website ready to spend a few hundred dollars. But… your website isn’t loading. They get a 503 error, close the tab and flash-forward 3 minutes later, they purchase from your competitor and forget about your existence.

What could have saved you from losing a client?
“Web performance monitoring!” – we say.

But which type of performance measuring would work best in your unique case: synthetic or real user monitoring? Let’s learn more about both and decide!

每个在线企业主一生中至少有一次从这样的噩梦中惊出一身冷汗：您会看到您的完美客户，他们在办公室里，正值午餐后的时间，正准备进入您的网站，打算花几百美元。 但是…您的网站没有加载出来。 他们收到503错误消息，关闭标签页，3分钟后，他们从竞争对手那里购买了产品，却忘记了您的存在。

有什么可以使您免于失去客户的呢？
“Web性能监控！”——我们说。

但是，在您的特殊情况下，哪种性能评估方式最合适：综合监控还是真实用户监控？ 让我们进一步了解两者并做出决定！

## Definitions of User Monitoring

To start off, both RUM and synthetic monitoring are designed to make sure your web application doesn’t crash, there are no errors, the pages load fast, and all the user scenarios work as planned. But what are the differences between the two?

## 用户监控的定义

首先，RUM和综合监控均旨在确保您的Web应用程序不会崩溃、没有错误、页面加载迅速，以及所有用户场景都按计划运行。 但是两者之间有什么区别？

## How Real User Monitoring works

Real user monitoring is considered to be passive monitoring, which basically means that you set it up once and wait until your users do all the work, and it relies entirely on the user interaction with your product.

The mechanics of RUM are fairly simple: You can insert a JS code that collects and reports all the page load data every time an end-user makes an interaction.

And the biggest secret is hidden right on the surface of the name “real user monitoring” will only collect the data from the real user sessions. Meaning, you can only do it when you have incoming traffic.

## 真实用户监控的工作方式

真实用户监控被认为是一种被动监控，这基本上意味着您只需要设置一次，然后等待用户完成所有工作，它完全依赖于用户与产品的交互。

RUM的机制非常简单：您可以插入一个JS代码，该代码在最终用户每次进行交互时收集并报告所有页面加载数据。

最大的秘密就藏在名字的表面上：“真实用户监控”只会从真实用户的会话中收集数据。 这意味着，只有在有实际流量进入时才可以这样做。

## How Synthetic Testing works

Unlike RUM, synthetic monitoring doesn’t require any real website visitors to perform the tests.

Instead, you will use automated testing tools like TruMonitor to run the scripts that will simulate the behavior of a real user. The scripts will follow through the scenarios that take place in real life and revisit those paths once in a while to ensure that everything works correctly.

The biggest advantage of synthetic monitoring is that you don’t have to wait until the users run into an error, experience long loading times or get mad about a glitchy UI element since the scripts will detect and report such deviations long before you even have any users on your website.

## 综合测试的工作原理

与RUM不同，综合监控不需要任何实际的网站访问者即可进行测试。

取而代之的是，您将使用TruMonitor之类的自动化测试工具来运行将模拟真实用户行为的脚本。 这些脚本将遵循现实生活中的场景，并不时地重新访问这些路径，以确保一切正常。

综合监控的最大优点是，您不必等到用户遇到错误、经历较长的加载时间或对出故障的UI元素感到愤怒，因为脚本早在您的网站上还没有任何用户之前，就会检测并报告此类偏差。

## Pros & Cons of RUM

## Advantages of RUM

### User Perspective

RUM lets you see the issues appearing from the end-user perspective. You want to know what the end-users go through — you do the real user monitoring. And since you count on the real users to do all the job, there won’t be a need to determine the user cases — the JavaScript code will notice and report the appearing errors anyways.

Not having any sort of monitoring on your website also may cost a lot of money in lost revenue once you start with the user acquisition: no one wants to use a laggy website.

## RUM的优缺点

## RUM的优点

### 用户视角

RUM使您可以从最终用户的角度查看出现的问题。 您想知道最终用户的真实体验——那就做真实用户监控。 而且，由于您依靠真实用户来完成所有工作，因此无需确定各种用户场景——无论如何，JavaScript代码都会注意到并报告出现的错误。

一旦开始获取用户，如果您的网站上没有任何形式的监控，也可能造成大量的收入损失：没有人愿意使用卡顿的网站。

### No Lost Reports

Every entrepreneur or web developer knows the most valuable thing they can get from their clients is feedback. The problem with that? On average, less than 1% of the users, who encounter bugs, unexpected status codes or any other sorts of troubles with the page performance, actually end up reporting those errors.

Luckily, the solution is easy: implement web testing tools to automate the process, and get your reports anyway!

### 没有丢失的报告

每个企业家或Web开发人员都知道，他们从客户那里获得的最有价值的东西就是反馈。 问题在于？ 平均而言，遇到bug、意外的状态代码或页面性能方面其他麻烦的用户中，实际会把这些问题报告出来的不到1％。

幸运的是，该解决方案很简单：实施Web测试工具以使流程自动化，并无论如何获取报告！

### Focus on the Real Issues

We all know that there isn’t such a thing as a website without bugs. Sometimes it’s going to be so many issues you’ll have to take care of, it becomes overwhelming!

RUM, and the fact you’re getting all the reports on the issues your users really encounter, and you know exactly how they happen, will help you prioritize the most important problems and focus on those that can potentially cause the biggest losses for your business.

### 关注实际问题

我们都知道，不存在没有任何bug的网站。 有时候，您需要处理的问题太多，会变得应接不暇！

通过RUM，您可以获得用户真正遇到的问题的所有报告，并且确切知道这些问题是如何发生的，这将帮助您确定最重要问题的优先级，并将精力集中在可能给企业造成最大损失的问题上。

## Disadvantages of RUM

### Traffic-driven approach

RUM will work only in case you’re getting enough traffic. Otherwise, you won’t get to know about the problems even if they exist.

This disadvantage of the real user monitoring approach can be a real dealbreaker for the projects on pre-production stages that want to figure out if there are any bugs with their product that need fixing before the users notice them.

So, if you’re working on a brand-new website for a client, or about to launch your startup’s beta, and don’t yet have any traffic, RUM won’t work for you.

## RUM的缺点

### 流量驱动的方法

只有当您获得足够的流量时，RUM才会起作用。 否则，即使问题存在，您也不会察觉。

真实用户监控方式的这一缺点，对于处于上线前阶段的项目来说可能是致命的障碍——这些项目希望在用户发现问题之前，先弄清楚产品中是否存在需要修复的缺陷。

因此，如果您正在为客户开发全新的网站，或者即将启动初创公司的Beta版，并且还没有任何流量，那么RUM将不适合您。

## Pros & Cons of Synthetic Monitoring

## Advantages of Synthetic Monitoring

### Proactive Approach

Since synthetic monitoring doesn’t require having any real traffic, it gives you a huge leg-up: using this approach, you get to fix the issues before they appear in real life conditions.

The constant reruns of the user cases in synthetic monitoring are crucial for the businesses that have to be working like a Swiss watch 24/7.

And, of course, what can be better than that feeling when you get to fix your mistake before anyone even sees it?

## 综合监控的利与弊

## 综合监控的优势

### 主动式方法

由于综合监控不需要任何实际流量，因此可以为您带来极大的帮助：使用这种方法，您可以在问题出现在现实生活中之前对其进行修复。

综合监控中不断重跑用户场景，对于必须像瑞士手表那样7x24小时不间断运作的业务来说至关重要。

而且，当然，还有什么比在任何人看到之前就修复了自己的错误更美妙的感觉呢？

### Third-party Apps Monitoring

Unlike RUM, synthetic testing also gives you an opportunity to monitor the performance of the third-party apps, APIs and microservices that you use on your website.

The capacity to do this may become especially important for eCommerce websites that often heavily rely on third-party add-ons, shopping carts, and payment modules.

### 第三方应用监控

与RUM不同，综合测试还为您提供了监视网站上使用的第三方应用程序，API和微服务的性能的机会。

对于经常严重依赖第三方插件，购物车和付款模块的电子商务网站，执行此操作的能力可能尤其重要。

### Using Benchmarks

Setting up the baseline measures and comparison benchmarks allow you to not only see the errors in the user journeys but also detect the slightest changes in the web performance.

There are many things that can change once you have a living web application on your hands. You decide to move another server, or change a hosting provider, or add a little plugin that ends up slowing down your whole website. Things happen! And often, the slightest changes go unnoticed. But not with all the data the test automation tools can gather and make it possible for you to revise.

### 使用基准

设置基准测量和比较基准可以使您不仅查看用户使用过程中的错误，还可以检测到网络性能的最细微变化。

一旦有了一个正在运行的Web应用程序，很多事情都可能发生改变。 您可能决定迁移一台服务器，或更换托管服务提供商，或添加一个小插件，结果却拖慢了整个网站。 事情就是这样！ 通常，最细微的变化不会被注意到。 但有了测试自动化工具收集的所有数据，您就可以察觉并核查这些变化。

## Disadvantages of Synthetic Monitoring

### Predictable Environment

Sometimes it is considered that synthetic testing has one major weakness: the scenarios this approach takes into account follow the specific scripts, while the user experience in real life can significantly differ from those scripts.

But what seems to be a severe accusation on paper, is not always a thing to worry about in real life. Just think of this: how many web apps are out there which use such complicated user paths that it’s impossible for the engineers to think of all the test cases they need to monitor?

The answer is — not so many.

For all the rest, synthetic monitoring will be quite easy to set up and maintain. And definitely will be more than enough in terms of simulating the user journey.

## 综合监控的缺点

### 可预测的环境

有时人们认为综合测试有一个主要弱点：这种方法考虑的场景遵循特定的脚本，而现实生活中的用户体验可能与这些脚本有很大不同。

但是，纸面上看似严厉的指责，在现实生活中并不总是需要担心的问题。 只需想一下：有多少个Web应用程序的用户路径复杂到工程师无法考虑到所有需要监控的测试用例？

答案是——并不多。

对于其余的情况，综合监控都非常容易设置和维护，而且在模拟用户旅程方面肯定绰绰有余。

## Synthetic Monitoring Vs. RUM: which one to choose?

In most articles written on this topic, you will see advice to use both of these methods simultaneously.

And we think it may be a good idea if you have enough resources to pull off both these monitoring methods. But to make the decision easier for those who’d like to pick just one we made a list of reasons to choose synthetic monitoring over RUM:

- Doesn’t require real traffic
- Scripts continuously go over the test cases
- You get to fix page performance before users notice something was wrong
- Proactive approach
- Supports third-party application testing
- You’ll be able to monitor the crucial measurements
- You can set and compare the benchmarks

## 综合监控与 RUM：选择哪一个？

在有关该主题的大多数文章中，您都会看到同时使用这两种方法的建议。

我们认为，如果您有足够的资源来同时实施这两种监控方法，那可能是个好主意。 但是，为了让那些只想选择其中一种的人更容易做出决定，我们列出了选择综合监控而非RUM的理由：

- 不需要真实流量
- 脚本持续遍历测试用例
- 您可以在用户发现问题之前修好页面性能问题
- 主动式方法
- 支持第三方应用程序测试
- 您将能够监控关键指标
- 您可以设置和比较基准

## How CloudQA helps businesses implement Synthetic Monitoring


At CloudQA we’ve created TruMonitor — a tool that helps you get started with synthetic monitoring in a blink of an eye.

TruMonitor is a low-maintenance data-driven tool that supports complex user flows, let’s you create and customize them with minimal efforts, and provides you with real-time data and reports.

We know how hard it’s sometimes to get started with something that seems new and somewhat complicated and that’s why we provide everyone a free product demo to show how surprisingly simple it really is.

Ready to give it a try?

## CloudQA如何帮助企业实施综合监控


在CloudQA，我们创建了TruMonitor——一种能帮助您瞬间上手综合监控的工具。

TruMonitor是一种低维护数据驱动的工具，可支持复杂的用户流，让您以最小的努力创建和自定义它们，并为您提供实时数据和报告。

我们知道，有时候着手处理看似新颖又有些复杂的东西是多么困难，这就是为什么我们为每个人提供免费的产品演示，以证明它实际上非常简单。

准备尝试一下吗？


- [Real User Monitoring vs. Synthetic Monitoring](https://cloudqa.io/real-user-monitoring-vs-synthetic-monitoring-which-ones-best-for-you/)
