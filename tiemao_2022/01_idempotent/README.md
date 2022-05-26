# 软件开发中的幂等性


幂等性，对应的英文是 idempotent 或者 idempotence.

简单理解就是多次执行同样的业务操作, 最终的 "结果" 保持一致。 而容易混淆的就是这个 "结果" 到底是什么结果?

很多初学者对幂等性不了解，而很多有经验的开发工程师则是对幂等性一知半解，而且不区分业务场景，容易和其他概念混为一谈。

本文简要介绍软件开发过程中涉及到的幂等性, 目的是让开发人员了解相关的背景和知识。

示例:

- 多次点击 "停用" 按钮;
- 超时重试;

## 业务类型

查询请求
修改请求

## 消息类型


MQ消息
Http请求
微服务请求

## 业务幂等性




MQ消息的幂等性，只要最终结果都是一致的就算幂等。
HTTP请求的幂等性，只要服务端的最终结果是一致的，以及响应结果对客户端的影响也是一致的，就算是幂等。




## 扩展阅读

- [What is an idempotent operation? - stackoverflow](https://stackoverflow.com/questions/1077412/what-is-an-idempotent-operation)
- [Idempotence - wikipedia](https://en.wikipedia.org/wiki/Idempotence)
- [Idempotent - MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/Idempotent)
- [聊聊开发中幂等性问题 - 掘金](https://juejin.cn/post/6844903815552958477)
- [深入理解幂等性 - 博客园](https://www.cnblogs.com/javalyy/p/8882144.html)
- [幂等性的含义和HTTP请求方法的幂等性 - 博客园](https://www.cnblogs.com/zhangzl419/p/7323289.html)
- [分布式高并发系统如何保证对外接口的幂等性？](https://www.cnblogs.com/longshiyVip/p/5426505.html)
- [高并发系统数据幂等的技术尝试](https://www.cnblogs.com/longshiyVip/p/5426500.html)
