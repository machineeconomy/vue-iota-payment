var paymentModule = require('iota-payment')
var express = require('express')
var app = express()
const port = process.env.PORT
const path = require('path');


var options = {
    mount: '/payments',
    value: 0,
    websockets: true
    // ...
}

let server = paymentModule.createServer(app, options)

app.use('/dist', express.static('../dist'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Start server with iota-payment module on '/custom'
server.listen(port, function () {
    console.log(`Server started on port: ${port} `)
})
