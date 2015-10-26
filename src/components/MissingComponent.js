'use strict'

module.exports = class MissingComponent {
  constructor(key) {
    this.key = key
  }

  instantiate() {
    throw Error(`Component ${this.key} was not found`)
  }
}
