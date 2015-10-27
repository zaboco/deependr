'use strict'

const Container = require('../src/Container')
const components = require('../src/components')

suite('Container', () => {
  const someValue = 'some value'
  let container
  setup(() => {
    container = new Container()
  })

  suite('#store', () => {
    test('can store values', () => {
      container.store('value', someValue)
      container.get('value').should.equal(someValue)
    })

    test('stored value is accessible as getter accessor', () => {
      container.store('value', someValue)
      container.value.should.equal(someValue)
    })

    test('a value can be overridden', () => {
      const otherObject = {}
      container.store('value', someValue)
      container.store('value', otherObject)
      container.value.should.equal(otherObject)
    })

    test('returns the container itself', () => {
      let storeResult = container.store('value', someValue)
      storeResult.should.equal(container)
    })

    test('returns nothing when trying to access missing values', () => {
      should.not.exist(container.get('unknown'))
    })
  })

  suite('#define', () => {
    test('can define factories', () => {
      container.define('factory', () => someValue)
      container.get('factory').should.equal(someValue)
    })

    test('computed value is accessible as a getter accessor', () => {
      container.define('factory', () => someValue)
      container.factory.should.equal(someValue)
    })

    test('returns the container itself', () => {
      let storeResult = container.define('someFactory', () => {})
      storeResult.should.equal(container)
    })

    test('factories can use another container as context', () => {
      let context = new Container().store('value', someValue)
      container.define('factory', context => context.value, context)
      container.get('factory').should.equal(someValue)
    })

    test('context values can be set after the factory is defined', () => {
      let context = new Container()
      container.define('factory', context => context.value, context)
      context.store('value', someValue)
      container.get('factory').should.equal(someValue)
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
        .unwrap('factory').store('value', someValue)
      container.get('factory').should.equal(someValue)
    })

    test('returns the value itself for a value component', () => {
      container.store('value', someValue)
      container.unwrap('value').should.equal(someValue)
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
      container.store('value', someValue)
      container.unwrapPath('value').should.equal(someValue)
    })

    test('can access a path of two keys', () => {
      let context = new Container().store('value', someValue)
      container.define('factory', context => context.value, context)
      container.unwrapPath('factory.value').should.equal(someValue)
    })

    test('can access a path of three keys', () => {
      let bottomContext = new Container().store('value', someValue)
      let middleContext = new Container().define('nestedFactory', context => context.value, bottomContext)
      container.define('factory', context => context.nestedFactory, middleContext)
      container.unwrapPath('factory.nestedFactory.value').should.equal(someValue)
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
        container.store('value', someValue)
        container.link('valueLink', 'value')
        container.get('valueLink').should.equal(someValue)
      })

      test('for a factory call the target factory', () => {
        container.define('factory', () => someValue)
        container.link('factoryLink', 'factory')
        container.get('factoryLink').should.equal(someValue)
      })

      test('for a value unwraps to the value itself', () => {
        container.store('value', someValue)
        container.link('valueLink', 'value')
        container.unwrap('valueLink').should.equal(someValue)
      })

      test('for a factory unwraps to the factory`s context', () => {
        let context = new Container()
        container.define('factory', () => {}, context)
        container.link('factoryLink', 'factory')
        container.unwrap('factoryLink').should.equal(context)
      })

      test('can link recursively', () => {
        container.store('value', someValue)
        container.link('firstLink', 'value')
        container.link('secondLink', 'firstLink')
        container.get('secondLink').should.equal(someValue)
      })
    })

    suite('called from a factory context', () => {
      test('points to the component from the root container', () => {
        container.define('factory', context => context.value, new Container())
        container.store('topLevelValue', someValue)
        container.unwrap('factory').link('value', 'topLevelValue', container)
        container.get('factory').should.equal(someValue)
      })
    })
  })

  suite('#nest', () => {
    test('inserts another container into the current one', () => {
      let nestedContainer = new Container().set('value', someValue)
      container.nest('nested', nestedContainer)
      container.get('nested').get('value').should.equal(someValue)
    })

    test('unwrap nested container accesses the container itself', () => {
      container.nest('nested', new Container()).unwrap('nested').set('value', someValue)
      container.nested.value.should.equal(someValue)
    })
  })

  suite('#set', () => {
    test('a component', () => {
      container.set('value', components.value(someValue))
      container.get('value').should.equal(someValue)
    })

    test('will make a component out of a value', () => {
      container.set('value', someValue)
      container.get('value').should.equal(someValue)
    })

    test('will nest a container if a bare object is received', () => {
      container.set('nested', {
        value: components.value(someValue)
      })
      container.get('nested').get('value').should.equal(someValue)
    })
  })

  suite('constructor sets all received components', () => {
    test('for one level nesting', () => {
      let prefilledContainer = new Container({ value: someValue })
      prefilledContainer.get('value').should.equal(someValue)
    })

    test('for two level nesting', () => {
      let nestedContainer = new Container({ value: someValue })
      let prefilledContainer = new Container({
        nested: nestedContainer
      })
      prefilledContainer.get('nested').get('value').should.equal(someValue)
    })

    test('for two level nesting with plain object', () => {
      let prefilledContainer = new Container({
        nested: { value: someValue }
      })
      prefilledContainer.unwrapPath('nested.value').should.equal(someValue)
    })
  })
})
