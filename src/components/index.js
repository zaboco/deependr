'use strict'

const StaticComponent = require('./StaticComponent')
const DynamicComponent = require('./DynamicComponent')
const LinkedComponent = require('./LinkedComponent')
const MissingComponent = require('./MissingComponent')

module.exports = {
  coerce,
  value: makeStaticComponent,
  factory: makeDynamicComponent,
  link: makeLinkedComponent,
  missing: makeMissingComponent
}

function makeStaticComponent(value) {
  return new StaticComponent(value)
}

function makeDynamicComponent(factory, context) {
  return new DynamicComponent(factory, context)
}

function makeLinkedComponent(context, targetKey) {
  return new LinkedComponent(context, targetKey)
}

function makeMissingComponent(key) {
  return new MissingComponent(key)
}

function coerce(component) {
  return _isComponent(component) ?
    component :
    makeStaticComponent(component)
}

function _isComponent(component) {
  return component && component.instantiate && component.unwrap
}
