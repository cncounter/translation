# Java技巧: 根据网址查询DNS/IP地址

需求: 给定一个URL地址, 例如: `http://www.cncounter.com/tools/shorturl.php`, 解析对应的IP地址和端口号。

> 说明: 本文不涉及底层的 DNS 协议, 直接使用Java平台提供的API进行操作。

DNS也就是 Domain Name Service,即 域名服务。

我们知道, Java中与网址有关的类包括 [`java.net.URL`](https://docs.oracle.com/javase/8/docs/api/java/net/URL.html) 和  [`java.net.URI`](https://docs.oracle.com/javase/8/docs/api/java/net/URI.html) 等, 其中 URI 是资源定位符, 可能包括 file: 之类的协议。

所以此处我们使用 URL 类, 获取端口号的代码如下:

```
    /**
     * 获取端口号
     *
     * @param href 网址, ftp, http, nntp, ... 等等
     * @return
     * @throws IOException
     */
    public static int parsePort(String href) throws IOException {
        //
        URL url = new URL(href);
        // 端口号; 如果 href 中没有明确指定则为 -1
        int port = url.getPort();
        if (port < 0) {
            // 获取对应协议的默认端口号
            port = url.getDefaultPort();
        }
        return port;
    }
```

URL 类是Java早期就存在的一个类。 内部逻辑比较复杂, 有兴趣可以自己查看相关的JDK实现代码。

其中获取端口号的2个方法:

- `getPort()` 就是获取网址里面指明的端口号, 如果没有指定, 则返回 `-1`。
- `getDefaultPort()` 是获取协议对应的默认端口号, 如 http 协议默认端口号为 `80`, https 协议默认端口号是 `443` 等。

然后我们看提取 Host 部分的代码:

```
    /**
     * 获取Host部分
     *
     * @param href 网址, ftp, http, nntp, ... 等等
     * @return
     * @throws IOException
     */
    public static String parseHost(String href) throws IOException {
        //
        URL url = new URL(href);
        // 获取 host 部分
        String host = url.getHost();
        return host;
    }
```

本质上, 也可以通过正则表达式或者String直接截取 Host, 但如果碰上复杂情况， 也不好处理, 例如: [`https://yourname:passwd@gitee.com/mumu-osc/NiceFish.git`](https://yourname:passwd@gitee.com/mumu-osc/NiceFish.git) 这样的复杂网址。

提取出域名之后, 可以通过 [`java.net.InetAddress`](https://docs.oracle.com/javase/8/docs/api/java/net/InetAddress.html) 类来查找IP地址。

代码如下所示:

```
    /**
     * 根据域名(host)解析IP地址
     *
     * @param host 域名
     * @return
     * @throws IOException
     */
    public static String parseIp(String host) throws IOException {
        // 根据域名查找IP地址
        InetAddress inetAddress = InetAddress.getByName(host);
        // IP 地址
        String address = inetAddress.getHostAddress();
        return address;
    }
```

可以看到，我们使用了 `InetAddress.getByName()` 静态方法来查找IP。

该类也提供了其他静态方法, 但一般不怎么使用, 有兴趣可以点开源码看看。

然后, 我们通过 `main()` 方法进行简单的测试:

```
    public static void main(String[] args) throws IOException {
        //
        String href = "http://www.cncounter.com/tools/shorturl.php";
        // 端口号
        int port = parsePort(href);
        // 域名
        String host = parseHost(href);
        // IP 地址
        String address = parseIp(host);
	//
        System.out.println("host=" + host); 
        System.out.println("port=" + port); 
        System.out.println("address=" + address); 
    }

```

执行结果为: 

```
host=www.cncounter.com
port=80
address=198.11.179.83
```

知道IP和端口号, 我们就可以直接通过 Socket 来进行连接了。

当然, 如果是 http 协议, 可以使用 Apache 的 [HttpClient](https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient) 工具, 功能强大而且使用方便。 但这个库有个不好的地方在于，各个版本之间并不兼容, API 也经常换, 编程时需要根据特定版本号来进行处理。

完整的代码如下所示:

```

import java.io.IOException;
import java.net.*;

/**
 * 查找IP地址
 */
public class TestFindDNS {
    public static void main(String[] args) throws IOException {
        //
        String href = "http://www.cncounter.com/tools/shorturl.php";
        // 端口号
        int port = parsePort(href);
        // 域名
        String host = parseHost(href);
        // IP 地址
        String address = parseIp(host);
        //
        System.out.println("host=" + host);
        System.out.println("port=" + port);
        System.out.println("address=" + address);
    }

    /**
     * 获取端口号
     *
     * @param href 网址, ftp, http, nntp, ... 等等
     * @return
     * @throws IOException
     */
    public static int parsePort(String href) throws IOException {
        //
        URL url = new URL(href);
        // 端口号; 如果 href 中没有明确指定则为 -1
        int port = url.getPort();
        if (port < 0) {
            // 获取对应协议的默认端口号
            port = url.getDefaultPort();
        }
        return port;
    }

    /**
     * 获取Host部分
     *
     * @param href 网址, ftp, http, nntp, ... 等等
     * @return
     * @throws IOException
     */
    public static String parseHost(String href) throws IOException {
        //
        URL url = new URL(href);
        // 获取 host 部分
        String host = url.getHost();
        return host;
    }

    /**
     * 根据域名(host)解析IP地址
     *
     * @param host 域名
     * @return
     * @throws IOException
     */
    public static String parseIp(String host) throws IOException {
        // 根据域名查找IP地址
        InetAddress.getAllByName(host);
        InetAddress inetAddress = InetAddress.getByName(host);
        // IP 地址
        String address = inetAddress.getHostAddress();
        return address;
    }
}

```

OK, 请根据具体情况进行适当的封装和处理。



日期: 2017年12月05日

作者: [铁锚: http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

