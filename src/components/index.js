'use strict'

const StaticComponent = require('./StaticComponent')
const DynamicComponent = require('./DynamicComponent')
const LinkedComponent = require('./LinkedComponent')

module.exports = {
  value: makeValueComponent
}

function makeValueComponent(value) {
  return new StaticComponent(value)
}
