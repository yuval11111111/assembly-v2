const fs = require('fs');
let programCodeFile = (process.argv[2] == undefined) ? "./program.juv" : process.argv[2]

if (fs.existsSync(programCodeFile)) {
    console.log("Found program file:", programCodeFile)
    module.exports = {programCodeFile}
    require("./index")
} else {
    module.exports = {programCodeFile}
    require("./console")
}

