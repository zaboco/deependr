'use strict'

module.exports = makeContainer()

const components = require('./components')

function makeContainer() {
  return class Container {
    constructor(components) {
      this.components = {}
      this.setAll(components)
    }

    setAll(components) {
      Object.keys(components || {}).forEach(key => {
        this.set(key, components[key])
      })
    }

    set(key, component) {
      return this._setComponent(key, components.coerce(component))
    }

    nest(key, container) {
      return this._setComponent(key, components.container(container))
    }

    store(key, value) {
      return this._setComponent(key, components.value(value))
    }

    define(key, factory, context) {
      return this._setComponent(key, components.factory(factory, context))
    }

    link(key, targetKey, context) {
      return this._setComponent(key, components.link(context || this, targetKey))
    }

    _setComponent(key, component) {
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

    unwrapPath(keysPath) {
      keysPath = keysPath || ''
      let keysChain = keysPath.split('.')
      return this._unwrapKeyChain(keysChain)
    }

    _unwrapKeyChain(keysChain) {
      let keysHead = keysChain[0], keysTail = keysChain.slice(1)
      let topLevelContext = this.unwrap(keysHead)
      if (keysChain.length === 1) {
        return topLevelContext
      } else {
        return topLevelContext._unwrapKeyChain(keysTail)
      }
    }

    unwrap(key) {
      return this._getComponent(key).unwrap()
    }

    _getComponent(key) {
      return this.components[key] || components.missing(key)
    }

    static coerce(container) {
      if (container instanceof Container) {
        return container
      } else {
        return new Container(container)
      }
    }
  }
}
