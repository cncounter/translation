# Understanding sun.misc.Unsafe

> ###Shrouded in mystery, some say it's time for Java's Unsafe API to go -- or go public


Last week news broke that some developers are [up in arms](http://www.javaworld.com/article/2952639/java-se/java-devs-abhor-oracles-plan-to-kill-private-api.html), claiming that Oracle's proposed removal of sun.misc.Unsafe in Java 9 will [wreck the Java ecosystem](http://blog.dripstat.com/removal-of-sun-misc-unsafe-a-disaster-in-the-making/). For many developers not embroiled in low-level programming, however, the private API is likely shrouded in mystery. What is this API so dangerous that its very name is unsafe?

Blogger and open source contributor Rafael Winterhalter explains in "[Understanding sun.misc.Unsafe](https://dzone.com/articles/understanding-sunmiscunsafe)" that unsafe code is often required for [low-level programming](http://programmers.stackexchange.com/questions/22525/low-level-programming-whats-in-it-for-me), where developers modify platform functionality for a specific purpose. While JNI (Java Native Interface) is considered the safest option for low-level Java programming, many open source projects have used Unsafe as a less constrained workaround.

Winterhalter presents one of several examples utilizing Unsafe to overcome a Java programming hurdle:

> The first time I made use of the Unsafe class was for creating an instance of a class without calling any of the class's constructors. I needed to proxy an entire class which only had a rather noisy constructor but I only wanted to delegate all method invocations to a real instance [...] Creating a subclass was easy and if the class had been represented by an interface, creating a proxy would have been a straight-forward task. With the expensive constructor, I was however stuck. By using the Unsafe class, I was however able to work my way around it.


See "[Understanding sun.misc.Unsafe](https://dzone.com/articles/understanding-sunmiscunsafe)" and "[Java magic, Part 4: sun.misc.Unsafe](http://mishadoff.com/blog/java-magic-part-4-sun-dot-misc-dot-unsafe/)" for additional examples that demonstrate the why and how of using Unsafe in Java programs.








原文链接: [http://www.javaworld.com/article/2952869/java-platform/understanding-sun-misc-unsafe.html](http://www.javaworld.com/article/2952869/java-platform/understanding-sun-misc-unsafe.html)

