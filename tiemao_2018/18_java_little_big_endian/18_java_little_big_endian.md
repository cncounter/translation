# Little-Endian and Big-Endian in Java


You must have heard these terms Little-Endian and Big-Endian many times in your engineering course. Let’s quickly recap the concept behind these words.

These two terms are related to the direction of bytes in a word within CPU architecture. Computer memory is referenced by addresses that are positive integers. It is “natural” to store numbers with the least significant byte coming before the most significant byte in the computer memory. Sometimes computer designers prefer to use a reversed order version of this representation.

The “natural” order, where less significant byte comes before more significant byte in memory, is called little-endian. Many vendors like IBM, CRAY, and Sun preferred the reverse order that, of course, is called big-endian.

For example, the 32-bit hex value 0x45679812 would be stored in memory as follows:


```
Address         00  01  02  03
-------------------------------
Little-endian   12  98  67  45
Big-endian      45  67  98  12
```

Difference in endian-ness can be a problem when transferring data between two machines.

Everything in Java binary format files is stored in big-endian order. This is sometimes called network order. This means that if you use only Java, all files are done the same way on all platforms: Mac, PC, UNIX, etc. You can freely exchange binary data electronically without any concerns about endian-ness.

The problem comes when you must exchange data files with some program not written in Java that uses little-endian order, most commonly a program written in C. Some platforms use big-endian order internally (Mac, IBM 390); some uses little-endian order (Intel).

Java hides that internal endian-ness from you.


<https://howtodoinjava.com/core-java/basics/little-endian-and-big-endian-in-java/>
