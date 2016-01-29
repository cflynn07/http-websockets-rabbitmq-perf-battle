/**
 * @module src/rabbitmq-server
 */
'use strict'

const Base = require('./base')

const async = require('async')

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
        this.connection.exchange('client-to-server', {}, (exchange) => {
          console.log('client-to-server exchange')
          exchangeClientToServer = exchange
          cb()
        })
      },
      (cb) => {
        this.connection.exchange('server-to-client', {}, (exchange) => {
          console.log('server-to-client exchange')
          exchangeServerToClient = exchange
          cb()
        })
      },
      (cb) => {
        this.connection.queue('client-message', { durable: true }, (queue) => {
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
          console.log('received message from client', message)
          exchangeServerToClient.publish('server-to-client', {from: 'server'})
        })
        cb()
      },
    ])
  }
}

new RabbitMQServer()
