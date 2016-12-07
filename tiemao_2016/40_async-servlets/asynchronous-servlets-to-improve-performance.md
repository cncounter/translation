#How to use Asynchronous Servlets to improve performance

# 使用异步servlet提升性能

Since we have post this article we have received a lot of feedback about it. Based on this feedback we have updated the examples to make them easier to understand and, hopefully, clarify any doubts in their correctness.

本文发布之后, 收到了很多的反馈。基于这些反馈,我们更新了文中的示例,使读者更容易理解和掌握, 如果您发现错误和遗漏,希望能给我们提交反馈,帮助我们改进。


This post is going to describe a performance optimization technique applicable to a common problem related to modern webapps. Applications nowadays are no longer just passively waiting for browsers to initiate requests, they want to start  communication themselves. A typical example would involve chat applications, auction houses etc – the common denominator being the fact that most of the time the connections with the browser are idle and wait for a certain event being triggered.

本文针对当今 webapp 中一种常碰到的问题，介绍相应的性能优化解决方案。如今的WEB程序不再只是被动地等待浏览器的请求, 他们之间也会互相进行通信。 典型的场景包括 在线聊天, 实时拍卖等 —— 后台程序大部分时间与浏览器的连接处于空闲状态, 并等待某个事件被触发。


This type of applications has developed a problem class of their own, especially when facing heavy load. The symptoms include starving threads, suffering user interaction, staleness issues etc.

这些应用引发了一类新的问题,特别是在负载较高的情况下。引发的状况包括线程饥饿, 影响用户体验、请求超时等问题。


Based on recent experience with this type of apps under load, I thought it would be a good time to demonstrate a simple solution. After Servlet API 3.0 implementations became mainstream, the solution has become truly simple, standardized and elegant.

基于这类应用在高负载下的实践, 我会介绍一种简单的解决方案。在 Servlet 3.0成为主流以后, 这是一种真正简单、标准化并且十分优雅的解决方案。


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



Let me explain this waiting aspect. We have some external event that happens every 2 seconds. When new request from end-user arrives, it has to wait some time between 0 and 2000ms until next event. In order to keep it simple, we have emulated this waiting part with a call to Thread.sleep() for random number of ms between 0 and 2000. So every request waits on average for 1 second.

下面解释一下这个等待场景。 我们的系统, 每2秒触发一次外部事件。当收到用户请求时, 需要等待一段时间，大约是 0 到 2000 毫秒之间, 直到下一次事件发生. 为了演示的需要, 此处通过调用 `Thread.sleep()` 来模拟随机的等待时间。平均每个请求等待1秒左右。

Now – you might think this is a perfectly normal servlet. In many cases, you would be completely correct – there is nothing wrong with the code until the application faces significant load.

现在,你可能会觉得这是一个十分普通的servlet。在多数情况下,确实是这样 —— 代码并没有错误, 但如果系统面临大量的并发负载时就会力不从心了。

In order to simulate this load I created a fairly simple test with some help from JMeter, where I launched 2,000 threads, each running through 10 iterations of bombarding the application with requests to the /BlockedServlet. Running the test with the deployed servlet on an out-of-the-box Tomcat 8.0.30 I got the following results:

为了模拟这种负载,我用 JMeter 创建了一个简单的测试, 启动 2000 个线程, 每个线程执行 10 次请求来进行系统压力测试。 

请求的URI为 `/BlockedServlet`,  部署在 Tomcat 8.0.30 默认配置下, 测试结果如下:


- Average response time: 9,492 ms
- Minimum response time: 205 ms
- Maximum response time: 11,368 ms
- Throughput: 195 requests/second

<br/>

- 平均响应时间: 9,492 ms
- 最小响应时间: 205 ms
- 最大响应时间: 11,368 ms
- 吞吐量: 195 个请求/秒


The default Tomcat configuration has got 200 worker threads which, coupled with the fact that the simulated work is replaced with the sleep cycle of average duration of 1000ms, explains nicely the throughput number – in each second the 200 threads should be able to complete 200 sleep cycles, 1 second on average each. Adding context switch costs on top of this, the achieved throughput of 195 requests/second is pretty close to our expectations.

Tomcat 默认配置的是 200个 worker 线程, 再加上模拟的工作量(平均线程休眠 1000 ms ), 很好地解释了吞吐量数据 -  200 个线程每秒应该能够完成200次执行周期, 平均1秒钟左右. 但有一些上下文切换的成本, 所以吞吐量为 195个请求/秒, 很符合我们的预期。


The throughput itself would not look too bad for 99.9% of the applications out there. However, looking at the maximum and especially average response times the problem starts to look more serious. Getting the worst case response in 11 seconds instead of the expected 2 seconds is a sure way to annoy your users.

对 99.9% 的应用来说, 这个吞吐量数据看上去也很正常。但看看最大响应时间, 以及平均响应时间， 就会发现问题实在是太严重了。  在最坏情况下客户端居然需要11秒才能得到响应, 而预期是2秒,这对用户来说一点都不友好。


Let us now take a look at an alternative implementation, taking advantage of the Servlet API 3.0 asynchronous support:

下面我们看另一种实现, 使用了 Servlet 3.0 的异步特性:

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

上面的代码稍微有一点复杂, 所以我先透露一下此方案的性能表现: 响应延迟(latency)只有原来的1/5; 而吞吐量(throughput-wise)也提升了 5 倍。 看到这样的结果, 你肯定想深入了解第二种方案了吧。

The servlet’s doGet itself looks truly simple. Two facts are worth outlining though, the first of which declares the servlet to support asynchronous method invocations:

servlet 的 `doGet` 方法看起来很简单。有两个地方值得提一下:

一是声明 servlet,以及支持异步方法调用:

	@WebServlet(asyncSupported = true, value = "/AsyncServlet")


The second important aspect is hidden in the following method


二是方法 `addToWaitingList` 中的细节:

	  public static void addToWaitingList(AsyncContext c) {
	    queue.add(c);
	  }


in which the whole request processing consists only of storing an instance AsyncContext into some queue. This AsyncContext holds the request and response that were provided by the container and we can use later to answer the user request. Thus incoming requests are waiting for the notification – this could be an updated bid on the monitored auction or the next message in the group chat. The important aspect here is that servlet container’s threads have finished with doGet for the time being and are free to accept another requests.

在其中, 整个请求的处理只有一行代码,将 AsyncContext 实例加入队列中。 AsyncContext 里含有容器提供的 request 和 response 对象, 我们可以通过他们来响应用户请求. 因此传入的请求在等待通知 —— 可能是监视的拍卖组中的报价更新事件, 或者是下一条群聊消息。这里需要注意的是, 将 AsyncContext 加入队列以后, servlet 容器的线程就完成了 ·doGet· 操作, 然后释放出来, 可以去接受另一个新请求了。

Now, the notification arrives every 2 seconds and we have implemented this as a scheduled event, that calls the newEvent method every 2 seconds. When it arrives all the waiting tasks in the queue are processed by a single worker thread responsible for compiling and sending the responses. Instead of blocking hundreds of threads to wait behind the external notification, we achieved this in a lot simpler and cleaner way – batching the interest groups together and processing the requests in a single thread.

现在, 系统通知每2秒到达一次, 当然这部分我们通过 `static` 块中的调度事件实现了, 每2秒会执行一次 newEvent 方法. 当通知到来时, 队列中所有在等待的请求都由同一个 worker 线程负责处理并发送响应消息。 这次的代码, 没有阻塞几百个线程来等待外部事件通知, 而是用更简洁明了的方法来实现了, 把感兴趣的请求放在一个group中, 由单个线程进行批量处理。

And the results speak for themselves – the very same test on the very same Tomcat 8.0.30 with default configuration resulted in the following:

结果不用说, 在同样的配置下, Tomcat 8.0.30 服务器跑出了以下测试结果:


- Average response time: 1,875 ms
- Minimum response time: 356 ms
- Maximum response time: 2,326 ms
- Throughput: 939 requests/second

<br/>

- 平均响应时间: 1,875 ms
- 最小响应时间: 356 ms
- 最大响应时间: 2,326 ms
- 吞吐量: 939 个请求/秒



The specific case here is small and synthetic, but similar improvements are achievable in the real-world applications.

虽然示例是手工构造的, 但类似的性能提升在现实世界中却是很普遍的。

Now, before you run to rewrite all your servlets to the asynchronous servlets – hold your horses for a minute. The solution works perfectly on a subset of usage cases, such as group chat notifications and auction house price alerts. You will most likely not benefit in the cases where the requests are waiting behind unique database queries being completed. So, as always, I must reiterate my favorite performance-related recommendation – measure everything. Do not guess anything.

现在, 请不要急着去将所有的 servlet 重构为异步servlet。 因为这种方案, 只在满足某些特征的任务才会得到大量性能提升, 比如聊天室, 或者拍卖价格提醒之类的。 而对于需要请求底层数据库之类的操作, 很可能没有性能提升。 所以,就像以前一样, 我必须重申, 我最喜欢的性能优化忠告 —— 请权衡考虑整件事情，不要想当然。

But on the occasions when the problem does fit the solution shape, I can only praise it. Besides the now-obvious improvements on throughput and latency, we have elegantly avoided possible thread starvation issues under heavy load.

但如果确实符合此方案适应的情景, 那我就恭喜你啦！ 不仅能明显改进吞吐量和延迟, 还能在大量的并发压力下表现出色, 避免可能的线程饥饿问题。


Another important aspect – the approach to asynchronous request processing is finally standardized. Independent of your favorite Servlet API 3.0 – compliant application server such as Tomcat 7+, JBoss 6 or Jetty 8+ – you can be sure the approach works. No more wrestling with different Comet implementations or platform-dependent solutions, such as the Weblogic FutureResponseServlet.


另一个重要信息是 —— 异步请求的处理终于标准化了。兼容 Servlet 3.0 的应用服务器 —— 比如 Tomcat 7+, JBoss 6 或者 Jetty 8+ —— 都支持这种方案. 再也不用陷进那些耦合具体平台的解决方案里, 例如 Weblogic `FutureResponseServlet`。




原文链接: [https://plumbr.eu/blog/java/how-to-use-asynchronous-servlets-to-improve-performance](https://plumbr.eu/blog/java/how-to-use-asynchronous-servlets-to-improve-performance)

