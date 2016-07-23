# CAFEBABE的由来

Why is the first four bytes of Java class file format is CAFEBABE? Who named it?

为什么Java的class文件的前四个字节是CAFEBABE? 是谁定义的?


James Gosling, the father of Java programming language, once explained it as follows:

Java编程语言之父,詹姆斯•高斯林(James Gosling),曾这样回答:


As far as I know, I'm the guilty party on this one. I was totally unaware of the NeXT connection. The small number of interesting HEX words is probably the source of the match. As for the derivation of the use of CAFEBABE in Java, it's somewhat circuitous:

关于这一点,我很抱歉。我以前并不知道有 NeXT connection。这些有趣的十六进制数(HEX words)可能是匹配的来源. 至于在Java中使用CAFEBABE作为魔数的过程, 说起来有些曲折:


We used to go to lunch at a place called St Michael's Alley. According to local legend, in the deep dark past, the Grateful Dead used to perform there before they made it big. It was a pretty funky place that was definitely a Grateful Dead Kinda Place. When Jerry died, they even put up a little Buddhist-esque shrine. When we used to go there, we referred to the place as Cafe Dead.

我们去吃午饭在一个叫圣米歇尔巷的地方。根据当地传说,在深暗的过去,感恩而死乐队用于执行之前他们做大的.这是一个非常时髦的地方,绝对是一个感恩而死的地方。杰瑞去世时,他们甚至有点Buddhist-esque神社.我们经常去那里时,我们称这个地方为咖啡馆死了。


Somewhere along the line it was noticed that this was a HEX number. I was re-vamping some file format code and needed a couple of magic numbers: one for the persistent object file, and one for classes. I used CAFEDEAD for the object file format, and in grepping for 4 character hex words that fit after CAFE (it seemed to be a good theme) I hit on BABE and decided to use it.

沿线的注意到,这是一个十六进制数.我是修补一些文件格式的代码,需要两个神奇的数字:一个用于持久化对象文件,和一个类.我CAFEDEAD用于对象文件格式,在grep 4字符十六进制字适合咖啡馆后(这似乎是一个很好的主题)我了宝贝,决定使用它。


At that time, it didn't seem terribly important or destined to go anywhere but the trash-can of history. So CAFEBABE became the class file format, and CAFEDEAD was the persistent object format. But the persistent object facility went away, and along with it went the use of CAFEDEAD - it was eventually replaced by RMI.


当时,这并没有什么特别的, 或许注定要消失在历史的垃圾堆里。所以 CAFEBABE 成为 class 文件格式, CAFEDEAD 成为持久对象的格式. 但是持久对象(persistent object)技术消失了, 就如同它的魔数 CAFEDEAD 一样 —— 由RMI技术取代。





另请参见:

https://en.wikipedia.org/wiki/Java_class_file