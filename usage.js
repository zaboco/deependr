'use strict'

const deependr = require('.')
const components = deependr.components

let globals = deependr.container({
  globalValue: 'some global value'
})

let container = deependr.container({
  value: 'some value',
  computedValue: components.factory(context => context.innerValue, {
    innerValue: 'some inner value'
  }),
  referenceValue: components.link(globals, 'globalValue'),
  nestedContainer: {
    nestedValue: 'some nested value'
  }
})

console.log(container.value) // 'some value'
console.log(container.computedValue) // 'some inner value'
console.log(container.referenceValue) // 'some global value'
console.log(container.nestedContainer.nestedValue) // 'some nested value'

container.unwrapPath('computedValue').set('innerValue', 'other inner value')
console.log(container.computedValue) // 'other inner value'
