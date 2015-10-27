'use strict'

const Container = require('../Container')

module.exports = class LinkedComponent {
  constructor(container, targetKey) {
    this.container = Container.coerce(container)
    this.targetKey = targetKey
  }

  instantiate() {
    return this.container.get(this.targetKey)
  }

  unwrap() {
    return this.container.unwrap(this.targetKey)
  }
}
