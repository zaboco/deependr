'use strict'

module.exports = class Container {
  store(field, value) {
    this[field] = value
    return this
  }

  define(field, factory, context) {
    this[field] = factory(context)
    return this
  }

  get(field) {
    return this[field]
  }
}
