#2.28. TortoiseGit - Merging

#2.28 TortoiseGit - 分支合并(Merging)

Where branches are used to maintain separate lines of development, at some stage you will want to merge the changes made on one branch back into the other branch, or vice versa.

分支(branches)主要用于维护一条单独开发线, 在达到某个阶段时, 需要将某个分支所做的修改合并到其他分支, 或者把其他分支合并到当前分支。

It is important to understand how branching and merging works in Git before you start using it, as it can become quite complex. For hints where to find more information about Git and merging see [Section 2, “Reading Guide”](tgit-preface-readingguide.html).

首先需要理解的Git分支与合并的工作原理。 因为分支有一点点复杂. 关于Git合并的更多信息请参考: [Section 2, “Reading Guide”](tgit-preface-readingguide.html)。

The next point to note is that merging *always* takes place within a working tree. If you want to merge changes *into* a branch, you have to have a working tree for that branch checked out, and invoke the merge wizard from that working tree using TortoiseGit → Merge....

第二点要注意的是, TortoiseGit的分支合并 *只* 能在工作树上进行. 所以如果想将变更 *合并到* 某个分支, 就必须先将这个分支检出(checked out)到工作目录, 然后在工作目录中通过合并向导进行合并, 即 `TortoiseGit → Merge....`

**Figure 2.43. Merge dialog**

**图2.43. Merge dialog(分支合并对话框) **

![Merge dialog](41_01_TortoiseGit _Merging_en.png)


```
​对应的中文版本如下所示:
```


![分支合并对话框](41_02_TortoiseGit _Merging_zh.png)



In general it is a good idea to perform a merge into an unmodified working tree. If you have made other changes in your working tree, commit those first. If the merge does not go as you expect, you may want to revert the changes, and the Revert command will discard *all* changes including any you made before the merge.

一般来说, 执行合并之前, 需要工作目录中没有未提交的更改。 如果工作目录有文件变更, 最好是先将变更提交. 这样的话, 即使合并失败或者合并结果不符合预期, 那还可以恢复(revert)合并过程所产生的变化, Revert 命令将会丢弃合并过程所做的任何变更, 恢复到合并之前的状态。

You can choose one commit that you want to merge from.

可以选择以下类型的提交作为合并来源。

- HEAD

  Current commit checked out.

  检出的当前提交。

- Branch

  The latest commit of chosen branch.

  分支, 该分支的最新提交。

- Tag

  The commit of chosen tag.

  标签, 选择标签对应的提交。

- Commit

  Any commit, you click ... to launch log dialog to choose commit. You also can input commit hash, or friendly commit name, such as HEAD~4.

  任何一次提交, 可以点击 ` ... ` 按钮, 在弹出的日志对话框中选择某次提交(commit)。 当然,也可以直接输入提交所对应的hash值, 或者是命名友好的提交名称, 如 `HEAD~4`。

`Squash` Just merge change from the other branch. Can't recorder Merge information. The new commit will not record merge branch as one parent commit. Log view will not show merge line between two branch.

勾选 `Squash` 选项, 只从其他分支合并更改, 而不记录合并信息(Merge information)。 新的提交不会将源分支作为当前分支的  parent commit. 日志视图里面也不会显示两个分支间的合并线。

`No Fast Forward` Generate a merge commit even if the merge resolved as a fast-forward.

勾选 `No Fast Forward` 选项, 即使合并解决为 fast-forward 也会生成合并提交(merge commit)。

`No Commit` Do not automatically create a commit after merge.

勾选 `No Commit` 选项, 则合并后不会自动创建一次提交(commit)。

`Messages` Populate the log message with one-line descriptions from the actual commits that are being merged. Can specify the number of commits to be included in the merge message.

勾选 `Messages` 选项, 弹出一行日志信息, 描述实际被合并的提交。 可以指定数量的承诺被包括在合并的消息。

You can see more information at [Section G.3.79, “git-merge(1)”](git-command.html#git-merge(1))

更多信息请参考: [Section G.3.79, “git-merge(1)”](git-command.html#git-merge(1))

Although major merge working is done by git automatically, conflict maybe happen during merge, please see [Section 2.31, “Resolving Conflicts”](tgit-dug-conflicts.html) to how to resolve conflict.

虽然通过 git 可以进行主要的自动合并工作, 但在合并时有可能会发生冲突, 请点击 [Section 2.31, “Resolving Conflicts”](tgit-dug-conflicts.html) 查看如何解决冲突。
