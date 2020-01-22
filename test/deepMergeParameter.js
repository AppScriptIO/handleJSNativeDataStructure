import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import { deepMergeParameter } from '../source/manipulate/merge.js'

suite('Deep merge arguments lists', () => {
  {
    const argumentList1 = [
        {
          data: { v2: 'v2' },
        },
      ],
      argumentList2 = [
        {
          data: { v1: 'x' },
        },
      ]
    let merged = deepMergeParameter(
      [{ data: { v1: 'v1' } }], // overriding argument list.
      // default value array
      argumentList1,
      // default value array
      argumentList2,
    )

    test('merged argument list must create a new argument list with merged values, but not overriden', () => {
      chaiAssertion.deepEqual(merged, [{ data: { v1: 'v1', v2: 'v2' } }], `• Arguments were not merged properly.`)
    })
  }
  {
    class Class {
      constructor(object) {
        Object.assign(this, object)
      }
    }
    const prototype = { label: 'prototype' }
    let argumentWithPrototype1 = Object.assign(Object.create(prototype), { v2: 'v2' })
    let argumentWithPrototype2 = new Class({ v3: 'v3' })
    const argumentList1 = [
        {
          other1: argumentWithPrototype1,
          other2: { nested: argumentWithPrototype2 },
        },
      ],
      argumentList2 = [
        {
          data: { v2: 'v2' },
        },
      ]
    let merged = deepMergeParameter(
      [{ data: { v1: 'v1' } }], // overriding argument list.
      // default value array
      argumentList1,
      // default value array
      argumentList2,
    )

    // console.log(merged[0].other1 |> Object.getPrototypeOf)
    // console.log(argumentWithPrototype1 |> Object.getPrototypeOf)
    test('Should preserve prototype delegation', () => {
      assert((merged[0].other1 |> Object.getPrototypeOf) === (argumentWithPrototype1 |> Object.getPrototypeOf), `• Prototype doesn't match for object created with Object.create.`)
      assert((merged[0].other2.nested |> Object.getPrototypeOf) === (argumentWithPrototype2 |> Object.getPrototypeOf), `• Prototype doesn't match for class instance.`)
    })
  }
})
