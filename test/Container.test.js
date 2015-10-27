'use strict'

const Container = require('../src/Container')
const components = require('../src/components')

suite('Container', () => {
  const someObject = {}
  let container
  setup(() => {
    container = new Container()
  })

  suite('#store', () => {
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

    test('returns nothing key is not provided', () => {
      should.not.exist(container.unwrap())
    })
  })

  suite('#unwrapPath', () => {
    test('acts like unwrap if given a one-key path', () => {
      container.store('value', someObject)
      container.unwrapPath('value').should.equal(someObject)
    })

    test('can access a path of two keys', () => {
      let context = new Container().store('value', someObject)
      container.define('factory', context => context.value, context)
      container.unwrapPath('factory.value').should.equal(someObject)
    })

    test('can access a path of three keys', () => {
      let bottomContext = new Container().store('value', someObject)
      let middleContext = new Container().define('nestedFactory', context => context.value, bottomContext)
      container.define('factory', context => context.nestedFactory, middleContext)
      container.unwrapPath('factory.nestedFactory.value').should.equal(someObject)
    })

    test('returns nothing for empty path', () => {
      should.not.exist(container.unwrapPath(''))
    })

    test('returns nothing if path is not provided', () => {
      should.not.exist(container.unwrapPath())
    })
  })

  suite('#link', () => {
    suite('called from container', () => {
      test('for a value returns the target value', () => {
        container.store('value', someObject)
        container.link('valueLink', 'value')
        container.get('valueLink').should.equal(someObject)
      })

      test('for a factory call the target factory', () => {
        container.define('factory', () => someObject)
        container.link('factoryLink', 'factory')
        container.get('factoryLink').should.equal(someObject)
      })

      test('for a value unwraps to the value itself', () => {
        container.store('value', someObject)
        container.link('valueLink', 'value')
        container.unwrap('valueLink').should.equal(someObject)
      })

      test('for a factory unwraps to the factory`s context', () => {
        let context = new Container()
        container.define('factory', () => {}, context)
        container.link('factoryLink', 'factory')
        container.unwrap('factoryLink').should.equal(context)
      })

      test('can link recursively', () => {
        container.store('value', someObject)
        container.link('firstLink', 'value')
        container.link('secondLink', 'firstLink')
        container.get('secondLink').should.equal(someObject)
      })
    })

    suite('called from a factory context', () => {
      test('points to the component from the root container', () => {
        container.define('factory', context => context.value, new Container())
        container.store('topLevelValue', someObject)
        container.unwrap('factory').link('value', 'topLevelValue', container)
        container.get('factory').should.equal(someObject)
      })
    })
  })

  suite('#set', () => {
    test('a component', () => {
      container.set('value', components.value(someObject))
      container.get('value').should.equal(someObject)
    })

    test('will make a component otu of a value', () => {
      container.set('value', someObject)
      container.get('value').should.equal(someObject)
    })
  })
})
