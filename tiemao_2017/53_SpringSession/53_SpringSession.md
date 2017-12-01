# Spring Session


Session，中文翻译为 "会话"，在计算机领域，用于描述用户端和服务器之间的通讯。当然，基于Http协议的浏览器在请求Web服务器资源时，我们通过会话(Session)来标识不同的客户端/用户。


## Spring-Session简介

Spring Session 是 [Spring.io](https://spring.io/) 组织维护的一个开源项目，基于 Java Web 的 API，将Web服务的会话状态抽离出来，放到共享存储中。这样就可以很容易将单机Web系统平滑扩展为Web集群系统。

项目的官方网站为: <https://projects.spring.io/spring-session/>

顾名思义，Spring Session 可以用来管理JavaWeb系统的用户会话信息。

其主要功能特征包括:

- 用户Session管理相关的API和具体实现

- HttpSession - 以独立的方式，替换如Tomcat之类Web容器所提供的HttpSession，。

- Clustered Sessions - 集群会话管理, 通过Spring Session，可以很轻易地实现Web服务器集群，不需要根据各种Web容器进行一堆繁琐的配置.

- Multiple Browser Sessions - 支持多个会话同时并存，通过 Spring Session，可以在同一个浏览器中支持多个用户会话状态。 (有点类似Google的多账号登录认证).

- RESTful APIs - 可以在 headers 中指定session ids，来兼容 RESTful APIs

- WebSocket - 在WebSocket调用中保证 HttpSession 存活。




## Session 的实现原理








