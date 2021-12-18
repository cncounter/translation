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



相关链接:

- Bash 脚本教程: <https://wangdoc.com/bash/index.html>
