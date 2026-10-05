# RunTimeDataAreas（运行时数据区）

Data type:
数据类型:
 
    boolean, byte, char, short, int, float, reference, or returnAddress
    long or double.




Data Area:
数据区:

- pc Register
  pc 寄存器

  program counter register, per thread
  程序计数器寄存器，每个线程一个(线程私有)

- Java Virtual Machine Stacks
  Java虚拟机栈

  per thread, private, C Stack, StackOverflowError, OutOfMemoryError
  每个线程一个，线程私有，对应C栈，可能抛出StackOverflowError、OutOfMemoryError

- Heap
  Java堆

  shared, OutOfMemoryError
  线程共享，可能抛出OutOfMemoryError

- Method Area
  方法区

  per-class structures, run-time constant pool, field, method,
  存储每个类的结构信息、运行时常量池、字段、方法数据等

- Run-Time Constant Pool
  运行时常量池

  symbol table, numeric literals, field references,
  符号表、数字字面量、字段引用等

- Native Method Stacks
  本地方法栈

  Optional, C stacks, StackOverflowError, OutOfMemoryError
  可选，对应C栈，可能抛出StackOverflowError、OutOfMemoryError



- Frames
  栈帧
  * Local Variables 局部变量表
  * Operand Stacks 操作数栈
  * Dynamic Linking 动态链接


Special Methods:
特殊方法:

```
<init>
<clinit>
```




load and store instructions transfer values between the local variables (§2.6.1) and the operand stack
加载(load)与存储(store)指令在局部变量表(§2.6.1)和操作数栈之间传输值。

