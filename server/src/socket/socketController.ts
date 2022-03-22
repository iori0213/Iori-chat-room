import { Server, Socket } from 'socket.io'

export const socketController = (_io: Server, socket: Socket) => {
  socket.on("some-event", (one, two) => {
    console.log("listen from some-event", {
      one, two
    });
  });
};