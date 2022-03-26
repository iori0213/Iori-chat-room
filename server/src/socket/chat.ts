import { Server, Socket } from "socket.io";
import { Profile } from "../entity/Profile";

export const chatController = (
  _io: Server,
  socket: Socket,
  _profile: Profile
) => {
  socket.on("msg", () => {
    console.log("msg-evnet");
    // socket.emit("something", () => {});
  });
};
