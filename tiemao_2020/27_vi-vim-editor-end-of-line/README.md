# vi end of line command

# vim与vi跳到行尾的技巧

vi (vim) line navigation FAQ: What is the vi command to move to the end of the current line? (How do I move to the end of the current line in vim?)

vi (vim) 行导航常见问题: 使用什么 vi 命令可以移动到当前行的行尾? (在 vim 中如何移动到当前行的行尾?)

Short answer: When in vi/vim command mode, use the "$" character to move to the end of the current line.

简短回答: 在 vi/vim 的命令模式(command mode)下, 使用 "$" 字符即可移动到当前行的行尾。

## Other vi/vim line related commands

While I'm in the *vi line* neighborhood, here's a longer answer, with a list of "vi/vim go to line" commands:

## 其他与行导航相关的 vi/vim 命令

既然说到了 *vi 行操作* 这个话题, 这里给出一个更完整的回答, 列出常用的 "vi/vim 跳转到某行" 命令:

| vi command |                     description                     |
| :--------: | :-------------------------------------------------: |
|     0      |        move to beginning of the current line        |
|     $      |                 move to end of line                 |
|     H      |    move to the top of the current window (high)     |
|     M      |  move to the middle of the current window (middle)  |
|     L      | move to the bottom line of the current window (low) |
|     1G     |         move to the first line of the file          |
|    20G     |          move to the 20th line of the file          |
|     G      |          move to the last line of the file          |

| vi 命令 | 说明 |
| :-----: | :--: |
|    0    | 移动到当前行行首 |
|    $    | 移动到行尾 |
|    H    | 移动到当前窗口顶部(high) |
|    M    | 移动到当前窗口中部(middle) |
|    L    | 移动到当前窗口底部(low) |
|   1G    | 移动到文件第一行 |
|   20G   | 移动到文件第20行 |
|    G    | 移动到文件最后一行 |

Just to be clear, you need to be in the vi/vim command mode to issue these commands. Getting into command mode is typically very simple, just hit the [Esc] key and you are usually there.

需要说明的是, 这些命令必须在 vi/vim 的命令模式(command mode)下才能使用。 进入命令模式通常很简单, 按一下 [Esc] 键即可。

## Move up or down multiple lines with vim

You can also use the [Up] and [Down] arrow keys to move up and down lines in the vi or vim editor. But did you know that when you're in vi command mode, you can precede the [Up] or [Down] arrow keys with a number? For instance, if you want to move up 20 lines in the current file, you can type this:

## 用 vim 一次移动多行

在 vi 或 vim 编辑器中, 也可以使用 [Up] 和 [Down] 方向键上下移动。 但你可能不知道, 在 vi 命令模式下, 可以在 [Up] 或 [Down] 方向键前面加上一个数字。 例如, 想在当前文件中向上移动 20 行, 可以输入:

```
20[UpArrow]
```

## vi/vim line navigation - summary

I hope these vi/vim line navigation examples are helpful. If you have any questions, or would like to share your own vi navigation commands, feel free to use the comment form below.

## vi/vim 行导航小结

希望这些 vi/vim 行导航示例对你有帮助。 如果有问题, 或者想分享自己的 vi 导航命令, 欢迎使用下面的评论表单。





- https://alvinalexander.com/linux/vi-vim-editor-end-of-line/
