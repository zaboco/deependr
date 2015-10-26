'use strict'

const Container = require('../src/Container')

suite('Container', () => {
  test('exists', () => {
    should.exist(Container)
  })

  const someObject = {}
  let container
  suite('#store', () => {
    setup(() => {
      container = new Container()
    })

    test('can store values', () => {
      container.store('value', someObject)
      container.get('value').should.equal(someObject)
    })

    test('stored value is accessible as getter accessor', () => {
      container.store('value', someObject)
      container.value.should.equal(someObject)
    })

    test('a value can be overridden', () => {
      const otherObject = {}
      container.store('value', someObject)
      container.store('value', otherObject)
      container.value.should.equal(otherObject)
    })

    test('returns the container itself', () => {
      let storeResult = container.store('value', someObject)
      storeResult.should.equal(container)
    })
  })

  suite('#define', () => {
    setup(() => {
      container = new Container()
    })

    test('can define factories', () => {
      container.define('factory', () => someObject)
      container.get('factory').should.equal(someObject)
    })

    test('computed value is accessible as a getter accessor', () => {
      container.define('factory', () => someObject)
      container.factory.should.equal(someObject)
    })

    test('returns the container itself', () => {
      let storeResult = container.define('someFactory', () => {})
      storeResult.should.equal(container)
    })

    test('factories can use another container as context', () => {
      let context = new Container().store('value', someObject)
      container.define('factory', context => context.value, context)
      container.get('factory').should.equal(someObject)
    })

    test('context values can be set after the factory is defined', () => {
      let context = new Container()
      container.define('factory', context => context.value, context)
      context.store('value', someObject)
      container.get('factory').should.equal(someObject)
    })
  })
})
