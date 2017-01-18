# ModelAndView’s model value is not displayed in JSP via EL

# 解决SpringMVC中JSP的EL不显示的情况

## Problem

## 问题描述


In Spring MVC development, developer try to set a value into a model, and display the value in JSP via EL, e.g **${msg}**, but it just outputs the result as it is – **${msg}**, not the “value” stored in the model. The EL is just not working in JSP, why?

在Spring MVC开发中, 开发人员可能会设置某个值到 model 中, 并通过EL标签在JSP显示, 例如: `${msg}`, 但并不起作用, 页面的输出结果还是原样子: **${msg}**, 并没有解析为对应的 “value”。也就是JSP中 EL 不起作用了,为什么呢?


**Spring’s Controller**

> **SpringMVC的Controller代码如下:**


    import javax.servlet.http.HttpServletRequest;
    import javax.servlet.http.HttpServletResponse;
    import org.springframework.web.servlet.ModelAndView;
    import org.springframework.web.servlet.mvc.AbstractController;

    public class ABCController extends AbstractController{

    	@Override
    	protected ModelAndView handleRequestInternal(HttpServletRequest request,
    		HttpServletResponse response) throws Exception {

    		ModelAndView model = new ModelAndView("HelloWorldPage");
    		model.addObject("msg", "hello world");

    		return model;
    	}
    }


**JSP page**

> **JSP 页面的内容如下:


	<%@ taglib prefix="c"
		uri="http://java.sun.com/jsp/jstl/core" %>
	<html>
	<body>
		     ${msg}
	</body>
	</html>




## Solution

## 解决方案


This is the common asked question in the most Spring MVC hello world example. Actually it’s caused by the old JSP 1.2 descriptor.

在 Spring MVC 的入门项目中, 这是最常见的问题。实际上这是因为使用了 JSP 1.2 规范引起的。


## 1. JSP 1.2



If you are using the **old JSP 1.2 descriptor, defined by DTD** ,for example

如果您使用了 **JSP 1.2规范**, 即通过 DTD 定义的方式:


> **web.xml**


	<!DOCTYPE web-app PUBLIC
	 "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
	 "http://java.sun.com/dtd/web-app_2_3.dtd" >
	<web-app>
	//...
	</web-app>



The EL is disabled or ignored by default, you have to enable it manually, so that it will outputs the value store in the “msg” model.

这种情况下, EL标签默认是禁用或者忽略的, 你必须手动启用, 这样才会输出存储在 model 中的值。示例如下:


	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
	<html>
	<head>
	<%@ page isELIgnored="false" %>
	</head>
	<body>
		   ${msg}
	</body>
	</html>

可以看出，其中使用了 `<%@ page isELIgnored="false" %>` 来开启 EL 表达式;



## 2. JSP 2.0


If you are using the **standard JSP 2.0 descriptor, defined by w3c schema** ,for example

如果使用的是 **标准的 JSP 2.0 描述符, 即通过w3c schema来定义**, 示例如下:


> **web.xml**


	<web-app id="WebApp_ID" version="2.4"
		xmlns="http://java.sun.com/xml/ns/j2ee"
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee
		http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd">
	//...
	</web-app>


The EL is enabled by default, and you should see the value stored in the “msg” model, which is “hello world”.

则EL是默认启用的, 可以直接看到存储在model中 “msg”的值 ,即“hello world”。


## 参考

1. (使用指令编写JSP页面)(http://java.boot.by/wcd-guide/ch06s02.html)



原文链接: [https://www.mkyong.com/spring-mvc/modelandviews-model-value-is-not-displayed-in-jsp-via-el/](https://www.mkyong.com/spring-mvc/modelandviews-model-value-is-not-displayed-in-jsp-via-el/)
