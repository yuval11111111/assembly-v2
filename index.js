const { log } = require("console")
const fs = require("fs")
const programCodeFile = require("./start.js")
const Variables = require("./variables")
const codeFile = programCodeFile

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

function say(register, variable) {
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




function runProgram() {
    const VARIABLE = new Variables()
    setTimeout(() => {
        const lines = splitLines(readCode())
        for (let line = 0 ; line < splitLines(readCode()).length ; line++) {
            const action = getInstruction(lines[line])

            switch (action[0].toString()) {
                case "ADD":
                    add(action[1], action[2], VARIABLE)
                    break
                case "SUB":
                    subtract(action[1], action[2], VARIABLE)
                    break
                case "MUL":
                    multiply(action[1], action[2], VARIABLE)
                    break
                case "DIV":
                    divide(action[1], action[2], VARIABLE)
                    break
                case "SAY":
                    say(action[1], VARIABLE)
                    break
                case "LOD":
                    VARIABLE.createVariable(action[1], parseInt(action[2]))
                    break
                case "JMP":
                    line = parseInt(action[1]) -2
                    break
                case "JIF":
                    line = (isEqual(action[2], action[3], VARIABLE)) ? action[1] -2 : line
                    break
                case "JIN":
                    line = (!isEqual(action[2], action[3], VARIABLE)) ? action[1] -2 : line
                    break
                case "LVF":
                    writeFromRegister(action[1], action[2], VARIABLE)
                    break
                case "AVF":
                    add(action[1], VARIABLE.getValue(action[2]), VARIABLE)
                    break
                case "SVF":
                    subtract(action[1], VARIABLE.getValue(action[2]), VARIABLE)
                    break
                case "MVF":
                    multiply(action[1], VARIABLE.getValue(action[2]), VARIABLE)
                    break
                case "DVF":
                    divide(action[1], VARIABLE.getValue(action[2]), VARIABLE)
                    break
                case "END":
                    process.exit()
                case "JIFV":
                    line = (isEqual(action[2], VARIABLE.getValue(action[3]), VARIABLE)) ? action[1] -2 : line
                    break
                case "JINV":
                    line = (!isEqual(action[2], VARIABLE.getValue(action[3]), VARIABLE)) ? action[1] -2 : line
                    break
                case "BSU":
                    bitShiftUp(action[1], action[2], VARIABLE)
                    break
                case "BSD":
                    bitShiftDown(action[1], action[2], VARIABLE)
                    break
            }
        }
    }, 20)
}

runProgram()

