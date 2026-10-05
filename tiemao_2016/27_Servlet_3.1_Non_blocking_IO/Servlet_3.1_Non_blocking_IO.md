# 使用 Servlet 3.1 实现非阻塞 I/O: 基于 Java EE 7 的可伸缩应用 (TOTD #188)

> 原文标题: Non-blocking I/O using Servlet 3.1: Scalable applications using Java EE 7 (TOTD #188)


Servlet 3.0 allowed asynchronous request processing but only traditional I/O was permitted. This can restrict scalability of your applications. In a typical application, ServletInputStream is read in a while loop.

Servlet 3.0 允许异步请求处理，但只允许使用传统的 I/O。这会限制应用程序的可伸缩性(scalability)。在典型的应用中，`ServletInputStream` 是在一个 while 循环中读取的。


	public class TestServlet extends HttpServlet {
	    protected void doGet(HttpServletRequest request, HttpServletResponse response)
		 throws IOException, ServletException {     
	 ServletInputStream input = request.getInputStream();
	       byte[] b = new byte[1024];
	       int len = -1;
	       while ((len = input.read(b)) != -1) {
		  . . . 
	       }
	   }
	}


If the incoming data is blocking or streamed slower than the server can read then the server thread is waiting for that data. The same can happen if the data is written to `ServletOutputStream`.

如果传入的数据是阻塞的，或者数据流的速度比服务器读取的速度慢，那么服务器线程就会一直等待这些数据。将数据写入 `ServletOutputStream` 时也会发生同样的情况。

This is resolved in Servet 3.1 ([JSR 340](http://jcp.org/en/jsr/detail?id=340), to be released as part Java EE 7) by adding [event listeners](http://docs.oracle.com/javase/7/docs/api/java/util/EventListener.html) - `ReadListener` and `WriteListener` interfaces. These are then registered using `ServletInputStream.setReadListener` and `ServletOutputStream.setWriteListener`. The listeners have callback methods that are invoked when the content is available to be read or can be written without blocking.

这个问题在 Servlet 3.1 中得到了解决（[JSR 340](http://jcp.org/en/jsr/detail?id=340)，将作为 Java EE 7 的一部分发布），办法是新增[事件监听器](http://docs.oracle.com/javase/7/docs/api/java/util/EventListener.html)——`ReadListener` 和 `WriteListener` 接口。然后使用 `ServletInputStream.setReadListener` 和 `ServletOutputStream.setWriteListener` 来注册它们。这些监听器带有回调方法，当内容可读、或可以在不阻塞的情况下写入时，就会调用这些回调。


The updated `doGet` in our case will look like:

在本例中，更新后的 `doGet` 大致如下:


	AsyncContext context = request.startAsync();
	ServletInputStream input = request.getInputStream();
	input.setReadListener(new MyReadListener(input, context));

Invoking **setXXXListener** methods indicate that non-blocking I/O is used instead of the traditional I/O. At most one `ReadListener` can be registered on `ServletIntputStream` and similarly at most one WriteListener can be registered on **ServletOutputStream**. `ServletInputStream.isReady` and `ServletInputStream.isFinished` are new methods to check the status of non-blocking I/O read. `ServletOutputStream.canWrite` is a new method to check if data can be written without blocking.

调用 **setXXXListener** 方法表示使用的是非阻塞 I/O，而不是传统的 I/O。在 `ServletInputStream` 上最多只能注册一个 `ReadListener`，同样地，在 **ServletOutputStream** 上最多也只能注册一个 `WriteListener`。`ServletInputStream.isReady` 和 `ServletInputStream.isFinished` 是新增的方法，用于检查非阻塞 I/O 读取的状态。`ServletOutputStream.canWrite` 是新增的方法，用于检查数据能否在不阻塞的情况下写入。

`MyReadListener` implementation looks like:

`MyReadListener` 的实现大致如下:

	@Override
	public void onDataAvailable() {
	 try {
	 StringBuilder sb = new StringBuilder();
	 int len = -1;
	 byte b[] = new byte[1024];
	 while (input.isReady()
	 && (len = input.read(b)) != -1) {
	 String data = new String(b, 0, len);
	 System.out.println("--> " + data);
	 }
	 } catch (IOException ex) {
	 Logger.getLogger(MyReadListener.class.getName()).log(Level.SEVERE, null, ex);
	 }
	}

	@Override
	public void onAllDataRead() {
	 System.out.println("onAllDataRead");
	 context.complete();
	}

	@Override
	public void onError(Throwable t) {
	 t.printStackTrace();
	 context.complete();
	}


This implementation has three callbacks:

这个实现包含三个回调:

* `onDataAvailable` callback method is called whenever data can be read without blocking
  （只要数据可以非阻塞地读取，就会调用 `onDataAvailable` 回调方法）
* `onAllDataRead` callback method is invoked data for the current request is completely read.
  （当当前请求的数据被完全读取后，就会调用 `onAllDataRead` 回调方法）
* `onError` callback is invoked if there is an error processing the request.
  （如果处理请求时发生错误，就会调用 `onError` 回调）


Notice, `context.complete()` is called in `onAllDataRead` and `onError` to signal the completion of data read.

注意，在 `onAllDataRead` 和 `onError` 中都调用了 `context.complete()`，用于表示数据读取已完成。

For now, the first chunk of available data need to be read in the `doGet` or `service` method of the Servlet. Rest of the data can be read in a non-blocking way using `ReadListener` after that. This is going to get cleaned up where all data read can happen in `ReadListener` only.

目前，第一块可用数据需要在 Servlet 的 `doGet` 或 `service` 方法中读取；之后，剩余的数据可以使用 `ReadListener` 以非阻塞的方式读取。这一点后续会被改进，使得所有数据的读取都可以只在 `ReadListener` 中完成。

The sample explained above can be downloaded [from here](https://blogs.oracle.com/arungupta/resource/totd188-nonblocking.zip) and works with [GlassFish 4.0 build 64](http://dlc.sun.com.edgesuite.net/glassfish/4.0/promoted/glassfish-4.0-b64.zip) and [onwards](http://dlc.sun.com.edgesuite.net/glassfish/4.0/promoted/).

上面讲解的示例可以从[这里](https://blogs.oracle.com/arungupta/resource/totd188-nonblocking.zip)下载，它适用于 [GlassFish 4.0 build 64](http://dlc.sun.com.edgesuite.net/glassfish/4.0/promoted/glassfish-4.0-b64.zip) 及[更高版本](http://dlc.sun.com.edgesuite.net/glassfish/4.0/promoted/)。

The slides and a complete re-run of [What's new in Servlet 3.1](https://oracleus.activeevents.com/connect/sessionDetail.ww?SESSION_ID=6793): An Overview session at JavaOne is available [here](https://oracleus.activeevents.com/connect/sessionDetail.ww?SESSION_ID=6793).

JavaOne 大会上 [What's new in Servlet 3.1](https://oracleus.activeevents.com/connect/sessionDetail.ww?SESSION_ID=6793)：An Overview 演讲的幻灯片和完整回放可以从[这里](https://oracleus.activeevents.com/connect/sessionDetail.ww?SESSION_ID=6793)获取。

Here are some more references for you:

以下是一些额外的参考资料:


* [Java EE 7 Specification Status](https://wikis.oracle.com/display/GlassFish/PlanForGlassFish4.0#PlanForGlassFish4.0-SpecificationStatus)
* [Servlet Specification Project](http://java.net/projects/servlet-spec/)
* [JSR Expert Group Discussion Archive](http://java.net/projects/servlet-spec/lists/users/archive)
* [Servlet 3.1 Javadocs](http://java.net/projects/servlet-spec/downloads/download/Early%20Draft%20Review/javax.servlet-api-3.0.99-SNAPSHOT-javadoc.jar)









[https://blogs.oracle.com/arungupta/entry/non_blocking_i_o_using](https://blogs.oracle.com/arungupta/entry/non_blocking_i_o_using)


 2012-11-27

