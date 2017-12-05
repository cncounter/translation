# SpringMVC懒加载导致的问题一则

> 本文不讨论 Spring 的 `@Autowired` 懒加载(lazy-init)问题。

今天突然发现一个问题。

在Tomcat启动时，SpringMVC并没有加载，而是第一次请求到来时才进行加载。

因为SpringMVC加载较慢， 导致 httpClient 客户端 超时而报错。

Tomcat的 `catalina.out` 日志信息如下:

```
05-Dec-2017 12:11:14.878 INFO [main] org.apache.catalina.startup.Catalina.start Server startup in 21508 ms
[2017-12-05 12:14:06 DEBUG org.springframework.web.servlet.DispatcherServlet:118 ] Initializing servlet 'SpringMVC'
[2017-12-05 12:14:06 DEBUG org.springframework.web.context.support.StandardServletEnvironment:109 ] Adding [servletConfigInitParams] PropertySource with lowest search precedence
```

可以看大, 12:11 分 Tomcat启动成功。 而 12:14 分才初始化 DispatcherServlet， 简单排查了一下， 在 `web.xml` 中加上 `load-on-startup` 即可。

```

    <!-- SpringMVC核心分发器 -->
    <servlet>
        <servlet-name>SpringMVC</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring/spring-mvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>SpringMVC</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
```

然后重新启动应用，一切正常。

因为加载速度大多较快，所以多数应用都没配置该参数。 但对于调用量较小的纯API来说可能就会有一些影响。

`load-on-startup` 配置一般是大于0的数值，表示启动顺序。 如果相同，则表明这两个Servlet启动顺序随意。

日期: 2017年12月05日

作者: [铁锚: http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
