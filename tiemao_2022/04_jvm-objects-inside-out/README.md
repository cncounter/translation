# Java Objects Inside Out

Gory details you sometimes wondered about, but then did not really wanted to know about


Aleksey Shipilёv, JVM/Performance Geek, ![redhat logo](https://shipilev.net/jvm/objects-inside-out/redhat-logo.svg)
Shout out at Twitter: [@shipilev](http://twitter.com/shipilev)
Questions, comments, suggestions: [aleksey@shipilev.net](mailto:aleksey@shipilev.net)

|      | This post is also available in [ePUB](https://shipilev.net/jvm/objects-inside-out/article.epub) and [mobi](https://shipilev.net/jvm/objects-inside-out/article.mobi). |
| ---- | ------------------------------------------------------------ |
|      |                                                              |

Thanks to [Richard Startin](https://twitter.com/richardstartin), [Alex Blewitt](https://twitter.com/alblue), and others for reviews, edits and helpful suggestions!

## 1. Introduction

It is a recurrent question how much memory does a Java object take. In the absence of accessible `sizeof` operator,[[1](https://shipilev.net/jvm/objects-inside-out/#_footnotedef_1)] people left to wonder about the footprint impact on their code and/or resort to urban legends and tales from the wizards. In this post, we shall try to peek inside the Java objects and see what lies beneath. Once we do this, many tricks around object footprint would become apparent, some of the runtime footprint quirks would be explained, and some low-level performance behavior would hopefully be more clear.

This post is rather long, so you might want to consider reading it in pieces. The chapters in this post should be more or less independent, and you can get back at reading them after leaving for a while. In contrast to other posts, it was not very thoroughly reviewed before posting, and it would be updated and fixed up as people read it and identify mistakes, omissions, or have more questions. Use and/or trust this at your own risk.

## 2. Deeper Design and Implementation Questions (DDIQ)

In some sections, you might see the sidebars with more discussion about the design/implementation questions. These are not guaranteed to answer all the questions, but they do try to answer the most frequent ones. The answers there are based *on my understanding*, so it might be either inaccurate, incomplete, or both. If you wonder about something related to this post, send me an email, and maybe that would yield another DDIQ sidebar. Think about this as the "audience questions".

**DDIQ: Do we really need to read these sidebars?**

Not really. But they would probably give you better understanding why something is done that particular way. You might want to skip them on first read.

## 3. Methodology Considerations

This post assumes Hotspot JVM, the default JVM in OpenJDK and its derivatives. If you don’t know which JVM you are running, you most probably running Hotspot.

### 3.1. Tools

To do this properly, we need tools. When we acquire the tools, it is important to understand what tools can and cannot do.

1. Heap dumps. It might be enticing to dump the Java heap and inspect it. That seems to hinge on the belief that heap dump is a low-level representation of the runtime heap. But it unfortunately is not: it is a -lie- fantasy reconstructed (by GC itself, no less) from the actual Java heap. If you look at [HPROF data format](http://hg.openjdk.java.net/jdk6/jdk6/jdk/raw-file/tip/src/share/demo/jvmti/hprof/manual.html), you would see how high-level it actually is: it does not talk about field offsets, it does not tell anything about the headers directly, the only consolation is having the object size there, [which is also a lie](https://bugs.openjdk.java.net/browse/JDK-8005604). Heap dumps are great for inspecting the whole graphs of objects and their internal connectivity, but it is too coarse to inspect the objects themselves.
2. Measuring free or allocated memory via [MXBeans](https://docs.oracle.com/javase/7/docs/jre/api/management/extension/com/sun/management/ThreadMXBean.html). We can, of course, allocate multiple objects and see how much memory they took. With enough objects allocated, we can smooth out the outliers caused by TLAB allocation (and their retirement), spurious allocations in background threads, etc. This does not, however, give us any fidelity in looking into the object internals: we can only observe the apparent sizes of the objects. This is a fine way to do research, but you would need to properly formulate and test hypotheses to arrive to a sensible object model that explains every result.
3. Diagnostic JVM flags. But wait, since JVM itself is responsible for creating the objects, then surely it knows the object layout, and we *"only"* need to get it from there. [`-XX:+PrintFieldLayout`](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/runtime/globals.hpp#l765) would be our friend here. Unfortunately, that flag is only available in debug JVM versions.[[2](https://shipilev.net/jvm/objects-inside-out/#_footnotedef_2)]
4. Tools that poke into object internals. With some luck, taking `Class.getDeclaredFields` and asking for `Unsafe.objectFieldOffset` gives you the idea where the field resides. This runs into multiple caveats: first, it hacks into most classes with Reflection, which might be prohibited; second, `Unsafe.objectFieldOffset` does not formally answers the offset, but rather some "cookie" that can then be passed to other `Unsafe` methods.[[3](https://shipilev.net/jvm/objects-inside-out/#_footnotedef_3)] That said, it "usually works", so unless we do critically important things, it is fine to hack in. Some tools, notably [JOL](https://openjdk.java.net/projects/code-tools/jol/), do this for us.

In this post, we shall be using JOL, as we want to see the finer structure of Java objects. For our needs, we are good with JOL-CLI bundle, available here:

```
$ wget https://repo.maven.apache.org/maven2/org/openjdk/jol/jol-cli/0.10/jol-cli-0.10-full.jar -O jol-cli.jar
$ java -jar jol-cli.jar
Usage: jol-cli.jar <mode> [optional arguments]*

Available modes:
   internals: Show the object internals: field layout and default contents, object header
...
```

For object targets, we would try to use the various JDK classes themselves, where possible. This would make the whole thing easily verifiable, as you would only need the JOL CLI JAR and your favorite JDK installation to run the tests. In more complicated cases, we would go to [JOL Samples](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/) that cover some of the things here. As the last resort, we would be using the example classes.

|      | If you prefer something more hands-on, you can play with the entire collection of JOL Samples instead of reading this post ;) |
| ---- | ------------------------------------------------------------ |
|      |                                                              |

### 3.2. JDKs

The most ubiquitous JDK version deployed in the world is still JDK 8. Therefore, we would be using it here as well, so that findings in this post would be immediately usable. There are no substantial changes in field layout strategies up until JDK 15, which we would talk in later sections. JDK classes layout *themselves* might change too, so we would still try to target classes that are the same in all JDKs. Additionally, we would need both x86_32 and x86_64 binaries at some point.

It is easier for me to just use my own binaries for this purpose:

```
$ curl https://builds.shipilev.net/openjdk-jdk8/openjdk-jdk8-latest-linux-x86_64-release.tar.xz | tar xJf -; mv j2sdk-image jdk8-64
$ curl https://builds.shipilev.net/openjdk-jdk8/openjdk-jdk8-latest-linux-x86-release.tar.xz    | tar xJf -; mv j2sdk-image jdk8-32
$ curl https://builds.shipilev.net/openjdk-jdk/openjdk-jdk-latest-linux-x86_64-release.tar.xz   | tar xJf -; mv jdk jdk15-64

$ jdk8-64/bin/java -version
openjdk version "1.8.0-builds.shipilev.net-openjdk-jdk8-b51-20200410"
OpenJDK Runtime Environment (build 1.8.0-builds.shipilev.net-openjdk-jdk8-b51-20200410-b51)
OpenJDK 64-Bit Server VM (build 25.71-b51, mixed mode)

$ jdk8-32/bin/java -version
openjdk version "1.8.0-builds.shipilev.net-openjdk-jdk8-b51-20200410"
OpenJDK Runtime Environment (build 1.8.0-builds.shipilev.net-openjdk-jdk8-b51-20200410-b51)
OpenJDK Server VM (build 25.71-b51, mixed mode)

$ jdk15-64/bin/java -version
openjdk version "15-testing" 2020-09-15
OpenJDK Runtime Environment (build 15-testing+0-builds.shipilev.net-openjdk-jdk-b1214-20200410)
OpenJDK 64-Bit Server VM (build 15-testing+0-builds.shipilev.net-openjdk-jdk-b1214-20200410, mixed mode, sharing)
```

## 4. Data Types And Their Representation

We need to start with some basics. In just about every JOL "internals" run, you would see this output (it would be omitted in future invocations for brevity):

```
$ jdk8-64/bin/java -jar jol-cli.jar internals java.lang.Object
...
# Field sizes by type: 4, 1, 1, 2, 2, 4, 4, 8, 8 [bytes]
# Array element sizes: 4, 1, 1, 2, 2, 4, 4, 8, 8 [bytes]
```

It means that Java references take 4 bytes ([compressed references](https://shipilev.net/jvm/anatomy-quarks/23-compressed-references/) enabled), `boolean`/`byte` take 1 byte, `char`/`short` take 2 bytes, `int`/`float` take 4 bytes, `double`/`long` take 8 bytes. They take the same space when presented as array elements.

Why does it matter? It matters because Java Language Specification does not say anything about the data representation, it only says what values those types accept. It is possible, in principle, to allocate 8 bytes for all primitives, as long as math over them follows the specification. In current Hotspot, almost all data types match their value domain exactly, except for `boolean`. `int`, for example, is specified to support values from `-2147483648` to `2147483647`, which fits 4 byte signed representation exactly.

As said above, there is one oddity, and that is `boolean`. In principle, its value domain contains only two values: `true` and `false`, so it can be represented with 1 bit. All `boolean` fields and array elements still take 1 full byte, and that is for two reasons: Java Memory Model guarantees the [absence of word tearing](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.6) for invididual fields/elements, which is hard to do with 1-bit boolean fields, and field offsets are addressed as memory, that is in *bytes*, which makes addressing `boolean` fields awkward. So, taking 1 byte per `boolean` is a practical compromise here.

**DDIQ: But what would it cost to make 1-bit boolean fields/elements anyway?**

On most modern hardware there is no access atomicity for accessing single bits. It is not very problematic for reads, where we can read the entire byte and then mask-shift the bits we want. But it is very problematic *for writes*, where the writes to adjacent `boolean` fields should not overwrite one another ("the absence of word tearing"). In other words, these two threads cannot do full byte stores:

```
Thread 1:
 mov %r1, (loc)  # read the entire byte
 or %r1, 0x01    # set the 1-st bit
 mov (loc), %r1  # write the byte back

Thread 2:
 mov %r2, (loc)  # read the entire byte
 or %r2, 0x10    # set the 2-nd bit
 mov (loc), %r2  # write the byte back
```

…because that would lose writes: one thread might not notice the write of the other one, and overwrite it, a big no-no. You could theoretically do it atomically like this:

```
Thread 1:
 lock or (loc), 0x01  # set the 1-st bit in-place

Thread 2:
 lock or (loc), 0x10  # set the 2-st bit in-place
```

…or do CAS loop on it, and that would work, but it would mean that a simple `boolean` store would have wildly different performance characteristics from the rest of the stores.

## 5. Mark Word

Moving on to the actual object structure. Let us start from the very basic example of `java.lang.Object`. JOL would print this:

```
$ jdk8-64/java -jar jol-cli.jar internals java.lang.Object
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 00 00 00 # Mark word
      4     4        (object header)              00 00 00 00 # Mark word
      8     4        (object header)              00 10 00 00 # (not mark word)
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

It shows that the first 12 bytes are the object header. Unfortunately, it does not resolve its internal structure in greater detail, so we need to dive into the Hotspot source code to figure this out. In there, you would notice the object header [consists of two parts](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/oop.hpp#l52): *mark word* and *class word*. Class word carries the information about the object’s type: it links to the native structure that describes the class. We will talk about that part in the next section. The rest of the metadata is carried in the [mark word](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/markWord.hpp#l33).

There are several uses for the mark word:

1. Storing the metadata (forwarding and object age) for moving GCs.
2. Storing the identity hash code.
3. Storing the locking information.

Note that every single object out there has to have a mark word, because it handles the things common to every Java object. This is also why it takes the very first slot in the object internal structure: VM needs to access it very fast on the time-sensitive code paths, for example STW GC. Understanding the use cases for mark word highlights the lower boundaries for the space it takes.

### 5.1. Storing Forwarding Data for Moving GCs

When GCs need to move the object, they need to record the new location for the object, at least temporarily. Mark word would encode this for GC code to coordinate the relocation and update-references work. This locks mark word to be as wide as the Java reference representation. Due to the way [compressed references](https://shipilev.net/jvm/anatomy-quarks/23-compressed-references/) are implemented in Hotspot, this reference is always uncompressed, so it is as wide as machine pointer.

This, in turn, defines the minimum amount of memory the mark word takes in that implementation: 4 bytes for 32-bit platforms, and 8 bytes for 64-bit platforms.

**DDIQ: Can we store the compressed reference in the mark word?**

Yes, we technically can. This, however, still runs into problems where we cannot encode the compressed reference on a very large heap or when compressed references are disabled. That could be handled with runtime checks, but then we would face checks on every object access by native GC code, which would be inconvenient. With some engineering, that could be mitigated too, but the cost/benefit trade-off is not in favor of doing this.

**DDIQ: Can we store the GC forwarding data somewhere else, not in mark word?**

Yes, we technically can use whatever slot in the object. This, however, has a major caveat: from GC perspective, not only you need to know where the object is forwarded, you *also* need to know if object is forwarded at all. Which means, you need to have the *special value* in target slot that tells you "no forwarding yet", and interpret other values as "forwarded to X". If we co-opt an arbitrary slot in the object, there is a chance that slot already has the value *looking like* "forwarded to X", and your GC breaks. You need something where you control the value set to avoid collisions likes. Early Shenandoah prototypes, for example, tagged class word slots for this, the experiment long scrapped. Final Shenandoah implementations use the same mark word as STW GCs.

You can also bite the bullet and store the forwarding information completely outside of heap, like ZGC does.

We cannot, unfortunately, show the mark words that carry GC forwardings from the Java application (and JOL is a Java application), because either we are running with stop-the-world GC and they are already gone by the time we unblock from the pause, or concurrent GC barriers prevent us from seeing the old objects.

### 5.2. Storing Object Ages for GCs

We can, however, demonstrate the object age bits!

```
$ jdk8-32/bin/java -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_19_Promotion
# Running 32-bit HotSpot VM.

Fresh object is at d2d6c0f8
*** Move  1, object is at d31104a0
  (object header)  09 00 00 00 (00001001 00000000 00000000 00000000)
                                 ^^^^
*** Move  2, object is at d3398028
  (object header)  11 00 00 00 (00010001 00000000 00000000 00000000)
                                 ^^^^
*** Move  3, object is at d3109688
  (object header)  19 00 00 00 (00011001 00000000 00000000 00000000)
                                 ^^^^
*** Move  4, object is at d43c9250
  (object header)  21 00 00 00 (00100001 00000000 00000000 00000000)
                                 ^^^^
*** Move  5, object is at d41453f0
  (object header)  29 00 00 00 (00101001 00000000 00000000 00000000)
                                 ^^^^
*** Move  6, object is at d6350028
  (object header)  31 00 00 00 (00110001 00000000 00000000 00000000)
                                 ^^^^
*** Move  7, object is at a760b638
  (object header)  31 00 00 00 (00110001 00000000 00000000 00000000)
                                 ^^^^
```

Notice how with every move a few bits count upwards. That the recorded object age. It curiously stops at `6` after 7 moves. This fits the default setting for `InitialTenuringThreshold=7`. If you increase that, the object would experience more moves until it reaches the old generation.

### 5.3. Identity Hash Code

Every Java object has a [hash code](https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html#hashCode--). When there is no user definition for it, then [*identity hash code*](https://docs.oracle.com/javase/8/docs/api/java/lang/System.html#identityHashCode-java.lang.Object-) would be used.[[4](https://shipilev.net/jvm/objects-inside-out/#_footnotedef_4)] Since identity hash code should not change after computed for the given object, we need to store it somewhere. In Hotspot, it is stored right in the mark word of the target object. Depending on the precision that identity hash code accepts, it may require as much as 4 bytes to store. Since mark word is already at least 4 bytes long due to the reasons from the last section, the space is available.

**DDIQ: How does that work when we need to store GC forwarding data too?**

The answer is cunning: when GC moves the object, it actually deals with *two* copies of the object, one at old location, and one at new location. New object carries all the original headers. Old object is there only to serve GC needs, and therefore we can overwrite its header with GC metadata. This is how most (all?) stop-the-world GCs work in Hotspot, and this is how fully-concurrent Shenandoah GC [works](https://developers.redhat.com/blog/2019/06/28/shenandoah-gc-in-jdk-13-part-2-eliminating-the-forward-pointer-word/).

**DDIQ: Why do we need to store the identity hash code? How does this affect the user-specified hash code?**

Hash codes are supposed to have two properties: a) *good distribution*, meaning the values for distinct objects are more or less distinct; b) *idempotence*, meaning having the same hash code for the objects that have the same key object components. Note the latter implies that if object had not changed those key object components, its hash code should not change as well.

It is a frequent source of bugs to change the object in such a way that its `hashCode` changes after it was used. For example, adding the object to a `HashMap` as key, then changing its fields so that `hashCode` mutates as well would lead to surprising behaviors: the object might not be found in the map at all, because internal implementation would look in the "wrong" bucket. Likewise, it is a frequent source of performance anomalies to have badly distributed hash codes, for example returning a constant value.

For user-specified hash code, both properties are achieved by computing it over the set of user-selected fields. With enough variety of fields and field values, it would be well distributed, and by computing it over the unchanged (for example, `final`) fields we get idempotence. In this case, we don’t need to store the hash code anywhere. Some hash code implementations may choose to cache it in another field, but that is not required.

For identity hash code, there is no guarantee *there are* fields to compute the hash code from, and even if we have some, then it is unknown how stable those fields actually are. Consider `java.lang.Object` that does not have fields: what’s its hash code? Two allocated `Object`-s are pretty much the mirrors of each other: they have the same metadata, they have the same (that is, empty) contents. The only distinct thing about them is their allocated address, but even then there are two troubles. First, addresses have very low entropy, especially coming from a bump-ptr allocator like most Java GCs employ, so it is not well distributed. Second, GC *moves* the objects, so address is not idempotent. Returning a constant value is a no-go from performance standpoint.

So, current implementations compute the identity hash code from the internal PRNG ("good distribution"), and store it for every object ("idempotence").

The changes in markword caused by identity hash code can be seen clearly with the relevant [JOLSample_15_IdentityHashCode](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_15_IdentityHashCode.java#l41). Running it with 64-bit VM:

```
$ jdk8-64/bin/java -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_15_IdentityHashCode
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

**** Fresh object
org.openjdk.jol.samples.JOLSample_15_IdentityHashCode$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              88 55 0d 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

hashCode: 5ccddd20

**** After identityHashCode()
org.openjdk.jol.samples.JOLSample_15_IdentityHashCode$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 20 dd cd
      4     4        (object header)              5c 00 00 00
      8     4        (object header)              88 55 0d 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

Notice that the hash code value is `5ccddd20`. You can spot it in the object header now: `01 20 dd cd 5c`. `01` is the mark word tag, and the rest is the identity hash code written in little-endian. And we still have 3 bytes to spare! But that is possible since we have large-ish mark word. What happens if we run with 32-bit VM, where the entire mark word is just 4 bytes?

This is what happens:

```
$ jdk8-32/bin/java -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_15_IdentityHashCode
# Running 32-bit HotSpot VM.

**** Fresh object
org.openjdk.jol.samples.JOLSample_15_IdentityHashCode$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              c0 ab 6b a3
Instance size: 8 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total

hashCode: 12ddf17

**** After identityHashCode()
org.openjdk.jol.samples.JOLSample_15_IdentityHashCode$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              81 8b ef 96
      4     4        (object header)              c0 ab 6b a3
Instance size: 8 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

It is obvious that object header had changed. But it takes a keen eye to see where the `12ddf17` hashcode actually is. What you see in the header is identity hashcode shifted "right by one". So, one of the bits ends up in the first byte, yielding `81`, and the rest transforms into `12ddf17 >> 1 = 96ef8b`. Notice that it reduces the *domain* for identity hash code from 32 bits to "just" 25 bits.

**DDIQ: But wait, `System.identityHashCode` is `int`, so we expect full 32-bit hashcode?**

The range for `identityHashCode` is deliberately unspecified to enable this kind of trade-off. Putting the entire 32 bit identity hash code in 32-bit mode would require adding another word per object, which would be problematic for footprint. The implementation is free to cut the hashcode storage down to fit most of the bits of it. That, unfortunately, comes as yet another corner case when comparing 32-bit and 64-bit executions of seemingly the same Java code.

### 5.4. Locking Data

Java synchronization employs a [sophisticated state machine](https://wiki.openjdk.java.net/display/HotSpot/Synchronization). Since every Java object can be synchronized on, the locking state should be associated with any Java object. Mark word holds most of that state.

Different parts of those locking transitions could be seen in object header. For example, when a Java lock is *biased* towards a particular thread, we need to record the information about that lock near the relevant object. This is captured by the relevant [JOLSample_13_BiasedLocking](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_13_BiasedLocking.java#l41) example:

```
$ jdk8-64/bin/java -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_13_BiasedLocking
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

**** Fresh object
org.openjdk.jol.samples.JOLSample_13_BiasedLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 00 00 00  # No lock
      4     4        (object header)              00 00 00 00
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** With the lock
org.openjdk.jol.samples.JOLSample_13_BiasedLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 b0 00 80  # Biased lock
      4     4        (object header)              b8 7f 00 00  # Biased lock
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** After the lock
org.openjdk.jol.samples.JOLSample_13_BiasedLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 b0 00 80 # Biased lock
      4     4        (object header)              b8 7f 00 00 # Biased lock
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

Note how we recorded the native pointer to the lock descriptor in the header: `b0 00 80 b8 7f`. That lock is now biased towards the thread pointed to that native pointer.

Similar thing happens when we lock without the bias, see [JOLSample_14_FatLocking](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_14_FatLocking.java#l41) example:

```
$ jdk8-64/bin/java -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_14_FatLocking
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

**** Fresh object
org.openjdk.jol.samples.JOLSample_14_FatLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # No lock
      4     4        (object header)              00 00 00 00
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** Before the lock
org.openjdk.jol.samples.JOLSample_14_FatLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              78 19 57 1a  # Lightweight lock
      4     4        (object header)              85 7f 00 00
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** With the lock
org.openjdk.jol.samples.JOLSample_14_FatLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              0a 4b 00 b4  # Heavyweight lock
      4     4        (object header)              84 7f 00 00
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** After the lock
org.openjdk.jol.samples.JOLSample_14_FatLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              0a 4b 00 b4  # Heavyweight lock
      4     4        (object header)              84 7f 00 00
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** After System.gc()
org.openjdk.jol.samples.JOLSample_14_FatLocking$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              09 00 00 00  # Lock recycled
      4     4        (object header)              00 00 00 00
      8     4        (object header)              c0 07 08 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

Here, we see the usual lifecycle for the lock: first object has no lock recorded, then it is acquired by other thread and (lightweight) synchronization lock is installed, then main thread contends on it, inflating it, then locking information still references the inflated lock after everyone had unlocked. And finally, at some later point the lock is deflated, and object frees its association with it.

### 5.5. Observation: Identity Hashcode Disables Biased Locking

But what if we need to store identity hashcode while biased locking is in effect? Simple: identity hashcode takes precedence, and biased locking gets disabled for that object/class. This can be seen with the relevant example, [JOLSample_26_IHC_BL_Conflict](http://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_26_IHC_BL_Conflict.java):

```
$ jdk8-64/bin/java -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_26_IHC_BL_Conflict
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

**** Fresh object
org.openjdk.jol.samples.JOLSample_26_IHC_BL_Conflict$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 00 00 00  # No lock
      4     4        (object header)              00 00 00 00
      8     4        (object header)              f8 00 01 f8
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** With the lock
org.openjdk.jol.samples.JOLSample_26_IHC_BL_Conflict$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 b0 00 20  # Biased lock
      4     4        (object header)              e5 7f 00 00  # Biased lock
      8     4        (object header)              f8 00 01 f8
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** After the lock
org.openjdk.jol.samples.JOLSample_26_IHC_BL_Conflict$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 b0 00 20  # Biased lock
      4     4        (object header)              e5 7f 00 00  # Biased lock
      8     4        (object header)              f8 00 01 f8
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

hashCode: 65ae6ba4

**** After the hashcode
org.openjdk.jol.samples.JOLSample_26_IHC_BL_Conflict$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 a4 6b ae  # Hashcode
      4     4        (object header)              65 00 00 00  # Hashcode
      8     4        (object header)              f8 00 01 f8
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** With the second lock
org.openjdk.jol.samples.JOLSample_26_IHC_BL_Conflict$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              50 f9 b8 29  # Lightweight lock
      4     4        (object header)              e5 7f 00 00  # Lightweight lock
      8     4        (object header)              f8 00 01 f8
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

**** After the second lock
org.openjdk.jol.samples.JOLSample_26_IHC_BL_Conflict$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 a4 6b ae  # Hashcode
      4     4        (object header)              65 00 00 00  # Hashcode
      8     4        (object header)              f8 00 01 f8
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

In this example, biased locking works on a fresh object, but the moment we ask its `hashCode`, we end up computing its identity hash code (since there is no override for `Object.hashCode`), which installs the computed value in the mark word. Subsequent locks could only displace the identity hash code value temporarily, but it would be there as soon as (non-biased) locking is released. Since there is no way to store biased locking information in mark word anymore, it does not work for that object from this moment on.

**DDIQ: Would this kind of conflict affect only that one instance?**

Not necessarily. The underlying problem is that unbias is rather costly, so biased locking machinery would try to minimize the rebias frequency. If the machinery detects that some unbiases are very frequent, it may decide that the entire class of objects [should be rebiased](http://hg.openjdk.java.net/jdk/jdk/file/9a81c0a34bd0/src/hotspot/share/runtime/globals.hpp#l794), or [cannot be biased](http://hg.openjdk.java.net/jdk/jdk/file/9a81c0a34bd0/src/hotspot/share/runtime/globals.hpp#l800) at all in the future.

### 5.6. Observation: 32-bit VMs Improve Footprint

Since mark word size depends on target bitness, it is conceivable that 32-bit VMs take less space per object, *even without (reference) fields involved*. This can be demonstrated by inspecting the plain `Object` layout on 32-bit and 64-bit VMs:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals java.lang.Object
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              05 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              00 10 00 00  # Class word (compressed)
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
$ jdk8-32/bin/java -jar jol-cli.jar internals java.lang.Object
# Running 32-bit HotSpot VM.

Instantiated the sample instance via default constructor.

java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              48 51 2b a3  # Class word
Instance size: 8 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

Here, 64-bit VM mark word takes 8 (mark word) + 4 (class word) = 12 bytes, whereas 32-bit VM takes 4 (mark word) and + 4 (class word) = 8 bytes, respectively. With object alignment by 8 bytes, these get rounded up to 16 and 8 bytes, respectively. On this small object, the space savings are 2x!

## 6. Class Word

From the native machine perspective, every object is just a bunch of bytes. There are cases where we want to know what is the **type** of the object we are dealing with at runtime. The non-exhaustive list of cases where it is needed:

1. Runtime type checks.
2. Determining the object size.
3. Figuring out the target for virtual/interface call.

Class words can also be compressed. Even though class pointers are not Java heap references, they can still enjoy similar optimization.[[5](https://shipilev.net/jvm/objects-inside-out/#_footnotedef_5)]

### 6.1. Runtime Type Checks

Java is a type-safe language, so it needs runtime type checking on many paths. Class word carries the data about the actual type of the object we have, which allows compilers to emit *runtime type checks*. The efficiency of those runtime checks depend on the shape the type metadata takes.

If metadata is encoded in a simple form, compilers can even inline those checks straight in the code stream. In Hotspot, class word holds the [native pointer to the VM `Klass`](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/oop.hpp#l57) instance that carries lots of metainformation, including the [types of superclasses it extends, interfaces it implements](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/klass.hpp#l120), etc. It also carries the *Java mirror*, which is the [associated instance](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/klass.hpp#l138) of `java.lang.Class`. This indirection allows treating `java.lang.Class` instances as regular objects and move them without updating every single class word during the GC: `java.lang.Class` can move, while `Klass` stays at the same location all the time.

**DDIQ: So, is type-checking costly?**

In many cases, the type is known more or less precisely from the context. For example, in the method that accepts `MyClass` argument, we can be pretty sure that argument is `MyClass` or the subclass of it. So, on happy paths, we usually do not need the type checks. But, if that fails, we would have to emit the runtime checks that access that object metadata. The usual examples are [devirtualization](https://shipilev.net/blog/2015/black-magic-method-dispatch/#__strong_c2_dynamic_interface_ref_strong) and checked casts.

For example, the checked cast would look like this:

```
private Object o = new MyClass();

@CompilerControl(CompilerControl.Mode.DONT_INLINE)
@Benchmark
public MyClass testMethod() {
  return (MyClass)o;
}
 mov    0x10(%rsi),%rax       ; getfield "o"
 mov    0x8(%rax),%r10        ; get o.<classword>, Klass*
 movabs $0x7f5bc5144c48,%r11  ; load known Klass* for MyClass
 cmp    %r11,%r10             ; checked cast
 jne    0x00007f64004e1b63    ; not equal? go to slowpath, check subclasses there
 ... %rax is definitely MyClass now
```

**DDIQ: So, this can be exploited to write very efficient intrinics?**

Yes, in fact, `Object.getClass()` would be routinely intrinsified like this:

```
@CompilerControl(CompilerControl.Mode.DONT_INLINE)
@Benchmark
public Class<?> test() {
  return o.getClass();
}
  mov    0x10(%rsi),%r10    ; getfield "o"
  mov    0x8(%r10),%r10     ; get o.<classword>, Klass*
  mov    0x70(%r10),%r10    ; get Klass._java_mirror, OopHandle
  mov    (%r10),%rax        ; dereference OopHandle, get java.lang.Class
   ... %rax is now java.lang.Class instance
```

### 6.2. Determining The Object Size

Determining the object size takes the similar route. In contrast to the runtime type checks that do not know the type of the object statically all the time, allocation does know the size of the allocating object more or less precisely: it is defined by the type of constructor used, array initializer used, etc. So, in those cases, reaching through the classword is not needed.

But there are cases in the native code (most notably, garbage collectors) that want to walk [the parsable heap](https://shipilev.net/jvm/anatomy-quarks/5-tlabs-and-heap-parsability/) with code like:

```
HeapWord* cur = heap_start;
while (cur < heap_used) {
  object o = (object)cur;
  do_object(o);
  cur = cur + o->size();
}
```

For that to work, native code needs to know what the size of current (untyped!) object is, and hopefully know it fast. So, for native code, it does very much matter how class metadata is arranged. In Hotspot, we can reach through the class word to the [layout helper](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/klass.hpp#l89), that would give us information about object sizes.

**DDIQ: Are you saying garbage collectors touch more memory than the heap itself?**

Yes, Hotspot GCs [need to reach for class metadata](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/oops/oop.inline.hpp#l185) to figure out object size. Most of the time they hit the same metadata over and over again, but that dependent memory read still costs quite a bit. The wonders of untyped native accesses! You can see that in native code disassembly, for example for `MutableSpace::object_iterate` [here](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/hotspot/share/gc/parallel/mutableSpace.cpp#l228):

```
$ objdump -lrdSC ./build/linux-x86_64-server-release/hotspot/variant-server/libjvm/objs/mutableSpace.o
...
void MutableSpace::object_iterate(ObjectClosure* cl) {
...
#  HeapWord* p = bottom();
...
#  while (p < top()) {
...
# Klass* oopDesc::klass() const {
#  if (UseCompressedClassPointers) {
#    return CompressedKlassPointers::decode_not_null(_metadata._compressed_klass);
#  } else {
#    return _metadata._klass;
...
  d0:   49 8b 7e 08             mov    0x8(%r14),%rdi  ; get Klass*
#  int layout_helper() const            { return _layout_helper; }
  d4:   8b 4f 08                mov    0x8(%rdi),%ecx  ; get layout helper
#  if (lh > Klass::_lh_neutral_value) {
  d7:   83 f9 00                cmp    $0x0,%ecx
  da:   7e 4e                   jle    12a
#    if (!Klass::layout_helper_needs_slow_path(lh)) {
  dc:   f6 c1 01                test   $0x1,%cl        ; layout helper *is* size?
  df:   0f 85 9b 00 00 00       jne    180
#      s = lh >> LogHeapWordSize;  // deliver size scaled by wordSize
  e5:   89 c8                   mov    %ecx,%eax
  e7:   c1 f8 03                sar    $0x3,%eax       ; this is object size now
#    p += oop(p)->size();
  ea:   48 98                   cltq
  ec:   4d 8d 34 c6             lea    (%r14,%rax,8),%r14
  f0:   49 8b 44 24 38          mov    0x38(%r12),%rax
#  while (p < top()) {
...
#    cl->do_object(oop(p));
...
 103:   ff 10                   callq  *(%rax)
```

### 6.3. Figuring Out The Target Of Virtual/Interface Call

When runtime needs to invoke the virtual/interface method on the object instance, it needs to determine where the target method is. While most of the time [that can be optimized](https://shipilev.net/blog/2015/black-magic-method-dispatch/), there are cases where [we need to do](https://shipilev.net/jvm/anatomy-quarks/16-megamorphic-virtual-calls/) the actual dispatch. The performance of that dispatch also depends on how far away the class metadata is, so this cannot be neglected.

### 6.4. Observation: Compressed References Affect Object Header Footprint

Similarly to the observation about the mark word sizes depending on JVM bitness, we can also expect that compressed reference mode affects object sizes, *even without reference fields involved*. To demonstrate that, let’s take `java.lang.Integer` on two heap sizes, small (1 GB) and large (64 GB). These heap sizes would have compressed references turned on and off by default, respectively. This would mean compressed class pointers are also on or off by default.

```
$ jdk8-64/bin/java -Xmx1g -jar jol-cli.jar internals java.lang.Integer
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via public java.lang.Integer(int)

java.lang.Integer object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00 # Mark word
      4     4        (object header)              00 00 00 00 # Mark word
      8     4        (object header)              de 21 00 20 # Class word
     12     4    int Integer.value                0
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
$ jdk8-64/bin/java -Xmx64g -jar jol-cli.jar internals java.lang.Integer
# Running 64-bit HotSpot VM.

Instantiated the sample instance via public java.lang.Integer(int)

java.lang.Integer object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00 # Mark word
      4     4        (object header)              00 00 00 00 # Mark word
      8     4        (object header)              40 69 25 ad # Class word
     12     4        (object header)              e5 7f 00 00 # (uncompressed)
     16     4    int Integer.value                0
     20     4        (loss due to the next object alignment)
Instance size: 24 bytes # AHHHHHHH....
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

Here, in VM with 1 GB heap, object header takes 8 (mark word) + 4 (class word) = 12 bytes, whereas 64G VM header takes 8 (mark word) and + 8 (class word) = 16 bytes, respectively. If there were no fields, both would round up to 16 bytes due to object alignment by 8. But, since there *is* an `int` field, in 64 GB case, we need to allocate it past 16 bytes, and thus need another 8 bytes, taking 24 bytes in total.

## 7. Header: Array Length

Arrays come with another little piece of metadata: array length. Since the object type only encodes the array element type, we need to store the array length somewhere else.

This can be seen with the relevant [JOLSample_25_ArrayAlignment](https://hg.openjdk.java.net/code-tools/jol/file/tip/jol-samples/src/main/java/org/openjdk/jol/samples/JOLSample_25_ArrayAlignment.java#l41):

```
$ jdk8-64/bin/java -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_25_ArrayAlignment
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

[J object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              d8 0c 00 00  # Class word
     12     4        (object header)              00 00 00 00  # Array length
     16     0   long [J.<elements>                N/A
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total

...

[B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              68 07 00 00  # Class word
     12     4        (object header)              00 00 00 00  # Array length
     16     0   byte [B.<elements>                N/A
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total

[B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              68 07 00 00  # Class word
     12     4        (object header)              01 00 00 00  # Array length
     16     1   byte [B.<elements>                N/A
     17     7        (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 7 bytes external = 7 bytes total

[B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              68 07 00 00  # Class word
     12     4        (object header)              02 00 00 00  # Array length
     16     2   byte [B.<elements>                N/A
     18     6        (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 6 bytes external = 6 bytes total

[B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              68 07 00 00  # Class word
     12     4        (object header)              03 00 00 00  # Array length
     16     3   byte [B.<elements>                N/A
     19     5        (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 5 bytes external = 5 bytes total

...

[B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              68 07 00 00  # Class word
     12     4        (object header)              08 00 00 00  # Array length
     16     8   byte [B.<elements>                N/A
Instance size: 24 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

There is a slot at +12 that carries the array length. As we allocate the `byte[]` arrays of 0..8 elements, that slot keeps changing. Carrying the arraylength with the array instance helps to calculate its actual size for object walkers (as we seen in previous section for regular objects), and also do efficient range checks that have the array length very close by.

**DDIQ: Show us how array range check is done?**

Range checks would be eliminated in many cases, like in hot loops, but for a simple example where array is unknown:

```
private int[] a = new int[100];

@CompilerControl(CompilerControl.Mode.DONT_INLINE)
@Benchmark
public int test() {
  return a[42];
}
 mov    0x10(%rsi),%r10    ; get field "a"
 mov    0x10(%r10),%r11d   ; get a.<arraylength>, at 0x10
 cmp    $0x2a,%r11d        ; compare 42 with arraylength
 jbe    0x00007f139b4398e1 ; equal or greater? jump to slowpath
 mov    0xc0(%r10),%eax    ; read element at (24 + 4*42) = 0xc0
```

### 7.1. Observation: Array Base Is Aligned

The example above glossed over the important quirk in array layout, hidden by lucky alignments in default 64-bit mode. If we run with large heap (or disable compressed references explicitly) to disturb that alignment:

```
$ jdk8-64/bin/java -Xmx64g -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_25_ArrayAlignment
# Running 64-bit HotSpot VM.

[J object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              d8 8c b0 a4  # Class word
     12     4        (object header)              98 7f 00 00  # Class word
     16     4        (object header)              00 00 00 00  # Array length
     20     4        (alignment/padding gap)
     24     0   long [J.<elements>                N/A
Instance size: 24 bytes
Space losses: 4 bytes internal + 0 bytes external = 4 bytes total

...

[B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              00 00 00 00  # Mark word
      8     4        (object header)              68 87 b0 a4  # Class word
     12     4        (object header)              98 7f 00 00  # Class word
     16     4        (object header)              05 00 00 00  # Array length
     20     4        (alignment/padding gap)
     24     5   byte [B.<elements>                N/A
     29     3        (loss due to the next object alignment)
Instance size: 32 bytes
Space losses: 4 bytes internal + 3 bytes external = 7 bytes total
...
```

…or run with 32-bit binaries:

```
$ jdk8-32/bin/java  -cp jol-samples.jar org.openjdk.jol.samples.JOLSample_25_ArrayAlignment
# Running 32-bit HotSpot VM.

[J object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              88 47 1b a3  # Class word
      8     4        (object header)              00 00 00 00  # Array length
     12     4        (alignment/padding gap)
     16     0   long [J.<elements>                N/A
Instance size: 16 bytes
Space losses: 4 bytes internal + 0 bytes external = 4 bytes total

[B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00  # Mark word
      4     4        (object header)              58 44 1b a3  # Class word
      8     4        (object header)              05 00 00 00  # Array length
     12     5   byte [B.<elements>                N/A
     17     7        (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 7 bytes external = 7 bytes total
```

The *array base* is [aligned by the machine word size](https://bugs.openjdk.java.net/browse/JDK-8139457), due to implementation quirk. Arrays with elements larger than machine word size are also aligned more aggresively, we would see more when talking about field alignments. All this means that arrays might take more space than we naively think.

## 8. Object Alignment

Up to this point, we have glossed over the actual need for object alignment, taking the alignment by 8 bytes as granted. Why is it 8 bytes?

There are several considerations that make this alignment practical.

First, we sometimes need to atomically update the mark word, which puts constraints at what addresses mark words can reside. For 8-byte mark word that needs the full update — for example, installing the forwarding pointer — the word needs to be aligned by 8. Since mark word is the first slot in the object, the entire object needs to be aligned by 8.

**DDIQ: Can we then make the object alignment 4 bytes for 32-bit platforms then?**

As far as mark words are concerned, yes. But that is not the only thing we need to take care of, see below.

Second, the same thing applies to atomic accesses to volatile longs/doubles, which have to be read and written indivisibly. Even without the volatile modifier, we will have to accept the possibility of atomic access with the use-site volatility, e.g. via `VarHandles`. Therefore, we are better off accepting that every field has to be naturally aligned. If we align the object *externally* by 8, then aligning the fields *internally* by 8/4/2 bytes would not break the absolute aligment.

**DDIQ: Does that mean we can look into the object fields definitions, and then decide which alignment the object should take?**

Yes, we technically can. If we solve the mark word alignment problem somehow, then for the class with only 4-byte wide fields, we can align the object by 4. This, however, would complicate the allocation path considerably: it would need to decide on the spot whether larger alignment is needed (doable statically, since allocation type is known), and whether the external padding is needed to be added (needs dynamic check, because it depends on what previous object was). It also opens a can of worms with regards to heap parsability.

Alignment by 8 bytes is not always a waste, though, as it enables compressed references beyond 4 GB heap. Alignment by 4 bytes would allow "only" 16 GB heap with compressed references, compared to 32 GB allowed by alignment by 8 bytes. In fact, some are [increasing the object alignment to 16 bytes](https://shipilev.net/jvm/anatomy-quarks/24-object-alignment/), in order to stretch the area where compressed references work.

In Hotspot, the alignment is technically the part of the object itself: if we round up *all object sizes* to 8, then we would naturally present the *alignment shadow* at the end of some objects. Allocating the object that is a multiple of 8 bytes in size does not break alignment, so if we start allocating from the right base (and we do), all objects are guaranteed to be aligned.

Let’s take for example `java.util.ArrayList`:

```
$ jdk8-64/bin/java -Xmx1g -jar jol-cli.jar internals java.util.ArrayList
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

java.util.ArrayList object internals:
 OFFSET  SIZE                 TYPE DESCRIPTION                  VALUE
      0     4                      (object header)              01 00 00 00
      4     4                      (object header)              00 00 00 00
      8     4                      (object header)              46 2e 00 20
     12     4                  int AbstractList.modCount        0
     16     4                  int ArrayList.size               0
     20     4   java.lang.Object[] ArrayList.elementData        []
Instance size: 24 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

…and the same thing with `-XX:ObjectAlignmentInBytes=16`:

```
$ jdk8-64/bin/java -Xmx1g -XX:ObjectAlignmentInBytes=16 -jar jol-cli.jar internals java.util.ArrayList
# Running 64-bit HotSpot VM.
# Using compressed oop with 4-bit shift.
# Using compressed klass with 4-bit shift.
# Objects are 16 bytes aligned.

Instantiated the sample instance via default constructor.

java.util.ArrayList object internals:
 OFFSET  SIZE                 TYPE DESCRIPTION                  VALUE
      0     4                      (object header)              01 00 00 00
      4     4                      (object header)              00 00 00 00
      8     4                      (object header)              93 2e 00 20
     12     4                  int AbstractList.modCount        0
     16     4                  int ArrayList.size               0
     20     4   java.lang.Object[] ArrayList.elementData        []
     24     8                      (loss due to the next object alignment)
Instance size: 32 bytes
```

With 8-byte alignment, `ArrayList` takes exactly 24 bytes, since it is the multiple of 8. With 16-byte alignment, we get the *alignment shadow*: 8 bytes are lost at the end of the object to maintain the alignment for the next one.

### 8.1. Observation: Hiding Fields in Alignment Shadow

This observation immediately leads to one tangible observation: if there is an alignment shadow in the object, we can hide new fields there, *without increasing the apparent size of the object*!

Compare the example of `java.lang.Object`:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals java.lang.Object
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              a8 0e 00 00
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

…and `java.lang.Integer`:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals java.lang.Integer
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via public java.lang.Integer(int)

java.lang.Integer object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                   VALUE
      0     4        (object header)               01 00 00 00
      4     4        (object header)               00 00 00 00
      8     4        (object header)               f0 0e 01 00
     12     4    int Integer.value                 0
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

`Object` had the alignment shadow of 4 bytes, which `Integer.value` field gladly took. In the end, the size of `Object` and `Integer` ended up being the same in that VM configuration.

### 8.2. Observation: Blowing Up Instance Sizes by Adding Small Fields

There is the opposite caveat to this story. Suppose we have the object that has zero-length alignment shadow:

```
public class A {
  int a1;
}
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . A
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                   VALUE
      0     4        (object header)               01 00 00 00
      4     4        (object header)               00 00 00 00
      8     4        (object header)               28 b8 0f 00
     12     4    int A.a1                          0
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

What happens if we add a `boolean` field to it?

```
public class B {
  int b1;
  boolean b2; // takes 1 byte, right?
}
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . B
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

B object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              01 00 00 00
      4     4           (object header)              00 00 00 00
      8     4           (object header)              28 b8 0f 00
     12     4       int B.b1                         0
     16     1   boolean B.b2                         false
     17     7           (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 7 bytes external = 7 bytes total
```

Here, we only needed one lousy byte to allocate the field, but since we need the satisfy alignment requirements for objects themselves, we ended up adding the entire slab of 8 bytes! There is a small consolation that fitting more fields in the rest of 7 bytes of the shadow would not increase the apparent object size.

## 9. Field Alignments

We have touched on this topic in the previous section when we were talking about the object alignments.

Many architectures dislike unaligned accesses, with different levels of animosity. On many, unaligned accesses carry a performance penalty. On some, unaligned access raises the machine exception. Then Java Memory Model comes in and requires atomic accesses to fields and array elements, [at very least](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.7) when those fields are `volatile`.

This forces most implementations to align fields to their natural alignment. The object alignment by 8 bytes guarantees the offset 0 is aligned by 8 bytes, the largest natural alignment across all types we have. So, we "only" need to lay out the fields within the object with their natural alignment. This can be clearly seen with `java.lang.Long`:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals java.lang.Long
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via public java.lang.Long(long)

java.lang.Long object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                     VALUE
      0     4        (object header)                 01 00 00 00
      4     4        (object header)                 00 00 00 00
      8     4        (object header)                 18 11 01 00
     12     4        (alignment/padding gap)
     16     8   long Long.value                      0
Instance size: 24 bytes
Space losses: 4 bytes internal + 0 bytes external = 4 bytes total
```

Here, `long value` was placed at +16, because it would make the field aligned by 8. Note there is a gap before the field!

### 9.1. Observation: Hiding Fields in Field Alignment Gaps

Foreshadowing the discussion about field packing a bit: the existence of these field alignment gaps allows us to hide fields there. For example, adding another `int` field to a `long`-bearing class:

```
public class LongIntCarrier {
  long value;
  int somethingElse;
}
```

…would end up laid out like this:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . LongIntCarrier
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

LongIntCarrier object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                     VALUE
      0     4        (object header)                 01 00 00 00
      4     4        (object header)                 00 00 00 00
      8     4        (object header)                 28 b8 0f 00
     12     4    int LongIntCarrier.somethingElse    0
     16     8   long LongIntCarrier.value            0
Instance size: 24 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

Compare with the `java.lang.Long` layout: they take the same total instance space, and that is because new `int` field took the alignment gap for it.

## 10. Field Packing

When multiple fields are present, a new task appears: how to distribute fields around the object? This is where field layouter comes in. Its job is to make sure every field is allocated at its natural alignment, and hopefully the object is as densely packed as possible. How exactly that one is achieved is heavily implementation-dependent. For all we know, the field "packer" can just put all fields in their declaration order, padding each field for its natural alignment. It would waste a lot of memory, though.

Consider this class:

```
public class FieldPacking {
  boolean b;
  long l;
  char c;
  int i;
}
```

The naive field packer would do this:

```
$ <32-bit simulation>
FieldPacking object internals:
 OFFSET  SIZE      TYPE DESCRIPTION
      0     4           (object header)
      4     4           (object header)
      8     1   boolean FieldPacking.b
      9     7           (alignment/padding gap)
     16     8      long FieldPacking.l
     24     2      char FieldPacking.c
     26     2            (alignment/padding gap)
     28     4       int FieldPacking.i
Instance size: 32 bytes
```

…while a smarter one would do:

```
$ jdk8-32/bin/java -jar jol-cli.jar internals -cp . FieldPacking
# Running 32-bit HotSpot VM.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

FieldPacking object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              01 00 00 00
      4     4           (object header)              68 91 6f a3
      8     8      long FieldPacking.l               0
     16     4       int FieldPacking.i               0
     20     2      char FieldPacking.c
     22     1   boolean FieldPacking.b               false
     23     1           (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 1 bytes external = 1 bytes total
```

…thus saving 8 bytes per object instance.

**DDIQ: Is there a rule of thumb for field layout?**

As said above, field layout is an implementation detail. Hotspot implementation, until recently, was a nearly linear implementation. It started laying out the fields starting from their larger size down to smaller ones. So, first you’d lay out longs/doubles (that require alignment by 8), then ints/floats (requiring alignment by 4), then chars/shorts (need alignment by 2), then bytes/booleans. In this way, we pack the entire field block quite densely, but with one exception: the initial alignment of larger data type could have left the gap that we can take with smaller datatype — that is handled separately.

There are reference fields that either join the group of 8-byte fields (64-bit mode without compressed references), or 4-byte fields (32-bit mode, or 64-bit mode with compressed references). There are some GC-related tricks when multiple classes with reference fields are in hierarchy: sometimes it might be profitable to cluster them together.

Anyhow, we can derive two immediate observations from this.

### 10.1. Observation: Field Declaration Order != Field Layout Order

First of all, given the field declaration order:

```
public class FieldOrder {
  boolean firstField;
  long secondField;
  char thirdField;
  int fourthField;
}
```

…we are not guaranteed to get the same order in memory. Field packer would routinely rearrange fields to minimize footprint:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . FieldOrder
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

FieldOrder object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              01 00 00 00
      4     4           (object header)              00 00 00 00
      8     4           (object header)              28 b8 0f 00
     12     4       int FieldOrder.fourthField       0
     16     8      long FieldOrder.secondField       0
     24     2      char FieldOrder.thirdField
     26     1   boolean FieldOrder.firstField        false
     27     5           (loss due to the next object alignment)
Instance size: 32 bytes
Space losses: 0 bytes internal + 5 bytes external = 5 bytes total
```

Note how layouter laid out fields in their data type size: first `long` field was aligned at +16, then `int` field supposed to go at +24, but layouter discovered there is a gap before `long` field where it can be tucked into, so it did at +12, then `char` got its natural alignment at +24, then boolean took the slot +26.

The field packing is a major caveat when you would consider the interaction with foreign/raw functions that expect fields to be at particular offsets. The field offsets depend on what field packer does (does it compact fields, and how exactly it does so?), and what are the starting conditions for it (bitness, compressed references mode, object alignment, etc).

Java code that uses `sun.misc.Unsafe` to gain access to the fields has to read the field offsets at runtime to capture the actual layout in the given execution. It is hard to diagnose source of bugs to assume the fields are at the same offsets as they were in debugging session.

### 10.2. Observation: C-style Padding Is Unreliable

When [False Sharing](https://en.wikipedia.org/wiki/False_sharing) mitigation techniques are involved, people resort to padding the critical fields in order to isolate them in their own cache lines. The most frequently used way to deal with it is to introduce some dummy field declarations around the protected field. And, since typing out declarations is tedious, people expectedly resort to using the largest data type. So, to protect a contentious `byte` field, you could see this done:

```
public class LongPadding {
  long l01, l02, l03, l04, l05, l06, l07, l08; // 64 bytes
  byte pleaseHelpMe;
  long l11, l12, l13, l14, l15, l16, l17, l18; // 64 bytes
}
```

You would expect the `pleaseHelpMe` field squeezed between two large `long` blocks. Unfortunately, field packer does not think so:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . CStylePadding
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

LongPadding object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              28 b8 0f 00
     12     1   byte LongPadding.pleaseHelpMe     0  # WHOOPS.
     13     3        (alignment/padding gap)
     16     8   long LongPadding.l01              0
     24     8   long LongPadding.l02              0
     32     8   long LongPadding.l03              0
     40     8   long LongPadding.l04              0
     48     8   long LongPadding.l05              0
     56     8   long LongPadding.l06              0
     64     8   long LongPadding.l07              0
     72     8   long LongPadding.l08              0
     80     8   long LongPadding.l11              0
     88     8   long LongPadding.l12              0
     96     8   long LongPadding.l13              0
    104     8   long LongPadding.l14              0
    112     8   long LongPadding.l15              0
    120     8   long LongPadding.l16              0
    128     8   long LongPadding.l17              0
    136     8   long LongPadding.l18              0
Instance size: 144 bytes
Space losses: 3 bytes internal + 0 bytes external = 3 bytes total
```

You could suggest padding with `byte` fields then? It would depend on implementation detail that field packer goes through the fields of the same width/type in the declaration order, but at least it would somewhat work:

```
public class BytePadding {
  byte p000, p001, p002, p003, p004, p005, p006, p007;
  byte p008, p009, p010, p011, p012, p013, p014, p015;
  byte p016, p017, p018, p019, p020, p021, p022, p023;
  byte p024, p025, p026, p027, p028, p029, p030, p031;
  byte p032, p033, p034, p035, p036, p037, p038, p039;
  byte p040, p041, p042, p043, p044, p045, p046, p047;
  byte p048, p049, p050, p051, p052, p053, p054, p055;
  byte p056, p057, p058, p059, p060, p061, p062, p063;
  byte pleaseHelpMe;
  byte p100, p101, p102, p103, p104, p105, p106, p107;
  byte p108, p109, p110, p111, p112, p113, p114, p115;
  byte p116, p117, p118, p119, p120, p121, p122, p123;
  byte p124, p125, p126, p127, p128, p129, p130, p131;
  byte p132, p133, p134, p135, p136, p137, p138, p139;
  byte p140, p141, p142, p143, p144, p145, p146, p147;
  byte p148, p149, p150, p151, p152, p153, p154, p155;
  byte p156, p157, p158, p159, p160, p161, p162, p163;
}
$ jdk8-64/bin/java -jar ~/projects/jol/jol-cli/target/jol-cli.jar internals -cp . BytePadding
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

BytePadding object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              28 b8 0f 00
     12     1   byte BytePadding.p000             0
     13     1   byte BytePadding.p001             0
...
     74     1   byte BytePadding.p062             0
     75     1   byte BytePadding.p063             0
     76     1   byte BytePadding.pleaseHelpMe     0 # Good
     77     1   byte BytePadding.p100             0
     78     1   byte BytePadding.p101             0
...
    139     1   byte BytePadding.p162             0
    140     1   byte BytePadding.p163             0
    141     3        (loss due to the next object alignment)
Instance size: 144 bytes
Space losses: 0 bytes internal + 3 bytes external = 3 bytes total
```

…unless you need to protect something of a different type:

```
public class BytePaddingHetero {
  byte p000, p001, p002, p003, p004, p005, p006, p007;
  byte p008, p009, p010, p011, p012, p013, p014, p015;
  byte p016, p017, p018, p019, p020, p021, p022, p023;
  byte p024, p025, p026, p027, p028, p029, p030, p031;
  byte p032, p033, p034, p035, p036, p037, p038, p039;
  byte p040, p041, p042, p043, p044, p045, p046, p047;
  byte p048, p049, p050, p051, p052, p053, p054, p055;
  byte p056, p057, p058, p059, p060, p061, p062, p063;
  byte pleaseHelpMe;
  int pleaseHelpMeToo; // pretty please!
  byte p100, p101, p102, p103, p104, p105, p106, p107;
  byte p108, p109, p110, p111, p112, p113, p114, p115;
  byte p116, p117, p118, p119, p120, p121, p122, p123;
  byte p124, p125, p126, p127, p128, p129, p130, p131;
  byte p132, p133, p134, p135, p136, p137, p138, p139;
  byte p140, p141, p142, p143, p144, p145, p146, p147;
  byte p148, p149, p150, p151, p152, p153, p154, p155;
  byte p156, p157, p158, p159, p160, p161, p162, p163;
}
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . BytePaddingHetero
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

BytePaddingHetero object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                        VALUE
      0     4        (object header)                    01 00 00 00
      4     4        (object header)                    00 00 00 00
      8     4        (object header)                    28 b8 0f 00
     12     4    int BytePaddingHetero.pleaseHelpMeToo  0 # WHOOPS.
     16     1   byte BytePaddingHetero.p000             0
     17     1   byte BytePaddingHetero.p001             0
...
     78     1   byte BytePaddingHetero.p062             0
     79     1   byte BytePaddingHetero.p063             0
     80     1   byte BytePaddingHetero.pleaseHelpMe     0 # Good.
     81     1   byte BytePaddingHetero.p100             0
     82     1   byte BytePaddingHetero.p101             0
...
    143     1   byte BytePaddingHetero.p162             0
    144     1   byte BytePaddingHetero.p163             0
    145     7        (loss due to the next object alignment)
Instance size: 152 bytes
Space losses: 0 bytes internal + 7 bytes external = 7 bytes total
```

### 10.3. @Contended

This endless whack-a-mole in very performance-sensitive parts of JDK library was mitigated by introducing the [private @Contended annotation](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/java.base/share/classes/jdk/internal/vm/annotation/Contended.java). It is used sparingly thorough the JDK, for example in `java.lang.Thread` for carrying [thread-local random generator state](http://hg.openjdk.java.net/jdk/jdk/file/19afeaa0fdbe/src/java.base/share/classes/java/lang/Thread.java#l2059):

```
public class Thread implements Runnable {
    ...
    // The following three initially uninitialized fields are exclusively
    // managed by class java.util.concurrent.ThreadLocalRandom. These
    // fields are used to build the high-performance PRNGs in the
    // concurrent code, and we can not risk accidental false sharing.
    // Hence, the fields are isolated with @Contended.

    /** The current seed for a ThreadLocalRandom */
    @jdk.internal.vm.annotation.Contended("tlr")
    long threadLocalRandomSeed;

    /** Probe hash value; nonzero if threadLocalRandomSeed initialized */
    @jdk.internal.vm.annotation.Contended("tlr")
    int threadLocalRandomProbe;

    /** Secondary seed isolated from public ThreadLocalRandom sequence */
    @jdk.internal.vm.annotation.Contended("tlr")
    int threadLocalRandomSecondarySeed;
    ...
}
```

…which makes them treated specially by the field layouter code:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals java.lang.Thread
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.
# Objects are 8 bytes aligned.

Instantiated the sample instance via default constructor.

java.lang.Thread object internals:
 OFFSET  SIZE         TYPE DESCRIPTION                             VALUE
      0     4              (object header)                         01 00 00 00
      4     4              (object header)                         00 00 00 00
      8     4              (object header)                         48 69 00 00
     12     4          int Thread.priority                         5
     16     8         long Thread.eetop                            0
...
     96     4   j.l.Object Thread.blockerLock                      (object)
    100     4      j.l.UEH Thread.uncaughtExceptionHandler         null
    104   128              (alignment/padding gap)
    232     8         long Thread.threadLocalRandomSeed            0
    240     4          int Thread.threadLocalRandomProbe           0
    244     4          int Thread.threadLocalRandomSecondarySeed   0
    248   128              (loss due to the next object alignment)
Instance size: 376 bytes
Space losses: 129 bytes internal + 128 bytes external = 257 bytes total
```

**DDIQ: Why isn’t `@Contended` a public annotation?**

There are security/reliability implications in allowing adversaries to construct huge "regular" objects. Let’s leave it at that.

There are ways to achieve this effect without relying on internal annotations, by piggybacking on other implementation details, which we shall discuss next.

## 11. Field Layout Across The Hierarchy

A special consideration needs to be given about laying out fields in the hierarchy. Suppose we have these classes:

```
public class Hierarchy {
  static class A {
    int a;
  }
  static class B extends A {
    int b;
  }
  static class C extends A {
    int c;
  }
}
```

The layouts of these classes would be like this:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . Hierarchy\$A
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Hierarchy$A object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              28 b8 0f 00
     12     4    int A.a                          0
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total

Hierarchy$B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              08 ba 0f 00
     12     4    int A.a                          0
     16     4    int B.b                          0
     20     4        (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

Hierarchy$C object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              08 ba 0f 00
     12     4    int A.a                          0
     16     4    int C.c                          0
     20     4        (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

Note: all classes agree at where `A.a` super-class field is. This allows blind casts to `A` from any subtype, and then accessing `a` field there, without looking back at the actual type of the object. That is, `((A)o).a` would always go to the same offset, regardless of whether we are dealing with instance of `A`, `B`, or `C`.

This looks as if *superclass fields are always taken care of first*. Does it mean superclass fields are always first in the hierarchy? That is an implementation detail: prior JDK 15, the answer is "yes"; after JDK 15 the answer is "no". We shall quantify that with a few observations.

### 11.1. Superclass Gaps

Prior to JDK 15, field layouter only worked locally on current class declared fields. Which means if there *are* superclass gaps that subclass fields could take, they [would not be taken](https://bugs.openjdk.java.net/browse/JDK-8024913). Let’s split the prior `LongIntCarrier` example into subclasses:

```
public class LongIntCarrierSubs {
  static class A {
    long value;
  }
  static class B extends A {
    int somethingElse;
  }
}
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . LongIntCarrierSubs\$B
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

LongIntCarrierSubs$B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                  VALUE
      0     4        (object header)              01 00 00 00
      4     4        (object header)              00 00 00 00
      8     4        (object header)              08 ba 0f 00
     12     4        (alignment/padding gap)
     16     8   long A.value                      0
     24     4    int B.somethingElse              0
     28     4        (loss due to the next object alignment)
Instance size: 32 bytes
Space losses: 4 bytes internal + 4 bytes external = 8 bytes total
```

Note there is the same gap we have seen before, caused by `long` alignment. Theoretically, `B.somethingElse` could have taken it, but field layouter implementation quirk makes it impossible. Therefore, we lay out fields of `B` after the fields of `A`, and waste 8 bytes.

### 11.2. Hierarchy Gaps

Another quirk prior to JDK 15 is that field layouter counted the field blocks in the integer units of *reference size*, which made the subclass field block [start from much farther offset](https://bugs.openjdk.java.net/browse/JDK-8024912). This is most visible with something that carries a few very small fields:

```
public class ThreeBooleanStooges {
  static class A {
    boolean a;
  }
  static class B extends A {
    boolean b;
  }
  static class C extends B {
    boolean c;
  }
}
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . ThreeBooleanStooges\$A
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . ThreeBooleanStooges\$B
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . ThreeBooleanStooges\$C
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

ThreeBooleanStooges$A object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              01 00 00 00
      4     4           (object header)              00 00 00 00
      8     4           (object header)              28 b8 0f 00
     12     1   boolean A.a                          false
     13     3           (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 3 bytes external = 3 bytes total

ThreeBooleanStooges$B object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              01 00 00 00
      4     4           (object header)              00 00 00 00
      8     4           (object header)              08 ba 0f 00
     12     1   boolean A.a                          false
     13     3           (alignment/padding gap)
     16     1   boolean B.b                          false
     17     7           (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 3 bytes internal + 7 bytes external = 10 bytes total

ThreeBooleanStooges$C object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              01 00 00 00
      4     4           (object header)              00 00 00 00
      8     4           (object header)              e8 bb 0f 00
     12     1   boolean A.a                          false
     13     3           (alignment/padding gap)
     16     1   boolean B.b                          false
     17     3           (alignment/padding gap)
     20     1   boolean C.c                          false
     21     3           (loss due to the next object alignment)
Instance size: 24 bytes
Space losses: 6 bytes internal + 3 bytes external = 9 bytes total
```

The loss is very substantial! We waste 3 bytes per class instance, and then might lose even more when object alignment kicks in.

It is even worse on larger heaps and/or without compressed references:

```
$ jdk8-64/bin/java -Xmx64g -jar jol-cli.jar internals -cp . ThreeBooleanStooges\$C
# Running 64-bit HotSpot VM.

Instantiated the sample instance via default constructor.

ThreeBooleanStooges$C object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              01 00 00 00
      4     4           (object header)              00 00 00 00
      8     4           (object header)              b0 89 aa 37
     12     4           (object header)              b0 7f 00 00
     16     1   boolean A.a                          false
     17     7           (alignment/padding gap)
     24     1   boolean B.b                          false
     25     7           (alignment/padding gap)
     32     1   boolean C.c                          false
     33     7           (loss due to the next object alignment)
Instance size: 40 bytes
Space losses: 14 bytes internal + 7 bytes external = 21 bytes total
```

### 11.3. Observation: Hierarchy Tower Padding Trick

This implementation pecularity allows constructing a rather weird padding trick that more resilient than a C-style padding.

```
public class HierarchyLongPadding {
  static class Pad1 {
    long l01, l02, l03, l04, l05, l06, l07, l08;
  }
  static class Carrier extends Pad1 {
    byte pleaseHelpMe;
  }
  static class Pad2 extends Carrier {
    long l11, l12, l13, l14, l15, l16, l17, l18;
  }
  static class UsableObject extends Pad2 {};
}
```

…yields:

```
$ jdk8-64/bin/java -jar jol-cli.jar internals -cp . HierarchyLongPadding\$UsableObject
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

HierarchyLongPadding$UsableObject object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                     VALUE
      0     4        (object header)                 01 00 00 00
      4     4        (object header)                 00 00 00 00
      8     4        (object header)                 c8 bd 0f 00
     12     4        (alignment/padding gap)
     16     8   long Pad1.l01                        0
     24     8   long Pad1.l02                        0
     32     8   long Pad1.l03                        0
     40     8   long Pad1.l04                        0
     48     8   long Pad1.l05                        0
     56     8   long Pad1.l06                        0
     64     8   long Pad1.l07                        0
     72     8   long Pad1.l08                        0
     80     1   byte Carrier.pleaseHelpMe            0
     81     7        (alignment/padding gap)
     88     8   long Pad2.l11                        0
     96     8   long Pad2.l12                        0
    104     8   long Pad2.l13                        0
    112     8   long Pad2.l14                        0
    120     8   long Pad2.l15                        0
    128     8   long Pad2.l16                        0
    136     8   long Pad2.l17                        0
    144     8   long Pad2.l18                        0
Instance size: 152 bytes
Space losses: 11 bytes internal + 0 bytes external = 11 bytes total
```

See, we squeeze the field we want to protect between two classes, exploiting a freaky implementation detail!

### 11.4. Super/Hierarchy Gaps in Java 15+

Now we turn to JDK 15 and its [overhaul of field layout strategy](https://bugs.openjdk.java.net/browse/JDK-8237767). Now both superclass and hierarchy gaps are closed. Running our previous examples reveals it:

```
$ jdk15-64/bin/java -jar jol-cli.jar internals -cp . LongIntCarrierSubs\$B
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

LongIntCarrierSubs$B object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                     VALUE
      0     4        (object header)                 05 00 00 00
      4     4        (object header)                 00 00 00 00
      8     4        (object header)                 4c 7d 17 00
     12     4    int B.somethingElse                 0
     16     8   long A.value                         0
Instance size: 24 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

Finally, `B.somethingElse` took the alignment gap before super-class `A.value`.

Hierarchy gaps are also gone:

```
$ jdk15-64/bin/java -jar jol-cli.jar internals -cp . ThreeBooleanStooges\$C
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

ThreeBooleanStooges$C object internals:
 OFFSET  SIZE      TYPE DESCRIPTION                  VALUE
      0     4           (object header)              05 00 00 00
      4     4           (object header)              00 00 00 00
      8     4           (object header)              90 7d 17 00
     12     1   boolean A.a                          false
     13     1   boolean B.b                          false
     14     1   boolean C.c                          false
     15     1           (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 1 bytes external = 1 bytes total
```

Perfect!

### 11.5. Observation: Hierarchy Tower Padding Trick Collapse in JDK 15

Unfortunately, this collapses the naive hierarchy padding trick that relied on implementation quirks! See:

```
$ jdk15-64/bin/java -jar jol-cli.jar internals -cp . HierarchyLongPadding\$UsableObject
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

HierarchyLongPadding$UsableObject object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                     VALUE
      0     4        (object header)                 05 00 00 00
      4     4        (object header)                 00 00 00 00
      8     4        (object header)                 08 7c 17 00
     12     1   byte Carrier.pleaseHelpMe            0  # WHOOPS
     13     3        (alignment/padding gap)
     16     8   long Pad1.l01                        0
     24     8   long Pad1.l02                        0
     32     8   long Pad1.l03                        0
     40     8   long Pad1.l04                        0
     48     8   long Pad1.l05                        0
     56     8   long Pad1.l06                        0
     64     8   long Pad1.l07                        0
     72     8   long Pad1.l08                        0
     80     8   long Pad2.l11                        0
     88     8   long Pad2.l12                        0
     96     8   long Pad2.l13                        0
    104     8   long Pad2.l14                        0
    112     8   long Pad2.l15                        0
    120     8   long Pad2.l16                        0
    128     8   long Pad2.l17                        0
    136     8   long Pad2.l18                        0
Instance size: 144 bytes
Space losses: 3 bytes internal + 0 bytes external = 3 bytes total
```

Now that `pleaseHelpMe` is allowed to take the gaps in the superclasses, field layouter pulls it out. Whoops.

The way out I see is to pad with the smallest data type:

```
public class HierarchyBytePadding {
  static class Pad1 {
    byte p000, p001, p002, p003, p004, p005, p006, p007;
    byte p008, p009, p010, p011, p012, p013, p014, p015;
    byte p016, p017, p018, p019, p020, p021, p022, p023;
    byte p024, p025, p026, p027, p028, p029, p030, p031;
    byte p032, p033, p034, p035, p036, p037, p038, p039;
    byte p040, p041, p042, p043, p044, p045, p046, p047;
    byte p048, p049, p050, p051, p052, p053, p054, p055;
    byte p056, p057, p058, p059, p060, p061, p062, p063;
  }

  static class Carrier extends Pad1 {
    byte pleaseHelpMe;
  }

  static class Pad2 extends Carrier {
    byte p100, p101, p102, p103, p104, p105, p106, p107;
    byte p108, p109, p110, p111, p112, p113, p114, p115;
    byte p116, p117, p118, p119, p120, p121, p122, p123;
    byte p124, p125, p126, p127, p128, p129, p130, p131;
    byte p132, p133, p134, p135, p136, p137, p138, p139;
    byte p140, p141, p142, p143, p144, p145, p146, p147;
    byte p148, p149, p150, p151, p152, p153, p154, p155;
    byte p156, p157, p158, p159, p160, p161, p162, p163;
  }

  static class UsableObject extends Pad2 {};
}
```

…which fills out all gaps, not letting our protected fields to float around:

```
$ jdk15-64/bin/java -jar jol-cli.jar internals -cp . HierarchyBytePadding\$UsableObject
# Running 64-bit HotSpot VM.
# Using compressed oop with 3-bit shift.
# Using compressed klass with 3-bit shift.

Instantiated the sample instance via default constructor.

HierarchyBytePadding$UsableObject object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                     VALUE
      0     4        (object header)                 05 00 00 00
      4     4        (object header)                 00 00 00 00
      8     4        (object header)                 08 7c 17 00
     12     1   byte Pad1.p000                       0
     13     1   byte Pad1.p001                       0
...
     74     1   byte Pad1.p062                       0
     75     1   byte Pad1.p063                       0
     76     1   byte Carrier.pleaseHelpMe            0  # GOOD
     77     1   byte Pad2.p100                       0
     78     1   byte Pad2.p101                       0
...
    139     1   byte Pad2.p162                       0
    140     1   byte Pad2.p163                       0
    141     3        (loss due to the next object alignment)
Instance size: 144 bytes
Space losses: 0 bytes internal + 3 bytes external = 3 bytes total
```

In fact, that is what [JMH does now](http://hg.openjdk.java.net/code-tools/jmh/rev/ee4b8b1f1523).

This still relies on implementation detail that fields from `Pad1` would be handled first and plug whatever holes there are in the superclass.

## 12. Conclusion

Java object internals story is complicated and full of static and dynamic trade-offs. The size of Java object can change depending on internal factors, like JVM bitness, JVM feature set, etc. The size can change depending on runtime configuration, like heap size, compressed references mode, GC used.

Looking at footprint story from JVM side, it becomes clear that compressed references play the extensive role in it. Even without references involved, they affect whether class word is compressed. Mark word would get more compact in 32-bit VMs, so that would also improve the footprint. (That also does not mention that VM-native pointers and machine-word-wide types would become much narrower).

From the Java (developer) perspective, knowing about object internals allows hiding fields in object alignment shadow, in field alignment gaps, without exploding the apparent instance size. On the other hand, adding just a single little field may baloon the instance size up considerable, and explaining why that happened inevitably involves reasoning about finer Object structure.

Last, but not least, tricking field layouter to put the fields in some order is quite hard and depends on implementation quirks. Those are still usable, there are less safer and more safer things to rely on. It needs additional verification for every JDK update you run with, anyway. You should definitely re-verify what you do when running on JDK 15 and later.

------

[1](https://shipilev.net/jvm/objects-inside-out/#_footnoteref_1). There is, actually, one in `Instrumentation.getObjectSize`, but it requires the code to attach itself as JavaAgent.

[2](https://shipilev.net/jvm/objects-inside-out/#_footnoteref_2). You can still use it, just build or get fastdebug build from somewhere. For example, [here](https://builds.shipilev.net/).

[3](https://shipilev.net/jvm/objects-inside-out/#_footnoteref_3). This was exploited by some of the VM fixes, but ultimately too much external dependencies on Unsafe made it impractical.

[4](https://shipilev.net/jvm/objects-inside-out/#_footnoteref_4). Contrary to popular belief perpetuated by confusing Javadoc, it is *not* the object address (which has a very low entropy), but rather the result from some internal PRNG.

[5](https://shipilev.net/jvm/objects-inside-out/#_footnoteref_5). In current Hotspot, `-XX:+CompressedKlassPointers` is predicated on `-XX:+CompressedOops`, but that is implementation constraint, not the design one. You [can have compressed klass pointers without compressed oops](https://bugs.openjdk.java.net/browse/JDK-8241825), but that exposes you to yet another configuration that you would need to maintain everywhere, and most likely in platform-specific code.

Last updated 2020-08-24 13:15:45 +0200









- https://shipilev.net/jvm/objects-inside-out/
