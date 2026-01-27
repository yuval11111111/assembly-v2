const { log } = require('console')
const fs = require('fs')

let codeFile = "./test.js"
let currentLine = 0

function readFile() {
    let code = fs.readFileSync(codeFile, "utf8")
    
    code = (code == '' || code == undefined) ? '' : code
    
    return code
}

log(compile(readFile()))

function compile(jsCode) {
    const asm = []
    let line = 1

    function emit(code) {
        asm.push(code)
        emit.line++
    }
    emit.line = 1
    emit.asm = asm

    const ifRegex =
        /if\s*\(\s*(\w+)\s*(==|!=)\s*(\w+|\d+)\s*&&\s*(\w+)\s*(==|!=)\s*(\w+)\s*\)\s*\{([\s\S]*?)\}\s*else\s*\{([\s\S]*?)\}/

    const ifMatch = jsCode.match(ifRegex)

    if (ifMatch) {
        const [
            _,
            aL, aOp, aR,
            bL, bOp, bR,
            thenBlock,
            elseBlock
        ] = ifMatch

        const ELSE = "ELSE_LINE"
        const END = "END_LINE"

        // first condition
        if (aOp === "==") emit(`JIN ${ELSE} ${aL} ${aR}`)
        else emit(`JIF ${ELSE} ${aL} ${aR}`)

        // second condition
        if (bOp === "==") emit(`JIN ${ELSE} ${bL} ${bR}`)
        else emit(`JIFV ${ELSE} ${bL} ${bR}`)

        compileBlock(thenBlock, emit)

        emit(`JMP ${END}`)
        const elseLine = line

        compileBlock(elseBlock, emit)
        const endLine = line

        return asm
            .map(l =>
                l.replace(ELSE, elseLine)
                 .replace(END, endLine)
            )
            .join("\n")
    }

    // no IF → compile line-by-line
    compileBlock(jsCode, emit)
    return asm.join("\n")
}

function compileBlock(block, emit) {
    const lines = block
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean)

    for (let i = 0; i < lines.length; ) {

        if (lines[i].startsWith("if")) {
            const res = compileSingleIf(lines, i, emit)
            if (!res) throw new Error("Invalid if syntax")

            i = res.nextIndex
            continue
        }

        compileStatement(lines[i], emit)
        i++
    }
}

function compileStatement(line, emit) {

    // var x
    let m = line.match(/^(let|var|const)\s+(\w+)\s*$/)
    if (m) {
        emit(`LOD ${m[2]} 0`)
        return
    }

    // let x = 5
    m = line.match(/^(let|var|const)\s+(\w+)\s*=\s*(\d+)$/)
    if (m) {
        emit(`LOD ${m[2]} ${m[3]}`)
        return
    }

    // let x = y
    m = line.match(/^(let|var|const)\s+(\w+)\s*=\s*(\w+)$/)
    if (m) {
        emit(`LVF ${m[2]} ${m[3]}`)
        return
    }

    if (m) {
        emit(`LOD ${m[1]} ${m[2]}`)
        return
    }

    // div = 5
    m = line.match(/^(\w+)\s*=\s*(\d+)$/)
    if (m) {
        emit(`LOD ${m[1]} ${m[2]}`)
        return
    }

    // div = otherVar
    m = line.match(/^(\w+)\s*=\s*(\w+)$/)
    if (m) {
        emit(`LVF ${m[1]} ${m[2]}`)
        return
    }

    // div += 1
    m = line.match(/^(\w+)\s*\+=\s*(\d+)$/)
    if (m) {
        emit(`ADD ${m[1]} ${m[2]}`)
        return
    }

    // div -= 1
    m = line.match(/^(\w+)\s*-=\s*(\d+)$/)
    if (m) {
        emit(`SUB ${m[1]} ${m[2]}`)
        return
    }

    // div *= 2
    m = line.match(/^(\w+)\s*\*=\s*(\d+)$/)
    if (m) {
        emit(`MUL ${m[1]} ${m[2]}`)
        return
    }

    // div /= 2
    m = line.match(/^(\w+)\s*\/=\s*(\d+)$/)
    if (m) {
        emit(`DIV ${m[1]} ${m[2]}`)
        return
    }

    // let x = a + b
    m = line.match(/^(let|var|const)\s+(\w+)\s*=\s*(\w+|\d+)\s*\+\s*(\w+|\d+)$/)
    if (m) {
        const [, , dst, a, b] = m

        if (!isNaN(a)) {
            emit(`LOD ${dst} ${a}`)
        } else {
            emit(`LVF ${dst} ${a}`)
        }

        emit(`ADD ${dst} ${b}`)
        return
    }

    // let x = a / b
    m = line.match(/^(let|var|const)\s+(\w+)\s*=\s*(\w+|\d+)\s*\/\s*(\w+)$/)
    if (m) {
        const [, , dst, a, b] = m

        if (!isNaN(a)) {
            emit(`LOD ${dst} ${a}`)
        } else {
            emit(`LVF ${dst} ${a}`)
        }

        emit(`DVF ${dst} ${b}`)
        return
    }

    throw new Error("Unsupported statement: " + line)
}


function compileSingleIf(lines, startIndex, emit) {
    const ifLine = lines[startIndex]

    const m = ifLine.match(/if\s*\(\s*(\w+)\s*(==|!=|<|>|<=|>=|&&)\s*(\w+|\d+)\s*\)\s*\{/)
    if (!m) return null

    const [, left, op, right] = m

    const body = []
    let i = startIndex + 1
    let depth = 1

    while (i < lines.length && depth > 0) {
        if (lines[i].includes("{")) depth++
        if (lines[i].includes("}")) depth--
        if (depth > 0) body.push(lines[i])
        i++
    }

    const END = "END_IF_" + emit.line

    if (op === "==") emit(`JIN ${END} ${left} ${right}`)
    else emit(`JIF ${END} ${left} ${right}`)

    compileBlock(body.join("\n"), emit)

    const endLine = emit.line

    for (let j = 0; j < emit.asm.length; j++) {
        emit.asm[j] = emit.asm[j].replace(END, endLine)
    }

    return { nextIndex: i }
}
