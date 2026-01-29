const { log } = require("console")
const fs = require("fs")
const programCodeFile = require("./start.js")
const Variables = require("./variables")
const codeFile = programCodeFile

const debugMode = false

function add(register, number, variable) {
    if (!isNaN(number)) {
        variable.setValue(register, variable.getValue(register) + parseInt(number))
    }
}

function subtract(register, number, variable) {
    if (!isNaN(number)) {
        variable.setValue(register, variable.getValue(register) - parseInt(number))
    }
}

function multiply(register, number, variable) {
    if (!isNaN(number)) {
        variable.setValue(register, variable.getValue(register) * parseInt(number))
    }
}

function divide(register, number, variable) {
    if (!isNaN(number)) {
        variable.setValue(
            register,
            Math.floor(variable.getValue(register) / parseInt(number))
        )
    }
}

function print(register, variable) {
    log(variable.getValue(register))
}

function isEqual(register, targetValue, variable) {
    if (variable.getValue(register) == targetValue) {
        return true
    } else {
        return false
    }
}

function writeFromRegister(destRegister, srcRegister, variable) {
    variable.createVariable(destRegister, variable.getValue(srcRegister))
}

function bitShiftUp(destRegister, shifter, variable) {
    variable.setValue(destRegister, variable.getValue(destRegister) << shifter)
}

function bitShiftDown(destRegister, shifter, variable) {
    variable.setValue(destRegister, variable.getValue(destRegister) >> shifter)
}

function bitwiseAnd(destRegister, operand, variable) {
    variable.setValue(destRegister, variable.getValue(destRegister) & operand)
}

function bitwiseOr(destRegister, operand, variable) {
    variable.setValue(destRegister, variable.getValue(destRegister) | operand)
}

function bitwiseXor(destRegister, operand, variable) {
    variable.setValue(destRegister, variable.getValue(destRegister) ^ operand)
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}




function readCode() {
    const code = fs.readFileSync(codeFile, "utf8")

    return code
}

function splitLines(text) {
    const lines = text.replaceAll("\r", "").split("\n")

    return lines
}

function getInstruction(lineOfCode) {
    const instruction = lineOfCode.split(" ")

    return instruction
}


async function executeInstruction(instruction, registers, line, isInFunction, functions) {
    let linesToMove = 0
    switch (instruction[0].toString()) {
        case "ADD":
            add(instruction[1], instruction[2], registers)
            if (debugMode) registers.printVariables("<ADD>")
            return [linesToMove, isInFunction, undefined]
        case "SUB":
            subtract(instruction[1], instruction[2], registers)
            if (debugMode) registers.printVariables("<SUB>")
            return [linesToMove, isInFunction, undefined]
        case "MUL":
            multiply(instruction[1], instruction[2], registers)
            if (debugMode) registers.printVariables("<MUL>")
            return [linesToMove, isInFunction, undefined]
        case "DIV":
            divide(instruction[1], instruction[2], registers)
            if (debugMode) registers.printVariables("<DIV>")
            return [linesToMove, isInFunction, undefined]
        case "PRT":
            print(instruction[1], registers)
            if (debugMode) registers.printVariables("<PRT>")
            return [linesToMove, isInFunction, undefined]
        case "LOD":
            registers.createVariable(instruction[1], parseInt(instruction[2]))
            if (debugMode) registers.printVariables("<LOD>")
            return [linesToMove, isInFunction, undefined]
        case "JMP":
            linesToMove = parseInt(instruction[1]) -1 - line
            if (debugMode) registers.printVariables("<JMP>")
            return [linesToMove, isInFunction, undefined]
        case "JIF":
            linesToMove = (isEqual(instruction[2], instruction[3], registers)) ? instruction[1] -2 - line : 0
            if (debugMode) registers.printVariables("<JIF>")
            return [linesToMove, isInFunction, undefined]
        case "JIN":
            linesToMove = (!isEqual(instruction[2], instruction[3], registers)) ? instruction[1] -2 - line : 0
            if (debugMode) registers.printVariables("<JIN>")
            return [linesToMove, isInFunction, undefined]
        case "LVF":
            writeFromRegister(instruction[1], instruction[2], registers)
            if (debugMode) registers.printVariables("<LVF>")
            return [linesToMove, isInFunction, undefined]
        case "AVF":
            add(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) registers.printVariables("<AVF>")
            return [linesToMove, isInFunction, undefined]
        case "SVF":
            subtract(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) registers.printVariables("<SVF>")
            return [linesToMove, isInFunction, undefined]
        case "MVF":
            multiply(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) registers.printVariables("<MVF>")   
            return [linesToMove, isInFunction, undefined]
        case "DVF":
            divide(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) registers.printVariables("<DVF>")
            return [linesToMove, isInFunction, undefined]
        case "END":
            process.exit()
        case "JIFV":
            linesToMove = (isEqual(instruction[2], registers.getValue(instruction[3]), registers)) ? instruction[1] -2 - line : 0
            if (debugMode) registers.printVariables("<JIFV>")
            return [linesToMove, isInFunction, undefined]
        case "JINV":
            linesToMove = (!isEqual(instruction[2], registers.getValue(instruction[3]), registers)) ? instruction[1] -2 - line : 0
            if (debugMode) registers.printVariables("<JINV>")
            return [linesToMove, isInFunction, undefined]
        case "BSU":
            bitShiftUp(instruction[1], instruction[2], registers)
            if (debugMode) registers.printVariables("<BSU>")
            return [linesToMove, isInFunction, undefined]
        case "BSD":
            bitShiftDown(instruction[1], instruction[2], registers)
            if (debugMode) registers.printVariables("<BSD>")
            return [linesToMove, isInFunction, undefined]
        case "BWA":
            bitwiseAnd(instruction[1], instruction[2], registers)
            if (debugMode) registers.printVariables("<BWA>")
            return [linesToMove, isInFunction, undefined]
        case "BWO":
            bitwiseOr(instruction[1], instruction[2], registers)
            if (debugMode) registers.printVariables("<BWO>")
            return [linesToMove, isInFunction, undefined]
        case "BWX":
            bitwiseXor(instruction[1], instruction[2], registers)
            if (debugMode) registers.printVariables("<BWX>")
            return [linesToMove, isInFunction, undefined]
        case "BSUV":
            bitShiftUp(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) registers.printVariables("<BSU>")
            return [linesToMove, isInFunction, undefined]
        case "BSDV":
            bitShiftDown(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) registers.printVariables("<BSD>")
            return [linesToMove, isInFunction, undefined]
        case "BWAV":
            bitwiseAnd(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) registers.printVariables("<BWA>")
            return [linesToMove, isInFunction, undefined]
        case "BWOV":
            bitwiseOr(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) registers.printVariables("<BWO>")
            return [linesToMove, isInFunction, undefined]
        case "BWXV":
            bitwiseXor(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) registers.printVariables("<BWX>")
            return [linesToMove, isInFunction, undefined]
        case "SLP":
            await sleep(parseInt(instruction[1]))
            return [linesToMove, isInFunction, undefined]
        case "FNC":
            return [linesToMove, true, instruction[1]]
        case "EXC":
            if (functions.has(instruction[1])) {
                const functionLines = functions.get(instruction[1])
                if (debugMode) registers.printVariables("<EXC>")
                for (let i = 0; i < functionLines.length; i++) {
                    await executeInstruction(
                        getInstruction(functionLines[i]),
                        registers,
                        line + i,
                        isInFunction,
                        functions
                    )
                }
                if (debugMode) registers.printVariables("</EXC>")
            } else {
                throw new Error(`Function ${instruction[1]} not defined yet`)
            }
            return [linesToMove, isInFunction, undefined]
        default:
            return [linesToMove, isInFunction, undefined]
    }
}


function runProgram() {
    const VARIABLE = new Variables()
    setTimeout(async () => {
        const lines = splitLines(readCode())
        let isInFunction = false
        let functionLines = []
        let currentFunctionName = ""
        let functions = new Map()
        for (let line = 0; line < lines.length; line++) {
            if (!isInFunction) {
                const action = getInstruction(lines[line])
                let returnVals = await executeInstruction(action, VARIABLE, line, isInFunction, functions)
                line += returnVals[0]
                isInFunction = returnVals[1]
                currentFunctionName = returnVals[2] || currentFunctionName

                if (isInFunction) {
                    functionLines = []
                }
            } else {
                if (/^\s+/.test(lines[line])) {
                    functionLines.push(lines[line].trim())
                } else {
                    functions.set(currentFunctionName, functionLines)
                    isInFunction = false
                    line--
                }
            }
        }
        if (isInFunction) {
            functions.set(currentFunctionName, functionLines)
        }
    }, 20)
}

runProgram()

