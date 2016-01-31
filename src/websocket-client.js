/**
 * @module src/websocket-client
 */
'use strict'

const Base = require('./base')

const payload = 'a'.repeat(process.env.PB_PAYLOAD_BYTES) // ~1kb payload

var count = 0
const limit = 5000

var start

class WebsocketClient extends Base {
  constructor () {
    super()
    this._initWebsocketClient()
    start = new Date()
    this._sendMessage()
  }

  _sendMessage () {
    this._ws.emit('message', {
      payload: payload
    }, (responseData) => {
      console.log('Response from server #', count)
      count++
      if (count < limit) {
        this._sendMessage()
      } else {
        let totalTime = new Date() - start
        console.log('total time', totalTime)
        console.log('average RTT', totalTime / limit)
      }
    })
  }
}

new WebsocketClient()
