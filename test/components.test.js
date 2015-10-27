'use strict'

const components = require('../src/components')

suite('components', () => {
  const someValue = 'some value'
  test('factory.predefinedFrom', () => {
    const implementations = {
      standard: context => context.value
    }
    let factory = components.factory.predefinedFrom(implementations)
    let component = factory('standard', { value: someValue })
    component.instantiate().should.equal(someValue)
  })
})
