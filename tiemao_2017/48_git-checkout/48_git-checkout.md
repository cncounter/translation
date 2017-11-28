# git-checkout doc

# git-checkout官方文档

## NAME

## 名称

git-checkout - Switch branches or restore working tree files

git-checkout - 切换分支(Switch branche), 或者恢复工作树(working tree)文件

## SYNOPSIS

## 语法

```
git checkout [-q] [-f] [-m] [<branch>]
git checkout [-q] [-f] [-m] --detach [<branch>]
git checkout [-q] [-f] [-m] [--detach] <commit>
git checkout [-q] [-f] [-m] [[-b|-B|--orphan] <new_branch>] [<start_point>]
git checkout [-f|--ours|--theirs|-m|--conflict=<style>] [<tree-ish>] [--] <paths>…
git checkout [<tree-ish>] [--] <pathspec>…
git checkout (-p|--patch) [<tree-ish>] [--] [<paths>…]
```



## DESCRIPTION

## 简介

Updates files in the working tree to match the version in the index or the specified tree. If no paths are given, *git checkout* will also update `HEAD` to set the specified branch as the current branch.

更新文件在工作树匹配该指数的版本或指定的树。如果没有给出路径,* git checkout *也会更新`HEAD`设置指定的分支与当前分支。

- *git checkout* <branch>

  To prepare for working on <branch>, switch to it by updating the index and the files in the working tree, and by pointing HEAD at the branch. Local modifications to the files in the working tree are kept, so that they can be committed to the <branch>.If <branch> is not found but there does exist a tracking branch in exactly one remote (call it <remote>) with a matching name, treat as equivalent to`$ git checkout -b <branch> --track <remote>/<branch>`You could omit <branch>, in which case the command degenerates to "check out the current branch", which is a glorified no-op with rather expensive side-effects to show only the tracking information, if exists, for the current branch.


准备工作> <分支,切换到它通过更新索引和文件在工作树中,通过头指向分支.本地修改文件保存在工作树,这样他们可以致力于<分支>.如果没有找到<分支>但确实存在有跟踪分支在一个偏远的(称之为<远程>)和一个匹配的名字,治疗相当于`$ git checkout -b <branch> --track <remote>/<branch>`你可以省略> <分支,在这种情况下,命令退化到“查看当前分支”,这是一个光荣的无为法,而昂贵的副作用只显示跟踪信息,如果存在,当前分支。

- *git checkout* -b|-B <new_branch> [<start point>]

  Specifying `-b` causes a new branch to be created as if [git-branch[1\]](https://git-scm.com/docs/git-branch) were called and then checked out. In this case you can use the `--track` or `--no-track` options, which will be passed to *git branch*. As a convenience, `--track` without `-b` implies branch creation; see the description of `--track`below.If `-B` is given, <new_branch> is created if it doesn’t exist; otherwise, it is reset. This is the transactional equivalent of`$ git branch -f <branch> [<start point>]$ git checkout <branch>`that is to say, the branch is not reset/created unless "git checkout" is successful.


指定`-b`导致创建一个新的分支,好像[的git分支[1 \]](https://git-scm.com/docs/git-branch)被称为然后签出。在这种情况下可以使用`--track`或`--no-track`选项,将传递给* * git分支。为方便起见,`--track`没有`-b`意味着分支创建;看到的描述`--track`各界朋友`-B`,< new_branch >创建如果它不存在;否则,它是重置。这是事务性的`$ git branch -f <branch> [<start point>]$ git checkout <branch>`也就是说,不重置/创建分支,除非“git checkout”是成功的。

- *git checkout* --detach [<branch>]

- *git checkout* [--detach] <commit>

  Prepare to work on top of <commit>, by detaching HEAD at it (see "DETACHED HEAD" section), and updating the index and the files in the working tree. Local modifications to the files in the working tree are kept, so that the resulting working tree will be the state recorded in the commit plus the local modifications.When the <commit> argument is a branch name, the `--detach` option can be used to detach HEAD at the tip of the branch (`git checkout <branch>` would check out that branch without detaching HEAD).Omitting <branch> detaches HEAD at the tip of the current branch.


准备工作在<提交>之上,通过分离主管(见“分离”一节),并更新索引和文件在工作树.本地修改文件保存在工作树,树,这样产生的工作将在提交状态记录+本地修改.当<提交>参数是一个分支的名字,`--detach`选项可以用来分离头顶端的分支(`git checkout <branch>`将检查分支没有分离的头)。省略> <分支分离头当前分支的提示。

- *git checkout* [<tree-ish>] [--] <pathspec>…

  Overwrite paths in the working tree by replacing with the contents in the index or in the <tree-ish> (most often a commit). When a <tree-ish> is given, the paths that match the <pathspec> are updated both in the index and in the working tree.The index may contain unmerged entries because of a previous failed merge. By default, if you try to check out such an entry from the index, the checkout operation will fail and nothing will be checked out. Using `-f` will ignore these unmerged entries. The contents from a specific side of the merge can be checked out of the index by using `--ours` or `--theirs`. With `-m`, changes made to the working tree file can be discarded to re-create the original conflicted merge result.


覆盖在工作树路径替换内容的索引或在< tree-ish >(通常提交).当一个< tree-ish >,< pathspec >匹配的路径在索引和更新工作树。该指数可能包含unmerged条目,因为先前失败的合并.默认情况下,如果你想看看这样一个条目从索引中,检出操作会失败,没有将签出。使用`-f`将忽略这些unmerged条目。从特定内容的合并可以检出索引的使用`--ours`或`--theirs`。与`-m`,更改工作树文件可以丢弃重现最初的冲突融合的结果。

- *git checkout* (-p|--patch) [<tree-ish>] [--] [<pathspec>…]

  This is similar to the "check out paths to the working tree from either the index or from a tree-ish" mode described above, but lets you use the interactive interface to show the "diff" output and choose which hunks to use in the result. See below for the description of `--patch` option.


这类似于“检查工作路径树索引或者tree-ish”模式,但是可以使用交互式界面,显示“diff输出结果,选择使用哪一个守财奴。见下文的描述`--patch`选择。

## OPTIONS

## 选项

- -q

- --quiet

- - - - - - - - quiet

  Quiet, suppress feedback messages.


安静,抑制反馈消息。

- --[no-]progress

  Progress status is reported on the standard error stream by default when it is attached to a terminal, unless `--quiet` is specified. This flag enables progress reporting even if not attached to a terminal, regardless of `--quiet`.


进展状态报告的标准错误流默认连接到一个终端时,除非`--quiet`都是确定的。这个标志可以进展报告,即使没有连接到一个终端,不管`--quiet`。

- -f

- --force

  When switching branches, proceed even if the index or the working tree differs from HEAD. This is used to throw away local changes.When checking out paths from the index, do not fail upon unmerged entries; instead, unmerged entries are ignored.


切换分支时,即使进行索引或工作树不同于头。这是用来抛弃本地更改.当检查出路径从索引中,不要失败unmerged条目;相反,unmerged条目将被忽略。

- --ours

- --theirs

  When checking out paths from the index, check out stage #2 (*ours*) or #3 (*theirs*) for unmerged paths.Note that during `git rebase` and `git pull --rebase`, *ours* and *theirs* may appear swapped; `--ours` gives the version from the branch the changes are rebased onto, while `--theirs` gives the version from the branch that holds your work that is being rebased.This is because `rebase` is used in a workflow that treats the history at the remote as the shared canonical one, and treats the work done on the branch you are rebasing as the third-party work to be integrated, and you are temporarily assuming the role of the keeper of the canonical history during the rebase. As the keeper of the canonical history, you need to view the history from the remote as `ours`(i.e. "our shared canonical history"), while what you did on your side branch as `theirs` (i.e. "one contributor’s work on top of it").


当检查出路径从索引中,检查阶段# 2我们(* *)# 3他们(* *)unmerged路径。注意,在`git rebase`和`git pull --rebase`,我们* * *的*可能出现交换;`--ours`提供的版本分支变化是重置到,`--theirs`提供的版本分支保存你的工作被重置。这是因为`rebase`用于一个工作流,将历史在远程共享的规范,你将工作在树枝上垫底术作为第三方集成工作吗,你暂时假设守门员的角色规范的历史在变基。规范化的门将历史,您需要查看历史从远程`ours`(即。“我们共同规范的历史”),而你做了什么在你的侧枝`theirs`(即。“一个贡献者在上面的工作”)。

- -b <new_branch>

  Create a new branch named <new_branch> and start it at <start_point>; see [git-branch[1\]](https://git-scm.com/docs/git-branch) for details.


创建一个名为< new_branch >的新分支,开始在< start_point >;看到的git分支[1 \]](https://git-scm.com/docs/git-branch)。

- -B <new_branch>

  Creates the branch <new_branch> and start it at <start_point>; if it already exists, then reset it to <start_point>. This is equivalent to running "git branch" with "-f"; see [git-branch[1\]](https://git-scm.com/docs/git-branch) for details.

< new_branch >创建分支并开始在< start_point >;如果它已经存在,然后重置它< start_point >.这相当于运行“git分支”和“- f”;看到的git分支[1 \]](https://git-scm.com/docs/git-branch)。

- -t

- --track

  When creating a new branch, set up "upstream" configuration. See "--track" in [git-branch[1\]](https://git-scm.com/docs/git-branch) for details.If no `-b` option is given, the name of the new branch will be derived from the remote-tracking branch, by looking at the local part of the refspec configured for the corresponding remote, and then stripping the initial part up to the "*". This would tell us to use "hack" as the local branch when branching off of "origin/hack" (or "remotes/origin/hack", or even "refs/remotes/origin/hack"). If the given name has no slash, or the above guessing results in an empty name, the guessing is aborted. You can explicitly give a name with `-b` in such a case.


当创建一个新的分支,建立“上游”配置。看到“——跟踪”[的git分支[1 \]](https://git-scm.com/docs/git-branch)。如果没有`-b`选项,分公司的名称来源于remote-tracking分支,通过观察当地refspec为相应的远程配置的一部分,然后剥离初始部分的“*”.这将告诉我们使用“黑客”作为当地的分支的分支“起源/黑客”(或“遥控器/产地/黑客”,甚至“refs /遥控器/产地/黑客”).如果名字没有削减,或上述猜测的结果在一个空的名字,猜是中止。您可以显式地提供一个名称`-b`在这种情况下。

- --no-track

  Do not set up "upstream" configuration, even if the branch.autoSetupMerge configuration variable is true.

不设置“上游”配置,即使分支。autoSetupMerge配置变量是正确的。

- -l

  Create the new branch’s reflog; see [git-branch[1\]](https://git-scm.com/docs/git-branch) for details.

创建新分支的reflog;看到的git分支[1 \]](https://git-scm.com/docs/git-branch)。

- --detach

  Rather than checking out a branch to work on it, check out a commit for inspection and discardable experiments. This is the default behavior of "git checkout <commit>" when <commit> is not a branch name. See the "DETACHED HEAD" section below for details.


而不是检查部门工作,查看提交的检验和可废弃的实验.这是默认的行为“git checkout <提交>”<提交>不是一个分支的名字。有关详细信息,请参阅下面的“分离头”部分。

- --orphan <new_branch>

  Create a new *orphan* branch, named <new_branch>, started from <start_point> and switch to it. The first commit made on this new branch will have no parents and it will be the root of a new history totally disconnected from all the other branches and commits.The index and the working tree are adjusted as if you had previously run "git checkout <start_point>". This allows you to start a new history that records a set of paths similar to <start_point> by easily running "git commit -a" to make the root commit.This can be useful when you want to publish the tree from a commit without exposing its full history. You might want to do this to publish an open source branch of a project whose current tree is "clean", but whose full history contains proprietary or otherwise encumbered bits of code.If you want to start a disconnected history that records a set of paths that is totally different from the one of <start_point>, then you should clear the index and the working tree right after creating the orphan branch by running "git rm -rf ." from the top level of the working tree. Afterwards you will be ready to prepare your new files, repopulating the working tree, by copying them from elsewhere, extracting a tarball, etc.

创建一个新的“孤儿”分支,名叫< new_branch >,从< start_point >和切换.第一次提交了这个新的分支将没有父母,这将是一个新的历史的根源完全断开所有其他分支和提交.指数和调整工作树如果您先前运行“git checkout < start_point >”.这允许您启动一个新的历史记录一组路径类似于轻松运行< start_point >“git提交——“根提交.这可能是有用的,当你想从提交发布树没有暴露它的全部历史.你可能想要发布的一个开源项目的分支目前的树是“干净”,但其完整的历史包含专有的或其他的一些代码.如果你想开始一个断开连接的历史记录的路径是完全不同的一个< start_point >,那么你应该清楚该指数和工作树后创建的孤儿分支运行“git rm射频。“顶级的树.之后你就可以准备你的新文件,重新繁衍工作树,通过复制他们从其他地方,提取一个tarball,等等。

- --ignore-skip-worktree-bits

  In sparse checkout mode, `git checkout -- <paths>` would update only entries matched by <paths> and sparse patterns in $GIT_DIR/info/sparse-checkout. This option ignores the sparse patterns and adds back any files in <paths>.

在稀疏校验模式下,`git checkout -- <paths>`只更新条目<路径>和稀疏模式匹配的美元GIT_DIR /信息/ sparse-checkout。这个选项忽略了稀疏模式和添加任何文件在<路径>。

- -m

- --merge

  When switching branches, if you have local modifications to one or more files that are different between the current branch and the branch to which you are switching, the command refuses to switch branches in order to preserve your modifications in context. However, with this option, a three-way merge between the current branch, your working tree contents, and the new branch is done, and you will be on the new branch.When a merge conflict happens, the index entries for conflicting paths are left unmerged, and you need to resolve the conflicts and mark the resolved paths with `git add` (or `git rm` if the merge should result in deletion of the path).When checking out paths from the index, this option lets you recreate the conflicted merge in the specified paths.

切换分支时,如果你有本地修改一个或多个文件之间的不同当前分支和分支切换,命令拒绝切换分支为了保存您的修改.然而,这个选项,当前分支之间的三方合并,树你的工作内容,完成分公司,你将在新的分支.合并时发生冲突,冲突的路径的索引条目unmerged离开,你需要解决冲突和马克的解决路径`git add`(或`git rm`如果合并会导致删除的路径)。当检查路径从索引中,这个选项允许您创建冲突合并在指定的路径。

- --conflict=<style>

  The same as --merge option above, but changes the way the conflicting hunks are presented, overriding the merge.conflictStyle configuration variable. Possible values are "merge" (default) and "diff3" (in addition to what is shown by "merge" style, shows the original contents).

上面的一样——合并选项,但改变了冲突的大块的方式,覆盖合并。conflictStyle配置变量.可能的值是“合并”(默认)和“diff3”(除了“合并”所示是什么风格,显示了原始内容)。

- -p

- --patch

  Interactively select hunks in the difference between the <tree-ish> (or the index, if unspecified) and the working tree. The chosen hunks are then applied in reverse to the working tree (and if a <tree-ish> was specified, the index).This means that you can use `git checkout -p` to selectively discard edits from your current working tree. See the “Interactive Mode” section of [git-add[1\]](https://git-scm.com/docs/git-add) to learn how to operate the `--patch`mode.


Interactively精选的hunks in the difference苏菲亚< tree-ish >(要么索引,如果未具体)and the working榕.然后应用于逆向选择大块工作树(如果指定一个< tree-ish >,指数)。这意味着您可以使用`git checkout -p`从当前工作树选择性放弃编辑。的“交互模式”部分(git-add[1 \]](https://git-scm.com/docs/git-add),学习如何操作`--patch`时尚。

- --ignore-other-worktrees

  `git checkout` refuses when the wanted ref is already checked out by another worktree. This option makes it check the ref out anyway. In other words, the ref can be held by more than one worktree.

`git checkout`拒绝时,希望裁判已经被另一个worktree签出。这个选项是检查裁判。换句话说,裁判可以由多个worktree持有。

- --[no-]recurse-submodules

  Using --recurse-submodules will update the content of all initialized submodules according to the commit recorded in the superproject. If local modifications in a submodule would be overwritten the checkout will fail unless `-f` is used. If nothing (or --no-recurse-submodules) is used, the work trees of submodules will not be updated.

使用——recurse-submodules将更新所有的内容初始化子superproject根据提交的记录.如果本地修改的子模块将覆盖检测会失败,除非`-f`使用。如果没有使用(或——no-recurse-submodules),工作子树将不会被更新。

- <branch>

  Branch to checkout; if it refers to a branch (i.e., a name that, when prepended with "refs/heads/", is a valid ref), then that branch is checked out. Otherwise, if it refers to a valid commit, your HEAD becomes "detached" and you are no longer on any branch (see below for details).As a special case, the `"@{-N}"` syntax for the N-th last branch/commit checks out branches (instead of detaching). You may also specify `-` which is synonymous with `"@{-1}"`.As a further special case, you may use `"A...B"` as a shortcut for the merge base of `A` and `B` if there is exactly one merge base. You can leave out at most one of `A` and `B`, in which case it defaults to `HEAD`.

部门检验;如果它指(即一个分支。这个名字,已经有“refs /头/”,是一个有效的参考),然后签出分支.否则,如果指的是一个有效的承诺,你的头变成了“分离”,你不再对任何分支(详情见下文)。作为一种特殊的情况下,`"@{-N}"`去年分支/提交检查语法第n个分支(而不是分离)。你也可以指定`-`这是同义词`"@{-1}"`。作为进一步的特殊情况,你可以使用`"A...B"`的快捷方式合并的基础`A`和`B`如果有一个合并的基础。你可以把最多的一个`A`和`B`,在这种情况下,默认值`HEAD`.

- <new_branch>

  Name for the new branch.

分公司的名称。

- <start_point>

  The name of a commit at which to start the new branch; see [git-branch[1\]](https://git-scm.com/docs/git-branch) for details. Defaults to HEAD.

提交的名字,开始新的分支;看到的git分支[1 \]](https://git-scm.com/docs/git-branch)。默认为头。

- <tree-ish>

  Tree to checkout from (when paths are given). If not specified, the index will be used.

树从(给出路径时)付款。如果没有指定,那么将使用索引。

## DETACHED HEAD

HEAD normally refers to a named branch (e.g. *master*). Meanwhile, each branch refers to a specific commit. Let’s look at a repo with three commits, one of them tagged, and with branch *master* checked out:

头通常指的是一个名叫分支(例如*主*)。与此同时,每个分支是指一个特定的承诺.让我们看一个回购三个承诺,其中一个标记,和分支*主*检出:

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

创建提交时在这种状态下,分支更新引用新提交.为此,* * creates新git commit commit * *,这些之一是d c * * commit,然后更新事务组* * to new to master公约d * * commit.头仍然是指分支*主*现在间接指提交* d *:

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

有时有用能付款提交不提示任何命名的分支,或者创建一个新的提交,不引用命名分支.让我们看看会发生什么,当我们付款提交* b *(这里显示两种方式这可能做):

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

注意,无论checkout命令我们使用,头现在是直接提交* b *。这被称为处于分离状态.它仅仅意味着头指的是一个特定的承诺,而不是指一个命名的分支。让我们看看会发生什么当我们创建一个提交:

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

现在有一个新的提交* e *,但它只有头部引用。我们当然可以添加另一个提交状态:

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

事实上,我们可以执行所有的正常的Git操作。但是,让我们看看会发生什么当我们然后结账的主人:

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

重要的是要意识到,在这一点上没有什么指提交* f *.最终提交* f *(进而提交* e *)常规Git将被删除的垃圾收集过程中,除非我们在这之前创建一个引用.如果我们还没有离开提交* f *,这些将创建一个参考:

```
$ git checkout -b foo   (1)
$ git branch foo        (2)
$ git tag foo           (3)
```



1. creates a new branch *foo*, which refers to commit *f*, and then updates HEAD to refer to branch *foo*. In other words, we’ll no longer be in detached HEAD state after this command.
2. similarly creates a new branch *foo*, which refers to commit *f*, but leaves HEAD detached.
3. creates a new tag *foo*, which refers to commit *f*, leaving HEAD detached.

1. * foo *创建一个新的分支,指提交* f *,然后更新* foo *头指的分支。换句话说,我们将不再是这个命令后在分离状态。
2. 同样“foo”创建一个新的分支,是指提交* f *,但叶子头分离。
3. 创建一个新的标签* foo *,指提交* f *,离开头分离。

If we have moved away from commit *f*, then we must first recover its object name (typically by using git reflog), and then we can create a reference to it. For example, to see the last two commits to which HEAD referred, we can use either of these commands:

如果我们已不再提交* f *,那么我们必须先恢复其对象名称(通常是通过使用git reflog),然后我们可以创建一个引用.例如,看到最后两头被提交,我们可以使用这些命令:

```
$ git reflog -2 HEAD # or
$ git log -g -2 HEAD
```



## ARGUMENT DISAMBIGUATION

## 论点消歧

When there is only one argument given and it is not `--` (e.g. "git checkout abc"), and when the argument is both a valid `<tree-ish>` (e.g. a branch "abc" exists) and a valid `<pathspec>` (e.g. a file or a directory whose name is "abc" exists), Git would usually ask you to disambiguate. Because checking out a branch is so common an operation, however, "git checkout abc" takes "abc" as a `<tree-ish>` in such a situation. Use `git checkout -- <pathspec>` if you want to checkout these paths out of the index.

当只有一个参数,它不是`--`(如。“git checkout abc”),当参数是有效的`<tree-ish>`(如“abc”存在的一个分支)和有效的`<pathspec>`(例如,一个文件或目录,他的名字叫“abc”存在),Git通常会问你来消除歧义.因为签出一个分支是如此常见的手术,然而,“git checkout abc”需要“abc”`<tree-ish>`在这种情况下。使用`git checkout -- <pathspec>`如果你想付款这些路径的指数。

## EXAMPLES

## 例子

1. The following sequence checks out the `master` branch, reverts the `Makefile` to two revisions back, deletes hello.c by mistake, and gets it back from the index.

1. 出下列顺序检查`master`分支,恢复`Makefile`两个修订,删除你好。c误,会从索引中。

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
   2. 把一个文件从一个承诺
   3. 恢复你好。c从索引中

   If you want to check out *all* C source files out of the index, you can say

   ```
   $ git checkout -- '*.c'
   ```

   Note the quotes around `*.c`. The file `hello.c` will also be checked out, even though it is no longer in the working tree, because the file globbing is used to match entries in the index (not in the working tree by the shell).

注意引号`*.c`。该文件`hello.c`也将签出,即使它不再在工作树,因为文件globbing用于匹配条目索引中(不是在工作树的shell)。

   If you have an unfortunate branch that is named `hello.c`, this step would be confused as an instruction to switch to that branch. You should instead write:


如果你有一个不幸的分支命名`hello.c`,这一步就会被作为一个分支指令切换。你应该写:

   ```
   $ git checkout -- hello.c
   ```



2. After working in the wrong branch, switching to the correct branch would be done using:

2. 在错误的工作分支后,切换到正确的部门将使用:

   ```
   $ git checkout mytopic
   ```

   However, your "wrong" branch and correct "mytopic" branch may differ in files that you have modified locally, in which case the above checkout would fail like this:

然而,你的“错误”分支和纠正“mytopic”分支在本地文件,修改可能不同,在这种情况下,上述检测会失败:

   ```
   $ git checkout mytopic
   error: You have local changes to 'frotz'; not switching branches.
   ```

   You can give the `-m` flag to the command, which would try a three-way merge:

你能给的`-m`国旗的命令,将尝试三方合并:

   ```
   $ git checkout -m mytopic
   Auto-merging frotz
   ```

   After this three-way merge, the local modifications are *not* registered in your index file, so `git diff` would show you what changes you made since the tip of the new branch.

此三方合并后,在当地修改*不*在你的索引文件,注册`git diff`会告诉你什么改变你自的新分支。

3. When a merge conflict happens during switching branches with the `-m` option, you would see something like this:

3. 当冲突发生在切换分支与合并`-m`选择,你会看到这样的:

   ```
   $ git checkout -m mytopic
   Auto-merging frotz
   ERROR: Merge conflict in frotz
   fatal: merge program failed
   ```

   At this point, `git diff` shows the changes cleanly merged as in the previous example, as well as the changes in the conflicted files. Edit and resolve the conflict and mark it resolved with `git add`as usual:

在这一点上,`git diff`显示了变化干净地合并在上一个示例中,以及矛盾的变化文件。编辑和解决冲突和马克解决`git add`像往常一样:

   ```
   $ edit frotz
   $ git add frotz
   ```



## GIT

## GIT

Part of the [git[1\]](https://git-scm.com/docs/git) suite

Part of the[国际]][1 708(https://git-scm.com/docs/git)续


原文链接: <https://git-scm.com/docs/git-checkout>



