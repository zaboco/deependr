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
})
