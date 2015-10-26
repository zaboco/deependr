'use strict'

const StaticComponent = require('./components/StaticComponent')
const DynamicComponent = require('./components/DynamicComponent')
const MissingComponent = require('./components/MissingComponent')

module.exports = class Container {
  constructor() {
    this.components = {}
  }

  store(key, value) {
    return this._addComponent(key, new StaticComponent(value))
  }

  define(key, factory, context) {
    return this._addComponent(key, new DynamicComponent(factory, context))
  }

  _addComponent(key, component) {
    this.components[key] = component
    return this._defineGetter(key)
  }

  _defineGetter(key) {
    return Object.defineProperty(this, key, {
      get: () => this.get(key),
      configurable: true
    })
  }

  get(key) {
    let component = this.components[key] || new MissingComponent(key)
    return component.instantiate()
  }
}
