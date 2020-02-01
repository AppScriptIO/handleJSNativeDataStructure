// import assert from 'assert'
import path from 'path'
import { assert } from 'chai'
import configuration from '../setup/configuration'
import { parseKeyValuePairSeparatedBySymbolConcatenatedString, parseKeyValuePairSeparatedBySymbolFromArray, combineKeyValueObjectIntoString } from '../source/parse.js'
const assetFolder = path.join(configuration.directory.application.containerAbsolutePath, 'test/asset')

describe('function parseKeyValuePairSeparatedBySymbolConcatenatedString: ', function() {
    describe('string input containing key-value pairs', function() {
        it('Should parse/detect key value pairs', function() {
            let parsed = parseKeyValuePairSeparatedBySymbolConcatenatedString({ string: 'x=1 y=2 z t=3' }),
                expected = { x: '1', y: '2', t: '3' }
                assert.deepEqual(parsed, expected)
        })
    })
})

describe('function parseKeyValuePairSeparatedBySymbolFromArray: ', function() {
    describe('array input containing key-value pairs', function() {
        it('Should parse/detect key value pairs separated by a specific symbol', function() {
            let parsed = parseKeyValuePairSeparatedBySymbolFromArray({ array: [ 'x_1', 'y_2', 't_3' ], separatingSymbol: '_' }),
                expected = { x: '1', y: '2', t: '3' }
                assert.deepEqual(parsed, expected)
        })
    })
})

describe('function combineKeyValueObjectIntoString: ', function() {
    describe('Convert object to string with key-value separated structure', function() {
        it('Should encode object into string', function() {
            let actual = combineKeyValueObjectIntoString({ object: { x: '1', y: '2', t: '3' }, separatingSymbol: '_' }),
                expected = 'x_1 y_2 t_3'
            assert.equal(actual, expected)
        })
    })
})


