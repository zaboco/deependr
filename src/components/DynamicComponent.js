'use strict'

const Container = require('../Container')

module.exports = class DynamicComponent {
  constructor(factory, context) {
    this.factory = factory
    this.context = Container.coerce(context)
  }

  instantiate() {
    return this.factory(this.context)
  }

  unwrap() {
    return this.context
  }
}
