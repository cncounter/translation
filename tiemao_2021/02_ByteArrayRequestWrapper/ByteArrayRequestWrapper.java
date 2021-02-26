
import org.apache.commons.io.IOUtils;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.*;

/**
 * ByteArray方式缓存的HttpRequest;
 * 允许多次获取 InputStream/也就是Request Body
 */
// 不能继承 ContentCachingRequestWrapper; 有坑;
public class ByteArrayRequestWrapper extends HttpServletRequestWrapper {
  // 可以缓存 ByteArrayOutputStream;
  // 或者缓存 byte[]
  private ByteArrayOutputStream cachedBytes;

  // 构造函数; 也可以接收 ServletRequest 来强转
  public ByteArrayRequestWrapper(HttpServletRequest request) {
    super(request);
  }

  // 某些程序代码可能会多次调用这个方法
  // 普通的 HttpServletRequest 是不允许多次获取的；
  @Override
  public ServletInputStream getInputStream() throws IOException {
    if (cachedBytes == null)
      cacheInputStream();
    // 这里不能缓存 InputStream
    // 每次 getInputStream, 都必须new一个实例对象; 避免reset等操作
    return new CachedServletInputStream();
  }

  // 这个方法也需要覆写
  @Override
  public BufferedReader getReader() throws IOException {
    return new BufferedReader(new InputStreamReader(getInputStream()));
  }

  private void cacheInputStream() throws IOException {
    /* 缓存的目的是允许多次读取.
     * 这里使用了 org.apache.commons.io.IOUtils, 也可以使用其他方式
     */
    cachedBytes = new ByteArrayOutputStream();
    IOUtils.copy(super.getInputStream(), cachedBytes);
  }

  /* 需要实现 ServletInputStream; 这和 InputStream 还不一样 */
  public class CachedServletInputStream extends ServletInputStream {
    private ByteArrayInputStream input;

    public CachedServletInputStream() {
      /* 创建一个新的 ByteArrayInputStream;
         理论上应该是构造方法接收参数,
         但这是内部类,可以直接使用外层实例对象的属性.
       */
      input = new ByteArrayInputStream(cachedBytes.toByteArray());
    }

    /**
     * 如果 stream 中的所有数据都已经读取完毕, 则返回true; 否则返回false
     * 这里我们直接使用 ByteArrayInputStream 的可用字节数
     *
     * @return <code>true</code> when all data for this particular request
     * has been read, otherwise returns <code>false</code>.
     * @since Servlet 3.1
     */
    @Override
    public boolean isFinished() {
      return input.available() <= 0;
    }

    /**
     * 如果所有数据可以直接读取,不需要阻塞,则返回true;
     * 因为是 ByteArray, 都在内存,不需要阻塞。
     *
     * @return <code>true</code> if data can be obtained without blocking,
     * otherwise returns <code>false</code>.
     * @since Servlet 3.1
     */
    @Override
    public boolean isReady() {
      return true;
    }

    /**
     * 回调监听器; 暂时不实现
     * @since Servlet 3.1
     */
    @Override
    public void setReadListener(ReadListener readListener) {
    }

    // 这个方法也必须实现; 读取下一个字节;
    @Override
    public int read() throws IOException {
      return input.read();
    }
  }
}
