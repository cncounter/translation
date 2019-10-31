# Datadog-Agent与DogStatsD简单配置


Datadog Agent则是在本地环境安装的代理服务器。

安装Agent请参考链接:

https://docs.datadoghq.com/getting_started/agent/?tab=datadogussite

在其中找到对应的平台，按提示安装即可。

默认安装只需要配置API-key 即可。

```
api_key: XXXXXXXXXXXXXXXXXXXXXXXXX
```

查看API-Key:

https://app.datadoghq.com/account/settings#api

各个平台的配置方法不一样, 比如 Docker 安装只能通过环境变量设置。

安装完成后启动.

Mac 启动后会有一个小骨头的图标。 然后可以打开 Web UI. 进入 Setting修改配置，保存，然后重启 DataDog Agent 即可生效。

需要注意的是 Web UI 里面 CTRL+F 查找配置并不太方便，可能是为了提高性能使用了懒加载技术。


`StatsDClient` 通过UDP协议连接 StatsD 服务器。好处是即使 StatsD 挂掉，也不影响应用程序的执行。

DogStatsD 是 Datadog Agent 内置的一款 StatsD 实现。

`NonBlockingStatsDClient` 是Java实现类。


配置:

```
############################
## DogStatsD Configuration ##
############################
# 开启 DogStatsD 标志
use_dogstatsd: true
# 端口号
dogstatsd_port: 8125
# 绑定的host/IP
bind_host: 0.0.0.0
```

保存、重启Agent即可。

其他机器只需要配置对应的 host 与 port 即可。



## 参考链接

OpenPort:

https://docs.datadoghq.com/agent/guide/network/?tab=agentv6#open-ports


设置DogStatsD:

https://docs.datadoghq.com/developers/dogstatsd/?tab=java

2019年10月31日
