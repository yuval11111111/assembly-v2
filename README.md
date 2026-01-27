# AssemblyJS
## What is this
this is a project of me trying to make a very simple programming language assembly style
## How does it work
this language is written in node js which reads text based instructions and converts them to runtime js instructions
### What instructions does it have
- ADD - adds a register's value and a hard value
- SUB - subtracts a register's value by a hard value
- MUL - multiplys a register's value and a hard value
- DIV - divides a register's value by a hard value
- SAY - prints a register's value
- LOD - loads a hard value into a register
- JMP - jumps to a given line in the file
- JIF - jump to a given line in the file if a given register is equals to hard value
- JIN - jump to a given line in the file if a given register is not equals to hard value
- LVF - loads a register from the value of another register
- AVF - adds to the value of a register from the value of another register
- SVF - subtract from the value of a register from the value of another register
- MVF - multuiply the value of a register with the value of another register
- DVF - divide the value of a register with the value of another register
- END - stops the program when executed
- JINV - jump to a given line in the file if a given register is not equals to another given register's value
- JIFV - jump to a given line in the file if a given register is equals to another given register's value
- BSU - bit shift up the value of a given register hard value of bits
- BSD - bit shift down the value of a given register hard value of bits
### How to run a program
to run a program you can do 
```powershell
node start <file-location>
```
or to write a program from scratch just run
```powershell
node start
```

### Example for a program
```
LOD N 69
LOD F0 1
LOD F1 1
SAY F0
SAY F1
LOD A 2
LOD TMP 0
LVF TMP F0
AVF TMP F1
SAY TMP
LVF F0 F1
LVF F1 TMP
ADD A 1
JINV 8 A N
END
```
### Another example
```
FNC test
    ADD t1 2
    ADD t2 4
    LVF t3 t1
    AVF t3 t2

FNC test2
    ADD t1 5
    SUB t2 3
    LVF t3 t2
    SVF t1 t3

LOD t1 3
LOD t2 5
EXC test
SAY t1
SAY t2
SAY t3
EXC test2
SAY t1
SAY t2
SAY t3
END
```
the program above calculate the N numbers in the fibonacci sequence

*im also working on a js to my assembly compiler but that will take time*