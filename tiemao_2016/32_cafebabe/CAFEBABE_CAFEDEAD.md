# CAFEBABE的由来

Why is the first four bytes of Java class file format is CAFEBABE? Who named it?

James Gosling, the father of Java programming language, once explained it as follows:


As far as I know, I'm the guilty party on this one. I was totally unaware of the NeXT connection. The small number of interesting HEX words is probably the source of the match. As for the derivation of the use of CAFEBABE in Java, it's somewhat circuitous:

We used to go to lunch at a place called St Michael's Alley. According to local legend, in the deep dark past, the Grateful Dead used to perform there before they made it big. It was a pretty funky place that was definitely a Grateful Dead Kinda Place. When Jerry died, they even put up a little Buddhist-esque shrine. When we used to go there, we referred to the place as Cafe Dead.

Somewhere along the line it was noticed that this was a HEX number. I was re-vamping some file format code and needed a couple of magic numbers: one for the persistent object file, and one for classes. I used CAFEDEAD for the object file format, and in grepping for 4 character hex words that fit after CAFE (it seemed to be a good theme) I hit on BABE and decided to use it.

At that time, it didn't seem terribly important or destined to go anywhere but the trash-can of history. So CAFEBABE became the class file format, and CAFEDEAD was the persistent object format. But the persistent object facility went away, and along with it went the use of CAFEDEAD - it was eventually replaced by RMI.


另请参见:

https://en.wikipedia.org/wiki/Java_class_file