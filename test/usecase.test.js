'use strict'

const Container = require('../src/Container')
const components = require('../src/components')

function SimpleLogger(prompt) {
  return function log(value) {
    return `${prompt}: ${value}`
  }
}

function ActionLogger(prompt, modifier, description) {
  return function logAction(value) {
    let modifiedValue = modifier(value)
    return `${prompt}: ${modifiedValue} is ${value} after ${description}`
  }
}

function Multiplier(factor) {
  return function multiply(number) {
    return number * factor
  }
}

function Incrementer() {
  return function increment(number) {
    return number + 1
  }
}

const implementations = {
  loggers: {
    Simple: $ => SimpleLogger($.prompt),
    Action: $ => ActionLogger($.prompt, $.modifier, $.description)
  },
  modifiers: {
    Multiplier: $ => Multiplier($.factor),
    Incrementer: () => Incrementer()
  }
}

const $$ = components.factory.predefinedFrom(implementations)
suite('Container: use case', () => {
  test('simple logger', () => {
    let container = new Container({
      logger: $$('loggers.Simple', { prompt: '$' })
    })
    container.logger(2).should.equal('$: 2')
  })

  suite('action logger', () => {
    let container
    setup(() => {
      container = new Container({
        logger: $$('loggers.Action', {
          prompt: '$',
          modifier: $$('modifiers.Incrementer'),
          description: 'incrementing'
        })
      })
    })

    test('applies incrementer', () => {
      container.logger(2).should.equal('$: 3 is 2 after incrementing')
    })

    test('can change incrementer with multiplier', () => {
      container.unwrap('logger')
        .set('modifier', $$('modifiers.Multiplier', { factor: 2 }))
        .set('description', 'multiplying')
      container.logger(2).should.equal('$: 4 is 2 after multiplying')
    })
  })

  test('multiple loggers with linked prompt', () => {
    let container = new Container({
      prompt: '$',
      simpleLogger: $$('loggers.Simple'),
      multiplierLogger: $$('loggers.Action', {
        modifier: $$('modifiers.Multiplier', { factor: 2 }),
        description: 'multiplying'
      }),
      incrementingLogger: $$('loggers.Action', {
        modifier: $$('modifiers.Incrementer'),
        description: 'incrementing'
      })
    })
    container.unwrap('simpleLogger').link('prompt', 'prompt', container)
    container.unwrap('multiplierLogger').link('prompt', 'prompt', container)
    container.unwrap('incrementingLogger').link('prompt', 'prompt', container)
    container.simpleLogger(10).should.equal('$: 10')
    container.multiplierLogger(10).should.equal('$: 20 is 10 after multiplying')
    container.incrementingLogger(10).should.equal('$: 11 is 10 after incrementing')
  })

  test('multiple loggers with bound linked prompt', () => {
    let boundLink = components.link.boundTo({ prompt: '$' })

    let container = new Container({
      simpleLogger: $$('loggers.Simple', { prompt: boundLink('prompt') }),
      incrementingLogger: $$('loggers.Action', {
        prompt: boundLink('prompt'),
        modifier: $$('modifiers.Incrementer'),
        description: 'incrementing'
      })
    })
    container.simpleLogger(10).should.equal('$: 10')
    container.incrementingLogger(10).should.equal('$: 11 is 10 after incrementing')
  })
})
