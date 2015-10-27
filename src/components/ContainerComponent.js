'use strict'

const Container = require('../Container')

module.exports = class ContainerComponent {
  constructor(container) {
    this.container = Container.coerce(container)
  }

  instantiate() {
    return this.container
  }

  unwrap() {
    return this.container
  }
}
