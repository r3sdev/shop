import { Socket } from 'socket.io';
const app = require('express')();
const server = require('http').createServer(app);
const options = {
  // transports: ['websocket']
};

export const io = require('socket.io')(server, options);
export let socket: Socket;

export default () => {
  io.on('connection', (_socket: Socket) => {
    socket = _socket;

    console.log('New user connected', _socket.id);

    _socket.on('disconnect', () => {
      console.log('User was disconnected', _socket.id);
    });
  });

  function sendHeartbeat() {
    console.log('Sending heartbeat ...')
    setTimeout(sendHeartbeat, 8000);
    io.sockets.emit('ping', { beat: 1 });
  }

  io.sockets.on('connection', function (socket: Socket) {
    socket.on('pong', function (data) {
      console.log('Pong received from client', data);
    });
  });

  setTimeout(sendHeartbeat, 8000);

  server.listen(3000, () => {
    console.log('Notifications server listening on port 3000');
  });
};
