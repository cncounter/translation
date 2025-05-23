# 一个WordPress连续登录失败的问题排查

## 1. 问题背景

登录请求URL:

> Request URL:
> `https://www.xxxxxx.com/wp-login.php`

返回的响应头信息是:

> location:
> `https://www.xxxxxx.com/wp-admin/`


证明登录成功。

接下来浏览器自动跳转, 请求头信息是:

```
Request URL: https://www.xxxxxx.com/wp-admin/
Request Method: GET
Status Code: 302 Found
Remote Address: 8.210.93.167:443
Referrer Policy: strict-origin-when-cross-origin
```

结果响应信息变成这样:

> location:
> `https://www.xxxxxx.com/wp-login.php?redirect_to=https%3A%2F%2Fwww.xxxxxx.com%2Fwp-admin%2F&reauth=1`

再次要求登录。 

试了很多次，都是一样的结果。

## 2. 解决方案搜索

使用搜索引擎，搜索关键字: `wordpress 不能登录`。

找到一篇知乎的文章: 

> [网站WordPress后台死活不能登录怎么办？](https://www.zhihu.com/question/268329696)

尝试了里面提供的多种方法， 都不能解决，还是同样的错误。


## 3. 问题定位

既然处理不了，那就看看Nginx日志是否报错。


```sh
# 进入Nginx日志目录
cd /var/log/nginx/

# 查看当前目录下的文件列表
# ls -l
ll


# 这里发现了一个197MB的错误日志文件
# -rw-r--r-- 1 nginx nginx  197636096 5月  13 11:27 error.log

# 查看
tail -n 100 error.log

```

结果, 在这里发现了很多条类似的错误日志。

摘录如下:

```js

2025/05/13 11:19:26 [error] 16175#0: *10189413 FastCGI sent in stderr: "PHP message: WordPress数据库查询SHOW FULL COLUMNS FROM `wp_options`时发生Disk full (/tmp/#sql_543_0.MAI); waiting for someone to free some space... (errno: 28 "No space left on device")错误，这是由require('wp-load.php'), require_once('wp-config.php'), require_once('wp-settings.php'), do_action('init'), WP_Hook->do_action, WP_Hook->apply_filters, call_user_func_array, wp_cron, spawn_cron, set_transient, update_option查询的
PHP message: WordPress数据库查询SHOW FULL COLUMNS FROM `wp_usermeta`时发生Disk full (/tmp/#sql_543_0.MAI); waiting for someone to free some space... (errno: 28 "No space left on device")错误，这是由wp_signon, wp_set_auth_cookie, WP_Session_Tokens->create, WP_Session_Tokens->update, WP_User_Meta_Session_Tokens->update_session, WP_User_Meta_Session_Tokens->update_sessions, update_user_meta, update_metadata查询的" while reading response header from upstream, client: 183.225.154.250, server: xxxxxx.com, request: "POST /wp-login.php HTTP/1.1", upstream: "fastcgi://127.0.0.1:9000", host: "www.xxxxxx.com", referrer: q^C
```

找到其中的关键原因, `Disk full`, 也就是磁盘满了。

使用 `df -h` 命令查看:

```js
# 查看磁盘使用情况
df -h

# 文件系统      容量    已用     可用  已用%    挂载点
# /dev/vda1    40G    38G      0    100%    /
```

确认是磁盘空间占满导致的问题。


## 4. 排查过程


> 磁盘空间用满, 或者内存空间溢出, 是很多服务器端故障问题的原因。 
> 排查问题时, 可以优先排查这一类问题。


我们可以使用 `du -sh` 命令来辅助进行磁盘空间占用情况排查, 以查看各个目录占用的空间。


```sh
# 进入需要排查的目录
cd /

# 查看当前目录下的磁盘空间占用情况
du -sh *
```

得到的结果大致如下:

```sh
2.1G	data
1.6G	root
23G	    usr
9.3G	var
```

简单分析, 这里的情况是：

- `/usr` 目录占用了 23GB
- `/var` 目录占用了 9.3GB

有了这个信息, 我们就可以依次进入各个目录, 排查到底是哪些文件或目录占用了磁盘空间。


```sh

# 依次进入各个子目录排查
cd /usr/
du -sh *

cd /usr/local/
du -sh *

# 发现了一个目录使用的磁盘空间较多
# 17G	 www

cd /usr/local/www
du -sh *

# 继续往下查找
# 17G	tomcat-8.0.48


cd /usr/local/www/tomcat-8.0.48
du -sh *

# 17G	logs

# 继续往下排查
cd /usr/local/www/tomcat-8.0.48/logs/
# 查看文件列表
ll 

```

通过 `ll` 命令, 发现该目录下有大量的文件,

这里列出部分:

```js
ll
总用量 5129216
-rw-r--r-- 1 root root    6955733 11月  1 2020 access_log.2020-11-01.txt
-rw-r--r-- 1 root root    6956111 11月  3 2020 access_log.2020-11-02.txt
......
-rw-r--r-- 1 root root     250140 5月  12 23:44 access_log.2025-05-12.txt
-rw-r--r-- 1 root root      44236 5月  13 11:36 access_log.2025-05-13.txt

-rw-r--r-- 1 root root       1115 11月  1 2020 catalina.2020-11-01.log
-rw-r--r-- 1 root root       3580 11月  2 2020 catalina.2020-11-02.log
......
-rw-r--r-- 1 root root       6473 5月  11 21:05 catalina.2025-05-11.log
-rw-r--r-- 1 root root       8669 5月  12 23:18 catalina.2025-05-12.log

-rw-r--r-- 1 root root 1198692264 5月  13 11:36 catalina.out
-rw-r--r-- 1 root root 2671361318 5月  13 11:36 gc.log

-rw-r--r-- 1 root root       5527 11月  1 2020 localhost.2020-11-01.log
-rw-r--r-- 1 root root       4950 11月  3 2020 localhost.2020-11-03.log
......
-rw-r--r-- 1 root root       5887 5月  12 07:32 localhost.2025-05-12.log
-rw-r--r-- 1 root root       5887 5月  13 06:53 localhost.2025-05-13.log
```

可以看到:

- `catalina.out` 文件的大小是 `1198692264`, 大约 1.1GB.
- `gc.log`       文件的大小是 `2671361318`, 大约 2.6GB.
- 此外, 还有大量的从 2020 年开始的 Tomcat 日志。


## 5. 清理空间

确实是很久没有清理日志文件了。

如果是生产环境，那么一般会配置定期归档或清理的命令。

这里因为是个人站点, 所以直接把比较老的文件删除即可。

```sh

# 进入目标目录
cd /usr/local/www/tomcat-8.0.48/logs/

# 列出文件列表
ll 

# 执行清理
# rm -f localhost.2025-04* localhost.2025-03*
# rm -f localhost.2025-02* localhost.2025-01*
# rm -f localhost.2024* localhost.2023* localhost.2022* 
# rm -f localhost.2021* localhost.2020*


# 继续列出文件列表
ll 

# 继续执行清理
# rm -f catalina.2025-04* catalina.2025-03*
# rm -f catalina.2025-02*  catalina.2025-01*
# rm -f catalina.2024* catalina.2023* catalina.2022* 
# rm -f catalina.2021* catalina.2020*


# 继续列出文件列表
ll 

# 继续执行清理
# rm -f access_log.2025-04* access_log.2025-03*
# rm -f access_log.2025-02*  access_log.2025-01*
# rm -f access_log.2024* access_log.2023* access_log.2022* 
# rm -f access_log.2021* access_log.2020*


```



## 6. 处理结果

在浏览器重新页面，登录成功。 此问题处理完成。



## 7. 后续优化


如果是持续运维和升级的系统，一般不会有这么大的日志文件。

如果是容器化的部署系统，也会有很多类似的清理脚本来辅助运行。


为了防止出现类型情况, 需要执行一些优化操作:

- 1. 设置JVM的GC日志大小和滚动策略。 比如这篇文章: 

> [ROTATING GC LOG FILES](https://blog.gceasy.io/rotating-gc-log-files/)

- 2. 设置日志定期清理任务, 比如清理3个月之前的，满足特定前缀的日志文件。

> [How to rotate catalina.out without restarting tomcat](https://www.mooreds.com/wordpress/archives/415)

- 3. `catalina.out` 文件切割或清空。

> [How to Rotate Tomcat catalina.out](https://dzone.com/articles/how-rotate-tomcat-catalinaout)


