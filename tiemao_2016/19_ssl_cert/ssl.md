

至少2018位加密的证书:

```
openssl req -nodes -newkey rsa:2048 -keyout myserver.key -out server.csr
```

然后输入相关的信息

当然,也可以使用带参数的方式生成:

```
openssl req -nodes -newkey rsa:2048 -keyout myserver.key -out server.csr -subj "/C=CN/ST=Beijing/L=BJ/O=CNCounter Ltd./OU=IT/CN=www.cncounter.com"
```



参考地址: [https://support.comodo.com/index.php?/Default/Knowledgebase/Article/View/1/19/csr-generation-using-openssl-apache-wmod_ssl-nginx-os-x](https://support.comodo.com/index.php?/Default/Knowledgebase/Article/View/1/19/csr-generation-using-openssl-apache-wmod_ssl-nginx-os-x)



记得将你的域名的隐私保护给去除掉，或者域名对应了邮箱。

否则收不到SSL证书服务商发送来的短信.








> 免费证书:



	如果是个人用户，可以选择便宜甚至免费的DV证书。
	1、Let's Encrypt：免费，快捷，支持多域名（不是通配符），三条命令即时签署+导出证书。缺点是暂时只有三个月有效期，到期需续签。
	2、StartSSL免费DV证书：免费，有效期是一年，比Let's Encrypt长。
	3、Comodo PositiveSSL：便宜，单年9美刀，如果签三年大概每年4至5美刀。可签署ECC SSL证书。
	4、RapidSSL：单年签署价格同PositiveSSL，并没有什么优缺点。
	5、沃通（Wosign）免费DV证书：免费，签发快，界面和官方资料都是中文。问题是上次CNNIC的二级CA冒签Gmail的证书引起争议，在国内有些人预防性拉黑所有国内CA的证书，包括沃通的。他们浏览你的站点时会被拦截和警告。


链接：[https://www.zhihu.com/question/19578422/answer/77060247](https://www.zhihu.com/question/19578422/answer/77060247)



StartSSL:  [https://www.startssl.com/](https://www.startssl.com/)





注册地址: [https://www.startssl.com/SignUp](https://www.startssl.com/SignUp)









