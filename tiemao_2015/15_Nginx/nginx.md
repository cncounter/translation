# CentOS下yum安装 Nginx


## 安装Nginx

### 查看相关信息
	
	yum info nginx
	
	yum info httpd


### 移除 httpd,也就是 Apache

	yum remove httpd -y
	
	
###  安装 nginx

	yum install nginx -y


### 如果没有找到nginx下载源,那么,可以执行rpm

	sudo rpm -ivh http://nginx.org/packages/centos/6/noarch/RPMS/nginx-release-centos-6-0.el6.ngx.noarch.rpm

其他平台或版本的包请访问: [http://nginx.org/packages/centos/](http://nginx.org/packages/centos/)

	
	
###设置 nginx 自启动

	chkconfig nginx on
	
### 查看服务自启动情况

	chkconfig
	
### 启动nginx服务

	service nginx start
	
	
###  查看端口监听状态

	netstat -ntl
	
> 此时你可以访问试试了
> 
> 例如: http://192.168.1.111:8080 等
>	
> 如果访问不了,请 ping 一下试试

### 查看 iptables 防火墙状态

	service iptables status
	
### 关闭防火墙,简单粗暴的

	service iptables stop

>如果你没有权限执行这些操作，你可能需要使用 `sudo` 权限


### 配置Nginx反向代理

> **/etc/nginx/nginx.conf**


	
	user              nginx;
	worker_processes  1;
	
	error_log  /var/log/nginx/error.log;
	
	pid        /var/run/nginx.pid;
	
	events {
	    use epoll;  
	    worker_connections  1024;
	}
	
	http {
	    include       /etc/nginx/mime.types;
	    default_type  application/octet-stream;
	
	    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
	                      '$status $body_bytes_sent "$http_referer" '
	                      '"$http_user_agent" "$http_x_forwarded_for"';
	
	    access_log  /var/log/nginx/access.log  main;
	
	    sendfile        on;
	    #tcp_nopush     on;
	
	    #keepalive_timeout  0;
	    keepalive_timeout  65;
	
	    gzip  on;
	    
	    # Load config files from the /etc/nginx/conf.d directory
	    # The default server is in conf.d/default.conf
	    include /etc/nginx/conf.d/*.conf;
	
	    include     upstream.conf;
	    include     cncounter.com.conf; 
	
	}


 **注意**: upstream.conf 和 cncounter.com.conf 是 http的子元素.


> 做负载的配置: `/etc/nginx/upstream.conf`

	upstream www.cncounter.com {
	    server 127.0.0.1:8080;
	}


> 站点配置文件: **/etc/nginx/cncounter.com.conf**


	server
	{
	    listen         80;
	    server_name    www.cncounter.com;
	    index index.jsp;
	    root    /usr/local/cncounter_webapp/cncounter/;
	    location ~ ^/NginxStatus/ {
		stub_status on;
		access_log off;
	    }
	
	    location / {
	         root    /usr/local/cncounter_webapp/cncounter/;
	         proxy_redirect off ;
	         proxy_set_header Host $host;
	         proxy_set_header X-Real-IP $remote_addr;
	         proxy_set_header REMOTE-HOST $remote_addr;
	         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	         client_max_body_size 50m;
	         client_body_buffer_size 256k;
	         proxy_connect_timeout 30;
	         proxy_send_timeout 30;
	         proxy_read_timeout 60;
	         proxy_buffer_size 256k;
	         proxy_buffers 4 256k;
	         proxy_busy_buffers_size 256k;
	         proxy_temp_file_write_size 256k;
	         proxy_next_upstream error timeout invalid_header http_500 http_503 http_404;
	         proxy_max_temp_file_size 128m;
	         proxy_pass    http://www.cncounter.com;
	    }
	}


## 重启服务

	service nginx stop
	
	service nginx start

	service nginx reload





## Nginx 启用 https

> 参考 [http://www.cnblogs.com/tintin1926/archive/2012/07/12/2587311.html](http://www.cnblogs.com/tintin1926/archive/2012/07/12/2587311.html)


首先确保机器上安装了openssl和openssl-devel

	yum install -y openssl
	yum install -y openssl-devel


然后就是自己颁发证书给自己: (没有折行, linux 支持 \回车 )

进入 nginx 配置目录:

	cd /etc/nginx

生成服务端rsa私钥:

	openssl genrsa -des3 -out server.rsa.key 1024

接着会要求你输入2次密码口语,输入后回车即可.

生成证书:

	openssl req -new -key server.rsa.key -out server.csr


去除保护口令的私钥文件:

	openssl rsa -in server.rsa.key -out server_nopwd.key

生成自签名证书:

	openssl x509 -req -days 3650 -in server.csr  -signkey server_nopwd.key -out server.crt


至此证书已经生成完毕，下面就是配置nginx


	server {
	    listen 443 ssl;
	    ssl_certificate  /etc/nginx/server.crt;
	    ssl_certificate_key  /etc/nginx/server_nopwd.key;
	}


参考了 Nginx环境下http和https(ssl)共存的方法:  [http://www.abcde.cn/info/show-26-1511-1.html](http://www.abcde.cn/info/show-26-1511-1.html)


然后重启nginx即可。



	至此已经完成了https服务器搭建，但如何让浏览器信任自己颁发的证书呢？

	今天终于研究捣鼓出来了，只要将之前生成的server.crt文件导入到系统的证书管理器就行了，
	
	具体方法：

	控制面板 -> Internet选项 -> 内容 -> 发行者 -> 受信任的根证书颁发机构 
		-> 导入 -》选择server.crt


简单配置示例:

> renfufei.com.conf

	server
	{
	    listen 80;
	    listen 443 ssl;
	    server_name    renfufei.com www.renfufei.com;
	    if ($http_host !~ "^www.renfufei.com$") {
		rewrite  ^(.*)    http://www.renfufei.com$1 permanent;
	    }
	}

> cncounter.com.conf

	server
	{
	    listen 80;
	    listen 443 ssl;
	    server_name    cncounter.com www.cncounter.com;
	    index index.jsp;
	    root    /usr/local/cncounter_webapp/cncounter/;
	    location ~ ^/NginxStatus/ {
		stub_status on;
		access_log off;
	    }
	    if ($http_host !~ "^www.cncounter.com$") {
		rewrite  ^(.*)    http://www.cncounter.com$1 permanent;
	    }

	    location / {
		 root    /usr/local/cncounter_webapp/cncounter/;
		 proxy_redirect off ;
		 proxy_set_header Host $host;
		 proxy_set_header X-Real-IP $remote_addr;
		 proxy_set_header REMOTE-HOST $remote_addr;
		 proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		 client_max_body_size 50m;
		 client_body_buffer_size 256k;
		 proxy_connect_timeout 30;
		 proxy_send_timeout 30;
		 proxy_read_timeout 60;
		 proxy_buffer_size 256k;
		 proxy_buffers 4 256k;
		 proxy_busy_buffers_size 256k;
		 proxy_temp_file_write_size 256k;
		 proxy_next_upstream error timeout invalid_header http_500 http_503 http_404;
		 proxy_max_temp_file_size 128m;
		 proxy_pass    http://www.cncounter.com;
	    }
	}


> nginx.conf

	user              nginx;
	worker_processes  1;
	error_log  /var/log/nginx/error.log;
	pid        /var/run/nginx.pid;

	events {
	    use epoll;  
	    worker_connections  1024;
	}

	http {
	    include       /etc/nginx/mime.types;
	    default_type  application/octet-stream;

	    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
			      '$status $body_bytes_sent "$http_referer" '
			      '"$http_user_agent" "$http_x_forwarded_for"';

	    access_log  /var/log/nginx/access.log  main;

	    sendfile        on;
	    #tcp_nopush     on;
	    keepalive_timeout  65;
	    gzip  on;
	    
	    include /etc/nginx/conf.d/*.conf;
	    include     upstream.conf;
	    include     cncounter.com.conf; 
	    include     renfufei.com.conf;
	}

[杯具，好像https还是访问不了].


