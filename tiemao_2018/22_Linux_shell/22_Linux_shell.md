# Linux常用Shell命令

## 1. 目录相关

### 1.1 cd

`cd` 命令是最常用的命令之一, change directory, 改变命令行当前所处的工作目录。

示例:

```
cd /usr/local/

cd ..

cd local

cd ..

cd ./local

cd ~

```

可以使用相对路径、绝对路径。 其中, `~` 表示用户的家目录(home), 由系统或管理员指定。 `..` 表示上一级目录, 大家都应该很熟悉。


### 1.2 ls

Linux主要是命令行界面进行操作, 某个目录下有哪些文件/文件夹呢? 我们使用 ls 命令来查看。

示例 1.2.1

```
$ cd /usr/local/
$ ls
aegis  etc    include  lib64    share
bin    games  lib      libexec  sbin

```

`ls` 能列出所有文件和目录, 但是很不友好。 


### 1.3 ll

这时候我们需要 `ll` 命令, 按行显示每一个子项(文件/目录等)。

`ll` 是 `ls -l` 的别名, 在 Redhat 和 CentOS 上默认存在。


```
ls -l

ll
```


`ls` 默认只列出常规文件/夹。需要显示所有文件夹, 




```





### 1.3 pwd

`cd` 命令改变当前目录, 那么当前目录到底是什么呢? 我们可以使用 `pwd` 命令来查看。

示例:

```
$ cd /usr/local
$ pwd
/usr/local

$ cd ~
$ pwd
/root

```

###  mkdir




###  echo
###  cat
###  grep
###  tail
###  mv
###  rm
###  cp
###  tar
###  ping
###  ifconfig
###  vi
###  vim
###  exit
###  nohup
###  &
###  export
###  $PATH
###  lsof




