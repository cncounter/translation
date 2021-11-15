# Why Low Latency is Critical and its effect on Application Performance

# 高性能系统的关键指标 - 低延迟



A lot has changed since Java and the JVM were created in the mid-1990s. The invention of Java solved an important problem that caused developers to spend enormous time coping with memory problems, memory leaks. Java and the JVM solved that problem, enabling Java developers to focus more on accomplishing the objective the software was intended to attain, rather than debugging memory issues. Unfortunately, Java’s solution, Garbage Collection (GC), created a new kind of problem: sudden random delays in an application’s performance. Today, such delays are intolerable.

In this article series, we’ll focus on metrics and factors related to performance within the context of latency, in particular high tail latency. In the first article we talk about the problem and impact of software latency in general, while touching upon the unique problems Java creates with respect to application latency. Our next article will focus specifically on how Java can cause very high tail latency in high performance applications.



自 1990 年代中期创建 Java 和 JVM 以来，发生了很多变化。 Java 的发明解决了导致开发人员花费大量时间处理内存问题、内存泄漏的重要问题。 Java 和 JVM 解决了这个问题，使 Java 开发人员能够更多地专注于实现软件旨在实现的目标，而不是调试内存问题。不幸的是，Java 的解决方案垃圾回收 (GC) 产生了一种新问题：应用程序性能的突然随机延迟。今天，这种拖延是不能容忍的。

在本系列文章中，我们将重点关注与延迟上下文中的性能相关的指标和因素，尤其是高尾延迟。在第一篇文章中，我们大体上讨论了软件延迟的问题和影响，同时涉及 Java 在应用程序延迟方面造成的独特问题。我们的下一篇文章将特别关注 Java 如何在高性能应用程序中导致非常高的尾部延迟。


## What is Latency

Latency is the time between the initiation of a procedure and the completion of the procedure; in other words, how long it takes for something to happen.

In the realm of software, there are many types of latency. No application can possibly be truly real-time (that is, zero latency: zero time elapses between the initiation of the procedure and the delivery of the result). Still, the objective of all high-performance applications is to be as close to real-time as possible.

## 什么是延迟

延迟是程序启动和程序完成之间的时间； 换句话说，某事发生需要多长时间。

在软件领域，存在多种类型的延迟。 没有任何应用程序可能是真正实时的（即零延迟：从程序启动到结果交付之间的时间为零）。 尽管如此，所有高性能应用程序的目标都是尽可能接近实时。

## Types of Latency

An interesting article in InfoWorld defined [4 sources of latency](https://www.infoworld.com/article/3235340/4-sources-of-latency-and-how-to-avoid-them.html):

- Network I/O
- Disk I/O
- The operating environment
- Your code

## 延迟类型

InfoWorld 中的一篇有趣的文章定义了 [4 个延迟来源](https://www.infoworld.com/article/3235340/4-sources-of-latency-and-how-to-avoid-them.html):

- 网络输入/输出
- 磁盘输入/输出
- 运行环境
- 你的代码

Network I/O can be a big problem especially if your application needs to traverse the Internet to gather data from external sources. The time required to even connect to the remote server can vary widely, producing very different latencies for an application. Even an internal network’s performance can vary, altering the performance of your application if it calls an internal service.

Disk I/O is an obvious problem, which is why modern applications use memory as much as possible to lower latency; but sometimes disk I/O is required, for example in the case where data is arriving from a satellite for processing within a data center. The data may arrive as a file which has to be stored on disk then read by the analysis application.

网络 I/O 可能是一个大问题，尤其是当您的应用程序需要遍历 Internet 以从外部来源收集数据时。甚至连接到远程服务器所需的时间可能会有很大差异，从而为应用程序产生非常不同的延迟。即使是内部网络的性能也会有所不同，如果它调用内部服务，就会改变应用程序的性能。

磁盘 I/O 是一个明显的问题，这就是为什么现代应用程序尽可能多地使用内存来降低延迟；但有时需要磁盘 I/O，例如在数据从卫星到达以在数据中心内进行处理的情况下。数据可能以文件形式到达，该文件必须存储在磁盘上，然后由分析应用程序读取。


Different operating environments provide different [performance](https://www.azul.com/resources/azul-technology/zing-consistent-low-latency-performance/): “The operating environment in which you run your real-time application—on shared hardware, in containers, in virtual machines, or in the cloud—can significantly impact latency.”

What you, as a developer, have most control over is your code. But, even here, there are differences: different languages have different latency for the same computations. For example, the performance of C/C++ differs from the performance of Python. Unlike C/C++ and Python, which provide generally static performance, Java Virtual Machine (JVM) languages are unique: second-level Just-In-Time (JIT) compilers can re-optimize the byte code based on which code paths are being used most at a given time; however, the JVM also includes Garbage Collection (GC), which in most algorithms results in application threads being paused while different aspects of GC are performed.

In addition, input data sets can affect latency, particularly in cases where the software is performing mathematical analysis of a data stream. Sometimes the input data set has an easy solution, and complex code is never entered. Other times the input data requires a much more complex path through the software, resulting in significantly higher software processing time. This can be the case, for example, in financial trading systems or scientific data analysis systems like weather forecasting or analyzing military satellite data streams. Here is where second-level JVM JIT compilers excel. Languages like C/C++ and Python cannot adapt and optimize for changing data conditions. JVMs that use adaptive compilation strategies can.


不同的运行环境提供不同的[性能](https://www.azul.com/resources/azul-technology/zing-consistent-low-latency-performance/)：“运行实时应用程序的运行环境——在共享硬件、容器、虚拟机或云中——会显着影响延迟。”

作为开发人员，您最能控制的是您的代码。但是，即使在这里，也存在差异：对于相同的计算，不同的语言具有不同的延迟。例如，C/C++ 的性能与 Python 的性能不同。与通常提供静态性能的 C/C++ 和 Python 不同，Java 虚拟机 (JVM) 语言是独一无二的：二级即时 (JIT) 编译器可以根据正在使用的代码路径重新优化字节码大多数在给定的时间；但是，JVM 还包括垃圾收集 (GC)，在大多数算法中，这会导致应用程序线程在执行 GC 的不同方面时暂停。

此外，输入数据集会影响延迟，特别是在软件对数据流进行数学分析的情况下。有时输入数据集有一个简单的解决方案，从不输入复杂的代码。其他时候，输入数据需要通过更复杂的软件路径，导致软件处理时间显着增加。例如，在金融交易系统或科学数据分析系统（如天气预报或分析军事卫星数据流）中就是这种情况。这就是二级 JVM JIT 编译器的优势所在。 C/C++ 和 Python 等语言无法适应和优化不断变化的数据条件。使用自适应编译策略的 JVM 可以。


## Software Latency Example

Here is a simple graphical example of what latency can look like for a typical high-performance application. We have a process being initiated repeatedly over time, with latency results that are mostly small, mostly within a narrow range; but occasionally very high latency occurs. For high-performance applications, grouping latency by percentile often produces a plot similar to this:

## 软件延迟示例

这是一个简单的图形示例，展示了典型高性能应用程序的延迟情况。 我们有一个过程随着时间的推移反复启动，延迟结果大多很小，大多在一个狭窄的范围内； 但偶尔会出现非常高的延迟。 对于高性能应用程序，按百分位数对延迟进行分组通常会产生与此类似的图：

![img](https://www.azul.com/files/Application_Latency_Percentile-300x240.png)

The Y-axis represents some arbitrary units of time that represent your application’s typical performance. The X-axis is the result of grouping all the latency results over a period of time into percentiles. The blue line is the latency for each percentile. The orange line is the average latency over the entire time span.

Looking at the average latency, you might think “Our application does pretty well, doesn’t it? Our latency is lower than its average value 76% of the time!”

Y 轴代表一些任意时间单位，代表您的应用程序的典型性能。 X 轴是将一段时间内的所有延迟结果分组为百分位数的结果。蓝线是每个百分位数的延迟。橙色线是整个时间跨度的平均延迟。

查看平均延迟，您可能会想“我们的应用程序做得很好，不是吗？我们的延迟在 76% 的情况下低于其平均值！”

Here’s the problem. If your application has acceptable latency the great majority of the time, but extreme latency some of the time, you might go out of business. Why? Because one of your competitors’ applications might almost never exhibit ultra high latency.

If your customers need your product’s result very quickly in every instance when they use it, but sometimes they are left stranded with long waits, they’ll switch to your competitor, even though the competitor’s average latency might be higher than yours. Your tail latency is much higher than your competitor’s tail latency, so it’s safer from a business point of view for your customers who need very consistent service to switch to your competitor’s product.

这就是问题所在。如果您的应用程序在大多数情况下具有可接受的延迟，但在某些情况下延迟非常大，您可能会倒闭。为什么？因为您的竞争对手的应用程序之一可能几乎不会出现超高延迟。

如果您的客户在每次使用时都非常快速地需要您的产品的结果，但有时他们会因长时间等待而陷入困境，他们会转向您的竞争对手，即使竞争对手的平均延迟可能高于您的。您的尾部延迟远高于竞争对手的尾部延迟，因此从业务角度来看，对于需要非常一致的服务的客户切换到竞争对手的产品而言，这更安全。


## The Cost of High Tail Latency: Use Cases

Let’s consider a few use cases where high tail latency is totally unacceptable, even intolerable.


## 高尾延迟的代价：用例

让我们考虑几个用例，其中高尾延迟是完全不可接受的，甚至是不能容忍的。

- **Financial Trading:** The markets change very quickly. If your application delivers the right data to enable the correct trade to be made quickly, that’s good. But one long wait when a trade needed to be made could wipe hours or even days (or worse) of successful trading.
- **Military Satellite Data Analysis:** Military commanders rely on near-real-time analysis of incoming data streams from satellites (for example applications that analyze measurements of the ionosphere) to determine whether soldiers on the ground or in the air will have viable and reliable communications and navigation systems. A sudden long delay in receiving the needed result creates uncertainty that puts soldiers’ lives in danger.
- **E-Commerce:** There are many sites where the same product can be purchased. If your service is normally quick, that’s fine; but if sometimes customers have to wait for a very long time after clicking a button, and they get very frustrated, they’ll leave you and find a more reliable vendor.
- **Phone-Based Apps:** Users of phone-based apps understand that sometimes there are issues with networks. But, if they notice that even when the network appears fine, your app is randomly highly unresponsive (due to your own application’s high tail latency), they are unlikely to keep using your app for very long.


- **金融交易：** 市场变化非常快。如果您的应用程序提供正确的数据以快速进行正确的交易，那很好。但是，在需要进行交易时的漫长等待可能会抹去数小时甚至数天（或更糟）的成功交易时间。
- **军事卫星数据分析：** 军事指挥官依靠对来自卫星的传入数据流的近实时分析（例如分析电离层测量值的应用程序）来确定地面或空中的士兵是否具有可行且可靠的通信和导航系统。收到所需结果的突然长时间延迟会产生不确定性，使士兵的生命处于危险之中。
- **电子商务：** 有许多网站可以购买相同的产品。如果您的服务通常很快，那很好；但是，如果有时客户在单击按钮后必须等待很长时间，并且感到非常沮丧，他们会离开您并寻找更可靠的供应商。
- **基于手机的应用程序：** 基于手机的应用程序的用户知道有时网络会出现问题。但是，如果他们注意到即使网络看起来正常，您的应用程序也会随机地高度无响应（由于您自己的应用程序的高尾延迟），他们不太可能继续使用您的应用程序很长时间。


Low latency is critical for any application to succeed in the marketplace. However, tail latency can be a much greater determinant to the possibility of success for an application than average latency. Java itself very well illustrates the problem of high tail latency, through garbage collection.

In my next post, I will describe in greater detail how traditional Java Virtual Machines uniquely contribute to high tail latency, along with how Zing solves this problem.

低延迟对于任何应用程序在市场上取得成功都至关重要。但是，与平均延迟相比，尾部延迟对于应用程序成功的可能性来说可能是更大的决定因素。 Java 本身通过垃圾收集很好地说明了尾延迟高的问题。

在我的下一篇文章中，我将更详细地描述传统 Java 虚拟机如何独特地导致高尾延迟，以及 Zing 如何解决这个问题。








<https://www.azul.com/low-latency-effect-application-performance/>
