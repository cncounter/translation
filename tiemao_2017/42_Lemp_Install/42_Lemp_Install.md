# CentOS安装Lemp环境和Wordpress

> Lemp:  Linux, nginx (发音为 Engine x), MySQL, 以及 PHP. 

## 1. 安装YUM仓库

因为Centos默认不能直接安装nginx，所以需要开启 EPEL, 如果已开启请忽略。

查询是否安装了 epel:

```
sudo yum -y list epel*

```

安装命令如下:

```
sudo yum -y install epel-release

```

## 2. 安装 MySQL

MySQL创始人现在维护的是开源的 MariaDB 分支，所以此处使用 MariaDB。
程序所使用的全部API都兼容 MySQL，只是提供的部分管理维护工具不一样。

详细的安装教程请参考: <http://blog.csdn.net/renfufei/article/details/17616549>


### 2.1 添加 yum 数据源;

建议命名为 MariaDB.repo 类似的名字：

```
sudo vim /etc/yum.repos.d/MariaDB.repo  

```

如果是CentOS6, 添加如下的内容:

```
# MariaDB 10.2 CentOS repository list - created 2017-09-30 08:26 UTC
# http://downloads.mariadb.org/mariadb/repositories/
[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/10.2/centos6-amd64
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1

```


如果是CentOS7, 添加如下的内容:

```
# MariaDB 10.2 CentOS repository list - created 2017-09-30 08:28 UTC
# http://downloads.mariadb.org/mariadb/repositories/
[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/10.2/centos7-amd64
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1

```

可以看到,注释里提供了下载页面的地址, 其他系统可以复制链接打开查看。

> 如果网络环境特殊, https 不可用的话, 可以设置 `gpgcheck=0`


### 2.2 查询是否已经安装MariaDB

查询是否安装了 MariaDB:

```
sudo yum -y list MariaDB*

```


### 2.2 安装MariaDB


安装 MariaDB 的命令:

```
sudo yum -y install MariaDB-server MariaDB-client

```

yum 命令的 -y 选项指定不需要询问直接安装。 否则安装每个软件之前前,都会提示输入[`y`]确认。


### 2.3 启动MariaDB

虽然mysql服务器的程序名字是 `mysqld`, 但是安装的服务叫 `mysql`:

```
sudo service mysql start

```

因为安装好以后的root密码是空,所以需要设置; 

```
sudo mysqladmin -u root password 'root'
```

本地访问:

```
sudo mysql -u root -proot

```


## 3. 安装 nginx


### 4.1 查询是否安装了 nginx

```
sudo yum -y list nginx

```


### 4.2 安装Nginx的命令

```
sudo yum -y install nginx
```

启动Nginx：

```
sudo nginx start
```


### 4.3 查询本机IP

```
ifconfig eth0 | grep inet | awk '{ print $2 }'
```


### 4.4 配置 nginx

自动安装的 nginx 配置文件位于 `/etc/nginx` 目录:

```
cd /etc/nginx
ls -l 
cat /etc/nginx/nginx.conf
```

可以看到，http层级下有这么这么一句:

```
include /etc/nginx/conf.d/*.conf;
```

意思是启动时会自动包含 `/etc/nginx/conf.d/` 下面的 `*.conf` 配置文件。

所以如果网站域名为: `www.91fache.com`,那么可以配置对应的文件:

```
sudo vim /etc/nginx/conf.d/91fache.com.conf

```

也可以是其他有意义的文件名。

在其中输入适当的内容, 例如:

```

server {
    listen       80;
    server_name  91fache.com *.91fache.com;

   
    location / {
        root   /usr/share/nginx/html;
        index index.php  index.html index.htm;
    }

    error_page  404              /404.html;
    location = /404.html {
        root   /usr/share/nginx/html;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    location ~ \.php$ {
        root           /usr/share/nginx/html;
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME   $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }
}

```

其中,  `127.0.0.1:9000` 是 php 监听的端口号, 可以通过命令查看:

```
sudo netstat -ntlp

```



### 4.5 重新加载nginx配置

nginx支持热重启.

```
sudo nginx -t
sudo nginx -s reload

```

选项 `-t` 是测试(test)配置文件是否合法。

选项 `-s` 是给运行中的nginx进程发信号(signal)。




## 4. 安装 PHP


### 4.1 查询是否安装了 php:

```
sudo yum -y list php-fpm php-mysql

```

### 4.2 安装php的命令:

```
sudo yum -y install php-fpm php-mysql

```

### 4.3 修改 PHP 配置信息:

```
sudo vim /etc/php.ini
```

将配置 `cgi.fix_pathinfo=1` 修改为:

```
cgi.fix_pathinfo=0
```

这样会比较安全,详情请搜索。 如果新版本已经注释,则不需要管这个配置。


> vim 快捷搜索: 先按 ESC, 再以斜杠加搜索内容回车,例如: `/fix_pathinfo`。 查找下一个输入小写的 `n` 即可。


### 4.4 配置 php-fpm:

```
sudo vim /etc/php-fpm.d/www.conf

```

将 user 和 group 的配置,从 apache 替换为 nginx

```
; Unix user/group of processes
; Note: The user is mandatory. If the group is not set, the default user's group
;       will be used.
; RPM: apache Choosed to be able to access some dir as httpd
; user = apache
user = nginx
; RPM: Keep a group allowed to write in log dir.
; group = apache
group = nginx
```

#### 4.4.1 创建测试页面

```
sudo vim /usr/share/nginx/html/info.php

```

输入内容:

```
<?php
phpinfo();
?>
```



保存之后, 重启 php-fpm:



### 4.5 重启 PHP:

```
sudo service php-fpm restart

```

重启 nginx:

```
sudo nginx -s reload

```


然后可以进行测试, 本地简单地修改DNS映射。

Linux 使用下面的命令.

```
sudo vim /etc/hosts

```

Windows则是使用管理员模式编辑 `C:\Windows\System32\drivers\etc\hosts` 文件。

添加类似这样的内容:

```
192.ip.ip.ip test.91fache.com
```




接着访问下面的地址,应该就可以了:

<http://test.91fache.com/info.php>

如果不行, 试试重启 nginx 或者 重启浏览器。


## 5. 设置自动启动

```
sudo chkconfig --levels 235 mysqld on
sudo chkconfig --levels 235 nginx on
sudo chkconfig --levels 235 php-fpm on

```

## 6. 安装 wordpress

WordPress 是世界上最著名的博客管理系统,也叫 CMS(Content Management System)。插件众多、使用广泛。


### 6.1 MySQL数据库与账号授权

创建给WordPress使用的MySQL账号。

首先, 登录到 mysql 服务器, 例如:

```
mysql -u root -proot

--  执行 SQL 命令; 分号结尾
CREATE DATABASE wordpress;

CREATE USER wordpress@localhost IDENTIFIED BY 'wordpress';

GRANT ALL PRIVILEGES ON wordpress.* TO wordpress@localhost IDENTIFIED BY 'wordpress';

FLUSH PRIVILEGES;

exit

```



### 6.2 安装 php-gd 模块

用来执行图片压缩, 不安装可不可以?

```
sudo yum -y install php-gd
```

然后可能需要重启 nginx;



### 6.3 下载最新版wordpress

```
mkdir -p /usr/local/download
cd /usr/local/download
wget -O wordpress.latest.tar.gz https://wordpress.org/latest.tar.gz

```

解压,:

```
sudo mkdir -p /usr/share/nginx/html/wp-content/uploads
sudo tar zxf wordpress.latest.tar.gz
sudo mv wordpress/* /usr/share/nginx/html/
```

修改文件:

```
sudo chown -R nginx:nginx /usr/share/nginx/html/*

```



### 6.4 配置wordpress

访问自定义的网址: <http://test.91fache.com/>

然后会自动跳转到设置页面.

首先选择语言，然后开始设置。

其中提示:

> 我们会使用这些信息来创建一个wp-config.php文件。	如果自动创建未能成功，不用担心，您要做的只是将数据库信息填入配置文件。您也可以在文本编辑器中打开wp-config-sample.php，填入您的信息，并将其另存为wp-config.php。 


依次配置数据库名字,用户名,密码。当然，上面的示例中我们设置的都是 `wordpress`。 数据库主机保持默认值 localhost。 提交即可。

如果权限不对，不能写入wp-config.php文件(可能是nginx用户没有 /usr/share/nginx/html 目录的写入权限)。

> 抱歉，我不能写入wp-config.php文件。
> 
> 您可以手工创建wp-config.php文件并将以下信息贴入其中。

那么, 通过命令在后台手工配置即可:

```
cd  /usr/share/nginx/html
cp wp-config-sample.php wp-config.php
vim wp-config.php

```

如果还没有权限，可以试试 sudo:

```
sudo touch wp-config.php
sudo chmod 666 wp-config.php
sudo vim wp-config.php
```


参考: 


- <https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-on-centos-6>

- <https://www.digitalocean.com/community/tutorials/how-to-install-wordpress-on-centos-7>


- <https://www.digitalocean.com/community/tutorials/initial-server-setup-with-centos-7>


- <https://codex.wordpress.org/Nginx>

