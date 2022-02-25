# 一些好用的 alias 命令

Linux和MaxOSX的 alias 命令使用技巧

因为 gist 被强的比较厉害，所以只好放到 repo 中。

# alias

可以放到 `~/.bash_profile` 文件中, 或者

```shell
# SYS ALIAS
# ll显示隐藏文件
alias ll='ls -lAF'

# docker 快捷命令
alias dc='docker-compose'

# 查看Linux端口监听
alias port='netstat -ntlp'

# 查看MAC端口号监听
alias port='sudo lsof -iTCP -sTCP:LISTEN -n -P'

# 统计git仓库的代码行数
alias lines='git ls-files | xargs wc -l | grep total'


# set history format
export HISTTIMEFORMAT='%F %T  '
export HISTSIZE=10000
export HISTIGNORE='pwd:ls:ll:history:exit'

```

如果你有好用的alias，欢迎补充: pr, wiki, comment 都可以。


# shell

每日一个shell命令:


```shell
# 每日一个shell命令
cncounter:CODE_ALL renfufei$ type ls
ls is hashed (/bin/ls)
cncounter:CODE_ALL renfufei$ type ll
ll is aliased to 'ls -lAF'
cncounter:CODE_ALL renfufei$ type echo
echo is a shell builtin
cncounter:CODE_ALL renfufei$ type java
java is /Users/renfufei/.jenv/shims/java
cncounter:CODE_ALL renfufei$ which java
/Users/renfufei/.jenv/shims/java
cncounter:CODE_ALL renfufei$ whereis java
/usr/bin/java
```


shell快捷键(注意默认不是vi/Vim的快捷键, 而是emacs的快捷键):

```shell

- 清理屏幕`clear`: 使用 `Ctrl` + `l`
- 光标退回行首`ahead`: 使用 `Ctrl` + `a`
- 光标退回行尾`end`: 使用 `Ctrl` + `e`


- 从历史记录查找`research?`: `Ctrl + r` 进入, 然后输入模糊搜索字符串, 可再次使用 `Ctrl + r` 往前查找;

Vim快捷键:

- 光标退回行首: 在命令模式下输入数字 `0`
- 光标退回行尾: 在命令模式下输入数字 `$`
```


# 系统工具安装

```shell
# 安装域名bind查询工具
yum -y install bind-utils

# 安装网络监控检测工具
yum -y install net-tools

# 安装系统状态监控工具
yum -y install sysstat

```


# dns

```shell

# CentOS查询哪个工具包支持nslookup
yum provides nslookup

# CentOS系统安装nslookup工具
yum -y install bind-utils

# 查看帮助
man nslookup


# DNS查询工具: nsloopup
$ nslookup www.cncounter.com
Server:		114.114.114.114
Address:	114.114.114.114#53

Non-authoritative answer:
Name:	www.cncounter.com
Address: 8.210.93.167

# DNS查询工具: host
$ host www.cncounter.com
www.cncounter.com has address 8.210.93.167

# DNS查询工具: dig
$ dig github.com

; <<>> DiG 9.10.6 <<>> github.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 63069
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;github.com.			IN	A

;; ANSWER SECTION:
github.com.		47	IN	A	20.205.243.166

;; Query time: 81 msec
;; SERVER: 114.114.114.114#53(114.114.114.114)
;; WHEN: Fri Feb 25 10:48:10 CST 2022
;; MSG SIZE  rcvd: 55

```


相关链接:

Bash 脚本教程: <https://wangdoc.com/bash/index.html>


Github仓库链接: <https://github.com/cncounter/translation/tree/master/tiemao_2021/27_shell_alias>

Gitee仓库链接: <https://gitee.com/cncounter/translation/tree/master/tiemao_2021/27_shell_alias>
