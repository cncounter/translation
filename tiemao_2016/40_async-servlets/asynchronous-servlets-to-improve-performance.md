#How to use Asynchronous Servlets to improve performance


ince we have post this article we have received a lot of feedback about it. Based on this feedback we have updated the examples to make them easier to understand and, hopefully, clarify any doubts in their correctness.

This post is going to describe a performance optimization technique applicable to a common problem related to modern webapps. Applications nowadays are no longer just passively waiting for browsers to initiate requests, they want to start  communication themselves. A typical example would involve chat applications, auction houses etc – the common denominator being the fact that most of the time the connections with the browser are idle and wait for a certain event being triggered.

This type of applications has developed a problem class of their own, especially when facing heavy load. The symptoms include starving threads, suffering user interaction, staleness issues etc.

Based on recent experience with this type of apps under load, I thought it would be a good time to demonstrate a simple solution. After Servlet API 3.0 implementations became mainstream, the solution has become truly simple, standardized and elegant.

But before we jump into demonstrating the solution, we should understand the problem in greater detail. What could be easier for our readers than to explain the problem with the help of some source code:



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

- Every 2 seconds some event happens. E.g. stock quote arrives, chat is updated and so on.
- End-user request arrives, announcing interest to monitor certain events
- The thread is blocked until the next event arrives
- Upon receiving the event, the response is compiled and sent back to the client



Let me explain this waiting aspect. We have some external event that happens every 2 seconds. When new request from end-user arrives, it has to wait some time between 0 and 2000ms until next event. In order to keep it simple, we have emulated this waiting part with a call to Thread.sleep() for random number of ms between 0 and 2000. So every request waits on average for 1 second.


Now – you might think this is a perfectly normal servlet. In many cases, you would be completely correct – there is nothing wrong with the code until the application faces significant load.


In order to simulate this load I created a fairly simple test with some help from JMeter, where I launched 2,000 threads, each running through 10 iterations of bombarding the application with requests to the /BlockedServlet. Running the test with the deployed servlet on an out-of-the-box Tomcat 8.0.30 I got the following results:



- Average response time: 9,492 ms
- Minimum response time: 205 ms
- Maximum response time: 11,368 ms
- Throughput: 195 requests/second



The default Tomcat configuration has got 200 worker threads which, coupled with the fact that the simulated work is replaced with the sleep cycle of average duration of 1000ms, explains nicely the throughput number – in each second the 200 threads should be able to complete 200 sleep cycles, 1 second on average each. Adding context switch costs on top of this, the achieved throughput of 195 requests/second is pretty close to our expectations.

The throughput itself would not look too bad for 99.9% of the applications out there. However, looking at the maximum and especially average response times the problem starts to look more serious. Getting the worst case response in 11 seconds instead of the expected 2 seconds is a sure way to annoy your users.

Let us now take a look at an alternative implementation, taking advantage of the Servlet API 3.0 asynchronous support:


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


The servlet’s doGet itself looks truly simple. Two facts are worth outlining though, the first of which declares the servlet to support asynchronous method invocations:


	@WebServlet(asyncSupported = true, value = "/AsyncServlet")


The second important aspect is hidden in the following method


	  public static void addToWaitingList(AsyncContext c) {
	    queue.add(c);
	  }


in which the whole request processing consists only of storing an instance AsyncContext into some queue. This AsyncContext holds the request and response that were provided by the container and we can use later to answer the user request. Thus incoming requests are waiting for the notification – this could be an updated bid on the monitored auction or the next message in the group chat. The important aspect here is that servlet container’s threads have finished with doGet for the time being and are free to accept another requests.


Now, the notification arrives every 2 seconds and we have implemented this as a scheduled event, that calls the newEvent method every 2 seconds. When it arrives all the waiting tasks in the queue are processed by a single worker thread responsible for compiling and sending the responses. Instead of blocking hundreds of threads to wait behind the external notification, we achieved this in a lot simpler and cleaner way – batching the interest groups together and processing the requests in a single thread.


And the results speak for themselves – the very same test on the very same Tomcat 8.0.30 with default configuration resulted in the following:


- Average response time: 1,875 ms
- Minimum response time: 356 ms
- Maximum response time: 2,326 ms
- Throughput: 939 requests/second


The specific case here is small and synthetic, but similar improvements are achievable in the real-world applications.


Now, before you run to rewrite all your servlets to the asynchronous servlets – hold your horses for a minute. The solution works perfectly on a subset of usage cases, such as group chat notifications and auction house price alerts. You will most likely not benefit in the cases where the requests are waiting behind unique database queries being completed. So, as always, I must reiterate my favorite performance-related recommendation – measure everything. Do not guess anything.


But on the occasions when the problem does fit the solution shape, I can only praise it. Besides the now-obvious improvements on throughput and latency, we have elegantly avoided possible thread starvation issues under heavy load.

Another important aspect – the approach to asynchronous request processing is finally standardized. Independent of your favorite Servlet API 3.0 – compliant application server such as Tomcat 7+, JBoss 6 or Jetty 8+ – you can be sure the approach works. No more wrestling with different Comet implementations or platform-dependent solutions, such as the Weblogic FutureResponseServlet.



原文链接: [https://plumbr.eu/blog/java/how-to-use-asynchronous-servlets-to-improve-performance](https://plumbr.eu/blog/java/how-to-use-asynchronous-servlets-to-improve-performance)

