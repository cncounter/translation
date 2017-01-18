
# ModelAndView’s model value is not displayed in JSP via EL

## Problem

In Spring MVC development, developer try to set a value into a model, and display the value in JSP via EL, e.g **${msg}**, but it just outputs the result as it is – **${msg}**, not the “value” stored in the model. The EL is just not working in JSP, why?

**Spring’s Controller**

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

	<%@ taglib prefix="c"
		uri="http://java.sun.com/jsp/jstl/core" %>
	<html>
	<body>
		     ${msg}
	</body>
	</html>

## Solution

This is the common asked question in the most Spring MVC hello world example. Actually it’s caused by the old JSP 1.2 descriptor.

## 1. JSP 1.2

If you are using the **old JSP 1.2 descriptor, defined by DTD** ,for example

 **web.xml**

	<!DOCTYPE web-app PUBLIC
	 "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
	 "http://java.sun.com/dtd/web-app_2_3.dtd" >

	<web-app>
	//...
	</web-app>

The EL is disabled or ignored by default, you have to enable it manually, so that it will outputs the value store in the “msg” model.


	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
	<html>
	<head>
	<%@ page isELIgnored="false" %>
	</head>
	<body>
		   ${msg}
	</body>
	</html>


## 2. JSP 2.0

If you are using the **standard JSP 2.0 descriptor, defined by w3c schema** ,for example

 **web.xml**

	<web-app id="WebApp_ID" version="2.4"
		xmlns="http://java.sun.com/xml/ns/j2ee"
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee
		http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd">
	//...
	</web-app>

The EL is enabled by default, and you should see the value stored in the “msg” model, which is “hello world”.

## Reference

1.  [Write JSP code that uses the directives](http://java.boot.by/wcd-guide/ch06s02.html)

原文链接: [https://www.mkyong.com/spring-mvc/modelandviews-model-value-is-not-displayed-in-jsp-via-el/](https://www.mkyong.com/spring-mvc/modelandviews-model-value-is-not-displayed-in-jsp-via-el/)