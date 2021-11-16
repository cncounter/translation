# Strict-Transport-Security - 307 Internal Redirect 跳转码案例一则

HSTS is HTTP Strict Transport Security: a way for sites to elect to always use HTTPS. See https://www.chromium.org/hsts. PKP is Public Key Pinning: Chrome "pins" certain public keys for certain sites in official builds.


## 背景

运维人员在test环境nginx的 https 协议的服务下增加了一个响应头,

```
请求网址: https://myappname.test-13.cncounter.com/info
请求方法: GET

响应标头:
Strict-Transport-Security: max-age=15724800
......
```

多了一个 header, chrome 收到这个header之后，下次访问该域名的请求会在内部自动强制跳转到 https。

看 Chrome network 控制台的响应 status 是 `307 Internal Redirect`。


## 临时解决方案

1. 关闭所有 https://myappname.test-13.cncounter.com/ 的标签页。
2. 访问 chrome://net-internals/#hsts
3. 清理掉 myappname.test-13.cncounter.com 域名的安全策略。
3.1 可以查询域名的安全策略.
3.2 之后不要访问这个域名的 https
3.3 【实际上清理Chrome全部缓存也可以】
4. 访问 http://myappname.test-13.cncounter.com/

## 后续处理方案

运维人员回滚nginx配置，将测试环境的这个header去除了。


## 相关链接

- <https://www.chromium.org/hsts>
- 搜索 HSTS
- 搜索 `307 Internal Redirect`
- 搜索 `Strict-Transport-Security`
