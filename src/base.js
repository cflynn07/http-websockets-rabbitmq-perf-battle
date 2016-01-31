/**
 * @module src/base
 */
'use strict'

require('loadenv')()

const amqp = require('amqp')
const ioClient = require('socket.io-client')
const ioServer = require('socket.io')

class Base {
  constructor () {}

  _initWebsocketClient () {
    this._ws = ioClient([
      'ws://',
      process.env.PB_SERVER_HOST,
      ':',
      process.env.PB_SERVER_PORT
    ].join(''))
  }

  _initWebsocketServer () {
    this._wss = ioServer(process.env.PB_SERVER_PORT)
  }

  rabbitMQConnect () {
    this.connection = amqp.createConnection({
      host: process.env.PB_RABBITMQ_HOST,
      port: process.env.PB_RABBITMQ_PORT,
      login: process.env.PB_RABBITMQ_USERNAME,
      password: process.env.PB_RABBITMQ_PASSWORD,
      heartbeat: process.env.PB_RABBITMQ_HEARTBEAT,
      clientProperties: {
        applicationName: 'perf-battle'
      }
    })
  }
}

module.exports = Base
