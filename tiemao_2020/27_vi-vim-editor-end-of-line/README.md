# vi end of line command

# vim与vi跳到行尾的技巧

vi (vim) line navigation FAQ: What is the vi command to move to the end of the current line? (How do I move to the end of the current line in vim?)

Short answer: When in vi/vim command mode, use the "$" character to move to the end of the current line.

## Other vi/vim line related commands

While I'm in the *vi line* neighborhood, here's a longer answer, with a list of "vi/vim go to line" commands:

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

Just to be clear, you need to be in the vi/vim command mode to issue these commands. Getting into command mode is typically very simple, just hit the [Esc] key and you are usually there.

## Move up or down multiple lines with vim

You can also use the [Up] and [Down] arrow keys to move up and down lines in the vi or vim editor. But did you know that when you're in vi command mode, you can precede the [Up] or [Down] arrow keys with a number? For instance, if you want to move up 20 lines in the current file, you can type this:

```
20[UpArrow]
```

## vi/vim line navigation - summary

I hope these vi/vim line navigation examples are helpful. If you have any questions, or would like to share your own vi navigation commands, feel free to use the comment form below.





- https://alvinalexander.com/linux/vi-vim-editor-end-of-line/
