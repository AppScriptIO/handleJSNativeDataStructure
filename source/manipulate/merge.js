import assert from 'assert'
import merge from 'deepmerge' // used for merging first level argument array by index.
import { merge as merge2, concatArrays } from 'merge-anything' // used to merge nested objects, and it preserves special instance prototypes (i.e. non Object prototypes) during merging.
import { removeUndefinedFromObject } from './removeUndefined.js'
const hasOwnProperty = Object.prototype.hasOwnProperty // allows supporting objects delefating null.
const isArray = Array.isArray
const isObject = obj => obj && typeof obj === 'object'

/** https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
export function mergeDeep(...objects) {
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key]
      const oVal = obj[key]

      if (isArray(pVal) && isArray(oVal)) {
        prev[key] = pVal.concat(...oVal)
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal)
      } else {
        prev[key] = oVal
      }
    })
    return prev
  }, {})
}

// Merge default values into passed arguments (1 level object merge) - this function is used as a pattern to set default parameters and make them accessible to latter/following decorator functions that wrap the target method.
export function mergeDefaultParameter({ defaultArg, passedArg }) {
  let loopLength = Math.max(defaultArg.length, passedArg.length)
  for (let index = 0; index < loopLength; index++) {
    if (typeof passedArg[index] == 'object' && typeof defaultArg[index] == 'object') {
      passedArg[index] = Object.assign(defaultArg[index], passedArg[index] |> removeUndefinedFromObject)
    } else if (!passedArg[index]) {
      passedArg[index] = defaultArg[index]
    } else {
      passedArg[index] = passedArg[index]
    }
  }
  return passedArg
}

// set properties only if they do not exist on the target object. Not using `Object.enteries` because it ignores symbols as keys.
export const mergeNonexistentProperties = (targetObject, defaultValue: Object) => {
  // Important: for loops do not support symbol keys iteration, therefore keys, therefore a different approach is taken.
  let propertyKey = [...Object.getOwnPropertySymbols(defaultValue), ...Object.getOwnPropertyNames(defaultValue)]
  let propertyDescriptor = Object.getOwnPropertyDescriptors(defaultValue)
  propertyKey.forEach(key => {
    if (!hasOwnProperty.call(targetObject, key)) Object.defineProperty(targetObject, key, propertyDescriptor[key])
  })
}

// supports multiple nested properties (property path array)
export const mergeOwnNestedProperty = ({ target, propertyPath, value }: { propertyPath: Array | String /*Property path*/ }) => {
  assert(propertyPath, '• `propertyPath` must be passed.')

  if (!Array.isArray(propertyPath)) propertyPath = [propertyPath]
  let targetProperty = target
  for (let index in propertyPath) {
    if (!hasOwnProperty.call(targetProperty, propertyPath[index])) {
      // create property path recusively
      Object.defineProperty(targetProperty, propertyPath[index], { enumerable: true, writable: true, value: {} })
    }
    targetProperty = targetProperty[propertyPath[index]]
  }
  Object.assign(targetProperty, value)
  return target
}

// plugin to `deepmerge` package for array merging
const concatinateArrayMerge = (defaultList, overridingList, options) => {
  const destination = defaultList.slice() // create a shallow copy if manipulation of target is not required
  destination.concat(overridingList)
  return destination
}
// plugin to `deepmerge` package for array merging
const combineArrayMerge = (defaultList, overridingList, options) => {
  const destination = defaultList.slice() // create a shallow copy if manipulation of target is not required
  overridingList.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      // Note: Using `deepmerge` module for nested objects merging will not preserve the prototypes of special objects (instances of classes).
      // destination[index] = merge(defaultList[index], item, { arrayMerge: concatinateArrayMerge })

      // using `merge-anything` module will preserve special instance prototypes, and merge only regular objects.
      destination[index] = merge2(
        { extensions: [concatArrays] }, // pass your extensions like so
        defaultList[index],
        item,
      )
    } else if (defaultList.indexOf(item) === -1) {
      destination.push(item)
    }
  })
  return destination
}
/** Merge arguments array with merging the items recursively:
 * The arguments array will combined/merged by index.
 * Items of the arguments array will be merged recursively:
      - Objects will be merged (similar to Object.assign). 
      - Arrays will be concatenated (added to each other, not combined by index).

  See examples From https://www.npmjs.com/package/deepmerge
 */
const deepMergeArgumentArray = ({ overridingArray, defaultArray /** arguments used as default */ }) => {
  // merge arguments with default parameters
  return merge(defaultArray /** default objects must not be manipulated */, overridingArray, { arrayMerge: combineArrayMerge }) // => [{ a: true, b: true }, 'ah yup']
}

/**
 * Merge argument lists
 * @param targetArgArray the list to be manipulated
 * @param defaultArgumentListArray array of argumnet lists
 */
export function deepMergeParameter(targetArgArray, ...defaultArgumentListArray) {
  for (let defaultArray of defaultArgumentListArray) targetArgArray = deepMergeArgumentArray({ overridingArray: targetArgArray, defaultArray })
  return targetArgArray
}

// add base object to target object without overwriting existing properties.
export function shallowMergeNonExistingPropertyOnly({ targetObject, baseObject }) {
  return Object.keys(baseObject).reduce(function(accumulator, key) {
    if (!accumulator[key]) accumulator[key] = baseObject[key]
    return accumulator
  }, targetObject)
}
