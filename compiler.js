const { log } = require('console')
const fs = require('fs')


let codeFile = "./test.js"
let currentLine = 0

function readFile() {
    let code = fs.readFileSync(codeFile, "utf8")
    
    code = (code == '' || code == undefined) ? '' : code
    
    return code
}

function cleanFile() {
    if (fs.existsSync(`./dist/${codeFile.replace(".js", ".juv")}`)) {
        fs.writeFileSync(`./dist/${codeFile.replace(".js", ".juv")}`, ``, 'utf8', function writeJSON(err) {
            if (err) return console.log(err);
        });
    }
}

function readAssemblyFile() {
    
    let code = fs.readFileSync(`./dist/${codeFile.replace(".js", ".juv")}`, "utf8")
    
    code = (code == '' || code == undefined) ? '' : code
    
    return code
}


function splitLines(text) {
    const lines = text.replaceAll("\r", "").split("\n")

    return lines
} 

function writeNextLine(text) {
    if (fs.existsSync(`./dist/${codeFile.replace(".js", ".juv")}`)) {
        const fileContent = readAssemblyFile()

        const newLine = (currentLine == 0) ? '' : "\n"

        fs.writeFileSync(`./dist/${codeFile.replace(".js", ".juv")}`, `${fileContent}${newLine}${text}`, 'utf8', function writeJSON(err) {
            if (err) return console.log(err);
        });
        currentLine += 1
    } else {
        fs.mkdirSync('./dist/', { recursive: true })
        fs.appendFileSync(`./dist/${codeFile.replace(".js", ".juv")}`, '', "utf8")
    }
}


function getLineInfo(line) {
    log(line)
    if (line.startsWith("let") || line.startsWith("const") || line.startsWith("var")) {
        const varName = line.split('=').slice(0, 1).toString().split(" ").slice(1, 2).toString()
        let value = line.split('=').slice(1, 2).toString().replaceAll(" ", "").split('\n').slice(0, 1).toString()
        let extraValues = undefined

        if (value.includes("+")) {
            const toAdd = value.split("+").slice(1, 2).toString()
            value = value.split("+").slice(0, 1)
            extraValues = [writeAddition, toAdd]
        }

        if (value.includes("-")) {
            const toSub = value.split("-").slice(1, 2).toString()
            value = value.split("-").slice(0, 1)
            extraValues = [writeSubtraction, toSub]
        }

        if (value.includes("*")) {
            const toSub = value.split("*").slice(1, 2).toString()
            value = value.split("*").slice(0, 1)
            extraValues = [writeMultiplication, toSub]
        }

        if (value.includes("/")) {
            const toSub = value.split("/").slice(1, 2).toString()
            value = value.split("/").slice(0, 1)
            extraValues = [writeDivision, toSub]
        }

        value = (value == undefined || !value) ? 0 : value

        writeVariable(varName, value)
        if (extraValues != undefined) {
            let extraVar = (extraValues[1] == undefined || !extraValues[1]) ? 0 : extraValues[1]
            extraValues[0](varName, extraVar)
        }
    } else if (line.startsWith("if")) {
        let statement = line.split()
        //TODO
        if (line.includes("=+") || line.includes("=-")) {
            //TODO
        }
    } else if (line.startsWith("for")) {
        //TODO
        if (line.includes("=+") || line.includes("=-")) {
            //TODO
        }
    } else if (line.startsWith("while")) {
        //TODO
        if (line.includes("=+") || line.includes("=-")) {
            //TODO
        }
    }
}

function quickAdding() {
    //TODO
}

function quickSubtracting() {
    //TODO
}

function writeForLoop() {
    //TODO 
}

function writeWhileLoop() {
    //TODO
}

function writeIfStatements() {
    //TODO
}


function writeVariable(name, value) {
    if (isNaN(value)) {
        writeNextLine(`LVF ${name} ${value}`)
    } else {
        writeNextLine(`LOD ${name} ${value}`)
    }
}

function writeAddition(name, value) {
    if (isNaN(value)) {
        writeNextLine(`AVF ${name} ${value}`)
    } else {
        writeNextLine(`ADD ${name} ${value}`)
    }
}

function writeSubtraction(name, value) {
    if (isNaN(value)) {
        writeNextLine(`SVF ${name} ${value}`)
    } else {
        writeNextLine(`SUB ${name} ${value}`)
    }
}

function writeMultiplication(name, value) {
    if (isNaN(value)) {
        writeNextLine(`MVF ${name} ${value}`)
    } else {
        writeNextLine(`MUL ${name} ${value}`)
    }
}

function writeDivision(name, value) {
    if (isNaN(value)) {
        writeNextLine(`DVF ${name} ${value}`)
    } else {
        writeNextLine(`DIV ${name} ${value}`)
    }
}


cleanFile()
splitLines(readFile()).forEach( line => {
    getLineInfo(line)
})
writeNextLine("END")