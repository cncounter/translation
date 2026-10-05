## 14 Rules for Faster-Loading Web Sites

## 加快网站加载速度的 14 条规则

These rules are the key to speeding up your web pages. They've been tested on some of the most popular sites on the Internet and have successfully reduced the response times of those pages by 25-50%.

这些规则是加速网页的关键。它们已在互联网上一些最受欢迎的站点上经过测试, 并成功将这些页面的响应时间缩短了 25%~50%。

The key insight behind these best practices is the realization that only 10-20% of the total end-user response time is spent getting the HTML document to the browser. You need to focus on the other 80-90% if you want to make your pages noticeably faster. These rules are the best practices for optimizing the way servers and browsers handle that 80-90% of the user experience.

这些最佳实践背后的核心洞察是: 终端用户总响应时间中只有 10%~20% 花在把 HTML 文档送到浏览器上。如果你想让页面显著变快, 就需要把注意力放在另外的 80%~90% 上。这些规则正是优化服务器与浏览器处理这 80%~90% 用户体验的最佳实践。

These pages are the companion web site for the book [High Performance Web Sites](http://www.amazon.com/gp/product/0596529309?ie=UTF8&tag=stevsoud-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0596529309). The examples referenced in the book are hosted here. Navigate through the rules listed below to find the associated examples. Each rule page also contains a link to the [Yahoo! Developer Network Performance Blog](http://developer.yahoo.com/performance/rules.html). There you will find a brief summary of the rule along with comments.

这些页面是《[High Performance Web Sites](http://www.amazon.com/gp/product/0596529309?ie=UTF8&tag=stevsoud-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0596529309)》一书的配套网站。书中引用的示例都托管在这里。通过浏览下面列出的规则, 可以找到相关的示例。每个规则页面还包含一个指向 [Yahoo! Developer Network Performance Blog](http://developer.yahoo.com/performance/rules.html) 的链接, 在那里你可以找到该规则的简要总结以及评论。

- [规则 1 - 减少 HTTP 请求](https://stevesouders.com/hpws/rule-min-http.php)
- [规则 2 - 使用内容分发网络(CDN)](https://stevesouders.com/hpws/rule-cdn.php)
- [规则 3 - 添加 Expires 响应头](https://stevesouders.com/hpws/rule-expires.php)
- [规则 4 - 对组件启用 Gzip 压缩](https://stevesouders.com/hpws/rule-gzip.php)
- [规则 5 - 把样式表放在顶部](https://stevesouders.com/hpws/rule-css-top.php)
- [规则 6 - 把脚本放在底部](https://stevesouders.com/hpws/rule-js-bottom.php)
- [规则 7 - 避免使用 CSS 表达式](https://stevesouders.com/hpws/rule-expr.php)
- [规则 8 - 将 JavaScript 和 CSS 外部化](https://stevesouders.com/hpws/rule-inline.php)
- [规则 9 - 减少 DNS 查询](https://stevesouders.com/hpws/rule-dns.php)
- [规则 10 - 压缩 JavaScript](https://stevesouders.com/hpws/rule-minify.php)
- [规则 11 - 避免重定向](https://stevesouders.com/hpws/rule-redir.php)
- [规则 12 - 移除重复的脚本](https://stevesouders.com/hpws/rule-js-dupes.php)
- [规则 13 - 配置 ETags](https://stevesouders.com/hpws/rule-etags.php)
- [规则 14 - 让 AJAX 可缓存](https://stevesouders.com/hpws/rule-ajax.php)

延伸阅读:

- [这些规则的由来](https://stevesouders.com/hpws/index.php)
- [YSlow](http://developer.yahoo.com/yslow/), Yahoo 的性能分析工具
- [YDN 的博客文章](http://stevesouders.com/dev/efws/blogposts.php)
- [书中的链接](https://stevesouders.com/hpws/links.php)
- [`sleep.cgi`](https://stevesouders.com/hpws/sleep.txt) 源代码


原文链接: <https://stevesouders.com/hpws/rules.php>
