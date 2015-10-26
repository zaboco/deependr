'use strict'

const StaticComponent = require('./components/StaticComponent')
const DynamicComponent = require('./components/DynamicComponent')

module.exports = class Container {
  constructor() {
    this.components = {}
  }

  store(field, value) {
    this.components[field] = new StaticComponent(value)
    this._defineGetter(field)
    return this
  }

  define(field, factory, context) {
    this.components[field] = new DynamicComponent(factory, context)
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
    return component.instantiate()
  }
}
