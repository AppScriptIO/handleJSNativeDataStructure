// import assert from 'assert'
import path from 'path'
import { assert } from 'chai'
import stream from 'stream'
const DuplexStream = stream.Duplex
import filesystem from 'fs'
import deleteModule from 'del'
import { streamToString } from './entrypoint.js'

describe('function streamToString: ', function() {
  describe('Convert a stream to string', function() {
    const streamData = 'xyz'
    it('Should create a string', async function() {
      let streamVariable = new DuplexStream()
      let string = streamToString(streamVariable)
      streamVariable.push(streamData)
      streamVariable.push(null)
      assert.isString(await string)
      assert.equal(await string, streamData)
    })
    it('Should encode data', async function() {
      let streamVariable = new DuplexStream(),
        encodingType = 'hex',
        encodedStreamData = Buffer.from(streamData).toString(encodingType) // encode string
      let string = streamToString(streamVariable, encodingType)
      streamVariable.push(streamData)
      streamVariable.push(null)
      assert.isString(await string)
      assert.equal(await string, encodedStreamData)
    })
  })
})
