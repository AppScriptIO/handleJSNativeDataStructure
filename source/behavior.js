let hasOwnProperty = Object.prototype.hasOwnProperty

// prevents manipulating object's properties recursively
export function deepFreeze({ object, getPropertyImplementation = Object.getOwnPropertyNames }: { getPropertyImplementation: Object.getOwnPropertyNames | Object.getOwnPropertySymbols } = {}) {
  Object.freeze(object)

  let isFunction = typeof object === 'function'
  getPropertyImplementation(object).forEach(function(property) {
    if (
      hasOwnProperty.call(object, property) &&
      object[property] !== null &&
      (isFunction ? property !== 'caller' && property !== 'callee' && property !== 'arguments' : true) &&
      (typeof object[property] === 'object' || typeof object[property] === 'function') &&
      !Object.isFrozen(object[property])
    ) {
      deepFreeze({ object: object[property], getPropertyImplementation })
    }
  })

  return object
}

// function wrapper to set thisArg on target object methods.
export function bindAllMethod({ target /**target object holding the methods to bind */, thisArg }) {
  Object.keys(target).forEach(function(key) {
    target[key] = target[key].bind(thisArg)
  }, {})
  return target
}
