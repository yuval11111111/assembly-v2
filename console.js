const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const {programCodeFile} = require("./start.js")


let line = 1

function openWriter() {
    readline.question(`${line})`, value => {
        if (value.toLowerCase() !== `close`) {
            fs.readFile(programCodeFile, "utf8", (err, program) => {
                let Code = (!program) ? `` : program + `\n`
                fs.writeFileSync(programCodeFile, Code + value)
            })
            line = line + 1
            openWriter()
        }
        else {
            readline.close()
            require(`./index`)
        }
    })
}

openWriter()