const { log } = require("console")
const fs = require("fs")
const {programCodeFile} = require("./start.js")
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

function debugPrint(message, variable, instruction, line) {
    variable.printVariables(message)
    console.log({ instructionName: message, instruction: instruction, line: line })
}


async function executeInstruction(instruction, registers, line, isInFunction, functions) {
    let linesToMove = 0
    switch (instruction[0].toString()) {
        case "ADD":
            add(instruction[1], instruction[2], registers)
            if (debugMode) debugPrint("<ADD>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "SUB":
            subtract(instruction[1], instruction[2], registers)
            if (debugMode) debugPrint("<SUB>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "MUL":
            multiply(instruction[1], instruction[2], registers)
            if (debugMode) debugPrint("<MUL>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "DIV":
            divide(instruction[1], instruction[2], registers)
            if (debugMode) debugPrint("<DIV>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "PRT":
            print(instruction[1], registers)
            if (debugMode) debugPrint("<PRT>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "LOD":
            registers.createVariable(instruction[1], parseInt(instruction[2]))
            if (debugMode) debugPrint("<LOD>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "JMP":
            linesToMove = parseInt(instruction[1]) -2 - line
            if (debugMode) debugPrint("<JMP>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "JIF":
            linesToMove = (isEqual(instruction[2], instruction[3], registers)) ? 
                instruction[1] -2 - line : 0
            if (debugMode) debugPrint("<JIF>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "JIN":
            linesToMove = (!isEqual(instruction[2], instruction[3], registers)) ? 
                instruction[1] -2 - line : 0
            if (debugMode) debugPrint("<JIN>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "LVF":
            writeFromRegister(instruction[1], instruction[2], registers)
            if (debugMode) debugPrint("<LVF>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "AVF":
            add(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) debugPrint("<AVF>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "SVF":
            subtract(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) debugPrint("<SVF>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "MVF":
            multiply(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) debugPrint("<MVF>", registers, instruction, line)   
            return [linesToMove, isInFunction, undefined]
        case "DVF":
            divide(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) debugPrint("<DVF>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "END":
            process.exit()
        case "JIFV":
            linesToMove = (isEqual(instruction[2], registers.getValue(instruction[3]), registers)) ? 
                instruction[1] -2 - line : 0
            if (debugMode) debugPrint("<JIFV>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "JINV":
            linesToMove = (!isEqual(instruction[2], registers.getValue(instruction[3]), registers)) ? 
                instruction[1] -2 - line : 0
            if (debugMode) debugPrint("<JINV>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "BSU":
            bitShiftUp(instruction[1], instruction[2], registers)
            if (debugMode) debugPrint("<BSU>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "BSD":
            bitShiftDown(instruction[1], instruction[2], registers)
            if (debugMode) debugPrint("<BSD>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "BWA":
            bitwiseAnd(instruction[1], instruction[2], registers)
            if (debugMode) debugPrint("<BWA>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "BWO":
            bitwiseOr(instruction[1], instruction[2], registers)
            if (debugMode) debugPrint("<BWO>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "BWX":
            bitwiseXor(instruction[1], instruction[2], registers)
            if (debugMode) debugPrint("<BWX>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "BSUV":
            bitShiftUp(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) debugPrint("<BSU>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "BSDV":
            bitShiftDown(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) debugPrint("<BSD>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "BWAV":
            bitwiseAnd(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) debugPrint("<BWA>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "BWOV":
            bitwiseOr(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) debugPrint("<BWO>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "BWXV":
            bitwiseXor(instruction[1], registers.getValue(instruction[2]), registers)
            if (debugMode) debugPrint("<BWX>", registers, instruction, line)
            return [linesToMove, isInFunction, undefined]
        case "SLP":
            if (debugMode) debugPrint("<SLP>", registers, instruction, line)
            await sleep(parseInt(instruction[1]))
            return [linesToMove, isInFunction, undefined]
        case "FNC":
            return [linesToMove, true, instruction[1]]
        case "EXC":
            if (!functions.has(instruction[1])) {
                throw new Error(`Function ${instruction[1]} not defined yet`)
            }

            const functionLines = functions.get(instruction[1])
            if (debugMode) debugPrint("<EXC>", registers, instruction, line)

            for (let i = 0; i < functionLines.length; i++) {
                const functionInstruction = getInstruction(functionLines[i])
                 //im not proud of these 2 instructions being here but i cannot find a better way to do it right now also im tired rn
                switch (functionInstruction[0]) {
                    case "EFF":
                        if (debugMode) debugPrint("<EFF>", registers, functionInstruction, line)
                        if (registers.getValue(functionInstruction[1]) == parseInt(functionInstruction[2])) {
                            return [linesToMove, false, undefined]
                        }
                        break
                    case "EFFV":
                        if (debugMode) debugPrint("<EFFV>", registers, functionInstruction, line)
                        if (registers.getValue(functionInstruction[1]) == registers.getValue(functionInstruction[2])) {
                            return [linesToMove, false, undefined]
                        }
                        break
                    default:
                        if (debugMode) debugPrint("<EXC_STEP>", registers, functionInstruction, line)
                        await executeInstruction(functionInstruction, registers, line, isInFunction, functions)
                }
            }

            if (debugMode) debugPrint("</EXC>", registers, instruction, line)
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


