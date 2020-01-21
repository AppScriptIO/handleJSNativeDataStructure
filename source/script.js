import { removeUndefinedFromObject } from './removeUndefinedFromObject.js'

/** https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
function isObject(obj) {
  return obj && typeof obj === 'object';
}

const isArray = Array.isArray;

export function mergeDeep(...objects) {
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (isArray(pVal) && isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });
    return prev;
  }, {});
}


// TODO: Implement default values merge algorithm or Use `mergeNonexistentProperties` from Entity module to create a decorator method that assigns default values and makes checks outside the main scope of the target method.
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

