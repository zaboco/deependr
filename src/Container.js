'use strict'

const StaticComponent = require('./components/StaticComponent')
const DynamicComponent = require('./components/DynamicComponent')
const MissingComponent = require('./components/MissingComponent')

module.exports = class Container {
  constructor() {
    this.components = {}
  }

  store(key, value) {
    this.components[key] = new StaticComponent(value)
    this._defineGetter(key)
    return this
  }

  define(key, factory, context) {
    this.components[key] = new DynamicComponent(factory, context)
    this._defineGetter(key)
    return this
  }

  _defineGetter(key) {
    Object.defineProperty(this, key, {
      get: () => this.get(key),
      configurable: true
    })
  }

  get(key) {
    let component = this.components[key] || new MissingComponent(key)
    return component.instantiate()
  }
}
