# How to Define a Spring Boot Filter?


# Spring Boot配置Filter过滤器

## 1. Overview

In this quick tutorial, we'll explore how to define custom filters and specify their invocation order with the help of Spring Boot.

## 2. Defining Filters and the Invocation Order

Let's start by creating two filters:

- `TransactionFilter` – to start and commit transactions
- `RequestResponseLoggingFilter` – to log requests and responses

In order to create a filter, we need to simply implement the Filter interface:


## 1. 概述

本文简单介绍 Spring Boot 环境中配置自定义Filter过滤器, 并指定Filter的执行顺序。

## 2. 定义过滤器和调用顺序

先创建两个过滤器:

- `TransactionFilter` – 用来模拟创建和提交事务
- `RequestResponseLoggingFilter` – 记录请求和响应日志

要创建过滤器,只需要简单地实现Filter接口, 并使用`@Component`声明为Spring组件即可。

看事务过滤器的代码:

```java
@Component
@Order(1)
public class TransactionFilter implements Filter {

    @Override
    public void doFilter
      ServletRequest request,
      ServletResponse response,
      FilterChain chain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        LOG.info(
          "Starting a transaction for req : {}",
          req.getRequestURI());

        chain.doFilter(request, response);
        LOG.info(
          "Committing a transaction for req : {}",
          req.getRequestURI());
    }

    // other methods
}
```

and:

以及请求日志过滤器的代码:


```java
@Component
@Order(2)
public class RequestResponseLoggingFilter implements Filter {

    @Override
    public void doFilter(
      ServletRequest request,
      ServletResponse response,
      FilterChain chain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        LOG.info(
          "Logging Request  {} : {}", req.getMethod(),
          req.getRequestURI());
        chain.doFilter(request, response);
        LOG.info(
          "Logging Response :{}",
          res.getContentType());
    }

    // other methods
}
```

In order for Spring to be able to recognize a filter, we needed to define it as a bean with the `@Component` annotation.

And, to have the filters fire in the right order – we needed to use the `@Order` annotation.

要让 Spring 识别过滤器,使用`@Component`声明为Spring组件即可。

要指定filter的执行顺序, 可以使用 `@Order` 注解。

> 需要注意的是, `@Order`与 `@WebFilter` 配合使用并不会生效, 而是需要 `@Component` 才能识别。


### 2.1. Filter With URL Pattern

In the example above, our filters are registered by default for all the URL's in our application. However, we may sometimes want a filter to only apply to certain URL patterns.

In this case, we have to remove the `@Component` annotation from the filter class definition and register the filter using a `FilterRegistrationBean`:

### 2.1. Filter指定URL匹配模式

默认情况下,应用中的Filter都会注册所有URL。 但有时我们希望过滤器只处理某些URL。

在这种情况下,需要从过滤器的类定义中删除 `@Component` 注解, 并使用 `FilterRegistrationBean` 来注册和包装过滤器:

```java
@Bean
public FilterRegistrationBean<RequestResponseLoggingFilter> loggingFilter(){
    FilterRegistrationBean<RequestResponseLoggingFilter> registrationBean
      = new FilterRegistrationBean<>();

    registrationBean.setFilter(new RequestResponseLoggingFilter());
    registrationBean.addUrlPatterns("/users/*");

    return registrationBean;    
}
```

Now the filter will only apply for paths that match the `/users/*` pattern.

To set URL patterns for the filter, we can use the `addUrlPatterns()` or `setUrlPatterns()` methods.

这样配置之后, 过滤器只会过滤符合 `/users/*` 模式的URL。

要设置过滤器的URL格式,使用 `addUrlPatterns()` 或者 `setUrlPatterns()` 方法即可。


## 3. A Quick Example

Let's now create a simple endpoint and send an HTTP request to it:

## 3. 示例

创建一个简单的Controller:

```java
@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping()
    public List<User> getAllUsers() {
        // ...
    }
}
```

The application logs on hitting this API are :

然后通过浏览器或者curl程序,发送HTTP请求,则可以在控制台界面看到相应的日志内容:

```
23:54:38 INFO  com.spring.demo.TransactionFilter - Starting Transaction for req :/users
23:54:38 INFO  c.s.d.RequestResponseLoggingFilter - Logging Request  GET : /users
...
23:54:38 INFO  c.s.d.RequestResponseLoggingFilter - Logging Response :application/json;charset=UTF-8
23:54:38 INFO  com.spring.demo.TransactionFilter - Committing Transaction for req :/users
```

This confirms that filters are invoked in the desired order.

这样我们就验证了, 确实是按所预期的顺序调用了过滤器。

## 4. Conclusion

In this article, we've summarized how to define custom filters in a Spring Boot webapp.

As always, code snippets can be found over on [GitHub](https://github.com/eugenp/tutorials/tree/master/spring-boot-modules/spring-boot-basic-customization).


## 4. 小结

本文简要介绍了如何在Spring Boot Webapp中定义自定义过滤器。

相关的代码片段可以在 [GitHub](https://github.com/eugenp/tutorials/tree/master/spring-boot-modules/spring-boot-basic-customization) 上查看。


## 相关链接

- [How to Define a Spring Boot Filter?](https://www.baeldung.com/spring-boot-add-filter)
