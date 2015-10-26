'use strict'

module.exports = class Container {
  store(field, value) {
    this[field] = value
    return this
  }

  get(field) {
    return this[field]
  }
}
