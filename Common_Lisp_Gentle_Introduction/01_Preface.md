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

- 初次学习编程语言课程的大学生. 可以是任意专业, 包括计算机科学直到人文类的专业. 这个词,让我压力温和的标题。我假设没有之前的数学背景之外算术。即使你不喜欢数学,你会发现你喜欢计算机编程。我避免技术术语,有很多以。也你会发现大量的练习穿插文本,和他们所有人的答案都包含在附录C。

- Students taking their first programming course. The student could be from any discipline, from computer science to the humanities. For you, let me stress the word gentle in the title. I assume no prior mathematical background beyond arithmetic. Even if you don’t like math, you may find you enjoy computer programming. I’ve avoided technical jargon, and there are lots of xamples. Also you will find plenty of exercises interspersed with the text, and the answers to all of them are included in Appendix C.

- Psychologists, linguists, computer scientists, and other persons interested in Artificial Intelligence. As you begin your inquiry into AI, you will see that almost all research in this field is carried out in Lisp. Most Lisp texts are written exclusively for computer science majors, but I have gone to great effort to make this book accessible to everyone. It can be your doorway to the technical literature of AI, as well as a quick introduction to its central tool.

- Computer hobbyists. Prior to about 1984, the Lisps available on personal computers weren’t very good due to the small memories of the early machines. Today’s personal computers often come with several megabytes of RAM and a hard disk as standard equipment. They run full implementations of the Common Lisp standard, and provide the same high-quality tools as the Lisps in university and industrial research labs. The ‘‘Lisp Toolkit’’ sections of this book will introduce you to the advanced features of the Common Lisp programming environment that have made the language such a productive tool for rapid prototyping and AI programming.


This current volume of the ‘‘gentle introduction’’ uses Common Lisp throughout. Lisp has been changing continuously since its invention 30 years ago. In the past, not only were the Lisp dialects on different machines incompatible, but programs written in one dialect would often no longer run in that same dialect a few years later, because the language had evolved out from under them. Rapid, unconstrained evolution was beneficial in the early days, but demand for a standard eventually grew, so Common Lisp was created. At present, Common Lisp is the de facto standard supported by all major computer manufacturers. It is currently undergoing refinement into an official standard. But Lisp will continue to evolve nonetheless, and the standard will
be updated periodically to reflect new contributions people have made to the language. Perhaps one of those contributors will be you.

DAVID S. TOURETZKY

PITTSBURGH, PENNSYLVANIA


