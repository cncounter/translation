# 一些好用的 alias 命令

Linux和MaxOSX的 alias 命令使用技巧

因为 gist 被强的比较厉害，所以只好放到 repo 中。

# alias

注意: 等号两边不能有空格;

可以放到 `~/.bash_profile` 文件中;

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

# MAC清理DNS缓存
alias dns='sudo killall -HUP mDNSResponder'


# set history format
export HISTTIMEFORMAT='%F %T  '
export HISTSIZE=10000
export HISTIGNORE='pwd:ls:ll:history:exit'

```

或者放到 `~/.bashrc` 之中, 比如 `su` 或者 `sudo su` 或者 `sudo sudo su` 切换root 用户时会生效。

具体的生效规则, 请参考: [Bash 启动环境](https://wangdoc.com/bash/startup.html)

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

# sudo免密

修改 `/etc/sudoers` 文件增加对应的用户名和 `NOPASSWD:` 标志.

```shell
% sudo cat /etc/sudoers
#
# Sample /etc/sudoers file.
#
# This file MUST be edited with the 'visudo' command as root.

##
# User specification
##

# root and users in group wheel can run anything on any machine as any user
#root		ALL = (ALL) ALL
#%admin		ALL = (ALL) ALL

# 免密SUDO, 改成类似这样的格式
root		ALL = (ALL) NOPASSWD:ALL
renfufei	ALL = (ALL) NOPASSWD:ALL
%admin		ALL = (ALL) NOPASSWD:ALL

```

修改完成后, 使用 `:wq!` 保存。 重新启用shell即可。


# 系统工具安装

```shell
# 安装域名bind查询工具
yum -y install bind-utils

# 安装网络监控检测工具
yum -y install net-tools

# 安装系统状态监控工具
yum -y install sysstat

```

# 设置top工具的界面颜色

1. 首先执行top命令:

```sh
top
```

进入top命令的展示界面。

2. 进入颜色设置界面:

在top命令的展示界面, 使用命令 `Shift + z`; 进入颜色设置界面.

3. 修改颜色:

在颜色设置界面, 根据提示, 可以设置的部分包括:

- 1) 目标, 也就是设置哪一部分的颜色, 我们通过输入大写的 `S` 和 `T` 等等, 来切换不同的设置目标。
- 2) 对目标使用哪种颜色, 输入 `0-7` 即可。
- 2) 设置好一种颜色之后, 可以通过第1步的命令切换不同的设置目标。
- 3) 结束设置; 输入 `Enter` 退出设置界面。
- 3) 这一步也 支持 `a` 或 `w` 来切换各种颜色, 不太好用;

这样设置之后, 退回到 top 命令的显示界面。 注意的是这里并没有持久化保存设置

4. 持久化保存设置:

在top命令的展示界面, 使用命令 `Shift + W`; 持久化保存设置.


# 设置命令提示符的颜色


MAC下zsh的设置:

```shell
cat ~/.zshrc

autoload -U colors && colors
PS1="%{$fg[green]%}%n%{$reset_color%}@%{$fg[green]%}%m %{$fg[yellow]%}%~ %{$reset_color%}%% "
```

Linux下的设置:

```shell
cat ~/.bashrc
# .bashrc

# set shell prompt
# https://wangdoc.com/bash/prompt.html
PS1="\[\e[31;1m\][\u@\h \W ]$ \[\e[0m\]"

```

`.bashrc` 与 `.bash_profile` 的区别在于:  `su` 切换用户时不会自动执行 `.bash_profile` 文件;

参考: <https://stackoverflow.com/questions/689765/>



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

# 其他shell命令


```shell
# 查看系统中的shell
cat /etc/shells

# 查看当前用户的HOME目录
echo $HOME


# 查看当前的环境变量
echo $PATH

# 查看当前的SHELL版本
echo $SHELL

# 查看当前脚本名称
echo $0

# 简单示例
/bin/sh
echo $0
echo $SHELL
exit

# 查看当前目录
pwd


```

# MAC相关

解除下载软件来源限制:

```shell
sudo spctl --master-disable
```

例如提示: `无法打开“JD-GUI.app”，因为无法验证开发者`

一个好用的图形化界面shell终端(支持 MAC, Win, Linux):

- [https://github.com/Eugeny/tabby](https://github.com/Eugeny/tabby)

# 相关链接:

Bash 脚本教程: <https://wangdoc.com/bash/index.html>

命令行的艺术: https://github.com/jlevy/the-art-of-command-line/blob/master/README-zh.md


Github仓库链接: <https://github.com/cncounter/translation/tree/master/tiemao_2021/27_shell_alias>

Gitee仓库链接: <https://gitee.com/cncounter/translation/tree/master/tiemao_2021/27_shell_alias>

