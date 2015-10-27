'use strict'

const Container = require('./src/Container')

exports.container = makeContainer
exports.components = require('./src/components')

function makeContainer(components) {
  return new Container(components)
}
