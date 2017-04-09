# class文件魔数CAFEBABE的由来

Why is the first four bytes of Java class file format is CAFEBABE? Who named it?

Java的class文件的前四个字节为什么是 `CAFEBABE`? 是谁定义的?


James Gosling, the father of Java programming language, once explained it as follows:

Java编程语言之父,詹姆斯•高斯林(James Gosling),曾这样回答:


As far as I know, I'm the guilty party on this one. I was totally unaware of the NeXT connection. The small number of interesting HEX words is probably the source of the match. As for the derivation of the use of CAFEBABE in Java, it's somewhat circuitous:

关于这一点,我很抱歉。我以前并不知道有 NeXT connection。这些有趣的十六进制数(HEX words)可能是匹配的来源. 至于在Java中使用CAFEBABE作为魔数的过程, 说起来有些曲折:


We used to go to lunch at a place called St Michael's Alley. According to local legend, in the deep dark past, the Grateful Dead used to perform there before they made it big. It was a pretty funky place that was definitely a Grateful Dead Kinda Place. When Jerry died, they even put up a little Buddhist-esque shrine. When we used to go there, we referred to the place as Cafe Dead.

我们经常去在一个叫圣米歇尔巷(St Michael's Alley)的地方吃午餐。根据当地传说, 在深暗的过去,感恩而死乐队(Grateful Dead)在出名之前曾在此地表演. 这绝对是因为 Grateful Dead Kinda Place 而闻名的地方。杰瑞(Jerry)去世时, 他们甚至有点Buddhist-esque神社.我们经常去那里时, 我们称这个地方为 **死亡咖啡**(Cafe Dead)。


Somewhere along the line it was noticed that this was a HEX number. I was re-vamping some file format code and needed a couple of magic numbers: one for the persistent object file, and one for classes. I used CAFEDEAD for the object file format, and in grepping for 4 character hex words that fit after CAFE (it seemed to be a good theme) I hit on BABE and decided to use it.

可以看到,这是一个十六进制数. 那时候我正好需要修补一些文件格式的编码,需要两个魔数(magic numbers): 一个用于对象持久化文件, 另一个用于类文件. 于是就使用 `CAFEDEAD` 作为对象持久化文件的格式, 当然,这两个个特征码有共同的前缀: 4个十六进制字符(`CAFE`, Java和咖啡有一段虐恋), 我选中了`BABE`(宝贝),于是洪荒之力就爆发了[鬼知道我都经历了什么,>2016年8月17日<]。


At that time, it didn't seem terribly important or destined to go anywhere but the trash-can of history. So CAFEBABE became the class file format, and CAFEDEAD was the persistent object format. But the persistent object facility went away, and along with it went the use of CAFEDEAD - it was eventually replaced by RMI.


当时,这并没有什么特别的, 也没什么重要意义, 或许很快就会成为历史的尘埃。所以 **CAFEBABE** 成为 class 文件格式, **CAFEDEAD** 成为持久对象的格式. 但是持久化对象(persistent object)技术真的消失了, 就如同它的魔数 CAFEDEAD 所述说的一样 —— 由RMI技术取代。





另请参见:

[WIKI百科: Java_class_file](https://en.wikipedia.org/wiki/Java_class_file)


* [深入Java虚拟机之二：Class类文件结构](http://www.voidcn.com/blog/u014600432/article/p-5040369.html)
