# How to Define a Spring Boot Filter?

## 1. Overview

In this quick tutorial, we'll explore how to define custom filters and specify their invocation order with the help of Spring Boot.

## 2. Defining Filters and the Invocation Order

Let's start by creating two filters:

- `TransactionFilter` – to start and commit transactions
- `RequestResponseLoggingFilter` – to log requests and responses

In order to create a filter, we need to simply implement the Filter interface:


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

### 2.1. Filter With URL Pattern

In the example above, our filters are registered by default for all the URL's in our application. However, we may sometimes want a filter to only apply to certain URL patterns.

In this case, we have to remove the `@Component` annotation from the filter class definition and register the filter using a `FilterRegistrationBean`:

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

## 3. A Quick Example

Let's now create a simple endpoint and send an HTTP request to it:

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

```
23:54:38 INFO  com.spring.demo.TransactionFilter - Starting Transaction for req :/users
23:54:38 INFO  c.s.d.RequestResponseLoggingFilter - Logging Request  GET : /users
...
23:54:38 INFO  c.s.d.RequestResponseLoggingFilter - Logging Response :application/json;charset=UTF-8
23:54:38 INFO  com.spring.demo.TransactionFilter - Committing Transaction for req :/users
```

This confirms that filters are invoked in the desired order.

## 4. Conclusion

In this article, we've summarized how to define custom filters in a Spring Boot webapp.

As always, code snippets can be found over on [GitHub](https://github.com/eugenp/tutorials/tree/master/spring-boot-modules/spring-boot-basic-customization).



- <https://www.baeldung.com/spring-boot-add-filter>
