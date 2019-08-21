# RunTimeDataAreas

Data type:
 
    boolean, byte, char, short, int, float, reference, or returnAddress
    long or double.




Data Area:

- pc Register

  program counter register, per thread

- Java Virtual Machine Stacks

  per thread, private, C Stack, StackOverflowError, OutOfMemoryError

- Heap

  shared, OutOfMemoryError

- Method Area

  per-class structures, run-time constant pool, field, method,

- Run-Time Constant Pool

  symbol table, numeric literals, field references,

- Native Method Stacks

  Optional, C stacks, StackOverflowError, OutOfMemoryError



- Frames
  * Local Variables
  * Operand Stacks
  * Dynamic Linking


Special Methods:

```
<init>
<clinit>
```




load and store instructions transfer values between the local variables (§2.6.1) and the operand stack

