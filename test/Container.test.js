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

    test('returns nothing when trying to access missing values', () => {
      should.not.exist(container.get('unknown'))
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

    test('assumes empty context if none given', () => {
      container.define('factory', context => context.value)
      container.get.bind(container, 'factory').should.not.throw
    })
  })

  suite('#unwrap', () => {
    test('extracts the context from a factory component', () => {
      let context = new Container()
      container.define('factory', context => context.value, context)
      container.unwrap('factory').should.equal(context)
    })

    test('modifying the extracted context works', () => {
      container
        .define('factory', context => context.value, new Container())
        .unwrap('factory').store('value', someObject)
      container.get('factory').should.equal(someObject)
    })

    test('returns the value itself for a value component', () => {
      container.store('value', someObject)
      container.unwrap('value').should.equal(someObject)
    })

    test('returns nothing for a missing component', () => {
      should.not.exist(container.unwrap('unknown'))
    })
  })
})
