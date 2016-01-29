/**
 * @module src/rabbitmq-server
 */
'use strict'

const Base = require('./base')

const async = require('async')

const payload = 'a'.repeat(1024) // ~1kb payload

class RabbitMQServer extends Base {
  constructor () {
    super()
    this.rabbitMQConnect()

    var exchangeClientToServer
    var exchangeServerToClient
    var queueClientMessage

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
        this.connection.queue('client-message', {
          durable: true,
          autoDelete: false
        }, (queue) => {
          console.log('queue client-message')
          queueClientMessage = queue
          cb()
        })
      },
      (cb) => {
        queueClientMessage.bind('client-to-server', 'client-to-server', () => {
          console.log('queue bound to "client-to-server" exchange')
          cb()
        })
      },
      (cb) => {
        console.log('subscribing to queueClientMessage')
        queueClientMessage.subscribe((message) => {
          console.log('received message from client')
          exchangeServerToClient.publish('server-to-client', {
            payload: payload
          }, {
            deliveryMode: process.env.PB_RABBITMQ_DELIVERY_MODE
          })
        })
        cb()
      },
    ])
  }
}

new RabbitMQServer()
