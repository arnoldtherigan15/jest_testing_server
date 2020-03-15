const app = require('../app')
const http = require('http')
const server = http.createServer(app) // instance dari http
// instance akan di reuse 

server.listen(process.env.PORT, () => {
  console.log('listening ON PORT ' + process.env.PORT)
})