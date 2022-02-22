const express = require('express');
var app = express();

app.use(express.static('public'))

var server = app.listen(3000);

var io = require('socket.io')(server);

////////////////////////////////////////////////////////////////////////////////

var players = {};

io.on('connection', function (socket) {
  var playerID;

  socket.on('join', function (name, callback) {

    if (arguments.length != 2) {
      socket.emit('error', { type: 'InvalidArgumentException', text: `'join' requires a single parameter. Recieved ${arguments.length}.` });

      return;
    }

    if (typeof name != 'string' || (typeof name == 'object' && name instanceof String)) {
      socket.emit('error', { type: 'InvalidArgumentException', text: `Parameter 'name' is not of type number, but of ${typeof name}` });

      return;
    }

    if (typeof callback != 'function') {
      socket.emit('error', { type: 'InvalidArgumentException', text: `Parameter 'callback' is not of type function, but of ${typeof name}` });

      return;
    }

    const id = "player_" + generateID();

    players[id] = { name, socket, id, position: { x: 0, y: 0 } };

    playerID = id;

    callback({ id: playerID });
  });

  socket.on('look', callback => {
    if (!playerID) return;

    callback({
      players: getPlayers()
    });
  });

  socket.on('move', position => {
    if (!playerID) return;

    players[playerID].position.x = position.x;
    players[playerID].position.y = position.y;
  });

  socket.on('disconnect', callback => {
    if (!playerID) return;

    delete players[playerID];
  });
});

function generateID() {
  var id = "";

  for (var i = 0; i < 32; i++) {
    id += Math.floor(Math.random() * 36).toString(36);
  }

  return id;
}

function getPlayers() {
  const out = {};

  for (var id in players) {
    if (players.hasOwnProperty(id)) {
      out[id] = { name: players[id].name, id: players[id].id, position: players[id].position }
    }
  }

  return out;
}
