/**
 * @module src/rabbitmq-client
 */
'use strict'

const Base = require('./base')

const async = require('async')

const payload = 'a'.repeat(1024) // ~1kb payload
var exchangeClientToServer
var exchangeServerToClient
var queueServerResponse
var start

var count = 0
const limit = 5000

class RabbitMQClient extends Base {
  constructor () {
    super()
    this.rabbitMQConnect()
    async.series([
      (cb) => {
        this.connection.on('ready', () => {
          console.log('connection ready')
          cb()
        })
      },
      (cb) => {
        this.connection.exchange('client-to-server', {
          type: 'direct'
        }, (exchange) => {
          console.log('client-to-server exchange')
          exchangeClientToServer = exchange
          cb()
        })
      },
      (cb) => {
        this.connection.exchange('server-to-client', {
          type: 'direct'
        }, (exchange) => {
          console.log('server-to-client exchange')
          exchangeServerToClient = exchange
          cb()
        })
      },
      (cb) => {
        this.connection.queue('server-response', {
          durable: true,
          autoDelete: false
        }, (queue) => {
          console.log('queue server-response')
          queueServerResponse = queue
          cb()
        })
      },
      (cb) => {
        queueServerResponse.bind('server-to-client', 'server-to-client', () => {
          console.log('queue bound to "server-to-client" exchange')
          cb()
        })
      },
      (cb) => {
        console.log('subscribing to queueServerResponse')
        queueServerResponse.subscribe((message) => {
          console.log('received message from server', count)
          count++
          if (count < limit) {
            this._sendMessage()
          } else {
            let totalTime = new Date() - start
            console.log('total time', totalTime)
            console.log('average request time', totalTime / limit)
          }
        })
        cb()
      },
      (cb) => {
        console.log('publishing to "client-to-server" exchange')
        start = new Date()
        this._sendMessage()
        cb()
      }
    ])
  }

  _sendMessage () {
    exchangeClientToServer.publish('client-to-server', {
      payload: payload
    }, {
      deliveryMode: process.env.PB_RABBITMQ_DELIVERY_MODE
    })
  }
}

new RabbitMQClient()
