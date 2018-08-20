# Nginx对URL解码导致的请求失败


客户端发起POST请求,URL是:

```
http://eapi.cncounter.com/manage/paper/export/N2%E7%BA%A7%E6%8A%A4%E7%90%86%E4%B8%89%E5%9F%BA%E7%90%86%E8%AE%BA%E8%80%83%E8%AF%95-%E5%A4%8D%7B%7D%E5%88%B6%E5%AD%A6%E8%80%8C%E6%80%9D.docx
```


Nginx配置的锅:

参考:

https://serverfault.com/questions/459369/disabling-url-decoding-in-nginx-proxy/463932

以及

https://stackoverflow.com/questions/28995818/nginx-proxy-pass-and-url-decoding


因为配置之中 `proxy_pass` 之中包含uri部分,(如 "****/manage/"):

```
        location /manage/ {
            proxy_pass http://EapiUpstream/manage/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        location / {
            proxy_pass http://EapiUpstream/manage/;
            proxy_set_header   Host             $host;
            proxy_set_header   X-Real-IP        $remote_addr;
            proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;

        }
```

导致传到 JavaWeb 的URL发生了变化:

```
http://eapi.cncounter.com/manage/paper/export/N2%E7%BA%A7%E6%8A%A4%E7%90%86%E4%B8%89%E5%9F%BA%E7%90%86%E8%AE%BA%E8%80%83%E8%AF%95-%E5%A4%8D{}%E5%88%B6%E5%AD%A6%E8%80%8C%E6%80%9D.docx
```

将其中的 `%7B%7D` 解码为 `{}` 才往下传递。

导致Java服务器抛出异常:


```
Caused by: java.net.URISyntaxException: Illegal character in path at index 137: http://eapi.cncounter.com/manage/paper/export/N2%E7%BA%A7%E6%8A%A4%E7%90%86%E4%B8%89%E5%9F%BA%E7%90%86%E8%AE%BA%E8%80%83%E8%AF%95-%E5%A4%8D{}%E5%88%B6%E5%AD%A6%E8%80%8C%E6%80%9D.docx
```


Java测试代码如下:

```
try {
    URI uri = new URI("http://eapi.cncounter.com/manage/paper/export/N2%E7%BA%A7%E6%8A%A4%E7%90%86%E4%B8%89%E5%9F%BA%E7%90%86%E8%AE%BA%E8%80%83%E8%AF%95-%E5%A4%8D{}%E5%88%B6%E5%AD%A6%E8%80%8C%E6%80%9D.docx");
} catch (URISyntaxException e) {
    e.printStackTrace();
}
```

其中大部分字符都原有传递, 为什么花括号就解析出来不进行转码?



如何处理?

理想的方式是`proxy_pass` 只给定服务和端口,不指定URI部分。 

```
proxy_pass http://EapiUpstream
```

但需要代码相对规范, 有些不规范的前端代码需要进行修改。。。


2018年8月20日
