/**
 * @module src/websocket-server
 */
'use strict'

const Base = require('./base')

const payload = 'a'.repeat(process.env.PB_PAYLOAD_BYTES) // ~1kb payload

var count = 0
const limit = 5000

var start

class WebsocketServer extends Base {
  constructor () {
    super()
    this._initWebsocketServer()
    this._wss.on('connection', (ws) => {
      console.log('connected')
      ws.on('message', (payload, cb) => {
        console.log('received message from client')
        cb(payload)
      })
    })
  }
}

new WebsocketServer()
