# Java-根据IP统计访问次数

本文简要介绍如何实现一个IP访问计数器。

为了简单, 使用 JSP 来实现, 但读者需要明白, Java代码可以在到处运行。


示例Demo页面: <http://www.cncounter.com/test/counter.jsp>

返回JSON: <http://www.cncounter.com/test/counter.jsp?format=json>

清空本IP的计数: <http://www.cncounter.com/test/counter.jsp?action=clear>

下面列出实现代码, 文档和说明就在代码中:

解析客户端IP的工具类 `IPUtils.java` :

```
package com.cncounter.util.net;
import javax.servlet.http.HttpServletRequest;

/**
 * IP工具类
 */
public class IPUtils {

    public static final String SEMICOLON = ";";

    // Nginx代理传递的实际客户端 IP-header
    public static final String[] HEADERS_TO_TRY = {
            "X-Forwarded-For",
            "X-REAL-IP",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_X_FORWARDED_FOR",
            "HTTP_X_FORWARDED",
            "HTTP_X_CLUSTER_CLIENT_IP",
            "HTTP_CLIENT_IP",
            "HTTP_FORWARDED_FOR",
            "HTTP_FORWARDED",
            "HTTP_VIA",
            "REMOTE_ADDR",
            "REMOTE-HOST"
    };

    /**
     * 获取客户端的IP地址
     */
    public static String getClientIp(HttpServletRequest request) {
        String clientIp = _getClientIp(request);
        if (null != clientIp && !clientIp.trim().isEmpty()) {
            return clientIp;
        }
        return request.getRemoteAddr();
    }

    private static String _getClientIp(HttpServletRequest request) {
        for (String header : HEADERS_TO_TRY) {
            String ip = request.getHeader(header);
            if (ip != null && ip.length() != 0 && !"unknown".equalsIgnoreCase(ip)) {
                return ip;
            }
        }
        return request.getRemoteAddr();
    }
}
```

其中依赖了 FastJSON, FastJSON的信息请参考: <https://github.com/alibaba/fastjson/wiki/Quick-Start-CN> 

改为其他JSON库也可以。但强烈推荐使用简单强大灵活的FastJSON。


JSP文件 `counter.jsp` 实现代码如下:

```
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" isErrorPage="true" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="java.util.concurrent.ConcurrentHashMap" %>
<%@ page import="java.util.concurrent.atomic.AtomicInteger" %>
<%@ page import="com.cncounter.util.net.IPUtils" %>
<%@ page import="com.alibaba.fastjson.JSON" %>
<%-- trimDirectiveWhitespaces 的作用是去除多余的空行 --%>
<%!
    // 访问计数器Map<IP地址, 次数>
    private static ConcurrentHashMap<String, AtomicInteger> visitCounterMap
            = new ConcurrentHashMap<String, AtomicInteger>();

    // 增加并获取最新的访问次数
    private static int incrementCounter(String clientIp) {
        //
        AtomicInteger visitCounter = visitCounterMap.get(clientIp);
        if (null == visitCounter) {
            visitCounter = new AtomicInteger();
            AtomicInteger oldValue = visitCounterMap.putIfAbsent(clientIp, visitCounter);
            if (null != oldValue) {
                // 使用 putIfAbsent 时注意: 判断是否有并发导致的原有值。
                visitCounter = oldValue;
            }
        }
        // 先增加, 再返回
        int count = visitCounter.incrementAndGet();
        return count;
    }

    // 清除某个IP的访问次数
    private static int clearCounter(String clientIp) {
        visitCounterMap.remove(clientIp);
        return 0;
    }

    //
    private static final String CONST_PARAM_NAME_ACTION = "action";
    private static final String CONST_ACTION_VALUE_CLEAR = "clear";
    //
    private static final String CONST_PARAM_NAME_FORMAT = "format";
    private static final String CONST_FORMAT_VALUE_JSON = "json";
    //
    private static final String CONST_ATTR_NAME_CLIENTIP = "clientIp";
    private static final String CONST_ATTR_NAME_VISITCOUNT = "visitCount";
%>
<%
    // 获取客户端IP地址
    String clientIp = IPUtils.getClientIp(request);
    Integer visitCount = 0;
    if (null != clientIp) {
        // 获取访问次数
        visitCount = incrementCounter(clientIp);
    }
    // 如果需要清空数据
    String action = request.getParameter(CONST_PARAM_NAME_ACTION);
    if (CONST_ACTION_VALUE_CLEAR.equalsIgnoreCase(action)) {
        visitCount = clearCounter(clientIp);
    }
    // 如果需要返回JSON格式的数据
    String format = request.getParameter(CONST_PARAM_NAME_FORMAT);
    if (CONST_FORMAT_VALUE_JSON.equalsIgnoreCase(format)) {
        // 返回JSON
        Map<String, Object> result = new HashMap<String, Object>();
        result.put(CONST_ATTR_NAME_CLIENTIP, clientIp);
        result.put(CONST_ATTR_NAME_VISITCOUNT, visitCount);
%>
<%=JSON.toJSONString(result)%>
<%
        return; // 如果返回JSON数据, 则不往下执行
    }
%>
<HTML>
<HEAD>
    <TITLE>统计页面访问次数</TITLE>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <style>
        body {
            word-wrap: break-word;
            word-break: break-all;
        }
    </style>
</HEAD>
<BODY>

<H1>统计页面访问次数</H1>
<table border="1" width="100%">

    <thead>
    <tr>
        <td align="center">
            <h3>IP地址</h3>
        </td>
        <td align="center">
            <h3>访问次数</h3>
        </td>
    </tr>
    </thead>
    <tbody>
    <%
        Set<String> keySet = visitCounterMap.keySet();
        // 排序?
        // 根据值排序?
        for (String key : keySet) {
    %>
    <tr>
        <td>
            <%=key%>
        </td>
        <td>
            <%=visitCounterMap.getOrDefault(key, new AtomicInteger(0)).intValue()%>
        </td>
    </tr>
    <%
        }
    %>
    </tbody>
</table>

</BODY>
</HTML>

```

并未进行持久化, 如有需要, 可以定时保存到数据库。

只需要在保存之后清空本地的值即可。 

一般情况下, 统计访问次数等功能, 不需要考虑极端情况, 只要不影响系统的性能即可。

然后访问相应的地址:


示例Demo页面: <http://www.cncounter.com/test/counter.jsp>

返回JSON: <http://www.cncounter.com/test/counter.jsp?format=json>

清空本IP的计数: <http://www.cncounter.com/test/counter.jsp?action=clear>


返回的JSON 如下所示:

```
{"clientIp":"61.50.103.90","visitCount":4}
```

时间: 2018年2月9日

作者: 铁锚

