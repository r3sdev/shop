import { Socket } from 'socket.io';
const app = require('express')();
const server = require('http').createServer(app);
const options = {};

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

  server.listen(3000, () => {
    console.log('Notifications server listening on port 3000');
  });
};
