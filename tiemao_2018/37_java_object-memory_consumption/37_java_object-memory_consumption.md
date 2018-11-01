# What is the memory consumption of an object in Java?

> ### Question
> Is the memory space consumed by one object with 100 attributes the same as that of 100 objects, with one attribute each?
>
> How much memory is allocated for an object?
>
> How much additional space is used when adding an attribute?


# Answer1

[Mindprod](http://mindprod.com/jgloss/sizeof.html) points out that this is not a straightforward question to answer:


> A JVM is free to store data any way it pleases internally, big or little endian, with any amount of padding or overhead, though primitives must behave as if they had the official sizes.
> For example, the JVM or native compiler might decide to store a `boolean[]` in 64-bit long chunks like a `BitSet`. It does not have to tell you, so long as the program gives the same answers.
> - It might allocate some temporary Objects on the stack.
> - It may optimize some variables or method calls totally out of existence replacing them with constants.
> - It might version methods or loops, i.e. compile two versions of a method, each optimized for a certain situation, then decide up front which one to call.
> Then of course the hardware and OS have multilayer caches, on chip-cache, SRAM cache, DRAM cache, ordinary RAM working set and backing store on disk. Your data may be duplicated at every cache level. All this complexity means you can only very roughly predict RAM consumption.

## Measurement methods

You can use [`Instrumentation.getObjectSize()`](https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/Instrumentation.html#getObjectSize-java.lang.Object-) to obtain an estimate of the storage consumed by an object.

To visualize the *actual* object layout, footprint, and references, you can use the [JOL (Java Object Layout) tool](http://openjdk.java.net/projects/code-tools/jol/).

## Object headers and Object references

In a modern 64-bit JDK, an object has a 12-byte header, padded to a multiple of 8 bytes, so the minimum object size is 16 bytes. For 32-bit JVMs, the overhead is 8 bytes, padded to a multiple of 4 bytes. *(From Dmitry Spikhalskiy's answer, Jayen's answer, and JavaWorld.)*

Typically, references are 4 bytes on 32bit platforms or on 64bit platforms up to `-Xmx32G`; and 8 bytes above 32Gb (`-Xmx32G`). *(See compressed object references.)*

As a result, a 64-bit JVM would typically require 30-50% more heap space. *(Should I use a 32- or a 64-bit JVM?, 2012, JDK 1.7)*

## Boxed types, arrays, and strings

Boxed wrappers have overhead compared to primitive types (from [JavaWorld](http://www.javaworld.com/javaworld/javatips/jw-javatip130.html)):

> - **Integer**: The 16-byte result is a little worse than I expected because an `int` value can fit into just 4 extra bytes. Using an `Integer` costs me a 300 percent memory overhead compared to when I can store the value as a primitive type
> - **Long**: 16 bytes also: Clearly, actual object size on the heap is subject to low-level memory alignment done by a particular JVM implementation for a particular CPU type. It looks like a `Long` is 8 bytes of Object overhead, plus 8 bytes more for the actual long value. In contrast, `Integer` had an unused 4-byte hole, most likely because the JVM I use forces object alignment on an 8-byte word boundary.

Other containers are costly too:

> - **Multidimensional arrays**: it offers another surprise.
>   Developers commonly employ constructs like `int[dim1][dim2]` in numerical and scientific computing.
>
>   In an `int[dim1][dim2]` array instance, every nested `int[dim2]` array is an `Object` in its own right. Each adds the usual 16-byte array overhead. When I don't need a triangular or ragged array, that represents pure overhead. The impact grows when array dimensions greatly differ.
>
>   For example, a `int[128][2]` instance takes 3,600 bytes. Compared to the 1,040 bytes an `int[256]` instance uses (which has the same capacity), 3,600 bytes represent a 246 percent overhead. In the extreme case of `byte[256][1]`, the overhead factor is almost 19! Compare that to the C/C++ situation in which the same syntax does not add any storage overhead.
>
> - **String**: a `String`'s memory growth tracks its internal char array's growth. However, the `String` class adds another 24 bytes of overhead.
>
>   For a nonempty `String` of size 10 characters or less, the added overhead cost relative to useful payload (2 bytes for each char plus 4 bytes for the length), ranges from 100 to 400 percent.

## Alignment

Consider this [example object](https://plumbr.eu/blog/memory-leaks/how-much-memory-do-i-need-part-2-what-is-shallow-heap):

```
class X {                      // 8 bytes for reference to the class definition
   int a;                      // 4 bytes
   byte b;                     // 1 byte
   Integer c = new Integer();  // 4 bytes for a reference
}
```

A naïve sum would suggest that an instance of `X` would use 17 bytes. However, due to alignment (also called padding), the JVM allocates the memory in multiples of 8 bytes, so instead of 17 bytes it would allocate 24 bytes.



## Comments


- int[128][6]: 128 arrays of 6 ints - 768 ints in total, 3072 bytes of data + 2064 bytes Object overhead = 5166 bytes total. int[256]: 256 ints in total - therefore non-comparable. int[768]: 3072 bytes of data + 16 byes overhead - about 3/5th of the space of the 2D array - not quite 246% overhead!
  - Ah, the original article used int[128][2] not int[128][6] - wonder how that got changed. Also shows that extreme examples can tell a different story.
  - I have fixed the typos. int[128][2] became int[128][6] because of a bug in the Javascript editor: the links are referenced with [aTest][x] and the editor assumed [128][2] to be an link address! It did "re-order" the indexes of those links, changing the [2] into [6]... tricky!
    * This answer is outdated because lots of people are using 64bit JVM's these days and your answer is effectively ignoring 64bit JVM's. It's good to say "well, it depends..." but it's also good to give some good practical advice - things that are true for 99% of JVM's out there such as "8 bytes for 32bit, 12 bytes + 8-byte alignment for 64 bit, plus pointers are 8 bytes above -Xmx32G". – Tim Cooper Feb 15 '16 at 10:43

- The overhead is 16 bytes in 64bit JVM's.
  - No! The overhead (= new Object()) of Sun VM Java 1.6 64bit running on Win7 64 bit Intel is 12 bytes + 4 padding to next multiple of 8 makes 16 bytes. So if you have an object with one field int, it is still 16 bytes. (no padding)
    * Some garbage-collection schemes may impose a minimum object size which is separate from padding. During garbage collection, once an object gets copied from an old location to a new one, the old location may not need to hold the data for the object any more, but it will need to hold a reference to the new location; it may also need to store a reference to the old location of the object wherein the first reference was discovered and the offset of that reference within the old object [since the old object may still contain references that haven't yet been processed].
    * Using memory at an object's old location to hold the garbage-collector's book-keeping information avoids the need to allocate other memory for that purpose, but may impose a minimum object size which is larger than would otherwise be required. I think at least one version of .NET garbage collector uses that approach; it would certainly be possible for some Java garbage collectors to do so as well. – supercat Sep 19 '14 at 16:38




<https://stackoverflow.com/questions/258120/what-is-the-memory-consumption-of-an-object-in-java/258150>
