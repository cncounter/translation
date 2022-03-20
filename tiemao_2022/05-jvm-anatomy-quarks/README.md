# JVM Anatomy Quarks

## About, Disclaimers, Contacts

["JVM Anatomy Quarks"](https://shipilev.net/jvm/anatomy-quarks/) is the on-going mini-post series, where every post is describing some elementary piece of knowledge about JVM. The name underlines the fact that the single post cannot be taken in isolation, and most pieces described here are going to readily interact with each other.

The post should take about 5-10 minutes to read. As such, it goes deep for only a single topic, a single test, a single benchmark, a single observation. The evidence and discussion here might be anecdotal, not actually reviewed for errors, consistency, writing 'tyle, syntaxtic and semantically errors, duplicates, or also consistency. Use and/or trust this at your own risk.

![350](https://shipilev.net/jvm/anatomy-quarks/images/redhat-logo.svg)

**Aleksey Shipilëv, JVM/Performance Geek**
Shout out at Twitter: [@shipilev](http://twitter.com/shipilev); Questions, comments, suggestions: [aleksey@shipilev.net](mailto:aleksey@shipilev.net)

## Complete Snapshots

The series is on-going, the auto-generated complete bundles are here:
[ePUB](https://shipilev.net/jvm/anatomy-quarks/jvm-anatomy-quarks-complete.epub) (smallest, under MB, Pandoc HTML-to-ePUB)
[MOBI](https://shipilev.net/jvm/anatomy-quarks/jvm-anatomy-quarks-complete.mobi) (small, around MB, KindleGen ePUB-to-MOBI)
[PDF](https://shipilev.net/jvm/anatomy-quarks/jvm-anatomy-quarks-complete.pdf) (very large — tens of MBs, high-quality wkhtmltopdf HTML-to-PDF)

## Individual Index

These are convenient to hyperlink around the Internet (easy internet karma points for anyone, folks):

| Compiler | Runtime | GC   | Library | Link                                                         |
| :------- | :------ | :--- | :------ | :----------------------------------------------------------- |
| x        |         |      |         | [#1: Lock Coarsening and Loops](https://shipilev.net/jvm/anatomy-quarks/1-lock-coarsening-for-loops) |
|          | x       | x    |         | [#2: Transparent Huge Pages](https://shipilev.net/jvm/anatomy-quarks/2-transparent-huge-pages) |
|          |         | x    |         | [#3: GC Design and Pauses](https://shipilev.net/jvm/anatomy-quarks/3-gc-design-and-pauses) |
|          | x       | x    |         | [#4: TLAB Allocation](https://shipilev.net/jvm/anatomy-quarks/4-tlab-allocation) |
|          | x       | x    |         | [#5: TLABs and Heap Parsability](https://shipilev.net/jvm/anatomy-quarks/5-tlabs-and-heap-parsability) |
|          | x       | x    |         | [#6: New Object Stages](https://shipilev.net/jvm/anatomy-quarks/6-new-object-stages) |
|          | x       | x    |         | [#7: Object Initialization Costs](https://shipilev.net/jvm/anatomy-quarks/7-initialization-costs) |
| x        |         | x    |         | [#8: Local Variable Reachability](https://shipilev.net/jvm/anatomy-quarks/8-local-var-reachability) |
|          | x       | x    |         | [#9: JNI Critical and GC Locker](https://shipilev.net/jvm/anatomy-quarks/9-jni-critical-gclocker) |
|          | x       | x    | x       | [#10: String.intern()](https://shipilev.net/jvm/anatomy-quarks/10-string-intern) |
|          |         | x    |         | [#11: Moving GC and Locality](https://shipilev.net/jvm/anatomy-quarks/11-moving-gc-locality) |
|          | x       |      |         | [#12: Native Memory Tracking](https://shipilev.net/jvm/anatomy-quarks/12-native-memory-tracking) |
|          |         | x    |         | [#13: Intergenerational Barriers](https://shipilev.net/jvm/anatomy-quarks/13-intergenerational-barriers) |
| x        |         |      |         | [#14: Constant Variables](https://shipilev.net/jvm/anatomy-quarks/14-constant-variables) |
| x        |         |      |         | [#15: Just-In-Time Constants](https://shipilev.net/jvm/anatomy-quarks/15-just-in-time-constants) |
| x        | x       |      |         | [#16: Megamorphic Virtual Calls](https://shipilev.net/jvm/anatomy-quarks/16-megamorphic-virtual-calls) |
| x        |         |      |         | [#17: Trust Non-Static Final Fields](https://shipilev.net/jvm/anatomy-quarks/17-trust-nonstatic-final-fields) |
| x        |         |      |         | [#18: Scalar Replacement](https://shipilev.net/jvm/anatomy-quarks/18-scalar-replacement) |
| x        |         |      |         | [#19: Lock Elision](https://shipilev.net/jvm/anatomy-quarks/19-lock-elision) |
| x        |         |      |         | [#20: FPU Spills](https://shipilev.net/jvm/anatomy-quarks/20-fpu-spills) |
|          |         | x    |         | [#21: Heap Uncommit](https://shipilev.net/jvm/anatomy-quarks/21-heap-uncommit) |
| x        | x       | x    |         | [#22: Safepoint Polls](https://shipilev.net/jvm/anatomy-quarks/22-safepoint-polls) |
|          | x       |      |         | [#23: Compressed References](https://shipilev.net/jvm/anatomy-quarks/23-compressed-references) |
|          | x       |      |         | [#24: Object Alignment](https://shipilev.net/jvm/anatomy-quarks/24-object-alignment) |
| x        | x       |      |         | [#25: Implicit Null Checks](https://shipilev.net/jvm/anatomy-quarks/25-implicit-null-checks) |
|          | x       |      |         | [#26: Identity Hash Code](https://shipilev.net/jvm/anatomy-quarks/26-identity-hash-code) |
| x        |         |      |         | [#27: Compiler Blackholes](https://shipilev.net/jvm/anatomy-quarks/27-compiler-blackholes) |
| x        |         |      |         | [#28: Frequency-Based Code Layout](https://shipilev.net/jvm/anatomy-quarks/28-frequency-based-code-layout) |
| x        | x       |      |         | [#29: Uncommon Traps](https://shipilev.net/jvm/anatomy-quarks/29-uncommon-traps) |
| x        | x       |      |         | [#30: Conditional Moves](https://shipilev.net/jvm/anatomy-quarks/30-conditional-moves) |










- https://shipilev.net/jvm/anatomy-quarks/
