"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeDeep = mergeDeep;

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

function mergeDeep(...objects) {
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