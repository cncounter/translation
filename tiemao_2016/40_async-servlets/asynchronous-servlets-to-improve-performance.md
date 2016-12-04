#How to use Asynchronous Servlets to improve performance

# 使用异步servlet提升性能

Since we have post this article we have received a lot of feedback about it. Based on this feedback we have updated the examples to make them easier to understand and, hopefully, clarify any doubts in their correctness.

本文发布之后, 收到了很多的反馈。基于这些反馈,我们更新了文中的示例,使读者更容易理解和掌握, 如果您发现错误和遗漏,希望能给我们提交反馈,帮助我们改进。


This post is going to describe a performance optimization technique applicable to a common problem related to modern webapps. Applications nowadays are no longer just passively waiting for browsers to initiate requests, they want to start  communication themselves. A typical example would involve chat applications, auction houses etc – the common denominator being the fact that most of the time the connections with the browser are idle and wait for a certain event being triggered.

本文针对当今 webapp 中一种常碰到的问题，介绍相应的性能优化解决方案。如今的WEB程序不再只是被动地等待浏览器的请求, 他们之间也会互相进行通信。 典型的场景包括 在线聊天, 实时拍卖等 —— 后台程序大部分时间与浏览器的连接处于空闲状态, 并等待某个事件被触发。


This type of applications has developed a problem class of their own, especially when facing heavy load. The symptoms include starving threads, suffering user interaction, staleness issues etc.

这些应用引发了一类新的问题,特别是在负载较高的情况下。引发的状况包括线程饥饿, 影响用户体验、请求超时等问题。


Based on recent experience with this type of apps under load, I thought it would be a good time to demonstrate a simple solution. After Servlet API 3.0 implementations became mainstream, the solution has become truly simple, standardized and elegant.

基于这种类型的应用在高负载下的实践, 我会介绍一种简单的解决方案。在 Servlet 3.0成为主流以后, 这是一种真正简单、标准化并且十分优雅的解决方案。


But before we jump into demonstrating the solution, we should understand the problem in greater detail. What could be easier for our readers than to explain the problem with the help of some source code:

在演示具体的解决方案前,我们先了解到底发生了什么问题。请看代码:


	@WebServlet(urlPatterns = "/BlockingServlet")
	public class BlockingServlet extends HttpServlet {

	  protected void doGet(HttpServletRequest request, HttpServletResponse response) {
	    waitForData();
	    writeResponse(response, "OK");
	  }

	  public static void waitForData() {
	    try {
	      Thread.sleep(ThreadLocalRandom.current().nextInt(2000));
	    } catch (InterruptedException e) {
	      e.printStackTrace();
	    }
	  }
	}



The servlet above is an example of how an application described above could look like:

此 servlet 所代表的情景如下:


- Every 2 seconds some event happens. E.g. stock quote arrives, chat is updated and so on.
- End-user request arrives, announcing interest to monitor certain events
- The thread is blocked until the next event arrives
- Upon receiving the event, the response is compiled and sent back to the client

<br/>

- 每2秒会有某些事件发生, 例如, 报价信息更新, 聊天信息抵达等。
- 终端用户请求对某些特定事件进行监听。
- 线程暂时被阻塞, 直到收到下一次事件。
- 接收到事件时, 处理响应信息并发送给客户端


###############################
####校对到此处
###############################


Let me explain this waiting aspect. We have some external event that happens every 2 seconds. When new request from end-user arrives, it has to wait some time between 0 and 2000ms until next event. In order to keep it simple, we have emulated this waiting part with a call to Thread.sleep() for random number of ms between 0 and 2000. So every request waits on average for 1 second.

下面解释一下这个等待场景。 某些外部事件每2秒触发一次。当用户的请求到达时, 它必须等待 0 到 2000 毫秒之间的,直到下一个事件到达.为了保持简单,我们模仿这个部分通过调用thread . sleep()等待随机数的女士在0到2000之间。因此,每个请求的平均等待1秒。

Now – you might think this is a perfectly normal servlet. In many cases, you would be completely correct – there is nothing wrong with the code until the application faces significant load.

现在,你可能会认为这是一个完全正常的servlet。在很多情况下,你会完全正确——与代码没有错,直到应用程序面临重大的负担。

In order to simulate this load I created a fairly simple test with some help from JMeter, where I launched 2,000 threads, each running through 10 iterations of bombarding the application with requests to the /BlockedServlet. Running the test with the deployed servlet on an out-of-the-box Tomcat 8.0.30 I got the following results:

为了模拟这种负载我创建了一个相当简单的测试在JMeter的帮助下,我推出了2000个线程,每个贯穿10迭代的轰击应用程序请求/ BlockedServlet。运行测试与部署servlet开箱即用的Tomcat 8.0.30我得到以下结果:


- Average response time: 9,492 ms
- Minimum response time: 205 ms
- Maximum response time: 11,368 ms
- Throughput: 195 requests/second

- 平均响应时间: 9,492 ms
- 最小响应时间: 205 ms
- 最大响应时间: 11,368 ms
- 吞吐量: 195 个请求/秒


The default Tomcat configuration has got 200 worker threads which, coupled with the fact that the simulated work is replaced with the sleep cycle of average duration of 1000ms, explains nicely the throughput number – in each second the 200 threads should be able to complete 200 sleep cycles, 1 second on average each. Adding context switch costs on top of this, the achieved throughput of 195 requests/second is pretty close to our expectations.

Tomcat 默认的配置是 200个 worker 线程, 再加上模拟的工作量,平均 1000 ms 的睡眠时间, 很好地解释了吞吐量 - 每秒钟 200 个线程数量应该能够完成200次睡眠周期, 平均1秒钟. 除此之外,有一些上下文切换的成本, 所以吞吐量是 195个请求/秒 非常接近我们的预期。


The throughput itself would not look too bad for 99.9% of the applications out there. However, looking at the maximum and especially average response times the problem starts to look more serious. Getting the worst case response in 11 seconds instead of the expected 2 seconds is a sure way to annoy your users.

对 99.9%的应用程序来说, 这个吞吐量本身看上去也不会糟糕。但是,看看最大响应时间, 特别是平均响应时间， 你就会发现问题其实很严重了. 最坏情况下居然需要11秒才能得到响应, 而不是预期的2秒,这对用户来说肯定特别的不友好。


Let us now take a look at an alternative implementation, taking advantage of the Servlet API 3.0 asynchronous support:

现在我们看另一种实现, 利用了 Servlet 3.0 的异步支持:

	@WebServlet(asyncSupported = true, value = "/AsyncServlet")
	public class AsyncServlet extends HttpServlet {

	  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    addToWaitingList(request.startAsync());
	  }

	  private static ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);

	  static {
	    executorService.scheduleAtFixedRate(AsyncServlet::newEvent, 0, 2, TimeUnit.SECONDS);
	  }

	  private static void newEvent() {
	    ArrayList clients = new ArrayList<>(queue.size());
	    queue.drainTo(clients);
	    clients.parallelStream().forEach((AsyncContext ac) -> {
	      ServletUtil.writeResponse(ac.getResponse(), "OK");
	      ac.complete();
	    });
	  }

	  private static final BlockingQueue queue = new ArrayBlockingQueue<>(20000);

	  public static void addToWaitingList(AsyncContext c) {
	    queue.add(c);
	  }
	}



This bit of code is a little more complex, so maybe before we start digging into solution details, I can outline that this solution performed ~5x better latency- and ~5x better throughput-wise. Equipped with the knowledge of such results, you should be more motivated to understand what is actually going on in the second example.

上面的代码稍微复杂了一点点, 所以在深入介绍解决方案的细节前, 我可以描述个大概, 这个解决方案的表现是 延迟只有原来的1/5; 而吞吐量也得到了 5x 的提升. 对于这样的结果, 你应该更加主动地去理解第二个例子。

The servlet’s doGet itself looks truly simple. Two facts are worth outlining though, the first of which declares the servlet to support asynchronous method invocations:

servlet 的 doGet 方法看起来很简单。有两个地方值得提一下:

一是声明 servlet 支持异步方法调用:

	@WebServlet(asyncSupported = true, value = "/AsyncServlet")


The second important aspect is hidden in the following method


二是在下面的方法中所隐藏的细节:

	  public static void addToWaitingList(AsyncContext c) {
	    queue.add(c);
	  }


in which the whole request processing consists only of storing an instance AsyncContext into some queue. This AsyncContext holds the request and response that were provided by the container and we can use later to answer the user request. Thus incoming requests are waiting for the notification – this could be an updated bid on the monitored auction or the next message in the group chat. The important aspect here is that servlet container’s threads have finished with doGet for the time being and are free to accept another requests.

整个请求的处理,就只是将 AsyncContext 实例添加到一个队列中. AsyncContext 持有容器提供的 request 和 response 对象, 我们可以通过他们来响应用户的请求. 因此传入的请求在等待通知 —— 可能是需要监视的拍卖组中的一个报价更新事件, 或者是下一条聊天信息. 这里面需要注意的是, 将 AsyncContext 加入队列之后, servlet 容器的线程就完成了 doGet 操作, 然后释放出来, 可以接受另一个请求。

Now, the notification arrives every 2 seconds and we have implemented this as a scheduled event, that calls the newEvent method every 2 seconds. When it arrives all the waiting tasks in the queue are processed by a single worker thread responsible for compiling and sending the responses. Instead of blocking hundreds of threads to wait behind the external notification, we achieved this in a lot simpler and cleaner way – batching the interest groups together and processing the requests in a single thread.

现在, 每2秒收到一次通知, 我们已经通过调度事件实现了, 每2秒调用一次 newEvent 方法. 当事件到达时,队列中的所有等待任务都由同一个 worker 线程来负责处理编译和发送响应. 而不是阻塞数以百计的线程来等待外部的通知, 我们通过更简单和优雅的方法实现了这点, 将感兴趣的组集中存放在一起, 由单个线程来处理这些请求。

And the results speak for themselves – the very same test on the very same Tomcat 8.0.30 with default configuration resulted in the following:

结果不言自明, 在同一台 Tomcat 8.0.30 服务器的默认配置了下, 相同的测试跑出了以下成绩:


- Average response time: 1,875 ms
- Minimum response time: 356 ms
- Maximum response time: 2,326 ms
- Throughput: 939 requests/second

- 平均响应时间: 1,875 ms
- 最小响应时间: 356 ms
- 最大响应时间: 2,326 ms
- 吞吐量: 939 个请求/秒



The specific case here is small and synthetic, but similar improvements are achievable in the real-world applications.

虽然这个示例是手工构造的, 但类似的性能提升在现实世界中却是能实现的。

Now, before you run to rewrite all your servlets to the asynchronous servlets – hold your horses for a minute. The solution works perfectly on a subset of usage cases, such as group chat notifications and auction house price alerts. You will most likely not benefit in the cases where the requests are waiting behind unique database queries being completed. So, as always, I must reiterate my favorite performance-related recommendation – measure everything. Do not guess anything.

现在,在你运行重写所有的servlet异步servlet -一分钟你要沉住气.解决方案能工作的一个子集上的使用情况下,如群组聊天通知和拍卖行价格警报.很可能没有好处的情况下,请求等待背后独特的数据库查询完成.所以,像往常一样,我必须重申我最喜欢绩效建议——衡量一切。不要想任何事情。

But on the occasions when the problem does fit the solution shape, I can only praise it. Besides the now-obvious improvements on throughput and latency, we have elegantly avoided possible thread starvation issues under heavy load.

但在场合问题是否符合方案的形状时,我只能赞美它.除了now-obvious改进吞吐量和延迟,我们优雅负载较重的情况下,避免可能的线程饥饿问题。


Another important aspect – the approach to asynchronous request processing is finally standardized. Independent of your favorite Servlet API 3.0 – compliant application server such as Tomcat 7+, JBoss 6 or Jetty 8+ – you can be sure the approach works. No more wrestling with different Comet implementations or platform-dependent solutions, such as the Weblogic FutureResponseServlet.


另一个重要方面——异步请求处理方法终于标准化。独立于你最喜欢的Servlet API 3.0 -兼容的应用服务器,比如Tomcat 7 +,JBoss或Jetty 6 8 +——你可以确定作品的方法.不再摔跤与不同的Comet实现或与平台相关的解决方案,比如Weblogic FutureResponseServlet。





原文链接: [https://plumbr.eu/blog/java/how-to-use-asynchronous-servlets-to-improve-performance](https://plumbr.eu/blog/java/how-to-use-asynchronous-servlets-to-improve-performance)

