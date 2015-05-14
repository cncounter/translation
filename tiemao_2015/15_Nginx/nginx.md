# CentOS下yum安装 Nginx

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

