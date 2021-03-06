'use strict'

const components = require('../src/components')
const Container = require('../src/Container')

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

  test('factory.predefinedFrom for nested path', () => {
    const implementations = {
      nested: {
        standard: context => context.value
      }
    }
    let factory = components.factory.predefinedFrom(implementations)
    let component = factory('nested.standard', { value: someValue })
    component.instantiate().should.equal(someValue)
  })

  test('link.boundTo', () => {
    let container = new Container({ value: someValue })
    let boundLink = components.link.boundTo(container)
    boundLink('value').instantiate().should.equal(someValue)
  })

  test('link.boundTo converts context to Container if needed', () => {
    let boundLink = components.link.boundTo({ value: someValue })
    boundLink('value').instantiate().should.equal(someValue)
  })
})
