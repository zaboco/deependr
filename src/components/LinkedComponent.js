'use strict'

module.exports = class LinkedComponent {
  constructor(container, targetKey) {
    this.container = container
    this.targetKey = targetKey
  }

  instantiate() {
    return this.container.get(this.targetKey)
  }

  unwrap() {
  }
}
