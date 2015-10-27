'use strict'

module.exports = class ContainerComponent {
  constructor(container) {
    this.container = container
  }

  instantiate() {
    return this.container
  }

  unwrap() {
    return this.container
  }
}
