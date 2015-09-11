# CentOS下yum安装 Nginx


## 安装Nginx

	# 查看相关信息
	
	yum info nginx
	
	yum info httpd
	
	# 移除 httpd,也就是 Apache
	yum remove httpd -y
	
	
	#  安装 nginx
	yum install nginx -y
	
	
	#设置 nginx 自启动
	chkconfig nginx on
	
	# 查看服务自启动情况
	chkconfig
	
	# 启动nginx服务
	service nginx start
	
	
	#  查看端口监听状态
	netstat -ntl
	
	# 此时你可以访问试试了
	# 例如: http://192.168.1.111:8080 等
	
	# 如果访问不了,请 ping 一下试试
	# 或者查看 iptables 防火墙状态
	service iptables status
	
	# 关闭防火墙,简单粗暴的
	service iptables stop

如果你没有权限执行这些操作，你可能需要使用 `sudo` 权限


# 配置Nginx反向代理

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




> 做负载的配置: **/etc/nginx/upstream.conf**

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








