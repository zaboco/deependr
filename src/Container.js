'use strict'

module.exports = class Container {
  constructor() {
    this.components = {}
  }

  store(field, value) {
    this.components[field] = { value, type: 'value' }
    this._defineGetter(field)
    return this
  }

  define(field, factory, context) {
    this.components[field] = { factory, context, type: 'factory' }
    this._defineGetter(field)
    return this
  }

  _defineGetter(field) {
    Object.defineProperty(this, field, {
      get: () => this.get(field),
      configurable: true
    })
  }

  get(field) {
    let component = this.components[field]
    if (component.type === 'value') {
      return component.value
    } else {
      return component.factory(component.context)
    }
  }
}
