# Non-blocking I/O using Servlet 3.1: Scalable applications using Java EE 7 (TOTD #188)


Servlet 3.0 allowed asynchronous request processing but only traditional I/O was permitted. This can restrict scalability of your applications. In a typical application, ServletInputStream is read in a while loop.


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

This is resolved in Servet 3.1 ([JSR 340](http://jcp.org/en/jsr/detail?id=340), to be released as part Java EE 7) by adding [event listeners](http://docs.oracle.com/javase/7/docs/api/java/util/EventListener.html) - `ReadListener` and `WriteListener` interfaces. These are then registered using `ServletInputStream.setReadListener` and `ServletOutputStream.setWriteListener`. The listeners have callback methods that are invoked when the content is available to be read or can be written without blocking.


The updated `doGet` in our case will look like:


	AsyncContext context = request.startAsync();
	ServletInputStream input = request.getInputStream();
	input.setReadListener(new MyReadListener(input, context));

Invoking **setXXXListener** methods indicate that non-blocking I/O is used instead of the traditional I/O. At most one `ReadListener` can be registered on `ServletIntputStream` and similarly at most one WriteListener can be registered on **ServletOutputStream**. `ServletInputStream.isReady` and `ServletInputStream.isFinished` are new methods to check the status of non-blocking I/O read. `ServletOutputStream.canWrite` is a new method to check if data can be written without blocking.

`MyReadListener` implementation looks like:

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


* `onDataAvailable` callback method is called whenever data can be read without blocking
* `onAllDataRead` callback method is invoked data for the current request is completely read.
* `onError` callback is invoked if there is an error processing the request.


Notice, `context.complete()` is called in `onAllDataRead` and `onError` to signal the completion of data read.

For now, the first chunk of available data need to be read in the `doGet` or `service` method of the Servlet. Rest of the data can be read in a non-blocking way using `ReadListener` after that. This is going to get cleaned up where all data read can happen in `ReadListener` only.

The sample explained above can be downloaded [from here](https://blogs.oracle.com/arungupta/resource/totd188-nonblocking.zip) and works with [GlassFish 4.0 build 64](http://dlc.sun.com.edgesuite.net/glassfish/4.0/promoted/glassfish-4.0-b64.zip) and [onwards](http://dlc.sun.com.edgesuite.net/glassfish/4.0/promoted/).

The slides and a complete re-run of [What's new in Servlet 3.1](https://oracleus.activeevents.com/connect/sessionDetail.ww?SESSION_ID=6793): An Overview session at JavaOne is available [here](https://oracleus.activeevents.com/connect/sessionDetail.ww?SESSION_ID=6793).

Here are some more references for you:


* [Java EE 7 Specification Status](https://wikis.oracle.com/display/GlassFish/PlanForGlassFish4.0#PlanForGlassFish4.0-SpecificationStatus)
* [Servlet Specification Project](http://java.net/projects/servlet-spec/)
* [JSR Expert Group Discussion Archive](http://java.net/projects/servlet-spec/lists/users/archive)
* [Servlet 3.1 Javadocs](http://java.net/projects/servlet-spec/downloads/download/Early%20Draft%20Review/javax.servlet-api-3.0.99-SNAPSHOT-javadoc.jar)









[https://blogs.oracle.com/arungupta/entry/non_blocking_i_o_using](https://blogs.oracle.com/arungupta/entry/non_blocking_i_o_using)


 2012-11-27

