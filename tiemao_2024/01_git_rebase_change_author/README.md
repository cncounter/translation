# Git修改某些提交的作者信息


## 1. 背景信息

GitHub开启了合并主干需要GPG验证的功能特征, 某些提交因为 Author 的邮箱对应不上导致验证不通过.

需要通过 rebase 修改信息并强制推送到GitHUB远程仓库的特点分支。


## 2.操作步骤

```sh

# 0. 查看Git分支状态
> git status

On branch dev
Your branch is up to date with 'origin/dev'.

nothing to commit, working tree clean

# 1. 准备 rebase 指定范围内(commitId --> head)的提交; (不包含: acc17896)
> git rebase -i acc17896

# 1.1 在弹出的界面中, 像vim一样, 将需要修改的每一行前面的 pick 都修改为 edit;
# 1.2 然后 Esc, :wq 回车保存退出

Stopped at 5152da9...  增加-填充XXX字段
You can amend the commit now, with

  git commit --amend '-S'
BinLog监听

Once you are satisfied with your changes, run

  git rebase --continue

# 2.1 变更作者信息: 在弹出界面中像vim一样, :wq 回车保存即可;
> git commit --amend --author="tiemaocsdn <tiemaocsdn@qq.com>"

[detached HEAD 3e940bf] 增加-填充XXX字段
 Date: Wed Jan 17 11:59:34 2024 +0800
 2 files changed, 9 insertions(+)

# 3.1 继续后续的rebase
> git rebase --continue

Stopped at f39a533...  调整XXX的验证逻辑
You can amend the commit now, with

  git commit --amend '-S'

Once you are satisfied with your changes, run
BinLog监听-start-flag

  git rebase --continue


# ... 中间的其他


# 2.3 变更作者信息: 
> git commit --amend --author="tiemaocsdn <tiemaocsdn@qq.com>"
[detached HEAD e6fecab] 权限检查
 Date: Wed Jan 24 23:41:01 2024 +0800
 3 files changed, 383 insertions(+), 14 deletions(-)


# 3.3 继续后续的rebase: 这里不一样的提示信息表示rebase完成
> git rebase --continue

Successfully rebased and updated refs/heads/dev.


# 4. 强制推送到对应的远程分支[dev]
git push origin dev -f

```

## 3. 后续

因为有多个项目, 可以在上级目录中统一增加 git 配置

```sh
# 上层目录
> cat ../add-rsa.sh

# 移除 ssh key 缓存
ssh-add -D
# 使用不同的 ssh key 密钥
ssh-add ~/.ssh/id_rsa_2048
# 列出缓存的 ssh key
ssh-add -l

# 每个子目录, 执行 git 配置:
# 开启 gpgsign 
find . -type d -depth 1 -exec git --git-dir={}/.git --work-tree=$PWD/{} config commit.gpgsign true \;
# 设置每个项目的用户昵称
find . -type d -depth 1 -exec git --git-dir={}/.git --work-tree=$PWD/{} config user.name tiemaocsdn \;
# 设置每个项目的邮箱;
find . -type d -depth 1 -exec git --git-dir={}/.git --work-tree=$PWD/{} config user.email tiemaocsdn@qq.com \;

```


参考链接: [如何修改Git提交历史中的author，email和name等信息](https://zhuanlan.zhihu.com/p/455741996)

