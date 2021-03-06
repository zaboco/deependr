# Deependr
Dependency injection with nested contexts.

### Installation
> assumes node `> v4.0.0`

```sh
npm i --save deependr
```

### Basic Usage
```js
const deependr = require('deependr')
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

```

> See also [`test/usecase.test`](test/usecase.test.js) for a more complex example

### TODO
- [ ] simplify API
    + [ ] remove `unwrapPath` and make `unwrap` generic
    + [ ] make `set` and `get` accept nested paths
    + [ ] maybe remove `store`, `define`, `link` if `set` is enough
- [ ] write API docs 
- [ ] make contexts lazy
- [ ] add CI