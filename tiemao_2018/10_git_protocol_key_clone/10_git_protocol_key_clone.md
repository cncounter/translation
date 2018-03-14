# git 协议与克隆

1. 打开 git-Bash, 或者 Linux 终端。

2. 执行如下命令

```
ssh-keygen -t rsa -b 4096 -C "renfufei@qq.com" -f ~/.ssh/id_rsa_github

```


其中, `-t` 是生成的密钥类型, 支持 `[-t dsa | ecdsa | ed25519 | rsa | rsa1]` 等。

`-b` 是 bits 的意思, 生成多少位的密钥。

`-C` 是 comment 的意思, 备注信息。

`-f` 在此是指定输出的私钥文件位置 `[-f output_keyfile]`。

执行过程中, 要求输入密码, 一般来说留空即可。

```
Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
```

执行完成后, 则会在对应目录下生成私钥文件, 以及公钥文件, 如: id_rsa_github.pub

```
-rw------- 1 root root 3243 Mar 14 16:26 id_rsa_github
-rw-r--r-- 1 root root  737 Mar 14 16:26 id_rsa_github.pub
```

其中 `id_rsa_github` 是私钥文件, 请妥善保管, 不要告诉别人。


而 `id_rsa_github.pub` 是公钥文件, 其中的内容可以复制后配置到 github 个人中心。


创建配置文件:

```
chmod 400 ~/.ssh/id_rsa_github
touch ~/.ssh/config
vim ~/.ssh/config
```

内容如下:

```
host github.com
HostName github.com
IdentityFile ~/.ssh/id_rsa_github
User renfufei
```


然而如果只是下载, 上面这些操作可能并没有什么用。

使用下面的命令进行 clone：


```
git clone -b develop git://github.com/cncounter/cncounter-web.git

```

其中, `-b` 是指定分支, branch;

