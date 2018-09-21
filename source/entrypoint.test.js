// import assert from 'assert'
import path from 'path'
import { assert } from 'chai'
import configuration from '../setup/configuration'
import { mergeDeep } from './entrypoint.js'

describe('function mergeDeep: ', function() {
    describe('merge objects properties', function() {
        it('Should return an object with all properties of input objects', function() {
            let actual = mergeDeep({x:'1'}, {y:'2', t:'2.1'}, {z:'3'}),
                expected = { x:'1', y:'2', t:'2.1', z:'3' }
            assert.deepEqual(actual, expected)
        })
        it('Should not modify input objects', function() {
            let object1 = {x:'1'},
                object2 = {y:'2', t:'2.1'},
                object3 = {z:'3'}
            mergeDeep(object1, object2, object3)
            assert.deepEqual(object1, {x:'1'})
            assert.deepEqual(object2, {y:'2', t:'2.1'})
            assert.deepEqual(object3, {z:'3'})
        })
    })
})

