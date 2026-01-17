const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
let programCodeFile = (process.argv[2] == undefined) ? "./program.juv" : process.argv[2]
let line = 1
fs.readFile(programCodeFile, "utf8", (err, program) => {
    for (let i = 0; i <= 0; i++) {
        start()
    }
    if (program) {
        readline.question(`Do yo want to write a new program or to run the current program\n 1->run current program\n 2->write a new program\n`, value => {
            switch (value) {
                case `1`:
                    require(`./index`)
                    break
                case `2`:
                    fs.writeFileSync(programCodeFile, ``)
                    openWriter()
                    break
                default:
                    process.exit()
            }
        })
    } else {
        openWriter()
    }

    function start() {
        if (program) {
            readline.question(`Do yo want to write a new program or to run the current program\n 1->run current program\n 2->write a new program\n`, value => {
                switch (value) {
                    case `1`:
                        require(`./index`)
                        break
                    case `2`:
                        fs.writeFileSync(programCodeFile, ``)
                        openWriter()
                        break
                    default:
                        process.exit()
                }
            })
        } else {
            openWriter()
        }
    }

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
})

module.exports = programCodeFile