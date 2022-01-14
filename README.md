# TS Stack Machine

This project contains a Stack Machine Runtime with support for a heap. The input code consists of labeled blocks of instructions. A label has to always start with a `.`. An instruction can accept a single optional hardcoded argument. Lines starting with a `#` are comments. The stack contains `ReturnMarker`s to fence of frames.

```s
# 2 == 3 || 1 == 2

.main
    push 3
    push 3
    equals
    if .b1true

    push 1
    push 2
    equals 
    if .b1true

    push false
    jump .cont
    
.b1true
    push true
    jump .cont

.cont
    print

```
> The instruction code that is equivalent to `2 == 3 || 1 == 2`.

## List of commands

- `push`. Required argument. Pushed a value to the stack
- `alloc`. Optional argument. Allocates N space on the heap. Pushed the pointer to the allocated object on the stack
- `clear`. Optional argument. Clear the object at the address from the heap
- `h_assign`. No arguments. Moves a value to the stack. Pops the value, the property offset and the object pointer from the stack.
- `h_read`.  No arguments. Reads a value from the heap. Pops the property offset and the object pointer from the stack.
- `add`. No arguments. Pops two values from the stack and pushes their sum.
- `decrease`. No arguments. Pops a value from the stack and pushed it minus one.
- `equals`. No arguments. Pops two values from the stack and pushes a bool indicating if they are equal.
- `invoke`. No arguments. Calls a function. Pops its label, the number and the arguments of the stack. Pushes a `ReturnMarker` and the arguments and then inserts the target instructions at the front of the instruction stack.
- `return`. No argument. Pops all values of the current frame of the stack, pops the `ReturnMarker` and pushes the return value.
- `if`. Optional argument. Jumps to a label when it finds `true` on the stack. Pops the bool and label (if not provided).
- `jump`. Optional argument. Jumps to a label. Pops the label (if not provided).
- `print` No argument. Pops a value and prints it to the console.
- `drop`. No argument. Pops a value.
- `duplicate`. No argument. Duplicates the last value on the stack.
- `swap`. No argument. Swaps the last two values on the stack.
- `not`. No argument. Pops a bool and pushes its negation.
- `debug`. No argument. Prints the stack and heap state.
- `local`. Optional argument. Pops a number if no argument. Pushes the N-th value in the current frame.