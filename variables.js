class Variables {
    #vars = new Map()

    createVariable(name, value) {
        this.#vars.set(name, value)
    }

    getValue(name) {
        return this.#vars.get(name)
    }

    setValue(name, value) {
        this.#vars.set(name, value)
    }
}

module.exports = Variables