# 采用 jstatd 监控服务器

## 1. 安装JDK

	sudo yum install -y java-1.8.0-openjdk*

## 2. 配置环境变量与 JAVA_HOME

	export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.102-1.b14.el7_2.x86_64

请将此 export 内容加入 `/etc/rc.d/rc.local` 或者其他启动文件。

如果版本号不一致,则需要自己查找 `JAVA_HOME`

关于如何查找 `JAVA_HOME`, 详情参见: [查找YUM 安装的 `JAVA_HOME`:](http://blog.csdn.net/renfufei/article/details/52621034)


## 3. 配置 jstatd.all.policy

	mkdir -p /etc/java/
	cd /etc/java/
	vim jstatd.all.policy

文件内容如下:

	grant codebase "file:${java.home}/../lib/tools.jar" { 
	   permission java.security.AllPermission; 
	};

完成后保存.

## 4. 后台启动 jstatd

	jstatd -J-Djava.security.policy=jstatd.all.policy -J-Djava.rmi.server.hostname=198.11.188.188 &

其中 198.11.188.188 是公网IP，如果没有公网，那么就是内网IP。


## 5. 使用 jvisualvm, 或者 jconsole 连接远程服务器。

其中IP为 198.11.188.188, 端口号是默认的 1099. 

当然,端口号可以通过参数自定义。


CPU图形没有显示 ,原因是 jstatd 不支持监控CPU。

说明: 客户端与服务器的JVM大版本号必须一致或者兼容。


## 参考:

- Java VisualVM远程监控JVM: [https://yq.aliyun.com/articles/38757](https://yq.aliyun.com/articles/38757)

- 查找YUM 安装的 JAVA_HOME: [http://blog.csdn.net/renfufei/article/details/52621034](http://blog.csdn.net/renfufei/article/details/52621034)
