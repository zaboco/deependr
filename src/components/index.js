'use strict'

const isPlainObject = require('lodash.isplainobject')

const StaticComponent = require('./StaticComponent')
const DynamicComponent = require('./DynamicComponent')
const LinkedComponent = require('./LinkedComponent')
const ContainerComponent = require('./ContainerComponent')
const MissingComponent = require('./MissingComponent')

module.exports = {
  coerce,
  value: makeStaticComponent,
  factory: makeDynamicComponent,
  link: makeLinkedComponent,
  container: makeContainerComponent,
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

function makeContainerComponent(container) {
  return new ContainerComponent(container)
}

function makeMissingComponent(key) {
  return new MissingComponent(key)
}

function coerce(component) {
  switch (true) {
    case _isComponent(component):
      return component
    case isPlainObject(component):
      return makeContainerComponent(component)
    default:
      return makeStaticComponent(component)
  }
}

function _isComponent(component) {
  return component && component.instantiate && component.unwrap && true
}
