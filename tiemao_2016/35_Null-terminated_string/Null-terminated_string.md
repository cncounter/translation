# https://en.wikipedia.org/wiki/Null-terminated_string

In computer programming, a null-terminated string is a character string stored as an array containing the characters and terminated with a null character ('\0', called NUL in ASCII). Alternative names are C string, which refers to the C programming language and ASCIIZ (note that C strings do not imply the use of ASCII).

The length of a C string is found by searching for the (first) NUL byte. This can be slow as it takes O(n) (linear time) with respect to the string length. It also means that a NUL cannot be inside the string, as the only NUL is the one marking the end.

History[edit]
Null-terminated strings were produced by the .ASCIZ directive of the PDP-11 assembly languages and the ASCIZ directive of the MACRO-10 macro assembly language for the PDP-10. These predate the development of the C programming language, but other forms of strings were often used.

At the time C (and the languages that it was derived from) was developed, memory was extremely limited, so using only one byte of overhead to store the length of a string was attractive. The only popular alternative at that time, usually called a "Pascal string" (though also used by early versions of BASIC), used a leading byte to store the length of the string. This allows the string to contain NUL and made finding the length need only one memory access (O(1) (constant) time). However, C designer Dennis Ritchie chose to follow the convention of NUL-termination, already established in BCPL, to avoid the limitation on the length of a string caused by holding the count in an 8- or 9-bit slot, and partly because maintaining the count seemed, in his experience, less convenient than using a terminator.[1]

This had some influence on CPU instruction set design. Some CPUs in the 1970s and 1980s, such as the Zilog Z80 and the DEC VAX, had dedicated instructions for handling length-prefixed strings. However, as the NUL-terminated string gained traction, CPU designers began to take it into account, as seen for example in IBM's decision to add the "Logical String Assist" instructions to the ES/9000 520 in 1992.

FreeBSD developer Poul-Henning Kamp, writing in ACM Queue, would later refer to the victory of the C string over use of a 2-byte (not 1-byte) length as "the most expensive one-byte mistake" ever.[2]



from https://en.wikipedia.org/wiki/Null-terminated_string

