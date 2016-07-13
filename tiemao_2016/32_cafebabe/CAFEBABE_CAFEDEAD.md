# CAFEBABE的由来

Why is the first four bytes of Java class file format is CAFEBABE? Who named it?

为什么第一个Java类文件格式的四个字节是CAFEBABE吗?将其命名为谁?


James Gosling, the father of Java programming language, once explained it as follows:

詹姆斯•高斯林的父亲Java编程语言,一旦解释如下:


As far as I know, I'm the guilty party on this one. I was totally unaware of the NeXT connection. The small number of interesting HEX words is probably the source of the match. As for the derivation of the use of CAFEBABE in Java, it's somewhat circuitous:

据我所知,我是有罪的一方。我完全不知道下一个连接。小许多有趣的十六进制字可能是匹配的来源.至于在Java中使用CAFEBABE的推导过程,有些曲折:


We used to go to lunch at a place called St Michael's Alley. According to local legend, in the deep dark past, the Grateful Dead used to perform there before they made it big. It was a pretty funky place that was definitely a Grateful Dead Kinda Place. When Jerry died, they even put up a little Buddhist-esque shrine. When we used to go there, we referred to the place as Cafe Dead.

我们去吃午饭在一个叫圣米歇尔巷的地方。根据当地传说,在深暗的过去,感恩而死乐队用于执行之前他们做大的.这是一个非常时髦的地方,绝对是一个感恩而死的地方。杰瑞去世时,他们甚至有点Buddhist-esque神社.我们经常去那里时,我们称这个地方为咖啡馆死了。


Somewhere along the line it was noticed that this was a HEX number. I was re-vamping some file format code and needed a couple of magic numbers: one for the persistent object file, and one for classes. I used CAFEDEAD for the object file format, and in grepping for 4 character hex words that fit after CAFE (it seemed to be a good theme) I hit on BABE and decided to use it.

沿线的注意到,这是一个十六进制数.我是修补一些文件格式的代码,需要两个神奇的数字:一个用于持久化对象文件,和一个类.我CAFEDEAD用于对象文件格式,在grep 4字符十六进制字适合咖啡馆后(这似乎是一个很好的主题)我了宝贝,决定使用它。


At that time, it didn't seem terribly important or destined to go anywhere but the trash-can of history. So CAFEBABE became the class file format, and CAFEDEAD was the persistent object format. But the persistent object facility went away, and along with it went the use of CAFEDEAD - it was eventually replaced by RMI.


当时,并没有显得特别重要或注定要去任何地方,但历史的垃圾桶。所以CAFEBABE成为类文件格式,CAFEDEAD持久对象的格式.但是持久对象设施走了,连同它的使用CAFEDEAD——这是最终取代了RMI。





另请参见:

https://en.wikipedia.org/wiki/Java_class_file