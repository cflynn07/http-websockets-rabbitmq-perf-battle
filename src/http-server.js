/**
 * @module src/http-server
 */
'use strict'

require('loadenv')()

const http = require('http')

var server = http.createServer((req, res) => {
  console.log('received request from client')
  var body = ''
  req.on('data', (chunk) => {
    body += chunk.toString()
  })
  req.on('end', () => {
    res.writeHead(200, 'OK', {'Content-Type': 'text/html'})
    res.write(body)
    res.end()
  })
})

server.listen(process.env.PB_SERVER_PORT, () => {
  console.log('server listening')
})
