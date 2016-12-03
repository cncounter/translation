#How to use Asynchronous Servlets to improve performance

#如何使用异步servlet来提高性能

ince we have post this article we have received a lot of feedback about it. Based on this feedback we have updated the examples to make them easier to understand and, hopefully, clarify any doubts in their correctness.

因斯我们发布这篇文章我们已经收到很多反馈.基于这个反馈我们更新了例子来让他们更容易理解,希望澄清任何怀疑其正确性。


This post is going to describe a performance optimization technique applicable to a common problem related to modern webapps. Applications nowadays are no longer just passively waiting for browsers to initiate requests, they want to start  communication themselves. A typical example would involve chat applications, auction houses etc – the common denominator being the fact that most of the time the connections with the browser are idle and wait for a certain event being triggered.

这篇文章将描述一个性能优化技术适用于现代webapps相关的一个常见问题.应用程序现在不再只是被动地等待浏览器发起请求,他们想开始沟通.一个典型的例子包括聊天应用程序,拍卖行等——的公分母,大部分时间与浏览器的连接处于空闲状态,等待某个事件被触发。


This type of applications has developed a problem class of their own, especially when facing heavy load. The symptoms include starving threads, suffering user interaction, staleness issues etc.

这种类型的应用程序已经开发了一个类的问题,尤其是当面临沉重的负担。症状包括饥饿的线程,用户交互、腐败问题等。


Based on recent experience with this type of apps under load, I thought it would be a good time to demonstrate a simple solution. After Servlet API 3.0 implementations became mainstream, the solution has become truly simple, standardized and elegant.

基于最近的经验,这种类型的应用程序负载下,我认为这是一个很好的时间来演示一个简单的解决方案。Servlet API后3.0实现成为主流,解决方案已经成为真正的简单、标准化和优雅。


But before we jump into demonstrating the solution, we should understand the problem in greater detail. What could be easier for our readers than to explain the problem with the help of some source code:

但是在我们跳进展示解决方案之前,我们应该了解更详细的问题.还有什么比解释更容易为我们的读者的问题的帮助一些源代码:


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

servlet以上描述的一个例子是一个应用程序可能看起来像:


- Every 2 seconds some event happens. E.g. stock quote arrives, chat is updated and so on.
- End-user request arrives, announcing interest to monitor certain events
- The thread is blocked until the next event arrives
- Upon receiving the event, the response is compiled and sent back to the client

- 后者some洽购。2境内的活动中提出的问题例如,某些了库存有最新和na猫is。
- 终端用户请求到达时,宣布对监视某些事件
- 线程被阻塞,直到下一个事件的到来
- 在接收事件时,反应是编译和发送回客户端


Let me explain this waiting aspect. We have some external event that happens every 2 seconds. When new request from end-user arrives, it has to wait some time between 0 and 2000ms until next event. In order to keep it simple, we have emulated this waiting part with a call to Thread.sleep() for random number of ms between 0 and 2000. So every request waits on average for 1 second.

让我来解释一下这等方面。我们有一些外部事件发生的每2秒。从最终用户到新请求时,它必须等待一段时间在0和2000毫秒之间,直到下一个事件.为了保持简单,我们模仿这个部分通过调用thread . sleep()等待随机数的女士在0到2000之间。因此,每个请求的平均等待1秒。

Now – you might think this is a perfectly normal servlet. In many cases, you would be completely correct – there is nothing wrong with the code until the application faces significant load.

现在,你可能会认为这是一个完全正常的servlet。在很多情况下,你会完全正确——与代码没有错,直到应用程序面临重大的负担。

In order to simulate this load I created a fairly simple test with some help from JMeter, where I launched 2,000 threads, each running through 10 iterations of bombarding the application with requests to the /BlockedServlet. Running the test with the deployed servlet on an out-of-the-box Tomcat 8.0.30 I got the following results:

为了模拟这种负载我创建了一个相当简单的测试在JMeter的帮助下,我推出了2000个线程,每个贯穿10迭代的轰击应用程序请求/ BlockedServlet。运行测试与部署servlet开箱即用的Tomcat 8.0.30我得到以下结果:


- Average response time: 9,492 ms
- Minimum response time: 205 ms
- Maximum response time: 11,368 ms
- Throughput: 195 requests/second

- 平均响应时间:9492 ms
- 最小响应时间:205 ms
- 最大响应时间:11368 ms
- 吞吐量:195 /秒的请求


The default Tomcat configuration has got 200 worker threads which, coupled with the fact that the simulated work is replaced with the sleep cycle of average duration of 1000ms, explains nicely the throughput number – in each second the 200 threads should be able to complete 200 sleep cycles, 1 second on average each. Adding context switch costs on top of this, the achieved throughput of 195 requests/second is pretty close to our expectations.

默认的Tomcat配置有200工作线程,再加上模拟工作这一事实被替换为1000 ms的睡眠周期的平均持续时间,很好地解释了吞吐量-在每秒钟200线程数量应该能够完成200的睡眠周期,平均1秒.除此之外,增加了上下文切换成本实现吞吐量195个请求/秒很接近我们的预期。


The throughput itself would not look too bad for 99.9% of the applications out there. However, looking at the maximum and especially average response times the problem starts to look more serious. Getting the worst case response in 11 seconds instead of the expected 2 seconds is a sure way to annoy your users.

吞吐量本身看上去不会太坏为99.9%的应用程序。然而,看着最大,尤其是平均响应时间问题开始看起来更严重.在11秒内得到最坏的情况下反应而不是预期的2秒是一个可靠的方式来骚扰你的用户。


Let us now take a look at an alternative implementation, taking advantage of the Servlet API 3.0 asynchronous support:

现在让我们看一下另一种实现,利用Servlet API 3.0异步支持:

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

这一点代码更复杂,所以在我们开始挖掘解决方案细节之前,我可以轮廓,这个解决方案执行~ 5 x更好的延迟和~ 5 x throughput-wise更好.配备的知识这样的结果,你应该更加主动地理解实际上是第二个例子。

The servlet’s doGet itself looks truly simple. Two facts are worth outlining though, the first of which declares the servlet to support asynchronous method invocations:

servlet的doGet本身看起来真的简单。两个事实价值概述,第一个宣布servlet支持异步方法调用:

	@WebServlet(asyncSupported = true, value = "/AsyncServlet")




The second important aspect is hidden in the following method

第二个重要的方面是隐藏在下面的方法

	  public static void addToWaitingList(AsyncContext c) {
	    queue.add(c);
	  }




in which the whole request processing consists only of storing an instance AsyncContext into some queue. This AsyncContext holds the request and response that were provided by the container and we can use later to answer the user request. Thus incoming requests are waiting for the notification – this could be an updated bid on the monitored auction or the next message in the group chat. The important aspect here is that servlet container’s threads have finished with doGet for the time being and are free to accept another requests.

在整个请求处理由只有AsyncContext实例存储到一些队列.这AsyncContext持有的请求和响应容器提供的,我们可以使用后回答用户请求.因此传入的请求正在等待通知——这可能是一个更新的报价组中的监控拍卖或者下一条消息聊天.这里的重要方面是,servlet容器的线程完成doGet暂时和免费接受另一个请求。

Now, the notification arrives every 2 seconds and we have implemented this as a scheduled event, that calls the newEvent method every 2 seconds. When it arrives all the waiting tasks in the queue are processed by a single worker thread responsible for compiling and sending the responses. Instead of blocking hundreds of threads to wait behind the external notification, we achieved this in a lot simpler and cleaner way – batching the interest groups together and processing the requests in a single thread.

现在,通知到每2秒,我们实现了这个预定事件,调用newEvent方法每2秒.当它到达队列中的所有等待的任务由一个工作线程负责处理编译和发送响应.而不是阻塞数以百计的线程等待外部的通知,我们实现这个在很多简单的清洁方法,批处理利益集团在一起并在一个线程处理的请求。

And the results speak for themselves – the very same test on the very same Tomcat 8.0.30 with default configuration resulted in the following:

结果不言自明,同一测试在同一Tomcat 8.0.30默认配置了以下:


- Average response time: 1,875 ms
- Minimum response time: 356 ms
- Maximum response time: 2,326 ms
- Throughput: 939 requests/second

- 平均响应时间:1875 ms
- 最小响应时间:356 ms
- 最大响应时间:2326 ms
- 吞吐量:939 /秒的请求



The specific case here is small and synthetic, but similar improvements are achievable in the real-world applications.

具体情况是小和合成,但类似的改进实现在现实世界的应用。

Now, before you run to rewrite all your servlets to the asynchronous servlets – hold your horses for a minute. The solution works perfectly on a subset of usage cases, such as group chat notifications and auction house price alerts. You will most likely not benefit in the cases where the requests are waiting behind unique database queries being completed. So, as always, I must reiterate my favorite performance-related recommendation – measure everything. Do not guess anything.

现在,在你运行重写所有的servlet异步servlet -一分钟你要沉住气.解决方案能工作的一个子集上的使用情况下,如群组聊天通知和拍卖行价格警报.很可能没有好处的情况下,请求等待背后独特的数据库查询完成.所以,像往常一样,我必须重申我最喜欢绩效建议——衡量一切。不要想任何事情。

But on the occasions when the problem does fit the solution shape, I can only praise it. Besides the now-obvious improvements on throughput and latency, we have elegantly avoided possible thread starvation issues under heavy load.

但在场合问题是否符合方案的形状时,我只能赞美它.除了now-obvious改进吞吐量和延迟,我们优雅负载较重的情况下,避免可能的线程饥饿问题。


Another important aspect – the approach to asynchronous request processing is finally standardized. Independent of your favorite Servlet API 3.0 – compliant application server such as Tomcat 7+, JBoss 6 or Jetty 8+ – you can be sure the approach works. No more wrestling with different Comet implementations or platform-dependent solutions, such as the Weblogic FutureResponseServlet.


另一个重要方面——异步请求处理方法终于标准化。独立于你最喜欢的Servlet API 3.0 -兼容的应用服务器,比如Tomcat 7 +,JBoss或Jetty 6 8 +——你可以确定作品的方法.不再摔跤与不同的Comet实现或与平台相关的解决方案,比如Weblogic FutureResponseServlet。





原文链接: [https://plumbr.eu/blog/java/how-to-use-asynchronous-servlets-to-improve-performance](https://plumbr.eu/blog/java/how-to-use-asynchronous-servlets-to-improve-performance)

