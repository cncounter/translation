

pom.xml 配置:





web.xml 配置

```
<servlet>
  <servlet-name>spring-mvc</servlet-name>
  <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
  <init-param>
    <!-- 指定SpringMvc配置文件的位置 -->
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath*:/spring-mvc.xml</param-value>
  </init-param>
  <load-on-startup>1</load-on-startup>
</servlet>
<servlet-mapping>
  <servlet-name>spring-mvc</servlet-name>
  <url-pattern>/</url-pattern>
</servlet-mapping>
```

spring-mvc.xml 配置:

```
<mvc:interceptors>
  <!-- 使用bean定义一个Interceptor，拦截所有的请求; 此处顺序即为拦截器链的顺序 -->
  <bean class="com.hyzj.web.interceptor.LoginCheckInterceptor">
    <property name="excludeList">
        <list>
          <value>/login/</value>
          <value>/static/</value>
          <value>/test/</value>
          <value>/druid/</value>
        </list>
    </property>
  </bean>
</mvc:interceptors>
```



LoginCheckInterceptor.java 文件

```
package com.hyzj.web.interceptor;

import com.hyzj.domain.entity.LoginUser;
import com.hyzj.domain.exception.NeedLoginException;
import com.hyzj.web.controller.base.ControllerBase;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * 登录拦截器,演示拦截器<br/>
 * 参考链接: <url>http://haohaoxuexi.iteye.com/blog/1750680</url>
 */
public class LoginCheckInterceptor implements HandlerInterceptor {

    
    private List<String> excludeList = new ArrayList<String>();
    public void setExcludeList(List<String> excludeList) {
        this.excludeList = excludeList;
    }
    
    private boolean validURI(HttpServletRequest request){
        // 如果在排除列表中
        String uri = request.getRequestURI();
        Iterator<String> iterator = excludeList.iterator();
        while (iterator.hasNext()) {
            String exURI = (String) iterator.next();
            if(null != exURI && uri.contains(exURI)){
                return true;
            }
        }
        // 可以进行登录和权限之类的判断
        LoginUser user = ControllerBase.getLoginUser(request);
        if(null != user){
            return true;
        }
        // 未登录,不允许
        return false;
    }


    private void initRequestThreadLocal(HttpServletRequest request){
        ControllerBase.setRequest(request);
        request.setAttribute("basePath", ControllerBase.basePathLessSlash(request));
    }
    private void removeRequestThreadLocal(){
        ControllerBase.setRequest(null);
    }

    /**
     * preHandle方法是进行处理器拦截用的，顾名思义，该方法将在Controller处理之前进行调用，SpringMVC中的Interceptor拦截器是链式的，可以同时存在
     * 多个Interceptor，然后SpringMVC会根据声明的前后顺序一个接一个的执行，而且所有的Interceptor中的preHandle方法都会在
     * Controller方法调用之前调用。SpringMVC的这种Interceptor链式结构也是可以进行中断的，这种中断方式是令preHandle的返
     * 回值为false，当preHandle的返回值为false的时候整个请求就结束了。
     */
    @Override
    public boolean preHandle(HttpServletRequest request,
            HttpServletResponse response, Object handler) throws Exception {
        initRequestThreadLocal(request);
        // 如果不允许操作,则返回false即可
        if (false == validURI(request)) {
            // 此处抛出异常,允许进行异常统一处理
            throw new NeedLoginException();
        }
        return true;
    }
    
    /**
     * 这个方法只会在当前这个Interceptor的preHandle方法返回值为true的时候才会执行。postHandle是进行处理器拦截用的，它的执行时间是在处理器进行处理之
     * 后，也就是在Controller的方法调用之后执行，但是它会在DispatcherServlet进行视图的渲染之前执行，也就是说在这个方法中你可以对ModelAndView进行操
     * 作。这个方法的链式结构跟正常访问的方向是相反的，也就是说先声明的Interceptor拦截器该方法反而会后调用，这跟Struts2里面的拦截器的执行过程有点像，
     * 只是Struts2里面的intercept方法中要手动的调用ActionInvocation的invoke方法，Struts2中调用ActionInvocation的invoke方法就是调用下一个Interceptor
     * 或者是调用action，然后要在Interceptor之前调用的内容都写在调用invoke之前，要在Interceptor之后调用的内容都写在调用invoke方法之后。
     */
    @Override
    public void postHandle(HttpServletRequest request,
            HttpServletResponse response, Object handler, ModelAndView modelAndView)
            throws Exception {
        removeRequestThreadLocal();
    }

    /**
     * 该方法也是需要当前对应的Interceptor的preHandle方法的返回值为true时才会执行。该方法将在整个请求完成之后，也就是DispatcherServlet渲染了视图执行，
     * 这个方法的主要作用是用于清理资源的，当然这个方法也只能在当前这个Interceptor的preHandle方法的返回值为true时才会执行。
     */
    @Override
    public void afterCompletion(HttpServletRequest request,
            HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
        removeRequestThreadLocal();
    }
    
}
```






