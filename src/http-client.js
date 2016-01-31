/**
 * @module src/http-client
 */
'use strict'

require('loadenv')()

const http = require('http')
const queryString = require('querystring')

const payload = 'a'.repeat(process.env.PB_PAYLOAD_BYTES) // ~1kb payload

var count = 0
const limit = 5000

var postData = queryString.stringify({
  'payload' : payload
});

var options = {
  host: process.env.PB_SERVER_HOST,
  port: process.env.PB_SERVER_PORT,
  method: 'POST',
  headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
};

function makeRequest() {
  var req = http.request(options, (res) => {
    res.setEncoding('utf8');
    var data = ''
    res.on('data', (chunk) => {
      data += chunk.toString()
    });
    res.on('end', () => {
      console.log('response received', count)
      count++
      if (count < limit) {
        makeRequest()
      } else {
        let totalTime = new Date() - start
        console.log('total time', totalTime)
        console.log('average RTT', totalTime / limit)
      }
    })
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.write(postData);
  req.end();
}

const start = new Date()
makeRequest()
