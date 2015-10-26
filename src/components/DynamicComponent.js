'use strict'

module.exports = class DynamicComponent {
  constructor(factory, context) {
    this.factory = factory
    this.context = context
  }

  instantiate() {
    return this.factory(this.context)
  }
}
