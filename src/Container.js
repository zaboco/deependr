'use strict'

module.exports = makeContainer()

const StaticComponent = require('./components/StaticComponent')
const DynamicComponent = require('./components/DynamicComponent')
const MissingComponent = require('./components/MissingComponent')

function makeContainer() {
  return class Container {
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
      return this._getComponent(key).instantiate()
    }

    unwrap(key) {
      return this._getComponent(key).unwrap()
    }

    _getComponent(key) {
      return this.components[key] || new MissingComponent(key)
    }
  }
}
