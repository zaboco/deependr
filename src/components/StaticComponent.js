'use strict'

module.exports = class StaticComponent {
  constructor(value) {
    this.value = value
  }

  instantiate() {
    return this.value
  }

  unwrap() {
    return this.value
  }
}
