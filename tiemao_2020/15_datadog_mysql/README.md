

DataDog集成MySQL的配置：

> https://docs.datadoghq.com/integrations/mysql/


sudo su


安装:

```
DD_AGENT_MAJOR_VERSION=7 DD_API_KEY=xxxxxx bash -c "$(curl -L https://raw.githubusercontent.com/DataDog/datadog-agent/master/cmd/agent/install_script.sh)"

```

如果网络连接失败，则可以下载到本地再执行:

```
DD_AGENT_MAJOR_VERSION=7 DD_API_KEY=xxxxxx bash -c ./install_script.sh

```


If you ever want to stop the Agent, run:

     systemctl stop datadog-agent

And to run it again run:

     systemctl start datadog-agent



mysql --defaults-file=/etc/mysql/debian.cnf

创建用户:


CREATE USER 'datadog'@'localhost' IDENTIFIED BY 'datadog';


# MySQL 8.0+ 使用

CREATE USER 'datadog'@'localhost' IDENTIFIED WITH mysql_native_password by 'datadog';




cd /etc/datadog-agent/conf.d/mysql.d/
cp -a conf.yaml.example conf.yaml





。
