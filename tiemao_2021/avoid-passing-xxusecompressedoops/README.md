# Avoid passing `-XX:+UseCompressedOops`


Since we are analyzing thousands of Garbage Collection logs every single day through our GCeasy tool, we are noticing several java applications still continuing to use ‘-XX:+UseCompressedOops’ JVM argument. Actually, it’s not required to pass ‘-XX:+UseCompressedOops’ JVM argument if you are running in Java SE 6 update 23 and later. Compressed oops is supported and enabled by default in Java SE 6u23 and later versions.

“OOP” means Ordinary Object Pointer. It means a managed pointer to an object. An OOP is usually the same size as a native machine pointer, which means an OOP is 64 bits on a 64-bit operating system and 32 bits on a 32-bit operating system.

In a 32-bit operating system, JVM can address only up to 4GB (i.e., 2 ^ 32) memory. To manage larger amounts of memory, the JVM needs to run with 64-bit OOP, which can manage 18.5 Exabytes (i.e., 2 ^ 64 bytes). Very large size :-). Actually, there aren’t any servers in the world which has so much memory.

What this means is that for a twice as big address, a much larger memory area can be addressed. But this doesn’t comes at ‘free of cost’. When you switch from a 32-bit JVM to a 64-bit JVM, you will notice the loss of available memory by 1.5 times due to larger addresses. To fix this problem, JVM developers invented ‘Compressed Oops’ feature. More details about this compressed OOPs can be found here.

To activate this feature, you were required to pass ‘-XX:+UseCompressedOops’ JVM argument. However, starting from Java SE 6u23 and later versions, the use of compressed oops is made as default. Thus you don’t need to pass this flag explicitly anymore.


- 原文链接: [Avoid passing -XX:+UseCompressedOops](https://blog.gceasy.io/2020/04/16/avoid-passing-xxusecompressedoops/)
