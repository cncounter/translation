前言(Preface)
==

本书主要是学习 Lisp 编程语言。
虽然 Lisp 被广泛认为是人工智能研究的主流编程语言(人工智能是计算机科学最先进的领域之一) —— 但对于刚接触编程的初学者, Lisp 依然是一门非常适合的入门语言。 
并因为其简单友好的交互式环境, 丰富的数据结构, 加上强大的编程开发工具, 在编程语言入门课程上得到越来越多的青睐. 即便是程序新手也能在短时间内迅速掌握。

This book is about learning to program in Lisp. Although widely known as the principal language of artificial intelligence research —— one of the most advanced areas of computer science—Lisp is an excellent language for beginners. It is increasingly the language of choice in introductory programming courses due to its friendly, interactive environment, rich data structures, and powerful software tools that even a novice can master in short order. 

##

本书主要面向三类读者:

When I wrote the book I had three types of reader in mind. I would like to address each in turn.

##

- 第一次学习编程的大学生. 可以是任何专业的学生, 从计算机科学到人文类专业都可以. 这也是书名里面 gentle 这个词的意思. 我假设你除了算术(arithmetic)之外没有学过其他的数学知识。 即使你不喜欢数学, 你也会发现计算机编程的乐趣。 我会尽量避免技术术语,书中会有大量的示例程序。 在课文中你也会发现大量的练习, 而所有习题的答案都在附录C里(Appendix C)。

- Students taking their first programming course. The student could be from any discipline, from computer science to the humanities. For you, let me stress the word gentle in the title. I assume no prior mathematical background beyond arithmetic. Even if you don’t like math, you may find you enjoy computer programming. I’ve avoided technical jargon, and there are lots of examples. Also you will find plenty of exercises interspersed with the text, and the answers to all of them are included in Appendix C.

##

- 心理学家、语言学家、计算机科学家、以及其他对人工智能(Artificial Intelligence)感兴趣的人。 当你开始将研究和AI结合时, 你会发现几乎所有在这个领域的研究都在使用 Lisp. 大多数Lisp书籍都是专门为计算机科学专业编写的, 但我在尽最大努力让每个人都能读懂这本书。 这本书可以是你了解AI的入门技术资料, 同时也会简单介绍它的核心工具。


- Psychologists, linguists, computer scientists, and other persons interested in Artificial Intelligence. As you begin your inquiry into AI, you will see that almost all research in this field is carried out in Lisp. Most Lisp texts are written exclusively for computer science majors, but I have gone to great effort to make this book accessible to everyone. It can be your doorway to the technical literature of AI, as well as a quick introduction to its central tool.

##

- 计算机爱好者。 在1984年前后, Lisp 这类语言在个人电脑上一点都不好玩, 那是因为早期的机器内存太小了。 今天的PC机少说也有上百兆的内存(2014年末,4GB内存的PC算是很低端的配置), 硬盘也成为标配(原书写作时是这样,在2014年SSD是中等档次电脑必备的硬件)。 可以运行Common Lisp 标准的完整实现, 提供和大学与工业研究实验室同样高质量的工具。 本书的 “Lisp工具包” 章节部分将向您介绍Common Lisp编程环境的高级特性, 让语言拥有产品级和人工智能编程的快速原型工具。


- Computer hobbyists. Prior to about 1984, the Lisps available on personal computers weren’t very good due to the small memories of the early machines. Today’s personal computers often come with several megabytes of RAM and a hard disk as standard equipment. They run full implementations of the Common Lisp standard, and provide the same high-quality tools as the Lisps in university and industrial research labs. The ‘‘Lisp Toolkit’’ sections of this book will introduce you to the advanced features of the Common Lisp programming environment that have made the language such a productive tool for rapid prototyping and AI programming.

##

本书主要用 Common Lisp 来做 "入门简介(gentle introduction)". Lisp 自发明后的前30年在不断地演进, 在过去, 不但各平台上的Lisp方言不兼容, 而且用某种方言写的程序几年后在同一种方言下也常常运行不起来, 因为语言在快速变更。 快速、无约束的进化在早期是有益的,但最终需要走向标准化,所以Common Lisp诞生了。 现在, Common Lisp 是事实上的标准, 受所有主流计算机制造商的支持。目前正在细化为一个官方的标准。但是Lisp仍将继续发展,标准也将会定期更新,以反映新的贡献者的语言。也许这些贡献者中有一个将会是你。


This current volume of the ‘‘gentle introduction’’ uses Common Lisp throughout. Lisp has been changing continuously since its invention 30 years ago. In the past, not only were the Lisp dialects on different machines incompatible, but programs written in one dialect would often no longer run in that same dialect a few years later, because the language had evolved out from under them. Rapid, unconstrained evolution was beneficial in the early days, but demand for a standard eventually grew, so Common Lisp was created. At present, Common Lisp is the de facto standard supported by all major computer manufacturers. It is currently undergoing refinement into an official standard. But Lisp will continue to evolve nonetheless, and the standard will be updated periodically to reflect new contributions people have made to the language. Perhaps one of those contributors will be you.


##

DAVID S. TOURETZKY

PITTSBURGH, PENNSYLVANIA


