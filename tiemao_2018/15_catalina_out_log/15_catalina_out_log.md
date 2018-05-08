# 配置 catalina.out 的日志格式

启动 Tomcat 时, catalina.out 中输出的日志格式可能不太理想。

看看某些版本默认的格式:

```
四月 24, 2018 6:49:32 下午 org.apache.catalina.startup.Catalina start
信息: Server startup in 9772 ms
```

有点别扭, 想要调整成下面的格式:

```
24-Apr-2018 18:52:16.134 INFO [main] org.apache.catalina.startup.Catalina.start Server startup in 12631 ms
```

Google搜索 "catalina.out log format", 看到一些文章, 发现通过 `${tomcat-base}/conf/logging.properties` 文件进行配置。

其中, `${tomcat-base}` 指的是具体运行实例的工作目录。 `${tomcat-home}` 则是安装目录。 

也就是说, 一台服务器上, 可以安装一份 Tomcat, 指定多个base工作目录, 则可以启动多个实例。

idea 编辑器就是这么干的。 通过 `jps -v` 可以看到一些端倪。


具体的配置信息如下, 可以直接覆盖这个文件。或者从一个有效的实例下面拷贝即可。

> logging.properties

```

handlers = 1catalina.org.apache.juli.AsyncFileHandler, 2localhost.org.apache.juli.AsyncFileHandler, 3manager.org.apache.juli.AsyncFileHandler, 4host-manager.org.apache.juli.AsyncFileHandler, java.util.logging.ConsoleHandler

.handlers = 1catalina.org.apache.juli.AsyncFileHandler, java.util.logging.ConsoleHandler

############################################################
# Handler specific properties.
# Describes specific configuration info for Handlers.
############################################################

1catalina.org.apache.juli.AsyncFileHandler.level = FINE
1catalina.org.apache.juli.AsyncFileHandler.directory = ${catalina.base}/logs
1catalina.org.apache.juli.AsyncFileHandler.prefix = catalina.

2localhost.org.apache.juli.AsyncFileHandler.level = FINE
2localhost.org.apache.juli.AsyncFileHandler.directory = ${catalina.base}/logs
2localhost.org.apache.juli.AsyncFileHandler.prefix = catalina.

3manager.org.apache.juli.AsyncFileHandler.level = FINE
3manager.org.apache.juli.AsyncFileHandler.directory = ${catalina.base}/logs
3manager.org.apache.juli.AsyncFileHandler.prefix = catalina.

4host-manager.org.apache.juli.AsyncFileHandler.level = FINE
4host-manager.org.apache.juli.AsyncFileHandler.directory = ${catalina.base}/logs
4host-manager.org.apache.juli.AsyncFileHandler.prefix = catalina.

# 关键格式信息在这里!!!
# 也可以是其他的配置, 请自行搜索。

java.util.logging.ConsoleHandler.level = FINE
java.util.logging.ConsoleHandler.formatter = org.apache.juli.OneLineFormatter

############################################################
# Facility specific properties.
# Provides extra control for each logger.
############################################################

org.apache.catalina.core.ContainerBase.[Catalina].[localhost].level = INFO
org.apache.catalina.core.ContainerBase.[Catalina].[localhost].handlers = 2localhost.org.apache.juli.AsyncFileHandler

org.apache.catalina.core.ContainerBase.[Catalina].[localhost].[/manager].level = INFO
org.apache.catalina.core.ContainerBase.[Catalina].[localhost].[/manager].handlers = 3manager.org.apache.juli.AsyncFileHandler

org.apache.catalina.core.ContainerBase.[Catalina].[localhost].[/host-manager].level = INFO
org.apache.catalina.core.ContainerBase.[Catalina].[localhost].[/host-manager].handlers = 4host-manager.org.apache.juli.AsyncFileHandler

```

当然, 能升级最好是升级版本。


更多信息，请参考: <https://tomcat.apache.org/tomcat-8.0-doc/logging.html>

2018年5月7日
