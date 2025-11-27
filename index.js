const { log } = require("console")
const fs = require("fs")
const programCodeFile = require("./start.js")
const jsonFile = "./registries.json"
const codeFile = programCodeFile
let memory = {}
try {
    memory = require(jsonFile)
} catch {
    console.error("")
}

function write(register, value) {
    memory[register] = parseInt(value)
    fs.writeFileSync(jsonFile, JSON.stringify(memory), function writeJSON(err) {
        if (err) return console.log(err);
    });
}

function read(register) {
    try {
        return (memory[register] == undefined) ? 0 : memory[register]
    } catch (e) {
        console.error("could not read to json file", e)
    }
}

function resetMemory() {
    fs.writeFileSync(jsonFile, "{}", "utf8")
}

function add(register, number) {
    if (!isNaN(number)) {
        write(`${register}`, read(register) + parseInt(number))
    }
}

function subtract(register, number) {
    if (!isNaN(number)) {
        write(`${register}`, read(register) - parseInt(number))
    }
}

function multiply(register, number) {
    if (!isNaN(number)) {
        write(`${register}`, read(register) * parseInt(number))
    }
}

function divide(register, number) {
    if (!isNaN(number)) {
        write(`${register}`, Math.floor(read(register) / parseInt(number)))
    }
}

function say(register) {
    log(read(register))
}

function isEqual(register, targetValue) {
    if (read(register) == targetValue) {
        return true
    } else {
        return false
    }
}

function writeFromRegister(destRegister, srcRegister) {
    write(destRegister, read(srcRegister))
}

function bitShiftUp(destRegister, shifter) {
    write(destRegister, read(destRegister) << shifter)
}

function bitShiftDown(destRegister, shifter) {
    write(destRegister, read(destRegister) >> shifter)
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
    resetMemory()
    setTimeout(() => {
        const lines = splitLines(readCode())
        for (let line = 0 ; line < splitLines(readCode()).length ; line++) {
            const action = getInstruction(lines[line])

            switch (action[0].toString()) {
                case "ADD":
                    add(action[1], action[2])
                    break
                case "SUB":
                    subtract(action[1], action[2])
                    break
                case "MUL":
                    multiply(action[1], action[2])
                    break
                case "DIV":
                    divide(action[1], action[2])
                    break
                case "SAY":
                    say(action[1])
                    break
                case "LOD":
                    write(action[1], action[2])
                    break
                case "JMP":
                    line = parseInt(action[1]) -2
                    break
                case "JIF":
                    line = (isEqual(action[2], action[3])) ? action[1] -2 : line
                    break
                case "JIN":
                    line = (!isEqual(action[2], action[3])) ? action[1] -2 : line
                    break
                case "LVF":
                    writeFromRegister(action[1], action[2])
                    break
                case "AVF":
                    add(action[1], read(action[2]))
                    break
                case "SVF":
                    subtract(action[1], read(action[2]))
                    break
                case "MVF":
                    multiply(action[1], read(action[2]))
                    break
                case "DVF":
                    divide(action[1], read(action[2]))
                    break
                case "END":
                    process.exit()
                case "JIFV":
                    line = (isEqual(action[2], read(action[3]))) ? action[1] -2 : line
                    break
                case "JINV":
                    line = (!isEqual(action[2], read(action[3]))) ? action[1] -2 : line
                    break
                case "BSU":
                    bitShiftUp(action[1], action[2])
                    break
                case "BSD":
                    bitShiftDown(action[1], action[2])
                    break
            }
        }
    }, 20)
}

runProgram()

