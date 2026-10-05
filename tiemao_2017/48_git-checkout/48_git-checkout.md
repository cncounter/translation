# git-checkout官方文档


一般来说, git工作流中, 可以将git仓库划分为3部分:

- remote, 远端仓库; 比如 github, gitlab 等等.
- local, 就是一个本地仓库, 可以想象这是驻扎在内存和磁盘中的一个虚拟仓库。
- disk, 磁盘文件系统, 也就是我们使用IDE或者编辑器正常读写的文件。



## 命令名称

`git-checkout` - 切换分支(Switch branches), 或者还原工作目录(restore working tree files)

## 命令语法格式(SYNOPSIS)

```sh
git checkout [-q] [-f] [-m] [<branch>]
git checkout [-q] [-f] [-m] --detach [<branch>]
git checkout [-q] [-f] [-m] [--detach] <commit>
git checkout [-q] [-f] [-m] [[-b|-B|--orphan] <new-branch>] [<start-point>]
git checkout [-f] <tree-ish> [--] <pathspec>…​
git checkout [-f] <tree-ish> --pathspec-from-file=<file> [--pathspec-file-nul]
git checkout [-f|--ours|--theirs|-m|--conflict=<style>] [--] <pathspec>…​
git checkout [-f|--ours|--theirs|-m|--conflict=<style>] --pathspec-from-file=<file> [--pathspec-file-nul]
git checkout (-p|--patch) [<tree-ish>] [--] [<pathspec>…​]
```


## checkout简介


Updates files in the working tree to match the version in the index or the specified tree. If no pathspec was given, `git checkout` will also update `HEAD` to set the specified branch as the current branch.


更新工作目录中的文件, 以匹配树形结构或索引中对应的git版本。
如果没有指定 `<pathspec>` 路径, `git checkout` 同时会将当前分支设置为 `HEAD` 的指定分支。

- `git checkout [<branch>]`

  To prepare for working on <branch>, switch to it by updating the index and the files in the working tree, and by pointing HEAD at the branch. Local modifications to the files in the working tree are kept, so that they can be committed to the <branch>.If <branch> is not found but there does exist a tracking branch in exactly one remote (call it <remote>) with a matching name, treat as equivalent to`$ git checkout -b <branch> --track <remote>/<branch>`You could omit <branch>, in which case the command degenerates to "check out the current branch", which is a glorified no-op with rather expensive side-effects to show only the tracking information, if exists, for the current branch.


准备工作:要基于 <branch> 进行开发, 需要切换到该分支, 具体做法是更新索引和工作目录中的文件, 并将 HEAD 指向该分支。工作目录中的本地修改会保留, 因此可以提交到 <branch> 上。如果找不到 <branch>, 但在某一个远程仓库(记为 <remote>)中存在同名的跟踪分支, 则等价于执行 `$ git checkout -b <branch> --track <remote>/<branch>`。也可以省略 <branch>, 此时该命令退化为“检出当前分支”, 相当于一次开销很大的空操作, 只是用来显示当前分支的跟踪信息(如果存在的话)。

- *git checkout* -b|-B <new_branch> [<start point>]

  Specifying `-b` causes a new branch to be created as if [git-branch[1\]](https://git-scm.com/docs/git-branch) were called and then checked out. In this case you can use the `--track` or `--no-track` options, which will be passed to *git branch*. As a convenience, `--track` without `-b` implies branch creation; see the description of `--track`below.If `-B` is given, <new_branch> is created if it doesn’t exist; otherwise, it is reset. This is the transactional equivalent of`$ git branch -f <branch> [<start point>]$ git checkout <branch>`that is to say, the branch is not reset/created unless "git checkout" is successful.


指定 `-b` 会创建一个新分支, 就像调用 [git-branch[1\]](https://git-scm.com/docs/git-branch) 之后再检出一样。这种情况下可以使用 `--track` 或 `--no-track` 选项, 它们会被传递给 *git branch*。为方便起见, 不带 `-b` 的 `--track` 也意味着创建分支; 参见后面 `--track` 的说明。如果指定了 `-B`, 当 <new_branch> 不存在时会创建它; 否则会重置它。这等价于事务性地执行 `$ git branch -f <branch> [<start point>]` 和 `$ git checkout <branch>`, 也就是说, 除非 “git checkout” 执行成功, 否则不会重置/创建分支。

- *git checkout* --detach [<branch>]

- *git checkout* [--detach] <commit>

  Prepare to work on top of <commit>, by detaching HEAD at it (see "DETACHED HEAD" section), and updating the index and the files in the working tree. Local modifications to the files in the working tree are kept, so that the resulting working tree will be the state recorded in the commit plus the local modifications.When the <commit> argument is a branch name, the `--detach` option can be used to detach HEAD at the tip of the branch (`git checkout <branch>` would check out that branch without detaching HEAD).Omitting <branch> detaches HEAD at the tip of the current branch.


准备在 <commit> 之上进行开发, 需要让 HEAD 分离到该提交(参见 “DETACHED HEAD” 一节), 并更新索引和工作目录中的文件。工作目录中的本地修改会保留, 因此最终的工作目录将是该提交记录的状态再加上本地修改。当 <commit> 参数是分支名时, 可以用 `--detach` 选项将 HEAD 分离到分支的顶端(`git checkout <branch>` 则会检出该分支而不分离 HEAD)。省略 <branch> 时, 会将 HEAD 分离到当前分支的顶端。

- *git checkout* [<tree-ish>] [--] <pathspec>…

  Overwrite paths in the working tree by replacing with the contents in the index or in the <tree-ish> (most often a commit). When a <tree-ish> is given, the paths that match the <pathspec> are updated both in the index and in the working tree.The index may contain unmerged entries because of a previous failed merge. By default, if you try to check out such an entry from the index, the checkout operation will fail and nothing will be checked out. Using `-f` will ignore these unmerged entries. The contents from a specific side of the merge can be checked out of the index by using `--ours` or `--theirs`. With `-m`, changes made to the working tree file can be discarded to re-create the original conflicted merge result.


用索引或 <tree-ish>(通常是提交)中的内容覆盖工作目录中的对应路径。指定 <tree-ish> 时, 与 <pathspec> 匹配的路径会同时更新索引和工作目录。由于之前一次失败的合并, 索引中可能包含未合并(unmerged)的条目。默认情况下, 如果尝试从索引检出这样的条目, 检出操作会失败, 且不会检出任何内容。使用 `-f` 会忽略这些未合并的条目。可以使用 `--ours` 或 `--theirs` 从索引中检出合并某一侧的内容。使用 `-m` 时, 可以丢弃对工作目录文件所做的修改, 重新生成最初的冲突合并结果。

- *git checkout* (-p|--patch) [<tree-ish>] [--] [<pathspec>…]

  This is similar to the "check out paths to the working tree from either the index or from a tree-ish" mode described above, but lets you use the interactive interface to show the "diff" output and choose which hunks to use in the result. See below for the description of `--patch` option.


这类似于前面描述的“从索引或 tree-ish 检出路径到工作目录”模式, 但它允许使用交互式界面显示 “diff” 输出, 并选择要在结果中使用哪些 hunk。关于 `--patch` 选项的说明见下文。

## OPTIONS

## 选项

- -q

- --quiet

  Quiet, suppress feedback messages.


安静,抑制反馈消息。

- --[no-]progress

  Progress status is reported on the standard error stream by default when it is attached to a terminal, unless `--quiet` is specified. This flag enables progress reporting even if not attached to a terminal, regardless of `--quiet`.


默认情况下, 当标准错误流连接到终端时, 会报告进度状态, 除非指定了 `--quiet`。该标志即使没有连接到终端也会启用进度报告, 且不受 `--quiet` 影响。

- -f

- --force

  When switching branches, proceed even if the index or the working tree differs from HEAD. This is used to throw away local changes.When checking out paths from the index, do not fail upon unmerged entries; instead, unmerged entries are ignored.


切换分支时, 即使索引或工作目录与 HEAD 不一致也继续执行。这是用来丢弃本地修改的。从索引检出路径时, 遇到未合并的条目不会失败; 而是忽略这些未合并的条目。

- --ours

- --theirs

  When checking out paths from the index, check out stage #2 (*ours*) or #3 (*theirs*) for unmerged paths.Note that during `git rebase` and `git pull --rebase`, *ours* and *theirs* may appear swapped; `--ours` gives the version from the branch the changes are rebased onto, while `--theirs` gives the version from the branch that holds your work that is being rebased.This is because `rebase` is used in a workflow that treats the history at the remote as the shared canonical one, and treats the work done on the branch you are rebasing as the third-party work to be integrated, and you are temporarily assuming the role of the keeper of the canonical history during the rebase. As the keeper of the canonical history, you need to view the history from the remote as `ours`(i.e. "our shared canonical history"), while what you did on your side branch as `theirs` (i.e. "one contributor’s work on top of it").


从索引检出路径时, 对于未合并的路径, 检出第 2 阶段(*ours*)或第 3 阶段(*theirs*)的内容。注意, 在 `git rebase` 和 `git pull --rebase` 期间, *ours* 和 *theirs* 的含义可能被交换; `--ours` 给出的是被变基到的那个分支的版本, 而 `--theirs` 给出的是包含你当前工作、正在被变基的那个分支的版本。这是因为 `rebase` 所处的工作流把远程的历史视为共享的权威历史, 把你在被变基分支上所做的工作视为待整合的第三方工作, 并在变基期间临时扮演权威历史守护者的角色。作为权威历史的守护者, 你需要把来自远程的历史视为 `ours`(即 “我们共享的权威历史”), 而把你在自己侧分支上所做的工作视为 `theirs`(即 “某个贡献者在其之上所做的工作”)。

- -b <new_branch>

  Create a new branch named <new_branch> and start it at <start_point>; see [git-branch[1\]](https://git-scm.com/docs/git-branch) for details.


创建一个名为 <new_branch> 的新分支, 并以 <start_point> 作为起点; 详见 [git-branch[1\]](https://git-scm.com/docs/git-branch)。

- -B <new_branch>

  Creates the branch <new_branch> and start it at <start_point>; if it already exists, then reset it to <start_point>. This is equivalent to running "git branch" with "-f"; see [git-branch[1\]](https://git-scm.com/docs/git-branch) for details.

创建分支 <new_branch>, 并以 <start_point> 作为起点; 如果该分支已存在, 则将其重置到 <start_point>。这相当于带 “-f” 运行 “git branch”; 详见 [git-branch[1\]](https://git-scm.com/docs/git-branch)。

- -t

- --track

  When creating a new branch, set up "upstream" configuration. See "--track" in [git-branch[1\]](https://git-scm.com/docs/git-branch) for details.If no `-b` option is given, the name of the new branch will be derived from the remote-tracking branch, by looking at the local part of the refspec configured for the corresponding remote, and then stripping the initial part up to the "*". This would tell us to use "hack" as the local branch when branching off of "origin/hack" (or "remotes/origin/hack", or even "refs/remotes/origin/hack"). If the given name has no slash, or the above guessing results in an empty name, the guessing is aborted. You can explicitly give a name with `-b` in such a case.


创建新分支时, 设置 “upstream” 配置。详见 [git-branch[1\]](https://git-scm.com/docs/git-branch) 中的 “--track”。如果没有给出 `-b` 选项, 新分支的名字将根据远程跟踪分支推导: 查看对应远程所配置 refspec 的本地部分, 然后去掉直到 “*” 之前的部分。这样, 从 “origin/hack”(或 “remotes/origin/hack”, 甚至 “refs/remotes/origin/hack”)分叉时, 会使用 “hack” 作为本地分支名。如果给定的名字中没有斜杠, 或者上述推导得到空名字, 则放弃推导。这种情况下可以用 `-b` 显式指定名字。

- --no-track

  Do not set up "upstream" configuration, even if the branch.autoSetupMerge configuration variable is true.

不设置 “upstream” 配置, 即使 branch.autoSetupMerge 配置变量为 true。

- -l

  Create the new branch’s reflog; see [git-branch[1\]](https://git-scm.com/docs/git-branch) for details.

创建新分支的 reflog; 详见 [git-branch[1\]](https://git-scm.com/docs/git-branch)。

- --detach

  Rather than checking out a branch to work on it, check out a commit for inspection and discardable experiments. This is the default behavior of "git checkout <commit>" when <commit> is not a branch name. See the "DETACHED HEAD" section below for details.


不是检出某个分支来在其上开发, 而是检出一个提交, 用于查看或做一些可以丢弃的实验。当 <commit> 不是分支名时, 这是 “git checkout <commit>” 的默认行为。详情参见下面的 “DETACHED HEAD” 一节。

- --orphan <new_branch>

  Create a new *orphan* branch, named <new_branch>, started from <start_point> and switch to it. The first commit made on this new branch will have no parents and it will be the root of a new history totally disconnected from all the other branches and commits.The index and the working tree are adjusted as if you had previously run "git checkout <start_point>". This allows you to start a new history that records a set of paths similar to <start_point> by easily running "git commit -a" to make the root commit.This can be useful when you want to publish the tree from a commit without exposing its full history. You might want to do this to publish an open source branch of a project whose current tree is "clean", but whose full history contains proprietary or otherwise encumbered bits of code.If you want to start a disconnected history that records a set of paths that is totally different from the one of <start_point>, then you should clear the index and the working tree right after creating the orphan branch by running "git rm -rf ." from the top level of the working tree. Afterwards you will be ready to prepare your new files, repopulating the working tree, by copying them from elsewhere, extracting a tarball, etc.

创建一个新的 *orphan*(孤儿)分支, 名为 <new_branch>, 从 <start_point> 开始并切换到它。在这个新分支上所做的第一次提交没有父提交, 它将成为一段全新历史的根, 与所有其他分支和提交完全断开。索引和工作目录会被调整, 就像之前运行过 “git checkout <start_point>” 一样。这样你就可以开始一段新历史, 记录一组与 <start_point> 类似的路径, 只需方便地运行 “git commit -a” 来创建根提交。当你想发布某个提交对应的目录树, 又不想暴露其完整历史时, 这会很有用。例如, 某个项目当前的工作树是“干净”的, 但其完整历史中包含专有的或其他受限制的代码片段, 你可能就想这么做, 以发布该项目的一个开源分支。如果你想开始一段与 <start_point> 完全不同的、记录另一组路径的断开历史, 那么应该在创建孤儿分支后, 立即从工作目录的顶层运行 “git rm -rf .” 清空索引和工作目录。之后你就可以通过从别处复制、解压 tarball 等方式, 把新文件放回工作目录, 为提交做准备。

- --ignore-skip-worktree-bits

  In sparse checkout mode, `git checkout -- <paths>` would update only entries matched by <paths> and sparse patterns in $GIT_DIR/info/sparse-checkout. This option ignores the sparse patterns and adds back any files in <paths>.

在稀疏检出模式下, `git checkout -- <paths>` 只会更新由 <paths> 以及 $GIT_DIR/info/sparse-checkout 中的稀疏模式所匹配的条目。该选项会忽略稀疏模式, 把 <paths> 中的文件重新加入。

- -m

- --merge

  When switching branches, if you have local modifications to one or more files that are different between the current branch and the branch to which you are switching, the command refuses to switch branches in order to preserve your modifications in context. However, with this option, a three-way merge between the current branch, your working tree contents, and the new branch is done, and you will be on the new branch.When a merge conflict happens, the index entries for conflicting paths are left unmerged, and you need to resolve the conflicts and mark the resolved paths with `git add` (or `git rm` if the merge should result in deletion of the path).When checking out paths from the index, this option lets you recreate the conflicted merge in the specified paths.

切换分支时, 如果你对当前分支和要切换到的分支之间存在差异的一个或多个文件做了本地修改, 该命令会拒绝切换分支, 以便在上下文中保留你的修改。但是使用该选项时, 会在当前分支、你的工作目录内容和新分支之间进行一次三方合并, 然后你会处于新分支上。发生合并冲突时, 冲突路径对应的索引条目会保持未合并状态, 你需要解决冲突, 并用 `git add` 标记已解决的路径(如果合并应导致删除该路径, 则用 `git rm`)。从索引检出路径时, 该选项允许你在指定路径上重新生成冲突合并。

- --conflict=<style>

  The same as --merge option above, but changes the way the conflicting hunks are presented, overriding the merge.conflictStyle configuration variable. Possible values are "merge" (default) and "diff3" (in addition to what is shown by "merge" style, shows the original contents).

与上面的 --merge 选项相同, 但会改变冲突 hunk 的呈现方式, 并覆盖 merge.conflictStyle 配置变量。可能的取值有 “merge”(默认)和 “diff3”(除了 “merge” 样式显示的内容外, 还会显示原始内容)。

- -p

- --patch

  Interactively select hunks in the difference between the <tree-ish> (or the index, if unspecified) and the working tree. The chosen hunks are then applied in reverse to the working tree (and if a <tree-ish> was specified, the index).This means that you can use `git checkout -p` to selectively discard edits from your current working tree. See the “Interactive Mode” section of [git-add[1\]](https://git-scm.com/docs/git-add) to learn how to operate the `--patch`mode.


交互式地选择 <tree-ish>(如果未指定则使用索引)与工作目录之间差异中的 hunk。选中的 hunk 随后会被反向应用到工作目录(如果指定了 <tree-ish>, 也会应用到索引)。这意味着你可以用 `git checkout -p` 有选择地丢弃当前工作目录中的修改。参见 [git-add[1\]](https://git-scm.com/docs/git-add) 的 “Interactive Mode” 一节, 了解如何操作 `--patch` 模式。

- --ignore-other-worktrees

  `git checkout` refuses when the wanted ref is already checked out by another worktree. This option makes it check the ref out anyway. In other words, the ref can be held by more than one worktree.

当所需的 ref 已经被另一个 worktree 检出时, `git checkout` 会拒绝操作。该选项会让它照常检出该 ref。换句话说, 同一个 ref 可以被多个 worktree 持有。

- --[no-]recurse-submodules

  Using --recurse-submodules will update the content of all initialized submodules according to the commit recorded in the superproject. If local modifications in a submodule would be overwritten the checkout will fail unless `-f` is used. If nothing (or --no-recurse-submodules) is used, the work trees of submodules will not be updated.

使用 --recurse-submodules 会根据 superproject 中记录的提交, 更新所有已初始化子模块的内容。如果子模块中的本地修改将被覆盖, 除非使用 `-f`, 否则检出会失败。如果什么都不指定(或使用 --no-recurse-submodules), 子模块的工作树不会被更新。

- <branch>

  Branch to checkout; if it refers to a branch (i.e., a name that, when prepended with "refs/heads/", is a valid ref), then that branch is checked out. Otherwise, if it refers to a valid commit, your HEAD becomes "detached" and you are no longer on any branch (see below for details).As a special case, the `"@{-N}"` syntax for the N-th last branch/commit checks out branches (instead of detaching). You may also specify `-` which is synonymous with `"@{-1}"`.As a further special case, you may use `"A...B"` as a shortcut for the merge base of `A` and `B` if there is exactly one merge base. You can leave out at most one of `A` and `B`, in which case it defaults to `HEAD`.

要检出的分支; 如果它指向一个分支(即某个名字加上前缀 “refs/heads/” 后是一个合法的 ref), 则检出该分支。否则, 如果它指向一个合法的提交, 你的 HEAD 会变为“分离(detached)”状态, 并且你不再处于任何分支上(详情见下文)。作为一种特殊情况, `"@{-N}"` 语法用于检出倒数第 N 个分支/提交(而不是分离 HEAD)。你也可以使用 `-`, 它等同于 `"@{-1}"`。作为进一步的特殊情况, 当 `A` 和 `B` 恰好只有一个合并基点时, 可以用 `"A...B"` 作为该合并基点的快捷方式。`A` 和 `B` 中最多可以省略一个, 省略时默认为 `HEAD`。

- <new_branch>

  Name for the new branch.

新分支的名称。

- <start_point>

  The name of a commit at which to start the new branch; see [git-branch[1\]](https://git-scm.com/docs/git-branch) for details. Defaults to HEAD.

新分支的起始提交名; 详见 [git-branch[1\]](https://git-scm.com/docs/git-branch)。默认为 HEAD。

- <tree-ish>

  Tree to checkout from (when paths are given). If not specified, the index will be used.

要从中检出(当给出了路径时)的树。如果未指定, 则使用索引。

## DETACHED HEAD

HEAD normally refers to a named branch (e.g. *master*). Meanwhile, each branch refers to a specific commit. Let’s look at a repo with three commits, one of them tagged, and with branch *master* checked out:

HEAD 通常指向一个具名分支(例如 *master*)。而每个分支又指向某个特定的提交。下面看一个包含三个提交(其中一个打了标签)且已检出 *master* 分支的仓库:

```
	   HEAD (refers to branch 'master')
	    |
	    v
a---b---c  branch 'master' (refers to commit 'c')
    ^
    |
  tag 'v2.0' (refers to commit 'b')
```



When a commit is created in this state, the branch is updated to refer to the new commit. Specifically, *git commit* creates a new commit *d*, whose parent is commit *c*, and then updates branch *master* to refer to new commit *d*. HEAD still refers to branch *master* and so indirectly now refers to commit *d*:

在这种状态下创建提交时, 分支会被更新为指向新的提交。具体来说, *git commit* 创建一个新提交 *d*, 其父提交是 *c*, 然后把 *master* 分支更新为指向新提交 *d*。HEAD 仍然指向 *master* 分支, 因此现在间接指向提交 *d*:

```
$ edit; git add; git commit

	       HEAD (refers to branch 'master')
		|
		v
a---b---c---d  branch 'master' (refers to commit 'd')
    ^
    |
  tag 'v2.0' (refers to commit 'b')
```



It is sometimes useful to be able to checkout a commit that is not at the tip of any named branch, or even to create a new commit that is not referenced by a named branch. Let’s look at what happens when we checkout commit *b* (here we show two ways this may be done):

有时需要检出某个不在任何具名分支顶端的提交, 甚至创建不被任何具名分支引用的新提交。下面看看检出提交 *b* 时会发生什么(这里展示两种做法):

```
$ git checkout v2.0  # or
$ git checkout master^^

   HEAD (refers to commit 'b')
    |
    v
a---b---c---d  branch 'master' (refers to commit 'd')
    ^
    |
  tag 'v2.0' (refers to commit 'b')
```



Notice that regardless of which checkout command we use, HEAD now refers directly to commit *b*. This is known as being in detached HEAD state. It means simply that HEAD refers to a specific commit, as opposed to referring to a named branch. Let’s see what happens when we create a commit:

注意, 无论使用哪条检出命令, HEAD 现在都直接指向提交 *b*。这就是所谓的分离 HEAD(detached HEAD)状态。它仅仅意味着 HEAD 指向某个特定提交, 而不是指向某个具名分支。下面看看创建提交时会发生什么:

```
$ edit; git add; git commit

     HEAD (refers to commit 'e')
      |
      v
      e
     /
a---b---c---d  branch 'master' (refers to commit 'd')
    ^
    |
  tag 'v2.0' (refers to commit 'b')
```



There is now a new commit *e*, but it is referenced only by HEAD. We can of course add yet another commit in this state:

现在有了一个新提交 *e*, 但它只被 HEAD 引用。当然, 在这种状态下还可以再添加一个提交:

```
$ edit; git add; git commit

	 HEAD (refers to commit 'f')
	  |
	  v
      e---f
     /
a---b---c---d  branch 'master' (refers to commit 'd')
    ^
    |
  tag 'v2.0' (refers to commit 'b')
```



In fact, we can perform all the normal Git operations. But, let’s look at what happens when we then checkout master:

事实上, 我们可以执行所有常规的 Git 操作。但是, 下面看看之后检出 master 时会发生什么:

```
$ git checkout master

	       HEAD (refers to branch 'master')
      e---f     |
     /          v
a---b---c---d  branch 'master' (refers to commit 'd')
    ^
    |
  tag 'v2.0' (refers to commit 'b')
```



It is important to realize that at this point nothing refers to commit *f*. Eventually commit *f* (and by extension commit *e*) will be deleted by the routine Git garbage collection process, unless we create a reference before that happens. If we have not yet moved away from commit *f*, any of these will create a reference to it:

重要的是要意识到, 此时已经没有任何东西引用提交 *f* 了。最终提交 *f*(以及进而提交 *e*)会被 Git 常规的垃圾回收过程删除, 除非在那之前先创建一个引用。如果还没有离开提交 *f*, 下面任意一条命令都会为它创建引用:

```
$ git checkout -b foo   (1)
$ git branch foo        (2)
$ git tag foo           (3)
```



1. creates a new branch *foo*, which refers to commit *f*, and then updates HEAD to refer to branch *foo*. In other words, we’ll no longer be in detached HEAD state after this command.
2. similarly creates a new branch *foo*, which refers to commit *f*, but leaves HEAD detached.
3. creates a new tag *foo*, which refers to commit *f*, leaving HEAD detached.

1. 创建一个新分支 *foo*, 它指向提交 *f*, 然后更新 HEAD 使其指向分支 *foo*。换句话说, 执行该命令后我们不再处于分离 HEAD 状态。
2. 类似地创建一个新分支 *foo*, 它指向提交 *f*, 但保持 HEAD 分离。
3. 创建一个新标签 *foo*, 它指向提交 *f*, 并保持 HEAD 分离。

If we have moved away from commit *f*, then we must first recover its object name (typically by using git reflog), and then we can create a reference to it. For example, to see the last two commits to which HEAD referred, we can use either of these commands:

如果我们已经离开了提交 *f*, 那么必须先恢复它的对象名(通常使用 git reflog), 然后才能为它创建引用。例如, 要查看 HEAD 最近引用过的两个提交, 可以使用下面任意一条命令:

```
$ git reflog -2 HEAD # or
$ git log -g -2 HEAD
```



## ARGUMENT DISAMBIGUATION

## 参数消歧

When there is only one argument given and it is not `--` (e.g. "git checkout abc"), and when the argument is both a valid `<tree-ish>` (e.g. a branch "abc" exists) and a valid `<pathspec>` (e.g. a file or a directory whose name is "abc" exists), Git would usually ask you to disambiguate. Because checking out a branch is so common an operation, however, "git checkout abc" takes "abc" as a `<tree-ish>` in such a situation. Use `git checkout -- <pathspec>` if you want to checkout these paths out of the index.

当只给出一个参数, 且它不是 `--` 时(例如 “git checkout abc”), 如果该参数既是合法的 `<tree-ish>`(例如存在名为 “abc” 的分支), 又是合法的 `<pathspec>`(例如存在名为 “abc” 的文件或目录), Git 通常会要求你消除歧义。不过, 由于检出分支是非常常见的操作, 在这种情况下 “git checkout abc” 会把 “abc” 当作 `<tree-ish>`。如果想从索引中检出这些路径, 请使用 `git checkout -- <pathspec>`。

## EXAMPLES

## 例子

1. The following sequence checks out the `master` branch, reverts the `Makefile` to two revisions back, deletes hello.c by mistake, and gets it back from the index.

1. 下面的命令序列检出了 `master` 分支, 将 `Makefile` 回退到两个版本之前, 又误删了 hello.c, 然后从索引中把它恢复回来。

   ```
   $ git checkout master             (1)
   $ git checkout master~2 Makefile  (2)
   $ rm -f hello.c
   $ git checkout hello.c            (3)
   ```

   1. switch branch
   2. take a file out of another commit
   3. restore hello.c from the index

1. 切换分支
   2. 从另一个提交中取出一个文件
   3. 从索引中恢复 hello.c

   If you want to check out *all* C source files out of the index, you can say

如果想要从索引中检出*所有* C 源文件, 可以这样写:

   ```
   $ git checkout -- '*.c'
   ```

   Note the quotes around `*.c`. The file `hello.c` will also be checked out, even though it is no longer in the working tree, because the file globbing is used to match entries in the index (not in the working tree by the shell).

注意 `*.c` 两侧的引号。文件 `hello.c` 也会被检出, 即使它已经不在工作目录中, 因为文件通配(globbing)是用来匹配索引中的条目的(而不是由 shell 匹配工作目录中的文件)。

   If you have an unfortunate branch that is named `hello.c`, this step would be confused as an instruction to switch to that branch. You should instead write:


如果你有一个不幸被命名为 `hello.c` 的分支, 这一步会被误解为切换分支的指令。此时应该写成:

   ```
   $ git checkout -- hello.c
   ```



2. After working in the wrong branch, switching to the correct branch would be done using:

2. 在错误的分支上工作之后, 可以使用下面的命令切换到正确的分支:

   ```
   $ git checkout mytopic
   ```

   However, your "wrong" branch and correct "mytopic" branch may differ in files that you have modified locally, in which case the above checkout would fail like this:

然而, 你的“错误”分支和正确的 “mytopic” 分支在你本地修改过的文件上可能存在差异, 这种情况下上面的检出会失败, 类似这样:

   ```
   $ git checkout mytopic
   error: You have local changes to 'frotz'; not switching branches.
   ```

   You can give the `-m` flag to the command, which would try a three-way merge:

可以给该命令加上 `-m` 标志, 它会尝试三方合并:

   ```
   $ git checkout -m mytopic
   Auto-merging frotz
   ```

   After this three-way merge, the local modifications are *not* registered in your index file, so `git diff` would show you what changes you made since the tip of the new branch.

三方合并之后, 本地修改*不会*记录到索引文件中, 因此 `git diff` 会显示你相对新分支顶端所做的改动。

3. When a merge conflict happens during switching branches with the `-m` option, you would see something like this:

3. 使用 `-m` 选项切换分支时如果发生合并冲突, 会看到类似这样的信息:

   ```
   $ git checkout -m mytopic
   Auto-merging frotz
   ERROR: Merge conflict in frotz
   fatal: merge program failed
   ```

   At this point, `git diff` shows the changes cleanly merged as in the previous example, as well as the changes in the conflicted files. Edit and resolve the conflict and mark it resolved with `git add`as usual:

此时, `git diff` 会像上一个例子那样显示干净合并的改动, 以及冲突文件中的改动。像往常一样编辑并解决冲突, 然后用 `git add` 标记为已解决:

   ```
   $ edit frotz
   $ git add frotz
   ```


示例:

```sh
# 查看远程分支
git branch -r

# 检出远程分支, 本地创建新分支, 并自动执行追踪
git checkout -b test origin/test  --track
```


## GIT

## GIT

Part of the [git[1\]](https://git-scm.com/docs/git) suite

Part of the [git[1\]](https://git-scm.com/docs/git) 套件


原文链接: <https://git-scm.com/docs/git-checkout>



