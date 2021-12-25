# 一些好用的 alias 命令

Linux和MaxOSX的 alias 命令使用技巧

因为 gist 被强的比较厉害，所以只好放到 repo 中。

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

- 清理屏幕`clear`: 使用 `Ctrl` + `l`
- 光标退回行首`ahead`: 使用 `Ctrl` + `a`
- 光标退回行尾`end`: 使用 `Ctrl` + `e`


- 从历史记录查找`research?`: `Ctrl + r` 进入, 然后输入模糊搜索字符串, 可再次使用 `Ctrl + r` 往前查找;

Vim快捷键:

- 光标退回行首: 在命令模式下输入数字 `0`
- 光标退回行尾: 在命令模式下输入数字 `$`




相关链接:

- Bash 脚本教程: <https://wangdoc.com/bash/index.html>
