# SSH隧道连接内网MySQL

### 背景

> 生产环境, 使用的阿里云VPC专有网络。MySQL和其他Web服务都部署在专网内部，对外不提供直连地址。 当然, 我们有自己的一些跳板机（具备公网IP和内网IP两张网卡。）


### 可选方案

大部分MySQL的 GUI 图形界面客户端, 都直接提供了TCP/IP协议方式和SSH方式， 比如 Navicat 和 HeidiSQL等。

> 这里吐槽一下 Navicat 这家香港公司, 不思进取, 提供的各种工具思路都很奇葩。














最后, 推荐一款国产的跨数据库迁移工具, DB2DB, 亲测好用, 非常强悍, 也很友好。 官网地址: <http://www.szmesoft.com/DB2DB>

> DB2DB 是目前经过测试速度最快、最稳定实现多种数据库之间进行数据转换的工具。支持 SQL Server、MySQL、SQLite、PostgresSQL、Access 等多种数据库类型。


日期: 2018年11月2日

