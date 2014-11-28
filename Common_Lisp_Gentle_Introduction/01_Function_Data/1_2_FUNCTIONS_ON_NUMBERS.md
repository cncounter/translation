##1.2 FUNCTIONS ON NUMBERS

Probably the most familiar functions are the simple arithmetic functions of
addition, subtraction, multiplication, and division. Here is how we represent
the addition of two numbers:

![]()


The name of the function is ‘‘+.’’ We can describe what’s going on in the
figure in several ways. From the point of view of the data: The numbers 2
and 3 flow into the function, and the number 5 flows out. From the point of
view of the function: The function ‘‘+’’ received the numbers 2 and 3 as
inputs, and it produced 5 as its result. From the programmer’s point of view:
We called (or invoked) the function ‘‘+’’ on the inputs 2 and 3, and the
function returned 5. These different ways of talking about functions and data
are equivalent; you will encounter all of them in various places in this book.
Here is a table of Lisp functions that do useful things with numbers:
+ Adds two numbers
- Subtracts the second number from the first
* Multiplies two numbers
/ Divides the first number by the second
ABS Absolute value of a number
SQRT Square root of a number
Let’s look at another example of how data flows through a function. The
output of the absolute value function, ABS, is the same as its input, except that
negative numbers are converted to positive ones.






########---
*Technical terms like these, which appear in boldface in the text, are defined in the glossary at the back of
the book.

