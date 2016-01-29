/**
 * @module src/base
 */
'use strict'

require('loadenv')()

const amqp = require('amqp')

class Base {
  constructor () {}

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
