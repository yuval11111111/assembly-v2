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
- PRT - prints a register's value
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
- BWA - execute a bitwise and on a register's value and a hard value
- BWO - execute a bitwise or on a register's value and a hard value
- BWX - execute a bitwise xor on a register's value and a hard value
- BSUV - bit shift up the value of a given register another's register's value of bits
- BSDV - bit shift down the value of a given register another's register's value of bits
- BWAV - execute a bitwise and on a register's value and a another's register's value
- BWOV - execute a bitwise or on a register's value and a another's register's value
- BWXV - execute a bitwise xor on a register's value and a another's register's value
- EXC - execute a function that was definded earlier in the file
- FNC - start of a definition of a function, the function does not get executed when the runtime executer pass it for the first time
- SLP - stops the interpreter for given milisecends
### Syntax of each instruction
#### LOD
```
LOD R0 5 -> R0 = 5
```
#### ADD
```
LOD R0 5
ADD R0 3 -> R0 = 5 + 3 = 8
```
#### SUB
```
LOD R0 10
SUB R0 7 -> R0 = 10 - 7 = 3
```
#### MUL
```
LOD R0 13
MUL R0 2 -> R0 = 13 * 2 = 26
```
#### DIV
```
LOD R0 9
DIV R0 2 -> R0 = Math.floor(9 / 2) = 4 
#this language only work with ints out of the box in this point
```
#### PRT
```
LOD R0 14
PRT R0 -> prints R0's value to the terminal
```
#### JMP
```
LOD R0 5
ADD R0 1
JMP 1 -> jumps the interpreter to the given line in the file, first line is 0, it can jump forwards and backwards
```
#### END
```
LOD R0 5
ADD R0 1
PRT R0
END -> stops the execution of the program, without an end instruction the code will keep running forever
```
#### JIF
```
LOD R0 4
ADD R0 1
JIF 1 R0 5 -> jumps to lines 1 only if R0 = 5
END
```
#### JIN
```
LOD R0 2
ADD R0 1
JIN 1 R0 6 -> jumps to lines 1 only if R0 != 6, the opposed of JIF
END
```
#### LVF
```
LOD R0 5
LVF R1 R0 -> copies R0's value into R1 which means R1 = 5
```
#### AVF
```
LOD R0 5
LOD R1 3
AVF R0 R1 -> R0 = R0 + R1 = 5 + 3 = 8, it adds a register's value with another register's value
```
#### SVF
```
LOD R0 12
LOD R1 7
SVF R0 R1 -> R0 = R0 - R1 = 12 - 7 = 5, it subtracts a register's value with another register's value
```
#### MVF
```
LOD R0 3
LOD R1 6
MVF R0 R1 -> R0 = R0 * R1 = 3 * 6 = 18, it multiplies a register's value with another register's value
```
#### DVF
```
LOD R0 7
LOD R1 2
DVF R0 R1 -> R0 = Math.floor(R0 / R1) = Math.floor(7 / 2) = 3
```
#### JIFV
```
LOD R0 7
LOD R1 2
LOD R2 9
AVF R0 R1
JIFV 2 R0 R2, jumps to a given line if a given register's value is equals to another register's value
```
#### JINV
```
LOD R0 7
LOD R1 2
LOD R2 13
AVF R0 R1
JINV 2 R0 R2, jumps to a given line if a given register's value is not equals to another register's value
```
#### FNC
```
FNC test -> declars the start of the function and it's name
    ADD R0 4 -> every line after that that uses a tab will count into the function
    SUB R1 1
    MVF R0 R1 -> in this examples R0 and R1 are undefind so it will fail
PRT R0 -> isn't part of the function
```
#### EXC
```
FNC test
    ADD R0 4
    SUB R1 1
    MVF R0 R1 -> R0 = 2 + 4 * (5 - 1) = 24
LOD R0 2 -> declars values before execution
LOD R1 5
EXC test -> tell the interpeter what function to run, the function must be written in a line the interpeter already passed by at this point for it to find it
```
#### BSU
```
LOD R0 2
BSU R0 2 -> R0 = R0 << 2 = 2 << 2 = 8, it bit shift up the value of a given register by a hard value
```
#### BSD
```
LOD R0 8
BSD R0 2 -> R0 = R0 >> 2 = 8 >> 2 = 2, it bit shift down the value of a given register by a hard value
```
#### BWA
```
LOD R0 4
BWA R0 6 -> R0 = R0 & 6 = 4 & 6 = 4, it does bitwise and with a given register's value and a hard value
```
#### BWO
```
LOD R0 6
BWO R0 9 -> R0 = R0 | 9 = 6 | 9 = 15, it does bitwise or with a given register's value and a hard value
```
#### BWX
```
LOD R0 6
BWX R0 10 -> R0 = R0 ^ 10 = 6 ^ 10 = 12, it does bitwise xor with a given register's value and a hard value
```
#### BSUV
```
LOD R0 2
LOD R1 2
BSU R0 R1 -> R0 = R0 << R1 = 2 << 2 = 8, it bit shift up the value of a given register by another register's value
```
#### BSDV
```
LOD R0 8
LOD R1 2
BSD R0 R1 -> R0 = R0 >> R1 = 8 >> 2 = 2, it bit shift down the value of a given register by another register's value
```
#### BWAV
```
LOD R0 4
LOD R1 6
BWA R0 R1 -> R0 = R0 & R1 = 4 & 6 = 4, it does bitwise and with a given register's value and another register's value
```
#### BWOV
```
LOD R0 6
LOD R1 9
BWO R0 R1 -> R0 = R0 | R1 = 6 | 9 = 15, it does bitwise or with a given register's value and another register's value
```
#### BWXV
```
LOD R0 6
LOD R1 10
BWX R0 R1 -> R0 = R0 ^ R1 = 6 ^ 10 = 12, it does bitwise xor with a given register's value and another register's value
```
#### SLP
```
FNC loop
    ADD R0 1
    SLP 3000 -> sleeps x number of milisecends
    PRT R0
EXC loop
JMP 4
```
### How to run a program
to run a program you can do 
```
node start <file-location>
```
or to write a program from scratch just run
```
node start
```

### Example for a program
```
LOD N 69
LOD F0 1
LOD F1 1
PRT F0
PRT F1
LOD A 2
LOD TMP 0
LVF TMP F0
AVF TMP F1
PRT TMP
LVF F0 F1
LVF F1 TMP
ADD A 1
JINV 8 A N
END
```
the program above calculate the N numbers in the fibonacci sequence
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
PRT t1
PRT t2
PRT t3
EXC test2
PRT t1
PRT t2
PRT t3
END
```
*im also working on a js to my assembly compiler but that will take time*