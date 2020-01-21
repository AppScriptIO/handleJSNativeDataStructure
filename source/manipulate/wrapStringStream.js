import Stream from 'stream'
import multistream from 'multistream'

/** wrap stream with delimeters (implementations using streams)
 **/
export async function wrapStringStream({ stream, beforeString, afterString }) {
  let beforeStream = new Stream.Readable()
  beforeStream.push(beforeString)
  beforeStream.push(null)
  let afterStream = new Stream.Readable()
  afterStream.push(afterString)
  afterStream.push(null)
  return multistream([beforeStream, stream, afterStream])
}
