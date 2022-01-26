# 软件开发中的幂等性


很多初学者对幂等性不了解，而很多有开发经验的工程师则是对幂等性一知半解，容易和其他概念混淆，而且不区分业务场景，全都混为一谈。

幂等性，对应的英文是 idempotent 和 Idempotence。

简单理解就是多次执行的 "结果" 是一致的。 而容易混淆的就是这个 "结果" 到底是哪个结果?

本文的目的是简要概述开发人员需要了解的幂等。




MQ消息
Http请求
微服务请求


MQ消息的幂等性，只要最终结果都是一致的就算幂等。
HTTP请求的幂等性，只要服务端的最终结果是一致的，以及响应结果对客户端的影响也是一致的，就算是幂等。




## 扩展阅读

- [What is an idempotent operation? - stackoverflow](https://stackoverflow.com/questions/1077412/what-is-an-idempotent-operation)
- [Idempotence - wikipedia](https://en.wikipedia.org/wiki/Idempotence)
- [Idempotent - MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/Idempotent)
- [聊聊开发中幂等性问题 - 掘金](https://juejin.cn/post/6844903815552958477)
- [深入理解幂等性 - 博客园](https://www.cnblogs.com/javalyy/p/8882144.html)
- [幂等性的含义和HTTP请求方法的幂等性 - 博客园](https://www.cnblogs.com/zhangzl419/p/7323289.html)
