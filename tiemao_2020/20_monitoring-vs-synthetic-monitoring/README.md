# Real User Monitoring vs. Synthetic Monitoring

> which one’s best for you?

# 真实用户监控与综合性能监控

> 哪一种更适合呢?


Every online business owner has woken up in cold sweat from this nightmare at least once in their life: you see your perfect customer, they are in their office, it’s after-lunch hours, and they are entering your website ready to spend a few hundred dollars. But… your website isn’t loading. They get a 503 error, close the tab and flash-forward 3 minutes later, they purchase from your competitor and forget about your existence.

What could have saved you from losing a client?
“Web performance monitoring!” – we say.

But which type of performance measuring would work best in your unique case: synthetic or real user monitoring? Let’s learn more about both and decide!

每个在线企业主一生中至少经历过一次噩梦般的冷汗：您会看到您的完美客户，他们在办公室，午餐时间，他们正在进入您的网站，准备花几百美元 美元。 但是...您的网站未加载。 他们收到503错误消息，关闭标签页，并在3分钟后快进，他们从竞争对手那里购买产品，却忘记了您的存在。

有什么可以使您免于失去客户的呢？
“ Web性能监控！” - 我们说。

但是，哪种类型的性能评估在您的特殊情况下最适合：综合或实际用户监视？ 让我们进一步了解两者并决定！

## Definitions of User Monitoring

To start off, both RUM and synthetic monitoring are designed to make sure your web application doesn’t crash, there are no errors, the pages load fast, and all the user scenarios work as planned. But what are the differences between the two?

## 用户监控的定义

首先，RUM和综合监视均旨在确保您的Web应用程序不会崩溃，没有错误，页面加载迅速以及所有用户方案均按计划工作。 但是两者之间有什么区别？

## How Real User Monitoring works

Real user monitoring is considered to be passive monitoring, which basically means that you set it up once and wait until your users do all the work, and it relies entirely on the user interaction with your product.

The mechanics of RUM are fairly simple: You can insert a JS code that collects and reports all the page load data every time an end-user makes an interaction.

And the biggest secret is hidden right on the surface of the name “real user monitoring” will only collect the data from the real user sessions. Meaning, you can only do it when you have incoming traffic.

## 实际用户监控的工作方式

真正的用户监视被认为是被动监视，这基本上意味着您只需要设置一次就可以等待用户完成所有工作，并且它完全依赖于用户与产品的交互。

RUM的机制非常简单：您可以插入一个JS代码，该代码在最终用户每次进行交互时收集并报告所有页面加载数据。

最大的秘密隐藏在名称“真实用户监视”的表面上，它将仅从真实用户会话中收集数据。 这意味着，只有在有传入流量时才可以这样做。

## How Synthetic Testing works

Unlike RUM, synthetic monitoring doesn’t require any real website visitors to perform the tests.

Instead, you will use automated testing tools like TruMonitor to run the scripts that will simulate the behavior of a real user. The scripts will follow through the scenarios that take place in real life and revisit those paths once in a while to ensure that everything works correctly.

The biggest advantage of synthetic monitoring is that you don’t have to wait until the users run into an error, experience long loading times or get mad about a glitchy UI element since the scripts will detect and report such deviations long before you even have any users on your website.

##综合测试的工作原理

与RUM不同，综合监控不需要任何实际的网站访问者即可进行测试。

取而代之的是，您将使用TruMonitor之类的自动化测试工具来运行将模拟真实用户行为的脚本。 这些脚本将遵循现实生活中的场景，并不时地重新访问这些路径，以确保一切正常。

综合监视的最大优点是，您不必等到用户遇到错误，经历较长的加载时间或对故障的UI元素感到生气后，因为脚本会在您甚至没有任何错误的情况下就检测到并报告此类偏差。 您网站上的用户。

## Pros & Cons of RUM

## Advantages of RUM

### User Perspective

RUM lets you see the issues appearing from the end-user perspective. You want to know what the end-users go through — you do the real user monitoring. And since you count on the real users to do all the job, there won’t be a need to determine the user cases — the JavaScript code will notice and report the appearing errors anyways.

Not having any sort of monitoring on your website also may cost a lot of money in lost revenue once you start with the user acquisition: no one wants to use a laggy website.

## RUM的优缺点

## RUM的优点

### 用户视角

RUM使您可以从最终用户角度查看出现的问题。 您想知道最终用户要经历的事情—您需要进行真实的用户监视。 而且，由于您依靠真正的用户来完成所有工作，因此无需确定用户案例-JavaScript代码无论如何都会注意到并报告出现的错误。

一旦开始获取用户，在您的网站上进行任何形式的监视也可能导致大量收入损失：没有人愿意使用落后的网站。

### No Lost Reports

Every entrepreneur or web developer knows the most valuable thing they can get from their clients is feedback. The problem with that? On average, less than 1% of the users, who encounter bugs, unexpected status codes or any other sorts of troubles with the page performance, actually end up reporting those errors.

Luckily, the solution is easy: implement web testing tools to automate the process, and get your reports anyway!

###没有丢失的报告

每个企业家或Web开发人员都知道，他们从客户那里获得的最有价值的东西就是反馈。 那是什么问题？ 平均而言，遇到错误，意外的状态代码或页面性能任何其他麻烦的用户不到1％，实际上最终会报告这些错误。

幸运的是，该解决方案很简单：实施Web测试工具以使流程自动化，并无论如何获取报告！

### Focus on the Real Issues

We all know that there isn’t such a thing as a website without bugs. Sometimes it’s going to be so many issues you’ll have to take care of, it becomes overwhelming!

RUM, and the fact you’re getting all the reports on the issues your users really encounter, and you know exactly how they happen, will help you prioritize the most important problems and focus on those that can potentially cause the biggest losses for your business.

### 关注实际问题

我们都知道，没有像这样的网站没有漏洞。 有时候，您需要处理的问题太多了，它变得势不可挡！

RUM，而且您将获得有关用户真正遇到的问题的所有报告，并且您确切知道它们的发生情况，这将帮助您确定最重要的问题的优先级，并将重点放在可能给您的企业造成最大损失的问题上 。

## Disadvantages of RUM

### Traffic-driven approach

RUM will work only in case you’re getting enough traffic. Otherwise, you won’t get to know about the problems even if they exist.

This disadvantage of the real user monitoring approach can be a real dealbreaker for the projects on pre-production stages that want to figure out if there are any bugs with their product that need fixing before the users notice them.

So, if you’re working on a brand-new website for a client, or about to launch your startup’s beta, and don’t yet have any traffic, RUM won’t work for you.

## RUM的缺点

###流量驱动的方法

仅当您获得足够的流量时，RUM才起作用。 否则，即使存在这些问题，您也不会了解这些问题。

真正的用户监视方法的缺点是，对于在生产前阶段想要弄清楚产品中是否有任何错误需要在用户注意到它们之前进行修复的项目，是一个真正的破坏者。

因此，如果您正在为客户使用全新的网站，或者即将启动初创公司的Beta版，并且还没有任何流量，那么RUM将无法为您服务。

## Pros & Cons of Synthetic Monitoring

## Advantages of Synthetic Monitoring

### Proactive Approach

Since synthetic monitoring doesn’t require having any real traffic, it gives you a huge leg-up: using this approach, you get to fix the issues before they appear in real life conditions.

The constant reruns of the user cases in synthetic monitoring are crucial for the businesses that have to be working like a Swiss watch 24/7.

And, of course, what can be better than that feeling when you get to fix your mistake before anyone even sees it?

##综合监控的利与弊

##综合监控的优势

###主动方法

由于综合监控不需要任何实际流量，因此可以为您带来极大的帮助：使用这种方法，您可以在问题出现在现实生活中之前对其进行修复。

综合监控中用户案例的不断重播对于必须像瑞士手表24/7一样运作的业务至关重要。

而且，当然，当您在任何人都没有看到之前纠正错误时，有什么比那种感觉更好的呢？

### Third-party Apps Monitoring

Unlike RUM, synthetic testing also gives you an opportunity to monitor the performance of the third-party apps, APIs and microservices that you use on your website.

The capacity to do this may become especially important for eCommerce websites that often heavily rely on third-party add-ons, shopping carts, and payment modules.

###第三方应用监控

与RUM不同，综合测试还为您提供了监视网站上使用的第三方应用程序，API和微服务的性能的机会。

对于经常严重依赖第三方插件，购物车和付款模块的电子商务网站，执行此操作的能力可能尤其重要。

### Using Benchmarks

Setting up the baseline measures and comparison benchmarks allow you to not only see the errors in the user journeys but also detect the slightest changes in the web performance.

There are many things that can change once you have a living web application on your hands. You decide to move another server, or change a hosting provider, or add a little plugin that ends up slowing down your whole website. Things happen! And often, the slightest changes go unnoticed. But not with all the data the test automation tools can gather and make it possible for you to revise.

###使用基准

设置基准测量和比较基准可以使您不仅查看用户使用过程中的错误，还可以检测到网络性能的最细微变化。

一旦拥有了可用的Web应用程序，许多事情都会改变。 您决定移动另一台服务器，或更改托管服务提供商，或添加一个小插件，最终导致整个网站速度下降。 事情发生！ 通常，丝毫变化都不会引起注意。 但是测试自动化工具无法收集所有数据，因此您可以进行修改。

## Disadvantages of Synthetic Monitoring

### Predictable Environment

Sometimes it is considered that synthetic testing has one major weakness: the scenarios this approach takes into account follow the specific scripts, while the user experience in real life can significantly differ from those scripts.

But what seems to be a severe accusation on paper, is not always a thing to worry about in real life. Just think of this: how many web apps are out there which use such complicated user paths that it’s impossible for the engineers to think of all the test cases they need to monitor?

The answer is — not so many.

For all the rest, synthetic monitoring will be quite easy to set up and maintain. And definitely will be more than enough in terms of simulating the user journey.

##综合监控的缺点

###可预测的环境

有时，人们认为综合测试有一个主要弱点：这种方法考虑的场景遵循特定的脚本，而现实生活中的用户体验可能与这些脚本有很大不同。

但是，在纸面上似乎是一个严厉的指责，在现实生活中并不总是要担心。 只需考虑一下：那里有多少个Web应用程序使用了如此复杂的用户路径，工程师就无法考虑他们需要监视的所有测试用例？

答案是-不很多。

对于所有其他方面，综合监控将非常容易设置和维护。 并且在模拟用户旅程方面肯定会绰绰有余。

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

##综合监控与。 朗姆酒：选择哪一个？

在有关该主题的大多数文章中，您将看到同时使用这两种方法的建议。

我们认为，如果您有足够的资源来实施这两种监视方法，则可能是个好主意。 但是，为了使那些只想选择一个的人更容易做出决定，我们列出了选择对RUM进行综合监视的原因：

-不需要实际流量
-脚本不断遍历测试用例
-您可以在用户发现错误之前修复页面性能
-积极进取
-支持第三方应用程序测试
-您将能够监控关键的指标
-您可以设置和比较基准

## How CloudQA helps businesses implement Synthetic Monitoring


At CloudQA we’ve created TruMonitor — a tool that helps you get started with synthetic monitoring in a blink of an eye.

TruMonitor is a low-maintenance data-driven tool that supports complex user flows, let’s you create and customize them with minimal efforts, and provides you with real-time data and reports.

We know how hard it’s sometimes to get started with something that seems new and somewhat complicated and that’s why we provide everyone a free product demo to show how surprisingly simple it really is.

Ready to give it a try?

## CloudQA如何帮助企业实施综合监控


在CloudQA，我们创建了TruMonitor —一种工具，可帮助您在瞬间完成综合监控。

TruMonitor是一种低维护数据驱动的工具，可支持复杂的用户流，让您以最小的努力创建和自定义它们，并为您提供实时数据和报告。

我们知道有时候开始使用似乎有些新奇和有些复杂的东西是多么困难，这就是为什么我们为每个人提供免费的产品演示，以证明它确实非常简单。

准备尝试一下吗？


- [Real User Monitoring vs. Synthetic Monitoring](https://cloudqa.io/real-user-monitoring-vs-synthetic-monitoring-which-ones-best-for-you/)
