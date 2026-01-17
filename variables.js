class Variables {
    #variables = []

    createVariable(name, value) {
        const isVariableExist = this.#getVariable(name)

        if (isVariableExist == undefined) {
            const variable = {
                name: name,
                value: value
            }

            this.#variables.push(variable)
        } else {
            this.setValue(name, value)
        }

        
    }

    getValue(name) {
        return this.#getVariable(name).value
    }

    #getVariable(name) {
        return this.#variables.find(variable => variable.name === name)
    }

    setValue(name, value) {
        this.#getVariable(name).value = value
    }
}

module.exports = Variables