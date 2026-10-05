# 1分钟使用ssh-keygen生成RSA公私钥

[TOC]

## 1. 背景

换了个Mac用户, 需要重新配置相关的环境


```sh
mkdir -p ~/GITHUB_ALL
cd ~/GITHUB_ALL

# 执行clone报错
git clone git@github.com:cncounter/translation.git


Cloning into 'translation'...
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

看来需要生成 ssh 密钥.

## 2. 操作

```sh
# 准备目录
mkdir ~/.ssh 
# 进入目录
cd ~/.ssh

# 查看帮助信息
ssh-keygen --help

# 如果记不住命令, 可以直接使用默认的即可, 默认会生成 rsa 格式的;
# ssh-keygen

# 安静模式
# 生成rsa格式, 
# 2048位, 
# 保存为当前目录下的 id_rsa, 这个名字的私钥系统会默认使用。
# 密码为空
ssh-keygen -q -t rsa -b 2048 -f ./id_rsa -N ''


# 取消生成可以使用 CTRL + C 或者 Command+C
```

生成完成后的文件信息类似这样:


```sh
# ls -l
-rw-------@  1 renfufei  staff  1831  9  7 20:48 id_rsa
-rw-r--r--@  1 renfufei  staff   402  9  7 20:48 id_rsa.pub
```



## 3. 踩坑与经验


如果保存的私钥文件, 不是默认的名字 `id_rsa`, 则需要手动将生成的 ssh key 加载到系统中。

我默认生成的文件名称是 `id_rsa_2048`, 结果半天没生效。 

```sh
# 加载到系统
ssh-add ~/.ssh/id_rsa_2048

# 列出有哪些key:
ssh-add -l

```

验证是否能连上 github:

```sh
ssh -T git@github.com
```


不想每次都手动加载的话:

- 要么使用默认目录和默认名字.
- 要么就在系统启动脚本中新增 ssh-add 命令.  

系统的启动脚本文件可参考: [一些好用的 alias 命令](https://blog.csdn.net/renfufei/article/details/121948331)


## 4. 参考链接

- [Error: Permission denied (publickey) - GitHub](https://docs.github.com/en/authentication/troubleshooting-ssh/error-permission-denied-publickey)


