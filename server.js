const express = require('express');
var app = express();

app.use(express.static('public'))

var server = app.listen(3000);

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.on('echo', (msg, callback) => {
    callback(msg);
  });
});
